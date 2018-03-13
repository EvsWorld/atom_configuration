(function() {
  module.exports = {
    createTempFileWithCode: function(code) {
      if (!/^[\s]*<\?php/.test(code)) {
        code = "<?php " + code;
      }
      return module.parent.exports.createTempFileWithCode(code);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvcGhwLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUVBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQU1FO0FBQUEsSUFBQSxzQkFBQSxFQUF3QixTQUFDLElBQUQsR0FBQTtBQUN0QixNQUFBLElBQUEsQ0FBQSxjQUE0QyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsQ0FBOUI7QUFBQSxRQUFBLElBQUEsR0FBUSxRQUFBLEdBQVEsSUFBaEIsQ0FBQTtPQUFBO2FBQ0EsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsc0JBQXRCLENBQTZDLElBQTdDLEVBRnNCO0lBQUEsQ0FBeEI7R0FORixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/grammar-utils/php.coffee
