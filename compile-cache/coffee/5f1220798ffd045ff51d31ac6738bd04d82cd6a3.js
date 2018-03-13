(function() {
  var CompositeDisposable, Emitter, ScriptInputView, ScriptOptionsView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  View = require('atom-space-pen-views').View;

  ScriptInputView = require('./script-input-view');

  module.exports = ScriptOptionsView = (function(_super) {
    __extends(ScriptOptionsView, _super);

    function ScriptOptionsView() {
      return ScriptOptionsView.__super__.constructor.apply(this, arguments);
    }

    ScriptOptionsView.content = function() {
      return this.div({
        "class": 'options-view'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, 'Configure Run Options');
          _this.table(function() {
            _this.tr(function() {
              _this.td({
                "class": 'first'
              }, function() {
                return _this.label('Current Working Directory:');
              });
              return _this.td({
                "class": 'second'
              }, function() {
                return _this.tag('atom-text-editor', {
                  mini: '',
                  "class": 'editor mini',
                  outlet: 'inputCwd'
                });
              });
            });
            _this.tr(function() {
              _this.td(function() {
                return _this.label('Command');
              });
              return _this.td(function() {
                return _this.tag('atom-text-editor', {
                  mini: '',
                  "class": 'editor mini',
                  outlet: 'inputCommand'
                });
              });
            });
            _this.tr(function() {
              _this.td(function() {
                return _this.label('Command Arguments:');
              });
              return _this.td(function() {
                return _this.tag('atom-text-editor', {
                  mini: '',
                  "class": 'editor mini',
                  outlet: 'inputCommandArgs'
                });
              });
            });
            _this.tr(function() {
              _this.td(function() {
                return _this.label('Program Arguments:');
              });
              return _this.td(function() {
                return _this.tag('atom-text-editor', {
                  mini: '',
                  "class": 'editor mini',
                  outlet: 'inputScriptArgs'
                });
              });
            });
            return _this.tr(function() {
              _this.td(function() {
                return _this.label('Environment Variables:');
              });
              return _this.td(function() {
                return _this.tag('atom-text-editor', {
                  mini: '',
                  "class": 'editor mini',
                  outlet: 'inputEnv'
                });
              });
            });
          });
          return _this.div({
            "class": 'block buttons'
          }, function() {
            var css;
            css = 'btn inline-block-tight';
            _this.button({
              "class": "btn " + css + " cancel",
              outlet: 'buttonCancel',
              click: 'close'
            }, function() {
              return _this.span({
                "class": 'icon icon-x'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'right-buttons'
            }, function() {
              _this.button({
                "class": "btn " + css + " save-profile",
                outlet: 'buttonSaveProfile',
                click: 'saveProfile'
              }, function() {
                return _this.span({
                  "class": 'icon icon-file-text'
                }, 'Save as profile');
              });
              return _this.button({
                "class": "btn " + css + " run",
                outlet: 'buttonRun',
                click: 'run'
              }, function() {
                return _this.span({
                  "class": 'icon icon-playback-play'
                }, 'Run');
              });
            });
          });
        };
      })(this));
    };

    ScriptOptionsView.prototype.initialize = function(runOptions) {
      this.runOptions = runOptions;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this),
        'script:close-options': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this),
        'script:run-options': (function(_this) {
          return function() {
            if (_this.panel.isVisible()) {
              return _this.hide();
            } else {
              return _this.show();
            }
          };
        })(this),
        'script:save-options': (function(_this) {
          return function() {
            return _this.saveOptions();
          };
        })(this)
      }));
      this.find('atom-text-editor').on('keydown', (function(_this) {
        return function(e) {
          var row;
          if (!(e.keyCode === 9 || e.keyCode === 13)) {
            return true;
          }
          switch (e.keyCode) {
            case 9:
              e.preventDefault();
              e.stopPropagation();
              row = _this.find(e.target).parents('tr:first').nextAll('tr:first');
              if (row.length) {
                return row.find('atom-text-editor').focus();
              } else {
                return _this.buttonCancel.focus();
              }
              break;
            case 13:
              return _this.run();
          }
        };
      })(this));
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      return this.panel.hide();
    };

    ScriptOptionsView.prototype.splitArgs = function(element) {
      var args, argument, item, match, matches, part, regex, regexps, replacer, replaces, split, _i, _j, _k, _len, _len1, _len2, _results;
      args = element.get(0).getModel().getText().trim();
      if (args.indexOf('"') === -1 && args.indexOf("'") === -1) {
        return (function() {
          var _i, _len, _ref1, _results;
          _ref1 = args.split(' ');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            if (item !== '') {
              _results.push(item);
            }
          }
          return _results;
        })();
      }
      replaces = {};
      regexps = [/"[^"]*"/ig, /'[^']*'/ig];
      for (_i = 0, _len = regexps.length; _i < _len; _i++) {
        regex = regexps[_i];
        matches = (matches != null ? matches : []).concat((args.match(regex)) || []);
      }
      for (_j = 0, _len1 = matches.length; _j < _len1; _j++) {
        match = matches[_j];
        replaces['`#match' + (Object.keys(replaces).length + 1) + '`'] = match;
      }
      args = (function() {
        var _results;
        _results = [];
        for (match in replaces) {
          part = replaces[match];
          _results.push(args.replace(new RegExp(part, 'g'), match));
        }
        return _results;
      })();
      split = (function() {
        var _k, _len2, _ref1, _results;
        _ref1 = args.split(' ');
        _results = [];
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          item = _ref1[_k];
          if (item !== '') {
            _results.push(item);
          }
        }
        return _results;
      })();
      replacer = function(argument) {
        var replacement;
        argument = (function() {
          var _results;
          _results = [];
          for (match in replaces) {
            replacement = replaces[match];
            _results.push(argument.replace(match, replacement));
          }
          return _results;
        })();
        return argument;
      };
      _results = [];
      for (_k = 0, _len2 = split.length; _k < _len2; _k++) {
        argument = split[_k];
        _results.push(replacer(argument).replace(/"|'/g, ''));
      }
      return _results;
    };

    ScriptOptionsView.prototype.getOptions = function() {
      return {
        workingDirectory: this.inputCwd.get(0).getModel().getText(),
        cmd: this.inputCommand.get(0).getModel().getText(),
        cmdArgs: this.splitArgs(this.inputCommandArgs),
        env: this.inputEnv.get(0).getModel().getText(),
        scriptArgs: this.splitArgs(this.inputScriptArgs)
      };
    };

    ScriptOptionsView.prototype.saveOptions = function() {
      var key, value, _ref1, _results;
      _ref1 = this.getOptions();
      _results = [];
      for (key in _ref1) {
        value = _ref1[key];
        _results.push(this.runOptions[key] = value);
      }
      return _results;
    };

    ScriptOptionsView.prototype.onProfileSave = function(callback) {
      return this.emitter.on('on-profile-save', callback);
    };

    ScriptOptionsView.prototype.saveProfile = function() {
      var inputView, options;
      this.hide();
      options = this.getOptions();
      inputView = new ScriptInputView({
        caption: 'Enter profile name:'
      });
      inputView.onCancel((function(_this) {
        return function() {
          return _this.show();
        };
      })(this));
      inputView.onConfirm((function(_this) {
        return function(profileName) {
          var editor, _i, _len, _ref1;
          if (!profileName) {
            return;
          }
          _ref1 = _this.find('atom-text-editor');
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            editor = _ref1[_i];
            editor.getModel().setText('');
          }
          _this.saveOptions();
          return _this.emitter.emit('on-profile-save', {
            name: profileName,
            options: options
          });
        };
      })(this));
      return inputView.show();
    };

    ScriptOptionsView.prototype.close = function() {
      return this.hide();
    };

    ScriptOptionsView.prototype.destroy = function() {
      var _ref1;
      return (_ref1 = this.subscriptions) != null ? _ref1.dispose() : void 0;
    };

    ScriptOptionsView.prototype.show = function() {
      this.panel.show();
      return this.inputCwd.focus();
    };

    ScriptOptionsView.prototype.hide = function() {
      this.panel.hide();
      return atom.workspace.getActivePane().activate();
    };

    ScriptOptionsView.prototype.run = function() {
      this.saveOptions();
      this.hide();
      return atom.commands.dispatch(this.workspaceView(), 'script:run');
    };

    ScriptOptionsView.prototype.workspaceView = function() {
      return atom.views.getView(atom.workspace);
    };

    return ScriptOptionsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC1vcHRpb25zLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGVBQUEsT0FBdEIsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FGbEIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSix3Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxpQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sY0FBUDtPQUFMLEVBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDMUIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sZUFBUDtXQUFMLEVBQTZCLHVCQUE3QixDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQSxHQUFBO0FBQ0wsWUFBQSxLQUFDLENBQUEsRUFBRCxDQUFJLFNBQUEsR0FBQTtBQUNGLGNBQUEsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLGdCQUFBLE9BQUEsRUFBTyxPQUFQO2VBQUosRUFBb0IsU0FBQSxHQUFBO3VCQUFHLEtBQUMsQ0FBQSxLQUFELENBQU8sNEJBQVAsRUFBSDtjQUFBLENBQXBCLENBQUEsQ0FBQTtxQkFDQSxLQUFDLENBQUEsRUFBRCxD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

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/script-options-view.coffee
