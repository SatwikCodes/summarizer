import { useState } from "react";
import "./App.css";

export default function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const wordCount = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  async function summarize() {
    setLoading(true);
    setSummary("");
    setError("");

    try {
      const res = await fetch("/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      if (data.summary) {
        setSummary(data.summary);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Smart Text Condenser ✨</h1>
      <p className="subtitle">
        Turn long text into a clean 100-word summary instantly
      </p>

      <textarea
        placeholder="Paste long text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="info">
        <span>{wordCount} words</span>
        <span>Minimum 50 words</span>
      </div>

      <button
        onClick={summarize}
        disabled={loading || wordCount < 50}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {error && <p className="error">{error}</p>}

      {summary && (
        <div className="result">
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}