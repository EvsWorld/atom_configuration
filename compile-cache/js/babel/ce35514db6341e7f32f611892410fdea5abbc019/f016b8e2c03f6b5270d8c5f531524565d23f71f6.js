Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Controls = require('./Controls');

var _Controls2 = _interopRequireDefault(_Controls);

'use babel';

function Header(props) {
  return _react2['default'].createElement(
    'div',
    { className: 'header' },
    _react2['default'].createElement(
      'h1',
      null,
      'todo ',
      !!props.count && _react2['default'].createElement(
        'span',
        { className: 'badge badge' },
        props.count
      )
    ),
    _react2['default'].createElement(_Controls2['default'], {
      onRefresh: props.onRefresh,
      onClose: props.onClose
    })
  );
}

Header.propTypes = {
  onRefresh: _react.PropTypes.func.isRequired,
  onClose: _react.PropTypes.func.isRequired,
  count: _react.PropTypes.number
};

exports['default'] = Header;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvY29tcG9uZW50cy9IZWFkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3FCQUUrQixPQUFPOzs7O3dCQUNqQixZQUFZOzs7O0FBSGpDLFdBQVcsQ0FBQzs7QUFLWixTQUFTLE1BQU0sQ0FBQyxLQUFLLEVBQUM7QUFDcEIsU0FDRTs7TUFBSyxTQUFTLEVBQUMsUUFBUTtJQUNyQjs7OztNQUNFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJOztVQUFNLFNBQVMsRUFBQyxhQUFhO1FBQUUsS0FBSyxDQUFDLEtBQUs7T0FBUTtLQUVoRTtJQUVMO0FBQ0UsZUFBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLEFBQUM7QUFDM0IsYUFBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEFBQUM7TUFDdkI7R0FDRSxDQUNOO0NBQ0g7O0FBRUQsTUFBTSxDQUFDLFNBQVMsR0FBRztBQUNqQixXQUFTLEVBQUUsaUJBQVUsSUFBSSxDQUFDLFVBQVU7QUFDcEMsU0FBTyxFQUFFLGlCQUFVLElBQUksQ0FBQyxVQUFVO0FBQ2xDLE9BQUssRUFBRSxpQkFBVSxNQUFNO0NBQ3hCLENBQUM7O3FCQUVhLE1BQU0iLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90b2RvL2xpYi9jb21wb25lbnRzL0hlYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDb250cm9scyBmcm9tICcuL0NvbnRyb2xzJztcblxuZnVuY3Rpb24gSGVhZGVyKHByb3BzKXtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJz5cbiAgICAgIDxoMT50b2RvIHtcbiAgICAgICAgISFwcm9wcy5jb3VudCAmJiA8c3BhbiBjbGFzc05hbWU9J2JhZGdlIGJhZGdlJz57cHJvcHMuY291bnR9PC9zcGFuPlxuICAgICAgfVxuICAgICAgPC9oMT5cblxuICAgICAgPENvbnRyb2xzXG4gICAgICAgIG9uUmVmcmVzaD17cHJvcHMub25SZWZyZXNofVxuICAgICAgICBvbkNsb3NlPXtwcm9wcy5vbkNsb3NlfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuSGVhZGVyLnByb3BUeXBlcyA9IHtcbiAgb25SZWZyZXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBjb3VudDogUHJvcFR5cGVzLm51bWJlcixcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEhlYWRlcjtcbiJdfQ==