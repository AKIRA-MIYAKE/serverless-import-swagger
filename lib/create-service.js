'use strict';

var childProcess = require('child_process');
var path = require('path');
var fs = require('graceful-fs');
var appRoot = require('app-root-path');

module.exports = function (config) {
  var outDir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';

  return Promise.resolve().then(function () {
    // Check service exists.
    return new Promise(function (resolve, reject) {
      fs.readdir(path.resolve(appRoot.path, outDir), function (error, results) {
        results = results ? results : [];
        resolve(results.some(function (r) {
          return r === config.service;
        }));
      });
    });
  }).then(function (isExists) {
    return new Promise(function (resolve, reject) {
      // If is not exists, create service.
      if (!isExists) {
        var command = appRoot.path + '/node_modules/.bin/sls create -t aws-nodejs -p ' + outDir + '/' + config.service;
        childProcess.exec(command, function (error, stdout, stderr) {
          if (error) {
            reject(error);
            return;
          }
          console.log(stdout);
          resolve();
        });
        return;
      }

      resolve();
    });
  });
};