'use strict';

const path = require('path');
const fs = require('graceful-fs');
const swaggerParser = require('swagger-parser');
const appRoot = require('app-root-path');

module.exports = options => Promise.resolve()
.then(() => {
  if (options.input.length > 0) {
    return options.input;
  }

  return new Promise((resolve, reject) => {
    fs.readdir(appRoot.path, (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      const filtered = results.filter(r => /^swagger.ya?ml$/.test(r));

      if (filterd.length === 0) {
        reject('Cannot found swagger file.');
        return;
      }

      resole(path.resolve(appRoot.path, filtered[0]));
    });
  });
})
.then(filePath => swaggerParser.parse(filePath));
