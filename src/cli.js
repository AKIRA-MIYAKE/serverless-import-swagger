'use strict';

const commander = require('commander');

const loadSwagger = require('./load-swagger');
const convertSwaggerToConfigs = require('./convert-swagger-to-configs');
const generateServiceIfNeed = require('./generate-service-if-need');
const loadExistsConfig = require('./load-exists-config');
const loadCommonConfig = require('./load-common-config');
const mergeConfigs = require('./merge-configs');
const wrilteFile = require('./write-file');

module.exports.exec = () => {
  commander
  .version('0.0.15')
  .description('Import functions from swagger spec filet to serverless.yml')
  // Common options.
  .option('-i, --input <path>', 'Specify swagger file path. (defailt "./swagger.ya?ml")')
  .option('-c, --common <path>', 'Specify common config of serverless file path. (default "./serverless.common.ya?ml")')
  .option('-o, --out-dir <path>', 'Specify dist directory of services. (default "./")')
  .option('-f, --force', 'If add this option, overwriten serverless.yml by generated definitinos.')
  // Services and tags prefix options.
  .option('-A, --api-prefix <prefix>', 'Specify target prefix for swagger tags. (default "sls")')
  .option('-S, --service-prefix <prefix>', 'Specify prefix that added service name. (default none)')
  // Base path mode settings.
  .option('-B, --base-path', 'If add this option, run in a mode of dividing a service by a api base path.')
  // CORS and options settings.
  .option('-C, --cors', 'If add this option, added cors setting to all http event.')
  .option('-O, --options-method', 'If add this option, added cors setting to get http event, and added OPTIONS method to api path that including other http method.')
  .parse(process.argv);

  const options = {
    input: (commander.input) ? commander.input : 'swagger.yaml',
    common: (commander.common) ? commander.common : './serverless.common.yml',
    outDir: (commander.outDir) ? commander.outDir : './',
    apiPrefix: (commander.apiPrefix) ? commander.apiPrefix : 'sls',
    servicePrefix: (commander.servicePrefix) ? commander.servicePrefix : undefined,
    basePath: (commander.basePath) ? commander.basePath : false,
    force: (commander.force) ? commander.force : false,
    cors: (commander.cors) ? commander.cors : false,
    optionsMethod: (commander.optionsMethod) ? commander.optionsMethod : false,
  };

  Promise.resolve()
  .then(() => loadSwagger(options))
  .then(swagger => convertSwaggerToConfigs(swagger, options))
  .then(convertedConfigs => loadCommonConfig(options)
    .then(common => Promise.all(
      convertedConfigs
      .map(converted => Promise.resolve()
        .then(() => generateServiceIfNeed(converted, options))
        .then(converted => loadExistsConfig(converted, options))
        .then(([converted, exists]) => [converted, exists, common])
        .then(configs => mergeConfigs(...configs, options))
        .then(config => wrilteFile(config, options))
      )
    ))
  )
  .then(() => console.log('Import success.'))
  .catch(error => console.log(error));
};
