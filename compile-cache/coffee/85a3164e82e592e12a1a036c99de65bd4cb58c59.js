(function() {
  var CompositeDisposable, ScrollView, ShowTodoView, TextBuffer, TextEditorView, TodoOptions, TodoTable, deprecatedTextEditor, fs, path, ref, ref1,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, TextBuffer = ref.TextBuffer;

  ref1 = require('atom-space-pen-views'), ScrollView = ref1.ScrollView, TextEditorView = ref1.TextEditorView;

  path = require('path');

  fs = require('fs-plus');

  TodoTable = require('./todo-table-view');

  TodoOptions = require('./todo-options-view');

  deprecatedTextEditor = function(params) {
    var TextEditor;
    if (atom.workspace.buildTextEditor != null) {
      return atom.workspace.buildTextEditor(params);
    } else {
      TextEditor = require('atom').TextEditor;
      return new TextEditor(params);
    }
  };

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    ShowTodoView.content = function(collection, filterBuffer) {
      var filterEditor;
      filterEditor = deprecatedTextEditor({
        mini: true,
        tabLength: 2,
        softTabs: true,
        softWrapped: false,
        buffer: filterBuffer,
        placeholderText: 'Search Todos'
      });
      return this.div({
        "class": 'show-todo-preview',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'input-block'
          }, function() {
            _this.div({
              "class": 'input-block-item input-block-item--flex'
            }, function() {
              return _this.subview('filterEditorView', new TextEditorView({
                editor: filterEditor
              }));
            });
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.div({
                "class": 'btn-group'
              }, function() {
                _this.button({
                  outlet: 'scopeButton',
                  "class": 'btn'
                });
                _this.button({
                  outlet: 'optionsButton',
                  "class": 'btn icon-gear'
                });
                _this.button({
                  outlet: 'saveAsButton',
                  "class": 'btn icon-cloud-download'
                });
                return _this.button({
                  outlet: 'refreshButton',
                  "class": 'btn icon-sync'
                });
              });
            });
          });
          _this.div({
            "class": 'input-block todo-info-block'
          }, function() {
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.span({
                outlet: 'todoInfo'
              });
            });
          });
          _this.div({
            outlet: 'optionsView'
          });
          _this.div({
            outlet: 'todoLoading',
            "class": 'todo-loading'
          }, function() {
            _this.div({
              "class": 'markdown-spinner'
            });
            return _this.h5({
              outlet: 'searchCount',
              "class": 'text-center'
            }, "Loading Todos...");
          });
          return _this.subview('todoTable', new TodoTable(collection));
        };
      })(this));
    };

    function ShowTodoView(collection1, uri) {
      this.collection = collection1;
      this.uri = uri;
      this.toggleOptions = bind(this.toggleOptions, this);
      this.setScopeButtonState = bind(this.setScopeButtonState, this);
      this.toggleSearchScope = bind(this.toggleSearchScope, this);
      this.saveAs = bind(this.saveAs, this);
      this.stopLoading = bind(this.stopLoading, this);
      this.startLoading = bind(this.startLoading, this);
      ShowTodoView.__super__.constructor.call(this, this.collection, this.filterBuffer = new TextBuffer);
    }

    ShowTodoView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      this.setScopeButtonState(this.collection.getSearchScope());
      this.onlySearchWhenVisible = true;
      this.notificationOptions = {
        detail: 'Atom todo-show package',
        dismissable: true,
        icon: this.getIconName()
      };
      this.checkDeprecation();
      this.disposables.add(atom.tooltips.add(this.scopeButton, {
        title: "What to Search"
      }));
      this.disposables.add(atom.tooltips.add(this.optionsButton, {
        title: "Show Todo Options"
      }));
      this.disposables.add(atom.tooltips.add(this.saveAsButton, {
        title: "Save Todos to File"
      }));
      return this.disposables.add(atom.tooltips.add(this.refreshButton, {
        title: "Refresh Todos"
      }));
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.disposables.add(atom.commands.add(this.element, {
        'core:save-as': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.saveAs();
          };
        })(this),
        'core:refresh': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.search();
          };
        })(this)
      }));
      this.disposables.add(this.collection.onDidStartSearch(this.startLoading));
      this.disposables.add(this.collection.onDidFinishSearch(this.stopLoading));
      this.disposables.add(this.collection.onDidFailSearch((function(_this) {
        return function(err) {
          _this.searchCount.text("Search Failed");
          if (err) {
            console.error(err);
          }
          if (err) {
            return _this.showError(err);
          }
        };
      })(this)));
      this.disposables.add(this.collection.onDidChangeSearchScope((function(_this) {
        return function(scope) {
          _this.setScopeButtonState(scope);
          return _this.search();
        };
      })(this)));
      this.disposables.add(this.collection.onDidSearchPaths((function(_this) {
        return function(nPaths) {
          return _this.searchCount.text(nPaths + " paths searched...");
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          if (_this.collection.setActiveProject(item != null ? typeof item.getPath === "function" ? item.getPath() : void 0 : void 0) || ((item != null ? item.constructor.name : void 0) === 'TextEditor' && _this.collection.scope === 'active')) {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidAddTextEditor((function(_this) {
        return function(arg) {
          var textEditor;
          textEditor = arg.textEditor;
          if (_this.collection.scope === 'open' && atom.config.get('todo-show.autoRefresh')) {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(arg) {
          var item;
          item = arg.item;
          if (_this.collection.scope === 'open' && atom.config.get('todo-show.autoRefresh')) {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.disposables.add(editor.onDidSave(function() {
            if (atom.config.get('todo-show.autoRefresh')) {
              return _this.search();
            }
          }));
        };
      })(this)));
      this.filterEditorView.getModel().onDidStopChanging((function(_this) {
        return function() {
          if (_this.firstTimeFilter) {
            _this.filter();
          }
          return _this.firstTimeFilter = true;
        };
      })(this));
      this.scopeButton.on('click', this.toggleSearchScope);
      this.optionsButton.on('click', this.toggleOptions);
      this.saveAsButton.on('click', this.saveAs);
      return this.refreshButton.on('click', (function(_this) {
        return function() {
          return _this.search();
        };
      })(this));
    };

    ShowTodoView.prototype.destroy = function() {
      this.collection.cancelSearch();
      this.disposables.dispose();
      return this.detach();
    };

    ShowTodoView.prototype.serialize = function() {
      return {
        deserializer: 'todo-show/todo-view',
        scope: this.collection.scope,
        customPath: this.collection.getCustomPath()
      };
    };

    ShowTodoView.prototype.getTitle = function() {
      return "Todo Show";
    };

    ShowTodoView.prototype.getIconName = function() {
      return "checklist";
    };

    ShowTodoView.prototype.getURI = function() {
      return this.uri;
    };

    ShowTodoView.prototype.getDefaultLocation = function() {
      return 'right';
    };

    ShowTodoView.prototype.getAllowedLocations = function() {
      return ['left', 'right', 'bottom'];
    };

    ShowTodoView.prototype.getProjectName = function() {
      return this.collection.getActiveProjectName();
    };

    ShowTodoView.prototype.getProjectPath = function() {
      return this.collection.getActiveProject();
    };

    ShowTodoView.prototype.getTodos = function() {
      return this.collection.getTodos();
    };

    ShowTodoView.prototype.getTodosCount = function() {
      return this.collection.getTodosCount();
    };

    ShowTodoView.prototype.isSearching = function() {
      return this.collection.getState();
    };

    ShowTodoView.prototype.search = function() {
      var ref2;
      if (this.onlySearchWhenVisible) {
        if (!((ref2 = atom.workspace.paneContainerForItem(this)) != null ? ref2.isVisible() : void 0)) {
          return;
        }
      }
      return this.collection.search();
    };

    ShowTodoView.prototype.startLoading = function() {
      this.todoLoading.show();
      return this.updateInfo();
    };

    ShowTodoView.prototype.stopLoading = function() {
      this.todoLoading.hide();
      return this.updateInfo();
    };

    ShowTodoView.prototype.updateInfo = function() {
      return this.todoInfo.html((this.getInfoText()) + " " + (this.getScopeText()));
    };

    ShowTodoView.prototype.getInfoText = function() {
      var count;
      if (this.isSearching()) {
        return "Found ... results";
      }
      switch (count = this.getTodosCount()) {
        case 1:
          return "Found " + count + " result";
        default:
          return "Found " + count + " results";
      }
    };

    ShowTodoView.prototype.getScopeText = function() {
      switch (this.collection.scope) {
        case 'active':
          return "in active file";
        case 'open':
          return "in open files";
        case 'project':
          return "in project <code>" + (this.getProjectName()) + "</code>";
        case 'custom':
          return "in <code>" + this.collection.customPath + "</code>";
        default:
          return "in workspace";
      }
    };

    ShowTodoView.prototype.showError = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addError(message.toString(), this.notificationOptions);
    };

    ShowTodoView.prototype.showWarning = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addWarning(message.toString(), this.notificationOptions);
    };

    ShowTodoView.prototype.saveAs = function() {
      var filePath, outputFilePath, projectPath;
      if (this.isSearching()) {
        return;
      }
      filePath = (this.getProjectName() || 'todos') + ".md";
      if (projectPath = this.getProjectPath()) {
        filePath = path.join(projectPath, filePath);
      }
      if (outputFilePath = atom.showSaveDialogSync(filePath.toLowerCase())) {
        fs.writeFileSync(outputFilePath, this.collection.getMarkdown());
        return atom.workspace.open(outputFilePath);
      }
    };

    ShowTodoView.prototype.toggleSearchScope = function() {
      var scope;
      scope = this.collection.toggleSearchScope();
      return this.setScopeButtonState(scope);
    };

    ShowTodoView.prototype.setScopeButtonState = function(state) {
      switch (state) {
        case 'project':
          return this.scopeButton.text('Project');
        case 'open':
          return this.scopeButton.text('Open Files');
        case 'active':
          return this.scopeButton.text('Active File');
        case 'custom':
          return this.scopeButton.text('Custom');
        default:
          return this.scopeButton.text('Workspace');
      }
    };

    ShowTodoView.prototype.toggleOptions = function() {
      if (!this.todoOptions) {
        this.optionsView.hide();
        this.todoOptions = new TodoOptions(this.collection);
        this.optionsView.html(this.todoOptions);
      }
      return this.optionsView.slideToggle();
    };

    ShowTodoView.prototype.filter = function() {
      return this.collection.filterTodos(this.filterBuffer.getText());
    };

    ShowTodoView.prototype.checkDeprecation = function() {
      if (atom.config.get('todo-show.findTheseRegexes')) {
        return this.showWarning('Deprecation Warning:\n\n`findTheseRegexes` config is deprecated, please use `findTheseTodos` and `findUsingRegex` for custom behaviour.\nSee https://github.com/mrodalgaard/atom-todo-show#config for more information.');
      }
    };

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDRJQUFBO0lBQUE7Ozs7RUFBQSxNQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDZDQUFELEVBQXNCOztFQUN0QixPQUErQixPQUFBLENBQVEsc0JBQVIsQ0FBL0IsRUFBQyw0QkFBRCxFQUFhOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBRUwsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUjs7RUFDWixXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSOztFQUVkLG9CQUFBLEdBQXVCLFNBQUMsTUFBRDtBQUNyQixRQUFBO0lBQUEsSUFBRyxzQ0FBSDthQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUErQixNQUEvQixFQURGO0tBQUEsTUFBQTtNQUdFLFVBQUEsR0FBYSxPQUFBLENBQVEsTUFBUixDQUFlLENBQUM7YUFDekIsSUFBQSxVQUFBLENBQVcsTUFBWCxFQUpOOztFQURxQjs7RUFPdkIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ0osWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLFVBQUQsRUFBYSxZQUFiO0FBQ1IsVUFBQTtNQUFBLFlBQUEsR0FBZSxvQkFBQSxDQUNiO1FBQUEsSUFBQSxFQUFNLElBQU47UUFDQSxTQUFBLEVBQVcsQ0FEWDtRQUVBLFFBQUEsRUFBVSxJQUZWO1FBR0EsV0FBQSxFQUFhLEtBSGI7UUFJQSxNQUFBLEVBQVEsWUFKUjtRQUtBLGVBQUEsRUFBaUIsY0FMakI7T0FEYTthQVNmLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG1CQUFQO1FBQTRCLFFBQUEsRUFBVSxDQUFD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YixDQUFrQixTQUFsQjtBQUR0QixhQUVPLE1BRlA7aUJBRW1CLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixZQUFsQjtBQUZuQixhQUdPLFFBSFA7aUJBR3FCLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixhQUFsQjtBQUhyQixhQUlPLFFBSlA7aUJBSXFCLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixRQUFsQjtBQUpyQjtpQkFLTyxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsV0FBbEI7QUFMUDtJQURtQjs7MkJBUXJCLGFBQUEsR0FBZSxTQUFBO01BQ2IsSUFBQSxDQUFPLElBQUMsQ0FBQSxXQUFSO1FBQ0UsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQUE7UUFDQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLFdBQUEsQ0FBWSxJQUFDLENBQUEsVUFBYjtRQUNuQixJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsSUFBQyxDQUFBLFdBQW5CLEVBSEY7O2FBSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxXQUFiLENBQUE7SUFMYTs7MkJBT2YsTUFBQSxHQUFRLFNBQUE7YUFDTixJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBd0IsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsQ0FBeEI7SUFETTs7MkJBR1IsZ0JBQUEsR0FBa0IsU0FBQTtNQUNoQixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsQ0FBSDtlQUNFLElBQUMsQ0FBQSxXQUFELENBQWEseU5BQWIsRUFERjs7SUFEZ0I7Ozs7S0F6TU87QUFoQjNCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGUsIFRleHRCdWZmZXJ9ID0gcmVxdWlyZSAnYXRvbSdcbntTY3JvbGxWaWV3LCBUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuXG5Ub2RvVGFibGUgPSByZXF1aXJlICcuL3RvZG8tdGFibGUtdmlldydcblRvZG9PcHRpb25zID0gcmVxdWlyZSAnLi90b2RvLW9wdGlvbnMtdmlldydcblxuZGVwcmVjYXRlZFRleHRFZGl0b3IgPSAocGFyYW1zKSAtPlxuICBpZiBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3I/XG4gICAgYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHBhcmFtcylcbiAgZWxzZVxuICAgIFRleHRFZGl0b3IgPSByZXF1aXJlKCdhdG9tJykuVGV4dEVkaXRvclxuICAgIG5ldyBUZXh0RWRpdG9yKHBhcmFtcylcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU2hvd1RvZG9WaWV3IGV4dGVuZHMgU2Nyb2xsVmlld1xuICBAY29udGVudDogKGNvbGxlY3Rpb24sIGZpbHRlckJ1ZmZlcikgLT5cbiAgICBmaWx0ZXJFZGl0b3IgPSBkZXByZWNhdGVkVGV4dEVkaXRvcihcbiAgICAgIG1pbmk6IHRydWVcbiAgICAgIHRhYkxlbmd0aDogMlxuICAgICAgc29mdFRhYnM6IHRydWVcbiAgICAgIHNvZnRXcmFwcGVkOiBmYWxzZVxuICAgICAgYnVmZmVyOiBmaWx0ZXJCdWZmZXJcbiAgICAgIHBsYWNlaG9sZGVyVGV4dDogJ1NlYXJjaCBUb2RvcydcbiAgICApXG5cbiAgICBAZGl2IGNsYXNzOiAnc2hvdy10b2RvLXByZXZpZXcnLCB0YWJpbmRleDogLTEsID0+XG4gICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2snLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2staXRlbSBpbnB1dC1ibG9jay1pdGVtLS1mbGV4JywgPT5cbiAgICAgICAgICBAc3VidmlldyAnZmlsdGVyRWRpdG9yVmlldycsIG5ldyBUZXh0RWRpdG9yVmlldyhlZGl0b3I6IGZpbHRlckVkaXRvcilcbiAgICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrLWl0ZW0nLCA9PlxuICAgICAgICAgIEBkaXYgY2xhc3M6ICdidG4tZ3JvdXAnLCA9PlxuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdzY29wZUJ1dHRvbicsIGNsYXNzOiAnYnRuJ1xuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdvcHRpb25zQnV0dG9uJywgY2xhc3M6ICdidG4gaWNvbi1nZWFyJ1xuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdzYXZlQXNCdXR0b24nLCBjbGFzczogJ2J0biBpY29uLWNsb3VkLWRvd25sb2FkJ1xuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdyZWZyZXNoQnV0dG9uJywgY2xhc3M6ICdidG4gaWNvbi1zeW5jJ1xuXG4gICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2sgdG9kby1pbmZvLWJsb2NrJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrLWl0ZW0nLCA9PlxuICAgICAgICAgIEBzcGFuIG91dGxldDogJ3RvZG9JbmZvJ1xuXG4gICAgICBAZGl2IG91dGxldDogJ29wdGlvbnNWaWV3J1xuXG4gICAgICBAZGl2IG91dGxldDogJ3RvZG9Mb2FkaW5nJywgY2xhc3M6ICd0b2RvLWxvYWRpbmcnLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnbWFya2Rvd24tc3Bpbm5lcidcbiAgICAgICAgQGg1IG91dGxldDogJ3NlYXJjaENvdW50JywgY2xhc3M6ICd0ZXh0LWNlbnRlcicsIFwiTG9hZGluZyBUb2Rvcy4uLlwiXG5cbiAgICAgIEBzdWJ2aWV3ICd0b2RvVGFibGUnLCBuZXcgVG9kb1RhYmxlKGNvbGxlY3Rpb24pXG5cbiAgY29uc3RydWN0b3I6IChAY29sbGVjdGlvbiwgQHVyaSkgLT5cbiAgICBzdXBlciBAY29sbGVjdGlvbiwgQGZpbHRlckJ1ZmZlciA9IG5ldyBUZXh0QnVmZmVyXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBoYW5kbGVFdmVudHMoKVxuICAgIEBzZXRTY29wZUJ1dHRvblN0YXRlKEBjb2xsZWN0aW9uLmdldFNlYXJjaFNjb3BlKCkpXG5cbiAgICBAb25seVNlYXJjaFdoZW5WaXNpYmxlID0gdHJ1ZVxuICAgIEBub3RpZmljYXRpb25PcHRpb25zID1cbiAgICAgIGRldGFpbDogJ0F0b20gdG9kby1zaG93IHBhY2thZ2UnXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgaWNvbjogQGdldEljb25OYW1lKClcblxuICAgIEBjaGVja0RlcHJlY2F0aW9uKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQHNjb3BlQnV0dG9uLCB0aXRsZTogXCJXaGF0IHRvIFNlYXJjaFwiXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAb3B0aW9uc0J1dHRvbiwgdGl0bGU6IFwiU2hvdyBUb2RvIE9wdGlvbnNcIlxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQHNhdmVBc0J1dHRvbiwgdGl0bGU6IFwiU2F2ZSBUb2RvcyB0byBGaWxlXCJcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20udG9vbHRpcHMuYWRkIEByZWZyZXNoQnV0dG9uLCB0aXRsZTogXCJSZWZyZXNoIFRvZG9zXCJcblxuICBoYW5kbGVFdmVudHM6IC0+XG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBAZWxlbWVudCxcbiAgICAgICdjb3JlOnNhdmUtYXMnOiAoZXZlbnQpID0+XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIEBzYXZlQXMoKVxuICAgICAgJ2NvcmU6cmVmcmVzaCc6IChldmVudCkgPT5cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgQHNlYXJjaCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkU3RhcnRTZWFyY2ggQHN0YXJ0TG9hZGluZ1xuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRGaW5pc2hTZWFyY2ggQHN0b3BMb2FkaW5nXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZEZhaWxTZWFyY2ggKGVycikgPT5cbiAgICAgIEBzZWFyY2hDb3VudC50ZXh0IFwiU2VhcmNoIEZhaWxlZFwiXG4gICAgICBjb25zb2xlLmVycm9yIGVyciBpZiBlcnJcbiAgICAgIEBzaG93RXJyb3IgZXJyIGlmIGVyclxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZENoYW5nZVNlYXJjaFNjb3BlIChzY29wZSkgPT5cbiAgICAgIEBzZXRTY29wZUJ1dHRvblN0YXRlKHNjb3BlKVxuICAgICAgQHNlYXJjaCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkU2VhcmNoUGF0aHMgKG5QYXRocykgPT5cbiAgICAgIEBzZWFyY2hDb3VudC50ZXh0IFwiI3tuUGF0aHN9IHBhdGhzIHNlYXJjaGVkLi4uXCJcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoaXRlbSkgPT5cbiAgICAgIGlmIEBjb2xsZWN0aW9uLnNldEFjdGl2ZVByb2plY3QoaXRlbT8uZ2V0UGF0aD8oKSkgb3JcbiAgICAgIChpdGVtPy5jb25zdHJ1Y3Rvci5uYW1lIGlzICdUZXh0RWRpdG9yJyBhbmQgQGNvbGxlY3Rpb24uc2NvcGUgaXMgJ2FjdGl2ZScpXG4gICAgICAgIEBzZWFyY2goKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZEFkZFRleHRFZGl0b3IgKHt0ZXh0RWRpdG9yfSkgPT5cbiAgICAgIGlmIEBjb2xsZWN0aW9uLnNjb3BlIGlzICdvcGVuJyBhbmQgYXRvbS5jb25maWcuZ2V0ICd0b2RvLXNob3cuYXV0b1JlZnJlc2gnXG4gICAgICAgIEBzZWFyY2goKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZERlc3Ryb3lQYW5lSXRlbSAoe2l0ZW19KSA9PlxuICAgICAgaWYgQGNvbGxlY3Rpb24uc2NvcGUgaXMgJ29wZW4nIGFuZCBhdG9tLmNvbmZpZy5nZXQgJ3RvZG8tc2hvdy5hdXRvUmVmcmVzaCdcbiAgICAgICAgQHNlYXJjaCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgQGRpc3Bvc2FibGVzLmFkZCBlZGl0b3Iub25EaWRTYXZlID0+XG4gICAgICAgIEBzZWFyY2goKSBpZiBhdG9tLmNvbmZpZy5nZXQgJ3RvZG8tc2hvdy5hdXRvUmVmcmVzaCdcblxuICAgIEBmaWx0ZXJFZGl0b3JWaWV3LmdldE1vZGVsKCkub25EaWRTdG9wQ2hhbmdpbmcgPT5cbiAgICAgIEBmaWx0ZXIoKSBpZiBAZmlyc3RUaW1lRmlsdGVyXG4gICAgICBAZmlyc3RUaW1lRmlsdGVyID0gdHJ1ZVxuXG4gICAgQHNjb3BlQnV0dG9uLm9uICdjbGljaycsIEB0b2dnbGVTZWFyY2hTY29wZVxuICAgIEBvcHRpb25zQnV0dG9uLm9uICdjbGljaycsIEB0b2dnbGVPcHRpb25zXG4gICAgQHNhdmVBc0J1dHRvbi5vbiAnY2xpY2snLCBAc2F2ZUFzXG4gICAgQHJlZnJlc2hCdXR0b24ub24gJ2NsaWNrJywgPT4gQHNlYXJjaCgpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAY29sbGVjdGlvbi5jYW5jZWxTZWFyY2goKVxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICBAZGV0YWNoKClcblxuICBzZXJpYWxpemU6IC0+XG4gICAgZGVzZXJpYWxpemVyOiAndG9kby1zaG93L3RvZG8tdmlldydcbiAgICBzY29wZTogQGNvbGxlY3Rpb24uc2NvcGVcbiAgICBjdXN0b21QYXRoOiBAY29sbGVjdGlvbi5nZXRDdXN0b21QYXRoKClcblxuICBnZXRUaXRsZTogLT4gXCJUb2RvIFNob3dcIlxuICBnZXRJY29uTmFtZTogLT4gXCJjaGVja2xpc3RcIlxuICBnZXRVUkk6IC0+IEB1cmlcbiAgZ2V0RGVmYXVsdExvY2F0aW9uOiAtPiAncmlnaHQnXG4gIGdldEFsbG93ZWRMb2NhdGlvbnM6IC0+IFsnbGVmdCcsICdyaWdodCcsICdib3R0b20nXVxuICBnZXRQcm9qZWN0TmFtZTogLT4gQGNvbGxlY3Rpb24uZ2V0QWN0aXZlUHJvamVjdE5hbWUoKVxuICBnZXRQcm9qZWN0UGF0aDogLT4gQGNvbGxlY3Rpb24uZ2V0QWN0aXZlUHJvamVjdCgpXG5cbiAgZ2V0VG9kb3M6IC0+IEBjb2xsZWN0aW9uLmdldFRvZG9zKClcbiAgZ2V0VG9kb3NDb3VudDogLT4gQGNvbGxlY3Rpb24uZ2V0VG9kb3NDb3VudCgpXG4gIGlzU2VhcmNoaW5nOiAtPiBAY29sbGVjdGlvbi5nZXRTdGF0ZSgpXG4gIHNlYXJjaDogLT5cbiAgICBpZiBAb25seVNlYXJjaFdoZW5WaXNpYmxlXG4gICAgICByZXR1cm4gdW5sZXNzIGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JJdGVtKHRoaXMpPy5pc1Zpc2libGUoKVxuICAgIEBjb2xsZWN0aW9uLnNlYXJjaCgpXG5cbiAgc3RhcnRMb2FkaW5nOiA9PlxuICAgIEB0b2RvTG9hZGluZy5zaG93KClcbiAgICBAdXBkYXRlSW5mbygpXG5cbiAgc3RvcExvYWRpbmc6ID0+XG4gICAgQHRvZG9Mb2FkaW5nLmhpZGUoKVxuICAgIEB1cGRhdGVJbmZvKClcblxuICB1cGRhdGVJbmZvOiAtPlxuICAgIEB0b2RvSW5mby5odG1sKFwiI3tAZ2V0SW5mb1RleHQoKX0gI3tAZ2V0U2NvcGVUZXh0KCl9XCIpXG5cbiAgZ2V0SW5mb1RleHQ6IC0+XG4gICAgcmV0dXJuIFwiRm91bmQgLi4uIHJlc3VsdHNcIiBpZiBAaXNTZWFyY2hpbmcoKVxuICAgIHN3aXRjaCBjb3VudCA9IEBnZXRUb2Rvc0NvdW50KClcbiAgICAgIHdoZW4gMSB0aGVuIFwiRm91bmQgI3tjb3VudH0gcmVzdWx0XCJcbiAgICAgIGVsc2UgXCJGb3VuZCAje2NvdW50fSByZXN1bHRzXCJcblxuICBnZXRTY29wZVRleHQ6IC0+XG4gICAgIyBUT0RPOiBBbHNvIHNob3cgbnVtYmVyIG9mIGZpbGVzXG5cbiAgICBzd2l0Y2ggQGNvbGxlY3Rpb24uc2NvcGVcbiAgICAgIHdoZW4gJ2FjdGl2ZSdcbiAgICAgICAgXCJpbiBhY3RpdmUgZmlsZVwiXG4gICAgICB3aGVuICdvcGVuJ1xuICAgICAgICBcImluIG9wZW4gZmlsZXNcIlxuICAgICAgd2hlbiAncHJvamVjdCdcbiAgICAgICAgXCJpbiBwcm9qZWN0IDxjb2RlPiN7QGdldFByb2plY3ROYW1lKCl9PC9jb2RlPlwiXG4gICAgICB3aGVuICdjdXN0b20nXG4gICAgICAgIFwiaW4gPGNvZGU+I3tAY29sbGVjdGlvbi5jdXN0b21QYXRofTwvY29kZT5cIlxuICAgICAgZWxzZVxuICAgICAgICBcImluIHdvcmtzcGFjZVwiXG5cbiAgc2hvd0Vycm9yOiAobWVzc2FnZSA9ICcnKSAtPlxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBtZXNzYWdlLnRvU3RyaW5nKCksIEBub3RpZmljYXRpb25PcHRpb25zXG5cbiAgc2hvd1dhcm5pbmc6IChtZXNzYWdlID0gJycpIC0+XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcgbWVzc2FnZS50b1N0cmluZygpLCBAbm90aWZpY2F0aW9uT3B0aW9uc1xuXG4gIHNhdmVBczogPT5cbiAgICByZXR1cm4gaWYgQGlzU2VhcmNoaW5nKClcblxuICAgIGZpbGVQYXRoID0gXCIje0BnZXRQcm9qZWN0TmFtZSgpIG9yICd0b2Rvcyd9Lm1kXCJcbiAgICBpZiBwcm9qZWN0UGF0aCA9IEBnZXRQcm9qZWN0UGF0aCgpXG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgZmlsZVBhdGgpXG5cbiAgICBpZiBvdXRwdXRGaWxlUGF0aCA9IGF0b20uc2hvd1NhdmVEaWFsb2dTeW5jKGZpbGVQYXRoLnRvTG93ZXJDYXNlKCkpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG91dHB1dEZpbGVQYXRoLCBAY29sbGVjdGlvbi5nZXRNYXJrZG93bigpKVxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihvdXRwdXRGaWxlUGF0aClcblxuICB0b2dnbGVTZWFyY2hTY29wZTogPT5cbiAgICBzY29wZSA9IEBjb2xsZWN0aW9uLnRvZ2dsZVNlYXJjaFNjb3BlKClcbiAgICBAc2V0U2NvcGVCdXR0b25TdGF0ZShzY29wZSlcblxuICBzZXRTY29wZUJ1dHRvblN0YXRlOiAoc3RhdGUpID0+XG4gICAgc3dpdGNoIHN0YXRlXG4gICAgICB3aGVuICdwcm9qZWN0JyB0aGVuIEBzY29wZUJ1dHRvbi50ZXh0ICdQcm9qZWN0J1xuICAgICAgd2hlbiAnb3BlbicgdGhlbiBAc2NvcGVCdXR0b24udGV4dCAnT3BlbiBGaWxlcydcbiAgICAgIHdoZW4gJ2FjdGl2ZScgdGhlbiBAc2NvcGVCdXR0b24udGV4dCAnQWN0aXZlIEZpbGUnXG4gICAgICB3aGVuICdjdXN0b20nIHRoZW4gQHNjb3BlQnV0dG9uLnRleHQgJ0N1c3RvbSdcbiAgICAgIGVsc2UgQHNjb3BlQnV0dG9uLnRleHQgJ1dvcmtzcGFjZSdcblxuICB0b2dnbGVPcHRpb25zOiA9PlxuICAgIHVubGVzcyBAdG9kb09wdGlvbnNcbiAgICAgIEBvcHRpb25zVmlldy5oaWRlKClcbiAgICAgIEB0b2RvT3B0aW9ucyA9IG5ldyBUb2RvT3B0aW9ucyhAY29sbGVjdGlvbilcbiAgICAgIEBvcHRpb25zVmlldy5odG1sIEB0b2RvT3B0aW9uc1xuICAgIEBvcHRpb25zVmlldy5zbGlkZVRvZ2dsZSgpXG5cbiAgZmlsdGVyOiAtPlxuICAgIEBjb2xsZWN0aW9uLmZpbHRlclRvZG9zIEBmaWx0ZXJCdWZmZXIuZ2V0VGV4dCgpXG5cbiAgY2hlY2tEZXByZWNhdGlvbjogLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5maW5kVGhlc2VSZWdleGVzJylcbiAgICAgIEBzaG93V2FybmluZyAnJydcbiAgICAgIERlcHJlY2F0aW9uIFdhcm5pbmc6XFxuXG4gICAgICBgZmluZFRoZXNlUmVnZXhlc2AgY29uZmlnIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYGZpbmRUaGVzZVRvZG9zYCBhbmQgYGZpbmRVc2luZ1JlZ2V4YCBmb3IgY3VzdG9tIGJlaGF2aW91ci5cbiAgICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbXJvZGFsZ2FhcmQvYXRvbS10b2RvLXNob3cjY29uZmlnIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgICAgJycnXG4iXX0=
