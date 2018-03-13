(function() {
  var getRootDirectoryStatus, normalizePath, path, settle;

  path = require('path');

  normalizePath = function(repoPath) {
    var normPath;
    normPath = path.normalize(repoPath);
    if (process.platform === 'darwin') {
      normPath = normPath.replace(/^\/private/, '');
    }
    return normPath.replace(/[\\\/]$/, '');
  };

  getRootDirectoryStatus = function(repo) {
    var promise;
    promise = Promise.resolve();
    if ((repo._getStatus != null) || (repo.repo._getStatus != null)) {
      if (repo._getStatus != null) {
        promise = promise.then(function() {
          return repo._getStatus(['**']);
        });
      } else {
        promise = promise.then(function() {
          return repo.repo._getStatus(['**']);
        });
      }
      return promise.then(function(statuses) {
        return Promise.all(statuses.map(function(s) {
          return s.statusBit();
        })).then(function(bits) {
          var reduceFct;
          reduceFct = function(status, bit) {
            return status | bit;
          };
          return bits.filter(function(b) {
            return b > 0;
          }).reduce(reduceFct, 0);
        });
      });
    }
    return repo.getRootDirectoryStatus();
  };

  settle = function(promises) {
    var promiseWrapper;
    promiseWrapper = function(promise) {
      return promise.then(function(result) {
        return {
          resolved: result
        };
      })["catch"](function(err) {
        console.error(err);
        return {
          rejected: err
        };
      });
    };
    return Promise.all(promises.map(promiseWrapper)).then(function(results) {
      var rejectedPromises, strippedResults;
      rejectedPromises = results.filter(function(p) {
        return p.hasOwnProperty('rejected');
      });
      strippedResults = results.map(function(r) {
        return r.resolved || r.rejected;
      });
      if (rejectedPromises.length === 0) {
        return strippedResults;
      } else {
        return Promise.reject(strippedResults);
      }
    });
  };

  module.exports = {
    normalizePath: normalizePath,
    getRootDirectoryStatus: getRootDirectoryStatus,
    settle: settle
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90cmVlLXZpZXctZ2l0LXN0YXR1cy9saWIvdXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsYUFBQSxHQUFnQixTQUFDLFFBQUQ7QUFDZCxRQUFBO0lBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxTQUFMLENBQWUsUUFBZjtJQUNYLElBQUcsT0FBTyxDQUFDLFFBQVIsS0FBb0IsUUFBdkI7TUFRRSxRQUFBLEdBQVcsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsWUFBakIsRUFBK0IsRUFBL0IsRUFSYjs7QUFTQSxXQUFPLFFBQVEsQ0FBQyxPQUFULENBQWlCLFNBQWpCLEVBQTRCLEVBQTVCO0VBWE87O0VBYWhCLHNCQUFBLEdBQXlCLFNBQUMsSUFBRDtBQUN2QixRQUFBO0lBQUEsT0FBQSxHQUFVLE9BQU8sQ0FBQyxPQUFSLENBQUE7SUFDVixJQUFHLHlCQUFBLElBQW9CLDhCQUF2QjtNQUdFLElBQUcsdUJBQUg7UUFDRSxPQUFBLEdBQVUsT0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFBO0FBQ3JCLGlCQUFPLElBQUksQ0FBQyxVQUFMLENBQWdCLENBQUMsSUFBRCxDQUFoQjtRQURjLENBQWIsRUFEWjtPQUFBLE1BQUE7UUFJRSxPQUFBLEdBQVUsT0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFBO0FBQ3JCLGlCQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVixDQUFxQixDQUFDLElBQUQsQ0FBckI7UUFEYyxDQUFiLEVBSlo7O0FBTUEsYUFBTyxPQUNMLENBQUMsSUFESSxDQUNDLFNBQUMsUUFBRDtBQUNKLGVBQU8sT0FBTyxDQUFDLEdBQVIsQ0FDTCxRQUFRLENBQUMsR0FBVCxDQUFhLFNBQUMsQ0FBRDtpQkFBTyxDQUFDLENBQUMsU0FBRixDQUFBO1FBQVAsQ0FBYixDQURLLENBRU4sQ0FBQyxJQUZLLENBRUEsU0FBQyxJQUFEO0FBQ0wsY0FBQTtVQUFBLFNBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxHQUFUO0FBQ1YsbUJBQU8sTUFBQSxHQUFTO1VBRE47QUFFWixpQkFBTyxJQUNMLENBQUMsTUFESSxDQUNHLFNBQUMsQ0FBRDttQkFBTyxDQUFBLEdBQUk7VUFBWCxDQURILENBRUwsQ0FBQyxNQUZJLENBRUcsU0FGSCxFQUVjLENBRmQ7UUFIRixDQUZBO01BREgsQ0FERCxFQVRUOztBQW9CQSxXQUFPLElBQUksQ0FBQyxzQkFBTCxDQUFBO0VBdEJnQjs7RUEwQnpCLE1BQUEsR0FBUyxTQUFDLFFBQUQ7QUFDUCxRQUFBO0lBQUEsY0FBQSxHQUFpQixTQUFDLE9BQUQ7QUFDZixhQUFPLE9BQ0wsQ0FBQyxJQURJLENBQ0MsU0FBQyxNQUFEO0FBQ0osZUFBTztVQUFFLFFBQUEsRUFBVSxNQUFaOztNQURILENBREQsQ0FJTCxFQUFDLEtBQUQsRUFKSyxDQUlFLFNBQUMsR0FBRDtRQUNMLE9BQU8sQ0FBQyxLQUFSLENBQWMsR0FBZDtBQUNBLGVBQU87VUFBRSxRQUFBLEVBQVUsR0FBWjs7TUFGRixDQUpGO0lBRFE7QUFTakIsV0FBTyxPQUFPLENBQUMsR0FBUixDQUFZLFFBQVEsQ0FBQyxHQUFULENBQWEsY0FBYixDQUFaLENBQ0wsQ0FBQyxJQURJLENBQ0MsU0FBQyxPQUFEO0FBQ0osVUFBQTtNQUFBLGdCQUFBLEdBQW1CLE9BQU8sQ0FBQyxNQUFSLENBQWUsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLGNBQUYsQ0FBaUIsVUFBakI7TUFBUCxDQUFmO01BQ25CLGVBQUEsR0FBa0IsT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsUUFBRixJQUFjLENBQUMsQ0FBQztNQUF2QixDQUFaO01BQ2xCLElBQUcsZ0JBQWdCLENBQUMsTUFBakIsS0FBMkIsQ0FBOUI7QUFDRSxlQUFPLGdCQURUO09BQUEsTUFBQTtBQUdFLGVBQU8sT0FBTyxDQUFDLE1BQVIsQ0FBZSxlQUFmLEVBSFQ7O0lBSEksQ0FERDtFQVZBOztFQW1CVCxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUNmLGFBQUEsRUFBZSxhQURBO0lBRWYsc0JBQUEsRUFBd0Isc0JBRlQ7SUFHZixNQUFBLEVBQVEsTUFITzs7QUE1RGpCIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbm5vcm1hbGl6ZVBhdGggPSAocmVwb1BhdGgpIC0+XG4gIG5vcm1QYXRoID0gcGF0aC5ub3JtYWxpemUgcmVwb1BhdGhcbiAgaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnZGFyd2luJ1xuICAgICMgRm9yIHNvbWUgcmVhc29uIHRoZSBwYXRocyByZXR1cm5lZCBieSB0aGUgdHJlZS12aWV3IGFuZFxuICAgICMgZ2l0LXV0aWxzIGFyZSBzb21ldGltZXMgXCJkaWZmZXJlbnRcIiBvbiBEYXJ3aW4gcGxhdGZvcm1zLlxuICAgICMgRS5nLiAvcHJpdmF0ZS92YXIvLi4uIChyZWFsIHBhdGgpICE9PSAvdmFyLy4uLiAoc3ltbGluaylcbiAgICAjIEZvciBub3cganVzdCBzdHJpcCBhd2F5IHRoZSAvcHJpdmF0ZSBwYXJ0LlxuICAgICMgVXNpbmcgdGhlIGZzLnJlYWxQYXRoIGZ1bmN0aW9uIHRvIGF2b2lkIHRoaXMgaXNzdWUgaXNuJ3Qgc3VjaCBhIGdvb2RcbiAgICAjIGlkZWEgYmVjYXVzZSBpdCB0cmllcyB0byBhY2Nlc3MgdGhhdCBwYXRoIGFuZCBpbiBjYXNlIGl0J3Mgbm90XG4gICAgIyBleGlzdGluZyBwYXRoIGFuIGVycm9yIGdldHMgdGhyb3duICsgaXQncyBzbG93IGR1ZSB0byBmcyBhY2Nlc3MuXG4gICAgbm9ybVBhdGggPSBub3JtUGF0aC5yZXBsYWNlKC9eXFwvcHJpdmF0ZS8sICcnKVxuICByZXR1cm4gbm9ybVBhdGgucmVwbGFjZSgvW1xcXFxcXC9dJC8sICcnKVxuXG5nZXRSb290RGlyZWN0b3J5U3RhdHVzID0gKHJlcG8pIC0+XG4gIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKVxuICBpZiByZXBvLl9nZXRTdGF0dXM/IG9yIHJlcG8ucmVwby5fZ2V0U3RhdHVzP1xuICAgICMgV29ya2Fyb3VuZCBmb3IgQXRvbSA8IDEuOSBhcyBzdGlsbCB0aGlzIHJvb3QgZGlyZWN0b3J5IHN0YXR1cyBidWdcbiAgICAjIGV4aXN0cyBhbmQgdGhlIF9nZXRTdGF0dXMgZnVuY3Rpb24gaGFzIGJlZW4gbW92ZWQgaW50byBvaG5vZ2l0XG4gICAgaWYgcmVwby5fZ2V0U3RhdHVzP1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbiAtPlxuICAgICAgICByZXR1cm4gcmVwby5fZ2V0U3RhdHVzKFsnKionXSlcbiAgICBlbHNlXG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuIC0+XG4gICAgICAgIHJldHVybiByZXBvLnJlcG8uX2dldFN0YXR1cyhbJyoqJ10pXG4gICAgcmV0dXJuIHByb21pc2VcbiAgICAgIC50aGVuIChzdGF0dXNlcykgLT5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICAgIHN0YXR1c2VzLm1hcCgocykgLT4gcy5zdGF0dXNCaXQoKSlcbiAgICAgICAgKS50aGVuIChiaXRzKSAtPlxuICAgICAgICAgIHJlZHVjZUZjdCA9IChzdGF0dXMsIGJpdCkgLT5cbiAgICAgICAgICAgIHJldHVybiBzdGF0dXMgfCBiaXRcbiAgICAgICAgICByZXR1cm4gYml0c1xuICAgICAgICAgICAgLmZpbHRlcigoYikgLT4gYiA+IDApXG4gICAgICAgICAgICAucmVkdWNlKHJlZHVjZUZjdCwgMClcbiAgIyBBdG9tID49IDEuOSB3aXRoIG91ciBvd24gR2l0UmVwb3NpdG9yeUFzeW5jIHdyYXBwZXJcbiAgcmV0dXJuIHJlcG8uZ2V0Um9vdERpcmVjdG9yeVN0YXR1cygpXG5cbiMgV2FpdCB1bnRpbCBhbGwgcHJtb2lzZXMgaGF2ZSBiZWVuIHNldHRsZWQgZXZlbiB0aG91Z2h0IGEgcHJvbWlzZSBoYXNcbiMgYmVlbiByZWplY3RlZC5cbnNldHRsZSA9IChwcm9taXNlcykgLT5cbiAgcHJvbWlzZVdyYXBwZXIgPSAocHJvbWlzZSkgLT5cbiAgICByZXR1cm4gcHJvbWlzZVxuICAgICAgLnRoZW4oKHJlc3VsdCkgLT5cbiAgICAgICAgcmV0dXJuIHsgcmVzb2x2ZWQ6IHJlc3VsdCB9XG4gICAgICApXG4gICAgICAuY2F0Y2goKGVycikgLT5cbiAgICAgICAgY29uc29sZS5lcnJvciBlcnJcbiAgICAgICAgcmV0dXJuIHsgcmVqZWN0ZWQ6IGVyciB9XG4gICAgICApXG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcy5tYXAocHJvbWlzZVdyYXBwZXIpKVxuICAgIC50aGVuIChyZXN1bHRzKSAtPlxuICAgICAgcmVqZWN0ZWRQcm9taXNlcyA9IHJlc3VsdHMuZmlsdGVyIChwKSAtPiBwLmhhc093blByb3BlcnR5KCdyZWplY3RlZCcpXG4gICAgICBzdHJpcHBlZFJlc3VsdHMgPSByZXN1bHRzLm1hcCAocikgLT4gci5yZXNvbHZlZCB8fCByLnJlamVjdGVkXG4gICAgICBpZiByZWplY3RlZFByb21pc2VzLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldHVybiBzdHJpcHBlZFJlc3VsdHNcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHN0cmlwcGVkUmVzdWx0cylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG5vcm1hbGl6ZVBhdGg6IG5vcm1hbGl6ZVBhdGgsXG4gIGdldFJvb3REaXJlY3RvcnlTdGF0dXM6IGdldFJvb3REaXJlY3RvcnlTdGF0dXMsXG4gIHNldHRsZTogc2V0dGxlXG59XG4iXX0=
