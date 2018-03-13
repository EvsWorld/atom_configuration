Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atom = require("atom");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _utils = require("./../utils");

var _componentsInspector = require("./../components/inspector");

var _componentsInspector2 = _interopRequireDefault(_componentsInspector);

var InspectorPane = (function () {
  function InspectorPane(store) {
    _classCallCheck(this, InspectorPane);

    this.element = document.createElement("div");
    this.disposer = new _atom.CompositeDisposable();

    this.getTitle = function () {
      return "Hydrogen Inspector";
    };

    this.getURI = function () {
      return _utils.INSPECTOR_URI;
    };

    this.getDefaultLocation = function () {
      return "bottom";
    };

    this.getAllowedLocations = function () {
      return ["bottom", "left", "right"];
    };

    this.element.classList.add("hydrogen", "inspector");

    (0, _utils.reactFactory)(_react2["default"].createElement(_componentsInspector2["default"], { store: store }), this.element, null, this.disposer);
  }

  _createClass(InspectorPane, [{
    key: "destroy",
    value: function destroy() {
      this.disposer.dispose();
      this.element.remove();
    }
  }]);

  return InspectorPane;
})();

exports["default"] = InspectorPane;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BhbmVzL2luc3BlY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVvQyxNQUFNOztxQkFFeEIsT0FBTzs7OztxQkFFbUIsWUFBWTs7bUNBRWxDLDJCQUEyQjs7OztJQUU1QixhQUFhO0FBSXJCLFdBSlEsYUFBYSxDQUlwQixLQUFZLEVBQUU7MEJBSlAsYUFBYTs7U0FDaEMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1NBQ3ZDLFFBQVEsR0FBRywrQkFBeUI7O1NBYXBDLFFBQVEsR0FBRzthQUFNLG9CQUFvQjtLQUFBOztTQUVyQyxNQUFNLEdBQUc7O0tBQW1COztTQUU1QixrQkFBa0IsR0FBRzthQUFNLFFBQVE7S0FBQTs7U0FFbkMsbUJBQW1CLEdBQUc7YUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDO0tBQUE7O0FBaEJyRCxRQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUVwRCw2QkFDRSxxRUFBVyxLQUFLLEVBQUUsS0FBSyxBQUFDLEdBQUcsRUFDM0IsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLEVBQ0osSUFBSSxDQUFDLFFBQVEsQ0FDZCxDQUFDO0dBQ0g7O2VBYmtCLGFBQWE7O1dBdUJ6QixtQkFBRztBQUNSLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDeEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUN2Qjs7O1NBMUJrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9wYW5lcy9pbnNwZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSBcImF0b21cIjtcblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgeyByZWFjdEZhY3RvcnksIElOU1BFQ1RPUl9VUkkgfSBmcm9tIFwiLi8uLi91dGlsc1wiO1xuaW1wb3J0IHR5cGVvZiBzdG9yZSBmcm9tIFwiLi4vc3RvcmVcIjtcbmltcG9ydCBJbnNwZWN0b3IgZnJvbSBcIi4vLi4vY29tcG9uZW50cy9pbnNwZWN0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5zcGVjdG9yUGFuZSB7XG4gIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBkaXNwb3NlciA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgY29uc3RydWN0b3Ioc3RvcmU6IHN0b3JlKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoeWRyb2dlblwiLCBcImluc3BlY3RvclwiKTtcblxuICAgIHJlYWN0RmFjdG9yeShcbiAgICAgIDxJbnNwZWN0b3Igc3RvcmU9e3N0b3JlfSAvPixcbiAgICAgIHRoaXMuZWxlbWVudCxcbiAgICAgIG51bGwsXG4gICAgICB0aGlzLmRpc3Bvc2VyXG4gICAgKTtcbiAgfVxuXG4gIGdldFRpdGxlID0gKCkgPT4gXCJIeWRyb2dlbiBJbnNwZWN0b3JcIjtcblxuICBnZXRVUkkgPSAoKSA9PiBJTlNQRUNUT1JfVVJJO1xuXG4gIGdldERlZmF1bHRMb2NhdGlvbiA9ICgpID0+IFwiYm90dG9tXCI7XG5cbiAgZ2V0QWxsb3dlZExvY2F0aW9ucyA9ICgpID0+IFtcImJvdHRvbVwiLCBcImxlZnRcIiwgXCJyaWdodFwiXTtcblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGlzcG9zZXIuZGlzcG9zZSgpO1xuICAgIHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcbiAgfVxufVxuIl19