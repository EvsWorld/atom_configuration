Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;

var _atom = require('atom');

'use babel';

var disposables;

function splitTab(_ref) {
  var tabBarView = _ref.currentTarget;

  process.nextTick(function destroyTab() {
    tabBarView.closeTab(tabBarView.querySelector('.right-clicked'));
  });
}

function activate() {
  disposables = new _atom.CompositeDisposable(atom.commands.add('.tab-bar', {
    'tabs:split-up': splitTab,
    'tabs:split-down': splitTab,
    'tabs:split-left': splitTab,
    'tabs:split-right': splitTab
  }));
}

function deactivate() {
  disposables.dispose();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvcGFuZS1zcGxpdC1tb3Zlcy10YWIvbGliL3BhbmUtc3BsaXQtbW92ZXMtdGFiLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFHTyxNQUFNOztBQUhiLFdBQVcsQ0FBQzs7QUFLWixJQUFJLFdBQVcsQ0FBQzs7QUFFaEIsU0FBUyxRQUFRLENBQUMsSUFBMkIsRUFBRTtNQUFiLFVBQVUsR0FBMUIsSUFBMkIsQ0FBMUIsYUFBYTs7QUFDOUIsU0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLFVBQVUsR0FBRztBQUNyQyxjQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0dBQ2pFLENBQUMsQ0FBQztDQUNKOztBQUVNLFNBQVMsUUFBUSxHQUFHO0FBQ3pCLGFBQVcsR0FBRyw4QkFDWixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUU7QUFDNUIsbUJBQWUsRUFBRSxRQUFRO0FBQ3pCLHFCQUFpQixFQUFFLFFBQVE7QUFDM0IscUJBQWlCLEVBQUUsUUFBUTtBQUMzQixzQkFBa0IsRUFBRSxRQUFRO0dBQzdCLENBQUMsQ0FDSCxDQUFDO0NBQ0g7O0FBRU0sU0FBUyxVQUFVLEdBQUc7QUFDM0IsYUFBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0NBQ3ZCIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvcGFuZS1zcGxpdC1tb3Zlcy10YWIvbGliL3BhbmUtc3BsaXQtbW92ZXMtdGFiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5pbXBvcnQge1xuICBDb21wb3NpdGVEaXNwb3NhYmxlLFxufSBmcm9tICdhdG9tJztcblxudmFyIGRpc3Bvc2FibGVzO1xuXG5mdW5jdGlvbiBzcGxpdFRhYih7Y3VycmVudFRhcmdldDogdGFiQmFyVmlld30pIHtcbiAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiBkZXN0cm95VGFiKCkge1xuICAgIHRhYkJhclZpZXcuY2xvc2VUYWIodGFiQmFyVmlldy5xdWVyeVNlbGVjdG9yKCcucmlnaHQtY2xpY2tlZCcpKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnLnRhYi1iYXInLCB7XG4gICAgICAndGFiczpzcGxpdC11cCc6IHNwbGl0VGFiLFxuICAgICAgJ3RhYnM6c3BsaXQtZG93bic6IHNwbGl0VGFiLFxuICAgICAgJ3RhYnM6c3BsaXQtbGVmdCc6IHNwbGl0VGFiLFxuICAgICAgJ3RhYnM6c3BsaXQtcmlnaHQnOiBzcGxpdFRhYixcbiAgICB9KVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xufVxuIl19