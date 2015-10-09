'use strict';
import * as app from './app.js';
import * as lib from './lib.js';

let enviroment = process.env.NODE_ENV || 'development';
let appConfig = {}
let libConfig = {}

if(enviroment==='production') {
    appConfig = app.production
    libConfig = lib.production
}else if(enviroment==='testing'){
    appConfig = app.testing
    libConfig = lib.testing
}else{
    // 'development' es el ambiente por defecto
    appConfig = app.development
    libConfig = lib.development
}

console.log(`Health Station ${appConfig.version}`);
console.log(`Configuración '${enviroment}' cargada.`);

export { appConfig, libConfig }