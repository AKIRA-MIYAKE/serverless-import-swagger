'use strict';

var childProcess = require('child_process');
var path = require('path');
var fs = require('graceful-fs');
var appRoot = require('app-root-path');

module.exports = function (converted, options) {
  return Promise.resolve().then(function () {
    return isServiceExists(converted, options);
  }).then(function (exists) {
    return exists ? Promise.resolve(converted) : generateService(converted, options);
  });
};

var isServiceExists = function isServiceExists(converted, options) {
  return Promise.resolve().then(function () {
    return new Promise(function (resolve, reject) {
      fs.readdir(path.resolve(appRoot.path, options.outDir), function (error, results) {
        if (error) {
          if (error.code != 'ENOENT') {
            reject(error);
            return;
          }
          resolve(false);
          return;
        }

        results = results ? results : [];
        var dirName = options.servicePrefix ? converted.service.slice(options.servicePrefix.length + 1) : converted.service;
        resolve(results.some(function (r) {
          return r === dirName;
        }));
      });
    });
  });
};

var generateService = function generateService(converted, options) {
  return Promise.resolve().then(function () {
    return new Promise(function (resolve, reject) {
      var serviceName = options.servicePrefix ? converted.service.slice(options.servicePrefix.length + 1) : converted.service;
      var command = appRoot.path + '/node_modules/.bin/sls create -t aws-nodejs -p ' + options.outDir + '/' + serviceName;

      childProcess.exec(command, function (error, stdout, stderr) {
        if (error) {
          console.log(stderr);
          reject(error);
          return;
        }
        console.log(stdout);
        resolve(converted);
      });
    });
  });
};