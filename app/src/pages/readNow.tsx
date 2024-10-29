import React, { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import { WordsWithImagesProps } from "../types/types";
import { Helmet } from "react-helmet-async";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { answersAtom } from "../atoms";
import Outcome from "../components/outcome";
import AnswerList from "../components/readNow/answerList";
import AnswerCard from "../components/readNow/answerCard";
import { fetchAnswers } from "../api/readNowAPI";
import { QUESTIONS } from "../constants/constants";
import readNowStyles from "../css/readNow.module.css";

function ReadNow() {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null); // 추가된 상태
  const cards = useRecoilValue(answersAtom);
  const [showOutcome, setShowOutcome] = useState<boolean>(false); // Outcome 표시 상태
  const [outcomeData, setOutcomeData] = useState<{
    message: string;
    wordsWithImages: WordsWithImagesProps[];
  } | null>(null); // 추가
  const setAnswerList = useSetRecoilState(answersAtom);

  // 카드 클릭 핸들러
  const handleCardClick = (id: number) => {
    setSelectedCardId(id); // 클릭된 카드의 ID를 상태로 설정
  };

  useEffect(() => {
    const getAnswers = async () => {
      const data = await fetchAnswers();
      setAnswerList(data);
    };

    if (cards.length === 0) {
      getAnswers(); // 데이터 가져오기
    }
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

  const previousPost =
    currentPostIndex > 0 ? cards[currentPostIndex - 1] : null;
  const nextCards = cards.slice(currentPostIndex + 1, currentPostIndex + 3);

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
        {previousPost && (
          <AnswerList
            questionId={previousPost.questionID}
            registDate={previousPost.registDate}
            onClick={() => handlePostClick(currentPostIndex - 1)}
          ></AnswerList>
        )}
        {cards.length > 0 && (
          <AnswerCard
            questionId={cards[currentPostIndex].questionID}
            message={cards[currentPostIndex].message}
            registDate={cards[currentPostIndex].registDate}
            wordsWithImages={cards[currentPostIndex].wordsWithImages}
            onPlayBtnClick={handlePlayBtnClick}
            onClick={() => {
              return true;
            }}
          ></AnswerCard>
        )}
        <div>
          {nextCards.map((card, index) => (
            <AnswerList
              questionId={card.questionID}
              registDate={card.registDate}
              onClick={() => handlePostClick(currentPostIndex + index + 1)}
            ></AnswerList>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReadNow;
