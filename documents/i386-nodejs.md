# Nodejs version on eggs packages

From the version eggs-7-5-122 I changed the version of the reference node, returning to the old version nodejs 8. This guarantees the possibility of creating debian packages for both the i386 architecture as well as for amd64. Not everything comes for free, and in order to not have two source lines, I had to switch to node8 also for the amd64 version. In all the way, actually we can compile vs node8, node10, node12 and node14, but - of course - we need to be compatible with node8 to can create packages in the i386 architecture.

Starting a little before eggs-7.6.0 I solved this problem, wrote a wrapper and are now using the last Nodejs v8.x on i386 architecture and Nodejs v14.x on amd64.

# Nodejs on i386 
The last official version for this architecture is Node.js v8.x, we can install it.

## Ubuntu
```curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -```
```sudo apt-get install -y nodejs```

## Debian
```curl -sL https://deb.nodesource.com/setup_8.x | bash -```
```apt-get install -y nodejs```

and finally, we check the nodejs version:

```apt-cache policy nodejs ```

```sudo apt install nodejs=8.17.0-1nodesource1```

to install the nodejs version 8.

After that is better to look apt upgrade of nodejs

just use:

```
sudo apt-mark hold nodejs
```

if You want to remove the hold

```
sudo apt-mark unhold nodejs
```

In this way when you upgrade the system, the version of nodejs10 from the original reporitory of Debian will not be installed.


## node v. 8 vs v. 14

I used very few new caracteristics from the current version, mostly are about fs package.

* isDirectory() from version 10
* isSymbolicLink() from version 10

Well, today I push the node8 vs node14 used things in n8.ts, so now we are again compatible with node8 and can start agein to built eggs i386 packages.

# x86 package node8 
You must to be in a x86 system.

* edit ./node_modules/@oclif/dev-cli/lib/tarballs/config.js
* add 'linux-x86' in TARGET line 53 on config.js

For comodity I put a link: oclif-tarball-config.js to ./node_modules/@oclif/dev-cli/lib/tarballs/config.js, so you can edit this one directly.

At this point run
```
sudo npm run deb
```

# Version of packages 
We must be compatible with node8, so this is the result of:

```
npm outdated
Package         Current  Wanted  Latest  Location
@types/js-yaml   3.12.6  3.12.6   4.0.0  penguins-eggs
eslint           5.16.0  5.16.0  7.18.0  penguins-eggs
globby           10.0.2  10.0.2  11.0.2  penguins-eggs
js-yaml          3.14.1  3.14.1   4.0.0  penguins-eggs
```

```
  "dependencies": {
    "@getvim/execute": "^1.0.0",
    "@oclif/command": "^1.8.0",
    "@oclif/plugin-autocomplete": "^0.3.0",
    "@oclif/plugin-help": "^3.2.1",
    "@oclif/plugin-not-found": "^1.2.4",
    "@oclif/plugin-warn-if-update-available": "^1.7.0",
    "@types/inquirer": "^7.3.1",
    "axios": "^0.21.1",
    "chalk": "^4.1.0",
    "clear": "^0.1.0",
    "diskusage": "^1.1.3",
    "drivelist": "^9.2.4",
    "figlet": "^1.5.0",
    "inquirer": "^7.3.3",
    "js-yaml": "^4.0.0",
    "mustache": "^4.1.0",
    "network": "^0.5.0",
    "pjson": "^1.0.9",
    "shelljs": "^0.8.4",
    "tslib": "^ 2.1.0"
  },
  "devDependencies": {
    "@oclif/dev-cli": "^1.21.3",
    "@oclif/test": "^1.2.8",
    "@types/chai": "^4.2.14",
    "@types/clear": "^0.1.1",
    "@types/drivelist": "^6.4.1",
    "@types/figlet": "^1.2.0",
    "@types/js-yaml": "^4.0.0",
    "@types/mocha": "^8.2.0",
    "@types/mustache": "^4.1.1",
    "@types/node": "^14.14.22",
    "@types/shelljs": "^0.8.8",
    "chai": "^4.2.0",
    "eslint": "^7.18.0",
    "eslint-config-oclif": "^3.1.0",
    "eslint-config-oclif-typescript": "^0.2.0",
    "globby": "^11.0.2 ",
    "mocha": "^8.2.1",
    "nyc": "^15.1.0",
    "prettier": "^2.2.1",
    "ts-node": "^9.1.1",
    "typedoc": "^0.20.19",
    "typescript": "^4.1.3"
  },
```

## Contacts
Feel free to contact [me](https://gitter.im/penguins-eggs-1/community?source=orgpage) or open an issue on [github](https://github.com/pieroproietti/penguins-eggs/issues).

* mail: piero.proietti@gmail.com

## Copyright and licenses
Copyright (c) 2017, 2020 [Piero Proietti](https://penguins-eggs.net/about-me.html), dual licensed under the MIT or GPL Version 2 licenses.
