'use strict';
import Sar from '../../lib/SAR.js'
import Ping from '../../lib/Ping.js'
import { discFree } from '../../lib/Disc.js'
import { libConfig } from '../../config/index.js';

let sar  = new Sar(libConfig.sar);
let ping = new Ping(libConfig.ping);

const promiseToResponse = (promise, res)=>{
    promise
        .then( (data)=>{
            res.json(data);
        })
        .catch( (err)=>{
            res.status(500).json(err);
        })
}

export function nodeInfo(req, res){
    res.json({
        title: process.title,
        versions: process.versions
    })
}

export function cpuInfo (req, res){
    promiseToResponse( sar.cpu(), res)
}

export function ramInfo (req, res){
    promiseToResponse(sar.ram(), res)
}

export function spaceInfo (req, res){
    promiseToResponse(discFree(), res)
}

export function discIOInfo (req, res){
    promiseToResponse(sar.discIO(), res)
}
export function netIOInfo (req, res){
    promiseToResponse(sar.netIO(), res)
}

export function pingInfo(req, res){
    promiseToResponse(Promise.all([ping.testNational(), ping.testIntrernational()]), res)
}
export function pingCustom(req, res){
    promiseToResponse(ping.testCustom(req.params.pingHost), res)
}

export function allInfo(req, res, next){
    let cpu = sar.cpu()
    let ram = sar.ram()
    let discMounted = discFree()
    let discIO = sar.discIO()
    let netIO = sar.netIO()
    let pingNac = ping.testNational()
    let pingInt = ping.testIntrernational()
    // llama a todos los procesos de forma asincronica, y espera a que esten todos listos
    Promise.all([cpu, ram, discMounted, discIO, netIO, pingNac, pingInt])
        .then((data)=>{
            res.json({
                cpu: data[0],
                ram: data[1],
                discMounted: data[2],
                discIO: data[3],
                netIO: data[4],
                pingNational: data[5],
                pingInternational: data[6]
            });
        })
        .catch(next);
}