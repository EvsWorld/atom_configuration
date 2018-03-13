(function() {
  var OutputViewManager, emptyOrUndefined, getUpstream, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  emptyOrUndefined = function(thing) {
    return thing !== '' && thing !== void 0;
  };

  getUpstream = function(repo) {
    var branch, branchInfo, ref, remote;
    branchInfo = (ref = repo.getUpstreamBranch()) != null ? ref.substring('refs/remotes/'.length).split('/') : void 0;
    if (!branchInfo) {
      return null;
    }
    remote = branchInfo[0];
    branch = branchInfo.slice(1).join('/');
    return [remote, branch];
  };

  module.exports = function(repo, arg) {
    var args, extraArgs, startMessage, upstream, view;
    extraArgs = (arg != null ? arg : {}).extraArgs;
    if (upstream = getUpstream(repo)) {
      if (extraArgs == null) {
        extraArgs = [];
      }
      view = OutputViewManager.getView();
      startMessage = notifier.addInfo("Pulling...", {
        dismissable: true
      });
      args = ['pull'].concat(extraArgs).concat(upstream).filter(emptyOrUndefined);
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }, {
        color: true
      }).then(function(data) {
        view.showContent(data);
        return startMessage.dismiss();
      })["catch"](function(error) {
        view.showContent(error);
        return startMessage.dismiss();
      });
    } else {
      return notifier.addInfo('The current branch is not tracking from upstream');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL19wdWxsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVI7O0VBRXBCLGdCQUFBLEdBQW1CLFNBQUMsS0FBRDtXQUFXLEtBQUEsS0FBVyxFQUFYLElBQWtCLEtBQUEsS0FBVztFQUF4Qzs7RUFFbkIsV0FBQSxHQUFjLFNBQUMsSUFBRDtBQUNaLFFBQUE7SUFBQSxVQUFBLGlEQUFxQyxDQUFFLFNBQTFCLENBQW9DLGVBQWUsQ0FBQyxNQUFwRCxDQUEyRCxDQUFDLEtBQTVELENBQWtFLEdBQWxFO0lBQ2IsSUFBZSxDQUFJLFVBQW5CO0FBQUEsYUFBTyxLQUFQOztJQUNBLE1BQUEsR0FBUyxVQUFXLENBQUEsQ0FBQTtJQUNwQixNQUFBLEdBQVMsVUFBVSxDQUFDLEtBQVgsQ0FBaUIsQ0FBakIsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixHQUF6QjtXQUNULENBQUMsTUFBRCxFQUFTLE1BQVQ7RUFMWTs7RUFPZCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ2YsUUFBQTtJQUR1QiwyQkFBRCxNQUFZO0lBQ2xDLElBQUcsUUFBQSxHQUFXLFdBQUEsQ0FBWSxJQUFaLENBQWQ7O1FBQ0UsWUFBYTs7TUFDYixJQUFBLEdBQU8saUJBQWlCLENBQUMsT0FBbEIsQ0FBQTtNQUNQLFlBQUEsR0FBZSxRQUFRLENBQUMsT0FBVCxDQUFpQixZQUFqQixFQUErQjtRQUFBLFdBQUEsRUFBYSxJQUFiO09BQS9CO01BQ2YsSUFBQSxHQUFPLENBQUMsTUFBRCxDQUFRLENBQUMsTUFBVCxDQUFnQixTQUFoQixDQUEwQixDQUFDLE1BQTNCLENBQWtDLFFBQWxDLENBQTJDLENBQUMsTUFBNUMsQ0FBbUQsZ0JBQW5EO2FBQ1AsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7UUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUFkLEVBQStDO1FBQUMsS0FBQSxFQUFPLElBQVI7T0FBL0MsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7UUFDSixJQUFJLENBQUMsV0FBTCxDQUFpQixJQUFqQjtlQUNBLFlBQVksQ0FBQyxPQUFiLENBQUE7TUFGSSxDQUROLENBSUEsRUFBQyxLQUFELEVBSkEsQ0FJTyxTQUFDLEtBQUQ7UUFDTCxJQUFJLENBQUMsV0FBTCxDQUFpQixLQUFqQjtlQUNBLFlBQVksQ0FBQyxPQUFiLENBQUE7TUFGSyxDQUpQLEVBTEY7S0FBQSxNQUFBO2FBYUUsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsa0RBQWpCLEVBYkY7O0VBRGU7QUFiakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuT3V0cHV0Vmlld01hbmFnZXIgPSByZXF1aXJlICcuLi9vdXRwdXQtdmlldy1tYW5hZ2VyJ1xuXG5lbXB0eU9yVW5kZWZpbmVkID0gKHRoaW5nKSAtPiB0aGluZyBpc250ICcnIGFuZCB0aGluZyBpc250IHVuZGVmaW5lZFxuXG5nZXRVcHN0cmVhbSA9IChyZXBvKSAtPlxuICBicmFuY2hJbmZvID0gcmVwby5nZXRVcHN0cmVhbUJyYW5jaCgpPy5zdWJzdHJpbmcoJ3JlZnMvcmVtb3Rlcy8nLmxlbmd0aCkuc3BsaXQoJy8nKVxuICByZXR1cm4gbnVsbCBpZiBub3QgYnJhbmNoSW5mb1xuICByZW1vdGUgPSBicmFuY2hJbmZvWzBdXG4gIGJyYW5jaCA9IGJyYW5jaEluZm8uc2xpY2UoMSkuam9pbignLycpXG4gIFtyZW1vdGUsIGJyYW5jaF1cblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywge2V4dHJhQXJnc309e30pIC0+XG4gIGlmIHVwc3RyZWFtID0gZ2V0VXBzdHJlYW0ocmVwbylcbiAgICBleHRyYUFyZ3MgPz0gW11cbiAgICB2aWV3ID0gT3V0cHV0Vmlld01hbmFnZXIuZ2V0VmlldygpXG4gICAgc3RhcnRNZXNzYWdlID0gbm90aWZpZXIuYWRkSW5mbyBcIlB1bGxpbmcuLi5cIiwgZGlzbWlzc2FibGU6IHRydWVcbiAgICBhcmdzID0gWydwdWxsJ10uY29uY2F0KGV4dHJhQXJncykuY29uY2F0KHVwc3RyZWFtKS5maWx0ZXIoZW1wdHlPclVuZGVmaW5lZClcbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICB2aWV3LnNob3dDb250ZW50KGRhdGEpXG4gICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIHZpZXcuc2hvd0NvbnRlbnQoZXJyb3IpXG4gICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gIGVsc2VcbiAgICBub3RpZmllci5hZGRJbmZvICdUaGUgY3VycmVudCBicmFuY2ggaXMgbm90IHRyYWNraW5nIGZyb20gdXBzdHJlYW0nXG4iXX0=
