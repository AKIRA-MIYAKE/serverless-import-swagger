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
          method: method.toLowerCase()
        }
      };
      const requestParameters = _extractRequestParameters(api.paths[path][method]);
      if (requestParameters) {
        httpEvent.http.requests = { parameters: requestParameters };
      }

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

const _extractRequestParameters = (methodObject) => {
  const querystrings = [];
  const headers = [];
  const paths = [];

  methodObject.parameters.forEach(param => {
    switch (param.in) {
      case 'query':
        querystrings.push(param.name);
        break;
      case 'header':
        headers.push(param.name);
        break;
      case 'path':
        paths.push(param.name);
        break;
      default:
        break;
    }
  });

  if (querystrings.length === 0 && headers.length === 0 && paths.length === 0) {
    return null;
  }

  const parameters = {};

  if (querystrings.length > 0) {
    parameters.querystrings = {};
    querystrings.forEach(p => {
      parameters.querystrings[p] = true;
    });
  }

  if (headers.length > 0) {
    parameters.headers = {};
    headers.forEach(p => {
      parameters.headers[p] = true;
    });
  }

  if (paths.length > 0) {
    parameters.paths = {};
    paths.forEach(p => {
      parameters.paths[p] = true;
    });
  }

  return parameters;
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
