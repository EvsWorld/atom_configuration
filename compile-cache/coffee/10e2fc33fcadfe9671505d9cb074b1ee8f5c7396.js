(function() {
  var CompositeDisposable, Emitter, ProjectRepositories, TreeViewGitStatus, TreeViewUI, ref, utils;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  ProjectRepositories = require('./repositories');

  TreeViewUI = require('./treeviewui');

  utils = require('./utils');

  module.exports = TreeViewGitStatus = {
    config: {
      autoToggle: {
        order: 1,
        type: 'boolean',
        "default": true,
        description: 'Show the Git status in the tree view when starting Atom'
      },
      showProjectModifiedStatus: {
        order: 2,
        type: 'boolean',
        "default": true,
        description: 'Mark project folder as modified in case there are any ' + 'uncommited changes'
      },
      showBranchLabel: {
        order: 3,
        type: 'boolean',
        "default": true
      },
      showCommitsAheadLabel: {
        order: 4,
        type: 'boolean',
        "default": true
      },
      showCommitsBehindLabel: {
        order: 5,
        type: 'boolean',
        "default": true
      },
      gitFlow: {
        order: 6,
        type: 'object',
        properties: {
          enabled: {
            order: 1,
            type: 'boolean',
            "default": true,
            title: 'Enable Git Flow',
            description: 'Git Flow support requires you to [install Git Flow](https://github.com/petervanderdoes/gitflow-avh/wiki/Installation) and run `git flow init` on the ' + 'repository you want to work on'
          },
          display_type: {
            order: 2,
            type: 'integer',
            "default": 1,
            title: 'Git Flow display type',
            minimum: 1,
            maximum: 3,
            "enum": [
              {
                value: 1,
                description: 'Show prefix and branchname'
              }, {
                value: 2,
                description: 'Show icon, prefix and branchname'
              }, {
                value: 3,
                description: 'Show icon and branchname'
              }
            ]
          }
        }
      }
    },
    subscriptions: null,
    toggledSubscriptions: null,
    treeView: null,
    subscriptionsOfCommands: null,
    active: false,
    repos: null,
    treeViewUI: null,
    ignoredRepositories: null,
    emitter: null,
    isActivatedFlag: false,
    activate: function() {
      this.emitter = new Emitter;
      this.ignoredRepositories = new Map;
      this.subscriptionsOfCommands = new CompositeDisposable;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          return _this.doInitPackage();
        };
      })(this)));
      this.activateInterval = setInterval(((function(_this) {
        return function() {
          return _this.doInitPackage();
        };
      })(this)), 1000);
      return this.doInitPackage();
    },
    doInitPackage: function() {
      var autoToggle, treeView;
      treeView = this.getTreeView();
      if (!(treeView && !this.active)) {
        return;
      }
      clearInterval(this.activateInterval);
      this.activateInterval = null;
      this.treeView = treeView;
      this.active = true;
      this.subscriptionsOfCommands.add(atom.commands.add('atom-workspace', {
        'tree-view-git-status:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      autoToggle = atom.config.get('tree-view-git-status.autoToggle');
      if (autoToggle) {
        this.toggle();
      }
      this.isActivatedFlag = true;
      return this.emitter.emit('did-activate');
    },
    deactivate: function() {
      var ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8;
      if ((ref1 = this.subscriptions) != null) {
        ref1.dispose();
      }
      this.subscriptions = null;
      if ((ref2 = this.subscriptionsOfCommands) != null) {
        ref2.dispose();
      }
      this.subscriptionsOfCommands = null;
      if ((ref3 = this.toggledSubscriptions) != null) {
        ref3.dispose();
      }
      this.toggledSubscriptions = null;
      this.treeView = null;
      this.active = false;
      this.toggled = false;
      if ((ref4 = this.ignoredRepositories) != null) {
        ref4.clear();
      }
      this.ignoredRepositories = null;
      if ((ref5 = this.repos) != null) {
        ref5.destruct();
      }
      this.repos = null;
      if ((ref6 = this.treeViewUI) != null) {
        ref6.destruct();
      }
      this.treeViewUI = null;
      if ((ref7 = this.emitter) != null) {
        ref7.clear();
      }
      if ((ref8 = this.emitter) != null) {
        ref8.dispose();
      }
      return this.emitter = null;
    },
    isActivated: function() {
      return this.isActivatedFlag;
    },
    toggle: function() {
      var ref1, ref2, ref3;
      if (!this.active) {
        return;
      }
      if (!this.toggled) {
        this.toggled = true;
        this.repos = new ProjectRepositories(this.ignoredRepositories);
        this.treeViewUI = new TreeViewUI(this.treeView, this.repos.getRepositories());
        this.toggledSubscriptions = new CompositeDisposable;
        this.toggledSubscriptions.add(this.repos.onDidChange('repos', (function(_this) {
          return function(repos) {
            var ref1;
            return (ref1 = _this.treeViewUI) != null ? ref1.setRepositories(repos) : void 0;
          };
        })(this)));
        return this.toggledSubscriptions.add(this.repos.onDidChange('repo-status', (function(_this) {
          return function(evt) {
            var ref1, ref2;
            if ((ref1 = _this.repos) != null ? ref1.getRepositories().has(evt.repoPath) : void 0) {
              return (ref2 = _this.treeViewUI) != null ? ref2.updateRootForRepo(evt.repo, evt.repoPath) : void 0;
            }
          };
        })(this)));
      } else {
        this.toggled = false;
        if ((ref1 = this.toggledSubscriptions) != null) {
          ref1.dispose();
        }
        this.toggledSubscriptions = null;
        if ((ref2 = this.repos) != null) {
          ref2.destruct();
        }
        this.repos = null;
        if ((ref3 = this.treeViewUI) != null) {
          ref3.destruct();
        }
        return this.treeViewUI = null;
      }
    },
    getTreeView: function() {
      var ref1, ref2, treeViewPkg;
      if (this.treeView == null) {
        if (atom.packages.getActivePackage('tree-view') != null) {
          treeViewPkg = atom.packages.getActivePackage('tree-view');
        }
        if ((treeViewPkg != null ? (ref1 = treeViewPkg.mainModule) != null ? ref1.getTreeViewInstance : void 0 : void 0) != null) {
          return treeViewPkg.mainModule.getTreeViewInstance();
        }
        if ((treeViewPkg != null ? (ref2 = treeViewPkg.mainModule) != null ? ref2.treeView : void 0 : void 0) != null) {
          return treeViewPkg.mainModule.treeView;
        } else {
          return null;
        }
      } else {
        return this.treeView;
      }
    },
    getRepositories: function() {
      if (this.repos != null) {
        return this.repos.getRepositories();
      } else {
        return null;
      }
    },
    ignoreRepository: function(repoPath) {
      var ref1;
      this.ignoredRepositories.set(utils.normalizePath(repoPath), true);
      return (ref1 = this.repos) != null ? ref1.setIgnoredRepositories(this.ignoredRepositories) : void 0;
    },
    onDidActivate: function(handler) {
      return this.emitter.on('did-activate', handler);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90cmVlLXZpZXctZ2l0LXN0YXR1cy9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsNkNBQUQsRUFBc0I7O0VBQ3RCLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSxnQkFBUjs7RUFDdEIsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUNiLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUjs7RUFFUixNQUFNLENBQUMsT0FBUCxHQUFpQixpQkFBQSxHQUVmO0lBQUEsTUFBQSxFQUNFO01BQUEsVUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLENBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFGVDtRQUdBLFdBQUEsRUFDRSx5REFKRjtPQURGO01BTUEseUJBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxDQUFQO1FBQ0EsSUFBQSxFQUFNLFNBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRlQ7UUFHQSxXQUFBLEVBQ0Usd0RBQUEsR0FDQSxvQkFMRjtPQVBGO01BYUEsZUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLENBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFGVDtPQWRGO01BaUJBLHFCQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sQ0FBUDtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUZUO09BbEJGO01BcUJBLHNCQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sQ0FBUDtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUZUO09BdEJGO01BeUJBLE9BQUEsRUFDRTtRQUFBLEtBQUEs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QVcsQ0FBQyxVQUFVLENBQUMsbUJBQXZCLENBQUEsRUFEVDs7UUFHQSxJQUFHLHlHQUFIO0FBQ0UsaUJBQU8sV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQURoQztTQUFBLE1BQUE7QUFHRSxpQkFBTyxLQUhUO1NBUkY7T0FBQSxNQUFBO0FBYUUsZUFBTyxJQUFDLENBQUEsU0FiVjs7SUFEVyxDQWxKYjtJQWtLQSxlQUFBLEVBQWlCLFNBQUE7TUFDUixJQUFHLGtCQUFIO2VBQWdCLElBQUMsQ0FBQSxLQUFLLENBQUMsZUFBUCxDQUFBLEVBQWhCO09BQUEsTUFBQTtlQUE4QyxLQUE5Qzs7SUFEUSxDQWxLakI7SUFxS0EsZ0JBQUEsRUFBa0IsU0FBQyxRQUFEO0FBQ2hCLFVBQUE7TUFBQSxJQUFDLENBQUEsbUJBQW1CLENBQUMsR0FBckIsQ0FBeUIsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsUUFBcEIsQ0FBekIsRUFBd0QsSUFBeEQ7K0NBQ00sQ0FBRSxzQkFBUixDQUErQixJQUFDLENBQUEsbUJBQWhDO0lBRmdCLENBcktsQjtJQXlLQSxhQUFBLEVBQWUsU0FBQyxPQUFEO0FBQ2IsYUFBTyxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxjQUFaLEVBQTRCLE9BQTVCO0lBRE0sQ0F6S2Y7O0FBUEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuUHJvamVjdFJlcG9zaXRvcmllcyA9IHJlcXVpcmUgJy4vcmVwb3NpdG9yaWVzJ1xuVHJlZVZpZXdVSSA9IHJlcXVpcmUgJy4vdHJlZXZpZXd1aSdcbnV0aWxzID0gcmVxdWlyZSAnLi91dGlscydcblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlVmlld0dpdFN0YXR1cyA9XG5cbiAgY29uZmlnOlxuICAgIGF1dG9Ub2dnbGU6XG4gICAgICBvcmRlcjogMVxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1Nob3cgdGhlIEdpdCBzdGF0dXMgaW4gdGhlIHRyZWUgdmlldyB3aGVuIHN0YXJ0aW5nIEF0b20nXG4gICAgc2hvd1Byb2plY3RNb2RpZmllZFN0YXR1czpcbiAgICAgIG9yZGVyOiAyXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnTWFyayBwcm9qZWN0IGZvbGRlciBhcyBtb2RpZmllZCBpbiBjYXNlIHRoZXJlIGFyZSBhbnkgJyArXG4gICAgICAgICd1bmNvbW1pdGVkIGNoYW5nZXMnXG4gICAgc2hvd0JyYW5jaExhYmVsOlxuICAgICAgb3JkZXI6IDNcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIHNob3dDb21taXRzQWhlYWRMYWJlbDpcbiAgICAgIG9yZGVyOiA0XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBzaG93Q29tbWl0c0JlaGluZExhYmVsOlxuICAgICAgb3JkZXI6IDVcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIGdpdEZsb3c6XG4gICAgICBvcmRlcjogNlxuICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgIGVuYWJsZWQ6XG4gICAgICAgICAgb3JkZXI6IDFcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgICAgdGl0bGU6ICdFbmFibGUgR2l0IEZsb3cnXG4gICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAnR2l0IEZsb3cgc3VwcG9ydCByZXF1aXJlcyB5b3UgdG8gW2luc3RhbGwgR2l0IEZsb3ddKGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRlcnZhbmRlcmRvZXMvZ2l0Zmxvdy1hdmgvd2lraS9JbnN0YWxsYXRpb24pIGFuZCBydW4gYGdpdCBmbG93IGluaXRgIG9uIHRoZSAnICtcbiAgICAgICAgICAgICdyZXBvc2l0b3J5IHlvdSB3YW50IHRvIHdvcmsgb24nXG4gICAgICAgIGRpc3BsYXlfdHlwZTpcbiAgICAgICAgICBvcmRlcjogMlxuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgICAgIGRlZmF1bHQ6IDFcbiAgICAgICAgICB0aXRsZTogJ0dpdCBGbG93IGRpc3BsYXkgdHlwZSdcbiAgICAgICAgICBtaW5pbXVtOiAxXG4gICAgICAgICAgbWF4aW11bTogM1xuICAgICAgICAgIGVudW06IFtcbiAgICAgICAgICAgIHt2YWx1ZTogMSwgZGVzY3JpcHRpb246ICdTaG93IHByZWZpeCBhbmQgYnJhbmNobmFtZSd9XG4gICAgICAgICAgICB7dmFsdWU6IDIsIGRlc2NyaXB0aW9uOiAnU2hvdyBpY29uLCBwcmVmaXggYW5kIGJyYW5jaG5hbWUnfVxuICAgICAgICAgICAge3ZhbHVlOiAzLCBkZXNjcmlwdGlvbjogJ1Nob3cgaWNvbiBhbmQgYnJhbmNobmFtZSd9XG4gICAgICAgICAgXVxuXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgdG9nZ2xlZFN1YnNjcmlwdGlvbnM6IG51bGxcbiAgdHJlZVZpZXc6IG51bGxcbiAgc3Vic2NyaXB0aW9uc09mQ29tbWFuZHM6IG51bGxcbiAgYWN0aXZlOiBmYWxzZVxuICByZXBvczogbnVsbFxuICB0cmVlVmlld1VJOiBudWxsXG4gIGlnbm9yZWRSZXBvc2l0b3JpZXM6IG51bGxcbiAgZW1pdHRlcjogbnVsbFxuICBpc0FjdGl2YXRlZEZsYWc6IGZhbHNlXG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEBpZ25vcmVkUmVwb3NpdG9yaWVzID0gbmV3IE1hcFxuICAgIEBzdWJzY3JpcHRpb25zT2ZDb21tYW5kcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgICMgV2FpdCB1bmxlc3MgYWxsIHBhY2thZ2VzIGhhdmUgYmVlbiBhY3RpYXZ0ZWQgYW5kIGRvIG5vdCBmb3JjZWZ1bGx5XG4gICAgIyBhY3RpdmF0ZSB0aGUgdHJlZS12aWV3LiBJZiB0aGUgdHJlZS12aWV3IGhhc24ndCBiZWVuIGFjdGl2YXRlZCB3ZVxuICAgICMgc2hvdWxkIGRvIG5vdGhpbmcuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZUluaXRpYWxQYWNrYWdlcyA9PlxuICAgICAgQGRvSW5pdFBhY2thZ2UoKVxuICAgICMgV29ya2Fyb3VuZCBmb3IgdGhlIGlzc3VlIHRoYXQgXCJvbkRpZEFjdGl2YXRlSW5pdGlhbFBhY2thZ2VzXCIgbmV2ZXIgZ2V0c1xuICAgICMgZmlyZWQgaWYgb25lIG9yIG1vcmUgcGFja2FnZXMgYXJlIGZhaWxpbmcgdG8gaW5pdGlhbGl6ZVxuICAgIEBhY3RpdmF0ZUludGVydmFsID0gc2V0SW50ZXJ2YWwgKD0+XG4gICAgICBAZG9Jbml0UGFja2FnZSgpXG4gICAgKSwgMTAwMFxuICAgIEBkb0luaXRQYWNrYWdlKClcblxuICBkb0luaXRQYWNrYWdlOiAtPlxuICAgICMgQ2hlY2sgaWYgdGhlIHRyZWUgdmlldyBoYXMgYmVlbiBhbHJlYWR5IGluaXRpYWxpemVkXG4gICAgdHJlZVZpZXcgPSBAZ2V0VHJlZVZpZXcoKVxuICAgIHJldHVybiB1bmxlc3MgdHJlZVZpZXcgYW5kIG5vdCBAYWN0aXZlXG5cbiAgICBjbGVhckludGVydmFsKEBhY3RpdmF0ZUludGVydmFsKVxuICAgIEBhY3RpdmF0ZUludGVydmFsID0gbnVsbFxuICAgIEB0cmVlVmlldyA9IHRyZWVWaWV3XG4gICAgQGFjdGl2ZSA9IHRydWVcblxuICAgICMgVG9nZ2xlIHRyZWUtdmlldy1naXQtc3RhdHVzLi4uXG4gICAgQHN1YnNjcmlwdGlvbnNPZkNvbW1hbmRzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ3RyZWUtdmlldy1naXQtc3RhdHVzOnRvZ2dsZSc6ID0+XG4gICAgICAgIEB0b2dnbGUoKVxuICAgIGF1dG9Ub2dnbGUgPSBhdG9tLmNvbmZpZy5nZXQgJ3RyZWUtdmlldy1naXQtc3RhdHVzLmF1dG9Ub2dnbGUnXG4gICAgQHRvZ2dsZSgpIGlmIGF1dG9Ub2dnbGVcbiAgICBAaXNBY3RpdmF0ZWRGbGFnID0gdHJ1ZVxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1hY3RpdmF0ZSdcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICBAc3Vic2NyaXB0aW9uc09mQ29tbWFuZHM/LmRpc3Bvc2UoKVxuICAgIEBzdWJzY3JpcHRpb25zT2ZDb21tYW5kcyA9IG51bGxcbiAgICBAdG9nZ2xlZFN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEB0b2dnbGVkU3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICBAdHJlZVZpZXcgPSBudWxsXG4gICAgQGFjdGl2ZSA9IGZhbHNlXG4gICAgQHRvZ2dsZWQgPSBmYWxzZVxuICAgIEBpZ25vcmVkUmVwb3NpdG9yaWVzPy5jbGVhcigpXG4gICAgQGlnbm9yZWRSZXBvc2l0b3JpZXMgPSBudWxsXG4gICAgQHJlcG9zPy5kZXN0cnVjdCgpXG4gICAgQHJlcG9zID0gbnVsbFxuICAgIEB0cmVlVmlld1VJPy5kZXN0cnVjdCgpXG4gICAgQHRyZWVWaWV3VUkgPSBudWxsXG4gICAgQGVtaXR0ZXI/LmNsZWFyKClcbiAgICBAZW1pdHRlcj8uZGlzcG9zZSgpXG4gICAgQGVtaXR0ZXIgPSBudWxsXG5cbiAgaXNBY3RpdmF0ZWQ6IC0+XG4gICAgcmV0dXJuIEBpc0FjdGl2YXRlZEZsYWdcblxuICB0b2dnbGU6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAYWN0aXZlXG4gICAgaWYgbm90IEB0b2dnbGVkXG4gICAgICBAdG9nZ2xlZCA9IHRydWVcbiAgICAgIEByZXBvcyA9IG5ldyBQcm9qZWN0UmVwb3NpdG9yaWVzKEBpZ25vcmVkUmVwb3NpdG9yaWVzKVxuICAgICAgQHRyZWVWaWV3VUkgPSBuZXcgVHJlZVZpZXdVSSBAdHJlZVZpZXcsIEByZXBvcy5nZXRSZXBvc2l0b3JpZXMoKVxuICAgICAgQHRvZ2dsZWRTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICAgIEB0b2dnbGVkU3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIEByZXBvcy5vbkRpZENoYW5nZSAncmVwb3MnLCAocmVwb3MpID0+XG4gICAgICAgICAgQHRyZWVWaWV3VUk/LnNldFJlcG9zaXRvcmllcyByZXBvc1xuICAgICAgKVxuICAgICAgQHRvZ2dsZWRTdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgQHJlcG9zLm9uRGlkQ2hhbmdlICdyZXBvLXN0YXR1cycsIChldnQpID0+XG4gICAgICAgICAgaWYgQHJlcG9zPy5nZXRSZXBvc2l0b3JpZXMoKS5oYXMoZXZ0LnJlcG9QYXRoKVxuICAgICAgICAgICAgQHRyZWVWaWV3VUk/LnVwZGF0ZVJvb3RGb3JSZXBvKGV2dC5yZXBvLCBldnQucmVwb1BhdGgpXG4gICAgICApXG4gICAgZWxzZVxuICAgICAgQHRvZ2dsZWQgPSBmYWxzZVxuICAgICAgQHRvZ2dsZWRTdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICAgIEB0b2dnbGVkU3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICAgIEByZXBvcz8uZGVzdHJ1Y3QoKVxuICAgICAgQHJlcG9zID0gbnVsbFxuICAgICAgQHRyZWVWaWV3VUk/LmRlc3RydWN0KClcbiAgICAgIEB0cmVlVmlld1VJID0gbnVsbFxuXG4gIGdldFRyZWVWaWV3OiAtPlxuICAgIGlmIG5vdCBAdHJlZVZpZXc/XG4gICAgICBpZiBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoJ3RyZWUtdmlldycpP1xuICAgICAgICB0cmVlVmlld1BrZyA9IGF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZSgndHJlZS12aWV3JylcbiAgICAgICMgVE9ETyBDaGVjayBmb3Igc3VwcG9ydCBvZiBOdWNsaWRlIFRyZWUgVmlld1xuICAgICAgIyBBdG9tID49IDEuMTguMFxuICAgICAgaWYgdHJlZVZpZXdQa2c/Lm1haW5Nb2R1bGU/LmdldFRyZWVWaWV3SW5zdGFuY2U/XG4gICAgICAgIHJldHVybiB0cmVlVmlld1BrZy5tYWluTW9kdWxlLmdldFRyZWVWaWV3SW5zdGFuY2UoKVxuICAgICAgIyBBdG9tIDwgMS4xOC4wXG4gICAgICBpZiB0cmVlVmlld1BrZz8ubWFpbk1vZHVsZT8udHJlZVZpZXc/XG4gICAgICAgIHJldHVybiB0cmVlVmlld1BrZy5tYWluTW9kdWxlLnRyZWVWaWV3XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEB0cmVlVmlld1xuXG4gIGdldFJlcG9zaXRvcmllczogLT5cbiAgICByZXR1cm4gaWYgQHJlcG9zPyB0aGVuIEByZXBvcy5nZXRSZXBvc2l0b3JpZXMoKSBlbHNlIG51bGxcblxuICBpZ25vcmVSZXBvc2l0b3J5OiAocmVwb1BhdGgpIC0+XG4gICAgQGlnbm9yZWRSZXBvc2l0b3JpZXMuc2V0KHV0aWxzLm5vcm1hbGl6ZVBhdGgocmVwb1BhdGgpLCB0cnVlKVxuICAgIEByZXBvcz8uc2V0SWdub3JlZFJlcG9zaXRvcmllcyhAaWdub3JlZFJlcG9zaXRvcmllcylcblxuICBvbkRpZEFjdGl2YXRlOiAoaGFuZGxlcikgLT5cbiAgICByZXR1cm4gQGVtaXR0ZXIub24gJ2RpZC1hY3RpdmF0ZScsIGhhbmRsZXJcbiJdfQ==
