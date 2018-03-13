(function() {
  var activate, deactivate, exec, subs;

  exec = require('child_process').exec;

  subs = null;

  activate = (function(_this) {
    return function() {
      var sp;
      sp = require('simple-plist');
      return subs = atom.workspace.observeTextEditors(function(editor) {
        var data, format, line, plist, ref, scopeName;
        plist = editor.getPath();
        scopeName = editor.getGrammar().scopeName;
        if (/plist|strings/.test(scopeName)) {
          line = (ref = editor.buffer) != null ? ref.getLines()[0] : void 0;
          switch (false) {
            case !(line != null ? line.startsWith('bplist00') : void 0):
              data = sp.readFileSync(plist);
              format = 'binary1';
              break;
            case !(line != null ? line.startsWith('{') : void 0):
              data = JSON.parse(editor.getText());
              format = 'json';
              break;
            default:
              return;
          }
          editor.save();
          editor.setGrammar(atom.grammars.grammarForScopeName('text.xml.plist'));
          editor.setText(sp.stringify(data));
          return editor.onDidDestroy(function() {
            return exec("plutil -convert " + format + " '" + plist + "'");
          });
        }
      });
    };
  })(this);

  deactivate = (function(_this) {
    return function() {
      return subs.dispose();
    };
  })(this);

  module.exports = {
    activate: activate,
    deactivate: deactivate
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9wbGlzdC1jb252ZXJ0ZXIvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxlQUFSOztFQUVULElBQUEsR0FBTzs7RUFDUCxRQUFBLEdBQVcsQ0FBQSxTQUFBLEtBQUE7V0FBQSxTQUFBO0FBQ1QsVUFBQTtNQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsY0FBUjthQUNMLElBQUEsR0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRDtBQUN2QyxZQUFBO1FBQUEsS0FBQSxHQUFRLE1BQU0sQ0FBQyxPQUFQLENBQUE7UUFDUCxZQUFhLE1BQU0sQ0FBQyxVQUFQLENBQUE7UUFFZCxJQUFHLGVBQWUsQ0FBQyxJQUFoQixDQUFxQixTQUFyQixDQUFIO1VBQ0csMENBQXFCLENBQUUsUUFBZixDQUFBO0FBQ1Qsa0JBQUEsS0FBQTtBQUFBLGtDQUNPLElBQUksQ0FBRSxVQUFOLENBQWlCLFVBQWpCLFdBRFA7Y0FFSSxJQUFBLEdBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsS0FBaEI7Y0FDUCxNQUFBLEdBQVM7O0FBSGIsa0NBS08sSUFBSSxDQUFFLFVBQU4sQ0FBaUIsR0FBakIsV0FMUDtjQU1JLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBWDtjQUNQLE1BQUEsR0FBUzs7QUFQYjtBQVFPO0FBUlA7VUFVQSxNQUFNLENBQUMsSUFBUCxDQUFBO1VBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxnQkFBbEMsQ0FBbEI7VUFDQSxNQUFNLENBQUMsT0FBUCxDQUFlLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBYixDQUFmO2lCQUVBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFNBQUE7bUJBQ2xCLElBQUEsQ0FBSyxrQkFBQSxHQUFtQixNQUFuQixHQUEwQixJQUExQixHQUE4QixLQUE5QixHQUFvQyxHQUF6QztVQURrQixDQUFwQixFQWhCRjs7TUFKdUMsQ0FBbEM7SUFGRTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7O0VBeUJYLFVBQUEsR0FBYSxDQUFBLFNBQUEsS0FBQTtXQUFBLFNBQUE7YUFBRyxJQUFJLENBQUMsT0FBTCxDQUFBO0lBQUg7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUMsVUFBQSxRQUFEO0lBQVcsWUFBQSxVQUFYOztBQTlCakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7ZXhlY30gPSByZXF1aXJlICdjaGlsZF9wcm9jZXNzJ1xuXG5zdWJzID0gbnVsbFxuYWN0aXZhdGUgPSA9PlxuICBzcCA9IHJlcXVpcmUgJ3NpbXBsZS1wbGlzdCdcbiAgc3VicyA9IGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgIHBsaXN0ID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIHtzY29wZU5hbWV9ID0gZWRpdG9yLmdldEdyYW1tYXIoKVxuXG4gICAgaWYgL3BsaXN0fHN0cmluZ3MvLnRlc3Qgc2NvcGVOYW1lXG4gICAgICBbbGluZV0gPSBlZGl0b3IuYnVmZmVyPy5nZXRMaW5lcygpXG4gICAgICBzd2l0Y2hcbiAgICAgICAgd2hlbiBsaW5lPy5zdGFydHNXaXRoICdicGxpc3QwMCdcbiAgICAgICAgICBkYXRhID0gc3AucmVhZEZpbGVTeW5jIHBsaXN0XG4gICAgICAgICAgZm9ybWF0ID0gJ2JpbmFyeTEnXG5cbiAgICAgICAgd2hlbiBsaW5lPy5zdGFydHNXaXRoICd7J1xuICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlIGVkaXRvci5nZXRUZXh0KClcbiAgICAgICAgICBmb3JtYXQgPSAnanNvbidcbiAgICAgICAgZWxzZSByZXR1cm5cblxuICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgZWRpdG9yLnNldEdyYW1tYXIgYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lICd0ZXh0LnhtbC5wbGlzdCdcbiAgICAgIGVkaXRvci5zZXRUZXh0IHNwLnN0cmluZ2lmeSBkYXRhXG5cbiAgICAgIGVkaXRvci5vbkRpZERlc3Ryb3kgPT4gIyBSZWNvbXBpbGUgdG8gb3JpZ2luYWwgZm9ybWF0LlxuICAgICAgICBleGVjIFwicGx1dGlsIC1jb252ZXJ0ICN7Zm9ybWF0fSAnI3twbGlzdH0nXCJcblxuZGVhY3RpdmF0ZSA9ID0+IHN1YnMuZGlzcG9zZSgpXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSB7YWN0aXZhdGUsIGRlYWN0aXZhdGV9XG4iXX0=
