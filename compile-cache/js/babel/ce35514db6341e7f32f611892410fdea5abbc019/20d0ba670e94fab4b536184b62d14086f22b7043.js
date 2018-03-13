Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exportNotebook;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _fs = require("fs");

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var dialog = require("electron").remote.dialog;

var _require = require("@nteract/commutable");

var stringifyNotebook = _require.stringifyNotebook;

function exportNotebook() {
  // TODO: Refactor to use promises, this is a bit "nested".
  var saveNotebook = function saveNotebook(filename) {
    if (!filename) {
      return;
    }
    var ext = path.extname(filename) === "" ? ".ipynb" : "";
    var fname = "" + filename + ext;
    (0, _fs.writeFile)(fname, stringifyNotebook(_store2["default"].notebook), function (err, data) {
      if (err) {
        atom.notifications.addError("Error saving file", {
          detail: err.message
        });
      } else {
        atom.notifications.addSuccess("Save successful", {
          detail: "Saved notebook as " + fname
        });
      }
    });
  };
  dialog.showSaveDialog(saveNotebook);
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2V4cG9ydC1ub3RlYm9vay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBVXdCLGNBQWM7Ozs7OztvQkFSaEIsTUFBTTs7SUFBaEIsSUFBSTs7a0JBQ1UsSUFBSTs7cUJBS1osU0FBUzs7OztJQUhuQixNQUFNLEdBQUssT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBckMsTUFBTTs7ZUFDZ0IsT0FBTyxDQUFDLHFCQUFxQixDQUFDOztJQUFwRCxpQkFBaUIsWUFBakIsaUJBQWlCOztBQUlWLFNBQVMsY0FBYyxHQUFHOztBQUV2QyxNQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBWSxRQUFRLEVBQUU7QUFDdEMsUUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGFBQU87S0FDUjtBQUNELFFBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDMUQsUUFBTSxLQUFLLFFBQU0sUUFBUSxHQUFHLEdBQUcsQUFBRSxDQUFDO0FBQ2xDLHVCQUFVLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxtQkFBTSxRQUFRLENBQUMsRUFBRSxVQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDdEUsVUFBSSxHQUFHLEVBQUU7QUFDUCxZQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtBQUMvQyxnQkFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPO1NBQ3BCLENBQUMsQ0FBQztPQUNKLE1BQU07QUFDTCxZQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtBQUMvQyxnQkFBTSx5QkFBdUIsS0FBSyxBQUFFO1NBQ3JDLENBQUMsQ0FBQztPQUNKO0tBQ0YsQ0FBQyxDQUFDO0dBQ0osQ0FBQztBQUNGLFFBQU0sQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7Q0FDckMiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvZXhwb3J0LW5vdGVib29rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgd3JpdGVGaWxlIH0gZnJvbSBcImZzXCI7XG5cbmNvbnN0IHsgZGlhbG9nIH0gPSByZXF1aXJlKFwiZWxlY3Ryb25cIikucmVtb3RlO1xuY29uc3QgeyBzdHJpbmdpZnlOb3RlYm9vayB9ID0gcmVxdWlyZShcIkBudGVyYWN0L2NvbW11dGFibGVcIik7XG5cbmltcG9ydCBzdG9yZSBmcm9tIFwiLi9zdG9yZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBleHBvcnROb3RlYm9vaygpIHtcbiAgLy8gVE9ETzogUmVmYWN0b3IgdG8gdXNlIHByb21pc2VzLCB0aGlzIGlzIGEgYml0IFwibmVzdGVkXCIuXG4gIGNvbnN0IHNhdmVOb3RlYm9vayA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gICAgaWYgKCFmaWxlbmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoZmlsZW5hbWUpID09PSBcIlwiID8gXCIuaXB5bmJcIiA6IFwiXCI7XG4gICAgY29uc3QgZm5hbWUgPSBgJHtmaWxlbmFtZX0ke2V4dH1gO1xuICAgIHdyaXRlRmlsZShmbmFtZSwgc3RyaW5naWZ5Tm90ZWJvb2soc3RvcmUubm90ZWJvb2spLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiRXJyb3Igc2F2aW5nIGZpbGVcIiwge1xuICAgICAgICAgIGRldGFpbDogZXJyLm1lc3NhZ2VcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcIlNhdmUgc3VjY2Vzc2Z1bFwiLCB7XG4gICAgICAgICAgZGV0YWlsOiBgU2F2ZWQgbm90ZWJvb2sgYXMgJHtmbmFtZX1gXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBkaWFsb2cuc2hvd1NhdmVEaWFsb2coc2F2ZU5vdGVib29rKTtcbn1cbiJdfQ==