(function() {
  var $, Module, NonEditableEditorView, TextEditorView, View, path, ref, removeModuleWrapper,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  Module = require('module');

  path = require('path');

  removeModuleWrapper = function(str) {
    var lines, popItem;
    lines = str.split('\n');
    lines = lines.filter(function(line) {
      if (line === Module.wrapper[0]) {
        return false;
      }
      return true;
    });
    lines = lines.map(function(line) {
      if (line.indexOf(Module.wrapper[0]) >= 0) {
        return line.replace(Module.wrapper[0], '');
      }
      return line;
    });
    popItem = null;
    lines.pop();
    return lines.join('\n');
  };

  module.exports = NonEditableEditorView = (function(superClass) {
    extend(NonEditableEditorView, superClass);

    function NonEditableEditorView() {
      return NonEditableEditorView.__super__.constructor.apply(this, arguments);
    }

    NonEditableEditorView.content = TextEditorView.content;

    NonEditableEditorView.prototype.initialize = function(opts) {
      this.uri = opts.uri, this._debugger = opts._debugger;
      if (opts.script) {
        this.id = opts.script.id;
        this.onDone();
        return this.setText(removeModuleWrapper(script.source));
      }
      if (opts.id) {
        this.id = opts.id;
        this._debugger.getScriptById(this.id).then((function(_this) {
          return function(script) {
            _this.script = script;
            _this.setText(removeModuleWrapper(script.source));
            return _this.onDone();
          };
        })(this)).then((function(_this) {
          return function() {};
        })(this));
      }
      return this.title = opts.query.name;
    };

    NonEditableEditorView.prototype.onDone = function() {
      var extname, grammar;
      extname = path.extname(this.script.name);
      if (extname === '.js') {
        grammar = atom.grammars.grammarForScopeName('source.js');
      } else if (extname === '.coffee') {
        grammar = atom.grammars.grammarForScopeName('source.coffee');
      } else {
        return;
      }
      return this.getModel().setGrammar(grammar);
    };

    NonEditableEditorView.prototype.setCursorBufferPosition = function(opts) {
      return this.getModel().setCursorBufferPosition(opts, {
        autoscroll: true
      });
    };

    NonEditableEditorView.prototype.markBufferPosition = function(opts) {
      return this.getModel().markBufferPosition(opts);
    };

    NonEditableEditorView.prototype.decorateMarker = function(marker, opts) {
      return this.getModel().decorateMarker(marker, opts);
    };

    NonEditableEditorView.prototype.serialize = function() {
      return {
        uri: this.uri,
        id: this.id,
        script: this.script
      };
    };

    NonEditableEditorView.prototype.deserialize = function(state) {
      return new NonEditableEditorView(state);
    };

    NonEditableEditorView.prototype.getTitle = function() {
      return this.title || 'NativeScript';
    };

    NonEditableEditorView.prototype.getUri = function() {
      return this.uri;
    };

    return NonEditableEditorView;

  })(TextEditorView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9ub24tZWRpdGFibGUtZWRpdG9yLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0ZBQUE7SUFBQTs7O0VBQUEsTUFBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBRCxFQUFJLGVBQUosRUFBVTs7RUFDVixNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBQ1QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLG1CQUFBLEdBQXNCLFNBQUMsR0FBRDtBQUNwQixRQUFBO0lBQUEsS0FBQSxHQUFRLEdBQUcsQ0FBQyxLQUFKLENBQVUsSUFBVjtJQUVSLEtBQUEsR0FBUSxLQUFLLENBQUMsTUFBTixDQUFhLFNBQUMsSUFBRDtNQUNuQixJQUFnQixJQUFBLEtBQVEsTUFBTSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQXZDO0FBQUEsZUFBTyxNQUFQOztBQUNBLGFBQU87SUFGWSxDQUFiO0lBSVIsS0FBQSxHQUFRLEtBQUssQ0FBQyxHQUFOLENBQVUsU0FBQyxJQUFEO01BQ2hCLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFNLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBNUIsQ0FBQSxJQUFtQyxDQUF0QztBQUNFLGVBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFNLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBNUIsRUFBZ0MsRUFBaEMsRUFEVDs7QUFFQSxhQUFPO0lBSFMsQ0FBVjtJQUtSLE9BQUEsR0FBVTtJQUNWLEtBQUssQ0FBQyxHQUFOLENBQUE7V0FDQSxLQUFLLENBQUMsSUFBTixDQUFXLElBQVg7RUFkb0I7O0VBZ0J0QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0oscUJBQUMsQ0FBQSxPQUFELEdBQVUsY0FBYyxDQUFDOztvQ0FFekIsVUFBQSxHQUFZLFNBQUMsSUFBRDtNQUVSLElBQUMsQ0FBQSxXQUFBLEdBREgsRUFFRSxJQUFDLENBQUEsaUJBQUE7TUFHSCxJQUFJLElBQUksQ0FBQyxNQUFUO1FBQ0UsSUFBQyxDQUFBLEVBQUQsR0FBTSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2xCLElBQUMsQ0FBQSxNQUFELENBQUE7QUFDQSxlQUFPLElBQUMsQ0FBQSxPQUFELENBQVMsbUJBQUEsQ0FBb0IsTUFBTSxDQUFDLE1BQTNCLENBQVQsRUFIVDs7TUFLQSxJQUFJLElBQUksQ0FBQyxFQUFUO1FBQ0UsSUFBQyxDQUFBLEVBQUQsR0FBTSxJQUFJLENBQUM7UUFDWCxJQUFDLENBQUEsU0FDQyxDQUFDLGFBREgsQ0FDaUIsSUFBQyxDQUFBLEVBRGxCLENBRUUsQ0FBQyxJQUZILENBRVEsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxNQUFEO1lBQ0osS0FBQyxDQUFBLE1BQUQsR0FBVTtZQUNWLEtBQUMsQ0FBQSxPQUFELENBQVMsbUJBQUEsQ0FBb0IsTUFBTSxDQUFDLE1BQTNCLENBQVQ7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBQTtVQUhJO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZSLENBTUUsQ0FBQyxJQU5ILENBTVEsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQSxHQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU5SLEVBRkY7O2FBVUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBckJWOztvQ0F1QlosTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFyQjtNQUNWLElBQUcsT0FBQSxLQUFXLEtBQWQ7UUFDRSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxXQUFsQyxFQURaO09BQUEsTUFFSyxJQUFHLE9BQUEsS0FBVyxTQUFkO1FBQ0gsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQWQsQ0FBa0MsZUFBbEMsRUFEUDtPQUFBLE1BQUE7QUFHSCxlQUhHOzthQUtMLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBVyxDQUFDLFVBQVosQ0FBdUIsT0FBdkI7SUFUTTs7b0NBV1IsdUJBQUEsR0FBeUIsU0FBQyxJQUFEO2FBQ3ZCLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBVyxDQUFDLHVCQUFaLENBQW9DLElBQXBDLEVBQTBDO1FBQUEsVUFBQSxFQUFZLElBQVo7T0FBMUM7SUFEdUI7O29DQUd6QixrQkFBQSxHQUFvQixTQUFDLElBQUQ7YUFDbEIsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFXLENBQUMsa0JBQVosQ0FBK0IsSUFBL0I7SUFEa0I7O29DQUdwQixjQUFBLEdBQWdCLFNBQUMsTUFBRCxFQUFTLElBQVQ7YUFDZCxJQUFDLENBQUEsUUFBRCxDQUFBLENBQVcsQ0FBQyxjQUFaLENBQTJCLE1BQTNCLEVBQW1DLElBQW5DO0lBRGM7O29DQUdoQixTQUFBLEdBQVcsU0FBQTthQUNUO1FBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxHQUFOO1FBQ0EsRUFBQSxFQUFJLElBQUMsQ0FBQSxFQURMO1FBRUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxNQUZUOztJQURTOztvQ0FLWCxXQUFBLEdBQWEsU0FBQyxLQUFEO0FBQ1gsYUFBTyxJQUFJLHFCQUFKLENBQTBCLEtBQTFCO0lBREk7O29DQUdiLFFBQUEsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEtBQUQsSUFBVTtJQURGOztvQ0FHVixNQUFBLEdBQVEsU0FBQTthQUNOLElBQUMsQ0FBQTtJQURLOzs7O0tBekQwQjtBQXJCcEMiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCwgVmlldywgVGV4dEVkaXRvclZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5Nb2R1bGUgPSByZXF1aXJlICdtb2R1bGUnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxucmVtb3ZlTW9kdWxlV3JhcHBlciA9IChzdHIpIC0+XG4gIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKTtcblxuICBsaW5lcyA9IGxpbmVzLmZpbHRlciAobGluZSkgLT5cbiAgICByZXR1cm4gZmFsc2UgaWYgbGluZSBpcyBNb2R1bGUud3JhcHBlclswXVxuICAgIHJldHVybiB0cnVlXG5cbiAgbGluZXMgPSBsaW5lcy5tYXAgKGxpbmUpIC0+XG4gICAgaWYgbGluZS5pbmRleE9mKE1vZHVsZS53cmFwcGVyWzBdKSA+PSAwXG4gICAgICByZXR1cm4gbGluZS5yZXBsYWNlKE1vZHVsZS53cmFwcGVyWzBdLCAnJylcbiAgICByZXR1cm4gbGluZVxuXG4gIHBvcEl0ZW0gPSBudWxsXG4gIGxpbmVzLnBvcCgpXG4gIGxpbmVzLmpvaW4oJ1xcbicpXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE5vbkVkaXRhYmxlRWRpdG9yVmlldyBleHRlbmRzIFRleHRFZGl0b3JWaWV3XG4gIEBjb250ZW50OiBUZXh0RWRpdG9yVmlldy5jb250ZW50XG5cbiAgaW5pdGlhbGl6ZTogKG9wdHMpIC0+XG4gICAge1xuICAgICAgQHVyaSxcbiAgICAgIEBfZGVidWdnZXIsXG4gICAgfSA9IG9wdHNcblxuICAgIGlmIChvcHRzLnNjcmlwdClcbiAgICAgIEBpZCA9IG9wdHMuc2NyaXB0LmlkXG4gICAgICBAb25Eb25lKClcbiAgICAgIHJldHVybiBAc2V0VGV4dCByZW1vdmVNb2R1bGVXcmFwcGVyKHNjcmlwdC5zb3VyY2UpXG5cbiAgICBpZiAob3B0cy5pZClcbiAgICAgIEBpZCA9IG9wdHMuaWRcbiAgICAgIEBfZGVidWdnZXJcbiAgICAgICAgLmdldFNjcmlwdEJ5SWQoQGlkKVxuICAgICAgICAudGhlbiAoc2NyaXB0KSA9PlxuICAgICAgICAgIEBzY3JpcHQgPSBzY3JpcHRcbiAgICAgICAgICBAc2V0VGV4dCByZW1vdmVNb2R1bGVXcmFwcGVyKHNjcmlwdC5zb3VyY2UpXG4gICAgICAgICAgQG9uRG9uZSgpXG4gICAgICAgIC50aGVuID0+XG5cbiAgICBAdGl0bGUgPSBvcHRzLnF1ZXJ5Lm5hbWVcblxuICBvbkRvbmU6IC0+XG4gICAgZXh0bmFtZSA9IHBhdGguZXh0bmFtZShAc2NyaXB0Lm5hbWUpXG4gICAgaWYgZXh0bmFtZSBpcyAnLmpzJ1xuICAgICAgZ3JhbW1hciA9IGF0b20uZ3JhbW1hcnMuZ3JhbW1hckZvclNjb3BlTmFtZSgnc291cmNlLmpzJylcbiAgICBlbHNlIGlmIGV4dG5hbWUgaXMgJy5jb2ZmZWUnXG4gICAgICBncmFtbWFyID0gYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKCdzb3VyY2UuY29mZmVlJylcbiAgICBlbHNlXG4gICAgICByZXR1cm5cblxuICAgIEBnZXRNb2RlbCgpLnNldEdyYW1tYXIoZ3JhbW1hcilcblxuICBzZXRDdXJzb3JCdWZmZXJQb3NpdGlvbjogKG9wdHMpLT5cbiAgICBAZ2V0TW9kZWwoKS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBvcHRzLCBhdXRvc2Nyb2xsOiB0cnVlXG5cbiAgbWFya0J1ZmZlclBvc2l0aW9uOiAob3B0cykgLT5cbiAgICBAZ2V0TW9kZWwoKS5tYXJrQnVmZmVyUG9zaXRpb24ob3B0cylcblxuICBkZWNvcmF0ZU1hcmtlcjogKG1hcmtlciwgb3B0cykgLT5cbiAgICBAZ2V0TW9kZWwoKS5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIG9wdHMpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIHVyaTogQHVyaVxuICAgIGlkOiBAaWRcbiAgICBzY3JpcHQ6IEBzY3JpcHRcblxuICBkZXNlcmlhbGl6ZTogKHN0YXRlKSAtPlxuICAgIHJldHVybiBuZXcgTm9uRWRpdGFibGVFZGl0b3JWaWV3KHN0YXRlKVxuXG4gIGdldFRpdGxlOiAtPlxuICAgIEB0aXRsZSBvciAnTmF0aXZlU2NyaXB0J1xuXG4gIGdldFVyaTogLT5cbiAgICBAdXJpXG4iXX0=
