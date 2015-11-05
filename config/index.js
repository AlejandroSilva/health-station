import {
    environment,
    __IS_PRODUCTION__,
    __IS_TESTING__,
    __IS_DEVELOPMENT__
} from '../utils/environment.js'

let appConfig = {}
let libConfig = {}
if(__IS_PRODUCTION__) {
    appConfig = require('./app.js').production
    libConfig = require('./lib.js').production

}else if(__IS_TESTING__){
    appConfig = require('./app.js').testing
    libConfig = require('./lib.js').testing

}else if(__IS_DEVELOPMENT__){
    appConfig = require('./app.js').development
    libConfig = require('./lib.js').development
}else{
    throw new Error(`ambiente de desarrollo ${environment} desconocido, terminando.`)
}

console.log(`Health Station ${appConfig.version}`)
console.log(`Configuración '${environment}' cargada.`)
//console.log(process.env)

export {
    appConfig,
    libConfig
}