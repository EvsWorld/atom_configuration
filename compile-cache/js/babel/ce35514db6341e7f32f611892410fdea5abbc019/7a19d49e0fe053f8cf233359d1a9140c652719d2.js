Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* eslint-disable import/no-duplicates */

var _sbConfigFile = require('sb-config-file');

var _sbConfigFile2 = _interopRequireDefault(_sbConfigFile);

var _atom = require('atom');

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var _validate = require('./validate');

var Validate = _interopRequireWildcard(_validate);

var LinterRegistry = (function () {
  function LinterRegistry() {
    var _this = this;

    _classCallCheck(this, LinterRegistry);

    this.config = null;
    this.emitter = new _atom.Emitter();
    this.linters = new Set();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter.lintOnChange', function (lintOnChange) {
      _this.lintOnChange = lintOnChange;
    }));
    this.subscriptions.add(atom.config.observe('core.excludeVcsIgnoredPaths', function (ignoreVCS) {
      _this.ignoreVCS = ignoreVCS;
    }));
    this.subscriptions.add(atom.config.observe('linter.ignoreGlob', function (ignoreGlob) {
      _this.ignoreGlob = ignoreGlob;
    }));
    this.subscriptions.add(atom.config.observe('linter.lintPreviewTabs', function (lintPreviewTabs) {
      _this.lintPreviewTabs = lintPreviewTabs;
    }));
    this.subscriptions.add(this.emitter);
  }

  _createClass(LinterRegistry, [{
    key: 'hasLinter',
    value: function hasLinter(linter) {
      return this.linters.has(linter);
    }
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      var legacy = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var version = legacy ? 1 : 2;
      if (!Validate.linter(linter, version)) {
        return;
      }
      linter[_helpers.$activated] = true;
      if (typeof linter[_helpers.$requestLatest] === 'undefined') {
        linter[_helpers.$requestLatest] = 0;
      }
      if (typeof linter[_helpers.$requestLastReceived] === 'undefined') {
        linter[_helpers.$requestLastReceived] = 0;
      }
      linter[_helpers.$version] = version;
      this.linters.add(linter);
    }
  }, {
    key: 'getLinters',
    value: function getLinters() {
      return Array.from(this.linters);
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      if (!this.linters.has(linter)) {
        return;
      }
      linter[_helpers.$activated] = false;
      this.linters['delete'](linter);
    }
  }, {
    key: 'getConfig',
    value: _asyncToGenerator(function* () {
      if (!this.config) {
        this.config = yield (0, _helpers.getConfigFile)();
      }
      return this.config;
    })
  }, {
    key: 'lint',
    value: _asyncToGenerator(function* (_ref) {
      var onChange = _ref.onChange;
      var editor = _ref.editor;
      return yield* (function* () {
        var _this2 = this;

        var filePath = editor.getPath();

        if (onChange && !this.lintOnChange || // Lint-on-change mismatch
        !filePath || // Not saved anywhere yet
        Helpers.isPathIgnored(editor.getPath(), this.ignoreGlob, this.ignoreVCS) || // Ignored by VCS or Glob
        !this.lintPreviewTabs && atom.workspace.getActivePane().getPendingItem() === editor // Ignore Preview tabs
        ) {
            return false;
          }

        var scopes = Helpers.getEditorCursorScopes(editor);
        var config = yield this.getConfig();
        var disabled = yield config.get('disabled');

        var promises = [];

        var _loop = function (linter) {
          if (!Helpers.shouldTriggerLinter(linter, onChange, scopes)) {
            return 'continue';
          }
          if (disabled.includes(linter.name)) {
            return 'continue';
          }
          var number = ++linter[_helpers.$requestLatest];
          var statusBuffer = linter.scope === 'file' ? editor.getBuffer() : null;
          var statusFilePath = linter.scope === 'file' ? filePath : null;

          _this2.emitter.emit('did-begin-linting', { number: number, linter: linter, filePath: statusFilePath });
          promises.push(new Promise(function (resolve) {
            // $FlowIgnore: Type too complex, duh
            resolve(linter.lint(editor));
          }).then(function (messages) {
            _this2.emitter.emit('did-finish-linting', { number: number, linter: linter, filePath: statusFilePath });
            if (linter[_helpers.$requestLastReceived] >= number || !linter[_helpers.$activated] || statusBuffer && !statusBuffer.isAlive()) {
              return;
            }
            linter[_helpers.$requestLastReceived] = number;
            if (statusBuffer && !statusBuffer.isAlive()) {
              return;
            }

            if (messages === null) {
              // NOTE: Do NOT update the messages when providers return null
              return;
            }

            var validity = true;
            // NOTE: We are calling it when results are not an array to show a nice notification
            if (atom.inDevMode() || !Array.isArray(messages)) {
              validity = linter[_helpers.$version] === 2 ? Validate.messages(linter.name, messages) : Validate.messagesLegacy(linter.name, messages);
            }
            if (!validity) {
              return;
            }

            if (linter[_helpers.$version] === 2) {
              Helpers.normalizeMessages(linter.name, messages);
            } else {
              Helpers.normalizeMessagesLegacy(linter.name, messages);
            }
            _this2.emitter.emit('did-update-messages', { messages: messages, linter: linter, buffer: statusBuffer });
          }, function (error) {
            _this2.emitter.emit('did-finish-linting', { number: number, linter: linter, filePath: statusFilePath });
            atom.notifications.addError('[Linter] Error running ' + linter.name, {
              detail: 'See console for more info'
            });
            console.error('[Linter] Error running ' + linter.name, error);
          }));
        };

        for (var linter of this.linters) {
          var _ret = _loop(linter);

          if (_ret === 'continue') continue;
        }

        yield Promise.all(promises);
        return true;
      }).apply(this, arguments);
    })
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'onDidBeginLinting',
    value: function onDidBeginLinting(callback) {
      return this.emitter.on('did-begin-linting', callback);
    }
  }, {
    key: 'onDidFinishLinting',
    value: function onDidFinishLinting(callback) {
      return this.emitter.on('did-finish-linting', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.linters.clear();
      this.subscriptions.dispose();
    }
  }]);

  return LinterRegistry;
})();

exports['default'] = LinterRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFHdUIsZ0JBQWdCOzs7O29CQUNNLE1BQU07O3VCQUcxQixXQUFXOztJQUF4QixPQUFPOzt3QkFDTyxZQUFZOztJQUExQixRQUFROztJQUlDLGNBQWM7QUFVdEIsV0FWUSxjQUFjLEdBVW5COzs7MEJBVkssY0FBYzs7QUFXL0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDbEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN4QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxVQUFDLFlBQVksRUFBSztBQUNsRixZQUFLLFlBQVksR0FBRyxZQUFZLENBQUE7S0FDakMsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRSxVQUFDLFNBQVMsRUFBSztBQUN2RixZQUFLLFNBQVMsR0FBRyxTQUFTLENBQUE7S0FDM0IsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxVQUFDLFVBQVUsRUFBSztBQUM5RSxZQUFLLFVBQVUsR0FBRyxVQUFVLENBQUE7S0FDN0IsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFD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QjthQUNwQyxDQUFDLENBQUE7QUFDRixtQkFBTyxDQUFDLEtBQUssNkJBQTJCLE1BQU0sQ0FBQyxJQUFJLEVBQUksS0FBSyxDQUFDLENBQUE7V0FDOUQsQ0FBQyxDQUFDLENBQUE7OztBQW5ETCxhQUFLLElBQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7MkJBQXhCLE1BQU07O21DQUtiLFNBQVE7U0ErQ1g7O0FBRUQsY0FBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzNCLGVBQU8sSUFBSSxDQUFBO09BQ1o7S0FBQTs7O1dBQ2tCLDZCQUFDLFFBQWtCLEVBQWM7QUFDbEQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN4RDs7O1dBQ2dCLDJCQUFDLFFBQWtCLEVBQWM7QUFDaEQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN0RDs7O1dBQ2lCLDRCQUFDLFFBQWtCLEVBQWM7QUFDakQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN2RDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3BCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXRKa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZHVwbGljYXRlcyAqL1xuXG5pbXBvcnQgQ29uZmlnRmlsZSBmcm9tICdzYi1jb25maWctZmlsZSdcbmltcG9ydCB7IEVtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBUZXh0RWRpdG9yLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgKiBhcyBWYWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlJ1xuaW1wb3J0IHsgJHZlcnNpb24sICRhY3RpdmF0ZWQsICRyZXF1ZXN0TGF0ZXN0LCAkcmVxdWVzdExhc3RSZWNlaXZlZCwgZ2V0Q29uZmlnRmlsZSB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGludGVyUmVnaXN0cnkge1xuICBjb25maWc6ID9Db25maWdGaWxlO1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBsaW50ZXJzOiBTZXQ8TGludGVyPjtcbiAgbGludE9uQ2hhbmdlOiBib29sZWFuO1xuICBpZ25vcmVWQ1M6IGJvb2xlYW47XG4gIGlnbm9yZUdsb2I6IHN0cmluZztcbiAgbGludFByZXZpZXdUYWJzOiBib29sZWFuO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29uZmlnID0gbnVsbFxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmxpbnRlcnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50T25DaGFuZ2UnLCAobGludE9uQ2hhbmdlKSA9PiB7XG4gICAgICB0aGlzLmxpbnRPbkNoYW5nZSA9IGxpbnRPbkNoYW5nZVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJywgKGlnbm9yZVZDUykgPT4ge1xuICAgICAgdGhpcy5pZ25vcmVWQ1MgPSBpZ25vcmVWQ1NcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5pZ25vcmVHbG9iJywgKGlnbm9yZUdsb2IpID0+IHtcbiAgICAgIHRoaXMuaWdub3JlR2xvYiA9IGlnbm9yZUdsb2JcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50UHJldmlld1RhYnMnLCAobGludFByZXZpZXdUYWJzKSA9PiB7XG4gICAgICB0aGlzLmxpbnRQcmV2aWV3VGFicyA9IGxpbnRQcmV2aWV3VGFic1xuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICB9XG4gIGhhc0xpbnRlcihsaW50ZXI6IExpbnRlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmxpbnRlcnMuaGFzKGxpbnRlcilcbiAgfVxuICBhZGRMaW50ZXIobGludGVyOiBMaW50ZXIsIGxlZ2FjeTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgdmVyc2lvbiA9IGxlZ2FjeSA/IDEgOiAyXG4gICAgaWYgKCFWYWxpZGF0ZS5saW50ZXIobGludGVyLCB2ZXJzaW9uKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxpbnRlclskYWN0aXZhdGVkXSA9IHRydWVcbiAgICBpZiAodHlwZW9mIGxpbnRlclskcmVxdWVzdExhdGVzdF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBsaW50ZXJbJHJlcXVlc3RMYXRlc3RdID0gMFxuICAgIH1cbiAgICBpZiAodHlwZW9mIGxpbnRlclskcmVxdWVzdExhc3RSZWNlaXZlZF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBsaW50ZXJbJHJlcXVlc3RMYXN0UmVjZWl2ZWRdID0gMFxuICAgIH1cbiAgICBsaW50ZXJbJHZlcnNpb25dID0gdmVyc2lvblxuICAgIHRoaXMubGludGVycy5hZGQobGludGVyKVxuICB9XG4gIGdldExpbnRlcnMoKTogQXJyYXk8TGludGVyPiB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5saW50ZXJzKVxuICB9XG4gIGRlbGV0ZUxpbnRlcihsaW50ZXI6IExpbnRlcikge1xuICAgIGlmICghdGhpcy5saW50ZXJzLmhhcyhsaW50ZXIpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbGludGVyWyRhY3RpdmF0ZWRdID0gZmFsc2VcbiAgICB0aGlzLmxpbnRlcnMuZGVsZXRlKGxpbnRlcilcbiAgfVxuICBhc3luYyBnZXRDb25maWcoKTogUHJvbWlzZTxDb25maWdGaWxlPiB7XG4gICAgaWYgKCF0aGlzLmNvbmZpZykge1xuICAgICAgdGhpcy5jb25maWcgPSBhd2FpdCBnZXRDb25maWdGaWxlKClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnXG4gIH1cbiAgYXN5bmMgbGludCh7IG9uQ2hhbmdlLCBlZGl0b3IgfSA6IHsgb25DaGFuZ2U6IGJvb2xlYW4sIGVkaXRvcjogVGV4dEVkaXRvciB9KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgICBpZiAoXG4gICAgICAob25DaGFuZ2UgJiYgIXRoaXMubGludE9uQ2hhbmdlKSB8fCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW50LW9uLWNoYW5nZSBtaXNtYXRjaFxuICAgICAgIWZpbGVQYXRoIHx8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90IHNhdmVkIGFueXdoZXJlIHlldFxuICAgICAgSGVscGVycy5pc1BhdGhJZ25vcmVkKGVkaXRvci5nZXRQYXRoKCksIHRoaXMuaWdub3JlR2xvYiwgdGhpcy5pZ25vcmVWQ1MpIHx8ICAgICAgICAgICAgICAgLy8gSWdub3JlZCBieSBWQ1Mgb3IgR2xvYlxuICAgICAgKCF0aGlzLmxpbnRQcmV2aWV3VGFicyAmJiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0UGVuZGluZ0l0ZW0oKSA9PT0gZWRpdG9yKSAgICAgLy8gSWdub3JlIFByZXZpZXcgdGFic1xuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3Qgc2NvcGVzID0gSGVscGVycy5nZXRFZGl0b3JDdXJzb3JTY29wZXMoZWRpdG9yKVxuICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKClcbiAgICBjb25zdCBkaXNhYmxlZCA9IGF3YWl0IGNvbmZpZy5nZXQoJ2Rpc2FibGVkJylcblxuICAgIGNvbnN0IHByb21pc2VzID0gW11cbiAgICBmb3IgKGNvbnN0IGxpbnRlciBvZiB0aGlzLmxpbnRlcnMpIHtcbiAgICAgIGlmICghSGVscGVycy5zaG91bGRUcmlnZ2VyTGludGVyKGxpbnRlciwgb25DaGFuZ2UsIHNjb3BlcykpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGlmIChkaXNhYmxlZC5pbmNsdWRlcyhsaW50ZXIubmFtZSkpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGNvbnN0IG51bWJlciA9ICsrbGludGVyWyRyZXF1ZXN0TGF0ZXN0XVxuICAgICAgY29uc3Qgc3RhdHVzQnVmZmVyID0gbGludGVyLnNjb3BlID09PSAnZmlsZScgPyBlZGl0b3IuZ2V0QnVmZmVyKCkgOiBudWxsXG4gICAgICBjb25zdCBzdGF0dXNGaWxlUGF0aCA9IGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnID8gZmlsZVBhdGggOiBudWxsXG5cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtYmVnaW4tbGludGluZycsIHsgbnVtYmVyLCBsaW50ZXIsIGZpbGVQYXRoOiBzdGF0dXNGaWxlUGF0aCB9KVxuICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIC8vICRGbG93SWdub3JlOiBUeXBlIHRvbyBjb21wbGV4LCBkdWhcbiAgICAgICAgcmVzb2x2ZShsaW50ZXIubGludChlZGl0b3IpKVxuICAgICAgfSkudGhlbigobWVzc2FnZXMpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1maW5pc2gtbGludGluZycsIHsgbnVtYmVyLCBsaW50ZXIsIGZpbGVQYXRoOiBzdGF0dXNGaWxlUGF0aCB9KVxuICAgICAgICBpZiAobGludGVyWyRyZXF1ZXN0TGFzdFJlY2VpdmVkXSA+PSBudW1iZXIgfHwgIWxpbnRlclskYWN0aXZhdGVkXSB8fCAoc3RhdHVzQnVmZmVyICYmICFzdGF0dXNCdWZmZXIuaXNBbGl2ZSgpKSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGxpbnRlclskcmVxdWVzdExhc3RSZWNlaXZlZF0gPSBudW1iZXJcbiAgICAgICAgaWYgKHN0YXR1c0J1ZmZlciAmJiAhc3RhdHVzQnVmZmVyLmlzQWxpdmUoKSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lc3NhZ2VzID09PSBudWxsKSB7XG4gICAgICAgICAgLy8gTk9URTogRG8gTk9UIHVwZGF0ZSB0aGUgbWVzc2FnZXMgd2hlbiBwcm92aWRlcnMgcmV0dXJuIG51bGxcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YWxpZGl0eSA9IHRydWVcbiAgICAgICAgLy8gTk9URTogV2UgYXJlIGNhbGxpbmcgaXQgd2hlbiByZXN1bHRzIGFyZSBub3QgYW4gYXJyYXkgdG8gc2hvdyBhIG5pY2Ugbm90aWZpY2F0aW9uXG4gICAgICAgIGlmIChhdG9tLmluRGV2TW9kZSgpIHx8ICFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgICAgIHZhbGlkaXR5ID0gbGludGVyWyR2ZXJzaW9uXSA9PT0gMiA/IFZhbGlkYXRlLm1lc3NhZ2VzKGxpbnRlci5uYW1lLCBtZXNzYWdlcykgOiBWYWxpZGF0ZS5tZXNzYWdlc0xlZ2FjeShsaW50ZXIubmFtZSwgbWVzc2FnZXMpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWxpZGl0eSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpbnRlclskdmVyc2lvbl0gPT09IDIpIHtcbiAgICAgICAgICBIZWxwZXJzLm5vcm1hbGl6ZU1lc3NhZ2VzKGxpbnRlci5uYW1lLCBtZXNzYWdlcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBIZWxwZXJzLm5vcm1hbGl6ZU1lc3NhZ2VzTGVnYWN5KGxpbnRlci5uYW1lLCBtZXNzYWdlcylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1tZXNzYWdlcycsIHsgbWVzc2FnZXMsIGxpbnRlciwgYnVmZmVyOiBzdGF0dXNCdWZmZXIgfSlcbiAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWZpbmlzaC1saW50aW5nJywgeyBudW1iZXIsIGxpbnRlciwgZmlsZVBhdGg6IHN0YXR1c0ZpbGVQYXRoIH0pXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgW0xpbnRlcl0gRXJyb3IgcnVubmluZyAke2xpbnRlci5uYW1lfWAsIHtcbiAgICAgICAgICBkZXRhaWw6ICdTZWUgY29uc29sZSBmb3IgbW9yZSBpbmZvJyxcbiAgICAgICAgfSlcbiAgICAgICAgY29uc29sZS5lcnJvcihgW0xpbnRlcl0gRXJyb3IgcnVubmluZyAke2xpbnRlci5uYW1lfWAsIGVycm9yKVxuICAgICAgfSkpXG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBvbkRpZFVwZGF0ZU1lc3NhZ2VzKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuICBvbkRpZEJlZ2luTGludGluZyhjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYmVnaW4tbGludGluZycsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkRmluaXNoTGludGluZyhjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZmluaXNoLWxpbnRpbmcnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMubGludGVycy5jbGVhcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=