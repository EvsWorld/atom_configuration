Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _kernelspecs = require("kernelspecs");

var kernelspecs = _interopRequireWildcard(_kernelspecs);

var _spawnteract = require("spawnteract");

var _electron = require("electron");

var _zmqKernel = require("./zmq-kernel");

var _zmqKernel2 = _interopRequireDefault(_zmqKernel);

var _kernelPicker = require("./kernel-picker");

var _kernelPicker2 = _interopRequireDefault(_kernelPicker);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _utils = require("./utils");

var ks = kernelspecs;

exports.ks = ks;

var KernelManager = (function () {
  function KernelManager() {
    _classCallCheck(this, KernelManager);

    this.kernelSpecs = null;
  }

  _createClass(KernelManager, [{
    key: "startKernelFor",
    value: function startKernelFor(grammar, editor, filePath, onStarted) {
      var _this = this;

      this.getKernelSpecForGrammar(grammar).then(function (kernelSpec) {
        if (!kernelSpec) {
          var message = "No kernel for grammar `" + grammar.name + "` found";
          var pythonDescription = grammar && /python/g.test(grammar.scopeName) ? "\n\nTo detect your current Python install you will need to run:<pre>python -m pip install ipykernel\npython -m ipykernel install --user</pre>" : "";
          var description = "Check that the language for this file is set in Atom and that you have a Jupyter kernel installed for it." + pythonDescription;
          atom.notifications.addError(message, {
            description: description,
            dismissable: pythonDescription !== ""
          });
          return;
        }

        _this.startKernel(kernelSpec, grammar, editor, filePath, onStarted);
      });
    }
  }, {
    key: "startKernel",
    value: function startKernel(kernelSpec, grammar, editor, filePath, onStarted) {
      var displayName = kernelSpec.display_name;

      // if kernel startup already in progress don't start additional kernel
      if (_store2["default"].startingKernels.get(displayName)) return;

      _store2["default"].startKernel(displayName);

      var currentPath = (0, _utils.getEditorDirectory)(editor);
      var projectPath = undefined;

      (0, _utils.log)("KernelManager: startKernel:", displayName);

      switch (atom.config.get("Hydrogen.startDir")) {
        case "firstProjectDir":
          projectPath = atom.project.getPaths()[0];
          break;
        case "projectDirOfFile":
          projectPath = atom.project.relativizePath(currentPath)[0];
          break;
      }

      var kernelStartDir = projectPath != null ? projectPath : currentPath;
      var options = {
        cwd: kernelStartDir,
        stdio: ["ignore", "pipe", "pipe"]
      };

      var kernel = new _zmqKernel2["default"](kernelSpec, grammar, options, function () {
        _store2["default"].newKernel(kernel, filePath, editor, grammar);
        if (onStarted) onStarted(kernel);
      });
    }
  }, {
    key: "update",
    value: _asyncToGenerator(function* () {
      var kernelSpecs = yield ks.findAll();
      this.kernelSpecs = _lodash2["default"].map(kernelSpecs, "spec");
      return this.kernelSpecs;
    })
  }, {
    key: "getAllKernelSpecs",
    value: _asyncToGenerator(function* (grammar) {
      if (this.kernelSpecs) return this.kernelSpecs;
      return this.updateKernelSpecs(grammar);
    })
  }, {
    key: "getAllKernelSpecsForGrammar",
    value: _asyncToGenerator(function* (grammar) {
      if (!grammar) return [];

      var kernelSpecs = yield this.getAllKernelSpecs(grammar);
      return kernelSpecs.filter(function (spec) {
        return (0, _utils.kernelSpecProvidesGrammar)(spec, grammar);
      });
    })
  }, {
    key: "getKernelSpecForGrammar",
    value: _asyncToGenerator(function* (grammar) {
      var _this2 = this;

      var kernelSpecs = yield this.getAllKernelSpecsForGrammar(grammar);
      if (kernelSpecs.length <= 1) {
        return kernelSpecs[0];
      }

      if (this.kernelPicker) {
        this.kernelPicker.kernelSpecs = kernelSpecs;
      } else {
        this.kernelPicker = new _kernelPicker2["default"](kernelSpecs);
      }

      return new Promise(function (resolve) {
        if (!_this2.kernelPicker) return resolve(null);
        _this2.kernelPicker.onConfirmed = function (kernelSpec) {
          return resolve(kernelSpec);
        };
        _this2.kernelPicker.toggle();
      });
    })
  }, {
    key: "updateKernelSpecs",
    value: _asyncToGenerator(function* (grammar) {
      var kernelSpecs = yield this.update();

      if (kernelSpecs.length === 0) {
        var message = "No Kernels Installed";

        var options = {
          description: "No kernels are installed on your system so you will not be able to execute code in any language.",
          dismissable: true,
          buttons: [{
            text: "Install Instructions",
            onDidClick: function onDidClick() {
              return _electron.shell.openExternal("https://nteract.gitbooks.io/hydrogen/docs/Installation.html");
            }
          }, {
            text: "Popular Kernels",
            onDidClick: function onDidClick() {
              return _electron.shell.openExternal("https://nteract.io/kernels");
            }
          }, {
            text: "All Kernels",
            onDidClick: function onDidClick() {
              return _electron.shell.openExternal("https://github.com/jupyter/jupyter/wiki/Jupyter-kernels");
            }
          }]
        };
        atom.notifications.addError(message, options);
      } else {
        var message = "Hydrogen Kernels updated:";
        var options = {
          detail: _lodash2["default"].map(kernelSpecs, "display_name").join("\n")
        };
        atom.notifications.addInfo(message, options);
      }
      return kernelSpecs;
    })
  }]);

  return KernelManager;
})();

exports.KernelManager = KernelManager;
exports["default"] = new KernelManager();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2tlcm5lbC1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7MkJBQ08sYUFBYTs7SUFBOUIsV0FBVzs7MkJBQ0ksYUFBYTs7d0JBQ2xCLFVBQVU7O3lCQUVWLGNBQWM7Ozs7NEJBRVgsaUJBQWlCOzs7O3FCQUN4QixTQUFTOzs7O3FCQUN3QyxTQUFTOztBQUlyRSxJQUFNLEVBQUUsR0FBRyxXQUFXLENBQUM7Ozs7SUFFakIsYUFBYTtXQUFiLGFBQWE7MEJBQWIsYUFBYTs7U0FDeEIsV0FBVyxHQUF1QixJQUFJOzs7ZUFEM0IsYUFBYTs7V0FJVix3QkFDWixPQUFxQixFQUNyQixNQUF1QixFQUN2QixRQUFnQixFQUNoQixTQUFzQyxFQUN0Qzs7O0FBQ0EsVUFBSSxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUN2RCxZQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2YsY0FBTSxPQUFPLCtCQUE4QixPQUFPLENBQUMsSUFBSSxZQUFVLENBQUM7QUFDbEUsY0FBTSxpQkFBaUIsR0FDckIsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUN4QywrSUFBK0ksR0FDL0ksRUFBRSxDQUFDO0FBQ1QsY0FBTSxXQUFXLGlIQUNmLGlCQUFpQixBQUNqQixDQUFDO0FBQ0gsY0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO0FBQ25DLHVCQUFXLEVBQVgsV0FBVztBQUNYLHVCQUFXLEVBQUUsaUJBQWlCLEtBQUssRUFBRTtXQUN0QyxDQUFDLENBQUM7QUFDSCxpQkFBTztTQUNSOztBQUVELGNBQUssV0FBVyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztPQUNwRSxDQUFDLENBQUM7S0FDSjs7O1dBRVUscUJBQ1QsVUFBc0IsRUFDdEIsT0FBcUIsRUFDckIsTUFBdUIsRUFDdkIsUUFBZ0IsRUFDaEIsU0FBdUMsRUFDdkM7QUFDQSxVQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDOzs7QUFHNUMsVUFBSSxtQkFBTSxlQUFlLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU87O0FBRW5ELHlCQUFNLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFL0IsVUFBSSxXQUFXLEdBQUcsK0JBQW1CLE1BQU0sQ0FBQyxDQUFDO0FBQzdDLFVBQUksV0FBVyxZQUFBLENBQUM7O0FBRWhCLHNCQUFJLDZCQUE2QixFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUVoRCxjQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDO0FBQzFDLGFBQUssaUJBQWlCO0FBQ3BCLHFCQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QyxnQkFBTTtBQUFBLEFBQ1IsYUFBSyxrQkFBa0I7QUFDckIscUJBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxnQkFBTTtBQUFBLE9BQ1Q7O0FBRUQsVUFBTSxjQUFjLEdBQUcsV0FBVyxJQUFJLElBQUksR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQ3ZFLFVBQU0sT0FBTyxHQUFHO0FBQ2QsV0FBRyxFQUFFLGNBQWM7QUFDbkIsYUFBSyxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7T0FDbEMsQ0FBQzs7QUFFRixVQUFNLE1BQU0sR0FBRywyQkFBYyxVQUFVLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFNO0FBQy9ELDJCQUFNLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNuRCxZQUFJLFNBQVMsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDbEMsQ0FBQyxDQUFDO0tBQ0o7Ozs2QkFFVyxhQUFHO0FBQ2IsVUFBTSxXQUFXLEdBQUcsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdkMsVUFBSSxDQUFDLFdBQVcsR0FBRyxvQkFBRSxHQUFHLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztLQUN6Qjs7OzZCQUVzQixXQUFDLE9BQXNCLEVBQUU7QUFDOUMsVUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUM5QyxhQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN4Qzs7OzZCQUVnQyxXQUFDLE9BQXNCLEVBQUU7QUFDeEQsVUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQzs7QUFFeEIsVUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUQsYUFBTyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSTtlQUFJLHNDQUEwQixJQUFJLEVBQUUsT0FBTyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQzdFOzs7NkJBRTRCLFdBQUMsT0FBcUIsRUFBRTs7O0FBQ25ELFVBQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLDJCQUEyQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BFLFVBQUksV0FBVyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFDM0IsZUFBTyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDdkI7O0FBRUQsVUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3JCLFlBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztPQUM3QyxNQUFNO0FBQ0wsWUFBSSxDQUFDLFlBQVksR0FBRyw4QkFBaUIsV0FBVyxDQUFDLENBQUM7T0FDbkQ7O0FBRUQsYUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUM1QixZQUFJLENBQUMsT0FBSyxZQUFZLEVBQUUsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0MsZUFBSyxZQUFZLENBQUMsV0FBVyxHQUFHLFVBQUEsVUFBVTtpQkFBSSxPQUFPLENBQUMsVUFBVSxDQUFDO1NBQUEsQ0FBQztBQUNsRSxlQUFLLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUM1QixDQUFDLENBQUM7S0FDSjs7OzZCQUVzQixXQUFDLE9BQXNCLEVBQUU7QUFDOUMsVUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRXhDLFVBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDNUIsWUFBTSxPQUFPLEdBQUcsc0JBQXNCLENBQUM7O0FBRXZDLFlBQU0sT0FBTyxHQUFHO0FBQ2QscUJBQVcsRUFDVCxrR0FBa0c7QUFDcEcscUJBQVcsRUFBRSxJQUFJO0FBQ2pCLGlCQUFPLEVBQUUsQ0FDUDtBQUNFLGdCQUFJLEVBQUUsc0JBQXNCO0FBQzVCLHNCQUFVLEVBQUU7cUJBQ1YsZ0JBQU0sWUFBWSxDQUNoQiw2REFBNkQsQ0FDOUQ7YUFBQTtXQUNKLEVBQ0Q7QUFDRSxnQkFBSSxFQUFFLGlCQUFpQjtBQUN2QixzQkFBVSxFQUFFO3FCQUFNLGdCQUFNLFlBQVksQ0FBQyw0QkFBNEIsQ0FBQzthQUFBO1dBQ25FLEVBQ0Q7QUFDRSxnQkFBSSxFQUFFLGFBQWE7QUFDbkIsc0JBQVUsRUFBRTtxQkFDVixnQkFBTSxZQUFZLENBQ2hCLHlEQUF5RCxDQUMxRDthQUFBO1dBQ0osQ0FDRjtTQUNGLENBQUM7QUFDRixZQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7T0FDL0MsTUFBTTtBQUNMLFlBQU0sT0FBTyxHQUFHLDJCQUEyQixDQUFDO0FBQzVDLFlBQU0sT0FBTyxHQUFHO0FBQ2QsZ0JBQU0sRUFBRSxvQkFBRSxHQUFHLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDdEQsQ0FBQztBQUNGLFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztPQUM5QztBQUNELGFBQU8sV0FBVyxDQUFDO0tBQ3BCOzs7U0FwSlUsYUFBYTs7OztxQkF1SlgsSUFBSSxhQUFhLEVBQUUiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIva2VybmVsLW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgKiBhcyBrZXJuZWxzcGVjcyBmcm9tIFwia2VybmVsc3BlY3NcIjtcbmltcG9ydCB7IGxhdW5jaFNwZWMgfSBmcm9tIFwic3Bhd250ZXJhY3RcIjtcbmltcG9ydCB7IHNoZWxsIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5cbmltcG9ydCBaTVFLZXJuZWwgZnJvbSBcIi4vem1xLWtlcm5lbFwiO1xuXG5pbXBvcnQgS2VybmVsUGlja2VyIGZyb20gXCIuL2tlcm5lbC1waWNrZXJcIjtcbmltcG9ydCBzdG9yZSBmcm9tIFwiLi9zdG9yZVwiO1xuaW1wb3J0IHsgZ2V0RWRpdG9yRGlyZWN0b3J5LCBrZXJuZWxTcGVjUHJvdmlkZXNHcmFtbWFyLCBsb2cgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5pbXBvcnQgdHlwZSB7IENvbm5lY3Rpb24gfSBmcm9tIFwiLi96bXEta2VybmVsXCI7XG5cbmV4cG9ydCBjb25zdCBrcyA9IGtlcm5lbHNwZWNzO1xuXG5leHBvcnQgY2xhc3MgS2VybmVsTWFuYWdlciB7XG4gIGtlcm5lbFNwZWNzOiA/QXJyYXk8S2VybmVsc3BlYz4gPSBudWxsO1xuICBrZXJuZWxQaWNrZXI6ID9LZXJuZWxQaWNrZXI7XG5cbiAgc3RhcnRLZXJuZWxGb3IoXG4gICAgZ3JhbW1hcjogYXRvbSRHcmFtbWFyLFxuICAgIGVkaXRvcjogYXRvbSRUZXh0RWRpdG9yLFxuICAgIGZpbGVQYXRoOiBzdHJpbmcsXG4gICAgb25TdGFydGVkOiAoa2VybmVsOiBaTVFLZXJuZWwpID0+IHZvaWRcbiAgKSB7XG4gICAgdGhpcy5nZXRLZXJuZWxTcGVjRm9yR3JhbW1hcihncmFtbWFyKS50aGVuKGtlcm5lbFNwZWMgPT4ge1xuICAgICAgaWYgKCFrZXJuZWxTcGVjKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgTm8ga2VybmVsIGZvciBncmFtbWFyIFxcYCR7Z3JhbW1hci5uYW1lfVxcYCBmb3VuZGA7XG4gICAgICAgIGNvbnN0IHB5dGhvbkRlc2NyaXB0aW9uID1cbiAgICAgICAgICBncmFtbWFyICYmIC9weXRob24vZy50ZXN0KGdyYW1tYXIuc2NvcGVOYW1lKVxuICAgICAgICAgICAgPyBcIlxcblxcblRvIGRldGVjdCB5b3VyIGN1cnJlbnQgUHl0aG9uIGluc3RhbGwgeW91IHdpbGwgbmVlZCB0byBydW46PHByZT5weXRob24gLW0gcGlwIGluc3RhbGwgaXB5a2VybmVsXFxucHl0aG9uIC1tIGlweWtlcm5lbCBpbnN0YWxsIC0tdXNlcjwvcHJlPlwiXG4gICAgICAgICAgICA6IFwiXCI7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gYENoZWNrIHRoYXQgdGhlIGxhbmd1YWdlIGZvciB0aGlzIGZpbGUgaXMgc2V0IGluIEF0b20gYW5kIHRoYXQgeW91IGhhdmUgYSBKdXB5dGVyIGtlcm5lbCBpbnN0YWxsZWQgZm9yIGl0LiR7XG4gICAgICAgICAgcHl0aG9uRGVzY3JpcHRpb25cbiAgICAgICAgfWA7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihtZXNzYWdlLCB7XG4gICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHB5dGhvbkRlc2NyaXB0aW9uICE9PSBcIlwiXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhcnRLZXJuZWwoa2VybmVsU3BlYywgZ3JhbW1hciwgZWRpdG9yLCBmaWxlUGF0aCwgb25TdGFydGVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0S2VybmVsKFxuICAgIGtlcm5lbFNwZWM6IEtlcm5lbHNwZWMsXG4gICAgZ3JhbW1hcjogYXRvbSRHcmFtbWFyLFxuICAgIGVkaXRvcjogYXRvbSRUZXh0RWRpdG9yLFxuICAgIGZpbGVQYXRoOiBzdHJpbmcsXG4gICAgb25TdGFydGVkOiA/KGtlcm5lbDogWk1RS2VybmVsKSA9PiB2b2lkXG4gICkge1xuICAgIGNvbnN0IGRpc3BsYXlOYW1lID0ga2VybmVsU3BlYy5kaXNwbGF5X25hbWU7XG5cbiAgICAvLyBpZiBrZXJuZWwgc3RhcnR1cCBhbHJlYWR5IGluIHByb2dyZXNzIGRvbid0IHN0YXJ0IGFkZGl0aW9uYWwga2VybmVsXG4gICAgaWYgKHN0b3JlLnN0YXJ0aW5nS2VybmVscy5nZXQoZGlzcGxheU5hbWUpKSByZXR1cm47XG5cbiAgICBzdG9yZS5zdGFydEtlcm5lbChkaXNwbGF5TmFtZSk7XG5cbiAgICBsZXQgY3VycmVudFBhdGggPSBnZXRFZGl0b3JEaXJlY3RvcnkoZWRpdG9yKTtcbiAgICBsZXQgcHJvamVjdFBhdGg7XG5cbiAgICBsb2coXCJLZXJuZWxNYW5hZ2VyOiBzdGFydEtlcm5lbDpcIiwgZGlzcGxheU5hbWUpO1xuXG4gICAgc3dpdGNoIChhdG9tLmNvbmZpZy5nZXQoXCJIeWRyb2dlbi5zdGFydERpclwiKSkge1xuICAgICAgY2FzZSBcImZpcnN0UHJvamVjdERpclwiOlxuICAgICAgICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJwcm9qZWN0RGlyT2ZGaWxlXCI6XG4gICAgICAgIHByb2plY3RQYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGN1cnJlbnRQYXRoKVswXTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29uc3Qga2VybmVsU3RhcnREaXIgPSBwcm9qZWN0UGF0aCAhPSBudWxsID8gcHJvamVjdFBhdGggOiBjdXJyZW50UGF0aDtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgY3dkOiBrZXJuZWxTdGFydERpcixcbiAgICAgIHN0ZGlvOiBbXCJpZ25vcmVcIiwgXCJwaXBlXCIsIFwicGlwZVwiXVxuICAgIH07XG5cbiAgICBjb25zdCBrZXJuZWwgPSBuZXcgWk1RS2VybmVsKGtlcm5lbFNwZWMsIGdyYW1tYXIsIG9wdGlvbnMsICgpID0+IHtcbiAgICAgIHN0b3JlLm5ld0tlcm5lbChrZXJuZWwsIGZpbGVQYXRoLCBlZGl0b3IsIGdyYW1tYXIpO1xuICAgICAgaWYgKG9uU3RhcnRlZCkgb25TdGFydGVkKGtlcm5lbCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGUoKSB7XG4gICAgY29uc3Qga2VybmVsU3BlY3MgPSBhd2FpdCBrcy5maW5kQWxsKCk7XG4gICAgdGhpcy5rZXJuZWxTcGVjcyA9IF8ubWFwKGtlcm5lbFNwZWNzLCBcInNwZWNcIik7XG4gICAgcmV0dXJuIHRoaXMua2VybmVsU3BlY3M7XG4gIH1cblxuICBhc3luYyBnZXRBbGxLZXJuZWxTcGVjcyhncmFtbWFyOiA/YXRvbSRHcmFtbWFyKSB7XG4gICAgaWYgKHRoaXMua2VybmVsU3BlY3MpIHJldHVybiB0aGlzLmtlcm5lbFNwZWNzO1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZUtlcm5lbFNwZWNzKGdyYW1tYXIpO1xuICB9XG5cbiAgYXN5bmMgZ2V0QWxsS2VybmVsU3BlY3NGb3JHcmFtbWFyKGdyYW1tYXI6ID9hdG9tJEdyYW1tYXIpIHtcbiAgICBpZiAoIWdyYW1tYXIpIHJldHVybiBbXTtcblxuICAgIGNvbnN0IGtlcm5lbFNwZWNzID0gYXdhaXQgdGhpcy5nZXRBbGxLZXJuZWxTcGVjcyhncmFtbWFyKTtcbiAgICByZXR1cm4ga2VybmVsU3BlY3MuZmlsdGVyKHNwZWMgPT4ga2VybmVsU3BlY1Byb3ZpZGVzR3JhbW1hcihzcGVjLCBncmFtbWFyKSk7XG4gIH1cblxuICBhc3luYyBnZXRLZXJuZWxTcGVjRm9yR3JhbW1hcihncmFtbWFyOiBhdG9tJEdyYW1tYXIpIHtcbiAgICBjb25zdCBrZXJuZWxTcGVjcyA9IGF3YWl0IHRoaXMuZ2V0QWxsS2VybmVsU3BlY3NGb3JHcmFtbWFyKGdyYW1tYXIpO1xuICAgIGlmIChrZXJuZWxTcGVjcy5sZW5ndGggPD0gMSkge1xuICAgICAgcmV0dXJuIGtlcm5lbFNwZWNzWzBdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmtlcm5lbFBpY2tlcikge1xuICAgICAgdGhpcy5rZXJuZWxQaWNrZXIua2VybmVsU3BlY3MgPSBrZXJuZWxTcGVjcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5rZXJuZWxQaWNrZXIgPSBuZXcgS2VybmVsUGlja2VyKGtlcm5lbFNwZWNzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAoIXRoaXMua2VybmVsUGlja2VyKSByZXR1cm4gcmVzb2x2ZShudWxsKTtcbiAgICAgIHRoaXMua2VybmVsUGlja2VyLm9uQ29uZmlybWVkID0ga2VybmVsU3BlYyA9PiByZXNvbHZlKGtlcm5lbFNwZWMpO1xuICAgICAgdGhpcy5rZXJuZWxQaWNrZXIudG9nZ2xlKCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVLZXJuZWxTcGVjcyhncmFtbWFyOiA/YXRvbSRHcmFtbWFyKSB7XG4gICAgY29uc3Qga2VybmVsU3BlY3MgPSBhd2FpdCB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgaWYgKGtlcm5lbFNwZWNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IFwiTm8gS2VybmVscyBJbnN0YWxsZWRcIjtcblxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJObyBrZXJuZWxzIGFyZSBpbnN0YWxsZWQgb24geW91ciBzeXN0ZW0gc28geW91IHdpbGwgbm90IGJlIGFibGUgdG8gZXhlY3V0ZSBjb2RlIGluIGFueSBsYW5ndWFnZS5cIixcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIkluc3RhbGwgSW5zdHJ1Y3Rpb25zXCIsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PlxuICAgICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoXG4gICAgICAgICAgICAgICAgXCJodHRwczovL250ZXJhY3QuZ2l0Ym9va3MuaW8vaHlkcm9nZW4vZG9jcy9JbnN0YWxsYXRpb24uaHRtbFwiXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiUG9wdWxhciBLZXJuZWxzXCIsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiBzaGVsbC5vcGVuRXh0ZXJuYWwoXCJodHRwczovL250ZXJhY3QuaW8va2VybmVsc1wiKVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJBbGwgS2VybmVsc1wiLFxuICAgICAgICAgICAgb25EaWRDbGljazogKCkgPT5cbiAgICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKFxuICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9naXRodWIuY29tL2p1cHl0ZXIvanVweXRlci93aWtpL0p1cHl0ZXIta2VybmVsc1wiXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH07XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IobWVzc2FnZSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBcIkh5ZHJvZ2VuIEtlcm5lbHMgdXBkYXRlZDpcIjtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIGRldGFpbDogXy5tYXAoa2VybmVsU3BlY3MsIFwiZGlzcGxheV9uYW1lXCIpLmpvaW4oXCJcXG5cIilcbiAgICAgIH07XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhtZXNzYWdlLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIGtlcm5lbFNwZWNzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBLZXJuZWxNYW5hZ2VyKCk7XG4iXX0=