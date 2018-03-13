Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

'use babel';

exports['default'] = {

  config: {
    expandedWidth: {
      title: 'Focused Pane Width',
      description: 'Sets the Percentage between 0 and 100 of how much the focused pane will grow',
      type: 'integer',
      'default': 94,
      minimum: 1,
      maximum: 100
    },
    focusDelay: {
      title: 'Delay (in Follow Mode)',
      description: 'If you\'re in follow mode, this delay (in ms) will be applied before the focused pane will grow',
      type: 'integer',
      'default': 0,
      minimum: 0
    }
  },

  subscriptions: null,
  FollowObserver: null,
  modifiedPanes: [],
  incompatiblePlugins: [],
  isFocused: false,

  activate: function activate(state) {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.packages.onDidActivatePackage(this.checkIncompatibility.bind(this)));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'hey-pane:toggle-focus-of-active-pane': function heyPaneToggleFocusOfActivePane() {
        return _this.toggleFocus();
      },
      'hey-pane:toggle-follow-mode': function heyPaneToggleFollowMode() {
        return _this.toggleFollow();
      }
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
    this.FollowObserver != null && this.FollowObserver.dispose();
  },

  toggleFollow: function toggleFollow() {
    var _this2 = this;

    if (this.FollowObserver != null) {
      this.FollowObserver.dispose();
      this.FollowObserver = null;
      return;
    }

    this.FollowObserver = atom.workspace.onDidStopChangingActivePaneItem(function (pane) {
      return _this2.startFollow();
    });
  },

  startFollow: function startFollow() {
    var _this3 = this;

    var delay = atom.config.get('hey-pane.focusDelay');

    // Only use setTimeout if the delay is bigger than 0.
    // I'm not quite sure if this is necessary, but waiting for the next tick
    // COULD MAYBE change behavior for existing users, so
    // ... better safe than sorry.
    if (delay > 0) {
      clearTimeout(this.focusTimeout);
      this.focusTimeout = setTimeout(function () {
        _this3.undoFocus();
        _this3.doFocus();
      }, delay);
    } else {
      this.undoFocus();
      this.doFocus();
    }
  },

  toggleFocus: function toggleFocus() {
    if (this.isFocused) this.undoFocus();else this.doFocus();
  },

  doFocus: function doFocus() {
    var _this4 = this;

    this.isFocused = true;
    var activePane = atom.workspace.getActivePane();

    // For custom styling possibilities.
    // Check if element is available for API < 1.17.
    activePane.element && activePane.element.classList.add('hey-pane-focus');

    var expandedWidth = atom.config.get('hey-pane.expandedWidth') / 100;
    var collapsedWidth = 1 - expandedWidth;
    var paneRoot = atom.workspace.getCenter().paneContainer.getRoot();

    // Recursive set expanded-/collapsedWidth on Panes or PaneAxes.
    // PaneAxes are nested into each other. There is a single parent axis.
    // We go from a pane all the way down until we're at the parent axis.
    var resursiveSet = function resursiveSet(pane) {
      // Only do something, if the pane is a child of an axis.
      // A pane has no axis, if there are no split windows.
      if (pane.getParent().constructor.name === 'PaneAxis') {
        // Expand the pane...
        _this4.savePaneState(pane).setFlexScale(expandedWidth);

        // ...and collapse all its siblings.
        pane.getParent().children.filter(function (el) {
          return el !== pane;
        }) // bcuz only siblings
        .forEach(function (sibling) {
          _this4.savePaneState(sibling).setFlexScale(collapsedWidth);
        });

        // Do the same with the adjacent panes, until we're on the root axis.
        if (pane.getParent() !== paneRoot) {
          resursiveSet(pane.getParent());
        }
      }
    };

    // shoot da lazr
    resursiveSet(activePane);
  },

  undoFocus: function undoFocus() {
    this.isFocused = false;
    this.restorePanes();
    this.emptyPaneStates();
  },

  // Saves the pane and its flexScale for later restoring.
  // IDs would be nicer, but I couldn't find a way to search a pane or axis by
  // its ID.
  // Note: `pane` can be an instanceof Pane or PaneAxis.
  //   I treat them basically as the same.
  savePaneState: function savePaneState(pane) {
    this.modifiedPanes.push({ pane: pane, flexScale: pane.flexScale });
    return pane;
  },

  restorePanes: function restorePanes() {
    this.modifiedPanes.forEach(function (_ref) {
      var pane = _ref.pane;
      var flexScale = _ref.flexScale;

      if (!pane.isAlive()) return; // pane is dead: loop continue
      pane.element && pane.element.classList.remove('hey-pane-focus');
      pane.setFlexScale(flexScale);
    });
  },

  emptyPaneStates: function emptyPaneStates() {
    this.modifiedPanes = [];
  },

  checkIncompatibility: function checkIncompatibility(plugin) {
    if (this.incompatiblePlugins.includes(plugin.name)) {
      atom.notifications.addError('Incompatible Package Detected', {
        dismissable: true,
        detail: 'hey-pane does not work when package "' + plugin.name + '" is activated.'
      });
    }
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvaGV5LXBhbmUvbGliL2hleS1wYW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRW9DLE1BQU07O0FBRjFDLFdBQVcsQ0FBQTs7cUJBSUk7O0FBRWIsUUFBTSxFQUFFO0FBQ04saUJBQWEsRUFBRTtBQUNiLFdBQUssRUFBRSxvQkFBb0I7QUFDM0IsaUJBQVcsRUFBRSw4RUFBOEU7QUFDM0YsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxFQUFFO0FBQ1gsYUFBTyxFQUFFLENBQUM7QUFDVixhQUFPLEVBQUUsR0FBRztLQUNiO0FBQ0QsY0FBVSxFQUFFO0FBQ1YsV0FBSyxFQUFFLHdCQUF3QjtBQUMvQixpQkFBVyxFQUFFLGlHQUFpRztBQUM5RyxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLENBQUM7QUFDVixhQUFPLEVBQUUsQ0FBQztLQUNYO0dBQ0Y7O0FBRUQsZUFBYSxFQUFFLElBQUk7QUFDbkIsZ0JBQWMsRUFBRSxJQUFJO0FBQ3BCLGVBQWEsRUFBRSxFQUFFO0FBQ2pCLHFCQUFtQixFQUFFLEVBQUU7QUFDdkIsV0FBUyxFQUFFLEtBQUs7O0FBRWhCLFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7OztBQUNkLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQ3ZELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUV4QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCw0Q0FBc0MsRUFBRTtlQUFNLE1BQUssV0FBVyxFQUFFO09BQUE7QUFDaEUsbUNBQTZCLEVBQUU7ZUFBTSxNQUFLLFlBQVksRUFBRTtPQUFBO0tBQ3pELENBQUMsQ0FBQyxDQUFBO0dBQ0o7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixRQUFJLENBQUMsY0FBYyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQzdEOztBQUVELGNBQVksRUFBQSx3QkFBRzs7O0FBQ2IsUUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksRUFBRTtBQUMvQixVQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzdCLFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFBO0FBQzFCLGFBQU07S0FDUDs7QUFFRCxRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQ2pDLCtCQUErQixDQUFDLFVBQUEsSUFBSTthQUFJLE9BQUssV0FBVyxFQUFFO0tBQUEsQ0FBQyxDQUFBO0dBQy9EOztBQUVELGFBQVcsRUFBQSx1QkFBRzs7O0FBQ1osUUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQTs7Ozs7O0FBTXBELFFBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtBQUNiLGtCQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQy9CLFVBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFlBQU07QUFDbkMsZUFBSyxTQUFTLEVBQUUsQ0FBQTtBQUNoQixlQUFLLE9BQU8sRUFBRSxDQUFBO09BQ2YsRUFBRSxLQUFLLENBQUMsQ0FBQTtLQUNWLE1BQU07QUFDTCxVQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDaEIsVUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ2Y7R0FDRjs7QUFFRCxhQUFXLEVBQUEsdUJBQUc7QUFDWixRQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBLEtBQy9CLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUNwQjs7QUFFRCxTQUFPLEVBQUEsbUJBQUc7OztBQUNSLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ3JCLFFBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUE7Ozs7QUFJakQsY0FBVSxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTs7QUFFeEUsUUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsR0FBRyxHQUFHLENBQUE7QUFDckUsUUFBTSxjQUFjLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQTtBQUN4QyxRQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTs7Ozs7QUFLbkUsUUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQUksSUFBSSxFQUFLOzs7QUFHN0IsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7O0FBRXBELGVBQUssYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQTs7O0FBR3BELFlBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQ3RCLE1BQU0sQ0FBQyxVQUFBLEVBQUU7aUJBQUksRUFBRSxLQUFLLElBQUk7U0FBQSxDQUFDO1NBQ3pCLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUNsQixpQkFBSyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1NBQ3pELENBQUMsQ0FBQTs7O0FBR0osWUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssUUFBUSxFQUFFO0FBQ2pDLHNCQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUE7U0FDL0I7T0FDRjtLQUNGLENBQUE7OztBQUdELGdCQUFZLENBQUMsVUFBVSxDQUFDLENBQUE7R0FDekI7O0FBRUQsV0FBUyxFQUFBLHFCQUFHO0FBQ1YsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUE7QUFDdEIsUUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0FBQ25CLFFBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTtHQUN2Qjs7Ozs7OztBQU9ELGVBQWEsRUFBQSx1QkFBQyxJQUFJLEVBQUU7QUFDbEIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtBQUM1RCxXQUFPLElBQUksQ0FBQTtHQUNaOztBQUVELGNBQVksRUFBQSx3QkFBRztBQUNiLFFBQUksQ0FBQyxhQUFhLENBQ2YsT0FBTyxDQUFDLFVBQUMsSUFBbUIsRUFBSztVQUF0QixJQUFJLEdBQU4sSUFBbUIsQ0FBakIsSUFBSTtVQUFFLFNBQVMsR0FBakIsSUFBbUIsQ0FBWCxTQUFTOztBQUN6QixVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLE9BQU07QUFDM0IsVUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUMvRCxVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0tBQzdCLENBQUMsQ0FBQTtHQUNMOztBQUVELGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUE7R0FDeEI7O0FBRUQsc0JBQW9CLEVBQUEsOEJBQUMsTUFBTSxFQUFFO0FBQzNCLFFBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbEQsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsK0JBQStCLEVBQ3pEO0FBQ0UsbUJBQVcsRUFBRSxJQUFJO0FBQ2pCLGNBQU0sNENBQTBDLE1BQU0sQ0FBQyxJQUFJLG9CQUFpQjtPQUM3RSxDQUNGLENBQUE7S0FDRjtHQUNGOztDQUVGIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvaGV5LXBhbmUvbGliL2hleS1wYW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBjb25maWc6IHtcbiAgICBleHBhbmRlZFdpZHRoOiB7XG4gICAgICB0aXRsZTogJ0ZvY3VzZWQgUGFuZSBXaWR0aCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1NldHMgdGhlIFBlcmNlbnRhZ2UgYmV0d2VlbiAwIGFuZCAxMDAgb2YgaG93IG11Y2ggdGhlIGZvY3VzZWQgcGFuZSB3aWxsIGdyb3cnLFxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogOTQsXG4gICAgICBtaW5pbXVtOiAxLFxuICAgICAgbWF4aW11bTogMTAwXG4gICAgfSxcbiAgICBmb2N1c0RlbGF5OiB7XG4gICAgICB0aXRsZTogJ0RlbGF5IChpbiBGb2xsb3cgTW9kZSknLFxuICAgICAgZGVzY3JpcHRpb246ICdJZiB5b3VcXCdyZSBpbiBmb2xsb3cgbW9kZSwgdGhpcyBkZWxheSAoaW4gbXMpIHdpbGwgYmUgYXBwbGllZCBiZWZvcmUgdGhlIGZvY3VzZWQgcGFuZSB3aWxsIGdyb3cnLFxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICAgIG1pbmltdW06IDBcbiAgICB9XG4gIH0sXG5cbiAgc3Vic2NyaXB0aW9uczogbnVsbCxcbiAgRm9sbG93T2JzZXJ2ZXI6IG51bGwsXG4gIG1vZGlmaWVkUGFuZXM6IFtdLFxuICBpbmNvbXBhdGlibGVQbHVnaW5zOiBbXSxcbiAgaXNGb2N1c2VkOiBmYWxzZSxcblxuICBhY3RpdmF0ZShzdGF0ZSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlUGFja2FnZShcbiAgICAgIHRoaXMuY2hlY2tJbmNvbXBhdGliaWxpdHkuYmluZCh0aGlzKSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdoZXktcGFuZTp0b2dnbGUtZm9jdXMtb2YtYWN0aXZlLXBhbmUnOiAoKSA9PiB0aGlzLnRvZ2dsZUZvY3VzKCksXG4gICAgICAnaGV5LXBhbmU6dG9nZ2xlLWZvbGxvdy1tb2RlJzogKCkgPT4gdGhpcy50b2dnbGVGb2xsb3coKVxuICAgIH0pKVxuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuRm9sbG93T2JzZXJ2ZXIgIT0gbnVsbCAmJiB0aGlzLkZvbGxvd09ic2VydmVyLmRpc3Bvc2UoKVxuICB9LFxuXG4gIHRvZ2dsZUZvbGxvdygpIHtcbiAgICBpZiAodGhpcy5Gb2xsb3dPYnNlcnZlciAhPSBudWxsKSB7XG4gICAgICB0aGlzLkZvbGxvd09ic2VydmVyLmRpc3Bvc2UoKVxuICAgICAgdGhpcy5Gb2xsb3dPYnNlcnZlciA9IG51bGxcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuRm9sbG93T2JzZXJ2ZXIgPSBhdG9tLndvcmtzcGFjZVxuICAgICAgLm9uRGlkU3RvcENoYW5naW5nQWN0aXZlUGFuZUl0ZW0ocGFuZSA9PiB0aGlzLnN0YXJ0Rm9sbG93KCkpXG4gIH0sXG5cbiAgc3RhcnRGb2xsb3coKSB7XG4gICAgY29uc3QgZGVsYXkgPSBhdG9tLmNvbmZpZy5nZXQoJ2hleS1wYW5lLmZvY3VzRGVsYXknKVxuXG4gICAgLy8gT25seSB1c2Ugc2V0VGltZW91dCBpZiB0aGUgZGVsYXkgaXMgYmlnZ2VyIHRoYW4gMC5cbiAgICAvLyBJJ20gbm90IHF1aXRlIHN1cmUgaWYgdGhpcyBpcyBuZWNlc3NhcnksIGJ1dCB3YWl0aW5nIGZvciB0aGUgbmV4dCB0aWNrXG4gICAgLy8gQ09VTEQgTUFZQkUgY2hhbmdlIGJlaGF2aW9yIGZvciBleGlzdGluZyB1c2Vycywgc29cbiAgICAvLyAuLi4gYmV0dGVyIHNhZmUgdGhhbiBzb3JyeS5cbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5mb2N1c1RpbWVvdXQpXG4gICAgICB0aGlzLmZvY3VzVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnVuZG9Gb2N1cygpXG4gICAgICAgIHRoaXMuZG9Gb2N1cygpXG4gICAgICB9LCBkZWxheSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51bmRvRm9jdXMoKVxuICAgICAgdGhpcy5kb0ZvY3VzKClcbiAgICB9XG4gIH0sXG5cbiAgdG9nZ2xlRm9jdXMoKSB7XG4gICAgaWYgKHRoaXMuaXNGb2N1c2VkKSB0aGlzLnVuZG9Gb2N1cygpXG4gICAgZWxzZSB0aGlzLmRvRm9jdXMoKVxuICB9LFxuXG4gIGRvRm9jdXMoKSB7XG4gICAgdGhpcy5pc0ZvY3VzZWQgPSB0cnVlXG4gICAgY29uc3QgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuXG4gICAgLy8gRm9yIGN1c3RvbSBzdHlsaW5nIHBvc3NpYmlsaXRpZXMuXG4gICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBhdmFpbGFibGUgZm9yIEFQSSA8IDEuMTcuXG4gICAgYWN0aXZlUGFuZS5lbGVtZW50ICYmIGFjdGl2ZVBhbmUuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoZXktcGFuZS1mb2N1cycpXG5cbiAgICBjb25zdCBleHBhbmRlZFdpZHRoID0gYXRvbS5jb25maWcuZ2V0KCdoZXktcGFuZS5leHBhbmRlZFdpZHRoJykgLyAxMDBcbiAgICBjb25zdCBjb2xsYXBzZWRXaWR0aCA9IDEgLSBleHBhbmRlZFdpZHRoXG4gICAgY29uc3QgcGFuZVJvb3QgPSBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5wYW5lQ29udGFpbmVyLmdldFJvb3QoKVxuXG4gICAgLy8gUmVjdXJzaXZlIHNldCBleHBhbmRlZC0vY29sbGFwc2VkV2lkdGggb24gUGFuZXMgb3IgUGFuZUF4ZXMuXG4gICAgLy8gUGFuZUF4ZXMgYXJlIG5lc3RlZCBpbnRvIGVhY2ggb3RoZXIuIFRoZXJlIGlzIGEgc2luZ2xlIHBhcmVudCBheGlzLlxuICAgIC8vIFdlIGdvIGZyb20gYSBwYW5lIGFsbCB0aGUgd2F5IGRvd24gdW50aWwgd2UncmUgYXQgdGhlIHBhcmVudCBheGlzLlxuICAgIGNvbnN0IHJlc3Vyc2l2ZVNldCA9IChwYW5lKSA9PiB7XG4gICAgICAvLyBPbmx5IGRvIHNvbWV0aGluZywgaWYgdGhlIHBhbmUgaXMgYSBjaGlsZCBvZiBhbiBheGlzLlxuICAgICAgLy8gQSBwYW5lIGhhcyBubyBheGlzLCBpZiB0aGVyZSBhcmUgbm8gc3BsaXQgd2luZG93cy5cbiAgICAgIGlmIChwYW5lLmdldFBhcmVudCgpLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdQYW5lQXhpcycpIHtcbiAgICAgICAgLy8gRXhwYW5kIHRoZSBwYW5lLi4uXG4gICAgICAgIHRoaXMuc2F2ZVBhbmVTdGF0ZShwYW5lKS5zZXRGbGV4U2NhbGUoZXhwYW5kZWRXaWR0aClcblxuICAgICAgICAvLyAuLi5hbmQgY29sbGFwc2UgYWxsIGl0cyBzaWJsaW5ncy5cbiAgICAgICAgcGFuZS5nZXRQYXJlbnQoKS5jaGlsZHJlblxuICAgICAgICAgIC5maWx0ZXIoZWwgPT4gZWwgIT09IHBhbmUpIC8vIGJjdXogb25seSBzaWJsaW5nc1xuICAgICAgICAgIC5mb3JFYWNoKHNpYmxpbmcgPT4ge1xuICAgICAgICAgICAgdGhpcy5zYXZlUGFuZVN0YXRlKHNpYmxpbmcpLnNldEZsZXhTY2FsZShjb2xsYXBzZWRXaWR0aClcbiAgICAgICAgICB9KVxuXG4gICAgICAgIC8vIERvIHRoZSBzYW1lIHdpdGggdGhlIGFkamFjZW50IHBhbmVzLCB1bnRpbCB3ZSdyZSBvbiB0aGUgcm9vdCBheGlzLlxuICAgICAgICBpZiAocGFuZS5nZXRQYXJlbnQoKSAhPT0gcGFuZVJvb3QpIHtcbiAgICAgICAgICByZXN1cnNpdmVTZXQocGFuZS5nZXRQYXJlbnQoKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNob290IGRhIGxhenJcbiAgICByZXN1cnNpdmVTZXQoYWN0aXZlUGFuZSlcbiAgfSxcblxuICB1bmRvRm9jdXMoKSB7XG4gICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZVxuICAgIHRoaXMucmVzdG9yZVBhbmVzKClcbiAgICB0aGlzLmVtcHR5UGFuZVN0YXRlcygpXG4gIH0sXG5cbiAgLy8gU2F2ZXMgdGhlIHBhbmUgYW5kIGl0cyBmbGV4U2NhbGUgZm9yIGxhdGVyIHJlc3RvcmluZy5cbiAgLy8gSURzIHdvdWxkIGJlIG5pY2VyLCBidXQgSSBjb3VsZG4ndCBmaW5kIGEgd2F5IHRvIHNlYXJjaCBhIHBhbmUgb3IgYXhpcyBieVxuICAvLyBpdHMgSUQuXG4gIC8vIE5vdGU6IGBwYW5lYCBjYW4gYmUgYW4gaW5zdGFuY2VvZiBQYW5lIG9yIFBhbmVBeGlzLlxuICAvLyAgIEkgdHJlYXQgdGhlbSBiYXNpY2FsbHkgYXMgdGhlIHNhbWUuXG4gIHNhdmVQYW5lU3RhdGUocGFuZSkge1xuICAgIHRoaXMubW9kaWZpZWRQYW5lcy5wdXNoKHsgcGFuZSwgZmxleFNjYWxlOiBwYW5lLmZsZXhTY2FsZSB9KVxuICAgIHJldHVybiBwYW5lXG4gIH0sXG5cbiAgcmVzdG9yZVBhbmVzKCkge1xuICAgIHRoaXMubW9kaWZpZWRQYW5lc1xuICAgICAgLmZvckVhY2goKHsgcGFuZSwgZmxleFNjYWxlIH0pID0+IHtcbiAgICAgICAgaWYgKCFwYW5lLmlzQWxpdmUoKSkgcmV0dXJuIC8vIHBhbmUgaXMgZGVhZDogbG9vcCBjb250aW51ZVxuICAgICAgICBwYW5lLmVsZW1lbnQgJiYgcGFuZS5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hleS1wYW5lLWZvY3VzJylcbiAgICAgICAgcGFuZS5zZXRGbGV4U2NhbGUoZmxleFNjYWxlKVxuICAgICAgfSlcbiAgfSxcblxuICBlbXB0eVBhbmVTdGF0ZXMoKSB7XG4gICAgdGhpcy5tb2RpZmllZFBhbmVzID0gW11cbiAgfSxcblxuICBjaGVja0luY29tcGF0aWJpbGl0eShwbHVnaW4pIHtcbiAgICBpZiAodGhpcy5pbmNvbXBhdGlibGVQbHVnaW5zLmluY2x1ZGVzKHBsdWdpbi5uYW1lKSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdJbmNvbXBhdGlibGUgUGFja2FnZSBEZXRlY3RlZCcsXG4gICAgICAgIHtcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICBkZXRhaWw6IGBoZXktcGFuZSBkb2VzIG5vdCB3b3JrIHdoZW4gcGFja2FnZSBcIiR7cGx1Z2luLm5hbWV9XCIgaXMgYWN0aXZhdGVkLmBcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG59O1xuIl19