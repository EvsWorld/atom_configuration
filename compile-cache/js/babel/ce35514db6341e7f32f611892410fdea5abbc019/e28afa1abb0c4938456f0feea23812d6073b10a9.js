'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var defaultProjectConfig = {

  ecmaVersion: 6,
  libs: [],
  loadEagerly: [],
  dontLoad: ['node_modules/**'],
  plugins: {

    doc_comment: true
  }
};

exports.defaultProjectConfig = defaultProjectConfig;
var defaultServerConfig = {

  ecmaVersion: 6,
  libs: [],
  loadEagerly: [],
  dontLoad: ['node_modules/**'],
  plugins: {

    doc_comment: true
  },
  dependencyBudget: 20000,
  ecmaScript: true
};

exports.defaultServerConfig = defaultServerConfig;
var ecmaVersions = [5, 6, 7];

exports.ecmaVersions = ecmaVersions;
var availableLibs = ['browser', 'chai', 'jquery', 'underscore'];

exports.availableLibs = availableLibs;
var availablePlugins = {

  complete_strings: {

    maxLength: 15
  },
  doc_comment: {

    fullDocs: true,
    strong: false
  },
  node: {

    dontLoad: '',
    load: '',
    modules: ''
  },
  node_resolve: {},
  modules: {

    dontLoad: '',
    load: '',
    modules: ''
  },
  es_modules: {},
  angular: {},
  requirejs: {

    baseURL: '',
    paths: '',
    override: ''
  },
  commonjs: {}
};
exports.availablePlugins = availablePlugins;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvY29uZmlnL3Rlcm4tY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7QUFFTCxJQUFNLG9CQUFvQixHQUFHOztBQUVsQyxhQUFXLEVBQUUsQ0FBQztBQUNkLE1BQUksRUFBRSxFQUFFO0FBQ1IsYUFBVyxFQUFFLEVBQUU7QUFDZixVQUFRLEVBQUUsQ0FDUixpQkFBaUIsQ0FDbEI7QUFDRCxTQUFPLEVBQUU7O0FBRVAsZUFBVyxFQUFFLElBQUk7R0FDbEI7Q0FDRixDQUFDOzs7QUFFSyxJQUFNLG1CQUFtQixHQUFHOztBQUVqQyxhQUFXLEVBQUUsQ0FBQztBQUNkLE1BQUksRUFBRSxFQUFFO0FBQ1IsYUFBVyxFQUFFLEVBQUU7QUFDZixVQUFRLEVBQUUsQ0FDUixpQkFBaUIsQ0FDbEI7QUFDRCxTQUFPLEVBQUU7O0FBRVAsZUFBVyxFQUFFLElBQUk7R0FDbEI7QUFDRCxrQkFBZ0IsRUFBRSxLQUFLO0FBQ3ZCLFlBQVUsRUFBRSxJQUFJO0NBQ2pCLENBQUM7OztBQUVLLElBQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBRS9CLElBQU0sYUFBYSxHQUFHLENBRTNCLFNBQVMsRUFDVCxNQUFNLEVBQ04sUUFBUSxFQUNSLFlBQVksQ0FDYixDQUFDOzs7QUFFSyxJQUFNLGdCQUFnQixHQUFHOztBQUU5QixrQkFBZ0IsRUFBRTs7QUFFaEIsYUFBUyxFQUFFLEVBQUU7R0FDZDtBQUNELGFBQVcsRUFBRTs7QUFFWCxZQUFRLEVBQUUsSUFBSTtBQUNkLFVBQU0sRUFBRSxLQUFLO0dBQ2Q7QUFDRCxNQUFJLEVBQUU7O0FBRUosWUFBUSxFQUFFLEVBQUU7QUFDWixRQUFJLEVBQUUsRUFBRTtBQUNSLFdBQU8sRUFBRSxFQUFFO0dBQ1o7QUFDRCxjQUFZLEVBQUUsRUFBRTtBQUNoQixTQUFPLEVBQUU7O0FBRVAsWUFBUSxFQUFFLEVBQUU7QUFDWixRQUFJLEVBQUUsRUFBRTtBQUNSLFdBQU8sRUFBRSxFQUFFO0dBQ1o7QUFDRCxZQUFVLEVBQUUsRUFBRTtBQUNkLFNBQU8sRUFBRSxFQUFFO0FBQ1gsV0FBUyxFQUFFOztBQUVULFdBQU8sRUFBRSxFQUFFO0FBQ1gsU0FBSyxFQUFFLEVBQUU7QUFDVCxZQUFRLEVBQUUsRUFBRTtHQUNiO0FBQ0QsVUFBUSxFQUFFLEVBQUU7Q0FDYixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvY29uZmlnL3Rlcm4tY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0UHJvamVjdENvbmZpZyA9IHtcblxuICBlY21hVmVyc2lvbjogNixcbiAgbGliczogW10sXG4gIGxvYWRFYWdlcmx5OiBbXSxcbiAgZG9udExvYWQ6IFtcbiAgICAnbm9kZV9tb2R1bGVzLyoqJ1xuICBdLFxuICBwbHVnaW5zOiB7XG5cbiAgICBkb2NfY29tbWVudDogdHJ1ZVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdFNlcnZlckNvbmZpZyA9IHtcblxuICBlY21hVmVyc2lvbjogNixcbiAgbGliczogW10sXG4gIGxvYWRFYWdlcmx5OiBbXSxcbiAgZG9udExvYWQ6IFtcbiAgICAnbm9kZV9tb2R1bGVzLyoqJ1xuICBdLFxuICBwbHVnaW5zOiB7XG5cbiAgICBkb2NfY29tbWVudDogdHJ1ZVxuICB9LFxuICBkZXBlbmRlbmN5QnVkZ2V0OiAyMDAwMCxcbiAgZWNtYVNjcmlwdDogdHJ1ZVxufTtcblxuZXhwb3J0IGNvbnN0IGVjbWFWZXJzaW9ucyA9IFs1LCA2LCA3XTtcblxuZXhwb3J0IGNvbnN0IGF2YWlsYWJsZUxpYnMgPSBbXG5cbiAgJ2Jyb3dzZXInLFxuICAnY2hhaScsXG4gICdqcXVlcnknLFxuICAndW5kZXJzY29yZSdcbl07XG5cbmV4cG9ydCBjb25zdCBhdmFpbGFibGVQbHVnaW5zID0ge1xuXG4gIGNvbXBsZXRlX3N0cmluZ3M6IHtcblxuICAgIG1heExlbmd0aDogMTVcbiAgfSxcbiAgZG9jX2NvbW1lbnQ6IHtcblxuICAgIGZ1bGxEb2NzOiB0cnVlLFxuICAgIHN0cm9uZzogZmFsc2VcbiAgfSxcbiAgbm9kZToge1xuXG4gICAgZG9udExvYWQ6ICcnLFxuICAgIGxvYWQ6ICcnLFxuICAgIG1vZHVsZXM6ICcnXG4gIH0sXG4gIG5vZGVfcmVzb2x2ZToge30sXG4gIG1vZHVsZXM6IHtcblxuICAgIGRvbnRMb2FkOiAnJyxcbiAgICBsb2FkOiAnJyxcbiAgICBtb2R1bGVzOiAnJ1xuICB9LFxuICBlc19tb2R1bGVzOiB7fSxcbiAgYW5ndWxhcjoge30sXG4gIHJlcXVpcmVqczoge1xuXG4gICAgYmFzZVVSTDogJycsXG4gICAgcGF0aHM6ICcnLFxuICAgIG92ZXJyaWRlOiAnJ1xuICB9LFxuICBjb21tb25qczoge31cbn07XG4iXX0=