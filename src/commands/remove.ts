/**
 * penguins-eggs-v7 based on Debian live
 * author: Piero Proietti
 * email: piero.proietti@gmail.com
 * license: MIT
 */
import { Command, flags } from '@oclif/command'
import Utils from '../classes/utils'
import Pacman from '../classes/pacman'
import { IInstall } from '../interfaces'

import chalk = require('chalk')
import { execSync } from 'child_process'
/**
 *
 */
export default class Remove extends Command {
   static description = 'remove eggs, eggs configurations, prerequisites, calamares, calamares configurations'

   static examples = [
      `$ sudo eggs remove \nremove eggs, eggs configurations\n`,
      `$ sudo eggs remove --prerequisites \nremove packages prerequisites, calamares, calamares configurations\n`,
      `$ sudo eggs remove --all\nremove eggs, eggs configurations, prerequisites, calamares, calamares configurations`]

   static aliases = ['sterilize']

   static flags = {
      help: flags.help({ char: 'h' }),
      prerequisites: flags.boolean({ char: 'p', description: 'remove prerequisites' }),
      all: flags.boolean({ char: 'a', description: 'remove all' }),
      verbose: flags.boolean({ char: 'v', description: 'verbose' })
   }

   async run() {
      Utils.titles(this.id + ' ' + this.argv)

      const { flags } = this.parse(Remove)
      let verbose = false
      if (flags.verbose) {
         verbose = true
      }

      if (Utils.isRoot()) {
         if (flags.all) {
            await Remove.all(verbose)
            // Rimuove tutto
         } else if (flags.prerequisites) {
            await Remove.prerequisites(verbose)
         } else {
            await Remove.eggs(verbose)
         }
      }
   }


   /**
    * rimuove eggs e configuration
    */
   static async eggs(verbose=false){
      Utils.titles('remove eggs, eggs configuration')
      if (await Utils.customConfirm(`Select yes to continue...`)) {
         const remove=true
         await Pacman.linksManage(remove, verbose)

         if (Utils.isDebPackage() || !Utils.isSources()) {
            if (Utils.isDebPackage()) {
               execSync('apt purge eggs')
            } else {
               execSync('npm remove penguins-eggs -g')
            }
         }
         await Pacman.configurationRemove()
      }
   }

   static async all(verbose=false){
      await Remove.prerequisites(verbose)
      await Remove.eggs(verbose)
   }

   /**
    * 
    */
   static async prerequisites(verbose=false) {
      // Remove prerequisites
      if (await Pacman.prerequisitesCheck()) {
         const i = await Remove.thatWeRemove(verbose)
         Utils.warning('Be sure! It\'s just a series of apt purge. You can follows them using flag --verbose')
         if (await Utils.customConfirm(`Select yes to continue...`)) {
            if (i.calamares) {
               Utils.warning('Removing calamares...')
               await Pacman.calamaresRemove(verbose)
            }

            if (i.prerequisites) {
               Utils.warning('Removing prerequisites...')
               await Pacman.prerequisitesRemove(verbose)
            }

            if (i.configuration) {
               Utils.warning('Removing configuration files...')
               await Pacman.configurationRemove(verbose)
            }
         }
      }
   }
   /**
 * 
 * @param links
 * @param verbose 
 */
   static async thatWeRemove(verbose = false): Promise<IInstall> {
      Utils.titles('That will be removed')

      const i = {} as IInstall

      i.calamares = await Pacman.calamaresCheck()
      i.prerequisites = await Pacman.prerequisitesCheck()
      i.configuration = await Pacman.configurationCheck()

      if (i.calamares || i.prerequisites || i.configuration) {
         Utils.warning(`Removing prerequisites.\nEggs will execute the following tasks:`)

         if (i.calamares) {
            console.log('- remove calamares')
            const packages = Pacman.debs4calamares
            console.log(chalk.yellow('  apt purge --yes ' + Pacman.debs2line(packages) + '\n'))
         }

         if (i.prerequisites) {
            console.log('- remove prerequisites')
            const packages = Pacman.packages(verbose)
            console.log(chalk.yellow('  apt purge --yes ' + Pacman.debs2line(packages)))
            const packagesLocalisation = Pacman.packagesLocalisation()
            if (packagesLocalisation.length > 0) {
               console.log(chalk.yellow('  apt purge --yes live-task-localisation ' + Pacman.debs2line(packagesLocalisation)) + '\n')
            } else {
               console.log()
            }
         }

         if (i.configuration) {
            console.log('- remove configuration\n')
         }
      }
      return i
   }

}