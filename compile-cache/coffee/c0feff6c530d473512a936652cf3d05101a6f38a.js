(function() {
  var CompositeDisposable, GitFlowData, GitFlowHandler, GitRepositoryAsync, flowIconMap;

  CompositeDisposable = require('atom').CompositeDisposable;

  GitRepositoryAsync = require('./gitrepositoryasync');

  flowIconMap = {
    feature: 'puzzle',
    release: 'package',
    hotfix: 'flame',
    develop: 'home',
    master: 'verified'
  };

  GitFlowData = (function() {
    GitFlowData.prototype.master = null;

    GitFlowData.prototype.develop = null;

    GitFlowData.prototype.feature = null;

    GitFlowData.prototype.release = null;

    GitFlowData.prototype.hotfix = null;

    function GitFlowData(repo) {
      if (!(repo instanceof GitRepositoryAsync)) {
        return;
      }
      repo = repo.repo;
      this.master = repo.getConfigValue('gitflow.branch.master');
      this.develop = repo.getConfigValue('gitflow.branch.develop');
      this.feature = repo.getConfigValue('gitflow.prefix.feature');
      this.release = repo.getConfigValue('gitflow.prefix.release');
      this.hotfix = repo.getConfigValue('gitflow.prefix.hotfix');
    }

    return GitFlowData;

  })();

  module.exports = GitFlowHandler = (function() {
    var startsWith;

    GitFlowHandler.prototype.treeViewUi = null;

    GitFlowHandler.prototype.subscriptions = null;

    function GitFlowHandler(treeViewUi) {
      this.treeViewUi = treeViewUi;
      this.gitFlowEnabled = atom.config.get('tree-view-git-status.gitFlow.enabled');
      this.gitFlowDisplayType = atom.config.get('tree-view-git-status.gitFlow.display_type');
      this.subscriptions = new CompositeDisposable;
      this.subscribeUpdateConfigurations();
    }

    GitFlowHandler.prototype.destruct = function() {
      var ref;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      return this.subscriptions = null;
    };

    GitFlowHandler.prototype.subscribeUpdateConfigurations = function() {
      this.subscriptions.add(atom.config.observe('tree-view-git-status.gitFlow.enabled', (function(_this) {
        return function(newValue) {
          if (_this.gitFlowEnabled !== newValue) {
            _this.gitFlowEnabled = newValue;
            return _this.updateRoots();
          }
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('tree-view-git-status.gitFlow.display_type', (function(_this) {
        return function(newValue) {
          if (_this.gitFlowDisplayType !== newValue) {
            _this.gitFlowDisplayType = newValue;
            return _this.updateRoots();
          }
        };
      })(this)));
    };

    GitFlowHandler.prototype.updateRoots = function() {
      return this.treeViewUi.updateRoots();
    };

    startsWith = function(name, prefix) {
      return prefix === name.substr(0, prefix.length);
    };

    GitFlowHandler.prototype.getFlowConfig = function(repo) {
      return new GitFlowData(repo);
    };

    GitFlowHandler.prototype.applyGitFlowConfig = function(node, gitFlow) {
      var branchName, branchPrefix, iconNode, prefixNode, stateName, workType;
      if (!(node && gitFlow && this.gitFlowEnabled)) {
        return;
      }
      branchPrefix = '';
      branchName = node.textContent;
      workType = branchName;
      if ((gitFlow.feature != null) && startsWith(branchName, gitFlow.feature)) {
        stateName = 'feature';
        branchPrefix = gitFlow.feature;
        workType = 'a feature';
      } else if ((gitFlow.release != null) && startsWith(branchName, gitFlow.release)) {
        stateName = 'release';
        branchPrefix = gitFlow.release;
        workType = 'a release';
      } else if ((gitFlow.hotfix != null) && startsWith(branchName, gitFlow.hotfix)) {
        stateName = 'hotfix';
        branchPrefix = gitFlow.hotfix;
        workType = 'a hotfix';
      } else if ((gitFlow.develop != null) && branchName === gitFlow.develop) {
        stateName = 'develop';
      } else if ((gitFlow.master != null) && branchName === gitFlow.master) {
        stateName = 'master';
      } else {
        return;
      }
      node.dataset.gitFlowState = stateName;
      node.innerText = '';
      node.classList.add('branch-label--flow', "branch-label--flow-" + stateName);
      if (branchPrefix) {
        branchName = branchName.substr(branchPrefix.length);
      } else {
        branchPrefix = branchName;
        branchName = '';
      }
      if (this.gitFlowDisplayType > 1) {
        iconNode = document.createElement('span');
        iconNode.classList.add("icon", "icon-" + flowIconMap[stateName], 'branch-label__icon', "branch-label__icon--" + stateName);
        iconNode.title = "Working on " + workType;
        node.appendChild(iconNode);
      }
      if (branchName === '' || this.gitFlowDisplayType < 3) {
        prefixNode = document.createElement('span');
        prefixNode.classList.add('branch-label__prefix', "branch-label__prefix--" + stateName);
        prefixNode.textContent = branchPrefix;
        node.appendChild(prefixNode);
      }
      if (branchName !== '') {
        return node.appendChild(document.createTextNode(branchName));
      }
    };

    GitFlowHandler.prototype.convertDirectoryStatus = function(repo, status) {
      var newStatus;
      newStatus = null;
      if (repo.isStatusModified(status)) {
        newStatus = 'modified';
      } else if (repo.isStatusNew(status)) {
        newStatus = 'added';
      }
      return newStatus;
    };

    GitFlowHandler.prototype.enhanceBranchName = function(node, repo) {
      if (!this.gitFlowEnabled) {
        return Promise.resolve();
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var flowData;
          flowData = _this.getFlowConfig(repo);
          if (flowData) {
            _this.applyGitFlowConfig(node, flowData);
          }
          return resolve();
        };
      })(this));
    };

    return GitFlowHandler;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90cmVlLXZpZXctZ2l0LXN0YXR1cy9saWIvZ2l0Zmxvd2hhbmRsZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxzQkFBUjs7RUFFckIsV0FBQSxHQUNFO0lBQUEsT0FBQSxFQUFTLFFBQVQ7SUFDQSxPQUFBLEVBQVMsU0FEVDtJQUVBLE1BQUEsRUFBUSxPQUZSO0lBR0EsT0FBQSxFQUFTLE1BSFQ7SUFJQSxNQUFBLEVBQVEsVUFKUjs7O0VBT0k7MEJBQ0osTUFBQSxHQUFROzswQkFDUixPQUFBLEdBQVM7OzBCQUNULE9BQUEsR0FBUzs7MEJBQ1QsT0FBQSxHQUFTOzswQkFDVCxNQUFBLEdBQVE7O0lBRUsscUJBQUMsSUFBRDtNQUNYLElBQUEsQ0FBQSxDQUFjLElBQUEsWUFBZ0Isa0JBQTlCLENBQUE7QUFBQSxlQUFBOztNQUNBLElBQUEsR0FBTyxJQUFJLENBQUM7TUFDWixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxjQUFMLENBQW9CLHVCQUFwQjtNQUNWLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxDQUFDLGNBQUwsQ0FBb0Isd0JBQXBCO01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJLENBQUMsY0FBTCxDQUFvQix3QkFBcEI7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQyxjQUFMLENBQW9CLHdCQUFwQjtNQUNYLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLGNBQUwsQ0FBb0IsdUJBQXBCO0lBUEM7Ozs7OztFQVVmLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLFFBQUE7OzZCQUFBLFVBQUEsR0FBWTs7NkJBQ1osYUFBQSxHQUFlOztJQUVGLHdCQUFDLFVB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SSxDQUFDLGdCQUFMLENBQXNCLE1BQXRCLENBQUg7UUFDRSxTQUFBLEdBQVksV0FEZDtPQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsV0FBTCxDQUFpQixNQUFqQixDQUFIO1FBQ0gsU0FBQSxHQUFZLFFBRFQ7O0FBRUwsYUFBTztJQU5lOzs2QkFReEIsaUJBQUEsR0FBbUIsU0FBQyxJQUFELEVBQU8sSUFBUDtNQUNqQixJQUFHLENBQUksSUFBQyxDQUFBLGNBQVI7QUFDRSxlQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsRUFEVDs7QUFFQSxhQUFPLElBQUksT0FBSixDQUFZLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNqQixjQUFBO1VBQUEsUUFBQSxHQUFXLEtBQUMsQ0FBQSxhQUFELENBQWUsSUFBZjtVQUNYLElBQUcsUUFBSDtZQUNFLEtBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFwQixFQUEwQixRQUExQixFQURGOztpQkFFQSxPQUFBLENBQUE7UUFKaUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVo7SUFIVTs7Ozs7QUE1SXJCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbkdpdFJlcG9zaXRvcnlBc3luYyA9IHJlcXVpcmUgJy4vZ2l0cmVwb3NpdG9yeWFzeW5jJ1xuXG5mbG93SWNvbk1hcCA9XG4gIGZlYXR1cmU6ICdwdXp6bGUnXG4gIHJlbGVhc2U6ICdwYWNrYWdlJ1xuICBob3RmaXg6ICdmbGFtZSdcbiAgZGV2ZWxvcDogJ2hvbWUnXG4gIG1hc3RlcjogJ3ZlcmlmaWVkJ1xuXG5cbmNsYXNzIEdpdEZsb3dEYXRhXG4gIG1hc3RlcjogbnVsbFxuICBkZXZlbG9wOiBudWxsXG4gIGZlYXR1cmU6IG51bGxcbiAgcmVsZWFzZTogbnVsbFxuICBob3RmaXg6IG51bGxcblxuICBjb25zdHJ1Y3RvcjogKHJlcG8pIC0+XG4gICAgcmV0dXJuIHVubGVzcyByZXBvIGluc3RhbmNlb2YgR2l0UmVwb3NpdG9yeUFzeW5jXG4gICAgcmVwbyA9IHJlcG8ucmVwb1xuICAgIEBtYXN0ZXIgPSByZXBvLmdldENvbmZpZ1ZhbHVlKCdnaXRmbG93LmJyYW5jaC5tYXN0ZXInKVxuICAgIEBkZXZlbG9wID0gcmVwby5nZXRDb25maWdWYWx1ZSgnZ2l0Zmxvdy5icmFuY2guZGV2ZWxvcCcpXG4gICAgQGZlYXR1cmUgPSByZXBvLmdldENvbmZpZ1ZhbHVlKCdnaXRmbG93LnByZWZpeC5mZWF0dXJlJylcbiAgICBAcmVsZWFzZSA9IHJlcG8uZ2V0Q29uZmlnVmFsdWUoJ2dpdGZsb3cucHJlZml4LnJlbGVhc2UnKVxuICAgIEBob3RmaXggPSByZXBvLmdldENvbmZpZ1ZhbHVlKCdnaXRmbG93LnByZWZpeC5ob3RmaXgnKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2l0Rmxvd0hhbmRsZXJcbiAgdHJlZVZpZXdVaTogbnVsbFxuICBzdWJzY3JpcHRpb25zOiBudWxsXG5cbiAgY29uc3RydWN0b3I6IChAdHJlZVZpZXdVaSkgLT5cbiAgICBAZ2l0Rmxvd0VuYWJsZWQgPVxuICAgICAgYXRvbS5jb25maWcuZ2V0KCd0cmVlLXZpZXctZ2l0LXN0YXR1cy5naXRGbG93LmVuYWJsZWQnKVxuICAgIEBnaXRGbG93RGlzcGxheVR5cGUgPVxuICAgICAgYXRvbS5jb25maWcuZ2V0KCd0cmVlLXZpZXctZ2l0LXN0YXR1cy5naXRGbG93LmRpc3BsYXlfdHlwZScpXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpYmVVcGRhdGVDb25maWd1cmF0aW9ucygpXG5cbiAgZGVzdHJ1Y3Q6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEBzdWJzY3JpcHRpb25zID0gbnVsbFxuXG4gIHN1YnNjcmliZVVwZGF0ZUNvbmZpZ3VyYXRpb25zOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1naXQtc3RhdHVzLmdpdEZsb3cuZW5hYmxlZCcsXG4gICAgICAgIChuZXdWYWx1ZSkgPT5cbiAgICAgICAgICBpZiBAZ2l0Rmxvd0VuYWJsZWQgaXNudCBuZXdWYWx1ZVxuICAgICAgICAgICAgQGdpdEZsb3dFbmFibGVkID0gbmV3VmFsdWVcbiAgICAgICAgICAgIEB1cGRhdGVSb290cygpXG4gICAgKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1naXQtc3RhdHVzLmdpdEZsb3cuZGlzcGxheV90eXBlJyxcbiAgICAgICAgKG5ld1ZhbHVlKSA9PlxuICAgICAgICAgIGlmIEBnaXRGbG93RGlzcGxheVR5cGUgaXNudCBuZXdWYWx1ZVxuICAgICAgICAgICAgQGdpdEZsb3dEaXNwbGF5VHlwZSA9IG5ld1ZhbHVlXG4gICAgICAgICAgICBAdXBkYXRlUm9vdHMoKVxuICAgIClcblxuICB1cGRhdGVSb290czogLT5cbiAgICBAdHJlZVZpZXdVaS51cGRhdGVSb290cygpXG5cbiAgc3RhcnRzV2l0aCA9IChuYW1lLCBwcmVmaXgpIC0+XG4gICAgcHJlZml4ID09IG5hbWUuc3Vic3RyKDAsIHByZWZpeC5sZW5ndGgpXG5cbiAgZ2V0Rmxvd0NvbmZpZzogKHJlcG8pIC0+IG5ldyBHaXRGbG93RGF0YShyZXBvKVxuXG4gIGFwcGx5R2l0Rmxvd0NvbmZpZzogKG5vZGUsIGdpdEZsb3cpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBub2RlIGFuZCBnaXRGbG93IGFuZCBAZ2l0Rmxvd0VuYWJsZWRcbiAgICBicmFuY2hQcmVmaXggPSAnJ1xuICAgIGJyYW5jaE5hbWUgPSBub2RlLnRleHRDb250ZW50XG4gICAgd29ya1R5cGUgPSBicmFuY2hOYW1lXG4gICAgIyBBZGQgR2l0IEZsb3cgaW5mb3JtYXRpb25cbiAgICBpZiBnaXRGbG93LmZlYXR1cmU/IGFuZCBzdGFydHNXaXRoKGJyYW5jaE5hbWUsIGdpdEZsb3cuZmVhdHVyZSlcbiAgICAgIHN0YXRlTmFtZSA9ICdmZWF0dXJlJ1xuICAgICAgYnJhbmNoUHJlZml4ID0gZ2l0Rmxvdy5mZWF0dXJlXG4gICAgICB3b3JrVHlwZSA9ICdhIGZlYXR1cmUnXG4gICAgZWxzZSBpZiBnaXRGbG93LnJlbGVhc2U/IGFuZCBzdGFydHNXaXRoKGJyYW5jaE5hbWUsIGdpdEZsb3cucmVsZWFzZSlcbiAgICAgIHN0YXRlTmFtZSA9ICdyZWxlYXNlJ1xuICAgICAgYnJhbmNoUHJlZml4ID0gZ2l0Rmxvdy5yZWxlYXNlXG4gICAgICB3b3JrVHlwZSA9ICdhIHJlbGVhc2UnXG4gICAgZWxzZSBpZiBnaXRGbG93LmhvdGZpeD8gYW5kIHN0YXJ0c1dpdGgoYnJhbmNoTmFtZSwgZ2l0Rmxvdy5ob3RmaXgpXG4gICAgICBzdGF0ZU5hbWUgPSAnaG90Zml4J1xuICAgICAgYnJhbmNoUHJlZml4ID0gZ2l0Rmxvdy5ob3RmaXhcbiAgICAgIHdvcmtUeXBlID0gJ2EgaG90Zml4J1xuICAgIGVsc2UgaWYgZ2l0Rmxvdy5kZXZlbG9wPyBhbmQgYnJhbmNoTmFtZSA9PSBnaXRGbG93LmRldmVsb3BcbiAgICAgIHN0YXRlTmFtZSA9ICdkZXZlbG9wJ1xuICAgIGVsc2UgaWYgZ2l0Rmxvdy5tYXN0ZXI/IGFuZCBicmFuY2hOYW1lID09IGdpdEZsb3cubWFzdGVyXG4gICAgICBzdGF0ZU5hbWUgPSAnbWFzdGVyJ1xuICAgIGVsc2VcbiAgICAgICMgV2UncmUgbm90IG9uIGEgR2l0IEZsb3cgYnJhbmNoLCBkb24ndCBkbyBhbnl0aGluZ1xuICAgICAgcmV0dXJuXG4gICAgIyBBZGQgYSBkYXRhLWZsb3cgYXR0cmlidXRlXG4gICAgbm9kZS5kYXRhc2V0LmdpdEZsb3dTdGF0ZSA9IHN0YXRlTmFtZVxuICAgIG5vZGUuaW5uZXJUZXh0ID0gJydcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoXG4gICAgICAnYnJhbmNoLWxhYmVsLS1mbG93JyxcbiAgICAgIFwiYnJhbmNoLWxhYmVsLS1mbG93LSN7c3RhdGVOYW1lfVwiXG4gICAgKVxuICAgICMgUmVtb3ZlIHRoZSBwcmVmaXggZnJvbSB0aGUgYnJhbmNobmFtZSwgb3IgbW92ZSB0aGUgYnJhbmNobmFtZSB0byB0aGVcbiAgICAjIHByZWZpeCBpbiBjYXNlIG9mIG1hc3RlciAvIGRldmVsb3BcbiAgICBpZiBicmFuY2hQcmVmaXhcbiAgICAgIGJyYW5jaE5hbWUgPSBicmFuY2hOYW1lLnN1YnN0cihicmFuY2hQcmVmaXgubGVuZ3RoKVxuICAgIGVsc2VcbiAgICAgIGJyYW5jaFByZWZpeCA9IGJyYW5jaE5hbWVcbiAgICAgIGJyYW5jaE5hbWUgPSAnJ1xuICAgICMgSWYgd2Ugd2FudCB0byB1c2UgaWNvbnMsIG1ha2Ugc3VyZSB3ZSByZW1vdmUgdGhlIHByZWZpeFxuICAgIGlmIEBnaXRGbG93RGlzcGxheVR5cGUgPiAxXG4gICAgICBpY29uTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgaWNvbk5vZGUuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgXCJpY29uXCIsXG4gICAgICAgIFwiaWNvbi0je2Zsb3dJY29uTWFwW3N0YXRlTmFtZV19XCJcbiAgICAgICAgJ2JyYW5jaC1sYWJlbF9faWNvbidcbiAgICAgICAgXCJicmFuY2gtbGFiZWxfX2ljb24tLSN7c3RhdGVOYW1lfVwiXG4gICAgICApXG4gICAgICBpY29uTm9kZS50aXRsZSA9IFwiV29ya2luZyBvbiAje3dvcmtUeXBlfVwiXG4gICAgICBub2RlLmFwcGVuZENoaWxkKGljb25Ob2RlKVxuICAgICMgSWYgd2UncmUgYXNrZWQgdG8gZGlzcGxheSB0aGUgcHJlZml4IG9yIHdlJ3JlIG9uIG1hc3Rlci9kZXZlbG9wLCBkaXNwbGF5XG4gICAgIyBpdC5cbiAgICBpZiBicmFuY2hOYW1lID09ICcnIG9yIEBnaXRGbG93RGlzcGxheVR5cGUgPCAzXG4gICAgICBwcmVmaXhOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICBwcmVmaXhOb2RlLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgICdicmFuY2gtbGFiZWxfX3ByZWZpeCdcbiAgICAgICAgXCJicmFuY2gtbGFiZWxfX3ByZWZpeC0tI3tzdGF0ZU5hbWV9XCJcbiAgICAgIClcbiAgICAgIHByZWZpeE5vZGUudGV4dENvbnRlbnQgPSBicmFuY2hQcmVmaXhcbiAgICAgIG5vZGUuYXBwZW5kQ2hpbGQocHJlZml4Tm9kZSlcbiAgICAjIEZpbmFsbHksIGlmIHdlIGhhdmUgYSBicmFuY2huYW1lIGxlZnQgb3ZlciwgYWRkIGl0IGFzIHdlbGwuXG4gICAgaWYgYnJhbmNoTmFtZSAhPSAnJ1xuICAgICAgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShicmFuY2hOYW1lKSlcblxuICBjb252ZXJ0RGlyZWN0b3J5U3RhdHVzOiAocmVwbywgc3RhdHVzKSAtPlxuICAgIG5ld1N0YXR1cyA9IG51bGxcbiAgICBpZiByZXBvLmlzU3RhdHVzTW9kaWZpZWQoc3RhdHVzKVxuICAgICAgbmV3U3RhdHVzID0gJ21vZGlmaWVkJ1xuICAgIGVsc2UgaWYgcmVwby5pc1N0YXR1c05ldyhzdGF0dXMpXG4gICAgICBuZXdTdGF0dXMgPSAnYWRkZWQnXG4gICAgcmV0dXJuIG5ld1N0YXR1c1xuXG4gIGVuaGFuY2VCcmFuY2hOYW1lOiAobm9kZSwgcmVwbykgLT5cbiAgICBpZiBub3QgQGdpdEZsb3dFbmFibGVkXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIGZsb3dEYXRhID0gQGdldEZsb3dDb25maWcocmVwbylcbiAgICAgIGlmIGZsb3dEYXRhXG4gICAgICAgIEBhcHBseUdpdEZsb3dDb25maWcobm9kZSwgZmxvd0RhdGEpXG4gICAgICByZXNvbHZlKClcbiAgICApXG4iXX0=
