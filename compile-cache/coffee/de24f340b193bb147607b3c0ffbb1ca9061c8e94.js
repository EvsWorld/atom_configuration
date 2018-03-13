(function() {
  var CompositeDisposable, Debugger, _debugger, fs, logger, onBreak, os, processManager;

  CompositeDisposable = require('atom').CompositeDisposable;

  Debugger = require('./debugger').Debugger;

  logger = require('./logger');

  os = require('os');

  fs = require('fs');

  processManager = null;

  _debugger = null;

  onBreak = null;

  module.exports = {
    config: {
      nodePath: {
        type: 'string',
        "default": os.platform() === 'win32' ? 'node.exe' : '/bin/node'
      },
      debugPort: {
        type: 'number',
        minium: 5857,
        maxium: 65535,
        "default": 5858
      },
      debugHost: {
        type: 'string',
        "default": '127.0.0.1'
      },
      nodeArgs: {
        type: 'string',
        "default": ''
      },
      scriptMain: {
        type: 'string',
        "default": ''
      },
      appArgs: {
        type: 'string',
        "default": ''
      },
      env: {
        type: 'string',
        "default": ''
      }
    },
    activate: function() {
      this.disposables = new CompositeDisposable();
      _debugger = new Debugger(atom);
      this.disposables.add(_debugger.subscribeDisposable('connected', function() {}));
      this.disposables.add(_debugger.subscribeDisposable('disconnected', function() {}));
      return this.disposables.add(atom.commands.add('atom-workspace', {
        'node-debugger:start-resume': (function(_this) {
          return function() {
            return _this.startOrResume();
          };
        })(this),
        'node-debugger:start-active-file': (function(_this) {
          return function() {
            return _this.startActiveFile();
          };
        })(this),
        'node-debugger:stop': (function(_this) {
          return function() {
            return _this.stop();
          };
        })(this),
        'node-debugger:toggle-breakpoint': (function(_this) {
          return function() {
            return _this.toggleBreakpoint();
          };
        })(this),
        'node-debugger:step-next': (function(_this) {
          return function() {
            return _this.stepNext();
          };
        })(this),
        'node-debugger:step-in': (function(_this) {
          return function() {
            return _this.stepIn();
          };
        })(this),
        'node-debugger:step-out': (function(_this) {
          return function() {
            return _this.stepOut();
          };
        })(this),
        'node-debugger:attach': (function(_this) {
          return function() {
            return _this.attach();
          };
        })(this),
        'node-debugger:toggle-debugger': (function(_this) {
          return function() {
            return _this.toggleDebugger();
          };
        })(this)
      }));
    },
    startOrResume: function() {
      if (_debugger.isConnected()) {
        return _debugger.reqContinue();
      } else {
        this.saveAll();
        return _debugger.start();
      }
    },
    attach: function() {
      if (_debugger.isConnected()) {
        return;
      }
      return _debugger.attach();
    },
    startActiveFile: function() {
      if (_debugger.isConnected()) {
        return;
      }
      this.saveAll();
      return _debugger.startActiveFile();
    },
    toggleBreakpoint: function() {
      var editor, path, row;
      editor = atom.workspace.getActiveTextEditor();
      path = editor.getPath();
      row = editor.getCursorBufferPosition().row;
      return _debugger.breakpointManager.toggleBreakpoint(editor, path, row);
    },
    stepNext: function() {
      if (_debugger.isConnected()) {
        return _debugger.step('next', 1);
      }
    },
    stepIn: function() {
      if (_debugger.isConnected()) {
        return _debugger.step('in', 1);
      }
    },
    stepOut: function() {
      if (_debugger.isConnected()) {
        return _debugger.step('out', 1);
      }
    },
    stop: function() {
      return _debugger.cleanup();
    },
    deactivate: function() {
      logger.info('deactive', 'stop running plugin');
      this.stop();
      this.disposables.dispose();
      return _debugger.dispose();
    },
    toggleDebugger: function() {
      return _debugger.toggle();
    },
    saveAll: function() {
      var current, i, len, paneItem, ref, ref1, ref2, results;
      current = (ref = atom.workspace) != null ? typeof ref.getActiveEditor === "function" ? ref.getActiveEditor() : void 0 : void 0;
      if (current == null) {
        current = (ref1 = atom.workspace) != null ? typeof ref1.getActiveTextEditor === "function" ? ref1.getActiveTextEditor() : void 0 : void 0;
      }
      if ((current != null) && ((typeof current.getURI === "function" ? current.getURI() : void 0) != null) && (typeof current.isModified === "function" ? current.isModified() : void 0) && ((typeof paneItem !== "undefined" && paneItem !== null ? typeof paneItem.getPath === "function" ? paneItem.getPath() : void 0 : void 0) != null) && (!fs.existsSync(paneItem.getPath()) || !fs.statSync(current.getPath()).isFile())) {
        current.save();
      }
      ref2 = atom.workspace.getPaneItems();
      results = [];
      for (i = 0, len = ref2.length; i < len; i++) {
        paneItem = ref2[i];
        if (((typeof paneItem.getURI === "function" ? paneItem.getURI() : void 0) != null) && (typeof paneItem.isModified === "function" ? paneItem.isModified() : void 0) && ((paneItem != null ? typeof paneItem.getPath === "function" ? paneItem.getPath() : void 0 : void 0) != null) && fs.existsSync(paneItem.getPath()) && fs.statSync(paneItem.getPath()).isFile()) {
          results.push(paneItem.save());
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9ub2RlLWRlYnVnZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN2QixXQUFZLE9BQUEsQ0FBUSxZQUFSOztFQUNiLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7RUFDVCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUVMLGNBQUEsR0FBaUI7O0VBQ2pCLFNBQUEsR0FBWTs7RUFDWixPQUFBLEdBQVU7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLFFBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBWSxFQUFFLENBQUMsUUFBSCxDQUFBLENBQUEsS0FBaUIsT0FBcEIsR0FBaUMsVUFBakMsR0FBaUQsV0FEMUQ7T0FERjtNQUdBLFNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsTUFBQSxFQUFRLElBRFI7UUFFQSxNQUFBLEVBQVEsS0FGUjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFIVDtPQUpGO01BUUEsU0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFdBRFQ7T0FURjtNQVdBLFFBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO09BWkY7TUFjQSxVQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFEVDtPQWZGO01BaUJBLE9BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFB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LEVBQVMsU0FBQTtBQUVQLFVBQUE7TUFBQSxPQUFBLG1GQUF3QixDQUFFOztRQUMxQixpR0FBeUIsQ0FBRTs7TUFDM0IsSUFBRyxpQkFBQSxJQUFhLDRFQUFiLGdEQUFvQyxPQUFPLENBQUMsc0JBQTVDLElBQThELGdKQUE5RCxJQUF3RixDQUFDLENBQUMsRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFRLENBQUMsT0FBVCxDQUFBLENBQWQsQ0FBRCxJQUFzQyxDQUFDLEVBQUUsQ0FBQyxRQUFILENBQVksT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFaLENBQThCLENBQUMsTUFBL0IsQ0FBQSxDQUF4QyxDQUEzRjtRQUNFLE9BQU8sQ0FBQyxJQUFSLENBQUEsRUFERjs7QUFHQTtBQUFBO1dBQUEsc0NBQUE7O1FBQ0UsSUFBRyw4RUFBQSxpREFBd0IsUUFBUSxDQUFDLHNCQUFqQyxJQUFtRCw0R0FBbkQsSUFBNkUsRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFRLENBQUMsT0FBVCxDQUFBLENBQWQsQ0FBN0UsSUFBbUgsRUFBRSxDQUFDLFFBQUgsQ0FBWSxRQUFRLENBQUMsT0FBVCxDQUFBLENBQVosQ0FBK0IsQ0FBQyxNQUFoQyxDQUFBLENBQXRIO3VCQUNFLFFBQVEsQ0FBQyxJQUFULENBQUEsR0FERjtTQUFBLE1BQUE7K0JBQUE7O0FBREY7O0lBUE8sQ0F2RlQ7O0FBWEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue0RlYnVnZ2VyfSA9IHJlcXVpcmUgJy4vZGVidWdnZXInXG5sb2dnZXIgPSByZXF1aXJlICcuL2xvZ2dlcidcbm9zID0gcmVxdWlyZSAnb3MnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xuXG5wcm9jZXNzTWFuYWdlciA9IG51bGxcbl9kZWJ1Z2dlciA9IG51bGxcbm9uQnJlYWsgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIG5vZGVQYXRoOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IGlmIG9zLnBsYXRmb3JtKCkgaXMgJ3dpbjMyJyB0aGVuICdub2RlLmV4ZScgZWxzZSAnL2Jpbi9ub2RlJ1xuICAgIGRlYnVnUG9ydDpcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICBtaW5pdW06IDU4NTdcbiAgICAgIG1heGl1bTogNjU1MzVcbiAgICAgIGRlZmF1bHQ6IDU4NThcbiAgICBkZWJ1Z0hvc3Q6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJzEyNy4wLjAuMSdcbiAgICBub2RlQXJnczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnJ1xuICAgIHNjcmlwdE1haW46XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJydcbiAgICBhcHBBcmdzOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcnXG4gICAgZW52OlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcnXG5cbiAgYWN0aXZhdGU6ICgpIC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIF9kZWJ1Z2dlciA9IG5ldyBEZWJ1Z2dlcihhdG9tKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgX2RlYnVnZ2VyLnN1YnNjcmliZURpc3Bvc2FibGUgJ2Nvbm5lY3RlZCcsIC0+XG4gICAgICAjYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJ2Nvbm5lY3RlZCwgZW5qb3kgZGVidWdnaW5nIDogKScpXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBfZGVidWdnZXIuc3Vic2NyaWJlRGlzcG9zYWJsZSAnZGlzY29ubmVjdGVkJywgLT5cbiAgICAgICNhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnZmluaXNoIGRlYnVnZ2luZyA6ICknKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ25vZGUtZGVidWdnZXI6c3RhcnQtcmVzdW1lJzogPT4gQHN0YXJ0T3JSZXN1bWUoKVxuICAgICAgJ25vZGUtZGVidWdnZXI6c3RhcnQtYWN0aXZlLWZpbGUnOiA9PiBAc3RhcnRBY3RpdmVGaWxlKClcbiAgICAgICdub2RlLWRlYnVnZ2VyOnN0b3AnOiA9PiBAc3RvcCgpXG4gICAgICAnbm9kZS1kZWJ1Z2dlcjp0b2dnbGUtYnJlYWtwb2ludCc6ID0+IEB0b2dnbGVCcmVha3BvaW50KClcbiAgICAgICdub2RlLWRlYnVnZ2VyOnN0ZXAtbmV4dCc6ID0+IEBzdGVwTmV4dCgpXG4gICAgICAnbm9kZS1kZWJ1Z2dlcjpzdGVwLWluJzogPT4gQHN0ZXBJbigpXG4gICAgICAnbm9kZS1kZWJ1Z2dlcjpzdGVwLW91dCc6ID0+IEBzdGVwT3V0KClcbiAgICAgICdub2RlLWRlYnVnZ2VyOmF0dGFjaCc6ID0+IEBhdHRhY2goKVxuICAgICAgJ25vZGUtZGVidWdnZXI6dG9nZ2xlLWRlYnVnZ2VyJzogPT4gQHRvZ2dsZURlYnVnZ2VyKClcbiAgICB9KVxuXG4gIHN0YXJ0T3JSZXN1bWU6IC0+XG4gICAgaWYgX2RlYnVnZ2VyLmlzQ29ubmVjdGVkKClcbiAgICAgIF9kZWJ1Z2dlci5yZXFDb250aW51ZSgpXG4gICAgZWxzZVxuICAgICAgQHNhdmVBbGwoKVxuICAgICAgX2RlYnVnZ2VyLnN0YXJ0KClcblxuICBhdHRhY2g6IC0+XG4gICAgcmV0dXJuIGlmIF9kZWJ1Z2dlci5pc0Nvbm5lY3RlZCgpXG4gICAgX2RlYnVnZ2VyLmF0dGFjaCgpXG5cbiAgc3RhcnRBY3RpdmVGaWxlOiAtPlxuICAgIHJldHVybiBpZiBfZGVidWdnZXIuaXNDb25uZWN0ZWQoKVxuICAgIEBzYXZlQWxsKClcbiAgICBfZGVidWdnZXIuc3RhcnRBY3RpdmVGaWxlKClcblxuICB0b2dnbGVCcmVha3BvaW50OiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAge3Jvd30gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIF9kZWJ1Z2dlci5icmVha3BvaW50TWFuYWdlci50b2dnbGVCcmVha3BvaW50IGVkaXRvciwgcGF0aCwgcm93XG5cbiAgc3RlcE5leHQ6IC0+XG4gICAgX2RlYnVnZ2VyLnN0ZXAoJ25leHQnLCAxKSBpZiBfZGVidWdnZXIuaXNDb25uZWN0ZWQoKVxuXG4gIHN0ZXBJbjogLT5cbiAgICBfZGVidWdnZXIuc3RlcCgnaW4nLCAxKSBpZiBfZGVidWdnZXIuaXNDb25uZWN0ZWQoKVxuXG4gIHN0ZXBPdXQ6IC0+XG4gICAgX2RlYnVnZ2VyLnN0ZXAoJ291dCcsIDEpIGlmIF9kZWJ1Z2dlci5pc0Nvbm5lY3RlZCgpXG5cbiAgc3RvcDogLT5cbiAgICBfZGVidWdnZXIuY2xlYW51cCgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBsb2dnZXIuaW5mbyAnZGVhY3RpdmUnLCAnc3RvcCBydW5uaW5nIHBsdWdpbidcbiAgICBAc3RvcCgpXG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIF9kZWJ1Z2dlci5kaXNwb3NlKClcblxuICB0b2dnbGVEZWJ1Z2dlcjogLT5cbiAgICBfZGVidWdnZXIudG9nZ2xlKClcblxuICBzYXZlQWxsOiAtPlxuICAgICMgY29kZSBzaGFtZWxlc3NseSBjb3BpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vQnJvd25CZWFyMi9hdG9tLXNhdmUtYWxsL2Jsb2IvbWFzdGVyL2xpYi9hdG9tLXNhdmUtYWxsLmNvZmZlZVxuICAgIGN1cnJlbnQgPSBhdG9tLndvcmtzcGFjZT8uZ2V0QWN0aXZlRWRpdG9yPygpXG4gICAgY3VycmVudCA/PSBhdG9tLndvcmtzcGFjZT8uZ2V0QWN0aXZlVGV4dEVkaXRvcj8oKVxuICAgIGlmIGN1cnJlbnQ/IGFuZCBjdXJyZW50LmdldFVSST8oKT8gYW5kIGN1cnJlbnQuaXNNb2RpZmllZD8oKSBhbmQgcGFuZUl0ZW0/LmdldFBhdGg/KCk/IGFuZCAoIWZzLmV4aXN0c1N5bmMocGFuZUl0ZW0uZ2V0UGF0aCgpKSBvciAhZnMuc3RhdFN5bmMoY3VycmVudC5nZXRQYXRoKCkpLmlzRmlsZSgpKVxuICAgICAgY3VycmVudC5zYXZlKClcblxuICAgIGZvciBwYW5lSXRlbSBpbiBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKVxuICAgICAgaWYgcGFuZUl0ZW0uZ2V0VVJJPygpPyBhbmQgcGFuZUl0ZW0uaXNNb2RpZmllZD8oKSBhbmQgcGFuZUl0ZW0/LmdldFBhdGg/KCk/IGFuZCBmcy5leGlzdHNTeW5jKHBhbmVJdGVtLmdldFBhdGgoKSkgYW5kIGZzLnN0YXRTeW5jKHBhbmVJdGVtLmdldFBhdGgoKSkuaXNGaWxlKClcbiAgICAgICAgcGFuZUl0ZW0uc2F2ZSgpXG4iXX0=
