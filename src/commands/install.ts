/**
 * penguins-eggs-v7 based on Debian live
 * author: Piero Proietti
 * email: piero.proietti@gmail.com
 * license: MIT
 */
import { Command, flags } from '@oclif/command'
import shx = require('shelljs')
import Utils from '../classes/utils'
import Hatching from '../classes/hatching'

/**
 * Class Install
 */
export default class Install extends Command {
  static flags = {gui: flags.boolean({char: 'g', description: 'use the gui installer'})}

  static description = 'penguin\'s eggs installation'

  static aliases = ['hatch']

  static examples = [
    `$ eggs install
penguin's eggs installation
`,
  ]

  /**
   * Execute
   */
  async run() {
    const {flags} = this.parse(Install)

    Utils.titles()

    let cmd = 'cli-installer'
    if (Utils.isRoot()) {

      if (flags.gui) {
        cmd = 'calamares'
      } else {
        const hatching = new Hatching()
        hatching.question()
      }
    }
  }
}