// https://github.com/sindresorhus/pretty-bytes/blob/master/index.js

export const bytesForHuman = function (num) {
    if (typeof num !== 'number' || Number.isNaN(num)) {
        throw new TypeError('Expected a number');
    }

    var exponent;
    var unit;
    var neg = num < 0;
    var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    if (neg) {
        num = -num;
    }

    if (num < 1) {
        return (neg ? '-' : '') + num + ' B';
    }

    exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
    num = (num / Math.pow(1000, exponent)).toFixed(2) * 1;
    unit = units[exponent];

    return (neg ? '-' : '') + num + ' ' + unit;
};

import bitrate from 'bitrate'
export const bitrateForHumans = (bytes, seconds)=>{
    if(bytes>=125000){
        let rate = bitrate(bytes, seconds, 'mbps')
        // '4.123124414 mbps' to '3.1 mbps'
        rate = Math.round(rate*10)/10
        return rate+' mbps'
    }else{
        return `${Math.round(bitrate(bytes, seconds, 'kbps'))} kbps`
    }
}