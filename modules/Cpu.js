import os from 'os'
import { libConfig } from '../config/index.js'

export const cpuData = ()=>{
    return new Promise((resolve, reject)=>{
        const cpuStart = os.cpus()
        const msMeasured = libConfig.cpu.timeMeasured*1000

        setTimeout(()=>{
            const cpuEnd = os.cpus()

            // sacar la diferencia entre las dos muestras
            const cpusData = cpuEnd.map((cpu, index)=>{
                cpu.times.user -= cpuStart[index].times.user
                cpu.times.sys  -= cpuStart[index].times.sys
                cpu.times.idle -= cpuStart[index].times.idle
                return cpu
            })

            // no nos interesan todos los datos, hacemos un reduce para resumir la info de las cpus
            const reducedData = cpusData.reduce((prev, current)=>{
                prev.times.user += current.times.user
                prev.times.sys  += current.times.sys
                prev.times.idle += current.times.idle
                return prev
            })

            resolve({
                ...reducedData,
                secMeasured: libConfig.cpu.timeMeasured,
                percentUser: Math.round(reducedData.times.user*10/(msMeasured*cpusData.length)),
                percentSys:  Math.round(reducedData.times.sys*10/(msMeasured*cpusData.length)),
                percentIdle: Math.round(reducedData.times.idle*10/(msMeasured*cpusData.length))
            })
        }, msMeasured)
    })
}