import React from "react";
import Image from "next/image";

export default function BrandsMarquee() {
  const brands = [
    "Google", "Microsoft", "Zoho", "Shopify", "WordPress", "Meta", "Amazon", "Stripe"
  ];

  return (
    <section className="brands_marquee_section">
      <div className="brands_header">
        <h2>Brands we work with, to bring you Success.</h2>
      </div>
      <div className="marquee_wrapper">
        <div className="marquee_content">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="marquee_item">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
