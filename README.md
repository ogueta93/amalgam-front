# Amalgam Frontend
Amalgam front is a html5 videogame inspired in [Triple Triad](https://finalfantasy.fandom.com/wiki/Triple_Triad). It use node and Vue Cli mainly.
- [Releases](https://github.com/ogueta93/amalgam-front/releases) 

## Application Backend
Amalgam fronted supplies front side. You can get the back here: 
- [Amalgam](https://github.com/ogueta93/amalgam)

## Base technologies
- [Node](https://nodejs.org/en/)
- [Vue Cli](https://cli.vuejs.org/)

## Requirements
To run this proyect correctly you need to prepare your local machine:

- Node, last version.
- Yarn or Npm, last version.
- Vue Cli.

## Installation instructions

### 1. Install Vue Cli
- Install Vue Cli: [Instructions](https://cli.vuejs.org/guide/prototyping.html)

### 2. Get node_modules
In the root folder, you must to run the next command:
```
yarn install
```

### 3. Basic Proyect Configuration
1. You must to set the ws server address in **.env** file. (The websocket server runs on 8080 port number. At the moment, the port number is a hardcoded value). Example:
```
VUE_APP_ENVIRONMENT=dev
VUE_APP_TITLE=Amalgan
VUE_APP_WEBSOCKET_URL=ws://{host}:8080
```

2. **(optional)** You must to set the host if you are running the application in a server **vue.config.js** file. Example:
```
module.exports  = {
	devServer: {
		open:  process.platform  ===  'darwin',
		host:  '',
		port:  4545,
		https:  false,
		hotOnly:  false,
	},
	.....
}
```
## Start Application

To start the application execute the next command:
```
yarn serve
```
