(function() {
  var CommandHistory, Event, TextEditorView, h, hg, merge, ref, split, stream;

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  Event = require('geval/event');

  ref = require('event-stream'), merge = ref.merge, split = ref.split;

  stream = require('stream');

  hg = require('mercury');

  h = hg.h;

  CommandHistory = require('./consolepane-utils').CommandHistory;

  exports.create = function(_debugger) {
    var ConsoleInput, ConsolePane, input, jsGrammar, tokenizeLine;
    jsGrammar = atom.grammars.grammarForScopeName('source.js');
    tokenizeLine = function(text) {
      var tokens;
      if (!jsGrammar) {
        return h('div.line', {}, text);
      }
      tokens = jsGrammar.tokenizeLine(text).tokens;
      return h('div.line', {}, [
        h('span.test.shell-session', {}, tokens.map(function(token) {
          return h('span', {
            className: token.scopes.join(' ').split('.').join(' ')
          }, [token.value]);
        }))
      ]);
    };
    ConsoleInput = (function() {
      function ConsoleInput(_debugger1) {
        this["debugger"] = _debugger1;
        this.type = "Widget";
        this._changer = Event();
        this.onEvalOrResult = this._changer.listen;
      }

      ConsoleInput.prototype.init = function() {
        var self;
        self = this;
        this.editorView = new TextEditorView({
          mini: true
        });
        this.editor = this.editorView.getModel();
        this.historyTracker = new CommandHistory(this.editor);
        this.editorView.on('keyup', function(ev) {
          var keyCode, text;
          keyCode = ev.keyCode;
          switch (keyCode) {
            case 13:
              text = self.editor.getText();
              self._changer.broadcast(text);
              self.editor.setText('');
              self.historyTracker.saveIfNew(text);
              return self["debugger"]["eval"](text).then(function(result) {
                return self._changer.broadcast(result.text);
              })["catch"](function(e) {
                if (e.message != null) {
                  return self._changer.broadcast(e.message);
                } else {
                  return self._changer.broadcast(e);
                }
              });
            case 38:
              return self.historyTracker.moveUp();
            case 40:
              return self.historyTracker.moveDown();
          }
        });
        return this.editorView.get(0);
      };

      ConsoleInput.prototype.update = function(prev, el) {
        return el;
      };

      return ConsoleInput;

    })();
    input = new ConsoleInput(_debugger);
    ConsolePane = (function(_this) {
      return function() {
        var newWriter, self, state;
        state = hg.state({
          lines: hg.array([]),
          channels: {
            clear: function(state) {
              return state.lines.set([]);
            }
          }
        });
        input.onEvalOrResult(function(text) {
          return state.lines.push(text);
        });
        newWriter = function() {
          return new stream.Writable({
            write: function(chunk, encoding, next) {
              state.lines.push(chunk.toString());
              return next();
            }
          });
        };
        self = _this;
        self.unsubscribeProcessCreated = _debugger.processManager.subscribe('processCreated', function() {
          var ref1, stderr, stdout;
          ref1 = _debugger.processManager.process, stdout = ref1.stdout, stderr = ref1.stderr;
          self.unsubscribeLogData = stdout.subscribe('data', function(d) {
            return console.log(d.toString());
          });
          self.unsubscribeLogError = stderr.subscribe('data', function(d) {
            return console.log(d.toString());
          });
          stdout.pipe(split()).pipe(newWriter());
          return stderr.pipe(split()).pipe(newWriter());
        });
        self.unsubscribeReconnect = _debugger.subscribe('reconnect', function(arg) {
          var count, host, message, port, timeout;
          count = arg.count, host = arg.host, port = arg.port, timeout = arg.timeout;
          message = "Connection attempt " + count + " to node process on " + host + ":" + port + " failed. Will try again in " + timeout + ".";
          return state.lines.push(message);
        });
        return state;
      };
    })(this);
    ConsolePane.render = function(state) {
      return h('div.inset-panel', {
        style: {
          flex: '1 1 0',
          display: 'flex',
          flexDirection: 'column'
        }
      }, [
        h('div.debugger-panel-heading', {
          style: {
            display: 'flex',
            flexDirection: 'row',
            'align-items': 'center',
            'justify-content': 'center',
            flex: '0 0 auto'
          }
        }, [
          h('div', {}, 'stdout/stderr'), h('div', {
            style: {
              'margin-left': 'auto'
            },
            className: 'icon-trashcan btn btn-primary',
            'ev-click': hg.send(state.channels.clear),
            'title': 'clear console'
          })
        ]), h('div.panel-body.padded.native-key-bindings', {
          attributes: {
            tabindex: '-1'
          },
          style: {
            flex: '1',
            overflow: 'auto',
            "font-family": "Menlo, Consolas, 'DejaVu Sans Mono', monospace"
          }
        }, state.lines.map(tokenizeLine)), h('div.debugger-editor', {
          style: {
            height: '33px',
            flexBasis: '33px'
          }
        }, [input])
      ]);
    };
    ConsolePane.cleanup = (function(_this) {
      return function() {
        if (_this.unsubscribeProcessCreated) {
          _this.unsubscribeProcessCreated();
        }
        if (_this.unsubscribeLogData) {
          _this.unsubscribeLogData();
        }
        if (_this.unsubscribeLogError) {
          _this.unsubscribeLogError();
        }
        if (_this.unsubscribeReconnect) {
          _this.unsubscribeReconnect();
        }
        _this.unsubscribeProcessCreated = null;
        _this.unsubscribeLogData = null;
        _this.unsubscribeLogError = null;
        return _this.unsubscribeReconnect = null;
      };
    })(this);
    return ConsolePane;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9Db21wb25lbnRzL0NvbnNvbGVQYW5lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsaUJBQWtCLE9BQUEsQ0FBUSxzQkFBUjs7RUFDbkIsS0FBQSxHQUFRLE9BQUEsQ0FBUSxhQUFSOztFQUNSLE1BQWlCLE9BQUEsQ0FBUSxjQUFSLENBQWpCLEVBQUMsaUJBQUQsRUFBUTs7RUFDUixNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBQ1QsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNKLElBQUs7O0VBQ0wsaUJBQWtCLE9BQUEsQ0FBUSxxQkFBUjs7RUFFbkIsT0FBTyxDQUFDLE1BQVIsR0FBaUIsU0FBQyxTQUFEO0FBQ2YsUUFBQTtJQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFkLENBQWtDLFdBQWxDO0lBRVosWUFBQSxHQUFlLFNBQUMsSUFBRDtBQUNiLFVBQUE7TUFBQSxJQUFBLENBQXNDLFNBQXRDO0FBQUEsZUFBTyxDQUFBLENBQUUsVUFBRixFQUFjLEVBQWQsRUFBa0IsSUFBbEIsRUFBUDs7TUFDQyxTQUFVLFNBQVMsQ0FBQyxZQUFWLENBQXVCLElBQXZCO2FBQ1gsQ0FBQSxDQUFFLFVBQUYsRUFBYyxFQUFkLEVBQWtCO1FBQ2hCLENBQUEsQ0FBRSx5QkFBRixFQUE2QixFQUE3QixFQUFpQyxNQUFNLENBQUMsR0FBUCxDQUFXLFNBQUMsS0FBRDtpQkFDMUMsQ0FBQSxDQUFFLE1BQUYsRUFBVTtZQUNSLFNBQUEsRUFBVyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQWIsQ0FBa0IsR0FBbEIsQ0FBc0IsQ0FBQyxLQUF2QixDQUE2QixHQUE3QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLEdBQXZDLENBREg7V0FBVixFQUVHLENBQUMsS0FBSyxDQUFDLEtBQVAsQ0FGSDtRQUQwQyxDQUFYLENBQWpDLENBRGdCO09BQWxCO0lBSGE7SUFXVDtNQUNTLHNCQUFDLFVBQUQ7UUFBQyxJQUFDLEVBQUEsUUFBQSxLQUFEO1FBQ1osSUFBQyxDQUFBLElBQUQsR0FBUTtRQUNSLElBQUMsQ0FBQSxRQUFELEdBQVksS0FBQSxDQUFBO1FBQ1osSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBQyxDQUFBLFFBQVEsQ0FBQztNQUhqQjs7NkJBS2IsSUFBQSxHQUFNLFNBQUE7QUFDSixZQUFBO1FBQUEsSUFBQSxHQUFPO1FBQ1AsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJLGNBQUosQ0FBbUI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUFuQjtRQUNkLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFVBQVUsQ0FBQyxRQUFaLENBQUE7UUFDVixJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFJLGNBQUosQ0FBbUIsSUFBQyxDQUFBLE1BQXBCO1FBRWxCLElBQUMsQ0FBQSxVQUFVLENBQUMsRUFBWixDQUFlLE9BQWYsRUFBd0IsU0FBQyxFQUFEO0FBQ3RCLGNBQUE7VUFBQyxVQUFXO0FBQ1osa0JBQU8sT0FBUDtBQUFBLGlCQUNPLEVBRFA7Y0FFSSxJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQUE7Y0FDUCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQWQsQ0FBd0IsSUFBeEI7Y0FDQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsRUFBcEI7Y0FDQSxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQXBCLENBQThCLElBQTlCO3FCQUNBLElBQ0UsRUFBQyxRQUFELEVBQ0EsRUFBQyxJQUFELEVBRkYsQ0FFUSxJQUZSLENBR0UsQ0FBQyxJQUhILENBR1EsU0FBQyxNQUFEO3VCQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBZCxDQUF3QixNQUFNLENBQUMsSUFBL0I7Y0FESSxDQUhSLENBS0UsRUFBQyxLQUFELEVBTEYsQ0FLUyxTQUFDLENBQUQ7Z0JBQ0wsSUFBRyxpQkFBSDt5QkFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQWQsQ0FBd0IsQ0FBQyxDQUFDLE9BQTFCLEVBREY7aUJBQUEsTUFBQTt5QkFHRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQWQsQ0FBd0IsQ0FBeEIsRUFIRjs7Y0FESyxDQUxUO0FBTkosaUJBZ0JPLEVBaEJQO3FCQWlCSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQXBCLENBQUE7QUFqQkosaUJBa0JPLEVBbEJQO3FCQW1CSSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQXBCLENBQUE7QUFuQko7UUFGc0IsQ0FBeEI7QUF1QkEsZUFBTyxJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosQ0FBZ0IsQ0FBaEI7TUE3Qkg7OzZCQStCTixNQUFBLEdBQVEsU0FBQyxJQUFELEVBQU8sRUFBUDtBQUNOLGVBQU87TUFERDs7Ozs7SUFHVixLQUFBLEdBQVEsSUFBSSxZQUFKLENBQWlCLFNBQWpCO0lBRVIsV0FBQSxHQUFjLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtBQUNaLFlBQUE7UUFBQSxLQUFBLEdBQVEsRUFBRSxDQUFDLEtBQUgsQ0FBUztVQUNmLEtBQUEsRUFBTyxFQUFFLENBQUMsS0FBSCxDQUFTLEVBQVQsQ0FEUTtVQUVmLFFBQUEsRUFBVTtZQUNSLEtBQUEsRUFBTyxTQUFDLEtBQUQ7cUJBQVcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFaLENBQWdCLEVBQWhCO1lBQVgsQ0FEQztXQUZLO1NBQVQ7UUFPUixLQUFLLENBQUMsY0FBTixDQUFxQixTQUFDLElBQUQ7aUJBQ25CLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBWixDQUFpQixJQUFqQjtRQURtQixDQUFyQjtRQUdBLFNBQUEsR0FBWSxTQUFBO2lCQUNWLElBQUksTUFBTSxDQUFDLFFBQVgsQ0FBb0I7WUFDbEIsS0FBQSxFQUFPLFNBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsSUFBbEI7Y0FDTCxLQUFLLENBQUMsS0FBSyxDQUFDLElBQVosQ0FBaUIsS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUFqQjtxQkFDQSxJQUFBLENBQUE7WUFGSyxDQURXO1dBQXBCO1FBRFU7UUFPWixJQUFBLEdBQU87UUFDUCxJQUFJLENBQUMseUJBQUwsR0FBaUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxTQUF6QixDQUFtQyxnQkFBbkMsRUFBcUQsU0FBQTtBQUNwRixjQUFBO1VBQUEsT0FBbUIsU0FBUyxDQUFDLGNBQWMsQ0FBQyxPQUE1QyxFQUFDLG9CQUFELEVBQVM7VUFFVCxJQUFJLENBQUMsa0JBQUwsR0FBMEIsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsTUFBakIsRUFBeUIsU0FBQyxDQUFEO21CQUFPLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBQyxDQUFDLFFBQUYsQ0FBQSxDQUFaO1VBQVAsQ0FBekI7VUFDMUIsSUFBSSxDQUFDLG1CQUFMLEdBQTJCLE1BQU0sQ0FBQyxTQUFQLENBQWlCLE1BQWpCLEVBQXlCLFNBQUMsQ0FBRDttQkFBTyxPQUFPLENBQUMsR0FBUixDQUFZLENBQUMsQ0FBQyxRQUFGLENBQUEsQ0FBWjtVQUFQLENBQXpCO1VBRTNCLE1BQ0UsQ0FBQyxJQURILENBQ1EsS0FBQSxDQUFBLENBRFIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxTQUFBLENBQUEsQ0FGUjtpQkFJQSxNQUNFLENBQUMsSUFESCxDQUNRLEtBQUEsQ0FBQSxDQURSLENBRUUsQ0FBQyxJQUZILENBRVEsU0FBQSxDQUFBLENBRlI7UUFWb0YsQ0FBckQ7UUFjakMsSUFBSSxDQUFDLG9CQUFMLEdBQTRCLFNBQVMsQ0FBQyxTQUFWLENBQW9CLFdBQXBCLEVBQWlDLFNBQUMsR0FBRDtBQUMzRCxjQUFBO1VBRDZELG1CQUFNLGlCQUFLLGlCQUFLO1VBQzdFLE9BQUEsR0FBVSxxQkFBQSxHQUFzQixLQUF0QixHQUE0QixzQkFBNUIsR0FBa0QsSUFBbEQsR0FBdUQsR0FBdkQsR0FBMEQsSUFBMUQsR0FBK0QsNkJBQS9ELEdBQTRGLE9BQTVGLEdBQW9HO2lCQUM5RyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQVosQ0FBaUIsT0FBakI7UUFGMkQsQ0FBakM7QUFJNUIsZUFBTztNQXJDSztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7SUF1Q2QsV0FBVyxDQUFDLE1BQVosR0FBcUIsU0FBQyxLQUFEO2FBQ25CLENBQUEsQ0FBRSxpQkFBRixFQUFxQjtRQUNuQixLQUFBLEVBQU87VUFDTCxJQUFBLEVBQU0sT0FERDtVQUVMLE9BQUEsRUFBUyxNQUZKO1VBR0wsYUFBQSxFQUFlLFFBSFY7U0FEWTtPQUFyQixFQU1HO1FBQ0QsQ0FBQSxDQUFFLDRCQUFGLEVBQWdDO1VBQzVCLEtBQUEsRUFBTztZQUNMLE9BQUEsRUFBUyxNQURKO1lBRUwsYUFBQSxFQUFlLEtBRlY7WUFHTCxhQUFBLEVBQWUsUUFIVjtZQUlMLGlCQUFBLEVBQW1CLFFBSmQ7WUFLTCxJQUFBLEVBQU0sVUFMRDtXQURxQjtTQUFoQyxFQVNFO1VBQ0UsQ0FBQSxDQUFFLEtBQUYsRUFBUyxFQUFULEVBQWEsZUFBYixDQURGLEVBRUUsQ0FBQSxDQUFFLEtBQUYsRUFBUztZQUNQLEtBQUEsRUFBTztjQUFFLGFBQUEsRUFBZSxNQUFqQjthQURBO1lBRVAsU0FBQSxFQUFXLCtCQUZKO1lBR1AsVUFBQSxFQUFZLEVBQUUsQ0FBQyxJQUFILENBQVEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUF2QixDQUhMO1lBSVAsT0FBQSxFQUFTLGVBSkY7V0FBVCxDQUZGO1NBVEYsQ0FEQyxFQW1CRCxDQUFBLENBQUUsMkNBQUYsRUFBK0M7VUFDN0MsVUFBQSxFQUFZO1lBQ1YsUUFBQSxFQUFVLElBREE7V0FEaUM7VUFJN0MsS0FBQSxFQUFPO1lBQ0wsSUFBQSxFQUFNLEdBREQ7WUFFTCxRQUFBLEVBQVUsTUFGTDtZQUdMLGFBQUEsRUFBZSxnREFIVjtXQUpzQztTQUEvQyxFQVNHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBWixDQUFnQixZQUFoQixDQVRILENBbkJDLEVBNkJELENBQUEsQ0FBRSxxQkFBRixFQUF5QjtVQUFBLEtBQUEsRUFBTztZQUM5QixNQUFBLEVBQVEsTUFEc0I7WUFFOUIsU0FBQSxFQUFXLE1BRm1CO1dBQVA7U0FBekIsRUFHRyxDQUNELEtBREMsQ0FISCxDQTdCQztPQU5IO0lBRG1CO0lBNENyQixXQUFXLENBQUMsT0FBWixHQUFzQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7UUFDcEIsSUFBZ0MsS0FBQyxDQUFBLHlCQUFqQztVQUFBLEtBQUMsQ0FBQSx5QkFBRCxDQUFBLEVBQUE7O1FBQ0EsSUFBeUIsS0FBQyxDQUFBLGtCQUExQjtVQUFBLEtBQUMsQ0FBQSxrQkFBRCxDQUFBLEVBQUE7O1FBQ0EsSUFBMEIsS0FBQyxDQUFBLG1CQUEzQjtVQUFBLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLEVBQUE7O1FBQ0EsSUFBMkIsS0FBQyxDQUFBLG9CQUE1QjtVQUFBLEtBQUMsQ0FBQSxvQkFBRCxDQUFBLEVBQUE7O1FBQ0EsS0FBQyxDQUFBLHlCQUFELEdBQTZCO1FBQzdCLEtBQUMsQ0FBQSxrQkFBRCxHQUFzQjtRQUN0QixLQUFDLENBQUEsbUJBQUQsR0FBdUI7ZUFDdkIsS0FBQyxDQUFBLG9CQUFELEdBQXdCO01BUko7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0FBVXRCLFdBQU87RUFySlE7QUFSakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7VGV4dEVkaXRvclZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5FdmVudCA9IHJlcXVpcmUgJ2dldmFsL2V2ZW50J1xue21lcmdlLCBzcGxpdH0gPSByZXF1aXJlICdldmVudC1zdHJlYW0nXG5zdHJlYW0gPSByZXF1aXJlICdzdHJlYW0nXG5oZyA9IHJlcXVpcmUgJ21lcmN1cnknXG57aH0gPSBoZ1xue0NvbW1hbmRIaXN0b3J5fSA9IHJlcXVpcmUgJy4vY29uc29sZXBhbmUtdXRpbHMnXG5cbmV4cG9ydHMuY3JlYXRlID0gKF9kZWJ1Z2dlcikgLT5cbiAganNHcmFtbWFyID0gYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKCdzb3VyY2UuanMnKVxuXG4gIHRva2VuaXplTGluZSA9ICh0ZXh0KSAtPlxuICAgIHJldHVybiBoKCdkaXYubGluZScsIHt9LCB0ZXh0KSB1bmxlc3MganNHcmFtbWFyXG4gICAge3Rva2Vuc30gPSBqc0dyYW1tYXIudG9rZW5pemVMaW5lKHRleHQpXG4gICAgaCgnZGl2LmxpbmUnLCB7fSwgW1xuICAgICAgaCgnc3Bhbi50ZXN0LnNoZWxsLXNlc3Npb24nLCB7fSwgdG9rZW5zLm1hcCgodG9rZW4pIC0+XG4gICAgICAgIGgoJ3NwYW4nLCB7XG4gICAgICAgICAgY2xhc3NOYW1lOiB0b2tlbi5zY29wZXMuam9pbignICcpLnNwbGl0KCcuJykuam9pbignICcpXG4gICAgICAgIH0sIFt0b2tlbi52YWx1ZV0pXG4gICAgICApKVxuICAgIF0pXG5cbiAgY2xhc3MgQ29uc29sZUlucHV0XG4gICAgY29uc3RydWN0b3I6IChAZGVidWdnZXIpLT5cbiAgICAgIEB0eXBlID0gXCJXaWRnZXRcIlxuICAgICAgQF9jaGFuZ2VyID0gRXZlbnQoKVxuICAgICAgQG9uRXZhbE9yUmVzdWx0ID0gQF9jaGFuZ2VyLmxpc3RlblxuXG4gICAgaW5pdDogLT5cbiAgICAgIHNlbGYgPSB0aGlzXG4gICAgICBAZWRpdG9yVmlldyA9IG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgQGVkaXRvciA9IEBlZGl0b3JWaWV3LmdldE1vZGVsKClcbiAgICAgIEBoaXN0b3J5VHJhY2tlciA9IG5ldyBDb21tYW5kSGlzdG9yeShAZWRpdG9yKVxuXG4gICAgICBAZWRpdG9yVmlldy5vbiAna2V5dXAnLCAoZXYpIC0+XG4gICAgICAgIHtrZXlDb2RlfSA9IGV2XG4gICAgICAgIHN3aXRjaCBrZXlDb2RlXG4gICAgICAgICAgd2hlbiAxM1xuICAgICAgICAgICAgdGV4dCA9IHNlbGYuZWRpdG9yLmdldFRleHQoKVxuICAgICAgICAgICAgc2VsZi5fY2hhbmdlci5icm9hZGNhc3QodGV4dClcbiAgICAgICAgICAgIHNlbGYuZWRpdG9yLnNldFRleHQoJycpXG4gICAgICAgICAgICBzZWxmLmhpc3RvcnlUcmFja2VyLnNhdmVJZk5ldyh0ZXh0KVxuICAgICAgICAgICAgc2VsZlxuICAgICAgICAgICAgICAuZGVidWdnZXJcbiAgICAgICAgICAgICAgLmV2YWwodGV4dClcbiAgICAgICAgICAgICAgLnRoZW4gKHJlc3VsdCkgLT5cbiAgICAgICAgICAgICAgICBzZWxmLl9jaGFuZ2VyLmJyb2FkY2FzdChyZXN1bHQudGV4dClcbiAgICAgICAgICAgICAgLmNhdGNoIChlKSAtPlxuICAgICAgICAgICAgICAgIGlmIGUubWVzc2FnZT9cbiAgICAgICAgICAgICAgICAgIHNlbGYuX2NoYW5nZXIuYnJvYWRjYXN0KGUubWVzc2FnZSlcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBzZWxmLl9jaGFuZ2VyLmJyb2FkY2FzdChlKVxuICAgICAgICAgIHdoZW4gMzhcbiAgICAgICAgICAgIHNlbGYuaGlzdG9yeVRyYWNrZXIubW92ZVVwKClcbiAgICAgICAgICB3aGVuIDQwXG4gICAgICAgICAgICBzZWxmLmhpc3RvcnlUcmFja2VyLm1vdmVEb3duKClcblxuICAgICAgcmV0dXJuIEBlZGl0b3JWaWV3LmdldCgwKVxuXG4gICAgdXBkYXRlOiAocHJldiwgZWwpIC0+XG4gICAgICByZXR1cm4gZWxcblxuICBpbnB1dCA9IG5ldyBDb25zb2xlSW5wdXQoX2RlYnVnZ2VyKVxuXG4gIENvbnNvbGVQYW5lID0gKCkgPT5cbiAgICBzdGF0ZSA9IGhnLnN0YXRlKHtcbiAgICAgIGxpbmVzOiBoZy5hcnJheShbXSlcbiAgICAgIGNoYW5uZWxzOiB7XG4gICAgICAgIGNsZWFyOiAoc3RhdGUpIC0+IHN0YXRlLmxpbmVzLnNldChbXSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaW5wdXQub25FdmFsT3JSZXN1bHQgKHRleHQpIC0+XG4gICAgICBzdGF0ZS5saW5lcy5wdXNoKHRleHQpXG5cbiAgICBuZXdXcml0ZXIgPSAoKSAtPlxuICAgICAgbmV3IHN0cmVhbS5Xcml0YWJsZSh7XG4gICAgICAgIHdyaXRlOiAoY2h1bmssIGVuY29kaW5nLCBuZXh0KSAtPlxuICAgICAgICAgIHN0YXRlLmxpbmVzLnB1c2goY2h1bmsudG9TdHJpbmcoKSlcbiAgICAgICAgICBuZXh0KClcbiAgICAgIH0pXG5cbiAgICBzZWxmID0gdGhpc1xuICAgIHNlbGYudW5zdWJzY3JpYmVQcm9jZXNzQ3JlYXRlZCA9IF9kZWJ1Z2dlci5wcm9jZXNzTWFuYWdlci5zdWJzY3JpYmUgJ3Byb2Nlc3NDcmVhdGVkJywgLT5cbiAgICAgIHtzdGRvdXQsIHN0ZGVycn0gPSBfZGVidWdnZXIucHJvY2Vzc01hbmFnZXIucHJvY2Vzc1xuXG4gICAgICBzZWxmLnVuc3Vic2NyaWJlTG9nRGF0YSA9IHN0ZG91dC5zdWJzY3JpYmUgJ2RhdGEnLCAoZCkgLT4gY29uc29sZS5sb2coZC50b1N0cmluZygpKVxuICAgICAgc2VsZi51bnN1YnNjcmliZUxvZ0Vycm9yID0gc3RkZXJyLnN1YnNjcmliZSAnZGF0YScsIChkKSAtPiBjb25zb2xlLmxvZyhkLnRvU3RyaW5nKCkpXG5cbiAgICAgIHN0ZG91dFxuICAgICAgICAucGlwZShzcGxpdCgpKVxuICAgICAgICAucGlwZShuZXdXcml0ZXIoKSlcblxuICAgICAgc3RkZXJyXG4gICAgICAgIC5waXBlKHNwbGl0KCkpXG4gICAgICAgIC5waXBlKG5ld1dyaXRlcigpKVxuXG4gICAgc2VsZi51bnN1YnNjcmliZVJlY29ubmVjdCA9IF9kZWJ1Z2dlci5zdWJzY3JpYmUgJ3JlY29ubmVjdCcsICh7Y291bnQsaG9zdCxwb3J0LHRpbWVvdXR9KSAtPlxuICAgICAgbWVzc2FnZSA9IFwiQ29ubmVjdGlvbiBhdHRlbXB0ICN7Y291bnR9IHRvIG5vZGUgcHJvY2VzcyBvbiAje2hvc3R9OiN7cG9ydH0gZmFpbGVkLiBXaWxsIHRyeSBhZ2FpbiBpbiAje3RpbWVvdXR9LlwiXG4gICAgICBzdGF0ZS5saW5lcy5wdXNoKG1lc3NhZ2UpXG5cbiAgICByZXR1cm4gc3RhdGVcblxuICBDb25zb2xlUGFuZS5yZW5kZXIgPSAoc3RhdGUpIC0+XG4gICAgaCgnZGl2Lmluc2V0LXBhbmVsJywge1xuICAgICAgc3R5bGU6IHtcbiAgICAgICAgZmxleDogJzEgMSAwJ1xuICAgICAgICBkaXNwbGF5OiAnZmxleCdcbiAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbidcbiAgICAgIH1cbiAgICB9LCBbXG4gICAgICBoKCdkaXYuZGVidWdnZXItcGFuZWwtaGVhZGluZycsIHtcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnXG4gICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAncm93J1xuICAgICAgICAgICAgJ2FsaWduLWl0ZW1zJzogJ2NlbnRlcidcbiAgICAgICAgICAgICdqdXN0aWZ5LWNvbnRlbnQnOiAnY2VudGVyJ1xuICAgICAgICAgICAgZmxleDogJzAgMCBhdXRvJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBbXG4gICAgICAgICAgaCgnZGl2Jywge30sICdzdGRvdXQvc3RkZXJyJylcbiAgICAgICAgICBoKCdkaXYnLCB7XG4gICAgICAgICAgICBzdHlsZTogeyAnbWFyZ2luLWxlZnQnOiAnYXV0bycgfSxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2ljb24tdHJhc2hjYW4gYnRuIGJ0bi1wcmltYXJ5J1xuICAgICAgICAgICAgJ2V2LWNsaWNrJzogaGcuc2VuZCBzdGF0ZS5jaGFubmVscy5jbGVhclxuICAgICAgICAgICAgJ3RpdGxlJzogJ2NsZWFyIGNvbnNvbGUnXG4gICAgICAgICAgfSlcbiAgICAgICAgXSlcbiAgICAgIGgoJ2Rpdi5wYW5lbC1ib2R5LnBhZGRlZC5uYXRpdmUta2V5LWJpbmRpbmdzJywge1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgdGFiaW5kZXg6ICctMSdcbiAgICAgICAgfVxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGZsZXg6ICcxJ1xuICAgICAgICAgIG92ZXJmbG93OiAnYXV0bydcbiAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiTWVubG8sIENvbnNvbGFzLCAnRGVqYVZ1IFNhbnMgTW9ubycsIG1vbm9zcGFjZVwiXG4gICAgICAgIH1cbiAgICAgIH0sIHN0YXRlLmxpbmVzLm1hcCh0b2tlbml6ZUxpbmUpKVxuICAgICAgaCgnZGl2LmRlYnVnZ2VyLWVkaXRvcicsIHN0eWxlOiB7XG4gICAgICAgIGhlaWdodDogJzMzcHgnXG4gICAgICAgIGZsZXhCYXNpczogJzMzcHgnXG4gICAgICB9LCBbXG4gICAgICAgIGlucHV0XG4gICAgICBdKVxuICAgIF0pXG5cbiAgQ29uc29sZVBhbmUuY2xlYW51cCA9ICgpID0+XG4gICAgQHVuc3Vic2NyaWJlUHJvY2Vzc0NyZWF0ZWQoKSBpZiBAdW5zdWJzY3JpYmVQcm9jZXNzQ3JlYXRlZFxuICAgIEB1bnN1YnNjcmliZUxvZ0RhdGEoKSBpZiBAdW5zdWJzY3JpYmVMb2dEYXRhXG4gICAgQHVuc3Vic2NyaWJlTG9nRXJyb3IoKSBpZiBAdW5zdWJzY3JpYmVMb2dFcnJvclxuICAgIEB1bnN1YnNjcmliZVJlY29ubmVjdCgpIGlmIEB1bnN1YnNjcmliZVJlY29ubmVjdFxuICAgIEB1bnN1YnNjcmliZVByb2Nlc3NDcmVhdGVkID0gbnVsbFxuICAgIEB1bnN1YnNjcmliZUxvZ0RhdGEgPSBudWxsXG4gICAgQHVuc3Vic2NyaWJlTG9nRXJyb3IgPSBudWxsXG4gICAgQHVuc3Vic2NyaWJlUmVjb25uZWN0ID0gbnVsbFxuXG4gIHJldHVybiBDb25zb2xlUGFuZVxuIl19
