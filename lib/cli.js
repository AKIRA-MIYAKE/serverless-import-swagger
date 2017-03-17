'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var commander = require('commander');

var loadSwagger = require('./load-swagger');
var convertSwaggerToConfigs = require('./convert-swagger-to-configs');
var generateServiceIfNeed = require('./generate-service-if-need');
var loadExistsConfig = require('./load-exists-config');
var loadCommonConfig = require('./load-common-config');
var mergeConfigs = require('./merge-configs');
var wrilteFile = require('./write-file');

module.exports.exec = function () {
  commander.version('0.0.11').description('Import functions from swagger spec filet to serverless.yml').option('-i, --input <path>', 'Specify swagger file path. (defailt "./swagger.ya?ml")').option('-c, --common <path>', 'Specify common config of serverless file path. (default "./serverless.common.ya?ml")').option('-o, --out-dir <path>', 'Specify dist directory of services. (default "./")').option('-A, --api-prefix <prefix>', 'Specify target prefix for swagger tags. (default "sls")').option('-S, --service-prefix <prefix>', 'Specify prefix that added service name. (default none)').option('-B, --base-path', 'If add this option, run in a mode of dividing a service by a api base path.').option('-f, --force', 'If add this option, overwriten serverless.yml by generated definitinos.').option('-C, --cors', 'If add this option, added cors setting to all event.').parse(process.argv);

  var options = {
    input: commander.input ? commander.input : 'swagger.yaml',
    common: commander.common ? commander.common : './serverless.common.yml',
    outDir: commander.outDir ? commander.outDir : './',
    apiPrefix: commander.apiPrefix ? commander.apiPrefix : 'sls',
    servicePrefix: commander.servicePrefix ? commander.servicePrefix : undefined,
    basePath: commander.basePath ? commander.basePath : false,
    force: commander.force ? commander.force : false,
    cors: commander.cors ? commander.cors : false
  };

  Promise.resolve().then(function () {
    return loadSwagger(options);
  }).then(function (swagger) {
    return convertSwaggerToConfigs(swagger, options);
  }).then(function (convertedConfigs) {
    return loadCommonConfig(options).then(function (common) {
      return Promise.all(convertedConfigs.map(function (converted) {
        return Promise.resolve().then(function () {
          return generateServiceIfNeed(converted, options);
        }).then(function (converted) {
          return loadExistsConfig(converted, options);
        }).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              converted = _ref2[0],
              exists = _ref2[1];

          return [converted, exists, common];
        }).then(function (configs) {
          return mergeConfigs.apply(undefined, _toConsumableArray(configs).concat([options]));
        }).then(function (config) {
          return wrilteFile(config, options);
        });
      }));
    });
  }).then(function () {
    return console.log('Import success.');
  }).catch(function (error) {
    return console.log(error);
  });
};