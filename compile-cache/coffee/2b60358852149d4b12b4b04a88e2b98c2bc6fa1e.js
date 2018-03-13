(function() {
  var BranchListView, DiffBranchFilesView, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  BranchListView = require('../views/branch-list-view');

  DiffBranchFilesView = require('../views/diff-branch-files-view');

  module.exports = function(repo, filePath) {
    return git.cmd(['branch', '--no-color'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(branches) {
      return new BranchListView(branches, function(arg) {
        var args, branchName, name;
        name = arg.name;
        branchName = name;
        args = ['diff', '--name-status', repo.branch, branchName];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(diffData) {
          return new DiffBranchFilesView(repo, diffData, branchName, filePath);
        })["catch"](notifier.addError);
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kaWZmLWJyYW5jaC1maWxlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVI7O0VBQ2pCLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSxpQ0FBUjs7RUFFdEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sUUFBUDtXQUNmLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxRQUFELEVBQVcsWUFBWCxDQUFSLEVBQWtDO01BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBbEMsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLFFBQUQ7YUFDQSxJQUFBLGNBQUEsQ0FBZSxRQUFmLEVBQXlCLFNBQUMsR0FBRDtBQUMzQixZQUFBO1FBRDZCLE9BQUQ7UUFDNUIsVUFBQSxHQUFhO1FBQ2IsSUFBQSxHQUFPLENBQUMsTUFBRCxFQUFTLGVBQVQsRUFBMEIsSUFBSSxDQUFDLE1BQS9CLEVBQXVDLFVBQXZDO2VBQ1AsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7VUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUFkLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxRQUFEO2lCQUNBLElBQUEsbUJBQUEsQ0FBb0IsSUFBcEIsRUFBMEIsUUFBMUIsRUFBb0MsVUFBcEMsRUFBZ0QsUUFBaEQ7UUFEQSxDQUROLENBR0EsRUFBQyxLQUFELEVBSEEsQ0FHTyxRQUFRLENBQUMsUUFIaEI7TUFIMkIsQ0FBekI7SUFEQSxDQUROO0VBRGU7QUFMakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuQnJhbmNoTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9icmFuY2gtbGlzdC12aWV3J1xuRGlmZkJyYW5jaEZpbGVzVmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL2RpZmYtYnJhbmNoLWZpbGVzLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIGZpbGVQYXRoKSAtPlxuICBnaXQuY21kKFsnYnJhbmNoJywgJy0tbm8tY29sb3InXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGJyYW5jaGVzKSAtPlxuICAgIG5ldyBCcmFuY2hMaXN0VmlldyBicmFuY2hlcywgKHtuYW1lfSkgLT5cbiAgICAgIGJyYW5jaE5hbWUgPSBuYW1lXG4gICAgICBhcmdzID0gWydkaWZmJywgJy0tbmFtZS1zdGF0dXMnLCByZXBvLmJyYW5jaCwgYnJhbmNoTmFtZV1cbiAgICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIC50aGVuIChkaWZmRGF0YSkgLT5cbiAgICAgICAgbmV3IERpZmZCcmFuY2hGaWxlc1ZpZXcocmVwbywgZGlmZkRhdGEsIGJyYW5jaE5hbWUsIGZpbGVQYXRoKVxuICAgICAgLmNhdGNoIG5vdGlmaWVyLmFkZEVycm9yXG4iXX0=
