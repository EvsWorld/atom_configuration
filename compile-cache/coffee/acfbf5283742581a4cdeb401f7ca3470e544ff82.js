(function() {
  module.exports = function() {
    return atom.contextMenu.add({
      '.tree-view > .full-menu .file, .tree-view > .full-menu .directory': [
        {
          type: 'separator'
        }, {
          'label': 'Git',
          'submenu': [
            {
              label: 'Git add',
              'command': 'git-plus-context:add'
            }, {
              label: 'Git add + commit',
              'command': 'git-plus-context:add-and-commit'
            }, {
              label: 'Git checkout',
              'command': 'git-plus-context:checkout-file'
            }, {
              label: 'Git diff',
              'command': 'git-plus-context:diff'
            }, {
              label: 'Git diff branches',
              'command': 'git-plus-context:diff-branches'
            }, {
              label: 'Git diff branche files',
              'command': 'git-plus-context:diff-branch-files'
            }, {
              label: 'Git difftool',
              'command': 'git-plus-context:difftool'
            }, {
              label: 'Git pull',
              'command': 'git-plus-context:pull'
            }, {
              label: 'Git push',
              'command': 'git-plus-context:push'
            }, {
              label: 'Git push --set-upstream',
              'command': 'git-plus-context:push-set-upstream'
            }, {
              label: 'Git unstage',
              'command': 'git-plus-context:unstage-file'
            }
          ]
        }, {
          type: 'separator'
        }
      ],
      'atom-text-editor:not(.mini)': [
        {
          'label': 'Git add file',
          'command': 'git-plus:add'
        }
      ]
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvY29udGV4dC1tZW51LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUE7V0FDZixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQWpCLENBQXFCO01BQ25CLG1FQUFBLEVBQXFFO1FBQ25FO1VBQUUsSUFBQSxFQUFNLFdBQVI7U0FEbUUsRUFFbkU7VUFBQSxPQUFBLEVBQVMsS0FBVDtVQUNBLFNBQUEsRUFBVztZQUNUO2NBQ0UsS0FBQSxFQUFPLFNBRFQ7Y0FFRSxTQUFBLEVBQVcsc0JBRmI7YUFEUyxFQUtUO2NBQ0UsS0FBQSxFQUFPLGtCQURUO2NBRUUsU0FBQSxFQUFXLGlDQUZiO2FBTFMsRUFTVDtjQUNFLEtBQUEsRUFBTyxjQURUO2NBRUUsU0FBQSxFQUFXLGdDQUZiO2FBVFMsRUFhVDtjQUNFLEtBQUEsRUFBTyxVQURUO2NBRUUsU0FBQSxFQUFXLHVCQUZiO2FBYlMsRUFpQlQ7Y0FDRSxLQUFBLEVBQU8sbUJBRFQ7Y0FFRSxTQUFBLEVBQVcsZ0NBRmI7YUFqQlMsRUFxQlQ7Y0FDRSxLQUFBLEVBQU8sd0JBRFQ7Y0FFRSxTQUFBLEVBQVcsb0NBRmI7YUFyQlMsRUF5QlQ7Y0FDRSxLQUFBLEVBQU8sY0FEVDtjQUVFLFNBQUEsRUFBVywyQkFGYjthQXpCUyxFQTZCVDtjQUNFLEtBQUEsRUFBTyxVQURUO2NBRUUsU0FBQSxFQUFXLHVCQUZiO2FBN0JTLEVBaUNUO2NBQ0UsS0FBQSxFQUFPLFVBRFQ7Y0FFRSxTQUFBLEVBQVcsdUJBRmI7YUFqQ1MsRUFxQ1Q7Y0FDRSxLQUFBLEVBQU8seUJBRFQ7Y0FFRSxTQUFBLEVBQVcsb0NBRmI7YUFyQ1MsRUF5Q1Q7Y0FDRSxLQUFBLEVBQU8sYUFEVDtjQUVFLFNBQUEsRUFBVywrQkFGYjthQXpDUztXQURYO1NBRm1FLEVBaURuRTtVQUFFLElBQUEsRUFBTSxXQUFSO1NBakRtRTtPQURsRDtNQW9EbkIsNkJBQUEsRUFBK0I7UUFDN0I7VUFDRSxPQUFBLEVBQVMsY0FEWDtVQUVFLFNBQUEsRUFBVyxjQUZiO1NBRDZCO09BcERaO0tBQXJCO0VBRGU7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IC0+XG4gIGF0b20uY29udGV4dE1lbnUuYWRkIHtcbiAgICAnLnRyZWUtdmlldyA+IC5mdWxsLW1lbnUgLmZpbGUsIC50cmVlLXZpZXcgPiAuZnVsbC1tZW51IC5kaXJlY3RvcnknOiBbXG4gICAgICB7IHR5cGU6ICdzZXBhcmF0b3InfSxcbiAgICAgICdsYWJlbCc6ICdHaXQnLFxuICAgICAgJ3N1Ym1lbnUnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ0dpdCBhZGQnLFxuICAgICAgICAgICdjb21tYW5kJzogJ2dpdC1wbHVzLWNvbnRleHQ6YWRkJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdHaXQgYWRkICsgY29tbWl0JyxcbiAgICAgICAgICAnY29tbWFuZCc6ICdnaXQtcGx1cy1jb250ZXh0OmFkZC1hbmQtY29tbWl0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdHaXQgY2hlY2tvdXQnLFxuICAgICAgICAgICdjb21tYW5kJzogJ2dpdC1wbHVzLWNvbnRleHQ6Y2hlY2tvdXQtZmlsZSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnR2l0IGRpZmYnLFxuICAgICAgICAgICdjb21tYW5kJzogJ2dpdC1wbHVzLWNvbnRleHQ6ZGlmZidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnR2l0IGRpZmYgYnJhbmNoZXMnLFxuICAgICAgICAgICdjb21tYW5kJzogJ2dpdC1wbHVzLWNvbnRleHQ6ZGlmZi1icmFuY2hlcydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnR2l0IGRpZmYgYnJhbmNoZSBmaWxlcycsXG4gICAgICAgICAgJ2NvbW1hbmQnOiAnZ2l0LXBsdXMtY29udGV4dDpkaWZmLWJyYW5jaC1maWxlcydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnR2l0IGRpZmZ0b29sJyxcbiAgICAgICAgICAnY29tbWFuZCc6ICdnaXQtcGx1cy1jb250ZXh0OmRpZmZ0b29sJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdHaXQgcHVsbCcsXG4gICAgICAgICAgJ2NvbW1hbmQnOiAnZ2l0LXBsdXMtY29udGV4dDpwdWxsJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdHaXQgcHVzaCcsXG4gICAgICAgICAgJ2NvbW1hbmQnOiAnZ2l0LXBsdXMtY29udGV4dDpwdXNoJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdHaXQgcHVzaCAtLXNldC11cHN0cmVhbScsXG4gICAgICAgICAgJ2NvbW1hbmQnOiAnZ2l0LXBsdXMtY29udGV4dDpwdXNoLXNldC11cHN0cmVhbSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnR2l0IHVuc3RhZ2UnLFxuICAgICAgICAgICdjb21tYW5kJzogJ2dpdC1wbHVzLWNvbnRleHQ6dW5zdGFnZS1maWxlJ1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJ31cbiAgICBdLFxuICAgICdhdG9tLXRleHQtZWRpdG9yOm5vdCgubWluaSknOiBbXG4gICAgICB7XG4gICAgICAgICdsYWJlbCc6ICdHaXQgYWRkIGZpbGUnXG4gICAgICAgICdjb21tYW5kJzogJ2dpdC1wbHVzOmFkZCdcbiAgICAgIH1cbiAgICBdXG4gIH1cbiJdfQ==
