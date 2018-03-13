Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atomSelectList = require("atom-select-list");

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _tildify = require("tildify");

var _tildify2 = _interopRequireDefault(_tildify);

var _wsKernel = require("./ws-kernel");

var _wsKernel2 = _interopRequireDefault(_wsKernel);

var _utils = require("./utils");

function getName(kernel) {
  var prefix = kernel instanceof _wsKernel2["default"] ? kernel.gatewayName + ": " : "";
  return prefix + kernel.displayName + " - " + _store2["default"].getFilesForKernel(kernel).map(_tildify2["default"]).join(", ");
}

var ExistingKernelPicker = (function () {
  function ExistingKernelPicker() {
    var _this = this;

    _classCallCheck(this, ExistingKernelPicker);

    this.selectListView = new _atomSelectList2["default"]({
      itemsClassList: ["mark-active"],
      items: [],
      filterKeyForItem: function filterKeyForItem(kernel) {
        return getName(kernel);
      },
      elementForItem: function elementForItem(kernel) {
        var element = document.createElement("li");
        element.textContent = getName(kernel);
        return element;
      },
      didConfirmSelection: function didConfirmSelection(kernel) {
        var filePath = _store2["default"].filePath;
        var editor = _store2["default"].editor;
        var grammar = _store2["default"].grammar;

        if (!filePath || !editor || !grammar) return _this.cancel();
        _store2["default"].newKernel(kernel, filePath, editor, grammar);
        _this.cancel();
      },
      didCancelSelection: function didCancelSelection() {
        return _this.cancel();
      },
      emptyMessage: "No running kernels for this language."
    });
  }

  _createClass(ExistingKernelPicker, [{
    key: "destroy",
    value: function destroy() {
      this.cancel();
      return this.selectListView.destroy();
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.panel != null) {
        this.panel.destroy();
      }
      this.panel = null;
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    }
  }, {
    key: "attach",
    value: function attach() {
      this.previouslyFocusedElement = document.activeElement;
      if (this.panel == null) this.panel = atom.workspace.addModalPanel({ item: this.selectListView });
      this.selectListView.focus();
      this.selectListView.reset();
    }
  }, {
    key: "toggle",
    value: _asyncToGenerator(function* () {
      if (this.panel != null) {
        this.cancel();
      } else if (_store2["default"].filePath && _store2["default"].grammar) {
        yield this.selectListView.update({
          items: _store2["default"].runningKernels.filter(function (kernel) {
            return (0, _utils.kernelSpecProvidesGrammar)(kernel.kernelSpec, _store2["default"].grammar);
          })
        });
        _store2["default"].markers.clear();
        this.attach();
      }
    })
  }]);

  return ExistingKernelPicker;
})();

exports["default"] = ExistingKernelPicker;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2V4aXN0aW5nLWtlcm5lbC1waWNrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzhCQUUyQixrQkFBa0I7Ozs7cUJBQzNCLFNBQVM7Ozs7c0JBQ2IsUUFBUTs7Ozt1QkFDRixTQUFTOzs7O3dCQUVSLGFBQWE7Ozs7cUJBQ1EsU0FBUzs7QUFJbkQsU0FBUyxPQUFPLENBQUMsTUFBYyxFQUFFO0FBQy9CLE1BQU0sTUFBTSxHQUFHLE1BQU0saUNBQW9CLEdBQU0sTUFBTSxDQUFDLFdBQVcsVUFBTyxFQUFFLENBQUM7QUFDM0UsU0FDRSxNQUFNLEdBQ04sTUFBTSxDQUFDLFdBQVcsR0FDbEIsS0FBSyxHQUNMLG1CQUNHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUN6QixHQUFHLHNCQUFTLENBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxDQUNiO0NBQ0g7O0lBRW9CLG9CQUFvQjtBQUs1QixXQUxRLG9CQUFvQixHQUt6Qjs7OzBCQUxLLG9CQUFvQjs7QUFNckMsUUFBSSxDQUFDLGNBQWMsR0FBRyxnQ0FBbUI7QUFDdkMsb0JBQWMsRUFBRSxDQUFDLGFBQWEsQ0FBQztBQUMvQixXQUFLLEVBQUUsRUFBRTtBQUNULHNCQUFnQixFQUFFLDBCQUFBLE1BQU07ZUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO09BQUE7QUFDM0Msb0JBQWMsRUFBRSx3QkFBQSxNQUFNLEVBQUk7QUFDeEIsWUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxlQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxlQUFPLE9BQU8sQ0FBQztPQUNoQjtBQUNELHlCQUFtQixFQUFFLDZCQUFBLE1BQU0sRUFBSTtZQUNyQixRQUFRLHNCQUFSLFFBQVE7WUFBRSxNQUFNLHNCQUFOLE1BQU07WUFBRSxPQUFPLHNCQUFQLE9BQU87O0FBQ2pDLFlBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxNQUFLLE1BQU0sRUFBRSxDQUFDO0FBQzNELDJCQUFNLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNuRCxjQUFLLE1BQU0sRUFBRSxDQUFDO09BQ2Y7QUFDRCx3QkFBa0IsRUFBRTtlQUFNLE1BQUssTUFBTSxFQUFFO09BQUE7QUFDdkMsa0JBQVksRUFBRSx1Q0FBdUM7S0FDdEQsQ0FBQyxDQUFDO0dBQ0o7O2VBeEJrQixvQkFBb0I7O1dBMEJoQyxtQkFBRztBQUNSLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNkLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN0Qzs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDdEI7QUFDRCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtBQUNqQyxZQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdEMsWUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztPQUN0QztLQUNGOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksQ0FBQyx3QkFBd0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO0FBQ3ZELFVBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7QUFDM0UsVUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixVQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzdCOzs7NkJBRVcsYUFBRztBQUNiLFVBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7QUFDdEIsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2YsTUFBTSxJQUFJLG1CQUFNLFFBQVEsSUFBSSxtQkFBTSxPQUFPLEVBQUU7QUFDMUMsY0FBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztBQUMvQixlQUFLLEVBQUUsbUJBQU0sY0FBYyxDQUFDLE1BQU0sQ0FBQyxVQUFBLE1BQU07bUJBQ3ZDLHNDQUEwQixNQUFNLENBQUMsVUFBVSxFQUFFLG1CQUFNLE9BQU8sQ0FBQztXQUFBLENBQzVEO1NBQ0YsQ0FBQyxDQUFDO0FBQ0gsMkJBQU0sT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3RCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmO0tBQ0Y7OztTQTlEa0Isb0JBQW9COzs7cUJBQXBCLG9CQUFvQiIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9leGlzdGluZy1rZXJuZWwtcGlja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFNlbGVjdExpc3RWaWV3IGZyb20gXCJhdG9tLXNlbGVjdC1saXN0XCI7XG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4vc3RvcmVcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB0aWxkaWZ5IGZyb20gXCJ0aWxkaWZ5XCI7XG5cbmltcG9ydCBXU0tlcm5lbCBmcm9tIFwiLi93cy1rZXJuZWxcIjtcbmltcG9ydCB7IGtlcm5lbFNwZWNQcm92aWRlc0dyYW1tYXIgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5pbXBvcnQgdHlwZSBLZXJuZWwgZnJvbSBcIi4va2VybmVsXCI7XG5cbmZ1bmN0aW9uIGdldE5hbWUoa2VybmVsOiBLZXJuZWwpIHtcbiAgY29uc3QgcHJlZml4ID0ga2VybmVsIGluc3RhbmNlb2YgV1NLZXJuZWwgPyBgJHtrZXJuZWwuZ2F0ZXdheU5hbWV9OiBgIDogXCJcIjtcbiAgcmV0dXJuIChcbiAgICBwcmVmaXggK1xuICAgIGtlcm5lbC5kaXNwbGF5TmFtZSArXG4gICAgXCIgLSBcIiArXG4gICAgc3RvcmVcbiAgICAgIC5nZXRGaWxlc0Zvcktlcm5lbChrZXJuZWwpXG4gICAgICAubWFwKHRpbGRpZnkpXG4gICAgICAuam9pbihcIiwgXCIpXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4aXN0aW5nS2VybmVsUGlja2VyIHtcbiAga2VybmVsU3BlY3M6IEFycmF5PEtlcm5lbHNwZWM+O1xuICBzZWxlY3RMaXN0VmlldzogU2VsZWN0TGlzdFZpZXc7XG4gIHBhbmVsOiA/YXRvbSRQYW5lbDtcbiAgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50OiA/SFRNTEVsZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcgPSBuZXcgU2VsZWN0TGlzdFZpZXcoe1xuICAgICAgaXRlbXNDbGFzc0xpc3Q6IFtcIm1hcmstYWN0aXZlXCJdLFxuICAgICAgaXRlbXM6IFtdLFxuICAgICAgZmlsdGVyS2V5Rm9ySXRlbToga2VybmVsID0+IGdldE5hbWUoa2VybmVsKSxcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiBrZXJuZWwgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gZ2V0TmFtZShrZXJuZWwpO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH0sXG4gICAgICBkaWRDb25maXJtU2VsZWN0aW9uOiBrZXJuZWwgPT4ge1xuICAgICAgICBjb25zdCB7IGZpbGVQYXRoLCBlZGl0b3IsIGdyYW1tYXIgfSA9IHN0b3JlO1xuICAgICAgICBpZiAoIWZpbGVQYXRoIHx8ICFlZGl0b3IgfHwgIWdyYW1tYXIpIHJldHVybiB0aGlzLmNhbmNlbCgpO1xuICAgICAgICBzdG9yZS5uZXdLZXJuZWwoa2VybmVsLCBmaWxlUGF0aCwgZWRpdG9yLCBncmFtbWFyKTtcbiAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgIH0sXG4gICAgICBkaWRDYW5jZWxTZWxlY3Rpb246ICgpID0+IHRoaXMuY2FuY2VsKCksXG4gICAgICBlbXB0eU1lc3NhZ2U6IFwiTm8gcnVubmluZyBrZXJuZWxzIGZvciB0aGlzIGxhbmd1YWdlLlwiXG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0TGlzdFZpZXcuZGVzdHJveSgpO1xuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIGlmICh0aGlzLnBhbmVsICE9IG51bGwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpO1xuICAgIH1cbiAgICB0aGlzLnBhbmVsID0gbnVsbDtcbiAgICBpZiAodGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQpIHtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYXR0YWNoKCkge1xuICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBpZiAodGhpcy5wYW5lbCA9PSBudWxsKVxuICAgICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiB0aGlzLnNlbGVjdExpc3RWaWV3IH0pO1xuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuZm9jdXMoKTtcbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnJlc2V0KCk7XG4gIH1cblxuICBhc3luYyB0b2dnbGUoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICB9IGVsc2UgaWYgKHN0b3JlLmZpbGVQYXRoICYmIHN0b3JlLmdyYW1tYXIpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtcbiAgICAgICAgaXRlbXM6IHN0b3JlLnJ1bm5pbmdLZXJuZWxzLmZpbHRlcihrZXJuZWwgPT5cbiAgICAgICAgICBrZXJuZWxTcGVjUHJvdmlkZXNHcmFtbWFyKGtlcm5lbC5rZXJuZWxTcGVjLCBzdG9yZS5ncmFtbWFyKVxuICAgICAgICApXG4gICAgICB9KTtcbiAgICAgIHN0b3JlLm1hcmtlcnMuY2xlYXIoKTtcbiAgICAgIHRoaXMuYXR0YWNoKCk7XG4gICAgfVxuICB9XG59XG4iXX0=