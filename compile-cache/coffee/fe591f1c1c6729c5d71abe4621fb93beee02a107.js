(function() {
  var GrammarUtils, command, windows;

  command = (GrammarUtils = require('../grammar-utils')).command;

  windows = GrammarUtils.OperatingSystem.isWindows();

  module.exports = {
    BuckleScript: {
      'Selection Based': {
        command: 'bsc',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-c', tmpFile];
        }
      },
      'File Based': {
        command: 'bsc',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-c', filepath];
        }
      }
    },
    OCaml: {
      'File Based': {
        command: 'ocaml',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Reason: {
      'File Based': {
        command: command,
        args: function(arg) {
          var file, filename;
          filename = arg.filename;
          file = filename.replace(/\.re$/, '.native');
          return GrammarUtils.formatArgs("rebuild '" + file + "' && '" + file + "'");
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXJzL21sLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsVUFBVyxDQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FBZjs7RUFFWixPQUFBLEdBQVUsWUFBWSxDQUFDLGVBQWUsQ0FBQyxTQUE3QixDQUFBOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxZQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLEtBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osY0FBQTtVQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1VBQ1AsT0FBQSxHQUFVLFlBQVksQ0FBQyxzQkFBYixDQUFvQyxJQUFwQztBQUNWLGlCQUFPLENBQUMsSUFBRCxFQUFPLE9BQVA7UUFISCxDQUROO09BREY7TUFPQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsS0FBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxJQUFELEVBQU8sUUFBUDtRQUFoQixDQUROO09BUkY7S0FERjtJQVlBLEtBQUEsRUFDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLFFBQUQ7UUFBaEIsQ0FETjtPQURGO0tBYkY7SUFpQkEsTUFBQSxFQUNFO01BQUEsWUFBQSxFQUFjO1FBQ1osU0FBQSxPQURZO1FBRVosSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUNKLGNBQUE7VUFETSxXQUFEO1VBQ0wsSUFBQSxHQUFPLFFBQVEsQ0FBQyxPQUFULENBQWlCLE9BQWpCLEVBQTBCLFNBQTFCO2lCQUNQLFlBQVksQ0FBQyxVQUFiLENBQXdCLFdBQUEsR0FBWSxJQUFaLEdBQWlCLFFBQWpCLEdBQXlCLElBQXpCLEdBQThCLEdBQXREO1FBRkksQ0FGTTtPQUFkO0tBbEJGOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsie2NvbW1hbmR9ID0gR3JhbW1hclV0aWxzID0gcmVxdWlyZSAnLi4vZ3JhbW1hci11dGlscydcblxud2luZG93cyA9IEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0uaXNXaW5kb3dzKClcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIEJ1Y2tsZVNjcmlwdDpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdic2MnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICByZXR1cm4gWyctYycsIHRtcEZpbGVdXG5cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnYnNjJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLWMnLCBmaWxlcGF0aF1cblxuICBPQ2FtbDpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnb2NhbWwnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIFJlYXNvbjpcbiAgICAnRmlsZSBCYXNlZCc6IHtcbiAgICAgIGNvbW1hbmRcbiAgICAgIGFyZ3M6ICh7ZmlsZW5hbWV9KSAtPlxuICAgICAgICBmaWxlID0gZmlsZW5hbWUucmVwbGFjZSAvXFwucmUkLywgJy5uYXRpdmUnXG4gICAgICAgIEdyYW1tYXJVdGlscy5mb3JtYXRBcmdzKFwicmVidWlsZCAnI3tmaWxlfScgJiYgJyN7ZmlsZX0nXCIpXG4gICAgfVxuIl19
