(function() {
  var $$, AnsiFilter, HeaderView, MessagePanelView, ScriptView, View, linkPaths, stripAnsi, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $$ = _ref.$$;

  HeaderView = require('./header-view');

  MessagePanelView = require('atom-message-panel').MessagePanelView;

  AnsiFilter = require('ansi-to-html');

  stripAnsi = require('strip-ansi');

  linkPaths = require('./link-paths');

  _ = require('underscore');

  module.exports = ScriptView = (function(_super) {
    __extends(ScriptView, _super);

    function ScriptView() {
      this.setHeaderAndShowExecutionTime = __bind(this.setHeaderAndShowExecutionTime, this);
      this.showInTab = __bind(this.showInTab, this);
      this.ansiFilter = new AnsiFilter;
      this.headerView = new HeaderView;
      ScriptView.__super__.constructor.call(this, {
        title: this.headerView,
        rawTitle: true,
        closeMethod: 'destroy'
      });
      this.addClass('script-view');
      this.addShowInTabIcon();
      linkPaths.listen(this.body);
    }

    ScriptView.prototype.addShowInTabIcon = function() {
      var icon;
      icon = $$(function() {
        return this.div({
          "class": 'heading-show-in-tab inline-block icon-file-text',
          style: 'cursor: pointer;',
          outlet: 'btnShowInTab',
          title: 'Show output in new tab'
        });
      });
      icon.click(this.showInTab);
      return icon.insertBefore(this.btnAutoScroll);
    };

    ScriptView.prototype.showInTab = function() {
      var context, message, output, _i, _len, _ref1;
      output = '';
      _ref1 = this.messages;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        message = _ref1[_i];
        output += message.text();
      }
      context = '';
      if (this.commandContext) {
        context = "[Command: " + (this.commandContext.getRepresentation()) + "]\n";
      }
      return atom.workspace.open().then(function(editor) {
        return editor.setText(stripAnsi(context + output));
      });
    };

    ScriptView.prototype.setHeaderAndShowExecutionTime = function(returnCode, executionTime) {
      if ((executionTime != null)) {
        this.display('stdout', '[Finished in ' + executionTime.toString() + 's]');
      } else {
        this.display('stdout');
      }
      if (returnCode === 0) {
        return this.setHeaderStatus('stop');
      } else {
        return this.setHeaderStatus('err');
      }
    };

    ScriptView.prototype.resetView = function(title) {
      if (title == null) {
        title = 'Loading...';
      }
      if (!this.hasParent()) {
        this.attach();
      }
      this.setHeaderTitle(title);
      this.setHeaderStatus('start');
      return this.clear();
    };

    ScriptView.prototype.removePanel = function() {
      this.stop();
      this.detach();
      return ScriptView.__super__.close.apply(this);
    };

    ScriptView.prototype.close = function() {
      var workspaceView;
      workspaceView = atom.views.getView(atom.workspace);
      return atom.commands.dispatch(workspaceView, 'script:close-view');
    };

    ScriptView.prototype.stop = function() {
      this.display('stdout', '^C');
      return this.setHeaderStatus('kill');
    };

    ScriptView.prototype.createGitHubIssueLink = function(argType, lang) {
      var body, encodedURI, err, title;
      title = "Add " + argType + " support for " + lang;
      body = "##### Platform: `" + process.platform + "`\n---";
      encodedURI = encodeURI("https://github.com/rgbkrk/atom-script/issues/new?title=" + title + "&body=" + body);
      encodedURI = encodedURI.replace(/#/g, '%23');
      err = $$(function() {
        this.p({
          "class": 'block'
        }, "" + argType + " runner not available for " + lang + ".");
        return this.p({
          "class": 'block'
        }, (function(_this) {
          return function() {
            _this.text('If it should exist, add an ');
            _this.a({
              href: encodedURI
            }, 'issue on GitHub');
            return _this.text(', or send your own pull request.');
          };
        })(this));
      });
      return this.handleError(err);
    };

    ScriptView.prototype.showUnableToRunError = function(command) {
      return this.add($$(function() {
        this.h1('Unable to run');
        this.pre(_.escape(command));
        this.h2('Did you start Atom from the command line?');
        this.pre('  atom .');
        this.h2('Is it in your PATH?');
        return this.pre("PATH: " + (_.escape(process.env.PATH)));
      }));
    };

    ScriptView.prototype.showNoLanguageSpecified = function() {
      var err;
      err = $$(function() {
        return this.p('You must select a language in the lower right, or save the file with an appropriate extension.');
      });
      return this.handleError(err);
    };

    ScriptView.prototype.showLanguageNotSupported = function(lang) {
      var err;
      err = $$(function() {
        this.p({
          "class": 'block'
        }, "Command not configured for " + lang + "!");
        return this.p({
          "class": 'block'
        }, (function(_this) {
          return function() {
            _this.text('Add an ');
            _this.a({
              href: "https://github.com/rgbkrk/atom-script/issues/new?title=Add%20support%20for%20" + lang
            }, 'issue on GitHub');
            return _this.text(' or send your own Pull Request.');
          };
        })(this));
      });
      return this.handleError(err);
    };

    ScriptView.prototype.handleError = function(err) {
      this.setHeaderTitle('Error');
      this.setHeaderStatus('err');
      this.add(err);
      return this.stop();
    };

    ScriptView.prototype.setHeaderStatus = function(status) {
      return this.headerView.setStatus(status);
    };

    ScriptView.prototype.setHeaderTitle = function(title) {
      return this.headerView.title.text(title);
    };

    ScriptView.prototype.display = function(css, line) {
      var atEnd, clientHeight, scrollHeight, scrollTop, _ref1;
      if (atom.config.get('script.escapeConsoleOutput')) {
        line = _.escape(line);
      }
      line = this.ansiFilter.toHtml(line);
      line = linkPaths(line);
      _ref1 = this.body[0], clientHeight = _ref1.clientHeight, scrollTop = _ref1.scrollTop, scrollHeight = _ref1.scrollHeight;
      atEnd = scrollTop >= (scrollHeight - clientHeight);
      this.add($$(function() {
        return this.pre({
          "class": "line " + css
        }, (function(_this) {
          return function() {
            return _this.raw(line);
          };
        })(this));
      }));
      if (atom.config.get('script.scrollWithOutput') && atEnd) {
        return this.checkScrollAgain(5)();
      }
    };

    ScriptView.prototype.scrollTimeout = null;

    ScriptView.prototype.checkScrollAgain = function(times) {
      return (function(_this) {
        return function() {
          _this.body.scrollToBottom();
          clearTimeout(_this.scrollTimeout);
          if (times > 1) {
            return _this.scrollTimeout = setTimeout(_this.checkScrollAgain(times - 1), 50);
          }
        };
      })(this);
    };

    ScriptView.prototype.copyResults = function() {
      if (this.results) {
        return atom.clipboard.write(stripAnsi(this.results));
      }
    };

    return ScriptView;

  })(MessagePanelView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2RkFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQWEsT0FBQSxDQUFRLHNCQUFSLENBQWIsRUFBQyxZQUFBLElBQUQsRUFBTyxVQUFBLEVBQVAsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUZiLENBQUE7O0FBQUEsRUFHQyxtQkFBb0IsT0FBQSxDQUFRLG9CQUFSLEVBQXBCLGdCQUhELENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FKYixDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxZQUFSLENBTFosQ0FBQTs7QUFBQSxFQU1BLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQU5aLENBQUE7O0FBQUEsRUFPQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FQSixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGlDQUFBLENBQUE7O0FBQWEsSUFBQSxvQkFBQSxHQUFBO0FBQ1gsMkZBQUEsQ0FBQTtBQUFBLG1EQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsR0FBQSxDQUFBLFVBQWQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxHQUFBLENBQUEsVUFGZCxDQUFBO0FBQUEsTUFJQSw0Q0FBTTtBQUFBLFFBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxVQUFSO0FBQUEsUUFBb0IsUUFBQSxFQUFVLElBQTlCO0FBQUEsUUFBb0MsV0FBQSxFQUFhLFNBQWpEO09BQU4sQ0FKQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEs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

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/script-view.coffee
