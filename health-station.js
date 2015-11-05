import app from './api/app.js'
import { appConfig } from './config/index.js'

/**
 * Iniciar la estacion health
 */
let server = app.listen(appConfig.port, ()=>{
    console.log(`Servicio iniciado en http://localhost:${appConfig.port}/`)
})