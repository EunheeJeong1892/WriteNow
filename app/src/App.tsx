import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import WriteNow from "./pages/writeNow";
import Library from "./pages/library";
import ReadNow from "./pages/readNow";
import { HelmetProvider } from "react-helmet-async";
import Intro from "./pages/intro";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { answersAtom, progressBarVisibleAtom, wordsAtom } from "./atoms";
import FullScreenProgressBar from "./components/FullScreenProgressBar";
import { fetchAnswers } from "./api/answerAPI";
import { fetchWords } from "./api/libraryAPI";

function App() {
  const setAnswerList = useSetRecoilState(answersAtom);
  const setWordList = useSetRecoilState(wordsAtom);
  const isVisible = useRecoilValue(progressBarVisibleAtom);

  useEffect(() => {
    const getAnswers = async () => {
      const data = await fetchAnswers();
      setAnswerList(data);
    };

    const getWords = async () => {
      const data = await fetchWords();
      setWordList(data);
    };

    getAnswers();
    getWords();
  }, [setAnswerList, setWordList]);

  return (
    <HelmetProvider>
      <FullScreenProgressBar isVisible={isVisible} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/intro" />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/writeNow" element={<WriteNow />} />
          <Route path="/library" element={<Library />} />
          <Route path="/readNow" element={<ReadNow />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
