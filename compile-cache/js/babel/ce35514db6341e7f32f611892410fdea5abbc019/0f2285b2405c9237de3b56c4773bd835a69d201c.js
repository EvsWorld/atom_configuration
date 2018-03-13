Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _atom = require("atom");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _mobx = require("mobx");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _kernelPicker = require("./kernel-picker");

var _kernelPicker2 = _interopRequireDefault(_kernelPicker);

var _wsKernelPicker = require("./ws-kernel-picker");

var _wsKernelPicker2 = _interopRequireDefault(_wsKernelPicker);

var _existingKernelPicker = require("./existing-kernel-picker");

var _existingKernelPicker2 = _interopRequireDefault(_existingKernelPicker);

var _signalListView = require("./signal-list-view");

var _signalListView2 = _interopRequireDefault(_signalListView);

var _codeManager = require("./code-manager");

var codeManager = _interopRequireWildcard(_codeManager);

var _componentsInspector = require("./components/inspector");

var _componentsInspector2 = _interopRequireDefault(_componentsInspector);

var _componentsResultView = require("./components/result-view");

var _componentsResultView2 = _interopRequireDefault(_componentsResultView);

var _componentsStatusBar = require("./components/status-bar");

var _componentsStatusBar2 = _interopRequireDefault(_componentsStatusBar);

var _panesInspector = require("./panes/inspector");

var _panesInspector2 = _interopRequireDefault(_panesInspector);

var _panesWatches = require("./panes/watches");

var _panesWatches2 = _interopRequireDefault(_panesWatches);

var _panesOutputArea = require("./panes/output-area");

var _panesOutputArea2 = _interopRequireDefault(_panesOutputArea);

var _panesKernelMonitor = require("./panes/kernel-monitor");

var _panesKernelMonitor2 = _interopRequireDefault(_panesKernelMonitor);

var _commands = require("./commands");

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _storeOutput = require("./store/output");

var _storeOutput2 = _interopRequireDefault(_storeOutput);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _kernelManager = require("./kernel-manager");

var _kernelManager2 = _interopRequireDefault(_kernelManager);

var _zmqKernel = require("./zmq-kernel");

var _zmqKernel2 = _interopRequireDefault(_zmqKernel);

var _wsKernel = require("./ws-kernel");

var _wsKernel2 = _interopRequireDefault(_wsKernel);

var _autocompleteProvider = require("./autocomplete-provider");

var _autocompleteProvider2 = _interopRequireDefault(_autocompleteProvider);

var _pluginApiHydrogenProvider = require("./plugin-api/hydrogen-provider");

var _pluginApiHydrogenProvider2 = _interopRequireDefault(_pluginApiHydrogenProvider);

var _utils = require("./utils");

var _exportNotebook = require("./export-notebook");

var _exportNotebook2 = _interopRequireDefault(_exportNotebook);

var Hydrogen = {
  config: _config2["default"].schema,

  activate: function activate() {
    var _this = this;

    this.emitter = new _atom.Emitter();

    var skipLanguageMappingsChange = false;
    _store2["default"].subscriptions.add(atom.config.onDidChange("Hydrogen.languageMappings", function (_ref) {
      var newValue = _ref.newValue;
      var oldValue = _ref.oldValue;

      if (skipLanguageMappingsChange) {
        skipLanguageMappingsChange = false;
        return;
      }

      if (_store2["default"].runningKernels.length != 0) {
        skipLanguageMappingsChange = true;

        atom.config.set("Hydrogen.languageMappings", oldValue);

        atom.notifications.addError("Hydrogen", {
          description: "`languageMappings` cannot be updated while kernels are running",
          dismissable: false
        });
      }
    }));

    _store2["default"].subscriptions.add(
    // enable/disable mobx-react-devtools logging
    atom.config.onDidChange("Hydrogen.debug", function (_ref2) {
      var newValue = _ref2.newValue;
      return (0, _utils.renderDevTools)(newValue);
    }));

    _store2["default"].subscriptions.add(atom.config.observe("Hydrogen.statusBarDisable", function (newValue) {
      _store2["default"].setConfigValue("Hydrogen.statusBarDisable", Boolean(newValue));
    }));

    _store2["default"].subscriptions.add(atom.commands.add("atom-text-editor:not([mini])", {
      "hydrogen:run": function hydrogenRun() {
        return _this.run();
      },
      "hydrogen:run-all": function hydrogenRunAll() {
        return _this.runAll();
      },
      "hydrogen:run-all-above": function hydrogenRunAllAbove() {
        return _this.runAllAbove();
      },
      "hydrogen:run-and-move-down": function hydrogenRunAndMoveDown() {
        return _this.run(true);
      },
      "hydrogen:run-cell": function hydrogenRunCell() {
        return _this.runCell();
      },
      "hydrogen:run-cell-and-move-down": function hydrogenRunCellAndMoveDown() {
        return _this.runCell(true);
      },
      "hydrogen:toggle-watches": function hydrogenToggleWatches() {
        return atom.workspace.toggle(_utils.WATCHES_URI);
      },
      "hydrogen:toggle-output-area": function hydrogenToggleOutputArea() {
        return atom.workspace.toggle(_utils.OUTPUT_AREA_URI);
      },
      "hydrogen:toggle-kernel-monitor": function hydrogenToggleKernelMonitor() {
        return atom.workspace.toggle(_utils.KERNEL_MONITOR_URI);
      },
      "hydrogen:start-local-kernel": function hydrogenStartLocalKernel() {
        return _this.startZMQKernel();
      },
      "hydrogen:connect-to-remote-kernel": function hydrogenConnectToRemoteKernel() {
        return _this.connectToWSKernel();
      },
      "hydrogen:connect-to-existing-kernel": function hydrogenConnectToExistingKernel() {
        return _this.connectToExistingKernel();
      },
      "hydrogen:add-watch": function hydrogenAddWatch() {
        if (_store2["default"].kernel) {
          _store2["default"].kernel.watchesStore.addWatchFromEditor(_store2["default"].editor);
          (0, _utils.openOrShowDock)(_utils.WATCHES_URI);
        }
      },
      "hydrogen:remove-watch": function hydrogenRemoveWatch() {
        if (_store2["default"].kernel) {
          _store2["default"].kernel.watchesStore.removeWatch();
          (0, _utils.openOrShowDock)(_utils.WATCHES_URI);
        }
      },
      "hydrogen:update-kernels": function hydrogenUpdateKernels() {
        return _kernelManager2["default"].updateKernelSpecs();
      },
      "hydrogen:toggle-inspector": function hydrogenToggleInspector() {
        return (0, _commands.toggleInspector)(_store2["default"]);
      },
      "hydrogen:interrupt-kernel": function hydrogenInterruptKernel() {
        return _this.handleKernelCommand({ command: "interrupt-kernel" });
      },
      "hydrogen:restart-kernel": function hydrogenRestartKernel() {
        return _this.handleKernelCommand({ command: "restart-kernel" });
      },
      "hydrogen:restart-kernel-and-re-evaluate-bubbles": function hydrogenRestartKernelAndReEvaluateBubbles() {
        return _this.restartKernelAndReEvaluateBubbles();
      },
      "hydrogen:shutdown-kernel": function hydrogenShutdownKernel() {
        return _this.handleKernelCommand({ command: "shutdown-kernel" });
      },
      "hydrogen:toggle-bubble": function hydrogenToggleBubble() {
        return _this.toggleBubble();
      },
      "hydrogen:export-notebook": function hydrogenExportNotebook() {
        return (0, _exportNotebook2["default"])();
      }
    }));

    _store2["default"].subscriptions.add(atom.commands.add("atom-workspace", {
      "hydrogen:clear-results": function hydrogenClearResults() {
        _store2["default"].markers.clear();
        if (!_store2["default"].kernel) return;
        _store2["default"].kernel.outputStore.clear();
      }
    }));

    if (atom.inDevMode()) {
      _store2["default"].subscriptions.add(atom.commands.add("atom-workspace", {
        "hydrogen:hot-reload-package": function hydrogenHotReloadPackage() {
          return (0, _utils.hotReloadPackage)();
        }
      }));
    }

    _store2["default"].subscriptions.add(atom.workspace.observeActiveTextEditor(function (editor) {
      _store2["default"].updateEditor(editor);
    }));

    _store2["default"].subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
      var editorSubscriptions = new _atom.CompositeDisposable();
      editorSubscriptions.add(editor.onDidChangeGrammar(function () {
        _store2["default"].setGrammar(editor);
      }));

      if ((0, _utils.isMultilanguageGrammar)(editor.getGrammar())) {
        editorSubscriptions.add(editor.onDidChangeCursorPosition(_lodash2["default"].debounce(function () {
          _store2["default"].setGrammar(editor);
        }, 75)));
      }

      editorSubscriptions.add(editor.onDidDestroy(function () {
        editorSubscriptions.dispose();
      }));

      _store2["default"].subscriptions.add(editorSubscriptions);
    }));

    this.hydrogenProvider = null;

    _store2["default"].subscriptions.add(atom.workspace.addOpener(function (uri) {
      switch (uri) {
        case _utils.INSPECTOR_URI:
          return new _panesInspector2["default"](_store2["default"]);
        case _utils.WATCHES_URI:
          return new _panesWatches2["default"](_store2["default"]);
        case _utils.OUTPUT_AREA_URI:
          return new _panesOutputArea2["default"](_store2["default"]);
        case _utils.KERNEL_MONITOR_URI:
          return new _panesKernelMonitor2["default"](_store2["default"]);
      }
    }));

    _store2["default"].subscriptions.add(
    // Destroy any Panes when the package is deactivated.
    new _atom.Disposable(function () {
      atom.workspace.getPaneItems().forEach(function (item) {
        if (item instanceof _panesInspector2["default"] || item instanceof _panesWatches2["default"] || item instanceof _panesOutputArea2["default"] || item instanceof _panesKernelMonitor2["default"]) {
          item.destroy();
        }
      });
    }));

    (0, _utils.renderDevTools)(atom.config.get("Hydrogen.debug") === true);

    (0, _mobx.autorun)(function () {
      _this.emitter.emit("did-change-kernel", _store2["default"].kernel);
    });
  },

  deactivate: function deactivate() {
    _store2["default"].dispose();
  },

  provideHydrogen: function provideHydrogen() {
    if (!this.hydrogenProvider) {
      this.hydrogenProvider = new _pluginApiHydrogenProvider2["default"](this);
    }

    return this.hydrogenProvider;
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    var statusBarElement = document.createElement("div");
    statusBarElement.className = "inline-block";

    statusBar.addLeftTile({
      item: statusBarElement,
      priority: 100
    });

    var onClick = this.showKernelCommands.bind(this);

    (0, _utils.reactFactory)(_react2["default"].createElement(_componentsStatusBar2["default"], { store: _store2["default"], onClick: onClick }), statusBarElement);

    // We should return a disposable here but Atom fails while calling .destroy()
    // return new Disposable(statusBarTile.destroy);
  },

  provide: function provide() {
    if (atom.config.get("Hydrogen.autocomplete") === true) {
      return (0, _autocompleteProvider2["default"])();
    }
    return null;
  },

  showKernelCommands: function showKernelCommands() {
    var _this2 = this;

    if (!this.signalListView) {
      this.signalListView = new _signalListView2["default"]();
      this.signalListView.onConfirmed = function (kernelCommand) {
        return _this2.handleKernelCommand(kernelCommand);
      };
    }
    this.signalListView.toggle();
  },

  connectToExistingKernel: function connectToExistingKernel() {
    if (!this.existingKernelPicker) {
      this.existingKernelPicker = new _existingKernelPicker2["default"]();
    }
    this.existingKernelPicker.toggle();
  },

  handleKernelCommand: function handleKernelCommand(_ref3) {
    var command = _ref3.command;
    var payload = _ref3.payload;
    return (function () {
      (0, _utils.log)("handleKernelCommand:", arguments);

      var kernel = _store2["default"].kernel;
      var grammar = _store2["default"].grammar;

      if (!grammar) {
        atom.notifications.addError("Undefined grammar");
        return;
      }

      if (!kernel) {
        var message = "No running kernel for grammar `" + grammar.name + "` found";
        atom.notifications.addError(message);
        return;
      }

      if (command === "interrupt-kernel") {
        kernel.interrupt();
      } else if (command === "restart-kernel") {
        kernel.restart();
      } else if (command === "shutdown-kernel") {
        _store2["default"].markers.clear();
        // Note that destroy alone does not shut down a WSKernel
        kernel.shutdown();
        kernel.destroy();
      } else if (command === "rename-kernel" && kernel.promptRename) {
        // $FlowFixMe Will only be called if remote kernel
        if (kernel instanceof _wsKernel2["default"]) kernel.promptRename();
      } else if (command === "disconnect-kernel") {
        _store2["default"].markers.clear();
        kernel.destroy();
      }
    }).apply(this, arguments);
  },

  createResultBubble: function createResultBubble(editor, code, row) {
    var _this3 = this;

    var grammar = _store2["default"].grammar;
    var filePath = _store2["default"].filePath;
    var kernel = _store2["default"].kernel;

    if (!filePath || !grammar) {
      return atom.notifications.addError("Your file must be saved in order to start a kernel");
    }

    if (kernel) {
      this._createResultBubble(editor, kernel, code, row);
      return;
    }

    _kernelManager2["default"].startKernelFor(grammar, editor, filePath, function (kernel) {
      _this3._createResultBubble(editor, kernel, code, row);
    });
  },

  _createResultBubble: function _createResultBubble(editor, kernel, code, row) {
    if (atom.workspace.getActivePaneItem() instanceof _panesWatches2["default"]) {
      kernel.watchesStore.run();
      return;
    }
    var globalOutputStore = atom.config.get("Hydrogen.outputAreaDefault") || atom.workspace.getPaneItems().find(function (item) {
      return item instanceof _panesOutputArea2["default"];
    }) ? kernel.outputStore : null;

    if (globalOutputStore) (0, _utils.openOrShowDock)(_utils.OUTPUT_AREA_URI);

    var _ref4 = new _componentsResultView2["default"](_store2["default"].markers, kernel, editor, row, !globalOutputStore);

    var outputStore = _ref4.outputStore;

    kernel.execute(code, function (result) {
      outputStore.appendOutput(result);
      if (globalOutputStore) globalOutputStore.appendOutput(result);
    });
  },

  restartKernelAndReEvaluateBubbles: function restartKernelAndReEvaluateBubbles() {
    var _this4 = this;

    var editor = _store2["default"].editor;
    var kernel = _store2["default"].kernel;
    var markers = _store2["default"].markers;

    var breakpoints = [];
    markers.markers.forEach(function (bubble) {
      breakpoints.push(bubble.marker.getBufferRange().start);
    });
    _store2["default"].markers.clear();

    if (!editor || !kernel) {
      this.runAll(breakpoints);
    } else {
      kernel.restart(function () {
        return _this4.runAll(breakpoints);
      });
    }
  },

  toggleBubble: function toggleBubble() {
    var editor = _store2["default"].editor;
    var kernel = _store2["default"].kernel;
    var markers = _store2["default"].markers;

    if (!editor) return;

    var _editor$getLastSelection$getBufferRowRange = editor.getLastSelection().getBufferRowRange();

    var _editor$getLastSelection$getBufferRowRange2 = _slicedToArray(_editor$getLastSelection$getBufferRowRange, 2);

    var startRow = _editor$getLastSelection$getBufferRowRange2[0];
    var endRow = _editor$getLastSelection$getBufferRowRange2[1];

    for (var row = startRow; row <= endRow; row++) {
      var destroyed = markers.clearOnRow(row);

      if (!destroyed) {
        var _ref5 = new _componentsResultView2["default"](markers, kernel, editor, row, true);

        var outputStore = _ref5.outputStore;

        outputStore.status = "empty";
      }
    }
  },

  run: function run() {
    var moveDown = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var editor = _store2["default"].editor;
    if (!editor) return;
    var codeBlock = codeManager.findCodeBlock(editor);
    if (!codeBlock) {
      return;
    }

    var _codeBlock = _slicedToArray(codeBlock, 2);

    var code = _codeBlock[0];
    var row = _codeBlock[1];

    if (code) {
      if (moveDown === true) {
        codeManager.moveDown(editor, row);
      }
      this.createResultBubble(editor, code, row);
    }
  },

  runAll: function runAll(breakpoints) {
    var _this5 = this;

    var editor = _store2["default"].editor;
    var kernel = _store2["default"].kernel;
    var grammar = _store2["default"].grammar;
    var filePath = _store2["default"].filePath;

    if (!editor || !grammar || !filePath) return;
    if ((0, _utils.isMultilanguageGrammar)(editor.getGrammar())) {
      atom.notifications.addError('"Run All" is not supported for this file type!');
      return;
    }

    if (editor && kernel) {
      this._runAll(editor, kernel, breakpoints);
      return;
    }

    _kernelManager2["default"].startKernelFor(grammar, editor, filePath, function (kernel) {
      _this5._runAll(editor, kernel, breakpoints);
    });
  },

  _runAll: function _runAll(editor, kernel, breakpoints) {
    var _this6 = this,
        _arguments = arguments;

    var cells = codeManager.getCells(editor, breakpoints);
    _lodash2["default"].forEach(cells, function (_ref6) {
      var start = _ref6.start;
      var end = _ref6.end;
      return (function () {
        var code = codeManager.getTextInRange(editor, start, end);
        var endRow = codeManager.escapeBlankRows(editor, start.row, end.row);
        this._createResultBubble(editor, kernel, code, endRow);
      }).apply(_this6, _arguments);
    });
  },

  runAllAbove: function runAllAbove() {
    var editor = _store2["default"].editor; // to make flow happy
    if (!editor) return;
    if ((0, _utils.isMultilanguageGrammar)(editor.getGrammar())) {
      atom.notifications.addError('"Run All Above" is not supported for this file type!');
      return;
    }

    var cursor = editor.getLastCursor();
    var row = codeManager.escapeBlankRows(editor, 0, cursor.getBufferRow());
    var code = codeManager.getRows(editor, 0, row);

    if (code) {
      this.createResultBubble(editor, code, row);
    }
  },

  runCell: function runCell() {
    var moveDown = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var editor = _store2["default"].editor;
    if (!editor) return;

    var _codeManager$getCurrentCell = codeManager.getCurrentCell(editor);

    var start = _codeManager$getCurrentCell.start;
    var end = _codeManager$getCurrentCell.end;

    var code = codeManager.getTextInRange(editor, start, end);
    var endRow = codeManager.escapeBlankRows(editor, start.row, end.row);

    if (code) {
      if (moveDown === true) {
        codeManager.moveDown(editor, endRow);
      }
      this.createResultBubble(editor, code, endRow);
    }
  },

  startZMQKernel: function startZMQKernel() {
    var _this7 = this;

    _kernelManager2["default"].getAllKernelSpecsForGrammar(_store2["default"].grammar).then(function (kernelSpecs) {
      if (_this7.kernelPicker) {
        _this7.kernelPicker.kernelSpecs = kernelSpecs;
      } else {
        _this7.kernelPicker = new _kernelPicker2["default"](kernelSpecs);

        _this7.kernelPicker.onConfirmed = function (kernelSpec) {
          var editor = _store2["default"].editor;
          var grammar = _store2["default"].grammar;
          var filePath = _store2["default"].filePath;

          if (!editor || !grammar || !filePath) return;
          _store2["default"].markers.clear();

          _kernelManager2["default"].startKernel(kernelSpec, grammar, editor, filePath);
        };
      }

      _this7.kernelPicker.toggle();
    });
  },

  connectToWSKernel: function connectToWSKernel() {
    if (!this.wsKernelPicker) {
      this.wsKernelPicker = new _wsKernelPicker2["default"](function (kernel) {
        _store2["default"].markers.clear();
        var editor = _store2["default"].editor;
        var grammar = _store2["default"].grammar;
        var filePath = _store2["default"].filePath;

        if (!editor || !grammar || !filePath) return;

        if (kernel instanceof _zmqKernel2["default"]) kernel.destroy();

        _store2["default"].newKernel(kernel, filePath, editor, grammar);
      });
    }

    this.wsKernelPicker.toggle(function (kernelSpec) {
      return (0, _utils.kernelSpecProvidesGrammar)(kernelSpec, _store2["default"].grammar);
    });
  }
};

exports["default"] = Hydrogen;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFRTyxNQUFNOztzQkFFQyxRQUFROzs7O29CQUNFLE1BQU07O3FCQUNaLE9BQU87Ozs7NEJBRUEsaUJBQWlCOzs7OzhCQUNmLG9CQUFvQjs7OztvQ0FDZCwwQkFBMEI7Ozs7OEJBQ2hDLG9CQUFvQjs7OzsyQkFDbEIsZ0JBQWdCOztJQUFqQyxXQUFXOzttQ0FFRCx3QkFBd0I7Ozs7b0NBQ3ZCLDBCQUEwQjs7OzttQ0FDM0IseUJBQXlCOzs7OzhCQUVyQixtQkFBbUI7Ozs7NEJBQ3JCLGlCQUFpQjs7OzsrQkFDbEIscUJBQXFCOzs7O2tDQUNkLHdCQUF3Qjs7Ozt3QkFFdEIsWUFBWTs7cUJBRTFCLFNBQVM7Ozs7MkJBQ0gsZ0JBQWdCOzs7O3NCQUVyQixVQUFVOzs7OzZCQUNILGtCQUFrQjs7Ozt5QkFDdEIsY0FBYzs7Ozt3QkFDZixhQUFhOzs7O29DQUNELHlCQUF5Qjs7Ozt5Q0FDN0IsZ0NBQWdDOzs7O3FCQWN0RCxTQUFTOzs4QkFJVyxtQkFBbUI7Ozs7QUFFOUMsSUFBTSxRQUFRLEdBQUc7QUFDZixRQUFNLEVBQUUsb0JBQU8sTUFBTTs7QUFFckIsVUFBUSxFQUFBLG9CQUFHOzs7QUFDVCxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUM7O0FBRTdCLFFBQUksMEJBQTBCLEdBQUcsS0FBSyxDQUFDO0FBQ3ZDLHVCQUFNLGFBQWEsQ0FBQyxHQUFHLENBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUNyQiwyQkFBMkIsRUFDM0IsVUFBQyxJQUFzQixFQUFLO1VBQXpCLFFBQVEsR0FBVixJQUFzQixDQUFwQixRQUFRO1VBQUUsUUFBUSxHQUFwQixJQUFzQixDQUFWLFFBQVE7O0FBQ25CLFVBQUksMEJBQTBCLEVBQUU7QUFDOUIsa0NBQTBCLEdBQUcsS0FBSyxDQUFDO0FBQ25D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TyxDQUFDO0tBQUEsQ0FDckQsQ0FBQztHQUNIO0NBQ0YsQ0FBQzs7cUJBRWEsUUFBUSIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHtcbiAgRW1pdHRlcixcbiAgQ29tcG9zaXRlRGlzcG9zYWJsZSxcbiAgRGlzcG9zYWJsZSxcbiAgUG9pbnQsXG4gIFRleHRFZGl0b3Jcbn0gZnJvbSBcImF0b21cIjtcblxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHsgYXV0b3J1biB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCBLZXJuZWxQaWNrZXIgZnJvbSBcIi4va2VybmVsLXBpY2tlclwiO1xuaW1wb3J0IFdTS2VybmVsUGlja2VyIGZyb20gXCIuL3dzLWtlcm5lbC1waWNrZXJcIjtcbmltcG9ydCBFeGlzdGluZ0tlcm5lbFBpY2tlciBmcm9tIFwiLi9leGlzdGluZy1rZXJuZWwtcGlja2VyXCI7XG5pbXBvcnQgU2lnbmFsTGlzdFZpZXcgZnJvbSBcIi4vc2lnbmFsLWxpc3Qtdmlld1wiO1xuaW1wb3J0ICogYXMgY29kZU1hbmFnZXIgZnJvbSBcIi4vY29kZS1tYW5hZ2VyXCI7XG5cbmltcG9ydCBJbnNwZWN0b3IgZnJvbSBcIi4vY29tcG9uZW50cy9pbnNwZWN0b3JcIjtcbmltcG9ydCBSZXN1bHRWaWV3IGZyb20gXCIuL2NvbXBvbmVudHMvcmVzdWx0LXZpZXdcIjtcbmltcG9ydCBTdGF0dXNCYXIgZnJvbSBcIi4vY29tcG9uZW50cy9zdGF0dXMtYmFyXCI7XG5cbmltcG9ydCBJbnNwZWN0b3JQYW5lIGZyb20gXCIuL3BhbmVzL2luc3BlY3RvclwiO1xuaW1wb3J0IFdhdGNoZXNQYW5lIGZyb20gXCIuL3BhbmVzL3dhdGNoZXNcIjtcbmltcG9ydCBPdXRwdXRQYW5lIGZyb20gXCIuL3BhbmVzL291dHB1dC1hcmVhXCI7XG5pbXBvcnQgS2VybmVsTW9uaXRvclBhbmUgZnJvbSBcIi4vcGFuZXMva2VybmVsLW1vbml0b3JcIjtcblxuaW1wb3J0IHsgdG9nZ2xlSW5zcGVjdG9yIH0gZnJvbSBcIi4vY29tbWFuZHNcIjtcblxuaW1wb3J0IHN0b3JlIGZyb20gXCIuL3N0b3JlXCI7XG5pbXBvcnQgT3V0cHV0U3RvcmUgZnJvbSBcIi4vc3RvcmUvb3V0cHV0XCI7XG5cbmltcG9ydCBDb25maWcgZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQga2VybmVsTWFuYWdlciBmcm9tIFwiLi9rZXJuZWwtbWFuYWdlclwiO1xuaW1wb3J0IFpNUUtlcm5lbCBmcm9tIFwiLi96bXEta2VybmVsXCI7XG5pbXBvcnQgV1NLZXJuZWwgZnJvbSBcIi4vd3Mta2VybmVsXCI7XG5pbXBvcnQgQXV0b2NvbXBsZXRlUHJvdmlkZXIgZnJvbSBcIi4vYXV0b2NvbXBsZXRlLXByb3ZpZGVyXCI7XG5pbXBvcnQgSHlkcm9nZW5Qcm92aWRlciBmcm9tIFwiLi9wbHVnaW4tYXBpL2h5ZHJvZ2VuLXByb3ZpZGVyXCI7XG5cbmltcG9ydCB7XG4gIGxvZyxcbiAgcmVhY3RGYWN0b3J5LFxuICBpc011bHRpbGFuZ3VhZ2VHcmFtbWFyLFxuICByZW5kZXJEZXZUb29scyxcbiAgSU5TUEVDVE9SX1VSSSxcbiAgV0FUQ0hFU19VUkksXG4gIE9VVFBVVF9BUkVBX1VSSSxcbiAgS0VSTkVMX01PTklUT1JfVVJJLFxuICBob3RSZWxvYWRQYWNrYWdlLFxuICBvcGVuT3JTaG93RG9jayxcbiAga2VybmVsU3BlY1Byb3ZpZGVzR3JhbW1hclxufSBmcm9tIFwiLi91dGlsc1wiO1xuXG5pbXBvcnQgdHlwZSBLZXJuZWwgZnJvbSBcIi4va2VybmVsXCI7XG5cbmltcG9ydCBleHBvcnROb3RlYm9vayBmcm9tIFwiLi9leHBvcnQtbm90ZWJvb2tcIjtcblxuY29uc3QgSHlkcm9nZW4gPSB7XG4gIGNvbmZpZzogQ29uZmlnLnNjaGVtYSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXG4gICAgbGV0IHNraXBMYW5ndWFnZU1hcHBpbmdzQ2hhbmdlID0gZmFsc2U7XG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShcbiAgICAgICAgXCJIeWRyb2dlbi5sYW5ndWFnZU1hcHBpbmdzXCIsXG4gICAgICAgICh7IG5ld1ZhbHVlLCBvbGRWYWx1ZSB9KSA9PiB7XG4gICAgICAgICAgaWYgKHNraXBMYW5ndWFnZU1hcHBpbmdzQ2hhbmdlKSB7XG4gICAgICAgICAgICBza2lwTGFuZ3VhZ2VNYXBwaW5nc0NoYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzdG9yZS5ydW5uaW5nS2VybmVscy5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgc2tpcExhbmd1YWdlTWFwcGluZ3NDaGFuZ2UgPSB0cnVlO1xuXG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJIeWRyb2dlbi5sYW5ndWFnZU1hcHBpbmdzXCIsIG9sZFZhbHVlKTtcblxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiSHlkcm9nZW5cIiwge1xuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgICBcImBsYW5ndWFnZU1hcHBpbmdzYCBjYW5ub3QgYmUgdXBkYXRlZCB3aGlsZSBrZXJuZWxzIGFyZSBydW5uaW5nXCIsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgKTtcblxuICAgIHN0b3JlLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgLy8gZW5hYmxlL2Rpc2FibGUgbW9ieC1yZWFjdC1kZXZ0b29scyBsb2dnaW5nXG4gICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShcIkh5ZHJvZ2VuLmRlYnVnXCIsICh7IG5ld1ZhbHVlIH0pID0+XG4gICAgICAgIHJlbmRlckRldlRvb2xzKG5ld1ZhbHVlKVxuICAgICAgKVxuICAgICk7XG5cbiAgICBzdG9yZS5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoXCJIeWRyb2dlbi5zdGF0dXNCYXJEaXNhYmxlXCIsIG5ld1ZhbHVlID0+IHtcbiAgICAgICAgc3RvcmUuc2V0Q29uZmlnVmFsdWUoXCJIeWRyb2dlbi5zdGF0dXNCYXJEaXNhYmxlXCIsIEJvb2xlYW4obmV3VmFsdWUpKTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHN0b3JlLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoXCJhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pXCIsIHtcbiAgICAgICAgXCJoeWRyb2dlbjpydW5cIjogKCkgPT4gdGhpcy5ydW4oKSxcbiAgICAgICAgXCJoeWRyb2dlbjpydW4tYWxsXCI6ICgpID0+IHRoaXMucnVuQWxsKCksXG4gICAgICAgIFwiaHlkcm9nZW46cnVuLWFsbC1hYm92ZVwiOiAoKSA9PiB0aGlzLnJ1bkFsbEFib3ZlKCksXG4gICAgICAgIFwiaHlkcm9nZW46cnVuLWFuZC1tb3ZlLWRvd25cIjogKCkgPT4gdGhpcy5ydW4odHJ1ZSksXG4gICAgICAgIFwiaHlkcm9nZW46cnVuLWNlbGxcIjogKCkgPT4gdGhpcy5ydW5DZWxsKCksXG4gICAgICAgIFwiaHlkcm9nZW46cnVuLWNlbGwtYW5kLW1vdmUtZG93blwiOiAoKSA9PiB0aGlzLnJ1bkNlbGwodHJ1ZSksXG4gICAgICAgIFwiaHlkcm9nZW46dG9nZ2xlLXdhdGNoZXNcIjogKCkgPT4gYXRvbS53b3Jrc3BhY2UudG9nZ2xlKFdBVENIRVNfVVJJKSxcbiAgICAgICAgXCJoeWRyb2dlbjp0b2dnbGUtb3V0cHV0LWFyZWFcIjogKCkgPT5cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS50b2dnbGUoT1VUUFVUX0FSRUFfVVJJKSxcbiAgICAgICAgXCJoeWRyb2dlbjp0b2dnbGUta2VybmVsLW1vbml0b3JcIjogKCkgPT5cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS50b2dnbGUoS0VSTkVMX01PTklUT1JfVVJJKSxcbiAgICAgICAgXCJoeWRyb2dlbjpzdGFydC1sb2NhbC1rZXJuZWxcIjogKCkgPT4gdGhpcy5zdGFydFpNUUtlcm5lbCgpLFxuICAgICAgICBcImh5ZHJvZ2VuOmNvbm5lY3QtdG8tcmVtb3RlLWtlcm5lbFwiOiAoKSA9PiB0aGlzLmNvbm5lY3RUb1dTS2VybmVsKCksXG4gICAgICAgIFwiaHlkcm9nZW46Y29ubmVjdC10by1leGlzdGluZy1rZXJuZWxcIjogKCkgPT5cbiAgICAgICAgICB0aGlzLmNvbm5lY3RUb0V4aXN0aW5nS2VybmVsKCksXG4gICAgICAgIFwiaHlkcm9nZW46YWRkLXdhdGNoXCI6ICgpID0+IHtcbiAgICAgICAgICBpZiAoc3RvcmUua2VybmVsKSB7XG4gICAgICAgICAgICBzdG9yZS5rZXJuZWwud2F0Y2hlc1N0b3JlLmFkZFdhdGNoRnJvbUVkaXRvcihzdG9yZS5lZGl0b3IpO1xuICAgICAgICAgICAgb3Blbk9yU2hvd0RvY2soV0FUQ0hFU19VUkkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJoeWRyb2dlbjpyZW1vdmUtd2F0Y2hcIjogKCkgPT4ge1xuICAgICAgICAgIGlmIChzdG9yZS5rZXJuZWwpIHtcbiAgICAgICAgICAgIHN0b3JlLmtlcm5lbC53YXRjaGVzU3RvcmUucmVtb3ZlV2F0Y2goKTtcbiAgICAgICAgICAgIG9wZW5PclNob3dEb2NrKFdBVENIRVNfVVJJKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaHlkcm9nZW46dXBkYXRlLWtlcm5lbHNcIjogKCkgPT4ga2VybmVsTWFuYWdlci51cGRhdGVLZXJuZWxTcGVjcygpLFxuICAgICAgICBcImh5ZHJvZ2VuOnRvZ2dsZS1pbnNwZWN0b3JcIjogKCkgPT4gdG9nZ2xlSW5zcGVjdG9yKHN0b3JlKSxcbiAgICAgICAgXCJoeWRyb2dlbjppbnRlcnJ1cHQta2VybmVsXCI6ICgpID0+XG4gICAgICAgICAgdGhpcy5oYW5kbGVLZXJuZWxDb21tYW5kKHsgY29tbWFuZDogXCJpbnRlcnJ1cHQta2VybmVsXCIgfSksXG4gICAgICAgIFwiaHlkcm9nZW46cmVzdGFydC1rZXJuZWxcIjogKCkgPT5cbiAgICAgICAgICB0aGlzLmhhbmRsZUtlcm5lbENvbW1hbmQoeyBjb21tYW5kOiBcInJlc3RhcnQta2VybmVsXCIgfSksXG4gICAgICAgIFwiaHlkcm9nZW46cmVzdGFydC1rZXJuZWwtYW5kLXJlLWV2YWx1YXRlLWJ1YmJsZXNcIjogKCkgPT5cbiAgICAgICAgICB0aGlzLnJlc3RhcnRLZXJuZWxBbmRSZUV2YWx1YXRlQnViYmxlcygpLFxuICAgICAgICBcImh5ZHJvZ2VuOnNodXRkb3duLWtlcm5lbFwiOiAoKSA9PlxuICAgICAgICAgIHRoaXMuaGFuZGxlS2VybmVsQ29tbWFuZCh7IGNvbW1hbmQ6IFwic2h1dGRvd24ta2VybmVsXCIgfSksXG4gICAgICAgIFwiaHlkcm9nZW46dG9nZ2xlLWJ1YmJsZVwiOiAoKSA9PiB0aGlzLnRvZ2dsZUJ1YmJsZSgpLFxuICAgICAgICBcImh5ZHJvZ2VuOmV4cG9ydC1ub3RlYm9va1wiOiAoKSA9PiBleHBvcnROb3RlYm9vaygpXG4gICAgICB9KVxuICAgICk7XG5cbiAgICBzdG9yZS5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKFwiYXRvbS13b3Jrc3BhY2VcIiwge1xuICAgICAgICBcImh5ZHJvZ2VuOmNsZWFyLXJlc3VsdHNcIjogKCkgPT4ge1xuICAgICAgICAgIHN0b3JlLm1hcmtlcnMuY2xlYXIoKTtcbiAgICAgICAgICBpZiAoIXN0b3JlLmtlcm5lbCkgcmV0dXJuO1xuICAgICAgICAgIHN0b3JlLmtlcm5lbC5vdXRwdXRTdG9yZS5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgICBpZiAoYXRvbS5pbkRldk1vZGUoKSkge1xuICAgICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkKFwiYXRvbS13b3Jrc3BhY2VcIiwge1xuICAgICAgICAgIFwiaHlkcm9nZW46aG90LXJlbG9hZC1wYWNrYWdlXCI6ICgpID0+IGhvdFJlbG9hZFBhY2thZ2UoKVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBzdG9yZS5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVUZXh0RWRpdG9yKGVkaXRvciA9PiB7XG4gICAgICAgIHN0b3JlLnVwZGF0ZUVkaXRvcihlZGl0b3IpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoZWRpdG9yID0+IHtcbiAgICAgICAgY29uc3QgZWRpdG9yU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgICAgIGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICAgIGVkaXRvci5vbkRpZENoYW5nZUdyYW1tYXIoKCkgPT4ge1xuICAgICAgICAgICAgc3RvcmUuc2V0R3JhbW1hcihlZGl0b3IpO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGlzTXVsdGlsYW5ndWFnZUdyYW1tYXIoZWRpdG9yLmdldEdyYW1tYXIoKSkpIHtcbiAgICAgICAgICBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgICAgIGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKFxuICAgICAgICAgICAgICBfLmRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBzdG9yZS5zZXRHcmFtbWFyKGVkaXRvcik7XG4gICAgICAgICAgICAgIH0sIDc1KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgICBlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgICAgIGVkaXRvclN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yU3Vic2NyaXB0aW9ucyk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLmh5ZHJvZ2VuUHJvdmlkZXIgPSBudWxsO1xuXG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIodXJpID0+IHtcbiAgICAgICAgc3dpdGNoICh1cmkpIHtcbiAgICAgICAgICBjYXNlIElOU1BFQ1RPUl9VUkk6XG4gICAgICAgICAgICByZXR1cm4gbmV3IEluc3BlY3RvclBhbmUoc3RvcmUpO1xuICAgICAgICAgIGNhc2UgV0FUQ0hFU19VUkk6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFdhdGNoZXNQYW5lKHN0b3JlKTtcbiAgICAgICAgICBjYXNlIE9VVFBVVF9BUkVBX1VSSTpcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3V0cHV0UGFuZShzdG9yZSk7XG4gICAgICAgICAgY2FzZSBLRVJORUxfTU9OSVRPUl9VUkk6XG4gICAgICAgICAgICByZXR1cm4gbmV3IEtlcm5lbE1vbml0b3JQYW5lKHN0b3JlKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAvLyBEZXN0cm95IGFueSBQYW5lcyB3aGVuIHRoZSBwYWNrYWdlIGlzIGRlYWN0aXZhdGVkLlxuICAgICAgbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGl0ZW0gaW5zdGFuY2VvZiBJbnNwZWN0b3JQYW5lIHx8XG4gICAgICAgICAgICBpdGVtIGluc3RhbmNlb2YgV2F0Y2hlc1BhbmUgfHxcbiAgICAgICAgICAgIGl0ZW0gaW5zdGFuY2VvZiBPdXRwdXRQYW5lIHx8XG4gICAgICAgICAgICBpdGVtIGluc3RhbmNlb2YgS2VybmVsTW9uaXRvclBhbmVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGl0ZW0uZGVzdHJveSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICByZW5kZXJEZXZUb29scyhhdG9tLmNvbmZpZy5nZXQoXCJIeWRyb2dlbi5kZWJ1Z1wiKSA9PT0gdHJ1ZSk7XG5cbiAgICBhdXRvcnVuKCgpID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KFwiZGlkLWNoYW5nZS1rZXJuZWxcIiwgc3RvcmUua2VybmVsKTtcbiAgICB9KTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHN0b3JlLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBwcm92aWRlSHlkcm9nZW4oKSB7XG4gICAgaWYgKCF0aGlzLmh5ZHJvZ2VuUHJvdmlkZXIpIHtcbiAgICAgIHRoaXMuaHlkcm9nZW5Qcm92aWRlciA9IG5ldyBIeWRyb2dlblByb3ZpZGVyKHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmh5ZHJvZ2VuUHJvdmlkZXI7XG4gIH0sXG5cbiAgY29uc3VtZVN0YXR1c0JhcihzdGF0dXNCYXI6IGF0b20kU3RhdHVzQmFyKSB7XG4gICAgY29uc3Qgc3RhdHVzQmFyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgc3RhdHVzQmFyRWxlbWVudC5jbGFzc05hbWUgPSBcImlubGluZS1ibG9ja1wiO1xuXG4gICAgc3RhdHVzQmFyLmFkZExlZnRUaWxlKHtcbiAgICAgIGl0ZW06IHN0YXR1c0JhckVsZW1lbnQsXG4gICAgICBwcmlvcml0eTogMTAwXG4gICAgfSk7XG5cbiAgICBjb25zdCBvbkNsaWNrID0gdGhpcy5zaG93S2VybmVsQ29tbWFuZHMuYmluZCh0aGlzKTtcblxuICAgIHJlYWN0RmFjdG9yeShcbiAgICAgIDxTdGF0dXNCYXIgc3RvcmU9e3N0b3JlfSBvbkNsaWNrPXtvbkNsaWNrfSAvPixcbiAgICAgIHN0YXR1c0JhckVsZW1lbnRcbiAgICApO1xuXG4gICAgLy8gV2Ugc2hvdWxkIHJldHVybiBhIGRpc3Bvc2FibGUgaGVyZSBidXQgQXRvbSBmYWlscyB3aGlsZSBjYWxsaW5nIC5kZXN0cm95KClcbiAgICAvLyByZXR1cm4gbmV3IERpc3Bvc2FibGUoc3RhdHVzQmFyVGlsZS5kZXN0cm95KTtcbiAgfSxcblxuICBwcm92aWRlKCkge1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoXCJIeWRyb2dlbi5hdXRvY29tcGxldGVcIikgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBBdXRvY29tcGxldGVQcm92aWRlcigpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICBzaG93S2VybmVsQ29tbWFuZHMoKSB7XG4gICAgaWYgKCF0aGlzLnNpZ25hbExpc3RWaWV3KSB7XG4gICAgICB0aGlzLnNpZ25hbExpc3RWaWV3ID0gbmV3IFNpZ25hbExpc3RWaWV3KCk7XG4gICAgICB0aGlzLnNpZ25hbExpc3RWaWV3Lm9uQ29uZmlybWVkID0gKGtlcm5lbENvbW1hbmQ6IHsgY29tbWFuZDogc3RyaW5nIH0pID0+XG4gICAgICAgIHRoaXMuaGFuZGxlS2VybmVsQ29tbWFuZChrZXJuZWxDb21tYW5kKTtcbiAgICB9XG4gICAgdGhpcy5zaWduYWxMaXN0Vmlldy50b2dnbGUoKTtcbiAgfSxcblxuICBjb25uZWN0VG9FeGlzdGluZ0tlcm5lbCgpIHtcbiAgICBpZiAoIXRoaXMuZXhpc3RpbmdLZXJuZWxQaWNrZXIpIHtcbiAgICAgIHRoaXMuZXhpc3RpbmdLZXJuZWxQaWNrZXIgPSBuZXcgRXhpc3RpbmdLZXJuZWxQaWNrZXIoKTtcbiAgICB9XG4gICAgdGhpcy5leGlzdGluZ0tlcm5lbFBpY2tlci50b2dnbGUoKTtcbiAgfSxcblxuICBoYW5kbGVLZXJuZWxDb21tYW5kKHtcbiAgICBjb21tYW5kLFxuICAgIHBheWxvYWRcbiAgfToge1xuICAgIGNvbW1hbmQ6IHN0cmluZyxcbiAgICBwYXlsb2FkOiA/S2VybmVsc3BlY1xuICB9KSB7XG4gICAgbG9nKFwiaGFuZGxlS2VybmVsQ29tbWFuZDpcIiwgYXJndW1lbnRzKTtcblxuICAgIGNvbnN0IHsga2VybmVsLCBncmFtbWFyIH0gPSBzdG9yZTtcblxuICAgIGlmICghZ3JhbW1hcikge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiVW5kZWZpbmVkIGdyYW1tYXJcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFrZXJuZWwpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgTm8gcnVubmluZyBrZXJuZWwgZm9yIGdyYW1tYXIgXFxgJHtncmFtbWFyLm5hbWV9XFxgIGZvdW5kYDtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihtZXNzYWdlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gXCJpbnRlcnJ1cHQta2VybmVsXCIpIHtcbiAgICAgIGtlcm5lbC5pbnRlcnJ1cHQoKTtcbiAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09IFwicmVzdGFydC1rZXJuZWxcIikge1xuICAgICAga2VybmVsLnJlc3RhcnQoKTtcbiAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09IFwic2h1dGRvd24ta2VybmVsXCIpIHtcbiAgICAgIHN0b3JlLm1hcmtlcnMuY2xlYXIoKTtcbiAgICAgIC8vIE5vdGUgdGhhdCBkZXN0cm95IGFsb25lIGRvZXMgbm90IHNodXQgZG93biBhIFdTS2VybmVsXG4gICAgICBrZXJuZWwuc2h1dGRvd24oKTtcbiAgICAgIGtlcm5lbC5kZXN0cm95KCk7XG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSBcInJlbmFtZS1rZXJuZWxcIiAmJiBrZXJuZWwucHJvbXB0UmVuYW1lKSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lIFdpbGwgb25seSBiZSBjYWxsZWQgaWYgcmVtb3RlIGtlcm5lbFxuICAgICAgaWYgKGtlcm5lbCBpbnN0YW5jZW9mIFdTS2VybmVsKSBrZXJuZWwucHJvbXB0UmVuYW1lKCk7XG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSBcImRpc2Nvbm5lY3Qta2VybmVsXCIpIHtcbiAgICAgIHN0b3JlLm1hcmtlcnMuY2xlYXIoKTtcbiAgICAgIGtlcm5lbC5kZXN0cm95KCk7XG4gICAgfVxuICB9LFxuXG4gIGNyZWF0ZVJlc3VsdEJ1YmJsZShlZGl0b3I6IGF0b20kVGV4dEVkaXRvciwgY29kZTogc3RyaW5nLCByb3c6IG51bWJlcikge1xuICAgIGNvbnN0IHsgZ3JhbW1hciwgZmlsZVBhdGgsIGtlcm5lbCB9ID0gc3RvcmU7XG5cbiAgICBpZiAoIWZpbGVQYXRoIHx8ICFncmFtbWFyKSB7XG4gICAgICByZXR1cm4gYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgICBcIllvdXIgZmlsZSBtdXN0IGJlIHNhdmVkIGluIG9yZGVyIHRvIHN0YXJ0IGEga2VybmVsXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGtlcm5lbCkge1xuICAgICAgdGhpcy5fY3JlYXRlUmVzdWx0QnViYmxlKGVkaXRvciwga2VybmVsLCBjb2RlLCByb3cpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGtlcm5lbE1hbmFnZXIuc3RhcnRLZXJuZWxGb3IoXG4gICAgICBncmFtbWFyLFxuICAgICAgZWRpdG9yLFxuICAgICAgZmlsZVBhdGgsXG4gICAgICAoa2VybmVsOiBaTVFLZXJuZWwpID0+IHtcbiAgICAgICAgdGhpcy5fY3JlYXRlUmVzdWx0QnViYmxlKGVkaXRvciwga2VybmVsLCBjb2RlLCByb3cpO1xuICAgICAgfVxuICAgICk7XG4gIH0sXG5cbiAgX2NyZWF0ZVJlc3VsdEJ1YmJsZShcbiAgICBlZGl0b3I6IGF0b20kVGV4dEVkaXRvcixcbiAgICBrZXJuZWw6IEtlcm5lbCxcbiAgICBjb2RlOiBzdHJpbmcsXG4gICAgcm93OiBudW1iZXJcbiAgKSB7XG4gICAgaWYgKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkgaW5zdGFuY2VvZiBXYXRjaGVzUGFuZSkge1xuICAgICAga2VybmVsLndhdGNoZXNTdG9yZS5ydW4oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZ2xvYmFsT3V0cHV0U3RvcmUgPVxuICAgICAgYXRvbS5jb25maWcuZ2V0KFwiSHlkcm9nZW4ub3V0cHV0QXJlYURlZmF1bHRcIikgfHxcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpLmZpbmQoaXRlbSA9PiBpdGVtIGluc3RhbmNlb2YgT3V0cHV0UGFuZSlcbiAgICAgICAgPyBrZXJuZWwub3V0cHV0U3RvcmVcbiAgICAgICAgOiBudWxsO1xuXG4gICAgaWYgKGdsb2JhbE91dHB1dFN0b3JlKSBvcGVuT3JTaG93RG9jayhPVVRQVVRfQVJFQV9VUkkpO1xuXG4gICAgY29uc3QgeyBvdXRwdXRTdG9yZSB9ID0gbmV3IFJlc3VsdFZpZXcoXG4gICAgICBzdG9yZS5tYXJrZXJzLFxuICAgICAga2VybmVsLFxuICAgICAgZWRpdG9yLFxuICAgICAgcm93LFxuICAgICAgIWdsb2JhbE91dHB1dFN0b3JlXG4gICAgKTtcblxuICAgIGtlcm5lbC5leGVjdXRlKGNvZGUsIHJlc3VsdCA9PiB7XG4gICAgICBvdXRwdXRTdG9yZS5hcHBlbmRPdXRwdXQocmVzdWx0KTtcbiAgICAgIGlmIChnbG9iYWxPdXRwdXRTdG9yZSkgZ2xvYmFsT3V0cHV0U3RvcmUuYXBwZW5kT3V0cHV0KHJlc3VsdCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgcmVzdGFydEtlcm5lbEFuZFJlRXZhbHVhdGVCdWJibGVzKCkge1xuICAgIGNvbnN0IHsgZWRpdG9yLCBrZXJuZWwsIG1hcmtlcnMgfSA9IHN0b3JlO1xuXG4gICAgbGV0IGJyZWFrcG9pbnRzID0gW107XG4gICAgbWFya2Vycy5tYXJrZXJzLmZvckVhY2goKGJ1YmJsZTogUmVzdWx0VmlldykgPT4ge1xuICAgICAgYnJlYWtwb2ludHMucHVzaChidWJibGUubWFya2VyLmdldEJ1ZmZlclJhbmdlKCkuc3RhcnQpO1xuICAgIH0pO1xuICAgIHN0b3JlLm1hcmtlcnMuY2xlYXIoKTtcblxuICAgIGlmICghZWRpdG9yIHx8ICFrZXJuZWwpIHtcbiAgICAgIHRoaXMucnVuQWxsKGJyZWFrcG9pbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAga2VybmVsLnJlc3RhcnQoKCkgPT4gdGhpcy5ydW5BbGwoYnJlYWtwb2ludHMpKTtcbiAgICB9XG4gIH0sXG5cbiAgdG9nZ2xlQnViYmxlKCkge1xuICAgIGNvbnN0IHsgZWRpdG9yLCBrZXJuZWwsIG1hcmtlcnMgfSA9IHN0b3JlO1xuICAgIGlmICghZWRpdG9yKSByZXR1cm47XG4gICAgY29uc3QgW3N0YXJ0Um93LCBlbmRSb3ddID0gZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5nZXRCdWZmZXJSb3dSYW5nZSgpO1xuXG4gICAgZm9yIChsZXQgcm93ID0gc3RhcnRSb3c7IHJvdyA8PSBlbmRSb3c7IHJvdysrKSB7XG4gICAgICBjb25zdCBkZXN0cm95ZWQgPSBtYXJrZXJzLmNsZWFyT25Sb3cocm93KTtcblxuICAgICAgaWYgKCFkZXN0cm95ZWQpIHtcbiAgICAgICAgY29uc3QgeyBvdXRwdXRTdG9yZSB9ID0gbmV3IFJlc3VsdFZpZXcoXG4gICAgICAgICAgbWFya2VycyxcbiAgICAgICAgICBrZXJuZWwsXG4gICAgICAgICAgZWRpdG9yLFxuICAgICAgICAgIHJvdyxcbiAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgICAgIG91dHB1dFN0b3JlLnN0YXR1cyA9IFwiZW1wdHlcIjtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcnVuKG1vdmVEb3duOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBzdG9yZS5lZGl0b3I7XG4gICAgaWYgKCFlZGl0b3IpIHJldHVybjtcbiAgICBjb25zdCBjb2RlQmxvY2sgPSBjb2RlTWFuYWdlci5maW5kQ29kZUJsb2NrKGVkaXRvcik7XG4gICAgaWYgKCFjb2RlQmxvY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBbY29kZSwgcm93XSA9IGNvZGVCbG9jaztcbiAgICBpZiAoY29kZSkge1xuICAgICAgaWYgKG1vdmVEb3duID09PSB0cnVlKSB7XG4gICAgICAgIGNvZGVNYW5hZ2VyLm1vdmVEb3duKGVkaXRvciwgcm93KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY3JlYXRlUmVzdWx0QnViYmxlKGVkaXRvciwgY29kZSwgcm93KTtcbiAgICB9XG4gIH0sXG5cbiAgcnVuQWxsKGJyZWFrcG9pbnRzOiA/QXJyYXk8YXRvbSRQb2ludD4pIHtcbiAgICBjb25zdCB7IGVkaXRvciwga2VybmVsLCBncmFtbWFyLCBmaWxlUGF0aCB9ID0gc3RvcmU7XG4gICAgaWYgKCFlZGl0b3IgfHwgIWdyYW1tYXIgfHwgIWZpbGVQYXRoKSByZXR1cm47XG4gICAgaWYgKGlzTXVsdGlsYW5ndWFnZUdyYW1tYXIoZWRpdG9yLmdldEdyYW1tYXIoKSkpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgJ1wiUnVuIEFsbFwiIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHRoaXMgZmlsZSB0eXBlISdcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVkaXRvciAmJiBrZXJuZWwpIHtcbiAgICAgIHRoaXMuX3J1bkFsbChlZGl0b3IsIGtlcm5lbCwgYnJlYWtwb2ludHMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGtlcm5lbE1hbmFnZXIuc3RhcnRLZXJuZWxGb3IoXG4gICAgICBncmFtbWFyLFxuICAgICAgZWRpdG9yLFxuICAgICAgZmlsZVBhdGgsXG4gICAgICAoa2VybmVsOiBaTVFLZXJuZWwpID0+IHtcbiAgICAgICAgdGhpcy5fcnVuQWxsKGVkaXRvciwga2VybmVsLCBicmVha3BvaW50cyk7XG4gICAgICB9XG4gICAgKTtcbiAgfSxcblxuICBfcnVuQWxsKFxuICAgIGVkaXRvcjogYXRvbSRUZXh0RWRpdG9yLFxuICAgIGtlcm5lbDogS2VybmVsLFxuICAgIGJyZWFrcG9pbnRzPzogQXJyYXk8YXRvbSRQb2ludD5cbiAgKSB7XG4gICAgbGV0IGNlbGxzID0gY29kZU1hbmFnZXIuZ2V0Q2VsbHMoZWRpdG9yLCBicmVha3BvaW50cyk7XG4gICAgXy5mb3JFYWNoKFxuICAgICAgY2VsbHMsXG4gICAgICAoeyBzdGFydCwgZW5kIH06IHsgc3RhcnQ6IGF0b20kUG9pbnQsIGVuZDogYXRvbSRQb2ludCB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBjb2RlTWFuYWdlci5nZXRUZXh0SW5SYW5nZShlZGl0b3IsIHN0YXJ0LCBlbmQpO1xuICAgICAgICBjb25zdCBlbmRSb3cgPSBjb2RlTWFuYWdlci5lc2NhcGVCbGFua1Jvd3MoZWRpdG9yLCBzdGFydC5yb3csIGVuZC5yb3cpO1xuICAgICAgICB0aGlzLl9jcmVhdGVSZXN1bHRCdWJibGUoZWRpdG9yLCBrZXJuZWwsIGNvZGUsIGVuZFJvdyk7XG4gICAgICB9XG4gICAgKTtcbiAgfSxcblxuICBydW5BbGxBYm92ZSgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBzdG9yZS5lZGl0b3I7IC8vIHRvIG1ha2UgZmxvdyBoYXBweVxuICAgIGlmICghZWRpdG9yKSByZXR1cm47XG4gICAgaWYgKGlzTXVsdGlsYW5ndWFnZUdyYW1tYXIoZWRpdG9yLmdldEdyYW1tYXIoKSkpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgJ1wiUnVuIEFsbCBBYm92ZVwiIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHRoaXMgZmlsZSB0eXBlISdcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKTtcbiAgICBjb25zdCByb3cgPSBjb2RlTWFuYWdlci5lc2NhcGVCbGFua1Jvd3MoZWRpdG9yLCAwLCBjdXJzb3IuZ2V0QnVmZmVyUm93KCkpO1xuICAgIGNvbnN0IGNvZGUgPSBjb2RlTWFuYWdlci5nZXRSb3dzKGVkaXRvciwgMCwgcm93KTtcblxuICAgIGlmIChjb2RlKSB7XG4gICAgICB0aGlzLmNyZWF0ZVJlc3VsdEJ1YmJsZShlZGl0b3IsIGNvZGUsIHJvdyk7XG4gICAgfVxuICB9LFxuXG4gIHJ1bkNlbGwobW92ZURvd246IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGNvbnN0IGVkaXRvciA9IHN0b3JlLmVkaXRvcjtcbiAgICBpZiAoIWVkaXRvcikgcmV0dXJuO1xuICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gY29kZU1hbmFnZXIuZ2V0Q3VycmVudENlbGwoZWRpdG9yKTtcbiAgICBjb25zdCBjb2RlID0gY29kZU1hbmFnZXIuZ2V0VGV4dEluUmFuZ2UoZWRpdG9yLCBzdGFydCwgZW5kKTtcbiAgICBjb25zdCBlbmRSb3cgPSBjb2RlTWFuYWdlci5lc2NhcGVCbGFua1Jvd3MoZWRpdG9yLCBzdGFydC5yb3csIGVuZC5yb3cpO1xuXG4gICAgaWYgKGNvZGUpIHtcbiAgICAgIGlmIChtb3ZlRG93biA9PT0gdHJ1ZSkge1xuICAgICAgICBjb2RlTWFuYWdlci5tb3ZlRG93bihlZGl0b3IsIGVuZFJvdyk7XG4gICAgICB9XG4gICAgICB0aGlzLmNyZWF0ZVJlc3VsdEJ1YmJsZShlZGl0b3IsIGNvZGUsIGVuZFJvdyk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0Wk1RS2VybmVsKCkge1xuICAgIGtlcm5lbE1hbmFnZXJcbiAgICAgIC5nZXRBbGxLZXJuZWxTcGVjc0ZvckdyYW1tYXIoc3RvcmUuZ3JhbW1hcilcbiAgICAgIC50aGVuKGtlcm5lbFNwZWNzID0+IHtcbiAgICAgICAgaWYgKHRoaXMua2VybmVsUGlja2VyKSB7XG4gICAgICAgICAgdGhpcy5rZXJuZWxQaWNrZXIua2VybmVsU3BlY3MgPSBrZXJuZWxTcGVjcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmtlcm5lbFBpY2tlciA9IG5ldyBLZXJuZWxQaWNrZXIoa2VybmVsU3BlY3MpO1xuXG4gICAgICAgICAgdGhpcy5rZXJuZWxQaWNrZXIub25Db25maXJtZWQgPSAoa2VybmVsU3BlYzogS2VybmVsc3BlYykgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBlZGl0b3IsIGdyYW1tYXIsIGZpbGVQYXRoIH0gPSBzdG9yZTtcbiAgICAgICAgICAgIGlmICghZWRpdG9yIHx8ICFncmFtbWFyIHx8ICFmaWxlUGF0aCkgcmV0dXJuO1xuICAgICAgICAgICAgc3RvcmUubWFya2Vycy5jbGVhcigpO1xuXG4gICAgICAgICAgICBrZXJuZWxNYW5hZ2VyLnN0YXJ0S2VybmVsKGtlcm5lbFNwZWMsIGdyYW1tYXIsIGVkaXRvciwgZmlsZVBhdGgpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmtlcm5lbFBpY2tlci50b2dnbGUoKTtcbiAgICAgIH0pO1xuICB9LFxuXG4gIGNvbm5lY3RUb1dTS2VybmVsKCkge1xuICAgIGlmICghdGhpcy53c0tlcm5lbFBpY2tlcikge1xuICAgICAgdGhpcy53c0tlcm5lbFBpY2tlciA9IG5ldyBXU0tlcm5lbFBpY2tlcigoa2VybmVsOiBLZXJuZWwpID0+IHtcbiAgICAgICAgc3RvcmUubWFya2Vycy5jbGVhcigpO1xuICAgICAgICBjb25zdCB7IGVkaXRvciwgZ3JhbW1hciwgZmlsZVBhdGggfSA9IHN0b3JlO1xuICAgICAgICBpZiAoIWVkaXRvciB8fCAhZ3JhbW1hciB8fCAhZmlsZVBhdGgpIHJldHVybjtcblxuICAgICAgICBpZiAoa2VybmVsIGluc3RhbmNlb2YgWk1RS2VybmVsKSBrZXJuZWwuZGVzdHJveSgpO1xuXG4gICAgICAgIHN0b3JlLm5ld0tlcm5lbChrZXJuZWwsIGZpbGVQYXRoLCBlZGl0b3IsIGdyYW1tYXIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy53c0tlcm5lbFBpY2tlci50b2dnbGUoKGtlcm5lbFNwZWM6IEtlcm5lbHNwZWMpID0+XG4gICAgICBrZXJuZWxTcGVjUHJvdmlkZXNHcmFtbWFyKGtlcm5lbFNwZWMsIHN0b3JlLmdyYW1tYXIpXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgSHlkcm9nZW47XG4iXX0=