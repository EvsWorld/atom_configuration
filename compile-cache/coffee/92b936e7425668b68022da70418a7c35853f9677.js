(function() {
  var h, hg;

  hg = require('mercury');

  h = hg.h;

  exports.create = function(_debugger) {
    var cancel;
    cancel = function() {
      return _debugger.cleanup();
    };
    return hg.state({
      channels: {
        cancel: cancel
      }
    });
  };

  exports.render = function(state) {
    return h('button.btn.btn-error.icon-primitive-square', {
      'ev-click': hg.send(state.channels.cancel),
      'title': 'stop debugging'
    }, []);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9Db21wb25lbnRzL0NhbmNlbEJ1dHRvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDSixJQUFLOztFQUVOLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLFNBQUMsU0FBRDtBQUVmLFFBQUE7SUFBQSxNQUFBLEdBQVMsU0FBQTthQUNQLFNBQVMsQ0FBQyxPQUFWLENBQUE7SUFETztXQUdULEVBQUUsQ0FBQyxLQUFILENBQVM7TUFDUCxRQUFBLEVBQVU7UUFDUixNQUFBLEVBQVEsTUFEQTtPQURIO0tBQVQ7RUFMZTs7RUFXakIsT0FBTyxDQUFDLE1BQVIsR0FBaUIsU0FBQyxLQUFEO1dBQ2YsQ0FBQSxDQUFFLDRDQUFGLEVBQWdEO01BQzlDLFVBQUEsRUFBWSxFQUFFLENBQUMsSUFBSCxDQUFRLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBdkIsQ0FEa0M7TUFFOUMsT0FBQSxFQUFTLGdCQUZxQztLQUFoRCxFQUdHLEVBSEg7RUFEZTtBQWRqQiIsInNvdXJjZXNDb250ZW50IjpbImhnID0gcmVxdWlyZSAnbWVyY3VyeSdcbntofSA9IGhnXG5cbmV4cG9ydHMuY3JlYXRlID0gKF9kZWJ1Z2dlcikgLT5cblxuICBjYW5jZWwgPSAoKSAtPlxuICAgIF9kZWJ1Z2dlci5jbGVhbnVwKClcblxuICBoZy5zdGF0ZSh7XG4gICAgY2hhbm5lbHM6IHtcbiAgICAgIGNhbmNlbDogY2FuY2VsXG4gICAgfVxuICB9KVxuXG5leHBvcnRzLnJlbmRlciA9IChzdGF0ZSkgLT5cbiAgaCgnYnV0dG9uLmJ0bi5idG4tZXJyb3IuaWNvbi1wcmltaXRpdmUtc3F1YXJlJywge1xuICAgICdldi1jbGljayc6IGhnLnNlbmQgc3RhdGUuY2hhbm5lbHMuY2FuY2VsXG4gICAgJ3RpdGxlJzogJ3N0b3AgZGVidWdnaW5nJ1xuICB9LCBbXSlcbiJdfQ==
