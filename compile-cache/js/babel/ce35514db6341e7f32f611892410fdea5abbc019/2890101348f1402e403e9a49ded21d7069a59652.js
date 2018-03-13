Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom */

var _atom = require('atom');

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _changeCase = require('change-case');

var _changeCase2 = _interopRequireDefault(_changeCase);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _viewUri = require('./view-uri');

var _Manager = require('../Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _modelsProject = require('../models/Project');

var _modelsProject2 = _interopRequireDefault(_modelsProject);

var disposables = new _atom.CompositeDisposable();

_etch2['default'].setScheduler(atom.views);

var EditView = (function () {
  function EditView(props, children) {
    var _this = this;

    _classCallCheck(this, EditView);

    this.props = props;
    this.children = children;
    _etch2['default'].initialize(this);

    this.storeFocusedElement();

    this.setFocus();

    this.element.addEventListener('click', function (event) {
      if (event.target === _this.refs.save) {
        _this.saveProject();
      }
    });

    disposables.add(atom.commands.add(this.element, {
      'core:save': function coreSave() {
        return _this.saveProject();
      },
      'core:confirm': function coreConfirm() {
        return _this.saveProject();
      }
    }));

    disposables.add(atom.commands.add('atom-workspace', {
      'core:cancel': function coreCancel() {
        return _this.close();
      }
    }));
  }

  _createClass(EditView, [{
    key: 'getFocusElement',
    value: function getFocusElement() {
      return this.refs.title;
    }
  }, {
    key: 'setFocus',
    value: function setFocus() {
      var focusElement = this.getFocusElement();

      if (focusElement) {
        setTimeout(function () {
          focusElement.focus();
        }, 0);
      }
    }
  }, {
    key: 'storeFocusedElement',
    value: function storeFocusedElement() {
      this.previouslyFocusedElement = document.activeElement;
    }
  }, {
    key: 'restoreFocus',
    value: function restoreFocus() {
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
      }
    }
  }, {
    key: 'close',
    value: function close() {
      this.destroy();
    }
  }, {
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      var pane = atom.workspace.paneForURI(_viewUri.EDIT_URI);
      if (pane) {
        var item = pane.itemForURI(_viewUri.EDIT_URI);
        pane.destroyItem(item);
      }

      disposables.dispose();
      yield _etch2['default'].destroy(this);
    })
  }, {
    key: 'saveProject',
    value: function saveProject() {
      var projectProps = {
        title: this.refs.title.value,
        paths: atom.project.getPaths(),
        group: this.refs.group.value,
        icon: this.refs.icon.value,
        devMode: this.refs.devMode.checked
      };
      var message = projectProps.title + ' has been saved.';

      if (this.props.project) {
        // Paths should already be up-to-date, so use
        // the current paths as to not break possible relative paths.
        projectProps.paths = this.props.project.getProps().paths;
      }

      // many stuff will break if there is no root path,
      // so we don't continue without a root path
      if (!projectProps.paths.length) {
        atom.notifications.addError('You must have at least one folder in your project before you can save !');
      } else {
        _Manager2['default'].saveProject(projectProps);

        if (this.props.project) {
          message = this.props.project.title + ' has been updated.';
        }
        atom.notifications.addSuccess(message);

        this.close();
      }
    }
  }, {
    key: 'update',
    value: function update(props, children) {
      this.props = props;
      this.children = children;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      if (this.props.project) {
        return 'Edit ' + this.props.project.title;
      }

      return 'Save Project';
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      // eslint-disable-line class-methods-use-this
      return 'gear';
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      // eslint-disable-line class-methods-use-this
      return _viewUri.EDIT_URI;
    }
  }, {
    key: 'render',
    value: function render() {
      var defaultProps = _modelsProject2['default'].defaultProps;
      var rootPath = atom.project.getPaths()[0];
      var props = defaultProps;

      if (atom.config.get('project-manager.prettifyTitle')) {
        props.title = _changeCase2['default'].titleCase(_path2['default'].basename(rootPath));
      }

      if (this.props.project && this.props.project.source === 'file') {
        var projectProps = this.props.project.getProps();
        props = Object.assign({}, props, projectProps);
      }

      var wrapperStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };

      var style = {
        width: '500px'
      };

      return _etch2['default'].dom(
        'div',
        { style: wrapperStyle, className: 'project-manager-edit padded native-key-bindings' },
        _etch2['default'].dom(
          'div',
          { style: style },
          _etch2['default'].dom(
            'h1',
            { className: 'block section-heading' },
            this.getTitle()
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block' },
            _etch2['default'].dom(
              'label',
              { className: 'input-label' },
              'Title'
            ),
            _etch2['default'].dom('input', { ref: 'title', type: 'text', className: 'input-text', value: props.title, tabIndex: '0' })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block' },
            _etch2['default'].dom(
              'label',
              { className: 'input-label' },
              'Group'
            ),
            _etch2['default'].dom('input', { ref: 'group', type: 'text', className: 'input-text', value: props.group, tabIndex: '1' })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block' },
            _etch2['default'].dom(
              'label',
              { className: 'input-label' },
              'Icon'
            ),
            _etch2['default'].dom('input', { ref: 'icon', type: 'text', className: 'input-text', value: props.icon, tabIndex: '2' })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block' },
            _etch2['default'].dom(
              'label',
              { className: 'input-label', 'for': 'devMode' },
              'Development mode'
            ),
            _etch2['default'].dom('input', {
              ref: 'devMode',
              id: 'devMode',
              name: 'devMode',
              type: 'checkbox',
              className: 'input-toggle',
              checked: props.devMode,
              tabIndex: '3'
            })
          ),
          _etch2['default'].dom(
            'div',
            { className: 'block', style: { textAlign: 'right' } },
            _etch2['default'].dom(
              'button',
              { ref: 'save', className: 'btn btn-primary', tabIndex: '4' },
              'Save'
            )
          )
        )
      );
    }
  }]);

  return EditView;
})();

exports['default'] = EditView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi92aWV3cy9FZGl0Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07O29CQUN6QixNQUFNOzs7OzBCQUNBLGFBQWE7Ozs7b0JBQ25CLE1BQU07Ozs7dUJBQ0UsWUFBWTs7dUJBQ2pCLFlBQVk7Ozs7NkJBQ1osbUJBQW1COzs7O0FBRXZDLElBQU0sV0FBVyxHQUFHLCtCQUF5QixDQUFDOztBQUU5QyxrQkFBSyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUVULFFBQVE7QUFDaEIsV0FEUSxRQUFRLENBQ2YsS0FBSyxFQUFFLFFBQVEsRUFBRTs7OzBCQURWLFFBQVE7O0FBRXpCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7O0FBRTNCLFFBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDaEQsVUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLE1BQUssSUFBSSxDQUFDLElBQUksRUFBRTtBQUNuQyxjQUFLLFdBQVcsRUFBRSxDQUFDO09BQ3BCO0tBQ0YsQ0FBQyxDQUFDOztBQUVILGVBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUM5QyxpQkFBVyxFQUFFO2VBQU0sTUFBSyxXQUFXLEVBQUU7T0FBQTtBQUNyQyxvQkFBYyxFQUFFO2VBQU0sTUFBSyxXQUFXLEVBQUU7T0FBQTtLQUN6QyxDQUFDLENB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YztBQUN4QixxQkFBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEFBQUM7QUFDdkIsc0JBQVEsRUFBQyxHQUFHO2NBQ1o7V0FDQTtVQUVOOztjQUFLLFNBQVMsRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxBQUFDO1lBQ25EOztnQkFBUSxHQUFHLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxRQUFRLEVBQUMsR0FBRzs7YUFBYztXQUNyRTtTQUNGO09BQ0YsQ0FDTjtLQUNIOzs7U0FyTGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi92aWV3cy9FZGl0Vmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnO1xuaW1wb3J0IGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBFRElUX1VSSSB9IGZyb20gJy4vdmlldy11cmknO1xuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi4vTWFuYWdlcic7XG5pbXBvcnQgUHJvamVjdCBmcm9tICcuLi9tb2RlbHMvUHJvamVjdCc7XG5cbmNvbnN0IGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuZXRjaC5zZXRTY2hlZHVsZXIoYXRvbS52aWV3cyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRWaWV3IHtcbiAgY29uc3RydWN0b3IocHJvcHMsIGNoaWxkcmVuKSB7XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICBldGNoLmluaXRpYWxpemUodGhpcyk7XG5cbiAgICB0aGlzLnN0b3JlRm9jdXNlZEVsZW1lbnQoKTtcblxuICAgIHRoaXMuc2V0Rm9jdXMoKTtcblxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcy5yZWZzLnNhdmUpIHtcbiAgICAgICAgdGhpcy5zYXZlUHJvamVjdCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKHRoaXMuZWxlbWVudCwge1xuICAgICAgJ2NvcmU6c2F2ZSc6ICgpID0+IHRoaXMuc2F2ZVByb2plY3QoKSxcbiAgICAgICdjb3JlOmNvbmZpcm0nOiAoKSA9PiB0aGlzLnNhdmVQcm9qZWN0KCksXG4gICAgfSkpO1xuXG4gICAgZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdjb3JlOmNhbmNlbCc6ICgpID0+IHRoaXMuY2xvc2UoKSxcbiAgICB9KSk7XG4gIH1cblxuICBnZXRGb2N1c0VsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmcy50aXRsZTtcbiAgfVxuXG4gIHNldEZvY3VzKCkge1xuICAgIGNvbnN0IGZvY3VzRWxlbWVudCA9IHRoaXMuZ2V0Rm9jdXNFbGVtZW50KCk7XG5cbiAgICBpZiAoZm9jdXNFbGVtZW50KSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZm9jdXNFbGVtZW50LmZvY3VzKCk7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH1cblxuICBzdG9yZUZvY3VzZWRFbGVtZW50KCkge1xuICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgfVxuXG4gIHJlc3RvcmVGb2N1cygpIHtcbiAgICBpZiAodGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQpIHtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gIH1cblxuICBhc3luYyBkZXN0cm95KCkge1xuICAgIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKEVESVRfVVJJKTtcbiAgICBpZiAocGFuZSkge1xuICAgICAgY29uc3QgaXRlbSA9IHBhbmUuaXRlbUZvclVSSShFRElUX1VSSSk7XG4gICAgICBwYW5lLmRlc3Ryb3lJdGVtKGl0ZW0pO1xuICAgIH1cblxuICAgIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgICBhd2FpdCBldGNoLmRlc3Ryb3kodGhpcyk7XG4gIH1cblxuICBzYXZlUHJvamVjdCgpIHtcbiAgICBjb25zdCBwcm9qZWN0UHJvcHMgPSB7XG4gICAgICB0aXRsZTogdGhpcy5yZWZzLnRpdGxlLnZhbHVlLFxuICAgICAgcGF0aHM6IGF0b20ucHJvamVjdC5nZXRQYXRocygpLFxuICAgICAgZ3JvdXA6IHRoaXMucmVmcy5ncm91cC52YWx1ZSxcbiAgICAgIGljb246IHRoaXMucmVmcy5pY29uLnZhbHVlLFxuICAgICAgZGV2TW9kZTogdGhpcy5yZWZzLmRldk1vZGUuY2hlY2tlZCxcbiAgICB9O1xuICAgIGxldCBtZXNzYWdlID0gYCR7cHJvamVjdFByb3BzLnRpdGxlfSBoYXMgYmVlbiBzYXZlZC5gO1xuXG4gICAgaWYgKHRoaXMucHJvcHMucHJvamVjdCkge1xuICAgICAgLy8gUGF0aHMgc2hvdWxkIGFscmVhZHkgYmUgdXAtdG8tZGF0ZSwgc28gdXNlXG4gICAgICAvLyB0aGUgY3VycmVudCBwYXRocyBhcyB0byBub3QgYnJlYWsgcG9zc2libGUgcmVsYXRpdmUgcGF0aHMuXG4gICAgICBwcm9qZWN0UHJvcHMucGF0aHMgPSB0aGlzLnByb3BzLnByb2plY3QuZ2V0UHJvcHMoKS5wYXRocztcbiAgICB9XG5cbiAgICAvLyBtYW55IHN0dWZmIHdpbGwgYnJlYWsgaWYgdGhlcmUgaXMgbm8gcm9vdCBwYXRoLFxuICAgIC8vIHNvIHdlIGRvbid0IGNvbnRpbnVlIHdpdGhvdXQgYSByb290IHBhdGhcbiAgICBpZiAoIXByb2plY3RQcm9wcy5wYXRocy5sZW5ndGgpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignWW91IG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgZm9sZGVyIGluIHlvdXIgcHJvamVjdCBiZWZvcmUgeW91IGNhbiBzYXZlICEnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWFuYWdlci5zYXZlUHJvamVjdChwcm9qZWN0UHJvcHMpO1xuXG4gICAgICBpZiAodGhpcy5wcm9wcy5wcm9qZWN0KSB7XG4gICAgICAgIG1lc3NhZ2UgPSBgJHt0aGlzLnByb3BzLnByb2plY3QudGl0bGV9IGhhcyBiZWVuIHVwZGF0ZWQuYDtcbiAgICAgIH1cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKG1lc3NhZ2UpO1xuXG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKHByb3BzLCBjaGlsZHJlbikge1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5wcm9qZWN0KSB7XG4gICAgICByZXR1cm4gYEVkaXQgJHt0aGlzLnByb3BzLnByb2plY3QudGl0bGV9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gJ1NhdmUgUHJvamVjdCc7XG4gIH1cblxuICBnZXRJY29uTmFtZSgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gICAgcmV0dXJuICdnZWFyJztcbiAgfVxuXG4gIGdldFVSSSgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gICAgcmV0dXJuIEVESVRfVVJJO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IFByb2plY3QuZGVmYXVsdFByb3BzO1xuICAgIGNvbnN0IHJvb3RQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF07XG4gICAgbGV0IHByb3BzID0gZGVmYXVsdFByb3BzO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLnByZXR0aWZ5VGl0bGUnKSkge1xuICAgICAgcHJvcHMudGl0bGUgPSBjaGFuZ2VDYXNlLnRpdGxlQ2FzZShwYXRoLmJhc2VuYW1lKHJvb3RQYXRoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMucHJvamVjdCAmJiB0aGlzLnByb3BzLnByb2plY3Quc291cmNlID09PSAnZmlsZScpIHtcbiAgICAgIGNvbnN0IHByb2plY3RQcm9wcyA9IHRoaXMucHJvcHMucHJvamVjdC5nZXRQcm9wcygpO1xuICAgICAgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9wcywgcHJvamVjdFByb3BzKTtcbiAgICB9XG5cbiAgICBjb25zdCB3cmFwcGVyU3R5bGUgPSB7XG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICB9O1xuXG4gICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICB3aWR0aDogJzUwMHB4JyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3dyYXBwZXJTdHlsZX0gY2xhc3NOYW1lPVwicHJvamVjdC1tYW5hZ2VyLWVkaXQgcGFkZGVkIG5hdGl2ZS1rZXktYmluZGluZ3NcIj5cbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGV9PlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJibG9jayBzZWN0aW9uLWhlYWRpbmdcIj57dGhpcy5nZXRUaXRsZSgpfTwvaDE+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJsb2NrXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiaW5wdXQtbGFiZWxcIj5UaXRsZTwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgcmVmPVwidGl0bGVcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImlucHV0LXRleHRcIiB2YWx1ZT17cHJvcHMudGl0bGV9IHRhYkluZGV4PVwiMFwiIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJsb2NrXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiaW5wdXQtbGFiZWxcIj5Hcm91cDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgcmVmPVwiZ3JvdXBcIiB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImlucHV0LXRleHRcIiB2YWx1ZT17cHJvcHMuZ3JvdXB9IHRhYkluZGV4PVwiMVwiIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJsb2NrXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiaW5wdXQtbGFiZWxcIj5JY29uPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCByZWY9XCJpY29uXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJpbnB1dC10ZXh0XCIgdmFsdWU9e3Byb3BzLmljb259IHRhYkluZGV4PVwiMlwiIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJsb2NrXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiaW5wdXQtbGFiZWxcIiBmb3I9XCJkZXZNb2RlXCI+RGV2ZWxvcG1lbnQgbW9kZTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHJlZj1cImRldk1vZGVcIlxuICAgICAgICAgICAgICAgIGlkPVwiZGV2TW9kZVwiXG4gICAgICAgICAgICAgICAgbmFtZT1cImRldk1vZGVcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5wdXQtdG9nZ2xlXCJcbiAgICAgICAgICAgICAgICBjaGVja2VkPXtwcm9wcy5kZXZNb2RlfVxuICAgICAgICAgICAgICAgIHRhYkluZGV4PVwiM1wiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJsb2NrXCIgc3R5bGU9e3sgdGV4dEFsaWduOiAncmlnaHQnIH19PlxuICAgICAgICAgICAgPGJ1dHRvbiByZWY9XCJzYXZlXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgdGFiSW5kZXg9XCI0XCI+U2F2ZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==