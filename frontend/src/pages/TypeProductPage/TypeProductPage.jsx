import React, { useEffect, useState } from 'react'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Breadcrumb, Pagination } from 'antd'
import { WrapperProducts, ParentCategory, ChildCategory } from './Style'
import { useLocation, useNavigate } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import * as CategoryService from '../../services/CategoryService'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import { slugify } from '../../utils'
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slide1 from '../../assets/images/banner1.jpg'
import slide2 from '../../assets/images/banner2.jpg'
import slide3 from '../../assets/images/banner3.jpg'
import slide4 from '../../assets/images/banner4.jpg'


const getIdFromPath = (pathname) => {
    const lastPart = pathname.split('/').pop();
    const id = lastPart.split('-').pop();
    return id;
};

const TypeProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const location = useLocation()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [isloading, setIsLoading] = useState(false)
    const [pagination, setPagination] = useState({
        page: 0,
        limit: 20,
        total: 1,
    })
    const [typeProduct, setTypeProduct] = useState([])

    const currentCategoryId = getIdFromPath(location.pathname);
    const currentCategory = typeProduct.find(cat => cat._id === currentCategoryId);

    const parentId = currentCategory?.parent
        ? (typeof currentCategory.parent === 'object'
            ? currentCategory.parent._id
            : currentCategory.parent)
        : currentCategory?._id;

    // Lấy danh mục cha cấp 1
    const topLevelCategories = typeProduct.filter(cat => !cat.parent);

    // Nếu có currentCategory thì lấy các danh mục cùng cha
    const siblingCategories = currentCategory
        ? typeProduct.filter(
            (item) =>
                (item.parent
                    ? (typeof item.parent === 'object'
                        ? item.parent._id
                        : item.parent)
                    : item._id) === parentId
        )
        : [];

    const productAfterSearch = products?.filter((pro) => {
        if (searchDebounce === '') return pro;
        return pro?.name?.toLowerCase().includes(searchDebounce?.toLocaleLowerCase());
    });

    const fetchAllTypeProduct = async () => {
        const res = await CategoryService.getAllCategories();
        if (res?.status === 'OK') {
            setTypeProduct(res.data || []);
        }
        return res;
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    const fetchProductByType = async (typeId, page, limit) => {
        setIsLoading(true)
        const res = await ProductService.getProductByType(typeId, page, limit)
        if (res?.status === 'OK') {
            setIsLoading(false)
            setProducts(res?.data)
            setPagination({ ...pagination, total: res?.totalPage })
        } else {
            setIsLoading(false)
        }
        return res
    }

    useEffect(() => {
        if (currentCategoryId) {
            fetchProductByType(currentCategoryId, pagination?.page, pagination?.limit)
        }
    }, [currentCategoryId, pagination?.page, pagination?.limit])

    const onChange = (current, pageSize) => {
        setPagination({ ...pagination, page: current - 1, limit: pageSize })
    }

    if (!typeProduct.length) return <div>Loading...</div>;

    const getCategoryPath = (category, allCategories) => {
        const path = [];
        let current = category;
        while (current) {
            path.unshift(current);
            if (!current.parent) break;
            current = allCategories.find(
                (cat) =>
                    (typeof current.parent === 'object'
                        ? current.parent._id
                        : current.parent) === cat._id
            );
        }
        return path;
    };

    const handleNavigateHome = () => {
        navigate('/');
    };

    const handleNavigateCategory = (cat) => {
        navigate(`/product/${slugify(cat.name)}-${cat._id}`, { state: cat._id });
    };

    const categoryPath = currentCategory ? getCategoryPath(currentCategory, typeProduct) : [];

    return (
        <LoadingComponent isPending={isloading}>
            <div style={{ maxWidth: '1270px', width: '100%', margin: '0 auto', padding: '0 16px' }}>
                <Breadcrumb style={{ background: 'transparent', padding: 0, marginBottom: 12, cursor: 'pointer' }}>
                    <Breadcrumb.Item onClick={handleNavigateHome}>Trang chủ</Breadcrumb.Item>
                    {categoryPath.map((cat) => (
                        <Breadcrumb.Item
                            key={cat._id}
                            onClick={() => handleNavigateCategory(cat)}
                            style={{ cursor: 'pointer' }}
                        >
                            {cat.name}
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            </div>

            <div className="typeproductpage-outer" style={{ width: '100%', background: '#efefef', minHeight: 'calc(100vh - 64px)' }}>
                <div className="typeproductpage-inner" style={{ width: '1270px', margin: '0 auto', minHeight: '100%', }}>
                    <div className="typeproductpage-typebar" style={{ maxWidth: '1270px', width: '100%', margin: '0 auto', padding: '0 16px' }}>
                        <SliderComponent arrImages={[slide1, slide2, slide3, slide4]} />

                        <div className="typeproduct-horizontal-scroll" 
                             style={{ overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap', paddingBottom: 8, marginTop: 20 }}>
                             
                            {/* Nếu chưa chọn category nào > hiển thị tất cả danh mục cha */}
                            {!currentCategory && topLevelCategories.map((cat) => (
                                <ParentCategory key={cat._id} onClick={() => handleNavigateCategory(cat)}>
                                    {cat.name}
                                </ParentCategory>
                            ))}

                            {/* Nếu đang trong category > hiển thị cha nổi bật + con */}
                            {currentCategory && siblingCategories.map((item) => {
                                const isParent = item._id === parentId;
                                return isParent ? (
                                    <ParentCategory key={item._id} onClick={() => handleNavigateCategory(item)}>
                                        {item.name}
                                    </ParentCategory>
                                ) : (
                                    <ChildCategory key={item._id} onClick={() => handleNavigateCategory(item)}>
                                        {item.name}
                                    </ChildCategory>
                                );
                            })}
                        </div>
                    </div>

                    <div className="typeproductpage-products" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <WrapperProducts>
                            {productAfterSearch.length > 0 ? productAfterSearch?.map((product) => (
                                <CardComponent
                                    key={product?._id}
                                    countInStock={product.countInStock}
                                    description={product.description}
                                    image={product.images?.[0]}
                                    name={product.name}
                                    price={product.price}
                                    rating={product.rating}
                                    type={product.type}
                                    sold={product.sold}
                                    discount={product.discount}
                                    id={product?._id}
                                />
                            )) : (
                                <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                                    <h3>Không có sản phẩm nào phù hợp với tìm kiếm của bạn</h3>
                                </div>
                            )}
                        </WrapperProducts>

                        <div className="typeproductpage-pagination" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <Pagination defaultCurrent={pagination?.page + 1} total={pagination?.total} onChange={onChange} />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 1270px) {
                    .typeproductpage-inner {
                        width: 100% !important;
                        padding: 0 8px;
                    }
                }
                @media (max-width: 1024px) {
                    .typeproductpage-inner {
                        width: 100% !important;
                        padding: 0 4px;
                    }
                    .typeproductpage-typebar {
                        padding: 0 4px;
                    }
                }
                @media (max-width: 768px) {
                    .typeproductpage-inner {
                        padding: 0 2px;
                    }
                    .typeproductpage-typebar {
                        padding: 0 2px;
                    }
                    .typeproductpage-products {
                        padding: 0 2px;
                    }
                    .typeproductpage-pagination {
                        padding: 0 2px;
                    }
                }
            `}</style>
        </LoadingComponent>
    )
}

export default TypeProductPage
