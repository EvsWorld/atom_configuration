Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require("atom");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _mobx = require("mobx");

var _nteractDisplayArea = require("@nteract/display-area");

var _transforms = require("./transforms");

var _status = require("./status");

var _status2 = _interopRequireDefault(_status);

var SCROLL_HEIGHT = 600;

var ResultViewComponent = (function (_React$Component) {
  var _instanceInitializers = {};

  _inherits(ResultViewComponent, _React$Component);

  function ResultViewComponent() {
    var _this = this;

    _classCallCheck(this, _ResultViewComponent);

    _get(Object.getPrototypeOf(_ResultViewComponent.prototype), "constructor", this).apply(this, arguments);

    this.containerTooltip = new _atom.CompositeDisposable();
    this.buttonTooltip = new _atom.CompositeDisposable();
    this.closeTooltip = new _atom.CompositeDisposable();
    this.expanded = (0, _mobx.observable)(false);

    this.getAllText = function () {
      if (!_this.el) return "";
      return _this.el.innerText ? _this.el.innerText.trim() : "";
    };

    this.handleClick = function (event) {
      if (event.ctrlKey || event.metaKey) {
        _this.openInEditor();
      } else {
        _this.copyToClipboard();
      }
    };

    this.copyToClipboard = function () {
      atom.clipboard.write(_this.getAllText());
      atom.notifications.addSuccess("Copied to clipboard");
    };

    this.openInEditor = function () {
      atom.workspace.open().then(function (editor) {
        return editor.insertText(_this.getAllText());
      });
    };

    this.addCopyTooltip = function (element, comp) {
      if (!element || !comp.disposables || comp.disposables.size > 0) return;
      comp.add(atom.tooltips.add(element, {
        title: "Click to copy,\n          " + (process.platform === "darwin" ? "Cmd" : "Ctrl") + "+Click to open in editor"
      }));
    };

    this.addCloseButtonTooltip = function (element, comp) {
      if (!element || !comp.disposables || comp.disposables.size > 0) return;
      comp.add(atom.tooltips.add(element, {
        title: _this.props.store.executionCount ? "Close (Out[" + _this.props.store.executionCount + "])" : "Close result"
      }));
    };

    this.addCopyButtonTooltip = function (element) {
      _this.addCopyTooltip(element, _this.buttonTooltip);
    };

    this.onWheel = function (element) {
      return function (event) {
        var clientHeight = element.clientHeight;
        var scrollHeight = element.scrollHeight;
        var scrollTop = element.scrollTop;
        var atTop = scrollTop !== 0 && event.deltaY < 0;
        var atBottom = scrollTop !== scrollHeight - clientHeight && event.deltaY > 0;

        if (clientHeight < scrollHeight && (atTop || atBottom)) {
          event.stopPropagation();
        }
      };
    };

    _defineDecoratedPropertyDescriptor(this, "toggleExpand", _instanceInitializers);
  }

  _createDecoratedClass(ResultViewComponent, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props$store = this.props.store;
      var outputs = _props$store.outputs;
      var status = _props$store.status;
      var isPlain = _props$store.isPlain;
      var position = _props$store.position;

      var inlineStyle = {
        marginLeft: position.lineLength + position.charWidth + "px",
        marginTop: "-" + position.lineHeight + "px"
      };

      if (outputs.length === 0 || this.props.showResult === false) {
        var _kernel = this.props.kernel;
        return _react2["default"].createElement(_status2["default"], {
          status: _kernel && _kernel.executionState !== "busy" && status === "running" ? "error" : status,
          style: inlineStyle
        });
      }

      return _react2["default"].createElement(
        "div",
        {
          className: isPlain ? "inline-container" : "multiline-container",
          onClick: isPlain ? this.handleClick : false,
          style: isPlain ? inlineStyle : {
            maxWidth: position.editorWidth - 2 * position.charWidth + "px",
            margin: "0px"
          }
        },
        _react2["default"].createElement(
          "div",
          {
            className: "hydrogen_cell_display",
            ref: function (ref) {
              if (!ref) return;
              _this2.el = ref;

              isPlain ? _this2.addCopyTooltip(ref, _this2.containerTooltip) : _this2.containerTooltip.dispose();

              // As of this writing React's event handler doesn't properly handle
              // event.stopPropagation() for events outside the React context.
              if (!_this2.expanded.get() && !isPlain && ref) {
                ref.addEventListener("wheel", _this2.onWheel(ref), {
                  passive: true
                });
              }
            },
            style: {
              maxHeight: this.expanded.get() ? "100%" : SCROLL_HEIGHT + "px",
              overflowY: "auto"
            }
          },
          _react2["default"].createElement(_nteractDisplayArea.Display, {
            outputs: (0, _mobx.toJS)(outputs),
            displayOrder: _transforms.displayOrder,
            transforms: _transforms.transforms,
            theme: "light",
            models: {},
            expanded: true
          })
        ),
        isPlain ? null : _react2["default"].createElement(
          "div",
          { className: "toolbar" },
          _react2["default"].createElement("div", {
            className: "icon icon-x",
            onClick: this.props.destroy,
            ref: function (ref) {
              return _this2.addCloseButtonTooltip(ref, _this2.closeTooltip);
            }
          }),
          _react2["default"].createElement("div", { style: { flex: 1, minHeight: "0.25em" } }),
          this.getAllText().length > 0 ? _react2["default"].createElement("div", {
            className: "icon icon-clippy",
            onClick: this.handleClick,
            ref: this.addCopyButtonTooltip
          }) : null,
          this.el && this.el.scrollHeight > SCROLL_HEIGHT ? _react2["default"].createElement("div", {
            className: "icon icon-" + (this.expanded.get() ? "fold" : "unfold"),
            onClick: this.toggleExpand
          }) : null
        )
      );
    }
  }, {
    key: "scrollToBottom",
    value: function scrollToBottom() {
      if (!this.el || this.expanded === true || this.props.store.isPlain === true || atom.config.get("Hydrogen.autoScroll") === false) return;
      var scrollHeight = this.el.scrollHeight;
      var height = this.el.clientHeight;
      var maxScrollTop = scrollHeight - height;
      this.el.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.scrollToBottom();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.scrollToBottom();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.containerTooltip.dispose();
      this.buttonTooltip.dispose();
      this.closeTooltip.dispose();
    }
  }, {
    key: "toggleExpand",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function () {
        _this3.expanded.set(!_this3.expanded.get());
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  var _ResultViewComponent = ResultViewComponent;
  ResultViewComponent = (0, _mobxReact.observer)(ResultViewComponent) || ResultViewComponent;
  return ResultViewComponent;
})(_react2["default"].Component);

exports["default"] = ResultViewComponent;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvcmVzdWx0LXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFFb0MsTUFBTTs7cUJBQ3hCLE9BQU87Ozs7eUJBQ0EsWUFBWTs7b0JBQ0ksTUFBTTs7a0NBQ3ZCLHVCQUF1Qjs7MEJBQ04sY0FBYzs7c0JBQ3BDLFVBQVU7Ozs7QUFNN0IsSUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDOztJQVVwQixtQkFBbUI7OztZQUFuQixtQkFBbUI7O1dBQW5CLG1CQUFtQjs7Ozs7OztTQUV2QixnQkFBZ0IsR0FBRywrQkFBeUI7U0FDNUMsYUFBYSxHQUFHLCtCQUF5QjtTQUN6QyxZQUFZLEdBQUcsK0JBQXlCO1NBQ3hDLFFBQVEsR0FBOEIsc0JBQVcsS0FBSyxDQUFDOztTQUV2RCxVQUFVLEdBQUcsWUFBTTtBQUNqQixVQUFJLENBQUMsTUFBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDeEIsYUFBTyxNQUFLLEVBQUUsQ0FBQyxTQUFTLEdBQUcsTUFBSyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztLQUMxRDs7U0FFRCxXQUFXLEdBQUcsVUFBQyxLQUFLLEVBQWlCO0FBQ25DLFVBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ2xDLGNBQUssWUFBWSxFQUFFLENBQUM7T0FDckIsTUFBTTtBQUNMLGNBQUssZUFBZSxFQUFFLENBQUM7T0FDeEI7S0FDRjs7U0FFRCxlQUFlLEdBQUcsWUFBTTtBQUN0QixVQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFLLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQztLQUN0RDs7U0FFRCxZQUFZLEdB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LElBQUksSUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLHVCQUF1QixLQUFLLEtBQUssRUFFaEQsT0FBTztBQUNULFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO0FBQzFDLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO0FBQ3BDLFVBQU0sWUFBWSxHQUFHLFlBQVksR0FBRyxNQUFNLENBQUM7QUFDM0MsVUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsWUFBWSxHQUFHLENBQUMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0tBQ3pEOzs7V0FFaUIsOEJBQUc7QUFDbkIsVUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ3ZCOzs7V0FFZ0IsNkJBQUc7QUFDbEIsVUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ3ZCOzs7V0FFbUIsZ0NBQUc7QUFDckIsVUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsVUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM3Qjs7Ozs7OzthQWpJYyxZQUFNO0FBQ25CLGVBQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQUssUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7T0FDekM7Ozs7OzZCQTdFRyxtQkFBbUI7QUFBbkIscUJBQW1CLDRCQUFuQixtQkFBbUIsS0FBbkIsbUJBQW1CO1NBQW5CLG1CQUFtQjtHQUFTLG1CQUFNLFNBQVM7O3FCQStNbEMsbUJBQW1CIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvcmVzdWx0LXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSBcImF0b21cIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3RcIjtcbmltcG9ydCB7IGFjdGlvbiwgb2JzZXJ2YWJsZSwgdG9KUyB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgeyBEaXNwbGF5IH0gZnJvbSBcIkBudGVyYWN0L2Rpc3BsYXktYXJlYVwiO1xuaW1wb3J0IHsgdHJhbnNmb3JtcywgZGlzcGxheU9yZGVyIH0gZnJvbSBcIi4vdHJhbnNmb3Jtc1wiO1xuaW1wb3J0IFN0YXR1cyBmcm9tIFwiLi9zdGF0dXNcIjtcblxuaW1wb3J0IHR5cGUgeyBJT2JzZXJ2YWJsZVZhbHVlIH0gZnJvbSBcIm1vYnhcIjtcbmltcG9ydCB0eXBlIE91dHB1dFN0b3JlIGZyb20gXCIuLy4uLy4uL3N0b3JlL291dHB1dFwiO1xuaW1wb3J0IHR5cGUgS2VybmVsIGZyb20gXCIuLy4uLy4uL2tlcm5lbFwiO1xuXG5jb25zdCBTQ1JPTExfSEVJR0hUID0gNjAwO1xuXG50eXBlIFByb3BzID0ge1xuICBzdG9yZTogT3V0cHV0U3RvcmUsXG4gIGtlcm5lbDogP0tlcm5lbCxcbiAgZGVzdHJveTogRnVuY3Rpb24sXG4gIHNob3dSZXN1bHQ6IGJvb2xlYW5cbn07XG5cbkBvYnNlcnZlclxuY2xhc3MgUmVzdWx0Vmlld0NvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQcm9wcz4ge1xuICBlbDogP0hUTUxFbGVtZW50O1xuICBjb250YWluZXJUb29sdGlwID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgYnV0dG9uVG9vbHRpcCA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIGNsb3NlVG9vbHRpcCA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIGV4cGFuZGVkOiBJT2JzZXJ2YWJsZVZhbHVlPGJvb2xlYW4+ID0gb2JzZXJ2YWJsZShmYWxzZSk7XG5cbiAgZ2V0QWxsVGV4dCA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMuZWwpIHJldHVybiBcIlwiO1xuICAgIHJldHVybiB0aGlzLmVsLmlubmVyVGV4dCA/IHRoaXMuZWwuaW5uZXJUZXh0LnRyaW0oKSA6IFwiXCI7XG4gIH07XG5cbiAgaGFuZGxlQ2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSB7XG4gICAgICB0aGlzLm9wZW5JbkVkaXRvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvcHlUb0NsaXBib2FyZCgpO1xuICAgIH1cbiAgfTtcblxuICBjb3B5VG9DbGlwYm9hcmQgPSAoKSA9PiB7XG4gICAgYXRvbS5jbGlwYm9hcmQud3JpdGUodGhpcy5nZXRBbGxUZXh0KCkpO1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiQ29waWVkIHRvIGNsaXBib2FyZFwiKTtcbiAgfTtcblxuICBvcGVuSW5FZGl0b3IgPSAoKSA9PiB7XG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbigpLnRoZW4oZWRpdG9yID0+IGVkaXRvci5pbnNlcnRUZXh0KHRoaXMuZ2V0QWxsVGV4dCgpKSk7XG4gIH07XG5cbiAgYWRkQ29weVRvb2x0aXAgPSAoZWxlbWVudDogP0hUTUxFbGVtZW50LCBjb21wOiBhdG9tJENvbXBvc2l0ZURpc3Bvc2FibGUpID0+IHtcbiAgICBpZiAoIWVsZW1lbnQgfHwgIWNvbXAuZGlzcG9zYWJsZXMgfHwgY29tcC5kaXNwb3NhYmxlcy5zaXplID4gMCkgcmV0dXJuO1xuICAgIGNvbXAuYWRkKFxuICAgICAgYXRvbS50b29sdGlwcy5hZGQoZWxlbWVudCwge1xuICAgICAgICB0aXRsZTogYENsaWNrIHRvIGNvcHksXG4gICAgICAgICAgJHtcbiAgICAgICAgICAgIHByb2Nlc3MucGxhdGZvcm0gPT09IFwiZGFyd2luXCIgPyBcIkNtZFwiIDogXCJDdHJsXCJcbiAgICAgICAgICB9K0NsaWNrIHRvIG9wZW4gaW4gZWRpdG9yYFxuICAgICAgfSlcbiAgICApO1xuICB9O1xuXG4gIGFkZENsb3NlQnV0dG9uVG9vbHRpcCA9IChcbiAgICBlbGVtZW50OiA/SFRNTEVsZW1lbnQsXG4gICAgY29tcDogYXRvbSRDb21wb3NpdGVEaXNwb3NhYmxlXG4gICkgPT4ge1xuICAgIGlmICghZWxlbWVudCB8fCAhY29tcC5kaXNwb3NhYmxlcyB8fCBjb21wLmRpc3Bvc2FibGVzLnNpemUgPiAwKSByZXR1cm47XG4gICAgY29tcC5hZGQoXG4gICAgICBhdG9tLnRvb2x0aXBzLmFkZChlbGVtZW50LCB7XG4gICAgICAgIHRpdGxlOiB0aGlzLnByb3BzLnN0b3JlLmV4ZWN1dGlvbkNvdW50XG4gICAgICAgICAgPyBgQ2xvc2UgKE91dFske3RoaXMucHJvcHMuc3RvcmUuZXhlY3V0aW9uQ291bnR9XSlgXG4gICAgICAgICAgOiBcIkNsb3NlIHJlc3VsdFwiXG4gICAgICB9KVxuICAgICk7XG4gIH07XG5cbiAgYWRkQ29weUJ1dHRvblRvb2x0aXAgPSAoZWxlbWVudDogP0hUTUxFbGVtZW50KSA9PiB7XG4gICAgdGhpcy5hZGRDb3B5VG9vbHRpcChlbGVtZW50LCB0aGlzLmJ1dHRvblRvb2x0aXApO1xuICB9O1xuXG4gIG9uV2hlZWwgPSAoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4gKGV2ZW50OiBXaGVlbEV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBjbGllbnRIZWlnaHQgPSBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgIGNvbnN0IHNjcm9sbEhlaWdodCA9IGVsZW1lbnQuc2Nyb2xsSGVpZ2h0O1xuICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gZWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICBjb25zdCBhdFRvcCA9IHNjcm9sbFRvcCAhPT0gMCAmJiBldmVudC5kZWx0YVkgPCAwO1xuICAgICAgY29uc3QgYXRCb3R0b20gPVxuICAgICAgICBzY3JvbGxUb3AgIT09IHNjcm9sbEhlaWdodCAtIGNsaWVudEhlaWdodCAmJiBldmVudC5kZWx0YVkgPiAwO1xuXG4gICAgICBpZiAoY2xpZW50SGVpZ2h0IDwgc2Nyb2xsSGVpZ2h0ICYmIChhdFRvcCB8fCBhdEJvdHRvbSkpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBAYWN0aW9uXG4gIHRvZ2dsZUV4cGFuZCA9ICgpID0+IHtcbiAgICB0aGlzLmV4cGFuZGVkLnNldCghdGhpcy5leHBhbmRlZC5nZXQoKSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgb3V0cHV0cywgc3RhdHVzLCBpc1BsYWluLCBwb3NpdGlvbiB9ID0gdGhpcy5wcm9wcy5zdG9yZTtcblxuICAgIGNvbnN0IGlubGluZVN0eWxlID0ge1xuICAgICAgbWFyZ2luTGVmdDogYCR7cG9zaXRpb24ubGluZUxlbmd0aCArIHBvc2l0aW9uLmNoYXJXaWR0aH1weGAsXG4gICAgICBtYXJnaW5Ub3A6IGAtJHtwb3NpdGlvbi5saW5lSGVpZ2h0fXB4YFxuICAgIH07XG5cbiAgICBpZiAob3V0cHV0cy5sZW5ndGggPT09IDAgfHwgdGhpcy5wcm9wcy5zaG93UmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgY29uc3Qga2VybmVsID0gdGhpcy5wcm9wcy5rZXJuZWw7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3RhdHVzXG4gICAgICAgICAgc3RhdHVzPXtcbiAgICAgICAgICAgIGtlcm5lbCAmJiBrZXJuZWwuZXhlY3V0aW9uU3RhdGUgIT09IFwiYnVzeVwiICYmIHN0YXR1cyA9PT0gXCJydW5uaW5nXCJcbiAgICAgICAgICAgICAgPyBcImVycm9yXCJcbiAgICAgICAgICAgICAgOiBzdGF0dXNcbiAgICAgICAgICB9XG4gICAgICAgICAgc3R5bGU9e2lubGluZVN0eWxlfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2lzUGxhaW4gPyBcImlubGluZS1jb250YWluZXJcIiA6IFwibXVsdGlsaW5lLWNvbnRhaW5lclwifVxuICAgICAgICBvbkNsaWNrPXtpc1BsYWluID8gdGhpcy5oYW5kbGVDbGljayA6IGZhbHNlfVxuICAgICAgICBzdHlsZT17XG4gICAgICAgICAgaXNQbGFpblxuICAgICAgICAgICAgPyBpbmxpbmVTdHlsZVxuICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IGAke3Bvc2l0aW9uLmVkaXRvcldpZHRoIC0gMiAqIHBvc2l0aW9uLmNoYXJXaWR0aH1weGAsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiBcIjBweFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPVwiaHlkcm9nZW5fY2VsbF9kaXNwbGF5XCJcbiAgICAgICAgICByZWY9e3JlZiA9PiB7XG4gICAgICAgICAgICBpZiAoIXJlZikgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy5lbCA9IHJlZjtcblxuICAgICAgICAgICAgaXNQbGFpblxuICAgICAgICAgICAgICA/IHRoaXMuYWRkQ29weVRvb2x0aXAocmVmLCB0aGlzLmNvbnRhaW5lclRvb2x0aXApXG4gICAgICAgICAgICAgIDogdGhpcy5jb250YWluZXJUb29sdGlwLmRpc3Bvc2UoKTtcblxuICAgICAgICAgICAgLy8gQXMgb2YgdGhpcyB3cml0aW5nIFJlYWN0J3MgZXZlbnQgaGFuZGxlciBkb2Vzbid0IHByb3Blcmx5IGhhbmRsZVxuICAgICAgICAgICAgLy8gZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCkgZm9yIGV2ZW50cyBvdXRzaWRlIHRoZSBSZWFjdCBjb250ZXh0LlxuICAgICAgICAgICAgaWYgKCF0aGlzLmV4cGFuZGVkLmdldCgpICYmICFpc1BsYWluICYmIHJlZikge1xuICAgICAgICAgICAgICByZWYuYWRkRXZlbnRMaXN0ZW5lcihcIndoZWVsXCIsIHRoaXMub25XaGVlbChyZWYpLCB7XG4gICAgICAgICAgICAgICAgcGFzc2l2ZTogdHJ1ZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBtYXhIZWlnaHQ6IHRoaXMuZXhwYW5kZWQuZ2V0KCkgPyBcIjEwMCVcIiA6IGAke1NDUk9MTF9IRUlHSFR9cHhgLFxuICAgICAgICAgICAgb3ZlcmZsb3dZOiBcImF1dG9cIlxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8RGlzcGxheVxuICAgICAgICAgICAgb3V0cHV0cz17dG9KUyhvdXRwdXRzKX1cbiAgICAgICAgICAgIGRpc3BsYXlPcmRlcj17ZGlzcGxheU9yZGVyfVxuICAgICAgICAgICAgdHJhbnNmb3Jtcz17dHJhbnNmb3Jtc31cbiAgICAgICAgICAgIHRoZW1lPVwibGlnaHRcIlxuICAgICAgICAgICAgbW9kZWxzPXt7fX1cbiAgICAgICAgICAgIGV4cGFuZGVkXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtpc1BsYWluID8gbnVsbCA6IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvb2xiYXJcIj5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaWNvbiBpY29uLXhcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmRlc3Ryb3l9XG4gICAgICAgICAgICAgIHJlZj17cmVmID0+IHRoaXMuYWRkQ2xvc2VCdXR0b25Ub29sdGlwKHJlZiwgdGhpcy5jbG9zZVRvb2x0aXApfVxuICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBtaW5IZWlnaHQ6IFwiMC4yNWVtXCIgfX0gLz5cblxuICAgICAgICAgICAge3RoaXMuZ2V0QWxsVGV4dCgpLmxlbmd0aCA+IDAgPyAoXG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpY29uIGljb24tY2xpcHB5XCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfVxuICAgICAgICAgICAgICAgIHJlZj17dGhpcy5hZGRDb3B5QnV0dG9uVG9vbHRpcH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAgICB7dGhpcy5lbCAmJiB0aGlzLmVsLnNjcm9sbEhlaWdodCA+IFNDUk9MTF9IRUlHSFQgPyAoXG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BpY29uIGljb24tJHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuZXhwYW5kZWQuZ2V0KCkgPyBcImZvbGRcIiA6IFwidW5mb2xkXCJcbiAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZUV4cGFuZH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHNjcm9sbFRvQm90dG9tKCkge1xuICAgIGlmIChcbiAgICAgICF0aGlzLmVsIHx8XG4gICAgICB0aGlzLmV4cGFuZGVkID09PSB0cnVlIHx8XG4gICAgICB0aGlzLnByb3BzLnN0b3JlLmlzUGxhaW4gPT09IHRydWUgfHxcbiAgICAgIGF0b20uY29uZmlnLmdldChgSHlkcm9nZW4uYXV0b1Njcm9sbGApID09PSBmYWxzZVxuICAgIClcbiAgICAgIHJldHVybjtcbiAgICBjb25zdCBzY3JvbGxIZWlnaHQgPSB0aGlzLmVsLnNjcm9sbEhlaWdodDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmVsLmNsaWVudEhlaWdodDtcbiAgICBjb25zdCBtYXhTY3JvbGxUb3AgPSBzY3JvbGxIZWlnaHQgLSBoZWlnaHQ7XG4gICAgdGhpcy5lbC5zY3JvbGxUb3AgPSBtYXhTY3JvbGxUb3AgPiAwID8gbWF4U2Nyb2xsVG9wIDogMDtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLnNjcm9sbFRvQm90dG9tKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnNjcm9sbFRvQm90dG9tKCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLmNvbnRhaW5lclRvb2x0aXAuZGlzcG9zZSgpO1xuICAgIHRoaXMuYnV0dG9uVG9vbHRpcC5kaXNwb3NlKCk7XG4gICAgdGhpcy5jbG9zZVRvb2x0aXAuZGlzcG9zZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc3VsdFZpZXdDb21wb25lbnQ7XG4iXX0=