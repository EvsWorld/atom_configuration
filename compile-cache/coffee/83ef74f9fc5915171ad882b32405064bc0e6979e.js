(function() {
  var Module, NonEditableEditorView, PROTOCOL, Promise, cleanupListener, currentMarker, exists, fs, url;

  Promise = require('bluebird');

  fs = require('fs');

  url = require('url');

  Module = require('module');

  NonEditableEditorView = require('./non-editable-editor');

  PROTOCOL = 'atom-node-debugger://';

  currentMarker = null;

  cleanupListener = null;

  exists = function(path) {
    return new Promise(function(resolve) {
      return fs.exists(path, function(isExisted) {
        return resolve(isExisted);
      });
    });
  };

  module.exports = function(_debugger) {
    atom.workspace.addOpener(function(filename, opts) {
      var parsed;
      parsed = url.parse(filename, true);
      if (parsed.protocol === 'atom-node-debugger:') {
        return new NonEditableEditorView({
          uri: filename,
          id: parsed.host,
          _debugger: _debugger,
          query: opts
        });
      }
    });
    return cleanupListener = _debugger.onBreak(function(breakpoint) {
      var id, ref, script, sourceColumn, sourceLine;
      if (currentMarker != null) {
        currentMarker.destroy();
      }
      sourceLine = breakpoint.sourceLine, sourceColumn = breakpoint.sourceColumn;
      script = breakpoint.script && breakpoint.script.name;
      id = (ref = breakpoint.script) != null ? ref.id : void 0;
      return exists(script).then(function(isExisted) {
        var newSourceName, promise;
        if (isExisted) {
          promise = atom.workspace.open(script, {
            initialLine: sourceLine,
            initialColumn: sourceColumn,
            activatePane: true,
            searchAllPanes: true
          });
        } else {
          if (id == null) {
            return;
          }
          newSourceName = "" + PROTOCOL + id;
          promise = atom.workspace.open(newSourceName, {
            initialColumn: sourceColumn,
            initialLine: sourceLine,
            name: script,
            searchAllPanes: true
          });
        }
        return promise;
      }).then(function(editor) {
        if (editor == null) {
          return;
        }
        currentMarker = editor.markBufferPosition([sourceLine, sourceColumn]);
        return editor.decorateMarker(currentMarker, {
          type: 'line-number',
          "class": 'node-debugger-stop-line'
        });
      });
    });
  };

  module.exports.cleanup = function() {
    if (currentMarker != null) {
      return currentMarker.destroy();
    }
  };

  module.exports.destroy = function() {
    module.exports.cleanup();
    if (cleanupListener != null) {
      return cleanupListener();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9qdW1wLXRvLWJyZWFrcG9pbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVI7O0VBQ1YsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUjs7RUFDTixNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBQ1QscUJBQUEsR0FBd0IsT0FBQSxDQUFRLHVCQUFSOztFQUd4QixRQUFBLEdBQVc7O0VBRVgsYUFBQSxHQUFnQjs7RUFDaEIsZUFBQSxHQUFrQjs7RUFFbEIsTUFBQSxHQUFTLFNBQUMsSUFBRDtXQUNQLElBQUksT0FBSixDQUFZLFNBQUMsT0FBRDthQUNWLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBVixFQUFnQixTQUFDLFNBQUQ7ZUFDZCxPQUFBLENBQVEsU0FBUjtNQURjLENBQWhCO0lBRFUsQ0FBWjtFQURPOztFQUtULE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsU0FBRDtJQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBZixDQUF5QixTQUFDLFFBQUQsRUFBVyxJQUFYO0FBQ3ZCLFVBQUE7TUFBQSxNQUFBLEdBQVMsR0FBRyxDQUFDLEtBQUosQ0FBVSxRQUFWLEVBQW9CLElBQXBCO01BQ1QsSUFBRyxNQUFNLENBQUMsUUFBUCxLQUFtQixxQkFBdEI7QUFDRSxlQUFPLElBQUkscUJBQUosQ0FBMEI7VUFDL0IsR0FBQSxFQUFLLFFBRDBCO1VBRS9CLEVBQUEsRUFBSSxNQUFNLENBQUMsSUFGb0I7VUFHL0IsU0FBQSxFQUFXLFNBSG9CO1VBSS9CLEtBQUEsRUFBTyxJQUp3QjtTQUExQixFQURUOztJQUZ1QixDQUF6QjtXQVVBLGVBQUEsR0FBa0IsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsU0FBQyxVQUFEO0FBQ2xDLFVBQUE7TUFBQSxJQUEyQixxQkFBM0I7UUFBQSxhQUFhLENBQUMsT0FBZCxDQUFBLEVBQUE7O01BQ0Msa0NBQUQsRUFBYTtNQUNiLE1BQUEsR0FBUyxVQUFVLENBQUMsTUFBWCxJQUFzQixVQUFVLENBQUMsTUFBTSxDQUFDO01BQ2pELEVBQUEsMENBQXNCLENBQUU7YUFDeEIsTUFBQSxDQUFPLE1BQVAsQ0FDRSxDQUFDLElBREgsQ0FDUSxTQUFDLFNBQUQ7QUFDSixZQUFBO1FBQUEsSUFBRyxTQUFIO1VBQ0UsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixNQUFwQixFQUE0QjtZQUNwQyxXQUFBLEVBQWEsVUFEdUI7WUFFcEMsYUFBQSxFQUFlLFlBRnFCO1lBR3BDLFlBQUEsRUFBYyxJQUhzQjtZQUlwQyxjQUFBLEVBQWdCLElBSm9CO1dBQTVCLEVBRFo7U0FBQSxNQUFBO1VBUUUsSUFBYyxVQUFkO0FBQUEsbUJBQUE7O1VBQ0EsYUFBQSxHQUFnQixFQUFBLEdBQUcsUUFBSCxHQUFjO1VBQzlCLE9BQUEsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsYUFBcEIsRUFBbUM7WUFDM0MsYUFBQSxFQUFlLFlBRDRCO1lBRTNDLFdBQUEsRUFBYSxVQUY4QjtZQUczQyxJQUFBLEVBQU0sTUFIcUM7WUFJM0MsY0FBQSxFQUFnQixJQUoyQjtXQUFuQyxFQVZaOztBQWlCQSxlQUFPO01BbEJILENBRFIsQ0FxQkUsQ0FBQyxJQXJCSCxDQXFCUSxTQUFDLE1BQUQ7UUFDSixJQUFjLGNBQWQ7QUFBQSxpQkFBQTs7UUFDQSxhQUFBLEdBQWdCLE1BQU0sQ0FBQyxrQkFBUCxDQUEwQixDQUN4QyxVQUR3QyxFQUM1QixZQUQ0QixDQUExQjtlQUdoQixNQUFNLENBQUMsY0FBUCxDQUFzQixhQUF0QixFQUFxQztVQUNuQyxJQUFBLEVBQU0sYUFENkI7VUFFbkMsQ0FBQSxLQUFBLENBQUEsRUFBTyx5QkFGNEI7U0FBckM7TUFMSSxDQXJCUjtJQUxrQyxDQUFsQjtFQVhIOztFQStDakIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFmLEdBQXlCLFNBQUE7SUFDdkIsSUFBMkIscUJBQTNCO2FBQUEsYUFBYSxDQUFDLE9BQWQsQ0FBQSxFQUFBOztFQUR1Qjs7RUFHekIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFmLEdBQXlCLFNBQUE7SUFDdkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFmLENBQUE7SUFDQSxJQUFxQix1QkFBckI7YUFBQSxlQUFBLENBQUEsRUFBQTs7RUFGdUI7QUFuRXpCIiwic291cmNlc0NvbnRlbnQiOlsiUHJvbWlzZSA9IHJlcXVpcmUgJ2JsdWViaXJkJ1xuZnMgPSByZXF1aXJlICdmcydcbnVybCA9IHJlcXVpcmUgJ3VybCdcbk1vZHVsZSA9IHJlcXVpcmUgJ21vZHVsZSdcbk5vbkVkaXRhYmxlRWRpdG9yVmlldyA9IHJlcXVpcmUgJy4vbm9uLWVkaXRhYmxlLWVkaXRvcidcblxuXG5QUk9UT0NPTCA9ICdhdG9tLW5vZGUtZGVidWdnZXI6Ly8nXG5cbmN1cnJlbnRNYXJrZXIgPSBudWxsXG5jbGVhbnVwTGlzdGVuZXIgPSBudWxsXG5cbmV4aXN0cyA9IChwYXRoKSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgLT5cbiAgICBmcy5leGlzdHMgcGF0aCwgKGlzRXhpc3RlZCkgLT5cbiAgICAgIHJlc29sdmUoaXNFeGlzdGVkKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChfZGVidWdnZXIpIC0+XG4gIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lciAoZmlsZW5hbWUsIG9wdHMpIC0+XG4gICAgcGFyc2VkID0gdXJsLnBhcnNlKGZpbGVuYW1lLCB0cnVlKVxuICAgIGlmIHBhcnNlZC5wcm90b2NvbCBpcyAnYXRvbS1ub2RlLWRlYnVnZ2VyOidcbiAgICAgIHJldHVybiBuZXcgTm9uRWRpdGFibGVFZGl0b3JWaWV3KHtcbiAgICAgICAgdXJpOiBmaWxlbmFtZVxuICAgICAgICBpZDogcGFyc2VkLmhvc3RcbiAgICAgICAgX2RlYnVnZ2VyOiBfZGVidWdnZXJcbiAgICAgICAgcXVlcnk6IG9wdHNcbiAgICAgIH0pXG5cbiAgY2xlYW51cExpc3RlbmVyID0gX2RlYnVnZ2VyLm9uQnJlYWsgKGJyZWFrcG9pbnQpIC0+XG4gICAgY3VycmVudE1hcmtlci5kZXN0cm95KCkgaWYgY3VycmVudE1hcmtlcj9cbiAgICB7c291cmNlTGluZSwgc291cmNlQ29sdW1ufSA9IGJyZWFrcG9pbnRcbiAgICBzY3JpcHQgPSBicmVha3BvaW50LnNjcmlwdCBhbmQgYnJlYWtwb2ludC5zY3JpcHQubmFtZVxuICAgIGlkID0gYnJlYWtwb2ludC5zY3JpcHQ/LmlkXG4gICAgZXhpc3RzKHNjcmlwdClcbiAgICAgIC50aGVuIChpc0V4aXN0ZWQpLT5cbiAgICAgICAgaWYgaXNFeGlzdGVkXG4gICAgICAgICAgcHJvbWlzZSA9IGF0b20ud29ya3NwYWNlLm9wZW4oc2NyaXB0LCB7XG4gICAgICAgICAgICBpbml0aWFsTGluZTogc291cmNlTGluZVxuICAgICAgICAgICAgaW5pdGlhbENvbHVtbjogc291cmNlQ29sdW1uXG4gICAgICAgICAgICBhY3RpdmF0ZVBhbmU6IHRydWVcbiAgICAgICAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBpZiBub3QgaWQ/XG4gICAgICAgICAgbmV3U291cmNlTmFtZSA9IFwiI3tQUk9UT0NPTH0je2lkfVwiXG4gICAgICAgICAgcHJvbWlzZSA9IGF0b20ud29ya3NwYWNlLm9wZW4obmV3U291cmNlTmFtZSwge1xuICAgICAgICAgICAgaW5pdGlhbENvbHVtbjogc291cmNlQ29sdW1uXG4gICAgICAgICAgICBpbml0aWFsTGluZTogc291cmNlTGluZVxuICAgICAgICAgICAgbmFtZTogc2NyaXB0XG4gICAgICAgICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHByb21pc2VcblxuICAgICAgLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgcmV0dXJuIGlmIG5vdCBlZGl0b3I/XG4gICAgICAgIGN1cnJlbnRNYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclBvc2l0aW9uKFtcbiAgICAgICAgICBzb3VyY2VMaW5lLCBzb3VyY2VDb2x1bW5cbiAgICAgICAgXSlcbiAgICAgICAgZWRpdG9yLmRlY29yYXRlTWFya2VyKGN1cnJlbnRNYXJrZXIsIHtcbiAgICAgICAgICB0eXBlOiAnbGluZS1udW1iZXInXG4gICAgICAgICAgY2xhc3M6ICdub2RlLWRlYnVnZ2VyLXN0b3AtbGluZSdcbiAgICAgICAgfSlcblxubW9kdWxlLmV4cG9ydHMuY2xlYW51cCA9IC0+XG4gIGN1cnJlbnRNYXJrZXIuZGVzdHJveSgpIGlmIGN1cnJlbnRNYXJrZXI/XG5cbm1vZHVsZS5leHBvcnRzLmRlc3Ryb3kgPSAtPlxuICBtb2R1bGUuZXhwb3J0cy5jbGVhbnVwKClcbiAgY2xlYW51cExpc3RlbmVyKCkgaWYgY2xlYW51cExpc3RlbmVyP1xuIl19
