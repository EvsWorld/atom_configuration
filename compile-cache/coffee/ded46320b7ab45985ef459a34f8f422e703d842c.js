(function() {
  var BrowserOpen, BufferedProcess, Commands, MacChromeActivation, MacChromeCanaryCmd, MacChromeCmd, MacFirefoxCmd, MacFirefoxDeveloperEditionCmd, MacFirefoxNightlyCmd, MacSafariCmd, OS, OpenPanel, RunCmd, RunLinuxCmd, RunMacCmd, StatusView;

  BufferedProcess = require('atom').BufferedProcess;

  OS = require('os');

  StatusView = require('./status-view');

  MacChromeActivation = atom.config.get('browser-refresh.chromeBackgroundRefresh');

  if (MacChromeActivation === false) {
    MacChromeActivation = "activate";
  } else {
    MacChromeActivation = "";
  }

  MacChromeCmd = "tell application \"Google Chrome\"\n  " + MacChromeActivation + "\n  \"chrome\"\n  set winref to a reference to (first window whose title does not start with \"Developer Tools - \")\n  set winref's index to 1\n  reload active tab of winref\nend tell";

  MacChromeCanaryCmd = "tell application \"Google Chrome Canary\"\n  " + MacChromeActivation + "\n  \"chrome canary\"\n  set winref to a reference to (first window whose title does not start with \"Developer Tools - \")\n  set winref's index to 1\n  reload active tab of winref\nend tell";

  MacFirefoxCmd = "set a to path to frontmost application as text\ntell application \"Firefox\"\n	activate\n	tell application \"System Events\" to keystroke \"r\" using command down\nend tell\ndelay 0.2\nactivate application a";

  MacFirefoxNightlyCmd = "set a to path to frontmost application as text\ntell application \"FirefoxNightly\"\n	activate\n	tell application \"System Events\" to keystroke \"r\" using command down\nend tell\ndelay 0.2\nactivate application a";

  MacFirefoxDeveloperEditionCmd = "set a to path to frontmost application as text\ntell application \"FirefoxDeveloperEdition\"\n	activate\n	tell application \"System Events\" to keystroke \"r\" using command down\nend tell\ndelay 0.2\nactivate application a";

  MacSafariCmd = "tell application \"Safari\"\n  activate\n  tell its first document\n    set its URL to (get its URL)\n  end tell\nend tell";

  Commands = {
    darwin: {
      firefox: MacFirefoxCmd,
      firefoxNightly: MacFirefoxNightlyCmd,
      firefoxDeveloperEdition: MacFirefoxDeveloperEditionCmd,
      chrome: MacChromeCmd,
      chromeCanary: MacChromeCanaryCmd,
      safari: MacSafariCmd
    },
    linux: {
      firefox: ['search', '--sync', '--onlyvisible', '--class', 'firefox', 'key', 'F5', 'windowactivate'],
      chrome: ['search', '--sync', '--onlyvisible', '--class', 'chrome', 'key', 'F5', 'windowactivate']
    }
  };

  OpenPanel = function(params) {
    var statusPanel, statusView;
    statusView = new StatusView(params);
    statusPanel = atom.workspace.addBottomPanel({
      item: statusView
    });
    return setTimeout(function() {
      if (statusView != null) {
        statusView.destroy();
      }
      statusView = null;
      if (statusPanel != null) {
        statusPanel.destroy();
      }
      return statusPanel = null;
    }, 2000);
  };

  RunMacCmd = function(BrowserCmd) {
    return new BufferedProcess({
      command: 'osascript',
      args: ['-e', BrowserCmd],
      stderr: function(data) {
        return OpenPanel({
          type: 'alert',
          message: data.toString()
        });
      }
    });
  };

  RunLinuxCmd = function(BrowserArgs) {
    return new BufferedProcess({
      command: 'xdotool',
      args: BrowserArgs,
      stderr: function(data) {
        return OpenPanel({
          type: 'alert',
          message: data.toString()
        });
      }
    });
  };

  RunCmd = function(browser) {
    if (OS.platform() === 'darwin') {
      return RunMacCmd(Commands['darwin'][browser]);
    } else if (OS.platform() === 'linux' && browser !== 'safari') {
      return RunLinuxCmd(Commands['linux'][browser]);
    } else {
      return OpenPanel({
        type: 'alert',
        message: 'Unsupported platform'
      });
    }
  };

  BrowserOpen = function() {
    if (atom.config.get('browser-refresh.saveCurrentFileBeforeRefresh')) {
      atom.workspace.getActiveEditor().save();
    }
    if (atom.config.get('browser-refresh.saveFilesBeforeRefresh')) {
      atom.workspace.saveAll();
    }
    if (atom.config.get('browser-refresh.firefox')) {
      RunCmd('firefox');
    }
    if (atom.config.get('browser-refresh.firefoxNightly')) {
      RunCmd('firefoxNightly');
    }
    if (atom.config.get('browser-refresh.firefoxDeveloperEdition')) {
      RunCmd('firefoxDeveloperEdition');
    }
    if (atom.config.get('browser-refresh.googleChrome')) {
      RunCmd('chrome');
    }
    if (atom.config.get('browser-refresh.googleChromeCanary')) {
      RunCmd('chromeCanary');
    }
    if (atom.config.get('browser-refresh.safari')) {
      return RunCmd('safari');
    }
  };

  module.exports = BrowserOpen;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9icm93c2VyLXJlZnJlc2gvbGliL2Jyb3dzZXItb3Blbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUjs7RUFDcEIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFFYixtQkFBQSxHQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUNBQWhCOztFQUN0QixJQUFJLG1CQUFBLEtBQXVCLEtBQTNCO0lBQ0UsbUJBQUEsR0FBc0IsV0FEeEI7R0FBQSxNQUFBO0lBR0UsbUJBQUEsR0FBc0IsR0FIeEI7OztFQUtBLFlBQUEsR0FBZSx3Q0FBQSxHQUVYLG1CQUZXLEdBRVM7O0VBT3hCLGtCQUFBLEdBQXFCLCtDQUFBLEdBRWpCLG1CQUZpQixHQUVHOztFQVF4QixhQUFBLEdBQWdCOztFQVVoQixvQkFBQSxHQUF1Qjs7RUFVdkIsNkJBQUEsR0FBZ0M7O0VBVWhDLFlBQUEsR0FBZTs7RUFTZixRQUFBLEdBQVc7SUFDVCxNQUFBLEVBQVE7TUFDTixPQUFBLEVBQWUsYUFEVDtNQUVOLGNBQUEsRUFBaUIsb0JBRlg7TUFHTix1QkFBQSxFQUEwQiw2QkFIcEI7TUFJTixNQUFBLEVBQWUsWUFKVDtNQUtOLFlBQUEsRUFBZSxrQkFMVDtNQU1OLE1BQUEsRUFBZSxZQU5UO0tBREM7SUFTVCxLQUFBLEVBQU87TUFDTCxPQUFBLEVBQVMsQ0FDUCxRQURPLEVBRVAsUUFGTyxFQUdQLGVBSE8sRUFJUCxTQUpPLEVBS1AsU0FMTyxFQU1QLEtBTk8sRUFPUCxJQVBPLEVBUVAsZ0JBUk8sQ0FESjtNQVdMLE1BQUEsRUFBUSxDQUNOLFFBRE0sRUFFTixRQUZNLEVBR04sZUFITSxFQUlOLFNBSk0sRUFLTixRQUxNLEVB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QSxDQUFPLFFBQVAsRUFERjs7RUFmWTs7RUFrQmQsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUF6SmpCIiwic291cmNlc0NvbnRlbnQiOlsie0J1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xuT1MgPSByZXF1aXJlICdvcydcblN0YXR1c1ZpZXcgPSByZXF1aXJlICcuL3N0YXR1cy12aWV3J1xuXG5NYWNDaHJvbWVBY3RpdmF0aW9uID0gYXRvbS5jb25maWcuZ2V0ICdicm93c2VyLXJlZnJlc2guY2hyb21lQmFja2dyb3VuZFJlZnJlc2gnXG5pZiAoTWFjQ2hyb21lQWN0aXZhdGlvbiA9PSBmYWxzZSlcbiAgTWFjQ2hyb21lQWN0aXZhdGlvbiA9IFwiYWN0aXZhdGVcIlxuZWxzZVxuICBNYWNDaHJvbWVBY3RpdmF0aW9uID0gXCJcIlxuXG5NYWNDaHJvbWVDbWQgPSBcIlwiXCJcbnRlbGwgYXBwbGljYXRpb24gXCJHb29nbGUgQ2hyb21lXCJcbiAgI3tNYWNDaHJvbWVBY3RpdmF0aW9ufVxuICBcImNocm9tZVwiXG4gIHNldCB3aW5yZWYgdG8gYSByZWZlcmVuY2UgdG8gKGZpcnN0IHdpbmRvdyB3aG9zZSB0aXRsZSBkb2VzIG5vdCBzdGFydCB3aXRoIFwiRGV2ZWxvcGVyIFRvb2xzIC0gXCIpXG4gIHNldCB3aW5yZWYncyBpbmRleCB0byAxXG4gIHJlbG9hZCBhY3RpdmUgdGFiIG9mIHdpbnJlZlxuZW5kIHRlbGxcblwiXCJcIlxuTWFjQ2hyb21lQ2FuYXJ5Q21kID0gXCJcIlwiXG50ZWxsIGFwcGxpY2F0aW9uIFwiR29vZ2xlIENocm9tZSBDYW5hcnlcIlxuICAje01hY0Nocm9tZUFjdGl2YXRpb259XG4gIFwiY2hyb21lIGNhbmFyeVwiXG4gIHNldCB3aW5yZWYgdG8gYSByZWZlcmVuY2UgdG8gKGZpcnN0IHdpbmRvdyB3aG9zZSB0aXRsZSBkb2VzIG5vdCBzdGFydCB3aXRoIFwiRGV2ZWxvcGVyIFRvb2xzIC0gXCIpXG4gIHNldCB3aW5yZWYncyBpbmRleCB0byAxXG4gIHJlbG9hZCBhY3RpdmUgdGFiIG9mIHdpbnJlZlxuZW5kIHRlbGxcblwiXCJcIlxuXG5NYWNGaXJlZm94Q21kID0gXCJcIlwiXG5zZXQgYSB0byBwYXRoIHRvIGZyb250bW9zdCBhcHBsaWNhdGlvbiBhcyB0ZXh0XG50ZWxsIGFwcGxpY2F0aW9uIFwiRmlyZWZveFwiXG5cdGFjdGl2YXRlXG5cdHRlbGwgYXBwbGljYXRpb24gXCJTeXN0ZW0gRXZlbnRzXCIgdG8ga2V5c3Ryb2tlIFwiclwiIHVzaW5nIGNvbW1hbmQgZG93blxuZW5kIHRlbGxcbmRlbGF5IDAuMlxuYWN0aXZhdGUgYXBwbGljYXRpb24gYVxuXCJcIlwiXG5cbk1hY0ZpcmVmb3hOaWdodGx5Q21kID0gXCJcIlwiXG5zZXQgYSB0byBwYXRoIHRvIGZyb250bW9zdCBhcHBsaWNhdGlvbiBhcyB0ZXh0XG50ZWxsIGFwcGxpY2F0aW9uIFwiRmlyZWZveE5pZ2h0bHlcIlxuXHRhY3RpdmF0ZVxuXHR0ZWxsIGFwcGxpY2F0aW9uIFwiU3lzdGVtIEV2ZW50c1wiIHRvIGtleXN0cm9rZSBcInJcIiB1c2luZyBjb21tYW5kIGRvd25cbmVuZCB0ZWxsXG5kZWxheSAwLjJcbmFjdGl2YXRlIGFwcGxpY2F0aW9uIGFcblwiXCJcIlxuXG5NYWNGaXJlZm94RGV2ZWxvcGVyRWRpdGlvbkNtZCA9IFwiXCJcIlxuc2V0IGEgdG8gcGF0aCB0byBmcm9udG1vc3QgYXBwbGljYXRpb24gYXMgdGV4dFxudGVsbCBhcHBsaWNhdGlvbiBcIkZpcmVmb3hEZXZlbG9wZXJFZGl0aW9uXCJcblx0YWN0aXZhdGVcblx0dGVsbCBhcHBsaWNhdGlvbiBcIlN5c3RlbSBFdmVudHNcIiB0byBrZXlzdHJva2UgXCJyXCIgdXNpbmcgY29tbWFuZCBkb3duXG5lbmQgdGVsbFxuZGVsYXkgMC4yXG5hY3RpdmF0ZSBhcHBsaWNhdGlvbiBhXG5cIlwiXCJcblxuTWFjU2FmYXJpQ21kID0gXCJcIlwiXG50ZWxsIGFwcGxpY2F0aW9uIFwiU2FmYXJpXCJcbiAgYWN0aXZhdGVcbiAgdGVsbCBpdHMgZmlyc3QgZG9jdW1lbnRcbiAgICBzZXQgaXRzIFVSTCB0byAoZ2V0IGl0cyBVUkwpXG4gIGVuZCB0ZWxsXG5lbmQgdGVsbFxuXCJcIlwiXG5cbkNvbW1hbmRzID0ge1xuICBkYXJ3aW46IHtcbiAgICBmaXJlZm94ICAgICAgOiBNYWNGaXJlZm94Q21kLFxuICAgIGZpcmVmb3hOaWdodGx5IDogTWFjRmlyZWZveE5pZ2h0bHlDbWQsXG4gICAgZmlyZWZveERldmVsb3BlckVkaXRpb24gOiBNYWNGaXJlZm94RGV2ZWxvcGVyRWRpdGlvbkNtZCxcbiAgICBjaHJvbWUgICAgICAgOiBNYWNDaHJvbWVDbWQsXG4gICAgY2hyb21lQ2FuYXJ5IDogTWFjQ2hyb21lQ2FuYXJ5Q21kLFxuICAgIHNhZmFyaSAgICAgICA6IE1hY1NhZmFyaUNtZFxuICB9LFxuICBsaW51eDoge1xuICAgIGZpcmVmb3g6IFtcbiAgICAgICdzZWFyY2gnLFxuICAgICAgJy0tc3luYycsXG4gICAgICAnLS1vbmx5dmlzaWJsZScsXG4gICAgICAnLS1jbGFzcycsXG4gICAgICAnZmlyZWZveCcsXG4gICAgICAna2V5JyxcbiAgICAgICdGNScsXG4gICAgICAnd2luZG93YWN0aXZhdGUnXG4gICAgXSxcbiAgICBjaHJvbWU6IFtcbiAgICAgICdzZWFyY2gnLFxuICAgICAgJy0tc3luYycsXG4gICAgICAnLS1vbmx5dmlzaWJsZScsXG4gICAgICAnLS1jbGFzcycsXG4gICAgICAnY2hyb21lJyxcbiAgICAgICdrZXknLFxuICAgICAgJ0Y1JyxcbiAgICAgICd3aW5kb3dhY3RpdmF0ZSdcbiAgICBdXG4gIH1cbn1cblxuT3BlblBhbmVsID0gKHBhcmFtcykgLT5cbiAgc3RhdHVzVmlldyA9IG5ldyBTdGF0dXNWaWV3KHBhcmFtcylcbiAgc3RhdHVzUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbChpdGVtOiBzdGF0dXNWaWV3KVxuICBzZXRUaW1lb3V0IC0+XG4gICAgc3RhdHVzVmlldz8uZGVzdHJveSgpXG4gICAgc3RhdHVzVmlldyA9IG51bGxcbiAgICBzdGF0dXNQYW5lbD8uZGVzdHJveSgpXG4gICAgc3RhdHVzUGFuZWwgPSBudWxsXG4gICwgMjAwMFxuXG5SdW5NYWNDbWQgPSAoQnJvd3NlckNtZCkgLT5cbiAgbmV3IEJ1ZmZlcmVkUHJvY2Vzcyh7XG4gICAgY29tbWFuZDogJ29zYXNjcmlwdCdcbiAgICBhcmdzOiBbJy1lJywgQnJvd3NlckNtZF1cbiAgICBzdGRlcnI6IChkYXRhKSAtPlxuICAgICAgT3BlblBhbmVsKHR5cGU6ICdhbGVydCcsIG1lc3NhZ2U6IGRhdGEudG9TdHJpbmcoKSlcbiAgfSlcblxuUnVuTGludXhDbWQgPSAoQnJvd3NlckFyZ3MpIC0+XG4gIG5ldyBCdWZmZXJlZFByb2Nlc3Moe1xuICAgIGNvbW1hbmQ6ICd4ZG90b29sJ1xuICAgIGFyZ3M6IEJyb3dzZXJBcmdzXG4gICAgc3RkZXJyOiAoZGF0YSkgLT5cbiAgICAgIE9wZW5QYW5lbCh0eXBlOiAnYWxlcnQnLCBtZXNzYWdlOiBkYXRhLnRvU3RyaW5nKCkpXG4gIH0pXG5cblJ1bkNtZCA9IChicm93c2VyKSAtPlxuICBpZiBPUy5wbGF0Zm9ybSgpID09ICdkYXJ3aW4nXG4gICAgUnVuTWFjQ21kKENvbW1hbmRzWydkYXJ3aW4nXVticm93c2VyXSlcbiAgZWxzZSBpZiBPUy5wbGF0Zm9ybSgpID09ICdsaW51eCcgYW5kIGJyb3dzZXIgaXNudCAnc2FmYXJpJ1xuICAgIFJ1bkxpbnV4Q21kKENvbW1hbmRzWydsaW51eCddW2Jyb3dzZXJdKVxuICBlbHNlXG4gICAgT3BlblBhbmVsKHR5cGU6ICdhbGVydCcsIG1lc3NhZ2U6ICdVbnN1cHBvcnRlZCBwbGF0Zm9ybScpXG5cbkJyb3dzZXJPcGVuID0gKCktPlxuICBpZihhdG9tLmNvbmZpZy5nZXQgJ2Jyb3dzZXItcmVmcmVzaC5zYXZlQ3VycmVudEZpbGVCZWZvcmVSZWZyZXNoJylcbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVFZGl0b3IoKS5zYXZlKClcbiAgaWYoYXRvbS5jb25maWcuZ2V0ICdicm93c2VyLXJlZnJlc2guc2F2ZUZpbGVzQmVmb3JlUmVmcmVzaCcpXG4gICAgYXRvbS53b3Jrc3BhY2Uuc2F2ZUFsbCgpXG4gIGlmKGF0b20uY29uZmlnLmdldCAnYnJvd3Nlci1yZWZyZXNoLmZpcmVmb3gnKVxuICAgIFJ1bkNtZCgnZmlyZWZveCcpXG4gIGlmKGF0b20uY29uZmlnLmdldCAnYnJvd3Nlci1yZWZyZXNoLmZpcmVmb3hOaWdodGx5JylcbiAgICBSdW5DbWQoJ2ZpcmVmb3hOaWdodGx5JylcbiAgaWYoYXRvbS5jb25maWcuZ2V0ICdicm93c2VyLXJlZnJlc2guZmlyZWZveERldmVsb3BlckVkaXRpb24nKVxuICAgIFJ1bkNtZCgnZmlyZWZveERldmVsb3BlckVkaXRpb24nKVxuICBpZihhdG9tLmNvbmZpZy5nZXQgJ2Jyb3dzZXItcmVmcmVzaC5nb29nbGVDaHJvbWUnKVxuICAgIFJ1bkNtZCgnY2hyb21lJylcbiAgaWYoYXRvbS5jb25maWcuZ2V0ICdicm93c2VyLXJlZnJlc2guZ29vZ2xlQ2hyb21lQ2FuYXJ5JylcbiAgICBSdW5DbWQoJ2Nocm9tZUNhbmFyeScpXG4gIGlmKGF0b20uY29uZmlnLmdldCAnYnJvd3Nlci1yZWZyZXNoLnNhZmFyaScpXG4gICAgUnVuQ21kKCdzYWZhcmknKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJyb3dzZXJPcGVuXG4iXX0=
