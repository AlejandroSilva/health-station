/**
 * Necesita echoscu viene en el paquete 'dcmtk_3.6.0', necesita ser instalado antes
 * http://manpages.ubuntu.com/manpages/natty/man1/echoscu.1.html
 */

// Configuration
//import { libConfig } from '../config/index.js'
import { syncToArray } from '../utils/spawner.js'

export const dicomCheckInstalation = ()=> {
    return new Promise((resolve, reject)=>{
        syncToArray('echoscu', ['--version'], (err, values)=> {
            if(err) return reject(err)

            // destructuring the first line
            let [appName, command, version, date] = values[0]
            resolve({
                command,
                version,
                date
            })
        })
    })
}

import childProcess from 'child_process'

const requestFailedString = 'Association Request Failed: '
const asociationReasonString = 'F: Reason: '
export const dicomEcho = (host, port, aec)=>{
    return new Promise((resolve, reject)=>{
        let proc = childProcess.spawnSync(
            'echoscu',
            [host, port, '-aec', aec, '-to', 3, '-v']
        )
        // si ocurrio algun problema, err trae algunos valores...
        if(proc.error) return reject(proc.error)

        // echoscu entrega las respuesta VALIDAS y las INVALIDAS por stderr
        const stderr = proc.stderr instanceof Buffer? proc.stderr.toString(): proc.stderr

        //const messages = stderr.split('\n');
        //messages.splice(messages.length-1, 1); // quitar el ultimo (es en blanco)
        let response = {
            association: 'Unknown',
            dicomEcho: 'Unknown'
            //completeLog: messages
        }

        // Asociacion correcta
        if( /Association Accepted/.test(stderr) ){
            response.association = 'Accepted'
            // busca en el string, el status del echo
            let statusStart = stderr.lastIndexOf('Status: ') + 'Status: '.length
            let statusEnd = stderr.indexOf(')', statusStart)
            response.dicomEcho = stderr.substring(statusStart, statusEnd)
        }
        // Asociacion Rechazada (etag invalido?)
        else if( /Association Rejected/.test(stderr) ){
            // busca en el string "F: Reason: Called AE Title Not Recognized"
            let reasonStart = stderr.lastIndexOf(asociationReasonString) + asociationReasonString.length
            let reasonEnd = stderr.indexOf('\n', reasonStart)
            response.association = 'Rejected: '+ stderr.substring(reasonStart, reasonEnd)
        }
        // Asociacion Fallida (problemas de red?)
        else if( /Association Request Failed/.test(stderr) ){
            // busca en el string "F: Reason: Called AE Title Not Recognized"
            let failedStart = stderr.lastIndexOf(requestFailedString) + requestFailedString.length
            let failedEnd = stderr.indexOf('\n', failedStart)
            response.association = 'Request Failed: '+ stderr.substring(failedStart, failedEnd)
        }

        resolve(response)
    })
}