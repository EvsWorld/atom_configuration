(function() {
  var CompositeDisposable, basicConfig, config;

  CompositeDisposable = require("atom").CompositeDisposable;

  config = require("./config");

  basicConfig = require("./config-basic");

  module.exports = {
    config: basicConfig,
    modules: {},
    disposables: null,
    activate: function() {
      this.disposables = new CompositeDisposable();
      this.registerWorkspaceCommands();
      return this.registerEditorCommands();
    },
    deactivate: function() {
      var ref;
      if ((ref = this.disposables) != null) {
        ref.dispose();
      }
      this.disposables = null;
      return this.modules = {};
    },
    registerWorkspaceCommands: function() {
      var workspaceCommands;
      workspaceCommands = {};
      ["draft", "post"].forEach((function(_this) {
        return function(file) {
          return workspaceCommands["markdown-writer:new-" + file] = _this.registerView("./views/new-" + file + "-view", {
            optOutGrammars: true
          });
        };
      })(this));
      ["open-cheat-sheet", "create-default-keymaps", "create-project-configs"].forEach((function(_this) {
        return function(command) {
          return workspaceCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command, {
            optOutGrammars: true
          });
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-workspace", workspaceCommands));
    },
    registerEditorCommands: function() {
      var editorCommands;
      editorCommands = {};
      ["tags", "categories"].forEach((function(_this) {
        return function(attr) {
          return editorCommands["markdown-writer:manage-post-" + attr] = _this.registerView("./views/manage-post-" + attr + "-view");
        };
      })(this));
      ["link", "footnote", "image-file", "image-clipboard", "table"].forEach((function(_this) {
        return function(media) {
          return editorCommands["markdown-writer:insert-" + media] = _this.registerView("./views/insert-" + media + "-view");
        };
      })(this));
      ["code", "codeblock", "bold", "italic", "strikethrough", "keystroke"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style + "-text"] = _this.registerCommand("./commands/style-text", {
            args: style
          });
        };
      })(this));
      ["h1", "h2", "h3", "h4", "h5", "ul", "ol", "task", "taskdone", "blockquote"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style] = _this.registerCommand("./commands/style-line", {
            args: style
          });
        };
      })(this));
      ["previous-heading", "next-heading", "next-table-cell", "reference-definition"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:jump-to-" + command] = _this.registerCommand("./commands/jump-to", {
            args: command
          });
        };
      })(this));
      ["insert-new-line", "indent-list-line"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/edit-line", {
            args: command,
            skipList: ["autocomplete-active"]
          });
        };
      })(this));
      ["correct-order-list-numbers", "format-table"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/format-text", {
            args: command
          });
        };
      })(this));
      ["publish-draft", "open-link-in-browser", "insert-image"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command);
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-text-editor", editorCommands));
    },
    registerView: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          var base, moduleInstance;
          if ((options.optOutGrammars || _this.isMarkdown()) && !_this.inSkipList(options.skipList)) {
            if ((base = _this.modules)[path] == null) {
              base[path] = require(path);
            }
            moduleInstance = new _this.modules[path](options.args);
            if (config.get("_skipAction") == null) {
              return moduleInstance.display(e);
            }
          } else {
            return e.abortKeyBinding();
          }
        };
      })(this);
    },
    registerCommand: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          var base, moduleInstance;
          if ((options.optOutGrammars || _this.isMarkdown()) && !_this.inSkipList(options.skipList)) {
            if ((base = _this.modules)[path] == null) {
              base[path] = require(path);
            }
            moduleInstance = new _this.modules[path](options.args);
            if (config.get("_skipAction") == null) {
              return moduleInstance.trigger(e);
            }
          } else {
            return e.abortKeyBinding();
          }
        };
      })(this);
    },
    isMarkdown: function() {
      var editor, grammars;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return false;
      }
      grammars = config.get("grammars") || [];
      return grammars.indexOf(editor.getGrammar().scopeName) >= 0;
    },
    inSkipList: function(list) {
      var editorElement;
      if (list == null) {
        return false;
      }
      editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
      if (!((editorElement != null) && (editorElement.classList != null))) {
        return false;
      }
      return list.every(function(className) {
        return editorElement.classList.contains(className);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL21hcmtkb3duLXdyaXRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztFQUNULFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFBUSxXQUFSO0lBRUEsT0FBQSxFQUFTLEVBRlQ7SUFHQSxXQUFBLEVBQWEsSUFIYjtJQUtBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLG1CQUFKLENBQUE7TUFFZixJQUFDLENBQUEseUJBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxzQkFBRCxDQUFBO0lBSlEsQ0FMVjtJQVdBLFVBQUEsRUFBWSxTQUFBO0FBQ1YsVUFBQTs7V0FBWSxDQUFFLE9BQWQsQ0FBQTs7TUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlO2FBQ2YsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUhELENBWFo7SUFnQkEseUJBQUEsRUFBMkIsU0FBQTtBQUN6QixVQUFBO01BQUEsaUJBQUEsR0FBb0I7TUFFcEIsQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFpQixDQUFDLE9BQWxCLENBQTBCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO2lCQUN4QixpQkFBa0IsQ0FBQSxzQkFBQSxHQUF1QixJQUF2QixDQUFsQixHQUNFLEtBQUMsQ0FBQSxZQUFELENBQWMsY0FBQSxHQUFlLElBQWYsR0FBb0IsT0FBbEMsRUFBMEM7WUFBQSxjQUFBLEVBQWdCLElBQWhCO1dBQTFDO1FBRnNCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQjtNQUlBLENBQUMsa0JBQUQsRUFBcUIs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USxDQUFDLE9BQVQsQ0FBaUIsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXJDLENBQUEsSUFBbUQ7SUFMaEQsQ0FyRlo7SUE0RkEsVUFBQSxFQUFZLFNBQUMsSUFBRDtBQUNWLFVBQUE7TUFBQSxJQUFvQixZQUFwQjtBQUFBLGVBQU8sTUFBUDs7TUFDQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBbkI7TUFDaEIsSUFBQSxDQUFBLENBQW9CLHVCQUFBLElBQWtCLGlDQUF0QyxDQUFBO0FBQUEsZUFBTyxNQUFQOztBQUNBLGFBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxTQUFDLFNBQUQ7ZUFBZSxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLFNBQWpDO01BQWYsQ0FBWDtJQUpHLENBNUZaOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxuXG5jb25maWcgPSByZXF1aXJlIFwiLi9jb25maWdcIlxuYmFzaWNDb25maWcgPSByZXF1aXJlIFwiLi9jb25maWctYmFzaWNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzogYmFzaWNDb25maWdcblxuICBtb2R1bGVzOiB7fSAjIFRvIGNhY2hlIHJlcXVpcmVkIG1vZHVsZXNcbiAgZGlzcG9zYWJsZXM6IG51bGwgIyBDb21wb3NpdGUgZGlzcG9zYWJsZVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIEByZWdpc3RlcldvcmtzcGFjZUNvbW1hbmRzKClcbiAgICBAcmVnaXN0ZXJFZGl0b3JDb21tYW5kcygpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAZGlzcG9zYWJsZXM/LmRpc3Bvc2UoKVxuICAgIEBkaXNwb3NhYmxlcyA9IG51bGxcbiAgICBAbW9kdWxlcyA9IHt9XG5cbiAgcmVnaXN0ZXJXb3Jrc3BhY2VDb21tYW5kczogLT5cbiAgICB3b3Jrc3BhY2VDb21tYW5kcyA9IHt9XG5cbiAgICBbXCJkcmFmdFwiLCBcInBvc3RcIl0uZm9yRWFjaCAoZmlsZSkgPT5cbiAgICAgIHdvcmtzcGFjZUNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOm5ldy0je2ZpbGV9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyVmlldyhcIi4vdmlld3MvbmV3LSN7ZmlsZX0tdmlld1wiLCBvcHRPdXRHcmFtbWFyczogdHJ1ZSlcblxuICAgIFtcIm9wZW4tY2hlYXQtc2hlZXRcIiwgXCJjcmVhdGUtZGVmYXVsdC1rZXltYXBzXCIsIFwiY3JlYXRlLXByb2plY3QtY29uZmlnc1wiXS5mb3JFYWNoIChjb21tYW5kKSA9PlxuICAgICAgd29ya3NwYWNlQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6I3tjb21tYW5kfVwiXSA9XG4gICAgICAgIEByZWdpc3RlckNvbW1hbmQoXCIuL2NvbW1hbmRzLyN7Y29tbWFuZH1cIiwgb3B0T3V0R3JhbW1hcnM6IHRydWUpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFwiYXRvbS13b3Jrc3BhY2VcIiwgd29ya3NwYWNlQ29tbWFuZHMpKVxuXG4gIHJlZ2lzdGVyRWRpdG9yQ29tbWFuZHM6IC0+XG4gICAgZWRpdG9yQ29tbWFuZHMgPSB7fVxuXG4gICAgW1widGFnc1wiLCBcImNhdGVnb3JpZXNcIl0uZm9yRWFjaCAoYXR0cikgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOm1hbmFnZS1wb3N0LSN7YXR0cn1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJWaWV3KFwiLi92aWV3cy9tYW5hZ2UtcG9zdC0je2F0dHJ9LXZpZXdcIilcblxuICAgIFtcImxpbmtcIiwgXCJmb290bm90ZVwiLCBcImltYWdlLWZpbGVcIiwgXCJpbWFnZS1jbGlwYm9hcmRcIiwgXCJ0YWJsZVwiXS5mb3JFYWNoIChtZWRpYSkgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOmluc2VydC0je21lZGlhfVwiXSA9XG4gICAgICAgIEByZWdpc3RlclZpZXcoXCIuL3ZpZXdzL2luc2VydC0je21lZGlhfS12aWV3XCIpXG5cbiAgICBbXCJjb2RlXCIsIFwiY29kZWJsb2NrXCIsIFwiYm9sZFwiLCBcIml0YWxpY1wiLCBcInN0cmlrZXRocm91Z2hcIiwgXCJrZXlzdHJva2VcIl0uZm9yRWFjaCAoc3R5bGUpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjp0b2dnbGUtI3tzdHlsZX0tdGV4dFwiXSA9XG4gICAgICAgIEByZWdpc3RlckNvbW1hbmQoXCIuL2NvbW1hbmRzL3N0eWxlLXRleHRcIiwgYXJnczogc3R5bGUpXG5cbiAgICBbXCJoMVwiLCBcImgyXCIsIFwiaDNcIiwgXCJoNFwiLCBcImg1XCIsIFwidWxcIiwgXCJvbFwiLCBcInRhc2tcIiwgXCJ0YXNrZG9uZVwiLCBcImJsb2NrcXVvdGVcIl0uZm9yRWFjaCAoc3R5bGUpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjp0b2dnbGUtI3tzdHlsZX1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kKFwiLi9jb21tYW5kcy9zdHlsZS1saW5lXCIsIGFyZ3M6IHN0eWxlKVxuXG4gICAgW1wicHJldmlvdXMtaGVhZGluZ1wiLCBcIm5leHQtaGVhZGluZ1wiLCBcIm5leHQtdGFibGUtY2VsbFwiLCBcInJlZmVyZW5jZS1kZWZpbml0aW9uXCJdLmZvckVhY2ggKGNvbW1hbmQpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjpqdW1wLXRvLSN7Y29tbWFuZH1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kKFwiLi9jb21tYW5kcy9qdW1wLXRvXCIsIGFyZ3M6IGNvbW1hbmQpXG5cbiAgICBbXCJpbnNlcnQtbmV3LWxpbmVcIiwgXCJpbmRlbnQtbGlzdC1saW5lXCJdLmZvckVhY2ggKGNvbW1hbmQpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjoje2NvbW1hbmR9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvZWRpdC1saW5lXCIsXG4gICAgICAgICAgYXJnczogY29tbWFuZCwgc2tpcExpc3Q6IFtcImF1dG9jb21wbGV0ZS1hY3RpdmVcIl0pXG5cbiAgICBbXCJjb3JyZWN0LW9yZGVyLWxpc3QtbnVtYmVyc1wiLCBcImZvcm1hdC10YWJsZVwiXS5mb3JFYWNoIChjb21tYW5kKSA9PlxuICAgICAgZWRpdG9yQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6I3tjb21tYW5kfVwiXSA9XG4gICAgICAgIEByZWdpc3RlckNvbW1hbmQoXCIuL2NvbW1hbmRzL2Zvcm1hdC10ZXh0XCIsIGFyZ3M6IGNvbW1hbmQpXG5cbiAgICBbXCJwdWJsaXNoLWRyYWZ0XCIsIFwib3Blbi1saW5rLWluLWJyb3dzZXJcIiwgXCJpbnNlcnQtaW1hZ2VcIl0uZm9yRWFjaCAoY29tbWFuZCkgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOiN7Y29tbWFuZH1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kKFwiLi9jb21tYW5kcy8je2NvbW1hbmR9XCIpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFwiYXRvbS10ZXh0LWVkaXRvclwiLCBlZGl0b3JDb21tYW5kcykpXG5cbiAgcmVnaXN0ZXJWaWV3OiAocGF0aCwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIChlKSA9PlxuICAgICAgaWYgKG9wdGlvbnMub3B0T3V0R3JhbW1hcnMgfHwgQGlzTWFya2Rvd24oKSkgJiYgIUBpblNraXBMaXN0KG9wdGlvbnMuc2tpcExpc3QpXG4gICAgICAgIEBtb2R1bGVzW3BhdGhdID89IHJlcXVpcmUocGF0aClcbiAgICAgICAgbW9kdWxlSW5zdGFuY2UgPSBuZXcgQG1vZHVsZXNbcGF0aF0ob3B0aW9ucy5hcmdzKVxuICAgICAgICBtb2R1bGVJbnN0YW5jZS5kaXNwbGF5KGUpIHVubGVzcyBjb25maWcuZ2V0KFwiX3NraXBBY3Rpb25cIik/XG4gICAgICBlbHNlXG4gICAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcblxuICByZWdpc3RlckNvbW1hbmQ6IChwYXRoLCBvcHRpb25zID0ge30pIC0+XG4gICAgKGUpID0+XG4gICAgICBpZiAob3B0aW9ucy5vcHRPdXRHcmFtbWFycyB8fCBAaXNNYXJrZG93bigpKSAmJiAhQGluU2tpcExpc3Qob3B0aW9ucy5za2lwTGlzdClcbiAgICAgICAgQG1vZHVsZXNbcGF0aF0gPz0gcmVxdWlyZShwYXRoKVxuICAgICAgICBtb2R1bGVJbnN0YW5jZSA9IG5ldyBAbW9kdWxlc1twYXRoXShvcHRpb25zLmFyZ3MpXG4gICAgICAgIG1vZHVsZUluc3RhbmNlLnRyaWdnZXIoZSkgdW5sZXNzIGNvbmZpZy5nZXQoXCJfc2tpcEFjdGlvblwiKT9cbiAgICAgIGVsc2VcbiAgICAgICAgZS5hYm9ydEtleUJpbmRpbmcoKVxuXG4gIGlzTWFya2Rvd246IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBlZGl0b3I/XG5cbiAgICBncmFtbWFycyA9IGNvbmZpZy5nZXQoXCJncmFtbWFyc1wiKSB8fCBbXVxuICAgIHJldHVybiBncmFtbWFycy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKSA+PSAwXG5cbiAgaW5Ta2lwTGlzdDogKGxpc3QpIC0+XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBsaXN0P1xuICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgZWRpdG9yRWxlbWVudD8gJiYgZWRpdG9yRWxlbWVudC5jbGFzc0xpc3Q/XG4gICAgcmV0dXJuIGxpc3QuZXZlcnkgKGNsYXNzTmFtZSkgLT4gZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKVxuIl19
