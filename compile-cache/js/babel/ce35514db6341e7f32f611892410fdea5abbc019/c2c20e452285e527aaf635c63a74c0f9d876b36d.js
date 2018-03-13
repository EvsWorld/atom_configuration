Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// TODO: in /lib/components/Controls.js

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

'use babel';

function Controls(props) {
  return _react2['default'].createElement(
    'div',
    { className: 'btn-toolbar' },
    _react2['default'].createElement(
      'div',
      { className: 'controls btn-group' },
      _react2['default'].createElement('button', {
        className: 'btn icon icon-sync',
        onClick: props.onRefresh
      }),
      _react2['default'].createElement('button', {
        className: 'btn icon icon-x',
        onClick: props.onClose
      })
    )
  );
}

Controls.propTypes = {
  onRefresh: _react.PropTypes.func.isRequired,
  onClose: _react.PropTypes.func.isRequired
};

exports['default'] = Controls;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvY29tcG9uZW50cy9Db250cm9scy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztxQkFJK0IsT0FBTzs7OztBQUp0QyxXQUFXLENBQUM7O0FBTVosU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFDO0FBQ3RCLFNBQ0U7O01BQUssU0FBUyxFQUFDLGFBQWE7SUFDMUI7O1FBQUssU0FBUyxFQUFDLG9CQUFvQjtNQUNqQztBQUNBLGlCQUFTLEVBQUMsb0JBQW9CO0FBQzlCLGVBQU8sRUFBRyxLQUFLLENBQUMsU0FBUyxBQUFFO1FBQ3pCO01BQ0Y7QUFDQSxpQkFBUyxFQUFDLGlCQUFpQjtBQUMzQixlQUFPLEVBQUcsS0FBSyxDQUFDLE9BQU8sQUFBRTtRQUN2QjtLQUNFO0dBQ0YsQ0FDTjtDQUNIOztBQUVELFFBQVEsQ0FBQyxTQUFTLEdBQUc7QUFDbkIsV0FBUyxFQUFFLGlCQUFVLElBQUksQ0FBQyxVQUFVO0FBQ3BDLFNBQU8sRUFBRSxpQkFBVSxJQUFJLENBQUMsVUFBVTtDQUNuQyxDQUFDOztxQkFFYSxRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvY29tcG9uZW50cy9Db250cm9scy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBUT0RPOiBpbiAvbGliL2NvbXBvbmVudHMvQ29udHJvbHMuanNcblxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmZ1bmN0aW9uIENvbnRyb2xzKHByb3BzKXtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT0nYnRuLXRvb2xiYXInPlxuICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbnRyb2xzIGJ0bi1ncm91cCc+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPSdidG4gaWNvbiBpY29uLXN5bmMnXG4gICAgICAgIG9uQ2xpY2s9eyBwcm9wcy5vblJlZnJlc2ggfVxuICAgICAgICAvPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzTmFtZT0nYnRuIGljb24gaWNvbi14J1xuICAgICAgICBvbkNsaWNrPXsgcHJvcHMub25DbG9zZSB9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuQ29udHJvbHMucHJvcFR5cGVzID0ge1xuICBvblJlZnJlc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb250cm9scztcbiJdfQ==