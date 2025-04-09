import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a Book of Mormon study assistant. When the user asks a question, respond with scriptural insight from the Book of Mormon, cite specific verses, and include a brief thought for personal application.",
          },
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    const data = await res.json();
    setResponse(data.choices?.[0]?.message?.content || "No response");
    setLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div className="p-4 max-w-xl mx-auto">
                  <h1 className="text-2xl font-bold mb-4">Liahona AI</h1>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about the Book of Mormon..."
                    className="w-full p-2 border rounded mb-2"
                    rows={4}
                  />
                  <button
                    onClick={handleAsk}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                  >
                    {loading ? "Thinking..." : "Ask"}
                  </button>
                  <div className="mt-4 whitespace-pre-wrap">
                    {response && <p><strong>Response:</strong> {response}</p>}
                  </div>
                </div>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
