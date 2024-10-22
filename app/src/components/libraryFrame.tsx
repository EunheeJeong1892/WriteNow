import React, { ReactNode, useRef, useState } from "react";
import { WordProps } from "../types/types";
import libraryStyles from "../css/library.module.css";

const LibraryFrame: React.FC<WordProps> = ({
  word,
  description,
  registDate,
  link,
}) => {
  return (
    <div className={libraryStyles.frame}>
      <img
        className={libraryStyles.rectangle}
        alt="Rectangle"
        src={`https://daqsct7lk85c0.cloudfront.net/public/words/${link}`}
      />

      <div className={libraryStyles.content}>
        <div className={libraryStyles["text-wrapper"]}>{word}</div>

        <img
          className={libraryStyles["SF-symbol-chevron"]}
          alt="Sf symbol chevron"
          src={"ic_arrow_down.svg"}
        />
      </div>
    </div>
  );
};

export default LibraryFrame;
