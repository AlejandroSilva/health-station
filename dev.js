//import app from './api/app.js';
//import { appConfig } from './config/index.js';
//
///**
// * Iniciar la estacion health
// */
//
//let server = app.listen(appConfig.port, ()=>{
//    console.log(`Servicio iniciado en http://localhost:${appConfig.port}/`);
//});

//import { interfacesInfo } from './modules/Network.js'
//interfacesInfo()
//.then((data)=>console.log("ok", data))
//.catch((err)=>console.log("err", err))

//sync(
//    'ifconfig',
//    [],
//    // line handler
//    (stopParsing)=>{
//        return (line)=>{
//            console.log(line)
//        }
//    },
//    // onDone
//    (err)=>{
//        console.log("done", err)
//    }
//)
/*
let resp = `eth0      Link encap:Ethernet  HWaddr 78:2b:cb:0d:51:e4
inet addr:200.112.228.124  Bcast:200.112.228.127  Mask:255.255.255.248
inet6 addr: fe80::7a2b:cbff:fe0d:51e4/64 Scope:Link
UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
RX packets:16046197 errors:0 dropped:0 overruns:0 frame:0
TX packets:8752810 errors:0 dropped:0 overruns:0 carrier:0
collisions:0 txqueuelen:1000
RX bytes:7693153494 (7.6 GB)  TX bytes:5013625679 (5.0 GB)
Interrupt:36 Memory:d2000000-d2012800

eth1      Link encap:Ethernet  HWaddr 78:2b:cb:0d:51:e6
inet addr:10.6.144.208  Bcast:10.6.144.255  Mask:255.255.255.0
inet6 addr: fe80::7a2b:cbff:fe0d:51e6/64 Scope:Link
UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
RX packets:542044151 errors:0 dropped:0 overruns:0 frame:0
TX packets:278864001 errors:0 dropped:0 overruns:0 carrier:0
collisions:0 txqueuelen:1000
RX bytes:648494656210 (648.4 GB)  TX bytes:98727039354 (98.7 GB)
Interrupt:48 Memory:d4000000-d4012800

lo        Link encap:Local Loopback
inet addr:127.0.0.1  Mask:255.0.0.0
inet6 addr: ::1/128 Scope:Host
UP LOOPBACK RUNNING  MTU:16436  Metric:1
RX packets:275510930 errors:0 dropped:0 overruns:0 frame:0
TX packets:275510930 errors:0 dropped:0 overruns:0 carrier:0
collisions:0 txqueuelen:0
RX bytes:114685960577 (114.6 GB)  TX bytes:114685960577 (114.6 GB)`
let lines = resp.split('\n')
let values = lines.map(line=>{
    return line.split(' ').filter(value=>{return value!==' '&&value!==''})
})
.filter(line=>line.length>0) // quitar lineas en blanco
*/
import { sync, syncToArray, async } from './lib/spawner.js'
import { Linux_getInterfacesInfo } from './modules/Network.js'

Linux_getInterfacesInfo()
.then(d=>console.log(d))
.catch(e=>console.log(e))