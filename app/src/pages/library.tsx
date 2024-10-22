import React, { useEffect, useRef, useState } from "react";
import styles from "../css/common.module.css";
import Header from "../components/header";
import { Helmet } from "react-helmet-async";
import { WordProps } from "../types/types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { wordsAtom } from "../atoms";
import AddWordModal from "../components/addWordModal";
import { default as Frame } from "../components/libraryFrame";
import libraryStyles from "../css/library.module.css";

function Library() {
  const [inputText, setInputText] = useState<string>(""); // 상태로 텍스트 관리
  const searchDiv = useRef<HTMLInputElement>(null);
  const setWordsAtom = useSetRecoilState(wordsAtom);
  const words = useRecoilValue(wordsAtom);
  const [filteredWords, setFilteredWords] = useState<WordProps[]>(words); // 필터된 이미지 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(28); // 현재 보이는 이미지 수
  const [isFocused, setIsFocused] = useState<boolean>(false); // 포커스 상태

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value); // 입력된 값을 상태로 설정
  };

  useEffect(() => {
    checkText();
  }, [inputText]);

  // 처음 페이지가 로드될 때 words 데이터를 가져와서 Recoil 상태에 저장
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(
          "https://gpzyo7nv2d.execute-api.ap-northeast-2.amazonaws.com/ReadNow"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setWordsAtom(data); // 데이터 가져와서 Recoil 상태에 저장
        setFilteredWords(data.slice(0, visibleCount)); // 초기 20개 필터된 단어로 설정
      } catch (error) {
        console.error("Error loading words:", error);
      }
    };

    if (words.length === 0) {
      fetchWords(); // 데이터 가져오기
    } else {
      setFilteredWords(words.slice(0, visibleCount)); // wordsAtom에 값이 있을 경우 초기 20개로 설정
    }
  }, [setWordsAtom, words, visibleCount]); // `setWordsAtom`, `words`, `visibleCount`에 의존

  const checkText = () => {
    const filtered = words.filter((word) =>
      word.word.includes(inputText.trim())
    );
    setFilteredWords(filtered.slice(0, visibleCount)); // 필터링된 단어의 수에 맞게 설정
  };

  const loadMoreWords = () => {
    setVisibleCount((prevCount) => prevCount + 28);
  };

  return (
    <>
      <Header />
      <Helmet>
        <title>Library</title>
      </Helmet>
      <div className={styles.typeNowContainer}>
        {/*}
        <div className={styles.liveNowSearchWrapper}>
          <input
            type={"text"}
            onChange={handleInput}
            placeholder={`검색어를 입력하세요.`}
            ref={searchDiv}
            className={`${styles.liveNowSearch} ${
              inputText ? styles.liveNowSearchActive : ""
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {(isFocused || inputText) && (
            <div className={styles.searchIcon}>
              <img src={"ic_search.png"} alt="Search" />
            </div>
          )}
        </div>
        */}
        <div className={libraryStyles["frame-screen"]}>
          {filteredWords.length > 0 &&
            filteredWords.map((word, index) => (
              <Frame
                word={word.word}
                description={word.description}
                link={word.link}
                registDate={word.registDate}
              ></Frame>
            ))}
          {filteredWords.length === 0 && (
            <p className={styles.noContent}>
              아직 등록되지 않은 단어입니다.
              <br />
              아래의 + 버튼을 눌러 처음으로 단어를 등록해보세요!
            </p>
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
