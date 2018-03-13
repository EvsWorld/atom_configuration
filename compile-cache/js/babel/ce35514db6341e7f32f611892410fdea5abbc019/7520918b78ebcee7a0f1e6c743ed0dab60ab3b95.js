Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable func-names */

var _atom = require('atom');

var _atomSpacePenViews = require('atom-space-pen-views');

var _scriptInputView = require('./script-input-view');

var _scriptInputView2 = _interopRequireDefault(_scriptInputView);

'use babel';
var ScriptProfileRunView = (function (_SelectListView) {
  _inherits(ScriptProfileRunView, _SelectListView);

  function ScriptProfileRunView() {
    _classCallCheck(this, ScriptProfileRunView);

    _get(Object.getPrototypeOf(ScriptProfileRunView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ScriptProfileRunView, [{
    key: 'initialize',
    value: function initialize(profiles) {
      var _this = this;

      this.profiles = profiles;
      _get(Object.getPrototypeOf(ScriptProfileRunView.prototype), 'initialize', this).apply(this, arguments);

      this.emitter = new _atom.Emitter();

      this.subscriptions = new _atom.CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': function coreCancel() {
          return _this.hide();
        },
        'core:close': function coreClose() {
          return _this.hide();
        },
        'script:run-with-profile': function scriptRunWithProfile() {
          return _this.panel.isVisible() ? _this.hide() : _this.show();
        }
      }));

      this.setItems(this.profiles);
      this.initializeView();
    }
  }, {
    key: 'initializeView',
    value: function initializeView() {
      var _this3 = this;

      this.addClass('overlay from-top script-profile-run-view');
      // @panel.hide()

      this.buttons = (0, _atomSpacePenViews.$$)(function () {
        var _this2 = this;

        this.div({ 'class': 'block buttons' }, function () {
          /* eslint-disable no-unused-vars */
          var css = 'btn inline-block-tight';
          /* eslint-enable no-unused-vars */
          _this2.button({ 'class': 'btn cancel' }, function () {
            return _this2.span({ 'class': 'icon icon-x' }, 'Cancel');
          });
          _this2.button({ 'class': 'btn rename' }, function () {
            return _this2.span({ 'class': 'icon icon-pencil' }, 'Rename');
          });
          _this2.button({ 'class': 'btn delete' }, function () {
            return _this2.span({ 'class': 'icon icon-trashcan' }, 'Delete');
          });
          _this2.button({ 'class': 'btn run' }, function () {
            return _this2.span({ 'class': 'icon icon-playback-play' }, 'Run');
          });
        });
      });

      // event handlers
      this.buttons.find('.btn.cancel').on('click', function () {
        return _this3.hide();
      });
      this.buttons.find('.btn.rename').on('click', function () {
        return _this3.rename();
      });
      this.buttons.find('.btn.delete').on('click', function () {
        return _this3['delete']();
      });
      this.buttons.find('.btn.run').on('click', function () {
        return _this3.run();
      });

      // fix focus traversal (from run button to filter editor)
      this.buttons.find('.btn.run').on('keydown', function (e) {
        if (e.keyCode === 9) {
          e.stopPropagation();
          e.preventDefault();
          _this3.focusFilterEditor();
        }
      });

      // hide panel on ecsape
      this.on('keydown', function (e) {
        if (e.keyCode === 27) {
          _this3.hide();
        }
        if (e.keyCode === 13) {
          _this3.run();
        }
      });

      // append buttons container
      this.append(this.buttons);

      var selector = '.rename, .delete, .run';
      if (this.profiles.length) {
        this.buttons.find(selector).show();
      } else {
        this.buttons.find(selector).hide();
      }

      this.panel = atom.workspace.addModalPanel({ item: this });
      this.panel.hide();
    }
  }, {
    key: 'onProfileDelete',
    value: function onProfileDelete(callback) {
      return this.emitter.on('on-profile-delete', callback);
    }
  }, {
    key: 'onProfileChange',
    value: function onProfileChange(callback) {
      return this.emitter.on('on-profile-change', callback);
    }
  }, {
    key: 'onProfileRun',
    value: function onProfileRun(callback) {
      return this.emitter.on('on-profile-run', callback);
    }
  }, {
    key: 'rename',
    value: function rename() {
      var _this4 = this;

      var profile = this.getSelectedItem();
      if (!profile) {
        return;
      }

      var inputView = new _scriptInputView2['default']({ caption: 'Enter new profile name:', 'default': profile.name });
      inputView.onCancel(function () {
        return _this4.show();
      });
      inputView.onConfirm(function (newProfileName) {
        if (!newProfileName) {
          return;
        }
        _this4.emitter.emit('on-profile-change', { profile: profile, key: 'name', value: newProfileName });
      });

      inputView.show();
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var _this5 = this;

      var profile = this.getSelectedItem();
      if (!profile) {
        return;
      }

      atom.confirm({
        message: 'Delete profile',
        detailedMessage: 'Are you sure you want to delete "' + profile.name + '" profile?',
        buttons: {
          No: function No() {
            return _this5.focusFilterEditor();
          },
          Yes: function Yes() {
            return _this5.emitter.emit('on-profile-delete', profile);
          }
        }
      });
    }
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      return 'name';
    }
  }, {
    key: 'getEmptyMessage',
    value: function getEmptyMessage() {
      return 'No profiles found';
    }
  }, {
    key: 'viewForItem',
    value: function viewForItem(item) {
      return (0, _atomSpacePenViews.$$)(function () {
        var _this6 = this;

        this.li({ 'class': 'two-lines profile' }, function () {
          _this6.div({ 'class': 'primary-line name' }, function () {
            return _this6.text(item.name);
          });
          _this6.div({ 'class': 'secondary-line description' }, function () {
            return _this6.text(item.description);
          });
        });
      });
    }
  }, {
    key: 'cancel',
    value: function cancel() {}
  }, {
    key: 'confirmed',
    value: function confirmed() {}
  }, {
    key: 'show',
    value: function show() {
      this.panel.show();
      this.focusFilterEditor();
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.panel.hide();
      atom.workspace.getActivePane().activate();
    }

    // Updates profiles
  }, {
    key: 'setProfiles',
    value: function setProfiles(profiles) {
      this.profiles = profiles;
      this.setItems(this.profiles);

      // toggle profile controls
      var selector = '.rename, .delete, .run';
      if (this.profiles.length) {
        this.buttons.find(selector).show();
      } else {
        this.buttons.find(selector).hide();
      }

      this.populateList();
      this.focusFilterEditor();
    }
  }, {
    key: 'close',
    value: function close() {}
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.subscriptions) this.subscriptions.dispose();
    }
  }, {
    key: 'run',
    value: function run() {
      var profile = this.getSelectedItem();
      if (!profile) {
        return;
      }

      this.emitter.emit('on-profile-run', profile);
      this.hide();
    }
  }]);

  return ScriptProfileRunView;
})(_atomSpacePenViews.SelectListView);

exports['default'] = ScriptProfileRunView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9zY3JpcHQtcHJvZmlsZS1ydW4tdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUc2QyxNQUFNOztpQ0FDaEIsc0JBQXNCOzsrQkFDN0IscUJBQXFCOzs7O0FBTGpELFdBQVcsQ0FBQztJQU9TLG9CQUFvQjtZQUFwQixvQkFBb0I7O1dBQXBCLG9CQUFvQjswQkFBcEIsb0JBQW9COzsrQkFBcEIsb0JBQW9COzs7ZUFBcEIsb0JBQW9COztXQUM3QixvQkFBQyxRQUFRLEVBQUU7OztBQUNuQixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixpQ0FIaUIsb0JBQW9CLDZDQUdqQixTQUFTLEVBQUU7O0FBRS9CLFVBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQzs7QUFFN0IsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCxxQkFBYSxFQUFFO2lCQUFNLE1BQUssSUFBSSxFQUFFO1NBQUE7QUFDaEMsb0JBQVksRUFBRTtpQkFBTSxNQUFLLElBQUksRUFBRTtTQUFBO0FBQy9CLGlDQUF5QixFQUFFO2lCQUFPLE1BQUssS0FBSyxDQUFDLFNBQVMsRUFBRSxHQUFHLE1BQUssSUFBSSxFQUFFLEdBQUcsTUFBSyxJQUFJLEVBQUU7U0FBQztPQUN0RixDQUFDLENBQUMsQ0FBQzs7QUFFSixVQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixVQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDdkI7OztXQUVhLDBCQUFHOzs7QUFDZixVQUFJLENBQUMsUUFBUSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7OztBQUcxRCxVQUFJLENBQUMs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b20vcGFja2FnZXMvc2NyaXB0L2xpYi9zY3JpcHQtcHJvZmlsZS1ydW4tdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jLW5hbWVzICovXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgeyAkJCwgU2VsZWN0TGlzdFZpZXcgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5pbXBvcnQgU2NyaXB0SW5wdXRWaWV3IGZyb20gJy4vc2NyaXB0LWlucHV0LXZpZXcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JpcHRQcm9maWxlUnVuVmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3IHtcbiAgaW5pdGlhbGl6ZShwcm9maWxlcykge1xuICAgIHRoaXMucHJvZmlsZXMgPSBwcm9maWxlcztcbiAgICBzdXBlci5pbml0aWFsaXplKC4uLmFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdjb3JlOmNhbmNlbCc6ICgpID0+IHRoaXMuaGlkZSgpLFxuICAgICAgJ2NvcmU6Y2xvc2UnOiAoKSA9PiB0aGlzLmhpZGUoKSxcbiAgICAgICdzY3JpcHQ6cnVuLXdpdGgtcHJvZmlsZSc6ICgpID0+ICh0aGlzLnBhbmVsLmlzVmlzaWJsZSgpID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3coKSksXG4gICAgfSkpO1xuXG4gICAgdGhpcy5zZXRJdGVtcyh0aGlzLnByb2ZpbGVzKTtcbiAgICB0aGlzLmluaXRpYWxpemVWaWV3KCk7XG4gIH1cblxuICBpbml0aWFsaXplVmlldygpIHtcbiAgICB0aGlzLmFkZENsYXNzKCdvdmVybGF5IGZyb20tdG9wIHNjcmlwdC1wcm9maWxlLXJ1bi12aWV3Jyk7XG4gICAgLy8gQHBhbmVsLmhpZGUoKVxuXG4gICAgdGhpcy5idXR0b25zID0gJCQoZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ2Jsb2NrIGJ1dHRvbnMnIH0sICgpID0+IHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgICAgY29uc3QgY3NzID0gJ2J0biBpbmxpbmUtYmxvY2stdGlnaHQnO1xuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgICAgIHRoaXMuYnV0dG9uKHsgY2xhc3M6ICdidG4gY2FuY2VsJyB9LCAoKSA9PiB0aGlzLnNwYW4oeyBjbGFzczogJ2ljb24gaWNvbi14JyB9LCAnQ2FuY2VsJykpO1xuICAgICAgICB0aGlzLmJ1dHRvbih7IGNsYXNzOiAnYnRuIHJlbmFtZScgfSwgKCkgPT4gdGhpcy5zcGFuKHsgY2xhc3M6ICdpY29uIGljb24tcGVuY2lsJyB9LCAnUmVuYW1lJykpO1xuICAgICAgICB0aGlzLmJ1dHRvbih7IGNsYXNzOiAnYnRuIGRlbGV0ZScgfSwgKCkgPT4gdGhpcy5zcGFuKHsgY2xhc3M6ICdpY29uIGljb24tdHJhc2hjYW4nIH0sICdEZWxldGUnKSk7XG4gICAgICAgIHRoaXMuYnV0dG9uKHsgY2xhc3M6ICdidG4gcnVuJyB9LCAoKSA9PiB0aGlzLnNwYW4oeyBjbGFzczogJ2ljb24gaWNvbi1wbGF5YmFjay1wbGF5JyB9LCAnUnVuJykpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBldmVudCBoYW5kbGVyc1xuICAgIHRoaXMuYnV0dG9ucy5maW5kKCcuYnRuLmNhbmNlbCcpLm9uKCdjbGljaycsICgpID0+IHRoaXMuaGlkZSgpKTtcbiAgICB0aGlzLmJ1dHRvbnMuZmluZCgnLmJ0bi5yZW5hbWUnKS5vbignY2xpY2snLCAoKSA9PiB0aGlzLnJlbmFtZSgpKTtcbiAgICB0aGlzLmJ1dHRvbnMuZmluZCgnLmJ0bi5kZWxldGUnKS5vbignY2xpY2snLCAoKSA9PiB0aGlzLmRlbGV0ZSgpKTtcbiAgICB0aGlzLmJ1dHRvbnMuZmluZCgnLmJ0bi5ydW4nKS5vbignY2xpY2snLCAoKSA9PiB0aGlzLnJ1bigpKTtcblxuICAgIC8vIGZpeCBmb2N1cyB0cmF2ZXJzYWwgKGZyb20gcnVuIGJ1dHRvbiB0byBmaWx0ZXIgZWRpdG9yKVxuICAgIHRoaXMuYnV0dG9ucy5maW5kKCcuYnRuLnJ1bicpLm9uKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDkpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmZvY3VzRmlsdGVyRWRpdG9yKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBoaWRlIHBhbmVsIG9uIGVjc2FwZVxuICAgIHRoaXMub24oJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMjcpIHsgdGhpcy5oaWRlKCk7IH1cbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7IHRoaXMucnVuKCk7IH1cbiAgICB9KTtcblxuICAgIC8vIGFwcGVuZCBidXR0b25zIGNvbnRhaW5lclxuICAgIHRoaXMuYXBwZW5kKHRoaXMuYnV0dG9ucyk7XG5cbiAgICBjb25zdCBzZWxlY3RvciA9ICcucmVuYW1lLCAuZGVsZXRlLCAucnVuJztcbiAgICBpZiAodGhpcy5wcm9maWxlcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuYnV0dG9ucy5maW5kKHNlbGVjdG9yKS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYnV0dG9ucy5maW5kKHNlbGVjdG9yKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiB0aGlzIH0pO1xuICAgIHRoaXMucGFuZWwuaGlkZSgpO1xuICB9XG5cbiAgb25Qcm9maWxlRGVsZXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignb24tcHJvZmlsZS1kZWxldGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBvblByb2ZpbGVDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdvbi1wcm9maWxlLWNoYW5nZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uUHJvZmlsZVJ1bihjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ29uLXByb2ZpbGUtcnVuJywgY2FsbGJhY2spO1xuICB9XG5cblxuICByZW5hbWUoKSB7XG4gICAgY29uc3QgcHJvZmlsZSA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtKCk7XG4gICAgaWYgKCFwcm9maWxlKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgaW5wdXRWaWV3ID0gbmV3IFNjcmlwdElucHV0Vmlldyh7IGNhcHRpb246ICdFbnRlciBuZXcgcHJvZmlsZSBuYW1lOicsIGRlZmF1bHQ6IHByb2ZpbGUubmFtZSB9KTtcbiAgICBpbnB1dFZpZXcub25DYW5jZWwoKCkgPT4gdGhpcy5zaG93KCkpO1xuICAgIGlucHV0Vmlldy5vbkNvbmZpcm0oKG5ld1Byb2ZpbGVOYW1lKSA9PiB7XG4gICAgICBpZiAoIW5ld1Byb2ZpbGVOYW1lKSB7IHJldHVybjsgfVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ29uLXByb2ZpbGUtY2hhbmdlJywgeyBwcm9maWxlLCBrZXk6ICduYW1lJywgdmFsdWU6IG5ld1Byb2ZpbGVOYW1lIH0pO1xuICAgIH0sXG4gICAgKTtcblxuICAgIGlucHV0Vmlldy5zaG93KCk7XG4gIH1cblxuICBkZWxldGUoKSB7XG4gICAgY29uc3QgcHJvZmlsZSA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtKCk7XG4gICAgaWYgKCFwcm9maWxlKSB7IHJldHVybjsgfVxuXG4gICAgYXRvbS5jb25maXJtKHtcbiAgICAgIG1lc3NhZ2U6ICdEZWxldGUgcHJvZmlsZScsXG4gICAgICBkZXRhaWxlZE1lc3NhZ2U6IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIFwiJHtwcm9maWxlLm5hbWV9XCIgcHJvZmlsZT9gLFxuICAgICAgYnV0dG9uczoge1xuICAgICAgICBObzogKCkgPT4gdGhpcy5mb2N1c0ZpbHRlckVkaXRvcigpLFxuICAgICAgICBZZXM6ICgpID0+IHRoaXMuZW1pdHRlci5lbWl0KCdvbi1wcm9maWxlLWRlbGV0ZScsIHByb2ZpbGUpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGdldEZpbHRlcktleSgpIHtcbiAgICByZXR1cm4gJ25hbWUnO1xuICB9XG5cbiAgZ2V0RW1wdHlNZXNzYWdlKCkge1xuICAgIHJldHVybiAnTm8gcHJvZmlsZXMgZm91bmQnO1xuICB9XG5cbiAgdmlld0Zvckl0ZW0oaXRlbSkge1xuICAgIHJldHVybiAkJChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmxpKHsgY2xhc3M6ICd0d28tbGluZXMgcHJvZmlsZScgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAncHJpbWFyeS1saW5lIG5hbWUnIH0sICgpID0+IHRoaXMudGV4dChpdGVtLm5hbWUpKTtcbiAgICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ3NlY29uZGFyeS1saW5lIGRlc2NyaXB0aW9uJyB9LCAoKSA9PiB0aGlzLnRleHQoaXRlbS5kZXNjcmlwdGlvbikpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjYW5jZWwoKSB7fVxuICBjb25maXJtZWQoKSB7fVxuXG4gIHNob3coKSB7XG4gICAgdGhpcy5wYW5lbC5zaG93KCk7XG4gICAgdGhpcy5mb2N1c0ZpbHRlckVkaXRvcigpO1xuICB9XG5cbiAgaGlkZSgpIHtcbiAgICB0aGlzLnBhbmVsLmhpZGUoKTtcbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKTtcbiAgfVxuXG4gIC8vIFVwZGF0ZXMgcHJvZmlsZXNcbiAgc2V0UHJvZmlsZXMocHJvZmlsZXMpIHtcbiAgICB0aGlzLnByb2ZpbGVzID0gcHJvZmlsZXM7XG4gICAgdGhpcy5zZXRJdGVtcyh0aGlzLnByb2ZpbGVzKTtcblxuICAgIC8vIHRvZ2dsZSBwcm9maWxlIGNvbnRyb2xzXG4gICAgY29uc3Qgc2VsZWN0b3IgPSAnLnJlbmFtZSwgLmRlbGV0ZSwgLnJ1bic7XG4gICAgaWYgKHRoaXMucHJvZmlsZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmJ1dHRvbnMuZmluZChzZWxlY3Rvcikuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJ1dHRvbnMuZmluZChzZWxlY3RvcikuaGlkZSgpO1xuICAgIH1cblxuICAgIHRoaXMucG9wdWxhdGVMaXN0KCk7XG4gICAgdGhpcy5mb2N1c0ZpbHRlckVkaXRvcigpO1xuICB9XG5cbiAgY2xvc2UoKSB7fVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHJ1bigpIHtcbiAgICBjb25zdCBwcm9maWxlID0gdGhpcy5nZXRTZWxlY3RlZEl0ZW0oKTtcbiAgICBpZiAoIXByb2ZpbGUpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb24tcHJvZmlsZS1ydW4nLCBwcm9maWxlKTtcbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxufVxuIl19