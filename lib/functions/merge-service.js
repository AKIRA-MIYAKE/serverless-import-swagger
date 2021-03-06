"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (service, exists, common, config) => {
  const seed = {
    service: '',
    provider: {},
    functions: {}
  };

  if (config.force) {
    return _lodash.default.merge(seed, common, service);
  } else {
    return _lodash.default.merge(seed, common, exists, service);
  }
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdW5jdGlvbnMvbWVyZ2Utc2VydmljZS50cyJdLCJuYW1lcyI6WyJzZXJ2aWNlIiwiZXhpc3RzIiwiY29tbW9uIiwiY29uZmlnIiwic2VlZCIsInByb3ZpZGVyIiwiZnVuY3Rpb25zIiwiZm9yY2UiLCJfIiwibWVyZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztlQUllLENBQ2JBLE9BRGEsRUFFYkMsTUFGYSxFQUdiQyxNQUhhLEVBSWJDLE1BSmEsS0FLRTtBQUNmLFFBQU1DLElBQUksR0FBRztBQUFFSixJQUFBQSxPQUFPLEVBQUUsRUFBWDtBQUFlSyxJQUFBQSxRQUFRLEVBQUUsRUFBekI7QUFBNkJDLElBQUFBLFNBQVMsRUFBRTtBQUF4QyxHQUFiOztBQUNBLE1BQUlILE1BQU0sQ0FBQ0ksS0FBWCxFQUFrQjtBQUNoQixXQUFPQyxnQkFBRUMsS0FBRixDQUFRTCxJQUFSLEVBQWNGLE1BQWQsRUFBc0JGLE9BQXRCLENBQVA7QUFDRCxHQUZELE1BRU87QUFDTCxXQUFPUSxnQkFBRUMsS0FBRixDQUFRTCxJQUFSLEVBQWNGLE1BQWQsRUFBc0JELE1BQXRCLEVBQThCRCxPQUE5QixDQUFQO0FBQ0Q7QUFDRixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgSW50ZXJuYWxDb25maWcsIFNsc1NlcnZpY2UgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGRlZmF1bHQgKFxuICBzZXJ2aWNlOiBTbHNTZXJ2aWNlLFxuICBleGlzdHM6IGFueSwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gIGNvbW1vbjogYW55LCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgY29uZmlnOiBJbnRlcm5hbENvbmZpZ1xuKTogU2xzU2VydmljZSA9PiB7XG4gIGNvbnN0IHNlZWQgPSB7IHNlcnZpY2U6ICcnLCBwcm92aWRlcjoge30sIGZ1bmN0aW9uczoge30gfTtcbiAgaWYgKGNvbmZpZy5mb3JjZSkge1xuICAgIHJldHVybiBfLm1lcmdlKHNlZWQsIGNvbW1vbiwgc2VydmljZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF8ubWVyZ2Uoc2VlZCwgY29tbW9uLCBleGlzdHMsIHNlcnZpY2UpO1xuICB9XG59O1xuIl19