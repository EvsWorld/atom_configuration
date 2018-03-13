(function() {
  var CompositeDisposable, Point, createElementsForGuides, getGuides, ref, ref1, styleGuide;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Point = ref.Point;

  ref1 = require('./indent-guide-improved-element'), createElementsForGuides = ref1.createElementsForGuides, styleGuide = ref1.styleGuide;

  getGuides = require('./guides.coffee').getGuides;

  module.exports = {
    activate: function(state) {
      var createPoint, handleEvents, updateGuide;
      this.currentSubscriptions = [];
      this.busy = false;
      atom.config.set('editor.showIndentGuide', false);
      createPoint = function(x, y) {
        x = isNaN(x) ? 0 : x;
        y = isNaN(y) ? 0 : y;
        return new Point(x, y);
      };
      updateGuide = function(editor, editorElement) {
        var basePixelPos, getIndent, guides, lineHeightPixel, scrollLeft, scrollTop, visibleRange, visibleScreenRange;
        visibleScreenRange = editorElement.getVisibleRowRange();
        if (!((visibleScreenRange != null) && editorElement.component.visible)) {
          return;
        }
        basePixelPos = editorElement.pixelPositionForScreenPosition(createPoint(visibleScreenRange[0], 0)).top;
        visibleRange = visibleScreenRange.map(function(row) {
          return editor.bufferPositionForScreenPosition(createPoint(row, 0)).row;
        });
        getIndent = function(row) {
          if (editor.lineTextForBufferRow(row).match(/^\s*$/)) {
            return null;
          } else {
            return editor.indentationForBufferRow(row);
          }
        };
        scrollTop = editorElement.getScrollTop();
        scrollLeft = editorElement.getScrollLeft();
        guides = getGuides(visibleRange[0], visibleRange[1], editor.getLastBufferRow(), editor.getCursorBufferPositions().map(function(point) {
          return point.row;
        }), getIndent);
        lineHeightPixel = editor.getLineHeightInPixels();
        return createElementsForGuides(editorElement, guides.map(function(g) {
          return function(el) {
            return styleGuide(el, g.point.translate(createPoint(visibleRange[0], 0)), g.length, g.stack, g.active, editor, basePixelPos, lineHeightPixel, visibleScreenRange[0], scrollTop, scrollLeft);
          };
        }));
      };
      handleEvents = (function(_this) {
        return function(editor, editorElement) {
          var delayedUpdate, subscriptions, up;
          up = function() {
            updateGuide(editor, editorElement);
            return _this.busy = false;
          };
          delayedUpdate = function() {
            if (!_this.busy) {
              _this.busy = true;
              return requestAnimationFrame(up);
            }
          };
          subscriptions = new CompositeDisposable;
          subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem(function(item) {
            if (item === editor) {
              return delayedUpdate();
            }
          }));
          subscriptions.add(atom.config.onDidChange('editor.fontSize', delayedUpdate));
          subscriptions.add(atom.config.onDidChange('editor.fontFamily', delayedUpdate));
          subscriptions.add(atom.config.onDidChange('editor.lineHeight', delayedUpdate));
          subscriptions.add(editor.onDidChangeCursorPosition(delayedUpdate));
          subscriptions.add(editorElement.onDidChangeScrollTop(delayedUpdate));
          subscriptions.add(editorElement.onDidChangeScrollLeft(delayedUpdate));
          subscriptions.add(editor.onDidStopChanging(delayedUpdate));
          subscriptions.add(editor.onDidDestroy(function() {
            _this.currentSubscriptions.splice(_this.currentSubscriptions.indexOf(subscriptions), 1);
            return subscriptions.dispose();
          }));
          return _this.currentSubscriptions.push(subscriptions);
        };
      })(this);
      return atom.workspace.observeTextEditors(function(editor) {
        var editorElement;
        if (editor == null) {
          return;
        }
        editorElement = atom.views.getView(editor);
        if (editorElement == null) {
          return;
        }
        handleEvents(editor, editorElement);
        return updateGuide(editor, editorElement);
      });
    },
    deactivate: function() {
      this.currentSubscriptions.forEach(function(s) {
        return s.dispose();
      });
      return atom.workspace.getTextEditors().forEach(function(te) {
        var v;
        v = atom.views.getView(te);
        if (!v) {
          return;
        }
        return Array.prototype.forEach.call(v.querySelectorAll('.indent-guide-improved'), function(e) {
          return e.parentNode.removeChild(e);
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9pbmRlbnQtZ3VpZGUtaW1wcm92ZWQvbGliL2luZGVudC1ndWlkZS1pbXByb3ZlZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQStCLE9BQUEsQ0FBUSxNQUFSLENBQS9CLEVBQUMsNkNBQUQsRUFBc0I7O0VBRXRCLE9BQXdDLE9BQUEsQ0FBUSxpQ0FBUixDQUF4QyxFQUFDLHNEQUFELEVBQTBCOztFQUN6QixZQUFhLE9BQUEsQ0FBUSxpQkFBUjs7RUFFZCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtBQUNSLFVBQUE7TUFBQSxJQUFDLENBQUEsb0JBQUQsR0FBd0I7TUFDeEIsSUFBQyxDQUFBLElBQUQsR0FBUTtNQUdSLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsS0FBMUM7TUFFQSxXQUFBLEdBQWMsU0FBQyxDQUFELEVBQUksQ0FBSjtRQUNiLENBQUEsR0FBTyxLQUFBLENBQU0sQ0FBTixDQUFILEdBQWlCLENBQWpCLEdBQXdCO1FBQzVCLENBQUEsR0FBTyxLQUFBLENBQU0sQ0FBTixDQUFILEdBQWlCLENBQWpCLEdBQXdCO2VBQ3hCLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFUO01BSFM7TUFLZCxXQUFBLEdBQWMsU0FBQyxNQUFELEVBQVMsYUFBVDtBQUNaLFlBQUE7UUFBQSxrQkFBQSxHQUFxQixhQUFhLENBQUMsa0JBQWQsQ0FBQTtRQUNyQixJQUFBLENBQUEsQ0FBYyw0QkFBQSxJQUF3QixhQUFhLENBQUMsU0FBUyxDQUFDLE9BQTlELENBQUE7QUFBQSxpQkFBQTs7UUFDQSxZQUFBLEdBQWUsYUFBYSxDQUFDLDhCQUFkLENBQ2IsV0FBQSxDQUFZLGtCQUFtQixDQUFBLENBQUEsQ0FBL0IsRUFBbUMsQ0FB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UyxDQUFDLE9BQU8sQ0FBQyxJQUF4QixDQUE2QixDQUFDLENBQUMsZ0JBQUYsQ0FBbUIsd0JBQW5CLENBQTdCLEVBQTJFLFNBQUMsQ0FBRDtpQkFDekUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFiLENBQXlCLENBQXpCO1FBRHlFLENBQTNFO01BSHNDLENBQXhDO0lBSFUsQ0FqRlo7O0FBTkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgUG9pbnR9ID0gcmVxdWlyZSAnYXRvbSdcblxue2NyZWF0ZUVsZW1lbnRzRm9yR3VpZGVzLCBzdHlsZUd1aWRlfSA9IHJlcXVpcmUgJy4vaW5kZW50LWd1aWRlLWltcHJvdmVkLWVsZW1lbnQnXG57Z2V0R3VpZGVzfSA9IHJlcXVpcmUgJy4vZ3VpZGVzLmNvZmZlZSdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBjdXJyZW50U3Vic2NyaXB0aW9ucyA9IFtdXG4gICAgQGJ1c3kgPSBmYWxzZVxuXG4gICAgIyBUaGUgb3JpZ2luYWwgaW5kZW50IGd1aWRlcyBpbnRlcmZlcmUgd2l0aCB0aGlzIHBhY2thZ2UuXG4gICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3Iuc2hvd0luZGVudEd1aWRlJywgZmFsc2UpXG5cbiAgICBjcmVhdGVQb2ludCA9ICh4LCB5KSAtPlxuICAgIFx0eCA9IGlmIGlzTmFOKHgpIHRoZW4gMCBlbHNlIHhcbiAgICBcdHkgPSBpZiBpc05hTih5KSB0aGVuIDAgZWxzZSB5XG4gICAgXHRuZXcgUG9pbnQoeCwgeSlcblxuICAgIHVwZGF0ZUd1aWRlID0gKGVkaXRvciwgZWRpdG9yRWxlbWVudCkgLT5cbiAgICAgIHZpc2libGVTY3JlZW5SYW5nZSA9IGVkaXRvckVsZW1lbnQuZ2V0VmlzaWJsZVJvd1JhbmdlKClcbiAgICAgIHJldHVybiB1bmxlc3MgdmlzaWJsZVNjcmVlblJhbmdlPyBhbmQgZWRpdG9yRWxlbWVudC5jb21wb25lbnQudmlzaWJsZVxuICAgICAgYmFzZVBpeGVsUG9zID0gZWRpdG9yRWxlbWVudC5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oXG4gICAgICAgIGNyZWF0ZVBvaW50KHZpc2libGVTY3JlZW5SYW5nZVswXSwgMCkpLnRvcFxuICAgICAgdmlzaWJsZVJhbmdlID0gdmlzaWJsZVNjcmVlblJhbmdlLm1hcCAocm93KSAtPlxuICAgICAgICBlZGl0b3IuYnVmZmVyUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihjcmVhdGVQb2ludChyb3csIDApKS5yb3dcbiAgICAgIGdldEluZGVudCA9IChyb3cpIC0+XG4gICAgICAgIGlmIGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpLm1hdGNoKC9eXFxzKiQvKVxuICAgICAgICAgIG51bGxcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhyb3cpXG4gICAgICBzY3JvbGxUb3AgPSBlZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpXG4gICAgICBzY3JvbGxMZWZ0ID0gZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxMZWZ0KClcbiAgICAgIGd1aWRlcyA9IGdldEd1aWRlcyhcbiAgICAgICAgdmlzaWJsZVJhbmdlWzBdLFxuICAgICAgICB2aXNpYmxlUmFuZ2VbMV0sXG4gICAgICAgIGVkaXRvci5nZXRMYXN0QnVmZmVyUm93KCksXG4gICAgICAgIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKS5tYXAoKHBvaW50KSAtPiBwb2ludC5yb3cpLFxuICAgICAgICBnZXRJbmRlbnQpXG4gICAgICBsaW5lSGVpZ2h0UGl4ZWwgPSBlZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKClcbiAgICAgIGNyZWF0ZUVsZW1lbnRzRm9yR3VpZGVzKGVkaXRvckVsZW1lbnQsIGd1aWRlcy5tYXAgKGcpIC0+XG4gICAgICAgIChlbCkgLT4gc3R5bGVHdWlkZShcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBnLnBvaW50LnRyYW5zbGF0ZShjcmVhdGVQb2ludCh2aXNpYmxlUmFuZ2VbMF0sIDApKSxcbiAgICAgICAgICBnLmxlbmd0aCxcbiAgICAgICAgICBnLnN0YWNrLFxuICAgICAgICAgIGcuYWN0aXZlLFxuICAgICAgICAgIGVkaXRvcixcbiAgICAgICAgICBiYXNlUGl4ZWxQb3MsXG4gICAgICAgICAgbGluZUhlaWdodFBpeGVsLFxuICAgICAgICAgIHZpc2libGVTY3JlZW5SYW5nZVswXSxcbiAgICAgICAgICBzY3JvbGxUb3AsXG4gICAgICAgICAgc2Nyb2xsTGVmdCkpXG5cblxuICAgIGhhbmRsZUV2ZW50cyA9IChlZGl0b3IsIGVkaXRvckVsZW1lbnQpID0+XG4gICAgICB1cCA9ICgpID0+XG4gICAgICAgIHVwZGF0ZUd1aWRlKGVkaXRvciwgZWRpdG9yRWxlbWVudClcbiAgICAgICAgQGJ1c3kgPSBmYWxzZVxuXG4gICAgICBkZWxheWVkVXBkYXRlID0gPT5cbiAgICAgICAgdW5sZXNzIEBidXN5XG4gICAgICAgICAgQGJ1c3kgPSB0cnVlXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwKVxuXG4gICAgICBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkU3RvcENoYW5naW5nQWN0aXZlUGFuZUl0ZW0oKGl0ZW0pIC0+XG4gICAgICAgIGRlbGF5ZWRVcGRhdGUoKSBpZiBpdGVtID09IGVkaXRvclxuICAgICAgKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2VkaXRvci5mb250U2l6ZScsIGRlbGF5ZWRVcGRhdGUpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnZWRpdG9yLmZvbnRGYW1pbHknLCBkZWxheWVkVXBkYXRlKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2VkaXRvci5saW5lSGVpZ2h0JywgZGVsYXllZFVwZGF0ZSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKGRlbGF5ZWRVcGRhdGUpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCBlZGl0b3JFbGVtZW50Lm9uRGlkQ2hhbmdlU2Nyb2xsVG9wKGRlbGF5ZWRVcGRhdGUpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCBlZGl0b3JFbGVtZW50Lm9uRGlkQ2hhbmdlU2Nyb2xsTGVmdChkZWxheWVkVXBkYXRlKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yLm9uRGlkU3RvcENoYW5naW5nKGRlbGF5ZWRVcGRhdGUpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCBlZGl0b3Iub25EaWREZXN0cm95ID0+XG4gICAgICAgIEBjdXJyZW50U3Vic2NyaXB0aW9ucy5zcGxpY2UoQGN1cnJlbnRTdWJzY3JpcHRpb25zLmluZGV4T2Yoc3Vic2NyaXB0aW9ucyksIDEpXG4gICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICBAY3VycmVudFN1YnNjcmlwdGlvbnMucHVzaChzdWJzY3JpcHRpb25zKVxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpIC0+XG4gICAgICByZXR1cm4gdW5sZXNzIGVkaXRvcj9cbiAgICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgICAgcmV0dXJuIHVubGVzcyBlZGl0b3JFbGVtZW50P1xuICAgICAgaGFuZGxlRXZlbnRzKGVkaXRvciwgZWRpdG9yRWxlbWVudClcbiAgICAgIHVwZGF0ZUd1aWRlKGVkaXRvciwgZWRpdG9yRWxlbWVudClcblxuICBkZWFjdGl2YXRlOiAoKSAtPlxuICAgIEBjdXJyZW50U3Vic2NyaXB0aW9ucy5mb3JFYWNoIChzKSAtPlxuICAgICAgcy5kaXNwb3NlKClcbiAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2ggKHRlKSAtPlxuICAgICAgdiA9IGF0b20udmlld3MuZ2V0Vmlldyh0ZSlcbiAgICAgIHJldHVybiB1bmxlc3MgdlxuICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbCh2LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbmRlbnQtZ3VpZGUtaW1wcm92ZWQnKSwgKGUpIC0+XG4gICAgICAgIGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlKVxuICAgICAgKVxuIl19
