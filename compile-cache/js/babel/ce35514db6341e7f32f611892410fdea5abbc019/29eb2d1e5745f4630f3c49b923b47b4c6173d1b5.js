Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _underscorePlus = require('underscore-plus');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _servicesNavigation = require('./services/navigation');

var _servicesNavigation2 = _interopRequireDefault(_servicesNavigation);

var _servicesDebug = require('./services/debug');

var _servicesDebug2 = _interopRequireDefault(_servicesDebug);

'use babel';

var ReferenceView = require('./atom-ternjs-reference-view');

var Reference = (function () {
  function Reference() {
    _classCallCheck(this, Reference);

    this.disposables = [];
    this.references = [];

    this.referenceView = null;
    this.referencePanel = null;

    this.hideHandler = this.hide.bind(this);
    this.findReferenceListener = this.findReference.bind(this);
  }

  _createClass(Reference, [{
    key: 'init',
    value: function init() {

      this.referenceView = new ReferenceView();
      this.referenceView.initialize(this);

      this.referencePanel = atom.workspace.addBottomPanel({

        item: this.referenceView,
        priority: 0,
        visible: false
      });

      atom.views.getView(this.referencePanel).classList.add('atom-ternjs-reference-panel', 'panel-bottom');

      _atomTernjsEvents2['default'].on('reference-hide', this.hideHandler);

      this.registerCommands();
    }
  }, {
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:references', this.findReferenceListener));
    }
  }, {
    key: 'goToReference',
    value: function goToReference(idx) {

      var ref = this.references.refs[idx];

      if (_servicesNavigation2['default'].set(ref)) {

        (0, _atomTernjsHelper.openFileAndGoTo)(ref.start, ref.file);
      }
    }
  }, {
    key: 'findReference',
    value: function findReference() {
      var _this = this;

      var editor = atom.workspace.getActiveTextEditor();
      var cursor = editor.getLastCursor();

      if (!_atomTernjsManager2['default'].client || !editor || !cursor) {

        return;
      }

      var position = cursor.getBufferPosition();

      _atomTernjsManager2['default'].client.update(editor).then(function (data) {
        _atomTernjsManager2['default'].client.refs(atom.project.relativizePath(editor.getURI())[1], { line: position.row, ch: position.column }).then(function (data) {

          if (!data) {

            atom.notifications.addInfo('No references found.', { dismissable: false });

            return;
          }

          _this.references = data;

          for (var reference of data.refs) {

            reference.file = reference.file.replace(/^.\//, '');
            reference.file = _path2['default'].resolve(atom.project.relativizePath(_atomTernjsManager2['default'].server.projectDir)[0], reference.file);
          }

          data.refs = (0, _underscorePlus.uniq)(data.refs, function (item) {

            return JSON.stringify(item);
          });

          data = _this.gatherMeta(data);
          _this.referenceView.buildItems(data);
          _this.referencePanel.show();
        })['catch'](_servicesDebug2['default'].handleCatchWithNotification);
      })['catch'](_servicesDebug2['default'].handleCatch);
    }
  }, {
    key: 'gatherMeta',
    value: function gatherMeta(data) {

      for (var item of data.refs) {

        var content = _fs2['default'].readFileSync(item.file, 'utf8');
        var buffer = new _atom.TextBuffer({ text: content });

        item.position = buffer.positionForCharacterIndex(item.start);
        item.lineText = buffer.lineForRow(item.position.row);

        buffer.destroy();
      }

      return data;
    }
  }, {
    key: 'hide',
    value: function hide() {

      this.referencePanel && this.referencePanel.hide();

      (0, _atomTernjsHelper.focusEditor)();
    }
  }, {
    key: 'show',
    value: function show() {

      this.referencePanel.show();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      _atomTernjsEvents2['default'].off('reference-hide', this.hideHandler);

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];
      this.references = [];

      this.referenceView && this.referenceView.destroy();
      this.referenceView = null;

      this.referencePanel && this.referencePanel.destroy();
      this.referencePanel = null;
    }
  }]);

  return Reference;
})();

exports['default'] = new Reference();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlZmVyZW5jZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUlvQix1QkFBdUI7Ozs7Z0NBQ3ZCLHNCQUFzQjs7OztrQkFDM0IsSUFBSTs7Ozs4QkFDQSxpQkFBaUI7O29CQUNuQixNQUFNOzs7O29CQUNFLE1BQU07O2dDQUt4QixzQkFBc0I7O2tDQUNOLHVCQUF1Qjs7Ozs2QkFDNUIsa0JBQWtCOzs7O0FBaEJwQyxXQUFXLENBQUM7O0FBRVosSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7O0lBZ0J4RCxTQUFTO0FBRUYsV0FGUCxTQUFTLEdBRUM7MEJBRlYsU0FBUzs7QUFJWCxRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsUUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7O0FBRTNCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsUUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzVEOztlQVpHLFNBQVM7O1dBY1QsZ0JBQUc7O0FBRUwsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVwQyxVQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDOztBQUVsRCxZQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWE7QUFDeEIsZ0JBQVEs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LElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNuRCxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzs7QUFFMUIsVUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3JELFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0tBQzVCOzs7U0F6SUcsU0FBUzs7O3FCQTRJQSxJQUFJLFNBQVMsRUFBRSIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1yZWZlcmVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgUmVmZXJlbmNlVmlldyA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtcmVmZXJlbmNlLXZpZXcnKTtcblxuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCBlbWl0dGVyIGZyb20gJy4vYXRvbS10ZXJuanMtZXZlbnRzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQge3VuaXF9IGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7VGV4dEJ1ZmZlcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge1xuICBkaXNwb3NlQWxsLFxuICBvcGVuRmlsZUFuZEdvVG8sXG4gIGZvY3VzRWRpdG9yXG59IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcbmltcG9ydCBuYXZpZ2F0aW9uIGZyb20gJy4vc2VydmljZXMvbmF2aWdhdGlvbic7XG5pbXBvcnQgZGVidWcgZnJvbSAnLi9zZXJ2aWNlcy9kZWJ1Zyc7XG5cbmNsYXNzIFJlZmVyZW5jZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG4gICAgdGhpcy5yZWZlcmVuY2VzID0gW107XG5cbiAgICB0aGlzLnJlZmVyZW5jZVZpZXcgPSBudWxsO1xuICAgIHRoaXMucmVmZXJlbmNlUGFuZWwgPSBudWxsO1xuXG4gICAgdGhpcy5oaWRlSGFuZGxlciA9IHRoaXMuaGlkZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZmluZFJlZmVyZW5jZUxpc3RlbmVyID0gdGhpcy5maW5kUmVmZXJlbmNlLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgdGhpcy5yZWZlcmVuY2VWaWV3ID0gbmV3IFJlZmVyZW5jZVZpZXcoKTtcbiAgICB0aGlzLnJlZmVyZW5jZVZpZXcuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgIHRoaXMucmVmZXJlbmNlUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7XG5cbiAgICAgIGl0ZW06IHRoaXMucmVmZXJlbmNlVmlldyxcbiAgICAgIHByaW9yaXR5OiAwLFxuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KTtcblxuICAgIGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLnJlZmVyZW5jZVBhbmVsKS5jbGFzc0xpc3QuYWRkKCdhdG9tLXRlcm5qcy1yZWZlcmVuY2UtcGFuZWwnLCAncGFuZWwtYm90dG9tJyk7XG5cbiAgICBlbWl0dGVyLm9uKCdyZWZlcmVuY2UtaGlkZScsIHRoaXMuaGlkZUhhbmRsZXIpO1xuXG4gICAgdGhpcy5yZWdpc3RlckNvbW1hbmRzKCk7XG4gIH1cblxuICByZWdpc3RlckNvbW1hbmRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOnJlZmVyZW5jZXMnLCB0aGlzLmZpbmRSZWZlcmVuY2VMaXN0ZW5lcikpO1xuICB9XG5cbiAgZ29Ub1JlZmVyZW5jZShpZHgpIHtcblxuICAgIGNvbnN0IHJlZiA9IHRoaXMucmVmZXJlbmNlcy5yZWZzW2lkeF07XG5cbiAgICBpZiAobmF2aWdhdGlvbi5zZXQocmVmKSkge1xuXG4gICAgICBvcGVuRmlsZUFuZEdvVG8ocmVmLnN0YXJ0LCByZWYuZmlsZSk7XG4gICAgfVxuICB9XG5cbiAgZmluZFJlZmVyZW5jZSgpIHtcblxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuXG4gICAgaWYgKFxuICAgICAgIW1hbmFnZXIuY2xpZW50IHx8XG4gICAgICAhZWRpdG9yIHx8XG4gICAgICAhY3Vyc29yXG4gICAgKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpO1xuXG4gICAgbWFuYWdlci5jbGllbnQudXBkYXRlKGVkaXRvcikudGhlbigoZGF0YSkgPT4ge1xuICAgICAgbWFuYWdlci5jbGllbnQucmVmcyhhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXSwge2xpbmU6IHBvc2l0aW9uLnJvdywgY2g6IHBvc2l0aW9uLmNvbHVtbn0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdObyByZWZlcmVuY2VzIGZvdW5kLicsIHsgZGlzbWlzc2FibGU6IGZhbHNlIH0pO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWZlcmVuY2VzID0gZGF0YTtcblxuICAgICAgICBmb3IgKGxldCByZWZlcmVuY2Ugb2YgZGF0YS5yZWZzKSB7XG5cbiAgICAgICAgICByZWZlcmVuY2UuZmlsZSA9IHJlZmVyZW5jZS5maWxlLnJlcGxhY2UoL14uXFwvLywgJycpO1xuICAgICAgICAgIHJlZmVyZW5jZS5maWxlID0gcGF0aC5yZXNvbHZlKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChtYW5hZ2VyLnNlcnZlci5wcm9qZWN0RGlyKVswXSwgcmVmZXJlbmNlLmZpbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YS5yZWZzID0gdW5pcShkYXRhLnJlZnMsIChpdGVtKSA9PiB7XG5cbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoaXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRhdGEgPSB0aGlzLmdhdGhlck1ldGEoZGF0YSk7XG4gICAgICAgIHRoaXMucmVmZXJlbmNlVmlldy5idWlsZEl0ZW1zKGRhdGEpO1xuICAgICAgICB0aGlzLnJlZmVyZW5jZVBhbmVsLnNob3coKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZGVidWcuaGFuZGxlQ2F0Y2hXaXRoTm90aWZpY2F0aW9uKTtcbiAgICB9KVxuICAgIC5jYXRjaChkZWJ1Zy5oYW5kbGVDYXRjaCk7XG4gIH1cblxuICBnYXRoZXJNZXRhKGRhdGEpIHtcblxuICAgIGZvciAobGV0IGl0ZW0gb2YgZGF0YS5yZWZzKSB7XG5cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoaXRlbS5maWxlLCAndXRmOCcpO1xuICAgICAgY29uc3QgYnVmZmVyID0gbmV3IFRleHRCdWZmZXIoeyB0ZXh0OiBjb250ZW50IH0pO1xuXG4gICAgICBpdGVtLnBvc2l0aW9uID0gYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoaXRlbS5zdGFydCk7XG4gICAgICBpdGVtLmxpbmVUZXh0ID0gYnVmZmVyLmxpbmVGb3JSb3coaXRlbS5wb3NpdGlvbi5yb3cpO1xuXG4gICAgICBidWZmZXIuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgaGlkZSgpIHtcblxuICAgIHRoaXMucmVmZXJlbmNlUGFuZWwgJiYgdGhpcy5yZWZlcmVuY2VQYW5lbC5oaWRlKCk7XG5cbiAgICBmb2N1c0VkaXRvcigpO1xuICB9XG5cbiAgc2hvdygpIHtcblxuICAgIHRoaXMucmVmZXJlbmNlUGFuZWwuc2hvdygpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGVtaXR0ZXIub2ZmKCdyZWZlcmVuY2UtaGlkZScsIHRoaXMuaGlkZUhhbmRsZXIpO1xuXG4gICAgZGlzcG9zZUFsbCh0aGlzLmRpc3Bvc2FibGVzKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG4gICAgdGhpcy5yZWZlcmVuY2VzID0gW107XG5cbiAgICB0aGlzLnJlZmVyZW5jZVZpZXcgJiYgdGhpcy5yZWZlcmVuY2VWaWV3LmRlc3Ryb3koKTtcbiAgICB0aGlzLnJlZmVyZW5jZVZpZXcgPSBudWxsO1xuXG4gICAgdGhpcy5yZWZlcmVuY2VQYW5lbCAmJiB0aGlzLnJlZmVyZW5jZVBhbmVsLmRlc3Ryb3koKTtcbiAgICB0aGlzLnJlZmVyZW5jZVBhbmVsID0gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgUmVmZXJlbmNlKCk7XG4iXX0=