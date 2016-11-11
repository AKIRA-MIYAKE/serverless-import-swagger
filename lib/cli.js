'use strict';

const commander = require('commander');

const loadSwagger = require('./load-swagger');
const loadCommonConfig = require('./load-common-config');
const loadExistsConfig = require('./load-exists-config');
const convertServices = require('./convert-services');
const mergeConfig = require('./merge-config');
const createService = require('./create-service');
const distributeFiles = require('./distribute-files');

module.exports.exec = () => {
  commander
  .version('0.0.0')
  .description('Import functions from swagger spec filet to serverless.yml')
  .option('-i, --input <path>', 'specify swagger file path')
  .option('-c, --common <path>', 'specify common config of serverless file path')
  .option('-o, --outDir <path>', 'specify dist directory of service')
  .parse(process.argv);

  Promise.resolve()
  .then(() => loadSwagger(commander.input))
  .then(api => convertServices(api))
  .then(configs => {
    return Promise.all(
      configs.map(config => createService(config, commander.outDir))
    )
    .then(() => configs)
  })
  .then(services => {
    return loadCommonConfig(commander.common)
    .then(common => {
      return Promise.all(
        services.map(service => Promise.resolve([service, common]))
      )
    });
  })
  .then(configs => {
    return Promise.all(
      configs.map(([service, common]) => {
        return loadExistsConfig(service.service, commander.outDir)
        .then(exists => [service, common, exists]);
      })
    );
  })
  .then(configs => {
    return Promise.all(
      configs.map(config => mergeConfig(...config))
    );
  })
  .then(configs => {
    return Promise.all(
      configs.map(config => distributeFiles(config, commander.outDir))
    );
  })
  .then(() => {
    console.log('Swagger import complete.');
  })
  .catch(e => { console.log(e); });
};
