import { Command, flags } from '@oclif/command'
import Tools from '../../classes/tools'
import Utils from '../../classes/utils'

const exec = require('../../lib/utils').exec;

export default class ExportDeb extends Command {
  static description = 'export package eggs-v7-x-x-1.deb in the destination host'

  static flags = {
    help: flags.help({ char: 'h' }),
    clean: flags.boolean({ char: 'c', description: 'remove old .deb before to copy' }),
    armel: flags.boolean({ description: 'export armel arch' }),
    amd64: flags.boolean({ description: 'export amd64 arch' }),
    i386: flags.boolean({ description: 'export i386 arch' }),
    all: flags.boolean({ description: 'export all archs' }),
  }

  async run() {
    const { args, flags } = this.parse(ExportDeb)
    Utils.titles(this.id + ' ' + this.argv)

    const Tu = new Tools
    Utils.warning(ExportDeb.description)
    await Tu.loadSettings()

    if (Utils.isRoot()) {
      Utils.warning('You must use eggs export:deb in user mode, without sudo')
    } else {
      // rimozione
      if (flags.clean) {
        console.log('cleaning remote host...')
        let arch = 'amd64.deb'
        if (process.arch === 'ia32') {
          arch = 'i386.deb'
        }
        if (flags.armel) {
          arch = 'armel.deb'
        } else if (flags.amd64) {
          arch = 'amd64.deb'
        } else if (flags.i386) {
          arch = 'i386.deb'
        } else if (flags.all) {
          arch = '*.deb'
        }
        let cmd = `ssh ${Tu.config.remoteUser}@${Tu.config.remoteHost} rm -rf ${Tu.config.remotePathDeb}${Tu.config.filterDeb}${arch}`
        await exec(cmd, { echo: true, capture: true })
      }

      // esportazione
      console.log('copy to remote host...')
      let arch = 'amd64.deb'
      if (process.arch === 'ia32') {
        arch = 'i386.deb'
      }
      if (flags.armel) {
        arch = 'armel.deb'
      } else if (flags.amd64) {
        arch = 'amd64.deb'
      } else if (flags.i386) {
        arch = 'i386.deb'
      } else if (flags.all) {
        arch = '*.deb'
      }
      let cmd = `scp ${Tu.config.localPathDeb}${Tu.config.filterDeb}${arch} root@${Tu.config.remoteHost}:${Tu.config.remotePathDeb}`
      await exec(cmd, { echo: true, capture: true })
    }
  }
}