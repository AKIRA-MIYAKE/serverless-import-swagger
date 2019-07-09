import path from 'path';

import { InternalConfig, SlsService } from '../interfaces';
import { resolveAppRootPath, loadFileAsJSONIfExists } from '../utils';

export default async (
  services: SlsService[],
  config: InternalConfig,
  appRootPath: string | undefined = undefined
): Promise<SlsService[]> => {
  const filePaths = services.map(service => {
    if (config.outDir) {
      return resolveAppRootPath(
        path.resolve(config.outDir, `./${service.service}/serverless.yml`),
        appRootPath
      );
    } else {
      return resolveAppRootPath(
        `./${service.service}/serverless.yml`,
        appRootPath
      );
    }
  });

  return Promise.all(
    filePaths.map(filePath => loadFileAsJSONIfExists(filePath))
  );
};
