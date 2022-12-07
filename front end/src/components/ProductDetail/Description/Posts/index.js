import React from 'react';
import PropTypes from 'prop-types';

function Posts(props) {
  const { content } = props;

  return (
    <>
      {!content ? (
        <h3 className="m-t-16">Đang cập nhật ...</h3>
      ) : (
        <>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </>
      )}
    </>
  );
}

Posts.propTypes = {
  content: PropTypes.string,
};

export default Posts;
