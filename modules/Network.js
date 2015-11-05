import os from 'os'
import { syncToArray } from '../utils/spawner.js'
import { bitrateForHumans } from '../utils/converter.js'

// Configuration
import { libConfig } from '../config/index.js'

// network IO, show the interfaces throughput
const OSX_getInterfacesInfo = ()=>{
    return new Promise((resolve, reject)=>{
        syncToArray('netstat', ['-ib'], (err, values)=> {
            if(err) return reject(err)

            const interfaces =
                values.filter(lineValues=>{
                    if(lineValues.length===11) {
                        return (
                            lineValues[0] !== 'Name' &&          // remove header line
                            lineValues[0] !== 'lo0' &&           // remove lo device
                            lineValues[0].indexOf(':') === -1 && // remove virtual interface
                            lineValues[3].indexOf(':') === -1    // remove ipv6
                        )
                    }else{
                        return false
                    }
                })
                .map(lineValues=>{
                    return {
                        interface: lineValues[0],
                        address: lineValues[3],
                        RXpkts: lineValues[4],
                        RXbytes: lineValues[6],
                        TXpkts: lineValues[7],
                        TXbytes: lineValues[9]
                    }
                })
            resolve(interfaces)
        })
    })
}
const Linux_getInterfacesInfo = ()=> {
    return new Promise((resolve, reject)=> {
        syncToArray('netstat', ['-ie'], (err, values)=> {
            if(err) return reject(err)

            const parsedInterfaces = values.reduce(([interfaces, current], line)=> {
                if (line[1] === 'Link') {
                    // eth0      Link encap:Ethernet  HWaddr 78:2b:cb:0d:51:e4
                    // Name of the interface
                    current.interface = line[0]
                } else if (line[0] === 'inet' && line[1].indexOf('addr:') !== -1) {
                    //inet addr:200.112.228.124  Bcast:200.112.228.127  Mask:255.255.255.248
                    current.address = line[1].replace('addr:','')

                } else if (line[0] === 'RX' && line[1].indexOf('packets:') !== -1) {
                    // RX packets:542044151 errors:0 dropped:0 overruns:0 frame:0
                    current.RXpkts = parseInt(line[1].replace('packets:',''))

                } else if (line[0] === 'TX' && line[1].indexOf('packets:') !== -1) {
                    // TX packets:542044151 errors:0 dropped:0 overruns:0 frame:0
                    current.TXpkts = parseInt(line[1].replace('packets:',''))

                } else if (line[0] === 'RX' && line[1].indexOf('bytes:') !== -1) {
                    // RX bytes:648494656210 (648.4 GB)  TX bytes:98727039354 (98.7 GB)
                    current.RXbytes = parseInt(line[1].replace('bytes:',''))
                    current.TXbytes = parseInt(line[5].replace('bytes:',''))
                }

                else if (line[0].indexOf('Interrupt:')!==-1 || line[0].indexOf('Memory:')!==-1) {
                    // Interrupt:48 Memory000:d4000000-d4012800
                    // las line with information about a interface, the following info corresponds to another interface
                    interfaces.push(current)
                    current = {}

                } else {
                    // other line, ignored
                    //console.log(line)
                }
                return [interfaces, current]
            }, [[], {}])
            let [interfaces, lastInterface] = parsedInterfaces
            // remove virtual interfaces
            resolve(interfaces.filter(int=>int.interface.indexOf(':')===-1))
        })
    })
}

export const interfacesInfo = ()=>{
    return new Promise((resolve, reject)=>{
        let _getInterfacesInfo = null
        const OS = os.type()
        if(OS==='Darwin') {
            _getInterfacesInfo = OSX_getInterfacesInfo
        }else if(OS==='Linux') {
            _getInterfacesInfo = Linux_getInterfacesInfo
        }else{
            return reject('unsupported OS')
        }

        let promiseStart = _getInterfacesInfo()
        setTimeout(()=> {
            // esperar unos segundos antes de volver a tomar datos para comparar
            let promiseEnd = _getInterfacesInfo()
            Promise.all([promiseStart, promiseEnd])
                .then(([start, end])=>{
                    // calcular la diferencia de datos en el tiempo
                    resolve( end.map((int, index)=>{
                        let RXbytes = int.RXbytes - start[index].RXbytes
                        let TXbytes = int.TXbytes - start[index].TXbytes
                        return {
                            interface: int.interface,
                            address: int.address,
                            RXpkts: int.RXpkts - start[index].RXpkts,
                            RXbytes,
                            TXpkts: int.TXpkts - start[index].TXpkts,
                            TXbytes,
                            time: libConfig.network.timeMeasured,
                            RXbitrate: bitrateForHumans(RXbytes, libConfig.network.timeMeasured),
                            TXbitrate: bitrateForHumans(TXbytes, libConfig.network.timeMeasured)
                        }
                    }))
                })
                .catch(reject)

        }, libConfig.network.timeMeasured*1000)
    })
}
// IO, interfaces + io + packs
// OSX = netstat -ib
// LINUX = ifconfig *ie