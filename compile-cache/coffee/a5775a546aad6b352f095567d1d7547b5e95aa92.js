(function() {
  var GrammarUtils, OperatingSystem, args, command, options, os, path, ref, windows;

  path = require('path');

  ref = GrammarUtils = require('../grammar-utils'), OperatingSystem = ref.OperatingSystem, command = ref.command;

  os = OperatingSystem.platform();

  windows = OperatingSystem.isWindows();

  options = '-Wall -include stdio.h';

  args = function(arg) {
    var filepath;
    filepath = arg.filepath;
    args = (function() {
      switch (os) {
        case 'darwin':
          return "xcrun clang " + options + " -fcolor-diagnostics '" + filepath + "' -o /tmp/c.out && /tmp/c.out";
        case 'linux':
          return "cc " + options + " '" + filepath + "' -o /tmp/c.out && /tmp/c.out";
      }
    })();
    return ['-c', args];
  };

  exports.C = {
    'File Based': {
      command: 'bash',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        args = (function() {
          switch (os) {
            case 'darwin':
              return "xcrun clang " + options + " -fcolor-diagnostics '" + filepath + "' -o /tmp/c.out && /tmp/c.out";
            case 'linux':
              return "cc " + options + " '" + filepath + "' -o /tmp/c.out && /tmp/c.out";
          }
        })();
        return ['-c', args];
      }
    },
    'Selection Based': {
      command: 'bash',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.c');
        args = (function() {
          switch (os) {
            case 'darwin':
              return "xcrun clang " + options + " -fcolor-diagnostics " + tmpFile + " -o /tmp/c.out && /tmp/c.out";
            case 'linux':
              return "cc " + options + " " + tmpFile + " -o /tmp/c.out && /tmp/c.out";
          }
        })();
        return ['-c', args];
      }
    }
  };

  exports['C#'] = {
    'Selection Based': {
      command: command,
      args: function(context) {
        var code, exe, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.cs');
        exe = tmpFile.replace(/\.cs$/, '.exe');
        if (windows) {
          return ["/c csc /out:" + exe + " " + tmpFile + " && " + exe];
        } else {
          return ['-c', "csc /out:" + exe + " " + tmpFile + " && mono " + exe];
        }
      }
    },
    'File Based': {
      command: command,
      args: function(arg) {
        var exe, filename, filepath;
        filepath = arg.filepath, filename = arg.filename;
        exe = filename.replace(/\.cs$/, '.exe');
        if (windows) {
          return ["/c csc " + filepath + " && " + exe];
        } else {
          return ['-c', "csc '" + filepath + "' && mono " + exe];
        }
      }
    }
  };

  exports['C# Script File'] = {
    'Selection Based': {
      command: 'scriptcs',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.csx');
        return ['-script', tmpFile];
      }
    },
    'File Based': {
      command: 'scriptcs',
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        return ['-script', filepath];
      }
    }
  };

  exports['C++'] = {
    'Selection Based': {
      command: 'bash',
      args: function(context) {
        var code, tmpFile;
        code = context.getCode();
        tmpFile = GrammarUtils.createTempFileWithCode(code, '.cpp');
        args = (function() {
          switch (os) {
            case 'darwin':
              return "xcrun clang++ -std=c++14 " + options + " -fcolor-diagnostics -include iostream " + tmpFile + " -o /tmp/cpp.out && /tmp/cpp.out";
            case 'linux':
              return "g++ " + options + " -std=c++14 -include iostream " + tmpFile + " -o /tmp/cpp.out && /tmp/cpp.out";
          }
        })();
        return ['-c', args];
      }
    },
    'File Based': {
      command: command,
      args: function(arg) {
        var filepath;
        filepath = arg.filepath;
        args = (function() {
          switch (os) {
            case 'darwin':
              return "xcrun clang++ -std=c++14 " + options + " -fcolor-diagnostics -include iostream '" + filepath + "' -o /tmp/cpp.out && /tmp/cpp.out";
            case 'linux':
              return "g++ -std=c++14 " + options + " -include iostream '" + filepath + "' -o /tmp/cpp.out && /tmp/cpp.out";
            case 'win32':
              if (GrammarUtils.OperatingSystem.release().split('.').slice(-1 >= '14399')) {
                filepath = path.posix.join.apply(path.posix, [].concat([filepath.split(path.win32.sep)[0].toLowerCase()], filepath.split(path.win32.sep).slice(1))).replace(':', '');
                return "g++ -std=c++14 " + options + " -include iostream /mnt/" + filepath + " -o /tmp/cpp.out && /tmp/cpp.out";
              }
          }
        })();
        return GrammarUtils.formatArgs(args);
      }
    }
  };

  exports['C++14'] = exports['C++'];

  if (os === 'darwin') {
    exports['Objective-C'] = {
      'File Based': {
        command: 'bash',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-c', "xcrun clang " + options + " -fcolor-diagnostics -framework Cocoa '" + filepath + "' -o /tmp/objc-c.out && /tmp/objc-c.out"];
        }
      }
    };
    exports['Objective-C++'] = {
      'File Based': {
        command: 'bash',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-c', "xcrun clang++ -Wc++11-extensions " + options + " -fcolor-diagnostics -include iostream -framework Cocoa '" + filepath + "' -o /tmp/objc-cpp.out && /tmp/objc-cpp.out"];
        }
      }
    };
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXJzL2MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBNkIsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUE1QyxFQUFDLHFDQUFELEVBQWtCOztFQUVsQixFQUFBLEdBQUssZUFBZSxDQUFDLFFBQWhCLENBQUE7O0VBQ0wsT0FBQSxHQUFVLGVBQWUsQ0FBQyxTQUFoQixDQUFBOztFQUVWLE9BQUEsR0FBVTs7RUFFVixJQUFBLEdBQU8sU0FBQyxHQUFEO0FBQ0wsUUFBQTtJQURPLFdBQUQ7SUFDTixJQUFBO0FBQU8sY0FBTyxFQUFQO0FBQUEsYUFDQSxRQURBO2lCQUVILGNBQUEsR0FBZSxPQUFmLEdBQXVCLHdCQUF2QixHQUErQyxRQUEvQyxHQUF3RDtBQUZyRCxhQUdBLE9BSEE7aUJBSUgsS0FBQSxHQUFNLE9BQU4sR0FBYyxJQUFkLEdBQWtCLFFBQWxCLEdBQTJCO0FBSnhCOztBQUtQLFdBQU8sQ0FBQyxJQUFELEVBQU8sSUFBUDtFQU5GOztFQVFQLE9BQU8sQ0FBQyxDQUFSLEdBQ0U7SUFBQSxZQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQVMsTUFBVDtNQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFDSixZQUFBO1FBRE0sV0FBRDtRQUNMLElBQUE7QUFBTyxrQkFBTyxFQUFQO0FBQUEsaUJBQ0EsUUFEQTtxQkFFSCxjQUFBLEdBQWUsT0FBZixHQUF1Qix3QkFBdkIsR0FBK0MsUUFBL0MsR0FBd0Q7QUFGckQsaUJBR0EsT0FIQTtxQkFJSCxLQUFBLEdBQU0sT0FBTixHQUFjLElBQWQsR0FBa0IsUUFBbEIsR0FBMkI7QUFKeEI7O0FBS1AsZUFBTyxDQUFDLElBQUQsRUFBTyxJQUFQO01BTkgsQ0FETjtLQURGO0lBVUEsaUJBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxNQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLFlBQUE7UUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtRQUNQLE9BQUEsR0FBVSxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEMsRUFBMEMsSUFBMUM7UUFDVixJQUFBO0FBQU8sa0JBQU8sRUFBUDtBQUFBLGlCQUNBLFFBREE7cUJBRUgsY0FBQSxHQUFlLE9BQWYsR0FBdUIsdUJBQXZCLEdBQThDLE9BQTlDLEdBQXNEO0FBRm5ELGlCQUdBLE9BSEE7cUJBSUgsS0FBQSxHQUFNLE9BQU4sR0FBYyxHQUFkLEdBQWlCLE9BQWpCLEdBQXlCO0FBSnRCOztBQUtQLGVBQU8sQ0FBQyxJQUFELEVBQU8sSUFBUDtNQVJILENBRE47S0FYRjs7O0VBc0JGLE9BQVEsQ0FBQSxJQUFBLENBQVIsR0FDRTtJQUFBLGlCQUFBLEVBQW1CO01BQ2pCLFNBQUEsT0FEaUI7TUFFakIsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLFlBQUE7UUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtRQUNQLE9BQUEsR0FBVSxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEMsRUFBMEMsS0FBMUM7UUFDVixHQUFBLEdBQU0sT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsT0FBaEIsRUFBeUIsTUFBekI7UUFDTixJQUFHLE9BQUg7QUFDRSxpQkFBTyxDQUFDLGNBQUEsR0FBZSxHQUFmLEdBQW1CLEdBQW5CLEdBQXNCLE9BQXRCLEdBQThCLE1BQTlCLEdBQW9DLEdBQXJDLEVBRFQ7U0FBQSxNQUFBO2lCQUVLLENBQUMsSUFBRCxFQUFPLFdBQUEsR0FBWSxHQUFaLEdBQWdCLEdBQWhCLEdBQW1CLE9BQW5CLEdBQTJCLFdBQTNCLEdBQXNDLEdBQTdDLEVBRkw7O01BSkksQ0FGVztLQUFuQjtJQVVBLFlBQUEsRUFBYztNQUNaLFNBQUEsT0FEWTtNQUVaLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFDSixZQUFBO1FBRE0seUJBQVU7UUFDaEIsR0FBQSxHQUFNLFFBQVEsQ0FBQyxPQUFULENBQWlCLE9BQWpCLEVBQTBCLE1BQTFCO1FBQ04sSUFBRyxPQUFIO0FBQ0UsaUJBQU8sQ0FBQyxTQUFBLEdBQVUsUUFBVixHQUFtQixNQUFuQixHQUF5QixHQUExQixFQURUO1NBQUEsTUFBQTtpQkFFSyxDQUFDLElBQUQsRUFBTyxPQUFBLEdBQVEsUUFBUixHQUFpQixZQUFqQixHQUE2QixHQUFwQyxFQUZMOztNQUZJLENBRk07S0FWZDs7O0VBa0JGLE9BQVEsQ0FBQSxnQkFBQSxDQUFSLEdBRUU7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLFVBQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osWUFBQTtRQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1FBQ1AsT0FBQSxHQUFVLFlBQVksQ0FBQyxzQkFBYixDQUFvQyxJQUFwQyxFQUEwQyxNQUExQztBQUNWLGVBQU8sQ0FBQyxTQUFELEVBQVksT0FBWjtNQUhILENBRE47S0FERjtJQU1BLFlBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxVQUFUO01BQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixZQUFBO1FBQWQsV0FBRDtlQUFlLENBQUMsU0FBRCxFQUFZLFFBQVo7TUFBaEIsQ0FETjtLQVBGOzs7RUFVRixPQUFRLENBQUEsS0FBQSxDQUFSLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsT0FBQSxFQUFTLE1BQVQ7TUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFEO0FBQ0osWUFBQTtRQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsT0FBUixDQUFBO1FBQ1AsT0FBQSxHQUFVLFlBQVksQ0FBQyxzQkFBYixDQUFvQyxJQUFwQyxFQUEwQyxNQUExQztRQUNWLElBQUE7QUFBTyxrQkFBTyxFQUFQO0FBQUEsaUJBQ0EsUUFEQTtxQkFFSCwyQkFBQSxHQUE0QixPQUE1QixHQUFvQyx5Q0FBcEMsR0FBNkUsT0FBN0UsR0FBcUY7QUFGbEYsaUJBR0EsT0FIQTtxQkFJSCxNQUFBLEdBQU8sT0FBUCxHQUFlLGdDQUFmLEdBQStDLE9BQS9DLEdBQXVEO0FBSnBEOztBQUtQLGVBQU8sQ0FBQyxJQUFELEVBQU8sSUFBUDtNQVJILENBRE47S0FERjtJQVlBLFlBQUEsRUFBYztNQUNaLFNBQUEsT0FEWTtNQUVaLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFDSixZQUFBO1FBRE0sV0FBRDtRQUNMLElBQUE7QUFBTyxrQkFBTyxFQUFQO0FBQUEsaUJBQ0EsUUFEQTtxQkFFSCwyQkFBQSxHQUE0QixPQUE1QixHQUFvQywwQ0FBcEMsR0FBOEUsUUFBOUUsR0FBdUY7QUFGcEYsaUJBR0EsT0FIQTtxQkFJSCxpQkFBQSxHQUFrQixPQUFsQixHQUEwQixzQkFBMUIsR0FBZ0QsUUFBaEQsR0FBeUQ7QUFKdEQsaUJBS0EsT0FMQTtjQU1ILElBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQyxPQUE3QixDQUFBLENBQXNDLENBQUMsS0FBdkMsQ0FBNkMsR0FBN0MsQ0FBaUQsQ0FBQyxLQUFsRCxDQUF3RCxDQUFDLENBQUQsSUFBTSxPQUE5RCxDQUFIO2dCQUNFLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFoQixDQUFzQixJQUFJLENBQUMsS0FBM0IsRUFBa0MsRUFBRSxDQUFDLE1BQUgsQ0FBVSxDQUFDLFFBQVEsQ0FBQyxLQUFULENBQWUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUExQixDQUErQixDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQWxDLENBQUEsQ0FBRCxDQUFWLEVBQTZELFFBQVEsQ0FBQyxLQUFULENBQWUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUExQixDQUE4QixDQUFDLEtBQS9CLENBQXFDLENBQXJDLENBQTdELENBQWxDLENBQXdJLENBQUMsT0FBekksQ0FBaUosR0FBakosRUFBc0osRUFBdEo7dUJBQ1gsaUJBQUEsR0FBa0IsT0FBbEIsR0FBMEIsMEJBQTFCLEdBQW9ELFFBQXBELEdBQTZELG1DQUYvRDs7QUFORzs7QUFTUCxlQUFPLFlBQVksQ0FBQyxVQUFiLENBQXdCLElBQXhCO01BVkgsQ0FGTTtLQVpkOzs7RUEwQkYsT0FBUSxDQUFBLE9BQUEsQ0FBUixHQUFtQixPQUFRLENBQUEsS0FBQTs7RUFFM0IsSUFBRyxFQUFBLEtBQU0sUUFBVDtJQUNFLE9BQVEsQ0FBQSxhQUFBLENBQVIsR0FDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxDQUFDLElBQUQsRUFBTyxjQUFBLEdBQWUsT0FBZixHQUF1Qix5Q0FBdkIsR0FBZ0UsUUFBaEUsR0FBeUUseUNBQWhGO1FBQWhCLENBRE47T0FERjs7SUFJRixPQUFRLENBQUEsZUFBQSxDQUFSLEdBQ0k7TUFBQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsTUFBVDtRQUNBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFBZ0IsY0FBQTtVQUFkLFdBQUQ7aUJBQWUsQ0FBQyxJQUFELEVBQU8sbUNBQUEsR0FBb0MsT0FBcEMsR0FBNEMsMkRBQTVDLEdBQXVHLFFBQXZHLEdBQWdILDZDQUF2SDtRQUFoQixDQUROO09BREY7TUFQTjs7QUFuR0EiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcbntPcGVyYXRpbmdTeXN0ZW0sIGNvbW1hbmR9ID0gR3JhbW1hclV0aWxzID0gcmVxdWlyZSAnLi4vZ3JhbW1hci11dGlscydcblxub3MgPSBPcGVyYXRpbmdTeXN0ZW0ucGxhdGZvcm0oKVxud2luZG93cyA9IE9wZXJhdGluZ1N5c3RlbS5pc1dpbmRvd3MoKVxuXG5vcHRpb25zID0gJy1XYWxsIC1pbmNsdWRlIHN0ZGlvLmgnXG5cbmFyZ3MgPSAoe2ZpbGVwYXRofSkgLT5cbiAgYXJncyA9IHN3aXRjaCBvc1xuICAgIHdoZW4gJ2RhcndpbidcbiAgICAgIFwieGNydW4gY2xhbmcgI3tvcHRpb25zfSAtZmNvbG9yLWRpYWdub3N0aWNzICcje2ZpbGVwYXRofScgLW8gL3RtcC9jLm91dCAmJiAvdG1wL2Mub3V0XCJcbiAgICB3aGVuICdsaW51eCdcbiAgICAgIFwiY2MgI3tvcHRpb25zfSAnI3tmaWxlcGF0aH0nIC1vIC90bXAvYy5vdXQgJiYgL3RtcC9jLm91dFwiXG4gIHJldHVybiBbJy1jJywgYXJnc11cblxuZXhwb3J0cy5DID1cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdiYXNoJ1xuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPlxuICAgICAgYXJncyA9IHN3aXRjaCBvc1xuICAgICAgICB3aGVuICdkYXJ3aW4nXG4gICAgICAgICAgXCJ4Y3J1biBjbGFuZyAje29wdGlvbnN9IC1mY29sb3ItZGlhZ25vc3RpY3MgJyN7ZmlsZXBhdGh9JyAtbyAvdG1wL2Mub3V0ICYmIC90bXAvYy5vdXRcIlxuICAgICAgICB3aGVuICdsaW51eCdcbiAgICAgICAgICBcImNjICN7b3B0aW9uc30gJyN7ZmlsZXBhdGh9JyAtbyAvdG1wL2Mub3V0ICYmIC90bXAvYy5vdXRcIlxuICAgICAgcmV0dXJuIFsnLWMnLCBhcmdzXVxuXG4gICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdiYXNoJ1xuICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgJy5jJylcbiAgICAgIGFyZ3MgPSBzd2l0Y2ggb3NcbiAgICAgICAgd2hlbiAnZGFyd2luJ1xuICAgICAgICAgIFwieGNydW4gY2xhbmcgI3tvcHRpb25zfSAtZmNvbG9yLWRpYWdub3N0aWNzICN7dG1wRmlsZX0gLW8gL3RtcC9jLm91dCAmJiAvdG1wL2Mub3V0XCJcbiAgICAgICAgd2hlbiAnbGludXgnXG4gICAgICAgICAgXCJjYyAje29wdGlvbnN9ICN7dG1wRmlsZX0gLW8gL3RtcC9jLm91dCAmJiAvdG1wL2Mub3V0XCJcbiAgICAgIHJldHVybiBbJy1jJywgYXJnc11cblxuZXhwb3J0c1snQyMnXSA9XG4gICdTZWxlY3Rpb24gQmFzZWQnOiB7XG4gICAgY29tbWFuZFxuICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgJy5jcycpXG4gICAgICBleGUgPSB0bXBGaWxlLnJlcGxhY2UgL1xcLmNzJC8sICcuZXhlJ1xuICAgICAgaWYgd2luZG93c1xuICAgICAgICByZXR1cm4gW1wiL2MgY3NjIC9vdXQ6I3tleGV9ICN7dG1wRmlsZX0gJiYgI3tleGV9XCJdXG4gICAgICBlbHNlIFsnLWMnLCBcImNzYyAvb3V0OiN7ZXhlfSAje3RtcEZpbGV9ICYmIG1vbm8gI3tleGV9XCJdXG4gIH1cbiAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgY29tbWFuZFxuICAgIGFyZ3M6ICh7ZmlsZXBhdGgsIGZpbGVuYW1lfSkgLT5cbiAgICAgIGV4ZSA9IGZpbGVuYW1lLnJlcGxhY2UgL1xcLmNzJC8sICcuZXhlJ1xuICAgICAgaWYgd2luZG93c1xuICAgICAgICByZXR1cm4gW1wiL2MgY3NjICN7ZmlsZXBhdGh9ICYmICN7ZXhlfVwiXVxuICAgICAgZWxzZSBbJy1jJywgXCJjc2MgJyN7ZmlsZXBhdGh9JyAmJiBtb25vICN7ZXhlfVwiXVxuICB9XG5leHBvcnRzWydDIyBTY3JpcHQgRmlsZSddID1cblxuICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICBjb21tYW5kOiAnc2NyaXB0Y3MnXG4gICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCAnLmNzeCcpXG4gICAgICByZXR1cm4gWyctc2NyaXB0JywgdG1wRmlsZV1cbiAgJ0ZpbGUgQmFzZWQnOlxuICAgIGNvbW1hbmQ6ICdzY3JpcHRjcydcbiAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctc2NyaXB0JywgZmlsZXBhdGhdXG5cbmV4cG9ydHNbJ0MrKyddID1cbiAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgY29tbWFuZDogJ2Jhc2gnXG4gICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCAnLmNwcCcpXG4gICAgICBhcmdzID0gc3dpdGNoIG9zXG4gICAgICAgIHdoZW4gJ2RhcndpbidcbiAgICAgICAgICBcInhjcnVuIGNsYW5nKysgLXN0ZD1jKysxNCAje29wdGlvbnN9IC1mY29sb3ItZGlhZ25vc3RpY3MgLWluY2x1ZGUgaW9zdHJlYW0gI3t0bXBGaWxlfSAtbyAvdG1wL2NwcC5vdXQgJiYgL3RtcC9jcHAub3V0XCJcbiAgICAgICAgd2hlbiAnbGludXgnXG4gICAgICAgICAgXCJnKysgI3tvcHRpb25zfSAtc3RkPWMrKzE0IC1pbmNsdWRlIGlvc3RyZWFtICN7dG1wRmlsZX0gLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXG4gICAgICByZXR1cm4gWyctYycsIGFyZ3NdXG5cbiAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgY29tbWFuZFxuICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPlxuICAgICAgYXJncyA9IHN3aXRjaCBvc1xuICAgICAgICB3aGVuICdkYXJ3aW4nXG4gICAgICAgICAgXCJ4Y3J1biBjbGFuZysrIC1zdGQ9YysrMTQgI3tvcHRpb25zfSAtZmNvbG9yLWRpYWdub3N0aWNzIC1pbmNsdWRlIGlvc3RyZWFtICcje2ZpbGVwYXRofScgLW8gL3RtcC9jcHAub3V0ICYmIC90bXAvY3BwLm91dFwiXG4gICAgICAgIHdoZW4gJ2xpbnV4J1xuICAgICAgICAgIFwiZysrIC1zdGQ9YysrMTQgI3tvcHRpb25zfSAtaW5jbHVkZSBpb3N0cmVhbSAnI3tmaWxlcGF0aH0nIC1vIC90bXAvY3BwLm91dCAmJiAvdG1wL2NwcC5vdXRcIlxuICAgICAgICB3aGVuICd3aW4zMidcbiAgICAgICAgICBpZiBHcmFtbWFyVXRpbHMuT3BlcmF0aW5nU3lzdGVtLnJlbGVhc2UoKS5zcGxpdCgnLicpLnNsaWNlIC0xID49ICcxNDM5OSdcbiAgICAgICAgICAgIGZpbGVwYXRoID0gcGF0aC5wb3NpeC5qb2luLmFwcGx5KHBhdGgucG9zaXgsIFtdLmNvbmNhdChbZmlsZXBhdGguc3BsaXQocGF0aC53aW4zMi5zZXApWzBdLnRvTG93ZXJDYXNlKCldLCBmaWxlcGF0aC5zcGxpdChwYXRoLndpbjMyLnNlcCkuc2xpY2UoMSkpKS5yZXBsYWNlKCc6JywgJycpXG4gICAgICAgICAgICBcImcrKyAtc3RkPWMrKzE0ICN7b3B0aW9uc30gLWluY2x1ZGUgaW9zdHJlYW0gL21udC8je2ZpbGVwYXRofSAtbyAvdG1wL2NwcC5vdXQgJiYgL3RtcC9jcHAub3V0XCJcbiAgICAgIHJldHVybiBHcmFtbWFyVXRpbHMuZm9ybWF0QXJncyhhcmdzKVxuICB9XG5leHBvcnRzWydDKysxNCddID0gZXhwb3J0c1snQysrJ11cblxuaWYgb3MgaXMgJ2RhcndpbidcbiAgZXhwb3J0c1snT2JqZWN0aXZlLUMnXSA9XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2Jhc2gnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctYycsIFwieGNydW4gY2xhbmcgI3tvcHRpb25zfSAtZmNvbG9yLWRpYWdub3N0aWNzIC1mcmFtZXdvcmsgQ29jb2EgJyN7ZmlsZXBhdGh9JyAtbyAvdG1wL29iamMtYy5vdXQgJiYgL3RtcC9vYmpjLWMub3V0XCJdXG5cbiAgZXhwb3J0c1snT2JqZWN0aXZlLUMrKyddID1cbiAgICAgICdGaWxlIEJhc2VkJzpcbiAgICAgICAgY29tbWFuZDogJ2Jhc2gnXG4gICAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1jJywgXCJ4Y3J1biBjbGFuZysrIC1XYysrMTEtZXh0ZW5zaW9ucyAje29wdGlvbnN9IC1mY29sb3ItZGlhZ25vc3RpY3MgLWluY2x1ZGUgaW9zdHJlYW0gLWZyYW1ld29yayBDb2NvYSAnI3tmaWxlcGF0aH0nIC1vIC90bXAvb2JqYy1jcHAub3V0ICYmIC90bXAvb2JqYy1jcHAub3V0XCJdXG4iXX0=
