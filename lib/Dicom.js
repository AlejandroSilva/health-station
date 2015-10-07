'use strict';

/**
 * Necesita echoscu viene en el paquete 'dcmtk_3.6.0', necesita ser instalado antes
 * http://manpages.ubuntu.com/manpages/natty/man1/echoscu.1.html
 */

import process from 'child_process'; // system api

export default class Dicom{
    static version(host, ip, aec){
        return new Promise( function(resolve, reject) {
            process.exec(`echoscu --version`,
                function (err, stdout, stderr) {
                    if (err) {
                        return reject(stderr);
                    }
                    let lines = stdout.split('\n');
                    resolve(lines[0]);
                }
            );
        })
    }
    static echo(host, ip, aec){
        return new Promise( function(resolve, reject){
            process.exec(
                `echoscu ${host} ${ip} -aec ${aec} -v`,
                function (err, stdout, stderr) {
                    // la informacion del echo correcto o incorrecto siempre esta en stderr
                    let messages = stderr.split('\n');
                    messages.splice(messages.length-1, 1); // quitar el ultimo (es en blanco)

                    let response = {
                        association: 'Unknown',
                        dicomEcho: 'Unknown',
                        log: messages
                    };

                    // Asociacion correcta
                    if( /Association Accepted/.test(stderr) ){
                        response.association = 'Accepted';
                        // busca en el string, el status del echo
                        let statusStart = stderr.lastIndexOf('Status: ') + 'Status: '.length;
                        let statusEnd = stderr.indexOf(')', statusStart);
                        response.dicomEcho = stderr.substring(statusStart, statusEnd);
                    }
                    // Asociacion Rechazada (etag invalido?)
                    else if( /Association Rejected/.test(stderr) ){
                        response.association = 'Rejected';
                    }
                    // Asociacion Fallida (problemas de red?)
                    else if( /Association Request Failed/.test(stderr) ){
                        response.association = 'Request Failed';
                    }

                    // si ocurrio algun problema, err trae algunos valores...
                    if(err){
                        reject(response);
                    }else{
                        resolve(response);
                    }
                }
            );
        });
    }
}