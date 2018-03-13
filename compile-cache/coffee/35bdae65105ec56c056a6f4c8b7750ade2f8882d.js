(function() {
  var AtomPackageView, Manager, _, fs, path, walk;

  AtomPackageView = require('./atom-css-class-checker');

  fs = require('fs');

  walk = require('walk');

  path = require('path');

  _ = require('lodash');

  Manager = require('./atom-css-class-checker-manager');

  module.exports = {
    config: {
      ignoreDirectories: {
        type: 'array',
        title: 'Ignore Directories',
        "default": ['node_modules/', '.git/', './bower_components/'],
        items: {
          type: 'string'
        }
      },
      ignoreFiles: {
        type: 'array',
        title: 'Ignore Files',
        "default": [],
        items: {
          type: 'string'
        }
      },
      checkIds: {
        type: 'boolean',
        "default": true
      },
      openSourceInSplitWindow: {
        type: 'boolean',
        "default": true
      }
    },
    activate: function(state) {
      return this.manager = new Manager();
    },
    deactivate: function() {
      console.log('deactivating');
      return this.manager.cancel();
    },
    serialize: function() {}
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdG9tLWNzcy1jbGFzcy1jaGVja2VyL2xpYi9hdG9tLWNzcy1jbGFzcy1jaGVja2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEsMEJBQVI7O0VBQ2xCLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFFSixPQUFBLEdBQVUsT0FBQSxDQUFRLGtDQUFSOztFQUlWLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxLQUFBLEVBQU8sb0JBRFA7UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMsZUFBRCxFQUFrQixPQUFsQixFQUEyQixxQkFBM0IsQ0FGVDtRQUdBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1NBSkY7T0FERjtNQU1BLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxPQUFOO1FBQ0EsS0FBQSxFQUFPLGNBRFA7UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRlQ7UUFHQSxLQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sUUFBTjtTQUpGO09BUEY7TUFZQSxRQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtPQWJGO01BZUEsdUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BaEJGO0tBREY7SUFvQkEsUUFBQSxFQUFVLFNBQUMsS0FBRDthQUNSLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxPQUFBLENBQUE7SUFEUCxDQXBCVjtJQXdCQSxVQUFBLEVBQVksU0FBQTtNQUNWLE9BQU8sQ0FBQyxHQUFSLENBQVksY0FBWjthQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFBO0lBRlUsQ0F4Qlo7SUE0QkEsU0FBQSxFQUFXLFNBQUEsR0FBQSxDQTVCWDs7QUFYRiIsInNvdXJjZXNDb250ZW50IjpbIkF0b21QYWNrYWdlVmlldyA9IHJlcXVpcmUgJy4vYXRvbS1jc3MtY2xhc3MtY2hlY2tlcidcbmZzID0gcmVxdWlyZSAnZnMnXG53YWxrID0gcmVxdWlyZSAnd2FsaydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuTWFuYWdlciA9IHJlcXVpcmUgJy4vYXRvbS1jc3MtY2xhc3MtY2hlY2tlci1tYW5hZ2VyJ1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgaWdub3JlRGlyZWN0b3JpZXM6XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgdGl0bGU6ICdJZ25vcmUgRGlyZWN0b3JpZXMnLFxuICAgICAgZGVmYXVsdDogWydub2RlX21vZHVsZXMvJywgJy5naXQvJywgJy4vYm93ZXJfY29tcG9uZW50cy8nXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgaWdub3JlRmlsZXM6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICB0aXRsZTogJ0lnbm9yZSBGaWxlcydcbiAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICBjaGVja0lkczpcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBvcGVuU291cmNlSW5TcGxpdFdpbmRvdzpcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBtYW5hZ2VyID0gbmV3IE1hbmFnZXIoKVxuXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBjb25zb2xlLmxvZyAnZGVhY3RpdmF0aW5nJ1xuICAgIEBtYW5hZ2VyLmNhbmNlbCgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgICMgYXRvbVBhY2thZ2VWaWV3U3RhdGU6IEBhdG9tUGFja2FnZVZpZXcuc2VyaWFsaXplKClcbiJdfQ==
