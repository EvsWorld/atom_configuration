Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbEventKit = require('sb-event-kit');

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _editors = require('./editors');

var _editors2 = _interopRequireDefault(_editors);

var _treeView = require('./tree-view');

var _treeView2 = _interopRequireDefault(_treeView);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _statusBar = require('./status-bar');

var _statusBar2 = _interopRequireDefault(_statusBar);

var _busySignal = require('./busy-signal');

var _busySignal2 = _interopRequireDefault(_busySignal);

var _intentions = require('./intentions');

var _intentions2 = _interopRequireDefault(_intentions);

var LinterUI = (function () {
  function LinterUI() {
    var _this = this;

    _classCallCheck(this, LinterUI);

    this.name = 'Linter';
    this.signal = new _busySignal2['default']();
    this.treeview = new _treeView2['default']();
    this.commands = new _commands2['default']();
    this.messages = [];
    this.statusBar = new _statusBar2['default']();
    this.intentions = new _intentions2['default']();
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.signal);
    this.subscriptions.add(this.treeview);
    this.subscriptions.add(this.commands);
    this.subscriptions.add(this.statusBar);

    this.subscriptions.add(atom.config.observe('linter-ui-default.showPanel', function (showPanel) {
      if (showPanel && !_this.panel) {
        _this.panel = new _panel2['default']();
        _this.panel.update(_this.messages);
      } else if (!showPanel && _this.panel) {
        _this.panel.dispose();
        _this.panel = null;
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showDecorations', function (showDecorations) {
      if (showDecorations && !_this.editors) {
        _this.editors = new _editors2['default']();
        _this.editors.update({ added: _this.messages, removed: [], messages: _this.messages });
      } else if (!showDecorations && _this.editors) {
        _this.editors.dispose();
        _this.editors = null;
      }
    }));
  }

  _createClass(LinterUI, [{
    key: 'render',
    value: function render(difference) {
      var editors = this.editors;

      this.messages = difference.messages;
      if (editors) {
        if (editors.isFirstRender()) {
          editors.update({ added: difference.messages, removed: [], messages: difference.messages });
        } else {
          editors.update(difference);
        }
      }
      if (this.panel) {
        this.panel.update(difference.messages);
      }
      this.commands.update(difference.messages);
      this.treeview.update(difference.messages);
      this.intentions.update(difference.messages);
      this.statusBar.update(difference.messages);
    }
  }, {
    key: 'didBeginLinting',
    value: function didBeginLinting(linter, filePath) {
      this.signal.didBeginLinting(linter, filePath);
    }
  }, {
    key: 'didFinishLinting',
    value: function didFinishLinting(linter, filePath) {
      this.signal.didFinishLinting(linter, filePath);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      if (this.panel) {
        this.panel.dispose();
      }
      if (this.editors) {
        this.editors.dispose();
      }
    }
  }]);

  return LinterUI;
})();

exports['default'] = LinterUI;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzswQkFFb0MsY0FBYzs7cUJBQ2hDLFNBQVM7Ozs7dUJBQ1AsV0FBVzs7Ozt3QkFDVixhQUFhOzs7O3dCQUNiLFlBQVk7Ozs7eUJBQ1gsY0FBYzs7OzswQkFDYixlQUFlOzs7OzBCQUNmLGNBQWM7Ozs7SUFHaEIsUUFBUTtBQVloQixXQVpRLFFBQVEsR0FZYjs7OzBCQVpLLFFBQVE7O0FBYXpCLFFBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxNQUFNLEdBQUcsNkJBQWdCLENBQUE7QUFDOUIsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxRQUFRLEdBQUcsMkJBQWMsQ0FBQTtBQUM5QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsU0FBUyxHQUFHLDRCQUFlLENBQUE7QUFDaEMsUUFBSSxDQUFDLFVBQVUsR0FBRyw2QkFBZ0IsQ0FBQTtBQUNsQyxRQUFJLENBQUMsYUFBYSxHQUFHLHFDQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbkMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7O0FBRXRDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDZCQUE2QixF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QUFPLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDdkI7S0FDRjs7O1NBL0VrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ3NiLWV2ZW50LWtpdCdcbmltcG9ydCBQYW5lbCBmcm9tICcuL3BhbmVsJ1xuaW1wb3J0IEVkaXRvcnMgZnJvbSAnLi9lZGl0b3JzJ1xuaW1wb3J0IFRyZWVWaWV3IGZyb20gJy4vdHJlZS12aWV3J1xuaW1wb3J0IENvbW1hbmRzIGZyb20gJy4vY29tbWFuZHMnXG5pbXBvcnQgU3RhdHVzQmFyIGZyb20gJy4vc3RhdHVzLWJhcidcbmltcG9ydCBCdXN5U2lnbmFsIGZyb20gJy4vYnVzeS1zaWduYWwnXG5pbXBvcnQgSW50ZW50aW9ucyBmcm9tICcuL2ludGVudGlvbnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlciwgTGludGVyTWVzc2FnZSwgTWVzc2FnZXNQYXRjaCB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbnRlclVJIHtcbiAgbmFtZTogc3RyaW5nO1xuICBwYW5lbDogP1BhbmVsO1xuICBzaWduYWw6IEJ1c3lTaWduYWw7XG4gIGVkaXRvcnM6ID9FZGl0b3JzO1xuICB0cmVldmlldzogVHJlZVZpZXc7XG4gIGNvbW1hbmRzOiBDb21tYW5kcztcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+O1xuICBzdGF0dXNCYXI6IFN0YXR1c0JhcjtcbiAgaW50ZW50aW9uczogSW50ZW50aW9ucztcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5hbWUgPSAnTGludGVyJ1xuICAgIHRoaXMuc2lnbmFsID0gbmV3IEJ1c3lTaWduYWwoKVxuICAgIHRoaXMudHJlZXZpZXcgPSBuZXcgVHJlZVZpZXcoKVxuICAgIHRoaXMuY29tbWFuZHMgPSBuZXcgQ29tbWFuZHMoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3RhdHVzQmFyID0gbmV3IFN0YXR1c0JhcigpXG4gICAgdGhpcy5pbnRlbnRpb25zID0gbmV3IEludGVudGlvbnMoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5zaWduYWwpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnRyZWV2aWV3KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb21tYW5kcylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuc3RhdHVzQmFyKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zaG93UGFuZWwnLCAoc2hvd1BhbmVsKSA9PiB7XG4gICAgICBpZiAoc2hvd1BhbmVsICYmICF0aGlzLnBhbmVsKSB7XG4gICAgICAgIHRoaXMucGFuZWwgPSBuZXcgUGFuZWwoKVxuICAgICAgICB0aGlzLnBhbmVsLnVwZGF0ZSh0aGlzLm1lc3NhZ2VzKVxuICAgICAgfSBlbHNlIGlmICghc2hvd1BhbmVsICYmIHRoaXMucGFuZWwpIHtcbiAgICAgICAgdGhpcy5wYW5lbC5kaXNwb3NlKClcbiAgICAgICAgdGhpcy5wYW5lbCA9IG51bGxcbiAgICAgIH1cbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dEZWNvcmF0aW9ucycsIChzaG93RGVjb3JhdGlvbnMpID0+IHtcbiAgICAgIGlmIChzaG93RGVjb3JhdGlvbnMgJiYgIXRoaXMuZWRpdG9ycykge1xuICAgICAgICB0aGlzLmVkaXRvcnMgPSBuZXcgRWRpdG9ycygpXG4gICAgICAgIHRoaXMuZWRpdG9ycy51cGRhdGUoeyBhZGRlZDogdGhpcy5tZXNzYWdlcywgcmVtb3ZlZDogW10sIG1lc3NhZ2VzOiB0aGlzLm1lc3NhZ2VzIH0pXG4gICAgICB9IGVsc2UgaWYgKCFzaG93RGVjb3JhdGlvbnMgJiYgdGhpcy5lZGl0b3JzKSB7XG4gICAgICAgIHRoaXMuZWRpdG9ycy5kaXNwb3NlKClcbiAgICAgICAgdGhpcy5lZGl0b3JzID0gbnVsbFxuICAgICAgfVxuICAgIH0pKVxuICB9XG4gIHJlbmRlcihkaWZmZXJlbmNlOiBNZXNzYWdlc1BhdGNoKSB7XG4gICAgY29uc3QgZWRpdG9ycyA9IHRoaXMuZWRpdG9yc1xuXG4gICAgdGhpcy5tZXNzYWdlcyA9IGRpZmZlcmVuY2UubWVzc2FnZXNcbiAgICBpZiAoZWRpdG9ycykge1xuICAgICAgaWYgKGVkaXRvcnMuaXNGaXJzdFJlbmRlcigpKSB7XG4gICAgICAgIGVkaXRvcnMudXBkYXRlKHsgYWRkZWQ6IGRpZmZlcmVuY2UubWVzc2FnZXMsIHJlbW92ZWQ6IFtdLCBtZXNzYWdlczogZGlmZmVyZW5jZS5tZXNzYWdlcyB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWRpdG9ycy51cGRhdGUoZGlmZmVyZW5jZSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gICAgfVxuICAgIHRoaXMuY29tbWFuZHMudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gICAgdGhpcy50cmVldmlldy51cGRhdGUoZGlmZmVyZW5jZS5tZXNzYWdlcylcbiAgICB0aGlzLmludGVudGlvbnMudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gICAgdGhpcy5zdGF0dXNCYXIudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gIH1cbiAgZGlkQmVnaW5MaW50aW5nKGxpbnRlcjogTGludGVyLCBmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5zaWduYWwuZGlkQmVnaW5MaW50aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gIH1cbiAgZGlkRmluaXNoTGludGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuc2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyLCBmaWxlUGF0aClcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5kaXNwb3NlKClcbiAgICB9XG4gICAgaWYgKHRoaXMuZWRpdG9ycykge1xuICAgICAgdGhpcy5lZGl0b3JzLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxufVxuIl19