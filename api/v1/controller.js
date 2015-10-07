'use strict';
import Sar from '../../lib/SAR.js'
import Ping from '../../lib/Ping.js'
import { libConfig } from '../../config/index.js';

let sar  = new Sar(libConfig.sar);
let ping = new Ping(libConfig.ping);

export function nodeInfo(req, res){
    res.json({
        title: process.title,
        versions: process.versions
    })
}

export function cpuInfo (req, res){
    sar.cpu()
        .then( (data)=>{
            res.json(data);
        })
        .catch( (err)=>{
            res.status(500).json(err);
        })
}

export function ramInfo (req, res){
    sar.ram()
        .then( (data)=>{
            res.json(data);
        })
        .catch( (err)=>{
            res.status(500).json(err);
        })
}

export function spaceInfo (req, res){
    sar.discMounted()
        .then( (data)=>{
            res.json(data);
        })
        .catch( (err)=>{
            res.status(500).json(err);
        })
}

export function discIOInfo (req, res){
    sar.discIO()
        .then( (data)=>{
            res.json(data);
        })
        .catch( (err)=>{
            res.status(500).json(err);
        })
}
export function netIOInfo (req, res){
    sar.netIO()
        .then( (data)=>{
            res.json(data);
        })
        .catch( (err)=>{
            res.status(500).json(err);
        })
}

export function pingInfo(req, res){
    Promise.all([ping.testNational(), ping.testIntrernational()])
        .then( (data)=>{
            res.json(data);
        })
        .catch( (err)=>{
            res.status(500).json(err);
        })
}
export function pingCustom(req, res){
    ping.testCustom(req.params.pingHost)
        .then( (data)=>{
            res.json(data);
        })
        .catch( (err)=>{
            res.status(500).json(err);
        })
}

export function allInfo(req, res, next){
    let cpu = sar.cpu();
    let ram = sar.ram();
    let discMounted = sar.discMounted();
    let discIO = sar.discIO();
    let netIO = sar.netIO();
    let pingNac = ping.testNational();
    let pingInt = ping.testIntrernational();
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