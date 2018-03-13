Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _atom = require("atom");

var _mobx = require("mobx");

var _utils = require("./../utils");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require("./../config");

var _config2 = _interopRequireDefault(_config);

var _codeManager = require("./../code-manager");

var codeManager = _interopRequireWildcard(_codeManager);

var _markers = require("./markers");

var _markers2 = _interopRequireDefault(_markers);

var _kernelManager = require("./../kernel-manager");

var _kernelManager2 = _interopRequireDefault(_kernelManager);

var _kernel = require("./../kernel");

var _kernel2 = _interopRequireDefault(_kernel);

var commutable = require("@nteract/commutable");

var Store = (function () {
  var _instanceInitializers = {};

  function Store() {
    _classCallCheck(this, Store);

    this.subscriptions = new _atom.CompositeDisposable();
    this.markers = new _markers2["default"]();
    this.runningKernels = (0, _mobx.observable)([]);

    _defineDecoratedPropertyDescriptor(this, "kernelMapping", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "startingKernels", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "editor", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "grammar", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "configMapping", _instanceInitializers);
  }

  _createDecoratedClass(Store, [{
    key: "startKernel",
    decorators: [_mobx.action],
    value: function startKernel(kernelDisplayName) {
      this.startingKernels.set(kernelDisplayName, true);
    }
  }, {
    key: "newKernel",
    decorators: [_mobx.action],
    value: function newKernel(kernel, filePath, editor, grammar) {
      if ((0, _utils.isMultilanguageGrammar)(editor.getGrammar())) {
        var old = this.kernelMapping.get(filePath);
        var newMap = old && old instanceof _kernel2["default"] === false ? old : {};
        newMap[grammar.name] = kernel;
        this.kernelMapping.set(filePath, newMap);
      } else {
        this.kernelMapping.set(filePath, kernel);
      }
      var index = this.runningKernels.findIndex(function (k) {
        return k === kernel;
      });
      if (index === -1) {
        this.runningKernels.push(kernel);
      }
      // delete startingKernel since store.kernel now in place to prevent duplicate kernel
      this.startingKernels["delete"](kernel.kernelSpec.display_name);
    }
  }, {
    key: "deleteKernel",
    decorators: [_mobx.action],
    value: function deleteKernel(kernel) {
      var _this = this;

      this._iterateOverKernels(kernel, function (_, file) {
        _this.kernelMapping["delete"](file);
      }, function (map, _, grammar) {
        map[grammar] = null;
        delete map[grammar];
      });

      this.runningKernels.remove(kernel);
    }
  }, {
    key: "_iterateOverKernels",
    value: function _iterateOverKernels(kernel, func) {
      var func2 = arguments.length <= 2 || arguments[2] === undefined ? func : arguments[2];
      return (function () {
        this.kernelMapping.forEach(function (kernelOrObj, file) {
          if (kernelOrObj === kernel) {
            func(kernel, file);
          }

          if (kernelOrObj instanceof _kernel2["default"] === false) {
            _lodash2["default"].forEach(kernelOrObj, function (k, grammar) {
              if (k === kernel) {
                func2(kernelOrObj, file, grammar);
              }
            });
          }
        });
      }).apply(this, arguments);
    }
  }, {
    key: "getFilesForKernel",
    value: function getFilesForKernel(kernel) {
      var files = [];
      this._iterateOverKernels(kernel, function (_, file) {
        return files.push(file);
      });
      return files;
    }
  }, {
    key: "dispose",
    decorators: [_mobx.action],
    value: function dispose() {
      this.subscriptions.dispose();
      this.markers.clear();
      this.runningKernels.forEach(function (kernel) {
        return kernel.destroy();
      });
      this.runningKernels.clear();
      this.kernelMapping.clear();
    }
  }, {
    key: "updateEditor",
    decorators: [_mobx.action],
    value: function updateEditor(editor) {
      this.editor = editor;
      this.setGrammar(editor);
    }
  }, {
    key: "setGrammar",
    decorators: [_mobx.action],
    value: function setGrammar(editor) {
      if (!editor) {
        this.grammar = null;
        return;
      }

      var grammar = editor.getGrammar();

      if ((0, _utils.isMultilanguageGrammar)(grammar)) {
        var embeddedScope = (0, _utils.getEmbeddedScope)(editor, editor.getCursorBufferPosition());

        if (embeddedScope) {
          var scope = embeddedScope.replace(".embedded", "");
          grammar = atom.grammars.grammarForScopeName(scope);
        }
      }

      this.grammar = grammar;
    }
  }, {
    key: "setConfigValue",
    decorators: [_mobx.action],
    value: function setConfigValue(keyPath, newValue) {
      if (!newValue) {
        newValue = atom.config.get(keyPath);
      }
      this.configMapping.set(keyPath, newValue);
    }
  }, {
    key: "kernelMapping",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return new Map();
    },
    enumerable: true
  }, {
    key: "startingKernels",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return new Map();
    },
    enumerable: true
  }, {
    key: "editor",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return atom.workspace.getActiveTextEditor();
    },
    enumerable: true
  }, {
    key: "grammar",
    decorators: [_mobx.observable],
    initializer: null,
    enumerable: true
  }, {
    key: "configMapping",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return new Map();
    },
    enumerable: true
  }, {
    key: "kernel",
    decorators: [_mobx.computed],
    get: function get() {
      if (!this.filePath) return null;
      var kernel = this.kernelMapping.get(this.filePath);
      if (!kernel || kernel instanceof _kernel2["default"]) return kernel;
      if (this.grammar) return kernel[this.grammar.name];
    }
  }, {
    key: "filePath",
    decorators: [_mobx.computed],
    get: function get() {
      return this.editor ? this.editor.getPath() : null;
    }
  }, {
    key: "notebook",
    decorators: [_mobx.computed],
    get: function get() {
      var editor = this.editor;
      if (!editor) {
        return null;
      }
      // Should we consider starting off with a monocellNotebook ?
      var notebook = commutable.emptyNotebook;
      var cellRanges = codeManager.getCells(editor);
      _lodash2["default"].forEach(cellRanges, function (cell) {
        var start = cell.start;
        var end = cell.end;

        var source = codeManager.getTextInRange(editor, start, end);
        source = source ? source : "";
        var newCell = commutable.emptyCodeCell.set("source", source);
        notebook = commutable.appendCellToNotebook(notebook, newCell);
      });
      return commutable.toJS(notebook);
    }
  }], null, _instanceInitializers);

  return Store;
})();

exports.Store = Store;

var store = new Store();
exports["default"] = store;

// For debugging
window.hydrogen_store = store;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3N0b3JlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUVvQyxNQUFNOztvQkFDRyxNQUFNOztxQkFDTSxZQUFZOztzQkFDdkQsUUFBUTs7OztzQkFFSCxhQUFhOzs7OzJCQUNILG1CQUFtQjs7SUFBcEMsV0FBVzs7dUJBQ0MsV0FBVzs7Ozs2QkFDVCxxQkFBcUI7Ozs7c0JBQzVCLGFBQWE7Ozs7QUFJaEMsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0lBRXJDLEtBQUs7OztXQUFMLEtBQUs7MEJBQUwsS0FBSzs7U0FDaEIsYUFBYSxHQUFHLCtCQUF5QjtTQUN6QyxPQUFPLEdBQUcsMEJBQWlCO1NBQzNCLGNBQWMsR0FBNkIsc0JBQVcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O3dCQUg5QyxLQUFLOzs7V0EyQ0wscUJBQUMsaUJBQXlCLEVBQUU7QUFDckMsVUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDbkQ7Ozs7V0FHUSxtQkFDUCxNQUFjLEVBQ2QsUUFBZ0IsRUFDaEIsTUFBdUIsRUFDdkIsT0FBcUIsRUFDckI7QUFDQSxVQUFJLG1DQUF1QixNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRTtBQUMvQyxZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QyxZQUFNLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRywrQkFBa0IsS0FBSyxLQUFLLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNqRSxjQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUM5QixZQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxD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ZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3N0b3JlL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCI7XG5pbXBvcnQgeyBvYnNlcnZhYmxlLCBjb21wdXRlZCwgYWN0aW9uIH0gZnJvbSBcIm1vYnhcIjtcbmltcG9ydCB7IGlzTXVsdGlsYW5ndWFnZUdyYW1tYXIsIGdldEVtYmVkZGVkU2NvcGUgfSBmcm9tIFwiLi8uLi91dGlsc1wiO1xuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuXG5pbXBvcnQgQ29uZmlnIGZyb20gXCIuLy4uL2NvbmZpZ1wiO1xuaW1wb3J0ICogYXMgY29kZU1hbmFnZXIgZnJvbSBcIi4vLi4vY29kZS1tYW5hZ2VyXCI7XG5pbXBvcnQgTWFya2VyU3RvcmUgZnJvbSBcIi4vbWFya2Vyc1wiO1xuaW1wb3J0IGtlcm5lbE1hbmFnZXIgZnJvbSBcIi4vLi4va2VybmVsLW1hbmFnZXJcIjtcbmltcG9ydCBLZXJuZWwgZnJvbSBcIi4vLi4va2VybmVsXCI7XG5cbmltcG9ydCB0eXBlIHsgSU9ic2VydmFibGVBcnJheSB9IGZyb20gXCJtb2J4XCI7XG5cbmNvbnN0IGNvbW11dGFibGUgPSByZXF1aXJlKFwiQG50ZXJhY3QvY29tbXV0YWJsZVwiKTtcblxuZXhwb3J0IGNsYXNzIFN0b3JlIHtcbiAgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIG1hcmtlcnMgPSBuZXcgTWFya2VyU3RvcmUoKTtcbiAgcnVubmluZ0tlcm5lbHM6IElPYnNlcnZhYmxlQXJyYXk8S2VybmVsPiA9IG9ic2VydmFibGUoW10pO1xuICBAb2JzZXJ2YWJsZSBrZXJuZWxNYXBwaW5nOiBLZXJuZWxNYXBwaW5nID0gbmV3IE1hcCgpO1xuICBAb2JzZXJ2YWJsZSBzdGFydGluZ0tlcm5lbHM6IE1hcDxzdHJpbmcsIGJvb2xlYW4+ID0gbmV3IE1hcCgpO1xuICBAb2JzZXJ2YWJsZSBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gIEBvYnNlcnZhYmxlIGdyYW1tYXI6ID9hdG9tJEdyYW1tYXI7XG4gIEBvYnNlcnZhYmxlIGNvbmZpZ01hcHBpbmc6IE1hcDxzdHJpbmcsID9taXhlZD4gPSBuZXcgTWFwKCk7XG5cbiAgQGNvbXB1dGVkXG4gIGdldCBrZXJuZWwoKTogP0tlcm5lbCB7XG4gICAgaWYgKCF0aGlzLmZpbGVQYXRoKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBrZXJuZWwgPSB0aGlzLmtlcm5lbE1hcHBpbmcuZ2V0KHRoaXMuZmlsZVBhdGgpO1xuICAgIGlmICgha2VybmVsIHx8IGtlcm5lbCBpbnN0YW5jZW9mIEtlcm5lbCkgcmV0dXJuIGtlcm5lbDtcbiAgICBpZiAodGhpcy5ncmFtbWFyKSByZXR1cm4ga2VybmVsW3RoaXMuZ3JhbW1hci5uYW1lXTtcbiAgfVxuXG4gIEBjb21wdXRlZFxuICBnZXQgZmlsZVBhdGgoKTogP3N0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yID8gdGhpcy5lZGl0b3IuZ2V0UGF0aCgpIDogbnVsbDtcbiAgfVxuXG4gIEBjb21wdXRlZFxuICBnZXQgbm90ZWJvb2soKSB7XG4gICAgY29uc3QgZWRpdG9yID0gdGhpcy5lZGl0b3I7XG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBTaG91bGQgd2UgY29uc2lkZXIgc3RhcnRpbmcgb2ZmIHdpdGggYSBtb25vY2VsbE5vdGVib29rID9cbiAgICBsZXQgbm90ZWJvb2sgPSBjb21tdXRhYmxlLmVtcHR5Tm90ZWJvb2s7XG4gICAgY29uc3QgY2VsbFJhbmdlcyA9IGNvZGVNYW5hZ2VyLmdldENlbGxzKGVkaXRvcik7XG4gICAgXy5mb3JFYWNoKGNlbGxSYW5nZXMsIGNlbGwgPT4ge1xuICAgICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSBjZWxsO1xuICAgICAgbGV0IHNvdXJjZSA9IGNvZGVNYW5hZ2VyLmdldFRleHRJblJhbmdlKGVkaXRvciwgc3RhcnQsIGVuZCk7XG4gICAgICBzb3VyY2UgPSBzb3VyY2UgPyBzb3VyY2UgOiBcIlwiO1xuICAgICAgY29uc3QgbmV3Q2VsbCA9IGNvbW11dGFibGUuZW1wdHlDb2RlQ2VsbC5zZXQoXCJzb3VyY2VcIiwgc291cmNlKTtcbiAgICAgIG5vdGVib29rID0gY29tbXV0YWJsZS5hcHBlbmRDZWxsVG9Ob3RlYm9vayhub3RlYm9vaywgbmV3Q2VsbCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbW11dGFibGUudG9KUyhub3RlYm9vayk7XG4gIH1cblxuICBAYWN0aW9uXG4gIHN0YXJ0S2VybmVsKGtlcm5lbERpc3BsYXlOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLnN0YXJ0aW5nS2VybmVscy5zZXQoa2VybmVsRGlzcGxheU5hbWUsIHRydWUpO1xuICB9XG5cbiAgQGFjdGlvblxuICBuZXdLZXJuZWwoXG4gICAga2VybmVsOiBLZXJuZWwsXG4gICAgZmlsZVBhdGg6IHN0cmluZyxcbiAgICBlZGl0b3I6IGF0b20kVGV4dEVkaXRvcixcbiAgICBncmFtbWFyOiBhdG9tJEdyYW1tYXJcbiAgKSB7XG4gICAgaWYgKGlzTXVsdGlsYW5ndWFnZUdyYW1tYXIoZWRpdG9yLmdldEdyYW1tYXIoKSkpIHtcbiAgICAgIGNvbnN0IG9sZCA9IHRoaXMua2VybmVsTWFwcGluZy5nZXQoZmlsZVBhdGgpO1xuICAgICAgY29uc3QgbmV3TWFwID0gb2xkICYmIG9sZCBpbnN0YW5jZW9mIEtlcm5lbCA9PT0gZmFsc2UgPyBvbGQgOiB7fTtcbiAgICAgIG5ld01hcFtncmFtbWFyLm5hbWVdID0ga2VybmVsO1xuICAgICAgdGhpcy5rZXJuZWxNYXBwaW5nLnNldChmaWxlUGF0aCwgbmV3TWFwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5rZXJuZWxNYXBwaW5nLnNldChmaWxlUGF0aCwga2VybmVsKTtcbiAgICB9XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnJ1bm5pbmdLZXJuZWxzLmZpbmRJbmRleChrID0+IGsgPT09IGtlcm5lbCk7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhpcy5ydW5uaW5nS2VybmVscy5wdXNoKGtlcm5lbCk7XG4gICAgfVxuICAgIC8vIGRlbGV0ZSBzdGFydGluZ0tlcm5lbCBzaW5jZSBzdG9yZS5rZXJuZWwgbm93IGluIHBsYWNlIHRvIHByZXZlbnQgZHVwbGljYXRlIGtlcm5lbFxuICAgIHRoaXMuc3RhcnRpbmdLZXJuZWxzLmRlbGV0ZShrZXJuZWwua2VybmVsU3BlYy5kaXNwbGF5X25hbWUpO1xuICB9XG5cbiAgQGFjdGlvblxuICBkZWxldGVLZXJuZWwoa2VybmVsOiBLZXJuZWwpIHtcbiAgICB0aGlzLl9pdGVyYXRlT3Zlcktlcm5lbHMoXG4gICAgICBrZXJuZWwsXG4gICAgICAoXywgZmlsZSkgPT4ge1xuICAgICAgICB0aGlzLmtlcm5lbE1hcHBpbmcuZGVsZXRlKGZpbGUpO1xuICAgICAgfSxcbiAgICAgIChtYXAsIF8sIGdyYW1tYXIpID0+IHtcbiAgICAgICAgbWFwW2dyYW1tYXJdID0gbnVsbDtcbiAgICAgICAgZGVsZXRlIG1hcFtncmFtbWFyXTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy5ydW5uaW5nS2VybmVscy5yZW1vdmUoa2VybmVsKTtcbiAgfVxuXG4gIF9pdGVyYXRlT3Zlcktlcm5lbHMoXG4gICAga2VybmVsOiBLZXJuZWwsXG4gICAgZnVuYzogKGtlcm5lbDogS2VybmVsIHwgS2VybmVsT2JqLCBmaWxlOiBzdHJpbmcpID0+IG1peGVkLFxuICAgIGZ1bmMyOiAob2JqOiBLZXJuZWxPYmosIGZpbGU6IHN0cmluZywgZ3JhbW1hcjogc3RyaW5nKSA9PiBtaXhlZCA9IGZ1bmNcbiAgKSB7XG4gICAgdGhpcy5rZXJuZWxNYXBwaW5nLmZvckVhY2goKGtlcm5lbE9yT2JqLCBmaWxlKSA9PiB7XG4gICAgICBpZiAoa2VybmVsT3JPYmogPT09IGtlcm5lbCkge1xuICAgICAgICBmdW5jKGtlcm5lbCwgZmlsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXJuZWxPck9iaiBpbnN0YW5jZW9mIEtlcm5lbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgXy5mb3JFYWNoKGtlcm5lbE9yT2JqLCAoaywgZ3JhbW1hcikgPT4ge1xuICAgICAgICAgIGlmIChrID09PSBrZXJuZWwpIHtcbiAgICAgICAgICAgIGZ1bmMyKGtlcm5lbE9yT2JqLCBmaWxlLCBncmFtbWFyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0RmlsZXNGb3JLZXJuZWwoa2VybmVsOiBLZXJuZWwpIHtcbiAgICBjb25zdCBmaWxlcyA9IFtdO1xuICAgIHRoaXMuX2l0ZXJhdGVPdmVyS2VybmVscyhrZXJuZWwsIChfLCBmaWxlKSA9PiBmaWxlcy5wdXNoKGZpbGUpKTtcbiAgICByZXR1cm4gZmlsZXM7XG4gIH1cblxuICBAYWN0aW9uXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICB0aGlzLm1hcmtlcnMuY2xlYXIoKTtcbiAgICB0aGlzLnJ1bm5pbmdLZXJuZWxzLmZvckVhY2goa2VybmVsID0+IGtlcm5lbC5kZXN0cm95KCkpO1xuICAgIHRoaXMucnVubmluZ0tlcm5lbHMuY2xlYXIoKTtcbiAgICB0aGlzLmtlcm5lbE1hcHBpbmcuY2xlYXIoKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgdXBkYXRlRWRpdG9yKGVkaXRvcjogP2F0b20kVGV4dEVkaXRvcikge1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIHRoaXMuc2V0R3JhbW1hcihlZGl0b3IpO1xuICB9XG5cbiAgQGFjdGlvblxuICBzZXRHcmFtbWFyKGVkaXRvcjogP2F0b20kVGV4dEVkaXRvcikge1xuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICB0aGlzLmdyYW1tYXIgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBncmFtbWFyID0gZWRpdG9yLmdldEdyYW1tYXIoKTtcblxuICAgIGlmIChpc011bHRpbGFuZ3VhZ2VHcmFtbWFyKGdyYW1tYXIpKSB7XG4gICAgICBjb25zdCBlbWJlZGRlZFNjb3BlID0gZ2V0RW1iZWRkZWRTY29wZShcbiAgICAgICAgZWRpdG9yLFxuICAgICAgICBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgICAgKTtcblxuICAgICAgaWYgKGVtYmVkZGVkU2NvcGUpIHtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSBlbWJlZGRlZFNjb3BlLnJlcGxhY2UoXCIuZW1iZWRkZWRcIiwgXCJcIik7XG4gICAgICAgIGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoc2NvcGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gIH1cblxuICBAYWN0aW9uXG4gIHNldENvbmZpZ1ZhbHVlKGtleVBhdGg6IHN0cmluZywgbmV3VmFsdWU6ID9taXhlZCkge1xuICAgIGlmICghbmV3VmFsdWUpIHtcbiAgICAgIG5ld1ZhbHVlID0gYXRvbS5jb25maWcuZ2V0KGtleVBhdGgpO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ01hcHBpbmcuc2V0KGtleVBhdGgsIG5ld1ZhbHVlKTtcbiAgfVxufVxuXG5jb25zdCBzdG9yZSA9IG5ldyBTdG9yZSgpO1xuZXhwb3J0IGRlZmF1bHQgc3RvcmU7XG5cbi8vIEZvciBkZWJ1Z2dpbmdcbndpbmRvdy5oeWRyb2dlbl9zdG9yZSA9IHN0b3JlO1xuIl19