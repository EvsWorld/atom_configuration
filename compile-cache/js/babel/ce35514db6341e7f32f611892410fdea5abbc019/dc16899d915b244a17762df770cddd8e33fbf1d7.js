Object.defineProperty(exports, "__esModule", {
  value: true
});

var Config = {
  getJson: function getJson(key) {
    var _default = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var value = atom.config.get("Hydrogen." + key);
    if (!value || typeof value !== "string") return _default;
    try {
      return JSON.parse(value);
    } catch (error) {
      var message = "Your Hydrogen config is broken: " + key;
      atom.notifications.addError(message, { detail: error });
    }
    return _default;
  },

  schema: {
    kernelspec: {},
    autocomplete: {
      title: "Enable Autocomplete",
      includeTitle: false,
      description: "If enabled, use autocomplete options provided by the current kernel.",
      type: "boolean",
      "default": true
    },
    autoScroll: {
      title: "Enable Autoscroll",
      includeTitle: false,
      description: "If enabled, Hydrogen will automatically scroll to the bottom of the result view.",
      type: "boolean",
      "default": true
    },
    outputAreaFontSize: {
      title: "Output area fontsize",
      includeTitle: false,
      description: "Change the fontsize of the Output area.",
      type: "integer",
      minimum: 0,
      "default": 0
    },
    debug: {
      title: "Enable Debug Messages",
      includeTitle: false,
      description: "If enabled, log debug messages onto the dev console.",
      type: "boolean",
      "default": false
    },
    startDir: {
      title: "Directory to start kernel in",
      includeTitle: false,
      description: "Restart the kernel for changes to take effect.",
      type: "string",
      "enum": [{
        value: "firstProjectDir",
        description: "The first started project's directory (default)"
      }, {
        value: "projectDirOfFile",
        description: "The project directory relative to the file"
      }, {
        value: "dirOfFile",
        description: "Current directory of the file"
      }],
      "default": "firstProjectDir"
    },
    kernelNotifications: {
      title: "Enable Kernel Notifications",
      includeTitle: false,
      description: "Notify if kernels writes to stdout. By default, kernel notifications are only displayed in the developer console.",
      type: "boolean",
      "default": false
    },
    gateways: {
      title: "Kernel Gateways",
      includeTitle: false,
      description: 'Hydrogen can connect to remote notebook servers and kernel gateways. Each gateway needs at minimum a name and a value for options.baseUrl. The options are passed directly to the `jupyter-js-services` npm package, which includes documentation for additional fields. Example value: ``` [{ "name": "Remote notebook", "options": { "baseUrl": "http://mysite.com:8888" } }] ```',
      type: "string",
      "default": "[]"
    },
    languageMappings: {
      title: "Language Mappings",
      includeTitle: false,
      description: 'Custom Atom grammars and some kernels use non-standard language names. That leaves Hydrogen unable to figure out what kernel to start for your code. This field should be a valid JSON mapping from a kernel language name to Atom\'s grammar name ``` { "kernel name": "grammar name" } ```. For example ``` { "scala211": "scala", "javascript": "babel es6 javascript", "python": "magicpython" } ```.',
      type: "string",
      "default": "{}"
    },
    startupCode: {
      title: "Startup Code",
      includeTitle: false,
      description: 'This code will be executed on kernel startup. Format: `{"kernel": "your code \\nmore code"}`. Example: `{"Python 2": "%matplotlib inline"}`',
      type: "string",
      "default": "{}"
    },
    outputAreaDock: {
      title: "Leave output dock open",
      description: "Do not close dock when switching to an editor without a running kernel",
      type: "boolean",
      "default": false
    },
    outputAreaDefault: {
      title: "View output in the dock by default",
      description: "If enabled, output will be displayed in the dock by default rather than inline",
      type: "boolean",
      "default": false
    },
    statusBarDisable: {
      title: "Disable the Hydrogen status bar",
      type: "boolean",
      "default": false
    }
  }
};

exports["default"] = Config;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsSUFBTSxNQUFNLEdBQUc7QUFDYixTQUFPLEVBQUEsaUJBQUMsR0FBVyxFQUF5QjtRQUF2QixRQUFnQix5REFBRyxFQUFFOztBQUN4QyxRQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsZUFBYSxHQUFHLENBQUcsQ0FBQztBQUNqRCxRQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRSxPQUFPLFFBQVEsQ0FBQztBQUN6RCxRQUFJO0FBQ0YsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFCLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxVQUFNLE9BQU8sd0NBQXNDLEdBQUcsQUFBRSxDQUFDO0FBQ3pELFVBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ3pEO0FBQ0QsV0FBTyxRQUFRLENBQUM7R0FDakI7O0FBRUQsUUFBTSxFQUFFO0FBQ04sY0FBVSxFQUFFLEVBQUU7QUFDZCxnQkFBWSxFQUFFO0FBQ1osV0FBSyxFQUFFLHFCQUFxQjtBQUM1QixrQkFBWSxFQUFFLEtBQUs7QUFDbkIsaUJBQVcsRUFDVCxzRUFBc0U7QUFDeEUsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxJQUFJO0tBQ2Q7QUFDRCxjQUFVLEVBQUU7QUFDVixXQUFLLEVBQUUsbUJBQW1CO0FBQzFCLGtCQUFZLEVBQUUsS0FBSztBQUNuQixpQkFBVyxFQUNULGtGQUFrRjtBQUNwRixVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7S0FDZDtBQUNELHNCQUFrQixFQUFFO0FBQ2xCLFdBQUssRUFBRSxzQkFBc0I7QUFDN0Isa0JBQVksRUFBRSxLQUFLO0FBQ25CLGlCQUFXLEVBQUUseUNBQXlDO0FBQ3RELFVBQUksRUFBRSxTQUFTO0FBQ2YsYUFBTyxFQUFFLENBQUM7QUFDVixpQkFBUyxDQUFDO0tBQ1g7QUFDRCxTQUFLLEVBQUU7QUFDTCxXQUFLLEVBQUUsdUJBQXVCO0FBQzlCLGtCQUFZLEVBQUUsS0FBSztBQUNuQixpQkFBVyxFQUFFLHNEQUFzRDtBQUNuRSxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7S0FDZjtBQUNELFlBQVEsRUFBRTtBQUNSLFdBQUssRUFBRSw4QkFBOEI7QUFDckMsa0JBQVksRUFBRSxLQUFLO0FBQ25CLGlCQUFXLEVBQUUsZ0RBQWdEO0FBQzdELFVBQUksRUFBRSxRQUFRO0FBQ2QsY0FBTSxDQUNKO0FBQ0UsYUFBSyxFQUFFLGlCQUFpQjtBQUN4QixtQkFBVyxFQUFFLGlEQUFpRDtPQUMvRCxFQUNEO0FBQ0UsYUFBSyxFQUFFLGtCQUFrQjtBQUN6QixtQkFBVyxFQUFFLDRDQUE0QztPQUMxRCxFQUNEO0FBQ0UsYUFBSyxFQUFFLFdBQVc7QUFDbEIsbUJBQVcsRUFBRSwrQkFBK0I7T0FDN0MsQ0FDRjtBQUNELGlCQUFTLGlCQUFpQjtLQUMzQjtBQUNELHVCQUFtQixFQUFFO0FBQ25CLFdBQUssRUFBRSw2QkFBNkI7QUFDcEMsa0JBQVksRUFBRSxLQUFLO0FBQ25CLGlCQUFXLEVBQ1QsbUhBQW1IO0FBQ3JILFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztLQUNmO0FBQ0QsWUFBUSxFQUFFO0FBQ1IsV0FBSyxFQUFFLGlCQUFpQjtBQUN4QixrQkFBWSxFQUFFLEtBQUs7QUFDbkIsaUJBQVcsRUFDVCxxWEFBcVg7QUFDdlgsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxJQUFJO0tBQ2Q7QUFDRCxvQkFBZ0IsRUFBRTtBQUNoQixXQUFLLEVBQUUsbUJBQW1CO0FBQzFCLGtCQUFZLEVBQUUsS0FBSztBQUNuQixpQkFBVyxFQUNULDJZQUEyWTtBQUM3WSxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLElBQUk7S0FDZDtBQUNELGVBQVcsRUFBRTtBQUNYLFdBQUssRUFBRSxjQUFjO0FBQ3JCLGtCQUFZLEVBQUUsS0FBSztBQUNuQixpQkFBVyxFQUNULDZJQUE2STtBQUMvSSxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLElBQUk7S0FDZDtBQUNELGtCQUFjLEVBQUU7QUFDZCxXQUFLLEVBQUUsd0JBQXdCO0FBQy9CLGlCQUFXLEVBQ1Qsd0VBQXdFO0FBQzFFLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztLQUNmO0FBQ0QscUJBQWlCLEVBQUU7QUFDakIsV0FBSyxFQUFFLG9DQUFvQztBQUMzQyxpQkFBVyxFQUNULGdGQUFnRjtBQUNsRixVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7S0FDZjtBQUNELG9CQUFnQixFQUFFO0FBQ2hCLFdBQUssRUFBRSxpQ0FBaUM7QUFDeEMsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7R0FDRjtDQUNGLENBQUM7O3FCQUVhLE1BQU0iLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuY29uc3QgQ29uZmlnID0ge1xuICBnZXRKc29uKGtleTogc3RyaW5nLCBfZGVmYXVsdDogT2JqZWN0ID0ge30pIHtcbiAgICBjb25zdCB2YWx1ZSA9IGF0b20uY29uZmlnLmdldChgSHlkcm9nZW4uJHtrZXl9YCk7XG4gICAgaWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHJldHVybiBfZGVmYXVsdDtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYFlvdXIgSHlkcm9nZW4gY29uZmlnIGlzIGJyb2tlbjogJHtrZXl9YDtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihtZXNzYWdlLCB7IGRldGFpbDogZXJyb3IgfSk7XG4gICAgfVxuICAgIHJldHVybiBfZGVmYXVsdDtcbiAgfSxcblxuICBzY2hlbWE6IHtcbiAgICBrZXJuZWxzcGVjOiB7fSxcbiAgICBhdXRvY29tcGxldGU6IHtcbiAgICAgIHRpdGxlOiBcIkVuYWJsZSBBdXRvY29tcGxldGVcIixcbiAgICAgIGluY2x1ZGVUaXRsZTogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgXCJJZiBlbmFibGVkLCB1c2UgYXV0b2NvbXBsZXRlIG9wdGlvbnMgcHJvdmlkZWQgYnkgdGhlIGN1cnJlbnQga2VybmVsLlwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICBhdXRvU2Nyb2xsOiB7XG4gICAgICB0aXRsZTogXCJFbmFibGUgQXV0b3Njcm9sbFwiLFxuICAgICAgaW5jbHVkZVRpdGxlOiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIklmIGVuYWJsZWQsIEh5ZHJvZ2VuIHdpbGwgYXV0b21hdGljYWxseSBzY3JvbGwgdG8gdGhlIGJvdHRvbSBvZiB0aGUgcmVzdWx0IHZpZXcuXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuICAgIG91dHB1dEFyZWFGb250U2l6ZToge1xuICAgICAgdGl0bGU6IFwiT3V0cHV0IGFyZWEgZm9udHNpemVcIixcbiAgICAgIGluY2x1ZGVUaXRsZTogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogXCJDaGFuZ2UgdGhlIGZvbnRzaXplIG9mIHRoZSBPdXRwdXQgYXJlYS5cIixcbiAgICAgIHR5cGU6IFwiaW50ZWdlclwiLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICB9LFxuICAgIGRlYnVnOiB7XG4gICAgICB0aXRsZTogXCJFbmFibGUgRGVidWcgTWVzc2FnZXNcIixcbiAgICAgIGluY2x1ZGVUaXRsZTogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogXCJJZiBlbmFibGVkLCBsb2cgZGVidWcgbWVzc2FnZXMgb250byB0aGUgZGV2IGNvbnNvbGUuXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBzdGFydERpcjoge1xuICAgICAgdGl0bGU6IFwiRGlyZWN0b3J5IHRvIHN0YXJ0IGtlcm5lbCBpblwiLFxuICAgICAgaW5jbHVkZVRpdGxlOiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlJlc3RhcnQgdGhlIGtlcm5lbCBmb3IgY2hhbmdlcyB0byB0YWtlIGVmZmVjdC5cIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBlbnVtOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB2YWx1ZTogXCJmaXJzdFByb2plY3REaXJcIixcbiAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgZmlyc3Qgc3RhcnRlZCBwcm9qZWN0J3MgZGlyZWN0b3J5IChkZWZhdWx0KVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB2YWx1ZTogXCJwcm9qZWN0RGlyT2ZGaWxlXCIsXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHByb2plY3QgZGlyZWN0b3J5IHJlbGF0aXZlIHRvIHRoZSBmaWxlXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHZhbHVlOiBcImRpck9mRmlsZVwiLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkN1cnJlbnQgZGlyZWN0b3J5IG9mIHRoZSBmaWxlXCJcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGRlZmF1bHQ6IFwiZmlyc3RQcm9qZWN0RGlyXCJcbiAgICB9LFxuICAgIGtlcm5lbE5vdGlmaWNhdGlvbnM6IHtcbiAgICAgIHRpdGxlOiBcIkVuYWJsZSBLZXJuZWwgTm90aWZpY2F0aW9uc1wiLFxuICAgICAgaW5jbHVkZVRpdGxlOiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIk5vdGlmeSBpZiBrZXJuZWxzIHdyaXRlcyB0byBzdGRvdXQuIEJ5IGRlZmF1bHQsIGtlcm5lbCBub3RpZmljYXRpb25zIGFyZSBvbmx5IGRpc3BsYXllZCBpbiB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUuXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBnYXRld2F5czoge1xuICAgICAgdGl0bGU6IFwiS2VybmVsIEdhdGV3YXlzXCIsXG4gICAgICBpbmNsdWRlVGl0bGU6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICdIeWRyb2dlbiBjYW4gY29ubmVjdCB0byByZW1vdGUgbm90ZWJvb2sgc2VydmVycyBhbmQga2VybmVsIGdhdGV3YXlzLiBFYWNoIGdhdGV3YXkgbmVlZHMgYXQgbWluaW11bSBhIG5hbWUgYW5kIGEgdmFsdWUgZm9yIG9wdGlvbnMuYmFzZVVybC4gVGhlIG9wdGlvbnMgYXJlIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgYGp1cHl0ZXItanMtc2VydmljZXNgIG5wbSBwYWNrYWdlLCB3aGljaCBpbmNsdWRlcyBkb2N1bWVudGF0aW9uIGZvciBhZGRpdGlvbmFsIGZpZWxkcy4gRXhhbXBsZSB2YWx1ZTogYGBgIFt7IFwibmFtZVwiOiBcIlJlbW90ZSBub3RlYm9va1wiLCBcIm9wdGlvbnNcIjogeyBcImJhc2VVcmxcIjogXCJodHRwOi8vbXlzaXRlLmNvbTo4ODg4XCIgfSB9XSBgYGAnLFxuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwiW11cIlxuICAgIH0sXG4gICAgbGFuZ3VhZ2VNYXBwaW5nczoge1xuICAgICAgdGl0bGU6IFwiTGFuZ3VhZ2UgTWFwcGluZ3NcIixcbiAgICAgIGluY2x1ZGVUaXRsZTogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ0N1c3RvbSBBdG9tIGdyYW1tYXJzIGFuZCBzb21lIGtlcm5lbHMgdXNlIG5vbi1zdGFuZGFyZCBsYW5ndWFnZSBuYW1lcy4gVGhhdCBsZWF2ZXMgSHlkcm9nZW4gdW5hYmxlIHRvIGZpZ3VyZSBvdXQgd2hhdCBrZXJuZWwgdG8gc3RhcnQgZm9yIHlvdXIgY29kZS4gVGhpcyBmaWVsZCBzaG91bGQgYmUgYSB2YWxpZCBKU09OIG1hcHBpbmcgZnJvbSBhIGtlcm5lbCBsYW5ndWFnZSBuYW1lIHRvIEF0b21cXCdzIGdyYW1tYXIgbmFtZSBgYGAgeyBcImtlcm5lbCBuYW1lXCI6IFwiZ3JhbW1hciBuYW1lXCIgfSBgYGAuIEZvciBleGFtcGxlIGBgYCB7IFwic2NhbGEyMTFcIjogXCJzY2FsYVwiLCBcImphdmFzY3JpcHRcIjogXCJiYWJlbCBlczYgamF2YXNjcmlwdFwiLCBcInB5dGhvblwiOiBcIm1hZ2ljcHl0aG9uXCIgfSBgYGAuJyxcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcInt9XCJcbiAgICB9LFxuICAgIHN0YXJ0dXBDb2RlOiB7XG4gICAgICB0aXRsZTogXCJTdGFydHVwIENvZGVcIixcbiAgICAgIGluY2x1ZGVUaXRsZTogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ1RoaXMgY29kZSB3aWxsIGJlIGV4ZWN1dGVkIG9uIGtlcm5lbCBzdGFydHVwLiBGb3JtYXQ6IGB7XCJrZXJuZWxcIjogXCJ5b3VyIGNvZGUgXFxcXG5tb3JlIGNvZGVcIn1gLiBFeGFtcGxlOiBge1wiUHl0aG9uIDJcIjogXCIlbWF0cGxvdGxpYiBpbmxpbmVcIn1gJyxcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcInt9XCJcbiAgICB9LFxuICAgIG91dHB1dEFyZWFEb2NrOiB7XG4gICAgICB0aXRsZTogXCJMZWF2ZSBvdXRwdXQgZG9jayBvcGVuXCIsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgXCJEbyBub3QgY2xvc2UgZG9jayB3aGVuIHN3aXRjaGluZyB0byBhbiBlZGl0b3Igd2l0aG91dCBhIHJ1bm5pbmcga2VybmVsXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBvdXRwdXRBcmVhRGVmYXVsdDoge1xuICAgICAgdGl0bGU6IFwiVmlldyBvdXRwdXQgaW4gdGhlIGRvY2sgYnkgZGVmYXVsdFwiLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiSWYgZW5hYmxlZCwgb3V0cHV0IHdpbGwgYmUgZGlzcGxheWVkIGluIHRoZSBkb2NrIGJ5IGRlZmF1bHQgcmF0aGVyIHRoYW4gaW5saW5lXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBzdGF0dXNCYXJEaXNhYmxlOiB7XG4gICAgICB0aXRsZTogXCJEaXNhYmxlIHRoZSBIeWRyb2dlbiBzdGF0dXMgYmFyXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb25maWc7XG4iXX0=