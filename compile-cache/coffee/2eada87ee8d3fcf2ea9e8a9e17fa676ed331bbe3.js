(function() {
  var CompositeDisposable, MinimapPigmentsBinding;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  MinimapPigmentsBinding = require('./minimap-pigments-binding');

  module.exports = {
    active: false,
    isActive: function() {
      return this.active;
    },
    activate: function(state) {
      this.bindingsById = {};
      this.subscriptionsById = {};
      return this.subscriptions = new CompositeDisposable;
    },
    consumeMinimapServiceV1: function(minimap1) {
      this.minimap = minimap1;
      return this.minimap.registerPlugin('pigments', this);
    },
    consumePigmentsServiceV1: function(pigments) {
      this.pigments = pigments;
      this.subscriptions.add(this.pigments.getProject().onDidDestroy((function(_this) {
        return function() {
          return _this.pigments = null;
        };
      })(this)));
      if ((this.minimap != null) && this.active) {
        return this.initializeBindings();
      }
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.editorsSubscription.dispose();
      this.minimap.unregisterPlugin('pigments');
      this.minimap = null;
      return this.pigments = null;
    },
    activatePlugin: function() {
      if (this.active) {
        return;
      }
      this.active = true;
      if (this.pigments != null) {
        return this.initializeBindings();
      }
    },
    initializeBindings: function() {
      return this.editorsSubscription = this.pigments.observeColorBuffers((function(_this) {
        return function(colorBuffer) {
          var binding, editor, minimap;
          editor = colorBuffer.editor;
          minimap = _this.minimap.minimapForEditor(editor);
          binding = new MinimapPigmentsBinding({
            editor: editor,
            minimap: minimap,
            colorBuffer: colorBuffer
          });
          _this.bindingsById[editor.id] = binding;
          return _this.subscriptionsById[editor.id] = editor.onDidDestroy(function() {
            var ref;
            if ((ref = _this.subscriptionsById[editor.id]) != null) {
              ref.dispose();
            }
            binding.destroy();
            delete _this.subscriptionsById[editor.id];
            return delete _this.bindingsById[editor.id];
          });
        };
      })(this));
    },
    bindingForEditor: function(editor) {
      if (this.bindingsById[editor.id] != null) {
        return this.bindingsById[editor.id];
      }
    },
    deactivatePlugin: function() {
      var binding, id, ref, ref1;
      if (!this.active) {
        return;
      }
      ref = this.bindingsById;
      for (id in ref) {
        binding = ref[id];
        binding.destroy();
      }
      this.active = false;
      return (ref1 = this.editorsSubscription) != null ? ref1.dispose() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9taW5pbWFwLXBpZ21lbnRzL2xpYi9taW5pbWFwLXBpZ21lbnRzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSOztFQUN4QixzQkFBQSxHQUF5QixPQUFBLENBQVEsNEJBQVI7O0VBRXpCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQVEsS0FBUjtJQUVBLFFBQUEsRUFBVSxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FGVjtJQUlBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUNoQixJQUFDLENBQUEsaUJBQUQsR0FBcUI7YUFDckIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtJQUhiLENBSlY7SUFTQSx1QkFBQSxFQUF5QixTQUFDLFFBQUQ7TUFBQyxJQUFDLENBQUEsVUFBRDthQUN4QixJQUFDLENBQUEsT0FBTyxDQUFDLGNBQVQsQ0FBd0IsVUFBeEIsRUFBb0MsSUFBcEM7SUFEdUIsQ0FUekI7SUFZQSx3QkFBQSxFQUEwQixTQUFDLFFBQUQ7TUFBQyxJQUFDLENBQUEsV0FBRDtNQUN6QixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUFWLENBQUEsQ0FBc0IsQ0FBQyxZQUF2QixDQUFvQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLFFBQUQsR0FBWTtRQUFmO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQyxDQUFuQjtNQUVBLElBQXlCLHNCQUFBLElBQWMsSUFBQyxDQUFBLE1BQXhDO2VBQUEsSUFBQyxDQUFBLGtCQUFELENBQUEsRUFBQTs7SUFId0IsQ0FaMUI7SUFpQkEsVUFBQSxFQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtNQUNBLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxPQUFyQixDQUFBO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBVCxDQUEwQixVQUExQjtNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVc7YUFDWCxJQUFDLENBQUEsUUFBRCxHQUFZO0lBTEYsQ0FqQlo7SUF3QkEsY0FBQSxFQUFnQixTQUFBO01BQ2QsSUFBVSxJQUFDLENBQUEsTUFBWDtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUVWLElBQXlCLHFCQUF6QjtlQUFBLElBQUMsQ0FBQSxrQkFBRCxDQUFBLEVBQUE7O0lBTGMsQ0F4QmhCO0lBK0JBLGtCQUFBLEVBQW9CLFNBQUE7YUFDbEIsSUFBQyxDQUFBLG1CQUFELEdBQXVCLElBQUMsQ0FBQSxRQUFRLENBQUMsbUJBQVYsQ0FBOEIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFdBQUQ7QUFDbkQsY0FBQTtVQUFBLE1BQUEsR0FBUyxXQUFXLENBQUM7VUFDckIsT0FBQSxHQUFVLEtBQUMsQ0FBQSxPQUFPLENBQUMsZ0JBQVQsQ0FBMEIsTUFBMUI7VUFFVixPQUFBLEdBQWMsSUFBQSxzQkFBQSxDQUF1QjtZQUFDLFFBQUEsTUFBRDtZQUFTLFNBQUEsT0FBVDtZQUFrQixhQUFBLFdBQWxCO1dBQXZCO1VBQ2QsS0FBQyxDQUFBLFlBQWEsQ0FBQSxNQUFNLENBQUMsRUFBUCxDQUFkLEdBQTJCO2lCQUUzQixLQUFDLENBQUEsaUJBQWtCLENBQUEsTUFBTSxDQUFDLEVBQVAsQ0FBbkIsR0FBZ0MsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsU0FBQTtBQUNsRCxnQkFBQTs7aUJBQTZCLENBQUUsT0FBL0IsQ0FBQTs7WUFDQSxPQUFPLENBQUMsT0FBUixDQUFBO1lBQ0EsT0FBTyxLQUFDLENBQUEsaUJBQWtCLENBQUEsTUFBTSxDQUFDLEVBQVA7bUJBQzFCLE9BQU8sS0FBQyxDQUFBLFlBQWEsQ0FBQSxNQUFNLENBQUMsRUFBUDtVQUo2QixDQUFwQjtRQVBtQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUI7SUFETCxDQS9CcEI7SUE2Q0EsZ0JBQUEsRUFBa0IsU0FBQyxNQUFEO01BQ2hCLElBQW1DLG9DQUFuQztBQUFBLGVBQU8sSUFBQyxDQUFBLFlBQWEsQ0FBQSxNQUFNLENBQUMsRUFBUCxFQUFyQjs7SUFEZ0IsQ0E3Q2xCO0lBZ0RBLGdCQUFBLEVBQWtCLFNBQUE7QUFDaEIsVUFBQTtNQUFBLElBQUEsQ0FBYyxJQUFDLENBQUEsTUFBZjtBQUFBLGVBQUE7O0FBRUE7QUFBQSxXQUFBLFNBQUE7O1FBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBQTtBQUFBO01BRUEsSUFBQyxDQUFBLE1BQUQsR0FBVTs2REFDVSxDQUFFLE9BQXRCLENBQUE7SUFOZ0IsQ0FoRGxCOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnZXZlbnQta2l0J1xuTWluaW1hcFBpZ21lbnRzQmluZGluZyA9IHJlcXVpcmUgJy4vbWluaW1hcC1waWdtZW50cy1iaW5kaW5nJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2ZTogZmFsc2VcblxuICBpc0FjdGl2ZTogLT4gQGFjdGl2ZVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQGJpbmRpbmdzQnlJZCA9IHt9XG4gICAgQHN1YnNjcmlwdGlvbnNCeUlkID0ge31cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgY29uc3VtZU1pbmltYXBTZXJ2aWNlVjE6IChAbWluaW1hcCkgLT5cbiAgICBAbWluaW1hcC5yZWdpc3RlclBsdWdpbiAncGlnbWVudHMnLCB0aGlzXG5cbiAgY29uc3VtZVBpZ21lbnRzU2VydmljZVYxOiAoQHBpZ21lbnRzKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGlnbWVudHMuZ2V0UHJvamVjdCgpLm9uRGlkRGVzdHJveSA9PiBAcGlnbWVudHMgPSBudWxsXG5cbiAgICBAaW5pdGlhbGl6ZUJpbmRpbmdzKCkgaWYgQG1pbmltYXA/IGFuZCBAYWN0aXZlXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAZWRpdG9yc1N1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICBAbWluaW1hcC51bnJlZ2lzdGVyUGx1Z2luICdwaWdtZW50cydcbiAgICBAbWluaW1hcCA9IG51bGxcbiAgICBAcGlnbWVudHMgPSBudWxsXG5cbiAgYWN0aXZhdGVQbHVnaW46IC0+XG4gICAgcmV0dXJuIGlmIEBhY3RpdmVcblxuICAgIEBhY3RpdmUgPSB0cnVlXG5cbiAgICBAaW5pdGlhbGl6ZUJpbmRpbmdzKCkgaWYgQHBpZ21lbnRzP1xuXG4gIGluaXRpYWxpemVCaW5kaW5nczogLT5cbiAgICBAZWRpdG9yc1N1YnNjcmlwdGlvbiA9IEBwaWdtZW50cy5vYnNlcnZlQ29sb3JCdWZmZXJzIChjb2xvckJ1ZmZlcikgPT5cbiAgICAgIGVkaXRvciA9IGNvbG9yQnVmZmVyLmVkaXRvclxuICAgICAgbWluaW1hcCA9IEBtaW5pbWFwLm1pbmltYXBGb3JFZGl0b3IoZWRpdG9yKVxuXG4gICAgICBiaW5kaW5nID0gbmV3IE1pbmltYXBQaWdtZW50c0JpbmRpbmcoe2VkaXRvciwgbWluaW1hcCwgY29sb3JCdWZmZXJ9KVxuICAgICAgQGJpbmRpbmdzQnlJZFtlZGl0b3IuaWRdID0gYmluZGluZ1xuXG4gICAgICBAc3Vic2NyaXB0aW9uc0J5SWRbZWRpdG9yLmlkXSA9IGVkaXRvci5vbkRpZERlc3Ryb3kgPT5cbiAgICAgICAgQHN1YnNjcmlwdGlvbnNCeUlkW2VkaXRvci5pZF0/LmRpc3Bvc2UoKVxuICAgICAgICBiaW5kaW5nLmRlc3Ryb3koKVxuICAgICAgICBkZWxldGUgQHN1YnNjcmlwdGlvbnNCeUlkW2VkaXRvci5pZF1cbiAgICAgICAgZGVsZXRlIEBiaW5kaW5nc0J5SWRbZWRpdG9yLmlkXVxuXG4gIGJpbmRpbmdGb3JFZGl0b3I6IChlZGl0b3IpIC0+XG4gICAgcmV0dXJuIEBiaW5kaW5nc0J5SWRbZWRpdG9yLmlkXSBpZiBAYmluZGluZ3NCeUlkW2VkaXRvci5pZF0/XG5cbiAgZGVhY3RpdmF0ZVBsdWdpbjogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBhY3RpdmVcblxuICAgIGJpbmRpbmcuZGVzdHJveSgpIGZvciBpZCxiaW5kaW5nIG9mIEBiaW5kaW5nc0J5SWRcblxuICAgIEBhY3RpdmUgPSBmYWxzZVxuICAgIEBlZGl0b3JzU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiJdfQ==
