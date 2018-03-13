(function() {
  var CompositeDisposable, Disposable, FilesList, Manager, PopupList, ReferencesList, SSParser, _, path, ref, ref1;

  SSParser = require('./stylesParser');

  _ = require('lodash');

  ref = require('event-kit'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  path = require('path');

  ref1 = require('./atom-css-class-checker-view'), PopupList = ref1.PopupList, ReferencesList = ref1.ReferencesList, FilesList = ref1.FilesList;

  Manager = (function() {
    function Manager() {
      this.parser = null;
      this.prevEditor = {};
      this.disposables = [];
      this.htmlContFiles = ['.html', '.php'];
      this.cssFiles = ['.css'];
      this.running = false;
      this.editorsMarkers = [];
      atom.commands.add('atom-workspace', {
        'atom-css-class-checker:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'atom-css-class-checker:open-source': (function(_this) {
          return function() {
            console.log('opening source');
            return _this.openSource();
          };
        })(this)
      });
    }

    Manager.prototype.init = function() {
      this.parser = new SSParser();
      this.parser.loaded.then((function(_this) {
        return function() {
          var compositeDisposable;
          compositeDisposable = new CompositeDisposable();
          _this.disposables['global'] = compositeDisposable;
          compositeDisposable.add(atom.workspace.observeTextEditors(function(editor) {
            var title;
            title = editor.getTitle();
            if (_this.containsHtml(title)) {
              _this.subscribeOnHtmlEditorEvents(editor);
              _this.parseEditor(editor);
              return _this.parser.onDidUpdate(function() {
                console.log('reparsing editor ', editor.getTitle());
                return _this.parseEditor(editor);
              });
            }
          }));
          _this.watchCssChangings();
          return _this.subscribeOnSettingsChanges();
        };
      })(this));
      return this.running = true;
    };

    Manager.prototype.containsHtml = function(filename) {
      return _.indexOf(this.htmlContFiles, path.extname(filename)) !== -1;
    };

    Manager.prototype.containsCss = function(filename) {
      return _.indexOf(this.cssFiles, path.extname(filename)) !== -1;
    };

    Manager.prototype.watchCssChangings = function() {
      var disposable, getPrevEditor;
      console.log('watching CSSSSSS chanfes');
      disposable = null;
      getPrevEditor = (function(_this) {
        return function(editor) {
          var dispose;
          _this.prevEditor.editor = editor || atom.workspace.getActivePaneItem();
          if (_this.prevEditor.editor === void 0) {
            if (disposable != null) {
              disposable.dispose();
            }
            dispose = null;
            return;
          }
          _this.prevEditor.isCss = _this.containsCss(_this.prevEditor.editor.getTitle());
          _this.prevEditor.modified = false;
          if (disposable != null) {
            disposable.dispose();
          }
          if (_this.prevEditor.isCss) {
            return disposable = editor.onDidStopChanging(function() {
              console.log('modified');
              _this.prevEditor.modified = true;
              disposable.dispose();
              return disposable = null;
            });
          } else {
            return disposable = null;
          }
        };
      })(this);
      getPrevEditor();
      return this.disposables['global'].add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          console.log('on did change');
          if (_this.prevEditor.isCss && _this.prevEditor.modified) {
            console.log('did parsing required');
            _this.parser.updateWithSSFile(_this.prevEditor.editor.getUri(), _this.prevEditor.editor.getText());
            _this.prevEditor.modified = false;
          }
          return getPrevEditor(item);
        };
      })(this)));
    };

    Manager.prototype.subscribeOnHtmlEditorEvents = function(editor) {
      var compositeDisposable, editorUri;
      editorUri = editor.getUri();
      compositeDisposable = new CompositeDisposable();
      compositeDisposable.add(editor.onDidStopChanging((function(_this) {
        return function() {
          var range;
          range = editor.getCurrentParagraphBufferRange();
          if (range !== void 0) {
            return _this.parseTextRage(range, editor);
          }
        };
      })(this)));
      compositeDisposable.add(editor.onDidDestroy((function(_this) {
        return function() {
          var ref2;
          console.log('on did close');
          if ((ref2 = _this.disposables[editorUri]) != null) {
            ref2.dispose();
          }
          return _this.disposables[editorUri] = null;
        };
      })(this)));
      return this.disposables[editorUri] = compositeDisposable;
    };

    Manager.prototype.subscribeOnSettingsChanges = function() {
      return this.disposables['global'].add(atom.config.onDidChange('atom-css-class-checker.checkIds', (function(_this) {
        return function() {
          _this.cancel();
          return _this.init();
        };
      })(this)));
    };

    Manager.prototype.parseTextRage = function(range, editor) {
      var checkIds, i, r;
      checkIds = atom.config.get('atom-css-class-checker.checkIds');
      this.removeEditorMarkersInRange(range, editor);
      r = /class="([\w|\s|\-|_]*)"/gmi;
      i = /id\s*=\s*["|']\s*([\w|\-|_]*)\s*["|']/gmi;
      editor.scanInBufferRange(r, range, (function(_this) {
        return function(it) {
          it.range.start.column += it.matchText.indexOf('"');
          return _this.scanInRange(it.range, editor);
        };
      })(this));
      if (checkIds) {
        return editor.scan(i, (function(_this) {
          return function(it) {
            it.range.start.column += it.matchText.indexOf('"');
            return _this.highlightIdRange(it.range, it.match[1], editor);
          };
        })(this));
      }
    };

    Manager.prototype.parseEditor = function(editor) {
      var c, checkIds, i;
      checkIds = atom.config.get('atom-css-class-checker.checkIds');
      this.removeAllEditorMarkers(editor);
      c = /class=["|']([\w|\s|\-|_]*)["|']/gmi;
      i = /id\s*=\s*["|']\s*([\w|\-|_]*)\s*["|']/gmi;
      editor.scan(c, (function(_this) {
        return function(it) {
          it.range.start.column += it.matchText.indexOf('"');
          return _this.scanInRange(it.range, editor);
        };
      })(this));
      if (checkIds) {
        return editor.scan(i, (function(_this) {
          return function(it) {
            it.range.start.column += it.matchText.indexOf('"');
            return _this.highlightIdRange(it.range, it.match[1], editor);
          };
        })(this));
      }
    };

    Manager.prototype.removeEditorMarkersInRange = function(range, editor) {
      var i, j, markers, ref2;
      markers = this.editorsMarkers[editor.getUri()];
      if (!markers) {
        return;
      }
      for (i = j = 0, ref2 = markers.length; 0 <= ref2 ? j < ref2 : j > ref2; i = 0 <= ref2 ? ++j : --j) {
        if (range.containsRange(markers[i].bufferMarker.range)) {
          markers[i].destroy();
          markers[i] = null;
        }
      }
      return this.editorsMarkers[editor.getUri()] = _.compact(markers);
    };

    Manager.prototype.removeAllEditorMarkers = function(editor) {
      var i, j, markers, ref2, uri;
      uri = editor.getUri();
      markers = this.editorsMarkers[uri];
      if (!markers) {
        return;
      }
      for (i = j = 0, ref2 = markers.length; 0 <= ref2 ? j < ref2 : j > ref2; i = 0 <= ref2 ? ++j : --j) {
        markers[i].destroy();
      }
      return this.editorsMarkers[uri].length = 0;
    };

    Manager.prototype.removeAllMarkers = function() {
      var i, j, k, ref2, ref3, results, v;
      ref2 = this.editorsMarkers;
      results = [];
      for (k in ref2) {
        v = ref2[k];
        for (i = j = 0, ref3 = this.editorsMarkers[k].length; 0 <= ref3 ? j < ref3 : j > ref3; i = 0 <= ref3 ? ++j : --j) {
          this.editorsMarkers[k][i].destroy();
        }
        results.push(delete this.editorsMarkers[k]);
      }
      return results;
    };

    Manager.prototype.createEditorMarker = function(editor, range, type) {
      var marker, uri;
      marker = editor.markBufferRange(range, {
        invalidate: 'overlap'
      });
      marker.type = type;
      uri = editor.getUri();
      if (this.editorsMarkers[uri] !== void 0) {
        this.editorsMarkers[uri].push(marker);
      } else {
        this.editorsMarkers[uri] = [marker];
      }
      return marker;
    };

    Manager.prototype.highlightClassRange = function(range, text, editor) {
      var marker;
      if (!(range !== void 0 && text !== void 0 && editor !== void 0)) {
        return;
      }
      marker = this.createEditorMarker(editor, range, 'class');
      if (_.findIndex(this.parser.classes, {
        name: text
      }) !== -1) {
        return editor.decorateMarker(marker, {
          type: 'highlight',
          "class": 'existed-class'
        });
      } else {
        return editor.decorateMarker(marker, {
          type: 'highlight',
          "class": 'non-existed-class'
        });
      }
    };

    Manager.prototype.highlightIdRange = function(range, text, editor) {
      var marker;
      if (!(range !== void 0 && text !== void 0 && editor !== void 0)) {
        return;
      }
      marker = this.createEditorMarker(editor, range, 'id');
      if (_.findIndex(this.parser.ids, {
        name: text
      }) !== -1) {
        return editor.decorateMarker(marker, {
          type: 'highlight',
          "class": 'existed-class'
        });
      } else {
        return editor.decorateMarker(marker, {
          type: 'highlight',
          "class": 'non-existed-class'
        });
      }
    };

    Manager.prototype.scanInRange = function(range, editor) {
      var r;
      r = /([\w|\-|_]+)/ig;
      return editor.scanInBufferRange(r, range, (function(_this) {
        return function(it) {
          return _this.highlightClassRange(it.range, it.matchText, editor);
        };
      })(this));
    };

    Manager.prototype.cancel = function() {
      var k, ref2, v;
      this.removeAllMarkers();
      delete this.parser;
      ref2 = this.disposables;
      for (k in ref2) {
        v = ref2[k];
        v.dispose();
      }
      return this.running = false;
    };

    Manager.prototype.toggle = function() {
      if (this.running) {
        console.log('pausing');
        return this.cancel();
      } else {
        console.log('starting');
        return this.init();
      }
    };

    Manager.prototype.openSource = function() {
      var editor, findSelectors, getMarkerInfo, items, markerInfo, onConfirmFile, onConfirmReference, openEditor, references, toggleFilesList, toggleReferencesList;
      openEditor = function(filename, line) {
        var openInSplit, options;
        if (line == null) {
          line = 0;
        }
        openInSplit = atom.config.get('atom-css-class-checker.openSourceInSplitWindow');
        options = {
          split: openInSplit ? 'right' : void 0
        };
        return atom.workspace.open(filename, options).then(function(editor) {
          editor.setCursorBufferPosition([line, 0]);
          editor.scrollToCursorPosition();
          return editor;
        });
      };
      onConfirmReference = function(item) {
        return openEditor(item.file, item.pos.start.line);
      };
      onConfirmFile = function(item) {
        console.log('onConfirmFileCalled');
        return openEditor(item.path, 0).then(function(editor) {
          return editor.setCursorScreenPosition([editor.getScreenLineCount(), 0]);
        });
      };
      toggleReferencesList = function(items, editor) {
        var popup;
        popup = new ReferencesList(editor);
        popup.setItems(items);
        popup.onConfirm = onConfirmReference;
        return popup.toggle();
      };
      toggleFilesList = function(items, editor) {
        var popup;
        popup = new FilesList(editor);
        popup.setItems(items);
        popup.onConfirm = onConfirmFile;
        return popup.toggle();
      };
      getMarkerInfo = (function(_this) {
        return function(editor) {
          var cursorPoint, i, j, markers, range, ref2, text, type;
          markers = _this.editorsMarkers[editor.getUri()];
          cursorPoint = editor.getCursorBufferPosition();
          for (i = j = 0, ref2 = markers.length; 0 <= ref2 ? j < ref2 : j > ref2; i = 0 <= ref2 ? ++j : --j) {
            range = markers[i].getBufferRange();
            if (range.containsPoint(cursorPoint)) {
              console.log('contains', markers[i]);
              text = editor.getTextInBufferRange(range);
              type = markers[i].type;
              break;
            }
          }
          return {
            text: text,
            type: type
          };
        };
      })(this);
      findSelectors = (function(_this) {
        return function(type, selName) {
          var findReferences;
          findReferences = function(selectors, selName) {
            var i, j, ref2, res, subsels;
            subsels = _.filter(selectors, {
              name: selName
            });
            res = [];
            for (i = j = 0, ref2 = subsels.length; 0 <= ref2 ? j < ref2 : j > ref2; i = 0 <= ref2 ? ++j : --j) {
              res = res.concat(subsels[i].references);
            }
            return res;
          };
          switch (type) {
            case 'class':
              return findReferences(_this.parser.classes, selName);
            case 'id':
              return findReferences(_this.parser.ids, selName);
          }
        };
      })(this);
      editor = atom.workspace.getActiveTextEditor();
      markerInfo = getMarkerInfo(editor);
      if (markerInfo.text === void 0) {
        return;
      }
      references = findSelectors(markerInfo.type, markerInfo.text);
      switch (references.length) {
        case 0:
          items = _.map(this.parser.ssFiles, function(file) {
            return {
              filename: path.basename(file),
              path: file
            };
          });
          toggleFilesList(items, editor);
          break;
        case 1:
          openEditor(references[0].file, references[0].pos.start.line);
          break;
        default:
          console.log(editor);
          toggleReferencesList(references, editor);
          break;
      }
    };

    return Manager;

  })();

  module.exports = Manager;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdG9tLWNzcy1jbGFzcy1jaGVja2VyL2xpYi9hdG9tLWNzcy1jbGFzcy1jaGVja2VyLW1hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGdCQUFSOztFQUNYLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFDSixNQUFvQyxPQUFBLENBQVEsV0FBUixDQUFwQyxFQUFDLDZDQUFELEVBQXNCOztFQUN0QixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsT0FBeUMsT0FBQSxDQUFRLCtCQUFSLENBQXpDLEVBQUMsMEJBQUQsRUFBWSxvQ0FBWixFQUE0Qjs7RUFJdEI7SUFFUyxpQkFBQTtNQUNYLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFDVixJQUFDLENBQUEsVUFBRCxHQUFjO01BQ2QsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxhQUFELEdBQWlCLENBQUMsT0FBRCxFQUFVLE1BQVY7TUFDakIsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFDLE1BQUQ7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFXO01BQ1gsSUFBQyxDQUFBLGNBQUQsR0FBa0I7TUFFbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLCtCQUFBLEVBQWlDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ25FLEtBQUMsQ0FBQSxNQUFELENBQUE7VUFEbUU7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpDO09BQXBDO01BR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLG9DQUFBLEVBQXNDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7WUFDeEUsT0FBTyxDQUFDLEdBQVIs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O0FBQ2IsY0FBTyxVQUFVLENBQUMsTUFBbEI7QUFBQSxhQUNPLENBRFA7VUFFSSxLQUFBLEdBQVEsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQWQsRUFBdUIsU0FBQyxJQUFEO0FBQzdCLG1CQUFPO2NBQ0wsUUFBQSxFQUFVLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZCxDQURMO2NBRUwsSUFBQSxFQUFNLElBRkQ7O1VBRHNCLENBQXZCO1VBS1IsZUFBQSxDQUFnQixLQUFoQixFQUF1QixNQUF2QjtBQUNBO0FBUkosYUFTTyxDQVRQO1VBVUksVUFBQSxDQUFXLFVBQVcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUF6QixFQUErQixVQUFXLENBQUEsQ0FBQSxDQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUF2RDtBQUNBO0FBWEo7VUFhSSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVo7VUFDQSxvQkFBQSxDQUFxQixVQUFyQixFQUFpQyxNQUFqQztBQUNBO0FBZko7SUFqRVU7Ozs7OztFQXNGZCxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQXZTakIiLCJzb3VyY2VzQ29udGVudCI6WyJTU1BhcnNlciA9IHJlcXVpcmUgJy4vc3R5bGVzUGFyc2VyJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbntDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2V2ZW50LWtpdCdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xue1BvcHVwTGlzdCwgUmVmZXJlbmNlc0xpc3QsIEZpbGVzTGlzdH0gPSByZXF1aXJlICcuL2F0b20tY3NzLWNsYXNzLWNoZWNrZXItdmlldydcblxuXG5cbmNsYXNzIE1hbmFnZXJcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAcGFyc2VyID0gbnVsbFxuICAgIEBwcmV2RWRpdG9yID0ge31cbiAgICBAZGlzcG9zYWJsZXMgPSBbXVxuICAgIEBodG1sQ29udEZpbGVzID0gWycuaHRtbCcsICcucGhwJ11cbiAgICBAY3NzRmlsZXMgPSBbJy5jc3MnXVxuICAgIEBydW5uaW5nID0gZmFsc2VcbiAgICBAZWRpdG9yc01hcmtlcnMgPSBbXVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2F0b20tY3NzLWNsYXNzLWNoZWNrZXI6dG9nZ2xlJzogPT5cbiAgICAgIEB0b2dnbGUoKVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2F0b20tY3NzLWNsYXNzLWNoZWNrZXI6b3Blbi1zb3VyY2UnOiA9PlxuICAgICAgY29uc29sZS5sb2cgJ29wZW5pbmcgc291cmNlJ1xuICAgICAgQG9wZW5Tb3VyY2UoKVxuXG5cbiAgaW5pdDogLT5cbiAgICBAcGFyc2VyID0gbmV3IFNTUGFyc2VyKClcbiAgICBAcGFyc2VyLmxvYWRlZC50aGVuID0+XG4gICAgICAjIHN1YnNjcmliaW5nIG9ubHkgb24gZmlsZXMgd2hpY2ggbWF5IGNvbnRhaW4gSFRNTFxuICAgICAgY29tcG9zaXRlRGlzcG9zYWJsZSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAgIEBkaXNwb3NhYmxlc1snZ2xvYmFsJ10gPSBjb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICBjb21wb3NpdGVEaXNwb3NhYmxlLmFkZCAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpPT5cbiAgICAgICAgdGl0bGUgPSBlZGl0b3IuZ2V0VGl0bGUoKVxuICAgICAgICBpZiBAY29udGFpbnNIdG1sKHRpdGxlKVxuICAgICAgICAgIEBzdWJzY3JpYmVPbkh0bWxFZGl0b3JFdmVudHMoZWRpdG9yKVxuICAgICAgICAgIEBwYXJzZUVkaXRvcihlZGl0b3IpXG4gICAgICAgICAgIyBzdWJzY3JpYmluZyBvbiBwYXJzZXIgdXBkYXRlc1xuICAgICAgICAgIEBwYXJzZXIub25EaWRVcGRhdGUgPT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICdyZXBhcnNpbmcgZWRpdG9yICcsIGVkaXRvci5nZXRUaXRsZSgpXG4gICAgICAgICAgICBAcGFyc2VFZGl0b3IoZWRpdG9yKVxuXG4gICAgICAjICBzdXNic2NyaWJpbmcgb24gY3NzIGNoYW5nZXNcbiAgICAgIEB3YXRjaENzc0NoYW5naW5ncygpXG4gICAgICBAc3Vic2NyaWJlT25TZXR0aW5nc0NoYW5nZXMoKVxuICAgIEBydW5uaW5nID0gdHJ1ZVxuXG4gIGNvbnRhaW5zSHRtbDogKGZpbGVuYW1lKS0+XG4gICAgcmV0dXJuIChfLmluZGV4T2YoQGh0bWxDb250RmlsZXMsIHBhdGguZXh0bmFtZShmaWxlbmFtZSkpICE9IC0xKVxuXG4gIGNvbnRhaW5zQ3NzOiAoZmlsZW5hbWUpLT5cbiAgICByZXR1cm4gKF8uaW5kZXhPZihAY3NzRmlsZXMsIHBhdGguZXh0bmFtZShmaWxlbmFtZSkpICE9IC0xKVxuXG4gIHdhdGNoQ3NzQ2hhbmdpbmdzOiAtPlxuICAgIGNvbnNvbGUubG9nICd3YXRjaGluZyBDU1NTU1NTIGNoYW5mZXMnO1xuICAgIGRpc3Bvc2FibGUgPSBudWxsXG4gICAgZ2V0UHJldkVkaXRvciA9IChlZGl0b3IpPT5cbiAgICAgIEBwcmV2RWRpdG9yLmVkaXRvciA9IGVkaXRvciB8fCBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgICBpZiAoQHByZXZFZGl0b3IuZWRpdG9yID09IHVuZGVmaW5lZClcbiAgICAgICAgZGlzcG9zYWJsZT8uZGlzcG9zZSgpXG4gICAgICAgIGRpc3Bvc2UgPSBudWxsXG4gICAgICAgIHJldHVyblxuICAgICAgQHByZXZFZGl0b3IuaXNDc3MgPSBAY29udGFpbnNDc3MoQHByZXZFZGl0b3IuZWRpdG9yLmdldFRpdGxlKCkpXG4gICAgICBAcHJldkVkaXRvci5tb2RpZmllZCA9IGZhbHNlXG4gICAgICBkaXNwb3NhYmxlPy5kaXNwb3NlKClcbiAgICAgIGlmIEBwcmV2RWRpdG9yLmlzQ3NzXG4gICAgICAgIGRpc3Bvc2FibGUgPSBlZGl0b3Iub25EaWRTdG9wQ2hhbmdpbmcgPT5cbiAgICAgICAgICBjb25zb2xlLmxvZyAnbW9kaWZpZWQnO1xuICAgICAgICAgIEBwcmV2RWRpdG9yLm1vZGlmaWVkID0gdHJ1ZVxuICAgICAgICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgICAgICAgZGlzcG9zYWJsZSA9IG51bGxcbiAgICAgIGVsc2VcbiAgICAgICAgZGlzcG9zYWJsZSA9IG51bGxcblxuICAgIGdldFByZXZFZGl0b3IoKVxuICAgIEBkaXNwb3NhYmxlc1snZ2xvYmFsJ10uYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0gKGl0ZW0pPT5cbiAgICAgIGNvbnNvbGUubG9nICdvbiBkaWQgY2hhbmdlJztcbiAgICAgICMgcGFyc2luZyBjc3MgZmlsZSBpZiBpdCBpcyByZXF1aXJlZFxuICAgICAgaWYgKEBwcmV2RWRpdG9yLmlzQ3NzICYmIEBwcmV2RWRpdG9yLm1vZGlmaWVkKVxuICAgICAgICBjb25zb2xlLmxvZyAnZGlkIHBhcnNpbmcgcmVxdWlyZWQnXG4gICAgICAgIEBwYXJzZXIudXBkYXRlV2l0aFNTRmlsZShAcHJldkVkaXRvci5lZGl0b3IuZ2V0VXJpKCksIEBwcmV2RWRpdG9yLmVkaXRvci5nZXRUZXh0KCkpXG4gICAgICAgIEBwcmV2RWRpdG9yLm1vZGlmaWVkID0gZmFsc2U7XG4gICAgICBnZXRQcmV2RWRpdG9yKGl0ZW0pXG5cblxuICBzdWJzY3JpYmVPbkh0bWxFZGl0b3JFdmVudHM6IChlZGl0b3IpLT5cbiAgICBlZGl0b3JVcmkgPSBlZGl0b3IuZ2V0VXJpKClcbiAgICBjb21wb3NpdGVEaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgICAjIHJlcGFyc2luZyBmaWxlIG9uIGNoYW5naW5nc1xuICAgIGNvbXBvc2l0ZURpc3Bvc2FibGUuYWRkIGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZyA9PlxuICAgICAgIHJhbmdlID0gZWRpdG9yLmdldEN1cnJlbnRQYXJhZ3JhcGhCdWZmZXJSYW5nZSgpXG4gICAgICAgQHBhcnNlVGV4dFJhZ2UocmFuZ2UsIGVkaXRvcikgdW5sZXNzIHJhbmdlID09IHVuZGVmaW5lZFxuXG4gICAgY29tcG9zaXRlRGlzcG9zYWJsZS5hZGQgZWRpdG9yLm9uRGlkRGVzdHJveSA9PlxuICAgICAgY29uc29sZS5sb2cgJ29uIGRpZCBjbG9zZSdcbiAgICAgIEBkaXNwb3NhYmxlc1tlZGl0b3JVcmldPy5kaXNwb3NlKClcbiAgICAgIEBkaXNwb3NhYmxlc1tlZGl0b3JVcmldID0gbnVsbFxuXG5cbiAgICBAZGlzcG9zYWJsZXNbZWRpdG9yVXJpXSA9IGNvbXBvc2l0ZURpc3Bvc2FibGVcblxuICBzdWJzY3JpYmVPblNldHRpbmdzQ2hhbmdlczogKCktPlxuICAgIEBkaXNwb3NhYmxlc1snZ2xvYmFsJ10uYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdhdG9tLWNzcy1jbGFzcy1jaGVja2VyLmNoZWNrSWRzJywgPT5cbiAgICAgIEBjYW5jZWwoKVxuICAgICAgQGluaXQoKVxuXG4gIHBhcnNlVGV4dFJhZ2U6IChyYW5nZSwgZWRpdG9yKS0+XG4gICAgY2hlY2tJZHMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY3NzLWNsYXNzLWNoZWNrZXIuY2hlY2tJZHMnKVxuICAgIEByZW1vdmVFZGl0b3JNYXJrZXJzSW5SYW5nZShyYW5nZSwgZWRpdG9yKVxuICAgIHIgPSAvY2xhc3M9XCIoW1xcd3xcXHN8XFwtfF9dKilcIi9nbWlcbiAgICBpID0gL2lkXFxzKj1cXHMqW1wifCddXFxzKihbXFx3fFxcLXxfXSopXFxzKltcInwnXS9nbWlcbiAgICAjICBzY2FubmluZyBmb3IgY2xhc2Vlc1xuICAgIGVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZSByLCByYW5nZSwgKGl0KT0+XG4gICAgICBpdC5yYW5nZS5zdGFydC5jb2x1bW4gKz0gaXQubWF0Y2hUZXh0LmluZGV4T2YoJ1wiJylcbiAgICAgIEBzY2FuSW5SYW5nZShpdC5yYW5nZSwgZWRpdG9yKVxuICAgICMgc2Nhbm5pbmcgZm9yIGlkc1xuICAgIGlmIGNoZWNrSWRzXG4gICAgICBlZGl0b3Iuc2NhbiBpLCAoaXQpPT5cbiAgICAgICAgaXQucmFuZ2Uuc3RhcnQuY29sdW1uICs9IGl0Lm1hdGNoVGV4dC5pbmRleE9mKCdcIicpXG4gICAgICAgIEBoaWdobGlnaHRJZFJhbmdlKGl0LnJhbmdlLCBpdC5tYXRjaFsxXSwgZWRpdG9yKVxuXG4gIHBhcnNlRWRpdG9yOiAoZWRpdG9yKS0+XG4gICAgY2hlY2tJZHMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY3NzLWNsYXNzLWNoZWNrZXIuY2hlY2tJZHMnKVxuICAgIEByZW1vdmVBbGxFZGl0b3JNYXJrZXJzKGVkaXRvcilcbiAgICBjID0gL2NsYXNzPVtcInwnXShbXFx3fFxcc3xcXC18X10qKVtcInwnXS9nbWlcbiAgICBpID0gL2lkXFxzKj1cXHMqW1wifCddXFxzKihbXFx3fFxcLXxfXSopXFxzKltcInwnXS9nbWlcbiAgICAjIHNjYW5uaW5nIGZvciBjbGFzc2VzXG4gICAgZWRpdG9yLnNjYW4gYywgKGl0KT0+XG4gICAgICBpdC5yYW5nZS5zdGFydC5jb2x1bW4gKz0gaXQubWF0Y2hUZXh0LmluZGV4T2YoJ1wiJylcbiAgICAgIEBzY2FuSW5SYW5nZShpdC5yYW5nZSwgZWRpdG9yKVxuICAgICMgc2Nhbm5pbmcgZm9yIGlkc1xuICAgIGlmIGNoZWNrSWRzXG4gICAgICBlZGl0b3Iuc2NhbiBpLCAoaXQpPT5cbiAgICAgICAgaXQucmFuZ2Uuc3RhcnQuY29sdW1uICs9IGl0Lm1hdGNoVGV4dC5pbmRleE9mKCdcIicpXG4gICAgICAgIEBoaWdobGlnaHRJZFJhbmdlKGl0LnJhbmdlLCBpdC5tYXRjaFsxXSwgZWRpdG9yKVxuXG4gIHJlbW92ZUVkaXRvck1hcmtlcnNJblJhbmdlOiAocmFuZ2UsIGVkaXRvciktPlxuICAgIG1hcmtlcnMgPSBAZWRpdG9yc01hcmtlcnNbZWRpdG9yLmdldFVyaSgpXVxuICAgIHJldHVybiB1bmxlc3MgbWFya2Vyc1xuICAgIGZvciBpIGluIFswLi4ubWFya2Vycy5sZW5ndGhdXG4gICAgICBpZiByYW5nZS5jb250YWluc1JhbmdlKG1hcmtlcnNbaV0uYnVmZmVyTWFya2VyLnJhbmdlKVxuICAgICAgICBtYXJrZXJzW2ldLmRlc3Ryb3koKVxuICAgICAgICBtYXJrZXJzW2ldID0gbnVsbFxuICAgIEBlZGl0b3JzTWFya2Vyc1tlZGl0b3IuZ2V0VXJpKCldID0gXy5jb21wYWN0KG1hcmtlcnMpXG5cbiAgcmVtb3ZlQWxsRWRpdG9yTWFya2VyczogKGVkaXRvciktPlxuICAgIHVyaSA9IGVkaXRvci5nZXRVcmkoKVxuICAgIG1hcmtlcnMgPSAgQGVkaXRvcnNNYXJrZXJzW3VyaV1cbiAgICByZXR1cm4gdW5sZXNzIG1hcmtlcnNcbiAgICBmb3IgaSBpbiBbMC4uLm1hcmtlcnMubGVuZ3RoXVxuICAgICAgbWFya2Vyc1tpXS5kZXN0cm95KClcbiAgICBAZWRpdG9yc01hcmtlcnNbdXJpXS5sZW5ndGggPSAwXG5cblxuICByZW1vdmVBbGxNYXJrZXJzOiAtPlxuICAgIGZvciBrLHYgb2YgQGVkaXRvcnNNYXJrZXJzXG4gICAgICBmb3IgaSBpbiBbMC4uLkBlZGl0b3JzTWFya2Vyc1trXS5sZW5ndGhdXG4gICAgICAgIEBlZGl0b3JzTWFya2Vyc1trXVtpXS5kZXN0cm95KClcbiAgICAgIGRlbGV0ZSBAZWRpdG9yc01hcmtlcnNba11cblxuICBjcmVhdGVFZGl0b3JNYXJrZXI6IChlZGl0b3IsIHJhbmdlLCB0eXBlKS0+XG4gICAgbWFya2VyID0gZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShyYW5nZSwgaW52YWxpZGF0ZTogJ292ZXJsYXAnKVxuICAgIG1hcmtlci50eXBlID0gdHlwZTtcbiAgICB1cmkgPSBlZGl0b3IuZ2V0VXJpKClcbiAgICBpZiBAZWRpdG9yc01hcmtlcnNbdXJpXSAhPSB1bmRlZmluZWRcbiAgICAgIEBlZGl0b3JzTWFya2Vyc1t1cmldLnB1c2gobWFya2VyKVxuICAgIGVsc2VcbiAgICAgIEBlZGl0b3JzTWFya2Vyc1t1cmldID0gW21hcmtlcl1cbiAgICByZXR1cm4gbWFya2VyXG5cbiAgaGlnaGxpZ2h0Q2xhc3NSYW5nZTogKHJhbmdlLCB0ZXh0LCBlZGl0b3IpLT5cbiAgICByZXR1cm4gdW5sZXNzIHJhbmdlIGlzbnQgdW5kZWZpbmVkIGFuZCB0ZXh0IGlzbnQgdW5kZWZpbmVkIGFuZCBlZGl0b3IgaXNudCB1bmRlZmluZWRcbiAgICBtYXJrZXIgPSBAY3JlYXRlRWRpdG9yTWFya2VyKGVkaXRvciwgcmFuZ2UsICdjbGFzcycpXG4gICAgaWYgKF8uZmluZEluZGV4KEBwYXJzZXIuY2xhc3NlcywgbmFtZTogdGV4dCkgIT0gLTEpXG4gICAgICBlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB0eXBlOiAnaGlnaGxpZ2h0JywgY2xhc3M6ICdleGlzdGVkLWNsYXNzJylcbiAgICBlbHNlXG4gICAgICBlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB0eXBlOiAnaGlnaGxpZ2h0JywgY2xhc3M6ICdub24tZXhpc3RlZC1jbGFzcycpXG5cblxuICBoaWdobGlnaHRJZFJhbmdlOiAocmFuZ2UsIHRleHQsIGVkaXRvciktPlxuICAgIHJldHVybiB1bmxlc3MgcmFuZ2UgaXNudCB1bmRlZmluZWQgYW5kIHRleHQgaXNudCB1bmRlZmluZWQgYW5kIGVkaXRvciBpc250IHVuZGVmaW5lZFxuICAgIG1hcmtlciA9IEBjcmVhdGVFZGl0b3JNYXJrZXIoZWRpdG9yLCByYW5nZSwgJ2lkJylcbiAgICBpZiAoXy5maW5kSW5kZXgoQHBhcnNlci5pZHMsIG5hbWU6IHRleHQpICE9IC0xKVxuICAgICAgZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwgdHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiAnZXhpc3RlZC1jbGFzcycpXG4gICAgZWxzZVxuICAgICAgZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwgdHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiAnbm9uLWV4aXN0ZWQtY2xhc3MnKVxuXG4gIHNjYW5JblJhbmdlOiAocmFuZ2UsIGVkaXRvciktPlxuICAgIHIgPSAvKFtcXHd8XFwtfF9dKykvaWdcbiAgICBlZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UgciwgcmFuZ2UsIChpdCk9PlxuICAgICAgQGhpZ2hsaWdodENsYXNzUmFuZ2UoaXQucmFuZ2UsIGl0Lm1hdGNoVGV4dCwgZWRpdG9yKVxuXG4gIGNhbmNlbDogLT5cbiAgICBAcmVtb3ZlQWxsTWFya2VycygpXG4gICAgZGVsZXRlIEBwYXJzZXJcbiAgICBmb3Igayx2IG9mIEBkaXNwb3NhYmxlc1xuICAgICAgdi5kaXNwb3NlKClcbiAgICBAcnVubmluZyA9IGZhbHNlXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGlmIEBydW5uaW5nXG4gICAgICBjb25zb2xlLmxvZyAncGF1c2luZydcbiAgICAgIEBjYW5jZWwoKVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUubG9nICdzdGFydGluZydcbiAgICAgIEBpbml0KClcblxuICBvcGVuU291cmNlOiAtPlxuICAgICMgb3BlbnMgZWRpdG9yIHdpdGggc3BlY2lmaWVkIGZpbGVuYW1lXG4gICAgIyBpZiBsaW5lIHBhcmFtIG5vdCBzcGVjaWZpZWQgd2hlbiB0aGUgZWRpdG9yIHdpbGwgYmUgb3BlbmVkIG9uIHRoZSBsYXN0IGxpbmVcbiAgICBvcGVuRWRpdG9yID0gKGZpbGVuYW1lLCBsaW5lPTApLT5cbiAgICAgIG9wZW5JblNwbGl0ID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNzcy1jbGFzcy1jaGVja2VyLm9wZW5Tb3VyY2VJblNwbGl0V2luZG93Jyk7XG4gICAgICBvcHRpb25zID1cbiAgICAgICAgc3BsaXQ6IGlmIG9wZW5JblNwbGl0IHRoZW4gJ3JpZ2h0JyBlbHNlIHVuZGVmaW5lZFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlbmFtZSwgb3B0aW9ucylcbiAgICAgIC50aGVuIChlZGl0b3IpLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtsaW5lLCAwXSlcbiAgICAgICAgZWRpdG9yLnNjcm9sbFRvQ3Vyc29yUG9zaXRpb24oKVxuICAgICAgICByZXR1cm4gZWRpdG9yXG5cbiAgICBvbkNvbmZpcm1SZWZlcmVuY2UgPSAoaXRlbSkgLT5cbiAgICAgIG9wZW5FZGl0b3IoaXRlbS5maWxlLCBpdGVtLnBvcy5zdGFydC5saW5lKVxuXG4gICAgb25Db25maXJtRmlsZSA9IChpdGVtKSAtPlxuICAgICAgY29uc29sZS5sb2cgJ29uQ29uZmlybUZpbGVDYWxsZWQnXG4gICAgICBvcGVuRWRpdG9yKGl0ZW0ucGF0aCwgMCkudGhlbiAoZWRpdG9yKS0+XG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbiBbZWRpdG9yLmdldFNjcmVlbkxpbmVDb3VudCgpLCAwXVxuXG4gICAgdG9nZ2xlUmVmZXJlbmNlc0xpc3QgPSAoaXRlbXMsIGVkaXRvcikgLT5cbiAgICAgIHBvcHVwID0gbmV3IFJlZmVyZW5jZXNMaXN0KGVkaXRvcilcbiAgICAgIHBvcHVwLnNldEl0ZW1zKGl0ZW1zKVxuICAgICAgcG9wdXAub25Db25maXJtID0gb25Db25maXJtUmVmZXJlbmNlXG4gICAgICBwb3B1cC50b2dnbGUoKVxuXG4gICAgdG9nZ2xlRmlsZXNMaXN0ID0gKGl0ZW1zLCBlZGl0b3IpLT5cbiAgICAgIHBvcHVwID0gbmV3IEZpbGVzTGlzdChlZGl0b3IpXG4gICAgICBwb3B1cC5zZXRJdGVtcyhpdGVtcylcbiAgICAgIHBvcHVwLm9uQ29uZmlybSA9IG9uQ29uZmlybUZpbGVcbiAgICAgIHBvcHVwLnRvZ2dsZSgpXG5cbiAgICBnZXRNYXJrZXJJbmZvID0gKGVkaXRvcikgPT5cbiAgICAgIG1hcmtlcnMgPSBAZWRpdG9yc01hcmtlcnNbZWRpdG9yLmdldFVyaSgpXVxuICAgICAgY3Vyc29yUG9pbnQgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgICAgZm9yIGkgaW4gWzAuLi5tYXJrZXJzLmxlbmd0aF1cbiAgICAgICAgcmFuZ2UgPSBtYXJrZXJzW2ldLmdldEJ1ZmZlclJhbmdlKCk7XG4gICAgICAgIGlmIHJhbmdlLmNvbnRhaW5zUG9pbnQoY3Vyc29yUG9pbnQpXG4gICAgICAgICAgY29uc29sZS5sb2cgJ2NvbnRhaW5zJywgbWFya2Vyc1tpXTtcbiAgICAgICAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKTtcbiAgICAgICAgICB0eXBlID0gbWFya2Vyc1tpXS50eXBlO1xuICAgICAgICAgIGJyZWFrXG4gICAgICByZXR1cm4gdGV4dDogdGV4dCwgdHlwZTogdHlwZVxuXG4gICAgZmluZFNlbGVjdG9ycyA9ICh0eXBlLCBzZWxOYW1lKSA9PlxuICAgICAgZmluZFJlZmVyZW5jZXMgPSAoc2VsZWN0b3JzLCBzZWxOYW1lKSA9PlxuICAgICAgICBzdWJzZWxzID0gXy5maWx0ZXIoc2VsZWN0b3JzLCBuYW1lOiBzZWxOYW1lKVxuICAgICAgICByZXMgPSBbXVxuICAgICAgICBmb3IgaSBpbiBbMC4uLnN1YnNlbHMubGVuZ3RoXVxuICAgICAgICAgIHJlcyA9IHJlcy5jb25jYXQoc3Vic2Vsc1tpXS5yZWZlcmVuY2VzKVxuICAgICAgICByZXR1cm4gcmVzXG5cbiAgICAgIHN3aXRjaCB0eXBlXG4gICAgICAgIHdoZW4gJ2NsYXNzJ1xuICAgICAgICAgIHJldHVybiBmaW5kUmVmZXJlbmNlcyhAcGFyc2VyLmNsYXNzZXMsIHNlbE5hbWUpO1xuICAgICAgICB3aGVuICdpZCdcbiAgICAgICAgICByZXR1cm4gZmluZFJlZmVyZW5jZXMoQHBhcnNlci5pZHMsIHNlbE5hbWUpXG5cblxuXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgbWFya2VySW5mbyA9IGdldE1hcmtlckluZm8oZWRpdG9yKVxuICAgIHJldHVybiB1bmxlc3MgbWFya2VySW5mby50ZXh0ICE9IHVuZGVmaW5lZFxuICAgIHJlZmVyZW5jZXMgPSBmaW5kU2VsZWN0b3JzKG1hcmtlckluZm8udHlwZSwgbWFya2VySW5mby50ZXh0KVxuICAgIHN3aXRjaCByZWZlcmVuY2VzLmxlbmd0aFxuICAgICAgd2hlbiAwXG4gICAgICAgIGl0ZW1zID0gXy5tYXAgQHBhcnNlci5zc0ZpbGVzLCAoZmlsZSktPlxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmaWxlbmFtZTogcGF0aC5iYXNlbmFtZShmaWxlKSxcbiAgICAgICAgICAgIHBhdGg6IGZpbGVcbiAgICAgICAgICB9XG4gICAgICAgIHRvZ2dsZUZpbGVzTGlzdCBpdGVtcywgZWRpdG9yXG4gICAgICAgIGJyZWFrO1xuICAgICAgd2hlbiAxXG4gICAgICAgIG9wZW5FZGl0b3IgcmVmZXJlbmNlc1swXS5maWxlLCByZWZlcmVuY2VzWzBdLnBvcy5zdGFydC5saW5lXG4gICAgICAgIGJyZWFrO1xuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyBlZGl0b3JcbiAgICAgICAgdG9nZ2xlUmVmZXJlbmNlc0xpc3QgcmVmZXJlbmNlcywgZWRpdG9yXG4gICAgICAgIGJyZWFrO1xuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFuYWdlclxuIl19
