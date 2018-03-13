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

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsHelper2 = require('././atom-ternjs-helper');

var _servicesDebug = require('./services/debug');

var _servicesDebug2 = _interopRequireDefault(_servicesDebug);

'use babel';

var DocumentationView = require('./atom-ternjs-documentation-view');

var Documentation = (function () {
  function Documentation() {
    _classCallCheck(this, Documentation);

    this.disposable = null;
    this.disposables = [];

    this.view = null;
    this.overlayDecoration = null;
    this.destroyDocumenationListener = this.destroyOverlay.bind(this);
  }

  _createClass(Documentation, [{
    key: 'init',
    value: function init() {

      this.view = new DocumentationView();
      this.view.initialize(this);

      atom.views.getView(atom.workspace).appendChild(this.view);

      _atomTernjsEvents2['default'].on('documentation-destroy-overlay', this.destroyDocumenationListener);
      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:documentation', this.request.bind(this)));
    }
  }, {
    key: 'request',
    value: function request() {
      var _this = this;

      this.destroyOverlay();
      var editor = atom.workspace.getActiveTextEditor();

      if (!editor || !_atomTernjsManager2['default'].client) {

        return;
      }

      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();

      _atomTernjsManager2['default'].client.update(editor).then(function (data) {

        _atomTernjsManager2['default'].client.documentation(atom.project.relativizePath(editor.getURI())[1], {

          line: position.row,
          ch: position.column

        }).then(function (data) {

          if (!data) {

            return;
          }

          _this.view.setData({

            doc: (0, _atomTernjsHelper2.replaceTags)(data.doc),
            origin: data.origin,
            type: (0, _atomTernjsHelper2.formatType)(data),
            url: data.url || ''
          });

          _this.show();
        });
      })['catch'](_servicesDebug2['default'].handleCatch);
    }
  }, {
    key: 'show',
    value: function show() {

      var editor = atom.workspace.getActiveTextEditor();

      if (!editor) {

        return;
      }

      var marker = editor.getLastCursor && editor.getLastCursor().getMarker();

      if (!marker) {

        return;
      }

      this.disposable = editor.onDidChangeCursorPosition(this.destroyDocumenationListener);

      this.overlayDecoration = editor.decorateMarker(marker, {

        type: 'overlay',
        item: this.view,
        'class': 'atom-ternjs-documentation',
        position: 'tale',
        invalidate: 'touch'
      });
    }
  }, {
    key: 'destroyOverlay',
    value: function destroyOverlay() {

      this.disposable && this.disposable.dispose();

      if (this.overlayDecoration) {

        this.overlayDecoration.destroy();
      }

      this.overlayDecoration = null;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      _atomTernjsEvents2['default'].off('documentation-destroy-overlay', this.destroyDocumenationListener);

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];

      this.destroyOverlay();

      if (this.view) {

        this.view.destroy();
        this.view = null;
      }
    }
  }]);

  return Documentation;
})();

exports['default'] = new Documentation();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FJb0IsdUJBQXVCOzs7O2dDQUN2QixzQkFBc0I7Ozs7Z0NBQ2pCLHNCQUFzQjs7aUNBSXhDLHdCQUF3Qjs7NkJBQ2Isa0JBQWtCOzs7O0FBWHBDLFdBQVcsQ0FBQzs7QUFFWixJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDOztJQVdoRSxhQUFhO0FBRU4sV0FGUCxhQUFhLEdBRUg7MEJBRlYsYUFBYTs7QUFJZixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztBQUM5QixRQUFJLENBQUMsMkJBQTJCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDbkU7O2VBVkcsYUFBYTs7V0FZYixnQkFBRzs7QUFFTCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztBQUNwQyxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0IsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTFELG9DQUFRLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUM5RSxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FB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LFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXRCLFVBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdEIsVUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFOztBQUViLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDcEIsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7T0FDbEI7S0FDRjs7O1NBekhHLGFBQWE7OztxQkE0SEosSUFBSSxhQUFhLEVBQUUiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBEb2N1bWVudGF0aW9uVmlldyA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbi12aWV3Jyk7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgZW1pdHRlciBmcm9tICcuL2F0b20tdGVybmpzLWV2ZW50cyc7XG5pbXBvcnQge2Rpc3Bvc2VBbGx9IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcbmltcG9ydCB7XG4gIHJlcGxhY2VUYWdzLFxuICBmb3JtYXRUeXBlXG59IGZyb20gJy4vLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuaW1wb3J0IGRlYnVnIGZyb20gJy4vc2VydmljZXMvZGVidWcnO1xuXG5jbGFzcyBEb2N1bWVudGF0aW9uIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZSA9IG51bGw7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuXG4gICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uID0gbnVsbDtcbiAgICB0aGlzLmRlc3Ryb3lEb2N1bWVuYXRpb25MaXN0ZW5lciA9IHRoaXMuZGVzdHJveU92ZXJsYXkuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICB0aGlzLnZpZXcgPSBuZXcgRG9jdW1lbnRhdGlvblZpZXcoKTtcbiAgICB0aGlzLnZpZXcuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcblxuICAgIGVtaXR0ZXIub24oJ2RvY3VtZW50YXRpb24tZGVzdHJveS1vdmVybGF5JywgdGhpcy5kZXN0cm95RG9jdW1lbmF0aW9uTGlzdGVuZXIpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpkb2N1bWVudGF0aW9uJywgdGhpcy5yZXF1ZXN0LmJpbmQodGhpcykpKTtcbiAgfVxuXG4gIHJlcXVlc3QoKSB7XG5cbiAgICB0aGlzLmRlc3Ryb3lPdmVybGF5KCk7XG4gICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICAgIGlmIChcbiAgICAgICFlZGl0b3IgfHxcbiAgICAgICFtYW5hZ2VyLmNsaWVudFxuICAgICkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGN1cnNvciA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG4gICAgbGV0IHBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCk7XG5cbiAgICBtYW5hZ2VyLmNsaWVudC51cGRhdGUoZWRpdG9yKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgIG1hbmFnZXIuY2xpZW50LmRvY3VtZW50YXRpb24oYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0sIHtcblxuICAgICAgICBsaW5lOiBwb3NpdGlvbi5yb3csXG4gICAgICAgIGNoOiBwb3NpdGlvbi5jb2x1bW5cblxuICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52aWV3LnNldERhdGEoe1xuXG4gICAgICAgICAgZG9jOiByZXBsYWNlVGFncyhkYXRhLmRvYyksXG4gICAgICAgICAgb3JpZ2luOiBkYXRhLm9yaWdpbixcbiAgICAgICAgICB0eXBlOiBmb3JtYXRUeXBlKGRhdGEpLFxuICAgICAgICAgIHVybDogZGF0YS51cmwgfHwgJydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9KTtcbiAgICB9KVxuICAgIC5jYXRjaChkZWJ1Zy5oYW5kbGVDYXRjaCk7XG4gIH1cblxuICBzaG93KCkge1xuXG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG4gICAgaWYgKCFlZGl0b3IpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcmtlciA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yICYmIGVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0TWFya2VyKCk7XG5cbiAgICBpZiAoIW1hcmtlcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlID0gZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24odGhpcy5kZXN0cm95RG9jdW1lbmF0aW9uTGlzdGVuZXIpO1xuXG4gICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbiA9IGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcblxuICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgaXRlbTogdGhpcy52aWV3LFxuICAgICAgY2xhc3M6ICdhdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uJyxcbiAgICAgIHBvc2l0aW9uOiAndGFsZScsXG4gICAgICBpbnZhbGlkYXRlOiAndG91Y2gnXG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95T3ZlcmxheSgpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZSAmJiB0aGlzLmRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuXG4gICAgaWYgKHRoaXMub3ZlcmxheURlY29yYXRpb24pIHtcblxuICAgICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbi5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbiA9IG51bGw7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgZW1pdHRlci5vZmYoJ2RvY3VtZW50YXRpb24tZGVzdHJveS1vdmVybGF5JywgdGhpcy5kZXN0cm95RG9jdW1lbmF0aW9uTGlzdGVuZXIpO1xuXG4gICAgZGlzcG9zZUFsbCh0aGlzLmRpc3Bvc2FibGVzKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG5cbiAgICB0aGlzLmRlc3Ryb3lPdmVybGF5KCk7XG5cbiAgICBpZiAodGhpcy52aWV3KSB7XG5cbiAgICAgIHRoaXMudmlldy5kZXN0cm95KCk7XG4gICAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRG9jdW1lbnRhdGlvbigpO1xuIl19