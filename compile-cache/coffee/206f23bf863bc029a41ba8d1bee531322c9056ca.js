(function() {
  var CompositeDisposable, TextEditor, TreeViewCopyRelativePath, extractPath, ref, relative;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, TextEditor = ref.TextEditor;

  relative = require('relative');

  extractPath = function(element) {
    var path;
    path = element.dataset.path ? element.dataset.path : element.children[0].dataset.path;
    if (!path) {
      atom.notifications.addError("tree-view-copy-relative-path: unable to extract path from node.");
      console.error("Unable to extract path from node: ", element);
    }
    return path;
  };

  module.exports = TreeViewCopyRelativePath = {
    SELECTOR: '.tree-view .entry',
    COMMAND: 'tree-view-copy-relative-path:copy-path',
    subscriptions: null,
    config: {
      replaceBackslashes: {
        title: 'Replace backslashes (\\) with forward slashes (/) (usefull for Windows)',
        type: 'boolean',
        "default": true
      }
    },
    activate: function(state) {
      var command;
      command = atom.commands.add(this.SELECTOR, this.COMMAND, (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          return _this.copyRelativePath(extractPath(target));
        };
      })(this));
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(command);
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    copyRelativePath: function(treeViewPath) {
      var activeTextEditor, currentPath, ref1, relativePath;
      if (!treeViewPath) {
        return;
      }
      activeTextEditor = atom.workspace.getActiveTextEditor() || ((ref1 = atom.workspace.getPanes().find((function(_this) {
        return function(arg) {
          var activeItem;
          activeItem = arg.activeItem;
          return activeItem instanceof TextEditor;
        };
      })(this))) != null ? ref1.activeItem : void 0);
      currentPath = activeTextEditor != null ? activeTextEditor.getPath() : void 0;
      if (!currentPath) {
        atom.notifications.addWarning('"Copy Relative Path" command has no effect when no files are open');
        return;
      }
      relativePath = relative(currentPath, treeViewPath);
      if (relativePath.substr(0, 3) !== '../') {
        relativePath = './' + relativePath;
      }
      if (atom.config.get('tree-view-copy-relative-path.replaceBackslashes')) {
        relativePath = relativePath.replace(/\\/g, "/");
      }
      return atom.clipboard.write(relativePath);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90cmVlLXZpZXctY29weS1yZWxhdGl2ZS1wYXRoL2xpYi90cmVlLXZpZXctY29weS1yZWxhdGl2ZS1wYXRoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFDdEIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSOztFQUVYLFdBQUEsR0FBYyxTQUFDLE9BQUQ7QUFDWixRQUFBO0lBQUEsSUFBQSxHQUFVLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBbkIsR0FDTCxPQUFPLENBQUMsT0FBTyxDQUFDLElBRFgsR0FHTCxPQUFPLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQU8sQ0FBQztJQUU5QixJQUFBLENBQU8sSUFBUDtNQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsaUVBQTVCO01BRUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxvQ0FBZCxFQUFvRCxPQUFwRCxFQUhGOztXQUtBO0VBWFk7O0VBYWQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsd0JBQUEsR0FDZjtJQUFBLFFBQUEsRUFBVSxtQkFBVjtJQUNBLE9BQUEsRUFBUyx3Q0FEVDtJQUVBLGFBQUEsRUFBZSxJQUZmO0lBR0EsTUFBQSxFQUNFO01BQUEsa0JBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyx5RUFBUDtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUZUO09BREY7S0FKRjtJQVNBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7QUFDUixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsUUFBbkIsRUFDUixJQUFDLENBQUEsT0FETyxFQUVSLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBQWMsY0FBQTtVQUFaLFNBQUQ7aUJBQWEsS0FBQyxDQUFBLGdCQUFELENBQWtCLFdBQUEsQ0FBWSxNQUFaLENBQWxCO1FBQWQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRlE7TUFJVixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO2FBQ3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFuQjtJQU5RLENBVFY7SUFpQkEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtJQURVLENBakJaO0lBb0JBLGdCQUFBLEVBQWtCLFNBQUMsWUFBRDtBQUNoQixVQUFBO01BQUEsSUFBVSxDQUFJLFlBQWQ7QUFBQSxlQUFBOztNQUVBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFBOzs7Ozs7K0JBQ2lFLENBQUU7TUFDdEYsV0FBQSw4QkFBYyxnQkFBZ0IsQ0FBRSxPQUFsQixDQUFBO01BRWQsSUFBQSxDQUFPLFdBQVA7UUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLG1FQUE5QjtBQUVBLGVBSEY7O01BS0EsWUFBQSxHQUFlLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFlBQXRCO01BQ2YsSUFBRyxZQUFZLENBQUMsTUFBYixDQUFvQixDQUFwQixFQUF1QixDQUF2QixDQUFBLEtBQTZCLEtBQWhDO1FBQ0UsWUFBQSxHQUFlLElBQUEsR0FBTyxhQUR4Qjs7TUFFQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpREFBaEIsQ0FBSDtRQUNFLFlBQUEsR0FBZSxZQUFZLENBQUMsT0FBYixDQUFxQixLQUFyQixFQUE0QixHQUE1QixFQURqQjs7YUFHQSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsQ0FBcUIsWUFBckI7SUFsQmdCLENBcEJsQjs7QUFqQkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgVGV4dEVkaXRvcn0gPSByZXF1aXJlICdhdG9tJ1xucmVsYXRpdmUgPSByZXF1aXJlICdyZWxhdGl2ZSdcblxuZXh0cmFjdFBhdGggPSAoZWxlbWVudCkgLT5cbiAgcGF0aCA9IGlmIGVsZW1lbnQuZGF0YXNldC5wYXRoXG4gICAgZWxlbWVudC5kYXRhc2V0LnBhdGhcbiAgZWxzZVxuICAgIGVsZW1lbnQuY2hpbGRyZW5bMF0uZGF0YXNldC5wYXRoXG5cbiAgdW5sZXNzIHBhdGhcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgXCJ0cmVlLXZpZXctY29weS1yZWxhdGl2ZS1wYXRoOlxuICAgICAgdW5hYmxlIHRvIGV4dHJhY3QgcGF0aCBmcm9tIG5vZGUuXCJcbiAgICBjb25zb2xlLmVycm9yIFwiVW5hYmxlIHRvIGV4dHJhY3QgcGF0aCBmcm9tIG5vZGU6IFwiLCBlbGVtZW50XG5cbiAgcGF0aFxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWVWaWV3Q29weVJlbGF0aXZlUGF0aCA9XG4gIFNFTEVDVE9SOiAnLnRyZWUtdmlldyAuZW50cnknXG4gIENPTU1BTkQ6ICd0cmVlLXZpZXctY29weS1yZWxhdGl2ZS1wYXRoOmNvcHktcGF0aCdcbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBjb25maWc6XG4gICAgcmVwbGFjZUJhY2tzbGFzaGVzOlxuICAgICAgdGl0bGU6ICdSZXBsYWNlIGJhY2tzbGFzaGVzIChcXFxcKSB3aXRoIGZvcndhcmQgc2xhc2hlcyAoLykgKHVzZWZ1bGwgZm9yIFdpbmRvd3MpJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBjb21tYW5kID0gYXRvbS5jb21tYW5kcy5hZGQgQFNFTEVDVE9SLFxuICAgICAgQENPTU1BTkQsXG4gICAgICAoe3RhcmdldH0pID0+IEBjb3B5UmVsYXRpdmVQYXRoKGV4dHJhY3RQYXRoKHRhcmdldCkpXG5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKGNvbW1hbmQpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICBjb3B5UmVsYXRpdmVQYXRoOiAodHJlZVZpZXdQYXRoKSAtPlxuICAgIHJldHVybiBpZiBub3QgdHJlZVZpZXdQYXRoXG5cbiAgICBhY3RpdmVUZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpIHx8XG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpLmZpbmQoKHthY3RpdmVJdGVtfSkgPT4gYWN0aXZlSXRlbSBpbnN0YW5jZW9mIFRleHRFZGl0b3IpPy5hY3RpdmVJdGVtXG4gICAgY3VycmVudFBhdGggPSBhY3RpdmVUZXh0RWRpdG9yPy5nZXRQYXRoKClcblxuICAgIHVubGVzcyBjdXJyZW50UGF0aFxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcgJ1wiQ29weSBSZWxhdGl2ZSBQYXRoXCIgY29tbWFuZFxuICAgICAgICBoYXMgbm8gZWZmZWN0IHdoZW4gbm8gZmlsZXMgYXJlIG9wZW4nXG4gICAgICByZXR1cm5cblxuICAgIHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKGN1cnJlbnRQYXRoLCB0cmVlVmlld1BhdGgpXG4gICAgaWYgcmVsYXRpdmVQYXRoLnN1YnN0cigwLCAzKSAhPSAnLi4vJ1xuICAgICAgcmVsYXRpdmVQYXRoID0gJy4vJyArIHJlbGF0aXZlUGF0aFxuICAgIGlmIGF0b20uY29uZmlnLmdldCgndHJlZS12aWV3LWNvcHktcmVsYXRpdmUtcGF0aC5yZXBsYWNlQmFja3NsYXNoZXMnKVxuICAgICAgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmVQYXRoLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpXG5cbiAgICBhdG9tLmNsaXBib2FyZC53cml0ZSByZWxhdGl2ZVBhdGhcbiJdfQ==
