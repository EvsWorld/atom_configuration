(function() {
  var CompositeDisposable, Disposable, ItemPathGrammar, TextInputElement, foldingTextService, ref;

  foldingTextService = require('../foldingtext-service');

  ref = require('atom'), Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  TextInputElement = require('./ui/text-input-element');

  ItemPathGrammar = require('./item-path-grammar');

  exports.consumeStatusBarService = function(statusBar) {
    var activeOutlineEditorSubscription, activeOutlineEditorSubscriptions, clearAddon, searchElement, searchStatusBarItem;
    searchElement = document.createElement('ft-text-input');
    searchElement.classList.add('inline-block');
    searchElement.classList.add('ft-search-status-bar-item');
    searchElement.cancelOnBlur = false;
    searchElement.setPlaceholderText('Search');
    try {
      searchElement.setGrammar(new ItemPathGrammar(atom.grammars));
      searchElement.setText('test and this and out');
      searchElement.setText('');
    } catch (error) {
      searchElement.setGrammar(atom.grammars.grammarForScopeName('text.plain.null-grammar'));
    }
    clearAddon = document.createElement('span');
    clearAddon.className = 'icon-remove-close';
    clearAddon.addEventListener('click', function(e) {
      e.preventDefault();
      searchElement.cancel();
      return searchElement.focusTextEditor();
    });
    searchElement.addRightAddonElement(clearAddon);
    searchElement.setDelegate({
      didChangeText: function() {
        var ref1;
        return (ref1 = foldingTextService.getActiveOutlineEditor()) != null ? ref1.setSearch(searchElement.getText()) : void 0;
      },
      restoreFocus: function() {},
      cancelled: function() {
        var editor, ref1;
        editor = foldingTextService.getActiveOutlineEditor();
        if ((ref1 = editor.getSearch()) != null ? ref1.query : void 0) {
          return editor != null ? editor.setSearch('') : void 0;
        } else {
          return editor != null ? editor.focus() : void 0;
        }
      },
      confirm: function() {
        var ref1;
        return (ref1 = foldingTextService.getActiveOutlineEditor()) != null ? ref1.focus() : void 0;
      }
    });
    searchStatusBarItem = statusBar.addLeftTile({
      item: searchElement,
      priority: 0
    });
    searchElement.setSizeToFit(true);
    activeOutlineEditorSubscriptions = null;
    return activeOutlineEditorSubscription = foldingTextService.observeActiveOutlineEditor(function(outlineEditor) {
      var commandsSubscriptions, update;
      if (activeOutlineEditorSubscriptions != null) {
        activeOutlineEditorSubscriptions.dispose();
      }
      if (outlineEditor) {
        update = function() {
          var ref1, searchQuery;
          searchQuery = (ref1 = outlineEditor.getSearch()) != null ? ref1.query : void 0;
          if (searchQuery) {
            searchElement.classList.add('active');
            clearAddon.style.display = null;
          } else {
            searchElement.classList.remove('active');
            clearAddon.style.display = 'none';
          }
          if (searchElement.getText() !== searchQuery) {
            searchElement.setText(searchQuery);
          }
          return searchElement.scheduleLayout();
        };
        searchElement.style.display = null;
        activeOutlineEditorSubscriptions = new CompositeDisposable();
        activeOutlineEditorSubscriptions.add(outlineEditor.onDidChangeSearch(function() {
          return update();
        }));
        activeOutlineEditorSubscriptions.add(outlineEditor.onDidChangeHoistedItem(function() {
          return update();
        }));
        update();
      } else {
        searchElement.style.display = 'none';
      }
      commandsSubscriptions = new CompositeDisposable;
      commandsSubscriptions.add(atom.commands.add(searchElement, {
        'editor:copy-path': function() {
          var ref1;
          return (ref1 = foldingTextService.getActiveOutlineEditor()) != null ? ref1.copyPathToClipboard() : void 0;
        }
      }));
      commandsSubscriptions.add(atom.commands.add('ft-outline-editor.outline-mode', {
        'core:cancel': function(e) {
          searchElement.focusTextEditor();
          return e.stopPropagation();
        }
      }));
      commandsSubscriptions.add(atom.commands.add('ft-outline-editor', {
        'find-and-replace:show': function(e) {
          searchElement.focusTextEditor();
          return e.stopPropagation();
        },
        'find-and-replace:show-replace': function(e) {
          searchElement.focusTextEditor();
          return e.stopPropagation();
        }
      }));
      return new Disposable(function() {
        activeOutlineEditorSubscription.dispose();
        if (activeOutlineEditorSubscriptions != null) {
          activeOutlineEditorSubscriptions.dispose();
        }
        commandsSubscriptions.dispose();
        return searchStatusBarItem.destroy();
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9mb2xkaW5ndGV4dC1mb3ItYXRvbS9saWIvZXh0ZW5zaW9ucy9zZWFyY2gtc3RhdHVzLWJhci1pdGVtLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtBQUFBLE1BQUE7O0VBQUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSOztFQUNyQixNQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDJCQUFELEVBQWE7O0VBQ2IsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHlCQUFSOztFQUNuQixlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUjs7RUFFbEIsT0FBTyxDQUFDLHVCQUFSLEdBQWtDLFNBQUMsU0FBRDtBQUNoQyxRQUFBO0lBQUEsYUFBQSxHQUFnQixRQUFRLENBQUMsYUFBVCxDQUF1QixlQUF2QjtJQUNoQixhQUFhLENBQUMsU0FBUyxDQUFDLEdBQXhCLENBQTRCLGNBQTVCO0lBQ0EsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUF4QixDQUE0QiwyQkFBNUI7SUFDQSxhQUFhLENBQUMsWUFBZCxHQUE2QjtJQUM3QixhQUFhLENBQUMsa0JBQWQsQ0FBaUMsUUFBakM7QUFFQTtNQUVFLGFBQWEsQ0FBQyxVQUFkLENBQTZCLElBQUEsZUFBQSxDQUFnQixJQUFJLENBQUMsUUFBckIsQ0FBN0I7TUFDQSxhQUFhLENBQUMsT0FBZCxDQUFzQix1QkFBdEI7TUFDQSxhQUFhLENBQUMsT0FBZCxDQUFzQixFQUF0QixFQUpGO0tBQUEsYUFBQTtNQU1FLGFBQWEsQ0FBQyxVQUFkLENBQXlCLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQWQsQ0FBa0MseUJBQWxDLENBQXpCLEVBTkY7O0lBUUEsVUFBQSxHQUFhLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCO0lBQ2IsVUFBVSxDQUFDLFNBQVgsR0FBdUI7SUFDdkIsVUFBVSxDQUFDLGdCQUFYLENBQTRCLE9BQTVCLEVBQXFDLFNBQUMsQ0FBRDtNQUNuQyxDQUFDLENBQUMsY0FBRixDQUFBO01BQ0EsYUFBYSxDQUFDLE1BQWQsQ0FBQTthQUNBLGFBQWEsQ0FBQyxlQUFkLENBQUE7SUFIbUMsQ0FBckM7SUFJQSxhQUFhLENBQUMsb0JBQWQsQ0FBbUMsVUFBbkM7SUFFQSxhQUFhLENBQUMsV0FBZCxDQUNFO01BQUEsYUFBQSxFQUFlLFNBQUE7QUFDYixZQUFBO2tGQUEyQyxDQUFFLFNBQTdDLENBQXVELGFBQWEsQ0FBQyxPQUFkLENBQUEsQ0FBdkQ7TUFEYSxDQUFmO01BRUEsWUFBQSxFQUFjLFNBQUEsR0FBQSxDQUZkO01BR0EsU0FBQSxFQUFXLFNBQUE7QUFDVCxZQUFBO1FBQUEsTUFBQSxHQUFTLGtCQUFrQixDQUFDLHNCQUFuQixDQUFBO1FBQ1QsOENBQXFCLENBQUUsY0FBdkI7a0NBQ0UsTUFBTSxDQUFFLFNBQVIsQ0FBa0IsRUFBbEIsV0FERjtTQUFBLE1BQUE7a0NBR0UsTUFBTSxDQUFFLEtBQVIsQ0FBQSxXQUhGOztNQUZTLENBSFg7TUFTQSxPQUFBLEVBQVMsU0FBQTtBQUNQLFlBQUE7a0ZBQTJDLENBQUUsS0FBN0MsQ0FBQTtNQURPLENBVFQ7S0FERjtJQWFBLG1CQUFBLEdBQXNCLFNBQVMsQ0FBQyxXQUFWLENBQXNCO01BQUEsSUFBQSxFQUFNLGFBQU47TUFBcUIsUUFBQSxFQUFVLENBQS9CO0tBQXRCO0lBQ3RCLGFBQWEsQ0FBQyxZQUFkLENBQTJCLElBQTNCO0lBRUEsZ0NBQUEsR0FBbUM7V0FDbkMsK0JBQUEsR0FBa0Msa0JBQWtCLENBQUMsMEJBQW5CLENBQThDLFNBQUMsYUFBRDtBQUM5RSxVQUFBOztRQUFBLGdDQUFnQyxDQUFFLE9BQWxDLENBQUE7O01BQ0EsSUFBRyxhQUFIO1FBQ0UsTUFBQSxHQUFTLFNBQUE7QUFDUCxjQUFBO1VBQUEsV0FBQSxvREFBdUMsQ0FBRTtVQUN6QyxJQUFHLFdBQUg7WUFDRSxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQXhCLENBQTRCLFFBQTVCO1lBQ0EsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFqQixHQUEyQixLQUY3QjtXQUFBLE1BQUE7WUFJRSxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQXhCLENBQStCLFFBQS9CO1lBQ0EsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFqQixHQUEyQixPQUw3Qjs7VUFNQSxJQUFPLGFBQWEsQ0FBQyxPQUFkLENBQUEsQ0FBQSxLQUEyQixXQUFsQztZQUNFLGFBQWEsQ0FBQyxPQUFkLENBQXNCLFdBQXRCLEVBREY7O2lCQUVBLGFBQWEsQ0FBQyxjQUFkLENBQUE7UUFWTztRQVlULGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBcEIsR0FBOEI7UUFDOUIsZ0NBQUEsR0FBdUMsSUFBQSxtQkFBQSxDQUFBO1FBQ3ZDLGdDQUFnQyxDQUFDLEdBQWpDLENBQXFDLGFBQWEsQ0FBQyxpQkFBZCxDQUFnQyxTQUFBO2lCQUFHLE1BQUEsQ0FBQTtRQUFILENBQWhDLENBQXJDO1FBQ0EsZ0NBQWdDLENBQUMsR0FBakMsQ0FBcUMsYUFBYSxDQUFDLHNCQUFkLENBQXFDLFNBQUE7aUJBQUcsTUFBQSxDQUFBO1FBQUgsQ0FBckMsQ0FBckM7UUFDQSxNQUFBLENBQUEsRUFqQkY7T0FBQSxNQUFBO1FBbUJFLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBcEIsR0FBOEIsT0FuQmhDOztNQXFCQSxxQkFBQSxHQUF3QixJQUFJO01BQzVCLHFCQUFxQixDQUFDLEdBQXRCLENBQTBCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixhQUFsQixFQUN4QjtRQUFBLGtCQUFBLEVBQW9CLFNBQUE7QUFDbEIsY0FBQTtvRkFBMkMsQ0FBRSxtQkFBN0MsQ0FBQTtRQURrQixDQUFwQjtPQUR3QixDQUExQjtNQUdBLHFCQUFxQixDQUFDLEdBQXRCLENBQTBCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQ0FBbEIsRUFDeEI7UUFBQSxhQUFBLEVBQWUsU0FBQyxDQUFEO1VBQ2IsYUFBYSxDQUFDLGVBQWQsQ0FBQTtpQkFDQSxDQUFDLENBQUMsZUFBRixDQUFBO1FBRmEsQ0FBZjtPQUR3QixDQUExQjtNQUlBLHFCQUFxQixDQUFDLEdBQXRCLENBQTBCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixtQkFBbEIsRUFDeEI7UUFBQSx1QkFBQSxFQUF5QixTQUFDLENBQUQ7VUFDdkIsYUFBYSxDQUFDLGVBQWQsQ0FBQTtpQkFDQSxDQUFDLENBQUMsZUFBRixDQUFBO1FBRnVCLENBQXpCO1FBR0EsK0JBQUEsRUFBaUMsU0FBQyxDQUFEO1VBQy9CLGFBQWEsQ0FBQyxlQUFkLENBQUE7aUJBQ0EsQ0FBQyxDQUFDLGVBQUYsQ0FBQTtRQUYrQixDQUhqQztPQUR3QixDQUExQjthQVFJLElBQUEsVUFBQSxDQUFXLFNBQUE7UUFDYiwrQkFBK0IsQ0FBQyxPQUFoQyxDQUFBOztVQUNBLGdDQUFnQyxDQUFFLE9BQWxDLENBQUE7O1FBQ0EscUJBQXFCLENBQUMsT0FBdEIsQ0FBQTtlQUNBLG1CQUFtQixDQUFDLE9BQXBCLENBQUE7TUFKYSxDQUFYO0lBdkMwRSxDQUE5QztFQXhDRjtBQUxsQyIsInNvdXJjZXNDb250ZW50IjpbIiMgQ29weXJpZ2h0IChjKSAyMDE1IEplc3NlIEdyb3NqZWFuLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG5mb2xkaW5nVGV4dFNlcnZpY2UgPSByZXF1aXJlICcuLi9mb2xkaW5ndGV4dC1zZXJ2aWNlJ1xue0Rpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblRleHRJbnB1dEVsZW1lbnQgPSByZXF1aXJlICcuL3VpL3RleHQtaW5wdXQtZWxlbWVudCdcbkl0ZW1QYXRoR3JhbW1hciA9IHJlcXVpcmUgJy4vaXRlbS1wYXRoLWdyYW1tYXInXG5cbmV4cG9ydHMuY29uc3VtZVN0YXR1c0JhclNlcnZpY2UgPSAoc3RhdHVzQmFyKSAtPlxuICBzZWFyY2hFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZnQtdGV4dC1pbnB1dCdcbiAgc2VhcmNoRWxlbWVudC5jbGFzc0xpc3QuYWRkICdpbmxpbmUtYmxvY2snXG4gIHNlYXJjaEVsZW1lbnQuY2xhc3NMaXN0LmFkZCAnZnQtc2VhcmNoLXN0YXR1cy1iYXItaXRlbSdcbiAgc2VhcmNoRWxlbWVudC5jYW5jZWxPbkJsdXIgPSBmYWxzZVxuICBzZWFyY2hFbGVtZW50LnNldFBsYWNlaG9sZGVyVGV4dCAnU2VhcmNoJ1xuXG4gIHRyeVxuICAgICMgTWFrZSBzdXJlIG91ciBncmFtbWFyIHRva2VuaXplTGluZSBoYWNrIGlzIHdvcmtpbmcsIGlmIG5vdCB1c2UgbnVsbCBncmFtbWFyXG4gICAgc2VhcmNoRWxlbWVudC5zZXRHcmFtbWFyIG5ldyBJdGVtUGF0aEdyYW1tYXIoYXRvbS5ncmFtbWFycylcbiAgICBzZWFyY2hFbGVtZW50LnNldFRleHQoJ3Rlc3QgYW5kIHRoaXMgYW5kIG91dCcpXG4gICAgc2VhcmNoRWxlbWVudC5zZXRUZXh0KCcnKVxuICBjYXRjaFxuICAgIHNlYXJjaEVsZW1lbnQuc2V0R3JhbW1hcihhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoJ3RleHQucGxhaW4ubnVsbC1ncmFtbWFyJykpXG5cbiAgY2xlYXJBZGRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ3NwYW4nXG4gIGNsZWFyQWRkb24uY2xhc3NOYW1lID0gJ2ljb24tcmVtb3ZlLWNsb3NlJ1xuICBjbGVhckFkZG9uLmFkZEV2ZW50TGlzdGVuZXIgJ2NsaWNrJywgKGUpIC0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgc2VhcmNoRWxlbWVudC5jYW5jZWwoKVxuICAgIHNlYXJjaEVsZW1lbnQuZm9jdXNUZXh0RWRpdG9yKClcbiAgc2VhcmNoRWxlbWVudC5hZGRSaWdodEFkZG9uRWxlbWVudCBjbGVhckFkZG9uXG5cbiAgc2VhcmNoRWxlbWVudC5zZXREZWxlZ2F0ZVxuICAgIGRpZENoYW5nZVRleHQ6IC0+XG4gICAgICBmb2xkaW5nVGV4dFNlcnZpY2UuZ2V0QWN0aXZlT3V0bGluZUVkaXRvcigpPy5zZXRTZWFyY2ggc2VhcmNoRWxlbWVudC5nZXRUZXh0KClcbiAgICByZXN0b3JlRm9jdXM6IC0+XG4gICAgY2FuY2VsbGVkOiAtPlxuICAgICAgZWRpdG9yID0gZm9sZGluZ1RleHRTZXJ2aWNlLmdldEFjdGl2ZU91dGxpbmVFZGl0b3IoKVxuICAgICAgaWYgZWRpdG9yLmdldFNlYXJjaCgpPy5xdWVyeVxuICAgICAgICBlZGl0b3I/LnNldFNlYXJjaCAnJ1xuICAgICAgZWxzZVxuICAgICAgICBlZGl0b3I/LmZvY3VzKClcbiAgICBjb25maXJtOiAtPlxuICAgICAgZm9sZGluZ1RleHRTZXJ2aWNlLmdldEFjdGl2ZU91dGxpbmVFZGl0b3IoKT8uZm9jdXMoKVxuXG4gIHNlYXJjaFN0YXR1c0Jhckl0ZW0gPSBzdGF0dXNCYXIuYWRkTGVmdFRpbGUoaXRlbTogc2VhcmNoRWxlbWVudCwgcHJpb3JpdHk6IDApXG4gIHNlYXJjaEVsZW1lbnQuc2V0U2l6ZVRvRml0IHRydWVcblxuICBhY3RpdmVPdXRsaW5lRWRpdG9yU3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgYWN0aXZlT3V0bGluZUVkaXRvclN1YnNjcmlwdGlvbiA9IGZvbGRpbmdUZXh0U2VydmljZS5vYnNlcnZlQWN0aXZlT3V0bGluZUVkaXRvciAob3V0bGluZUVkaXRvcikgLT5cbiAgICBhY3RpdmVPdXRsaW5lRWRpdG9yU3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgaWYgb3V0bGluZUVkaXRvclxuICAgICAgdXBkYXRlID0gLT5cbiAgICAgICAgc2VhcmNoUXVlcnkgPSBvdXRsaW5lRWRpdG9yLmdldFNlYXJjaCgpPy5xdWVyeVxuICAgICAgICBpZiBzZWFyY2hRdWVyeVxuICAgICAgICAgIHNlYXJjaEVsZW1lbnQuY2xhc3NMaXN0LmFkZCAnYWN0aXZlJ1xuICAgICAgICAgIGNsZWFyQWRkb24uc3R5bGUuZGlzcGxheSA9IG51bGxcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHNlYXJjaEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSAnYWN0aXZlJ1xuICAgICAgICAgIGNsZWFyQWRkb24uc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICB1bmxlc3Mgc2VhcmNoRWxlbWVudC5nZXRUZXh0KCkgaXMgc2VhcmNoUXVlcnlcbiAgICAgICAgICBzZWFyY2hFbGVtZW50LnNldFRleHQgc2VhcmNoUXVlcnlcbiAgICAgICAgc2VhcmNoRWxlbWVudC5zY2hlZHVsZUxheW91dCgpXG5cbiAgICAgIHNlYXJjaEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IG51bGxcbiAgICAgIGFjdGl2ZU91dGxpbmVFZGl0b3JTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgYWN0aXZlT3V0bGluZUVkaXRvclN1YnNjcmlwdGlvbnMuYWRkIG91dGxpbmVFZGl0b3Iub25EaWRDaGFuZ2VTZWFyY2ggLT4gdXBkYXRlKClcbiAgICAgIGFjdGl2ZU91dGxpbmVFZGl0b3JTdWJzY3JpcHRpb25zLmFkZCBvdXRsaW5lRWRpdG9yLm9uRGlkQ2hhbmdlSG9pc3RlZEl0ZW0gLT4gdXBkYXRlKClcbiAgICAgIHVwZGF0ZSgpXG4gICAgZWxzZVxuICAgICAgc2VhcmNoRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cbiAgICBjb21tYW5kc1N1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIGNvbW1hbmRzU3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgc2VhcmNoRWxlbWVudCxcbiAgICAgICdlZGl0b3I6Y29weS1wYXRoJzogLT5cbiAgICAgICAgZm9sZGluZ1RleHRTZXJ2aWNlLmdldEFjdGl2ZU91dGxpbmVFZGl0b3IoKT8uY29weVBhdGhUb0NsaXBib2FyZCgpXG4gICAgY29tbWFuZHNTdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnZnQtb3V0bGluZS1lZGl0b3Iub3V0bGluZS1tb2RlJyxcbiAgICAgICdjb3JlOmNhbmNlbCc6IChlKSAtPlxuICAgICAgICBzZWFyY2hFbGVtZW50LmZvY3VzVGV4dEVkaXRvcigpXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBjb21tYW5kc1N1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdmdC1vdXRsaW5lLWVkaXRvcicsXG4gICAgICAnZmluZC1hbmQtcmVwbGFjZTpzaG93JzogKGUpIC0+XG4gICAgICAgIHNlYXJjaEVsZW1lbnQuZm9jdXNUZXh0RWRpdG9yKClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgJ2ZpbmQtYW5kLXJlcGxhY2U6c2hvdy1yZXBsYWNlJzogKGUpIC0+XG4gICAgICAgIHNlYXJjaEVsZW1lbnQuZm9jdXNUZXh0RWRpdG9yKClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgbmV3IERpc3Bvc2FibGUgLT5cbiAgICAgIGFjdGl2ZU91dGxpbmVFZGl0b3JTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICBhY3RpdmVPdXRsaW5lRWRpdG9yU3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgICBjb21tYW5kc1N1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICBzZWFyY2hTdGF0dXNCYXJJdGVtLmRlc3Ryb3koKVxuIl19
