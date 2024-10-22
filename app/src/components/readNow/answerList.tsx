import React from "react";
import { AnswerListProps } from "../../types/types";
import readNowStyle from "../../css/readNow.module.css";
import { QUESTIONS } from "../../constants/constants";

const AnswerList: React.FC<AnswerListProps> = ({
  questionId,
  regDate,
  onClick,
}) => {
  const questionMessage =
    QUESTIONS.find((q) => q.id === questionId)?.message || "No message found";
  const handleClick = () => {
    onClick();
  };
  console.log("--");
  console.log(questionId);
  return (
    <div onClick={handleClick} className={readNowStyle.answerListContainr}>
      <div className={readNowStyle.answerListQuestion}>{questionMessage}</div>
      <div className={readNowStyle.answerListReqDate}>{regDate}</div>
    </div>
  );
};

export default AnswerList;
