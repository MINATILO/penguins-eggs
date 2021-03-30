/**
 * penguins-eggs: devuan.ts
 *
 * author: Piero Proietti
 * mail: piero.proietti@gmail.com
 * al momento escludo solo machineid
 */

import shx = require('shelljs')
import path = require('path')

import { IRemix, IDistro } from '../../../interfaces'

import Fisherman from '../fisherman'

const exec = require('../../../lib/utils').exec

/**
 *
 */
export class Beowulf {
   verbose = false

   remix: IRemix

   distro: IDistro

   release = false

   user_opt: string

   rootTemplate = './../../../../conf/distros/beowulf/calamares/'

   dirCalamaresModules = '/usr/lib/x86_64-linux-gnu/calamares/modules/'

   dirModules = '/etc/calamares/modules/'

   /**
    * @param remix
    * @param distro
    * @param displaymanager
    * @param verbose
    */
   constructor(remix: IRemix, distro: IDistro, release: boolean, user_opt: string, verbose = false) {
      this.remix = remix
      this.distro = distro
      this.user_opt = user_opt
      this.verbose = verbose
      this.release = release
      if (process.arch === 'ia32') {
         this.dirCalamaresModules = '/usr/lib/i386-linux-gnu/calamares/modules/'
      }
      this.rootTemplate = `./../../../../conf/distros/${this.distro.versionLike}/calamares/`
      this.rootTemplate = path.resolve(__dirname, this.rootTemplate) + '/'
   }

   /**
    *
    */
   async create() {
      const fisherman = new Fisherman(this.distro, this.dirModules, this.dirCalamaresModules, this.rootTemplate, this.verbose)

      await fisherman.settings(this.remix.branding)

      await fisherman.buildModule('partition', this.remix.branding)
      await fisherman.buildModule('mount')
      await fisherman.moduleUnpackfs() //
      await fisherman.buildCalamaresModule('sources-yolk')
      await fisherman.buildModule('fstab')
      await fisherman.buildModule('locale')
      await fisherman.buildModule('keyboard')
      await fisherman.buildModule('localecfg')
      await fisherman.buildModule('users')
      await fisherman.moduleDisplaymanager() //
      await fisherman.buildModule('networkcfg')
      await fisherman.buildModule('hwclock')
      // await fisherman.buildCalamaresModule('create-tmp')
      await fisherman.buildCalamaresModule('bootloader-config')
      await fisherman.buildModule('grubcf')
      await fisherman.buildModule('bootloader')
      await fisherman.modulePackages(this.distro, this.release) //
      await fisherman.buildModule('luksbootkeyfile')
      await fisherman.buildModule('plymouthcfg')
      await fisherman.buildModule('initramfscfg')
      await fisherman.buildModule('initramfs')
      await fisherman.moduleRemoveuser(this.user_opt) //
      await fisherman.buildCalamaresModule('sources-yolk-unmount', false)
      await fisherman.buildModule('umount')
      await fisherman.buildCalamaresModule('remove-link')
      await fisherman.moduleFinished()
   }
}