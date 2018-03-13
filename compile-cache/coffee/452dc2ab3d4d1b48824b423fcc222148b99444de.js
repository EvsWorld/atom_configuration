(function() {
  var CompositeDisposable, Disposable, foldingTextService, ref;

  foldingTextService = require('../foldingtext-service');

  ref = require('atom'), Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  exports.consumeStatusBarService = function(statusBar) {
    var activeOutlineEditorSubscription, activeOutlineEditorSubscriptions, hoistElement, locationStatusBarItem;
    hoistElement = document.createElement('a');
    hoistElement.className = 'ft-location-status-bar-item icon-location inline-block';
    hoistElement.addEventListener('click', function(e) {
      var ref1;
      return (ref1 = foldingTextService.getActiveOutlineEditor()) != null ? ref1.unhoist() : void 0;
    });
    locationStatusBarItem = statusBar.addLeftTile({
      item: hoistElement,
      priority: 0
    });
    activeOutlineEditorSubscriptions = null;
    activeOutlineEditorSubscription = foldingTextService.observeActiveOutlineEditor(function(outlineEditor) {
      var update;
      if (activeOutlineEditorSubscriptions != null) {
        activeOutlineEditorSubscriptions.dispose();
      }
      if (outlineEditor) {
        update = function() {
          var hoistedItem;
          hoistedItem = outlineEditor.getHoistedItem();
          return hoistElement.classList.toggle('active', !hoistedItem.isRoot);
        };
        hoistElement.style.display = null;
        activeOutlineEditorSubscriptions = new CompositeDisposable();
        activeOutlineEditorSubscriptions.add(outlineEditor.onDidChangeSearch(function() {
          return update();
        }));
        activeOutlineEditorSubscriptions.add(outlineEditor.onDidChangeHoistedItem(function() {
          return update();
        }));
        return update();
      } else {
        return hoistElement.style.display = 'none';
      }
    });
    return new Disposable(function() {
      activeOutlineEditorSubscription.dispose();
      if (activeOutlineEditorSubscriptions != null) {
        activeOutlineEditorSubscriptions.dispose();
      }
      return locationStatusBarItem.destroy();
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9mb2xkaW5ndGV4dC1mb3ItYXRvbS9saWIvZXh0ZW5zaW9ucy9sb2NhdGlvbi1zdGF0dXMtYmFyLWl0ZW0uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUEsTUFBQTs7RUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVI7O0VBQ3JCLE1BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsMkJBQUQsRUFBYTs7RUFFYixPQUFPLENBQUMsdUJBQVIsR0FBa0MsU0FBQyxTQUFEO0FBQ2hDLFFBQUE7SUFBQSxZQUFBLEdBQWUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkI7SUFDZixZQUFZLENBQUMsU0FBYixHQUF5QjtJQUN6QixZQUFZLENBQUMsZ0JBQWIsQ0FBOEIsT0FBOUIsRUFBdUMsU0FBQyxDQUFEO0FBQ3JDLFVBQUE7Z0ZBQTJDLENBQUUsT0FBN0MsQ0FBQTtJQURxQyxDQUF2QztJQUdBLHFCQUFBLEdBQXdCLFNBQVMsQ0FBQyxXQUFWLENBQXNCO01BQUEsSUFBQSxFQUFNLFlBQU47TUFBb0IsUUFBQSxFQUFVLENBQTlCO0tBQXRCO0lBRXhCLGdDQUFBLEdBQW1DO0lBQ25DLCtCQUFBLEdBQWtDLGtCQUFrQixDQUFDLDBCQUFuQixDQUE4QyxTQUFDLGFBQUQ7QUFDOUUsVUFBQTs7UUFBQSxnQ0FBZ0MsQ0FBRSxPQUFsQyxDQUFBOztNQUNBLElBQUcsYUFBSDtRQUNFLE1BQUEsR0FBUyxTQUFBO0FBQ1AsY0FBQTtVQUFBLFdBQUEsR0FBYyxhQUFhLENBQUMsY0FBZCxDQUFBO2lCQUNkLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBdkIsQ0FBOEIsUUFBOUIsRUFBd0MsQ0FBSSxXQUFXLENBQUMsTUFBeEQ7UUFGTztRQUlULFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBbkIsR0FBNkI7UUFDN0IsZ0NBQUEsR0FBdUMsSUFBQSxtQkFBQSxDQUFBO1FBQ3ZDLGdDQUFnQyxDQUFDLEdBQWpDLENBQXFDLGFBQWEsQ0FBQyxpQkFBZCxDQUFnQyxTQUFBO2lCQUFHLE1BQUEsQ0FBQTtRQUFILENBQWhDLENBQXJDO1FBQ0EsZ0NBQWdDLENBQUMsR0FBakMsQ0FBcUMsYUFBYSxDQUFDLHNCQUFkLENBQXFDLFNBQUE7aUJBQUcsTUFBQSxDQUFBO1FBQUgsQ0FBckMsQ0FBckM7ZUFDQSxNQUFBLENBQUEsRUFURjtPQUFBLE1BQUE7ZUFXRSxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQW5CLEdBQTZCLE9BWC9COztJQUY4RSxDQUE5QztXQWU5QixJQUFBLFVBQUEsQ0FBVyxTQUFBO01BQ2IsK0JBQStCLENBQUMsT0FBaEMsQ0FBQTs7UUFDQSxnQ0FBZ0MsQ0FBRSxPQUFsQyxDQUFBOzthQUNBLHFCQUFxQixDQUFDLE9BQXRCLENBQUE7SUFIYSxDQUFYO0VBeEI0QjtBQUhsQyIsInNvdXJjZXNDb250ZW50IjpbIiMgQ29weXJpZ2h0IChjKSAyMDE1IEplc3NlIEdyb3NqZWFuLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG5mb2xkaW5nVGV4dFNlcnZpY2UgPSByZXF1aXJlICcuLi9mb2xkaW5ndGV4dC1zZXJ2aWNlJ1xue0Rpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxuZXhwb3J0cy5jb25zdW1lU3RhdHVzQmFyU2VydmljZSA9IChzdGF0dXNCYXIpIC0+XG4gIGhvaXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2EnXG4gIGhvaXN0RWxlbWVudC5jbGFzc05hbWUgPSAnZnQtbG9jYXRpb24tc3RhdHVzLWJhci1pdGVtIGljb24tbG9jYXRpb24gaW5saW5lLWJsb2NrJ1xuICBob2lzdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnY2xpY2snLCAoZSkgLT5cbiAgICBmb2xkaW5nVGV4dFNlcnZpY2UuZ2V0QWN0aXZlT3V0bGluZUVkaXRvcigpPy51bmhvaXN0KClcblxuICBsb2NhdGlvblN0YXR1c0Jhckl0ZW0gPSBzdGF0dXNCYXIuYWRkTGVmdFRpbGUoaXRlbTogaG9pc3RFbGVtZW50LCBwcmlvcml0eTogMClcblxuICBhY3RpdmVPdXRsaW5lRWRpdG9yU3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgYWN0aXZlT3V0bGluZUVkaXRvclN1YnNjcmlwdGlvbiA9IGZvbGRpbmdUZXh0U2VydmljZS5vYnNlcnZlQWN0aXZlT3V0bGluZUVkaXRvciAob3V0bGluZUVkaXRvcikgLT5cbiAgICBhY3RpdmVPdXRsaW5lRWRpdG9yU3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgaWYgb3V0bGluZUVkaXRvclxuICAgICAgdXBkYXRlID0gLT5cbiAgICAgICAgaG9pc3RlZEl0ZW0gPSBvdXRsaW5lRWRpdG9yLmdldEhvaXN0ZWRJdGVtKClcbiAgICAgICAgaG9pc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUgJ2FjdGl2ZScsIG5vdCBob2lzdGVkSXRlbS5pc1Jvb3RcblxuICAgICAgaG9pc3RFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBudWxsXG4gICAgICBhY3RpdmVPdXRsaW5lRWRpdG9yU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAgIGFjdGl2ZU91dGxpbmVFZGl0b3JTdWJzY3JpcHRpb25zLmFkZCBvdXRsaW5lRWRpdG9yLm9uRGlkQ2hhbmdlU2VhcmNoIC0+IHVwZGF0ZSgpXG4gICAgICBhY3RpdmVPdXRsaW5lRWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQgb3V0bGluZUVkaXRvci5vbkRpZENoYW5nZUhvaXN0ZWRJdGVtIC0+IHVwZGF0ZSgpXG4gICAgICB1cGRhdGUoKVxuICAgIGVsc2VcbiAgICAgIGhvaXN0RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cbiAgbmV3IERpc3Bvc2FibGUgLT5cbiAgICBhY3RpdmVPdXRsaW5lRWRpdG9yU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIGFjdGl2ZU91dGxpbmVFZGl0b3JTdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBsb2NhdGlvblN0YXR1c0Jhckl0ZW0uZGVzdHJveSgpIl19
