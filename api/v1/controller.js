'use strict';
import Sar from '../../modules/SAR.js'
import Ping from '../../modules/Ping.js'
import { interfacesInfo } from '../../modules/Network.js'
import { discFree } from '../../modules/Disc.js'
import { libConfig } from '../../config/index.js';
import os from 'os'
import { memData } from '../../modules/Mem.js'
import { cpuData } from '../../modules/Cpu.js'

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
        hostname: os.hostname(),
        type: os.type(),        // Ex. Linux, Darwin
        release: os.release(),  // kernel version
        arch: os.arch(),        // Ex. x64
        uptime: os.uptime(),    // in seconds
        title: process.title,
        nodeVersion: process.versions.node,
        v8version: process.versions.v8
    })
}

export function cpuInfo (req, res){
    promiseToResponse( cpuData(), res)
}

export function ramInfo (req, res){
    res.json(memData())
}

export function spaceInfo (req, res){
    promiseToResponse(discFree(), res)
}

export function discIOInfo (req, res){
    promiseToResponse(sar.discIO(), res)
}
export function netIOInfo (req, res){
    promiseToResponse(interfacesInfo(), res)
}

export function pingInfo(req, res){
    promiseToResponse(Promise.all([ping.testNational(), ping.testIntrernational()]), res)
}
export function pingCustom(req, res){
    promiseToResponse(ping.testCustom(req.params.pingHost), res)
}

export function allInfo(req, res, next){
    let cpu = cpuData()
    let ram = memData()
    let discMounted = discFree()
    let discIO = sar.discIO()
    let netIO = interfacesInfo()
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