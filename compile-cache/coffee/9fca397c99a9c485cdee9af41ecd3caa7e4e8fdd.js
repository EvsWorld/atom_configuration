(function() {
  var Promise, TreeView, TreeViewItem, TreeViewUtils, gotoBreakpoint, h, hg, listeners, log, ref;

  hg = require('mercury');

  Promise = require('bluebird');

  h = hg.h;

  listeners = [];

  log = function(msg) {};

  ref = require('./TreeView'), TreeView = ref.TreeView, TreeViewItem = ref.TreeViewItem, TreeViewUtils = ref.TreeViewUtils;

  gotoBreakpoint = function(breakpoint) {
    return atom.workspace.open(breakpoint.script, {
      initialLine: breakpoint.line,
      initialColumn: 0,
      activatePane: true,
      searchAllPanes: true
    });
  };

  exports.create = function(_debugger) {
    var BreakpointPanel, builder;
    builder = {
      listBreakpoints: function() {
        log("builder.listBreakpoints");
        return Promise.resolve(_debugger.breakpointManager.breakpoints);
      },
      breakpoint: function(breakpoint) {
        log("builder.breakpoint");
        return TreeViewItem(TreeViewUtils.createFileRefHeader(breakpoint.script, breakpoint.line + 1), {
          handlers: {
            click: function() {
              return gotoBreakpoint(breakpoint);
            }
          }
        });
      },
      root: function() {
        return TreeView("Breakpoints", (function() {
          return builder.listBreakpoints().map(builder.breakpoint);
        }), {
          isRoot: true
        });
      }
    };
    BreakpointPanel = function() {
      var refresh, state;
      state = builder.root();
      refresh = function() {
        return TreeView.populate(state);
      };
      listeners.push(_debugger.onAddBreakpoint(refresh));
      listeners.push(_debugger.onRemoveBreakpoint(refresh));
      listeners.push(_debugger.onBreak(refresh));
      return state;
    };
    BreakpointPanel.render = function(state) {
      return TreeView.render(state);
    };
    BreakpointPanel.cleanup = function() {
      var i, len, remove, results;
      results = [];
      for (i = 0, len = listeners.length; i < len; i++) {
        remove = listeners[i];
        results.push(remove());
      }
      return results;
    };
    return BreakpointPanel;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9Db21wb25lbnRzL0JyZWFrUG9pbnRQYW5lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7RUFDVCxJQUFLOztFQUVOLFNBQUEsR0FBWTs7RUFFWixHQUFBLEdBQU0sU0FBQyxHQUFELEdBQUE7O0VBRU4sTUFBMEMsT0FBQSxDQUFRLFlBQVIsQ0FBMUMsRUFBQyx1QkFBRCxFQUFXLCtCQUFYLEVBQXlCOztFQUV6QixjQUFBLEdBQWlCLFNBQUMsVUFBRDtXQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixVQUFVLENBQUMsTUFBL0IsRUFBdUM7TUFDckMsV0FBQSxFQUFhLFVBQVUsQ0FBQyxJQURhO01BRXJDLGFBQUEsRUFBZSxDQUZzQjtNQUdyQyxZQUFBLEVBQWMsSUFIdUI7TUFJckMsY0FBQSxFQUFnQixJQUpxQjtLQUF2QztFQURlOztFQVFqQixPQUFPLENBQUMsTUFBUixHQUFpQixTQUFDLFNBQUQ7QUFFZixRQUFBO0lBQUEsT0FBQSxHQUNFO01BQUEsZUFBQSxFQUFpQixTQUFBO1FBQ2YsR0FBQSxDQUFJLHlCQUFKO2VBQ0EsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFdBQTVDO01BRmUsQ0FBakI7TUFJQSxVQUFBLEVBQVksU0FBQyxVQUFEO1FBQ1YsR0FBQSxDQUFJLG9CQUFKO2VBQ0EsWUFBQSxDQUNFLGFBQWEsQ0FBQyxtQkFBZCxDQUFrQyxVQUFVLENBQUMsTUFBN0MsRUFBcUQsVUFBVSxDQUFDLElBQVgsR0FBZ0IsQ0FBckUsQ0FERixFQUVFO1VBQUEsUUFBQSxFQUFVO1lBQUUsS0FBQSxFQUFPLFNBQUE7cUJBQU0sY0FBQSxDQUFlLFVBQWY7WUFBTixDQUFUO1dBQVY7U0FGRjtNQUZVLENBSlo7TUFVQSxJQUFBLEVBQU0sU0FBQTtlQUNKLFFBQUEsQ0FBUyxhQUFULEVBQXdCLENBQUMsU0FBQTtpQkFBTSxPQUFPLENBQUMsZUFBUixDQUFBLENBQXlCLENBQUMsR0FBMUIsQ0FBOEIsT0FBTyxDQUFDLFVBQXRDO1FBQU4sQ0FBRCxDQUF4QixFQUFtRjtVQUFBLE1BQUEsRUFBUSxJQUFSO1NBQW5GO01BREksQ0FWTjs7SUFhRixlQUFBLEdBQWtCLFNBQUE7QUFDaEIsVUFBQTtNQUFBLEtBQUEsR0FBUSxPQUFPLENBQUMsSUFBUixDQUFBO01BQ1IsT0FBQSxHQUFVLFNBQUE7ZUFBTSxRQUFRLENBQUMsUUFBVCxDQUFrQixLQUFsQjtNQUFOO01BQ1YsU0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFTLENBQUMsZUFBVixDQUEwQixPQUExQixDQUFmO01BQ0EsU0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFTLENBQUMsa0JBQVYsQ0FBNkIsT0FBN0IsQ0FBZjtNQUNBLFNBQVMsQ0FBQyxJQUFWLENBQWUsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsT0FBbEIsQ0FBZjtBQUNBLGFBQU87SUFOUztJQVFsQixlQUFlLENBQUMsTUFBaEIsR0FBeUIsU0FBQyxLQUFEO2FBQ3ZCLFFBQVEsQ0FBQyxNQUFULENBQWdCLEtBQWhCO0lBRHVCO0lBR3pCLGVBQWUsQ0FBQyxPQUFoQixHQUEwQixTQUFBO0FBQ3hCLFVBQUE7QUFBQTtXQUFBLDJDQUFBOztxQkFDRSxNQUFBLENBQUE7QUFERjs7SUFEd0I7QUFJMUIsV0FBTztFQS9CUTtBQWxCakIiLCJzb3VyY2VzQ29udGVudCI6WyJoZyA9IHJlcXVpcmUgJ21lcmN1cnknXG5Qcm9taXNlID0gcmVxdWlyZSAnYmx1ZWJpcmQnXG57aH0gPSBoZ1xuXG5saXN0ZW5lcnMgPSBbXVxuXG5sb2cgPSAobXNnKSAtPiAjY29uc29sZS5sb2cobXNnKVxuXG57VHJlZVZpZXcsIFRyZWVWaWV3SXRlbSwgVHJlZVZpZXdVdGlsc30gPSByZXF1aXJlICcuL1RyZWVWaWV3J1xuXG5nb3RvQnJlYWtwb2ludCA9IChicmVha3BvaW50KSAtPlxuICBhdG9tLndvcmtzcGFjZS5vcGVuKGJyZWFrcG9pbnQuc2NyaXB0LCB7XG4gICAgaW5pdGlhbExpbmU6IGJyZWFrcG9pbnQubGluZVxuICAgIGluaXRpYWxDb2x1bW46IDBcbiAgICBhY3RpdmF0ZVBhbmU6IHRydWVcbiAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZVxuICB9KVxuXG5leHBvcnRzLmNyZWF0ZSA9IChfZGVidWdnZXIpIC0+XG5cbiAgYnVpbGRlciA9XG4gICAgbGlzdEJyZWFrcG9pbnRzOiAoKSAtPlxuICAgICAgbG9nIFwiYnVpbGRlci5saXN0QnJlYWtwb2ludHNcIlxuICAgICAgUHJvbWlzZS5yZXNvbHZlKF9kZWJ1Z2dlci5icmVha3BvaW50TWFuYWdlci5icmVha3BvaW50cylcblxuICAgIGJyZWFrcG9pbnQ6IChicmVha3BvaW50KSAtPlxuICAgICAgbG9nIFwiYnVpbGRlci5icmVha3BvaW50XCJcbiAgICAgIFRyZWVWaWV3SXRlbShcbiAgICAgICAgVHJlZVZpZXdVdGlscy5jcmVhdGVGaWxlUmVmSGVhZGVyIGJyZWFrcG9pbnQuc2NyaXB0LCBicmVha3BvaW50LmxpbmUrMVxuICAgICAgICBoYW5kbGVyczogeyBjbGljazogKCkgLT4gZ290b0JyZWFrcG9pbnQoYnJlYWtwb2ludCkgfVxuICAgICAgKVxuICAgIHJvb3Q6ICgpIC0+XG4gICAgICBUcmVlVmlldyhcIkJyZWFrcG9pbnRzXCIsICgoKSAtPiBidWlsZGVyLmxpc3RCcmVha3BvaW50cygpLm1hcChidWlsZGVyLmJyZWFrcG9pbnQpKSwgaXNSb290OiB0cnVlKVxuXG4gIEJyZWFrcG9pbnRQYW5lbCA9ICgpIC0+XG4gICAgc3RhdGUgPSBidWlsZGVyLnJvb3QoKVxuICAgIHJlZnJlc2ggPSAoKSAtPiBUcmVlVmlldy5wb3B1bGF0ZShzdGF0ZSlcbiAgICBsaXN0ZW5lcnMucHVzaCBfZGVidWdnZXIub25BZGRCcmVha3BvaW50IHJlZnJlc2hcbiAgICBsaXN0ZW5lcnMucHVzaCBfZGVidWdnZXIub25SZW1vdmVCcmVha3BvaW50IHJlZnJlc2hcbiAgICBsaXN0ZW5lcnMucHVzaCBfZGVidWdnZXIub25CcmVhayByZWZyZXNoXG4gICAgcmV0dXJuIHN0YXRlXG5cbiAgQnJlYWtwb2ludFBhbmVsLnJlbmRlciA9IChzdGF0ZSkgLT5cbiAgICBUcmVlVmlldy5yZW5kZXIoc3RhdGUpXG5cbiAgQnJlYWtwb2ludFBhbmVsLmNsZWFudXAgPSAoKSAtPlxuICAgIGZvciByZW1vdmUgaW4gbGlzdGVuZXJzXG4gICAgICByZW1vdmUoKVxuXG4gIHJldHVybiBCcmVha3BvaW50UGFuZWxcbiJdfQ==
