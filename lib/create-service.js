'use strict';

const childProcess = require('child_process');
const path = require('path');
const fs = require('graceful-fs');
const appRoot = require('app-root-path');

module.exports = (config, outDir = '.') => {
  return Promise.resolve()
  .then(() => {
    // Check service exists.
    return new Promise((resolve, reject) => {
      fs.readdir(path.resolve(appRoot.path, outDir), (error, results) => {
        results = (results) ? results : [];
        resolve(results.some(r => (r === config.service)));
      });
    });
  })
  .then(isExists => {
    return new Promise((resolve, reject) => {
      // If is not exists, create service.
      if (!isExists) {
        const command = `${appRoot.path}/node_modules/.bin/sls create -t aws-nodejs -p ${outDir}/${config.service}`;
        childProcess.exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          console.log(stdout);
          resolve();
        })
        return;
      }

      resolve();
    });
  });
};
