Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO: in /lib/components/Container

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _Empty = require('./Empty');

var _Empty2 = _interopRequireDefault(_Empty);

var _Status = require('./Status');

var _Status2 = _interopRequireDefault(_Status);

var _Search = require('./Search');

var _Search2 = _interopRequireDefault(_Search);

var _Tree = require('./Tree');

var _Tree2 = _interopRequireDefault(_Tree);

var _service = require('../service');

var _service2 = _interopRequireDefault(_service);

// TODO: do not transform here, feed it in through props

'use babel';
var Container = (function (_React$Component) {
    _inherits(Container, _React$Component);

    _createClass(Container, null, [{
        key: 'propTypes',
        get: function get() {
            return {
                onRefresh: _react.PropTypes.func.isRequired,
                onClose: _react.PropTypes.func.isRequired,
                onItemClick: _react.PropTypes.func.isRequired,
                items: _react.PropTypes.array.isRequired,
                loading: _react.PropTypes.bool.isRequired,
                pathsSearched: _react.PropTypes.number
            };
        }
    }]);

    function Container() {
        _classCallCheck(this, Container);

        _get(Object.getPrototypeOf(Container.prototype), 'constructor', this).call(this);
        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onClose = this.onClose.bind(this);
        this._handleNodeClick = this._handleNodeClick.bind(this);

        this.state = {
            searchValue: null
        };
    }

    _createClass(Container, [{
        key: 'render',
        value: function render() {
            var props = this.props;

            var filteredItems = this.getFilteredItems(props.items, this.state.searchValue);
            return _react2['default'].createElement(
                'atom-panel',
                { className: 'right' },
                _react2['default'].createElement(
                    'div',
                    { className: 'padded' },
                    _react2['default'].createElement(
                        'div',
                        { className: 'inset-panel' },
                        _react2['default'].createElement(
                            'div',
                            { className: 'panel-heading' },
                            _react2['default'].createElement(_Header2['default'], {
                                onRefresh: this.onRefresh,
                                onClose: this.onClose,
                                count: props.items && props.items.length
                            }),
                            !props.loading && _react2['default'].createElement(_Search2['default'], {
                                onChange: this.onSearchChanged
                            })
                        ),
                        _react2['default'].createElement(
                            'div',
                            { className: 'panel-body padded' },
                            _react2['default'].createElement(_Status2['default'], {
                                loading: props.loading,
                                pathsSearched: props.pathsSearched
                            }),
                            !props.loading && (props.items.length ? _react2['default'].createElement(_Tree2['default'], {
                                data: _service2['default'].getTreeFormat(filteredItems),
                                onNodeClick: this._handleNodeClick
                            }) : _react2['default'].createElement(_Empty2['default'], null))
                        )
                    )
                )
            );
        }
    }, {
        key: 'getFilteredItems',
        value: function getFilteredItems(items, searchValue) {
            if (!searchValue) {
                return items;
            } else {
                var _ret = (function () {
                    var filtered = [];

                    items.map(function (item) {
                        var filteredMatches = item.matches.filter(function (match) {
                            return match.matchText.indexOf(searchValue) > -1;
                        });

                        if (filteredMatches.length) {
                            filtered.push(Object.assign({}, item, {
                                matches: filteredMatches
                            }));
                        }
                    });

                    return {
                        v: filtered
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            }
        }
    }, {
        key: 'onSearchChanged',
        value: function onSearchChanged(event) {
            var searchValue = event.target.value;

            this.setState({ searchValue: searchValue });
        }
    }, {
        key: 'clearSearch',
        value: function clearSearch() {
            this.setState({ searchValue: null });
        }
    }, {
        key: 'onRefresh',
        value: function onRefresh() {
            this.clearSearch();
            this.props.onRefresh();
        }
    }, {
        key: 'onClose',
        value: function onClose() {
            this.clearSearch();
            this.props.onClose();
        }
    }, {
        key: '_handleNodeClick',
        value: function _handleNodeClick(data) {
            this.props.onItemClick(data.filePath, data.range);
        }
    }]);

    return Container;
})(_react2['default'].Component);

exports['default'] = Container;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvY29tcG9uZW50cy9Db250YWluZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFJK0IsT0FBTzs7OztzQkFDbkIsVUFBVTs7OztxQkFDWCxTQUFTOzs7O3NCQUNSLFVBQVU7Ozs7c0JBQ1YsVUFBVTs7OztvQkFDWixRQUFROzs7O3VCQUNMLFlBQVk7Ozs7OztBQVZoQyxXQUFXLENBQUM7SUFZTixTQUFTO2NBQVQsU0FBUzs7aUJBQVQsU0FBUzs7YUFDUyxlQUFHO0FBQ25CLG1CQUFPO0FBQ0gseUJBQVMsRUFBRSxpQkFBVSxJQUFJLENBQUMsVUFBVTtBQUNwQyx1QkFBTyxFQUFFLGlCQUFVLElBQUksQ0FBQyxVQUFVO0FBQ2xDLDJCQUFXLEVBQUUsaUJBQVUsSUFBSSxDQUFDLFVBQVU7QUFDdEMscUJBQUssRUFBRSxpQkFBVSxLQUFLLENBQUMsVUFBVTtBQUNqQyx1QkFBTyxFQUFFLGlCQUFVLElBQUksQ0FBQyxVQUFVO0FBQ2xDLDZCQUFhLEVBQUUsaUJBQVUsTUFBTTthQUNsQyxDQUFDO1NBQ0w7OztBQUVVLGFBWlQsU0FBUyxHQVlHOzhCQVpaLFNBQVM7O0FBYVAsbUNBYkYsU0FBUyw2Q0FhQztBQUNSLFlBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkQsWUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQyxZQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV6RCxZQUFJLENBQUMs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U0FDeEI7OztlQUVlLDBCQUFDLElBQUksRUFBRTtBQUNyQixnQkFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbkQ7OztXQXJIQyxTQUFTO0dBQVMsbUJBQU0sU0FBUzs7cUJBd0h4QixTQUFTIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvY29tcG9uZW50cy9Db250YWluZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gVE9ETzogaW4gL2xpYi9jb21wb25lbnRzL0NvbnRhaW5lclxuXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi9IZWFkZXInO1xuaW1wb3J0IEVtcHR5IGZyb20gJy4vRW1wdHknO1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuL1N0YXR1cyc7XG5pbXBvcnQgU2VhcmNoIGZyb20gJy4vU2VhcmNoJztcbmltcG9ydCBUcmVlIGZyb20gJy4vVHJlZSc7XG5pbXBvcnQgc2VydmljZSBmcm9tICcuLi9zZXJ2aWNlJzsgLy8gVE9ETzogZG8gbm90IHRyYW5zZm9ybSBoZXJlLCBmZWVkIGl0IGluIHRocm91Z2ggcHJvcHNcblxuY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgZ2V0IHByb3BUeXBlcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9uUmVmcmVzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICAgICAgICBvbkl0ZW1DbGljazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgIGxvYWRpbmc6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgICAgICAgICBwYXRoc1NlYXJjaGVkOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm9uU2VhcmNoQ2hhbmdlZCA9IHRoaXMub25TZWFyY2hDaGFuZ2VkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25SZWZyZXNoID0gdGhpcy5vblJlZnJlc2guYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkNsb3NlID0gdGhpcy5vbkNsb3NlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZU5vZGVDbGljayA9IHRoaXMuX2hhbmRsZU5vZGVDbGljay5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBzZWFyY2hWYWx1ZTogbnVsbCxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHtwcm9wc30gPSB0aGlzO1xuICAgICAgICBjb25zdCBmaWx0ZXJlZEl0ZW1zID0gdGhpcy5nZXRGaWx0ZXJlZEl0ZW1zKHByb3BzLml0ZW1zLCB0aGlzLnN0YXRlLnNlYXJjaFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8YXRvbS1wYW5lbCBjbGFzc05hbWU9J3JpZ2h0Jz5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3BhZGRlZCc+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2luc2V0LXBhbmVsJz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVsLWhlYWRpbmcnPlxuICAgICAgICAgICAgICAgICAgICAgIDxIZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25SZWZyZXNoPXt0aGlzLm9uUmVmcmVzaH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17dGhpcy5vbkNsb3NlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudD17cHJvcHMuaXRlbXMgJiYgcHJvcHMuaXRlbXMubGVuZ3RofVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICFwcm9wcy5sb2FkaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxTZWFyY2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uU2VhcmNoQ2hhbmdlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncGFuZWwtYm9keSBwYWRkZWQnPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFN0YXR1c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRpbmc9e3Byb3BzLmxvYWRpbmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aHNTZWFyY2hlZD17cHJvcHMucGF0aHNTZWFyY2hlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhcHJvcHMubG9hZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHMuaXRlbXMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUcmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhPXtzZXJ2aWNlLmdldFRyZWVGb3JtYXQoZmlsdGVyZWRJdGVtcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk5vZGVDbGljaz17dGhpcy5faGFuZGxlTm9kZUNsaWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiA8RW1wdHkgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9hdG9tLXBhbmVsPlxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldEZpbHRlcmVkSXRlbXMoaXRlbXMsIHNlYXJjaFZhbHVlKSB7XG4gICAgICAgIGlmICghc2VhcmNoVmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkID0gW107XG5cbiAgICAgICAgICAgIGl0ZW1zLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJlZE1hdGNoZXMgPSBpdGVtLm1hdGNoZXMuZmlsdGVyKG1hdGNoID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoLm1hdGNoVGV4dC5pbmRleE9mKHNlYXJjaFZhbHVlKSA+IC0xO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcmVkTWF0Y2hlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oe30sIGl0ZW0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzOiBmaWx0ZXJlZE1hdGNoZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblNlYXJjaENoYW5nZWQoZXZlbnQpIHtcbiAgICAgICAgY29uc3Qge3RhcmdldDogeyB2YWx1ZTogc2VhcmNoVmFsdWUgfX0gPSBldmVudDtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNlYXJjaFZhbHVlIH0pO1xuICAgIH1cblxuICAgIGNsZWFyU2VhcmNoKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2VhcmNoVmFsdWU6IG51bGwgfSk7XG4gICAgfVxuXG4gICAgb25SZWZyZXNoKCkge1xuICAgICAgICB0aGlzLmNsZWFyU2VhcmNoKCk7XG4gICAgICAgIHRoaXMucHJvcHMub25SZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgb25DbG9zZSgpIHtcbiAgICAgICAgdGhpcy5jbGVhclNlYXJjaCgpO1xuICAgICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoKTtcbiAgICB9XG5cbiAgICBfaGFuZGxlTm9kZUNsaWNrKGRhdGEpIHtcbiAgICAgIHRoaXMucHJvcHMub25JdGVtQ2xpY2soZGF0YS5maWxlUGF0aCwgZGF0YS5yYW5nZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250YWluZXI7XG4iXX0=