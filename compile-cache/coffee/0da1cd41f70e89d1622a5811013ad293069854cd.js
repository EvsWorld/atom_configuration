(function() {
  var args, coffee, execSync;

  execSync = require('child_process').execSync;

  args = ['-e'];

  try {
    coffee = execSync('coffee -h');
    if (coffee.toString().match(/--cli/)) {
      args.push('--cli');
    }
  } catch (_error) {}

  exports.args = args;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvY29mZmVlLXNjcmlwdC1jb21waWxlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLE1BQUEsc0JBQUE7O0FBQUEsRUFBQyxXQUFZLE9BQUEsQ0FBUSxlQUFSLEVBQVosUUFBRCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLENBQUMsSUFBRCxDQUZQLENBQUE7O0FBR0E7QUFDRSxJQUFBLE1BQUEsR0FBUyxRQUFBLENBQVMsV0FBVCxDQUFULENBQUE7QUFDQSxJQUFBLElBQUcsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQUFpQixDQUFDLEtBQWxCLENBQXdCLE9BQXhCLENBQUg7QUFDRSxNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixDQUFBLENBREY7S0FGRjtHQUFBLGtCQUhBOztBQUFBLEVBUUEsT0FBTyxDQUFDLElBQVIsR0FBZSxJQVJmLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/grammar-utils/coffee-script-compiler.coffee
