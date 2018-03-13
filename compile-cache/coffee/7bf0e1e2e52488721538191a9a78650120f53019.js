(function() {
  var CompositeDisposable, Emitter, GitRepositoryAsync, ProjectRepositories, ref, utils;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  utils = require('./utils');

  GitRepositoryAsync = require('./gitrepositoryasync');

  module.exports = ProjectRepositories = (function() {
    ProjectRepositories.prototype.projectSubscriptions = null;

    ProjectRepositories.prototype.repositorySubscriptions = null;

    function ProjectRepositories(ignoredRepositories) {
      this.ignoredRepositories = ignoredRepositories;
      this.emitter = new Emitter;
      this.repositoryMap = new Map;
      this.projectSubscriptions = new CompositeDisposable;
      this.repositorySubscriptions = new CompositeDisposable;
      this.projectSubscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.subscribeUpdateRepositories();
        };
      })(this)));
      this.subscribeUpdateRepositories();
    }

    ProjectRepositories.prototype.destruct = function() {
      var ref1, ref2, ref3, ref4, ref5;
      if ((ref1 = this.projectSubscriptions) != null) {
        ref1.dispose();
      }
      this.projectSubscriptions = null;
      if ((ref2 = this.repositorySubscriptions) != null) {
        ref2.dispose();
      }
      this.repositorySubscriptions = null;
      this.ignoredRepositories = null;
      if ((ref3 = this.repositoryMap) != null) {
        ref3.clear();
      }
      this.repositoryMap = null;
      if ((ref4 = this.emitter) != null) {
        ref4.clear();
      }
      if ((ref5 = this.emitter) != null) {
        ref5.dispose();
      }
      return this.emitter = null;
    };

    ProjectRepositories.prototype.subscribeUpdateRepositories = function() {
      var i, len, ref1, ref2, repo, repoPromises, repositoryMap, tmpRepositorySubscriptions;
      if ((ref1 = this.repositorySubscriptions) != null) {
        ref1.dispose();
      }
      tmpRepositorySubscriptions = new CompositeDisposable;
      repositoryMap = new Map();
      repoPromises = [];
      ref2 = atom.project.getRepositories();
      for (i = 0, len = ref2.length; i < len; i++) {
        repo = ref2[i];
        if (repo != null) {
          repoPromises.push(this.doSubscribeUpdateRepository(repo, repositoryMap, tmpRepositorySubscriptions));
        }
      }
      return utils.settle(repoPromises).then((function(_this) {
        return function() {
          if (_this.repositoryMap != null) {
            _this.repositorySubscriptions = tmpRepositorySubscriptions;
            _this.repositoryMap = repositoryMap;
            return _this.emitter.emit('did-change-repos', _this.repositoryMap);
          } else {
            return tmpRepositorySubscriptions.dispose();
          }
        };
      })(this))["catch"](function(err) {
        console.error(err);
        return Promise.reject(err);
      });
    };

    ProjectRepositories.prototype.doSubscribeUpdateRepository = function(repo, repositoryMap, repositorySubscriptions) {
      var repoasync;
      if (repo.async != null) {
        repoasync = repo.async;
      } else {
        repoasync = new GitRepositoryAsync(repo);
      }
      return repoasync.getShortHead().then(function(shortHead) {
        if (!typeof shortHead === 'string') {
          return Promise.reject('Got invalid short head for repo');
        }
      }).then((function(_this) {
        return function() {
          return repoasync.getWorkingDirectory().then(function(directory) {
            var repoPath;
            if (!typeof directory === 'string') {
              return Promise.reject('Got invalid working directory path for repo');
            }
            repoPath = utils.normalizePath(directory);
            if (!_this.isRepositoryIgnored(repoPath)) {
              repositoryMap.set(repoPath, repoasync);
              return _this.subscribeToRepo(repoPath, repoasync, repositorySubscriptions);
            }
          });
        };
      })(this))["catch"](function(error) {
        console.warn('Ignoring respority due to error:', error, repo);
        return Promise.resolve();
      });
    };

    ProjectRepositories.prototype.subscribeToRepo = function(repoPath, repo, repositorySubscriptions) {
      if (repositorySubscriptions != null) {
        repositorySubscriptions.add(repo.onDidChangeStatuses((function(_this) {
          return function() {
            var ref1, ref2;
            if ((ref1 = _this.repositoryMap) != null ? ref1.has(repoPath) : void 0) {
              return (ref2 = _this.emitter) != null ? ref2.emit('did-change-repo-status', {
                repo: repo,
                repoPath: repoPath
              }) : void 0;
            }
          };
        })(this)));
      }
      return repositorySubscriptions != null ? repositorySubscriptions.add(repo.onDidChangeStatus((function(_this) {
        return function() {
          var ref1, ref2;
          if ((ref1 = _this.repositoryMap) != null ? ref1.has(repoPath) : void 0) {
            return (ref2 = _this.emitter) != null ? ref2.emit('did-change-repo-status', {
              repo: repo,
              repoPath: repoPath
            }) : void 0;
          }
        };
      })(this))) : void 0;
    };

    ProjectRepositories.prototype.getRepositories = function() {
      return this.repositoryMap;
    };

    ProjectRepositories.prototype.setIgnoredRepositories = function(ignoredRepositories) {
      this.ignoredRepositories = ignoredRepositories;
      return this.subscribeUpdateRepositories();
    };

    ProjectRepositories.prototype.isRepositoryIgnored = function(repoPath) {
      return this.ignoredRepositories.has(repoPath);
    };

    ProjectRepositories.prototype.onDidChange = function(evtType, handler) {
      return this.emitter.on('did-change-' + evtType, handler);
    };

    return ProjectRepositories;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90cmVlLXZpZXctZ2l0LXN0YXR1cy9saWIvcmVwb3NpdG9yaWVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFDdEIsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOztFQUNSLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxzQkFBUjs7RUFHckIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7a0NBRXJCLG9CQUFBLEdBQXNCOztrQ0FDdEIsdUJBQUEsR0FBeUI7O0lBRVosNkJBQUMsbUJBQUQ7TUFBQyxJQUFDLENBQUEsc0JBQUQ7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFDZixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixJQUFJO01BQzVCLElBQUMsQ0FBQSx1QkFBRCxHQUEyQixJQUFJO01BQy9CLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxHQUF0QixDQUEwQixJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFiLENBQThCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFFdEQsS0FBQyxDQUFBLDJCQUFELENBQUE7UUFGc0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLENBQTFCO01BR0EsSUFBQyxDQUFBLDJCQUFELENBQUE7SUFSVzs7a0NBVWIsUUFBQSxHQUFVLFNBQUE7QUFDUixVQUFBOztZQUFxQixDQUFFLE9BQXZCLENBQUE7O01BQ0EsSUFBQyxDQUFBLG9CQUFELEdBQXdCOztZQUNBLENBQUUsT0FBMUIsQ0FBQTs7TUFDQSxJQUFDLENBQUEsdUJBQUQsR0FBMkI7TUFDM0IsSUFBQyxDQUFBLG1CQUFELEdBQXVCOztZQUNULENBQUUsS0FBaEIsQ0FB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QUFBO1lBQUEsK0NBQWlCLENBQUUsR0FBaEIsQ0FBb0IsUUFBcEIsVUFBSDswREFDVSxDQUFFLElBQVYsQ0FBZSx3QkFBZixFQUF5QztnQkFBRSxNQUFBLElBQUY7Z0JBQVEsVUFBQSxRQUFSO2VBQXpDLFdBREY7O1VBRm9EO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixDQUE3Qjs7K0NBSUEsdUJBQXVCLENBQUUsR0FBekIsQ0FBNkIsSUFBSSxDQUFDLGlCQUFMLENBQXVCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUVsRCxjQUFBO1VBQUEsK0NBQWlCLENBQUUsR0FBaEIsQ0FBb0IsUUFBcEIsVUFBSDt3REFDVSxDQUFFLElBQVYsQ0FBZSx3QkFBZixFQUF5QztjQUFFLE1BQUEsSUFBRjtjQUFRLFVBQUEsUUFBUjthQUF6QyxXQURGOztRQUZrRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkIsQ0FBN0I7SUFMZTs7a0NBVWpCLGVBQUEsR0FBaUIsU0FBQTtBQUNmLGFBQU8sSUFBQyxDQUFBO0lBRE87O2tDQUdqQixzQkFBQSxHQUF3QixTQUFDLG1CQUFEO01BQUMsSUFBQyxDQUFBLHNCQUFEO2FBQ3ZCLElBQUMsQ0FBQSwyQkFBRCxDQUFBO0lBRHNCOztrQ0FHeEIsbUJBQUEsR0FBcUIsU0FBQyxRQUFEO0FBQ25CLGFBQU8sSUFBQyxDQUFBLG1CQUFtQixDQUFDLEdBQXJCLENBQXlCLFFBQXpCO0lBRFk7O2tDQUdyQixXQUFBLEdBQWEsU0FBQyxPQUFELEVBQVUsT0FBVjtBQUNYLGFBQU8sSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksYUFBQSxHQUFnQixPQUE1QixFQUFxQyxPQUFyQztJQURJOzs7OztBQTNHZiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyfSA9IHJlcXVpcmUgJ2F0b20nXG51dGlscyA9IHJlcXVpcmUgJy4vdXRpbHMnXG5HaXRSZXBvc2l0b3J5QXN5bmMgPSByZXF1aXJlICcuL2dpdHJlcG9zaXRvcnlhc3luYydcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFByb2plY3RSZXBvc2l0b3JpZXNcblxuICBwcm9qZWN0U3Vic2NyaXB0aW9uczogbnVsbFxuICByZXBvc2l0b3J5U3Vic2NyaXB0aW9uczogbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAoQGlnbm9yZWRSZXBvc2l0b3JpZXMpIC0+XG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEByZXBvc2l0b3J5TWFwID0gbmV3IE1hcFxuICAgIEBwcm9qZWN0U3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHJlcG9zaXRvcnlTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAcHJvamVjdFN1YnNjcmlwdGlvbnMuYWRkIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzID0+XG4gICAgICAjIFJlZnJlc2ggU0NNIHJlc3Bvcml0eSBzdWJzY3JpcHRpb25zXG4gICAgICBAc3Vic2NyaWJlVXBkYXRlUmVwb3NpdG9yaWVzKClcbiAgICBAc3Vic2NyaWJlVXBkYXRlUmVwb3NpdG9yaWVzKClcblxuICBkZXN0cnVjdDogLT5cbiAgICBAcHJvamVjdFN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEBwcm9qZWN0U3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICBAcmVwb3NpdG9yeVN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEByZXBvc2l0b3J5U3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICBAaWdub3JlZFJlcG9zaXRvcmllcyA9IG51bGxcbiAgICBAcmVwb3NpdG9yeU1hcD8uY2xlYXIoKVxuICAgIEByZXBvc2l0b3J5TWFwID0gbnVsbFxuICAgIEBlbWl0dGVyPy5jbGVhcigpXG4gICAgQGVtaXR0ZXI/LmRpc3Bvc2UoKVxuICAgIEBlbWl0dGVyID0gbnVsbFxuXG4gIHN1YnNjcmliZVVwZGF0ZVJlcG9zaXRvcmllczogLT5cbiAgICBAcmVwb3NpdG9yeVN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIHRtcFJlcG9zaXRvcnlTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICByZXBvc2l0b3J5TWFwID0gbmV3IE1hcCgpXG4gICAgcmVwb1Byb21pc2VzID0gW11cbiAgICBmb3IgcmVwbyBpbiBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKCkgd2hlbiByZXBvP1xuICAgICAgcmVwb1Byb21pc2VzLnB1c2ggQGRvU3Vic2NyaWJlVXBkYXRlUmVwb3NpdG9yeShcbiAgICAgICAgcmVwbywgcmVwb3NpdG9yeU1hcCwgdG1wUmVwb3NpdG9yeVN1YnNjcmlwdGlvbnNcbiAgICAgIClcbiAgICByZXR1cm4gdXRpbHMuc2V0dGxlKHJlcG9Qcm9taXNlcylcbiAgICAgIC50aGVuKCgpID0+XG4gICAgICAgICMgVmVyaWZ5IGlmIHRoZSByZXBvc2l0b3JpZXMgaW5zdGFuY2UgaGF2ZW4ndCBiZWVuIHlldFxuICAgICAgICAjIGRlc3RydWN0ZWQgKGkuZS4gaWYgd2UgYXJlIHN0aWxsIFwidG9nZ2xlZFwiKVxuICAgICAgICBpZiBAcmVwb3NpdG9yeU1hcD9cbiAgICAgICAgICBAcmVwb3NpdG9yeVN1YnNjcmlwdGlvbnMgPSB0bXBSZXBvc2l0b3J5U3Vic2NyaXB0aW9uc1xuICAgICAgICAgIEByZXBvc2l0b3J5TWFwID0gcmVwb3NpdG9yeU1hcFxuICAgICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jaGFuZ2UtcmVwb3MnLCBAcmVwb3NpdG9yeU1hcFxuICAgICAgICBlbHNlXG4gICAgICAgICAgdG1wUmVwb3NpdG9yeVN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICApXG4gICAgICAuY2F0Y2goKGVycikgLT5cbiAgICAgICAgIyBMb2cgZXJyb3JcbiAgICAgICAgY29uc29sZS5lcnJvciBlcnJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycilcbiAgICAgIClcblxuICBkb1N1YnNjcmliZVVwZGF0ZVJlcG9zaXRvcnk6IChyZXBvLCByZXBvc2l0b3J5TWFwLCByZXBvc2l0b3J5U3Vic2NyaXB0aW9ucykgLT5cbiAgICBpZiByZXBvLmFzeW5jP1xuICAgICAgcmVwb2FzeW5jID0gcmVwby5hc3luY1xuICAgIGVsc2VcbiAgICAgIHJlcG9hc3luYyA9IG5ldyBHaXRSZXBvc2l0b3J5QXN5bmMocmVwbylcblxuICAgICMgVmFsaWRhdGUgcmVwbyB0byBhdm9pZCBlcnJvcnMgZnJvbSB0aGlyZHBhcnR5IHJlcG8gaGFuZGxlcnNcbiAgICByZXR1cm4gcmVwb2FzeW5jLmdldFNob3J0SGVhZCgpXG4gICAgICAudGhlbigoc2hvcnRIZWFkKSAtPlxuICAgICAgICBpZiBub3QgdHlwZW9mIHNob3J0SGVhZCBpcyAnc3RyaW5nJ1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnR290IGludmFsaWQgc2hvcnQgaGVhZCBmb3IgcmVwbycpXG4gICAgICApXG4gICAgICAudGhlbigoKSA9PlxuICAgICAgICByZXR1cm4gcmVwb2FzeW5jLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuICAgICAgICAgIC50aGVuKChkaXJlY3RvcnkpID0+XG4gICAgICAgICAgICBpZiBub3QgdHlwZW9mIGRpcmVjdG9yeSBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXG4gICAgICAgICAgICAgICAgJ0dvdCBpbnZhbGlkIHdvcmtpbmcgZGlyZWN0b3J5IHBhdGggZm9yIHJlcG8nXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIHJlcG9QYXRoID0gdXRpbHMubm9ybWFsaXplUGF0aChkaXJlY3RvcnkpXG4gICAgICAgICAgICBpZiAhQGlzUmVwb3NpdG9yeUlnbm9yZWQocmVwb1BhdGgpXG4gICAgICAgICAgICAgIHJlcG9zaXRvcnlNYXAuc2V0IHJlcG9QYXRoLCByZXBvYXN5bmNcbiAgICAgICAgICAgICAgQHN1YnNjcmliZVRvUmVwbyByZXBvUGF0aCwgcmVwb2FzeW5jLCByZXBvc2l0b3J5U3Vic2NyaXB0aW9uc1xuICAgICAgICAgIClcbiAgICAgIClcbiAgICAgIC5jYXRjaCgoZXJyb3IpIC0+XG4gICAgICAgIGNvbnNvbGUud2FybiAnSWdub3JpbmcgcmVzcG9yaXR5IGR1ZSB0byBlcnJvcjonLCBlcnJvciwgcmVwb1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgIClcblxuICBzdWJzY3JpYmVUb1JlcG86IChyZXBvUGF0aCwgcmVwbywgcmVwb3NpdG9yeVN1YnNjcmlwdGlvbnMpIC0+XG4gICAgcmVwb3NpdG9yeVN1YnNjcmlwdGlvbnM/LmFkZCByZXBvLm9uRGlkQ2hhbmdlU3RhdHVzZXMgPT5cbiAgICAgICMgU2FuaXR5IGNoZWNrXG4gICAgICBpZiBAcmVwb3NpdG9yeU1hcD8uaGFzKHJlcG9QYXRoKVxuICAgICAgICBAZW1pdHRlcj8uZW1pdCAnZGlkLWNoYW5nZS1yZXBvLXN0YXR1cycsIHsgcmVwbywgcmVwb1BhdGggfVxuICAgIHJlcG9zaXRvcnlTdWJzY3JpcHRpb25zPy5hZGQgcmVwby5vbkRpZENoYW5nZVN0YXR1cyA9PlxuICAgICAgIyBTYW5pdHkgY2hlY2tcbiAgICAgIGlmIEByZXBvc2l0b3J5TWFwPy5oYXMocmVwb1BhdGgpXG4gICAgICAgIEBlbWl0dGVyPy5lbWl0ICdkaWQtY2hhbmdlLXJlcG8tc3RhdHVzJywgeyByZXBvLCByZXBvUGF0aCB9XG5cbiAgZ2V0UmVwb3NpdG9yaWVzOiAoKSAtPlxuICAgIHJldHVybiBAcmVwb3NpdG9yeU1hcFxuXG4gIHNldElnbm9yZWRSZXBvc2l0b3JpZXM6IChAaWdub3JlZFJlcG9zaXRvcmllcykgLT5cbiAgICBAc3Vic2NyaWJlVXBkYXRlUmVwb3NpdG9yaWVzKClcblxuICBpc1JlcG9zaXRvcnlJZ25vcmVkOiAocmVwb1BhdGgpIC0+XG4gICAgcmV0dXJuIEBpZ25vcmVkUmVwb3NpdG9yaWVzLmhhcyhyZXBvUGF0aClcblxuICBvbkRpZENoYW5nZTogKGV2dFR5cGUsIGhhbmRsZXIpIC0+XG4gICAgcmV0dXJuIEBlbWl0dGVyLm9uICdkaWQtY2hhbmdlLScgKyBldnRUeXBlLCBoYW5kbGVyXG4iXX0=
