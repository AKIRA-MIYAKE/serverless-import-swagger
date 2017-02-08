'use strict';

const path = require('path');
const fs = require('graceful-fs');
const jsyaml = require('js-yaml');
const appRoot = require('app-root-path');

module.exports = (converted, options) => Promise.resolve()
.then(() => loadExistsConfig(converted, options))
.then(exists => [converted, exists]);

const loadExistsConfig = (converted, options) => Promise.resolve()
.then(() => new Promise((resolve, reject) => {
  const dirName = (options.servicePrefix) ? converted.service.slice(options.servicePrefix.length + 1) : converted.service;
  const filePath = path.resolve(appRoot.path, options.outDir, dirName, `./serverless.yml`);

  fs.readFile(filePath, 'utf-8', (error, data) => {
    if (error) {
      resolve({});
      return;
    }

    resolve(jsyaml.safeLoad(data));
  });
}));
