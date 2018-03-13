Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var ScriptInputView = (function (_View) {
  _inherits(ScriptInputView, _View);

  function ScriptInputView() {
    _classCallCheck(this, ScriptInputView);

    _get(Object.getPrototypeOf(ScriptInputView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ScriptInputView, [{
    key: 'initialize',
    value: function initialize(options) {
      var _this = this;

      this.options = options;
      this.emitter = new _atom.Emitter();

      this.panel = atom.workspace.addModalPanel({ item: this });
      this.panel.hide();

      this.editor = this.find('atom-text-editor').get(0).getModel();

      // set default text
      if (this.options['default']) {
        this.editor.setText(this.options['default']);
        this.editor.selectAll();
      }

      // caption text
      if (this.options.caption) {
        this.find('.caption').text(this.options.caption);
      }

      this.find('atom-text-editor').on('keydown', function (e) {
        if (e.keyCode === 27) {
          e.stopPropagation();
          _this.emitter.emit('on-cancel');
          _this.hide();
        }
      });

      this.subscriptions = new _atom.CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:confirm': function coreConfirm() {
          _this.emitter.emit('on-confirm', _this.editor.getText().trim());
          _this.hide();
        }
      }));
    }
  }, {
    key: 'onConfirm',
    value: function onConfirm(callback) {
      return this.emitter.on('on-confirm', callback);
    }
  }, {
    key: 'onCancel',
    value: function onCancel(callback) {
      return this.emitter.on('on-cancel', callback);
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.find('atom-text-editor').focus();
    }
  }, {
    key: 'show',
    value: function show() {
      this.panel.show();
      this.focus();
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.panel.hide();
      this.destroy();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.subscriptions) this.subscriptions.dispose();
      this.panel.destroy();
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this2 = this;

      this.div({ 'class': 'script-input-view' }, function () {
        _this2.div({ 'class': 'caption' }, '');
        _this2.tag('atom-text-editor', { mini: '', 'class': 'editor mini' });
      });
    }
  }]);

  return ScriptInputView;
})(_atomSpacePenViews.View);

exports['default'] = ScriptInputView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9zY3JpcHQtaW5wdXQtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRTZDLE1BQU07O2lDQUM5QixzQkFBc0I7O0FBSDNDLFdBQVcsQ0FBQzs7SUFLUyxlQUFlO1lBQWYsZUFBZTs7V0FBZixlQUFlOzBCQUFmLGVBQWU7OytCQUFmLGVBQWU7OztlQUFmLGVBQWU7O1dBUXhCLG9CQUFDLE9BQU8sRUFBRTs7O0FBQ2xCLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQzs7QUFFN0IsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzFELFVBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7O0FBRzlELFVBQUksSUFBSSxDQUFDLE9BQU8sV0FBUSxFQUFFO0FBQ3hCLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLFdBQVEsQ0FBQyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7T0FDekI7OztBQUdELFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDeEIsWUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUNsRDs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFDLENBQUMsRUFBSztBQUNqRCxZQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssRUFBRSxFQUFFO0FBQ3BCLFdBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUNwQixnQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQy9CLGdCQUFLLElBQUksRUFBRSxDQUFDO1NBQ2I7T0FDRixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCxzQkFBYyxFQUFFLHVCQUFNO0FBQ3BCLGdCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLE1BQUssTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUQsZ0JBQUssSUFBSSxFQUFFLENBQUM7U0FDYjtPQUNGLENBQUMsQ0FBQyxDQUFDO0tBQ0w7OztXQUVRLG1CQUFDLFFBQVEsRUFBRTtBQUNsQixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNoRDs7O1dBRU8sa0JBQUMsUUFBUSxFQUFFO0FBQ2pCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQy9DOzs7V0FFSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUN2Qzs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNkOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2hCOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3JELFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDdEI7OztXQXJFYSxtQkFBRzs7O0FBQ2YsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQU8sbUJBQW1CLEVBQUUsRUFBRSxZQUFNO0FBQzdDLGVBQUssR0FBRyxDQUFDLEVBQUUsU0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNuQyxlQUFLLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBTyxhQUFhLEVBQUUsQ0FBQyxDQUFDO09BQ2xFLENBQUMsQ0FBQztLQUNKOzs7U0FOa0IsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC1pbnB1dC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IEVtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCB7IFZpZXcgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmlwdElucHV0VmlldyBleHRlbmRzIFZpZXcge1xuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICB0aGlzLmRpdih7IGNsYXNzOiAnc2NyaXB0LWlucHV0LXZpZXcnIH0sICgpID0+IHtcbiAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdjYXB0aW9uJyB9LCAnJyk7XG4gICAgICB0aGlzLnRhZygnYXRvbS10ZXh0LWVkaXRvcicsIHsgbWluaTogJycsIGNsYXNzOiAnZWRpdG9yIG1pbmknIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiB0aGlzIH0pO1xuICAgIHRoaXMucGFuZWwuaGlkZSgpO1xuXG4gICAgdGhpcy5lZGl0b3IgPSB0aGlzLmZpbmQoJ2F0b20tdGV4dC1lZGl0b3InKS5nZXQoMCkuZ2V0TW9kZWwoKTtcblxuICAgIC8vIHNldCBkZWZhdWx0IHRleHRcbiAgICBpZiAodGhpcy5vcHRpb25zLmRlZmF1bHQpIHtcbiAgICAgIHRoaXMuZWRpdG9yLnNldFRleHQodGhpcy5vcHRpb25zLmRlZmF1bHQpO1xuICAgICAgdGhpcy5lZGl0b3Iuc2VsZWN0QWxsKCk7XG4gICAgfVxuXG4gICAgLy8gY2FwdGlvbiB0ZXh0XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jYXB0aW9uKSB7XG4gICAgICB0aGlzLmZpbmQoJy5jYXB0aW9uJykudGV4dCh0aGlzLm9wdGlvbnMuY2FwdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5maW5kKCdhdG9tLXRleHQtZWRpdG9yJykub24oJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMjcpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ29uLWNhbmNlbCcpO1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnY29yZTpjb25maXJtJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb24tY29uZmlybScsIHRoaXMuZWRpdG9yLmdldFRleHQoKS50cmltKCkpO1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH0sXG4gICAgfSkpO1xuICB9XG5cbiAgb25Db25maXJtKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignb24tY29uZmlybScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uQ2FuY2VsKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignb24tY2FuY2VsJywgY2FsbGJhY2spO1xuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5maW5kKCdhdG9tLXRleHQtZWRpdG9yJykuZm9jdXMoKTtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgdGhpcy5wYW5lbC5zaG93KCk7XG4gICAgdGhpcy5mb2N1cygpO1xuICB9XG5cbiAgaGlkZSgpIHtcbiAgICB0aGlzLnBhbmVsLmhpZGUoKTtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgfVxufVxuIl19