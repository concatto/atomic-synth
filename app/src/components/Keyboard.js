import React from 'react';
import range from 'lodash/range';
import { keys as getKeys } from '../logic/keymap';
import { toNote, asSharp, hasSharp } from '../logic/notes';
import Key from './Key';

class Keyboard extends React.Component {
  createKeys() {
    const { active = [] } = this.props;

    const width = this.props.width;
    const keys = getKeys().length;
    const keyWidth = width / keys;

    const components = [];

    for (const i of range(keys)) {
      const note = toNote(i);
      components.push(
        <Key width={keyWidth} left={i * keyWidth} key={note}
          pressed={active.includes(note)}/>
      );

      if (hasSharp(note) && i < keys - 1) {
        components.push(
          <Key width={keyWidth * 0.5} left={i * keyWidth + (keyWidth * 0.75)} key={asSharp(note)}
            pressed={active.includes(asSharp(note))} sharp/>
        );
      }
    }

    return components;
  }

  render() {
    return (
      <div className="keyboard" style={{width: this.props.width}}>
        {this.createKeys()}
      </div>
    );
  }
}

export default Keyboard;
