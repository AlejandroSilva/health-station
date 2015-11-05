//https://github.com/danielkrainas/node-netstat/blob/master/lib/activators.js

const options = {
    env: {
        'LC_ALL': 'C'
    }
}

import childProcess from 'child_process'
import {
    emitLines,
    parseLines,
    linesToArray
} from './parsers.js'

export const sync = (cmd, args, makeLineHandler, done)=>{
    var processing = true
    var lineHandler = makeLineHandler(function () {
        processing = false
    })

    var proc = childProcess.spawnSync(cmd, args, options)
    if (proc.error) {
        done(proc.error)
    } else {
        var outLines = parseLines(proc.stdout)
        //var errLines = parseLines(proc.stderr)
        for (var i = 0; i < outLines.length && processing; i++) {
            lineHandler(outLines[i])
        }
        done(null, proc.stdout, proc.stderr)
    }
}


export const syncToArray = (cmd, args, done)=>{
    var proc = childProcess.spawnSync(cmd, args, options)
    if (proc.error) {
        done(proc.error)
    } else {
        // array of lines
        var outLines = parseLines(proc.stdout)
        var errLines = parseLines(proc.stderr)
        done(
            null,
            linesToArray(outLines),
            linesToArray(errLines)
        )
    }
}


export const async = (cmd, args, makeLineHandler, done)=>{
    var proc = childProcess.spawn(cmd, args, options)
    var lineHandler = makeLineHandler(()=>{
        proc.stdout.removeListener('line', lineHandler)
        proc.kill()
    })

    emitLines(proc.stdout)
    proc.on('exit', ()=>done(null))

    proc.on('error', done)
    proc.stdout.on('line', lineHandler)
}