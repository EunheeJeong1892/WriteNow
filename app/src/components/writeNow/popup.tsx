import React, { useState } from "react";
import { PopupImageProps } from "../../types/types";
import styles from "../../css/common.module.css";

const Popup: React.FC<PopupImageProps> = ({ width, images, onImageChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    onImageChange(newIndex);
  };

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    onImageChange(newIndex);
  };

  return (
    <div className={styles.popup} style={{ width }}>
      <img
        src={`https://daqsct7lk85c0.cloudfront.net/public/words/${images[currentIndex]}`}
        alt={`Popup Image ${currentIndex + 1}`}
        className={styles.popupImage}
      />
      {images.length > 1 && (
        <div className={styles.popupButtons}>
          <svg
            onClick={handlePrevious}
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height="14"
            viewBox="0 0 7 14"
            fill="none"
          >
            <path
              d="M6.5 13L0.5 7L6.5 1"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>
            {currentIndex + 1} / {images.length}
          </span>
          <svg
            onClick={handleNext}
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height="14"
            viewBox="0 0 7 14"
            fill="none"
          >
            <path
              d="M0.5 1L6.5 7L0.5 13"
              stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Popup;
