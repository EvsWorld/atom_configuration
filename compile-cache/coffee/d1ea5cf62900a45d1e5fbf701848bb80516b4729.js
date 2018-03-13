(function() {
  "use strict";
  var Beautifier, ESLintFixer, Path, allowUnsafeNewFunction,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  Path = require('path');

  allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction;

  module.exports = ESLintFixer = (function(superClass) {
    extend(ESLintFixer, superClass);

    function ESLintFixer() {
      return ESLintFixer.__super__.constructor.apply(this, arguments);
    }

    ESLintFixer.prototype.name = "ESLint Fixer";

    ESLintFixer.prototype.link = "https://github.com/eslint/eslint";

    ESLintFixer.prototype.options = {
      JavaScript: false
    };

    ESLintFixer.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var editor, filePath, projectPath, result;
        editor = atom.workspace.getActiveTextEditor();
        filePath = editor.getPath();
        projectPath = atom.project.relativizePath(filePath)[0];
        result = null;
        return allowUnsafeNewFunction(function() {
          var CLIEngine, cli, err, importPath;
          importPath = Path.join(projectPath, 'node_modules', 'eslint');
          try {
            CLIEngine = require(importPath).CLIEngine;
            cli = new CLIEngine({
              fix: true,
              cwd: projectPath
            });
            result = cli.executeOnText(text).results[0];
            return resolve(result.output);
          } catch (error) {
            err = error;
            return reject(err);
          }
        });
      });
    };

    return ESLintFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9lc2xpbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUE7OztFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04seUJBQTBCLE9BQUEsQ0FBUSxVQUFSOztFQUUzQixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OzswQkFDckIsSUFBQSxHQUFNOzswQkFDTixJQUFBLEdBQU07OzBCQUVOLE9BQUEsR0FBUztNQUNQLFVBQUEsRUFBWSxLQURMOzs7MEJBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLFlBQUE7UUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1FBQ1QsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUE7UUFDWCxXQUFBLEdBQWMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFFBQTVCLENBQXNDLENBQUEsQ0FBQTtRQUVwRCxNQUFBLEdBQVM7ZUFDVCxzQkFBQSxDQUF1QixTQUFBO0FBQ3JCLGNBQUE7VUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFWLEVBQXVCLGNBQXZCLEVBQXVDLFFBQXZDO0FBQ2I7WUFDRSxTQUFBLEdBQVksT0FBQSxDQUFRLFVBQVIsQ0FBbUIsQ0FBQztZQUVoQyxHQUFBLEdBQVUsSUFBQSxTQUFBLENBQVU7Y0FBQSxHQUFBLEVBQUssSUFBTDtjQUFXLEdBQUEsRUFBSyxXQUFoQjthQUFWO1lBQ1YsTUFBQSxHQUFTLEdBQUcsQ0FBQyxhQUFKLENBQWtCLElBQWxCLENBQXVCLENBQUMsT0FBUSxDQUFBLENBQUE7bUJBRXpDLE9BQUEsQ0FBUSxNQUFNLENBQUMsTUFBZixFQU5GO1dBQUEsYUFBQTtZQU9NO21CQUNKLE1BQUEsQ0FBTyxHQUFQLEVBUkY7O1FBRnFCLENBQXZCO01BTmtCLENBQVQ7SUFESDs7OztLQVIrQjtBQU4zQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5cbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxue2FsbG93VW5zYWZlTmV3RnVuY3Rpb259ID0gcmVxdWlyZSAnbG9vcGhvbGUnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRVNMaW50Rml4ZXIgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiRVNMaW50IEZpeGVyXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vZXNsaW50L2VzbGludFwiXG5cbiAgb3B0aW9uczoge1xuICAgIEphdmFTY3JpcHQ6IGZhbHNlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF1cblxuICAgICAgcmVzdWx0ID0gbnVsbFxuICAgICAgYWxsb3dVbnNhZmVOZXdGdW5jdGlvbiAtPlxuICAgICAgICBpbXBvcnRQYXRoID0gUGF0aC5qb2luKHByb2plY3RQYXRoLCAnbm9kZV9tb2R1bGVzJywgJ2VzbGludCcpXG4gICAgICAgIHRyeVxuICAgICAgICAgIENMSUVuZ2luZSA9IHJlcXVpcmUoaW1wb3J0UGF0aCkuQ0xJRW5naW5lXG5cbiAgICAgICAgICBjbGkgPSBuZXcgQ0xJRW5naW5lKGZpeDogdHJ1ZSwgY3dkOiBwcm9qZWN0UGF0aClcbiAgICAgICAgICByZXN1bHQgPSBjbGkuZXhlY3V0ZU9uVGV4dCh0ZXh0KS5yZXN1bHRzWzBdXG5cbiAgICAgICAgICByZXNvbHZlIHJlc3VsdC5vdXRwdXRcbiAgICAgICAgY2F0Y2ggZXJyXG4gICAgICAgICAgcmVqZWN0KGVycilcbiAgICApXG4iXX0=
