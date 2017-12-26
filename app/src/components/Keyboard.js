import React from 'react';
import range from 'lodash/range';
import { keys as getKeys } from '../logic/keymap';
import Key from './Key';

class Keyboard extends React.Component {
  createKeys() {
    const width = 300;
    const keys = 7;
    const keyWidth = width / keys;

    return range(keys).map(i => (
      <Key width={keyWidth} left={i * keyWidth}/>
    ));
  }

  render() {
    return (
      <div className="keyboard">
        {this.createKeys()}
      </div>
    );
  }
}

export default Keyboard;
