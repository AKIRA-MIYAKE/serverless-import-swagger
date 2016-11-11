'use strict';

const path = require('path');
const fs = require('graceful-fs');
const jsyaml = require('js-yaml');
const appRoot = require('app-root-path');

module.exports = (filePath = '') => {
  return Promise.resolve()
  .then(() => {
    if (filePath.length > 0) {
      return filePath;
    }

    return new Promise((resolve, reject) => {
      fs.readdir(appRoot.path, (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        const filterd = results.filter(r => /^serverless.common.ya?ml$/.test(r));

        if (filterd.length === 0) {
          resolve('');
          return;
        }

        resolve(path.resolve(appRoot.path, filterd[0]));
      });
    });
  })
  .then(filePath => {
    return new Promise((resolve, reject) => {
      if (filePath.length === 0) {
        resolve({});
        return;
      }

      fs.readFile(filePath, 'utf-8', (error, data) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(jsyaml.safeLoad(data))
      });
    });
  });
};
