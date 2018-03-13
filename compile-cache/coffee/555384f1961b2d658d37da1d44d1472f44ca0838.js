(function() {
  var CompositeDisposable, opn;

  CompositeDisposable = require('atom').CompositeDisposable;

  opn = require('opn');

  module.exports = {
    subscriptions: null,
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-text-editor', 'open-in-browser:open', this.openEditor.bind(this)));
      return this.subscriptions.add(atom.commands.add('.tree-view .file', 'open-in-browser:open-tree-view', this.openTreeView.bind(this)));
    },
    getFilePath: function() {
      return atom.workspace.getActiveTextEditor().getPath();
    },
    openEditor: function() {
      return this.open(this.getFilePath());
    },
    openTreeView: function(arg) {
      var target;
      target = arg.target;
      return this.open(target.dataset.path);
    },
    open: function(filePath) {
      return opn(filePath)["catch"](function(error) {
        atom.notifications.addError(error.toString(), {
          detail: error.stack || '',
          dismissable: true
        });
        return console.error(error);
      });
    },
    deactivate: function() {
      var ref;
      return (ref = this.subscriptions) != null ? ref.dispose() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9vcGVuLWluLWJyb3dzZXIvbGliL29wZW4taW4tYnJvd3Nlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSOztFQUVOLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxhQUFBLEVBQWUsSUFBZjtJQUVBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNqQixzQkFEaUIsRUFDTyxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBaUIsSUFBakIsQ0FEUCxDQUFuQjthQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ2pCLGdDQURpQixFQUNpQixJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsSUFBbkIsQ0FEakIsQ0FBbkI7SUFKUSxDQUZWO0lBU0EsV0FBQSxFQUFhLFNBQUE7YUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBb0MsQ0FBQyxPQUFyQyxDQUFBO0lBQUgsQ0FUYjtJQVdBLFVBQUEsRUFBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLElBQUQsQ0FBTSxJQUFDLENBQUEsV0FBRCxDQUFBLENBQU47SUFEVSxDQVhaO0lBY0EsWUFBQSxFQUFjLFNBQUMsR0FBRDtBQUNaLFVBQUE7TUFEYyxTQUFEO2FBQ2IsSUFBQyxDQUFBLElBQUQsQ0FBTSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQXJCO0lBRFksQ0FkZDtJQWlCQSxJQUFBLEVBQU0sU0FBQyxRQUFEO2FBQ0osR0FBQSxDQUFJLFFBQUosQ0FBYSxFQUFDLEtBQUQsRUFBYixDQUFvQixTQUFDLEtBQUQ7UUFDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixLQUFLLENBQUMsUUFBTixDQUFBLENBQTVCLEVBQThDO1VBQUEsTUFBQSxFQUFRLEtBQUssQ0FBQyxLQUFOLElBQWUsRUFBdkI7VUFBMkIsV0FBQSxFQUFhLElBQXhDO1NBQTlDO2VBQ0EsT0FBTyxDQUFDLEtBQVIsQ0FBYyxLQUFkO01BRmtCLENBQXBCO0lBREksQ0FqQk47SUFzQkEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBO3FEQUFjLENBQUUsT0FBaEIsQ0FBQTtJQURVLENBdEJaOztBQUxGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbm9wbiA9IHJlcXVpcmUgJ29wbidcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcblxuICBhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJyxcbiAgICAgICdvcGVuLWluLWJyb3dzZXI6b3BlbicsIEBvcGVuRWRpdG9yLmJpbmQodGhpcylcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcgLmZpbGUnLFxuICAgICAgJ29wZW4taW4tYnJvd3NlcjpvcGVuLXRyZWUtdmlldycsIEBvcGVuVHJlZVZpZXcuYmluZCh0aGlzKVxuXG4gIGdldEZpbGVQYXRoOiAtPiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0UGF0aCgpXG5cbiAgb3BlbkVkaXRvcjogLT5cbiAgICBAb3BlbiBAZ2V0RmlsZVBhdGgoKVxuXG4gIG9wZW5UcmVlVmlldzogKHt0YXJnZXR9KSAtPlxuICAgIEBvcGVuIHRhcmdldC5kYXRhc2V0LnBhdGhcblxuICBvcGVuOiAoZmlsZVBhdGgpIC0+XG4gICAgb3BuKGZpbGVQYXRoKS5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgZXJyb3IudG9TdHJpbmcoKSwgZGV0YWlsOiBlcnJvci5zdGFjayBvciAnJywgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIGNvbnNvbGUuZXJyb3IgZXJyb3JcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiJdfQ==
