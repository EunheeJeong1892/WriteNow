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
import { AnswerCardProps } from "./types/types";

function App() {
  const setAnswerList = useSetRecoilState(answersAtom);
  const setWordList = useSetRecoilState(wordsAtom);
  const isVisible = useRecoilValue(progressBarVisibleAtom);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await fetch(
          "https://tqx65zlmb5.execute-api.ap-northeast-2.amazonaws.com/Answers"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const sortedData = data.sort(
          (a: AnswerCardProps, b: AnswerCardProps) => {
            return (
              new Date(b.registDate).getTime() -
              new Date(a.registDate).getTime()
            );
          }
        );
        setAnswerList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchWords = async () => {
      try {
        const response = await fetch(
          "https://gpzyo7nv2d.execute-api.ap-northeast-2.amazonaws.com/ReadNow"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setWordList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAnswers();
    fetchWords();
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
