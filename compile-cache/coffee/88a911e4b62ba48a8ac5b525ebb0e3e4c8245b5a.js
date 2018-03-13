(function() {
  var CompositeDisposable, InputView, Os, Path, TextEditorView, View, fs, git, isEmpty, prepFile, ref, showCommitFilePath, showFile, showObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), TextEditorView = ref.TextEditorView, View = ref.View;

  git = require('../git');

  showCommitFilePath = function(objectHash) {
    return Path.join(Os.tmpDir(), objectHash + ".diff");
  };

  isEmpty = function(string) {
    return string === '';
  };

  showObject = function(repo, objectHash, file) {
    var args, showFormatOption;
    objectHash = isEmpty(objectHash) ? 'HEAD' : objectHash;
    args = ['show', '--color=never'];
    showFormatOption = atom.config.get('git-plus.general.showFormat');
    if (showFormatOption !== 'none') {
      args.push("--format=" + showFormatOption);
    }
    if (atom.config.get('git-plus.diffs.wordDiff')) {
      args.push('--word-diff');
    }
    args.push(objectHash);
    if (file != null) {
      args.push('--', file);
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      if (data.length > 0) {
        return prepFile(data, objectHash);
      }
    });
  };

  prepFile = function(text, objectHash) {
    return fs.writeFile(showCommitFilePath(objectHash), text, {
      flag: 'w+'
    }, function(err) {
      if (err) {
        return notifier.addError(err);
      } else {
        return showFile(objectHash);
      }
    });
  };

  showFile = function(objectHash) {
    var disposables, editorForDiffs, filePath, splitDirection;
    filePath = showCommitFilePath(objectHash);
    disposables = new CompositeDisposable;
    editorForDiffs = atom.workspace.getPaneItems().filter(function(item) {
      var ref1;
      return typeof item.getURI === "function" ? (ref1 = item.getURI()) != null ? ref1.includes('.diff') : void 0 : void 0;
    })[0];
    if (editorForDiffs != null) {
      return editorForDiffs.setText(fs.readFileSync(filePath, {
        encoding: 'utf-8'
      }));
    } else {
      if (atom.config.get('git-plus.general.openInPane')) {
        splitDirection = atom.config.get('git-plus.general.splitPane');
        atom.workspace.getCenter().getActivePane()["split" + splitDirection]();
      }
      return atom.workspace.open(filePath, {
        pending: true,
        activatePane: true
      }).then(function(textBuffer) {
        if (textBuffer != null) {
          return disposables.add(textBuffer.onDidDestroy(function() {
            disposables.dispose();
            try {
              return fs.unlinkSync(filePath);
            } catch (error) {}
          }));
        }
      });
    }
  };

  InputView = (function(superClass) {
    extend(InputView, superClass);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('objectHash', new TextEditorView({
            mini: true,
            placeholderText: 'Commit hash to show. (Defaults to HEAD)'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo1) {
      this.repo = repo1;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.objectHash.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function() {
            var text;
            text = _this.objectHash.getModel().getText().split(' ')[0];
            showObject(_this.repo, text);
            return _this.destroy();
          };
        })(this)
      }));
    };

    InputView.prototype.destroy = function() {
      var ref1, ref2;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return (ref2 = this.panel) != null ? ref2.destroy() : void 0;
    };

    return InputView;

  })(View);

  module.exports = function(repo, objectHash, file) {
    if (objectHash == null) {
      return new InputView(repo);
    } else {
      return showObject(repo, objectHash, file);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zaG93LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEseUlBQUE7SUFBQTs7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBRUosc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxtQ0FBRCxFQUFpQjs7RUFFakIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUVOLGtCQUFBLEdBQXFCLFNBQUMsVUFBRDtXQUNuQixJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxNQUFILENBQUEsQ0FBVixFQUEwQixVQUFELEdBQVksT0FBckM7RUFEbUI7O0VBR3JCLE9BQUEsR0FBVSxTQUFDLE1BQUQ7V0FBWSxNQUFBLEtBQVU7RUFBdEI7O0VBRVYsVUFBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLFVBQVAsRUFBbUIsSUFBbkI7QUFDWCxRQUFBO0lBQUEsVUFBQSxHQUFnQixPQUFBLENBQVEsVUFBUixDQUFILEdBQTJCLE1BQTNCLEdBQXVDO0lBQ3BELElBQUEsR0FBTyxDQUFDLE1BQUQsRUFBUyxlQUFUO0lBQ1AsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQjtJQUNuQixJQUE0QyxnQkFBQSxLQUFvQixNQUFoRTtNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBQSxHQUFZLGdCQUF0QixFQUFBOztJQUNBLElBQTJCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsQ0FBM0I7TUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLGFBQVYs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VixFQUROO0tBQUEsTUFBQTthQUdFLFVBQUEsQ0FBVyxJQUFYLEVBQWlCLFVBQWpCLEVBQTZCLElBQTdCLEVBSEY7O0VBRGU7QUFyRWpCIiwic291cmNlc0NvbnRlbnQiOlsiT3MgPSByZXF1aXJlICdvcydcblBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue1RleHRFZGl0b3JWaWV3LCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5cbnNob3dDb21taXRGaWxlUGF0aCA9IChvYmplY3RIYXNoKSAtPlxuICBQYXRoLmpvaW4gT3MudG1wRGlyKCksIFwiI3tvYmplY3RIYXNofS5kaWZmXCJcblxuaXNFbXB0eSA9IChzdHJpbmcpIC0+IHN0cmluZyBpcyAnJ1xuXG5zaG93T2JqZWN0ID0gKHJlcG8sIG9iamVjdEhhc2gsIGZpbGUpIC0+XG4gIG9iamVjdEhhc2ggPSBpZiBpc0VtcHR5IG9iamVjdEhhc2ggdGhlbiAnSEVBRCcgZWxzZSBvYmplY3RIYXNoXG4gIGFyZ3MgPSBbJ3Nob3cnLCAnLS1jb2xvcj1uZXZlciddXG4gIHNob3dGb3JtYXRPcHRpb24gPSBhdG9tLmNvbmZpZy5nZXQgJ2dpdC1wbHVzLmdlbmVyYWwuc2hvd0Zvcm1hdCdcbiAgYXJncy5wdXNoIFwiLS1mb3JtYXQ9I3tzaG93Rm9ybWF0T3B0aW9ufVwiIGlmIHNob3dGb3JtYXRPcHRpb24gIT0gJ25vbmUnXG4gIGFyZ3MucHVzaCAnLS13b3JkLWRpZmYnIGlmIGF0b20uY29uZmlnLmdldCAnZ2l0LXBsdXMuZGlmZnMud29yZERpZmYnXG4gIGFyZ3MucHVzaCBvYmplY3RIYXNoXG4gIGFyZ3MucHVzaCAnLS0nLCBmaWxlIGlmIGZpbGU/XG5cbiAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAudGhlbiAoZGF0YSkgLT4gcHJlcEZpbGUoZGF0YSwgb2JqZWN0SGFzaCkgaWYgZGF0YS5sZW5ndGggPiAwXG5cbnByZXBGaWxlID0gKHRleHQsIG9iamVjdEhhc2gpIC0+XG4gIGZzLndyaXRlRmlsZSBzaG93Q29tbWl0RmlsZVBhdGgob2JqZWN0SGFzaCksIHRleHQsIGZsYWc6ICd3KycsIChlcnIpIC0+XG4gICAgaWYgZXJyIHRoZW4gbm90aWZpZXIuYWRkRXJyb3IgZXJyIGVsc2Ugc2hvd0ZpbGUgb2JqZWN0SGFzaFxuXG5zaG93RmlsZSA9IChvYmplY3RIYXNoKSAtPlxuICBmaWxlUGF0aCA9IHNob3dDb21taXRGaWxlUGF0aChvYmplY3RIYXNoKVxuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIGVkaXRvckZvckRpZmZzID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKCkuZmlsdGVyKChpdGVtKSAtPiBpdGVtLmdldFVSST8oKT8uaW5jbHVkZXMoJy5kaWZmJykpWzBdXG4gIGlmIGVkaXRvckZvckRpZmZzP1xuICAgIGVkaXRvckZvckRpZmZzLnNldFRleHQgZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCBlbmNvZGluZzogJ3V0Zi04JylcbiAgZWxzZVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICAgIHNwbGl0RGlyZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLnNwbGl0UGFuZScpXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRBY3RpdmVQYW5lKClbXCJzcGxpdCN7c3BsaXREaXJlY3Rpb259XCJdKClcbiAgICBhdG9tLndvcmtzcGFjZVxuICAgICAgLm9wZW4oZmlsZVBhdGgsIHBlbmRpbmc6IHRydWUsIGFjdGl2YXRlUGFuZTogdHJ1ZSlcbiAgICAgIC50aGVuICh0ZXh0QnVmZmVyKSAtPlxuICAgICAgICBpZiB0ZXh0QnVmZmVyP1xuICAgICAgICAgIGRpc3Bvc2FibGVzLmFkZCB0ZXh0QnVmZmVyLm9uRGlkRGVzdHJveSAtPlxuICAgICAgICAgICAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgICAgICAgICB0cnkgZnMudW5saW5rU3luYyBmaWxlUGF0aFxuXG5jbGFzcyBJbnB1dFZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgPT5cbiAgICAgIEBzdWJ2aWV3ICdvYmplY3RIYXNoJywgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUsIHBsYWNlaG9sZGVyVGV4dDogJ0NvbW1pdCBoYXNoIHRvIHNob3cuIChEZWZhdWx0cyB0byBIRUFEKScpXG5cbiAgaW5pdGlhbGl6ZTogKEByZXBvKSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQG9iamVjdEhhc2guZm9jdXMoKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjYW5jZWwnOiA9PiBAZGVzdHJveSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb3JlOmNvbmZpcm0nOiA9PlxuICAgICAgdGV4dCA9IEBvYmplY3RIYXNoLmdldE1vZGVsKCkuZ2V0VGV4dCgpLnNwbGl0KCcgJylbMF1cbiAgICAgIHNob3dPYmplY3QoQHJlcG8sIHRleHQpXG4gICAgICBAZGVzdHJveSgpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZGlzcG9zYWJsZXM/LmRpc3Bvc2UoKVxuICAgIEBwYW5lbD8uZGVzdHJveSgpXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIG9iamVjdEhhc2gsIGZpbGUpIC0+XG4gIGlmIG5vdCBvYmplY3RIYXNoP1xuICAgIG5ldyBJbnB1dFZpZXcocmVwbylcbiAgZWxzZVxuICAgIHNob3dPYmplY3QocmVwbywgb2JqZWN0SGFzaCwgZmlsZSlcbiJdfQ==
