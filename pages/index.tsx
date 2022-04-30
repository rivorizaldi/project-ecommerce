import React from "react";
import { client } from "../lib/client";
import { Product, FooterBanner, HeroBanner } from "../components";
import { GetServerSideProps } from "next";
import { IBanner, IProduct } from "../model";

interface IHomePage {
  productsData: Array<IProduct>;
  bannerData: Array<IBanner>;
}

const Home: React.FC<IHomePage> = ({ productsData, bannerData }) => {
  return (
    <>
      <HeroBanner heroBanner={bannerData[0]} />

      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>
      <div className="products-container">
        {productsData?.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>

      <FooterBanner footerBanner={bannerData[0]} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const productQuery = "*[_type == 'product']";
  const productsData = await client.fetch(productQuery);

  const bannerQuery = "*[_type == 'banner']";
  const bannerData = await client.fetch(bannerQuery);

  return { props: { productsData, bannerData } };
};

export default Home;
