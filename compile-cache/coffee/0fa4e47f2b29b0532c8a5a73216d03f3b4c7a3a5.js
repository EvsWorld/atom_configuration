(function() {
  var BrowserOpen;

  BrowserOpen = require("./browser-open");

  module.exports = {
    config: {
      saveFilesBeforeRefresh: {
        type: 'boolean',
        "default": false
      },
      chromeBackgroundRefresh: {
        type: 'boolean',
        "default": true
      },
      googleChromeCanary: {
        type: 'boolean',
        "default": false
      },
      googleChrome: {
        type: 'boolean',
        "default": true
      },
      firefox: {
        type: 'boolean',
        "default": false
      },
      safari: {
        type: 'boolean',
        "default": false
      },
      firefoxNightly: {
        type: 'boolean',
        "default": false
      },
      firefoxDeveloperEdition: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function(state) {
      return atom.commands.add('atom-workspace', {
        'browser-refresh:open': function() {
          return BrowserOpen();
        }
      });
    },
    deactivate: function() {},
    serialize: function() {}
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9icm93c2VyLXJlZnJlc2gvbGliL2Jyb3dzZXItcmVmcmVzaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLHNCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQURGO01BR0EsdUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BSkY7TUFNQSxrQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FQRjtNQVNBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BVkY7TUFZQSxPQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQWJGO01BZUEsTUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FoQkY7TUFrQkEsY0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FuQkY7TUFxQkEsdUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BdEJGO0tBREY7SUEwQkEsUUFBQSxFQUFVLFNBQUMsS0FBRDthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxzQkFBQSxFQUF3QixTQUFBO2lCQUMxRCxXQUFBLENBQUE7UUFEMEQsQ0FBeEI7T0FBcEM7SUFEUSxDQTFCVjtJQThCQSxVQUFBLEVBQVksU0FBQSxHQUFBLENBOUJaO0lBZ0NBLFNBQUEsRUFBVyxTQUFBLEdBQUEsQ0FoQ1g7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJcbkJyb3dzZXJPcGVuID0gcmVxdWlyZSBcIi4vYnJvd3Nlci1vcGVuXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgc2F2ZUZpbGVzQmVmb3JlUmVmcmVzaDpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBjaHJvbWVCYWNrZ3JvdW5kUmVmcmVzaDpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIGdvb2dsZUNocm9tZUNhbmFyeTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBnb29nbGVDaHJvbWU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBmaXJlZm94OlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIHNhZmFyaTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBmaXJlZm94TmlnaHRseTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBmaXJlZm94RGV2ZWxvcGVyRWRpdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdicm93c2VyLXJlZnJlc2g6b3Blbic6IC0+XG4gICAgICBCcm93c2VyT3BlbigpXG5cbiAgZGVhY3RpdmF0ZTogLT5cblxuICBzZXJpYWxpemU6IC0+XG4iXX0=
