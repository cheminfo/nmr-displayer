import { jsx } from '@emotion/core';
/** @jsx jsx */
import { Fragment } from 'react';

const Button = ({ onClick, ...props }) => {
  return (
    <Fragment>
      <button type="button" onClick={onClick} {...props} />
    </Fragment>
  );
};

export default Button;
