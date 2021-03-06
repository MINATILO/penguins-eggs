/**
 * penguins-eggs-v8
 * author: Piero Proietti
 * email: piero.proietti@gmail.com
 * license: MIT
 */

import { array2spaced, depCommon, depArch, depVersions, depInit } from '../lib/dependencies'

import fs = require('fs')
import os = require('os')
import path = require('path')
import shx = require('shelljs')
import { IRemix, IDistro } from '../interfaces'

import Utils from './utils'
import Distro from './distro'
import Settings from './settings'
import { execSync } from 'child_process'
import { IConfig } from '../interfaces'

const exec = require('../lib/utils').exec

const config_file = '/etc/penguins-eggs.d/eggs.yaml' as string
const config_tools = '/etc/penguins-eggs.d/tools.yaml' as string

/**
 * Utils: general porpourse utils
 * @remarks all the utilities
 */
export default class Pacman {
   static debs4calamares = ['calamares', 'qml-module-qtquick2', 'qml-module-qtquick-controls']

   distro = {} as IDistro

   remix = {} as IRemix

   settings = {}

   /**
    * 
    */
   constructor() {
      const versionLike = this.distro.versionLike
   }

   /**
    * 
    * @returns 
    */
   static versionLike(): string {
      const remix = {} as IRemix
      const distro = new Distro(remix)
      return distro.versionLike
   }

   /**
    * controlla se è installato xserver-xorg-core
    */
   static async isXorg(): Promise<boolean> {
      return Pacman.packageIsInstalled('xserver-xorg-core') || Pacman.packageIsInstalled('xserver-xorg-core-hwe-18.04')
   }

   /**
    * Constrolla se è installato wayland
    */
   static async isWayland(): Promise<boolean> {
      return Pacman.packageIsInstalled('wayland')
   }

   /**
    * Check if the system is just CLI
    */
   static async isCli(): Promise<boolean> {
      return ! await this.isGui()
   }

   /**
    * Check if the system is GUI able
    */
   static async isGui(): Promise<boolean> {
      return await this.isXorg() || await this.isWayland()
   }

   /**
    * 
    * @returns 
    */
   static guiEnabled(): boolean {
      let enabled = true
      if (process.env.DISPLAY === '') {
         enabled = false
      }
      return enabled
   }


   /**
    * Crea array packages dei pacchetti da installare
    */
   static packages(verbose = false): string[] {
      const packages = depCommon

      const arch = Utils.machineArch()
      depArch.forEach((dep) => {
         if (dep.arch.includes(arch)) {
            packages.push(dep.package)
         }
      })

      const version = Pacman.versionLike()
      depVersions.forEach((dep) => {
         if (dep.versions.includes(version)) {
            packages.push(dep.package)
         }
      })

      return packages

      /**
      * Attualmente escluse, sembrerebbe non servire in mx 
      */
      const initType: string = shx.exec('ps --no-headers -o comm 1', { silent: !verbose }).trim()
      depInit.forEach((dep) => {
         if (dep.init.includes(initType)) {
            packages.push(dep.package)
         }
      })

   }


   /**
    * Restituisce VERO se i prerequisiti sono installati
    */
   static async prerequisitesCheck(verbose = false): Promise<boolean> {
      let installed = true

      // Controllo depCommon e depArch SOLO se il pacchetto è npm
      if (Utils.isNpmPackage()) {
         // controllo depCommon
         depCommon.forEach(dep => {
            if (!this.packageIsInstalled(dep)) {
               installed = false
            }
         })

         if (installed) {
            // controllo depArch
            const arch = Utils.machineArch()

            depArch.forEach((dep) => {
               if (dep.arch.includes(arch)) {
                  if (!this.packageIsInstalled(dep.package)) {
                     installed = false
                  }
               }
            })
         }
      }

      // Controlli da effettuare SEMPRE version e init
      if (installed) {
         const version = Pacman.versionLike()
         depVersions.forEach((dep) => {
            if (dep.versions.includes(version)) {
               if (!this.packageIsInstalled(dep.package)) {
                  installed = false
               }
            }
         })
      }

      return installed

      /**
      * Attualmente escluse, sembrerebbe non servire in mx 
      */
      if (installed) {
         const initType: string = shx.exec('ps --no-headers -o comm 1', { silent: !verbose }).trim()
         depInit.forEach((dep) => {
            if (dep.init.includes(initType)) {
               if (!this.packageIsInstalled(dep.package)) {
                  installed = false
               }
            }
         })
      }
   }

   /**
    *
    */
   static async prerequisitesInstall(verbose = true): Promise<boolean> {
      const echo = Utils.setEcho(verbose)
      const retVal = false
      const versionLike = Pacman.versionLike()

      //apt install --yes ' + array2spaced(packages))
      // console.log(`apt-get install --yes ${array2spaced(this.packages(verbose))}`)
      await exec(`apt-get install --yes ${array2spaced(this.packages(verbose))}`, echo)

      // localization
      if ((versionLike === 'buster') || (versionLike === 'beowulf') || (versionLike === 'bullseye') || (versionLike === 'stretch') || (versionLike === 'jessie')) {
         await exec(`apt-get install --yes --no-install-recommends ${array2spaced(this.packagesLocalisation(verbose))}`, echo)
      }

      if (await Pacman.isCli()) {
         /**
          * live-config-getty-generator
          * 
          * Viene rimosso in naked, altrimenti non funziona il login
          * generando un errore getty. 
          * Sarebbe utile individuarne le ragioni, forse rompe anche sul desktop
          * non permettendo di cambiare terminale e loggarsi
          * 
          * A che serve? 
          */
         await exec(`rm /lib/systemd/system-generators/live-config-getty-generator`)
      }
      return retVal
   }

   /**
    *
    */
   static async prerequisitesRemove(verbose = true): Promise<boolean> {
      const echo = Utils.setEcho(verbose)
      const retVal = false
      const versionLike = Pacman.versionLike()

      await exec(`apt-get purge --yes ${array2spaced(this.excludeInstalled(this.packages(verbose)))}`, echo)

      if ((versionLike === 'buster') || (versionLike === 'beowulf')) {
         await exec(`apt-get purge --yes  ${array2spaced(this.excludeInstalled(this.packagesLocalisation(verbose)))}`, echo)
      }

      await exec('apt-get autoremove --yes', echo)
      return retVal
   }

   /**
    * Torna verso se calamares è installato
    */
   static async calamaresCheck(): Promise<boolean> {
      let installed = true
      for (const i in this.debs4calamares) {
         if (!this.packageIsInstalled(this.debs4calamares[i])) {
            installed = false
            break
         }
      }
      return installed
   }

   /**
    * Controlla se calamares è installabile
    * @returns 
    */
   static calamaresAble(): boolean {
      const remix = {} as IRemix
      const distro = new Distro(remix)

      let result = distro.calamaresAble
      if (process.arch === 'armel' || process.arch === 'arm64') {
         result = false
      }
      return result
   }

   /**
    *
    */
   static async calamaresInstall(verbose = true): Promise<void> {
      const echo = Utils.setEcho(verbose)
      if (this.isGui()) {
         try {
            await exec('apt-get update --yes', echo)
         } catch (e) {
            Utils.error('Pacman.calamaresInstall() apt-get update --yes ' + e.error)
         }
         try {
            await exec(`apt-get install --yes ${array2spaced(this.debs4calamares)}`, echo)
         } catch (e) {
            Utils.error(`Pacman.calamaresInstall() apt-get install --yes ${array2spaced(this.debs4calamares)}` + e.error)
         }

      } else {
         console.log("It's not possible to use calamares in a system without GUI")
      }
   }

   /**
    *
    */
   static async calamaresRemove(verbose = true): Promise<boolean> {
      const echo = Utils.setEcho(verbose)

      const retVal = false
      if (fs.existsSync('/etc/calamares')) {
         await exec('rm /etc/calamares -rf', echo)
      }
      await exec(`apt-get remove --purge --yes calamares`, echo)
      await exec('apt-get autoremove --yes', echo)
      return retVal
   }

   /**
    * Restituisce VERO se i file di configurazione SONO presenti
    */
   static configurationCheck(): boolean {
      const confExists = fs.existsSync(config_file)
      const listExists = fs.existsSync('/usr/local/share/penguins-eggs/exclude.list')
      return (confExists && listExists)
   }

   /**
    * Ritorna vero se machine-id è uguale
    */
   static async configurationMachineNew(verbose = false): Promise<boolean> {
      const settings = new Settings()
      await settings.load()
      const result = Utils.machineId() !== settings.config.machine_id
      if (verbose) {
         if (result) {
            console.log('configurationMachineNew: True')
         }
      }
      return result
   }

   /**
    * 
    */
   static async configurationFresh() {
      const config = {} as IConfig
      config.version = Utils.getPackageVersion()
      config.snapshot_dir = '/home/eggs'
      config.snapshot_prefix = ''
      config.snapshot_excludes = '/usr/local/share/penguins-eggs/exclude.list'
      config.snapshot_basename = 'hostname'
      config.user_opt = 'live'
      config.user_opt_passwd = 'evolution'
      config.root_passwd = 'evolution'
      config.theme = 'eggs'
      config.force_installer = true
      config.make_efi = true
      config.make_md5sum = false
      config.make_isohybrid = true
      config.compression = 'xz'
      config.ssh_pass = true
      config.timezone = 'Europe/Rome'
      config.pmount_fixed = false
      const env = process.env
      if (env.LANG !== undefined) {
         config.locales_default = env.LANG
      } else {
         config.locales_default = 'en_US.UTF-8'
      }
      if (config.locales_default === 'en_US.UTF-8') {
         config.locales = ['en_US.UTF-8']
      } else {
         config.locales = [config.locales_default, 'en_US.UTF-8']
      }

      if (!this.packageIsInstalled('calamares')) {
         config.force_installer = false
         console.log(`Due the lacks of calamares package set force_installer = false`)
      }

      if (!Utils.isUefi()) {
         config.make_efi = false
         console.log('Due the lacks of grub-efi-' + Utils.machineArch() + '-bin package set make_efi = false')
      }

      /**
       * Salvo la configurazione di eggs.yaml
       */
      config.machine_id = Utils.machineId()
      config.vmlinuz = Utils.vmlinuz()
      config.initrd_img = Utils.initrdImg()
      const settings = new Settings()
      await settings.save(config)
   }

   /**
    * Creazione del file di configurazione /etc/penguins-eggs
    */
   static async configurationInstall(links = true, verbose = true): Promise<void> {
      const confRoot = '/etc/penguins-eggs.d'
      if (!fs.existsSync(confRoot)) {
         execSync(`mkdir ${confRoot}`)
      }
      const addons = `${confRoot}/addons`
      const distros = `${confRoot}/distros`
      if (fs.existsSync(addons)) {
         execSync(`rm -rf ${addons}`)
      }
      if (fs.existsSync(distros)) {
         execSync(`rm -rf ${distros}`)
      }
      execSync(`mkdir -p ${distros}`)

      shx.ln('-s', path.resolve(__dirname, '../../addons'), addons)
      shx.cp(path.resolve(__dirname, '../../conf/README.md'), '/etc/penguins-eggs.d/')
      shx.cp(path.resolve(__dirname, '../../conf/tools.yaml'), config_tools)

      // creazione del file delle esclusioni
      shx.mkdir('-p', '/usr/local/share/penguins-eggs/')
      shx.cp(path.resolve(__dirname, '../../conf/exclude.list'), '/usr/local/share/penguins-eggs')

      await Pacman.configurationFresh()
   }

   /**
    * Rimozione dei file di configurazione
    */
   static async configurationRemove(verbose = true): Promise<void> {
      const echo = Utils.setEcho(verbose)

      if (fs.existsSync('/etc/penguins-eggs.d')) {
         await exec('rm /etc/penguins-eggs.d -rf', echo)
      }
      if (fs.existsSync('/usr/local/share/penguins-eggs/exclude.list')) {
         await exec('rm /usr/local/share/penguins-eggs/exclude.list', echo)
      }
      if (fs.existsSync('/etc/calamares')) {
         await exec('rm /etc/calamares -rf', echo)
      }
   }

   /**
    * 
    */
   static distroTemplateCheck(): boolean {
      const versionLike = Pacman.versionLike()
      return fs.existsSync(`/etc/penguins-eggs.d/distros/${versionLike}`)
   }

   /**
    * 
    */
   static async distroTemplateInstall(verbose = false) {
      if (verbose) {
         console.log('installDistroTemplate')
      }
      const rootPen = Utils.rootPenguin()
      const versionLike = Pacman.versionLike()
      if (Utils.isDebPackage()) {
         await Pacman.links4Debs(false, verbose)
      }
      // L = follow links è OK da source, ora il problema è copiare i link da npm o rifarli
      const cmd = `cp -rL ${rootPen}/conf/distros/${versionLike} /etc/penguins-eggs.d/distros`
      execSync(cmd)
   }

   /**
    * 
    * @param verbose 
    */
   static async autocompleteInstall(verbose = false) {
      await exec(`cp ${__dirname}/../../scripts/eggs.bash /etc/bash_completion.d/`)
      if (verbose) {
         console.log('autocomplete installed...')
      }
   }

   /**
   * Installa manPage
   */
   static async manPageInstall(verbose = false) {
      const man1Dir = '/usr/share/man/man1/'
      if (!fs.existsSync(man1Dir)) {
         exec(`mkdir ${man1Dir} -p`)
      }
      const manPage = path.resolve(__dirname, '../../manpages/doc/man/eggs.1.gz')
      if (fs.existsSync(manPage)) {
         exec(`cp ${manPage} ${man1Dir}`)
      }
      if (shx.exec('which mandb', { silent: true }).stdout.trim() !== '') {
         await exec(`mandb > /dev/null`)
         if (verbose) {
            console.log('manPage eggs installed...')
         }

      }
   }

   /**
    * 
    * @param rootPen 
    */
   static async links4Debs(remove = false, verbose = false) {
      if (Utils.isDebPackage() || !Utils.isSources()) {
         const rootPen = Utils.rootPenguin()

         // Debian 10 - Buster 
         const buster = `${rootPen}/conf/distros/buster`

         // Debian 11 - bullseye
         const bullseye = `${rootPen}/conf/distros/bullseye`
         await this.ln(`${buster}/grub`, `${bullseye}/grub`, remove, verbose)
         await this.ln(`${buster}/isolinux`, `${bullseye}/isolinux`, remove, verbose)
         await this.ln(`${buster}/locales`, `${bullseye}/locales`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/remove-link`, `${bullseye}/calamares/calamares-modules/remove-link`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/sources-yolk`, `${bullseye}/calamares/calamares-modules/sources-yolk`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/sources-yolk-unmount`, `${bullseye}/calamares/calamares-modules/sources-yolk-unmount`, remove, verbose)
         await this.ln(`${buster}/calamares/modules`, `${bullseye}/calamares/modules`, remove, verbose)

         // Debian 8 - jessie
         const jessie = `${rootPen}/conf/distros/jessie`
         await this.ln(`${buster}/grub`, `${jessie}/grub`, remove, verbose)
         await this.ln(`${buster}/isolinux`, `${jessie}/isolinux`, remove, verbose)
         await this.ln(`${buster}/locales`, `${jessie}/locales`, remove, verbose)

         // Debian 9 - stretch
         const stretch = `${rootPen}/conf/distros/stretch`
         await this.ln(`${buster}/grub`, `${stretch}/grub`, remove, verbose)
         await this.ln(`${buster}/isolinux`, `${stretch}/isolinux`, remove, verbose)
         await this.ln(`${buster}/locales`, `${stretch}/locales`, remove, verbose)
         await this.ln(`${jessie}/krill`, `${stretch}/krill`, remove, verbose)

         // Devuan beowulf
         const beowulf = `${rootPen}/conf/distros/beowulf`
         await this.ln(`${buster}/grub`, `${beowulf}/grub`, remove, verbose)
         await this.ln(`${buster}/isolinux`, `${beowulf}/isolinux`, remove, verbose)
         await this.ln(`${buster}/locales`, `${beowulf}/locales`, remove, verbose)
         await this.ln(`${buster}/calamares`, `${beowulf}/calamares`, remove, verbose)

         // Ubuntu 20.04 - focal
         const focal = `${rootPen}/conf/distros/focal`
         await this.ln(`${buster}/grub/loopback.cfg`, `${focal}/grub/loopback.cfg`, remove, verbose)
         await this.ln(`${buster}/grub/theme.cfg`, `${focal}/grub/theme.cfg`, remove, verbose)
         await this.ln(`${buster}/isolinux/isolinux.template.cfg`, `${focal}/isolinux/isolinux.template.cfg`, remove, verbose)
         await this.ln(`${buster}/isolinux/stdmenu.template.cfg`, `${focal}/isolinux/stdmenu.template.cfg`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/remove-link`, `${focal}/calamares/calamares-modules/remove-link`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/sources-yolk`, `${focal}/calamares/calamares-modules/sources-yolk`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/sources-yolk-unmount`, `${focal}/calamares/calamares-modules/sources-yolk-unmount`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/packages.yml`, `${focal}/calamares/modules/packages.yml`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/removeuser.yml`, `${focal}/calamares/modules/removeuser.yml`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/displaymanager.yml`, `${focal}/calamares/modules/displaymanager.yml`, remove, verbose)
         // Patch a colori
         // await this.ln(`${buster}/calamares/calamares-modules/bootloader-config`, `${focal}/calamares/calamares-modules/bootloader-config`, remove, verbose)

         // Ubuntu 18.04  - bionic
         const bionic = `${rootPen}/conf/distros/bionic`
         await this.ln(`${focal}/grub`, `${bionic}/grub`, remove, verbose)
         await this.ln(`${focal}/isolinux`, `${bionic}/isolinux`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/remove-link`, `${bionic}/calamares/calamares-modules/remove-link`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/sources-yolk`, `${bionic}/calamares/calamares-modules/sources-yolk`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/sources-yolk-unmount`, `${bionic}/calamares/calamares-modules/sources-yolk-unmount`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/packages.yml`, `${bionic}/calamares/modules/packages.yml`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/removeuser.yml`, `${bionic}/calamares/modules/removeuser.yml`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/unpackfs.yml`, `${bionic}/calamares/modules/unpackfs.yml`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/displaymanager.yml`, `${bionic}/calamares/modules/displaymanager.yml`, remove, verbose)

         // Ubuntu 20.10 groovy
         const groovy = `${rootPen}/conf/distros/groovy`
         await this.ln(`${focal}/calamares`, `${groovy}/calamares`, remove, verbose)
         await this.ln(`${focal}/grub`, `${groovy}/grub`, remove, verbose)
         await this.ln(`${focal}/isolinux`, `${groovy}/isolinux`, remove, verbose)
         await this.ln(`${focal}/locale.gen.template`, `${groovy}/locale.gen.template`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/displaymanager.yml`, `${groovy}/calamares/modules/displaymanager.yml`, remove, verbose)

         // Ubuntu 21.04 hirsute
         const hirsute = `${rootPen}/conf/distros/hirsute`
         await this.ln(`${focal}/calamares`, `${hirsute}/calamares`, remove, verbose)
         await this.ln(`${focal}/grub`, `${hirsute}/grub`, remove, verbose)
         await this.ln(`${focal}/isolinux`, `${hirsute}/isolinux`, remove, verbose)
         await this.ln(`${focal}/locale.gen.template`, `${hirsute}/locale.gen.template`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/displaymanager.yml`, `${hirsute}/calamares/modules/displaymanager.yml`, remove, verbose)
      }
   }

   /**
    * 
    * @param mode 
    * @param src 
    * @param dest 
    * @param verbose 
    */
   static async ln(src: string, dest: string, remove = false, verbose = false) {
      const rel = path.relative(dest, src).substring(3)

      // Cancella il symlink se esiste
      if (fs.existsSync(dest)) {
         if (verbose) {
            console.log(`remove ${dest}`)
         }
         fs.unlinkSync(dest)
      }

      if (!remove) {
         const dirname = path.dirname(dest)
         const basename = path.basename(dest)

         process.chdir(dirname)
         if (verbose) {
            console.log(`cd ${dirname}`)
            console.log(`ln -s ${rel} ${basename}\n`)
         }
         fs.symlinkSync(rel, basename)
      }
   }


   /**
   * restuisce VERO se il pacchetto è installato
   * @param debPackage
   */
   static packageIsInstalled(debPackage: string): boolean {
      let installed = false
      const cmd = `/usr/bin/dpkg -s ${debPackage} | grep Status:`
      const stdout = shx.exec(cmd, { silent: true }).stdout.trim()
      if (stdout === 'Status: install ok installed') {
         installed = true
      }
      //console.log(debPackage + ' ' + installed)
      return installed
   }


   /**
   * restuisce VERO se il pacchetto è installato
   * @param debPackage
   */
   static async packageAptAvailable(debPackage: string): Promise<boolean> {
      let disponible = false
      const cmd = `apt-cache show ${debPackage} | grep Package:`
      const test = `Package: ${debPackage}`
      const stdout = shx.exec(cmd, { silent: true }).stdout.trim()
      // console.log('===================================')
      // console.log('[' + stdout + ']')
      // console.log('[' + test + ']')
      // console.log('===================================')
      if (stdout === test) {
         disponible = true
      }
      return disponible
   }


   static async packageAptLast(debPackage: string): Promise<string> {
      let version = ''
      const cmd = `apt-cache show ${debPackage} | grep Version:`
      const stdout = shx.exec(cmd, { silent: true }).stdout.trim()
      version = stdout.substring(9)
      // console.log('===================================')
      // console.log('[' + version + ']')
      // console.log('===================================')
      return version
   }

   static async packageNpmLast(packageNpm = 'penguins-eggs'): Promise<string> {
      return shx.exec('npm show ' + packageNpm + ' version', { silent: true }).stdout.trim()
   }

   /**
    * 
    * @param cmd 
    */
   static async commandIsInstalled(cmd: string): Promise<boolean> {
      let installed = false
      const stdout = shx.exec(`command -v ${cmd}`, { silent: true }).stdout.trim()
      if (stdout !== '') {
         installed = true
      } else {
         Utils.warning(`${cmd} is not in your search path or is not installed!`)
      }

      return installed
   }

   /**
    * Install the package debPackage
    * @param debPackage {string} Pacchetto Debian da installare
    * @returns {boolean} True if success
    */
   static async packageInstall(debPackage: string): Promise<boolean> {
      let retVal = false

      if (shx.exec(`/usr/bin/apt-get install -y ${debPackage}`, { silent: true }) === '0') {
         retVal = true
      }
      return retVal
   }

   /**
    *
    * @param packages array packages
    */
   static excludeInstalled(packages: string[]): string[] {

      let notInstalled: string[] = []

      for (const i in packages) {
         if (!Pacman.packageIsInstalled(packages[i])) {
            notInstalled.push(packages[i])
         }
      }
      return notInstalled
   }

   /**
    * @param remove 
    * @param verbose 
    * 
    * Va solo a runtime, l'idea era di localizzare per naked
    */
   static packagesLocalisation(remove = false, verbose = false) {
      const versionLike = Pacman.versionLike()
      const packages = []

      const settings = new Settings()
      settings.load()

      const locales: string[] = settings.config.locales

      if ((versionLike === 'jessie') ||
         (versionLike === 'stretch') ||
         (versionLike === 'buster') ||
         versionLike === 'bullseye' ||
         (versionLike === 'beowulf')) {

         for (let i = 0; i < locales.length; i++) {
            if (locales[i] === process.env.LANG) {
               continue
            }
            if (locales[i] === `it_IT.UTF-8`) {
               packages.push('task-italian')
            } else if (locales[i] === `en_US.UTF-8`) {
               packages.push('task-english')
            } else if (locales[i] === `es_PE.UTF-8`) {
               packages.push('task-spanish')
            } else if (locales[i] === `pt_BR.UTF-8`) {
               packages.push('task-brazilian-portuguese')
            } else if (locales[i] === `fr_FR.UTF-8`) {
               packages.push('task-french')
            } else if (locales[i] === `de_DE.UTF-8`) {
               packages.push('task-german')
            } else if (locales[i] === `pl_PL.UTF-8`) {
               packages.push('task-polish')
            } else if (locales[i] === `de_DE.UTF-8`) {
               packages.push('task-russian')
            }
         }
         packages.push('live-task-localisation')
      }

      return packages
   }
}
