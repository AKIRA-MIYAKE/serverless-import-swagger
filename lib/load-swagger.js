'use strict';

var path = require('path');
var fs = require('graceful-fs');
var swaggerParser = require('swagger-parser');
var appRoot = require('app-root-path');

module.exports = function () {
  var filePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return Promise.resolve().then(function () {
    if (filePath.length > 0) {
      return filePath;
    }

    return new Promise(function (resolve, reject) {
      fs.readdir(appRoot.path, function (error, results) {
        if (error) {
          reject(error);
          return;
        }

        var filterd = results.filter(function (r) {
          return (/^swagger.ya?ml$/.test(r)
          );
        });

        if (filterd.length === 0) {
          resolve('');
        }

        resolve(path.resolve(appRoot.path, filterd[0]));
      });
    });
  }).then(function (filePath) {
    return swaggerParser.parse(filePath);
  });
};