(function() {
  var CompositeDisposable, HighlightLineView, Point, lines,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  Point = require('atom').Point;

  lines = [];

  module.exports = HighlightLineView = (function() {
    function HighlightLineView() {
      this.observeSettings = bind(this.observeSettings, this);
      this.createDecoration = bind(this.createDecoration, this);
      this.handleMultiLine = bind(this.handleMultiLine, this);
      this.handleSingleLine = bind(this.handleSingleLine, this);
      this.showHighlight = bind(this.showHighlight, this);
      this.updateSelectedLine = bind(this.updateSelectedLine, this);
      this.destroy = bind(this.destroy, this);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(activeEditor) {
          activeEditor.onDidAddSelection(_this.updateSelectedLine);
          activeEditor.onDidChangeSelectionRange(_this.updateSelectedLine);
          return activeEditor.onDidRemoveSelection(_this.updateSelectedLine);
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(this.updateSelectedLine));
      this.markers = [];
      this.observeSettings();
      this.updateSelectedLine();
    }

    HighlightLineView.prototype.getEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightLineView.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    HighlightLineView.prototype.updateSelectedLine = function() {
      this.resetBackground();
      return this.showHighlight();
    };

    HighlightLineView.prototype.resetBackground = function() {
      var decoration, i, len, ref;
      ref = this.markers;
      for (i = 0, len = ref.length; i < len; i++) {
        decoration = ref[i];
        decoration.destroy();
        decoration = null;
      }
      return this.markers = [];
    };

    HighlightLineView.prototype.showHighlight = function() {
      if (!this.getEditor()) {
        return;
      }
      this.handleMultiLine();
      return this.handleSingleLine();
    };

    HighlightLineView.prototype.handleSingleLine = function() {
      var i, len, ref, results, selection, selectionRange, style;
      ref = this.getEditor().getSelections();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        selection = ref[i];
        if (selection.isSingleScreenLine()) {
          selectionRange = selection.getBufferRange();
          if (!(selection.getText() !== '' && atom.config.get("highlight-line.hideHighlightOnSelect"))) {
            if (atom.config.get('highlight-line.enableBackgroundColor')) {
              this.createDecoration(selectionRange);
            }
          }
          if (atom.config.get('highlight-line.enableUnderline')) {
            style = atom.config.get("highlight-line.underline");
            results.push(this.createDecoration(selectionRange, "-multi-line-" + style + "-bottom"));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    HighlightLineView.prototype.handleMultiLine = function() {
      var bottomLine, i, len, results, selection, selectionRange, selections, style, topLine;
      if (!atom.config.get('highlight-line.enableSelectionBorder')) {
        return;
      }
      selections = this.getEditor().getSelections();
      results = [];
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        if (!selection.isSingleScreenLine()) {
          selectionRange = selection.getBufferRange().copy();
          topLine = selectionRange;
          bottomLine = selectionRange.copy();
          topLine.end = topLine.start;
          bottomLine.start = new Point(bottomLine.end.row - 1, bottomLine.end.column);
          style = atom.config.get("highlight-line.underline");
          this.createDecoration(topLine, "-multi-line-" + style + "-top");
          results.push(this.createDecoration(bottomLine, "-multi-line-" + style + "-bottom"));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    HighlightLineView.prototype.createDecoration = function(range, klassToAdd) {
      var decoration, klass, marker;
      if (klassToAdd == null) {
        klassToAdd = '';
      }
      klass = 'highlight-line';
      klass += klassToAdd;
      marker = this.getEditor().markBufferRange(range);
      decoration = this.getEditor().decorateMarker(marker, {
        type: 'line',
        "class": klass
      });
      return this.markers.push(marker);
    };

    HighlightLineView.prototype.observeSettings = function() {
      this.subscriptions.add(atom.config.onDidChange("highlight-line.enableBackgroundColor", this.updateSelectedLine));
      this.subscriptions.add(atom.config.onDidChange("highlight-line.hideHighlightOnSelect", this.updateSelectedLine));
      this.subscriptions.add(atom.config.onDidChange("highlight-line.enableUnderline", this.updateSelectedLine));
      return this.subscriptions.add(atom.config.onDidChange("highlight-line.enableSelectionBorder", this.updateSelectedLine));
    };

    return HighlightLineView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtbGluZS9saWIvaGlnaGxpZ2h0LWxpbmUtbW9kZWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxvREFBQTtJQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDdkIsUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFFVixLQUFBLEdBQVE7O0VBRVIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVTLDJCQUFBOzs7Ozs7OztNQUNYLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFlBQUQ7VUFDbkQsWUFBWSxDQUFDLGlCQUFiLENBQStCLEtBQUMsQ0FBQSxrQkFBaEM7VUFDQSxZQUFZLENBQUMseUJBQWIsQ0FBdUMsS0FBQyxDQUFBLGtCQUF4QztpQkFDQSxZQUFZLENBQUMsb0JBQWIsQ0FBa0MsS0FBQyxDQUFBLGtCQUFuQztRQUhtRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBbkI7TUFLQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FDRSxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLElBQUMsQ0FBQSxrQkFBMUMsQ0FERjtNQUlBLElBQUMsQ0FBQSxPQUFELEdBQVc7TUFDWCxJQUFDLENBQUEsZUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLGtCQUFELENBQUE7SUFkVzs7Z0NBZ0JiLFNBQUEsR0FBVyxTQUFBO2FBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO0lBRFM7O2dDQUlYLE9BQUEsR0FBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7SUFETzs7Z0NBR1Qsa0JBQUEsR0FBb0IsU0FBQTtNQUNsQixJQUFDLENBQUEsZUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLGFBQUQsQ0FBQTtJQUZrQjs7Z0NBSXBCLGVBQUEsR0FBaUIsU0FBQTtBQUNmLFVBQUE7QUFBQTtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsVUFBVSxDQUFDLE9BQVgsQ0FBQTtRQUNBLFVBQUEsR0FBYTtBQUZmO2FBR0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUpJOztnQ0FNakIsYUFBQSxHQUFlLFNBQUE7TUFDYixJQUFBLENBQWMsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFkO0FBQUEsZUFBQTs7TUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLGdCQUFELENBQUE7SUFIYTs7Z0NBS2YsZ0JBQUEsR0FBa0IsU0FBQTtBQUNoQixVQUFBO0FBQUE7QUFBQTtXQUFBLHFDQUFBOztRQUNFLElBQUcsU0FBUyxDQUFDLGtCQUFWLENBQUEsQ0FBSDtVQUNFLGNBQUEsR0FBaUIsU0FBUyxDQUFDLGNBQVYsQ0FBQTtVQUNqQixJQUFBLENBQUEsQ0FBTyxTQUFTLENBQUMsT0FBVixDQUFBLENBQUEsS0FBeUIsRUFBekIsSUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBREosQ0FBQTtZQUVFLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQUFIO2NBQ0UsSUFBQyxDQUFBLGdCQUFELENBQWtCLGNBQWxCLEVBREY7YUFGRjs7VUFLQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsQ0FBSDtZQUNFLEtBQUEsR0FBUSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCO3lCQUNSLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixjQUFsQixFQUNFLGNBQUEsR0FBZSxLQUFmLEdBQXFCLFNBRHZCLEdBRkY7V0FBQSxNQUFBO2lDQUFBO1dBUEY7U0FBQSxNQUFBOytCQUFBOztBQURGOztJQURnQjs7Z0NBY2xCLGVBQUEsR0FBaUIsU0FBQTtBQUNmLFVBQUE7TUFBQSxJQUFBLENBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQUFkO0FBQUEsZUFBQTs7TUFFQSxVQUFBLEdBQWEsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFZLENBQUMsYUFBYixDQUFBO0FBQ2I7V0FBQSw0Q0FBQTs7UUFDRSxJQUFBLENBQU8sU0FBUyxDQUFDLGtCQUFWLENBQUEsQ0FBUDtVQUNFLGNBQUEsR0FBaUIsU0FBUyxDQUFDLGNBQVYsQ0FBQSxDQUEwQixDQUFDLElBQTNCLENBQUE7VUFDakIsT0FBQSxHQUFVO1VBQ1YsVUFBQSxHQUFhLGNBQWMsQ0FBQyxJQUFmLENBQUE7VUFFYixPQUFPLENBQUMsR0FBUixHQUFjLE9BQU8sQ0FBQztVQUN0QixVQUFVLENBQUMsS0FBWCxHQUFtQixJQUFJLEtBQUosQ0FBVSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQWYsR0FBcUIsQ0FBL0IsRUFDVSxVQUFVLENBQUMsR0FBRyxDQUFDLE1BRHpCO1VBR25CLEtBQUEsR0FBUSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCO1VBRVIsSUFBQyxDQUFBLGdCQUFELENBQWtCLE9BQWxCLEVBQ0UsY0FBQSxHQUFlLEtBQWYsR0FBcUIsTUFEdkI7dUJBRUEsSUFBQyxDQUFBLGdCQUFELENBQWtCLFVBQWxCLEVBQ0UsY0FBQSxHQUFlLEtBQWYsR0FBcUIsU0FEdkIsR0FiRjtTQUFBLE1BQUE7K0JBQUE7O0FBREY7O0lBSmU7O2dDQXFCakIsZ0JBQUEsR0FBa0IsU0FBQyxLQUFELEVBQVEsVUFBUjtBQUNoQixVQUFBOztRQUR3QixhQUFhOztNQUNyQyxLQUFBLEdBQVE7TUFDUixLQUFBLElBQVM7TUFDVCxNQUFBLEdBQVMsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFZLENBQUMsZUFBYixDQUE2QixLQUE3QjtNQUNULFVBQUEsR0FBYSxJQUFDLENBQUEsU0FBRCxDQUFBLENBQ1gsQ0FBQyxjQURVLENBQ0ssTUFETCxFQUNhO1FBQUMsSUFBQSxFQUFNLE1BQVA7UUFBZSxDQUFBLEtBQUEsQ0FBQSxFQUFPLEtBQXRCO09BRGI7YUFHYixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxNQUFkO0lBUGdCOztnQ0FTbEIsZUFBQSxHQUFpQixTQUFBO01BQ2YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUNqQixzQ0FEaUIsRUFDdUIsSUFBQyxDQUFBLGtCQUR4QixDQUFuQjtNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FDakIsc0NBRGlCLEVBQ3VCLElBQUMsQ0FBQSxrQkFEeEIsQ0FBbkI7TUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQ2pCLGdDQURpQixFQUNpQixJQUFDLENBQUEsa0JBRGxCLENBQW5CO2FBRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUNqQixzQ0FEaUIsRUFDdUIsSUFBQyxDQUFBLGtCQUR4QixDQUFuQjtJQVBlOzs7OztBQTFGbkIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue1BvaW50fSA9IHJlcXVpcmUgJ2F0b20nXG5cbmxpbmVzID0gW11cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgSGlnaGxpZ2h0TGluZVZpZXdcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChhY3RpdmVFZGl0b3IpID0+XG4gICAgICBhY3RpdmVFZGl0b3Iub25EaWRBZGRTZWxlY3Rpb24oQHVwZGF0ZVNlbGVjdGVkTGluZSlcbiAgICAgIGFjdGl2ZUVkaXRvci5vbkRpZENoYW5nZVNlbGVjdGlvblJhbmdlKEB1cGRhdGVTZWxlY3RlZExpbmUpXG4gICAgICBhY3RpdmVFZGl0b3Iub25EaWRSZW1vdmVTZWxlY3Rpb24oQHVwZGF0ZVNlbGVjdGVkTGluZSlcbiAgICApKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oQHVwZGF0ZVNlbGVjdGVkTGluZSlcbiAgICApXG5cbiAgICBAbWFya2VycyA9IFtdXG4gICAgQG9ic2VydmVTZXR0aW5ncygpXG4gICAgQHVwZGF0ZVNlbGVjdGVkTGluZSgpXG5cbiAgZ2V0RWRpdG9yOiAtPlxuICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICMgVGVhciBkb3duIGFueSBzdGF0ZSBhbmQgZGV0YWNoXG4gIGRlc3Ryb3k6ID0+XG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbiAgdXBkYXRlU2VsZWN0ZWRMaW5lOiA9PlxuICAgIEByZXNldEJhY2tncm91bmQoKVxuICAgIEBzaG93SGlnaGxpZ2h0KClcblxuICByZXNldEJhY2tncm91bmQ6IC0+XG4gICAgZm9yIGRlY29yYXRpb24gaW4gQG1hcmtlcnNcbiAgICAgIGRlY29yYXRpb24uZGVzdHJveSgpXG4gICAgICBkZWNvcmF0aW9uID0gbnVsbFxuICAgIEBtYXJrZXJzID0gW11cblxuICBzaG93SGlnaGxpZ2h0OiA9PlxuICAgIHJldHVybiB1bmxlc3MgQGdldEVkaXRvcigpXG4gICAgQGhhbmRsZU11bHRpTGluZSgpXG4gICAgQGhhbmRsZVNpbmdsZUxpbmUoKVxuXG4gIGhhbmRsZVNpbmdsZUxpbmU6ID0+XG4gICAgZm9yIHNlbGVjdGlvbiBpbiBAZ2V0RWRpdG9yKCkuZ2V0U2VsZWN0aW9ucygpXG4gICAgICBpZiBzZWxlY3Rpb24uaXNTaW5nbGVTY3JlZW5MaW5lKClcbiAgICAgICAgc2VsZWN0aW9uUmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgICB1bmxlc3Mgc2VsZWN0aW9uLmdldFRleHQoKSBpc250ICcnIFxcXG4gICAgICAgIGFuZCBhdG9tLmNvbmZpZy5nZXQoXCJoaWdobGlnaHQtbGluZS5oaWRlSGlnaGxpZ2h0T25TZWxlY3RcIilcbiAgICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1saW5lLmVuYWJsZUJhY2tncm91bmRDb2xvcicpXG4gICAgICAgICAgICBAY3JlYXRlRGVjb3JhdGlvbihzZWxlY3Rpb25SYW5nZSlcblxuICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1saW5lLmVuYWJsZVVuZGVybGluZScpXG4gICAgICAgICAgc3R5bGUgPSBhdG9tLmNvbmZpZy5nZXQgXCJoaWdobGlnaHQtbGluZS51bmRlcmxpbmVcIlxuICAgICAgICAgIEBjcmVhdGVEZWNvcmF0aW9uKHNlbGVjdGlvblJhbmdlLFxuICAgICAgICAgICAgXCItbXVsdGktbGluZS0je3N0eWxlfS1ib3R0b21cIilcblxuICBoYW5kbGVNdWx0aUxpbmU6ID0+XG4gICAgcmV0dXJuIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1saW5lLmVuYWJsZVNlbGVjdGlvbkJvcmRlcicpXG5cbiAgICBzZWxlY3Rpb25zID0gQGdldEVkaXRvcigpLmdldFNlbGVjdGlvbnMoKVxuICAgIGZvciBzZWxlY3Rpb24gaW4gc2VsZWN0aW9uc1xuICAgICAgdW5sZXNzIHNlbGVjdGlvbi5pc1NpbmdsZVNjcmVlbkxpbmUoKVxuICAgICAgICBzZWxlY3Rpb25SYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLmNvcHkoKVxuICAgICAgICB0b3BMaW5lID0gc2VsZWN0aW9uUmFuZ2VcbiAgICAgICAgYm90dG9tTGluZSA9IHNlbGVjdGlvblJhbmdlLmNvcHkoKVxuXG4gICAgICAgIHRvcExpbmUuZW5kID0gdG9wTGluZS5zdGFydFxuICAgICAgICBib3R0b21MaW5lLnN0YXJ0ID0gbmV3IFBvaW50KGJvdHRvbUxpbmUuZW5kLnJvdyAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tTGluZS5lbmQuY29sdW1uKVxuXG4gICAgICAgIHN0eWxlID0gYXRvbS5jb25maWcuZ2V0IFwiaGlnaGxpZ2h0LWxpbmUudW5kZXJsaW5lXCJcblxuICAgICAgICBAY3JlYXRlRGVjb3JhdGlvbih0b3BMaW5lLFxuICAgICAgICAgIFwiLW11bHRpLWxpbmUtI3tzdHlsZX0tdG9wXCIpXG4gICAgICAgIEBjcmVhdGVEZWNvcmF0aW9uKGJvdHRvbUxpbmUsXG4gICAgICAgICAgXCItbXVsdGktbGluZS0je3N0eWxlfS1ib3R0b21cIilcblxuICBjcmVhdGVEZWNvcmF0aW9uOiAocmFuZ2UsIGtsYXNzVG9BZGQgPSAnJykgPT5cbiAgICBrbGFzcyA9ICdoaWdobGlnaHQtbGluZSdcbiAgICBrbGFzcyArPSBrbGFzc1RvQWRkXG4gICAgbWFya2VyID0gQGdldEVkaXRvcigpLm1hcmtCdWZmZXJSYW5nZShyYW5nZSlcbiAgICBkZWNvcmF0aW9uID0gQGdldEVkaXRvcigpXG4gICAgICAuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUnLCBjbGFzczoga2xhc3N9KVxuXG4gICAgQG1hcmtlcnMucHVzaCBtYXJrZXJcblxuICBvYnNlcnZlU2V0dGluZ3M6ID0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKFxuICAgICAgXCJoaWdobGlnaHQtbGluZS5lbmFibGVCYWNrZ3JvdW5kQ29sb3JcIiwgQHVwZGF0ZVNlbGVjdGVkTGluZSlcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoXG4gICAgICBcImhpZ2hsaWdodC1saW5lLmhpZGVIaWdobGlnaHRPblNlbGVjdFwiLCBAdXBkYXRlU2VsZWN0ZWRMaW5lKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShcbiAgICAgIFwiaGlnaGxpZ2h0LWxpbmUuZW5hYmxlVW5kZXJsaW5lXCIsIEB1cGRhdGVTZWxlY3RlZExpbmUpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKFxuICAgICAgXCJoaWdobGlnaHQtbGluZS5lbmFibGVTZWxlY3Rpb25Cb3JkZXJcIiwgQHVwZGF0ZVNlbGVjdGVkTGluZSlcbiJdfQ==
