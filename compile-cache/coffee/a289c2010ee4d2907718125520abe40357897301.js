(function() {
  var Breakpoint, BreakpointManager, Client, Debugger, Event, EventEmitter, NodeDebuggerView, ProcessManager, Promise, R, childprocess, fs, jumpToBreakpoint, kill, log, logger, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  R = require('ramda');

  path = require('path');

  kill = require('tree-kill');

  Promise = require('bluebird');

  Client = require('_debugger').Client;

  childprocess = require('child_process');

  EventEmitter = require('./eventing').EventEmitter;

  Event = require('geval/event');

  logger = require('./logger');

  fs = require('fs');

  NodeDebuggerView = require('./node-debugger-view');

  jumpToBreakpoint = require('./jump-to-breakpoint');

  log = function(msg) {};

  ProcessManager = (function(superClass) {
    extend(ProcessManager, superClass);

    function ProcessManager(atom1) {
      this.atom = atom1 != null ? atom1 : atom;
      ProcessManager.__super__.constructor.call(this);
      this.process = null;
    }

    ProcessManager.prototype.parseEnv = function(env) {
      var e, j, key, len, ref1, result, value;
      if (!env) {
        return null;
      }
      key = function(s) {
        return s.split("=")[0];
      };
      value = function(s) {
        return s.split("=")[1];
      };
      result = {};
      ref1 = env.split(";");
      for (j = 0, len = ref1.length; j < len; j++) {
        e = ref1[j];
        result[key(e)] = value(e);
      }
      return result;
    };

    ProcessManager.prototype.startActiveFile = function() {
      return this.start(true);
    };

    ProcessManager.prototype.start = function(withActiveFile) {
      var startActive;
      startActive = withActiveFile;
      return this.cleanup().then((function(_this) {
        return function() {
          var appArgs, appPath, args, cwd, dbgFile, editor, env, nodeArgs, nodePath, packageJSON, packagePath, port, scriptMain;
          packagePath = _this.atom.project.resolvePath('package.json');
          if (fs.existsSync(packagePath)) {
            packageJSON = JSON.parse(fs.readFileSync(packagePath));
          }
          nodePath = _this.atom.config.get('node-debugger.nodePath');
          nodeArgs = _this.atom.config.get('node-debugger.nodeArgs');
          appArgs = _this.atom.config.get('node-debugger.appArgs');
          port = _this.atom.config.get('node-debugger.debugPort');
          env = _this.parseEnv(_this.atom.config.get('node-debugger.env'));
          scriptMain = _this.atom.project.resolvePath(_this.atom.config.get('node-debugger.scriptMain'));
          dbgFile = scriptMain || packageJSON && _this.atom.project.resolvePath(packageJSON.main);
          if (startActive === true || !dbgFile) {
            editor = _this.atom.workspace.getActiveTextEditor();
            appPath = editor.getPath();
            dbgFile = appPath;
          }
          cwd = path.dirname(dbgFile);
          args = [];
          if (nodeArgs) {
            args = args.concat(nodeArgs.split(' '));
          }
          args.push("--debug-brk=" + port);
          args.push(dbgFile);
          if (appArgs) {
            args = args.concat(appArgs.split(' '));
          }
          logger.error('spawn', {
            args: args,
            env: env
          });
          _this.process = childprocess.spawn(nodePath, args, {
            detached: true,
            cwd: cwd,
            env: env ? env : void 0
          });
          _this.process.stdout.on('data', function(d) {
            return logger.info('child_process', d.toString());
          });
          _this.process.stderr.on('data', function(d) {
            return logger.info('child_process', d.toString());
          });
          _this.process.stdout.on('end', function() {
            return logger.info('child_process', 'end out');
          });
          _this.process.stderr.on('end', function() {
            return logger.info('child_process', 'end error');
          });
          _this.emit('processCreated', _this.process);
          _this.process.once('error', function(err) {
            switch (err.code) {
              case "ENOENT":
                logger.error('child_process', "ENOENT exit code. Message: " + err.message);
                atom.notifications.addError("Failed to start debugger. Exit code was ENOENT which indicates that the node executable could not be found. Try specifying an explicit path in your atom config file using the node-debugger.nodePath configuration setting.");
                break;
              default:
                logger.error('child_process', "Exit code " + err.code + ". " + err.message);
            }
            return _this.emit('processEnd', err);
          });
          _this.process.once('close', function() {
            logger.info('child_process', 'close');
            return _this.emit('processEnd', _this.process);
          });
          _this.process.once('disconnect', function() {
            logger.info('child_process', 'disconnect');
            return _this.emit('processEnd', _this.process);
          });
          return _this.process;
        };
      })(this));
    };

    ProcessManager.prototype.cleanup = function() {
      var self;
      self = this;
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var onProcessEnd;
          if (_this.process == null) {
            return resolve();
          }
          if (_this.process.exitCode) {
            logger.info('child_process', 'process already exited with code ' + _this.process.exitCode);
            _this.process = null;
            return resolve();
          }
          onProcessEnd = R.once(function() {
            logger.info('child_process', 'die');
            _this.emit('processEnd', _this.process);
            _this.process = null;
            return resolve();
          });
          logger.info('child_process', 'start killing process');
          kill(_this.process.pid);
          _this.process.once('disconnect', onProcessEnd);
          _this.process.once('exit', onProcessEnd);
          return _this.process.once('close', onProcessEnd);
        };
      })(this));
    };

    return ProcessManager;

  })(EventEmitter);

  Breakpoint = (function() {
    function Breakpoint(editor1, script1, line1) {
      this.editor = editor1;
      this.script = script1;
      this.line = line1;
      this.updateVisualization = bind(this.updateVisualization, this);
      this.clearId = bind(this.clearId, this);
      this.setId = bind(this.setId, this);
      this.marker = null;
      this.marker = this.editor.markBufferPosition([this.line, 0], {
        invalidate: 'never'
      });
      this.decoration = null;
      this.onDidChangeSubscription = this.marker.onDidChange((function(_this) {
        return function(event) {
          log("Breakpoint.markerchanged: " + event.newHeadBufferPosition);
          return _this.line = event.newHeadBufferPosition.row;
        };
      })(this));
      this.onDidDestroySubscription = this.marker.onDidDestroy((function(_this) {
        return function() {
          _this.marker = null;
          return _this.decoration = null;
        };
      })(this));
      this.id = null;
      this.updateVisualization();
    }

    Breakpoint.prototype.dispose = function() {
      this.onDidChangeSubscription.dispose();
      this.onDidDestroySubscription.dispose();
      this.id = null;
      if (this.decoration) {
        this.decoration.destroy();
      }
      this.decoration = null;
      if (this.marker) {
        this.marker.destroy();
      }
      return this.marker = null;
    };

    Breakpoint.prototype.setId = function(id1) {
      this.id = id1;
      return this.updateVisualization();
    };

    Breakpoint.prototype.clearId = function() {
      return this.setId(null);
    };

    Breakpoint.prototype.updateVisualization = function() {
      var className;
      if (this.decoration) {
        this.decoration.destroy();
      }
      className = this.id ? 'node-debugger-attached-breakpoint' : 'node-debugger-detached-breakpoint';
      if (this.marker) {
        return this.decoration = this.editor.decorateMarker(this.marker, {
          type: 'line-number',
          "class": className
        });
      }
    };

    return Breakpoint;

  })();

  BreakpointManager = (function() {
    function BreakpointManager(_debugger) {
      this["debugger"] = _debugger;
      log("BreakpointManager.constructor");
      this.breakpoints = [];
      this.client = null;
      this.removeOnConnected = this["debugger"].subscribe('connected', (function(_this) {
        return function() {
          var breakpoint, j, len, ref1, results;
          log("BreakpointManager.connected");
          _this.client = _this["debugger"].client;
          ref1 = _this.breakpoints;
          results = [];
          for (j = 0, len = ref1.length; j < len; j++) {
            breakpoint = ref1[j];
            results.push(_this.attachBreakpoint(breakpoint));
          }
          return results;
        };
      })(this));
      this.removeOnDisconnected = this["debugger"].subscribe('disconnected', (function(_this) {
        return function() {
          var breakpoint, j, len, ref1, results;
          log("BreakpointManager.disconnected");
          _this.client = null;
          ref1 = _this.breakpoints;
          results = [];
          for (j = 0, len = ref1.length; j < len; j++) {
            breakpoint = ref1[j];
            results.push(breakpoint.clearId());
          }
          return results;
        };
      })(this));
      this.onAddBreakpointEvent = Event();
      this.onRemoveBreakpointEvent = Event();
    }

    BreakpointManager.prototype.dispose = function() {
      if (this.removeOnConnected) {
        this.removeOnConnected();
      }
      this.removeOnConnected = null;
      if (this.removeOnDisconnected) {
        this.removeOnDisconnected();
      }
      return this.removeOnDisconnected = null;
    };

    BreakpointManager.prototype.toggleBreakpoint = function(editor, script, line) {
      var maybeBreakpoint;
      log("BreakpointManager.toggleBreakpoint " + script + ", " + line);
      maybeBreakpoint = this.tryFindBreakpoint(script, line);
      if (maybeBreakpoint) {
        return this.removeBreakpoint(maybeBreakpoint.breakpoint, maybeBreakpoint.index);
      } else {
        return this.addBreakpoint(editor, script, line);
      }
    };

    BreakpointManager.prototype.removeBreakpoint = function(breakpoint, index) {
      log("BreakpointManager.removeBreakpoint " + index);
      this.breakpoints.splice(index, 1);
      this.onRemoveBreakpointEvent.broadcast(breakpoint);
      this.detachBreakpoint(breakpoint.id);
      return breakpoint.dispose();
    };

    BreakpointManager.prototype.addBreakpoint = function(editor, script, line) {
      var breakpoint;
      log("BreakpointManager.addBreakpoint " + script + ", " + line);
      breakpoint = new Breakpoint(editor, script, line);
      log("BreakpointManager.addBreakpoint - adding to list");
      this.breakpoints.push(breakpoint);
      log("BreakpointManager.addBreakpoint - publishing event, num breakpoints=" + this.breakpoints.length);
      this.onAddBreakpointEvent.broadcast(breakpoint);
      log("BreakpointManager.addBreakpoint - attaching");
      return this.attachBreakpoint(breakpoint);
    };

    BreakpointManager.prototype.attachBreakpoint = function(breakpoint) {
      var self;
      log("BreakpointManager.attachBreakpoint");
      self = this;
      return new Promise(function(resolve, reject) {
        if (!self.client) {
          return resolve();
        }
        log("BreakpointManager.attachBreakpoint - client request");
        return self.client.setBreakpoint({
          type: 'script',
          target: breakpoint.script,
          line: breakpoint.line,
          condition: breakpoint.condition
        }, function(err, res) {
          log("BreakpointManager.attachBreakpoint - done");
          if (err) {
            breakpoint.clearId();
            return reject(err);
          } else {
            breakpoint.setId(res.breakpoint);
            return resolve(breakpoint);
          }
        });
      });
    };

    BreakpointManager.prototype.detachBreakpoint = function(breakpointId) {
      var self;
      log("BreakpointManager.detachBreakpoint");
      self = this;
      return new Promise(function(resolve, reject) {
        if (!self.client) {
          return resolve();
        }
        if (!breakpointId) {
          return resolve();
        }
        log("BreakpointManager.detachBreakpoint - client request");
        return self.client.clearBreakpoint({
          breakpoint: breakpointId
        }, function(err) {
          return resolve();
        });
      });
    };

    BreakpointManager.prototype.tryFindBreakpoint = function(script, line) {
      var breakpoint, i, j, len, ref1;
      ref1 = this.breakpoints;
      for (i = j = 0, len = ref1.length; j < len; i = ++j) {
        breakpoint = ref1[i];
        if (breakpoint.script === script && breakpoint.line === line) {
          return {
            breakpoint: breakpoint,
            index: i
          };
        }
      }
    };

    return BreakpointManager;

  })();

  Debugger = (function(superClass) {
    extend(Debugger, superClass);

    function Debugger(atom1) {
      this.atom = atom1;
      this.toggle = bind(this.toggle, this);
      this.isConnected = bind(this.isConnected, this);
      this.cleanupInternal = bind(this.cleanupInternal, this);
      this.cleanup = bind(this.cleanup, this);
      this.bindEvents = bind(this.bindEvents, this);
      this.attachInternal = bind(this.attachInternal, this);
      this.attach = bind(this.attach, this);
      this.startActiveFile = bind(this.startActiveFile, this);
      this.start = bind(this.start, this);
      this.setSelectedFrame = bind(this.setSelectedFrame, this);
      this.getSelectedFrame = bind(this.getSelectedFrame, this);
      Debugger.__super__.constructor.call(this);
      this.client = null;
      this.breakpointManager = new BreakpointManager(this);
      this.onBreakEvent = Event();
      this.onBreak = this.onBreakEvent.listen;
      this.onAddBreakpoint = this.breakpointManager.onAddBreakpointEvent.listen;
      this.onRemoveBreakpoint = this.breakpointManager.onRemoveBreakpointEvent.listen;
      this.processManager = new ProcessManager(this.atom);
      this.processManager.on('processCreated', this.attachInternal);
      this.processManager.on('processEnd', this.cleanupInternal);
      this.onSelectedFrameEvent = Event();
      this.onSelectedFrame = this.onSelectedFrameEvent.listen;
      this.selectedFrame = null;
      jumpToBreakpoint(this);
    }

    Debugger.prototype.getSelectedFrame = function() {
      return this.selectedFrame;
    };

    Debugger.prototype.setSelectedFrame = function(frame, index) {
      this.selectedFrame = {
        frame: frame,
        index: index
      };
      return this.onSelectedFrameEvent.broadcast(this.selectedFrame);
    };

    Debugger.prototype.dispose = function() {
      if (this.breakpointManager) {
        this.breakpointManager.dispose();
      }
      this.breakpointManager = null;
      NodeDebuggerView.destroy();
      return jumpToBreakpoint.destroy();
    };

    Debugger.prototype.stopRetrying = function() {
      if (this.timeout == null) {
        return;
      }
      return clearTimeout(this.timeout);
    };

    Debugger.prototype.step = function(type, count) {
      var self;
      self = this;
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.client.step(type, count, function(err) {
            if (err) {
              return reject(err);
            }
            return resolve();
          });
        };
      })(this));
    };

    Debugger.prototype.reqContinue = function() {
      var self;
      self = this;
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.client.req({
            command: 'continue'
          }, function(err) {
            if (err) {
              return reject(err);
            }
            return resolve();
          });
        };
      })(this));
    };

    Debugger.prototype.getScriptById = function(id) {
      var self;
      self = this;
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.client.req({
            command: 'scripts',
            "arguments": {
              ids: [id],
              includeSource: true
            }
          }, function(err, res) {
            if (err) {
              return reject(err);
            }
            return resolve(res[0]);
          });
        };
      })(this));
    };

    Debugger.prototype.fullTrace = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.client.fullTrace(function(err, res) {
            if (err) {
              return reject(err);
            }
            return resolve(res);
          });
        };
      })(this));
    };

    Debugger.prototype.start = function() {
      this.debugHost = "127.0.0.1";
      this.debugPort = this.atom.config.get('node-debugger.debugPort');
      this.externalProcess = false;
      NodeDebuggerView.show(this);
      return this.processManager.start();
    };

    Debugger.prototype.startActiveFile = function() {
      this.debugHost = "127.0.0.1";
      this.debugPort = this.atom.config.get('node-debugger.debugPort');
      this.externalProcess = false;
      NodeDebuggerView.show(this);
      return this.processManager.startActiveFile();
    };

    Debugger.prototype.attach = function() {
      this.debugHost = this.atom.config.get('node-debugger.debugHost');
      this.debugPort = this.atom.config.get('node-debugger.debugPort');
      this.externalProcess = true;
      NodeDebuggerView.show(this);
      return this.attachInternal();
    };

    Debugger.prototype.attachInternal = function() {
      var attemptConnect, attemptConnectCount, onConnectionError, self;
      logger.info('debugger', 'start connect to process');
      self = this;
      attemptConnectCount = 0;
      attemptConnect = function() {
        logger.info('debugger', 'attempt to connect to child process');
        if (self.client == null) {
          logger.info('debugger', 'client has been cleanup');
          return;
        }
        attemptConnectCount++;
        return self.client.connect(self.debugPort, self.debugHost);
      };
      onConnectionError = (function(_this) {
        return function() {
          var timeout;
          logger.info('debugger', "trying to reconnect " + attemptConnectCount);
          timeout = 500;
          _this.emit('reconnect', {
            count: attemptConnectCount,
            port: self.debugPort,
            host: self.debugHost,
            timeout: timeout
          });
          return _this.timeout = setTimeout(function() {
            return attemptConnect();
          }, timeout);
        };
      })(this);
      this.client = new Client();
      this.client.once('ready', this.bindEvents);
      this.client.on('unhandledResponse', (function(_this) {
        return function(res) {
          return _this.emit('unhandledResponse', res);
        };
      })(this));
      this.client.on('break', (function(_this) {
        return function(res) {
          _this.onBreakEvent.broadcast(res.body);
          _this.emit('break', res.body);
          return _this.setSelectedFrame(null);
        };
      })(this));
      this.client.on('exception', (function(_this) {
        return function(res) {
          return _this.emit('exception', res.body);
        };
      })(this));
      this.client.on('error', onConnectionError);
      this.client.on('close', function() {
        return logger.info('client', 'client closed');
      });
      return attemptConnect();
    };

    Debugger.prototype.bindEvents = function() {
      logger.info('debugger', 'connected');
      this.emit('connected');
      return this.client.on('close', (function(_this) {
        return function() {
          logger.info('debugger', 'connection closed');
          return _this.processManager.cleanup().then(function() {
            return _this.emit('close');
          });
        };
      })(this));
    };

    Debugger.prototype.lookup = function(ref) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.client.reqLookup([ref], function(err, res) {
            if (err) {
              return reject(err);
            }
            return resolve(res[ref]);
          });
        };
      })(this));
    };

    Debugger.prototype["eval"] = function(text) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var ref1;
          return _this.client.reqFrameEval(text, ((ref1 = _this.selectedFrame) != null ? ref1.index : void 0) || 0, function(err, result) {
            if (err) {
              return reject(err);
            }
            return resolve(result);
          });
        };
      })(this));
    };

    Debugger.prototype.cleanup = function() {
      this.processManager.cleanup();
      NodeDebuggerView.destroy();
      return this.cleanupInternal();
    };

    Debugger.prototype.cleanupInternal = function() {
      if (this.client) {
        this.client.destroy();
      }
      this.client = null;
      jumpToBreakpoint.cleanup();
      return this.emit('disconnected');
    };

    Debugger.prototype.isConnected = function() {
      return this.client != null;
    };

    Debugger.prototype.toggle = function() {
      return NodeDebuggerView.toggle(this);
    };

    return Debugger;

  })(EventEmitter);

  exports.Debugger = Debugger;

  exports.ProcessManager = ProcessManager;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9kZWJ1Z2dlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLCtLQUFBO0lBQUE7Ozs7RUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLE9BQVI7O0VBQ0osSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLElBQUEsR0FBTyxPQUFBLENBQVEsV0FBUjs7RUFDUCxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVI7O0VBQ1QsU0FBVSxPQUFBLENBQVEsV0FBUjs7RUFDWCxZQUFBLEdBQWUsT0FBQSxDQUFRLGVBQVI7O0VBQ2QsZUFBZ0IsT0FBQSxDQUFRLFlBQVI7O0VBQ2pCLEtBQUEsR0FBUSxPQUFBLENBQVEsYUFBUjs7RUFDUixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBQ1QsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxzQkFBUjs7RUFDbkIsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHNCQUFSOztFQUVuQixHQUFBLEdBQU0sU0FBQyxHQUFELEdBQUE7O0VBRUE7OztJQUNTLHdCQUFDLEtBQUQ7TUFBQyxJQUFDLENBQUEsdUJBQUQsUUFBUTtNQUNwQiw4Q0FBQTtNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFGQTs7NkJBSWIsUUFBQSxHQUFVLFNBQUMsR0FBRDtBQUNSLFVBQUE7TUFBQSxJQUFBLENBQW1CLEdBQW5CO0FBQUEsZUFBTyxLQUFQOztNQUNBLEdBQUEsR0FBTSxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsS0FBRixDQUFRLEdBQVIsQ0FBYSxDQUFBLENBQUE7TUFBcEI7TUFDTixLQUFBLEdBQVEsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxHQUFSLENBQWEsQ0FBQSxDQUFBO01BQXBCO01BQ1IsTUFBQSxHQUFTO0FBQ1Q7QUFBQSxXQUFBLHNDQUFBOztRQUFBLE1BQU8sQ0FBQSxHQUFBLENBQUksQ0FBSixDQUFBLENBQVAsR0FBaUIsS0FBQSxDQUFNLENBQU47QUFBakI7QUFDQSxhQUFPO0lBTkM7OzZCQVFWLGVBQUEsR0FBaUIsU0FBQTthQUNmLElBQUMsQ0FBQSxLQUFELENBQU8sSUFBUDtJQURlOzs2QkFHakIsS0FBQSxHQUFPLFNBQUMsY0FBRDtBQUNMLFVBQUE7TUFBQSxXQUFBLEdBQWM7YUFDZCxJQUFDLENBQUEsT0FBRCxDQUFBLENBQ0UsQ0FBQyxJQURILENBQ1EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ0osY0FBQTtVQUFBLFdBQUEsR0FBYyxLQUFDLENBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFkLENBQTBCLGNBQTFCO1VBQ2QsSUFBMEQsRUFBRSxDQUFDLFVBQUgsQ0FBYyxXQUFkLENBQTFEO1lBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxLQUFMLENBQVcsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsV0FBaEIsQ0FBWCxFQUFkOztVQUNBLFFBQUEsR0FBVyxLQUFDLENBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFiLENBQWlCLHdCQUFqQjtVQUNYLFFBQUEsR0FBVyxLQUFDLENBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFiLENBQWlCLHdCQUFqQjtVQUNYLE9BQUEsR0FBVSxLQUFDLENBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFiLENBQWlCLHVCQUFqQjtVQUNWLElBQUEsR0FBTyxLQUFDLENBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFiLENBQWlCLHlCQUFqQjtVQUNQLEdBQUEsR0FBTSxLQUFDLENBQUEsUUFBRCxDQUFVLEtBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQWIsQ0FBaUIsbUJBQWpCLENBQVY7VUFDTixVQUFBLEdBQWEsS0FBQyxDQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBZCxDQUEwQixLQUFDLENBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFiLENBQWlCLDBCQUFqQixDQUExQjtVQUViLE9BQUEsR0FBVSxVQUFBLElBQWMsV0FBQSxJQUFlLEtBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQWQsQ0FBMEIsV0FBVyxDQUFDLElBQXRDO1VBRXZDLElBQUcsV0FBQSxLQUFlLElBQWYsSUFBdUIsQ0FBQyxPQUEzQjtZQUNFLE1BQUEsR0FBUyxLQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBaEIsQ0FBQTtZQUNULE9BQUEsR0FBVSxNQUFNLENBQUMsT0FBUCxDQUFBO1lBQ1YsT0FBQSxHQUFVLFFBSFo7O1VBS0EsR0FBQSxHQUFNLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBYjtVQUVOLElBQUEsR0FBTztVQUNQLElBQTRDLFFBQTVDO1lBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFMLENBQWEsUUFBUSxDQUFDLEtBQVQsQ0FBZSxHQUFmLENBQWIsRUFBUDs7VUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLGNBQUEsR0FBZSxJQUF6QjtVQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVjtVQUNBLElBQTJDLE9BQTNDO1lBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFMLENBQWEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxHQUFkLENBQWIsRUFBUDs7VUFFQSxNQUFNLENBQUMsS0FBUCxDQUFhLE9BQWIsRUFBc0I7WUFBQyxJQUFBLEVBQUssSUFBTjtZQUFZLEdBQUEsRUFBSSxHQUFoQjtXQUF0QjtVQUNBLEtBQUMsQ0FBQSxPQUFELEdBQVcsWUFBWSxDQUFDLEtBQWIsQ0FBbUIsUUFBbkIsRUFBNkIsSUFBN0IsRUFBbUM7WUFDNUMsUUFBQSxFQUFVLElBRGtDO1lBRTVDLEdBQUEsRUFBSyxHQUZ1QztZQUc1QyxHQUFBLEVBQVksR0FBUCxHQUFBLEdBQUEsR0FBQSxNQUh1QztXQUFuQztVQU1YLEtBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQWhCLENBQW1CLE1BQW5CLEVBQTJCLFNBQUMsQ0FBRDttQkFDekIsTUFBTSxDQUFDLElBQVAsQ0FBWSxlQUFaLEVBQTZCLENBQUMsQ0FBQyxRQUFGLENBQUEsQ0FBN0I7VUFEeUIsQ0FBM0I7VUFHQSxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFoQixDQUFtQixNQUFuQixFQUEyQixTQUFDLENBQUQ7bUJBQ3pCLE1BQU0sQ0FBQyxJQUFQLENBQVksZUFBWixFQUE2QixDQUFDLENBQUMsUUFBRixDQUFBLENBQTdCO1VBRHlCLENBQTNCO1VBR0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBaEIsQ0FBbUIsS0FBbkIsRUFBMEIsU0FBQTttQkFDeEIsTUFBTSxDQUFDLElBQVAsQ0FBWSxlQUFaLEVBQTZCLFNBQTdCO1VBRHdCLENBQTFCO1VBR0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBaEIsQ0FBbUIsS0FBbkIsRUFBMEIsU0FBQTttQkFDeEIsTUFBTSxDQUFDLElBQVAsQ0FBWSxlQUFaLEVBQTZCLFdBQTdCO1VBRHdCLENBQTFCO1VBR0EsS0FBQyxDQUFBLElBQUQsQ0FBTSxnQkFBTixFQUF3QixLQUFDLENBQUEsT0FBekI7VUFFQSxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxPQUFkLEVBQXVCLFNBQUMsR0FBRDtBQUNyQixvQkFBTyxHQUFHLENBQUMsSUFBWDtBQUFBLG1CQUNPLFFBRFA7Z0JBRUksTUFBTSxDQUFDLEtBQVAsQ0FBYSxlQUFiLEVBQThCLDZCQUFBLEdBQThCLEdBQUcsQ0FBQyxPQUFoRTtnQkFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQ0UsOE5BREY7QUFGRztBQURQO2dCQVdJLE1BQU0sQ0FBQyxLQUFQLENBQWEsZUFBYixFQUE4QixZQUFBLEdBQWEsR0FBRyxDQUFDLElBQWpCLEdBQXNCLElBQXRCLEdBQTBCLEdBQUcsQ0FBQyxPQUE1RDtBQVhKO21CQVlBLEtBQUMsQ0FBQSxJQUFELENBQU0sWUFBTixFQUFvQixHQUFwQjtVQWJxQixDQUF2QjtVQWVBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE9BQWQsRUFBdUIsU0FBQTtZQUNyQixNQUFNLENBQUMsSUFBUCxDQUFZLGVBQVosRUFBNkIsT0FBN0I7bUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTSxZQUFOLEVBQW9CLEtBQUMsQ0FBQSxPQUFyQjtVQUZxQixDQUF2QjtVQUlBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLFlBQWQsRUFBNEIsU0FBQTtZQUMxQixNQUFNLENBQUMsSUFBUCxDQUFZLGVBQVosRUFBNkIsWUFBN0I7bUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTSxZQUFOLEVBQW9CLEtBQUMsQ0FBQSxPQUFyQjtVQUYwQixDQUE1QjtBQUlBLGlCQUFPLEtBQUMsQ0FBQTtRQXJFSjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUjtJQUZLOzs2QkEwRVAsT0FBQSxHQUFTLFNBQUE7QUFDUCxVQUFBO01BQUEsSUFBQSxHQUFPO2FBQ1AsSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ1YsY0FBQTtVQUFBLElBQXdCLHFCQUF4QjtBQUFBLG1CQUFPLE9BQUEsQ0FBQSxFQUFQOztVQUNBLElBQUcsS0FBQyxDQUFBLE9BQU8sQ0FBQyxRQUFaO1lBQ0UsTUFBTSxDQUFDLElBQVAsQ0FBWSxlQUFaLEVBQTZCLG1DQUFBLEdBQXNDLEtBQUMsQ0FBQSxPQUFPLENBQUMsUUFBNUU7WUFDQSxLQUFDLENBQUEsT0FBRCxHQUFXO0FBQ1gsbUJBQU8sT0FBQSxDQUFBLEVBSFQ7O1VBS0EsWUFBQSxHQUFlLENBQUMsQ0FBQyxJQUFGLENBQU8sU0FBQTtZQUNwQixNQUFNLENBQUMsSUFBUCxDQUFZLGVBQVosRUFBNkIsS0FBN0I7WUFDQSxLQUFDLENBQUEsSUFBRCxDQUFNLFlBQU4sRUFBb0IsS0FBQyxDQUFBLE9BQXJCO1lBQ0EsS0FBQyxDQUFBLE9BQUQsR0FBVzttQkFDWCxPQUFBLENBQUE7VUFKb0IsQ0FBUDtVQU1mLE1BQU0sQ0FBQyxJQUFQLENBQVksZUFBWixFQUE2Qix1QkFBN0I7VUFDQSxJQUFBLENBQUssS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFkO1VBRUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsWUFBZCxFQUE0QixZQUE1QjtVQUNBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE1BQWQsRUFBc0IsWUFBdEI7aUJBQ0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsT0FBZCxFQUF1QixZQUF2QjtRQWxCVTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWjtJQUZPOzs7O0tBMUZrQjs7RUFnSHZCO0lBQ1Msb0JBQUMsT0FBRCxFQUFVLE9BQVYsRUFBbUIsS0FBbkI7TUFBQyxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxTQUFEO01BQVMsSUFBQyxDQUFBLE9BQUQ7Ozs7TUFDOUIsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUEyQixDQUFDLElBQUMsQ0FBQSxJQUFGLEVBQVEsQ0FBUixDQUEzQixFQUF1QztRQUFBLFVBQUEsRUFBWSxPQUFaO09BQXZDO01BQ1YsSUFBQyxDQUFBLFVBQUQsR0FBYztNQUNkLElBQUMsQ0FBQSx1QkFBRCxHQUEyQixJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7VUFDN0MsR0FBQSxDQUFJLDRCQUFBLEdBQTZCLEtBQUssQ0FBQyxxQkFBdkM7aUJBQ0EsS0FBQyxDQUFBLElBQUQsR0FBUSxLQUFLLENBQUMscUJBQXFCLENBQUM7UUFGUztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEI7TUFHM0IsSUFBQyxDQUFBLHdCQUFELEdBQTRCLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFxQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDL0MsS0FBQyxDQUFBLE1BQUQsR0FBVTtpQkFDVixLQUFDLENBQUEsVUFBRCxHQUFjO1FBRmlDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQjtNQUc1QixJQUFDLENBQUEsRUFBRCxHQUFNO01BQ04sSUFBQyxDQUFBLG1CQUFELENBQUE7SUFYVzs7eUJBYWIsT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsdUJBQXVCLENBQUMsT0FBekIsQ0FBQTtNQUNBLElBQUMsQ0FBQSx3QkFBd0IsQ0FBQyxPQUExQixDQUFBO01BQ0EsSUFBQyxDQUFBLEVBQUQsR0FBTTtNQUNOLElBQXlCLElBQUMsQ0FBQSxVQUExQjtRQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLEVBQUE7O01BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYztNQUNkLElBQXFCLElBQUMsQ0FBQSxNQUF0QjtRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLEVBQUE7O2FBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQVBIOzt5QkFTVCxLQUFBLEdBQU8sU0FBQyxHQUFEO01BQUMsSUFBQyxDQUFBLEtBQUQ7YUFDTixJQUFDLENBQUEsbUJBQUQsQ0FBQTtJQURLOzt5QkFHUCxPQUFBLEdBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxLQUFELENBQU8sSUFBUDtJQURPOzt5QkFHVCxtQkFBQSxHQUFxQixTQUFBO0FBQ25CLFVBQUE7TUFBQSxJQUF5QixJQUFDLENBQUEsVUFBMUI7UUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxFQUFBOztNQUNBLFNBQUEsR0FBZSxJQUFDLENBQUEsRUFBSixHQUFZLG1DQUFaLEdBQXFEO01BQ2pFLElBQXdGLElBQUMsQ0FBQSxNQUF6RjtlQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQXVCLElBQUMsQ0FBQSxNQUF4QixFQUFnQztVQUFBLElBQUEsRUFBTSxhQUFOO1VBQXFCLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBNUI7U0FBaEMsRUFBZDs7SUFIbUI7Ozs7OztFQUtqQjtJQUNTLDJCQUFDLFNBQUQ7TUFBQyxJQUFDLEVBQUEsUUFBQSxLQUFEO01BQ1osR0FBQSxDQUFJLCtCQUFKO01BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFDVixJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBQyxFQUFBLFFBQUEsRUFBUSxDQUFDLFNBQVYsQ0FBb0IsV0FBcEIsRUFBaUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ3BELGNBQUE7VUFBQSxHQUFBLENBQUksNkJBQUo7VUFDQSxLQUFDLENBQUEsTUFBRCxHQUFVLEtBQUMsRUFBQSxRQUFBLEVBQVEsQ0FBQztBQUNwQjtBQUFBO2VBQUEsc0NBQUE7O3lCQUFBLEtBQUMsQ0FBQSxnQkFBRCxDQUFrQixVQUFsQjtBQUFBOztRQUhvRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakM7TUFJckIsSUFBQyxDQUFBLG9CQUFELEdBQXdCLElBQUMsRUFBQSxRQUFBLEVBQVEsQ0FBQyxTQUFWLENBQW9CLGNBQXBCLEVBQW9DLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUMxRCxjQUFBO1VBQUEsR0FBQSxDQUFJLGdDQUFKO1VBQ0EsS0FBQyxDQUFBLE1BQUQsR0FBVTtBQUNWO0FBQUE7ZUFBQSxzQ0FBQTs7eUJBQUEsVUFBVSxDQUFDLE9BQVgsQ0FBQTtBQUFBOztRQUgwRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEM7TUFJeEIsSUFBQyxDQUFBLG9CQUFELEdBQXdCLEtBQUEsQ0FBQTtNQUN4QixJQUFDLENBQUEsdUJBQUQsR0FBMkIsS0FBQSxDQUFBO0lBYmhCOztnQ0FlYixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQXdCLElBQUMsQ0FBQSxpQkFBekI7UUFBQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUFBOztNQUNBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtNQUNyQixJQUEyQixJQUFDLENBQUEsb0JBQTVCO1FBQUEsSUFBQyxDQUFBLG9CQUFELENBQUEsRUFBQTs7YUFDQSxJQUFDLENBQUEsb0JBQUQsR0FBd0I7SUFKakI7O2dDQU1ULGdCQUFBLEdBQWtCLFNBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsSUFBakI7QUFDaEIsVUFBQTtNQUFBLEdBQUEsQ0FBSSxxQ0FBQSxHQUFzQyxNQUF0QyxHQUE2QyxJQUE3QyxHQUFpRCxJQUFyRDtNQUNBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLGlCQUFELENBQW1CLE1BQW5CLEVBQTJCLElBQTNCO01BQ2xCLElBQUcsZUFBSDtlQUNFLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixlQUFlLENBQUMsVUFBbEMsRUFBOEMsZUFBZSxDQUFDLEtBQTlELEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLGFBQUQsQ0FBZSxNQUFmLEVBQXVCLE1BQXZCLEVBQStCLElBQS9CLEVBSEY7O0lBSGdCOztnQ0FRbEIsZ0JBQUEsR0FBa0IsU0FBQyxVQUFELEVBQWEsS0FBYjtNQUNoQixHQUFBLENBQUkscUNBQUEsR0FBc0MsS0FBMUM7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsQ0FBb0IsS0FBcEIsRUFBMkIsQ0FBM0I7TUFDQSxJQUFDLENBQUEsdUJBQXVCLENBQUMsU0FBekIsQ0FBbUMsVUFBbkM7TUFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsVUFBVSxDQUFDLEVBQTdCO2FBQ0EsVUFBVSxDQUFDLE9BQVgsQ0FBQTtJQUxnQjs7Z0NBT2xCLGFBQUEsR0FBZSxTQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLElBQWpCO0FBQ2IsVUFBQTtNQUFBLEdBQUEsQ0FBSSxrQ0FBQSxHQUFtQyxNQUFuQyxHQUEwQyxJQUExQyxHQUE4QyxJQUFsRDtNQUNBLFVBQUEsR0FBYSxJQUFJLFVBQUosQ0FBZSxNQUFmLEVBQXVCLE1BQXZCLEVBQStCLElBQS9CO01BQ2IsR0FBQSxDQUFJLGtEQUFKO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFVBQWxCO01BQ0EsR0FBQSxDQUFJLHNFQUFBLEdBQXVFLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBeEY7TUFDQSxJQUFDLENBQUEsb0JBQW9CLENBQUMsU0FBdEIsQ0FBZ0MsVUFBaEM7TUFDQSxHQUFBLENBQUksNkNBQUo7YUFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsVUFBbEI7SUFSYTs7Z0NBVWYsZ0JBQUEsR0FBa0IsU0FBQyxVQUFEO0FBQ2hCLFVBQUE7TUFBQSxHQUFBLENBQUksb0NBQUo7TUFDQSxJQUFBLEdBQU87YUFDUCxJQUFJLE9BQUosQ0FBWSxTQUFDLE9BQUQsRUFBVSxNQUFWO1FBQ1YsSUFBQSxDQUF3QixJQUFJLENBQUMsTUFBN0I7QUFBQSxpQkFBTyxPQUFBLENBQUEsRUFBUDs7UUFDQSxHQUFBLENBQUkscURBQUo7ZUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBMEI7VUFDeEIsSUFBQSxFQUFNLFFBRGtCO1VBRXhCLE1BQUEsRUFBUSxVQUFVLENBQUMsTUFGSztVQUd4QixJQUFBLEVBQU0sVUFBVSxDQUFDLElBSE87VUFJeEIsU0FBQSxFQUFXLFVBQVUsQ0FBQyxTQUpFO1NBQTFCLEVBS0csU0FBQyxHQUFELEVBQU0sR0FBTjtVQUNELEdBQUEsQ0FBSSwyQ0FBSjtVQUNBLElBQUcsR0FBSDtZQUNFLFVBQVUsQ0FBQyxPQUFYLENBQUE7bUJBQ0EsTUFBQSxDQUFPLEdBQVAsRUFGRjtXQUFBLE1BQUE7WUFJRSxVQUFVLENBQUMsS0FBWCxDQUFpQixHQUFHLENBQUMsVUFBckI7bUJBQ0EsT0FBQSxDQUFRLFVBQVIsRUFMRjs7UUFGQyxDQUxIO01BSFUsQ0FBWjtJQUhnQjs7Z0NBb0JsQixnQkFBQSxHQUFrQixTQUFDLFlBQUQ7QUFDaEIsVUFBQTtNQUFBLEdBQUEsQ0FBSSxvQ0FBSjtNQUNBLElBQUEsR0FBTzthQUNQLElBQUksT0FBSixDQUFZLFNBQUMsT0FBRCxFQUFVLE1BQVY7UUFDVixJQUFBLENBQXdCLElBQUksQ0FBQyxNQUE3QjtBQUFBLGlCQUFPLE9BQUEsQ0FBQSxFQUFQOztRQUNBLElBQUEsQ0FBd0IsWUFBeEI7QUFBQSxpQkFBTyxPQUFBLENBQUEsRUFBUDs7UUFDQSxHQUFBLENBQUkscURBQUo7ZUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQVosQ0FBNEI7VUFDMUIsVUFBQSxFQUFZLFlBRGM7U0FBNUIsRUFFRyxTQUFDLEdBQUQ7aUJBQ0QsT0FBQSxDQUFBO1FBREMsQ0FGSDtNQUpVLENBQVo7SUFIZ0I7O2dDQVlsQixpQkFBQSxHQUFtQixTQUFDLE1BQUQsRUFBUyxJQUFUO0FBQ2pCLFVBQUE7QUFBQTtBQUFBLFdBQUEsOENBQUE7O1lBQW1GLFVBQVUsQ0FBQyxNQUFYLEtBQXFCLE1BQXJCLElBQWdDLFVBQVUsQ0FBQyxJQUFYLEtBQW1CO0FBQXRJLGlCQUFPO1lBQUUsVUFBQSxFQUFZLFVBQWQ7WUFBMEIsS0FBQSxFQUFPLENBQWpDOzs7QUFBUDtJQURpQjs7Ozs7O0VBR2Y7OztJQUNTLGtCQUFDLEtBQUQ7TUFBQyxJQUFDLENBQUEsT0FBRDs7Ozs7Ozs7Ozs7O01BQ1osd0NBQUE7TUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksaUJBQUosQ0FBc0IsSUFBdEI7TUFDckIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsS0FBQSxDQUFBO01BQ2hCLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLFlBQVksQ0FBQztNQUN6QixJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUEsaUJBQWlCLENBQUMsb0JBQW9CLENBQUM7TUFDM0QsSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyx1QkFBdUIsQ0FBQztNQUNqRSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFJLGNBQUosQ0FBbUIsSUFBQyxDQUFBLElBQXBCO01BQ2xCLElBQUMsQ0FBQSxjQUFjLENBQUMsRUFBaEIsQ0FBbUIsZ0JBQW5CLEVBQXFDLElBQUMsQ0FBQSxjQUF0QztNQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsRUFBaEIsQ0FBbUIsWUFBbkIsRUFBaUMsSUFBQyxDQUFBLGVBQWxDO01BQ0EsSUFBQyxDQUFBLG9CQUFELEdBQXdCLEtBQUEsQ0FBQTtNQUN4QixJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUEsb0JBQW9CLENBQUM7TUFDekMsSUFBQyxDQUFBLGFBQUQsR0FBaUI7TUFDakIsZ0JBQUEsQ0FBaUIsSUFBakI7SUFkVzs7dUJBZ0JiLGdCQUFBLEdBQWtCLFNBQUE7YUFBTSxJQUFDLENBQUE7SUFBUDs7dUJBQ2xCLGdCQUFBLEdBQWtCLFNBQUMsS0FBRCxFQUFRLEtBQVI7TUFDZCxJQUFDLENBQUEsYUFBRCxHQUFpQjtRQUFDLE9BQUEsS0FBRDtRQUFRLE9BQUEsS0FBUjs7YUFDakIsSUFBQyxDQUFBLG9CQUFvQixDQUFDLFNBQXRCLENBQWdDLElBQUMsQ0FBQSxhQUFqQztJQUZjOzt1QkFJbEIsT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFnQyxJQUFDLENBQUEsaUJBQWpDO1FBQUEsSUFBQyxDQUFBLGlCQUFpQixDQUFDLE9BQW5CLENBQUEsRUFBQTs7TUFDQSxJQUFDLENBQUEsaUJBQUQsR0FBcUI7TUFDckIsZ0JBQWdCLENBQUMsT0FBakIsQ0FBQTthQUNBLGdCQUFnQixDQUFDLE9BQWpCLENBQUE7SUFKTzs7dUJBTVQsWUFBQSxHQUFjLFNBQUE7TUFDWixJQUFjLG9CQUFkO0FBQUEsZUFBQTs7YUFDQSxZQUFBLENBQWEsSUFBQyxDQUFBLE9BQWQ7SUFGWTs7dUJBSWQsSUFBQSxHQUFNLFNBQUMsSUFBRCxFQUFPLEtBQVA7QUFDSixVQUFBO01BQUEsSUFBQSxHQUFPO2FBQ1AsSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO2lCQUNWLEtBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLElBQWIsRUFBbUIsS0FBbkIsRUFBMEIsU0FBQyxHQUFEO1lBQ3hCLElBQXNCLEdBQXRCO0FBQUEscUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7bUJBQ0EsT0FBQSxDQUFBO1VBRndCLENBQTFCO1FBRFU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVo7SUFGSTs7dUJBT04sV0FBQSxHQUFhLFNBQUE7QUFDWCxVQUFBO01BQUEsSUFBQSxHQUFPO2FBQ1AsSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO2lCQUNWLEtBQUMsQ0FBQSxNQUFNLENBQUMsR0FBUixDQUFZO1lBQ1YsT0FBQSxFQUFTLFVBREM7V0FBWixFQUVHLFNBQUMsR0FBRDtZQUNELElBQXNCLEdBQXRCO0FBQUEscUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7bUJBQ0EsT0FBQSxDQUFBO1VBRkMsQ0FGSDtRQURVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0lBRlc7O3VCQVNiLGFBQUEsR0FBZSxTQUFDLEVBQUQ7QUFDYixVQUFBO01BQUEsSUFBQSxHQUFPO2FBQ1AsSUFBSSxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO2lCQUNWLEtBQUMsQ0FBQSxNQUFNLENBQUMsR0FBUixDQUFZO1lBQ1YsT0FBQSxFQUFTLFNBREM7WUFFVixDQUFBLFNBQUEsQ0FBQSxFQUFXO2NBQ1QsR0FBQSxFQUFLLENBQUMsRUFBRCxDQURJO2NBRVQsYUFBQSxFQUFlLElBRk47YUFGRDtXQUFaLEVBTUcsU0FBQyxHQUFELEVBQU0sR0FBTjtZQUNELElBQXNCLEdBQXRCO0FBQUEscUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7bUJBQ0EsT0FBQSxDQUFRLEdBQUksQ0FBQSxDQUFBLENBQVo7VUFGQyxDQU5IO1FBRFU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVo7SUFGYTs7dUJBY2YsU0FBQSxHQUFXLFNBQUE7YUFDVCxJQUFJLE9BQUosQ0FBWSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVY7aUJBQ1YsS0FBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQWtCLFNBQUMsR0FBRCxFQUFNLEdBQU47WUFDaEIsSUFBc0IsR0FBdEI7QUFBQSxxQkFBTyxNQUFBLENBQU8sR0FBUCxFQUFQOzttQkFDQSxPQUFBLENBQVEsR0FBUjtVQUZnQixDQUFsQjtRQURVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0lBRFM7O3VCQU1YLEtBQUEsR0FBTyxTQUFBO01BQ0gsSUFBQyxDQUFBLFNBQUQsR0FBYTtNQUNiLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBYixDQUFpQix5QkFBakI7TUFDYixJQUFDLENBQUEsZUFBRCxHQUFtQjtNQUNuQixnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQixJQUF0QjthQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsS0FBaEIsQ0FBQTtJQUxHOzt1QkFRUCxlQUFBLEdBQWlCLFNBQUE7TUFDYixJQUFDLENBQUEsU0FBRCxHQUFhO01BQ2IsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFiLENBQWlCLHlCQUFqQjtNQUNiLElBQUMsQ0FBQSxlQUFELEdBQW1CO01BQ25CLGdCQUFnQixDQUFDLElBQWpCLENBQXNCLElBQXRCO2FBQ0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxlQUFoQixDQUFBO0lBTGE7O3VCQVFqQixNQUFBLEdBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBYixDQUFpQix5QkFBakI7TUFDYixJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQWIsQ0FBaUIseUJBQWpCO01BQ2IsSUFBQyxDQUFBLGVBQUQsR0FBbUI7TUFDbkIsZ0JBQWdCLENBQUMsSUFBakIsQ0FBc0IsSUFBdEI7YUFDQSxJQUFDLENBQUEsY0FBRCxDQUFBO0lBTE07O3VCQU9SLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7TUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLFVBQVosRUFBd0IsMEJBQXhCO01BQ0EsSUFBQSxHQUFPO01BQ1AsbUJBQUEsR0FBc0I7TUFDdEIsY0FBQSxHQUFpQixTQUFBO1FBQ2YsTUFBTSxDQUFDLElBQVAsQ0FBWSxVQUFaLEVBQXdCLHFDQUF4QjtRQUNBLElBQU8sbUJBQVA7VUFDRSxNQUFNLENBQUMsSUFBUCxDQUFZLFVBQVosRUFBd0IseUJBQXhCO0FBQ0EsaUJBRkY7O1FBR0EsbUJBQUE7ZUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FDRSxJQUFJLENBQUMsU0FEUCxFQUVFLElBQUksQ0FBQyxTQUZQO01BTmU7TUFXakIsaUJBQUEsR0FBb0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ2xCLGNBQUE7VUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLFVBQVosRUFBd0Isc0JBQUEsR0FBdUIsbUJBQS9DO1VBQ0EsT0FBQSxHQUFVO1VBQ1YsS0FBQyxDQUFBLElBQUQsQ0FBTSxXQUFOLEVBQW1CO1lBQ2pCLEtBQUEsRUFBTyxtQkFEVTtZQUVqQixJQUFBLEVBQU0sSUFBSSxDQUFDLFNBRk07WUFHakIsSUFBQSxFQUFNLElBQUksQ0FBQyxTQUhNO1lBSWpCLE9BQUEsRUFBUyxPQUpRO1dBQW5CO2lCQU1BLEtBQUMsQ0FBQSxPQUFELEdBQVcsVUFBQSxDQUFXLFNBQUE7bUJBQ3BCLGNBQUEsQ0FBQTtVQURvQixDQUFYLEVBRVQsT0FGUztRQVRPO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQWFwQixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksTUFBSixDQUFBO01BQ1YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsT0FBYixFQUFzQixJQUFDLENBQUEsVUFBdkI7TUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLEVBQVIsQ0FBVyxtQkFBWCxFQUFnQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtpQkFBUyxLQUFDLENBQUEsSUFBRCxDQUFNLG1CQUFOLEVBQTJCLEdBQTNCO1FBQVQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDO01BQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLENBQVcsT0FBWCxFQUFvQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtVQUNsQixLQUFDLENBQUEsWUFBWSxDQUFDLFNBQWQsQ0FBd0IsR0FBRyxDQUFDLElBQTVCO1VBQW1DLEtBQUMsQ0FBQSxJQUFELENBQU0sT0FBTixFQUFlLEdBQUcsQ0FBQyxJQUFuQjtpQkFDbkMsS0FBQyxDQUFBLGdCQUFELENBQWtCLElBQWxCO1FBRmtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQjtNQUlBLElBQUMsQ0FBQSxNQUFNLENBQUMsRUFBUixDQUFXLFdBQVgsRUFBd0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7aUJBQVMsS0FBQyxDQUFBLElBQUQsQ0FBTSxXQUFOLEVBQW1CLEdBQUcsQ0FBQyxJQUF2QjtRQUFUO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QjtNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsRUFBUixDQUFXLE9BQVgsRUFBb0IsaUJBQXBCO01BQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLENBQVcsT0FBWCxFQUFvQixTQUFBO2VBQU0sTUFBTSxDQUFDLElBQVAsQ0FBWSxRQUFaLEVBQXNCLGVBQXRCO01BQU4sQ0FBcEI7YUFFQSxjQUFBLENBQUE7SUF4Q2M7O3VCQTBDaEIsVUFBQSxHQUFZLFNBQUE7TUFDVixNQUFNLENBQUMsSUFBUCxDQUFZLFVBQVosRUFBd0IsV0FBeEI7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFNLFdBQU47YUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLEVBQVIsQ0FBVyxPQUFYLEVBQW9CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNsQixNQUFNLENBQUMsSUFBUCxDQUFZLFVBQVosRUFBd0IsbUJBQXhCO2lCQUVBLEtBQUMsQ0FBQSxjQUFjLENBQUMsT0FBaEIsQ0FBQSxDQUNFLENBQUMsSUFESCxDQUNRLFNBQUE7bUJBQ0osS0FBQyxDQUFBLElBQUQsQ0FBTSxPQUFOO1VBREksQ0FEUjtRQUhrQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEI7SUFIVTs7dUJBVVosTUFBQSxHQUFRLFNBQUMsR0FBRDthQUNOLElBQUksT0FBSixDQUFZLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtpQkFDVixLQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBa0IsQ0FBQyxHQUFELENBQWxCLEVBQXlCLFNBQUMsR0FBRCxFQUFNLEdBQU47WUFDdkIsSUFBc0IsR0FBdEI7QUFBQSxxQkFBTyxNQUFBLENBQU8sR0FBUCxFQUFQOzttQkFDQSxPQUFBLENBQVEsR0FBSSxDQUFBLEdBQUEsQ0FBWjtVQUZ1QixDQUF6QjtRQURVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0lBRE07O3dCQU1SLE1BQUEsR0FBTSxTQUFDLElBQUQ7YUFDSixJQUFJLE9BQUosQ0FBWSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDVixjQUFBO2lCQUFBLEtBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFxQixJQUFyQiw4Q0FBeUMsQ0FBRSxlQUFoQixJQUF5QixDQUFwRCxFQUF1RCxTQUFDLEdBQUQsRUFBTSxNQUFOO1lBQ3JELElBQXNCLEdBQXRCO0FBQUEscUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7QUFDQSxtQkFBTyxPQUFBLENBQVEsTUFBUjtVQUY4QyxDQUF2RDtRQURVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0lBREk7O3VCQU1OLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLGNBQWMsQ0FBQyxPQUFoQixDQUFBO01BQ0EsZ0JBQWdCLENBQUMsT0FBakIsQ0FBQTthQUNBLElBQUMsQ0FBQSxlQUFELENBQUE7SUFITzs7dUJBS1QsZUFBQSxHQUFpQixTQUFBO01BQ2YsSUFBcUIsSUFBQyxDQUFBLE1BQXRCO1FBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUEsRUFBQTs7TUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsZ0JBQWdCLENBQUMsT0FBakIsQ0FBQTthQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sY0FBTjtJQUplOzt1QkFNakIsV0FBQSxHQUFhLFNBQUE7QUFDVCxhQUFPO0lBREU7O3VCQUdiLE1BQUEsR0FBUSxTQUFBO2FBQ04sZ0JBQWdCLENBQUMsTUFBakIsQ0FBd0IsSUFBeEI7SUFETTs7OztLQXpLYTs7RUE0S3ZCLE9BQU8sQ0FBQyxRQUFSLEdBQW1COztFQUNuQixPQUFPLENBQUMsY0FBUixHQUF5QjtBQWhhekIiLCJzb3VyY2VzQ29udGVudCI6WyJSID0gcmVxdWlyZSAncmFtZGEnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmtpbGwgPSByZXF1aXJlICd0cmVlLWtpbGwnXG5Qcm9taXNlID0gcmVxdWlyZSAnYmx1ZWJpcmQnXG57Q2xpZW50fSA9IHJlcXVpcmUgJ19kZWJ1Z2dlcidcbmNoaWxkcHJvY2VzcyA9IHJlcXVpcmUgJ2NoaWxkX3Byb2Nlc3MnXG57RXZlbnRFbWl0dGVyfSA9IHJlcXVpcmUgJy4vZXZlbnRpbmcnXG5FdmVudCA9IHJlcXVpcmUgJ2dldmFsL2V2ZW50J1xubG9nZ2VyID0gcmVxdWlyZSAnLi9sb2dnZXInXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xuTm9kZURlYnVnZ2VyVmlldyA9IHJlcXVpcmUgJy4vbm9kZS1kZWJ1Z2dlci12aWV3J1xuanVtcFRvQnJlYWtwb2ludCA9IHJlcXVpcmUgJy4vanVtcC10by1icmVha3BvaW50J1xuXG5sb2cgPSAobXNnKSAtPiAjY29uc29sZS5sb2cobXNnKVxuXG5jbGFzcyBQcm9jZXNzTWFuYWdlciBleHRlbmRzIEV2ZW50RW1pdHRlclxuICBjb25zdHJ1Y3RvcjogKEBhdG9tID0gYXRvbSktPlxuICAgIHN1cGVyKClcbiAgICBAcHJvY2VzcyA9IG51bGxcblxuICBwYXJzZUVudjogKGVudikgLT5cbiAgICByZXR1cm4gbnVsbCB1bmxlc3MgZW52XG4gICAga2V5ID0gKHMpIC0+IHMuc3BsaXQoXCI9XCIpWzBdXG4gICAgdmFsdWUgPSAocykgLT4gcy5zcGxpdChcIj1cIilbMV1cbiAgICByZXN1bHQgPSB7fVxuICAgIHJlc3VsdFtrZXkoZSldID0gdmFsdWUoZSkgZm9yIGUgaW4gZW52LnNwbGl0KFwiO1wiKVxuICAgIHJldHVybiByZXN1bHRcblxuICBzdGFydEFjdGl2ZUZpbGU6ICgpIC0+XG4gICAgQHN0YXJ0IHRydWVcblxuICBzdGFydDogKHdpdGhBY3RpdmVGaWxlKSAtPlxuICAgIHN0YXJ0QWN0aXZlID0gd2l0aEFjdGl2ZUZpbGVcbiAgICBAY2xlYW51cCgpXG4gICAgICAudGhlbiA9PlxuICAgICAgICBwYWNrYWdlUGF0aCA9IEBhdG9tLnByb2plY3QucmVzb2x2ZVBhdGgoJ3BhY2thZ2UuanNvbicpXG4gICAgICAgIHBhY2thZ2VKU09OID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGFja2FnZVBhdGgpKSBpZiBmcy5leGlzdHNTeW5jKHBhY2thZ2VQYXRoKVxuICAgICAgICBub2RlUGF0aCA9IEBhdG9tLmNvbmZpZy5nZXQoJ25vZGUtZGVidWdnZXIubm9kZVBhdGgnKVxuICAgICAgICBub2RlQXJncyA9IEBhdG9tLmNvbmZpZy5nZXQoJ25vZGUtZGVidWdnZXIubm9kZUFyZ3MnKVxuICAgICAgICBhcHBBcmdzID0gQGF0b20uY29uZmlnLmdldCgnbm9kZS1kZWJ1Z2dlci5hcHBBcmdzJylcbiAgICAgICAgcG9ydCA9IEBhdG9tLmNvbmZpZy5nZXQoJ25vZGUtZGVidWdnZXIuZGVidWdQb3J0JylcbiAgICAgICAgZW52ID0gQHBhcnNlRW52IEBhdG9tLmNvbmZpZy5nZXQoJ25vZGUtZGVidWdnZXIuZW52JylcbiAgICAgICAgc2NyaXB0TWFpbiA9IEBhdG9tLnByb2plY3QucmVzb2x2ZVBhdGgoQGF0b20uY29uZmlnLmdldCgnbm9kZS1kZWJ1Z2dlci5zY3JpcHRNYWluJykpXG5cbiAgICAgICAgZGJnRmlsZSA9IHNjcmlwdE1haW4gfHwgcGFja2FnZUpTT04gJiYgQGF0b20ucHJvamVjdC5yZXNvbHZlUGF0aChwYWNrYWdlSlNPTi5tYWluKVxuXG4gICAgICAgIGlmIHN0YXJ0QWN0aXZlID09IHRydWUgfHwgIWRiZ0ZpbGVcbiAgICAgICAgICBlZGl0b3IgPSBAYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgYXBwUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgICBkYmdGaWxlID0gYXBwUGF0aFxuXG4gICAgICAgIGN3ZCA9IHBhdGguZGlybmFtZShkYmdGaWxlKVxuXG4gICAgICAgIGFyZ3MgPSBbXVxuICAgICAgICBhcmdzID0gYXJncy5jb25jYXQgKG5vZGVBcmdzLnNwbGl0KCcgJykpIGlmIG5vZGVBcmdzXG4gICAgICAgIGFyZ3MucHVzaCBcIi0tZGVidWctYnJrPSN7cG9ydH1cIlxuICAgICAgICBhcmdzLnB1c2ggZGJnRmlsZVxuICAgICAgICBhcmdzID0gYXJncy5jb25jYXQgKGFwcEFyZ3Muc3BsaXQoJyAnKSkgaWYgYXBwQXJnc1xuXG4gICAgICAgIGxvZ2dlci5lcnJvciAnc3Bhd24nLCB7YXJnczphcmdzLCBlbnY6ZW52fVxuICAgICAgICBAcHJvY2VzcyA9IGNoaWxkcHJvY2Vzcy5zcGF3biBub2RlUGF0aCwgYXJncywge1xuICAgICAgICAgIGRldGFjaGVkOiB0cnVlXG4gICAgICAgICAgY3dkOiBjd2RcbiAgICAgICAgICBlbnY6IGVudiBpZiBlbnZcbiAgICAgICAgfVxuXG4gICAgICAgIEBwcm9jZXNzLnN0ZG91dC5vbiAnZGF0YScsIChkKSAtPlxuICAgICAgICAgIGxvZ2dlci5pbmZvICdjaGlsZF9wcm9jZXNzJywgZC50b1N0cmluZygpXG5cbiAgICAgICAgQHByb2Nlc3Muc3RkZXJyLm9uICdkYXRhJywgKGQpIC0+XG4gICAgICAgICAgbG9nZ2VyLmluZm8gJ2NoaWxkX3Byb2Nlc3MnLCBkLnRvU3RyaW5nKClcblxuICAgICAgICBAcHJvY2Vzcy5zdGRvdXQub24gJ2VuZCcsICgpIC0+XG4gICAgICAgICAgbG9nZ2VyLmluZm8gJ2NoaWxkX3Byb2Nlc3MnLCAnZW5kIG91dCdcblxuICAgICAgICBAcHJvY2Vzcy5zdGRlcnIub24gJ2VuZCcsICgpIC0+XG4gICAgICAgICAgbG9nZ2VyLmluZm8gJ2NoaWxkX3Byb2Nlc3MnLCAnZW5kIGVycm9yJ1xuXG4gICAgICAgIEBlbWl0ICdwcm9jZXNzQ3JlYXRlZCcsIEBwcm9jZXNzXG5cbiAgICAgICAgQHByb2Nlc3Mub25jZSAnZXJyb3InLCAoZXJyKSA9PlxuICAgICAgICAgIHN3aXRjaCBlcnIuY29kZVxuICAgICAgICAgICAgd2hlbiBcIkVOT0VOVFwiXG4gICAgICAgICAgICAgIGxvZ2dlci5lcnJvciAnY2hpbGRfcHJvY2VzcycsIFwiRU5PRU5UIGV4aXQgY29kZS4gTWVzc2FnZTogI3tlcnIubWVzc2FnZX1cIlxuICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAgICAgICAgICAgXCJGYWlsZWQgdG8gc3RhcnQgZGVidWdnZXIuXG4gICAgICAgICAgICAgICAgRXhpdCBjb2RlIHdhcyBFTk9FTlQgd2hpY2ggaW5kaWNhdGVzIHRoYXQgdGhlIG5vZGVcbiAgICAgICAgICAgICAgICBleGVjdXRhYmxlIGNvdWxkIG5vdCBiZSBmb3VuZC5cbiAgICAgICAgICAgICAgICBUcnkgc3BlY2lmeWluZyBhbiBleHBsaWNpdCBwYXRoIGluIHlvdXIgYXRvbSBjb25maWcgZmlsZVxuICAgICAgICAgICAgICAgIHVzaW5nIHRoZSBub2RlLWRlYnVnZ2VyLm5vZGVQYXRoIGNvbmZpZ3VyYXRpb24gc2V0dGluZy5cIlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGxvZ2dlci5lcnJvciAnY2hpbGRfcHJvY2VzcycsIFwiRXhpdCBjb2RlICN7ZXJyLmNvZGV9LiAje2Vyci5tZXNzYWdlfVwiXG4gICAgICAgICAgQGVtaXQgJ3Byb2Nlc3NFbmQnLCBlcnJcblxuICAgICAgICBAcHJvY2Vzcy5vbmNlICdjbG9zZScsICgpID0+XG4gICAgICAgICAgbG9nZ2VyLmluZm8gJ2NoaWxkX3Byb2Nlc3MnLCAnY2xvc2UnXG4gICAgICAgICAgQGVtaXQgJ3Byb2Nlc3NFbmQnLCBAcHJvY2Vzc1xuXG4gICAgICAgIEBwcm9jZXNzLm9uY2UgJ2Rpc2Nvbm5lY3QnLCAoKSA9PlxuICAgICAgICAgIGxvZ2dlci5pbmZvICdjaGlsZF9wcm9jZXNzJywgJ2Rpc2Nvbm5lY3QnXG4gICAgICAgICAgQGVtaXQgJ3Byb2Nlc3NFbmQnLCBAcHJvY2Vzc1xuXG4gICAgICAgIHJldHVybiBAcHJvY2Vzc1xuXG4gIGNsZWFudXA6IC0+XG4gICAgc2VsZiA9IHRoaXNcbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgcmV0dXJuIHJlc29sdmUoKSBpZiBub3QgQHByb2Nlc3M/XG4gICAgICBpZiBAcHJvY2Vzcy5leGl0Q29kZVxuICAgICAgICBsb2dnZXIuaW5mbyAnY2hpbGRfcHJvY2VzcycsICdwcm9jZXNzIGFscmVhZHkgZXhpdGVkIHdpdGggY29kZSAnICsgQHByb2Nlc3MuZXhpdENvZGVcbiAgICAgICAgQHByb2Nlc3MgPSBudWxsXG4gICAgICAgIHJldHVybiByZXNvbHZlKClcblxuICAgICAgb25Qcm9jZXNzRW5kID0gUi5vbmNlID0+XG4gICAgICAgIGxvZ2dlci5pbmZvICdjaGlsZF9wcm9jZXNzJywgJ2RpZSdcbiAgICAgICAgQGVtaXQgJ3Byb2Nlc3NFbmQnLCBAcHJvY2Vzc1xuICAgICAgICBAcHJvY2VzcyA9IG51bGxcbiAgICAgICAgcmVzb2x2ZSgpXG5cbiAgICAgIGxvZ2dlci5pbmZvICdjaGlsZF9wcm9jZXNzJywgJ3N0YXJ0IGtpbGxpbmcgcHJvY2VzcydcbiAgICAgIGtpbGwgQHByb2Nlc3MucGlkXG5cbiAgICAgIEBwcm9jZXNzLm9uY2UgJ2Rpc2Nvbm5lY3QnLCBvblByb2Nlc3NFbmRcbiAgICAgIEBwcm9jZXNzLm9uY2UgJ2V4aXQnLCBvblByb2Nlc3NFbmRcbiAgICAgIEBwcm9jZXNzLm9uY2UgJ2Nsb3NlJywgb25Qcm9jZXNzRW5kXG5cbmNsYXNzIEJyZWFrcG9pbnRcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAc2NyaXB0LCBAbGluZSkgLT5cbiAgICBAbWFya2VyID0gbnVsbFxuICAgIEBtYXJrZXIgPSBAZWRpdG9yLm1hcmtCdWZmZXJQb3NpdGlvbihbQGxpbmUsIDBdLCBpbnZhbGlkYXRlOiAnbmV2ZXInKVxuICAgIEBkZWNvcmF0aW9uID0gbnVsbFxuICAgIEBvbkRpZENoYW5nZVN1YnNjcmlwdGlvbiA9IEBtYXJrZXIub25EaWRDaGFuZ2UgKGV2ZW50KSA9PlxuICAgICAgbG9nIFwiQnJlYWtwb2ludC5tYXJrZXJjaGFuZ2VkOiAje2V2ZW50Lm5ld0hlYWRCdWZmZXJQb3NpdGlvbn1cIlxuICAgICAgQGxpbmUgPSBldmVudC5uZXdIZWFkQnVmZmVyUG9zaXRpb24ucm93XG4gICAgQG9uRGlkRGVzdHJveVN1YnNjcmlwdGlvbiA9IEBtYXJrZXIub25EaWREZXN0cm95ICgpID0+XG4gICAgICBAbWFya2VyID0gbnVsbFxuICAgICAgQGRlY29yYXRpb24gPSBudWxsXG4gICAgQGlkID0gbnVsbFxuICAgIEB1cGRhdGVWaXN1YWxpemF0aW9uKClcblxuICBkaXNwb3NlOiAoKSAtPlxuICAgIEBvbkRpZENoYW5nZVN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICBAb25EaWREZXN0cm95U3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIEBpZCA9IG51bGxcbiAgICBAZGVjb3JhdGlvbi5kZXN0cm95KCkgaWYgQGRlY29yYXRpb25cbiAgICBAZGVjb3JhdGlvbiA9IG51bGxcbiAgICBAbWFya2VyLmRlc3Ryb3koKSBpZiBAbWFya2VyXG4gICAgQG1hcmtlciA9IG51bGxcblxuICBzZXRJZDogKEBpZCkgPT5cbiAgICBAdXBkYXRlVmlzdWFsaXphdGlvbigpXG5cbiAgY2xlYXJJZDogKCkgPT5cbiAgICBAc2V0SWQobnVsbClcblxuICB1cGRhdGVWaXN1YWxpemF0aW9uOiAoKSA9PlxuICAgIEBkZWNvcmF0aW9uLmRlc3Ryb3koKSBpZiBAZGVjb3JhdGlvblxuICAgIGNsYXNzTmFtZSA9IGlmIEBpZCB0aGVuICdub2RlLWRlYnVnZ2VyLWF0dGFjaGVkLWJyZWFrcG9pbnQnIGVsc2UgJ25vZGUtZGVidWdnZXItZGV0YWNoZWQtYnJlYWtwb2ludCdcbiAgICBAZGVjb3JhdGlvbiA9IEBlZGl0b3IuZGVjb3JhdGVNYXJrZXIoQG1hcmtlciwgdHlwZTogJ2xpbmUtbnVtYmVyJywgY2xhc3M6IGNsYXNzTmFtZSkgaWYgQG1hcmtlclxuXG5jbGFzcyBCcmVha3BvaW50TWFuYWdlclxuICBjb25zdHJ1Y3RvcjogKEBkZWJ1Z2dlcikgLT5cbiAgICBsb2cgXCJCcmVha3BvaW50TWFuYWdlci5jb25zdHJ1Y3RvclwiXG4gICAgQGJyZWFrcG9pbnRzID0gW11cbiAgICBAY2xpZW50ID0gbnVsbFxuICAgIEByZW1vdmVPbkNvbm5lY3RlZCA9IEBkZWJ1Z2dlci5zdWJzY3JpYmUgJ2Nvbm5lY3RlZCcsID0+XG4gICAgICBsb2cgXCJCcmVha3BvaW50TWFuYWdlci5jb25uZWN0ZWRcIlxuICAgICAgQGNsaWVudCA9IEBkZWJ1Z2dlci5jbGllbnRcbiAgICAgIEBhdHRhY2hCcmVha3BvaW50KGJyZWFrcG9pbnQpIGZvciBicmVha3BvaW50IGluIEBicmVha3BvaW50c1xuICAgIEByZW1vdmVPbkRpc2Nvbm5lY3RlZCA9IEBkZWJ1Z2dlci5zdWJzY3JpYmUgJ2Rpc2Nvbm5lY3RlZCcsID0+XG4gICAgICBsb2cgXCJCcmVha3BvaW50TWFuYWdlci5kaXNjb25uZWN0ZWRcIlxuICAgICAgQGNsaWVudCA9IG51bGxcbiAgICAgIGJyZWFrcG9pbnQuY2xlYXJJZCgpIGZvciBicmVha3BvaW50IGluIEBicmVha3BvaW50c1xuICAgIEBvbkFkZEJyZWFrcG9pbnRFdmVudCA9IEV2ZW50KClcbiAgICBAb25SZW1vdmVCcmVha3BvaW50RXZlbnQgPSBFdmVudCgpXG5cbiAgZGlzcG9zZTogKCkgLT5cbiAgICBAcmVtb3ZlT25Db25uZWN0ZWQoKSBpZiBAcmVtb3ZlT25Db25uZWN0ZWRcbiAgICBAcmVtb3ZlT25Db25uZWN0ZWQgPSBudWxsXG4gICAgQHJlbW92ZU9uRGlzY29ubmVjdGVkKCkgaWYgQHJlbW92ZU9uRGlzY29ubmVjdGVkXG4gICAgQHJlbW92ZU9uRGlzY29ubmVjdGVkID0gbnVsbFxuXG4gIHRvZ2dsZUJyZWFrcG9pbnQ6IChlZGl0b3IsIHNjcmlwdCwgbGluZSkgLT5cbiAgICBsb2cgXCJCcmVha3BvaW50TWFuYWdlci50b2dnbGVCcmVha3BvaW50ICN7c2NyaXB0fSwgI3tsaW5lfVwiXG4gICAgbWF5YmVCcmVha3BvaW50ID0gQHRyeUZpbmRCcmVha3BvaW50IHNjcmlwdCwgbGluZVxuICAgIGlmIG1heWJlQnJlYWtwb2ludFxuICAgICAgQHJlbW92ZUJyZWFrcG9pbnQgbWF5YmVCcmVha3BvaW50LmJyZWFrcG9pbnQsIG1heWJlQnJlYWtwb2ludC5pbmRleFxuICAgIGVsc2VcbiAgICAgIEBhZGRCcmVha3BvaW50IGVkaXRvciwgc2NyaXB0LCBsaW5lXG5cbiAgcmVtb3ZlQnJlYWtwb2ludDogKGJyZWFrcG9pbnQsIGluZGV4KSAtPlxuICAgIGxvZyBcIkJyZWFrcG9pbnRNYW5hZ2VyLnJlbW92ZUJyZWFrcG9pbnQgI3tpbmRleH1cIlxuICAgIEBicmVha3BvaW50cy5zcGxpY2UgaW5kZXgsIDFcbiAgICBAb25SZW1vdmVCcmVha3BvaW50RXZlbnQuYnJvYWRjYXN0IGJyZWFrcG9pbnRcbiAgICBAZGV0YWNoQnJlYWtwb2ludCBicmVha3BvaW50LmlkXG4gICAgYnJlYWtwb2ludC5kaXNwb3NlKClcblxuICBhZGRCcmVha3BvaW50OiAoZWRpdG9yLCBzY3JpcHQsIGxpbmUpIC0+XG4gICAgbG9nIFwiQnJlYWtwb2ludE1hbmFnZXIuYWRkQnJlYWtwb2ludCAje3NjcmlwdH0sICN7bGluZX1cIlxuICAgIGJyZWFrcG9pbnQgPSBuZXcgQnJlYWtwb2ludChlZGl0b3IsIHNjcmlwdCwgbGluZSlcbiAgICBsb2cgXCJCcmVha3BvaW50TWFuYWdlci5hZGRCcmVha3BvaW50IC0gYWRkaW5nIHRvIGxpc3RcIlxuICAgIEBicmVha3BvaW50cy5wdXNoIGJyZWFrcG9pbnRcbiAgICBsb2cgXCJCcmVha3BvaW50TWFuYWdlci5hZGRCcmVha3BvaW50IC0gcHVibGlzaGluZyBldmVudCwgbnVtIGJyZWFrcG9pbnRzPSN7QGJyZWFrcG9pbnRzLmxlbmd0aH1cIlxuICAgIEBvbkFkZEJyZWFrcG9pbnRFdmVudC5icm9hZGNhc3QgYnJlYWtwb2ludFxuICAgIGxvZyBcIkJyZWFrcG9pbnRNYW5hZ2VyLmFkZEJyZWFrcG9pbnQgLSBhdHRhY2hpbmdcIlxuICAgIEBhdHRhY2hCcmVha3BvaW50IGJyZWFrcG9pbnRcblxuICBhdHRhY2hCcmVha3BvaW50OiAoYnJlYWtwb2ludCkgLT5cbiAgICBsb2cgXCJCcmVha3BvaW50TWFuYWdlci5hdHRhY2hCcmVha3BvaW50XCJcbiAgICBzZWxmID0gdGhpc1xuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICByZXR1cm4gcmVzb2x2ZSgpIHVubGVzcyBzZWxmLmNsaWVudFxuICAgICAgbG9nIFwiQnJlYWtwb2ludE1hbmFnZXIuYXR0YWNoQnJlYWtwb2ludCAtIGNsaWVudCByZXF1ZXN0XCJcbiAgICAgIHNlbGYuY2xpZW50LnNldEJyZWFrcG9pbnQge1xuICAgICAgICB0eXBlOiAnc2NyaXB0J1xuICAgICAgICB0YXJnZXQ6IGJyZWFrcG9pbnQuc2NyaXB0XG4gICAgICAgIGxpbmU6IGJyZWFrcG9pbnQubGluZVxuICAgICAgICBjb25kaXRpb246IGJyZWFrcG9pbnQuY29uZGl0aW9uXG4gICAgICB9LCAoZXJyLCByZXMpIC0+XG4gICAgICAgIGxvZyBcIkJyZWFrcG9pbnRNYW5hZ2VyLmF0dGFjaEJyZWFrcG9pbnQgLSBkb25lXCJcbiAgICAgICAgaWYgZXJyXG4gICAgICAgICAgYnJlYWtwb2ludC5jbGVhcklkKClcbiAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYnJlYWtwb2ludC5zZXRJZChyZXMuYnJlYWtwb2ludClcbiAgICAgICAgICByZXNvbHZlKGJyZWFrcG9pbnQpXG5cbiAgZGV0YWNoQnJlYWtwb2ludDogKGJyZWFrcG9pbnRJZCkgLT5cbiAgICBsb2cgXCJCcmVha3BvaW50TWFuYWdlci5kZXRhY2hCcmVha3BvaW50XCJcbiAgICBzZWxmID0gdGhpc1xuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICByZXR1cm4gcmVzb2x2ZSgpIHVubGVzcyBzZWxmLmNsaWVudFxuICAgICAgcmV0dXJuIHJlc29sdmUoKSB1bmxlc3MgYnJlYWtwb2ludElkXG4gICAgICBsb2cgXCJCcmVha3BvaW50TWFuYWdlci5kZXRhY2hCcmVha3BvaW50IC0gY2xpZW50IHJlcXVlc3RcIlxuICAgICAgc2VsZi5jbGllbnQuY2xlYXJCcmVha3BvaW50IHtcbiAgICAgICAgYnJlYWtwb2ludDogYnJlYWtwb2ludElkXG4gICAgICB9LCAoZXJyKSAtPlxuICAgICAgICByZXNvbHZlKClcblxuICB0cnlGaW5kQnJlYWtwb2ludDogKHNjcmlwdCwgbGluZSkgLT5cbiAgICByZXR1cm4geyBicmVha3BvaW50OiBicmVha3BvaW50LCBpbmRleDogaSB9IGZvciBicmVha3BvaW50LCBpIGluIEBicmVha3BvaW50cyB3aGVuIGJyZWFrcG9pbnQuc2NyaXB0IGlzIHNjcmlwdCBhbmQgYnJlYWtwb2ludC5saW5lIGlzIGxpbmVcblxuY2xhc3MgRGVidWdnZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXJcbiAgY29uc3RydWN0b3I6IChAYXRvbSktPlxuICAgIHN1cGVyKClcbiAgICBAY2xpZW50ID0gbnVsbFxuICAgIEBicmVha3BvaW50TWFuYWdlciA9IG5ldyBCcmVha3BvaW50TWFuYWdlcih0aGlzKVxuICAgIEBvbkJyZWFrRXZlbnQgPSBFdmVudCgpXG4gICAgQG9uQnJlYWsgPSBAb25CcmVha0V2ZW50Lmxpc3RlblxuICAgIEBvbkFkZEJyZWFrcG9pbnQgPSBAYnJlYWtwb2ludE1hbmFnZXIub25BZGRCcmVha3BvaW50RXZlbnQubGlzdGVuXG4gICAgQG9uUmVtb3ZlQnJlYWtwb2ludCA9IEBicmVha3BvaW50TWFuYWdlci5vblJlbW92ZUJyZWFrcG9pbnRFdmVudC5saXN0ZW5cbiAgICBAcHJvY2Vzc01hbmFnZXIgPSBuZXcgUHJvY2Vzc01hbmFnZXIoQGF0b20pXG4gICAgQHByb2Nlc3NNYW5hZ2VyLm9uICdwcm9jZXNzQ3JlYXRlZCcsIEBhdHRhY2hJbnRlcm5hbFxuICAgIEBwcm9jZXNzTWFuYWdlci5vbiAncHJvY2Vzc0VuZCcsIEBjbGVhbnVwSW50ZXJuYWxcbiAgICBAb25TZWxlY3RlZEZyYW1lRXZlbnQgPSBFdmVudCgpXG4gICAgQG9uU2VsZWN0ZWRGcmFtZSA9IEBvblNlbGVjdGVkRnJhbWVFdmVudC5saXN0ZW5cbiAgICBAc2VsZWN0ZWRGcmFtZSA9IG51bGxcbiAgICBqdW1wVG9CcmVha3BvaW50KHRoaXMpXG5cbiAgZ2V0U2VsZWN0ZWRGcmFtZTogKCkgPT4gQHNlbGVjdGVkRnJhbWVcbiAgc2V0U2VsZWN0ZWRGcmFtZTogKGZyYW1lLCBpbmRleCkgPT5cbiAgICAgIEBzZWxlY3RlZEZyYW1lID0ge2ZyYW1lLCBpbmRleH1cbiAgICAgIEBvblNlbGVjdGVkRnJhbWVFdmVudC5icm9hZGNhc3QoQHNlbGVjdGVkRnJhbWUpXG5cbiAgZGlzcG9zZTogLT5cbiAgICBAYnJlYWtwb2ludE1hbmFnZXIuZGlzcG9zZSgpIGlmIEBicmVha3BvaW50TWFuYWdlclxuICAgIEBicmVha3BvaW50TWFuYWdlciA9IG51bGxcbiAgICBOb2RlRGVidWdnZXJWaWV3LmRlc3Ryb3koKVxuICAgIGp1bXBUb0JyZWFrcG9pbnQuZGVzdHJveSgpXG5cbiAgc3RvcFJldHJ5aW5nOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQHRpbWVvdXQ/XG4gICAgY2xlYXJUaW1lb3V0IEB0aW1lb3V0XG5cbiAgc3RlcDogKHR5cGUsIGNvdW50KSAtPlxuICAgIHNlbGYgPSB0aGlzXG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIEBjbGllbnQuc3RlcCB0eXBlLCBjb3VudCwgKGVycikgLT5cbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuICAgICAgICByZXNvbHZlKClcblxuICByZXFDb250aW51ZTogLT5cbiAgICBzZWxmID0gdGhpc1xuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBAY2xpZW50LnJlcSB7XG4gICAgICAgIGNvbW1hbmQ6ICdjb250aW51ZSdcbiAgICAgIH0sIChlcnIpIC0+XG4gICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgcmVzb2x2ZSgpXG5cbiAgZ2V0U2NyaXB0QnlJZDogKGlkKSAtPlxuICAgIHNlbGYgPSB0aGlzXG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIEBjbGllbnQucmVxIHtcbiAgICAgICAgY29tbWFuZDogJ3NjcmlwdHMnLFxuICAgICAgICBhcmd1bWVudHM6IHtcbiAgICAgICAgICBpZHM6IFtpZF0sXG4gICAgICAgICAgaW5jbHVkZVNvdXJjZTogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9LCAoZXJyLCByZXMpIC0+XG4gICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgcmVzb2x2ZShyZXNbMF0pXG5cblxuICBmdWxsVHJhY2U6ICgpIC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIEBjbGllbnQuZnVsbFRyYWNlIChlcnIsIHJlcykgLT5cbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuICAgICAgICByZXNvbHZlKHJlcylcblxuICBzdGFydDogPT5cbiAgICAgIEBkZWJ1Z0hvc3QgPSBcIjEyNy4wLjAuMVwiXG4gICAgICBAZGVidWdQb3J0ID0gQGF0b20uY29uZmlnLmdldCgnbm9kZS1kZWJ1Z2dlci5kZWJ1Z1BvcnQnKVxuICAgICAgQGV4dGVybmFsUHJvY2VzcyA9IGZhbHNlXG4gICAgICBOb2RlRGVidWdnZXJWaWV3LnNob3codGhpcylcbiAgICAgIEBwcm9jZXNzTWFuYWdlci5zdGFydCgpXG4gICAgICAjIGRlYnVnZ2VyIHdpbGwgYXR0YWNoIHdoZW4gcHJvY2VzcyBpcyBzdGFydGVkXG5cbiAgc3RhcnRBY3RpdmVGaWxlOiA9PlxuICAgICAgQGRlYnVnSG9zdCA9IFwiMTI3LjAuMC4xXCJcbiAgICAgIEBkZWJ1Z1BvcnQgPSBAYXRvbS5jb25maWcuZ2V0KCdub2RlLWRlYnVnZ2VyLmRlYnVnUG9ydCcpXG4gICAgICBAZXh0ZXJuYWxQcm9jZXNzID0gZmFsc2VcbiAgICAgIE5vZGVEZWJ1Z2dlclZpZXcuc2hvdyh0aGlzKVxuICAgICAgQHByb2Nlc3NNYW5hZ2VyLnN0YXJ0QWN0aXZlRmlsZSgpXG4gICAgICAjIGRlYnVnZ2VyIHdpbGwgYXR0YWNoIHdoZW4gcHJvY2VzcyBpcyBzdGFydGVkXG5cbiAgYXR0YWNoOiA9PlxuICAgIEBkZWJ1Z0hvc3QgPSBAYXRvbS5jb25maWcuZ2V0KCdub2RlLWRlYnVnZ2VyLmRlYnVnSG9zdCcpXG4gICAgQGRlYnVnUG9ydCA9IEBhdG9tLmNvbmZpZy5nZXQoJ25vZGUtZGVidWdnZXIuZGVidWdQb3J0JylcbiAgICBAZXh0ZXJuYWxQcm9jZXNzID0gdHJ1ZVxuICAgIE5vZGVEZWJ1Z2dlclZpZXcuc2hvdyh0aGlzKVxuICAgIEBhdHRhY2hJbnRlcm5hbCgpXG5cbiAgYXR0YWNoSW50ZXJuYWw6ID0+XG4gICAgbG9nZ2VyLmluZm8gJ2RlYnVnZ2VyJywgJ3N0YXJ0IGNvbm5lY3QgdG8gcHJvY2VzcydcbiAgICBzZWxmID0gdGhpc1xuICAgIGF0dGVtcHRDb25uZWN0Q291bnQgPSAwXG4gICAgYXR0ZW1wdENvbm5lY3QgPSAtPlxuICAgICAgbG9nZ2VyLmluZm8gJ2RlYnVnZ2VyJywgJ2F0dGVtcHQgdG8gY29ubmVjdCB0byBjaGlsZCBwcm9jZXNzJ1xuICAgICAgaWYgbm90IHNlbGYuY2xpZW50P1xuICAgICAgICBsb2dnZXIuaW5mbyAnZGVidWdnZXInLCAnY2xpZW50IGhhcyBiZWVuIGNsZWFudXAnXG4gICAgICAgIHJldHVyblxuICAgICAgYXR0ZW1wdENvbm5lY3RDb3VudCsrXG4gICAgICBzZWxmLmNsaWVudC5jb25uZWN0KFxuICAgICAgICBzZWxmLmRlYnVnUG9ydCxcbiAgICAgICAgc2VsZi5kZWJ1Z0hvc3RcbiAgICAgIClcblxuICAgIG9uQ29ubmVjdGlvbkVycm9yID0gPT5cbiAgICAgIGxvZ2dlci5pbmZvICdkZWJ1Z2dlcicsIFwidHJ5aW5nIHRvIHJlY29ubmVjdCAje2F0dGVtcHRDb25uZWN0Q291bnR9XCJcbiAgICAgIHRpbWVvdXQgPSA1MDBcbiAgICAgIEBlbWl0ICdyZWNvbm5lY3QnLCB7XG4gICAgICAgIGNvdW50OiBhdHRlbXB0Q29ubmVjdENvdW50XG4gICAgICAgIHBvcnQ6IHNlbGYuZGVidWdQb3J0XG4gICAgICAgIGhvc3Q6IHNlbGYuZGVidWdIb3N0XG4gICAgICAgIHRpbWVvdXQ6IHRpbWVvdXRcbiAgICAgIH1cbiAgICAgIEB0aW1lb3V0ID0gc2V0VGltZW91dCA9PlxuICAgICAgICBhdHRlbXB0Q29ubmVjdCgpXG4gICAgICAsIHRpbWVvdXRcblxuICAgIEBjbGllbnQgPSBuZXcgQ2xpZW50KClcbiAgICBAY2xpZW50Lm9uY2UgJ3JlYWR5JywgQGJpbmRFdmVudHNcblxuICAgIEBjbGllbnQub24gJ3VuaGFuZGxlZFJlc3BvbnNlJywgKHJlcykgPT4gQGVtaXQgJ3VuaGFuZGxlZFJlc3BvbnNlJywgcmVzXG4gICAgQGNsaWVudC5vbiAnYnJlYWsnLCAocmVzKSA9PlxuICAgICAgQG9uQnJlYWtFdmVudC5icm9hZGNhc3QocmVzLmJvZHkpOyBAZW1pdCAnYnJlYWsnLCByZXMuYm9keVxuICAgICAgQHNldFNlbGVjdGVkRnJhbWUobnVsbClcblxuICAgIEBjbGllbnQub24gJ2V4Y2VwdGlvbicsIChyZXMpID0+IEBlbWl0ICdleGNlcHRpb24nLCByZXMuYm9keVxuICAgIEBjbGllbnQub24gJ2Vycm9yJywgb25Db25uZWN0aW9uRXJyb3JcbiAgICBAY2xpZW50Lm9uICdjbG9zZScsICgpIC0+IGxvZ2dlci5pbmZvICdjbGllbnQnLCAnY2xpZW50IGNsb3NlZCdcblxuICAgIGF0dGVtcHRDb25uZWN0KClcblxuICBiaW5kRXZlbnRzOiA9PlxuICAgIGxvZ2dlci5pbmZvICdkZWJ1Z2dlcicsICdjb25uZWN0ZWQnXG4gICAgQGVtaXQgJ2Nvbm5lY3RlZCdcbiAgICBAY2xpZW50Lm9uICdjbG9zZScsID0+XG4gICAgICBsb2dnZXIuaW5mbyAnZGVidWdnZXInLCAnY29ubmVjdGlvbiBjbG9zZWQnXG5cbiAgICAgIEBwcm9jZXNzTWFuYWdlci5jbGVhbnVwKClcbiAgICAgICAgLnRoZW4gPT5cbiAgICAgICAgICBAZW1pdCAnY2xvc2UnXG5cbiAgbG9va3VwOiAocmVmKSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBAY2xpZW50LnJlcUxvb2t1cCBbcmVmXSwgKGVyciwgcmVzKSAtPlxuICAgICAgICByZXR1cm4gcmVqZWN0KGVycikgaWYgZXJyXG4gICAgICAgIHJlc29sdmUocmVzW3JlZl0pXG5cbiAgZXZhbDogKHRleHQpIC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIEBjbGllbnQucmVxRnJhbWVFdmFsIHRleHQsIEBzZWxlY3RlZEZyYW1lPy5pbmRleCBvciAwLCAoZXJyLCByZXN1bHQpIC0+XG4gICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgcmV0dXJuIHJlc29sdmUocmVzdWx0KVxuXG4gIGNsZWFudXA6ID0+XG4gICAgQHByb2Nlc3NNYW5hZ2VyLmNsZWFudXAoKVxuICAgIE5vZGVEZWJ1Z2dlclZpZXcuZGVzdHJveSgpXG4gICAgQGNsZWFudXBJbnRlcm5hbCgpXG5cbiAgY2xlYW51cEludGVybmFsOiA9PlxuICAgIEBjbGllbnQuZGVzdHJveSgpIGlmIEBjbGllbnRcbiAgICBAY2xpZW50ID0gbnVsbFxuICAgIGp1bXBUb0JyZWFrcG9pbnQuY2xlYW51cCgpXG4gICAgQGVtaXQgJ2Rpc2Nvbm5lY3RlZCdcblxuICBpc0Nvbm5lY3RlZDogPT5cbiAgICAgIHJldHVybiBAY2xpZW50P1xuXG4gIHRvZ2dsZTogPT5cbiAgICBOb2RlRGVidWdnZXJWaWV3LnRvZ2dsZSh0aGlzKVxuXG5leHBvcnRzLkRlYnVnZ2VyID0gRGVidWdnZXJcbmV4cG9ydHMuUHJvY2Vzc01hbmFnZXIgPSBQcm9jZXNzTWFuYWdlclxuIl19
