import path from 'path'
import fsExtra from 'fs-extra'
import fs from 'fs'
import env from 'node-env-file'

// ##
// ## Detecta el ambiente que se esta ejecutando
// ##
const NODE_ENV = process.env.NODE_ENV
// verificamos que las variables globales sean validas
let _env
if(NODE_ENV==='production' || NODE_ENV==='testing' || NODE_ENV==='development') {
    _env = NODE_ENV
}else{
    console.log(`ambiente de desarrollo '${NODE_ENV}' desconocido, se utilizara 'development'.`)
    _env = 'development'
}
export const environment = _env
export const __IS_PRODUCTION__  = environment==='production'
export const __IS_TESTING__     = environment==='testing'
export const __IS_DEVELOPMENT__ = environment==='development'


// ##
// ## Inyecta los valores del env file de configuracion a environment
// ##
const prodEnvPath = path.join(__dirname, '../app.prod.env')
const devEnvPath  = path.join(__dirname, '../app.dev.env')
const testEnvPath = path.join(__dirname, '../app.test.env')
const defaultEnvPath = path.join(__dirname, '/app.default.env')


let loadEnvfile = (envfilePath, options)=>{
    console.log(`[ENVFILE] cargando variables de entorno de '${envfilePath}'.`)
    env(envfilePath, options)
}
let loadOrCreateEnvfile = (envfilePath, options)=>{
    try{
        let stats = fs.statSync(envfilePath)
        if(stats.isFile()) {
            loadEnvfile(envfilePath, options)
        }else{
            throw new Exception(`[ENVFILE] '${envfilePath}' existe pero no es un archivo.`)
        }
    }catch (exception){
        console.log(`[ENVFILE] Creando archivo '${envfilePath}'...`)
        // si no existe, hacer una copia del archivo por defecto y cargar os datos
        let copy = fsExtra.copySync(defaultEnvPath, envfilePath)
        // (la verdad es que o estoy seguro si fsExtra retorna algo para hacer manejo de errores)
        if(copy){
            console.log(`[ENVFILE] Error copiando '${envfilePath}'. (${err})`)
        }else{
            console.log(`[ENVFILE]'${envfilePath}' creado.`)
            loadEnvfile(envfilePath, options)
        }
    }
}

if(__IS_PRODUCTION__) {
    loadOrCreateEnvfile(prodEnvPath,{ /*verbose: true, logger: console,*/ overwrite: true})

}else if(__IS_TESTING__){
    loadOrCreateEnvfile(testEnvPath,{ /*verbose: true, logger: console,*/ overwrite: true})

}else if(__IS_DEVELOPMENT__){
    loadOrCreateEnvfile(devEnvPath,{ /*verbose: true, logger: console,*/ overwrite: true})
}