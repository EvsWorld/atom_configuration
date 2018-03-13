Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var ViewRuntimeObserver = (function () {
  function ViewRuntimeObserver(view) {
    var subscriptions = arguments.length <= 1 || arguments[1] === undefined ? new _atom.CompositeDisposable() : arguments[1];

    _classCallCheck(this, ViewRuntimeObserver);

    this.view = view;
    this.subscriptions = subscriptions;
  }

  _createClass(ViewRuntimeObserver, [{
    key: 'observe',
    value: function observe(runtime) {
      var _this = this;

      this.subscriptions.add(runtime.onStart(function () {
        return _this.view.resetView();
      }));
      this.subscriptions.add(runtime.onStarted(function (ev) {
        _this.view.commandContext = ev;
      }));
      this.subscriptions.add(runtime.onStopped(function () {
        return _this.view.stop();
      }));
      this.subscriptions.add(runtime.onDidWriteToStderr(function (ev) {
        return _this.view.display('stderr', ev.message);
      }));
      this.subscriptions.add(runtime.onDidWriteToStdout(function (ev) {
        return _this.view.display('stdout', ev.message);
      }));
      this.subscriptions.add(runtime.onDidExit(function (ev) {
        return _this.view.setHeaderAndShowExecutionTime(ev.returnCode, ev.executionTime);
      }));
      this.subscriptions.add(runtime.onDidNotRun(function (ev) {
        return _this.view.showUnableToRunError(ev.command);
      }));
      this.subscriptions.add(runtime.onDidContextCreate(function (ev) {
        var title = ev.lang + ' - ' + ev.filename + (ev.lineNumber ? ':' + ev.lineNumber : '');
        _this.view.setHeaderTitle(title);
      }));
      this.subscriptions.add(runtime.onDidNotSpecifyLanguage(function () {
        return _this.view.showNoLanguageSpecified();
      }));
      this.subscriptions.add(runtime.onDidNotSupportLanguage(function (ev) {
        return _this.view.showLanguageNotSupported(ev.lang);
      }));
      this.subscriptions.add(runtime.onDidNotSupportMode(function (ev) {
        return _this.view.createGitHubIssueLink(ev.argType, ev.lang);
      }));
      this.subscriptions.add(runtime.onDidNotBuildArgs(function (ev) {
        return _this.view.handleError(ev.error);
      }));
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.subscriptions) this.subscriptions.dispose();
    }
  }]);

  return ViewRuntimeObserver;
})();

exports['default'] = ViewRuntimeObserver;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi92aWV3LXJ1bnRpbWUtb2JzZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O0FBRjFDLFdBQVcsQ0FBQzs7SUFJUyxtQkFBbUI7QUFDM0IsV0FEUSxtQkFBbUIsQ0FDMUIsSUFBSSxFQUE2QztRQUEzQyxhQUFhLHlEQUFHLCtCQUF5Qjs7MEJBRHhDLG1CQUFtQjs7QUFFcEMsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7R0FDcEM7O2VBSmtCLG1CQUFtQjs7V0FNL0IsaUJBQUMsT0FBTyxFQUFFOzs7QUFDZixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2VBQU0sTUFBSyxJQUFJLENBQUMsU0FBUyxFQUFFO09BQUEsQ0FBQyxDQUFDLENBQUM7QUFDckUsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFDLEVBQUUsRUFBSztBQUFFLGNBQUssSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7T0FBRSxDQUFDLENBQUMsQ0FBQztBQUN0RixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO2VBQU0sTUFBSyxJQUFJLENBQUMsSUFBSSxFQUFFO09BQUEsQ0FBQyxDQUFDLENBQUM7QUFDbEUsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFVBQUEsRUFBRTtlQUFJLE1BQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQztPQUFBLENBQUMsQ0FBQyxDQUFDO0FBQ2xHLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFBLEVBQUU7ZUFBSSxNQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7T0FBQSxDQUFDLENBQUMsQ0FBQztBQUNsRyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQUEsRUFBRTtlQUN6QyxNQUFLLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUM7T0FBQSxDQUFDLENBQUMsQ0FBQztBQUM3RSxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQUEsRUFBRTtlQUFJLE1BQUssSUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7T0FBQSxDQUFDLENBQUMsQ0FBQztBQUM5RixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsVUFBQyxFQUFFLEVBQUs7QUFDeEQsWUFBTSxLQUFLLEdBQU0sRUFBRSxDQUFDLElBQUksV0FBTSxFQUFFLENBQUMsUUFBUSxJQUFHLEVBQUUsQ0FBQyxVQUFVLFNBQU8sRUFBRSxDQUFDLFVBQVUsR0FBSyxFQUFFLENBQUEsQUFBRSxDQUFDO0FBQ3ZGLGNBQUssSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNqQyxDQUFDLENBQUMsQ0FBQztBQUNKLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQztlQUNyRCxNQUFLLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtPQUFBLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxVQUFBLEVBQUU7ZUFDdkQsTUFBSyxJQUFJLENBQUMsd0JBQXdCLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztPQUFBLENBQUMsQ0FBQyxDQUFDO0FBQ2hELFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFBLEVBQUU7ZUFDbkQsTUFBSyxJQUFJLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDO09BQUEsQ0FBQyxDQUFDLENBQUM7QUFDekQsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFVBQUEsRUFBRTtlQUFJLE1BQUssSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO09BQUEsQ0FBQyxDQUFDLENBQUM7S0FDMUY7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDdEQ7OztTQTlCa0IsbUJBQW1COzs7cUJBQW5CLG1CQUFtQiIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvdmlldy1ydW50aW1lLW9ic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld1J1bnRpbWVPYnNlcnZlciB7XG4gIGNvbnN0cnVjdG9yKHZpZXcsIHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpKSB7XG4gICAgdGhpcy52aWV3ID0gdmlldztcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBzdWJzY3JpcHRpb25zO1xuICB9XG5cbiAgb2JzZXJ2ZShydW50aW1lKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChydW50aW1lLm9uU3RhcnQoKCkgPT4gdGhpcy52aWV3LnJlc2V0VmlldygpKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChydW50aW1lLm9uU3RhcnRlZCgoZXYpID0+IHsgdGhpcy52aWV3LmNvbW1hbmRDb250ZXh0ID0gZXY7IH0pKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHJ1bnRpbWUub25TdG9wcGVkKCgpID0+IHRoaXMudmlldy5zdG9wKCkpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHJ1bnRpbWUub25EaWRXcml0ZVRvU3RkZXJyKGV2ID0+IHRoaXMudmlldy5kaXNwbGF5KCdzdGRlcnInLCBldi5tZXNzYWdlKSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQocnVudGltZS5vbkRpZFdyaXRlVG9TdGRvdXQoZXYgPT4gdGhpcy52aWV3LmRpc3BsYXkoJ3N0ZG91dCcsIGV2Lm1lc3NhZ2UpKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChydW50aW1lLm9uRGlkRXhpdChldiA9PlxuICAgICAgdGhpcy52aWV3LnNldEhlYWRlckFuZFNob3dFeGVjdXRpb25UaW1lKGV2LnJldHVybkNvZGUsIGV2LmV4ZWN1dGlvblRpbWUpKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChydW50aW1lLm9uRGlkTm90UnVuKGV2ID0+IHRoaXMudmlldy5zaG93VW5hYmxlVG9SdW5FcnJvcihldi5jb21tYW5kKSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQocnVudGltZS5vbkRpZENvbnRleHRDcmVhdGUoKGV2KSA9PiB7XG4gICAgICBjb25zdCB0aXRsZSA9IGAke2V2Lmxhbmd9IC0gJHtldi5maWxlbmFtZX0ke2V2LmxpbmVOdW1iZXIgPyBgOiR7ZXYubGluZU51bWJlcn1gIDogJyd9YDtcbiAgICAgIHRoaXMudmlldy5zZXRIZWFkZXJUaXRsZSh0aXRsZSk7XG4gICAgfSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQocnVudGltZS5vbkRpZE5vdFNwZWNpZnlMYW5ndWFnZSgoKSA9PlxuICAgICAgdGhpcy52aWV3LnNob3dOb0xhbmd1YWdlU3BlY2lmaWVkKCkpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHJ1bnRpbWUub25EaWROb3RTdXBwb3J0TGFuZ3VhZ2UoZXYgPT5cbiAgICAgIHRoaXMudmlldy5zaG93TGFuZ3VhZ2VOb3RTdXBwb3J0ZWQoZXYubGFuZykpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHJ1bnRpbWUub25EaWROb3RTdXBwb3J0TW9kZShldiA9PlxuICAgICAgdGhpcy52aWV3LmNyZWF0ZUdpdEh1Yklzc3VlTGluayhldi5hcmdUeXBlLCBldi5sYW5nKSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQocnVudGltZS5vbkRpZE5vdEJ1aWxkQXJncyhldiA9PiB0aGlzLnZpZXcuaGFuZGxlRXJyb3IoZXYuZXJyb3IpKSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cbn1cbiJdfQ==