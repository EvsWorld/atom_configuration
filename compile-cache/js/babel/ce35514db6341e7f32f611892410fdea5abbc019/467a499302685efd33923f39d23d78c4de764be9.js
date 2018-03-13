Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var HeaderView = (function (_View) {
  _inherits(HeaderView, _View);

  function HeaderView() {
    _classCallCheck(this, HeaderView);

    _get(Object.getPrototypeOf(HeaderView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(HeaderView, [{
    key: 'setStatus',
    value: function setStatus(status) {
      this.status.removeClass('icon-alert icon-check icon-hourglass icon-stop');
      switch (status) {
        case 'start':
          return this.status.addClass('icon-hourglass');
        case 'stop':
          return this.status.addClass('icon-check');
        case 'kill':
          return this.status.addClass('icon-stop');
        case 'err':
          return this.status.addClass('icon-alert');
        default:
          return null;
      }
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this = this;

      return this.div({ 'class': 'header-view' }, function () {
        _this.span({ 'class': 'heading-title', outlet: 'title' });
        return _this.span({ 'class': 'heading-status', outlet: 'status' });
      });
    }
  }]);

  return HeaderView;
})(_atomSpacePenViews.View);

exports['default'] = HeaderView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9oZWFkZXItdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7aUNBRXFCLHNCQUFzQjs7QUFGM0MsV0FBVyxDQUFDOztJQUlTLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7MEJBQVYsVUFBVTs7K0JBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FTcEIsbUJBQUMsTUFBTSxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7QUFDMUUsY0FBUSxNQUFNO0FBQ1osYUFBSyxPQUFPO0FBQUUsaUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUFBLEFBQzVELGFBQUssTUFBTTtBQUFFLGlCQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQUEsQUFDdkQsYUFBSyxNQUFNO0FBQUUsaUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7QUFBQSxBQUN0RCxhQUFLLEtBQUs7QUFBRSxpQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUFBLEFBQ3REO0FBQVMsaUJBQU8sSUFBSSxDQUFDO0FBQUEsT0FDdEI7S0FDRjs7O1dBaEJhLG1CQUFHOzs7QUFDZixhQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFPLGFBQWEsRUFBRSxFQUFFLFlBQU07QUFDOUMsY0FBSyxJQUFJLENBQUMsRUFBRSxTQUFPLGVBQWUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUN2RCxlQUFPLE1BQUssSUFBSSxDQUFDLEVBQUUsU0FBTyxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztPQUNqRSxDQUFDLENBQUM7S0FDSjs7O1NBUGtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9oZWFkZXItdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXJWaWV3IGV4dGVuZHMgVmlldyB7XG5cbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2KHsgY2xhc3M6ICdoZWFkZXItdmlldycgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5zcGFuKHsgY2xhc3M6ICdoZWFkaW5nLXRpdGxlJywgb3V0bGV0OiAndGl0bGUnIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhbih7IGNsYXNzOiAnaGVhZGluZy1zdGF0dXMnLCBvdXRsZXQ6ICdzdGF0dXMnIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0U3RhdHVzKHN0YXR1cykge1xuICAgIHRoaXMuc3RhdHVzLnJlbW92ZUNsYXNzKCdpY29uLWFsZXJ0IGljb24tY2hlY2sgaWNvbi1ob3VyZ2xhc3MgaWNvbi1zdG9wJyk7XG4gICAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICAgIGNhc2UgJ3N0YXJ0JzogcmV0dXJuIHRoaXMuc3RhdHVzLmFkZENsYXNzKCdpY29uLWhvdXJnbGFzcycpO1xuICAgICAgY2FzZSAnc3RvcCc6IHJldHVybiB0aGlzLnN0YXR1cy5hZGRDbGFzcygnaWNvbi1jaGVjaycpO1xuICAgICAgY2FzZSAna2lsbCc6IHJldHVybiB0aGlzLnN0YXR1cy5hZGRDbGFzcygnaWNvbi1zdG9wJyk7XG4gICAgICBjYXNlICdlcnInOiByZXR1cm4gdGhpcy5zdGF0dXMuYWRkQ2xhc3MoJ2ljb24tYWxlcnQnKTtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxufVxuIl19