Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _codeContextBuilder = require('./code-context-builder');

var _codeContextBuilder2 = _interopRequireDefault(_codeContextBuilder);

var _grammarUtils = require('./grammar-utils');

var _grammarUtils2 = _interopRequireDefault(_grammarUtils);

var _runner = require('./runner');

var _runner2 = _interopRequireDefault(_runner);

var _runtime = require('./runtime');

var _runtime2 = _interopRequireDefault(_runtime);

var _scriptOptions = require('./script-options');

var _scriptOptions2 = _interopRequireDefault(_scriptOptions);

var _scriptOptionsView = require('./script-options-view');

var _scriptOptionsView2 = _interopRequireDefault(_scriptOptionsView);

var _scriptProfileRunView = require('./script-profile-run-view');

var _scriptProfileRunView2 = _interopRequireDefault(_scriptProfileRunView);

var _scriptView = require('./script-view');

var _scriptView2 = _interopRequireDefault(_scriptView);

var _viewRuntimeObserver = require('./view-runtime-observer');

var _viewRuntimeObserver2 = _interopRequireDefault(_viewRuntimeObserver);

'use babel';

exports['default'] = {
  config: {
    enableExecTime: {
      title: 'Output the time it took to execute the script',
      type: 'boolean',
      'default': true
    },
    escapeConsoleOutput: {
      title: 'HTML escape console output',
      type: 'boolean',
      'default': true
    },
    ignoreSelection: {
      title: 'Ignore selection (file-based runs only)',
      type: 'boolean',
      'default': false
    },
    scrollWithOutput: {
      title: 'Scroll with output',
      type: 'boolean',
      'default': true
    },
    stopOnRerun: {
      title: 'Stop running process on rerun',
      type: 'boolean',
      'default': false
    },
    cwdBehavior: {
      title: 'Default CWD Behavior',
      description: 'If no Run Options are set, this setting decides how to determine the CWD',
      type: 'string',
      'default': 'First project directory',
      'enum': ['First project directory', 'Project directory of the script', 'Directory of the script']
    }
  },
  // For some reason, the text of these options does not show in package settings view
  // default: 'firstProj'
  // enum: [
  //   {value: 'firstProj', description: 'First project directory (if there is one)'}
  //   {value: 'scriptProj', description: 'Project directory of the script (if there is one)'}
  //   {value: 'scriptDir', description: 'Directory of the script'}
  // ]
  scriptView: null,
  scriptOptionsView: null,
  scriptProfileRunView: null,
  scriptOptions: null,
  scriptProfiles: [],

  activate: function activate(state) {
    var _this = this;

    this.scriptView = new _scriptView2['default'](state.scriptViewState);
    this.scriptOptions = new _scriptOptions2['default']();
    this.scriptOptionsView = new _scriptOptionsView2['default'](this.scriptOptions);

    // profiles loading
    this.scriptProfiles = [];
    if (state.profiles) {
      for (var profile of state.profiles) {
        var so = _scriptOptions2['default'].createFromOptions(profile.name, profile);
        this.scriptProfiles.push(so);
      }
    }

    this.scriptProfileRunView = new _scriptProfileRunView2['default'](this.scriptProfiles);

    var codeContextBuilder = new _codeContextBuilder2['default']();
    var runner = new _runner2['default'](this.scriptOptions);

    var observer = new _viewRuntimeObserver2['default'](this.scriptView);

    this.runtime = new _runtime2['default'](runner, codeContextBuilder, [observer]);

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'core:cancel': function coreCancel() {
        return _this.closeScriptViewAndStopRunner();
      },
      'core:close': function coreClose() {
        return _this.closeScriptViewAndStopRunner();
      },
      'script:close-view': function scriptCloseView() {
        return _this.closeScriptViewAndStopRunner();
      },
      'script:copy-run-results': function scriptCopyRunResults() {
        return _this.scriptView.copyResults();
      },
      'script:kill-process': function scriptKillProcess() {
        return _this.runtime.stop();
      },
      'script:run-by-line-number': function scriptRunByLineNumber() {
        return _this.runtime.execute('Line Number Based');
      },
      'script:run': function scriptRun() {
        return _this.runtime.execute('Selection Based');
      }
    }));

    // profile created
    this.scriptOptionsView.onProfileSave(function (profileData) {
      // create and fill out profile
      var profile = _scriptOptions2['default'].createFromOptions(profileData.name, profileData.options);

      var codeContext = _this.runtime.codeContextBuilder.buildCodeContext(atom.workspace.getActiveTextEditor(), 'Selection Based');
      profile.lang = codeContext.lang;

      // formatting description
      var opts = profile.toObject();
      var desc = 'Language: ' + codeContext.lang;
      if (opts.cmd) {
        desc += ', Command: ' + opts.cmd;
      }
      if (opts.cmdArgs && opts.cmd) {
        desc += ' ' + opts.cmdArgs.join(' ');
      }

      profile.description = desc;
      _this.scriptProfiles.push(profile);

      _this.scriptOptionsView.hide();
      _this.scriptProfileRunView.show();
      _this.scriptProfileRunView.setProfiles(_this.scriptProfiles);
    });

    // profile deleted
    this.scriptProfileRunView.onProfileDelete(function (profile) {
      var index = _this.scriptProfiles.indexOf(profile);
      if (index === -1) {
        return;
      }

      if (index !== -1) {
        _this.scriptProfiles.splice(index, 1);
      }
      _this.scriptProfileRunView.setProfiles(_this.scriptProfiles);
    });

    // profile renamed
    this.scriptProfileRunView.onProfileChange(function (data) {
      var index = _this.scriptProfiles.indexOf(data.profile);
      if (index === -1 || !_this.scriptProfiles[index][data.key]) {
        return;
      }

      _this.scriptProfiles[index][data.key] = data.value;
      _this.scriptProfileRunView.show();
      _this.scriptProfileRunView.setProfiles(_this.scriptProfiles);
    });

    // profile renamed
    return this.scriptProfileRunView.onProfileRun(function (profile) {
      if (!profile) {
        return;
      }
      _this.runtime.execute('Selection Based', null, profile);
    });
  },

  deactivate: function deactivate() {
    this.runtime.destroy();
    this.scriptView.removePanel();
    this.scriptOptionsView.close();
    this.scriptProfileRunView.close();
    this.subscriptions.dispose();
    _grammarUtils2['default'].deleteTempFiles();
  },

  closeScriptViewAndStopRunner: function closeScriptViewAndStopRunner() {
    this.runtime.stop();
    this.scriptView.removePanel();
  },

  // Public
  //
  // Service method that provides the default runtime that's configurable through Atom editor
  // Use this service if you want to directly show the script's output in the Atom editor
  //
  // **Do not destroy this {Runtime} instance!** By doing so you'll break this plugin!
  //
  // Also note that the Script package isn't activated until you actually try to use it.
  // That's why this service won't be automatically consumed. To be sure you consume it
  // you may need to manually activate the package:
  //
  // atom.packages.loadPackage('script').activateNow() # this code doesn't include error handling!
  //
  // see https://github.com/s1mplex/Atom-Script-Runtime-Consumer-Sample for a full example
  provideDefaultRuntime: function provideDefaultRuntime() {
    return this.runtime;
  },

  // Public
  //
  // Service method that provides a blank runtime. You are free to configure any aspect of it:
  // * Add observer (`runtime.addObserver(observer)`) - see {ViewRuntimeObserver} for an example
  // * configure script options (`runtime.scriptOptions`)
  //
  // In contrast to `provideDefaultRuntime` you should dispose this {Runtime} when
  // you no longer need it.
  //
  // Also note that the Script package isn't activated until you actually try to use it.
  // That's why this service won't be automatically consumed. To be sure you consume it
  // you may need to manually activate the package:
  //
  // atom.packages.loadPackage('script').activateNow() # this code doesn't include error handling!
  //
  // see https://github.com/s1mplex/Atom-Script-Runtime-Consumer-Sample for a full example
  provideBlankRuntime: function provideBlankRuntime() {
    var runner = new _runner2['default'](new _scriptOptions2['default']());
    var codeContextBuilder = new _codeContextBuilder2['default']();

    return new _runtime2['default'](runner, codeContextBuilder, []);
  },

  serialize: function serialize() {
    // TODO: True serialization needs to take the options view into account
    //       and handle deserialization
    var serializedProfiles = [];
    for (var profile of this.scriptProfiles) {
      serializedProfiles.push(profile.toObject());
    }

    return {
      scriptViewState: this.scriptView.serialize(),
      scriptOptionsViewState: this.scriptOptionsView.serialize(),
      profiles: serializedProfiles
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9zY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUVvQyxNQUFNOztrQ0FFWCx3QkFBd0I7Ozs7NEJBQzlCLGlCQUFpQjs7OztzQkFDdkIsVUFBVTs7Ozt1QkFDVCxXQUFXOzs7OzZCQUNMLGtCQUFrQjs7OztpQ0FDZCx1QkFBdUI7Ozs7b0NBQ3BCLDJCQUEyQjs7OzswQkFDckMsZUFBZTs7OzttQ0FDTix5QkFBeUI7Ozs7QUFaekQsV0FBVyxDQUFDOztxQkFjRztBQUNiLFFBQU0sRUFBRTtBQUNOLGtCQUFjLEVBQUU7QUFDZCxXQUFLLEVBQUUsK0NBQStDO0FBQ3RELFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsSUFBSTtLQUNkO0FBQ0QsdUJBQW1CLEVBQUU7QUFDbkIsV0FBSyxFQUFFLDRCQUE0QjtBQUNuQyxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7S0FDZDtBQUNELG1CQUFlLEVBQUU7QUFDZixXQUFLLEVBQUUseUNBQXlDO0FBQ2hELFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztLQUNmO0FBQ0Qsb0JBQWdCLEVBQUU7QUFDaEIsV0FBSyxFQUFFLG9CQUFvQjtBQUMzQixVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7S0FDZDtBQUNELGVBQVcsRUFBRTtBQUNYLFdBQUssRUFBRSwrQkFBK0I7QUFDdEMsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7QUFDRCxlQUFXLEVBQUU7QUFDWCxXQUFLLEVBQUUsc0JBQXNCO0FBQzdCLGlCQUFXLEVBQUUsMEVBQTBFO0FBQ3ZGLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMseUJBQXlCO0FBQ2xDLGNBQU0sQ0FDSix5QkFBeUIsRUFDekIsaUNBQWlDLEVBQ2pDLHlCQUF5QixDQUMxQjtLQUNGO0dBQ0Y7Ozs7Ozs7O0FBUUQsWUFBVSxFQUFFLElBQUk7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LHdCQUFXLGdDQUFtQixDQUFDLENBQUM7QUFDL0MsUUFBTSxrQkFBa0IsR0FBRyxxQ0FBd0IsQ0FBQzs7QUFFcEQsV0FBTyx5QkFBWSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUM7R0FDcEQ7O0FBRUQsV0FBUyxFQUFBLHFCQUFHOzs7QUFHVixRQUFNLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztBQUM5QixTQUFLLElBQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFBRSx3QkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FBRTs7QUFFM0YsV0FBTztBQUNMLHFCQUFlLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7QUFDNUMsNEJBQXNCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRTtBQUMxRCxjQUFRLEVBQUUsa0JBQWtCO0tBQzdCLENBQUM7R0FDSDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9zY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuXG5pbXBvcnQgQ29kZUNvbnRleHRCdWlsZGVyIGZyb20gJy4vY29kZS1jb250ZXh0LWJ1aWxkZXInO1xuaW1wb3J0IEdyYW1tYXJVdGlscyBmcm9tICcuL2dyYW1tYXItdXRpbHMnO1xuaW1wb3J0IFJ1bm5lciBmcm9tICcuL3J1bm5lcic7XG5pbXBvcnQgUnVudGltZSBmcm9tICcuL3J1bnRpbWUnO1xuaW1wb3J0IFNjcmlwdE9wdGlvbnMgZnJvbSAnLi9zY3JpcHQtb3B0aW9ucyc7XG5pbXBvcnQgU2NyaXB0T3B0aW9uc1ZpZXcgZnJvbSAnLi9zY3JpcHQtb3B0aW9ucy12aWV3JztcbmltcG9ydCBTY3JpcHRQcm9maWxlUnVuVmlldyBmcm9tICcuL3NjcmlwdC1wcm9maWxlLXJ1bi12aWV3JztcbmltcG9ydCBTY3JpcHRWaWV3IGZyb20gJy4vc2NyaXB0LXZpZXcnO1xuaW1wb3J0IFZpZXdSdW50aW1lT2JzZXJ2ZXIgZnJvbSAnLi92aWV3LXJ1bnRpbWUtb2JzZXJ2ZXInO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIGVuYWJsZUV4ZWNUaW1lOiB7XG4gICAgICB0aXRsZTogJ091dHB1dCB0aGUgdGltZSBpdCB0b29rIHRvIGV4ZWN1dGUgdGhlIHNjcmlwdCcsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgZXNjYXBlQ29uc29sZU91dHB1dDoge1xuICAgICAgdGl0bGU6ICdIVE1MIGVzY2FwZSBjb25zb2xlIG91dHB1dCcsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgaWdub3JlU2VsZWN0aW9uOiB7XG4gICAgICB0aXRsZTogJ0lnbm9yZSBzZWxlY3Rpb24gKGZpbGUtYmFzZWQgcnVucyBvbmx5KScsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIHNjcm9sbFdpdGhPdXRwdXQ6IHtcbiAgICAgIHRpdGxlOiAnU2Nyb2xsIHdpdGggb3V0cHV0JyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBzdG9wT25SZXJ1bjoge1xuICAgICAgdGl0bGU6ICdTdG9wIHJ1bm5pbmcgcHJvY2VzcyBvbiByZXJ1bicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGN3ZEJlaGF2aW9yOiB7XG4gICAgICB0aXRsZTogJ0RlZmF1bHQgQ1dEIEJlaGF2aW9yJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWYgbm8gUnVuIE9wdGlvbnMgYXJlIHNldCwgdGhpcyBzZXR0aW5nIGRlY2lkZXMgaG93IHRvIGRldGVybWluZSB0aGUgQ1dEJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ0ZpcnN0IHByb2plY3QgZGlyZWN0b3J5JyxcbiAgICAgIGVudW06IFtcbiAgICAgICAgJ0ZpcnN0IHByb2plY3QgZGlyZWN0b3J5JyxcbiAgICAgICAgJ1Byb2plY3QgZGlyZWN0b3J5IG9mIHRoZSBzY3JpcHQnLFxuICAgICAgICAnRGlyZWN0b3J5IG9mIHRoZSBzY3JpcHQnLFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuICAvLyBGb3Igc29tZSByZWFzb24sIHRoZSB0ZXh0IG9mIHRoZXNlIG9wdGlvbnMgZG9lcyBub3Qgc2hvdyBpbiBwYWNrYWdlIHNldHRpbmdzIHZpZXdcbiAgLy8gZGVmYXVsdDogJ2ZpcnN0UHJvaidcbiAgLy8gZW51bTogW1xuICAvLyAgIHt2YWx1ZTogJ2ZpcnN0UHJvaicsIGRlc2NyaXB0aW9uOiAnRmlyc3QgcHJvamVjdCBkaXJlY3RvcnkgKGlmIHRoZXJlIGlzIG9uZSknfVxuICAvLyAgIHt2YWx1ZTogJ3NjcmlwdFByb2onLCBkZXNjcmlwdGlvbjogJ1Byb2plY3QgZGlyZWN0b3J5IG9mIHRoZSBzY3JpcHQgKGlmIHRoZXJlIGlzIG9uZSknfVxuICAvLyAgIHt2YWx1ZTogJ3NjcmlwdERpcicsIGRlc2NyaXB0aW9uOiAnRGlyZWN0b3J5IG9mIHRoZSBzY3JpcHQnfVxuICAvLyBdXG4gIHNjcmlwdFZpZXc6IG51bGwsXG4gIHNjcmlwdE9wdGlvbnNWaWV3OiBudWxsLFxuICBzY3JpcHRQcm9maWxlUnVuVmlldzogbnVsbCxcbiAgc2NyaXB0T3B0aW9uczogbnVsbCxcbiAgc2NyaXB0UHJvZmlsZXM6IFtdLFxuXG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5zY3JpcHRWaWV3ID0gbmV3IFNjcmlwdFZpZXcoc3RhdGUuc2NyaXB0Vmlld1N0YXRlKTtcbiAgICB0aGlzLnNjcmlwdE9wdGlvbnMgPSBuZXcgU2NyaXB0T3B0aW9ucygpO1xuICAgIHRoaXMuc2NyaXB0T3B0aW9uc1ZpZXcgPSBuZXcgU2NyaXB0T3B0aW9uc1ZpZXcodGhpcy5zY3JpcHRPcHRpb25zKTtcblxuICAgIC8vIHByb2ZpbGVzIGxvYWRpbmdcbiAgICB0aGlzLnNjcmlwdFByb2ZpbGVzID0gW107XG4gICAgaWYgKHN0YXRlLnByb2ZpbGVzKSB7XG4gICAgICBmb3IgKGNvbnN0IHByb2ZpbGUgb2Ygc3RhdGUucHJvZmlsZXMpIHtcbiAgICAgICAgY29uc3Qgc28gPSBTY3JpcHRPcHRpb25zLmNyZWF0ZUZyb21PcHRpb25zKHByb2ZpbGUubmFtZSwgcHJvZmlsZSk7XG4gICAgICAgIHRoaXMuc2NyaXB0UHJvZmlsZXMucHVzaChzbyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zY3JpcHRQcm9maWxlUnVuVmlldyA9IG5ldyBTY3JpcHRQcm9maWxlUnVuVmlldyh0aGlzLnNjcmlwdFByb2ZpbGVzKTtcblxuICAgIGNvbnN0IGNvZGVDb250ZXh0QnVpbGRlciA9IG5ldyBDb2RlQ29udGV4dEJ1aWxkZXIoKTtcbiAgICBjb25zdCBydW5uZXIgPSBuZXcgUnVubmVyKHRoaXMuc2NyaXB0T3B0aW9ucyk7XG5cbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBWaWV3UnVudGltZU9ic2VydmVyKHRoaXMuc2NyaXB0Vmlldyk7XG5cbiAgICB0aGlzLnJ1bnRpbWUgPSBuZXcgUnVudGltZShydW5uZXIsIGNvZGVDb250ZXh0QnVpbGRlciwgW29ic2VydmVyXSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2NvcmU6Y2FuY2VsJzogKCkgPT4gdGhpcy5jbG9zZVNjcmlwdFZpZXdBbmRTdG9wUnVubmVyKCksXG4gICAgICAnY29yZTpjbG9zZSc6ICgpID0+IHRoaXMuY2xvc2VTY3JpcHRWaWV3QW5kU3RvcFJ1bm5lcigpLFxuICAgICAgJ3NjcmlwdDpjbG9zZS12aWV3JzogKCkgPT4gdGhpcy5jbG9zZVNjcmlwdFZpZXdBbmRTdG9wUnVubmVyKCksXG4gICAgICAnc2NyaXB0OmNvcHktcnVuLXJlc3VsdHMnOiAoKSA9PiB0aGlzLnNjcmlwdFZpZXcuY29weVJlc3VsdHMoKSxcbiAgICAgICdzY3JpcHQ6a2lsbC1wcm9jZXNzJzogKCkgPT4gdGhpcy5ydW50aW1lLnN0b3AoKSxcbiAgICAgICdzY3JpcHQ6cnVuLWJ5LWxpbmUtbnVtYmVyJzogKCkgPT4gdGhpcy5ydW50aW1lLmV4ZWN1dGUoJ0xpbmUgTnVtYmVyIEJhc2VkJyksXG4gICAgICAnc2NyaXB0OnJ1bic6ICgpID0+IHRoaXMucnVudGltZS5leGVjdXRlKCdTZWxlY3Rpb24gQmFzZWQnKSxcbiAgICB9KSk7XG5cbiAgICAvLyBwcm9maWxlIGNyZWF0ZWRcbiAgICB0aGlzLnNjcmlwdE9wdGlvbnNWaWV3Lm9uUHJvZmlsZVNhdmUoKHByb2ZpbGVEYXRhKSA9PiB7XG4gICAgICAvLyBjcmVhdGUgYW5kIGZpbGwgb3V0IHByb2ZpbGVcbiAgICAgIGNvbnN0IHByb2ZpbGUgPSBTY3JpcHRPcHRpb25zLmNyZWF0ZUZyb21PcHRpb25zKHByb2ZpbGVEYXRhLm5hbWUsIHByb2ZpbGVEYXRhLm9wdGlvbnMpO1xuXG4gICAgICBjb25zdCBjb2RlQ29udGV4dCA9IHRoaXMucnVudGltZS5jb2RlQ29udGV4dEJ1aWxkZXIuYnVpbGRDb2RlQ29udGV4dChcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLCAnU2VsZWN0aW9uIEJhc2VkJyk7XG4gICAgICBwcm9maWxlLmxhbmcgPSBjb2RlQ29udGV4dC5sYW5nO1xuXG4gICAgICAvLyBmb3JtYXR0aW5nIGRlc2NyaXB0aW9uXG4gICAgICBjb25zdCBvcHRzID0gcHJvZmlsZS50b09iamVjdCgpO1xuICAgICAgbGV0IGRlc2MgPSBgTGFuZ3VhZ2U6ICR7Y29kZUNvbnRleHQubGFuZ31gO1xuICAgICAgaWYgKG9wdHMuY21kKSB7IGRlc2MgKz0gYCwgQ29tbWFuZDogJHtvcHRzLmNtZH1gOyB9XG4gICAgICBpZiAob3B0cy5jbWRBcmdzICYmIG9wdHMuY21kKSB7IGRlc2MgKz0gYCAke29wdHMuY21kQXJncy5qb2luKCcgJyl9YDsgfVxuXG4gICAgICBwcm9maWxlLmRlc2NyaXB0aW9uID0gZGVzYztcbiAgICAgIHRoaXMuc2NyaXB0UHJvZmlsZXMucHVzaChwcm9maWxlKTtcblxuICAgICAgdGhpcy5zY3JpcHRPcHRpb25zVmlldy5oaWRlKCk7XG4gICAgICB0aGlzLnNjcmlwdFByb2ZpbGVSdW5WaWV3LnNob3coKTtcbiAgICAgIHRoaXMuc2NyaXB0UHJvZmlsZVJ1blZpZXcuc2V0UHJvZmlsZXModGhpcy5zY3JpcHRQcm9maWxlcyk7XG4gICAgfSk7XG5cbiAgICAvLyBwcm9maWxlIGRlbGV0ZWRcbiAgICB0aGlzLnNjcmlwdFByb2ZpbGVSdW5WaWV3Lm9uUHJvZmlsZURlbGV0ZSgocHJvZmlsZSkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnNjcmlwdFByb2ZpbGVzLmluZGV4T2YocHJvZmlsZSk7XG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7IHJldHVybjsgfVxuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IHRoaXMuc2NyaXB0UHJvZmlsZXMuc3BsaWNlKGluZGV4LCAxKTsgfVxuICAgICAgdGhpcy5zY3JpcHRQcm9maWxlUnVuVmlldy5zZXRQcm9maWxlcyh0aGlzLnNjcmlwdFByb2ZpbGVzKTtcbiAgICB9KTtcblxuICAgIC8vIHByb2ZpbGUgcmVuYW1lZFxuICAgIHRoaXMuc2NyaXB0UHJvZmlsZVJ1blZpZXcub25Qcm9maWxlQ2hhbmdlKChkYXRhKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuc2NyaXB0UHJvZmlsZXMuaW5kZXhPZihkYXRhLnByb2ZpbGUpO1xuICAgICAgaWYgKGluZGV4ID09PSAtMSB8fCAhdGhpcy5zY3JpcHRQcm9maWxlc1tpbmRleF1bZGF0YS5rZXldKSB7IHJldHVybjsgfVxuXG4gICAgICB0aGlzLnNjcmlwdFByb2ZpbGVzW2luZGV4XVtkYXRhLmtleV0gPSBkYXRhLnZhbHVlO1xuICAgICAgdGhpcy5zY3JpcHRQcm9maWxlUnVuVmlldy5zaG93KCk7XG4gICAgICB0aGlzLnNjcmlwdFByb2ZpbGVSdW5WaWV3LnNldFByb2ZpbGVzKHRoaXMuc2NyaXB0UHJvZmlsZXMpO1xuICAgIH0pO1xuXG4gICAgLy8gcHJvZmlsZSByZW5hbWVkXG4gICAgcmV0dXJuIHRoaXMuc2NyaXB0UHJvZmlsZVJ1blZpZXcub25Qcm9maWxlUnVuKChwcm9maWxlKSA9PiB7XG4gICAgICBpZiAoIXByb2ZpbGUpIHsgcmV0dXJuOyB9XG4gICAgICB0aGlzLnJ1bnRpbWUuZXhlY3V0ZSgnU2VsZWN0aW9uIEJhc2VkJywgbnVsbCwgcHJvZmlsZSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnJ1bnRpbWUuZGVzdHJveSgpO1xuICAgIHRoaXMuc2NyaXB0Vmlldy5yZW1vdmVQYW5lbCgpO1xuICAgIHRoaXMuc2NyaXB0T3B0aW9uc1ZpZXcuY2xvc2UoKTtcbiAgICB0aGlzLnNjcmlwdFByb2ZpbGVSdW5WaWV3LmNsb3NlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICBHcmFtbWFyVXRpbHMuZGVsZXRlVGVtcEZpbGVzKCk7XG4gIH0sXG5cbiAgY2xvc2VTY3JpcHRWaWV3QW5kU3RvcFJ1bm5lcigpIHtcbiAgICB0aGlzLnJ1bnRpbWUuc3RvcCgpO1xuICAgIHRoaXMuc2NyaXB0Vmlldy5yZW1vdmVQYW5lbCgpO1xuICB9LFxuXG4gIC8vIFB1YmxpY1xuICAvL1xuICAvLyBTZXJ2aWNlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIHRoZSBkZWZhdWx0IHJ1bnRpbWUgdGhhdCdzIGNvbmZpZ3VyYWJsZSB0aHJvdWdoIEF0b20gZWRpdG9yXG4gIC8vIFVzZSB0aGlzIHNlcnZpY2UgaWYgeW91IHdhbnQgdG8gZGlyZWN0bHkgc2hvdyB0aGUgc2NyaXB0J3Mgb3V0cHV0IGluIHRoZSBBdG9tIGVkaXRvclxuICAvL1xuICAvLyAqKkRvIG5vdCBkZXN0cm95IHRoaXMge1J1bnRpbWV9IGluc3RhbmNlISoqIEJ5IGRvaW5nIHNvIHlvdSdsbCBicmVhayB0aGlzIHBsdWdpbiFcbiAgLy9cbiAgLy8gQWxzbyBub3RlIHRoYXQgdGhlIFNjcmlwdCBwYWNrYWdlIGlzbid0IGFjdGl2YXRlZCB1bnRpbCB5b3UgYWN0dWFsbHkgdHJ5IHRvIHVzZSBpdC5cbiAgLy8gVGhhdCdzIHdoeSB0aGlzIHNlcnZpY2Ugd29uJ3QgYmUgYXV0b21hdGljYWxseSBjb25zdW1lZC4gVG8gYmUgc3VyZSB5b3UgY29uc3VtZSBpdFxuICAvLyB5b3UgbWF5IG5lZWQgdG8gbWFudWFsbHkgYWN0aXZhdGUgdGhlIHBhY2thZ2U6XG4gIC8vXG4gIC8vIGF0b20ucGFja2FnZXMubG9hZFBhY2thZ2UoJ3NjcmlwdCcpLmFjdGl2YXRlTm93KCkgIyB0aGlzIGNvZGUgZG9lc24ndCBpbmNsdWRlIGVycm9yIGhhbmRsaW5nIVxuICAvL1xuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3MxbXBsZXgvQXRvbS1TY3JpcHQtUnVudGltZS1Db25zdW1lci1TYW1wbGUgZm9yIGEgZnVsbCBleGFtcGxlXG4gIHByb3ZpZGVEZWZhdWx0UnVudGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5ydW50aW1lO1xuICB9LFxuXG4gIC8vIFB1YmxpY1xuICAvL1xuICAvLyBTZXJ2aWNlIG1ldGhvZCB0aGF0IHByb3ZpZGVzIGEgYmxhbmsgcnVudGltZS4gWW91IGFyZSBmcmVlIHRvIGNvbmZpZ3VyZSBhbnkgYXNwZWN0IG9mIGl0OlxuICAvLyAqIEFkZCBvYnNlcnZlciAoYHJ1bnRpbWUuYWRkT2JzZXJ2ZXIob2JzZXJ2ZXIpYCkgLSBzZWUge1ZpZXdSdW50aW1lT2JzZXJ2ZXJ9IGZvciBhbiBleGFtcGxlXG4gIC8vICogY29uZmlndXJlIHNjcmlwdCBvcHRpb25zIChgcnVudGltZS5zY3JpcHRPcHRpb25zYClcbiAgLy9cbiAgLy8gSW4gY29udHJhc3QgdG8gYHByb3ZpZGVEZWZhdWx0UnVudGltZWAgeW91IHNob3VsZCBkaXNwb3NlIHRoaXMge1J1bnRpbWV9IHdoZW5cbiAgLy8geW91IG5vIGxvbmdlciBuZWVkIGl0LlxuICAvL1xuICAvLyBBbHNvIG5vdGUgdGhhdCB0aGUgU2NyaXB0IHBhY2thZ2UgaXNuJ3QgYWN0aXZhdGVkIHVudGlsIHlvdSBhY3R1YWxseSB0cnkgdG8gdXNlIGl0LlxuICAvLyBUaGF0J3Mgd2h5IHRoaXMgc2VydmljZSB3b24ndCBiZSBhdXRvbWF0aWNhbGx5IGNvbnN1bWVkLiBUbyBiZSBzdXJlIHlvdSBjb25zdW1lIGl0XG4gIC8vIHlvdSBtYXkgbmVlZCB0byBtYW51YWxseSBhY3RpdmF0ZSB0aGUgcGFja2FnZTpcbiAgLy9cbiAgLy8gYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgnc2NyaXB0JykuYWN0aXZhdGVOb3coKSAjIHRoaXMgY29kZSBkb2Vzbid0IGluY2x1ZGUgZXJyb3IgaGFuZGxpbmchXG4gIC8vXG4gIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vczFtcGxleC9BdG9tLVNjcmlwdC1SdW50aW1lLUNvbnN1bWVyLVNhbXBsZSBmb3IgYSBmdWxsIGV4YW1wbGVcbiAgcHJvdmlkZUJsYW5rUnVudGltZSgpIHtcbiAgICBjb25zdCBydW5uZXIgPSBuZXcgUnVubmVyKG5ldyBTY3JpcHRPcHRpb25zKCkpO1xuICAgIGNvbnN0IGNvZGVDb250ZXh0QnVpbGRlciA9IG5ldyBDb2RlQ29udGV4dEJ1aWxkZXIoKTtcblxuICAgIHJldHVybiBuZXcgUnVudGltZShydW5uZXIsIGNvZGVDb250ZXh0QnVpbGRlciwgW10pO1xuICB9LFxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICAvLyBUT0RPOiBUcnVlIHNlcmlhbGl6YXRpb24gbmVlZHMgdG8gdGFrZSB0aGUgb3B0aW9ucyB2aWV3IGludG8gYWNjb3VudFxuICAgIC8vICAgICAgIGFuZCBoYW5kbGUgZGVzZXJpYWxpemF0aW9uXG4gICAgY29uc3Qgc2VyaWFsaXplZFByb2ZpbGVzID0gW107XG4gICAgZm9yIChjb25zdCBwcm9maWxlIG9mIHRoaXMuc2NyaXB0UHJvZmlsZXMpIHsgc2VyaWFsaXplZFByb2ZpbGVzLnB1c2gocHJvZmlsZS50b09iamVjdCgpKTsgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNjcmlwdFZpZXdTdGF0ZTogdGhpcy5zY3JpcHRWaWV3LnNlcmlhbGl6ZSgpLFxuICAgICAgc2NyaXB0T3B0aW9uc1ZpZXdTdGF0ZTogdGhpcy5zY3JpcHRPcHRpb25zVmlldy5zZXJpYWxpemUoKSxcbiAgICAgIHByb2ZpbGVzOiBzZXJpYWxpemVkUHJvZmlsZXMsXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=