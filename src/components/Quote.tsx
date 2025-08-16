import axios from "axios";
import React, { useEffect, useState, type TextareaHTMLAttributes } from "react";

export default function Quote() {
  const [quote, setQuote] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(true);
  const [errorMessage, setErrormessage] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  async function fetchData(): Promise<void> {
    try {
      setLoader(true);
      const response = await axios.get("https://dummyjson.com/quotes/random");
      console.log(response);
      setQuote(response.data.quote);
    } catch (e) {
      setErrormessage(true);
    } finally {
      setLoader(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!startTime) setStartTime(Date.now());
    if (value === quote) {
      setEndTime(Date.now());
    }
    setUserInput(value);
  }
  function renderHighlightedQuote() {
    return quote.split("").map((char, idx) => {
      let color;
      if (idx < userInput.length) {
        color = char === userInput[idx] ? "green" : "red";
      } else {
        color = "gray";
      }

      return (
        <span key={idx} style={{ color }}>
          {char}
        </span>
      );
    });
  }
  function scoreCalculation() {
    if (!startTime || !endTime) return 0;
    const words = userInput.trim().split(" ").length;
    const minutes = (endTime - startTime) / 1000 / 60;
    return Math.round(words / minutes);
  }
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Typing Speed Test</h2>

      {/* Quote with highlight */}
      <div
        className="relative border rounded p-4 mb-4"
        style={{ minHeight: "100px" }}
      >
        <div className="absolute top-0 left-0 p-4 pointer-events-none">
          {renderHighlightedQuote()}
        </div>
        <input
          value={userInput}
          onChange={handleChange}
          className="w-full h-full p-4 bg-transparent text-transparent caret-black outline-none"
          autoFocus
        />
      </div>

      {endTime && <p className="text-lg">✅ Speed: {scoreCalculation()} WPM</p>}
    </div>
  );
}
