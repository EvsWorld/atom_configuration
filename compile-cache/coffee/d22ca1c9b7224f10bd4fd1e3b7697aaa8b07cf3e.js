(function() {
  var ListView, NavigateView, SelectListView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  SelectListView = require("atom-space-pen-views").SelectListView;

  NavigateView = (function() {
    function NavigateView(serializeState) {
      var loading;
      this.element = document.createElement('div');
      this.element.classList.add('navigate');
      loading = document.createElement('span');
      loading.classList.add('loading');
      loading.classList.add('loading-spinner-large');
      loading.classList.add('inline-block');
      this.element.appendChild(loading);
    }

    NavigateView.prototype.serialize = function() {};

    NavigateView.prototype.destroy = function() {
      return this.element.remove();
    };

    NavigateView.prototype.getElement = function() {
      return this.element;
    };

    return NavigateView;

  })();

  ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(items, cb) {
      this.cb = cb;
      ListView.__super__.initialize.apply(this, arguments);
      this.setItems(items);
      atom.workspace.addModalPanel({
        item: this
      });
      return this.focusFilterEditor();
    };

    ListView.prototype.viewForItem = function(item) {
      return "<li>" + item + "</li>";
    };

    ListView.prototype.confirmed = function(item) {
      this.cb(item);
      return this.parent().remove();
    };

    ListView.prototype.cancelled = function() {
      return this.parent().remove();
    };

    return ListView;

  })(SelectListView);

  module.exports = {
    NavigateView: NavigateView,
    ListView: ListView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9uYXZpZ2F0ZS9saWIvbmF2aWdhdGUtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNDQUFBO0lBQUE7OztFQUFDLGlCQUFrQixPQUFBLENBQVEsc0JBQVI7O0VBQ2I7SUFDUyxzQkFBQyxjQUFEO0FBRVgsVUFBQTtNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixVQUF2QjtNQUNBLE9BQUEsR0FBVSxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QjtNQUNWLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsU0FBdEI7TUFDQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQWxCLENBQXNCLHVCQUF0QjtNQUNBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsY0FBdEI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsT0FBckI7SUFSVzs7MkJBVWIsU0FBQSxHQUFXLFNBQUEsR0FBQTs7MkJBR1gsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQTtJQURPOzsyQkFHVCxVQUFBLEdBQVksU0FBQTthQUNWLElBQUMsQ0FBQTtJQURTOzs7Ozs7RUFJUjs7Ozs7Ozt1QkFDSixVQUFBLEdBQVksU0FBQyxLQUFELEVBQU8sRUFBUDtNQUFPLElBQUMsQ0FBQSxLQUFEO01BQ2pCLDBDQUFBLFNBQUE7TUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVY7TUFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7UUFBQSxJQUFBLEVBQUssSUFBTDtPQUE3QjthQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBTlU7O3VCQVFaLFdBQUEsR0FBYSxTQUFDLElBQUQ7YUFDWCxNQUFBLEdBQU8sSUFBUCxHQUFZO0lBREQ7O3VCQUdiLFNBQUEsR0FBVyxTQUFDLElBQUQ7TUFDVCxJQUFDLENBQUEsRUFBRCxDQUFJLElBQUo7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxNQUFWLENBQUE7SUFGUzs7dUJBSVgsU0FBQSxHQUFXLFNBQUE7YUFDVCxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxNQUFWLENBQUE7SUFEUzs7OztLQWhCVTs7RUFtQnZCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUUsY0FBQSxZQUFGO0lBQWUsVUFBQSxRQUFmOztBQXpDakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7U2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZShcImF0b20tc3BhY2UtcGVuLXZpZXdzXCIpXG5jbGFzcyBOYXZpZ2F0ZVZpZXdcbiAgY29uc3RydWN0b3I6IChzZXJpYWxpemVTdGF0ZSkgLT5cbiAgICAjIENyZWF0ZSByb290IGVsZW1lbnRcbiAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbmF2aWdhdGUnKVxuICAgIGxvYWRpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBsb2FkaW5nLmNsYXNzTGlzdC5hZGQoJ2xvYWRpbmcnKVxuICAgIGxvYWRpbmcuY2xhc3NMaXN0LmFkZCgnbG9hZGluZy1zcGlubmVyLWxhcmdlJylcbiAgICBsb2FkaW5nLmNsYXNzTGlzdC5hZGQoJ2lubGluZS1ibG9jaycpXG4gICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQobG9hZGluZylcbiAgIyBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNhbiBiZSByZXRyaWV2ZWQgd2hlbiBwYWNrYWdlIGlzIGFjdGl2YXRlZFxuICBzZXJpYWxpemU6IC0+XG5cbiAgIyBUZWFyIGRvd24gYW55IHN0YXRlIGFuZCBkZXRhY2hcbiAgZGVzdHJveTogLT5cbiAgICBAZWxlbWVudC5yZW1vdmUoKVxuXG4gIGdldEVsZW1lbnQ6IC0+XG4gICAgQGVsZW1lbnRcblxuXG5jbGFzcyBMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChpdGVtcyxAY2IpLT5cbiAgICBzdXBlclxuICAgICMgQGFkZENsYXNzICdvdmVybGF5IGZyb20tdG9wJ1xuICAgIEBzZXRJdGVtcyBpdGVtc1xuICAgICMgYXRvbS53b3Jrc3BhY2VWaWV3LmFwcGVuZChAKVxuICAgIGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwgaXRlbTpAXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICB2aWV3Rm9ySXRlbTogKGl0ZW0pLT5cbiAgICBcIjxsaT4je2l0ZW19PC9saT5cIlxuXG4gIGNvbmZpcm1lZDogKGl0ZW0pLT5cbiAgICBAY2IoaXRlbSlcbiAgICBAcGFyZW50KCkucmVtb3ZlKClcblxuICBjYW5jZWxsZWQ6IC0+XG4gICAgQHBhcmVudCgpLnJlbW92ZSgpXG5cbm1vZHVsZS5leHBvcnRzID0geyBOYXZpZ2F0ZVZpZXcsTGlzdFZpZXd9XG4iXX0=
