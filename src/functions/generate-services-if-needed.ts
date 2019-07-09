import path from 'path';
import childProcess from 'child_process';

import { InternalConfig, SlsService } from '../interfaces';
import { resolveAppRootPath, existsItem } from '../utils';

export default async (
  services: SlsService[],
  config: InternalConfig,
  appRootPath: string | undefined = undefined
): Promise<void> => {
  await Promise.all(
    services.map(async service => {
      const exists = await existsService(service, config, appRootPath);
      if (!exists) {
        await generateService(service, config, appRootPath);
      }
    })
  );
};

export const existsService = async (
  service: SlsService,
  config: InternalConfig,
  appRootPath: string | undefined = undefined
): Promise<boolean> => {
  const dirPath = config.outDir
    ? resolveAppRootPath(
        path.resolve(config.outDir, service.service),
        appRootPath
      )
    : resolveAppRootPath(service.service, appRootPath);

  return existsItem(dirPath);
};

export const generateService = async (
  service: SlsService,
  config: InternalConfig,
  appRootPath: string | undefined = undefined
): Promise<void> => {
  const targetPath = config.outDir
    ? `${config.outDir}/${service.service}`
    : service.service;

  const localSlsPath = resolveAppRootPath(
    './node_modules/.bin/sls',
    appRootPath
  );

  const existsLocalSls = await existsItem(localSlsPath);
  const command = existsLocalSls
    ? `${localSlsPath} create -t aws-nodejs -p ${targetPath}`
    : `sls create -t aws-nodejs -p ${targetPath}`;

  return new Promise((resolve, reject) => {
    childProcess.exec(command, (error, stdout, stderr) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error(stderr);
        reject(error);
      } else {
        // eslint-disable-next-line no-console
        console.log(stdout);
        resolve();
      }
    });
  });
};
