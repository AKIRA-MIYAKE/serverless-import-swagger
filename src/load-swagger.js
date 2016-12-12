'use strict';

const path = require('path');
const fs = require('graceful-fs');
const swaggerParser = require('swagger-parser');
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

        const filterd = results.filter(r => /^swagger.ya?ml$/.test(r));

        if (filterd.length === 0) {
          resolve('');
        }

        resolve(path.resolve(appRoot.path, filterd[0]));
      });
    });
  })
  .then(filePath => swaggerParser.parse(filePath));
};
