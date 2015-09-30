var fs = require('fs'),
    Q = require('q'),
    debug = require('./debugger');

/*
Process 16-bit 8000khz signed-integer signed linear audio file.
to generate frequency map on 10ms chunk.

All files must be the same
*/
module.exports = function (file) {
    return Q.promise(function (resolve, reject) {
        fs.readFile(file, function (err, buffer) {
            if (err) {
                reject(err);
            } else {
                debug.info('Read %d raw bytes.', buffer.length);
                resolve(buffer.toJSON().data
                    .reduce(function (buff, c, i) {
                        if (!(i % 2)) {
                            buff.push(c);
                        } else {
                            buff[buff.length - 1] = (buff[buff.length - 1] << 8) + c;
                        }
                        return buff;
                    }, []));
            }
        });
    }).then(function (data) {
        debug.info('%d samples ( %s seconds )', data.length, data.length / 8000);
        var zeroLine = 0x8000,
            lastPosition = zeroLine, // 0 in 16 bit signed linear
            chunkSize = 800, // process 10 ms chunks
            freqMap = []; // frequency map

        for (var i = 0; i < data.length; i += chunkSize) {
            var chunk = [].concat(data.slice(i, i + chunkSize));
            // chunk padding
            if (chunk.length < chunkSize) {
                chunk = chunk.concat(new Array(chunkSize - chunk.length));
            }
            freqMap.push(chunk.reduce(function (sum, b) {
                // sum a hertz when it crosses middle line
                if ((last < 0x8000 && b >= 0x8000) || (last >= 0x8000 && b < 0x8000)) {
                    sum += 1;
                }
                last = b;
                return sum;
            }, 0));
        }
        return freqMap;
    });
};