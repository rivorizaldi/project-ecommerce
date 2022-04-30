import React from "react";
import Link from "next/link";
import { IProduct } from "../model";
import { urlFor } from "../lib/client";

interface IProductProps {
  product: IProduct;
}

const Product: React.FC<IProductProps> = ({ product }) => {
  return (
    <div>
      <Link href={`/product/${product?.slug?.current}`}>
        <div className="product-card">
          <img
            src={
              urlFor(product?.image && product?.image[0]) as unknown as string
            }
            width={250}
            height={250}
            className="product-image"
          />
          <p className="product-name">{product?.name}</p>
          <p className="product-price">Rp. {product?.price}</p>
        </div>
      </Link>
    </div>
  );
};

export default Product;
