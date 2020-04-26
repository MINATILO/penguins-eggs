/**
 * penguins-eggs-v7
 * author: Piero Proietti
 * email: piero.proietti@gmail.com
 * license: MIT
 */

import fs = require('fs')
import path = require('path')
import shx = require('shelljs')

import Utils from './utils'

const exec = require('../lib/utils').exec

/**
 * Utils: general porpourse utils
 * @remarks all the utilities
 */
export default class Pacman {
  static debs4eggs = ['isolinux', 'live-boot', 'live-boot-initramfs-tools', 'live-config-systemd', 'squashfs-tools', 'xorriso', 'xterm', 'whois']
  static debs4calamares = ['calamares', 'qml-module-qtquick2', 'qml-module-qtquick-controls']


  /**
   * controlla se Xserver è installato
   */
  static isXInstalled(): boolean {
    return Pacman.packageIsInstalled('xserver-xorg-core')
  }

  /**
   * restuisce VERO se il pacchetto è installato
   * @param debPackage 
   */
  static packageIsInstalled(debPackage: string): boolean {
    let isInstalled = false
    const cmd = `/usr/bin/dpkg -s ${debPackage} | grep Status`
    const stdout = shx.exec(cmd, { silent: true }).stdout.trim()

    if (stdout === 'Status: install ok installed') {
      isInstalled = true
    }
    return isInstalled
  }

  /**
     * Install the package debPackage
     * @param debPackage {string} Pacchetto Debian da installare
     * @returns {boolean} True if success
     */
  static packageInstall(debPackage: string): boolean {
    let retVal = false

    if (shx.exec('/usr/bin/apt-get update', { silent: true }) === '0') {
      if (shx.exec(`/usr/bin/apt-get install -y ${debPackage}`, { silent: true }) === '0') {
        retVal = true
      }
    }
    return retVal
  }


  /**
   * 
   * @param packages array packages
   */
  static debs2line(packages: string[]): string {
    let line = ''
    for (let i in packages) {
      line += packages[i] + ' '
    }
    return line
  }

  /**
   * Restituisce VERO se i prerequisiti sono installati
   */
  static prerequisitesEggsCheck(): boolean {
    let retVal = true

    for (let i in this.debs4eggs) {
      if (!Pacman.packageIsInstalled(this.debs4eggs[i])) {
        retVal = false
        break
      }
    }
    return retVal
  }

  /**
   * 
   */
  static async prerequisitesEggsInstall(verbose = true): Promise<boolean> {
    let echo = Utils.setEcho(verbose)
    let retVal = false

    await exec('apt-get update --yes')
    await exec(`apt-get install --yes ${Pacman.debs2line(Pacman.debs4eggs)}`, echo)
    return retVal
  }

  /**
   * 
   */
  static async prerequisitesEggsRemove(verbose = true): Promise<boolean> {
    let echo = Utils.setEcho(verbose)
    let retVal = false
    await exec(`apt-get remove --purge --yes ${Pacman.debs2line(Pacman.debs4eggs)}`, echo)
    await exec('apt-get autoremove --yes')
    return retVal
  }


  /**
   * 
   */
  static async prerequisitesCalamaresCheck(): Promise<boolean> {
    let retVal = true
    for (let i in this.debs4calamares) {
      if (!await Pacman.packageIsInstalled(this.debs4calamares[i])) {
        retVal = false
        break
      }
    }
    return retVal
  }

  /**
 * 
 */
  static async prerequisitesCalamaresInstall(verbose = true): Promise<void> {
    let echo = Utils.setEcho(verbose)
    if (Pacman.isXInstalled()) {
      await exec('apt-get update --yes', echo)
      await exec(`apt-get install --yes ${Pacman.debs2line(Pacman.debs4calamares)}`, echo)
      await Pacman.clean(verbose)
    } else {
      console.log('It\'s not possible to use calamares in a system without GUI' )
    }
  }

  /**
  * 
  */
  static async prerequisitesCalamaresRemove(verbose = true): Promise<boolean> {
    let echo = Utils.setEcho(verbose)

    let retVal = false
    await exec('rm /etc/calamares -rf', echo)
    await exec(`apt-get remove --purge --yes ${Pacman.debs2line(Pacman.debs4calamares)}`, echo)
    await exec('apt-get autoremove --yes', echo)
    return retVal
  }

  /**
   * Restutuisce VERO se i file di configurazione sono presenti
   */
  static configurationCheck(): boolean {
    let conf = false
    let list = false
    let result = false
    conf = fs.existsSync('/etc/penguins-eggs.conf')
    list = fs.existsSync('/usr/local/share/excludes/penguins-eggs-exclude.list')
    result = conf && list
    return result
  }

  /**
   * 
   */
  static async configurationInstall(verbose = true): Promise<void> {
    shx.cp(path.resolve(__dirname, '../../conf/penguins-eggs.conf'), '/etc')
    shx.mkdir('-p', '/usr/local/share/excludes/')
    shx.cp(path.resolve(__dirname, '../../conf/penguins-eggs-exclude.list'), '/usr/local/share/excludes')
  }

  /**
   * 
   */
  static async configurationRemove(verbose = true) : Promise<void> {
    let echo = Utils.setEcho(verbose)
    await exec('rm /etc/penguins-eggs.conf', echo)
    await exec('rm /etc/penguins-eggs.conf?', echo)
    await exec('rm /usr/local/share/excludes/penguins-eggs-exclude.list', echo)
    await exec('rm /usr/local/share/excludes/penguins-eggs-exclude.list?', echo)
  }
  /**
   * 
   */
  static async clean(verbose = true): Promise<void> {
    let echo = Utils.setEcho(verbose)
    await exec('apt-get clean', echo)
    await exec('apt-get autoclean', echo)
  }
}