export interface WordsWithImagesProps {
  word: string;
  position: number;
  imageSrc: string;
}

export interface AnswerCardProps {
  questionId: number;
  message: string;
  regDate: string;
  onClick: () => void;
  wordsWithImages: WordsWithImagesProps[];
}

export interface ReadCardWithWordClickProps extends AnswerCardProps {
  //onWordClick: (event: React.MouseEvent, word: string) => void; // 단어 클릭 핸들러
  //selectedWord: string | null; // 선택된 단어
  onPlayBtnClick: (
    message: string,
    wordsWithImages: WordsWithImagesProps[]
  ) => void; // 추가
}

export interface AnswerListProps {
  questionId: number;
  regDate: string;
  onClick: () => void;
}

export type WordProps = {
  word: string;
  description: string;
  link: string;
  registDate: string;
};

export interface UnderlinedWord {
  word: string;
  position: number;
  imageSrc: string;
}
