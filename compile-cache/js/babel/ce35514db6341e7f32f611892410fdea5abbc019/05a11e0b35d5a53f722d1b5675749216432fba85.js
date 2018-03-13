Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// TODO: in /lib/todo.js

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _todoView = require('./todo-view');

var _todoView2 = _interopRequireDefault(_todoView);

var _atom = require('atom');

'use babel';

var Todo = {
  todoView: null,
  panel: null,
  subscriptions: null,

  config: {
    a_pattern: {
      title: 'RegExp Pattern',
      description: 'used in conjunction with RegExp Flags to find todo items in your code',
      type: 'string',
      'default': 'TODO\\:.+'
    },
    b_flags: {
      title: 'RegExp Flags',
      type: 'string',
      'default': 'g'
    },
    c_ignorePaths: {
      title: 'Ignored Paths',
      description: 'comma-separated [globs](https://github.com/isaacs/node-glob#glob-primer) that should not be searched (ex: \\*\\*/ignore-me/\\*\\*, \\*\\*/and-me/\\*\\*)',
      type: 'array',
      'default': [],
      items: {
        type: 'string'
      }
    }
  },

  activate: function activate(state) {
    this.todoView = new _todoView2['default'](state.todoViewState);

    this.panel = atom.workspace.addRightPanel({
      item: this.todoView.getElement(),
      visible: false
    });

    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'todo:toggle': this.toggle.bind(this)
    }), this.panel.onDidChangeVisible(this.onDidChangeVisible.bind(this)));

    atom.emitter.on('todo:refresh', this.loadItems.bind(this));
    atom.emitter.on('todo:close', this.close.bind(this));
  },

  deactivate: function deactivate() {
    this.panel.destroy();
    this.subscriptions.dispose();
    return this.todoView.destroy();
  },

  serialize: function serialize() {
    return {
      todoViewState: this.todoView.serialize()
    };
  },

  close: function close() {
    return this.panel.hide();
  },

  toggle: function toggle() {
    if (this.panel.isVisible()) {
      this.close();
    } else {
      this.panel.show();
      atom.emitter.emit('todo:show');
      return this.loadItems();
    }
  },

  loadItems: function loadItems() {
    return this.getItems().then(this.todoView.renderItems);
  },

  getItems: function getItems() {
    return _service2['default'].findTodoItems();
  },

  onDidChangeVisible: function onDidChangeVisible(visible) {
    this.todoView.toggle(visible);
  }
};

exports['default'] = Todo;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvdG9kby9saWIvdG9kby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozt1QkFJb0IsV0FBVzs7Ozt3QkFDVixhQUFhOzs7O29CQUNBLE1BQU07O0FBTnhDLFdBQVcsQ0FBQzs7QUFRWixJQUFNLElBQUksR0FBRztBQUNYLFVBQVEsRUFBRSxJQUFJO0FBQ2QsT0FBSyxFQUFFLElBQUk7QUFDWCxlQUFhLEVBQUUsSUFBSTs7QUFFbkIsUUFBTSxFQUFFO0FBQ04sYUFBUyxFQUFFO0FBQ1QsV0FBSyxFQUFFLGdCQUFnQjtBQUN2QixpQkFBVyxFQUFFLHVFQUF1RTtBQUNwRixVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLFdBQVc7S0FDckI7QUFDRCxXQUFPLEVBQUU7QUFDUCxXQUFLLEVBQUUsY0FBYztBQUNyQixVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLEdBQUc7S0FDYjtBQUNELGlCQUFhLEVBQUU7QUFDYixXQUFLLEVBQUUsZUFBZTtBQUN0QixpQkFBVyxFQUFFLDBKQUEwSjtBQUN2SyxVQUFJLEVBQUUsT0FBTztBQUNiLGlCQUFTLEVBQUU7QUFDWCxXQUFLLEVBQUU7QUFDTCxZQUFJLEVBQUUsUUFBUTtPQUNmO0tBQ0Y7R0FDRjs7QUFFRCxVQUFRLEVBQUEsa0JBQUMsS0FBSyxFQUFFO0FBQ2QsUUFBSSxDQUFDLFFBQVEsR0FBRywwQkFBYSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRWxELFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7QUFDeEMsVUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFO0FBQ2hDLGFBQU8sRUFBRSxLQUFLO0tBQ2YsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXVCLENBQUM7O0FBRTdDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUNsQyxtQkFBYSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztLQUN0QyxDQUFDLEVBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ25FLENBQUM7O0FBRUYsUUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDM0QsUUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDdEQ7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQixRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLFdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUNoQzs7QUFFRCxXQUFTLEVBQUEscUJBQUc7QUFDVixXQUFPO0FBQ0wsbUJBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtLQUN6QyxDQUFDO0dBQ0g7O0FBRUQsT0FBSyxFQUFBLGlCQUFHO0FBQ04sV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQzFCOztBQUVELFFBQU0sRUFBQSxrQkFBRztBQUNQLFFBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUMxQixVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZCxNQUFNO0FBQ0wsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMvQixhQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUN6QjtHQUNGOztBQUVELFdBQVMsRUFBQSxxQkFBRztBQUNWLFdBQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0dBQ3hEOztBQUVELFVBQVEsRUFBQSxvQkFBRztBQUNULFdBQU8scUJBQVEsYUFBYSxFQUFFLENBQUM7R0FDaEM7O0FBRUQsb0JBQWtCLEVBQUEsNEJBQUMsT0FBTyxFQUFFO0FBQzFCLFFBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQy9CO0NBQ0YsQ0FBQzs7cUJBRWEsSUFBSSIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL3RvZG8vbGliL3RvZG8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gVE9ETzogaW4gL2xpYi90b2RvLmpzXG5cbmltcG9ydCBzZXJ2aWNlIGZyb20gJy4vc2VydmljZSc7XG5pbXBvcnQgVG9kb1ZpZXcgZnJvbSAnLi90b2RvLXZpZXcnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcblxuY29uc3QgVG9kbyA9IHtcbiAgdG9kb1ZpZXc6IG51bGwsXG4gIHBhbmVsOiBudWxsLFxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIGNvbmZpZzoge1xuICAgIGFfcGF0dGVybjoge1xuICAgICAgdGl0bGU6ICdSZWdFeHAgUGF0dGVybicsXG4gICAgICBkZXNjcmlwdGlvbjogJ3VzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBSZWdFeHAgRmxhZ3MgdG8gZmluZCB0b2RvIGl0ZW1zIGluIHlvdXIgY29kZScsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdUT0RPXFxcXDouKycsXG4gICAgfSxcbiAgICBiX2ZsYWdzOiB7XG4gICAgICB0aXRsZTogJ1JlZ0V4cCBGbGFncycsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdnJyxcbiAgICB9LFxuICAgIGNfaWdub3JlUGF0aHM6IHtcbiAgICAgIHRpdGxlOiAnSWdub3JlZCBQYXRocycsXG4gICAgICBkZXNjcmlwdGlvbjogJ2NvbW1hLXNlcGFyYXRlZCBbZ2xvYnNdKGh0dHBzOi8vZ2l0aHViLmNvbS9pc2FhY3Mvbm9kZS1nbG9iI2dsb2ItcHJpbWVyKSB0aGF0IHNob3VsZCBub3QgYmUgc2VhcmNoZWQgKGV4OiBcXFxcKlxcXFwqL2lnbm9yZS1tZS9cXFxcKlxcXFwqLCBcXFxcKlxcXFwqL2FuZC1tZS9cXFxcKlxcXFwqKScsXG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogW10sXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICBhY3RpdmF0ZShzdGF0ZSkge1xuICAgIHRoaXMudG9kb1ZpZXcgPSBuZXcgVG9kb1ZpZXcoc3RhdGUudG9kb1ZpZXdTdGF0ZSk7XG5cbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkUmlnaHRQYW5lbCh7XG4gICAgICBpdGVtOiB0aGlzLnRvZG9WaWV3LmdldEVsZW1lbnQoKSxcbiAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgICAndG9kbzp0b2dnbGUnOiB0aGlzLnRvZ2dsZS5iaW5kKHRoaXMpLFxuICAgICAgfSksXG5cbiAgICAgICB0aGlzLnBhbmVsLm9uRGlkQ2hhbmdlVmlzaWJsZSh0aGlzLm9uRGlkQ2hhbmdlVmlzaWJsZS5iaW5kKHRoaXMpKVxuICAgICk7XG5cbiAgICBhdG9tLmVtaXR0ZXIub24oJ3RvZG86cmVmcmVzaCcsIHRoaXMubG9hZEl0ZW1zLmJpbmQodGhpcykpO1xuICAgIGF0b20uZW1pdHRlci5vbigndG9kbzpjbG9zZScsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgIHJldHVybiB0aGlzLnRvZG9WaWV3LmRlc3Ryb3koKTtcbiAgfSxcblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvZG9WaWV3U3RhdGU6IHRoaXMudG9kb1ZpZXcuc2VyaWFsaXplKCksXG4gICAgfTtcbiAgfSxcblxuICBjbG9zZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC5oaWRlKCk7XG4gIH0sXG5cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsLmlzVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZWwuc2hvdygpO1xuICAgICAgYXRvbS5lbWl0dGVyLmVtaXQoJ3RvZG86c2hvdycpO1xuICAgICAgcmV0dXJuIHRoaXMubG9hZEl0ZW1zKCk7XG4gICAgfVxuICB9LFxuXG4gIGxvYWRJdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRJdGVtcygpLnRoZW4odGhpcy50b2RvVmlldy5yZW5kZXJJdGVtcyk7XG4gIH0sXG5cbiAgZ2V0SXRlbXMoKSB7XG4gICAgcmV0dXJuIHNlcnZpY2UuZmluZFRvZG9JdGVtcygpO1xuICB9LFxuXG4gIG9uRGlkQ2hhbmdlVmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgdGhpcy50b2RvVmlldy50b2dnbGUodmlzaWJsZSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBUb2RvO1xuIl19