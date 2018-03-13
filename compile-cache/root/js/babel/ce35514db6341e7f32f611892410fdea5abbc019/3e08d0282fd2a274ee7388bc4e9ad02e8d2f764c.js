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
    this.undoFocus();
    this.doFocus();
  },

  toggleFocus: function toggleFocus() {
    if (this.isFocused) this.undoFocus();else this.doFocus();
  },

  doFocus: function doFocus() {
    var _this3 = this;

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
        _this3.savePaneState(pane).setFlexScale(expandedWidth);

        // ...and collapse all its siblings.
        pane.getParent().children.filter(function (el) {
          return el !== pane;
        }) // bcuz only siblings
        .forEach(function (sibling) {
          _this3.savePaneState(sibling).setFlexScale(collapsedWidth);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvaGV5LXBhbmUvbGliL2hleS1wYW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRW9DLE1BQU07O0FBRjFDLFdBQVcsQ0FBQTs7cUJBSUk7O0FBRWIsUUFBTSxFQUFFO0FBQ04saUJBQWEsRUFBRTtBQUNiLFdBQUssRUFBRSxvQkFBb0I7QUFDM0IsaUJBQVcsRUFBRSw4RUFBOEU7QUFDM0YsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxFQUFFO0FBQ1gsYUFBTyxFQUFFLENBQUM7QUFDVixhQUFPLEVBQUUsR0FBRztLQUNiO0dBQ0Y7O0FBRUQsZUFBYSxFQUFFLElBQUk7QUFDbkIsZ0JBQWMsRUFBRSxJQUFJO0FBQ3BCLGVBQWEsRUFBRSxFQUFFO0FBQ2pCLHFCQUFtQixFQUFFLEVBQUU7QUFDdkIsV0FBUyxFQUFFLEtBQUs7O0FBRWhCLFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7OztBQUNkLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQ3ZELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUV4QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCw0Q0FBc0MsRUFBRTtlQUFNLE1BQUssV0FBVyxFQUFFO09BQUE7QUFDaEUsbUNBQTZCLEVBQUU7ZUFBTSxNQUFLLFlBQVksRUFBRTtPQUFBO0tBQ3pELENBQUMsQ0FBQyxDQUFBO0dBQ0o7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixRQUFJLENBQUMsY0FBYyxJQUFJ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TyxDQUFDLFVBQUMsSUFBbUIsRUFBSztVQUF0QixJQUFJLEdBQU4sSUFBbUIsQ0FBakIsSUFBSTtVQUFFLFNBQVMsR0FBakIsSUFBbUIsQ0FBWCxTQUFTOztBQUN6QixVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLE9BQU07QUFDM0IsVUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUMvRCxVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0tBQzdCLENBQUMsQ0FBQTtHQUNMOztBQUVELGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUE7R0FDeEI7O0FBRUQsc0JBQW9CLEVBQUEsOEJBQUMsTUFBTSxFQUFFO0FBQzNCLFFBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbEQsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsK0JBQStCLEVBQ3pEO0FBQ0UsbUJBQVcsRUFBRSxJQUFJO0FBQ2pCLGNBQU0sNENBQTBDLE1BQU0sQ0FBQyxJQUFJLG9CQUFpQjtPQUM3RSxDQUNGLENBQUE7S0FDRjtHQUNGOztDQUVGIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvaGV5LXBhbmUvbGliL2hleS1wYW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBjb25maWc6IHtcbiAgICBleHBhbmRlZFdpZHRoOiB7XG4gICAgICB0aXRsZTogJ0ZvY3VzZWQgUGFuZSBXaWR0aCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1NldHMgdGhlIFBlcmNlbnRhZ2UgYmV0d2VlbiAwIGFuZCAxMDAgb2YgaG93IG11Y2ggdGhlIGZvY3VzZWQgcGFuZSB3aWxsIGdyb3cnLFxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogOTQsXG4gICAgICBtaW5pbXVtOiAxLFxuICAgICAgbWF4aW11bTogMTAwXG4gICAgfVxuICB9LFxuXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG4gIEZvbGxvd09ic2VydmVyOiBudWxsLFxuICBtb2RpZmllZFBhbmVzOiBbXSxcbiAgaW5jb21wYXRpYmxlUGx1Z2luczogW10sXG4gIGlzRm9jdXNlZDogZmFsc2UsXG5cbiAgYWN0aXZhdGUoc3RhdGUpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZVBhY2thZ2UoXG4gICAgICB0aGlzLmNoZWNrSW5jb21wYXRpYmlsaXR5LmJpbmQodGhpcykpKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnaGV5LXBhbmU6dG9nZ2xlLWZvY3VzLW9mLWFjdGl2ZS1wYW5lJzogKCkgPT4gdGhpcy50b2dnbGVGb2N1cygpLFxuICAgICAgJ2hleS1wYW5lOnRvZ2dsZS1mb2xsb3ctbW9kZSc6ICgpID0+IHRoaXMudG9nZ2xlRm9sbG93KClcbiAgICB9KSlcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLkZvbGxvd09ic2VydmVyICE9IG51bGwgJiYgdGhpcy5Gb2xsb3dPYnNlcnZlci5kaXNwb3NlKClcbiAgfSxcblxuICB0b2dnbGVGb2xsb3coKSB7XG4gICAgaWYgKHRoaXMuRm9sbG93T2JzZXJ2ZXIgIT0gbnVsbCkge1xuICAgICAgdGhpcy5Gb2xsb3dPYnNlcnZlci5kaXNwb3NlKClcbiAgICAgIHRoaXMuRm9sbG93T2JzZXJ2ZXIgPSBudWxsXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLkZvbGxvd09ic2VydmVyID0gYXRvbS53b3Jrc3BhY2VcbiAgICAgIC5vbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtKHBhbmUgPT4gdGhpcy5zdGFydEZvbGxvdygpKVxuICB9LFxuXG4gIHN0YXJ0Rm9sbG93KCkge1xuICAgIHRoaXMudW5kb0ZvY3VzKClcbiAgICB0aGlzLmRvRm9jdXMoKVxuICB9LFxuXG4gIHRvZ2dsZUZvY3VzKCkge1xuICAgIGlmICh0aGlzLmlzRm9jdXNlZCkgdGhpcy51bmRvRm9jdXMoKVxuICAgIGVsc2UgdGhpcy5kb0ZvY3VzKClcbiAgfSxcblxuICBkb0ZvY3VzKCkge1xuICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZVxuICAgIGNvbnN0IGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcblxuICAgIC8vIEZvciBjdXN0b20gc3R5bGluZyBwb3NzaWJpbGl0aWVzLlxuICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgaXMgYXZhaWxhYmxlIGZvciBBUEkgPCAxLjE3LlxuICAgIGFjdGl2ZVBhbmUuZWxlbWVudCAmJiBhY3RpdmVQYW5lLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGV5LXBhbmUtZm9jdXMnKVxuXG4gICAgY29uc3QgZXhwYW5kZWRXaWR0aCA9IGF0b20uY29uZmlnLmdldCgnaGV5LXBhbmUuZXhwYW5kZWRXaWR0aCcpIC8gMTAwXG4gICAgY29uc3QgY29sbGFwc2VkV2lkdGggPSAxIC0gZXhwYW5kZWRXaWR0aFxuICAgIGNvbnN0IHBhbmVSb290ID0gYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkucGFuZUNvbnRhaW5lci5nZXRSb290KClcblxuICAgIC8vIFJlY3Vyc2l2ZSBzZXQgZXhwYW5kZWQtL2NvbGxhcHNlZFdpZHRoIG9uIFBhbmVzIG9yIFBhbmVBeGVzLlxuICAgIC8vIFBhbmVBeGVzIGFyZSBuZXN0ZWQgaW50byBlYWNoIG90aGVyLiBUaGVyZSBpcyBhIHNpbmdsZSBwYXJlbnQgYXhpcy5cbiAgICAvLyBXZSBnbyBmcm9tIGEgcGFuZSBhbGwgdGhlIHdheSBkb3duIHVudGlsIHdlJ3JlIGF0IHRoZSBwYXJlbnQgYXhpcy5cbiAgICBjb25zdCByZXN1cnNpdmVTZXQgPSAocGFuZSkgPT4ge1xuICAgICAgLy8gT25seSBkbyBzb21ldGhpbmcsIGlmIHRoZSBwYW5lIGlzIGEgY2hpbGQgb2YgYW4gYXhpcy5cbiAgICAgIC8vIEEgcGFuZSBoYXMgbm8gYXhpcywgaWYgdGhlcmUgYXJlIG5vIHNwbGl0IHdpbmRvd3MuXG4gICAgICBpZiAocGFuZS5nZXRQYXJlbnQoKS5jb25zdHJ1Y3Rvci5uYW1lID09PSAnUGFuZUF4aXMnKSB7XG4gICAgICAgIC8vIEV4cGFuZCB0aGUgcGFuZS4uLlxuICAgICAgICB0aGlzLnNhdmVQYW5lU3RhdGUocGFuZSkuc2V0RmxleFNjYWxlKGV4cGFuZGVkV2lkdGgpXG5cbiAgICAgICAgLy8gLi4uYW5kIGNvbGxhcHNlIGFsbCBpdHMgc2libGluZ3MuXG4gICAgICAgIHBhbmUuZ2V0UGFyZW50KCkuY2hpbGRyZW5cbiAgICAgICAgICAuZmlsdGVyKGVsID0+IGVsICE9PSBwYW5lKSAvLyBiY3V6IG9ubHkgc2libGluZ3NcbiAgICAgICAgICAuZm9yRWFjaChzaWJsaW5nID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVBhbmVTdGF0ZShzaWJsaW5nKS5zZXRGbGV4U2NhbGUoY29sbGFwc2VkV2lkdGgpXG4gICAgICAgICAgfSlcblxuICAgICAgICAvLyBEbyB0aGUgc2FtZSB3aXRoIHRoZSBhZGphY2VudCBwYW5lcywgdW50aWwgd2UncmUgb24gdGhlIHJvb3QgYXhpcy5cbiAgICAgICAgaWYgKHBhbmUuZ2V0UGFyZW50KCkgIT09IHBhbmVSb290KSB7XG4gICAgICAgICAgcmVzdXJzaXZlU2V0KHBhbmUuZ2V0UGFyZW50KCkpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzaG9vdCBkYSBsYXpyXG4gICAgcmVzdXJzaXZlU2V0KGFjdGl2ZVBhbmUpXG4gIH0sXG5cbiAgdW5kb0ZvY3VzKCkge1xuICAgIHRoaXMuaXNGb2N1c2VkID0gZmFsc2VcbiAgICB0aGlzLnJlc3RvcmVQYW5lcygpXG4gICAgdGhpcy5lbXB0eVBhbmVTdGF0ZXMoKVxuICB9LFxuXG4gIC8vIFNhdmVzIHRoZSBwYW5lIGFuZCBpdHMgZmxleFNjYWxlIGZvciBsYXRlciByZXN0b3JpbmcuXG4gIC8vIElEcyB3b3VsZCBiZSBuaWNlciwgYnV0IEkgY291bGRuJ3QgZmluZCBhIHdheSB0byBzZWFyY2ggYSBwYW5lIG9yIGF4aXMgYnlcbiAgLy8gaXRzIElELlxuICAvLyBOb3RlOiBgcGFuZWAgY2FuIGJlIGFuIGluc3RhbmNlb2YgUGFuZSBvciBQYW5lQXhpcy5cbiAgLy8gICBJIHRyZWF0IHRoZW0gYmFzaWNhbGx5IGFzIHRoZSBzYW1lLlxuICBzYXZlUGFuZVN0YXRlKHBhbmUpIHtcbiAgICB0aGlzLm1vZGlmaWVkUGFuZXMucHVzaCh7IHBhbmUsIGZsZXhTY2FsZTogcGFuZS5mbGV4U2NhbGUgfSlcbiAgICByZXR1cm4gcGFuZVxuICB9LFxuXG4gIHJlc3RvcmVQYW5lcygpIHtcbiAgICB0aGlzLm1vZGlmaWVkUGFuZXNcbiAgICAgIC5mb3JFYWNoKCh7IHBhbmUsIGZsZXhTY2FsZSB9KSA9PiB7XG4gICAgICAgIGlmICghcGFuZS5pc0FsaXZlKCkpIHJldHVybiAvLyBwYW5lIGlzIGRlYWQ6IGxvb3AgY29udGludWVcbiAgICAgICAgcGFuZS5lbGVtZW50ICYmIHBhbmUuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoZXktcGFuZS1mb2N1cycpXG4gICAgICAgIHBhbmUuc2V0RmxleFNjYWxlKGZsZXhTY2FsZSlcbiAgICAgIH0pXG4gIH0sXG5cbiAgZW1wdHlQYW5lU3RhdGVzKCkge1xuICAgIHRoaXMubW9kaWZpZWRQYW5lcyA9IFtdXG4gIH0sXG5cbiAgY2hlY2tJbmNvbXBhdGliaWxpdHkocGx1Z2luKSB7XG4gICAgaWYgKHRoaXMuaW5jb21wYXRpYmxlUGx1Z2lucy5pbmNsdWRlcyhwbHVnaW4ubmFtZSkpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignSW5jb21wYXRpYmxlIFBhY2thZ2UgRGV0ZWN0ZWQnLFxuICAgICAgICB7XG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgZGV0YWlsOiBgaGV5LXBhbmUgZG9lcyBub3Qgd29yayB3aGVuIHBhY2thZ2UgXCIke3BsdWdpbi5uYW1lfVwiIGlzIGFjdGl2YXRlZC5gXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gIH1cblxufTtcbiJdfQ==