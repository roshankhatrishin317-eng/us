"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, Trophy, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import confetti from "canvas-confetti";

export default function QuizPage() {
  const { quiz } = useAppStore();
  const hydrated = useHydrated();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerClick = (option: string) => {
    if (isAnswered || quiz.length === 0) return;
    
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === quiz[currentQuestion].answer) {
      setScore(score + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#BF7058', '#78A2AA', '#E0A890']
      });
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quiz.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  if (quiz.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-romantic-gradient relative">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">No Quiz Questions</h1>
          <p className="text-muted-foreground mb-6">Add questions in the admin panel.</p>
          <Button asChild><Link href="/">Go Home</Link></Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-romantic-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-romantic-radial" />
      <div className="paper-texture" />
      
      <div className="absolute top-6 left-6 z-20">
        <Button asChild variant="ghost" className="hover:bg-transparent hover:text-primary transition-colors text-muted-foreground">
            <Link href="/">
            <ArrowLeft className="mr-2 w-4 h-4" /> Home
            </Link>
        </Button>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <AnimatePresence mode="wait">
          {showScore ? (
            <motion.div
              key="score"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-16 h-16 text-primary animate-bounce" />
              </div>
              <h1 className="font-serif text-5xl text-foreground">Quiz Completed!</h1>
              <p className="text-2xl text-muted-foreground">
                You scored <span className="text-primary font-bold">{score}</span> out of {quiz.length}
              </p>
              
              <div className="pt-8">
                 <Button onClick={resetQuiz} size="lg" className="rounded-full text-lg px-8">
                    <RefreshCcw className="mr-2 w-5 h-5" /> Play Again
                 </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-10">
                  <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
                      Question {currentQuestion + 1}/{quiz.length}
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">
                    {quiz[currentQuestion].question}
                  </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {quiz[currentQuestion].options.map((option) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === quiz[currentQuestion].answer;
                    
                    let buttonStyle = "bg-white/60 hover:bg-white/80 border-transparent";
                    if (isAnswered) {
                        if (isCorrect) buttonStyle = "bg-green-100 border-green-500 text-green-800";
                        else if (isSelected) buttonStyle = "bg-red-100 border-red-500 text-red-800";
                        else buttonStyle = "opacity-50";
                    }

                    return (
                        <button
                            key={option}
                            onClick={() => handleAnswerClick(option)}
                            disabled={isAnswered}
                            className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 shadow-sm ${buttonStyle} flex items-center justify-between group`}
                        >
                            <span className="text-lg font-medium">{option}</span>
                            {isAnswered && isCorrect && <Check className="w-5 h-5 text-green-600" />}
                            {isAnswered && isSelected && !isCorrect && <X className="w-5 h-5 text-red-600" />}
                        </button>
                    );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
