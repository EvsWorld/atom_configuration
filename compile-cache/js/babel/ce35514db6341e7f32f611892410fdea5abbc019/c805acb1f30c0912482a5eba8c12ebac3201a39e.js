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

var _componentsKernelMonitor = require("./../components/kernel-monitor");

var _componentsKernelMonitor2 = _interopRequireDefault(_componentsKernelMonitor);

var KernelMonitorPane = (function () {
  function KernelMonitorPane(store) {
    _classCallCheck(this, KernelMonitorPane);

    this.element = document.createElement("div");
    this.disposer = new _atom.CompositeDisposable();

    this.getTitle = function () {
      return "Hydrogen Kernel Monitor";
    };

    this.getURI = function () {
      return _utils.KERNEL_MONITOR_URI;
    };

    this.getDefaultLocation = function () {
      return "bottom";
    };

    this.getAllowedLocations = function () {
      return ["bottom", "left", "right"];
    };

    this.element.classList.add("hydrogen");

    (0, _utils.reactFactory)(_react2["default"].createElement(_componentsKernelMonitor2["default"], { store: store }), this.element, null, this.disposer);
  }

  _createClass(KernelMonitorPane, [{
    key: "destroy",
    value: function destroy() {
      this.disposer.dispose();
      this.element.remove();
    }
  }]);

  return KernelMonitorPane;
})();

exports["default"] = KernelMonitorPane;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BhbmVzL2tlcm5lbC1tb25pdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRW9DLE1BQU07O3FCQUV4QixPQUFPOzs7O3FCQUV3QixZQUFZOzt1Q0FFbkMsZ0NBQWdDOzs7O0lBRXJDLGlCQUFpQjtBQUl6QixXQUpRLGlCQUFpQixDQUl4QixLQUFZLEVBQUU7MEJBSlAsaUJBQWlCOztTQUNwQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7U0FDdkMsUUFBUSxHQUFHLCtCQUF5Qjs7U0FhcEMsUUFBUSxHQUFHO2FBQU0seUJBQXlCO0tBQUE7O1NBRTFDLE1BQU0sR0FBRzs7S0FBd0I7O1NBRWpDLGtCQUFrQixHQUFHO2FBQU0sUUFBUTtLQUFBOztTQUVuQyxtQkFBbUIsR0FBRzthQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7S0FBQTs7QUFoQnJELFFBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFdkMsNkJBQ0UseUVBQWUsS0FBSyxFQUFFLEtBQUssQUFBQyxHQUFHLEVBQy9CLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxFQUNKLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQztHQUNIOztlQWJrQixpQkFBaUI7O1dBdUI3QixtQkFBRztBQUNSLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDeEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUN2Qjs7O1NBMUJrQixpQkFBaUI7OztxQkFBakIsaUJBQWlCIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BhbmVzL2tlcm5lbC1tb25pdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCI7XG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IHsgcmVhY3RGYWN0b3J5LCBLRVJORUxfTU9OSVRPUl9VUkkgfSBmcm9tIFwiLi8uLi91dGlsc1wiO1xuaW1wb3J0IHR5cGVvZiBzdG9yZSBmcm9tIFwiLi4vc3RvcmVcIjtcbmltcG9ydCBLZXJuZWxNb25pdG9yIGZyb20gXCIuLy4uL2NvbXBvbmVudHMva2VybmVsLW1vbml0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS2VybmVsTW9uaXRvclBhbmUge1xuICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZGlzcG9zZXIgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JlOiBzdG9yZSkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaHlkcm9nZW5cIik7XG5cbiAgICByZWFjdEZhY3RvcnkoXG4gICAgICA8S2VybmVsTW9uaXRvciBzdG9yZT17c3RvcmV9IC8+LFxuICAgICAgdGhpcy5lbGVtZW50LFxuICAgICAgbnVsbCxcbiAgICAgIHRoaXMuZGlzcG9zZXJcbiAgICApO1xuICB9XG5cbiAgZ2V0VGl0bGUgPSAoKSA9PiBcIkh5ZHJvZ2VuIEtlcm5lbCBNb25pdG9yXCI7XG5cbiAgZ2V0VVJJID0gKCkgPT4gS0VSTkVMX01PTklUT1JfVVJJO1xuXG4gIGdldERlZmF1bHRMb2NhdGlvbiA9ICgpID0+IFwiYm90dG9tXCI7XG5cbiAgZ2V0QWxsb3dlZExvY2F0aW9ucyA9ICgpID0+IFtcImJvdHRvbVwiLCBcImxlZnRcIiwgXCJyaWdodFwiXTtcblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGlzcG9zZXIuZGlzcG9zZSgpO1xuICAgIHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcbiAgfVxufVxuIl19