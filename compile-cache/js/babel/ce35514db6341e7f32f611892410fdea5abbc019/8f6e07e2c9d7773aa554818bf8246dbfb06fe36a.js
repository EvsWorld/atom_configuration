Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _atom = require("atom");

var _mobx = require("mobx");

var _output = require("./output");

var _output2 = _interopRequireDefault(_output);

var _utils = require("./../utils");

var WatchStore = (function () {
  var _instanceInitializers = {};

  function WatchStore(kernel) {
    var _this = this;

    _classCallCheck(this, WatchStore);

    this.outputStore = new _output2["default"]();

    _defineDecoratedPropertyDescriptor(this, "run", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "setCode", _instanceInitializers);

    this.getCode = function () {
      return _this.editor.getText();
    };

    this.focus = function () {
      _this.editor.element.focus();
    };

    this.kernel = kernel;
    this.editor = new _atom.TextEditor({
      softWrapped: true,
      grammar: this.kernel.grammar,
      lineNumberGutterVisible: false
    });
    this.editor.moveToTop();
    this.editor.element.classList.add("watch-input");
  }

  _createDecoratedClass(WatchStore, [{
    key: "run",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this2 = this;

      return function () {
        var code = _this2.getCode();
        (0, _utils.log)("watchview running:", code);
        if (code && code.length > 0) {
          _this2.kernel.executeWatch(code, function (result) {
            _this2.outputStore.appendOutput(result);
          });
        }
      };
    },
    enumerable: true
  }, {
    key: "setCode",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function (code) {
        _this3.editor.setText(code);
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  return WatchStore;
})();

exports["default"] = WatchStore;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3N0b3JlL3dhdGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFMkIsTUFBTTs7b0JBQ1YsTUFBTTs7c0JBRUwsVUFBVTs7OztxQkFDZCxZQUFZOztJQUlYLFVBQVU7OztBQUtsQixXQUxRLFVBQVUsQ0FLakIsTUFBYyxFQUFFOzs7MEJBTFQsVUFBVTs7U0FHN0IsV0FBVyxHQUFHLHlCQUFpQjs7Ozs7O1NBNkIvQixPQUFPLEdBQUcsWUFBTTtBQUNkLGFBQU8sTUFBSyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDOUI7O1NBRUQsS0FBSyxHQUFHLFlBQU07QUFDWixZQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDN0I7O0FBaENDLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxNQUFNLEdBQUcscUJBQWU7QUFDM0IsaUJBQVcsRUFBRSxJQUFJO0FBQ2pCLGFBQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87QUFDNUIsNkJBQXVCLEVBQUUsS0FBSztLQUMvQixDQUFDLENBQUM7QUFDSCxRQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7R0FDbEQ7O3dCQWRrQixVQUFVOzs7Ozs7YUFpQnZCLFlBQU07QUFDVixZQUFNLElBQUksR0FBRyxPQUFLLE9BQU8sRUFBRSxDQUFDO0FBQzVCLHdCQUFJLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2hDLFlBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLGlCQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQ3ZDLG1CQUFLLFdBQVcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7V0FDdkMsQ0FBQyxDQUFDO1NBQ0o7T0FDRjs7Ozs7Ozs7O2FBR1MsVUFBQyxJQUFJLEVBQWE7QUFDMUIsZUFBSyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQzNCOzs7OztTQTlCa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvd2F0Y2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBUZXh0RWRpdG9yIH0gZnJvbSBcImF0b21cIjtcbmltcG9ydCB7IGFjdGlvbiB9IGZyb20gXCJtb2J4XCI7XG5cbmltcG9ydCBPdXRwdXRTdG9yZSBmcm9tIFwiLi9vdXRwdXRcIjtcbmltcG9ydCB7IGxvZyB9IGZyb20gXCIuLy4uL3V0aWxzXCI7XG5cbmltcG9ydCB0eXBlIEtlcm5lbCBmcm9tIFwiLi8uLi9rZXJuZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F0Y2hTdG9yZSB7XG4gIGtlcm5lbDogS2VybmVsO1xuICBlZGl0b3I6IFRleHRFZGl0b3I7XG4gIG91dHB1dFN0b3JlID0gbmV3IE91dHB1dFN0b3JlKCk7XG5cbiAgY29uc3RydWN0b3Ioa2VybmVsOiBLZXJuZWwpIHtcbiAgICB0aGlzLmtlcm5lbCA9IGtlcm5lbDtcbiAgICB0aGlzLmVkaXRvciA9IG5ldyBUZXh0RWRpdG9yKHtcbiAgICAgIHNvZnRXcmFwcGVkOiB0cnVlLFxuICAgICAgZ3JhbW1hcjogdGhpcy5rZXJuZWwuZ3JhbW1hcixcbiAgICAgIGxpbmVOdW1iZXJHdXR0ZXJWaXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHRoaXMuZWRpdG9yLm1vdmVUb1RvcCgpO1xuICAgIHRoaXMuZWRpdG9yLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIndhdGNoLWlucHV0XCIpO1xuICB9XG5cbiAgQGFjdGlvblxuICBydW4gPSAoKSA9PiB7XG4gICAgY29uc3QgY29kZSA9IHRoaXMuZ2V0Q29kZSgpO1xuICAgIGxvZyhcIndhdGNodmlldyBydW5uaW5nOlwiLCBjb2RlKTtcbiAgICBpZiAoY29kZSAmJiBjb2RlLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMua2VybmVsLmV4ZWN1dGVXYXRjaChjb2RlLCByZXN1bHQgPT4ge1xuICAgICAgICB0aGlzLm91dHB1dFN0b3JlLmFwcGVuZE91dHB1dChyZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIEBhY3Rpb25cbiAgc2V0Q29kZSA9IChjb2RlOiBzdHJpbmcpID0+IHtcbiAgICB0aGlzLmVkaXRvci5zZXRUZXh0KGNvZGUpO1xuICB9O1xuXG4gIGdldENvZGUgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLmdldFRleHQoKTtcbiAgfTtcblxuICBmb2N1cyA9ICgpID0+IHtcbiAgICB0aGlzLmVkaXRvci5lbGVtZW50LmZvY3VzKCk7XG4gIH07XG59XG4iXX0=