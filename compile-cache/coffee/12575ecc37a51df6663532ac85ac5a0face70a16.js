(function() {
  var CompositeDisposable, HighlightLineModel;

  CompositeDisposable = require("atom").CompositeDisposable;

  HighlightLineModel = require('./highlight-line-model');

  module.exports = {
    config: {
      enableBackgroundColor: {
        type: 'boolean',
        "default": true
      },
      hideHighlightOnSelect: {
        type: 'boolean',
        "default": false
      },
      enableUnderline: {
        type: 'boolean',
        "default": false
      },
      enableSelectionBorder: {
        type: 'boolean',
        "default": false
      },
      underline: {
        type: 'string',
        "default": 'solid',
        "enum": ['solid', 'dotted', 'dashed']
      }
    },
    line: null,
    subscriptions: null,
    activate: function() {
      this.line = new HighlightLineModel();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-line:toggle-background': (function(_this) {
          return function() {
            return _this.toggleHighlight();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-line:toggle-hide-highlight-on-select': (function(_this) {
          return function() {
            return _this.toggleHideHighlightOnSelect();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-line:toggle-underline': (function(_this) {
          return function() {
            return _this.toggleUnderline();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-line:toggle-selection-borders': (function(_this) {
          return function() {
            return _this.toggleSelectionBorders();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.line.destroy();
      this.subscriptions.dispose();
      return this.subscriptions = null;
    },
    toggleHighlight: function() {
      var current;
      current = atom.config.get('highlight-line.enableBackgroundColor');
      return atom.config.set('highlight-line.enableBackgroundColor', !current);
    },
    toggleHideHighlightOnSelect: function() {
      var current;
      current = atom.config.get('highlight-line.hideHighlightOnSelect');
      return atom.config.set('highlight-line.hideHighlightOnSelect', !current);
    },
    toggleUnderline: function() {
      var current;
      current = atom.config.get('highlight-line.enableUnderline');
      return atom.config.set('highlight-line.enableUnderline', !current);
    },
    toggleSelectionBorders: function() {
      var current;
      current = atom.config.get('highlight-line.enableSelectionBorder');
      return atom.config.set('highlight-line.enableSelectionBorder', !current);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtbGluZS9saWIvaGlnaGxpZ2h0LWxpbmUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx3QkFBUjs7RUFFckIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLHFCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtPQURGO01BR0EscUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BSkY7TUFNQSxlQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQVBGO01BU0EscUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BVkY7TUFZQSxTQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FEVDtRQUVBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixRQUFwQixDQUZOO09BYkY7S0FERjtJQWlCQSxJQUFBLEVBQU0sSUFqQk47SUFrQkEsYUFBQSxFQUFlLElBbEJmO0lBb0JBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLGtCQUFKLENBQUE7TUFHUixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BR3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2Y7UUFBQSxrQ0FBQSxFQUFvQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxlQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEM7T0FEZSxDQUFuQjtNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2Y7UUFBQSxnREFBQSxFQUNBLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLDJCQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEQTtPQURlLENBQW5CO01BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDZjtRQUFBLGlDQUFBLEVBQW1DLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQztPQURlLENBQW5CO2FBRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDZjtRQUFBLHlDQUFBLEVBQTJDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLHNCQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0M7T0FEZSxDQUFuQjtJQWRRLENBcEJWO0lBcUNBLFVBQUEsRUFBWSxTQUFBO01BQ1YsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7TUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTthQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCO0lBTFAsQ0FyQ1o7SUE0Q0EsZUFBQSxFQUFpQixTQUFBO0FBQ2YsVUFBQTtNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCO2FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixFQUF3RCxDQUFJLE9BQTVEO0lBRmUsQ0E1Q2pCO0lBZ0RBLDJCQUFBLEVBQTZCLFNBQUE7QUFDM0IsVUFBQTtNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCO2FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixFQUF3RCxDQUFJLE9BQTVEO0lBRjJCLENBaEQ3QjtJQW9EQSxlQUFBLEVBQWlCLFNBQUE7QUFDZixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEI7YUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLEVBQWtELENBQUksT0FBdEQ7SUFGZSxDQXBEakI7SUF3REEsc0JBQUEsRUFBd0IsU0FBQTtBQUN0QixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEI7YUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLEVBQXdELENBQUksT0FBNUQ7SUFGc0IsQ0F4RHhCOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxuSGlnaGxpZ2h0TGluZU1vZGVsID0gcmVxdWlyZSAnLi9oaWdobGlnaHQtbGluZS1tb2RlbCdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgZW5hYmxlQmFja2dyb3VuZENvbG9yOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgaGlkZUhpZ2hsaWdodE9uU2VsZWN0OlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGVuYWJsZVVuZGVybGluZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBlbmFibGVTZWxlY3Rpb25Cb3JkZXI6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgdW5kZXJsaW5lOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdzb2xpZCdcbiAgICAgIGVudW06IFsnc29saWQnLCAnZG90dGVkJywgJ2Rhc2hlZCddXG4gIGxpbmU6IG51bGxcbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBsaW5lID0gbmV3IEhpZ2hsaWdodExpbmVNb2RlbCgpXG5cbiAgICAjIFNldHVwIHRvIHVzZSB0aGUgbmV3IGNvbXBvc2l0ZSBkaXNwb3NhYmxlcyBBUEkgZm9yIHJlZ2lzdGVyaW5nIGNvbW1hbmRzXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgIyBBZGQgdGhlIGNvbW1hbmRzXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIixcbiAgICAgICAgJ2hpZ2hsaWdodC1saW5lOnRvZ2dsZS1iYWNrZ3JvdW5kJzogPT4gQHRvZ2dsZUhpZ2hsaWdodCgpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIixcbiAgICAgICAgJ2hpZ2hsaWdodC1saW5lOnRvZ2dsZS1oaWRlLWhpZ2hsaWdodC1vbi1zZWxlY3QnOiBcXFxuICAgICAgICA9PiBAdG9nZ2xlSGlkZUhpZ2hsaWdodE9uU2VsZWN0KClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLFxuICAgICAgICAnaGlnaGxpZ2h0LWxpbmU6dG9nZ2xlLXVuZGVybGluZSc6ID0+IEB0b2dnbGVVbmRlcmxpbmUoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsXG4gICAgICAgICdoaWdobGlnaHQtbGluZTp0b2dnbGUtc2VsZWN0aW9uLWJvcmRlcnMnOiA9PiBAdG9nZ2xlU2VsZWN0aW9uQm9yZGVycygpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAbGluZS5kZXN0cm95KClcblxuICAgICMgRGVzdHJveSB0aGUgc3Vic2NyaXB0aW9ucyBhcyB3ZWxsXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBudWxsXG5cbiAgdG9nZ2xlSGlnaGxpZ2h0OiAtPlxuICAgIGN1cnJlbnQgPSBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1saW5lLmVuYWJsZUJhY2tncm91bmRDb2xvcicpXG4gICAgYXRvbS5jb25maWcuc2V0KCdoaWdobGlnaHQtbGluZS5lbmFibGVCYWNrZ3JvdW5kQ29sb3InLCBub3QgY3VycmVudClcblxuICB0b2dnbGVIaWRlSGlnaGxpZ2h0T25TZWxlY3Q6IC0+XG4gICAgY3VycmVudCA9IGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LWxpbmUuaGlkZUhpZ2hsaWdodE9uU2VsZWN0JylcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2hpZ2hsaWdodC1saW5lLmhpZGVIaWdobGlnaHRPblNlbGVjdCcsIG5vdCBjdXJyZW50KVxuXG4gIHRvZ2dsZVVuZGVybGluZTogLT5cbiAgICBjdXJyZW50ID0gYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtbGluZS5lbmFibGVVbmRlcmxpbmUnKVxuICAgIGF0b20uY29uZmlnLnNldCgnaGlnaGxpZ2h0LWxpbmUuZW5hYmxlVW5kZXJsaW5lJywgbm90IGN1cnJlbnQpXG5cbiAgdG9nZ2xlU2VsZWN0aW9uQm9yZGVyczogLT5cbiAgICBjdXJyZW50ID0gYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtbGluZS5lbmFibGVTZWxlY3Rpb25Cb3JkZXInKVxuICAgIGF0b20uY29uZmlnLnNldCgnaGlnaGxpZ2h0LWxpbmUuZW5hYmxlU2VsZWN0aW9uQm9yZGVyJywgbm90IGN1cnJlbnQpXG4iXX0=
