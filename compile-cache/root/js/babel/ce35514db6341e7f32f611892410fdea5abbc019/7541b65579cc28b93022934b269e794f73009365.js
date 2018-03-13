Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _sbEventKit = require('sb-event-kit');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var _messageLegacy = require('./message-legacy');

var _messageLegacy2 = _interopRequireDefault(_messageLegacy);

var _helpers = require('../helpers');

var TooltipElement = (function () {
  function TooltipElement(messages, position, textEditor) {
    var _this = this;

    _classCallCheck(this, TooltipElement);

    this.emitter = new _sbEventKit.Emitter();
    this.element = document.createElement('div');
    this.messages = messages;
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.marker = textEditor.markBufferRange([position, position]);
    this.marker.onDidDestroy(function () {
      return _this.emitter.emit('did-destroy');
    });

    var delegate = new _delegate2['default']();
    this.element.id = 'linter-tooltip';
    textEditor.decorateMarker(this.marker, {
      type: 'overlay',
      item: this.element
    });
    this.subscriptions.add(delegate);

    var children = [];
    messages.forEach(function (message) {
      if (message.version === 2) {
        children.push(_react2['default'].createElement(_message2['default'], { key: message.key, delegate: delegate, message: message }));
        return;
      }
      children.push(_react2['default'].createElement(_messageLegacy2['default'], { key: message.key, delegate: delegate, message: message }));
      if (message.trace && message.trace.length) {
        children.push.apply(children, _toConsumableArray(message.trace.map(function (trace) {
          return _react2['default'].createElement(_messageLegacy2['default'], { key: message.key + ':trace:' + trace.key, delegate: delegate, message: trace });
        })));
      }
    });
    _reactDom2['default'].render(_react2['default'].createElement(
      'linter-messages',
      null,
      children
    ), this.element);
  }

  _createClass(TooltipElement, [{
    key: 'isValid',
    value: function isValid(position, messages) {
      var range = (0, _helpers.$range)(this.messages[0]);
      return !!(this.messages.length === 1 && messages.has(this.messages[0]) && range && range.containsPoint(position));
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
    }
  }]);

  return TooltipElement;
})();

exports['default'] = TooltipElement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3Rvb2x0aXAvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7O3dCQUNKLFdBQVc7Ozs7MEJBQ2EsY0FBYzs7d0JBSXRDLFlBQVk7Ozs7dUJBQ04sV0FBVzs7Ozs2QkFDTCxrQkFBa0I7Ozs7dUJBQzVCLFlBQVk7O0lBR2QsY0FBYztBQU90QixXQVBRLGNBQWMsQ0FPckIsUUFBOEIsRUFBRSxRQUFlLEVBQUUsVUFBc0IsRUFBRTs7OzBCQVBsRSxjQUFjOztBQVEvQixRQUFJLENBQUMsT0FBTyxHQUFHLHlCQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVDLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcscUNBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtBQUM5RCxRQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQzthQUFNLE1BQUssT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7S0FBQSxDQUFDLENBQUE7O0FBRWhFLFFBQU0sUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDL0IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsZ0JBQWdCLENBQUE7QUFDbEMsY0FBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3JDLFVBQUksRUFBRSxTQUFTO0FBQ2YsVUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO0tBQ25CLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUVoQyxRQUFNLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbkIsWUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUM1QixVQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLGdCQUFRLENBQUMsSUFBSSxDQUFDLHlEQUFnQixHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQUFBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEFBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxBQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3pGLGVBQU07T0FDUDtBQUNELGNBQVEsQ0FBQyxJQUFJLENBQUMsK0RBQXNCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxBQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsQUFBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEFBQUMsR0FBRyxDQUFDLENBQUE7QUFDL0YsVUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ3pDLGdCQUFRLENBQUMsSUFBSSxNQUFBLENBQWIsUUFBUSxxQkFBUyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7aUJBQ3RDLCtEQUFzQixHQUFHLEVBQUssT0FBTyxDQUFDLEdBQUcsZUFBVSxLQUFLLENBQUMsR0FBRyxBQUFHLEVBQUMsUUFBUSxFQUFFLFFBQVEsQUFBQyxFQUFDLE9BQU8sRUFBRSxLQUFLLEFBQUMsR0FBRztTQUFBLENBQ3ZHLEVBQUMsQ0FBQTtPQUNIO0tBQ0YsQ0FBQyxDQUFBO0FBQ0YsMEJBQVMsTUFBTSxDQUFDOzs7TUFBa0IsUUFBUTtLQUFtQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUM3RTs7ZUF2Q2tCLGNBQWM7O1dBd0MxQixpQkFBQyxRQUFlLEVBQUUsUUFBNEIsRUFBVztBQUM5RCxVQUFNLEtBQUssR0FBRyxxQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdEMsYUFBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBLEFBQUMsQ0FBQTtLQUNsSDs7O1dBQ1csc0JBQUMsUUFBcUIsRUFBYztBQUM5QyxVQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDekM7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDaEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBbERrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90b29sdGlwL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdzYi1ldmVudC1raXQnXG5pbXBvcnQgdHlwZSB7IFBvaW50LCBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSB9IGZyb20gJ3NiLWV2ZW50LWtpdCdcblxuaW1wb3J0IERlbGVnYXRlIGZyb20gJy4vZGVsZWdhdGUnXG5pbXBvcnQgTWVzc2FnZUVsZW1lbnQgZnJvbSAnLi9tZXNzYWdlJ1xuaW1wb3J0IE1lc3NhZ2VFbGVtZW50TGVnYWN5IGZyb20gJy4vbWVzc2FnZS1sZWdhY3knXG5pbXBvcnQgeyAkcmFuZ2UgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb2x0aXBFbGVtZW50IHtcbiAgbWFya2VyOiBPYmplY3Q7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IobWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+LCBwb3NpdGlvbjogUG9pbnQsIHRleHRFZGl0b3I6IFRleHRFZGl0b3IpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXNcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLm1hcmtlciA9IHRleHRFZGl0b3IubWFya0J1ZmZlclJhbmdlKFtwb3NpdGlvbiwgcG9zaXRpb25dKVxuICAgIHRoaXMubWFya2VyLm9uRGlkRGVzdHJveSgoKSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKSlcblxuICAgIGNvbnN0IGRlbGVnYXRlID0gbmV3IERlbGVnYXRlKClcbiAgICB0aGlzLmVsZW1lbnQuaWQgPSAnbGludGVyLXRvb2x0aXAnXG4gICAgdGV4dEVkaXRvci5kZWNvcmF0ZU1hcmtlcih0aGlzLm1hcmtlciwge1xuICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgaXRlbTogdGhpcy5lbGVtZW50LFxuICAgIH0pXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChkZWxlZ2F0ZSlcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gW11cbiAgICBtZXNzYWdlcy5mb3JFYWNoKChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS52ZXJzaW9uID09PSAyKSB7XG4gICAgICAgIGNoaWxkcmVuLnB1c2goPE1lc3NhZ2VFbGVtZW50IGtleT17bWVzc2FnZS5rZXl9IGRlbGVnYXRlPXtkZWxlZ2F0ZX0gbWVzc2FnZT17bWVzc2FnZX0gLz4pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY2hpbGRyZW4ucHVzaCg8TWVzc2FnZUVsZW1lbnRMZWdhY3kga2V5PXttZXNzYWdlLmtleX0gZGVsZWdhdGU9e2RlbGVnYXRlfSBtZXNzYWdlPXttZXNzYWdlfSAvPilcbiAgICAgIGlmIChtZXNzYWdlLnRyYWNlICYmIG1lc3NhZ2UudHJhY2UubGVuZ3RoKSB7XG4gICAgICAgIGNoaWxkcmVuLnB1c2goLi4ubWVzc2FnZS50cmFjZS5tYXAodHJhY2UgPT5cbiAgICAgICAgICA8TWVzc2FnZUVsZW1lbnRMZWdhY3kga2V5PXtgJHttZXNzYWdlLmtleX06dHJhY2U6JHt0cmFjZS5rZXl9YH0gZGVsZWdhdGU9e2RlbGVnYXRlfSBtZXNzYWdlPXt0cmFjZX0gLz4sXG4gICAgICAgICkpXG4gICAgICB9XG4gICAgfSlcbiAgICBSZWFjdERPTS5yZW5kZXIoPGxpbnRlci1tZXNzYWdlcz57Y2hpbGRyZW59PC9saW50ZXItbWVzc2FnZXM+LCB0aGlzLmVsZW1lbnQpXG4gIH1cbiAgaXNWYWxpZChwb3NpdGlvbjogUG9pbnQsIG1lc3NhZ2VzOiBTZXQ8TGludGVyTWVzc2FnZT4pOiBib29sZWFuIHtcbiAgICBjb25zdCByYW5nZSA9ICRyYW5nZSh0aGlzLm1lc3NhZ2VzWzBdKVxuICAgIHJldHVybiAhISh0aGlzLm1lc3NhZ2VzLmxlbmd0aCA9PT0gMSAmJiBtZXNzYWdlcy5oYXModGhpcy5tZXNzYWdlc1swXSkgJiYgcmFuZ2UgJiYgcmFuZ2UuY29udGFpbnNQb2ludChwb3NpdGlvbikpXG4gIH1cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrOiAoKCkgPT4gYW55KSk6IERpc3Bvc2FibGUge1xuICAgIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=