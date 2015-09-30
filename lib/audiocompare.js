var Q = require('q');
var freq = require('./.');
var maps = [];

module.exports = function (fileA, fileB) {
    return Q.all([freq(fileA), freq(fileB)])
        .spread(function (a, b) {
            return Math.abs(a.reduce(function (sum, c, i) {
                sum += c - b[i];
                return sum;
            }, 0)) / a.length;
        });
}