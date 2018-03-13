(function() {
  var $$, CompositeDisposable, Emitter, ScriptInputView, View, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-space-pen-views'), $$ = _ref1.$$, View = _ref1.View;

  module.exports = ScriptInputView = (function(_super) {
    __extends(ScriptInputView, _super);

    function ScriptInputView() {
      return ScriptInputView.__super__.constructor.apply(this, arguments);
    }

    ScriptInputView.content = function() {
      return this.div({
        "class": 'script-input-view'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'caption'
          }, '');
          return _this.tag('atom-text-editor', {
            mini: '',
            "class": 'editor mini'
          });
        };
      })(this));
    };

    ScriptInputView.prototype.initialize = function(options) {
      this.options = options;
      this.emitter = new Emitter;
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      this.panel.hide();
      this.editor = this.find('atom-text-editor').get(0).getModel();
      if (this.options["default"]) {
        this.editor.setText(this.options["default"]);
        this.editor.selectAll();
      }
      if (this.options.caption) {
        this.find('.caption').text(this.options.caption);
      }
      this.find('atom-text-editor').on('keydown', (function(_this) {
        return function(e) {
          if (e.keyCode === 27) {
            e.stopPropagation();
            _this.emitter.emit('on-cancel');
            return _this.hide();
          }
        };
      })(this));
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:confirm': (function(_this) {
          return function() {
            _this.emitter.emit('on-confirm', _this.editor.getText().trim());
            return _this.hide();
          };
        })(this)
      }));
    };

    ScriptInputView.prototype.onConfirm = function(callback) {
      return this.emitter.on('on-confirm', callback);
    };

    ScriptInputView.prototype.onCancel = function(callback) {
      return this.emitter.on('on-cancel', callback);
    };

    ScriptInputView.prototype.focus = function() {
      return this.find('atom-text-editor').focus();
    };

    ScriptInputView.prototype.show = function() {
      this.panel.show();
      return this.focus();
    };

    ScriptInputView.prototype.hide = function() {
      this.panel.hide();
      return this.destroy();
    };

    ScriptInputView.prototype.destroy = function() {
      var _ref2;
      if ((_ref2 = this.subscriptions) != null) {
        _ref2.dispose();
      }
      return this.panel.destroy();
    };

    return ScriptInputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC1pbnB1dC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvRUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixDQUFBOztBQUFBLEVBQ0EsUUFBYSxPQUFBLENBQVEsc0JBQVIsQ0FBYixFQUFDLFdBQUEsRUFBRCxFQUFLLGFBQUEsSUFETCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG1CQUFQO09BQUwsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUMvQixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxTQUFQO1dBQUwsRUFBdUIsRUFBdkIsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUssa0JBQUwsRUFBeUI7QUFBQSxZQUFBLElBQUEsRUFBTSxFQUFOO0FBQUEsWUFBVSxPQUFBLEVBQU8sYUFBakI7V0FBekIsRUFGK0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDhCQUtBLFVBQUEsR0FBWSxTQUFFLE9BQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFVBQUEsT0FDWixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBTjtPQUE3QixDQUZULENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsSUFBRCxDQUFNLGtCQUFOLENBQXlCLENBQUMsR0FBMUIsQ0FBOEIsQ0FBOUIsQ0FBZ0MsQ0FBQyxRQUFqQyxDQUFBLENBTFYsQ0FBQTtBQVFBLE1BQUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQUQsQ0FBWDtBQUNFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQWdCLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBRCxDQUF4QixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBREEsQ0FERjtPQVJBO0FBYUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBWjtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxVQUFOLENBQWlCLENBQUMsSUFBbEIsQ0FBdUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFoQyxDQUFBLENBREY7T0FiQTtBQUFBLE1BZ0JBLElBQUMsQ0FBQSxJQUFELENBQU0sa0JBQU4sQ0FBeUIsQ0FBQyxFQUExQixDQUE2QixTQUE3QixFQUF3QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7QUFDdEMsVUFBQSxJQUFHLENBQUMsQ0FBQyxPQUFGLEtBQWEsRUFBaEI7QUFDRSxZQUFBLENBQUMsQ0FBQyxlQUFGLENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxXQUFkLENBREEsQ0FBQTttQkFFQSxLQUFDLENBQUEsSUFBRCxDQUFBLEVBSEY7V0FEc0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QyxDQWhCQSxDQUFBO0FBQUEsTUFzQkEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQXRCakIsQ0FBQTthQXVCQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtBQUFBLFFBQUEsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNkLFlBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsWUFBZCxFQUE0QixLQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUFpQixDQUFDLElBQWxCLENBQUEsQ0FBNUIsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFGYztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO09BRGlCLENBQW5CLEVBeEJVO0lBQUEsQ0FMWixDQUFBOztBQUFBLDhCQWtDQSxTQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7YUFBYyxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxZQUFaLEVBQTBCLFFBQTFCLEVBQWQ7SUFBQSxDQWxDWCxDQUFBOztBQUFBLDhCQW1DQSxRQUFBLEdBQVUsU0FBQyxRQUFELEdBQUE7YUFBYyxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxXQUFaLEVBQXlCLFFBQXpCLEVBQWQ7SUFBQSxDQW5DVixDQUFBOztBQUFBLDhCQXFDQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQ0wsSUFBQyxDQUFBLElBQUQsQ0FBTSxrQkFBTixDQUF5QixDQUFDLEtBQTFCLENBQUEsRUFESztJQUFBLENBckNQLENBQUE7O0FBQUEsOEJBd0NBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixNQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxLQUFELENBQUEsRUFGSTtJQUFBLENBeENOLENBQUE7O0FBQUEsOEJBNENBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixNQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELENBQUEsRUFGSTtJQUFBLENBNUNOLENBQUE7O0FBQUEsOEJBZ0RBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLEtBQUE7O2FBQWMsQ0FBRSxPQUFoQixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBQSxFQUZPO0lBQUEsQ0FoRFQsQ0FBQTs7MkJBQUE7O0tBRDRCLEtBSjlCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/script-input-view.coffee
