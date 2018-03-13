(function() {
  var OutputViewManager, fs, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  fs = require('fs-plus');

  module.exports = function(repo, arg) {
    var file, isFolder, ref, tool;
    file = (arg != null ? arg : {}).file;
    if (file == null) {
      file = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
    }
    isFolder = fs.isDirectorySync(file);
    if (!file) {
      return notifier.addInfo("No open file. Select 'Diff All'.");
    }
    if (!(tool = git.getConfig(repo, 'diff.tool'))) {
      return notifier.addInfo("You don't have a difftool configured.");
    } else {
      return git.cmd(['diff-index', 'HEAD', '-z'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        var args, diffIndex, diffsForCurrentFile, includeStagedDiff;
        diffIndex = data.split('\0');
        includeStagedDiff = atom.config.get('git-plus.diffs.includeStagedDiff');
        if (isFolder) {
          args = ['difftool', '-d', '--no-prompt'];
          if (includeStagedDiff) {
            args.push('HEAD');
          }
          args.push(file);
          git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          })["catch"](function(msg) {
            return OutputViewManager.getView().showContent(msg);
          });
          return;
        }
        diffsForCurrentFile = diffIndex.map(function(line, i) {
          var path, staged;
          if (i % 2 === 0) {
            staged = !/^0{40}$/.test(diffIndex[i].split(' ')[3]);
            path = diffIndex[i + 1];
            if (path === file && (!staged || includeStagedDiff)) {
              return true;
            }
          } else {
            return void 0;
          }
        });
        if (diffsForCurrentFile.filter(function(diff) {
          return diff != null;
        })[0] != null) {
          args = ['difftool', '--no-prompt'];
          if (includeStagedDiff) {
            args.push('HEAD');
          }
          args.push(file);
          return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          })["catch"](function(msg) {
            return OutputViewManager.getView().showContent(msg);
          });
        } else {
          return notifier.addInfo('Nothing to show.');
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kaWZmdG9vbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSOztFQUNwQixFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBRUwsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sR0FBUDtBQUNmLFFBQUE7SUFEdUIsc0JBQUQsTUFBTzs7TUFDN0IsT0FBUSxJQUFJLENBQUMsVUFBTCwyREFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCOztJQUNSLFFBQUEsR0FBVyxFQUFFLENBQUMsZUFBSCxDQUFtQixJQUFuQjtJQUVYLElBQUcsQ0FBSSxJQUFQO0FBQ0UsYUFBTyxRQUFRLENBQUMsT0FBVCxDQUFpQixrQ0FBakIsRUFEVDs7SUFLQSxJQUFBLENBQU8sQ0FBQSxJQUFBLEdBQU8sR0FBRyxDQUFDLFNBQUosQ0FBYyxJQUFkLEVBQW9CLFdBQXBCLENBQVAsQ0FBUDthQUNFLFFBQVEsQ0FBQyxPQUFULENBQWlCLHVDQUFqQixFQURGO0tBQUEsTUFBQTthQUdFLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxZQUFELEVBQWUsTUFBZixFQUF1QixJQUF2QixDQUFSLEVBQXNDO1FBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBdEMsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7QUFDSixZQUFBO1FBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWDtRQUNaLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQ0FBaEI7UUFFcEIsSUFBRyxRQUFIO1VBQ0UsSUFBQSxHQUFPLENBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsYUFBbkI7VUFDUCxJQUFvQixpQkFBcEI7WUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVYsRUFBQTs7VUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVY7VUFDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztZQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1dBQWQsQ0FDQSxFQUFDLEtBQUQsRUFEQSxDQUNPLFNBQUMsR0FBRDttQkFBUyxpQkFBaUIsQ0FBQyxPQUFsQixDQUFBLENBQTJCLENBQUMsV0FBNUIsQ0FBd0MsR0FBeEM7VUFBVCxDQURQO0FBRUEsaUJBTkY7O1FBUUEsbUJBQUEsR0FBc0IsU0FBUyxDQUFDLEdBQVYsQ0FBYyxTQUFDLElBQUQsRUFBTyxDQUFQO0FBQ2xDLGNBQUE7VUFBQSxJQUFHLENBQUEsR0FBSSxDQUFKLEtBQVMsQ0FBWjtZQUNFLE1BQUEsR0FBUyxDQUFJLFNBQVMsQ0FBQyxJQUFWLENBQWUsU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBd0IsQ0FBQSxDQUFBLENBQXZDO1lBQ2IsSUFBQSxHQUFPLFNBQVUsQ0FBQSxDQUFBLEdBQUUsQ0FBRjtZQUNqQixJQUFRLElBQUEsS0FBUSxJQUFSLElBQWlCLENBQUMsQ0FBQyxNQUFELElBQVcsaUJBQVosQ0FBekI7cUJBQUEsS0FBQTthQUhGO1dBQUEsTUFBQTttQkFLRSxPQUxGOztRQURrQyxDQUFkO1FBUXRCLElBQUc7O3FCQUFIO1VBQ0UsSUFBQSxHQUFPLENBQUMsVUFBRCxFQUFhLGFBQWI7VUFDUCxJQUFvQixpQkFBcEI7WUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVYsRUFBQTs7VUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVY7aUJBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7WUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtXQUFkLENBQ0EsRUFBQyxLQUFELEVBREEsQ0FDTyxTQUFDLEdBQUQ7bUJBQVMsaUJBQWlCLENBQUMsT0FBbEIsQ0FBQSxDQUEyQixDQUFDLFdBQTVCLENBQXdDLEdBQXhDO1VBQVQsQ0FEUCxFQUpGO1NBQUEsTUFBQTtpQkFPRSxRQUFRLENBQUMsT0FBVCxDQUFpQixrQkFBakIsRUFQRjs7TUFwQkksQ0FETixFQUhGOztFQVRlO0FBTGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbk91dHB1dFZpZXdNYW5hZ2VyID0gcmVxdWlyZSAnLi4vb3V0cHV0LXZpZXctbWFuYWdlcidcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywge2ZpbGV9PXt9KSAtPlxuICBmaWxlID89IHJlcG8ucmVsYXRpdml6ZShhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKSlcbiAgaXNGb2xkZXIgPSBmcy5pc0RpcmVjdG9yeVN5bmMgZmlsZVxuXG4gIGlmIG5vdCBmaWxlXG4gICAgcmV0dXJuIG5vdGlmaWVyLmFkZEluZm8gXCJObyBvcGVuIGZpbGUuIFNlbGVjdCAnRGlmZiBBbGwnLlwiXG5cbiAgIyBXZSBwYXJzZSB0aGUgb3V0cHV0IG9mIGdpdCBkaWZmLWluZGV4IHRvIGhhbmRsZSB0aGUgY2FzZSBvZiBhIHN0YWdlZCBmaWxlXG4gICMgd2hlbiBnaXQtcGx1cy5kaWZmcy5pbmNsdWRlU3RhZ2VkRGlmZiBpcyBzZXQgdG8gZmFsc2UuXG4gIHVubGVzcyB0b29sID0gZ2l0LmdldENvbmZpZyhyZXBvLCAnZGlmZi50b29sJylcbiAgICBub3RpZmllci5hZGRJbmZvIFwiWW91IGRvbid0IGhhdmUgYSBkaWZmdG9vbCBjb25maWd1cmVkLlwiXG4gIGVsc2VcbiAgICBnaXQuY21kKFsnZGlmZi1pbmRleCcsICdIRUFEJywgJy16J10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBkaWZmSW5kZXggPSBkYXRhLnNwbGl0KCdcXDAnKVxuICAgICAgaW5jbHVkZVN0YWdlZERpZmYgPSBhdG9tLmNvbmZpZy5nZXQgJ2dpdC1wbHVzLmRpZmZzLmluY2x1ZGVTdGFnZWREaWZmJ1xuXG4gICAgICBpZiBpc0ZvbGRlclxuICAgICAgICBhcmdzID0gWydkaWZmdG9vbCcsICctZCcsICctLW5vLXByb21wdCddXG4gICAgICAgIGFyZ3MucHVzaCAnSEVBRCcgaWYgaW5jbHVkZVN0YWdlZERpZmZcbiAgICAgICAgYXJncy5wdXNoIGZpbGVcbiAgICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgICAuY2F0Y2ggKG1zZykgLT4gT3V0cHV0Vmlld01hbmFnZXIuZ2V0VmlldygpLnNob3dDb250ZW50KG1zZylcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGRpZmZzRm9yQ3VycmVudEZpbGUgPSBkaWZmSW5kZXgubWFwIChsaW5lLCBpKSAtPlxuICAgICAgICBpZiBpICUgMiBpcyAwXG4gICAgICAgICAgc3RhZ2VkID0gbm90IC9eMHs0MH0kLy50ZXN0KGRpZmZJbmRleFtpXS5zcGxpdCgnICcpWzNdKTtcbiAgICAgICAgICBwYXRoID0gZGlmZkluZGV4W2krMV1cbiAgICAgICAgICB0cnVlIGlmIHBhdGggaXMgZmlsZSBhbmQgKCFzdGFnZWQgb3IgaW5jbHVkZVN0YWdlZERpZmYpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB1bmRlZmluZWRcblxuICAgICAgaWYgZGlmZnNGb3JDdXJyZW50RmlsZS5maWx0ZXIoKGRpZmYpIC0+IGRpZmY/KVswXT9cbiAgICAgICAgYXJncyA9IFsnZGlmZnRvb2wnLCAnLS1uby1wcm9tcHQnXVxuICAgICAgICBhcmdzLnB1c2ggJ0hFQUQnIGlmIGluY2x1ZGVTdGFnZWREaWZmXG4gICAgICAgIGFyZ3MucHVzaCBmaWxlXG4gICAgICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgICAgLmNhdGNoIChtc2cpIC0+IE91dHB1dFZpZXdNYW5hZ2VyLmdldFZpZXcoKS5zaG93Q29udGVudChtc2cpXG4gICAgICBlbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZEluZm8gJ05vdGhpbmcgdG8gc2hvdy4nXG4iXX0=
