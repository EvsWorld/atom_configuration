Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

'use babel';

var ScriptOptions = (function () {
  function ScriptOptions() {
    _classCallCheck(this, ScriptOptions);

    this.name = '';
    this.description = '';
    this.lang = '';
    this.workingDirectory = null;
    this.cmd = null;
    this.cmdArgs = [];
    this.env = null;
    this.scriptArgs = [];
  }

  _createClass(ScriptOptions, [{
    key: 'toObject',
    value: function toObject() {
      return {
        name: this.name,
        description: this.description,
        lang: this.lang,
        workingDirectory: this.workingDirectory,
        cmd: this.cmd,
        cmdArgs: this.cmdArgs,
        env: this.env,
        scriptArgs: this.scriptArgs
      };
    }

    // Public: Serializes the user specified environment vars as an {object}
    // TODO: Support shells that allow a number as the first character in a variable?
    //
    // Returns an {Object} representation of the user specified environment.
  }, {
    key: 'getEnv',
    value: function getEnv() {
      if (!this.env) return {};

      var mapping = {};

      for (var pair of this.env.trim().split(';')) {
        var _pair$split = pair.split('=', 2);

        var _pair$split2 = _slicedToArray(_pair$split, 2);

        var key = _pair$split2[0];
        var value = _pair$split2[1];

        mapping[key] = ('' + value).replace(/"((?:[^"\\]|\\"|\\[^"])+)"/, '$1');
        mapping[key] = mapping[key].replace(/'((?:[^'\\]|\\'|\\[^'])+)'/, '$1');
      }

      return mapping;
    }

    // Public: Merges two environment objects
    //
    // otherEnv - The {Object} to extend the parsed environment by
    //
    // Returns the merged environment {Object}.
  }, {
    key: 'mergedEnv',
    value: function mergedEnv(otherEnv) {
      var otherCopy = _underscore2['default'].extend({}, otherEnv);
      var mergedEnv = _underscore2['default'].extend(otherCopy, this.getEnv());

      for (var key in mergedEnv) {
        var value = mergedEnv[key];
        mergedEnv[key] = ('' + value).replace(/"((?:[^"\\]|\\"|\\[^"])+)"/, '$1');
        mergedEnv[key] = mergedEnv[key].replace(/'((?:[^'\\]|\\'|\\[^'])+)'/, '$1');
      }

      return mergedEnv;
    }
  }], [{
    key: 'createFromOptions',
    value: function createFromOptions(name, options) {
      var so = new ScriptOptions();
      so.name = name;
      for (var key in options) {
        var value = options[key];so[key] = value;
      }
      return so;
    }
  }]);

  return ScriptOptions;
})();

exports['default'] = ScriptOptions;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9zY3JpcHQtb3B0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7MEJBRWMsWUFBWTs7OztBQUYxQixXQUFXLENBQUM7O0lBSVMsYUFBYTtBQUNyQixXQURRLGFBQWEsR0FDbEI7MEJBREssYUFBYTs7QUFFOUIsUUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNmLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDN0IsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7R0FDdEI7O2VBVmtCLGFBQWE7O1dBbUJ4QixvQkFBRztBQUNULGFBQU87QUFDTCxZQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixtQkFBVyxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQzdCLFlBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNmLHdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7QUFDdkMsV0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO0FBQ2IsZUFBTyxFQUFFLElBQUksQ0FBQyxPQUFPO0FBQ3JCLFdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztBQUNiLGtCQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7T0FDNUIsQ0FBQztLQUNIOzs7Ozs7OztXQU1LLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUM7O0FBRXpCLFVBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQzs7QUFFbkIsV0FBSyxJQUFNLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTswQkFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDOzs7O1lBQWhDLEdBQUc7WUFBRSxLQUFLOztBQUNqQixlQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBRyxLQUFLLEVBQUcsT0FBTyxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3RFLGVBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxDQUFDO09BQ3pFOztBQUdELGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7Ozs7Ozs7V0FPUSxtQkFBQyxRQUFRLEVBQUU7QUFDbEIsVUFBTSxTQUFTLEdBQUcsd0JBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN6QyxVQUFNLFNBQVMsR0FBRyx3QkFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDOztBQUVyRCxXQUFLLElBQU0sR0FBRyxJQUFJLFNBQVMsRUFBRTtBQUMzQixZQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsaUJBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFHLEtBQUssRUFBRyxPQUFPLENBQUMsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDeEUsaUJBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxDQUFDO09BQzdFOztBQUVELGFBQU8sU0FBUyxDQUFDO0tBQ2xCOzs7V0F2RHVCLDJCQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7QUFDdEMsVUFBTSxFQUFFLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztBQUMvQixRQUFFLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNmLFdBQUssSUFBTSxHQUFHLElBQUksT0FBTyxFQUFFO0FBQUUsWUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEFBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztPQUFFO0FBQzNFLGFBQU8sRUFBRSxDQUFDO0tBQ1g7OztTQWpCa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC1vcHRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JpcHRPcHRpb25zIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5uYW1lID0gJyc7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9ICcnO1xuICAgIHRoaXMubGFuZyA9ICcnO1xuICAgIHRoaXMud29ya2luZ0RpcmVjdG9yeSA9IG51bGw7XG4gICAgdGhpcy5jbWQgPSBudWxsO1xuICAgIHRoaXMuY21kQXJncyA9IFtdO1xuICAgIHRoaXMuZW52ID0gbnVsbDtcbiAgICB0aGlzLnNjcmlwdEFyZ3MgPSBbXTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVGcm9tT3B0aW9ucyhuYW1lLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgc28gPSBuZXcgU2NyaXB0T3B0aW9ucygpO1xuICAgIHNvLm5hbWUgPSBuYW1lO1xuICAgIGZvciAoY29uc3Qga2V5IGluIG9wdGlvbnMpIHsgY29uc3QgdmFsdWUgPSBvcHRpb25zW2tleV07IHNvW2tleV0gPSB2YWx1ZTsgfVxuICAgIHJldHVybiBzbztcbiAgfVxuXG4gIHRvT2JqZWN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIGxhbmc6IHRoaXMubGFuZyxcbiAgICAgIHdvcmtpbmdEaXJlY3Rvcnk6IHRoaXMud29ya2luZ0RpcmVjdG9yeSxcbiAgICAgIGNtZDogdGhpcy5jbWQsXG4gICAgICBjbWRBcmdzOiB0aGlzLmNtZEFyZ3MsXG4gICAgICBlbnY6IHRoaXMuZW52LFxuICAgICAgc2NyaXB0QXJnczogdGhpcy5zY3JpcHRBcmdzLFxuICAgIH07XG4gIH1cblxuICAvLyBQdWJsaWM6IFNlcmlhbGl6ZXMgdGhlIHVzZXIgc3BlY2lmaWVkIGVudmlyb25tZW50IHZhcnMgYXMgYW4ge29iamVjdH1cbiAgLy8gVE9ETzogU3VwcG9ydCBzaGVsbHMgdGhhdCBhbGxvdyBhIG51bWJlciBhcyB0aGUgZmlyc3QgY2hhcmFjdGVyIGluIGEgdmFyaWFibGU/XG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge09iamVjdH0gcmVwcmVzZW50YXRpb24gb2YgdGhlIHVzZXIgc3BlY2lmaWVkIGVudmlyb25tZW50LlxuICBnZXRFbnYoKSB7XG4gICAgaWYgKCF0aGlzLmVudikgcmV0dXJuIHt9O1xuXG4gICAgY29uc3QgbWFwcGluZyA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBwYWlyIG9mIHRoaXMuZW52LnRyaW0oKS5zcGxpdCgnOycpKSB7XG4gICAgICBjb25zdCBba2V5LCB2YWx1ZV0gPSBwYWlyLnNwbGl0KCc9JywgMik7XG4gICAgICBtYXBwaW5nW2tleV0gPSBgJHt2YWx1ZX1gLnJlcGxhY2UoL1wiKCg/OlteXCJcXFxcXXxcXFxcXCJ8XFxcXFteXCJdKSspXCIvLCAnJDEnKTtcbiAgICAgIG1hcHBpbmdba2V5XSA9IG1hcHBpbmdba2V5XS5yZXBsYWNlKC8nKCg/OlteJ1xcXFxdfFxcXFwnfFxcXFxbXiddKSspJy8sICckMScpO1xuICAgIH1cblxuXG4gICAgcmV0dXJuIG1hcHBpbmc7XG4gIH1cblxuICAvLyBQdWJsaWM6IE1lcmdlcyB0d28gZW52aXJvbm1lbnQgb2JqZWN0c1xuICAvL1xuICAvLyBvdGhlckVudiAtIFRoZSB7T2JqZWN0fSB0byBleHRlbmQgdGhlIHBhcnNlZCBlbnZpcm9ubWVudCBieVxuICAvL1xuICAvLyBSZXR1cm5zIHRoZSBtZXJnZWQgZW52aXJvbm1lbnQge09iamVjdH0uXG4gIG1lcmdlZEVudihvdGhlckVudikge1xuICAgIGNvbnN0IG90aGVyQ29weSA9IF8uZXh0ZW5kKHt9LCBvdGhlckVudik7XG4gICAgY29uc3QgbWVyZ2VkRW52ID0gXy5leHRlbmQob3RoZXJDb3B5LCB0aGlzLmdldEVudigpKTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIG1lcmdlZEVudikge1xuICAgICAgY29uc3QgdmFsdWUgPSBtZXJnZWRFbnZba2V5XTtcbiAgICAgIG1lcmdlZEVudltrZXldID0gYCR7dmFsdWV9YC5yZXBsYWNlKC9cIigoPzpbXlwiXFxcXF18XFxcXFwifFxcXFxbXlwiXSkrKVwiLywgJyQxJyk7XG4gICAgICBtZXJnZWRFbnZba2V5XSA9IG1lcmdlZEVudltrZXldLnJlcGxhY2UoLycoKD86W14nXFxcXF18XFxcXCd8XFxcXFteJ10pKyknLywgJyQxJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lcmdlZEVudjtcbiAgfVxufVxuIl19