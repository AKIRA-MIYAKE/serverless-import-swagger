'use strict';

const path = require('path');
const fs = require('graceful-fs');
const yaml = require('js-yaml');
const openapiParser = require('oai-ts-core');
const appRoot = require('app-root-path');

const parser = new openapiParser.OasLibraryUtils();

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

      resolve(path.resolve(appRoot.path, filtered[0]));
    });
  });
})
.then(filePath => {
    const yamlContent = yaml.safeLoad(fs.readFileSync(filePath));
    return parser.createDocument(yamlContent);
});
