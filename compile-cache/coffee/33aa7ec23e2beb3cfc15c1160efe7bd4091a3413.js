(function() {
  var ArgumentParser, Emitter, File, InlineParameterParser, NodeSassCompiler, SassAutocompileOptions, exec, fs, path;

  Emitter = require('event-kit').Emitter;

  SassAutocompileOptions = require('./options');

  InlineParameterParser = require('./helper/inline-parameters-parser');

  File = require('./helper/file');

  ArgumentParser = require('./helper/argument-parser');

  fs = require('fs');

  path = require('path');

  exec = require('child_process').exec;

  module.exports = NodeSassCompiler = (function() {
    NodeSassCompiler.MODE_DIRECT = 'direct';

    NodeSassCompiler.MODE_FILE = 'to-file';

    function NodeSassCompiler(options) {
      this.options = options;
      this.emitter = new Emitter();
    }

    NodeSassCompiler.prototype.destroy = function() {
      this.emitter.dispose();
      return this.emitter = null;
    };

    NodeSassCompiler.prototype.compile = function(mode, filename, compileOnSave) {
      if (filename == null) {
        filename = null;
      }
      if (compileOnSave == null) {
        compileOnSave = false;
      }
      this.compileOnSave = compileOnSave;
      this.childFiles = {};
      return this._compile(mode, filename);
    };

    NodeSassCompiler.prototype._compile = function(mode, filename, compileOnSave) {
      var parameterParser, parameterTarget;
      if (filename == null) {
        filename = null;
      }
      if (compileOnSave == null) {
        compileOnSave = false;
      }
      this.mode = mode;
      this.targetFilename = filename;
      this.inputFile = void 0;
      this.outputFile = void 0;
      parameterParser = new InlineParameterParser();
      parameterTarget = this.getParameterTarget();
      return parameterParser.parse(parameterTarget, (function(_this) {
        return function(params, error) {
          var errorMessage;
          if (_this.compileOnSave && _this.prohibitCompilationOnSave(params)) {
            _this.emitFinished();
            return;
          }
          if (params === false && _this.options.compileOnlyFirstLineCommentFiles) {
            _this.emitFinished();
            return;
          }
          if (error) {
            _this.emitMessageAndFinish('error', error, true);
            return;
          }
          _this.setupInputFile(filename);
          if ((errorMessage = _this.validateInputFile()) !== void 0) {
            _this.emitMessageAndFinish('error', errorMessage, true);
            return;
          }
          if (params === false && _this.isPartial() && !_this.options.compilePartials) {
            _this.emitFinished();
            return;
          }
          if (typeof params.main === 'string') {
            if (params.main === _this.inputFile.path || _this.childFiles[params.main] !== void 0) {
              return _this.emitMessageAndFinish('error', 'Following the main parameter ends in a loop.');
            } else if (_this.inputFile.isTemporary) {
              return _this.emitMessageAndFinish('error', '\'main\' inline parameter is not supported in direct compilation.');
            } else {
              _this.childFiles[params.main] = true;
              return _this._compile(_this.mode, params.main);
            }
          } else {
            _this.emitStart();
            if (_this.isCompileToFile() && !_this.ensureFileIsSaved()) {
              _this.emitMessageAndFinish('warning', 'Compilation cancelled');
              return;
            }
            _this.updateOptionsWithInlineParameters(params);
            _this.outputStyles = _this.getOutputStylesToCompileTo();
            if (_this.outputStyles.length === 0) {
              _this.emitMessageAndFinish('warning', 'No output style defined! Please enable at least one style in options or use inline parameters.');
              return;
            }
            return _this.doCompile();
          }
        };
      })(this));
    };

    NodeSassCompiler.prototype.getParameterTarget = function() {
      if (typeof this.targetFilename === 'string') {
        return this.targetFilename;
      } else {
        return atom.workspace.getActiveTextEditor();
      }
    };

    NodeSassCompiler.prototype.prohibitCompilationOnSave = function(params) {
      var ref;
      if (params && ((ref = params.compileOnSave) === true || ref === false)) {
        this.options.compileOnSave = params.compileOnSave;
      }
      return !this.options.compileOnSave;
    };

    NodeSassCompiler.prototype.isPartial = function() {
      var filename;
      filename = path.basename(this.inputFile.path);
      return filename[0] === '_';
    };

    NodeSassCompiler.prototype.setupInputFile = function(filename) {
      var activeEditor, syntax;
      if (filename == null) {
        filename = null;
      }
      this.inputFile = {
        isTemporary: false
      };
      if (filename) {
        return this.inputFile.path = filename;
      } else {
        activeEditor = atom.workspace.getActiveTextEditor();
        if (!activeEditor) {
          return;
        }
        if (this.isCompileDirect()) {
          syntax = this.askForInputSyntax();
          if (syntax) {
            this.inputFile.path = File.getTemporaryFilename('sass-autocompile.input.', null, syntax);
            this.inputFile.isTemporary = true;
            return fs.writeFileSync(this.inputFile.path, activeEditor.getText());
          } else {
            return this.inputFile.path = void 0;
          }
        } else {
          this.inputFile.path = activeEditor.getURI();
          if (!this.inputFile.path) {
            return this.inputFile.path = this.askForSavingUnsavedFileInActiveEditor();
          }
        }
      }
    };

    NodeSassCompiler.prototype.askForInputSyntax = function() {
      var dialogResultButton, syntax;
      dialogResultButton = atom.confirm({
        message: "Is the syntax if your inout SASS or SCSS?",
        buttons: ['SASS', 'SCSS', 'Cancel']
      });
      switch (dialogResultButton) {
        case 0:
          syntax = 'sass';
          break;
        case 1:
          syntax = 'scss';
          break;
        default:
          syntax = void 0;
      }
      return syntax;
    };

    NodeSassCompiler.prototype.askForSavingUnsavedFileInActiveEditor = function() {
      var activeEditor, dialogResultButton, error, filename;
      activeEditor = atom.workspace.getActiveTextEditor();
      dialogResultButton = atom.confirm({
        message: "In order to compile this SASS file to a CSS file, you have do save it before. Do you want to save this file?",
        detailedMessage: "Alternativly you can use 'Direct Compilation' for compiling without creating a CSS file.",
        buttons: ["Save", "Cancel"]
      });
      if (dialogResultButton === 0) {
        filename = atom.showSaveDialogSync();
        try {
          activeEditor.saveAs(filename);
        } catch (error1) {
          error = error1;
        }
        filename = activeEditor.getURI();
        return filename;
      }
      return void 0;
    };

    NodeSassCompiler.prototype.validateInputFile = function() {
      var errorMessage;
      errorMessage = void 0;
      if (!this.inputFile.path) {
        errorMessage = 'Invalid file: ' + this.inputFile.path;
      }
      if (!fs.existsSync(this.inputFile.path)) {
        errorMessage = 'File does not exist: ' + this.inputFile.path;
      }
      return errorMessage;
    };

    NodeSassCompiler.prototype.ensureFileIsSaved = function() {
      var dialogResultButton, editor, editors, filename, j, len;
      editors = atom.workspace.getTextEditors();
      for (j = 0, len = editors.length; j < len; j++) {
        editor = editors[j];
        if (editor && editor.getURI && editor.getURI() === this.inputFile.path && editor.isModified()) {
          filename = path.basename(this.inputFile.path);
          dialogResultButton = atom.confirm({
            message: "'" + filename + "' has changes, do you want to save them?",
            detailedMessage: "In order to compile SASS you have to save changes.",
            buttons: ["Save and compile", "Cancel"]
          });
          if (dialogResultButton === 0) {
            editor.save();
            break;
          } else {
            return false;
          }
        }
      }
      return true;
    };

    NodeSassCompiler.prototype.updateOptionsWithInlineParameters = function(params) {
      var outputStyle, ref, ref1;
      if (typeof params.out === 'string' || typeof params.outputStyle === 'string' || typeof params.compress === 'boolean') {
        if (this.options.showOldParametersWarning) {
          this.emitMessage('warning', 'Please don\'t use \'out\', \'outputStyle\' or \'compress\' parameter any more. Have a look at the documentation for newer parameters');
        }
        outputStyle = 'compressed';
        if (params.compress === false) {
          outputStyle = 'nested';
        }
        if (params.compress === true) {
          outputStyle = 'compressed';
        }
        if (params.outputStyle) {
          outputStyle = typeof params.outputStyle === 'string' ? params.outputStyle.toLowerCase() : 'compressed';
        }
        this.options.compileCompressed = outputStyle === 'compressed';
        if (outputStyle === 'compressed' && typeof params.out === 'string' && params.out.length > 0) {
          this.options.compressedFilenamePattern = params.out;
        }
        this.options.compileCompact = outputStyle === 'compact';
        if (outputStyle === 'compact' && typeof params.out === 'string' && params.out.length > 0) {
          this.options.compactFilenamePattern = params.out;
        }
        this.options.compileNested = outputStyle === 'nested';
        if (outputStyle === 'nested' && typeof params.out === 'string' && params.out.length > 0) {
          this.options.nestedFilenamePattern = params.out;
        }
        this.options.compileExpanded = outputStyle === 'expanded';
        if (outputStyle === 'expanded' && typeof params.out === 'string' && params.out.length > 0) {
          this.options.expandedFilenamePattern = params.out;
        }
      }
      if (params.compileCompressed || params.compileCompact || params.compileNested || params.compileExpanded) {
        this.options.compileCompressed = false;
        this.options.compileCompact = false;
        this.options.compileNested = false;
        this.options.compileExpanded = false;
      }
      if (params.compileCompressed === true || params.compileCompressed === false) {
        this.options.compileCompressed = params.compileCompressed;
      } else if (typeof params.compileCompressed === 'string') {
        this.options.compileCompressed = true;
        this.options.compressedFilenamePattern = params.compileCompressed;
      }
      if (typeof params.compressedFilenamePattern === 'string' && params.compressedFilenamePattern.length > 1) {
        this.options.compressedFilenamePattern = params.compressedFilenamePattern;
      }
      if (params.compileCompact === true || params.compileCompact === false) {
        this.options.compileCompact = params.compileCompact;
      } else if (typeof params.compileCompact === 'string') {
        this.options.compileCompact = true;
        this.options.compactFilenamePattern = params.compileCompact;
      }
      if (typeof params.compactFilenamePattern === 'string' && params.compactFilenamePattern.length > 1) {
        this.options.compactFilenamePattern = params.compactFilenamePattern;
      }
      if (params.compileNested === true || params.compileNested === false) {
        this.options.compileNested = params.compileNested;
      } else if (typeof params.compileNested === 'string') {
        this.options.compileNested = true;
        this.options.nestedFilenamePattern = params.compileNested;
      }
      if (typeof params.nestedFilenamePattern === 'string' && params.nestedFilenamePattern.length > 1) {
        this.options.nestedFilenamePattern = params.nestedFilenamePattern;
      }
      if (params.compileExpanded === true || params.compileExpanded === false) {
        this.options.compileExpanded = params.compileExpanded;
      } else if (typeof params.compileExpanded === 'string') {
        this.options.compileExpanded = true;
        this.options.expandedFilenamePattern = params.compileExpanded;
      }
      if (typeof params.expandedFilenamePattern === 'string' && params.expandedFilenamePattern.length > 1) {
        this.options.expandedFilenamePattern = params.expandedFilenamePattern;
      }
      if (typeof params.indentType === 'string' && ((ref = params.indentType.toLowerCase()) === 'space' || ref === 'tab')) {
        this.options.indentType = params.indentType.toLowerCase();
      }
      if (typeof params.indentWidth === 'number' && params.indentWidth <= 10 && indentWidth >= 0) {
        this.options.indentWidth = params.indentWidth;
      }
      if (typeof params.linefeed === 'string' && ((ref1 = params.linefeed.toLowerCase()) === 'cr' || ref1 === 'crlf' || ref1 === 'lf' || ref1 === 'lfcr')) {
        this.options.linefeed = params.linefeed.toLowerCase();
      }
      if (params.sourceMap === true || params.sourceMap === false || (typeof params.sourceMap === 'string' && params.sourceMap.length > 1)) {
        this.options.sourceMap = params.sourceMap;
      }
      if (params.sourceMapEmbed === true || params.sourceMapEmbed === false) {
        this.options.sourceMapEmbed = params.sourceMapEmbed;
      }
      if (params.sourceMapContents === true || params.sourceMapContents === false) {
        this.options.sourceMapContents = params.sourceMapContents;
      }
      if (params.sourceComments === true || params.sourceComments === false) {
        this.options.sourceComments = params.sourceComments;
      }
      if ((typeof params.includePath === 'string' && params.includePath.length > 1) || Array.isArray(params.includePath)) {
        this.options.includePath = params.includePath;
      } else if ((typeof params.includePaths === 'string' && params.includePaths.length > 1) || Array.isArray(params.includePaths)) {
        this.options.includePath = params.includePaths;
      }
      if (typeof params.precision === 'number' && params.precision >= 0) {
        this.options.precision = params.precision;
      }
      if (typeof params.importer === 'string' && params.importer.length > 1) {
        this.options.importer = params.importer;
      }
      if (typeof params.functions === 'string' && params.functions.length > 1) {
        return this.options.functions = params.functions;
      }
    };

    NodeSassCompiler.prototype.getOutputStylesToCompileTo = function() {
      var dialogResultButton, outputStyles;
      outputStyles = [];
      if (this.options.compileCompressed) {
        outputStyles.push('compressed');
      }
      if (this.options.compileCompact) {
        outputStyles.push('compact');
      }
      if (this.options.compileNested) {
        outputStyles.push('nested');
      }
      if (this.options.compileExpanded) {
        outputStyles.push('expanded');
      }
      if (this.isCompileDirect() && outputStyles.length > 1) {
        outputStyles.push('Cancel');
        dialogResultButton = atom.confirm({
          message: "For direction compilation you have to select a single output style. Which one do you want to use?",
          buttons: outputStyles
        });
        if (dialogResultButton < outputStyles.length - 1) {
          outputStyles = [outputStyles[dialogResultButton]];
        } else {
          outputStyles = [];
        }
      }
      return outputStyles;
    };

    NodeSassCompiler.prototype.getOutputFile = function(outputStyle) {
      var basename, fileExtension, filename, outputFile, outputPath, pattern;
      outputFile = {
        style: outputStyle,
        isTemporary: false
      };
      if (this.isCompileDirect()) {
        outputFile.path = File.getTemporaryFilename('sass-autocompile.output.', null, 'css');
        outputFile.isTemporary = true;
      } else {
        switch (outputFile.style) {
          case 'compressed':
            pattern = this.options.compressedFilenamePattern;
            break;
          case 'compact':
            pattern = this.options.compactFilenamePattern;
            break;
          case 'nested':
            pattern = this.options.nestedFilenamePattern;
            break;
          case 'expanded':
            pattern = this.options.expandedFilenamePattern;
            break;
          default:
            throw new Error('Invalid output style.');
        }
        basename = path.basename(this.inputFile.path);
        fileExtension = path.extname(basename).replace('.', '');
        filename = basename.replace(new RegExp('^(.*?)\.(' + fileExtension + ')$', 'gi'), pattern);
        if (!path.isAbsolute(path.dirname(filename))) {
          outputPath = path.dirname(this.inputFile.path);
          filename = path.join(outputPath, filename);
        }
        outputFile.path = filename;
      }
      return outputFile;
    };

    NodeSassCompiler.prototype.checkOutputFileAlreadyExists = function(outputFile) {
      var dialogResultButton;
      if (this.options.checkOutputFileAlreadyExists) {
        if (fs.existsSync(outputFile.path)) {
          dialogResultButton = atom.confirm({
            message: "The output file already exists. Do you want to overwrite it?",
            detailedMessage: "Output file: '" + outputFile.path + "'",
            buttons: ["Overwrite", "Skip", "Cancel"]
          });
          switch (dialogResultButton) {
            case 0:
              return 'overwrite';
            case 1:
              return 'skip';
            case 2:
              return 'cancel';
          }
        }
      }
      return 'overwrite';
    };

    NodeSassCompiler.prototype.ensureOutputDirectoryExists = function(outputFile) {
      var outputPath;
      if (this.isCompileToFile()) {
        outputPath = path.dirname(outputFile.path);
        return File.ensureDirectoryExists(outputPath);
      }
    };

    NodeSassCompiler.prototype.tryToFindNodeSassInstallation = function(callback) {
      var checkNodeSassExists, devNull, existanceCheckCommand, possibleNodeSassPaths;
      devNull = process.platform === 'win32' ? 'nul' : '/dev/null';
      existanceCheckCommand = "node-sass --version >" + devNull + " 2>&1 && (echo found) || (echo fail)";
      possibleNodeSassPaths = [''];
      if (typeof this.options.nodeSassPath === 'string' && this.options.nodeSassPath.length > 1) {
        possibleNodeSassPaths.push(this.options.nodeSassPath);
      }
      if (process.platform === 'win32') {
        possibleNodeSassPaths.push(path.join(process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'], 'AppData\\Roaming\\npm'));
      }
      if (process.platform === 'linux') {
        possibleNodeSassPaths.push('/usr/local/bin');
      }
      if (process.platform === 'darwin') {
        possibleNodeSassPaths.push('/usr/local/bin');
      }
      checkNodeSassExists = (function(_this) {
        return function(foundInPath) {
          var command, environment, searchPath;
          if (typeof foundInPath === 'string') {
            if (foundInPath === _this.options.nodeSassPath) {
              callback(true, false);
            } else if (_this.askAndFixNodeSassPath(foundInPath)) {
              callback(true, true);
            } else {
              callback(false, false);
            }
            return;
          }
          if (possibleNodeSassPaths.length === 0) {
            callback(false, false);
            return;
          }
          searchPath = possibleNodeSassPaths.shift();
          command = path.join(searchPath, existanceCheckCommand);
          environment = JSON.parse(JSON.stringify(process.env));
          if (typeof searchPath === 'string' && searchPath.length > 1) {
            environment.PATH += ":" + searchPath;
          }
          return exec(command, {
            env: environment
          }, function(error, stdout, stderr) {
            if (stdout.trim() === 'found') {
              return checkNodeSassExists(searchPath);
            } else {
              return checkNodeSassExists();
            }
          });
        };
      })(this);
      return checkNodeSassExists();
    };

    NodeSassCompiler.prototype.askAndFixNodeSassPath = function(nodeSassPath) {
      var detailedMessage, dialogResultButton;
      if (nodeSassPath === '' && this.options.nodeSassPath !== '') {
        detailedMessage = "'Path to node-sass command' option will be cleared, because node-sass is accessable without absolute path.";
      } else if (nodeSassPath !== '' && this.options.nodeSassPath === '') {
        detailedMessage = "'Path to node-sass command' option will be set to '" + nodeSassPath + "', because command was found there.";
      } else if (nodeSassPath !== '' && this.options.nodeSassPath !== '') {
        detailedMessage = "'Path to node-sass command' option will be replaced with '" + nodeSassPath + "', because command was found there.";
      }
      dialogResultButton = atom.confirm({
        message: "'node-sass' command could not be found with current configuration, but it can be automatically fixed. Fix it?",
        detailedMessage: detailedMessage,
        buttons: ["Fix it", "Cancel"]
      });
      switch (dialogResultButton) {
        case 0:
          SassAutocompileOptions.set('nodeSassPath', nodeSassPath);
          this.options.nodeSassPath = nodeSassPath;
          return true;
        case 1:
          return false;
      }
    };

    NodeSassCompiler.prototype.doCompile = function() {
      var child, emitterParameters, error, execParameters, outputFile, outputStyle, timeout;
      if (this.outputStyles.length === 0) {
        this.emitFinished();
        if (this.inputFile.isTemporary) {
          File["delete"](this.inputFile.path);
        }
        return;
      }
      outputStyle = this.outputStyles.pop();
      outputFile = this.getOutputFile(outputStyle);
      emitterParameters = this.getBasicEmitterParameters({
        outputFilename: outputFile.path,
        outputStyle: outputFile.style
      });
      try {
        if (this.isCompileToFile()) {
          switch (this.checkOutputFileAlreadyExists(outputFile)) {
            case 'overwrite':
              break;
            case 'cancel':
              throw new Error('Compilation cancelled');
              break;
            case 'skip':
              emitterParameters.message = 'Compilation skipped: ' + outputFile.path;
              this.emitter.emit('warning', emitterParameters);
              this.doCompile();
              return;
          }
        }
        this.ensureOutputDirectoryExists(outputFile);
        this.startCompilingTimestamp = new Date().getTime();
        execParameters = this.prepareExecParameters(outputFile);
        timeout = this.options.nodeSassTimeout > 0 ? this.options.nodeSassTimeout : 0;
        return child = exec(execParameters.command, {
          env: execParameters.environment,
          timeout: timeout
        }, (function(_this) {
          return function(error, stdout, stderr) {
            if (child.exitCode > 0) {
              return _this.tryToFindNodeSassInstallation(function(found, fixed) {
                if (fixed) {
                  return _this._compile(_this.mode, _this.targetFilename);
                } else {
                  _this.onCompiled(outputFile, error, stdout, stderr, child.killed);
                  return _this.doCompile();
                }
              });
            } else {
              _this.onCompiled(outputFile, error, stdout, stderr, child.killed);
              return _this.doCompile();
            }
          };
        })(this));
      } catch (error1) {
        error = error1;
        emitterParameters.message = error;
        this.emitter.emit('error', emitterParameters);
        this.outputStyles = [];
        return this.doCompile();
      }
    };

    NodeSassCompiler.prototype.onCompiled = function(outputFile, error, stdout, stderr, killed) {
      var compiledCss, emitterParameters, errorJson, errorMessage, statistics;
      emitterParameters = this.getBasicEmitterParameters({
        outputFilename: outputFile.path,
        outputStyle: outputFile.style
      });
      statistics = {
        duration: new Date().getTime() - this.startCompilingTimestamp
      };
      try {
        emitterParameters.nodeSassOutput = stdout ? stdout : stderr;
        if (error !== null || killed) {
          if (killed) {
            errorMessage = "Compilation cancelled because of timeout (" + this.options.nodeSassTimeout + " ms)";
          } else {
            if (error.message.indexOf('"message":') > -1) {
              errorJson = error.message.match(/{\n(.*?(\n))+}/gm);
              errorMessage = JSON.parse(errorJson);
            } else {
              errorMessage = error.message;
            }
          }
          emitterParameters.message = errorMessage;
          this.emitter.emit('error', emitterParameters);
          return this.outputStyles = [];
        } else {
          statistics.before = File.getFileSize(this.inputFile.path);
          statistics.after = File.getFileSize(outputFile.path);
          statistics.unit = 'Byte';
          if (this.isCompileDirect()) {
            compiledCss = fs.readFileSync(outputFile.path);
            atom.workspace.getActiveTextEditor().setText(compiledCss.toString());
          }
          emitterParameters.statistics = statistics;
          return this.emitter.emit('success', emitterParameters);
        }
      } finally {
        if (outputFile.isTemporary) {
          File["delete"](outputFile.path);
        }
      }
    };

    NodeSassCompiler.prototype.prepareExecParameters = function(outputFile) {
      var command, environment, nodeSassParameters;
      nodeSassParameters = this.buildNodeSassParameters(outputFile);
      command = 'node-sass ' + nodeSassParameters.join(' ');
      environment = JSON.parse(JSON.stringify(process.env));
      if (typeof this.options.nodeSassPath === 'string' && this.options.nodeSassPath.length > 1) {
        command = path.join(this.options.nodeSassPath, command);
        environment.PATH += ":" + this.options.nodeSassPath;
      }
      return {
        command: command,
        environment: environment
      };
    };

    NodeSassCompiler.prototype.buildNodeSassParameters = function(outputFile) {
      var argumentParser, basename, execParameters, fileExtension, functionsFilename, i, importerFilename, includePath, j, ref, sourceMapFilename, workingDirectory;
      execParameters = [];
      workingDirectory = path.dirname(this.inputFile.path);
      execParameters.push('--output-style ' + outputFile.style);
      if (typeof this.options.indentType === 'string' && this.options.indentType.length > 0) {
        execParameters.push('--indent-type ' + this.options.indentType.toLowerCase());
      }
      if (typeof this.options.indentWidth === 'number') {
        execParameters.push('--indent-width ' + this.options.indentWidth);
      }
      if (typeof this.options.linefeed === 'string' && this.options.linefeed.lenght > 0) {
        execParameters.push('--linefeed ' + this.options.linefeed);
      }
      if (this.options.sourceComments === true) {
        execParameters.push('--source-comments');
      }
      if (this.options.sourceMap === true || (typeof this.options.sourceMap === 'string' && this.options.sourceMap.length > 0)) {
        if (this.options.sourceMap === true) {
          sourceMapFilename = outputFile.path + '.map';
        } else {
          basename = path.basename(outputFile.path);
          fileExtension = path.extname(basename).replace('.', '');
          sourceMapFilename = basename.replace(new RegExp('^(.*?)\.(' + fileExtension + ')$', 'gi'), this.options.sourceMap);
        }
        execParameters.push('--source-map "' + sourceMapFilename + '"');
      }
      if (this.options.sourceMapEmbed === true) {
        execParameters.push('--source-map-embed');
      }
      if (this.options.sourceMapContents === true) {
        execParameters.push('--source-map-contents');
      }
      if (this.options.includePath) {
        includePath = this.options.includePath;
        if (typeof includePath === 'string') {
          argumentParser = new ArgumentParser();
          includePath = argumentParser.parseValue('[' + includePath + ']');
          if (!Array.isArray(includePath)) {
            includePath = [includePath];
          }
        }
        for (i = j = 0, ref = includePath.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          if (!path.isAbsolute(includePath[i])) {
            includePath[i] = path.join(workingDirectory, includePath[i]);
          }
          if (includePath[i].substr(-1) === path.sep) {
            includePath[i] = includePath[i].substr(0, includePath[i].length - 1);
          }
          execParameters.push('--include-path "' + includePath[i] + '"');
        }
      }
      if (typeof this.options.precision === 'number') {
        execParameters.push('--precision ' + this.options.precision);
      }
      if (typeof this.options.importer === 'string' && this.options.importer.length > 0) {
        importerFilename = this.options.importer;
        if (!path.isAbsolute(importerFilename)) {
          importerFilename = path.join(workingDirectory, importerFilename);
        }
        execParameters.push('--importer "' + path.resolve(importerFilename) + '"');
      }
      if (typeof this.options.functions === 'string' && this.options.functions.length > 0) {
        functionsFilename = this.options.functions;
        if (!path.isAbsolute(functionsFilename)) {
          functionsFilename = path.join(workingDirectory, functionsFilename);
        }
        execParameters.push('--functions "' + path.resolve(functionsFilename) + '"');
      }
      execParameters.push('"' + this.inputFile.path + '"');
      execParameters.push('"' + outputFile.path + '"');
      return execParameters;
    };

    NodeSassCompiler.prototype.emitStart = function() {
      return this.emitter.emit('start', this.getBasicEmitterParameters());
    };

    NodeSassCompiler.prototype.emitFinished = function() {
      this.deleteTemporaryFiles();
      return this.emitter.emit('finished', this.getBasicEmitterParameters());
    };

    NodeSassCompiler.prototype.emitMessage = function(type, message) {
      return this.emitter.emit(type, this.getBasicEmitterParameters({
        message: message
      }));
    };

    NodeSassCompiler.prototype.emitMessageAndFinish = function(type, message, emitStartEvent) {
      if (emitStartEvent == null) {
        emitStartEvent = false;
      }
      if (emitStartEvent) {
        this.emitStart();
      }
      this.emitMessage(type, message);
      return this.emitFinished();
    };

    NodeSassCompiler.prototype.getBasicEmitterParameters = function(additionalParameters) {
      var key, parameters, value;
      if (additionalParameters == null) {
        additionalParameters = {};
      }
      parameters = {
        isCompileToFile: this.isCompileToFile(),
        isCompileDirect: this.isCompileDirect()
      };
      if (this.inputFile) {
        parameters.inputFilename = this.inputFile.path;
      }
      for (key in additionalParameters) {
        value = additionalParameters[key];
        parameters[key] = value;
      }
      return parameters;
    };

    NodeSassCompiler.prototype.deleteTemporaryFiles = function() {
      if (this.inputFile && this.inputFile.isTemporary) {
        File["delete"](this.inputFile.path);
      }
      if (this.outputFile && this.outputFile.isTemporary) {
        return File["delete"](this.outputFile.path);
      }
    };

    NodeSassCompiler.prototype.isCompileDirect = function() {
      return this.mode === NodeSassCompiler.MODE_DIRECT;
    };

    NodeSassCompiler.prototype.isCompileToFile = function() {
      return this.mode === NodeSassCompiler.MODE_FILE;
    };

    NodeSassCompiler.prototype.onStart = function(callback) {
      return this.emitter.on('start', callback);
    };

    NodeSassCompiler.prototype.onSuccess = function(callback) {
      return this.emitter.on('success', callback);
    };

    NodeSassCompiler.prototype.onWarning = function(callback) {
      return this.emitter.on('warning', callback);
    };

    NodeSassCompiler.prototype.onError = function(callback) {
      return this.emitter.on('error', callback);
    };

    NodeSassCompiler.prototype.onFinished = function(callback) {
      return this.emitter.on('finished', callback);
    };

    return NodeSassCompiler;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zYXNzLWF1dG9jb21waWxlL2xpYi9jb21waWxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFVBQVcsT0FBQSxDQUFRLFdBQVI7O0VBQ1osc0JBQUEsR0FBeUIsT0FBQSxDQUFRLFdBQVI7O0VBRXpCLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSxtQ0FBUjs7RUFDeEIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSOztFQUNQLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDBCQUFSOztFQUVqQixFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUF3QixDQUFDOztFQUdoQyxNQUFNLENBQUMsT0FBUCxHQUNNO0lBRUYsZ0JBQUMsQ0FBQSxXQUFELEdBQWU7O0lBQ2YsZ0JBQUMsQ0FBQSxTQUFELEdBQWE7O0lBR0EsMEJBQUMsT0FBRDtNQUNULElBQUMsQ0FBQSxPQUFELEdBQVc7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsT0FBQSxDQUFBO0lBRk47OytCQUtiLE9BQUEsR0FBUyxTQUFBO01BQ0wsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQUE7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBRk47OytCQUtULE9BQUEsR0FBUyxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQXdCLGFBQXhCOztRQUFPLFdBQVc7OztRQUFNLGdCQUFnQjs7TUFDN0MsSUFBQyxDQUFBLGFBQUQsR0FBaUI7TUFDakIsSUFBQyxDQUFBLFVBQUQsR0FBYzthQUNkLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUFnQixRQUFoQjtJQUhLOzsrQkFPVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUF3Qixh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LENBQUM7SUFEcEI7OytCQUlqQixlQUFBLEdBQWlCLFNBQUE7QUFDYixhQUFPLElBQUMsQ0FBQSxJQUFELEtBQVMsZ0JBQWdCLENBQUM7SUFEcEI7OytCQUlqQixPQUFBLEdBQVMsU0FBQyxRQUFEO2FBQ0wsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksT0FBWixFQUFxQixRQUFyQjtJQURLOzsrQkFJVCxTQUFBLEdBQVcsU0FBQyxRQUFEO2FBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksU0FBWixFQUF1QixRQUF2QjtJQURPOzsrQkFJWCxTQUFBLEdBQVcsU0FBQyxRQUFEO2FBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksU0FBWixFQUF1QixRQUF2QjtJQURPOzsrQkFJWCxPQUFBLEdBQVMsU0FBQyxRQUFEO2FBQ0wsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksT0FBWixFQUFxQixRQUFyQjtJQURLOzsrQkFJVCxVQUFBLEdBQVksU0FBQyxRQUFEO2FBQ1IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksVUFBWixFQUF3QixRQUF4QjtJQURROzs7OztBQTl4QmhCIiwic291cmNlc0NvbnRlbnQiOlsie0VtaXR0ZXJ9ID0gcmVxdWlyZSgnZXZlbnQta2l0JylcblNhc3NBdXRvY29tcGlsZU9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbnMnKVxuXG5JbmxpbmVQYXJhbWV0ZXJQYXJzZXIgPSByZXF1aXJlKCcuL2hlbHBlci9pbmxpbmUtcGFyYW1ldGVycy1wYXJzZXInKVxuRmlsZSA9IHJlcXVpcmUoJy4vaGVscGVyL2ZpbGUnKVxuQXJndW1lbnRQYXJzZXIgPSByZXF1aXJlKCcuL2hlbHBlci9hcmd1bWVudC1wYXJzZXInKVxuXG5mcyA9IHJlcXVpcmUoJ2ZzJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcbmV4ZWMgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xuXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE5vZGVTYXNzQ29tcGlsZXJcblxuICAgIEBNT0RFX0RJUkVDVCA9ICdkaXJlY3QnXG4gICAgQE1PREVfRklMRSA9ICd0by1maWxlJ1xuXG5cbiAgICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG4gICAgICAgIEBvcHRpb25zID0gb3B0aW9uc1xuICAgICAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcblxuXG4gICAgZGVzdHJveTogKCkgLT5cbiAgICAgICAgQGVtaXR0ZXIuZGlzcG9zZSgpXG4gICAgICAgIEBlbWl0dGVyID0gbnVsbFxuXG5cbiAgICBjb21waWxlOiAobW9kZSwgZmlsZW5hbWUgPSBudWxsLCBjb21waWxlT25TYXZlID0gZmFsc2UpIC0+XG4gICAgICAgIEBjb21waWxlT25TYXZlID0gY29tcGlsZU9uU2F2ZVxuICAgICAgICBAY2hpbGRGaWxlcyA9IHt9XG4gICAgICAgIEBfY29tcGlsZShtb2RlLCBmaWxlbmFtZSlcblxuXG4gICAgIyBJZiBmaWxlbmFtZSBpcyBudWxsIHRoZW4gYWN0aXZlIHRleHQgZWRpdG9yIGlzIHVzZWQgZm9yIGNvbXBpbGF0aW9uXG4gICAgX2NvbXBpbGU6IChtb2RlLCBmaWxlbmFtZSA9IG51bGwsIGNvbXBpbGVPblNhdmUgPSBmYWxzZSkgLT5cbiAgICAgICAgQG1vZGUgPSBtb2RlXG4gICAgICAgIEB0YXJnZXRGaWxlbmFtZSA9IGZpbGVuYW1lXG4gICAgICAgIEBpbnB1dEZpbGUgPSB1bmRlZmluZWRcbiAgICAgICAgQG91dHB1dEZpbGUgPSB1bmRlZmluZWRcblxuICAgICAgICAjIFBhcnNlIGlubGluZSBwYXJhbWV0ZXJzIGFuZCBydW4gY29tcGlsYXRpb247IGZvciBiZXR0ZXIgcGVyZm9ybWFuY2Ugd2UgdXNlIGFjdGl2ZVxuICAgICAgICAjIHRleHQtZWRpdG9yIGlmIHBvc3NpYmxlLCBzbyBwYXJhbWV0ZXIgcGFyc2VyIG11c3Qgbm90IGxvYWQgZmlsZSBhZ2FpblxuICAgICAgICBwYXJhbWV0ZXJQYXJzZXIgPSBuZXcgSW5saW5lUGFyYW1ldGVyUGFyc2VyKClcbiAgICAgICAgcGFyYW1ldGVyVGFyZ2V0ID0gQGdldFBhcmFtZXRlclRhcmdldCgpXG4gICAgICAgIHBhcmFtZXRlclBhcnNlci5wYXJzZSBwYXJhbWV0ZXJUYXJnZXQsIChwYXJhbXMsIGVycm9yKSA9PlxuICAgICAgICAgICAgIyBJZiBwYWNrYWdlIGlzIGNhbGxlZCBieSBzYXZlLWV2ZW50IG9mIGVkaXRvciwgYnV0IGNvbXBpbGF0aW9uIGlzIHByb2hpYml0ZWQgYnlcbiAgICAgICAgICAgICMgb3B0aW9ucyBvciBmaXJzdCBsaW5lIHBhcmFtZXRlciwgZXhlY3V0aW9uIGlzIGNhbmNlbGxlZFxuICAgICAgICAgICAgaWYgQGNvbXBpbGVPblNhdmUgYW5kIEBwcm9oaWJpdENvbXBpbGF0aW9uT25TYXZlKHBhcmFtcylcbiAgICAgICAgICAgICAgICBAZW1pdEZpbmlzaGVkKClcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgIyBDaGVjayBpZiB0aGVyZSBpcyBhIGZpcnN0IGxpbmUgcGFyYW10ZXJcbiAgICAgICAgICAgIGlmIHBhcmFtcyBpcyBmYWxzZSBhbmQgQG9wdGlvbnMuY29tcGlsZU9ubHlGaXJzdExpbmVDb21tZW50RmlsZXNcbiAgICAgICAgICAgICAgICBAZW1pdEZpbmlzaGVkKClcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgIyBBIHBvdGVuaWFsIHBhcnNpbmcgZXJyb3IgaXMgb25seSBoYW5kbGVkIGlmIGNvbXBpbGF0aW9uIGlzIGV4ZWN1dGVkIGFuZCB0aGF0J3MgdGhlXG4gICAgICAgICAgICAjIGNhc2UgaWYgY29tcGlsZXIgaXMgZXhlY3V0ZWQgYnkgY29tbWFuZCBvciBhZnRlciBjb21waWxlIG9uIHNhdmUsIHNvIHRoaXMgY29kZSBtdXN0XG4gICAgICAgICAgICAjIGJlIHBsYWNlZCBhYm92ZSB0aGUgY29kZSBiZWZvcmVcbiAgICAgICAgICAgIGlmIGVycm9yXG4gICAgICAgICAgICAgICAgQGVtaXRNZXNzYWdlQW5kRmluaXNoKCdlcnJvcicsIGVycm9yLCB0cnVlKVxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBAc2V0dXBJbnB1dEZpbGUoZmlsZW5hbWUpXG4gICAgICAgICAgICBpZiAoZXJyb3JNZXNzYWdlID0gQHZhbGlkYXRlSW5wdXRGaWxlKCkpIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgQGVtaXRNZXNzYWdlQW5kRmluaXNoKCdlcnJvcicsIGVycm9yTWVzc2FnZSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgIyBJZiB0aGVyZSBpcyBOTyBmaXJzdC1saW5lLWNvbW1lbnQsIHNvIG5vIG1haW4gZmlsZSBpcyByZWZlcmVuY2VkLCB3ZSBzaG91bGQgY2hlY2tcbiAgICAgICAgICAgICMgaXMgdXNlciB3YW50cyB0byBjb21waWxlIFBhcnRpYWxzXG4gICAgICAgICAgICBpZiBwYXJhbXMgaXMgZmFsc2UgYW5kIEBpc1BhcnRpYWwoKSBhbmQgbm90IEBvcHRpb25zLmNvbXBpbGVQYXJ0aWFsc1xuICAgICAgICAgICAgICAgIEBlbWl0RmluaXNoZWQoKVxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAjIEluIGNhc2UgdGhlcmUgaXMgYSBcIm1haW5cIiBpbmxpbmUgcGFyYW10ZXIsIHBhcmFtcyBpcyBhIHN0cmluZyBhbmQgY29udGFpbnMgdGhlXG4gICAgICAgICAgICAjIHRhcmdldCBmaWxlbmFtZS5cbiAgICAgICAgICAgICMgSXQncyBpbXBvcnRhbnQgdG8gY2hlY2sgdGhhdCBpbnB1dEZpbGUucGF0aCBpcyBub3QgcGFyYW1zIGJlY2F1c2Ugb2YgaW5maW5pdGUgbG9vcFxuICAgICAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5tYWluIGlzICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgaWYgcGFyYW1zLm1haW4gaXMgQGlucHV0RmlsZS5wYXRoIG9yIEBjaGlsZEZpbGVzW3BhcmFtcy5tYWluXSBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICBAZW1pdE1lc3NhZ2VBbmRGaW5pc2goJ2Vycm9yJywgJ0ZvbGxvd2luZyB0aGUgbWFpbiBwYXJhbWV0ZXIgZW5kcyBpbiBhIGxvb3AuJylcbiAgICAgICAgICAgICAgICBlbHNlIGlmIEBpbnB1dEZpbGUuaXNUZW1wb3JhcnlcbiAgICAgICAgICAgICAgICAgICAgQGVtaXRNZXNzYWdlQW5kRmluaXNoKCdlcnJvcicsICdcXCdtYWluXFwnIGlubGluZSBwYXJhbWV0ZXIgaXMgbm90IHN1cHBvcnRlZCBpbiBkaXJlY3QgY29tcGlsYXRpb24uJylcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBjaGlsZEZpbGVzW3BhcmFtcy5tYWluXSA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgQF9jb21waWxlKEBtb2RlLCBwYXJhbXMubWFpbilcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAZW1pdFN0YXJ0KClcblxuICAgICAgICAgICAgICAgIGlmIEBpc0NvbXBpbGVUb0ZpbGUoKSBhbmQgbm90IEBlbnN1cmVGaWxlSXNTYXZlZCgpXG4gICAgICAgICAgICAgICAgICAgIEBlbWl0TWVzc2FnZUFuZEZpbmlzaCgnd2FybmluZycsICdDb21waWxhdGlvbiBjYW5jZWxsZWQnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgICAgIEB1cGRhdGVPcHRpb25zV2l0aElubGluZVBhcmFtZXRlcnMocGFyYW1zKVxuICAgICAgICAgICAgICAgIEBvdXRwdXRTdHlsZXMgPSBAZ2V0T3V0cHV0U3R5bGVzVG9Db21waWxlVG8oKVxuXG4gICAgICAgICAgICAgICAgaWYgQG91dHB1dFN0eWxlcy5sZW5ndGggaXMgMFxuICAgICAgICAgICAgICAgICAgICBAZW1pdE1lc3NhZ2VBbmRGaW5pc2goJ3dhcm5pbmcnLCAnTm8gb3V0cHV0IHN0eWxlIGRlZmluZWQhIFBsZWFzZSBlbmFibGUgYXQgbGVhc3Qgb25lIHN0eWxlIGluIG9wdGlvbnMgb3IgdXNlIGlubGluZSBwYXJhbWV0ZXJzLicpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAgICAgQGRvQ29tcGlsZSgpXG5cblxuICAgIGdldFBhcmFtZXRlclRhcmdldDogKCkgLT5cbiAgICAgICAgaWYgdHlwZW9mIEB0YXJnZXRGaWxlbmFtZSBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgcmV0dXJuIEB0YXJnZXRGaWxlbmFtZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cblxuICAgIHByb2hpYml0Q29tcGlsYXRpb25PblNhdmU6IChwYXJhbXMpIC0+XG4gICAgICAgIGlmIHBhcmFtcyBhbmQgcGFyYW1zLmNvbXBpbGVPblNhdmUgaW4gW3RydWUsIGZhbHNlXVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZU9uU2F2ZSA9IHBhcmFtcy5jb21waWxlT25TYXZlXG4gICAgICAgIHJldHVybiBub3QgQG9wdGlvbnMuY29tcGlsZU9uU2F2ZVxuXG5cbiAgICBpc1BhcnRpYWw6ICgpIC0+XG4gICAgICAgIGZpbGVuYW1lID0gcGF0aC5iYXNlbmFtZShAaW5wdXRGaWxlLnBhdGgpXG4gICAgICAgIHJldHVybiAoZmlsZW5hbWVbMF0gPT0gJ18nKVxuXG5cbiAgICBzZXR1cElucHV0RmlsZTogKGZpbGVuYW1lID0gbnVsbCkgLT5cbiAgICAgICAgQGlucHV0RmlsZSA9XG4gICAgICAgICAgICBpc1RlbXBvcmFyeTogZmFsc2VcblxuICAgICAgICBpZiBmaWxlbmFtZVxuICAgICAgICAgICAgQGlucHV0RmlsZS5wYXRoID0gZmlsZW5hbWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgICByZXR1cm4gdW5sZXNzIGFjdGl2ZUVkaXRvclxuXG4gICAgICAgICAgICBpZiBAaXNDb21waWxlRGlyZWN0KClcbiAgICAgICAgICAgICAgICBzeW50YXggPSBAYXNrRm9ySW5wdXRTeW50YXgoKVxuICAgICAgICAgICAgICAgIGlmIHN5bnRheFxuICAgICAgICAgICAgICAgICAgICBAaW5wdXRGaWxlLnBhdGggPSBGaWxlLmdldFRlbXBvcmFyeUZpbGVuYW1lKCdzYXNzLWF1dG9jb21waWxlLmlucHV0LicsIG51bGwsIHN5bnRheClcbiAgICAgICAgICAgICAgICAgICAgQGlucHV0RmlsZS5pc1RlbXBvcmFyeSA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhAaW5wdXRGaWxlLnBhdGgsIGFjdGl2ZUVkaXRvci5nZXRUZXh0KCkpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAaW5wdXRGaWxlLnBhdGggPSB1bmRlZmluZWRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAaW5wdXRGaWxlLnBhdGggPSBhY3RpdmVFZGl0b3IuZ2V0VVJJKClcbiAgICAgICAgICAgICAgICBpZiBub3QgQGlucHV0RmlsZS5wYXRoXG4gICAgICAgICAgICAgICAgICAgIEBpbnB1dEZpbGUucGF0aCA9IEBhc2tGb3JTYXZpbmdVbnNhdmVkRmlsZUluQWN0aXZlRWRpdG9yKClcblxuXG4gICAgYXNrRm9ySW5wdXRTeW50YXg6ICgpIC0+XG4gICAgICAgIGRpYWxvZ1Jlc3VsdEJ1dHRvbiA9IGF0b20uY29uZmlybVxuICAgICAgICAgICAgbWVzc2FnZTogXCJJcyB0aGUgc3ludGF4IGlmIHlvdXIgaW5vdXQgU0FTUyBvciBTQ1NTP1wiXG4gICAgICAgICAgICBidXR0b25zOiBbJ1NBU1MnLCAnU0NTUycsICdDYW5jZWwnXVxuICAgICAgICBzd2l0Y2ggZGlhbG9nUmVzdWx0QnV0dG9uXG4gICAgICAgICAgICB3aGVuIDAgdGhlbiBzeW50YXggPSAnc2FzcydcbiAgICAgICAgICAgIHdoZW4gMSB0aGVuIHN5bnRheCA9ICdzY3NzJ1xuICAgICAgICAgICAgZWxzZSBzeW50YXggPSB1bmRlZmluZWRcbiAgICAgICAgcmV0dXJuIHN5bnRheFxuXG5cbiAgICBhc2tGb3JTYXZpbmdVbnNhdmVkRmlsZUluQWN0aXZlRWRpdG9yOiAoKSAtPlxuICAgICAgICBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgZGlhbG9nUmVzdWx0QnV0dG9uID0gYXRvbS5jb25maXJtXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkluIG9yZGVyIHRvIGNvbXBpbGUgdGhpcyBTQVNTIGZpbGUgdG8gYSBDU1MgZmlsZSwgeW91IGhhdmUgZG8gc2F2ZSBpdCBiZWZvcmUuIERvIHlvdSB3YW50IHRvIHNhdmUgdGhpcyBmaWxlP1wiXG4gICAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiQWx0ZXJuYXRpdmx5IHlvdSBjYW4gdXNlICdEaXJlY3QgQ29tcGlsYXRpb24nIGZvciBjb21waWxpbmcgd2l0aG91dCBjcmVhdGluZyBhIENTUyBmaWxlLlwiXG4gICAgICAgICAgICBidXR0b25zOiBbXCJTYXZlXCIsIFwiQ2FuY2VsXCJdXG4gICAgICAgIGlmIGRpYWxvZ1Jlc3VsdEJ1dHRvbiBpcyAwXG4gICAgICAgICAgICBmaWxlbmFtZSA9IGF0b20uc2hvd1NhdmVEaWFsb2dTeW5jKClcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIGFjdGl2ZUVkaXRvci5zYXZlQXMoZmlsZW5hbWUpXG4gICAgICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgICAgICAgICMgZG8gbm90aGluZyBpZiBzb21ldGhpbmcgZmFpbHMgYmVjYXVzZSBnZXRVUkkoKSB3aWxsIHJldHVybiB1bmRlZmluZWQsIGlmXG4gICAgICAgICAgICAgICAgIyBmaWxlIGlzIG5vdCBzYXZlZFxuXG4gICAgICAgICAgICBmaWxlbmFtZSA9IGFjdGl2ZUVkaXRvci5nZXRVUkkoKVxuICAgICAgICAgICAgcmV0dXJuIGZpbGVuYW1lXG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG5cbiAgICB2YWxpZGF0ZUlucHV0RmlsZTogKCkgLT5cbiAgICAgICAgZXJyb3JNZXNzYWdlID0gdW5kZWZpbmVkXG5cbiAgICAgICAgIyBJZiBubyBpbnB1dEZpbGUucGF0aCBpcyBnaXZlbiwgdGhlbiB3ZSBjYW5ub3QgY29tcGlsZSB0aGUgZmlsZSBvciBjb250ZW50LFxuICAgICAgICAjIGJlY2F1c2Ugc29tZXRoaW5nIGlzIHdyb25nXG4gICAgICAgIGlmIG5vdCBAaW5wdXRGaWxlLnBhdGhcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9ICdJbnZhbGlkIGZpbGU6ICcgKyBAaW5wdXRGaWxlLnBhdGhcblxuICAgICAgICBpZiBub3QgZnMuZXhpc3RzU3luYyhAaW5wdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSAnRmlsZSBkb2VzIG5vdCBleGlzdDogJyArIEBpbnB1dEZpbGUucGF0aFxuXG4gICAgICAgIHJldHVybiBlcnJvck1lc3NhZ2VcblxuXG4gICAgZW5zdXJlRmlsZUlzU2F2ZWQ6ICgpIC0+XG4gICAgICAgIGVkaXRvcnMgPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG4gICAgICAgIGZvciBlZGl0b3IgaW4gZWRpdG9yc1xuICAgICAgICAgICAgaWYgZWRpdG9yIGFuZCBlZGl0b3IuZ2V0VVJJIGFuZCBlZGl0b3IuZ2V0VVJJKCkgaXMgQGlucHV0RmlsZS5wYXRoIGFuZCBlZGl0b3IuaXNNb2RpZmllZCgpXG4gICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBwYXRoLmJhc2VuYW1lKEBpbnB1dEZpbGUucGF0aClcbiAgICAgICAgICAgICAgICBkaWFsb2dSZXN1bHRCdXR0b24gPSBhdG9tLmNvbmZpcm1cbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCInI3tmaWxlbmFtZX0nIGhhcyBjaGFuZ2VzLCBkbyB5b3Ugd2FudCB0byBzYXZlIHRoZW0/XCJcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIkluIG9yZGVyIHRvIGNvbXBpbGUgU0FTUyB5b3UgaGF2ZSB0byBzYXZlIGNoYW5nZXMuXCJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogW1wiU2F2ZSBhbmQgY29tcGlsZVwiLCBcIkNhbmNlbFwiXVxuICAgICAgICAgICAgICAgIGlmIGRpYWxvZ1Jlc3VsdEJ1dHRvbiBpcyAwXG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgIHJldHVybiB0cnVlXG5cblxuICAgICMgQXZhaWxhYmxlIHBhcmFtZXRlcnNcbiAgICAjICAgb3V0XG4gICAgIyAgIG91dHB1dFN0eWxlXG4gICAgI1xuICAgICMgICBjb21waWxlQ29tcHJlc3NlZFxuICAgICMgICBjb21wcmVzc2VkRmlsZW5hbWVQYXR0ZXJuXG4gICAgIyAgIGNvbXBpbGVDb21wYWN0XG4gICAgIyAgIGNvbXBhY3RGaWxlbmFtZVBhdHRlcm5cbiAgICAjICAgY29tcGlsZU5lc3RlZFxuICAgICMgICBuZXN0ZWRGaWxlbmFtZVBhdHRlcm5cbiAgICAjICAgY29tcGlsZUV4cGFuZGVkXG4gICAgIyAgIGV4cGFuZGVkRmlsZW5hbWVQYXR0ZXJuXG4gICAgI1xuICAgICMgICBpbmRlbnRUeXBlXG4gICAgIyAgIGluZGVudFdpZHRoXG4gICAgIyAgIGxpbmVmZWVkXG4gICAgIyAgIHNvdXJjZU1hcFxuICAgICMgICBzb3VyY2VNYXBFbWJlZFxuICAgICMgICBzb3VyY2VNYXBDb250ZW50c1xuICAgICMgICBzb3VyY2VDb21tZW50c1xuICAgICMgICBpbmNsdWRlUGF0aFxuICAgICMgICBwcmVjaXNpb25cbiAgICAjICAgaW1wb3J0ZXJcbiAgICAjICAgZnVuY3Rpb25zXG4gICAgdXBkYXRlT3B0aW9uc1dpdGhJbmxpbmVQYXJhbWV0ZXJzOiAocGFyYW1zKSAtPlxuICAgICAgICAjIEJBQ0tXQVJEIENPTVBBVElCSUxJVFk6IHBhcmFtcy5vdXQgYW5kIHBhcmFtLm91dHB1dFN0eWxlXG4gICAgICAgICMgU2hvdWxkIHdlIGxldCB0aGlzIGNvZGUgaGVyZSwgc28gd2UgY2FuIGRlY2lkZSB0byBvdXRwdXQgb25seSBvbmUgc2luZ2xlIGZpbGUgd2l0aCBvbmUgb3V0cHV0IHN0eWxlIHBlciBTQVNTIGZpbGU/XG4gICAgICAgIGlmIHR5cGVvZiBwYXJhbXMub3V0IGlzICdzdHJpbmcnIG9yIHR5cGVvZiBwYXJhbXMub3V0cHV0U3R5bGUgaXMgJ3N0cmluZycgb3IgdHlwZW9mIHBhcmFtcy5jb21wcmVzcyBpcyAnYm9vbGVhbidcblxuICAgICAgICAgICAgaWYgQG9wdGlvbnMuc2hvd09sZFBhcmFtZXRlcnNXYXJuaW5nXG4gICAgICAgICAgICAgICAgQGVtaXRNZXNzYWdlKCd3YXJuaW5nJywgJ1BsZWFzZSBkb25cXCd0IHVzZSBcXCdvdXRcXCcsIFxcJ291dHB1dFN0eWxlXFwnIG9yIFxcJ2NvbXByZXNzXFwnIHBhcmFtZXRlciBhbnkgbW9yZS4gSGF2ZSBhIGxvb2sgYXQgdGhlIGRvY3VtZW50YXRpb24gZm9yIG5ld2VyIHBhcmFtZXRlcnMnKVxuXG4gICAgICAgICAgICAjIFNldCBkZWZhdWx0IG91dHB1dCBzdHlsZVxuICAgICAgICAgICAgb3V0cHV0U3R5bGUgPSAnY29tcHJlc3NlZCdcblxuICAgICAgICAgICAgIyBJZiBcImNvbXByZXNzXCIgaXMgc2V0LCBhcHBseSB0aGlzIHZhbHVlXG4gICAgICAgICAgICBpZiBwYXJhbXMuY29tcHJlc3MgaXMgZmFsc2VcbiAgICAgICAgICAgICAgICBvdXRwdXRTdHlsZSA9ICduZXN0ZWQnXG4gICAgICAgICAgICBpZiBwYXJhbXMuY29tcHJlc3MgaXMgdHJ1ZVxuICAgICAgICAgICAgICAgIG91dHB1dFN0eWxlID0gJ2NvbXByZXNzZWQnXG5cbiAgICAgICAgICAgIGlmIHBhcmFtcy5vdXRwdXRTdHlsZVxuICAgICAgICAgICAgICAgIG91dHB1dFN0eWxlID0gaWYgdHlwZW9mIHBhcmFtcy5vdXRwdXRTdHlsZSBpcyAnc3RyaW5nJyB0aGVuIHBhcmFtcy5vdXRwdXRTdHlsZS50b0xvd2VyQ2FzZSgpIGVsc2UgJ2NvbXByZXNzZWQnXG5cbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVDb21wcmVzc2VkID0gKG91dHB1dFN0eWxlIGlzICdjb21wcmVzc2VkJylcbiAgICAgICAgICAgIGlmIG91dHB1dFN0eWxlIGlzICdjb21wcmVzc2VkJyBhbmQgdHlwZW9mIHBhcmFtcy5vdXQgaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5vdXQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgIEBvcHRpb25zLmNvbXByZXNzZWRGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMub3V0XG5cbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVDb21wYWN0ID0gKG91dHB1dFN0eWxlIGlzICdjb21wYWN0JylcbiAgICAgICAgICAgIGlmIG91dHB1dFN0eWxlIGlzICdjb21wYWN0JyBhbmQgdHlwZW9mIHBhcmFtcy5vdXQgaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5vdXQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgIEBvcHRpb25zLmNvbXBhY3RGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMub3V0XG5cbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVOZXN0ZWQgPSAob3V0cHV0U3R5bGUgaXMgJ25lc3RlZCcpXG4gICAgICAgICAgICBpZiBvdXRwdXRTdHlsZSBpcyAnbmVzdGVkJyBhbmQgdHlwZW9mIHBhcmFtcy5vdXQgaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5vdXQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgIEBvcHRpb25zLm5lc3RlZEZpbGVuYW1lUGF0dGVybiA9IHBhcmFtcy5vdXRcblxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZUV4cGFuZGVkID0gKG91dHB1dFN0eWxlIGlzICdleHBhbmRlZCcpXG4gICAgICAgICAgICBpZiBvdXRwdXRTdHlsZSBpcyAnZXhwYW5kZWQnIGFuZCB0eXBlb2YgcGFyYW1zLm91dCBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLm91dC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgQG9wdGlvbnMuZXhwYW5kZWRGaWxlbmFtZVBhdHRlcm4gPSBwYXJhbXMub3V0XG5cblxuICAgICAgICAjIElmIHVzZXIgc3BlY2lmaWVzIGEgc2luZ2xlIG9yIG11bHRpcGxlIG91dHB1dCBzdHlsZXMsIHdlIHJlc2V0IHRoZSBkZWZhdWx0IHNldHRpbmdzXG4gICAgICAgICMgc28gb25seSB0aGUgZ2l2ZW4gb3V0cHV0IHN0eWxlcyBhcmUgY29tcGlsZWQgdG9cbiAgICAgICAgaWYgcGFyYW1zLmNvbXBpbGVDb21wcmVzc2VkIG9yIHBhcmFtcy5jb21waWxlQ29tcGFjdCBvciBwYXJhbXMuY29tcGlsZU5lc3RlZCBvciBwYXJhbXMuY29tcGlsZUV4cGFuZGVkXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlQ29tcHJlc3NlZCA9IGZhbHNlXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlQ29tcGFjdCA9IGZhbHNlXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlTmVzdGVkID0gZmFsc2VcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVFeHBhbmRlZCA9IGZhbHNlXG5cbiAgICAgICAgIyBjb21waWxlQ29tcHJlc3NlZFxuICAgICAgICBpZiBwYXJhbXMuY29tcGlsZUNvbXByZXNzZWQgaXMgdHJ1ZSBvciBwYXJhbXMuY29tcGlsZUNvbXByZXNzZWQgaXMgZmFsc2VcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVDb21wcmVzc2VkID0gcGFyYW1zLmNvbXBpbGVDb21wcmVzc2VkXG4gICAgICAgIGVsc2UgaWYgdHlwZW9mIHBhcmFtcy5jb21waWxlQ29tcHJlc3NlZCBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZUNvbXByZXNzZWQgPSB0cnVlXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21wcmVzc2VkRmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLmNvbXBpbGVDb21wcmVzc2VkXG5cbiAgICAgICAgIyBjb21wcmVzc2VkRmlsZW5hbWVQYXR0ZXJuXG4gICAgICAgIGlmIHR5cGVvZiBwYXJhbXMuY29tcHJlc3NlZEZpbGVuYW1lUGF0dGVybiBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLmNvbXByZXNzZWRGaWxlbmFtZVBhdHRlcm4ubGVuZ3RoID4gMVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcHJlc3NlZEZpbGVuYW1lUGF0dGVybiA9IHBhcmFtcy5jb21wcmVzc2VkRmlsZW5hbWVQYXR0ZXJuXG5cbiAgICAgICAgIyBjb21waWxlQ29tcGFjdFxuICAgICAgICBpZiBwYXJhbXMuY29tcGlsZUNvbXBhY3QgaXMgdHJ1ZSBvciBwYXJhbXMuY29tcGlsZUNvbXBhY3QgaXMgZmFsc2VcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVDb21wYWN0ID0gcGFyYW1zLmNvbXBpbGVDb21wYWN0XG4gICAgICAgIGVsc2UgaWYgdHlwZW9mIHBhcmFtcy5jb21waWxlQ29tcGFjdCBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZUNvbXBhY3QgPSB0cnVlXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21wYWN0RmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLmNvbXBpbGVDb21wYWN0XG5cbiAgICAgICAgIyBjb21wYWN0RmlsZW5hbWVQYXR0ZXJuXG4gICAgICAgIGlmIHR5cGVvZiBwYXJhbXMuY29tcGFjdEZpbGVuYW1lUGF0dGVybiBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLmNvbXBhY3RGaWxlbmFtZVBhdHRlcm4ubGVuZ3RoID4gMVxuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGFjdEZpbGVuYW1lUGF0dGVybiA9IHBhcmFtcy5jb21wYWN0RmlsZW5hbWVQYXR0ZXJuXG5cbiAgICAgICAgIyBjb21waWxlTmVzdGVkXG4gICAgICAgIGlmIHBhcmFtcy5jb21waWxlTmVzdGVkIGlzIHRydWUgb3IgcGFyYW1zLmNvbXBpbGVOZXN0ZWQgaXMgZmFsc2VcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVOZXN0ZWQgPSBwYXJhbXMuY29tcGlsZU5lc3RlZFxuICAgICAgICBlbHNlIGlmIHR5cGVvZiBwYXJhbXMuY29tcGlsZU5lc3RlZCBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgQG9wdGlvbnMuY29tcGlsZU5lc3RlZCA9IHRydWVcbiAgICAgICAgICAgIEBvcHRpb25zLm5lc3RlZEZpbGVuYW1lUGF0dGVybiA9IHBhcmFtcy5jb21waWxlTmVzdGVkXG5cbiAgICAgICAgIyBuZXN0ZWRGaWxlbmFtZVBhdHRlcm5cbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5uZXN0ZWRGaWxlbmFtZVBhdHRlcm4gaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5uZXN0ZWRGaWxlbmFtZVBhdHRlcm4ubGVuZ3RoID4gMVxuICAgICAgICAgICAgQG9wdGlvbnMubmVzdGVkRmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLm5lc3RlZEZpbGVuYW1lUGF0dGVyblxuXG4gICAgICAgICMgY29tcGlsZUV4cGFuZGVkXG4gICAgICAgIGlmIHBhcmFtcy5jb21waWxlRXhwYW5kZWQgaXMgdHJ1ZSBvciBwYXJhbXMuY29tcGlsZUV4cGFuZGVkIGlzIGZhbHNlXG4gICAgICAgICAgICBAb3B0aW9ucy5jb21waWxlRXhwYW5kZWQgPSBwYXJhbXMuY29tcGlsZUV4cGFuZGVkXG4gICAgICAgIGVsc2UgaWYgdHlwZW9mIHBhcmFtcy5jb21waWxlRXhwYW5kZWQgaXMgJ3N0cmluZydcbiAgICAgICAgICAgIEBvcHRpb25zLmNvbXBpbGVFeHBhbmRlZCA9IHRydWVcbiAgICAgICAgICAgIEBvcHRpb25zLmV4cGFuZGVkRmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLmNvbXBpbGVFeHBhbmRlZFxuXG4gICAgICAgICMgZXhwYW5kZWRGaWxlbmFtZVBhdHRlcm5cbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5leHBhbmRlZEZpbGVuYW1lUGF0dGVybiBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLmV4cGFuZGVkRmlsZW5hbWVQYXR0ZXJuLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIEBvcHRpb25zLmV4cGFuZGVkRmlsZW5hbWVQYXR0ZXJuID0gcGFyYW1zLmV4cGFuZGVkRmlsZW5hbWVQYXR0ZXJuXG5cbiAgICAgICAgIyBpbmRlbnRUeXBlXG4gICAgICAgIGlmIHR5cGVvZiBwYXJhbXMuaW5kZW50VHlwZSBpcyAnc3RyaW5nJyAgYW5kIHBhcmFtcy5pbmRlbnRUeXBlLnRvTG93ZXJDYXNlKCkgaW4gWydzcGFjZScsICd0YWInXVxuICAgICAgICAgICAgQG9wdGlvbnMuaW5kZW50VHlwZSA9IHBhcmFtcy5pbmRlbnRUeXBlLnRvTG93ZXJDYXNlKClcblxuICAgICAgICAjIGluZGVudFdpZHRoXG4gICAgICAgIGlmIHR5cGVvZiBwYXJhbXMuaW5kZW50V2lkdGggaXMgJ251bWJlcicgYW5kIHBhcmFtcy5pbmRlbnRXaWR0aCA8PSAxMCBhbmQgaW5kZW50V2lkdGggPj0gMFxuICAgICAgICAgICAgQG9wdGlvbnMuaW5kZW50V2lkdGggPSBwYXJhbXMuaW5kZW50V2lkdGhcblxuICAgICAgICAjIGxpbmVmZWVkXG4gICAgICAgIGlmIHR5cGVvZiBwYXJhbXMubGluZWZlZWQgaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5saW5lZmVlZC50b0xvd2VyQ2FzZSgpIGluIFsnY3InLCAnY3JsZicsICdsZicsICdsZmNyJ11cbiAgICAgICAgICAgIEBvcHRpb25zLmxpbmVmZWVkID0gcGFyYW1zLmxpbmVmZWVkLnRvTG93ZXJDYXNlKClcblxuICAgICAgICAjIHNvdXJjZU1hcFxuICAgICAgICBpZiBwYXJhbXMuc291cmNlTWFwIGlzIHRydWUgb3IgcGFyYW1zLnNvdXJjZU1hcCBpcyBmYWxzZSBvciAodHlwZW9mIHBhcmFtcy5zb3VyY2VNYXAgaXMgJ3N0cmluZycgYW5kIHBhcmFtcy5zb3VyY2VNYXAubGVuZ3RoID4gMSlcbiAgICAgICAgICAgIEBvcHRpb25zLnNvdXJjZU1hcCA9IHBhcmFtcy5zb3VyY2VNYXBcblxuICAgICAgICAjIHNvdXJjZU1hcEVtYmVkXG4gICAgICAgIGlmIHBhcmFtcy5zb3VyY2VNYXBFbWJlZCBpcyB0cnVlIG9yIHBhcmFtcy5zb3VyY2VNYXBFbWJlZCBpcyBmYWxzZVxuICAgICAgICAgICAgQG9wdGlvbnMuc291cmNlTWFwRW1iZWQgPSBwYXJhbXMuc291cmNlTWFwRW1iZWRcblxuICAgICAgICAjIHNvdXJjZU1hcENvbnRlbnRzXG4gICAgICAgIGlmIHBhcmFtcy5zb3VyY2VNYXBDb250ZW50cyBpcyB0cnVlIG9yIHBhcmFtcy5zb3VyY2VNYXBDb250ZW50cyBpcyBmYWxzZVxuICAgICAgICAgICAgQG9wdGlvbnMuc291cmNlTWFwQ29udGVudHMgPSBwYXJhbXMuc291cmNlTWFwQ29udGVudHNcblxuICAgICAgICAjIHNvdXJjZUNvbW1lbnRzXG4gICAgICAgIGlmIHBhcmFtcy5zb3VyY2VDb21tZW50cyBpcyB0cnVlIG9yIHBhcmFtcy5zb3VyY2VDb21tZW50cyBpcyBmYWxzZVxuICAgICAgICAgICAgQG9wdGlvbnMuc291cmNlQ29tbWVudHMgPSBwYXJhbXMuc291cmNlQ29tbWVudHNcblxuICAgICAgICAjIGluY2x1ZGVQYXRoXG4gICAgICAgIGlmICh0eXBlb2YgcGFyYW1zLmluY2x1ZGVQYXRoIGlzICdzdHJpbmcnIGFuZCBwYXJhbXMuaW5jbHVkZVBhdGgubGVuZ3RoID4gMSkgb3IgQXJyYXkuaXNBcnJheShwYXJhbXMuaW5jbHVkZVBhdGgpXG4gICAgICAgICAgICBAb3B0aW9ucy5pbmNsdWRlUGF0aCA9IHBhcmFtcy5pbmNsdWRlUGF0aFxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcGFyYW1zLmluY2x1ZGVQYXRocyBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLmluY2x1ZGVQYXRocy5sZW5ndGggPiAxKSBvciBBcnJheS5pc0FycmF5KHBhcmFtcy5pbmNsdWRlUGF0aHMpXG4gICAgICAgICAgICBAb3B0aW9ucy5pbmNsdWRlUGF0aCA9IHBhcmFtcy5pbmNsdWRlUGF0aHNcblxuICAgICAgICAjIHByZWNpc2lvblxuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLnByZWNpc2lvbiBpcyAnbnVtYmVyJyBhbmQgcGFyYW1zLnByZWNpc2lvbiA+PSAwXG4gICAgICAgICAgICBAb3B0aW9ucy5wcmVjaXNpb24gPSBwYXJhbXMucHJlY2lzaW9uXG5cbiAgICAgICAgIyBpbXBvcnRlclxuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLmltcG9ydGVyIGlzICdzdHJpbmcnIGFuZCBwYXJhbXMuaW1wb3J0ZXIubGVuZ3RoID4gMVxuICAgICAgICAgICAgQG9wdGlvbnMuaW1wb3J0ZXIgPSBwYXJhbXMuaW1wb3J0ZXJcblxuICAgICAgICAjIGZ1bmN0aW9uc1xuICAgICAgICBpZiB0eXBlb2YgcGFyYW1zLmZ1bmN0aW9ucyBpcyAnc3RyaW5nJyBhbmQgcGFyYW1zLmZ1bmN0aW9ucy5sZW5ndGggPiAxXG4gICAgICAgICAgICBAb3B0aW9ucy5mdW5jdGlvbnMgPSBwYXJhbXMuZnVuY3Rpb25zXG5cblxuICAgIGdldE91dHB1dFN0eWxlc1RvQ29tcGlsZVRvOiAoKSAtPlxuICAgICAgICBvdXRwdXRTdHlsZXMgPSBbXVxuICAgICAgICBpZiBAb3B0aW9ucy5jb21waWxlQ29tcHJlc3NlZFxuICAgICAgICAgICAgb3V0cHV0U3R5bGVzLnB1c2goJ2NvbXByZXNzZWQnKVxuICAgICAgICBpZiBAb3B0aW9ucy5jb21waWxlQ29tcGFjdFxuICAgICAgICAgICAgb3V0cHV0U3R5bGVzLnB1c2goJ2NvbXBhY3QnKVxuICAgICAgICBpZiBAb3B0aW9ucy5jb21waWxlTmVzdGVkXG4gICAgICAgICAgICBvdXRwdXRTdHlsZXMucHVzaCgnbmVzdGVkJylcbiAgICAgICAgaWYgQG9wdGlvbnMuY29tcGlsZUV4cGFuZGVkXG4gICAgICAgICAgICBvdXRwdXRTdHlsZXMucHVzaCgnZXhwYW5kZWQnKVxuXG4gICAgICAgICMgV2hlbiBpdCdzIGRpcmVjdCBjb21waWxhdGlvbiB1c2UgaGFzIHRvIHNlbGVjdCBhIHNpbmdsZSBvdXRwdXQgc3R5bGUgaWYgdGhlcmUgaXMgbW9yZVxuICAgICAgICAjIHRoYW4gb25lIG91dHB1dCBzdHlsZSBhdmFpbGFibGVcbiAgICAgICAgaWYgQGlzQ29tcGlsZURpcmVjdCgpIGFuZCBvdXRwdXRTdHlsZXMubGVuZ3RoID4gMVxuICAgICAgICAgICAgb3V0cHV0U3R5bGVzLnB1c2goJ0NhbmNlbCcpXG4gICAgICAgICAgICBkaWFsb2dSZXN1bHRCdXR0b24gPSBhdG9tLmNvbmZpcm1cbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkZvciBkaXJlY3Rpb24gY29tcGlsYXRpb24geW91IGhhdmUgdG8gc2VsZWN0IGEgc2luZ2xlIG91dHB1dCBzdHlsZS4gV2hpY2ggb25lIGRvIHlvdSB3YW50IHRvIHVzZT9cIlxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IG91dHB1dFN0eWxlc1xuICAgICAgICAgICAgaWYgZGlhbG9nUmVzdWx0QnV0dG9uIDwgb3V0cHV0U3R5bGVzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgICAjIFJldHVybiBvbmx5IHRoZSBzZWxlY3RlZCBvdXRwdXQgc3R5bGUgYXMgYXJyYXlcbiAgICAgICAgICAgICAgICBvdXRwdXRTdHlsZXMgPSBbIG91dHB1dFN0eWxlc1tkaWFsb2dSZXN1bHRCdXR0b25dIF1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAjIFJldHVybmluZyBhbiBlbXB0eSBhcnJheSBtZWFucyBubyBjb21waWxhdGlvbiBpcyBzdGFydGVkXG4gICAgICAgICAgICAgICAgb3V0cHV0U3R5bGVzID0gW11cblxuICAgICAgICByZXR1cm4gb3V0cHV0U3R5bGVzXG5cblxuICAgIGdldE91dHB1dEZpbGU6IChvdXRwdXRTdHlsZSkgLT5cbiAgICAgICAgb3V0cHV0RmlsZSA9XG4gICAgICAgICAgICBzdHlsZTogb3V0cHV0U3R5bGVcbiAgICAgICAgICAgIGlzVGVtcG9yYXJ5OiBmYWxzZVxuXG4gICAgICAgIGlmIEBpc0NvbXBpbGVEaXJlY3QoKVxuICAgICAgICAgICAgb3V0cHV0RmlsZS5wYXRoID0gRmlsZS5nZXRUZW1wb3JhcnlGaWxlbmFtZSgnc2Fzcy1hdXRvY29tcGlsZS5vdXRwdXQuJywgbnVsbCwgJ2NzcycpXG4gICAgICAgICAgICBvdXRwdXRGaWxlLmlzVGVtcG9yYXJ5ID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzd2l0Y2ggb3V0cHV0RmlsZS5zdHlsZVxuICAgICAgICAgICAgICAgIHdoZW4gJ2NvbXByZXNzZWQnIHRoZW4gcGF0dGVybiA9IEBvcHRpb25zLmNvbXByZXNzZWRGaWxlbmFtZVBhdHRlcm5cbiAgICAgICAgICAgICAgICB3aGVuICdjb21wYWN0JyB0aGVuIHBhdHRlcm4gPSBAb3B0aW9ucy5jb21wYWN0RmlsZW5hbWVQYXR0ZXJuXG4gICAgICAgICAgICAgICAgd2hlbiAnbmVzdGVkJyB0aGVuIHBhdHRlcm4gPSBAb3B0aW9ucy5uZXN0ZWRGaWxlbmFtZVBhdHRlcm5cbiAgICAgICAgICAgICAgICB3aGVuICdleHBhbmRlZCcgdGhlbiBwYXR0ZXJuID0gQG9wdGlvbnMuZXhwYW5kZWRGaWxlbmFtZVBhdHRlcm5cbiAgICAgICAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBvdXRwdXQgc3R5bGUuJylcblxuICAgICAgICAgICAgYmFzZW5hbWUgPSBwYXRoLmJhc2VuYW1lKEBpbnB1dEZpbGUucGF0aClcbiAgICAgICAgICAgICMgd2UgbmVlZCB0aGUgZmlsZSBleHRlbnNpb24gd2l0aG91dCB0aGUgZG90IVxuICAgICAgICAgICAgZmlsZUV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShiYXNlbmFtZSkucmVwbGFjZSgnLicsICcnKVxuXG4gICAgICAgICAgICBmaWxlbmFtZSA9IGJhc2VuYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnXiguKj8pXFwuKCcgKyBmaWxlRXh0ZW5zaW9uICsgJykkJywgJ2dpJyksIHBhdHRlcm4pXG5cbiAgICAgICAgICAgIGlmIG5vdCBwYXRoLmlzQWJzb2x1dGUocGF0aC5kaXJuYW1lKGZpbGVuYW1lKSlcbiAgICAgICAgICAgICAgICBvdXRwdXRQYXRoID0gcGF0aC5kaXJuYW1lKEBpbnB1dEZpbGUucGF0aClcbiAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IHBhdGguam9pbihvdXRwdXRQYXRoLCBmaWxlbmFtZSlcblxuICAgICAgICAgICAgb3V0cHV0RmlsZS5wYXRoID0gZmlsZW5hbWVcblxuICAgICAgICByZXR1cm4gb3V0cHV0RmlsZVxuXG5cbiAgICBjaGVja091dHB1dEZpbGVBbHJlYWR5RXhpc3RzOiAob3V0cHV0RmlsZSkgLT5cbiAgICAgICAgaWYgQG9wdGlvbnMuY2hlY2tPdXRwdXRGaWxlQWxyZWFkeUV4aXN0c1xuICAgICAgICAgICAgaWYgZnMuZXhpc3RzU3luYyhvdXRwdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICAgICAgZGlhbG9nUmVzdWx0QnV0dG9uID0gYXRvbS5jb25maXJtXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhlIG91dHB1dCBmaWxlIGFscmVhZHkgZXhpc3RzLiBEbyB5b3Ugd2FudCB0byBvdmVyd3JpdGUgaXQ/XCJcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIk91dHB1dCBmaWxlOiAnI3tvdXRwdXRGaWxlLnBhdGh9J1wiXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcIk92ZXJ3cml0ZVwiLCBcIlNraXBcIiwgXCJDYW5jZWxcIl1cbiAgICAgICAgICAgICAgICBzd2l0Y2ggZGlhbG9nUmVzdWx0QnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMCB0aGVuIHJldHVybiAnb3ZlcndyaXRlJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIDEgdGhlbiByZXR1cm4gJ3NraXAnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMiB0aGVuIHJldHVybiAnY2FuY2VsJ1xuICAgICAgICByZXR1cm4gJ292ZXJ3cml0ZSdcblxuXG4gICAgZW5zdXJlT3V0cHV0RGlyZWN0b3J5RXhpc3RzOiAob3V0cHV0RmlsZSkgLT5cbiAgICAgICAgaWYgQGlzQ29tcGlsZVRvRmlsZSgpXG4gICAgICAgICAgICBvdXRwdXRQYXRoID0gcGF0aC5kaXJuYW1lKG91dHB1dEZpbGUucGF0aClcbiAgICAgICAgICAgIEZpbGUuZW5zdXJlRGlyZWN0b3J5RXhpc3RzKG91dHB1dFBhdGgpXG5cblxuICAgIHRyeVRvRmluZE5vZGVTYXNzSW5zdGFsbGF0aW9uOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICMgQ29tbWFuZCB3aGljaCBjaGVja3MgaWYgbm9kZS1zYXNzIGlzIGFjY2Vzc2FibGUgd2l0aG91dCBhYnNvbHV0ZSBwYXRoXG4gICAgICAgICMgVGhpcyBjb21tYW5kIHdvcmtzIG9uIFdpbmRvd3MsIExpbnV4IGFuZCBNYWMgT1NcbiAgICAgICAgZGV2TnVsbCA9IGlmIHByb2Nlc3MucGxhdGZvcm0gaXMgJ3dpbjMyJyB0aGVuICdudWwnIGVsc2UgJy9kZXYvbnVsbCdcbiAgICAgICAgZXhpc3RhbmNlQ2hlY2tDb21tYW5kID0gXCJub2RlLXNhc3MgLS12ZXJzaW9uID4je2Rldk51bGx9IDI+JjEgJiYgKGVjaG8gZm91bmQpIHx8IChlY2hvIGZhaWwpXCJcblxuICAgICAgICBwb3NzaWJsZU5vZGVTYXNzUGF0aHMgPSBbJyddXG4gICAgICAgIGlmIHR5cGVvZiBAb3B0aW9ucy5ub2RlU2Fzc1BhdGggaXMgJ3N0cmluZycgYW5kIEBvcHRpb25zLm5vZGVTYXNzUGF0aC5sZW5ndGggPiAxXG4gICAgICAgICAgICBwb3NzaWJsZU5vZGVTYXNzUGF0aHMucHVzaChAb3B0aW9ucy5ub2RlU2Fzc1BhdGgpXG4gICAgICAgIGlmIHByb2Nlc3MucGxhdGZvcm0gaXMgJ3dpbjMyJ1xuICAgICAgICAgICAgcG9zc2libGVOb2RlU2Fzc1BhdGhzLnB1c2goIHBhdGguam9pbihwcm9jZXNzLmVudlsgaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnd2luMzInIHRoZW4gJ1VTRVJQUk9GSUxFJyBlbHNlICdIT01FJyBdLCAnQXBwRGF0YVxcXFxSb2FtaW5nXFxcXG5wbScpIClcbiAgICAgICAgaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnbGludXgnXG4gICAgICAgICAgICBwb3NzaWJsZU5vZGVTYXNzUGF0aHMucHVzaCgnL3Vzci9sb2NhbC9iaW4nKVxuICAgICAgICBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICdkYXJ3aW4nXG4gICAgICAgICAgICBwb3NzaWJsZU5vZGVTYXNzUGF0aHMucHVzaCgnL3Vzci9sb2NhbC9iaW4nKVxuXG5cbiAgICAgICAgY2hlY2tOb2RlU2Fzc0V4aXN0cyA9IChmb3VuZEluUGF0aCkgPT5cbiAgICAgICAgICAgIGlmIHR5cGVvZiBmb3VuZEluUGF0aCBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgIGlmIGZvdW5kSW5QYXRoIGlzIEBvcHRpb25zLm5vZGVTYXNzUGF0aFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh0cnVlLCBmYWxzZSlcbiAgICAgICAgICAgICAgICBlbHNlIGlmIEBhc2tBbmRGaXhOb2RlU2Fzc1BhdGgoZm91bmRJblBhdGgpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRydWUsIHRydWUpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIGlmIHBvc3NpYmxlTm9kZVNhc3NQYXRocy5sZW5ndGggaXMgMFxuICAgICAgICAgICAgICAgICMgTk9UIGZvdW5kIGFuZCBOT1QgZml4ZWRcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIHNlYXJjaFBhdGggPSBwb3NzaWJsZU5vZGVTYXNzUGF0aHMuc2hpZnQoKVxuICAgICAgICAgICAgY29tbWFuZCA9IHBhdGguam9pbihzZWFyY2hQYXRoLCBleGlzdGFuY2VDaGVja0NvbW1hbmQpXG4gICAgICAgICAgICBlbnZpcm9ubWVudCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoIHByb2Nlc3MuZW52ICkpO1xuICAgICAgICAgICAgaWYgdHlwZW9mIHNlYXJjaFBhdGggaXMgJ3N0cmluZycgYW5kIHNlYXJjaFBhdGgubGVuZ3RoID4gMVxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50LlBBVEggKz0gXCI6I3tzZWFyY2hQYXRofVwiXG5cbiAgICAgICAgICAgIGV4ZWMgY29tbWFuZCwgeyBlbnY6IGVudmlyb25tZW50IH0sIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpID0+XG4gICAgICAgICAgICAgICAgaWYgc3Rkb3V0LnRyaW0oKSBpcyAnZm91bmQnXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrTm9kZVNhc3NFeGlzdHMoc2VhcmNoUGF0aClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrTm9kZVNhc3NFeGlzdHMoKVxuXG5cbiAgICAgICAgIyBTdGFydCByZWN1cnNpdmUgc2VhcmNoIGZvciBub2RlLXNhc3MgY29tbWFuZFxuICAgICAgICBjaGVja05vZGVTYXNzRXhpc3RzKClcblxuXG4gICAgYXNrQW5kRml4Tm9kZVNhc3NQYXRoOiAobm9kZVNhc3NQYXRoKSAtPlxuICAgICAgICBpZiBub2RlU2Fzc1BhdGggaXMgJycgYW5kIEBvcHRpb25zLm5vZGVTYXNzUGF0aCBpc250ICcnXG4gICAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2UgPSBcIidQYXRoIHRvIG5vZGUtc2FzcyBjb21tYW5kJyBvcHRpb24gd2lsbCBiZSBjbGVhcmVkLCBiZWNhdXNlIG5vZGUtc2FzcyBpcyBhY2Nlc3NhYmxlIHdpdGhvdXQgYWJzb2x1dGUgcGF0aC5cIlxuXG4gICAgICAgIGVsc2UgaWYgbm9kZVNhc3NQYXRoIGlzbnQgJycgYW5kIEBvcHRpb25zLm5vZGVTYXNzUGF0aCBpcyAnJ1xuICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlID0gXCInUGF0aCB0byBub2RlLXNhc3MgY29tbWFuZCcgb3B0aW9uIHdpbGwgYmUgc2V0IHRvICcje25vZGVTYXNzUGF0aH0nLCBiZWNhdXNlIGNvbW1hbmQgd2FzIGZvdW5kIHRoZXJlLlwiXG5cbiAgICAgICAgZWxzZSBpZiBub2RlU2Fzc1BhdGggaXNudCAnJyBhbmQgQG9wdGlvbnMubm9kZVNhc3NQYXRoIGlzbnQgJydcbiAgICAgICAgICAgIGRldGFpbGVkTWVzc2FnZSA9IFwiJ1BhdGggdG8gbm9kZS1zYXNzIGNvbW1hbmQnIG9wdGlvbiB3aWxsIGJlIHJlcGxhY2VkIHdpdGggJyN7bm9kZVNhc3NQYXRofScsIGJlY2F1c2UgY29tbWFuZCB3YXMgZm91bmQgdGhlcmUuXCJcblxuICAgICAgICAjIEFzayB1c2VyIHRvIGZpeCB0aGF0IHBhdGhcbiAgICAgICAgZGlhbG9nUmVzdWx0QnV0dG9uID0gYXRvbS5jb25maXJtXG4gICAgICAgICAgICBtZXNzYWdlOiBcIidub2RlLXNhc3MnIGNvbW1hbmQgY291bGQgbm90IGJlIGZvdW5kIHdpdGggY3VycmVudCBjb25maWd1cmF0aW9uLCBidXQgaXQgY2FuIGJlIGF1dG9tYXRpY2FsbHkgZml4ZWQuIEZpeCBpdD9cIlxuICAgICAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBkZXRhaWxlZE1lc3NhZ2VcbiAgICAgICAgICAgIGJ1dHRvbnM6IFtcIkZpeCBpdFwiLCBcIkNhbmNlbFwiXVxuICAgICAgICBzd2l0Y2ggZGlhbG9nUmVzdWx0QnV0dG9uXG4gICAgICAgICAgICB3aGVuIDBcbiAgICAgICAgICAgICAgICBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnNldCgnbm9kZVNhc3NQYXRoJywgbm9kZVNhc3NQYXRoKVxuICAgICAgICAgICAgICAgIEBvcHRpb25zLm5vZGVTYXNzUGF0aCA9IG5vZGVTYXNzUGF0aFxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB3aGVuIDFcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcblxuXG4gICAgZG9Db21waWxlOiAoKSAtPlxuICAgICAgICBpZiBAb3V0cHV0U3R5bGVzLmxlbmd0aCBpcyAwXG4gICAgICAgICAgICBAZW1pdEZpbmlzaGVkKClcbiAgICAgICAgICAgIGlmIEBpbnB1dEZpbGUuaXNUZW1wb3JhcnlcbiAgICAgICAgICAgICAgICBGaWxlLmRlbGV0ZShAaW5wdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBvdXRwdXRTdHlsZSA9IEBvdXRwdXRTdHlsZXMucG9wKCk7XG4gICAgICAgIG91dHB1dEZpbGUgPSBAZ2V0T3V0cHV0RmlsZShvdXRwdXRTdHlsZSlcbiAgICAgICAgZW1pdHRlclBhcmFtZXRlcnMgPSBAZ2V0QmFzaWNFbWl0dGVyUGFyYW1ldGVycyh7IG91dHB1dEZpbGVuYW1lOiBvdXRwdXRGaWxlLnBhdGgsIG91dHB1dFN0eWxlOiBvdXRwdXRGaWxlLnN0eWxlIH0pXG5cbiAgICAgICAgdHJ5XG4gICAgICAgICAgICBpZiBAaXNDb21waWxlVG9GaWxlKClcbiAgICAgICAgICAgICAgICBzd2l0Y2ggQGNoZWNrT3V0cHV0RmlsZUFscmVhZHlFeGlzdHMob3V0cHV0RmlsZSlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAnb3ZlcndyaXRlJyB0aGVuICMgZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgICAgICB3aGVuICdjYW5jZWwnIHRoZW4gdGhyb3cgbmV3IEVycm9yKCdDb21waWxhdGlvbiBjYW5jZWxsZWQnKVxuICAgICAgICAgICAgICAgICAgICB3aGVuICdza2lwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1pdHRlclBhcmFtZXRlcnMubWVzc2FnZSA9ICdDb21waWxhdGlvbiBza2lwcGVkOiAnICsgb3V0cHV0RmlsZS5wYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICBAZW1pdHRlci5lbWl0KCd3YXJuaW5nJywgZW1pdHRlclBhcmFtZXRlcnMpXG4gICAgICAgICAgICAgICAgICAgICAgICBAZG9Db21waWxlKCkgIyA8LS0tIFJlY3Vyc2lvbiEhIVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIEBlbnN1cmVPdXRwdXREaXJlY3RvcnlFeGlzdHMob3V0cHV0RmlsZSlcblxuICAgICAgICAgICAgQHN0YXJ0Q29tcGlsaW5nVGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKClcblxuICAgICAgICAgICAgZXhlY1BhcmFtZXRlcnMgPSBAcHJlcGFyZUV4ZWNQYXJhbWV0ZXJzKG91dHB1dEZpbGUpXG4gICAgICAgICAgICB0aW1lb3V0ID0gaWYgQG9wdGlvbnMubm9kZVNhc3NUaW1lb3V0ID4gMCB0aGVuIEBvcHRpb25zLm5vZGVTYXNzVGltZW91dCBlbHNlIDBcbiAgICAgICAgICAgIGNoaWxkID0gZXhlYyBleGVjUGFyYW1ldGVycy5jb21tYW5kLCB7IGVudjogZXhlY1BhcmFtZXRlcnMuZW52aXJvbm1lbnQsIHRpbWVvdXQ6IHRpbWVvdXQgfSwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT5cbiAgICAgICAgICAgICAgICAjIGV4aXRDb2RlIGlzIDEgd2hlbiBzb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIGV4ZWN1dGluZyBub2RlLXNhc3MgY29tbWFuZCwgbm90IHdoZW5cbiAgICAgICAgICAgICAgICAjIHRoZXJlIGlzIGFuIGVycm9yIGluIFNBU1NcbiAgICAgICAgICAgICAgICBpZiBjaGlsZC5leGl0Q29kZSA+IDBcbiAgICAgICAgICAgICAgICAgICAgQHRyeVRvRmluZE5vZGVTYXNzSW5zdGFsbGF0aW9uIChmb3VuZCwgZml4ZWQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAjIE9ubHkgcmV0cnkgdG8gY29tcGlsZSBpZiBub2RlLXNhc3MgY29tbWFuZCBjb3VsZCBiZSBmaXhlZCwgbm90IGlmXG4gICAgICAgICAgICAgICAgICAgICAgICAjIG5vZGUtc2FzcyBjb3VsZCBiZSBmb3VuZC4gQmVjYXVzZSB0aGVyZSBjYW4gYmUgb3RoZXIgZXJyb3MgdGhhbiBvbmx5XG4gICAgICAgICAgICAgICAgICAgICAgICAjIGEgbm9uLWZpbmRhYmxlIG5vZGUtc2Fzc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgZml4ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAX2NvbXBpbGUoQG1vZGUsIEB0YXJnZXRGaWxlbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHRyeSBhZ2FpbiBjb21waWxpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHRocm93IGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uQ29tcGlsZWQob3V0cHV0RmlsZSwgZXJyb3IsIHN0ZG91dCwgc3RkZXJyLCBjaGlsZC5raWxsZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQGRvQ29tcGlsZSgpICMgPC0tLSBSZWN1cnNpb24hISFcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBvbkNvbXBpbGVkKG91dHB1dEZpbGUsIGVycm9yLCBzdGRvdXQsIHN0ZGVyciwgY2hpbGQua2lsbGVkKVxuICAgICAgICAgICAgICAgICAgICBAZG9Db21waWxlKCkgIyA8LS0tIFJlY3Vyc2lvbiEhIVxuXG4gICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgICBlbWl0dGVyUGFyYW1ldGVycy5tZXNzYWdlID0gZXJyb3JcbiAgICAgICAgICAgIEBlbWl0dGVyLmVtaXQoJ2Vycm9yJywgZW1pdHRlclBhcmFtZXRlcnMpXG5cbiAgICAgICAgICAgICMgQ2xlYXIgb3V0cHV0IHN0eWxlcywgc28gbm8gZnVydGhlciBjb21waWxhdGlvbiB3aWxsIGJlIGV4ZWN1dGVkXG4gICAgICAgICAgICBAb3V0cHV0U3R5bGVzID0gW107XG5cbiAgICAgICAgICAgIEBkb0NvbXBpbGUoKSAjIDwtLS0gUmVjdXJzaW9uISEhXG5cblxuICAgIG9uQ29tcGlsZWQ6IChvdXRwdXRGaWxlLCBlcnJvciwgc3Rkb3V0LCBzdGRlcnIsIGtpbGxlZCkgLT5cbiAgICAgICAgZW1pdHRlclBhcmFtZXRlcnMgPSBAZ2V0QmFzaWNFbWl0dGVyUGFyYW1ldGVycyh7IG91dHB1dEZpbGVuYW1lOiBvdXRwdXRGaWxlLnBhdGgsIG91dHB1dFN0eWxlOiBvdXRwdXRGaWxlLnN0eWxlIH0pXG4gICAgICAgIHN0YXRpc3RpY3MgPVxuICAgICAgICAgICAgZHVyYXRpb246IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gQHN0YXJ0Q29tcGlsaW5nVGltZXN0YW1wXG5cbiAgICAgICAgdHJ5XG4gICAgICAgICAgICAjIFNhdmUgbm9kZS1zYXNzIGNvbXBpbGF0aW9uIG91dHB1dCAoaW5mbywgd2FybmluZ3MsIGVycm9ycywgZXRjLilcbiAgICAgICAgICAgIGVtaXR0ZXJQYXJhbWV0ZXJzLm5vZGVTYXNzT3V0cHV0ID0gaWYgc3Rkb3V0IHRoZW4gc3Rkb3V0IGVsc2Ugc3RkZXJyXG5cbiAgICAgICAgICAgIGlmIGVycm9yIGlzbnQgbnVsbCBvciBraWxsZWRcbiAgICAgICAgICAgICAgICBpZiBraWxsZWRcbiAgICAgICAgICAgICAgICAgICAgIyBub2RlLXNhc3MgaGFzIGJlZW4gZXhlY3V0ZWQgdG9vIGxvbmdcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gXCJDb21waWxhdGlvbiBjYW5jZWxsZWQgYmVjYXVzZSBvZiB0aW1lb3V0ICgje0BvcHRpb25zLm5vZGVTYXNzVGltZW91dH0gbXMpXCJcblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgIyBlcnJvciB3aGlsZSBleGVjdXRpbmcgbm9kZS1zYXNzXG4gICAgICAgICAgICAgICAgICAgIGlmIGVycm9yLm1lc3NhZ2UuaW5kZXhPZignXCJtZXNzYWdlXCI6JykgPiAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JKc29uID0gZXJyb3IubWVzc2FnZS5tYXRjaCgve1xcbiguKj8oXFxuKSkrfS9nbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBKU09OLnBhcnNlKGVycm9ySnNvbilcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gZXJyb3IubWVzc2FnZVxuXG4gICAgICAgICAgICAgICAgZW1pdHRlclBhcmFtZXRlcnMubWVzc2FnZSA9IGVycm9yTWVzc2FnZVxuICAgICAgICAgICAgICAgIEBlbWl0dGVyLmVtaXQoJ2Vycm9yJywgZW1pdHRlclBhcmFtZXRlcnMpXG5cbiAgICAgICAgICAgICAgICAjIENsZWFyIG91dHB1dCBzdHlsZXMsIHNvIG5vIGZ1cnRoZXIgY29tcGlsYXRpb24gd2lsbCBiZSBleGVjdXRlZFxuICAgICAgICAgICAgICAgIEBvdXRwdXRTdHlsZXMgPSBbXTtcblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHN0YXRpc3RpY3MuYmVmb3JlID0gRmlsZS5nZXRGaWxlU2l6ZShAaW5wdXRGaWxlLnBhdGgpXG4gICAgICAgICAgICAgICAgc3RhdGlzdGljcy5hZnRlciA9IEZpbGUuZ2V0RmlsZVNpemUob3V0cHV0RmlsZS5wYXRoKVxuICAgICAgICAgICAgICAgIHN0YXRpc3RpY3MudW5pdCA9ICdCeXRlJ1xuXG4gICAgICAgICAgICAgICAgaWYgQGlzQ29tcGlsZURpcmVjdCgpXG4gICAgICAgICAgICAgICAgICAgIGNvbXBpbGVkQ3NzID0gZnMucmVhZEZpbGVTeW5jKG91dHB1dEZpbGUucGF0aClcbiAgICAgICAgICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLnNldFRleHQoIGNvbXBpbGVkQ3NzLnRvU3RyaW5nKCkgKVxuXG4gICAgICAgICAgICAgICAgZW1pdHRlclBhcmFtZXRlcnMuc3RhdGlzdGljcyA9IHN0YXRpc3RpY3NcbiAgICAgICAgICAgICAgICBAZW1pdHRlci5lbWl0KCdzdWNjZXNzJywgZW1pdHRlclBhcmFtZXRlcnMpXG5cbiAgICAgICAgZmluYWxseVxuICAgICAgICAgICAgIyBEZWxldGUgdGVtcG9yYXJ5IGNyZWF0ZWQgb3V0cHV0IGZpbGUsIGV2ZW4gaWYgdGhlcmUgd2FzIGFuIGVycm9yXG4gICAgICAgICAgICAjIEJ1dCBkbyBub3QgZGVsZXRlIGEgdGVtcG9yYXJ5IGlucHV0IGZpbGUsIGJlY2F1c2Ugb2YgbXVsdGlwbGUgb3V0cHV0cyFcbiAgICAgICAgICAgIGlmIG91dHB1dEZpbGUuaXNUZW1wb3JhcnlcbiAgICAgICAgICAgICAgICBGaWxlLmRlbGV0ZShvdXRwdXRGaWxlLnBhdGgpXG5cblxuICAgIHByZXBhcmVFeGVjUGFyYW1ldGVyczogKG91dHB1dEZpbGUpIC0+XG4gICAgICAgICMgQnVpbGQgdGhlIGNvbW1hbmQgc3RyaW5nXG4gICAgICAgIG5vZGVTYXNzUGFyYW1ldGVycyA9IEBidWlsZE5vZGVTYXNzUGFyYW1ldGVycyhvdXRwdXRGaWxlKVxuICAgICAgICBjb21tYW5kID0gJ25vZGUtc2FzcyAnICsgbm9kZVNhc3NQYXJhbWV0ZXJzLmpvaW4oJyAnKVxuXG4gICAgICAgICMgQ2xvbmUgY3VycmVudCBlbnZpcm9ubWVudCwgc28gZG8gbm90IHRvdWNoIHRoZSBnbG9iYWwgb25lIGJ1dCBjYW4gbW9kaWZ5IHRoZSBzZXR0aW5nc1xuICAgICAgICBlbnZpcm9ubWVudCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoIHByb2Nlc3MuZW52ICkpO1xuXG4gICAgICAgICMgQmVjYXVzZSBvZiBwZXJtaXNzaW9uIHByb2JsZW1zIGluIE1hYyBPUyBhbmQgTGludXggd2Ugc29tZXRpbWVzIG5lZWQgdG8gYWRkIG5vZGVTYXNzUGF0aFxuICAgICAgICAjIHRvIGNvbW1hbmQgYW5kIHRvIGVudmlyb25tZW50IHZhcmlhYmxlIFBBVEggc28gc2hlbGwgQU5EIG5vZGUuanMgY2FuIGZpbmQgbm9kZS1zYXNzXG4gICAgICAgICMgZXhlY3V0YWJsZVxuICAgICAgICBpZiB0eXBlb2YgQG9wdGlvbnMubm9kZVNhc3NQYXRoIGlzICdzdHJpbmcnIGFuZCBAb3B0aW9ucy5ub2RlU2Fzc1BhdGgubGVuZ3RoID4gMVxuICAgICAgICAgICAgIyBUT0RPOiBIaWVyIHNvbGx0ZSBlcyBzbyBvcHRpbWllcnQgd2VyZGVuLCBkYXNzIHdlbm4gZGVyIGFic29sdXRlIFBmYWQgZGllIEFud2VuZHVuZyBlbnRow6RsdCBkaWVzZSDDvGJlcm5vbW1lbiB3ZXJkZW4gc29sbHRlXG4gICAgICAgICAgICBjb21tYW5kID0gcGF0aC5qb2luKEBvcHRpb25zLm5vZGVTYXNzUGF0aCwgY29tbWFuZClcbiAgICAgICAgICAgIGVudmlyb25tZW50LlBBVEggKz0gXCI6I3tAb3B0aW9ucy5ub2RlU2Fzc1BhdGh9XCJcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZCxcbiAgICAgICAgICAgIGVudmlyb25tZW50OiBlbnZpcm9ubWVudFxuICAgICAgICB9XG5cblxuICAgIGJ1aWxkTm9kZVNhc3NQYXJhbWV0ZXJzOiAob3V0cHV0RmlsZSkgLT5cbiAgICAgICAgZXhlY1BhcmFtZXRlcnMgPSBbXVxuICAgICAgICB3b3JraW5nRGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKEBpbnB1dEZpbGUucGF0aClcblxuICAgICAgICAjIC0tb3V0cHV0LXN0eWxlXG4gICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJy0tb3V0cHV0LXN0eWxlICcgKyBvdXRwdXRGaWxlLnN0eWxlKVxuXG4gICAgICAgICMgLS1pbmRlbnQtdHlwZVxuICAgICAgICBpZiB0eXBlb2YgQG9wdGlvbnMuaW5kZW50VHlwZSBpcyAnc3RyaW5nJyBhbmQgQG9wdGlvbnMuaW5kZW50VHlwZS5sZW5ndGggPiAwXG4gICAgICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCctLWluZGVudC10eXBlICcgKyBAb3B0aW9ucy5pbmRlbnRUeXBlLnRvTG93ZXJDYXNlKCkpXG5cbiAgICAgICAgIyAtLWluZGVudC13aWR0aFxuICAgICAgICBpZiB0eXBlb2YgQG9wdGlvbnMuaW5kZW50V2lkdGggaXMgJ251bWJlcidcbiAgICAgICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJy0taW5kZW50LXdpZHRoICcgKyBAb3B0aW9ucy5pbmRlbnRXaWR0aClcblxuICAgICAgICAjIC0tbGluZWZlZWRcbiAgICAgICAgaWYgdHlwZW9mIEBvcHRpb25zLmxpbmVmZWVkIGlzICdzdHJpbmcnIGFuZCBAb3B0aW9ucy5saW5lZmVlZC5sZW5naHQgPiAwXG4gICAgICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCctLWxpbmVmZWVkICcgKyBAb3B0aW9ucy5saW5lZmVlZClcblxuICAgICAgICAjIC0tc291cmNlLWNvbW1lbnRzXG4gICAgICAgIGlmIEBvcHRpb25zLnNvdXJjZUNvbW1lbnRzIGlzIHRydWVcbiAgICAgICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJy0tc291cmNlLWNvbW1lbnRzJylcblxuICAgICAgICAjIC0tc291cmNlLW1hcFxuICAgICAgICBpZiBAb3B0aW9ucy5zb3VyY2VNYXAgaXMgdHJ1ZSBvciAodHlwZW9mIEBvcHRpb25zLnNvdXJjZU1hcCBpcyAnc3RyaW5nJyBhbmQgQG9wdGlvbnMuc291cmNlTWFwLmxlbmd0aCA+IDApXG4gICAgICAgICAgICBpZiBAb3B0aW9ucy5zb3VyY2VNYXAgaXMgdHJ1ZVxuICAgICAgICAgICAgICAgIHNvdXJjZU1hcEZpbGVuYW1lID0gb3V0cHV0RmlsZS5wYXRoICsgJy5tYXAnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYmFzZW5hbWUgPSBwYXRoLmJhc2VuYW1lKG91dHB1dEZpbGUucGF0aClcbiAgICAgICAgICAgICAgICBmaWxlRXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGJhc2VuYW1lKS5yZXBsYWNlKCcuJywgJycpXG4gICAgICAgICAgICAgICAgc291cmNlTWFwRmlsZW5hbWUgPSBiYXNlbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJ14oLio/KVxcLignICsgZmlsZUV4dGVuc2lvbiArICcpJCcsICdnaScpLCBAb3B0aW9ucy5zb3VyY2VNYXApXG4gICAgICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCctLXNvdXJjZS1tYXAgXCInICsgc291cmNlTWFwRmlsZW5hbWUgKyAnXCInKVxuXG4gICAgICAgICMgLS1zb3VyY2UtbWFwLWVtYmVkXG4gICAgICAgIGlmIEBvcHRpb25zLnNvdXJjZU1hcEVtYmVkIGlzIHRydWVcbiAgICAgICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJy0tc291cmNlLW1hcC1lbWJlZCcpXG5cbiAgICAgICAgIyAtLXNvdXJjZS1tYXAtY29udGVudHNcbiAgICAgICAgaWYgQG9wdGlvbnMuc291cmNlTWFwQ29udGVudHMgaXMgdHJ1ZVxuICAgICAgICAgICAgZXhlY1BhcmFtZXRlcnMucHVzaCgnLS1zb3VyY2UtbWFwLWNvbnRlbnRzJylcblxuICAgICAgICAjIC0taW5jbHVkZS1wYXRoXG4gICAgICAgIGlmIEBvcHRpb25zLmluY2x1ZGVQYXRoXG4gICAgICAgICAgICBpbmNsdWRlUGF0aCA9IEBvcHRpb25zLmluY2x1ZGVQYXRoXG4gICAgICAgICAgICBpZiB0eXBlb2YgaW5jbHVkZVBhdGggaXMgJ3N0cmluZydcbiAgICAgICAgICAgICAgICBhcmd1bWVudFBhcnNlciA9IG5ldyBBcmd1bWVudFBhcnNlcigpXG4gICAgICAgICAgICAgICAgaW5jbHVkZVBhdGggPSBhcmd1bWVudFBhcnNlci5wYXJzZVZhbHVlKCdbJyArIGluY2x1ZGVQYXRoICsgJ10nKVxuICAgICAgICAgICAgICAgIGlmICFBcnJheS5pc0FycmF5KGluY2x1ZGVQYXRoKVxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlUGF0aCA9IFtpbmNsdWRlUGF0aF1cblxuICAgICAgICAgICAgZm9yIGkgaW4gWzAgLi4gaW5jbHVkZVBhdGgubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICBpZiBub3QgcGF0aC5pc0Fic29sdXRlKGluY2x1ZGVQYXRoW2ldKVxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlUGF0aFtpXSA9IHBhdGguam9pbih3b3JraW5nRGlyZWN0b3J5LCBpbmNsdWRlUGF0aFtpXSlcblxuICAgICAgICAgICAgICAgICMgUmVtb3ZlIHRyYWlsaW5nIChiYWNrLSlzbGFzaCwgYmVjYXVzZSBlbHNlIHRoZXJlIHNlZW1zIHRvIGJlIGEgYnVnIGluIG5vZGUtc2Fzc1xuICAgICAgICAgICAgICAgICMgc28gY29tcGlsaW5nIGVuZHMgaW4gYW4gaW5maW5pdGUgbG9vcFxuICAgICAgICAgICAgICAgIGlmIGluY2x1ZGVQYXRoW2ldLnN1YnN0cigtMSkgaXMgcGF0aC5zZXBcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVkZVBhdGhbaV0gPSBpbmNsdWRlUGF0aFtpXS5zdWJzdHIoMCwgaW5jbHVkZVBhdGhbaV0ubGVuZ3RoIC0gMSlcblxuICAgICAgICAgICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJy0taW5jbHVkZS1wYXRoIFwiJyArIGluY2x1ZGVQYXRoW2ldICsgJ1wiJylcblxuICAgICAgICAjIC0tcHJlY2lzaW9uXG4gICAgICAgIGlmIHR5cGVvZiBAb3B0aW9ucy5wcmVjaXNpb24gaXMgJ251bWJlcidcbiAgICAgICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJy0tcHJlY2lzaW9uICcgKyBAb3B0aW9ucy5wcmVjaXNpb24pXG5cbiAgICAgICAgIyAtLWltcG9ydGVyXG4gICAgICAgIGlmIHR5cGVvZiBAb3B0aW9ucy5pbXBvcnRlciBpcyAnc3RyaW5nJyBhbmQgQG9wdGlvbnMuaW1wb3J0ZXIubGVuZ3RoID4gMFxuICAgICAgICAgICAgaW1wb3J0ZXJGaWxlbmFtZSA9IEBvcHRpb25zLmltcG9ydGVyXG4gICAgICAgICAgICBpZiBub3QgcGF0aC5pc0Fic29sdXRlKGltcG9ydGVyRmlsZW5hbWUpXG4gICAgICAgICAgICAgICAgaW1wb3J0ZXJGaWxlbmFtZSA9IHBhdGguam9pbih3b3JraW5nRGlyZWN0b3J5ICwgaW1wb3J0ZXJGaWxlbmFtZSlcbiAgICAgICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJy0taW1wb3J0ZXIgXCInICsgcGF0aC5yZXNvbHZlKGltcG9ydGVyRmlsZW5hbWUpICsgJ1wiJylcblxuICAgICAgICAjIC0tZnVuY3Rpb25zXG4gICAgICAgIGlmIHR5cGVvZiBAb3B0aW9ucy5mdW5jdGlvbnMgaXMgJ3N0cmluZycgYW5kIEBvcHRpb25zLmZ1bmN0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICBmdW5jdGlvbnNGaWxlbmFtZSA9IEBvcHRpb25zLmZ1bmN0aW9uc1xuICAgICAgICAgICAgaWYgbm90IHBhdGguaXNBYnNvbHV0ZShmdW5jdGlvbnNGaWxlbmFtZSlcbiAgICAgICAgICAgICAgICBmdW5jdGlvbnNGaWxlbmFtZSA9IHBhdGguam9pbih3b3JraW5nRGlyZWN0b3J5ICwgZnVuY3Rpb25zRmlsZW5hbWUpXG4gICAgICAgICAgICBleGVjUGFyYW1ldGVycy5wdXNoKCctLWZ1bmN0aW9ucyBcIicgKyBwYXRoLnJlc29sdmUoZnVuY3Rpb25zRmlsZW5hbWUpICsgJ1wiJylcblxuICAgICAgICAjIENTUyB0YXJnZXQgYW5kIG91dHB1dCBmaWxlXG4gICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJ1wiJyArIEBpbnB1dEZpbGUucGF0aCArICdcIicpXG4gICAgICAgIGV4ZWNQYXJhbWV0ZXJzLnB1c2goJ1wiJyArIG91dHB1dEZpbGUucGF0aCArICdcIicpXG5cbiAgICAgICAgcmV0dXJuIGV4ZWNQYXJhbWV0ZXJzXG5cblxuICAgIGVtaXRTdGFydDogKCkgLT5cbiAgICAgICAgQGVtaXR0ZXIuZW1pdCgnc3RhcnQnLCBAZ2V0QmFzaWNFbWl0dGVyUGFyYW1ldGVycygpKVxuXG5cbiAgICBlbWl0RmluaXNoZWQ6ICgpIC0+XG4gICAgICAgIEBkZWxldGVUZW1wb3JhcnlGaWxlcygpXG4gICAgICAgIEBlbWl0dGVyLmVtaXQoJ2ZpbmlzaGVkJywgQGdldEJhc2ljRW1pdHRlclBhcmFtZXRlcnMoKSlcblxuXG4gICAgZW1pdE1lc3NhZ2U6ICh0eXBlLCBtZXNzYWdlKSAtPlxuICAgICAgICBAZW1pdHRlci5lbWl0KHR5cGUsIEBnZXRCYXNpY0VtaXR0ZXJQYXJhbWV0ZXJzKHsgbWVzc2FnZTogbWVzc2FnZSB9KSlcblxuXG4gICAgZW1pdE1lc3NhZ2VBbmRGaW5pc2g6ICh0eXBlLCBtZXNzYWdlLCBlbWl0U3RhcnRFdmVudCA9IGZhbHNlKSAtPlxuICAgICAgICBpZiBlbWl0U3RhcnRFdmVudFxuICAgICAgICAgICAgQGVtaXRTdGFydCgpXG4gICAgICAgIEBlbWl0TWVzc2FnZSh0eXBlLCBtZXNzYWdlKVxuICAgICAgICBAZW1pdEZpbmlzaGVkKClcblxuXG4gICAgZ2V0QmFzaWNFbWl0dGVyUGFyYW1ldGVyczogKGFkZGl0aW9uYWxQYXJhbWV0ZXJzID0ge30pIC0+XG4gICAgICAgIHBhcmFtZXRlcnMgPVxuICAgICAgICAgICAgaXNDb21waWxlVG9GaWxlOiBAaXNDb21waWxlVG9GaWxlKCksXG4gICAgICAgICAgICBpc0NvbXBpbGVEaXJlY3Q6IEBpc0NvbXBpbGVEaXJlY3QoKSxcblxuICAgICAgICBpZiBAaW5wdXRGaWxlXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLmlucHV0RmlsZW5hbWUgPSBAaW5wdXRGaWxlLnBhdGhcblxuICAgICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBhZGRpdGlvbmFsUGFyYW1ldGVyc1xuICAgICAgICAgICAgcGFyYW1ldGVyc1trZXldID0gdmFsdWVcblxuICAgICAgICByZXR1cm4gcGFyYW1ldGVyc1xuXG5cbiAgICBkZWxldGVUZW1wb3JhcnlGaWxlczogLT5cbiAgICAgICAgaWYgQGlucHV0RmlsZSBhbmQgQGlucHV0RmlsZS5pc1RlbXBvcmFyeVxuICAgICAgICAgICAgRmlsZS5kZWxldGUoQGlucHV0RmlsZS5wYXRoKVxuICAgICAgICBpZiBAb3V0cHV0RmlsZSBhbmQgQG91dHB1dEZpbGUuaXNUZW1wb3JhcnlcbiAgICAgICAgICAgIEZpbGUuZGVsZXRlKEBvdXRwdXRGaWxlLnBhdGgpXG5cblxuICAgIGlzQ29tcGlsZURpcmVjdDogLT5cbiAgICAgICAgcmV0dXJuIEBtb2RlIGlzIE5vZGVTYXNzQ29tcGlsZXIuTU9ERV9ESVJFQ1RcblxuXG4gICAgaXNDb21waWxlVG9GaWxlOiAtPlxuICAgICAgICByZXR1cm4gQG1vZGUgaXMgTm9kZVNhc3NDb21waWxlci5NT0RFX0ZJTEVcblxuXG4gICAgb25TdGFydDogKGNhbGxiYWNrKSAtPlxuICAgICAgICBAZW1pdHRlci5vbiAnc3RhcnQnLCBjYWxsYmFja1xuXG5cbiAgICBvblN1Y2Nlc3M6IChjYWxsYmFjaykgLT5cbiAgICAgICAgQGVtaXR0ZXIub24gJ3N1Y2Nlc3MnLCBjYWxsYmFja1xuXG5cbiAgICBvbldhcm5pbmc6IChjYWxsYmFjaykgLT5cbiAgICAgICAgQGVtaXR0ZXIub24gJ3dhcm5pbmcnLCBjYWxsYmFja1xuXG5cbiAgICBvbkVycm9yOiAoY2FsbGJhY2spIC0+XG4gICAgICAgIEBlbWl0dGVyLm9uICdlcnJvcicsIGNhbGxiYWNrXG5cblxuICAgIG9uRmluaXNoZWQ6IChjYWxsYmFjaykgLT5cbiAgICAgICAgQGVtaXR0ZXIub24gJ2ZpbmlzaGVkJywgY2FsbGJhY2tcbiJdfQ==
