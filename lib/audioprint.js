var fs = require('fs'),
    Q = require('q');

module.exports = function (file) {
    return Q.promise(function (resolve, reject) {
        fs.readFile(file, function (err, buffer) {
            if (err) {
                reject(err);
            } else {
                console.log('Read %d bytes.', buffer.length);
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
        console.log('16-bit 8000khz signed-integer audio b16 file.\n%d samples ( %s seconds )', data.length, data.length / 8000);
        var last = 0x8000;
        var chunkSize = 800;
        var freqMap = [];

        for (var i = 0; i < data.length; i += chunkSize) {
            var chunk = [].concat(data.slice(i, i + chunkSize));
            if (chunk.length < chunkSize) {
                chunk = chunk.concat(new Array(chunkSize - chunk.length));
            }
            freqMap.push(chunk.reduce(function (sum, b) {
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