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
          {/* <h2 className="m-t-16 m-b-8 font-weight-700">{content.title}</h2> */}
          {/* <p className="t-justify font-size-15px font-weight-500 desc-detail m-t-16">{content}</p> */}
          <div dangerouslySetInnerHTML={{ __html: content }} />
          {/* {content.desc &&
            content.desc.map((item, index) => (
              <div key={index}>
                <p className="t-justify font-size-15px font-weight-500 desc-detail">
                  {item.content}
                </p>
                <img
                  className="trans-margin"
                  style={{ maxHeight: 350, maxWidth: '100%' }}
                  src={item.photo}
                />
              </div>
            ))} */}
        </>
      )}
    </>
  );
}

Posts.propTypes = {
  content: PropTypes.string,
};

export default Posts;
