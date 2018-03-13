Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _store = require("./../store");

var _store2 = _interopRequireDefault(_store);

var _codeManager = require("./../code-manager");

/**
 * @version 1.0.0
 *
 *
 * The Plugin API allows you to make Hydrogen awesome.
 * You will be able to interact with this class in your Hydrogen Plugin using
 * Atom's [Service API](http://blog.atom.io/2015/03/25/new-services-API.html).
 *
 * Take a look at our [Example Plugin](https://github.com/lgeiger/hydrogen-example-plugin)
 * and the [Atom Flight Manual](http://flight-manual.atom.io/hacking-atom/) for
 * learning how to interact with Hydrogen in your own plugin.
 *
 * @class HydrogenProvider
 */

var HydrogenProvider = (function () {
  function HydrogenProvider(_hydrogen) {
    _classCallCheck(this, HydrogenProvider);

    this._hydrogen = _hydrogen;
    this._happy = true;
  }

  /*
   * Calls your callback when the kernel has changed.
   * @param {Function} Callback
   */

  _createClass(HydrogenProvider, [{
    key: "onDidChangeKernel",
    value: function onDidChangeKernel(callback) {
      this._hydrogen.emitter.on("did-change-kernel", function (kernel) {
        if (kernel) {
          return callback(kernel.getPluginWrapper());
        }
        return callback(null);
      });
    }

    /*
     * Get the `HydrogenKernel` of the currently active text editor.
     * @return {Class} `HydrogenKernel`
     */
  }, {
    key: "getActiveKernel",
    value: function getActiveKernel() {
      if (!_store2["default"].kernel) {
        var grammar = _store2["default"].editor ? _store2["default"].editor.getGrammar().name : "";
        throw new Error("No running kernel for grammar `" + grammar + "` found");
      }

      return _store2["default"].kernel.getPluginWrapper();
    }

    /*
     * Get the `atom$Range` that will run if `hydrogen:run-cell` is called.
     * `null` is returned if no active text editor.
     * @return {Class} `atom$Range`
     */
  }, {
    key: "getCellRange",
    value: function getCellRange(editor) {
      if (!_store2["default"].editor) return null;
      return (0, _codeManager.getCurrentCell)(_store2["default"].editor);
    }

    /*
    *--------
    */
  }]);

  return HydrogenProvider;
})();

exports["default"] = HydrogenProvider;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BsdWdpbi1hcGkvaHlkcm9nZW4tcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztxQkFFa0IsWUFBWTs7OzsyQkFHQyxtQkFBbUI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZTdCLGdCQUFnQjtBQUl4QixXQUpRLGdCQUFnQixDQUl2QixTQUFjLEVBQUU7MEJBSlQsZ0JBQWdCOztBQUtqQyxRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztHQUNwQjs7Ozs7OztlQVBrQixnQkFBZ0I7O1dBYWxCLDJCQUFDLFFBQWtCLEVBQUU7QUFDcEMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLFVBQUMsTUFBTSxFQUFjO0FBQ2xFLFlBQUksTUFBTSxFQUFFO0FBQ1YsaUJBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7U0FDNUM7QUFDRCxlQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUN2QixDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7V0FNYywyQkFBRztBQUNoQixVQUFJLENBQUMsbUJBQU0sTUFBTSxFQUFFO0FBQ2pCLFlBQU0sT0FBTyxHQUFHLG1CQUFNLE1BQU0sR0FBRyxtQkFBTSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNuRSxjQUFNLElBQUksS0FBSyxxQ0FBb0MsT0FBTyxhQUFXLENBQUM7T0FDdkU7O0FBRUQsYUFBTyxtQkFBTSxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztLQUN4Qzs7Ozs7Ozs7O1dBT1csc0JBQUMsTUFBd0IsRUFBRTtBQUNyQyxVQUFJLENBQUMsbUJBQU0sTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQy9CLGFBQU8saUNBQWUsbUJBQU0sTUFBTSxDQUFDLENBQUM7S0FDckM7Ozs7Ozs7U0EzQ2tCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0IiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvcGx1Z2luLWFwaS9oeWRyb2dlbi1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBzdG9yZSBmcm9tIFwiLi8uLi9zdG9yZVwiO1xuaW1wb3J0IHR5cGUgS2VybmVsIGZyb20gXCIuLy4uL2tlcm5lbFwiO1xuaW1wb3J0IHR5cGUgWk1RS2VybmVsIGZyb20gXCIuLy4uL3ptcS1rZXJuZWwuanNcIjtcbmltcG9ydCB7IGdldEN1cnJlbnRDZWxsIH0gZnJvbSBcIi4vLi4vY29kZS1tYW5hZ2VyXCI7XG4vKipcbiAqIEB2ZXJzaW9uIDEuMC4wXG4gKlxuICpcbiAqIFRoZSBQbHVnaW4gQVBJIGFsbG93cyB5b3UgdG8gbWFrZSBIeWRyb2dlbiBhd2Vzb21lLlxuICogWW91IHdpbGwgYmUgYWJsZSB0byBpbnRlcmFjdCB3aXRoIHRoaXMgY2xhc3MgaW4geW91ciBIeWRyb2dlbiBQbHVnaW4gdXNpbmdcbiAqIEF0b20ncyBbU2VydmljZSBBUEldKGh0dHA6Ly9ibG9nLmF0b20uaW8vMjAxNS8wMy8yNS9uZXctc2VydmljZXMtQVBJLmh0bWwpLlxuICpcbiAqIFRha2UgYSBsb29rIGF0IG91ciBbRXhhbXBsZSBQbHVnaW5dKGh0dHBzOi8vZ2l0aHViLmNvbS9sZ2VpZ2VyL2h5ZHJvZ2VuLWV4YW1wbGUtcGx1Z2luKVxuICogYW5kIHRoZSBbQXRvbSBGbGlnaHQgTWFudWFsXShodHRwOi8vZmxpZ2h0LW1hbnVhbC5hdG9tLmlvL2hhY2tpbmctYXRvbS8pIGZvclxuICogbGVhcm5pbmcgaG93IHRvIGludGVyYWN0IHdpdGggSHlkcm9nZW4gaW4geW91ciBvd24gcGx1Z2luLlxuICpcbiAqIEBjbGFzcyBIeWRyb2dlblByb3ZpZGVyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh5ZHJvZ2VuUHJvdmlkZXIge1xuICBfaHlkcm9nZW46IGFueTtcbiAgX2hhcHB5OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKF9oeWRyb2dlbjogYW55KSB7XG4gICAgdGhpcy5faHlkcm9nZW4gPSBfaHlkcm9nZW47XG4gICAgdGhpcy5faGFwcHkgPSB0cnVlO1xuICB9XG5cbiAgLypcbiAgICogQ2FsbHMgeW91ciBjYWxsYmFjayB3aGVuIHRoZSBrZXJuZWwgaGFzIGNoYW5nZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IENhbGxiYWNrXG4gICAqL1xuICBvbkRpZENoYW5nZUtlcm5lbChjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICB0aGlzLl9oeWRyb2dlbi5lbWl0dGVyLm9uKFwiZGlkLWNoYW5nZS1rZXJuZWxcIiwgKGtlcm5lbDogP0tlcm5lbCkgPT4ge1xuICAgICAgaWYgKGtlcm5lbCkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soa2VybmVsLmdldFBsdWdpbldyYXBwZXIoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCk7XG4gICAgfSk7XG4gIH1cblxuICAvKlxuICAgKiBHZXQgdGhlIGBIeWRyb2dlbktlcm5lbGAgb2YgdGhlIGN1cnJlbnRseSBhY3RpdmUgdGV4dCBlZGl0b3IuXG4gICAqIEByZXR1cm4ge0NsYXNzfSBgSHlkcm9nZW5LZXJuZWxgXG4gICAqL1xuICBnZXRBY3RpdmVLZXJuZWwoKSB7XG4gICAgaWYgKCFzdG9yZS5rZXJuZWwpIHtcbiAgICAgIGNvbnN0IGdyYW1tYXIgPSBzdG9yZS5lZGl0b3IgPyBzdG9yZS5lZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWUgOiBcIlwiO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBydW5uaW5nIGtlcm5lbCBmb3IgZ3JhbW1hciBcXGAke2dyYW1tYXJ9XFxgIGZvdW5kYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0b3JlLmtlcm5lbC5nZXRQbHVnaW5XcmFwcGVyKCk7XG4gIH1cblxuICAvKlxuICAgKiBHZXQgdGhlIGBhdG9tJFJhbmdlYCB0aGF0IHdpbGwgcnVuIGlmIGBoeWRyb2dlbjpydW4tY2VsbGAgaXMgY2FsbGVkLlxuICAgKiBgbnVsbGAgaXMgcmV0dXJuZWQgaWYgbm8gYWN0aXZlIHRleHQgZWRpdG9yLlxuICAgKiBAcmV0dXJuIHtDbGFzc30gYGF0b20kUmFuZ2VgXG4gICAqL1xuICBnZXRDZWxsUmFuZ2UoZWRpdG9yOiA/YXRvbSRUZXh0RWRpdG9yKSB7XG4gICAgaWYgKCFzdG9yZS5lZGl0b3IpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBnZXRDdXJyZW50Q2VsbChzdG9yZS5lZGl0b3IpO1xuICB9XG5cbiAgLypcbiAgKi0tLS0tLS0tXG4gICovXG59XG4iXX0=