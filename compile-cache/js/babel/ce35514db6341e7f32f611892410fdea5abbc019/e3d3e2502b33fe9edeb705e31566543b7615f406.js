Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _componentsContainer = require('./components/Container');

var _componentsContainer2 = _interopRequireDefault(_componentsContainer);

'use babel';

var TodoView = (function () {
  function TodoView() /*serializedState*/{
    _classCallCheck(this, TodoView);

    this.renderItems = this.renderItems.bind(this);
    this.openFile = this.openFile.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onClose = this.onClose.bind(this);

    this.element = document.createElement('todo');
    this.state = {
      items: [],
      loading: true,
      pathsSearched: 0
    };
    this._render();

    atom.emitter.on('todo:pathSearched', this.onPathsSearched.bind(this));
  }

  _createClass(TodoView, [{
    key: 'setState',
    value: function setState(state) {
      Object.assign(this.state, state);
      this._render();
    }
  }, {
    key: '_render',
    value: function _render() {
      var state = this.state;

      _reactDom2['default'].render(_react2['default'].createElement(_componentsContainer2['default'], {
        onRefresh: this.onRefresh,
        onClose: this.onClose,
        onItemClick: this.openFile,
        items: state.items,
        loading: state.loading,
        pathsSearched: state.pathsSearched
      }), this.element);
    }
  }, {
    key: 'onPathsSearched',
    value: function onPathsSearched(pathsSearched) {
      this.setState({ pathsSearched: pathsSearched });
    }
  }, {
    key: 'onRefresh',
    value: function onRefresh() {
      this.setState({
        items: [],
        loading: true
      });
      return atom.emitter.emit('todo:refresh');
    }
  }, {
    key: 'onClose',
    value: function onClose() {
      return atom.emitter.emit('todo:close');
    }
  }, {
    key: 'renderItems',
    value: function renderItems(items) {
      this.setState({
        items: items,
        loading: false
      });
    }
  }, {
    key: 'openFile',
    value: function openFile(filePath) {
      var range = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      var rangeStart = range[0];

      if (filePath && rangeStart) {
        var initialLine = rangeStart[0];
        var initialColumn = rangeStart[1];

        return atom.workspace.open(filePath, {
          initialLine: initialLine,
          initialColumn: initialColumn
        });
      }
    }
  }, {
    key: 'serialize',
    value: function serialize() {}
  }, {
    key: 'destroy',
    value: function destroy() {
      _reactDom2['default'].unmountComponentAtNode(this.element);
      return this.element.remove();
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }, {
    key: 'getOutOfHereReact',
    value: function getOutOfHereReact() {
      this.state = {
        items: [],
        loading: true,
        pathsSearched: 0
      };
      _reactDom2['default'].unmountComponentAtNode(this.element);
    }
  }, {
    key: 'toggle',
    value: function toggle(visible) {
      return visible ? this._render() : this.getOutOfHereReact();
    }
  }]);

  return TodoView;
})();

exports['default'] = TodoView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvdG9kby12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7d0JBQ0osV0FBVzs7OzttQ0FDVix3QkFBd0I7Ozs7QUFKOUMsV0FBVyxDQUFDOztJQU1OLFFBQVE7QUFDRCxXQURQLFFBQVEsc0JBQ3FCOzBCQUQ3QixRQUFROztBQUVWLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXZDLFFBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QyxRQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsV0FBSyxFQUFFLEVBQUU7QUFDVCxhQUFPLEVBQUUsSUFBSTtBQUNiLG1CQUFhLEVBQUUsQ0FBQztLQUNqQixDQUFDO0FBQ0YsUUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVmLFFBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDdkU7O2VBaEJHLFFBQVE7O1dBa0JKLGtCQUFDLEtBQUssRUFBRTtBQUNkLFlBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDaEI7OztXQUVNLG1CQUFHO1VBQ0QsS0FBSyxHQUFJLElBQUksQ0FBYixLQUFLOztBQUVaLDRCQUFTLE1BQU0sQ0FDYjtBQUNFLGlCQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQUFBQztBQUMxQixlQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQUFBQztBQUN0QixtQkFBVyxFQUFFLElBQUksQ0FBQyxRQUFRLEFBQUM7QUFDM0IsYUFBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEFBQUM7QUFDbkIsZUFBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEFBQUM7QUFDdkIscUJBQWEsRUFBRSxLQUFLLENBQUMsYUFBYSxBQUFDO1FBQ25DLEVBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FDYixDQUFDO0tBQ0g7OztXQUVjLHlCQUFDLGFBQWEsRUFBRTtBQUM3QixVQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsYUFBYSxFQUFiLGFBQWEsRUFBRSxDQUFDLENBQUM7S0FDbEM7OztXQUVRLHFCQUFHO0FBQ1YsVUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNaLGFBQUssRUFBRSxFQUFFO0FBQ1QsZUFBTyxFQUFFLElBQUk7T0FDZCxDQUFDLENBQUM7QUFDSCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQzFDOzs7V0FFTSxtQkFBRztBQUNSLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDeEM7OztXQUVVLHFCQUFDLEtBQUssRUFBRTtBQUNqQixVQUFJLENBQUMsUUFBUSxDQUFDO0FBQ1osYUFBSyxFQUFMLEtBQUs7QUFDTCxlQUFPLEVBQUUsS0FBSztPQUNmLENBQUMsQ0FBQztLQUNKOzs7V0FFTyxrQkFBQyxRQUFRLEVBQWM7VUFBWixLQUFLLHlEQUFHLEVBQUU7O0FBQzNCLFVBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFNUIsVUFBSSxRQUFRLElBQUksVUFBVSxFQUFFO0FBQzFCLFlBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQyxZQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXBDLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ25DLHFCQUFXLEVBQVgsV0FBVztBQUNYLHVCQUFhLEVBQWIsYUFBYTtTQUNkLENBQUMsQ0FBQztPQUNKO0tBQ0Y7OztXQUVRLHFCQUFHLEVBQUU7OztXQUVQLG1CQUFHO0FBQ1IsNEJBQVMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUM5Qjs7O1dBRVMsc0JBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7OztXQUVnQiw2QkFBRztBQUNsQixVQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsYUFBSyxFQUFFLEVBQUU7QUFDVCxlQUFPLEVBQUUsSUFBSTtBQUNiLHFCQUFhLEVBQUUsQ0FBQztPQUNqQixDQUFDO0FBQ0YsNEJBQVMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQy9DOzs7V0FFSyxnQkFBQyxPQUFPLEVBQUU7QUFDZCxhQUFPLE9BQU8sR0FDWixJQUFJLENBQUMsT0FBTyxFQUFFLEdBQ2QsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7S0FDNUI7OztTQXBHRyxRQUFROzs7cUJBdUdDLFFBQVEiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90b2RvL2xpYi90b2RvLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IENvbnRhaW5lciBmcm9tICcuL2NvbXBvbmVudHMvQ29udGFpbmVyJztcblxuY2xhc3MgVG9kb1ZpZXcge1xuICBjb25zdHJ1Y3RvcigvKnNlcmlhbGl6ZWRTdGF0ZSovKSB7XG4gICAgdGhpcy5yZW5kZXJJdGVtcyA9IHRoaXMucmVuZGVySXRlbXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9wZW5GaWxlID0gdGhpcy5vcGVuRmlsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25SZWZyZXNoID0gdGhpcy5vblJlZnJlc2guYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uQ2xvc2UgPSB0aGlzLm9uQ2xvc2UuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RvZG8nKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXRlbXM6IFtdLFxuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgIHBhdGhzU2VhcmNoZWQ6IDAsXG4gICAgfTtcbiAgICB0aGlzLl9yZW5kZXIoKTtcblxuICAgIGF0b20uZW1pdHRlci5vbigndG9kbzpwYXRoU2VhcmNoZWQnLCB0aGlzLm9uUGF0aHNTZWFyY2hlZC5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0YXRlLCBzdGF0ZSk7XG4gICAgdGhpcy5fcmVuZGVyKCk7XG4gIH1cblxuICBfcmVuZGVyKCkge1xuICAgIGNvbnN0IHtzdGF0ZX0gPSB0aGlzO1xuXG4gICAgUmVhY3RET00ucmVuZGVyKFxuICAgICAgPENvbnRhaW5lclxuICAgICAgICBvblJlZnJlc2g9e3RoaXMub25SZWZyZXNofVxuICAgICAgICBvbkNsb3NlPXt0aGlzLm9uQ2xvc2V9XG4gICAgICAgIG9uSXRlbUNsaWNrPXt0aGlzLm9wZW5GaWxlfVxuICAgICAgICBpdGVtcz17c3RhdGUuaXRlbXN9XG4gICAgICAgIGxvYWRpbmc9e3N0YXRlLmxvYWRpbmd9XG4gICAgICAgIHBhdGhzU2VhcmNoZWQ9e3N0YXRlLnBhdGhzU2VhcmNoZWR9XG4gICAgICAvPixcbiAgICAgIHRoaXMuZWxlbWVudFxuICAgICk7XG4gIH1cblxuICBvblBhdGhzU2VhcmNoZWQocGF0aHNTZWFyY2hlZCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBwYXRoc1NlYXJjaGVkIH0pO1xuICB9XG5cbiAgb25SZWZyZXNoKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXRlbXM6IFtdLFxuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICB9KTtcbiAgICByZXR1cm4gYXRvbS5lbWl0dGVyLmVtaXQoJ3RvZG86cmVmcmVzaCcpO1xuICB9XG5cbiAgb25DbG9zZSgpIHtcbiAgICByZXR1cm4gYXRvbS5lbWl0dGVyLmVtaXQoJ3RvZG86Y2xvc2UnKTtcbiAgfVxuXG4gIHJlbmRlckl0ZW1zKGl0ZW1zKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtcyxcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgb3BlbkZpbGUoZmlsZVBhdGgsIHJhbmdlID0gW10pIHtcbiAgICBjb25zdCByYW5nZVN0YXJ0ID0gcmFuZ2VbMF07XG5cbiAgICBpZiAoZmlsZVBhdGggJiYgcmFuZ2VTdGFydCkge1xuICAgICAgY29uc3QgaW5pdGlhbExpbmUgPSByYW5nZVN0YXJ0WzBdO1xuICAgICAgY29uc3QgaW5pdGlhbENvbHVtbiA9IHJhbmdlU3RhcnRbMV07XG5cbiAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoLCB7XG4gICAgICAgIGluaXRpYWxMaW5lLFxuICAgICAgICBpbml0aWFsQ29sdW1uLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2VyaWFsaXplKCkge31cblxuICBkZXN0cm95KCkge1xuICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5lbGVtZW50KTtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xuICB9XG5cbiAgZ2V0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICB9XG5cbiAgZ2V0T3V0T2ZIZXJlUmVhY3QoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBwYXRoc1NlYXJjaGVkOiAwLFxuICAgIH07XG4gICAgUmVhY3RET00udW5tb3VudENvbXBvbmVudEF0Tm9kZSh0aGlzLmVsZW1lbnQpO1xuICB9XG5cbiAgdG9nZ2xlKHZpc2libGUpIHtcbiAgICByZXR1cm4gdmlzaWJsZVxuICAgID8gdGhpcy5fcmVuZGVyKClcbiAgICA6IHRoaXMuZ2V0T3V0T2ZIZXJlUmVhY3QoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUb2RvVmlldztcbiJdfQ==