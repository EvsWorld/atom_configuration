(function() {
  var Q, SymbolGenView, fs, path, spawn, swapFile;

  path = require('path');

  fs = require('fs');

  Q = require('q');

  spawn = require('child_process').spawn;

  swapFile = '.tags_swap';

  module.exports = SymbolGenView = (function() {
    SymbolGenView.prototype.isActive = false;

    function SymbolGenView(serializeState) {
      atom.commands.add('atom-workspace', "symbol-gen:generate", (function(_this) {
        return function() {
          return _this.generate();
        };
      })(this));
      atom.commands.add('atom-workspace', "symbol-gen:purge", (function(_this) {
        return function() {
          return _this.purge();
        };
      })(this));
      this.activate_for_projects((function(_this) {
        return function(activate) {
          if (!activate) {
            return;
          }
          _this.isActive = true;
          return _this.watch_for_changes();
        };
      })(this));
    }

    SymbolGenView.prototype.serialize = function() {};

    SymbolGenView.prototype.destroy = function() {};

    SymbolGenView.prototype.tagfilePath = function() {
      return atom.config.get('symbol-gen.tagFile');
    };

    SymbolGenView.prototype.consumeStatusBar = function(statusBar) {
      var element;
      this.statusBar = statusBar;
      element = document.createElement('div');
      element.classList.add('inline-block');
      element.textContent = 'Generating symbols';
      element.style.display = 'none';
      return this.statusBarTile = this.statusBar.addRightTile({
        item: element,
        priority: 100
      });
    };

    SymbolGenView.prototype.watch_for_changes = function() {
      atom.commands.add('atom-workspace', 'core:save', (function(_this) {
        return function() {
          return _this.check_for_on_save();
        };
      })(this));
      atom.commands.add('atom-workspace', 'core:save-as', (function(_this) {
        return function() {
          return _this.check_for_on_save();
        };
      })(this));
      return atom.commands.add('atom-workspace', 'window:save-all', (function(_this) {
        return function() {
          return _this.check_for_on_save();
        };
      })(this));
    };

    SymbolGenView.prototype.check_for_on_save = function() {
      var editor, onDidSave;
      if (!this.isActive) {
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        return onDidSave = editor.onDidSave((function(_this) {
          return function() {
            _this.generate();
            return onDidSave.dispose();
          };
        })(this));
      }
    };

    SymbolGenView.prototype.activate_for_projects = function(callback) {
      var projectPaths, shouldActivate;
      projectPaths = atom.project.getPaths();
      shouldActivate = projectPaths.some((function(_this) {
        return function(projectPath) {
          var tagsFilePath;
          tagsFilePath = path.resolve(projectPath, _this.tagfilePath());
          try {
            fs.accessSync(tagsFilePath);
            return true;
          } catch (error) {}
        };
      })(this));
      return callback(shouldActivate);
    };

    SymbolGenView.prototype.purge_for_project = function(projectPath) {
      var swapFilePath, tagsFilePath;
      swapFilePath = path.resolve(projectPath, swapFile);
      tagsFilePath = path.resolve(projectPath, this.tagfilePath());
      fs.unlink(tagsFilePath, function() {});
      return fs.unlink(swapFilePath, function() {});
    };

    SymbolGenView.prototype.generate_for_project = function(deferred, projectPath) {
      var args, command, ctags, defaultCtagsFile, excludes, swapFilePath, tagsFilePath;
      swapFilePath = path.resolve(projectPath, swapFile);
      tagsFilePath = path.resolve(projectPath, this.tagfilePath());
      command = path.resolve(__dirname, '..', 'vendor', "ctags-" + process.platform);
      defaultCtagsFile = require.resolve('./.ctags');
      excludes = this.get_ctags_excludes(projectPath);
      args = ["--options=" + defaultCtagsFile, '-R', "-f" + swapFilePath].concat(excludes);
      ctags = spawn(command, args, {
        cwd: projectPath
      });
      ctags.stderr.on('data', function(data) {
        return console.error('symbol-gen:', 'ctag:stderr ' + data);
      });
      return ctags.on('close', (function(_this) {
        return function(data) {
          return fs.rename(swapFilePath, tagsFilePath, function(err) {
            if (err) {
              console.warn('symbol-gen:', 'Error swapping file: ', err);
            }
            return deferred.resolve();
          });
        };
      })(this));
    };

    SymbolGenView.prototype.get_ctags_excludes = function(projectPath) {
      var ignoredNames;
      ignoredNames = atom.config.get("core.ignoredNames");
      if (atom.config.get("core.excludeVcsIgnoredPaths")) {
        ignoredNames = ignoredNames.concat(this.get_vcs_excludes(projectPath));
      }
      return ignoredNames.map((function(_this) {
        return function(glob) {
          return "--exclude=" + glob;
        };
      })(this));
    };

    SymbolGenView.prototype.get_vcs_excludes = function(projectPath) {
      var gitIgnorePath;
      gitIgnorePath = path.resolve(projectPath, '.gitignore');
      return require('ignored')(gitIgnorePath);
    };

    SymbolGenView.prototype.purge = function() {
      var projectPaths;
      projectPaths = atom.project.getPaths();
      projectPaths.forEach((function(_this) {
        return function(path) {
          return _this.purge_for_project(path);
        };
      })(this));
      return this.isActive = false;
    };

    SymbolGenView.prototype.generate = function() {
      var isGenerating, projectPaths, promises, showStatus;
      if (!this.isActive) {
        this.isActive = true;
        this.watch_for_changes();
      }
      isGenerating = true;
      showStatus = (function(_this) {
        return function() {
          var ref;
          if (!isGenerating) {
            return;
          }
          return (ref = _this.statusBarTile) != null ? ref.getItem().style.display = 'inline-block' : void 0;
        };
      })(this);
      setTimeout(showStatus, 300);
      promises = [];
      projectPaths = atom.project.getPaths();
      projectPaths.forEach((function(_this) {
        return function(path) {
          var p;
          p = Q.defer();
          _this.generate_for_project(p, path);
          return promises.push(p.promise);
        };
      })(this));
      return Q.all(promises).then((function(_this) {
        return function() {
          var ref;
          if ((ref = _this.statusBarTile) != null) {
            ref.getItem().style.display = 'none';
          }
          return isGenerating = false;
        };
      })(this));
    };

    return SymbolGenView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zeW1ib2wtZ2VuL2xpYi9zeW1ib2wtZ2VuLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLENBQUEsR0FBSSxPQUFBLENBQVEsR0FBUjs7RUFDSixLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQzs7RUFFakMsUUFBQSxHQUFXOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ007NEJBRUosUUFBQSxHQUFVOztJQUVHLHVCQUFDLGNBQUQ7TUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLHFCQUFwQyxFQUEyRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzRDtNQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msa0JBQXBDLEVBQXdELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsS0FBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhEO01BQ0EsSUFBQyxDQUFBLHFCQUFELENBQXVCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxRQUFEO1VBQ3JCLElBQUEsQ0FBYyxRQUFkO0FBQUEsbUJBQUE7O1VBQ0EsS0FBQyxDQUFBLFFBQUQsR0FBWTtpQkFDWixLQUFDLENBQUEsaUJBQUQsQ0FBQTtRQUhxQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkI7SUFIVzs7NEJBU2IsU0FBQSxHQUFXLFNBQUEsR0FBQTs7NEJBR1gsT0FBQSxHQUFT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LFVBQUEsR0FBYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDWCxjQUFBO1VBQUEsSUFBQSxDQUFjLFlBQWQ7QUFBQSxtQkFBQTs7MERBQ2MsQ0FBRSxPQUFoQixDQUFBLENBQXlCLENBQUMsS0FBSyxDQUFDLE9BQWhDLEdBQTBDO1FBRi9CO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQUdiLFVBQUEsQ0FBVyxVQUFYLEVBQXVCLEdBQXZCO01BRUEsUUFBQSxHQUFXO01BQ1gsWUFBQSxHQUFlLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBO01BQ2YsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7QUFDbkIsY0FBQTtVQUFBLENBQUEsR0FBSSxDQUFDLENBQUMsS0FBRixDQUFBO1VBQ0osS0FBQyxDQUFBLG9CQUFELENBQXNCLENBQXRCLEVBQXlCLElBQXpCO2lCQUNBLFFBQVEsQ0FBQyxJQUFULENBQWMsQ0FBQyxDQUFDLE9BQWhCO1FBSG1CO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQjthQUtBLENBQUMsQ0FBQyxHQUFGLENBQU0sUUFBTixDQUFlLENBQUMsSUFBaEIsQ0FBcUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBRW5CLGNBQUE7O2VBQWMsQ0FBRSxPQUFoQixDQUFBLENBQXlCLENBQUMsS0FBSyxDQUFDLE9BQWhDLEdBQTBDOztpQkFDMUMsWUFBQSxHQUFlO1FBSEk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCO0lBbkJROzs7OztBQTlGWiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlKCdwYXRoJylcbmZzID0gcmVxdWlyZSgnZnMnKVxuUSA9IHJlcXVpcmUoJ3EnKVxuc3Bhd24gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuc3Bhd25cblxuc3dhcEZpbGUgPSAnLnRhZ3Nfc3dhcCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU3ltYm9sR2VuVmlld1xuXG4gIGlzQWN0aXZlOiBmYWxzZVxuXG4gIGNvbnN0cnVjdG9yOiAoc2VyaWFsaXplU3RhdGUpIC0+XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgXCJzeW1ib2wtZ2VuOmdlbmVyYXRlXCIsID0+IEBnZW5lcmF0ZSgpXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgXCJzeW1ib2wtZ2VuOnB1cmdlXCIsID0+IEBwdXJnZSgpXG4gICAgQGFjdGl2YXRlX2Zvcl9wcm9qZWN0cyAoYWN0aXZhdGUpID0+XG4gICAgICByZXR1cm4gdW5sZXNzIGFjdGl2YXRlXG4gICAgICBAaXNBY3RpdmUgPSB0cnVlXG4gICAgICBAd2F0Y2hfZm9yX2NoYW5nZXMoKVxuXG4gICMgUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgcmV0cmlldmVkIHdoZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWRcbiAgc2VyaWFsaXplOiAtPlxuXG4gICMgVGVhciBkb3duIGFueSBzdGF0ZSBhbmQgZGV0YWNoXG4gIGRlc3Ryb3k6IC0+XG5cbiAgdGFnZmlsZVBhdGg6IC0+XG4gICAgYXRvbS5jb25maWcuZ2V0KCdzeW1ib2wtZ2VuLnRhZ0ZpbGUnKVxuXG4gIGNvbnN1bWVTdGF0dXNCYXI6IChAc3RhdHVzQmFyKSAtPlxuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpbmxpbmUtYmxvY2snKVxuICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSAnR2VuZXJhdGluZyBzeW1ib2xzJ1xuICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIEBzdGF0dXNCYXJUaWxlID0gQHN0YXR1c0Jhci5hZGRSaWdodFRpbGUoaXRlbTogZWxlbWVudCwgcHJpb3JpdHk6IDEwMClcblxuICB3YXRjaF9mb3JfY2hhbmdlczogLT5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnY29yZTpzYXZlJywgPT4gQGNoZWNrX2Zvcl9vbl9zYXZlKClcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnY29yZTpzYXZlLWFzJywgPT4gQGNoZWNrX2Zvcl9vbl9zYXZlKClcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnd2luZG93OnNhdmUtYWxsJywgPT4gQGNoZWNrX2Zvcl9vbl9zYXZlKClcblxuICBjaGVja19mb3Jfb25fc2F2ZTogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBpc0FjdGl2ZVxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmIChlZGl0b3IpXG4gICAgICBvbkRpZFNhdmUgPVxuICAgICAgICBlZGl0b3Iub25EaWRTYXZlID0+XG4gICAgICAgICAgQGdlbmVyYXRlKClcbiAgICAgICAgICBvbkRpZFNhdmUuZGlzcG9zZSgpXG5cbiAgYWN0aXZhdGVfZm9yX3Byb2plY3RzOiAoY2FsbGJhY2spIC0+XG4gICAgcHJvamVjdFBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICBzaG91bGRBY3RpdmF0ZSA9IHByb2plY3RQYXRocy5zb21lIChwcm9qZWN0UGF0aCkgPT5cbiAgICAgIHRhZ3NGaWxlUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9qZWN0UGF0aCwgQHRhZ2ZpbGVQYXRoKCkpXG4gICAgICB0cnkgZnMuYWNjZXNzU3luYyB0YWdzRmlsZVBhdGg7IHJldHVybiB0cnVlXG4gICAgY2FsbGJhY2sgc2hvdWxkQWN0aXZhdGVcblxuICBwdXJnZV9mb3JfcHJvamVjdDogKHByb2plY3RQYXRoKSAtPlxuICAgIHN3YXBGaWxlUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9qZWN0UGF0aCwgc3dhcEZpbGUpXG4gICAgdGFnc0ZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHByb2plY3RQYXRoLCBAdGFnZmlsZVBhdGgoKSlcbiAgICBmcy51bmxpbmsgdGFnc0ZpbGVQYXRoLCAtPiAjIG5vLW9wXG4gICAgZnMudW5saW5rIHN3YXBGaWxlUGF0aCwgLT4gIyBuby1vcFxuXG4gIGdlbmVyYXRlX2Zvcl9wcm9qZWN0OiAoZGVmZXJyZWQsIHByb2plY3RQYXRoKSAtPlxuICAgIHN3YXBGaWxlUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9qZWN0UGF0aCwgc3dhcEZpbGUpXG4gICAgdGFnc0ZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKHByb2plY3RQYXRoLCBAdGFnZmlsZVBhdGgoKSlcbiAgICBjb21tYW5kID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJ3ZlbmRvcicsIFwiY3RhZ3MtI3twcm9jZXNzLnBsYXRmb3JtfVwiKVxuICAgIGRlZmF1bHRDdGFnc0ZpbGUgPSByZXF1aXJlLnJlc29sdmUoJy4vLmN0YWdzJylcbiAgICBleGNsdWRlcyA9IEBnZXRfY3RhZ3NfZXhjbHVkZXMocHJvamVjdFBhdGgpXG4gICAgYXJncyA9IFtcIi0tb3B0aW9ucz0je2RlZmF1bHRDdGFnc0ZpbGV9XCIsICctUicsIFwiLWYje3N3YXBGaWxlUGF0aH1cIl0uY29uY2F0IGV4Y2x1ZGVzXG4gICAgY3RhZ3MgPSBzcGF3bihjb21tYW5kLCBhcmdzLCB7Y3dkOiBwcm9qZWN0UGF0aH0pXG5cbiAgICBjdGFncy5zdGRlcnIub24gJ2RhdGEnLCAoZGF0YSkgLT4gY29uc29sZS5lcnJvcignc3ltYm9sLWdlbjonLCAnY3RhZzpzdGRlcnIgJyArIGRhdGEpXG4gICAgY3RhZ3Mub24gJ2Nsb3NlJywgKGRhdGEpID0+XG4gICAgICBmcy5yZW5hbWUgc3dhcEZpbGVQYXRoLCB0YWdzRmlsZVBhdGgsIChlcnIpID0+XG4gICAgICAgIGlmIGVyciB0aGVuIGNvbnNvbGUud2Fybignc3ltYm9sLWdlbjonLCAnRXJyb3Igc3dhcHBpbmcgZmlsZTogJywgZXJyKVxuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKClcblxuICBnZXRfY3RhZ3NfZXhjbHVkZXM6IChwcm9qZWN0UGF0aCkgLT5cbiAgICBpZ25vcmVkTmFtZXMgPSBhdG9tLmNvbmZpZy5nZXQoXCJjb3JlLmlnbm9yZWROYW1lc1wiKVxuICAgIGlmIGF0b20uY29uZmlnLmdldChcImNvcmUuZXhjbHVkZVZjc0lnbm9yZWRQYXRoc1wiKVxuICAgICAgaWdub3JlZE5hbWVzID0gaWdub3JlZE5hbWVzLmNvbmNhdCBAZ2V0X3Zjc19leGNsdWRlcyhwcm9qZWN0UGF0aClcbiAgICBpZ25vcmVkTmFtZXMubWFwIChnbG9iKSA9PiBcIi0tZXhjbHVkZT0je2dsb2J9XCJcblxuICBnZXRfdmNzX2V4Y2x1ZGVzOiAocHJvamVjdFBhdGgpIC0+XG4gICAgZ2l0SWdub3JlUGF0aCA9IHBhdGgucmVzb2x2ZShwcm9qZWN0UGF0aCwgJy5naXRpZ25vcmUnKVxuICAgIHJlcXVpcmUoJ2lnbm9yZWQnKShnaXRJZ25vcmVQYXRoKVxuXG4gIHB1cmdlOiAtPlxuICAgIHByb2plY3RQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpXG4gICAgcHJvamVjdFBhdGhzLmZvckVhY2ggKHBhdGgpID0+XG4gICAgICBAcHVyZ2VfZm9yX3Byb2plY3QocGF0aClcbiAgICBAaXNBY3RpdmUgPSBmYWxzZVxuXG4gIGdlbmVyYXRlOiAoKSAtPlxuICAgIGlmIG5vdCBAaXNBY3RpdmVcbiAgICAgIEBpc0FjdGl2ZSA9IHRydWVcbiAgICAgIEB3YXRjaF9mb3JfY2hhbmdlcygpXG5cbiAgICBpc0dlbmVyYXRpbmcgPSB0cnVlXG4gICAgIyBzaG93IHN0YXR1cyBiYXIgdGlsZSBpZiBpdCB0YWtlcyBhIHdoaWxlIHRvIGdlbmVyYXRlIHRhZ3NcbiAgICBzaG93U3RhdHVzID0gPT5cbiAgICAgIHJldHVybiB1bmxlc3MgaXNHZW5lcmF0aW5nXG4gICAgICBAc3RhdHVzQmFyVGlsZT8uZ2V0SXRlbSgpLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xuICAgIHNldFRpbWVvdXQgc2hvd1N0YXR1cywgMzAwXG5cbiAgICBwcm9taXNlcyA9IFtdXG4gICAgcHJvamVjdFBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICBwcm9qZWN0UGF0aHMuZm9yRWFjaCAocGF0aCkgPT5cbiAgICAgIHAgPSBRLmRlZmVyKClcbiAgICAgIEBnZW5lcmF0ZV9mb3JfcHJvamVjdChwLCBwYXRoKVxuICAgICAgcHJvbWlzZXMucHVzaChwLnByb21pc2UpXG5cbiAgICBRLmFsbChwcm9taXNlcykudGhlbiA9PlxuICAgICAgIyBoaWRlIHN0YXR1cyBiYXIgdGlsZVxuICAgICAgQHN0YXR1c0JhclRpbGU/LmdldEl0ZW0oKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICBpc0dlbmVyYXRpbmcgPSBmYWxzZVxuIl19
