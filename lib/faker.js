'use babel';

import { CompositeDisposable } from 'atom';
import faker from 'faker';

function getFakerMethod(str) {
  const split = str.replace('faker.','').split('.');
  let method = faker;

  split.map(key => {
    if (key in method) {
      method = method[key];
    } else {
      return method;
    }
  });

  return method;
}

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'faker:create': () => this.createFake()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
  },

  createFake() {
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      const selection = editor.getSelectedText();
      let faked;
      if(selection.length) {
        let method = getFakerMethod(selection);
        if(typeof method !== 'function') {
          faked = 'Invalid!';
        } else {
          faked = method();
          faked = JSON.stringify(faked)
        }

        if(faked) {
          faked = faked.replace(/^"|"$/g, '');
        } else {
          faked = 'Invalid!';
        }

        editor.insertText(faked);
      } else {
        const ranges = editor.getSelectedBufferRanges();
        faked = faker.name.findName();
        let start, end;
        ranges.map(range => {
          [start, end] = [range.start, range.end];
          editor.setCursorBufferPosition(start);
          editor.insertText(faked);
          editor.setCursorBufferPosition([end.row, end.column + faked.length]);
        });
      }
    }
  }

};
