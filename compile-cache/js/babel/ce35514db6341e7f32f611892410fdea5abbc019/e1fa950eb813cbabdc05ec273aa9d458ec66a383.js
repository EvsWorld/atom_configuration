Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require("./utils");

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var iconHTML = "<img src='" + __dirname + "/../static/logo.svg' style='width: 100%;'>";

var regexes = {
  // pretty dodgy, adapted from http://stackoverflow.com/a/8396658
  r: /([^\d\W]|[.])[\w.$]*$/,

  // adapted from http://stackoverflow.com/q/5474008
  python: /([^\d\W]|[\u00A0-\uFFFF])[\w.\u00A0-\uFFFF]*$/,

  // adapted from http://php.net/manual/en/language.variables.basics.php
  php: /[$a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/
};

function parseCompletions(results, prefix) {
  var matches = results.matches;
  var cursor_start = results.cursor_start;
  var cursor_end = results.cursor_end;
  var metadata = results.metadata;

  if (metadata && metadata._jupyter_types_experimental) {
    var comps = metadata._jupyter_types_experimental;
    if (comps.length > 0 && comps[0].text != null && comps[0].start != null && comps[0].end != null) {
      return _lodash2["default"].map(comps, function (match) {
        return {
          text: match.text,
          replacementPrefix: prefix.slice(match.start, match.end),
          type: match.type,
          iconHTML: !match.type || match.type === "<unknown>" ? iconHTML : undefined
        };
      });
    }
  }

  var replacementPrefix = prefix.slice(cursor_start, cursor_end);

  return _lodash2["default"].map(matches, function (match) {
    return {
      text: match,
      replacementPrefix: replacementPrefix,
      iconHTML: iconHTML
    };
  });
}

exports["default"] = function () {
  var autocompleteProvider = {
    selector: ".source",
    disableForSelector: ".comment, .string",

    // `excludeLowerPriority: false` won't suppress providers with lower
    // priority.
    // The default provider has a priority of 0.
    inclusionPriority: 1,
    excludeLowerPriority: false,

    // Required: Return a promise, an array of suggestions, or null.
    getSuggestions: function getSuggestions(_ref) {
      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var prefix = _ref.prefix;

      var kernel = _store2["default"].kernel;

      if (!kernel || kernel.executionState !== "idle") {
        return null;
      }

      var line = editor.getTextInBufferRange([[bufferPosition.row, 0], bufferPosition]);

      var regex = regexes[kernel.language];
      if (regex) {
        prefix = _lodash2["default"].head(line.match(regex)) || "";
      } else {
        prefix = line;
      }

      // return if cursor is at whitespace
      if (prefix.trimRight().length < prefix.length) {
        return null;
      }

      var minimumWordLength = atom.config.get("autocomplete-plus.minimumWordLength");
      if (typeof minimumWordLength !== "number") {
        minimumWordLength = 3;
      }

      if (prefix.trim().length < minimumWordLength) {
        return null;
      }

      (0, _utils.log)("autocompleteProvider: request:", line, bufferPosition, prefix);

      return new Promise(function (resolve) {
        return kernel.complete(prefix, function (results) {
          return resolve(parseCompletions(results, prefix));
        });
      });
    }
  };

  return autocompleteProvider;
};

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2F1dG9jb21wbGV0ZS1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7c0JBRWMsUUFBUTs7OztxQkFDRixTQUFTOztxQkFDWCxTQUFTOzs7O0FBc0IzQixJQUFNLFFBQVEsa0JBQ1osU0FBUywrQ0FDaUMsQ0FBQzs7QUFFN0MsSUFBTSxPQUFPLEdBQUc7O0FBRWQsR0FBQyxFQUFFLHVCQUF1Qjs7O0FBRzFCLFFBQU0sRUFBRSwrQ0FBK0M7OztBQUd2RCxLQUFHLEVBQUUsNENBQTRDO0NBQ2xELENBQUM7O0FBRUYsU0FBUyxnQkFBZ0IsQ0FBQyxPQUFzQixFQUFFLE1BQWMsRUFBRTtNQUN4RCxPQUFPLEdBQXlDLE9BQU8sQ0FBdkQsT0FBTztNQUFFLFlBQVksR0FBMkIsT0FBTyxDQUE5QyxZQUFZO01BQUUsVUFBVSxHQUFlLE9BQU8sQ0FBaEMsVUFBVTtNQUFFLFFBQVEsR0FBSyxPQUFPLENBQXBCLFFBQVE7O0FBRW5ELE1BQUksUUFBUSxJQUFJLFFBQVEsQ0FBQywyQkFBMkIsRUFBRTtBQUNwRCxRQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsMkJBQTJCLENBQUM7QUFDbkQsUUFDRSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsSUFDaEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLElBQ3JCLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxJQUN0QixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksRUFDcEI7QUFDQSxhQUFPLG9CQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsVUFBQSxLQUFLO2VBQUs7QUFDNUIsY0FBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO0FBQ2hCLDJCQUFpQixFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDO0FBQ3ZELGNBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtBQUNoQixrQkFBUSxFQUNOLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsR0FBRyxRQUFRLEdBQUcsU0FBUztTQUNuRTtPQUFDLENBQUMsQ0FBQztLQUNMO0dBQ0Y7O0FBRUQsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQzs7QUFFakUsU0FBTyxvQkFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQUEsS0FBSztXQUFLO0FBQzlCLFVBQUksRUFBRSxLQUFLO0FBQ1gsdUJBQWlCLEVBQWpCLGlCQUFpQjtBQUNqQixjQUFRLEVBQVIsUUFBUTtLQUNUO0dBQUMsQ0FBQyxDQUFDO0NBQ0w7O3FCQUVjLFlBQVc7QUFDeEIsTUFBTSxvQkFBb0IsR0FBRztBQUMzQixZQUFRLEVBQUUsU0FBUztBQUNuQixzQkFBa0IsRUFBRSxtQkFBbUI7Ozs7O0FBS3ZDLHFCQUFpQixFQUFFLENBQUM7QUFDcEIsd0JBQW9CLEVBQUUsS0FBSzs7O0FBRzNCLGtCQUFjLEVBQUEsd0JBQUMsSUFJQSxFQUFpQztVQUg5QyxNQUFNLEdBRE8sSUFJQSxDQUhiLE1BQU07VUFDTixjQUFjLEdBRkQsSUFJQSxDQUZiLGNBQWM7VUFDZCxNQUFNLEdBSE8sSUFJQSxDQURiLE1BQU07O0FBRU4sVUFBTSxNQUFNLEdBQUcsbUJBQU0sTUFBTSxDQUFDOztBQUU1QixVQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxjQUFjLEtBQUssTUFBTSxFQUFFO0FBQy9DLGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBRUQsVUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQ3ZDLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFDdkIsY0FBYyxDQUNmLENBQUMsQ0FBQzs7QUFFSCxVQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZDLFVBQUksS0FBSyxFQUFFO0FBQ1QsY0FBTSxHQUFHLG9CQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO09BQzFDLE1BQU07QUFDTCxjQUFNLEdBQUcsSUFBSSxDQUFDO09BQ2Y7OztBQUdELFVBQUksTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQzdDLGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBRUQsVUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FDckMscUNBQXFDLENBQ3RDLENBQUM7QUFDRixVQUFJLE9BQU8saUJBQWlCLEtBQUssUUFBUSxFQUFFO0FBQ3pDLHlCQUFpQixHQUFHLENBQUMsQ0FBQztPQUN2Qjs7QUFFRCxVQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEVBQUU7QUFDNUMsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxzQkFBSSxnQ0FBZ0MsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVwRSxhQUFPLElBQUksT0FBTyxDQUFDLFVBQUEsT0FBTztlQUN4QixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFDLE9BQU8sRUFBb0I7QUFDbEQsaUJBQU8sT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ25ELENBQUM7T0FBQSxDQUNILENBQUM7S0FDSDtHQUNGLENBQUM7O0FBRUYsU0FBTyxvQkFBb0IsQ0FBQztDQUM3QiIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9hdXRvY29tcGxldGUtcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgeyBsb2cgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHN0b3JlIGZyb20gXCIuL3N0b3JlXCI7XG5cbnR5cGUgQXV0b2NvbXBsZXRlID0ge1xuICBlZGl0b3I6IGF0b20kVGV4dEVkaXRvcixcbiAgYnVmZmVyUG9zaXRpb246IGF0b20kUG9pbnQsXG4gIHByZWZpeDogc3RyaW5nXG59O1xuXG50eXBlIENvbXBsZXRlUmVwbHkgPSB7XG4gIG1hdGNoZXM6IEFycmF5PHN0cmluZz4sXG4gIGN1cnNvcl9zdGFydDogbnVtYmVyLFxuICBjdXJzb3JfZW5kOiBudW1iZXIsXG4gIG1ldGFkYXRhPzoge1xuICAgIF9qdXB5dGVyX3R5cGVzX2V4cGVyaW1lbnRhbD86IEFycmF5PHtcbiAgICAgIHN0YXJ0PzogbnVtYmVyLFxuICAgICAgZW5kPzogbnVtYmVyLFxuICAgICAgdGV4dD86IHN0cmluZyxcbiAgICAgIHR5cGU/OiBzdHJpbmdcbiAgICB9PlxuICB9XG59O1xuXG5jb25zdCBpY29uSFRNTCA9IGA8aW1nIHNyYz0nJHtcbiAgX19kaXJuYW1lXG59Ly4uL3N0YXRpYy9sb2dvLnN2Zycgc3R5bGU9J3dpZHRoOiAxMDAlOyc+YDtcblxuY29uc3QgcmVnZXhlcyA9IHtcbiAgLy8gcHJldHR5IGRvZGd5LCBhZGFwdGVkIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODM5NjY1OFxuICByOiAvKFteXFxkXFxXXXxbLl0pW1xcdy4kXSokLyxcblxuICAvLyBhZGFwdGVkIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3EvNTQ3NDAwOFxuICBweXRob246IC8oW15cXGRcXFddfFtcXHUwMEEwLVxcdUZGRkZdKVtcXHcuXFx1MDBBMC1cXHVGRkZGXSokLyxcblxuICAvLyBhZGFwdGVkIGZyb20gaHR0cDovL3BocC5uZXQvbWFudWFsL2VuL2xhbmd1YWdlLnZhcmlhYmxlcy5iYXNpY3MucGhwXG4gIHBocDogL1skYS16QS1aX1xceDdmLVxceGZmXVthLXpBLVowLTlfXFx4N2YtXFx4ZmZdKiQvXG59O1xuXG5mdW5jdGlvbiBwYXJzZUNvbXBsZXRpb25zKHJlc3VsdHM6IENvbXBsZXRlUmVwbHksIHByZWZpeDogc3RyaW5nKSB7XG4gIGNvbnN0IHsgbWF0Y2hlcywgY3Vyc29yX3N0YXJ0LCBjdXJzb3JfZW5kLCBtZXRhZGF0YSB9ID0gcmVzdWx0cztcblxuICBpZiAobWV0YWRhdGEgJiYgbWV0YWRhdGEuX2p1cHl0ZXJfdHlwZXNfZXhwZXJpbWVudGFsKSB7XG4gICAgY29uc3QgY29tcHMgPSBtZXRhZGF0YS5fanVweXRlcl90eXBlc19leHBlcmltZW50YWw7XG4gICAgaWYgKFxuICAgICAgY29tcHMubGVuZ3RoID4gMCAmJlxuICAgICAgY29tcHNbMF0udGV4dCAhPSBudWxsICYmXG4gICAgICBjb21wc1swXS5zdGFydCAhPSBudWxsICYmXG4gICAgICBjb21wc1swXS5lbmQgIT0gbnVsbFxuICAgICkge1xuICAgICAgcmV0dXJuIF8ubWFwKGNvbXBzLCBtYXRjaCA9PiAoe1xuICAgICAgICB0ZXh0OiBtYXRjaC50ZXh0LFxuICAgICAgICByZXBsYWNlbWVudFByZWZpeDogcHJlZml4LnNsaWNlKG1hdGNoLnN0YXJ0LCBtYXRjaC5lbmQpLFxuICAgICAgICB0eXBlOiBtYXRjaC50eXBlLFxuICAgICAgICBpY29uSFRNTDpcbiAgICAgICAgICAhbWF0Y2gudHlwZSB8fCBtYXRjaC50eXBlID09PSBcIjx1bmtub3duPlwiID8gaWNvbkhUTUwgOiB1bmRlZmluZWRcbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZXBsYWNlbWVudFByZWZpeCA9IHByZWZpeC5zbGljZShjdXJzb3Jfc3RhcnQsIGN1cnNvcl9lbmQpO1xuXG4gIHJldHVybiBfLm1hcChtYXRjaGVzLCBtYXRjaCA9PiAoe1xuICAgIHRleHQ6IG1hdGNoLFxuICAgIHJlcGxhY2VtZW50UHJlZml4LFxuICAgIGljb25IVE1MXG4gIH0pKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGF1dG9jb21wbGV0ZVByb3ZpZGVyID0ge1xuICAgIHNlbGVjdG9yOiBcIi5zb3VyY2VcIixcbiAgICBkaXNhYmxlRm9yU2VsZWN0b3I6IFwiLmNvbW1lbnQsIC5zdHJpbmdcIixcblxuICAgIC8vIGBleGNsdWRlTG93ZXJQcmlvcml0eTogZmFsc2VgIHdvbid0IHN1cHByZXNzIHByb3ZpZGVycyB3aXRoIGxvd2VyXG4gICAgLy8gcHJpb3JpdHkuXG4gICAgLy8gVGhlIGRlZmF1bHQgcHJvdmlkZXIgaGFzIGEgcHJpb3JpdHkgb2YgMC5cbiAgICBpbmNsdXNpb25Qcmlvcml0eTogMSxcbiAgICBleGNsdWRlTG93ZXJQcmlvcml0eTogZmFsc2UsXG5cbiAgICAvLyBSZXF1aXJlZDogUmV0dXJuIGEgcHJvbWlzZSwgYW4gYXJyYXkgb2Ygc3VnZ2VzdGlvbnMsIG9yIG51bGwuXG4gICAgZ2V0U3VnZ2VzdGlvbnMoe1xuICAgICAgZWRpdG9yLFxuICAgICAgYnVmZmVyUG9zaXRpb24sXG4gICAgICBwcmVmaXhcbiAgICB9OiBBdXRvY29tcGxldGUpOiBQcm9taXNlPEFycmF5PE9iamVjdD4+IHwgbnVsbCB7XG4gICAgICBjb25zdCBrZXJuZWwgPSBzdG9yZS5rZXJuZWw7XG5cbiAgICAgIGlmICgha2VybmVsIHx8IGtlcm5lbC5leGVjdXRpb25TdGF0ZSAhPT0gXCJpZGxlXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW1xuICAgICAgICBbYnVmZmVyUG9zaXRpb24ucm93LCAwXSxcbiAgICAgICAgYnVmZmVyUG9zaXRpb25cbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCByZWdleCA9IHJlZ2V4ZXNba2VybmVsLmxhbmd1YWdlXTtcbiAgICAgIGlmIChyZWdleCkge1xuICAgICAgICBwcmVmaXggPSBfLmhlYWQobGluZS5tYXRjaChyZWdleCkpIHx8IFwiXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmVmaXggPSBsaW5lO1xuICAgICAgfVxuXG4gICAgICAvLyByZXR1cm4gaWYgY3Vyc29yIGlzIGF0IHdoaXRlc3BhY2VcbiAgICAgIGlmIChwcmVmaXgudHJpbVJpZ2h0KCkubGVuZ3RoIDwgcHJlZml4Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgbGV0IG1pbmltdW1Xb3JkTGVuZ3RoID0gYXRvbS5jb25maWcuZ2V0KFxuICAgICAgICBcImF1dG9jb21wbGV0ZS1wbHVzLm1pbmltdW1Xb3JkTGVuZ3RoXCJcbiAgICAgICk7XG4gICAgICBpZiAodHlwZW9mIG1pbmltdW1Xb3JkTGVuZ3RoICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgIG1pbmltdW1Xb3JkTGVuZ3RoID0gMztcbiAgICAgIH1cblxuICAgICAgaWYgKHByZWZpeC50cmltKCkubGVuZ3RoIDwgbWluaW11bVdvcmRMZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGxvZyhcImF1dG9jb21wbGV0ZVByb3ZpZGVyOiByZXF1ZXN0OlwiLCBsaW5lLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4KTtcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT5cbiAgICAgICAga2VybmVsLmNvbXBsZXRlKHByZWZpeCwgKHJlc3VsdHM6IENvbXBsZXRlUmVwbHkpID0+IHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShwYXJzZUNvbXBsZXRpb25zKHJlc3VsdHMsIHByZWZpeCkpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGF1dG9jb21wbGV0ZVByb3ZpZGVyO1xufVxuIl19