(function() {
  var CompositeDisposable, Disposable, FoldingTextService, ref;

  ref = require('atom'), Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  FoldingTextService = (function() {
    function FoldingTextService() {}


    /*
    Section: Classes
     */

    FoldingTextService.prototype.Item = null;

    Object.defineProperty(FoldingTextService.prototype, 'Item', {
      get: function() {
        return require('./core/item');
      }
    });

    FoldingTextService.prototype.Outline = null;

    Object.defineProperty(FoldingTextService.prototype, 'Outline', {
      get: function() {
        return require('./core/outline');
      }
    });

    FoldingTextService.prototype.Mutation = null;

    Object.defineProperty(FoldingTextService.prototype, 'Mutation', {
      get: function() {
        return require('./core/mutation');
      }
    });

    FoldingTextService.prototype.OutlineEditor = null;

    Object.defineProperty(FoldingTextService.prototype, 'OutlineEditor', {
      get: function() {
        return require('./editor/outline-editor');
      }
    });


    /*
    Section: Workspace Outline Editors
     */

    FoldingTextService.prototype.getOutlineEditors = function() {
      return atom.workspace.getPaneItems().filter(function(item) {
        return item.isOutlineEditor;
      });
    };

    FoldingTextService.prototype.getActiveOutlineEditor = function() {
      var activeItem;
      activeItem = atom.workspace.getActivePaneItem();
      if (activeItem != null ? activeItem.isOutlineEditor : void 0) {
        return activeItem;
      }
    };

    FoldingTextService.prototype.getOutlineEditorsForOutline = function(outline) {
      return atom.workspace.getPaneItems().filter(function(item) {
        return item.isOutlineEditor && item.outline === outline;
      });
    };


    /*
    Section: Event Subscription
     */

    FoldingTextService.prototype.eventRegistery = null;

    Object.defineProperty(FoldingTextService.prototype, 'eventRegistery', {
      get: function() {
        return require('./editor/event-registery');
      }
    });

    FoldingTextService.prototype.onDidAddOutlineEditor = function(callback) {
      return atom.workspace.onDidAddPaneItem(function(arg) {
        var index, item, pane;
        item = arg.item, pane = arg.pane, index = arg.index;
        if (item.isOutlineEditor) {
          return callback({
            outlineEditor: item,
            pane: pane,
            index: index
          });
        }
      });
    };

    FoldingTextService.prototype.observeOutlineEditors = function(callback) {
      var i, len, outlineEditor, ref1;
      ref1 = this.getOutlineEditors();
      for (i = 0, len = ref1.length; i < len; i++) {
        outlineEditor = ref1[i];
        callback(outlineEditor);
      }
      return this.onDidAddOutlineEditor(function(arg) {
        var outlineEditor;
        outlineEditor = arg.outlineEditor;
        return callback(outlineEditor);
      });
    };

    FoldingTextService.prototype.onDidChangeActiveOutlineEditor = function(callback) {
      var prev;
      prev = null;
      return atom.workspace.onDidChangeActivePaneItem(function(item) {
        if (!(item != null ? item.isOutlineEditor : void 0)) {
          item = null;
        }
        if (prev !== item) {
          callback(item);
          return prev = item;
        }
      });
    };

    FoldingTextService.prototype.observeActiveOutlineEditor = function(callback) {
      var prev;
      prev = {};
      return atom.workspace.observeActivePaneItem(function(item) {
        if (!(item != null ? item.isOutlineEditor : void 0)) {
          item = null;
        }
        if (prev !== item) {
          callback(item);
          return prev = item;
        }
      });
    };

    FoldingTextService.prototype.onDidChangeActiveOutlineEditorSelection = function(callback) {
      var activeEditorSubscription, selectionSubscription;
      selectionSubscription = null;
      activeEditorSubscription = this.observeActiveOutlineEditor(function(outlineEditor) {
        if (selectionSubscription != null) {
          selectionSubscription.dispose();
        }
        selectionSubscription = outlineEditor != null ? outlineEditor.onDidChangeSelection(callback) : void 0;
        return callback((outlineEditor != null ? outlineEditor.selection : void 0) || null);
      });
      return new Disposable(function() {
        if (selectionSubscription != null) {
          selectionSubscription.dispose();
        }
        return activeEditorSubscription.dispose();
      });
    };

    FoldingTextService.prototype.observeActiveOutlineEditorSelection = function(callback) {
      var ref1;
      callback(((ref1 = this.getActiveOutlineEditor()) != null ? ref1.selection : void 0) || null);
      return this.onDidChangeActiveOutlineEditorSelection(callback);
    };

    return FoldingTextService;

  })();

  module.exports = new FoldingTextService;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9mb2xkaW5ndGV4dC1mb3ItYXRvbS9saWIvZm9sZGluZ3RleHQtc2VydmljZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQSxNQUFBOztFQUFBLE1BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsMkJBQUQsRUFBYTs7RUErQlA7Ozs7QUFFSjs7OztpQ0FLQSxJQUFBLEdBQU07O0lBQ04sTUFBTSxDQUFDLGNBQVAsQ0FBc0Isa0JBQUMsQ0FBQSxTQUF2QixFQUEyQixNQUEzQixFQUNFO01BQUEsR0FBQSxFQUFLLFNBQUE7ZUFBRyxPQUFBLENBQVEsYUFBUjtNQUFILENBQUw7S0FERjs7aUNBSUEsT0FBQSxHQUFTOztJQUNULE1BQU0sQ0FBQyxjQUFQLENBQXNCLGtCQUFDLENBQUEsU0FBdkIsRUFBMkIsU0FBM0IsRUFDRTtNQUFBLEdBQUEsRUFBSyxTQUFBO2VBQUcsT0FBQSxDQUFRLGdCQUFSO01BQUgsQ0FBTDtLQURGOztpQ0FJQSxRQUFBLEdBQVU7O0lBQ1YsTUFBTSxDQUFDLGNBQVAsQ0FBc0Isa0JBQUMsQ0FBQSxTQUF2QixFQUEyQixVQUEzQixFQUNFO01BQUEsR0FBQSxFQUFLLFNBQUE7ZUFBRyxPQUFBLENBQVEsaUJBQVI7TUFBSCxDQUFMO0tBREY7O2lDQUlBLGFBQUEsR0FBZTs7SUFDZixNQUFNLENBQUMsY0FBUCxDQUFzQixrQkFBQyxDQUFBLFNBQXZCLEVBQTJCLGVBQTNCLEVBQ0U7TUFBQSxHQUFBLEVBQUssU0FBQTtlQUFHLE9BQUEsQ0FBUSx5QkFBUjtNQUFILENBQUw7S0FERjs7O0FBR0E7Ozs7aUNBT0EsaUJBQUEsR0FBbUIsU0FBQTthQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBQSxDQUE2QixDQUFDLE1BQTlCLENBQXFDLFNBQUMsSUFBRDtlQUNuQyxJQUFJLENBQUM7TUFE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QUFELENBQXlDLFFBQXpDO0lBRm1DOzs7Ozs7RUFJdkMsTUFBTSxDQUFDLE9BQVAsR0FBaUIsSUFBSTtBQXRMckIiLCJzb3VyY2VzQ29udGVudCI6WyIjIENvcHlyaWdodCAoYykgMjAxNSBKZXNzZSBHcm9zamVhbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxue0Rpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxuIyBQdWJsaWM6IFRoaXMgaXMgdGhlIG9iamVjdCB2ZW5kZWQgYnkgdGhlIGBmb2xkaW5ndGV4dC1zZXJ2aWNlYCBhbmQgdGhlIGVudHJ5XG4jIHBvaW50IHRvIEZvbGRpbmdUZXh0J3MgQVBJLlxuI1xuIyAjIyBFeGFtcGxlXG4jXG4jIFRvIGdldCBhbiBpbnN0YW5jZSBvZiB7Rm9sZGluZ1RleHRTZXJ2aWNlfSB5b3Ugc3Vic2NyaWJlIHRvIEZvbGRpbmdUZXh0IHVzaW5nXG4jIEF0b20ncyBbc2VydmljZXNcbiMgQVBJXShodHRwczovL2F0b20uaW8vZG9jcy9sYXRlc3QvY3JlYXRpbmctYS1wYWNrYWdlI2ludGVyYWN0aW5nLXdpdGgtb3RoZXItXG4jIHBhY2thZ2VzLXZpYS1zZXJ2aWNlcykuIEZpcnN0IHN1YnNjaWJlIHRvIGBmb2xkaW5ndGV4dC1zZXJ2aWNlYCBpbiB5b3VyXG4jIHBhY2thZ2UncyBgcGFja2FnZS5qc29uYCBhbmQgdGhlbiBjb25zdW1lIHRoZSBzZXJ2aWNlIGluIHlvdXIgbWFpbiBtb2R1bGUuXG4jXG4jIGBgYGNzb25cbiMgXCJjb25zdW1lZFNlcnZpY2VzXCI6IHtcbiMgICBcImZvbGRpbmd0ZXh0LXNlcnZpY2VcIjoge1xuIyAgICAgXCJ2ZXJzaW9uc1wiOiB7XG4jICAgICAgIFwiMFwiOiBcImNvbnN1bWVGb2xkaW5nVGV4dFNlcnZpY2VcIlxuIyAgICAgfVxuIyAgIH1cbiMgfSxcbiMgYGBgXG4jXG4jIGBgYGNvZmZlZXNjcmlwdFxuIyB7RGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuIyAgIC4uLlxuIyAgIGNvbnN1bWVGb2xkaW5nVGV4dFNlcnZpY2U6IChmb2xkaW5nVGV4dFNlcnZpY2UpIC0+XG4jICAgICBAZm9sZGluZ1RleHRTZXJ2aWNlID0gZm9sZGluZ1RleHRTZXJ2aWNlXG4jICAgICBuZXcgRGlzcG9zYWJsZSA9PlxuIyAgICAgICBAZm9sZGluZ1RleHRTZXJ2aWNlID0gbnVsbFxuIyBgYGBcbmNsYXNzIEZvbGRpbmdUZXh0U2VydmljZVxuXG4gICMjI1xuICBTZWN0aW9uOiBDbGFzc2VzXG4gICMjI1xuXG4gICMgUHVibGljOiB7SXRlbX0gQ2xhc3NcbiAgSXRlbTogbnVsbCAjIGxhenlcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IEA6OiwgJ0l0ZW0nLFxuICAgIGdldDogLT4gcmVxdWlyZSAnLi9jb3JlL2l0ZW0nXG5cbiAgIyBQdWJsaWM6IHtPdXRsaW5lfSBDbGFzc1xuICBPdXRsaW5lOiBudWxsICMgbGF6eVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQDo6LCAnT3V0bGluZScsXG4gICAgZ2V0OiAtPiByZXF1aXJlICcuL2NvcmUvb3V0bGluZSdcblxuICAjIFB1YmxpYzoge011dGF0aW9ufSBDbGFzc1xuICBNdXRhdGlvbjogbnVsbCAjIGxhenlcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IEA6OiwgJ011dGF0aW9uJyxcbiAgICBnZXQ6IC0+IHJlcXVpcmUgJy4vY29yZS9tdXRhdGlvbidcblxuICAjIFB1YmxpYzoge091dGxpbmVFZGl0b3J9IENsYXNzXG4gIE91dGxpbmVFZGl0b3I6IG51bGwgIyBsYXp5XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBAOjosICdPdXRsaW5lRWRpdG9yJyxcbiAgICBnZXQ6IC0+IHJlcXVpcmUgJy4vZWRpdG9yL291dGxpbmUtZWRpdG9yJ1xuXG4gICMjI1xuICBTZWN0aW9uOiBXb3Jrc3BhY2UgT3V0bGluZSBFZGl0b3JzXG4gICMjI1xuXG4gICMgUHVibGljOiBHZXQgYWxsIG91dGxpbmUgZWRpdG9ycyBpbiB0aGUgd29ya3NwYWNlLlxuICAjXG4gICMgUmV0dXJucyBhbiB7QXJyYXl9IG9mIHtPdXRsaW5lRWRpdG9yfXMuXG4gIGdldE91dGxpbmVFZGl0b3JzOiAtPlxuICAgIGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpLmZpbHRlciAoaXRlbSkgLT5cbiAgICAgIGl0ZW0uaXNPdXRsaW5lRWRpdG9yXG5cbiAgIyBQdWJsaWM6IEdldCB0aGUgYWN0aXZlIGl0ZW0gaWYgaXQgaXMgYW4ge091dGxpbmVFZGl0b3J9LlxuICAjXG4gICMgUmV0dXJucyBhbiB7T3V0bGluZUVkaXRvcn0gb3IgYHVuZGVmaW5lZGAgaWYgdGhlIGN1cnJlbnQgYWN0aXZlIGl0ZW0gaXNcbiAgIyBub3QgYW4ge091dGxpbmVFZGl0b3J9LlxuICBnZXRBY3RpdmVPdXRsaW5lRWRpdG9yOiAtPlxuICAgIGFjdGl2ZUl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgYWN0aXZlSXRlbSBpZiBhY3RpdmVJdGVtPy5pc091dGxpbmVFZGl0b3JcblxuICAjIFB1YmxpYzogR2V0IGFsbCBvdXRsaW5lIGVkaXRvcnMgZm9yIGEgZ2l2ZW4gb3V0aW5lIHRoZSB3b3Jrc3BhY2UuXG4gICNcbiAgIyAtIGBvdXRsaW5lYCBUaGUge091dGxpbmV9IHRvIHNlYXJjaCBmb3IuXG4gICNcbiAgIyBSZXR1cm5zIGFuIHtBcnJheX0gb2Yge091dGxpbmVFZGl0b3J9cy5cbiAgZ2V0T3V0bGluZUVkaXRvcnNGb3JPdXRsaW5lOiAob3V0bGluZSkgLT5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKS5maWx0ZXIgKGl0ZW0pIC0+XG4gICAgICBpdGVtLmlzT3V0bGluZUVkaXRvciBhbmQgaXRlbS5vdXRsaW5lIGlzIG91dGxpbmVcblxuICAjIyNcbiAgU2VjdGlvbjogRXZlbnQgU3Vic2NyaXB0aW9uXG4gICMjI1xuXG4gICMgUHVibGljOiB7RXZlbnRSZWdpc3Rlcnl9IGluc3RhbmNlLlxuICBldmVudFJlZ2lzdGVyeTogbnVsbCAjIGxhenlcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IEA6OiwgJ2V2ZW50UmVnaXN0ZXJ5JyxcbiAgICBnZXQ6IC0+IHJlcXVpcmUgJy4vZWRpdG9yL2V2ZW50LXJlZ2lzdGVyeSdcblxuICAjIFB1YmxpYzogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aGVuIGFuIG91dGxpbmUgZWRpdG9yIGlzIGFkZGVkIHRvIHRoZVxuICAjIHdvcmtzcGFjZS5cbiAgI1xuICAjICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCBwYW5lcyBhcmUgYWRkZWQuXG4gICMgICAqIGBldmVudGAge09iamVjdH0gd2l0aCB0aGUgZm9sbG93aW5nIGtleXM6XG4gICMgICAgICogYG91dGxpbmVFZGl0b3JgIHtPdXRsaW5lRWRpdG9yfSB0aGF0IHdhcyBhZGRlZC5cbiAgIyAgICAgKiBgcGFuZWAge1BhbmV9IGNvbnRhaW5pbmcgdGhlIGFkZGVkIG91dGxpbmUgZWRpdG9yLlxuICAjICAgICAqIGBpbmRleGAge051bWJlcn0gaW5kaWNhdGluZyB0aGUgaW5kZXggb2YgdGhlIGFkZGVkIG91dGxpbmUgZWRpdG9yXG4gICMgICAgICAgaW4gaXRzIHBhbmUuXG4gICNcbiAgIyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbkRpZEFkZE91dGxpbmVFZGl0b3I6IChjYWxsYmFjaykgLT5cbiAgICBhdG9tLndvcmtzcGFjZS5vbkRpZEFkZFBhbmVJdGVtICh7aXRlbSwgcGFuZSwgaW5kZXh9KSAtPlxuICAgICAgaWYgaXRlbS5pc091dGxpbmVFZGl0b3JcbiAgICAgICAgY2FsbGJhY2soe291dGxpbmVFZGl0b3I6IGl0ZW0sIHBhbmUsIGluZGV4fSlcblxuICAjIFB1YmxpYzogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aXRoIGFsbCBjdXJyZW50IGFuZCBmdXR1cmUgb3V0bGluZVxuICAjIGVkaXRvcnMgaW4gdGhlIHdvcmtzcGFjZS5cbiAgI1xuICAjICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aXRoIGN1cnJlbnQgYW5kIGZ1dHVyZSBvdXRsaW5lXG4gICMgICAgZWRpdG9ycy5cbiAgIyAgICogYGVkaXRvcmAgQW4ge091dGxpbmVFZGl0b3J9IHRoYXQgaXMgcHJlc2VudCBpbiB7OjpnZXRPdXRsaW5lRWRpdG9yc31cbiAgIyAgICAgIGF0IHRoZSB0aW1lIG9mIHN1YnNjcmlwdGlvbiBvciB0aGF0IGlzIGFkZGVkIGF0IHNvbWUgbGF0ZXIgdGltZS5cbiAgI1xuICAjIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9ic2VydmVPdXRsaW5lRWRpdG9yczogKGNhbGxiYWNrKSAtPlxuICAgIGNhbGxiYWNrKG91dGxpbmVFZGl0b3IpIGZvciBvdXRsaW5lRWRpdG9yIGluIEBnZXRPdXRsaW5lRWRpdG9ycygpXG4gICAgQG9uRGlkQWRkT3V0bGluZUVkaXRvciAoe291dGxpbmVFZGl0b3J9KSAtPiBjYWxsYmFjayhvdXRsaW5lRWRpdG9yKVxuXG4gICMgUHVibGljOiBJbnZva2UgdGhlIGdpdmVuIGNhbGxiYWNrIHdoZW4gdGhlIGFjdGl2ZSB7T3V0bGluZUVkaXRvcn0gY2hhbmdlcy5cbiAgI1xuICAjICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhY3RpdmUge091dGxpbmVFZGl0b3J9IGNoYW5nZXMuXG4gICMgICAqIGBvdXRsaW5lRWRpdG9yYCBUaGUgYWN0aXZlIE91dGxpbmVFZGl0b3IuXG4gICNcbiAgIyBSZXR1cm5zIGEge0Rpc3Bvc2FibGV9IG9uIHdoaWNoIGAuZGlzcG9zZSgpYCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxuICBvbkRpZENoYW5nZUFjdGl2ZU91dGxpbmVFZGl0b3I6IChjYWxsYmFjaykgLT5cbiAgICBwcmV2ID0gbnVsbFxuICAgIGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0gKGl0ZW0pIC0+XG4gICAgICB1bmxlc3MgaXRlbT8uaXNPdXRsaW5lRWRpdG9yXG4gICAgICAgIGl0ZW0gPSBudWxsXG4gICAgICB1bmxlc3MgcHJldiBpcyBpdGVtXG4gICAgICAgIGNhbGxiYWNrIGl0ZW1cbiAgICAgICAgcHJldiA9IGl0ZW1cblxuICAjIFB1YmxpYzogSW52b2tlIHRoZSBnaXZlbiBjYWxsYmFjayB3aXRoIHRoZSBjdXJyZW50IHtPdXRsaW5lRWRpdG9yfSBhbmRcbiAgIyB3aXRoIGFsbCBmdXR1cmUgYWN0aXZlIG91dGxpbmUgZWRpdG9ycyBpbiB0aGUgd29ya3NwYWNlLlxuICAjXG4gICMgKiBgY2FsbGJhY2tgIHtGdW5jdGlvbn0gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIHtPdXRsaW5lRWRpdG9yfSBjaGFuZ2VzLlxuICAjICAgKiBgb3V0bGluZUVkaXRvcmAgVGhlIGN1cnJlbnQgYWN0aXZlIHtPdWx0aW5lRWRpdG9yfS5cbiAgI1xuICAjIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9ic2VydmVBY3RpdmVPdXRsaW5lRWRpdG9yOiAoY2FsbGJhY2spIC0+XG4gICAgcHJldiA9IHt9XG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtIChpdGVtKSAtPlxuICAgICAgdW5sZXNzIGl0ZW0/LmlzT3V0bGluZUVkaXRvclxuICAgICAgICBpdGVtID0gbnVsbFxuICAgICAgdW5sZXNzIHByZXYgaXMgaXRlbVxuICAgICAgICBjYWxsYmFjayBpdGVtXG4gICAgICAgIHByZXYgPSBpdGVtXG5cbiAgIyBQdWJsaWM6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2hlbiB0aGUgYWN0aXZlIHtPdXRsaW5lRWRpdG9yfVxuICAjIHtTZWxlY3Rpb259IGNoYW5nZXMuXG4gICNcbiAgIyAqIGBjYWxsYmFja2Age0Z1bmN0aW9ufSB0byBiZSBjYWxsZWQgd2hlbiB0aGUgYWN0aXZlIHtPdXRsaW5lRWRpdG9yfSB7U2VsZWN0aW9ufSBjaGFuZ2VzLlxuICAjICAgKiBgc2VsZWN0aW9uYCBUaGUgYWN0aXZlIHtPdXRsaW5lRWRpdG9yfSB7U2VsZWN0aW9ufS5cbiAgI1xuICAjIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9uRGlkQ2hhbmdlQWN0aXZlT3V0bGluZUVkaXRvclNlbGVjdGlvbjogKGNhbGxiYWNrKSAtPlxuICAgIHNlbGVjdGlvblN1YnNjcmlwdGlvbiA9IG51bGxcbiAgICBhY3RpdmVFZGl0b3JTdWJzY3JpcHRpb24gPSBAb2JzZXJ2ZUFjdGl2ZU91dGxpbmVFZGl0b3IgKG91dGxpbmVFZGl0b3IpIC0+XG4gICAgICBzZWxlY3Rpb25TdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgICAgc2VsZWN0aW9uU3Vic2NyaXB0aW9uID0gb3V0bGluZUVkaXRvcj8ub25EaWRDaGFuZ2VTZWxlY3Rpb24gY2FsbGJhY2tcbiAgICAgIGNhbGxiYWNrIG91dGxpbmVFZGl0b3I/LnNlbGVjdGlvbiBvciBudWxsXG4gICAgbmV3IERpc3Bvc2FibGUgLT5cbiAgICAgIHNlbGVjdGlvblN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgICBhY3RpdmVFZGl0b3JTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG5cbiAgIyBQdWJsaWM6IEludm9rZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgd2l0aCB0aGUgYWN0aXZlIHtPdXRsaW5lRWRpdG9yfSB7U2VsZWN0aW9ufSBhbmRcbiAgIyB3aXRoIGFsbCBmdXR1cmUgYWN0aXZlIG91dGxpbmUgZWRpdG9yIHNlbGVjdGlvbnMgaW4gdGhlIHdvcmtzcGFjZS5cbiAgI1xuICAjICogYGNhbGxiYWNrYCB7RnVuY3Rpb259IHRvIGJlIGNhbGxlZCB3aGVuIHRoZSB7T3V0bGluZUVkaXRvcn0ge1NlbGVjdGlvbn0gY2hhbmdlcy5cbiAgIyAgICogYHNlbGVjdGlvbmAgVGhlIGN1cnJlbnQgYWN0aXZlIHtPdWx0aW5lRWRpdG9yfSB7U2VsZWN0aW9ufS5cbiAgI1xuICAjIFJldHVybnMgYSB7RGlzcG9zYWJsZX0gb24gd2hpY2ggYC5kaXNwb3NlKClgIGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXG4gIG9ic2VydmVBY3RpdmVPdXRsaW5lRWRpdG9yU2VsZWN0aW9uOiAoY2FsbGJhY2spIC0+XG4gICAgY2FsbGJhY2sgQGdldEFjdGl2ZU91dGxpbmVFZGl0b3IoKT8uc2VsZWN0aW9uIG9yIG51bGxcbiAgICBAb25EaWRDaGFuZ2VBY3RpdmVPdXRsaW5lRWRpdG9yU2VsZWN0aW9uIGNhbGxiYWNrXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEZvbGRpbmdUZXh0U2VydmljZVxuIl19
