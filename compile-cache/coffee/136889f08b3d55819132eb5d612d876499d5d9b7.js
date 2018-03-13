(function() {
  var decimal, float, int, namePrefixes, percent, variables;

  int = '\\d+';

  decimal = "\\." + int;

  float = "(?:" + int + decimal + "|" + int + "|" + decimal + ")";

  percent = float + "%";

  variables = '(?:@[a-zA-Z0-9\\-_]+|\\$[a-zA-Z0-9\\-_]+|[a-zA-Z_][a-zA-Z0-9\\-_]*)';

  namePrefixes = '^| |\\t|:|=|,|\\n|\'|"|`|\\(|\\[|\\{|>';

  module.exports = {
    int: int,
    float: float,
    percent: percent,
    optionalPercent: float + "%?",
    intOrPercent: "(?:" + percent + "|" + int + ")",
    floatOrPercent: "(?:" + percent + "|" + float + ")",
    comma: '\\s*,\\s*',
    notQuote: "[^\"'`\\n\\r]+",
    hexadecimal: '[\\da-fA-F]',
    ps: '\\(\\s*',
    pe: '\\s*\\)',
    variables: variables,
    namePrefixes: namePrefixes,
    createVariableRegExpString: function(variables) {
      var i, j, len, len1, res, v, variableNamesWithPrefix, variableNamesWithoutPrefix, withPrefixes, withoutPrefixes;
      variableNamesWithPrefix = [];
      variableNamesWithoutPrefix = [];
      withPrefixes = variables.filter(function(v) {
        return !v.noNamePrefix;
      });
      withoutPrefixes = variables.filter(function(v) {
        return v.noNamePrefix;
      });
      res = [];
      if (withPrefixes.length > 0) {
        for (i = 0, len = withPrefixes.length; i < len; i++) {
          v = withPrefixes[i];
          variableNamesWithPrefix.push(v.name.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
        }
        res.push("((?:" + namePrefixes + ")(" + (variableNamesWithPrefix.join('|')) + ")(\\s+!default)?(?!_|-|\\w|\\d|[ \\t]*[\\.:=]))");
      }
      if (withoutPrefixes.length > 0) {
        for (j = 0, len1 = withoutPrefixes.length; j < len1; j++) {
          v = withoutPrefixes[j];
          variableNamesWithoutPrefix.push(v.name.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
        }
        res.push("(" + (variableNamesWithoutPrefix.join('|')) + ")");
      }
      return res.join('|');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcmVnZXhlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTTs7RUFDTixPQUFBLEdBQVUsS0FBQSxHQUFNOztFQUNoQixLQUFBLEdBQVEsS0FBQSxHQUFNLEdBQU4sR0FBWSxPQUFaLEdBQW9CLEdBQXBCLEdBQXVCLEdBQXZCLEdBQTJCLEdBQTNCLEdBQThCLE9BQTlCLEdBQXNDOztFQUM5QyxPQUFBLEdBQWEsS0FBRCxHQUFPOztFQUNuQixTQUFBLEdBQVk7O0VBQ1osWUFBQSxHQUFlOztFQUVmLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxHQUFBLEVBQUssR0FBTDtJQUNBLEtBQUEsRUFBTyxLQURQO0lBRUEsT0FBQSxFQUFTLE9BRlQ7SUFHQSxlQUFBLEVBQW9CLEtBQUQsR0FBTyxJQUgxQjtJQUlBLFlBQUEsRUFBYyxLQUFBLEdBQU0sT0FBTixHQUFjLEdBQWQsR0FBaUIsR0FBakIsR0FBcUIsR0FKbkM7SUFLQSxjQUFBLEVBQWdCLEtBQUEsR0FBTSxPQUFOLEdBQWMsR0FBZCxHQUFpQixLQUFqQixHQUF1QixHQUx2QztJQU1BLEtBQUEsRUFBTyxXQU5QO0lBT0EsUUFBQSxFQUFVLGdCQVBWO0lBUUEsV0FBQSxFQUFhLGFBUmI7SUFTQSxFQUFBLEVBQUksU0FUSjtJQVVBLEVBQUEsRUFBSSxTQVZKO0lBV0EsU0FBQSxFQUFXLFNBWFg7SUFZQSxZQUFBLEVBQWMsWUFaZDtJQWFBLDBCQUFBLEVBQTRCLFNBQUMsU0FBRDtBQUMxQixVQUFBO01BQUEsdUJBQUEsR0FBMEI7TUFDMUIsMEJBQUEsR0FBNkI7TUFDN0IsWUFBQSxHQUFlLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFNBQUMsQ0FBRDtlQUFPLENBQUksQ0FBQyxDQUFDO01BQWIsQ0FBakI7TUFDZixlQUFBLEdBQWtCLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQztNQUFULENBQWpCO01BRWxCLEdBQUEsR0FBTTtNQUVOLElBQUcsWUFBWSxDQUFDLE1BQWIsR0FBc0IsQ0FBekI7QUFDRSxhQUFBLDhDQUFBOztVQUNFLHVCQUF1QixDQUFDLElBQXhCLENBQTZCLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBUCxDQUFlLG9DQUFmLEVBQXFELE1BQXJELENBQTdCO0FBREY7UUFHQSxHQUFHLENBQUMsSUFBSixDQUFTLE1BQUEsR0FBTyxZQUFQLEdBQW9CLElBQXBCLEdBQXVCLENBQUMsdUJBQXVCLENBQUMsSUFBeEIsQ0FBNkIsR0FBN0IsQ0FBRCxDQUF2QixHQUEwRCxpREFBbkUsRUFKRjs7TUFNQSxJQUFHLGVBQWUsQ0FBQyxNQUFoQixHQUF5QixDQUE1QjtBQUNFLGFBQUEsbURBQUE7O1VBQ0UsMEJBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsb0NBQWYsRUFBcUQsTUFBckQsQ0FBaEM7QUFERjtRQUdBLEdBQUcsQ0FBQyxJQUFKLENBQVMsR0FBQSxHQUFHLENBQUMsMEJBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsR0FBaEMsQ0FBRCxDQUFILEdBQXlDLEdBQWxELEVBSkY7O2FBTUEsR0FBRyxDQUFDLElBQUosQ0FBUyxHQUFUO0lBcEIwQixDQWI1Qjs7QUFSRiIsInNvdXJjZXNDb250ZW50IjpbImludCA9ICdcXFxcZCsnXG5kZWNpbWFsID0gXCJcXFxcLiN7aW50fVwiXG5mbG9hdCA9IFwiKD86I3tpbnR9I3tkZWNpbWFsfXwje2ludH18I3tkZWNpbWFsfSlcIlxucGVyY2VudCA9IFwiI3tmbG9hdH0lXCJcbnZhcmlhYmxlcyA9ICcoPzpAW2EtekEtWjAtOVxcXFwtX10rfFxcXFwkW2EtekEtWjAtOVxcXFwtX10rfFthLXpBLVpfXVthLXpBLVowLTlcXFxcLV9dKiknXG5uYW1lUHJlZml4ZXMgPSAnXnwgfFxcXFx0fDp8PXwsfFxcXFxufFxcJ3xcInxgfFxcXFwofFxcXFxbfFxcXFx7fD4nXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgaW50OiBpbnRcbiAgZmxvYXQ6IGZsb2F0XG4gIHBlcmNlbnQ6IHBlcmNlbnRcbiAgb3B0aW9uYWxQZXJjZW50OiBcIiN7ZmxvYXR9JT9cIlxuICBpbnRPclBlcmNlbnQ6IFwiKD86I3twZXJjZW50fXwje2ludH0pXCJcbiAgZmxvYXRPclBlcmNlbnQ6IFwiKD86I3twZXJjZW50fXwje2Zsb2F0fSlcIlxuICBjb21tYTogJ1xcXFxzKixcXFxccyonXG4gIG5vdFF1b3RlOiBcIlteXFxcIidgXFxcXG5cXFxccl0rXCJcbiAgaGV4YWRlY2ltYWw6ICdbXFxcXGRhLWZBLUZdJ1xuICBwczogJ1xcXFwoXFxcXHMqJ1xuICBwZTogJ1xcXFxzKlxcXFwpJ1xuICB2YXJpYWJsZXM6IHZhcmlhYmxlc1xuICBuYW1lUHJlZml4ZXM6IG5hbWVQcmVmaXhlc1xuICBjcmVhdGVWYXJpYWJsZVJlZ0V4cFN0cmluZzogKHZhcmlhYmxlcykgLT5cbiAgICB2YXJpYWJsZU5hbWVzV2l0aFByZWZpeCA9IFtdXG4gICAgdmFyaWFibGVOYW1lc1dpdGhvdXRQcmVmaXggPSBbXVxuICAgIHdpdGhQcmVmaXhlcyA9IHZhcmlhYmxlcy5maWx0ZXIgKHYpIC0+IG5vdCB2Lm5vTmFtZVByZWZpeFxuICAgIHdpdGhvdXRQcmVmaXhlcyA9IHZhcmlhYmxlcy5maWx0ZXIgKHYpIC0+IHYubm9OYW1lUHJlZml4XG5cbiAgICByZXMgPSBbXVxuXG4gICAgaWYgd2l0aFByZWZpeGVzLmxlbmd0aCA+IDBcbiAgICAgIGZvciB2IGluIHdpdGhQcmVmaXhlc1xuICAgICAgICB2YXJpYWJsZU5hbWVzV2l0aFByZWZpeC5wdXNoIHYubmFtZS5yZXBsYWNlKC9bLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpXG5cbiAgICAgIHJlcy5wdXNoIFwiKCg/OiN7bmFtZVByZWZpeGVzfSkoI3t2YXJpYWJsZU5hbWVzV2l0aFByZWZpeC5qb2luKCd8Jyl9KShcXFxccyshZGVmYXVsdCk/KD8hX3wtfFxcXFx3fFxcXFxkfFsgXFxcXHRdKltcXFxcLjo9XSkpXCJcblxuICAgIGlmIHdpdGhvdXRQcmVmaXhlcy5sZW5ndGggPiAwXG4gICAgICBmb3IgdiBpbiB3aXRob3V0UHJlZml4ZXNcbiAgICAgICAgdmFyaWFibGVOYW1lc1dpdGhvdXRQcmVmaXgucHVzaCB2Lm5hbWUucmVwbGFjZSgvWy1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKVxuXG4gICAgICByZXMucHVzaCBcIigje3ZhcmlhYmxlTmFtZXNXaXRob3V0UHJlZml4LmpvaW4oJ3wnKX0pXCJcblxuICAgIHJlcy5qb2luKCd8JylcbiJdfQ==
