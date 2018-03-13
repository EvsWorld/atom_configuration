(function() {
  module.exports = {
    config: {
      enableForIndentation: {
        type: 'boolean',
        "default": false,
        description: 'Enable highlight for lines containing only indentation'
      },
      enableForCursorLines: {
        type: 'boolean',
        "default": false,
        description: 'Enable highlight for lines containing a cursor'
      }
    },
    activate: function(state) {
      atom.config.observe('trailing-spaces.enableForIndentation', function(enable) {
        if (enable) {
          return document.body.classList.add('trailing-spaces-highlight-indentation');
        } else {
          return document.body.classList.remove('trailing-spaces-highlight-indentation');
        }
      });
      return atom.config.observe('trailing-spaces.enableForCursorLines', function(enable) {
        if (enable) {
          return document.body.classList.add('trailing-spaces-highlight-cursor-lines');
        } else {
          return document.body.classList.remove('trailing-spaces-highlight-cursor-lines');
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90cmFpbGluZy1zcGFjZXMvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLG9CQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSx3REFGYjtPQURGO01BSUEsb0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLGdEQUZiO09BTEY7S0FERjtJQVVBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFFUixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0NBQXBCLEVBQTRELFNBQUMsTUFBRDtRQUMxRCxJQUFHLE1BQUg7aUJBQ0UsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBeEIsQ0FBNEIsdUNBQTVCLEVBREY7U0FBQSxNQUFBO2lCQUdFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQXhCLENBQStCLHVDQUEvQixFQUhGOztNQUQwRCxDQUE1RDthQU9BLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixzQ0FBcEIsRUFBNEQsU0FBQyxNQUFEO1FBQzFELElBQUcsTUFBSDtpQkFDRSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUF4QixDQUE0Qix3Q0FBNUIsRUFERjtTQUFBLE1BQUE7aUJBR0UsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBeEIsQ0FBK0Isd0NBQS9CLEVBSEY7O01BRDBELENBQTVEO0lBVFEsQ0FWVjs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGVuYWJsZUZvckluZGVudGF0aW9uOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246ICdFbmFibGUgaGlnaGxpZ2h0IGZvciBsaW5lcyBjb250YWluaW5nIG9ubHkgaW5kZW50YXRpb24nXG4gICAgZW5hYmxlRm9yQ3Vyc29yTGluZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogJ0VuYWJsZSBoaWdobGlnaHQgZm9yIGxpbmVzIGNvbnRhaW5pbmcgYSBjdXJzb3InXG4gIFxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICMgT2JzZXJ2ZSBcIkVuYWJsZSBGb3IgSW5kZW50YXRpb25cIiBjb25maWcgc2V0dGluZ1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyYWlsaW5nLXNwYWNlcy5lbmFibGVGb3JJbmRlbnRhdGlvbicsIChlbmFibGUpIC0+XG4gICAgICBpZiBlbmFibGVcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd0cmFpbGluZy1zcGFjZXMtaGlnaGxpZ2h0LWluZGVudGF0aW9uJylcbiAgICAgIGVsc2VcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd0cmFpbGluZy1zcGFjZXMtaGlnaGxpZ2h0LWluZGVudGF0aW9uJylcbiAgICBcbiAgICAjIE9ic2VydmUgXCJFbmFibGUgRm9yIEN1cnNvciBMaW5lc1wiIGNvbmZpZyBzZXR0aW5nXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAndHJhaWxpbmctc3BhY2VzLmVuYWJsZUZvckN1cnNvckxpbmVzJywgKGVuYWJsZSkgLT5cbiAgICAgIGlmIGVuYWJsZVxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3RyYWlsaW5nLXNwYWNlcy1oaWdobGlnaHQtY3Vyc29yLWxpbmVzJylcbiAgICAgIGVsc2VcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd0cmFpbGluZy1zcGFjZXMtaGlnaGxpZ2h0LWN1cnNvci1saW5lcycpXG5cbiJdfQ==
