'use strict';

module.exports = (service, common, exists) => {
  const provider = Object.assign(
    {},
    (exists.provider) ? exists.provider : {},
    (common.provider) ? common.provider : {}
  );
  const functions = Object.assign(
    {},
    (exists.functions) ? exists.functions : {},
    (common.functinos) ? common.functions : {},
    service.functions
  );

  return Object.assign(
    {},
    exists,
    service,
    common,
    { provider },
    { functions }
  );
};
