import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import styles from "../css/common.module.css";
import { Helmet } from "react-helmet-async";
import Outcome from "../components/Outcome";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { progressBarVisibleAtom, wordsAtom } from "../atoms";
import { PopupImageProps, UnderlinedWord, WordProps } from "../types/types";
import { useNavigate } from "react-router-dom";
import { postAnswer } from "../api/answerAPI";
import Popup from "../components/WriteNow/Popup";

function WriteNow() {
  const inputRef = useRef<HTMLDivElement>(null);
  const displayMenuRef = useRef<HTMLDivElement>(null);
  const [popupImages, setPopupImages] = useState<PopupImageProps[]>([]);
  const [displayedWords, setDisplayedWords] = useState<Set<string>>(new Set());
  const [showOutcome, setShowOutcome] = useState<boolean>(false); // Outcome 표시 상태
  const wordList = useRecoilValue(wordsAtom);
  const [hasSubmitted, setHasSubmitted] = useState(false); // 방어 코드 추가
  const setProgressBarVisible = useSetRecoilState(progressBarVisibleAtom);
  const [underlinedWordsData, setUnderlinedWordsData] = useState<
    UnderlinedWord[]
  >([]); // 단어와 이미지 정보 저장

  const uniqueWords = (array: UnderlinedWord[]) => {
    const seen = new Set<string>();
    return array.filter((item) => {
      const word = item.word;
      if (seen.has(word)) {
        return false;
      }
      seen.add(word);
      return true;
    });
  };

  const submitAnswer = async (questionID: number) => {
    try {
      if (hasSubmitted) return;
      setProgressBarVisible(true);

      const message = inputRef.current?.innerText.trim() || "";
      const wordsWithImages = uniqueWords(
        underlinedWordsData.sort((a, b) => a.position - b.position)
      );

      const result = await postAnswer(questionID, message, wordsWithImages);

      if (result) {
        setHasSubmitted(true);
        setShowOutcome(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setProgressBarVisible(false); // Progress Bar 숨기기
    }
  };

  const handleInput = () => {
    if (!inputRef.current) return;
    if (inputRef.current.innerText === "") {
      clearData();
    } else {
      let formattedText = inputRef.current.innerText;
      const plainText = inputRef.current?.innerText || "";
      let newUnderlinedWordsData: UnderlinedWord[] = []; // 새로운 데이터를 담을 배열

      for (const item of wordList) {
        const regex = new RegExp(`(${item.word})`, "g");
        formattedText = formattedText.replace(
          regex,
          '<span style="border-bottom: 2px solid #007AFF;">$1</span>'
        );

        const wordPositions = [...plainText.matchAll(regex)].map(
          (match) => match.index
        );

        if (wordPositions.length > 0) {
          wordPositions.forEach((position) => {
            if (position !== undefined) {
              const currentImage =
                popupImages.find((popup) => popup.images.includes(item.link))
                  ?.images[0] || item.link;

              newUnderlinedWordsData.push({
                word: item.word,
                position,
                imageSrc: `https://daqsct7lk85c0.cloudfront.net/public/words/${currentImage}`, // 현재 활성화된 이미지 링크만 추가
              });
            }
          });
        }
      }

      setUnderlinedWordsData(newUnderlinedWordsData); // 새로운 데이터를 상태로 설정

      let originText = inputRef.current.innerText;
      const words = originText.split(/\s+/);
      words.forEach((word) => {
        const finded: WordProps[] | [] =
          wordList.filter((o) => o.word === word) || [];
        if (finded.length > 0 && !displayedWords.has(word)) {
          showPopupImage(word, finded);
          setDisplayedWords((prev) => new Set(prev).add(word));
        }
      });

      inputRef.current.innerHTML = formattedText;
      setCaretToEnd(inputRef.current);
    }
  };

  const clearData = () => {
    setPopupImages([]);
    setDisplayedWords(new Set());
    setUnderlinedWordsData([]);
  };

  const showPopupImage = (word: string, finded: WordProps[]) => {
    const randomWidth = Math.floor(Math.random() * (600 - 120 + 1)) + 120;

    setPopupImages((prev) => {
      const newImages: PopupImageProps = {
        images: finded.map((o) => o.link),
        width: randomWidth,
        currentIndex: 0,
        onImageChange: () => {},
      };
      return [...prev, newImages];
    });
  };

  const handleImageChange = (imageIndex: number, parentIndex: number) => {
    const updatedImages = [...popupImages];
    updatedImages[parentIndex] = {
      ...updatedImages[parentIndex],
      currentIndex: imageIndex,
    };
    setPopupImages(updatedImages); // Update the state with new image index
  };

  const setCaretToEnd = (el: HTMLElement) => {
    const range = document.createRange();
    const sel = window.getSelection();
    if (sel) {
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      el.focus();
    }
  };
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  const handleOutcomeEnd = () => {
    navigate("/readNow");
  };

  return (
    <>
      {showOutcome && (
        <Outcome
          images={underlinedWordsData}
          message={inputRef?.current?.innerText.trim() || ""}
          endCallback={handleOutcomeEnd}
          question={displayMenuRef.current?.innerText}
        />
      )}{" "}
      {/* Outcome 컴포넌트를 동적으로 렌더링 */}
      <Helmet>
        <title>Write Now</title>
      </Helmet>
      <Header
        showInput={true}
        onInputAction={handleInput}
        onSubmitAction={submitAnswer}
        inputRef={inputRef}
        displayMenuRef={displayMenuRef}
      ></Header>
      <div className={styles.typeNowContainer}>
        <div className={styles.popupContainer} id="popup">
          {popupImages.map((image, index) => (
            <Popup
              width={image.width}
              images={image.images}
              currentIndex={image.currentIndex || 0} // Pass currentIndex to Popup
              onImageChange={(imageIndex) =>
                handleImageChange(imageIndex, index)
              }
            ></Popup>
          ))}
        </div>
      </div>
    </>
  );
}

export default WriteNow;
