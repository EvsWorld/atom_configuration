(function() {
  var $, $$, Keys, SimpleSelectListView, View, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('space-pen'), $ = ref.$, $$ = ref.$$, View = ref.View;

  Keys = {
    Escape: 27,
    Enter: 13,
    Tab: 9
  };

  SimpleSelectListView = (function(superClass) {
    extend(SimpleSelectListView, superClass);

    function SimpleSelectListView() {
      this.confirmSelection = bind(this.confirmSelection, this);
      this.selectNextItemView = bind(this.selectNextItemView, this);
      this.selectPreviousItemView = bind(this.selectPreviousItemView, this);
      return SimpleSelectListView.__super__.constructor.apply(this, arguments);
    }

    SimpleSelectListView.prototype.maxItems = 10;

    SimpleSelectListView.content = function() {
      return this.div({
        "class": "select-list popover-list"
      }, (function(_this) {
        return function() {
          _this.input({
            "class": "hidden-input",
            outlet: "hiddenInput"
          });
          _this.div({
            "class": "select-list-title",
            outlet: "title"
          });
          return _this.ol({
            "class": "list-group",
            outlet: "list"
          });
        };
      })(this));
    };

    SimpleSelectListView.prototype.initialize = function() {
      this.list.on("mousedown", "li", (function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          return _this.selectItemView($(e.target).closest("li"));
        };
      })(this));
      return this.list.on("mouseup", "li", (function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          if ($(e.target).closest("li").hasClass("selected")) {
            return _this.confirmSelection();
          }
        };
      })(this));
    };

    SimpleSelectListView.prototype.selectPreviousItemView = function() {
      var view;
      this.curIndex--;
      view = this.getSelectedItemView().prev();
      if (!view.length) {
        view = this.list.find("li:last");
        this.curIndex = this.items.length - 1;
      }
      this.selectItemView(view);
      return false;
    };

    SimpleSelectListView.prototype.selectNextItemView = function() {
      var view;
      this.curIndex++;
      view = this.getSelectedItemView().next();
      if (!view.length) {
        view = this.list.find("li:first");
        this.curIndex = 0;
      }
      this.selectItemView(view);
      return false;
    };

    SimpleSelectListView.prototype.setItems = function(items) {
      if (items == null) {
        items = [];
      }
      this.items = items;
      return this.populateList();
    };

    SimpleSelectListView.prototype.selectItemView = function(view) {
      if (!view.length) {
        return;
      }
      this.list.find(".selected").removeClass("selected");
      view.addClass("selected");
      return this.scrollToItemView(view);
    };

    SimpleSelectListView.prototype.scrollToItemView = function(view) {
      var desiredBottom, desiredTop, scrollTop;
      scrollTop = this.list.scrollTop();
      desiredTop = view.position().top + scrollTop;
      desiredBottom = desiredTop + view.outerHeight();
      if (desiredTop < scrollTop) {
        return this.list.scrollTop(desiredTop);
      } else {
        return this.list.scrollBottom(desiredBottom);
      }
    };

    SimpleSelectListView.prototype.getSelectedItemView = function() {
      return this.list.find("li.selected");
    };

    SimpleSelectListView.prototype.getSelectedItem = function() {
      return this.items[this.curIndex];
    };

    SimpleSelectListView.prototype.confirmSelection = function() {
      var item;
      item = this.getSelectedItem();
      console.log(item);
      if (item != null) {
        this.confirmed(item);
        return this.cancel();
      } else {
        return this.cancel();
      }
    };

    SimpleSelectListView.prototype.attached = function() {
      console.log('attached called');
      this.active = true;
      return this.hiddenInput.focus();
    };

    SimpleSelectListView.prototype.populateList = function() {
      var i, item, itemView, j, ref1;
      if (this.items == null) {
        return;
      }
      this.list.empty();
      for (i = j = 0, ref1 = Math.min(this.items.length, this.maxItems); 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
        item = this.items[i];
        itemView = this.viewForItem(item);
        this.list.append(itemView);
      }
      this.selectItemView(this.list.find("li:first"));
      return this.curIndex = 0;
    };

    SimpleSelectListView.prototype.viewForItem = function(arg) {
      var word;
      word = arg.word;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            return _this.span(word);
          };
        })(this));
      });
    };

    SimpleSelectListView.prototype.cancel = function() {
      if (!this.active) {
        return;
      }
      this.active = false;
      this.list.empty();
      return this.detach();
    };

    return SimpleSelectListView;

  })(View);

  module.exports = SimpleSelectListView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdG9tLWNzcy1jbGFzcy1jaGVja2VyL2xpYi9TaW1wbGVMaXN0Vmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7Ozs7RUFBQSxNQUFnQixPQUFBLENBQVEsV0FBUixDQUFoQixFQUFDLFNBQUQsRUFBSSxXQUFKLEVBQVE7O0VBR1IsSUFBQSxHQUNFO0lBQUEsTUFBQSxFQUFRLEVBQVI7SUFDQSxLQUFBLEVBQU8sRUFEUDtJQUVBLEdBQUEsRUFBSyxDQUZMOzs7RUFJSTs7Ozs7Ozs7OzttQ0FDSixRQUFBLEdBQVU7O0lBQ1Ysb0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDBCQUFQO09BQUwsRUFBd0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3RDLEtBQUMsQ0FBQSxLQUFELENBQU87WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQVA7WUFBdUIsTUFBQSxFQUFRLGFBQS9CO1dBQVA7VUFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxtQkFBUDtZQUE0QixNQUFBLEVBQVEsT0FBcEM7V0FBTDtpQkFDQSxLQUFDLENBQUEsRUFBRCxDQUFJO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxZQUFQO1lBQXFCLE1BQUEsRUFBUSxNQUE3QjtXQUFKO1FBSHNDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QztJQURROzttQ0FPVixVQUFBLEdBQVksU0FBQTtNQUdWLElBQUMsQ0FBQSxJQUFJLENBQUMsRUFBTixDQUFTLFdBQVQsRUFBc0IsSUFBdEIsRUFBNEIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFDMUIsQ0FBQyxDQUFDLGNBQUYs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U0FBQTtNQUNOLElBQUEsQ0FBYyxJQUFDLENBQUEsTUFBZjtBQUFBLGVBQUE7O01BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUpNOzs7O0tBakl5Qjs7RUF1SW5DLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBL0lqQiIsInNvdXJjZXNDb250ZW50IjpbInskLCAkJCwgVmlld30gPSByZXF1aXJlICdzcGFjZS1wZW4nXG4jIF8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbktleXMgPVxuICBFc2NhcGU6IDI3XG4gIEVudGVyOiAxM1xuICBUYWI6IDlcblxuY2xhc3MgU2ltcGxlU2VsZWN0TGlzdFZpZXcgZXh0ZW5kcyBWaWV3XG4gIG1heEl0ZW1zOiAxMFxuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiBcInNlbGVjdC1saXN0IHBvcG92ZXItbGlzdFwiLCA9PlxuICAgICAgQGlucHV0IGNsYXNzOiBcImhpZGRlbi1pbnB1dFwiLCBvdXRsZXQ6IFwiaGlkZGVuSW5wdXRcIlxuICAgICAgQGRpdiBjbGFzczogXCJzZWxlY3QtbGlzdC10aXRsZVwiLCBvdXRsZXQ6IFwidGl0bGVcIlxuICAgICAgQG9sIGNsYXNzOiBcImxpc3QtZ3JvdXBcIiwgb3V0bGV0OiBcImxpc3RcIlxuXG4gICMgUHJpdmF0ZTogTGlzdGVucyB0byBldmVudHMsIGRlbGVnYXRlcyB0aGVtIHRvIGluc3RhbmNlIG1ldGhvZHNcbiAgaW5pdGlhbGl6ZTogLT5cblxuICAgICMgTGlzdCBtb3VzZSBldmVudHNcbiAgICBAbGlzdC5vbiBcIm1vdXNlZG93blwiLCBcImxpXCIsIChlKSA9PlxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICAgIEBzZWxlY3RJdGVtVmlldyAkKGUudGFyZ2V0KS5jbG9zZXN0KFwibGlcIilcblxuICAgIEBsaXN0Lm9uIFwibW91c2V1cFwiLCBcImxpXCIsIChlKSA9PlxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICAgIGlmICQoZS50YXJnZXQpLmNsb3Nlc3QoXCJsaVwiKS5oYXNDbGFzcyBcInNlbGVjdGVkXCJcbiAgICAgICAgQGNvbmZpcm1TZWxlY3Rpb24oKVxuXG4gICMgUHJpdmF0ZTogU2VsZWN0cyB0aGUgcHJldmlvdXMgaXRlbSB2aWV3XG4gIHNlbGVjdFByZXZpb3VzSXRlbVZpZXc6ID0+XG4gICAgQGN1ckluZGV4LS07XG4gICAgdmlldyA9IEBnZXRTZWxlY3RlZEl0ZW1WaWV3KCkucHJldigpXG4gICAgdW5sZXNzIHZpZXcubGVuZ3RoXG4gICAgICB2aWV3ID0gQGxpc3QuZmluZCBcImxpOmxhc3RcIlxuICAgICAgQGN1ckluZGV4ID0gQGl0ZW1zLmxlbmd0aCAtIDE7XG4gICAgQHNlbGVjdEl0ZW1WaWV3IHZpZXdcblxuICAgIHJldHVybiBmYWxzZVxuXG4gICMgUHJpdmF0ZTogU2VsZWN0cyB0aGUgbmV4dCBpdGVtIHZpZXdcbiAgc2VsZWN0TmV4dEl0ZW1WaWV3OiA9PlxuICAgIEBjdXJJbmRleCsrO1xuICAgIHZpZXcgPSBAZ2V0U2VsZWN0ZWRJdGVtVmlldygpLm5leHQoKVxuICAgIHVubGVzcyB2aWV3Lmxlbmd0aFxuICAgICAgdmlldyA9IEBsaXN0LmZpbmQgXCJsaTpmaXJzdFwiXG4gICAgICBAY3VySW5kZXggPSAwO1xuICAgIEBzZWxlY3RJdGVtVmlldyB2aWV3XG5cbiAgICByZXR1cm4gZmFsc2VcblxuICAjIFByaXZhdGU6IFNldHMgdGhlIGl0ZW1zLCBkaXNwbGF5cyB0aGUgbGlzdFxuICAjXG4gICMgaXRlbXMgLSB7QXJyYXl9IG9mIGl0ZW1zIHRvIGRpc3BsYXlcbiAgc2V0SXRlbXM6IChpdGVtcz1bXSkgLT5cbiAgICBAaXRlbXMgPSBpdGVtc1xuICAgIEBwb3B1bGF0ZUxpc3QoKVxuXG4gICMgUHJpdmF0ZTogVW5zZWxlY3RzIGFsbCB2aWV3cywgc2VsZWN0cyB0aGUgZ2l2ZW4gdmlld1xuICAjXG4gICMgdmlldyAtIHRoZSB7alF1ZXJ5fSB2aWV3IHRvIGJlIHNlbGVjdGVkXG4gIHNlbGVjdEl0ZW1WaWV3OiAodmlldykgLT5cbiAgICByZXR1cm4gdW5sZXNzIHZpZXcubGVuZ3RoXG5cbiAgICBAbGlzdC5maW5kKFwiLnNlbGVjdGVkXCIpLnJlbW92ZUNsYXNzIFwic2VsZWN0ZWRcIlxuICAgIHZpZXcuYWRkQ2xhc3MgXCJzZWxlY3RlZFwiXG4gICAgQHNjcm9sbFRvSXRlbVZpZXcgdmlld1xuXG4gICMgUHJpdmF0ZTogU2V0cyB0aGUgc2Nyb2xsIHBvc2l0aW9uIHRvIG1hdGNoIHRoZSBnaXZlbiB2aWV3J3MgcG9zaXRpb25cbiAgI1xuICAjIHZpZXcgLSB0aGUge2pRdWVyeX0gdmlldyB0byBzY3JvbGwgdG9cbiAgc2Nyb2xsVG9JdGVtVmlldzogKHZpZXcpIC0+XG4gICAgc2Nyb2xsVG9wID0gQGxpc3Quc2Nyb2xsVG9wKClcbiAgICBkZXNpcmVkVG9wID0gdmlldy5wb3NpdGlvbigpLnRvcCArIHNjcm9sbFRvcFxuICAgIGRlc2lyZWRCb3R0b20gPSBkZXNpcmVkVG9wICsgdmlldy5vdXRlckhlaWdodCgpXG5cbiAgICBpZiBkZXNpcmVkVG9wIDwgc2Nyb2xsVG9wXG4gICAgICBAbGlzdC5zY3JvbGxUb3AgZGVzaXJlZFRvcFxuICAgIGVsc2VcbiAgICAgIEBsaXN0LnNjcm9sbEJvdHRvbSBkZXNpcmVkQm90dG9tXG5cbiAgIyBQcml2YXRlOiBHZXQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBpdGVtIHZpZXdcbiAgI1xuICAjIFJldHVybnMgdGhlIHNlbGVjdGVkIHtqUXVlcnl9IHZpZXdcbiAgZ2V0U2VsZWN0ZWRJdGVtVmlldzogLT5cbiAgICBAbGlzdC5maW5kIFwibGkuc2VsZWN0ZWRcIlxuXG4gICMgUHJpdmF0ZTogR2V0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgaXRlbSAoKm5vdCogdGhlIHZpZXcpXG4gICNcbiAgIyBSZXR1cm5zIHRoZSBzZWxlY3RlZCB7T2JqZWN0fVxuICBnZXRTZWxlY3RlZEl0ZW06IC0+XG4gICAgQGl0ZW1zW0BjdXJJbmRleF1cbiAgIyBQcml2YXRlOiBDb25maXJtcyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGl0ZW0gb3IgY2FuY2VscyB0aGUgbGlzdCB2aWV3XG4gICMgaWYgbm8gaXRlbSBoYXMgYmVlbiBzZWxlY3RlZFxuICBjb25maXJtU2VsZWN0aW9uOiA9PlxuICAgIGl0ZW0gPSBAZ2V0U2VsZWN0ZWRJdGVtKClcbiAgICBjb25zb2xlLmxvZyBpdGVtXG4gICAgaWYgaXRlbT9cbiAgICAgIEBjb25maXJtZWQgaXRlbVxuICAgICAgQGNhbmNlbCgpXG4gICAgZWxzZVxuICAgICAgQGNhbmNlbCgpXG5cbiAgYXR0YWNoZWQ6LT5cbiAgICBjb25zb2xlLmxvZyAnYXR0YWNoZWQgY2FsbGVkJ1xuICAgIEBhY3RpdmUgPSB0cnVlXG4gICAgQGhpZGRlbklucHV0LmZvY3VzKClcblxuXG4gICMgUHJpdmF0ZTogUmUtYnVpbGRzIHRoZSBsaXN0IHdpdGggdGhlIGN1cnJlbnQgaXRlbXNcbiAgcG9wdWxhdGVMaXN0OiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGl0ZW1zP1xuXG4gICAgQGxpc3QuZW1wdHkoKVxuICAgIGZvciBpIGluIFswLi4uTWF0aC5taW4oQGl0ZW1zLmxlbmd0aCwgQG1heEl0ZW1zKV1cbiAgICAgIGl0ZW0gPSBAaXRlbXNbaV1cbiAgICAgIGl0ZW1WaWV3ID0gQHZpZXdGb3JJdGVtIGl0ZW1cbiAgICAgIEBsaXN0LmFwcGVuZCBpdGVtVmlld1xuXG4gICAgQHNlbGVjdEl0ZW1WaWV3IEBsaXN0LmZpbmQgXCJsaTpmaXJzdFwiXG4gICAgQGN1ckluZGV4ID0gMDtcblxuICAjIFByaXZhdGU6IENyZWF0ZXMgYSB2aWV3IGZvciB0aGUgZ2l2ZW4gaXRlbVxuICAjXG4gICMgd29yZCAtIHRoZSBpdGVtXG4gICNcbiAgIyBSZXR1cm5zIHRoZSB7alF1ZXJ5fSB2aWV3IGZvciB0aGUgaXRlbVxuICB2aWV3Rm9ySXRlbTogKHt3b3JkfSkgLT5cbiAgICAkJCAtPlxuICAgICAgQGxpID0+XG4gICAgICAgIEBzcGFuIHdvcmRcblxuICAjIFByaXZhdGU6IENsZWFycyB0aGUgbGlzdCwgZGV0YWNoZXMgdGhlIGVsZW1lbnRcbiAgY2FuY2VsOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGFjdGl2ZVxuICAgIEBhY3RpdmUgPSBmYWxzZVxuICAgIEBsaXN0LmVtcHR5KClcbiAgICBAZGV0YWNoKClcblxubW9kdWxlLmV4cG9ydHMgPSBTaW1wbGVTZWxlY3RMaXN0Vmlld1xuIl19
