(function() {
  var StatusView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('atom-space-pen-views').View;

  module.exports = StatusView = (function(superClass) {
    extend(StatusView, superClass);

    function StatusView() {
      return StatusView.__super__.constructor.apply(this, arguments);
    }

    StatusView.content = function(params) {
      return this.div({
        "class": 'browser-refresh-view'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": "type-" + params.type
          }, 'Browser Refresh: ' + params.message);
        };
      })(this));
    };

    StatusView.prototype.destroy = function() {};

    return StatusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9icm93c2VyLXJlZnJlc2gvbGliL3N0YXR1cy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsZ0JBQUE7SUFBQTs7O0VBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDUTs7Ozs7OztJQUNKLFVBQUMsQ0FBQSxPQUFELEdBQVcsU0FBQyxNQUFEO2FBQ1QsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sc0JBQVA7T0FBTCxFQUFvQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2xDLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLE9BQUEsR0FBUSxNQUFNLENBQUMsSUFBdEI7V0FBTCxFQUFtQyxtQkFBQSxHQUFzQixNQUFNLENBQUMsT0FBaEU7UUFEa0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDO0lBRFM7O3lCQUlYLE9BQUEsR0FBUyxTQUFBLEdBQUE7Ozs7S0FMYztBQUgzQiIsInNvdXJjZXNDb250ZW50IjpbIntWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNsYXNzIFN0YXR1c1ZpZXcgZXh0ZW5kcyBWaWV3XG4gICAgQGNvbnRlbnQgPSAocGFyYW1zKSAtPlxuICAgICAgQGRpdiBjbGFzczogJ2Jyb3dzZXItcmVmcmVzaC12aWV3JywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogXCJ0eXBlLSN7cGFyYW1zLnR5cGV9XCIsICdCcm93c2VyIFJlZnJlc2g6ICcgKyBwYXJhbXMubWVzc2FnZVxuXG4gICAgZGVzdHJveTogLT5cbiJdfQ==
