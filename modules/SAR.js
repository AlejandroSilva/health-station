import process from 'child_process';

class Sar{
    constructor(config){
        this.interval = config.interval || 1;
        this.count = config.count || 3;
    }
    _KBForHumans(kbytes){
        if      (kbytes>=1000000000) return (kbytes/1000000000).toFixed(2)+' TB';
        else if (kbytes>=1000000)    return (kbytes/1000000).toFixed(2)+' GB';
        else if (kbytes>=1000)       return (kbytes/1000).toFixed(2)+' MB';
        else                         return  kbytes+' kB';
    }
    static _exec(command){
        return new Promise( (resolve, reject)=>{
            process.exec(
                command,
                (err, stdout, stderr)=>{
                    if(stderr) {
                        return reject(stderr);
                    }

                    // divide el stdout en lineas individuales, y quita las que estan en blanco
                    let lines = stdout.split('\n').filter(function (line) {
                        return line!=='';
                    });
                    resolve(lines);
                }
            );
        })
    }
    static version(){
        return new Promise( (resolve, reject)=>{
            // ejecuta la version
            Sar._exec('sar -V')
                .then( (data)=>{
                    resolve( data[0] );
                })
                .catch( (err)=>{
                    reject(err);
                })
        });
    }
    //cpu(){
    //    let command = `sar -P ALL ${this.interval} ${this.count}`;
    //    return new Promise( (resolve, reject)=>{
    //        // ejecuta el comando...
    //        Sar._exec(command)
    //            // si lo ejecuta bien, parsea la respuesta
    //            .then( (lines)=>{
    //                // filtrar las linas que no entrega informacion sobre la 'Media'
    //                let interfaceValues = lines.map( (line)=>{
    //                    let lineValues = line.trim().split(/\s+/g);
    //                    // descartar todas las lineas que no formen parte de la media.. incluyento la linea de cabecera
    //                    if(lineValues[0]==='Media:' && lineValues[1]!=='CPU'){
    //                        //Media:          CPU     %user     %nice   %system   %iowait    %steal     %idle
    //                        return {
    //                            CPU: lineValues[1],
    //                            userPercent: +lineValues[2].replace(',', '.'),
    //                            nicePercent: +lineValues[3].replace(',', '.'),
    //                            systemPercent: +lineValues[4].replace(',', '.'),
    //                            iowaitPercent: +lineValues[5].replace(',', '.'),
    //                            stealPercent: +lineValues[6].replace(',', '.'),
    //                            idlePercent: +lineValues[7].replace(',', '.')
    //                        }
    //                    }
    //                }).filter( (line)=>{
    //                    // quita del array todas las lineas que fueron descartadas en el .map
    //                    return line!=undefined
    //                });
    //
    //                resolve(interfaceValues);
    //            })
    //            // si no, retorna el error
    //            .catch(function(err){
    //                reject(err);
    //            });
    //    });
    //}
    //ram(){
    //    let command = `sar -r ${this.interval} ${this.count}`;
    //    return new Promise( (resolve, reject)=>{
    //        // ejecuta el comando...
    //        Sar._exec(command)
    //            // si lo ejecuta bien, parsea la respuesta
    //            .then( (lines)=>{
    //                // al ultima linea, 'Media', corresponde a los valores promedio de la prueba
    //                let media = lines[lines.length-1];
    //                let mediaValues = media.trim().split(/\s+/g);
    //
    //                //12:52:40    kbmemfree kbmemused  %memused kbbuffers  kbcached  kbcommit   %commit  kbactive   kbinact   kbdirty
    //                resolve({
    //                    // +'123', convierte el string '123', en el numero 123
    //                    kbfree: +mediaValues[1],
    //                    kbused: +mediaValues[2],    // no toma en cuenta la del kernel
    //                    kbbuffers: +mediaValues[4], // usada por el kernel para buffer
    //                    kbcached: +mediaValues[5],  //  usada por el kernel para cache
    //                    free: this._KBForHumans(+mediaValues[1]),
    //                    used: this._KBForHumans(+mediaValues[2]),
    //                    percentUsed: +mediaValues[3].replace(',', '.')
    //                });
    //            })
    //            // si no, retorna el error
    //            .catch(function(err){
    //                reject(err);
    //            });
    //    });
    //}
    discIO(){
        let command = `sar -b ${this.interval} ${this.count}`;
        return new Promise( (resolve, reject)=>{
            // ejecuta el comando...
            Sar._exec(command)
                // si lo ejecuta bien, parsea la respuesta
                .then( (lines)=>{
                    // al ultima linea, 'Media', corresponde a los valores promedio de la prueba
                    let media = lines[lines.length-1];
                    let mediaValues = media.trim().split(/\s+/g);

                    // 13:48:53          tps      rtps      wtps   bread/s   bwrtn/s
                    resolve({
                        totalRequestPerSecond: +mediaValues[1].replace(',', '.'),
                        readRequestPerSecond: +mediaValues[2].replace(',', '.'),
                        writeRequestPerSecond: +mediaValues[3].replace(',', '.'),
                        blockReadsPerSecond: +mediaValues[4].replace(',', '.'),
                        // Total amount of data read from the devices in blocks per second.
                        // Blocks are equivalent to sectors with 2.4 kernels and newer and therefore have a size of 512 bytes.
                        // With older kernels, a block is of indeterminate size.
                        blockWritesPerSecond: +mediaValues[5].replace(',', '.')
                    });
                })
                // si no, retorna el error
                .catch(function(err){
                    reject(err);
                });
        });
    }
};

export default Sar;