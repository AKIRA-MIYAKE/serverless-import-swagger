'use strict';

var path = require('path');
var fs = require('graceful-fs');
var jsyaml = require('js-yaml');
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
          return (/^serverless.common.ya?ml$/.test(r)
          );
        });

        if (filterd.length === 0) {
          resolve('');
          return;
        }

        resolve(path.resolve(appRoot.path, filterd[0]));
      });
    });
  }).then(function (filePath) {
    return new Promise(function (resolve, reject) {
      if (filePath.length === 0) {
        resolve({});
        return;
      }

      fs.readFile(filePath, 'utf-8', function (error, data) {
        if (error) {
          reject(error);
          return;
        }

        resolve(jsyaml.safeLoad(data));
      });
    });
  });
};