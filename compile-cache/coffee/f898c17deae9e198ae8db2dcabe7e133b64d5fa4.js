(function() {
  module.exports = {
    get: function() {
      var sublimeTabs, treeView;
      if (atom.packages.isPackageLoaded('tree-view')) {
        treeView = atom.packages.getLoadedPackage('tree-view');
        treeView = require(treeView.mainModulePath).getTreeViewInstance();
        return treeView.serialize();
      } else if (atom.packages.isPackageLoaded('sublime-tabs')) {
        sublimeTabs = atom.packages.getLoadedPackage('sublime-tabs');
        sublimeTabs = require(sublimeTabs.mainModulePath);
        return sublimeTabs.serialize();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvY29udGV4dC1wYWNrYWdlLWZpbmRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsR0FBQSxFQUFLLFNBQUE7QUFDSCxVQUFBO01BQUEsSUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsV0FBOUIsQ0FBSDtRQUNFLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLFdBQS9CO1FBQ1gsUUFBQSxHQUFXLE9BQUEsQ0FBUSxRQUFRLENBQUMsY0FBakIsQ0FBZ0MsQ0FBQyxtQkFBakMsQ0FBQTtlQUNYLFFBQVEsQ0FBQyxTQUFULENBQUEsRUFIRjtPQUFBLE1BSUssSUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsY0FBOUIsQ0FBSDtRQUNILFdBQUEsR0FBYyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLGNBQS9CO1FBQ2QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxXQUFXLENBQUMsY0FBcEI7ZUFDZCxXQUFXLENBQUMsU0FBWixDQUFBLEVBSEc7O0lBTEYsQ0FBTDs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgZ2V0OiAtPlxuICAgIGlmIGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKCd0cmVlLXZpZXcnKVxuICAgICAgdHJlZVZpZXcgPSBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ3RyZWUtdmlldycpXG4gICAgICB0cmVlVmlldyA9IHJlcXVpcmUodHJlZVZpZXcubWFpbk1vZHVsZVBhdGgpLmdldFRyZWVWaWV3SW5zdGFuY2UoKVxuICAgICAgdHJlZVZpZXcuc2VyaWFsaXplKClcbiAgICBlbHNlIGlmIGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKCdzdWJsaW1lLXRhYnMnKVxuICAgICAgc3VibGltZVRhYnMgPSBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ3N1YmxpbWUtdGFicycpXG4gICAgICBzdWJsaW1lVGFicyA9IHJlcXVpcmUoc3VibGltZVRhYnMubWFpbk1vZHVsZVBhdGgpXG4gICAgICBzdWJsaW1lVGFicy5zZXJpYWxpemUoKVxuIl19
