(function() {
  var CompositeDisposable, Emitter, HighlightedAreaView, MarkerLayer, Range, StatusBarView, escapeRegExp, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ref = require('atom'), Range = ref.Range, CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter, MarkerLayer = ref.MarkerLayer;

  StatusBarView = require('./status-bar-view');

  escapeRegExp = require('./escape-reg-exp');

  module.exports = HighlightedAreaView = (function() {
    function HighlightedAreaView() {
      this.listenForStatusBarChange = bind(this.listenForStatusBarChange, this);
      this.removeStatusBar = bind(this.removeStatusBar, this);
      this.setupStatusBar = bind(this.setupStatusBar, this);
      this.removeMarkers = bind(this.removeMarkers, this);
      this.handleSelection = bind(this.handleSelection, this);
      this.debouncedHandleSelection = bind(this.debouncedHandleSelection, this);
      this.setStatusBar = bind(this.setStatusBar, this);
      this.enable = bind(this.enable, this);
      this.disable = bind(this.disable, this);
      this.onDidRemoveAllMarkers = bind(this.onDidRemoveAllMarkers, this);
      this.onDidAddSelectedMarkerForEditor = bind(this.onDidAddSelectedMarkerForEditor, this);
      this.onDidAddMarkerForEditor = bind(this.onDidAddMarkerForEditor, this);
      this.onDidAddSelectedMarker = bind(this.onDidAddSelectedMarker, this);
      this.onDidAddMarker = bind(this.onDidAddMarker, this);
      this.destroy = bind(this.destroy, this);
      this.emitter = new Emitter;
      this.markerLayers = [];
      this.resultCount = 0;
      this.enable();
      this.listenForTimeoutChange();
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.debouncedHandleSelection();
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.subscribeToActiveTextEditor();
      this.listenForStatusBarChange();
    }

    HighlightedAreaView.prototype.destroy = function() {
      var ref1, ref2, ref3;
      clearTimeout(this.handleSelectionTimeout);
      this.activeItemSubscription.dispose();
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.statusBarView) != null) {
        ref2.removeElement();
      }
      if ((ref3 = this.statusBarTile) != null) {
        ref3.destroy();
      }
      return this.statusBarTile = null;
    };

    HighlightedAreaView.prototype.onDidAddMarker = function(callback) {
      var Grim;
      Grim = require('grim');
      Grim.deprecate("Please do not use. This method will be removed.");
      return this.emitter.on('did-add-marker', callback);
    };

    HighlightedAreaView.prototype.onDidAddSelectedMarker = function(callback) {
      var Grim;
      Grim = require('grim');
      Grim.deprecate("Please do not use. This method will be removed.");
      return this.emitter.on('did-add-selected-marker', callback);
    };

    HighlightedAreaView.prototype.onDidAddMarkerForEditor = function(callback) {
      return this.emitter.on('did-add-marker-for-editor', callback);
    };

    HighlightedAreaView.prototype.onDidAddSelectedMarkerForEditor = function(callback) {
      return this.emitter.on('did-add-selected-marker-for-editor', callback);
    };

    HighlightedAreaView.prototype.onDidRemoveAllMarkers = function(callback) {
      return this.emitter.on('did-remove-marker-layer', callback);
    };

    HighlightedAreaView.prototype.disable = function() {
      this.disabled = true;
      return this.removeMarkers();
    };

    HighlightedAreaView.prototype.enable = function() {
      this.disabled = false;
      return this.debouncedHandleSelection();
    };

    HighlightedAreaView.prototype.setStatusBar = function(statusBar) {
      this.statusBar = statusBar;
      return this.setupStatusBar();
    };

    HighlightedAreaView.prototype.debouncedHandleSelection = function() {
      clearTimeout(this.handleSelectionTimeout);
      return this.handleSelectionTimeout = setTimeout((function(_this) {
        return function() {
          return _this.handleSelection();
        };
      })(this), atom.config.get('highlight-selected.timeout'));
    };

    HighlightedAreaView.prototype.listenForTimeoutChange = function() {
      return atom.config.onDidChange('highlight-selected.timeout', (function(_this) {
        return function() {
          return _this.debouncedHandleSelection();
        };
      })(this));
    };

    HighlightedAreaView.prototype.subscribeToActiveTextEditor = function() {
      var editor, ref1;
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      this.selectionSubscription = new CompositeDisposable;
      this.selectionSubscription.add(editor.onDidAddSelection(this.debouncedHandleSelection));
      this.selectionSubscription.add(editor.onDidChangeSelectionRange(this.debouncedHandleSelection));
      return this.handleSelection();
    };

    HighlightedAreaView.prototype.getActiveEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightedAreaView.prototype.getActiveEditors = function() {
      return atom.workspace.getPanes().map(function(pane) {
        var activeItem;
        activeItem = pane.activeItem;
        if (activeItem && activeItem.constructor.name === 'TextEditor') {
          return activeItem;
        }
      });
    };

    HighlightedAreaView.prototype.handleSelection = function() {
      var editor, ref1, ref2, ref3, regex, regexFlags, regexSearch, result, text;
      this.removeMarkers();
      if (this.disabled) {
        return;
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      if (editor.getLastSelection().isEmpty()) {
        return;
      }
      if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
        if (!this.isWordSelected(editor.getLastSelection())) {
          return;
        }
      }
      this.selections = editor.getSelections();
      text = escapeRegExp(this.selections[0].getText());
      regex = new RegExp("\\S*\\w*\\b", 'gi');
      result = regex.exec(text);
      if (result == null) {
        return;
      }
      if (result[0].length < atom.config.get('highlight-selected.minimumLength') || result.index !== 0 || result[0] !== result.input) {
        return;
      }
      regexFlags = 'g';
      if (atom.config.get('highlight-selected.ignoreCase')) {
        regexFlags = 'gi';
      }
      this.ranges = [];
      regexSearch = result[0];
      if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
        if (regexSearch.indexOf("\$") !== -1 && ((ref1 = (ref2 = editor.getGrammar()) != null ? ref2.name : void 0) === 'PHP' || ref1 === 'HACK')) {
          regexSearch = regexSearch.replace("\$", "\$\\b");
        } else {
          regexSearch = "\\b" + regexSearch;
        }
        regexSearch = regexSearch + "\\b";
      }
      this.resultCount = 0;
      if (atom.config.get('highlight-selected.highlightInPanes')) {
        this.getActiveEditors().forEach((function(_this) {
          return function(editor) {
            return _this.highlightSelectionInEditor(editor, regexSearch, regexFlags);
          };
        })(this));
      } else {
        this.highlightSelectionInEditor(editor, regexSearch, regexFlags);
      }
      return (ref3 = this.statusBarElement) != null ? ref3.updateCount(this.resultCount) : void 0;
    };

    HighlightedAreaView.prototype.highlightSelectionInEditor = function(editor, regexSearch, regexFlags) {
      var markerLayer, markerLayerForHiddenMarkers, range;
      markerLayer = editor != null ? editor.addMarkerLayer() : void 0;
      if (markerLayer == null) {
        return;
      }
      markerLayerForHiddenMarkers = editor.addMarkerLayer();
      this.markerLayers.push(markerLayer);
      this.markerLayers.push(markerLayerForHiddenMarkers);
      range = [[0, 0], editor.getEofBufferPosition()];
      editor.scanInBufferRange(new RegExp(regexSearch, regexFlags), range, (function(_this) {
        return function(result) {
          var marker;
          _this.resultCount += 1;
          if (_this.showHighlightOnSelectedWord(result.range, _this.selections)) {
            marker = markerLayerForHiddenMarkers.markBufferRange(result.range);
            _this.emitter.emit('did-add-selected-marker', marker);
            return _this.emitter.emit('did-add-selected-marker-for-editor', {
              marker: marker,
              editor: editor
            });
          } else {
            marker = markerLayer.markBufferRange(result.range);
            _this.emitter.emit('did-add-marker', marker);
            return _this.emitter.emit('did-add-marker-for-editor', {
              marker: marker,
              editor: editor
            });
          }
        };
      })(this));
      return editor.decorateMarkerLayer(markerLayer, {
        type: 'highlight',
        "class": this.makeClasses()
      });
    };

    HighlightedAreaView.prototype.makeClasses = function() {
      var className;
      className = 'highlight-selected';
      if (atom.config.get('highlight-selected.lightTheme')) {
        className += ' light-theme';
      }
      if (atom.config.get('highlight-selected.highlightBackground')) {
        className += ' background';
      }
      return className;
    };

    HighlightedAreaView.prototype.showHighlightOnSelectedWord = function(range, selections) {
      var i, len, outcome, selection, selectionRange;
      if (!atom.config.get('highlight-selected.hideHighlightOnSelectedWord')) {
        return false;
      }
      outcome = false;
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        selectionRange = selection.getBufferRange();
        outcome = (range.start.column === selectionRange.start.column) && (range.start.row === selectionRange.start.row) && (range.end.column === selectionRange.end.column) && (range.end.row === selectionRange.end.row);
        if (outcome) {
          break;
        }
      }
      return outcome;
    };

    HighlightedAreaView.prototype.removeMarkers = function() {
      var ref1;
      this.markerLayers.forEach(function(markerLayer) {
        return markerLayer.destroy();
      });
      this.markerLayers = [];
      if ((ref1 = this.statusBarElement) != null) {
        ref1.updateCount(0);
      }
      return this.emitter.emit('did-remove-marker-layer');
    };

    HighlightedAreaView.prototype.isWordSelected = function(selection) {
      var lineRange, nonWordCharacterToTheLeft, nonWordCharacterToTheRight, selectionRange;
      if (selection.getBufferRange().isSingleLine()) {
        selectionRange = selection.getBufferRange();
        lineRange = this.getActiveEditor().bufferRangeForBufferRow(selectionRange.start.row);
        nonWordCharacterToTheLeft = selectionRange.start.isEqual(lineRange.start) || this.isNonWordCharacterToTheLeft(selection);
        nonWordCharacterToTheRight = selectionRange.end.isEqual(lineRange.end) || this.isNonWordCharacterToTheRight(selection);
        return nonWordCharacterToTheLeft && nonWordCharacterToTheRight;
      } else {
        return false;
      }
    };

    HighlightedAreaView.prototype.isNonWordCharacter = function(character) {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp("[ \t" + (escapeRegExp(nonWordCharacters)) + "]").test(character);
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheLeft = function(selection) {
      var range, selectionStart;
      selectionStart = selection.getBufferRange().start;
      range = Range.fromPointWithDelta(selectionStart, 0, -1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheRight = function(selection) {
      var range, selectionEnd;
      selectionEnd = selection.getBufferRange().end;
      range = Range.fromPointWithDelta(selectionEnd, 0, 1);
      return this.isNonWordCharacter(this.getActiveEditor().getTextInBufferRange(range));
    };

    HighlightedAreaView.prototype.setupStatusBar = function() {
      if (this.statusBarElement != null) {
        return;
      }
      if (!atom.config.get('highlight-selected.showInStatusBar')) {
        return;
      }
      this.statusBarElement = new StatusBarView();
      return this.statusBarTile = this.statusBar.addLeftTile({
        item: this.statusBarElement.getElement(),
        priority: 100
      });
    };

    HighlightedAreaView.prototype.removeStatusBar = function() {
      var ref1;
      if (this.statusBarElement == null) {
        return;
      }
      if ((ref1 = this.statusBarTile) != null) {
        ref1.destroy();
      }
      this.statusBarTile = null;
      return this.statusBarElement = null;
    };

    HighlightedAreaView.prototype.listenForStatusBarChange = function() {
      return atom.config.onDidChange('highlight-selected.showInStatusBar', (function(_this) {
        return function(changed) {
          if (changed.newValue) {
            return _this.setupStatusBar();
          } else {
            return _this.removeStatusBar();
          }
        };
      })(this));
    };

    return HighlightedAreaView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtc2VsZWN0ZWQvbGliL2hpZ2hsaWdodGVkLWFyZWEtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHVHQUFBO0lBQUE7O0VBQUEsTUFBcUQsT0FBQSxDQUFRLE1BQVIsQ0FBckQsRUFBQyxpQkFBRCxFQUFRLDZDQUFSLEVBQTZCLHFCQUE3QixFQUFzQzs7RUFDdEMsYUFBQSxHQUFnQixPQUFBLENBQVEsbUJBQVI7O0VBQ2hCLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVTLDZCQUFBOzs7Ozs7Ozs7Ozs7Ozs7O01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxJQUFDLENBQUEsc0JBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNqRSxLQUFDLENBQUEsd0JBQUQsQ0FBQTtpQkFDQSxLQUFDLENBQUEsMkJBQUQsQ0FBQTtRQUZpRTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekM7TUFHMUIsSUFBQyxDQUFBLDJCQUFELENBQUE7TUFDQSxJQUFDLENBQUEsd0JBQUQsQ0FBQTtJQVZXOztrQ0FZYixPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxZQUFBLENBQWEsSUFBQyxDQUFBLHNCQUFkO01BQ0EsSUFBQyxDQUFBLHNCQUFzQixDQUFDLE9BQXhCLENBQUE7O1lBQ3NCLENBQUUsT0FBeEIsQ0FBQTs7O1lBQ2MsQ0FBRSxhQUFoQixDQUFBOzs7WUFD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QjthQUNqQixJQUFDLENBQUEsZ0JBQUQsR0FBb0I7SUFKTDs7a0NBTWpCLHdCQUFBLEdBQTBCLFNBQUE7YUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLG9DQUF4QixFQUE4RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRDtVQUM1RCxJQUFHLE9BQU8sQ0FBQyxRQUFYO21CQUNFLEtBQUMsQ0FBQSxjQUFELENBQUEsRUFERjtXQUFBLE1BQUE7bUJBR0UsS0FBQyxDQUFBLGVBQUQsQ0FBQSxFQUhGOztRQUQ0RDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUQ7SUFEd0I7Ozs7O0FBbFA1QiIsInNvdXJjZXNDb250ZW50IjpbIntSYW5nZSwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciwgTWFya2VyTGF5ZXJ9ID0gcmVxdWlyZSAnYXRvbSdcblN0YXR1c0JhclZpZXcgPSByZXF1aXJlICcuL3N0YXR1cy1iYXItdmlldydcbmVzY2FwZVJlZ0V4cCA9IHJlcXVpcmUgJy4vZXNjYXBlLXJlZy1leHAnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEhpZ2hsaWdodGVkQXJlYVZpZXdcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQG1hcmtlckxheWVycyA9IFtdXG4gICAgQHJlc3VsdENvdW50ID0gMFxuICAgIEBlbmFibGUoKVxuICAgIEBsaXN0ZW5Gb3JUaW1lb3V0Q2hhbmdlKClcbiAgICBAYWN0aXZlSXRlbVN1YnNjcmlwdGlvbiA9IGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0gPT5cbiAgICAgIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb24oKVxuICAgICAgQHN1YnNjcmliZVRvQWN0aXZlVGV4dEVkaXRvcigpXG4gICAgQHN1YnNjcmliZVRvQWN0aXZlVGV4dEVkaXRvcigpXG4gICAgQGxpc3RlbkZvclN0YXR1c0JhckNoYW5nZSgpXG5cbiAgZGVzdHJveTogPT5cbiAgICBjbGVhclRpbWVvdXQoQGhhbmRsZVNlbGVjdGlvblRpbWVvdXQpXG4gICAgQGFjdGl2ZUl0ZW1TdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQHN0YXR1c0JhclZpZXc/LnJlbW92ZUVsZW1lbnQoKVxuICAgIEBzdGF0dXNCYXJUaWxlPy5kZXN0cm95KClcbiAgICBAc3RhdHVzQmFyVGlsZSA9IG51bGxcblxuICBvbkRpZEFkZE1hcmtlcjogKGNhbGxiYWNrKSA9PlxuICAgIEdyaW0gPSByZXF1aXJlICdncmltJ1xuICAgIEdyaW0uZGVwcmVjYXRlKFwiUGxlYXNlIGRvIG5vdCB1c2UuIFRoaXMgbWV0aG9kIHdpbGwgYmUgcmVtb3ZlZC5cIilcbiAgICBAZW1pdHRlci5vbiAnZGlkLWFkZC1tYXJrZXInLCBjYWxsYmFja1xuXG4gIG9uRGlkQWRkU2VsZWN0ZWRNYXJrZXI6IChjYWxsYmFjaykgPT5cbiAgICBHcmltID0gcmVxdWlyZSAnZ3JpbSdcbiAgICBHcmltLmRlcHJlY2F0ZShcIlBsZWFzZSBkbyBub3QgdXNlLiBUaGlzIG1ldGhvZCB3aWxsIGJlIHJlbW92ZWQuXCIpXG4gICAgQGVtaXR0ZXIub24gJ2RpZC1hZGQtc2VsZWN0ZWQtbWFya2VyJywgY2FsbGJhY2tcblxuICBvbkRpZEFkZE1hcmtlckZvckVkaXRvcjogKGNhbGxiYWNrKSA9PlxuICAgIEBlbWl0dGVyLm9uICdkaWQtYWRkLW1hcmtlci1mb3ItZWRpdG9yJywgY2FsbGJhY2tcblxuICBvbkRpZEFkZFNlbGVjdGVkTWFya2VyRm9yRWRpdG9yOiAoY2FsbGJhY2spID0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1hZGQtc2VsZWN0ZWQtbWFya2VyLWZvci1lZGl0b3InLCBjYWxsYmFja1xuXG4gIG9uRGlkUmVtb3ZlQWxsTWFya2VyczogKGNhbGxiYWNrKSA9PlxuICAgIEBlbWl0dGVyLm9uICdkaWQtcmVtb3ZlLW1hcmtlci1sYXllcicsIGNhbGxiYWNrXG5cbiAgZGlzYWJsZTogPT5cbiAgICBAZGlzYWJsZWQgPSB0cnVlXG4gICAgQHJlbW92ZU1hcmtlcnMoKVxuXG4gIGVuYWJsZTogPT5cbiAgICBAZGlzYWJsZWQgPSBmYWxzZVxuICAgIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb24oKVxuXG4gIHNldFN0YXR1c0JhcjogKHN0YXR1c0JhcikgPT5cbiAgICBAc3RhdHVzQmFyID0gc3RhdHVzQmFyXG4gICAgQHNldHVwU3RhdHVzQmFyKClcblxuICBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb246ID0+XG4gICAgY2xlYXJUaW1lb3V0KEBoYW5kbGVTZWxlY3Rpb25UaW1lb3V0KVxuICAgIEBoYW5kbGVTZWxlY3Rpb25UaW1lb3V0ID0gc2V0VGltZW91dCA9PlxuICAgICAgQGhhbmRsZVNlbGVjdGlvbigpXG4gICAgLCBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC50aW1lb3V0JylcblxuICBsaXN0ZW5Gb3JUaW1lb3V0Q2hhbmdlOiAtPlxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdoaWdobGlnaHQtc2VsZWN0ZWQudGltZW91dCcsID0+XG4gICAgICBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uKClcblxuICBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3I6IC0+XG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG5cbiAgICBlZGl0b3IgPSBAZ2V0QWN0aXZlRWRpdG9yKClcbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvclxuXG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uLmFkZChcbiAgICAgIGVkaXRvci5vbkRpZEFkZFNlbGVjdGlvbiBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uXG4gICAgKVxuICAgIEBzZWxlY3Rpb25TdWJzY3JpcHRpb24uYWRkKFxuICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UgQGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvblxuICAgIClcbiAgICBAaGFuZGxlU2VsZWN0aW9uKClcblxuICBnZXRBY3RpdmVFZGl0b3I6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgZ2V0QWN0aXZlRWRpdG9yczogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpLm1hcCAocGFuZSkgLT5cbiAgICAgIGFjdGl2ZUl0ZW0gPSBwYW5lLmFjdGl2ZUl0ZW1cbiAgICAgIGFjdGl2ZUl0ZW0gaWYgYWN0aXZlSXRlbSBhbmQgYWN0aXZlSXRlbS5jb25zdHJ1Y3Rvci5uYW1lID09ICdUZXh0RWRpdG9yJ1xuXG4gIGhhbmRsZVNlbGVjdGlvbjogPT5cbiAgICBAcmVtb3ZlTWFya2VycygpXG5cbiAgICByZXR1cm4gaWYgQGRpc2FibGVkXG5cbiAgICBlZGl0b3IgPSBAZ2V0QWN0aXZlRWRpdG9yKClcblxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yXG4gICAgcmV0dXJuIGlmIGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuaXNFbXB0eSgpXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5vbmx5SGlnaGxpZ2h0V2hvbGVXb3JkcycpXG4gICAgICByZXR1cm4gdW5sZXNzIEBpc1dvcmRTZWxlY3RlZChlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpKVxuXG4gICAgQHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG5cbiAgICB0ZXh0ID0gZXNjYXBlUmVnRXhwKEBzZWxlY3Rpb25zWzBdLmdldFRleHQoKSlcbiAgICByZWdleCA9IG5ldyBSZWdFeHAoXCJcXFxcUypcXFxcdypcXFxcYlwiLCAnZ2knKVxuICAgIHJlc3VsdCA9IHJlZ2V4LmV4ZWModGV4dClcblxuICAgIHJldHVybiB1bmxlc3MgcmVzdWx0P1xuICAgIHJldHVybiBpZiByZXN1bHRbMF0ubGVuZ3RoIDwgYXRvbS5jb25maWcuZ2V0KFxuICAgICAgJ2hpZ2hsaWdodC1zZWxlY3RlZC5taW5pbXVtTGVuZ3RoJykgb3JcbiAgICAgICAgICAgICAgcmVzdWx0LmluZGV4IGlzbnQgMCBvclxuICAgICAgICAgICAgICByZXN1bHRbMF0gaXNudCByZXN1bHQuaW5wdXRcblxuICAgIHJlZ2V4RmxhZ3MgPSAnZydcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5pZ25vcmVDYXNlJylcbiAgICAgIHJlZ2V4RmxhZ3MgPSAnZ2knXG5cbiAgICBAcmFuZ2VzID0gW11cbiAgICByZWdleFNlYXJjaCA9IHJlc3VsdFswXVxuXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQub25seUhpZ2hsaWdodFdob2xlV29yZHMnKVxuICAgICAgaWYgcmVnZXhTZWFyY2guaW5kZXhPZihcIlxcJFwiKSBpc250IC0xIFxcXG4gICAgICBhbmQgZWRpdG9yLmdldEdyYW1tYXIoKT8ubmFtZSBpbiBbJ1BIUCcsICdIQUNLJ11cbiAgICAgICAgcmVnZXhTZWFyY2ggPSByZWdleFNlYXJjaC5yZXBsYWNlKFwiXFwkXCIsIFwiXFwkXFxcXGJcIilcbiAgICAgIGVsc2VcbiAgICAgICAgcmVnZXhTZWFyY2ggPSAgXCJcXFxcYlwiICsgcmVnZXhTZWFyY2hcbiAgICAgIHJlZ2V4U2VhcmNoID0gcmVnZXhTZWFyY2ggKyBcIlxcXFxiXCJcblxuICAgIEByZXN1bHRDb3VudCA9IDBcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5oaWdobGlnaHRJblBhbmVzJylcbiAgICAgIEBnZXRBY3RpdmVFZGl0b3JzKCkuZm9yRWFjaCAoZWRpdG9yKSA9PlxuICAgICAgICBAaGlnaGxpZ2h0U2VsZWN0aW9uSW5FZGl0b3IoZWRpdG9yLCByZWdleFNlYXJjaCwgcmVnZXhGbGFncylcbiAgICBlbHNlXG4gICAgICBAaGlnaGxpZ2h0U2VsZWN0aW9uSW5FZGl0b3IoZWRpdG9yLCByZWdleFNlYXJjaCwgcmVnZXhGbGFncylcblxuICAgIEBzdGF0dXNCYXJFbGVtZW50Py51cGRhdGVDb3VudChAcmVzdWx0Q291bnQpXG5cbiAgaGlnaGxpZ2h0U2VsZWN0aW9uSW5FZGl0b3I6IChlZGl0b3IsIHJlZ2V4U2VhcmNoLCByZWdleEZsYWdzKSAtPlxuICAgIG1hcmtlckxheWVyID0gZWRpdG9yPy5hZGRNYXJrZXJMYXllcigpXG4gICAgcmV0dXJuIHVubGVzcyBtYXJrZXJMYXllcj9cbiAgICBtYXJrZXJMYXllckZvckhpZGRlbk1hcmtlcnMgPSBlZGl0b3IuYWRkTWFya2VyTGF5ZXIoKVxuICAgIEBtYXJrZXJMYXllcnMucHVzaChtYXJrZXJMYXllcilcbiAgICBAbWFya2VyTGF5ZXJzLnB1c2gobWFya2VyTGF5ZXJGb3JIaWRkZW5NYXJrZXJzKVxuXG4gICAgcmFuZ2UgPSAgW1swLCAwXSwgZWRpdG9yLmdldEVvZkJ1ZmZlclBvc2l0aW9uKCldXG5cbiAgICBlZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UgbmV3IFJlZ0V4cChyZWdleFNlYXJjaCwgcmVnZXhGbGFncyksIHJhbmdlLFxuICAgICAgKHJlc3VsdCkgPT5cbiAgICAgICAgQHJlc3VsdENvdW50ICs9IDFcbiAgICAgICAgaWYgQHNob3dIaWdobGlnaHRPblNlbGVjdGVkV29yZChyZXN1bHQucmFuZ2UsIEBzZWxlY3Rpb25zKVxuICAgICAgICAgIG1hcmtlciA9IG1hcmtlckxheWVyRm9ySGlkZGVuTWFya2Vycy5tYXJrQnVmZmVyUmFuZ2UocmVzdWx0LnJhbmdlKVxuICAgICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1hZGQtc2VsZWN0ZWQtbWFya2VyJywgbWFya2VyXG4gICAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC1zZWxlY3RlZC1tYXJrZXItZm9yLWVkaXRvcicsXG4gICAgICAgICAgICBtYXJrZXI6IG1hcmtlclxuICAgICAgICAgICAgZWRpdG9yOiBlZGl0b3JcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG1hcmtlciA9IG1hcmtlckxheWVyLm1hcmtCdWZmZXJSYW5nZShyZXN1bHQucmFuZ2UpXG4gICAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC1tYXJrZXInLCBtYXJrZXJcbiAgICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLW1hcmtlci1mb3ItZWRpdG9yJyxcbiAgICAgICAgICAgIG1hcmtlcjogbWFya2VyXG4gICAgICAgICAgICBlZGl0b3I6IGVkaXRvclxuICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlckxheWVyKG1hcmtlckxheWVyLCB7XG4gICAgICB0eXBlOiAnaGlnaGxpZ2h0JyxcbiAgICAgIGNsYXNzOiBAbWFrZUNsYXNzZXMoKVxuICAgIH0pXG5cbiAgbWFrZUNsYXNzZXM6IC0+XG4gICAgY2xhc3NOYW1lID0gJ2hpZ2hsaWdodC1zZWxlY3RlZCdcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5saWdodFRoZW1lJylcbiAgICAgIGNsYXNzTmFtZSArPSAnIGxpZ2h0LXRoZW1lJ1xuXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuaGlnaGxpZ2h0QmFja2dyb3VuZCcpXG4gICAgICBjbGFzc05hbWUgKz0gJyBiYWNrZ3JvdW5kJ1xuICAgIGNsYXNzTmFtZVxuXG4gIHNob3dIaWdobGlnaHRPblNlbGVjdGVkV29yZDogKHJhbmdlLCBzZWxlY3Rpb25zKSAtPlxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgYXRvbS5jb25maWcuZ2V0KFxuICAgICAgJ2hpZ2hsaWdodC1zZWxlY3RlZC5oaWRlSGlnaGxpZ2h0T25TZWxlY3RlZFdvcmQnKVxuICAgIG91dGNvbWUgPSBmYWxzZVxuICAgIGZvciBzZWxlY3Rpb24gaW4gc2VsZWN0aW9uc1xuICAgICAgc2VsZWN0aW9uUmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgb3V0Y29tZSA9IChyYW5nZS5zdGFydC5jb2x1bW4gaXMgc2VsZWN0aW9uUmFuZ2Uuc3RhcnQuY29sdW1uKSBhbmRcbiAgICAgICAgICAgICAgICAocmFuZ2Uuc3RhcnQucm93IGlzIHNlbGVjdGlvblJhbmdlLnN0YXJ0LnJvdykgYW5kXG4gICAgICAgICAgICAgICAgKHJhbmdlLmVuZC5jb2x1bW4gaXMgc2VsZWN0aW9uUmFuZ2UuZW5kLmNvbHVtbikgYW5kXG4gICAgICAgICAgICAgICAgKHJhbmdlLmVuZC5yb3cgaXMgc2VsZWN0aW9uUmFuZ2UuZW5kLnJvdylcbiAgICAgIGJyZWFrIGlmIG91dGNvbWVcbiAgICBvdXRjb21lXG5cbiAgcmVtb3ZlTWFya2VyczogPT5cbiAgICBAbWFya2VyTGF5ZXJzLmZvckVhY2ggKG1hcmtlckxheWVyKSAtPlxuICAgICAgbWFya2VyTGF5ZXIuZGVzdHJveSgpXG4gICAgQG1hcmtlckxheWVycyA9IFtdXG4gICAgQHN0YXR1c0JhckVsZW1lbnQ/LnVwZGF0ZUNvdW50KDApXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXJlbW92ZS1tYXJrZXItbGF5ZXInXG5cbiAgaXNXb3JkU2VsZWN0ZWQ6IChzZWxlY3Rpb24pIC0+XG4gICAgaWYgc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuaXNTaW5nbGVMaW5lKClcbiAgICAgIHNlbGVjdGlvblJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIGxpbmVSYW5nZSA9IEBnZXRBY3RpdmVFZGl0b3IoKS5idWZmZXJSYW5nZUZvckJ1ZmZlclJvdyhcbiAgICAgICAgc2VsZWN0aW9uUmFuZ2Uuc3RhcnQucm93KVxuICAgICAgbm9uV29yZENoYXJhY3RlclRvVGhlTGVmdCA9XG4gICAgICAgIHNlbGVjdGlvblJhbmdlLnN0YXJ0LmlzRXF1YWwobGluZVJhbmdlLnN0YXJ0KSBvclxuICAgICAgICBAaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVMZWZ0KHNlbGVjdGlvbilcbiAgICAgIG5vbldvcmRDaGFyYWN0ZXJUb1RoZVJpZ2h0ID1cbiAgICAgICAgc2VsZWN0aW9uUmFuZ2UuZW5kLmlzRXF1YWwobGluZVJhbmdlLmVuZCkgb3JcbiAgICAgICAgQGlzTm9uV29yZENoYXJhY3RlclRvVGhlUmlnaHQoc2VsZWN0aW9uKVxuXG4gICAgICBub25Xb3JkQ2hhcmFjdGVyVG9UaGVMZWZ0IGFuZCBub25Xb3JkQ2hhcmFjdGVyVG9UaGVSaWdodFxuICAgIGVsc2VcbiAgICAgIGZhbHNlXG5cbiAgaXNOb25Xb3JkQ2hhcmFjdGVyOiAoY2hhcmFjdGVyKSAtPlxuICAgIG5vbldvcmRDaGFyYWN0ZXJzID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3Iubm9uV29yZENoYXJhY3RlcnMnKVxuICAgIG5ldyBSZWdFeHAoXCJbIFxcdCN7ZXNjYXBlUmVnRXhwKG5vbldvcmRDaGFyYWN0ZXJzKX1dXCIpLnRlc3QoY2hhcmFjdGVyKVxuXG4gIGlzTm9uV29yZENoYXJhY3RlclRvVGhlTGVmdDogKHNlbGVjdGlvbikgLT5cbiAgICBzZWxlY3Rpb25TdGFydCA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLnN0YXJ0XG4gICAgcmFuZ2UgPSBSYW5nZS5mcm9tUG9pbnRXaXRoRGVsdGEoc2VsZWN0aW9uU3RhcnQsIDAsIC0xKVxuICAgIEBpc05vbldvcmRDaGFyYWN0ZXIoQGdldEFjdGl2ZUVkaXRvcigpLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKSlcblxuICBpc05vbldvcmRDaGFyYWN0ZXJUb1RoZVJpZ2h0OiAoc2VsZWN0aW9uKSAtPlxuICAgIHNlbGVjdGlvbkVuZCA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLmVuZFxuICAgIHJhbmdlID0gUmFuZ2UuZnJvbVBvaW50V2l0aERlbHRhKHNlbGVjdGlvbkVuZCwgMCwgMSlcbiAgICBAaXNOb25Xb3JkQ2hhcmFjdGVyKEBnZXRBY3RpdmVFZGl0b3IoKS5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSkpXG5cbiAgc2V0dXBTdGF0dXNCYXI6ID0+XG4gICAgcmV0dXJuIGlmIEBzdGF0dXNCYXJFbGVtZW50P1xuICAgIHJldHVybiB1bmxlc3MgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuc2hvd0luU3RhdHVzQmFyJylcbiAgICBAc3RhdHVzQmFyRWxlbWVudCA9IG5ldyBTdGF0dXNCYXJWaWV3KClcbiAgICBAc3RhdHVzQmFyVGlsZSA9IEBzdGF0dXNCYXIuYWRkTGVmdFRpbGUoXG4gICAgICBpdGVtOiBAc3RhdHVzQmFyRWxlbWVudC5nZXRFbGVtZW50KCksIHByaW9yaXR5OiAxMDApXG5cbiAgcmVtb3ZlU3RhdHVzQmFyOiA9PlxuICAgIHJldHVybiB1bmxlc3MgQHN0YXR1c0JhckVsZW1lbnQ/XG4gICAgQHN0YXR1c0JhclRpbGU/LmRlc3Ryb3koKVxuICAgIEBzdGF0dXNCYXJUaWxlID0gbnVsbFxuICAgIEBzdGF0dXNCYXJFbGVtZW50ID0gbnVsbFxuXG4gIGxpc3RlbkZvclN0YXR1c0JhckNoYW5nZTogPT5cbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnaGlnaGxpZ2h0LXNlbGVjdGVkLnNob3dJblN0YXR1c0JhcicsIChjaGFuZ2VkKSA9PlxuICAgICAgaWYgY2hhbmdlZC5uZXdWYWx1ZVxuICAgICAgICBAc2V0dXBTdGF0dXNCYXIoKVxuICAgICAgZWxzZVxuICAgICAgICBAcmVtb3ZlU3RhdHVzQmFyKClcbiJdfQ==
