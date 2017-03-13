'use strict';

const changeCase = require('change-case');

module.exports = (swagger, options) => mergeConfigs(
  swaggerToDefinitions(swagger)
  .filter(definition => isTarget(definition, options))
  .map(definition => definitionToConfig(definition, options))
);

const swaggerToDefinitions = swagger => {
  const definitions = [];

  Object.keys(swagger.paths).forEach(path => {
    Object.keys(swagger.paths[path]).forEach(method => {
      definitions.push({
        path: path,
        method: method,
        methodObject: swagger.paths[path][method]
      });
    });
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
      method: definition.method.toLowerCase(),
      integration: 'lambda-proxy'
    }
  };

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

const extractFunctionName = definition => {
  const method = [definition.method];

  const resource = definition.path
  .split('/')
  .reverse()
  .filter(w => (w.length > 0))
  .filter(w => !/^\{.*\}$/.test(w))
  .filter((_, index) => (index === 0))
  .map(w => changeCase.pascalCase(w));

  const conditions = definition.path
  .split('/')
  .filter(w => (w.length > 0))
  .filter(w => /^\{.*\}$/.test(w))
  .map(w => 'With' + changeCase.pascalCase(w.split(1, -1)));

  return method.concat(resource, conditions).join('');
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
