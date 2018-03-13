(function() {
  var $$, ListView, OutputViewManager, RemoteBranchListView, SelectListView, _pull, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  _pull = require('../models/_pull');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  RemoteBranchListView = require('./remote-branch-list-view');

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data1, arg1) {
      var ref1;
      this.repo = repo;
      this.data = data1;
      ref1 = arg1 != null ? arg1 : {}, this.mode = ref1.mode, this.tag = ref1.tag, this.extraArgs = ref1.extraArgs;
      ListView.__super__.initialize.apply(this, arguments);
      if (this.tag == null) {
        this.tag = '';
      }
      if (this.extraArgs == null) {
        this.extraArgs = [];
      }
      this.show();
      this.parseData();
      return this.result = new Promise((function(_this) {
        return function(resolve1, reject1) {
          _this.resolve = resolve1;
          _this.reject = reject1;
        };
      })(this));
    };

    ListView.prototype.parseData = function() {
      var items, remotes;
      items = this.data.split("\n");
      remotes = items.filter(function(item) {
        return item !== '';
      }).map(function(item) {
        return {
          name: item
        };
      });
      if (remotes.length === 1) {
        return this.confirmed(remotes[0]);
      } else {
        this.setItems(remotes);
        return this.focusFilterEditor();
      }
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(arg1) {
      var name;
      name = arg1.name;
      return $$(function() {
        return this.li(name);
      });
    };

    ListView.prototype.pull = function(remoteName) {
      if (atom.config.get('git-plus.remoteInteractions.promptForBranch')) {
        return git.cmd(['branch', '--no-color', '-r'], {
          cwd: this.repo.getWorkingDirectory()
        }).then((function(_this) {
          return function(data) {
            return new Promise(function(resolve, reject) {
              return new RemoteBranchListView(data, remoteName, function(arg1) {
                var args, branchName, name, startMessage, view;
                name = arg1.name;
                branchName = name.substring(name.indexOf('/') + 1);
                view = OutputViewManager.getView();
                startMessage = notifier.addInfo("Pulling...", {
                  dismissable: true
                });
                args = ['pull'].concat(_this.extraArgs, remoteName, branchName).filter(function(arg) {
                  return arg !== '';
                });
                return git.cmd(args, {
                  cwd: _this.repo.getWorkingDirectory()
                }, {
                  color: true
                }).then(function(data) {
                  resolve(branchName);
                  view.showContent(data);
                  startMessage.dismiss();
                  return git.refresh(_this.repo);
                })["catch"](function(error) {
                  reject();
                  view.showContent(error);
                  return startMessage.dismiss();
                });
              });
            });
          };
        })(this));
      } else {
        return _pull(this.repo, {
          extraArgs: this.extraArgs
        });
      }
    };

    ListView.prototype.confirmed = function(arg1) {
      var name, pullBeforePush;
      name = arg1.name;
      if (this.mode === 'pull') {
        this.pull(name);
      } else if (this.mode === 'fetch-prune') {
        this.mode = 'fetch';
        this.execute(name, '--prune');
      } else if (this.mode === 'push') {
        pullBeforePush = atom.config.get('git-plus.remoteInteractions.pullBeforePush');
        if (pullBeforePush && atom.config.get('git-plus.remoteInteractions.pullRebase')) {
          this.extraArgs = '--rebase';
        }
        if (pullBeforePush) {
          this.pull(name).then((function(_this) {
            return function(branch) {
              return _this.execute(name, null, branch);
            };
          })(this));
        } else {
          this.execute(name);
        }
      } else if (this.mode === 'push -u') {
        this.pushAndSetUpstream(name);
      } else {
        this.execute(name);
      }
      return this.cancel();
    };

    ListView.prototype.execute = function(remote, extraArgs, branch) {
      var args, message, startMessage, view;
      if (remote == null) {
        remote = '';
      }
      if (extraArgs == null) {
        extraArgs = '';
      }
      if (atom.config.get('git-plus.remoteInteractions.promptForBranch')) {
        if (branch != null) {
          view = OutputViewManager.getView();
          args = [this.mode];
          if (extraArgs.length > 0) {
            args.push(extraArgs);
          }
          args = args.concat([remote, branch]);
          message = (this.mode[0].toUpperCase() + this.mode.substring(1)) + "ing...";
          startMessage = notifier.addInfo(message, {
            dismissable: true
          });
          return git.cmd(args, {
            cwd: this.repo.getWorkingDirectory()
          }, {
            color: true
          }).then((function(_this) {
            return function(data) {
              if (data !== '') {
                view.showContent(data);
              }
              startMessage.dismiss();
              return git.refresh(_this.repo);
            };
          })(this))["catch"]((function(_this) {
            return function(data) {
              if (data !== '') {
                view.showContent(data);
              }
              return startMessage.dismiss();
            };
          })(this));
        } else {
          return git.cmd(['branch', '--no-color', '-r'], {
            cwd: this.repo.getWorkingDirectory()
          }).then((function(_this) {
            return function(data) {
              return new RemoteBranchListView(data, remote, function(arg1) {
                var branchName, name;
                name = arg1.name;
                branchName = name.substring(name.indexOf('/') + 1);
                view = OutputViewManager.getView();
                startMessage = notifier.addInfo("Pushing...", {
                  dismissable: true
                });
                args = ['push'].concat(extraArgs, remote, branchName).filter(function(arg) {
                  return arg !== '';
                });
                return git.cmd(args, {
                  cwd: _this.repo.getWorkingDirectory()
                }, {
                  color: true
                }).then(function(data) {
                  view.showContent(data);
                  startMessage.dismiss();
                  return git.refresh(_this.repo);
                })["catch"](function(error) {
                  view.showContent(error);
                  return startMessage.dismiss();
                });
              });
            };
          })(this));
        }
      } else {
        view = OutputViewManager.getView();
        args = [this.mode];
        if (extraArgs.length > 0) {
          args.push(extraArgs);
        }
        args = args.concat([remote, this.tag]).filter(function(arg) {
          return arg !== '';
        });
        message = (this.mode[0].toUpperCase() + this.mode.substring(1)) + "ing...";
        startMessage = notifier.addInfo(message, {
          dismissable: true
        });
        return git.cmd(args, {
          cwd: this.repo.getWorkingDirectory()
        }, {
          color: true
        }).then((function(_this) {
          return function(data) {
            if (data !== '') {
              view.showContent(data);
            }
            startMessage.dismiss();
            return git.refresh(_this.repo);
          };
        })(this))["catch"]((function(_this) {
          return function(data) {
            if (data !== '') {
              view.showContent(data);
            }
            return startMessage.dismiss();
          };
        })(this));
      }
    };

    ListView.prototype.pushAndSetUpstream = function(remote) {
      var args, message, startMessage, view;
      if (remote == null) {
        remote = '';
      }
      view = OutputViewManager.getView();
      args = ['push', '-u', remote, 'HEAD'].filter(function(arg) {
        return arg !== '';
      });
      message = "Pushing...";
      startMessage = notifier.addInfo(message, {
        dismissable: true
      });
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }, {
        color: true
      }).then(function(data) {
        if (data !== '') {
          view.showContent(data);
        }
        return startMessage.dismiss();
      })["catch"]((function(_this) {
        return function(data) {
          if (data !== '') {
            view.showContent(data);
          }
          return startMessage.dismiss();
        };
      })(this));
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcmVtb3RlLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGdHQUFBO0lBQUE7OztFQUFBLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFFTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sS0FBQSxHQUFRLE9BQUEsQ0FBUSxpQkFBUjs7RUFDUixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSOztFQUNwQixvQkFBQSxHQUF1QixPQUFBLENBQVEsMkJBQVI7O0VBRXZCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7dUJBQ0osVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLEtBQVIsRUFBZSxJQUFmO0FBQ1YsVUFBQTtNQURXLElBQUMsQ0FBQSxPQUFEO01BQU8sSUFBQyxDQUFBLE9BQUQ7NEJBQU8sT0FBMEIsSUFBekIsSUFBQyxDQUFBLFlBQUEsTUFBTSxJQUFDLENBQUEsV0FBQSxLQUFLLElBQUMsQ0FBQSxpQkFBQTtNQUN4QywwQ0FBQSxTQUFBOztRQUNBLElBQUMsQ0FBQSxNQUFPOzs7UUFDUixJQUFDLENBQUEsWUFBYTs7TUFDZCxJQUFDLENBQUEsSUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFFBQUQsRUFBVyxPQUFYO1VBQUMsS0FBQyxDQUFBLFVBQUQ7VUFBVSxLQUFDLENBQUEsU0FBRDtRQUFYO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSO0lBTko7O3VCQVFaLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTtN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O1FBQUEsV0FBQSxFQUFhLElBQWI7T0FBMUI7YUFDZixHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtPQUFkLEVBQWdEO1FBQUMsS0FBQSxFQUFPLElBQVI7T0FBaEQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7UUFDSixJQUFHLElBQUEsS0FBVSxFQUFiO1VBQ0UsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsSUFBakIsRUFERjs7ZUFFQSxZQUFZLENBQUMsT0FBYixDQUFBO01BSEksQ0FETixDQUtBLEVBQUMsS0FBRCxFQUxBLENBS08sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7VUFDTCxJQUFHLElBQUEsS0FBVSxFQUFiO1lBQ0UsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsSUFBakIsRUFERjs7aUJBRUEsWUFBWSxDQUFDLE9BQWIsQ0FBQTtRQUhLO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxQO0lBTGtCOzs7O0tBbElDO0FBVHZCIiwic291cmNlc0NvbnRlbnQiOlsieyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuX3B1bGwgPSByZXF1aXJlICcuLi9tb2RlbHMvX3B1bGwnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuT3V0cHV0Vmlld01hbmFnZXIgPSByZXF1aXJlICcuLi9vdXRwdXQtdmlldy1tYW5hZ2VyJ1xuUmVtb3RlQnJhbmNoTGlzdFZpZXcgPSByZXF1aXJlICcuL3JlbW90ZS1icmFuY2gtbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChAcmVwbywgQGRhdGEsIHtAbW9kZSwgQHRhZywgQGV4dHJhQXJnc309e30pIC0+XG4gICAgc3VwZXJcbiAgICBAdGFnID89ICcnXG4gICAgQGV4dHJhQXJncyA/PSBbXVxuICAgIEBzaG93KClcbiAgICBAcGFyc2VEYXRhKClcbiAgICBAcmVzdWx0ID0gbmV3IFByb21pc2UgKEByZXNvbHZlLCBAcmVqZWN0KSA9PlxuXG4gIHBhcnNlRGF0YTogLT5cbiAgICBpdGVtcyA9IEBkYXRhLnNwbGl0KFwiXFxuXCIpXG4gICAgcmVtb3RlcyA9IGl0ZW1zLmZpbHRlcigoaXRlbSkgLT4gaXRlbSBpc250ICcnKS5tYXAgKGl0ZW0pIC0+IHsgbmFtZTogaXRlbSB9XG4gICAgaWYgcmVtb3Rlcy5sZW5ndGggaXMgMVxuICAgICAgQGNvbmZpcm1lZCByZW1vdGVzWzBdXG4gICAgZWxzZVxuICAgICAgQHNldEl0ZW1zIHJlbW90ZXNcbiAgICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAnbmFtZSdcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICBoaWRlOiAtPiBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoe25hbWV9KSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgbmFtZVxuXG4gIHB1bGw6IChyZW1vdGVOYW1lKSAtPlxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMucmVtb3RlSW50ZXJhY3Rpb25zLnByb21wdEZvckJyYW5jaCcpXG4gICAgICBnaXQuY21kKFsnYnJhbmNoJywgJy0tbm8tY29sb3InLCAnLXInXSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgICAgICBuZXcgUmVtb3RlQnJhbmNoTGlzdFZpZXcgZGF0YSwgcmVtb3RlTmFtZSwgKHtuYW1lfSkgPT5cbiAgICAgICAgICAgIGJyYW5jaE5hbWUgPSBuYW1lLnN1YnN0cmluZyhuYW1lLmluZGV4T2YoJy8nKSArIDEpXG4gICAgICAgICAgICB2aWV3ID0gT3V0cHV0Vmlld01hbmFnZXIuZ2V0VmlldygpXG4gICAgICAgICAgICBzdGFydE1lc3NhZ2UgPSBub3RpZmllci5hZGRJbmZvIFwiUHVsbGluZy4uLlwiLCBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgICAgYXJncyA9IFsncHVsbCddLmNvbmNhdChAZXh0cmFBcmdzLCByZW1vdGVOYW1lLCBicmFuY2hOYW1lKS5maWx0ZXIoKGFyZykgLT4gYXJnIGlzbnQgJycpXG4gICAgICAgICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpLCB7Y29sb3I6IHRydWV9KVxuICAgICAgICAgICAgLnRoZW4gKGRhdGEpID0+XG4gICAgICAgICAgICAgIHJlc29sdmUgYnJhbmNoTmFtZVxuICAgICAgICAgICAgICB2aWV3LnNob3dDb250ZW50KGRhdGEpXG4gICAgICAgICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICAgICAgICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiAgICAgICAgICAgIC5jYXRjaCAoZXJyb3IpID0+XG4gICAgICAgICAgICAgIHJlamVjdCgpXG4gICAgICAgICAgICAgIHZpZXcuc2hvd0NvbnRlbnQoZXJyb3IpXG4gICAgICAgICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICBlbHNlXG4gICAgICBfcHVsbCBAcmVwbywgZXh0cmFBcmdzOiBAZXh0cmFBcmdzXG5cbiAgY29uZmlybWVkOiAoe25hbWV9KSAtPlxuICAgIGlmIEBtb2RlIGlzICdwdWxsJ1xuICAgICAgQHB1bGwgbmFtZVxuICAgIGVsc2UgaWYgQG1vZGUgaXMgJ2ZldGNoLXBydW5lJ1xuICAgICAgQG1vZGUgPSAnZmV0Y2gnXG4gICAgICBAZXhlY3V0ZSBuYW1lLCAnLS1wcnVuZSdcbiAgICBlbHNlIGlmIEBtb2RlIGlzICdwdXNoJ1xuICAgICAgcHVsbEJlZm9yZVB1c2ggPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLnJlbW90ZUludGVyYWN0aW9ucy5wdWxsQmVmb3JlUHVzaCcpXG4gICAgICBAZXh0cmFBcmdzID0gJy0tcmViYXNlJyBpZiBwdWxsQmVmb3JlUHVzaCBhbmQgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5yZW1vdGVJbnRlcmFjdGlvbnMucHVsbFJlYmFzZScpXG4gICAgICBpZiBwdWxsQmVmb3JlUHVzaFxuICAgICAgICBAcHVsbChuYW1lKS50aGVuIChicmFuY2gpID0+IEBleGVjdXRlIG5hbWUsIG51bGwsIGJyYW5jaFxuICAgICAgZWxzZVxuICAgICAgICBAZXhlY3V0ZSBuYW1lXG4gICAgZWxzZSBpZiBAbW9kZSBpcyAncHVzaCAtdSdcbiAgICAgIEBwdXNoQW5kU2V0VXBzdHJlYW0gbmFtZVxuICAgIGVsc2VcbiAgICAgIEBleGVjdXRlIG5hbWVcbiAgICBAY2FuY2VsKClcblxuICBleGVjdXRlOiAocmVtb3RlPScnLCBleHRyYUFyZ3M9JycsIGJyYW5jaCkgLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLnJlbW90ZUludGVyYWN0aW9ucy5wcm9tcHRGb3JCcmFuY2gnKVxuICAgICAgaWYgYnJhbmNoP1xuICAgICAgICB2aWV3ID0gT3V0cHV0Vmlld01hbmFnZXIuZ2V0VmlldygpXG4gICAgICAgIGFyZ3MgPSBbQG1vZGVdXG4gICAgICAgIGlmIGV4dHJhQXJncy5sZW5ndGggPiAwXG4gICAgICAgICAgYXJncy5wdXNoIGV4dHJhQXJnc1xuICAgICAgICBhcmdzID0gYXJncy5jb25jYXQoW3JlbW90ZSwgYnJhbmNoXSlcbiAgICAgICAgbWVzc2FnZSA9IFwiI3tAbW9kZVswXS50b1VwcGVyQ2FzZSgpK0Btb2RlLnN1YnN0cmluZygxKX1pbmcuLi5cIlxuICAgICAgICBzdGFydE1lc3NhZ2UgPSBub3RpZmllci5hZGRJbmZvIG1lc3NhZ2UsIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICAgIGlmIGRhdGEgaXNudCAnJ1xuICAgICAgICAgICAgdmlldy5zaG93Q29udGVudChkYXRhKVxuICAgICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICAgICAgICBnaXQucmVmcmVzaCBAcmVwb1xuICAgICAgICAuY2F0Y2ggKGRhdGEpID0+XG4gICAgICAgICAgaWYgZGF0YSBpc250ICcnXG4gICAgICAgICAgICB2aWV3LnNob3dDb250ZW50KGRhdGEpXG4gICAgICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgICAgZWxzZVxuICAgICAgICBnaXQuY21kKFsnYnJhbmNoJywgJy0tbm8tY29sb3InLCAnLXInXSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICAgIG5ldyBSZW1vdGVCcmFuY2hMaXN0VmlldyBkYXRhLCByZW1vdGUsICh7bmFtZX0pID0+XG4gICAgICAgICAgICBicmFuY2hOYW1lID0gbmFtZS5zdWJzdHJpbmcobmFtZS5pbmRleE9mKCcvJykgKyAxKVxuICAgICAgICAgICAgdmlldyA9IE91dHB1dFZpZXdNYW5hZ2VyLmdldFZpZXcoKVxuICAgICAgICAgICAgc3RhcnRNZXNzYWdlID0gbm90aWZpZXIuYWRkSW5mbyBcIlB1c2hpbmcuLi5cIiwgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICAgIGFyZ3MgPSBbJ3B1c2gnXS5jb25jYXQoZXh0cmFBcmdzLCByZW1vdGUsIGJyYW5jaE5hbWUpLmZpbHRlcigoYXJnKSAtPiBhcmcgaXNudCAnJylcbiAgICAgICAgICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgICAgICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgICAgICAgdmlldy5zaG93Q29udGVudChkYXRhKVxuICAgICAgICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgICAgICAgICAgIGdpdC5yZWZyZXNoIEByZXBvXG4gICAgICAgICAgICAuY2F0Y2ggKGVycm9yKSA9PlxuICAgICAgICAgICAgICB2aWV3LnNob3dDb250ZW50KGVycm9yKVxuICAgICAgICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgZWxzZVxuICAgICAgdmlldyA9IE91dHB1dFZpZXdNYW5hZ2VyLmdldFZpZXcoKVxuICAgICAgYXJncyA9IFtAbW9kZV1cbiAgICAgIGlmIGV4dHJhQXJncy5sZW5ndGggPiAwXG4gICAgICAgIGFyZ3MucHVzaCBleHRyYUFyZ3NcbiAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChbcmVtb3RlLCBAdGFnXSkuZmlsdGVyKChhcmcpIC0+IGFyZyBpc250ICcnKVxuICAgICAgbWVzc2FnZSA9IFwiI3tAbW9kZVswXS50b1VwcGVyQ2FzZSgpK0Btb2RlLnN1YnN0cmluZygxKX1pbmcuLi5cIlxuICAgICAgc3RhcnRNZXNzYWdlID0gbm90aWZpZXIuYWRkSW5mbyBtZXNzYWdlLCBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwge2NvbG9yOiB0cnVlfSlcbiAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICBpZiBkYXRhIGlzbnQgJydcbiAgICAgICAgICB2aWV3LnNob3dDb250ZW50KGRhdGEpXG4gICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiAgICAgIC5jYXRjaCAoZGF0YSkgPT5cbiAgICAgICAgaWYgZGF0YSBpc250ICcnXG4gICAgICAgICAgdmlldy5zaG93Q29udGVudChkYXRhKVxuICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG5cbiAgcHVzaEFuZFNldFVwc3RyZWFtOiAocmVtb3RlPScnKSAtPlxuICAgIHZpZXcgPSBPdXRwdXRWaWV3TWFuYWdlci5nZXRWaWV3KClcbiAgICBhcmdzID0gWydwdXNoJywgJy11JywgcmVtb3RlLCAnSEVBRCddLmZpbHRlcigoYXJnKSAtPiBhcmcgaXNudCAnJylcbiAgICBtZXNzYWdlID0gXCJQdXNoaW5nLi4uXCJcbiAgICBzdGFydE1lc3NhZ2UgPSBub3RpZmllci5hZGRJbmZvIG1lc3NhZ2UsIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwge2NvbG9yOiB0cnVlfSlcbiAgICAudGhlbiAoZGF0YSkgLT5cbiAgICAgIGlmIGRhdGEgaXNudCAnJ1xuICAgICAgICB2aWV3LnNob3dDb250ZW50KGRhdGEpXG4gICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgLmNhdGNoIChkYXRhKSA9PlxuICAgICAgaWYgZGF0YSBpc250ICcnXG4gICAgICAgIHZpZXcuc2hvd0NvbnRlbnQoZGF0YSlcbiAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiJdfQ==
