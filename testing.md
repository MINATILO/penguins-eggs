# README

With eggs_8.0.31 I'm trying to implement full encryption in krill (eggs install --cli)

## Limit
I'm creating this using exclusively bootMode=BIOS, only when I will finished it will came the time to start with UEFI.

I'm using a VM in proxmox ve with a disk /dev/sda with 32 GiB bios standard.

## Issues


At the moment, krill correctly create cripto_sda4 and create inside the volume

```
          await exec('cryptsetup -y -v luksFormat ' + this.partitions.installationDevice + '4')
          await exec('cryptsetup luksOpen ' + this.partitions.installationDevice + '4 crypto_sda4')
          await exec('vgcreate vgeggs /dev/mapper/crypto_sda4')
          await exec('lvcreate -L ' + luksRootSize + ' -n root vgeggs')
          await exec('lvcreate -L ' + luksSwapSize + ' -n swap vgeggs')
```
It look to copy well filesystem and so on, but the system don't start!

I checked the lacks of /etc/crypttab and added it but it is the same, so must to be something else.

## on the installed system

**there is not /etc/crypttab**


```
sudo cryptsetup luksOpen /dev/sda4 crypto_sda4
```
then

```
sudo mount /dev/mapper/vgeggs-root /mnt
sudo mount /dev/sda3 /mnt/boot
sudo mount /dev/sda2 /mnt/boot/efi  
```
**there is not a mountpoint /boot/efi**

Here the question is a bit strange, we are on BIOS but as I saw from kubuntu 21.04 the way they have is to 
create a gtp table and there is boot and efi partition completed of all.

Probably the error come to here.

Switching on this.efi after setip don't copy EFI files... I think they are copied by grub-install

We must stop the process before grub-install and see the situation.



## Contact

write to: piero.proietti@gmail.com

