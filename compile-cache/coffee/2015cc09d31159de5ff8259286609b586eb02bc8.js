(function() {
  var GrammarUtils, args, babel, bin, coffee, command, path;

  path = require('path');

  command = (GrammarUtils = require('../grammar-utils')).command;

  bin = path.join(__dirname, '../..', 'node_modules', '.bin');

  coffee = path.join(bin, 'coffee');

  babel = path.join(bin, 'babel');

  args = function(arg) {
    var cmd, filepath;
    filepath = arg.filepath;
    cmd = "'" + coffee + "' -p '" + filepath + "'|'" + babel + "' --filename '" + bin + "'| node";
    return GrammarUtils.formatArgs(cmd);
  };

  exports.CoffeeScript = {
    'Selection Based': {
      command: command,
      args: function(context) {
        var code, filepath, lit, ref, scopeName;
        scopeName = (ref = atom.workspace.getActiveTextEditor()) != null ? ref.getGrammar().scopeName : void 0;
        lit = (scopeName != null ? scopeName.includes('lit') : void 0) ? 'lit' : '';
        code = context.getCode();
        filepath = GrammarUtils.createTempFileWithCode(code, "." + lit + "coffee");
        return args({
          filepath: filepath
        });
      }
    },
    'File Based': {
      command: command,
      args: args
    }
  };

  exports['CoffeeScript (Literate)'] = exports.CoffeeScript;

  exports.IcedCoffeeScript = {
    'Selection Based': {
      command: 'iced',
      args: function(context) {
        return ['-e', context.getCode()];
      }
    },
    'File Based': {
      command: 'iced',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXJzL2NvZmZlZXNjcmlwdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDTixVQUFXLENBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUFmOztFQUVaLEdBQUEsR0FBTSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsT0FBckIsRUFBOEIsY0FBOUIsRUFBOEMsTUFBOUM7O0VBQ04sTUFBQSxHQUFTLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixFQUFlLFFBQWY7O0VBQ1QsS0FBQSxHQUFRLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixFQUFlLE9BQWY7O0VBRVIsSUFBQSxHQUFPLFNBQUMsR0FBRDtBQUNMLFFBQUE7SUFETyxXQUFEO0lBQ04sR0FBQSxHQUFNLEdBQUEsR0FBSSxNQUFKLEdBQVcsUUFBWCxHQUFtQixRQUFuQixHQUE0QixLQUE1QixHQUFpQyxLQUFqQyxHQUF1QyxnQkFBdkMsR0FBdUQsR0FBdkQsR0FBMkQ7QUFDakUsV0FBTyxZQUFZLENBQUMsVUFBYixDQUF3QixHQUF4QjtFQUZGOztFQUlQLE9BQU8sQ0FBQyxZQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUFtQjtNQUNqQixTQUFBLE9BRGlCO01BRWpCLElBQUEsRUFBTSxTQUFDLE9BQUQ7QUFDSixZQUFBO1FBQUMsc0VBQWlELENBQUUsVUFBdEMsQ0FBQTtRQUNkLEdBQUEsd0JBQVMsU0FBUyxDQUFFLFFBQVgsQ0FBb0IsS0FBcEIsV0FBSCxHQUFrQyxLQUFsQyxHQUE2QztRQUNuRCxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtRQUNQLFFBQUEsR0FBVyxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEMsRUFBMEMsR0FBQSxHQUFJLEdBQUosR0FBUSxRQUFsRDtBQUNYLGVBQU8sSUFBQSxDQUFLO1VBQUMsVUFBQSxRQUFEO1NBQUw7TUFMSCxDQUZXO0tBQW5CO0lBU0EsWUFBQSxFQUFjO01BQUUsU0FBQSxPQUFGO01BQVcsTUFBQSxJQUFYO0tBVGQ7OztFQVdGLE9BQVEsQ0FBQSx5QkFBQSxDQUFSLEdBQXFDLE9BQU8sQ0FBQzs7RUFFN0MsT0FBTyxDQUFDLGdCQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE1BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO2VBQWEsQ0FBQyxJQUFELEVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQO01BQWIsQ0FETjtLQURGO0lBSUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE1BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxRQUFEO01BQWhCLENBRE47S0FMRjs7QUExQkYiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcbntjb21tYW5kfSA9IEdyYW1tYXJVdGlscyA9IHJlcXVpcmUgJy4uL2dyYW1tYXItdXRpbHMnXG5cbmJpbiA9IHBhdGguam9pbiBfX2Rpcm5hbWUsICcuLi8uLicsICdub2RlX21vZHVsZXMnLCAnLmJpbidcbmNvZmZlZSA9IHBhdGguam9pbiBiaW4sICdjb2ZmZWUnXG5iYWJlbCA9IHBhdGguam9pbiBiaW4sICdiYWJlbCdcblxuYXJncyA9ICh7ZmlsZXBhdGh9KSAtPlxuICBjbWQgPSBcIicje2NvZmZlZX0nIC1wICcje2ZpbGVwYXRofSd8JyN7YmFiZWx9JyAtLWZpbGVuYW1lICcje2Jpbn0nfCBub2RlXCJcbiAgcmV0dXJuIEdyYW1tYXJVdGlscy5mb3JtYXRBcmdzKGNtZClcblxuZXhwb3J0cy5Db2ZmZWVTY3JpcHQgPVxuICAnU2VsZWN0aW9uIEJhc2VkJzoge1xuICAgIGNvbW1hbmRcbiAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgIHtzY29wZU5hbWV9ID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRHcmFtbWFyKClcbiAgICAgIGxpdCA9IGlmIHNjb3BlTmFtZT8uaW5jbHVkZXMgJ2xpdCcgdGhlbiAnbGl0JyBlbHNlICcnXG4gICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgIGZpbGVwYXRoID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgXCIuI3tsaXR9Y29mZmVlXCIpXG4gICAgICByZXR1cm4gYXJncyh7ZmlsZXBhdGh9KVxuICB9XG4gICdGaWxlIEJhc2VkJzogeyBjb21tYW5kLCBhcmdzIH1cblxuZXhwb3J0c1snQ29mZmVlU2NyaXB0IChMaXRlcmF0ZSknXSA9IGV4cG9ydHMuQ29mZmVlU2NyaXB0XG5cbmV4cG9ydHMuSWNlZENvZmZlZVNjcmlwdCA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdpY2VkJ1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdpY2VkJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG4iXX0=
