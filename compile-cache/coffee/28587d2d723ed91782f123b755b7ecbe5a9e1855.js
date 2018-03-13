(function() {
  var EventEmitter, log;

  EventEmitter = require('events').EventEmitter;

  log = function(msg) {};

  EventEmitter.prototype.subscribe = function(event, handler) {
    var self;
    log("EventEmitter.subscribe");
    self = this;
    self.on(event, handler);
    return (function() {
      return self.removeListener(event, handler);
    });
  };

  EventEmitter.prototype.subscribeDisposable = function(event, handler) {
    var self;
    log("EventEmitter.subscribeDisposable");
    self = this;
    self.on(event, handler);
    return {
      dispose: function() {
        return self.removeListener(event, handler);
      }
    };
  };

  exports.EventEmitter = EventEmitter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9ldmVudGluZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLGVBQWdCLE9BQUEsQ0FBUSxRQUFSOztFQUVqQixHQUFBLEdBQU0sU0FBQyxHQUFELEdBQUE7O0VBRU4sWUFBWSxDQUFBLFNBQUUsQ0FBQSxTQUFkLEdBQTBCLFNBQUMsS0FBRCxFQUFRLE9BQVI7QUFDdEIsUUFBQTtJQUFBLEdBQUEsQ0FBSSx3QkFBSjtJQUNBLElBQUEsR0FBTztJQUNQLElBQUksQ0FBQyxFQUFMLENBQVEsS0FBUixFQUFlLE9BQWY7QUFDQSxXQUFPLENBQUMsU0FBQTthQUFNLElBQUksQ0FBQyxjQUFMLENBQW9CLEtBQXBCLEVBQTJCLE9BQTNCO0lBQU4sQ0FBRDtFQUplOztFQU0xQixZQUFZLENBQUEsU0FBRSxDQUFBLG1CQUFkLEdBQW9DLFNBQUMsS0FBRCxFQUFRLE9BQVI7QUFDaEMsUUFBQTtJQUFBLEdBQUEsQ0FBSSxrQ0FBSjtJQUNBLElBQUEsR0FBTztJQUNQLElBQUksQ0FBQyxFQUFMLENBQVEsS0FBUixFQUFlLE9BQWY7QUFDQSxXQUFPO01BQUUsT0FBQSxFQUFTLFNBQUE7ZUFBRyxJQUFJLENBQUMsY0FBTCxDQUFvQixLQUFwQixFQUEyQixPQUEzQjtNQUFILENBQVg7O0VBSnlCOztFQU1wQyxPQUFPLENBQUMsWUFBUixHQUF1QjtBQWhCdkIiLCJzb3VyY2VzQ29udGVudCI6WyJ7RXZlbnRFbWl0dGVyfSA9IHJlcXVpcmUgJ2V2ZW50cydcblxubG9nID0gKG1zZykgLT4gIyBjb25zb2xlLmxvZyhtc2cpXG5cbkV2ZW50RW1pdHRlcjo6c3Vic2NyaWJlID0gKGV2ZW50LCBoYW5kbGVyKSAtPlxuICAgIGxvZyBcIkV2ZW50RW1pdHRlci5zdWJzY3JpYmVcIlxuICAgIHNlbGYgPSB0aGlzXG4gICAgc2VsZi5vbiBldmVudCwgaGFuZGxlclxuICAgIHJldHVybiAoKCkgLT4gc2VsZi5yZW1vdmVMaXN0ZW5lciBldmVudCwgaGFuZGxlcilcblxuRXZlbnRFbWl0dGVyOjpzdWJzY3JpYmVEaXNwb3NhYmxlID0gKGV2ZW50LCBoYW5kbGVyKSAtPlxuICAgIGxvZyBcIkV2ZW50RW1pdHRlci5zdWJzY3JpYmVEaXNwb3NhYmxlXCJcbiAgICBzZWxmID0gdGhpc1xuICAgIHNlbGYub24gZXZlbnQsIGhhbmRsZXJcbiAgICByZXR1cm4geyBkaXNwb3NlOiAtPiBzZWxmLnJlbW92ZUxpc3RlbmVyIGV2ZW50LCBoYW5kbGVyIH1cblxuZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXJcbiJdfQ==
