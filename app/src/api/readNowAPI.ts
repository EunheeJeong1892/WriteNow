import { AnswerCardProps } from "../types/types"; // User 타입을 사용한다고 가정

const BASE_URL = "https://tqx65zlmb5.execute-api.ap-northeast-2.amazonaws.com";

export const fetchAnswers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/Answers`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    const sortedData = data.sort((a: AnswerCardProps, b: AnswerCardProps) => {
      return (
        new Date(b.registDate).getTime() - new Date(a.registDate).getTime()
      );
    });
    return sortedData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
