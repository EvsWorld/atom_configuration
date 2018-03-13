(function() {
  var Range, fs,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  Range = require('atom').Range;

  module.exports = {
    subscriptions: null,
    config: require('./config'),
    activate: function(state) {
      var CompositeDisposable, NavigateView, key, param, req, requires, value;
      CompositeDisposable = require('atom').CompositeDisposable;
      this.pathCache = state['pathCache'] || {};
      this["new"] = false;
      requires = atom.config.get('navigate.require');
      req = require(requires);
      for (key in req) {
        value = req[key];
        param = {};
        param['atom-text-editor'] = {};
        param['atom-text-editor'][key] = "navigate:browser";
        atom.keymaps.add("navigate", param);
        if (value) {
          atom.config.set("navigate." + key, value);
        }
      }
      this.subscriptions = new CompositeDisposable;
      NavigateView = require('./navigate-view').NavigateView;
      this.loading = new NavigateView();
      this.modalPanel = atom.workspace.addModalPanel({
        item: this.loading.getElement(),
        visible: false
      });
      this.navi = {};
      atom.commands.add("atom-text-editor", {
        'navigate:back': (function(_this) {
          return function() {
            return _this.back();
          };
        })(this)
      });
      atom.commands.add('atom-text-editor', {
        'navigate:forward': (function(_this) {
          return function() {
            _this["new"] = atom.config.get('navigate.newwindow');
            return _this.forward();
          };
        })(this)
      });
      atom.commands.add('atom-text-editor', {
        'navigate:forward-new': (function(_this) {
          return function() {
            _this["new"] = true;
            return _this.forward();
          };
        })(this)
      });
      atom.commands.add("atom-text-editor", {
        'navigate:refresh': (function(_this) {
          return function() {
            return _this.refresh();
          };
        })(this)
      });
      if (atom.config.get('navigate.dblclk')) {
        atom.workspace.observeTextEditors((function(_this) {
          return function(editor) {
            var view;
            view = atom.views.getView(editor);
            return view.ondblclick = function() {
              _this["new"] = atom.config.get('navigate.dblclick');
              return _this.forward();
            };
          };
        })(this));
      }
      return atom.commands.add('atom-text-editor', {
        'navigate:browser': (function(_this) {
          return function(evt) {
            return _this.openBrowser(evt);
          };
        })(this)
      });
    },
    browserOption: function(evt, text) {
      var key, opt, split;
      if (evt && evt.originalEvent) {
        key = evt.originalEvent.keyIdentifier;
        if (evt.originalEvent.ctrlKey) {
          key = "CTRL-" + key;
        }
        if (evt.originalEvent.shiftKey) {
          key = "SHIFT-" + key;
        }
        if (evt.originalEvent.altKey) {
          key = "ALT-" + key;
        }
      } else {
        key = "CTRL-F1";
      }
      this.uri = atom.config.get("navigate." + key);
      if (!this.uri) {
        this.uri = atom.config.get("navigate." + (key.toUpperCase()));
      }
      if (!this.uri) {
        this.uri = atom.config.get("navigate." + (key.toLowerCase()));
      }
      if (this.uri) {
        this.uri = this.uri.replace('&searchterm', text);
        split = this.getPosition();
        opt = {
          split: split,
          searchAllPanes: true
        };
        if (atom.config.get('navigate.openInSameWindow')) {
          opt.openInSameWindow = true;
        }
        return atom.workspace.open(this.uri, opt);
      }
    },
    openBrowser: function(evt) {
      var active, text;
      active = atom.workspace.getActivePaneItem();
      text = active.getSelectedText() || this.getText(active);
      if (text) {
        return this.browserOption(evt, text);
      }
    },
    refresh: function() {
      var ed, projectPath, ref, text;
      ed = atom.workspace.getActiveTextEditor();
      projectPath = atom.project.getPaths()[0];
      if (!projectPath) {
        return;
      }
      if (text = ed != null ? ed.getSelectedText() : void 0) {
        return (ref = this.pathCache[projectPath]) != null ? delete ref[text] : void 0;
      } else {
        return this.pathCache[projectPath] = {};
      }
    },
    getText: function(ed) {
      var cursor, rn, text;
      cursor = ed.getCursors()[0];
      rn = this.getQuoteRange(cursor, ed);
      if (rn && rn.end.row === rn.start.row) {
        text = ed.getTextInBufferRange(rn);
      }
      if (!text) {
        text = ed.getWordUnderCursor({
          wordRegex: /[\/A-Z\.\-\d\\-_:]+(:\d+)?/i
        });
      }
      if (text) {
        if (text.slice(-1) === ':') {
          text = text.slice(0, -1);
        }
        return text.trim();
      }
    },
    getQuoteRange: function(cursor, ed) {
      var closing, opening;
      closing = this.getClosingQuotePosition(cursor, ed);
      if (closing == null) {
        return false;
      }
      opening = this.getOpeningQuotePosition(cursor, ed);
      if (opening == null) {
        return false;
      }
      return new Range(opening, closing);
    },
    getOpeningQuotePosition: function(cursor, ed) {
      var quote, range;
      range = cursor.getCurrentLineBufferRange();
      range.end.column = cursor.getScreenPosition().column;
      quote = false;
      ed.buffer.backwardsScanInRange(/[`|'|"]/g, range, (function(_this) {
        return function(obj) {
          if (!_this.quoteType) {
            return false;
          }
          if (obj.matchText === _this.quoteType) {
            obj.stop();
          }
          return quote = obj.range.end;
        };
      })(this));
      return quote;
    },
    getClosingQuotePosition: function(cursor, ed) {
      var quote, range;
      range = cursor.getCurrentLineBufferRange();
      range.start.column = cursor.getScreenPosition().column;
      quote = false;
      delete this.quoteType;
      ed.buffer.scanInRange(/[`|'|"]/g, range, (function(_this) {
        return function(obj) {
          _this.quoteType = obj.matchText;
          obj.stop();
          return quote = obj.range.start;
        };
      })(this));
      return quote;
    },
    forward: function() {
      var editor, line, open, split;
      editor = atom.workspace.getActiveTextEditor();
      this.uri = editor.getSelectedText();
      line = editor.lineTextForScreenRow(editor.getCursorScreenPosition().row);
      this.uri = editor.getSelectedText() || this.getText(editor);
      if (!this.uri) {
        return;
      }
      split = this.getPosition();
      open = (function(_this) {
        return function() {
          var e, exists, ext, filename, filepath, fpath, globSearch, module, openFile, path, projectPath, resolve, url;
          path = require('path');
          fpath = path.dirname(editor.getPath());
          ext = path.extname(editor.getPath());
          projectPath = atom.project.getPaths()[0];
          exists = fs.existsSync || fs.accessSync;
          filename = path.basename(_this.uri);
          globSearch = function() {
            var findup, glob, ignore;
            findup = require('findup-sync');
            glob = require('glob');
            ignore = atom.config.get('navigate.ignore') || [];
            return glob("**/*" + filename + "*", {
              cwd: projectPath,
              stat: false,
              nocase: true,
              nodir: true,
              ignore: ignore
            }, function(err, files) {
              var fpaths, stats;
              if (err || !files.length) {
                fpaths = findup(filename, {
                  cwd: projectPath,
                  nocase: true
                });
                if (fpaths) {
                  stats = fs.lstatSync(fpaths);
                  if (!stats || stats.isDirectory() || stats.isSymbolicLink()) {
                    console.log('Found Path but it is directory', fpaths);
                    _this.modalPanel.hide();
                    return;
                  }
                  return _this.matchFile(_this.uri, ext, fpaths, editor);
                } else {
                  return _this.modalPanel.hide();
                }
              } else {
                return _this.matchFile(_this.uri, ext, files, editor);
              }
            });
          };
          openFile = function() {
            var baseDir, dir, e, fileSrc, i, j, len, ofname, ref, url;
            path = require('path');
            try {
              if (ofname = (ref = _this.pathCache[projectPath]) != null ? ref[_this.uri] : void 0) {
                _this.open([ofname], editor);
                return;
              }
              baseDir = atom.config.get('navigate.basedir') || [];
              fileSrc = [];
              if (_this.uri[0] === '/' || _this.uri[0] === '\\') {
                if (fpath.startsWith(projectPath)) {
                  fileSrc.unshift(projectPath + '/' + _this.uri);
                  if (!path.extname(_this.uri)) {
                    fileSrc.unshift(projectPath + '/' + _this.uri + ext);
                  }
                } else {
                  fileSrc.unshift(fpath + "/../" + _this.uri);
                  if (!path.extname(_this.uri)) {
                    fileSrc.unshift(fpath + "/../" + _this.uri + ext);
                  }
                }
              } else {
                fileSrc.unshift(fpath + _this.uri);
                if (!path.extname(_this.uri)) {
                  fileSrc.unshift(fpath + _this.uri + ext);
                }
              }
              for (i in baseDir) {
                dir = baseDir[i];
                if (_this.uri[0] === '/' || _this.uri[0] === '\\') {
                  if (fpath.startsWith(projectPath)) {
                    fileSrc.unshift(projectPath + '/' + dir + '/' + _this.uri);
                  } else {
                    fileSrc.unshift(fpath + '/../' + dir + '/' + _this.uri);
                  }
                } else {
                  fileSrc.unshift(fpath + '/' + dir + '/' + _this.uri);
                }
              }
              for (j = 0, len = fileSrc.length; j < len; j++) {
                url = fileSrc[j];
                if (exists(url)) {
                  _this.open([url], editor);
                  return;
                }
              }
              filename = path.basename(_this.uri);
              _this.complex = true;
              return globSearch();
            } catch (error) {
              e = error;
              return console.log('Error finding the filepath', e);
            }
          };
          try {
            resolve = require('resolve');
            _this.modalPanel.show();
            if (line.includes('require')) {
              if (resolve.isCore(_this.uri)) {
                url = "https://github.com/joyent/node/blob/master/lib/" + _this.uri + ".js";
                _this.modalPanel.hide();
                return atom.workspace.open(url, {
                  split: split,
                  searchAllPanes: true
                });
              }
              filepath = resolve.sync(_this.uri, {
                basedir: fpath,
                extensions: ['.js', '.coffee']
              });
              if (fs.statSync(filepath)) {
                return _this.open([filepath], editor);
              }
            }
            return openFile();
          } catch (error) {
            e = error;
            console.log('Error finding the filepath', e);
            try {
              module = require('module');
              if (filepath = module._resolveFilename(_this.uri)) {
                if (fs.statSync(filepath)) {
                  return _this.open([filepath], editor);
                }
              }
              return openFile();
            } catch (error) {
              e = error;
              console.log('Error finding the filepath with module', e);
              return openFile();
            }
          }
        };
      })(this);
      if (this.uri.indexOf('http:') === 0 || this.uri.indexOf('https:') === 0 || this.uri.indexOf('localhost:') === 0) {
        return atom.workspace.open(this.uri, {
          split: split,
          searchAllPanes: true
        });
      } else {
        return open(this.uri);
      }
    },
    matchFile: function(filename, ext, files, editor) {
      var ListView, fname, ref;
      this.modalPanel.hide();
      if (typeof files === 'string') {
        return this.open([files], editor);
      } else {
        if (indexOf.call(files, filename) >= 0) {
          return this.open([filename], editor);
        } else {
          if (fname = (ref = filename + ext, indexOf.call(files, ref) >= 0)) {
            return this.open([fname], editor);
          } else {
            if (files.length === 1) {
              return this.open(files, editor);
            } else {
              ListView = require('./navigate-view').ListView;
              return new ListView(files, (function(_this) {
                return function(file) {
                  return _this.open([file], editor);
                };
              })(this));
            }
          }
        }
      }
    },
    open: function(url, editor, back) {
      var it, pane;
      if (back == null) {
        back = false;
      }
      this.modalPanel.hide();
      if (!this["new"]) {
        if (editor.isModified()) {
          if (editor.shouldPromptToSave()) {
            it = atom.workspace.getActivePaneItem();
            pane = atom.workspace.getActivePane();
            if (!pane.promptToSaveItem(it)) {
              return;
            }
          } else {
            editor.save();
          }
        }
      }
      return atom.workspace.open(url[0]).then((function(_this) {
        return function(ed) {
          var base, projectPath;
          projectPath = atom.project.getPaths()[0];
          if (url[1]) {
            ed.setCursorScreenPosition(url[1]);
          }
          if (!back) {
            _this.navi["" + (ed.getPath())] = [editor.getPath(), editor.getCursorScreenPosition()];
          }
          if (_this.complex) {
            _this.complex = false;
            (base = _this.pathCache)[projectPath] || (base[projectPath] = {});
            if (!back) {
              _this.pathCache[projectPath][_this.uri] = ed.getPath();
            }
          }
          _this.modalPanel.hide();
          if (_this["new"]) {
            return _this["new"] = false;
          } else {
            return editor.destroy();
          }
        };
      })(this));
    },
    back: function() {
      var editor, fpath, navi;
      editor = atom.workspace.getActivePaneItem();
      fpath = editor.getPath();
      if (!(navi = this.navi[fpath])) {
        return;
      }
      delete this.navi[fpath];
      return this.open(navi, editor, true);
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    serialize: function() {
      return {
        pathCache: this.pathCache
      };
    },
    toggle: function() {},
    getPosition: function() {
      var activePane, orientation, paneAxis, paneIndex, ref;
      activePane = atom.workspace.paneForItem(atom.workspace.getActiveTextEditor());
      paneAxis = activePane.getParent();
      paneIndex = paneAxis.getPanes().indexOf(activePane);
      orientation = (ref = paneAxis.orientation) != null ? ref : 'horizontal';
      if (orientation === 'horizontal') {
        if (paneIndex === 0) {
          return 'right';
        } else {
          return 'left';
        }
      } else {
        if (paneIndex === 0) {
          return 'down';
        } else {
          return 'up';
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9uYXZpZ2F0ZS9saWIvbmF2aWdhdGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQSxTQUFBO0lBQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNKLFFBQVMsT0FBQSxDQUFRLE1BQVI7O0VBQ1YsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBQ0EsTUFBQSxFQUFRLE9BQUEsQ0FBUSxVQUFSLENBRFI7SUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTtNQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjtNQUN4QixJQUFDLENBQUEsU0FBRCxHQUFhLEtBQU0sQ0FBQSxXQUFBLENBQU4sSUFBc0I7TUFDbkMsSUFBQyxFQUFBLEdBQUEsRUFBRCxHQUFPO01BQ1AsUUFBQSxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQkFBaEI7TUFDWCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7QUFDTixXQUFBLFVBQUE7O1FBQ0UsS0FBQSxHQUFRO1FBQ1IsS0FBTSxDQUFBLGtCQUFBLENBQU4sR0FBNEI7UUFDNUIsS0FBTSxDQUFBLGtCQUFBLENBQW9CLENBQUEsR0FBQSxDQUExQixHQUFpQztRQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQWIsQ0FBaUIsVUFBakIsRUFBNkIsS0FBN0I7UUFDQSxJQUE0QyxLQUE1QztVQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixXQUFBLEdBQVksR0FBNUIsRUFBa0MsS0FBbEMsRUFBQTs7QUFMRjtNQVFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDcEIsZUFBZ0IsT0FBQSxDQUFRLGlCQUFSO01BQ2pCLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxZQUFBLENBQUE7TUFDZixJQUFD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LEdBQU8sSUFBQyxDQUFBLElBQUssQ0FBQSxLQUFBLENBQWIsQ0FBZDtBQUFBLGVBQUE7O01BQ0EsT0FBTyxJQUFDLENBQUEsSUFBSyxDQUFBLEtBQUE7YUFDYixJQUFDLENBQUEsSUFBRCxDQUFNLElBQU4sRUFBVyxNQUFYLEVBQWtCLElBQWxCO0lBTEksQ0F2UU47SUE4UUEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtJQURVLENBOVFaO0lBaVJBLFNBQUEsRUFBVyxTQUFBO2FBQ1Q7UUFBQSxTQUFBLEVBQVcsSUFBQyxDQUFBLFNBQVo7O0lBRFMsQ0FqUlg7SUFtUkEsTUFBQSxFQUFRLFNBQUEsR0FBQSxDQW5SUjtJQXFSQSxXQUFBLEVBQWEsU0FBQTtBQUNYLFVBQUE7TUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFmLENBQTJCLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUEzQjtNQUNiLFFBQUEsR0FBVyxVQUFVLENBQUMsU0FBWCxDQUFBO01BQ1gsU0FBQSxHQUFZLFFBQVEsQ0FBQyxRQUFULENBQUEsQ0FBbUIsQ0FBQyxPQUFwQixDQUE0QixVQUE1QjtNQUNaLFdBQUEsZ0RBQXFDO01BQ3JDLElBQUcsV0FBQSxLQUFlLFlBQWxCO1FBQ0UsSUFBSSxTQUFBLEtBQWEsQ0FBakI7aUJBQXdCLFFBQXhCO1NBQUEsTUFBQTtpQkFBcUMsT0FBckM7U0FERjtPQUFBLE1BQUE7UUFHRSxJQUFJLFNBQUEsS0FBYSxDQUFqQjtpQkFBd0IsT0FBeEI7U0FBQSxNQUFBO2lCQUFvQyxLQUFwQztTQUhGOztJQUxXLENBclJiOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsiIyBodHRwOi8vd3d3LnNrYW5kYXNvZnQuY29tLy9cbmZzID0gcmVxdWlyZSAnZnMnXG57UmFuZ2V9ID0gcmVxdWlyZSAnYXRvbSdcbm1vZHVsZS5leHBvcnRzID1cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBjb25maWc6IHJlcXVpcmUgJy4vY29uZmlnJ1xuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIHtDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG4gICAgQHBhdGhDYWNoZSA9IHN0YXRlWydwYXRoQ2FjaGUnXSBvciB7fVxuICAgIEBuZXcgPSBmYWxzZVxuICAgIHJlcXVpcmVzID0gYXRvbS5jb25maWcuZ2V0KCduYXZpZ2F0ZS5yZXF1aXJlJylcbiAgICByZXEgPSByZXF1aXJlKHJlcXVpcmVzKVxuICAgIGZvciBrZXksdmFsdWUgb2YgcmVxXG4gICAgICBwYXJhbSA9IHt9XG4gICAgICBwYXJhbVsnYXRvbS10ZXh0LWVkaXRvciddID0ge31cbiAgICAgIHBhcmFtWydhdG9tLXRleHQtZWRpdG9yJ11ba2V5XSA9IFwibmF2aWdhdGU6YnJvd3NlclwiXG4gICAgICBhdG9tLmtleW1hcHMuYWRkIFwibmF2aWdhdGVcIiwgcGFyYW1cbiAgICAgIGF0b20uY29uZmlnLnNldChcIm5hdmlnYXRlLiN7a2V5fVwiLHZhbHVlKSBpZiB2YWx1ZVxuXG4gICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB7TmF2aWdhdGVWaWV3fSA9IHJlcXVpcmUgJy4vbmF2aWdhdGUtdmlldydcbiAgICBAbG9hZGluZyA9IG5ldyBOYXZpZ2F0ZVZpZXcoKVxuICAgIEBtb2RhbFBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCBpdGVtOkBsb2FkaW5nLmdldEVsZW1lbnQoKSwgdmlzaWJsZTpmYWxzZVxuICAgIEBuYXZpID0ge31cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20tdGV4dC1lZGl0b3JcIiwnbmF2aWdhdGU6YmFjayc6ID0+QGJhY2soKVxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ25hdmlnYXRlOmZvcndhcmQnOiA9PlxuICAgICAgQG5ldyA9IGF0b20uY29uZmlnLmdldCgnbmF2aWdhdGUubmV3d2luZG93JylcbiAgICAgIEBmb3J3YXJkKClcblxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ25hdmlnYXRlOmZvcndhcmQtbmV3JzogPT5cbiAgICAgIEBuZXcgPSB0cnVlXG4gICAgICBAZm9yd2FyZCgpXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXRleHQtZWRpdG9yXCIsICduYXZpZ2F0ZTpyZWZyZXNoJzogPT5AcmVmcmVzaCgpXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCduYXZpZ2F0ZS5kYmxjbGsnKVxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpPT5cbiAgICAgICAgdmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICAgIHZpZXcub25kYmxjbGljayA9ID0+XG4gICAgICAgICAgQG5ldyA9IGF0b20uY29uZmlnLmdldCgnbmF2aWdhdGUuZGJsY2xpY2snKVxuICAgICAgICAgIEBmb3J3YXJkKClcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsXG4gICAgICAgICduYXZpZ2F0ZTpicm93c2VyJzogKGV2dCk9PiBAb3BlbkJyb3dzZXIoZXZ0KVxuXG4gIGJyb3dzZXJPcHRpb246IChldnQsdGV4dCktPlxuICAgIGlmIGV2dCBhbmQgZXZ0Lm9yaWdpbmFsRXZlbnRcbiAgICAgIGtleSA9IGV2dC5vcmlnaW5hbEV2ZW50LmtleUlkZW50aWZpZXJcbiAgICAgIGtleSA9IFwiQ1RSTC0je2tleX1cIiBpZiBldnQub3JpZ2luYWxFdmVudC5jdHJsS2V5XG4gICAgICBrZXkgPSBcIlNISUZULSN7a2V5fVwiIGlmIGV2dC5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5XG4gICAgICBrZXkgPSBcIkFMVC0je2tleX1cIiBpZiBldnQub3JpZ2luYWxFdmVudC5hbHRLZXlcbiAgICBlbHNlXG4gICAgICBrZXkgPSBcIkNUUkwtRjFcIlxuICAgIEB1cmkgPSBhdG9tLmNvbmZpZy5nZXQoXCJuYXZpZ2F0ZS4je2tleX1cIilcbiAgICBAdXJpID0gYXRvbS5jb25maWcuZ2V0KFwibmF2aWdhdGUuI3trZXkudG9VcHBlckNhc2UoKX1cIikgdW5sZXNzIEB1cmlcbiAgICBAdXJpID0gYXRvbS5jb25maWcuZ2V0KFwibmF2aWdhdGUuI3trZXkudG9Mb3dlckNhc2UoKX1cIikgdW5sZXNzIEB1cmlcblxuICAgIGlmIEB1cmlcbiAgICAgIEB1cmkgPSBAdXJpLnJlcGxhY2UoJyZzZWFyY2h0ZXJtJyx0ZXh0KVxuICAgICAgc3BsaXQgPSBAZ2V0UG9zaXRpb24oKVxuICAgICAgb3B0ID0ge3NwbGl0OnNwbGl0LCBzZWFyY2hBbGxQYW5lczp0cnVlfVxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCduYXZpZ2F0ZS5vcGVuSW5TYW1lV2luZG93JylcbiAgICAgICAgb3B0Lm9wZW5JblNhbWVXaW5kb3cgPSB0cnVlXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIEB1cmksIG9wdFxuXG4gIG9wZW5Ccm93c2VyOiAoZXZ0KS0+XG4gICAgIyB0cnkgZ2V0IHRleHQgZGlyZWN0bHlcbiAgICBhY3RpdmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgdGV4dCA9IGFjdGl2ZS5nZXRTZWxlY3RlZFRleHQoKSBvciBAZ2V0VGV4dChhY3RpdmUpXG4gICAgQGJyb3dzZXJPcHRpb24gZXZ0LHRleHQgaWYgdGV4dFxuXG4gIHJlZnJlc2g6IC0+XG4gICAgZWQgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgcmV0dXJuIHVubGVzcyBwcm9qZWN0UGF0aFxuICAgIGlmIHRleHQgPSBlZD8uZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICAgIGRlbGV0ZSBAcGF0aENhY2hlW3Byb2plY3RQYXRoXT9bdGV4dF1cbiAgICBlbHNlXG4gICAgICBAcGF0aENhY2hlW3Byb2plY3RQYXRoXSA9IHt9XG5cbiAgZ2V0VGV4dDogKGVkKS0+XG4gICAgY3Vyc29yID0gZWQuZ2V0Q3Vyc29ycygpWzBdXG4gICAgIyByYW5nZSA9IGVkLmRpc3BsYXlCdWZmZXIuYnVmZmVyUmFuZ2VGb3JTY29wZUF0UG9zaXRpb24gJy5zdHJpbmcucXVvdGVkJyxjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICMgaWYgcmFuZ2VcbiAgICAjICAgdGV4dCA9IGVkLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVsxLi4tMl1cbiAgICBybiA9IEBnZXRRdW90ZVJhbmdlKGN1cnNvcixlZClcbiAgICBpZiBybiBhbmQgcm4uZW5kLnJvdyBpcyBybi5zdGFydC5yb3dcbiAgICAgIHRleHQgPSBlZC5nZXRUZXh0SW5CdWZmZXJSYW5nZShybilcbiAgICB1bmxlc3MgdGV4dFxuICAgICAgdGV4dCA9IGVkLmdldFdvcmRVbmRlckN1cnNvciB3b3JkUmVnZXg6L1tcXC9BLVpcXC5cXC1cXGRcXFxcLV86XSsoOlxcZCspPy9pXG4gICAgaWYgdGV4dFxuICAgICAgdGV4dCA9IHRleHRbMC4uLTJdIGlmIHRleHQuc2xpY2UoLTEpIGlzICc6J1xuICAgICAgdGV4dC50cmltKClcblxuICBnZXRRdW90ZVJhbmdlOiAoY3Vyc29yLGVkKS0+XG4gICAgY2xvc2luZyA9IEBnZXRDbG9zaW5nUXVvdGVQb3NpdGlvbihjdXJzb3IsZWQpXG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBjbG9zaW5nP1xuICAgIG9wZW5pbmcgPSBAZ2V0T3BlbmluZ1F1b3RlUG9zaXRpb24oY3Vyc29yLGVkKVxuICAgIHJldHVybiBmYWxzZSB1bmxlc3Mgb3BlbmluZz9cbiAgICBuZXcgUmFuZ2Ugb3BlbmluZywgY2xvc2luZ1xuXG4gIGdldE9wZW5pbmdRdW90ZVBvc2l0aW9uOiAoY3Vyc29yLGVkKSAtPlxuICAgIHJhbmdlID0gY3Vyc29yLmdldEN1cnJlbnRMaW5lQnVmZmVyUmFuZ2UoKVxuICAgIHJhbmdlLmVuZC5jb2x1bW4gPSBjdXJzb3IuZ2V0U2NyZWVuUG9zaXRpb24oKS5jb2x1bW5cbiAgICBxdW90ZSA9IGZhbHNlXG4gICAgZWQuYnVmZmVyLmJhY2t3YXJkc1NjYW5JblJhbmdlIC9bYHwnfFwiXS9nLCByYW5nZSwgKG9iaikgPT5cbiAgICAgIHJldHVybiBmYWxzZSB1bmxlc3MgQHF1b3RlVHlwZVxuICAgICAgb2JqLnN0b3AoKSBpZiBvYmoubWF0Y2hUZXh0IGlzIEBxdW90ZVR5cGVcbiAgICAgIHF1b3RlID0gb2JqLnJhbmdlLmVuZFxuICAgIHF1b3RlXG5cbiAgZ2V0Q2xvc2luZ1F1b3RlUG9zaXRpb246IChjdXJzb3IsZWQpIC0+XG4gICAgcmFuZ2UgPSBjdXJzb3IuZ2V0Q3VycmVudExpbmVCdWZmZXJSYW5nZSgpXG4gICAgcmFuZ2Uuc3RhcnQuY29sdW1uID0gY3Vyc29yLmdldFNjcmVlblBvc2l0aW9uKCkuY29sdW1uXG4gICAgcXVvdGUgPSBmYWxzZVxuICAgIGRlbGV0ZSBAcXVvdGVUeXBlXG4gICAgZWQuYnVmZmVyLnNjYW5JblJhbmdlIC9bYHwnfFwiXS9nLCByYW5nZSwgKG9iaikgPT5cbiAgICAgIEBxdW90ZVR5cGUgPSBvYmoubWF0Y2hUZXh0XG4gICAgICBvYmouc3RvcCgpXG4gICAgICBxdW90ZSA9IG9iai5yYW5nZS5zdGFydFxuICAgIHF1b3RlXG5cbiAgZm9yd2FyZDogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAdXJpID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgbGluZSA9ICBlZGl0b3IubGluZVRleHRGb3JTY3JlZW5Sb3cgZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkucm93XG4gICAgQHVyaSA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSBvciBAZ2V0VGV4dChlZGl0b3IpXG4gICAgcmV0dXJuIHVubGVzcyBAdXJpXG4gICAgc3BsaXQgPSBAZ2V0UG9zaXRpb24oKVxuXG4gICAgb3BlbiA9ID0+XG4gICAgICBwYXRoID0gcmVxdWlyZSAncGF0aCdcbiAgICAgICMgY2hlY2sgaWYgaXQgaGFzIHJlcXVpcmVcbiAgICAgIGZwYXRoID0gcGF0aC5kaXJuYW1lIGVkaXRvci5nZXRQYXRoKClcbiAgICAgIGV4dCA9IHBhdGguZXh0bmFtZSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgICBleGlzdHMgPSBmcy5leGlzdHNTeW5jIG9yIGZzLmFjY2Vzc1N5bmNcbiAgICAgIGZpbGVuYW1lID0gcGF0aC5iYXNlbmFtZShAdXJpKVxuXG4gICAgICBnbG9iU2VhcmNoID0gPT5cbiAgICAgICAgZmluZHVwID0gcmVxdWlyZSAnZmluZHVwLXN5bmMnXG4gICAgICAgIGdsb2IgPSByZXF1aXJlICdnbG9iJ1xuICAgICAgICBpZ25vcmUgPSBhdG9tLmNvbmZpZy5nZXQoJ25hdmlnYXRlLmlnbm9yZScpIG9yIFtdXG4gICAgICAgIGdsb2IgXCIqKi8qI3tmaWxlbmFtZX0qXCIse2N3ZDpwcm9qZWN0UGF0aCxzdGF0OmZhbHNlLG5vY2FzZTp0cnVlLG5vZGlyOnRydWUsaWdub3JlOmlnbm9yZX0sIChlcnIsZmlsZXMpPT5cbiAgICAgICAgICBpZiBlcnIgb3Igbm90IGZpbGVzLmxlbmd0aFxuICAgICAgICAgICAgZnBhdGhzID0gZmluZHVwIGZpbGVuYW1lLHtjd2Q6cHJvamVjdFBhdGgsbm9jYXNlOnRydWV9XG4gICAgICAgICAgICBpZiBmcGF0aHNcbiAgICAgICAgICAgICAgc3RhdHMgPSBmcy5sc3RhdFN5bmMoZnBhdGhzKVxuICAgICAgICAgICAgICBpZiBub3Qgc3RhdHMgb3Igc3RhdHMuaXNEaXJlY3RvcnkoKSBvciBzdGF0cy5pc1N5bWJvbGljTGluaygpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cgJ0ZvdW5kIFBhdGggYnV0IGl0IGlzIGRpcmVjdG9yeScsZnBhdGhzXG4gICAgICAgICAgICAgICAgQG1vZGFsUGFuZWwuaGlkZSgpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgIEBtYXRjaEZpbGUoQHVyaSxleHQsZnBhdGhzLGVkaXRvcilcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgQG1vZGFsUGFuZWwuaGlkZSgpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQG1hdGNoRmlsZShAdXJpLGV4dCxmaWxlcyxlZGl0b3IpXG5cbiAgICAgIG9wZW5GaWxlID0gPT5cbiAgICAgICAgcGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG4gICAgICAgIHRyeVxuICAgICAgICAgIGlmIG9mbmFtZSA9IEBwYXRoQ2FjaGVbcHJvamVjdFBhdGhdP1tAdXJpXVxuICAgICAgICAgICAgQG9wZW4oW29mbmFtZV0sZWRpdG9yKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICBiYXNlRGlyID0gYXRvbS5jb25maWcuZ2V0KCduYXZpZ2F0ZS5iYXNlZGlyJykgb3IgW11cbiAgICAgICAgICBmaWxlU3JjID0gW11cbiAgICAgICAgICBpZiBAdXJpWzBdIGlzICcvJyBvciBAdXJpWzBdIGlzICdcXFxcJ1xuICAgICAgICAgICAgaWYgZnBhdGguc3RhcnRzV2l0aChwcm9qZWN0UGF0aClcbiAgICAgICAgICAgICAgZmlsZVNyYy51bnNoaWZ0IHByb2plY3RQYXRoKycvJytAdXJpXG4gICAgICAgICAgICAgIGZpbGVTcmMudW5zaGlmdCBwcm9qZWN0UGF0aCsnLycrQHVyaStleHQgdW5sZXNzIHBhdGguZXh0bmFtZSBAdXJpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGZpbGVTcmMudW5zaGlmdCBmcGF0aCtcIi8uLi9cIitAdXJpXG4gICAgICAgICAgICAgIGZpbGVTcmMudW5zaGlmdCBmcGF0aCtcIi8uLi9cIitAdXJpK2V4dCB1bmxlc3MgcGF0aC5leHRuYW1lIEB1cmlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBmaWxlU3JjLnVuc2hpZnQgZnBhdGgrQHVyaVxuICAgICAgICAgICAgZmlsZVNyYy51bnNoaWZ0IGZwYXRoK0B1cmkrZXh0IHVubGVzcyBwYXRoLmV4dG5hbWUgQHVyaVxuXG4gICAgICAgICAgZm9yIGksZGlyIG9mIGJhc2VEaXJcbiAgICAgICAgICAgIGlmIEB1cmlbMF0gaXMgJy8nIG9yIEB1cmlbMF0gaXMgJ1xcXFwnXG4gICAgICAgICAgICAgIGlmIGZwYXRoLnN0YXJ0c1dpdGgocHJvamVjdFBhdGgpXG4gICAgICAgICAgICAgICAgZmlsZVNyYy51bnNoaWZ0IHByb2plY3RQYXRoKycvJysgZGlyKycvJytAdXJpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBmaWxlU3JjLnVuc2hpZnQgZnBhdGgrJy8uLi8nKyBkaXIrJy8nK0B1cmlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgZmlsZVNyYy51bnNoaWZ0IGZwYXRoKycvJysgZGlyKycvJytAdXJpXG5cbiAgICAgICAgICBmb3IgdXJsIGluIGZpbGVTcmNcbiAgICAgICAgICAgIGlmIGV4aXN0cyB1cmxcbiAgICAgICAgICAgICAgQG9wZW4oW3VybF0sZWRpdG9yKVxuICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgIGZpbGVuYW1lID0gcGF0aC5iYXNlbmFtZShAdXJpKVxuICAgICAgICAgICMgZWxzZVxuICAgICAgICAgIEBjb21wbGV4ID0gdHJ1ZVxuICAgICAgICAgIGdsb2JTZWFyY2goKVxuICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgY29uc29sZS5sb2cgJ0Vycm9yIGZpbmRpbmcgdGhlIGZpbGVwYXRoJyxlXG4gICAgICB0cnlcbiAgICAgICAgcmVzb2x2ZSA9IHJlcXVpcmUgJ3Jlc29sdmUnXG4gICAgICAgIEBtb2RhbFBhbmVsLnNob3coKVxuICAgICAgICBpZiBsaW5lLmluY2x1ZGVzICdyZXF1aXJlJ1xuICAgICAgICAgIGlmIHJlc29sdmUuaXNDb3JlKEB1cmkpXG4gICAgICAgICAgICB1cmwgPSBcImh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9ibG9iL21hc3Rlci9saWIvI3tAdXJpfS5qc1wiXG4gICAgICAgICAgICBAbW9kYWxQYW5lbC5oaWRlKClcbiAgICAgICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuIHVybCwge3NwbGl0OnNwbGl0LCBzZWFyY2hBbGxQYW5lczp0cnVlfVxuXG4gICAgICAgICAgZmlsZXBhdGggPSByZXNvbHZlLnN5bmMoQHVyaSwgYmFzZWRpcjpmcGF0aCxleHRlbnNpb25zOlsnLmpzJywnLmNvZmZlZSddKVxuICAgICAgICAgIHJldHVybiBAb3BlbihbZmlsZXBhdGhdLGVkaXRvcikgaWYgZnMuc3RhdFN5bmMgZmlsZXBhdGhcbiAgICAgICAgb3BlbkZpbGUoKVxuICAgICAgY2F0Y2ggZVxuICAgICAgICBjb25zb2xlLmxvZyAnRXJyb3IgZmluZGluZyB0aGUgZmlsZXBhdGgnLGVcbiAgICAgICAgdHJ5XG4gICAgICAgICAgbW9kdWxlICA9IHJlcXVpcmUgJ21vZHVsZSdcbiAgICAgICAgICByZXR1cm4gQG9wZW4oW2ZpbGVwYXRoXSxlZGl0b3IpIGlmIGZzLnN0YXRTeW5jIGZpbGVwYXRoIGlmIGZpbGVwYXRoID0gIG1vZHVsZS5fcmVzb2x2ZUZpbGVuYW1lIEB1cmlcbiAgICAgICAgICBvcGVuRmlsZSgpXG4gICAgICAgIGNhdGNoIGVcbiAgICAgICAgICBjb25zb2xlLmxvZyAnRXJyb3IgZmluZGluZyB0aGUgZmlsZXBhdGggd2l0aCBtb2R1bGUnLGVcbiAgICAgICAgICBvcGVuRmlsZSgpXG5cbiAgICBpZiBAdXJpLmluZGV4T2YoJ2h0dHA6JykgaXMgMCAgb3IgQHVyaS5pbmRleE9mKCdodHRwczonKSBpcyAwIG9yIEB1cmkuaW5kZXhPZignbG9jYWxob3N0OicpIGlzIDBcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gQHVyaSwge3NwbGl0OnNwbGl0LCBzZWFyY2hBbGxQYW5lczp0cnVlfVxuICAgIGVsc2VcbiAgICAgIG9wZW4oQHVyaSlcblxuICBtYXRjaEZpbGU6IChmaWxlbmFtZSxleHQsZmlsZXMsZWRpdG9yKS0+XG4gICAgQG1vZGFsUGFuZWwuaGlkZSgpXG4gICAgaWYgdHlwZW9mIGZpbGVzIGlzICdzdHJpbmcnXG4gICAgICBAb3BlbihbZmlsZXNdLGVkaXRvcilcbiAgICBlbHNlXG4gICAgICBpZiBmaWxlbmFtZSBpbiBmaWxlc1xuICAgICAgICBAb3BlbihbZmlsZW5hbWVdLGVkaXRvcilcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgZm5hbWUgPSBmaWxlbmFtZStleHQgaW4gZmlsZXNcbiAgICAgICAgICBAb3BlbihbZm5hbWVdLGVkaXRvcilcbiAgICAgICAgZWxzZVxuICAgICAgICAgICMgT3BlbiBmaWxlcyBpbiB0aGUgbGlzdCB2aWV3ICYgb3BlbiB0aGUgc2VsZWN0IGZpbGUgYW5kIHNhdmUgaXRcbiAgICAgICAgICAjIGZ1c2UgPSBuZXcgRnVzZSBmaWxlc1xuICAgICAgICAgICMgcmVzdWx0ID0gZnVzZS5zZWFyY2goZmlsZW5hbWUpWzBdXG4gICAgICAgICAgIyBAb3BlbihbZmlsZXNbcmVzdWx0XV0sZWRpdG9yKVxuICAgICAgICAgIGlmIGZpbGVzLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICBAb3BlbihmaWxlcyxlZGl0b3IpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAge0xpc3RWaWV3fSA9IHJlcXVpcmUgJy4vbmF2aWdhdGUtdmlldydcbiAgICAgICAgICAgIG5ldyBMaXN0VmlldyBmaWxlcywgKGZpbGUpPT5cbiAgICAgICAgICAgICAgQG9wZW4oW2ZpbGVdLGVkaXRvcilcblxuICBvcGVuOiAodXJsLGVkaXRvcixiYWNrPWZhbHNlKS0+XG4gICAgQG1vZGFsUGFuZWwuaGlkZSgpXG4gICAgdW5sZXNzIEBuZXdcbiAgICAgIGlmIGVkaXRvci5pc01vZGlmaWVkKClcbiAgICAgICAgaWYgZWRpdG9yLnNob3VsZFByb21wdFRvU2F2ZSgpXG4gICAgICAgICAgaXQgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICAgIHJldHVybiB1bmxlc3MgcGFuZS5wcm9tcHRUb1NhdmVJdGVtKGl0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZWRpdG9yLnNhdmUoKVxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4gdXJsWzBdXG4gICAgICAudGhlbiAoZWQpPT5cbiAgICAgICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgICAgICBlZC5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbih1cmxbMV0pIGlmIHVybFsxXVxuICAgICAgICBAbmF2aVtcIiN7ZWQuZ2V0UGF0aCgpfVwiXSA9IFtlZGl0b3IuZ2V0UGF0aCgpLGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpXSB1bmxlc3MgYmFja1xuICAgICAgICBpZiBAY29tcGxleFxuICAgICAgICAgIEBjb21wbGV4ID0gZmFsc2VcbiAgICAgICAgICBAcGF0aENhY2hlW3Byb2plY3RQYXRoXSBvcj0ge31cbiAgICAgICAgICBAcGF0aENhY2hlW3Byb2plY3RQYXRoXVtAdXJpXSA9IGVkLmdldFBhdGgoKSB1bmxlc3MgYmFja1xuICAgICAgICBAbW9kYWxQYW5lbC5oaWRlKClcbiAgICAgICAgaWYgQG5ldyB0aGVuIEBuZXcgPSBmYWxzZSBlbHNlIGVkaXRvci5kZXN0cm95KClcblxuICBiYWNrOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICBmcGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICByZXR1cm4gdW5sZXNzIG5hdmkgPSBAbmF2aVtmcGF0aF1cbiAgICBkZWxldGUgQG5hdmlbZnBhdGhdXG4gICAgQG9wZW4obmF2aSxlZGl0b3IsdHJ1ZSlcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICBwYXRoQ2FjaGU6IEBwYXRoQ2FjaGVcbiAgdG9nZ2xlOiAtPlxuXG4gIGdldFBvc2l0aW9uOiAtPlxuICAgIGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBwYW5lQXhpcyA9IGFjdGl2ZVBhbmUuZ2V0UGFyZW50KClcbiAgICBwYW5lSW5kZXggPSBwYW5lQXhpcy5nZXRQYW5lcygpLmluZGV4T2YoYWN0aXZlUGFuZSlcbiAgICBvcmllbnRhdGlvbiA9IHBhbmVBeGlzLm9yaWVudGF0aW9uID8gJ2hvcml6b250YWwnXG4gICAgaWYgb3JpZW50YXRpb24gaXMgJ2hvcml6b250YWwnXG4gICAgICBpZiAgcGFuZUluZGV4IGlzIDAgdGhlbiAncmlnaHQnIGVsc2UgJ2xlZnQnXG4gICAgZWxzZVxuICAgICAgaWYgIHBhbmVJbmRleCBpcyAwIHRoZW4gJ2Rvd24nIGVsc2UgJ3VwJ1xuIl19
