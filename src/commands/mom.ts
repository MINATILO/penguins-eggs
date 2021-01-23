/**
 * penguins-eggs-v8 
 * author: Piero Proietti
 * email: piero.proietti@gmail.com
 * license: MIT
 */
import { Command, flags } from '@oclif/command'
const exec = require('../lib/utils').exec

import path = require('path')
import Pacman from '../classes/pacman'
import Utils from  '../classes/utils'

export default class Mom extends Command {
  static description = 'ask for mommy (gui interface)!'

  static flags = {
    help: flags.help({ char: 'h' }),
    cli: flags.boolean({ char: 'c', description: 'force cli version of mommy' }),
  }

  async run() {
    Utils.titles(this.id + ' ' + this.argv)
    // No sudo!
    if (process.getuid && process.getuid() === 0) {
      Utils.warning('You must to be kind with your mom! Call her without sudo')
      process.exit(0)
    }
    const { flags } = this.parse(Mom)
    let mum = path.resolve(__dirname, `../../scripts/mom-cli.sh`)
    if (Pacman.packageIsInstalled('zenity')) {
      mum = path.resolve(__dirname, `../../scripts/mom.sh`)
    }

    if (flags.cli) {
      mum = path.resolve(__dirname, `../../scripts/mom-cli.sh`) + ' ' + __dirname
    }
    console.log(mum)
    exec(mum)
  }
}
