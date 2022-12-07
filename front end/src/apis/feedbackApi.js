import db from '../configs/firebase.config';
import { collection, addDoc } from 'firebase/firestore';
const colectionFeedBack = collection(db, 'feedback');
const feedbackApi = {
  sendFeedback: (text, message) => {
    addDoc(colectionFeedBack, {
      text,
    })
      .then((result) => message.success('Cảm ơn bạn rất nhiều'))
      .catch((e) => message.error('Xảy ra lỗi rồi'));
  },
};

export default feedbackApi;
