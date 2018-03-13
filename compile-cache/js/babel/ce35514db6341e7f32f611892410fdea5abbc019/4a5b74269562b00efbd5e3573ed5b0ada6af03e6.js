Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable func-names */

var _atomSpacePenViews = require('atom-space-pen-views');

var _atomMessagePanel = require('atom-message-panel');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _ansiToHtml = require('ansi-to-html');

var _ansiToHtml2 = _interopRequireDefault(_ansiToHtml);

var _stripAnsi = require('strip-ansi');

var _stripAnsi2 = _interopRequireDefault(_stripAnsi);

var _headerView = require('./header-view');

var _headerView2 = _interopRequireDefault(_headerView);

var _linkPaths = require('./link-paths');

var _linkPaths2 = _interopRequireDefault(_linkPaths);

// Runs a portion of a script through an interpreter and displays it line by line
'use babel';
var ScriptView = (function (_MessagePanelView) {
  _inherits(ScriptView, _MessagePanelView);

  function ScriptView() {
    _classCallCheck(this, ScriptView);

    var headerView = new _headerView2['default']();
    _get(Object.getPrototypeOf(ScriptView.prototype), 'constructor', this).call(this, { title: headerView, rawTitle: true, closeMethod: 'destroy' });

    this.scrollTimeout = null;
    this.ansiFilter = new _ansiToHtml2['default']();
    this.headerView = headerView;

    this.showInTab = this.showInTab.bind(this);
    this.setHeaderAndShowExecutionTime = this.setHeaderAndShowExecutionTime.bind(this);
    this.addClass('script-view');
    this.addShowInTabIcon();

    _linkPaths2['default'].listen(this.body);
  }

  _createClass(ScriptView, [{
    key: 'addShowInTabIcon',
    value: function addShowInTabIcon() {
      var icon = (0, _atomSpacePenViews.$$)(function () {
        this.div({
          'class': 'heading-show-in-tab inline-block icon-file-text',
          style: 'cursor: pointer;',
          outlet: 'btnShowInTab',
          title: 'Show output in new tab'
        });
      });

      icon.click(this.showInTab);
      icon.insertBefore(this.btnAutoScroll);
    }
  }, {
    key: 'showInTab',
    value: function showInTab() {
      // concat output
      var output = '';
      for (var message of this.messages) {
        output += message.text();
      }

      // represent command context
      var context = '';
      if (this.commandContext) {
        context = '[Command: ' + this.commandContext.getRepresentation() + ']\n';
      }

      // open new tab and set content to output
      atom.workspace.open().then(function (editor) {
        return editor.setText((0, _stripAnsi2['default'])(context + output));
      });
    }
  }, {
    key: 'setHeaderAndShowExecutionTime',
    value: function setHeaderAndShowExecutionTime(returnCode, executionTime) {
      if (executionTime) {
        this.display('stdout', '[Finished in ' + executionTime.toString() + 's]');
      } else {
        this.display('stdout');
      }

      if (returnCode === 0) {
        this.setHeaderStatus('stop');
      } else {
        this.setHeaderStatus('err');
      }
    }
  }, {
    key: 'resetView',
    value: function resetView() {
      var title = arguments.length <= 0 || arguments[0] === undefined ? 'Loading...' : arguments[0];

      // Display window and load message

      // First run, create view
      if (!this.hasParent()) {
        this.attach();
      }

      this.setHeaderTitle(title);
      this.setHeaderStatus('start');

      // Get script view ready
      this.clear();
    }
  }, {
    key: 'removePanel',
    value: function removePanel() {
      this.stop();
      this.detach();
      // the 'close' method from MessagePanelView actually destroys the panel
      Object.getPrototypeOf(ScriptView.prototype).close.apply(this);
    }

    // This is triggered when hitting the 'close' button on the panel
    // We are not actually closing the panel here since we want to trigger
    // 'script:close-view' which will eventually remove the panel via 'removePanel'
  }, {
    key: 'close',
    value: function close() {
      var workspaceView = atom.views.getView(atom.workspace);
      atom.commands.dispatch(workspaceView, 'script:close-view');
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.display('stdout', '^C');
      this.setHeaderStatus('kill');
    }
  }, {
    key: 'createGitHubIssueLink',
    value: function createGitHubIssueLink(argType, lang) {
      var title = 'Add ' + argType + ' support for ' + lang;
      var body = '##### Platform: `' + process.platform + '`\n---\n';
      var encodedURI = encodeURI('https://github.com/rgbkrk/atom-script/issues/new?title=' + title + '&body=' + body);
      // NOTE: Replace "#" after regular encoding so we don't double escape it.
      encodedURI = encodedURI.replace(/#/g, '%23');

      var err = (0, _atomSpacePenViews.$$)(function () {
        var _this = this;

        this.p({ 'class': 'block' }, argType + ' runner not available for ' + lang + '.');
        this.p({ 'class': 'block' }, function () {
          _this.text('If it should exist, add an ');
          _this.a({ href: encodedURI }, 'issue on GitHub');
          _this.text(', or send your own pull request.');
        });
      });
      this.handleError(err);
    }
  }, {
    key: 'showUnableToRunError',
    value: function showUnableToRunError(command) {
      this.add((0, _atomSpacePenViews.$$)(function () {
        this.h1('Unable to run');
        this.pre(_underscore2['default'].escape(command));
        this.h2('Did you start Atom from the command line?');
        this.pre('  atom .');
        this.h2('Is it in your PATH?');
        this.pre('PATH: ' + _underscore2['default'].escape(process.env.PATH));
      }));
    }
  }, {
    key: 'showNoLanguageSpecified',
    value: function showNoLanguageSpecified() {
      var err = (0, _atomSpacePenViews.$$)(function () {
        this.p('You must select a language in the lower right, or save the file with an appropriate extension.');
      });
      this.handleError(err);
    }
  }, {
    key: 'showLanguageNotSupported',
    value: function showLanguageNotSupported(lang) {
      var err = (0, _atomSpacePenViews.$$)(function () {
        var _this2 = this;

        this.p({ 'class': 'block' }, 'Command not configured for ' + lang + '!');
        this.p({ 'class': 'block' }, function () {
          _this2.text('Add an ');
          _this2.a({ href: 'https://github.com/rgbkrk/atom-script/issues/new?title=Add%20support%20for%20' + lang }, 'issue on GitHub');
          _this2.text(' or send your own Pull Request.');
        });
      });
      this.handleError(err);
    }
  }, {
    key: 'handleError',
    value: function handleError(err) {
      // Display error and kill process
      this.setHeaderTitle('Error');
      this.setHeaderStatus('err');
      this.add(err);
      this.stop();
    }
  }, {
    key: 'setHeaderStatus',
    value: function setHeaderStatus(status) {
      this.headerView.setStatus(status);
    }
  }, {
    key: 'setHeaderTitle',
    value: function setHeaderTitle(title) {
      this.headerView.title.text(title);
    }
  }, {
    key: 'display',
    value: function display(css, line) {
      if (atom.config.get('script.escapeConsoleOutput')) {
        line = _underscore2['default'].escape(line);
      }

      line = this.ansiFilter.toHtml(line);
      line = (0, _linkPaths2['default'])(line);

      var _body$0 = this.body[0];
      var clientHeight = _body$0.clientHeight;
      var scrollTop = _body$0.scrollTop;
      var scrollHeight = _body$0.scrollHeight;

      // indicates that the panel is scrolled to the bottom, thus we know that
      // we are not interfering with the user's manual scrolling
      var atEnd = scrollTop >= scrollHeight - clientHeight;

      this.add((0, _atomSpacePenViews.$$)(function () {
        var _this3 = this;

        this.pre({ 'class': 'line ' + css }, function () {
          return _this3.raw(line);
        });
      }));

      if (atom.config.get('script.scrollWithOutput') && atEnd) {
        // Scroll down in a polling loop 'cause
        // we don't know when the reflow will finish.
        // See: http://stackoverflow.com/q/5017923/407845
        this.checkScrollAgain(5)();
      }
    }
  }, {
    key: 'checkScrollAgain',
    value: function checkScrollAgain(times) {
      var _this4 = this;

      return function () {
        _this4.body.scrollToBottom();

        clearTimeout(_this4.scrollTimeout);
        if (times > 1) {
          _this4.scrollTimeout = setTimeout(_this4.checkScrollAgain(times - 1), 50);
        }
      };
    }
  }, {
    key: 'copyResults',
    value: function copyResults() {
      if (this.results) {
        atom.clipboard.write((0, _stripAnsi2['default'])(this.results));
      }
    }
  }]);

  return ScriptView;
})(_atomMessagePanel.MessagePanelView);

exports['default'] = ScriptView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9zY3JpcHQtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2lDQUdtQixzQkFBc0I7O2dDQUNSLG9CQUFvQjs7MEJBQ3ZDLFlBQVk7Ozs7MEJBQ0gsY0FBYzs7Ozt5QkFDZixZQUFZOzs7OzBCQUVYLGVBQWU7Ozs7eUJBQ2hCLGNBQWM7Ozs7O0FBVnBDLFdBQVcsQ0FBQztJQWFTLFVBQVU7WUFBVixVQUFVOztBQUNsQixXQURRLFVBQVUsR0FDZjswQkFESyxVQUFVOztBQUUzQixRQUFNLFVBQVUsR0FBRyw2QkFBZ0IsQ0FBQztBQUNwQywrQkFIaUIsVUFBVSw2Q0FHckIsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFOztBQUVyRSxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztBQUMxQixRQUFJLENBQUMsVUFBVSxHQUFHLDZCQUFnQixDQUFDO0FBQ25DLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDOztBQUU3QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLFFBQUksQ0FBQyw2QkFBNkIsR0FBRyxJQUFJLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25GLFFBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDN0IsUUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7O0FBRXhCLDJCQUFVLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDN0I7O2VBZmtCLFVBQVU7O1dBaUJiLDRCQUFHO0FBQ2pCLFVBQU0sSUFBSSxHQUFHLDJCQUFHLFlBQVk7QUFDMUIsWUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNQ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O09BQ0YsQ0FBQztLQUNIOzs7V0FFVSx1QkFBRztBQUNaLFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyw0QkFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUMvQztLQUNGOzs7U0F2TWtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9zY3JpcHQtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jLW5hbWVzICovXG5pbXBvcnQgeyAkJCB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCB7IE1lc3NhZ2VQYW5lbFZpZXcgfSBmcm9tICdhdG9tLW1lc3NhZ2UtcGFuZWwnO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgQW5zaUZpbHRlciBmcm9tICdhbnNpLXRvLWh0bWwnO1xuaW1wb3J0IHN0cmlwQW5zaSBmcm9tICdzdHJpcC1hbnNpJztcblxuaW1wb3J0IEhlYWRlclZpZXcgZnJvbSAnLi9oZWFkZXItdmlldyc7XG5pbXBvcnQgbGlua1BhdGhzIGZyb20gJy4vbGluay1wYXRocyc7XG5cbi8vIFJ1bnMgYSBwb3J0aW9uIG9mIGEgc2NyaXB0IHRocm91Z2ggYW4gaW50ZXJwcmV0ZXIgYW5kIGRpc3BsYXlzIGl0IGxpbmUgYnkgbGluZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyaXB0VmlldyBleHRlbmRzIE1lc3NhZ2VQYW5lbFZpZXcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBoZWFkZXJWaWV3ID0gbmV3IEhlYWRlclZpZXcoKTtcbiAgICBzdXBlcih7IHRpdGxlOiBoZWFkZXJWaWV3LCByYXdUaXRsZTogdHJ1ZSwgY2xvc2VNZXRob2Q6ICdkZXN0cm95JyB9KTtcblxuICAgIHRoaXMuc2Nyb2xsVGltZW91dCA9IG51bGw7XG4gICAgdGhpcy5hbnNpRmlsdGVyID0gbmV3IEFuc2lGaWx0ZXIoKTtcbiAgICB0aGlzLmhlYWRlclZpZXcgPSBoZWFkZXJWaWV3O1xuXG4gICAgdGhpcy5zaG93SW5UYWIgPSB0aGlzLnNob3dJblRhYi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2V0SGVhZGVyQW5kU2hvd0V4ZWN1dGlvblRpbWUgPSB0aGlzLnNldEhlYWRlckFuZFNob3dFeGVjdXRpb25UaW1lLmJpbmQodGhpcyk7XG4gICAgdGhpcy5hZGRDbGFzcygnc2NyaXB0LXZpZXcnKTtcbiAgICB0aGlzLmFkZFNob3dJblRhYkljb24oKTtcblxuICAgIGxpbmtQYXRocy5saXN0ZW4odGhpcy5ib2R5KTtcbiAgfVxuXG4gIGFkZFNob3dJblRhYkljb24oKSB7XG4gICAgY29uc3QgaWNvbiA9ICQkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgY2xhc3M6ICdoZWFkaW5nLXNob3ctaW4tdGFiIGlubGluZS1ibG9jayBpY29uLWZpbGUtdGV4dCcsXG4gICAgICAgIHN0eWxlOiAnY3Vyc29yOiBwb2ludGVyOycsXG4gICAgICAgIG91dGxldDogJ2J0blNob3dJblRhYicsXG4gICAgICAgIHRpdGxlOiAnU2hvdyBvdXRwdXQgaW4gbmV3IHRhYicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGljb24uY2xpY2sodGhpcy5zaG93SW5UYWIpO1xuICAgIGljb24uaW5zZXJ0QmVmb3JlKHRoaXMuYnRuQXV0b1Njcm9sbCk7XG4gIH1cblxuICBzaG93SW5UYWIoKSB7XG4gICAgLy8gY29uY2F0IG91dHB1dFxuICAgIGxldCBvdXRwdXQgPSAnJztcbiAgICBmb3IgKGNvbnN0IG1lc3NhZ2Ugb2YgdGhpcy5tZXNzYWdlcykgeyBvdXRwdXQgKz0gbWVzc2FnZS50ZXh0KCk7IH1cblxuICAgIC8vIHJlcHJlc2VudCBjb21tYW5kIGNvbnRleHRcbiAgICBsZXQgY29udGV4dCA9ICcnO1xuICAgIGlmICh0aGlzLmNvbW1hbmRDb250ZXh0KSB7XG4gICAgICBjb250ZXh0ID0gYFtDb21tYW5kOiAke3RoaXMuY29tbWFuZENvbnRleHQuZ2V0UmVwcmVzZW50YXRpb24oKX1dXFxuYDtcbiAgICB9XG5cbiAgICAvLyBvcGVuIG5ldyB0YWIgYW5kIHNldCBjb250ZW50IHRvIG91dHB1dFxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oKS50aGVuKGVkaXRvciA9PiBlZGl0b3Iuc2V0VGV4dChzdHJpcEFuc2koY29udGV4dCArIG91dHB1dCkpKTtcbiAgfVxuXG4gIHNldEhlYWRlckFuZFNob3dFeGVjdXRpb25UaW1lKHJldHVybkNvZGUsIGV4ZWN1dGlvblRpbWUpIHtcbiAgICBpZiAoZXhlY3V0aW9uVGltZSkge1xuICAgICAgdGhpcy5kaXNwbGF5KCdzdGRvdXQnLCBgW0ZpbmlzaGVkIGluICR7ZXhlY3V0aW9uVGltZS50b1N0cmluZygpfXNdYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlzcGxheSgnc3Rkb3V0Jyk7XG4gICAgfVxuXG4gICAgaWYgKHJldHVybkNvZGUgPT09IDApIHtcbiAgICAgIHRoaXMuc2V0SGVhZGVyU3RhdHVzKCdzdG9wJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0SGVhZGVyU3RhdHVzKCdlcnInKTtcbiAgICB9XG4gIH1cblxuICByZXNldFZpZXcodGl0bGUgPSAnTG9hZGluZy4uLicpIHtcbiAgICAvLyBEaXNwbGF5IHdpbmRvdyBhbmQgbG9hZCBtZXNzYWdlXG5cbiAgICAvLyBGaXJzdCBydW4sIGNyZWF0ZSB2aWV3XG4gICAgaWYgKCF0aGlzLmhhc1BhcmVudCgpKSB7IHRoaXMuYXR0YWNoKCk7IH1cblxuICAgIHRoaXMuc2V0SGVhZGVyVGl0bGUodGl0bGUpO1xuICAgIHRoaXMuc2V0SGVhZGVyU3RhdHVzKCdzdGFydCcpO1xuXG4gICAgLy8gR2V0IHNjcmlwdCB2aWV3IHJlYWR5XG4gICAgdGhpcy5jbGVhcigpO1xuICB9XG5cbiAgcmVtb3ZlUGFuZWwoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gICAgdGhpcy5kZXRhY2goKTtcbiAgICAvLyB0aGUgJ2Nsb3NlJyBtZXRob2QgZnJvbSBNZXNzYWdlUGFuZWxWaWV3IGFjdHVhbGx5IGRlc3Ryb3lzIHRoZSBwYW5lbFxuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihTY3JpcHRWaWV3LnByb3RvdHlwZSkuY2xvc2UuYXBwbHkodGhpcyk7XG4gIH1cblxuICAvLyBUaGlzIGlzIHRyaWdnZXJlZCB3aGVuIGhpdHRpbmcgdGhlICdjbG9zZScgYnV0dG9uIG9uIHRoZSBwYW5lbFxuICAvLyBXZSBhcmUgbm90IGFjdHVhbGx5IGNsb3NpbmcgdGhlIHBhbmVsIGhlcmUgc2luY2Ugd2Ugd2FudCB0byB0cmlnZ2VyXG4gIC8vICdzY3JpcHQ6Y2xvc2Utdmlldycgd2hpY2ggd2lsbCBldmVudHVhbGx5IHJlbW92ZSB0aGUgcGFuZWwgdmlhICdyZW1vdmVQYW5lbCdcbiAgY2xvc2UoKSB7XG4gICAgY29uc3Qgd29ya3NwYWNlVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VWaWV3LCAnc2NyaXB0OmNsb3NlLXZpZXcnKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5kaXNwbGF5KCdzdGRvdXQnLCAnXkMnKTtcbiAgICB0aGlzLnNldEhlYWRlclN0YXR1cygna2lsbCcpO1xuICB9XG5cbiAgY3JlYXRlR2l0SHViSXNzdWVMaW5rKGFyZ1R5cGUsIGxhbmcpIHtcbiAgICBjb25zdCB0aXRsZSA9IGBBZGQgJHthcmdUeXBlfSBzdXBwb3J0IGZvciAke2xhbmd9YDtcbiAgICBjb25zdCBib2R5ID0gYCMjIyMjIFBsYXRmb3JtOiBcXGAke3Byb2Nlc3MucGxhdGZvcm19XFxgXFxuLS0tXFxuYDtcbiAgICBsZXQgZW5jb2RlZFVSSSA9IGVuY29kZVVSSShgaHR0cHM6Ly9naXRodWIuY29tL3JnYmtyay9hdG9tLXNjcmlwdC9pc3N1ZXMvbmV3P3RpdGxlPSR7dGl0bGV9JmJvZHk9JHtib2R5fWApO1xuICAgIC8vIE5PVEU6IFJlcGxhY2UgXCIjXCIgYWZ0ZXIgcmVndWxhciBlbmNvZGluZyBzbyB3ZSBkb24ndCBkb3VibGUgZXNjYXBlIGl0LlxuICAgIGVuY29kZWRVUkkgPSBlbmNvZGVkVVJJLnJlcGxhY2UoLyMvZywgJyUyMycpO1xuXG4gICAgY29uc3QgZXJyID0gJCQoZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5wKHsgY2xhc3M6ICdibG9jaycgfSwgYCR7YXJnVHlwZX0gcnVubmVyIG5vdCBhdmFpbGFibGUgZm9yICR7bGFuZ30uYCk7XG4gICAgICB0aGlzLnAoeyBjbGFzczogJ2Jsb2NrJyB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMudGV4dCgnSWYgaXQgc2hvdWxkIGV4aXN0LCBhZGQgYW4gJyk7XG4gICAgICAgIHRoaXMuYSh7IGhyZWY6IGVuY29kZWRVUkkgfSwgJ2lzc3VlIG9uIEdpdEh1YicpO1xuICAgICAgICB0aGlzLnRleHQoJywgb3Igc2VuZCB5b3VyIG93biBwdWxsIHJlcXVlc3QuJyk7XG4gICAgICB9LFxuICAgICAgKTtcbiAgICB9KTtcbiAgICB0aGlzLmhhbmRsZUVycm9yKGVycik7XG4gIH1cblxuICBzaG93VW5hYmxlVG9SdW5FcnJvcihjb21tYW5kKSB7XG4gICAgdGhpcy5hZGQoJCQoZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5oMSgnVW5hYmxlIHRvIHJ1bicpO1xuICAgICAgdGhpcy5wcmUoXy5lc2NhcGUoY29tbWFuZCkpO1xuICAgICAgdGhpcy5oMignRGlkIHlvdSBzdGFydCBBdG9tIGZyb20gdGhlIGNvbW1hbmQgbGluZT8nKTtcbiAgICAgIHRoaXMucHJlKCcgIGF0b20gLicpO1xuICAgICAgdGhpcy5oMignSXMgaXQgaW4geW91ciBQQVRIPycpO1xuICAgICAgdGhpcy5wcmUoYFBBVEg6ICR7Xy5lc2NhcGUocHJvY2Vzcy5lbnYuUEFUSCl9YCk7XG4gICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIHNob3dOb0xhbmd1YWdlU3BlY2lmaWVkKCkge1xuICAgIGNvbnN0IGVyciA9ICQkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMucCgnWW91IG11c3Qgc2VsZWN0IGEgbGFuZ3VhZ2UgaW4gdGhlIGxvd2VyIHJpZ2h0LCBvciBzYXZlIHRoZSBmaWxlIHdpdGggYW4gYXBwcm9wcmlhdGUgZXh0ZW5zaW9uLicsXG4gICAgKTtcbiAgICB9KTtcbiAgICB0aGlzLmhhbmRsZUVycm9yKGVycik7XG4gIH1cblxuICBzaG93TGFuZ3VhZ2VOb3RTdXBwb3J0ZWQobGFuZykge1xuICAgIGNvbnN0IGVyciA9ICQkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMucCh7IGNsYXNzOiAnYmxvY2snIH0sIGBDb21tYW5kIG5vdCBjb25maWd1cmVkIGZvciAke2xhbmd9IWApO1xuICAgICAgdGhpcy5wKHsgY2xhc3M6ICdibG9jaycgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLnRleHQoJ0FkZCBhbiAnKTtcbiAgICAgICAgdGhpcy5hKHsgaHJlZjogYGh0dHBzOi8vZ2l0aHViLmNvbS9yZ2JrcmsvYXRvbS1zY3JpcHQvaXNzdWVzL25ldz90aXRsZT1BZGQlMjBzdXBwb3J0JTIwZm9yJTIwJHtsYW5nfWAgfSwgJ2lzc3VlIG9uIEdpdEh1YicpO1xuICAgICAgICB0aGlzLnRleHQoJyBvciBzZW5kIHlvdXIgb3duIFB1bGwgUmVxdWVzdC4nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyKTtcbiAgfVxuXG4gIGhhbmRsZUVycm9yKGVycikge1xuICAgIC8vIERpc3BsYXkgZXJyb3IgYW5kIGtpbGwgcHJvY2Vzc1xuICAgIHRoaXMuc2V0SGVhZGVyVGl0bGUoJ0Vycm9yJyk7XG4gICAgdGhpcy5zZXRIZWFkZXJTdGF0dXMoJ2VycicpO1xuICAgIHRoaXMuYWRkKGVycik7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cblxuICBzZXRIZWFkZXJTdGF0dXMoc3RhdHVzKSB7XG4gICAgdGhpcy5oZWFkZXJWaWV3LnNldFN0YXR1cyhzdGF0dXMpO1xuICB9XG5cbiAgc2V0SGVhZGVyVGl0bGUodGl0bGUpIHtcbiAgICB0aGlzLmhlYWRlclZpZXcudGl0bGUudGV4dCh0aXRsZSk7XG4gIH1cblxuICBkaXNwbGF5KGNzcywgbGluZSkge1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3NjcmlwdC5lc2NhcGVDb25zb2xlT3V0cHV0JykpIHtcbiAgICAgIGxpbmUgPSBfLmVzY2FwZShsaW5lKTtcbiAgICB9XG5cbiAgICBsaW5lID0gdGhpcy5hbnNpRmlsdGVyLnRvSHRtbChsaW5lKTtcbiAgICBsaW5lID0gbGlua1BhdGhzKGxpbmUpO1xuXG4gICAgY29uc3QgeyBjbGllbnRIZWlnaHQsIHNjcm9sbFRvcCwgc2Nyb2xsSGVpZ2h0IH0gPSB0aGlzLmJvZHlbMF07XG4gICAgLy8gaW5kaWNhdGVzIHRoYXQgdGhlIHBhbmVsIGlzIHNjcm9sbGVkIHRvIHRoZSBib3R0b20sIHRodXMgd2Uga25vdyB0aGF0XG4gICAgLy8gd2UgYXJlIG5vdCBpbnRlcmZlcmluZyB3aXRoIHRoZSB1c2VyJ3MgbWFudWFsIHNjcm9sbGluZ1xuICAgIGNvbnN0IGF0RW5kID0gc2Nyb2xsVG9wID49IChzY3JvbGxIZWlnaHQgLSBjbGllbnRIZWlnaHQpO1xuXG4gICAgdGhpcy5hZGQoJCQoZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5wcmUoeyBjbGFzczogYGxpbmUgJHtjc3N9YCB9LCAoKSA9PiB0aGlzLnJhdyhsaW5lKSk7XG4gICAgfSkpO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnc2NyaXB0LnNjcm9sbFdpdGhPdXRwdXQnKSAmJiBhdEVuZCkge1xuICAgICAgLy8gU2Nyb2xsIGRvd24gaW4gYSBwb2xsaW5nIGxvb3AgJ2NhdXNlXG4gICAgICAvLyB3ZSBkb24ndCBrbm93IHdoZW4gdGhlIHJlZmxvdyB3aWxsIGZpbmlzaC5cbiAgICAgIC8vIFNlZTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3EvNTAxNzkyMy80MDc4NDVcbiAgICAgIHRoaXMuY2hlY2tTY3JvbGxBZ2Fpbig1KSgpO1xuICAgIH1cbiAgfVxuICBjaGVja1Njcm9sbEFnYWluKHRpbWVzKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMuYm9keS5zY3JvbGxUb0JvdHRvbSgpO1xuXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5zY3JvbGxUaW1lb3V0KTtcbiAgICAgIGlmICh0aW1lcyA+IDEpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLmNoZWNrU2Nyb2xsQWdhaW4odGltZXMgLSAxKSwgNTApO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBjb3B5UmVzdWx0cygpIHtcbiAgICBpZiAodGhpcy5yZXN1bHRzKSB7XG4gICAgICBhdG9tLmNsaXBib2FyZC53cml0ZShzdHJpcEFuc2kodGhpcy5yZXN1bHRzKSk7XG4gICAgfVxuICB9XG59XG4iXX0=