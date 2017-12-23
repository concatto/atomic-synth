import React from 'react';
import classnames from 'classnames';

const Key = ({left, width, sharp = false, pressed = false}) => {
  const keyClass = classnames("key", {
    "sharp": sharp,
    "pressed": pressed,
  });

  return (
    <div className={keyClass} style={{left, width}}>

    </div>
  );
};

export default Key;
