'use strict';

var path = require('path');
var fs = require('graceful-fs');
var jsyaml = require('js-yaml');
var appRoot = require('app-root-path');

module.exports = function () {
  var serviceName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.';
  var outDir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';

  return Promise.resolve().then(function () {
    var filePath = path.resolve(appRoot.path, outDir, serviceName, './serverless.yml');
    return new Promise(function (resolve, reject) {
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