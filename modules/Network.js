import os from 'os'
import { sync, syncToArray, async } from '../lib/spawner.js'
import { bitrateForHumans } from '../lib/converter.js'

// Configuration
import { libConfig } from '../config/index.js'

// network IO, show the interfaces throughput
const OSX_getInterfacesInfo = ()=>{
    return new Promise((resolve, reject)=>{
        syncToArray('netstat', ['-ib'], (err, values)=> {
            const interfaces =
                values.filter(lineValues=>{
                    if(lineValues.length===11) {
                        return (
                            lineValues[0] !== 'Name' &&         // remove header
                            lineValues[0] !== 'lo0' &&          // remove lo device
                            lineValues[3].indexOf(':') === -1   // remove ipv6
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
                        TXbytes: lineValues[9],
                    }
                })
            resolve(interfaces)
        })
    })
}
const Linux_getInterfacesInfo = ()=>{
    return new Promise((resolve, reject)=>{

    })
}



export const interfacesInfo = ()=>{
    return new Promise((resolve, reject)=>{
        let _getInterfacesInfo = null
        switch(os.type()) {
            case 'Darwin':
                _getInterfacesInfo = OSX_getInterfacesInfo
                break
            case 'Linux':
                _getInterfacesInfo = Linux_getInterfacesInfo
            default:
                return Promise.reject('unsupported OS')
        }
        let interfacesStart = _getInterfacesInfo()

        setTimeout(()=> {
            // esperar unos segundos antes de volver a tomar datos para comparar
            let interfacesEnd = _getInterfacesInfo()
            Promise.all([interfacesStart, interfacesEnd])
                .then(([start, end])=>{
                    // calcular la diferencia de datos en el tiempo
                    resolve(
                        end.map((int, index)=>{
                            int.RXpkts  -= start[index].RXpkts
                            int.RXbytes -= start[index].RXbytes
                            int.TXpkts  -= start[index].TXpkts
                            int.TXbytes -= start[index].TXbytes
                            int.time = libConfig.network.timeMeasured
                            int.RXbitrate = bitrateForHumans(int.RXbytes, libConfig.network.timeMeasured)
                            int.TXbitrate = bitrateForHumans(int.TXbytes, libConfig.network.timeMeasured)
                            return int
                        })
                    )
                })
                .catch(reject)

        }, libConfig.network.timeMeasured*1000)
    })
}


// IO, interfaces + io + packs
// OSX = netstat -ib
// LINUX = ifconfig *ie