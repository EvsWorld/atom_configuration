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

var _componentsWatchSidebar = require("./../components/watch-sidebar");

var _componentsWatchSidebar2 = _interopRequireDefault(_componentsWatchSidebar);

var WatchesPane = (function () {
  function WatchesPane(store) {
    _classCallCheck(this, WatchesPane);

    this.element = document.createElement("div");
    this.disposer = new _atom.CompositeDisposable();

    this.getTitle = function () {
      return "Hydrogen Watch";
    };

    this.getURI = function () {
      return _utils.WATCHES_URI;
    };

    this.getDefaultLocation = function () {
      return "right";
    };

    this.getAllowedLocations = function () {
      return ["left", "right"];
    };

    this.element.classList.add("hydrogen");

    (0, _utils.reactFactory)(_react2["default"].createElement(_componentsWatchSidebar2["default"], { store: store }), this.element, null, this.disposer);
  }

  _createClass(WatchesPane, [{
    key: "destroy",
    value: function destroy() {
      this.disposer.dispose();
      this.element.remove();
    }
  }]);

  return WatchesPane;
})();

exports["default"] = WatchesPane;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BhbmVzL3dhdGNoZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFb0MsTUFBTTs7cUJBRXhCLE9BQU87Ozs7cUJBRWlCLFlBQVk7O3NDQUVsQywrQkFBK0I7Ozs7SUFFOUIsV0FBVztBQUluQixXQUpRLFdBQVcsQ0FJbEIsS0FBWSxFQUFFOzBCQUpQLFdBQVc7O1NBQzlCLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztTQUN2QyxRQUFRLEdBQUcsK0JBQXlCOztTQVFwQyxRQUFRLEdBQUc7YUFBTSxnQkFBZ0I7S0FBQTs7U0FFakMsTUFBTSxHQUFHOztLQUFpQjs7U0FFMUIsa0JBQWtCLEdBQUc7YUFBTSxPQUFPO0tBQUE7O1NBRWxDLG1CQUFtQixHQUFHO2FBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO0tBQUE7O0FBWDNDLFFBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFdkMsNkJBQWEsd0VBQVMsS0FBSyxFQUFFLEtBQUssQUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQzVFOztlQVJrQixXQUFXOztXQWtCdkIsbUJBQUc7QUFDUixVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDdkI7OztTQXJCa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGFuZXMvd2F0Y2hlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCB7IHJlYWN0RmFjdG9yeSwgV0FUQ0hFU19VUkkgfSBmcm9tIFwiLi8uLi91dGlsc1wiO1xuaW1wb3J0IHR5cGVvZiBzdG9yZSBmcm9tIFwiLi4vc3RvcmVcIjtcbmltcG9ydCBXYXRjaGVzIGZyb20gXCIuLy4uL2NvbXBvbmVudHMvd2F0Y2gtc2lkZWJhclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXRjaGVzUGFuZSB7XG4gIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBkaXNwb3NlciA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgY29uc3RydWN0b3Ioc3RvcmU6IHN0b3JlKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoeWRyb2dlblwiKTtcblxuICAgIHJlYWN0RmFjdG9yeSg8V2F0Y2hlcyBzdG9yZT17c3RvcmV9IC8+LCB0aGlzLmVsZW1lbnQsIG51bGwsIHRoaXMuZGlzcG9zZXIpO1xuICB9XG5cbiAgZ2V0VGl0bGUgPSAoKSA9PiBcIkh5ZHJvZ2VuIFdhdGNoXCI7XG5cbiAgZ2V0VVJJID0gKCkgPT4gV0FUQ0hFU19VUkk7XG5cbiAgZ2V0RGVmYXVsdExvY2F0aW9uID0gKCkgPT4gXCJyaWdodFwiO1xuXG4gIGdldEFsbG93ZWRMb2NhdGlvbnMgPSAoKSA9PiBbXCJsZWZ0XCIsIFwicmlnaHRcIl07XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRpc3Bvc2VyLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG4gIH1cbn1cbiJdfQ==