'use strict';

var path = require('path');
var fs = require('graceful-fs');
var jsyaml = require('js-yaml');
var appRoot = require('app-root-path');

module.exports = function (options) {
  return Promise.resolve().then(function () {
    if (options.common.length > 0) {
      return options.common;
    }

    return new Promise(function (resolve, reject) {
      fs.readdir(appRoot.path, function (error, results) {
        if (error) {
          reject(error);
          return;
        }

        var filtered = results.filter(function (r) {
          return (/^serverless.common.ya?ml$/.test(r)
          );
        });

        if (filterd.length === 0) {
          reject('Cannot found common file.');
          return;
        }

        resole(path.resolve(appRoot.path, filtered[0]));
      });
    });
  }).then(function (filePath) {
    return new Promise(function (resolve, reject) {
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