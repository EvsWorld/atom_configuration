Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.execPromise = execPromise;

var _child_process = require('child_process');

'use babel';

function execPromise(cmd, options) {
  return new Promise(function (resolve, reject) {
    (0, _child_process.exec)(cmd, options, function (err, stdout, stderr) {
      if (err) {
        return reject(err);
      }
      resolve(stdout);
    });
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs2QkFFcUIsZUFBZTs7QUFGcEMsV0FBVyxDQUFBOztBQUlKLFNBQVMsV0FBVyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUU7QUFDeEMsU0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsNkJBQUssR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFLO0FBQzFDLFVBQUksR0FBRyxFQUFFO0FBQ1AsZUFBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDcEI7QUFDRCxhQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDakIsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGF0aHMvbGliL3V0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjUHJvbWlzZShjbWQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBleGVjKGNtZCwgb3B0aW9ucywgKGVyciwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShzdGRvdXQpO1xuICAgIH0pO1xuICB9KTtcbn1cbiJdfQ==