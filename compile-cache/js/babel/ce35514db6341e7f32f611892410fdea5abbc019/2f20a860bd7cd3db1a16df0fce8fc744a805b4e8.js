Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* global atom */

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _pathsProvider = require('./paths-provider');

var _pathsProvider2 = _interopRequireDefault(_pathsProvider);

var _atom = require('atom');

var _configOptionScopes = require('./config/option-scopes');

var _configOptionScopes2 = _interopRequireDefault(_configOptionScopes);

'use babel';exports['default'] = {
  config: _config2['default'],
  subscriptions: null,

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'autocomplete-paths:rebuild-cache': function autocompletePathsRebuildCache() {
        _this._provider.rebuildCache();
      }
    }));

    var cacheOptions = ['core.ignoredNames', 'core.excludeVcsIgnoredPaths', 'autocomplete-paths.ignoreSubmodules', 'autocomplete-paths.ignoredNames', 'autocomplete-paths.ignoredPatterns'];
    cacheOptions.forEach(function (cacheOption) {
      _this.subscriptions.add(atom.config.observe(cacheOption, function (value) {
        if (!_this._provider) return;
        _this._provider.rebuildCache();
      }));
    });

    var scopeOptions = ['autocomplete-paths.scopes'];
    for (var key in _configOptionScopes2['default']) {
      scopeOptions.push('autocomplete-paths.' + key);
    }
    scopeOptions.forEach(function (scopeOption) {
      _this.subscriptions.add(atom.config.observe(scopeOption, function (value) {
        if (!_this._provider) return;
        _this._provider.reloadScopes();
      }));
    });
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
    if (this._provider) {
      this._provider.dispose();
      this._provider = null;
    }
    if (this._statusBarTile) {
      this._statusBarTile.destroy();
      this._statusBarTile = null;
    }
  },

  /**
   * Invoked when the status bar becomes available
   * @param  {StatusBar} statusBar
   */
  consumeStatusBar: function consumeStatusBar(statusBar) {
    this._statusBar = statusBar;
    if (this._displayStatusBarItemOnConsumption) {
      this._displayStatusBarTile();
    }
  },

  /**
   * Displays the status bar tile
   */
  _displayStatusBarTile: function _displayStatusBarTile() {
    var _this2 = this;

    if (!this._statusBar) {
      this._displayStatusBarItemOnConsumption = true;
      return;
    }
    if (this._statusBarTile) return;

    this._statusBarElement = document.createElement('autocomplete-paths-status-bar');
    this._statusBarElement.innerHTML = 'Rebuilding paths cache...';
    this._statusBarTile = this._statusBar.addRightTile({
      item: this._statusBarElement,
      priority: 100
    });
    this._statusBarInterval = setInterval(function () {
      var fileCount = _this2._provider.fileCount;
      _this2._statusBarElement.innerHTML = 'Rebuilding paths cache... ' + fileCount + ' files';
    }, 500);
  },

  /**
   * Hides the status bar tile
   */
  _hideStatusBarTile: function _hideStatusBarTile() {
    clearInterval(this._statusBarInterval);
    this._statusBarTile && this._statusBarTile.destroy();
    this._statusBarTile = null;
    this._statusBarElement = null;
  },

  getProvider: function getProvider() {
    var _this3 = this;

    if (!this._provider) {
      this._provider = new _pathsProvider2['default']();
      this._provider.on('rebuild-cache', function () {
        _this3._displayStatusBarTile();
      });
      this._provider.on('rebuild-cache-done', function () {
        _this3._hideStatusBarTile();
      });
      this._provider.rebuildCache();
    }
    return this._provider;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9hdXRvY29tcGxldGUtcGF0aHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7c0JBR21CLFVBQVU7Ozs7NkJBQ0gsa0JBQWtCOzs7O29CQUNSLE1BQU07O2tDQUNqQix3QkFBd0I7Ozs7QUFOakQsV0FBVyxDQUFBLHFCQVFJO0FBQ2IsUUFBTSxxQkFBUTtBQUNkLGVBQWEsRUFBRSxJQUFJOztBQUVuQixVQUFRLEVBQUUsb0JBQVk7OztBQUNwQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3pELHdDQUFrQyxFQUFFLHlDQUFNO0FBQ3hDLGNBQUssU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFBO09BQzlCO0tBQ0YsQ0FBQyxDQUFDLENBQUE7O0FBRUgsUUFBTSxZQUFZLEdBQUcsQ0FDbkIsbUJBQW1CLEVBQ25CLDZCQUE2QixFQUM3QixxQ0FBcUMsRUFDckMsaUNBQWlDLEVBQ2pDLG9DQUFvQyxDQUNyQyxDQUFBO0FBQ0QsZ0JBQVksQ0FBQyxPQUFPLENBQUMsVUFBQSxXQUFXLEVBQUk7QUFDbEMsWUFBSyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFBLEtBQUssRUFBSTtBQUMvRCxZQUFJLENBQUMsTUFBSyxTQUFTLEVBQUUsT0FBTTtBQUMzQixjQUFLLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtPQUM5QixDQUFDLENBQUMsQ0FBQTtLQUNKLENBQUMsQ0FBQTs7QUFFRixRQUFNLFlBQVksR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUE7QUFDbEQsU0FBSyxJQUFJLEdBQUcscUNBQWtCO0FBQzVCLGtCQUFZLENB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QyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUE7S0FDOUI7QUFDRCxXQUFPLElBQUksQ0FBQyxTQUFTLENBQUE7R0FDdEI7Q0FDRiIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9saWIvYXV0b2NvbXBsZXRlLXBhdGhzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qIGdsb2JhbCBhdG9tICovXG5cbmltcG9ydCBDb25maWcgZnJvbSAnLi9jb25maWcnXG5pbXBvcnQgUGF0aHNQcm92aWRlciBmcm9tICcuL3BhdGhzLXByb3ZpZGVyJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgT3B0aW9uU2NvcGVzIGZyb20gJy4vY29uZmlnL29wdGlvbi1zY29wZXMnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29uZmlnOiBDb25maWcsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG5cbiAgYWN0aXZhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnYXV0b2NvbXBsZXRlLXBhdGhzOnJlYnVpbGQtY2FjaGUnOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuX3Byb3ZpZGVyLnJlYnVpbGRDYWNoZSgpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICBjb25zdCBjYWNoZU9wdGlvbnMgPSBbXG4gICAgICAnY29yZS5pZ25vcmVkTmFtZXMnLFxuICAgICAgJ2NvcmUuZXhjbHVkZVZjc0lnbm9yZWRQYXRocycsXG4gICAgICAnYXV0b2NvbXBsZXRlLXBhdGhzLmlnbm9yZVN1Ym1vZHVsZXMnLFxuICAgICAgJ2F1dG9jb21wbGV0ZS1wYXRocy5pZ25vcmVkTmFtZXMnLFxuICAgICAgJ2F1dG9jb21wbGV0ZS1wYXRocy5pZ25vcmVkUGF0dGVybnMnXG4gICAgXVxuICAgIGNhY2hlT3B0aW9ucy5mb3JFYWNoKGNhY2hlT3B0aW9uID0+IHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZShjYWNoZU9wdGlvbiwgdmFsdWUgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuX3Byb3ZpZGVyKSByZXR1cm5cbiAgICAgICAgdGhpcy5fcHJvdmlkZXIucmVidWlsZENhY2hlKClcbiAgICAgIH0pKVxuICAgIH0pXG5cbiAgICBjb25zdCBzY29wZU9wdGlvbnMgPSBbJ2F1dG9jb21wbGV0ZS1wYXRocy5zY29wZXMnXVxuICAgIGZvciAobGV0IGtleSBpbiBPcHRpb25TY29wZXMpIHtcbiAgICAgIHNjb3BlT3B0aW9ucy5wdXNoKGBhdXRvY29tcGxldGUtcGF0aHMuJHtrZXl9YClcbiAgICB9XG4gICAgc2NvcGVPcHRpb25zLmZvckVhY2goc2NvcGVPcHRpb24gPT4ge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKHNjb3BlT3B0aW9uLCB2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5fcHJvdmlkZXIpIHJldHVyblxuICAgICAgICB0aGlzLl9wcm92aWRlci5yZWxvYWRTY29wZXMoKVxuICAgICAgfSkpXG4gICAgfSlcbiAgfSxcblxuICBkZWFjdGl2YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIGlmICh0aGlzLl9wcm92aWRlcikge1xuICAgICAgdGhpcy5fcHJvdmlkZXIuZGlzcG9zZSgpXG4gICAgICB0aGlzLl9wcm92aWRlciA9IG51bGxcbiAgICB9XG4gICAgaWYgKHRoaXMuX3N0YXR1c0JhclRpbGUpIHtcbiAgICAgIHRoaXMuX3N0YXR1c0JhclRpbGUuZGVzdHJveSgpXG4gICAgICB0aGlzLl9zdGF0dXNCYXJUaWxlID0gbnVsbFxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW52b2tlZCB3aGVuIHRoZSBzdGF0dXMgYmFyIGJlY29tZXMgYXZhaWxhYmxlXG4gICAqIEBwYXJhbSAge1N0YXR1c0Jhcn0gc3RhdHVzQmFyXG4gICAqL1xuICBjb25zdW1lU3RhdHVzQmFyOiBmdW5jdGlvbiAoc3RhdHVzQmFyKSB7XG4gICAgdGhpcy5fc3RhdHVzQmFyID0gc3RhdHVzQmFyXG4gICAgaWYgKHRoaXMuX2Rpc3BsYXlTdGF0dXNCYXJJdGVtT25Db25zdW1wdGlvbikge1xuICAgICAgdGhpcy5fZGlzcGxheVN0YXR1c0JhclRpbGUoKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRGlzcGxheXMgdGhlIHN0YXR1cyBiYXIgdGlsZVxuICAgKi9cbiAgX2Rpc3BsYXlTdGF0dXNCYXJUaWxlICgpIHtcbiAgICBpZiAoIXRoaXMuX3N0YXR1c0Jhcikge1xuICAgICAgdGhpcy5fZGlzcGxheVN0YXR1c0Jhckl0ZW1PbkNvbnN1bXB0aW9uID0gdHJ1ZVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLl9zdGF0dXNCYXJUaWxlKSByZXR1cm5cblxuICAgIHRoaXMuX3N0YXR1c0JhckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdXRvY29tcGxldGUtcGF0aHMtc3RhdHVzLWJhcicpXG4gICAgdGhpcy5fc3RhdHVzQmFyRWxlbWVudC5pbm5lckhUTUwgPSAnUmVidWlsZGluZyBwYXRocyBjYWNoZS4uLidcbiAgICB0aGlzLl9zdGF0dXNCYXJUaWxlID0gdGhpcy5fc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSh7XG4gICAgICBpdGVtOiB0aGlzLl9zdGF0dXNCYXJFbGVtZW50LFxuICAgICAgcHJpb3JpdHk6IDEwMFxuICAgIH0pXG4gICAgdGhpcy5fc3RhdHVzQmFySW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlQ291bnQgPSB0aGlzLl9wcm92aWRlci5maWxlQ291bnQ7XG4gICAgICB0aGlzLl9zdGF0dXNCYXJFbGVtZW50LmlubmVySFRNTCA9IGBSZWJ1aWxkaW5nIHBhdGhzIGNhY2hlLi4uICR7ZmlsZUNvdW50fSBmaWxlc2A7XG4gICAgfSwgNTAwKVxuICB9LFxuXG4gIC8qKlxuICAgKiBIaWRlcyB0aGUgc3RhdHVzIGJhciB0aWxlXG4gICAqL1xuICBfaGlkZVN0YXR1c0JhclRpbGUgKCkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fc3RhdHVzQmFySW50ZXJ2YWwpXG4gICAgdGhpcy5fc3RhdHVzQmFyVGlsZSAmJiB0aGlzLl9zdGF0dXNCYXJUaWxlLmRlc3Ryb3koKVxuICAgIHRoaXMuX3N0YXR1c0JhclRpbGUgPSBudWxsXG4gICAgdGhpcy5fc3RhdHVzQmFyRWxlbWVudCA9IG51bGxcbiAgfSxcblxuICBnZXRQcm92aWRlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fcHJvdmlkZXIpIHtcbiAgICAgIHRoaXMuX3Byb3ZpZGVyID0gbmV3IFBhdGhzUHJvdmlkZXIoKVxuICAgICAgdGhpcy5fcHJvdmlkZXIub24oJ3JlYnVpbGQtY2FjaGUnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlTdGF0dXNCYXJUaWxlKClcbiAgICAgIH0pXG4gICAgICB0aGlzLl9wcm92aWRlci5vbigncmVidWlsZC1jYWNoZS1kb25lJywgKCkgPT4ge1xuICAgICAgICB0aGlzLl9oaWRlU3RhdHVzQmFyVGlsZSgpXG4gICAgICB9KVxuICAgICAgdGhpcy5fcHJvdmlkZXIucmVidWlsZENhY2hlKClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3Byb3ZpZGVyXG4gIH1cbn1cbiJdfQ==