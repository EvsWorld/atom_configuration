Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _mobx = require("mobx");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _tildify = require("tildify");

var _tildify2 = _interopRequireDefault(_tildify);

var _utils = require("./../utils");

var _kernel = require("../kernel");

var _kernel2 = _interopRequireDefault(_kernel);

var displayOrder = ["text/html", "text/markdown", "text/plain"];

var Monitor = (0, _mobxReact.observer)(function (_ref) {
  var kernel = _ref.kernel;
  var files = _ref.files;

  var destroy = function destroy() {
    kernel.shutdown();
    kernel.destroy();
  };

  return _react2["default"].createElement(
    "div",
    { style: { padding: "5px 10px", display: "flex" } },
    _react2["default"].createElement(
      "div",
      { style: { flex: 1, whiteSpace: "nowrap" } },
      kernel.displayName
    ),
    _react2["default"].createElement(
      "div",
      {
        style: {
          padding: "0 10px",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap"
        }
      },
      files
    ),
    _react2["default"].createElement("div", { className: "icon icon-trashcan", onClick: destroy })
  );
});

var MonitorSection = (0, _mobxReact.observer)(function (_ref2) {
  var store = _ref2.store;
  var kernels = _ref2.kernels;
  var group = _ref2.group;
  return _react2["default"].createElement(
    "div",
    null,
    _react2["default"].createElement(
      "header",
      null,
      group
    ),
    kernels.map(function (kernel) {
      var files = store.getFilesForKernel(kernel).map(_tildify2["default"]).join(", ");
      return _react2["default"].createElement(Monitor, {
        kernel: kernel,
        files: files,
        key: kernel.displayName + files
      });
    })
  );
});

var KernelMonitor = (0, _mobxReact.observer)(function (_ref3) {
  var store = _ref3.store;
  return (function () {
    if (store.runningKernels.length === 0) {
      return _react2["default"].createElement(
        "ul",
        { className: "background-message centered" },
        _react2["default"].createElement(
          "li",
          null,
          "No running kernels"
        )
      );
    }
    var grouped = _lodash2["default"].groupBy(store.runningKernels, function (kernel) {
      return kernel.gatewayName || "Local";
    });
    return _react2["default"].createElement(
      "div",
      { className: "kernel-monitor" },
      _lodash2["default"].map(grouped, function (kernels, group) {
        return _react2["default"].createElement(MonitorSection, {
          store: store,
          kernels: kernels,
          group: group,
          key: group
        });
      })
    );
  })();
});

exports["default"] = KernelMonitor;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMva2VybmVsLW1vbml0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3FCQUVrQixPQUFPOzs7O3lCQUNBLFlBQVk7O29CQUNWLE1BQU07O3NCQUNuQixRQUFROzs7O3VCQUNGLFNBQVM7Ozs7cUJBRU0sWUFBWTs7c0JBSzVCLFdBQVc7Ozs7QUFIOUIsSUFBTSxZQUFZLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDOztBQU1sRSxJQUFNLE9BQU8sR0FBRyx5QkFBUyxVQUFDLElBQWlCLEVBQW1CO01BQWxDLE1BQU0sR0FBUixJQUFpQixDQUFmLE1BQU07TUFBRSxLQUFLLEdBQWYsSUFBaUIsQ0FBUCxLQUFLOztBQUN2QyxNQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sR0FBUztBQUNwQixVQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDbEIsVUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ2xCLENBQUM7O0FBRUYsU0FDRTs7TUFBSyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQUFBQztJQUNuRDs7UUFBSyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQUFBQztNQUFFLE1BQU0sQ0FBQyxXQUFXO0tBQU87SUFDekU7OztBQUNFLGFBQUssRUFBRTtBQUNMLGlCQUFPLEVBQUUsUUFBUTtBQUNqQixzQkFBWSxFQUFFLFVBQVU7QUFDeEIsa0JBQVEsRUFBRSxRQUFRO0FBQ2xCLG9CQUFVLEVBQUUsUUFBUTtTQUNyQixBQUFDOztNQUVELEtBQUs7S0FDRjtJQUNOLDBDQUFLLFNBQVMsRUFBQyxvQkFBb0IsRUFBQyxPQUFPLEVBQUUsT0FBTyxBQUFDLEdBQUc7R0FDcEQsQ0FDTjtDQUNILENBQUMsQ0FBQzs7QUFHSCxJQUFNLGNBQWMsR0FBRyx5QkFBUyxVQUFDLEtBQXlCO01BQXZCLEtBQUssR0FBUCxLQUF5QixDQUF2QixLQUFLO01BQUUsT0FBTyxHQUFoQixLQUF5QixDQUFoQixPQUFPO01BQUUsS0FBSyxHQUF2QixLQUF5QixDQUFQLEtBQUs7U0FDdEQ7OztJQUNFOzs7TUFBUyxLQUFLO0tBQVU7SUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUNyQixVQUFNLEtBQUssR0FBRyxLQUFLLENBQ2hCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUN6QixHQUFHLHNCQUFTLENBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2QsYUFDRSxpQ0FBQyxPQUFPO0FBQ04sY0FBTSxFQUFFLE1BQU0sQUFBQztBQUNmLGFBQUssRUFBRSxLQUFLLEFBQUM7QUFDYixXQUFHLEVBQUUsTUFBTSxDQUFDLFdBQVcsR0FBRyxLQUFLLEFBQUM7UUFDaEMsQ0FDRjtLQUNILENBQUM7R0FDRTtDQUNQLENBQUMsQ0FBQzs7QUFFSCxJQUFNLGFBQWEsR0FBRyx5QkFBUyxVQUFDLEtBQVM7TUFBUCxLQUFLLEdBQVAsS0FBUyxDQUFQLEtBQUs7c0JBQXlCO0FBQzlELFFBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3JDLGFBQ0U7O1VBQUksU0FBUyxFQUFDLDZCQUE2QjtRQUN6Qzs7OztTQUEyQjtPQUN4QixDQUNMO0tBQ0g7QUFDRCxRQUFNLE9BQU8sR0FBRyxvQkFBRSxPQUFPLENBQ3ZCLEtBQUssQ0FBQyxjQUFjLEVBQ3BCLFVBQUEsTUFBTTthQUFJLE1BQU0sQ0FBQyxXQUFXLElBQUksT0FBTztLQUFBLENBQ3hDLENBQUM7QUFDRixXQUNFOztRQUFLLFNBQVMsRUFBQyxnQkFBZ0I7TUFDNUIsb0JBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxVQUFDLE9BQU8sRUFBRSxLQUFLO2VBQzdCLGlDQUFDLGNBQWM7QUFDYixlQUFLLEVBQUUsS0FBSyxBQUFDO0FBQ2IsaUJBQU8sRUFBRSxPQUFPLEFBQUM7QUFDakIsZUFBSyxFQUFFLEtBQUssQUFBQztBQUNiLGFBQUcsRUFBRSxLQUFLLEFBQUM7VUFDWDtPQUNILENBQUM7S0FDRSxDQUNOO0dBQ0g7Q0FBQSxDQUFDLENBQUM7O3FCQUVZLGFBQWEiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9rZXJuZWwtbW9uaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3RcIjtcbmltcG9ydCB7IG9ic2VydmFibGUgfSBmcm9tIFwibW9ieFwiO1xuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHRpbGRpZnkgZnJvbSBcInRpbGRpZnlcIjtcblxuaW1wb3J0IHsgS0VSTkVMX01PTklUT1JfVVJJIH0gZnJvbSBcIi4vLi4vdXRpbHNcIjtcblxuY29uc3QgZGlzcGxheU9yZGVyID0gW1widGV4dC9odG1sXCIsIFwidGV4dC9tYXJrZG93blwiLCBcInRleHQvcGxhaW5cIl07XG5cbmltcG9ydCB0eXBlb2Ygc3RvcmUgZnJvbSBcIi4uL3N0b3JlXCI7XG5pbXBvcnQgS2VybmVsIGZyb20gXCIuLi9rZXJuZWxcIjtcblxudHlwZSBNb25pdG9yUHJvcHMgPSB7IGtlcm5lbDogS2VybmVsLCBmaWxlczogc3RyaW5nIH07XG5jb25zdCBNb25pdG9yID0gb2JzZXJ2ZXIoKHsga2VybmVsLCBmaWxlcyB9OiBNb25pdG9yUHJvcHMpID0+IHtcbiAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcbiAgICBrZXJuZWwuc2h1dGRvd24oKTtcbiAgICBrZXJuZWwuZGVzdHJveSgpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiBcIjVweCAxMHB4XCIsIGRpc3BsYXk6IFwiZmxleFwiIH19PlxuICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCB3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiIH19PntrZXJuZWwuZGlzcGxheU5hbWV9PC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcGFkZGluZzogXCIwIDEwcHhcIixcbiAgICAgICAgICB0ZXh0T3ZlcmZsb3c6IFwiZWxsaXBzaXNcIixcbiAgICAgICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgICAgICB3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtmaWxlc31cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpY29uIGljb24tdHJhc2hjYW5cIiBvbkNsaWNrPXtkZXN0cm95fSAvPlxuICAgIDwvZGl2PlxuICApO1xufSk7XG5cbnR5cGUgUHJvcHMgPSB7IHN0b3JlOiBzdG9yZSwga2VybmVsczogQXJyYXk8S2VybmVsPiwgZ3JvdXA6IHN0cmluZyB9O1xuY29uc3QgTW9uaXRvclNlY3Rpb24gPSBvYnNlcnZlcigoeyBzdG9yZSwga2VybmVscywgZ3JvdXAgfTogUHJvcHMpID0+IChcbiAgPGRpdj5cbiAgICA8aGVhZGVyPntncm91cH08L2hlYWRlcj5cbiAgICB7a2VybmVscy5tYXAoa2VybmVsID0+IHtcbiAgICAgIGNvbnN0IGZpbGVzID0gc3RvcmVcbiAgICAgICAgLmdldEZpbGVzRm9yS2VybmVsKGtlcm5lbClcbiAgICAgICAgLm1hcCh0aWxkaWZ5KVxuICAgICAgICAuam9pbihcIiwgXCIpO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPE1vbml0b3JcbiAgICAgICAgICBrZXJuZWw9e2tlcm5lbH1cbiAgICAgICAgICBmaWxlcz17ZmlsZXN9XG4gICAgICAgICAga2V5PXtrZXJuZWwuZGlzcGxheU5hbWUgKyBmaWxlc31cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSl9XG4gIDwvZGl2PlxuKSk7XG5cbmNvbnN0IEtlcm5lbE1vbml0b3IgPSBvYnNlcnZlcigoeyBzdG9yZSB9OiB7IHN0b3JlOiBzdG9yZSB9KSA9PiB7XG4gIGlmIChzdG9yZS5ydW5uaW5nS2VybmVscy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHVsIGNsYXNzTmFtZT1cImJhY2tncm91bmQtbWVzc2FnZSBjZW50ZXJlZFwiPlxuICAgICAgICA8bGk+Tm8gcnVubmluZyBrZXJuZWxzPC9saT5cbiAgICAgIDwvdWw+XG4gICAgKTtcbiAgfVxuICBjb25zdCBncm91cGVkID0gXy5ncm91cEJ5KFxuICAgIHN0b3JlLnJ1bm5pbmdLZXJuZWxzLFxuICAgIGtlcm5lbCA9PiBrZXJuZWwuZ2F0ZXdheU5hbWUgfHwgXCJMb2NhbFwiXG4gICk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJrZXJuZWwtbW9uaXRvclwiPlxuICAgICAge18ubWFwKGdyb3VwZWQsIChrZXJuZWxzLCBncm91cCkgPT4gKFxuICAgICAgICA8TW9uaXRvclNlY3Rpb25cbiAgICAgICAgICBzdG9yZT17c3RvcmV9XG4gICAgICAgICAga2VybmVscz17a2VybmVsc31cbiAgICAgICAgICBncm91cD17Z3JvdXB9XG4gICAgICAgICAga2V5PXtncm91cH1cbiAgICAgICAgLz5cbiAgICAgICkpfVxuICAgIDwvZGl2PlxuICApO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEtlcm5lbE1vbml0b3I7XG4iXX0=