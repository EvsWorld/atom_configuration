(function() {
  module.exports = {
    activate: function(state) {
      atom.commands.add("atom-workspace", {
        "move-panes:move-right": (function(_this) {
          return function() {
            return _this.moveRight();
          };
        })(this)
      });
      atom.commands.add("atom-workspace", "move-panes:move-left", (function(_this) {
        return function() {
          return _this.moveLeft();
        };
      })(this));
      atom.commands.add("atom-workspace", "move-panes:move-down", (function(_this) {
        return function() {
          return _this.moveDown();
        };
      })(this));
      atom.commands.add("atom-workspace", "move-panes:move-up", (function(_this) {
        return function() {
          return _this.moveUp();
        };
      })(this));
      atom.commands.add("atom-workspace", "move-panes:move-next", (function(_this) {
        return function() {
          return _this.moveNext();
        };
      })(this));
      return atom.commands.add("atom-workspace", "move-panes:move-previous", (function(_this) {
        return function() {
          return _this.movePrevious();
        };
      })(this));
    },
    moveRight: function() {
      return this.move('horizontal', +1);
    },
    moveLeft: function() {
      return this.move('horizontal', -1);
    },
    moveUp: function() {
      return this.move('vertical', -1);
    },
    moveDown: function() {
      return this.move('vertical', +1);
    },
    moveNext: function() {
      return this.moveOrder(this.nextMethod);
    },
    movePrevious: function() {
      return this.moveOrder(this.previousMethod);
    },
    nextMethod: 'activateNextPane',
    previousMethod: 'activatePreviousPane',
    active: function() {
      return atom.workspace.getActivePane();
    },
    moveOrder: function(method) {
      var source, target;
      source = this.active();
      atom.workspace[method]();
      target = this.active();
      return this.swapEditor(source, target);
    },
    move: function(orientation, delta) {
      var axis, child, pane, ref, target;
      pane = atom.workspace.getActivePane();
      ref = this.getAxis(pane, orientation), axis = ref[0], child = ref[1];
      if (axis != null) {
        target = this.getRelativePane(axis, child, delta);
      }
      if (target != null) {
        return this.swapEditor(pane, target);
      }
    },
    swapEditor: function(source, target) {
      var editor;
      editor = source.getActiveItem();
      source.removeItem(editor);
      target.addItem(editor);
      target.activateItem(editor);
      return target.activate();
    },
    getAxis: function(pane, orientation) {
      var axis, child;
      axis = pane.parent;
      child = pane;
      while (true) {
        if (axis.constructor.name !== 'PaneAxis') {
          return;
        }
        if (axis.orientation === orientation) {
          break;
        }
        child = axis;
        axis = axis.parent;
      }
      return [axis, child];
    },
    getRelativePane: function(axis, source, delta) {
      var position, target;
      position = axis.children.indexOf(source);
      target = position + delta;
      if (!(target < axis.children.length)) {
        return;
      }
      return axis.children[target].getPanes()[0];
    },
    deactivate: function() {},
    serialize: function() {}
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9tb3ZlLXBhbmVzL2xpYi9tb3ZlLXBhbmVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLHVCQUFBLEVBQXlCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFNBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QjtPQUFwQztNQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msc0JBQXBDLEVBQTRELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsUUFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVEO01BQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxzQkFBcEMsRUFBNEQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUQ7TUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLG9CQUFwQyxFQUEwRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExRDtNQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msc0JBQXBDLEVBQTRELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxL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bURBLGVBQUEsRUFBaUIsU0FBQyxJQUFELEVBQU8sTUFBUCxFQUFlLEtBQWY7QUFDZixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBZCxDQUFzQixNQUF0QjtNQUNYLE1BQUEsR0FBUyxRQUFBLEdBQVc7TUFDcEIsSUFBQSxDQUFBLENBQWMsTUFBQSxHQUFTLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBckMsQ0FBQTtBQUFBLGVBQUE7O0FBQ0EsYUFBTyxJQUFJLENBQUMsUUFBUyxDQUFBLE1BQUEsQ0FBTyxDQUFDLFFBQXRCLENBQUEsQ0FBaUMsQ0FBQSxDQUFBO0lBSnpCLENBbkRqQjtJQXlEQSxVQUFBLEVBQVksU0FBQSxHQUFBLENBekRaO0lBMkRBLFNBQUEsRUFBVyxTQUFBLEdBQUEsQ0EzRFg7O0FBRkYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsIFwibW92ZS1wYW5lczptb3ZlLXJpZ2h0XCI6ID0+IEBtb3ZlUmlnaHQoKVxuICAgIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJtb3ZlLXBhbmVzOm1vdmUtbGVmdFwiLCA9PiBAbW92ZUxlZnQoKVxuICAgIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJtb3ZlLXBhbmVzOm1vdmUtZG93blwiLCA9PiBAbW92ZURvd24oKVxuICAgIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJtb3ZlLXBhbmVzOm1vdmUtdXBcIiwgPT4gQG1vdmVVcCgpXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcIm1vdmUtcGFuZXM6bW92ZS1uZXh0XCIsID0+IEBtb3ZlTmV4dCgpXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcIm1vdmUtcGFuZXM6bW92ZS1wcmV2aW91c1wiLCA9PiBAbW92ZVByZXZpb3VzKClcblxuICBtb3ZlUmlnaHQ6IC0+IEBtb3ZlICdob3Jpem9udGFsJywgKzFcbiAgbW92ZUxlZnQ6IC0+IEBtb3ZlICdob3Jpem9udGFsJywgLTFcbiAgbW92ZVVwOiAtPiBAbW92ZSAndmVydGljYWwnLCAtMVxuICBtb3ZlRG93bjogLT4gQG1vdmUgJ3ZlcnRpY2FsJywgKzFcbiAgbW92ZU5leHQ6IC0+IEBtb3ZlT3JkZXIgQG5leHRNZXRob2RcbiAgbW92ZVByZXZpb3VzOiAtPiBAbW92ZU9yZGVyIEBwcmV2aW91c01ldGhvZFxuXG4gIG5leHRNZXRob2Q6ICdhY3RpdmF0ZU5leHRQYW5lJ1xuICBwcmV2aW91c01ldGhvZDogJ2FjdGl2YXRlUHJldmlvdXNQYW5lJ1xuXG4gIGFjdGl2ZTogLT4gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG5cbiAgbW92ZU9yZGVyOiAobWV0aG9kKSAtPlxuICAgIHNvdXJjZSA9IEBhY3RpdmUoKVxuICAgIGF0b20ud29ya3NwYWNlW21ldGhvZF0oKVxuICAgIHRhcmdldCA9IEBhY3RpdmUoKVxuICAgIEBzd2FwRWRpdG9yIHNvdXJjZSwgdGFyZ2V0XG5cbiAgbW92ZTogKG9yaWVudGF0aW9uLCBkZWx0YSkgLT5cbiAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgW2F4aXMsY2hpbGRdID0gQGdldEF4aXMgcGFuZSwgb3JpZW50YXRpb25cbiAgICBpZiBheGlzP1xuICAgICAgdGFyZ2V0ID0gQGdldFJlbGF0aXZlUGFuZSBheGlzLCBjaGlsZCwgZGVsdGFcbiAgICBpZiB0YXJnZXQ/XG4gICAgICBAc3dhcEVkaXRvciBwYW5lLCB0YXJnZXRcblxuICBzd2FwRWRpdG9yOiAoc291cmNlLCB0YXJnZXQpIC0+XG4gICAgZWRpdG9yID0gc291cmNlLmdldEFjdGl2ZUl0ZW0oKVxuICAgIHNvdXJjZS5yZW1vdmVJdGVtIGVkaXRvclxuICAgIHRhcmdldC5hZGRJdGVtIGVkaXRvclxuICAgIHRhcmdldC5hY3RpdmF0ZUl0ZW0gZWRpdG9yXG4gICAgdGFyZ2V0LmFjdGl2YXRlKClcblxuICBnZXRBeGlzOiAocGFuZSwgb3JpZW50YXRpb24pIC0+XG4gICAgYXhpcyA9IHBhbmUucGFyZW50XG4gICAgY2hpbGQgPSBwYW5lXG4gICAgd2hpbGUgdHJ1ZVxuICAgICAgcmV0dXJuIHVubGVzcyBheGlzLmNvbnN0cnVjdG9yLm5hbWUgPT0gJ1BhbmVBeGlzJ1xuICAgICAgYnJlYWsgaWYgYXhpcy5vcmllbnRhdGlvbiA9PSBvcmllbnRhdGlvblxuICAgICAgY2hpbGQgPSBheGlzXG4gICAgICBheGlzID0gYXhpcy5wYXJlbnRcbiAgICByZXR1cm4gW2F4aXMsY2hpbGRdXG5cbiAgZ2V0UmVsYXRpdmVQYW5lOiAoYXhpcywgc291cmNlLCBkZWx0YSkgLT5cbiAgICBwb3NpdGlvbiA9IGF4aXMuY2hpbGRyZW4uaW5kZXhPZiBzb3VyY2VcbiAgICB0YXJnZXQgPSBwb3NpdGlvbiArIGRlbHRhXG4gICAgcmV0dXJuIHVubGVzcyB0YXJnZXQgPCBheGlzLmNoaWxkcmVuLmxlbmd0aFxuICAgIHJldHVybiBheGlzLmNoaWxkcmVuW3RhcmdldF0uZ2V0UGFuZXMoKVswXVxuXG4gIGRlYWN0aXZhdGU6IC0+XG5cbiAgc2VyaWFsaXplOiAtPlxuIl19
