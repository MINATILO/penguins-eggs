/*
  penguins-eggs: Eggs.js
  author: Piero Proietti
  mail: piero.proietti@gmail.com
*/

export interface IDevice {
    device: string;
    fsType: string;
    mountPoint: string;
}

export interface IDevices {
  efi: IDevice;
  boot: IDevice;
  root: IDevice;
  data: IDevice;
  swap: IDevice;
}
