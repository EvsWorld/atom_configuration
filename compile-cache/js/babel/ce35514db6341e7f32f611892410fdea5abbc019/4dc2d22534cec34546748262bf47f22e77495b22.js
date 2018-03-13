Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atomClockView = require('./atom-clock-view');

var _atomClockView2 = _interopRequireDefault(_atomClockView);

'use babel';

exports['default'] = {

  config: {
    dateFormat: {
      type: 'string',
      title: 'Time format',
      description: 'Specify the time format. [Here](http://momentjs.com/docs/#/displaying/format/) you can find all the available formats.',
      'default': 'H:mm',
      order: 1
    }, locale: {
      type: 'string',
      title: 'Locale',
      description: 'Specify the time locale. [Here](https://github.com/moment/moment/tree/master/locale) you can find all the available locales.',
      'default': 'en',
      order: 2
    }, refreshInterval: {
      type: 'integer',
      title: 'Clock interval',
      description: 'Specify the refresh interval (in seconds) for the plugin to evaluate the date.',
      'default': 60,
      minimum: 1,
      order: 3
    }, showTooltip: {
      type: 'boolean',
      title: 'Enable tooltip',
      description: 'Enables a customisable tooltip when you hover over the time.',
      'default': false,
      order: 4
    }, tooltipDateFormat: {
      type: 'string',
      title: 'Tooltip time format',
      description: 'Specify the time format in the tooltip. [Here](http://momentjs.com/docs/#/displaying/format/) you can find all the available formats.',
      'default': 'LLLL',
      order: 5
    }, showUTC: {
      type: 'boolean',
      title: 'Display UTC time',
      description: 'Use UTC to display the time instead of local time.',
      'default': false,
      order: 6
    }, showClockIcon: {
      type: 'boolean',
      title: 'Icon clock',
      description: 'Show a clock icon next to the time in the status bar.',
      'default': false,
      order: 7
    }
  },

  activate: function activate(state) {},

  deactivate: function deactivate() {
    if (this.atomClockView) this.atomClockView.destroy();
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.atomClockView = new _atomClockView2['default'](statusBar);
    this.atomClockView.start();
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS1jbG9jay9saWIvYXRvbS1jbG9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7NkJBRTBCLG1CQUFtQjs7OztBQUY3QyxXQUFXLENBQUM7O3FCQUlHOztBQUViLFFBQU0sRUFBRTtBQUNOLGNBQVUsRUFBRTtBQUNWLFVBQUksRUFBRSxRQUFRO0FBQ2QsV0FBSyxFQUFFLGFBQWE7QUFDcEIsaUJBQVcsRUFBRSx3SEFBd0g7QUFDckksaUJBQVMsTUFBTTtBQUNmLFdBQUssRUFBRSxDQUFDO0tBQ1QsRUFBRSxNQUFNLEVBQUU7QUFDVCxVQUFJLEVBQUUsUUFBUTtBQUNkLFdBQUssRUFBRSxRQUFRO0FBQ2YsaUJBQVcsRUFBRSw4SEFBOEg7QUFDM0ksaUJBQVMsSUFBSTtBQUNiLFdBQUssRUFBRSxDQUFDO0tBQ1QsRUFBRSxlQUFlLEVBQUU7QUFDbEIsVUFBSSxFQUFFLFNBQVM7QUFDZixXQUFLLEVBQUUsZ0JBQWdCO0FBQ3ZCLGlCQUFXLEVBQUUsZ0ZBQWdGO0FBQzdGLGlCQUFTLEVBQUU7QUFDWCxhQUFPLEVBQUUsQ0FBQztBQUNWLFdBQUssRUFBRSxDQUFDO0tBQ1QsRUFBRSxXQUFXLEVBQUU7QUFDZCxVQUFJLEVBQUUsU0FBUztBQUNmLFdBQUssRUFBRSxnQkFBZ0I7QUFDdkIsaUJBQVcsRUFBRSw4REFBOEQ7QUFDM0UsaUJBQVMsS0FBSztBQUNkLFdBQUssRUFBRSxDQUFDO0tBQ1QsRUFBRSxpQkFBaUIsRUFBRTtBQUNwQixVQUFJLEVBQUUsUUFBUTtBQUNkLFdBQUssRUFBRSxxQkFBcUI7QUFDNUIsaUJBQVcsRUFBRSx1SUFBdUk7QUFDcEosaUJBQVMsTUFBTTtBQUNmLFdBQUssRUFBRSxDQUFDO0tBQ1QsRUFBRSxPQUFPLEVBQUU7QUFDVixVQUFJLEVBQUUsU0FBUztBQUNmLFdBQUssRUFBRSxrQkFBa0I7QUFDekIsaUJBQVcsRUFBRSxvREFBb0Q7QUFDakUsaUJBQVMsS0FBSztBQUNkLFdBQUssRUFBRSxDQUFDO0tBQ1QsRUFBRSxhQUFhLEVBQUU7QUFDaEIsVUFBSSxFQUFFLFNBQVM7QUFDZixXQUFLLEVBQUUsWUFBWTtBQUNuQixpQkFBVyxFQUFFLHVEQUF1RDtBQUNwRSxpQkFBUyxLQUFLO0FBQ2QsV0FBSyxFQUFFLENBQUM7S0FDVDtHQUNGOztBQUVELFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUUsRUFBRTs7QUFFbEIsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxJQUFJLENBQUMsYUFBYSxFQUNwQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQy9COztBQUVELGtCQUFnQixFQUFBLDBCQUFDLFNBQVMsRUFBRTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUFrQixTQUFTLENBQUMsQ0FBQTtBQUNqRCxRQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFBO0dBQzNCOztDQUVGIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS1jbG9jay9saWIvYXRvbS1jbG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgQXRvbUNsb2NrVmlldyBmcm9tICcuL2F0b20tY2xvY2stdmlldydcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGNvbmZpZzoge1xuICAgIGRhdGVGb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgdGl0bGU6ICdUaW1lIGZvcm1hdCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1NwZWNpZnkgdGhlIHRpbWUgZm9ybWF0LiBbSGVyZV0oaHR0cDovL21vbWVudGpzLmNvbS9kb2NzLyMvZGlzcGxheWluZy9mb3JtYXQvKSB5b3UgY2FuIGZpbmQgYWxsIHRoZSBhdmFpbGFibGUgZm9ybWF0cy4nLFxuICAgICAgZGVmYXVsdDogJ0g6bW0nLFxuICAgICAgb3JkZXI6IDFcbiAgICB9LCBsb2NhbGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgdGl0bGU6ICdMb2NhbGUnLFxuICAgICAgZGVzY3JpcHRpb246ICdTcGVjaWZ5IHRoZSB0aW1lIGxvY2FsZS4gW0hlcmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L3RyZWUvbWFzdGVyL2xvY2FsZSkgeW91IGNhbiBmaW5kIGFsbCB0aGUgYXZhaWxhYmxlIGxvY2FsZXMuJyxcbiAgICAgIGRlZmF1bHQ6ICdlbicsXG4gICAgICBvcmRlcjogMlxuICAgIH0sIHJlZnJlc2hJbnRlcnZhbDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgdGl0bGU6ICdDbG9jayBpbnRlcnZhbCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1NwZWNpZnkgdGhlIHJlZnJlc2ggaW50ZXJ2YWwgKGluIHNlY29uZHMpIGZvciB0aGUgcGx1Z2luIHRvIGV2YWx1YXRlIHRoZSBkYXRlLicsXG4gICAgICBkZWZhdWx0OiA2MCxcbiAgICAgIG1pbmltdW06IDEsXG4gICAgICBvcmRlcjogM1xuICAgIH0sIHNob3dUb29sdGlwOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICB0aXRsZTogJ0VuYWJsZSB0b29sdGlwJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5hYmxlcyBhIGN1c3RvbWlzYWJsZSB0b29sdGlwIHdoZW4geW91IGhvdmVyIG92ZXIgdGhlIHRpbWUuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgb3JkZXI6IDRcbiAgICB9LCB0b29sdGlwRGF0ZUZvcm1hdDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICB0aXRsZTogJ1Rvb2x0aXAgdGltZSBmb3JtYXQnLFxuICAgICAgZGVzY3JpcHRpb246ICdTcGVjaWZ5IHRoZSB0aW1lIGZvcm1hdCBpbiB0aGUgdG9vbHRpcC4gW0hlcmVdKGh0dHA6Ly9tb21lbnRqcy5jb20vZG9jcy8jL2Rpc3BsYXlpbmcvZm9ybWF0LykgeW91IGNhbiBmaW5kIGFsbCB0aGUgYXZhaWxhYmxlIGZvcm1hdHMuJyxcbiAgICAgIGRlZmF1bHQ6ICdMTExMJyxcbiAgICAgIG9yZGVyOiA1XG4gICAgfSwgc2hvd1VUQzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgdGl0bGU6ICdEaXNwbGF5IFVUQyB0aW1lJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVXNlIFVUQyB0byBkaXNwbGF5IHRoZSB0aW1lIGluc3RlYWQgb2YgbG9jYWwgdGltZS4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBvcmRlcjogNlxuICAgIH0sIHNob3dDbG9ja0ljb246IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIHRpdGxlOiAnSWNvbiBjbG9jaycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1Nob3cgYSBjbG9jayBpY29uIG5leHQgdG8gdGhlIHRpbWUgaW4gdGhlIHN0YXR1cyBiYXIuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgb3JkZXI6IDdcbiAgICB9XG4gIH0sXG5cbiAgYWN0aXZhdGUoc3RhdGUpIHt9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgaWYgKHRoaXMuYXRvbUNsb2NrVmlldylcbiAgICAgIHRoaXMuYXRvbUNsb2NrVmlldy5kZXN0cm95KClcbiAgfSxcblxuICBjb25zdW1lU3RhdHVzQmFyKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuYXRvbUNsb2NrVmlldyA9IG5ldyBBdG9tQ2xvY2tWaWV3KHN0YXR1c0JhcilcbiAgICB0aGlzLmF0b21DbG9ja1ZpZXcuc3RhcnQoKVxuICB9XG5cbn1cbiJdfQ==