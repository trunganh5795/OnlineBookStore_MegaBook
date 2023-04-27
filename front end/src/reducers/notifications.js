//======= constant action type =======//
const ADD_NOTIFY = 'ADD_NOTIFY';
const CEALR_NOTIFY = 'CLEAR_NOTIFY';
//==============================///
const pushNotificationsAction = (notify) => {
  return {
    type: ADD_NOTIFY,
    payload: notify,
  };
};
const clearAllNotifications = () => {
  return {
    type: CEALR_NOTIFY,
  };
};
const initialState = [];
const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NOTIFY:
      let { payload } = action;
      let newNotify = {
        id: payload.id,
        avatar:
          'https://res.cloudinary.com/dsa-company/image/upload/v1660817761/unnamed_jmogkr.png',
        title: payload.msg,
        datetime: '2017-08-08',
        type: 'notification',
      };
      return [newNotify, ...state];
    case CEALR_NOTIFY:
      return [];
    default:
      return state;
  }
};
export default {
  notificationsReducer,
  pushNotificationsAction,
  clearAllNotifications,
};
