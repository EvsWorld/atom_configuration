(function() {
  var CompositeDisposable, GitFlowHandler, TreeViewUI, fs, path, utils;

  CompositeDisposable = require('atom').CompositeDisposable;

  path = require('path');

  fs = require('fs-plus');

  utils = require('./utils');

  GitFlowHandler = require('./gitflowhandler');

  module.exports = TreeViewUI = (function() {
    var ENUM_UPDATE_STATUS, statusUpdatingRoots;

    TreeViewUI.prototype.roots = null;

    TreeViewUI.prototype.repositoryMap = null;

    TreeViewUI.prototype.treeViewRootsMap = null;

    TreeViewUI.prototype.subscriptions = null;

    TreeViewUI.prototype.gitFlowHandler = null;

    ENUM_UPDATE_STATUS = {
      NOT_UPDATING: 0,
      UPDATING: 1,
      QUEUED: 2,
      QUEUED_RESET: 3
    };

    statusUpdatingRoots = ENUM_UPDATE_STATUS.NOT_UPDATING;

    function TreeViewUI(treeView, repositoryMap) {
      this.treeView = treeView;
      this.repositoryMap = repositoryMap;
      this.showProjectModifiedStatus = atom.config.get('tree-view-git-status.showProjectModifiedStatus');
      this.showBranchLabel = atom.config.get('tree-view-git-status.showBranchLabel');
      this.showCommitsAheadLabel = atom.config.get('tree-view-git-status.showCommitsAheadLabel');
      this.showCommitsBehindLabel = atom.config.get('tree-view-git-status.showCommitsBehindLabel');
      this.subscriptions = new CompositeDisposable;
      this.treeViewRootsMap = new Map;
      this.gitFlowHandler = new GitFlowHandler(this);
      this.subscribeUpdateConfigurations();
      this.subscribeUpdateTreeView();
      this.updateRoots(true);
    }

    TreeViewUI.prototype.destruct = function() {
      var ref;
      this.clearTreeViewRootMap();
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      this.subscriptions = null;
      this.treeViewRootsMap = null;
      this.gitFlowHandler = null;
      this.repositoryMap = null;
      return this.roots = null;
    };

    TreeViewUI.prototype.subscribeUpdateTreeView = function() {
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.updateRoots(true);
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('tree-view.hideVcsIgnoredFiles', (function(_this) {
        return function() {
          return _this.updateRoots(true);
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('tree-view.hideIgnoredNames', (function(_this) {
        return function() {
          return _this.updateRoots(true);
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('core.ignoredNames', (function(_this) {
        return function() {
          if (atom.config.get('tree-view.hideIgnoredNames')) {
            return _this.updateRoots(true);
          }
        };
      })(this)));
      return this.subscriptions.add(atom.config.onDidChange('tree-view.sortFoldersBeforeFiles', (function(_this) {
        return function() {
          return _this.updateRoots(true);
        };
      })(this)));
    };

    TreeViewUI.prototype.subscribeUpdateConfigurations = function() {
      this.subscriptions.add(atom.config.observe('tree-view-git-status.showProjectModifiedStatus', (function(_this) {
        return function(newValue) {
          if (_this.showProjectModifiedStatus !== newValue) {
            _this.showProjectModifiedStatus = newValue;
            return _this.updateRoots();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('tree-view-git-status.showBranchLabel', (function(_this) {
        return function(newValue) {
          if (_this.showBranchLabel !== newValue) {
            _this.showBranchLabel = newValue;
          }
          return _this.updateRoots();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('tree-view-git-status.showCommitsAheadLabel', (function(_this) {
        return function(newValue) {
          if (_this.showCommitsAheadLabel !== newValue) {
            _this.showCommitsAheadLabel = newValue;
            return _this.updateRoots();
          }
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('tree-view-git-status.showCommitsBehindLabel', (function(_this) {
        return function(newValue) {
          if (_this.showCommitsBehindLabel !== newValue) {
            _this.showCommitsBehindLabel = newValue;
            return _this.updateRoots();
          }
        };
      })(this)));
    };

    TreeViewUI.prototype.setRepositories = function(repositories) {
      if (repositories != null) {
        this.repositoryMap = repositories;
        return this.updateRoots(true);
      }
    };

    TreeViewUI.prototype.clearTreeViewRootMap = function() {
      var ref, ref1;
      if ((ref = this.treeViewRootsMap) != null) {
        ref.forEach(function(root, rootPath) {
          var customElements, ref1, ref2, ref3, ref4;
          if ((ref1 = root.root) != null) {
            if ((ref2 = ref1.classList) != null) {
              ref2.remove('status-modified', 'status-added');
            }
          }
          customElements = root.customElements;
          if ((customElements != null ? customElements.headerGitStatus : void 0) != null) {
            if ((ref3 = root.root) != null) {
              if ((ref4 = ref3.header) != null) {
                ref4.removeChild(customElements.headerGitStatus);
              }
            }
            return customElements.headerGitStatus = null;
          }
        });
      }
      return (ref1 = this.treeViewRootsMap) != null ? ref1.clear() : void 0;
    };

    TreeViewUI.prototype.updateRoots = function(reset) {
      var i, len, ref, repoForRoot, repoSubPath, root, rootPath, rootPathHasGitFolder, rootPathNoSymlink, updatePromises;
      if (this.repositoryMap == null) {
        return;
      }
      if (statusUpdatingRoots === ENUM_UPDATE_STATUS.NOT_UPDATING) {
        statusUpdatingRoots = ENUM_UPDATE_STATUS.UPDATING;
        this.roots = this.treeView.roots;
        if (reset) {
          this.clearTreeViewRootMap();
        }
        updatePromises = [];
        ref = this.roots;
        for (i = 0, len = ref.length; i < len; i++) {
          root = ref[i];
          rootPath = utils.normalizePath(root.directoryName.dataset.path);
          if (reset) {
            this.treeViewRootsMap.set(rootPath, {
              root: root,
              customElements: {}
            });
          }
          repoForRoot = null;
          repoSubPath = null;
          rootPathHasGitFolder = fs.existsSync(path.join(rootPath, '.git'));
          rootPathNoSymlink = rootPath;
          if (fs.isSymbolicLinkSync(rootPath)) {
            rootPathNoSymlink = utils.normalizePath(fs.realpathSync(rootPath));
          }
          this.repositoryMap.forEach(function(repo, repoPath) {
            if ((repoForRoot == null) && ((rootPathNoSymlink === repoPath) || (rootPathNoSymlink.indexOf(repoPath) === 0 && !rootPathHasGitFolder))) {
              repoSubPath = path.relative(repoPath, rootPathNoSymlink);
              return repoForRoot = repo;
            }
          });
          if (repoForRoot != null) {
            if (repoForRoot == null) {
              repoForRoot = null;
            }
            updatePromises.push(this.doUpdateRootNode(root, repoForRoot, rootPath, repoSubPath));
          }
        }
        utils.settle(updatePromises)["catch"](function(err) {
          return console.error(err);
        }).then((function(_this) {
          return function() {
            var lastStatus;
            lastStatus = statusUpdatingRoots;
            statusUpdatingRoots = ENUM_UPDATE_STATUS.NOT_UPDATING;
            if (lastStatus === ENUM_UPDATE_STATUS.QUEUED) {
              return _this.updateRoots();
            } else if (lastStatus === ENUM_UPDATE_STATUS.QUEUED_RESET) {
              return _this.updateRoots(true);
            }
          };
        })(this));
      } else if (statusUpdatingRoots === ENUM_UPDATE_STATUS.UPDATING) {
        statusUpdatingRoots = ENUM_UPDATE_STATUS.QUEUED;
      }
      if (statusUpdatingRoots === ENUM_UPDATE_STATUS.QUEUED && reset) {
        return statusUpdatingRoots = ENUM_UPDATE_STATUS.QUEUED_RESET;
      }
    };

    TreeViewUI.prototype.updateRootForRepo = function(repo, repoPath) {
      return this.updateRoots();
    };

    TreeViewUI.prototype.doUpdateRootNode = function(root, repo, rootPath, repoSubPath) {
      var customElements, updatePromise;
      customElements = this.treeViewRootsMap.get(rootPath).customElements;
      updatePromise = Promise.resolve();
      if (this.showProjectModifiedStatus && (repo != null)) {
        updatePromise = updatePromise.then(function() {
          if (repoSubPath !== '') {
            return repo.getDirectoryStatus(repoSubPath);
          } else {
            return utils.getRootDirectoryStatus(repo);
          }
        });
      }
      return updatePromise.then((function(_this) {
        return function(status) {
          var convStatus, headerGitStatus, showHeaderGitStatus;
          if (_this.roots == null) {
            return;
          }
          convStatus = _this.convertDirectoryStatus(repo, status);
          root.classList.remove('status-modified', 'status-added');
          if (convStatus != null) {
            root.classList.add("status-" + convStatus);
          }
          showHeaderGitStatus = _this.showBranchLabel || _this.showCommitsAheadLabel || _this.showCommitsBehindLabel;
          if (showHeaderGitStatus && (repo != null) && (customElements.headerGitStatus == null)) {
            headerGitStatus = document.createElement('span');
            headerGitStatus.classList.add('tree-view-git-status');
            return _this.generateGitStatusText(headerGitStatus, repo).then(function() {
              customElements.headerGitStatus = headerGitStatus;
              return root.header.insertBefore(headerGitStatus, root.directoryName.nextSibling);
            });
          } else if (showHeaderGitStatus && (customElements.headerGitStatus != null)) {
            return _this.generateGitStatusText(customElements.headerGitStatus, repo);
          } else if (customElements.headerGitStatus != null) {
            root.header.removeChild(customElements.headerGitStatus);
            return customElements.headerGitStatus = null;
          }
        };
      })(this));
    };

    TreeViewUI.prototype.generateGitStatusText = function(container, repo) {
      var ahead, behind, display, head;
      display = false;
      head = null;
      ahead = behind = 0;
      return repo.refreshStatus().then(function() {
        return repo.getShortHead().then(function(shorthead) {
          return head = shorthead;
        });
      }).then(function() {
        if (repo.getCachedUpstreamAheadBehindCount != null) {
          return repo.getCachedUpstreamAheadBehindCount().then(function(count) {
            return ahead = count.ahead, behind = count.behind, count;
          });
        }
      }).then((function(_this) {
        return function() {
          var asyncEvents, branchLabel, commitsAhead, commitsBehind;
          asyncEvents = [];
          container.className = '';
          container.classList.add('tree-view-git-status');
          if (_this.showBranchLabel && (head != null)) {
            branchLabel = document.createElement('span');
            branchLabel.classList.add('branch-label');
            if (/^[a-z_-][a-z\d_-]*$/i.test(head)) {
              container.classList.add('git-branch-' + head);
            }
            branchLabel.textContent = head;
            asyncEvents.push(_this.gitFlowHandler.enhanceBranchName(branchLabel, repo));
            display = true;
          }
          if (_this.showCommitsAheadLabel && ahead > 0) {
            commitsAhead = document.createElement('span');
            commitsAhead.classList.add('commits-ahead-label');
            commitsAhead.textContent = ahead;
            display = true;
          }
          if (_this.showCommitsBehindLabel && behind > 0) {
            commitsBehind = document.createElement('span');
            commitsBehind.classList.add('commits-behind-label');
            commitsBehind.textContent = behind;
            display = true;
          }
          if (display) {
            container.classList.remove('hide');
          } else {
            container.classList.add('hide');
          }
          return Promise.all(asyncEvents).then(function() {
            container.innerHTML = '';
            if (branchLabel != null) {
              container.appendChild(branchLabel);
            }
            if (commitsAhead != null) {
              container.appendChild(commitsAhead);
            }
            if (commitsBehind != null) {
              return container.appendChild(commitsBehind);
            }
          });
        };
      })(this));
    };

    TreeViewUI.prototype.convertDirectoryStatus = function(repo, status) {
      var newStatus;
      newStatus = null;
      if (repo.isStatusModified(status)) {
        newStatus = 'modified';
      } else if (repo.isStatusNew(status)) {
        newStatus = 'added';
      }
      return newStatus;
    };

    return TreeViewUI;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90cmVlLXZpZXctZ2l0LXN0YXR1cy9saWIvdHJlZXZpZXd1aS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVI7O0VBQ1IsY0FBQSxHQUFpQixPQUFBLENBQVEsa0JBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBRXJCLFFBQUE7O3lCQUFBLEtBQUEsR0FBTzs7eUJBQ1AsYUFBQSxHQUFlOzt5QkFDZixnQkFBQSxHQUFrQjs7eUJBQ2xCLGFBQUEsR0FBZTs7eUJBQ2YsY0FBQSxHQUFnQjs7SUFDaEIsa0JBQUEsR0FDRTtNQUFFLFlBQUEsRUFBYyxDQUFoQjtNQUFtQixRQUFBLEVBQVUsQ0FBN0I7TUFBZ0MsTUFBQSxFQUFRLENBQXhDO01BQTJDLFlBQUEsRUFBYyxDQUF6RDs7O0lBQ0YsbUJBQUEsR0FBc0Isa0JBQWtCLENBQUM7O0lBRTVCLG9CQUFDLFFBQUQsRUFBWSxhQUFaO01BQUMsSUFBQyxDQUFBLFdBQUQ7TUFBVyxJQUFDLENBQUEsZ0JBQUQ7TUFFdkIsSUFBQyxDQUFBLHlCQUFELEdBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdEQUFoQjtNQUNGLElBQUMsQ0FBQSxlQUFELEdBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQjtNQUNGLElBQUMsQ0FBQSxxQkFBRCxHQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0Q0FBaEI7TUFDRixJQUFDLENBQUEsc0JBQUQsR0FDRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVos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WUFDQSxhQUFhLENBQUMsV0FBZCxHQUE0QjtZQUM1QixPQUFBLEdBQVUsS0FKWjs7VUFNQSxJQUFHLE9BQUg7WUFDRSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQXBCLENBQTJCLE1BQTNCLEVBREY7V0FBQSxNQUFBO1lBR0UsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFwQixDQUF3QixNQUF4QixFQUhGOztBQU9BLGlCQUFPLE9BQU8sQ0FBQyxHQUFSLENBQVksV0FBWixDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQUE7WUFDbkMsU0FBUyxDQUFDLFNBQVYsR0FBc0I7WUFDdEIsSUFBcUMsbUJBQXJDO2NBQUEsU0FBUyxDQUFDLFdBQVYsQ0FBc0IsV0FBdEIsRUFBQTs7WUFDQSxJQUFzQyxvQkFBdEM7Y0FBQSxTQUFTLENBQUMsV0FBVixDQUFzQixZQUF0QixFQUFBOztZQUNBLElBQXVDLHFCQUF2QztxQkFBQSxTQUFTLENBQUMsV0FBVixDQUFzQixhQUF0QixFQUFBOztVQUptQyxDQUE5QjtRQXZDSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FiUjtJQU5xQjs7eUJBZ0V2QixzQkFBQSxHQUF3QixTQUFDLElBQUQsRUFBTyxNQUFQO0FBQ3RCLFVBQUE7TUFBQSxTQUFBLEdBQVk7TUFDWixJQUFHLElBQUksQ0FBQyxnQkFBTCxDQUFzQixNQUF0QixDQUFIO1FBQ0UsU0FBQSxHQUFZLFdBRGQ7T0FBQSxNQUVLLElBQUcsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsTUFBakIsQ0FBSDtRQUNILFNBQUEsR0FBWSxRQURUOztBQUVMLGFBQU87SUFOZTs7Ozs7QUE1UjFCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xudXRpbHMgPSByZXF1aXJlICcuL3V0aWxzJ1xuR2l0Rmxvd0hhbmRsZXIgPSByZXF1aXJlICcuL2dpdGZsb3doYW5kbGVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRyZWVWaWV3VUlcblxuICByb290czogbnVsbFxuICByZXBvc2l0b3J5TWFwOiBudWxsXG4gIHRyZWVWaWV3Um9vdHNNYXA6IG51bGxcbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBnaXRGbG93SGFuZGxlcjogbnVsbFxuICBFTlVNX1VQREFURV9TVEFUVVMgPVxuICAgIHsgTk9UX1VQREFUSU5HOiAwLCBVUERBVElORzogMSwgUVVFVUVEOiAyLCBRVUVVRURfUkVTRVQ6IDMgfVxuICBzdGF0dXNVcGRhdGluZ1Jvb3RzID0gRU5VTV9VUERBVEVfU1RBVFVTLk5PVF9VUERBVElOR1xuXG4gIGNvbnN0cnVjdG9yOiAoQHRyZWVWaWV3LCBAcmVwb3NpdG9yeU1hcCkgLT5cbiAgICAjIFJlYWQgY29uZmlndXJhdGlvblxuICAgIEBzaG93UHJvamVjdE1vZGlmaWVkU3RhdHVzID1cbiAgICAgIGF0b20uY29uZmlnLmdldCAndHJlZS12aWV3LWdpdC1zdGF0dXMuc2hvd1Byb2plY3RNb2RpZmllZFN0YXR1cydcbiAgICBAc2hvd0JyYW5jaExhYmVsID1cbiAgICAgIGF0b20uY29uZmlnLmdldCAndHJlZS12aWV3LWdpdC1zdGF0dXMuc2hvd0JyYW5jaExhYmVsJ1xuICAgIEBzaG93Q29tbWl0c0FoZWFkTGFiZWwgPVxuICAgICAgYXRvbS5jb25maWcuZ2V0ICd0cmVlLXZpZXctZ2l0LXN0YXR1cy5zaG93Q29tbWl0c0FoZWFkTGFiZWwnXG4gICAgQHNob3dDb21taXRzQmVoaW5kTGFiZWwgPVxuICAgICAgYXRvbS5jb25maWcuZ2V0ICd0cmVlLXZpZXctZ2l0LXN0YXR1cy5zaG93Q29tbWl0c0JlaGluZExhYmVsJ1xuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEB0cmVlVmlld1Jvb3RzTWFwID0gbmV3IE1hcFxuICAgIEBnaXRGbG93SGFuZGxlciA9IG5ldyBHaXRGbG93SGFuZGxlcih0aGlzKVxuXG4gICAgIyBCaW5kIGFnYWluc3QgZXZlbnRzIHdoaWNoIGFyZSBjYXVzaW5nIGFuIHVwZGF0ZSBvZiB0aGUgdHJlZSB2aWV3XG4gICAgQHN1YnNjcmliZVVwZGF0ZUNvbmZpZ3VyYXRpb25zKClcbiAgICBAc3Vic2NyaWJlVXBkYXRlVHJlZVZpZXcoKVxuXG4gICAgIyBUcmlnZ2VyIGluaXRhbCB1cGRhdGUgb2YgYWxsIHJvb3Qgbm9kZXNcbiAgICBAdXBkYXRlUm9vdHMgdHJ1ZVxuXG4gIGRlc3RydWN0OiAtPlxuICAgIEBjbGVhclRyZWVWaWV3Um9vdE1hcCgpXG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEBzdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIEB0cmVlVmlld1Jvb3RzTWFwID0gbnVsbFxuICAgIEBnaXRGbG93SGFuZGxlciA9IG51bGxcbiAgICBAcmVwb3NpdG9yeU1hcCA9IG51bGxcbiAgICBAcm9vdHMgPSBudWxsXG5cbiAgc3Vic2NyaWJlVXBkYXRlVHJlZVZpZXc6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMgPT5cbiAgICAgICAgQHVwZGF0ZVJvb3RzIHRydWVcbiAgICApXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3RyZWUtdmlldy5oaWRlVmNzSWdub3JlZEZpbGVzJywgPT5cbiAgICAgICAgQHVwZGF0ZVJvb3RzIHRydWVcbiAgICApXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3RyZWUtdmlldy5oaWRlSWdub3JlZE5hbWVzJywgPT5cbiAgICAgICAgQHVwZGF0ZVJvb3RzIHRydWVcbiAgICApXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2NvcmUuaWdub3JlZE5hbWVzJywgPT5cbiAgICAgICAgQHVwZGF0ZVJvb3RzIHRydWUgaWYgYXRvbS5jb25maWcuZ2V0ICd0cmVlLXZpZXcuaGlkZUlnbm9yZWROYW1lcydcbiAgICApXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3RyZWUtdmlldy5zb3J0Rm9sZGVyc0JlZm9yZUZpbGVzJywgPT5cbiAgICAgICAgQHVwZGF0ZVJvb3RzIHRydWVcbiAgICApXG5cbiAgc3Vic2NyaWJlVXBkYXRlQ29uZmlndXJhdGlvbnM6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSAndHJlZS12aWV3LWdpdC1zdGF0dXMuc2hvd1Byb2plY3RNb2RpZmllZFN0YXR1cycsXG4gICAgICAgIChuZXdWYWx1ZSkgPT5cbiAgICAgICAgICBpZiBAc2hvd1Byb2plY3RNb2RpZmllZFN0YXR1cyBpc250IG5ld1ZhbHVlXG4gICAgICAgICAgICBAc2hvd1Byb2plY3RNb2RpZmllZFN0YXR1cyA9IG5ld1ZhbHVlXG4gICAgICAgICAgICBAdXBkYXRlUm9vdHMoKVxuICAgIClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICd0cmVlLXZpZXctZ2l0LXN0YXR1cy5zaG93QnJhbmNoTGFiZWwnLFxuICAgICAgICAobmV3VmFsdWUpID0+XG4gICAgICAgICAgaWYgQHNob3dCcmFuY2hMYWJlbCBpc250IG5ld1ZhbHVlXG4gICAgICAgICAgICBAc2hvd0JyYW5jaExhYmVsID0gbmV3VmFsdWVcbiAgICAgICAgICBAdXBkYXRlUm9vdHMoKVxuICAgIClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICd0cmVlLXZpZXctZ2l0LXN0YXR1cy5zaG93Q29tbWl0c0FoZWFkTGFiZWwnLFxuICAgICAgICAobmV3VmFsdWUpID0+XG4gICAgICAgICAgaWYgQHNob3dDb21taXRzQWhlYWRMYWJlbCBpc250IG5ld1ZhbHVlXG4gICAgICAgICAgICBAc2hvd0NvbW1pdHNBaGVhZExhYmVsID0gbmV3VmFsdWVcbiAgICAgICAgICAgIEB1cGRhdGVSb290cygpXG4gICAgKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1naXQtc3RhdHVzLnNob3dDb21taXRzQmVoaW5kTGFiZWwnLFxuICAgICAgICAobmV3VmFsdWUpID0+XG4gICAgICAgICAgaWYgQHNob3dDb21taXRzQmVoaW5kTGFiZWwgaXNudCBuZXdWYWx1ZVxuICAgICAgICAgICAgQHNob3dDb21taXRzQmVoaW5kTGFiZWwgPSBuZXdWYWx1ZVxuICAgICAgICAgICAgQHVwZGF0ZVJvb3RzKClcbiAgICApXG5cbiAgc2V0UmVwb3NpdG9yaWVzOiAocmVwb3NpdG9yaWVzKSAtPlxuICAgIGlmIHJlcG9zaXRvcmllcz9cbiAgICAgIEByZXBvc2l0b3J5TWFwID0gcmVwb3NpdG9yaWVzXG4gICAgICBAdXBkYXRlUm9vdHMgdHJ1ZVxuXG4gIGNsZWFyVHJlZVZpZXdSb290TWFwOiAtPlxuICAgIEB0cmVlVmlld1Jvb3RzTWFwPy5mb3JFYWNoIChyb290LCByb290UGF0aCkgLT5cbiAgICAgIHJvb3Qucm9vdD8uY2xhc3NMaXN0Py5yZW1vdmUoJ3N0YXR1cy1tb2RpZmllZCcsICdzdGF0dXMtYWRkZWQnKVxuICAgICAgY3VzdG9tRWxlbWVudHMgPSByb290LmN1c3RvbUVsZW1lbnRzXG4gICAgICBpZiBjdXN0b21FbGVtZW50cz8uaGVhZGVyR2l0U3RhdHVzP1xuICAgICAgICByb290LnJvb3Q/LmhlYWRlcj8ucmVtb3ZlQ2hpbGQoY3VzdG9tRWxlbWVudHMuaGVhZGVyR2l0U3RhdHVzKVxuICAgICAgICBjdXN0b21FbGVtZW50cy5oZWFkZXJHaXRTdGF0dXMgPSBudWxsXG4gICAgQHRyZWVWaWV3Um9vdHNNYXA/LmNsZWFyKClcblxuICB1cGRhdGVSb290czogKHJlc2V0KSAtPlxuICAgIHJldHVybiBpZiBub3QgQHJlcG9zaXRvcnlNYXA/XG4gICAgaWYgc3RhdHVzVXBkYXRpbmdSb290cyBpcyBFTlVNX1VQREFURV9TVEFUVVMuTk9UX1VQREFUSU5HXG4gICAgICBzdGF0dXNVcGRhdGluZ1Jvb3RzID0gRU5VTV9VUERBVEVfU1RBVFVTLlVQREFUSU5HXG4gICAgICBAcm9vdHMgPSBAdHJlZVZpZXcucm9vdHNcbiAgICAgIEBjbGVhclRyZWVWaWV3Um9vdE1hcCgpIGlmIHJlc2V0XG4gICAgICB1cGRhdGVQcm9taXNlcyA9IFtdXG4gICAgICBmb3Igcm9vdCBpbiBAcm9vdHNcbiAgICAgICAgcm9vdFBhdGggPSB1dGlscy5ub3JtYWxpemVQYXRoIHJvb3QuZGlyZWN0b3J5TmFtZS5kYXRhc2V0LnBhdGhcbiAgICAgICAgaWYgcmVzZXRcbiAgICAgICAgICBAdHJlZVZpZXdSb290c01hcC5zZXQocm9vdFBhdGgsIHtyb290LCBjdXN0b21FbGVtZW50czoge319KVxuICAgICAgICByZXBvRm9yUm9vdCA9IG51bGxcbiAgICAgICAgcmVwb1N1YlBhdGggPSBudWxsXG4gICAgICAgIHJvb3RQYXRoSGFzR2l0Rm9sZGVyID0gZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocm9vdFBhdGgsICcuZ2l0JykpXG4gICAgICAgICMgV29ya2Fyb3VuZDogcmVwb1BheWggaXMgdGhlIHJlYWwgcGF0aCBvZiB0aGUgcmVwb3NpdG9yeS4gV2hlbiByb290UGF0aFxuICAgICAgICAjIGlzIGEgc3ltYm9saWMgbGluaywgYm90aCBkbyBub3Qgbm90IG1hdGNoIGFuZCB0aGUgcmVwb3NpdG9yeSBpcyBuZXZlclxuICAgICAgICAjIGZvdW5kLiBJbiB0aGlzIGNhc2UsIHdlIGV4cGFuZCB0aGUgc3ltYm9saWMgbGluaywgbWFrZSBpdCBhYnNvbHV0ZSBhbmRcbiAgICAgICAgIyBub3JtYWxpemUgaXQgdG8gbWFrZSBzdXJlIGl0IG1hdGNoZXMuXG4gICAgICAgIHJvb3RQYXRoTm9TeW1saW5rID0gcm9vdFBhdGhcbiAgICAgICAgaWYgKGZzLmlzU3ltYm9saWNMaW5rU3luYyhyb290UGF0aCkpXG4gICAgICAgICAgcm9vdFBhdGhOb1N5bWxpbmsgPSB1dGlscy5ub3JtYWxpemVQYXRoKGZzLnJlYWxwYXRoU3luYyhyb290UGF0aCkpXG4gICAgICAgIEByZXBvc2l0b3J5TWFwLmZvckVhY2ggKHJlcG8sIHJlcG9QYXRoKSAtPlxuICAgICAgICAgIGlmIG5vdCByZXBvRm9yUm9vdD8gYW5kICgocm9vdFBhdGhOb1N5bWxpbmsgaXMgcmVwb1BhdGgpIG9yXG4gICAgICAgICAgICAgIChyb290UGF0aE5vU3ltbGluay5pbmRleE9mKHJlcG9QYXRoKSBpcyAwIGFuZFxuICAgICAgICAgICAgICBub3Qgcm9vdFBhdGhIYXNHaXRGb2xkZXIpKVxuICAgICAgICAgICAgcmVwb1N1YlBhdGggPSBwYXRoLnJlbGF0aXZlIHJlcG9QYXRoLCByb290UGF0aE5vU3ltbGlua1xuICAgICAgICAgICAgcmVwb0ZvclJvb3QgPSByZXBvXG4gICAgICAgIGlmIHJlcG9Gb3JSb290P1xuICAgICAgICAgIGlmIG5vdCByZXBvRm9yUm9vdD9cbiAgICAgICAgICAgIHJlcG9Gb3JSb290ID0gbnVsbFxuICAgICAgICAgIHVwZGF0ZVByb21pc2VzLnB1c2goXG4gICAgICAgICAgICBAZG9VcGRhdGVSb290Tm9kZSByb290LCByZXBvRm9yUm9vdCwgcm9vdFBhdGgsIHJlcG9TdWJQYXRoXG4gICAgICAgICAgKVxuICAgICAgIyBXYWl0IHVudGlsIGFsbCByb290cyBoYXZlIGJlZW4gdXBkYXRlZCBhbmQgdGhlbiBjaGVja1xuICAgICAgIyBpZiB3ZSd2ZSBhIHF1ZXVlZCB1cGRhdGUgcm9vdHMgam9iXG4gICAgICB1dGlscy5zZXR0bGUodXBkYXRlUHJvbWlzZXMpXG4gICAgICAuY2F0Y2goKGVycikgLT5cbiAgICAgICAgIyBQcmludCBlcnJvcnMgaW4gY2FzZSB0aGVyZSBoYXZlIGJlZW4gYW55Li4uIGFuZCB0aGVuIGNvbnRpbnV0ZSB3aXRoXG4gICAgICAgICMgdGhlIGZvbGxvd2luZyB0aGVuIGJsb2NrXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZXJyXG4gICAgICApXG4gICAgICAudGhlbig9PlxuICAgICAgICBsYXN0U3RhdHVzID0gc3RhdHVzVXBkYXRpbmdSb290c1xuICAgICAgICBzdGF0dXNVcGRhdGluZ1Jvb3RzID0gRU5VTV9VUERBVEVfU1RBVFVTLk5PVF9VUERBVElOR1xuICAgICAgICBpZiBsYXN0U3RhdHVzIGlzIEVOVU1fVVBEQVRFX1NUQVRVUy5RVUVVRURcbiAgICAgICAgICBAdXBkYXRlUm9vdHMoKVxuICAgICAgICBlbHNlIGlmIGxhc3RTdGF0dXMgaXMgRU5VTV9VUERBVEVfU1RBVFVTLlFVRVVFRF9SRVNFVFxuICAgICAgICAgIEB1cGRhdGVSb290cyh0cnVlKVxuICAgICAgKVxuXG5cbiAgICBlbHNlIGlmIHN0YXR1c1VwZGF0aW5nUm9vdHMgaXMgRU5VTV9VUERBVEVfU1RBVFVTLlVQREFUSU5HXG4gICAgICBzdGF0dXNVcGRhdGluZ1Jvb3RzID0gRU5VTV9VUERBVEVfU1RBVFVTLlFVRVVFRFxuXG4gICAgaWYgc3RhdHVzVXBkYXRpbmdSb290cyBpcyBFTlVNX1VQREFURV9TVEFUVVMuUVVFVUVEIGFuZCByZXNldFxuICAgICAgc3RhdHVzVXBkYXRpbmdSb290cyA9IEVOVU1fVVBEQVRFX1NUQVRVUy5RVUVVRURfUkVTRVRcblxuICB1cGRhdGVSb290Rm9yUmVwbzogKHJlcG8sIHJlcG9QYXRoKSAtPlxuICAgIEB1cGRhdGVSb290cygpICMgVE9ETyBSZW1vdmUgd29ya2Fyb3VuZC4uLlxuICAgICMgVE9ETyBTb2x2ZSBjb25jdXJyZW5jeSBpc3N1ZXMgd2hlbiB1cGRhdGluZyB0aGUgcm9vdHNcbiAgICAjIGlmIEB0cmVlVmlldz8gYW5kIEB0cmVlVmlld1Jvb3RzTWFwP1xuICAgICMgICBAdHJlZVZpZXdSb290c01hcC5mb3JFYWNoIChyb290LCByb290UGF0aCkgPT5cbiAgICAjICAgICAjIENoZWNrIGlmIHRoZSByb290IHBhdGggaXMgc3ViIHBhdGggb2YgcmVwbyBwYXRoXG4gICAgIyAgICAgcmVwb1N1YlBhdGggPSBwYXRoLnJlbGF0aXZlIHJlcG9QYXRoLCByb290UGF0aFxuICAgICMgICAgIGlmIHJlcG9TdWJQYXRoLmluZGV4T2YoJy4uJykgaXNudCAwIGFuZCByb290LnJvb3Q/XG4gICAgIyAgICAgICBAZG9VcGRhdGVSb290Tm9kZSByb290LnJvb3QsIHJlcG8sIHJvb3RQYXRoLCByZXBvU3ViUGF0aFxuXG4gIGRvVXBkYXRlUm9vdE5vZGU6IChyb290LCByZXBvLCByb290UGF0aCwgcmVwb1N1YlBhdGgpIC0+XG4gICAgY3VzdG9tRWxlbWVudHMgPSBAdHJlZVZpZXdSb290c01hcC5nZXQocm9vdFBhdGgpLmN1c3RvbUVsZW1lbnRzXG4gICAgdXBkYXRlUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpXG5cbiAgICBpZiBAc2hvd1Byb2plY3RNb2RpZmllZFN0YXR1cyBhbmQgcmVwbz9cbiAgICAgIHVwZGF0ZVByb21pc2UgPSB1cGRhdGVQcm9taXNlLnRoZW4gKCkgLT5cbiAgICAgICAgaWYgcmVwb1N1YlBhdGggaXNudCAnJ1xuICAgICAgICAgIHJldHVybiByZXBvLmdldERpcmVjdG9yeVN0YXR1cyByZXBvU3ViUGF0aFxuICAgICAgICBlbHNlXG4gICAgICAgICAgIyBXb3JrYXJvdW5kIGZvciB0aGUgaXNzdWUgdGhhdCAnZ2V0RGlyZWN0b3J5U3RhdHVzJyBkb2Vzbid0IHdvcmtcbiAgICAgICAgICAjIG9uIHRoZSByZXBvc2l0b3J5IHJvb3QgZm9sZGVyXG4gICAgICAgICAgcmV0dXJuIHV0aWxzLmdldFJvb3REaXJlY3RvcnlTdGF0dXMgcmVwb1xuXG4gICAgcmV0dXJuIHVwZGF0ZVByb21pc2UudGhlbigoc3RhdHVzKSA9PlxuICAgICAgIyBTYW5pdHkgY2hlY2suLi5cbiAgICAgIHJldHVybiB1bmxlc3MgQHJvb3RzP1xuXG4gICAgICBjb252U3RhdHVzID0gQGNvbnZlcnREaXJlY3RvcnlTdGF0dXMgcmVwbywgc3RhdHVzXG4gICAgICByb290LmNsYXNzTGlzdC5yZW1vdmUoJ3N0YXR1cy1tb2RpZmllZCcsICdzdGF0dXMtYWRkZWQnKVxuICAgICAgcm9vdC5jbGFzc0xpc3QuYWRkKFwic3RhdHVzLSN7Y29udlN0YXR1c31cIikgaWYgY29udlN0YXR1cz9cblxuICAgICAgc2hvd0hlYWRlckdpdFN0YXR1cyA9IEBzaG93QnJhbmNoTGFiZWwgb3IgQHNob3dDb21taXRzQWhlYWRMYWJlbCBvclxuICAgICAgICAgIEBzaG93Q29tbWl0c0JlaGluZExhYmVsXG5cbiAgICAgIGlmIHNob3dIZWFkZXJHaXRTdGF0dXMgYW5kIHJlcG8/IGFuZCBub3QgY3VzdG9tRWxlbWVudHMuaGVhZGVyR2l0U3RhdHVzP1xuICAgICAgICBoZWFkZXJHaXRTdGF0dXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgaGVhZGVyR2l0U3RhdHVzLmNsYXNzTGlzdC5hZGQoJ3RyZWUtdmlldy1naXQtc3RhdHVzJylcbiAgICAgICAgcmV0dXJuIEBnZW5lcmF0ZUdpdFN0YXR1c1RleHQoaGVhZGVyR2l0U3RhdHVzLCByZXBvKS50aGVuIC0+XG4gICAgICAgICAgY3VzdG9tRWxlbWVudHMuaGVhZGVyR2l0U3RhdHVzID0gaGVhZGVyR2l0U3RhdHVzXG4gICAgICAgICAgcm9vdC5oZWFkZXIuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgaGVhZGVyR2l0U3RhdHVzLCByb290LmRpcmVjdG9yeU5hbWUubmV4dFNpYmxpbmdcbiAgICAgICAgICApXG4gICAgICBlbHNlIGlmIHNob3dIZWFkZXJHaXRTdGF0dXMgYW5kIGN1c3RvbUVsZW1lbnRzLmhlYWRlckdpdFN0YXR1cz9cbiAgICAgICAgcmV0dXJuIEBnZW5lcmF0ZUdpdFN0YXR1c1RleHQgY3VzdG9tRWxlbWVudHMuaGVhZGVyR2l0U3RhdHVzLCByZXBvXG4gICAgICBlbHNlIGlmIGN1c3RvbUVsZW1lbnRzLmhlYWRlckdpdFN0YXR1cz9cbiAgICAgICAgcm9vdC5oZWFkZXIucmVtb3ZlQ2hpbGQoY3VzdG9tRWxlbWVudHMuaGVhZGVyR2l0U3RhdHVzKVxuICAgICAgICBjdXN0b21FbGVtZW50cy5oZWFkZXJHaXRTdGF0dXMgPSBudWxsXG4gICAgKVxuXG4gIGdlbmVyYXRlR2l0U3RhdHVzVGV4dDogKGNvbnRhaW5lciwgcmVwbykgLT5cbiAgICBkaXNwbGF5ID0gZmFsc2VcbiAgICBoZWFkID0gbnVsbFxuICAgIGFoZWFkID0gYmVoaW5kID0gMFxuXG4gICAgIyBFbnN1cmUgcmVwbyBzdGF0dXMgaXMgdXAtdG8tZGF0ZVxuICAgIHJlcG8ucmVmcmVzaFN0YXR1cygpXG4gICAgICAudGhlbiAtPlxuICAgICAgICByZXR1cm4gcmVwby5nZXRTaG9ydEhlYWQoKVxuICAgICAgICAgIC50aGVuKChzaG9ydGhlYWQpIC0+XG4gICAgICAgICAgICBoZWFkID0gc2hvcnRoZWFkXG4gICAgICAgICAgKVxuICAgICAgLnRoZW4gLT5cbiAgICAgICAgIyBTYW5pdHkgY2hlY2sgaW4gY2FzZSBvZiB0aGlyZHBhcnR5IHJlcG9zLi4uXG4gICAgICAgIGlmIHJlcG8uZ2V0Q2FjaGVkVXBzdHJlYW1BaGVhZEJlaGluZENvdW50P1xuICAgICAgICAgIHJldHVybiByZXBvLmdldENhY2hlZFVwc3RyZWFtQWhlYWRCZWhpbmRDb3VudCgpXG4gICAgICAgICAgLnRoZW4oKGNvdW50KSAtPlxuICAgICAgICAgICAge2FoZWFkLCBiZWhpbmR9ID0gY291bnRcbiAgICAgICAgICApXG4gICAgICAudGhlbiA9PlxuICAgICAgICBhc3luY0V2ZW50cyA9IFtdXG4gICAgICAgICMgUmVzZXQgc3R5bGVzXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSAgJydcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3RyZWUtdmlldy1naXQtc3RhdHVzJylcblxuICAgICAgICBpZiBAc2hvd0JyYW5jaExhYmVsIGFuZCBoZWFkP1xuICAgICAgICAgIGJyYW5jaExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgICAgYnJhbmNoTGFiZWwuY2xhc3NMaXN0LmFkZCgnYnJhbmNoLWxhYmVsJylcbiAgICAgICAgICAjIENoZWNrIGlmIGJyYW5jaCBuYW1lIGNhbiBiZSBhIHZhbGlkIENTUyBjbGFzc1xuICAgICAgICAgIGlmIC9eW2Etel8tXVthLXpcXGRfLV0qJC9pLnRlc3QoaGVhZClcbiAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdnaXQtYnJhbmNoLScgKyBoZWFkKVxuICAgICAgICAgIGJyYW5jaExhYmVsLnRleHRDb250ZW50ID0gaGVhZFxuXG4gICAgICAgICAgIyBGb3J3YXJkIHRvIEdpdEZsb3dIYW5kbGVyLCB0aGlzIG1ldGhvZCBydW5zIGFzeW5jXG4gICAgICAgICAgYXN5bmNFdmVudHMucHVzaChcbiAgICAgICAgICAgIEBnaXRGbG93SGFuZGxlci5lbmhhbmNlQnJhbmNoTmFtZSBicmFuY2hMYWJlbCwgcmVwb1xuICAgICAgICAgIClcblxuICAgICAgICAgICMgTWFyayBhcyBkaXNwbGF5YWJsZVxuICAgICAgICAgIGRpc3BsYXkgPSB0cnVlXG4gICAgICAgIGlmIEBzaG93Q29tbWl0c0FoZWFkTGFiZWwgYW5kIGFoZWFkID4gMFxuICAgICAgICAgIGNvbW1pdHNBaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgICAgIGNvbW1pdHNBaGVhZC5jbGFzc0xpc3QuYWRkKCdjb21taXRzLWFoZWFkLWxhYmVsJylcbiAgICAgICAgICBjb21taXRzQWhlYWQudGV4dENvbnRlbnQgPSBhaGVhZFxuICAgICAgICAgIGRpc3BsYXkgPSB0cnVlXG4gICAgICAgIGlmIEBzaG93Q29tbWl0c0JlaGluZExhYmVsIGFuZCBiZWhpbmQgPiAwXG4gICAgICAgICAgY29tbWl0c0JlaGluZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgICAgIGNvbW1pdHNCZWhpbmQuY2xhc3NMaXN0LmFkZCgnY29tbWl0cy1iZWhpbmQtbGFiZWwnKVxuICAgICAgICAgIGNvbW1pdHNCZWhpbmQudGV4dENvbnRlbnQgPSBiZWhpbmRcbiAgICAgICAgICBkaXNwbGF5ID0gdHJ1ZVxuXG4gICAgICAgIGlmIGRpc3BsYXlcbiAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG5cbiAgICAgICAgIyBXYWl0IGZvciBhbGwgYXN5bmMgbWV0aG9kcyB0byBjb21wbGV0ZSwgb3IgcmVzb2x2ZSBpbnN0YW50bHlcbiAgICAgICAgIyBpZiB0aGUgYXJyYXkgaXMgZW1wdHkuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChhc3luY0V2ZW50cykudGhlbiAtPlxuICAgICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCBicmFuY2hMYWJlbCBpZiBicmFuY2hMYWJlbD9cbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQgY29tbWl0c0FoZWFkIGlmIGNvbW1pdHNBaGVhZD9cbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQgY29tbWl0c0JlaGluZCBpZiBjb21taXRzQmVoaW5kP1xuXG4gIGNvbnZlcnREaXJlY3RvcnlTdGF0dXM6IChyZXBvLCBzdGF0dXMpIC0+XG4gICAgbmV3U3RhdHVzID0gbnVsbFxuICAgIGlmIHJlcG8uaXNTdGF0dXNNb2RpZmllZChzdGF0dXMpXG4gICAgICBuZXdTdGF0dXMgPSAnbW9kaWZpZWQnXG4gICAgZWxzZSBpZiByZXBvLmlzU3RhdHVzTmV3KHN0YXR1cylcbiAgICAgIG5ld1N0YXR1cyA9ICdhZGRlZCdcbiAgICByZXR1cm4gbmV3U3RhdHVzXG4iXX0=
