(function() {
  var EditLine, LineMeta, MAX_SKIP_EMPTY_LINE_ALLOWED, config, utils;

  config = require("../config");

  utils = require("../utils");

  LineMeta = require("../helpers/line-meta");

  MAX_SKIP_EMPTY_LINE_ALLOWED = 5;

  module.exports = EditLine = (function() {
    function EditLine(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    EditLine.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            return _this[fn](e, selection);
          });
        };
      })(this));
    };

    EditLine.prototype.insertNewLine = function(e, selection) {
      var columnWidths, cursor, line, lineMeta, row;
      if (this._isRangeSelection(selection)) {
        return e.abortKeyBinding();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      lineMeta = new LineMeta(line);
      if (lineMeta.isContinuous()) {
        if (cursor.column < line.length && !config.get("inlineNewLineContinuation")) {
          return e.abortKeyBinding();
        }
        if (lineMeta.isEmptyBody()) {
          this._insertNewlineWithoutContinuation(cursor);
        } else {
          this._insertNewlineWithContinuation(lineMeta);
        }
        return;
      }
      if (this._isTableRow(cursor, line)) {
        row = utils.parseTableRow(line);
        columnWidths = row.columnWidths.reduce(function(sum, i) {
          return sum + i;
        });
        if (columnWidths === 0) {
          this._insertNewlineWithoutTableColumns();
        } else {
          this._insertNewlineWithTableColumns(row);
        }
        return;
      }
      return e.abortKeyBinding();
    };

    EditLine.prototype._insertNewlineWithContinuation = function(lineMeta) {
      var nextLine;
      nextLine = lineMeta.nextLine;
      if (lineMeta.isList("ol") && !config.get("orderedNewLineNumberContinuation")) {
        nextLine = lineMeta.lineHead(lineMeta.defaultHead);
      }
      return this.editor.insertText("\n" + nextLine);
    };

    EditLine.prototype._insertNewlineWithoutContinuation = function(cursor) {
      var currentIndentation, emptyLineSkipped, indentation, j, line, nextLine, ref, row;
      currentIndentation = this.editor.indentationForBufferRow(cursor.row);
      nextLine = "\n";
      if (currentIndentation < 1 || cursor.row < 1) {
        this.editor.selectToBeginningOfLine();
        this.editor.insertText(nextLine);
        return;
      }
      emptyLineSkipped = 0;
      for (row = j = ref = cursor.row - 1; ref <= 0 ? j <= 0 : j >= 0; row = ref <= 0 ? ++j : --j) {
        line = this.editor.lineTextForBufferRow(row);
        if (line.trim() === "") {
          if (emptyLineSkipped > MAX_SKIP_EMPTY_LINE_ALLOWED) {
            break;
          }
          emptyLineSkipped += 1;
        } else {
          indentation = this.editor.indentationForBufferRow(row);
          if (indentation >= currentIndentation) {
            continue;
          }
          if (indentation === currentIndentation - 1 && LineMeta.isList(line)) {
            nextLine = new LineMeta(line).nextLine;
          }
          break;
        }
      }
      this.editor.selectToBeginningOfLine();
      return this.editor.insertText(nextLine);
    };

    EditLine.prototype._isTableRow = function(cursor, line) {
      if (!config.get("tableNewLineContinuation")) {
        return false;
      }
      if (cursor.row < 1 || !utils.isTableRow(line)) {
        return false;
      }
      if (utils.isTableSeparator(line)) {
        return true;
      }
      if (utils.isTableRow(this.editor.lineTextForBufferRow(cursor.row - 1))) {
        return true;
      }
      return false;
    };

    EditLine.prototype._insertNewlineWithoutTableColumns = function() {
      this.editor.selectLinesContainingCursors();
      return this.editor.insertText("\n");
    };

    EditLine.prototype._insertNewlineWithTableColumns = function(row) {
      var newLine, options;
      options = {
        numOfColumns: Math.max(1, row.columns.length),
        extraPipes: row.extraPipes,
        columnWidth: 1,
        columnWidths: [],
        alignment: config.get("tableAlignment"),
        alignments: []
      };
      newLine = utils.createTableRow([], options);
      this.editor.moveToEndOfLine();
      this.editor.insertText("\n" + newLine);
      this.editor.moveToBeginningOfLine();
      if (options.extraPipes) {
        return this.editor.moveToNextWordBoundary();
      }
    };

    EditLine.prototype.indentListLine = function(e, selection) {
      var bullet, cursor, line, lineMeta;
      if (this._isRangeSelection(selection)) {
        return e.abortKeyBinding();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      lineMeta = new LineMeta(line);
      if (lineMeta.isList("ol")) {
        line = "" + (this.editor.getTabText()) + (lineMeta.lineHead(lineMeta.defaultHead)) + lineMeta.body;
        return this._replaceLine(selection, cursor.row, line);
      } else if (lineMeta.isList("ul")) {
        bullet = config.get("templateVariables.ulBullet" + (this.editor.indentationForBufferRow(cursor.row) + 1));
        bullet = bullet || config.get("templateVariables.ulBullet") || lineMeta.defaultHead;
        line = "" + (this.editor.getTabText()) + (lineMeta.lineHead(bullet)) + lineMeta.body;
        return this._replaceLine(selection, cursor.row, line);
      } else if (this._isAtLineBeginning(line, cursor.column)) {
        return selection.indent();
      } else {
        return e.abortKeyBinding();
      }
    };

    EditLine.prototype._isRangeSelection = function(selection) {
      var head, tail;
      head = selection.getHeadBufferPosition();
      tail = selection.getTailBufferPosition();
      return head.row !== tail.row || head.column !== tail.column;
    };

    EditLine.prototype._replaceLine = function(selection, row, line) {
      var range;
      range = selection.cursor.getCurrentLineBufferRange();
      selection.setBufferRange(range);
      return selection.insertText(line);
    };

    EditLine.prototype._isAtLineBeginning = function(line, col) {
      return col === 0 || line.substring(0, col).trim() === "";
    };

    return EditLine;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL2NvbW1hbmRzL2VkaXQtbGluZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7RUFDVCxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0VBRVIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxzQkFBUjs7RUFFWCwyQkFBQSxHQUE4Qjs7RUFFOUIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVTLGtCQUFDLE1BQUQ7TUFDWCxJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7SUFGQzs7dUJBSWIsT0FBQSxHQUFTLFNBQUMsQ0FBRDtBQUNQLFVBQUE7TUFBQSxFQUFBLEdBQUssSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQWdCLFVBQWhCLEVBQTRCLFNBQUMsQ0FBRDtlQUFPLENBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFMLENBQUE7TUFBUCxDQUE1QjthQUVMLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2YsS0FBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLENBQUEsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxTQUFDLFNBQUQ7bUJBQzlCLEtBQUUsQ0FBQSxFQUFBLENBQUYsQ0FBTSxDQUFOLEVBQVMsU0FBVDtVQUQ4QixDQUFoQztRQURlO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtJQUhPOzt1QkFPVCxhQUFBLEdBQWUsU0FBQyxDQUFELEVBQUksU0FBSjtBQUNiLFVBQUE7TUFBQSxJQUE4QixJQUFDLENBQUEsaUJBQUQsQ0FBbUIsU0FBbkIsQ0FBOUI7QUFBQSxlQUFP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QSxDQUFBLEtBQWlDO0lBRDNCOzs7OztBQXZKdEIiLCJzb3VyY2VzQ29udGVudCI6WyJjb25maWcgPSByZXF1aXJlIFwiLi4vY29uZmlnXCJcbnV0aWxzID0gcmVxdWlyZSBcIi4uL3V0aWxzXCJcblxuTGluZU1ldGEgPSByZXF1aXJlIFwiLi4vaGVscGVycy9saW5lLW1ldGFcIlxuXG5NQVhfU0tJUF9FTVBUWV9MSU5FX0FMTE9XRUQgPSA1XG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEVkaXRMaW5lXG4gICMgYWN0aW9uOiBpbnNlcnQtbmV3LWxpbmUsIGluZGVudC1saXN0LWxpbmVcbiAgY29uc3RydWN0b3I6IChhY3Rpb24pIC0+XG4gICAgQGFjdGlvbiA9IGFjdGlvblxuICAgIEBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICB0cmlnZ2VyOiAoZSkgLT5cbiAgICBmbiA9IEBhY3Rpb24ucmVwbGFjZSAvLVthLXpdL2lnLCAocykgLT4gc1sxXS50b1VwcGVyQ2FzZSgpXG5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBAZWRpdG9yLmdldFNlbGVjdGlvbnMoKS5mb3JFYWNoIChzZWxlY3Rpb24pID0+XG4gICAgICAgIEBbZm5dKGUsIHNlbGVjdGlvbilcblxuICBpbnNlcnROZXdMaW5lOiAoZSwgc2VsZWN0aW9uKSAtPlxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpIGlmIEBfaXNSYW5nZVNlbGVjdGlvbihzZWxlY3Rpb24pXG5cbiAgICBjdXJzb3IgPSBzZWxlY3Rpb24uZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKClcbiAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjdXJzb3Iucm93KVxuXG4gICAgbGluZU1ldGEgPSBuZXcgTGluZU1ldGEobGluZSlcbiAgICBpZiBsaW5lTWV0YS5pc0NvbnRpbnVvdXMoKVxuICAgICAgIyB3aGVuIGN1cnNvciBpcyBhdCBtaWRkbGUgb2YgbGluZSwgZG8gYSBub3JtYWwgaW5zZXJ0IGxpbmVcbiAgICAgICMgdW5sZXNzIGlubGluZSBjb250aW51YXRpb24gaXMgZW5hYmxlZFxuICAgICAgaWYgY3Vyc29yLmNvbHVtbiA8IGxpbmUubGVuZ3RoICYmICFjb25maWcuZ2V0KFwiaW5saW5lTmV3TGluZUNvbnRpbnVhdGlvblwiKVxuICAgICAgICByZXR1cm4gZS5hYm9ydEtleUJpbmRpbmcoKVxuXG4gICAgICBpZiBsaW5lTWV0YS5pc0VtcHR5Qm9keSgpXG4gICAgICAgIEBfaW5zZXJ0TmV3bGluZVdpdGhvdXRDb250aW51YXRpb24oY3Vyc29yKVxuICAgICAgZWxzZVxuICAgICAgICBAX2luc2VydE5ld2xpbmVXaXRoQ29udGludWF0aW9uKGxpbmVNZXRhKVxuICAgICAgcmV0dXJuXG5cbiAgICBpZiBAX2lzVGFibGVSb3coY3Vyc29yLCBsaW5lKVxuICAgICAgcm93ID0gdXRpbHMucGFyc2VUYWJsZVJvdyhsaW5lKVxuICAgICAgY29sdW1uV2lkdGhzID0gcm93LmNvbHVtbldpZHRocy5yZWR1Y2UoKHN1bSwgaSkgLT4gc3VtICsgaSlcbiAgICAgIGlmIGNvbHVtbldpZHRocyA9PSAwXG4gICAgICAgIEBfaW5zZXJ0TmV3bGluZVdpdGhvdXRUYWJsZUNvbHVtbnMoKVxuICAgICAgZWxzZVxuICAgICAgICBAX2luc2VydE5ld2xpbmVXaXRoVGFibGVDb2x1bW5zKHJvdylcbiAgICAgIHJldHVyblxuXG4gICAgcmV0dXJuIGUuYWJvcnRLZXlCaW5kaW5nKClcblxuICBfaW5zZXJ0TmV3bGluZVdpdGhDb250aW51YXRpb246IChsaW5lTWV0YSkgLT5cbiAgICBuZXh0TGluZSA9IGxpbmVNZXRhLm5leHRMaW5lXG4gICAgIyBkb24ndCBjb250aW51ZSBudW1iZXJzIGluIE9MXG4gICAgaWYgbGluZU1ldGEuaXNMaXN0KFwib2xcIikgJiYgIWNvbmZpZy5nZXQoXCJvcmRlcmVkTmV3TGluZU51bWJlckNvbnRpbnVhdGlvblwiKVxuICAgICAgbmV4dExpbmUgPSBsaW5lTWV0YS5saW5lSGVhZChsaW5lTWV0YS5kZWZhdWx0SGVhZClcblxuICAgIEBlZGl0b3IuaW5zZXJ0VGV4dChcIlxcbiN7bmV4dExpbmV9XCIpXG5cbiAgX2luc2VydE5ld2xpbmVXaXRob3V0Q29udGludWF0aW9uOiAoY3Vyc29yKSAtPlxuICAgIGN1cnJlbnRJbmRlbnRhdGlvbiA9IEBlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3coY3Vyc29yLnJvdylcblxuICAgIG5leHRMaW5lID0gXCJcXG5cIlxuICAgICMgaWYgdGhpcyBpcyBhbiBsaXN0IHdpdGhvdXQgaW5kZW50YXRpb24sIG9yIGF0IGJlZ2lubmluZyBvZiB0aGUgZmlsZVxuICAgIGlmIGN1cnJlbnRJbmRlbnRhdGlvbiA8IDEgfHwgY3Vyc29yLnJvdyA8IDFcbiAgICAgIEBlZGl0b3Iuc2VsZWN0VG9CZWdpbm5pbmdPZkxpbmUoKVxuICAgICAgQGVkaXRvci5pbnNlcnRUZXh0KG5leHRMaW5lKVxuICAgICAgcmV0dXJuXG5cbiAgICBlbXB0eUxpbmVTa2lwcGVkID0gMFxuICAgICMgaWYgdGhpcyBpcyBhbiBpbmRlbnRlZCBlbXB0eSBsaXN0LCB3ZSB3aWxsIGdvIHVwIGxpbmVzIGFuZCB0cnkgdG8gZmluZFxuICAgICMgaXRzIHBhcmVudCdzIGxpc3QgcHJlZml4IGFuZCB1c2UgdGhhdCBpZiBwb3NzaWJsZVxuICAgIGZvciByb3cgaW4gWyhjdXJzb3Iucm93IC0gMSkuLjBdXG4gICAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpXG5cbiAgICAgIGlmIGxpbmUudHJpbSgpID09IFwiXCIgIyBza2lwIGVtcHR5IGxpbmVzIGluIGNhc2Ugb2YgbGlzdCBwYXJhZ3JhcGhzXG4gICAgICAgIGJyZWFrIGlmIGVtcHR5TGluZVNraXBwZWQgPiBNQVhfU0tJUF9FTVBUWV9MSU5FX0FMTE9XRURcbiAgICAgICAgZW1wdHlMaW5lU2tpcHBlZCArPSAxXG4gICAgICBlbHNlICMgZmluZCBwYXJlbnQgd2l0aCBpbmRlbnRhdGlvbiA9IGN1cnJlbnQgaW5kZW50YXRpb24gLSAxXG4gICAgICAgIGluZGVudGF0aW9uID0gQGVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhyb3cpXG4gICAgICAgIGNvbnRpbnVlIGlmIGluZGVudGF0aW9uID49IGN1cnJlbnRJbmRlbnRhdGlvblxuICAgICAgICBuZXh0TGluZSA9IG5ldyBMaW5lTWV0YShsaW5lKS5uZXh0TGluZSBpZiBpbmRlbnRhdGlvbiA9PSBjdXJyZW50SW5kZW50YXRpb24gLSAxICYmIExpbmVNZXRhLmlzTGlzdChsaW5lKVxuICAgICAgICBicmVha1xuXG4gICAgQGVkaXRvci5zZWxlY3RUb0JlZ2lubmluZ09mTGluZSgpXG4gICAgQGVkaXRvci5pbnNlcnRUZXh0KG5leHRMaW5lKVxuXG4gIF9pc1RhYmxlUm93OiAoY3Vyc29yLCBsaW5lKSAtPlxuICAgIHJldHVybiBmYWxzZSBpZiAhY29uZmlnLmdldChcInRhYmxlTmV3TGluZUNvbnRpbnVhdGlvblwiKVxuICAgICMgZmlyc3Qgcm93IG9yIG5vdCBhIHJvd1xuICAgIHJldHVybiBmYWxzZSBpZiBjdXJzb3Iucm93IDwgMSB8fCAhdXRpbHMuaXNUYWJsZVJvdyhsaW5lKVxuICAgICMgY2FzZSAwLCBhdCB0YWJsZSBzZXBhcmF0b3IsIGNvbnRpbnVlIHRhYmxlIHJvd1xuICAgIHJldHVybiB0cnVlIGlmIHV0aWxzLmlzVGFibGVTZXBhcmF0b3IobGluZSlcbiAgICAjIGNhc2UgMSwgYXQgdGFibGUgcm93LCBwcmV2aW91cyBsaW5lIGlzIGEgcm93LCBjb250aW51ZSByb3dcbiAgICByZXR1cm4gdHJ1ZSBpZiB1dGlscy5pc1RhYmxlUm93KEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coY3Vyc29yLnJvdy0xKSlcbiAgICAjIGVsc2UsIGF0IHRhYmxlIGhlYWQsIHByZXZpb3VzIGxpbmUgaXMgbm90IGEgcm93LCBkbyBub3QgY29udGludWUgcm93XG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgX2luc2VydE5ld2xpbmVXaXRob3V0VGFibGVDb2x1bW5zOiAtPlxuICAgIEBlZGl0b3Iuc2VsZWN0TGluZXNDb250YWluaW5nQ3Vyc29ycygpXG4gICAgQGVkaXRvci5pbnNlcnRUZXh0KFwiXFxuXCIpXG5cbiAgX2luc2VydE5ld2xpbmVXaXRoVGFibGVDb2x1bW5zOiAocm93KSAtPlxuICAgIG9wdGlvbnMgPVxuICAgICAgbnVtT2ZDb2x1bW5zOiBNYXRoLm1heCgxLCByb3cuY29sdW1ucy5sZW5ndGgpXG4gICAgICBleHRyYVBpcGVzOiByb3cuZXh0cmFQaXBlc1xuICAgICAgY29sdW1uV2lkdGg6IDFcbiAgICAgIGNvbHVtbldpZHRoczogW11cbiAgICAgIGFsaWdubWVudDogY29uZmlnLmdldChcInRhYmxlQWxpZ25tZW50XCIpXG4gICAgICBhbGlnbm1lbnRzOiBbXVxuXG4gICAgbmV3TGluZSA9IHV0aWxzLmNyZWF0ZVRhYmxlUm93KFtdLCBvcHRpb25zKVxuICAgIEBlZGl0b3IubW92ZVRvRW5kT2ZMaW5lKClcbiAgICBAZWRpdG9yLmluc2VydFRleHQoXCJcXG4je25ld0xpbmV9XCIpXG4gICAgQGVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZkxpbmUoKVxuICAgIEBlZGl0b3IubW92ZVRvTmV4dFdvcmRCb3VuZGFyeSgpIGlmIG9wdGlvbnMuZXh0cmFQaXBlc1xuXG4gIGluZGVudExpc3RMaW5lOiAoZSwgc2VsZWN0aW9uKSAtPlxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpIGlmIEBfaXNSYW5nZVNlbGVjdGlvbihzZWxlY3Rpb24pXG5cbiAgICBjdXJzb3IgPSBzZWxlY3Rpb24uZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKClcbiAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjdXJzb3Iucm93KVxuICAgIGxpbmVNZXRhID0gbmV3IExpbmVNZXRhKGxpbmUpXG5cbiAgICBpZiBsaW5lTWV0YS5pc0xpc3QoXCJvbFwiKVxuICAgICAgbGluZSA9IFwiI3tAZWRpdG9yLmdldFRhYlRleHQoKX0je2xpbmVNZXRhLmxpbmVIZWFkKGxpbmVNZXRhLmRlZmF1bHRIZWFkKX0je2xpbmVNZXRhLmJvZHl9XCJcbiAgICAgIEBfcmVwbGFjZUxpbmUoc2VsZWN0aW9uLCBjdXJzb3Iucm93LCBsaW5lKVxuXG4gICAgZWxzZSBpZiBsaW5lTWV0YS5pc0xpc3QoXCJ1bFwiKVxuICAgICAgYnVsbGV0ID0gY29uZmlnLmdldChcInRlbXBsYXRlVmFyaWFibGVzLnVsQnVsbGV0I3tAZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KGN1cnNvci5yb3cpKzF9XCIpXG4gICAgICBidWxsZXQgPSBidWxsZXQgfHwgY29uZmlnLmdldChcInRlbXBsYXRlVmFyaWFibGVzLnVsQnVsbGV0XCIpIHx8IGxpbmVNZXRhLmRlZmF1bHRIZWFkXG5cbiAgICAgIGxpbmUgPSBcIiN7QGVkaXRvci5nZXRUYWJUZXh0KCl9I3tsaW5lTWV0YS5saW5lSGVhZChidWxsZXQpfSN7bGluZU1ldGEuYm9keX1cIlxuICAgICAgQF9yZXBsYWNlTGluZShzZWxlY3Rpb24sIGN1cnNvci5yb3csIGxpbmUpXG5cbiAgICBlbHNlIGlmIEBfaXNBdExpbmVCZWdpbm5pbmcobGluZSwgY3Vyc29yLmNvbHVtbikgIyBpbmRlbnQgb24gc3RhcnQgb2YgbGluZVxuICAgICAgc2VsZWN0aW9uLmluZGVudCgpXG4gICAgZWxzZVxuICAgICAgZS5hYm9ydEtleUJpbmRpbmcoKVxuXG4gIF9pc1JhbmdlU2VsZWN0aW9uOiAoc2VsZWN0aW9uKSAtPlxuICAgIGhlYWQgPSBzZWxlY3Rpb24uZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKClcbiAgICB0YWlsID0gc2VsZWN0aW9uLmdldFRhaWxCdWZmZXJQb3NpdGlvbigpXG5cbiAgICBoZWFkLnJvdyAhPSB0YWlsLnJvdyB8fCBoZWFkLmNvbHVtbiAhPSB0YWlsLmNvbHVtblxuXG4gIF9yZXBsYWNlTGluZTogKHNlbGVjdGlvbiwgcm93LCBsaW5lKSAtPlxuICAgIHJhbmdlID0gc2VsZWN0aW9uLmN1cnNvci5nZXRDdXJyZW50TGluZUJ1ZmZlclJhbmdlKClcbiAgICBzZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgc2VsZWN0aW9uLmluc2VydFRleHQobGluZSlcblxuICBfaXNBdExpbmVCZWdpbm5pbmc6IChsaW5lLCBjb2wpIC0+XG4gICAgY29sID09IDAgfHwgbGluZS5zdWJzdHJpbmcoMCwgY29sKS50cmltKCkgPT0gXCJcIlxuIl19
