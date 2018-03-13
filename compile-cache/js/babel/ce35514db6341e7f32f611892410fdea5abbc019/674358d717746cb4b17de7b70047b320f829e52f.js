Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint "class-methods-use-this": ["error", {"exceptMethods": ["viewForItem"]}] */

var _atomSpacePenViews = require('atom-space-pen-views');

var _mobx = require('mobx');

var _underscorePlus = require('underscore-plus');

var _Manager = require('../Manager');

var _Manager2 = _interopRequireDefault(_Manager);

'use babel';
var ProjectsListView = (function (_SelectListView) {
  _inherits(ProjectsListView, _SelectListView);

  function ProjectsListView() {
    var _this = this;

    _classCallCheck(this, ProjectsListView);

    _get(Object.getPrototypeOf(ProjectsListView.prototype), 'constructor', this).call(this);

    (0, _mobx.autorun)('Loading projects for list view', function () {
      if (_this.panel && _this.panel.isVisible()) {
        _this.show(_Manager2['default'].projects);
      }
    });
  }

  _createClass(ProjectsListView, [{
    key: 'initialize',
    value: function initialize() {
      var _this2 = this;

      _get(Object.getPrototypeOf(ProjectsListView.prototype), 'initialize', this).call(this);
      this.addClass('project-manager');

      var infoText = 'shift+enter will open project in the current window';
      if (ProjectsListView.reversedConfirm) {
        infoText = 'shift+enter will open project in a new window';
      }
      var infoElement = document.createElement('div');
      infoElement.className = 'text-smaller';
      infoElement.innerHTML = infoText;
      this.error.after(infoElement);

      atom.commands.add(this.element, {
        'project-manager:alt-confirm': function projectManagerAltConfirm(event) {
          _this2.altConfirmed();
          event.stopPropagation();
        }
      });
    }
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var isFilterKey = ProjectsListView.possibleFilterKeys.includes(inputArr[0]);
      var filter = ProjectsListView.defaultFilterKey;

      if (inputArr.length > 1 && isFilterKey) {
        filter = inputArr[0];
      }

      return filter;
    }
  }, {
    key: 'getFilterQuery',
    value: function getFilterQuery() {
      var input = this.filterEditorView.getText();
      var inputArr = input.split(':');
      var filter = input;

      if (inputArr.length > 1) {
        filter = inputArr[1];
      }

      return filter;
    }
  }, {
    key: 'getEmptyMessage',
    value: function getEmptyMessage(itemCount, filteredItemCount) {
      if (itemCount === 0) {
        return 'No projects saved yet';
      }
      return _get(Object.getPrototypeOf(ProjectsListView.prototype), 'getEmptyMessage', this).call(this, itemCount, filteredItemCount);
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.panel && this.panel.isVisible()) {
        this.cancel();
      } else {
        this.show(_Manager2['default'].projects);
      }
    }
  }, {
    key: 'show',
    value: function show(projects) {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({ item: this });
      }

      this.storeFocusedElement();

      var sortedProjects = ProjectsListView.sortItems(projects);

      this.setItems(sortedProjects);
      this.focusFilterEditor();
    }
  }, {
    key: 'confirmed',
    value: function confirmed(project) {
      if (project) {
        _Manager.Manager.open(project, ProjectsListView.reversedConfirm);
        this.hide();
      }
    }
  }, {
    key: 'altConfirmed',
    value: function altConfirmed() {
      var project = this.getSelectedItem();
      if (project) {
        _Manager.Manager.open(project, !ProjectsListView.reversedConfirm);
        this.hide();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.panel) {
        this.panel.hide();
      }
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      _get(Object.getPrototypeOf(ProjectsListView.prototype), 'cancel', this).call(this);
    }
  }, {
    key: 'cancelled',
    value: function cancelled() {
      this.hide();
    }
  }, {
    key: 'viewForItem',
    value: function viewForItem(project) {
      var _project$props = project.props;
      var title = _project$props.title;
      var group = _project$props.group;
      var icon = _project$props.icon;
      var devMode = _project$props.devMode;
      var paths = _project$props.paths;

      var showPath = ProjectsListView.showPath;
      var projectMissing = !project.stats;

      return (0, _atomSpacePenViews.$$)(function itemView() {
        var _this3 = this;

        this.li({ 'class': 'two-lines' }, { 'data-path-missing': projectMissing }, function () {
          _this3.div({ 'class': 'primary-line' }, function () {
            if (devMode) {
              _this3.span({ 'class': 'project-manager-devmode' });
            }

            _this3.div({ 'class': 'icon ' + icon }, function () {
              _this3.span(title);
              if (group) {
                _this3.span({ 'class': 'project-manager-list-group' }, group);
              }
            });
          });
          _this3.div({ 'class': 'secondary-line' }, function () {
            if (projectMissing) {
              _this3.div({ 'class': 'icon icon-alert' }, 'Path is not available');
            } else if (showPath) {
              (0, _underscorePlus.each)(paths, function (path) {
                _this3.div({ 'class': 'no-icon' }, path);
              }, _this3);
            }
          });
        });
      });
    }
  }], [{
    key: 'sortItems',
    value: function sortItems(items) {
      var key = ProjectsListView.sortBy;
      var sorted = items;

      if (key === 'default') {
        return items;
      } else if (key === 'last modified') {
        sorted = items.sort(function (a, b) {
          var aModified = a.lastModified.getTime();
          var bModified = b.lastModified.getTime();

          return aModified > bModified ? -1 : 1;
        });
      } else {
        sorted = items.sort(function (a, b) {
          var aValue = (a[key] || '￿').toUpperCase();
          var bValue = (b[key] || '￿').toUpperCase();

          return aValue > bValue ? 1 : -1;
        });
      }

      return sorted;
    }
  }, {
    key: 'possibleFilterKeys',
    get: function get() {
      return ['title', 'group', 'template'];
    }
  }, {
    key: 'defaultFilterKey',
    get: function get() {
      return 'title';
    }
  }, {
    key: 'sortBy',
    get: function get() {
      return atom.config.get('project-manager.sortBy');
    }
  }, {
    key: 'showPath',
    get: function get() {
      return atom.config.get('project-manager.showPath');
    }
  }, {
    key: 'reversedConfirm',
    get: function get() {
      return atom.config.get('project-manager.alwaysOpenInSameWindow');
    }
  }]);

  return ProjectsListView;
})(_atomSpacePenViews.SelectListView);

exports['default'] = ProjectsListView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi92aWV3cy9wcm9qZWN0cy1saXN0LXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztpQ0FJbUMsc0JBQXNCOztvQkFDakMsTUFBTTs7OEJBQ1QsaUJBQWlCOzt1QkFDTCxZQUFZOzs7O0FBUDdDLFdBQVcsQ0FBQztJQVNTLGdCQUFnQjtZQUFoQixnQkFBZ0I7O0FBQ3hCLFdBRFEsZ0JBQWdCLEdBQ3JCOzs7MEJBREssZ0JBQWdCOztBQUVqQywrQkFGaUIsZ0JBQWdCLDZDQUV6Qjs7QUFFUix1QkFBUSxnQ0FBZ0MsRUFBRSxZQUFNO0FBQzlDLFVBQUksTUFBSyxLQUFLLElBQUksTUFBSyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDeEMsY0FBSyxJQUFJLENBQUMscUJBQVEsUUFBUSxDQUFDLENBQUM7T0FDN0I7S0FDRixDQUFDLENBQUM7R0FDSjs7ZUFUa0IsZ0JBQWdCOztXQVV6QixzQkFBRzs7O0FBQ1gsaUNBWGlCLGdCQUFnQiw0Q0FXZDtBQUNuQixVQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRWpDLFVBQUksUUFBUSxHQUFHLHFEQUFxRCxDQUFDO0FBQ3JFLFVBQUksZ0JBQWdCLENBQUMsZUFBZSxFQUFFO0FBQ3BDLGdCQUFRLEdBQUcsK0NBQStDLENBQUM7T0FDNUQ7QUFDRCxVQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xELGlCQUFXLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQztBQUN2QyxpQkFBVyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7QUFDakMsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTlCLFVBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVB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QUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBUSxDQUFBLENBQUUsV0FBVyxFQUFFLENBQUM7O0FBRWxELGlCQUFPLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ2pDLENBQUMsQ0FBQztPQUNKOztBQUVELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztTQTlKNEIsZUFBRztBQUM5QixhQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztLQUN2Qzs7O1NBRTBCLGVBQUc7QUFDNUIsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztTQUVnQixlQUFHO0FBQ2xCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUNsRDs7O1NBRWtCLGVBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0tBQ3BEOzs7U0FFeUIsZUFBRztBQUMzQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7S0FDbEU7OztTQWpEa0IsZ0JBQWdCOzs7cUJBQWhCLGdCQUFnQiIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvdmlld3MvcHJvamVjdHMtbGlzdC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qIGVzbGludCBcImNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcIjogW1wiZXJyb3JcIiwge1wiZXhjZXB0TWV0aG9kc1wiOiBbXCJ2aWV3Rm9ySXRlbVwiXX1dICovXG5cbmltcG9ydCB7IFNlbGVjdExpc3RWaWV3LCAkJCB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCB7IGF1dG9ydW4gfSBmcm9tICdtb2J4JztcbmltcG9ydCB7IGVhY2ggfSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuaW1wb3J0IG1hbmFnZXIsIHsgTWFuYWdlciB9IGZyb20gJy4uL01hbmFnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9qZWN0c0xpc3RWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgYXV0b3J1bignTG9hZGluZyBwcm9qZWN0cyBmb3IgbGlzdCB2aWV3JywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMucGFuZWwgJiYgdGhpcy5wYW5lbC5pc1Zpc2libGUoKSkge1xuICAgICAgICB0aGlzLnNob3cobWFuYWdlci5wcm9qZWN0cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5hZGRDbGFzcygncHJvamVjdC1tYW5hZ2VyJyk7XG5cbiAgICBsZXQgaW5mb1RleHQgPSAnc2hpZnQrZW50ZXIgd2lsbCBvcGVuIHByb2plY3QgaW4gdGhlIGN1cnJlbnQgd2luZG93JztcbiAgICBpZiAoUHJvamVjdHNMaXN0Vmlldy5yZXZlcnNlZENvbmZpcm0pIHtcbiAgICAgIGluZm9UZXh0ID0gJ3NoaWZ0K2VudGVyIHdpbGwgb3BlbiBwcm9qZWN0IGluIGEgbmV3IHdpbmRvdyc7XG4gICAgfVxuICAgIGNvbnN0IGluZm9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaW5mb0VsZW1lbnQuY2xhc3NOYW1lID0gJ3RleHQtc21hbGxlcic7XG4gICAgaW5mb0VsZW1lbnQuaW5uZXJIVE1MID0gaW5mb1RleHQ7XG4gICAgdGhpcy5lcnJvci5hZnRlcihpbmZvRWxlbWVudCk7XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICdwcm9qZWN0LW1hbmFnZXI6YWx0LWNvbmZpcm0nOiAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5hbHRDb25maXJtZWQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGdldCBwb3NzaWJsZUZpbHRlcktleXMoKSB7XG4gICAgcmV0dXJuIFsndGl0bGUnLCAnZ3JvdXAnLCAndGVtcGxhdGUnXTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGVmYXVsdEZpbHRlcktleSgpIHtcbiAgICByZXR1cm4gJ3RpdGxlJztcbiAgfVxuXG4gIHN0YXRpYyBnZXQgc29ydEJ5KCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5zb3J0QnknKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgc2hvd1BhdGgoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgncHJvamVjdC1tYW5hZ2VyLnNob3dQYXRoJyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHJldmVyc2VkQ29uZmlybSgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIuYWx3YXlzT3BlbkluU2FtZVdpbmRvdycpO1xuICB9XG5cbiAgZ2V0RmlsdGVyS2V5KCkge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5maWx0ZXJFZGl0b3JWaWV3LmdldFRleHQoKTtcbiAgICBjb25zdCBpbnB1dEFyciA9IGlucHV0LnNwbGl0KCc6Jyk7XG4gICAgY29uc3QgaXNGaWx0ZXJLZXkgPSBQcm9qZWN0c0xpc3RWaWV3LnBvc3NpYmxlRmlsdGVyS2V5cy5pbmNsdWRlcyhpbnB1dEFyclswXSk7XG4gICAgbGV0IGZpbHRlciA9IFByb2plY3RzTGlzdFZpZXcuZGVmYXVsdEZpbHRlcktleTtcblxuICAgIGlmIChpbnB1dEFyci5sZW5ndGggPiAxICYmIGlzRmlsdGVyS2V5KSB7XG4gICAgICBmaWx0ZXIgPSBpbnB1dEFyclswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgZ2V0RmlsdGVyUXVlcnkoKSB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmZpbHRlckVkaXRvclZpZXcuZ2V0VGV4dCgpO1xuICAgIGNvbnN0IGlucHV0QXJyID0gaW5wdXQuc3BsaXQoJzonKTtcbiAgICBsZXQgZmlsdGVyID0gaW5wdXQ7XG5cbiAgICBpZiAoaW5wdXRBcnIubGVuZ3RoID4gMSkge1xuICAgICAgZmlsdGVyID0gaW5wdXRBcnJbMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlcjtcbiAgfVxuXG4gIGdldEVtcHR5TWVzc2FnZShpdGVtQ291bnQsIGZpbHRlcmVkSXRlbUNvdW50KSB7XG4gICAgaWYgKGl0ZW1Db3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuICdObyBwcm9qZWN0cyBzYXZlZCB5ZXQnO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuZ2V0RW1wdHlNZXNzYWdlKGl0ZW1Db3VudCwgZmlsdGVyZWRJdGVtQ291bnQpO1xuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsICYmIHRoaXMucGFuZWwuaXNWaXNpYmxlKCkpIHtcbiAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvdyhtYW5hZ2VyLnByb2plY3RzKTtcbiAgICB9XG4gIH1cblxuICBzaG93KHByb2plY3RzKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgPT0gbnVsbCkge1xuICAgICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiB0aGlzIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcmVGb2N1c2VkRWxlbWVudCgpO1xuXG4gICAgY29uc3Qgc29ydGVkUHJvamVjdHMgPSBQcm9qZWN0c0xpc3RWaWV3LnNvcnRJdGVtcyhwcm9qZWN0cyk7XG5cbiAgICB0aGlzLnNldEl0ZW1zKHNvcnRlZFByb2plY3RzKTtcbiAgICB0aGlzLmZvY3VzRmlsdGVyRWRpdG9yKCk7XG4gIH1cblxuICBjb25maXJtZWQocHJvamVjdCkge1xuICAgIGlmIChwcm9qZWN0KSB7XG4gICAgICBNYW5hZ2VyLm9wZW4ocHJvamVjdCwgUHJvamVjdHNMaXN0Vmlldy5yZXZlcnNlZENvbmZpcm0pO1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgYWx0Q29uZmlybWVkKCkge1xuICAgIGNvbnN0IHByb2plY3QgPSB0aGlzLmdldFNlbGVjdGVkSXRlbSgpO1xuICAgIGlmIChwcm9qZWN0KSB7XG4gICAgICBNYW5hZ2VyLm9wZW4ocHJvamVjdCwgIVByb2plY3RzTGlzdFZpZXcucmV2ZXJzZWRDb25maXJtKTtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBzdXBlci5jYW5jZWwoKTtcbiAgfVxuXG4gIGNhbmNlbGxlZCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIHZpZXdGb3JJdGVtKHByb2plY3QpIHtcbiAgICBjb25zdCB7IHRpdGxlLCBncm91cCwgaWNvbiwgZGV2TW9kZSwgcGF0aHMgfSA9IHByb2plY3QucHJvcHM7XG4gICAgY29uc3Qgc2hvd1BhdGggPSBQcm9qZWN0c0xpc3RWaWV3LnNob3dQYXRoO1xuICAgIGNvbnN0IHByb2plY3RNaXNzaW5nID0gIXByb2plY3Quc3RhdHM7XG5cbiAgICByZXR1cm4gJCQoZnVuY3Rpb24gaXRlbVZpZXcoKSB7XG4gICAgICB0aGlzLmxpKHsgY2xhc3M6ICd0d28tbGluZXMnIH0sXG4gICAgICB7ICdkYXRhLXBhdGgtbWlzc2luZyc6IHByb2plY3RNaXNzaW5nIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ3ByaW1hcnktbGluZScgfSwgKCkgPT4ge1xuICAgICAgICAgIGlmIChkZXZNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLnNwYW4oeyBjbGFzczogJ3Byb2plY3QtbWFuYWdlci1kZXZtb2RlJyB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiBgaWNvbiAke2ljb259YCB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNwYW4odGl0bGUpO1xuICAgICAgICAgICAgaWYgKGdyb3VwKSB7XG4gICAgICAgICAgICAgIHRoaXMuc3Bhbih7IGNsYXNzOiAncHJvamVjdC1tYW5hZ2VyLWxpc3QtZ3JvdXAnIH0sIGdyb3VwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdzZWNvbmRhcnktbGluZScgfSwgKCkgPT4ge1xuICAgICAgICAgIGlmIChwcm9qZWN0TWlzc2luZykge1xuICAgICAgICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ2ljb24gaWNvbi1hbGVydCcgfSwgJ1BhdGggaXMgbm90IGF2YWlsYWJsZScpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2hvd1BhdGgpIHtcbiAgICAgICAgICAgIGVhY2gocGF0aHMsIChwYXRoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICduby1pY29uJyB9LCBwYXRoKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBzb3J0SXRlbXMoaXRlbXMpIHtcbiAgICBjb25zdCBrZXkgPSBQcm9qZWN0c0xpc3RWaWV3LnNvcnRCeTtcbiAgICBsZXQgc29ydGVkID0gaXRlbXM7XG5cbiAgICBpZiAoa2V5ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiBpdGVtcztcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2xhc3QgbW9kaWZpZWQnKSB7XG4gICAgICBzb3J0ZWQgPSBpdGVtcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFNb2RpZmllZCA9IGEubGFzdE1vZGlmaWVkLmdldFRpbWUoKTtcbiAgICAgICAgY29uc3QgYk1vZGlmaWVkID0gYi5sYXN0TW9kaWZpZWQuZ2V0VGltZSgpO1xuXG4gICAgICAgIHJldHVybiBhTW9kaWZpZWQgPiBiTW9kaWZpZWQgPyAtMSA6IDE7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc29ydGVkID0gaXRlbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBjb25zdCBhVmFsdWUgPSAoYVtrZXldIHx8ICdcXHVmZmZmJykudG9VcHBlckNhc2UoKTtcbiAgICAgICAgY29uc3QgYlZhbHVlID0gKGJba2V5XSB8fCAnXFx1ZmZmZicpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgcmV0dXJuIGFWYWx1ZSA+IGJWYWx1ZSA/IDEgOiAtMTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBzb3J0ZWQ7XG4gIH1cbn1cbiJdfQ==