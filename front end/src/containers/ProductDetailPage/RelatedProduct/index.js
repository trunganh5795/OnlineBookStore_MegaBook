import productApi from '../../../apis/productApi';
import RelatedProductList from '../../../components/ProductDetail/RelatedProductList';
// import constants from '../../../constants/index';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function RelatedProduct(props) {
  const { id, type, brand, title, span, suggestionType } = props;
  const [productList, setProductList] = useState([]);
  const [recommId, setRecomId] = useState('');
  const isAuth = useSelector((state) => state.authenticate.isAuth);
  const userId = useSelector((state) => state.user.id);
  let { productId } = useParams();
  // Lấy ds sản phẩm
  useEffect(() => {
    let isSubscribe = true;
    async function getRelatedProducts() {
      try {
        let recommentList = {};
        if (suggestionType === 0) {
          recommentList = await productApi.getSimilarProducts(
            productId,
            userId,
          ); //sua 123 thanh userId
        } else {
          recommentList = await productApi.getAlsoBuy(productId, userId); //sua 123 thanh userId
        }
        setProductList(recommentList.recomms);
        setRecomId(recommentList.recommId);
      } catch (error) {
        throw error;
      }
    }
    if (isAuth != null) {
      if (isAuth) {
        if (userId) {
          getRelatedProducts(userId);
        }
      } else {
        getRelatedProducts();
      }
    }
    return () => {
      isSubscribe = false;
    };
  }, [isAuth, userId]);

  // rendering...
  return (
    <>
      {productList && productList.length > 0 && (
        <RelatedProductList
          isAuth
          span={span}
          list={productList}
          title={title}
          recommId={recommId}
          suggestionType={suggestionType}
        />
      )}
    </>
  );
}

RelatedProduct.defaultProps = {
  id: '',
  type: 0,
  brand: '',
  title: '',
  span: { span: 12, xs: 12, sm: 12, md: 8, lg: 8, xl: 6, xxl: 6 },
};

RelatedProduct.propTypes = {
  // loại, nhãn hiệu sản phẩm tương tự - sp đó
  id: PropTypes.number,
  type: PropTypes.number,
  brand: PropTypes.string,
  title: PropTypes.string,
  span: PropTypes.object,
};

export default RelatedProduct;
