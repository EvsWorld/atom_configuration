(function() {
  var $, PromptView, TextEditorView, View, method, noop, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  noop = function() {};

  method = function(delegate, method) {
    var ref1;
    return (delegate != null ? (ref1 = delegate[method]) != null ? ref1.bind(delegate) : void 0 : void 0) || noop;
  };

  module.exports = PromptView = (function(superClass) {
    extend(PromptView, superClass);

    function PromptView() {
      return PromptView.__super__.constructor.apply(this, arguments);
    }

    PromptView.attach = function() {
      return new PromptView;
    };

    PromptView.content = function() {
      return this.div({
        "class": 'emmet-prompt tool-panel panel-bottom'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'emmet-prompt__input'
          }, function() {
            return _this.subview('panelInput', new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    PromptView.prototype.initialize = function() {
      this.panelEditor = this.panelInput.getModel();
      this.panelEditor.onDidStopChanging((function(_this) {
        return function() {
          if (!_this.attached) {
            return;
          }
          return _this.handleUpdate(_this.panelEditor.getText());
        };
      })(this));
      atom.commands.add(this.panelInput.element, 'core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      return atom.commands.add(this.panelInput.element, 'core:cancel', (function(_this) {
        return function() {
          return _this.cancel();
        };
      })(this));
    };

    PromptView.prototype.show = function(delegate1) {
      var text;
      this.delegate = delegate1 != null ? delegate1 : {};
      this.editor = this.delegate.editor;
      this.editorView = this.delegate.editorView;
      this.panelInput.element.setAttribute('placeholder', this.delegate.label || 'Enter abbreviation');
      this.updated = false;
      this.attach();
      text = this.panelEditor.getText();
      if (text) {
        this.panelEditor.selectAll();
        return this.handleUpdate(text);
      }
    };

    PromptView.prototype.undo = function() {
      if (this.updated) {
        return this.editor.undo();
      }
    };

    PromptView.prototype.handleUpdate = function(text) {
      this.undo();
      this.updated = true;
      return this.editor.transact((function(_this) {
        return function() {
          return method(_this.delegate, 'update')(text);
        };
      })(this));
    };

    PromptView.prototype.confirm = function() {
      this.handleUpdate(this.panelEditor.getText());
      this.trigger('confirm');
      method(this.delegate, 'confirm')();
      return this.detach();
    };

    PromptView.prototype.cancel = function() {
      this.undo();
      this.trigger('cancel');
      method(this.delegate, 'cancel')();
      return this.detach();
    };

    PromptView.prototype.detach = function() {
      var ref1;
      if (!this.hasParent()) {
        return;
      }
      this.detaching = true;
      if ((ref1 = this.prevPane) != null) {
        ref1.activate();
      }
      PromptView.__super__.detach.apply(this, arguments);
      this.detaching = false;
      this.attached = false;
      this.trigger('detach');
      return method(this.delegate, 'hide')();
    };

    PromptView.prototype.attach = function() {
      this.attached = true;
      this.prevPane = atom.workspace.getActivePane();
      atom.workspace.addBottomPanel({
        item: this,
        visible: true
      });
      this.panelInput.focus();
      this.trigger('attach');
      return method(this.delegate, 'show')();
    };

    return PromptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9lbW1ldC9saWIvcHJvbXB0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0RBQUE7SUFBQTs7O0VBQUEsTUFBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBRCxFQUFJLG1DQUFKLEVBQW9COztFQUNwQixJQUFBLEdBQU8sU0FBQSxHQUFBOztFQUVQLE1BQUEsR0FBUyxTQUFDLFFBQUQsRUFBVyxNQUFYO0FBQ1IsUUFBQTt1RUFBaUIsQ0FBRSxJQUFuQixDQUF3QixRQUF4QixvQkFBQSxJQUFxQztFQUQ3Qjs7RUFHVCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0wsVUFBQyxDQUFBLE1BQUQsR0FBUyxTQUFBO2FBQUcsSUFBSTtJQUFQOztJQUVULFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNULElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHNDQUFQO09BQUwsRUFBb0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUVuRCxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxxQkFBUDtXQUFMLEVBQW1DLFNBQUE7bUJBQ2xDLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUEyQixJQUFBLGNBQUEsQ0FBZTtjQUFBLElBQUEsRUFBTSxJQUFOO2FBQWYsQ0FBM0I7VUFEa0MsQ0FBbkM7UUFGbUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBEO0lBRFM7O3lCQU1WLFVBQUEsR0FBWSxTQUFBO01BQ1gsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBQTtNQUNmLElBQUMsQ0FBQSxXQUFXLENBQUMsaUJBQWIsQ0FBK0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQzlC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QUVaLElBQUMsQ0FBQSxPQUFELENBQVMsUUFBVDthQUNBLE1BQUEsQ0FBTyxJQUFDLENBQUEsUUFBUixFQUFrQixNQUFsQixDQUFBLENBQUE7SUFWTzs7eUJBWVIsTUFBQSxHQUFRLFNBQUE7TUFDUCxJQUFDLENBQUEsUUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQTtNQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUE4QjtRQUFBLElBQUEsRUFBTSxJQUFOO1FBQVksT0FBQSxFQUFTLElBQXJCO09BQTlCO01BQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaLENBQUE7TUFDQSxJQUFDLENBQUEsT0FBRCxDQUFTLFFBQVQ7YUFDQSxNQUFBLENBQU8sSUFBQyxDQUFBLFFBQVIsRUFBa0IsTUFBbEIsQ0FBQSxDQUFBO0lBTk87Ozs7S0EvRGdCO0FBUHpCIiwic291cmNlc0NvbnRlbnQiOlsieyQsIFRleHRFZGl0b3JWaWV3LCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xubm9vcCA9IC0+XG5cbm1ldGhvZCA9IChkZWxlZ2F0ZSwgbWV0aG9kKSAtPlxuXHRkZWxlZ2F0ZT9bbWV0aG9kXT8uYmluZChkZWxlZ2F0ZSkgb3Igbm9vcFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBQcm9tcHRWaWV3IGV4dGVuZHMgVmlld1xuXHRAYXR0YWNoOiAtPiBuZXcgUHJvbXB0Vmlld1xuXG5cdEBjb250ZW50OiAtPlxuXHRcdEBkaXYgY2xhc3M6ICdlbW1ldC1wcm9tcHQgdG9vbC1wYW5lbCBwYW5lbC1ib3R0b20nLCA9PlxuXHRcdFx0IyBAbGFiZWwgY2xhc3M6ICdlbW1ldC1wcm9tcHRfX2xhYmVsJywgb3V0bGV0OiAnbGFiZWwnXG5cdFx0XHRAZGl2IGNsYXNzOiAnZW1tZXQtcHJvbXB0X19pbnB1dCcsID0+XG5cdFx0XHRcdEBzdWJ2aWV3ICdwYW5lbElucHV0JywgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG5cblx0aW5pdGlhbGl6ZTogKCkgLT5cblx0XHRAcGFuZWxFZGl0b3IgPSBAcGFuZWxJbnB1dC5nZXRNb2RlbCgpXG5cdFx0QHBhbmVsRWRpdG9yLm9uRGlkU3RvcENoYW5naW5nID0+XG5cdFx0XHRyZXR1cm4gdW5sZXNzIEBhdHRhY2hlZFxuXHRcdFx0QGhhbmRsZVVwZGF0ZSBAcGFuZWxFZGl0b3IuZ2V0VGV4dCgpXG5cdFx0YXRvbS5jb21tYW5kcy5hZGQgQHBhbmVsSW5wdXQuZWxlbWVudCwgJ2NvcmU6Y29uZmlybScsID0+IEBjb25maXJtKClcblx0XHRhdG9tLmNvbW1hbmRzLmFkZCBAcGFuZWxJbnB1dC5lbGVtZW50LCAnY29yZTpjYW5jZWwnLCA9PiBAY2FuY2VsKClcblxuXHRzaG93OiAoQGRlbGVnYXRlPXt9KSAtPlxuXHRcdEBlZGl0b3IgPSBAZGVsZWdhdGUuZWRpdG9yXG5cdFx0QGVkaXRvclZpZXcgPSBAZGVsZWdhdGUuZWRpdG9yVmlld1xuXHRcdCMgQHBhbmVsSW5wdXQuc2V0UGxhY2Vob2xkZXJUZXh0IEBkZWxlZ2F0ZS5sYWJlbCBvciAnRW50ZXIgYWJicmV2aWF0aW9uJ1xuXHRcdEBwYW5lbElucHV0LmVsZW1lbnQuc2V0QXR0cmlidXRlICdwbGFjZWhvbGRlcicsIEBkZWxlZ2F0ZS5sYWJlbCBvciAnRW50ZXIgYWJicmV2aWF0aW9uJ1xuXHRcdEB1cGRhdGVkID0gbm9cblxuXHRcdEBhdHRhY2goKVxuXHRcdHRleHQgPSBAcGFuZWxFZGl0b3IuZ2V0VGV4dCgpXG5cdFx0aWYgdGV4dFxuXHRcdFx0QHBhbmVsRWRpdG9yLnNlbGVjdEFsbCgpXG5cdFx0XHRAaGFuZGxlVXBkYXRlIHRleHRcblxuXHR1bmRvOiAtPlxuXHRcdEBlZGl0b3IudW5kbygpIGlmIEB1cGRhdGVkXG5cblx0aGFuZGxlVXBkYXRlOiAodGV4dCkgLT5cblx0XHRAdW5kbygpXG5cdFx0QHVwZGF0ZWQgPSB5ZXNcblx0XHRAZWRpdG9yLnRyYW5zYWN0ID0+XG5cdFx0XHRtZXRob2QoQGRlbGVnYXRlLCAndXBkYXRlJykodGV4dClcblxuXHRjb25maXJtOiAtPlxuXHRcdEBoYW5kbGVVcGRhdGUgQHBhbmVsRWRpdG9yLmdldFRleHQoKVxuXHRcdEB0cmlnZ2VyICdjb25maXJtJ1xuXHRcdG1ldGhvZChAZGVsZWdhdGUsICdjb25maXJtJykoKVxuXHRcdEBkZXRhY2goKVxuXG5cdGNhbmNlbDogLT5cblx0XHRAdW5kbygpXG5cdFx0QHRyaWdnZXIgJ2NhbmNlbCdcblx0XHRtZXRob2QoQGRlbGVnYXRlLCAnY2FuY2VsJykoKVxuXHRcdEBkZXRhY2goKVxuXG5cdGRldGFjaDogLT5cblx0XHRyZXR1cm4gdW5sZXNzIEBoYXNQYXJlbnQoKVxuXHRcdEBkZXRhY2hpbmcgPSB0cnVlXG5cdFx0QHByZXZQYW5lPy5hY3RpdmF0ZSgpXG5cblx0XHRzdXBlclxuXHRcdEBkZXRhY2hpbmcgPSBmYWxzZVxuXHRcdEBhdHRhY2hlZCA9IGZhbHNlXG5cblx0XHRAdHJpZ2dlciAnZGV0YWNoJ1xuXHRcdG1ldGhvZChAZGVsZWdhdGUsICdoaWRlJykoKVxuXG5cdGF0dGFjaDogLT5cblx0XHRAYXR0YWNoZWQgPSB0cnVlXG5cdFx0QHByZXZQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG5cdFx0YXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoaXRlbTogdGhpcywgdmlzaWJsZTogdHJ1ZSlcblx0XHRAcGFuZWxJbnB1dC5mb2N1cygpXG5cdFx0QHRyaWdnZXIgJ2F0dGFjaCdcblx0XHRtZXRob2QoQGRlbGVnYXRlLCAnc2hvdycpKClcbiJdfQ==
