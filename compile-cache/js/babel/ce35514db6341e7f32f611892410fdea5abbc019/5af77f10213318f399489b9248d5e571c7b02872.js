Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atom = require('atom');

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _underscorePlus = require('underscore-plus');

'use babel';

var TypeView = require('./atom-ternjs-type-view');
var TOLERANCE = 20;

var Type = (function () {
  function Type() {
    _classCallCheck(this, Type);

    this.view = null;
    this.overlayDecoration = null;

    this.currentRange = null;
    this.currentViewData = null;

    this.destroyOverlayListener = this.destroyOverlay.bind(this);
  }

  _createClass(Type, [{
    key: 'init',
    value: function init() {

      this.view = new TypeView();
      this.view.initialize(this);

      atom.views.getView(atom.workspace).appendChild(this.view);

      _atomTernjsEvents2['default'].on('type-destroy-overlay', this.destroyOverlayListener);
    }
  }, {
    key: 'setPosition',
    value: function setPosition() {

      if (this.overlayDecoration) {

        return;
      }

      var editor = atom.workspace.getActiveTextEditor();

      if (!editor) {

        return;
      }

      var marker = editor.getLastCursor().getMarker();

      if (!marker) {

        return;
      }

      this.overlayDecoration = editor.decorateMarker(marker, {

        type: 'overlay',
        item: this.view,
        'class': 'atom-ternjs-type',
        position: 'tale',
        invalidate: 'touch'
      });
    }
  }, {
    key: 'queryType',
    value: function queryType(editor, e) {
      var _this = this;

      var rowStart = 0;
      var rangeBefore = false;
      var tmp = false;
      var may = 0;
      var may2 = 0;
      var skipCounter = 0;
      var skipCounter2 = 0;
      var paramPosition = 0;
      var position = e.newBufferPosition;
      var buffer = editor.getBuffer();

      if (position.row - TOLERANCE < 0) {

        rowStart = 0;
      } else {

        rowStart = position.row - TOLERANCE;
      }

      buffer.backwardsScanInRange(/\]|\[|\(|\)|\,|\{|\}/g, new _atom.Range([rowStart, 0], [position.row, position.column]), function (obj) {

        if (obj.matchText === '}') {

          may++;
          return;
        }

        if (obj.matchText === ']') {

          if (!tmp) {

            skipCounter2++;
          }

          may2++;
          return;
        }

        if (obj.matchText === '{') {

          if (!may) {

            rangeBefore = false;
            obj.stop();

            return;
          }

          may--;
          return;
        }

        if (obj.matchText === '[') {

          if (skipCounter2) {

            skipCounter2--;
          }

          if (!may2) {

            rangeBefore = false;
            obj.stop();
            return;
          }

          may2--;
          return;
        }

        if (obj.matchText === ')' && !tmp) {

          skipCounter++;
          return;
        }

        if (obj.matchText === ',' && !skipCounter && !skipCounter2 && !may && !may2) {

          paramPosition++;
          return;
        }

        if (obj.matchText === ',') {

          return;
        }

        if (obj.matchText === '(' && skipCounter) {

          skipCounter--;
          return;
        }

        if (skipCounter || skipCounter2) {

          return;
        }

        if (obj.matchText === '(' && !tmp) {

          rangeBefore = obj.range;
          obj.stop();

          return;
        }

        tmp = obj.matchText;
      });

      if (!rangeBefore) {

        this.currentViewData = null;
        this.currentRange = null;
        this.destroyOverlay();

        return;
      }

      if (rangeBefore.isEqual(this.currentRange)) {

        this.currentViewData && this.setViewData(this.currentViewData, paramPosition);

        return;
      }

      this.currentRange = rangeBefore;
      this.currentViewData = null;
      this.destroyOverlay();

      _atomTernjsManager2['default'].client.update(editor).then(function () {

        _atomTernjsManager2['default'].client.type(editor, rangeBefore.start).then(function (data) {

          if (!data || !data.type.startsWith('fn') || !data.exprName) {

            return;
          }

          _this.currentViewData = data;

          _this.setViewData(data, paramPosition);
        })['catch'](function (error) {

          // most likely the type wasn't found. ignore it.
        });
      });
    }
  }, {
    key: 'setViewData',
    value: function setViewData(data, paramPosition) {

      var viewData = (0, _underscorePlus.deepClone)(data);
      var type = (0, _atomTernjsHelper.prepareType)(viewData);
      var params = (0, _atomTernjsHelper.extractParams)(type);
      (0, _atomTernjsHelper.formatType)(viewData);

      if (params && params[paramPosition]) {

        viewData.type = viewData.type.replace(params[paramPosition], '<span class="text-info">' + params[paramPosition] + '</span>');
      }

      if (viewData.doc && _atomTernjsPackageConfig2['default'].options.inlineFnCompletionDocumentation) {

        viewData.doc = viewData.doc && viewData.doc.replace(/(?:\r\n|\r|\n)/g, '<br />');
        viewData.doc = (0, _atomTernjsHelper.prepareInlineDocs)(viewData.doc);

        this.view.setData(viewData.type, viewData.doc);
      } else {

        this.view.setData(viewData.type);
      }

      this.setPosition();
    }
  }, {
    key: 'destroyOverlay',
    value: function destroyOverlay() {

      if (this.overlayDecoration) {

        this.overlayDecoration.destroy();
      }

      this.overlayDecoration = null;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      _atomTernjsEvents2['default'].off('destroy-type-overlay', this.destroyOverlayListener);

      this.destroyOverlay();

      if (this.view) {

        this.view.destroy();
        this.view = null;
      }
    }
  }]);

  return Type;
})();

exports['default'] = new Type();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXR5cGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FLb0IsdUJBQXVCOzs7O3VDQUNqQiw4QkFBOEI7Ozs7Z0NBQ3BDLHNCQUFzQjs7OztvQkFDdEIsTUFBTTs7Z0NBTW5CLHNCQUFzQjs7OEJBRUwsaUJBQWlCOztBQWhCekMsV0FBVyxDQUFDOztBQUVaLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3BELElBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQzs7SUFlZixJQUFJO0FBRUcsV0FGUCxJQUFJLEdBRU07MEJBRlYsSUFBSTs7QUFJTixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDOztBQUU5QixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztBQUN6QixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQzs7QUFFNUIsUUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzlEOztlQVhHLElBQUk7O1dBYUosZ0JBQUc7O0FBRUwsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQzNCLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUzQixVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFMUQsb0NBQVEsRUFBRSxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0tBQ2pFOzs7V0FFVSx1QkFBRzs7QUFFWixVQUFJLElB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Z0JBQVEsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNqRixnQkFBUSxDQUFDLEdBQUcsR0FBRyx5Q0FBa0IsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUvQyxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUVoRCxNQUFNOztBQUVMLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNsQzs7QUFFRCxVQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDcEI7OztXQUVhLDBCQUFHOztBQUVmLFVBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFOztBQUUxQixZQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDbEM7O0FBRUQsVUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztLQUMvQjs7O1dBRU0sbUJBQUc7O0FBRVIsb0NBQVEsR0FBRyxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUVqRSxVQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRXRCLFVBQUksSUFBSSxDQUFDLElBQUksRUFBRTs7QUFFYixZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO09BQ2xCO0tBQ0Y7OztTQXJRRyxJQUFJOzs7cUJBd1FLLElBQUksSUFBSSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXR5cGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgVHlwZVZpZXcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXR5cGUtdmlldycpO1xuY29uc3QgVE9MRVJBTkNFID0gMjA7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgcGFja2FnZUNvbmZpZyBmcm9tICcuL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnJztcbmltcG9ydCBlbWl0dGVyIGZyb20gJy4vYXRvbS10ZXJuanMtZXZlbnRzJztcbmltcG9ydCB7UmFuZ2V9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHtcbiAgcHJlcGFyZVR5cGUsXG4gIHByZXBhcmVJbmxpbmVEb2NzLFxuICBleHRyYWN0UGFyYW1zLFxuICBmb3JtYXRUeXBlXG59IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcblxuaW1wb3J0IHtkZWVwQ2xvbmV9IGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5cbmNsYXNzIFR5cGUge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uID0gbnVsbDtcblxuICAgIHRoaXMuY3VycmVudFJhbmdlID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRWaWV3RGF0YSA9IG51bGw7XG5cbiAgICB0aGlzLmRlc3Ryb3lPdmVybGF5TGlzdGVuZXIgPSB0aGlzLmRlc3Ryb3lPdmVybGF5LmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgdGhpcy52aWV3ID0gbmV3IFR5cGVWaWV3KCk7XG4gICAgdGhpcy52aWV3LmluaXRpYWxpemUodGhpcyk7XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG5cbiAgICBlbWl0dGVyLm9uKCd0eXBlLWRlc3Ryb3ktb3ZlcmxheScsIHRoaXMuZGVzdHJveU92ZXJsYXlMaXN0ZW5lcik7XG4gIH1cblxuICBzZXRQb3NpdGlvbigpIHtcblxuICAgIGlmICh0aGlzLm92ZXJsYXlEZWNvcmF0aW9uKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICBpZiAoIWVkaXRvcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWFya2VyID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRNYXJrZXIoKTtcblxuICAgIGlmICghbWFya2VyKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uID0gZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuXG4gICAgICB0eXBlOiAnb3ZlcmxheScsXG4gICAgICBpdGVtOiB0aGlzLnZpZXcsXG4gICAgICBjbGFzczogJ2F0b20tdGVybmpzLXR5cGUnLFxuICAgICAgcG9zaXRpb246ICd0YWxlJyxcbiAgICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgICB9KTtcbiAgfVxuXG4gIHF1ZXJ5VHlwZShlZGl0b3IsIGUpIHtcblxuICAgIGxldCByb3dTdGFydCA9IDA7XG4gICAgbGV0IHJhbmdlQmVmb3JlID0gZmFsc2U7XG4gICAgbGV0IHRtcCA9IGZhbHNlO1xuICAgIGxldCBtYXkgPSAwO1xuICAgIGxldCBtYXkyID0gMDtcbiAgICBsZXQgc2tpcENvdW50ZXIgPSAwO1xuICAgIGxldCBza2lwQ291bnRlcjIgPSAwO1xuICAgIGxldCBwYXJhbVBvc2l0aW9uID0gMDtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGUubmV3QnVmZmVyUG9zaXRpb247XG4gICAgY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuXG4gICAgaWYgKHBvc2l0aW9uLnJvdyAtIFRPTEVSQU5DRSA8IDApIHtcblxuICAgICAgcm93U3RhcnQgPSAwO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgcm93U3RhcnQgPSBwb3NpdGlvbi5yb3cgLSBUT0xFUkFOQ0U7XG4gICAgfVxuXG4gICAgYnVmZmVyLmJhY2t3YXJkc1NjYW5JblJhbmdlKC9cXF18XFxbfFxcKHxcXCl8XFwsfFxce3xcXH0vZywgbmV3IFJhbmdlKFtyb3dTdGFydCwgMF0sIFtwb3NpdGlvbi5yb3csIHBvc2l0aW9uLmNvbHVtbl0pLCAob2JqKSA9PiB7XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnfScpIHtcblxuICAgICAgICBtYXkrKztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJ10nKSB7XG5cbiAgICAgICAgaWYgKCF0bXApIHtcblxuICAgICAgICAgIHNraXBDb3VudGVyMisrO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF5MisrO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAneycpIHtcblxuICAgICAgICBpZiAoIW1heSkge1xuXG4gICAgICAgICAgcmFuZ2VCZWZvcmUgPSBmYWxzZTtcbiAgICAgICAgICBvYmouc3RvcCgpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF5LS07XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iai5tYXRjaFRleHQgPT09ICdbJykge1xuXG4gICAgICAgIGlmIChza2lwQ291bnRlcjIpIHtcblxuICAgICAgICAgIHNraXBDb3VudGVyMi0tO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtYXkyKSB7XG5cbiAgICAgICAgICByYW5nZUJlZm9yZSA9IGZhbHNlO1xuICAgICAgICAgIG9iai5zdG9wKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF5Mi0tO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnKScgJiYgIXRtcCkge1xuXG4gICAgICAgIHNraXBDb3VudGVyKys7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iai5tYXRjaFRleHQgPT09ICcsJyAmJiAhc2tpcENvdW50ZXIgJiYgIXNraXBDb3VudGVyMiAmJiAhbWF5ICYmICFtYXkyKSB7XG5cbiAgICAgICAgcGFyYW1Qb3NpdGlvbisrO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnLCcpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnKCcgJiYgc2tpcENvdW50ZXIpIHtcblxuICAgICAgICBza2lwQ291bnRlci0tO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChza2lwQ291bnRlciB8fCBza2lwQ291bnRlcjIpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnKCcgJiYgIXRtcCkge1xuXG4gICAgICAgIHJhbmdlQmVmb3JlID0gb2JqLnJhbmdlO1xuICAgICAgICBvYmouc3RvcCgpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdG1wID0gb2JqLm1hdGNoVGV4dDtcbiAgICB9KTtcblxuICAgIGlmICghcmFuZ2VCZWZvcmUpIHtcblxuICAgICAgdGhpcy5jdXJyZW50Vmlld0RhdGEgPSBudWxsO1xuICAgICAgdGhpcy5jdXJyZW50UmFuZ2UgPSBudWxsO1xuICAgICAgdGhpcy5kZXN0cm95T3ZlcmxheSgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHJhbmdlQmVmb3JlLmlzRXF1YWwodGhpcy5jdXJyZW50UmFuZ2UpKSB7XG5cbiAgICAgIHRoaXMuY3VycmVudFZpZXdEYXRhICYmIHRoaXMuc2V0Vmlld0RhdGEodGhpcy5jdXJyZW50Vmlld0RhdGEsIHBhcmFtUG9zaXRpb24pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50UmFuZ2UgPSByYW5nZUJlZm9yZTtcbiAgICB0aGlzLmN1cnJlbnRWaWV3RGF0YSA9IG51bGw7XG4gICAgdGhpcy5kZXN0cm95T3ZlcmxheSgpO1xuXG4gICAgbWFuYWdlci5jbGllbnQudXBkYXRlKGVkaXRvcikudGhlbigoKSA9PiB7XG5cbiAgICAgIG1hbmFnZXIuY2xpZW50LnR5cGUoZWRpdG9yLCByYW5nZUJlZm9yZS5zdGFydCkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAhZGF0YSB8fFxuICAgICAgICAgICFkYXRhLnR5cGUuc3RhcnRzV2l0aCgnZm4nKSB8fFxuICAgICAgICAgICFkYXRhLmV4cHJOYW1lXG4gICAgICAgICkge1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50Vmlld0RhdGEgPSBkYXRhO1xuXG4gICAgICAgIHRoaXMuc2V0Vmlld0RhdGEoZGF0YSwgcGFyYW1Qb3NpdGlvbik7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuXG4gICAgICAgIC8vIG1vc3QgbGlrZWx5IHRoZSB0eXBlIHdhc24ndCBmb3VuZC4gaWdub3JlIGl0LlxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRWaWV3RGF0YShkYXRhLCBwYXJhbVBvc2l0aW9uKSB7XG5cbiAgICBjb25zdCB2aWV3RGF0YSA9IGRlZXBDbG9uZShkYXRhKTtcbiAgICBjb25zdCB0eXBlID0gcHJlcGFyZVR5cGUodmlld0RhdGEpO1xuICAgIGNvbnN0IHBhcmFtcyA9IGV4dHJhY3RQYXJhbXModHlwZSk7XG4gICAgZm9ybWF0VHlwZSh2aWV3RGF0YSk7XG5cbiAgICBpZiAocGFyYW1zICYmIHBhcmFtc1twYXJhbVBvc2l0aW9uXSkge1xuXG4gICAgICB2aWV3RGF0YS50eXBlID0gdmlld0RhdGEudHlwZS5yZXBsYWNlKHBhcmFtc1twYXJhbVBvc2l0aW9uXSwgYDxzcGFuIGNsYXNzPVwidGV4dC1pbmZvXCI+JHtwYXJhbXNbcGFyYW1Qb3NpdGlvbl19PC9zcGFuPmApO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHZpZXdEYXRhLmRvYyAmJlxuICAgICAgcGFja2FnZUNvbmZpZy5vcHRpb25zLmlubGluZUZuQ29tcGxldGlvbkRvY3VtZW50YXRpb25cbiAgICApIHtcblxuICAgICAgdmlld0RhdGEuZG9jID0gdmlld0RhdGEuZG9jICYmIHZpZXdEYXRhLmRvYy5yZXBsYWNlKC8oPzpcXHJcXG58XFxyfFxcbikvZywgJzxiciAvPicpO1xuICAgICAgdmlld0RhdGEuZG9jID0gcHJlcGFyZUlubGluZURvY3Modmlld0RhdGEuZG9jKTtcblxuICAgICAgdGhpcy52aWV3LnNldERhdGEodmlld0RhdGEudHlwZSwgdmlld0RhdGEuZG9jKTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRoaXMudmlldy5zZXREYXRhKHZpZXdEYXRhLnR5cGUpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcbiAgfVxuXG4gIGRlc3Ryb3lPdmVybGF5KCkge1xuXG4gICAgaWYgKHRoaXMub3ZlcmxheURlY29yYXRpb24pIHtcblxuICAgICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbi5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbiA9IG51bGw7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgZW1pdHRlci5vZmYoJ2Rlc3Ryb3ktdHlwZS1vdmVybGF5JywgdGhpcy5kZXN0cm95T3ZlcmxheUxpc3RlbmVyKTtcblxuICAgIHRoaXMuZGVzdHJveU92ZXJsYXkoKTtcblxuICAgIGlmICh0aGlzLnZpZXcpIHtcblxuICAgICAgdGhpcy52aWV3LmRlc3Ryb3koKTtcbiAgICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBUeXBlKCk7XG4iXX0=