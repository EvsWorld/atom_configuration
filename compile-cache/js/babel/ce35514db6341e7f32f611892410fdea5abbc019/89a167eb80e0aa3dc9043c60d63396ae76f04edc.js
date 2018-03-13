Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _optionScopes = require('./option-scopes');

var _optionScopes2 = _interopRequireDefault(_optionScopes);

'use babel';

var options = {
  normalizeSlashes: {
    type: 'boolean',
    description: 'Replaces backward slashes with forward slashes on windows (if possible)',
    'default': true
  },
  maxFileCount: {
    type: 'number',
    description: 'The maximum amount of files to be handled',
    'default': 2000
  },
  suggestionPriority: {
    type: 'number',
    description: 'Suggestion priority of this provider. If set to a number larger than or equal to 1, suggestions will be displayed on top of default suggestions.',
    'default': 2
  },
  ignoredNames: {
    type: 'boolean',
    'default': true,
    description: 'Ignore items matched by the `Ignore Names` core option.'
  },
  ignoreSubmodules: {
    type: 'boolean',
    'default': false,
    description: 'Ignore submodule directories.'
  },
  ignoredPatterns: {
    type: 'array',
    'default': [],
    items: {
      type: 'string'
    },
    description: 'Ignore additional file path patterns.'
  },
  ignoreBuiltinScopes: {
    type: 'boolean',
    'default': false,
    description: 'Ignore built-in scopes and use only scopes from user configuration.'
  },
  scopes: {
    type: 'array',
    'default': [],
    items: {
      type: 'object',
      properties: {
        scopes: {
          type: ['array'],
          items: {
            type: 'string'
          }
        },
        prefixes: {
          type: ['array'],
          items: {
            type: 'string'
          }
        },
        extensions: {
          type: ['array'],
          items: {
            type: 'string'
          }
        },
        relative: {
          type: 'boolean',
          'default': true
        },
        replaceOnInsert: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: ['string', 'string']
            }
          }
        }
      }
    }
  }
};

for (var key in _optionScopes2['default']) {
  options[key] = {
    type: 'boolean',
    'default': false
  };
}

exports['default'] = options;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9jb25maWcvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OzRCQUV5QixpQkFBaUI7Ozs7QUFGMUMsV0FBVyxDQUFBOztBQUlYLElBQU0sT0FBTyxHQUFHO0FBQ2Qsa0JBQWdCLEVBQUU7QUFDaEIsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFXLEVBQUUseUVBQXlFO0FBQ3RGLGVBQVMsSUFBSTtHQUNkO0FBQ0QsY0FBWSxFQUFFO0FBQ1osUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFXLEVBQUUsMkNBQTJDO0FBQ3hELGVBQVMsSUFBSTtHQUNkO0FBQ0Qsb0JBQWtCLEVBQUU7QUFDbEIsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFXLEVBQUUsa0pBQWtKO0FBQy9KLGVBQVMsQ0FBQztHQUNYO0FBQ0QsY0FBWSxFQUFFO0FBQ1osUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixlQUFXLEVBQUUseURBQXlEO0dBQ3ZFO0FBQ0Qsa0JBQWdCLEVBQUU7QUFDaEIsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxlQUFXLEVBQUUsK0JBQStCO0dBQzdDO0FBQ0QsaUJBQWUsRUFBRTtBQUNmLFFBQUksRUFBRSxPQUFPO0FBQ2IsZUFBUyxFQUFFO0FBQ1gsU0FBSyxFQUFFO0FBQ0wsVUFBSSxFQUFFLFFBQVE7S0FDZjtBQUNELGVBQVcsRUFBRSx1Q0FBdUM7R0FDckQ7QUFDRCxxQkFBbUIsRUFBRTtBQUNuQixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLGVBQVcsRUFBRSxxRUFBcUU7R0FDbkY7QUFDRCxRQUFNLEVBQUU7QUFDTixRQUFJLEVBQUUsT0FBTztBQUNiLGVBQVMsRUFBRTtBQUNYLFNBQUssRUFBRTtBQUNMLFVBQUksRUFBRSxRQUFRO0FBQ2QsZ0JBQVUsRUFBRTtBQUNWLGNBQU0sRUFBRTtBQUNOLGNBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUNmLGVBQUssRUFBRTtBQUNMLGdCQUFJLEVBQUUsUUFBUTtXQUNmO1NBQ0Y7QUFDRCxnQkFBUSxFQUFFO0FBQ1IsY0FBSSxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQ2YsZUFBSyxFQUFFO0FBQ0wsZ0JBQUksRUFBRSxRQUFRO1dBQ2Y7U0FDRjtBQUNELGtCQUFVLEVBQUU7QUFDVixjQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFDZixlQUFLLEVBQUU7QUFDTCxnQkFBSSxFQUFFLFFBQVE7V0FDZjtTQUNGO0FBQ0QsZ0JBQVEsRUFBRTtBQUNSLGNBQUksRUFBRSxTQUFTO0FBQ2YscUJBQVMsSUFBSTtTQUNkO0FBQ0QsdUJBQWUsRUFBRTtBQUNmLGNBQUksRUFBRSxPQUFPO0FBQ2IsZUFBSyxFQUFFO0FBQ0wsZ0JBQUksRUFBRSxPQUFPO0FBQ2IsaUJBQUssRUFBRTtBQUNMLGtCQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO2FBQzNCO1dBQ0Y7U0FDRjtPQUNGO0tBQ0Y7R0FDRjtDQUNGLENBQUE7O0FBRUQsS0FBSyxJQUFJLEdBQUcsK0JBQWtCO0FBQzVCLFNBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRztBQUNiLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0dBQ2YsQ0FBQTtDQUNGOztxQkFFYyxPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9jb25maWcvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgT3B0aW9uU2NvcGVzIGZyb20gJy4vb3B0aW9uLXNjb3BlcydcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgbm9ybWFsaXplU2xhc2hlczoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZXNjcmlwdGlvbjogJ1JlcGxhY2VzIGJhY2t3YXJkIHNsYXNoZXMgd2l0aCBmb3J3YXJkIHNsYXNoZXMgb24gd2luZG93cyAoaWYgcG9zc2libGUpJyxcbiAgICBkZWZhdWx0OiB0cnVlXG4gIH0sXG4gIG1heEZpbGVDb3VudDoge1xuICAgIHR5cGU6ICdudW1iZXInLFxuICAgIGRlc2NyaXB0aW9uOiAnVGhlIG1heGltdW0gYW1vdW50IG9mIGZpbGVzIHRvIGJlIGhhbmRsZWQnLFxuICAgIGRlZmF1bHQ6IDIwMDBcbiAgfSxcbiAgc3VnZ2VzdGlvblByaW9yaXR5OiB7XG4gICAgdHlwZTogJ251bWJlcicsXG4gICAgZGVzY3JpcHRpb246ICdTdWdnZXN0aW9uIHByaW9yaXR5IG9mIHRoaXMgcHJvdmlkZXIuIElmIHNldCB0byBhIG51bWJlciBsYXJnZXIgdGhhbiBvciBlcXVhbCB0byAxLCBzdWdnZXN0aW9ucyB3aWxsIGJlIGRpc3BsYXllZCBvbiB0b3Agb2YgZGVmYXVsdCBzdWdnZXN0aW9ucy4nLFxuICAgIGRlZmF1bHQ6IDJcbiAgfSxcbiAgaWdub3JlZE5hbWVzOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgZGVzY3JpcHRpb246ICdJZ25vcmUgaXRlbXMgbWF0Y2hlZCBieSB0aGUgYElnbm9yZSBOYW1lc2AgY29yZSBvcHRpb24uJ1xuICB9LFxuICBpZ25vcmVTdWJtb2R1bGVzOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGRlc2NyaXB0aW9uOiAnSWdub3JlIHN1Ym1vZHVsZSBkaXJlY3Rvcmllcy4nXG4gIH0sXG4gIGlnbm9yZWRQYXR0ZXJuczoge1xuICAgIHR5cGU6ICdhcnJheScsXG4gICAgZGVmYXVsdDogW10sXG4gICAgaXRlbXM6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgfSxcbiAgICBkZXNjcmlwdGlvbjogJ0lnbm9yZSBhZGRpdGlvbmFsIGZpbGUgcGF0aCBwYXR0ZXJucy4nXG4gIH0sXG4gIGlnbm9yZUJ1aWx0aW5TY29wZXM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgZGVzY3JpcHRpb246ICdJZ25vcmUgYnVpbHQtaW4gc2NvcGVzIGFuZCB1c2Ugb25seSBzY29wZXMgZnJvbSB1c2VyIGNvbmZpZ3VyYXRpb24uJ1xuICB9LFxuICBzY29wZXM6IHtcbiAgICB0eXBlOiAnYXJyYXknLFxuICAgIGRlZmF1bHQ6IFtdLFxuICAgIGl0ZW1zOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc2NvcGVzOiB7XG4gICAgICAgICAgdHlwZTogWydhcnJheSddLFxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcHJlZml4ZXM6IHtcbiAgICAgICAgICB0eXBlOiBbJ2FycmF5J10sXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBleHRlbnNpb25zOiB7XG4gICAgICAgICAgdHlwZTogWydhcnJheSddLFxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVsYXRpdmU6IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICByZXBsYWNlT25JbnNlcnQ6IHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogWydzdHJpbmcnLCAnc3RyaW5nJ11cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZm9yIChsZXQga2V5IGluIE9wdGlvblNjb3Blcykge1xuICBvcHRpb25zW2tleV0gPSB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgb3B0aW9uc1xuIl19