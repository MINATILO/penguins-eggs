/**
 * penguins-eggs: focal.ts
 *
 * author: Piero Proietti
 * mail: piero.proietti@gmail.com
 */

import fs = require('fs')
import shx = require('shelljs')
import yaml = require('js-yaml')
import path = require('path')

import { IRemix, IDistro } from '../../../interfaces'

import Fisherman from '../fisherman'


const exec = require('../../../lib/utils').exec

interface IReplaces {
   search: string
   replace: string
}

/**
 *
 */
export class Focal {
   verbose = false

   remix: IRemix

   distro: IDistro

   displaymanager = false

   user_opt: string


   rootTemplate = './../../../../conf/distros/focal/calamares/'

   dirCalamaresModules = '/usr/lib/x86_64-linux-gnu/calamares/modules/'

   dirModules = '/etc/calamares/modules/'

   fisherman = {}


   /**
    * @param remix
    * @param distro
    * @param displaymanager
    * @param verbose
    */
   constructor(remix: IRemix, distro: IDistro, displaymanager: boolean, user_opt: string, verbose = false) {
      this.remix = remix
      this.distro = distro
      this.user_opt = user_opt
      this.verbose = verbose
      this.displaymanager = displaymanager
      if (process.arch === 'ia32') {
         this.dirCalamaresModules = '/usr/lib/calamares/modules/'
      }
      this.rootTemplate = path.resolve(__dirname, this.rootTemplate) + '/'

   }

   /**
    * write setting
    */
   settings() {
      const file = '/etc/calamares/settings.conf'
      shx.cp(`${this.rootTemplate}/settings.conf`, '/etc/calamares')
      shx.sed('-i', '%branding%', this.remix.branding, '/etc/calamares/settings.conf')
   }


   /**
    *
    */
   async modules() {
      const fisherman = new Fisherman(this.dirModules, this.dirCalamaresModules, this.rootTemplate, this.verbose)

      await fisherman.buildModule('partition')
      await fisherman.buildModule('mount')
      await this.moduleUnpackfs()
      await fisherman.buildModule('machineid')
      await fisherman.buildModule('fstab')
      await fisherman.buildModule('locale')
      await fisherman.buildModule('keyboard')
      await fisherman.buildModule('localecfg')
      await fisherman.buildModule('luksbootkeyfile')
      await fisherman.buildModule('users')
      await this.moduleDisplaymanager()
      await fisherman.buildModule('networkcfg')
      await fisherman.buildModule('hwclock')
      await fisherman.contextualprocess('before_bootloader_mkdirs')
      await fisherman.shellprocess('bug-LP#1829805')
      await fisherman.buildModule('initramfs')
      await fisherman.buildModule('grubcfg')
      await fisherman.contextualprocess('before_bootloader')
      await fisherman.buildModule('bootloader')
      await fisherman.contextualprocess('after_bootloader')
      // await fisherman.buildCalamaresPy('automirror') errore in main distrobution
      await fisherman.shellprocess('add386arch')
      await this.modulePackages()
      await this.moduleRemoveuser()
      await fisherman.buildCalamaresModule('remove-link', true)
      // await fisherman.shellprocess('logs') non trova calamares-helper
      await fisherman.buildModule('umount')
      await fisherman.buildModule('finished')
   }


   /**
    * ====================================================================================
    * M O D U L E S   C A L A M A R E S
    * ====================================================================================
    */

   /**
    * Al momento rimane con la vecchia configurazione
    */
   private moduleUnpackfs() {
      const fisherman = new Fisherman(this.dirModules, this.dirCalamaresModules, this.rootTemplate, this.verbose)
      const name = 'unpackfs'
      fisherman.buildModule(name)
      shx.sed('-i', '%source%', this.distro.mountpointSquashFs, `${this.dirModules}/${name}.conf`)
   }

   /**
    * usa i moduli-ts
    */
   private async moduleDisplaymanager() {
      const name = 'displaymanager'
      const fisherman = new Fisherman(this.dirModules, this.dirCalamaresModules, this.rootTemplate, this.verbose)
      const displaymanager = require('./modules-ts/displaymanager').displaymanager
      const file = this.dirModules + name + '.conf'

      if (this.verbose) fisherman.show(name, 'module', this.dirModules)

      const content = displaymanager()
      fs.writeFileSync(file, content, 'utf8')
   }

   /**
    * usa i moduli-ts
    */
   private async modulePackages() {
      const name = 'packages'
      const fisherman = new Fisherman(this.dirModules, this.dirCalamaresModules, this.rootTemplate, this.verbose)
      const packages = require('./modules-ts/packages').packages
      const file = this.dirModules + name + '.conf'
      const content = packages()

      if (this.verbose) fisherman.show(name, 'module', this.dirModules)

      fs.writeFileSync(file, content, 'utf8')
   }

   /**
    * Al momento rimane con la vecchia configurazione
    */
   private async moduleRemoveuser() {
      const name = 'removeuser'
      const fisherman = new Fisherman(this.dirModules, this.dirCalamaresModules, this.rootTemplate, this.verbose)
      const content = yaml.safeDump({ username: this.user_opt })

      if (this.verbose) fisherman.show(name, 'module', this.dirModules)

      const file = this.dirModules + name + '.conf'
      fs.writeFileSync(file, content, 'utf8')
   }
}

