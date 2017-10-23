#!/bin/bash
#
# Proxmox VE installation
#
echo "deb http://download.proxmox.com/debian/pve stretch pve-no-subscription" > /etc/apt/sources.list.d/pve-no-subscription.list
wget http://download.proxmox.com/debian/proxmox-ve-release-5.x.gpg -O /etc/apt/trusted.gpg.d/proxmox-ve-release-5.x.gpg
apt remove --purge os-prober resolvconf network-manager gnome-network-manager
apt-get update
apt-get dist-upgrade
apt install proxmox-ve postfix open-iscsi
