(function() {
  var GrammarUtils, command, path;

  path = require('path');

  command = (GrammarUtils = require('../grammar-utils')).command;

  exports['Fortran - Fixed Form'] = {
    'File Based': {
      command: command,
      args: function(arg) {
        var cmd, filepath;
        filepath = arg.filepath;
        cmd = "gfortran '" + filepath + "' -ffixed-form -o /tmp/f.out && /tmp/f.out";
        return GrammarUtils.formatArgs(cmd);
      }
    }
  };

  exports['Fortran - Free Form'] = {
    'File Based': {
      command: command,
      args: function(arg) {
        var cmd, filepath;
        filepath = arg.filepath;
        cmd = "gfortran '" + filepath + "' -ffree-form -o /tmp/f90.out && /tmp/f90.out";
        return GrammarUtils.formatArgs(cmd);
      }
    }
  };

  exports['Fortran - Modern'] = exports['Fortran - Free Form'];

  exports['Fortran - Punchcard'] = exports['Fortran - Fixed Form'];

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXJzL2ZvcnRyYW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sVUFBVyxDQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FBZjs7RUFFWixPQUFRLENBQUEsc0JBQUEsQ0FBUixHQUNFO0lBQUEsWUFBQSxFQUFjO01BQ1osU0FBQSxPQURZO01BRVosSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUNKLFlBQUE7UUFETSxXQUFEO1FBQ0wsR0FBQSxHQUFNLFlBQUEsR0FBYSxRQUFiLEdBQXNCO0FBQzVCLGVBQU8sWUFBWSxDQUFDLFVBQWIsQ0FBd0IsR0FBeEI7TUFGSCxDQUZNO0tBQWQ7OztFQU1GLE9BQVEsQ0FBQSxxQkFBQSxDQUFSLEdBQ0U7SUFBQSxZQUFBLEVBQWM7TUFDWixTQUFBLE9BRFk7TUFFWixJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQ0osWUFBQTtRQURNLFdBQUQ7UUFDTCxHQUFBLEdBQU0sWUFBQSxHQUFhLFFBQWIsR0FBc0I7QUFDNUIsZUFBTyxZQUFZLENBQUMsVUFBYixDQUF3QixHQUF4QjtNQUZILENBRk07S0FBZDs7O0VBTUYsT0FBUSxDQUFBLGtCQUFBLENBQVIsR0FBOEIsT0FBUSxDQUFBLHFCQUFBOztFQUN0QyxPQUFRLENBQUEscUJBQUEsQ0FBUixHQUFpQyxPQUFRLENBQUEsc0JBQUE7QUFsQnpDIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57Y29tbWFuZH0gPSBHcmFtbWFyVXRpbHMgPSByZXF1aXJlICcuLi9ncmFtbWFyLXV0aWxzJ1xuXG5leHBvcnRzWydGb3J0cmFuIC0gRml4ZWQgRm9ybSddID1cbiAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgY29tbWFuZFxuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPlxuICAgICAgY21kID0gXCJnZm9ydHJhbiAnI3tmaWxlcGF0aH0nIC1mZml4ZWQtZm9ybSAtbyAvdG1wL2Yub3V0ICYmIC90bXAvZi5vdXRcIlxuICAgICAgcmV0dXJuIEdyYW1tYXJVdGlscy5mb3JtYXRBcmdzKGNtZClcbiAgfVxuZXhwb3J0c1snRm9ydHJhbiAtIEZyZWUgRm9ybSddID1cbiAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgY29tbWFuZFxuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPlxuICAgICAgY21kID0gXCJnZm9ydHJhbiAnI3tmaWxlcGF0aH0nIC1mZnJlZS1mb3JtIC1vIC90bXAvZjkwLm91dCAmJiAvdG1wL2Y5MC5vdXRcIlxuICAgICAgcmV0dXJuIEdyYW1tYXJVdGlscy5mb3JtYXRBcmdzKGNtZClcbiAgfVxuZXhwb3J0c1snRm9ydHJhbiAtIE1vZGVybiddID0gZXhwb3J0c1snRm9ydHJhbiAtIEZyZWUgRm9ybSddXG5leHBvcnRzWydGb3J0cmFuIC0gUHVuY2hjYXJkJ10gPSBleHBvcnRzWydGb3J0cmFuIC0gRml4ZWQgRm9ybSddXG4iXX0=
