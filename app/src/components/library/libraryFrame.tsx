import React, { ReactNode, useRef, useState } from "react";
import { WordProps } from "../../types/types";
import libraryStyles from "../../css/library.module.css";

const LibraryFrame: React.FC<WordProps> = ({
  word,
  description,
  registDate,
  link,
}) => {
  const [showDescription, setShowDescription] = useState(false);

  const toggleDescription = () => {
    setShowDescription((prev) => !prev);
  };

  return (
    <div className={libraryStyles.frame}>
      <img
        className={libraryStyles.rectangle}
        alt="Rectangle"
        src={`https://daqsct7lk85c0.cloudfront.net/public/words/${link}`}
      />

      <div className={libraryStyles.content}>
        <div className={libraryStyles.content}>
          <div className={libraryStyles["text-wrapper"]}>{word}</div>
          {description &&
            (showDescription ? (
              <img
                className={libraryStyles["arrow-up"]}
                alt="설명 보기"
                onClick={toggleDescription}
                src={"ic_arrow_down.svg"}
              />
            ) : (
              <img
                className={libraryStyles["arrow-down"]}
                alt="설명 보기"
                onClick={toggleDescription}
                src={"ic_arrow_down.svg"}
              />
            ))}
        </div>
      </div>
      {showDescription && (
        <div
          className={`${libraryStyles.description} ${
            showDescription ? libraryStyles["description-expanded"] : ""
          }`}
        >
          {description}
        </div>
      )}
    </div>
  );
};

export default LibraryFrame;
