import React, { useEffect, useRef, useState } from "react";
import styles from "../css/common.module.css";
import Header from "../components/Header";
import { Helmet } from "react-helmet-async";
import { WordProps } from "../types/types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { wordsAtom } from "../atoms";
import AddWordModal from "../components/Library/AddWordModal";
import { default as Frame } from "../components/Library/LibraryFrame";
import libraryStyles from "../css/library.module.css";
import { fetchWords } from "../api/libraryAPI";
import AddWordFrame from "../components/Library/AddWordFrame";

function Library() {
  const [inputText, setInputText] = useState<string>(""); // 상태로 텍스트 관리
  const inputRef = useRef<HTMLInputElement>(null);
  const setWordsAtom = useSetRecoilState(wordsAtom);
  const words = useRecoilValue(wordsAtom);
  const PAGE_SIZE = 25;
  const [filteredWords, setFilteredWords] = useState<WordProps[]>(words); // 필터된 이미지 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE); // 현재 보이는 이미지 수

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 처음 페이지가 로드될 때 words 데이터를 가져와서 Recoil 상태에 저장
  useEffect(() => {
    const getWords = async () => {
      const data = await fetchWords();
      setWordsAtom(data); // 데이터 가져와서 Recoil 상태에 저장
      setFilteredWords(data.slice(0, visibleCount));
    };

    if (words.length === 0) {
      getWords();
    } else {
      setFilteredWords(words.slice(0, visibleCount)); // wordsAtom에 값이 있을 경우 초기 20개로 설정
    }
  }, [setWordsAtom, words, visibleCount]); // `setWordsAtom`, `words`, `visibleCount`에 의존

  const handleInput = () => {
    const formatText = inputRef?.current?.innerText || "";
    setInputText(formatText);
    if (formatText !== "") {
      const filtered = words.filter((word) =>
        word.word.includes(formatText.trim())
      );
      setFilteredWords(filtered.slice(0, visibleCount)); // 필터링된 단어의 수에 맞게 설정
    } else {
      setFilteredWords(words.slice(0, visibleCount)); // 필터링된 단어의 수에 맞게 설정
    }
  };

  const loadMoreWords = () => {
    setVisibleCount((prevCount) => prevCount + PAGE_SIZE);
  };

  return (
    <>
      <Header
        showInput={true}
        inputRef={inputRef}
        onInputAction={handleInput}
      />
      <Helmet>
        <title>Library</title>
      </Helmet>
      <div className={styles.typeNowContainer}>
        <div className={libraryStyles["frame-screen"]}>
          {filteredWords.length > 0 &&
            filteredWords.map((word, index) => (
              <Frame
                key={index}
                word={word.word}
                description={word.description}
                link={word.link}
                registDate={word.registDate}
              ></Frame>
            ))}
          {(filteredWords.length === 0 || inputText.trim() !== "") && (
            <div onClick={openModal}>
              <AddWordFrame></AddWordFrame>
            </div>
          )}
        </div>
        {!inputText &&
          filteredWords.length < words.length && ( // 더보기 버튼 조건부 렌더링
            <div onClick={loadMoreWords} className={styles.loadMoreButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <line
                  y1="11"
                  x2="24"
                  y2="11"
                  stroke="#999999"
                  strokeWidth="2"
                />
                <line
                  x1="13"
                  y1="-4.37114e-08"
                  x2="13"
                  y2="24"
                  stroke="#999999"
                  strokeWidth="2"
                />
              </svg>
              더보기
            </div>
          )}
      </div>
      <div onClick={openModal} className={styles.floatAddBtn}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
        >
          <line y1="17" x2="36" y2="17" stroke="black" strokeWidth="2" />
          <line
            x1="19"
            y1="4.37114e-08"
            x2="19"
            y2="36"
            stroke="black"
            strokeWidth="2"
          />
        </svg>
      </div>
      <AddWordModal isOpen={isModalOpen} onClose={closeModal}></AddWordModal>
    </>
  );
}

export default Library;
