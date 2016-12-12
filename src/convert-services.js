'use strict';

const changeCase = require('change-case');

module.exports = (api) => {
  const services = _convertDefinitionArray(api.paths)
  .map(definition => {
    const service = _extractServiceName(definition);
    const functionName = _extractFunctionName(definition);
    const handler = `handler.${functionName}`;

    const httpEvent = {
      http: {
        path: definition.path.slice(1),
        method: definition.method.toLowerCase(),
        integration: 'lambda-proxy'
      }
    };

    const events = [httpEvent];

    const functions = {};
    functions[functionName] = { handler, events };

    return { service, functions };
  });

  return _mergeServiceConfigs(services);
};

const _convertDefinitionArray = (paths) => {
  const definitions = [];

  Object.keys(paths).forEach(path => {
    Object.keys(paths[path]).forEach((method) => {
      definitions.push({
        path: path,
        method: method,
        methodObject: paths[path][method]
      });
    });
  });

  return definitions;
};

const _extractServiceName = (definition) => {
  if (typeof definition.methodObject.tags === 'undefined') {
    return definition.path
    .split('/')
    .filter(w => (w.length > 0))
    .filter(w => !/^\{.*\}$/g.test(w))
    .map(w => changeCase.snakeCase(w))
    .join('-');
  } else {
    return changeCase.snakeCase(definition.methodObject.tags);
  }
};

const _extractFunctionName = (definition) => {
  if (typeof definition.methodObject.tags === 'undefined') {
    return [definition.method].concat(
      definition.path
      .split('/')
      .filter(w => (w.length > 0))
      .filter(w => /^\{.*\}$/.test(w))
      .map(w => 'With' + changeCase.pascalCase(w.split(1, -1)))
    )
    .join('');
  } else {
    return [definition.method].concat(
      definition.path
      .split('/')
      .filter(w => (w.length > 0))
      .filter(w => !/^\{.*\}$/.test(w))
      .filter(w => (changeCase.camelCase(w) != changeCase.camelCase(definition.methodObject.tags)))
      .map(w => changeCase.pascalCase(w)),
      definition.path
      .split('/')
      .filter(w => (w.length > 0))
      .filter(w => /^\{.*\}$/.test(w))
      .map(w => 'With' + changeCase.pascalCase(w.split(1, -1)))
    )
    .join('');
  }
};

const _mergeServiceConfigs = (configs) => {
  const nameSet = new Set();
  configs.forEach(config => {
    nameSet.add(config.service);
  });

  return Array.from(nameSet).map(name => {
    const merged = {
      service: name,
      functions: {}
    };

    configs.forEach(config => {
      if (name === config.service) {
        merged.functions = Object.assign({}, merged.functions, config.functions);
      }
    });

    return merged;
  });
};
