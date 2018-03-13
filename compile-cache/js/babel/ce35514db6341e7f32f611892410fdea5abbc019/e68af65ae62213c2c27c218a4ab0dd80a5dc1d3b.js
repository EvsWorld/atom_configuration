Object.defineProperty(exports, '__esModule', {
  value: true
});

// Public: GrammarUtils.CScompiler - a module which predetermines the active
// CoffeeScript compiler and sets an [array] of appropriate command line flags

var _child_process = require('child_process');

'use babel';

var args = ['-e'];
try {
  var coffee = (0, _child_process.execSync)('coffee -h'); // which coffee | xargs readlink'
  if (coffee.toString().match(/--cli/)) {
    // -redux
    args.push('--cli');
  }
} catch (error) {/* Don't throw */}

exports['default'] = { args: args };
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFyLXV0aWxzL2NvZmZlZS1zY3JpcHQtY29tcGlsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs2QkFJeUIsZUFBZTs7QUFKeEMsV0FBVyxDQUFDOztBQU1aLElBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsSUFBSTtBQUNGLE1BQU0sTUFBTSxHQUFHLDZCQUFTLFdBQVcsQ0FBQyxDQUFDO0FBQ3JDLE1BQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFDcEMsUUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUNwQjtDQUNGLENBQUMsT0FBTyxLQUFLLEVBQUUsbUJBQXFCOztxQkFFdEIsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFyLXV0aWxzL2NvZmZlZS1zY3JpcHQtY29tcGlsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gUHVibGljOiBHcmFtbWFyVXRpbHMuQ1Njb21waWxlciAtIGEgbW9kdWxlIHdoaWNoIHByZWRldGVybWluZXMgdGhlIGFjdGl2ZVxuLy8gQ29mZmVlU2NyaXB0IGNvbXBpbGVyIGFuZCBzZXRzIGFuIFthcnJheV0gb2YgYXBwcm9wcmlhdGUgY29tbWFuZCBsaW5lIGZsYWdzXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuXG5jb25zdCBhcmdzID0gWyctZSddO1xudHJ5IHtcbiAgY29uc3QgY29mZmVlID0gZXhlY1N5bmMoJ2NvZmZlZSAtaCcpOyAvLyB3aGljaCBjb2ZmZWUgfCB4YXJncyByZWFkbGluaydcbiAgaWYgKGNvZmZlZS50b1N0cmluZygpLm1hdGNoKC8tLWNsaS8pKSB7IC8vIC1yZWR1eFxuICAgIGFyZ3MucHVzaCgnLS1jbGknKTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHsgLyogRG9uJ3QgdGhyb3cgKi8gfVxuXG5leHBvcnQgZGVmYXVsdCB7IGFyZ3MgfTtcbiJdfQ==