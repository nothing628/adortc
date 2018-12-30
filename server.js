'use strict'

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstrap Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass relative path from the project root.
*/


const cluster = require('cluster')
const https = require('https')
const { Ignitor } = require('@adonisjs/ignitor')
const pem = require('pem')

pem.createCertificate({ days: 2, selfSigned: true }, (error, keys) => {
  if (error) {
    return console.log(error)
  }

  const options = {
    key: keys.serviceKey,
    cert: keys.certificate
  };

  if (cluster.isMaster) {
    for (let i=0; i < 4; i ++) {
      cluster.fork()
    }
    require('@adonisjs/websocket/clusterPubSub')()
    return
  }
  
  new Ignitor(require('@adonisjs/fold'))
    .appRoot(__dirname)
    .wsServer()
    .fireHttpServer(handler => {
      return https.createServer(options, handler)
    })
    .catch(console.error)
})

// const fs = require('fs')
// const options = {
//   key: fs.readFileSync(path.join(__dirname, './server.key')),
//   cert: fs.readFileSync(path.join(__dirname, './server.crt'))
// }

// if (cluster.isMaster) {
//   for (let i=0; i < 4; i ++) {
//     cluster.fork()
//   }
//   require('@adonisjs/websocket/clusterPubSub')()
//   return
// }

// new Ignitor(require('@adonisjs/fold'))
//   .appRoot(__dirname)
//   .wsServer()
//   .fireHttpServer(handler => {
//     return https.createServer(options, handler)
//   })
//   .catch(console.error)