import React, { useState } from "react";
import { urlFor, client } from "../../lib/client";
import { GetStaticProps, GetStaticPaths } from "next";
import { IProduct } from "../../model";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { Product } from "../../components";

interface IProductDetail {
  productsData: Array<IProduct>;
  productData: IProduct;
}
import { useStateContext } from "../../context/StateContext";

const ProductDetails = ({ productData, productsData }: IProductDetail) => {
  const { image, name, details, price } = productData;
  const [index, setIndex] = useState(0);
  const { addQty, reduceQty, qty, addCart, setShowCart } = useStateContext();

  const handleBuyNow = () => {
    addCart(productData, qty);
    setShowCart(true);
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[index]) as unknown as string}
              className="product-detail-image"
            />
          </div>

          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item) as unknown as string}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details</h4>
          <p>{details}</p>
          <p className="price">Rp.{price}</p>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={reduceQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={addQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => {
                addCart(productData, qty);
              }}
            >
              Add To Cart
            </button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {productsData?.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const productsQuery = `*[_type == 'product']`;
  const productQuery = `*[_type == 'product' && slug.current == '${params?.slug}'][0]`;

  const productsData = await client.fetch(productsQuery);
  const productData = await client.fetch(productQuery);

  return { props: { productsData, productData } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == 'product'] {
    slug {
      current
    }
  }
  `;

  const products = await client.fetch(query);

  const paths = products?.map((product: IProduct) => ({
    params: { slug: product?.slug?.current },
  }));

  return { paths, fallback: "blocking" };
};

export default ProductDetails;
