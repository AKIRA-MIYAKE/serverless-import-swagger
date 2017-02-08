'use strict';

var path = require('path');
var fs = require('graceful-fs');
var jsyaml = require('js-yaml');
var appRoot = require('app-root-path');

module.exports = function (config, options) {
  return Promise.resolve().then(function () {
    return new Promise(function (resolve, reject) {
      var dirName = options.servicePrefix ? config.service.slice(options.servicePrefix.length + 1) : config.service;
      var filePath = path.resolve(appRoot.path, options.outDir, dirName, './serverless.yml');

      fs.writeFile(filePath, jsyaml.safeDump(config), 'utf8', function (error) {
        if (error) {
          reject(error);
          return;
        }
        console.log('Write serverless.yml of ' + config.service + ' complete.');
        resolve();
      });
    });
  });
};