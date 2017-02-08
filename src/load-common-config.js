'use strict';

const path = require('path');
const fs = require('graceful-fs');
const jsyaml = require('js-yaml');
const appRoot = require('app-root-path');

module.exports = (options) => Promise.resolve()
.then(() => {
  if (options.common.length > 0) {
    return options.common;
  }

  return new Promise((resolve, reject) => {
    fs.readdir(appRoot.path, (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      const filtered = results.filter(r => /^serverless.common.ya?ml$/.test(r));

      if (filterd.length === 0) {
        reject('Cannot found common file.');
        return;
      }

      resole(path.resolve(appRoot.path, filtered[0]));
    });
  });
})
.then(filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, 'utf-8', (error, data) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(jsyaml.safeLoad(data));
  });
}));
