import path from 'path';
import fs from 'graceful-fs';
import { promisify } from 'util';

import jsyaml from 'js-yaml';

import { InternalConfig, SlsService } from '../interfaces';
import { resolveAppRootPath } from '../utils';

export default async (
  services: SlsService[],
  config: InternalConfig,
  appRootPath: string | undefined = undefined
): Promise<void> => {
  await Promise.all(
    services.map(async service => {
      const filePath = config.outDir
        ? resolveAppRootPath(
            path.resolve(config.outDir, `./${service.service}/serverless.yml`),
            appRootPath
          )
        : resolveAppRootPath(`./${service.service}/serverless.yml`);

      const dataString = jsyaml.safeDump(service);
      await promisify(fs.writeFile)(filePath, dataString, 'utf8');
      // eslint-disable-next-line no-console
      console.log(`Write serverless.yml of ${service.service} complete.`);
    })
  );
};
