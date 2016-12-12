'use strict';
'use strcit';

var childProcess = require('child_process');
var path = require('path');
var fs = require('graceful-fs');
var jsyaml = require('js-yaml');
var appRoot = require('app-root-path');

module.exports = function (config) {
  var outDir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';

  return Promise.resolve().then(function () {
    return new Promise(function (resolve, reject) {
      fs.readdir(path.resolve(appRoot.path, outDir), 'utf-8', function (error, results) {
        results = results ? results : [];
        if (!results.some(function (r) {
          return r === config.service;
        })) {
          var command = appRoot.path + '/node_modules/.bin/sls create -t aws-nodejs -p ' + outDir + '/' + config.service;

          console.log('Execute: ' + command);

          childProcess.exec(command, function (error, stdout, stderr) {
            if (error) {
              reject(error);
              return;
            }

            console.log(stdout);
            resolve(config);
          });
          return;
        }

        resolve(config);
      });
    });
  }).then(function (config) {
    return new Promise(function (resolve, reject) {
      fs.writeFile(path.resolve(appRoot.path, outDir, './' + config.service, './serverless.yml'), jsyaml.safeDump(config), function (error) {
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