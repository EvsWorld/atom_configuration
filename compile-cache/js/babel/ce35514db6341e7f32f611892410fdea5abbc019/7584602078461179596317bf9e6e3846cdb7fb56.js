Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

// Public: GrammarUtils.OperatingSystem - a module which exposes different
// platform related helper functions.
'use babel';

exports['default'] = {
  isDarwin: function isDarwin() {
    return this.platform() === 'darwin';
  },

  isWindows: function isWindows() {
    return this.platform() === 'win32';
  },

  isLinux: function isLinux() {
    return this.platform() === 'linux';
  },

  platform: function platform() {
    return _os2['default'].platform();
  },

  release: function release() {
    return _os2['default'].release();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFyLXV0aWxzL29wZXJhdGluZy1zeXN0ZW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tCQUVlLElBQUk7Ozs7OztBQUZuQixXQUFXLENBQUM7O3FCQU1HO0FBQ2IsVUFBUSxFQUFBLG9CQUFHO0FBQ1QsV0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssUUFBUSxDQUFDO0dBQ3JDOztBQUVELFdBQVMsRUFBQSxxQkFBRztBQUNWLFdBQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLE9BQU8sQ0FBQztHQUNwQzs7QUFFRCxTQUFPLEVBQUEsbUJBQUc7QUFDUixXQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxPQUFPLENBQUM7R0FDcEM7O0FBRUQsVUFBUSxFQUFBLG9CQUFHO0FBQ1QsV0FBTyxnQkFBRyxRQUFRLEVBQUUsQ0FBQztHQUN0Qjs7QUFFRCxTQUFPLEVBQUEsbUJBQUc7QUFDUixXQUFPLGdCQUFHLE9BQU8sRUFBRSxDQUFDO0dBQ3JCO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvb3BlcmF0aW5nLXN5c3RlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuXG4vLyBQdWJsaWM6IEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0gLSBhIG1vZHVsZSB3aGljaCBleHBvc2VzIGRpZmZlcmVudFxuLy8gcGxhdGZvcm0gcmVsYXRlZCBoZWxwZXIgZnVuY3Rpb25zLlxuZXhwb3J0IGRlZmF1bHQge1xuICBpc0RhcndpbigpIHtcbiAgICByZXR1cm4gdGhpcy5wbGF0Zm9ybSgpID09PSAnZGFyd2luJztcbiAgfSxcblxuICBpc1dpbmRvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJztcbiAgfSxcblxuICBpc0xpbnV4KCkge1xuICAgIHJldHVybiB0aGlzLnBsYXRmb3JtKCkgPT09ICdsaW51eCc7XG4gIH0sXG5cbiAgcGxhdGZvcm0oKSB7XG4gICAgcmV0dXJuIG9zLnBsYXRmb3JtKCk7XG4gIH0sXG5cbiAgcmVsZWFzZSgpIHtcbiAgICByZXR1cm4gb3MucmVsZWFzZSgpO1xuICB9LFxufTtcbiJdfQ==