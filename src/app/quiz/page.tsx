"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, Trophy, RefreshCcw, Heart, Sparkles, Brain } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";
import confetti from "canvas-confetti";

export default function QuizPage() {
  const { quiz, settings } = useAppStore();
  const hydrated = useStoreHydrated();
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#c87882", "#a885b5", "#d4a574"]
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
        if (score + (option === quiz[currentQuestion].answer ? 1 : 0) >= quiz.length * 0.7) {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            colors: ["#c87882", "#a885b5", "#d4a574", "#fff"]
          });
        }
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

  const progressValue = quiz.length > 0 ? ((currentQuestion + (isAnswered ? 1 : 0)) / quiz.length) * 100 : 0;
  const scorePercentage = quiz.length > 0 ? (score / quiz.length) * 100 : 0;

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <Heart className="w-8 h-8 text-primary/50 fill-primary/30" />
        </motion.div>
      </main>
    );
  }

  if (quiz.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-romantic-gradient relative">
        <div className="absolute inset-0 bg-romantic-radial" />
        <div className="paper-texture" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 glass-card rounded-3xl p-12 text-center max-w-md"
        >
          <Brain className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-foreground mb-4">No Quiz Questions</h1>
          <p className="text-muted-foreground mb-6">Add questions in the admin panel to test your love.</p>
          <Button asChild><Link href="/">Go Home</Link></Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-romantic-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-romantic-radial" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
      />
      
      <div className="paper-texture" />
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button asChild variant="ghost" className="hover:bg-transparent hover:text-primary text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="mr-2 w-4 h-4" /> Home
          </Link>
        </Button>
      </div>

      {/* Progress Bar */}
      {!showScore && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-20"
        >
          <Progress value={progressValue} className="h-2" />
        </motion.div>
      )}

      <div className="w-full max-w-2xl relative z-10">
        <AnimatePresence mode="wait">
          {showScore ? (
            <motion.div
              key="score"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="relative w-36 h-36 mx-auto mb-8"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-glow" />
                <div className="absolute inset-2 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <Trophy className="w-14 h-14 text-primary" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <Heart
                      key={deg}
                      className="absolute w-4 h-4 text-primary/60 fill-primary/40"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `rotate(${deg}deg) translateY(-80px) rotate(-${deg}deg)`,
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <Badge variant="glow" className="mx-auto">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Quiz Completed!
                </Badge>
                
                <h1 className="font-serif text-4xl md:text-5xl text-foreground">
                  {scorePercentage >= 80 ? "Perfect Match!" : scorePercentage >= 50 ? "Great Job!" : "Keep Trying!"}
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  You scored <span className="text-primary font-bold text-2xl">{score}</span> out of <span className="font-bold">{quiz.length}</span>
                </p>
                
                <div className="glass-card rounded-2xl p-6 max-w-xs mx-auto mt-6">
                  <div className="text-5xl mb-2">
                    {scorePercentage >= 80 ? "💕" : scorePercentage >= 50 ? "💖" : "💗"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {scorePercentage >= 80
                      ? `${settings.coupleName} truly know each other!`
                      : scorePercentage >= 50
                      ? "You're getting there! Keep learning about each other."
                      : "Time for more date nights!"}
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-8"
              >
                <Button onClick={resetQuiz} size="lg" className="rounded-full text-lg px-8 glow-primary">
                  <RefreshCcw className="mr-2 w-5 h-5" /> Play Again
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-10">
                <Badge variant="romantic" className="mb-4">
                  <Brain className="w-3 h-3 mr-1" />
                  Question {currentQuestion + 1} of {quiz.length}
                </Badge>
                
                <h2 className="font-serif text-2xl md:text-4xl text-foreground leading-tight">
                  {quiz[currentQuestion].question}
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {quiz[currentQuestion].options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === quiz[currentQuestion].answer;
                  
                  let cardStyle = "glass-card hover:scale-[1.02] hover:shadow-lg";
                  let borderStyle = "border-transparent";
                  
                  if (isAnswered) {
                    if (isCorrect) {
                      cardStyle = "bg-emerald-50 shadow-lg shadow-emerald-100";
                      borderStyle = "border-emerald-400";
                    } else if (isSelected) {
                      cardStyle = "bg-rose-50 shadow-lg shadow-rose-100";
                      borderStyle = "border-rose-400";
                    } else {
                      cardStyle = "opacity-40";
                    }
                  }

                  return (
                    <motion.button
                      key={option}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleAnswerClick(option)}
                      disabled={isAnswered}
                      className={`relative p-6 rounded-2xl border-2 ${borderStyle} text-left transition-all duration-300 ${cardStyle} flex items-center justify-between group`}
                    >
                      <span className="text-lg font-medium text-foreground">{option}</span>
                      
                      {isAnswered && isCorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center"
                        >
                          <Check className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                      
                      {isAnswered && isSelected && !isCorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-8 w-8 rounded-full bg-rose-500 flex items-center justify-center"
                        >
                          <X className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                      
                      {!isAnswered && (
                        <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/20 group-hover:border-primary/40 transition-colors" />
                      )}
                    </motion.button>
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
