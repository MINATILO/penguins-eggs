# sourceforge/admin/metadata

# English

# name
Penguin's eggs

# Homepage
https://penguins-eggs.net

# Video
www.youtube.com/embed/teG6EKcuPuI?rel=0

# Short Summary
On the road of Remastersys, SystemBack and father Knoppix!

# Full Description
Penguin's eggs is a terminal utility, in active development, which allows you to remaster your system and redistribute it as an ISO image.

# Installation
Download the package according your architecture, **sudo apt install eggs_7.8.41-amd64.deb** and **sudo apt install -f**.

# Configure and create your first iso image
sudo eggs dad

# Easy to learn, easy to to update
**man eggs** on cli system, **eggs mom** with gui. eggs don't need to be included in your apt sources, just type **sudo eggs update** and choose fresh eggs from the basket.

## Features 
Created on Debian buster (stable) support jessie (old-old-stable), stretch (old-stable) and bullseye (testing).

Support: i386/amd64 BIOS/UEFI with follow distros and derivates: Debian jessie/ stretch/ buster/ bullseye, Devuan beowulf, Ubuntu xenial/ bionic/ focal/ groovy and derivates (linuxmint, neon et others)

Fast: does not copy the original filesystem but the livefs is obtained instantly, through binding and overlay. In addition, the --fast option creates the ISO using zstd, reducing compression time during the development up to 10 times!

Safe: only use the original distro's packages, without any modification in your repository lists.

CLI and GUI: eggs is a utility cli, but we added two ligher GUI interfaces: mom and dad. Use mom to interact and learn eggs commands, and dad to quicly create an iso.

Script: if you want full control on the production of your iso, try the flag --script in produce. eggs will generate filesystem directory, iso structure complete and the related scripts to bind/ubind live filesystem, squash it and create or re-create yours iso as much times as you need.

Book: user's guide in italian language and manual or automatic translations in others languages.

Supported: I'm trying to give you as documentation and support is possible: sources, automatic documentation sources, user's guide, facebook page and group, telegram group penguinseggs and gitter. 

Community: currently the biggest problem with this software is the lack of a community. I hope that over time it will grow. You can help by following the project and helping to spread it. "No man is an island entire of itself..." John Donne 

If you like eggs, please rate this project on sourgeforce and help to spread it's diffusion. 

Feel free to contact me for any suggestions.

<a href='https://t.me/penguinseggs'>telegram</a>
https://twitter.com/pieroproietti
<a href='https://gitter.im/penguins-eggs-1/community'>gitter</a>

www.youtube.com/embed/teG6EKcuPuI?rel=0
