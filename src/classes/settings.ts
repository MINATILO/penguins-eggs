/* eslint-disable valid-jsdoc */
/* eslint-disable no-console */

/**
 * penguins-eggs: ovary.ts VERSIONE DEBIAN-LIVE
 * author: Piero Proietti
 * mail: piero.proietti@gmail.com
 *
 */

// packages
import fs = require('fs')
import os = require('os')
import yaml = require('js-yaml')
import shx = require('shelljs')
import pjson = require('pjson')
import chalk = require('chalk')

// interfaces
import { IRemix, IDistro, IApp, IWorkDir } from '../interfaces'

// libraries

// classes
import Utils from './utils'
import Incubator from './incubation/incubator'
import Distro from './distro'
import Pacman from './pacman'

import { IConfig } from '../interfaces/'
import { O_NOATIME } from 'constants'


const config_file = '/etc/penguins-eggs.d/eggs.yaml' as string


/**
 * Setting
 */
export default class Settings {

   app = {} as IApp

   config = {} as IConfig

   remix = {} as IRemix

   work_dir = {} as IWorkDir

   distro = {} as IDistro

   incubator = {} as Incubator

   i686 = false

   isLive = false

   efi_work = ''

   kernel_image = '' as string

   initrd_image = '' as string

   vmlinuz = ''

   initrdImg = ''

   session_excludes = ''

   isoFilename = '' // resulting name of the iso


   constructor(compression = '') {

      this.config.compression = compression

      this.app.author = 'Piero Proietti'
      this.app.homepage = 'https://github.com/pieroproietti/penguins-eggs'
      this.app.mail = 'piero.proietti@gmail.com'
      this.app.name = pjson.name as string
      this.app.version = pjson.version
      this.isLive = Utils.isLive()
      this.i686 = Utils.isi686()
      this.distro = new Distro(this.remix)
   }


   /**
    * 
    * @param config 
    */
   async save(config: IConfig) {
      fs.writeFileSync(config_file, yaml.dump(config), 'utf-8')
   }

   /**
    * Load configuration from config_file
    * @returns {boolean} Success
    */
   async load(): Promise<boolean> {
      let foundSettings = true

      if (!fs.existsSync(config_file)) {
         console.log(`cannot find configuration file ${config_file},`)
         console.log(`please generate it with: sudo eggs config`)
         process.exit(1)
      }

      this.config = yaml.load(fs.readFileSync(config_file, 'utf-8')) as IConfig

      this.session_excludes = ''
      if (!this.config.snapshot_dir.endsWith('/')) {
         this.config.snapshot_dir += '/'
      }
      this.work_dir.path = this.config.snapshot_dir + 'ovarium/'
      this.work_dir.lowerdir = this.work_dir.path + '.overlay/lowerdir'
      this.work_dir.upperdir = this.work_dir.path + '.overlay/upperdir'
      this.work_dir.workdir = this.work_dir.path + '.overlay/workdir'
      this.work_dir.merged = this.work_dir.path + 'filesystem.squashfs'

      this.efi_work = this.work_dir.path + 'efi/'
      this.work_dir.pathIso = this.work_dir.path + 'iso'

      if (this.config.snapshot_basename === 'hostname') {
         this.config.snapshot_basename = os.hostname()
      }
      if (this.config.make_efi) {
         if (!Utils.isUefi()) {
            Utils.error('You choose to create an UEFI image, but miss to install grub-efi-amd64 package.')
            Utils.error('Please install it before to create an UEFI image:')
            Utils.warning('sudo apt install grub-efi-amd64')
            Utils.error('or edit /etc/penguins-eggs.d/eggs.yaml and set the valuer of make_efi = false')
            this.config.make_efi = false
         }
      }

      this.kernel_image = this.config.vmlinuz
      this.initrd_image = this.config.initrd_imd
      this.vmlinuz = this.kernel_image.substr(this.kernel_image.lastIndexOf('/'))
      this.initrdImg = this.initrd_image.substr(this.initrd_image.lastIndexOf('/'))


      /**
       * Use the login name set in the config file. If not set, use the primary
       * user's name. If the name is not "user" then add boot option. ALso use
       * the same username for cleaning geany history.
       */

      if (this.config.user_opt === undefined || this.config.user_opt === '') {
         // this.user_opt = shx.exec('awk -F":" \'/1000:1000/ { print $1 }\' /etc/passwd', { silent: true }).stdout.trim()
         if (this.config.user_opt === '') {
            this.config.user_opt = 'live'
         }
      }
      if (this.config.user_opt_passwd === '') {
         this.config.user_opt_passwd = 'evolution'
      }

      if (this.config.root_passwd === '') {
         this.config.root_passwd = 'evolution'
      }

      if (this.config.timezone === undefined || this.config.timezone === '') {
         this.config.timezone = shx.exec('cat /etc/timezone', { silent: true }).stdout.trim()
      }


      return foundSettings
   }

   /**
    * showSettings
    */
   async show() {
      console.log(`application_name:  ${this.app.name} ${this.app.version}`)
      // console.log(`config_file:       ${config_file}`)
      console.log(`snapshot_dir:      ${this.config.snapshot_dir}`)
      if (this.config.snapshot_prefix===''){
         console.log('snapshot_prefix:   ' + chalk.bgYellow('no value') + ' run ' + chalk.cyan('sudo eggs dad') + ' or edit ' + chalk.cyan('/etc/penguins-eggs.d/eggs.yaml'))
      } else {
         console.log('snapshot_prefix:   ' + chalk.green (this.config.snapshot_prefix))
      }
      console.log(`snapshot_basename: ${this.config.snapshot_basename}`)
      // console.log(`snapshot_excludes: ${this.config.snapshot_excludes}`)
      if (fs.existsSync(this.kernel_image)){
         console.log(`kernel_image:      ` + chalk.green(this.kernel_image))
      } else {
         console.log('kernel_image:      ' + chalk.red(this.kernel_image) + ' not found! Please edit /etc/penguins-eggs.d/eggs.yaml')
      }
      if (fs.existsSync(this.initrd_image)) {
         console.log('initrd_image:      ' + chalk.green(this.initrd_image))
      } else {
         console.log('initrd_image:      ' + chalk.red(this.initrd_image) + ' not found! Please edit /etc/penguins-eggs.d/eggs.yaml')
      }
      console.log(`work_dir:          ${this.work_dir.path}`)
      // console.log(`efi_work:          ${this.efi_work}`)
      // console.log(`make_efi:          ${this.config.make_efi}`)
      // console.log(`make_md5sum:       ${this.config.make_md5sum}`)
      // console.log(`make_isohybrid:    ${this.config.make_isohybrid}`)
      console.log(`compression:       ${this.config.compression}`)
      // console.log(`force_installer:   ${this.config.force_installer}`)
      console.log(`user_opt:          ${this.config.user_opt}`)
      console.log(`locales:           ${this.config.locales}`)
      console.log(`locale default:    ${this.config.locales_default}`)
      //console.log(`ssh_pass:          ${this.config.ssh_pass}`)
      if (this.config.make_efi) {
         if (!Utils.isUefi()) {
            Utils.error('You choose to create an UEFI image, but miss to install grub-efi-amd64 package.')
            Utils.error('Please install it before to create an UEFI image:')
            Utils.warning('sudo apt install grub-efi-amd64')
            this.config.make_efi = false
         } else if (!Pacman.packageIsInstalled('dosfstools')) {
            Utils.error('You choose to create an UEFI image, but miss to install dosfstools package.')
            Utils.error('Please install it before to create an UEFI image:')
            Utils.warning('sudo apt install dosfstools')
            this.config.make_efi = false
         }
      }
   }

   /**
    * Calculate and show free space on the disk
    * @returns {void}
    */
   async listFreeSpace(): Promise<void> {
      const path: string = this.config.snapshot_dir // convert to absolute path
      if (!fs.existsSync(this.config.snapshot_dir)) {
         fs.mkdirSync(this.config.snapshot_dir)
      }
      /** Lo spazio usato da SquashFS non è stimabile da live
       * errore buffer troppo piccolo
       */
      const gb = 1048576
      let spaceAvailable = 0
      if (!Utils.isLive()) {
         console.log(`Disk used space: ${Math.round((Utils.getUsedSpace() / gb) * 10) / 10} GB`)
      }

      spaceAvailable = Number(
         shx
            .exec(`df "${path}" | /usr/bin/awk 'NR==2 {print $4}'`, {
               silent: true
            })
            .stdout.trim()
      )
      console.log(`Space available: ${Math.round((spaceAvailable / gb) * 10) / 10} GB`)
      console.log(`There are ${Utils.getSnapshotCount(this.config.snapshot_dir)} snapshots taking ${Math.round((Utils.getSnapshotSize() / gb) * 10) / 10} GB of disk space.`)
      console.log()

      if (spaceAvailable > gb * 3) {
         console.log(chalk.cyanBright('The free space should  be sufficient to hold the'))
         console.log(chalk.cyanBright('compressed data from the system'))
      } else {
         console.log(chalk.redBright('The free space should be insufficient') + '.')
         console.log()
         console.log('If necessary, you can create more available space')
         console.log('by removing previous  snapshots and saved copies:')
      }
   }

   /**
    *
    * @param basename
    * @param theme
    */
   async loadRemix(basename = '', theme = '') {
      this.remix.versionNumber = Utils.getPackageVersion()
      this.remix.kernel = Utils.kernerlVersion()

      if (theme === '') {
         this.remix.branding = 'eggs'
      } else {
         this.remix.branding = theme
      }
      this.remix.name = this.config.snapshot_basename
      let name = this.config.snapshot_prefix + this.config.snapshot_basename
      name = name.replace(/-/g, ' ').replace('egg of ', '')
      this.remix.fullname = name
      this.remix.versionName = name.toUpperCase()
   }
}
