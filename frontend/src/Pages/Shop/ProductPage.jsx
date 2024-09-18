import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductPage = ({ onAddToCart }) => {
  const { id, productId } = useParams(); // shop ID and product ID from URL
  const [product, setProduct] = useState({});

  useEffect(() => {
    // Fetch product details
    const fetchProductDetails = async () => {
      try {
        const productResponse = await axios.get(`/api/userShops/${id}/products/${productId}`);
        setProduct(productResponse.data);
      } catch (error) {
        console.error('Failed to fetch product details', error);
      }
    };

    fetchProductDetails();
  }, [id, productId]);

  const handleAddToCart = () => {
    // Add the product to the cart using the parent function
    onAddToCart(product);
  };

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <img
            alt={product.name}
            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            src={product.image || 'https://dummyimage.com/400x400'} // Placeholder if no image
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">{product.brand || 'Brand Name'}</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product.name || 'Product Name'}</h1>
            <p className="leading-relaxed mb-4">{product.description || 'Product description goes here.'}</p>
            <p className="text-lg font-semibold">Price: LKR {product.pricePerKg?.toFixed(2) || '0.00'}</p>
            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              <div className="flex ml-6 items-center">
                <span className="mr-3">Size</span>
                <select className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10">
                  <option>500g</option>
                  <option>1Kg</option>
                  <option>2Kg</option>
                  <option>3Kg</option>
                </select>
              </div>
            </div>
            <div className="flex">
              <span className="title-font font-medium text-2xl text-gray-900">LKR {product.pricePerKg?.toFixed(2) || '0.00'}</span>
              <button
                onClick={handleAddToCart}
                className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
              >
                Add to Cart
              </button>
              <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                <svg
                  fill="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;