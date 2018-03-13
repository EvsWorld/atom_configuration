(function() {
  var GitRepositoryAsync;

  module.exports = GitRepositoryAsync = (function() {
    GitRepositoryAsync.prototype.repo = null;

    function GitRepositoryAsync(repo) {
      this.repo = repo;
    }

    GitRepositoryAsync.prototype.destruct = function() {
      return this.repo = null;
    };

    GitRepositoryAsync.prototype.getShortHead = function() {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.repo.getShortHead();
        };
      })(this));
    };

    GitRepositoryAsync.prototype.getWorkingDirectory = function() {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.repo.getWorkingDirectory();
        };
      })(this));
    };

    GitRepositoryAsync.prototype.onDidChangeStatuses = function(callback) {
      return this.repo.onDidChangeStatuses(callback);
    };

    GitRepositoryAsync.prototype.onDidChangeStatus = function(callback) {
      return this.repo.onDidChangeStatus(callback);
    };

    GitRepositoryAsync.prototype.getDirectoryStatus = function(path) {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.repo.getDirectoryStatus(path);
        };
      })(this));
    };

    GitRepositoryAsync.prototype.getRootDirectoryStatus = function() {
      return Promise.resolve().then((function(_this) {
        return function() {
          var directoryStatus, path, ref, status;
          directoryStatus = 0;
          ref = _this.repo.statuses;
          for (path in ref) {
            status = ref[path];
            directoryStatus |= status;
          }
          return directoryStatus;
        };
      })(this));
    };

    GitRepositoryAsync.prototype.refreshStatus = function() {
      return Promise.resolve();
    };

    GitRepositoryAsync.prototype.getCachedUpstreamAheadBehindCount = function(path) {
      return Promise.resolve().then((function(_this) {
        return function() {
          return _this.repo.getCachedUpstreamAheadBehindCount(path);
        };
      })(this));
    };

    GitRepositoryAsync.prototype.isStatusModified = function(status) {
      return this.repo.isStatusModified(status);
    };

    GitRepositoryAsync.prototype.isStatusNew = function(status) {
      return this.repo.isStatusNew(status);
    };

    return GitRepositoryAsync;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90cmVlLXZpZXctZ2l0LXN0YXR1cy9saWIvZ2l0cmVwb3NpdG9yeWFzeW5jLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7aUNBRXJCLElBQUEsR0FBTTs7SUFFTyw0QkFBQyxJQUFEO01BQUMsSUFBQyxDQUFBLE9BQUQ7SUFBRDs7aUNBRWIsUUFBQSxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsSUFBRCxHQUFRO0lBREE7O2lDQUdWLFlBQUEsR0FBYyxTQUFBO0FBQ1osYUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQ0wsQ0FBQyxJQURJLENBQ0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxJQUFJLENBQUMsWUFBTixDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREQ7SUFESzs7aUNBSWQsbUJBQUEsR0FBcUIsU0FBQTtBQUNuQixhQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FDTCxDQUFDLElBREksQ0FDQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREQ7SUFEWTs7aUNBSXJCLG1CQUFBLEdBQXFCLFNBQUMsUUFBRDtBQUNuQixhQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBMEIsUUFBMUI7SUFEWTs7aUNBR3JCLGlCQUFBLEdBQW1CLFNBQUMsUUFBRDtBQUNqQixhQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsaUJBQU4sQ0FBd0IsUUFBeEI7SUFEVTs7aUNBR25CLGtCQUFBLEdBQW9CLFNBQUMsSUFBRDtBQUNsQixhQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FDTCxDQUFDLElBREksQ0FDQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLElBQUksQ0FBQyxrQkFBTixDQUF5QixJQUF6QjtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUREO0lBRFc7O2lDQUlwQixzQkFBQSxHQUF3QixTQUFBO0FBQ3RCLGFBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFpQixDQUFDLElBQWxCLENBQXVCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUM1QixjQUFBO1VBQUEsZUFBQSxHQUFrQjtBQUNsQjtBQUFBLGVBQUEsV0FBQTs7WUFDRSxlQUFBLElBQW1CO0FBRHJCO0FBRUEsaUJBQU87UUFKcUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCO0lBRGU7O2lDQU94QixhQUFBLEdBQWUsU0FBQTtBQUNiLGFBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtJQURNOztpQ0FHZixpQ0FBQSxHQUFtQyxTQUFDLElBQUQ7QUFDakMsYUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQ0wsQ0FBQyxJQURJLENBQ0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxJQUFJLENBQUMsaUNBQU4sQ0FBd0MsSUFBeEM7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FERDtJQUQwQjs7aUNBSW5DLGdCQUFBLEdBQWtCLFNBQUMsTUFBRDtBQUNoQixhQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsZ0JBQU4sQ0FBdUIsTUFBdkI7SUFEUzs7aUNBR2xCLFdBQUEsR0FBYSxTQUFDLE1BQUQ7QUFDWCxhQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFrQixNQUFsQjtJQURJOzs7OztBQTVDZiIsInNvdXJjZXNDb250ZW50IjpbIlxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHaXRSZXBvc2l0b3J5QXN5bmNcblxuICByZXBvOiBudWxsXG5cbiAgY29uc3RydWN0b3I6IChAcmVwbykgLT5cblxuICBkZXN0cnVjdDogLT5cbiAgICBAcmVwbyA9IG51bGxcblxuICBnZXRTaG9ydEhlYWQ6IC0+XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAudGhlbiA9PiBAcmVwby5nZXRTaG9ydEhlYWQoKVxuXG4gIGdldFdvcmtpbmdEaXJlY3Rvcnk6IC0+XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAudGhlbiA9PiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcblxuICBvbkRpZENoYW5nZVN0YXR1c2VzOiAoY2FsbGJhY2spIC0+XG4gICAgcmV0dXJuIEByZXBvLm9uRGlkQ2hhbmdlU3RhdHVzZXMoY2FsbGJhY2spXG5cbiAgb25EaWRDaGFuZ2VTdGF0dXM6IChjYWxsYmFjaykgLT5cbiAgICByZXR1cm4gQHJlcG8ub25EaWRDaGFuZ2VTdGF0dXMoY2FsbGJhY2spXG5cbiAgZ2V0RGlyZWN0b3J5U3RhdHVzOiAocGF0aCkgLT5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgIC50aGVuID0+IEByZXBvLmdldERpcmVjdG9yeVN0YXR1cyhwYXRoKVxuXG4gIGdldFJvb3REaXJlY3RvcnlTdGF0dXM6IC0+XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gPT5cbiAgICAgIGRpcmVjdG9yeVN0YXR1cyA9IDBcbiAgICAgIGZvciBwYXRoLCBzdGF0dXMgb2YgQHJlcG8uc3RhdHVzZXNcbiAgICAgICAgZGlyZWN0b3J5U3RhdHVzIHw9IHN0YXR1c1xuICAgICAgcmV0dXJuIGRpcmVjdG9yeVN0YXR1c1xuXG4gIHJlZnJlc2hTdGF0dXM6IC0+XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cbiAgZ2V0Q2FjaGVkVXBzdHJlYW1BaGVhZEJlaGluZENvdW50OiAocGF0aCkgLT5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgIC50aGVuID0+IEByZXBvLmdldENhY2hlZFVwc3RyZWFtQWhlYWRCZWhpbmRDb3VudChwYXRoKVxuXG4gIGlzU3RhdHVzTW9kaWZpZWQ6IChzdGF0dXMpIC0+XG4gICAgcmV0dXJuIEByZXBvLmlzU3RhdHVzTW9kaWZpZWQoc3RhdHVzKVxuXG4gIGlzU3RhdHVzTmV3OiAoc3RhdHVzKSAtPlxuICAgIHJldHVybiBAcmVwby5pc1N0YXR1c05ldyhzdGF0dXMpXG4iXX0=
