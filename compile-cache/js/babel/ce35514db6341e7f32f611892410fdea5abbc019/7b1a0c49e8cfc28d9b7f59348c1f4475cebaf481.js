Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _atomSpacePenViews = require('atom-space-pen-views');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _scriptInputView = require('./script-input-view');

var _scriptInputView2 = _interopRequireDefault(_scriptInputView);

'use babel';

var ScriptOptionsView = (function (_View) {
  _inherits(ScriptOptionsView, _View);

  function ScriptOptionsView() {
    _classCallCheck(this, ScriptOptionsView);

    _get(Object.getPrototypeOf(ScriptOptionsView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ScriptOptionsView, [{
    key: 'initialize',
    value: function initialize(runOptions) {
      var _this = this;

      this.runOptions = runOptions;
      this.emitter = new _atom.Emitter();

      this.subscriptions = new _atom.CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': function coreCancel() {
          return _this.hide();
        },
        'core:close': function coreClose() {
          return _this.hide();
        },
        'script:close-options': function scriptCloseOptions() {
          return _this.hide();
        },
        'script:run-options': function scriptRunOptions() {
          return _this.panel.isVisible() ? _this.hide() : _this.show();
        },
        'script:save-options': function scriptSaveOptions() {
          return _this.saveOptions();
        }
      }));

      // handling focus traversal and run on enter
      this.find('atom-text-editor').on('keydown', function (e) {
        if (e.keyCode !== 9 && e.keyCode !== 13) return true;

        switch (e.keyCode) {
          case 9:
            {
              e.preventDefault();
              e.stopPropagation();
              var row = _this.find(e.target).parents('tr:first').nextAll('tr:first');
              if (row.length) {
                return row.find('atom-text-editor').focus();
              }
              return _this.buttonCancel.focus();
            }
          case 13:
            return _this.run();
        }
        return null;
      });

      this.panel = atom.workspace.addModalPanel({ item: this });
      this.panel.hide();
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      return {
        workingDirectory: this.inputCwd.get(0).getModel().getText(),
        cmd: this.inputCommand.get(0).getModel().getText(),
        cmdArgs: this.constructor.splitArgs(this.inputCommandArgs.get(0).getModel().getText()),
        env: this.inputEnv.get(0).getModel().getText(),
        scriptArgs: this.constructor.splitArgs(this.inputScriptArgs.get(0).getModel().getText())
      };
    }
  }, {
    key: 'saveOptions',
    value: function saveOptions() {
      var options = this.getOptions();
      for (var option in options) {
        var value = options[option];
        this.runOptions[option] = value;
      }
    }
  }, {
    key: 'onProfileSave',
    value: function onProfileSave(callback) {
      return this.emitter.on('on-profile-save', callback);
    }

    // Saves specified options as new profile
  }, {
    key: 'saveProfile',
    value: function saveProfile() {
      var _this2 = this;

      this.hide();

      var options = this.getOptions();

      var inputView = new _scriptInputView2['default']({ caption: 'Enter profile name:' });
      inputView.onCancel(function () {
        return _this2.show();
      });
      inputView.onConfirm(function (profileName) {
        if (!profileName) return;
        _underscore2['default'].forEach(_this2.find('atom-text-editor'), function (editor) {
          editor.getModel().setText('');
        });

        // clean up the options
        _this2.saveOptions();

        // add to global profiles list
        _this2.emitter.emit('on-profile-save', { name: profileName, options: options });
      });

      inputView.show();
    }
  }, {
    key: 'close',
    value: function close() {
      this.hide();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.subscriptions) this.subscriptions.dispose();
    }
  }, {
    key: 'show',
    value: function show() {
      this.panel.show();
      this.inputCwd.focus();
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.panel.hide();
      atom.workspace.getActivePane().activate();
    }
  }, {
    key: 'run',
    value: function run() {
      this.saveOptions();
      this.hide();
      atom.commands.dispatch(this.getWorkspaceView(), 'script:run');
    }
  }, {
    key: 'getWorkspaceView',
    value: function getWorkspaceView() {
      return atom.views.getView(atom.workspace);
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this3 = this;

      this.div({ 'class': 'options-view' }, function () {
        _this3.h4({ 'class': 'modal-header' }, 'Configure Run Options');
        _this3.div({ 'class': 'modal-body' }, function () {
          _this3.table(function () {
            _this3.tr(function () {
              _this3.td({ 'class': 'first' }, function () {
                return _this3.label('Current Working Directory:');
              });
              _this3.td({ 'class': 'second' }, function () {
                return _this3.tag('atom-text-editor', { mini: '', 'class': 'editor mini', outlet: 'inputCwd' });
              });
            });
            _this3.tr(function () {
              _this3.td(function () {
                return _this3.label('Command');
              });
              _this3.td(function () {
                return _this3.tag('atom-text-editor', { mini: '', 'class': 'editor mini', outlet: 'inputCommand' });
              });
            });
            _this3.tr(function () {
              _this3.td(function () {
                return _this3.label('Command Arguments:');
              });
              _this3.td(function () {
                return _this3.tag('atom-text-editor', { mini: '', 'class': 'editor mini', outlet: 'inputCommandArgs' });
              });
            });
            _this3.tr(function () {
              _this3.td(function () {
                return _this3.label('Program Arguments:');
              });
              _this3.td(function () {
                return _this3.tag('atom-text-editor', { mini: '', 'class': 'editor mini', outlet: 'inputScriptArgs' });
              });
            });
            _this3.tr(function () {
              _this3.td(function () {
                return _this3.label('Environment Variables:');
              });
              _this3.td(function () {
                return _this3.tag('atom-text-editor', { mini: '', 'class': 'editor mini', outlet: 'inputEnv' });
              });
            });
          });
        });
        _this3.div({ 'class': 'modal-footer' }, function () {
          var css = 'btn inline-block-tight';
          _this3.button({ 'class': 'btn ' + css + ' cancel', outlet: 'buttonCancel', click: 'close' }, function () {
            return _this3.span({ 'class': 'icon icon-x' }, 'Cancel');
          });
          _this3.span({ 'class': 'pull-right' }, function () {
            _this3.button({ 'class': 'btn ' + css + ' save-profile', outlet: 'buttonSaveProfile', click: 'saveProfile' }, function () {
              return _this3.span({ 'class': 'icon icon-file-text' }, 'Save as profile');
            });
            _this3.button({ 'class': 'btn ' + css + ' run', outlet: 'buttonRun', click: 'run' }, function () {
              return _this3.span({ 'class': 'icon icon-playback-play' }, 'Run');
            });
          });
        });
      });
    }
  }, {
    key: 'splitArgs',
    value: function splitArgs(argText) {
      var text = argText.trim();
      var argSubstringRegex = /([^'"\s]+)|((["'])(.*?)\3)/g;
      var args = [];
      var lastMatchEndPosition = -1;
      var match = argSubstringRegex.exec(text);
      while (match !== null) {
        var matchWithoutQuotes = match[1] || match[4];
        // Combine current result with last match, if last match ended where this
        // one begins.
        if (lastMatchEndPosition === match.index) {
          args[args.length - 1] += matchWithoutQuotes;
        } else {
          args.push(matchWithoutQuotes);
        }

        lastMatchEndPosition = argSubstringRegex.lastIndex;
        match = argSubstringRegex.exec(text);
      }
      return args;
    }
  }]);

  return ScriptOptionsView;
})(_atomSpacePenViews.View);

exports['default'] = ScriptOptionsView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9zY3JpcHQtb3B0aW9ucy12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUU2QyxNQUFNOztpQ0FDOUIsc0JBQXNCOzswQkFDN0IsWUFBWTs7OzsrQkFDRSxxQkFBcUI7Ozs7QUFMakQsV0FBVyxDQUFDOztJQU9TLGlCQUFpQjtZQUFqQixpQkFBaUI7O1dBQWpCLGlCQUFpQjswQkFBakIsaUJBQWlCOzsrQkFBakIsaUJBQWlCOzs7ZUFBakIsaUJBQWlCOztXQThDMUIsb0JBQUMsVUFBVSxFQUFFOzs7QUFDckIsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDN0IsVUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFDOztBQUU3QixVQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDO0FBQy9DLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3pELHFCQUFhLEVBQUU7aUJBQU0sTUFBSyxJQUFJLEVBQUU7U0FBQTtBQUNoQyxvQkFBWSxFQUFFO2lCQUFNLE1BQUssSUFBSSxFQUFFO1NBQUE7QUFDL0IsOEJBQXNCLEVBQUU7aUJBQU0sTUFBSyxJQUFJLEVBQUU7U0FBQTtBQUN6Qyw0QkFBb0IsRUFBRTtpQkFBTyxNQUFLLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRyxNQUFLLElBQUksRUFBRSxHQUFHLE1BQUssSUFBSSxFQUFFO1NBQUM7QUFDaEYsNkJBQXFCLEVBQUU7aUJBQU0sTUFBSyxXQUFXLEVBQUU7U0FBQTtPQUNoRCxDQUFDLENBQUMsQ0FBQzs7O0FBR0osVUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDakQsWUFBSSxDQUFDLENBQUMsT0FB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SSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDL0I7O0FBRUQsNEJBQW9CLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDO0FBQ25ELGFBQUssR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEM7QUFDRCxhQUFPLElBQUksQ0FBQztLQUNiOzs7U0F0R2tCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC1vcHRpb25zLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IFNjcmlwdElucHV0VmlldyBmcm9tICcuL3NjcmlwdC1pbnB1dC12aWV3JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyaXB0T3B0aW9uc1ZpZXcgZXh0ZW5kcyBWaWV3IHtcblxuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICB0aGlzLmRpdih7IGNsYXNzOiAnb3B0aW9ucy12aWV3JyB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmg0KHsgY2xhc3M6ICdtb2RhbC1oZWFkZXInIH0sICdDb25maWd1cmUgUnVuIE9wdGlvbnMnKTtcbiAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdtb2RhbC1ib2R5JyB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMudGFibGUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudHIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50ZCh7IGNsYXNzOiAnZmlyc3QnIH0sICgpID0+IHRoaXMubGFiZWwoJ0N1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnk6JykpO1xuICAgICAgICAgICAgdGhpcy50ZCh7IGNsYXNzOiAnc2Vjb25kJyB9LCAoKSA9PiB0aGlzLnRhZygnYXRvbS10ZXh0LWVkaXRvcicsIHsgbWluaTogJycsIGNsYXNzOiAnZWRpdG9yIG1pbmknLCBvdXRsZXQ6ICdpbnB1dEN3ZCcgfSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMudHIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50ZCgoKSA9PiB0aGlzLmxhYmVsKCdDb21tYW5kJykpO1xuICAgICAgICAgICAgdGhpcy50ZCgoKSA9PiB0aGlzLnRhZygnYXRvbS10ZXh0LWVkaXRvcicsIHsgbWluaTogJycsIGNsYXNzOiAnZWRpdG9yIG1pbmknLCBvdXRsZXQ6ICdpbnB1dENvbW1hbmQnIH0pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnRyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGQoKCkgPT4gdGhpcy5sYWJlbCgnQ29tbWFuZCBBcmd1bWVudHM6JykpO1xuICAgICAgICAgICAgdGhpcy50ZCgoKSA9PiB0aGlzLnRhZygnYXRvbS10ZXh0LWVkaXRvcicsIHsgbWluaTogJycsIGNsYXNzOiAnZWRpdG9yIG1pbmknLCBvdXRsZXQ6ICdpbnB1dENvbW1hbmRBcmdzJyB9KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy50cigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRkKCgpID0+IHRoaXMubGFiZWwoJ1Byb2dyYW0gQXJndW1lbnRzOicpKTtcbiAgICAgICAgICAgIHRoaXMudGQoKCkgPT4gdGhpcy50YWcoJ2F0b20tdGV4dC1lZGl0b3InLCB7IG1pbmk6ICcnLCBjbGFzczogJ2VkaXRvciBtaW5pJywgb3V0bGV0OiAnaW5wdXRTY3JpcHRBcmdzJyB9KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy50cigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRkKCgpID0+IHRoaXMubGFiZWwoJ0Vudmlyb25tZW50IFZhcmlhYmxlczonKSk7XG4gICAgICAgICAgICB0aGlzLnRkKCgpID0+IHRoaXMudGFnKCdhdG9tLXRleHQtZWRpdG9yJywgeyBtaW5pOiAnJywgY2xhc3M6ICdlZGl0b3IgbWluaScsIG91dGxldDogJ2lucHV0RW52JyB9KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmRpdih7IGNsYXNzOiAnbW9kYWwtZm9vdGVyJyB9LCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNzcyA9ICdidG4gaW5saW5lLWJsb2NrLXRpZ2h0JztcbiAgICAgICAgdGhpcy5idXR0b24oeyBjbGFzczogYGJ0biAke2Nzc30gY2FuY2VsYCwgb3V0bGV0OiAnYnV0dG9uQ2FuY2VsJywgY2xpY2s6ICdjbG9zZScgfSwgKCkgPT5cbiAgICAgICAgICB0aGlzLnNwYW4oeyBjbGFzczogJ2ljb24gaWNvbi14JyB9LCAnQ2FuY2VsJyksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3Bhbih7IGNsYXNzOiAncHVsbC1yaWdodCcgfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYnV0dG9uKHsgY2xhc3M6IGBidG4gJHtjc3N9IHNhdmUtcHJvZmlsZWAsIG91dGxldDogJ2J1dHRvblNhdmVQcm9maWxlJywgY2xpY2s6ICdzYXZlUHJvZmlsZScgfSwgKCkgPT5cbiAgICAgICAgICAgIHRoaXMuc3Bhbih7IGNsYXNzOiAnaWNvbiBpY29uLWZpbGUtdGV4dCcgfSwgJ1NhdmUgYXMgcHJvZmlsZScpLFxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5idXR0b24oeyBjbGFzczogYGJ0biAke2Nzc30gcnVuYCwgb3V0bGV0OiAnYnV0dG9uUnVuJywgY2xpY2s6ICdydW4nIH0sICgpID0+XG4gICAgICAgICAgICB0aGlzLnNwYW4oeyBjbGFzczogJ2ljb24gaWNvbi1wbGF5YmFjay1wbGF5JyB9LCAnUnVuJyksXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemUocnVuT3B0aW9ucykge1xuICAgIHRoaXMucnVuT3B0aW9ucyA9IHJ1bk9wdGlvbnM7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnY29yZTpjYW5jZWwnOiAoKSA9PiB0aGlzLmhpZGUoKSxcbiAgICAgICdjb3JlOmNsb3NlJzogKCkgPT4gdGhpcy5oaWRlKCksXG4gICAgICAnc2NyaXB0OmNsb3NlLW9wdGlvbnMnOiAoKSA9PiB0aGlzLmhpZGUoKSxcbiAgICAgICdzY3JpcHQ6cnVuLW9wdGlvbnMnOiAoKSA9PiAodGhpcy5wYW5lbC5pc1Zpc2libGUoKSA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KCkpLFxuICAgICAgJ3NjcmlwdDpzYXZlLW9wdGlvbnMnOiAoKSA9PiB0aGlzLnNhdmVPcHRpb25zKCksXG4gICAgfSkpO1xuXG4gICAgLy8gaGFuZGxpbmcgZm9jdXMgdHJhdmVyc2FsIGFuZCBydW4gb24gZW50ZXJcbiAgICB0aGlzLmZpbmQoJ2F0b20tdGV4dC1lZGl0b3InKS5vbigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXlDb2RlICE9PSA5ICYmIGUua2V5Q29kZSAhPT0gMTMpIHJldHVybiB0cnVlO1xuXG4gICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICBjYXNlIDk6IHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBjb25zdCByb3cgPSB0aGlzLmZpbmQoZS50YXJnZXQpLnBhcmVudHMoJ3RyOmZpcnN0JykubmV4dEFsbCgndHI6Zmlyc3QnKTtcbiAgICAgICAgICBpZiAocm93Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHJvdy5maW5kKCdhdG9tLXRleHQtZWRpdG9yJykuZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYnV0dG9uQ2FuY2VsLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAxMzogcmV0dXJuIHRoaXMucnVuKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcblxuICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHsgaXRlbTogdGhpcyB9KTtcbiAgICB0aGlzLnBhbmVsLmhpZGUoKTtcbiAgfVxuXG4gIHN0YXRpYyBzcGxpdEFyZ3MoYXJnVGV4dCkge1xuICAgIGNvbnN0IHRleHQgPSBhcmdUZXh0LnRyaW0oKTtcbiAgICBjb25zdCBhcmdTdWJzdHJpbmdSZWdleCA9IC8oW14nXCJcXHNdKyl8KChbXCInXSkoLio/KVxcMykvZztcbiAgICBjb25zdCBhcmdzID0gW107XG4gICAgbGV0IGxhc3RNYXRjaEVuZFBvc2l0aW9uID0gLTE7XG4gICAgbGV0IG1hdGNoID0gYXJnU3Vic3RyaW5nUmVnZXguZXhlYyh0ZXh0KTtcbiAgICB3aGlsZSAobWF0Y2ggIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IG1hdGNoV2l0aG91dFF1b3RlcyA9IG1hdGNoWzFdIHx8IG1hdGNoWzRdO1xuICAgICAgLy8gQ29tYmluZSBjdXJyZW50IHJlc3VsdCB3aXRoIGxhc3QgbWF0Y2gsIGlmIGxhc3QgbWF0Y2ggZW5kZWQgd2hlcmUgdGhpc1xuICAgICAgLy8gb25lIGJlZ2lucy5cbiAgICAgIGlmIChsYXN0TWF0Y2hFbmRQb3NpdGlvbiA9PT0gbWF0Y2guaW5kZXgpIHtcbiAgICAgICAgYXJnc1thcmdzLmxlbmd0aCAtIDFdICs9IG1hdGNoV2l0aG91dFF1b3RlcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyZ3MucHVzaChtYXRjaFdpdGhvdXRRdW90ZXMpO1xuICAgICAgfVxuXG4gICAgICBsYXN0TWF0Y2hFbmRQb3NpdGlvbiA9IGFyZ1N1YnN0cmluZ1JlZ2V4Lmxhc3RJbmRleDtcbiAgICAgIG1hdGNoID0gYXJnU3Vic3RyaW5nUmVnZXguZXhlYyh0ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIGFyZ3M7XG4gIH1cblxuICBnZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JraW5nRGlyZWN0b3J5OiB0aGlzLmlucHV0Q3dkLmdldCgwKS5nZXRNb2RlbCgpLmdldFRleHQoKSxcbiAgICAgIGNtZDogdGhpcy5pbnB1dENvbW1hbmQuZ2V0KDApLmdldE1vZGVsKCkuZ2V0VGV4dCgpLFxuICAgICAgY21kQXJnczogdGhpcy5jb25zdHJ1Y3Rvci5zcGxpdEFyZ3MoXG4gICAgICAgIHRoaXMuaW5wdXRDb21tYW5kQXJncy5nZXQoMCkuZ2V0TW9kZWwoKS5nZXRUZXh0KCksXG4gICAgICApLFxuICAgICAgZW52OiB0aGlzLmlucHV0RW52LmdldCgwKS5nZXRNb2RlbCgpLmdldFRleHQoKSxcbiAgICAgIHNjcmlwdEFyZ3M6IHRoaXMuY29uc3RydWN0b3Iuc3BsaXRBcmdzKFxuICAgICAgICB0aGlzLmlucHV0U2NyaXB0QXJncy5nZXQoMCkuZ2V0TW9kZWwoKS5nZXRUZXh0KCksXG4gICAgICApLFxuICAgIH07XG4gIH1cblxuICBzYXZlT3B0aW9ucygpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG4gICAgZm9yIChjb25zdCBvcHRpb24gaW4gb3B0aW9ucykge1xuICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zW29wdGlvbl07XG4gICAgICB0aGlzLnJ1bk9wdGlvbnNbb3B0aW9uXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIG9uUHJvZmlsZVNhdmUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdvbi1wcm9maWxlLXNhdmUnLCBjYWxsYmFjayk7XG4gIH1cblxuICAvLyBTYXZlcyBzcGVjaWZpZWQgb3B0aW9ucyBhcyBuZXcgcHJvZmlsZVxuICBzYXZlUHJvZmlsZSgpIHtcbiAgICB0aGlzLmhpZGUoKTtcblxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcblxuICAgIGNvbnN0IGlucHV0VmlldyA9IG5ldyBTY3JpcHRJbnB1dFZpZXcoeyBjYXB0aW9uOiAnRW50ZXIgcHJvZmlsZSBuYW1lOicgfSk7XG4gICAgaW5wdXRWaWV3Lm9uQ2FuY2VsKCgpID0+IHRoaXMuc2hvdygpKTtcbiAgICBpbnB1dFZpZXcub25Db25maXJtKChwcm9maWxlTmFtZSkgPT4ge1xuICAgICAgaWYgKCFwcm9maWxlTmFtZSkgcmV0dXJuO1xuICAgICAgXy5mb3JFYWNoKHRoaXMuZmluZCgnYXRvbS10ZXh0LWVkaXRvcicpLCAoZWRpdG9yKSA9PiB7XG4gICAgICAgIGVkaXRvci5nZXRNb2RlbCgpLnNldFRleHQoJycpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGNsZWFuIHVwIHRoZSBvcHRpb25zXG4gICAgICB0aGlzLnNhdmVPcHRpb25zKCk7XG5cbiAgICAgIC8vIGFkZCB0byBnbG9iYWwgcHJvZmlsZXMgbGlzdFxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ29uLXByb2ZpbGUtc2F2ZScsIHsgbmFtZTogcHJvZmlsZU5hbWUsIG9wdGlvbnMgfSk7XG4gICAgfSk7XG5cbiAgICBpbnB1dFZpZXcuc2hvdygpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cblxuICBzaG93KCkge1xuICAgIHRoaXMucGFuZWwuc2hvdygpO1xuICAgIHRoaXMuaW5wdXRDd2QuZm9jdXMoKTtcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5wYW5lbC5oaWRlKCk7XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmFjdGl2YXRlKCk7XG4gIH1cblxuICBydW4oKSB7XG4gICAgdGhpcy5zYXZlT3B0aW9ucygpO1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGhpcy5nZXRXb3Jrc3BhY2VWaWV3KCksICdzY3JpcHQ6cnVuJyk7XG4gIH1cblxuICBnZXRXb3Jrc3BhY2VWaWV3KCkge1xuICAgIHJldHVybiBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICB9XG59XG4iXX0=