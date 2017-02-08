'use strict';

const merge = require('deepmerge');

module.exports = (converted, exists, common, options) => {
  const objectForSort = { service: '', provider: {}, functions: {}, plugins: [] };
  if (options.force) {
    return merge.all([objectForSort, common, converted]);
  }

  return merge.all([objectForSort, common, exists, converted]);
};
