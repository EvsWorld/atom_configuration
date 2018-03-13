(function() {
  var CodeContextBuilder, CompositeDisposable, GrammarUtils, Runner, Runtime, ScriptOptions, ScriptOptionsView, ScriptProfileRunView, ScriptView, ViewRuntimeObserver;

  CodeContextBuilder = require('./code-context-builder');

  GrammarUtils = require('./grammar-utils');

  Runner = require('./runner');

  Runtime = require('./runtime');

  ScriptOptions = require('./script-options');

  ScriptOptionsView = require('./script-options-view');

  ScriptProfileRunView = require('./script-profile-run-view');

  ScriptView = require('./script-view');

  ViewRuntimeObserver = require('./view-runtime-observer');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      enableExecTime: {
        title: 'Output the time it took to execute the script',
        type: 'boolean',
        "default": true
      },
      escapeConsoleOutput: {
        title: 'HTML escape console output',
        type: 'boolean',
        "default": true
      },
      ignoreSelection: {
        title: 'Ignore selection (file-based runs only)',
        type: 'boolean',
        "default": false
      },
      scrollWithOutput: {
        title: 'Scroll with output',
        type: 'boolean',
        "default": true
      },
      stopOnRerun: {
        title: 'Stop running process on rerun',
        type: 'boolean',
        "default": false
      }
    },
    scriptView: null,
    scriptOptionsView: null,
    scriptProfileRunView: null,
    scriptOptions: null,
    scriptProfiles: [],
    activate: function(state) {
      var codeContextBuilder, observer, profile, runner, so, _i, _len, _ref;
      this.scriptView = new ScriptView(state.scriptViewState);
      this.scriptOptions = new ScriptOptions();
      this.scriptOptionsView = new ScriptOptionsView(this.scriptOptions);
      this.scriptProfiles = [];
      if (state.profiles) {
        _ref = state.profiles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          profile = _ref[_i];
          so = ScriptOptions.createFromOptions(profile.name, profile);
          this.scriptProfiles.push(so);
        }
      }
      this.scriptProfileRunView = new ScriptProfileRunView(this.scriptProfiles);
      codeContextBuilder = new CodeContextBuilder;
      runner = new Runner(this.scriptOptions);
      observer = new ViewRuntimeObserver(this.scriptView);
      this.runtime = new Runtime(runner, codeContextBuilder, [observer]);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.closeScriptViewAndStopRunner();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.closeScriptViewAndStopRunner();
          };
        })(this),
        'script:close-view': (function(_this) {
          return function() {
            return _this.closeScriptViewAndStopRunner();
          };
        })(this),
        'script:copy-run-results': (function(_this) {
          return function() {
            return _this.scriptView.copyResults();
          };
        })(this),
        'script:kill-process': (function(_this) {
          return function() {
            return _this.runtime.stop();
          };
        })(this),
        'script:run-by-line-number': (function(_this) {
          return function() {
            return _this.runtime.execute('Line Number Based');
          };
        })(this),
        'script:run': (function(_this) {
          return function() {
            return _this.runtime.execute('Selection Based');
          };
        })(this)
      }));
      this.scriptOptionsView.onProfileSave((function(_this) {
        return function(profileData) {
          var codeContext, desc, opts;
          profile = ScriptOptions.createFromOptions(profileData.name, profileData.options);
          codeContext = _this.runtime.codeContextBuilder.buildCodeContext(atom.workspace.getActiveTextEditor(), "Selection Based");
          profile.lang = codeContext.lang;
          opts = profile.toObject();
          desc = "Language: " + codeContext.lang;
          if (opts.cmd) {
            desc += ", Command: " + opts.cmd;
          }
          if (opts.cmdArgs && opts.cmd) {
            desc += " " + (opts.cmdArgs.join(' '));
          }
          profile.description = desc;
          _this.scriptProfiles.push(profile);
          _this.scriptOptionsView.hide();
          _this.scriptProfileRunView.show();
          return _this.scriptProfileRunView.setProfiles(_this.scriptProfiles);
        };
      })(this));
      this.scriptProfileRunView.onProfileDelete((function(_this) {
        return function(profile) {
          var index;
          index = _this.scriptProfiles.indexOf(profile);
          if (index === -1) {
            return;
          }
          if (index !== -1) {
            _this.scriptProfiles.splice(index, 1);
          }
          return _this.scriptProfileRunView.setProfiles(_this.scriptProfiles);
        };
      })(this));
      this.scriptProfileRunView.onProfileChange((function(_this) {
        return function(data) {
          var index;
          index = _this.scriptProfiles.indexOf(data.profile);
          if (!(index !== -1 && (_this.scriptProfiles[index][data.key] != null))) {
            return;
          }
          _this.scriptProfiles[index][data.key] = data.value;
          _this.scriptProfileRunView.show();
          return _this.scriptProfileRunView.setProfiles(_this.scriptProfiles);
        };
      })(this));
      return this.scriptProfileRunView.onProfileRun((function(_this) {
        return function(profile) {
          if (!profile) {
            return;
          }
          return _this.runtime.execute('Selection Based', null, profile);
        };
      })(this));
    },
    deactivate: function() {
      this.runtime.destroy();
      this.scriptView.removePanel();
      this.scriptOptionsView.close();
      this.scriptProfileRunView.close();
      this.subscriptions.dispose();
      return GrammarUtils.deleteTempFiles();
    },
    closeScriptViewAndStopRunner: function() {
      this.runtime.stop();
      return this.scriptView.removePanel();
    },
    provideDefaultRuntime: function() {
      return this.runtime;
    },
    provideBlankRuntime: function() {
      var codeContextBuilder, runner;
      runner = new Runner(new ScriptOptions);
      codeContextBuilder = new CodeContextBuilder;
      return new Runtime(runner, codeContextBuilder, []);
    },
    serialize: function() {
      var profile, serializedProfiles, _i, _len, _ref;
      serializedProfiles = [];
      _ref = this.scriptProfiles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        profile = _ref[_i];
        serializedProfiles.push(profile.toObject());
      }
      return {
        scriptViewState: this.scriptView.serialize(),
        scriptOptionsViewState: this.scriptOptionsView.serialize(),
        profiles: serializedProfiles
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0pBQUE7O0FBQUEsRUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FBckIsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBRlQsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUhWLENBQUE7O0FBQUEsRUFJQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQUpoQixDQUFBOztBQUFBLEVBS0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBTHBCLENBQUE7O0FBQUEsRUFNQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsMkJBQVIsQ0FOdkIsQ0FBQTs7QUFBQSxFQU9BLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQVBiLENBQUE7O0FBQUEsRUFRQSxtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVIsQ0FSdEIsQ0FBQTs7QUFBQSxFQVVDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFWRCxDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTywrQ0FBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxJQUZUO09BREY7QUFBQSxNQUlBLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyw0QkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFB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

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/script.coffee
