
![penguins-eggs](https://github.com/pieroproietti/penguins-eggs/blob/master/assets/penguins-eggs.png?raw=true)
# penguin's eggs

[![NPM Package](https://img.shields.io/npm/v/penguins-eggs.svg?style=flat)](https://npmjs.org/package/penguins-eggs "View this project on npm")
[![Build Status](https://travis-ci.org/pieroproietti/penguins-eggs.svg?branch=master)](https://travis-ci.org/pieroproietti/penguins-eggs)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Join the chat at https://gitter.im/penguins-eggs/Lobby](https://badges.gitter.im/pieroproietti/penguins-eggs.svg)](https://gitter.im/penguins-eggs/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[grafico](https://www.npmtrends.com/penguins-eggs)
[Versione in italiano](./README.it_IT.md)

## Presentation
penguins-eggs is a console utility, in active development, who let you to
remaster your system and redistribuite it as iso images or from the lan via PXE
remote boot.

The scope of this project is to implement the process of remastering your
version of Linux, generate it as ISO image to burn on a CD/DVD or copy to a usb
key to boot your system. You can also boot your egg - via remote boot - on your
LAN.

It can create your ISO image of your system, but also include all the necessary
services dhcp, dhcp-proxy, tftp and http to realize a fast and powerfull PXE
server who can work alone or inside a preesistent LAN architecture.

All it is written in pure nodejs, so ideally can be used with differents Linux
distros. At the moment it is tested with Debian 9 Stretch, Debian 8 Jessie,
Ubuntu and derivates as Linux Mint. For others distros we need to find
collaboration.

penguins-eggs, at the moment 2018 february 20 is in a joung state, and can have
same troubles for people not in confidence with Linux system administration, but
can be already extremely usefull: imagine to install it on an lan and start to
manage the computers with it. You can easily install clonezilla on it, or clamav
and you have a tool to backup/restore/sanityze your entire infrastructure.

You can, also easily create your organization/school distro and deploy it on your
LAN, give it to your friends as usb key or publish eggs in the internet!

You can try now penguins-eggs, it is a console utility - no GUI - but don't be
scared, penguins-eggs is a console command - really very simple usage - if you
are able to open a terminal, you can use it.

## Install penguins-eggs
Well, it is time to try it!

### Prerequisites
Of course penguins-eggs need [nodejs](https://github.com/nodesource/distributions/blob/master/README.md#deb) installed.

penguins-eggs depend on various packages, you need to install them before to
start to use it. Before to install penguins-eggs, simply copy and paste the
following lines:

```sudo apt-get update```

```sudo apt-get install lvm2 parted squashfs-tools xorriso live-boot syslinux syslinux-common isolinux pxelinux```

If you want to use the gui installer (calamares), you must to install it:

```sudo apt-get install calamares qml-module-qtquick2 qml-module-qtquick-controls```

Note: It is also possible to installa calamares on the live system and configure it
with the command:

```sudo eggs calamares```

### Installation penguins-eggs via npm
You can install it with npm (node package manager). Copy and past the following line:

For same reason we need to do this operation before to install eggs

```sudo npm config set unsafe-perm true```

```sudo npm i penguins-egg -g```


### Installation penguins-eggs from source
You need a functional installation of Linux Debian version 8 or 9, LinuxMint, LMDE, 
Ubuntu or derivates, all the prerequisites plus the ``build-essential`` package.

```apt-get install build-essential```

At this point You can download last version on github.com. Copy and past the
following lines:

```
git clone https://github.com/pieroproietti/penguins-eggs
cd penguins-eggs
npm i
```

At this point, You can launch egg, in developer mode, for example:

```sudo npm run ts-start spawn```

or you can build it or link it:

## Commands
On the eggs you can do four actions:
* spawn
* info
* kill
* calamares (configure gui installer gui calamares)
* hatch (the cli installer)

### spawn
The function of spawn is to generate the egg. Your system is copied and packaged
as an iso file. This is a live system version of your real system, and you can
masterize it or put in a USB key and use, and install your version of linux on
everyone computer. The command spawn accept the parameter ```-d``` or
```--distroname``` who, as the name implies is the name and, also, the hostname
of your live system.

```sudo eggs spawn -d mydistroname```

### info
You will get the main information about your system. This information will be used in the process of spawn and configure the installer.

```sudo eggs info```


### kill
As the name say is the operation of break and kill the egg created. You will
free your system from the egg.

```sudo eggs kill```

### calamares
This command is usefull during develepment, it generate the calamares configuration. 

```sudo eggs calamares```

### hatch
An egg to became penguin need to be hatched! In our case we simply need to give
to the egg the informations for installation and - in few minuts - (far
  before the fatitical 21 days) we will have a new penguin.

```sudo eggs hatch```

You will be prompted to various parameters like: username, password, hostname,
domain, networking, installation device and type. Usually, you can accept the
defaults.

**Attention**: Don't be scared, but be attent to that you are doing here,
the operation of hatch is destructive and irreversible, and will format your
disk and destroy your data to prepare the machine for the installation of your
new penguin. **Be sure to have backup of your data before**.


## Options
* -d --distroname <distroname>

If you dont use this option, the computer hostname will used as distroname.
The image iso generated, will be called distroname-YYYY-MM-DD_HHMM-ZZ
Where YYYY-MM-DD-HHMM is year, MM mount, DD day. HHMM is your local time and
ZZ the difference betwen your local time and the greenwich one.

eg: host ``penguin`` will produce an iso called ``penguin-2017-10-22_2047_02.iso``


## Development
I build and test penguins-eggs on a customized version of
[Proxmox VE](https://pve.proxmox.com/wiki/Main_Page) who let me to  create/destroy
a lot of virtual PCs with different configurations: one or more net cards,
processor, memory and so on. It is easy to have, install Debian Stretch
with your preferedd GUI, I use cinnamon, and follow this
[howto](https://pve.proxmox.com/wiki/Install_Proxmox_VE_on_Debian_Stretch) in their site.

# That's all Folks!
No need other configurations, penguins-eggs are battery included or better, as
in the real, the live is inside! :-D

## More informations
For other informations, look at [Piero Proietti's blog](http://pieroproietti.github.com),
contact me, or open an [issue](https://github.com/pieroproietti/penguins-eggs/issues) on github.

* facebook group:  [Penguin's Eggs](https://www.facebook.com/groups/128861437762355/)
* twitter: [@pieroproietti](https://twitter.com/pieroproietti)
* google+: [PieroProietti](https://plus.google.com/+PieroProietti)
* mail: piero.proietti@gmail.com

**artisan**

## Copyright and licenses
Copyright (c) 2017, [Piero Proietti](http://pieroproietti.github.com), dual licensed under the MIT or GPL Version 2 licenses.

# Distribution supported
At the moment penguins-eggs is working on:
* Debian
* Ubuntu
* Linux Mint
* LMDE

## Distribution in progress
* Fedora 
I'm trying to support Fedora, Suse and others distros. With Fedora I'm a good point, the system is complete but lack just the boot of the live CD. 

* wget https://fedora.mirror.garr.it/fedora/linux/releases/29/Workstation/x86_64/os/isolinux/vmlinuz
* wget https://fedora.mirror.garr.it/fedora/linux/releases/29/Workstation/x86_64/os/isolinux/initrd.img

If someone can help.


 
