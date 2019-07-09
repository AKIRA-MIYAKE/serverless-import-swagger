import _ from 'lodash';

import { InternalConfig, SlsService } from '../interfaces';

export default (
  service: SlsService,
  exists: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  common: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  config: InternalConfig
): SlsService => {
  const seed = { service: '', provider: {}, functions: {} };
  if (config.force) {
    return _.merge(seed, common, service);
  } else {
    return _.merge(seed, common, exists, service);
  }
};
