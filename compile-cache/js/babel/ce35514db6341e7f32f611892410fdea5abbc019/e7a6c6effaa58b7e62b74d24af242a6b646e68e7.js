Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _kernel = require("./kernel");

var _kernel2 = _interopRequireDefault(_kernel);

var _inputView = require("./input-view");

var _inputView2 = _interopRequireDefault(_inputView);

var _utils = require("./utils");

var WSKernel = (function (_Kernel) {
  _inherits(WSKernel, _Kernel);

  function WSKernel(gatewayName, kernelSpec, grammar, session) {
    var _this = this;

    _classCallCheck(this, WSKernel);

    _get(Object.getPrototypeOf(WSKernel.prototype), "constructor", this).call(this, kernelSpec, grammar);
    this.session = session;
    this.gatewayName = gatewayName;

    this.session.statusChanged.connect(function () {
      return _this.setExecutionState(_this.session.status);
    });
    this.setExecutionState(this.session.status); // Set initial status correctly
  }

  _createClass(WSKernel, [{
    key: "interrupt",
    value: function interrupt() {
      return this.session.kernel.interrupt();
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      return this.session.kernel.shutdown();
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      var _this2 = this;

      var future = this.session.kernel.restart();
      future.then(function () {
        if (onRestarted) onRestarted(_this2.session.kernel);
      });
    }
  }, {
    key: "_execute",
    value: function _execute(code, callWatches, onResults) {
      var _this3 = this;

      var future = this.session.kernel.requestExecute({ code: code });

      future.onIOPub = function (message) {
        if (callWatches && message.header.msg_type === "status" && message.content.execution_state === "idle") {
          _this3._callWatchCallbacks();
        }

        if (onResults) {
          (0, _utils.log)("WSKernel: _execute:", message);
          var result = _this3._parseIOMessage(message);
          if (result) onResults(result);
        }
      };

      future.onReply = function (message) {
        var result = {
          data: message.content.status,
          stream: "status"
        };
        if (onResults) onResults(result);
      };

      future.onStdin = function (message) {
        if (message.header.msg_type !== "input_request") {
          return;
        }

        var prompt = message.content.prompt;

        var inputView = new _inputView2["default"]({ prompt: prompt }, function (input) {
          return _this3.session.kernel.sendInputReply({ value: input });
        });

        inputView.attach();
      };
    }
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      this._execute(code, true, onResults);
    }
  }, {
    key: "executeWatch",
    value: function executeWatch(code, onResults) {
      this._execute(code, false, onResults);
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      this.session.kernel.requestComplete({
        code: code,
        cursor_pos: code.length
      }).then(function (message) {
        return onResults(message.content);
      });
    }
  }, {
    key: "inspect",
    value: function inspect(code, cursorPos, onResults) {
      this.session.kernel.requestInspect({
        code: code,
        cursor_pos: cursorPos,
        detail_level: 0
      }).then(function (message) {
        return onResults({
          data: message.content.data,
          found: message.content.found
        });
      });
    }
  }, {
    key: "promptRename",
    value: function promptRename() {
      var _this4 = this;

      var view = new _inputView2["default"]({
        prompt: "Name your current session",
        defaultText: this.session.path,
        allowCancel: true
      }, function (input) {
        return _this4.session.setPath(input);
      });

      view.attach();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _utils.log)("WSKernel: destroying jupyter-js-services Session");
      this.session.dispose();
      _get(Object.getPrototypeOf(WSKernel.prototype), "destroy", this).call(this);
    }
  }]);

  return WSKernel;
})(_kernel2["default"]);

exports["default"] = WSKernel;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3dzLWtlcm5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFbUIsVUFBVTs7Ozt5QkFDUCxjQUFjOzs7O3FCQUNoQixTQUFTOztJQUlSLFFBQVE7WUFBUixRQUFROztBQUloQixXQUpRLFFBQVEsQ0FLekIsV0FBbUIsRUFDbkIsVUFBc0IsRUFDdEIsT0FBcUIsRUFDckIsT0FBZ0IsRUFDaEI7OzswQkFUaUIsUUFBUTs7QUFVekIsK0JBVmlCLFFBQVEsNkNBVW5CLFVBQVUsRUFBRSxPQUFPLEVBQUU7QUFDM0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsUUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7O0FBRS9CLFFBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQzthQUNqQyxNQUFLLGlCQUFpQixDQUFDLE1BQUssT0FBTyxDQUFDLE1BQU0sQ0FBQztLQUFBLENBQzVDLENBQUM7QUFDRixRQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUM3Qzs7ZUFsQmtCLFFBQVE7O1dBb0JsQixxQkFBRztBQUNWLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDeEM7OztXQUVPLG9CQUFHO0FBQ1QsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUN2Qzs7O1dBRU0saUJBQUMsV0FBc0IsRUFBRTs7O0FBQzlCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdDLFlBQU0sQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUNoQixZQUFJLFdBQVcsRUFBRSxXQUFXLENBQUMsT0FBSyxPQUFPLENBQUMs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QUFBLENBQ0gsQ0FBQztLQUNMOzs7V0FFVyx3QkFBRzs7O0FBQ2IsVUFBTSxJQUFJLEdBQUcsMkJBQ1g7QUFDRSxjQUFNLEVBQUUsMkJBQTJCO0FBQ25DLG1CQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO0FBQzlCLG1CQUFXLEVBQUUsSUFBSTtPQUNsQixFQUNELFVBQUMsS0FBSztlQUFhLE9BQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7T0FBQSxDQUMvQyxDQUFDOztBQUVGLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7V0FFTSxtQkFBRztBQUNSLHNCQUFJLGtEQUFrRCxDQUFDLENBQUM7QUFDeEQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN2QixpQ0E3SGlCLFFBQVEseUNBNkhUO0tBQ2pCOzs7U0E5SGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3dzLWtlcm5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBLZXJuZWwgZnJvbSBcIi4va2VybmVsXCI7XG5pbXBvcnQgSW5wdXRWaWV3IGZyb20gXCIuL2lucHV0LXZpZXdcIjtcbmltcG9ydCB7IGxvZyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmltcG9ydCB0eXBlIHsgU2Vzc2lvbiB9IGZyb20gXCJAanVweXRlcmxhYi9zZXJ2aWNlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXU0tlcm5lbCBleHRlbmRzIEtlcm5lbCB7XG4gIHNlc3Npb246IFNlc3Npb247XG4gIGdhdGV3YXlOYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZ2F0ZXdheU5hbWU6IHN0cmluZyxcbiAgICBrZXJuZWxTcGVjOiBLZXJuZWxzcGVjLFxuICAgIGdyYW1tYXI6IGF0b20kR3JhbW1hcixcbiAgICBzZXNzaW9uOiBTZXNzaW9uXG4gICkge1xuICAgIHN1cGVyKGtlcm5lbFNwZWMsIGdyYW1tYXIpO1xuICAgIHRoaXMuc2Vzc2lvbiA9IHNlc3Npb247XG4gICAgdGhpcy5nYXRld2F5TmFtZSA9IGdhdGV3YXlOYW1lO1xuXG4gICAgdGhpcy5zZXNzaW9uLnN0YXR1c0NoYW5nZWQuY29ubmVjdCgoKSA9PlxuICAgICAgdGhpcy5zZXRFeGVjdXRpb25TdGF0ZSh0aGlzLnNlc3Npb24uc3RhdHVzKVxuICAgICk7XG4gICAgdGhpcy5zZXRFeGVjdXRpb25TdGF0ZSh0aGlzLnNlc3Npb24uc3RhdHVzKTsgLy8gU2V0IGluaXRpYWwgc3RhdHVzIGNvcnJlY3RseVxuICB9XG5cbiAgaW50ZXJydXB0KCkge1xuICAgIHJldHVybiB0aGlzLnNlc3Npb24ua2VybmVsLmludGVycnVwdCgpO1xuICB9XG5cbiAgc2h1dGRvd24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5rZXJuZWwuc2h1dGRvd24oKTtcbiAgfVxuXG4gIHJlc3RhcnQob25SZXN0YXJ0ZWQ6ID9GdW5jdGlvbikge1xuICAgIGNvbnN0IGZ1dHVyZSA9IHRoaXMuc2Vzc2lvbi5rZXJuZWwucmVzdGFydCgpO1xuICAgIGZ1dHVyZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChvblJlc3RhcnRlZCkgb25SZXN0YXJ0ZWQodGhpcy5zZXNzaW9uLmtlcm5lbCk7XG4gICAgfSk7XG4gIH1cblxuICBfZXhlY3V0ZShjb2RlOiBzdHJpbmcsIGNhbGxXYXRjaGVzOiBib29sZWFuLCBvblJlc3VsdHM6IEZ1bmN0aW9uKSB7XG4gICAgY29uc3QgZnV0dXJlID0gdGhpcy5zZXNzaW9uLmtlcm5lbC5yZXF1ZXN0RXhlY3V0ZSh7IGNvZGUgfSk7XG5cbiAgICBmdXR1cmUub25JT1B1YiA9IChtZXNzYWdlOiBNZXNzYWdlKSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIGNhbGxXYXRjaGVzICYmXG4gICAgICAgIG1lc3NhZ2UuaGVhZGVyLm1zZ190eXBlID09PSBcInN0YXR1c1wiICYmXG4gICAgICAgIG1lc3NhZ2UuY29udGVudC5leGVjdXRpb25fc3RhdGUgPT09IFwiaWRsZVwiXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fY2FsbFdhdGNoQ2FsbGJhY2tzKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvblJlc3VsdHMpIHtcbiAgICAgICAgbG9nKFwiV1NLZXJuZWw6IF9leGVjdXRlOlwiLCBtZXNzYWdlKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcGFyc2VJT01lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIGlmIChyZXN1bHQpIG9uUmVzdWx0cyhyZXN1bHQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdXR1cmUub25SZXBseSA9IChtZXNzYWdlOiBNZXNzYWdlKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgIGRhdGE6IG1lc3NhZ2UuY29udGVudC5zdGF0dXMsXG4gICAgICAgIHN0cmVhbTogXCJzdGF0dXNcIlxuICAgICAgfTtcbiAgICAgIGlmIChvblJlc3VsdHMpIG9uUmVzdWx0cyhyZXN1bHQpO1xuICAgIH07XG5cbiAgICBmdXR1cmUub25TdGRpbiA9IChtZXNzYWdlOiBNZXNzYWdlKSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5oZWFkZXIubXNnX3R5cGUgIT09IFwiaW5wdXRfcmVxdWVzdFwiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBwcm9tcHQgfSA9IG1lc3NhZ2UuY29udGVudDtcblxuICAgICAgY29uc3QgaW5wdXRWaWV3ID0gbmV3IElucHV0Vmlldyh7IHByb21wdCB9LCAoaW5wdXQ6IHN0cmluZykgPT5cbiAgICAgICAgdGhpcy5zZXNzaW9uLmtlcm5lbC5zZW5kSW5wdXRSZXBseSh7IHZhbHVlOiBpbnB1dCB9KVxuICAgICAgKTtcblxuICAgICAgaW5wdXRWaWV3LmF0dGFjaCgpO1xuICAgIH07XG4gIH1cblxuICBleGVjdXRlKGNvZGU6IHN0cmluZywgb25SZXN1bHRzOiBGdW5jdGlvbikge1xuICAgIHRoaXMuX2V4ZWN1dGUoY29kZSwgdHJ1ZSwgb25SZXN1bHRzKTtcbiAgfVxuXG4gIGV4ZWN1dGVXYXRjaChjb2RlOiBzdHJpbmcsIG9uUmVzdWx0czogRnVuY3Rpb24pIHtcbiAgICB0aGlzLl9leGVjdXRlKGNvZGUsIGZhbHNlLCBvblJlc3VsdHMpO1xuICB9XG5cbiAgY29tcGxldGUoY29kZTogc3RyaW5nLCBvblJlc3VsdHM6IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5zZXNzaW9uLmtlcm5lbFxuICAgICAgLnJlcXVlc3RDb21wbGV0ZSh7XG4gICAgICAgIGNvZGUsXG4gICAgICAgIGN1cnNvcl9wb3M6IGNvZGUubGVuZ3RoXG4gICAgICB9KVxuICAgICAgLnRoZW4oKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IG9uUmVzdWx0cyhtZXNzYWdlLmNvbnRlbnQpKTtcbiAgfVxuXG4gIGluc3BlY3QoY29kZTogc3RyaW5nLCBjdXJzb3JQb3M6IG51bWJlciwgb25SZXN1bHRzOiBGdW5jdGlvbikge1xuICAgIHRoaXMuc2Vzc2lvbi5rZXJuZWxcbiAgICAgIC5yZXF1ZXN0SW5zcGVjdCh7XG4gICAgICAgIGNvZGUsXG4gICAgICAgIGN1cnNvcl9wb3M6IGN1cnNvclBvcyxcbiAgICAgICAgZGV0YWlsX2xldmVsOiAwXG4gICAgICB9KVxuICAgICAgLnRoZW4oKG1lc3NhZ2U6IE1lc3NhZ2UpID0+XG4gICAgICAgIG9uUmVzdWx0cyh7XG4gICAgICAgICAgZGF0YTogbWVzc2FnZS5jb250ZW50LmRhdGEsXG4gICAgICAgICAgZm91bmQ6IG1lc3NhZ2UuY29udGVudC5mb3VuZFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxuXG4gIHByb21wdFJlbmFtZSgpIHtcbiAgICBjb25zdCB2aWV3ID0gbmV3IElucHV0VmlldyhcbiAgICAgIHtcbiAgICAgICAgcHJvbXB0OiBcIk5hbWUgeW91ciBjdXJyZW50IHNlc3Npb25cIixcbiAgICAgICAgZGVmYXVsdFRleHQ6IHRoaXMuc2Vzc2lvbi5wYXRoLFxuICAgICAgICBhbGxvd0NhbmNlbDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIChpbnB1dDogc3RyaW5nKSA9PiB0aGlzLnNlc3Npb24uc2V0UGF0aChpbnB1dClcbiAgICApO1xuXG4gICAgdmlldy5hdHRhY2goKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgbG9nKFwiV1NLZXJuZWw6IGRlc3Ryb3lpbmcganVweXRlci1qcy1zZXJ2aWNlcyBTZXNzaW9uXCIpO1xuICAgIHRoaXMuc2Vzc2lvbi5kaXNwb3NlKCk7XG4gICAgc3VwZXIuZGVzdHJveSgpO1xuICB9XG59XG4iXX0=