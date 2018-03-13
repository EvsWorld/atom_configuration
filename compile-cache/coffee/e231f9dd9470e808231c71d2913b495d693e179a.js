(function() {
  var $, FavView, SelectListView, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), View = ref.View, SelectListView = ref.SelectListView;

  $ = require('jquery');

  FavView = (function(superClass) {
    extend(FavView, superClass);

    function FavView() {
      return FavView.__super__.constructor.apply(this, arguments);
    }

    FavView.prototype.initialize = function(items) {
      this.items = items;
      FavView.__super__.initialize.apply(this, arguments);
      this.addClass('overlay from-top');
      this.setItems(this.items);
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    FavView.prototype.viewForItem = function(item) {
      var ref1, ref2;
      if (!item.favIcon) {
        item.favIcon = (ref1 = window.bp.js.get('bp.favIcon')) != null ? ref1[item.url] : void 0;
      }
      return "<li><img src='" + item.favIcon + "'width='20' height='20' >&nbsp; &nbsp; " + ((ref2 = item.title) != null ? ref2.slice(0, 31) : void 0) + "</li>";
    };

    FavView.prototype.confirmed = function(item) {
      atom.workspace.open(item.url, {
        split: 'left',
        searchAllPanes: true
      });
      return this.parent().remove();
    };

    FavView.prototype.cancelled = function() {
      return this.parent().remove();
    };

    FavView.prototype.getFilterKey = function() {
      return "title";
    };

    return FavView;

  })(SelectListView);

  module.exports = FavView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9icm93c2VyLXBsdXMvbGliL2Zhdi12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEscUNBQUE7SUFBQTs7O0VBQUEsTUFBd0IsT0FBQSxDQUFRLHNCQUFSLENBQXhCLEVBQUMsZUFBRCxFQUFNOztFQUVOLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFDRTs7Ozs7OztzQkFDSixVQUFBLEdBQVksU0FBQyxLQUFEO01BQUMsSUFBQyxDQUFBLFFBQUQ7TUFDWCx5Q0FBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxrQkFBVjtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLEtBQVg7O1FBQ0EsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFLLElBQUw7U0FBN0I7O01BQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQU5VOztzQkFRWixXQUFBLEdBQWEsU0FBQyxJQUFEO0FBQ1QsVUFBQTtNQUFBLElBQUEsQ0FBTyxJQUFJLENBQUMsT0FBWjtRQUNFLElBQUksQ0FBQyxPQUFMLHlEQUErQyxDQUFBLElBQUksQ0FBQyxHQUFMLFdBRGpEOzthQUVBLGdCQUFBLEdBQWlCLElBQUksQ0FBQyxPQUF0QixHQUE4Qix5Q0FBOUIsR0FBc0UsbUNBQWEsc0JBQWIsQ0FBdEUsR0FBMEY7SUFIakY7O3NCQUtiLFNBQUEsR0FBVyxTQUFDLElBQUQ7TUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBSSxDQUFDLEdBQXpCLEVBQThCO1FBQUMsS0FBQSxFQUFNLE1BQVA7UUFBYyxjQUFBLEVBQWUsSUFBN0I7T0FBOUI7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxNQUFWLENBQUE7SUFGTzs7c0JBSVgsU0FBQSxHQUFXLFNBQUE7YUFDVCxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxNQUFWLENBQUE7SUFEUzs7c0JBR1gsWUFBQSxHQUFjLFNBQUE7YUFDWjtJQURZOzs7O0tBckJNOztFQXVCdEIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUExQmpCIiwic291cmNlc0NvbnRlbnQiOlsie1ZpZXcsU2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbiQgPSByZXF1aXJlICdqcXVlcnknXG5jbGFzcyBGYXZWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgaW5pdGlhbGl6ZTogKEBpdGVtcyktPlxuICAgIHN1cGVyXG4gICAgQGFkZENsYXNzICdvdmVybGF5IGZyb20tdG9wJ1xuICAgIEBzZXRJdGVtcyBAaXRlbXNcbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCBpdGVtOkBcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICB2aWV3Rm9ySXRlbTogKGl0ZW0pLT5cbiAgICAgIHVubGVzcyBpdGVtLmZhdkljb25cbiAgICAgICAgaXRlbS5mYXZJY29uID0gd2luZG93LmJwLmpzLmdldCgnYnAuZmF2SWNvbicpP1tpdGVtLnVybF1cbiAgICAgIFwiPGxpPjxpbWcgc3JjPScje2l0ZW0uZmF2SWNvbn0nd2lkdGg9JzIwJyBoZWlnaHQ9JzIwJyA+Jm5ic3A7ICZuYnNwOyAje2l0ZW0udGl0bGU/WzAuLjMwXX08L2xpPlwiXG5cbiAgY29uZmlybWVkOiAoaXRlbSktPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBpdGVtLnVybCwge3NwbGl0OidsZWZ0JyxzZWFyY2hBbGxQYW5lczp0cnVlfVxuICAgICAgQHBhcmVudCgpLnJlbW92ZSgpXG5cbiAgY2FuY2VsbGVkOiAtPlxuICAgIEBwYXJlbnQoKS5yZW1vdmUoKVxuXG4gIGdldEZpbHRlcktleTogLT5cbiAgICBcInRpdGxlXCJcbm1vZHVsZS5leHBvcnRzID0gRmF2Vmlld1xuIl19
