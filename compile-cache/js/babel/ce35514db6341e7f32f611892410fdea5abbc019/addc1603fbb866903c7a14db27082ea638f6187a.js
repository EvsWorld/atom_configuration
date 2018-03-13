Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * The `HydrogenKernel` class wraps Hydrogen's internal representation of kernels
 * and exposes a small set of methods that should be usable by plugins.
 * @class HydrogenKernel
 */

var HydrogenKernel = (function () {
  function HydrogenKernel(_kernel) {
    _classCallCheck(this, HydrogenKernel);

    this._kernel = _kernel;
    this.destroyed = false;
  }

  _createClass(HydrogenKernel, [{
    key: "_assertNotDestroyed",
    value: function _assertNotDestroyed() {
      // Internal: plugins might hold references to long-destroyed kernels, so
      // all API calls should guard against this case
      if (this.destroyed) {
        throw new Error("HydrogenKernel: operation not allowed because the kernel has been destroyed");
      }
    }

    /*
     * Calls your callback when the kernel has been destroyed.
     * @param {Function} Callback
     */
  }, {
    key: "onDidDestroy",
    value: function onDidDestroy(callback) {
      this._assertNotDestroyed();
      this._kernel.emitter.on("did-destroy", callback);
    }

    /*
     * Get the [connection file](http://jupyter-notebook.readthedocs.io/en/latest/examples/Notebook/Connecting%20with%20the%20Qt%20Console.html) of the kernel.
     * @return {String} Path to connection file.
     */
  }, {
    key: "getConnectionFile",
    value: function getConnectionFile() {
      this._assertNotDestroyed();

      var connectionFile = this._kernel.connectionFile ? this._kernel.connectionFile : null;
      if (!connectionFile) {
        throw new Error("No connection file for " + this._kernel.kernelSpec.display_name + " kernel found");
      }

      return connectionFile;
    }
  }]);

  return HydrogenKernel;
})();

exports["default"] = HydrogenKernel;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BsdWdpbi1hcGkvaHlkcm9nZW4ta2VybmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBVXFCLGNBQWM7QUFJdEIsV0FKUSxjQUFjLENBSXJCLE9BQWUsRUFBRTswQkFKVixjQUFjOztBQUsvQixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztHQUN4Qjs7ZUFQa0IsY0FBYzs7V0FTZCwrQkFBRzs7O0FBR3BCLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixjQUFNLElBQUksS0FBSyxDQUNiLDZFQUE2RSxDQUM5RSxDQUFDO09BQ0g7S0FDRjs7Ozs7Ozs7V0FNVyxzQkFBQyxRQUFrQixFQUFRO0FBQ3JDLFVBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQzNCLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDbEQ7Ozs7Ozs7O1dBTWdCLDZCQUFHO0FBQ2xCLFVBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOztBQUUzQixVQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsR0FDOUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEdBQzNCLElBQUksQ0FBQztBQUNULFVBQUksQ0FBQyxjQUFjLEVBQUU7QUFDbkIsY0FBTSxJQUFJLEtBQUssNkJBRVgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsWUFBWSxtQkFFdkMsQ0FBQztPQUNIOztBQUVELGFBQU8sY0FBYyxDQUFDO0tBQ3ZCOzs7U0EvQ2tCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3BsdWdpbi1hcGkvaHlkcm9nZW4ta2VybmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHR5cGUgS2VybmVsIGZyb20gXCIuLy4uL2tlcm5lbFwiO1xuaW1wb3J0IHR5cGUgWk1RS2VybmVsIGZyb20gXCIuLy4uL3ptcS1rZXJuZWxcIjtcbi8qXG4gKiBUaGUgYEh5ZHJvZ2VuS2VybmVsYCBjbGFzcyB3cmFwcyBIeWRyb2dlbidzIGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIGtlcm5lbHNcbiAqIGFuZCBleHBvc2VzIGEgc21hbGwgc2V0IG9mIG1ldGhvZHMgdGhhdCBzaG91bGQgYmUgdXNhYmxlIGJ5IHBsdWdpbnMuXG4gKiBAY2xhc3MgSHlkcm9nZW5LZXJuZWxcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIeWRyb2dlbktlcm5lbCB7XG4gIF9rZXJuZWw6IEtlcm5lbCB8IFpNUUtlcm5lbDtcbiAgZGVzdHJveWVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKF9rZXJuZWw6IEtlcm5lbCkge1xuICAgIHRoaXMuX2tlcm5lbCA9IF9rZXJuZWw7XG4gICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIF9hc3NlcnROb3REZXN0cm95ZWQoKSB7XG4gICAgLy8gSW50ZXJuYWw6IHBsdWdpbnMgbWlnaHQgaG9sZCByZWZlcmVuY2VzIHRvIGxvbmctZGVzdHJveWVkIGtlcm5lbHMsIHNvXG4gICAgLy8gYWxsIEFQSSBjYWxscyBzaG91bGQgZ3VhcmQgYWdhaW5zdCB0aGlzIGNhc2VcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJIeWRyb2dlbktlcm5lbDogb3BlcmF0aW9uIG5vdCBhbGxvd2VkIGJlY2F1c2UgdGhlIGtlcm5lbCBoYXMgYmVlbiBkZXN0cm95ZWRcIlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBDYWxscyB5b3VyIGNhbGxiYWNrIHdoZW4gdGhlIGtlcm5lbCBoYXMgYmVlbiBkZXN0cm95ZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IENhbGxiYWNrXG4gICAqL1xuICBvbkRpZERlc3Ryb3koY2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5fYXNzZXJ0Tm90RGVzdHJveWVkKCk7XG4gICAgdGhpcy5fa2VybmVsLmVtaXR0ZXIub24oXCJkaWQtZGVzdHJveVwiLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKlxuICAgKiBHZXQgdGhlIFtjb25uZWN0aW9uIGZpbGVdKGh0dHA6Ly9qdXB5dGVyLW5vdGVib29rLnJlYWR0aGVkb2NzLmlvL2VuL2xhdGVzdC9leGFtcGxlcy9Ob3RlYm9vay9Db25uZWN0aW5nJTIwd2l0aCUyMHRoZSUyMFF0JTIwQ29uc29sZS5odG1sKSBvZiB0aGUga2VybmVsLlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFBhdGggdG8gY29ubmVjdGlvbiBmaWxlLlxuICAgKi9cbiAgZ2V0Q29ubmVjdGlvbkZpbGUoKSB7XG4gICAgdGhpcy5fYXNzZXJ0Tm90RGVzdHJveWVkKCk7XG5cbiAgICBjb25zdCBjb25uZWN0aW9uRmlsZSA9IHRoaXMuX2tlcm5lbC5jb25uZWN0aW9uRmlsZVxuICAgICAgPyB0aGlzLl9rZXJuZWwuY29ubmVjdGlvbkZpbGVcbiAgICAgIDogbnVsbDtcbiAgICBpZiAoIWNvbm5lY3Rpb25GaWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBObyBjb25uZWN0aW9uIGZpbGUgZm9yICR7XG4gICAgICAgICAgdGhpcy5fa2VybmVsLmtlcm5lbFNwZWMuZGlzcGxheV9uYW1lXG4gICAgICAgIH0ga2VybmVsIGZvdW5kYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29ubmVjdGlvbkZpbGU7XG4gIH1cbn1cbiJdfQ==