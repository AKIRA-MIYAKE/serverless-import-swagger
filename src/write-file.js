'use strict';

const path = require('path');
const fs = require('graceful-fs');
const jsyaml = require('js-yaml');
const appRoot = require('app-root-path');

module.exports = (config, options) => Promise.resolve()
.then(() => new Promise((resolve, reject) => {
  var dirName = options.servicePrefix ? config.service.slice(options.servicePrefix.length + 1) : config.service;
  var filePath = path.resolve(appRoot.path, options.outDir, dirName, './serverless.yml');

  fs.writeFile(filePath, jsyaml.safeDump(config), 'utf8', (error) => {
    if (error) {
      reject(error);
      return;
    }
    console.log(`Write serverless.yml of ${config.service} complete.`);
    resolve();
  });
}));
