'use strcit';

const childProcess = require('child_process');
const path = require('path');
const fs = require('graceful-fs');
const jsyaml = require('js-yaml');
const appRoot = require('app-root-path');

module.exports = (config, outDir = '.') => {
  return Promise.resolve()
  .then(() => {
    return new Promise((resolve, reject) => {
      fs.readdir(path.resolve(appRoot.path, outDir), 'utf-8', (error, results) => {
        results = (results) ? results : [];
        if (!results.some(r => (r === config.service))) {
          const command = `${appRoot.path}/node_modules/.bin/sls create -t aws-nodejs -p ${outDir}/${config.service}`;

          console.log(`Execute: ${command}`);

          childProcess.exec(command, (error, stdout, stderr) => {
            if (error) {
              reject(error);
              return;
            }

            console.log(stdout);
            resolve(config);
          });
          return;
        }

        resolve(config);
      });
    });
  })
  .then(config => {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.resolve(appRoot.path, outDir, `./${config.service}`, './serverless.yml'),
        jsyaml.safeDump(config),
        (error) => {
          if (error) {
            reject(error);
            return;
          }

          console.log(`Write serverless.yml of ${config.service} complete.`);
          resolve();
        }
      );
    });
  });
};
