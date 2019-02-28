'use strict';

const path = require('path');
const fs = require('graceful-fs');
const yaml = require('js-yaml');
const openapiParser = require('oai-ts-core');
const appRoot = require('app-root-path');

const parser = new openapiParser.OasLibraryUtils();

module.exports = options => Promise.resolve()
.then(() => {
  const inputs = options.input.filter(path => path.length > 0);

  if (inputs.length > 0) {
    return inputs;
  }

  return new Promise((resolve, reject) => {
    fs.readdir(appRoot.path, (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      const filtered = results.filter(r => /^swagger.ya?ml$/.test(r));

      if (filtered.length === 0) {
        reject('Cannot found swagger file.');
        return;
      }

      resolve([path.resolve(appRoot.path, filtered[0])]);
    });
  });
})
.then(filePaths => {
  return filePaths.map(filePath => {
    const yamlContent = yaml.safeLoad(fs.readFileSync(filePath));
    return parser.createDocument(yamlContent);
  });
});
