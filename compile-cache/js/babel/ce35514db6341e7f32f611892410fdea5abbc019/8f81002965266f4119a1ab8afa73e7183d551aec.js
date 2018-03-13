'use babel';

// TODO: in /lib/service.js

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  count: 0,

  findTodoItems: function findTodoItems() {
    var flags, notIgnoredPaths, options, pattern, regex, results;
    results = [];

    function iterator(result) {
      result.relativePath = atom.project.relativizePath(result.filePath)[1];
      return results.push(result);
    }

    // TODO: find multiline comments
    // like this one.

    /*
    * TODO: find comments like
    * these too
    */

    // TODO: update results as the documents change, debounce for performance
    pattern = atom.config.get('todo.a_pattern');
    flags = atom.config.get('todo.b_flags');
    regex = new RegExp(pattern, flags);
    notIgnoredPaths = atom.config.get('todo.c_ignorePaths').map(function (path) {
      return '!' + path;
    });

    options = {
      // TODO: make this clearer
      paths: notIgnoredPaths.length ? notIgnoredPaths : ['*'],
      // TODO: restore this after working with slow searches
      // paths: [
      //   '*',
      //   'node_modules/',
      // ],
      onPathsSearched: function onPathsSearched(count) {
        return atom.emitter.emit('todo:pathSearched', count);
      }
    };

    return new Promise(function (resolve) {
      return atom.workspace.scan(regex, options, iterator).then(function () {
        return results.sort(function (a, b) {
          return a.filePath.localeCompare(b.filePath);
        });
      }).then(resolve);
    });
  },

  getTreeFormat: function getTreeFormat(results) {
    var tree = {
      path: '/',
      nodes: []
    };

    results.map(function (result) {
      // figure out which node this goes in based off relativePath
      var relativePath = result.relativePath;

      var parts = relativePath.split('/');
      var currentNode = tree;

      var _loop = function () {
        var part = parts.shift();

        var nextNode = currentNode.nodes.find(function (node) {
          return node.path === part;
        });
        if (!nextNode) {
          nextNode = {
            path: part,
            text: part,
            icon: parts.length ? 'icon-file-directory' : 'icon-file-text',
            nodes: []
          };

          currentNode.nodes.push(nextNode);
        }

        if (!parts.length) {
          // This is the end.  Add matches as nodes.
          // console.log(nextNode);
          nextNode.nodes = nextNode.nodes.concat(result.matches.map(function (match, i) {
            return {
              path: i + '',
              text: match.matchText,
              nodes: [],
              data: {
                filePath: result.filePath,
                range: match.range
              }
            };
          }));
        }

        currentNode = nextNode;
      };

      while (parts.length) {
        _loop();
      }
    });

    return tree;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7cUJBSUc7QUFDYixPQUFLLEVBQUUsQ0FBQzs7QUFFUixlQUFhLEVBQUEseUJBQUc7QUFDZCxRQUFJLEtBQUssRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDO0FBQzdELFdBQU8sR0FBRyxFQUFFLENBQUM7O0FBRWIsYUFBUyxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQ3hCLFlBQU0sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RFLGFBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM3Qjs7Ozs7Ozs7Ozs7QUFXRCxXQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM1QyxTQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDeEMsU0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuQyxtQkFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVMsSUFBSSxFQUFFO0FBQ3pFLGFBQU8sR0FBRyxHQUFHLElBQUksQ0FBQztLQUNuQixDQUFDLENBQUM7O0FBRUgsV0FBTyxHQUFHOztBQUVSLFdBQUssRUFBRSxlQUFlLENBQUMsTUFBTSxHQUFHLGVBQWUsR0FBRyxDQUFDLEdBQUcsQ0FBQzs7Ozs7O0FBTXZELHFCQUFlLEVBQUUseUJBQVUsS0FBSyxFQUFFO0FBQ2hDLGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDdEQ7S0FDRixDQUFDOztBQUVGLFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDNUIsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUNuRCxJQUFJLENBQUMsWUFBTTtBQUNWLGVBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDakMsaUJBQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzdDLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FDRCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDaEIsQ0FBQyxDQUFDO0dBQ0o7O0FBRUQsZUFBYSxFQUFBLHVCQUFDLE9BQU8sRUFBRTtBQUNyQixRQUFNLElBQUksR0FBRztBQUNYLFVBQUksRUFBRSxHQUFHO0FBQ1QsV0FBSyxFQUFFLEVBQUU7S0FDVixDQUFDOztBQUVGLFdBQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxNQUFNLEVBQUk7O1VBRWIsWUFBWSxHQUFJLE1BQU0sQ0FBdEIsWUFBWTs7QUFDbkIsVUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QyxVQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7OztBQUdyQixZQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRTNCLFlBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtpQkFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUk7U0FBQSxDQUFDLENBQUM7QUFDbEUsWUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGtCQUFRLEdBQUc7QUFDVCxnQkFBSSxFQUFFLElBQUk7QUFDVixnQkFBSSxFQUFFLElBQUk7QUFDVixnQkFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQ2QscUJBQXFCLEdBQ3JCLGdCQUFnQjtBQUNwQixpQkFBSyxFQUFFLEVBQUU7V0FDVixDQUFDOztBQUVGLHFCQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNsQzs7QUFFRCxZQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTs7O0FBR2pCLGtCQUFRLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxDQUFDLEVBQUs7QUFDL0IsbUJBQU87QUFDTCxrQkFBSSxFQUFFLENBQUMsR0FBRyxFQUFFO0FBQ1osa0JBQUksRUFBRSxLQUFLLENBQUMsU0FBUztBQUNyQixtQkFBSyxFQUFFLEVBQUU7QUFDVCxrQkFBSSxFQUFFO0FBQ0osd0JBQVEsRUFBRSxNQUFNLENBQUMsUUFBUTtBQUN6QixxQkFBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO2VBQ25CO2FBQ0YsQ0FBQztXQUNILENBQUMsQ0FDSCxDQUFDO1NBQ0g7O0FBRUQsbUJBQVcsR0FBRyxRQUFRLENBQUM7OztBQW5DekIsYUFBTyxLQUFLLENBQUMsTUFBTSxFQUFFOztPQW9DcEI7S0FDRixDQUFDLENBQUM7O0FBRUgsV0FBTyxJQUFJLENBQUM7R0FDYjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBUT0RPOiBpbiAvbGliL3NlcnZpY2UuanNcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb3VudDogMCxcblxuICBmaW5kVG9kb0l0ZW1zKCkge1xuICAgIHZhciBmbGFncywgbm90SWdub3JlZFBhdGhzLCBvcHRpb25zLCBwYXR0ZXJuLCByZWdleCwgcmVzdWx0cztcbiAgICByZXN1bHRzID0gW107XG5cbiAgICBmdW5jdGlvbiBpdGVyYXRvcihyZXN1bHQpIHtcbiAgICAgIHJlc3VsdC5yZWxhdGl2ZVBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgocmVzdWx0LmZpbGVQYXRoKVsxXTtcbiAgICAgIHJldHVybiByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBmaW5kIG11bHRpbGluZSBjb21tZW50c1xuICAgIC8vIGxpa2UgdGhpcyBvbmUuXG5cbiAgICAvKlxuICAgICogVE9ETzogZmluZCBjb21tZW50cyBsaWtlXG4gICAgKiB0aGVzZSB0b29cbiAgICAqL1xuXG4gICAgLy8gVE9ETzogdXBkYXRlIHJlc3VsdHMgYXMgdGhlIGRvY3VtZW50cyBjaGFuZ2UsIGRlYm91bmNlIGZvciBwZXJmb3JtYW5jZVxuICAgIHBhdHRlcm4gPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8uYV9wYXR0ZXJuJyk7XG4gICAgZmxhZ3MgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8uYl9mbGFncycpO1xuICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChwYXR0ZXJuLCBmbGFncyk7XG4gICAgbm90SWdub3JlZFBhdGhzID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLmNfaWdub3JlUGF0aHMnKS5tYXAoZnVuY3Rpb24ocGF0aCkge1xuICAgICAgcmV0dXJuICchJyArIHBhdGg7XG4gICAgfSk7XG5cbiAgICBvcHRpb25zID0ge1xuICAgICAgLy8gVE9ETzogbWFrZSB0aGlzIGNsZWFyZXJcbiAgICAgIHBhdGhzOiBub3RJZ25vcmVkUGF0aHMubGVuZ3RoID8gbm90SWdub3JlZFBhdGhzIDogWycqJ10sXG4gICAgICAvLyBUT0RPOiByZXN0b3JlIHRoaXMgYWZ0ZXIgd29ya2luZyB3aXRoIHNsb3cgc2VhcmNoZXNcbiAgICAgIC8vIHBhdGhzOiBbXG4gICAgICAvLyAgICcqJyxcbiAgICAgIC8vICAgJ25vZGVfbW9kdWxlcy8nLFxuICAgICAgLy8gXSxcbiAgICAgIG9uUGF0aHNTZWFyY2hlZDogZnVuY3Rpb24gKGNvdW50KSB7XG4gICAgICAgIHJldHVybiBhdG9tLmVtaXR0ZXIuZW1pdCgndG9kbzpwYXRoU2VhcmNoZWQnLCBjb3VudCk7XG4gICAgICB9LFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uuc2NhbihyZWdleCwgb3B0aW9ucywgaXRlcmF0b3IpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiByZXN1bHRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgIHJldHVybiBhLmZpbGVQYXRoLmxvY2FsZUNvbXBhcmUoYi5maWxlUGF0aCk7XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICAgIC50aGVuKHJlc29sdmUpO1xuICAgIH0pO1xuICB9LFxuXG4gIGdldFRyZWVGb3JtYXQocmVzdWx0cykge1xuICAgIGNvbnN0IHRyZWUgPSB7XG4gICAgICBwYXRoOiAnLycsXG4gICAgICBub2RlczogW10sXG4gICAgfTtcblxuICAgIHJlc3VsdHMubWFwKHJlc3VsdCA9PiB7XG4gICAgICAvLyBmaWd1cmUgb3V0IHdoaWNoIG5vZGUgdGhpcyBnb2VzIGluIGJhc2VkIG9mZiByZWxhdGl2ZVBhdGhcbiAgICAgIGNvbnN0IHtyZWxhdGl2ZVBhdGh9ID0gcmVzdWx0O1xuICAgICAgY29uc3QgcGFydHMgPSByZWxhdGl2ZVBhdGguc3BsaXQoJy8nKTtcbiAgICAgIGxldCBjdXJyZW50Tm9kZSA9IHRyZWU7XG5cbiAgICAgIHdoaWxlIChwYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgcGFydCA9IHBhcnRzLnNoaWZ0KCk7XG5cbiAgICAgICAgbGV0IG5leHROb2RlID0gY3VycmVudE5vZGUubm9kZXMuZmluZChub2RlID0+IG5vZGUucGF0aCA9PT0gcGFydCk7XG4gICAgICAgIGlmICghbmV4dE5vZGUpIHtcbiAgICAgICAgICBuZXh0Tm9kZSA9IHtcbiAgICAgICAgICAgIHBhdGg6IHBhcnQsXG4gICAgICAgICAgICB0ZXh0OiBwYXJ0LFxuICAgICAgICAgICAgaWNvbjogcGFydHMubGVuZ3RoXG4gICAgICAgICAgICAgID8gJ2ljb24tZmlsZS1kaXJlY3RvcnknXG4gICAgICAgICAgICAgIDogJ2ljb24tZmlsZS10ZXh0JyxcbiAgICAgICAgICAgIG5vZGVzOiBbXSxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY3VycmVudE5vZGUubm9kZXMucHVzaChuZXh0Tm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGVuZC4gIEFkZCBtYXRjaGVzIGFzIG5vZGVzLlxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5leHROb2RlKTtcbiAgICAgICAgICBuZXh0Tm9kZS5ub2RlcyA9IG5leHROb2RlLm5vZGVzLmNvbmNhdChcbiAgICAgICAgICAgIHJlc3VsdC5tYXRjaGVzLm1hcCgobWF0Y2gsIGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwYXRoOiBpICsgJycsXG4gICAgICAgICAgICAgICAgdGV4dDogbWF0Y2gubWF0Y2hUZXh0LFxuICAgICAgICAgICAgICAgIG5vZGVzOiBbXSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBmaWxlUGF0aDogcmVzdWx0LmZpbGVQYXRoLFxuICAgICAgICAgICAgICAgICAgcmFuZ2U6IG1hdGNoLnJhbmdlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50Tm9kZSA9IG5leHROb2RlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyZWU7XG4gIH0sXG59O1xuIl19