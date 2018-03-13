(function() {
  var ItemPath, ItemPathParser, _;

  ItemPathParser = require('./item-path-parser');

  _ = require('underscore-plus');

  module.exports = ItemPath = (function() {
    ItemPath.parse = function(path, startRule, types) {
      var e, exception, keywords, parsedPath;
      if (startRule == null) {
        startRule = 'ItemPathExpression';
      }
      exception = null;
      keywords = [];
      parsedPath;
      try {
        parsedPath = ItemPathParser.parse(path, {
          startRule: startRule,
          types: types
        });
      } catch (error1) {
        e = error1;
        exception = e;
      }
      if (parsedPath) {
        keywords = parsedPath.keywords;
      }
      return {
        parsedPath: parsedPath,
        keywords: keywords,
        error: exception
      };
    };

    ItemPath.evaluate = function(itemPath, contextItem, options) {
      var results;
      if (options == null) {
        options = {};
      }
      if (_.isString(itemPath)) {
        itemPath = new ItemPath(itemPath, options);
      }
      itemPath.options = options;
      results = itemPath.evaluate(contextItem);
      itemPath.options = options;
      return results;
    };

    function ItemPath(pathExpressionString, options1) {
      var parsed;
      this.pathExpressionString = pathExpressionString;
      this.options = options1;
      if (this.options == null) {
        this.options = {};
      }
      parsed = this.constructor.parse(this.pathExpressionString, void 0, this.options.types);
      this.pathExpressionAST = parsed.parsedPath;
      this.pathExpressionKeywords = parsed.keywords;
      this.pathExpressionError = parsed.error;
    }


    /*
    Section: Evaluation
     */

    ItemPath.prototype.evaluate = function(item) {
      if (this.pathExpressionAST) {
        return this.evaluatePathExpression(this.pathExpressionAST, item);
      } else {
        return [];
      }
    };

    ItemPath.prototype.evaluatePathExpression = function(pathExpressionAST, item) {
      var except, intersect, results, union;
      union = pathExpressionAST.union;
      intersect = pathExpressionAST.intersect;
      except = pathExpressionAST.except;
      results;
      if (union) {
        results = this.evaluateUnion(union, item);
      } else if (intersect) {
        results = this.evaluateIntersect(intersect, item);
      } else if (except) {
        results = this.evaluateExcept(except, item);
      } else {
        results = this.evaluatePath(pathExpressionAST, item);
      }
      this.sliceResultsFrom(pathExpressionAST.slice, results, 0);
      return results;
    };

    ItemPath.prototype.unionOutlineOrderedResults = function(results1, results2, outline) {
      var i, j, r1, r2, results;
      results = [];
      i = 0;
      j = 0;
      while (true) {
        r1 = results1[i];
        r2 = results2[j];
        if (!r1) {
          if (r2) {
            results.push.apply(results, results2.slice(j));
          }
          return results;
        } else if (!r2) {
          if (r1) {
            results.push.apply(results, results1.slice(i));
          }
          return results;
        } else if (r1 === r2) {
          results.push(r2);
          i++;
          j++;
        } else {
          if (r1.comparePosition(r2) & Node.DOCUMENT_POSITION_FOLLOWING) {
            results.push(r1);
            i++;
          } else {
            results.push(r2);
            j++;
          }
        }
      }
    };

    ItemPath.prototype.evaluateUnion = function(pathsAST, item) {
      var results1, results2;
      results1 = this.evaluatePathExpression(pathsAST[0], item);
      results2 = this.evaluatePathExpression(pathsAST[1], item);
      return this.unionOutlineOrderedResults(results1, results2, item.outline);
    };

    ItemPath.prototype.evaluateIntersect = function(pathsAST, item) {
      var i, j, r1, r2, results, results1, results2;
      results1 = this.evaluatePathExpression(pathsAST[0], item);
      results2 = this.evaluatePathExpression(pathsAST[1], item);
      results = [];
      i = 0;
      j = 0;
      while (true) {
        r1 = results1[i];
        r2 = results2[j];
        if (!r1) {
          return results;
        } else if (!r2) {
          return results;
        } else if (r1 === r2) {
          results.push(r2);
          i++;
          j++;
        } else {
          if (r1.comparePosition(r2) & Node.DOCUMENT_POSITION_FOLLOWING) {
            i++;
          } else {
            j++;
          }
        }
      }
    };

    ItemPath.prototype.evaluateExcept = function(pathsAST, item) {
      var i, j, r1, r1Index, r2, r2Index, results, results1, results2;
      results1 = this.evaluatePathExpression(pathsAST[0], item);
      results2 = this.evaluatePathExpression(pathsAST[1], item);
      results = [];
      i = 0;
      j = 0;
      while (true) {
        r1 = results1[i];
        r2 = results2[j];
        while (r1 && r2 && (r1.comparePosition(r2) & Node.DOCUMENT_POSITION_PRECEDING)) {
          j++;
          r2 = results2[j];
        }
        if (!r1) {
          return results;
        } else if (!r2) {
          results.push.apply(results, results1.slice(i));
          return results;
        } else if (r1 === r2) {
          r1Index = -1;
          r2Index = -1;
          i++;
          j++;
        } else {
          results.push(r1);
          r1Index = -1;
          i++;
        }
      }
    };

    ItemPath.prototype.evaluatePath = function(pathAST, item) {
      var context, contextResults, contexts, k, l, len, len1, outline, ref, results, step;
      outline = item.outline;
      contexts = [];
      results;
      if (pathAST.absolute) {
        item = this.options.root || item.root;
      }
      contexts.push(item);
      ref = pathAST.steps;
      for (k = 0, len = ref.length; k < len; k++) {
        step = ref[k];
        results = [];
        for (l = 0, len1 = contexts.length; l < len1; l++) {
          context = contexts[l];
          if (results.length) {
            contextResults = [];
            this.evaluateStep(step, context, contextResults);
            results = this.unionOutlineOrderedResults(results, contextResults, outline);
          } else {
            this.evaluateStep(step, context, results);
          }
        }
        contexts = results;
      }
      return results;
    };

    ItemPath.prototype.evaluateStep = function(step, item, results) {
      var each, end, from, predicate, type;
      predicate = step.predicate;
      from = results.length;
      type = step.type;
      switch (step.axis) {
        case 'ancestor-or-self':
          each = item;
          while (each) {
            if (this.evaluatePredicate(type, predicate, each)) {
              results.splice(from, 0, each);
            }
            each = each.parent;
          }
          break;
        case 'ancestor':
          each = item.parent;
          while (each) {
            if (this.evaluatePredicate(type, predicate, each)) {
              results.splice(from, 0, each);
            }
            each = each.parent;
          }
          break;
        case 'child':
          each = item.firstChild;
          while (each) {
            if (this.evaluatePredicate(type, predicate, each)) {
              results.push(each);
            }
            each = each.nextSibling;
          }
          break;
        case 'descendant-or-self':
          end = item.nextBranch;
          each = item;
          while (each && each !== end) {
            if (this.evaluatePredicate(type, predicate, each)) {
              results.push(each);
            }
            each = each.nextItem;
          }
          break;
        case 'descendant':
          end = item.nextBranch;
          each = item.firstChild;
          while (each && each !== end) {
            if (this.evaluatePredicate(type, predicate, each)) {
              results.push(each);
            }
            each = each.nextItem;
          }
          break;
        case 'following-sibling':
          each = item.nextSibling;
          while (each) {
            if (this.evaluatePredicate(type, predicate, each)) {
              results.push(each);
            }
            each = each.nextSibling;
          }
          break;
        case 'following':
          each = item.nextItem;
          while (each) {
            if (this.evaluatePredicate(type, predicate, each)) {
              results.push(each);
            }
            each = each.nextItem;
          }
          break;
        case 'parent':
          each = item.parent;
          if (each && this.evaluatePredicate(type, predicate, each)) {
            results.push(each);
          }
          break;
        case 'preceding-sibling':
          each = item.previousSibling;
          while (each) {
            if (this.evaluatePredicate(type, predicate, each)) {
              results.splice(from, 0, each);
            }
            each = each.previousSibling;
          }
          break;
        case 'preceding':
          each = item.previousItem;
          while (each) {
            if (this.evaluatePredicate(type, predicate, each)) {
              results.splice(from, 0, each);
            }
            each = each.previousItem;
          }
          break;
        case 'self':
          if (this.evaluatePredicate(type, predicate, item)) {
            results.push(item);
          }
      }
      return this.sliceResultsFrom(step.slice, results, from);
    };

    ItemPath.prototype.evaluatePredicate = function(type, predicate, item) {
      var andP, attributePath, attributeValue, modifier, notP, orP, predicateValueCache, relation, value;
      if (type !== '*' && type !== item.getAttribute('data-type')) {
        return false;
      } else if (predicate === '*') {
        return true;
      } else if (andP = predicate.and) {
        return this.evaluatePredicate('*', andP[0], item) && this.evaluatePredicate('*', andP[1], item);
      } else if (orP = predicate.or) {
        return this.evaluatePredicate('*', orP[0], item) || this.evaluatePredicate('*', orP[1], item);
      } else if (notP = predicate.not) {
        return !this.evaluatePredicate('*', notP, item);
      } else {
        attributePath = predicate.attributePath;
        relation = predicate.relation;
        modifier = predicate.modifier;
        value = predicate.value;
        if (!relation && !value) {
          return this.valueForAttributePath(attributePath, item) !== null;
        }
        predicateValueCache = predicate.predicateValueCache;
        if (!predicateValueCache) {
          predicateValueCache = this.convertValueForModifier(value, modifier);
          predicate.predicateValueCache = predicateValueCache;
        }
        attributeValue = this.valueForAttributePath(attributePath, item);
        if (attributeValue !== null) {
          attributeValue = this.convertValueForModifier(attributeValue.toString(), modifier);
        }
        return this.evaluateRelation(attributeValue, relation, predicateValueCache, predicate);
      }
    };

    ItemPath.prototype.valueForAttributePath = function(attributePath, item) {
      var attributeName, ref;
      attributeName = attributePath[0];
      attributeName = ((ref = this.options.attributeShortcuts) != null ? ref[attributeName] : void 0) || attributeName;
      switch (attributeName) {
        case 'text':
          return item.bodyText;
        default:
          return item.getAttribute('data-' + attributeName);
      }
    };

    ItemPath.prototype.convertValueForModifier = function(value, modifier) {
      if (modifier === 'i') {
        return value.toLowerCase();
      } else if (modifier === 'n') {
        return parseFloat(value);
      } else if (modifier === 'd') {
        return Date.parse(value);
      } else {
        return value;
      }
    };

    ItemPath.prototype.evaluateRelation = function(left, relation, right, predicate) {
      var error, joinedValueRegexCache;
      switch (relation) {
        case '=':
          return left === right;
        case '!=':
          return left !== right;
        case '<':
          if (left != null) {
            return left < right;
          } else {
            return false;
          }
          break;
        case '>':
          if (left != null) {
            return left > right;
          } else {
            return false;
          }
          break;
        case '<=':
          if (left != null) {
            return left <= right;
          } else {
            return false;
          }
          break;
        case '>=':
          if (left != null) {
            return left >= right;
          } else {
            return false;
          }
          break;
        case 'beginswith':
          if (left) {
            return left.startsWith(right);
          } else {
            return false;
          }
          break;
        case 'contains':
          if (left) {
            return left.indexOf(right) !== -1;
          } else {
            return false;
          }
          break;
        case 'endswith':
          if (left) {
            return left.endsWith(right);
          } else {
            return false;
          }
          break;
        case 'matches':
          if (left != null) {
            joinedValueRegexCache = predicate.joinedValueRegexCache;
            if (joinedValueRegexCache === void 0) {
              try {
                joinedValueRegexCache = new RegExp(right.toString());
              } catch (error1) {
                error = error1;
                joinedValueRegexCache = null;
              }
              predicate.joinedValueRegexCache = joinedValueRegexCache;
            }
            if (joinedValueRegexCache) {
              return left.toString().match(joinedValueRegexCache);
            } else {
              return false;
            }
          } else {
            return false;
          }
      }
    };

    ItemPath.prototype.sliceResultsFrom = function(slice, results, from) {
      var end, length, sliced, start;
      if (slice) {
        length = results.length - from;
        start = slice.start;
        end = slice.end;
        if (length === 0) {
          return;
        }
        if (end > length) {
          end = length;
        }
        if (start !== 0 || end !== length) {
          sliced;
          if (start < 0) {
            start += length;
            if (start < 0) {
              start = 0;
            }
          }
          if (start > length - 1) {
            start = length - 1;
          }
          if (end === null) {
            sliced = results[from + start];
          } else {
            if (end < 0) {
              end += length;
            }
            if (end < start) {
              end = start;
            }
            sliced = results.slice(from).slice(start, end);
          }
          return Array.prototype.splice.apply(results, [from, results.length - from].concat(sliced));
        }
      }
    };


    /*
    Section: AST To String
     */

    ItemPath.prototype.predicateToString = function(predicate, group) {
      var andAST, attributePath, closeGroup, error, modifier, notAST, openGroup, orAST, relation, result, value;
      if (predicate === '*') {
        return '*';
      } else {
        openGroup = group ? '(' : '';
        closeGroup = group ? ')' : '';
        if (andAST = predicate.and) {
          return openGroup + this.predicateToString(andAST[0], true) + ' and ' + this.predicateToString(andAST[1], true) + closeGroup;
        } else if (orAST = predicate.or) {
          return openGroup + this.predicateToString(orAST[0], true) + ' or ' + this.predicateToString(orAST[1], true) + closeGroup;
        } else if (notAST = predicate.not) {
          return 'not ' + this.predicateToString(notAST, true);
        } else {
          result = [];
          if (attributePath = predicate.attributePath) {
            if (!(attributePath.length === 1 && attributePath[0] === 'text')) {
              result.push('@' + attributePath.join(':'));
            }
          }
          if (relation = predicate.relation) {
            if (relation !== 'contains') {
              result.push(relation);
            }
          }
          if (modifier = predicate.modifier) {
            if (modifier !== 'i') {
              result.push('[' + modifier + ']');
            }
          }
          if (value = predicate.value) {
            try {
              ItemPathParser.parse(value, {
                startRule: 'Value'
              });
            } catch (error1) {
              error = error1;
              value = '"' + value + '"';
            }
            result.push(value);
          }
          return result.join(' ');
        }
      }
    };

    ItemPath.prototype.stepToString = function(step, first) {
      var predicate;
      predicate = this.predicateToString(step.predicate);
      switch (step.axis) {
        case 'child':
          return predicate;
        case 'descendant':
          if (first) {
            return predicate;
          } else {
            return '/' + predicate;
          }
          break;
        case 'parent':
          return '..' + predicate;
        default:
          return step.axis + '::' + predicate;
      }
    };

    ItemPath.prototype.pathToString = function(pathAST) {
      var first, firstStep, k, len, ref, step, stepStrings;
      stepStrings = [];
      firstStep = null;
      first = true;
      ref = pathAST.steps;
      for (k = 0, len = ref.length; k < len; k++) {
        step = ref[k];
        if (!firstStep) {
          firstStep = step;
          stepStrings.push(this.stepToString(step, true));
        } else {
          stepStrings.push(this.stepToString(step));
        }
      }
      if (pathAST.absolute && !(firstStep.axis === 'descendant')) {
        return '/' + stepStrings.join('/');
      } else {
        return stepStrings.join('/');
      }
    };

    ItemPath.prototype.pathExpressionToString = function(itemPath, group) {
      var closeGroup, except, intersect, openGroup, union;
      openGroup = group ? '(' : '';
      closeGroup = group ? ')' : '';
      if (union = itemPath.union) {
        return openGroup + this.pathExpressionToString(union[0], true) + ' union ' + this.pathExpressionToString(union[1], true) + closeGroup;
      } else if (intersect = itemPath.intersect) {
        return openGroup + this.pathExpressionToString(intersect[0], true) + ' intersect ' + this.pathExpressionToString(intersect[1], true) + closeGroup;
      } else if (except = itemPath.except) {
        return openGroup + this.pathExpressionToString(except[0], true) + ' except ' + this.pathExpressionToString(except[1], true) + closeGroup;
      } else {
        return this.pathToString(itemPath);
      }
    };

    ItemPath.prototype.toString = function() {
      return this.pathExpressionToString(this.pathExpressionAST);
    };

    return ItemPath;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9mb2xkaW5ndGV4dC1mb3ItYXRvbS9saWIvY29yZS9pdGVtLXBhdGguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUEsTUFBQTs7RUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUjs7RUFDakIsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFFSixNQUFNLENBQUMsT0FBUCxHQUNNO0lBRUosUUFBQyxDQUFBLEtBQUQsR0FBUSxTQUFDLElBQUQsRUFBTyxTQUFQLEVBQWtCLEtBQWxCO0FBQ04sVUFBQTs7UUFBQSxZQUFhOztNQUNiLFNBQUEsR0FBWTtNQUNaLFFBQUEsR0FBVztNQUNYO0FBRUE7UUFDRSxVQUFBLEdBQWEsY0FBYyxDQUFDLEtBQWYsQ0FBcUIsSUFBckIsRUFDWDtVQUFBLFNBQUEsRUFBVyxTQUFYO1VBQ0EsS0FBQSxFQUFPLEtBRFA7U0FEVyxFQURmO09BQUEsY0FBQTtRQUlNO1FBQ0osU0FBQSxHQUFZLEVBTGQ7O01BT0EsSUFBRyxVQUFIO1FBQ0UsUUFBQSxHQUFXLFVBQVUsQ0FBQyxTQUR4Qjs7YUFJRTtRQUFBLFVBQUEsRUFBWSxVQUFaO1FBQ0EsUUFBQSxFQUFVLFFBRFY7UUFFQSxLQUFBLEVBQU8sU0FGUDs7SUFqQkk7O0lBcUJSLFFBQUMsQ0FBQSxRQUFELEdBQVcsU0FBQyxRQUFELEVBQVcsV0FBWCxFQUF3QixPQUF4QjtBQUNULFVBQUE7O1FBQUEsVUFBVzs7TUFDWCxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsUUFBWCxDQUFIO1FBQ0UsUUFBQSxHQUFlLElBQUEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsT0FBbkIsRUFEakI7O01BRUEsUUFBUSxDQUFDLE9BQVQsR0FBbUI7TUFDbkIsT0FBQSxHQUFVLFFBQVEsQ0FBQyxRQUFULENBQWtCLFdBQWxCO01BQ1YsUUFBUSxDQUFDLE9BQVQs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d0IsS0FBTSxDQUFBLENBQUEsQ0FBOUIsRUFBa0MsSUFBbEMsQ0FBWixHQUFzRCxTQUF0RCxHQUFrRSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsS0FBTSxDQUFBLENBQUEsQ0FBOUIsRUFBa0MsSUFBbEMsQ0FBbEUsR0FBNEcsV0FEOUc7T0FBQSxNQUVLLElBQUcsU0FBQSxHQUFZLFFBQVEsQ0FBQyxTQUF4QjtlQUNILFNBQUEsR0FBWSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsU0FBVSxDQUFBLENBQUEsQ0FBbEMsRUFBc0MsSUFBdEMsQ0FBWixHQUEwRCxhQUExRCxHQUEwRSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsU0FBVSxDQUFBLENBQUEsQ0FBbEMsRUFBc0MsSUFBdEMsQ0FBMUUsR0FBd0gsV0FEckg7T0FBQSxNQUVBLElBQUcsTUFBQSxHQUFTLFFBQVEsQ0FBQyxNQUFyQjtlQUNILFNBQUEsR0FBWSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsTUFBTyxDQUFBLENBQUEsQ0FBL0IsRUFBbUMsSUFBbkMsQ0FBWixHQUF1RCxVQUF2RCxHQUFvRSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsTUFBTyxDQUFBLENBQUEsQ0FBL0IsRUFBbUMsSUFBbkMsQ0FBcEUsR0FBK0csV0FENUc7T0FBQSxNQUFBO2VBR0gsSUFBQyxDQUFBLFlBQUQsQ0FBYyxRQUFkLEVBSEc7O0lBUGlCOzt1QkFZeEIsUUFBQSxHQUFVLFNBQUE7QUFDUixhQUFPLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixJQUFDLENBQUEsaUJBQXpCO0lBREM7Ozs7O0FBdmVaIiwic291cmNlc0NvbnRlbnQiOlsiIyBDb3B5cmlnaHQgKGMpIDIwMTUgSmVzc2UgR3Jvc2plYW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cbkl0ZW1QYXRoUGFyc2VyID0gcmVxdWlyZSAnLi9pdGVtLXBhdGgtcGFyc2VyJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcblxubW9kdWxlLmV4cG9ydHM9XG5jbGFzcyBJdGVtUGF0aFxuXG4gIEBwYXJzZTogKHBhdGgsIHN0YXJ0UnVsZSwgdHlwZXMpIC0+XG4gICAgc3RhcnRSdWxlID89ICdJdGVtUGF0aEV4cHJlc3Npb24nXG4gICAgZXhjZXB0aW9uID0gbnVsbFxuICAgIGtleXdvcmRzID0gW11cbiAgICBwYXJzZWRQYXRoXG5cbiAgICB0cnlcbiAgICAgIHBhcnNlZFBhdGggPSBJdGVtUGF0aFBhcnNlci5wYXJzZSBwYXRoLFxuICAgICAgICBzdGFydFJ1bGU6IHN0YXJ0UnVsZVxuICAgICAgICB0eXBlczogdHlwZXNcbiAgICBjYXRjaCBlXG4gICAgICBleGNlcHRpb24gPSBlXG5cbiAgICBpZiBwYXJzZWRQYXRoXG4gICAgICBrZXl3b3JkcyA9IHBhcnNlZFBhdGgua2V5d29yZHNcblxuICAgIHt9ID1cbiAgICAgIHBhcnNlZFBhdGg6IHBhcnNlZFBhdGhcbiAgICAgIGtleXdvcmRzOiBrZXl3b3Jkc1xuICAgICAgZXJyb3I6IGV4Y2VwdGlvblxuXG4gIEBldmFsdWF0ZTogKGl0ZW1QYXRoLCBjb250ZXh0SXRlbSwgb3B0aW9ucykgLT5cbiAgICBvcHRpb25zID89IHt9XG4gICAgaWYgXy5pc1N0cmluZyBpdGVtUGF0aFxuICAgICAgaXRlbVBhdGggPSBuZXcgSXRlbVBhdGggaXRlbVBhdGgsIG9wdGlvbnNcbiAgICBpdGVtUGF0aC5vcHRpb25zID0gb3B0aW9uc1xuICAgIHJlc3VsdHMgPSBpdGVtUGF0aC5ldmFsdWF0ZSBjb250ZXh0SXRlbVxuICAgIGl0ZW1QYXRoLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgcmVzdWx0c1xuXG4gIGNvbnN0cnVjdG9yOiAoQHBhdGhFeHByZXNzaW9uU3RyaW5nLCBAb3B0aW9ucykgLT5cbiAgICBAb3B0aW9ucyA/PSB7fVxuICAgIHBhcnNlZCA9IEBjb25zdHJ1Y3Rvci5wYXJzZShAcGF0aEV4cHJlc3Npb25TdHJpbmcsIHVuZGVmaW5lZCwgQG9wdGlvbnMudHlwZXMpXG4gICAgQHBhdGhFeHByZXNzaW9uQVNUID0gcGFyc2VkLnBhcnNlZFBhdGhcbiAgICBAcGF0aEV4cHJlc3Npb25LZXl3b3JkcyA9IHBhcnNlZC5rZXl3b3Jkc1xuICAgIEBwYXRoRXhwcmVzc2lvbkVycm9yID0gcGFyc2VkLmVycm9yXG5cbiAgIyMjXG4gIFNlY3Rpb246IEV2YWx1YXRpb25cbiAgIyMjXG5cbiAgZXZhbHVhdGU6IChpdGVtKSAtPlxuICAgIGlmIEBwYXRoRXhwcmVzc2lvbkFTVFxuICAgICAgQGV2YWx1YXRlUGF0aEV4cHJlc3Npb24gQHBhdGhFeHByZXNzaW9uQVNULCBpdGVtXG4gICAgZWxzZVxuICAgICAgW11cblxuICBldmFsdWF0ZVBhdGhFeHByZXNzaW9uOiAocGF0aEV4cHJlc3Npb25BU1QsIGl0ZW0pIC0+XG4gICAgdW5pb24gPSBwYXRoRXhwcmVzc2lvbkFTVC51bmlvblxuICAgIGludGVyc2VjdCA9IHBhdGhFeHByZXNzaW9uQVNULmludGVyc2VjdFxuICAgIGV4Y2VwdCA9IHBhdGhFeHByZXNzaW9uQVNULmV4Y2VwdFxuICAgIHJlc3VsdHNcblxuICAgIGlmIHVuaW9uXG4gICAgICByZXN1bHRzID0gQGV2YWx1YXRlVW5pb24gdW5pb24sIGl0ZW1cbiAgICBlbHNlIGlmIGludGVyc2VjdFxuICAgICAgcmVzdWx0cyA9IEBldmFsdWF0ZUludGVyc2VjdCBpbnRlcnNlY3QsIGl0ZW1cbiAgICBlbHNlIGlmIGV4Y2VwdFxuICAgICAgcmVzdWx0cyA9IEBldmFsdWF0ZUV4Y2VwdCBleGNlcHQsIGl0ZW1cbiAgICBlbHNlXG4gICAgICByZXN1bHRzID0gQGV2YWx1YXRlUGF0aCBwYXRoRXhwcmVzc2lvbkFTVCwgaXRlbVxuXG4gICAgQHNsaWNlUmVzdWx0c0Zyb20gcGF0aEV4cHJlc3Npb25BU1Quc2xpY2UsIHJlc3VsdHMsIDBcblxuICAgIHJlc3VsdHNcblxuICB1bmlvbk91dGxpbmVPcmRlcmVkUmVzdWx0czogKHJlc3VsdHMxLCByZXN1bHRzMiwgb3V0bGluZSkgLT5cbiAgICByZXN1bHRzID0gW11cbiAgICBpID0gMFxuICAgIGogPSAwXG5cbiAgICB3aGlsZSB0cnVlXG4gICAgICByMSA9IHJlc3VsdHMxW2ldXG4gICAgICByMiA9IHJlc3VsdHMyW2pdXG4gICAgICB1bmxlc3MgcjFcbiAgICAgICAgaWYgcjJcbiAgICAgICAgICByZXN1bHRzLnB1c2guYXBwbHkocmVzdWx0cywgcmVzdWx0czIuc2xpY2UoaikpXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICBlbHNlIHVubGVzcyByMlxuICAgICAgICBpZiByMVxuICAgICAgICAgIHJlc3VsdHMucHVzaC5hcHBseShyZXN1bHRzLCByZXN1bHRzMS5zbGljZShpKSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIGVsc2UgaWYgcjEgaXMgcjJcbiAgICAgICAgcmVzdWx0cy5wdXNoKHIyKVxuICAgICAgICBpKytcbiAgICAgICAgaisrXG4gICAgICBlbHNlXG4gICAgICAgIGlmIHIxLmNvbXBhcmVQb3NpdGlvbihyMikgJiBOb2RlLkRPQ1VNRU5UX1BPU0lUSU9OX0ZPTExPV0lOR1xuICAgICAgICAgIHJlc3VsdHMucHVzaChyMSlcbiAgICAgICAgICBpKytcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlc3VsdHMucHVzaChyMilcbiAgICAgICAgICBqKytcblxuICBldmFsdWF0ZVVuaW9uOiAocGF0aHNBU1QsIGl0ZW0pIC0+XG4gICAgcmVzdWx0czEgPSBAZXZhbHVhdGVQYXRoRXhwcmVzc2lvbiBwYXRoc0FTVFswXSwgaXRlbVxuICAgIHJlc3VsdHMyID0gQGV2YWx1YXRlUGF0aEV4cHJlc3Npb24gcGF0aHNBU1RbMV0sIGl0ZW1cbiAgICBAdW5pb25PdXRsaW5lT3JkZXJlZFJlc3VsdHMgcmVzdWx0czEsIHJlc3VsdHMyLCBpdGVtLm91dGxpbmVcblxuICBldmFsdWF0ZUludGVyc2VjdDogKHBhdGhzQVNULCBpdGVtKSAtPlxuICAgIHJlc3VsdHMxID0gQGV2YWx1YXRlUGF0aEV4cHJlc3Npb24gcGF0aHNBU1RbMF0sIGl0ZW1cbiAgICByZXN1bHRzMiA9IEBldmFsdWF0ZVBhdGhFeHByZXNzaW9uIHBhdGhzQVNUWzFdLCBpdGVtXG4gICAgcmVzdWx0cyA9IFtdXG4gICAgaSA9IDBcbiAgICBqID0gMFxuXG4gICAgd2hpbGUgdHJ1ZVxuICAgICAgcjEgPSByZXN1bHRzMVtpXVxuICAgICAgcjIgPSByZXN1bHRzMltqXVxuXG4gICAgICB1bmxlc3MgcjFcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIGVsc2UgdW5sZXNzIHIyXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICBlbHNlIGlmIHIxIGlzIHIyXG4gICAgICAgIHJlc3VsdHMucHVzaChyMilcbiAgICAgICAgaSsrXG4gICAgICAgIGorK1xuICAgICAgZWxzZVxuICAgICAgICBpZiByMS5jb21wYXJlUG9zaXRpb24ocjIpICYgTm9kZS5ET0NVTUVOVF9QT1NJVElPTl9GT0xMT1dJTkdcbiAgICAgICAgICBpKytcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGorK1xuXG4gIGV2YWx1YXRlRXhjZXB0OiAocGF0aHNBU1QsIGl0ZW0pIC0+XG4gICAgcmVzdWx0czEgPSBAZXZhbHVhdGVQYXRoRXhwcmVzc2lvbiBwYXRoc0FTVFswXSwgaXRlbVxuICAgIHJlc3VsdHMyID0gQGV2YWx1YXRlUGF0aEV4cHJlc3Npb24gcGF0aHNBU1RbMV0sIGl0ZW1cbiAgICByZXN1bHRzID0gW11cbiAgICBpID0gMFxuICAgIGogPSAwXG5cbiAgICB3aGlsZSB0cnVlXG4gICAgICByMSA9IHJlc3VsdHMxW2ldXG4gICAgICByMiA9IHJlc3VsdHMyW2pdXG5cbiAgICAgIHdoaWxlIHIxIGFuZCByMiBhbmQgKHIxLmNvbXBhcmVQb3NpdGlvbihyMikgJiBOb2RlLkRPQ1VNRU5UX1BPU0lUSU9OX1BSRUNFRElORylcbiAgICAgICAgaisrXG4gICAgICAgIHIyID0gcmVzdWx0czJbal1cblxuICAgICAgdW5sZXNzIHIxXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICBlbHNlIHVubGVzcyByMlxuICAgICAgICByZXN1bHRzLnB1c2guYXBwbHkocmVzdWx0cywgcmVzdWx0czEuc2xpY2UoaSkpXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICBlbHNlIGlmIHIxIGlzIHIyXG4gICAgICAgIHIxSW5kZXggPSAtMVxuICAgICAgICByMkluZGV4ID0gLTFcbiAgICAgICAgaSsrXG4gICAgICAgIGorK1xuICAgICAgZWxzZVxuICAgICAgICByZXN1bHRzLnB1c2gocjEpXG4gICAgICAgIHIxSW5kZXggPSAtMVxuICAgICAgICBpKytcblxuICBldmFsdWF0ZVBhdGg6IChwYXRoQVNULCBpdGVtKSAtPlxuICAgIG91dGxpbmUgPSBpdGVtLm91dGxpbmVcbiAgICBjb250ZXh0cyA9IFtdXG4gICAgcmVzdWx0c1xuXG4gICAgaWYgcGF0aEFTVC5hYnNvbHV0ZVxuICAgICAgaXRlbSA9IEBvcHRpb25zLnJvb3Qgb3IgaXRlbS5yb290XG5cbiAgICBjb250ZXh0cy5wdXNoIGl0ZW1cblxuICAgIGZvciBzdGVwIGluIHBhdGhBU1Quc3RlcHNcbiAgICAgIHJlc3VsdHMgPSBbXVxuICAgICAgZm9yIGNvbnRleHQgaW4gY29udGV4dHNcbiAgICAgICAgaWYgcmVzdWx0cy5sZW5ndGhcbiAgICAgICAgICAjIElmIGV2YWx1YXRpbmcgZnJvbSBtdWx0aXBsZSBjb250ZXh0cyBhbmQgd2UgaGF2ZSBzb21lIHJlc3VsdHNcbiAgICAgICAgICAjIGFscmVhZHkgbWVyZ2UgdGhlIG5ldyBzZXQgb2YgY29udGV4dCByZXN1bHRzIGluIHdpdGggdGhlIGV4aXN0aW5nLlxuICAgICAgICAgIGNvbnRleHRSZXN1bHRzID0gW11cbiAgICAgICAgICBAZXZhbHVhdGVTdGVwIHN0ZXAsIGNvbnRleHQsIGNvbnRleHRSZXN1bHRzXG4gICAgICAgICAgcmVzdWx0cyA9IEB1bmlvbk91dGxpbmVPcmRlcmVkUmVzdWx0cyByZXN1bHRzLCBjb250ZXh0UmVzdWx0cywgb3V0bGluZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGV2YWx1YXRlU3RlcCBzdGVwLCBjb250ZXh0LCByZXN1bHRzXG4gICAgICBjb250ZXh0cyA9IHJlc3VsdHNcbiAgICByZXN1bHRzXG5cbiAgZXZhbHVhdGVTdGVwOiAoc3RlcCwgaXRlbSwgcmVzdWx0cykgLT5cbiAgICBwcmVkaWNhdGUgPSBzdGVwLnByZWRpY2F0ZVxuICAgIGZyb20gPSByZXN1bHRzLmxlbmd0aFxuICAgIHR5cGUgPSBzdGVwLnR5cGVcblxuICAgIHN3aXRjaCBzdGVwLmF4aXNcbiAgICAgIHdoZW4gJ2FuY2VzdG9yLW9yLXNlbGYnXG4gICAgICAgIGVhY2ggPSBpdGVtXG4gICAgICAgIHdoaWxlIGVhY2hcbiAgICAgICAgICBpZiBAZXZhbHVhdGVQcmVkaWNhdGUgdHlwZSwgcHJlZGljYXRlLCBlYWNoXG4gICAgICAgICAgICByZXN1bHRzLnNwbGljZSBmcm9tLCAwLCBlYWNoXG4gICAgICAgICAgZWFjaCA9IGVhY2gucGFyZW50XG5cbiAgICAgIHdoZW4gJ2FuY2VzdG9yJ1xuICAgICAgICBlYWNoID0gaXRlbS5wYXJlbnRcbiAgICAgICAgd2hpbGUgZWFjaFxuICAgICAgICAgIGlmIEBldmFsdWF0ZVByZWRpY2F0ZSB0eXBlLCBwcmVkaWNhdGUsIGVhY2hcbiAgICAgICAgICAgIHJlc3VsdHMuc3BsaWNlIGZyb20sIDAsIGVhY2hcbiAgICAgICAgICBlYWNoID0gZWFjaC5wYXJlbnRcblxuICAgICAgd2hlbiAnY2hpbGQnXG4gICAgICAgIGVhY2ggPSBpdGVtLmZpcnN0Q2hpbGRcbiAgICAgICAgd2hpbGUgZWFjaFxuICAgICAgICAgIGlmIEBldmFsdWF0ZVByZWRpY2F0ZSB0eXBlLCBwcmVkaWNhdGUsIGVhY2hcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCBlYWNoXG4gICAgICAgICAgZWFjaCA9IGVhY2gubmV4dFNpYmxpbmdcblxuICAgICAgd2hlbiAnZGVzY2VuZGFudC1vci1zZWxmJ1xuICAgICAgICBlbmQgPSBpdGVtLm5leHRCcmFuY2hcbiAgICAgICAgZWFjaCA9IGl0ZW1cbiAgICAgICAgd2hpbGUgZWFjaCBhbmQgZWFjaCBpc250IGVuZFxuICAgICAgICAgIGlmIEBldmFsdWF0ZVByZWRpY2F0ZSB0eXBlLCBwcmVkaWNhdGUsIGVhY2hcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCBlYWNoXG4gICAgICAgICAgZWFjaCA9IGVhY2gubmV4dEl0ZW1cblxuICAgICAgd2hlbiAnZGVzY2VuZGFudCdcbiAgICAgICAgZW5kID0gaXRlbS5uZXh0QnJhbmNoXG4gICAgICAgIGVhY2ggPSBpdGVtLmZpcnN0Q2hpbGRcbiAgICAgICAgd2hpbGUgZWFjaCBhbmQgZWFjaCBpc250IGVuZFxuICAgICAgICAgIGlmIEBldmFsdWF0ZVByZWRpY2F0ZSB0eXBlLCBwcmVkaWNhdGUsIGVhY2hcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCBlYWNoXG4gICAgICAgICAgZWFjaCA9IGVhY2gubmV4dEl0ZW1cblxuICAgICAgd2hlbiAnZm9sbG93aW5nLXNpYmxpbmcnXG4gICAgICAgIGVhY2ggPSBpdGVtLm5leHRTaWJsaW5nXG4gICAgICAgIHdoaWxlIGVhY2hcbiAgICAgICAgICBpZiBAZXZhbHVhdGVQcmVkaWNhdGUgdHlwZSwgcHJlZGljYXRlLCBlYWNoXG4gICAgICAgICAgICByZXN1bHRzLnB1c2ggZWFjaFxuICAgICAgICAgIGVhY2ggPSBlYWNoLm5leHRTaWJsaW5nXG5cbiAgICAgIHdoZW4gJ2ZvbGxvd2luZydcbiAgICAgICAgZWFjaCA9IGl0ZW0ubmV4dEl0ZW1cbiAgICAgICAgd2hpbGUgZWFjaFxuICAgICAgICAgIGlmIEBldmFsdWF0ZVByZWRpY2F0ZSB0eXBlLCBwcmVkaWNhdGUsIGVhY2hcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCBlYWNoXG4gICAgICAgICAgZWFjaCA9IGVhY2gubmV4dEl0ZW1cblxuICAgICAgd2hlbiAncGFyZW50J1xuICAgICAgICBlYWNoID0gaXRlbS5wYXJlbnRcbiAgICAgICAgaWYgZWFjaCBhbmQgQGV2YWx1YXRlUHJlZGljYXRlIHR5cGUsIHByZWRpY2F0ZSwgZWFjaFxuICAgICAgICAgIHJlc3VsdHMucHVzaCBlYWNoXG5cbiAgICAgIHdoZW4gJ3ByZWNlZGluZy1zaWJsaW5nJ1xuICAgICAgICBlYWNoID0gaXRlbS5wcmV2aW91c1NpYmxpbmdcbiAgICAgICAgd2hpbGUgZWFjaFxuICAgICAgICAgIGlmIEBldmFsdWF0ZVByZWRpY2F0ZSB0eXBlLCBwcmVkaWNhdGUsIGVhY2hcbiAgICAgICAgICAgIHJlc3VsdHMuc3BsaWNlIGZyb20sIDAsIGVhY2hcbiAgICAgICAgICBlYWNoID0gZWFjaC5wcmV2aW91c1NpYmxpbmdcblxuICAgICAgd2hlbiAncHJlY2VkaW5nJ1xuICAgICAgICBlYWNoID0gaXRlbS5wcmV2aW91c0l0ZW1cbiAgICAgICAgd2hpbGUgZWFjaFxuICAgICAgICAgIGlmIEBldmFsdWF0ZVByZWRpY2F0ZSB0eXBlLCBwcmVkaWNhdGUsIGVhY2hcbiAgICAgICAgICAgIHJlc3VsdHMuc3BsaWNlIGZyb20sIDAsIGVhY2hcbiAgICAgICAgICBlYWNoID0gZWFjaC5wcmV2aW91c0l0ZW1cblxuICAgICAgd2hlbiAnc2VsZidcbiAgICAgICAgaWYgQGV2YWx1YXRlUHJlZGljYXRlIHR5cGUsIHByZWRpY2F0ZSwgaXRlbVxuICAgICAgICAgIHJlc3VsdHMucHVzaCBpdGVtXG5cbiAgICBAc2xpY2VSZXN1bHRzRnJvbSBzdGVwLnNsaWNlLCByZXN1bHRzLCBmcm9tXG5cbiAgZXZhbHVhdGVQcmVkaWNhdGU6ICh0eXBlLCBwcmVkaWNhdGUsIGl0ZW0pIC0+XG4gICAgaWYgdHlwZSBpc250ICcqJyBhbmQgdHlwZSBpc250IGl0ZW0uZ2V0QXR0cmlidXRlICdkYXRhLXR5cGUnXG4gICAgICBmYWxzZVxuICAgIGVsc2UgaWYgcHJlZGljYXRlIGlzICcqJ1xuICAgICAgdHJ1ZVxuICAgIGVsc2UgaWYgYW5kUCA9IHByZWRpY2F0ZS5hbmRcbiAgICAgIEBldmFsdWF0ZVByZWRpY2F0ZSgnKicsIGFuZFBbMF0sIGl0ZW0pIGFuZCBAZXZhbHVhdGVQcmVkaWNhdGUoJyonLCBhbmRQWzFdLCBpdGVtKVxuICAgIGVsc2UgaWYgb3JQID0gcHJlZGljYXRlLm9yXG4gICAgICBAZXZhbHVhdGVQcmVkaWNhdGUoJyonLCBvclBbMF0sIGl0ZW0pIG9yIEBldmFsdWF0ZVByZWRpY2F0ZSgnKicsIG9yUFsxXSwgaXRlbSlcbiAgICBlbHNlIGlmIG5vdFAgPSBwcmVkaWNhdGUubm90XG4gICAgICBub3QgQGV2YWx1YXRlUHJlZGljYXRlICcqJywgbm90UCwgaXRlbVxuICAgIGVsc2VcbiAgICAgIGF0dHJpYnV0ZVBhdGggPSBwcmVkaWNhdGUuYXR0cmlidXRlUGF0aFxuICAgICAgcmVsYXRpb24gPSBwcmVkaWNhdGUucmVsYXRpb25cbiAgICAgIG1vZGlmaWVyID0gcHJlZGljYXRlLm1vZGlmaWVyXG4gICAgICB2YWx1ZSA9IHByZWRpY2F0ZS52YWx1ZVxuXG4gICAgICBpZiBub3QgcmVsYXRpb24gYW5kIG5vdCB2YWx1ZVxuICAgICAgICByZXR1cm4gQHZhbHVlRm9yQXR0cmlidXRlUGF0aChhdHRyaWJ1dGVQYXRoLCBpdGVtKSBpc250IG51bGxcblxuICAgICAgcHJlZGljYXRlVmFsdWVDYWNoZSA9IHByZWRpY2F0ZS5wcmVkaWNhdGVWYWx1ZUNhY2hlXG4gICAgICB1bmxlc3MgcHJlZGljYXRlVmFsdWVDYWNoZVxuICAgICAgICBwcmVkaWNhdGVWYWx1ZUNhY2hlID0gQGNvbnZlcnRWYWx1ZUZvck1vZGlmaWVyIHZhbHVlLCBtb2RpZmllclxuICAgICAgICBwcmVkaWNhdGUucHJlZGljYXRlVmFsdWVDYWNoZSA9IHByZWRpY2F0ZVZhbHVlQ2FjaGVcblxuICAgICAgYXR0cmlidXRlVmFsdWUgPSBAdmFsdWVGb3JBdHRyaWJ1dGVQYXRoIGF0dHJpYnV0ZVBhdGgsIGl0ZW1cbiAgICAgIGlmIGF0dHJpYnV0ZVZhbHVlIGlzbnQgbnVsbFxuICAgICAgICBhdHRyaWJ1dGVWYWx1ZSA9IEBjb252ZXJ0VmFsdWVGb3JNb2RpZmllciBhdHRyaWJ1dGVWYWx1ZS50b1N0cmluZygpLCBtb2RpZmllclxuXG4gICAgICBAZXZhbHVhdGVSZWxhdGlvbiBhdHRyaWJ1dGVWYWx1ZSwgcmVsYXRpb24sIHByZWRpY2F0ZVZhbHVlQ2FjaGUsIHByZWRpY2F0ZVxuXG4gIHZhbHVlRm9yQXR0cmlidXRlUGF0aDogKGF0dHJpYnV0ZVBhdGgsIGl0ZW0pIC0+XG4gICAgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZVBhdGhbMF1cbiAgICBhdHRyaWJ1dGVOYW1lID0gQG9wdGlvbnMuYXR0cmlidXRlU2hvcnRjdXRzP1thdHRyaWJ1dGVOYW1lXSBvciBhdHRyaWJ1dGVOYW1lXG4gICAgc3dpdGNoIGF0dHJpYnV0ZU5hbWVcbiAgICAgIHdoZW4gJ3RleHQnXG4gICAgICAgIGl0ZW0uYm9keVRleHRcbiAgICAgIGVsc2VcbiAgICAgICAgaXRlbS5nZXRBdHRyaWJ1dGUgJ2RhdGEtJyArIGF0dHJpYnV0ZU5hbWVcblxuICBjb252ZXJ0VmFsdWVGb3JNb2RpZmllcjogKHZhbHVlLCBtb2RpZmllcikgLT5cbiAgICBpZiBtb2RpZmllciBpcyAnaSdcbiAgICAgIHZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICBlbHNlIGlmIG1vZGlmaWVyIGlzICduJ1xuICAgICAgcGFyc2VGbG9hdCh2YWx1ZSlcbiAgICBlbHNlIGlmIG1vZGlmaWVyIGlzICdkJ1xuICAgICAgRGF0ZS5wYXJzZSh2YWx1ZSkgIyB3ZWFrXG4gICAgZWxzZVxuICAgICAgdmFsdWUgIyBjYXNlIGluc2Vuc2l0aXZlIGlzIGRlZmF1bHRcblxuICBldmFsdWF0ZVJlbGF0aW9uOiAobGVmdCwgcmVsYXRpb24sIHJpZ2h0LCBwcmVkaWNhdGUpIC0+XG4gICAgc3dpdGNoIHJlbGF0aW9uXG4gICAgICB3aGVuICc9J1xuICAgICAgICBsZWZ0IGlzIHJpZ2h0XG4gICAgICB3aGVuICchPSdcbiAgICAgICAgbGVmdCBpc250IHJpZ2h0XG4gICAgICB3aGVuICc8J1xuICAgICAgICBpZiBsZWZ0P1xuICAgICAgICAgIGxlZnQgPCByaWdodFxuICAgICAgICBlbHNlXG4gICAgICAgICAgZmFsc2VcbiAgICAgIHdoZW4gJz4nXG4gICAgICAgIGlmIGxlZnQ/XG4gICAgICAgICAgbGVmdCA+IHJpZ2h0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBmYWxzZVxuICAgICAgd2hlbiAnPD0nXG4gICAgICAgIGlmIGxlZnQ/XG4gICAgICAgICAgbGVmdCA8PSByaWdodFxuICAgICAgICBlbHNlXG4gICAgICAgICAgZmFsc2VcbiAgICAgIHdoZW4gJz49J1xuICAgICAgICBpZiBsZWZ0P1xuICAgICAgICAgIGxlZnQgPj0gcmlnaHRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGZhbHNlXG4gICAgICB3aGVuICdiZWdpbnN3aXRoJ1xuICAgICAgICBpZiBsZWZ0XG4gICAgICAgICAgbGVmdC5zdGFydHNXaXRoKHJpZ2h0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZmFsc2VcbiAgICAgIHdoZW4gJ2NvbnRhaW5zJ1xuICAgICAgICBpZiBsZWZ0XG4gICAgICAgICAgbGVmdC5pbmRleE9mKHJpZ2h0KSBpc250IC0xXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBmYWxzZVxuICAgICAgd2hlbiAnZW5kc3dpdGgnXG4gICAgICAgIGlmIGxlZnRcbiAgICAgICAgICBsZWZ0LmVuZHNXaXRoKHJpZ2h0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZmFsc2VcbiAgICAgIHdoZW4gJ21hdGNoZXMnXG4gICAgICAgIGlmIGxlZnQ/XG4gICAgICAgICAgam9pbmVkVmFsdWVSZWdleENhY2hlID0gcHJlZGljYXRlLmpvaW5lZFZhbHVlUmVnZXhDYWNoZVxuICAgICAgICAgIGlmIGpvaW5lZFZhbHVlUmVnZXhDYWNoZSBpcyB1bmRlZmluZWRcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICBqb2luZWRWYWx1ZVJlZ2V4Q2FjaGUgPSBuZXcgUmVnRXhwKHJpZ2h0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICAgICAgam9pbmVkVmFsdWVSZWdleENhY2hlID0gbnVsbFxuICAgICAgICAgICAgcHJlZGljYXRlLmpvaW5lZFZhbHVlUmVnZXhDYWNoZSA9IGpvaW5lZFZhbHVlUmVnZXhDYWNoZVxuXG4gICAgICAgICAgaWYgam9pbmVkVmFsdWVSZWdleENhY2hlXG4gICAgICAgICAgICBsZWZ0LnRvU3RyaW5nKCkubWF0Y2ggam9pbmVkVmFsdWVSZWdleENhY2hlXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGZhbHNlXG5cbiAgc2xpY2VSZXN1bHRzRnJvbTogKHNsaWNlLCByZXN1bHRzLCBmcm9tKSAtPlxuICAgIGlmIHNsaWNlXG4gICAgICBsZW5ndGggPSByZXN1bHRzLmxlbmd0aCAtIGZyb21cbiAgICAgIHN0YXJ0ID0gc2xpY2Uuc3RhcnRcbiAgICAgIGVuZCA9IHNsaWNlLmVuZFxuXG4gICAgICBpZiBsZW5ndGggaXMgMFxuICAgICAgICByZXR1cm5cblxuICAgICAgaWYgZW5kID4gbGVuZ3RoXG4gICAgICAgIGVuZCA9IGxlbmd0aFxuXG4gICAgICBpZiBzdGFydCBpc250IDAgb3IgZW5kIGlzbnQgbGVuZ3RoXG4gICAgICAgIHNsaWNlZFxuICAgICAgICBpZiBzdGFydCA8IDBcbiAgICAgICAgICBzdGFydCArPSBsZW5ndGhcbiAgICAgICAgICBpZiBzdGFydCA8IDBcbiAgICAgICAgICAgIHN0YXJ0ID0gMFxuICAgICAgICBpZiBzdGFydCA+IGxlbmd0aCAtIDFcbiAgICAgICAgICBzdGFydCA9IGxlbmd0aCAtIDFcbiAgICAgICAgaWYgZW5kIGlzIG51bGxcbiAgICAgICAgICBzbGljZWQgPSByZXN1bHRzW2Zyb20gKyBzdGFydF1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIGVuZCA8IDAgdGhlbiBlbmQgKz0gbGVuZ3RoXG4gICAgICAgICAgaWYgZW5kIDwgc3RhcnQgdGhlbiBlbmQgPSBzdGFydFxuICAgICAgICAgIHNsaWNlZCA9IHJlc3VsdHMuc2xpY2UoZnJvbSkuc2xpY2Uoc3RhcnQsIGVuZClcblxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHJlc3VsdHMsIFtmcm9tLCByZXN1bHRzLmxlbmd0aCAtIGZyb21dLmNvbmNhdChzbGljZWQpKTtcblxuICAjIyNcbiAgU2VjdGlvbjogQVNUIFRvIFN0cmluZ1xuICAjIyNcblxuICBwcmVkaWNhdGVUb1N0cmluZzogKHByZWRpY2F0ZSwgZ3JvdXApIC0+XG4gICAgaWYgcHJlZGljYXRlIGlzICcqJ1xuICAgICAgcmV0dXJuICcqJ1xuICAgIGVsc2VcbiAgICAgIG9wZW5Hcm91cCA9IGlmIGdyb3VwIHRoZW4gJygnIGVsc2UgJydcbiAgICAgIGNsb3NlR3JvdXAgPSBpZiBncm91cCB0aGVuICcpJyBlbHNlICcnXG5cbiAgICAgIGlmIGFuZEFTVCA9IHByZWRpY2F0ZS5hbmRcbiAgICAgICAgb3Blbkdyb3VwICsgQHByZWRpY2F0ZVRvU3RyaW5nKGFuZEFTVFswXSwgdHJ1ZSkgKyAnIGFuZCAnICsgQHByZWRpY2F0ZVRvU3RyaW5nKGFuZEFTVFsxXSwgdHJ1ZSkgKyBjbG9zZUdyb3VwXG4gICAgICBlbHNlIGlmIG9yQVNUID0gcHJlZGljYXRlLm9yXG4gICAgICAgIG9wZW5Hcm91cCArIEBwcmVkaWNhdGVUb1N0cmluZyhvckFTVFswXSwgdHJ1ZSkgKyAnIG9yICcgKyBAcHJlZGljYXRlVG9TdHJpbmcob3JBU1RbMV0sIHRydWUpICsgY2xvc2VHcm91cFxuICAgICAgZWxzZSBpZiBub3RBU1QgPSBwcmVkaWNhdGUubm90XG4gICAgICAgICdub3QgJyArIEBwcmVkaWNhdGVUb1N0cmluZyBub3RBU1QsIHRydWVcbiAgICAgIGVsc2VcbiAgICAgICAgcmVzdWx0ID0gW11cblxuICAgICAgICBpZiBhdHRyaWJ1dGVQYXRoID0gcHJlZGljYXRlLmF0dHJpYnV0ZVBhdGhcbiAgICAgICAgICB1bmxlc3MgYXR0cmlidXRlUGF0aC5sZW5ndGggaXMgMSBhbmQgYXR0cmlidXRlUGF0aFswXSBpcyAndGV4dCcgI2RlZmF1bHRcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKCdAJyArIGF0dHJpYnV0ZVBhdGguam9pbignOicpKVxuXG4gICAgICAgIGlmIHJlbGF0aW9uID0gcHJlZGljYXRlLnJlbGF0aW9uXG4gICAgICAgICAgaWYgcmVsYXRpb24gaXNudCAnY29udGFpbnMnICNkZWZhdWx0XG4gICAgICAgICAgICByZXN1bHQucHVzaCByZWxhdGlvblxuXG4gICAgICAgIGlmIG1vZGlmaWVyID0gcHJlZGljYXRlLm1vZGlmaWVyXG4gICAgICAgICAgaWYgbW9kaWZpZXIgaXNudCAnaScgI2RlZmF1bHRcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKCdbJyArIG1vZGlmaWVyICsgJ10nKVxuXG4gICAgICAgIGlmIHZhbHVlID0gcHJlZGljYXRlLnZhbHVlXG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICBJdGVtUGF0aFBhcnNlci5wYXJzZSB2YWx1ZSxcbiAgICAgICAgICAgICAgc3RhcnRSdWxlOiAnVmFsdWUnXG4gICAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICAgIHZhbHVlID0gJ1wiJyArIHZhbHVlICsgJ1wiJ1xuICAgICAgICAgIHJlc3VsdC5wdXNoIHZhbHVlXG5cbiAgICAgICAgcmVzdWx0LmpvaW4gJyAnXG5cbiAgc3RlcFRvU3RyaW5nOiAoc3RlcCwgZmlyc3QpIC0+XG4gICAgcHJlZGljYXRlID0gQHByZWRpY2F0ZVRvU3RyaW5nIHN0ZXAucHJlZGljYXRlXG4gICAgc3dpdGNoIHN0ZXAuYXhpc1xuICAgICAgd2hlbiAnY2hpbGQnXG4gICAgICAgIHByZWRpY2F0ZVxuICAgICAgd2hlbiAnZGVzY2VuZGFudCdcbiAgICAgICAgaWYgZmlyc3RcbiAgICAgICAgICBwcmVkaWNhdGUgIyBkZWZhdWx0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAnLycgKyBwcmVkaWNhdGVcbiAgICAgIHdoZW4gJ3BhcmVudCdcbiAgICAgICAgJy4uJyArIHByZWRpY2F0ZVxuICAgICAgZWxzZVxuICAgICAgICBzdGVwLmF4aXMgKyAnOjonICsgcHJlZGljYXRlXG5cbiAgcGF0aFRvU3RyaW5nOiAocGF0aEFTVCkgLT5cbiAgICBzdGVwU3RyaW5ncyA9IFtdXG4gICAgZmlyc3RTdGVwID0gbnVsbFxuICAgIGZpcnN0ID0gdHJ1ZVxuICAgIGZvciBzdGVwIGluIHBhdGhBU1Quc3RlcHNcbiAgICAgIHVubGVzcyBmaXJzdFN0ZXBcbiAgICAgICAgZmlyc3RTdGVwID0gc3RlcFxuICAgICAgICBzdGVwU3RyaW5ncy5wdXNoIEBzdGVwVG9TdHJpbmcgc3RlcCwgdHJ1ZVxuICAgICAgZWxzZVxuICAgICAgICBzdGVwU3RyaW5ncy5wdXNoIEBzdGVwVG9TdHJpbmcgc3RlcFxuICAgIGlmIHBhdGhBU1QuYWJzb2x1dGUgYW5kIG5vdCAoZmlyc3RTdGVwLmF4aXMgaXMgJ2Rlc2NlbmRhbnQnKVxuICAgICAgJy8nICsgc3RlcFN0cmluZ3Muam9pbignLycpXG4gICAgZWxzZVxuICAgICAgc3RlcFN0cmluZ3Muam9pbignLycpXG5cbiAgcGF0aEV4cHJlc3Npb25Ub1N0cmluZzogKGl0ZW1QYXRoLCBncm91cCkgLT5cbiAgICBvcGVuR3JvdXAgPSBpZiBncm91cCB0aGVuICcoJyBlbHNlICcnXG4gICAgY2xvc2VHcm91cCA9IGlmIGdyb3VwIHRoZW4gJyknIGVsc2UgJydcbiAgICBpZiB1bmlvbiA9IGl0ZW1QYXRoLnVuaW9uXG4gICAgICBvcGVuR3JvdXAgKyBAcGF0aEV4cHJlc3Npb25Ub1N0cmluZyh1bmlvblswXSwgdHJ1ZSkgKyAnIHVuaW9uICcgKyBAcGF0aEV4cHJlc3Npb25Ub1N0cmluZyh1bmlvblsxXSwgdHJ1ZSkgKyBjbG9zZUdyb3VwXG4gICAgZWxzZSBpZiBpbnRlcnNlY3QgPSBpdGVtUGF0aC5pbnRlcnNlY3RcbiAgICAgIG9wZW5Hcm91cCArIEBwYXRoRXhwcmVzc2lvblRvU3RyaW5nKGludGVyc2VjdFswXSwgdHJ1ZSkgKyAnIGludGVyc2VjdCAnICsgQHBhdGhFeHByZXNzaW9uVG9TdHJpbmcoaW50ZXJzZWN0WzFdLCB0cnVlKSArIGNsb3NlR3JvdXBcbiAgICBlbHNlIGlmIGV4Y2VwdCA9IGl0ZW1QYXRoLmV4Y2VwdFxuICAgICAgb3Blbkdyb3VwICsgQHBhdGhFeHByZXNzaW9uVG9TdHJpbmcoZXhjZXB0WzBdLCB0cnVlKSArICcgZXhjZXB0ICcgKyBAcGF0aEV4cHJlc3Npb25Ub1N0cmluZyhleGNlcHRbMV0sIHRydWUpICsgY2xvc2VHcm91cFxuICAgIGVsc2VcbiAgICAgIEBwYXRoVG9TdHJpbmcgaXRlbVBhdGhcblxuICB0b1N0cmluZzogLT5cbiAgICByZXR1cm4gQHBhdGhFeHByZXNzaW9uVG9TdHJpbmcgQHBhdGhFeHByZXNzaW9uQVNUIl19
