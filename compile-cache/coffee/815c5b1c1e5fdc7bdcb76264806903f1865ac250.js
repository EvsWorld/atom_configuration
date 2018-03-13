(function() {
  var exec;

  exec = require('child_process').exec;

  module.exports = {
    activate: function() {
      return this.subs = atom.workspace.observeTextEditors(function(editor) {
        var buffer, plist, ref, ref1, scopeName, stdout;
        buffer = editor.buffer;
        plist = (ref = buffer.file) != null ? ref.path : void 0;
        scopeName = editor.getGrammar().scopeName;
        if (/\.(plist|strings)$/.test(scopeName) && ((ref1 = buffer.getLines()[0]) != null ? ref1.startsWith('bplist00') : void 0)) {
          stdout = exec("plutil -convert xml1 -o - '" + plist + "'").stdout;
          stdout.on('data', function(XML) {
            return editor.setText(XML);
          });
          return editor.onDidDestroy(function() {
            return exec("plutil -convert binary1 '" + plist + "'");
          });
        }
      });
    },
    deactivate: function() {
      return this.subs.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9wbGlzdC1jb252ZXJ0ZXIvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxlQUFSOztFQUVULE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQTthQUdSLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQ7QUFDeEMsWUFBQTtRQUFBLE1BQUEsR0FBUyxNQUFNLENBQUM7UUFDaEIsS0FBQSxvQ0FBbUIsQ0FBRTtRQUNwQixZQUFhLE1BQU0sQ0FBQyxVQUFQLENBQUE7UUFFZCxJQUFHLG9CQUFvQixDQUFDLElBQXJCLENBQTBCLFNBQTFCLENBQUEsaURBQ21CLENBQUUsVUFBdEIsQ0FBaUMsVUFBakMsV0FERjtVQUlLLFNBQVUsSUFBQSxDQUFLLDZCQUFBLEdBQThCLEtBQTlCLEdBQW9DLEdBQXpDO1VBQ1gsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFWLEVBQWtCLFNBQUMsR0FBRDttQkFBUyxNQUFNLENBQUMsT0FBUCxDQUFlLEdBQWY7VUFBVCxDQUFsQjtpQkFHQSxNQUFNLENBQUMsWUFBUCxDQUFvQixTQUFBO21CQUNsQixJQUFBLENBQUssMkJBQUEsR0FBNEIsS0FBNUIsR0FBa0MsR0FBdkM7VUFEa0IsQ0FBcEIsRUFSSjs7TUFMd0MsQ0FBbEM7SUFIQSxDQUFWO0lBb0JBLFVBQUEsRUFBWSxTQUFBO2FBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFBSCxDQXBCWjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIntleGVjfSA9IHJlcXVpcmUgJ2NoaWxkX3Byb2Nlc3MnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IC0+XG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgQHN1YnMgPSBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgLT5cbiAgICAgIGJ1ZmZlciA9IGVkaXRvci5idWZmZXJcbiAgICAgIHBsaXN0ID0gYnVmZmVyLmZpbGU/LnBhdGhcbiAgICAgIHtzY29wZU5hbWV9ID0gZWRpdG9yLmdldEdyYW1tYXIoKVxuXG4gICAgICBpZiAvXFwuKHBsaXN0fHN0cmluZ3MpJC8udGVzdChzY29wZU5hbWUpIGFuZFxuICAgICAgICBidWZmZXIuZ2V0TGluZXMoKVswXT8uc3RhcnRzV2l0aCAnYnBsaXN0MDAnXG5cbiAgICAgICAgICAjIENvbnZlcnQgZnJvbSBiaW5hcnkgdG8gWE1MIGZvciBlZGl0aW5nXG4gICAgICAgICAge3N0ZG91dH0gPSBleGVjIFwicGx1dGlsIC1jb252ZXJ0IHhtbDEgLW8gLSAnI3twbGlzdH0nXCJcbiAgICAgICAgICBzdGRvdXQub24gJ2RhdGEnLCAoWE1MKSAtPiBlZGl0b3Iuc2V0VGV4dCBYTUxcblxuICAgICAgICAgICMgQ29udmVydCBiYWNrIHRvIGJpbmFyeSBmcm9tIFhNTFxuICAgICAgICAgIGVkaXRvci5vbkRpZERlc3Ryb3kgLT5cbiAgICAgICAgICAgIGV4ZWMgXCJwbHV0aWwgLWNvbnZlcnQgYmluYXJ5MSAnI3twbGlzdH0nXCJcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVhY3RpdmF0ZTogLT4gQHN1YnMuZGlzcG9zZSgpXG4iXX0=
