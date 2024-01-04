import React from "react";
import Link from "next/link";

const Banner = () => {
  const category = [
    {
      name:"Housing",
      link: "/housing",
      worth: 4264.2383,
    },
    {
      name:"Office",
      link: "/office",
      worth: 6264.2383,
    },
    {
      name:"Farmhouse",
      link: "farmhouse",
      worth: 1264.2383,
    },
    {
      name:"Rental",
      link: "/rental",
      worth: 9264.2383,
    },
    {
      name:"Commercial",
      link: "/commercial",
      worth: 7264.2383,
    },
    {
      name:"Country",
      link: "/country",
      worth: 5264.2383,
    },
 
  ]
  return (
    <div class="banner-three slider-style-3 pt--70">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-5">
            <div class="wrapper">
              <div class="slider ">
                <div class="slider-thumbnail thumbnail-overlay">
                  <a href="product-details.html">
                    <img
                      class="w-100"
                      src="/portfolio/portfolio-11.jpg"
                      alt="NFT_portfolio"
                    />
                  </a>
                  <div class="read-wrapper">
                    <h5>
                      <a href="product-details.html">@Homzyy</a>
                    </h5>
                    <span>Join Membership</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="row g-4">
              {category.map((el, i) => (
                <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div class="slide-small-wrapper">
                    <div class="thumbnail thumbnail-overlay">
                      <Link href={{
                        pathname: `/category${el.link}`,
                        query: {name: `${el.name}`},
                      }}>
                        <img
                          class="w-100"
                          src={`/portfolio/portfolio-${i + 12}.jpg`}
                          alt="Nft_Profile"
                        />
                      </Link>
                    </div>
                    <div class="read-wrapper">
                      <h5 class="title">
                        <a href="#">{el.name}</a>
                      </h5>
                      <span>{el.worth} MATIC</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
