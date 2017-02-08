'use strict';

const childProcess = require('child_process');
const path = require('path');
const fs = require('graceful-fs');
const appRoot = require('app-root-path');

module.exports = (converted, options) => Promise.resolve()
.then(() => isServiceExists(converted, options))
.then(exists => (exists) ? Promise.resolve(converted) : generateService(converted, options));

const isServiceExists = (converted, options) => Promise.resolve()
.then(() => new Promise((resolve, reject) => {
  fs.readdir(path.resolve(appRoot.path, options.outDir), (error, results) => {
    if (error) {
      if (error.code != 'ENOENT') {
        reject(error);
        return;
      }
      resolve(false)
      return;
    }

    results = (results) ? results : [];
    const dirName = (options.servicePrefix) ? converted.service.slice(options.servicePrefix.length + 1) : converted.service;
    resolve(results.some(r => (r === dirName)));
  });
}));

const generateService = (converted, options) => Promise.resolve()
.then(() => new Promise((resolve, reject) => {
  const serviceName = (options.servicePrefix) ? converted.service.slice(options.servicePrefix.length + 1) : converted.service;
  const command = `${appRoot.path}/node_modules/.bin/sls create -t aws-nodejs -p ${options.outDir}/${serviceName}`;

  childProcess.exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(stderr);
      reject(error);
      return;
    }
    console.log(stdout);
    resolve(converted);
  });
}));
