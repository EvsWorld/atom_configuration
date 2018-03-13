Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _nteractTransforms = require("@nteract/transforms");

var _nteractTransformPlotly = require("@nteract/transform-plotly");

var _nteractTransformPlotly2 = _interopRequireDefault(_nteractTransformPlotly);

var _nteractTransformVega = require("@nteract/transform-vega");

// We can easily add other transforms here:
var additionalTransforms = [_nteractTransformPlotly2["default"], _nteractTransformVega.VegaLite, _nteractTransformVega.Vega];

var _additionalTransforms$reduce = additionalTransforms.reduce(_nteractTransforms.registerTransform, {
  transforms: _nteractTransforms.standardTransforms,
  displayOrder: _nteractTransforms.standardDisplayOrder
});

var transforms = _additionalTransforms$reduce.transforms;
var displayOrder = _additionalTransforms$reduce.displayOrder;
exports.transforms = transforms;
exports.displayOrder = displayOrder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvdHJhbnNmb3Jtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7aUNBTU8scUJBQXFCOztzQ0FDQSwyQkFBMkI7Ozs7b0NBQ3hCLHlCQUF5Qjs7O0FBR3hELElBQU0sb0JBQWdDLEdBQUcsaUdBQWlDLENBQUM7O21DQUUvQixvQkFBb0IsQ0FBQyxNQUFNLHVDQUVyRTtBQUNFLFlBQVUsdUNBQW9CO0FBQzlCLGNBQVkseUNBQXNCO0NBQ25DLENBQ0Y7O0lBTmMsVUFBVSxnQ0FBVixVQUFVO0lBQUUsWUFBWSxnQ0FBWixZQUFZIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvdHJhbnNmb3Jtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7XG4gIHN0YW5kYXJkVHJhbnNmb3JtcyxcbiAgc3RhbmRhcmREaXNwbGF5T3JkZXIsXG4gIHJlZ2lzdGVyVHJhbnNmb3JtXG59IGZyb20gXCJAbnRlcmFjdC90cmFuc2Zvcm1zXCI7XG5pbXBvcnQgUGxvdGx5VHJhbnNmb3JtIGZyb20gXCJAbnRlcmFjdC90cmFuc2Zvcm0tcGxvdGx5XCI7XG5pbXBvcnQgeyBWZWdhTGl0ZSwgVmVnYSB9IGZyb20gXCJAbnRlcmFjdC90cmFuc2Zvcm0tdmVnYVwiO1xuXG4vLyBXZSBjYW4gZWFzaWx5IGFkZCBvdGhlciB0cmFuc2Zvcm1zIGhlcmU6XG5jb25zdCBhZGRpdGlvbmFsVHJhbnNmb3JtczogQXJyYXk8YW55PiA9IFtQbG90bHlUcmFuc2Zvcm0sIFZlZ2FMaXRlLCBWZWdhXTtcblxuZXhwb3J0IGNvbnN0IHsgdHJhbnNmb3JtcywgZGlzcGxheU9yZGVyIH0gPSBhZGRpdGlvbmFsVHJhbnNmb3Jtcy5yZWR1Y2UoXG4gIHJlZ2lzdGVyVHJhbnNmb3JtLFxuICB7XG4gICAgdHJhbnNmb3Jtczogc3RhbmRhcmRUcmFuc2Zvcm1zLFxuICAgIGRpc3BsYXlPcmRlcjogc3RhbmRhcmREaXNwbGF5T3JkZXJcbiAgfVxuKTtcbiJdfQ==