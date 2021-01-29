#!/bin/bash

##
# eggs dialog cli
##

function main {

   while true; do
      # 20 righe. 75 caratteri, 16 altezza menu list
      answer=$(
      whiptail --title "mommy" --menu "Mama's gonna keep baby cosy and warm..." 22 75 15 \
      "init"            "init eggs, install prerequisites" \
      "dad"             "lead you to configurare and iso production" \
      "documentation"   "https://penguins-eggs.net/" \
      "export"          "export /deb/docs/iso" \
      "help"            "help" \
      "info"            "get informations" \
      "install"         "install your system on hard disk" \
      "kill"            "delete ISOs" \
      "man"             "manual eggs" \
      "produce"         "produce and ISO of your system" \
      "remove"          "remove " \
      "tools"           "clean/initrd/locales/pve/sanitize/skel/yolk" \
      "update"          "update" \
      "quit"            "exit" 3>&2 2>&1 1>&3
      )

      case "$answer" in 
         "quit")
            clear
            exit ;;

         "init")
            init ;;

         "dad")
            dad ;;

         "documentation")
            documentation ;;

         "export")
            export ;;

         "help")
            help ;;

         "info")
            info ;;
         
         "install")
            install ;;

         "kill")
            kill ;;

         "man")
            manual ;;

            
         "produce")
            produce ;;

         "remove")
            remove ;;

         "tools")
            tools ;;

         "update")
            update ;;

      esac

   done
}


################################
function dad {
   sudo eggs dad
}

function documentation {
      sensible-browser "https://penguins-eggs.net"
}

################################
function export {

      answer=$(
      whiptail --title "mommy" --menu "Mama's gonna keep baby cosy and warm..." 22 75 14 \
      "deb"    "export package eggs-v7-x-x-1.deb in the destination host" \
      "docs"   "remove and export docType documentation of the sources in the destination host" \
      "iso"    "export iso in the destination host" 3>&2 2>&1 1>&3
      )

      case "$answer" in 
         "deb")
            deb ;;

         "docs")
            docs ;;

         "iso")
            iso ;;
      esac
}

################################
function deb {
   eggs export:deb -c
   press_a_key_to_continue
}

################################
function  docs {
   eggs export:docs
   press_a_key_to_continue
}

################################
function iso {
   eggs export:iso -c
   press_a_key_to_continue
} 

################################
function help {
   eggs help
   press_a_key_to_continue
}

################################
function info {
   eggs info
   press_a_key_to_continue
}

################################
function install {
   sudo eggs install 
   press_a_key_to_continue
}

################################
function kill {
   sudo eggs kill
   press_a_key_to_continue
}

################################
function manual {
   man_eggs='/usr/bin/man eggs'
   ${man_eggs}
}

################################
function init {
   sudo eggs init
   press_a_key_to_continue
}

################################
function produce {
   answer= $(
   whiptail --title "mommy" --menu "Mama's gonna keep baby cosy and warm..." 22 75 14 \
   "fast"    "create fast an ISO large" \
   "standard"  "create an ISO standard compressio" \
   "compress"  "create an ISO max compression" 3>&2 2>&1 1>&3
   )

   case "$answer" in 
      "fast")
         fast ;;

      "standard")
         standard ;;

      "compress")
         compress ;;
   esac
}

################################
function fast {
   sudo eggs produce --fast --verbose
}

################################
function standard {
   sudo eggs produce --verbose
}

################################
function compress {
   sudo eggs produce --compress --verbose
}

################################
function remove {
   answer= $(
   whiptail --title "mommy" --menu "Mama's gonna keep baby cosy and warm..." 22 75 14 \
   "prerequisites"   "remove prerequisites only" \
   "all"             "remove prerequisites and eggs" \
   "purge"           "remove prerequisites, eggs and purge" 3>&2 2>&1 1>&3
   )

   case "$answer" in 
      "prerequisites")
         remove_prerequisites ;;

      "all")
         remove_all ;;

      "purge")
         remove_purge ;;
   esac
}

################################
function remove_prerequisites {
   sudo eggs remove --prerequisites
}

################################
function remove_all {
   sudo eggs remove --all
}

################################
function remove_purge {
   sudo eggs remove --purge
}

################################
function tools {
   answer= $(
   whiptail --title "mommy" --menu "Mama's gonna keep baby cosy and warm..." 22 75 14 \
   "clean"     "clean system log, apt, etc" \
   "initrd"     "initrd experimental" \
   "locales"   "install/clean locales" \
   "pve"       "enable/start/stop pve-live" \
   "sanitize"  "remove eggs remains and sanitize" \
   "skel"      "update skel from home configuration" \
   "yolk"      "configure eggs to install without internet" 3>&2 2>&1 1>&3
   )

   ${answer}
   case "$answer" in 
      "clean")
         clean ;;

      "initrd")
         initrd ;;

      "locales")
         locales ;;

      "pve")
         pve ;;

      "sanitize")
         sanitize ;;

      "skel")
         skel ;;

      "yolk")
         yolk ;;
   esac

}

################################
function clean {
   sudo eggs tools:clean
   press_a_key_to_continue
}

################################
function initrd {
   sudo eggs tools:initrd
   press_a_key_to_continue
}

################################
function locales {
   sudo eggs tools:locales
   press_a_key_to_continue
}

################################
function pve {
   sudo eggs tools:pve
   press_a_key_to_continue
}

################################
function sanitize {
   sudo eggs tools:sanitize
   press_a_key_to_continue
}

################################
function skel {
   sudo eggs tools:skel
   press_a_key_to_continue
}

################################
function yolk {
   sudo eggs tools:yolk
   press_a_key_to_continue
}

################################
function update {
   sudo eggs update
   press_a_key_to_continue
}


function press_a_key_to_continue {
   read -p "Press enter to continue"
}

################################
function EXIT {
   exit 0
}

main
