import { combineReducers } from 'redux';
import authReducer from './auth';
import cartsReducer from './carts';
import userReducer from './user';
import notificationsReducer from './notifications';
import recombeetoken from './recombeetoken';

const rootReducer = combineReducers({
  authenticate: authReducer.authReducer,
  user: userReducer.userReducer,
  carts: cartsReducer.cartReducer,
  notifications: notificationsReducer.notificationsReducer,
  recombeetoken: recombeetoken.recombeetokenReducer
});

export default rootReducer;
