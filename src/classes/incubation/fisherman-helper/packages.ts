import { O_APPEND } from 'constants'
import { IDistro } from '../../../interfaces'
/**
 *
 */
import Pacman from '../../pacman'

/**
 *
 */
export function remove(distro: IDistro): string {
   let text = '  - remove:\n'
   text += removeEggs(distro)
   text += '\n'
   return text
}

/**
 * 
 * @param distro 
   - try_install:
      - language-pack-$LOCALE
      - hunspell-$LOCALE
      - libreoffice-help-$LOCALE

 */
export function tryInstall(distro: IDistro): string {
   // Per i linguaggi trovare BCP47 libreria...

   const processLang = process.env.LANG

   let lang = 'en_gb'

   if (processLang === 'it_IT.UTF-8') {
      lang = 'it'
   } else if (processLang === 'en_US.UTF-8') {
      lang = 'en_gb'
   } else if (processLang === 'es_PE.UTF-8') {
      lang = 'es_es'
   } else if (processLang === 'pt_BR.UTF-8') {
      lang = 'pt_br'
   } else if (processLang === 'fr_FR.UTF-8') {
      lang = 'fr'
   } else if (processLang === 'de_DE.UTF-8') {
      lang = 'de'
   }

   let text = `  - try_install:\n`


   // Pacchetti da installare sempre
   text += `    - hunspell-${lang}\n`

   // Pacchetti da installare a seconda della distribuzione
   if ((distro.versionLike === 'focal') || (distro.versionLike === 'bionic')) {
      text += `    - language-pack-${lang}\n`
   }

   // Pacchetti da installare se sono presenti
   if (Pacman.packageIsInstalled(`libreoffice-base-core`)) {
      text += `    - libreoffice-l10n-${lang}\n`
      text += `    - libreoffice-help-${lang}\n`
   }

   if (Pacman.packageIsInstalled('firefox-esr')) {
      text += `    - firefox-esr-${lang}\n`
   }

   if (Pacman.packageIsInstalled('thunderbird')) {
      text += `    - thunderbird-locale-${lang}\n`
   }

   return text
}

/**
 * 
 * @param distro 
 */
function removeEggs(distro: IDistro): string {
   const packages = Pacman.packages()
   let text = ''
   for (const i in packages) {
      const deb2check = packages[i].trimLeft().trimRight()
      text += addIfExist(deb2check)
   }

   /**
    * Rimuove i pacchetti di localizzazione
    */
   if ((distro.versionLike === 'buster') || (distro.versionLike === 'beowulf')) {
      const packages = Pacman.packagesLocalisation()
      for (const i in packages) {
         const deb2check = packages[i].trimLeft().trimRight()
         text += addIfExist(deb2check)
      }
   }
   text += addIfExist('calamares')

   return text
}

/*
 * @param package2check
 */
function addIfExist(package2check: string): string {
   let text = ''

   if (Pacman.packageIsInstalled(package2check)) {
      text += `    - '${package2check}'\n`
   }
   return text
}
