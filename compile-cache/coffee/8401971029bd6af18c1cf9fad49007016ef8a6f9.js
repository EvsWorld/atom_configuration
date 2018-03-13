(function() {
  var CSON, defaults, engines, filetypes, getConfigFile, packagePath, path, prefix,
    slice = [].slice;

  CSON = require("season");

  path = require("path");

  prefix = "markdown-writer";

  packagePath = atom.packages.resolvePackagePath("markdown-writer");

  getConfigFile = function() {
    var parts;
    parts = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (packagePath) {
      return path.join.apply(path, [packagePath, "lib"].concat(slice.call(parts)));
    } else {
      return path.join.apply(path, [__dirname].concat(slice.call(parts)));
    }
  };

  defaults = CSON.readFileSync(getConfigFile("config.cson"));

  defaults["siteEngine"] = "general";

  defaults["projectConfigFile"] = "_mdwriter.cson";

  defaults["siteLinkPath"] = path.join(atom.getConfigDirPath(), prefix + "-links.cson");

  defaults["grammars"] = ['source.gfm', 'source.gfm.nvatom', 'source.litcoffee', 'source.asciidoc', 'text.md', 'text.plain', 'text.plain.null-grammar'];

  filetypes = {
    'source.asciidoc': CSON.readFileSync(getConfigFile("filetypes", "asciidoc.cson"))
  };

  engines = {
    html: {
      imageTag: "<a href=\"{site}/{slug}.html\" target=\"_blank\">\n  <img class=\"align{align}\" alt=\"{alt}\" src=\"{src}\" width=\"{width}\" height=\"{height}\" />\n</a>"
    },
    jekyll: {
      textStyles: {
        codeblock: {
          before: "{% highlight %}\n",
          after: "\n{% endhighlight %}",
          regexBefore: "{% highlight(?: .+)? %}\\r?\\n",
          regexAfter: "\\r?\\n{% endhighlight %}"
        }
      }
    },
    octopress: {
      imageTag: "{% img {align} {src} {width} {height} '{alt}' %}"
    },
    hexo: {
      newPostFileName: "{title}{extension}",
      frontMatter: "layout: \"{layout}\"\ntitle: \"{title}\"\ndate: \"{date}\"\n---"
    }
  };

  module.exports = {
    projectConfigs: {},
    engineNames: function() {
      return Object.keys(engines);
    },
    keyPath: function(key) {
      return prefix + "." + key;
    },
    get: function(key, options) {
      var allow_blank, config, i, len, ref, val;
      if (options == null) {
        options = {};
      }
      allow_blank = options["allow_blank"] != null ? options["allow_blank"] : true;
      ref = ["Project", "User", "Engine", "Filetype", "Default"];
      for (i = 0, len = ref.length; i < len; i++) {
        config = ref[i];
        val = this["get" + config](key);
        if (allow_blank) {
          if (val != null) {
            return val;
          }
        } else {
          if (val) {
            return val;
          }
        }
      }
    },
    set: function(key, val) {
      return atom.config.set(this.keyPath(key), val);
    },
    restoreDefault: function(key) {
      return atom.config.unset(this.keyPath(key));
    },
    getDefault: function(key) {
      return this._valueForKeyPath(defaults, key);
    },
    getFiletype: function(key) {
      var editor, filetypeConfig;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return void 0;
      }
      filetypeConfig = filetypes[editor.getGrammar().scopeName];
      if (filetypeConfig == null) {
        return void 0;
      }
      return this._valueForKeyPath(filetypeConfig, key);
    },
    getEngine: function(key) {
      var engine, engineConfig;
      engine = this.getProject("siteEngine") || this.getUser("siteEngine") || this.getDefault("siteEngine");
      engineConfig = engines[engine];
      if (engineConfig == null) {
        return void 0;
      }
      return this._valueForKeyPath(engineConfig, key);
    },
    getCurrentDefault: function(key) {
      return this.getEngine(key) || this.getDefault(key);
    },
    getUser: function(key) {
      return atom.config.get(this.keyPath(key), {
        sources: [atom.config.getUserConfigPath()]
      });
    },
    getProject: function(key) {
      var config, configFile;
      configFile = this.getProjectConfigFile();
      if (!configFile) {
        return;
      }
      config = this._loadProjectConfig(configFile);
      return this._valueForKeyPath(config, key);
    },
    getSampleConfigFile: function() {
      return getConfigFile("config.cson");
    },
    getProjectConfigFile: function() {
      var fileName, projectPath;
      if (!atom.project || atom.project.getPaths().length < 1) {
        return;
      }
      projectPath = atom.project.getPaths()[0];
      fileName = this.getUser("projectConfigFile") || this.getDefault("projectConfigFile");
      return path.join(projectPath, fileName);
    },
    _loadProjectConfig: function(configFile) {
      var error;
      if (this.projectConfigs[configFile]) {
        return this.projectConfigs[configFile];
      }
      try {
        return this.projectConfigs[configFile] = CSON.readFileSync(configFile) || {};
      } catch (error1) {
        error = error1;
        if (atom.inDevMode() && !/ENOENT/.test(error.message)) {
          console.info("Markdown Writer [config.coffee]: " + error);
        }
        return this.projectConfigs[configFile] = {};
      }
    },
    _valueForKeyPath: function(object, keyPath) {
      var i, key, keys, len;
      keys = keyPath.split(".");
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        object = object[key];
        if (object == null) {
          return;
        }
      }
      return object;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL2NvbmZpZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDRFQUFBO0lBQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOztFQUNQLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFBLEdBQVM7O0VBQ1QsV0FBQSxHQUFjLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWQsQ0FBaUMsaUJBQWpDOztFQUNkLGFBQUEsR0FBZ0IsU0FBQTtBQUNkLFFBQUE7SUFEZTtJQUNmLElBQUcsV0FBSDthQUFvQixJQUFJLENBQUMsSUFBTCxhQUFVLENBQUEsV0FBQSxFQUFhLEtBQU8sU0FBQSxXQUFBLEtBQUEsQ0FBQSxDQUE5QixFQUFwQjtLQUFBLE1BQUE7YUFDSyxJQUFJLENBQUMsSUFBTCxhQUFVLENBQUEsU0FBVyxTQUFBLFdBQUEsS0FBQSxDQUFBLENBQXJCLEVBREw7O0VBRGM7O0VBS2hCLFFBQUEsR0FBVyxJQUFJLENBQUMsWUFBTCxDQUFrQixhQUFBLENBQWMsYUFBZCxDQUFsQjs7RUFHWCxRQUFTLENBQUEsWUFBQSxDQUFULEdBQXlCOztFQUd6QixRQUFTLENBQUEsbUJBQUEsQ0FBVCxHQUFnQzs7RUFHaEMsUUFBUyxDQUFBLGNBQUEsQ0FBVCxHQUEyQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBQVYsRUFBc0MsTUFBRCxHQUFRLGFBQTdDOztFQUUzQixRQUFTLENBQUEsVUFBQSxDQUFULEdBQXVCLENBQ3JCLFlBRHFCLEVBRXJCLG1CQUZxQixFQUdyQixrQkFIcUIsRUFJckIsaUJBSnFCLEVBS3JCLFNBTHFCLEVBTXJCLFlBTnFCLEVBT3JCLHlCQVBxQjs7RUFXdkIsU0FBQSxHQUNFO0lBQUEsaUJBQUEsRUFBbUIsSUFB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RSxJQUFDLENBQUEsY0FBZSxDQUFBLFVBQUEsQ0FBaEIsR0FBOEIsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsVUFBbEIsQ0FBQSxJQUFpQyxHQUZqRTtPQUFBLGNBQUE7UUFHTTtRQUdKLElBQUcsSUFBSSxDQUFDLFNBQUwsQ0FBQSxDQUFBLElBQW9CLENBQUMsUUFBUSxDQUFDLElBQVQsQ0FBYyxLQUFLLENBQUMsT0FBcEIsQ0FBeEI7VUFDRSxPQUFPLENBQUMsSUFBUixDQUFhLG1DQUFBLEdBQW9DLEtBQWpELEVBREY7O2VBR0EsSUFBQyxDQUFBLGNBQWUsQ0FBQSxVQUFBLENBQWhCLEdBQThCLEdBVGhDOztJQUhrQixDQXZFcEI7SUFxRkEsZ0JBQUEsRUFBa0IsU0FBQyxNQUFELEVBQVMsT0FBVDtBQUNoQixVQUFBO01BQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxLQUFSLENBQWMsR0FBZDtBQUNQLFdBQUEsc0NBQUE7O1FBQ0UsTUFBQSxHQUFTLE1BQU8sQ0FBQSxHQUFBO1FBQ2hCLElBQWMsY0FBZDtBQUFBLGlCQUFBOztBQUZGO2FBR0E7SUFMZ0IsQ0FyRmxCOztBQTlERiIsInNvdXJjZXNDb250ZW50IjpbIkNTT04gPSByZXF1aXJlIFwic2Vhc29uXCJcbnBhdGggPSByZXF1aXJlIFwicGF0aFwiXG5cbnByZWZpeCA9IFwibWFya2Rvd24td3JpdGVyXCJcbnBhY2thZ2VQYXRoID0gYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoXCJtYXJrZG93bi13cml0ZXJcIilcbmdldENvbmZpZ0ZpbGUgPSAocGFydHMuLi4pIC0+XG4gIGlmIHBhY2thZ2VQYXRoIHRoZW4gcGF0aC5qb2luKHBhY2thZ2VQYXRoLCBcImxpYlwiLCBwYXJ0cy4uLilcbiAgZWxzZSBwYXRoLmpvaW4oX19kaXJuYW1lLCBwYXJ0cy4uLilcblxuIyBsb2FkIHNhbXBsZSBjb25maWcgdG8gZGVmYXVsdHNcbmRlZmF1bHRzID0gQ1NPTi5yZWFkRmlsZVN5bmMoZ2V0Q29uZmlnRmlsZShcImNvbmZpZy5jc29uXCIpKVxuXG4jIHN0YXRpYyBlbmdpbmUgb2YgeW91ciBibG9nLCBzZWUgYEBlbmdpbmVzYFxuZGVmYXVsdHNbXCJzaXRlRW5naW5lXCJdID0gXCJnZW5lcmFsXCJcbiMgcHJvamVjdCBzcGVjaWZpYyBjb25maWd1cmF0aW9uIGZpbGUgbmFtZVxuIyBodHRwczovL2dpdGh1Yi5jb20vemh1b2NodW4vbWQtd3JpdGVyL3dpa2kvU2V0dGluZ3MtZm9yLWluZGl2aWR1YWwtcHJvamVjdHNcbmRlZmF1bHRzW1wicHJvamVjdENvbmZpZ0ZpbGVcIl0gPSBcIl9tZHdyaXRlci5jc29uXCJcbiMgcGF0aCB0byBhIGNzb24gZmlsZSB0aGF0IHN0b3JlcyBsaW5rcyBhZGRlZCBmb3IgYXV0b21hdGljIGxpbmtpbmdcbiMgZGVmYXVsdCB0byBgbWFya2Rvd24td3JpdGVyLWxpbmtzLmNzb25gIGZpbGUgdW5kZXIgdXNlcidzIGNvbmZpZyBkaXJlY3RvcnlcbmRlZmF1bHRzW1wic2l0ZUxpbmtQYXRoXCJdID0gcGF0aC5qb2luKGF0b20uZ2V0Q29uZmlnRGlyUGF0aCgpLCBcIiN7cHJlZml4fS1saW5rcy5jc29uXCIpXG4jIGZpbGV0eXBlcyBtYXJrZG93bi13cml0ZXIgY29tbWFuZHMgYXBwbHlcbmRlZmF1bHRzW1wiZ3JhbW1hcnNcIl0gPSBbXG4gICdzb3VyY2UuZ2ZtJ1xuICAnc291cmNlLmdmbS5udmF0b20nXG4gICdzb3VyY2UubGl0Y29mZmVlJ1xuICAnc291cmNlLmFzY2lpZG9jJ1xuICAndGV4dC5tZCdcbiAgJ3RleHQucGxhaW4nXG4gICd0ZXh0LnBsYWluLm51bGwtZ3JhbW1hcidcbl1cblxuIyBmaWxldHlwZSBkZWZhdWx0c1xuZmlsZXR5cGVzID1cbiAgJ3NvdXJjZS5hc2NpaWRvYyc6IENTT04ucmVhZEZpbGVTeW5jKGdldENvbmZpZ0ZpbGUoXCJmaWxldHlwZXNcIiwgXCJhc2NpaWRvYy5jc29uXCIpKVxuXG4jIGVuZ2luZSBkZWZhdWx0c1xuZW5naW5lcyA9XG4gIGh0bWw6XG4gICAgaW1hZ2VUYWc6IFwiXCJcIlxuICAgICAgPGEgaHJlZj1cIntzaXRlfS97c2x1Z30uaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgICA8aW1nIGNsYXNzPVwiYWxpZ257YWxpZ259XCIgYWx0PVwie2FsdH1cIiBzcmM9XCJ7c3JjfVwiIHdpZHRoPVwie3dpZHRofVwiIGhlaWdodD1cIntoZWlnaHR9XCIgLz5cbiAgICAgIDwvYT5cbiAgICAgIFwiXCJcIlxuICBqZWt5bGw6XG4gICAgdGV4dFN0eWxlczpcbiAgICAgIGNvZGVibG9jazpcbiAgICAgICAgYmVmb3JlOiBcInslIGhpZ2hsaWdodCAlfVxcblwiXG4gICAgICAgIGFmdGVyOiBcIlxcbnslIGVuZGhpZ2hsaWdodCAlfVwiXG4gICAgICAgIHJlZ2V4QmVmb3JlOiBcInslIGhpZ2hsaWdodCg/OiAuKyk/ICV9XFxcXHI/XFxcXG5cIlxuICAgICAgICByZWdleEFmdGVyOiBcIlxcXFxyP1xcXFxueyUgZW5kaGlnaGxpZ2h0ICV9XCJcbiAgb2N0b3ByZXNzOlxuICAgIGltYWdlVGFnOiBcInslIGltZyB7YWxpZ259IHtzcmN9IHt3aWR0aH0ge2hlaWdodH0gJ3thbHR9JyAlfVwiXG4gIGhleG86XG4gICAgbmV3UG9zdEZpbGVOYW1lOiBcInt0aXRsZX17ZXh0ZW5zaW9ufVwiXG4gICAgZnJvbnRNYXR0ZXI6IFwiXCJcIlxuICAgICAgbGF5b3V0OiBcIntsYXlvdXR9XCJcbiAgICAgIHRpdGxlOiBcInt0aXRsZX1cIlxuICAgICAgZGF0ZTogXCJ7ZGF0ZX1cIlxuICAgICAgLS0tXG4gICAgICBcIlwiXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBwcm9qZWN0Q29uZmlnczoge31cblxuICBlbmdpbmVOYW1lczogLT4gT2JqZWN0LmtleXMoZW5naW5lcylcblxuICBrZXlQYXRoOiAoa2V5KSAtPiBcIiN7cHJlZml4fS4je2tleX1cIlxuXG4gIGdldDogKGtleSwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIGFsbG93X2JsYW5rID0gaWYgb3B0aW9uc1tcImFsbG93X2JsYW5rXCJdPyB0aGVuIG9wdGlvbnNbXCJhbGxvd19ibGFua1wiXSBlbHNlIHRydWVcblxuICAgIGZvciBjb25maWcgaW4gW1wiUHJvamVjdFwiLCBcIlVzZXJcIiwgXCJFbmdpbmVcIiwgXCJGaWxldHlwZVwiLCBcIkRlZmF1bHRcIl1cbiAgICAgIHZhbCA9IEBbXCJnZXQje2NvbmZpZ31cIl0oa2V5KVxuXG4gICAgICBpZiBhbGxvd19ibGFuayB0aGVuIHJldHVybiB2YWwgaWYgdmFsP1xuICAgICAgZWxzZSByZXR1cm4gdmFsIGlmIHZhbFxuXG4gIHNldDogKGtleSwgdmFsKSAtPlxuICAgIGF0b20uY29uZmlnLnNldChAa2V5UGF0aChrZXkpLCB2YWwpXG5cbiAgcmVzdG9yZURlZmF1bHQ6IChrZXkpIC0+XG4gICAgYXRvbS5jb25maWcudW5zZXQoQGtleVBhdGgoa2V5KSlcblxuICAjIGdldCBjb25maWcuZGVmYXVsdHNcbiAgZ2V0RGVmYXVsdDogKGtleSkgLT5cbiAgICBAX3ZhbHVlRm9yS2V5UGF0aChkZWZhdWx0cywga2V5KVxuXG4gICMgZ2V0IGNvbmZpZy5maWxldHlwZXNbZmlsZXR5cGVdIGJhc2VkIG9uIGN1cnJlbnQgZmlsZVxuICBnZXRGaWxldHlwZTogKGtleSkgLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICByZXR1cm4gdW5kZWZpbmVkIHVubGVzcyBlZGl0b3I/XG5cbiAgICBmaWxldHlwZUNvbmZpZyA9IGZpbGV0eXBlc1tlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZV1cbiAgICByZXR1cm4gdW5kZWZpbmVkIHVubGVzcyBmaWxldHlwZUNvbmZpZz9cblxuICAgIEBfdmFsdWVGb3JLZXlQYXRoKGZpbGV0eXBlQ29uZmlnLCBrZXkpXG5cbiAgIyBnZXQgY29uZmlnLmVuZ2luZXMgYmFzZWQgb24gc2l0ZUVuZ2luZSBzZXRcbiAgZ2V0RW5naW5lOiAoa2V5KSAtPlxuICAgIGVuZ2luZSA9IEBnZXRQcm9qZWN0KFwic2l0ZUVuZ2luZVwiKSB8fFxuICAgICAgICAgICAgIEBnZXRVc2VyKFwic2l0ZUVuZ2luZVwiKSB8fFxuICAgICAgICAgICAgIEBnZXREZWZhdWx0KFwic2l0ZUVuZ2luZVwiKVxuXG4gICAgZW5naW5lQ29uZmlnID0gZW5naW5lc1tlbmdpbmVdXG4gICAgcmV0dXJuIHVuZGVmaW5lZCB1bmxlc3MgZW5naW5lQ29uZmlnP1xuXG4gICAgQF92YWx1ZUZvcktleVBhdGgoZW5naW5lQ29uZmlnLCBrZXkpXG5cbiAgIyBnZXQgY29uZmlnIGJhc2VkIG9uIGVuZ2luZSBzZXQgb3IgZ2xvYmFsIGRlZmF1bHRzXG4gIGdldEN1cnJlbnREZWZhdWx0OiAoa2V5KSAtPlxuICAgIEBnZXRFbmdpbmUoa2V5KSB8fCBAZ2V0RGVmYXVsdChrZXkpXG5cbiAgIyBnZXQgY29uZmlnIGZyb20gdXNlcidzIGNvbmZpZyBmaWxlXG4gIGdldFVzZXI6IChrZXkpIC0+XG4gICAgYXRvbS5jb25maWcuZ2V0KEBrZXlQYXRoKGtleSksIHNvdXJjZXM6IFthdG9tLmNvbmZpZy5nZXRVc2VyQ29uZmlnUGF0aCgpXSlcblxuICAjIGdldCBwcm9qZWN0IHNwZWNpZmljIGNvbmZpZyBmcm9tIHByb2plY3QncyBjb25maWcgZmlsZVxuICBnZXRQcm9qZWN0OiAoa2V5KSAtPlxuICAgIGNvbmZpZ0ZpbGUgPSBAZ2V0UHJvamVjdENvbmZpZ0ZpbGUoKVxuICAgIHJldHVybiB1bmxlc3MgY29uZmlnRmlsZVxuXG4gICAgY29uZmlnID0gQF9sb2FkUHJvamVjdENvbmZpZyhjb25maWdGaWxlKVxuICAgIEBfdmFsdWVGb3JLZXlQYXRoKGNvbmZpZywga2V5KVxuXG4gIGdldFNhbXBsZUNvbmZpZ0ZpbGU6IC0+IGdldENvbmZpZ0ZpbGUoXCJjb25maWcuY3NvblwiKVxuXG4gIGdldFByb2plY3RDb25maWdGaWxlOiAtPlxuICAgIHJldHVybiBpZiAhYXRvbS5wcm9qZWN0IHx8IGF0b20ucHJvamVjdC5nZXRQYXRocygpLmxlbmd0aCA8IDFcblxuICAgIHByb2plY3RQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgICBmaWxlTmFtZSA9IEBnZXRVc2VyKFwicHJvamVjdENvbmZpZ0ZpbGVcIikgfHwgQGdldERlZmF1bHQoXCJwcm9qZWN0Q29uZmlnRmlsZVwiKVxuICAgIHBhdGguam9pbihwcm9qZWN0UGF0aCwgZmlsZU5hbWUpXG5cbiAgX2xvYWRQcm9qZWN0Q29uZmlnOiAoY29uZmlnRmlsZSkgLT5cbiAgICByZXR1cm4gQHByb2plY3RDb25maWdzW2NvbmZpZ0ZpbGVdIGlmIEBwcm9qZWN0Q29uZmlnc1tjb25maWdGaWxlXVxuXG4gICAgdHJ5XG4gICAgICAjIHdoZW4gY29uZmlnRmlsZSBpcyBlbXB0eSwgQ1NPTiByZXR1cm4gdW5kZWZpbmVkLCBmYWxsYmFjayB0byB7fVxuICAgICAgQHByb2plY3RDb25maWdzW2NvbmZpZ0ZpbGVdID0gQ1NPTi5yZWFkRmlsZVN5bmMoY29uZmlnRmlsZSkgfHwge31cbiAgICBjYXRjaCBlcnJvclxuICAgICAgIyBsb2cgZXJyb3IgbWVzc2FnZSBpbiBkZXYgbW9kZSBmb3IgZWFzaWVyIHRyb3VibGVzaG90dGluZyxcbiAgICAgICMgYnV0IGlnbm9yaW5nIGZpbGUgbm90IGV4aXN0cyBlcnJvclxuICAgICAgaWYgYXRvbS5pbkRldk1vZGUoKSAmJiAhL0VOT0VOVC8udGVzdChlcnJvci5tZXNzYWdlKVxuICAgICAgICBjb25zb2xlLmluZm8oXCJNYXJrZG93biBXcml0ZXIgW2NvbmZpZy5jb2ZmZWVdOiAje2Vycm9yfVwiKVxuXG4gICAgICBAcHJvamVjdENvbmZpZ3NbY29uZmlnRmlsZV0gPSB7fVxuXG4gIF92YWx1ZUZvcktleVBhdGg6IChvYmplY3QsIGtleVBhdGgpIC0+XG4gICAga2V5cyA9IGtleVBhdGguc3BsaXQoXCIuXCIpXG4gICAgZm9yIGtleSBpbiBrZXlzXG4gICAgICBvYmplY3QgPSBvYmplY3Rba2V5XVxuICAgICAgcmV0dXJuIHVubGVzcyBvYmplY3Q/XG4gICAgb2JqZWN0XG4iXX0=
