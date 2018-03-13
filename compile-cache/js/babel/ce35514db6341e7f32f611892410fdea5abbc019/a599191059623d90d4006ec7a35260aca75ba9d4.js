Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require("mobx");

var _atomSelectList = require("atom-select-list");

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _watch = require("./watch");

var _watch2 = _interopRequireDefault(_watch);

var WatchesStore = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(WatchesStore, [{
    key: "watches",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }], null, _instanceInitializers);

  function WatchesStore(kernel) {
    _classCallCheck(this, WatchesStore);

    _defineDecoratedPropertyDescriptor(this, "watches", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "createWatch", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "addWatch", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "addWatchFromEditor", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "removeWatch", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "run", _instanceInitializers);

    this.kernel = kernel;

    this.kernel.addWatchCallback(this.run);
    this.addWatch();
  }

  _createDecoratedClass(WatchesStore, [{
    key: "createWatch",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this = this;

      return function () {
        var lastWatch = _this.watches[_this.watches.length - 1];
        if (!lastWatch || lastWatch.getCode().replace(/\s/g, "") !== "") {
          var watch = new _watch2["default"](_this.kernel);
          _this.watches.push(watch);
          return watch;
        }
        return lastWatch;
      };
    },
    enumerable: true
  }, {
    key: "addWatch",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this2 = this;

      return function () {
        _this2.createWatch().focus();
      };
    },
    enumerable: true
  }, {
    key: "addWatchFromEditor",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function (editor) {
        if (!editor) return;
        var watchText = editor.getSelectedText();
        if (!watchText) {
          _this3.addWatch();
        } else {
          var watch = _this3.createWatch();
          watch.setCode(watchText);
          watch.run();
        }
      };
    },
    enumerable: true
  }, {
    key: "removeWatch",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this4 = this;

      return function () {
        var watches = _this4.watches.map(function (v, k) {
          return {
            name: v.getCode(),
            value: k
          };
        }).filter(function (obj) {
          return obj.value !== 0 || obj.name !== "";
        });

        var watchesPicker = new _atomSelectList2["default"]({
          items: watches,
          elementForItem: function elementForItem(watch) {
            var element = document.createElement("li");
            element.textContent = watch.name || "<empty>";
            return element;
          },
          didConfirmSelection: function didConfirmSelection(watch) {
            _this4.watches.splice(watch.value, 1);
            modalPanel.destroy();
            watchesPicker.destroy();
            if (_this4.watches.length === 0) _this4.addWatch();else if (previouslyFocusedElement) previouslyFocusedElement.focus();
          },
          filterKeyForItem: function filterKeyForItem(watch) {
            return watch.name;
          },
          didCancelSelection: function didCancelSelection() {
            modalPanel.destroy();
            if (previouslyFocusedElement) previouslyFocusedElement.focus();
            watchesPicker.destroy();
          },
          emptyMessage: "There are no watches to remove!"
        });
        var previouslyFocusedElement = document.activeElement;
        var modalPanel = atom.workspace.addModalPanel({
          item: watchesPicker
        });
        watchesPicker.focus();
      };
    },
    enumerable: true
  }, {
    key: "run",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this5 = this;

      return function () {
        _this5.watches.forEach(function (watch) {
          return watch.run();
        });
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  return WatchesStore;
})();

exports["default"] = WatchesStore;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3N0b3JlL3dhdGNoZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUVtQyxNQUFNOzs4QkFDZCxrQkFBa0I7Ozs7cUJBRXRCLFNBQVM7Ozs7SUFLWCxZQUFZOzs7O3dCQUFaLFlBQVk7Ozs7YUFFVSxFQUFFOzs7OztBQUVoQyxXQUpRLFlBQVksQ0FJbkIsTUFBYyxFQUFFOzBCQUpULFlBQVk7Ozs7Ozs7Ozs7Ozs7O0FBSzdCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixRQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QyxRQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7R0FDakI7O3dCQVRrQixZQUFZOzs7Ozs7YUFZakIsWUFBTTtBQUNsQixZQUFNLFNBQVMsR0FBRyxNQUFLLE9BQU8sQ0FBQyxNQUFLLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7QUFDL0QsY0FBTSxLQUFLLEdBQUcsdUJBQWUsTUFBSyxNQUFNLENBQUMsQ0FBQztBQUMxQyxnQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pCLGlCQUFPLEtBQUssQ0FBQztTQUNkO0FBQ0QsZUFBTyxTQUFTLENBQUM7T0FDbEI7Ozs7Ozs7OzthQUdVLFlBQU07QUFDZixlQUFLLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQzVCOzs7Ozs7Ozs7YUFHb0IsVUFBQyxNQUFNLEVBQXNCO0FBQ2hELFlBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTztBQUNwQixZQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDM0MsWUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNkLGlCQUFLLFFBQVEsRUFBRSxDQUFDO1NBQ2pCLE1BQU07QUFDTCxjQUFNLEtBQUssR0FBRyxPQUFLLFdBQVcsRUFBRSxDQUFDO0FBQ2pDLGVBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDekIsZUFBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2I7T0FDRjs7Ozs7Ozs7O2FBR2EsWUFBTTtBQUNsQixZQUFNLE9BQU8sR0FBRyxPQUFLLE9BQU8sQ0FDekIsR0FBRyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQU07QUFDZCxnQkFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUU7QUFDakIsaUJBQUssRUFBRSxDQUFDO1dBQ1Q7U0FBQyxDQUFDLENBQ0YsTUFBTSxDQUFDLFVBQUEsR0FBRztpQkFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLEVBQUU7U0FBQSxDQUFDLENBQUM7O0FBRXJELFlBQU0sYUFBYSxHQUFHLGdDQUFtQjtBQUN2QyxlQUFLLEVBQUUsT0FBTztBQUNkLHdCQUFjLEVBQUUsd0JBQUEsS0FBSyxFQUFJO0FBQ3ZCLGdCQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdDLG1CQUFPLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDO0FBQzlDLG1CQUFPLE9BQU8sQ0FBQztXQUNoQjtBQUNELDZCQUFtQixFQUFFLDZCQUFBLEtBQUssRUFBSTtBQUM1QixtQkFBSyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDcEMsc0JBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQix5QkFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3hCLGdCQUFJLE9BQUssT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsT0FBSyxRQUFRLEVBQUUsQ0FBQyxLQUMxQyxJQUFJLHdCQUF3QixFQUFFLHdCQUF3QixDQUFDLEtBQUssRUFBRSxDQUFDO1dBQ3JFO0FBQ0QsMEJBQWdCLEVBQUUsMEJBQUEsS0FBSzttQkFBSSxLQUFLLENBQUMsSUFBSTtXQUFBO0FBQ3JDLDRCQUFrQixFQUFFLDhCQUFNO0FBQ3hCLHNCQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckIsZ0JBQUksd0JBQXdCLEVBQUUsd0JBQXdCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0QseUJBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztXQUN6QjtBQUNELHNCQUFZLEVBQUUsaUNBQWlDO1NBQ2hELENBQUMsQ0FBQztBQUNILFlBQU0sd0JBQXdCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztBQUN4RCxZQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUM5QyxjQUFJLEVBQUUsYUFBYTtTQUNwQixDQUFDLENBQUM7QUFDSCxxQkFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQ3ZCOzs7Ozs7Ozs7YUFHSyxZQUFNO0FBQ1YsZUFBSyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSztpQkFBSSxLQUFLLENBQUMsR0FBRyxFQUFFO1NBQUEsQ0FBQyxDQUFDO09BQzVDOzs7OztTQWpGa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvd2F0Y2hlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IGFjdGlvbiwgb2JzZXJ2YWJsZSB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgU2VsZWN0TGlzdFZpZXcgZnJvbSBcImF0b20tc2VsZWN0LWxpc3RcIjtcblxuaW1wb3J0IFdhdGNoU3RvcmUgZnJvbSBcIi4vd2F0Y2hcIjtcblxuaW1wb3J0IHR5cGUgS2VybmVsIGZyb20gXCIuLy4uL2tlcm5lbFwiO1xuaW1wb3J0IHR5cGVvZiBzdG9yZSBmcm9tIFwiLi9pbmRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXRjaGVzU3RvcmUge1xuICBrZXJuZWw6IEtlcm5lbDtcbiAgQG9ic2VydmFibGUgd2F0Y2hlczogQXJyYXk8V2F0Y2hTdG9yZT4gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihrZXJuZWw6IEtlcm5lbCkge1xuICAgIHRoaXMua2VybmVsID0ga2VybmVsO1xuXG4gICAgdGhpcy5rZXJuZWwuYWRkV2F0Y2hDYWxsYmFjayh0aGlzLnJ1bik7XG4gICAgdGhpcy5hZGRXYXRjaCgpO1xuICB9XG5cbiAgQGFjdGlvblxuICBjcmVhdGVXYXRjaCA9ICgpID0+IHtcbiAgICBjb25zdCBsYXN0V2F0Y2ggPSB0aGlzLndhdGNoZXNbdGhpcy53YXRjaGVzLmxlbmd0aCAtIDFdO1xuICAgIGlmICghbGFzdFdhdGNoIHx8IGxhc3RXYXRjaC5nZXRDb2RlKCkucmVwbGFjZSgvXFxzL2csIFwiXCIpICE9PSBcIlwiKSB7XG4gICAgICBjb25zdCB3YXRjaCA9IG5ldyBXYXRjaFN0b3JlKHRoaXMua2VybmVsKTtcbiAgICAgIHRoaXMud2F0Y2hlcy5wdXNoKHdhdGNoKTtcbiAgICAgIHJldHVybiB3YXRjaDtcbiAgICB9XG4gICAgcmV0dXJuIGxhc3RXYXRjaDtcbiAgfTtcblxuICBAYWN0aW9uXG4gIGFkZFdhdGNoID0gKCkgPT4ge1xuICAgIHRoaXMuY3JlYXRlV2F0Y2goKS5mb2N1cygpO1xuICB9O1xuXG4gIEBhY3Rpb25cbiAgYWRkV2F0Y2hGcm9tRWRpdG9yID0gKGVkaXRvcjogYXRvbSRUZXh0RWRpdG9yKSA9PiB7XG4gICAgaWYgKCFlZGl0b3IpIHJldHVybjtcbiAgICBjb25zdCB3YXRjaFRleHQgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCk7XG4gICAgaWYgKCF3YXRjaFRleHQpIHtcbiAgICAgIHRoaXMuYWRkV2F0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgd2F0Y2ggPSB0aGlzLmNyZWF0ZVdhdGNoKCk7XG4gICAgICB3YXRjaC5zZXRDb2RlKHdhdGNoVGV4dCk7XG4gICAgICB3YXRjaC5ydW4oKTtcbiAgICB9XG4gIH07XG5cbiAgQGFjdGlvblxuICByZW1vdmVXYXRjaCA9ICgpID0+IHtcbiAgICBjb25zdCB3YXRjaGVzID0gdGhpcy53YXRjaGVzXG4gICAgICAubWFwKCh2LCBrKSA9PiAoe1xuICAgICAgICBuYW1lOiB2LmdldENvZGUoKSxcbiAgICAgICAgdmFsdWU6IGtcbiAgICAgIH0pKVxuICAgICAgLmZpbHRlcihvYmogPT4gb2JqLnZhbHVlICE9PSAwIHx8IG9iai5uYW1lICE9PSBcIlwiKTtcblxuICAgIGNvbnN0IHdhdGNoZXNQaWNrZXIgPSBuZXcgU2VsZWN0TGlzdFZpZXcoe1xuICAgICAgaXRlbXM6IHdhdGNoZXMsXG4gICAgICBlbGVtZW50Rm9ySXRlbTogd2F0Y2ggPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gd2F0Y2gubmFtZSB8fCBcIjxlbXB0eT5cIjtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9LFxuICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogd2F0Y2ggPT4ge1xuICAgICAgICB0aGlzLndhdGNoZXMuc3BsaWNlKHdhdGNoLnZhbHVlLCAxKTtcbiAgICAgICAgbW9kYWxQYW5lbC5kZXN0cm95KCk7XG4gICAgICAgIHdhdGNoZXNQaWNrZXIuZGVzdHJveSgpO1xuICAgICAgICBpZiAodGhpcy53YXRjaGVzLmxlbmd0aCA9PT0gMCkgdGhpcy5hZGRXYXRjaCgpO1xuICAgICAgICBlbHNlIGlmIChwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQpIHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpO1xuICAgICAgfSxcbiAgICAgIGZpbHRlcktleUZvckl0ZW06IHdhdGNoID0+IHdhdGNoLm5hbWUsXG4gICAgICBkaWRDYW5jZWxTZWxlY3Rpb246ICgpID0+IHtcbiAgICAgICAgbW9kYWxQYW5lbC5kZXN0cm95KCk7XG4gICAgICAgIGlmIChwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQpIHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB3YXRjaGVzUGlja2VyLmRlc3Ryb3koKTtcbiAgICAgIH0sXG4gICAgICBlbXB0eU1lc3NhZ2U6IFwiVGhlcmUgYXJlIG5vIHdhdGNoZXMgdG8gcmVtb3ZlIVwiXG4gICAgfSk7XG4gICAgY29uc3QgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBjb25zdCBtb2RhbFBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7XG4gICAgICBpdGVtOiB3YXRjaGVzUGlja2VyXG4gICAgfSk7XG4gICAgd2F0Y2hlc1BpY2tlci5mb2N1cygpO1xuICB9O1xuXG4gIEBhY3Rpb25cbiAgcnVuID0gKCkgPT4ge1xuICAgIHRoaXMud2F0Y2hlcy5mb3JFYWNoKHdhdGNoID0+IHdhdGNoLnJ1bigpKTtcbiAgfTtcbn1cbiJdfQ==