Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _atom = require("atom");

var _resultViewHistory = require("./../result-view/history");

var _resultViewHistory2 = _interopRequireDefault(_resultViewHistory);

var Watch = (function (_React$Component) {
  _inherits(Watch, _React$Component);

  function Watch() {
    _classCallCheck(this, Watch);

    _get(Object.getPrototypeOf(Watch.prototype), "constructor", this).apply(this, arguments);

    this.subscriptions = new _atom.CompositeDisposable();
  }

  _createClass(Watch, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this = this;

      if (!this.container) return;
      var container = this.container;
      container.insertBefore(this.props.store.editor.element, container.firstChild);

      this.subscriptions.add(atom.commands.add(container, "core:move-left", function () {
        return _this.props.store.outputStore.decrementIndex();
      }), atom.commands.add(container, "core:move-right", function () {
        return _this.props.store.outputStore.incrementIndex();
      }));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.subscriptions.dispose();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react2["default"].createElement(
        "div",
        {
          className: "hydrogen watch-view",
          ref: function (c) {
            _this2.container = c;
          }
        },
        _react2["default"].createElement(_resultViewHistory2["default"], { store: this.props.store.outputStore })
      );
    }
  }]);

  return Watch;
})(_react2["default"].Component);

exports["default"] = Watch;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvd2F0Y2gtc2lkZWJhci93YXRjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztxQkFFa0IsT0FBTzs7OztvQkFDVyxNQUFNOztpQ0FDdEIsMEJBQTBCOzs7O0lBR3pCLEtBQUs7WUFBTCxLQUFLOztXQUFMLEtBQUs7MEJBQUwsS0FBSzs7K0JBQUwsS0FBSzs7U0FFeEIsYUFBYSxHQUE2QiwrQkFBeUI7OztlQUZoRCxLQUFLOztXQUdQLDZCQUFHOzs7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTztBQUM1QixVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ2pDLGVBQVMsQ0FBQyxZQUFZLENBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQy9CLFNBQVMsQ0FBQyxVQUFVLENBQ3JCLENBQUM7O0FBRUYsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtlQUM3QyxNQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRTtPQUFBLENBQzlDLEVBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUFFO2VBQzlDLE1BQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFO09BQUEsQ0FDOUMsQ0FDRixDQUFDO0tBQ0g7OztXQUVtQixnQ0FBRztBQUNyQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzlCOzs7V0FFSyxrQkFBRzs7O0FBQ1AsYUFDRTs7O0FBQ0UsbUJBQVMsRUFBQyxxQkFBcUI7QUFDL0IsYUFBRyxFQUFFLFVBQUEsQ0FBQyxFQUFJO0FBQ1IsbUJBQUssU0FBUyxHQUFHLENBQUMsQ0FBQztXQUNwQixBQUFDOztRQUVGLG1FQUFTLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLEFBQUMsR0FBRztPQUM1QyxDQUNOO0tBQ0g7OztTQXBDa0IsS0FBSztHQUFTLG1CQUFNLFNBQVM7O3FCQUE3QixLQUFLIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvd2F0Y2gtc2lkZWJhci93YXRjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiO1xuaW1wb3J0IEhpc3RvcnkgZnJvbSBcIi4vLi4vcmVzdWx0LXZpZXcvaGlzdG9yeVwiO1xuaW1wb3J0IHR5cGUgV2F0Y2hTdG9yZSBmcm9tIFwiLi8uLi8uLi9zdG9yZS93YXRjaFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXRjaCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDx7IHN0b3JlOiBXYXRjaFN0b3JlIH0+IHtcbiAgY29udGFpbmVyOiA/SFRNTEVsZW1lbnQ7XG4gIHN1YnNjcmlwdGlvbnM6IGF0b20kQ29tcG9zaXRlRGlzcG9zYWJsZSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGlmICghdGhpcy5jb250YWluZXIpIHJldHVybjtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcjtcbiAgICBjb250YWluZXIuaW5zZXJ0QmVmb3JlKFxuICAgICAgdGhpcy5wcm9wcy5zdG9yZS5lZGl0b3IuZWxlbWVudCxcbiAgICAgIGNvbnRhaW5lci5maXJzdENoaWxkXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZChjb250YWluZXIsIFwiY29yZTptb3ZlLWxlZnRcIiwgKCkgPT5cbiAgICAgICAgdGhpcy5wcm9wcy5zdG9yZS5vdXRwdXRTdG9yZS5kZWNyZW1lbnRJbmRleCgpXG4gICAgICApLFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoY29udGFpbmVyLCBcImNvcmU6bW92ZS1yaWdodFwiLCAoKSA9PlxuICAgICAgICB0aGlzLnByb3BzLnN0b3JlLm91dHB1dFN0b3JlLmluY3JlbWVudEluZGV4KClcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9XCJoeWRyb2dlbiB3YXRjaC12aWV3XCJcbiAgICAgICAgcmVmPXtjID0+IHtcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGM7XG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxIaXN0b3J5IHN0b3JlPXt0aGlzLnByb3BzLnN0b3JlLm91dHB1dFN0b3JlfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl19