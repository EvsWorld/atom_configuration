Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _jmp = require("jmp");

var _uuidV4 = require("uuid/v4");

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _spawnteract = require("spawnteract");

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _kernel = require("./kernel");

var _kernel2 = _interopRequireDefault(_kernel);

var _inputView = require("./input-view");

var _inputView2 = _interopRequireDefault(_inputView);

var _utils = require("./utils");

var ZMQKernel = (function (_Kernel) {
  _inherits(ZMQKernel, _Kernel);

  function ZMQKernel(kernelSpec, grammar, options, onStarted) {
    var _this = this;

    _classCallCheck(this, ZMQKernel);

    _get(Object.getPrototypeOf(ZMQKernel.prototype), "constructor", this).call(this, kernelSpec, grammar);
    this.executionCallbacks = {};
    this.options = options || {};

    (0, _spawnteract.launchSpec)(kernelSpec, options).then(function (_ref) {
      var config = _ref.config;
      var connectionFile = _ref.connectionFile;
      var spawn = _ref.spawn;

      _this.connection = config;
      _this.connectionFile = connectionFile;
      _this.kernelProcess = spawn;

      _this.monitorNotifications(spawn);

      _this.connect(function () {
        _this._executeStartupCode();

        if (onStarted) onStarted(_this);
      });
    });
  }

  _createClass(ZMQKernel, [{
    key: "connect",
    value: function connect(done) {
      var scheme = this.connection.signature_scheme.slice("hmac-".length);
      var key = this.connection.key;

      this.shellSocket = new _jmp.Socket("dealer", scheme, key);
      this.controlSocket = new _jmp.Socket("dealer", scheme, key);
      this.stdinSocket = new _jmp.Socket("dealer", scheme, key);
      this.ioSocket = new _jmp.Socket("sub", scheme, key);

      var id = (0, _uuidV42["default"])();
      this.shellSocket.identity = "dealer" + id;
      this.controlSocket.identity = "control" + id;
      this.stdinSocket.identity = "dealer" + id;
      this.ioSocket.identity = "sub" + id;

      var address = this.connection.transport + "://" + this.connection.ip + ":";
      this.shellSocket.connect(address + this.connection.shell_port);
      this.controlSocket.connect(address + this.connection.control_port);
      this.ioSocket.connect(address + this.connection.iopub_port);
      this.ioSocket.subscribe("");
      this.stdinSocket.connect(address + this.connection.stdin_port);

      this.shellSocket.on("message", this.onShellMessage.bind(this));
      this.ioSocket.on("message", this.onIOMessage.bind(this));
      this.stdinSocket.on("message", this.onStdinMessage.bind(this));

      this.monitor(done);
    }
  }, {
    key: "monitorNotifications",
    value: function monitorNotifications(childProcess) {
      var _this2 = this;

      childProcess.stdout.on("data", function (data) {
        data = data.toString();

        if (atom.config.get("Hydrogen.kernelNotifications")) {
          atom.notifications.addInfo(_this2.kernelSpec.display_name, {
            description: data,
            dismissable: true
          });
        } else {
          (0, _utils.log)("ZMQKernel: stdout:", data);
        }
      });

      childProcess.stderr.on("data", function (data) {
        atom.notifications.addError(_this2.kernelSpec.display_name, {
          description: data.toString(),
          dismissable: true
        });
      });
    }
  }, {
    key: "monitor",
    value: function monitor(done) {
      var _this3 = this;

      try {
        (function () {
          var socketNames = ["shellSocket", "controlSocket", "ioSocket"];

          var waitGroup = socketNames.length;

          var onConnect = function onConnect(_ref2) {
            var socketName = _ref2.socketName;
            var socket = _ref2.socket;

            (0, _utils.log)("ZMQKernel: " + socketName + " connected");
            socket.unmonitor();

            waitGroup--;
            if (waitGroup === 0) {
              (0, _utils.log)("ZMQKernel: all main sockets connected");
              _this3.setExecutionState("idle");
              if (done) done();
            }
          };

          var monitor = function monitor(socketName, socket) {
            (0, _utils.log)("ZMQKernel: monitor " + socketName);
            socket.on("connect", onConnect.bind(_this3, { socketName: socketName, socket: socket }));
            socket.monitor();
          };

          monitor("shellSocket", _this3.shellSocket);
          monitor("controlSocket", _this3.controlSocket);
          monitor("ioSocket", _this3.ioSocket);
        })();
      } catch (err) {
        console.error("ZMQKernel:", err);
      }
    }
  }, {
    key: "interrupt",
    value: function interrupt() {
      if (process.platform === "win32") {
        atom.notifications.addWarning("Cannot interrupt this kernel", {
          detail: "Kernel interruption is currently not supported in Windows."
        });
      } else {
        (0, _utils.log)("ZMQKernel: sending SIGINT");
        this.kernelProcess.kill("SIGINT");
      }
    }
  }, {
    key: "_kill",
    value: function _kill() {
      (0, _utils.log)("ZMQKernel: sending SIGKILL");
      this.kernelProcess.kill("SIGKILL");
    }
  }, {
    key: "_executeStartupCode",
    value: function _executeStartupCode() {
      var displayName = this.kernelSpec.display_name;
      var startupCode = _config2["default"].getJson("startupCode")[displayName];
      if (startupCode) {
        (0, _utils.log)("KernelManager: Executing startup code:", startupCode);
        startupCode = startupCode + " \n";
        this.execute(startupCode);
      }
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      var restart = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var requestId = "shutdown_" + (0, _uuidV42["default"])();
      var message = this._createMessage("shutdown_request", requestId);

      message.content = { restart: restart };

      this.shellSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      var _this4 = this;

      if (this.executionState === "restarting") {
        return;
      }
      this.setExecutionState("restarting");
      this.shutdown(true);
      this._kill();

      var _launchSpecFromConnectionInfo = (0, _spawnteract.launchSpecFromConnectionInfo)(this.kernelSpec, this.connection, this.connectionFile, this.options);

      var spawn = _launchSpecFromConnectionInfo.spawn;

      this.kernelProcess = spawn;
      this.monitor(function () {
        if (onRestarted) onRestarted(_this4);
      });
    }

    // onResults is a callback that may be called multiple times
    // as results come in from the kernel
  }, {
    key: "_execute",
    value: function _execute(code, requestId, onResults) {
      var message = this._createMessage("execute_request", requestId);

      message.content = {
        code: code,
        silent: false,
        store_history: true,
        user_expressions: {},
        allow_stdin: true
      };

      this.executionCallbacks[requestId] = onResults;

      this.shellSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      (0, _utils.log)("Kernel.execute:", code);

      var requestId = "execute_" + (0, _uuidV42["default"])();
      this._execute(code, requestId, onResults);
    }
  }, {
    key: "executeWatch",
    value: function executeWatch(code, onResults) {
      (0, _utils.log)("Kernel.executeWatch:", code);

      var requestId = "watch_" + (0, _uuidV42["default"])();
      this._execute(code, requestId, onResults);
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      (0, _utils.log)("Kernel.complete:", code);

      var requestId = "complete_" + (0, _uuidV42["default"])();

      var message = this._createMessage("complete_request", requestId);

      message.content = {
        code: code,
        text: code,
        line: code,
        cursor_pos: code.length
      };

      this.executionCallbacks[requestId] = onResults;

      this.shellSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "inspect",
    value: function inspect(code, cursorPos, onResults) {
      (0, _utils.log)("Kernel.inspect:", code, cursorPos);

      var requestId = "inspect_" + (0, _uuidV42["default"])();

      var message = this._createMessage("inspect_request", requestId);

      message.content = {
        code: code,
        cursor_pos: cursorPos,
        detail_level: 0
      };

      this.executionCallbacks[requestId] = onResults;

      this.shellSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "inputReply",
    value: function inputReply(input) {
      var requestId = "input_reply_" + (0, _uuidV42["default"])();

      var message = this._createMessage("input_reply", requestId);

      message.content = { value: input };

      this.stdinSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "onShellMessage",
    value: function onShellMessage(message) {
      (0, _utils.log)("shell message:", message);

      if (!this._isValidMessage(message)) {
        return;
      }

      var msg_id = message.parent_header.msg_id;

      var callback = undefined;
      if (msg_id) {
        callback = this.executionCallbacks[msg_id];
      }

      if (!callback) {
        return;
      }

      var status = message.content.status;

      if (status === "error") {
        callback({
          data: "error",
          stream: "status"
        });
      } else if (status === "ok") {
        var msg_type = message.header.msg_type;

        if (msg_type === "execution_reply") {
          callback({
            data: "ok",
            stream: "status"
          });
        } else if (msg_type === "complete_reply") {
          callback(message.content);
        } else if (msg_type === "inspect_reply") {
          callback({
            data: message.content.data,
            found: message.content.found
          });
        } else {
          callback({
            data: "ok",
            stream: "status"
          });
        }
      }
    }
  }, {
    key: "onStdinMessage",
    value: function onStdinMessage(message) {
      var _this5 = this;

      (0, _utils.log)("stdin message:", message);

      if (!this._isValidMessage(message)) {
        return;
      }

      var msg_type = message.header.msg_type;

      if (msg_type === "input_request") {
        var _prompt = message.content.prompt;

        var inputView = new _inputView2["default"]({ prompt: _prompt }, function (input) {
          return _this5.inputReply(input);
        });

        inputView.attach();
      }
    }
  }, {
    key: "onIOMessage",
    value: function onIOMessage(message) {
      (0, _utils.log)("IO message:", message);

      if (!this._isValidMessage(message)) {
        return;
      }

      var msg_type = message.header.msg_type;

      if (msg_type === "status") {
        var _status = message.content.execution_state;
        this.setExecutionState(_status);

        var _msg_id = message.parent_header ? message.parent_header.msg_id : null;
        if (_msg_id && _status === "idle" && _msg_id.startsWith("execute")) {
          this._callWatchCallbacks();
        }
        return;
      }

      var msg_id = message.parent_header.msg_id;

      var callback = undefined;
      if (msg_id) {
        callback = this.executionCallbacks[msg_id];
      }

      if (!callback) {
        return;
      }

      var result = this._parseIOMessage(message);

      if (result) {
        callback(result);
      }
    }
  }, {
    key: "_isValidMessage",
    value: function _isValidMessage(message) {
      if (!message) {
        (0, _utils.log)("Invalid message: null");
        return false;
      }

      if (!message.content) {
        (0, _utils.log)("Invalid message: Missing content");
        return false;
      }

      if (message.content.execution_state === "starting") {
        // Kernels send a starting status message with an empty parent_header
        (0, _utils.log)("Dropped starting status IO message");
        return false;
      }

      if (!message.parent_header) {
        (0, _utils.log)("Invalid message: Missing parent_header");
        return false;
      }

      if (!message.parent_header.msg_id) {
        (0, _utils.log)("Invalid message: Missing parent_header.msg_id");
        return false;
      }

      if (!message.parent_header.msg_type) {
        (0, _utils.log)("Invalid message: Missing parent_header.msg_type");
        return false;
      }

      if (!message.header) {
        (0, _utils.log)("Invalid message: Missing header");
        return false;
      }

      if (!message.header.msg_id) {
        (0, _utils.log)("Invalid message: Missing header.msg_id");
        return false;
      }

      if (!message.header.msg_type) {
        (0, _utils.log)("Invalid message: Missing header.msg_type");
        return false;
      }

      return true;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _utils.log)("ZMQKernel: destroy:", this);

      this.shutdown();

      this._kill();
      _fs2["default"].unlinkSync(this.connectionFile);

      this.shellSocket.close();
      this.controlSocket.close();
      this.ioSocket.close();
      this.stdinSocket.close();

      _get(Object.getPrototypeOf(ZMQKernel.prototype), "destroy", this).call(this);
    }
  }, {
    key: "_getUsername",
    value: function _getUsername() {
      return process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;
    }
  }, {
    key: "_createMessage",
    value: function _createMessage(msgType) {
      var msgId = arguments.length <= 1 || arguments[1] === undefined ? (0, _uuidV42["default"])() : arguments[1];

      var message = {
        header: {
          username: this._getUsername(),
          session: "00000000-0000-0000-0000-000000000000",
          msg_type: msgType,
          msg_id: msgId,
          date: new Date(),
          version: "5.0"
        },
        metadata: {},
        parent_header: {},
        content: {}
      };

      return message;
    }
  }]);

  return ZMQKernel;
})(_kernel2["default"]);

exports["default"] = ZMQKernel;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3ptcS1rZXJuZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7a0JBRWUsSUFBSTs7OzttQkFDYSxLQUFLOztzQkFDdEIsU0FBUzs7OzsyQkFDaUMsYUFBYTs7c0JBRW5ELFVBQVU7Ozs7c0JBQ1YsVUFBVTs7Ozt5QkFDUCxjQUFjOzs7O3FCQUNoQixTQUFTOztJQWVSLFNBQVM7WUFBVCxTQUFTOztBQVlqQixXQVpRLFNBQVMsQ0FhMUIsVUFBc0IsRUFDdEIsT0FBcUIsRUFDckIsT0FBZSxFQUNmLFNBQW9CLEVBQ3BCOzs7MEJBakJpQixTQUFTOztBQWtCMUIsK0JBbEJpQixTQUFTLDZDQWtCcEIsVUFBVSxFQUFFLE9BQU8sRUFBRTtTQWpCN0Isa0JBQWtCLEdBQVcsRUFBRTtBQWtCN0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDOztBQUU3QixpQ0FBVyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUNsQyxVQUFDLElBQWlDLEVBQUs7VUFBcEMsTUFBTSxHQUFSLElBQWlDLENBQS9CLE1BQU07VUFBRSxjQUFjLEdBQXhCLElBQWlDLENBQXZCLGNBQWM7VUFBRSxLQUFLLEdBQS9CLElBQWlDLENBQVAsS0FBSzs7QUFDOUIsWUFBSyxVQUFVLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLFlBQUssY0FBYyxHQUFHLGNBQWMsQ0FBQztBQUNyQyxZQUFLLGFBQWEsR0FBRyxLQUFLLENBQUM7O0FBRTNCLFlBQUssb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWpDLFlBQUssT0FBTyxDQUFDLFlBQU07QUFDakIsY0FBSyxtQkFBbUIsRUFBRSxDQUFDOztBQUUzQixZQUFJLFNBQVMsRUFBRSxTQUFTLE9BQU0sQ0FBQztPQUNoQyxDQUFDLENBQUM7S0FDSixDQUNGLENBQUM7R0FDSDs7ZUFwQ2tCLFNBQVM7O1dB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STs7QUFDbEQsVUFBTSxPQUFPLEdBQUc7QUFDZCxjQUFNLEVBQUU7QUFDTixrQkFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDN0IsaUJBQU8sRUFBRSxzQ0FBc0M7QUFDL0Msa0JBQVEsRUFBRSxPQUFPO0FBQ2pCLGdCQUFNLEVBQUUsS0FBSztBQUNiLGNBQUksRUFBRSxJQUFJLElBQUksRUFBRTtBQUNoQixpQkFBTyxFQUFFLEtBQUs7U0FDZjtBQUNELGdCQUFRLEVBQUUsRUFBRTtBQUNaLHFCQUFhLEVBQUUsRUFBRTtBQUNqQixlQUFPLEVBQUUsRUFBRTtPQUNaLENBQUM7O0FBRUYsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztTQW5ja0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvem1xLWtlcm5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IE1lc3NhZ2UsIFNvY2tldCB9IGZyb20gXCJqbXBcIjtcbmltcG9ydCB2NCBmcm9tIFwidXVpZC92NFwiO1xuaW1wb3J0IHsgbGF1bmNoU3BlYywgbGF1bmNoU3BlY0Zyb21Db25uZWN0aW9uSW5mbyB9IGZyb20gXCJzcGF3bnRlcmFjdFwiO1xuXG5pbXBvcnQgQ29uZmlnIGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IEtlcm5lbCBmcm9tIFwiLi9rZXJuZWxcIjtcbmltcG9ydCBJbnB1dFZpZXcgZnJvbSBcIi4vaW5wdXQtdmlld1wiO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IHR5cGUgQ29ubmVjdGlvbiA9IHtcbiAgY29udHJvbF9wb3J0OiBudW1iZXIsXG4gIGhiX3BvcnQ6IG51bWJlcixcbiAgaW9wdWJfcG9ydDogbnVtYmVyLFxuICBpcDogc3RyaW5nLFxuICBrZXk6IHN0cmluZyxcbiAgc2hlbGxfcG9ydDogbnVtYmVyLFxuICBzaWduYXR1cmVfc2NoZW1lOiBzdHJpbmcsXG4gIHN0ZGluX3BvcnQ6IG51bWJlcixcbiAgdHJhbnNwb3J0OiBzdHJpbmcsXG4gIHZlcnNpb246IG51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWk1RS2VybmVsIGV4dGVuZHMgS2VybmVsIHtcbiAgZXhlY3V0aW9uQ2FsbGJhY2tzOiBPYmplY3QgPSB7fTtcbiAgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcbiAgY29ubmVjdGlvbkZpbGU6IHN0cmluZztcbiAga2VybmVsUHJvY2VzczogY2hpbGRfcHJvY2VzcyRDaGlsZFByb2Nlc3M7XG4gIG9wdGlvbnM6IE9iamVjdDtcblxuICBzaGVsbFNvY2tldDogU29ja2V0O1xuICBjb250cm9sU29ja2V0OiBTb2NrZXQ7XG4gIHN0ZGluU29ja2V0OiBTb2NrZXQ7XG4gIGlvU29ja2V0OiBTb2NrZXQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAga2VybmVsU3BlYzogS2VybmVsc3BlYyxcbiAgICBncmFtbWFyOiBhdG9tJEdyYW1tYXIsXG4gICAgb3B0aW9uczogT2JqZWN0LFxuICAgIG9uU3RhcnRlZDogP0Z1bmN0aW9uXG4gICkge1xuICAgIHN1cGVyKGtlcm5lbFNwZWMsIGdyYW1tYXIpO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICBsYXVuY2hTcGVjKGtlcm5lbFNwZWMsIG9wdGlvbnMpLnRoZW4oXG4gICAgICAoeyBjb25maWcsIGNvbm5lY3Rpb25GaWxlLCBzcGF3biB9KSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uRmlsZSA9IGNvbm5lY3Rpb25GaWxlO1xuICAgICAgICB0aGlzLmtlcm5lbFByb2Nlc3MgPSBzcGF3bjtcblxuICAgICAgICB0aGlzLm1vbml0b3JOb3RpZmljYXRpb25zKHNwYXduKTtcblxuICAgICAgICB0aGlzLmNvbm5lY3QoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2V4ZWN1dGVTdGFydHVwQ29kZSgpO1xuXG4gICAgICAgICAgaWYgKG9uU3RhcnRlZCkgb25TdGFydGVkKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgY29ubmVjdChkb25lOiA/RnVuY3Rpb24pIHtcbiAgICBjb25zdCBzY2hlbWUgPSB0aGlzLmNvbm5lY3Rpb24uc2lnbmF0dXJlX3NjaGVtZS5zbGljZShcImhtYWMtXCIubGVuZ3RoKTtcbiAgICBjb25zdCB7IGtleSB9ID0gdGhpcy5jb25uZWN0aW9uO1xuXG4gICAgdGhpcy5zaGVsbFNvY2tldCA9IG5ldyBTb2NrZXQoXCJkZWFsZXJcIiwgc2NoZW1lLCBrZXkpO1xuICAgIHRoaXMuY29udHJvbFNvY2tldCA9IG5ldyBTb2NrZXQoXCJkZWFsZXJcIiwgc2NoZW1lLCBrZXkpO1xuICAgIHRoaXMuc3RkaW5Tb2NrZXQgPSBuZXcgU29ja2V0KFwiZGVhbGVyXCIsIHNjaGVtZSwga2V5KTtcbiAgICB0aGlzLmlvU29ja2V0ID0gbmV3IFNvY2tldChcInN1YlwiLCBzY2hlbWUsIGtleSk7XG5cbiAgICBjb25zdCBpZCA9IHY0KCk7XG4gICAgdGhpcy5zaGVsbFNvY2tldC5pZGVudGl0eSA9IGBkZWFsZXIke2lkfWA7XG4gICAgdGhpcy5jb250cm9sU29ja2V0LmlkZW50aXR5ID0gYGNvbnRyb2wke2lkfWA7XG4gICAgdGhpcy5zdGRpblNvY2tldC5pZGVudGl0eSA9IGBkZWFsZXIke2lkfWA7XG4gICAgdGhpcy5pb1NvY2tldC5pZGVudGl0eSA9IGBzdWIke2lkfWA7XG5cbiAgICBjb25zdCBhZGRyZXNzID0gYCR7dGhpcy5jb25uZWN0aW9uLnRyYW5zcG9ydH06Ly8ke3RoaXMuY29ubmVjdGlvbi5pcH06YDtcbiAgICB0aGlzLnNoZWxsU29ja2V0LmNvbm5lY3QoYWRkcmVzcyArIHRoaXMuY29ubmVjdGlvbi5zaGVsbF9wb3J0KTtcbiAgICB0aGlzLmNvbnRyb2xTb2NrZXQuY29ubmVjdChhZGRyZXNzICsgdGhpcy5jb25uZWN0aW9uLmNvbnRyb2xfcG9ydCk7XG4gICAgdGhpcy5pb1NvY2tldC5jb25uZWN0KGFkZHJlc3MgKyB0aGlzLmNvbm5lY3Rpb24uaW9wdWJfcG9ydCk7XG4gICAgdGhpcy5pb1NvY2tldC5zdWJzY3JpYmUoXCJcIik7XG4gICAgdGhpcy5zdGRpblNvY2tldC5jb25uZWN0KGFkZHJlc3MgKyB0aGlzLmNvbm5lY3Rpb24uc3RkaW5fcG9ydCk7XG5cbiAgICB0aGlzLnNoZWxsU29ja2V0Lm9uKFwibWVzc2FnZVwiLCB0aGlzLm9uU2hlbGxNZXNzYWdlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuaW9Tb2NrZXQub24oXCJtZXNzYWdlXCIsIHRoaXMub25JT01lc3NhZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5zdGRpblNvY2tldC5vbihcIm1lc3NhZ2VcIiwgdGhpcy5vblN0ZGluTWVzc2FnZS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMubW9uaXRvcihkb25lKTtcbiAgfVxuXG4gIG1vbml0b3JOb3RpZmljYXRpb25zKGNoaWxkUHJvY2VzczogY2hpbGRfcHJvY2VzcyRDaGlsZFByb2Nlc3MpIHtcbiAgICBjaGlsZFByb2Nlc3Muc3Rkb3V0Lm9uKFwiZGF0YVwiLCAoZGF0YTogc3RyaW5nIHwgQnVmZmVyKSA9PiB7XG4gICAgICBkYXRhID0gZGF0YS50b1N0cmluZygpO1xuXG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KFwiSHlkcm9nZW4ua2VybmVsTm90aWZpY2F0aW9uc1wiKSkge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyh0aGlzLmtlcm5lbFNwZWMuZGlzcGxheV9uYW1lLCB7XG4gICAgICAgICAgZGVzY3JpcHRpb246IGRhdGEsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2coXCJaTVFLZXJuZWw6IHN0ZG91dDpcIiwgZGF0YSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjaGlsZFByb2Nlc3Muc3RkZXJyLm9uKFwiZGF0YVwiLCAoZGF0YTogc3RyaW5nIHwgQnVmZmVyKSA9PiB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IodGhpcy5rZXJuZWxTcGVjLmRpc3BsYXlfbmFtZSwge1xuICAgICAgICBkZXNjcmlwdGlvbjogZGF0YS50b1N0cmluZygpLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBtb25pdG9yKGRvbmU6ID9GdW5jdGlvbikge1xuICAgIHRyeSB7XG4gICAgICBsZXQgc29ja2V0TmFtZXMgPSBbXCJzaGVsbFNvY2tldFwiLCBcImNvbnRyb2xTb2NrZXRcIiwgXCJpb1NvY2tldFwiXTtcblxuICAgICAgbGV0IHdhaXRHcm91cCA9IHNvY2tldE5hbWVzLmxlbmd0aDtcblxuICAgICAgY29uc3Qgb25Db25uZWN0ID0gKHsgc29ja2V0TmFtZSwgc29ja2V0IH0pID0+IHtcbiAgICAgICAgbG9nKFwiWk1RS2VybmVsOiBcIiArIHNvY2tldE5hbWUgKyBcIiBjb25uZWN0ZWRcIik7XG4gICAgICAgIHNvY2tldC51bm1vbml0b3IoKTtcblxuICAgICAgICB3YWl0R3JvdXAtLTtcbiAgICAgICAgaWYgKHdhaXRHcm91cCA9PT0gMCkge1xuICAgICAgICAgIGxvZyhcIlpNUUtlcm5lbDogYWxsIG1haW4gc29ja2V0cyBjb25uZWN0ZWRcIik7XG4gICAgICAgICAgdGhpcy5zZXRFeGVjdXRpb25TdGF0ZShcImlkbGVcIik7XG4gICAgICAgICAgaWYgKGRvbmUpIGRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgbW9uaXRvciA9IChzb2NrZXROYW1lLCBzb2NrZXQpID0+IHtcbiAgICAgICAgbG9nKFwiWk1RS2VybmVsOiBtb25pdG9yIFwiICsgc29ja2V0TmFtZSk7XG4gICAgICAgIHNvY2tldC5vbihcImNvbm5lY3RcIiwgb25Db25uZWN0LmJpbmQodGhpcywgeyBzb2NrZXROYW1lLCBzb2NrZXQgfSkpO1xuICAgICAgICBzb2NrZXQubW9uaXRvcigpO1xuICAgICAgfTtcblxuICAgICAgbW9uaXRvcihcInNoZWxsU29ja2V0XCIsIHRoaXMuc2hlbGxTb2NrZXQpO1xuICAgICAgbW9uaXRvcihcImNvbnRyb2xTb2NrZXRcIiwgdGhpcy5jb250cm9sU29ja2V0KTtcbiAgICAgIG1vbml0b3IoXCJpb1NvY2tldFwiLCB0aGlzLmlvU29ja2V0KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJaTVFLZXJuZWw6XCIsIGVycik7XG4gICAgfVxuICB9XG5cbiAgaW50ZXJydXB0KCkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFwiQ2Fubm90IGludGVycnVwdCB0aGlzIGtlcm5lbFwiLCB7XG4gICAgICAgIGRldGFpbDogXCJLZXJuZWwgaW50ZXJydXB0aW9uIGlzIGN1cnJlbnRseSBub3Qgc3VwcG9ydGVkIGluIFdpbmRvd3MuXCJcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2coXCJaTVFLZXJuZWw6IHNlbmRpbmcgU0lHSU5UXCIpO1xuICAgICAgdGhpcy5rZXJuZWxQcm9jZXNzLmtpbGwoXCJTSUdJTlRcIik7XG4gICAgfVxuICB9XG5cbiAgX2tpbGwoKSB7XG4gICAgbG9nKFwiWk1RS2VybmVsOiBzZW5kaW5nIFNJR0tJTExcIik7XG4gICAgdGhpcy5rZXJuZWxQcm9jZXNzLmtpbGwoXCJTSUdLSUxMXCIpO1xuICB9XG5cbiAgX2V4ZWN1dGVTdGFydHVwQ29kZSgpIHtcbiAgICBjb25zdCBkaXNwbGF5TmFtZSA9IHRoaXMua2VybmVsU3BlYy5kaXNwbGF5X25hbWU7XG4gICAgbGV0IHN0YXJ0dXBDb2RlID0gQ29uZmlnLmdldEpzb24oXCJzdGFydHVwQ29kZVwiKVtkaXNwbGF5TmFtZV07XG4gICAgaWYgKHN0YXJ0dXBDb2RlKSB7XG4gICAgICBsb2coXCJLZXJuZWxNYW5hZ2VyOiBFeGVjdXRpbmcgc3RhcnR1cCBjb2RlOlwiLCBzdGFydHVwQ29kZSk7XG4gICAgICBzdGFydHVwQ29kZSA9IGAke3N0YXJ0dXBDb2RlfSBcXG5gO1xuICAgICAgdGhpcy5leGVjdXRlKHN0YXJ0dXBDb2RlKTtcbiAgICB9XG4gIH1cblxuICBzaHV0ZG93bihyZXN0YXJ0OiA/Ym9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgcmVxdWVzdElkID0gYHNodXRkb3duXyR7djQoKX1gO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLl9jcmVhdGVNZXNzYWdlKFwic2h1dGRvd25fcmVxdWVzdFwiLCByZXF1ZXN0SWQpO1xuXG4gICAgbWVzc2FnZS5jb250ZW50ID0geyByZXN0YXJ0IH07XG5cbiAgICB0aGlzLnNoZWxsU29ja2V0LnNlbmQobmV3IE1lc3NhZ2UobWVzc2FnZSkpO1xuICB9XG5cbiAgcmVzdGFydChvblJlc3RhcnRlZDogP0Z1bmN0aW9uKSB7XG4gICAgaWYgKHRoaXMuZXhlY3V0aW9uU3RhdGUgPT09IFwicmVzdGFydGluZ1wiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc2V0RXhlY3V0aW9uU3RhdGUoXCJyZXN0YXJ0aW5nXCIpO1xuICAgIHRoaXMuc2h1dGRvd24odHJ1ZSk7XG4gICAgdGhpcy5fa2lsbCgpO1xuICAgIGNvbnN0IHsgc3Bhd24gfSA9IGxhdW5jaFNwZWNGcm9tQ29ubmVjdGlvbkluZm8oXG4gICAgICB0aGlzLmtlcm5lbFNwZWMsXG4gICAgICB0aGlzLmNvbm5lY3Rpb24sXG4gICAgICB0aGlzLmNvbm5lY3Rpb25GaWxlLFxuICAgICAgdGhpcy5vcHRpb25zXG4gICAgKTtcbiAgICB0aGlzLmtlcm5lbFByb2Nlc3MgPSBzcGF3bjtcbiAgICB0aGlzLm1vbml0b3IoKCkgPT4ge1xuICAgICAgaWYgKG9uUmVzdGFydGVkKSBvblJlc3RhcnRlZCh0aGlzKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIG9uUmVzdWx0cyBpcyBhIGNhbGxiYWNrIHRoYXQgbWF5IGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lc1xuICAvLyBhcyByZXN1bHRzIGNvbWUgaW4gZnJvbSB0aGUga2VybmVsXG4gIF9leGVjdXRlKGNvZGU6IHN0cmluZywgcmVxdWVzdElkOiBzdHJpbmcsIG9uUmVzdWx0czogP0Z1bmN0aW9uKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuX2NyZWF0ZU1lc3NhZ2UoXCJleGVjdXRlX3JlcXVlc3RcIiwgcmVxdWVzdElkKTtcblxuICAgIG1lc3NhZ2UuY29udGVudCA9IHtcbiAgICAgIGNvZGUsXG4gICAgICBzaWxlbnQ6IGZhbHNlLFxuICAgICAgc3RvcmVfaGlzdG9yeTogdHJ1ZSxcbiAgICAgIHVzZXJfZXhwcmVzc2lvbnM6IHt9LFxuICAgICAgYWxsb3dfc3RkaW46IHRydWVcbiAgICB9O1xuXG4gICAgdGhpcy5leGVjdXRpb25DYWxsYmFja3NbcmVxdWVzdElkXSA9IG9uUmVzdWx0cztcblxuICAgIHRoaXMuc2hlbGxTb2NrZXQuc2VuZChuZXcgTWVzc2FnZShtZXNzYWdlKSk7XG4gIH1cblxuICBleGVjdXRlKGNvZGU6IHN0cmluZywgb25SZXN1bHRzOiA/RnVuY3Rpb24pIHtcbiAgICBsb2coXCJLZXJuZWwuZXhlY3V0ZTpcIiwgY29kZSk7XG5cbiAgICBjb25zdCByZXF1ZXN0SWQgPSBgZXhlY3V0ZV8ke3Y0KCl9YDtcbiAgICB0aGlzLl9leGVjdXRlKGNvZGUsIHJlcXVlc3RJZCwgb25SZXN1bHRzKTtcbiAgfVxuXG4gIGV4ZWN1dGVXYXRjaChjb2RlOiBzdHJpbmcsIG9uUmVzdWx0czogRnVuY3Rpb24pIHtcbiAgICBsb2coXCJLZXJuZWwuZXhlY3V0ZVdhdGNoOlwiLCBjb2RlKTtcblxuICAgIGNvbnN0IHJlcXVlc3RJZCA9IGB3YXRjaF8ke3Y0KCl9YDtcbiAgICB0aGlzLl9leGVjdXRlKGNvZGUsIHJlcXVlc3RJZCwgb25SZXN1bHRzKTtcbiAgfVxuXG4gIGNvbXBsZXRlKGNvZGU6IHN0cmluZywgb25SZXN1bHRzOiBGdW5jdGlvbikge1xuICAgIGxvZyhcIktlcm5lbC5jb21wbGV0ZTpcIiwgY29kZSk7XG5cbiAgICBjb25zdCByZXF1ZXN0SWQgPSBgY29tcGxldGVfJHt2NCgpfWA7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5fY3JlYXRlTWVzc2FnZShcImNvbXBsZXRlX3JlcXVlc3RcIiwgcmVxdWVzdElkKTtcblxuICAgIG1lc3NhZ2UuY29udGVudCA9IHtcbiAgICAgIGNvZGUsXG4gICAgICB0ZXh0OiBjb2RlLFxuICAgICAgbGluZTogY29kZSxcbiAgICAgIGN1cnNvcl9wb3M6IGNvZGUubGVuZ3RoXG4gICAgfTtcblxuICAgIHRoaXMuZXhlY3V0aW9uQ2FsbGJhY2tzW3JlcXVlc3RJZF0gPSBvblJlc3VsdHM7XG5cbiAgICB0aGlzLnNoZWxsU29ja2V0LnNlbmQobmV3IE1lc3NhZ2UobWVzc2FnZSkpO1xuICB9XG5cbiAgaW5zcGVjdChjb2RlOiBzdHJpbmcsIGN1cnNvclBvczogbnVtYmVyLCBvblJlc3VsdHM6IEZ1bmN0aW9uKSB7XG4gICAgbG9nKFwiS2VybmVsLmluc3BlY3Q6XCIsIGNvZGUsIGN1cnNvclBvcyk7XG5cbiAgICBjb25zdCByZXF1ZXN0SWQgPSBgaW5zcGVjdF8ke3Y0KCl9YDtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLl9jcmVhdGVNZXNzYWdlKFwiaW5zcGVjdF9yZXF1ZXN0XCIsIHJlcXVlc3RJZCk7XG5cbiAgICBtZXNzYWdlLmNvbnRlbnQgPSB7XG4gICAgICBjb2RlLFxuICAgICAgY3Vyc29yX3BvczogY3Vyc29yUG9zLFxuICAgICAgZGV0YWlsX2xldmVsOiAwXG4gICAgfTtcblxuICAgIHRoaXMuZXhlY3V0aW9uQ2FsbGJhY2tzW3JlcXVlc3RJZF0gPSBvblJlc3VsdHM7XG5cbiAgICB0aGlzLnNoZWxsU29ja2V0LnNlbmQobmV3IE1lc3NhZ2UobWVzc2FnZSkpO1xuICB9XG5cbiAgaW5wdXRSZXBseShpbnB1dDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVxdWVzdElkID0gYGlucHV0X3JlcGx5XyR7djQoKX1gO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuX2NyZWF0ZU1lc3NhZ2UoXCJpbnB1dF9yZXBseVwiLCByZXF1ZXN0SWQpO1xuXG4gICAgbWVzc2FnZS5jb250ZW50ID0geyB2YWx1ZTogaW5wdXQgfTtcblxuICAgIHRoaXMuc3RkaW5Tb2NrZXQuc2VuZChuZXcgTWVzc2FnZShtZXNzYWdlKSk7XG4gIH1cblxuICBvblNoZWxsTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlKSB7XG4gICAgbG9nKFwic2hlbGwgbWVzc2FnZTpcIiwgbWVzc2FnZSk7XG5cbiAgICBpZiAoIXRoaXMuX2lzVmFsaWRNZXNzYWdlKG1lc3NhZ2UpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBtc2dfaWQgfSA9IG1lc3NhZ2UucGFyZW50X2hlYWRlcjtcbiAgICBsZXQgY2FsbGJhY2s7XG4gICAgaWYgKG1zZ19pZCkge1xuICAgICAgY2FsbGJhY2sgPSB0aGlzLmV4ZWN1dGlvbkNhbGxiYWNrc1ttc2dfaWRdO1xuICAgIH1cblxuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IHN0YXR1cyB9ID0gbWVzc2FnZS5jb250ZW50O1xuICAgIGlmIChzdGF0dXMgPT09IFwiZXJyb3JcIikge1xuICAgICAgY2FsbGJhY2soe1xuICAgICAgICBkYXRhOiBcImVycm9yXCIsXG4gICAgICAgIHN0cmVhbTogXCJzdGF0dXNcIlxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IFwib2tcIikge1xuICAgICAgY29uc3QgeyBtc2dfdHlwZSB9ID0gbWVzc2FnZS5oZWFkZXI7XG5cbiAgICAgIGlmIChtc2dfdHlwZSA9PT0gXCJleGVjdXRpb25fcmVwbHlcIikge1xuICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgZGF0YTogXCJva1wiLFxuICAgICAgICAgIHN0cmVhbTogXCJzdGF0dXNcIlxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAobXNnX3R5cGUgPT09IFwiY29tcGxldGVfcmVwbHlcIikge1xuICAgICAgICBjYWxsYmFjayhtZXNzYWdlLmNvbnRlbnQpO1xuICAgICAgfSBlbHNlIGlmIChtc2dfdHlwZSA9PT0gXCJpbnNwZWN0X3JlcGx5XCIpIHtcbiAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgIGRhdGE6IG1lc3NhZ2UuY29udGVudC5kYXRhLFxuICAgICAgICAgIGZvdW5kOiBtZXNzYWdlLmNvbnRlbnQuZm91bmRcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgZGF0YTogXCJva1wiLFxuICAgICAgICAgIHN0cmVhbTogXCJzdGF0dXNcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvblN0ZGluTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlKSB7XG4gICAgbG9nKFwic3RkaW4gbWVzc2FnZTpcIiwgbWVzc2FnZSk7XG5cbiAgICBpZiAoIXRoaXMuX2lzVmFsaWRNZXNzYWdlKG1lc3NhZ2UpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBtc2dfdHlwZSB9ID0gbWVzc2FnZS5oZWFkZXI7XG5cbiAgICBpZiAobXNnX3R5cGUgPT09IFwiaW5wdXRfcmVxdWVzdFwiKSB7XG4gICAgICBjb25zdCB7IHByb21wdCB9ID0gbWVzc2FnZS5jb250ZW50O1xuXG4gICAgICBjb25zdCBpbnB1dFZpZXcgPSBuZXcgSW5wdXRWaWV3KHsgcHJvbXB0IH0sIChpbnB1dDogc3RyaW5nKSA9PlxuICAgICAgICB0aGlzLmlucHV0UmVwbHkoaW5wdXQpXG4gICAgICApO1xuXG4gICAgICBpbnB1dFZpZXcuYXR0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgb25JT01lc3NhZ2UobWVzc2FnZTogTWVzc2FnZSkge1xuICAgIGxvZyhcIklPIG1lc3NhZ2U6XCIsIG1lc3NhZ2UpO1xuXG4gICAgaWYgKCF0aGlzLl9pc1ZhbGlkTWVzc2FnZShtZXNzYWdlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgbXNnX3R5cGUgfSA9IG1lc3NhZ2UuaGVhZGVyO1xuXG4gICAgaWYgKG1zZ190eXBlID09PSBcInN0YXR1c1wiKSB7XG4gICAgICBjb25zdCBzdGF0dXMgPSBtZXNzYWdlLmNvbnRlbnQuZXhlY3V0aW9uX3N0YXRlO1xuICAgICAgdGhpcy5zZXRFeGVjdXRpb25TdGF0ZShzdGF0dXMpO1xuXG4gICAgICBjb25zdCBtc2dfaWQgPSBtZXNzYWdlLnBhcmVudF9oZWFkZXJcbiAgICAgICAgPyBtZXNzYWdlLnBhcmVudF9oZWFkZXIubXNnX2lkXG4gICAgICAgIDogbnVsbDtcbiAgICAgIGlmIChtc2dfaWQgJiYgc3RhdHVzID09PSBcImlkbGVcIiAmJiBtc2dfaWQuc3RhcnRzV2l0aChcImV4ZWN1dGVcIikpIHtcbiAgICAgICAgdGhpcy5fY2FsbFdhdGNoQ2FsbGJhY2tzKCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBtc2dfaWQgfSA9IG1lc3NhZ2UucGFyZW50X2hlYWRlcjtcbiAgICBsZXQgY2FsbGJhY2s7XG4gICAgaWYgKG1zZ19pZCkge1xuICAgICAgY2FsbGJhY2sgPSB0aGlzLmV4ZWN1dGlvbkNhbGxiYWNrc1ttc2dfaWRdO1xuICAgIH1cblxuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9wYXJzZUlPTWVzc2FnZShtZXNzYWdlKTtcblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgX2lzVmFsaWRNZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2UpIHtcbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogbnVsbFwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIW1lc3NhZ2UuY29udGVudCkge1xuICAgICAgbG9nKFwiSW52YWxpZCBtZXNzYWdlOiBNaXNzaW5nIGNvbnRlbnRcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UuY29udGVudC5leGVjdXRpb25fc3RhdGUgPT09IFwic3RhcnRpbmdcIikge1xuICAgICAgLy8gS2VybmVscyBzZW5kIGEgc3RhcnRpbmcgc3RhdHVzIG1lc3NhZ2Ugd2l0aCBhbiBlbXB0eSBwYXJlbnRfaGVhZGVyXG4gICAgICBsb2coXCJEcm9wcGVkIHN0YXJ0aW5nIHN0YXR1cyBJTyBtZXNzYWdlXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5wYXJlbnRfaGVhZGVyKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgcGFyZW50X2hlYWRlclwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIW1lc3NhZ2UucGFyZW50X2hlYWRlci5tc2dfaWQpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBwYXJlbnRfaGVhZGVyLm1zZ19pZFwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIW1lc3NhZ2UucGFyZW50X2hlYWRlci5tc2dfdHlwZSkge1xuICAgICAgbG9nKFwiSW52YWxpZCBtZXNzYWdlOiBNaXNzaW5nIHBhcmVudF9oZWFkZXIubXNnX3R5cGVcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFtZXNzYWdlLmhlYWRlcikge1xuICAgICAgbG9nKFwiSW52YWxpZCBtZXNzYWdlOiBNaXNzaW5nIGhlYWRlclwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIW1lc3NhZ2UuaGVhZGVyLm1zZ19pZCkge1xuICAgICAgbG9nKFwiSW52YWxpZCBtZXNzYWdlOiBNaXNzaW5nIGhlYWRlci5tc2dfaWRcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFtZXNzYWdlLmhlYWRlci5tc2dfdHlwZSkge1xuICAgICAgbG9nKFwiSW52YWxpZCBtZXNzYWdlOiBNaXNzaW5nIGhlYWRlci5tc2dfdHlwZVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgbG9nKFwiWk1RS2VybmVsOiBkZXN0cm95OlwiLCB0aGlzKTtcblxuICAgIHRoaXMuc2h1dGRvd24oKTtcblxuICAgIHRoaXMuX2tpbGwoKTtcbiAgICBmcy51bmxpbmtTeW5jKHRoaXMuY29ubmVjdGlvbkZpbGUpO1xuXG4gICAgdGhpcy5zaGVsbFNvY2tldC5jbG9zZSgpO1xuICAgIHRoaXMuY29udHJvbFNvY2tldC5jbG9zZSgpO1xuICAgIHRoaXMuaW9Tb2NrZXQuY2xvc2UoKTtcbiAgICB0aGlzLnN0ZGluU29ja2V0LmNsb3NlKCk7XG5cbiAgICBzdXBlci5kZXN0cm95KCk7XG4gIH1cblxuICBfZ2V0VXNlcm5hbWUoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHByb2Nlc3MuZW52LkxPR05BTUUgfHxcbiAgICAgIHByb2Nlc3MuZW52LlVTRVIgfHxcbiAgICAgIHByb2Nlc3MuZW52LkxOQU1FIHx8XG4gICAgICBwcm9jZXNzLmVudi5VU0VSTkFNRVxuICAgICk7XG4gIH1cblxuICBfY3JlYXRlTWVzc2FnZShtc2dUeXBlOiBzdHJpbmcsIG1zZ0lkOiBzdHJpbmcgPSB2NCgpKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgIGhlYWRlcjoge1xuICAgICAgICB1c2VybmFtZTogdGhpcy5fZ2V0VXNlcm5hbWUoKSxcbiAgICAgICAgc2Vzc2lvbjogXCIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDBcIixcbiAgICAgICAgbXNnX3R5cGU6IG1zZ1R5cGUsXG4gICAgICAgIG1zZ19pZDogbXNnSWQsXG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgIHZlcnNpb246IFwiNS4wXCJcbiAgICAgIH0sXG4gICAgICBtZXRhZGF0YToge30sXG4gICAgICBwYXJlbnRfaGVhZGVyOiB7fSxcbiAgICAgIGNvbnRlbnQ6IHt9XG4gICAgfTtcblxuICAgIHJldHVybiBtZXNzYWdlO1xuICB9XG59XG4iXX0=