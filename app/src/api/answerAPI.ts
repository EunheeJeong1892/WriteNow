import { AnswerCardProps } from "../types/types"; // User 타입을 사용한다고 가정
import { UnderlinedWord } from "../types/types";

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

export const postAnswer = async (
  questionID: number,
  message: string,
  wordsWithImages: UnderlinedWord[]
) => {
  try {
    const response = await fetch(`${BASE_URL}/Answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionID,
        message,
        wordsWithImages,
      }),
    });

    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return false;
  }
};
