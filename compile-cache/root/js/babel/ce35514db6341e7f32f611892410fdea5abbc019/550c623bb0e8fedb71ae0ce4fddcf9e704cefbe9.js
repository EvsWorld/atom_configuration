Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _sbDebounce = require('sb-debounce');

var _sbDebounce2 = _interopRequireDefault(_sbDebounce);

var _helpers = require('./helpers');

var MessageRegistry = (function () {
  function MessageRegistry() {
    _classCallCheck(this, MessageRegistry);

    this.emitter = new _atom.Emitter();
    this.messages = [];
    this.messagesMap = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
    this.debouncedUpdate = (0, _sbDebounce2['default'])(this.update, 100, true);

    this.subscriptions.add(this.emitter);
  }

  _createClass(MessageRegistry, [{
    key: 'set',
    value: function set(_ref) {
      var messages = _ref.messages;
      var linter = _ref.linter;
      var buffer = _ref.buffer;
      return (function () {
        var found = null;
        for (var entry of this.messagesMap) {
          if (entry.buffer === buffer && entry.linter === linter) {
            found = entry;
            break;
          }
        }

        if (found) {
          found.messages = messages;
          found.changed = true;
        } else {
          this.messagesMap.add({ messages: messages, linter: linter, buffer: buffer, oldMessages: [], changed: true, deleted: false });
        }
        this.debouncedUpdate();
      }).apply(this, arguments);
    }
  }, {
    key: 'update',
    value: function update() {
      var result = { added: [], removed: [], messages: [] };

      for (var entry of this.messagesMap) {
        if (entry.deleted) {
          result.removed = result.removed.concat(entry.oldMessages);
          this.messagesMap['delete'](entry);
          continue;
        }
        if (!entry.changed) {
          result.messages = result.messages.concat(entry.oldMessages);
          continue;
        }
        entry.changed = false;
        if (!entry.oldMessages.length) {
          // All messages are new, no need to diff
          // NOTE: No need to add .key here because normalizeMessages already does that
          result.added = result.added.concat(entry.messages);
          result.messages = result.messages.concat(entry.messages);
          entry.oldMessages = entry.messages;
          continue;
        }
        if (!entry.messages.length) {
          // All messages are old, no need to diff
          result.removed = result.removed.concat(entry.oldMessages);
          entry.oldMessages = [];
          continue;
        }

        var newKeys = new Set();
        var oldKeys = new Set();
        var _oldMessages = entry.oldMessages;
        var foundNew = false;
        entry.oldMessages = [];

        for (var i = 0, _length = _oldMessages.length; i < _length; ++i) {
          var message = _oldMessages[i];
          if (message.version === 2) {
            message.key = (0, _helpers.messageKey)(message);
          } else {
            message.key = (0, _helpers.messageKeyLegacy)(message);
          }
          oldKeys.add(message.key);
        }

        for (var i = 0, _length2 = entry.messages.length; i < _length2; ++i) {
          var message = entry.messages[i];
          if (newKeys.has(message.key)) {
            continue;
          }
          newKeys.add(message.key);
          if (!oldKeys.has(message.key)) {
            foundNew = true;
            result.added.push(message);
            result.messages.push(message);
            entry.oldMessages.push(message);
          }
        }

        if (!foundNew && entry.messages.length === _oldMessages.length) {
          // Messages are unchanged
          result.messages = result.messages.concat(_oldMessages);
          entry.oldMessages = _oldMessages;
          continue;
        }

        for (var i = 0, _length3 = _oldMessages.length; i < _length3; ++i) {
          var message = _oldMessages[i];
          if (newKeys.has(message.key)) {
            entry.oldMessages.push(message);
            result.messages.push(message);
          } else {
            result.removed.push(message);
          }
        }
      }

      if (result.added.length || result.removed.length) {
        this.messages = result.messages;
        this.emitter.emit('did-update-messages', result);
      }
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'deleteByBuffer',
    value: function deleteByBuffer(buffer) {
      for (var entry of this.messagesMap) {
        if (entry.buffer === buffer) {
          entry.deleted = true;
        }
      }
      this.debouncedUpdate();
    }
  }, {
    key: 'deleteByLinter',
    value: function deleteByLinter(linter) {
      for (var entry of this.messagesMap) {
        if (entry.linter === linter) {
          entry.deleted = true;
        }
      }
      this.debouncedUpdate();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return MessageRegistry;
})();

exports['default'] = MessageRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9tZXNzYWdlLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTZDLE1BQU07OzBCQUM5QixhQUFhOzs7O3VCQUVXLFdBQVc7O0lBWW5DLGVBQWU7QUFPdkIsV0FQUSxlQUFlLEdBT3BCOzBCQVBLLGVBQWU7O0FBUWhDLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsZUFBZSxHQUFHLDZCQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBOztBQUV2RCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckM7O2VBZmtCLGVBQWU7O1dBZ0IvQixhQUFDLElBQThHO1VBQTVHLFFBQVEsR0FBVixJQUE4RyxDQUE1RyxRQUFRO1VBQUUsTUFBTSxHQUFsQixJQUE4RyxDQUFsRyxNQUFNO1VBQUUsTUFBTSxHQUExQixJQUE4RyxDQUExRixNQUFNOzBCQUFzRjtBQUNsSCxZQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDaEIsYUFBSyxJQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3BDLGNBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7QUFDdEQsaUJBQUssR0FBRyxLQUFLLENBQUE7QUFDYixrQkFBSztXQUNOO1NBQ0Y7O0FBRUQsWUFBSSxLQUFLLEVBQUU7QUFDVCxlQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FB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QUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0F4SWtCLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9tZXNzYWdlLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnc2ItZGVib3VuY2UnXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUsIFRleHRCdWZmZXIgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgbWVzc2FnZUtleSwgbWVzc2FnZUtleUxlZ2FjeSB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTWVzc2FnZXNQYXRjaCwgTWVzc2FnZSwgTWVzc2FnZUxlZ2FjeSwgTGludGVyIH0gZnJvbSAnLi90eXBlcydcblxudHlwZSBMaW50ZXIkTWVzc2FnZSRNYXAgPSB7XG4gIGJ1ZmZlcjogP1RleHRCdWZmZXIsXG4gIGxpbnRlcjogTGludGVyLFxuICBjaGFuZ2VkOiBib29sZWFuLFxuICBkZWxldGVkOiBib29sZWFuLFxuICBtZXNzYWdlczogQXJyYXk8TWVzc2FnZSB8IE1lc3NhZ2VMZWdhY3k+LFxuICBvbGRNZXNzYWdlczogQXJyYXk8TWVzc2FnZSB8IE1lc3NhZ2VMZWdhY3k+XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2VSZWdpc3RyeSB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIG1lc3NhZ2VzOiBBcnJheTxNZXNzYWdlIHwgTWVzc2FnZUxlZ2FjeT47XG4gIG1lc3NhZ2VzTWFwOiBTZXQ8TGludGVyJE1lc3NhZ2UkTWFwPjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgZGVib3VuY2VkVXBkYXRlOiAoKCkgPT4gdm9pZCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMubWVzc2FnZXNNYXAgPSBuZXcgU2V0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5kZWJvdW5jZWRVcGRhdGUgPSBkZWJvdW5jZSh0aGlzLnVwZGF0ZSwgMTAwLCB0cnVlKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cbiAgc2V0KHsgbWVzc2FnZXMsIGxpbnRlciwgYnVmZmVyIH06IHsgbWVzc2FnZXM6IEFycmF5PE1lc3NhZ2UgfCBNZXNzYWdlTGVnYWN5PiwgbGludGVyOiBMaW50ZXIsIGJ1ZmZlcjogVGV4dEJ1ZmZlciB9KSB7XG4gICAgbGV0IGZvdW5kID0gbnVsbFxuICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5tZXNzYWdlc01hcCkge1xuICAgICAgaWYgKGVudHJ5LmJ1ZmZlciA9PT0gYnVmZmVyICYmIGVudHJ5LmxpbnRlciA9PT0gbGludGVyKSB7XG4gICAgICAgIGZvdW5kID0gZW50cnlcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIGZvdW5kLm1lc3NhZ2VzID0gbWVzc2FnZXNcbiAgICAgIGZvdW5kLmNoYW5nZWQgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWVzc2FnZXNNYXAuYWRkKHsgbWVzc2FnZXMsIGxpbnRlciwgYnVmZmVyLCBvbGRNZXNzYWdlczogW10sIGNoYW5nZWQ6IHRydWUsIGRlbGV0ZWQ6IGZhbHNlIH0pXG4gICAgfVxuICAgIHRoaXMuZGVib3VuY2VkVXBkYXRlKClcbiAgfVxuICB1cGRhdGUoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0geyBhZGRlZDogW10sIHJlbW92ZWQ6IFtdLCBtZXNzYWdlczogW10gfVxuXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLm1lc3NhZ2VzTWFwKSB7XG4gICAgICBpZiAoZW50cnkuZGVsZXRlZCkge1xuICAgICAgICByZXN1bHQucmVtb3ZlZCA9IHJlc3VsdC5yZW1vdmVkLmNvbmNhdChlbnRyeS5vbGRNZXNzYWdlcylcbiAgICAgICAgdGhpcy5tZXNzYWdlc01hcC5kZWxldGUoZW50cnkpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBpZiAoIWVudHJ5LmNoYW5nZWQpIHtcbiAgICAgICAgcmVzdWx0Lm1lc3NhZ2VzID0gcmVzdWx0Lm1lc3NhZ2VzLmNvbmNhdChlbnRyeS5vbGRNZXNzYWdlcylcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGVudHJ5LmNoYW5nZWQgPSBmYWxzZVxuICAgICAgaWYgKCFlbnRyeS5vbGRNZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gQWxsIG1lc3NhZ2VzIGFyZSBuZXcsIG5vIG5lZWQgdG8gZGlmZlxuICAgICAgICAvLyBOT1RFOiBObyBuZWVkIHRvIGFkZCAua2V5IGhlcmUgYmVjYXVzZSBub3JtYWxpemVNZXNzYWdlcyBhbHJlYWR5IGRvZXMgdGhhdFxuICAgICAgICByZXN1bHQuYWRkZWQgPSByZXN1bHQuYWRkZWQuY29uY2F0KGVudHJ5Lm1lc3NhZ2VzKVxuICAgICAgICByZXN1bHQubWVzc2FnZXMgPSByZXN1bHQubWVzc2FnZXMuY29uY2F0KGVudHJ5Lm1lc3NhZ2VzKVxuICAgICAgICBlbnRyeS5vbGRNZXNzYWdlcyA9IGVudHJ5Lm1lc3NhZ2VzXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBpZiAoIWVudHJ5Lm1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgICAvLyBBbGwgbWVzc2FnZXMgYXJlIG9sZCwgbm8gbmVlZCB0byBkaWZmXG4gICAgICAgIHJlc3VsdC5yZW1vdmVkID0gcmVzdWx0LnJlbW92ZWQuY29uY2F0KGVudHJ5Lm9sZE1lc3NhZ2VzKVxuICAgICAgICBlbnRyeS5vbGRNZXNzYWdlcyA9IFtdXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5ld0tleXMgPSBuZXcgU2V0KClcbiAgICAgIGNvbnN0IG9sZEtleXMgPSBuZXcgU2V0KClcbiAgICAgIGNvbnN0IG9sZE1lc3NhZ2VzID0gZW50cnkub2xkTWVzc2FnZXNcbiAgICAgIGxldCBmb3VuZE5ldyA9IGZhbHNlXG4gICAgICBlbnRyeS5vbGRNZXNzYWdlcyA9IFtdXG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBvbGRNZXNzYWdlcy5sZW5ndGg7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gb2xkTWVzc2FnZXNbaV1cbiAgICAgICAgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMikge1xuICAgICAgICAgIG1lc3NhZ2Uua2V5ID0gbWVzc2FnZUtleShtZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lc3NhZ2Uua2V5ID0gbWVzc2FnZUtleUxlZ2FjeShtZXNzYWdlKVxuICAgICAgICB9XG4gICAgICAgIG9sZEtleXMuYWRkKG1lc3NhZ2Uua2V5KVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gZW50cnkubWVzc2FnZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGVudHJ5Lm1lc3NhZ2VzW2ldXG4gICAgICAgIGlmIChuZXdLZXlzLmhhcyhtZXNzYWdlLmtleSkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIG5ld0tleXMuYWRkKG1lc3NhZ2Uua2V5KVxuICAgICAgICBpZiAoIW9sZEtleXMuaGFzKG1lc3NhZ2Uua2V5KSkge1xuICAgICAgICAgIGZvdW5kTmV3ID0gdHJ1ZVxuICAgICAgICAgIHJlc3VsdC5hZGRlZC5wdXNoKG1lc3NhZ2UpXG4gICAgICAgICAgcmVzdWx0Lm1lc3NhZ2VzLnB1c2gobWVzc2FnZSlcbiAgICAgICAgICBlbnRyeS5vbGRNZXNzYWdlcy5wdXNoKG1lc3NhZ2UpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFmb3VuZE5ldyAmJiBlbnRyeS5tZXNzYWdlcy5sZW5ndGggPT09IG9sZE1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgICAvLyBNZXNzYWdlcyBhcmUgdW5jaGFuZ2VkXG4gICAgICAgIHJlc3VsdC5tZXNzYWdlcyA9IHJlc3VsdC5tZXNzYWdlcy5jb25jYXQob2xkTWVzc2FnZXMpXG4gICAgICAgIGVudHJ5Lm9sZE1lc3NhZ2VzID0gb2xkTWVzc2FnZXNcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IG9sZE1lc3NhZ2VzLmxlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBvbGRNZXNzYWdlc1tpXVxuICAgICAgICBpZiAobmV3S2V5cy5oYXMobWVzc2FnZS5rZXkpKSB7XG4gICAgICAgICAgZW50cnkub2xkTWVzc2FnZXMucHVzaChtZXNzYWdlKVxuICAgICAgICAgIHJlc3VsdC5tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LnJlbW92ZWQucHVzaChtZXNzYWdlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdC5hZGRlZC5sZW5ndGggfHwgcmVzdWx0LnJlbW92ZWQubGVuZ3RoKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gcmVzdWx0Lm1lc3NhZ2VzXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1tZXNzYWdlcycsIHJlc3VsdClcbiAgICB9XG4gIH1cbiAgb25EaWRVcGRhdGVNZXNzYWdlcyhjYWxsYmFjazogKChkaWZmZXJlbmNlOiBNZXNzYWdlc1BhdGNoKSA9PiB2b2lkKSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuICBkZWxldGVCeUJ1ZmZlcihidWZmZXI6IFRleHRCdWZmZXIpIHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMubWVzc2FnZXNNYXApIHtcbiAgICAgIGlmIChlbnRyeS5idWZmZXIgPT09IGJ1ZmZlcikge1xuICAgICAgICBlbnRyeS5kZWxldGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRlYm91bmNlZFVwZGF0ZSgpXG4gIH1cbiAgZGVsZXRlQnlMaW50ZXIobGludGVyOiBMaW50ZXIpIHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMubWVzc2FnZXNNYXApIHtcbiAgICAgIGlmIChlbnRyeS5saW50ZXIgPT09IGxpbnRlcikge1xuICAgICAgICBlbnRyeS5kZWxldGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRlYm91bmNlZFVwZGF0ZSgpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==