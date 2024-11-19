import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { WordsWithImagesProps } from "../types/types";
import { Helmet } from "react-helmet-async";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { answersAtom, progressBarVisibleAtom } from "../atoms";
import Outcome from "../components/Outcome";
import AnswerCard from "../components/ReadNow/AnswerCard";
import { fetchAnswers } from "../api/answerAPI";
import { QUESTIONS } from "../constants/Constants";
import readNowStyles from "../css/readNow.module.css";

function ReadNow() {
  const cards = useRecoilValue(answersAtom);
  const [showOutcome, setShowOutcome] = useState<boolean>(false); // Outcome 표시 상태
  const [outcomeData, setOutcomeData] = useState<{
    message: string;
    wordsWithImages: WordsWithImagesProps[];
  } | null>(null); // 추가
  const setAnswerList = useSetRecoilState(answersAtom);
  const setProgressBarVisible = useSetRecoilState(progressBarVisibleAtom);

  const handleGoToRandomCard = (word: string) => {
    const filteredCards = cards
      .map((card, index) => ({ ...card, index })) // 각 카드에 인덱스를 포함
      .filter((card) => card.message.includes(word));

    // 필터링된 카드가 없을 경우 종료
    if (filteredCards.length === 0) {
      console.log(`No card found with the word: ${word}`);
      return;
    }

    // 필터링된 카드 중 랜덤 인덱스 선택
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    const selectedCard = filteredCards[randomIndex];

    // 선택된 카드의 인덱스에서 handleCardClick 호출
    handleCardClick(selectedCard.index);
  };

  // 카드 클릭 핸들러
  const handleCardClick = (id: number) => {
    setProgressBarVisible(true);

    setTimeout(() => {
      setProgressBarVisible(false);
      setCurrentPostIndex(id);
    }, 1000);
  };

  useEffect(() => {
    const getAnswers = async () => {
      const data = await fetchAnswers();
      setAnswerList(data);
    };

    getAnswers(); // 데이터 가져오기
  }, [setAnswerList, cards]);

  const handlePlayBtnClick = (
    message: string,
    wordsWithImages: WordsWithImagesProps[]
  ) => {
    setShowOutcome(true);
    setOutcomeData({ message, wordsWithImages });
  };

  const handleOutcomeEnd = () => {
    setShowOutcome(false);
  };

  const [currentPostIndex, setCurrentPostIndex] = useState(0);

  const handlePostClick = (index: number) => {
    setCurrentPostIndex(index);
  };

  const getQuestionText = () => {
    return (
      QUESTIONS.find((q: any) => q.id === cards[currentPostIndex].questionID)
        ?.message || "No message found"
    );
  };
  return (
    <div className={readNowStyles.readNowContainer}>
      {showOutcome && outcomeData && (
        <Outcome
          images={outcomeData.wordsWithImages}
          message={outcomeData.message}
          endCallback={handleOutcomeEnd}
          question={getQuestionText()}
        />
      )}{" "}
      <Header showInput={false} />
      <Helmet>
        <title>Read Now</title>
      </Helmet>
      <div>
        {currentPostIndex > 0 && (
          <div
            className={readNowStyles.prev}
            onClick={() => {
              handlePostClick(currentPostIndex - 1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.05897 0.828859L8.91392 7.5901C9.02869 7.78028 9.02869 8.01458 8.91392 8.20476C8.79431 8.3929 8.57863 8.50544 8.34853 8.4998L0.638621 8.4998C0.411778 8.49976 0.201768 8.38529 0.0860776 8.19861C-0.0286926 8.00844 -0.0286926 7.77413 0.0860776 7.58396L3.94103 0.822712C4.05319 0.623917 4.27029 0.5 4.50642 0.5C4.74256 0.5 4.95966 0.623917 5.07182 0.822712L5.05897 0.828859Z"
                fill="black"
              />
            </svg>
            prev
          </div>
        )}
        {cards.length > 0 && (
          <AnswerCard
            questionId={cards[currentPostIndex].questionID}
            message={cards[currentPostIndex].message}
            registDate={cards[currentPostIndex].registDate}
            wordsWithImages={cards[currentPostIndex].wordsWithImages}
            onPlayBtnClick={handlePlayBtnClick}
            onWordClick={handleGoToRandomCard}
            onClick={() => {
              return true;
            }}
          ></AnswerCard>
        )}
        {currentPostIndex < cards.length - 1 && (
          <div
            className={readNowStyles.next}
            onClick={() => {
              handlePostClick(currentPostIndex + 1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.94103 8.17114L0.0860777 1.4099C-0.0286932 1.21972 -0.0286932 0.985414 0.0860777 0.795238C0.205693 0.607103 0.421371 0.494558 0.65147 0.500202L8.36138 0.500203C8.58822 0.500241 8.79823 0.614714 8.91392 0.801385C9.02869 0.991561 9.02869 1.22587 8.91392 1.41604L5.05897 8.17729C4.94681 8.37608 4.72971 8.5 4.49357 8.5C4.25744 8.5 4.04034 8.37608 3.92818 8.17729L3.94103 8.17114Z"
                fill="black"
              />
            </svg>
            next
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadNow;
