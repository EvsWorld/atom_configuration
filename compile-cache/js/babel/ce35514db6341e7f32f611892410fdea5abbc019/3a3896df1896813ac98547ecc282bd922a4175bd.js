Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MarkerStore = (function () {
  function MarkerStore() {
    _classCallCheck(this, MarkerStore);

    this.markers = new Map();
  }

  _createClass(MarkerStore, [{
    key: "clear",
    value: function clear() {
      this.markers.forEach(function (bubble) {
        return bubble.destroy();
      });
      this.markers.clear();
    }
  }, {
    key: "clearOnRow",
    value: function clearOnRow(row) {
      var _this = this;

      var destroyed = false;
      this.markers.forEach(function (bubble, key) {
        var _bubble$marker$getBufferRange = bubble.marker.getBufferRange();

        var start = _bubble$marker$getBufferRange.start;
        var end = _bubble$marker$getBufferRange.end;

        if (start.row <= row && row <= end.row) {
          _this["delete"](key);
          destroyed = true;
        }
      });
      return destroyed;
    }
  }, {
    key: "new",
    value: function _new(bubble) {
      this.markers.set(bubble.marker.id, bubble);
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var bubble = this.markers.get(key);
      if (bubble) bubble.destroy();
      this.markers["delete"](key);
    }
  }]);

  return MarkerStore;
})();

exports["default"] = MarkerStore;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3N0b3JlL21hcmtlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7SUFJcUIsV0FBVztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7U0FDOUIsT0FBTyxHQUE0QixJQUFJLEdBQUcsRUFBRTs7O2VBRHpCLFdBQVc7O1dBR3pCLGlCQUFHO0FBQ04sVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNO2VBQWlCLE1BQU0sQ0FBQyxPQUFPLEVBQUU7T0FBQSxDQUFDLENBQUM7QUFDL0QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUN0Qjs7O1dBRVMsb0JBQUMsR0FBVyxFQUFFOzs7QUFDdEIsVUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFjLEdBQUcsRUFBYTs0Q0FDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUU7O1lBQTdDLEtBQUssaUNBQUwsS0FBSztZQUFFLEdBQUcsaUNBQUgsR0FBRzs7QUFDbEIsWUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRTtBQUN0Qyx5QkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLG1CQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ2xCO09BQ0YsQ0FBQyxDQUFDO0FBQ0gsYUFBTyxTQUFTLENBQUM7S0FDbEI7OztXQUVFLGNBQUMsTUFBa0IsRUFBRTtBQUN0QixVQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUM1Qzs7O1dBRUssaUJBQUMsR0FBVyxFQUFFO0FBQ2xCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLFVBQUksTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM3QixVQUFJLENBQUMsT0FBTyxVQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDMUI7OztTQTVCa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvbWFya2Vycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB0eXBlIFJlc3VsdFZpZXcgZnJvbSBcIi4vLi4vY29tcG9uZW50cy9yZXN1bHQtdmlld1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrZXJTdG9yZSB7XG4gIG1hcmtlcnM6IE1hcDxudW1iZXIsIFJlc3VsdFZpZXc+ID0gbmV3IE1hcCgpO1xuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKChidWJibGU6IFJlc3VsdFZpZXcpID0+IGJ1YmJsZS5kZXN0cm95KCkpO1xuICAgIHRoaXMubWFya2Vycy5jbGVhcigpO1xuICB9XG5cbiAgY2xlYXJPblJvdyhyb3c6IG51bWJlcikge1xuICAgIGxldCBkZXN0cm95ZWQgPSBmYWxzZTtcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaCgoYnViYmxlOiBSZXN1bHRWaWV3LCBrZXk6IG51bWJlcikgPT4ge1xuICAgICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSBidWJibGUubWFya2VyLmdldEJ1ZmZlclJhbmdlKCk7XG4gICAgICBpZiAoc3RhcnQucm93IDw9IHJvdyAmJiByb3cgPD0gZW5kLnJvdykge1xuICAgICAgICB0aGlzLmRlbGV0ZShrZXkpO1xuICAgICAgICBkZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkZXN0cm95ZWQ7XG4gIH1cblxuICBuZXcoYnViYmxlOiBSZXN1bHRWaWV3KSB7XG4gICAgdGhpcy5tYXJrZXJzLnNldChidWJibGUubWFya2VyLmlkLCBidWJibGUpO1xuICB9XG5cbiAgZGVsZXRlKGtleTogbnVtYmVyKSB7XG4gICAgY29uc3QgYnViYmxlID0gdGhpcy5tYXJrZXJzLmdldChrZXkpO1xuICAgIGlmIChidWJibGUpIGJ1YmJsZS5kZXN0cm95KCk7XG4gICAgdGhpcy5tYXJrZXJzLmRlbGV0ZShrZXkpO1xuICB9XG59XG4iXX0=