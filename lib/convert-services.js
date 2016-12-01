'use strict';

const Str = require('string');

module.exports = (api) => {
  const serviceConfigs = Object.keys(api.paths).map(path => {
    const service = _extractServiceName(path);
    const functions = {};

    Object.keys(api.paths[path]).forEach(method => {
      const functionName = _extractFunctionName(path, method);
      const handler = `handler.${functionName}`;

      const httpEvent = {
        http: {
          path: path.slice(1),
          method: method.toLowerCase(),
          integration: 'lambda-proxy'
        }
      };

      const events = [httpEvent];

      functions[functionName] = {
        handler,
        events
      }
    });

    return {
      service,
      functions
    };
  });

  return _mergeServiceConfigs(serviceConfigs);
};

const _extractServiceName = (path) => {
  return path
  .split('/')
  .filter(w => (w.length > 0))
  .filter(w => !/^\{.*\}$/g.test(w))
  .map(w => w.toLowerCase().replace(/[\W_]/g, '-'))
  .join('-');
}

const _extractFunctionName = (path, method) => {
  return [method].concat(
    path
    .split('/')
    .filter(w => (w.length > 0))
    .filter(w => /^\{.*\}$/.test(w))
    .map(w => 'With' + Str(w.slice(1, -1)).titleCase().s.replace(/[\W_]/g, ''))
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
