(function() {
  var GrammarUtils, base, ref, ref1, ref2, shell;

  shell = require('electron').shell;

  GrammarUtils = require('../grammar-utils');

  exports.DOT = {
    'Selection Based': {
      command: 'dot',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.dot');
        return ['-Tpng', tmpFile, '-o', tmpFile + '.png'];
      }
    },
    'File Based': {
      command: 'dot',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-Tpng', filepath, '-o', filepath + '.png'];
      }
    }
  };

  exports.gnuplot = {
    'File Based': {
      command: 'gnuplot',
      workingDirectory: (ref = atom.workspace.getActivePaneItem()) != null ? (ref1 = ref.buffer) != null ? (ref2 = ref1.file) != null ? typeof ref2.getParent === "function" ? typeof (base = ref2.getParent()).getPath === "function" ? base.getPath() : void 0 : void 0 : void 0 : void 0 : void 0,
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-p', filepath];
      }
    }
  };

  exports['Graphviz (DOT)'] = {
    'Selection Based': {
      command: 'dot',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.dot');
        return ['-Tpng', tmpFile, '-o', tmpFile + '.png'];
      }
    },
    'File Based': {
      command: 'dot',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-Tpng', filepath, '-o', filepath + '.png'];
      }
    }
  };

  exports.HTML = {
    'File Based': {
      command: 'echo',
      args: function(arg) {
        var filepath, uri;
        filepath = arg.filepath;
        uri = 'file://' + filepath;
        shell.openExternal(uri);
        return ['HTML file opened at:', uri];
      }
    }
  };

  exports.LaTeX = {
    'File Based': {
      command: 'latexmk',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-cd', '-quiet', '-pdf', '-pv', '-shell-escape', filepath];
      }
    }
  };

  exports['LaTeX Beamer'] = exports.LaTeX;

  exports['Pandoc Markdown'] = {
    'File Based': {
      command: 'panzer',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath, "--output='" + filepath + ".pdf'"];
      }
    }
  };

  exports.Sass = {
    'File Based': {
      command: 'sass',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return [filepath];
      }
    }
  };

  exports.SCSS = exports.Sass;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXJzL2RvYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFFBQVMsT0FBQSxDQUFRLFVBQVI7O0VBQ1YsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUjs7RUFFZixPQUFPLENBQUMsR0FBUixHQUNFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxLQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLFlBQUE7UUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtRQUNQLE9BQUEsR0FBVSxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEMsRUFBMEMsTUFBMUM7ZUFDVixDQUFDLE9BQUQsRUFBVSxPQUFWLEVBQW1CLElBQW5CLEVBQXlCLE9BQUEsR0FBVSxNQUFuQztNQUhJLENBRE47S0FERjtJQU9BLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxLQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsSUFBcEIsRUFBMEIsUUFBQSxHQUFXLE1BQXJDO01BQWhCLENBRE47S0FSRjs7O0VBV0YsT0FBTyxDQUFDLE9BQVIsR0FDRTtJQUFBLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxTQUFUO01BQ0EsZ0JBQUEsdU5BQWdGLENBQUMsc0RBRGpGO01BRUEsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsSUFBRCxFQUFPLFFBQVA7TUFBaEIsQ0FGTjtLQURGOzs7RUFLRixPQUFRLENBQUEsZ0JBQUEsQ0FBUixHQUVFO0lBQUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxLQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLFlBQUE7UUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtRQUNQLE9BQUEsR0FBVSxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEMsRUFBMEMsTUFBMUM7QUFDVixlQUFPLENBQUMsT0FBRCxFQUFVLE9BQVYsRUFBbUIsSUFBbkIsRUFBeUIsT0FBQSxHQUFVLE1BQW5DO01BSEgsQ0FETjtLQURGO0lBT0EsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLEtBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixJQUFwQixFQUEwQixRQUFBLEdBQVcsTUFBckM7TUFBaEIsQ0FETjtLQVJGOzs7RUFXRixPQUFPLENBQUMsSUFBUixHQUNFO0lBQUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE1BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQ0osWUFBQTtRQURNLFdBQUQ7UUFDTCxHQUFBLEdBQU0sU0FBQSxHQUFZO1FBQ2xCLEtBQUssQ0FBQyxZQUFOLENBQW1CLEdBQW5CO0FBQ0EsZUFBTyxDQUFDLHNCQUFELEVBQXlCLEdBQXpCO01BSEgsQ0FETjtLQURGOzs7RUFPRixPQUFPLENBQUMsS0FBUixHQUNFO0lBQUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFNBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixNQUFsQixFQUEwQixLQUExQixFQUFpQyxlQUFqQyxFQUFrRCxRQUFsRDtNQUFoQixDQUROO0tBREY7OztFQUlGLE9BQVEsQ0FBQSxjQUFBLENBQVIsR0FBMEIsT0FBTyxDQUFDOztFQUVsQyxPQUFRLENBQUEsaUJBQUEsQ0FBUixHQUNFO0lBQUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFFBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxRQUFELEVBQVcsWUFBQSxHQUFhLFFBQWIsR0FBc0IsT0FBakM7TUFBaEIsQ0FETjtLQURGOzs7RUFJRixPQUFPLENBQUMsSUFBUixHQUNFO0lBQUEsWUFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE1BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLFlBQUE7UUFBZCxXQUFEO2VBQWUsQ0FBQyxRQUFEO01BQWhCLENBRE47S0FERjs7O0VBSUYsT0FBTyxDQUFDLElBQVIsR0FBZSxPQUFPLENBQUM7QUEzRHZCIiwic291cmNlc0NvbnRlbnQiOlsie3NoZWxsfSA9IHJlcXVpcmUgJ2VsZWN0cm9uJ1xuR3JhbW1hclV0aWxzID0gcmVxdWlyZSAnLi4vZ3JhbW1hci11dGlscydcblxuZXhwb3J0cy5ET1QgPVxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnZG90J1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgJy5kb3QnKVxuICAgICAgWyctVHBuZycsIHRtcEZpbGUsICctbycsIHRtcEZpbGUgKyAnLnBuZyddXG5cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdkb3QnXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLVRwbmcnLCBmaWxlcGF0aCwgJy1vJywgZmlsZXBhdGggKyAnLnBuZyddXG5cbmV4cG9ydHMuZ251cGxvdCA9XG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnZ251cGxvdCdcbiAgICB3b3JraW5nRGlyZWN0b3J5OiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpPy5idWZmZXI/LmZpbGU/LmdldFBhcmVudD8oKS5nZXRQYXRoPygpXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLXAnLCBmaWxlcGF0aF1cblxuZXhwb3J0c1snR3JhcGh2aXogKERPVCknXSA9XG5cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2RvdCdcbiAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsICcuZG90JylcbiAgICAgIHJldHVybiBbJy1UcG5nJywgdG1wRmlsZSwgJy1vJywgdG1wRmlsZSArICcucG5nJ11cblxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2RvdCdcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctVHBuZycsIGZpbGVwYXRoLCAnLW8nLCBmaWxlcGF0aCArICcucG5nJ11cblxuZXhwb3J0cy5IVE1MID1cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdlY2hvJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPlxuICAgICAgdXJpID0gJ2ZpbGU6Ly8nICsgZmlsZXBhdGhcbiAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCh1cmkpXG4gICAgICByZXR1cm4gWydIVE1MIGZpbGUgb3BlbmVkIGF0OicsIHVyaV1cblxuZXhwb3J0cy5MYVRlWCA9XG4gICdGaWxlIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnbGF0ZXhtaydcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctY2QnLCAnLXF1aWV0JywgJy1wZGYnLCAnLXB2JywgJy1zaGVsbC1lc2NhcGUnLCBmaWxlcGF0aF1cblxuZXhwb3J0c1snTGFUZVggQmVhbWVyJ10gPSBleHBvcnRzLkxhVGVYXG5cbmV4cG9ydHNbJ1BhbmRvYyBNYXJrZG93biddID1cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdwYW56ZXInXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aCwgXCItLW91dHB1dD0nI3tmaWxlcGF0aH0ucGRmJ1wiXVxuXG5leHBvcnRzLlNhc3MgPVxuICAnRmlsZSBCYXNlZCc6XG4gICAgY29tbWFuZDogJ3Nhc3MnXG4gICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuZXhwb3J0cy5TQ1NTID0gZXhwb3J0cy5TYXNzXG4iXX0=
