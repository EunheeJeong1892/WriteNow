import React, { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import styles from "../css/common.module.css";
import { Helmet } from "react-helmet-async";
import Outcome from "../components/outcome";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { progressBarVisibleAtom, wordsAtom } from "../atoms";
import { UnderlinedWord, WordProps } from "../types/types";
import { useNavigate } from "react-router-dom";
import { postAnswer } from "../api/answerAPI";
import Popup from "../components/writeNow/popup";

interface PopupImage {
  images: string[];
  left: number;
  top: number;
}

function WriteNow() {
  const inputRef = useRef<HTMLDivElement>(null);
  const displayMenuRef = useRef<HTMLDivElement>(null);
  const [popupImages, setPopupImages] = useState<PopupImage[]>([]);
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
              newUnderlinedWordsData.push({
                word: item.word,
                position, // 단어가 시작하는 위치 (HTML을 제외한 실제 텍스트에서의 위치)
                imageSrc: `https://daqsct7lk85c0.cloudfront.net/public/words/${item.link}`, // 이미지 링크
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
    const randomX = Math.max(0, Math.random() * (window.innerWidth - 500));
    const randomY = Math.max(
      0,
      Math.random() * (window.innerHeight - 200) - 170
    );

    setPopupImages((prev) => {
      const baseLeft = randomX;
      const baseTop = randomY;

      const newImages: PopupImage = {
        images: finded.map((o) => o.link),
        left: baseLeft,
        top: baseTop,
      };
      return [...prev, newImages];
    });
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
        <div className="popup" id="popup">
          {popupImages.map((image, index) => (
            <Popup
              left={image.left}
              top={image.top}
              images={image.images}
            ></Popup>
          ))}
        </div>
      </div>
    </>
  );
}

export default WriteNow;
