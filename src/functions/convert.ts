import _ from 'lodash';
import changeCase from 'change-case';
import {
  Document,
  Oas30Paths,
  Oas20Paths,
  OasPathItem,
  OasOperation,
} from 'apicurio-data-models';

import {
  InternalConfig,
  DocumentConfig,
  OperationConfig,
  SlsService,
  SlsFunction,
  SlsHttpEvent,
} from '../interfaces';

export interface OperationObject {
  path: string;
  method: string;
  operationId?: string;
  config: InternalConfig;
}

export default (
  apiDocuments: Document[],
  config: InternalConfig
): SlsService[] => {
  const operationObjects = collectOperationObjects(apiDocuments, config);
  const isolatedSLSServices = operationObjects.map(obj =>
    createIsolatedSlsServie(obj)
  );

  const serviceNames: Set<string> = new Set();
  isolatedSLSServices.forEach(s => {
    serviceNames.add(s.service);
  });

  return Array.from(serviceNames).map(sn => {
    const services = isolatedSLSServices.filter(s => s.service === sn);
    return _.merge({}, ...services);
  });
};

export const collectOperationObjects = (
  apiDocuments: Document[],
  config: InternalConfig
): OperationObject[] => {
  const docConfigs = apiDocuments.map(doc => getDocumentConfig(doc));
  const operationObjectsArray = apiDocuments.map((doc, i) => {
    const contextConfig = _.merge({}, config, docConfigs[i]);
    const paths = getPaths(doc);
    const ops = paths.getPathItems().map(pathItem => {
      return createOperationObjects(pathItem, contextConfig);
    });
    return _.flatten(ops);
  });

  return _.flatten(operationObjectsArray);
};

export const createOperationObjects = (
  pathItem: OasPathItem,
  contextConfig: InternalConfig
): OperationObject[] => {
  const path = pathItem.getPath();
  const operations = getOperations(pathItem);

  const operationObjects: OperationObject[] = [];
  operations.forEach(operation => {
    const operationConfig = getOperationConfig(operation);
    if (!contextConfig.all && typeof operationConfig === 'undefined') {
      return;
    }

    operationObjects.push({
      path,
      method: operation.getMethod().toLowerCase(),
      operationId: operation.operationId,
      config: _.merge({}, contextConfig, operationConfig),
    });
  });

  if (
    operationObjects.some(oo => oo.config.options.optionsMethod) &&
    operationObjects.every(oo => oo.method !== 'options')
  ) {
    operationObjects.push({
      path,
      method: 'options',
      config: contextConfig,
    });
  }

  return operationObjects;
};

export const createIsolatedSlsServie = (
  operationObject: OperationObject
): SlsService => {
  const service = createServiceName(operationObject);
  const functionName = createFunctionName(operationObject);
  const handler = `handler.${functionName}`;

  let path;
  if (operationObject.config.basePath === false) {
    path = operationObject.path;
  } else {
    const splited = operationObject.path.slice(1).split('/');
    path = splited.length === 1 ? '/' : `/${splited.slice(1).join('/')}`;
  }

  const httpEvent: SlsHttpEvent = {
    http: {
      path,
      method: operationObject.method,
      integration: 'lambda-proxy',
    },
  };

  const options = operationObject.config.options;

  if (options.cors) {
    httpEvent.http.cors = options.cors;
  }

  if (options.authorizer) {
    httpEvent.http.authorizer = options.authorizer;
  }

  const func: SlsFunction = {
    handler,
    events: [httpEvent],
  };

  const functions = { [functionName]: func };

  return { service, functions };
};

export const getPaths = (apiDocument: Document): Oas30Paths | Oas20Paths => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (apiDocument as any).paths;
};

export const getOperations = (pathItem: OasPathItem): OasOperation[] => {
  return [
    pathItem.get,
    pathItem.put,
    pathItem.post,
    pathItem.delete,
    pathItem.options,
    pathItem.head,
    pathItem.patch,
  ].filter(op => op !== null);
};

export const getDocumentConfig = (
  apiDocument: Document
): DocumentConfig | undefined => {
  const extension = apiDocument.getExtension('x-sis-config');
  return extension ? extension.value : undefined;
};

export const getOperationConfig = (
  operation: OasOperation
): OperationConfig | undefined => {
  const extension = operation.getExtension('x-sis-config');
  return extension ? extension.value : undefined;
};

export const createServiceName = (operationObject: OperationObject): string => {
  const { path, config } = operationObject;
  const { basePath } = config;

  if (basePath === false) {
    return config.serviceName;
  } else {
    let prefix: string | undefined;
    if (basePath === true) {
      prefix = undefined;
    } else {
      prefix = basePath.servicePrefix;
    }

    const pathArray = path.split('/').filter(p => p.length > 0);
    if (pathArray.length === 0) {
      throw new Error(
        'Can not use the root path when the base path option is enabled.'
      );
    }

    const subName = changeCase.paramCase(pathArray[0]);
    return prefix ? `${prefix}-${subName}` : subName;
  }
};

export const createFunctionName = (
  operationObject: OperationObject
): string => {
  const { path, method, operationId, config } = operationObject;
  const { basePath, options } = config;

  if (options.operationId && typeof operationId === 'string') {
    return operationId;
  }

  const resources = path
    .split('/')
    .filter(w => w.length > 0)
    .filter((w, i) => (basePath ? i !== 0 : true))
    .reduce(
      (acc, current, index, arr) => {
        if (/^\{.*\}$/.test(current)) {
          return acc;
        } else {
          if (/^\{.*\}$/.test(arr[index - 1])) {
            return [current];
          } else {
            return [...acc, current];
          }
        }
      },
      [] as string[]
    )
    .filter(w => !/^\{.*\}$/.test(w))
    .map(w => changeCase.pascalCase(w));

  const conditions = path
    .split('/')
    .filter(w => w.length > 0)
    .filter(w => /^\{.*\}$/.test(w))
    .map((w, i) => {
      const n = changeCase
        .dotCase(w.slice(1, -1))
        .split('.')
        .map(s => changeCase.pascalCase(s.slice(0, 3)))
        .join('');
      return i === 0 ? `With${n}` : n;
    });

  return [method, ...resources, ...conditions].join('');
};
