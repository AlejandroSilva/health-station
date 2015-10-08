import df from 'node-df'

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
                        .filter((mount)=>mount.size!==0)
                        .map((mount)=>{
                            mount.free = mount.size - mount.used
                            //mount.percent = Math.round((mount.used/mount.size)*100)
                            mount.percent = mount.capacity*100
                            return mount
                        })
                )
            }
        })
    })
}


export { discFree }