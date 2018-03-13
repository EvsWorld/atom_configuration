(function() {
  var CommandHistory;

  CommandHistory = (function() {
    function CommandHistory(editor) {
      this.editor = editor;
      this.cmdHistory = [];
    }

    CommandHistory.prototype.saveIfNew = function(text) {
      if (!((this.cmdHistoryIndex != null) && this.cmdHistory[this.cmdHistoryIndex] === text)) {
        this.cmdHistoryIndex = this.cmdHistory.length;
        this.cmdHistory.push(text);
      }
      return this.historyMode = false;
    };

    CommandHistory.prototype.moveUp = function() {
      if (this.cmdHistoryIndex == null) {
        return;
      }
      if (this.cmdHistoryIndex > 0 && this.historyMode) {
        this.cmdHistoryIndex--;
      }
      this.editor.setText(this.cmdHistory[this.cmdHistoryIndex]);
      return this.historyMode = true;
    };

    CommandHistory.prototype.moveDown = function() {
      if (this.cmdHistoryIndex == null) {
        return;
      }
      if (!this.historyMode) {
        return;
      }
      if (this.cmdHistoryIndex < this.cmdHistory.length - 1 && this.historyMode) {
        this.cmdHistoryIndex++;
      }
      return this.editor.setText(this.cmdHistory[this.cmdHistoryIndex]);
    };

    return CommandHistory;

  })();

  exports.CommandHistory = CommandHistory;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9ub2RlLWRlYnVnZ2VyL2xpYi9Db21wb25lbnRzL2NvbnNvbGVwYW5lLXV0aWxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQU07SUFDUyx3QkFBQyxNQUFEO01BQ1gsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFGSDs7NkJBSWIsU0FBQSxHQUFXLFNBQUMsSUFBRDtNQUNULElBQUEsQ0FBQSxDQUFPLDhCQUFBLElBQXNCLElBQUMsQ0FBQSxVQUFXLENBQUEsSUFBQyxDQUFBLGVBQUQsQ0FBWixLQUFpQyxJQUE5RCxDQUFBO1FBQ0UsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBQyxDQUFBLFVBQVUsQ0FBQztRQUMvQixJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBaUIsSUFBakIsRUFGRjs7YUFHQSxJQUFDLENBQUEsV0FBRCxHQUFlO0lBSk47OzZCQUtYLE1BQUEsR0FBUSxTQUFBO01BQ04sSUFBYyw0QkFBZDtBQUFBLGVBQUE7O01BQ0EsSUFBRyxJQUFDLENBQUEsZUFBRCxHQUFtQixDQUFuQixJQUF5QixJQUFDLENBQUEsV0FBN0I7UUFDRSxJQUFDLENBQUEsZUFBRCxHQURGOztNQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFnQixJQUFDLENBQUEsVUFBVyxDQUFBLElBQUMsQ0FBQSxlQUFELENBQTVCO2FBQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUxUOzs2QkFNUixRQUFBLEdBQVUsU0FBQTtNQUNSLElBQWMsNEJBQWQ7QUFBQSxlQUFBOztNQUNBLElBQUEsQ0FBYyxJQUFDLENBQUEsV0FBZjtBQUFBLGVBQUE7O01BQ0EsSUFBRyxJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosR0FBcUIsQ0FBeEMsSUFBOEMsSUFBQyxDQUFBLFdBQWxEO1FBQ0UsSUFBQyxDQUFBLGVBQUQsR0FERjs7YUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsSUFBQyxDQUFBLFVBQVcsQ0FBQSxJQUFDLENBQUEsZUFBRCxDQUE1QjtJQUxROzs7Ozs7RUFRWixPQUFPLENBQUMsY0FBUixHQUF5QjtBQXhCekIiLCJzb3VyY2VzQ29udGVudCI6WyIjIFRyYWNrIGNvbW1hbmQgaGlzdG9yeSBmb3IgY29uc29sZSBwYW5lXG5jbGFzcyBDb21tYW5kSGlzdG9yeVxuICBjb25zdHJ1Y3RvcjogKGVkaXRvcikgLT5cbiAgICBAZWRpdG9yID0gZWRpdG9yXG4gICAgQGNtZEhpc3RvcnkgPSBbXVxuXG4gIHNhdmVJZk5ldzogKHRleHQpIC0+XG4gICAgdW5sZXNzIEBjbWRIaXN0b3J5SW5kZXg/IGFuZCBAY21kSGlzdG9yeVtAY21kSGlzdG9yeUluZGV4XSBpcyB0ZXh0XG4gICAgICBAY21kSGlzdG9yeUluZGV4ID0gQGNtZEhpc3RvcnkubGVuZ3RoXG4gICAgICBAY21kSGlzdG9yeS5wdXNoIHRleHRcbiAgICBAaGlzdG9yeU1vZGUgPSBmYWxzZVxuICBtb3ZlVXA6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAY21kSGlzdG9yeUluZGV4P1xuICAgIGlmIEBjbWRIaXN0b3J5SW5kZXggPiAwIGFuZCBAaGlzdG9yeU1vZGVcbiAgICAgIEBjbWRIaXN0b3J5SW5kZXgtLVxuICAgIEBlZGl0b3Iuc2V0VGV4dChAY21kSGlzdG9yeVtAY21kSGlzdG9yeUluZGV4XSlcbiAgICBAaGlzdG9yeU1vZGUgPSB0cnVlXG4gIG1vdmVEb3duOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGNtZEhpc3RvcnlJbmRleD9cbiAgICByZXR1cm4gdW5sZXNzIEBoaXN0b3J5TW9kZVxuICAgIGlmIEBjbWRIaXN0b3J5SW5kZXggPCBAY21kSGlzdG9yeS5sZW5ndGggLSAxIGFuZCBAaGlzdG9yeU1vZGVcbiAgICAgIEBjbWRIaXN0b3J5SW5kZXgrK1xuICAgIEBlZGl0b3Iuc2V0VGV4dChAY21kSGlzdG9yeVtAY21kSGlzdG9yeUluZGV4XSlcblxuIyBFeHBvcnRzXG5leHBvcnRzLkNvbW1hbmRIaXN0b3J5ID0gQ29tbWFuZEhpc3RvcnlcbiJdfQ==
