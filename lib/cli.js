'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var commander = require('commander');

var loadSwagger = require('./load-swagger');
var loadCommonConfig = require('./load-common-config');
var loadExistsConfig = require('./load-exists-config');
var convertServices = require('./convert-services');
var mergeConfig = require('./merge-config');
var createService = require('./create-service');
var distributeFiles = require('./distribute-files');

module.exports.exec = function () {
  commander.version('0.0.2').description('Import functions from swagger spec filet to serverless.yml').option('-i, --input <path>', 'specify swagger file path').option('-c, --common <path>', 'specify common config of serverless file path').option('-o, --outDir <path>', 'specify dist directory of service').option('-p, --prefix <prefix>', 'specify target prefix (default "sls")').parse(process.argv);

  Promise.resolve().then(function () {
    return loadSwagger(commander.input);
  }).then(function (api) {
    return convertServices(api, commander.prefix);
  }).then(function (configs) {
    return Promise.all(configs.map(function (config) {
      return createService(config, commander.outDir);
    })).then(function () {
      return configs;
    });
  }).then(function (services) {
    return loadCommonConfig(commander.common).then(function (common) {
      return Promise.all(services.map(function (service) {
        return Promise.resolve([service, common]);
      }));
    });
  }).then(function (configs) {
    return Promise.all(configs.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          service = _ref2[0],
          common = _ref2[1];

      return loadExistsConfig(service.service, commander.outDir).then(function (exists) {
        return [service, common, exists];
      });
    }));
  }).then(function (configs) {
    return Promise.all(configs.map(function (config) {
      return mergeConfig.apply(undefined, _toConsumableArray(config));
    }));
  }).then(function (configs) {
    return Promise.all(configs.map(function (config) {
      return distributeFiles(config, commander.outDir);
    }));
  }).then(function () {
    console.log('Swagger import complete.');
  }).catch(function (e) {
    console.log(e);
  });
};