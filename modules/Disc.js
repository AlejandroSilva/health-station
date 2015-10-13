import df from 'node-df'
import sizeParser from 'filesize'

const discFree = ()=>{
    return new Promise((resolve, reject)=>{
        df((err, data)=>{
            if(err){
                reject(err)

            }else{
                // hay puntos de montaje que tienen espacio 0, son unidades logicas, no nos interesan...
                // Ej:
                //{ filesystem: 'map -hosts',
                //    size: 0,
                //    used: 0,
                //    available: 0,
                //    capacity: 1,
                //    mount: '/net' }
                resolve(
                    data
                        .filter((mount)=>mount.size!==0 && mount.filesystem!=='none')
                        .map((mount)=>{
                            const free = mount.size - mount.used
                            return {
                                filesystem: mount.filesystem,
                                mount: mount.mount,
                                kbfree: free,
                                kbused: mount.used,
                                kbtotal: mount.size,
                                free: sizeParser(free),
                                used: sizeParser(mount.used),
                                total: sizeParser(mount.size),
                                percent: mount.capacity*100
                            }
                        })
                )
            }
        })
    })
}
export { discFree }