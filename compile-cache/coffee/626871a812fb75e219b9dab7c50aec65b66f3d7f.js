(function() {
  var BrowserPlus, BrowserPlusModel, CompositeDisposable, uuid;

  CompositeDisposable = require('atom').CompositeDisposable;

  BrowserPlusModel = require('./browser-plus-model');

  require('JSON2');

  uuid = require('node-uuid');

  module.exports = BrowserPlus = {
    browserPlusView: null,
    subscriptions: null,
    config: {
      fav: {
        title: 'No of Favorites',
        type: 'number',
        "default": 10
      },
      homepage: {
        title: 'HomePage',
        type: 'string',
        "default": 'browser-plus://blank'
      },
      live: {
        title: 'Live Refresh in ',
        type: 'number',
        "default": 500
      },
      currentFile: {
        title: 'Show Current File',
        type: 'boolean',
        "default": true
      },
      openInSameWindow: {
        title: 'Open URLs in Same Window',
        type: 'array',
        "default": ['www.google.com', 'www.stackoverflow.com', 'google.com', 'stackoverflow.com']
      }
    },
    activate: function(state) {
      var $;
      if (!state.noReset) {
        state.favIcon = {};
        state.title = {};
        state.fav = [];
      }
      this.resources = (atom.packages.getPackageDirPaths()[0]) + "/browser-plus/resources/";
      require('jstorage');
      window.bp = {};
      $ = require('jquery');
      window.bp.js = $.extend({}, window.$.jStorage);
      if (!window.bp.js.get('bp.fav')) {
        window.bp.js.set('bp.fav', []);
      }
      if (!window.bp.js.get('bp.history')) {
        window.bp.js.set('bp.history', []);
      }
      if (!window.bp.js.get('bp.favIcon')) {
        window.bp.js.set('bp.favIcon', {});
      }
      if (!window.bp.js.get('bp.title')) {
        window.bp.js.set('bp.title', {});
      }
      atom.workspace.addOpener((function(_this) {
        return function(url, opt) {
          var editor, localhostPattern, pane, path;
          if (opt == null) {
            opt = {};
          }
          path = require('path');
          if (url.indexOf('http:') === 0 || url.indexOf('https:') === 0 || url.indexOf('localhost') === 0 || url.indexOf('file:') === 0 || url.indexOf('browser-plus:') === 0 || url.indexOf('browser-plus~') === 0) {
            localhostPattern = /^(http:\/\/)?localhost/i;
            if (!BrowserPlusModel.checkUrl(url)) {
              return false;
            }
            if (!(url === 'browser-plus://blank' || url.startsWith('file:///') || !opt.openInSameWindow)) {
              editor = BrowserPlusModel.getEditorForURI(url, opt.openInSameWindow);
              if (editor) {
                editor.setText(opt.src);
                if (!opt.src) {
                  editor.refresh(url);
                }
                pane = atom.workspace.paneForItem(editor);
                pane.activateItem(editor);
                return editor;
              }
            }
            return new BrowserPlusModel({
              browserPlus: _this,
              url: url,
              opt: opt
            });
          }
        };
      })(this));
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'browser-plus:open': (function(_this) {
          return function() {
            return _this.open();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'browser-plus:openCurrent': (function(_this) {
          return function() {
            return _this.open(true);
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'browser-plus:history': (function(_this) {
          return function() {
            return _this.history(true);
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'browser-plus:deleteHistory': (function(_this) {
          return function() {
            return _this["delete"](true);
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'browser-plus:fav': (function(_this) {
          return function() {
            return _this.favr();
          };
        })(this)
      }));
    },
    favr: function() {
      var favList;
      favList = require('./fav-view');
      return new favList(window.bp.js.get('bp.fav'));
    },
    "delete": function() {
      return window.bp.js.set('bp.history', []);
    },
    history: function() {
      return atom.workspace.open("browser-plus://history", {
        split: 'left',
        searchAllPanes: true
      });
    },
    open: function(url, opt) {
      var editor, ref;
      if (opt == null) {
        opt = {};
      }
      if (!url && atom.config.get('browser-plus.currentFile')) {
        editor = atom.workspace.getActiveTextEditor();
        if (url = editor != null ? (ref = editor.buffer) != null ? ref.getUri() : void 0 : void 0) {
          url = "file:///" + url;
        }
      }
      if (!url) {
        url = atom.config.get('browser-plus.homepage');
      }
      if (!opt.split) {
        opt.split = this.getPosition();
      }
      return atom.workspace.open(url, opt);
    },
    getPosition: function() {
      var activePane, orientation, paneAxis, paneIndex, ref;
      activePane = atom.workspace.paneForItem(atom.workspace.getActiveTextEditor());
      if (!activePane) {
        return;
      }
      paneAxis = activePane.getParent();
      if (!paneAxis) {
        return;
      }
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
    },
    deactivate: function() {
      var ref;
      if ((ref = this.browserPlusView) != null) {
        if (typeof ref.destroy === "function") {
          ref.destroy();
        }
      }
      return this.subscriptions.dispose();
    },
    serialize: function() {
      return {
        noReset: true
      };
    },
    getBrowserPlusUrl: function(url) {
      if (url.startsWith('browser-plus://history')) {
        return url = this.resources + "history.html";
      } else {
        return url = '';
      }
    },
    addPlugin: function(requires) {
      var error, key, menu, pkg, pkgPath, pkgs, results, script, val;
      if (this.plugins == null) {
        this.plugins = {};
      }
      results = [];
      for (key in requires) {
        val = requires[key];
        try {
          switch (key) {
            case 'onInit' || 'onExit':
              results.push(this.plugins[key] = (this.plugins[key] || []).concat("(" + (val.toString()) + ")()"));
              break;
            case 'js' || 'css':
              if (!pkgPath) {
                pkgs = Object.keys(atom.packages.activatingPackages).sort();
                pkg = pkgs[pkgs.length - 1];
                pkgPath = atom.packages.activatingPackages[pkg].path + "/";
              }
              if (Array.isArray(val)) {
                results.push((function() {
                  var i, len, results1;
                  results1 = [];
                  for (i = 0, len = val.length; i < len; i++) {
                    script = val[i];
                    if (!script.startsWith('http')) {
                      results1.push(this.plugins[key + "s"] = (this.plugins[key] || []).concat('file:///' + atom.packages.activatingPackages[pkg].path.replace(/\\/g, "/") + "/" + script));
                    } else {
                      results1.push(void 0);
                    }
                  }
                  return results1;
                }).call(this));
              } else {
                if (!val.startsWith('http')) {
                  results.push(this.plugins[key + "s"] = (this.plugins[key] || []).concat('file:///' + atom.packages.activatingPackages[pkg].path.replace(/\\/g, "/") + "/" + val));
                } else {
                  results.push(void 0);
                }
              }
              break;
            case 'menus':
              if (Array.isArray(val)) {
                results.push((function() {
                  var i, len, results1;
                  results1 = [];
                  for (i = 0, len = val.length; i < len; i++) {
                    menu = val[i];
                    menu._id = uuid.v1();
                    results1.push(this.plugins[key] = (this.plugins[key] || []).concat(menu));
                  }
                  return results1;
                }).call(this));
              } else {
                val._id = uuid.v1();
                results.push(this.plugins[key] = (this.plugins[key] || []).concat(val));
              }
              break;
            default:
              results.push(void 0);
          }
        } catch (error1) {
          error = error1;
        }
      }
      return results;
    },
    provideService: function() {
      return {
        model: require('./browser-plus-model'),
        addPlugin: this.addPlugin.bind(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9icm93c2VyLXBsdXMvbGliL2Jyb3dzZXItcGx1cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHNCQUFSOztFQUNuQixPQUFBLENBQVEsT0FBUjs7RUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFdBQVI7O0VBQ1AsTUFBTSxDQUFDLE9BQVAsR0FBaUIsV0FBQSxHQUNmO0lBQUEsZUFBQSxFQUFpQixJQUFqQjtJQUNBLGFBQUEsRUFBZSxJQURmO0lBRUEsTUFBQSxFQUNFO01BQUEsR0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGlCQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRlQ7T0FERjtNQUlBLFFBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxVQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLHNCQUZUO09BTEY7TUFRQSxJQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sa0JBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsR0FGVDtPQVRGO01BWUEsV0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLG1CQUFQO1FBQ0EsSUFBQSxFQUFNLFNBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRlQ7T0FiRjtNQWdCQSxnQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLDBCQUFQO1FBQ0EsSUFBQSxFQUFNLE9BRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMsZ0JBQUQsRUFBa0IsdUJBQWxCLEVBQTBDLFlBQTFDLEVBQXVELG1CQUF2RCxDQUZUO09BakJGO0tBSEY7SUF3QkEsUUFBQSxFQUFV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QUNWLElBQUMsQ0FBQSxPQUFRLENBQUEsR0FBQSxDQUFULEdBQWdCLENBQUMsSUFBQyxDQUFBLE9BQVEsQ0FBQSxHQUFBLENBQVQsSUFBaUIsRUFBbEIsQ0FBcUIsQ0FBQyxNQUF0QixDQUE2QixHQUE3QixHQU5sQjs7QUFERztBQWhCUDs7QUFBQSxXQURGO1NBQUEsY0FBQTtVQTBCTSxlQTFCTjs7QUFERjs7SUFGUyxDQXpIWDtJQTBKQSxjQUFBLEVBQWdCLFNBQUE7YUFDZDtRQUFBLEtBQUEsRUFBTSxPQUFBLENBQVEsc0JBQVIsQ0FBTjtRQUNBLFNBQUEsRUFBVyxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBaEIsQ0FEWDs7SUFEYyxDQTFKaEI7O0FBTkYiLCJzb3VyY2VzQ29udGVudCI6WyIjIGF0b20ucHJvamVjdC5yZXNvbHZlUGF0aFxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbkJyb3dzZXJQbHVzTW9kZWwgPSByZXF1aXJlICcuL2Jyb3dzZXItcGx1cy1tb2RlbCdcbnJlcXVpcmUgJ0pTT04yJ1xuXG51dWlkID0gcmVxdWlyZSAnbm9kZS11dWlkJ1xubW9kdWxlLmV4cG9ydHMgPSBCcm93c2VyUGx1cyA9XG4gIGJyb3dzZXJQbHVzVmlldzogbnVsbFxuICBzdWJzY3JpcHRpb25zOiBudWxsXG4gIGNvbmZpZzpcbiAgICBmYXY6XG4gICAgICB0aXRsZTogJ05vIG9mIEZhdm9yaXRlcydcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICBkZWZhdWx0OiAxMFxuICAgIGhvbWVwYWdlOlxuICAgICAgdGl0bGU6ICdIb21lUGFnZSdcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnYnJvd3Nlci1wbHVzOi8vYmxhbmsnXG4gICAgbGl2ZTpcbiAgICAgIHRpdGxlOiAnTGl2ZSBSZWZyZXNoIGluICdcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICBkZWZhdWx0OiA1MDBcbiAgICBjdXJyZW50RmlsZTpcbiAgICAgIHRpdGxlOiAnU2hvdyBDdXJyZW50IEZpbGUnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBvcGVuSW5TYW1lV2luZG93OlxuICAgICAgdGl0bGU6ICdPcGVuIFVSTHMgaW4gU2FtZSBXaW5kb3cnXG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbJ3d3dy5nb29nbGUuY29tJywnd3d3LnN0YWNrb3ZlcmZsb3cuY29tJywnZ29vZ2xlLmNvbScsJ3N0YWNrb3ZlcmZsb3cuY29tJ11cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIHVubGVzcyBzdGF0ZS5ub1Jlc2V0XG4gICAgICBzdGF0ZS5mYXZJY29uID0ge31cbiAgICAgIHN0YXRlLnRpdGxlID0ge31cbiAgICAgIHN0YXRlLmZhdiA9IFtdXG4gICAgQHJlc291cmNlcyA9IFwiI3thdG9tLnBhY2thZ2VzLmdldFBhY2thZ2VEaXJQYXRocygpWzBdfS9icm93c2VyLXBsdXMvcmVzb3VyY2VzL1wiXG4gICAgcmVxdWlyZSAnanN0b3JhZ2UnXG4gICAgd2luZG93LmJwID0ge31cbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbiAgICB3aW5kb3cuYnAuanMgID0gJC5leHRlbmQoe30sd2luZG93LiQualN0b3JhZ2UpXG4gICAgd2luZG93LmJwLmpzLnNldCgnYnAuZmF2JyxbXSkgdW5sZXNzIHdpbmRvdy5icC5qcy5nZXQoJ2JwLmZhdicpXG4gICAgd2luZG93LmJwLmpzLnNldCgnYnAuaGlzdG9yeScsW10pICB1bmxlc3Mgd2luZG93LmJwLmpzLmdldCgnYnAuaGlzdG9yeScpXG4gICAgd2luZG93LmJwLmpzLnNldCgnYnAuZmF2SWNvbicse30pICB1bmxlc3Mgd2luZG93LmJwLmpzLmdldCgnYnAuZmF2SWNvbicpXG4gICAgd2luZG93LmJwLmpzLnNldCgnYnAudGl0bGUnLHt9KSAgdW5sZXNzIHdpbmRvdy5icC5qcy5nZXQoJ2JwLnRpdGxlJylcblxuICAgIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lciAodXJsLG9wdD17fSk9PlxuICAgICAgcGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG4gICAgICBpZiAoIHVybC5pbmRleE9mKCdodHRwOicpIGlzIDAgb3IgdXJsLmluZGV4T2YoJ2h0dHBzOicpIGlzIDAgb3JcbiAgICAgICAgICB1cmwuaW5kZXhPZignbG9jYWxob3N0JykgaXMgMCBvciB1cmwuaW5kZXhPZignZmlsZTonKSBpcyAwIG9yXG4gICAgICAgICAgdXJsLmluZGV4T2YoJ2Jyb3dzZXItcGx1czonKSBpcyAwICAgb3IgI29yIG9wdC5zcmNcbiAgICAgICAgICB1cmwuaW5kZXhPZignYnJvd3Nlci1wbHVzficpIGlzIDAgKVxuICAgICAgICAgbG9jYWxob3N0UGF0dGVybiA9IC8vL15cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChodHRwOi8vKT9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsaG9zdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vaVxuICAgICAgICAgcmV0dXJuIGZhbHNlIHVubGVzcyBCcm93c2VyUGx1c01vZGVsLmNoZWNrVXJsKHVybClcbiAgICAgICAgICMgIGNoZWNrIGlmIGl0IG5lZWQgdG8gYmUgb3BlbiBpbiBzYW1lIHdpbmRvd1xuICAgICAgICAgdW5sZXNzIHVybCBpcyAnYnJvd3Nlci1wbHVzOi8vYmxhbmsnIG9yIHVybC5zdGFydHNXaXRoKCdmaWxlOi8vLycpIG9yIG5vdCBvcHQub3BlbkluU2FtZVdpbmRvd1xuICAgICAgICAgICBlZGl0b3IgPSBCcm93c2VyUGx1c01vZGVsLmdldEVkaXRvckZvclVSSSh1cmwsb3B0Lm9wZW5JblNhbWVXaW5kb3cpXG4gICAgICAgICAgIGlmIGVkaXRvclxuICAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0KG9wdC5zcmMpXG4gICAgICAgICAgICAgZWRpdG9yLnJlZnJlc2godXJsKSB1bmxlc3Mgb3B0LnNyY1xuICAgICAgICAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShlZGl0b3IpXG4gICAgICAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yKVxuICAgICAgICAgICAgIHJldHVybiBlZGl0b3JcblxuICAgICAgICAjICB1cmwgPSB1cmwucmVwbGFjZShsb2NhbGhvc3RQYXR0ZXJuLCdodHRwOi8vMTI3LjAuMC4xJylcbiAgICAgICAgIG5ldyBCcm93c2VyUGx1c01vZGVsIHticm93c2VyUGx1czpALHVybDp1cmwsb3B0Om9wdH1cblxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnYnJvd3Nlci1wbHVzOm9wZW4nOiA9PiBAb3BlbigpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdicm93c2VyLXBsdXM6b3BlbkN1cnJlbnQnOiA9PiBAb3Blbih0cnVlKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnYnJvd3Nlci1wbHVzOmhpc3RvcnknOiA9PiBAaGlzdG9yeSh0cnVlKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnYnJvd3Nlci1wbHVzOmRlbGV0ZUhpc3RvcnknOiA9PiBAZGVsZXRlKHRydWUpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdicm93c2VyLXBsdXM6ZmF2JzogPT4gQGZhdnIoKVxuXG4gIGZhdnI6IC0+XG4gICAgZmF2TGlzdCA9IHJlcXVpcmUgJy4vZmF2LXZpZXcnXG4gICAgbmV3IGZhdkxpc3Qgd2luZG93LmJwLmpzLmdldCgnYnAuZmF2JylcblxuICBkZWxldGU6IC0+XG4gICAgd2luZG93LmJwLmpzLnNldCgnYnAuaGlzdG9yeScsW10pXG5cbiAgaGlzdG9yeTogLT5cbiAgICAjIGZpbGU6Ly8vI3tAcmVzb3VyY2VzfWhpc3RvcnkuaHRtbFxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4gXCJicm93c2VyLXBsdXM6Ly9oaXN0b3J5XCIgLCB7c3BsaXQ6ICdsZWZ0JyxzZWFyY2hBbGxQYW5lczp0cnVlfVxuXG4gIG9wZW46ICh1cmwsb3B0ID0ge30pLT5cbiAgICBpZiAoIG5vdCB1cmwgYW5kIGF0b20uY29uZmlnLmdldCgnYnJvd3Nlci1wbHVzLmN1cnJlbnRGaWxlJykpXG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGlmIHVybCA9IGVkaXRvcj8uYnVmZmVyPy5nZXRVcmkoKVxuICAgICAgICB1cmwgPSBcImZpbGU6Ly8vXCIrdXJsXG4gICAgdW5sZXNzIHVybFxuICAgICAgdXJsID0gYXRvbS5jb25maWcuZ2V0KCdicm93c2VyLXBsdXMuaG9tZXBhZ2UnKVxuXG4gICAgb3B0LnNwbGl0ID0gQGdldFBvc2l0aW9uKCkgdW5sZXNzIG9wdC5zcGxpdFxuICAgICMgdXJsID0gXCJicm93c2VyLXBsdXM6Ly9wcmV2aWV3fiN7dXJsfVwiIGlmIHNyY1xuICAgIGF0b20ud29ya3NwYWNlLm9wZW4gdXJsLCBvcHRcblxuICBnZXRQb3NpdGlvbjogLT5cbiAgICBhY3RpdmVQYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIHVubGVzcyBhY3RpdmVQYW5lXG4gICAgcGFuZUF4aXMgPSBhY3RpdmVQYW5lLmdldFBhcmVudCgpXG4gICAgcmV0dXJuIHVubGVzcyBwYW5lQXhpc1xuICAgIHBhbmVJbmRleCA9IHBhbmVBeGlzLmdldFBhbmVzKCkuaW5kZXhPZihhY3RpdmVQYW5lKVxuICAgIG9yaWVudGF0aW9uID0gcGFuZUF4aXMub3JpZW50YXRpb24gPyAnaG9yaXpvbnRhbCdcbiAgICBpZiBvcmllbnRhdGlvbiBpcyAnaG9yaXpvbnRhbCdcbiAgICAgIGlmICBwYW5lSW5kZXggaXMgMCB0aGVuICdyaWdodCcgZWxzZSAnbGVmdCdcbiAgICBlbHNlXG4gICAgICBpZiAgcGFuZUluZGV4IGlzIDAgdGhlbiAnZG93bicgZWxzZSAndXAnXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAYnJvd3NlclBsdXNWaWV3Py5kZXN0cm95PygpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIG5vUmVzZXQ6IHRydWVcblxuICBnZXRCcm93c2VyUGx1c1VybDogKHVybCktPlxuICAgIGlmIHVybC5zdGFydHNXaXRoKCdicm93c2VyLXBsdXM6Ly9oaXN0b3J5JylcbiAgICAgIHVybCA9IFwiI3tAcmVzb3VyY2VzfWhpc3RvcnkuaHRtbFwiXG4gICAgZWxzZVxuICAgICAgdXJsID0gJydcblxuICBhZGRQbHVnaW46IChyZXF1aXJlcyktPlxuICAgIEBwbHVnaW5zID89IHt9XG4gICAgZm9yIGtleSx2YWwgb2YgcmVxdWlyZXNcbiAgICAgIHRyeVxuICAgICAgICBzd2l0Y2gga2V5XG4gICAgICAgICAgd2hlbiAnb25Jbml0JyBvciAnb25FeGl0J1xuICAgICAgICAgICAgQHBsdWdpbnNba2V5XSA9IChAcGx1Z2luc1trZXldIG9yIFtdKS5jb25jYXQgXCIoI3t2YWwudG9TdHJpbmcoKX0pKClcIlxuICAgICAgICAgIHdoZW4gJ2pzJyBvciAnY3NzJ1xuICAgICAgICAgICAgdW5sZXNzICBwa2dQYXRoXG4gICAgICAgICAgICAgIHBrZ3MgPSBPYmplY3Qua2V5cyhhdG9tLnBhY2thZ2VzLmFjdGl2YXRpbmdQYWNrYWdlcykuc29ydCgpXG4gICAgICAgICAgICAgIHBrZyA9IHBrZ3NbcGtncy5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICBwa2dQYXRoID0gYXRvbS5wYWNrYWdlcy5hY3RpdmF0aW5nUGFja2FnZXNbcGtnXS5wYXRoICsgXCIvXCJcbiAgICAgICAgICAgIGlmIEFycmF5LmlzQXJyYXkodmFsKVxuICAgICAgICAgICAgICBmb3Igc2NyaXB0IGluIHZhbFxuICAgICAgICAgICAgICAgIHVubGVzcyBzY3JpcHQuc3RhcnRzV2l0aCgnaHR0cCcpXG4gICAgICAgICAgICAgICAgICBAcGx1Z2luc1trZXkrXCJzXCJdID0gKEBwbHVnaW5zW2tleV0gb3IgW10pLmNvbmNhdCAnZmlsZTovLy8nK2F0b20ucGFja2FnZXMuYWN0aXZhdGluZ1BhY2thZ2VzW3BrZ10ucGF0aC5yZXBsYWNlKC9cXFxcL2csXCIvXCIpICsgXCIvXCIgKyBzY3JpcHRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdW5sZXNzIHZhbC5zdGFydHNXaXRoKCdodHRwJylcbiAgICAgICAgICAgICAgICBAcGx1Z2luc1trZXkrXCJzXCJdID0gKEBwbHVnaW5zW2tleV0gb3IgW10pLmNvbmNhdCAnZmlsZTovLy8nKyBhdG9tLnBhY2thZ2VzLmFjdGl2YXRpbmdQYWNrYWdlc1twa2ddLnBhdGgucmVwbGFjZSgvXFxcXC9nLFwiL1wiKSArIFwiL1wiICsgdmFsXG5cbiAgICAgICAgICB3aGVuICdtZW51cydcbiAgICAgICAgICAgIGlmIEFycmF5LmlzQXJyYXkodmFsKVxuICAgICAgICAgICAgICBmb3IgbWVudSBpbiB2YWxcbiAgICAgICAgICAgICAgICBtZW51Ll9pZCA9IHV1aWQudjEoKVxuICAgICAgICAgICAgICAgIEBwbHVnaW5zW2tleV0gPSAoQHBsdWdpbnNba2V5XSBvciBbXSkuY29uY2F0IG1lbnVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdmFsLl9pZCA9IHV1aWQudjEoKVxuICAgICAgICAgICAgICBAcGx1Z2luc1trZXldID0gKEBwbHVnaW5zW2tleV0gb3IgW10pLmNvbmNhdCB2YWxcblxuICAgICAgY2F0Y2ggZXJyb3JcblxuXG5cbiAgcHJvdmlkZVNlcnZpY2U6IC0+XG4gICAgbW9kZWw6cmVxdWlyZSAnLi9icm93c2VyLXBsdXMtbW9kZWwnXG4gICAgYWRkUGx1Z2luOiBAYWRkUGx1Z2luLmJpbmQoQClcbiJdfQ==
