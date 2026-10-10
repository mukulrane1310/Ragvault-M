import { useState, useEffect, useRef } from "react";
import { Send, User, Bot, Copy, Check, FileText, Trash2 } from "lucide-react";
import { askQuestion, getChatHistory } from "../services/api";
import SourceCitation from "./SourceCitation";
import ConfidenceBadge from "./ConfidenceBadge";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-slate-500 hover:text-slate-300 transition-colors"
      title="Copy answer"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatBox({ disabled, selectedDocId, selectedDocName }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!selectedDocId) {
        setMessages([]);
        return;
      }

      setHistoryLoading(true);
      try {
        const result = await getChatHistory(selectedDocId);
        const historyMessages = result.messages.flatMap((msg) => [
          { role: "user", text: msg.question, sources: null, time: new Date() },
          {
            role: "assistant",
            text: msg.answer,
            sources: msg.sources,
            confidence: msg.confidence,
            confidenceLabel: msg.confidence_label,
            time: new Date(),
          },
        ]);
        setMessages(historyMessages);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, [selectedDocId]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const currentQuestion = question;
    setQuestion("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: currentQuestion, sources: null, time: new Date() },
    ]);

    try {
     const result = await askQuestion(currentQuestion, selectedDocId);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: result.answer,
          sources: result.sources,
          confidence: result.confidence,
          confidenceLabel: result.confidence_label,
          time: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Query error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong. Please try again.",
          sources: null,
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col  h-155 overflow-hidden">
      <div className="border-b border-slate-800 px-4 py-3 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={16} className="text-blue-500 shrink-0" />
          <span className="text-sm font-medium truncate">
            {selectedDocName || "No document selected"}
          </span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            title="Clear conversation"
            className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {historyLoading && (
          <p className="text-slate-500 italic text-sm text-center">
            Loading history...
          </p>
        )}

        {!historyLoading && messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
            {disabled
              ? "Select a document to start chatting"
              : "Ask your first question about this document"}
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === "user" ? "bg-blue-600" : "bg-slate-700"
              }`}
            >
              {msg.role === "user" ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>

            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-slate-800 text-slate-100 rounded-tl-sm"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </p>

              {msg.role === "assistant" && msg.confidence !== undefined && (
                <div className="mt-2">
                  <ConfidenceBadge score={msg.confidence} label={msg.confidenceLabel} />
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/50">
                <span className="text-[11px] text-slate-500">
                  {formatTime(msg.time)}
                </span>
                <div className="flex items-center gap-2">
                  {msg.role === "assistant" && (
                  <SourceCitation sources={msg.sources} docId={selectedDocId} />
                   )}
                  {msg.role === "assistant" && <CopyButton text={msg.text} />}
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-700">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-800 p-3 flex gap-2 items-end">
        <textarea
          rows={1}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your document..."
          disabled={disabled || loading}
          className="flex-1 resize-none px-3 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 text-sm disabled:opacity-50 focus:outline-none focus:border-blue-600"
        />
        <button
          onClick={handleAsk}
          disabled={disabled || loading || !question.trim()}
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-blue-600 text-white disabled:bg-slate-700 disabled:text-slate-500 hover:bg-blue-500 transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}