import productApi from '../../apis/productApi';
import GlobalLoading from '../../components/Loading/Global';
import ProductDetail from '../../components/ProductDetail';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import trackingApi from '../../apis/tracking.api';

function ProductDetailPage() {
  const { productId, rcm, index, type } = useParams();
  // const { search } = useLocation();
  const [product, setProduct] = useState(false);
  const [isNotFoundProduct, setIsNotFoundProduct] = useState(false);
  const userId = useSelector((state) => state.user.id);
  // lấy sản phẩm
  useEffect(() => {
    let isSubscribe = true;
    const getProduct = async (id) => {
      try {
        const result = await productApi.getProduct(id);
        if (result && isSubscribe) {
          const { data } = result;
          if (data) {
            setProduct(data);
          } else {
            setIsNotFoundProduct(true);
          }
        }
      } catch (error) {
        if (isSubscribe) setIsNotFoundProduct(false);
      }
    };
    getProduct(productId);
    if (isSubscribe) setProduct(false);
    return () => (isSubscribe = false);
  }, [productId]);

  useEffect(() => {
    let clear = setTimeout(() => {
      productApi.sendProductView(productId, userId);
      if (rcm !== 'undefined' && index !== 'undefined' && type !== 'undefined')
        trackingApi.sendViewToElastic(rcm, index, type, productId);
    }, 3000);
    return () => {
      clearTimeout(clear);
    };
  });

  return (
    <>
      {product ? (
        <ProductDetail products={product} />
      ) : (
        <GlobalLoading content="Đang tải ..." />
        // Show Loading Icon
      )}
      {isNotFoundProduct && <Redirect to="/not-found" />}
    </>
  );
}

export default ProductDetailPage;
