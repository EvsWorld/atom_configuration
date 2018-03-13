(function() {
  var git;

  git = require('../git');

  module.exports = function(repos) {
    return repos.map(function(repo) {
      var cwd;
      cwd = repo.getWorkingDirectory();
      return git.cmd(['fetch', '--all'], {
        cwd: cwd
      }).then(function(message) {
        var options, repoName;
        if (atom.config.get('git-plus.experimental.autoFetchNotify')) {
          repoName = cwd.split('/').pop();
          options = {
            icon: 'repo-pull',
            detail: "In " + repoName + " repo:",
            description: message.replace(/(Fetch)ing/g, '$1ed')
          };
          return atom.notifications.addSuccess('Git-Plus', options);
        }
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1mZXRjaC1hbGwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBRU4sTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxLQUFEO1dBQ2YsS0FBSyxDQUFDLEdBQU4sQ0FBVSxTQUFDLElBQUQ7QUFDUixVQUFBO01BQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxtQkFBTCxDQUFBO2FBQ04sR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLE9BQUQsRUFBUyxPQUFULENBQVIsRUFBMkI7UUFBQyxLQUFBLEdBQUQ7T0FBM0IsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLE9BQUQ7QUFDSixZQUFBO1FBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLENBQUg7VUFDRSxRQUFBLEdBQVcsR0FBRyxDQUFDLEtBQUosQ0FBVSxHQUFWLENBQWMsQ0FBQyxHQUFmLENBQUE7VUFDWCxPQUFBLEdBQ0U7WUFBQSxJQUFBLEVBQU0sV0FBTjtZQUNBLE1BQUEsRUFBUSxLQUFBLEdBQU0sUUFBTixHQUFlLFFBRHZCO1lBRUEsV0FBQSxFQUFhLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGFBQWhCLEVBQStCLE1BQS9CLENBRmI7O2lCQUdGLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIsVUFBOUIsRUFBMEMsT0FBMUMsRUFORjs7TUFESSxDQUROO0lBRlEsQ0FBVjtFQURlO0FBRmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvcykgLT5cbiAgcmVwb3MubWFwIChyZXBvKSAtPlxuICAgIGN3ZCA9IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4gICAgZ2l0LmNtZChbJ2ZldGNoJywnLS1hbGwnXSwge2N3ZH0pXG4gICAgLnRoZW4gKG1lc3NhZ2UpIC0+XG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmV4cGVyaW1lbnRhbC5hdXRvRmV0Y2hOb3RpZnknKVxuICAgICAgICByZXBvTmFtZSA9IGN3ZC5zcGxpdCgnLycpLnBvcCgpXG4gICAgICAgIG9wdGlvbnMgPVxuICAgICAgICAgIGljb246ICdyZXBvLXB1bGwnXG4gICAgICAgICAgZGV0YWlsOiBcIkluICN7cmVwb05hbWV9IHJlcG86XCJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogbWVzc2FnZS5yZXBsYWNlKC8oRmV0Y2gpaW5nL2csICckMWVkJylcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJ0dpdC1QbHVzJywgb3B0aW9ucylcbiJdfQ==
