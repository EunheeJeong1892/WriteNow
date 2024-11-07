export interface WordsWithImagesProps {
  word: string;
  position: number;
  imageSrc: string;
}

export interface AnswerCardProps {
  questionId: number;
  message: string;
  registDate: string;
  onClick: () => void;
  wordsWithImages: WordsWithImagesProps[];
}

export interface ReadCardWithWordClickProps extends AnswerCardProps {
  onPlayBtnClick: (
    message: string,
    wordsWithImages: WordsWithImagesProps[]
  ) => void; // 추가
  onWordClick: (word: string) => void;
}

export interface AnswerListProps {
  questionId: number;
  registDate: string;
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

export interface PopupImageProps {
  width: number;
  images: string[];
}
