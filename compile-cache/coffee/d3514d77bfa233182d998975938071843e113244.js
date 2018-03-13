(function() {
  var $, extend, handleDrag, hg;

  hg = require('mercury');

  extend = require('xtend');

  $ = require('atom-space-pen-views').$;

  handleDrag = function(ev, broadcast) {
    var data, delegator, onmove, onup;
    data = this.data;
    delegator = hg.Delegator();
    onmove = function(ev) {
      var delta, docHeight, docWidth, pageX, pageY, statusBarHeight;
      docHeight = $(document).height();
      docWidth = $(document).width();
      pageY = ev.pageY, pageX = ev.pageX;
      statusBarHeight = $('div.status-bar-left').height();
      if (statusBarHeight == null) {
        statusBarHeight = 0;
      }
      delta = {
        height: docHeight - pageY - statusBarHeight,
        sideWidth: docWidth - pageX
      };
      return broadcast(extend(data, delta));
    };
    onup = function(ev) {
      delegator.unlistenTo('mousemove');
      delegator.removeGlobalEventListener('mousemove', onmove);
      return delegator.removeGlobalEventListener('mouseup', onup);
    };
    delegator.listenTo('mousemove');
    delegator.addGlobalEventListener('mousemove', onmove);
    return delegator.addGlobalEventListener('mouseup', onup);
  };

  module.exports = hg.BaseEvent(handleDrag);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9Db21wb25lbnRzL2RyYWctaGFuZGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxNQUFBLEdBQVMsT0FBQSxDQUFRLE9BQVI7O0VBQ1IsSUFBSyxPQUFBLENBQVEsc0JBQVI7O0VBRU4sVUFBQSxHQUFhLFNBQUMsRUFBRCxFQUFLLFNBQUw7QUFDWCxRQUFBO0lBQUEsSUFBQSxHQUFPLElBQUksQ0FBQztJQUNaLFNBQUEsR0FBWSxFQUFFLENBQUMsU0FBSCxDQUFBO0lBRVosTUFBQSxHQUFTLFNBQUMsRUFBRDtBQUNQLFVBQUE7TUFBQSxTQUFBLEdBQVksQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLE1BQVosQ0FBQTtNQUNaLFFBQUEsR0FBVyxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsS0FBWixDQUFBO01BQ1YsZ0JBQUQsRUFBUTtNQUNSLGVBQUEsR0FBa0IsQ0FBQSxDQUFFLHFCQUFGLENBQXdCLENBQUMsTUFBekIsQ0FBQTtNQUNsQixJQUEyQix1QkFBM0I7UUFBQSxlQUFBLEdBQWtCLEVBQWxCOztNQUVBLEtBQUEsR0FBUTtRQUNOLE1BQUEsRUFBUSxTQUFBLEdBQVksS0FBWixHQUFvQixlQUR0QjtRQUVOLFNBQUEsRUFBVyxRQUFBLEdBQVcsS0FGaEI7O2FBS1IsU0FBQSxDQUFVLE1BQUEsQ0FBTyxJQUFQLEVBQWEsS0FBYixDQUFWO0lBWk87SUFjVCxJQUFBLEdBQU8sU0FBQyxFQUFEO01BQ0wsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsV0FBckI7TUFDQSxTQUFTLENBQUMseUJBQVYsQ0FBb0MsV0FBcEMsRUFBaUQsTUFBakQ7YUFDQSxTQUFTLENBQUMseUJBQVYsQ0FBb0MsU0FBcEMsRUFBK0MsSUFBL0M7SUFISztJQU1QLFNBQVMsQ0FBQyxRQUFWLENBQW1CLFdBQW5CO0lBQ0EsU0FBUyxDQUFDLHNCQUFWLENBQWlDLFdBQWpDLEVBQThDLE1BQTlDO1dBQ0EsU0FBUyxDQUFDLHNCQUFWLENBQWlDLFNBQWpDLEVBQTRDLElBQTVDO0VBMUJXOztFQTRCYixNQUFNLENBQUMsT0FBUCxHQUFpQixFQUFFLENBQUMsU0FBSCxDQUFhLFVBQWI7QUFoQ2pCIiwic291cmNlc0NvbnRlbnQiOlsiaGcgPSByZXF1aXJlICdtZXJjdXJ5J1xuZXh0ZW5kID0gcmVxdWlyZSAneHRlbmQnXG57JH0gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuaGFuZGxlRHJhZyA9IChldiwgYnJvYWRjYXN0KSAtPlxuICBkYXRhID0gdGhpcy5kYXRhXG4gIGRlbGVnYXRvciA9IGhnLkRlbGVnYXRvcigpXG5cbiAgb25tb3ZlID0gKGV2KSAtPlxuICAgIGRvY0hlaWdodCA9ICQoZG9jdW1lbnQpLmhlaWdodCgpXG4gICAgZG9jV2lkdGggPSAkKGRvY3VtZW50KS53aWR0aCgpXG4gICAge3BhZ2VZLCBwYWdlWH0gPSBldlxuICAgIHN0YXR1c0JhckhlaWdodCA9ICQoJ2Rpdi5zdGF0dXMtYmFyLWxlZnQnKS5oZWlnaHQoKVxuICAgIHN0YXR1c0JhckhlaWdodCA9IDAgdW5sZXNzIHN0YXR1c0JhckhlaWdodD9cbiAgICBcbiAgICBkZWx0YSA9IHtcbiAgICAgIGhlaWdodDogZG9jSGVpZ2h0IC0gcGFnZVkgLSBzdGF0dXNCYXJIZWlnaHRcbiAgICAgIHNpZGVXaWR0aDogZG9jV2lkdGggLSBwYWdlWFxuICAgIH1cblxuICAgIGJyb2FkY2FzdChleHRlbmQoZGF0YSwgZGVsdGEpKVxuXG4gIG9udXAgPSAoZXYpIC0+XG4gICAgZGVsZWdhdG9yLnVubGlzdGVuVG8gJ21vdXNlbW92ZSdcbiAgICBkZWxlZ2F0b3IucmVtb3ZlR2xvYmFsRXZlbnRMaXN0ZW5lciAnbW91c2Vtb3ZlJywgb25tb3ZlXG4gICAgZGVsZWdhdG9yLnJlbW92ZUdsb2JhbEV2ZW50TGlzdGVuZXIgJ21vdXNldXAnLCBvbnVwXG5cblxuICBkZWxlZ2F0b3IubGlzdGVuVG8gJ21vdXNlbW92ZSdcbiAgZGVsZWdhdG9yLmFkZEdsb2JhbEV2ZW50TGlzdGVuZXIgJ21vdXNlbW92ZScsIG9ubW92ZVxuICBkZWxlZ2F0b3IuYWRkR2xvYmFsRXZlbnRMaXN0ZW5lciAnbW91c2V1cCcsIG9udXBcblxubW9kdWxlLmV4cG9ydHMgPSBoZy5CYXNlRXZlbnQoaGFuZGxlRHJhZylcbiJdfQ==
