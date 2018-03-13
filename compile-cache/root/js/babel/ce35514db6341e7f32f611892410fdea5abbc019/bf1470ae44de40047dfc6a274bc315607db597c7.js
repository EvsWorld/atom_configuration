Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbConfigFile = require('sb-config-file');

var _sbConfigFile2 = _interopRequireDefault(_sbConfigFile);

var _atomSelectList = require('atom-select-list');

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _atom = require('atom');

var _helpers = require('./helpers');

var ToggleProviders = (function () {
  function ToggleProviders(action, providers) {
    _classCallCheck(this, ToggleProviders);

    this.action = action;
    this.config = null;
    this.emitter = new _atom.Emitter();
    this.providers = providers;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  _createClass(ToggleProviders, [{
    key: 'getConfig',
    value: _asyncToGenerator(function* () {
      if (!this.config) {
        this.config = yield (0, _helpers.getConfigFile)();
      }
      return this.config;
    })
  }, {
    key: 'getItems',
    value: _asyncToGenerator(function* () {
      var disabled = yield (yield this.getConfig()).get('disabled');
      if (this.action === 'disable') {
        return this.providers.filter(function (name) {
          return !disabled.includes(name);
        });
      }
      return disabled;
    })
  }, {
    key: 'process',
    value: _asyncToGenerator(function* (name) {
      var config = yield this.getConfig();
      var disabled = yield config.get('disabled');
      if (this.action === 'disable') {
        disabled.push(name);
        this.emitter.emit('did-disable', name);
      } else {
        var index = disabled.indexOf(name);
        if (index !== -1) {
          disabled.splice(index, 1);
        }
      }
      yield this.config.set('disabled', disabled);
    })
  }, {
    key: 'show',
    value: _asyncToGenerator(function* () {
      var _this = this;

      var selectListView = new _atomSelectList2['default']({
        items: yield this.getItems(),
        emptyMessage: 'No matches found',
        filterKeyForItem: function filterKeyForItem(item) {
          return item;
        },
        elementForItem: function elementForItem(item) {
          var li = document.createElement('li');
          li.textContent = item;
          return li;
        },
        didConfirmSelection: function didConfirmSelection(item) {
          _this.process(item)['catch'](function (e) {
            return console.error('[Linter] Unable to process toggle:', e);
          }).then(function () {
            return _this.dispose();
          });
        },
        didCancelSelection: function didCancelSelection() {
          _this.dispose();
        }
      });
      var panel = atom.workspace.addModalPanel({ item: selectListView });

      selectListView.focus();
      this.subscriptions.add(new _atom.Disposable(function () {
        panel.destroy();
      }));
    })
  }, {
    key: 'onDidDispose',
    value: function onDidDispose(callback) {
      return this.emitter.on('did-dispose', callback);
    }
  }, {
    key: 'onDidDisable',
    value: function onDidDisable(callback) {
      return this.emitter.on('did-disable', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-dispose');
      this.subscriptions.dispose();
    }
  }]);

  return ToggleProviders;
})();

exports['default'] = ToggleProviders;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi90b2dnbGUtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7NEJBRXVCLGdCQUFnQjs7Ozs4QkFDWixrQkFBa0I7Ozs7b0JBQ1ksTUFBTTs7dUJBQ2pDLFdBQVc7O0lBSXBCLGVBQWU7QUFPdkIsV0FQUSxlQUFlLENBT3RCLE1BQW9CLEVBQUUsU0FBd0IsRUFBRTswQkFQekMsZUFBZTs7QUFRaEMsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDcEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDbEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO0FBQzFCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNyQzs7ZUFma0IsZUFBZTs7NkJBZ0JuQixhQUF3QjtBQUNyQyxVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNoQixZQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sNkJBQWUsQ0FBQTtPQUNwQztBQUNELGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtLQUNuQjs7OzZCQUNhLGFBQTJCO0FBQ3ZDLFVBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQSxDQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUMvRCxVQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQzdCLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJO2lCQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7U0FBQSxDQUFDLENBQUE7T0FDL0Q7QUFDRCxhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7OzZCQUNZLFdBQUMsSUFBWSxFQUFpQjtBQUN6QyxVQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUNyQyxVQUFNLFFBQXVCLEdBQUcsTUFBTSxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzVELFVBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7QUFDN0IsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDbkIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFBO09BQ3ZDLE1BQU07QUFDTCxZQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3BDLFlBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ2hCLGtCQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQTtTQUMxQjtPQUNGO0FBQ0QsWUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDNUM7Ozs2QkFDUyxhQUFHOzs7QUFDWCxVQUFNLGNBQWMsR0FBRyxnQ0FBbUI7QUFDeEMsYUFBSyxFQUFFLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUM1QixvQkFBWSxFQUFFLGtCQUFrQjtBQUNoQyx3QkFBZ0IsRUFBRSwwQkFBQSxJQUFJO2lCQUFJLElBQUk7U0FBQTtBQUM5QixzQkFBYyxFQUFFLHdCQUFDLElBQUksRUFBSztBQUN4QixjQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3ZDLFlBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO0FBQ3JCLGlCQUFPLEVBQUUsQ0FBQTtTQUNWO0FBQ0QsMkJBQW1CLEVBQUUsNkJBQUMsSUFBSSxFQUFLO0FBQzdCLGdCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBTSxDQUFDLFVBQUEsQ0FBQzttQkFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxFQUFFLENBQUMsQ0FBQztXQUFBLENBQUMsQ0FBQyxJQUFJLENBQUM7bUJBQU0sTUFBSyxPQUFPLEVBQUU7V0FBQSxDQUFDLENBQUE7U0FDakg7QUFDRCwwQkFBa0IsRUFBRSw4QkFBTTtBQUN4QixnQkFBSyxPQUFPLEVBQUUsQ0FBQTtTQUNmO09BQ0YsQ0FBQyxDQUFBO0FBQ0YsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQTs7QUFFcEUsb0JBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUN0QixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxxQkFBZSxZQUFXO0FBQy9DLGFBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNoQixDQUFDLENBQUMsQ0FBQTtLQUNKOzs7V0FDVyxzQkFBQyxRQUFxQixFQUFjO0FBQzlDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDVyxzQkFBQyxRQUFpQyxFQUFjO0FBQzFELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQTVFa0IsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3RvZ2dsZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IENvbmZpZ0ZpbGUgZnJvbSAnc2ItY29uZmlnLWZpbGUnXG5pbXBvcnQgU2VsZWN0TGlzdFZpZXcgZnJvbSAnYXRvbS1zZWxlY3QtbGlzdCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgZ2V0Q29uZmlnRmlsZSB9IGZyb20gJy4vaGVscGVycydcblxudHlwZSBUb2dnbGVBY3Rpb24gPSAnZW5hYmxlJyB8ICdkaXNhYmxlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb2dnbGVQcm92aWRlcnMge1xuICBhY3Rpb246IFRvZ2dsZUFjdGlvbjtcbiAgY29uZmlnOiBDb25maWdGaWxlO1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBwcm92aWRlcnM6IEFycmF5PHN0cmluZz47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoYWN0aW9uOiBUb2dnbGVBY3Rpb24sIHByb3ZpZGVyczogQXJyYXk8c3RyaW5nPikge1xuICAgIHRoaXMuYWN0aW9uID0gYWN0aW9uXG4gICAgdGhpcy5jb25maWcgPSBudWxsXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMucHJvdmlkZXJzID0gcHJvdmlkZXJzXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cbiAgYXN5bmMgZ2V0Q29uZmlnKCk6IFByb21pc2U8Q29uZmlnRmlsZT4ge1xuICAgIGlmICghdGhpcy5jb25maWcpIHtcbiAgICAgIHRoaXMuY29uZmlnID0gYXdhaXQgZ2V0Q29uZmlnRmlsZSgpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbmZpZ1xuICB9XG4gIGFzeW5jIGdldEl0ZW1zKCk6IFByb21pc2U8QXJyYXk8c3RyaW5nPj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gYXdhaXQgKGF3YWl0IHRoaXMuZ2V0Q29uZmlnKCkpLmdldCgnZGlzYWJsZWQnKVxuICAgIGlmICh0aGlzLmFjdGlvbiA9PT0gJ2Rpc2FibGUnKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm92aWRlcnMuZmlsdGVyKG5hbWUgPT4gIWRpc2FibGVkLmluY2x1ZGVzKG5hbWUpKVxuICAgIH1cbiAgICByZXR1cm4gZGlzYWJsZWRcbiAgfVxuICBhc3luYyBwcm9jZXNzKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlnKClcbiAgICBjb25zdCBkaXNhYmxlZDogQXJyYXk8c3RyaW5nPiA9IGF3YWl0IGNvbmZpZy5nZXQoJ2Rpc2FibGVkJylcbiAgICBpZiAodGhpcy5hY3Rpb24gPT09ICdkaXNhYmxlJykge1xuICAgICAgZGlzYWJsZWQucHVzaChuYW1lKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kaXNhYmxlJywgbmFtZSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5kZXggPSBkaXNhYmxlZC5pbmRleE9mKG5hbWUpXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIGRpc2FibGVkLnNwbGljZShpbmRleCwgMSlcbiAgICAgIH1cbiAgICB9XG4gICAgYXdhaXQgdGhpcy5jb25maWcuc2V0KCdkaXNhYmxlZCcsIGRpc2FibGVkKVxuICB9XG4gIGFzeW5jIHNob3coKSB7XG4gICAgY29uc3Qgc2VsZWN0TGlzdFZpZXcgPSBuZXcgU2VsZWN0TGlzdFZpZXcoe1xuICAgICAgaXRlbXM6IGF3YWl0IHRoaXMuZ2V0SXRlbXMoKSxcbiAgICAgIGVtcHR5TWVzc2FnZTogJ05vIG1hdGNoZXMgZm91bmQnLFxuICAgICAgZmlsdGVyS2V5Rm9ySXRlbTogaXRlbSA9PiBpdGVtLFxuICAgICAgZWxlbWVudEZvckl0ZW06IChpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAgICAgICBsaS50ZXh0Q29udGVudCA9IGl0ZW1cbiAgICAgICAgcmV0dXJuIGxpXG4gICAgICB9LFxuICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogKGl0ZW0pID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzKGl0ZW0pLmNhdGNoKGUgPT4gY29uc29sZS5lcnJvcignW0xpbnRlcl0gVW5hYmxlIHRvIHByb2Nlc3MgdG9nZ2xlOicsIGUpKS50aGVuKCgpID0+IHRoaXMuZGlzcG9zZSgpKVxuICAgICAgfSxcbiAgICAgIGRpZENhbmNlbFNlbGVjdGlvbjogKCkgPT4ge1xuICAgICAgICB0aGlzLmRpc3Bvc2UoKVxuICAgICAgfSxcbiAgICB9KVxuICAgIGNvbnN0IHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHNlbGVjdExpc3RWaWV3IH0pXG5cbiAgICBzZWxlY3RMaXN0Vmlldy5mb2N1cygpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChuZXcgRGlzcG9zYWJsZShmdW5jdGlvbigpIHtcbiAgICAgIHBhbmVsLmRlc3Ryb3koKVxuICAgIH0pKVxuICB9XG4gIG9uRGlkRGlzcG9zZShjYWxsYmFjazogKCgpID0+IGFueSkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGlzcG9zZScsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkRGlzYWJsZShjYWxsYmFjazogKChuYW1lOiBzdHJpbmcpID0+IGFueSkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGlzYWJsZScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kaXNwb3NlJylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==