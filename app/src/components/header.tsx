import React, { useEffect, useRef, useState } from "react";
import { ActionsOperations } from "./actionOperations";
import headerStyle from "../css/header.module.css";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "../constants/constants";

interface HeaderProps {
  showInput: boolean;
  onInputAction?: () => void;
  onSubmitAction?: (questionId: number) => void;
  inputRef?: React.RefObject<HTMLDivElement>;
  displayMenuRef?: React.RefObject<HTMLDivElement>;
}

const Header: React.FC<HeaderProps> = ({
  showInput,
  onInputAction,
  onSubmitAction,
  inputRef,
  displayMenuRef,
}) => {
  const navigate = useNavigate();
  const [currentMenu, setCurrentMenu] = useState<string>("");
  const [displayedMenu, setDisplayedMenu] = useState<string>("");
  const placeholders = QUESTIONS.map((o) => o.message);
  const [placeholder, setPlaceholder] = useState("");
  const [placeholderNum, setPlaceholderNum] = useState<number>(0);
  const [inputText, setInputText] = useState<string>(""); // 상태로 텍스트 관리
  const [isComposing, setIsComposing] = useState(false); // 한글 조합 상태

  const menus = ["writeNow", "readNow", "library"];

  useEffect(() => {
    if (currentMenu === "writeNow") {
      setPlaceholder(placeholders[placeholderNum]);
    } else if (currentMenu === "library") {
      setPlaceholder("검색어를 입력하세요.");
    }
  }, [placeholderNum]);

  useEffect(() => {
    setPlaceholderNum(Math.floor(Math.random() * placeholders.length));
    if (inputRef) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }

    const path = window.location.pathname.replace("/", "");
    setCurrentMenu(path || "writeNow");
    setDisplayedMenu(path || "writeNow");
  }, []);

  const handleMenuClick = (menu: string) => {
    navigate(`/${menu}`);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (e.currentTarget.innerText && currentMenu === "writeNow") {
      setDisplayedMenu(placeholder);
    } else {
      setDisplayedMenu(currentMenu);
    }
    if (!isComposing) {
      setInputText(e.currentTarget.innerText);
      if (onInputAction) {
        onInputAction();
      }
    }
  };

  const handleCompositionEnd = (e: React.FormEvent<HTMLDivElement>) => {
    setIsComposing(false);
    setInputText(e.currentTarget.innerText);
    if (onInputAction) {
      onInputAction();
    }
  };

  const handlePlaceholderRefresh = () => {
    setPlaceholderNum(Math.floor(Math.random() * placeholders.length));
    clearInput();
  };

  const clearInput = () => {
    setInputText("");
    if (inputRef?.current) {
      inputRef.current.innerText = "";
    }
    if (onInputAction) {
      onInputAction();
    }
  };

  const handleSubmit = () => {
    if (onSubmitAction) {
      onSubmitAction(placeholderNum + 1);
    }
  };

  return (
    <div className={headerStyle.header}>
      <header className={headerStyle.class}>
        <div className={headerStyle.logo}>
          <div className={headerStyle["text-wrapper"]} ref={displayMenuRef}>
            {displayedMenu}
          </div>
          {currentMenu === "writeNow" && (
            <ActionsOperations
              fill="ic_refresh.svg"
              fillClassName={headerStyle["actions-operations-renew-16"]}
              onClick={handlePlaceholderRefresh}
            />
          )}
        </div>
        <div className={headerStyle.frame}>
          <div className={headerStyle.menu}>
            {menus
              .filter((menu) => menu !== currentMenu)
              .map((menu) => (
                <div
                  key={menu}
                  className={headerStyle.div}
                  onClick={() => handleMenuClick(menu)}
                >
                  {menu}
                </div>
              ))}
          </div>
          <div className={headerStyle["div-wrapper"]}>
            <div className={headerStyle.div}>how to use</div>
          </div>
        </div>
      </header>
      {showInput && (
        <>
          <div
            id="editable"
            className={headerStyle.editable}
            ref={inputRef}
            contentEditable="true"
            onInput={handleInput}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              handleCompositionEnd(e);
            }}
            data-placeholder={`${placeholder}`}
          ></div>
          {inputText && currentMenu === "writeNow" && (
            <svg
              onClick={handleSubmit}
              className={headerStyle.send}
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              <rect
                className={headerStyle["send-circle"]}
                width="28"
                height="28"
                rx="14"
                fill=""
              />
              <path
                d="M13.9962 21C14.5607 21 14.9498 20.6252 14.9498 20.0667V11.358L14.8811 9.76325L16.6891 11.7328L18.4132 13.379C18.5887 13.5407 18.8175 13.6509 19.0922 13.6509C19.6109 13.6509 20 13.2835 20 12.769C20 12.5265 19.9008 12.2987 19.7025 12.1076L14.7057 7.28661C14.5226 7.10289 14.2556 7 13.9962 7C13.7368 7 13.4774 7.10289 13.2943 7.28661L8.29752 12.1076C8.09917 12.2987 8 12.5265 8 12.769C8 13.2835 8.38907 13.6509 8.90782 13.6509C9.18245 13.6509 9.41132 13.5407 9.58678 13.379L11.3032 11.7328L13.1113 9.76325L13.0502 11.358V20.0667C13.0502 20.6252 13.4317 21 13.9962 21Z"
                fill="white"
              />
            </svg>
          )}
          {inputText && currentMenu === "library" && (
            <img
              onClick={clearInput}
              className={headerStyle.send}
              src="ic_remove.svg"
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
