Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TreeNode = require('./TreeNode');

var _TreeNode2 = _interopRequireDefault(_TreeNode);

'use babel';

function Tree(props) {
  return _react2['default'].createElement(
    'ul',
    { className: 'list-tree has-collapsable-children' },
    props.data.nodes.map(function (node, i) {
      return _react2['default'].createElement(_TreeNode2['default'], _extends({}, node, {
        key: i,
        onClick: props.onNodeClick
      }));
    })
  );
}

Tree.propTypes = {
  data: _react.PropTypes.shape({
    nodes: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      text: _react.PropTypes.string.isRequired
    })).isRequired
  }),
  onNodeClick: _react.PropTypes.func
};

exports['default'] = Tree;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvY29tcG9uZW50cy9UcmVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3FCQUUrQixPQUFPOzs7O3dCQUNqQixZQUFZOzs7O0FBSGpDLFdBQVcsQ0FBQzs7QUFLWixTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDbkIsU0FDRTs7TUFBSSxTQUFTLEVBQUMsb0NBQW9DO0lBRTlDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUksRUFBRSxDQUFDO2FBQzNCLHFFQUNNLElBQUk7QUFDUixXQUFHLEVBQUUsQ0FBQyxBQUFDO0FBQ1AsZUFBTyxFQUFFLEtBQUssQ0FBQyxXQUFXLEFBQUM7U0FDM0I7S0FBQSxDQUNIO0dBRUEsQ0FDTDtDQUNIOztBQUVELElBQUksQ0FBQyxTQUFTLEdBQUc7QUFDZixNQUFJLEVBQUUsaUJBQVUsS0FBSyxDQUFDO0FBQ3BCLFNBQUssRUFBRSxpQkFBVSxPQUFPLENBQUMsaUJBQVUsS0FBSyxDQUFDO0FBQ3ZDLFVBQUksRUFBRSxpQkFBVSxNQUFNLENBQUMsVUFBVTtLQUNsQyxDQUFDLENBQUMsQ0FBQyxVQUFVO0dBQ2YsQ0FBQztBQUNGLGFBQVcsRUFBRSxpQkFBVSxJQUFJO0NBQzVCLENBQUM7O3FCQUVhLElBQUkiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90b2RvL2xpYi9jb21wb25lbnRzL1RyZWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgVHJlZU5vZGUgZnJvbSAnLi9UcmVlTm9kZSc7XG5cbmZ1bmN0aW9uIFRyZWUocHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8dWwgY2xhc3NOYW1lPSdsaXN0LXRyZWUgaGFzLWNvbGxhcHNhYmxlLWNoaWxkcmVuJz5cbiAgICAgIHtcbiAgICAgICAgcHJvcHMuZGF0YS5ub2Rlcy5tYXAoKG5vZGUsIGkpID0+XG4gICAgICAgICAgPFRyZWVOb2RlXG4gICAgICAgICAgICB7Li4ubm9kZX1cbiAgICAgICAgICAgIGtleT17aX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3Byb3BzLm9uTm9kZUNsaWNrfVxuICAgICAgICAgIC8+XG4gICAgICAgIClcbiAgICAgIH1cbiAgICA8L3VsPlxuICApO1xufVxuXG5UcmVlLnByb3BUeXBlcyA9IHtcbiAgZGF0YTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICBub2RlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHRleHQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KSkuaXNSZXF1aXJlZCxcbiAgfSksXG4gIG9uTm9kZUNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRyZWU7XG4iXX0=