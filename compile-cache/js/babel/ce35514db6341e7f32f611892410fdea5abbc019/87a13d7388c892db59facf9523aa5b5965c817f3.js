Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

'use babel';

function Status(props) {
  return _react2['default'].createElement(
    'div',
    { className: 'status' },
    _react2['default'].createElement(
      'div',
      { className: 'block' },
      'searched ',
      props.pathsSearched,
      ' files'
    ),
    props.loading && _react2['default'].createElement('div', { className: 'loading loading-spinner-large block' })
  );
}

Status.propTypes = {
  loading: _react.PropTypes.bool.isRequired,
  pathsSearched: _react.PropTypes.number
};

exports['default'] = Status;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvY29tcG9uZW50cy9TdGF0dXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3FCQUUrQixPQUFPOzs7O0FBRnRDLFdBQVcsQ0FBQzs7QUFJWixTQUFTLE1BQU0sQ0FBQyxLQUFLLEVBQUM7QUFDcEIsU0FDRTs7TUFBSyxTQUFTLEVBQUMsUUFBUTtJQUNyQjs7UUFBSyxTQUFTLEVBQUMsT0FBTzs7TUFBVyxLQUFLLENBQUMsYUFBYTs7S0FBYTtJQUUvRCxLQUFLLENBQUMsT0FBTyxJQUNWLDBDQUFLLFNBQVMsRUFBQyxxQ0FBcUMsR0FBTztHQUU1RCxDQUNOO0NBQ0g7O0FBRUQsTUFBTSxDQUFDLFNBQVMsR0FBRztBQUNqQixTQUFPLEVBQUUsaUJBQVUsSUFBSSxDQUFDLFVBQVU7QUFDbEMsZUFBYSxFQUFFLGlCQUFVLE1BQU07Q0FDaEMsQ0FBQzs7cUJBRWEsTUFBTSIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL3RvZG8vbGliL2NvbXBvbmVudHMvU3RhdHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5mdW5jdGlvbiBTdGF0dXMocHJvcHMpe1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPSdzdGF0dXMnPlxuICAgICAgPGRpdiBjbGFzc05hbWU9J2Jsb2NrJz5zZWFyY2hlZCB7cHJvcHMucGF0aHNTZWFyY2hlZH0gZmlsZXM8L2Rpdj5cbiAgICAgIHtcbiAgICAgICAgcHJvcHMubG9hZGluZ1xuICAgICAgICAmJiA8ZGl2IGNsYXNzTmFtZT0nbG9hZGluZyBsb2FkaW5nLXNwaW5uZXItbGFyZ2UgYmxvY2snPjwvZGl2PlxuICAgICAgfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5TdGF0dXMucHJvcFR5cGVzID0ge1xuICBsb2FkaW5nOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBwYXRoc1NlYXJjaGVkOiBQcm9wVHlwZXMubnVtYmVyLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgU3RhdHVzO1xuIl19