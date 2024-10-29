import React, { useEffect, useRef, useState } from "react";
import styles from "../css/common.module.css";
import { useNavigate } from "react-router-dom";
import { UnderlinedWord, WordProps } from "../types/types";
import headerStyle from "../css/header.module.css";

interface OutcomeProps {
  question: string | undefined;
  message: string;
  images: UnderlinedWord[]; // 이미지 URL 배열
  endCallback: () => void;
}

const musicTracks = [
  "Allégro - Emmit Fenn.mp3",
  "Bittersweet Waltz - Sir Cubworth.mp3",
  "Bucolic Acrylic - Dan Bodan.mp3",
  "Ceremonial Library - Asher Fulero.mp3",
  "Heavenly - Aakash Gandhi.mp3",
  "Hopeful Freedom - Asher Fulero.mp3",
  "Lullaby - JVNA.mp3",
  "Maryandra's Waltz - Jesse Gallagher.mp3",
  "No.2 Remembering Her - Esther Abrami.mp3",
  "Snowfall Butterflies - Asher Fulero.mp3",
  "Summer Symphony Ball - Sir Cubworth.mp3",
];

const Outcome: React.FC<OutcomeProps> = ({
  question,
  message,
  images,
  endCallback,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sliderEnded, setSliderEnded] = useState(false); // 슬라이더 종료 상태를 추적
  const [showBlackScreen, setShowBlackScreen] = useState(false); // 검정 화면 표시 상태
  const audioRef = useRef<HTMLAudioElement | null>(new Audio()); // Audio 객체를 useRef로 관리
  const [currentBgmTitle, setCurrentBgmTitle] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false); // 오디오 상태 관리

  useEffect(() => {
    skipRandomMusic();
  }, []);
  useEffect(() => {
    if (images.length === 0) {
      setShowBlackScreen(true);
      const timeout = setTimeout(() => {
        pauseRandomMusic();
        endCallback();
      }, 10000);

      return () => clearTimeout(timeout); // 컴포넌트 언마운트 시 타이머 클리어
    }
    if (sliderEnded) {
      pauseRandomMusic();
      //endCallback();
      return;
    }

    const intervalTime = currentImageIndex === images.length - 1 ? 5000 : 3000; // 5초 또는 3초
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        if (nextIndex === 0) {
          setSliderEnded(true); // 배열의 마지막 이미지에 도달하면 슬라이더 종료 상태로 설정
        }
        return nextIndex;
      });
    }, intervalTime); // intervalTime에 따라 슬라이드 변경

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
  }, [images, sliderEnded]); // images, navigate, sliderEnded에 의존

  const getCurrentPosition = () => {
    if (images.length === 0) return 0;
    if (images.length === 1) return message.length;
    if (currentImageIndex === images.length - 1) {
      let image = images[currentImageIndex];
      return image.position + image.word.length;
    } else {
      return images[currentImageIndex + 1].position;
    }
  };

  const renderMessageWithColor = () => {
    const position = getCurrentPosition();
    const coloredText = message
      .slice(0, position)
      .replace(
        /./g,
        (char) =>
          `<span style="color: #FFFFFF;text-decoration: underline;text-decoration-color:#FFFFFF;text-underline-position: under;">${char}</span>`
      );
    const remainingText = message.slice(position); // 나머지 텍스트

    // 색칠된 텍스트와 나머지 텍스트를 합쳐서 반환
    return (
      <span dangerouslySetInnerHTML={{ __html: coloredText + remainingText }} />
    );
  };
  const pauseRandomMusic = () => {
    if (audioRef.current) {
      setIsPlaying(false);
      audioRef.current.pause();
    }
  };

  const muteMusic = () => {
    if (audioRef.current) {
      setIsPlaying(false);
      audioRef.current.pause();
    }
  };

  const playRandomMusic = () => {
    if (audioRef.current && !isPlaying) {
      setIsPlaying(true);
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const skipRandomMusic = () => {
    const randomIndex = Math.floor(Math.random() * musicTracks.length);
    const selectedTrack = `https://daqsct7lk85c0.cloudfront.net/public/bgm/${musicTracks[randomIndex]}`;
    setCurrentBgmTitle(musicTracks[randomIndex]);

    // Pause the current audio and reset its src
    if (audioRef.current) {
      audioRef.current.pause(); // Pause the current track
      audioRef.current.src = selectedTrack; // Set new source
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className={`${styles.outcome} ${headerStyle.outcome}`}>
      {showBlackScreen ? ( // 검정 화면 표시 여부에 따라 분기
        <div
          style={{
            backgroundColor: "black",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
          }}
        >
          <div className={headerStyle.header}>
            <header className={headerStyle.class}>
              <div className={headerStyle.logo}>
                <div className={headerStyle["text-wrapper"]}>{question}</div>
              </div>
            </header>
            <div id="editable" className={headerStyle.editable}>
              {message}
            </div>
            <div className={headerStyle.overlay}></div>
          </div>
        </div>
      ) : (
        <div className={styles.fullscreenContainer}>
          <div className={headerStyle.header}>
            <header className={headerStyle.class}>
              <div className={headerStyle.logo}>
                <div className={headerStyle["text-wrapper"]}>{question}</div>
              </div>
            </header>
            <div id="editable" className={headerStyle.editable}>
              {renderMessageWithColor()}
            </div>
            <div className={headerStyle.overlay}></div>
          </div>
          {images.length > 0 && (
            <img
              src={images[currentImageIndex].imageSrc}
              alt="Slideshow"
              className={styles.fullscreenImage}
            />
          )}
        </div>
      )}
      <div className={styles.musicWrapper}>
        <img src={"ic_music_mute.svg"} onClick={muteMusic} alt="Mute" />
        <img
          src={isPlaying ? "ic_music_pause.svg" : "ic_music_play.svg"}
          onClick={isPlaying ? pauseRandomMusic : playRandomMusic}
          alt={isPlaying ? "Pause" : "Play"}
        />
        <img src={"ic_music_skip.svg"} onClick={skipRandomMusic} alt="Skip" />
      </div>
    </div>
  );
};

export default Outcome;
