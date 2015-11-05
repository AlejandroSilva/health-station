// Inyecta los valores del env filede configuracion a environment
import path from 'path'
import env from 'node-env-file'


let appConfig = {}
let libConfig = {}
let enviroment = process.env.NODE_ENV || 'development'
if(enviroment==='production') {
    env(path.join(__dirname, '../app.prod.env'), {
        //verbose: true,
        //logger: console,
        overwrite: true
    })
    appConfig = require('./app.js').production
    libConfig = require('./lib.js').production

}else if(enviroment==='testing'){
    env(path.join(__dirname, '../app.test.env'), {
        //verbose: true,
        //logger: console,
        overwrite: true
    })
    appConfig = require('./app.js').testing
    libConfig = require('./lib.js').testing

}else{
    // 'development' es el ambiente por defecto
    enviroment = 'development'
    env(path.join(__dirname, '../app.dev.env'), {
        //verbose: true,
        //logger: console,
        overwrite: true
    })
    appConfig = require('./app.js').development
    libConfig = require('./lib.js').development
}

console.log(`Health Station ${appConfig.version}`)
console.log(`Configuración '${enviroment}' cargada.`)
//console.log(process.env)

export {
    appConfig,
    libConfig
}