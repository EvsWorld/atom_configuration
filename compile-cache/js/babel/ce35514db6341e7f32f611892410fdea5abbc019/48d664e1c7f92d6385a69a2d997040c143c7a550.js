Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _greeter = require('./greeter');

var _greeter2 = _interopRequireDefault(_greeter);

var greeter = undefined;
var instance = undefined;

exports['default'] = {
  activate: function activate() {
    greeter = new _greeter2['default']();

    var linterConfigs = atom.config.get('linter');
    // Unset v1 configs
    var removedV1Configs = ['lintOnFly', 'lintOnFlyInterval', 'ignoredMessageTypes', 'ignoreVCSIgnoredFiles', 'ignoreMatchedFiles', 'showErrorInline', 'inlineTooltipInterval', 'gutterEnabled', 'gutterPosition', 'underlineIssues', 'showProviderName', 'showErrorPanel', 'errorPanelHeight', 'alwaysTakeMinimumSpace', 'displayLinterInfo', 'displayLinterStatus', 'showErrorTabLine', 'showErrorTabFile', 'showErrorTabProject', 'statusIconScope', 'statusIconPosition'];
    if (removedV1Configs.some(function (config) {
      return ({}).hasOwnProperty.call(linterConfigs, config);
    })) {
      greeter.showWelcome();
    }
    removedV1Configs.forEach(function (e) {
      atom.config.unset('linter.' + e);
    });

    if (!atom.inSpecMode()) {
      // eslint-disable-next-line global-require
      require('atom-package-deps').install('linter', true);
    }

    instance = new _main2['default']();
  },
  consumeLinter: function consumeLinter(linter) {
    var linters = [].concat(linter);
    for (var entry of linters) {
      instance.addLinter(entry);
    }
    return new _atom.Disposable(function () {
      for (var entry of linters) {
        instance.deleteLinter(entry);
      }
    });
  },
  consumeLinterLegacy: function consumeLinterLegacy(linter) {
    var linters = [].concat(linter);
    for (var entry of linters) {
      linter.name = linter.name || 'Unknown';
      linter.lintOnFly = Boolean(linter.lintOnFly);
      instance.addLinter(entry, true);
    }
    return new _atom.Disposable(function () {
      for (var entry of linters) {
        instance.deleteLinter(entry);
      }
    });
  },
  consumeUI: function consumeUI(ui) {
    var uis = [].concat(ui);
    for (var entry of uis) {
      instance.addUI(entry);
    }
    return new _atom.Disposable(function () {
      for (var entry of uis) {
        instance.deleteUI(entry);
      }
    });
  },
  provideIndie: function provideIndie() {
    return function (indie) {
      return instance.registryIndie.register(indie, 2);
    };
  },
  provideIndieLegacy: function provideIndieLegacy() {
    return {
      register: function register(indie) {
        return instance.registryIndie.register(indie, 1);
      }
    };
  },
  deactivate: function deactivate() {
    instance.dispose();
    greeter.dispose();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRTJCLE1BQU07O29CQUNkLFFBQVE7Ozs7dUJBQ1AsV0FBVzs7OztBQUcvQixJQUFJLE9BQU8sWUFBQSxDQUFBO0FBQ1gsSUFBSSxRQUFRLFlBQUEsQ0FBQTs7cUJBRUc7QUFDYixVQUFRLEVBQUEsb0JBQUc7QUFDVCxXQUFPLEdBQUcsMEJBQWEsQ0FBQTs7QUFFdkIsUUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRS9DLFFBQU0sZ0JBQWdCLEdBQUcsQ0FDdkIsV0FBVyxFQUNYLG1CQUFtQixFQUNuQixxQkFBcUIsRUFDckIsdUJBQXVCLEVBQ3ZCLG9CQUFvQixFQUNwQixpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLGtCQUFrQixFQUNsQixnQkFBZ0IsRUFDaEIsa0JBQWtCLEVBQ2xCLHdCQUF3QixFQUN4QixtQkFBbUIsRUFDbkIscUJBQXFCLEVBQ3JCLGtCQUFrQixFQUNsQixrQkFBa0IsRUFDbEIscUJBQXFCLEVBQ3JCLGlCQUFpQixFQUNqQixvQkFBb0IsQ0FDckIsQ0FBQTtBQUNELFFBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTthQUFLLENBQUEsR0FBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQztLQUFDLENBQUMsRUFBRTtBQUNwRixhQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7S0FDdEI7QUFDRCxvQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFBRSxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssYUFBVyxDQUFDLENBQUcsQ0FBQTtLQUFFLENBQUMsQ0FBQTs7QUFFckUsUUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTs7QUFFdEIsYUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtLQUNyRDs7QUFFRCxZQUFRLEdBQUcsdUJBQVksQ0FBQTtHQUN4QjtBQUNELGVBQWEsRUFBQSx1QkFBQyxNQUFzQixFQUFjO0FBQ2hELFFBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDakMsU0FBSyxJQUFNLEtBQUssSUFBSSxPQUFPLEVBQUU7QUFDM0IsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUMxQjtBQUNELFdBQU8scUJBQWUsWUFBTTtBQUMxQixXQUFLLElBQU0sS0FBSyxJQUFJLE9BQU8sRUFBRTtBQUMzQixnQkFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUM3QjtLQUNGLENBQUMsQ0FBQTtHQUNIO0FBQ0QscUJBQW1CLEVBQUEsNkJBQUMsTUFBc0IsRUFBYztBQUN0RCxRQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2pDLFNBQUssSUFBTSxLQUFLLElBQUksT0FBTyxFQUFFO0FBQzNCLFlBQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxTQUFTLENBQUE7QUFDdEMsWUFBTSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQzVDLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQ2hDO0FBQ0QsV0FBTyxxQkFBZSxZQUFNO0FBQzFCLFdBQUssSUFBTSxLQUFLLElBQUksT0FBTyxFQUFFO0FBQzNCLGdCQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzdCO0tBQ0YsQ0FBQyxDQUFBO0dBQ0g7QUFDRCxXQUFTLEVBQUEsbUJBQUMsRUFBTSxFQUFjO0FBQzVCLFFBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDekIsU0FBSyxJQUFNLEtBQUssSUFBSSxHQUFHLEVBQUU7QUFDdkIsY0FBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUN0QjtBQUNELFdBQU8scUJBQWUsWUFBTTtBQUMxQixXQUFLLElBQU0sS0FBSyxJQUFJLEdBQUcsRUFBRTtBQUN2QixnQkFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUN6QjtLQUNGLENBQUMsQ0FBQTtHQUNIO0FBQ0QsY0FBWSxFQUFBLHdCQUFXO0FBQ3JCLFdBQU8sVUFBQSxLQUFLO2FBQ1YsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUFBLENBQUE7R0FDNUM7QUFDRCxvQkFBa0IsRUFBQSw4QkFBVztBQUMzQixXQUFPO0FBQ0wsY0FBUSxFQUFFLGtCQUFBLEtBQUs7ZUFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO09BQUE7S0FDN0QsQ0FBQTtHQUNGO0FBQ0QsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsWUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2xCLFdBQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUNsQjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IExpbnRlciBmcm9tICcuL21haW4nXG5pbXBvcnQgR3JlZXRlciBmcm9tICcuL2dyZWV0ZXInXG5pbXBvcnQgdHlwZSB7IFVJLCBMaW50ZXIgYXMgTGludGVyUHJvdmlkZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5sZXQgZ3JlZXRlclxubGV0IGluc3RhbmNlXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgZ3JlZXRlciA9IG5ldyBHcmVldGVyKClcblxuICAgIGNvbnN0IGxpbnRlckNvbmZpZ3MgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlcicpXG4gICAgLy8gVW5zZXQgdjEgY29uZmlnc1xuICAgIGNvbnN0IHJlbW92ZWRWMUNvbmZpZ3MgPSBbXG4gICAgICAnbGludE9uRmx5JyxcbiAgICAgICdsaW50T25GbHlJbnRlcnZhbCcsXG4gICAgICAnaWdub3JlZE1lc3NhZ2VUeXBlcycsXG4gICAgICAnaWdub3JlVkNTSWdub3JlZEZpbGVzJyxcbiAgICAgICdpZ25vcmVNYXRjaGVkRmlsZXMnLFxuICAgICAgJ3Nob3dFcnJvcklubGluZScsXG4gICAgICAnaW5saW5lVG9vbHRpcEludGVydmFsJyxcbiAgICAgICdndXR0ZXJFbmFibGVkJyxcbiAgICAgICdndXR0ZXJQb3NpdGlvbicsXG4gICAgICAndW5kZXJsaW5lSXNzdWVzJyxcbiAgICAgICdzaG93UHJvdmlkZXJOYW1lJyxcbiAgICAgICdzaG93RXJyb3JQYW5lbCcsXG4gICAgICAnZXJyb3JQYW5lbEhlaWdodCcsXG4gICAgICAnYWx3YXlzVGFrZU1pbmltdW1TcGFjZScsXG4gICAgICAnZGlzcGxheUxpbnRlckluZm8nLFxuICAgICAgJ2Rpc3BsYXlMaW50ZXJTdGF0dXMnLFxuICAgICAgJ3Nob3dFcnJvclRhYkxpbmUnLFxuICAgICAgJ3Nob3dFcnJvclRhYkZpbGUnLFxuICAgICAgJ3Nob3dFcnJvclRhYlByb2plY3QnLFxuICAgICAgJ3N0YXR1c0ljb25TY29wZScsXG4gICAgICAnc3RhdHVzSWNvblBvc2l0aW9uJyxcbiAgICBdXG4gICAgaWYgKHJlbW92ZWRWMUNvbmZpZ3Muc29tZShjb25maWcgPT4gKHt9Lmhhc093blByb3BlcnR5LmNhbGwobGludGVyQ29uZmlncywgY29uZmlnKSkpKSB7XG4gICAgICBncmVldGVyLnNob3dXZWxjb21lKClcbiAgICB9XG4gICAgcmVtb3ZlZFYxQ29uZmlncy5mb3JFYWNoKChlKSA9PiB7IGF0b20uY29uZmlnLnVuc2V0KGBsaW50ZXIuJHtlfWApIH0pXG5cbiAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyJywgdHJ1ZSlcbiAgICB9XG5cbiAgICBpbnN0YW5jZSA9IG5ldyBMaW50ZXIoKVxuICB9LFxuICBjb25zdW1lTGludGVyKGxpbnRlcjogTGludGVyUHJvdmlkZXIpOiBEaXNwb3NhYmxlIHtcbiAgICBjb25zdCBsaW50ZXJzID0gW10uY29uY2F0KGxpbnRlcilcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGxpbnRlcnMpIHtcbiAgICAgIGluc3RhbmNlLmFkZExpbnRlcihlbnRyeSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgbGludGVycykge1xuICAgICAgICBpbnN0YW5jZS5kZWxldGVMaW50ZXIoZW50cnkpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgY29uc3VtZUxpbnRlckxlZ2FjeShsaW50ZXI6IExpbnRlclByb3ZpZGVyKTogRGlzcG9zYWJsZSB7XG4gICAgY29uc3QgbGludGVycyA9IFtdLmNvbmNhdChsaW50ZXIpXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBsaW50ZXJzKSB7XG4gICAgICBsaW50ZXIubmFtZSA9IGxpbnRlci5uYW1lIHx8ICdVbmtub3duJ1xuICAgICAgbGludGVyLmxpbnRPbkZseSA9IEJvb2xlYW4obGludGVyLmxpbnRPbkZseSlcbiAgICAgIGluc3RhbmNlLmFkZExpbnRlcihlbnRyeSwgdHJ1ZSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgbGludGVycykge1xuICAgICAgICBpbnN0YW5jZS5kZWxldGVMaW50ZXIoZW50cnkpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgY29uc3VtZVVJKHVpOiBVSSk6IERpc3Bvc2FibGUge1xuICAgIGNvbnN0IHVpcyA9IFtdLmNvbmNhdCh1aSlcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHVpcykge1xuICAgICAgaW5zdGFuY2UuYWRkVUkoZW50cnkpXG4gICAgfVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHVpcykge1xuICAgICAgICBpbnN0YW5jZS5kZWxldGVVSShlbnRyeSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBwcm92aWRlSW5kaWUoKTogT2JqZWN0IHtcbiAgICByZXR1cm4gaW5kaWUgPT5cbiAgICAgIGluc3RhbmNlLnJlZ2lzdHJ5SW5kaWUucmVnaXN0ZXIoaW5kaWUsIDIpXG4gIH0sXG4gIHByb3ZpZGVJbmRpZUxlZ2FjeSgpOiBPYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICByZWdpc3RlcjogaW5kaWUgPT4gaW5zdGFuY2UucmVnaXN0cnlJbmRpZS5yZWdpc3RlcihpbmRpZSwgMSksXG4gICAgfVxuICB9LFxuICBkZWFjdGl2YXRlKCkge1xuICAgIGluc3RhbmNlLmRpc3Bvc2UoKVxuICAgIGdyZWV0ZXIuZGlzcG9zZSgpXG4gIH0sXG59XG4iXX0=