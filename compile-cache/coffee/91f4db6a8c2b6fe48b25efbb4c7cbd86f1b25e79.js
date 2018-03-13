(function() {
  var FocusHook, Promise, TreeView, TreeViewItem, TreeViewUtils, fs, h, hg, listeners, log, openScript, ref1;

  Promise = require('bluebird');

  ref1 = require('./TreeView'), TreeView = ref1.TreeView, TreeViewItem = ref1.TreeViewItem, TreeViewUtils = ref1.TreeViewUtils;

  hg = require('mercury');

  fs = require('fs');

  h = hg.h;

  FocusHook = require('./focus-hook');

  listeners = [];

  log = function(msg) {};

  openScript = function(scriptId, script, line) {
    var PROTOCOL, scriptExists;
    PROTOCOL = 'atom-node-debugger://';
    scriptExists = new Promise(function(resolve) {
      return fs.exists(script, function(result) {
        return resolve(result);
      });
    });
    return scriptExists.then(function(exists) {
      if (exists) {
        return atom.workspace.open(script, {
          initialLine: line,
          initialColumn: 0,
          activatePane: true,
          searchAllPanes: true
        });
      } else {
        if (scriptId == null) {
          return;
        }
        return atom.workspace.open("" + PROTOCOL + scriptId, {
          initialColumn: 0,
          initialLine: line,
          name: script,
          searchAllPanes: true
        });
      }
    });
  };

  exports.create = function(_debugger) {
    var CallStackPane, LocalsPane, TreeViewWatchItem, WatchPane, builder, builder2, builder3;
    builder = {
      loadProperties: function(ref) {
        log("builder.loadProperties " + ref);
        return _debugger.lookup(ref).then(function(instance) {
          log("builder.loadProperties: instance loaded");
          if (instance.className === "Date") {
            return [
              {
                name: "value",
                value: {
                  type: "string",
                  className: "string",
                  value: instance.value
                }
              }
            ];
          } else {
            return Promise.map(instance.properties, function(prop) {
              return _debugger.lookup(prop.ref);
            }).then(function(values) {
              log("builder.loadProperties: property values loaded");
              values.forEach(function(value, idx) {
                return instance.properties[idx].value = value;
              });
              return instance.properties;
            });
          }
        });
      },
      loadArrayLength: function(ref) {
        return _debugger.lookup(ref).then(function(instance) {
          return _debugger.lookup(instance.properties[0].ref);
        }).then(function(result) {
          return result.value;
        });
      },
      loadFrames: function() {
        log("builder.loadFrames");
        return _debugger.fullTrace().then(function(traces) {
          log("builder.loadFrames: frames loaded " + traces.frames.length);
          return traces.frames;
        });
      },
      property: function(property) {
        log("builder.property");
        return builder.value({
          name: property.name,
          value: {
            ref: property.ref,
            type: property.value.type,
            className: property.value.className,
            value: property.value.value
          }
        });
      },
      value: function(value, handlers) {
        var className, isArray, name, ref, title, type;
        log("builder.value");
        name = value.name;
        type = value.value.type;
        className = value.value.className;
        switch (type) {
          case 'string':
          case 'boolean':
          case 'number':
          case 'undefined':
          case 'null':
            value = value.value.value;
            title = type === 'string' ? name + " : \"" + value + "\"" : name + " : " + value;
            return TreeViewItem(title, {
              handlers: handlers
            });
          case 'function':
            return TreeViewItem(name + " : function() { ... }", {
              handlers: handlers
            });
          case 'object':
            ref = value.value.ref || value.value.handle;
            isArray = className === "Array";
            return (isArray ? builder.loadArrayLength(ref) : Promise.resolve(0)).then(function(len) {
              var decorate;
              decorate = function(title) {
                return function(state) {
                  if (state.isOpen) {
                    return title;
                  } else {
                    if (isArray) {
                      return h('span', {}, [title + " [ " + len + " ]", h('span.subtle-text', {}, " #" + ref)]);
                    } else {
                      return h('span', {}, [title + " { ... }", h('span.subtle-text', {}, " #" + ref)]);
                    }
                  }
                };
              };
              return TreeView(decorate(name + " : " + className), ((function(_this) {
                return function() {
                  return builder.loadProperties(ref).map(builder.property);
                };
              })(this)), {
                handlers: handlers
              });
            });
        }
      },
      frame: function(frame, index) {
        log("builder.frame " + frame.script.name + ", " + frame.script.line);
        return TreeView(TreeViewUtils.createFileRefHeader(frame.script.name, frame.line + 1), ((function(_this) {
          return function() {
            return Promise.resolve([
              TreeView("arguments", (function() {
                return Promise.resolve(frame["arguments"]).map(builder.value);
              })), TreeView("variables", (function() {
                return Promise.resolve(frame.locals).map(builder.value);
              }))
            ]);
          };
        })(this)), {
          handlers: {
            click: function() {
              openScript(frame.script.id, frame.script.name, frame.line);
              return _debugger.setSelectedFrame(frame, index);
            }
          }
        });
      },
      root: function() {
        log("builder.root");
        return TreeView("Call stack", (function() {
          return builder.loadFrames().map(builder.frame);
        }), {
          isRoot: true
        });
      }
    };
    CallStackPane = function() {
      var state;
      state = builder.root();
      listeners.push(_debugger.onBreak(function() {
        log("Debugger.break");
        return TreeView.reset(state);
      }));
      listeners.push(_debugger.onSelectedFrame(function(arg) {
        var index;
        index = arg.index;
        return state.items.forEach(function(item, i) {
          if (i !== index) {
            return item.isOpen.set(false);
          }
        });
      }));
      return state;
    };
    CallStackPane.render = function(state) {
      return TreeView.render(state);
    };
    builder2 = {
      selectedFrame: null,
      loadThis: function() {
        return _debugger["eval"]("this").then(function(result) {
          return [
            {
              name: "___this___",
              value: result
            }
          ];
        })["catch"](function() {
          return [];
        });
      },
      loadLocals: function() {
        var framePromise, thisPromise;
        framePromise = builder2.selectedFrame ? Promise.resolve(builder2.selectedFrame) : builder.loadFrames().then(function(frames) {
          return frames[0];
        });
        thisPromise = builder2.loadThis();
        return Promise.all([framePromise, thisPromise]).then(function(result) {
          var _this, frame;
          frame = result[0];
          _this = result[1];
          return _this.concat(frame["arguments"].concat(frame.locals));
        });
      },
      root: function() {
        var sortLocals;
        sortLocals = function(locals) {
          locals.sort(function(a, b) {
            return a.name.localeCompare(b.name);
          });
          return locals;
        };
        return TreeView("Locals", (function() {
          return builder2.loadLocals().then(sortLocals).map(builder.value);
        }), {
          isRoot: true
        });
      }
    };
    LocalsPane = function() {
      var refresh, state;
      state = builder2.root();
      refresh = function() {
        return TreeView.populate(state);
      };
      listeners.push(_debugger.onSelectedFrame(function(arg) {
        var frame;
        frame = arg.frame;
        builder2.selectedFrame = frame;
        return refresh();
      }));
      return state;
    };
    LocalsPane.render = function(state) {
      return TreeView.render(state);
    };
    TreeViewWatchItem = function(expression) {
      return hg.state({
        expression: hg.value(expression),
        value: hg.array([]),
        editMode: hg.value(false),
        deleted: hg.value(false),
        channels: {
          startEdit: function(state) {
            log("TreeViewWatchItem.dblclick");
            return state.editMode.set(true);
          },
          cancelEdit: function(state) {
            return state.editMode.set(false);
          },
          finishEdit: function(state, data) {
            if (!state.editMode()) {
              return;
            }
            state.expression.set(data.expression);
            TreeViewWatchItem.load(state);
            state.editMode.set(false);
            if (data.expression === "") {
              return state.deleted.set(true);
            }
          }
        },
        functors: {
          render: TreeViewWatchItem.render
        }
      });
    };
    TreeViewWatchItem.load = function(state) {
      log("TreeViewWatchItem.load " + (state.expression()));
      if (state.expression() === "") {
        return new Promise(function(resolve) {
          var t;
          state.editMode.set(true);
          t = TreeViewItem("<expression not set - double click to edit>", {
            handlers: {
              dblclick: (function(_this) {
                return function() {
                  return state.editMode.set(true);
                };
              })(this)
            }
          });
          state.value.set([t]);
          return resolve(state);
        });
      }
      return _debugger["eval"](state.expression()).then((function(_this) {
        return function(result) {
          var ref;
          ref = {
            name: state.expression(),
            value: result
          };
          return builder.value(ref, {
            dblclick: function() {
              return state.editMode.set(true);
            }
          });
        };
      })(this)).then((function(_this) {
        return function(t) {
          state.value.set([t]);
          return state;
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          var t;
          t = TreeViewItem((state.expression()) + " : " + error, {
            handlers: {
              dblclick: function() {
                return state.editMode.set(true);
              }
            }
          });
          state.value.set([t]);
          return state;
        };
      })(this));
    };
    TreeViewWatchItem.render = function(state) {
      var ESCAPE, content, input;
      if (state.deleted) {
        return h('div', {}, []);
      }
      ESCAPE = 27;
      content = state.editMode ? (input = h("input.watch-input-box.input-sm.native-key-bindings", {
        value: state.expression,
        name: "expression",
        placeholder: state.expression === "" ? "clear content to delete slot" : void 0,
        'ev-focus': state.editMode ? FocusHook() : void 0,
        'ev-keydown': hg.sendKey(state.channels.cancelEdit, null, {
          key: ESCAPE
        }),
        'ev-event': hg.sendSubmit(state.channels.finishEdit),
        'ev-blur': hg.sendValue(state.channels.finishEdit),
        style: {
          display: 'inline'
        }
      }, []), h('li.list-item.entry', {
        'ev-dblclick': hg.send(state.channels.startEdit)
      }, [input])) : state.value.map(TreeView.render)[0];
      return content;
    };
    builder3 = {
      root: function() {
        var evalExpressions, title;
        evalExpressions = function(state) {
          var filtered, newstate, result;
          filtered = state.items.filter(function(x) {
            return !(x.deleted());
          });
          newstate = filtered.map(TreeViewWatchItem.load);
          result = [];
          newstate.forEach(function(x) {
            return result.push(x);
          });
          return Promise.all(result);
        };
        title = function(state) {
          return h("span", {}, [
            "Watch", h("input.btn.btn-xs", {
              type: "button",
              value: "+",
              style: {
                'margin': '1px 1px 2px 5px'
              },
              'ev-click': hg.send(state.channels.customEvent)
            }, [])
          ]);
        };
        return TreeView(title, evalExpressions, {
          isRoot: true,
          handlers: {
            customEvent: function(state) {
              log("TreeViewWatch custom event handler invoked");
              state.isOpen.set(true);
              return TreeViewWatchItem.load(TreeViewWatchItem("")).then(function(i) {
                return state.items.push(i);
              });
            }
          }
        });
      }
    };
    WatchPane = function() {
      var refresh, state;
      state = builder3.root();
      refresh = function() {
        return TreeView.populate(state);
      };
      listeners.push(_debugger.onBreak(function() {
        return refresh();
      }));
      listeners.push(_debugger.onSelectedFrame(function() {
        return refresh();
      }));
      return state;
    };
    WatchPane.render = function(state) {
      return TreeView.render(state);
    };
    return {
      CallStackPane: CallStackPane,
      LocalsPane: LocalsPane,
      WatchPane: WatchPane
    };
  };

  exports.cleanup = function() {
    var j, len1, remove, results;
    results = [];
    for (j = 0, len1 = listeners.length; j < len1; j++) {
      remove = listeners[j];
      results.push(remove());
    }
    return results;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9Db21wb25lbnRzL0NhbGxTdGFja1BhbmUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVI7O0VBQ1YsT0FBMEMsT0FBQSxDQUFRLFlBQVIsQ0FBMUMsRUFBQyx3QkFBRCxFQUFXLGdDQUFYLEVBQXlCOztFQUN6QixFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNKLElBQUs7O0VBQ04sU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUlaLFNBQUEsR0FBWTs7RUFFWixHQUFBLEdBQU0sU0FBQyxHQUFELEdBQUE7O0VBRU4sVUFBQSxHQUFhLFNBQUMsUUFBRCxFQUFXLE1BQVgsRUFBbUIsSUFBbkI7QUFFWCxRQUFBO0lBQUEsUUFBQSxHQUFXO0lBQ1gsWUFBQSxHQUFlLElBQUksT0FBSixDQUFZLFNBQUMsT0FBRDthQUN6QixFQUFFLENBQUMsTUFBSCxDQUFVLE1BQVYsRUFBa0IsU0FBQyxNQUFEO2VBQ2hCLE9BQUEsQ0FBUSxNQUFSO01BRGdCLENBQWxCO0lBRHlCLENBQVo7V0FJZixZQUNFLENBQUMsSUFESCxDQUNRLFNBQUMsTUFBRDtNQUNKLElBQUcsTUFBSDtlQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixNQUFwQixFQUE0QjtVQUMxQixXQUFBLEVBQWEsSUFEYTtVQUUxQixhQUFBLEVBQWUsQ0FGVztVQUcxQixZQUFBLEVBQWMsSUFIWTtVQUkxQixjQUFBLEVBQWdCLElBSlU7U0FBNUIsRUFERjtPQUFBLE1BQUE7UUFRRSxJQUFjLGdCQUFkO0FBQUEsaUJBQUE7O2VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLEVBQUEsR0FB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IFRyZWVWaWV3SXRlbSwgVHJlZVZpZXdVdGlsc30gPSByZXF1aXJlICcuL1RyZWVWaWV3J1xuaGcgPSByZXF1aXJlICdtZXJjdXJ5J1xuZnMgPSByZXF1aXJlICdmcydcbntofSA9IGhnXG5Gb2N1c0hvb2sgPSByZXF1aXJlKCcuL2ZvY3VzLWhvb2snKTtcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbmxpc3RlbmVycyA9IFtdXG5cbmxvZyA9IChtc2cpIC0+ICNjb25zb2xlLmxvZyhtc2cpXG5cbm9wZW5TY3JpcHQgPSAoc2NyaXB0SWQsIHNjcmlwdCwgbGluZSkgLT5cblxuICBQUk9UT0NPTCA9ICdhdG9tLW5vZGUtZGVidWdnZXI6Ly8nXG4gIHNjcmlwdEV4aXN0cyA9IG5ldyBQcm9taXNlIChyZXNvbHZlKSAtPlxuICAgIGZzLmV4aXN0cyBzY3JpcHQsIChyZXN1bHQpIC0+XG4gICAgICByZXNvbHZlKHJlc3VsdClcblxuICBzY3JpcHRFeGlzdHNcbiAgICAudGhlbiAoZXhpc3RzKSAtPlxuICAgICAgaWYgZXhpc3RzXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oc2NyaXB0LCB7XG4gICAgICAgICAgaW5pdGlhbExpbmU6IGxpbmVcbiAgICAgICAgICBpbml0aWFsQ29sdW1uOiAwXG4gICAgICAgICAgYWN0aXZhdGVQYW5lOiB0cnVlXG4gICAgICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGlmIG5vdCBzY3JpcHRJZD9cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihcIiN7UFJPVE9DT0x9I3tzY3JpcHRJZH1cIiwge1xuICAgICAgICAgIGluaXRpYWxDb2x1bW46IDBcbiAgICAgICAgICBpbml0aWFsTGluZTogbGluZVxuICAgICAgICAgIG5hbWU6IHNjcmlwdFxuICAgICAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlXG4gICAgICAgIH0pXG5cbmV4cG9ydHMuY3JlYXRlID0gKF9kZWJ1Z2dlcikgLT5cblxuICBidWlsZGVyID1cbiAgICBsb2FkUHJvcGVydGllczogKHJlZikgLT5cbiAgICAgIGxvZyBcImJ1aWxkZXIubG9hZFByb3BlcnRpZXMgI3tyZWZ9XCJcbiAgICAgIF9kZWJ1Z2dlclxuICAgICAgLmxvb2t1cChyZWYpXG4gICAgICAudGhlbiAoaW5zdGFuY2UpIC0+XG4gICAgICAgIGxvZyBcImJ1aWxkZXIubG9hZFByb3BlcnRpZXM6IGluc3RhbmNlIGxvYWRlZFwiXG4gICAgICAgIGlmIGluc3RhbmNlLmNsYXNzTmFtZSBpcyBcIkRhdGVcIlxuICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICBuYW1lOiBcInZhbHVlXCJcbiAgICAgICAgICAgICAgdmFsdWU6XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIHZhbHVlOiBpbnN0YW5jZS52YWx1ZVxuICAgICAgICAgICAgfV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIFByb21pc2VcbiAgICAgICAgICAubWFwIGluc3RhbmNlLnByb3BlcnRpZXMsIChwcm9wKSAtPlxuICAgICAgICAgICAgX2RlYnVnZ2VyLmxvb2t1cChwcm9wLnJlZilcbiAgICAgICAgICAudGhlbiAodmFsdWVzKSAtPlxuICAgICAgICAgICAgbG9nIFwiYnVpbGRlci5sb2FkUHJvcGVydGllczogcHJvcGVydHkgdmFsdWVzIGxvYWRlZFwiXG4gICAgICAgICAgICB2YWx1ZXMuZm9yRWFjaCAodmFsdWUsIGlkeCkgLT5cbiAgICAgICAgICAgICAgaW5zdGFuY2UucHJvcGVydGllc1tpZHhdLnZhbHVlID0gdmFsdWVcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5wcm9wZXJ0aWVzXG5cbiAgICBsb2FkQXJyYXlMZW5ndGg6IChyZWYpIC0+XG4gICAgICBfZGVidWdnZXJcbiAgICAgIC5sb29rdXAocmVmKVxuICAgICAgLnRoZW4gKGluc3RhbmNlKSAtPlxuICAgICAgICBfZGVidWdnZXIubG9va3VwKGluc3RhbmNlLnByb3BlcnRpZXNbMF0ucmVmKVxuICAgICAgLnRoZW4gKHJlc3VsdCkgLT5cbiAgICAgICAgcmVzdWx0LnZhbHVlXG5cbiAgICBsb2FkRnJhbWVzOiAoKSAtPlxuICAgICAgbG9nIFwiYnVpbGRlci5sb2FkRnJhbWVzXCJcbiAgICAgIF9kZWJ1Z2dlci5mdWxsVHJhY2UoKVxuICAgICAgLnRoZW4gKHRyYWNlcykgLT5cbiAgICAgICAgbG9nIFwiYnVpbGRlci5sb2FkRnJhbWVzOiBmcmFtZXMgbG9hZGVkICN7dHJhY2VzLmZyYW1lcy5sZW5ndGh9XCJcbiAgICAgICAgcmV0dXJuIHRyYWNlcy5mcmFtZXNcblxuICAgIHByb3BlcnR5OiAocHJvcGVydHkpIC0+XG4gICAgICBsb2cgXCJidWlsZGVyLnByb3BlcnR5XCJcbiAgICAgIGJ1aWxkZXIudmFsdWUoe1xuICAgICAgICBuYW1lOiBwcm9wZXJ0eS5uYW1lXG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgcmVmOiBwcm9wZXJ0eS5yZWZcbiAgICAgICAgICB0eXBlOiBwcm9wZXJ0eS52YWx1ZS50eXBlXG4gICAgICAgICAgY2xhc3NOYW1lOiBwcm9wZXJ0eS52YWx1ZS5jbGFzc05hbWVcbiAgICAgICAgICB2YWx1ZTogcHJvcGVydHkudmFsdWUudmFsdWVcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgIHZhbHVlOiAodmFsdWUsIGhhbmRsZXJzKSAtPlxuICAgICAgbG9nIFwiYnVpbGRlci52YWx1ZVwiXG4gICAgICBuYW1lID0gdmFsdWUubmFtZVxuICAgICAgdHlwZSA9IHZhbHVlLnZhbHVlLnR5cGVcbiAgICAgIGNsYXNzTmFtZSA9IHZhbHVlLnZhbHVlLmNsYXNzTmFtZVxuICAgICAgc3dpdGNoKHR5cGUpXG4gICAgICAgIHdoZW4gJ3N0cmluZycsICdib29sZWFuJywgJ251bWJlcicsICd1bmRlZmluZWQnLCAnbnVsbCdcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnZhbHVlLnZhbHVlXG4gICAgICAgICAgdGl0bGUgPSBpZiB0eXBlIGlzICdzdHJpbmcnIHRoZW4gXCIje25hbWV9IDogXFxcIiN7dmFsdWV9XFxcIlwiIGVsc2UgXCIje25hbWV9IDogI3t2YWx1ZX1cIlxuICAgICAgICAgIFRyZWVWaWV3SXRlbSh0aXRsZSwgaGFuZGxlcnM6IGhhbmRsZXJzKVxuICAgICAgICB3aGVuICdmdW5jdGlvbidcbiAgICAgICAgICBUcmVlVmlld0l0ZW0oXCIje25hbWV9IDogZnVuY3Rpb24oKSB7IC4uLiB9XCIsIGhhbmRsZXJzOiBoYW5kbGVycylcbiAgICAgICAgd2hlbiAnb2JqZWN0J1xuICAgICAgICAgIHJlZiA9IHZhbHVlLnZhbHVlLnJlZiB8fCB2YWx1ZS52YWx1ZS5oYW5kbGVcbiAgICAgICAgICBpc0FycmF5ID0gY2xhc3NOYW1lIGlzIFwiQXJyYXlcIlxuICAgICAgICAgIChpZiBpc0FycmF5IHRoZW4gYnVpbGRlci5sb2FkQXJyYXlMZW5ndGgocmVmKSBlbHNlIFByb21pc2UucmVzb2x2ZSgwKSkudGhlbiAobGVuKSAtPlxuICAgICAgICAgICAgZGVjb3JhdGUgPVxuICAgICAgICAgICAgICAodGl0bGUpIC0+XG4gICAgICAgICAgICAgICAgKHN0YXRlKSAtPlxuICAgICAgICAgICAgICAgICAgaWYgc3RhdGUuaXNPcGVuXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlXG4gICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGlmIGlzQXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICBoKCdzcGFuJywge30sIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiI3t0aXRsZX0gWyAje2xlbn0gXVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBoKCdzcGFuLnN1YnRsZS10ZXh0Jywge30sIFwiICMje3JlZn1cIilcbiAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgaCgnc3BhbicsIHt9LCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiN7dGl0bGV9IHsgLi4uIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgaCgnc3Bhbi5zdWJ0bGUtdGV4dCcsIHt9LCBcIiAjI3tyZWZ9XCIpXG4gICAgICAgICAgICAgICAgICAgICAgXSlcblxuICAgICAgICAgICAgVHJlZVZpZXcoZGVjb3JhdGUoXCIje25hbWV9IDogI3tjbGFzc05hbWV9XCIpLCAoKCkgPT4gYnVpbGRlci5sb2FkUHJvcGVydGllcyhyZWYpLm1hcChidWlsZGVyLnByb3BlcnR5KSksIGhhbmRsZXJzOiBoYW5kbGVycylcblxuICAgIGZyYW1lOiAoZnJhbWUsIGluZGV4KSAtPlxuICAgICAgbG9nIFwiYnVpbGRlci5mcmFtZSAje2ZyYW1lLnNjcmlwdC5uYW1lfSwgI3tmcmFtZS5zY3JpcHQubGluZX1cIlxuICAgICAgcmV0dXJuIFRyZWVWaWV3KFxuICAgICAgICAgIFRyZWVWaWV3VXRpbHMuY3JlYXRlRmlsZVJlZkhlYWRlciBmcmFtZS5zY3JpcHQubmFtZSwgZnJhbWUubGluZSArIDFcbiAgICAgICAgICAoKCkgPT5cbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZShbXG4gICAgICAgICAgICAgIFRyZWVWaWV3KFwiYXJndW1lbnRzXCIsICgoKSA9PiBQcm9taXNlLnJlc29sdmUoZnJhbWUuYXJndW1lbnRzKS5tYXAoYnVpbGRlci52YWx1ZSkpKVxuICAgICAgICAgICAgICBUcmVlVmlldyhcInZhcmlhYmxlc1wiLCAoKCkgPT4gUHJvbWlzZS5yZXNvbHZlKGZyYW1lLmxvY2FscykubWFwKGJ1aWxkZXIudmFsdWUpKSlcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgKSxcbiAgICAgICAgICBoYW5kbGVyczoge1xuICAgICAgICAgICAgICBjbGljazogKCkgLT5cbiAgICAgICAgICAgICAgICBvcGVuU2NyaXB0KGZyYW1lLnNjcmlwdC5pZCwgZnJhbWUuc2NyaXB0Lm5hbWUsIGZyYW1lLmxpbmUpXG4gICAgICAgICAgICAgICAgX2RlYnVnZ2VyLnNldFNlbGVjdGVkRnJhbWUgZnJhbWUsIGluZGV4XG4gICAgICAgICAgfVxuICAgICAgICApXG5cbiAgICByb290OiAoKSAtPlxuICAgICAgbG9nIFwiYnVpbGRlci5yb290XCJcbiAgICAgIFRyZWVWaWV3KFwiQ2FsbCBzdGFja1wiLCAoKCkgLT4gYnVpbGRlci5sb2FkRnJhbWVzKCkubWFwKGJ1aWxkZXIuZnJhbWUpKSwgaXNSb290OiB0cnVlKVxuXG4gIENhbGxTdGFja1BhbmUgPSAoKSAtPlxuICAgIHN0YXRlID0gYnVpbGRlci5yb290KClcbiAgICBsaXN0ZW5lcnMucHVzaCBfZGVidWdnZXIub25CcmVhayAoKSAtPlxuICAgICAgbG9nIFwiRGVidWdnZXIuYnJlYWtcIlxuICAgICAgVHJlZVZpZXcucmVzZXQoc3RhdGUpXG4gICAgbGlzdGVuZXJzLnB1c2ggX2RlYnVnZ2VyLm9uU2VsZWN0ZWRGcmFtZSAoe2luZGV4fSkgLT5cbiAgICAgIHN0YXRlLml0ZW1zLmZvckVhY2goKGl0ZW0saSkgLT4gaWYgaSBpc250IGluZGV4IHRoZW4gaXRlbS5pc09wZW4uc2V0KGZhbHNlKSk7XG5cbiAgICByZXR1cm4gc3RhdGVcblxuICBDYWxsU3RhY2tQYW5lLnJlbmRlciA9IChzdGF0ZSkgLT5cbiAgICBUcmVlVmlldy5yZW5kZXIoc3RhdGUpXG5cbiAgYnVpbGRlcjIgPVxuICAgIHNlbGVjdGVkRnJhbWU6IG51bGxcblxuICAgIGxvYWRUaGlzOiAoKSAtPlxuICAgICAgX2RlYnVnZ2VyLmV2YWwoXCJ0aGlzXCIpXG4gICAgICAudGhlbiAocmVzdWx0KSAtPlxuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBuYW1lOiBcIl9fX3RoaXNfX19cIlxuICAgICAgICAgIHZhbHVlOiByZXN1bHRcbiAgICAgICAgfV1cbiAgICAgIC5jYXRjaCAtPlxuICAgICAgICByZXR1cm4gW11cblxuICAgIGxvYWRMb2NhbHM6ICgpIC0+XG4gICAgICBmcmFtZVByb21pc2UgPSBpZiBidWlsZGVyMi5zZWxlY3RlZEZyYW1lIHRoZW4gUHJvbWlzZS5yZXNvbHZlKGJ1aWxkZXIyLnNlbGVjdGVkRnJhbWUpXG4gICAgICBlbHNlIGJ1aWxkZXIubG9hZEZyYW1lcygpLnRoZW4gKGZyYW1lcykgLT4gcmV0dXJuIGZyYW1lc1swXVxuICAgICAgdGhpc1Byb21pc2UgPSBidWlsZGVyMi5sb2FkVGhpcygpXG5cbiAgICAgIFByb21pc2UuYWxsIFtmcmFtZVByb21pc2UsIHRoaXNQcm9taXNlXVxuICAgICAgLnRoZW4gKHJlc3VsdCkgLT5cbiAgICAgICAgZnJhbWUgPSByZXN1bHRbMF1cbiAgICAgICAgX3RoaXMgPSByZXN1bHRbMV1cbiAgICAgICAgcmV0dXJuIF90aGlzLmNvbmNhdChmcmFtZS5hcmd1bWVudHMuY29uY2F0KGZyYW1lLmxvY2FscykpXG5cbiAgICByb290OiAoKSAtPlxuICAgICAgc29ydExvY2FscyA9IChsb2NhbHMpIC0+XG4gICAgICAgIGxvY2Fscy5zb3J0KChhLGIpIC0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSkpO1xuICAgICAgICByZXR1cm4gbG9jYWxzO1xuICAgICAgVHJlZVZpZXcoXCJMb2NhbHNcIiwgKCgpIC0+IGJ1aWxkZXIyLmxvYWRMb2NhbHMoKS50aGVuKHNvcnRMb2NhbHMpLm1hcChidWlsZGVyLnZhbHVlKSksIGlzUm9vdDp0cnVlKVxuXG4gIExvY2Fsc1BhbmUgPSAoKSAtPlxuICAgIHN0YXRlID0gYnVpbGRlcjIucm9vdCgpXG4gICAgcmVmcmVzaCA9ICgpIC0+IFRyZWVWaWV3LnBvcHVsYXRlKHN0YXRlKVxuICAgIGxpc3RlbmVycy5wdXNoIF9kZWJ1Z2dlci5vblNlbGVjdGVkRnJhbWUgKHtmcmFtZX0pIC0+XG4gICAgICBidWlsZGVyMi5zZWxlY3RlZEZyYW1lID0gZnJhbWVcbiAgICAgIHJlZnJlc2goKVxuICAgIHJldHVybiBzdGF0ZVxuXG4gIExvY2Fsc1BhbmUucmVuZGVyID0gKHN0YXRlKSAtPlxuICAgIFRyZWVWaWV3LnJlbmRlcihzdGF0ZSlcblxuICBUcmVlVmlld1dhdGNoSXRlbSA9IChleHByZXNzaW9uKSAtPiBoZy5zdGF0ZSh7XG4gICAgICBleHByZXNzaW9uOiBoZy52YWx1ZShleHByZXNzaW9uKVxuICAgICAgdmFsdWU6IGhnLmFycmF5KFtdKSAjIGtlZXBpbmcgdGhlIHN1YiBjb21wb25lbnQgaW4gYW4gYXJyYXkgaXMgYSB3b3JrYXJvdW5kLiBoZy52YWx1ZSBjYXVzZXMgcHJvYmxlbSBvZiBub3QgcmUtcmVuZGVyaW5nIHdoZW4gZXhwYW5kaW5nIGV4cHJlc3Npb25zXG4gICAgICBlZGl0TW9kZTogaGcudmFsdWUoZmFsc2UpXG4gICAgICBkZWxldGVkOiBoZy52YWx1ZShmYWxzZSlcbiAgICAgIGNoYW5uZWxzOiB7XG4gICAgICAgIHN0YXJ0RWRpdDpcbiAgICAgICAgICAoc3RhdGUpIC0+XG4gICAgICAgICAgICBsb2cgXCJUcmVlVmlld1dhdGNoSXRlbS5kYmxjbGlja1wiXG4gICAgICAgICAgICBzdGF0ZS5lZGl0TW9kZS5zZXQodHJ1ZSlcbiAgICAgICAgY2FuY2VsRWRpdDpcbiAgICAgICAgICAoc3RhdGUpIC0+XG4gICAgICAgICAgICBzdGF0ZS5lZGl0TW9kZS5zZXQoZmFsc2UpXG4gICAgICAgIGZpbmlzaEVkaXQ6XG4gICAgICAgICAgKHN0YXRlLCBkYXRhKSAtPlxuICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBzdGF0ZS5lZGl0TW9kZSgpXG4gICAgICAgICAgICBzdGF0ZS5leHByZXNzaW9uLnNldChkYXRhLmV4cHJlc3Npb24pXG4gICAgICAgICAgICBUcmVlVmlld1dhdGNoSXRlbS5sb2FkKHN0YXRlKVxuICAgICAgICAgICAgc3RhdGUuZWRpdE1vZGUuc2V0KGZhbHNlKVxuICAgICAgICAgICAgc3RhdGUuZGVsZXRlZC5zZXQodHJ1ZSkgaWYgZGF0YS5leHByZXNzaW9uIGlzIFwiXCJcbiAgICAgIH1cbiAgICAgIGZ1bmN0b3JzOiB7XG4gICAgICAgIHJlbmRlcjogVHJlZVZpZXdXYXRjaEl0ZW0ucmVuZGVyXG4gICAgICB9XG4gICAgfSlcblxuICBUcmVlVmlld1dhdGNoSXRlbS5sb2FkID0gKHN0YXRlKSAtPlxuICAgICAgbG9nIFwiVHJlZVZpZXdXYXRjaEl0ZW0ubG9hZCAje3N0YXRlLmV4cHJlc3Npb24oKX1cIlxuICAgICAgaWYgc3RhdGUuZXhwcmVzc2lvbigpIGlzIFwiXCJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSAtPlxuICAgICAgICAgIHN0YXRlLmVkaXRNb2RlLnNldCh0cnVlKVxuICAgICAgICAgIHQgPSBUcmVlVmlld0l0ZW0oXCI8ZXhwcmVzc2lvbiBub3Qgc2V0IC0gZG91YmxlIGNsaWNrIHRvIGVkaXQ+XCIsIGhhbmRsZXJzOiB7IGRibGNsaWNrOiAoKSA9PiBzdGF0ZS5lZGl0TW9kZS5zZXQodHJ1ZSkgfSlcbiAgICAgICAgICBzdGF0ZS52YWx1ZS5zZXQoW3RdKVxuICAgICAgICAgIHJlc29sdmUoc3RhdGUpXG5cbiAgICAgIF9kZWJ1Z2dlci5ldmFsKHN0YXRlLmV4cHJlc3Npb24oKSlcbiAgICAgIC50aGVuIChyZXN1bHQpID0+XG4gICAgICAgIHJlZiA9IHsgbmFtZTogc3RhdGUuZXhwcmVzc2lvbigpLCB2YWx1ZTogcmVzdWx0IH1cbiAgICAgICAgYnVpbGRlci52YWx1ZShyZWYsIHsgZGJsY2xpY2s6ICgpID0+IHN0YXRlLmVkaXRNb2RlLnNldCh0cnVlKSB9KVxuICAgICAgLnRoZW4gKHQpID0+XG4gICAgICAgIHN0YXRlLnZhbHVlLnNldChbdF0pXG4gICAgICAgIHJldHVybiBzdGF0ZVxuICAgICAgLmNhdGNoIChlcnJvcikgPT5cbiAgICAgICAgdCA9IFRyZWVWaWV3SXRlbShcIiN7c3RhdGUuZXhwcmVzc2lvbigpfSA6ICN7ZXJyb3J9XCIsIGhhbmRsZXJzOiB7IGRibGNsaWNrOiAoKSA9PiBzdGF0ZS5lZGl0TW9kZS5zZXQodHJ1ZSkgfSlcbiAgICAgICAgc3RhdGUudmFsdWUuc2V0KFt0XSlcbiAgICAgICAgcmV0dXJuIHN0YXRlXG5cbiAgVHJlZVZpZXdXYXRjaEl0ZW0ucmVuZGVyID0gKHN0YXRlKSAtPlxuICAgIHJldHVybiBoKCdkaXYnLCB7fSwgW10pIGlmIHN0YXRlLmRlbGV0ZWRcbiAgICBFU0NBUEUgPSAyN1xuICAgIGNvbnRlbnQgPVxuICAgICAgaWYgc3RhdGUuZWRpdE1vZGVcbiAgICAgICAgaW5wdXQgPSBoKFwiaW5wdXQud2F0Y2gtaW5wdXQtYm94LmlucHV0LXNtLm5hdGl2ZS1rZXktYmluZGluZ3NcIiwge1xuICAgICAgICAgICAgdmFsdWU6IHN0YXRlLmV4cHJlc3Npb25cbiAgICAgICAgICAgIG5hbWU6IFwiZXhwcmVzc2lvblwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJjbGVhciBjb250ZW50IHRvIGRlbGV0ZSBzbG90XCIgaWYgc3RhdGUuZXhwcmVzc2lvbiBpcyBcIlwiXG4gICAgICAgICAgICAjIHdoZW4gd2UgbmVlZCBhbiBSUEMgaW52b2NhdGlvbiB3ZSBhZGQgYVxuICAgICAgICAgICAgIyBjdXN0b20gbXV0YWJsZSBvcGVyYXRpb24gaW50byB0aGUgdHJlZSB0byBiZVxuICAgICAgICAgICAgIyBpbnZva2VkIGF0IHBhdGNoIHRpbWVcbiAgICAgICAgICAgICdldi1mb2N1cyc6IEZvY3VzSG9vaygpIGlmIHN0YXRlLmVkaXRNb2RlLFxuICAgICAgICAgICAgJ2V2LWtleWRvd24nOiBoZy5zZW5kS2V5KHN0YXRlLmNoYW5uZWxzLmNhbmNlbEVkaXQsIG51bGwsIHtrZXk6IEVTQ0FQRX0pLFxuICAgICAgICAgICAgJ2V2LWV2ZW50JzogaGcuc2VuZFN1Ym1pdChzdGF0ZS5jaGFubmVscy5maW5pc2hFZGl0KVxuICAgICAgICAgICAgJ2V2LWJsdXInOiBoZy5zZW5kVmFsdWUoc3RhdGUuY2hhbm5lbHMuZmluaXNoRWRpdClcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgW10pXG4gICAgICAgIGgoJ2xpLmxpc3QtaXRlbS5lbnRyeScsIHsgJ2V2LWRibGNsaWNrJzogaGcuc2VuZChzdGF0ZS5jaGFubmVscy5zdGFydEVkaXQpIH0sIFtpbnB1dF0pXG4gICAgICBlbHNlXG4gICAgICAgIHN0YXRlLnZhbHVlLm1hcChUcmVlVmlldy5yZW5kZXIpWzBdXG4gICAgY29udGVudFxuXG4gIGJ1aWxkZXIzID1cbiAgICByb290OiAoKSAtPlxuICAgICAgZXZhbEV4cHJlc3Npb25zID0gKHN0YXRlKSAtPlxuICAgICAgICBmaWx0ZXJlZCA9IHN0YXRlLml0ZW1zLmZpbHRlciAoeCkgLT4gbm90KHguZGVsZXRlZCgpKVxuICAgICAgICBuZXdzdGF0ZSA9IGZpbHRlcmVkLm1hcCBUcmVlVmlld1dhdGNoSXRlbS5sb2FkXG4gICAgICAgIHJlc3VsdCA9IFtdXG4gICAgICAgIG5ld3N0YXRlLmZvckVhY2ggKHgpIC0+IHJlc3VsdC5wdXNoKHgpXG4gICAgICAgIFByb21pc2UuYWxsKHJlc3VsdClcblxuICAgICAgdGl0bGUgPSAoc3RhdGUpIC0+XG4gICAgICAgIGgoXCJzcGFuXCIsIHt9LCBbXG4gICAgICAgICAgXCJXYXRjaFwiXG4gICAgICAgICAgaChcImlucHV0LmJ0bi5idG4teHNcIiwge1xuICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiXG4gICAgICAgICAgICAgIHZhbHVlOiBcIitcIlxuICAgICAgICAgICAgICBzdHlsZTpcbiAgICAgICAgICAgICAgICAnbWFyZ2luJzogJzFweCAxcHggMnB4IDVweCdcbiAgICAgICAgICAgICAgJ2V2LWNsaWNrJzpcbiAgICAgICAgICAgICAgICAgIGhnLnNlbmQgc3RhdGUuY2hhbm5lbHMuY3VzdG9tRXZlbnRcbiAgICAgICAgICB9LCBbXSlcbiAgICAgICAgXSlcblxuICAgICAgcmV0dXJuIFRyZWVWaWV3KHRpdGxlLCBldmFsRXhwcmVzc2lvbnMsIGlzUm9vdDp0cnVlLCBoYW5kbGVyczoge1xuICAgICAgICAgIGN1c3RvbUV2ZW50OiAoc3RhdGUpIC0+XG4gICAgICAgICAgICBsb2cgXCJUcmVlVmlld1dhdGNoIGN1c3RvbSBldmVudCBoYW5kbGVyIGludm9rZWRcIlxuICAgICAgICAgICAgc3RhdGUuaXNPcGVuLnNldCh0cnVlKVxuICAgICAgICAgICAgVHJlZVZpZXdXYXRjaEl0ZW0ubG9hZChUcmVlVmlld1dhdGNoSXRlbShcIlwiKSkudGhlbiAoaSkgLT5cbiAgICAgICAgICAgICAgc3RhdGUuaXRlbXMucHVzaChpKVxuICAgICAgICB9KVxuXG4gIFdhdGNoUGFuZSA9ICgpIC0+XG4gICAgc3RhdGUgPSBidWlsZGVyMy5yb290KClcbiAgICByZWZyZXNoID0gKCkgLT4gVHJlZVZpZXcucG9wdWxhdGUoc3RhdGUpXG4gICAgbGlzdGVuZXJzLnB1c2ggX2RlYnVnZ2VyLm9uQnJlYWsgKCkgLT4gcmVmcmVzaCgpXG4gICAgbGlzdGVuZXJzLnB1c2ggX2RlYnVnZ2VyLm9uU2VsZWN0ZWRGcmFtZSAoKSAtPiByZWZyZXNoKClcbiAgICByZXR1cm4gc3RhdGVcblxuICBXYXRjaFBhbmUucmVuZGVyID0gKHN0YXRlKSAtPlxuICAgIFRyZWVWaWV3LnJlbmRlcihzdGF0ZSlcblxuICByZXR1cm4ge1xuICAgIENhbGxTdGFja1BhbmU6IENhbGxTdGFja1BhbmVcbiAgICBMb2NhbHNQYW5lOiBMb2NhbHNQYW5lXG4gICAgV2F0Y2hQYW5lOiBXYXRjaFBhbmVcbiAgfVxuXG5leHBvcnRzLmNsZWFudXAgPSAoKSAtPlxuICBmb3IgcmVtb3ZlIGluIGxpc3RlbmVyc1xuICAgIHJlbW92ZSgpXG4iXX0=
