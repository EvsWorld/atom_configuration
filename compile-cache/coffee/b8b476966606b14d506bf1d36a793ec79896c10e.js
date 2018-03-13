(function() {
  var ScriptOptions, _;

  _ = require('underscore');

  module.exports = ScriptOptions = (function() {
    function ScriptOptions() {}

    ScriptOptions.prototype.name = '';

    ScriptOptions.prototype.description = '';

    ScriptOptions.prototype.lang = '';

    ScriptOptions.prototype.workingDirectory = null;

    ScriptOptions.prototype.cmd = null;

    ScriptOptions.prototype.cmdArgs = [];

    ScriptOptions.prototype.env = null;

    ScriptOptions.prototype.scriptArgs = [];

    ScriptOptions.createFromOptions = function(name, options) {
      var key, so, value;
      so = new ScriptOptions;
      so.name = name;
      for (key in options) {
        value = options[key];
        so[key] = value;
      }
      return so;
    };

    ScriptOptions.prototype.toObject = function() {
      return {
        name: this.name,
        description: this.description,
        lang: this.lang,
        workingDirectory: this.workingDirectory,
        cmd: this.cmd,
        cmdArgs: this.cmdArgs,
        env: this.env,
        scriptArgs: this.scriptArgs
      };
    };

    ScriptOptions.prototype.getEnv = function() {
      var key, mapping, pair, value, _i, _len, _ref, _ref1;
      if ((this.env == null) || this.env === '') {
        return {};
      }
      mapping = {};
      _ref = this.env.trim().split(';');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pair = _ref[_i];
        _ref1 = pair.split('=', 2), key = _ref1[0], value = _ref1[1];
        mapping[key] = ("" + value).replace(/"((?:[^"\\]|\\"|\\[^"])+)"/, '$1');
        mapping[key] = mapping[key].replace(/'((?:[^'\\]|\\'|\\[^'])+)'/, '$1');
      }
      return mapping;
    };

    ScriptOptions.prototype.mergedEnv = function(otherEnv) {
      var key, mergedEnv, otherCopy, value;
      otherCopy = _.extend({}, otherEnv);
      mergedEnv = _.extend(otherCopy, this.getEnv());
      for (key in mergedEnv) {
        value = mergedEnv[key];
        mergedEnv[key] = ("" + value).replace(/"((?:[^"\\]|\\"|\\[^"])+)"/, '$1');
        mergedEnv[key] = mergedEnv[key].replace(/'((?:[^'\\]|\\'|\\[^'])+)'/, '$1');
      }
      return mergedEnv;
    };

    return ScriptOptions;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC1vcHRpb25zLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQUFKLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNOytCQUNKOztBQUFBLDRCQUFBLElBQUEsR0FBTSxFQUFOLENBQUE7O0FBQUEsNEJBQ0EsV0FBQSxHQUFhLEVBRGIsQ0FBQTs7QUFBQSw0QkFFQSxJQUFBLEdBQU0sRUFGTixDQUFBOztBQUFBLDRCQUdBLGdCQUFBLEdBQWtCLElBSGxCLENBQUE7O0FBQUEsNEJBSUEsR0FBQSxHQUFLLElBSkwsQ0FBQTs7QUFBQSw0QkFLQSxPQUFBLEdBQVMsRUFMVCxDQUFBOztBQUFBLDRCQU1BLEdBQUEsR0FBSyxJQU5MLENBQUE7O0FBQUEsNEJBT0EsVUFBQSxHQUFZLEVBUFosQ0FBQTs7QUFBQSxJQVNBLGFBQUMsQ0FBQSxpQkFBRCxHQUFvQixTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7QUFDbEIsVUFBQSxjQUFBO0FBQUEsTUFBQSxFQUFBLEdBQUssR0FBQSxDQUFBLGFBQUwsQ0FBQTtBQUFBLE1BQ0EsRUFBRSxDQUFDLElBQUgsR0FBVSxJQURWLENBQUE7QUFFQSxXQUFBLGNBQUE7NkJBQUE7QUFBQSxRQUFBLEVBQUcsQ0FBQSxHQUFBLENBQUgsR0FBVSxLQUFWLENBQUE7QUFBQSxPQUZBO2FBR0EsR0FKa0I7SUFBQSxDQVRwQixDQUFBOztBQUFBLDRCQWVBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxJQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsSUFBQyxDQUFBLFdBRGQ7QUFBQSxRQUVBLElBQUEsRUFBTSxJQUFDLENBQUEsSUFGUDtBQUFBLFFBR0EsZ0JBQUEsRUFBa0IsSUFBQyxDQUFBLGdCQUhuQjtBQUFBLFFBSUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxHQUpOO0FBQUEsUUFLQSxPQUFBLEVBQVMsSUFBQyxDQUFBLE9BTFY7QUFBQSxRQU1BLEdBQUEsRUFBSyxJQUFDLENBQUEsR0FOTjtBQUFBLFFBT0EsVUFBQSxFQUFZLElBQUMsQ0FBQSxVQVBiO1FBRFE7SUFBQSxDQWZWLENBQUE7O0FBQUEsNEJBNkJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLGdEQUFBO0FBQUEsTUFBQSxJQUFpQixrQkFBSixJQUFhLElBQUMsQ0FBQSxHQUFELEtBQVEsRUFBbEM7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsRUFGVixDQUFBO0FBSUE7QUFBQSxXQUFBLDJDQUFBO3dCQUFBO0FBQ0UsUUFBQSxRQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxFQUFnQixDQUFoQixDQUFmLEVBQUMsY0FBRCxFQUFNLGdCQUFOLENBQUE7QUFBQSxRQUNBLE9BQVEsQ0FBQSxHQUFBLENBQVIsR0FBZSxDQUFBLEVBQUEsR0FBRyxLQUFILENBQVUsQ0FBQyxPQUFYLENBQW1CLDRCQUFuQixFQUFpRCxJQUFqRCxDQURmLENBQUE7QUFBQSxRQUVBLE9BQVEsQ0FBQSxHQUFBLENBQVIsR0FBZSxPQUFRLENBQUEsR0FBQSxDQUFJLENBQUMsT0FBYixDQUFxQiw0QkFBckIsRUFBbUQsSUFBbkQsQ0FGZixDQURGO0FBQUEsT0FKQTthQVVBLFFBWE07SUFBQSxDQTdCUixDQUFBOztBQUFBLDRCQStDQSxTQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7QUFDVCxVQUFBLGdDQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxFQUFULEVBQWEsUUFBYixDQUFaLENBQUE7QUFBQSxNQUNBLFNBQUEsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLFNBQVQsRUFBb0IsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFwQixDQURaLENBQUE7QUFHQSxXQUFBLGdCQUFBOytCQUFBO0FBQ0UsUUFBQSxTQUFVLENBQUEsR0FBQSxDQUFWLEdBQWlCLENBQUEsRUFBQSxHQUFHLEtBQUgsQ0FBVSxDQUFDLE9BQVgsQ0FBbUIsNEJBQW5CLEVBQWlELElBQWpELENBQWpCLENBQUE7QUFBQSxRQUNBLFNBQVUsQ0FBQSxHQUFBLENBQVYsR0FBaUIsU0FBVSxDQUFBLEdBQUEsQ0FBSSxDQUFDLE9BQWYsQ0FBdUIsNEJBQXZCLEVBQXFELElBQXJELENBRGpCLENBREY7QUFBQSxPQUhBO2FBT0EsVUFSUztJQUFBLENBL0NYLENBQUE7O3lCQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/script-options.coffee
