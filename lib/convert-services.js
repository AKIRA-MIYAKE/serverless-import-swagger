'use strict';

var Str = require('string');

module.exports = function (api) {
  var serviceConfigs = Object.keys(api.paths).map(function (path) {
    var service = _extractServiceName(path);
    var functions = {};

    Object.keys(api.paths[path]).forEach(function (method) {
      var functionName = _extractFunctionName(path, method);
      var handler = 'handler.' + functionName;

      var httpEvent = {
        http: {
          path: path.slice(1),
          method: method.toLowerCase(),
          integration: 'lambda-proxy'
        }
      };

      var events = [httpEvent];

      functions[functionName] = {
        handler: handler,
        events: events
      };
    });

    return {
      service: service,
      functions: functions
    };
  });

  return _mergeServiceConfigs(serviceConfigs);
};

var _extractServiceName = function _extractServiceName(path) {
  return path.split('/').filter(function (w) {
    return w.length > 0;
  }).filter(function (w) {
    return !/^\{.*\}$/g.test(w);
  }).map(function (w) {
    return w.toLowerCase().replace(/[\W_]/g, '-');
  }).join('-');
};

var _extractFunctionName = function _extractFunctionName(path, method) {
  return [method].concat(path.split('/').filter(function (w) {
    return w.length > 0;
  }).filter(function (w) {
    return (/^\{.*\}$/.test(w)
    );
  }).map(function (w) {
    return 'With' + Str(w.slice(1, -1)).titleCase().s.replace(/[\W_]/g, '');
  })).join('');
};

var _mergeServiceConfigs = function _mergeServiceConfigs(configs) {
  var nameSet = new Set();
  configs.forEach(function (config) {
    nameSet.add(config.service);
  });

  return Array.from(nameSet).map(function (name) {
    var merged = {
      service: name,
      functions: {}
    };

    configs.forEach(function (config) {
      if (name === config.service) {
        merged.functions = Object.assign({}, merged.functions, config.functions);
      }
    });

    return merged;
  });
};