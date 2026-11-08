import React from "react";

const PictureCard = ({
  src,
  description,
  price,
}: {
  src: string;
  description: string;
  price: string;
}) => {
  return (
    <div className="card bg-base-200">
      <figure className="w-full overflow-hidden object-cover">
        <img src={src} alt="ear" />
      </figure>
      <div className="card-body items-center">
        <h2 className="card-title">{description} </h2>

        <span className="text-sm">${price}</span>

        <div className="card-actions justify-end"></div>
      </div>
    </div>
  );
};

export default PictureCard;
