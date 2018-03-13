Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Tree = require('./Tree');

var _Tree2 = _interopRequireDefault(_Tree);

'use babel';

var TreeNode = (function (_React$Component) {
  _inherits(TreeNode, _React$Component);

  function TreeNode() {
    _classCallCheck(this, TreeNode);

    _get(Object.getPrototypeOf(TreeNode.prototype), 'constructor', this).call(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      collapsed: false
    };
  }

  _createClass(TreeNode, [{
    key: 'render',
    value: function render() {
      var isLeaf = this.props.nodes.length === 0;
      var containerClassName = isLeaf ? 'list-item' : 'list-nested-item';

      if (this.state.collapsed) {
        containerClassName += ' collapsed';
      }

      var thisItemClassName = this.props.icon ? 'icon ' + this.props.icon : '';

      // TODO: add classes to subdue directories and highlight text nodes

      return _react2['default'].createElement(
        'li',
        {
          className: containerClassName,
          onClick: this.onClick
        },
        _react2['default'].createElement(
          'div',
          { className: 'list-item' },
          _react2['default'].createElement(
            'span',
            { className: thisItemClassName },
            this.props.text
          )
        ),
        !isLeaf && _react2['default'].createElement(_Tree2['default'], {
          data: {
            nodes: this.props.nodes
          },
          onNodeClick: this.props.onClick
        })
      );
    }
  }, {
    key: 'onClick',
    value: function onClick(event) {
      event.stopPropagation();

      if (this.props.nodes.length) {
        this.setState({
          collapsed: !this.state.collapsed
        });
      } else if (this.props.onClick) {
        this.props.onClick(this.props.data);
      }
    }
  }]);

  return TreeNode;
})(_react2['default'].Component);

TreeNode.propTypes = {
  text: _react.PropTypes.string.isRequired,
  nodes: _react.PropTypes.array.isRequired,
  icon: _react.PropTypes.string,
  onClick: _react.PropTypes.func,
  data: _react.PropTypes.object
};

exports['default'] = TreeNode;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvY29tcG9uZW50cy9UcmVlTm9kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztxQkFFK0IsT0FBTzs7OztvQkFDckIsUUFBUTs7OztBQUh6QixXQUFXLENBQUM7O0lBS04sUUFBUTtZQUFSLFFBQVE7O0FBQ0QsV0FEUCxRQUFRLEdBQ0U7MEJBRFYsUUFBUTs7QUFFViwrQkFGRSxRQUFRLDZDQUVGO0FBQ1IsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxRQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsZUFBUyxFQUFFLEtBQUs7S0FDakIsQ0FBQztHQUNIOztlQVBHLFFBQVE7O1dBU04sa0JBQUc7QUFDUCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0FBQzdDLFVBQUksa0JBQWtCLEdBQUcsTUFBTSxHQUMzQixXQUFXLEdBQ1gsa0JBQWtCLENBQUM7O0FBRXZCLFVBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7QUFDeEIsMEJBQWtCLElBQUksWUFBWSxDQUFDO09BQ3BDOztBQUVELFVBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLGFBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUN2QixFQUFFLENBQUM7Ozs7QUFJUCxhQUNFOzs7QUFDRSxtQkFBUyxFQUFFLGtCQUFrQixBQUFDO0FBQzlCLGlCQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQUFBQzs7UUFFdEI7O1lBQUssU0FBUyxFQUFDLFdBQVc7VUFDeEI7O2NBQU0sU0FBUyxFQUFFLGlCQUFpQixBQUFDO1lBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO1dBQVE7U0FDeEQ7UUFHSixDQUFDLE1BQU0sSUFDUDtBQUNFLGNBQUksRUFBRTtBQUNKLGlCQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO1dBQ3hCLEFBQUM7QUFDRixxQkFBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxBQUFDO1VBQ2hDO09BRUQsQ0FDTDtLQUNIOzs7V0FFTSxpQkFBQyxLQUFLLEVBQUU7QUFDYixXQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7O0FBRXhCLFVBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQzNCLFlBQUksQ0FBQyxRQUFRLENBQUM7QUFDWixtQkFBUyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTO1NBQ2pDLENBQUMsQ0FBQztPQUNKLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUM3QixZQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3JDO0tBQ0Y7OztTQXpERyxRQUFRO0dBQVMsbUJBQU0sU0FBUzs7QUE0RHRDLFFBQVEsQ0FBQyxTQUFTLEdBQUc7QUFDbkIsTUFBSSxFQUFFLGlCQUFVLE1BQU0sQ0FBQyxVQUFVO0FBQ2pDLE9BQUssRUFBRSxpQkFBVSxLQUFLLENBQUMsVUFBVTtBQUNqQyxNQUFJLEVBQUUsaUJBQVUsTUFBTTtBQUN0QixTQUFPLEVBQUUsaUJBQVUsSUFBSTtBQUN2QixNQUFJLEVBQUUsaUJBQVUsTUFBTTtDQUN2QixDQUFDOztxQkFFYSxRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvY29tcG9uZW50cy9UcmVlTm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBUcmVlIGZyb20gJy4vVHJlZSc7XG5cbmNsYXNzIFRyZWVOb2RlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm9uQ2xpY2sgPSB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzTGVhZiA9IHRoaXMucHJvcHMubm9kZXMubGVuZ3RoID09PSAwO1xuICAgIGxldCBjb250YWluZXJDbGFzc05hbWUgPSBpc0xlYWZcbiAgICAgID8gJ2xpc3QtaXRlbSdcbiAgICAgIDogJ2xpc3QtbmVzdGVkLWl0ZW0nO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuY29sbGFwc2VkKSB7XG4gICAgICBjb250YWluZXJDbGFzc05hbWUgKz0gJyBjb2xsYXBzZWQnO1xuICAgIH1cblxuICAgIGNvbnN0IHRoaXNJdGVtQ2xhc3NOYW1lID0gdGhpcy5wcm9wcy5pY29uXG4gICAgICA/IGBpY29uICR7dGhpcy5wcm9wcy5pY29ufWBcbiAgICAgIDogJyc7XG5cbiAgICAvLyBUT0RPOiBhZGQgY2xhc3NlcyB0byBzdWJkdWUgZGlyZWN0b3JpZXMgYW5kIGhpZ2hsaWdodCB0ZXh0IG5vZGVzXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGxpXG4gICAgICAgIGNsYXNzTmFtZT17Y29udGFpbmVyQ2xhc3NOYW1lfVxuICAgICAgICBvbkNsaWNrPXt0aGlzLm9uQ2xpY2t9XG4gICAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xpc3QtaXRlbSc+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXt0aGlzSXRlbUNsYXNzTmFtZX0+e3RoaXMucHJvcHMudGV4dH08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHtcbiAgICAgICAgICAhaXNMZWFmICYmXG4gICAgICAgICAgPFRyZWVcbiAgICAgICAgICAgIGRhdGE9e3tcbiAgICAgICAgICAgICAgbm9kZXM6IHRoaXMucHJvcHMubm9kZXMsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25Ob2RlQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja31cbiAgICAgICAgICAvPlxuICAgICAgICB9XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cblxuICBvbkNsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5ub2Rlcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjb2xsYXBzZWQ6ICF0aGlzLnN0YXRlLmNvbGxhcHNlZCxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5vbkNsaWNrKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2xpY2sodGhpcy5wcm9wcy5kYXRhKTtcbiAgICB9XG4gIH1cbn1cblxuVHJlZU5vZGUucHJvcFR5cGVzID0ge1xuICB0ZXh0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG5vZGVzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgaWNvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gIGRhdGE6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBUcmVlTm9kZTtcbiJdfQ==