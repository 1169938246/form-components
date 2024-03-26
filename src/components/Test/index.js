import React from 'react';
import PropTypes from 'prop-types';


const Test = () => {
  return (
    <div>
      1111111111111111
    </div>
  );
};


Test.propTypes = {
  /**
   * 这是变颜色的
   */
  primary: PropTypes.string,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};


export default Test;
