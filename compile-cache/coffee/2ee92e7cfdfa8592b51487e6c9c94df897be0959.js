(function() {
  var os;

  os = require('os');

  module.exports = {
    isDarwin: function() {
      return this.platform() === 'darwin';
    },
    isWindows: function() {
      return this.platform() === 'win32';
    },
    isLinux: function() {
      return this.platform() === 'linux';
    },
    platform: function() {
      return os.platform();
    },
    release: function() {
      return os.release();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvb3BlcmF0aW5nLXN5c3RlbS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsRUFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLEtBQWUsU0FEUDtJQUFBLENBQVY7QUFBQSxJQUdBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsUUFBRCxDQUFBLENBQUEsS0FBZSxRQUROO0lBQUEsQ0FIWDtBQUFBLElBTUEsT0FBQSxFQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBQSxLQUFlLFFBRFI7SUFBQSxDQU5UO0FBQUEsSUFTQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsRUFBRSxDQUFDLFFBQUgsQ0FBQSxFQURRO0lBQUEsQ0FUVjtBQUFBLElBWUEsT0FBQSxFQUFTLFNBQUEsR0FBQTthQUNQLEVBQUUsQ0FBQyxPQUFILENBQUEsRUFETztJQUFBLENBWlQ7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/grammar-utils/operating-system.coffee
