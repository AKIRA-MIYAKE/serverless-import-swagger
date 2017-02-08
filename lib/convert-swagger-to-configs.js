'use strict';

var changeCase = require('change-case');

module.exports = function (swagger, options) {
  return mergeConfigs(swaggerToDefinitions(swagger).filter(function (definition) {
    return isTarget(definition, options);
  }).map(function (definition) {
    return definitionToConfig(definition, options);
  }));
};

var swaggerToDefinitions = function swaggerToDefinitions(swagger) {
  var definitions = [];

  Object.keys(swagger.paths).forEach(function (path) {
    Object.keys(swagger.paths[path]).forEach(function (method) {
      definitions.push({
        path: path,
        method: method,
        methodObject: swagger.paths[path][method]
      });
    });
  });

  return definitions;
};

var isTarget = function isTarget(definition, options) {
  if (typeof definition.methodObject.tags === 'undefined') {
    return false;
  }

  return definition.methodObject.tags.some(function (tag) {
    return tag.indexOf(options.apiPrefix) === 0;
  });
};

var definitionToConfig = function definitionToConfig(definition, options) {
  var service = extractServiceName(definition, options);
  var functionName = extractFunctionName(definition);
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
};

var extractServiceName = function extractServiceName(definition, options) {
  var extraced = definition.methodObject.tags.filter(function (tag) {
    return tag.indexOf(options.apiPrefix) === 0;
  })[0];
  var caseChanged = changeCase.paramCase(extraced.slice(options.apiPrefix.length + 1));

  return options.servicePrefix ? options.servicePrefix + '-' + caseChanged : caseChanged;
};

var extractFunctionName = function extractFunctionName(definition) {
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

var mergeConfigs = function mergeConfigs(configs) {
  var nameSet = new Set();
  configs.forEach(function (config) {
    return nameSet.add(config.service);
  });

  return Array.from(nameSet).map(function (name) {
    var merged = { service: name, functions: {} };

    configs.forEach(function (config) {
      if (name === config.service) {
        merged.functions = Object.assign({}, merged.functions, config.functions);
      }
    });

    return merged;
  });
};