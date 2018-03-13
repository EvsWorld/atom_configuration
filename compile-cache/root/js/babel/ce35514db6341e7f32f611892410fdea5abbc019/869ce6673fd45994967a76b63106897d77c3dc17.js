Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _escapeHtml = require('escape-html');

var _escapeHtml2 = _interopRequireDefault(_escapeHtml);

var MESSAGE_IDLE = 'Idle';

var SignalElement = (function (_HTMLElement) {
  _inherits(SignalElement, _HTMLElement);

  function SignalElement() {
    _classCallCheck(this, SignalElement);

    _get(Object.getPrototypeOf(SignalElement.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SignalElement, [{
    key: 'createdCallback',

    // $FlowIgnore: Flow has invalid typing of createdCallback
    value: function createdCallback() {
      this.update([], []);
      this.classList.add('inline-block');
      this.classList.add('loading-spinner-tiny');
    }
  }, {
    key: 'update',
    value: function update(titles, history) {
      this.setBusy(!!titles.length);
      var tooltipMessage = [];
      if (history.length) {
        tooltipMessage.push('<strong>History:</strong>', history.map(function (item) {
          return (0, _escapeHtml2['default'])(item.title) + ' ( duration: ' + item.duration + ' )';
        }).join('<br>'));
      }
      if (titles.length) {
        tooltipMessage.push('<strong>Current:</strong>', titles.map(_escapeHtml2['default']).join('<br>'));
      }
      if (tooltipMessage.length) {
        this.setTooltip(tooltipMessage.join('<br>'));
      } else {
        this.setTooltip(MESSAGE_IDLE);
      }
    }
  }, {
    key: 'setBusy',
    value: function setBusy(busy) {
      var _this = this;

      if (busy) {
        this.classList.add('busy');
        this.classList.remove('idle');
        this.activatedLast = Date.now();
        clearTimeout(this.deactivateTimer);
      } else {
        // The logic below makes sure that busy signal is shown for at least 1 second
        var timeNow = Date.now();
        var timeThen = this.activatedLast || 0;
        var timeDifference = timeNow - timeThen;
        if (timeDifference < 1000) {
          this.deactivateTimer = setTimeout(function () {
            return _this.setBusy(false);
          }, timeDifference + 100);
        } else {
          this.classList.add('idle');
          this.classList.remove('busy');
        }
      }
    }
  }, {
    key: 'setTooltip',
    value: function setTooltip(title) {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      this.tooltip = atom.tooltips.add(this, {
        title: '<div style="text-align: left;">' + title + '</div>'
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.tooltip.dispose();
    }
  }]);

  return SignalElement;
})(HTMLElement);

exports.SignalElement = SignalElement;

var element = document.registerElement('busy-signal', {
  prototype: SignalElement.prototype
});

exports['default'] = element;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvbGliL2VsZW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7MEJBRW1CLGFBQWE7Ozs7QUFHaEMsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFBOztJQUVkLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7OztXQU1ULDJCQUFHO0FBQ2hCLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ25CLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ2xDLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUE7S0FDM0M7OztXQUNLLGdCQUFDLE1BQXFCLEVBQUUsT0FBbUQsRUFBRTtBQUNqRixVQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDN0IsVUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLFVBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNsQixzQkFBYyxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVMsSUFBSSxFQUFFO0FBQzFFLGlCQUFVLDZCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQWdCLElBQUksQ0FBQyxRQUFRLFFBQUk7U0FDOUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO09BQ2pCO0FBQ0QsVUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ2pCLHNCQUFjLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLE1BQU0sQ0FBQyxHQUFHLHlCQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7T0FDbEY7QUFDRCxVQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUU7QUFDekIsWUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7T0FDN0MsTUFBTTtBQUNMLFlBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUE7T0FDOUI7S0FDRjs7O1dBQ00saUJBQUMsSUFBYSxFQUFFOzs7QUFDckIsVUFBSSxJQUFJLEVBQUU7QUFDUixZQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMxQixZQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM3QixZQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUMvQixvQkFBWSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtPQUNuQyxNQUFNOztBQUVMLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUMxQixZQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQTtBQUN4QyxZQUFNLGNBQWMsR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFBO0FBQ3pDLFlBQUksY0FBYyxHQUFHLElBQUksRUFBRTtBQUN6QixjQUFJLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQzttQkFBTSxNQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUM7V0FBQSxFQUFFLGNBQWMsR0FBRyxHQUFHLENBQUMsQ0FBQTtTQUNuRixNQUFNO0FBQ0wsY0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDMUIsY0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7U0FDOUI7T0FDRjtLQUNGOzs7V0FDUyxvQkFBQyxLQUFhLEVBQUU7QUFDeEIsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDdkI7QUFDRCxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtBQUNyQyxhQUFLLHNDQUFvQyxLQUFLLFdBQVE7T0FDdkQsQ0FBQyxDQUFBO0tBQ0g7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUN2Qjs7O1NBekRVLGFBQWE7R0FBUyxXQUFXOzs7O0FBNEQ5QyxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRTtBQUN0RCxXQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVM7Q0FDbkMsQ0FBQyxDQUFBOztxQkFFYSxPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvbGliL2VsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgZXNjYXBlIGZyb20gJ2VzY2FwZS1odG1sJ1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuY29uc3QgTUVTU0FHRV9JRExFID0gJ0lkbGUnXG5cbmV4cG9ydCBjbGFzcyBTaWduYWxFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICB0b29sdGlwOiBEaXNwb3NhYmxlO1xuICBhY3RpdmF0ZWRMYXN0OiA/bnVtYmVyO1xuICBkZWFjdGl2YXRlVGltZXI6ID9udW1iZXI7XG5cbiAgLy8gJEZsb3dJZ25vcmU6IEZsb3cgaGFzIGludmFsaWQgdHlwaW5nIG9mIGNyZWF0ZWRDYWxsYmFja1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy51cGRhdGUoW10sIFtdKVxuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJylcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2xvYWRpbmctc3Bpbm5lci10aW55JylcbiAgfVxuICB1cGRhdGUodGl0bGVzOiBBcnJheTxzdHJpbmc+LCBoaXN0b3J5OiBBcnJheTx7IHRpdGxlOiBzdHJpbmcsIGR1cmF0aW9uOiBzdHJpbmcgfT4pIHtcbiAgICB0aGlzLnNldEJ1c3koISF0aXRsZXMubGVuZ3RoKVxuICAgIGNvbnN0IHRvb2x0aXBNZXNzYWdlID0gW11cbiAgICBpZiAoaGlzdG9yeS5sZW5ndGgpIHtcbiAgICAgIHRvb2x0aXBNZXNzYWdlLnB1c2goJzxzdHJvbmc+SGlzdG9yeTo8L3N0cm9uZz4nLCBoaXN0b3J5Lm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBgJHtlc2NhcGUoaXRlbS50aXRsZSl9ICggZHVyYXRpb246ICR7aXRlbS5kdXJhdGlvbn0gKWBcbiAgICAgIH0pLmpvaW4oJzxicj4nKSlcbiAgICB9XG4gICAgaWYgKHRpdGxlcy5sZW5ndGgpIHtcbiAgICAgIHRvb2x0aXBNZXNzYWdlLnB1c2goJzxzdHJvbmc+Q3VycmVudDo8L3N0cm9uZz4nLCB0aXRsZXMubWFwKGVzY2FwZSkuam9pbignPGJyPicpKVxuICAgIH1cbiAgICBpZiAodG9vbHRpcE1lc3NhZ2UubGVuZ3RoKSB7XG4gICAgICB0aGlzLnNldFRvb2x0aXAodG9vbHRpcE1lc3NhZ2Uuam9pbignPGJyPicpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFRvb2x0aXAoTUVTU0FHRV9JRExFKVxuICAgIH1cbiAgfVxuICBzZXRCdXN5KGJ1c3k6IGJvb2xlYW4pIHtcbiAgICBpZiAoYnVzeSkge1xuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdidXN5JylcbiAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnaWRsZScpXG4gICAgICB0aGlzLmFjdGl2YXRlZExhc3QgPSBEYXRlLm5vdygpXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5kZWFjdGl2YXRlVGltZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZSBsb2dpYyBiZWxvdyBtYWtlcyBzdXJlIHRoYXQgYnVzeSBzaWduYWwgaXMgc2hvd24gZm9yIGF0IGxlYXN0IDEgc2Vjb25kXG4gICAgICBjb25zdCB0aW1lTm93ID0gRGF0ZS5ub3coKVxuICAgICAgY29uc3QgdGltZVRoZW4gPSB0aGlzLmFjdGl2YXRlZExhc3QgfHwgMFxuICAgICAgY29uc3QgdGltZURpZmZlcmVuY2UgPSB0aW1lTm93IC0gdGltZVRoZW5cbiAgICAgIGlmICh0aW1lRGlmZmVyZW5jZSA8IDEwMDApIHtcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0QnVzeShmYWxzZSksIHRpbWVEaWZmZXJlbmNlICsgMTAwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdpZGxlJylcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdidXN5JylcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgc2V0VG9vbHRpcCh0aXRsZTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnRvb2x0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLCB7XG4gICAgICB0aXRsZTogYDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBsZWZ0O1wiPiR7dGl0bGV9PC9kaXY+YCxcbiAgICB9KVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy50b29sdGlwLmRpc3Bvc2UoKVxuICB9XG59XG5cbmNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2J1c3ktc2lnbmFsJywge1xuICBwcm90b3R5cGU6IFNpZ25hbEVsZW1lbnQucHJvdG90eXBlLFxufSlcblxuZXhwb3J0IGRlZmF1bHQgZWxlbWVudFxuIl19