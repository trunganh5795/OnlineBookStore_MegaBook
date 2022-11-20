import { Avatar, Button, Comment, Rate } from 'antd';
import constants from '../../../../constants/index';
import helpers from '../../../../helpers';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

function UserComment(props) {
  const { commentDetail } = props;
  const { comment, value, user, createdAt } = commentDetail;
  const isReduceCmt = comment?.length >= 200 ? true : false;
  const [isMore, setIsMore] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState(false);
  // rendering ...
  return (
    <>
      {/* đăng nhập để nhận xét */}
      {loginRedirect && <Redirect to="/login" />}
      {/* Comment */}
      <Comment
        author={<b className="font-size-14px">{user.name}</b>}
        avatar={
          <Avatar
            src={user.img ? user.img : constants.DEFAULT_USER_AVT}
            alt={user.name}
          />
        }
        content={
          <>
            {value !== -1 && (
              <>
                <Rate
                  defaultValue={value}
                  // disabled
                  style={{ fontSize: 14 }}
                />
              </>
            )}

            <p className="t-justify m-tb-5">
              {isMore ? comment : comment?.slice(0, 200)}
              {isReduceCmt && (
                <Button type="link" onClick={() => setIsMore(!isMore)}>
                  {isMore ? 'Thu gọn' : 'Xem thêm'}
                </Button>
              )}
            </p>
            <div>
              <div className="feedback">
                {helpers.convertRateToText(value)}
              </div>
            </div>
          </>
        }
        datetime={<span>{helpers.formatDate(createdAt)}</span>}
      />
    </>
  );
}

UserComment.propTypes = {
  comment: PropTypes.object,
};

export default UserComment;
