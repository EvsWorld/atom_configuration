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

var _componentsOutputArea = require("./../components/output-area");

var _componentsOutputArea2 = _interopRequireDefault(_componentsOutputArea);

var OutputPane = (function () {
  function OutputPane(store) {
    _classCallCheck(this, OutputPane);

    this.element = document.createElement("div");
    this.disposer = new _atom.CompositeDisposable();

    this.getTitle = function () {
      return "Hydrogen Output Area";
    };

    this.getURI = function () {
      return _utils.OUTPUT_AREA_URI;
    };

    this.getDefaultLocation = function () {
      return "right";
    };

    this.getAllowedLocations = function () {
      return ["left", "right", "bottom"];
    };

    this.element.classList.add("hydrogen");

    this.disposer.add(new _atom.Disposable(function () {
      if (store.kernel) store.kernel.outputStore.clear();
    }));

    this.disposer.add(atom.commands.add(this.element, {
      "core:move-left": function coreMoveLeft() {
        if (!store.kernel) return;
        store.kernel.outputStore.decrementIndex();
      },
      "core:move-right": function coreMoveRight() {
        if (!store.kernel) return;
        store.kernel.outputStore.incrementIndex();
      }
    }));

    (0, _utils.reactFactory)(_react2["default"].createElement(_componentsOutputArea2["default"], { store: store }), this.element, null, this.disposer);
  }

  _createClass(OutputPane, [{
    key: "destroy",
    value: function destroy() {
      this.disposer.dispose();
      this.element.remove();
    }
  }]);

  return OutputPane;
})();

exports["default"] = OutputPane;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BhbmVzL291dHB1dC1hcmVhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWdELE1BQU07O3FCQUVwQyxPQUFPOzs7O3FCQUVxQixZQUFZOztvQ0FFbkMsNkJBQTZCOzs7O0lBRS9CLFVBQVU7QUFJbEIsV0FKUSxVQUFVLENBSWpCLEtBQVksRUFBRTswQkFKUCxVQUFVOztTQUM3QixPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7U0FDdkMsUUFBUSxHQUFHLCtCQUF5Qjs7U0FnQ3BDLFFBQVEsR0FBRzthQUFNLHNCQUFzQjtLQUFBOztTQUV2QyxNQUFNLEdBQUc7O0tBQXFCOztTQUU5QixrQkFBa0IsR0FBRzthQUFNLE9BQU87S0FBQTs7U0FFbEMsbUJBQW1CLEdBQUc7YUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDO0tBQUE7O0FBbkNyRCxRQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXZDLFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUNmLHFCQUFlLFlBQU07QUFDbkIsVUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3BELENBQUMsQ0FDSCxDQUFDOztBQUVGLFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDOUIsc0JBQWdCLEVBQUUsd0JBQU07QUFDdEIsWUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTztBQUMxQixhQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUMzQztBQUNELHVCQUFpQixFQUFFLHlCQUFNO0FBQ3ZCLFlBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU87QUFDMUIsYUFBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7T0FDM0M7S0FDRixDQUFDLENBQ0gsQ0FBQzs7QUFFRiw2QkFDRSxzRUFBWSxLQUFLLEVBQUUsS0FBSyxBQUFDLEdBQUcsRUFDNUIsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLEVBQ0osSUFBSSxDQUFDLFFBQVEsQ0FDZCxDQUFDO0dBQ0g7O2VBaENrQixVQUFVOztXQTBDdEIsbUJBQUc7QUFDUixVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDdkI7OztTQTdDa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGFuZXMvb3V0cHV0LWFyZWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSBcImF0b21cIjtcblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgeyByZWFjdEZhY3RvcnksIE9VVFBVVF9BUkVBX1VSSSB9IGZyb20gXCIuLy4uL3V0aWxzXCI7XG5pbXBvcnQgdHlwZW9mIHN0b3JlIGZyb20gXCIuLi9zdG9yZVwiO1xuaW1wb3J0IE91dHB1dEFyZWEgZnJvbSBcIi4vLi4vY29tcG9uZW50cy9vdXRwdXQtYXJlYVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdXRwdXRQYW5lIHtcbiAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGRpc3Bvc2VyID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICBjb25zdHJ1Y3RvcihzdG9yZTogc3RvcmUpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImh5ZHJvZ2VuXCIpO1xuXG4gICAgdGhpcy5kaXNwb3Nlci5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICAgIGlmIChzdG9yZS5rZXJuZWwpIHN0b3JlLmtlcm5lbC5vdXRwdXRTdG9yZS5jbGVhcigpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgdGhpcy5kaXNwb3Nlci5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICAgXCJjb3JlOm1vdmUtbGVmdFwiOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKCFzdG9yZS5rZXJuZWwpIHJldHVybjtcbiAgICAgICAgICBzdG9yZS5rZXJuZWwub3V0cHV0U3RvcmUuZGVjcmVtZW50SW5kZXgoKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJjb3JlOm1vdmUtcmlnaHRcIjogKCkgPT4ge1xuICAgICAgICAgIGlmICghc3RvcmUua2VybmVsKSByZXR1cm47XG4gICAgICAgICAgc3RvcmUua2VybmVsLm91dHB1dFN0b3JlLmluY3JlbWVudEluZGV4KCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJlYWN0RmFjdG9yeShcbiAgICAgIDxPdXRwdXRBcmVhIHN0b3JlPXtzdG9yZX0gLz4sXG4gICAgICB0aGlzLmVsZW1lbnQsXG4gICAgICBudWxsLFxuICAgICAgdGhpcy5kaXNwb3NlclxuICAgICk7XG4gIH1cblxuICBnZXRUaXRsZSA9ICgpID0+IFwiSHlkcm9nZW4gT3V0cHV0IEFyZWFcIjtcblxuICBnZXRVUkkgPSAoKSA9PiBPVVRQVVRfQVJFQV9VUkk7XG5cbiAgZ2V0RGVmYXVsdExvY2F0aW9uID0gKCkgPT4gXCJyaWdodFwiO1xuXG4gIGdldEFsbG93ZWRMb2NhdGlvbnMgPSAoKSA9PiBbXCJsZWZ0XCIsIFwicmlnaHRcIiwgXCJib3R0b21cIl07XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRpc3Bvc2VyLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG4gIH1cbn1cbiJdfQ==