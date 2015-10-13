import os from 'os'
import sizeParser from 'filesize'

const freemem = os.freemem()
const totalmem = os.totalmem()
const usedmem = totalmem-freemem

export const memInfo = ()=>{
    return {
        kbfree: freemem,
        kbtotal: totalmem,
        kbused: usedmem,
        //kbbuffers: 1802636,
        //kbcached: 12012459,
        free: sizeParser(freemem),
        used: sizeParser(usedmem),
        total: sizeParser(totalmem),
        percentUsed: Math.round((usedmem / totalmem))
    }
}
