(function() {
  var Emitter, TodoModel, _, maxLength, path;

  path = require('path');

  Emitter = require('atom').Emitter;

  _ = require('underscore-plus');

  maxLength = 120;

  module.exports = TodoModel = (function() {
    function TodoModel(match, arg) {
      var plain;
      plain = (arg != null ? arg : []).plain;
      if (plain) {
        return _.extend(this, match);
      }
      this.handleScanMatch(match);
    }

    TodoModel.prototype.getAllKeys = function() {
      return atom.config.get('todo-show.showInTable') || ['Text'];
    };

    TodoModel.prototype.get = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if ((value = this[key.toLowerCase()]) || value === '') {
        return value;
      }
      return this.text || 'No details';
    };

    TodoModel.prototype.getMarkdown = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if (!(value = this[key.toLowerCase()])) {
        return '';
      }
      switch (key) {
        case 'All':
        case 'Text':
          return " " + value;
        case 'Type':
        case 'Project':
          return " __" + value + "__";
        case 'Range':
        case 'Line':
          return " _:" + value + "_";
        case 'Regex':
          return " _'" + value + "'_";
        case 'Path':
        case 'File':
          return " [" + value + "](" + value + ")";
        case 'Tags':
        case 'Id':
          return " _" + value + "_";
      }
    };

    TodoModel.prototype.getMarkdownArray = function(keys) {
      var i, key, len, ref, results;
      ref = keys || this.getAllKeys();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        results.push(this.getMarkdown(key));
      }
      return results;
    };

    TodoModel.prototype.keyIsNumber = function(key) {
      return key === 'Range' || key === 'Line';
    };

    TodoModel.prototype.contains = function(string) {
      var i, item, key, len, ref;
      if (string == null) {
        string = '';
      }
      ref = this.getAllKeys();
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        if (!(item = this.get(key))) {
          break;
        }
        if (item.toLowerCase().indexOf(string.toLowerCase()) !== -1) {
          return true;
        }
      }
      return false;
    };

    TodoModel.prototype.handleScanMatch = function(match) {
      var _matchText, loc, matchText, matches, pos, project, ref, ref1, ref2, ref3, relativePath, tag;
      matchText = match.text || match.all || '';
      if (matchText.length > ((ref = match.all) != null ? ref.length : void 0)) {
        match.all = matchText;
      }
      while ((_matchText = (ref1 = match.regexp) != null ? ref1.exec(matchText) : void 0)) {
        if (!match.type) {
          match.type = _matchText[1];
        }
        matchText = _matchText.pop();
      }
      if (matchText.indexOf('(') === 0) {
        if (matches = matchText.match(/\((.*?)\):?(.*)/)) {
          matchText = matches.pop();
          match.id = matches.pop();
        }
      }
      matchText = this.stripCommentEnd(matchText);
      match.tags = ((function() {
        var results;
        results = [];
        while ((tag = /\s*#(\w+)[,.]?$/.exec(matchText))) {
          if (tag.length !== 2) {
            break;
          }
          matchText = matchText.slice(0, -tag.shift().length);
          results.push(tag.shift());
        }
        return results;
      })()).sort().join(', ');
      if (!matchText && match.all && (pos = (ref2 = match.position) != null ? (ref3 = ref2[0]) != null ? ref3[1] : void 0 : void 0)) {
        matchText = match.all.substr(0, pos);
        matchText = this.stripCommentStart(matchText);
      }
      if (matchText.length >= maxLength) {
        matchText = (matchText.substr(0, maxLength - 3)) + "...";
      }
      if (!(match.position && match.position.length > 0)) {
        match.position = [[0, 0]];
      }
      if (match.position.serialize) {
        match.range = match.position.serialize().toString();
      } else {
        match.range = match.position.toString();
      }
      relativePath = atom.project.relativizePath(match.loc);
      if (relativePath[0] == null) {
        relativePath[0] = '';
      }
      match.path = relativePath[1] || '';
      if ((match.loc && (loc = path.basename(match.loc))) !== 'undefined') {
        match.file = loc;
      } else {
        match.file = 'untitled';
      }
      if ((project = path.basename(relativePath[0])) !== 'null') {
        match.project = project;
      } else {
        match.project = '';
      }
      match.text = matchText || "No details";
      match.line = (parseInt(match.range.split(',')[0]) + 1).toString();
      match.regex = match.regex.replace('${TODOS}', match.type);
      match.id = match.id || '';
      return _.extend(this, match);
    };

    TodoModel.prototype.stripCommentStart = function(text) {
      var startRegex;
      if (text == null) {
        text = '';
      }
      startRegex = /(\/\*|<\?|<!--|<#|{-|\[\[|\/\/|#)\s*$/;
      return text.replace(startRegex, '').trim();
    };

    TodoModel.prototype.stripCommentEnd = function(text) {
      var endRegex;
      if (text == null) {
        text = '';
      }
      endRegex = /(\*\/}?|\?>|-->|#>|-}|\]\])\s*$/;
      return text.replace(endRegex, '').trim();
    };

    return TodoModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tbW9kZWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRU4sVUFBVyxPQUFBLENBQVEsTUFBUjs7RUFDWixDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUVKLFNBQUEsR0FBWTs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsbUJBQUMsS0FBRCxFQUFRLEdBQVI7QUFDWCxVQUFBO01BRG9CLHVCQUFELE1BQVU7TUFDN0IsSUFBZ0MsS0FBaEM7QUFBQSxlQUFPLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEtBQWYsRUFBUDs7TUFDQSxJQUFDLENBQUEsZUFBRCxDQUFpQixLQUFqQjtJQUZXOzt3QkFJYixVQUFBLEdBQVksU0FBQTthQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FBQSxJQUE0QyxDQUFDLE1BQUQ7SUFEbEM7O3dCQUdaLEdBQUEsR0FBSyxTQUFDLEdBQUQ7QUFDSCxVQUFBOztRQURJLE1BQU07O01BQ1YsSUFBZ0IsQ0FBQyxLQUFBLEdBQVEsSUFBRSxDQUFBLEdBQUcsQ0FBQyxXQUFKLENBQUEsQ0FBQSxDQUFYLENBQUEsSUFBa0MsS0FBQSxLQUFTLEVBQTNEO0FBQUEsZUFBTyxNQUFQOzthQUNBLElBQUMsQ0FBQSxJQUFELElBQVM7SUFGTjs7d0JBSUwsV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7O1FBRFksTUFBTTs7TUFDbEIsSUFBQSxDQUFpQixDQUFBLEtBQUEsR0FBUSxJQUFFLENBQUEsR0FBRyxDQUFDLFdBQUosQ0FBQSxDQUFBLENBQVYsQ0FBakI7QUFBQSxlQUFPLEdBQVA7O0FBQ0EsY0FBTyxHQUFQO0FBQUEsYUFDTyxLQURQ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QSxJQUFHLENBQUMsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFMLENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsQ0FBWCxDQUFBLEtBQWdELE1BQW5EO1FBQ0UsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsUUFEbEI7T0FBQSxNQUFBO1FBR0UsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsR0FIbEI7O01BS0EsS0FBSyxDQUFDLElBQU4sR0FBYSxTQUFBLElBQWE7TUFDMUIsS0FBSyxDQUFDLElBQU4sR0FBYSxDQUFDLFFBQUEsQ0FBUyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQVosQ0FBa0IsR0FBbEIsQ0FBdUIsQ0FBQSxDQUFBLENBQWhDLENBQUEsR0FBc0MsQ0FBdkMsQ0FBeUMsQ0FBQyxRQUExQyxDQUFBO01BQ2IsS0FBSyxDQUFDLEtBQU4sR0FBYyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQVosQ0FBb0IsVUFBcEIsRUFBZ0MsS0FBSyxDQUFDLElBQXRDO01BQ2QsS0FBSyxDQUFDLEVBQU4sR0FBVyxLQUFLLENBQUMsRUFBTixJQUFZO2FBRXZCLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEtBQWY7SUFoRWU7O3dCQWtFakIsaUJBQUEsR0FBbUIsU0FBQyxJQUFEO0FBQ2pCLFVBQUE7O1FBRGtCLE9BQU87O01BQ3pCLFVBQUEsR0FBYTthQUNiLElBQUksQ0FBQyxPQUFMLENBQWEsVUFBYixFQUF5QixFQUF6QixDQUE0QixDQUFDLElBQTdCLENBQUE7SUFGaUI7O3dCQUluQixlQUFBLEdBQWlCLFNBQUMsSUFBRDtBQUNmLFVBQUE7O1FBRGdCLE9BQU87O01BQ3ZCLFFBQUEsR0FBVzthQUNYLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYixFQUF1QixFQUF2QixDQUEwQixDQUFDLElBQTNCLENBQUE7SUFGZTs7Ozs7QUFqSG5CIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbntFbWl0dGVyfSA9IHJlcXVpcmUgJ2F0b20nXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuXG5tYXhMZW5ndGggPSAxMjBcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVG9kb01vZGVsXG4gIGNvbnN0cnVjdG9yOiAobWF0Y2gsIHtwbGFpbn0gPSBbXSkgLT5cbiAgICByZXR1cm4gXy5leHRlbmQodGhpcywgbWF0Y2gpIGlmIHBsYWluXG4gICAgQGhhbmRsZVNjYW5NYXRjaCBtYXRjaFxuXG4gIGdldEFsbEtleXM6IC0+XG4gICAgYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuc2hvd0luVGFibGUnKSBvciBbJ1RleHQnXVxuXG4gIGdldDogKGtleSA9ICcnKSAtPlxuICAgIHJldHVybiB2YWx1ZSBpZiAodmFsdWUgPSBAW2tleS50b0xvd2VyQ2FzZSgpXSkgb3IgdmFsdWUgaXMgJydcbiAgICBAdGV4dCBvciAnTm8gZGV0YWlscydcblxuICBnZXRNYXJrZG93bjogKGtleSA9ICcnKSAtPlxuICAgIHJldHVybiAnJyB1bmxlc3MgdmFsdWUgPSBAW2tleS50b0xvd2VyQ2FzZSgpXVxuICAgIHN3aXRjaCBrZXlcbiAgICAgIHdoZW4gJ0FsbCcsICdUZXh0JyB0aGVuIFwiICN7dmFsdWV9XCJcbiAgICAgIHdoZW4gJ1R5cGUnLCAnUHJvamVjdCcgdGhlbiBcIiBfXyN7dmFsdWV9X19cIlxuICAgICAgd2hlbiAnUmFuZ2UnLCAnTGluZScgdGhlbiBcIiBfOiN7dmFsdWV9X1wiXG4gICAgICB3aGVuICdSZWdleCcgdGhlbiBcIiBfJyN7dmFsdWV9J19cIlxuICAgICAgd2hlbiAnUGF0aCcsICdGaWxlJyB0aGVuIFwiIFsje3ZhbHVlfV0oI3t2YWx1ZX0pXCJcbiAgICAgIHdoZW4gJ1RhZ3MnLCAnSWQnIHRoZW4gXCIgXyN7dmFsdWV9X1wiXG5cbiAgZ2V0TWFya2Rvd25BcnJheTogKGtleXMpIC0+XG4gICAgZm9yIGtleSBpbiBrZXlzIG9yIEBnZXRBbGxLZXlzKClcbiAgICAgIEBnZXRNYXJrZG93bihrZXkpXG5cbiAga2V5SXNOdW1iZXI6IChrZXkpIC0+XG4gICAga2V5IGluIFsnUmFuZ2UnLCAnTGluZSddXG5cbiAgY29udGFpbnM6IChzdHJpbmcgPSAnJykgLT5cbiAgICBmb3Iga2V5IGluIEBnZXRBbGxLZXlzKClcbiAgICAgIGJyZWFrIHVubGVzcyBpdGVtID0gQGdldChrZXkpXG4gICAgICByZXR1cm4gdHJ1ZSBpZiBpdGVtLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzdHJpbmcudG9Mb3dlckNhc2UoKSkgaXNudCAtMVxuICAgIGZhbHNlXG5cbiAgaGFuZGxlU2Nhbk1hdGNoOiAobWF0Y2gpIC0+XG4gICAgbWF0Y2hUZXh0ID0gbWF0Y2gudGV4dCBvciBtYXRjaC5hbGwgb3IgJydcbiAgICBpZiBtYXRjaFRleHQubGVuZ3RoID4gbWF0Y2guYWxsPy5sZW5ndGhcbiAgICAgIG1hdGNoLmFsbCA9IG1hdGNoVGV4dFxuXG4gICAgIyBTdHJpcCBvdXQgdGhlIHJlZ2V4IHRva2VuIGZyb20gdGhlIGZvdW5kIGFubm90YXRpb25cbiAgICAjIG5vdCBhbGwgb2JqZWN0cyB3aWxsIGhhdmUgYW4gZXhlYyBtYXRjaFxuICAgIHdoaWxlIChfbWF0Y2hUZXh0ID0gbWF0Y2gucmVnZXhwPy5leGVjKG1hdGNoVGV4dCkpXG4gICAgICAjIEZpbmQgbWF0Y2ggdHlwZVxuICAgICAgbWF0Y2gudHlwZSA9IF9tYXRjaFRleHRbMV0gdW5sZXNzIG1hdGNoLnR5cGVcbiAgICAgICMgRXh0cmFjdCB0b2RvIHRleHRcbiAgICAgIG1hdGNoVGV4dCA9IF9tYXRjaFRleHQucG9wKClcblxuICAgICMgRXh0cmFjdCBnb29nbGUgc3R5bGUgZ3VpZGUgdG9kbyBpZFxuICAgIGlmIG1hdGNoVGV4dC5pbmRleE9mKCcoJykgaXMgMFxuICAgICAgaWYgbWF0Y2hlcyA9IG1hdGNoVGV4dC5tYXRjaCgvXFwoKC4qPylcXCk6PyguKikvKVxuICAgICAgICBtYXRjaFRleHQgPSBtYXRjaGVzLnBvcCgpXG4gICAgICAgIG1hdGNoLmlkID0gbWF0Y2hlcy5wb3AoKVxuXG4gICAgbWF0Y2hUZXh0ID0gQHN0cmlwQ29tbWVudEVuZChtYXRjaFRleHQpXG5cbiAgICAjIEV4dHJhY3QgdG9kbyB0YWdzXG4gICAgbWF0Y2gudGFncyA9ICh3aGlsZSAodGFnID0gL1xccyojKFxcdyspWywuXT8kLy5leGVjKG1hdGNoVGV4dCkpXG4gICAgICBicmVhayBpZiB0YWcubGVuZ3RoIGlzbnQgMlxuICAgICAgbWF0Y2hUZXh0ID0gbWF0Y2hUZXh0LnNsaWNlKDAsIC10YWcuc2hpZnQoKS5sZW5ndGgpXG4gICAgICB0YWcuc2hpZnQoKVxuICAgICkuc29ydCgpLmpvaW4oJywgJylcblxuICAgICMgVXNlIHRleHQgYmVmb3JlIHRvZG8gaWYgbm8gY29udGVudCBhZnRlclxuICAgIGlmIG5vdCBtYXRjaFRleHQgYW5kIG1hdGNoLmFsbCBhbmQgcG9zID0gbWF0Y2gucG9zaXRpb24/WzBdP1sxXVxuICAgICAgbWF0Y2hUZXh0ID0gbWF0Y2guYWxsLnN1YnN0cigwLCBwb3MpXG4gICAgICBtYXRjaFRleHQgPSBAc3RyaXBDb21tZW50U3RhcnQobWF0Y2hUZXh0KVxuXG4gICAgIyBUcnVuY2F0ZSBsb25nIG1hdGNoIHN0cmluZ3NcbiAgICBpZiBtYXRjaFRleHQubGVuZ3RoID49IG1heExlbmd0aFxuICAgICAgbWF0Y2hUZXh0ID0gXCIje21hdGNoVGV4dC5zdWJzdHIoMCwgbWF4TGVuZ3RoIC0gMyl9Li4uXCJcblxuICAgICMgTWFrZSBzdXJlIHJhbmdlIGlzIHNlcmlhbGl6ZWQgdG8gcHJvZHVjZSBjb3JyZWN0IHJlbmRlcmVkIGZvcm1hdFxuICAgIG1hdGNoLnBvc2l0aW9uID0gW1swLDBdXSB1bmxlc3MgbWF0Y2gucG9zaXRpb24gYW5kIG1hdGNoLnBvc2l0aW9uLmxlbmd0aCA+IDBcbiAgICBpZiBtYXRjaC5wb3NpdGlvbi5zZXJpYWxpemVcbiAgICAgIG1hdGNoLnJhbmdlID0gbWF0Y2gucG9zaXRpb24uc2VyaWFsaXplKCkudG9TdHJpbmcoKVxuICAgIGVsc2VcbiAgICAgIG1hdGNoLnJhbmdlID0gbWF0Y2gucG9zaXRpb24udG9TdHJpbmcoKVxuXG4gICAgIyBFeHRyYWN0IHBhdGhzIGFuZCBwcm9qZWN0XG4gICAgcmVsYXRpdmVQYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKG1hdGNoLmxvYylcbiAgICByZWxhdGl2ZVBhdGhbMF0gPz0gJydcbiAgICBtYXRjaC5wYXRoID0gcmVsYXRpdmVQYXRoWzFdIG9yICcnXG5cbiAgICBpZiAobWF0Y2gubG9jIGFuZCBsb2MgPSBwYXRoLmJhc2VuYW1lKG1hdGNoLmxvYykpIGlzbnQgJ3VuZGVmaW5lZCdcbiAgICAgIG1hdGNoLmZpbGUgPSBsb2NcbiAgICBlbHNlXG4gICAgICBtYXRjaC5maWxlID0gJ3VudGl0bGVkJ1xuXG4gICAgaWYgKHByb2plY3QgPSBwYXRoLmJhc2VuYW1lKHJlbGF0aXZlUGF0aFswXSkpIGlzbnQgJ251bGwnXG4gICAgICBtYXRjaC5wcm9qZWN0ID0gcHJvamVjdFxuICAgIGVsc2VcbiAgICAgIG1hdGNoLnByb2plY3QgPSAnJ1xuXG4gICAgbWF0Y2gudGV4dCA9IG1hdGNoVGV4dCBvciBcIk5vIGRldGFpbHNcIlxuICAgIG1hdGNoLmxpbmUgPSAocGFyc2VJbnQobWF0Y2gucmFuZ2Uuc3BsaXQoJywnKVswXSkgKyAxKS50b1N0cmluZygpXG4gICAgbWF0Y2gucmVnZXggPSBtYXRjaC5yZWdleC5yZXBsYWNlKCcke1RPRE9TfScsIG1hdGNoLnR5cGUpXG4gICAgbWF0Y2guaWQgPSBtYXRjaC5pZCBvciAnJ1xuXG4gICAgXy5leHRlbmQodGhpcywgbWF0Y2gpXG5cbiAgc3RyaXBDb21tZW50U3RhcnQ6ICh0ZXh0ID0gJycpIC0+XG4gICAgc3RhcnRSZWdleCA9IC8oXFwvXFwqfDxcXD98PCEtLXw8I3x7LXxcXFtcXFt8XFwvXFwvfCMpXFxzKiQvXG4gICAgdGV4dC5yZXBsYWNlKHN0YXJ0UmVnZXgsICcnKS50cmltKClcblxuICBzdHJpcENvbW1lbnRFbmQ6ICh0ZXh0ID0gJycpIC0+XG4gICAgZW5kUmVnZXggPSAvKFxcKlxcL30/fFxcPz58LS0+fCM+fC19fFxcXVxcXSlcXHMqJC9cbiAgICB0ZXh0LnJlcGxhY2UoZW5kUmVnZXgsICcnKS50cmltKClcbiJdfQ==
