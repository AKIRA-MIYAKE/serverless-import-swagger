'use strict';

const changeCase = require('change-case');

module.exports = (api, prefix = 'sls') => {
  const services = _convertDefinitionArray(api.paths)
  .filter(definition => _isTarget(definition, prefix))
  .map(definition => {
    const service = _extractServiceName(definition, prefix);
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

const _isTarget = (definition, prefix) => {
  if (typeof definition.methodObject.tags === 'undefined') {
    return false;
  }

  return definition.methodObject.tags.some(tag => {
    return (tag.indexOf(prefix) === 0);
  });
}

const _extractServiceName = (definition, prefix) => {
  const extracted = definition.methodObject.tags.filter(tag => {
    return (tag.indexOf(prefix) === 0);
  })[0];

  return changeCase.paramCase(extracted.slice(prefix.length + 1));
};

const _extractFunctionName = (definition) => {
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
