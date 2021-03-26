/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
/* eslint-disable no-console */
/**
 * penguins-eggs-v7 based on Debian live
 * author: Piero Proietti
 * email: piero.proietti@gmail.com
 * license: MIT
 */
import { Command, flags } from '@oclif/command'
import Utils from '../classes/utils'
import Ovary from '../classes/ovary'
import Config from './config'
import chalk = require('chalk')
import { IMyAddons } from '../interfaces'
import fs = require('fs')
import path = require('path')

export default class Produce extends Command {
   static flags = {
      prefix: flags.string({ char: 'p', description: 'prefix' }),
      basename: flags.string({ char: 'b', description: 'basename' }),
      normal: flags.boolean({ char: 'n', description: 'normal compression' }),
      max: flags.boolean({ char: 'm', description: 'max compression' }),
      fast: flags.boolean({ char: 'f', description: 'fast compression' }),
      verbose: flags.boolean({ char: 'v', description: 'verbose' }),
      yolk: flags.boolean({ char: 'y', description: '-y force yolk renew' }),
      script: flags.boolean({ char: 's', description: 'script mode. Generate scripts to manage iso build' }),
      help: flags.help({ char: 'h' }),

      // addon vendor/addon configurazioni dei vendors
      final: flags.boolean({ description: 'final: remove eggs prerequisites, calamares and all it\'s dependencies' }),
      theme: flags.string({ description: 'theme for livecd, calamares branding and partitions' }),
      addons: flags.string({ multiple: true, description: 'addons to be used: adapt, ichoice, pve, rsupport' }),
   }

   static description = 'the system produce an egg: iso image of your system'

   static aliases = ['spawn', 'lay']

   static examples = [
      `$ sudo eggs produce \nproduce an ISO called [hostname]-[arch]-YYYY-MM-DD_HHMM.iso, compressed xz (standard compression).\nIf hostname=ugo and arch=i386 ugo-x86-2020-08-25_1215.iso\n`,
      `$ sudo eggs produce -v\nsame as the previuos, but with more explicative output\n`,
      `$ sudo eggs produce -vf\nsame as the previuos, compression lz4 or zstd (fastest but about 30%\nless compressed than xz)\n`,
      `$ sudo eggs produce -vm\nsame as the previuos, compression xz (normal compression xz)\n`,
      `$ sudo eggs produce -vm\nsame as the previuos, compression xz -Xbcj x86 (max compression, about 10%\nmore compressed)\n`,
      `$ sudo eggs produce -vf --basename leo --theme debian --addons adapt \nproduce an ISO called leo-i386-2020-08-25_1215.iso compression lz4,\nusing Debian theme and link to adapt\n`,
      `$ sudo eggs produce -v --basename leo --theme debian --addons rsupport \nproduce an ISO called leo-i386-2020-08-25_1215.iso compression xz,\nusing Debian theme and link to dwagent\n`,
      `$ sudo eggs produce -v --basename leo --rsupport \nproduce an ISO called leo-i386-2020-08-25_1215.iso compression xz, using eggs\ntheme and link to dwagent\n`,
      `$ sudo eggs produce -vs --basename leo --rsupport \nproduce scripts to build an ISO as the previus example. Scripts can be found\nin /home/eggs/ovarium and you can customize all you need\n` 
   ]

   async run() {
      Utils.titles(this.id + ' ' + this.argv)
      const { flags } = this.parse(Produce)
      if (Utils.isRoot(this.id)) {

         /**
          * ADDONS dei vendors
          * Fino a 3
          */
         let addons = []
         if (flags.addons) {
            let addons = flags.addons // array
            addons.forEach(addon => {
               // se non viene specificato il vendor il default è eggs
               if (addon.indexOf('//') === -1 ) { 
                  addon = 'eggs/'+ addon
               }
               let dirAddon = path.resolve(__dirname, `../../addons/${addon}`)
               if (!fs.existsSync(dirAddon)) {
                  console.log(dirAddon)
                  Utils.warning('addon: ' + chalk.white(addon) + ' not found, terminate!')
                  process.exit()
               }

               let vendorAddon = addon.substring(0, addon.search('/'))
               let nameAddon = addon.substring(addon.search('/') + 1, addon.length)
               if (nameAddon === 'theme') {
                  flags.theme = vendorAddon
               }
            })
         }

         /**
          * composizione dei flag
          */

         let prefix = ''
         if (flags.prefix !== undefined) {
            prefix = flags.prefix
         }

         let basename = '' // se vuoto viene definito da loadsetting (default nome dell'host)
         if (flags.basename !== undefined) {
            basename = flags.basename
         }

         /**
          * Analisi del tipo di compressione del kernel
          * 
          * zgrep CONFIG_KERNEL_ /boot/config-$(uname -r)
          * zgrep CONFIG_OVERLAY_FS /boot/config-$(uname -r)
          */
         let compression = '' // se vuota, compression viene definita da loadsettings, default xz
         if (flags.fast) {
            // compression = 'lz4 -Xhc'
            // compression = 'lz4'
            compression = 'zstd -Xcompression-level 1 -b 262144'
         } else if (flags.normal) {
            compression = 'xz'
         } else if (flags.max) {
            compression = 'xz -Xbcj x86'
         }

         const verbose = flags.verbose

         const scriptOnly = flags.script

         const yolkRenew = flags.yolk

         const final = flags.final


         let theme = 'eggs'
         if (flags.theme !== undefined) {
            theme = flags.theme
         }

         const i = await Config.thatWeNeed(verbose)
         if (i.needApt || i.configurationInstall || i.configurationRefresh || i.distroTemplate) {
            if (await Utils.customConfirm(`Select yes to continue...`)) {
               await Config.install(i, verbose)
            }
         }

         const myAddons = {} as IMyAddons
         if (flags.addons != undefined) {
            if (flags.addons.includes('adapt')){
               myAddons.adapt = true
            }
            if (flags.addons.includes('ichoice')){
               myAddons.ichoice = true
            }
            if (flags.addons.includes('pve')){
               myAddons.pve = true
            }
            if (flags.addons.includes('rsupport')){
               myAddons.rsupport = true
            }
         }

         Utils.titles(this.id + ' ' + this.argv)
         const ovary = new Ovary(prefix, basename, theme, compression)
         Utils.warning('Produce an egg...')
         if (await ovary.fertilization()) {
            await ovary.produce(scriptOnly, yolkRenew, final, myAddons, verbose)
            ovary.finished(scriptOnly)
         }
      }
   }
}

