(function() {
  var GrammarUtils;

  GrammarUtils = require('../grammar-utils');

  exports.AutoHotKey = {
    'Selection Based': {
      command: 'AutoHotKey',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code);
        return [tmpFile];
      }
    },
    'File Based': {
      command: 'AutoHotKey',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports.Batch = {
    'File Based': {
      command: 'cmd.exe',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['/q', '/c', filepath];
      }
    }
  };

  exports['Batch File'] = exports.Batch;

  exports.PowerShell = {
    'Selection Based': {
      command: 'powershell',
      args: function(context) {
        return [context.getCode()];
      }
    },
    'File Based': {
      command: 'powershell',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath.replace(/\ /g, '` ')];
      }
    }
  };

  exports.VBScript = {
    'Selection Based': {
      command: 'cscript',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.vbs');
        return ['//NOLOGO', tmpFile];
      }
    },
    'File Based': {
      command: 'cscript',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['//NOLOGO', filepath];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXJzL3dpbmRvd3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSOztFQUlmLE9BQU8sQ0FBQyxVQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFlBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osWUFBQTtRQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1FBQ1AsT0FBQSxHQUFVLFlBQVksQ0FBQyxzQkFBYixDQUFvQyxJQUFwQztBQUNWLGVBQU8sQ0FBQyxPQUFEO01BSEgsQ0FETjtLQURGO0lBT0EsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFlBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxRQUFEO01BQWhCLENBRE47S0FSRjs7O0VBV0YsT0FBTyxDQUFDLEtBQVIsR0FDRTtJQUFBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxTQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxRQUFiO01BQWhCLENBRE47S0FERjs7O0VBSUYsT0FBUSxDQUFBLFlBQUEsQ0FBUixHQUF3QixPQUFPLENBQUM7O0VBRWhDLE9BQU8sQ0FBQyxVQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFlBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2VBQWEsQ0FBQyxPQUFPLENBQUMsT0FBUixDQUFBLENBQUQ7TUFBYixDQUROO0tBREY7SUFJQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsWUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLFFBQVEsQ0FBQyxPQUFULENBQWlCLEtBQWpCLEVBQXdCLElBQXhCLENBQUQ7TUFBaEIsQ0FETjtLQUxGOzs7RUFRRixPQUFPLENBQUMsUUFBUixHQUNFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxTQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLFlBQUE7UUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtRQUNQLE9BQUEsR0FBVSxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEMsRUFBMEMsTUFBMUM7QUFDVixlQUFPLENBQUMsVUFBRCxFQUFhLE9BQWI7TUFISCxDQUROO0tBREY7SUFPQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsU0FBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLFVBQUQsRUFBYSxRQUFiO01BQWhCLENBRE47S0FSRjs7QUFqQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJHcmFtbWFyVXRpbHMgPSByZXF1aXJlICcuLi9ncmFtbWFyLXV0aWxzJ1xuXG4jaWYgR3JhbW1hclV0aWxzLk9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKVxuXG5leHBvcnRzLkF1dG9Ib3RLZXkgPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnQXV0b0hvdEtleSdcbiAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICByZXR1cm4gW3RtcEZpbGVdXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdBdXRvSG90S2V5J1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbmV4cG9ydHMuQmF0Y2ggPVxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2NtZC5leGUnXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnL3EnLCAnL2MnLCBmaWxlcGF0aF1cblxuZXhwb3J0c1snQmF0Y2ggRmlsZSddID0gZXhwb3J0cy5CYXRjaFxuXG5leHBvcnRzLlBvd2VyU2hlbGwgPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAncG93ZXJzaGVsbCdcbiAgICBhcmdzOiAoY29udGV4dCkgLT4gW2NvbnRleHQuZ2V0Q29kZSgpXVxuXG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAncG93ZXJzaGVsbCdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoLnJlcGxhY2UgL1xcIC9nLCAnYCAnXVxuXG5leHBvcnRzLlZCU2NyaXB0ID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2NzY3JpcHQnXG4gICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCAnLnZicycpXG4gICAgICByZXR1cm4gWycvL05PTE9HTycsIHRtcEZpbGVdXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdjc2NyaXB0J1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy8vTk9MT0dPJywgZmlsZXBhdGhdXG4iXX0=
