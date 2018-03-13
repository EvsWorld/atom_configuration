(function() {
  var CompositeDisposable, FilesList, PopupList, ReferencesList, SimpleSelectListView, path,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require('path');

  SimpleSelectListView = require('./SimpleListView');

  CompositeDisposable = require('event-kit').CompositeDisposable;

  PopupList = (function(superClass) {
    extend(PopupList, superClass);

    function PopupList() {
      this.cancel = bind(this.cancel, this);
      return PopupList.__super__.constructor.apply(this, arguments);
    }

    PopupList.prototype.visible = false;

    PopupList.prototype.initialize = function(editor1) {
      this.editor = editor1;
      console.log('popupinit with', this.editor, arguments);
      PopupList.__super__.initialize.apply(this, arguments);
      this.editorView = atom.views.getView(this.editor);
      this.addClass('popover-list atom-css-class-checker-popup');
      this.onConfirm = void 0;
      this.compositeDisposable = new CompositeDisposable;
      return this.compositeDisposable.add(atom.commands.add('.atom-css-class-checker-popup', {
        "atom-css-class-checker:confirm": this.confirmSelection,
        "atom-css-class-checker:select-next": this.selectNextItemView,
        "atom-css-class-checker:select-previous": this.selectPreviousItemView,
        "atom-css-class-checker:cancel": this.cancel
      }));
    };

    PopupList.prototype.confirmed = function(item) {
      return typeof this.onConfirm === "function" ? this.onConfirm(item) : void 0;
    };

    PopupList.prototype.selectNextItemView = function() {
      PopupList.__super__.selectNextItemView.apply(this, arguments);
      return false;
    };

    PopupList.prototype.selectPreviousItemView = function() {
      PopupList.__super__.selectPreviousItemView.apply(this, arguments);
      return false;
    };

    PopupList.prototype.attach = function() {
      var cursorMarker;
      cursorMarker = this.editor.getLastCursor().getMarker();
      this.overlayDecoration = this.editor.decorateMarker(cursorMarker, {
        type: 'overlay',
        position: 'tail',
        item: this
      });
      return this.visible = true;
    };

    PopupList.prototype.toggle = function() {
      if (this.visible) {
        return this.cancel();
      } else {
        return this.attach();
      }
    };

    PopupList.prototype.cancel = function() {
      var ref;
      if (!this.active) {
        return;
      }
      this.visible = false;
      if ((ref = this.overlayDecoration) != null) {
        ref.destroy();
      }
      this.overlayDecoration = void 0;
      this.compositeDisposable.dispose();
      PopupList.__super__.cancel.apply(this, arguments);
      if (!this.editorView.hasFocus()) {
        return this.editorView.focus();
      }
    };

    return PopupList;

  })(SimpleSelectListView);

  ReferencesList = (function(superClass) {
    extend(ReferencesList, superClass);

    function ReferencesList() {
      return ReferencesList.__super__.constructor.apply(this, arguments);
    }

    ReferencesList.prototype.initialize = function(editor) {
      return ReferencesList.__super__.initialize.apply(this, arguments);
    };

    ReferencesList.prototype.viewForItem = function(item) {
      return "<li> <div class='sel'>" + item.sel + "</div> <div class='linepos'>" + (path.basename(item.file)) + ":" + item.pos.start.line + "</div> </li>";
    };

    return ReferencesList;

  })(PopupList);

  FilesList = (function(superClass) {
    extend(FilesList, superClass);

    function FilesList() {
      return FilesList.__super__.constructor.apply(this, arguments);
    }

    FilesList.prototype.initialize = function(editor) {
      FilesList.__super__.initialize.apply(this, arguments);
      return this.title.text("define in:");
    };

    FilesList.prototype.viewForItem = function(item) {
      var prjPath;
      prjPath = atom.project.getPath();
      return "<li> <div class='sel'>" + item.filename + "</div> <div class='linepos'>" + (item.path.replace(prjPath, '.')) + "</div> </li>";
    };

    return FilesList;

  })(PopupList);

  module.exports.PopupList = PopupList;

  module.exports.ReferencesList = ReferencesList;

  module.exports.FilesList = FilesList;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdG9tLWNzcy1jbGFzcy1jaGVja2VyL2xpYi9hdG9tLWNzcy1jbGFzcy1jaGVja2VyLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxxRkFBQTtJQUFBOzs7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSxrQkFBUjs7RUFDdEIsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSOztFQUVsQjs7Ozs7Ozs7d0JBQ0osT0FBQSxHQUFTOzt3QkFFVCxVQUFBLEdBQWEsU0FBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFNBQUQ7TUFDWixPQUFPLENBQUMsR0FBUixDQUFZLGdCQUFaLEVBQThCLElBQUMsQ0FBQSxNQUEvQixFQUF1QyxTQUF2QztNQUNBLDJDQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFDLENBQUEsTUFBcEI7TUFDZCxJQUFDLENBQUEsUUFBRCxDQUFVLDJDQUFWO01BQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYTtNQUViLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJO2FBQzNCLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxHQUFyQixDQUF5QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsK0JBQWxCLEVBQ3ZCO1FBQUEsZ0NBQUEsRUFBa0MsSUFBQyxDQUFBLGdCQUFuQztRQUNBLG9DQUFBLEVBQXNDLElBQUMsQ0FBQSxrQkFEdkM7UUFFQSx3Q0FBQSxFQUEwQyxJQUFDLENBQUEsc0JBRjNDO1FBR0EsK0JBQUEsRUFBaUMsSUFBQyxDQUFBLE1BSGxDO09BRHVCLENBQXpCO0lBUlc7O3dCQWViLFNBQUEsR0FBVyxTQUFDLElBQUQ7b0RBQ1QsSUFBQyxDQUFBLFVBQVc7SUFESDs7d0JBR1gsa0JBQUEsR0FBb0IsU0FBQTtNQUNsQixtREFBQSxTQUFBO2FBQ0E7SUFGa0I7O3dCQUlwQixzQkFBQSxHQUF3QixTQUFBO01BQ3RCLHVEQUFBLFNBQUE7YUFDQTtJQUZzQjs7d0JBb0J4QixNQUFBLEdBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLENBQUEsQ0FBdUIsQ0FBQyxTQUF4QixDQUFBO01BQ2YsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBUixDQUF1QixZQUF2QixFQUFxQztRQUFBLElBQUEsRUFBTSxTQUFOO1FBQWlCLFFBQUEsRUFBVSxNQUEzQjtRQUFtQyxJQUFBLEVBQU0sSUFBekM7T0FBckM7YUFDckIsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUhMOzt3QkFNUixNQUFBLEdBQVEsU0FBQTtNQUNOLElBQUcsSUFBQyxDQUFBLE9BQUo7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUhGOztJQURNOzt3QkFPUixNQUFBLEdBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxJQUFBLENBQWMsSUFBQyxDQUFBLE1BQWY7QUFBQSxlQUFBOztNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVc7O1dBQ08sQ0FBRSxPQUFwQixDQUFBOztNQUNBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtNQUNyQixJQUFDLENBQUEsbUJBQW1CLENBQUMsT0FBckIsQ0FBQTtNQUNBLHVDQUFBLFNBQUE7TUFDQSxJQUFBLENBQU8sSUFBQyxDQUFBLFVBQVUsQ0FBQyxRQUFaLENBQUEsQ0FBUDtlQUNFLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBWixDQUFBLEVBREY7O0lBUE07Ozs7S0ExRGM7O0VBcUVsQjs7Ozs7Ozs2QkFDSixVQUFBLEdBQVksU0FBQyxNQUFEO2FBQ1YsZ0RBQUEsU0FBQTtJQURVOzs2QkFHWixXQUFBLEdBQWEsU0FBQyxJQUFEO2FBQ1gsd0JBQUEsR0FDcUIsSUFBSSxDQUFDLEdBRDFCLEdBQzhCLDhCQUQ5QixHQUV3QixDQUFDLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBSSxDQUFDLElBQW5CLENBQUQsQ0FGeEIsR0FFa0QsR0FGbEQsR0FFcUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFGcEUsR0FFeUU7SUFIOUQ7Ozs7S0FKYzs7RUFVdkI7Ozs7Ozs7d0JBQ0osVUFBQSxHQUFZLFNBQUMsTUFBRDtNQUNWLDJDQUFBLFNBQUE7YUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxZQUFaO0lBRlU7O3dCQUlaLFdBQUEsR0FBYSxTQUFDLElBQUQ7QUFDWCxVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBYixDQUFBO2FBQ1Ysd0JBQUEsR0FDcUIsSUFBSSxDQUFDLFFBRDFCLEdBQ21DLDhCQURuQyxHQUV3QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBVixDQUFrQixPQUFsQixFQUEyQixHQUEzQixDQUFELENBRnhCLEdBRXlEO0lBSjlDOzs7O0tBTFM7O0VBWXhCLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBZixHQUEyQjs7RUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFmLEdBQWdDOztFQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQWYsR0FBMkI7QUFqRzNCIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5TaW1wbGVTZWxlY3RMaXN0VmlldyA9IHJlcXVpcmUgJy4vU2ltcGxlTGlzdFZpZXcnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdldmVudC1raXQnXG5cbmNsYXNzIFBvcHVwTGlzdCBleHRlbmRzIFNpbXBsZVNlbGVjdExpc3RWaWV3XG4gIHZpc2libGU6IGZhbHNlXG5cbiAgaW5pdGlhbGl6ZTogIChAZWRpdG9yKS0+XG4gICAgY29uc29sZS5sb2cgJ3BvcHVwaW5pdCB3aXRoJywgQGVkaXRvciwgYXJndW1lbnRzXG4gICAgc3VwZXJcbiAgICBAZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhAZWRpdG9yKVxuICAgIEBhZGRDbGFzcygncG9wb3Zlci1saXN0IGF0b20tY3NzLWNsYXNzLWNoZWNrZXItcG9wdXAnKVxuICAgIEBvbkNvbmZpcm0gPSB1bmRlZmluZWQ7XG5cbiAgICBAY29tcG9zaXRlRGlzcG9zYWJsZSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGNvbXBvc2l0ZURpc3Bvc2FibGUuYWRkIGF0b20uY29tbWFuZHMuYWRkICcuYXRvbS1jc3MtY2xhc3MtY2hlY2tlci1wb3B1cCcsXG4gICAgICBcImF0b20tY3NzLWNsYXNzLWNoZWNrZXI6Y29uZmlybVwiOiBAY29uZmlybVNlbGVjdGlvbixcbiAgICAgIFwiYXRvbS1jc3MtY2xhc3MtY2hlY2tlcjpzZWxlY3QtbmV4dFwiOiBAc2VsZWN0TmV4dEl0ZW1WaWV3LFxuICAgICAgXCJhdG9tLWNzcy1jbGFzcy1jaGVja2VyOnNlbGVjdC1wcmV2aW91c1wiOiBAc2VsZWN0UHJldmlvdXNJdGVtVmlldyxcbiAgICAgIFwiYXRvbS1jc3MtY2xhc3MtY2hlY2tlcjpjYW5jZWxcIjogQGNhbmNlbFxuXG5cbiAgY29uZmlybWVkOiAoaXRlbSktPlxuICAgIEBvbkNvbmZpcm0/KGl0ZW0pXG5cbiAgc2VsZWN0TmV4dEl0ZW1WaWV3OiAtPlxuICAgIHN1cGVyXG4gICAgZmFsc2VcblxuICBzZWxlY3RQcmV2aW91c0l0ZW1WaWV3OiAtPlxuICAgIHN1cGVyXG4gICAgZmFsc2VcblxuICAjIGNvbnN0cnVjdG9yOiAoc2VyaWFsaXplU3RhdGUpIC0+XG4gICNcbiAgIyAgICMgdGVzdCA9IEBkaXYgY2xhc3M6ICdwYW5lbCwgYm9yZGVyZWQnXG4gICMgICBjb25zb2xlLmxvZyAndGVzdCdcbiAgIyAgIGNvbnNvbGUubG9nIGF0b20ud29ya3NwYWNlVmlld1xuICAjXG4gICMgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAjICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2F0b20tcGFja2FnZTp0b2dnbGUnOiA9PiBAdG9nZ2xlKClcblxuICAjICMgUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgcmV0cmlldmVkIHdoZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWRcbiAgIyBzZXJpYWxpemU6IC0+XG4gICNcbiAgIyAjIFRlYXIgZG93biBhbnkgc3RhdGUgYW5kIGRldGFjaFxuICAjIGRlc3Ryb3k6IC0+XG5cblxuICBhdHRhY2g6IC0+XG4gICAgY3Vyc29yTWFya2VyID0gQGVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0TWFya2VyKClcbiAgICBAb3ZlcmxheURlY29yYXRpb24gPSBAZWRpdG9yLmRlY29yYXRlTWFya2VyKGN1cnNvck1hcmtlciwgdHlwZTogJ292ZXJsYXknLCBwb3NpdGlvbjogJ3RhaWwnLCBpdGVtOiB0aGlzKVxuICAgIEB2aXNpYmxlID0gdHJ1ZVxuXG4gICMgVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHRoaXMgdmlld1xuICB0b2dnbGU6IC0+XG4gICAgaWYgQHZpc2libGVcbiAgICAgIEBjYW5jZWwoKVxuICAgIGVsc2VcbiAgICAgIEBhdHRhY2goKVxuXG5cbiAgY2FuY2VsOiA9PlxuICAgIHJldHVybiB1bmxlc3MgQGFjdGl2ZVxuICAgIEB2aXNpYmxlID0gZmFsc2U7XG4gICAgQG92ZXJsYXlEZWNvcmF0aW9uPy5kZXN0cm95KClcbiAgICBAb3ZlcmxheURlY29yYXRpb24gPSB1bmRlZmluZWRcbiAgICBAY29tcG9zaXRlRGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICBzdXBlclxuICAgIHVubGVzcyBAZWRpdG9yVmlldy5oYXNGb2N1cygpXG4gICAgICBAZWRpdG9yVmlldy5mb2N1cygpXG5cblxuY2xhc3MgUmVmZXJlbmNlc0xpc3QgZXh0ZW5kcyBQb3B1cExpc3RcbiAgaW5pdGlhbGl6ZTogKGVkaXRvciktPlxuICAgIHN1cGVyXG5cbiAgdmlld0Zvckl0ZW06IChpdGVtKS0+XG4gICAgXCI8bGk+XG4gICAgICA8ZGl2IGNsYXNzPSdzZWwnPiN7aXRlbS5zZWx9PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPSdsaW5lcG9zJz4je3BhdGguYmFzZW5hbWUoaXRlbS5maWxlKX06I3tpdGVtLnBvcy5zdGFydC5saW5lfTwvZGl2PlxuICAgIDwvbGk+XCJcblxuY2xhc3MgRmlsZXNMaXN0IGV4dGVuZHMgUG9wdXBMaXN0XG4gIGluaXRpYWxpemU6IChlZGl0b3IpLT5cbiAgICBzdXBlclxuICAgIEB0aXRsZS50ZXh0IFwiZGVmaW5lIGluOlwiXG5cbiAgdmlld0Zvckl0ZW06IChpdGVtKS0+XG4gICAgcHJqUGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRoKCk7XG4gICAgXCI8bGk+XG4gICAgICA8ZGl2IGNsYXNzPSdzZWwnPiN7aXRlbS5maWxlbmFtZX08L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9J2xpbmVwb3MnPiN7aXRlbS5wYXRoLnJlcGxhY2UocHJqUGF0aCwgJy4nKX08L2Rpdj5cbiAgICA8L2xpPlwiXG5cbm1vZHVsZS5leHBvcnRzLlBvcHVwTGlzdCA9IFBvcHVwTGlzdFxubW9kdWxlLmV4cG9ydHMuUmVmZXJlbmNlc0xpc3QgPSBSZWZlcmVuY2VzTGlzdFxubW9kdWxlLmV4cG9ydHMuRmlsZXNMaXN0ID0gRmlsZXNMaXN0XG4iXX0=
