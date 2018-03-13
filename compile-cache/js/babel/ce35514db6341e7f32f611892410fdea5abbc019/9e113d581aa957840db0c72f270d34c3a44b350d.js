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

var _mobx = require("mobx");

var _mobxReact = require("mobx-react");

var _anser = require("anser");

var _anser2 = _interopRequireDefault(_anser);

var _resultViewHistory = require("./result-view/history");

var _resultViewHistory2 = _interopRequireDefault(_resultViewHistory);

var _resultViewList = require("./result-view/list");

var _resultViewList2 = _interopRequireDefault(_resultViewList);

var _utils = require("./../utils");

var OutputArea = (function (_React$Component) {
  var _instanceInitializers = {};

  _inherits(OutputArea, _React$Component);

  function OutputArea() {
    var _this = this;

    _classCallCheck(this, _OutputArea);

    _get(Object.getPrototypeOf(_OutputArea.prototype), "constructor", this).apply(this, arguments);

    this.showHistory = (0, _mobx.observable)(true);

    _defineDecoratedPropertyDescriptor(this, "setHistory", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "setScrollList", _instanceInitializers);

    this.handleClick = function () {
      var kernel = _this.props.store.kernel;
      if (!kernel || !kernel.outputStore) return;
      var output = kernel.outputStore.outputs[kernel.outputStore.index];
      var copyOutput = _this.getOutputText(output);

      if (copyOutput) {
        atom.clipboard.write(_anser2["default"].ansiToText(copyOutput));
        atom.notifications.addSuccess("Copied to clipboard");
      } else {
        atom.notifications.addWarning("Nothing to copy");
      }
    };
  }

  _createDecoratedClass(OutputArea, [{
    key: "getOutputText",
    value: function getOutputText(output) {
      switch (output.output_type) {
        case "stream":
          return output.text;
        case "execute_result":
          return output.data["text/plain"];
        case "error":
          return output.traceback.toJS().join("\n");
      }
    }
  }, {
    key: "render",
    value: function render() {
      var kernel = this.props.store.kernel;

      if (!kernel) {
        if (atom.config.get("Hydrogen.outputAreaDock")) {
          return _react2["default"].createElement(_utils.EmptyMessage, null);
        } else {
          atom.workspace.hide(_utils.OUTPUT_AREA_URI);
          return null;
        }
      }
      return _react2["default"].createElement(
        "div",
        { className: "sidebar output-area" },
        kernel.outputStore.outputs.length > 0 ? _react2["default"].createElement(
          "div",
          { className: "block" },
          _react2["default"].createElement(
            "div",
            { className: "btn-group" },
            _react2["default"].createElement("button", {
              className: "btn icon icon-clock" + (this.showHistory.get() ? " selected" : ""),
              onClick: this.setHistory
            }),
            _react2["default"].createElement("button", {
              className: "btn icon icon-three-bars" + (!this.showHistory.get() ? " selected" : ""),
              onClick: this.setScrollList
            })
          ),
          _react2["default"].createElement(
            "div",
            { style: { float: "right" } },
            this.showHistory.get() ? _react2["default"].createElement(
              "button",
              {
                className: "btn icon icon-clippy",
                onClick: this.handleClick
              },
              "Copy"
            ) : null,
            _react2["default"].createElement(
              "button",
              {
                className: "btn icon icon-trashcan",
                onClick: kernel.outputStore.clear
              },
              "Clear"
            )
          )
        ) : _react2["default"].createElement(_utils.EmptyMessage, null),
        this.showHistory.get() ? _react2["default"].createElement(_resultViewHistory2["default"], { store: kernel.outputStore }) : _react2["default"].createElement(_resultViewList2["default"], { outputs: kernel.outputStore.outputs })
      );
    }
  }, {
    key: "setHistory",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this2 = this;

      return function () {
        _this2.showHistory.set(true);
      };
    },
    enumerable: true
  }, {
    key: "setScrollList",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function () {
        _this3.showHistory.set(false);
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  var _OutputArea = OutputArea;
  OutputArea = (0, _mobxReact.observer)(OutputArea) || OutputArea;
  return OutputArea;
})(_react2["default"].Component);

exports["default"] = OutputArea;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvb3V0cHV0LWFyZWEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFFb0MsTUFBTTs7cUJBQ3hCLE9BQU87Ozs7b0JBQ1UsTUFBTTs7eUJBQ2hCLFlBQVk7O3FCQUNuQixPQUFPOzs7O2lDQUVMLHVCQUF1Qjs7Ozs4QkFDcEIsb0JBQW9COzs7O3FCQUNHLFlBQVk7O0lBTXBELFVBQVU7OztZQUFWLFVBQVU7O1dBQVYsVUFBVTs7Ozs7OztTQUNkLFdBQVcsR0FBOEIsc0JBQVcsSUFBSSxDQUFDOzs7Ozs7U0FzQnpELFdBQVcsR0FBRyxZQUFNO0FBQ2xCLFVBQU0sTUFBTSxHQUFHLE1BQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDdkMsVUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsT0FBTztBQUMzQyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BFLFVBQU0sVUFBVSxHQUFHLE1BQUssYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU5QyxVQUFJLFVBQVUsRUFBRTtBQUNkLFlBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLG1CQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ25ELFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7T0FDdEQsTUFBTTtBQUNMLFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7T0FDbEQ7S0FDRjs7O3dCQW5DRyxVQUFVOztXQVlELHVCQUFDLE1BQWMsRUFBVztBQUNyQyxjQUFRLE1BQU0sQ0FBQyxXQUFXO0FBQ3hCLGFBQUssUUFBUTtBQUNYLGlCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFBQSxBQUNyQixhQUFLLGdCQUFnQjtBQUNuQixpQkFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQUEsQUFDbkMsYUFBSyxPQUFPO0FBQ1YsaUJBQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFBQSxPQUM3QztLQUNGOzs7V0FnQkssa0JBQUc7QUFDUCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7O0FBRXZDLFVBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLEVBQUU7QUFDOUMsaUJBQU8sMkRBQWdCLENBQUM7U0FDekIsTUFBTTtBQUNMLGNBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSx3QkFBaUIsQ0FBQztBQUNyQyxpQkFBTyxJQUFJLENBQUM7U0FDYjtPQUNGO0FBQ0QsYUFDRTs7VUFBSyxTQUFTLEVBQUMscUJBQXFCO1FBQ2pDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQ3BDOztZQUFLLFNBQVMsRUFBQyxPQUFPO1VBQ3BCOztjQUFLLFNBQVMsRUFBQyxXQUFXO1lBQ3hCO0FBQ0UsdUJBQVMsMkJBQ1AsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxXQUFXLEdBQUcsRUFBRSxDQUFBLEFBQ3hDO0FBQ0gscUJBQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxBQUFDO2NBQ3pCO1lBQ0Y7QUFDRSx1QkFBUyxnQ0FDUCxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxHQUFHLEVBQUUsQ0FBQSxBQUN6QztBQUNILHFCQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQUFBQztjQUM1QjtXQUNFO1VBQ047O2NBQUssS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxBQUFDO1lBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQ3JCOzs7QUFDRSx5QkFBUyxFQUFDLHNCQUFzQjtBQUNoQyx1QkFBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEFBQUM7OzthQUduQixHQUNQLElBQUk7WUFDUjs7O0FBQ0UseUJBQVMsRUFBQyx3QkFBd0I7QUFDbEMsdUJBQU8sRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQUFBQzs7O2FBRzNCO1dBQ0w7U0FDRixHQUVOLDJEQUFnQixBQUNqQjtRQUNBLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQ3JCLG1FQUFTLEtBQUssRUFBRSxNQUFNLENBQUMsV0FBVyxBQUFDLEdBQUcsR0FFdEMsZ0VBQVksT0FBTyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxBQUFDLEdBQUcsQUFDcEQ7T0FDRyxDQUNOO0tBQ0g7Ozs7Ozs7YUExRlksWUFBTTtBQUNqQixlQUFLLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDNUI7Ozs7Ozs7OzthQUdlLFlBQU07QUFDcEIsZUFBSyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzdCOzs7OztvQkFWRyxVQUFVO0FBQVYsWUFBVSw0QkFBVixVQUFVLEtBQVYsVUFBVTtTQUFWLFVBQVU7R0FBUyxtQkFBTSxTQUFTOztxQkFnR3pCLFVBQVUiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9vdXRwdXQtYXJlYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgYWN0aW9uLCBvYnNlcnZhYmxlIH0gZnJvbSBcIm1vYnhcIjtcbmltcG9ydCB7IG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3RcIjtcbmltcG9ydCBBbnNlciBmcm9tIFwiYW5zZXJcIjtcblxuaW1wb3J0IEhpc3RvcnkgZnJvbSBcIi4vcmVzdWx0LXZpZXcvaGlzdG9yeVwiO1xuaW1wb3J0IFNjcm9sbExpc3QgZnJvbSBcIi4vcmVzdWx0LXZpZXcvbGlzdFwiO1xuaW1wb3J0IHsgT1VUUFVUX0FSRUFfVVJJLCBFbXB0eU1lc3NhZ2UgfSBmcm9tIFwiLi8uLi91dGlsc1wiO1xuXG5pbXBvcnQgdHlwZW9mIHN0b3JlIGZyb20gXCIuLi9zdG9yZVwiO1xuaW1wb3J0IHR5cGUgeyBJT2JzZXJ2YWJsZVZhbHVlIH0gZnJvbSBcIm1vYnhcIjtcblxuQG9ic2VydmVyXG5jbGFzcyBPdXRwdXRBcmVhIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHsgc3RvcmU6IHN0b3JlIH0+IHtcbiAgc2hvd0hpc3Rvcnk6IElPYnNlcnZhYmxlVmFsdWU8Ym9vbGVhbj4gPSBvYnNlcnZhYmxlKHRydWUpO1xuICBAYWN0aW9uXG4gIHNldEhpc3RvcnkgPSAoKSA9PiB7XG4gICAgdGhpcy5zaG93SGlzdG9yeS5zZXQodHJ1ZSk7XG4gIH07XG5cbiAgQGFjdGlvblxuICBzZXRTY3JvbGxMaXN0ID0gKCkgPT4ge1xuICAgIHRoaXMuc2hvd0hpc3Rvcnkuc2V0KGZhbHNlKTtcbiAgfTtcblxuICBnZXRPdXRwdXRUZXh0KG91dHB1dDogT2JqZWN0KTogP3N0cmluZyB7XG4gICAgc3dpdGNoIChvdXRwdXQub3V0cHV0X3R5cGUpIHtcbiAgICAgIGNhc2UgXCJzdHJlYW1cIjpcbiAgICAgICAgcmV0dXJuIG91dHB1dC50ZXh0O1xuICAgICAgY2FzZSBcImV4ZWN1dGVfcmVzdWx0XCI6XG4gICAgICAgIHJldHVybiBvdXRwdXQuZGF0YVtcInRleHQvcGxhaW5cIl07XG4gICAgICBjYXNlIFwiZXJyb3JcIjpcbiAgICAgICAgcmV0dXJuIG91dHB1dC50cmFjZWJhY2sudG9KUygpLmpvaW4oXCJcXG5cIik7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQ2xpY2sgPSAoKSA9PiB7XG4gICAgY29uc3Qga2VybmVsID0gdGhpcy5wcm9wcy5zdG9yZS5rZXJuZWw7XG4gICAgaWYgKCFrZXJuZWwgfHwgIWtlcm5lbC5vdXRwdXRTdG9yZSkgcmV0dXJuO1xuICAgIGNvbnN0IG91dHB1dCA9IGtlcm5lbC5vdXRwdXRTdG9yZS5vdXRwdXRzW2tlcm5lbC5vdXRwdXRTdG9yZS5pbmRleF07XG4gICAgY29uc3QgY29weU91dHB1dCA9IHRoaXMuZ2V0T3V0cHV0VGV4dChvdXRwdXQpO1xuXG4gICAgaWYgKGNvcHlPdXRwdXQpIHtcbiAgICAgIGF0b20uY2xpcGJvYXJkLndyaXRlKEFuc2VyLmFuc2lUb1RleHQoY29weU91dHB1dCkpO1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXCJDb3BpZWQgdG8gY2xpcGJvYXJkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcIk5vdGhpbmcgdG8gY29weVwiKTtcbiAgICB9XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGtlcm5lbCA9IHRoaXMucHJvcHMuc3RvcmUua2VybmVsO1xuXG4gICAgaWYgKCFrZXJuZWwpIHtcbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoXCJIeWRyb2dlbi5vdXRwdXRBcmVhRG9ja1wiKSkge1xuICAgICAgICByZXR1cm4gPEVtcHR5TWVzc2FnZSAvPjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLmhpZGUoT1VUUFVUX0FSRUFfVVJJKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNpZGViYXIgb3V0cHV0LWFyZWFcIj5cbiAgICAgICAge2tlcm5lbC5vdXRwdXRTdG9yZS5vdXRwdXRzLmxlbmd0aCA+IDAgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJibG9ja1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGJ0biBpY29uIGljb24tY2xvY2ske1xuICAgICAgICAgICAgICAgICAgdGhpcy5zaG93SGlzdG9yeS5nZXQoKSA/IFwiIHNlbGVjdGVkXCIgOiBcIlwiXG4gICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zZXRIaXN0b3J5fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgYnRuIGljb24gaWNvbi10aHJlZS1iYXJzJHtcbiAgICAgICAgICAgICAgICAgICF0aGlzLnNob3dIaXN0b3J5LmdldCgpID8gXCIgc2VsZWN0ZWRcIiA6IFwiXCJcbiAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnNldFNjcm9sbExpc3R9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZmxvYXQ6IFwicmlnaHRcIiB9fT5cbiAgICAgICAgICAgICAge3RoaXMuc2hvd0hpc3RvcnkuZ2V0KCkgPyAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGljb24gaWNvbi1jbGlwcHlcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja31cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBDb3B5XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGljb24gaWNvbi10cmFzaGNhblwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17a2VybmVsLm91dHB1dFN0b3JlLmNsZWFyfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgQ2xlYXJcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8RW1wdHlNZXNzYWdlIC8+XG4gICAgICAgICl9XG4gICAgICAgIHt0aGlzLnNob3dIaXN0b3J5LmdldCgpID8gKFxuICAgICAgICAgIDxIaXN0b3J5IHN0b3JlPXtrZXJuZWwub3V0cHV0U3RvcmV9IC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPFNjcm9sbExpc3Qgb3V0cHV0cz17a2VybmVsLm91dHB1dFN0b3JlLm91dHB1dHN9IC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE91dHB1dEFyZWE7XG4iXX0=