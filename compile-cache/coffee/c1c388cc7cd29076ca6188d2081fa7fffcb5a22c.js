(function() {
  exports.Python = {
    'Selection Based': {
      command: 'python',
      args: function(context) {
        return ['-u', '-c', context.getCode()];
      }
    },
    'File Based': {
      command: 'python',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-u', filepath];
      }
    }
  };

  exports.MagicPython = exports.Python;

  exports.Sage = {
    'Selection Based': {
      command: 'sage',
      args: function(context) {
        return ['-c', context.getCode()];
      }
    },
    'File Based': {
      command: 'sage',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXJzL3B5dGhvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxPQUFPLENBQUMsTUFBUixHQUNFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxRQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtlQUFhLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxPQUFPLENBQUMsT0FBUixDQUFBLENBQWI7TUFBYixDQUROO0tBREY7SUFJQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsUUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsWUFBQTtRQUFkLFdBQUQ7ZUFBZSxDQUFDLElBQUQsRUFBTyxRQUFQO01BQWhCLENBRE47S0FMRjs7O0VBUUYsT0FBTyxDQUFDLFdBQVIsR0FBc0IsT0FBTyxDQUFDOztFQUU5QixPQUFPLENBQUMsSUFBUixHQUNFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxNQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtlQUFhLENBQUMsSUFBRCxFQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUDtNQUFiLENBRE47S0FERjtJQUlBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxNQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsUUFBRDtNQUFoQixDQUROO0tBTEY7O0FBWkYiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnRzLlB5dGhvbiA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdweXRob24nXG4gICAgYXJnczogKGNvbnRleHQpIC0+IFsnLXUnLCAnLWMnLCBjb250ZXh0LmdldENvZGUoKV1cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3B5dGhvbidcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctdScsIGZpbGVwYXRoXVxuXG5leHBvcnRzLk1hZ2ljUHl0aG9uID0gZXhwb3J0cy5QeXRob25cblxuZXhwb3J0cy5TYWdlID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3NhZ2UnXG4gICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWMnLCBjb250ZXh0LmdldENvZGUoKV1cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3NhZ2UnXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cbiJdfQ==
