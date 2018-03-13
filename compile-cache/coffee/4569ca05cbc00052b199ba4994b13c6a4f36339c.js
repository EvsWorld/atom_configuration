(function() {
  var Promise, TreeView, TreeViewItem, TreeViewUtils, h, hg, log;

  hg = require('mercury');

  h = hg.h;

  Promise = require('bluebird');

  log = function(msg) {};

  TreeView = function(title, loadChildren, arg) {
    var handlers, isRoot, ref;
    ref = arg != null ? arg : {}, handlers = ref.handlers, isRoot = ref.isRoot;
    log("TreeView constructor. title=" + title + ", isRoot=" + isRoot);
    return hg.state({
      isRoot: hg.value(isRoot),
      title: hg.value(title),
      items: hg.array([]),
      isOpen: hg.value(false),
      loading: hg.value(false),
      loaded: hg.value(false),
      channels: {
        click: function(state) {
          log("TreeView event handler for click invoked");
          TreeView.toggle(state);
          return handlers != null ? typeof handlers.click === "function" ? handlers.click(state) : void 0 : void 0;
        },
        dblclick: function(state) {
          log("TreeView event handler for dblclick invoked");
          return handlers != null ? typeof handlers.dblclick === "function" ? handlers.dblclick(state) : void 0 : void 0;
        },
        customEvent: function(state) {
          log("TreeView event handler for customEvent invoked");
          return handlers != null ? typeof handlers.customEvent === "function" ? handlers.customEvent(state) : void 0 : void 0;
        }
      },
      functors: {
        render: TreeView.defaultRender,
        loadChildren: loadChildren
      }
    });
  };

  TreeView.toggle = function(state) {
    log("TreeView.toggle " + (state.isOpen()) + " item count=" + (state.items().length) + " loaded=" + (state.loaded()) + ", loading=" + (state.loading()));
    state.isOpen.set(!state.isOpen());
    if (state.loading() || state.loaded()) {
      return;
    }
    return TreeView.populate(state);
  };

  TreeView.reset = function(state) {
    log("TreeView.reset");
    if (!state.loaded()) {
      return;
    }
    state.items.set([]);
    state.isOpen.set(false);
    state.loaded.set(false);
    state.loading.set(false);
    return log("TreeView.reset: done");
  };

  TreeView.populate = function(state) {
    log("TreeView.populate");
    state.loading.set(true);
    return state.functors.loadChildren(state).then(function(children) {
      log("TreeView.populate: children loaded. count=" + children.length + ")");
      state.items.set(children);
      state.loaded.set(true);
      state.loading.set(false);
      return log("TreeView.populate: all done");
    })["catch"](function(e) {
      log("TreeView.populate:error!!!" + JSON.stringify(e));
      state.loaded.set(false);
      return state.loading.set(false);
    });
  };

  TreeView.render = function(state) {
    var ref;
    return state != null ? (ref = state.functors) != null ? typeof ref.render === "function" ? ref.render(state) : void 0 : void 0 : void 0;
  };

  TreeView.defaultRender = function(state) {
    var ref, result, title;
    log("TreeView.render");
    title = (ref = typeof state.title === "function" ? state.title(state) : void 0) != null ? ref : state.title;
    result = h('li.list-nested-item', {
      className: state.isOpen ? '' : 'collapsed'
    }, [
      h('div.header.list-item' + (state.isRoot ? '.heading' : ''), {
        'ev-click': hg.send(state.channels.click),
        'ev-dblclick': hg.send(state.channels.dblclick)
      }, [title]), h('ul.entries.list-tree', {}, state.items.map(TreeView.render))
    ]);
    if (state.isRoot) {
      result = h('div.debugger-vertical-pane.inset-panel', {}, [h('ul.list-tree.has-collapsable-children', {}, [result])]);
    }
    return result;
  };

  TreeViewItem = function(value, arg) {
    var handlers;
    handlers = (arg != null ? arg : {}).handlers;
    return hg.state({
      value: hg.value(value),
      channels: {
        click: function(state) {
          log("TreeViewItem event handler for click invoked");
          return handlers != null ? typeof handlers.click === "function" ? handlers.click(state) : void 0 : void 0;
        },
        dblclick: function(state) {
          log("TreeViewItem event handler for dblclick invoked");
          return handlers != null ? typeof handlers.dblclick === "function" ? handlers.dblclick(state) : void 0 : void 0;
        }
      },
      functors: {
        render: TreeViewItem.render
      }
    });
  };

  TreeViewItem.render = function(state) {
    var ref;
    return h('li.list-item.entry', {
      'ev-click': hg.send(state.channels.click),
      'ev-dblclick': hg.send(state.channels.dblclick)
    }, [(ref = typeof state.value === "function" ? state.value(state) : void 0) != null ? ref : state.value]);
  };

  TreeViewUtils = (function() {
    function TreeViewUtils() {}

    TreeViewUtils.createFileRefHeader = function(fullPath, line) {
      return function(state) {
        return h("div", {
          title: fullPath,
          style: {
            display: 'inline'
          }
        }, [(atom.project.relativizePath(fullPath)[1]) + " : " + line]);
      };
    };

    return TreeViewUtils;

  })();

  exports.TreeView = TreeView;

  exports.TreeViewItem = TreeViewItem;

  exports.TreeViewUtils = TreeViewUtils;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9Db21wb25lbnRzL1RyZWVWaWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNKLElBQUs7O0VBQ04sT0FBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztFQUVWLEdBQUEsR0FBTSxTQUFDLEdBQUQsR0FBQTs7RUFFTixRQUFBLEdBQVcsU0FBQyxLQUFELEVBQVEsWUFBUixFQUFzQixHQUF0QjtBQUNULFFBQUE7d0JBRCtCLE1BQXVCLElBQXJCLHlCQUFVO0lBQzNDLEdBQUEsQ0FBSSw4QkFBQSxHQUErQixLQUEvQixHQUFxQyxXQUFyQyxHQUFnRCxNQUFwRDtBQUNBLFdBQU8sRUFBRSxDQUFDLEtBQUgsQ0FBUztNQUNaLE1BQUEsRUFBUSxFQUFFLENBQUMsS0FBSCxDQUFTLE1BQVQsQ0FESTtNQUVaLEtBQUEsRUFBTyxFQUFFLENBQUMsS0FBSCxDQUFTLEtBQVQsQ0FGSztNQUdaLEtBQUEsRUFBTyxFQUFFLENBQUMsS0FBSCxDQUFTLEVBQVQsQ0FISztNQUlaLE1BQUEsRUFBUSxFQUFFLENBQUMsS0FBSCxDQUFTLEtBQVQsQ0FKSTtNQUtaLE9BQUEsRUFBUyxFQUFFLENBQUMsS0FBSCxDQUFTLEtBQVQsQ0FMRztNQU1aLE1BQUEsRUFBUSxFQUFFLENBQUMsS0FBSCxDQUFTLEtBQVQsQ0FOSTtNQU9aLFFBQUEsRUFBVTtRQUNSLEtBQUEsRUFDRSxTQUFDLEtBQUQ7VUFDRSxHQUFBLENBQUksMENBQUo7VUFDQSxRQUFRLENBQUMsTUFBVCxDQUFnQixLQUFoQjsyRUFDQSxRQUFRLENBQUUsTUFBTztRQUhuQixDQUZNO1FBTVIsUUFBQSxFQUNFLFNBQUMsS0FBRDtVQUNFLEdBQUEsQ0FBSSw2Q0FBSjs4RUFDQSxRQUFRLENB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aUJmLFlBQVksQ0FBQyxNQUFiLEdBQXNCLFNBQUMsS0FBRDtBQUNwQixRQUFBO1dBQUEsQ0FBQSxDQUFFLG9CQUFGLEVBQXdCO01BQ3RCLFVBQUEsRUFBWSxFQUFFLENBQUMsSUFBSCxDQUFRLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBdkIsQ0FEVTtNQUV0QixhQUFBLEVBQWUsRUFBRSxDQUFDLElBQUgsQ0FBUSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQXZCLENBRk87S0FBeEIsRUFHRyx5RkFBdUIsS0FBSyxDQUFDLEtBQTdCLENBSEg7RUFEb0I7O0VBTWhCOzs7SUFDSixhQUFDLENBQUEsbUJBQUQsR0FBc0IsU0FBQyxRQUFELEVBQVcsSUFBWDtBQUNoQixhQUFPLFNBQUMsS0FBRDtlQUFXLENBQUEsQ0FBRSxLQUFGLEVBQVM7VUFDdkIsS0FBQSxFQUFPLFFBRGdCO1VBRXZCLEtBQUEsRUFDRTtZQUFBLE9BQUEsRUFBUyxRQUFUO1dBSHFCO1NBQVQsRUFLaEIsQ0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixRQUE1QixDQUFzQyxDQUFBLENBQUEsQ0FBdkMsQ0FBQSxHQUEwQyxLQUExQyxHQUErQyxJQUFsRCxDQUxnQjtNQUFYO0lBRFM7Ozs7OztFQVN4QixPQUFPLENBQUMsUUFBUixHQUFtQjs7RUFDbkIsT0FBTyxDQUFDLFlBQVIsR0FBdUI7O0VBQ3ZCLE9BQU8sQ0FBQyxhQUFSLEdBQXdCO0FBMUh4QiIsInNvdXJjZXNDb250ZW50IjpbImhnID0gcmVxdWlyZSAnbWVyY3VyeSdcbntofSA9IGhnXG5Qcm9taXNlID0gcmVxdWlyZSAnYmx1ZWJpcmQnXG5cbmxvZyA9IChtc2cpIC0+ICNjb25zb2xlLmxvZyhtc2cpXG5cblRyZWVWaWV3ID0gKHRpdGxlLCBsb2FkQ2hpbGRyZW4sIHsgaGFuZGxlcnMsIGlzUm9vdCB9ID0ge30pIC0+XG4gIGxvZyBcIlRyZWVWaWV3IGNvbnN0cnVjdG9yLiB0aXRsZT0je3RpdGxlfSwgaXNSb290PSN7aXNSb290fVwiXG4gIHJldHVybiBoZy5zdGF0ZSh7XG4gICAgICBpc1Jvb3Q6IGhnLnZhbHVlKGlzUm9vdClcbiAgICAgIHRpdGxlOiBoZy52YWx1ZSh0aXRsZSlcbiAgICAgIGl0ZW1zOiBoZy5hcnJheShbXSlcbiAgICAgIGlzT3BlbjogaGcudmFsdWUoZmFsc2UpXG4gICAgICBsb2FkaW5nOiBoZy52YWx1ZShmYWxzZSlcbiAgICAgIGxvYWRlZDogaGcudmFsdWUoZmFsc2UpXG4gICAgICBjaGFubmVsczoge1xuICAgICAgICBjbGljazpcbiAgICAgICAgICAoc3RhdGUpIC0+XG4gICAgICAgICAgICBsb2cgXCJUcmVlVmlldyBldmVudCBoYW5kbGVyIGZvciBjbGljayBpbnZva2VkXCJcbiAgICAgICAgICAgIFRyZWVWaWV3LnRvZ2dsZShzdGF0ZSlcbiAgICAgICAgICAgIGhhbmRsZXJzPy5jbGljaz8oc3RhdGUpXG4gICAgICAgIGRibGNsaWNrOlxuICAgICAgICAgIChzdGF0ZSkgLT5cbiAgICAgICAgICAgIGxvZyBcIlRyZWVWaWV3IGV2ZW50IGhhbmRsZXIgZm9yIGRibGNsaWNrIGludm9rZWRcIlxuICAgICAgICAgICAgaGFuZGxlcnM/LmRibGNsaWNrPyhzdGF0ZSlcbiAgICAgICAgY3VzdG9tRXZlbnQ6XG4gICAgICAgICAgKHN0YXRlKSAtPlxuICAgICAgICAgICAgbG9nIFwiVHJlZVZpZXcgZXZlbnQgaGFuZGxlciBmb3IgY3VzdG9tRXZlbnQgaW52b2tlZFwiXG4gICAgICAgICAgICBoYW5kbGVycz8uY3VzdG9tRXZlbnQ/KHN0YXRlKVxuICAgICAgfVxuICAgICAgZnVuY3RvcnM6IHtcbiAgICAgICAgcmVuZGVyOiBUcmVlVmlldy5kZWZhdWx0UmVuZGVyXG4gICAgICAgIGxvYWRDaGlsZHJlbjogbG9hZENoaWxkcmVuXG4gICAgICB9XG4gICAgfSlcblxuVHJlZVZpZXcudG9nZ2xlID0gKHN0YXRlKSAtPlxuICBsb2cgXCJUcmVlVmlldy50b2dnbGUgI3tzdGF0ZS5pc09wZW4oKX0gaXRlbSBjb3VudD0je3N0YXRlLml0ZW1zKCkubGVuZ3RofSBsb2FkZWQ9I3tzdGF0ZS5sb2FkZWQoKX0sIGxvYWRpbmc9I3tzdGF0ZS5sb2FkaW5nKCl9XCJcbiAgc3RhdGUuaXNPcGVuLnNldCghc3RhdGUuaXNPcGVuKCkpXG4gIHJldHVybiBpZiBzdGF0ZS5sb2FkaW5nKCkgb3Igc3RhdGUubG9hZGVkKClcbiAgVHJlZVZpZXcucG9wdWxhdGUoc3RhdGUpXG5cblRyZWVWaWV3LnJlc2V0ID0gKHN0YXRlKSAtPlxuICBsb2cgXCJUcmVlVmlldy5yZXNldFwiXG4gIHJldHVybiB1bmxlc3Mgc3RhdGUubG9hZGVkKClcbiAgc3RhdGUuaXRlbXMuc2V0KFtdKVxuICBzdGF0ZS5pc09wZW4uc2V0KGZhbHNlKVxuICBzdGF0ZS5sb2FkZWQuc2V0KGZhbHNlKVxuICBzdGF0ZS5sb2FkaW5nLnNldChmYWxzZSlcbiAgbG9nIFwiVHJlZVZpZXcucmVzZXQ6IGRvbmVcIlxuXG5UcmVlVmlldy5wb3B1bGF0ZSA9IChzdGF0ZSkgLT5cbiAgbG9nIFwiVHJlZVZpZXcucG9wdWxhdGVcIlxuICBzdGF0ZS5sb2FkaW5nLnNldCh0cnVlKVxuICBzdGF0ZS5mdW5jdG9ycy5sb2FkQ2hpbGRyZW4oc3RhdGUpXG4gIC50aGVuIChjaGlsZHJlbikgLT5cbiAgICBsb2cgXCJUcmVlVmlldy5wb3B1bGF0ZTogY2hpbGRyZW4gbG9hZGVkLiBjb3VudD0je2NoaWxkcmVuLmxlbmd0aH0pXCJcbiAgICBzdGF0ZS5pdGVtcy5zZXQoY2hpbGRyZW4pXG4gICAgc3RhdGUubG9hZGVkLnNldCh0cnVlKVxuICAgIHN0YXRlLmxvYWRpbmcuc2V0KGZhbHNlKVxuICAgIGxvZyBcIlRyZWVWaWV3LnBvcHVsYXRlOiBhbGwgZG9uZVwiXG4gIC5jYXRjaCAoZSkgLT5cbiAgICBsb2coXCJUcmVlVmlldy5wb3B1bGF0ZTplcnJvciEhIVwiICsgSlNPTi5zdHJpbmdpZnkoZSkpXG4gICAgc3RhdGUubG9hZGVkLnNldChmYWxzZSlcbiAgICBzdGF0ZS5sb2FkaW5nLnNldChmYWxzZSlcblxuVHJlZVZpZXcucmVuZGVyID0gKHN0YXRlKSAtPlxuICByZXR1cm4gc3RhdGU/LmZ1bmN0b3JzPy5yZW5kZXI/KHN0YXRlKVxuXG5UcmVlVmlldy5kZWZhdWx0UmVuZGVyID0gKHN0YXRlKSAtPlxuICBsb2cgXCJUcmVlVmlldy5yZW5kZXJcIlxuICB0aXRsZSA9IHN0YXRlLnRpdGxlPyhzdGF0ZSkgPyBzdGF0ZS50aXRsZVxuICByZXN1bHQgPSBoKCdsaS5saXN0LW5lc3RlZC1pdGVtJywge1xuICAgICAgICBjbGFzc05hbWU6IGlmIHN0YXRlLmlzT3BlbiB0aGVuICcnIGVsc2UgJ2NvbGxhcHNlZCdcbiAgICAgIH0sIFtcbiAgICAgICAgaCgnZGl2LmhlYWRlci5saXN0LWl0ZW0nICsgKGlmIHN0YXRlLmlzUm9vdCB0aGVuICcuaGVhZGluZycgZWxzZSAnJyksIHtcbiAgICAgICAgICAnZXYtY2xpY2snOiBoZy5zZW5kIHN0YXRlLmNoYW5uZWxzLmNsaWNrXG4gICAgICAgICAgJ2V2LWRibGNsaWNrJzogaGcuc2VuZCBzdGF0ZS5jaGFubmVscy5kYmxjbGlja1xuICAgICAgICB9LCBbdGl0bGVdKSxcbiAgICAgICAgaCgndWwuZW50cmllcy5saXN0LXRyZWUnLCB7fSwgc3RhdGUuaXRlbXMubWFwKFRyZWVWaWV3LnJlbmRlcikpXG4gICAgICBdKVxuXG4gIHJlc3VsdCA9IGgoJ2Rpdi5kZWJ1Z2dlci12ZXJ0aWNhbC1wYW5lLmluc2V0LXBhbmVsJywge30sIFtcbiAgICAgIGgoJ3VsLmxpc3QtdHJlZS5oYXMtY29sbGFwc2FibGUtY2hpbGRyZW4nLCB7fSwgW3Jlc3VsdF0pXG4gICAgXSkgaWYgc3RhdGUuaXNSb290XG4gIHJldHVybiByZXN1bHRcblxuVHJlZVZpZXdJdGVtID0gKHZhbHVlLCB7IGhhbmRsZXJzIH0gPSB7fSkgLT4gaGcuc3RhdGUoe1xuICAgIHZhbHVlOiBoZy52YWx1ZSh2YWx1ZSlcbiAgICBjaGFubmVsczoge1xuICAgICAgY2xpY2s6XG4gICAgICAgIChzdGF0ZSkgLT5cbiAgICAgICAgICBsb2cgXCJUcmVlVmlld0l0ZW0gZXZlbnQgaGFuZGxlciBmb3IgY2xpY2sgaW52b2tlZFwiXG4gICAgICAgICAgaGFuZGxlcnM/LmNsaWNrPyhzdGF0ZSlcbiAgICAgIGRibGNsaWNrOlxuICAgICAgICAoc3RhdGUpIC0+XG4gICAgICAgICAgbG9nIFwiVHJlZVZpZXdJdGVtIGV2ZW50IGhhbmRsZXIgZm9yIGRibGNsaWNrIGludm9rZWRcIlxuICAgICAgICAgIGhhbmRsZXJzPy5kYmxjbGljaz8oc3RhdGUpXG4gICAgfVxuICAgIGZ1bmN0b3JzOiB7XG4gICAgICByZW5kZXI6IFRyZWVWaWV3SXRlbS5yZW5kZXJcbiAgICB9XG4gIH0pXG5cblRyZWVWaWV3SXRlbS5yZW5kZXIgPSAoc3RhdGUpIC0+XG4gIGgoJ2xpLmxpc3QtaXRlbS5lbnRyeScsIHtcbiAgICAnZXYtY2xpY2snOiBoZy5zZW5kIHN0YXRlLmNoYW5uZWxzLmNsaWNrXG4gICAgJ2V2LWRibGNsaWNrJzogaGcuc2VuZCBzdGF0ZS5jaGFubmVscy5kYmxjbGlja1xuICB9LCBbc3RhdGUudmFsdWU/KHN0YXRlKSA/IHN0YXRlLnZhbHVlXSlcblxuY2xhc3MgVHJlZVZpZXdVdGlsc1xuICBAY3JlYXRlRmlsZVJlZkhlYWRlcjogKGZ1bGxQYXRoLCBsaW5lKSAtPlxuICAgICAgICByZXR1cm4gKHN0YXRlKSAtPiBoKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIHRpdGxlOiBmdWxsUGF0aFxuICAgICAgICAgICAgc3R5bGU6XG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUnXG4gICAgICAgICAgfVxuICAgICAgICAgIFtcIiN7YXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZ1bGxQYXRoKVsxXX0gOiAje2xpbmV9XCJdXG4gICAgICAgIClcblxuZXhwb3J0cy5UcmVlVmlldyA9IFRyZWVWaWV3XG5leHBvcnRzLlRyZWVWaWV3SXRlbSA9IFRyZWVWaWV3SXRlbVxuZXhwb3J0cy5UcmVlVmlld1V0aWxzID0gVHJlZVZpZXdVdGlsc1xuIl19
