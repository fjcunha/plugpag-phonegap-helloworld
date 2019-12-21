# Cordova PlugPag Plugin Demo App in Phonegap [![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)

****

This repository was made in order to help people learn how to cordova-plugin-pagseguro-plugpag works.
Currently this plugin works only on Android devices, this repo will be updated if necessary to attend IOS particularities.

**HOPEFULLY** you will like this repo and feel like contributing, so please if you can, contribute so we can have even more amazing content!


## Setup

Requirements to use this project:

##### Node.js (https://nodejs.org/download/)

##### npm (Node Package Manager, it comes with node.js installation)
In case you're not with the latest version of npm:
```sh
$ sudo npm install npm -g
```

##### Cordova & Phonegap Cli
To install both of them on your system just launch this command:
```sh
$ sudo npm install cordova -g
$ sudo npm install phonegap -g
```

## Install NPM Dependencies
Once you clone this repository, run this command on your terminal to install all needed dependencies:
```sh
$ npm install
```

## Install cordova plugin Dependencies
Run this command on your terminal to add a platform and install all needed puglins:


Android:
```sh
$ cordova platform add android
```
## Launching the App
After installing the needed dependencies you are done, launch your app in a device with a simple
```sh
$ cordova run android
```

## Grant the App permissions on your mobile settings
For the functionalities, this project needs some permissions, enable it on phone settings.