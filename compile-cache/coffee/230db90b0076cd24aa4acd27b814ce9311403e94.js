(function() {
  var $$, CompositeDisposable, Emitter, ScriptInputView, ScriptProfileRunView, SelectListView, View, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ref1 = require('atom-space-pen-views'), $$ = _ref1.$$, View = _ref1.View, SelectListView = _ref1.SelectListView;

  ScriptInputView = require('./script-input-view');

  module.exports = ScriptProfileRunView = (function(_super) {
    __extends(ScriptProfileRunView, _super);

    function ScriptProfileRunView() {
      return ScriptProfileRunView.__super__.constructor.apply(this, arguments);
    }

    ScriptProfileRunView.prototype.initialize = function(profiles) {
      this.profiles = profiles;
      ScriptProfileRunView.__super__.initialize.apply(this, arguments);
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this),
        'script:run-with-profile': (function(_this) {
          return function() {
            if (_this.panel.isVisible()) {
              return _this.hide();
            } else {
              return _this.show();
            }
          };
        })(this)
      }));
      this.setItems(this.profiles);
      return this.initializeView();
    };

    ScriptProfileRunView.prototype.initializeView = function() {
      var selector;
      this.addClass('overlay from-top script-profile-run-view');
      this.buttons = $$(function() {
        return this.div({
          "class": 'block buttons'
        }, (function(_this) {
          return function() {
            var css;
            css = 'btn inline-block-tight';
            _this.button({
              "class": "btn cancel"
            }, function() {
              return _this.span({
                "class": 'icon icon-x'
              }, 'Cancel');
            });
            _this.button({
              "class": "btn rename"
            }, function() {
              return _this.span({
                "class": 'icon icon-pencil'
              }, 'Rename');
            });
            _this.button({
              "class": "btn delete"
            }, function() {
              return _this.span({
                "class": 'icon icon-trashcan'
              }, 'Delete');
            });
            return _this.button({
              "class": "btn run"
            }, function() {
              return _this.span({
                "class": 'icon icon-playback-play'
              }, 'Run');
            });
          };
        })(this));
      });
      this.buttons.find('.btn.cancel').on('click', (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this));
      this.buttons.find('.btn.rename').on('click', (function(_this) {
        return function() {
          return _this.rename();
        };
      })(this));
      this.buttons.find('.btn.delete').on('click', (function(_this) {
        return function() {
          return _this["delete"]();
        };
      })(this));
      this.buttons.find('.btn.run').on('click', (function(_this) {
        return function() {
          return _this.run();
        };
      })(this));
      this.buttons.find('.btn.run').on('keydown', (function(_this) {
        return function(e) {
          if (e.keyCode === 9) {
            e.stopPropagation();
            e.preventDefault();
            return _this.focusFilterEditor();
          }
        };
      })(this));
      this.on('keydown', (function(_this) {
        return function(e) {
          if (e.keyCode === 27) {
            _this.hide();
          }
          if (e.keyCode === 13) {
            return _this.run();
          }
        };
      })(this));
      this.append(this.buttons);
      selector = '.rename, .delete, .run';
      if (this.profiles.length) {
        this.buttons.find(selector).show();
      } else {
        this.buttons.find(selector).hide();
      }
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      return this.panel.hide();
    };

    ScriptProfileRunView.prototype.onProfileDelete = function(callback) {
      return this.emitter.on('on-profile-delete', callback);
    };

    ScriptProfileRunView.prototype.onProfileChange = function(callback) {
      return this.emitter.on('on-profile-change', callback);
    };

    ScriptProfileRunView.prototype.onProfileRun = function(callback) {
      return this.emitter.on('on-profile-run', callback);
    };

    ScriptProfileRunView.prototype.rename = function() {
      var inputView, profile;
      profile = this.getSelectedItem();
      if (!profile) {
        return;
      }
      inputView = new ScriptInputView({
        caption: 'Enter new profile name:',
        "default": profile.name
      });
      inputView.onCancel((function(_this) {
        return function() {
          return _this.show();
        };
      })(this));
      inputView.onConfirm((function(_this) {
        return function(newProfileName) {
          if (!newProfileName) {
            return;
          }
          return _this.emitter.emit('on-profile-change', {
            profile: profile,
            key: 'name',
            value: newProfileName
          });
        };
      })(this));
      return inputView.show();
    };

    ScriptProfileRunView.prototype["delete"] = function() {
      var profile;
      profile = this.getSelectedItem();
      if (!profile) {
        return;
      }
      return atom.confirm({
        message: 'Delete profile',
        detailedMessage: "Are you sure you want to delete \"" + profile.name + "\" profile?",
        buttons: {
          No: (function(_this) {
            return function() {
              return _this.focusFilterEditor();
            };
          })(this),
          Yes: (function(_this) {
            return function() {
              return _this.emitter.emit('on-profile-delete', profile);
            };
          })(this)
        }
      });
    };

    ScriptProfileRunView.prototype.getFilterKey = function() {
      return 'name';
    };

    ScriptProfileRunView.prototype.getEmptyMessage = function() {
      return 'No profiles found';
    };

    ScriptProfileRunView.prototype.viewForItem = function(item) {
      return $$(function() {
        return this.li({
          "class": 'two-lines profile'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'primary-line name'
            }, function() {
              return _this.text(item.name);
            });
            return _this.div({
              "class": 'secondary-line description'
            }, function() {
              return _this.text(item.description);
            });
          };
        })(this));
      });
    };

    ScriptProfileRunView.prototype.cancel = function() {};

    ScriptProfileRunView.prototype.confirmed = function(item) {};

    ScriptProfileRunView.prototype.show = function() {
      this.panel.show();
      return this.focusFilterEditor();
    };

    ScriptProfileRunView.prototype.hide = function() {
      this.panel.hide();
      return atom.workspace.getActivePane().activate();
    };

    ScriptProfileRunView.prototype.setProfiles = function(profiles) {
      var selector;
      this.profiles = profiles;
      this.setItems(this.profiles);
      selector = '.rename, .delete, .run';
      if (this.profiles.length) {
        this.buttons.find(selector).show();
      } else {
        this.buttons.find(selector).hide();
      }
      this.populateList();
      return this.focusFilterEditor();
    };

    ScriptProfileRunView.prototype.close = function() {};

    ScriptProfileRunView.prototype.destroy = function() {
      var _ref2;
      return (_ref2 = this.subscriptions) != null ? _ref2.dispose() : void 0;
    };

    ScriptProfileRunView.prototype.run = function() {
      var profile;
      profile = this.getSelectedItem();
      if (!profile) {
        return;
      }
      this.emitter.emit('on-profile-run', profile);
      return this.hide();
    };

    return ScriptProfileRunView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC1wcm9maWxlLXJ1bi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwR0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixlQUFBLE9BQXRCLENBQUE7O0FBQUEsRUFDQSxRQUE2QixPQUFBLENBQVEsc0JBQVIsQ0FBN0IsRUFBQyxXQUFBLEVBQUQsRUFBSyxhQUFBLElBQUwsRUFBVyx1QkFBQSxjQURYLENBQUE7O0FBQUEsRUFFQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQUZsQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxtQ0FBQSxVQUFBLEdBQVksU0FBRSxRQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxXQUFBLFFBQ1osQ0FBQTtBQUFBLE1BQUEsc0RBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BRlgsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUpqQixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtBQUFBLFFBQUEsYUFBQSxFQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFB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

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/script-profile-run-view.coffee
