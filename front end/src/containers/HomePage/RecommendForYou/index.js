import React, { useEffect, useState } from 'react';
import productApi from '../../../apis/productApi';
import RelatedProductList from '../../../components/ProductDetail/RelatedProductList';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
function RecommendForYou(props) {
    const { title, span } = props;
    const [productList, setProductList] = useState([]);
    const { id } = useSelector((state) => state.user);
    const isAuth = useSelector((state) => state.authenticate.isAuth);
    // Lấy ds sản phẩm
    useEffect(() => {
        let isSubscribe = true;  
        async function getRelatedProducts(id) {
            try {
                // recombee
                if ((isAuth === true && id) || (isAuth === false && !id)) {
                    const respone = await productApi.getHomepageProduct(id);
                    if (isSubscribe && isAuth != null) {
                        setProductList(respone.recomms);
                    }
                }
            } catch (error) {
                // console.log(error)
            }
        }

        if (id) {
            getRelatedProducts(id);
        } else {
            getRelatedProducts();
        }

        return () => {
            isSubscribe = false;
        };
    }, [isAuth, id]);

    // rendering...
    return (
        <>
            {productList && productList.length > 0 && (
                <RelatedProductList span={span} isAuth={isAuth} list={productList} title={title} />
            )}
        </>
    );
}

RecommendForYou.defaultProps = {
    span: { span: 12, xs: 12, sm: 12, md: 8, lg: 8, xl: 6, xxl: 6 },
};

RecommendForYou.propTypes = {
    span: PropTypes.object,
};

export default RecommendForYou;
