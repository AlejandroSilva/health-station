// https://github.com/danielkrainas/node-netstat/blob/master/lib/utils.js

// only care about complete lines, return remainder and let callee handle it
const forEachLine = (text, handler)=>{
    let n = text.indexOf('\n');
    while (n > -1) {
        handler(text.substring(0, n));
        text = text.substring(n + 1);
        n = text.indexOf('\n');
    }
    return text;
};

export const emitLines = (stream)=>{
    var backlog = '';
    stream.on('data', function (data) {
        backlog = forEachLine(backlog + data, function (line) {
            stream.emit('line', line);
        });
    });

    stream.on('end', function () {
        if (backlog) {
            stream.emit('line', backlog);
        }
    });
};

export const parseLines = (source)=>{
    let lines = [];
    let r = forEachLine(source.toString(), lines.push.bind(lines));
    if (r.length) {
        lines.push(r);
    }
    return lines;
};