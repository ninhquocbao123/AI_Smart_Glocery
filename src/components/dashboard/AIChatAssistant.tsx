"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  ChevronDown,
  ArrowRight,
  Utensils,
  Calendar,
  BookOpen,
  ChefHat,
  Clock,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";
import { recipes, type Recipe } from "@/data/mockData";
import { formatVND } from "@/lib/priceUtils";

interface Message {
  id: string;
  sender: "user" | "bot";
  timestamp: Date;
  text?: string;
  type: "text" | "table" | "suggestions" | "recipe";
  data?: any;
}

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        id: "msg-welcome",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
        text: "Xin chào! 👩‍🍳 Tôi là trợ lý AI của SmartCart. Tôi có thể giúp bạn lên thực đơn tuần, gợi ý hôm nay ăn gì, hoặc hướng dẫn chi tiết cách nấu các món ăn ngon. Bạn muốn tôi giúp gì hôm nay?",
      },
    ]);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      timestamp: new Date(),
      type: "text",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(text);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend(inputVal);
    }
  };

  // ── AI Response Generator Logic ──
  const generateAIResponse = (query: string): Message => {
    const cleanQuery = query.toLowerCase().trim();
    const id = `msg-bot-${Date.now()}`;

    // 1. Weekly plan query
    if (
      cleanQuery.includes("tuần") ||
      cleanQuery.includes("weekly") ||
      cleanQuery.includes("7 ngày") ||
      cleanQuery.includes("thực đơn tuần")
    ) {
      // Structure 7-day meal plan
      const planDays = [
        { day: "Thứ Hai", recipeId: "recipe-001", meal: "Phở Bò", cost: 185000, store: "Winmart & BHX" },
        { day: "Thứ Ba", recipeId: "recipe-002", meal: "Cơm Tấm Sườn Bì Chả", cost: 95000, store: "BHX & Winmart" },
        { day: "Thứ Tư", recipeId: "recipe-010", meal: "Rau Muống Xào Tỏi", cost: 45000, store: "Bách Hóa Xanh" },
        { day: "Thứ Năm", recipeId: "recipe-006", meal: "Thịt Kho Tàu", cost: 98000, store: "Winmart & BHX" },
        { day: "Thứ Sáu", recipeId: "recipe-004", meal: "Gỏi Cuốn Tôm Thịt", cost: 78000, store: "Coop Food & Winmart" },
        { day: "Thứ Bảy", recipeId: "recipe-007", meal: "Bò Lúc Lắc", cost: 165000, store: "Winmart & Coop Food" },
        { day: "Chủ Nhật", recipeId: "recipe-008", meal: "Canh Chua Cá Lóc", cost: 72000, store: "Bách Hóa Xanh" },
      ];

      return {
        id,
        sender: "bot",
        timestamp: new Date(),
        type: "table",
        text: "Dưới đây là **Thực đơn gợi ý 7 ngày** cân bằng dinh dưỡng, sử dụng các nguyên liệu tối ưu chi phí từ hệ thống siêu thị:",
        data: planDays,
      };
    }

    // 2. "Hôm nay ăn gì?" query
    if (
      cleanQuery.includes("ăn gì") ||
      cleanQuery.includes("an gi") ||
      cleanQuery.includes("gợi ý") ||
      cleanQuery.includes("món gì")
    ) {
      // Pick 3 random recipes
      const shuffled = [...recipes].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);

      return {
        id,
        sender: "bot",
        timestamp: new Date(),
        type: "suggestions",
        text: "Hôm nay bạn hãy thử một trong các món ăn thơm ngon này nhé. Nhấn vào tên món để xem chi tiết cách nấu:",
        data: selected,
      };
    }

    // 3. Specific recipe query
    // Let's check matches
    const matchedRecipe = recipes.find((r) => {
      const titleClean = r.title.toLowerCase();
      return (
        cleanQuery.includes(titleClean) ||
        titleClean.includes(cleanQuery) ||
        (cleanQuery.includes("phở") && r.id === "recipe-001") ||
        (cleanQuery.includes("cơm tấm") && r.id === "recipe-002") ||
        (cleanQuery.includes("bún chả") && r.id === "recipe-003") ||
        (cleanQuery.includes("gỏi cuốn") && r.id === "recipe-004") ||
        (cleanQuery.includes("bánh mì") && r.id === "recipe-005") ||
        (cleanQuery.includes("thịt kho") && r.id === "recipe-006") ||
        (cleanQuery.includes("bò lúc lắc") && r.id === "recipe-007") ||
        (cleanQuery.includes("canh chua") && r.id === "recipe-008") ||
        (cleanQuery.includes("xôi gà") && r.id === "recipe-009") ||
        (cleanQuery.includes("rau muống") && r.id === "recipe-010")
      );
    });

    if (matchedRecipe) {
      return {
        id,
        sender: "bot",
        timestamp: new Date(),
        type: "recipe",
        text: `Tôi đã tìm thấy công thức món **${matchedRecipe.title}** dành cho bạn!`,
        data: matchedRecipe,
      };
    }

    // If query asks about general recipe request but no match
    if (
      cleanQuery.includes("công thức") ||
      cleanQuery.includes("cách nấu") ||
      cleanQuery.includes("recipe") ||
      cleanQuery.includes("hướng dẫn")
    ) {
      return {
        id,
        sender: "bot",
        timestamp: new Date(),
        type: "text",
        text: "Tôi có sẵn hướng dẫn nấu ăn chi tiết cho các món Việt Nam như: **Phở Bò**, **Thịt Kho Tàu**, **Canh Chua Cá Lóc**, **Cơm Tấm**, **Bún Chả Hà Nội**, **Gỏi Cuốn Tôm Thịt**, **Bánh Mì Thịt Nướng**, **Bò Lúc Lắc**, **Xôi Gà Xé**, và **Rau Muống Xào Tỏi**. Bạn muốn xem cách nấu món nào trong số này?",
      };
    }

    // 4. Default fallback
    return {
      id,
      sender: "bot",
      timestamp: new Date(),
      type: "text",
      text: "Tôi chưa hiểu rõ yêu cầu của bạn lắm. Bạn có thể thử hỏi:\n- 📅 *'Lên thực đơn tuần này'*\n- 🍲 *'Hôm nay ăn gì?'*\n- 🍜 *'Công thức Phở Bò'*\nHoặc nhấn vào các nút gợi ý nhanh ở bên dưới nhé!",
    };
  };

  return (
    <>
      {/* ── Floating Bubble Button ── */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full gradient-primary text-on-primary flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer transition-shadow"
          aria-label="Mở trợ lý ảo AI"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center"
              >
                <MessageSquare className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Chat Assistant Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="
              fixed bottom-36 right-4 left-4 md:left-auto
              md:bottom-24 md:right-6 w-auto md:w-[420px] h-[520px] z-50
              flex flex-col bg-surface border border-outline-variant rounded-3xl overflow-hidden
              shadow-[0_12px_36px_rgba(0,0,0,0.12)]
            "
          >
            {/* Header */}
            <div className="gradient-primary text-on-primary px-5 py-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-wide text-white">Trợ lý Thực đơn AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-white/80 font-medium">Hỗ trợ trực tuyến</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white"
                aria-label="Thu nhỏ chat"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container/20">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"}`}
                  >
                    {/* Bot avatar */}
                    {isBot && (
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-sm flex items-center justify-center flex-shrink-0 self-end shadow-sm">
                        🍳
                      </div>
                    )}

                    <div className="max-w-[85%] space-y-2">
                      <div
                        className={`
                          px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                          ${
                            isBot
                              ? "bg-surface border border-outline-variant text-on-surface rounded-bl-none"
                              : "gradient-primary text-on-primary rounded-br-none"
                          }
                        `}
                      >
                        {/* Text Render */}
                        {msg.text && (
                          <div className="whitespace-pre-line">
                            {msg.text.replace(/\*\*(.*?)\*\*/g, "$1")}
                          </div>
                        )}

                        {/* Custom Data Renders */}
                        {/* TABLE TYPE (Weekly Plan) */}
                        {msg.type === "table" && msg.data && (
                          <div className="mt-3 overflow-x-auto rounded-xl border border-outline-variant bg-surface">
                            <table className="min-w-full divide-y divide-outline-variant text-left text-xs">
                              <thead className="bg-surface-container-high font-bold text-on-surface-variant">
                                <tr>
                                  <th className="px-3 py-2">Thứ</th>
                                  <th className="px-3 py-2">Món ăn</th>
                                  <th className="px-3 py-2 text-right">Chi phí</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-outline-variant font-medium">
                                {msg.data.map((row: any, i: number) => (
                                  <tr key={i} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-3 py-2 text-on-surface-variant font-semibold">{row.day}</td>
                                    <td className="px-3 py-2">
                                      <Link
                                        href={`/meal-plan/${row.recipeId}`}
                                        onClick={() => setIsOpen(false)}
                                        className="text-primary hover:underline font-bold inline-flex items-center gap-0.5"
                                      >
                                        {row.meal}
                                      </Link>
                                    </td>
                                    <td className="px-3 py-2 text-right text-primary font-bold">{formatVND(row.cost)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* SUGGESTIONS TYPE (What to Eat) */}
                        {msg.type === "suggestions" && msg.data && (
                          <div className="mt-3 space-y-2">
                            {msg.data.map((recipe: Recipe) => (
                              <Link
                                key={recipe.id}
                                href={`/meal-plan/${recipe.id}`}
                                onClick={() => setIsOpen(false)}
                                className="block"
                              >
                                <div className="p-3 rounded-xl border border-outline-variant hover:border-primary/40 bg-surface hover:bg-primary/5 transition-all flex items-center justify-between gap-2 shadow-sm">
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-on-surface truncate">
                                      {recipe.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-on-surface-variant">
                                      <span className="font-semibold bg-surface-container px-1.5 py-0.5 rounded">
                                        {recipe.difficulty}
                                      </span>
                                      <span>•</span>
                                      <span>{recipe.prepTime + recipe.cookTime} phút</span>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <span className="text-xs font-bold text-primary block">
                                      {formatVND(recipe.totalPrice)}
                                    </span>
                                    <span className="text-[9px] text-primary hover:underline inline-flex items-center gap-0.5">
                                      Nấu ngay <ArrowRight className="w-2.5 h-2.5" />
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* RECIPE DETAIL TYPE */}
                        {msg.type === "recipe" && msg.data && (
                          <div className="mt-3 space-y-3 bg-surface p-3 rounded-xl border border-outline-variant">
                            <div className="flex items-center justify-between gap-2 border-b border-outline-variant pb-2">
                              <h4 className="text-xs font-extrabold text-on-surface">{msg.data.title}</h4>
                              <Link
                                href={`/meal-plan/${msg.data.id}`}
                                onClick={() => setIsOpen(false)}
                                className="text-[10px] font-bold text-primary hover:underline"
                              >
                                Xem Chi Tiết
                              </Link>
                            </div>
                            
                            {/* Prep info */}
                            <div className="flex items-center gap-3 text-[10px] text-on-surface-variant">
                              <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {msg.data.prepTime + msg.data.cookTime} phút</span>
                              <span className="flex items-center gap-0.5 font-semibold bg-surface-container px-1.5 py-0.5 rounded">{msg.data.difficulty}</span>
                            </div>

                            {/* Ingredients */}
                            <div className="space-y-1">
                              <p className="text-[11px] font-bold text-on-surface-variant">Nguyên liệu chính:</p>
                              <ul className="text-[10px] text-on-surface-variant list-disc pl-4 space-y-0.5">
                                {msg.data.ingredients.slice(0, 5).map((ing: any, idx: number) => (
                                  <li key={idx}>
                                    {ing.name} ({ing.quantity} {ing.unit})
                                  </li>
                                ))}
                                {msg.data.ingredients.length > 5 && (
                                  <li className="list-none text-primary italic font-semibold">...và {msg.data.ingredients.length - 5} nguyên liệu khác.</li>
                                )}
                              </ul>
                            </div>

                            {/* Steps */}
                            <div className="space-y-1 border-t border-outline-variant pt-2">
                              <p className="text-[11px] font-bold text-on-surface-variant">Các bước nấu chính:</p>
                              <ol className="text-[10px] text-on-surface-variant list-decimal pl-4 space-y-1">
                                {msg.data.instructions.slice(0, 3).map((step: string, idx: number) => (
                                  <li key={idx} className="leading-snug">
                                    {step}
                                  </li>
                                ))}
                                {msg.data.instructions.length > 3 && (
                                  <li className="list-none text-primary italic font-semibold">...nhấn xem chi tiết để xem toàn bộ {msg.data.instructions.length} bước.</li>
                                )}
                              </ol>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-on-surface-variant block px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-sm flex items-center justify-center flex-shrink-0 self-end shadow-sm">
                    🍳
                  </div>
                  <div className="bg-surface border border-outline-variant text-on-surface px-4 py-3 rounded-2xl rounded-bl-none shadow-sm max-w-[80%] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Prompt Chips */}
            <div className="px-4 py-2 bg-surface-container/50 border-t border-outline-variant/60 flex gap-2 overflow-x-auto scrollbar-hide select-none">
              <button
                onClick={() => handleSend("Hôm nay ăn gì?")}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-outline-variant hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold text-on-surface-variant cursor-pointer transition-all"
              >
                <Utensils className="w-3.5 h-3.5 text-primary" />
                Hôm nay ăn gì? 🍲
              </button>
              <button
                onClick={() => handleSend("Thực đơn tuần này")}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-outline-variant hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold text-on-surface-variant cursor-pointer transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                Thực đơn tuần 📅
              </button>
              <button
                onClick={() => handleSend("Công thức nấu phở bò")}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-outline-variant hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold text-on-surface-variant cursor-pointer transition-all"
              >
                <ChefHat className="w-3.5 h-3.5 text-tertiary" />
                Cách nấu Phở Bò 🍜
              </button>
              <button
                onClick={() => handleSend("Cách làm thịt kho tàu")}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-outline-variant hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold text-on-surface-variant cursor-pointer transition-all"
              >
                <ChefHat className="w-3.5 h-3.5 text-orange-500" />
                Thịt Kho Tàu 🥩
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-surface border-t border-outline-variant/60 flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi trợ lý nấu ăn AI..."
                className="
                  flex-1 bg-surface-container-low border border-outline-variant/80 rounded-2xl px-4 py-2.5 text-sm
                  outline-none focus:border-primary focus:bg-surface transition-all
                  placeholder:text-outline
                "
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend(inputVal)}
                disabled={!inputVal.trim()}
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                  ${
                    inputVal.trim()
                      ? "gradient-primary text-on-primary shadow cursor-pointer"
                      : "bg-surface-container-high text-outline cursor-not-allowed"
                  }
                `}
                aria-label="Gửi tin nhắn"
              >
                <Send className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
