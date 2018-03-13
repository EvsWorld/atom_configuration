Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbEventKit = require('sb-event-kit');

var _sbDebounce = require('sb-debounce');

var _sbDebounce2 = _interopRequireDefault(_sbDebounce);

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _helpers = require('./helpers');

var TreeView = (function () {
  function TreeView() {
    var _this = this;

    _classCallCheck(this, TreeView);

    this.emitter = new _sbEventKit.Emitter();
    this.messages = [];
    this.decorations = {};
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter-ui-default.decorateOnTreeView', function (decorateOnTreeView) {
      if (typeof _this.decorateOnTreeView === 'undefined') {
        _this.decorateOnTreeView = decorateOnTreeView;
      } else if (decorateOnTreeView === 'None') {
        _this.update([]);
        _this.decorateOnTreeView = decorateOnTreeView;
      } else {
        var messages = _this.messages;
        _this.decorateOnTreeView = decorateOnTreeView;
        _this.update(messages);
      }
    }));

    setTimeout(function () {
      var element = TreeView.getElement();
      if (_this.subscriptions.disposed || !element) {
        return;
      }
      _this.subscriptions.add((0, _disposableEvent2['default'])(element, 'click', (0, _sbDebounce2['default'])(function () {
        _this.update();
      })));
    }, 100);
  }

  _createClass(TreeView, [{
    key: 'update',
    value: function update() {
      var givenMessages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (Array.isArray(givenMessages)) {
        this.messages = givenMessages;
      }
      var messages = this.messages;

      var element = TreeView.getElement();
      var decorateOnTreeView = this.decorateOnTreeView;
      if (!element || decorateOnTreeView === 'None') {
        return;
      }

      this.applyDecorations((0, _helpers.calculateDecorations)(decorateOnTreeView, messages));
    }
  }, {
    key: 'applyDecorations',
    value: function applyDecorations(decorations) {
      var treeViewElement = TreeView.getElement();
      if (!treeViewElement) {
        return;
      }

      var elementCache = {};
      var appliedDecorations = {};

      for (var filePath in this.decorations) {
        if (!({}).hasOwnProperty.call(this.decorations, filePath)) {
          continue;
        }
        if (!decorations[filePath]) {
          // Removed
          var element = elementCache[filePath] || (elementCache[filePath] = TreeView.getElementByPath(treeViewElement, filePath));
          if (element) {
            this.removeDecoration(element);
          }
        }
      }

      for (var filePath in decorations) {
        if (!({}).hasOwnProperty.call(decorations, filePath)) {
          continue;
        }
        var element = elementCache[filePath] || (elementCache[filePath] = TreeView.getElementByPath(treeViewElement, filePath));
        if (element) {
          this.handleDecoration(element, !!this.decorations[filePath], decorations[filePath]);
          appliedDecorations[filePath] = decorations[filePath];
        }
      }
      this.decorations = appliedDecorations;
    }
  }, {
    key: 'handleDecoration',
    value: function handleDecoration(element, update, highlights) {
      if (update === undefined) update = false;

      var decoration = undefined;
      if (update) {
        decoration = element.querySelector('linter-decoration');
      }
      if (decoration) {
        decoration.className = '';
      } else {
        decoration = document.createElement('linter-decoration');
        element.appendChild(decoration);
      }
      if (highlights.error) {
        decoration.classList.add('linter-error');
      } else if (highlights.warning) {
        decoration.classList.add('linter-warning');
      } else if (highlights.info) {
        decoration.classList.add('linter-info');
      }
    }
  }, {
    key: 'removeDecoration',
    value: function removeDecoration(element) {
      var decoration = element.querySelector('linter-decoration');
      if (decoration) {
        decoration.remove();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }], [{
    key: 'getElement',
    value: function getElement() {
      return document.querySelector('.tree-view');
    }
  }, {
    key: 'getElementByPath',
    value: function getElementByPath(parent, filePath) {
      return parent.querySelector('[data-path=' + CSS.escape(filePath) + ']');
    }
  }]);

  return TreeView;
})();

exports['default'] = TreeView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3RyZWUtdmlldy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzBCQUU2QyxjQUFjOzswQkFDdEMsYUFBYTs7OzsrQkFDTixrQkFBa0I7Ozs7dUJBQ1QsV0FBVzs7SUFHM0IsUUFBUTtBQU9oQixXQVBRLFFBQVEsR0FPYjs7OzBCQVBLLFFBQVE7O0FBUXpCLFFBQUksQ0FBQyxPQUFPLEdBQUcseUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQTtBQUNyQixRQUFJLENBQUMsYUFBYSxHQUFHLHFDQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsc0NBQXNDLEVBQUUsVUFBQyxrQkFBa0IsRUFBSztBQUN6RyxVQUFJLE9BQU8sTUFBSyxrQkFBa0IsS0FBSyxXQUFXLEVBQUU7QUFDbEQsY0FBSyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQTtPQUM3QyxNQUFNLElBQUksa0JBQWtCLEtBQUssTUFBTSxFQUFFO0FBQ3hDLGNBQUssTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ2YsY0FBSyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQTtPQUM3QyxNQUFNO0FBQ0wsWUFBTSxRQUFRLEdBQUcsTUFBSyxRQUFRLENBQUE7QUFDOUIsY0FBSyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQTtBQUM1QyxjQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUN0QjtLQUNGLENBQUMsQ0FBQyxDQUFBOztBQUVILGNBQVUsQ0FBQyxZQUFNO0FBQ2YsVUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQ3JDLFVBQUksTUFBSyxhQUFhLENBQUMsUUFBUSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzNDLGVBQU07T0FDUDtBQUNELFlBQUssYUFBYSxDQUFDLEdBQUcsQ0FBQyxrQ0FBZ0IsT0FBTyxFQUFFLE9BQU8sRUFBRSw2QkFBUyxZQUFNO0FBQ3RFLGNBQUssTUFBTSxFQUFFLENBQUE7T0FDZCxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ0wsRUFBRSxHQUFHLENBQUMsQ0FBQTtHQUNSOztlQXBDa0IsUUFBUTs7V0FxQ3JCLGtCQUE4QztVQUE3QyxhQUFvQyx5REFBRyxJQUFJOztBQUNoRCxVQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDaEMsWUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUE7T0FDOUI7QUFDRCxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFBOztBQUU5QixVQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7QUFDckMsVUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUE7QUFDbEQsVUFBSSxDQUFDLE9BQU8sSUFBSSxrQkFBa0IsS0FBSyxNQUFNLEVBQUU7QUFDN0MsZUFBTTtPQUNQOztBQUVELFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQ0FBcUIsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtLQUMxRTs7O1dBQ2UsMEJBQUMsV0FBbUIsRUFBRTtBQUNwQyxVQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7QUFDN0MsVUFBSSxDQUFDLGVBQWUsRUFBRTtBQUNwQixlQUFNO09BQ1A7O0FBRUQsVUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFBO0FBQ3ZCLFVBQU0sa0JBQWtCLEdBQUcsRUFBRSxDQUFBOztBQUU3QixXQUFLLElBQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDdkMsWUFBSSxDQUFDLENBQUEsR0FBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsRUFBRTtBQUN2RCxtQkFBUTtTQUNUO0FBQ0QsWUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTs7QUFFMUIsY0FBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFBLEFBQUMsQ0FBQTtBQUN6SCxjQUFJLE9BQU8sRUFBRTtBQUNYLGdCQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUE7V0FDL0I7U0FDRjtPQUNGOztBQUVELFdBQUssSUFBTSxRQUFRLElBQUksV0FBVyxFQUFFO0FBQ2xDLFlBQUksQ0FBQyxDQUFBLEdBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsRUFBRTtBQUNsRCxtQkFBUTtTQUNUO0FBQ0QsWUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFBLEFBQUMsQ0FBQTtBQUN6SCxZQUFJLE9BQU8sRUFBRTtBQUNYLGNBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7QUFDbkYsNEJBQWtCLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQ3JEO09BQ0Y7QUFDRCxVQUFJLENBQUMsV0FBVyxHQUFHLGtCQUFrQixDQUFBO0tBQ3RDOzs7V0FDZSwwQkFBQyxPQUFvQixFQUFFLE1BQWUsRUFBVSxVQUE2QixFQUFFO1VBQXhELE1BQWUsZ0JBQWYsTUFBZSxHQUFHLEtBQUs7O0FBQzVELFVBQUksVUFBVSxZQUFBLENBQUE7QUFDZCxVQUFJLE1BQU0sRUFBRTtBQUNWLGtCQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO09BQ3hEO0FBQ0QsVUFBSSxVQUFVLEVBQUU7QUFDZCxrQkFBVSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUE7T0FDMUIsTUFBTTtBQUNMLGtCQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3hELGVBQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUE7T0FDaEM7QUFDRCxVQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDcEIsa0JBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO09BQ3pDLE1BQU0sSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO0FBQzdCLGtCQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO09BQzNDLE1BQU0sSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO0FBQzFCLGtCQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtPQUN4QztLQUNGOzs7V0FDZSwwQkFBQyxPQUFvQixFQUFFO0FBQ3JDLFVBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtBQUM3RCxVQUFJLFVBQVUsRUFBRTtBQUNkLGtCQUFVLENBQUMsTUFBTSxFQUFFLENBQUE7T0FDcEI7S0FDRjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7V0FDZ0Isc0JBQUc7QUFDbEIsYUFBTyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFBO0tBQzVDOzs7V0FDc0IsMEJBQUMsTUFBbUIsRUFBRSxRQUFRLEVBQWdCO0FBQ25FLGFBQU8sTUFBTSxDQUFDLGFBQWEsaUJBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBSSxDQUFBO0tBQ25FOzs7U0F0SGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3RyZWUtdmlldy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdzYi1ldmVudC1raXQnXG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnc2ItZGVib3VuY2UnXG5pbXBvcnQgZGlzcG9zYWJsZUV2ZW50IGZyb20gJ2Rpc3Bvc2FibGUtZXZlbnQnXG5pbXBvcnQgeyBjYWxjdWxhdGVEZWNvcmF0aW9ucyB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSwgVHJlZVZpZXdIaWdobGlnaHQgfSBmcm9tICcuLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJlZVZpZXcge1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT47XG4gIGRlY29yYXRpb25zOiBPYmplY3Q7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIGRlY29yYXRlT25UcmVlVmlldzogJ0ZpbGVzIGFuZCBEaXJlY3RvcmllcycgfCAnRmlsZXMnIHwgJ05vbmUnO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLmRlY29yYXRpb25zID0ge31cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LmRlY29yYXRlT25UcmVlVmlldycsIChkZWNvcmF0ZU9uVHJlZVZpZXcpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5kZWNvcmF0ZU9uVHJlZVZpZXcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuZGVjb3JhdGVPblRyZWVWaWV3ID0gZGVjb3JhdGVPblRyZWVWaWV3XG4gICAgICB9IGVsc2UgaWYgKGRlY29yYXRlT25UcmVlVmlldyA9PT0gJ05vbmUnKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKFtdKVxuICAgICAgICB0aGlzLmRlY29yYXRlT25UcmVlVmlldyA9IGRlY29yYXRlT25UcmVlVmlld1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSB0aGlzLm1lc3NhZ2VzXG4gICAgICAgIHRoaXMuZGVjb3JhdGVPblRyZWVWaWV3ID0gZGVjb3JhdGVPblRyZWVWaWV3XG4gICAgICAgIHRoaXMudXBkYXRlKG1lc3NhZ2VzKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gVHJlZVZpZXcuZ2V0RWxlbWVudCgpXG4gICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2VkIHx8ICFlbGVtZW50KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChkaXNwb3NhYmxlRXZlbnQoZWxlbWVudCwgJ2NsaWNrJywgZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICB9KSkpXG4gICAgfSwgMTAwKVxuICB9XG4gIHVwZGF0ZShnaXZlbk1lc3NhZ2VzOiA/QXJyYXk8TGludGVyTWVzc2FnZT4gPSBudWxsKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZ2l2ZW5NZXNzYWdlcykpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMgPSBnaXZlbk1lc3NhZ2VzXG4gICAgfVxuICAgIGNvbnN0IG1lc3NhZ2VzID0gdGhpcy5tZXNzYWdlc1xuXG4gICAgY29uc3QgZWxlbWVudCA9IFRyZWVWaWV3LmdldEVsZW1lbnQoKVxuICAgIGNvbnN0IGRlY29yYXRlT25UcmVlVmlldyA9IHRoaXMuZGVjb3JhdGVPblRyZWVWaWV3XG4gICAgaWYgKCFlbGVtZW50IHx8IGRlY29yYXRlT25UcmVlVmlldyA9PT0gJ05vbmUnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmFwcGx5RGVjb3JhdGlvbnMoY2FsY3VsYXRlRGVjb3JhdGlvbnMoZGVjb3JhdGVPblRyZWVWaWV3LCBtZXNzYWdlcykpXG4gIH1cbiAgYXBwbHlEZWNvcmF0aW9ucyhkZWNvcmF0aW9uczogT2JqZWN0KSB7XG4gICAgY29uc3QgdHJlZVZpZXdFbGVtZW50ID0gVHJlZVZpZXcuZ2V0RWxlbWVudCgpXG4gICAgaWYgKCF0cmVlVmlld0VsZW1lbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnRDYWNoZSA9IHt9XG4gICAgY29uc3QgYXBwbGllZERlY29yYXRpb25zID0ge31cblxuICAgIGZvciAoY29uc3QgZmlsZVBhdGggaW4gdGhpcy5kZWNvcmF0aW9ucykge1xuICAgICAgaWYgKCF7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuZGVjb3JhdGlvbnMsIGZpbGVQYXRoKSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgaWYgKCFkZWNvcmF0aW9uc1tmaWxlUGF0aF0pIHtcbiAgICAgICAgLy8gUmVtb3ZlZFxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZWxlbWVudENhY2hlW2ZpbGVQYXRoXSB8fCAoZWxlbWVudENhY2hlW2ZpbGVQYXRoXSA9IFRyZWVWaWV3LmdldEVsZW1lbnRCeVBhdGgodHJlZVZpZXdFbGVtZW50LCBmaWxlUGF0aCkpXG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVEZWNvcmF0aW9uKGVsZW1lbnQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRoIGluIGRlY29yYXRpb25zKSB7XG4gICAgICBpZiAoIXt9Lmhhc093blByb3BlcnR5LmNhbGwoZGVjb3JhdGlvbnMsIGZpbGVQYXRoKSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgY29uc3QgZWxlbWVudCA9IGVsZW1lbnRDYWNoZVtmaWxlUGF0aF0gfHwgKGVsZW1lbnRDYWNoZVtmaWxlUGF0aF0gPSBUcmVlVmlldy5nZXRFbGVtZW50QnlQYXRoKHRyZWVWaWV3RWxlbWVudCwgZmlsZVBhdGgpKVxuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVEZWNvcmF0aW9uKGVsZW1lbnQsICEhdGhpcy5kZWNvcmF0aW9uc1tmaWxlUGF0aF0sIGRlY29yYXRpb25zW2ZpbGVQYXRoXSlcbiAgICAgICAgYXBwbGllZERlY29yYXRpb25zW2ZpbGVQYXRoXSA9IGRlY29yYXRpb25zW2ZpbGVQYXRoXVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRlY29yYXRpb25zID0gYXBwbGllZERlY29yYXRpb25zXG4gIH1cbiAgaGFuZGxlRGVjb3JhdGlvbihlbGVtZW50OiBIVE1MRWxlbWVudCwgdXBkYXRlOiBib29sZWFuID0gZmFsc2UsIGhpZ2hsaWdodHM6IFRyZWVWaWV3SGlnaGxpZ2h0KSB7XG4gICAgbGV0IGRlY29yYXRpb25cbiAgICBpZiAodXBkYXRlKSB7XG4gICAgICBkZWNvcmF0aW9uID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdsaW50ZXItZGVjb3JhdGlvbicpXG4gICAgfVxuICAgIGlmIChkZWNvcmF0aW9uKSB7XG4gICAgICBkZWNvcmF0aW9uLmNsYXNzTmFtZSA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIGRlY29yYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItZGVjb3JhdGlvbicpXG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGRlY29yYXRpb24pXG4gICAgfVxuICAgIGlmIChoaWdobGlnaHRzLmVycm9yKSB7XG4gICAgICBkZWNvcmF0aW9uLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci1lcnJvcicpXG4gICAgfSBlbHNlIGlmIChoaWdobGlnaHRzLndhcm5pbmcpIHtcbiAgICAgIGRlY29yYXRpb24uY2xhc3NMaXN0LmFkZCgnbGludGVyLXdhcm5pbmcnKVxuICAgIH0gZWxzZSBpZiAoaGlnaGxpZ2h0cy5pbmZvKSB7XG4gICAgICBkZWNvcmF0aW9uLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci1pbmZvJylcbiAgICB9XG4gIH1cbiAgcmVtb3ZlRGVjb3JhdGlvbihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGRlY29yYXRpb24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2xpbnRlci1kZWNvcmF0aW9uJylcbiAgICBpZiAoZGVjb3JhdGlvbikge1xuICAgICAgZGVjb3JhdGlvbi5yZW1vdmUoKVxuICAgIH1cbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxuICBzdGF0aWMgZ2V0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRyZWUtdmlldycpXG4gIH1cbiAgc3RhdGljIGdldEVsZW1lbnRCeVBhdGgocGFyZW50OiBIVE1MRWxlbWVudCwgZmlsZVBhdGgpOiA/SFRNTEVsZW1lbnQge1xuICAgIHJldHVybiBwYXJlbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtcGF0aD0ke0NTUy5lc2NhcGUoZmlsZVBhdGgpfV1gKVxuICB9XG59XG4iXX0=