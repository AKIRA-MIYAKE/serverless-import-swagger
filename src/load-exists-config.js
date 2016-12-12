'use strict';

const path = require('path');
const fs = require('graceful-fs');
const jsyaml = require('js-yaml');
const appRoot = require('app-root-path');

module.exports = (serviceName = '.', outDir = '.') => {
  return Promise.resolve()
  .then(() => {
    const filePath = path.resolve(appRoot.path, outDir, serviceName, `./serverless.yml`);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (error, data) => {
        if (error) {
          resolve({});
          return;
        }

        resolve(jsyaml.safeLoad(data));
      });
    });
  });
};
