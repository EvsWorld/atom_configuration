(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    positionHistory: [],
    positionFuture: [],
    wasrewinding: false,
    rewinding: false,
    wasforwarding: false,
    forwarding: false,
    editorSubscription: null,
    activate: function() {
      var ed, pane, pos;
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(activeEd) {
          return activeEd.onDidChangeCursorPosition(function(event) {
            var activePane, lastEd, lastPane, lastPos, ref;
            activePane = atom.workspace.getActivePane();
            if (_this.rewinding === false && _this.forwarding === false) {
              if (_this.positionHistory.length) {
                ref = _this.positionHistory.slice(-1)[0], lastPane = ref.pane, lastEd = ref.editor, lastPos = ref.position;
                if (activePane === lastPane && activeEd === lastEd && Math.abs(lastPos.serialize()[0] - event.newBufferPosition.serialize()[0]) < 3) {
                  return;
                }
              }
              _this.positionHistory.push({
                pane: activePane,
                editor: activeEd,
                position: event.newBufferPosition
              });
              _this.positionFuture = [];
              _this.wasrewinding = false;
              _this.wasforwarding = false;
            }
            _this.rewinding = false;
            return _this.forwarding = false;
          });
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPane((function(_this) {
        return function(event) {
          var pos;
          _this.positionHistory = (function() {
            var i, len, ref, results;
            ref = this.positionHistory;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              pos = ref[i];
              if (pos.pane !== event.pane) {
                results.push(pos);
              }
            }
            return results;
          }).call(_this);
          return _this.positionFuture = (function() {
            var i, len, ref, results;
            ref = this.positionFuture;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              pos = ref[i];
              if (pos.pane !== event.pane) {
                results.push(pos);
              }
            }
            return results;
          }).call(_this);
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(event) {
          var pos;
          _this.positionHistory = (function() {
            var i, len, ref, results;
            ref = this.positionHistory;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              pos = ref[i];
              if (pos.editor !== event.item) {
                results.push(pos);
              }
            }
            return results;
          }).call(_this);
          return _this.positionFuture = (function() {
            var i, len, ref, results;
            ref = this.positionFuture;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              pos = ref[i];
              if (pos.editor !== event.item) {
                results.push(pos);
              }
            }
            return results;
          }).call(_this);
        };
      })(this)));
      ed = atom.workspace.getActiveTextEditor();
      pane = atom.workspace.getActivePane();
      if ((pane != null) && (ed != null)) {
        pos = ed.getCursorBufferPosition();
        this.positionHistory.push({
          pane: pane,
          editor: ed,
          position: pos
        });
      }
      return this.disposables.add(atom.commands.add('atom-workspace', {
        'last-cursor-position:previous': (function(_this) {
          return function() {
            return _this.previous();
          };
        })(this),
        'last-cursor-position:next': (function(_this) {
          return function() {
            return _this.next();
          };
        })(this)
      }));
    },
    previous: function() {
      var activePane, editorIdx, foundeditor, pos, temp;
      if (this.wasforwarding || this.wasrewinding === false) {
        temp = this.positionHistory.pop();
        if (temp != null) {
          this.positionFuture.push(temp);
        }
      }
      pos = this.positionHistory.pop();
      if (pos != null) {
        this.positionFuture.push(pos);
        this.rewinding = true;
        this.wasrewinding = true;
        this.wasforwarding = false;
        foundeditor = true;
        if (pos.pane !== atom.workspace.getActivePane()) {
          pos.pane.activate();
        }
        if (pos.editor !== atom.workspace.getActiveTextEditor()) {
          activePane = atom.workspace.getActivePane();
          editorIdx = activePane.getItems().indexOf(pos.editor);
          activePane.activateItemAtIndex(editorIdx);
        }
        atom.workspace.getActiveTextEditor().setCursorBufferPosition(pos.position, {
          autoscroll: false
        });
        return atom.workspace.getActiveTextEditor().scrollToCursorPosition({
          center: true
        });
      }
    },
    next: function() {
      var activePane, editorIdx, foundeditor, pos, temp;
      if (this.wasrewinding || this.wasforwarding === false) {
        temp = this.positionFuture.pop();
        if (temp != null) {
          this.positionHistory.push(temp);
        }
      }
      pos = this.positionFuture.pop();
      if (pos != null) {
        this.positionHistory.push(pos);
        this.forwarding = true;
        this.wasforwarding = true;
        this.wasrewinding = false;
        foundeditor = true;
        if (pos.pane !== atom.workspace.getActivePane) {
          pos.pane.activate();
        }
        if (pos.editor !== atom.workspace.getActiveTextEditor()) {
          activePane = atom.workspace.getActivePane();
          editorIdx = activePane.getItems().indexOf(pos.editor);
          activePane.activateItemAtIndex(editorIdx);
        }
        atom.workspace.getActiveTextEditor().setCursorBufferPosition(pos.position, {
          autoscroll: false
        });
        return atom.workspace.getActiveTextEditor().scrollToCursorPosition({
          center: true
        });
      }
    },
    deactivate: function() {
      return this.disposables.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9sYXN0LWN1cnNvci1wb3NpdGlvbi9saWIvbGFzdC1jdXJzb3ItcG9zaXRpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQ0c7SUFBQSxlQUFBLEVBQWlCLEVBQWpCO0lBQ0EsY0FBQSxFQUFnQixFQURoQjtJQUVBLFlBQUEsRUFBYyxLQUZkO0lBR0EsU0FBQSxFQUFXLEtBSFg7SUFJQSxhQUFBLEVBQWMsS0FKZDtJQUtBLFVBQUEsRUFBWSxLQUxaO0lBTUEsa0JBQUEsRUFBb0IsSUFOcEI7SUFRQSxRQUFBLEVBQVUsU0FBQTtBQUNQLFVBQUE7TUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFHbkIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFFBQUQ7aUJBR2hELFFBQVEsQ0FBQyx5QkFBVCxDQUFtQyxTQUFDLEtBQUQ7QUFFaEMsZ0JBQUE7WUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUE7WUFFYixJQUFHLEtBQUMsQ0FBQSxTQUFELEtBQWMsS0FBZCxJQUF3QixLQUFDLENBQUEsVUFBRCxLQUFlLEtBQTFDO2NBQ0csSUFBRyxLQUFDLENBQUEsZUFBZSxDQUFDLE1BQXBCO2dCQUNHLE1BQXNELEtBQUMsQ0FBQSxlQUFnQixVQUFRLENBQUEsQ0FBQSxDQUEvRSxFQUFPLGVBQU4sSUFBRCxFQUF5QixhQUFSLE1BQWpCLEVBQTJDLGNBQVY7Z0JBQ2pDLElBQUcsVUFBQSxLQUFjLFFBQWQsSUFBMkIsUUFBQSxLQUFZLE1BQXZDLElBRUcsSUFBSSxDQUFDLEdBQUws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SDs7SUFWRyxDQTFGTjtJQXlIQSxVQUFBLEVBQVksU0FBQTthQUNULElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO0lBRFMsQ0F6SFo7O0FBSEgiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICBwb3NpdGlvbkhpc3Rvcnk6IFtdXG4gICBwb3NpdGlvbkZ1dHVyZTogW11cbiAgIHdhc3Jld2luZGluZzogZmFsc2VcbiAgIHJld2luZGluZzogZmFsc2VcbiAgIHdhc2ZvcndhcmRpbmc6ZmFsc2VcbiAgIGZvcndhcmRpbmc6IGZhbHNlXG4gICBlZGl0b3JTdWJzY3JpcHRpb246IG51bGxcblxuICAgYWN0aXZhdGU6IC0+XG4gICAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgICAjYXNrIHRvIGJlIGNhbGxlZCBmb3IgZXZlcnkgZXhpc3RpbmcgdGV4dCBlZGl0b3IsIGFzIHdlbGwgYXMgZm9yIGFueSBmdXR1cmUgb25lXG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoYWN0aXZlRWQpID0+XG4gICAgICAgICAjY29uc29sZS5sb2coXCJhZGRpbmcgb2JzZXJ2ZWQgZWRpdG9yIFwiICsgYWN0aXZlRWQuaWQpXG4gICAgICAgICAjYXNrIHRvIGJlIGNhbGxlZCBmb3IgZXZlcnkgY3Vyc29yIGNoYW5nZSBpbiB0aGF0IGVkaXRvclxuICAgICAgICAgYWN0aXZlRWQub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbiAoZXZlbnQpID0+XG4gICAgICAgICAgICAjY29uc29sZS5sb2coXCJjdXJzb3IgbW92ZWRcIilcbiAgICAgICAgICAgIGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcblxuICAgICAgICAgICAgaWYgQHJld2luZGluZyBpcyBmYWxzZSBhbmQgQGZvcndhcmRpbmcgaXMgZmFsc2VcbiAgICAgICAgICAgICAgIGlmIEBwb3NpdGlvbkhpc3RvcnkubGVuZ3RoXG4gICAgICAgICAgICAgICAgICB7cGFuZTogbGFzdFBhbmUsIGVkaXRvcjogbGFzdEVkLCBwb3NpdGlvbjogbGFzdFBvc30gPSBAcG9zaXRpb25IaXN0b3J5Wy0xLi4tMV1bMF1cbiAgICAgICAgICAgICAgICAgIGlmIGFjdGl2ZVBhbmUgaXMgbGFzdFBhbmUgYW5kIGFjdGl2ZUVkIGlzIGxhc3RFZCBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICNpZ25vcmUgY3Vyc29yIHBvcyBjaGFuZ2VzIDwgMyBsaW5lc1xuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5hYnMobGFzdFBvcy5zZXJpYWxpemUoKVswXSAtIGV2ZW50Lm5ld0J1ZmZlclBvc2l0aW9uLnNlcmlhbGl6ZSgpWzBdKSA8IDNcbiAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgI2NvbnNvbGUubG9nKFwiQWN0aXZlUGFuZSBpZCBcIiArIGFjdGl2ZVBhbmUuaWQpXG4gICAgICAgICAgICAgICBAcG9zaXRpb25IaXN0b3J5LnB1c2goe3BhbmU6IGFjdGl2ZVBhbmUsIGVkaXRvcjogYWN0aXZlRWQsIHBvc2l0aW9uOiBldmVudC5uZXdCdWZmZXJQb3NpdGlvbn0pXG5cbiAgICAgICAgICAgICAgICNmdXR1cmUgcG9zaXRpb25zIGdldCBpbnZhbGlkYXRlZCB3aGVuIGN1cnNvciBtb3ZlcyB0byBhIG5ldyBwb3NpdGlvblxuICAgICAgICAgICAgICAgQHBvc2l0aW9uRnV0dXJlID0gW11cbiAgICAgICAgICAgICAgIEB3YXNyZXdpbmRpbmcgPSBmYWxzZVxuICAgICAgICAgICAgICAgQHdhc2ZvcndhcmRpbmcgPSBmYWxzZVxuICAgICAgICAgICAgQHJld2luZGluZyA9IGZhbHNlXG4gICAgICAgICAgICBAZm9yd2FyZGluZyA9IGZhbHNlXG5cbiAgICAgICNjbGVhbiBoaXN0b3J5IHdoZW4gcGFuZSBpcyByZW1vdmVkXG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkRGVzdHJveVBhbmUgKGV2ZW50KSA9PlxuICAgICAgICAgQHBvc2l0aW9uSGlzdG9yeSA9IChwb3MgZm9yIHBvcyBpbiBAcG9zaXRpb25IaXN0b3J5IHdoZW4gcG9zLnBhbmUgIT0gZXZlbnQucGFuZSlcbiAgICAgICAgIEBwb3NpdGlvbkZ1dHVyZSA9IChwb3MgZm9yIHBvcyBpbiBAcG9zaXRpb25GdXR1cmUgd2hlbiBwb3MucGFuZSAhPSBldmVudC5wYW5lKVxuXG4gICAgICAjY2xlYW4gaGlzdG9yeSB3aGVuIHBhbmVJdGVtICh0YWIpIGlzIHJlbW92ZWRcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZUl0ZW0gKGV2ZW50KSA9PlxuICAgICAgICAgQHBvc2l0aW9uSGlzdG9yeSA9IChwb3MgZm9yIHBvcyBpbiBAcG9zaXRpb25IaXN0b3J5IHdoZW4gcG9zLmVkaXRvciAhPSBldmVudC5pdGVtKVxuICAgICAgICAgQHBvc2l0aW9uRnV0dXJlID0gKHBvcyBmb3IgcG9zIGluIEBwb3NpdGlvbkZ1dHVyZSB3aGVuIHBvcy5lZGl0b3IgIT0gZXZlbnQuaXRlbSlcblxuICAgICAgI3JlY29yZCBzdGFydGluZyBwb3NpdGlvblxuICAgICAgZWQgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgIGlmIHBhbmU/IGFuZCBlZD9cbiAgICAgICAgIHBvcyA9IGVkLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgICAgIEBwb3NpdGlvbkhpc3RvcnkucHVzaCh7cGFuZTogcGFuZSwgZWRpdG9yOiBlZCwgcG9zaXRpb246IHBvc30pXG5cbiAgICAgICNiaW5kIGV2ZW50cyB0byBjYWxsYmFja3NcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICAgJ2xhc3QtY3Vyc29yLXBvc2l0aW9uOnByZXZpb3VzJzogPT4gQHByZXZpb3VzKClcbiAgICAgICAgJ2xhc3QtY3Vyc29yLXBvc2l0aW9uOm5leHQnOiA9PiBAbmV4dCgpXG5cbiAgIHByZXZpb3VzOiAtPlxuICAgICAgI2NvbnNvbGUubG9nKFwiUHJldmlvdXMgY2FsbGVkXCIpXG4gICAgICAjd2hlbiBjaGFuZ2luZyBkaXJlY3Rpb24sIHdlIG5lZWQgdG8gc3RvcmUgbGFzdCBwb3NpdGlvbiwgYnV0IG5vdCBtb3ZlIHRvIGl0XG4gICAgICBpZiBAd2FzZm9yd2FyZGluZyBvciBAd2FzcmV3aW5kaW5nIGlzIGZhbHNlXG4gICAgICAgICAjY29uc29sZS5sb2coXCItLUNoYW5naW5nIGRpcmVjdGlvblwiKVxuICAgICAgICAgdGVtcCA9IEBwb3NpdGlvbkhpc3RvcnkucG9wKClcbiAgICAgICAgIGlmIHRlbXA/XG4gICAgICAgICAgICBAcG9zaXRpb25GdXR1cmUucHVzaCh0ZW1wKVxuXG4gICAgICAjZ2V0IGxhc3QgcG9zaXRpb24gaW4gdGhlIGxpc3RcbiAgICAgIHBvcyA9IEBwb3NpdGlvbkhpc3RvcnkucG9wKClcbiAgICAgIGlmIHBvcz9cbiAgICAgICAgICNrZWVwIHRoZSBwb3NpdGlvbiBmb3Igb3Bwb3NpdGUgZGlyZWN0aW9uXG4gICAgICAgICBAcG9zaXRpb25GdXR1cmUucHVzaChwb3MpXG4gICAgICAgICBAcmV3aW5kaW5nID0gdHJ1ZVxuICAgICAgICAgQHdhc3Jld2luZGluZyA9IHRydWVcbiAgICAgICAgIEB3YXNmb3J3YXJkaW5nID0gZmFsc2VcbiAgICAgICAgIGZvdW5kZWRpdG9yID0gdHJ1ZVxuICAgICAgICAgI21vdmUgdG8gcmlnaHQgZWRpdG9yXG4gICAgICAgICBpZiBwb3MucGFuZSBpc250IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICAgICAgI2NvbnNvbGUubG9nKFwiLS1BY3RpdmF0aW5nIHBhbmUgXCIgKyBwb3MucGFuZS5pZClcbiAgICAgICAgICAgIHBvcy5wYW5lLmFjdGl2YXRlKClcbiAgICAgICAgIGlmIHBvcy5lZGl0b3IgaXNudCBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICAgICNjb25zb2xlLmxvZyhcIi0tQWN0aXZhdGluZyBlZGl0b3IgXCIgKyBwb3MuZWRpdG9yLmlkKVxuICAgICAgICAgICAgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICAgICAgZWRpdG9ySWR4ID0gYWN0aXZlUGFuZS5nZXRJdGVtcygpLmluZGV4T2YocG9zLmVkaXRvcilcbiAgICAgICAgICAgIGFjdGl2ZVBhbmUuYWN0aXZhdGVJdGVtQXRJbmRleChlZGl0b3JJZHgpXG4gICAgICAgICAjbW92ZSBjdXJzb3IgdG8gbGFzdCBwb3NpdGlvbiBhbmQgc2Nyb2xsIHRvIGl0XG4gICAgICAgICAjY29uc29sZS5sb2coXCItLU1vdmluZyBjdXJzb3IgdG8gbmV3IHBvc2l0aW9uXCIpXG4gICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zLnBvc2l0aW9uLCBhdXRvc2Nyb2xsOmZhbHNlKVxuICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLnNjcm9sbFRvQ3Vyc29yUG9zaXRpb24oY2VudGVyOnRydWUpXG5cbiAgIG5leHQ6IC0+XG4gICAgICAjY29uc29sZS5sb2coXCJOZXh0IGNhbGxlZFwiKVxuICAgICAgI3doZW4gY2hhbmdpbmcgZGlyZWN0aW9uLCB3ZSBuZWVkIHRvIHN0b3JlIGxhc3QgcG9zaXRpb24sIGJ1dCBub3QgbW92ZSB0byBpdFxuICAgICAgaWYgQHdhc3Jld2luZGluZyBvciBAd2FzZm9yd2FyZGluZyBpcyBmYWxzZVxuICAgICAgICAgI2NvbnNvbGUubG9nKFwiLS1DaGFuZ2luZyBkaXJlY3Rpb25cIilcbiAgICAgICAgIHRlbXAgPSBAcG9zaXRpb25GdXR1cmUucG9wKClcbiAgICAgICAgIGlmIHRlbXA/XG4gICAgICAgICAgICBAcG9zaXRpb25IaXN0b3J5LnB1c2godGVtcClcbiAgICAgICNnZXQgbGFzdCBwb3NpdGlvbiBpbiB0aGUgbGlzdFxuICAgICAgcG9zID0gQHBvc2l0aW9uRnV0dXJlLnBvcCgpXG4gICAgICBpZiBwb3M/XG4gICAgICAgICAja2VlcCB0aGUgcG9zaXRpb24gZm9yIG9wcG9zaXRlIGRpcmVjdGlvblxuICAgICAgICAgQHBvc2l0aW9uSGlzdG9yeS5wdXNoKHBvcylcbiAgICAgICAgIEBmb3J3YXJkaW5nID0gdHJ1ZVxuICAgICAgICAgQHdhc2ZvcndhcmRpbmcgPSB0cnVlXG4gICAgICAgICBAd2FzcmV3aW5kaW5nID0gZmFsc2VcbiAgICAgICAgIGZvdW5kZWRpdG9yID0gdHJ1ZVxuICAgICAgICAgI21vdmUgdG8gcmlnaHQgZWRpdG9yXG4gICAgICAgICBpZiBwb3MucGFuZSBpc250IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVcbiAgICAgICAgICAgICNjb25zb2xlLmxvZyhcIi0tQWN0aXZhdGluZyBwYW5lIFwiICsgcG9zLnBhbmUuaWQpXG4gICAgICAgICAgICBwb3MucGFuZS5hY3RpdmF0ZSgpXG4gICAgICAgICBpZiBwb3MuZWRpdG9yIGlzbnQgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgICAjY29uc29sZS5sb2coXCItLUFjdGl2YXRpbmcgZWRpdG9yIFwiICsgcG9zLmVkaXRvci5pZClcbiAgICAgICAgICAgIGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgICAgICAgIGVkaXRvcklkeCA9IGFjdGl2ZVBhbmUuZ2V0SXRlbXMoKS5pbmRleE9mKHBvcy5lZGl0b3IpXG4gICAgICAgICAgICBhY3RpdmVQYW5lLmFjdGl2YXRlSXRlbUF0SW5kZXgoZWRpdG9ySWR4KVxuICAgICAgICAgI21vdmUgY3Vyc29yIHRvIGxhc3QgcG9zaXRpb24gYW5kIHNjcm9sbCB0byBpdFxuICAgICAgICAgI2NvbnNvbGUubG9nKFwiLS1Nb3ZpbmcgY3Vyc29yIHRvIG5ldyBwb3NpdGlvblwiKVxuICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvcy5wb3NpdGlvbiwgYXV0b3Njcm9sbDpmYWxzZSlcbiAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKGNlbnRlcjp0cnVlKVxuXG4gICBkZWFjdGl2YXRlOiAtPlxuICAgICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuIl19
