Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _humanizeTime = require('humanize-time');

var _humanizeTime2 = _interopRequireDefault(_humanizeTime);

var _atom = require('atom');

var _provider = require('./provider');

var _provider2 = _interopRequireDefault(_provider);

var Registry = (function () {
  function Registry() {
    var _this = this;

    _classCallCheck(this, Registry);

    this.emitter = new _atom.Emitter();
    this.providers = new Set();
    this.itemsActive = [];
    this.itemsHistory = [];
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('busy-signal.itemsToShowInHistory', function (itemsToShowInHistory) {
      var previousValue = _this.itemsToShowInHistory;
      _this.itemsToShowInHistory = parseInt(itemsToShowInHistory, 10);
      if (typeof previousValue === 'number') {
        _this.emitter.emit('did-update');
      }
    }));
  }

  // Public method

  _createClass(Registry, [{
    key: 'create',
    value: function create() {
      var _this2 = this;

      var provider = new _provider2['default']();
      provider.onDidAdd(function (status) {
        _this2.statusAdd(provider, status);
      });
      provider.onDidRemove(function (title) {
        _this2.statusRemove(provider, title);
      });
      provider.onDidClear(function () {
        _this2.statusClear(provider);
      });
      provider.onDidDispose(function () {
        _this2.statusClear(provider);
        _this2.providers['delete'](provider);
      });
      this.providers.add(provider);
      return provider;
    }
  }, {
    key: 'statusAdd',
    value: function statusAdd(provider, status) {
      for (var i = 0; i < this.itemsActive.length; i++) {
        var entry = this.itemsActive[i];
        if (entry.title === status.title && entry.provider === provider) {
          // Item already exists, ignore
          break;
        }
      }

      this.itemsActive.push({
        title: status.title,
        priority: status.priority,
        provider: provider,
        timeAdded: Date.now(),
        timeRemoved: null
      });
      this.emitter.emit('did-update');
    }
  }, {
    key: 'statusRemove',
    value: function statusRemove(provider, title) {
      for (var i = 0; i < this.itemsActive.length; i++) {
        var entry = this.itemsActive[i];
        if (entry.provider === provider && entry.title === title) {
          this.pushIntoHistory(i, entry);
          this.emitter.emit('did-update');
          break;
        }
      }
    }
  }, {
    key: 'statusClear',
    value: function statusClear(provider) {
      var triggerUpdate = false;
      for (var i = 0; i < this.itemsActive.length; i++) {
        var entry = this.itemsActive[i];
        if (entry.provider === provider) {
          this.pushIntoHistory(i, entry);
          triggerUpdate = true;
          i--;
        }
      }
      if (triggerUpdate) {
        this.emitter.emit('did-update');
      }
    }
  }, {
    key: 'pushIntoHistory',
    value: function pushIntoHistory(index, item) {
      item.timeRemoved = Date.now();
      this.itemsActive.splice(index, 1);
      this.itemsHistory = this.itemsHistory.concat([item]).slice(-1000);
    }
  }, {
    key: 'getActiveTitles',
    value: function getActiveTitles() {
      return this.itemsActive.slice().sort(function (a, b) {
        return a.priority - b.priority;
      }).map(function (i) {
        return i.title;
      });
    }
  }, {
    key: 'getOldTitles',
    value: function getOldTitles() {
      var toReturn = [];
      var history = this.itemsHistory;
      var activeTitles = this.getActiveTitles();
      var mergedTogether = history.map(function (i) {
        return i.title;
      }).concat(activeTitles);

      for (var i = 0, _length = history.length; i < _length; i++) {
        var item = history[i];
        if (mergedTogether.lastIndexOf(item.title) === i) {
          toReturn.push({
            title: item.title,
            duration: (0, _humanizeTime2['default'])(item.timeRemoved && item.timeRemoved - item.timeAdded)
          });
        }
      }

      return toReturn.slice(-1 * this.itemsToShowInHistory);
    }
  }, {
    key: 'onDidUpdate',
    value: function onDidUpdate(callback) {
      return this.emitter.on('did-update', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      for (var provider of this.providers) {
        provider.dispose();
      }
    }
  }]);

  return Registry;
})();

exports['default'] = Registry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvbGliL3JlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7NEJBRXlCLGVBQWU7Ozs7b0JBQ0ssTUFBTTs7d0JBRzlCLFlBQVk7Ozs7SUFHWixRQUFRO0FBUWhCLFdBUlEsUUFBUSxHQVFiOzs7MEJBUkssUUFBUTs7QUFTekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQTtBQUNyQixRQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQTtBQUN0QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0NBQWtDLEVBQUUsVUFBQyxvQkFBb0IsRUFBSztBQUN2RyxVQUFNLGFBQWEsR0FBRyxNQUFLLG9CQUFvQixDQUFBO0FBQy9DLFlBQUssb0JBQW9CLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQzlELFVBQUksT0FBTyxhQUFhLEtBQUssUUFBUSxFQUFFO0FBQ3JDLGNBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtPQUNoQztLQUNGLENBQUMsQ0FBQyxDQUFBO0dBQ0o7Ozs7ZUF2QmtCLFFBQVE7O1dBeUJyQixrQkFBYTs7O0FBQ2pCLFVBQU0sUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDL0IsY0FBUSxDQUFDLFFBQVEsQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUM1QixlQUFLLFNBQVMsQ0FBQyxRQUFR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S0FBSyxDQUFDLEVBQUU7QUFDaEQsa0JBQVEsQ0FBQyxJQUFJLENBQUM7QUFDWixpQkFBSyxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ2pCLG9CQUFRLEVBQUUsK0JBQWEsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7V0FDOUUsQ0FBQyxDQUFBO1NBQ0g7T0FDRjs7QUFFRCxhQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUE7S0FDdEQ7OztXQUNVLHFCQUFDLFFBQWtCLEVBQWM7QUFDMUMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDL0M7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixXQUFLLElBQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDckMsZ0JBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNuQjtLQUNGOzs7U0F6SGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvbGliL3JlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IGh1bWFuaXplVGltZSBmcm9tICdodW1hbml6ZS10aW1lJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgUHJvdmlkZXIgZnJvbSAnLi9wcm92aWRlcidcbmltcG9ydCB0eXBlIHsgU2lnbmFsIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVnaXN0cnkge1xuICBlbWl0dGVyOiBFbWl0dGVyXG4gIHByb3ZpZGVyczogU2V0PFByb3ZpZGVyPlxuICBpdGVtc0FjdGl2ZTogQXJyYXk8U2lnbmFsPlxuICBpdGVtc0hpc3Rvcnk6IEFycmF5PFNpZ25hbD5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBpdGVtc1RvU2hvd0luSGlzdG9yeTogbnVtYmVyXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMucHJvdmlkZXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5pdGVtc0FjdGl2ZSA9IFtdXG4gICAgdGhpcy5pdGVtc0hpc3RvcnkgPSBbXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnYnVzeS1zaWduYWwuaXRlbXNUb1Nob3dJbkhpc3RvcnknLCAoaXRlbXNUb1Nob3dJbkhpc3RvcnkpID0+IHtcbiAgICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSB0aGlzLml0ZW1zVG9TaG93SW5IaXN0b3J5XG4gICAgICB0aGlzLml0ZW1zVG9TaG93SW5IaXN0b3J5ID0gcGFyc2VJbnQoaXRlbXNUb1Nob3dJbkhpc3RvcnksIDEwKVxuICAgICAgaWYgKHR5cGVvZiBwcmV2aW91c1ZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpXG4gICAgICB9XG4gICAgfSkpXG4gIH1cbiAgLy8gUHVibGljIG1ldGhvZFxuICBjcmVhdGUoKTogUHJvdmlkZXIge1xuICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IFByb3ZpZGVyKClcbiAgICBwcm92aWRlci5vbkRpZEFkZCgoc3RhdHVzKSA9PiB7XG4gICAgICB0aGlzLnN0YXR1c0FkZChwcm92aWRlciwgc3RhdHVzKVxuICAgIH0pXG4gICAgcHJvdmlkZXIub25EaWRSZW1vdmUoKHRpdGxlKSA9PiB7XG4gICAgICB0aGlzLnN0YXR1c1JlbW92ZShwcm92aWRlciwgdGl0bGUpXG4gICAgfSlcbiAgICBwcm92aWRlci5vbkRpZENsZWFyKCgpID0+IHtcbiAgICAgIHRoaXMuc3RhdHVzQ2xlYXIocHJvdmlkZXIpXG4gICAgfSlcbiAgICBwcm92aWRlci5vbkRpZERpc3Bvc2UoKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0dXNDbGVhcihwcm92aWRlcilcbiAgICAgIHRoaXMucHJvdmlkZXJzLmRlbGV0ZShwcm92aWRlcilcbiAgICB9KVxuICAgIHRoaXMucHJvdmlkZXJzLmFkZChwcm92aWRlcilcbiAgICByZXR1cm4gcHJvdmlkZXJcbiAgfVxuICBzdGF0dXNBZGQocHJvdmlkZXI6IFByb3ZpZGVyLCBzdGF0dXM6IHsgdGl0bGU6IHN0cmluZywgcHJpb3JpdHk6IG51bWJlciB9KTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLml0ZW1zQWN0aXZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBlbnRyeSA9IHRoaXMuaXRlbXNBY3RpdmVbaV1cbiAgICAgIGlmIChlbnRyeS50aXRsZSA9PT0gc3RhdHVzLnRpdGxlICYmIGVudHJ5LnByb3ZpZGVyID09PSBwcm92aWRlcikge1xuICAgICAgICAvLyBJdGVtIGFscmVhZHkgZXhpc3RzLCBpZ25vcmVcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLml0ZW1zQWN0aXZlLnB1c2goe1xuICAgICAgdGl0bGU6IHN0YXR1cy50aXRsZSxcbiAgICAgIHByaW9yaXR5OiBzdGF0dXMucHJpb3JpdHksXG4gICAgICBwcm92aWRlcixcbiAgICAgIHRpbWVBZGRlZDogRGF0ZS5ub3coKSxcbiAgICAgIHRpbWVSZW1vdmVkOiBudWxsLFxuICAgIH0pXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnKVxuICB9XG4gIHN0YXR1c1JlbW92ZShwcm92aWRlcjogUHJvdmlkZXIsIHRpdGxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXNBY3RpdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5pdGVtc0FjdGl2ZVtpXVxuICAgICAgaWYgKGVudHJ5LnByb3ZpZGVyID09PSBwcm92aWRlciAmJiBlbnRyeS50aXRsZSA9PT0gdGl0bGUpIHtcbiAgICAgICAgdGhpcy5wdXNoSW50b0hpc3RvcnkoaSwgZW50cnkpXG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJylcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgc3RhdHVzQ2xlYXIocHJvdmlkZXI6IFByb3ZpZGVyKTogdm9pZCB7XG4gICAgbGV0IHRyaWdnZXJVcGRhdGUgPSBmYWxzZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtc0FjdGl2ZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZW50cnkgPSB0aGlzLml0ZW1zQWN0aXZlW2ldXG4gICAgICBpZiAoZW50cnkucHJvdmlkZXIgPT09IHByb3ZpZGVyKSB7XG4gICAgICAgIHRoaXMucHVzaEludG9IaXN0b3J5KGksIGVudHJ5KVxuICAgICAgICB0cmlnZ2VyVXBkYXRlID0gdHJ1ZVxuICAgICAgICBpLS1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRyaWdnZXJVcGRhdGUpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJylcbiAgICB9XG4gIH1cbiAgcHVzaEludG9IaXN0b3J5KGluZGV4OiBudW1iZXIsIGl0ZW06IFNpZ25hbCk6IHZvaWQge1xuICAgIGl0ZW0udGltZVJlbW92ZWQgPSBEYXRlLm5vdygpXG4gICAgdGhpcy5pdGVtc0FjdGl2ZS5zcGxpY2UoaW5kZXgsIDEpXG4gICAgdGhpcy5pdGVtc0hpc3RvcnkgPSB0aGlzLml0ZW1zSGlzdG9yeS5jb25jYXQoW2l0ZW1dKS5zbGljZSgtMTAwMClcbiAgfVxuICBnZXRBY3RpdmVUaXRsZXMoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXNBY3RpdmUuc2xpY2UoKS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLnByaW9yaXR5IC0gYi5wcmlvcml0eVxuICAgIH0pLm1hcChpID0+IGkudGl0bGUpXG4gIH1cbiAgZ2V0T2xkVGl0bGVzKCk6IEFycmF5PHsgdGl0bGU6IHN0cmluZywgZHVyYXRpb246IHN0cmluZyB9PiB7XG4gICAgY29uc3QgdG9SZXR1cm4gPSBbXVxuICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLml0ZW1zSGlzdG9yeVxuICAgIGNvbnN0IGFjdGl2ZVRpdGxlcyA9IHRoaXMuZ2V0QWN0aXZlVGl0bGVzKClcbiAgICBjb25zdCBtZXJnZWRUb2dldGhlciA9IGhpc3RvcnkubWFwKGkgPT4gaS50aXRsZSkuY29uY2F0KGFjdGl2ZVRpdGxlcylcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBoaXN0b3J5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtID0gaGlzdG9yeVtpXVxuICAgICAgaWYgKG1lcmdlZFRvZ2V0aGVyLmxhc3RJbmRleE9mKGl0ZW0udGl0bGUpID09PSBpKSB7XG4gICAgICAgIHRvUmV0dXJuLnB1c2goe1xuICAgICAgICAgIHRpdGxlOiBpdGVtLnRpdGxlLFxuICAgICAgICAgIGR1cmF0aW9uOiBodW1hbml6ZVRpbWUoaXRlbS50aW1lUmVtb3ZlZCAmJiBpdGVtLnRpbWVSZW1vdmVkIC0gaXRlbS50aW1lQWRkZWQpLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0b1JldHVybi5zbGljZSgtMSAqIHRoaXMuaXRlbXNUb1Nob3dJbkhpc3RvcnkpXG4gIH1cbiAgb25EaWRVcGRhdGUoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIGZvciAoY29uc3QgcHJvdmlkZXIgb2YgdGhpcy5wcm92aWRlcnMpIHtcbiAgICAgIHByb3ZpZGVyLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxufVxuIl19