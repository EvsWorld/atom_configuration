(function() {
  var SymbolsTreeView;

  SymbolsTreeView = require('./symbols-tree-view');

  module.exports = {
    config: {
      autoToggle: {
        type: 'boolean',
        "default": false,
        description: 'If this option is enabled then symbols-tree-view will auto open when you open files.'
      },
      scrollAnimation: {
        type: 'boolean',
        "default": true,
        description: 'If this option is enabled then when you click the item in symbols-tree it will scroll to the destination gradually.'
      },
      autoHide: {
        type: 'boolean',
        "default": false,
        description: 'If this option is enabled then symbols-tree-view is always hidden unless mouse hover over it.'
      },
      zAutoHideTypes: {
        title: 'AutoHideTypes',
        type: 'string',
        description: 'Here you can specify a list of types that will be hidden by default (ex: "variable class")',
        "default": ''
      },
      sortByNameScopes: {
        type: 'string',
        description: 'Here you can specify a list of scopes that will be sorted by name (ex: "text.html.php")',
        "default": ''
      },
      defaultWidth: {
        type: 'number',
        description: 'Width of the panel (needs Atom restart)',
        "default": 200
      }
    },
    symbolsTreeView: null,
    activate: function(state) {
      this.symbolsTreeView = new SymbolsTreeView(state.symbolsTreeViewState);
      atom.commands.add('atom-workspace', {
        'symbols-tree-view:toggle': (function(_this) {
          return function() {
            return _this.symbolsTreeView.toggle();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'symbols-tree-view:show': (function(_this) {
          return function() {
            return _this.symbolsTreeView.showView();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'symbols-tree-view:hide': (function(_this) {
          return function() {
            return _this.symbolsTreeView.hideView();
          };
        })(this)
      });
      atom.config.observe('tree-view.showOnRightSide', (function(_this) {
        return function(value) {
          if (_this.symbolsTreeView.hasParent()) {
            _this.symbolsTreeView.remove();
            _this.symbolsTreeView.populate();
            return _this.symbolsTreeView.attach();
          }
        };
      })(this));
      return atom.config.observe("symbols-tree-view.autoToggle", (function(_this) {
        return function(enabled) {
          if (enabled) {
            if (!_this.symbolsTreeView.hasParent()) {
              return _this.symbolsTreeView.toggle();
            }
          } else {
            if (_this.symbolsTreeView.hasParent()) {
              return _this.symbolsTreeView.toggle();
            }
          }
        };
      })(this));
    },
    deactivate: function() {
      return this.symbolsTreeView.destroy();
    },
    serialize: function() {
      return {
        symbolsTreeViewState: this.symbolsTreeView.serialize()
      };
    },
    getProvider: function() {
      var view;
      view = this.symbolsTreeView;
      return {
        providerName: 'symbols-tree-view',
        getSuggestionForWord: (function(_this) {
          return function(textEditor, text, range) {
            return {
              range: range,
              callback: function() {
                return view.focusClickedTag.bind(view)(textEditor, text);
              }
            };
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zeW1ib2xzLXRyZWUtdmlldy9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSOztFQUVsQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsVUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsc0ZBRmI7T0FERjtNQUlBLGVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLHFIQUZiO09BTEY7TUFRQSxRQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSwrRkFGYjtPQVRGO01BWUEsY0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGVBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLFdBQUEsRUFBYSw0RkFGYjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFIVDtPQWJGO01BaUJBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLFdBQUEsRUFBYSx5RkFEYjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFGVDtPQWxCRjtNQXFCQSxZQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLFdBQUEsRUFBYSx5Q0FEYjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsR0FGVDtPQXRCRjtLQURGO0lBNEJBLGVBQUEsRUFBaUIsSUE1QmpCO0lBOEJBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFJLGVBQUosQ0FBb0IsS0FBSyxDQUFDLG9CQUExQjtNQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO1FBQUEsMEJBQUEsRUFBNEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsZUFBZSxDQUFDLE1BQWpCLENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUI7T0FBcEM7TUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO1FBQUEsd0JBQUEsRUFBMEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUI7T0FBcEM7TUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO1FBQUEsd0JBQUEsRUFBMEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUI7T0FBcEM7TUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsMkJBQXBCLEVBQWlELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO1VBQy9DLElBQUcsS0FBQyxDQUFBLGVBQWUsQ0FBQyxTQUFqQixDQUFBLENBQUg7WUFDRSxLQUFDLENBQUEsZUFBZSxDQUFDLE1BQWpCLENBQUE7WUFDQSxLQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQUE7bUJBQ0EsS0FBQyxDQUFBLGVBQWUsQ0FBQyxNQUFqQixDQUFBLEVBSEY7O1FBRCtDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqRDthQU1BLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiw4QkFBcEIsRUFBb0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7VUFDbEQsSUFBRyxPQUFIO1lBQ0UsSUFBQSxDQUFpQyxLQUFDLENBQUEsZUFBZSxDQUFDLFNBQWpCLENBQUEsQ0FBakM7cUJBQUEsS0FBQyxDQUFBLGVBQWUsQ0FBQyxNQUFqQixDQUFBLEVBQUE7YUFERjtXQUFBLE1BQUE7WUFHRSxJQUE2QixLQUFDLENBQUEsZUFBZSxDQUFDLFNBQWpCLENBQUEsQ0FBN0I7cUJBQUEsS0FBQyxDQUFBLGVBQWUsQ0FBQyxNQUFqQixDQUFBLEVBQUE7YUFIRjs7UUFEa0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBEO0lBWlEsQ0E5QlY7SUFnREEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsZUFBZSxDQUFDLE9BQWpCLENBQUE7SUFEVSxDQWhEWjtJQW1EQSxTQUFBLEVBQVcsU0FBQTthQUNUO1FBQUEsb0JBQUEsRUFBc0IsSUFBQyxDQUFBLGVBQWUsQ0FBQyxTQUFqQixDQUFBLENBQXRCOztJQURTLENBbkRYO0lBc0RBLFdBQUEsRUFBYSxTQUFBO0FBQ1gsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFDLENBQUE7YUFFUjtRQUFBLFlBQUEsRUFBYyxtQkFBZDtRQUNBLG9CQUFBLEVBQXNCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsS0FBbkI7bUJBQ3BCO2NBQUEsS0FBQSxFQUFPLEtBQVA7Y0FDQSxRQUFBLEVBQVUsU0FBQTt1QkFDUixJQUFJLENBQUMsZUFBZSxDQUFDLElBQXJCLENBQTBCLElBQTFCLENBQUEsQ0FBZ0MsVUFBaEMsRUFBNEMsSUFBNUM7Y0FEUSxDQURWOztVQURvQjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEdEI7O0lBSFcsQ0F0RGI7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJTeW1ib2xzVHJlZVZpZXcgPSByZXF1aXJlICcuL3N5bWJvbHMtdHJlZS12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBhdXRvVG9nZ2xlOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246ICdJZiB0aGlzIG9wdGlvbiBpcyBlbmFibGVkIHRoZW4gc3ltYm9scy10cmVlLXZpZXcgd2lsbCBhdXRvIG9wZW4gd2hlbiB5b3Ugb3BlbiBmaWxlcy4nXG4gICAgc2Nyb2xsQW5pbWF0aW9uOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHRoaXMgb3B0aW9uIGlzIGVuYWJsZWQgdGhlbiB3aGVuIHlvdSBjbGljayB0aGUgaXRlbSBpbiBzeW1ib2xzLXRyZWUgaXQgd2lsbCBzY3JvbGwgdG8gdGhlIGRlc3RpbmF0aW9uIGdyYWR1YWxseS4nXG4gICAgYXV0b0hpZGU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHRoaXMgb3B0aW9uIGlzIGVuYWJsZWQgdGhlbiBzeW1ib2xzLXRyZWUtdmlldyBpcyBhbHdheXMgaGlkZGVuIHVubGVzcyBtb3VzZSBob3ZlciBvdmVyIGl0LidcbiAgICB6QXV0b0hpZGVUeXBlczpcbiAgICAgIHRpdGxlOiAnQXV0b0hpZGVUeXBlcydcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZXNjcmlwdGlvbjogJ0hlcmUgeW91IGNhbiBzcGVjaWZ5IGEgbGlzdCBvZiB0eXBlcyB0aGF0IHdpbGwgYmUgaGlkZGVuIGJ5IGRlZmF1bHQgKGV4OiBcInZhcmlhYmxlIGNsYXNzXCIpJ1xuICAgICAgZGVmYXVsdDogJydcbiAgICBzb3J0QnlOYW1lU2NvcGVzOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlc2NyaXB0aW9uOiAnSGVyZSB5b3UgY2FuIHNwZWNpZnkgYSBsaXN0IG9mIHNjb3BlcyB0aGF0IHdpbGwgYmUgc29ydGVkIGJ5IG5hbWUgKGV4OiBcInRleHQuaHRtbC5waHBcIiknXG4gICAgICBkZWZhdWx0OiAnJ1xuICAgIGRlZmF1bHRXaWR0aDpcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICBkZXNjcmlwdGlvbjogJ1dpZHRoIG9mIHRoZSBwYW5lbCAobmVlZHMgQXRvbSByZXN0YXJ0KSdcbiAgICAgIGRlZmF1bHQ6IDIwMFxuXG5cbiAgc3ltYm9sc1RyZWVWaWV3OiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAc3ltYm9sc1RyZWVWaWV3ID0gbmV3IFN5bWJvbHNUcmVlVmlldyhzdGF0ZS5zeW1ib2xzVHJlZVZpZXdTdGF0ZSlcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnc3ltYm9scy10cmVlLXZpZXc6dG9nZ2xlJzogPT4gQHN5bWJvbHNUcmVlVmlldy50b2dnbGUoKVxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdzeW1ib2xzLXRyZWUtdmlldzpzaG93JzogPT4gQHN5bWJvbHNUcmVlVmlldy5zaG93VmlldygpXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ3N5bWJvbHMtdHJlZS12aWV3OmhpZGUnOiA9PiBAc3ltYm9sc1RyZWVWaWV3LmhpZGVWaWV3KClcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy5zaG93T25SaWdodFNpZGUnLCAodmFsdWUpID0+XG4gICAgICBpZiBAc3ltYm9sc1RyZWVWaWV3Lmhhc1BhcmVudCgpXG4gICAgICAgIEBzeW1ib2xzVHJlZVZpZXcucmVtb3ZlKClcbiAgICAgICAgQHN5bWJvbHNUcmVlVmlldy5wb3B1bGF0ZSgpXG4gICAgICAgIEBzeW1ib2xzVHJlZVZpZXcuYXR0YWNoKClcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgXCJzeW1ib2xzLXRyZWUtdmlldy5hdXRvVG9nZ2xlXCIsIChlbmFibGVkKSA9PlxuICAgICAgaWYgZW5hYmxlZFxuICAgICAgICBAc3ltYm9sc1RyZWVWaWV3LnRvZ2dsZSgpIHVubGVzcyBAc3ltYm9sc1RyZWVWaWV3Lmhhc1BhcmVudCgpXG4gICAgICBlbHNlXG4gICAgICAgIEBzeW1ib2xzVHJlZVZpZXcudG9nZ2xlKCkgaWYgQHN5bWJvbHNUcmVlVmlldy5oYXNQYXJlbnQoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN5bWJvbHNUcmVlVmlldy5kZXN0cm95KClcblxuICBzZXJpYWxpemU6IC0+XG4gICAgc3ltYm9sc1RyZWVWaWV3U3RhdGU6IEBzeW1ib2xzVHJlZVZpZXcuc2VyaWFsaXplKClcblxuICBnZXRQcm92aWRlcjogLT5cbiAgICB2aWV3ID0gQHN5bWJvbHNUcmVlVmlld1xuXG4gICAgcHJvdmlkZXJOYW1lOiAnc3ltYm9scy10cmVlLXZpZXcnXG4gICAgZ2V0U3VnZ2VzdGlvbkZvcldvcmQ6ICh0ZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkgPT5cbiAgICAgIHJhbmdlOiByYW5nZVxuICAgICAgY2FsbGJhY2s6ICgpPT5cbiAgICAgICAgdmlldy5mb2N1c0NsaWNrZWRUYWcuYmluZCh2aWV3KSh0ZXh0RWRpdG9yLCB0ZXh0KVxuIl19
