(function() {
  var blockTravel;

  blockTravel = function(editor, direction, select) {
    var count, cursor, i, invisibles, len, lineCount, ref, row, rowIndex, up;
    invisibles = atom.config.get('editor.invisibles');
    up = direction === "up";
    lineCount = editor.getScreenLineCount();
    ref = editor.getCursors();
    for (i = 0, len = ref.length; i < len; i++) {
      cursor = ref[i];
      row = cursor.getScreenRow();
      count = 0;
      while (true) {
        count += 1;
        if (up) {
          rowIndex = row - count;
        } else {
          rowIndex = row + count;
        }
        if (rowIndex < 0) {
          count = row;
          break;
        } else if (rowIndex >= lineCount) {
          count = lineCount - row;
          break;
        }
        if (editor.lineTextForScreenRow(rowIndex).replace(new RegExp(invisibles.eol, 'g'), '\n').replace(new RegExp(invisibles.space, 'g'), ' ').replace(new RegExp(invisibles.tab, 'g'), '\t').replace(new RegExp(invisibles.cr, 'g'), '\r').trim() === "") {
          break;
        }
      }
      if (select) {
        if (up) {
          cursor.selection.selectUp(count);
        } else {
          cursor.selection.selectDown(count);
        }
      } else {
        if (up) {
          cursor.moveUp(count);
        } else {
          cursor.moveDown(count);
        }
      }
    }
    return editor.mergeCursors();
  };

  module.exports = {
    activate: function() {
      atom.commands.add('atom-text-editor', 'block-travel:move-up', function() {
        return blockTravel(atom.workspace.getActivePaneItem(), "up", false);
      });
      atom.commands.add('atom-text-editor', 'block-travel:move-down', function() {
        return blockTravel(atom.workspace.getActivePaneItem(), "down", false);
      });
      atom.commands.add('atom-text-editor', 'block-travel:select-up', function() {
        return blockTravel(atom.workspace.getActivePaneItem(), "up", true);
      });
      return atom.commands.add('atom-text-editor', 'block-travel:select-down', function() {
        return blockTravel(atom.workspace.getActivePaneItem(), "down", true);
      });
    },
    blockTravel: blockTravel
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ibG9jay10cmF2ZWwvbGliL2Jsb2NrLXRyYXZlbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFdBQUEsR0FBYyxTQUFDLE1BQUQsRUFBUyxTQUFULEVBQW9CLE1BQXBCO0FBQ1osUUFBQTtJQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCO0lBQ2IsRUFBQSxHQUFZLFNBQUEsS0FBYTtJQUN6QixTQUFBLEdBQVksTUFBTSxDQUFDLGtCQUFQLENBQUE7QUFFWjtBQUFBLFNBQUEscUNBQUE7O01BQ0UsR0FBQSxHQUFRLE1BQU0sQ0FBQyxZQUFQLENBQUE7TUFDUixLQUFBLEdBQVE7QUFFUixhQUFBLElBQUE7UUFDRSxLQUFBLElBQVM7UUFFVCxJQUFHLEVBQUg7VUFDRSxRQUFBLEdBQVcsR0FBQSxHQUFNLE1BRG5CO1NBQUEsTUFBQTtVQUdFLFFBQUEsR0FBVyxHQUFBLEdBQU0sTUFIbkI7O1FBS0EsSUFBRyxRQUFBLEdBQVcsQ0FBZDtVQUNFLEtBQUEsR0FBUTtBQUNSLGdCQUZGO1NBQUEsTUFHSyxJQUFHLFFBQUEsSUFBWSxTQUFmO1VBQ0gsS0FBQSxHQUFRLFNBQUEsR0FBWTtBQUNwQixnQkFGRzs7UUFJTCxJQUFHLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixRQUE1QixDQUNDLENBQUMsT0FERixDQUNVLElBQUksTUFBSixDQUFXLFVBQVUsQ0FBQyxHQUF0QixFQUEyQixHQUEzQixDQURWLEVBQzJDLElBRDNDLENBRUMsQ0FBQyxPQUZGLENBRVUsSUFBSSxNQUFKLENBQVcsVUFBVSxDQUFDLEtBQXRCLEVBQTZCLEdBQTdCLENBRlYsRUFFNkMsR0FGN0MsQ0FHQyxDQUFDLE9BSEYsQ0FHVSxJQUFJLE1BQUosQ0FBVyxVQUFVLENBQUMsR0FBdEIsRUFBMkIsR0FBM0IsQ0FIVixFQUcyQyxJQUgzQyxDQUlDLENBQUMsT0FKRixDQUlVLElBQUksTUFBSixDQUFXLFVBQVUsQ0FBQyxFQUF0QixFQUEwQixHQUExQixDQUpWLEVBSTBDLElBSjFDLENBS0MsQ0FBQyxJQUxGLENBQUEsQ0FBQSxLQUtZLEVBTGY7QUFNRSxnQkFORjs7TUFmRjtNQXVCQSxJQUFHLE1BQUg7UUFDRSxJQUFHLEVBQUg7VUFDRSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQWpCLENBQTBCLEtBQTFCLEVBREY7U0FBQSxNQUFBO1VBR0UsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFqQixDQUE0QixLQUE1QixFQUhGO1NBREY7T0FBQSxNQUFBO1FBTUUsSUFBRyxFQUFIO1VBQ0UsTUFBTSxDQUFDLE1BQVAsQ0FBYyxLQUFkLEVBREY7U0FBQSxNQUFBO1VBR0UsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsS0FBaEIsRUFIRjtTQU5GOztBQTNCRjtXQXNDQSxNQUFNLENBQUMsWUFBUCxDQUFBO0VBM0NZOztFQTZDZCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUE7TUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLHNCQUF0QyxFQUE4RCxTQUFBO2VBQzVELFdBQUEsQ0FBWSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBWixFQUFnRCxJQUFoRCxFQUFzRCxLQUF0RDtNQUQ0RCxDQUE5RDtNQUdBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0Msd0JBQXRDLEVBQWdFLFNBQUE7ZUFDOUQsV0FBQSxDQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFaLEVBQWdELE1BQWhELEVBQXdELEtBQXhEO01BRDhELENBQWhFO01BR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyx3QkFBdEMsRUFBZ0UsU0FBQTtlQUM5RCxXQUFBLENBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBQVosRUFBZ0QsSUFBaEQsRUFBc0QsSUFBdEQ7TUFEOEQsQ0FBaEU7YUFHQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLDBCQUF0QyxFQUFrRSxTQUFBO2VBQ2hFLFdBQUEsQ0FBWSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBWixFQUFnRCxNQUFoRCxFQUF3RCxJQUF4RDtNQURnRSxDQUFsRTtJQVZRLENBQVY7SUFhQSxXQUFBLEVBQWEsV0FiYjs7QUE5Q0YiLCJzb3VyY2VzQ29udGVudCI6WyJibG9ja1RyYXZlbCA9IChlZGl0b3IsIGRpcmVjdGlvbiwgc2VsZWN0KSAtPlxuICBpbnZpc2libGVzID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3IuaW52aXNpYmxlcycpXG4gIHVwICAgICAgICA9IGRpcmVjdGlvbiA9PSBcInVwXCJcbiAgbGluZUNvdW50ID0gZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpXG5cbiAgZm9yIGN1cnNvciBpbiBlZGl0b3IuZ2V0Q3Vyc29ycygpXG4gICAgcm93ICAgPSBjdXJzb3IuZ2V0U2NyZWVuUm93KClcbiAgICBjb3VudCA9IDBcblxuICAgIGxvb3BcbiAgICAgIGNvdW50ICs9IDFcblxuICAgICAgaWYgdXBcbiAgICAgICAgcm93SW5kZXggPSByb3cgLSBjb3VudFxuICAgICAgZWxzZVxuICAgICAgICByb3dJbmRleCA9IHJvdyArIGNvdW50XG5cbiAgICAgIGlmIHJvd0luZGV4IDwgMFxuICAgICAgICBjb3VudCA9IHJvd1xuICAgICAgICBicmVha1xuICAgICAgZWxzZSBpZiByb3dJbmRleCA+PSBsaW5lQ291bnRcbiAgICAgICAgY291bnQgPSBsaW5lQ291bnQgLSByb3dcbiAgICAgICAgYnJlYWtcblxuICAgICAgaWYgZWRpdG9yLmxpbmVUZXh0Rm9yU2NyZWVuUm93KHJvd0luZGV4KVxuICAgICAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoaW52aXNpYmxlcy5lb2wsICdnJyksICdcXG4nKVxuICAgICAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoaW52aXNpYmxlcy5zcGFjZSwgJ2cnKSwgJyAnKVxuICAgICAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoaW52aXNpYmxlcy50YWIsICdnJyksICdcXHQnKVxuICAgICAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoaW52aXNpYmxlcy5jciwgJ2cnKSwgJ1xccicpXG4gICAgICAgICAgLnRyaW0oKSBpcyBcIlwiXG4gICAgICAgIGJyZWFrXG5cbiAgICBpZiBzZWxlY3RcbiAgICAgIGlmIHVwXG4gICAgICAgIGN1cnNvci5zZWxlY3Rpb24uc2VsZWN0VXAoY291bnQpXG4gICAgICBlbHNlXG4gICAgICAgIGN1cnNvci5zZWxlY3Rpb24uc2VsZWN0RG93bihjb3VudClcbiAgICBlbHNlXG4gICAgICBpZiB1cFxuICAgICAgICBjdXJzb3IubW92ZVVwKGNvdW50KVxuICAgICAgZWxzZVxuICAgICAgICBjdXJzb3IubW92ZURvd24oY291bnQpXG5cbiAgZWRpdG9yLm1lcmdlQ3Vyc29ycygpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IC0+XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnYmxvY2stdHJhdmVsOm1vdmUtdXAnLCAtPlxuICAgICAgYmxvY2tUcmF2ZWwoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSwgXCJ1cFwiLCBmYWxzZSlcblxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2Jsb2NrLXRyYXZlbDptb3ZlLWRvd24nLCAtPlxuICAgICAgYmxvY2tUcmF2ZWwoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSwgXCJkb3duXCIsIGZhbHNlKVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnYmxvY2stdHJhdmVsOnNlbGVjdC11cCcsIC0+XG4gICAgICBibG9ja1RyYXZlbChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpLCBcInVwXCIsIHRydWUpXG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdibG9jay10cmF2ZWw6c2VsZWN0LWRvd24nLCAtPlxuICAgICAgYmxvY2tUcmF2ZWwoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSwgXCJkb3duXCIsIHRydWUpXG5cbiAgYmxvY2tUcmF2ZWw6IGJsb2NrVHJhdmVsXG4iXX0=
