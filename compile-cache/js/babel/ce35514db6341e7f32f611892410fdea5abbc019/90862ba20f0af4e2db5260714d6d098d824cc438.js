function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _grammarUtils = require('../grammar-utils');

var _grammarUtils2 = _interopRequireDefault(_grammarUtils);

'use babel';

var babel = _path2['default'].join(__dirname, '../..', 'node_modules', '.bin', 'babel');

var _args = function _args(_ref) {
  var filepath = _ref.filepath;

  var cmd = '\'' + babel + '\' --filename \'' + babel + '\' < \'' + filepath + '\'| node';
  return _grammarUtils2['default'].formatArgs(cmd);
};
exports.Dart = {
  'Selection Based': {
    command: 'dart',
    args: function args(context) {
      var code = context.getCode();
      var tmpFile = _grammarUtils2['default'].createTempFileWithCode(code, '.dart');
      return [tmpFile];
    }
  },
  'File Based': {
    command: 'dart',
    args: function args(_ref2) {
      var filepath = _ref2.filepath;
      return [filepath];
    }
  }
};
exports.JavaScript = {
  'Selection Based': {
    command: _grammarUtils.command,
    args: function args(context) {
      var code = context.getCode();
      var filepath = _grammarUtils2['default'].createTempFileWithCode(code, '.js');
      return _args({ filepath: filepath });
    }
  },
  'File Based': { command: _grammarUtils.command, args: _args }
};
exports['Babel ES6 JavaScript'] = exports.JavaScript;
exports['JavaScript with JSX'] = exports.JavaScript;

exports['JavaScript for Automation (JXA)'] = {
  'Selection Based': {
    command: 'osascript',
    args: function args(context) {
      return ['-l', 'JavaScript', '-e', context.getCode()];
    }
  },
  'File Based': {
    command: 'osascript',
    args: function args(_ref3) {
      var filepath = _ref3.filepath;
      return ['-l', 'JavaScript', filepath];
    }
  }
};
exports.TypeScript = {
  'Selection Based': {
    command: 'ts-node',
    args: function args(context) {
      return ['-e', context.getCode()];
    }
  },
  'File Based': {
    command: 'ts-node',
    args: function args(_ref4) {
      var filepath = _ref4.filepath;
      return [filepath];
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFycy9qYXZhc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O29CQUVpQixNQUFNOzs7OzRCQUNlLGtCQUFrQjs7OztBQUh4RCxXQUFXLENBQUM7O0FBS1osSUFBTSxLQUFLLEdBQUcsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFN0UsSUFBTSxLQUFJLEdBQUcsU0FBUCxLQUFJLENBQUksSUFBWSxFQUFLO01BQWYsUUFBUSxHQUFWLElBQVksQ0FBVixRQUFROztBQUN0QixNQUFNLEdBQUcsVUFBTyxLQUFLLHdCQUFpQixLQUFLLGVBQVEsUUFBUSxhQUFTLENBQUM7QUFDckUsU0FBTywwQkFBYSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDckMsQ0FBQztBQUNGLE9BQU8sQ0FBQyxJQUFJLEdBQUc7QUFDYixtQkFBaUIsRUFBRTtBQUNqQixXQUFPLEVBQUUsTUFBTTtBQUNmLFFBQUksRUFBRSxjQUFDLE9BQU8sRUFBSztBQUNqQixVQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDL0IsVUFBTSxPQUFPLEdBQUcsMEJBQWEsc0JBQXNCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ25FLGFBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNsQjtHQUNGO0FBQ0QsY0FBWSxFQUFFO0FBQ1osV0FBTyxFQUFFLE1BQU07QUFDZixRQUFJLEVBQUUsY0FBQyxLQUFZO1VBQVYsUUFBUSxHQUFWLEtBQVksQ0FBVixRQUFRO2FBQU8sQ0FBQyxRQUFRLENBQUM7S0FBQTtHQUNuQztDQUNGLENBQUM7QUFDRixPQUFPLENBQUMsVUFBVSxHQUFHO0FBQ25CLG1CQUFpQixFQUFFO0FBQ2pCLFdBQU8sdUJBQUE7QUFDUCxRQUFJLEVBQUUsY0FBQyxPQUFPLEVBQUs7QUFDakIsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQy9CLFVBQU0sUUFBUSxHQUFHLDBCQUFhLHNCQUFzQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNsRSxhQUFPLEtBQUksQ0FBQyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFDO0tBQzNCO0dBQ0Y7QUFDRCxjQUFZLEVBQUUsRUFBRSxPQUFPLHVCQUFBLEVBQUUsSUFBSSxFQUFKLEtBQUksRUFBRTtDQUNoQyxDQUFDO0FBQ0YsT0FBTyxDQUFDLHNCQUFzQixDQUFDLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztBQUNyRCxPQUFPLENBQUMscUJBQXFCLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDOztBQUVwRCxPQUFPLENBQUMsaUNBQWlDLENBQUMsR0FBRztBQUMzQyxtQkFBaUIsRUFBRTtBQUNqQixXQUFPLEVBQUUsV0FBVztBQUNwQixRQUFJLEVBQUUsY0FBQSxPQUFPO2FBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7S0FBQTtHQUMvRDtBQUNELGNBQVksRUFBRTtBQUNaLFdBQU8sRUFBRSxXQUFXO0FBQ3BCLFFBQUksRUFBRSxjQUFDLEtBQVk7VUFBVixRQUFRLEdBQVYsS0FBWSxDQUFWLFFBQVE7YUFBTyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDO0tBQUE7R0FDdkQ7Q0FDRixDQUFDO0FBQ0YsT0FBTyxDQUFDLFVBQVUsR0FBRztBQUNuQixtQkFBaUIsRUFBRTtBQUNqQixXQUFPLEVBQUUsU0FBUztBQUNsQixRQUFJLEVBQUUsY0FBQSxPQUFPO2FBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQUE7R0FDM0M7QUFDRCxjQUFZLEVBQUU7QUFDWixXQUFPLEVBQUUsU0FBUztBQUNsQixRQUFJLEVBQUUsY0FBQyxLQUFZO1VBQVYsUUFBUSxHQUFWLEtBQVksQ0FBVixRQUFRO2FBQU8sQ0FBQyxRQUFRLENBQUM7S0FBQTtHQUNuQztDQUNGLENBQUMiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXJzL2phdmFzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgR3JhbW1hclV0aWxzLCB7IGNvbW1hbmQgfSBmcm9tICcuLi9ncmFtbWFyLXV0aWxzJztcblxuY29uc3QgYmFiZWwgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4nLCAnbm9kZV9tb2R1bGVzJywgJy5iaW4nLCAnYmFiZWwnKTtcblxuY29uc3QgYXJncyA9ICh7IGZpbGVwYXRoIH0pID0+IHtcbiAgY29uc3QgY21kID0gYCcke2JhYmVsfScgLS1maWxlbmFtZSAnJHtiYWJlbH0nIDwgJyR7ZmlsZXBhdGh9J3wgbm9kZWA7XG4gIHJldHVybiBHcmFtbWFyVXRpbHMuZm9ybWF0QXJncyhjbWQpO1xufTtcbmV4cG9ydHMuRGFydCA9IHtcbiAgJ1NlbGVjdGlvbiBCYXNlZCc6IHtcbiAgICBjb21tYW5kOiAnZGFydCcsXG4gICAgYXJnczogKGNvbnRleHQpID0+IHtcbiAgICAgIGNvbnN0IGNvZGUgPSBjb250ZXh0LmdldENvZGUoKTtcbiAgICAgIGNvbnN0IHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCAnLmRhcnQnKTtcbiAgICAgIHJldHVybiBbdG1wRmlsZV07XG4gICAgfSxcbiAgfSxcbiAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgY29tbWFuZDogJ2RhcnQnLFxuICAgIGFyZ3M6ICh7IGZpbGVwYXRoIH0pID0+IFtmaWxlcGF0aF0sXG4gIH0sXG59O1xuZXhwb3J0cy5KYXZhU2NyaXB0ID0ge1xuICAnU2VsZWN0aW9uIEJhc2VkJzoge1xuICAgIGNvbW1hbmQsXG4gICAgYXJnczogKGNvbnRleHQpID0+IHtcbiAgICAgIGNvbnN0IGNvZGUgPSBjb250ZXh0LmdldENvZGUoKTtcbiAgICAgIGNvbnN0IGZpbGVwYXRoID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgJy5qcycpO1xuICAgICAgcmV0dXJuIGFyZ3MoeyBmaWxlcGF0aCB9KTtcbiAgICB9LFxuICB9LFxuICAnRmlsZSBCYXNlZCc6IHsgY29tbWFuZCwgYXJncyB9LFxufTtcbmV4cG9ydHNbJ0JhYmVsIEVTNiBKYXZhU2NyaXB0J10gPSBleHBvcnRzLkphdmFTY3JpcHQ7XG5leHBvcnRzWydKYXZhU2NyaXB0IHdpdGggSlNYJ10gPSBleHBvcnRzLkphdmFTY3JpcHQ7XG5cbmV4cG9ydHNbJ0phdmFTY3JpcHQgZm9yIEF1dG9tYXRpb24gKEpYQSknXSA9IHtcbiAgJ1NlbGVjdGlvbiBCYXNlZCc6IHtcbiAgICBjb21tYW5kOiAnb3Nhc2NyaXB0JyxcbiAgICBhcmdzOiBjb250ZXh0ID0+IFsnLWwnLCAnSmF2YVNjcmlwdCcsICctZScsIGNvbnRleHQuZ2V0Q29kZSgpXSxcbiAgfSxcbiAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgY29tbWFuZDogJ29zYXNjcmlwdCcsXG4gICAgYXJnczogKHsgZmlsZXBhdGggfSkgPT4gWyctbCcsICdKYXZhU2NyaXB0JywgZmlsZXBhdGhdLFxuICB9LFxufTtcbmV4cG9ydHMuVHlwZVNjcmlwdCA9IHtcbiAgJ1NlbGVjdGlvbiBCYXNlZCc6IHtcbiAgICBjb21tYW5kOiAndHMtbm9kZScsXG4gICAgYXJnczogY29udGV4dCA9PiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldLFxuICB9LFxuICAnRmlsZSBCYXNlZCc6IHtcbiAgICBjb21tYW5kOiAndHMtbm9kZScsXG4gICAgYXJnczogKHsgZmlsZXBhdGggfSkgPT4gW2ZpbGVwYXRoXSxcbiAgfSxcbn07XG4iXX0=