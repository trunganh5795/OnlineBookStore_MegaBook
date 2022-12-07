import React from 'react';
import './index.scss';
import logoUrl from '../../assets/imgs/logo.png';

function FooterView() {
  return (
    <div className="container-fluid bg-white footer p-lr-0" id="footer">
      {/* Liên hệ */}
      <div className="footer-contact p-tb-16">
        <div className="container d-flex justify-content-between align-i-center">
          {/* <PhoneOutlined className="phone-icon" /> */}
          <div className="hover_shine">
            <figure>
              {' '}
              <img src={logoUrl} width={112} alt="logo" />
            </figure>
          </div>
          <div className="d-flex flex-direction-column">
            <h2 className="footer-contact-item">magabook.shop</h2>
          </div>
        </div>
        <div className="p-lr-10 w-100 container">
          <p style={{ color: 'red' }}>
            These product pictures are used for school project purpose only. Any
            copyright issues, feel free and send me feedback by clicking on
            button which at bottom right of page. I will delete it immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FooterView;
