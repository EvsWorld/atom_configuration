'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = [{
  scopes: ['source.js', 'source.js.jsx', 'source.coffee', 'source.coffee.jsx', 'source.ts', 'source.tsx'],
  prefixes: ['import\\s+.*?from\\s+[\'"]', // import foo from './foo'
  'import\\s+[\'"]', // import './foo'
  'require\\([\'"]', // require('./foo')
  'define\\(\\[?[\'"]' // define(['./foo']) or define('./foo')
  ],
  extensions: ['js', 'jsx', 'ts', 'tsx', 'coffee', 'json'],
  relative: true,
  replaceOnInsert: [['([\\/]?index)?\\.jsx?$', ''], ['([\\/]?index)?\\.ts$', ''], ['([\\/]?index)?\\.coffee$', '']]
}, {
  scopes: ['text.html.vue'],
  prefixes: ['import\\s+.*?from\\s+[\'"]', // import foo from './foo'
  'import\\s+[\'"]', // import './foo'
  'require\\([\'"]', // require('./foo')
  'define\\(\\[?[\'"]' // define(['./foo']) or define('./foo')
  ],
  extensions: ['js', 'jsx', 'vue', 'ts', 'tsx', 'coffee'],
  relative: true,
  replaceOnInsert: [['\\.jsx?$', ''], ['\\.ts$', ''], ['\\.coffee$', '']]
}, {
  scopes: ['text.html.vue'],
  prefixes: ['@import[\\(|\\s+]?[\'"]' // @import 'foo' or @import('foo')
  ],
  extensions: ['css', 'sass', 'scss', 'less', 'styl'],
  relative: true,
  replaceOnInsert: [['(/)?_([^/]*?)$', '$1$2'] // dir1/_dir2/_file.sass => dir1/_dir2/file.sass
  ]
}, {
  scopes: ['source.coffee', 'source.coffee.jsx'],
  prefixes: ['require\\s+[\'"]', // require './foo'
  'define\\s+\\[?[\'"]' // define(['./foo']) or define('./foo')
  ],
  extensions: ['js', 'jsx', 'ts', 'tsx', 'coffee'],
  relative: true,
  replaceOnInsert: [['\\.jsx?$', ''], ['\\.ts$', ''], ['\\.coffee$', '']]
}, {
  scopes: ['source.php'],
  prefixes: ['require_once\\([\'"]', // require_once('foo.php')
  'include\\([\'"]' // include('./foo.php')
  ],
  extensions: ['php'],
  relative: true
}, {
  scopes: ['source.sass', 'source.css.scss', 'source.css.less', 'source.stylus'],
  prefixes: ['@import[\\(|\\s+]?[\'"]' // @import 'foo' or @import('foo')
  ],
  extensions: ['sass', 'scss', 'css'],
  relative: true,
  replaceOnInsert: [['(/)?_([^/]*?)$', '$1$2'] // dir1/_dir2/_file.sass => dir1/_dir2/file.sass
  ]
}, {
  scopes: ['source.css'],
  prefixes: ['@import\\s+[\'"]?', // @import 'foo.css'
  '@import\\s+url\\([\'"]?' // @import url('foo.css')
  ],
  extensions: ['css'],
  relative: true
}, {
  scopes: ['source.css', 'source.sass', 'source.css.less', 'source.css.scss', 'source.stylus'],
  prefixes: ['url\\([\'"]?'],
  extensions: ['png', 'gif', 'jpeg', 'jpg', 'woff', 'ttf', 'svg', 'otf'],
  relative: true
}, {
  scopes: ['source.c', 'source.cpp'],
  prefixes: ['^\\s*#include\\s+[\'"]'],
  extensions: ['h', 'hpp'],
  relative: true,
  includeCurrentDirectory: false
}, {
  scopes: ['source.lua'],
  prefixes: ['require[\\s+|\\(][\'"]'],
  extensions: ['lua'],
  relative: true,
  includeCurrentDirectory: false,
  replaceOnInsert: [['\\/', '.'], ['\\\\', '.'], ['\\.lua$', '']]
}, {
  scopes: ['source.ruby'],
  prefixes: ['^\\s*require[\\s+|\\(][\'"]'],
  extensions: ['rb'],
  relative: true,
  includeCurrentDirectory: false,
  replaceOnInsert: [['\\.rb$', '']]
}, {
  scopes: ['source.python'],
  prefixes: ['^\\s*from\\s+', '^\\s*import\\s+'],
  extensions: ['py'],
  relative: true,
  includeCurrentDirectory: false,
  replaceOnInsert: [['\\/', '.'], ['\\\\', '.'], ['\\.py$', '']]
}];
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9jb25maWcvZGVmYXVsdC1zY29wZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7OztxQkFFSSxDQUNiO0FBQ0UsUUFBTSxFQUFFLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQztBQUN2RyxVQUFRLEVBQUUsQ0FDUiw0QkFBNEI7QUFDNUIsbUJBQWlCO0FBQ2pCLG1CQUFpQjtBQUNqQixzQkFBb0I7R0FDckI7QUFDRCxZQUFVLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQztBQUN4RCxVQUFRLEVBQUUsSUFBSTtBQUNkLGlCQUFlLEVBQUUsQ0FDZixDQUFDLHdCQUF3QixFQUFFLEVBQUUsQ0FBQyxFQUM5QixDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxFQUM1QixDQUFDLDBCQUEwQixFQUFFLEVBQUUsQ0FBQyxDQUNqQztDQUNGLEVBQ0Q7QUFDRSxRQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUM7QUFDekIsVUFBUSxFQUFFLENBQ1IsNEJBQTRCO0FBQzVCLG1CQUFpQjtBQUNqQixtQkFBaUI7QUFDakIsc0JBQW9CO0dBQ3JCO0FBQ0QsWUFBVSxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7QUFDdkQsVUFBUSxFQUFFLElBQUk7QUFDZCxpQkFBZSxFQUFFLENBQ2YsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQ2hCLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUNkLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUNuQjtDQUNGLEVBQ0Q7QUFDRSxRQUFNLEVBQUUsQ0FBQyxlQUFl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QUUsS0FBSztBQUM5QixpQkFBZSxFQUFFLENBQ2YsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQ2Y7Q0FDRixFQUNEO0FBQ0UsUUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDO0FBQ3pCLFVBQVEsRUFBRSxDQUNSLGVBQWUsRUFDZixpQkFBaUIsQ0FDbEI7QUFDRCxZQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUM7QUFDbEIsVUFBUSxFQUFFLElBQUk7QUFDZCx5QkFBdUIsRUFBRSxLQUFLO0FBQzlCLGlCQUFlLEVBQUUsQ0FDZixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFDWixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFDYixDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FDZjtDQUNGLENBQ0YiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGF0aHMvbGliL2NvbmZpZy9kZWZhdWx0LXNjb3Blcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmV4cG9ydCBkZWZhdWx0IFtcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UuanMnLCAnc291cmNlLmpzLmpzeCcsICdzb3VyY2UuY29mZmVlJywgJ3NvdXJjZS5jb2ZmZWUuanN4JywgJ3NvdXJjZS50cycsICdzb3VyY2UudHN4J10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdpbXBvcnRcXFxccysuKj9mcm9tXFxcXHMrW1xcJ1wiXScsIC8vIGltcG9ydCBmb28gZnJvbSAnLi9mb28nXG4gICAgICAnaW1wb3J0XFxcXHMrW1xcJ1wiXScsIC8vIGltcG9ydCAnLi9mb28nXG4gICAgICAncmVxdWlyZVxcXFwoW1xcJ1wiXScsIC8vIHJlcXVpcmUoJy4vZm9vJylcbiAgICAgICdkZWZpbmVcXFxcKFxcXFxbP1tcXCdcIl0nIC8vIGRlZmluZShbJy4vZm9vJ10pIG9yIGRlZmluZSgnLi9mb28nKVxuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydqcycsICdqc3gnLCAndHMnLCAndHN4JywgJ2NvZmZlZScsICdqc29uJ10sXG4gICAgcmVsYXRpdmU6IHRydWUsXG4gICAgcmVwbGFjZU9uSW5zZXJ0OiBbXG4gICAgICBbJyhbXFxcXC9dP2luZGV4KT9cXFxcLmpzeD8kJywgJyddLFxuICAgICAgWycoW1xcXFwvXT9pbmRleCk/XFxcXC50cyQnLCAnJ10sXG4gICAgICBbJyhbXFxcXC9dP2luZGV4KT9cXFxcLmNvZmZlZSQnLCAnJ11cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsndGV4dC5odG1sLnZ1ZSddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAnaW1wb3J0XFxcXHMrLio/ZnJvbVxcXFxzK1tcXCdcIl0nLCAvLyBpbXBvcnQgZm9vIGZyb20gJy4vZm9vJ1xuICAgICAgJ2ltcG9ydFxcXFxzK1tcXCdcIl0nLCAvLyBpbXBvcnQgJy4vZm9vJ1xuICAgICAgJ3JlcXVpcmVcXFxcKFtcXCdcIl0nLCAvLyByZXF1aXJlKCcuL2ZvbycpXG4gICAgICAnZGVmaW5lXFxcXChcXFxcWz9bXFwnXCJdJyAvLyBkZWZpbmUoWycuL2ZvbyddKSBvciBkZWZpbmUoJy4vZm9vJylcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsnanMnLCAnanN4JywgJ3Z1ZScsICd0cycsICd0c3gnLCAnY29mZmVlJ10sXG4gICAgcmVsYXRpdmU6IHRydWUsXG4gICAgcmVwbGFjZU9uSW5zZXJ0OiBbXG4gICAgICBbJ1xcXFwuanN4PyQnLCAnJ10sXG4gICAgICBbJ1xcXFwudHMkJywgJyddLFxuICAgICAgWydcXFxcLmNvZmZlZSQnLCAnJ11cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsndGV4dC5odG1sLnZ1ZSddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAnQGltcG9ydFtcXFxcKHxcXFxccytdP1tcXCdcIl0nIC8vIEBpbXBvcnQgJ2Zvbycgb3IgQGltcG9ydCgnZm9vJylcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsnY3NzJywgJ3Nhc3MnLCAnc2NzcycsICdsZXNzJywgJ3N0eWwnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICByZXBsYWNlT25JbnNlcnQ6IFtcbiAgICAgIFsnKC8pP18oW14vXSo/KSQnLCAnJDEkMiddIC8vIGRpcjEvX2RpcjIvX2ZpbGUuc2FzcyA9PiBkaXIxL19kaXIyL2ZpbGUuc2Fzc1xuICAgIF1cbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UuY29mZmVlJywgJ3NvdXJjZS5jb2ZmZWUuanN4J10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdyZXF1aXJlXFxcXHMrW1xcJ1wiXScsIC8vIHJlcXVpcmUgJy4vZm9vJ1xuICAgICAgJ2RlZmluZVxcXFxzK1xcXFxbP1tcXCdcIl0nIC8vIGRlZmluZShbJy4vZm9vJ10pIG9yIGRlZmluZSgnLi9mb28nKVxuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydqcycsICdqc3gnLCAndHMnLCAndHN4JywgJ2NvZmZlZSddLFxuICAgIHJlbGF0aXZlOiB0cnVlLFxuICAgIHJlcGxhY2VPbkluc2VydDogW1xuICAgICAgWydcXFxcLmpzeD8kJywgJyddLFxuICAgICAgWydcXFxcLnRzJCcsICcnXSxcbiAgICAgIFsnXFxcXC5jb2ZmZWUkJywgJyddXG4gICAgXVxuICB9LFxuICB7XG4gICAgc2NvcGVzOiBbJ3NvdXJjZS5waHAnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ3JlcXVpcmVfb25jZVxcXFwoW1xcJ1wiXScsIC8vIHJlcXVpcmVfb25jZSgnZm9vLnBocCcpXG4gICAgICAnaW5jbHVkZVxcXFwoW1xcJ1wiXScgLy8gaW5jbHVkZSgnLi9mb28ucGhwJylcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsncGhwJ10sXG4gICAgcmVsYXRpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2Uuc2FzcycsICdzb3VyY2UuY3NzLnNjc3MnLCAnc291cmNlLmNzcy5sZXNzJywgJ3NvdXJjZS5zdHlsdXMnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ0BpbXBvcnRbXFxcXCh8XFxcXHMrXT9bXFwnXCJdJyAvLyBAaW1wb3J0ICdmb28nIG9yIEBpbXBvcnQoJ2ZvbycpXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ3Nhc3MnLCAnc2NzcycsICdjc3MnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICByZXBsYWNlT25JbnNlcnQ6IFtcbiAgICAgIFsnKC8pP18oW14vXSo/KSQnLCAnJDEkMiddIC8vIGRpcjEvX2RpcjIvX2ZpbGUuc2FzcyA9PiBkaXIxL19kaXIyL2ZpbGUuc2Fzc1xuICAgIF1cbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UuY3NzJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdAaW1wb3J0XFxcXHMrW1xcJ1wiXT8nLCAvLyBAaW1wb3J0ICdmb28uY3NzJ1xuICAgICAgJ0BpbXBvcnRcXFxccyt1cmxcXFxcKFtcXCdcIl0/JyAvLyBAaW1wb3J0IHVybCgnZm9vLmNzcycpXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ2NzcyddLFxuICAgIHJlbGF0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLmNzcycsICdzb3VyY2Uuc2FzcycsICdzb3VyY2UuY3NzLmxlc3MnLCAnc291cmNlLmNzcy5zY3NzJywgJ3NvdXJjZS5zdHlsdXMnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ3VybFxcXFwoW1xcJ1wiXT8nXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ3BuZycsICdnaWYnLCAnanBlZycsICdqcGcnLCAnd29mZicsICd0dGYnLCAnc3ZnJywgJ290ZiddLFxuICAgIHJlbGF0aXZlOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLmMnLCAnc291cmNlLmNwcCddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAnXlxcXFxzKiNpbmNsdWRlXFxcXHMrW1xcJ1wiXSdcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsnaCcsICdocHAnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICBpbmNsdWRlQ3VycmVudERpcmVjdG9yeTogZmFsc2VcbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UubHVhJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdyZXF1aXJlW1xcXFxzK3xcXFxcKF1bXFwnXCJdJ1xuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydsdWEnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICBpbmNsdWRlQ3VycmVudERpcmVjdG9yeTogZmFsc2UsXG4gICAgcmVwbGFjZU9uSW5zZXJ0OiBbXG4gICAgICBbJ1xcXFwvJywgJy4nXSxcbiAgICAgIFsnXFxcXFxcXFwnLCAnLiddLFxuICAgICAgWydcXFxcLmx1YSQnLCAnJ11cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLnJ1YnknXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ15cXFxccypyZXF1aXJlW1xcXFxzK3xcXFxcKF1bXFwnXCJdJ1xuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydyYiddLFxuICAgIHJlbGF0aXZlOiB0cnVlLFxuICAgIGluY2x1ZGVDdXJyZW50RGlyZWN0b3J5OiBmYWxzZSxcbiAgICByZXBsYWNlT25JbnNlcnQ6IFtcbiAgICAgIFsnXFxcXC5yYiQnLCAnJ11cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLnB5dGhvbiddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAnXlxcXFxzKmZyb21cXFxccysnLFxuICAgICAgJ15cXFxccyppbXBvcnRcXFxccysnXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ3B5J10sXG4gICAgcmVsYXRpdmU6IHRydWUsXG4gICAgaW5jbHVkZUN1cnJlbnREaXJlY3Rvcnk6IGZhbHNlLFxuICAgIHJlcGxhY2VPbkluc2VydDogW1xuICAgICAgWydcXFxcLycsICcuJ10sXG4gICAgICBbJ1xcXFxcXFxcJywgJy4nXSxcbiAgICAgIFsnXFxcXC5weSQnLCAnJ11cbiAgICBdXG4gIH1cbl1cbiJdfQ==