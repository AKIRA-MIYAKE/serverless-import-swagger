import _ from 'lodash';

import { CLIOptions, ConfFileConfig, InternalConfig } from '../interfaces';
import {
  resolveAppRootPath,
  existsItem,
  loadFileAsJSONIfExists,
} from '../utils';

export default async (
  cliOptions: CLIOptions,
  appRootPath: string | undefined = undefined
): Promise<InternalConfig> => {
  const confFilePath =
    typeof cliOptions.config !== 'undefined'
      ? resolveAppRootPath(cliOptions.config, appRootPath)
      : resolveAppRootPath('./sis.config.json', appRootPath);

  const existsConfFile = await existsItem(confFilePath);

  const confFileConfig: ConfFileConfig = existsConfFile
    ? await loadFileAsJSONIfExists(confFilePath)
    : {};

  const defaultConfig: InternalConfig = {
    all: true,
    serviceName: 'service',
    basePath: false,
    input: null,
    outDir: null,
    common: null,
    force: false,
    options: {
      cors: false,
      optionsMethod: false,
      authorizer: null,
      operationId: false,
    },
  };

  return _.merge({}, defaultConfig, confFileConfig, {
    serviceName: cliOptions.serviceName,
    input: cliOptions.input,
    outDir: cliOptions.outDir,
    common: cliOptions.common,
    force: cliOptions.force,
  });
};
