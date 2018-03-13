(function() {
  var CompositeDisposable, Disposable, ItemSerializer, Outline, OutlineEditor, Q, _, foldingTextService, path, ref, url,
    slice = [].slice;

  ref = require('atom'), Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  foldingTextService = require('./foldingtext-service');

  ItemSerializer = null;

  OutlineEditor = null;

  Outline = null;

  path = null;

  url = null;

  Q = null;

  _ = null;

  atom.deserializers.add({
    name: 'OutlineEditorDeserializer',
    deserialize: function(data) {
      var outline;
      if (data == null) {
        data = {};
      }
      if (OutlineEditor == null) {
        OutlineEditor = require('./editor/outline-editor');
      }
      outline = require('./core/outline').getOutlineForPathSync(data.filePath);
      return new OutlineEditor(outline, data);
    }
  });

  module.exports = {
    subscriptions: null,
    statusBar: null,
    statusBarDisposables: null,
    statusBarAddedItems: false,
    workspaceDisplayedEditor: false,
    config: {
      disableAnimation: {
        type: 'boolean',
        "default": false
      }
    },
    provideFoldingTextService: function() {
      return foldingTextService;
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'outline-editor:new-outline': function() {
          return atom.workspace.open('outline-editor://new-outline');
        }
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'foldingtext:open-users-guide': function() {
          return require('shell').openExternal('http://jessegrosjean.gitbooks.io/foldingtext-for-atom-user-s-guide/content/');
        }
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'foldingtext:open-support-forum': function() {
          return require('shell').openExternal('http://support.foldingtext.com/c/foldingtext-for-atom');
        }
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'foldingtext:open-api-reference': function() {
          return require('shell').openExternal('http://www.foldingtext.com/foldingtext-for-atom/documentation/api-reference/');
        }
      }));
      this.subscriptions.add(foldingTextService.observeOutlineEditors((function(_this) {
        return function() {
          if (!_this.workspaceDisplayedEditor) {
            require('./extensions/ui/popovers');
            require('./extensions/priorities');
            require('./extensions/status');
            require('./extensions/tags');
            _this.addStatusBarItemsIfReady();
            return _this.workspaceDisplayedEditor = true;
          }
        };
      })(this)));
      this.subscriptions.add(atom.workspace.addOpener(function(uri, options) {
        if (uri === 'outline-editor://new-outline') {
          if (Outline == null) {
            Outline = require('./core/outline');
          }
          if (OutlineEditor == null) {
            OutlineEditor = require('./editor/outline-editor');
          }
          return Outline.getOutlineForPath(null, true).then(function(outline) {
            return new OutlineEditor(outline);
          });
        }
      }));
      this.subscriptions.add(atom.workspace.addOpener(function(uri, options) {
        if (ItemSerializer == null) {
          ItemSerializer = require('./core/item-serializer');
        }
        if (ItemSerializer.getMimeTypeForURI(uri)) {
          if (Outline == null) {
            Outline = require('./core/outline');
          }
          if (OutlineEditor == null) {
            OutlineEditor = require('./editor/outline-editor');
          }
          return Outline.getOutlineForPath(uri).then(function(outline) {
            if (outline) {
              return new OutlineEditor(outline, options);
            }
          });
        }
      }));
      this.subscriptions.add(atom.packages.onDidActivatePackage(function(pack) {
        var FoldingTextHelperPath, exec, lsregister, packagePath;
        if (pack.name === 'foldingtext-for-atom') {
          if (process.platform === 'darwin') {
            if (path == null) {
              path = require('path');
            }
            exec = require('child_process').exec;
            packagePath = atom.packages.getActivePackage('foldingtext-for-atom').path;
            FoldingTextHelperPath = path.join(packagePath, 'native', 'darwin', 'FoldingTextHelper.app');
            lsregister = '/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister';
            return exec(lsregister + " " + FoldingTextHelperPath);
          }
        }
      }));
      return this.subscriptions.add(this.monkeyPatchWorkspaceOpen());
    },
    monkeyPatchWorkspaceOpen: function() {
      var workspaceMonkeyOpen, workspaceOriginalOpen;
      workspaceOriginalOpen = atom.workspace.open;
      workspaceMonkeyOpen = function() {
        var args, error, openPromise, options, result, uri, urlObject;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        uri = args[0];
        options = args[1];
        try {
          if (uri) {
            if (url == null) {
              url = require('url');
            }
            urlObject = url.parse(uri, true);
            if (urlObject.protocol === 'file:') {
              if (ItemSerializer == null) {
                ItemSerializer = require('./core/item-serializer');
              }
              if (ItemSerializer.getMimeTypeForURI(urlObject.pathname)) {
                result = require('./core/url-util').getPathnameAndOptionsFromFileURL(urlObject);
                if (_ == null) {
                  _ = require('underscore-plus');
                }
                _.extend(result.options, options);
                args[0] = result.pathname;
                args[1] = options = result.options;
              }
            }
          }
        } catch (error1) {
          error = error1;
          console.log(error);
        }
        openPromise = workspaceOriginalOpen.apply(atom.workspace, args);
        if (openPromise != null) {
          if (typeof openPromise.then === "function") {
            openPromise.then(function(item) {
              return typeof item.updateOptionsAfterOpenOrReopen === "function" ? item.updateOptionsAfterOpenOrReopen(options) : void 0;
            });
          }
        }
        return openPromise;
      };
      atom.workspace.open = workspaceMonkeyOpen;
      return new Disposable(function() {
        if (atom.workspace.open === workspaceMonkeyOpen) {
          return atom.workspace.open = workspaceOriginalOpen;
        }
      });
    },
    consumeStatusBarService: function(statusBar) {
      this.statusBar = statusBar;
      this.statusBarDisposables = new CompositeDisposable();
      this.statusBarDisposables.add(new Disposable((function(_this) {
        return function() {
          _this.statusBar = null;
          _this.statusBarDisposables = null;
          return _this.statusBarAddedItems = false;
        };
      })(this)));
      this.addStatusBarItemsIfReady();
      this.subscriptions.add(this.statusBarDisposables);
      return this.statusBarDisposables;
    },
    addStatusBarItemsIfReady: function() {
      var LocationStatusBarItem, SearchStatusBarItem;
      if (this.statusBar && !this.statusBarAddedItems) {
        LocationStatusBarItem = require('./extensions/location-status-bar-item');
        SearchStatusBarItem = require('./extensions/search-status-bar-item');
        this.statusBarDisposables.add(LocationStatusBarItem.consumeStatusBarService(this.statusBar));
        this.statusBarDisposables.add(SearchStatusBarItem.consumeStatusBarService(this.statusBar));
        return this.statusBarAddedItems = true;
      }
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.statusBarAddedItems = false;
      return this.workspaceDisplayedEditor = false;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9mb2xkaW5ndGV4dC1mb3ItYXRvbS9saWIvZm9sZGluZ3RleHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUEsTUFBQSxpSEFBQTtJQUFBOztFQUFBLE1BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsMkJBQUQsRUFBYTs7RUFDYixrQkFBQSxHQUFxQixPQUFBLENBQVEsdUJBQVI7O0VBQ3JCLGNBQUEsR0FBaUI7O0VBQ2pCLGFBQUEsR0FBZ0I7O0VBQ2hCLE9BQUEsR0FBVTs7RUFDVixJQUFBLEdBQU87O0VBQ1AsR0FBQSxHQUFNOztFQUNOLENBQUEsR0FBSTs7RUFDSixDQUFBLEdBQUk7O0VBRUosSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUNFO0lBQUEsSUFBQSxFQUFNLDJCQUFOO0lBQ0EsV0FBQSxFQUFhLFNBQUMsSUFBRDtBQUNYLFVBQUE7O1FBRFksT0FBSzs7O1FBQ2pCLGdCQUFpQixPQUFBLENBQVEseUJBQVI7O01BQ2pCLE9BQUEsR0FBVSxPQUFBLENBQVEsZ0JBQVIsQ0FBeUIsQ0FBQyxxQkFBMUIsQ0FBZ0QsSUFBSSxDQUFDLFFBQXJEO2FBQ04sSUFBQSxhQUFBLENBQWMsT0FBZCxFQUF1QixJQUF2QjtJQUhPLENBRGI7R0FERjs7RUFPQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsYUFBQSxFQUFlLElBQWY7SUFDQSxTQUFBLEVBQVcsSUFEWDtJQUVBLG9CQUFBLEVBQXNCLElBRnRCO0lBR0EsbUJBQUEsRUFBcUIsS0FIckI7SUFJQSx3QkFBQSxFQUEwQixLQUoxQjtJQU1BLE1BQUEsRUFDRTtNQUFBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQURGO0tBUEY7SUFXQSx5QkFBQSxFQUEyQixTQUFBO2FBQ3pCO0lBRHlC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QUhnQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxDQUE5QjtNQUlBLElBQUMsQ0FBQSx3QkFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxvQkFBcEI7YUFDQSxJQUFDLENBQUE7SUFUc0IsQ0F0R3pCO0lBaUhBLHdCQUFBLEVBQTBCLFNBQUE7QUFDeEIsVUFBQTtNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUQsSUFBZSxDQUFJLElBQUMsQ0FBQSxtQkFBdkI7UUFDRSxxQkFBQSxHQUF3QixPQUFBLENBQVEsdUNBQVI7UUFDeEIsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHFDQUFSO1FBQ3RCLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxHQUF0QixDQUEwQixxQkFBcUIsQ0FBQyx1QkFBdEIsQ0FBOEMsSUFBQyxDQUFBLFNBQS9DLENBQTFCO1FBQ0EsSUFBQyxDQUFBLG9CQUFvQixDQUFDLEdBQXRCLENBQTBCLG1CQUFtQixDQUFDLHVCQUFwQixDQUE0QyxJQUFDLENBQUEsU0FBN0MsQ0FBMUI7ZUFDQSxJQUFDLENBQUEsbUJBQUQsR0FBdUIsS0FMekI7O0lBRHdCLENBakgxQjtJQXlIQSxVQUFBLEVBQVksU0FBQTtNQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO01BQ0EsSUFBQyxDQUFBLG1CQUFELEdBQXVCO2FBQ3ZCLElBQUMsQ0FBQSx3QkFBRCxHQUE0QjtJQUhsQixDQXpIWjs7QUFsQkYiLCJzb3VyY2VzQ29udGVudCI6WyIjIENvcHlyaWdodCAoYykgMjAxNSBKZXNzZSBHcm9zamVhbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxue0Rpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbmZvbGRpbmdUZXh0U2VydmljZSA9IHJlcXVpcmUgJy4vZm9sZGluZ3RleHQtc2VydmljZSdcbkl0ZW1TZXJpYWxpemVyID0gbnVsbFxuT3V0bGluZUVkaXRvciA9IG51bGxcbk91dGxpbmUgPSBudWxsXG5wYXRoID0gbnVsbFxudXJsID0gbnVsbFxuUSA9IG51bGxcbl8gPSBudWxsXG5cbmF0b20uZGVzZXJpYWxpemVycy5hZGRcbiAgbmFtZTogJ091dGxpbmVFZGl0b3JEZXNlcmlhbGl6ZXInXG4gIGRlc2VyaWFsaXplOiAoZGF0YT17fSkgLT5cbiAgICBPdXRsaW5lRWRpdG9yID89IHJlcXVpcmUoJy4vZWRpdG9yL291dGxpbmUtZWRpdG9yJylcbiAgICBvdXRsaW5lID0gcmVxdWlyZSgnLi9jb3JlL291dGxpbmUnKS5nZXRPdXRsaW5lRm9yUGF0aFN5bmMoZGF0YS5maWxlUGF0aClcbiAgICBuZXcgT3V0bGluZUVkaXRvcihvdXRsaW5lLCBkYXRhKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgc3RhdHVzQmFyOiBudWxsXG4gIHN0YXR1c0JhckRpc3Bvc2FibGVzOiBudWxsXG4gIHN0YXR1c0JhckFkZGVkSXRlbXM6IGZhbHNlXG4gIHdvcmtzcGFjZURpc3BsYXllZEVkaXRvcjogZmFsc2VcblxuICBjb25maWc6XG4gICAgZGlzYWJsZUFuaW1hdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcblxuICBwcm92aWRlRm9sZGluZ1RleHRTZXJ2aWNlOiAtPlxuICAgIGZvbGRpbmdUZXh0U2VydmljZVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdvdXRsaW5lLWVkaXRvcjpuZXctb3V0bGluZSc6IC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdvdXRsaW5lLWVkaXRvcjovL25ldy1vdXRsaW5lJylcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2ZvbGRpbmd0ZXh0Om9wZW4tdXNlcnMtZ3VpZGUnOiAtPlxuICAgICAgcmVxdWlyZSgnc2hlbGwnKS5vcGVuRXh0ZXJuYWwoJ2h0dHA6Ly9qZXNzZWdyb3NqZWFuLmdpdGJvb2tzLmlvL2ZvbGRpbmd0ZXh0LWZvci1hdG9tLXVzZXItcy1ndWlkZS9jb250ZW50LycpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdmb2xkaW5ndGV4dDpvcGVuLXN1cHBvcnQtZm9ydW0nOiAtPlxuICAgICAgcmVxdWlyZSgnc2hlbGwnKS5vcGVuRXh0ZXJuYWwoJ2h0dHA6Ly9zdXBwb3J0LmZvbGRpbmd0ZXh0LmNvbS9jL2ZvbGRpbmd0ZXh0LWZvci1hdG9tJylcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2ZvbGRpbmd0ZXh0Om9wZW4tYXBpLXJlZmVyZW5jZSc6IC0+XG4gICAgICByZXF1aXJlKCdzaGVsbCcpLm9wZW5FeHRlcm5hbCgnaHR0cDovL3d3dy5mb2xkaW5ndGV4dC5jb20vZm9sZGluZ3RleHQtZm9yLWF0b20vZG9jdW1lbnRhdGlvbi9hcGktcmVmZXJlbmNlLycpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZm9sZGluZ1RleHRTZXJ2aWNlLm9ic2VydmVPdXRsaW5lRWRpdG9ycyA9PlxuICAgICAgdW5sZXNzIEB3b3Jrc3BhY2VEaXNwbGF5ZWRFZGl0b3JcbiAgICAgICAgcmVxdWlyZSAnLi9leHRlbnNpb25zL3VpL3BvcG92ZXJzJ1xuICAgICAgICAjcmVxdWlyZSAnLi9leHRlbnNpb25zL2VkaXQtbGluay1wb3BvdmVyJ1xuICAgICAgICByZXF1aXJlICcuL2V4dGVuc2lvbnMvcHJpb3JpdGllcydcbiAgICAgICAgcmVxdWlyZSAnLi9leHRlbnNpb25zL3N0YXR1cydcbiAgICAgICAgcmVxdWlyZSAnLi9leHRlbnNpb25zL3RhZ3MnXG4gICAgICAgIEBhZGRTdGF0dXNCYXJJdGVtc0lmUmVhZHkoKVxuICAgICAgICBAd29ya3NwYWNlRGlzcGxheWVkRWRpdG9yID0gdHJ1ZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lciAodXJpLCBvcHRpb25zKSAtPlxuICAgICAgaWYgdXJpIGlzICdvdXRsaW5lLWVkaXRvcjovL25ldy1vdXRsaW5lJ1xuICAgICAgICBPdXRsaW5lID89IHJlcXVpcmUoJy4vY29yZS9vdXRsaW5lJylcbiAgICAgICAgT3V0bGluZUVkaXRvciA/PSByZXF1aXJlKCcuL2VkaXRvci9vdXRsaW5lLWVkaXRvcicpXG4gICAgICAgIE91dGxpbmUuZ2V0T3V0bGluZUZvclBhdGgobnVsbCwgdHJ1ZSkudGhlbiAob3V0bGluZSkgLT5cbiAgICAgICAgICBuZXcgT3V0bGluZUVkaXRvcihvdXRsaW5lKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lciAodXJpLCBvcHRpb25zKSAtPlxuICAgICAgSXRlbVNlcmlhbGl6ZXIgPz0gcmVxdWlyZSgnLi9jb3JlL2l0ZW0tc2VyaWFsaXplcicpXG4gICAgICBpZiBJdGVtU2VyaWFsaXplci5nZXRNaW1lVHlwZUZvclVSSSh1cmkpXG4gICAgICAgIE91dGxpbmUgPz0gcmVxdWlyZSgnLi9jb3JlL291dGxpbmUnKVxuICAgICAgICBPdXRsaW5lRWRpdG9yID89IHJlcXVpcmUoJy4vZWRpdG9yL291dGxpbmUtZWRpdG9yJylcbiAgICAgICAgT3V0bGluZS5nZXRPdXRsaW5lRm9yUGF0aCh1cmkpLnRoZW4gKG91dGxpbmUpIC0+XG4gICAgICAgICAgaWYgb3V0bGluZVxuICAgICAgICAgICAgbmV3IE91dGxpbmVFZGl0b3Iob3V0bGluZSwgb3B0aW9ucylcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVQYWNrYWdlIChwYWNrKSAtPlxuICAgICAgaWYgcGFjay5uYW1lIGlzICdmb2xkaW5ndGV4dC1mb3ItYXRvbSdcbiAgICAgICAgaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnZGFyd2luJ1xuICAgICAgICAgIHBhdGggPz0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAgICAgZXhlYyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXG4gICAgICAgICAgcGFja2FnZVBhdGggPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoJ2ZvbGRpbmd0ZXh0LWZvci1hdG9tJykucGF0aFxuICAgICAgICAgIEZvbGRpbmdUZXh0SGVscGVyUGF0aCA9IHBhdGguam9pbihwYWNrYWdlUGF0aCwgJ25hdGl2ZScsICdkYXJ3aW4nLCAnRm9sZGluZ1RleHRIZWxwZXIuYXBwJylcbiAgICAgICAgICBsc3JlZ2lzdGVyID0gJy9TeXN0ZW0vTGlicmFyeS9GcmFtZXdvcmtzL0NvcmVTZXJ2aWNlcy5mcmFtZXdvcmsvRnJhbWV3b3Jrcy9MYXVuY2hTZXJ2aWNlcy5mcmFtZXdvcmsvU3VwcG9ydC9sc3JlZ2lzdGVyJ1xuICAgICAgICAgIGV4ZWMgXCIje2xzcmVnaXN0ZXJ9ICN7Rm9sZGluZ1RleHRIZWxwZXJQYXRofVwiXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQG1vbmtleVBhdGNoV29ya3NwYWNlT3BlbigpXG5cbiAgbW9ua2V5UGF0Y2hXb3Jrc3BhY2VPcGVuOiAtPlxuICAgICMgUGF0Y2hlZCBmb3IgdHdvIHB1cnBvc2VzLiBGaXJzdCBzdHJpcCBvZmYgVVJMIHBhcmFtcyBhbmQgbW92ZSB0aGVtIHRvXG4gICAgIyBvcHRpb25zLiBTZWNvbmQgY2FsbCB1cGRhdGVPcHRpb25zQWZ0ZXJPcGVuT3JSZW9wZW4gc28gaXRlbSBnZXRzIG9wdGlvbnNcbiAgICAjIGFueXRpbWUgaXQgaXMgb3BlbmVkLCBub3QganVzdCB0aGUgZmlyc3QgdGltZS4gVGhpcyBwYXRjaCBvbmx5IGVmZmVjdHNcbiAgICAjIGZpbGU6Ly8gdXJscyB3aGVyZSB0aGVyZSBpcyBhbiBvdXRsaW5lIG1pbWUgdHlwZSBkZWZpbmVkIGZvciB0aGUgdXJsXG4gICAgIyBwYXRobmFtZS5cbiAgICB3b3Jrc3BhY2VPcmlnaW5hbE9wZW4gPSBhdG9tLndvcmtzcGFjZS5vcGVuXG4gICAgd29ya3NwYWNlTW9ua2V5T3BlbiA9IChhcmdzLi4uKSAtPlxuICAgICAgdXJpID0gYXJnc1swXVxuICAgICAgb3B0aW9ucyA9IGFyZ3NbMV1cblxuICAgICAgdHJ5XG4gICAgICAgIGlmIHVyaVxuICAgICAgICAgIHVybCA/PSByZXF1aXJlKCd1cmwnKVxuICAgICAgICAgIHVybE9iamVjdCA9IHVybC5wYXJzZSh1cmksIHRydWUpXG4gICAgICAgICAgIyBPbmx5IG1lc3Mgd2l0aCBmaWxlIFVSTHNcbiAgICAgICAgICBpZiB1cmxPYmplY3QucHJvdG9jb2wgaXMgJ2ZpbGU6J1xuICAgICAgICAgICAgSXRlbVNlcmlhbGl6ZXIgPz0gcmVxdWlyZSgnLi9jb3JlL2l0ZW0tc2VyaWFsaXplcicpXG4gICAgICAgICAgICAjIE9ubHkgbWVzcyB3aXRoIGZpbGUgVVJMcyB0aGF0IGhhdmUgb3V0bGluZSBtaW1lIHR5cGVcbiAgICAgICAgICAgIGlmIEl0ZW1TZXJpYWxpemVyLmdldE1pbWVUeXBlRm9yVVJJKHVybE9iamVjdC5wYXRobmFtZSlcbiAgICAgICAgICAgICAgcmVzdWx0ID0gcmVxdWlyZSgnLi9jb3JlL3VybC11dGlsJykuZ2V0UGF0aG5hbWVBbmRPcHRpb25zRnJvbUZpbGVVUkwodXJsT2JqZWN0KVxuICAgICAgICAgICAgICBfID89IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbiAgICAgICAgICAgICAgXy5leHRlbmQocmVzdWx0Lm9wdGlvbnMsIG9wdGlvbnMpXG4gICAgICAgICAgICAgIGFyZ3NbMF0gPSByZXN1bHQucGF0aG5hbWVcbiAgICAgICAgICAgICAgYXJnc1sxXSA9IG9wdGlvbnMgPSByZXN1bHQub3B0aW9uc1xuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgY29uc29sZS5sb2cgZXJyb3JcblxuICAgICAgb3BlblByb21pc2UgPSB3b3Jrc3BhY2VPcmlnaW5hbE9wZW4uYXBwbHkoYXRvbS53b3Jrc3BhY2UsIGFyZ3MpXG4gICAgICBvcGVuUHJvbWlzZT8udGhlbj8gKGl0ZW0pIC0+XG4gICAgICAgIGl0ZW0udXBkYXRlT3B0aW9uc0FmdGVyT3Blbk9yUmVvcGVuPyhvcHRpb25zKVxuICAgICAgb3BlblByb21pc2VcblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4gPSB3b3Jrc3BhY2VNb25rZXlPcGVuXG4gICAgbmV3IERpc3Bvc2FibGUgLT5cbiAgICAgIGlmIGF0b20ud29ya3NwYWNlLm9wZW4gaXMgd29ya3NwYWNlTW9ua2V5T3BlblxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuID0gd29ya3NwYWNlT3JpZ2luYWxPcGVuXG5cbiAgY29uc3VtZVN0YXR1c0JhclNlcnZpY2U6IChzdGF0dXNCYXIpIC0+XG4gICAgQHN0YXR1c0JhciA9IHN0YXR1c0JhclxuICAgIEBzdGF0dXNCYXJEaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBAc3RhdHVzQmFyRGlzcG9zYWJsZXMuYWRkIG5ldyBEaXNwb3NhYmxlID0+XG4gICAgICBAc3RhdHVzQmFyID0gbnVsbFxuICAgICAgQHN0YXR1c0JhckRpc3Bvc2FibGVzID0gbnVsbFxuICAgICAgQHN0YXR1c0JhckFkZGVkSXRlbXMgPSBmYWxzZVxuICAgIEBhZGRTdGF0dXNCYXJJdGVtc0lmUmVhZHkoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAc3RhdHVzQmFyRGlzcG9zYWJsZXNcbiAgICBAc3RhdHVzQmFyRGlzcG9zYWJsZXNcblxuICBhZGRTdGF0dXNCYXJJdGVtc0lmUmVhZHk6IC0+XG4gICAgaWYgQHN0YXR1c0JhciBhbmQgbm90IEBzdGF0dXNCYXJBZGRlZEl0ZW1zXG4gICAgICBMb2NhdGlvblN0YXR1c0Jhckl0ZW0gPSByZXF1aXJlICcuL2V4dGVuc2lvbnMvbG9jYXRpb24tc3RhdHVzLWJhci1pdGVtJ1xuICAgICAgU2VhcmNoU3RhdHVzQmFySXRlbSA9IHJlcXVpcmUgJy4vZXh0ZW5zaW9ucy9zZWFyY2gtc3RhdHVzLWJhci1pdGVtJ1xuICAgICAgQHN0YXR1c0JhckRpc3Bvc2FibGVzLmFkZCBMb2NhdGlvblN0YXR1c0Jhckl0ZW0uY29uc3VtZVN0YXR1c0JhclNlcnZpY2UoQHN0YXR1c0JhcilcbiAgICAgIEBzdGF0dXNCYXJEaXNwb3NhYmxlcy5hZGQgU2VhcmNoU3RhdHVzQmFySXRlbS5jb25zdW1lU3RhdHVzQmFyU2VydmljZShAc3RhdHVzQmFyKVxuICAgICAgQHN0YXR1c0JhckFkZGVkSXRlbXMgPSB0cnVlXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAc3RhdHVzQmFyQWRkZWRJdGVtcyA9IGZhbHNlXG4gICAgQHdvcmtzcGFjZURpc3BsYXllZEVkaXRvciA9IGZhbHNlXG4iXX0=
