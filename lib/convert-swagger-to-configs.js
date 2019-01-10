'use strict';

var changeCase = require('change-case');

module.exports = function (swagger, options) {
  return mergeConfigs(swaggerToDefinitions(swagger, options).filter(function (definition) {
    return isTarget(definition, options);
  }).map(function (definition) {
    return definitionToConfig(definition, options);
  }));
};

var swaggerToDefinitions = function swaggerToDefinitions(swagger, options) {
  var definitions = [];

  swagger.paths.getItems().forEach(function (pathItem) {
    var path = pathItem.path();
    var methodNames = Object.keys(pathItem).filter(function (k) {
      return !k.startsWith("_");
    });
    methodNames.forEach(function (method) {
      definitions.push({
        path: path,
        method: method.toLowerCase(),
        methodObject: pathItem[method]
      });
    });

    if (options.optionsMethod) {
      var filtered = methodNames.filter(function (method) {
        return method.toLowerCase() !== 'get';
      });
      if (filtered.length > 0) {
        definitions.push({
          path: path,
          method: 'options',
          methodObject: pathItem[filtered[0]]
        });
      }
    }
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
  var functionName = extractFunctionName(definition, options);
  var handler = 'handler.' + functionName;

  var path = void 0;
  if (options.basePath) {
    var splited = definition.path.slice(1).split('/');
    path = splited.length === 1 ? '/' : '/' + splited.slice(1).join('/');
  } else {
    path = definition.path;
  }

  var httpEvent = {
    http: {
      path: path,
      method: definition.method,
      integration: 'lambda-proxy'
    }
  };

  if (options.cors || options.optionsMethod && definition.method === 'get') {
    httpEvent.http['cors'] = true;
  }

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

var extractFunctionName = function extractFunctionName(definition, options) {
  var method = [definition.method];

  if (options.operationId && definition.methodObject && typeof definition.methodObject.operationId === 'string') {
    return definition.methodObject.operationId;
  }

  var resources = definition.path.split('/').filter(function (w) {
    return w.length > 0;
  }).filter(function (w, i) {
    return options.basePath ? i !== 0 : true;
  }).reduce(function (acc, current, index, arr) {
    if (/^\{.*\}$/.test(current)) {
      return acc;
    } else {
      if (/^\{.*\}$/.test(arr[index - 1])) {
        return [current];
      } else {
        return acc.concat(current);
      }
    }
  }, []).filter(function (w) {
    return !/^\{.*\}$/.test(w);
  }).map(function (w) {
    return changeCase.pascalCase(w);
  });

  var conditions = definition.path.split('/').filter(function (w) {
    return w.length > 0;
  }).filter(function (w) {
    return (/^\{.*\}$/.test(w)
    );
  }).map(function (w, i) {
    var n = changeCase.dotCase(w.slice(1, -1)).split('.').map(function (s) {
      return changeCase.pascalCase(s.slice(0, 3));
    }).join('');
    return i === 0 ? 'With' + n : n;
  });

  return method.concat(resources, conditions).join('');
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
module.exports._extractFunctionName = extractFunctionName;