penguins-eggs
=============

## Penguin&#39;s eggs are generated and new birds are ready to fly...
[![repo](https://img.shields.io/badge/repo-github.com-blue)](https://github.com/pieroproietti/penguins-eggs)
[![npm version](https://img.shields.io/npm/v/penguins-eggs.svg)](https://npmjs.org/package/penguins-eggs)
[![debs](https://img.shields.io/badge/deb-packages-blue)](https://sourceforge.net/projects/penguins-eggs/files/packages-deb)
[![isos](https://img.shields.io/badge/iso-images-blue)](https://sourceforge.net/projects/penguins-eggs/files/iso)
[![typedoc](https://img.shields.io/badge/doc-typedoc-blue)](https://penguins-eggs.sourceforge.io/index.html)
[![book](https://img.shields.io/badge/book-penguin's%20eggs-blue)](https://penguin-s-eggs.gitbook.io/project/)
[![facebook](https://img.shields.io/badge/page-facebook-blue)](https://www.facebook.com/penguinseggs)
[![gitter](https://img.shields.io/badge/chat-gitter-blue)](https://gitter.im/penguins-eggs-1/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![License](https://img.shields.io/badge/license-MIT/GPL2-blue)](https://github.com/pieroproietti/penguins-eggs/blob/master/LICENSE)


# Penguin's eggs Debian package

Usually the last version is the right one.

To install the package, download it and open a terminal window.

```sudo dpkg -i eggs_7.5.110-1_amd64.deb```

## Usage
Use ```eggs``` without parameters to have the list of commands. ```eggs produce --help``` will show you the description of this command and the flag you can use. 

Detailed instrunction for usage are published on the gitboot [penguin's eggs](https://penguin-s-eggs.gitbook.io/project/) (sorry, only italian language).


## Changelog
Versions are listed on reverse order, the first is the last one.

### eggs-7.5.110-1
Here we are, I was looking for a solution to facilitate myself in the work of adapting Ubuntu and Deepin to calamares and, trafficking with this, as often happens a new idea came up:

- flag --dry (shord "d")

Eggs, from this version, in addition to being able to directly generate the ISO, can be used with the --dry option which instead generates the structure and scripts necessary to complete the work. And, neither creating the filesystem.squasfs nor the iso image is obviously instantaneous. However, scripts are generated, which therefore allow the user to bind and ubind the live filesystem, its compression and the generation of the ISO.
- introduct in ```eggs produce``` the flag --dry. Eggs run without produce not squashfs, nor iso image, but creating same scripts: bind, ubind, mksquashfs and  mkiso to let you to change your live filesystem and your iso filesystem before to package it.

Of course, besides being able to work in the live filesystem and in the iso folder, you can also change all the compression, generation, etc. parameters.

- introduced the --dry operation without the production of the iso but only the scripts necessary for it;
- included in the ovary, in addition to the necessary scripts, a short explanatory README.md.


### eggs-7.5.100-1
One hundred is a round figure, plus something has been done.

I worked a lot on the cli installer built into eggs, the work started with the idea of adding formatting LVM2 for Proxmox VE, but also continued with the intention - I hope successful - to make it more easily usable.

At the moment Ubuntu focal and the various derivatives (Linux Mint included) they can be installed ONLY with the cli-installer, while for Debian buster and LMDE4 are recommended to use the installer Calamares.

ATTENTION: the use of the eggs cli installer is still from ONLY for experts if you erase the disc.

- link on the desktop for cli-installer or calamares depending on the presence of the latter;

- desktop link for eggs adjust only for Desktop managers that do not resize the monitor if it is enlarged on the virtual machines (LXDE, LXQT, XFCE and Mate). Obviously the effect is visible only when using virtual machines with the integration tools installed, for example: spice-vdagent for KVM.

- removed the enabling of the desktop links on gnome (some problems related to the use of the gio command that requires the mounting of / dev also in the construction phase of the iso remain to be solved. but it remains busy. (If anyone has same suggestions ...)

- Bem-vindo aos novos amigos brasileiros, teremos que pensar em uma internacionalização do pacote.

- Welcome to the new Brazilian friends, sooner or later we will have to think about an internationalization of the package.

- Benvenuto ai nuovi amici brasiliani, bisognerà prima o poi pensare ad una internazionalizzazione del pacchetto.



### eggs  7.5.86

- modified the call to xorriso, trying to make it analogous to systemback (according to the suggestions of Franco Conidi);

- reimported - and corrected - the utils from tools;

- cleaning of makeIsoImage () in ovary;

- copy of the utils in penguins-tools, to standardize the tools;

- various cleaning of the code.


### 7.5.81
- work continues for compatibility with Ubuntu, currently it is possible to remaster it and install with eggs cli install;

- more than a few freaks to make the gnome links work by marking them trusted with the gio command which, however, as the user is not logged in, must be launched with sudo -u user dbus-launch gio set ...;

Of course eggs remains compatible with Debian Buster.



### eggs-7.5.76
Eggs is becoming adept at remastering Ubuntu 20.04 focal, it manages to remaster Ubuntu without any problem. For the installation, at the moment, it is not possible to do it with the graphic installer but only with the built-in one.

- restructuring of the code to allow selection among the various distros;

- fixing hotspots for focal Ubuntu remastering (both ubuntu-server and Ubuntu-desktop);

- xbuntu, kubuntu, UbuntuMate and UbuntuBudgie versions boot properly.

It remains to fix the configuration of the graphical installer for Ubuntu.


### eggs-7.5.72
- skel command for copying the user configuration in /etc/skel. It works very well on cinnamon. Need to test it on other desktop Managar, maybe tell me which ones you are interested in.


### eggs 7.5.64
- possibility to configure the live user name and passwords directly in the / etc / penguins-eggs file (there are those who prefer live / evolution, those who demo / demo, etc;

- creation of the live user ALWAYS and only as the only user of the liveCD part of the sudo group.

I chose to make this change for better cleaning and user control. At the moment I only uploaded the npm version

### eggs-7.5.60-1
- cleaning of git repository: remuved old documentts,  in documents


### eggs-7.5.51-1
- info: nuovo look;
- produce: if the prerequisites are not installed, it correctly proposes their installation;
- installer cli: introduced a new display to confirm the entered values.

I have problems with the cli installer, it is quite good and has also become humanly usable, but for some reason that I don't know, after the installation, during the boot phase, a boot delay is generated which, by performing the installation with calamares


In particular, it reports:

```mdadm: no array found in config file or automatically```

(I use only virtual machines on proxmox-ve, so I don't need and have disk arrays)

and, once past the rock, it still waits 1:30 for:

```A start job is running for /sys/subsystem/net/devices/multi/user```

If someone can help me, don't esitate, thanx.

### eggs-7-5-57-1
- add warning for look new versions;
- the presentation of calamares translated into English;
- added verbose option also in ```adjust``` command;
- changed name and position of the exclude.list;
- restructured and simplified exclude list, insert options for apache2 and pveproxy.

### eggs-7.5.54-1
- tested with LMDE4, both standard amd EFI machines.

### eggs-7.5.44-1
- installer cli: fstab will use UUID no more /dev/sda1, etc
- installer cli: removal of the user and group of the liveCD during installation

### eggs-7.5.40-1
* fixed failure to remove CD user group pending, edit the fstab file in the cli installer by adding the blkids.


### eggs-7.5.39-1
* added skel command: copy of the Desktop configuration in / etc / sket;
* correct and tested functioning of the installer cli.

### eggs-7.5.36-1
* added flag -a for the installation assistant which allows the choice between graphical installation and cli installation;
* corrected problem of deleting apt lists on the version installed with graphic installer.

Happy 1st of May to all


### eggs-7-5-34-1
- Eliminated the ISO construction error on a non-UEFI machine. Previously, since the grub-efi-amd64 package and its dependencies were not installed, eggs failed even if the make_efi = no value had been set correctly in the configuration file;

* Introduced a further flag in eggs produce, for the addition on the desktop of the installation assistant that allows you to choose between calamares or installer cli.

### eggs_7.5.18-1_amd.deb
In these versions from 7.5.0-1 to 7.5.18-1 I have completely revised the commands trying - as much as possible - to simplify the use. This version, in case of prerequisites not installed, asks the user to install them on the fly and so does for calamares (if in / etc / penguins-eggs force-installer = yes) and for the configuration file itself which, if absent, is automatically generated. Furthermore, for non-graphical workstations, calamares are no longer configured, obviously not necessary and the installation takes place directly with eggs.

If you have problems, try using the -v flag to view the video output of the various calls.

### eggs_7.5.0-1_amd,deb
* Finally we have the working UEFI version.

# Help
Don't esitate to ask me for suggestions and help.

# That's all Folks!
No need other configurations, penguins-eggs are battery included or better, as in the real, live is inside! :-D

## More informations
For other informations, there is same documentation i the document folder of this repository,
look at facebook group:  [Penguin's Eggs](https://www.facebook.com/groups/128861437762355/),
contact me, or open an [issue](https://github.com/pieroproietti/penguins-eggs/issues) on github.

I mostly use Facebook.

* facebook personal: [Piero Proietti](https://www.facebook.com/thewind61)
* facebook group:  [Penguin's Eggs](https://www.facebook.com/groups/128861437762355/)
* facebook page:  [Penguin's Eggs](https://www.facebook.com/penguinseggs)
* mail: piero.proietti@gmail.com


## Copyright and licenses
Copyright (c) 2017, 2020 [Piero Proietti](https://github.com/pieroproietti), dual licensed under the MIT or GPL Version 2 licenses.