(function() {
  var Emitter, Q, SSParser, _, fs, parse, path, walk;

  fs = require('fs');

  walk = require('walk');

  path = require('path');

  Q = require('q');

  parse = require('css-parse');

  _ = require('lodash');

  Emitter = require('event-kit').Emitter;

  SSParser = (function() {
    function SSParser() {
      var defered, prjDir;
      this.emitter = new Emitter();
      this.classes = [];
      this.ids = [];
      this.ssFiles = [];
      defered = Q.defer();
      this.loaded = defered.promise;
      prjDir = atom.project.getPaths();
      this.getSSFiles(prjDir).then((function(_this) {
        return function(files) {
          var i, k, ref, res;
          _this.ssFiles = files;
          for (i = k = 0, ref = files.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
            res = _this.parseSSFile(files[i]);
            _this.classes = _this.classes.concat(res.classes);
            _this.ids = _this.ids.concat(res.ids);
          }
          return defered.resolve();
        };
      })(this));
    }

    SSParser.prototype.getSSFiles = function(prjPath) {
      var defered, files, ignoreDirectories, ignoreFiles, options, ref, walker;
      ref = atom.config.get('atom-css-class-checker'), ignoreDirectories = ref.ignoreDirectories, ignoreFiles = ref.ignoreFiles;
      options = {
        followLinks: false,
        filters: ignoreDirectories
      };
      files = [];
      walker = walk.walk(prjPath[0], options);
      defered = Q.defer();
      walker.on('names', function(root, nodeNamesArray) {
        var exp;
        path.normalize(root);
        exp = /\w+\.(css)$/;
        return nodeNamesArray.forEach(function(filename) {
          if (_.indexOf(ignoreFiles, filename) >= 0) {
            return;
          }
          if (exp.test(filename)) {
            return files.push(path.join(path.normalize(root), filename));
          }
        });
      });
      walker.on('end', function() {
        return defered.resolve(files);
      });
      return defered.promise;
    };

    SSParser.prototype.removeFileSelectors = function(file) {
      return _.remove(this.classes, function(elem) {
        return elem.file === file;
      });
    };

    SSParser.prototype.updateWithSSFile = function(file, text) {
      var res;
      if (!(file !== void 0 && text !== void 0)) {
        return;
      }
      this.removeFileSelectors(file);
      res = this.parseText(text, file);
      this.classes = this.classes.concat(res.classes);
      this.ids = this.ids.concat(res.ids);
      return this.emitter.emit('onDidUpdate');
    };

    SSParser.prototype.parseSSFile = function(file) {
      var buf;
      buf = fs.readFileSync(file, {
        encoding: 'Utf-8'
      });
      return this.parseText(buf, file);
    };

    SSParser.prototype.parseText = function(buf, file) {
      var checkIds, classMatcher, classes, cls, cssAST, ex, i, idMatcher, ident, ids, j, k, l, m, n, pos, ref, ref1, ref2, ref3, selectors, temp;
      checkIds = atom.config.get('atom-css-class-checker.checkIds');
      try {
        cssAST = parse(buf, {
          silent: false
        });
      } catch (error) {
        ex = error;
        console.log('failed to parse #{file}', ex);
        return {
          classes: [],
          ids: []
        };
      }
      selectors = [];
      for (i = k = 0, ref = cssAST.stylesheet.rules.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        if (cssAST.stylesheet.rules[i].selectors) {
          selectors.push({
            sel: cssAST.stylesheet.rules[i].selectors[0],
            pos: cssAST.stylesheet.rules[i].position
          });
        }
      }
      classMatcher = /\.([\w|-]*)/gmi;
      idMatcher = /#([\w|-]*)/gmi;
      classes = [];
      ids = [];
      for (i = l = 0, ref1 = selectors.length; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
        cls = selectors[i].sel.match(classMatcher);
        for (j = m = 0, ref2 = cls != null ? cls.length : void 0; 0 <= ref2 ? m < ref2 : m > ref2; j = 0 <= ref2 ? ++m : --m) {
          temp = cls[j].substring(1);
          pos = _.findIndex(classes, {
            name: temp
          });
          if (pos === -1) {
            classes.push({
              name: temp,
              file: file,
              references: [
                {
                  pos: selectors[i].pos,
                  sel: selectors[i].sel,
                  file: file
                }
              ]
            });
          } else {
            classes[pos].references.push({
              pos: selectors[i].pos,
              sel: selectors[i].sel,
              file: file
            });
          }
        }
        if (checkIds) {
          ident = selectors[i].sel.match(idMatcher);
          for (j = n = 0, ref3 = ident != null ? ident.length : void 0; 0 <= ref3 ? n < ref3 : n > ref3; j = 0 <= ref3 ? ++n : --n) {
            temp = ident[j].substring(1);
            pos = _.findIndex(ids, {
              name: temp
            });
            if (pos === -1) {
              ids.push({
                name: temp,
                file: file,
                references: [
                  {
                    pos: selectors[i].pos,
                    sel: selectors[i].sel
                  }
                ]
              });
            } else {
              ids[pos].references.push({
                pos: selectors[i].pos,
                sel: selectors[i].sel
              });
            }
          }
        }
      }
      return {
        classes: classes,
        ids: ids
      };
    };

    SSParser.prototype.onDidUpdate = function(cb) {
      return this.emitter.on('onDidUpdate', cb);
    };

    return SSParser;

  })();

  module.exports = SSParser;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdG9tLWNzcy1jbGFzcy1jaGVja2VyL2xpYi9zdHlsZXNQYXJzZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxDQUFBLEdBQUksT0FBQSxDQUFRLEdBQVI7O0VBQ0osS0FBQSxHQUFRLE9BQUEsQ0FBUSxXQUFSOztFQUNSLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFDSCxVQUFXLE9BQUEsQ0FBUSxXQUFSOztFQUVOO0lBRVMsa0JBQUE7QUFDWCxVQUFBO01BQUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLE9BQUEsQ0FBQTtNQUNmLElBQUMsQ0FBQSxPQUFELEdBQVc7TUFDWCxJQUFDLENBQUEsR0FBRCxHQUFPO01BQ1AsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUNYLE9BQUEsR0FBVSxDQUFDLENBQUMsS0FBRixDQUFBO01BQ1YsSUFBQyxDQUFBLE1BQUQsR0FBVSxPQUFPLENBQUM7TUFFbEIsTUFBQSxHQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBO01BRVQsSUFBQyxDQUFBLFVBQUQsQ0FBWSxNQUFaLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7QUFDdkIsY0FBQTtVQUFBLEtBQUMsQ0FBQSxPQUFELEdBQVc7QUFDWCxlQUFTLHFGQUFUO1lBQ0UsR0FBQSxHQUFNLEtBQUMsQ0FBQSxXQUFELENBQWEsS0FBTSxDQUFBLENBQUEsQ0FBbkI7WUFDTixLQUFDLENBQUEsT0FBRCxHQUFXLEtBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixHQUFHLENBQUMs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VDtRQUFrQixHQUFBLEVBQUssR0FBdkI7O0lBakRFOzt1QkFtRFgsV0FBQSxHQUFhLFNBQUMsRUFBRDthQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGFBQVosRUFBMkIsRUFBM0I7SUFEVzs7Ozs7O0VBR2YsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUE3SGpCIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcydcbndhbGsgPSByZXF1aXJlICd3YWxrJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5RID0gcmVxdWlyZSAncSdcbnBhcnNlID0gcmVxdWlyZSAnY3NzLXBhcnNlJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbntFbWl0dGVyfSA9IHJlcXVpcmUgJ2V2ZW50LWtpdCdcblxuY2xhc3MgU1NQYXJzZXJcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICBAY2xhc3NlcyA9IFtdXG4gICAgQGlkcyA9IFtdXG4gICAgQHNzRmlsZXMgPSBbXVxuICAgIGRlZmVyZWQgPSBRLmRlZmVyKClcbiAgICBAbG9hZGVkID0gZGVmZXJlZC5wcm9taXNlO1xuXG4gICAgcHJqRGlyID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcblxuICAgIEBnZXRTU0ZpbGVzKHByakRpcikudGhlbiAoZmlsZXMpPT5cbiAgICAgIEBzc0ZpbGVzID0gZmlsZXNcbiAgICAgIGZvciBpIGluIFswLi4uZmlsZXMubGVuZ3RoXVxuICAgICAgICByZXMgPSBAcGFyc2VTU0ZpbGUoZmlsZXNbaV0pXG4gICAgICAgIEBjbGFzc2VzID0gQGNsYXNzZXMuY29uY2F0KHJlcy5jbGFzc2VzKVxuICAgICAgICBAaWRzID0gQGlkcy5jb25jYXQocmVzLmlkcylcbiAgICAgIGRlZmVyZWQucmVzb2x2ZSgpXG5cblxuICBnZXRTU0ZpbGVzOiAocHJqUGF0aCkgLT5cbiAgICB7aWdub3JlRGlyZWN0b3JpZXMsIGlnbm9yZUZpbGVzfSA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jc3MtY2xhc3MtY2hlY2tlcicpXG4gICAgb3B0aW9ucyA9XG4gICAgICBmb2xsb3dMaW5rczogZmFsc2VcbiAgICAgIGZpbHRlcnM6IGlnbm9yZURpcmVjdG9yaWVzXG5cbiAgICBmaWxlcyA9IFtdXG4gICAgd2Fsa2VyID0gd2Fsay53YWxrKHByalBhdGhbMF0sIG9wdGlvbnMpXG4gICAgZGVmZXJlZCA9IFEuZGVmZXIoKVxuICAgIHdhbGtlci5vbiAnbmFtZXMnLCAocm9vdCwgbm9kZU5hbWVzQXJyYXkpLT5cbiAgICAgIHBhdGgubm9ybWFsaXplKHJvb3QpO1xuICAgICAgIyBjb25zb2xlLmxvZygnbm9kZXMnLCBub2RlTmFtZXNBcnJheSlcbiAgICAgIGV4cCA9IC9cXHcrXFwuKGNzcykkL1xuICAgICAgbm9kZU5hbWVzQXJyYXkuZm9yRWFjaCAoZmlsZW5hbWUpLT5cbiAgICAgICAgaWYgXy5pbmRleE9mKGlnbm9yZUZpbGVzLCBmaWxlbmFtZSkgPj0gMFxuICAgICAgICAgIHJldHVyblxuICAgICAgICBpZiBleHAudGVzdChmaWxlbmFtZSlcbiAgICAgICAgICAjIGNvbnNvbGUubG9nKHJvb3QsIGZpbGVuYW1lKVxuICAgICAgICAgIGZpbGVzLnB1c2gocGF0aC5qb2luKHBhdGgubm9ybWFsaXplKHJvb3QpLCBmaWxlbmFtZSkpXG5cbiAgICB3YWxrZXIub24gJ2VuZCcsICgpLT5cbiAgICAgIGRlZmVyZWQucmVzb2x2ZShmaWxlcylcblxuICAgIHJldHVybiBkZWZlcmVkLnByb21pc2VcblxuICByZW1vdmVGaWxlU2VsZWN0b3JzOiAoZmlsZSktPlxuICAgIF8ucmVtb3ZlIEBjbGFzc2VzLCAoZWxlbSktPlxuICAgICAgZWxlbS5maWxlID09IGZpbGVcblxuICB1cGRhdGVXaXRoU1NGaWxlOiAoZmlsZSwgdGV4dCktPlxuICAgIHJldHVybiB1bmxlc3MgZmlsZSBpc250IHVuZGVmaW5lZCBhbmQgdGV4dCBpc250IHVuZGVmaW5lZFxuICAgIEByZW1vdmVGaWxlU2VsZWN0b3JzKGZpbGUpXG4gICAgcmVzID0gQHBhcnNlVGV4dCh0ZXh0LCBmaWxlKVxuICAgIEBjbGFzc2VzID0gQGNsYXNzZXMuY29uY2F0KHJlcy5jbGFzc2VzKVxuICAgIEBpZHMgPSBAaWRzLmNvbmNhdChyZXMuaWRzKVxuICAgIEBlbWl0dGVyLmVtaXQoJ29uRGlkVXBkYXRlJylcblxuXG4gIHBhcnNlU1NGaWxlOiAoZmlsZSktPlxuICAgIGJ1ZiA9IGZzLnJlYWRGaWxlU3luYyBmaWxlLCBlbmNvZGluZzogJ1V0Zi04JztcbiAgICBAcGFyc2VUZXh0KGJ1ZiwgZmlsZSlcblxuICBwYXJzZVRleHQ6IChidWYsIGZpbGUpLT5cbiAgICBjaGVja0lkcyA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jc3MtY2xhc3MtY2hlY2tlci5jaGVja0lkcycpXG4gICAgdHJ5XG4gICAgICBjc3NBU1QgPSBwYXJzZShidWYsIHNpbGVudDogZmFsc2UpO1xuICAgIGNhdGNoIGV4XG4gICAgICBjb25zb2xlLmxvZyAnZmFpbGVkIHRvIHBhcnNlICN7ZmlsZX0nLCBleFxuICAgICAgcmV0dXJuIGNsYXNzZXM6IFtdLCBpZHM6IFtdXG5cbiAgICBzZWxlY3RvcnMgPSBbXTtcbiAgICBmb3IgaSAgaW4gWzAuLi5jc3NBU1Quc3R5bGVzaGVldC5ydWxlcy5sZW5ndGhdXG4gICAgICBpZiAoY3NzQVNULnN0eWxlc2hlZXQucnVsZXNbaV0uc2VsZWN0b3JzKVxuICAgICAgICBzZWxlY3RvcnMucHVzaFxuICAgICAgICAgIHNlbDogY3NzQVNULnN0eWxlc2hlZXQucnVsZXNbaV0uc2VsZWN0b3JzWzBdLFxuICAgICAgICAgIHBvczogY3NzQVNULnN0eWxlc2hlZXQucnVsZXNbaV0ucG9zaXRpb25cblxuICAgICMgY29uc29sZS5sb2cgc2VsZWN0b3JzO1xuICAgIGNsYXNzTWF0Y2hlciA9IFx0L1xcLihbXFx3fC1dKikvZ21pXG4gICAgaWRNYXRjaGVyID0gLyMoW1xcd3wtXSopL2dtaVxuICAgIGNsYXNzZXMgPSBbXTtcbiAgICBpZHMgPSBbXTtcbiAgICBmb3IgaSAgaW4gWzAuLi5zZWxlY3RvcnMubGVuZ3RoXVxuICAgICAgY2xzID0gc2VsZWN0b3JzW2ldLnNlbC5tYXRjaChjbGFzc01hdGNoZXIpXG4gICAgICBmb3IgaiBpbiBbMC4uLmNscz8ubGVuZ3RoXVxuICAgICAgICB0ZW1wID0gY2xzW2pdLnN1YnN0cmluZygxKTtcbiAgICAgICAgcG9zID0gXy5maW5kSW5kZXgoY2xhc3NlcywgbmFtZTogdGVtcClcbiAgICAgICAgaWYgKHBvcyA9PSAtMSlcbiAgICAgICAgICBjbGFzc2VzLnB1c2hcbiAgICAgICAgICAgIG5hbWU6IHRlbXAsXG4gICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgcmVmZXJlbmNlczogW3Bvczogc2VsZWN0b3JzW2ldLnBvcywgc2VsOiBzZWxlY3RvcnNbaV0uc2VsLCBmaWxlOiBmaWxlXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY2xhc3Nlc1twb3NdLnJlZmVyZW5jZXMucHVzaFxuICAgICAgICAgICAgcG9zOiBzZWxlY3RvcnNbaV0ucG9zXG4gICAgICAgICAgICBzZWw6IHNlbGVjdG9yc1tpXS5zZWxcbiAgICAgICAgICAgIGZpbGU6IGZpbGVcblxuICAgICAgaWYgY2hlY2tJZHNcbiAgICAgICAgaWRlbnQgPSBzZWxlY3RvcnNbaV0uc2VsLm1hdGNoKGlkTWF0Y2hlcilcbiAgICAgICAgZm9yIGogaW4gWzAuLi5pZGVudD8ubGVuZ3RoXVxuICAgICAgICAgIHRlbXAgPSBpZGVudFtqXS5zdWJzdHJpbmcoMSlcbiAgICAgICAgICBwb3MgPSBfLmZpbmRJbmRleChpZHMsIG5hbWU6IHRlbXApXG4gICAgICAgICAgaWYgKHBvcyA9PSAtMSlcbiAgICAgICAgICAgIGlkcy5wdXNoXG4gICAgICAgICAgICAgIG5hbWU6IHRlbXAsXG4gICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgIHJlZmVyZW5jZXM6IFtwb3M6IHNlbGVjdG9yc1tpXS5wb3MsIHNlbDogc2VsZWN0b3JzW2ldLnNlbF1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZHNbcG9zXS5yZWZlcmVuY2VzLnB1c2gocG9zOiBzZWxlY3RvcnNbaV0ucG9zLCBzZWw6IHNlbGVjdG9yc1tpXS5zZWwpXG5cbiAgICByZXR1cm4gY2xhc3NlczogY2xhc3NlcywgaWRzOiBpZHNcblxuICBvbkRpZFVwZGF0ZTogKGNiKS0+XG4gICAgQGVtaXR0ZXIub24oJ29uRGlkVXBkYXRlJywgY2IpXG5cbm1vZHVsZS5leHBvcnRzID0gU1NQYXJzZXJcbiJdfQ==
