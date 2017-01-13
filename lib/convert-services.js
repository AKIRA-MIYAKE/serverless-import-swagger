'use strict';

var changeCase = require('change-case');

module.exports = function (api) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'sls';

  var services = _convertDefinitionArray(api.paths).filter(function (definition) {
    return _isTarget(definition, prefix);
  }).map(function (definition) {
    var service = _extractServiceName(definition, prefix);
    var functionName = _extractFunctionName(definition);
    var handler = 'handler.' + functionName;

    var httpEvent = {
      http: {
        path: definition.path.slice(1),
        method: definition.method.toLowerCase(),
        integration: 'lambda-proxy'
      }
    };

    var events = [httpEvent];

    var functions = {};
    functions[functionName] = { handler: handler, events: events };

    return { service: service, functions: functions };
  });

  return _mergeServiceConfigs(services);
};

var _convertDefinitionArray = function _convertDefinitionArray(paths) {
  var definitions = [];

  Object.keys(paths).forEach(function (path) {
    Object.keys(paths[path]).forEach(function (method) {
      definitions.push({
        path: path,
        method: method,
        methodObject: paths[path][method]
      });
    });
  });

  return definitions;
};

var _isTarget = function _isTarget(definition, prefix) {
  if (typeof definition.methodObject.tags === 'undefined') {
    return false;
  }

  return definition.methodObject.tags.some(function (tag) {
    return tag.indexOf(prefix) === 0;
  });
};

var _extractServiceName = function _extractServiceName(definition, prefix) {
  var extracted = definition.methodObject.tags.filter(function (tag) {
    return tag.indexOf(prefix) === 0;
  })[0];

  return changeCase.paramCase(extracted.slice(prefix.length + 1));
};

var _extractFunctionName = function _extractFunctionName(definition) {
  return [definition.method].concat(definition.path.split('/').filter(function (w) {
    return w.length > 0;
  }).filter(function (w) {
    return !/^\{.*\}$/.test(w);
  }).filter(function (w) {
    return changeCase.camelCase(w) != changeCase.camelCase(definition.methodObject.tags);
  }).map(function (w) {
    return changeCase.pascalCase(w);
  }), definition.path.split('/').filter(function (w) {
    return w.length > 0;
  }).filter(function (w) {
    return (/^\{.*\}$/.test(w)
    );
  }).map(function (w) {
    return 'With' + changeCase.pascalCase(w.split(1, -1));
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