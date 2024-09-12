import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  id: number;
  title: string;
  contentType: string;
  releaseYear: number;
  rating: string;
  imageUrl: string;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  contentType,
  releaseYear,
  rating,
  imageUrl,
}) => {
  return (
    <Link href={`/content/${id}`}>
      <div
        style={cardStyle}
        className="card-bg shadow-md shadow-violet-500/40 hover:shadow-lg hover:shadow-violet-700 w-full max-w-72"
      >
        <Image
          src={imageUrl}
          alt={title}
          width={300}
          height={200}
          style={{ borderRadius: "8px", marginBottom: "16px" }}
          className="h-44 w-full"
        />
        <h2 className="line-clamp-1"> {title}</h2>
        <p className="flex justify-between mt-1">
          <span>
            <span className="text-base font-extralight">{releaseYear} </span>
            <span className="text-base font-extralight">{rating}</span>
          </span>
          <span className="text-base outline-1 outline outline-violet-400 rounded-xl px-2 py-0.5">
            {contentType}
          </span>
        </p>
      </div>
    </Link>
  );
};

const cardStyle: React.CSSProperties = {
  borderRadius: "8px",
  color: "white",
  padding: "10px",
  margin: "10px",
  //   maxWidth: "350px",
};

export default Card;
