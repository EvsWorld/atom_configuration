Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _atom = require("atom");

var _mobx = require("mobx");

var _lodash = require("lodash");

var _utils = require("./utils");

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _storeWatches = require("./store/watches");

var _storeWatches2 = _interopRequireDefault(_storeWatches);

var _storeOutput = require("./store/output");

var _storeOutput2 = _interopRequireDefault(_storeOutput);

var _pluginApiHydrogenKernel = require("./plugin-api/hydrogen-kernel");

var _pluginApiHydrogenKernel2 = _interopRequireDefault(_pluginApiHydrogenKernel);

var Kernel = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(Kernel, [{
    key: "executionState",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return "loading";
    },
    enumerable: true
  }, {
    key: "inspector",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return { bundle: {} };
    },
    enumerable: true
  }], null, _instanceInitializers);

  function Kernel(kernelSpec, grammar) {
    _classCallCheck(this, Kernel);

    _defineDecoratedPropertyDescriptor(this, "executionState", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "inspector", _instanceInitializers);

    this.outputStore = new _storeOutput2["default"]();
    this.watchCallbacks = [];
    this.emitter = new _atom.Emitter();
    this.pluginWrapper = null;

    this.kernelSpec = kernelSpec;
    this.grammar = grammar;

    this.language = kernelSpec.language.toLowerCase();
    this.displayName = kernelSpec.display_name;

    this.watchesStore = new _storeWatches2["default"](this);
  }

  _createDecoratedClass(Kernel, [{
    key: "setExecutionState",
    decorators: [_mobx.action],
    value: function setExecutionState(state) {
      this.executionState = state;
    }
  }, {
    key: "setInspectorResult",
    decorators: [_mobx.action],
    value: _asyncToGenerator(function* (bundle, editor) {
      if ((0, _lodash.isEqual)(this.inspector.bundle, bundle)) {
        yield atom.workspace.toggle(_utils.INSPECTOR_URI);
      } else if (bundle.size !== 0) {
        this.inspector.bundle = bundle;
        yield atom.workspace.open(_utils.INSPECTOR_URI, { searchAllPanes: true });
      }
      (0, _utils.focus)(editor);
    })
  }, {
    key: "getPluginWrapper",
    value: function getPluginWrapper() {
      if (!this.pluginWrapper) {
        this.pluginWrapper = new _pluginApiHydrogenKernel2["default"](this);
      }

      return this.pluginWrapper;
    }
  }, {
    key: "addWatchCallback",
    value: function addWatchCallback(watchCallback) {
      this.watchCallbacks.push(watchCallback);
    }
  }, {
    key: "_callWatchCallbacks",
    value: function _callWatchCallbacks() {
      this.watchCallbacks.forEach(function (watchCallback) {
        return watchCallback();
      });
    }
  }, {
    key: "interrupt",
    value: function interrupt() {
      throw new Error("Kernel: interrupt method not implemented");
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      throw new Error("Kernel: shutdown method not implemented");
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      throw new Error("Kernel: restart method not implemented");
    }
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      throw new Error("Kernel: execute method not implemented");
    }
  }, {
    key: "executeWatch",
    value: function executeWatch(code, onResults) {
      throw new Error("Kernel: executeWatch method not implemented");
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      throw new Error("Kernel: complete method not implemented");
    }
  }, {
    key: "inspect",
    value: function inspect(code, curorPos, onResults) {
      throw new Error("Kernel: inspect method not implemented");
    }
  }, {
    key: "_parseIOMessage",
    value: function _parseIOMessage(message) {
      var result = this._parseExecuteInputIOMessage(message);

      if (!result) {
        result = (0, _utils.msgSpecToNotebookFormat)((0, _utils.msgSpecV4toV5)(message));
      }

      return result;
    }
  }, {
    key: "_parseExecuteInputIOMessage",
    value: function _parseExecuteInputIOMessage(message) {
      if (message.header.msg_type === "execute_input") {
        return {
          data: message.content.execution_count,
          stream: "execution_count"
        };
      }

      return null;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _utils.log)("Kernel: Destroying base kernel");
      _store2["default"].deleteKernel(this);
      if (this.pluginWrapper) {
        this.pluginWrapper.destroyed = true;
      }
      this.emitter.emit("did-destroy");
      this.emitter.dispose();
    }
  }], null, _instanceInitializers);

  return Kernel;
})();

exports["default"] = Kernel;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2tlcm5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFd0IsTUFBTTs7b0JBQ0ssTUFBTTs7c0JBQ2pCLFFBQVE7O3FCQVF6QixTQUFTOztxQkFDRSxTQUFTOzs7OzRCQUVGLGlCQUFpQjs7OzsyQkFDbEIsZ0JBQWdCOzs7O3VDQUNiLDhCQUE4Qjs7OztJQUVwQyxNQUFNOzs7O3dCQUFOLE1BQU07Ozs7YUFDSSxTQUFTOzs7Ozs7O2FBQ2QsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFOzs7OztBQVkzQixXQWRRLE1BQU0sQ0FjYixVQUFzQixFQUFFLE9BQXFCLEVBQUU7MEJBZHhDLE1BQU07Ozs7OztTQUd6QixXQUFXLEdBQUcsOEJBQWlCO1NBTy9CLGNBQWMsR0FBb0IsRUFBRTtTQUNwQyxPQUFPLEdBQUcsbUJBQWE7U0FDdkIsYUFBYSxHQUEwQixJQUFJOztBQUd6QyxRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ2xELFFBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQzs7QUFFM0MsUUFBSSxDQUFDLFlBQVksR0FBRyw4QkFBaUIsSUFBSSxDQUFDLENBQUM7R0FDNUM7O3dCQXRCa0IsTUFBTTs7O1dBeUJSLDJCQUFDLEtBQWEsRUFBRTtBQUMvQixVQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztLQUM3Qjs7Ozs2QkFHdUIsV0FBQyxNQUFjLEVBQUUsTUFBd0IsRUFBRTtBQUNqRSxVQUFJLHFCQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFO0FBQzFDLGNBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLHNCQUFlLENBQUM7T0FDNUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO0FBQzVCLFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUMvQixjQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSx1QkFBZ0IsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztPQUNwRTtBQUNELHdCQUFNLE1BQU0sQ0FBQyxDQUFDO0tBQ2Y7OztXQUVlLDRCQUFHO0FBQ2pCLFVBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxhQUFhLEdBQUcseUNBQW1CLElBQUksQ0FBQyxDQUFDO09BQy9DOztBQUVELGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztLQUMzQjs7O1dBRWUsMEJBQUMsYUFBdUIsRUFBRTtBQUN4QyxVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUN6Qzs7O1dBRWtCLCtCQUFHO0FBQ3BCLFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQUEsYUFBYTtlQUFJLGFBQWEsRUFBRTtPQUFBLENBQUMsQ0FBQztLQUMvRDs7O1dBRVEscUJBQUc7QUFDVixZQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7S0FDN0Q7OztXQUVPLG9CQUFHO0FBQ1QsWUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0tBQzVEOzs7V0FFTSxpQkFBQyxXQUFzQixFQUFFO0FBQzlCLFlBQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztLQUMzRDs7O1dBRU0saUJBQUMsSUFBWSxFQUFFLFNBQW1CLEVBQUU7QUFDekMsWUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0tBQzNEOzs7V0FFVyxzQkFBQyxJQUFZLEVBQUUsU0FBbUIsRUFBRTtBQUM5QyxZQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7S0FDaEU7OztXQUVPLGtCQUFDLElBQVksRUFBRSxTQUFtQixFQUFFO0FBQzFDLFlBQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztLQUM1RDs7O1dBRU0saUJBQUMsSUFBWSxFQUFFLFFBQWdCLEVBQUUsU0FBbUIsRUFBRTtBQUMzRCxZQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7S0FDM0Q7OztXQUVjLHlCQUFDLE9BQWdCLEVBQUU7QUFDaEMsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUV2RCxVQUFJLENBQUMsTUFBTSxFQUFFO0FBQ1gsY0FBTSxHQUFHLG9DQUF3QiwwQkFBYyxPQUFPLENBQUMsQ0FBQyxDQUFDO09BQzFEOztBQUVELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztXQUUwQixxQ0FBQyxPQUFnQixFQUFFO0FBQzVDLFVBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssZUFBZSxFQUFFO0FBQy9DLGVBQU87QUFDTCxjQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlO0FBQ3JDLGdCQUFNLEVBQUUsaUJBQWlCO1NBQzFCLENBQUM7T0FDSDs7QUFFRCxhQUFPLElBQUksQ0FBQztLQUNiOzs7V0FFTSxtQkFBRztBQUNSLHNCQUFJLGdDQUFnQyxDQUFDLENBQUM7QUFDdEMseUJBQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7T0FDckM7QUFDRCxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3hCOzs7U0FqSGtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2tlcm5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IEVtaXR0ZXIgfSBmcm9tIFwiYXRvbVwiO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSwgYWN0aW9uIH0gZnJvbSBcIm1vYnhcIjtcbmltcG9ydCB7IGlzRXF1YWwgfSBmcm9tIFwibG9kYXNoXCI7XG5cbmltcG9ydCB7XG4gIGxvZyxcbiAgZm9jdXMsXG4gIG1zZ1NwZWNUb05vdGVib29rRm9ybWF0LFxuICBtc2dTcGVjVjR0b1Y1LFxuICBJTlNQRUNUT1JfVVJJXG59IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4vc3RvcmVcIjtcblxuaW1wb3J0IFdhdGNoZXNTdG9yZSBmcm9tIFwiLi9zdG9yZS93YXRjaGVzXCI7XG5pbXBvcnQgT3V0cHV0U3RvcmUgZnJvbSBcIi4vc3RvcmUvb3V0cHV0XCI7XG5pbXBvcnQgSHlkcm9nZW5LZXJuZWwgZnJvbSBcIi4vcGx1Z2luLWFwaS9oeWRyb2dlbi1rZXJuZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS2VybmVsIHtcbiAgQG9ic2VydmFibGUgZXhlY3V0aW9uU3RhdGUgPSBcImxvYWRpbmdcIjtcbiAgQG9ic2VydmFibGUgaW5zcGVjdG9yID0geyBidW5kbGU6IHt9IH07XG4gIG91dHB1dFN0b3JlID0gbmV3IE91dHB1dFN0b3JlKCk7XG5cbiAga2VybmVsU3BlYzogS2VybmVsc3BlYztcbiAgZ3JhbW1hcjogYXRvbSRHcmFtbWFyO1xuICBsYW5ndWFnZTogc3RyaW5nO1xuICBkaXNwbGF5TmFtZTogc3RyaW5nO1xuICB3YXRjaGVzU3RvcmU6IFdhdGNoZXNTdG9yZTtcbiAgd2F0Y2hDYWxsYmFja3M6IEFycmF5PEZ1bmN0aW9uPiA9IFtdO1xuICBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgcGx1Z2luV3JhcHBlcjogSHlkcm9nZW5LZXJuZWwgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihrZXJuZWxTcGVjOiBLZXJuZWxzcGVjLCBncmFtbWFyOiBhdG9tJEdyYW1tYXIpIHtcbiAgICB0aGlzLmtlcm5lbFNwZWMgPSBrZXJuZWxTcGVjO1xuICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG5cbiAgICB0aGlzLmxhbmd1YWdlID0ga2VybmVsU3BlYy5sYW5ndWFnZS50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMuZGlzcGxheU5hbWUgPSBrZXJuZWxTcGVjLmRpc3BsYXlfbmFtZTtcblxuICAgIHRoaXMud2F0Y2hlc1N0b3JlID0gbmV3IFdhdGNoZXNTdG9yZSh0aGlzKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgc2V0RXhlY3V0aW9uU3RhdGUoc3RhdGU6IHN0cmluZykge1xuICAgIHRoaXMuZXhlY3V0aW9uU3RhdGUgPSBzdGF0ZTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgYXN5bmMgc2V0SW5zcGVjdG9yUmVzdWx0KGJ1bmRsZTogT2JqZWN0LCBlZGl0b3I6ID9hdG9tJFRleHRFZGl0b3IpIHtcbiAgICBpZiAoaXNFcXVhbCh0aGlzLmluc3BlY3Rvci5idW5kbGUsIGJ1bmRsZSkpIHtcbiAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLnRvZ2dsZShJTlNQRUNUT1JfVVJJKTtcbiAgICB9IGVsc2UgaWYgKGJ1bmRsZS5zaXplICE9PSAwKSB7XG4gICAgICB0aGlzLmluc3BlY3Rvci5idW5kbGUgPSBidW5kbGU7XG4gICAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKElOU1BFQ1RPUl9VUkksIHsgc2VhcmNoQWxsUGFuZXM6IHRydWUgfSk7XG4gICAgfVxuICAgIGZvY3VzKGVkaXRvcik7XG4gIH1cblxuICBnZXRQbHVnaW5XcmFwcGVyKCkge1xuICAgIGlmICghdGhpcy5wbHVnaW5XcmFwcGVyKSB7XG4gICAgICB0aGlzLnBsdWdpbldyYXBwZXIgPSBuZXcgSHlkcm9nZW5LZXJuZWwodGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGx1Z2luV3JhcHBlcjtcbiAgfVxuXG4gIGFkZFdhdGNoQ2FsbGJhY2sod2F0Y2hDYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICB0aGlzLndhdGNoQ2FsbGJhY2tzLnB1c2god2F0Y2hDYWxsYmFjayk7XG4gIH1cblxuICBfY2FsbFdhdGNoQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMud2F0Y2hDYWxsYmFja3MuZm9yRWFjaCh3YXRjaENhbGxiYWNrID0+IHdhdGNoQ2FsbGJhY2soKSk7XG4gIH1cblxuICBpbnRlcnJ1cHQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiS2VybmVsOiBpbnRlcnJ1cHQgbWV0aG9kIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgfVxuXG4gIHNodXRkb3duKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIktlcm5lbDogc2h1dGRvd24gbWV0aG9kIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgfVxuXG4gIHJlc3RhcnQob25SZXN0YXJ0ZWQ6ID9GdW5jdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIktlcm5lbDogcmVzdGFydCBtZXRob2Qgbm90IGltcGxlbWVudGVkXCIpO1xuICB9XG5cbiAgZXhlY3V0ZShjb2RlOiBzdHJpbmcsIG9uUmVzdWx0czogRnVuY3Rpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJLZXJuZWw6IGV4ZWN1dGUgbWV0aG9kIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgfVxuXG4gIGV4ZWN1dGVXYXRjaChjb2RlOiBzdHJpbmcsIG9uUmVzdWx0czogRnVuY3Rpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJLZXJuZWw6IGV4ZWN1dGVXYXRjaCBtZXRob2Qgbm90IGltcGxlbWVudGVkXCIpO1xuICB9XG5cbiAgY29tcGxldGUoY29kZTogc3RyaW5nLCBvblJlc3VsdHM6IEZ1bmN0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiS2VybmVsOiBjb21wbGV0ZSBtZXRob2Qgbm90IGltcGxlbWVudGVkXCIpO1xuICB9XG5cbiAgaW5zcGVjdChjb2RlOiBzdHJpbmcsIGN1cm9yUG9zOiBudW1iZXIsIG9uUmVzdWx0czogRnVuY3Rpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJLZXJuZWw6IGluc3BlY3QgbWV0aG9kIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgfVxuXG4gIF9wYXJzZUlPTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlKSB7XG4gICAgbGV0IHJlc3VsdCA9IHRoaXMuX3BhcnNlRXhlY3V0ZUlucHV0SU9NZXNzYWdlKG1lc3NhZ2UpO1xuXG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIHJlc3VsdCA9IG1zZ1NwZWNUb05vdGVib29rRm9ybWF0KG1zZ1NwZWNWNHRvVjUobWVzc2FnZSkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBfcGFyc2VFeGVjdXRlSW5wdXRJT01lc3NhZ2UobWVzc2FnZTogTWVzc2FnZSkge1xuICAgIGlmIChtZXNzYWdlLmhlYWRlci5tc2dfdHlwZSA9PT0gXCJleGVjdXRlX2lucHV0XCIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRhdGE6IG1lc3NhZ2UuY29udGVudC5leGVjdXRpb25fY291bnQsXG4gICAgICAgIHN0cmVhbTogXCJleGVjdXRpb25fY291bnRcIlxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgbG9nKFwiS2VybmVsOiBEZXN0cm95aW5nIGJhc2Uga2VybmVsXCIpO1xuICAgIHN0b3JlLmRlbGV0ZUtlcm5lbCh0aGlzKTtcbiAgICBpZiAodGhpcy5wbHVnaW5XcmFwcGVyKSB7XG4gICAgICB0aGlzLnBsdWdpbldyYXBwZXIuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtZGVzdHJveVwiKTtcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpO1xuICB9XG59XG4iXX0=