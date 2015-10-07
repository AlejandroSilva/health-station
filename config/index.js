'use strict';
import * as app from './app.js';
import * as lib from './lib.js';

let enviroment = process.env.NODE_ENV || 'development';
let _appConfig = {}
let _libConfig = {}

if(enviroment==='production') {
    _appConfig = app.production
    _libConfig = lib.production
}else if(enviroment==='testing'){
    _appConfig = app.test
    _libConfig = lib.test
}else{
    // 'development' es el ambiente por defecto
    _appConfig = app.development
    _libConfig = lib.development
}
console.log(`Configuración '${enviroment}' cargada.`);

export const appConfig = _appConfig
export const libConfig = _libConfig