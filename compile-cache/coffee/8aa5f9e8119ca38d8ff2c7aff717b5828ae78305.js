(function() {
  var IndentGuideImprovedElement, Point, createElementsForGuides, realLength, styleGuide;

  Point = require('atom').Point;

  styleGuide = function(element, point, length, stack, active, editor, basePixelPos, lineHeightPixel, baseScreenRow, scrollTop, scrollLeft) {
    var indentSize, left, row, top;
    element.classList.add('indent-guide-improved');
    element.classList[stack ? 'add' : 'remove']('indent-guide-stack');
    element.classList[active ? 'add' : 'remove']('indent-guide-active');
    if (editor.isFoldedAtBufferRow(Math.max(point.row - 1, 0))) {
      element.style.height = '0px';
      return;
    }
    row = editor.screenRowForBufferRow(point.row);
    indentSize = editor.getTabLength();
    left = point.column * indentSize * editor.getDefaultCharWidth() - scrollLeft;
    top = basePixelPos + lineHeightPixel * (row - baseScreenRow) - scrollTop;
    element.style.left = left + "px";
    element.style.top = top + "px";
    element.style.height = (editor.getLineHeightInPixels() * realLength(point.row, length, editor)) + "px";
    element.style.display = 'block';
    return element.style['z-index'] = 1;
  };

  realLength = function(row, length, editor) {
    var row1, row2;
    row1 = editor.screenRowForBufferRow(row);
    row2 = editor.screenRowForBufferRow(row + length);
    return row2 - row1;
  };

  IndentGuideImprovedElement = document.registerElement('indent-guide-improved');

  createElementsForGuides = function(editorElement, fns) {
    var count, createNum, existNum, itemParent, items, j, k, neededNum, recycleNum, results, results1;
    itemParent = editorElement.querySelector('.scroll-view');
    items = itemParent.querySelectorAll('.indent-guide-improved');
    existNum = items.length;
    neededNum = fns.length;
    createNum = Math.max(neededNum - existNum, 0);
    recycleNum = Math.min(neededNum, existNum);
    count = 0;
    (function() {
      results = [];
      for (var j = 0; 0 <= existNum ? j < existNum : j > existNum; 0 <= existNum ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this).forEach(function(i) {
      var node;
      node = items.item(i);
      if (i < recycleNum) {
        return fns[count++](node);
      } else {
        return node.parentNode.removeChild(node);
      }
    });
    (function() {
      results1 = [];
      for (var k = 0; 0 <= createNum ? k < createNum : k > createNum; 0 <= createNum ? k++ : k--){ results1.push(k); }
      return results1;
    }).apply(this).forEach(function(i) {
      var newNode;
      newNode = new IndentGuideImprovedElement();
      newNode.classList.add('overlayer');
      fns[count++](newNode);
      return itemParent.appendChild(newNode);
    });
    if (count !== neededNum) {
      throw 'System Error';
    }
  };

  module.exports = {
    createElementsForGuides: createElementsForGuides,
    styleGuide: styleGuide
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9pbmRlbnQtZ3VpZGUtaW1wcm92ZWQvbGliL2luZGVudC1ndWlkZS1pbXByb3ZlZC1lbGVtZW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFFVixVQUFBLEdBQWEsU0FBQyxPQUFELEVBQVUsS0FBVixFQUFpQixNQUFqQixFQUF5QixLQUF6QixFQUFnQyxNQUFoQyxFQUF3QyxNQUF4QyxFQUFnRCxZQUFoRCxFQUE4RCxlQUE5RCxFQUErRSxhQUEvRSxFQUE4RixTQUE5RixFQUF5RyxVQUF6RztBQUNYLFFBQUE7SUFBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQWxCLENBQXNCLHVCQUF0QjtJQUNBLE9BQU8sQ0FBQyxTQUFVLENBQUcsS0FBSCxHQUFjLEtBQWQsR0FBeUIsUUFBekIsQ0FBbEIsQ0FBcUQsb0JBQXJEO0lBQ0EsT0FBTyxDQUFDLFNBQVUsQ0FBRyxNQUFILEdBQWUsS0FBZixHQUEwQixRQUExQixDQUFsQixDQUFzRCxxQkFBdEQ7SUFFQSxJQUFHLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixJQUFJLENBQUMsR0FBTCxDQUFTLEtBQUssQ0FBQyxHQUFOLEdBQVksQ0FBckIsRUFBd0IsQ0FBeEIsQ0FBM0IsQ0FBSDtNQUNFLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBZCxHQUF1QjtBQUN2QixhQUZGOztJQUlBLEdBQUEsR0FBTSxNQUFNLENBQUMscUJBQVAsQ0FBNkIsS0FBSyxDQUFDLEdBQW5DO0lBQ04sVUFBQSxHQUFhLE1BQU0sQ0FBQyxZQUFQLENBQUE7SUFDYixJQUFBLEdBQU8sS0FBSyxDQUFDLE1BQU4sR0FBZSxVQUFmLEdBQTRCLE1BQU0sQ0FBQyxtQkFBUCxDQUFBLENBQTVCLEdBQTJEO0lBQ2xFLEdBQUEsR0FBTSxZQUFBLEdBQWUsZUFBQSxHQUFrQixDQUFDLEdBQUEsR0FBTSxhQUFQLENBQWpDLEdBQXlEO0lBRS9ELE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBZCxHQUF3QixJQUFELEdBQU07SUFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFkLEdBQXVCLEdBQUQsR0FBSztJQUMzQixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQWQsR0FDSSxDQUFDLE1BQU0sQ0FBQyxxQkFBUCxDQUFBLENBQUEsR0FBaUMsVUFBQSxDQUFXLEtBQUssQ0FBQyxHQUFqQixFQUFzQixNQUF0QixFQUE4QixNQUE5QixDQUFsQyxDQUFBLEdBQXdFO0lBQzVFLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBZCxHQUF3QjtXQUN4QixPQUFPLENBQUMsS0FBTSxDQUFBLFNBQUEsQ0FBZCxHQUEyQjtFQW5CaEI7O0VBcUJiLFVBQUEsR0FBYSxTQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsTUFBZDtBQUNYLFFBQUE7SUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLHFCQUFQLENBQTZCLEdBQTdCO0lBQ1AsSUFBQSxHQUFPLE1BQU0sQ0FBQyxxQkFBUCxDQUE2QixHQUFBLEdBQU0sTUFBbkM7V0FDUCxJQUFBLEdBQU87RUFISTs7RUFLYiwwQkFBQSxHQUE2QixRQUFRLENBQUMsZUFBVCxDQUF5Qix1QkFBekI7O0VBRTdCLHVCQUFBLEdBQTBCLFNBQUMsYUFBRCxFQUFnQixHQUFoQjtBQUN4QixRQUFBO0lBQUEsVUFBQSxHQUFhLGFBQWEsQ0FBQyxhQUFkLENBQTRCLGNBQTVCO0lBQ2IsS0FBQSxHQUFRLFVBQVUsQ0FBQyxnQkFBWCxDQUE0Qix3QkFBNUI7SUFDUixRQUFBLEdBQVcsS0FBSyxDQUFDO0lBQ2pCLFNBQUEsR0FBWSxHQUFHLENBQUM7SUFDaEIsU0FBQSxHQUFZLElBQUksQ0FBQyxHQUFMLENBQVMsU0FBQSxHQUFZLFFBQXJCLEVBQStCLENBQS9CO0lBQ1osVUFBQSxHQUFhLElBQUksQ0FBQyxHQUFMLENBQVMsU0FBVCxFQUFvQixRQUFwQjtJQUNiLEtBQUEsR0FBUTtJQUNSOzs7O2tCQUFjLENBQUMsT0FBZixDQUF1QixTQUFDLENBQUQ7QUFDckIsVUFBQTtNQUFBLElBQUEsR0FBTyxLQUFLLENBQUMsSUFBTixDQUFXLENBQVg7TUFDUCxJQUFHLENBQUEsR0FBSSxVQUFQO2VBQ0UsR0FBSSxDQUFBLEtBQUEsRUFBQSxDQUFKLENBQWEsSUFBYixFQURGO09BQUEsTUFBQTtlQUdFLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBaEIsQ0FBNEIsSUFBNUIsRUFIRjs7SUFGcUIsQ0FBdkI7SUFNQTs7OztrQkFBZSxDQUFDLE9BQWhCLENBQXdCLFNBQUMsQ0FBRDtBQUN0QixVQUFBO01BQUEsT0FBQSxHQUFjLElBQUEsMEJBQUEsQ0FBQTtNQUNkLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsV0FBdEI7TUFDQSxHQUFJLENBQUEsS0FBQSxFQUFBLENBQUosQ0FBYSxPQUFiO2FBQ0EsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsT0FBdkI7SUFKc0IsQ0FBeEI7SUFLQSxJQUE0QixLQUFBLEtBQVMsU0FBckM7QUFBQSxZQUFNLGVBQU47O0VBbkJ3Qjs7RUFxQjFCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSx1QkFBQSxFQUF5Qix1QkFBekI7SUFDQSxVQUFBLEVBQVksVUFEWjs7QUFwREYiLCJzb3VyY2VzQ29udGVudCI6WyJ7UG9pbnR9ID0gcmVxdWlyZSAnYXRvbSdcblxuc3R5bGVHdWlkZSA9IChlbGVtZW50LCBwb2ludCwgbGVuZ3RoLCBzdGFjaywgYWN0aXZlLCBlZGl0b3IsIGJhc2VQaXhlbFBvcywgbGluZUhlaWdodFBpeGVsLCBiYXNlU2NyZWVuUm93LCBzY3JvbGxUb3AsIHNjcm9sbExlZnQpIC0+XG4gIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaW5kZW50LWd1aWRlLWltcHJvdmVkJylcbiAgZWxlbWVudC5jbGFzc0xpc3RbaWYgc3RhY2sgdGhlbiAnYWRkJyBlbHNlICdyZW1vdmUnXSgnaW5kZW50LWd1aWRlLXN0YWNrJylcbiAgZWxlbWVudC5jbGFzc0xpc3RbaWYgYWN0aXZlIHRoZW4gJ2FkZCcgZWxzZSAncmVtb3ZlJ10oJ2luZGVudC1ndWlkZS1hY3RpdmUnKVxuXG4gIGlmIGVkaXRvci5pc0ZvbGRlZEF0QnVmZmVyUm93KE1hdGgubWF4KHBvaW50LnJvdyAtIDEsIDApKVxuICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzBweCdcbiAgICByZXR1cm5cblxuICByb3cgPSBlZGl0b3Iuc2NyZWVuUm93Rm9yQnVmZmVyUm93KHBvaW50LnJvdylcbiAgaW5kZW50U2l6ZSA9IGVkaXRvci5nZXRUYWJMZW5ndGgoKVxuICBsZWZ0ID0gcG9pbnQuY29sdW1uICogaW5kZW50U2l6ZSAqIGVkaXRvci5nZXREZWZhdWx0Q2hhcldpZHRoKCkgLSBzY3JvbGxMZWZ0XG4gIHRvcCA9IGJhc2VQaXhlbFBvcyArIGxpbmVIZWlnaHRQaXhlbCAqIChyb3cgLSBiYXNlU2NyZWVuUm93KSAtIHNjcm9sbFRvcFxuXG4gIGVsZW1lbnQuc3R5bGUubGVmdCA9IFwiI3tsZWZ0fXB4XCJcbiAgZWxlbWVudC5zdHlsZS50b3AgPSBcIiN7dG9wfXB4XCJcbiAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPVxuICAgIFwiI3tlZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKCkgKiByZWFsTGVuZ3RoKHBvaW50LnJvdywgbGVuZ3RoLCBlZGl0b3IpfXB4XCJcbiAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICBlbGVtZW50LnN0eWxlWyd6LWluZGV4J10gPSAxXG5cbnJlYWxMZW5ndGggPSAocm93LCBsZW5ndGgsIGVkaXRvcikgLT5cbiAgcm93MSA9IGVkaXRvci5zY3JlZW5Sb3dGb3JCdWZmZXJSb3cocm93KVxuICByb3cyID0gZWRpdG9yLnNjcmVlblJvd0ZvckJ1ZmZlclJvdyhyb3cgKyBsZW5ndGgpXG4gIHJvdzIgLSByb3cxXG5cbkluZGVudEd1aWRlSW1wcm92ZWRFbGVtZW50ID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdpbmRlbnQtZ3VpZGUtaW1wcm92ZWQnKVxuXG5jcmVhdGVFbGVtZW50c0Zvckd1aWRlcyA9IChlZGl0b3JFbGVtZW50LCBmbnMpIC0+XG4gIGl0ZW1QYXJlbnQgPSBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY3JvbGwtdmlldycpXG4gIGl0ZW1zID0gaXRlbVBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW5kZW50LWd1aWRlLWltcHJvdmVkJylcbiAgZXhpc3ROdW0gPSBpdGVtcy5sZW5ndGhcbiAgbmVlZGVkTnVtID0gZm5zLmxlbmd0aFxuICBjcmVhdGVOdW0gPSBNYXRoLm1heChuZWVkZWROdW0gLSBleGlzdE51bSwgMClcbiAgcmVjeWNsZU51bSA9IE1hdGgubWluKG5lZWRlZE51bSwgZXhpc3ROdW0pXG4gIGNvdW50ID0gMFxuICBbMC4uLmV4aXN0TnVtXS5mb3JFYWNoIChpKSAtPlxuICAgIG5vZGUgPSBpdGVtcy5pdGVtKGkpXG4gICAgaWYgaSA8IHJlY3ljbGVOdW1cbiAgICAgIGZuc1tjb3VudCsrXShub2RlKVxuICAgIGVsc2VcbiAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKVxuICBbMC4uLmNyZWF0ZU51bV0uZm9yRWFjaCAoaSkgLT5cbiAgICBuZXdOb2RlID0gbmV3IEluZGVudEd1aWRlSW1wcm92ZWRFbGVtZW50KClcbiAgICBuZXdOb2RlLmNsYXNzTGlzdC5hZGQoJ292ZXJsYXllcicpXG4gICAgZm5zW2NvdW50KytdKG5ld05vZGUpXG4gICAgaXRlbVBhcmVudC5hcHBlbmRDaGlsZChuZXdOb2RlKVxuICB0aHJvdyAnU3lzdGVtIEVycm9yJyB1bmxlc3MgY291bnQgaXMgbmVlZGVkTnVtXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY3JlYXRlRWxlbWVudHNGb3JHdWlkZXM6IGNyZWF0ZUVsZW1lbnRzRm9yR3VpZGVzXG4gIHN0eWxlR3VpZGU6IHN0eWxlR3VpZGVcbiJdfQ==
