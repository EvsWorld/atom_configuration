Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

exports.reduceOutputs = reduceOutputs;
exports.isSingeLine = isSingeLine;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require("mobx");

var _nteractTransforms = require("@nteract/transforms");

var _escapeCarriage = require("escape-carriage");

var _componentsResultViewTransforms = require("./../components/result-view/transforms");

var outputTypes = ["execute_result", "display_data", "stream", "error"];

/**
 * https://github.com/nteract/hydrogen/issues/466#issuecomment-274822937
 * An output can be a stream of data that does not arrive at a single time. This
 * function handles the different types of outputs and accumulates the data
 * into a reduced output.
 *
 * @param {Array<Object>} outputs - Kernel output messages
 * @param {Object} output - Outputted to be reduced into list of outputs
 * @return {Array<Object>} updated-outputs - Outputs + Output
 */

function reduceOutputs(outputs, output) {
  var last = outputs.length - 1;
  if (outputs.length > 0 && output.output_type === "stream" && outputs[last].output_type === "stream") {
    var appendText = function appendText(previous, next) {
      previous.text = (0, _escapeCarriage.escapeCarriageReturnSafe)(previous.text + next.text);
    };

    if (outputs[last].name === output.name) {
      appendText(outputs[last], output);
      return outputs;
    }

    if (outputs.length > 1 && outputs[last - 1].name === output.name) {
      appendText(outputs[last - 1], output);
      return outputs;
    }
  }
  outputs.push(output);
  return outputs;
}

function isSingeLine(text, availableSpace) {
  // If it turns out escapeCarriageReturn is a bottleneck, we should remove it.
  return (text.indexOf("\n") === -1 || text.indexOf("\n") === text.length - 1) && availableSpace > (0, _escapeCarriage.escapeCarriageReturn)(text).length;
}

var OutputStore = (function () {
  var _instanceInitializers = {};

  function OutputStore() {
    _classCallCheck(this, OutputStore);

    this.outputs = (0, _mobx.observable)([]);

    _defineDecoratedPropertyDescriptor(this, "status", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "executionCount", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "index", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "position", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "setIndex", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "incrementIndex", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "decrementIndex", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "clear", _instanceInitializers);
  }

  _createDecoratedClass(OutputStore, [{
    key: "appendOutput",
    decorators: [_mobx.action],
    value: function appendOutput(message) {
      if (message.stream === "execution_count") {
        this.executionCount = message.data;
      } else if (message.stream === "status") {
        this.status = message.data;
      } else if (outputTypes.indexOf(message.output_type) > -1) {
        reduceOutputs(this.outputs, message);
        this.setIndex(this.outputs.length - 1);
      }
    }
  }, {
    key: "updatePosition",
    decorators: [_mobx.action],
    value: function updatePosition(position) {
      Object.assign(this.position, position);
    }
  }, {
    key: "status",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return "running";
    },
    enumerable: true
  }, {
    key: "executionCount",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return null;
    },
    enumerable: true
  }, {
    key: "index",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return -1;
    },
    enumerable: true
  }, {
    key: "position",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return {
        lineHeight: 0,
        lineLength: 0,
        editorWidth: 0,
        charWidth: 0
      };
    },
    enumerable: true
  }, {
    key: "isPlain",
    decorators: [_mobx.computed],
    get: function get() {
      if (this.outputs.length !== 1) return false;

      var availableSpace = Math.floor((this.position.editorWidth - this.position.lineLength) / this.position.charWidth);
      if (availableSpace <= 0) return false;

      var output = this.outputs[0];
      switch (output.output_type) {
        case "execute_result":
        case "display_data":
          {
            var bundle = output.data;
            var mimetype = (0, _nteractTransforms.richestMimetype)(bundle, _componentsResultViewTransforms.displayOrder, _componentsResultViewTransforms.transforms);
            return mimetype === "text/plain" ? isSingeLine(bundle[mimetype], availableSpace) : false;
          }
        case "stream":
          {
            return isSingeLine(output.text, availableSpace);
          }
        default:
          {
            return false;
          }
      }
    }
  }, {
    key: "setIndex",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this = this;

      return function (index) {
        if (index < 0) {
          _this.index = 0;
        } else if (index < _this.outputs.length) {
          _this.index = index;
        } else {
          _this.index = _this.outputs.length - 1;
        }
      };
    },
    enumerable: true
  }, {
    key: "incrementIndex",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this2 = this;

      return function () {
        _this2.index = _this2.index < _this2.outputs.length - 1 ? _this2.index + 1 : _this2.outputs.length - 1;
      };
    },
    enumerable: true
  }, {
    key: "decrementIndex",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function () {
        _this3.index = _this3.index > 0 ? _this3.index - 1 : 0;
      };
    },
    enumerable: true
  }, {
    key: "clear",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this4 = this;

      return function () {
        _this4.outputs.clear();
        _this4.index = -1;
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  return OutputStore;
})();

exports["default"] = OutputStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3N0b3JlL291dHB1dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O29CQUU2QyxNQUFNOztpQ0FDbkIscUJBQXFCOzs4QkFJOUMsaUJBQWlCOzs4Q0FLakIsd0NBQXdDOztBQUkvQyxJQUFNLFdBQVcsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFZbkUsU0FBUyxhQUFhLENBQzNCLE9BQWlDLEVBQ2pDLE1BQWMsRUFDWTtBQUMxQixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQyxNQUNFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUNsQixNQUFNLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQ3RDO1FBQ1MsVUFBVSxHQUFuQixTQUFTLFVBQVUsQ0FBQyxRQUFnQixFQUFFLElBQVksRUFBRTtBQUNsRCxjQUFRLENBQUMsSUFBSSxHQUFHLDhDQUF5QixRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNyRTs7QUFFRCxRQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRTtBQUN0QyxnQkFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsQyxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7QUFFRCxRQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDaEUsZ0JBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLGFBQU8sT0FBTyxDQUFDO0tBQ2hCO0dBQ0Y7QUFDRCxTQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JCLFNBQU8sT0FBTyxDQUFDO0NBQ2hCOztBQUVNLFNBQVMsV0FBVyxDQUFDLElBQVksRUFBRSxjQUFzQixFQUFFOztBQUVoRSxTQUNFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBLElBQ3BFLGNBQWMsR0FBRywwQ0FBcUIsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUNsRDtDQUNIOztJQUVvQixXQUFXOzs7V0FBWCxXQUFXOzBCQUFYLFdBQVc7O1NBQzlCLE9BQU8sR0FBNkIsc0JBQVcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dCQUQvQixXQUFXOzs7V0EyQ2xCLHNCQUFDLE9BQWUsRUFBRTtBQUM1QixVQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssaUJBQWlCLEVBQUU7QUFDeEMsWUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO09BQ3BDLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtBQUN0QyxZQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7T0FDNUIsTUFBTSxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ3hELHFCQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNyQyxZQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO09BQ3hDO0tBQ0Y7Ozs7V0FHYSx3QkFBQyxRQUlkLEVBQUU7QUFDRCxZQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDeEM7Ozs7O2FBM0Q0QixTQUFTOzs7Ozs7O2FBQ0EsSUFBSTs7Ozs7OzthQUNkLENBQUMsQ0FBQzs7Ozs7OzthQUVuQjtBQUNULGtCQUFVLEVBQUUsQ0FBQztBQUNiLGtCQUFVLEVBQUUsQ0FBQztBQUNiLG1CQUFXLEVBQUUsQ0FBQztBQUNkLGlCQUFTLEVBQUUsQ0FBQztPQUNiOzs7Ozs7U0FHVSxlQUFZO0FBQ3JCLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sS0FBSyxDQUFDOztBQUU1QyxVQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUMvQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFBLEdBQ25ELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUMxQixDQUFDO0FBQ0YsVUFBSSxjQUFjLElBQUksQ0FBQyxFQUFFLE9BQU8sS0FBSyxDQUFDOztBQUV0QyxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLGNBQVEsTUFBTSxDQUFDLFdBQVc7QUFDeEIsYUFBSyxnQkFBZ0IsQ0FBQztBQUN0QixhQUFLLGNBQWM7QUFBRTtBQUNuQixnQkFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUMzQixnQkFBTSxRQUFRLEdBQUcsd0NBQWdCLE1BQU0sMkZBQTJCLENBQUM7QUFDbkUsbUJBQU8sUUFBUSxLQUFLLFlBQVksR0FDNUIsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxjQUFjLENBQUMsR0FDN0MsS0FBSyxDQUFDO1dBQ1g7QUFBQSxBQUNELGFBQUssUUFBUTtBQUFFO0FBQ2IsbUJBQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7V0FDakQ7QUFBQSxBQUNEO0FBQVM7QUFDUCxtQkFBTyxLQUFLLENBQUM7V0FDZDtBQUFBLE9BQ0Y7S0FDRjs7Ozs7OzthQXdCVSxVQUFDLEtBQUssRUFBYTtBQUM1QixZQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7QUFDYixnQkFBSyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ2hCLE1BQU0sSUFBSSxLQUFLLEdBQUcsTUFBSyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ3RDLGdCQUFLLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDcEIsTUFBTTtBQUNMLGdCQUFLLEtBQUssR0FBRyxNQUFLLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ3RDO09BQ0Y7Ozs7Ozs7OzthQUdnQixZQUFNO0FBQ3JCLGVBQUssS0FBSyxHQUNSLE9BQUssS0FBSyxHQUFHLE9BQUssT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQ2hDLE9BQUssS0FBSyxHQUFHLENBQUMsR0FDZCxPQUFLLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO09BQy9COzs7Ozs7Ozs7YUFHZ0IsWUFBTTtBQUNyQixlQUFLLEtBQUssR0FBRyxPQUFLLEtBQUssR0FBRyxDQUFDLEdBQUcsT0FBSyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNsRDs7Ozs7Ozs7O2FBR08sWUFBTTtBQUNaLGVBQUssT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3JCLGVBQUssS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO09BQ2pCOzs7OztTQTNGa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvb3V0cHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgYWN0aW9uLCBjb21wdXRlZCwgb2JzZXJ2YWJsZSB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgeyByaWNoZXN0TWltZXR5cGUgfSBmcm9tIFwiQG50ZXJhY3QvdHJhbnNmb3Jtc1wiO1xuaW1wb3J0IHtcbiAgZXNjYXBlQ2FycmlhZ2VSZXR1cm4sXG4gIGVzY2FwZUNhcnJpYWdlUmV0dXJuU2FmZVxufSBmcm9tIFwiZXNjYXBlLWNhcnJpYWdlXCI7XG5cbmltcG9ydCB7XG4gIHRyYW5zZm9ybXMsXG4gIGRpc3BsYXlPcmRlclxufSBmcm9tIFwiLi8uLi9jb21wb25lbnRzL3Jlc3VsdC12aWV3L3RyYW5zZm9ybXNcIjtcblxuaW1wb3J0IHR5cGUgeyBJT2JzZXJ2YWJsZUFycmF5IH0gZnJvbSBcIm1vYnhcIjtcblxuY29uc3Qgb3V0cHV0VHlwZXMgPSBbXCJleGVjdXRlX3Jlc3VsdFwiLCBcImRpc3BsYXlfZGF0YVwiLCBcInN0cmVhbVwiLCBcImVycm9yXCJdO1xuXG4vKipcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9udGVyYWN0L2h5ZHJvZ2VuL2lzc3Vlcy80NjYjaXNzdWVjb21tZW50LTI3NDgyMjkzN1xuICogQW4gb3V0cHV0IGNhbiBiZSBhIHN0cmVhbSBvZiBkYXRhIHRoYXQgZG9lcyBub3QgYXJyaXZlIGF0IGEgc2luZ2xlIHRpbWUuIFRoaXNcbiAqIGZ1bmN0aW9uIGhhbmRsZXMgdGhlIGRpZmZlcmVudCB0eXBlcyBvZiBvdXRwdXRzIGFuZCBhY2N1bXVsYXRlcyB0aGUgZGF0YVxuICogaW50byBhIHJlZHVjZWQgb3V0cHV0LlxuICpcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gb3V0cHV0cyAtIEtlcm5lbCBvdXRwdXQgbWVzc2FnZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvdXRwdXQgLSBPdXRwdXR0ZWQgdG8gYmUgcmVkdWNlZCBpbnRvIGxpc3Qgb2Ygb3V0cHV0c1xuICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn0gdXBkYXRlZC1vdXRwdXRzIC0gT3V0cHV0cyArIE91dHB1dFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlT3V0cHV0cyhcbiAgb3V0cHV0czogSU9ic2VydmFibGVBcnJheTxPYmplY3Q+LFxuICBvdXRwdXQ6IE9iamVjdFxuKTogSU9ic2VydmFibGVBcnJheTxPYmplY3Q+IHtcbiAgY29uc3QgbGFzdCA9IG91dHB1dHMubGVuZ3RoIC0gMTtcbiAgaWYgKFxuICAgIG91dHB1dHMubGVuZ3RoID4gMCAmJlxuICAgIG91dHB1dC5vdXRwdXRfdHlwZSA9PT0gXCJzdHJlYW1cIiAmJlxuICAgIG91dHB1dHNbbGFzdF0ub3V0cHV0X3R5cGUgPT09IFwic3RyZWFtXCJcbiAgKSB7XG4gICAgZnVuY3Rpb24gYXBwZW5kVGV4dChwcmV2aW91czogT2JqZWN0LCBuZXh0OiBPYmplY3QpIHtcbiAgICAgIHByZXZpb3VzLnRleHQgPSBlc2NhcGVDYXJyaWFnZVJldHVyblNhZmUocHJldmlvdXMudGV4dCArIG5leHQudGV4dCk7XG4gICAgfVxuXG4gICAgaWYgKG91dHB1dHNbbGFzdF0ubmFtZSA9PT0gb3V0cHV0Lm5hbWUpIHtcbiAgICAgIGFwcGVuZFRleHQob3V0cHV0c1tsYXN0XSwgb3V0cHV0KTtcbiAgICAgIHJldHVybiBvdXRwdXRzO1xuICAgIH1cblxuICAgIGlmIChvdXRwdXRzLmxlbmd0aCA+IDEgJiYgb3V0cHV0c1tsYXN0IC0gMV0ubmFtZSA9PT0gb3V0cHV0Lm5hbWUpIHtcbiAgICAgIGFwcGVuZFRleHQob3V0cHV0c1tsYXN0IC0gMV0sIG91dHB1dCk7XG4gICAgICByZXR1cm4gb3V0cHV0cztcbiAgICB9XG4gIH1cbiAgb3V0cHV0cy5wdXNoKG91dHB1dCk7XG4gIHJldHVybiBvdXRwdXRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTaW5nZUxpbmUodGV4dDogc3RyaW5nLCBhdmFpbGFibGVTcGFjZTogbnVtYmVyKSB7XG4gIC8vIElmIGl0IHR1cm5zIG91dCBlc2NhcGVDYXJyaWFnZVJldHVybiBpcyBhIGJvdHRsZW5lY2ssIHdlIHNob3VsZCByZW1vdmUgaXQuXG4gIHJldHVybiAoXG4gICAgKHRleHQuaW5kZXhPZihcIlxcblwiKSA9PT0gLTEgfHwgdGV4dC5pbmRleE9mKFwiXFxuXCIpID09PSB0ZXh0Lmxlbmd0aCAtIDEpICYmXG4gICAgYXZhaWxhYmxlU3BhY2UgPiBlc2NhcGVDYXJyaWFnZVJldHVybih0ZXh0KS5sZW5ndGhcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3V0cHV0U3RvcmUge1xuICBvdXRwdXRzOiBJT2JzZXJ2YWJsZUFycmF5PE9iamVjdD4gPSBvYnNlcnZhYmxlKFtdKTtcbiAgQG9ic2VydmFibGUgc3RhdHVzOiBzdHJpbmcgPSBcInJ1bm5pbmdcIjtcbiAgQG9ic2VydmFibGUgZXhlY3V0aW9uQ291bnQ6ID9udW1iZXIgPSBudWxsO1xuICBAb2JzZXJ2YWJsZSBpbmRleDogbnVtYmVyID0gLTE7XG4gIEBvYnNlcnZhYmxlXG4gIHBvc2l0aW9uID0ge1xuICAgIGxpbmVIZWlnaHQ6IDAsXG4gICAgbGluZUxlbmd0aDogMCxcbiAgICBlZGl0b3JXaWR0aDogMCxcbiAgICBjaGFyV2lkdGg6IDBcbiAgfTtcblxuICBAY29tcHV0ZWRcbiAgZ2V0IGlzUGxhaW4oKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMub3V0cHV0cy5sZW5ndGggIT09IDEpIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IGF2YWlsYWJsZVNwYWNlID0gTWF0aC5mbG9vcihcbiAgICAgICh0aGlzLnBvc2l0aW9uLmVkaXRvcldpZHRoIC0gdGhpcy5wb3NpdGlvbi5saW5lTGVuZ3RoKSAvXG4gICAgICAgIHRoaXMucG9zaXRpb24uY2hhcldpZHRoXG4gICAgKTtcbiAgICBpZiAoYXZhaWxhYmxlU3BhY2UgPD0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gdGhpcy5vdXRwdXRzWzBdO1xuICAgIHN3aXRjaCAob3V0cHV0Lm91dHB1dF90eXBlKSB7XG4gICAgICBjYXNlIFwiZXhlY3V0ZV9yZXN1bHRcIjpcbiAgICAgIGNhc2UgXCJkaXNwbGF5X2RhdGFcIjoge1xuICAgICAgICBjb25zdCBidW5kbGUgPSBvdXRwdXQuZGF0YTtcbiAgICAgICAgY29uc3QgbWltZXR5cGUgPSByaWNoZXN0TWltZXR5cGUoYnVuZGxlLCBkaXNwbGF5T3JkZXIsIHRyYW5zZm9ybXMpO1xuICAgICAgICByZXR1cm4gbWltZXR5cGUgPT09IFwidGV4dC9wbGFpblwiXG4gICAgICAgICAgPyBpc1NpbmdlTGluZShidW5kbGVbbWltZXR5cGVdLCBhdmFpbGFibGVTcGFjZSlcbiAgICAgICAgICA6IGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSBcInN0cmVhbVwiOiB7XG4gICAgICAgIHJldHVybiBpc1NpbmdlTGluZShvdXRwdXQudGV4dCwgYXZhaWxhYmxlU3BhY2UpO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQGFjdGlvblxuICBhcHBlbmRPdXRwdXQobWVzc2FnZTogT2JqZWN0KSB7XG4gICAgaWYgKG1lc3NhZ2Uuc3RyZWFtID09PSBcImV4ZWN1dGlvbl9jb3VudFwiKSB7XG4gICAgICB0aGlzLmV4ZWN1dGlvbkNvdW50ID0gbWVzc2FnZS5kYXRhO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5zdHJlYW0gPT09IFwic3RhdHVzXCIpIHtcbiAgICAgIHRoaXMuc3RhdHVzID0gbWVzc2FnZS5kYXRhO1xuICAgIH0gZWxzZSBpZiAob3V0cHV0VHlwZXMuaW5kZXhPZihtZXNzYWdlLm91dHB1dF90eXBlKSA+IC0xKSB7XG4gICAgICByZWR1Y2VPdXRwdXRzKHRoaXMub3V0cHV0cywgbWVzc2FnZSk7XG4gICAgICB0aGlzLnNldEluZGV4KHRoaXMub3V0cHV0cy5sZW5ndGggLSAxKTtcbiAgICB9XG4gIH1cblxuICBAYWN0aW9uXG4gIHVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uOiB7XG4gICAgbGluZUhlaWdodD86IG51bWJlcixcbiAgICBsaW5lTGVuZ3RoPzogbnVtYmVyLFxuICAgIGVkaXRvcldpZHRoPzogbnVtYmVyXG4gIH0pIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMucG9zaXRpb24sIHBvc2l0aW9uKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgc2V0SW5kZXggPSAoaW5kZXg6IG51bWJlcikgPT4ge1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgIHRoaXMuaW5kZXggPSAwO1xuICAgIH0gZWxzZSBpZiAoaW5kZXggPCB0aGlzLm91dHB1dHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5kZXggPSB0aGlzLm91dHB1dHMubGVuZ3RoIC0gMTtcbiAgICB9XG4gIH07XG5cbiAgQGFjdGlvblxuICBpbmNyZW1lbnRJbmRleCA9ICgpID0+IHtcbiAgICB0aGlzLmluZGV4ID1cbiAgICAgIHRoaXMuaW5kZXggPCB0aGlzLm91dHB1dHMubGVuZ3RoIC0gMVxuICAgICAgICA/IHRoaXMuaW5kZXggKyAxXG4gICAgICAgIDogdGhpcy5vdXRwdXRzLmxlbmd0aCAtIDE7XG4gIH07XG5cbiAgQGFjdGlvblxuICBkZWNyZW1lbnRJbmRleCA9ICgpID0+IHtcbiAgICB0aGlzLmluZGV4ID0gdGhpcy5pbmRleCA+IDAgPyB0aGlzLmluZGV4IC0gMSA6IDA7XG4gIH07XG5cbiAgQGFjdGlvblxuICBjbGVhciA9ICgpID0+IHtcbiAgICB0aGlzLm91dHB1dHMuY2xlYXIoKTtcbiAgICB0aGlzLmluZGV4ID0gLTE7XG4gIH07XG59XG4iXX0=