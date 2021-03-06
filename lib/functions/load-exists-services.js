"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async (services, config, appRootPath = undefined) => {
  const filePaths = services.map(service => {
    if (config.outDir) {
      return (0, _utils.resolveAppRootPath)(_path.default.resolve(config.outDir, `./${service.service}/serverless.yml`), appRootPath);
    } else {
      return (0, _utils.resolveAppRootPath)(`./${service.service}/serverless.yml`, appRootPath);
    }
  });
  return Promise.all(filePaths.map(filePath => (0, _utils.loadFileAsJSONIfExists)(filePath)));
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdW5jdGlvbnMvbG9hZC1leGlzdHMtc2VydmljZXMudHMiXSwibmFtZXMiOlsic2VydmljZXMiLCJjb25maWciLCJhcHBSb290UGF0aCIsInVuZGVmaW5lZCIsImZpbGVQYXRocyIsIm1hcCIsInNlcnZpY2UiLCJvdXREaXIiLCJwYXRoIiwicmVzb2x2ZSIsIlByb21pc2UiLCJhbGwiLCJmaWxlUGF0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUdBOzs7O2VBRWUsT0FDYkEsUUFEYSxFQUViQyxNQUZhLEVBR2JDLFdBQStCLEdBQUdDLFNBSHJCLEtBSWE7QUFDMUIsUUFBTUMsU0FBUyxHQUFHSixRQUFRLENBQUNLLEdBQVQsQ0FBYUMsT0FBTyxJQUFJO0FBQ3hDLFFBQUlMLE1BQU0sQ0FBQ00sTUFBWCxFQUFtQjtBQUNqQixhQUFPLCtCQUNMQyxjQUFLQyxPQUFMLENBQWFSLE1BQU0sQ0FBQ00sTUFBcEIsRUFBNkIsS0FBSUQsT0FBTyxDQUFDQSxPQUFRLGlCQUFqRCxDQURLLEVBRUxKLFdBRkssQ0FBUDtBQUlELEtBTEQsTUFLTztBQUNMLGFBQU8sK0JBQ0osS0FBSUksT0FBTyxDQUFDQSxPQUFRLGlCQURoQixFQUVMSixXQUZLLENBQVA7QUFJRDtBQUNGLEdBWmlCLENBQWxCO0FBY0EsU0FBT1EsT0FBTyxDQUFDQyxHQUFSLENBQ0xQLFNBQVMsQ0FBQ0MsR0FBVixDQUFjTyxRQUFRLElBQUksbUNBQXVCQSxRQUF2QixDQUExQixDQURLLENBQVA7QUFHRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7IEludGVybmFsQ29uZmlnLCBTbHNTZXJ2aWNlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyByZXNvbHZlQXBwUm9vdFBhdGgsIGxvYWRGaWxlQXNKU09OSWZFeGlzdHMgfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIChcbiAgc2VydmljZXM6IFNsc1NlcnZpY2VbXSxcbiAgY29uZmlnOiBJbnRlcm5hbENvbmZpZyxcbiAgYXBwUm9vdFBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuKTogUHJvbWlzZTxTbHNTZXJ2aWNlW10+ID0+IHtcbiAgY29uc3QgZmlsZVBhdGhzID0gc2VydmljZXMubWFwKHNlcnZpY2UgPT4ge1xuICAgIGlmIChjb25maWcub3V0RGlyKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZUFwcFJvb3RQYXRoKFxuICAgICAgICBwYXRoLnJlc29sdmUoY29uZmlnLm91dERpciwgYC4vJHtzZXJ2aWNlLnNlcnZpY2V9L3NlcnZlcmxlc3MueW1sYCksXG4gICAgICAgIGFwcFJvb3RQYXRoXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZUFwcFJvb3RQYXRoKFxuICAgICAgICBgLi8ke3NlcnZpY2Uuc2VydmljZX0vc2VydmVybGVzcy55bWxgLFxuICAgICAgICBhcHBSb290UGF0aFxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBQcm9taXNlLmFsbChcbiAgICBmaWxlUGF0aHMubWFwKGZpbGVQYXRoID0+IGxvYWRGaWxlQXNKU09OSWZFeGlzdHMoZmlsZVBhdGgpKVxuICApO1xufTtcbiJdfQ==