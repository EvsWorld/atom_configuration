(function() {
  var $panel2, $panelBottom, $panelRight, $rootBottom, $rootRight, App, appBottom, appRight, isInited;

  App = require('./Components/App');

  $rootBottom = null;

  $rootRight = null;

  $panelBottom = null;

  $panelRight = null;

  isInited = false;

  $panel2 = null;

  appBottom = null;

  appRight = null;

  exports.show = function(_debugger) {
    if (!isInited) {
      $rootBottom = document.createElement('div');
      $rootRight = document.createElement('div');
      $rootRight.style = "display:flex";
      appBottom = App.startBottom($rootBottom, _debugger);
      appRight = App.startRight($rootRight, _debugger);
    }
    $panelBottom = atom.workspace.addBottomPanel({
      item: $rootBottom
    });
    $panelRight = atom.workspace.addRightPanel({
      item: $rootRight
    });
    return isInited = true;
  };

  exports.hide = function() {
    if ($panelBottom) {
      $panelBottom.destroy();
    }
    if ($panelRight) {
      $panelRight.destroy();
    }
    return atom.workspace.getActivePane().activate();
  };

  exports.destroy = function() {
    exports.hide();
    App.stop();
    isInited = false;
    if ($rootBottom != null) {
      $rootBottom.remove();
    }
    if ($rootRight != null) {
      $rootRight.remove();
    }
    $rootBottom = null;
    return $rootRight = null;
  };

  exports.toggle = function() {
    if (!isInited) {
      return;
    }
    if (!(appBottom.collapsed() && appRight.collapsed())) {
      appBottom.collapsed.set(true);
      return appRight.collapsed.set(true);
    } else {
      appBottom.collapsed.set(false);
      return appRight.collapsed.set(false);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9ub2RlLWRlYnVnZ2VyLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGtCQUFSOztFQUVOLFdBQUEsR0FBYzs7RUFDZCxVQUFBLEdBQWE7O0VBQ2IsWUFBQSxHQUFlOztFQUNmLFdBQUEsR0FBYzs7RUFDZCxRQUFBLEdBQVc7O0VBQ1gsT0FBQSxHQUFVOztFQUNWLFNBQUEsR0FBWTs7RUFDWixRQUFBLEdBQVc7O0VBRVgsT0FBTyxDQUFDLElBQVIsR0FBZSxTQUFDLFNBQUQ7SUFDYixJQUFHLENBQUksUUFBUDtNQUNFLFdBQUEsR0FBYyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNkLFVBQUEsR0FBYSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNiLFVBQVUsQ0FBQyxLQUFYLEdBQW1CO01BQ25CLFNBQUEsR0FBWSxHQUFHLENBQUMsV0FBSixDQUFnQixXQUFoQixFQUE2QixTQUE3QjtNQUNaLFFBQUEsR0FBVyxHQUFHLENBQUMsVUFBSixDQUFlLFVBQWYsRUFBMkIsU0FBM0IsRUFMYjs7SUFPQSxZQUFBLEdBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO01BQUEsSUFBQSxFQUFNLFdBQU47S0FBOUI7SUFDZixXQUFBLEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO01BQUEsSUFBQSxFQUFNLFVBQU47S0FBN0I7V0FDZCxRQUFBLEdBQVc7RUFWRTs7RUFZZixPQUFPLENBQUMsSUFBUixHQUFlLFNBQUE7SUFDYixJQUEwQixZQUExQjtNQUFBLFlBQVksQ0FBQyxPQUFiLENBQUEsRUFBQTs7SUFDQSxJQUF5QixXQUF6QjtNQUFBLFdBQVcsQ0FBQyxPQUFaLENBQUEsRUFBQTs7V0FDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUE7RUFIYTs7RUFLZixPQUFPLENBQUMsT0FBUixHQUFrQixTQUFBO0lBQ2hCLE9BQU8sQ0FBQyxJQUFSLENBQUE7SUFDQSxHQUFHLENBQUMsSUFBSixDQUFBO0lBQ0EsUUFBQSxHQUFXO0lBQ1gsSUFBd0IsbUJBQXhCO01BQUEsV0FBVyxDQUFDLE1BQVosQ0FBQSxFQUFBOztJQUNBLElBQXVCLGtCQUF2QjtNQUFBLFVBQVUsQ0FBQyxNQUFYLENBQUEsRUFBQTs7SUFDQSxXQUFBLEdBQWM7V0FDZCxVQUFBLEdBQWE7RUFQRzs7RUFTbEIsT0FBTyxDQUFDLE1BQVIsR0FBaUIsU0FBQTtJQUNmLElBQUEsQ0FBYyxRQUFkO0FBQUEsYUFBQTs7SUFDQSxJQUFBLENBQUEsQ0FBTyxTQUFTLENBQUMsU0FBVixDQUFBLENBQUEsSUFBMEIsUUFBUSxDQUFDLFNBQVQsQ0FBQSxDQUFqQyxDQUFBO01BQ0UsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFwQixDQUF3QixJQUF4QjthQUNBLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsSUFBdkIsRUFGRjtLQUFBLE1BQUE7TUFJRSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQXBCLENBQXdCLEtBQXhCO2FBQ0EsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixLQUF2QixFQUxGOztFQUZlO0FBckNqQiIsInNvdXJjZXNDb250ZW50IjpbIkFwcCA9IHJlcXVpcmUgJy4vQ29tcG9uZW50cy9BcHAnXG5cbiRyb290Qm90dG9tID0gbnVsbFxuJHJvb3RSaWdodCA9IG51bGxcbiRwYW5lbEJvdHRvbSA9IG51bGxcbiRwYW5lbFJpZ2h0ID0gbnVsbFxuaXNJbml0ZWQgPSBmYWxzZVxuJHBhbmVsMiA9IG51bGxcbmFwcEJvdHRvbSA9IG51bGxcbmFwcFJpZ2h0ID0gbnVsbFxuXG5leHBvcnRzLnNob3cgPSAoX2RlYnVnZ2VyKSAtPlxuICBpZiBub3QgaXNJbml0ZWRcbiAgICAkcm9vdEJvdHRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgJHJvb3RSaWdodCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgJHJvb3RSaWdodC5zdHlsZSA9IFwiZGlzcGxheTpmbGV4XCIgIyBoYWQgdG8gc2V0IGZsZXggaGVyZSB0byBnZXQgdGhlIHNwbGl0dGVyIHRvIGZpbGwgdGhlIHZlcnRpY2FsIHNwYWNlXG4gICAgYXBwQm90dG9tID0gQXBwLnN0YXJ0Qm90dG9tKCRyb290Qm90dG9tLCBfZGVidWdnZXIpXG4gICAgYXBwUmlnaHQgPSBBcHAuc3RhcnRSaWdodCgkcm9vdFJpZ2h0LCBfZGVidWdnZXIpXG5cbiAgJHBhbmVsQm90dG9tID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoaXRlbTogJHJvb3RCb3R0b20pXG4gICRwYW5lbFJpZ2h0ID0gYXRvbS53b3Jrc3BhY2UuYWRkUmlnaHRQYW5lbChpdGVtOiAkcm9vdFJpZ2h0KVxuICBpc0luaXRlZCA9IHRydWVcblxuZXhwb3J0cy5oaWRlID0gLT5cbiAgJHBhbmVsQm90dG9tLmRlc3Ryb3koKSBpZiAkcGFuZWxCb3R0b21cbiAgJHBhbmVsUmlnaHQuZGVzdHJveSgpIGlmICRwYW5lbFJpZ2h0XG4gIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpXG5cbmV4cG9ydHMuZGVzdHJveSA9IC0+XG4gIGV4cG9ydHMuaGlkZSgpXG4gIEFwcC5zdG9wKClcbiAgaXNJbml0ZWQgPSBmYWxzZVxuICAkcm9vdEJvdHRvbS5yZW1vdmUoKSBpZiAkcm9vdEJvdHRvbT9cbiAgJHJvb3RSaWdodC5yZW1vdmUoKSBpZiAkcm9vdFJpZ2h0P1xuICAkcm9vdEJvdHRvbSA9IG51bGxcbiAgJHJvb3RSaWdodCA9IG51bGxcblxuZXhwb3J0cy50b2dnbGUgPSAtPlxuICByZXR1cm4gdW5sZXNzIGlzSW5pdGVkXG4gIHVubGVzcyBhcHBCb3R0b20uY29sbGFwc2VkKCkgYW5kIGFwcFJpZ2h0LmNvbGxhcHNlZCgpXG4gICAgYXBwQm90dG9tLmNvbGxhcHNlZC5zZXQodHJ1ZSlcbiAgICBhcHBSaWdodC5jb2xsYXBzZWQuc2V0KHRydWUpXG4gIGVsc2VcbiAgICBhcHBCb3R0b20uY29sbGFwc2VkLnNldChmYWxzZSlcbiAgICBhcHBSaWdodC5jb2xsYXBzZWQuc2V0KGZhbHNlKVxuIl19
