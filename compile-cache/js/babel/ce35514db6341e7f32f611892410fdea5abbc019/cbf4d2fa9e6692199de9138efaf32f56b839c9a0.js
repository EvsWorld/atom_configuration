Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _atom = require('atom');

var _electron = require('electron');

var _json5 = require('json5');

var _json52 = _interopRequireDefault(_json5);

'use babel';

var packagePath = atom.packages.resolvePackagePath('atom-live-server');
var liveServer = _path2['default'].join(packagePath, '/node_modules/live-server/live-server.js');

var serverProcess = undefined;
var disposeMenu = undefined;
var noBrowser = undefined;

function addStartMenu() {
  disposeMenu = atom.menu.add([{
    label: 'Packages',
    submenu: [{
      label: 'atom-live-server',
      submenu: [{
        label: 'Start server',
        command: 'atom-live-server:startServer'
      }]
    }]
  }]);
}

exports['default'] = {
  subscriptions: null,

  activate: function activate(state) {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-live-server:start-3000': function atomLiveServerStart3000() {
        return _this.startServer(3000);
      },
      'atom-live-server:start-4000': function atomLiveServerStart4000() {
        return _this.startServer(4000);
      },
      'atom-live-server:start-5000': function atomLiveServerStart5000() {
        return _this.startServer(5000);
      },
      'atom-live-server:start-8000': function atomLiveServerStart8000() {
        return _this.startServer(8000);
      },
      'atom-live-server:start-9000': function atomLiveServerStart9000() {
        return _this.startServer(9000);
      },
      'atom-live-server:startServer': function atomLiveServerStartServer() {
        return _this.startServer();
      },
      'atom-live-server:stopServer': function atomLiveServerStopServer() {
        return _this.stopServer();
      }
    }));

    addStartMenu();
  },

  deactivate: function deactivate() {
    this.stopServer();
    this.subscriptions.dispose();
  },

  startServer: function startServer() {
    var _this2 = this;

    var port = arguments.length <= 0 || arguments[0] === undefined ? 3000 : arguments[0];

    if (serverProcess) {
      return;
    }

    var targetPath = atom.project.getPaths()[0];

    if (!targetPath) {
      atom.notifications.addWarning('[Live Server] You haven\'t opened a Project, you must open one.');
      return;
    }

    noBrowser = false;
    var args = [];
    var stdout = function stdout(output) {
      if (output.indexOf('Serving ') === 0) {
        var serverUrl = output.split(' at ')[1];
        var _port = _url2['default'].parse(serverUrl).port;
        var disposeStartMenu = disposeMenu;
        disposeMenu = atom.menu.add([{
          label: 'Packages',
          submenu: [{
            label: 'atom-live-server',
            submenu: [{
              label: output.replace('Serving ', 'Stop '),
              command: 'atom-live-server:stopServer'
            }]
          }]
        }]);

        disposeStartMenu.dispose();

        if (noBrowser) {
          atom.notifications.addSuccess('[Live Server] Live server started at ' + serverUrl + '.');
        }
      }

      console.log('[Live Server] ' + output);
    };

    var exit = function exit(code) {
      console.info('[Live Server] Exited with code ' + code);
      _this2.stopServer();
    };

    _fs2['default'].open(_path2['default'].join(targetPath, '.atom-live-server.json'), 'r', function (err, fd) {
      if (!err) {
        (function () {
          var userConfig = _json52['default'].parse(_fs2['default'].readFileSync(fd, 'utf8'));

          Object.keys(userConfig).forEach(function (key) {
            if (key === 'no-browser') {
              if (userConfig[key] === true) {
                args.push('--' + key);
                noBrowser = true;
              }
            } else if (key === 'root') {
              args.unshift('' + userConfig[key]);
            } else {
              args.push('--' + key + '=' + userConfig[key]);
            }
          });
        })();
      }

      if (!args.length) {
        args.push('--port=' + port);
      }

      serverProcess = new _atom.BufferedNodeProcess({
        command: liveServer,
        args: args,
        stdout: stdout,
        exit: exit,
        options: {
          cwd: targetPath
        }
      });

      console.info('[Live Server] live-server ' + args.join(' '));
    });
  },

  stopServer: function stopServer() {
    try {
      serverProcess.kill();
    } catch (e) {
      console.error(e);
    }

    serverProcess = null;
    var disposeStopMenu = disposeMenu;
    addStartMenu();
    disposeStopMenu && disposeStopMenu.dispose();
    atom.notifications.addSuccess('[Live Server] Live server is stopped.');
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS1saXZlLXNlcnZlci9saWIvYXRvbS1saXZlLXNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRWlCLE1BQU07Ozs7a0JBQ1IsSUFBSTs7OzttQkFDSCxLQUFLOzs7O29CQUNvQyxNQUFNOzt3QkFDeEMsVUFBVTs7cUJBQ2YsT0FBTzs7OztBQVB6QixXQUFXLENBQUM7O0FBU1osSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3pFLElBQU0sVUFBVSxHQUFHLGtCQUFLLElBQUksQ0FBQyxXQUFXLEVBQUUsMENBQTBDLENBQUMsQ0FBQzs7QUFFdEYsSUFBSSxhQUFhLFlBQUEsQ0FBQztBQUNsQixJQUFJLFdBQVcsWUFBQSxDQUFDO0FBQ2hCLElBQUksU0FBUyxZQUFBLENBQUM7O0FBRWQsU0FBUyxZQUFZLEdBQUc7QUFDdEIsYUFBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUN6QixDQUFDO0FBQ0MsU0FBSyxFQUFFLFVBQVU7QUFDakIsV0FBTyxFQUFHLENBQUM7QUFDVCxXQUFLLEVBQUUsa0JBQWtCO0FBQ3pCLGFBQU8sRUFBRyxDQUFDO0FBQ1QsYUFBSyxFQUFFLGNBQWM7QUFDckIsZUFBTyxnQ0FBZ0M7T0FDeEMsQ0FBQztLQUNILENBQUM7R0FDSCxDQUFDLENBQ0gsQ0FBQztDQUNIOztxQkFFYztBQUNiLGVBQWEsRUFBRSxJQUFJOztBQUVuQixVQUFRLEVBQUEsa0JBQUMsS0FBSyxFQUFFOzs7QUFDZCxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDOztBQUUvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCxtQ0FBNkIsRUFBRTtlQUFNLE1BQUssV0FBVyxDQUFD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QUcsSUFBSSxDQUFDO0FBQ3JCLFFBQU0sZUFBZSxHQUFHLFdBQVcsQ0FBQztBQUNwQyxnQkFBWSxFQUFFLENBQUM7QUFDZixtQkFBZSxJQUFJLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM3QyxRQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0dBQ3hFO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdG9tLWxpdmUtc2VydmVyL2xpYi9hdG9tLWxpdmUtc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcbmltcG9ydCB7IEJ1ZmZlcmVkTm9kZVByb2Nlc3MsIENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCB7IHJlbW90ZSB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCBKU09ONSBmcm9tICdqc29uNSc7XG5cbmNvbnN0IHBhY2thZ2VQYXRoID0gYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ2F0b20tbGl2ZS1zZXJ2ZXInKTtcbmNvbnN0IGxpdmVTZXJ2ZXIgPSBwYXRoLmpvaW4ocGFja2FnZVBhdGgsICcvbm9kZV9tb2R1bGVzL2xpdmUtc2VydmVyL2xpdmUtc2VydmVyLmpzJyk7XG5cbmxldCBzZXJ2ZXJQcm9jZXNzO1xubGV0IGRpc3Bvc2VNZW51O1xubGV0IG5vQnJvd3NlcjtcblxuZnVuY3Rpb24gYWRkU3RhcnRNZW51KCkge1xuICBkaXNwb3NlTWVudSA9IGF0b20ubWVudS5hZGQoXG4gICAgW3tcbiAgICAgIGxhYmVsOiAnUGFja2FnZXMnLFxuICAgICAgc3VibWVudSA6IFt7XG4gICAgICAgIGxhYmVsOiAnYXRvbS1saXZlLXNlcnZlcicsXG4gICAgICAgIHN1Ym1lbnUgOiBbe1xuICAgICAgICAgIGxhYmVsOiAnU3RhcnQgc2VydmVyJyxcbiAgICAgICAgICBjb21tYW5kOiBgYXRvbS1saXZlLXNlcnZlcjpzdGFydFNlcnZlcmBcbiAgICAgICAgfV1cbiAgICAgIH1dXG4gICAgfV1cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2F0b20tbGl2ZS1zZXJ2ZXI6c3RhcnQtMzAwMCc6ICgpID0+IHRoaXMuc3RhcnRTZXJ2ZXIoMzAwMCksXG4gICAgICAnYXRvbS1saXZlLXNlcnZlcjpzdGFydC00MDAwJzogKCkgPT4gdGhpcy5zdGFydFNlcnZlcig0MDAwKSxcbiAgICAgICdhdG9tLWxpdmUtc2VydmVyOnN0YXJ0LTUwMDAnOiAoKSA9PiB0aGlzLnN0YXJ0U2VydmVyKDUwMDApLFxuICAgICAgJ2F0b20tbGl2ZS1zZXJ2ZXI6c3RhcnQtODAwMCc6ICgpID0+IHRoaXMuc3RhcnRTZXJ2ZXIoODAwMCksXG4gICAgICAnYXRvbS1saXZlLXNlcnZlcjpzdGFydC05MDAwJzogKCkgPT4gdGhpcy5zdGFydFNlcnZlcig5MDAwKSxcbiAgICAgICdhdG9tLWxpdmUtc2VydmVyOnN0YXJ0U2VydmVyJzogKCkgPT4gdGhpcy5zdGFydFNlcnZlcigpLFxuICAgICAgJ2F0b20tbGl2ZS1zZXJ2ZXI6c3RvcFNlcnZlcic6ICgpID0+IHRoaXMuc3RvcFNlcnZlcigpXG4gICAgfSkpO1xuXG4gICAgYWRkU3RhcnRNZW51KCk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN0b3BTZXJ2ZXIoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9LFxuXG4gIHN0YXJ0U2VydmVyKHBvcnQgPSAzMDAwKSB7XG4gICAgaWYgKHNlcnZlclByb2Nlc3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF07XG5cbiAgICBpZiAoIXRhcmdldFBhdGgpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdbTGl2ZSBTZXJ2ZXJdIFlvdSBoYXZlblxcJ3Qgb3BlbmVkIGEgUHJvamVjdCwgeW91IG11c3Qgb3BlbiBvbmUuJylcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBub0Jyb3dzZXIgPSBmYWxzZTtcbiAgICBjb25zdCBhcmdzID0gW107XG4gICAgY29uc3Qgc3Rkb3V0ID0gb3V0cHV0ID0+IHtcbiAgICAgIGlmIChvdXRwdXQuaW5kZXhPZignU2VydmluZyAnKSA9PT0gMCkge1xuICAgICAgICBjb25zdCBzZXJ2ZXJVcmwgPSBvdXRwdXQuc3BsaXQoJyBhdCAnKVsxXTtcbiAgICAgICAgY29uc3QgcG9ydCA9IHVybC5wYXJzZShzZXJ2ZXJVcmwpLnBvcnQ7XG4gICAgICAgIGNvbnN0IGRpc3Bvc2VTdGFydE1lbnUgPSBkaXNwb3NlTWVudTtcbiAgICAgICAgZGlzcG9zZU1lbnUgPSBhdG9tLm1lbnUuYWRkKFxuICAgICAgICAgIFt7XG4gICAgICAgICAgICBsYWJlbDogJ1BhY2thZ2VzJyxcbiAgICAgICAgICAgIHN1Ym1lbnUgOiBbe1xuICAgICAgICAgICAgICBsYWJlbDogJ2F0b20tbGl2ZS1zZXJ2ZXInLFxuICAgICAgICAgICAgICBzdWJtZW51IDogW3tcbiAgICAgICAgICAgICAgICBsYWJlbDogb3V0cHV0LnJlcGxhY2UoJ1NlcnZpbmcgJywgJ1N0b3AgJyksXG4gICAgICAgICAgICAgICAgY29tbWFuZDogYGF0b20tbGl2ZS1zZXJ2ZXI6c3RvcFNlcnZlcmBcbiAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgfV1cbiAgICAgICAgKTtcblxuICAgICAgICBkaXNwb3NlU3RhcnRNZW51LmRpc3Bvc2UoKTtcblxuICAgICAgICBpZiAobm9Ccm93c2VyKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoYFtMaXZlIFNlcnZlcl0gTGl2ZSBzZXJ2ZXIgc3RhcnRlZCBhdCAke3NlcnZlclVybH0uYCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coYFtMaXZlIFNlcnZlcl0gJHtvdXRwdXR9YCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGV4aXQgPSBjb2RlID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbyhgW0xpdmUgU2VydmVyXSBFeGl0ZWQgd2l0aCBjb2RlICR7Y29kZX1gKTtcbiAgICAgIHRoaXMuc3RvcFNlcnZlcigpO1xuICAgIH1cblxuICAgIGZzLm9wZW4ocGF0aC5qb2luKHRhcmdldFBhdGgsICcuYXRvbS1saXZlLXNlcnZlci5qc29uJyksICdyJywgKGVyciwgZmQpID0+IHtcbiAgICAgIGlmICghZXJyKSB7XG4gICAgICAgIGNvbnN0IHVzZXJDb25maWcgPSBKU09ONS5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZmQsICd1dGY4JykpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHVzZXJDb25maWcpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnbm8tYnJvd3NlcicpIHtcbiAgICAgICAgICAgIGlmICh1c2VyQ29uZmlnW2tleV0gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgYXJncy5wdXNoKGAtLSR7a2V5fWApO1xuICAgICAgICAgICAgICBub0Jyb3dzZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChrZXkgPT09ICdyb290Jykge1xuICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoYCR7dXNlckNvbmZpZ1trZXldfWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGFyZ3MucHVzaChgLS0ke2tleX09JHt1c2VyQ29uZmlnW2tleV19YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFhcmdzLmxlbmd0aCkge1xuICAgICAgICBhcmdzLnB1c2goYC0tcG9ydD0ke3BvcnR9YCk7XG4gICAgICB9XG5cbiAgICAgIHNlcnZlclByb2Nlc3MgPSBuZXcgQnVmZmVyZWROb2RlUHJvY2Vzcyh7XG4gICAgICAgIGNvbW1hbmQ6IGxpdmVTZXJ2ZXIsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIHN0ZG91dCxcbiAgICAgICAgZXhpdCxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGN3ZDogdGFyZ2V0UGF0aFxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc29sZS5pbmZvKGBbTGl2ZSBTZXJ2ZXJdIGxpdmUtc2VydmVyICR7YXJncy5qb2luKCcgJyl9YCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc3RvcFNlcnZlcigpIHtcbiAgICB0cnkge1xuICAgICAgc2VydmVyUHJvY2Vzcy5raWxsKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG5cbiAgICBzZXJ2ZXJQcm9jZXNzID0gbnVsbDtcbiAgICBjb25zdCBkaXNwb3NlU3RvcE1lbnUgPSBkaXNwb3NlTWVudTtcbiAgICBhZGRTdGFydE1lbnUoKTtcbiAgICBkaXNwb3NlU3RvcE1lbnUgJiYgZGlzcG9zZVN0b3BNZW51LmRpc3Bvc2UoKTtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnW0xpdmUgU2VydmVyXSBMaXZlIHNlcnZlciBpcyBzdG9wcGVkLicpO1xuICB9XG59O1xuIl19