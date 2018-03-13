Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.editComponent = editComponent;
exports.activate = activate;
exports.deactivate = deactivate;
exports.provideProjects = provideProjects;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mobx = require('mobx');

var _atom = require('atom');

var _Manager = require('./Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _viewsViewUri = require('./views/view-uri');

'use babel';

var disposables = null;
var projectsListView = null;
var FileStore = null;

function editComponent() {
  var EditView = require('./views/EditView');

  return new EditView({ project: _Manager2['default'].activeProject });
}

function activate() {
  var _this = this;

  disposables = new _atom.CompositeDisposable();

  disposables.add(atom.workspace.addOpener(function (uri) {
    if (uri === _viewsViewUri.EDIT_URI || uri === _viewsViewUri.SAVE_URI) {
      return editComponent();
    }

    return null;
  }));

  disposables.add(atom.commands.add('atom-workspace', {
    'project-manager:list-projects': function projectManagerListProjects() {
      if (!_this.projectsListView) {
        var ProjectsListView = require('./views/projects-list-view');

        projectsListView = new ProjectsListView();
      }

      projectsListView.toggle();
    },
    'project-manager:edit-projects': function projectManagerEditProjects() {
      if (!FileStore) {
        FileStore = require('./stores/FileStore');
      }

      atom.workspace.open(FileStore.getPath());
    },
    'project-manager:save-project': function projectManagerSaveProject() {
      atom.workspace.open(_viewsViewUri.SAVE_URI);
    },
    'project-manager:edit-project': function projectManagerEditProject() {
      atom.workspace.open(_viewsViewUri.EDIT_URI);
    },
    'project-manager:update-projects': function projectManagerUpdateProjects() {
      _Manager2['default'].fetchProjects();
    }
  }));
}

function deactivate() {
  disposables.dispose();
}

function provideProjects() {
  return {
    getProjects: function getProjects(callback) {
      (0, _mobx.autorun)(function () {
        callback(_Manager2['default'].projects);
      });
    },
    getProject: function getProject(callback) {
      (0, _mobx.autorun)(function () {
        callback(_Manager2['default'].activeProject);
      });
    },
    saveProject: function saveProject(project) {
      _Manager2['default'].saveProject(project);
    },
    openProject: function openProject(project) {
      _Manager2['default'].open(project);
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9wcm9qZWN0LW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFd0IsTUFBTTs7b0JBQ00sTUFBTTs7dUJBQ3RCLFdBQVc7Ozs7NEJBQ0ksa0JBQWtCOztBQUxyRCxXQUFXLENBQUM7O0FBT1osSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFZCxTQUFTLGFBQWEsR0FBRztBQUM5QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFN0MsU0FBTyxJQUFJLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxxQkFBUSxhQUFhLEVBQUUsQ0FBQyxDQUFDO0NBQ3pEOztBQUVNLFNBQVMsUUFBUSxHQUFHOzs7QUFDekIsYUFBVyxHQUFHLCtCQUF5QixDQUFDOztBQUV4QyxhQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ2hELFFBQUksR0FBRywyQkFBYSxJQUFJLEdBQUcsMkJBQWEsRUFBRTtBQUN4QyxhQUFPLGFBQWEsRUFBRSxDQUFDO0tBQ3hCOztBQUVELFdBQU8sSUFBSSxDQUFDO0dBQ2IsQ0FBQyxDQUFDLENBQUM7O0FBRUosYUFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUNsRCxtQ0FBK0IsRUFBRSxzQ0FBTTtBQUNyQyxVQUFJLENBQUMsTUFBSyxnQkFBZ0IsRUFBRTtBQUMxQixZQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUUvRCx3QkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7T0FDM0M7O0FBRUQsc0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDM0I7QUFDRCxtQ0FBK0IsRUFBRSxzQ0FBTTtBQUNyQyxVQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2QsaUJBQVMsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztPQUMzQzs7QUFFRCxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUMxQztBQUNELGtDQUE4QixFQUFFLHFDQUFNO0FBQ3BDLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSx3QkFBVSxDQUFDO0tBQy9CO0FBQ0Qsa0NBQThCLEVBQUUscUNBQU07QUFDcEMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHdCQUFVLENBQUM7S0FDL0I7QUFDRCxxQ0FBaUMsRUFBRSx3Q0FBTTtBQUN2QywyQkFBUSxhQUFhLEVBQUUsQ0FBQztLQUN6QjtHQUNGLENBQUMsQ0FBQyxDQUFDO0NBQ0w7O0FBRU0sU0FBUyxVQUFVLEdBQUc7QUFDM0IsYUFBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0NBQ3ZCOztBQUVNLFNBQVMsZUFBZSxHQUFHO0FBQ2hDLFNBQU87QUFDTCxlQUFXLEVBQUUscUJBQUMsUUFBUSxFQUFLO0FBQ3pCLHlCQUFRLFlBQU07QUFDWixnQkFBUSxDQUFDLHFCQUFRLFFBQVEsQ0FBQyxDQUFDO09BQzVCLENBQUMsQ0FBQztLQUNKO0FBQ0QsY0FBVSxFQUFFLG9CQUFDLFFBQVEsRUFBSztBQUN4Qix5QkFBUSxZQUFNO0FBQ1osZ0JBQVEsQ0FBQyxxQkFBUSxhQUFhLENBQUMsQ0FBQztPQUNqQyxDQUFDLENBQUM7S0FDSjtBQUNELGVBQVcsRUFBRSxxQkFBQyxPQUFPLEVBQUs7QUFDeEIsMkJBQVEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzlCO0FBQ0QsZUFBVyxFQUFFLHFCQUFDLE9BQU8sRUFBSztBQUN4QiwyQkFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDdkI7R0FDRixDQUFDO0NBQ0giLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL3Byb2plY3QtbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBhdXRvcnVuIH0gZnJvbSAnbW9ieCc7XG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL01hbmFnZXInO1xuaW1wb3J0IHsgU0FWRV9VUkksIEVESVRfVVJJIH0gZnJvbSAnLi92aWV3cy92aWV3LXVyaSc7XG5cbmxldCBkaXNwb3NhYmxlcyA9IG51bGw7XG5sZXQgcHJvamVjdHNMaXN0VmlldyA9IG51bGw7XG5sZXQgRmlsZVN0b3JlID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGVkaXRDb21wb25lbnQoKSB7XG4gIGNvbnN0IEVkaXRWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9FZGl0VmlldycpO1xuXG4gIHJldHVybiBuZXcgRWRpdFZpZXcoeyBwcm9qZWN0OiBtYW5hZ2VyLmFjdGl2ZVByb2plY3QgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gIGRpc3Bvc2FibGVzLmFkZChhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIoKHVyaSkgPT4ge1xuICAgIGlmICh1cmkgPT09IEVESVRfVVJJIHx8IHVyaSA9PT0gU0FWRV9VUkkpIHtcbiAgICAgIHJldHVybiBlZGl0Q29tcG9uZW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0pKTtcblxuICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICdwcm9qZWN0LW1hbmFnZXI6bGlzdC1wcm9qZWN0cyc6ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5wcm9qZWN0c0xpc3RWaWV3KSB7XG4gICAgICAgIGNvbnN0IFByb2plY3RzTGlzdFZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL3Byb2plY3RzLWxpc3QtdmlldycpO1xuXG4gICAgICAgIHByb2plY3RzTGlzdFZpZXcgPSBuZXcgUHJvamVjdHNMaXN0VmlldygpO1xuICAgICAgfVxuXG4gICAgICBwcm9qZWN0c0xpc3RWaWV3LnRvZ2dsZSgpO1xuICAgIH0sXG4gICAgJ3Byb2plY3QtbWFuYWdlcjplZGl0LXByb2plY3RzJzogKCkgPT4ge1xuICAgICAgaWYgKCFGaWxlU3RvcmUpIHtcbiAgICAgICAgRmlsZVN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZXMvRmlsZVN0b3JlJyk7XG4gICAgICB9XG5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oRmlsZVN0b3JlLmdldFBhdGgoKSk7XG4gICAgfSxcbiAgICAncHJvamVjdC1tYW5hZ2VyOnNhdmUtcHJvamVjdCc6ICgpID0+IHtcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oU0FWRV9VUkkpO1xuICAgIH0sXG4gICAgJ3Byb2plY3QtbWFuYWdlcjplZGl0LXByb2plY3QnOiAoKSA9PiB7XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKEVESVRfVVJJKTtcbiAgICB9LFxuICAgICdwcm9qZWN0LW1hbmFnZXI6dXBkYXRlLXByb2plY3RzJzogKCkgPT4ge1xuICAgICAgbWFuYWdlci5mZXRjaFByb2plY3RzKCk7XG4gICAgfSxcbiAgfSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZVByb2plY3RzKCkge1xuICByZXR1cm4ge1xuICAgIGdldFByb2plY3RzOiAoY2FsbGJhY2spID0+IHtcbiAgICAgIGF1dG9ydW4oKCkgPT4ge1xuICAgICAgICBjYWxsYmFjayhtYW5hZ2VyLnByb2plY3RzKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0UHJvamVjdDogKGNhbGxiYWNrKSA9PiB7XG4gICAgICBhdXRvcnVuKCgpID0+IHtcbiAgICAgICAgY2FsbGJhY2sobWFuYWdlci5hY3RpdmVQcm9qZWN0KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgc2F2ZVByb2plY3Q6IChwcm9qZWN0KSA9PiB7XG4gICAgICBtYW5hZ2VyLnNhdmVQcm9qZWN0KHByb2plY3QpO1xuICAgIH0sXG4gICAgb3BlblByb2plY3Q6IChwcm9qZWN0KSA9PiB7XG4gICAgICBtYW5hZ2VyLm9wZW4ocHJvamVjdCk7XG4gICAgfSxcbiAgfTtcbn1cbiJdfQ==