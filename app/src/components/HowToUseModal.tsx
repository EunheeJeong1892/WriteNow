import React, { ReactNode, useRef, useState } from "react";
import styles from "../css/common.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToUseModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={styles.introModal}>
        <div>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/r4BgjyPTzLk?si=l6Nq2ZviU1cS0JGu"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default HowToUseModal;
