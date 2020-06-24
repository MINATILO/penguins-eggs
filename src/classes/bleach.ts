/* eslint-disable no-console */
/**
 * penguins-eggs: Bleach.ts
 *
 * author: Piero Proietti
 * mail: piero.proietti@gmail.com
 */

import fs = require('fs')
import chalk = require('chalk')
import Utils from './utils'

// libraries
const exec = require('../lib/utils').exec

/**
 *
 * @param dest
 */
async function rm(dest = '', verbose = false) {
   let echo = { echo: false, ignore: true, capture: false }
   if (verbose) {
      echo = { echo: true, ignore: true, capture: false }
   }

   if (fs.existsSync(dest)) {
      await exec(`rm ${dest} -rf`, echo)
   } else {
      console.log(`non esiste ${dest}`)
   }
}

async function rmdir(dest = '', verbose = false) {
   let echo = { echo: false, ignore: true, capture: false }
   if (verbose) {
      echo = { echo: true, ignore: true, capture: false }
   }
   const result: string[] = fs.readdirSync(dest)
   if (result.length > 0) {
      await exec(`rm ${dest} -rf`, echo)
   }
}

/**
 * Bleach:
 */
export default class Ovary {
   /**
    *
    * @param verbose
    */
   static async clean(verbose = false) {
      await this.cleanApt(verbose)
      await this.cleanHistory(verbose)
      await this.cleanJournal(verbose)
      await this.cleanSystemCache(verbose)
   }

   /**
    * PULITORI
    */

   static async cleanApt(verbose = false) {
      let echo = { echo: false, ignore: true, capture: false }
      if (verbose) {
         echo = { echo: true, ignore: true, capture: false }
         Utils.warning('cleaning apt')
      }
      await exec('apt clean', echo)
      await exec('apt autoclean', echo)
      const dest = '/var/lib/apt/lists/'
      rmdir(dest, verbose)
   }

   static async cleanHistory(verbose = false) {
      if (verbose) {
         Utils.warning('cleaning bash history')
      }
      const dest = '/root/.bash_history'
      if (fs.existsSync(dest)) {
         await rm(dest, verbose)
      }
   }

   static async cleanJournal(verbose = false) {
      let echo = { echo: false, ignore: true, capture: false }
      if (verbose) {
         echo = { echo: true, ignore: true, capture: false }
         Utils.warning('cleaning journald')
      }
      await exec('journalctl --rotate', echo)
      await exec('journalctl --vacuum-time=1s', echo)
   }

   static async cleanSystemCache(verbose = false) {
      let echo = { echo: false, ignore: true, capture: false }
      if (verbose) {
         echo = { echo: true, ignore: true, capture: false }
         Utils.warning('cleaning system cache')
      }
      // Clear PageCache only.
      await exec('sync; echo 1 > /proc/sys/vm/drop_caches', echo)

      // Clear dentries and inodes.
      await exec('sync; echo 2 > /proc/sys/vm/drop_caches', echo)

      // Clear PageCache, dentries and inodes.
      await exec('sync; echo 3 > /proc/sys/vm/drop_caches', echo)
   }
}

/**
 * Elenco pulitori bleachbit
 * Solo quelli pertinenti root
 */

/*

# apt
# bash.history

// deepscan.backup
// deepscan.ds_store
// deepscan.thumbs_db
// deepscan.tmp

gnome.run
gnome.search_history

journald.clean

// kde.cache
// kde.recent_documents
// kde.tmp

# system.cache
system.clipboard // xclip
system.custom
system.desktop_entry
system.free_disk_space
system.localizations
system.memory
system.recent_documents
system.rotated_logs
system.tmp
system.trash

wine.tmp
winetricks.temporary_files

x11.debug_logs

yum.clean_all
yum.vacuum
*/
