var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashUniq = require('lodash.uniq');

var _lodashUniq2 = _interopRequireDefault(_lodashUniq);

var _atom = require('atom');

var _packageJson = require('../package.json');

var _packageJson2 = _interopRequireDefault(_packageJson);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _uiRegistry = require('./ui-registry');

var _uiRegistry2 = _interopRequireDefault(_uiRegistry);

var _toggleView = require('./toggle-view');

var _toggleView2 = _interopRequireDefault(_toggleView);

var _indieRegistry = require('./indie-registry');

var _indieRegistry2 = _interopRequireDefault(_indieRegistry);

var _linterRegistry = require('./linter-registry');

var _linterRegistry2 = _interopRequireDefault(_linterRegistry);

var _messageRegistry = require('./message-registry');

var _messageRegistry2 = _interopRequireDefault(_messageRegistry);

var _editorRegistry = require('./editor-registry');

var _editorRegistry2 = _interopRequireDefault(_editorRegistry);

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var Linter = (function () {
  function Linter() {
    var _this = this;

    _classCallCheck(this, Linter);

    this.commands = new _commands2['default']();
    this.registryUI = new _uiRegistry2['default']();
    this.registryIndie = new _indieRegistry2['default']();
    this.registryEditors = new _editorRegistry2['default']();
    this.registryLinters = new _linterRegistry2['default']();
    this.registryMessages = new _messageRegistry2['default']();

    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.commands);
    this.subscriptions.add(this.registryUI);
    this.subscriptions.add(this.registryIndie);
    this.subscriptions.add(this.registryMessages);
    this.subscriptions.add(this.registryEditors);
    this.subscriptions.add(this.registryLinters);

    this.commands.onShouldLint(function () {
      var editorLinter = _this.registryEditors.get(atom.workspace.getActiveTextEditor());
      if (editorLinter) {
        editorLinter.lint();
      }
    });
    this.commands.onShouldToggleActiveEditor(function () {
      var textEditor = atom.workspace.getActiveTextEditor();
      var editor = _this.registryEditors.get(textEditor);
      if (editor) {
        editor.dispose();
      } else if (textEditor) {
        _this.registryEditors.createFromTextEditor(textEditor);
      }
    });
    // NOTE: ESLint arrow-parens rule has a bug
    // eslint-disable-next-line arrow-parens
    this.commands.onShouldDebug(_asyncToGenerator(function* () {
      var linters = _this.registryLinters.getLinters();
      var configFile = yield Helpers.getConfigFile();
      var textEditor = atom.workspace.getActiveTextEditor();
      var textEditorScopes = Helpers.getEditorCursorScopes(textEditor);

      var allLinters = linters.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      }).map(function (linter) {
        return '  - ' + linter.name;
      }).join('\n');
      var matchingLinters = linters.filter(function (linter) {
        return Helpers.shouldTriggerLinter(linter, false, textEditorScopes);
      }).sort(function (a, b) {
        return a.name.localeCompare(b.name);
      }).map(function (linter) {
        return '  - ' + linter.name;
      }).join('\n');
      var humanizedScopes = textEditorScopes.map(function (scope) {
        return '  - ' + scope;
      }).join('\n');
      var disabledLinters = (yield configFile.get('disabled')).map(function (linter) {
        return '  - ' + linter;
      }).join('\n');

      atom.notifications.addInfo('Linter Debug Info', {
        detail: ['Platform: ' + process.platform, 'Atom Version: ' + atom.getVersion(), 'Linter Version: ' + _packageJson2['default'].version, 'All Linter Providers: \n' + allLinters, 'Matching Linter Providers: \n' + matchingLinters, 'Disabled Linter Providers; \n' + disabledLinters, 'Current File scopes: \n' + humanizedScopes].join('\n'),
        dismissable: true
      });
    }));
    this.commands.onShouldToggleLinter(function (action) {
      var toggleView = new _toggleView2['default'](action, (0, _lodashUniq2['default'])(_this.registryLinters.getLinters().map(function (linter) {
        return linter.name;
      })));
      toggleView.onDidDispose(function () {
        _this.subscriptions.remove(toggleView);
      });
      toggleView.onDidDisable(function (name) {
        var linter = _this.registryLinters.getLinters().find(function (entry) {
          return entry.name === name;
        });
        if (linter) {
          _this.registryMessages.deleteByLinter(linter);
        }
      });
      toggleView.show();
      _this.subscriptions.add(toggleView);
    });
    this.registryIndie.observe(function (indieLinter) {
      indieLinter.onDidDestroy(function () {
        _this.registryMessages.deleteByLinter(indieLinter);
      });
    });
    this.registryEditors.observe(function (editorLinter) {
      editorLinter.onShouldLint(function (onChange) {
        _this.registryLinters.lint({ onChange: onChange, editor: editorLinter.getEditor() });
      });
      editorLinter.onDidDestroy(function () {
        _this.registryMessages.deleteByBuffer(editorLinter.getEditor().getBuffer());
      });
    });
    this.registryIndie.onDidUpdate(function (_ref) {
      var linter = _ref.linter;
      var messages = _ref.messages;

      _this.registryMessages.set({ linter: linter, messages: messages, buffer: null });
    });
    this.registryLinters.onDidUpdateMessages(function (_ref2) {
      var linter = _ref2.linter;
      var messages = _ref2.messages;
      var buffer = _ref2.buffer;

      _this.registryMessages.set({ linter: linter, messages: messages, buffer: buffer });
    });
    this.registryLinters.onDidBeginLinting(function (_ref3) {
      var linter = _ref3.linter;
      var filePath = _ref3.filePath;

      _this.registryUI.didBeginLinting(linter, filePath);
    });
    this.registryLinters.onDidFinishLinting(function (_ref4) {
      var linter = _ref4.linter;
      var filePath = _ref4.filePath;

      _this.registryUI.didFinishLinting(linter, filePath);
    });
    this.registryMessages.onDidUpdateMessages(function (difference) {
      _this.registryUI.render(difference);
    });

    this.registryEditors.activate();

    setTimeout(function () {
      // NOTE: Atom triggers this on boot so wait a while
      if (!_this.subscriptions.disposed) {
        _this.subscriptions.add(atom.project.onDidChangePaths(function () {
          _this.commands.lint();
        }));
      }
    }, 100);
  }

  _createClass(Linter, [{
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }

    // API methods for providing/consuming services
  }, {
    key: 'addUI',
    value: function addUI(ui) {
      this.registryUI.add(ui);

      var messages = this.registryMessages.messages;
      if (messages.length) {
        ui.render({ added: messages, messages: messages, removed: [] });
      }
    }
  }, {
    key: 'deleteUI',
    value: function deleteUI(ui) {
      this.registryUI['delete'](ui);
    }
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      var legacy = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.registryLinters.addLinter(linter, legacy);
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      this.registryLinters.deleteLinter(linter);
      this.registryMessages.deleteByLinter(linter);
    }
  }]);

  return Linter;
})();

module.exports = Linter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7MEJBRXdCLGFBQWE7Ozs7b0JBQ0QsTUFBTTs7MkJBRXJCLGlCQUFpQjs7Ozt3QkFDakIsWUFBWTs7OzswQkFDVixlQUFlOzs7OzBCQUNmLGVBQWU7Ozs7NkJBQ1osa0JBQWtCOzs7OzhCQUNqQixtQkFBbUI7Ozs7K0JBQ2xCLG9CQUFvQjs7Ozs4QkFDcEIsbUJBQW1COzs7O3VCQUN0QixXQUFXOztJQUF4QixPQUFPOztJQUdiLE1BQU07QUFTQyxXQVRQLE1BQU0sR0FTSTs7OzBCQVRWLE1BQU07O0FBVVIsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxVQUFVLEdBQUcsNkJBQWdCLENBQUE7QUFDbEMsUUFBSSxDQUFDLGFBQWEsR0FBRyxnQ0FBbUIsQ0FBQTtBQUN4QyxRQUFJLENBQUMsZUFBZSxHQUFHLGlDQUFxQixDQUFBO0FBQzVDLFFBQUksQ0FBQyxlQUFlLEdBQUcsaUNBQW9CLENBQUE7QUFDM0MsUUFBSSxDQUFDLGdCQUFnQixHQUFHLGtDQUFxQixDQUFBOztBQUU3QyxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDckMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3ZDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUMxQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUM3QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFB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QUksUUFBUSxDQUFDLE1BQU0sRUFBRTtBQUNuQixVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO09BQ3REO0tBQ0Y7OztXQUNPLGtCQUFDLEVBQU0sRUFBRTtBQUNmLFVBQUksQ0FBQyxVQUFVLFVBQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtLQUMzQjs7O1dBQ1EsbUJBQUMsTUFBc0IsRUFBMkI7VUFBekIsTUFBZSx5REFBRyxLQUFLOztBQUN2RCxVQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7S0FDL0M7OztXQUNXLHNCQUFDLE1BQXNCLEVBQUU7QUFDbkMsVUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDekMsVUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUM3Qzs7O1NBdEpHLE1BQU07OztBQXlKWixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQSIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBhcnJheVVuaXF1ZSBmcm9tICdsb2Rhc2gudW5pcSdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi4vcGFja2FnZS5qc29uJ1xuaW1wb3J0IENvbW1hbmRzIGZyb20gJy4vY29tbWFuZHMnXG5pbXBvcnQgVUlSZWdpc3RyeSBmcm9tICcuL3VpLXJlZ2lzdHJ5J1xuaW1wb3J0IFRvZ2dsZVZpZXcgZnJvbSAnLi90b2dnbGUtdmlldydcbmltcG9ydCBJbmRpZVJlZ2lzdHJ5IGZyb20gJy4vaW5kaWUtcmVnaXN0cnknXG5pbXBvcnQgTGludGVyUmVnaXN0cnkgZnJvbSAnLi9saW50ZXItcmVnaXN0cnknXG5pbXBvcnQgTWVzc2FnZVJlZ2lzdHJ5IGZyb20gJy4vbWVzc2FnZS1yZWdpc3RyeSdcbmltcG9ydCBFZGl0b3JzUmVnaXN0cnkgZnJvbSAnLi9lZGl0b3ItcmVnaXN0cnknXG5pbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgVUksIExpbnRlciBhcyBMaW50ZXJQcm92aWRlciB9IGZyb20gJy4vdHlwZXMnXG5cbmNsYXNzIExpbnRlciB7XG4gIGNvbW1hbmRzOiBDb21tYW5kcztcbiAgcmVnaXN0cnlVSTogVUlSZWdpc3RyeTtcbiAgcmVnaXN0cnlJbmRpZTogSW5kaWVSZWdpc3RyeTtcbiAgcmVnaXN0cnlFZGl0b3JzOiBFZGl0b3JzUmVnaXN0cnk7XG4gIHJlZ2lzdHJ5TGludGVyczogTGludGVyUmVnaXN0cnk7XG4gIHJlZ2lzdHJ5TWVzc2FnZXM6IE1lc3NhZ2VSZWdpc3RyeTtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbW1hbmRzID0gbmV3IENvbW1hbmRzKClcbiAgICB0aGlzLnJlZ2lzdHJ5VUkgPSBuZXcgVUlSZWdpc3RyeSgpXG4gICAgdGhpcy5yZWdpc3RyeUluZGllID0gbmV3IEluZGllUmVnaXN0cnkoKVxuICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzID0gbmV3IEVkaXRvcnNSZWdpc3RyeSgpXG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMgPSBuZXcgTGludGVyUmVnaXN0cnkoKVxuICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlcyA9IG5ldyBNZXNzYWdlUmVnaXN0cnkoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmNvbW1hbmRzKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5yZWdpc3RyeVVJKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5yZWdpc3RyeUluZGllKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5yZWdpc3RyeU1lc3NhZ2VzKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5yZWdpc3RyeUVkaXRvcnMpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnJlZ2lzdHJ5TGludGVycylcblxuICAgIHRoaXMuY29tbWFuZHMub25TaG91bGRMaW50KCgpID0+IHtcbiAgICAgIGNvbnN0IGVkaXRvckxpbnRlciA9IHRoaXMucmVnaXN0cnlFZGl0b3JzLmdldChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gICAgICBpZiAoZWRpdG9yTGludGVyKSB7XG4gICAgICAgIGVkaXRvckxpbnRlci5saW50KClcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMuY29tbWFuZHMub25TaG91bGRUb2dnbGVBY3RpdmVFZGl0b3IoKCkgPT4ge1xuICAgICAgY29uc3QgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgY29uc3QgZWRpdG9yID0gdGhpcy5yZWdpc3RyeUVkaXRvcnMuZ2V0KHRleHRFZGl0b3IpXG4gICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgIGVkaXRvci5kaXNwb3NlKClcbiAgICAgIH0gZWxzZSBpZiAodGV4dEVkaXRvcikge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5jcmVhdGVGcm9tVGV4dEVkaXRvcih0ZXh0RWRpdG9yKVxuICAgICAgfVxuICAgIH0pXG4gICAgLy8gTk9URTogRVNMaW50IGFycm93LXBhcmVucyBydWxlIGhhcyBhIGJ1Z1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBhcnJvdy1wYXJlbnNcbiAgICB0aGlzLmNvbW1hbmRzLm9uU2hvdWxkRGVidWcoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbGludGVycyA9IHRoaXMucmVnaXN0cnlMaW50ZXJzLmdldExpbnRlcnMoKVxuICAgICAgY29uc3QgY29uZmlnRmlsZSA9IGF3YWl0IEhlbHBlcnMuZ2V0Q29uZmlnRmlsZSgpXG4gICAgICBjb25zdCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBjb25zdCB0ZXh0RWRpdG9yU2NvcGVzID0gSGVscGVycy5nZXRFZGl0b3JDdXJzb3JTY29wZXModGV4dEVkaXRvcilcblxuICAgICAgY29uc3QgYWxsTGludGVycyA9IGxpbnRlcnNcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSkpXG4gICAgICAgIC5tYXAobGludGVyID0+IGAgIC0gJHtsaW50ZXIubmFtZX1gKS5qb2luKCdcXG4nKVxuICAgICAgY29uc3QgbWF0Y2hpbmdMaW50ZXJzID0gbGludGVyc1xuICAgICAgICAuZmlsdGVyKGxpbnRlciA9PiBIZWxwZXJzLnNob3VsZFRyaWdnZXJMaW50ZXIobGludGVyLCBmYWxzZSwgdGV4dEVkaXRvclNjb3BlcykpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpKVxuICAgICAgICAubWFwKGxpbnRlciA9PiBgICAtICR7bGludGVyLm5hbWV9YCkuam9pbignXFxuJylcbiAgICAgIGNvbnN0IGh1bWFuaXplZFNjb3BlcyA9IHRleHRFZGl0b3JTY29wZXNcbiAgICAgICAgLm1hcChzY29wZSA9PiBgICAtICR7c2NvcGV9YCkuam9pbignXFxuJylcbiAgICAgIGNvbnN0IGRpc2FibGVkTGludGVycyA9IChhd2FpdCBjb25maWdGaWxlLmdldCgnZGlzYWJsZWQnKSlcbiAgICAgICAgLm1hcChsaW50ZXIgPT4gYCAgLSAke2xpbnRlcn1gKS5qb2luKCdcXG4nKVxuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnTGludGVyIERlYnVnIEluZm8nLCB7XG4gICAgICAgIGRldGFpbDogW1xuICAgICAgICAgIGBQbGF0Zm9ybTogJHtwcm9jZXNzLnBsYXRmb3JtfWAsXG4gICAgICAgICAgYEF0b20gVmVyc2lvbjogJHthdG9tLmdldFZlcnNpb24oKX1gLFxuICAgICAgICAgIGBMaW50ZXIgVmVyc2lvbjogJHttYW5pZmVzdC52ZXJzaW9ufWAsXG4gICAgICAgICAgYEFsbCBMaW50ZXIgUHJvdmlkZXJzOiBcXG4ke2FsbExpbnRlcnN9YCxcbiAgICAgICAgICBgTWF0Y2hpbmcgTGludGVyIFByb3ZpZGVyczogXFxuJHttYXRjaGluZ0xpbnRlcnN9YCxcbiAgICAgICAgICBgRGlzYWJsZWQgTGludGVyIFByb3ZpZGVyczsgXFxuJHtkaXNhYmxlZExpbnRlcnN9YCxcbiAgICAgICAgICBgQ3VycmVudCBGaWxlIHNjb3BlczogXFxuJHtodW1hbml6ZWRTY29wZXN9YCxcbiAgICAgICAgXS5qb2luKCdcXG4nKSxcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICB9KVxuICAgIH0pXG4gICAgdGhpcy5jb21tYW5kcy5vblNob3VsZFRvZ2dsZUxpbnRlcigoYWN0aW9uKSA9PiB7XG4gICAgICBjb25zdCB0b2dnbGVWaWV3ID0gbmV3IFRvZ2dsZVZpZXcoYWN0aW9uLCBhcnJheVVuaXF1ZSh0aGlzLnJlZ2lzdHJ5TGludGVycy5nZXRMaW50ZXJzKCkubWFwKGxpbnRlciA9PiBsaW50ZXIubmFtZSkpKVxuICAgICAgdG9nZ2xlVmlldy5vbkRpZERpc3Bvc2UoKCkgPT4ge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucmVtb3ZlKHRvZ2dsZVZpZXcpXG4gICAgICB9KVxuICAgICAgdG9nZ2xlVmlldy5vbkRpZERpc2FibGUoKG5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgbGludGVyID0gdGhpcy5yZWdpc3RyeUxpbnRlcnMuZ2V0TGludGVycygpLmZpbmQoZW50cnkgPT4gZW50cnkubmFtZSA9PT0gbmFtZSlcbiAgICAgICAgaWYgKGxpbnRlcikge1xuICAgICAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlcy5kZWxldGVCeUxpbnRlcihsaW50ZXIpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0b2dnbGVWaWV3LnNob3coKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0b2dnbGVWaWV3KVxuICAgIH0pXG4gICAgdGhpcy5yZWdpc3RyeUluZGllLm9ic2VydmUoKGluZGllTGludGVyKSA9PiB7XG4gICAgICBpbmRpZUxpbnRlci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMuZGVsZXRlQnlMaW50ZXIoaW5kaWVMaW50ZXIpXG4gICAgICB9KVxuICAgIH0pXG4gICAgdGhpcy5yZWdpc3RyeUVkaXRvcnMub2JzZXJ2ZSgoZWRpdG9yTGludGVyKSA9PiB7XG4gICAgICBlZGl0b3JMaW50ZXIub25TaG91bGRMaW50KChvbkNoYW5nZSkgPT4ge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5TGludGVycy5saW50KHsgb25DaGFuZ2UsIGVkaXRvcjogZWRpdG9yTGludGVyLmdldEVkaXRvcigpIH0pXG4gICAgICB9KVxuICAgICAgZWRpdG9yTGludGVyLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlcy5kZWxldGVCeUJ1ZmZlcihlZGl0b3JMaW50ZXIuZ2V0RWRpdG9yKCkuZ2V0QnVmZmVyKCkpXG4gICAgICB9KVxuICAgIH0pXG4gICAgdGhpcy5yZWdpc3RyeUluZGllLm9uRGlkVXBkYXRlKCh7IGxpbnRlciwgbWVzc2FnZXMgfSkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLnNldCh7IGxpbnRlciwgbWVzc2FnZXMsIGJ1ZmZlcjogbnVsbCB9KVxuICAgIH0pXG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMub25EaWRVcGRhdGVNZXNzYWdlcygoeyBsaW50ZXIsIG1lc3NhZ2VzLCBidWZmZXIgfSkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLnNldCh7IGxpbnRlciwgbWVzc2FnZXMsIGJ1ZmZlciB9KVxuICAgIH0pXG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMub25EaWRCZWdpbkxpbnRpbmcoKHsgbGludGVyLCBmaWxlUGF0aCB9KSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5VUkuZGlkQmVnaW5MaW50aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVycy5vbkRpZEZpbmlzaExpbnRpbmcoKHsgbGludGVyLCBmaWxlUGF0aCB9KSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5VUkuZGlkRmluaXNoTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICAgIH0pXG4gICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLm9uRGlkVXBkYXRlTWVzc2FnZXMoKGRpZmZlcmVuY2UpID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlVSS5yZW5kZXIoZGlmZmVyZW5jZSlcbiAgICB9KVxuXG4gICAgdGhpcy5yZWdpc3RyeUVkaXRvcnMuYWN0aXZhdGUoKVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBOT1RFOiBBdG9tIHRyaWdnZXJzIHRoaXMgb24gYm9vdCBzbyB3YWl0IGEgd2hpbGVcbiAgICAgIGlmICghdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2VkKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY29tbWFuZHMubGludCgpXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH0sIDEwMClcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxuXG4gIC8vIEFQSSBtZXRob2RzIGZvciBwcm92aWRpbmcvY29uc3VtaW5nIHNlcnZpY2VzXG4gIGFkZFVJKHVpOiBVSSkge1xuICAgIHRoaXMucmVnaXN0cnlVSS5hZGQodWkpXG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IHRoaXMucmVnaXN0cnlNZXNzYWdlcy5tZXNzYWdlc1xuICAgIGlmIChtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIHVpLnJlbmRlcih7IGFkZGVkOiBtZXNzYWdlcywgbWVzc2FnZXMsIHJlbW92ZWQ6IFtdIH0pXG4gICAgfVxuICB9XG4gIGRlbGV0ZVVJKHVpOiBVSSkge1xuICAgIHRoaXMucmVnaXN0cnlVSS5kZWxldGUodWkpXG4gIH1cbiAgYWRkTGludGVyKGxpbnRlcjogTGludGVyUHJvdmlkZXIsIGxlZ2FjeTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMuYWRkTGludGVyKGxpbnRlciwgbGVnYWN5KVxuICB9XG4gIGRlbGV0ZUxpbnRlcihsaW50ZXI6IExpbnRlclByb3ZpZGVyKSB7XG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMuZGVsZXRlTGludGVyKGxpbnRlcilcbiAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMuZGVsZXRlQnlMaW50ZXIobGludGVyKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGludGVyXG4iXX0=