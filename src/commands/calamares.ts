/**
 * penguins-eggs-v7 based on Debian live
 * author: Piero Proietti
 * email: piero.proietti@gmail.com
 * license: MIT
 */
import { Command, flags } from '@oclif/command'
import Utils from '../classes/utils'
import Settings from '../classes/settings'
import Incubator from '../classes/incubation/incubator'
import Pacman from '../classes/pacman'
import { IRemix } from '../interfaces'

export default class Calamares extends Command {
   static description = 'calamares or install or configure it'

   remix = {} as IRemix

   incubator = {} as Incubator

   settings = {} as Settings

   static flags = {
      help: flags.help({ char: 'h' }),
      verbose: flags.boolean({ char: 'v' }),
      install: flags.boolean({ char: 'i', description: 'install calamares and it\'s dependencies' }),
      final: flags.boolean({ char: 'f', description: 'final: remove eggs prerequisites, calamares and all it\'s dependencies' }),
      theme: flags.string({ description: 'theme/branding for eggs and calamares' })
   }

   static examples = [`~$ sudo eggs calamares \ncreate/renew calamares configuration\'s files\n`, `~$ sudo eggs calamares -i \ninstall calamares and create it\'s configuration\'s files\n`]

   async run() {
      Utils.titles(this.id + ' ' + this.argv)

      const { flags } = this.parse(Calamares)
      let verbose = false
      if (flags.verbose) {
         verbose = true
      }

      let install = false
      if (flags.install) {
         install = true
      }

      let final = false
      if (flags.final) {
         final = true
      }

      let theme = 'eggs'
      if (flags.theme !== undefined) {
         theme = flags.theme
      }
      console.log(`theme: ${theme}`)

      if (Utils.isRoot(this.id)) {
         if (Pacman.isGui()) {
            if (await Utils.customConfirm(`Select yes to continue...`)) {
               if (install) {
                  Utils.warning('Installing calamares prerequisites...')
                  await Pacman.calamaresInstall()
               }

               Utils.warning('Configuring calamares...')
               this.settings = new Settings()
               if (await this.settings.load()) {
                  await this.settings.loadRemix(this.settings.config.snapshot_basename, theme)
                  this.incubator = new Incubator(this.settings.remix, this.settings.distro, this.settings.config.user_opt, verbose)
                  await this.incubator.config(final)
               }
            }
         } else {
            console.log(`You cannot use calamares installer without X system!`)
         }
      }
   }
}
