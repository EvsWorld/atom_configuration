(function() {
  var Point, fillInNulls, getGuides, getVirtualIndent, mergeCropped, statesAboveVisible, statesBelowVisible, statesInvisible, supportingIndents, toG, toGuides, uniq,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Point = require('atom').Point;

  toG = function(indents, begin, depth, cursorRows) {
    var gs, isActive, isStack, ptr, r, ref;
    ptr = begin;
    isActive = false;
    isStack = false;
    gs = [];
    while (ptr < indents.length && depth <= indents[ptr]) {
      if (depth < indents[ptr]) {
        r = toG(indents, ptr, depth + 1, cursorRows);
        if ((ref = r.guides[0]) != null ? ref.stack : void 0) {
          isStack = true;
        }
        Array.prototype.push.apply(gs, r.guides);
        ptr = r.ptr;
      } else {
        if (indexOf.call(cursorRows, ptr) >= 0) {
          isActive = true;
          isStack = true;
        }
        ptr++;
      }
    }
    if (depth !== 0) {
      gs.unshift({
        length: ptr - begin,
        point: new Point(begin, depth - 1),
        active: isActive,
        stack: isStack
      });
    }
    return {
      guides: gs,
      ptr: ptr
    };
  };

  fillInNulls = function(indents) {
    var res;
    res = indents.reduceRight(function(acc, cur) {
      if (cur === null) {
        acc.r.unshift(acc.i);
        return {
          r: acc.r,
          i: acc.i
        };
      } else {
        acc.r.unshift(cur);
        return {
          r: acc.r,
          i: cur
        };
      }
    }, {
      r: [],
      i: 0
    });
    return res.r;
  };

  toGuides = function(indents, cursorRows) {
    var ind;
    ind = fillInNulls(indents.map(function(i) {
      if (i === null) {
        return null;
      } else {
        return Math.floor(i);
      }
    }));
    return toG(ind, 0, 0, cursorRows).guides;
  };

  getVirtualIndent = function(getIndentFn, row, lastRow) {
    var i, ind, j, ref, ref1;
    for (i = j = ref = row, ref1 = lastRow; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      ind = getIndentFn(i);
      if (ind != null) {
        return ind;
      }
    }
    return 0;
  };

  uniq = function(values) {
    var j, last, len, newVals, v;
    newVals = [];
    last = null;
    for (j = 0, len = values.length; j < len; j++) {
      v = values[j];
      if (newVals.length === 0 || last !== v) {
        newVals.push(v);
      }
      last = v;
    }
    return newVals;
  };

  mergeCropped = function(guides, above, below, height) {
    guides.forEach(function(g) {
      var ref, ref1, ref2, ref3;
      if (g.point.row === 0) {
        if (ref = g.point.column, indexOf.call(above.active, ref) >= 0) {
          g.active = true;
        }
        if (ref1 = g.point.column, indexOf.call(above.stack, ref1) >= 0) {
          g.stack = true;
        }
      }
      if (height < g.point.row + g.length) {
        if (ref2 = g.point.column, indexOf.call(below.active, ref2) >= 0) {
          g.active = true;
        }
        if (ref3 = g.point.column, indexOf.call(below.stack, ref3) >= 0) {
          return g.stack = true;
        }
      }
    });
    return guides;
  };

  supportingIndents = function(visibleLast, lastRow, getIndentFn) {
    var count, indent, indents;
    if (getIndentFn(visibleLast) != null) {
      return [];
    }
    indents = [];
    count = visibleLast + 1;
    while (count <= lastRow) {
      indent = getIndentFn(count);
      indents.push(indent);
      if (indent != null) {
        break;
      }
      count++;
    }
    return indents;
  };

  getGuides = function(visibleFrom, visibleTo, lastRow, cursorRows, getIndentFn) {
    var above, below, guides, j, results, support, visibleIndents, visibleLast;
    visibleLast = Math.min(visibleTo, lastRow);
    visibleIndents = (function() {
      results = [];
      for (var j = visibleFrom; visibleFrom <= visibleLast ? j <= visibleLast : j >= visibleLast; visibleFrom <= visibleLast ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this).map(getIndentFn);
    support = supportingIndents(visibleLast, lastRow, getIndentFn);
    guides = toGuides(visibleIndents.concat(support), cursorRows.map(function(c) {
      return c - visibleFrom;
    }));
    above = statesAboveVisible(cursorRows, visibleFrom - 1, getIndentFn, lastRow);
    below = statesBelowVisible(cursorRows, visibleLast + 1, getIndentFn, lastRow);
    return mergeCropped(guides, above, below, visibleLast - visibleFrom);
  };

  statesInvisible = function(cursorRows, start, getIndentFn, lastRow, isAbove) {
    var active, cursors, i, ind, j, k, l, len, m, minIndent, ref, ref1, results, results1, results2, stack, vind;
    if ((isAbove ? start < 0 : lastRow < start)) {
      return {
        stack: [],
        active: []
      };
    }
    cursors = isAbove ? uniq(cursorRows.filter(function(r) {
      return r <= start;
    }).sort(), true).reverse() : uniq(cursorRows.filter(function(r) {
      return start <= r;
    }).sort(), true);
    active = [];
    stack = [];
    minIndent = Number.MAX_VALUE;
    ref = (isAbove ? (function() {
      results = [];
      for (var k = start; start <= 0 ? k <= 0 : k >= 0; start <= 0 ? k++ : k--){ results.push(k); }
      return results;
    }).apply(this) : (function() {
      results1 = [];
      for (var l = start; start <= lastRow ? l <= lastRow : l >= lastRow; start <= lastRow ? l++ : l--){ results1.push(l); }
      return results1;
    }).apply(this));
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      ind = getIndentFn(i);
      if (ind != null) {
        minIndent = Math.min(minIndent, ind);
      }
      if (cursors.length === 0 || minIndent === 0) {
        break;
      }
      if (cursors[0] === i) {
        cursors.shift();
        vind = getVirtualIndent(getIndentFn, i, lastRow);
        minIndent = Math.min(minIndent, vind);
        if (vind === minIndent) {
          active.push(vind - 1);
        }
        if (stack.length === 0) {
          stack = (function() {
            results2 = [];
            for (var m = 0, ref1 = minIndent - 1; 0 <= ref1 ? m <= ref1 : m >= ref1; 0 <= ref1 ? m++ : m--){ results2.push(m); }
            return results2;
          }).apply(this);
        }
      }
    }
    return {
      stack: uniq(stack.sort()),
      active: uniq(active.sort())
    };
  };

  statesAboveVisible = function(cursorRows, start, getIndentFn, lastRow) {
    return statesInvisible(cursorRows, start, getIndentFn, lastRow, true);
  };

  statesBelowVisible = function(cursorRows, start, getIndentFn, lastRow) {
    return statesInvisible(cursorRows, start, getIndentFn, lastRow, false);
  };

  module.exports = {
    toGuides: toGuides,
    getGuides: getGuides,
    uniq: uniq,
    statesAboveVisible: statesAboveVisible,
    statesBelowVisible: statesBelowVisible
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9pbmRlbnQtZ3VpZGUtaW1wcm92ZWQvbGliL2d1aWRlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDhKQUFBO0lBQUE7O0VBQUMsUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFFVixHQUFBLEdBQU0sU0FBQyxPQUFELEVBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QixVQUF4QjtBQUNKLFFBQUE7SUFBQSxHQUFBLEdBQU07SUFDTixRQUFBLEdBQVc7SUFDWCxPQUFBLEdBQVU7SUFFVixFQUFBLEdBQUs7QUFDTCxXQUFNLEdBQUEsR0FBTSxPQUFPLENBQUMsTUFBZCxJQUF3QixLQUFBLElBQVMsT0FBUSxDQUFBLEdBQUEsQ0FBL0M7TUFDRSxJQUFHLEtBQUEsR0FBUSxPQUFRLENBQUEsR0FBQSxDQUFuQjtRQUNFLENBQUEsR0FBSSxHQUFBLENBQUksT0FBSixFQUFhLEdBQWIsRUFBa0IsS0FBQSxHQUFRLENBQTFCLEVBQTZCLFVBQTdCO1FBQ0oscUNBQWMsQ0FBRSxjQUFoQjtVQUNFLE9BQUEsR0FBVSxLQURaOztRQUVBLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQXJCLENBQTJCLEVBQTNCLEVBQStCLENBQUMsQ0FBQyxNQUFqQztRQUNBLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFMVjtPQUFBLE1BQUE7UUFPRSxJQUFHLGFBQU8sVUFBUCxFQUFBLEdBQUEsTUFBSDtVQUNFLFFBQUEsR0FBVztVQUNYLE9BQUEsR0FBVSxLQUZaOztRQUdBLEdBQUEsR0FWRjs7SUFERjtJQVlBLElBQU8sS0FBQSxLQUFTLENBQWhCO01BQ0UsRUFBRSxDQUFDLE9BQUgsQ0FDRTtRQUFBLE1BQUEsRUFBUSxHQUFBLEdBQU0sS0FBZDtRQUNBLEtBQUEsRUFBVyxJQUFBLEtBQUEsQ0FBTSxLQUFOLEVBQWEsS0FBQSxHQUFR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SUFBSSxDQUFDLEdBQUwsQ0FBUyxTQUFULEVBQW9CLElBQXBCO1FBQ1osSUFBeUIsSUFBQSxLQUFRLFNBQWpDO1VBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFBLEdBQU8sQ0FBbkIsRUFBQTs7UUFDQSxJQUE4QixLQUFLLENBQUMsTUFBTixLQUFnQixDQUE5QztVQUFBLEtBQUEsR0FBUTs7Ozt5QkFBUjtTQUxGOztBQUpGO1dBVUE7TUFBQSxLQUFBLEVBQU8sSUFBQSxDQUFLLEtBQUssQ0FBQyxJQUFOLENBQUEsQ0FBTCxDQUFQO01BQ0EsTUFBQSxFQUFRLElBQUEsQ0FBSyxNQUFNLENBQUMsSUFBUCxDQUFBLENBQUwsQ0FEUjs7RUF2QmdCOztFQTBCbEIsa0JBQUEsR0FBcUIsU0FBQyxVQUFELEVBQWEsS0FBYixFQUFvQixXQUFwQixFQUFpQyxPQUFqQztXQUNuQixlQUFBLENBQWdCLFVBQWhCLEVBQTRCLEtBQTVCLEVBQW1DLFdBQW5DLEVBQWdELE9BQWhELEVBQXlELElBQXpEO0VBRG1COztFQUdyQixrQkFBQSxHQUFxQixTQUFDLFVBQUQsRUFBYSxLQUFiLEVBQW9CLFdBQXBCLEVBQWlDLE9BQWpDO1dBQ25CLGVBQUEsQ0FBZ0IsVUFBaEIsRUFBNEIsS0FBNUIsRUFBbUMsV0FBbkMsRUFBZ0QsT0FBaEQsRUFBeUQsS0FBekQ7RUFEbUI7O0VBR3JCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsUUFBVjtJQUNBLFNBQUEsRUFBVyxTQURYO0lBRUEsSUFBQSxFQUFNLElBRk47SUFHQSxrQkFBQSxFQUFvQixrQkFIcEI7SUFJQSxrQkFBQSxFQUFvQixrQkFKcEI7O0FBcklGIiwic291cmNlc0NvbnRlbnQiOlsie1BvaW50fSA9IHJlcXVpcmUgJ2F0b20nXG5cbnRvRyA9IChpbmRlbnRzLCBiZWdpbiwgZGVwdGgsIGN1cnNvclJvd3MpIC0+XG4gIHB0ciA9IGJlZ2luXG4gIGlzQWN0aXZlID0gZmFsc2VcbiAgaXNTdGFjayA9IGZhbHNlXG5cbiAgZ3MgPSBbXVxuICB3aGlsZSBwdHIgPCBpbmRlbnRzLmxlbmd0aCAmJiBkZXB0aCA8PSBpbmRlbnRzW3B0cl1cbiAgICBpZiBkZXB0aCA8IGluZGVudHNbcHRyXVxuICAgICAgciA9IHRvRyhpbmRlbnRzLCBwdHIsIGRlcHRoICsgMSwgY3Vyc29yUm93cylcbiAgICAgIGlmIHIuZ3VpZGVzWzBdPy5zdGFja1xuICAgICAgICBpc1N0YWNrID0gdHJ1ZVxuICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZ3MsIHIuZ3VpZGVzKVxuICAgICAgcHRyID0gci5wdHJcbiAgICBlbHNlXG4gICAgICBpZiBwdHIgaW4gY3Vyc29yUm93c1xuICAgICAgICBpc0FjdGl2ZSA9IHRydWVcbiAgICAgICAgaXNTdGFjayA9IHRydWVcbiAgICAgIHB0cisrXG4gIHVubGVzcyBkZXB0aCBpcyAwXG4gICAgZ3MudW5zaGlmdFxuICAgICAgbGVuZ3RoOiBwdHIgLSBiZWdpblxuICAgICAgcG9pbnQ6IG5ldyBQb2ludChiZWdpbiwgZGVwdGggLSAxKVxuICAgICAgYWN0aXZlOiBpc0FjdGl2ZVxuICAgICAgc3RhY2s6IGlzU3RhY2tcbiAgZ3VpZGVzOiBnc1xuICBwdHI6IHB0clxuXG5maWxsSW5OdWxscyA9IChpbmRlbnRzKSAtPlxuICByZXMgPSBpbmRlbnRzLnJlZHVjZVJpZ2h0KFxuICAgIChhY2MsIGN1cikgLT5cbiAgICAgIGlmIGN1ciBpcyBudWxsXG4gICAgICAgIGFjYy5yLnVuc2hpZnQoYWNjLmkpXG5cbiAgICAgICAgcjogYWNjLnJcbiAgICAgICAgaTogYWNjLmlcbiAgICAgIGVsc2VcbiAgICAgICAgYWNjLnIudW5zaGlmdChjdXIpXG5cbiAgICAgICAgcjogYWNjLnJcbiAgICAgICAgaTogY3VyXG4gICAgcjogW11cbiAgICBpOiAwKVxuICByZXMuclxuXG50b0d1aWRlcyA9IChpbmRlbnRzLCBjdXJzb3JSb3dzKSAtPlxuICBpbmQgPSBmaWxsSW5OdWxscyBpbmRlbnRzLm1hcCAoaSkgLT4gaWYgaSBpcyBudWxsIHRoZW4gbnVsbCBlbHNlIE1hdGguZmxvb3IoaSlcbiAgdG9HKGluZCwgMCwgMCwgY3Vyc29yUm93cykuZ3VpZGVzXG5cbmdldFZpcnR1YWxJbmRlbnQgPSAoZ2V0SW5kZW50Rm4sIHJvdywgbGFzdFJvdykgLT5cbiAgZm9yIGkgaW4gW3Jvdy4ubGFzdFJvd11cbiAgICBpbmQgPSBnZXRJbmRlbnRGbihpKVxuICAgIHJldHVybiBpbmQgaWYgaW5kP1xuICAwXG5cbnVuaXEgPSAodmFsdWVzKSAtPlxuICBuZXdWYWxzID0gW11cbiAgbGFzdCA9IG51bGxcbiAgZm9yIHYgaW4gdmFsdWVzXG4gICAgaWYgbmV3VmFscy5sZW5ndGggaXMgMCBvciBsYXN0IGlzbnQgdlxuICAgICAgbmV3VmFscy5wdXNoKHYpXG4gICAgbGFzdCA9IHZcbiAgbmV3VmFsc1xuXG5tZXJnZUNyb3BwZWQgPSAoZ3VpZGVzLCBhYm92ZSwgYmVsb3csIGhlaWdodCkgLT5cbiAgZ3VpZGVzLmZvckVhY2ggKGcpIC0+XG4gICAgaWYgZy5wb2ludC5yb3cgaXMgMFxuICAgICAgaWYgZy5wb2ludC5jb2x1bW4gaW4gYWJvdmUuYWN0aXZlXG4gICAgICAgIGcuYWN0aXZlID0gdHJ1ZVxuICAgICAgaWYgZy5wb2ludC5jb2x1bW4gaW4gYWJvdmUuc3RhY2tcbiAgICAgICAgZy5zdGFjayA9IHRydWVcbiAgICBpZiBoZWlnaHQgPCBnLnBvaW50LnJvdyArIGcubGVuZ3RoXG4gICAgICBpZiBnLnBvaW50LmNvbHVtbiBpbiBiZWxvdy5hY3RpdmVcbiAgICAgICAgZy5hY3RpdmUgPSB0cnVlXG4gICAgICBpZiBnLnBvaW50LmNvbHVtbiBpbiBiZWxvdy5zdGFja1xuICAgICAgICBnLnN0YWNrID0gdHJ1ZVxuICBndWlkZXNcblxuc3VwcG9ydGluZ0luZGVudHMgPSAodmlzaWJsZUxhc3QsIGxhc3RSb3csIGdldEluZGVudEZuKSAtPlxuICByZXR1cm4gW10gaWYgZ2V0SW5kZW50Rm4odmlzaWJsZUxhc3QpP1xuICBpbmRlbnRzID0gW11cbiAgY291bnQgPSB2aXNpYmxlTGFzdCArIDFcbiAgd2hpbGUgY291bnQgPD0gbGFzdFJvd1xuICAgIGluZGVudCA9IGdldEluZGVudEZuKGNvdW50KVxuICAgIGluZGVudHMucHVzaChpbmRlbnQpXG4gICAgYnJlYWsgaWYgaW5kZW50P1xuICAgIGNvdW50KytcbiAgaW5kZW50c1xuXG5nZXRHdWlkZXMgPSAodmlzaWJsZUZyb20sIHZpc2libGVUbywgbGFzdFJvdywgY3Vyc29yUm93cywgZ2V0SW5kZW50Rm4pIC0+XG4gIHZpc2libGVMYXN0ID0gTWF0aC5taW4odmlzaWJsZVRvLCBsYXN0Um93KVxuICB2aXNpYmxlSW5kZW50cyA9IFt2aXNpYmxlRnJvbS4udmlzaWJsZUxhc3RdLm1hcCBnZXRJbmRlbnRGblxuICBzdXBwb3J0ID0gc3VwcG9ydGluZ0luZGVudHModmlzaWJsZUxhc3QsIGxhc3RSb3csIGdldEluZGVudEZuKVxuICBndWlkZXMgPSB0b0d1aWRlcyhcbiAgICB2aXNpYmxlSW5kZW50cy5jb25jYXQoc3VwcG9ydCksIGN1cnNvclJvd3MubWFwKChjKSAtPiBjIC0gdmlzaWJsZUZyb20pKVxuICBhYm92ZSA9IHN0YXRlc0Fib3ZlVmlzaWJsZShjdXJzb3JSb3dzLCB2aXNpYmxlRnJvbSAtIDEsIGdldEluZGVudEZuLCBsYXN0Um93KVxuICBiZWxvdyA9IHN0YXRlc0JlbG93VmlzaWJsZShjdXJzb3JSb3dzLCB2aXNpYmxlTGFzdCArIDEsIGdldEluZGVudEZuLCBsYXN0Um93KVxuICBtZXJnZUNyb3BwZWQoZ3VpZGVzLCBhYm92ZSwgYmVsb3csIHZpc2libGVMYXN0IC0gdmlzaWJsZUZyb20pXG5cbnN0YXRlc0ludmlzaWJsZSA9IChjdXJzb3JSb3dzLCBzdGFydCwgZ2V0SW5kZW50Rm4sIGxhc3RSb3csIGlzQWJvdmUpIC0+XG4gIGlmIChpZiBpc0Fib3ZlIHRoZW4gc3RhcnQgPCAwIGVsc2UgbGFzdFJvdyA8IHN0YXJ0KVxuICAgIHJldHVybiB7XG4gICAgICBzdGFjazogW11cbiAgICAgIGFjdGl2ZTogW11cbiAgICB9XG4gIGN1cnNvcnMgPSBpZiBpc0Fib3ZlXG4gICAgdW5pcShjdXJzb3JSb3dzLmZpbHRlcigocikgLT4gciA8PSBzdGFydCkuc29ydCgpLCB0cnVlKS5yZXZlcnNlKClcbiAgZWxzZVxuICAgIHVuaXEoY3Vyc29yUm93cy5maWx0ZXIoKHIpIC0+IHN0YXJ0IDw9IHIpLnNvcnQoKSwgdHJ1ZSlcbiAgYWN0aXZlID0gW11cbiAgc3RhY2sgPSBbXVxuICBtaW5JbmRlbnQgPSBOdW1iZXIuTUFYX1ZBTFVFXG4gIGZvciBpIGluIChpZiBpc0Fib3ZlIHRoZW4gW3N0YXJ0Li4wXSBlbHNlIFtzdGFydC4ubGFzdFJvd10pXG4gICAgaW5kID0gZ2V0SW5kZW50Rm4oaSlcbiAgICBtaW5JbmRlbnQgPSBNYXRoLm1pbihtaW5JbmRlbnQsIGluZCkgaWYgaW5kP1xuICAgIGJyZWFrIGlmIGN1cnNvcnMubGVuZ3RoIGlzIDAgb3IgbWluSW5kZW50IGlzIDBcbiAgICBpZiBjdXJzb3JzWzBdIGlzIGlcbiAgICAgIGN1cnNvcnMuc2hpZnQoKVxuICAgICAgdmluZCA9IGdldFZpcnR1YWxJbmRlbnQoZ2V0SW5kZW50Rm4sIGksIGxhc3RSb3cpXG4gICAgICBtaW5JbmRlbnQgPSBNYXRoLm1pbihtaW5JbmRlbnQsIHZpbmQpXG4gICAgICBhY3RpdmUucHVzaCh2aW5kIC0gMSkgaWYgdmluZCBpcyBtaW5JbmRlbnRcbiAgICAgIHN0YWNrID0gWzAuLm1pbkluZGVudCAtIDFdIGlmIHN0YWNrLmxlbmd0aCBpcyAwXG4gIHN0YWNrOiB1bmlxKHN0YWNrLnNvcnQoKSlcbiAgYWN0aXZlOiB1bmlxKGFjdGl2ZS5zb3J0KCkpXG5cbnN0YXRlc0Fib3ZlVmlzaWJsZSA9IChjdXJzb3JSb3dzLCBzdGFydCwgZ2V0SW5kZW50Rm4sIGxhc3RSb3cpIC0+XG4gIHN0YXRlc0ludmlzaWJsZShjdXJzb3JSb3dzLCBzdGFydCwgZ2V0SW5kZW50Rm4sIGxhc3RSb3csIHRydWUpXG5cbnN0YXRlc0JlbG93VmlzaWJsZSA9IChjdXJzb3JSb3dzLCBzdGFydCwgZ2V0SW5kZW50Rm4sIGxhc3RSb3cpIC0+XG4gIHN0YXRlc0ludmlzaWJsZShjdXJzb3JSb3dzLCBzdGFydCwgZ2V0SW5kZW50Rm4sIGxhc3RSb3csIGZhbHNlKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHRvR3VpZGVzOiB0b0d1aWRlc1xuICBnZXRHdWlkZXM6IGdldEd1aWRlc1xuICB1bmlxOiB1bmlxXG4gIHN0YXRlc0Fib3ZlVmlzaWJsZTogc3RhdGVzQWJvdmVWaXNpYmxlXG4gIHN0YXRlc0JlbG93VmlzaWJsZTogc3RhdGVzQmVsb3dWaXNpYmxlXG4iXX0=
