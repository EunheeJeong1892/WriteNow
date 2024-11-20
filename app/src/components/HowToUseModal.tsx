import React from "react";
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
        <video
          src="https://daqsct7lk85c0.cloudfront.net/public/howToUse.mp4" // 동영상 파일 URL
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
          playsInline
          controls
          muted={true}
        ></video>
      </div>
    </div>
  );
};

export default HowToUseModal;
