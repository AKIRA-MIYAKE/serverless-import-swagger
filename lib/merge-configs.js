'use strict';

var merge = require('deepmerge');

module.exports = function (converted, exists, common, options) {
  var objectForSort = { service: '', provider: {}, functions: {}, plugins: [] };
  if (options.force) {
    return merge.all([objectForSort, common, converted]);
  }

  return merge.all([objectForSort, common, exists, converted]);
};