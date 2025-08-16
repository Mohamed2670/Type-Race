import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Quote() {
  const [quote, setQuote] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  async function fetchData(): Promise<void> {
    try {
      const response = await axios.get("https://dummyjson.com/quotes/random");
      console.log(response);
      setQuote(response.data.quote);
    } catch (e) {
    } finally {
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    if (!startTime) setStartTime(Date.now());
    if (value === quote) {
      setEndTime(Date.now());
    }
    setUserInput(value);
  }
  function renderQuote() {
    const quoteWords = quote.split(" ");
    const inputWords = userInput.split(" ");
    return quoteWords.map((word, idx) => {
      let color;
      if (inputWords[idx] === null) {
        color = "gray";
      } else if (word === inputWords[idx]) {
        color = "green";
      } else {
        color = "red";
      }
      return (
        <span key={idx} style={{ color, marginRight: "5px" }}>
          {word}
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Typing Speed Test</h2>
      <div className="mb-4">{renderQuote()}</div>
      <textarea
        value={userInput}
        onChange={handleChange}
        rows={4}
        className="border rounded w-full p-2"
      />
      {endTime && (
        <p className="mt-4 text-lg">✅ You typed {scoreCalculation()} WPM!</p>
      )}
    </div>
  );
}
