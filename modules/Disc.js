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
                        .filter((mount)=>{
                            return mount.size!==0 &&
                                mount.filesystem!=='none' &&
                                mount.mount!=='/boot'           // no nos interesa la unidad de booteo
                        })
                        .map((mount)=>{
                            const free = mount.size - mount.used
                            return {
                                filesystem: mount.filesystem,
                                mount: mount.mount,
                                blocksFree: free,
                                blocksUsed: mount.used,
                                blocksTotal: mount.size,
                                free: sizeParser(free*1024),
                                used: sizeParser(mount.used*1024),
                                total: sizeParser(mount.size*1024),
                                percentUsed: Math.round(mount.used*100/mount.size)
                            }
                        })
                )
            }
        })
    })
}
export { discFree }