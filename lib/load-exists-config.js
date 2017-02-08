'use strict';

var path = require('path');
var fs = require('graceful-fs');
var jsyaml = require('js-yaml');
var appRoot = require('app-root-path');

module.exports = function (converted, options) {
  return Promise.resolve().then(function () {
    return loadExistsConfig(converted, options);
  }).then(function (exists) {
    return [converted, exists];
  });
};

var loadExistsConfig = function loadExistsConfig(converted, options) {
  return Promise.resolve().then(function () {
    return new Promise(function (resolve, reject) {
      var dirName = options.servicePrefix ? converted.service.slice(options.servicePrefix.length + 1) : converted.service;
      var filePath = path.resolve(appRoot.path, options.outDir, dirName, './serverless.yml');

      fs.readFile(filePath, 'utf-8', function (error, data) {
        if (error) {
          resolve({});
          return;
        }

        resolve(jsyaml.safeLoad(data));
      });
    });
  });
};