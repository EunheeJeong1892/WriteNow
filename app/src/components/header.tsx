import React, { useEffect, useRef, useState } from "react";
import { ActionsOperations } from "./actionOperations";
import headerStyle from "../css/header.module.css";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "../constants/constants";

interface HeaderProps {
  showInput: boolean;
  onInputAction?: (input: string) => void;
  inputRef?: React.RefObject<HTMLDivElement>;
}

const Header: React.FC<HeaderProps> = ({
  showInput,
  onInputAction,
  inputRef,
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
    const newText = e.currentTarget.innerText;
    setInputText(newText);
    if (onInputAction) {
      onInputAction(newText); // 페이지별 로직 호출
    }
  };

  const handleInput2 = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.innerText;
    if (newText) {
      setDisplayedMenu(placeholder);
    } else {
      setDisplayedMenu(currentMenu);
    }

    if (!isComposing) {
      setInputText(e.currentTarget.innerText);
    }
  };

  const handlePlaceholderRefresh = () => {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    setPlaceholderNum(randomIndex);
    setInputText("");
    setDisplayedMenu(currentMenu);
    if (inputRef) {
      if (inputRef.current) {
        inputRef.current.innerText = "";
      }
    }
  };

  return (
    <div className={headerStyle.header}>
      <header className={headerStyle.class}>
        <div className={headerStyle.logo}>
          <div className={headerStyle["text-wrapper"]}>{displayedMenu}</div>
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
        <div
          id="editable"
          className={headerStyle.editable}
          ref={inputRef}
          contentEditable="true"
          onInput={handleInput}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={(e) => {
            setIsComposing(false);
            setInputText(e.currentTarget.innerText);
            //checkText();
          }}
          data-placeholder={`${placeholder}`}
        ></div>
      )}
    </div>
  );
};

export default Header;
