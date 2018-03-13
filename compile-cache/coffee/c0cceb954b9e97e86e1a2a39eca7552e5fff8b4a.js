(function() {
  var bunyan, fs, logStream, path;

  bunyan = require('bunyan');

  path = require('path');

  fs = require('fs');

  logStream = fs.createWriteStream(path.join(__dirname, '..', '/debugger.log'));

  module.exports = bunyan.createLogger({
    name: 'debugger',
    stream: logStream,
    level: 'info'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9sb2dnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBQ1QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFTCxTQUFBLEdBQVksRUFBRSxDQUFDLGlCQUFILENBQXFCLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixJQUFyQixFQUEyQixlQUEzQixDQUFyQjs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUFpQixNQUFNLENBQUMsWUFBUCxDQUFvQjtJQUNuQyxJQUFBLEVBQU0sVUFENkI7SUFFbkMsTUFBQSxFQUFRLFNBRjJCO0lBR25DLEtBQUEsRUFBTyxNQUg0QjtHQUFwQjtBQU5qQiIsInNvdXJjZXNDb250ZW50IjpbImJ1bnlhbiA9IHJlcXVpcmUgJ2J1bnlhbidcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcydcblxubG9nU3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0ocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy9kZWJ1Z2dlci5sb2cnKSlcblxubW9kdWxlLmV4cG9ydHMgPSBidW55YW4uY3JlYXRlTG9nZ2VyKHtcbiAgbmFtZTogJ2RlYnVnZ2VyJyxcbiAgc3RyZWFtOiBsb2dTdHJlYW0sXG4gIGxldmVsOiAnaW5mbydcbn0pXG4iXX0=
