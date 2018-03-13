(function() {
  var _, fs, getFileURLFromPathnameAndOptions, getHREFFromFileURLs, getPathnameAndOptionsFromFileURL, getURLFromHREFAndBaseURL, path, url;

  _ = require('underscore-plus');

  path = require('path');

  url = require('url');

  fs = require('fs');

  getHREFFromFileURLs = function(fromFileURL, toFileURL, options) {
    var finalPathname, finalURLlObject, fromPathname, fromPathnameAndOptions, key, ref, ref1, toPathname, toPathnameAndOptions, value;
    if (options == null) {
      options = {};
    }
    toPathnameAndOptions = getPathnameAndOptionsFromFileURL(toFileURL);
    toPathname = toPathnameAndOptions.pathname;
    fromPathnameAndOptions = getPathnameAndOptionsFromFileURL(fromFileURL);
    fromPathname = fromPathnameAndOptions.pathname;
    finalURLlObject = {};
    finalPathname = '';
    if (fromPathnameAndOptions.pathname !== '.') {
      if (fromPathname !== toPathname) {
        if (fs.statSync(fromPathname).isFile()) {
          fromPathname = path.dirname(fromPathname);
        }
        finalPathname = path.relative(fromPathname, toPathname);
      }
    } else {
      if (toPathnameAndOptions.pathname === '.') {
        finalPathname = '';
      } else {
        finalPathname = toPathnameAndOptions.pathname;
      }
    }
    finalURLlObject.pathname = finalPathname;
    if (path.isAbsolute(finalPathname)) {
      finalURLlObject.protocol = 'file';
      finalURLlObject.slashes = true;
    }
    options = _.clone(options);
    ref = toPathnameAndOptions.options;
    for (key in ref) {
      value = ref[key];
      if (options[key] == null) {
        options[key] = value;
      }
    }
    ref1 = fromPathnameAndOptions.options;
    for (key in ref1) {
      value = ref1[key];
      if (options[key] == null) {
        options[key] = value;
      }
    }
    if (options.hash) {
      finalURLlObject.hash = options.hash.substr(1);
      delete options.hash;
    }
    finalURLlObject.query = options;
    return url.format(finalURLlObject);
  };

  getURLFromHREFAndBaseURL = function(href, baseURL, options) {
    var protocol;
    if (options == null) {
      options = {};
    }
    protocol = url.parse(href).protocol;
    if (!protocol) {
      if (!baseURL) {
        return null;
      }
      href = url.resolve(baseURL, href);
    }
    return href;
  };

  getFileURLFromPathnameAndOptions = function(pathname, options) {
    var each, encodedPathSegments, hash, i, len, ref, urlObject;
    pathname = path.resolve(pathname);
    pathname = pathname.replace(/\\/g, '/');
    encodedPathSegments = [];
    ref = pathname.split('/');
    for (i = 0, len = ref.length; i < len; i++) {
      each = ref[i];
      if (pathname.match(/^[a-zA-Z]:/)) {
        encodedPathSegments.push(each);
      } else {
        encodedPathSegments.push(encodeURIComponent(each));
      }
    }
    pathname = encodedPathSegments.join('/');
    if (options == null) {
      options = {};
    }
    hash = options.hash;
    if (hash) {
      delete options.hash;
    }
    urlObject = {
      protocol: 'file',
      pathname: pathname,
      slashes: true,
      query: options,
      hash: hash
    };
    return url.format(urlObject);
  };

  getPathnameAndOptionsFromFileURL = function(fileURL) {
    var each, key, options, pathname, ref, ref1, urlObject, value;
    urlObject = null;
    if (_.isString(fileURL)) {
      urlObject = url.parse(fileURL, true);
    } else {
      urlObject = fileURL;
    }
    pathname = (ref = urlObject.pathname) != null ? ref : '';
    options = {};
    if (pathname.match(/^\/[a-zA-Z]:/)) {
      pathname = pathname.substr(1);
    }
    pathname = ((function() {
      var i, len, ref1, results;
      ref1 = pathname.split('/');
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        each = ref1[i];
        results.push(decodeURIComponent(each));
      }
      return results;
    })()).join(path.sep);
    pathname = path.normalize(pathname);
    if (urlObject.hash) {
      if (options.hash == null) {
        options.hash = urlObject.hash.substr(1);
      }
    }
    ref1 = urlObject.query;
    for (key in ref1) {
      value = ref1[key];
      if (options[key] == null) {
        options[key] = value;
      }
    }
    return {
      pathname: pathname,
      options: options
    };
  };

  module.exports = {
    getHREFFromFileURLs: getHREFFromFileURLs,
    getURLFromHREFAndBaseURL: getURLFromHREFAndBaseURL,
    getFileURLFromPathnameAndOptions: getFileURLFromPathnameAndOptions,
    getPathnameAndOptionsFromFileURL: getPathnameAndOptionsFromFileURL
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9mb2xkaW5ndGV4dC1mb3ItYXRvbS9saWIvY29yZS91cmwtdXRpbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUjs7RUFDTixFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBRUwsbUJBQUEsR0FBc0IsU0FBQyxXQUFELEVBQWMsU0FBZCxFQUF5QixPQUF6QjtBQUNwQixRQUFBOztNQUQ2QyxVQUFROztJQUNyRCxvQkFBQSxHQUF1QixnQ0FBQSxDQUFpQyxTQUFqQztJQUN2QixVQUFBLEdBQWEsb0JBQW9CLENBQUM7SUFDbEMsc0JBQUEsR0FBeUIsZ0NBQUEsQ0FBaUMsV0FBakM7SUFDekIsWUFBQSxHQUFlLHNCQUFzQixDQUFDO0lBQ3RDLGVBQUEsR0FBa0I7SUFDbEIsYUFBQSxHQUFnQjtJQUVoQixJQUFPLHNCQUFzQixDQUFDLFFBQXZCLEtBQW1DLEdBQTFDO01BQ0UsSUFBTyxZQUFBLEtBQWdCLFVBQXZCO1FBQ0UsSUFBRyxFQUFFLENBQUMsUUFBSCxDQUFZLFlBQVosQ0FBeUIsQ0FBQyxNQUExQixDQUFBLENBQUg7VUFDRSxZQUFBLEdBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxZQUFiLEVBRGpCOztRQUVBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLFFBQUwsQ0FBYyxZQUFkLEVBQTRCLFVBQTVCLEVBSGxCO09BREY7S0FBQSxNQUFBO01BTUUsSUFBRyxvQkFBb0IsQ0FBQyxRQUFyQixLQUFpQyxHQUFwQztRQUNFLGFBQUEsR0FBZ0IsR0FEbEI7T0FBQSxNQUFBO1FBR0UsYUFBQSxHQUFnQixvQkFBb0IsQ0FBQyxTQUh2QztPQU5GOztJQVdB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QUMsSUFBYjs7UUFDRSxPQUFPLENBQUMsT0FBUSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQWYsQ0FBc0IsQ0FBdEI7T0FEbEI7O0FBRUE7QUFBQSxTQUFBLFdBQUE7OztRQUFBLE9BQVEsQ0FBQSxHQUFBLElBQVE7O0FBQWhCO1dBR0U7TUFBQSxRQUFBLEVBQVUsUUFBVjtNQUNBLE9BQUEsRUFBUyxPQURUOztFQXJCK0I7O0VBd0JuQyxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsbUJBQUEsRUFBcUIsbUJBQXJCO0lBQ0Esd0JBQUEsRUFBMEIsd0JBRDFCO0lBRUEsZ0NBQUEsRUFBa0MsZ0NBRmxDO0lBR0EsZ0NBQUEsRUFBa0MsZ0NBSGxDOztBQXBHRiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbnVybCA9IHJlcXVpcmUgJ3VybCdcbmZzID0gcmVxdWlyZSAnZnMnXG5cbmdldEhSRUZGcm9tRmlsZVVSTHMgPSAoZnJvbUZpbGVVUkwsIHRvRmlsZVVSTCwgb3B0aW9ucz17fSkgLT5cbiAgdG9QYXRobmFtZUFuZE9wdGlvbnMgPSBnZXRQYXRobmFtZUFuZE9wdGlvbnNGcm9tRmlsZVVSTCh0b0ZpbGVVUkwpXG4gIHRvUGF0aG5hbWUgPSB0b1BhdGhuYW1lQW5kT3B0aW9ucy5wYXRobmFtZVxuICBmcm9tUGF0aG5hbWVBbmRPcHRpb25zID0gZ2V0UGF0aG5hbWVBbmRPcHRpb25zRnJvbUZpbGVVUkwoZnJvbUZpbGVVUkwpXG4gIGZyb21QYXRobmFtZSA9IGZyb21QYXRobmFtZUFuZE9wdGlvbnMucGF0aG5hbWVcbiAgZmluYWxVUkxsT2JqZWN0ID0ge31cbiAgZmluYWxQYXRobmFtZSA9ICcnXG5cbiAgdW5sZXNzIGZyb21QYXRobmFtZUFuZE9wdGlvbnMucGF0aG5hbWUgaXMgJy4nXG4gICAgdW5sZXNzIGZyb21QYXRobmFtZSBpcyB0b1BhdGhuYW1lXG4gICAgICBpZiBmcy5zdGF0U3luYyhmcm9tUGF0aG5hbWUpLmlzRmlsZSgpXG4gICAgICAgIGZyb21QYXRobmFtZSA9IHBhdGguZGlybmFtZShmcm9tUGF0aG5hbWUpXG4gICAgICBmaW5hbFBhdGhuYW1lID0gcGF0aC5yZWxhdGl2ZShmcm9tUGF0aG5hbWUsIHRvUGF0aG5hbWUpXG4gIGVsc2VcbiAgICBpZiB0b1BhdGhuYW1lQW5kT3B0aW9ucy5wYXRobmFtZSBpcyAnLidcbiAgICAgIGZpbmFsUGF0aG5hbWUgPSAnJ1xuICAgIGVsc2VcbiAgICAgIGZpbmFsUGF0aG5hbWUgPSB0b1BhdGhuYW1lQW5kT3B0aW9ucy5wYXRobmFtZVxuXG4gIGZpbmFsVVJMbE9iamVjdC5wYXRobmFtZSA9IGZpbmFsUGF0aG5hbWVcbiAgaWYgcGF0aC5pc0Fic29sdXRlKGZpbmFsUGF0aG5hbWUpXG4gICAgZmluYWxVUkxsT2JqZWN0LnByb3RvY29sID0gJ2ZpbGUnXG4gICAgZmluYWxVUkxsT2JqZWN0LnNsYXNoZXMgPSB0cnVlXG5cbiAgIyBNZXJnZSBvcHRpb25zIGFuZCB1c2UgYXMgaGFzaCBhbmQgcXVlcnkgcGFyYW1zXG4gIG9wdGlvbnMgPSBfLmNsb25lKG9wdGlvbnMpXG4gIG9wdGlvbnNba2V5XSA/PSB2YWx1ZSBmb3Iga2V5LCB2YWx1ZSBvZiB0b1BhdGhuYW1lQW5kT3B0aW9ucy5vcHRpb25zXG4gIG9wdGlvbnNba2V5XSA/PSB2YWx1ZSBmb3Iga2V5LCB2YWx1ZSBvZiBmcm9tUGF0aG5hbWVBbmRPcHRpb25zLm9wdGlvbnNcbiAgaWYgb3B0aW9ucy5oYXNoXG4gICAgZmluYWxVUkxsT2JqZWN0Lmhhc2ggPSBvcHRpb25zLmhhc2guc3Vic3RyKDEpXG4gICAgZGVsZXRlIG9wdGlvbnMuaGFzaFxuICBmaW5hbFVSTGxPYmplY3QucXVlcnkgPSBvcHRpb25zXG5cbiAgdXJsLmZvcm1hdChmaW5hbFVSTGxPYmplY3QpXG5cbmdldFVSTEZyb21IUkVGQW5kQmFzZVVSTCA9IChocmVmLCBiYXNlVVJMLCBvcHRpb25zPXt9KSAtPlxuICBwcm90b2NvbCA9IHVybC5wYXJzZShocmVmKS5wcm90b2NvbFxuICB1bmxlc3MgcHJvdG9jb2xcbiAgICB1bmxlc3MgYmFzZVVSTFxuICAgICAgcmV0dXJuIG51bGxcbiAgICBocmVmID0gdXJsLnJlc29sdmUoYmFzZVVSTCwgaHJlZilcbiAgaHJlZlxuXG5nZXRGaWxlVVJMRnJvbVBhdGhuYW1lQW5kT3B0aW9ucyA9IChwYXRobmFtZSwgb3B0aW9ucykgLT5cbiAgcGF0aG5hbWUgPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpXG4gIHBhdGhuYW1lID0gcGF0aG5hbWUucmVwbGFjZSgvXFxcXC9nLCAnLycpXG5cbiAgZW5jb2RlZFBhdGhTZWdtZW50cyA9IFtdXG4gIGZvciBlYWNoIGluIHBhdGhuYW1lLnNwbGl0KCcvJylcbiAgICBpZiBwYXRobmFtZS5tYXRjaCgvXlthLXpBLVpdOi8pXG4gICAgICAjIERvbid0IGVuY29kZSBXaW5kb3dzIGRyaXZlIGxldHRlclxuICAgICAgZW5jb2RlZFBhdGhTZWdtZW50cy5wdXNoKGVhY2gpXG4gICAgZWxzZVxuICAgICAgZW5jb2RlZFBhdGhTZWdtZW50cy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChlYWNoKSlcbiAgcGF0aG5hbWUgPSBlbmNvZGVkUGF0aFNlZ21lbnRzLmpvaW4oJy8nKVxuXG4gIG9wdGlvbnMgPz0ge31cbiAgaGFzaCA9IG9wdGlvbnMuaGFzaFxuICBpZiBoYXNoXG4gICAgZGVsZXRlIG9wdGlvbnMuaGFzaFxuXG4gIHVybE9iamVjdCA9XG4gICAgcHJvdG9jb2w6ICdmaWxlJ1xuICAgIHBhdGhuYW1lOiBwYXRobmFtZVxuICAgIHNsYXNoZXM6IHRydWVcbiAgICBxdWVyeTogb3B0aW9uc1xuICAgIGhhc2g6IGhhc2hcblxuICB1cmwuZm9ybWF0KHVybE9iamVjdClcblxuZ2V0UGF0aG5hbWVBbmRPcHRpb25zRnJvbUZpbGVVUkwgPSAoZmlsZVVSTCkgLT5cbiAgdXJsT2JqZWN0ID0gbnVsbFxuICBpZiBfLmlzU3RyaW5nKGZpbGVVUkwpXG4gICAgdXJsT2JqZWN0ID0gdXJsLnBhcnNlKGZpbGVVUkwsIHRydWUpXG4gIGVsc2VcbiAgICB1cmxPYmplY3QgPSBmaWxlVVJMXG4gIHBhdGhuYW1lID0gdXJsT2JqZWN0LnBhdGhuYW1lID8gJydcbiAgb3B0aW9ucyA9IHt9XG5cbiAgIyBEZXRlY3Qgd2luZG93cyBkcml2ZSBsZXR0ZXIgYW5kIHRoZW4gSGFuZGxlIGxlYWRpbmcgLyBpbiBwYXRobmFtZSBvZlxuICAjIGEgd2luZG93cyBmaWxlIFVSTCBzdWNoIGFzIGZpbGU6Ly8vQzovaGVsbG8udHh0XG4gIGlmIHBhdGhuYW1lLm1hdGNoKC9eXFwvW2EtekEtWl06LylcbiAgICBwYXRobmFtZSA9IHBhdGhuYW1lLnN1YnN0cigxKVxuICBwYXRobmFtZSA9IChkZWNvZGVVUklDb21wb25lbnQoZWFjaCkgZm9yIGVhY2ggaW4gcGF0aG5hbWUuc3BsaXQoJy8nKSkuam9pbihwYXRoLnNlcClcbiAgcGF0aG5hbWUgPSBwYXRoLm5vcm1hbGl6ZShwYXRobmFtZSlcblxuICBpZiB1cmxPYmplY3QuaGFzaFxuICAgIG9wdGlvbnMuaGFzaCA/PSB1cmxPYmplY3QuaGFzaC5zdWJzdHIoMSlcbiAgb3B0aW9uc1trZXldID89IHZhbHVlIGZvciBrZXksIHZhbHVlIG9mIHVybE9iamVjdC5xdWVyeVxuXG4gIHt9ID1cbiAgICBwYXRobmFtZTogcGF0aG5hbWVcbiAgICBvcHRpb25zOiBvcHRpb25zXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZ2V0SFJFRkZyb21GaWxlVVJMczogZ2V0SFJFRkZyb21GaWxlVVJMc1xuICBnZXRVUkxGcm9tSFJFRkFuZEJhc2VVUkw6IGdldFVSTEZyb21IUkVGQW5kQmFzZVVSTFxuICBnZXRGaWxlVVJMRnJvbVBhdGhuYW1lQW5kT3B0aW9uczogZ2V0RmlsZVVSTEZyb21QYXRobmFtZUFuZE9wdGlvbnNcbiAgZ2V0UGF0aG5hbWVBbmRPcHRpb25zRnJvbUZpbGVVUkw6IGdldFBhdGhuYW1lQW5kT3B0aW9uc0Zyb21GaWxlVVJMIl19
