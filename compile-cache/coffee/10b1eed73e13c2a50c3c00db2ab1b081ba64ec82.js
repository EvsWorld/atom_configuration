(function() {
  var $, CompositeDisposable, ShowTodoView, TableHeaderView, TodoEmptyView, TodoView, View, ref, ref1,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), View = ref.View, $ = ref.$;

  ref1 = require('./todo-item-view'), TableHeaderView = ref1.TableHeaderView, TodoView = ref1.TodoView, TodoEmptyView = ref1.TodoEmptyView;

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    function ShowTodoView() {
      this.renderTable = bind(this.renderTable, this);
      this.clearTodos = bind(this.clearTodos, this);
      this.renderTodo = bind(this.renderTodo, this);
      this.tableHeaderClicked = bind(this.tableHeaderClicked, this);
      this.initTable = bind(this.initTable, this);
      return ShowTodoView.__super__.constructor.apply(this, arguments);
    }

    ShowTodoView.content = function() {
      return this.div({
        "class": 'todo-table',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.table({
            outlet: 'table'
          });
        };
      })(this));
    };

    ShowTodoView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.handleConfigChanges();
      return this.handleEvents();
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.disposables.add(this.collection.onDidFinishSearch(this.initTable));
      this.disposables.add(this.collection.onDidRemoveTodo(this.removeTodo));
      this.disposables.add(this.collection.onDidClear(this.clearTodos));
      this.disposables.add(this.collection.onDidSortTodos((function(_this) {
        return function(todos) {
          return _this.renderTable(todos);
        };
      })(this)));
      this.disposables.add(this.collection.onDidFilterTodos((function(_this) {
        return function(todos) {
          return _this.renderTable(todos);
        };
      })(this)));
      return this.on('click', 'th', this.tableHeaderClicked);
    };

    ShowTodoView.prototype.handleConfigChanges = function() {
      this.disposables.add(atom.config.onDidChange('todo-show.showInTable', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          _this.showInTable = newValue;
          return _this.renderTable(_this.collection.getTodos());
        };
      })(this)));
      this.disposables.add(atom.config.onDidChange('todo-show.sortBy', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          return _this.sort(_this.sortBy = newValue, _this.sortAsc);
        };
      })(this)));
      return this.disposables.add(atom.config.onDidChange('todo-show.sortAscending', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          return _this.sort(_this.sortBy, _this.sortAsc = newValue);
        };
      })(this)));
    };

    ShowTodoView.prototype.destroy = function() {
      this.disposables.dispose();
      return this.empty();
    };

    ShowTodoView.prototype.initTable = function() {
      this.showInTable = atom.config.get('todo-show.showInTable');
      this.sortBy = atom.config.get('todo-show.sortBy');
      this.sortAsc = atom.config.get('todo-show.sortAscending');
      return this.sort(this.sortBy, this.sortAsc);
    };

    ShowTodoView.prototype.renderTableHeader = function() {
      return this.table.append(new TableHeaderView(this.showInTable, {
        sortBy: this.sortBy,
        sortAsc: this.sortAsc
      }));
    };

    ShowTodoView.prototype.tableHeaderClicked = function(e) {
      var item, sortAsc;
      item = e.target.innerText;
      sortAsc = this.sortBy === item ? !this.sortAsc : this.sortAsc;
      atom.config.set('todo-show.sortBy', item);
      return atom.config.set('todo-show.sortAscending', sortAsc);
    };

    ShowTodoView.prototype.renderTodo = function(todo) {
      return this.table.append(new TodoView(this.showInTable, todo));
    };

    ShowTodoView.prototype.removeTodo = function(todo) {
      return console.log('removeTodo');
    };

    ShowTodoView.prototype.clearTodos = function() {
      return this.table.empty();
    };

    ShowTodoView.prototype.renderTable = function(todos) {
      var i, len, ref2, todo;
      this.clearTodos();
      this.renderTableHeader();
      ref2 = todos = todos;
      for (i = 0, len = ref2.length; i < len; i++) {
        todo = ref2[i];
        this.renderTodo(todo);
      }
      if (!todos.length) {
        return this.table.append(new TodoEmptyView(this.showInTable));
      }
    };

    ShowTodoView.prototype.sort = function(sortBy, sortAsc) {
      return this.collection.sortTodos({
        sortBy: sortBy,
        sortAsc: sortAsc
      });
    };

    return ShowTodoView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tdGFibGUtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLCtGQUFBO0lBQUE7Ozs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxlQUFELEVBQU87O0VBRVAsT0FBNkMsT0FBQSxDQUFRLGtCQUFSLENBQTdDLEVBQUMsc0NBQUQsRUFBa0Isd0JBQWxCLEVBQTRCOztFQUU1QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7Ozs7Ozs7SUFDSixZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxZQUFQO1FBQXFCLFFBQUEsRUFBVSxDQUFDLENBQWhDO09BQUwsRUFBd0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUN0QyxLQUFDLENBQUEsS0FBRCxDQUFPO1lBQUEsTUFBQSxFQUFRLE9BQVI7V0FBUDtRQURzQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEM7SUFEUTs7MkJBSVYsVUFBQSxHQUFZLFNBQUMsVUFBRDtNQUFDLElBQUMsQ0FBQSxhQUFEO01BQ1gsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO01BQ25CLElBQUMsQ0FBQSxtQkFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBQTtJQUhVOzsyQkFLWixZQUFBLEdBQWMsU0FBQTtNQUVaLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLGlCQUFaLENBQThCLElBQUMsQ0FBQSxTQUEvQixDQUFqQjtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLGVB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Q0FBc0I7UUFBQSxNQUFBLEVBQVEsTUFBUjtRQUFnQixPQUFBLEVBQVMsT0FBekI7T0FBdEI7SUFESTs7OztLQXBFbUI7QUFOM0IiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue1ZpZXcsICR9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbntUYWJsZUhlYWRlclZpZXcsIFRvZG9WaWV3LCBUb2RvRW1wdHlWaWV3fSA9IHJlcXVpcmUgJy4vdG9kby1pdGVtLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNob3dUb2RvVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ3RvZG8tdGFibGUnLCB0YWJpbmRleDogLTEsID0+XG4gICAgICBAdGFibGUgb3V0bGV0OiAndGFibGUnXG5cbiAgaW5pdGlhbGl6ZTogKEBjb2xsZWN0aW9uKSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGhhbmRsZUNvbmZpZ0NoYW5nZXMoKVxuICAgIEBoYW5kbGVFdmVudHMoKVxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICAjIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRBZGRUb2RvIEByZW5kZXJUb2RvXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZEZpbmlzaFNlYXJjaCBAaW5pdFRhYmxlXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZFJlbW92ZVRvZG8gQHJlbW92ZVRvZG9cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkQ2xlYXIgQGNsZWFyVG9kb3NcbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkU29ydFRvZG9zICh0b2RvcykgPT4gQHJlbmRlclRhYmxlIHRvZG9zXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZEZpbHRlclRvZG9zICh0b2RvcykgPT4gQHJlbmRlclRhYmxlIHRvZG9zXG5cbiAgICBAb24gJ2NsaWNrJywgJ3RoJywgQHRhYmxlSGVhZGVyQ2xpY2tlZFxuXG4gIGhhbmRsZUNvbmZpZ0NoYW5nZXM6IC0+XG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAndG9kby1zaG93LnNob3dJblRhYmxlJywgKHtuZXdWYWx1ZSwgb2xkVmFsdWV9KSA9PlxuICAgICAgQHNob3dJblRhYmxlID0gbmV3VmFsdWVcbiAgICAgIEByZW5kZXJUYWJsZSBAY29sbGVjdGlvbi5nZXRUb2RvcygpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICd0b2RvLXNob3cuc29ydEJ5JywgKHtuZXdWYWx1ZSwgb2xkVmFsdWV9KSA9PlxuICAgICAgQHNvcnQoQHNvcnRCeSA9IG5ld1ZhbHVlLCBAc29ydEFzYylcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3RvZG8tc2hvdy5zb3J0QXNjZW5kaW5nJywgKHtuZXdWYWx1ZSwgb2xkVmFsdWV9KSA9PlxuICAgICAgQHNvcnQoQHNvcnRCeSwgQHNvcnRBc2MgPSBuZXdWYWx1ZSlcblxuICBkZXN0cm95OiAtPlxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICBAZW1wdHkoKVxuXG4gIGluaXRUYWJsZTogPT5cbiAgICBAc2hvd0luVGFibGUgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5zaG93SW5UYWJsZScpXG4gICAgQHNvcnRCeSA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LnNvcnRCeScpXG4gICAgQHNvcnRBc2MgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5zb3J0QXNjZW5kaW5nJylcbiAgICBAc29ydChAc29ydEJ5LCBAc29ydEFzYylcblxuICByZW5kZXJUYWJsZUhlYWRlcjogLT5cbiAgICBAdGFibGUuYXBwZW5kIG5ldyBUYWJsZUhlYWRlclZpZXcoQHNob3dJblRhYmxlLCB7QHNvcnRCeSwgQHNvcnRBc2N9KVxuXG4gIHRhYmxlSGVhZGVyQ2xpY2tlZDogKGUpID0+XG4gICAgaXRlbSA9IGUudGFyZ2V0LmlubmVyVGV4dFxuICAgIHNvcnRBc2MgPSBpZiBAc29ydEJ5IGlzIGl0ZW0gdGhlbiAhQHNvcnRBc2MgZWxzZSBAc29ydEFzY1xuXG4gICAgYXRvbS5jb25maWcuc2V0KCd0b2RvLXNob3cuc29ydEJ5JywgaXRlbSlcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3RvZG8tc2hvdy5zb3J0QXNjZW5kaW5nJywgc29ydEFzYylcblxuICByZW5kZXJUb2RvOiAodG9kbykgPT5cbiAgICBAdGFibGUuYXBwZW5kIG5ldyBUb2RvVmlldyhAc2hvd0luVGFibGUsIHRvZG8pXG5cbiAgcmVtb3ZlVG9kbzogKHRvZG8pIC0+XG4gICAgY29uc29sZS5sb2cgJ3JlbW92ZVRvZG8nXG5cbiAgY2xlYXJUb2RvczogPT5cbiAgICBAdGFibGUuZW1wdHkoKVxuXG4gIHJlbmRlclRhYmxlOiAodG9kb3MpID0+XG4gICAgQGNsZWFyVG9kb3MoKVxuICAgIEByZW5kZXJUYWJsZUhlYWRlcigpXG5cbiAgICBmb3IgdG9kbyBpbiB0b2RvcyA9IHRvZG9zXG4gICAgICBAcmVuZGVyVG9kbyh0b2RvKVxuICAgIEB0YWJsZS5hcHBlbmQgbmV3IFRvZG9FbXB0eVZpZXcoQHNob3dJblRhYmxlKSB1bmxlc3MgdG9kb3MubGVuZ3RoXG5cbiAgc29ydDogKHNvcnRCeSwgc29ydEFzYykgLT5cbiAgICBAY29sbGVjdGlvbi5zb3J0VG9kb3Moc29ydEJ5OiBzb3J0QnksIHNvcnRBc2M6IHNvcnRBc2MpXG4iXX0=
