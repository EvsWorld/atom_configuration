Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var Hyperclick = (function () {
  function Hyperclick() {
    _classCallCheck(this, Hyperclick);

    this.providerName = 'atom-ternjs-hyperclick';
    this.wordRegExp = new RegExp('(`(\\\\.|[^`\\\\])*`)|(\'(\\\\.|[^\'\\\\])*\')|("(\\\\.|[^"\\\\])*")|([a-zA-Z0-9_$]+)', 'g');
  }

  _createClass(Hyperclick, [{
    key: 'getSuggestionForWord',
    value: function getSuggestionForWord(editor, string, range) {
      return new Promise(function (resolve) {
        if (!string.trim()) {
          return resolve(null);
        }

        if (!_atomTernjsManager2['default'].client) {
          return resolve(null);
        }

        _atomTernjsManager2['default'].client.update(editor).then(function (data) {
          if (!data) {
            return resolve(null);
          }

          var _atom$project$relativizePath = atom.project.relativizePath(editor.getURI());

          var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

          var project = _atom$project$relativizePath2[0];
          var file = _atom$project$relativizePath2[1];

          _atomTernjsManager2['default'].client.getDefinition(file, range).then(function (data) {
            if (!data) {
              return resolve(null);
            }

            if (data && data.file) {
              resolve({
                range: range,
                callback: function callback() {

                  var path_to_go = _path2['default'].isAbsolute(data.file) ? data.file : project + '/' + data.file;
                  (0, _atomTernjsHelper.openFileAndGoTo)(data.start, path_to_go);
                }
              });
            }

            resolve(null);
          })['catch'](function () {
            return resolve(null);
          });
        });
      });
    }
  }]);

  return Hyperclick;
})();

exports['default'] = new Hyperclick();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWh5cGVyY2xpY2stcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O2lDQUNILHVCQUF1Qjs7OztnQ0FDWCxzQkFBc0I7O0FBSnRELFdBQVcsQ0FBQzs7SUFNTixVQUFVO0FBQ0gsV0FEUCxVQUFVLEdBQ0E7MEJBRFYsVUFBVTs7QUFFWixRQUFJLENBQUMsWUFBWSxHQUFHLHdCQUF3QixDQUFDO0FBQzdDLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsdUZBQXVGLEVBQUUsR0FBRyxDQUFDLENBQUM7R0FDNUg7O2VBSkcsVUFBVTs7V0FNTSw4QkFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUMxQyxhQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQzlCLFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUU7QUFDbEIsaUJBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCOztBQUVELFlBQUksQ0FBQywrQkFBUSxNQUFNLEVBQUU7QUFDbkIsaUJBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCOztBQUVELHVDQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQzNDLGNBQUksQ0FBQyxJQUFJLEVBQUU7QUFDVCxtQkFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDdEI7OzZDQUN1QixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7Ozs7Y0FBN0QsT0FBTztjQUFFLElBQUk7O0FBQ3BCLHlDQUFRLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUN2RCxnQkFBSSxDQUFDLElBQUksRUFBRTtBQUNULHFCQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN0Qjs7QUFFRCxnQkFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNyQixxQkFBTyxDQUFDO0FBQ04scUJBQUssRUFBRSxLQUFLO0FBQ1osd0JBQVEsRUFBQSxvQkFBRzs7QUFFVCxzQkFBTSxVQUFVLEdBQUcsa0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFNLE9BQU8sU0FBSSxJQUFJLENBQUMsSUFBSSxBQUFFLENBQUM7QUFDdEYseURBQWdCLElBQUksQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQ3pDO2VBQ0YsQ0FBQyxDQUFDO2FBQ0o7O0FBRUQsbUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUNmLENBQUMsU0FBTSxDQUFDO21CQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUM7V0FBQSxDQUFDLENBQUM7U0FDL0IsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztTQXpDRyxVQUFVOzs7cUJBNENELElBQUksVUFBVSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWh5cGVyY2xpY2stcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IHsgb3BlbkZpbGVBbmRHb1RvIH0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuXG5jbGFzcyBIeXBlcmNsaWNrIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wcm92aWRlck5hbWUgPSAnYXRvbS10ZXJuanMtaHlwZXJjbGljayc7XG4gICAgdGhpcy53b3JkUmVnRXhwID0gbmV3IFJlZ0V4cCgnKGAoXFxcXFxcXFwufFteYFxcXFxcXFxcXSkqYCl8KFxcJyhcXFxcXFxcXC58W15cXCdcXFxcXFxcXF0pKlxcJyl8KFwiKFxcXFxcXFxcLnxbXlwiXFxcXFxcXFxdKSpcIil8KFthLXpBLVowLTlfJF0rKScsICdnJyk7XG4gIH1cblxuICBnZXRTdWdnZXN0aW9uRm9yV29yZChlZGl0b3IsIHN0cmluZywgcmFuZ2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGlmICghc3RyaW5nLnRyaW0oKSkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShudWxsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFtYW5hZ2VyLmNsaWVudCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShudWxsKTtcbiAgICAgIH1cblxuICAgICAgbWFuYWdlci5jbGllbnQudXBkYXRlKGVkaXRvcikudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBbcHJvamVjdCwgZmlsZV0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKTtcbiAgICAgICAgbWFuYWdlci5jbGllbnQuZ2V0RGVmaW5pdGlvbihmaWxlLCByYW5nZSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5maWxlKSB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgcmFuZ2U6IHJhbmdlLFxuICAgICAgICAgICAgICBjYWxsYmFjaygpIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGhfdG9fZ28gPSBwYXRoLmlzQWJzb2x1dGUoZGF0YS5maWxlKSA/IGRhdGEuZmlsZSA6IGAke3Byb2plY3R9LyR7ZGF0YS5maWxlfWA7XG4gICAgICAgICAgICAgICAgb3BlbkZpbGVBbmRHb1RvKGRhdGEuc3RhcnQsIHBhdGhfdG9fZ28pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICB9KS5jYXRjaCgoKSA9PiByZXNvbHZlKG51bGwpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBIeXBlcmNsaWNrKCk7XG4iXX0=