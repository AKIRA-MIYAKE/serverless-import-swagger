'use strict';

const changeCase = require('change-case');

module.exports = (swagger, options) => mergeConfigs(
  swaggerToDefinitions(swagger, options)
  .filter(definition => isTarget(definition, options))
  .map(definition => definitionToConfig(definition, options))
);

const swaggerToDefinitions = (swagger, options) => {
  const definitions = [];

  swagger.paths.getItems().forEach(pathItem => {
    const path = pathItem.path();
    const methodNames = Object.keys(pathItem).filter(k => !k.startsWith("_"));
    methodNames.forEach(method => {
      definitions.push({
        path: path,
        method: method.toLowerCase(),
        methodObject: pathItem[method]
      });
    });

    if (options.optionsMethod) {
      const filtered = methodNames.filter(method => (method.toLowerCase() !== 'get'));
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

const isTarget = (definition, options) => {
  if (typeof definition.methodObject.tags === 'undefined') {
    return false;
  }

  return definition.methodObject.tags.some(tag => (tag.indexOf(options.apiPrefix) === 0));
};

const definitionToConfig = (definition, options) => {
  const service = extractServiceName(definition, options);
  const functionName = extractFunctionName(definition, options);
  const handler = `handler.${functionName}`;

  let path;
  if (options.basePath) {
    const splited = definition.path.slice(1).split('/');
    path = (splited.length === 1) ? '/' : `/${splited.slice(1).join('/')}`;
  } else {
    path = definition.path;
  }

  const httpEvent = {
    http: {
      path: path,
      method: definition.method,
      integration: 'lambda-proxy'
    }
  };

  if (options.cors || (options.optionsMethod && (definition.method === 'get'))) {
    httpEvent.http['cors'] = true;
  }

  const events = [httpEvent];
  const functions = {};
  functions[functionName] = { handler, events };

  return { service, functions };
};

const extractServiceName = (definition, options) => {
  const extraced = definition.methodObject.tags.filter(tag => (tag.indexOf(options.apiPrefix) === 0))[0];
  const caseChanged = changeCase.paramCase(extraced.slice(options.apiPrefix.length + 1));

  return (options.servicePrefix) ? `${options.servicePrefix}-${caseChanged}` : caseChanged;
};

const extractFunctionName = (definition, options) => {
  const method = [definition.method];

  const resources = definition.path
  .split('/')
  .filter(w => (w.length > 0))
  .filter((w, i) => ((options.basePath) ? i !== 0 : true))
  .reduce((acc, current, index, arr) => {
    if (/^\{.*\}$/.test(current)) {
      return acc;
    } else {
      if (/^\{.*\}$/.test(arr[index -1])) {
        return [current];
      } else {
        return acc.concat(current);
      }
    }
  }, [])
  .filter(w => !/^\{.*\}$/.test(w))
  .map(w => changeCase.pascalCase(w));

  const conditions = definition.path
  .split('/')
  .filter(w => (w.length > 0))
  .filter(w => /^\{.*\}$/.test(w))
  .map((w, i) => {
    const n = changeCase.dotCase(w.slice(1, -1))
    .split('.')
    .map(s => changeCase.pascalCase(s.slice(0, 3)))
    .join('');
    return (i === 0) ? `With${n}` : n;
  });

  return method.concat(resources, conditions).join('');
};

const mergeConfigs = configs => {
  const nameSet = new Set();
  configs.forEach(config => nameSet.add(config.service));

  return Array.from(nameSet).map(name => {
    const merged = { service: name, functions: {} };

    configs.forEach(config => {
      if (name === config.service) {
        merged.functions = Object.assign({}, merged.functions, config.functions);
      }
    });

    return merged;
  });
};
module.exports._extractFunctionName = extractFunctionName;
