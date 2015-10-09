//https://github.com/danielkrainas/node-netstat/blob/master/lib/activators.js

import childProcess from 'child_process'
import { emitLines, parseLines } from './utils.js'

export const sync = (cmd, args, makeLineHandler, done)=>{
    var processing = true;
    var lineHandler = makeLineHandler(function () {
        processing = false;
    });

    var proc = childProcess.spawnSync(cmd, args);
    if (proc.error) {
        done(proc.error);
    } else {
        var lines = parseLines(proc.stdout);
        for (var i = 0; i < lines.length && processing; i++) {
            lineHandler(lines[i]);
        }
        done(null);
    }
};

export const syncToArray = (cmd, args, done)=>{
    var proc = childProcess.spawnSync(cmd, args);
    if (proc.error) {
        done(proc.error);
    } else {
        // array of lines
        var lines = parseLines(proc.stdout);
        done(null,
            lines
                .map(line=>{
                    // every line, converted to an array of values
                    return line.split(' ').filter(value=>value !== '')
                })
                .filter(line=>{
                    // remove empty lines
                    return line.length>0
                })
        )
    }
};


export const async = (cmd, args, makeLineHandler, done)=>{
    var proc = childProcess.spawn(cmd, args);
    var lineHandler = makeLineHandler(()=>{
        proc.stdout.removeListener('line', lineHandler);
        proc.kill();
    });

    emitLines(proc.stdout);
    proc.on('exit', ()=>{
        done(null);
    });

    proc.on('error', done);
    proc.stdout.on('line', lineHandler);
};