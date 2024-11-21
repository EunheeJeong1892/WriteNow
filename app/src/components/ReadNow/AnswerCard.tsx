import React, { useRef } from "react";
import styles from "../../css/common.module.css";
import { ReadCardWithWordClickProps } from "../../types/types";
import { QUESTIONS } from "../../constants/Constants";
import readNowStyle from "../../css/readNow.module.css";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";
import {
  setPosId,
  printText,
  checkPrinterStatus,
  cutPaper,
  getPosData,
  setCharacterset,
} from "../../printer/bxlpos";
import { requestPrint } from "../../printer/bxlcommon";

const AnswerCard: React.FC<ReadCardWithWordClickProps> = ({
  questionId,
  message,
  registDate,
  onClick,
  wordsWithImages,
  onPlayBtnClick,
  onWordClick,
}) => {
  const questionMessage =
    QUESTIONS.find((q) => q.id === questionId)?.message || "No message found";
  const formattedDate = dayjs().format("YYYY-MM-DD");
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  const renderMessageWithImages = () => {
    if (!wordsWithImages) return message;

    const result: JSX.Element[] = [];
    let lastIndex = 0;

    wordsWithImages.forEach((wordWithImage, index) => {
      const { word, position, imageSrc } = wordWithImage;

      // 단어의 시작 위치가 lastIndex보다 크면 중간 텍스트를 추가
      if (position > lastIndex) {
        const textBefore = message.slice(lastIndex, position); // 이미지가 없는 중간 텍스트
        result.push(<span key={`text-${lastIndex}`}>{textBefore}</span>);
      }

      // 언더라인 처리된 단어 추가
      result.push(
        <span key={`word-${index}`} className={styles.wordWithImage}>
          <span
            onClick={() => onWordClick(word)}
            className={readNowStyle.readCardUnderline}
          >
            {word}
            {/* 툴팁을 마우스 오버 시 표시 */}
            <div className={readNowStyle.readCardImageTooltip}>
              <img src={imageSrc} alt={`${index}`} />
            </div>
          </span>
        </span>
      );

      // 단어 이후로 lastIndex 업데이트
      lastIndex = position + word.length;
    });

    // 마지막 단어 이후의 텍스트 처리
    if (lastIndex < message.length) {
      const remainingText = message.slice(lastIndex);
      result.push(<span key={`remaining-${lastIndex}`}>{remainingText}</span>);
    }

    return result;
  };

  const handlePlayBtn = (event: React.MouseEvent) => {
    event.stopPropagation(); // 다른 클릭 이벤트가 발생하지 않도록 차단
    if (wordsWithImages) {
      onPlayBtnClick(message, wordsWithImages); // 메시지와 단어 이미지 정보를 부모로 전달
    } else {
      onPlayBtnClick(message, []);
    }
  };

  const handlePrintBtn2 = async () => {
    try {
      // 1. HTML 콘텐츠 가져오기
      const plainText = contentRef.current?.innerHTML;

      // 2. 직렬 포트 요청
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      // 3. 텍스트 전송
      const writer = port.writable.getWriter();
      if (writer !== null) {
        const encoder = new TextEncoder();
        await writer.write(encoder.encode(plainText + "\n\n"));
        await writer.write(new Uint8Array([0x1b, 0x64, 0x02]));
        writer.releaseLock();
      }

      await port.close();

      // 4. 직렬 포트 닫기
      await port.close();
      alert("Print job completed!");
    } catch (error) {
      console.error("Failed to print:", error);
      alert("Failed to print. Check the console for details.");
    }
  };

  const viewResult = (result: string) => {
    console.log(result);
  };

  const handlePrintBtn3 = async () => {
    try {
      setPosId(0);
      checkPrinterStatus();
      setCharacterset(949);
      printText(
        `\n\n${questionMessage}\n*\n${message}\n*\n${formattedDate}\nwritenow.work`,
        0,
        0,
        false,
        false,
        false,
        0,
        1
      );
      cutPaper(1);
      var strSubmit = getPosData();
      console.log(strSubmit);
      requestPrint("print", strSubmit, viewResult);
      return true;
    } catch (error) {
      console.error("Failed to print:", error);
      alert("Failed to print. Check the console for details.");
    }
  };

  const handlePrintBtn = () => {
    handlePrint();
  };

  return (
    <>
      <div className={readNowStyle.answerCardContainer} onClick={onClick}>
        <div className={readNowStyle.answerCardQuestionBox}>
          <div className={readNowStyle.answerCardQuestionBoxInner}>
            <div className={readNowStyle.answerCardQuestion}>
              {questionMessage}
            </div>
            <div className={readNowStyle.answerCardregistDate}>
              {registDate}
            </div>
          </div>
          <svg
            onClick={handlePlayBtn}
            className={`${readNowStyle.playButton}`}
            xmlns="http://www.w3.org/2000/svg"
            width="39"
            height="39"
            viewBox="0 0 62 62"
            fill="none"
          >
            <g filter="url(#filter0_d_426_846)">
              <circle className={readNowStyle.circle} cx="31" cy="27" r="23" />
              <path
                d="M42.5187 25.9406C43.1892 26.3247 43.1892 27.2918 42.5187 27.676L27.1303 36.4922C26.4637 36.8742 25.6332 36.3928 25.6332 35.6245L25.6332 17.992C25.6332 17.2237 26.4637 16.7424 27.1303 17.1243L42.5187 25.9406Z"
                fill="white"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_426_846"
                x="0"
                y="0"
                width="62"
                height="62"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="4" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_426_846"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_426_846"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="27"
            viewBox="0 0 28 27"
            fill="none"
            onClick={handlePrintBtn}
            className={readNowStyle.printBtn}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M26 6.5H23V0.5H5V6.5H2C0.89543 6.5 0 7.39543 0 8.5V18.5C0 19.6046 0.89543 20.5 2 20.5H5V26.5H23V20.5H26C27.1046 20.5 28 19.6046 28 18.5V8.5C28 7.39543 27.1046 6.5 26 6.5ZM7 2.5H21V6.5H7V2.5ZM21 24.5H7V14.5H21V24.5ZM26 18.5H23V12.5H5V18.5H2V8.5H26V18.5Z"
              fill="#C2C2C2"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="27"
            viewBox="0 0 28 27"
            fill="none"
            onClick={handlePrintBtn3}
            className={readNowStyle.printBtn}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M26 6.5H23V0.5H5V6.5H2C0.89543 6.5 0 7.39543 0 8.5V18.5C0 19.6046 0.89543 20.5 2 20.5H5V26.5H23V20.5H26C27.1046 20.5 28 19.6046 28 18.5V8.5C28 7.39543 27.1046 6.5 26 6.5ZM7 2.5H21V6.5H7V2.5ZM21 24.5H7V14.5H21V24.5ZM26 18.5H23V12.5H5V18.5H2V8.5H26V18.5Z"
              fill="#4dc6fa"
            />
          </svg>
        </div>
        <div className={readNowStyle.answerCardMessageBox}>
          {renderMessageWithImages()}
        </div>
      </div>
      <div className={readNowStyle.print}>
        <div ref={contentRef} className={readNowStyle.printBody}>
          <div>{questionMessage}</div>
          <div>*</div>
          <div className={readNowStyle.printMessage}>{message}</div>
          <div>*</div>
          <div>
            {formattedDate}
            <br />
            writenow.work
          </div>
        </div>
      </div>
    </>
  );
};

export default AnswerCard;
