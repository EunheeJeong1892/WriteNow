import React from "react";
import libraryStyles from "../../css/library.module.css";

const AddWordFrame: React.FC = () => {
  return (
    <div className={libraryStyles.frame}>
      <div className={libraryStyles.addWordFrame}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="#A6A6A6"
        >
          <path
            d="M0 20C0 21.1879 0.993939 22.1576 2.15758 22.1576H17.8424V37.8424C17.8424 39.0061 18.8121 40 20 40C21.1879 40 22.1818 39.0061 22.1818 37.8424V22.1576H37.8424C39.0061 22.1576 40 21.1879 40 20C40 18.8121 39.0061 17.8182 37.8424 17.8182H22.1818V2.15758C22.1818 0.993939 21.1879 0 20 0C18.8121 0 17.8424 0.993939 17.8424 2.15758V17.8182H2.15758C0.993939 17.8182 0 18.8121 0 20Z"
            fill="#A6A6A6"
          />
        </svg>
      </div>
    </div>
  );
};

export default AddWordFrame;
