'use strict';

module.exports = function (service, common, exists) {
  var provider = Object.assign({}, exists.provider ? exists.provider : {}, common.provider ? common.provider : {});
  var functions = Object.assign({}, exists.functions ? exists.functions : {}, common.functinos ? common.functions : {}, service.functions);

  return Object.assign({}, exists, service, common, { provider: provider }, { functions: functions });
};