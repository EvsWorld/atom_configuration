var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var TypeView = (function (_TernView) {
  _inherits(TypeView, _TernView);

  function TypeView() {
    _classCallCheck(this, TypeView);

    _get(Object.getPrototypeOf(TypeView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TypeView, [{
    key: 'initialize',
    value: function initialize(model) {

      _get(Object.getPrototypeOf(TypeView.prototype), 'initialize', this).call(this, model);

      this.addEventListener('click', model.destroyOverlay);
    }
  }, {
    key: 'setData',
    value: function setData(type, documentation) {

      this.innerHTML = documentation ? type + '<br /><br />' + documentation : '' + type;
    }
  }]);

  return TypeView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-type', {

  prototype: TypeView.prototype
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXR5cGUtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzhCQUVxQixvQkFBb0I7Ozs7QUFGekMsV0FBVyxDQUFDOztJQUlOLFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7MEJBQVIsUUFBUTs7K0JBQVIsUUFBUTs7O2VBQVIsUUFBUTs7V0FFRixvQkFBQyxLQUFLLEVBQUU7O0FBRWhCLGlDQUpFLFFBQVEsNENBSU8sS0FBSyxFQUFFOztBQUV4QixVQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUN0RDs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTs7QUFFM0IsVUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLEdBQU0sSUFBSSxvQkFBZSxhQUFhLFFBQVEsSUFBSSxBQUFFLENBQUM7S0FDcEY7OztTQVpHLFFBQVE7OztBQWVkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRTs7QUFFNUQsV0FBUyxFQUFFLFFBQVEsQ0FBQyxTQUFTO0NBQzlCLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy10eXBlLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFRlcm5WaWV3IGZyb20gJy4vYXRvbS10ZXJuanMtdmlldyc7XG5cbmNsYXNzIFR5cGVWaWV3IGV4dGVuZHMgVGVyblZpZXcge1xuXG4gIGluaXRpYWxpemUobW9kZWwpIHtcblxuICAgIHN1cGVyLmluaXRpYWxpemUobW9kZWwpO1xuXG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG1vZGVsLmRlc3Ryb3lPdmVybGF5KTtcbiAgfVxuXG4gIHNldERhdGEodHlwZSwgZG9jdW1lbnRhdGlvbikge1xuXG4gICAgdGhpcy5pbm5lckhUTUwgPSBkb2N1bWVudGF0aW9uID8gYCR7dHlwZX08YnIgLz48YnIgLz4ke2RvY3VtZW50YXRpb259YCA6IGAke3R5cGV9YDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnYXRvbS10ZXJuanMtdHlwZScsIHtcblxuICBwcm90b3R5cGU6IFR5cGVWaWV3LnByb3RvdHlwZVxufSk7XG4iXX0=