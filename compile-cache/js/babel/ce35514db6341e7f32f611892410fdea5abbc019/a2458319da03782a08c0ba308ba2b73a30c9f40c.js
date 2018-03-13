'use babel';

// Public: GrammarUtils.PHP - a module which assist the creation of PHP temporary files
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  // Public: Create a temporary file with the provided PHP code
  //
  // * `code`    A {String} containing some PHP code without <?php header
  //
  // Returns the {String} filepath of the new file
  createTempFileWithCode: function createTempFileWithCode(code) {
    if (!/^[\s]*<\?php/.test(code)) {
      code = '<?php ' + code;
    }
    return module.parent.exports.createTempFileWithCode(code);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFyLXV0aWxzL3BocC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7OztxQkFHRzs7Ozs7O0FBTWIsd0JBQXNCLEVBQUEsZ0NBQUMsSUFBSSxFQUFFO0FBQzNCLFFBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQUUsVUFBSSxjQUFZLElBQUksQUFBRSxDQUFDO0tBQUU7QUFDM0QsV0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMzRDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFyLXV0aWxzL3BocC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBQdWJsaWM6IEdyYW1tYXJVdGlscy5QSFAgLSBhIG1vZHVsZSB3aGljaCBhc3Npc3QgdGhlIGNyZWF0aW9uIG9mIFBIUCB0ZW1wb3JhcnkgZmlsZXNcbmV4cG9ydCBkZWZhdWx0IHtcbiAgLy8gUHVibGljOiBDcmVhdGUgYSB0ZW1wb3JhcnkgZmlsZSB3aXRoIHRoZSBwcm92aWRlZCBQSFAgY29kZVxuICAvL1xuICAvLyAqIGBjb2RlYCAgICBBIHtTdHJpbmd9IGNvbnRhaW5pbmcgc29tZSBQSFAgY29kZSB3aXRob3V0IDw/cGhwIGhlYWRlclxuICAvL1xuICAvLyBSZXR1cm5zIHRoZSB7U3RyaW5nfSBmaWxlcGF0aCBvZiB0aGUgbmV3IGZpbGVcbiAgY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKSB7XG4gICAgaWYgKCEvXltcXHNdKjxcXD9waHAvLnRlc3QoY29kZSkpIHsgY29kZSA9IGA8P3BocCAke2NvZGV9YDsgfVxuICAgIHJldHVybiBtb2R1bGUucGFyZW50LmV4cG9ydHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKTtcbiAgfSxcbn07XG4iXX0=