(function() {
  var message;

  message = "SQL requires setting 'Script: Run Options' directly. See https://github.com/rgbkrk/atom-script/tree/master/examples/hello.sql for further information.";

  module.exports = {
    'mongoDB (JavaScript)': {
      'Selection Based': {
        command: 'mongo',
        args: function(context) {
          return ['--eval', context.getCode()];
        }
      },
      'File Based': {
        command: 'mongo',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    SQL: {
      'Selection Based': {
        command: 'echo',
        args: function() {
          return [message];
        }
      },
      'File Based': {
        command: 'echo',
        args: function() {
          return [message];
        }
      }
    },
    'SQL (PostgreSQL)': {
      'Selection Based': {
        command: 'psql',
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      'File Based': {
        command: 'psql',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-f', filepath];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXJzL2RhdGFiYXNlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxHQUFVOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxzQkFBQSxFQUVFO01BQUEsaUJBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLFFBQUQsRUFBVyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVg7UUFBYixDQUROO09BREY7TUFJQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVUsT0FBVjtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxRQUFEO1FBQWhCLENBRE47T0FMRjtLQUZGO0lBVUEsR0FBQSxFQUNFO01BQUEsaUJBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUE7aUJBQUcsQ0FBQyxPQUFEO1FBQUgsQ0FETjtPQURGO01BSUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLE1BQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQTtpQkFBRyxDQUFDLE9BQUQ7UUFBSCxDQUROO09BTEY7S0FYRjtJQW1CQSxrQkFBQSxFQUVFO01BQUEsaUJBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtpQkFBYSxDQUFDLElBQUQsRUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVA7UUFBYixDQUROO09BREY7TUFJQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsTUFBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxJQUFELEVBQU8sUUFBUDtRQUFoQixDQUROO09BTEY7S0FyQkY7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJtZXNzYWdlID0gXCJTUUwgcmVxdWlyZXMgc2V0dGluZyAnU2NyaXB0OiBSdW4gT3B0aW9ucycgZGlyZWN0bHkuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vcmdia3JrL2F0b20tc2NyaXB0L3RyZWUvbWFzdGVyL2V4YW1wbGVzL2hlbGxvLnNxbCBmb3IgZnVydGhlciBpbmZvcm1hdGlvbi5cIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgJ21vbmdvREIgKEphdmFTY3JpcHQpJzpcblxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ21vbmdvJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLS1ldmFsJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAgJ21vbmdvJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBTUUw6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnZWNobydcbiAgICAgIGFyZ3M6IC0+IFttZXNzYWdlXVxuXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2VjaG8nXG4gICAgICBhcmdzOiAtPiBbbWVzc2FnZV1cblxuICAnU1FMIChQb3N0Z3JlU1FMKSc6XG5cbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdwc3FsJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWMnLCBjb250ZXh0LmdldENvZGUoKV1cblxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdwc3FsJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLWYnLCBmaWxlcGF0aF1cbiJdfQ==
