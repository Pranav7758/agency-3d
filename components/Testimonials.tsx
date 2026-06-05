"use client";
import React from "react";
import "../styles/components/testimonials.css";

const reviews = [
  {
    quote: "Digi Mirai turned our ideas into a stunning website that perfectly represents our brand. Their attention to detail and dedication were outstanding!",
    author: "Kamlesh Ghumare (Jugadu Kamlesh)",
    title: "Startup Founder"
  },
  {
    quote: "The team at Digi Mirai delivered an exceptional website that’s not only beautiful but also highly functional. Our online presence has never been stronger!",
    author: "CA Karishma Singhavi",
    title: "Chartered Accountant"
  },
  {
    quote: "Digi Mirai creative approach and technical expertise helped us build an online experience that truly connects with our audience. Highly recommended!",
    author: "Amit Sharma",
    title: "Marketing Manager"
  },
  {
    quote: "From concept to launch, Digi Mirai provided excellent service, and their digital marketing strategies helped us grow our brand quickly and efficiently.",
    author: "Suman Desai",
    title: "E-commerce Entrepreneur"
  },
  {
    quote: "Digi Mirai helped us build a modern, user-friendly website that perfectly aligns with our business goals. Their professionalism and commitment to excellence made the entire process smooth and enjoyable.",
    author: "Vikram Singh",
    title: "CEO of Tech Innovators"
  },
  {
    quote: "Working with Digi Mirai was a seamless experience. Their team listened to our needs and delivered a website that exceeded expectations.",
    author: "Karan Patel",
    title: "Creative Director"
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials_section" id="testimonials">
      <div className="testimonials_header">
        <h2>Testimonials</h2>
        <p>First impression, our clients</p>
      </div>

      <div className="testi_marquee_wrapper">
        <div className="testi_marquee_content">
          {[...reviews, ...reviews].map((review, idx) => (
            <div key={idx} className="testi_card">
              <div className="testi_stars">★★★★★</div>
              <p className="testi_quote">"{review.quote}"</p>
              <div className="testi_author">
                <h4>{review.author}</h4>
                <span>{review.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
