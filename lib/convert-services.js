'use strict';

var changeCase = require('change-case');

module.exports = function (api) {
  var services = _convertDefinitionArray(api.paths).map(function (definition) {
    var service = _extractServiceName(definition);
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

var _extractServiceName = function _extractServiceName(definition) {
  if (typeof definition.methodObject.tags === 'undefined') {
    return definition.path.split('/').filter(function (w) {
      return w.length > 0;
    }).filter(function (w) {
      return !/^\{.*\}$/g.test(w);
    }).map(function (w) {
      return changeCase.snakeCase(w);
    }).join('-');
  } else {
    return changeCase.snakeCase(definition.methodObject.tags);
  }
};

var _extractFunctionName = function _extractFunctionName(definition) {
  if (typeof definition.methodObject.tags === 'undefined') {
    return [definition.method].concat(definition.path.split('/').filter(function (w) {
      return w.length > 0;
    }).filter(function (w) {
      return (/^\{.*\}$/.test(w)
      );
    }).map(function (w) {
      return 'With' + changeCase.pascalCase(w.split(1, -1));
    })).join('');
  } else {
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
  }
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