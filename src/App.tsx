import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const emojis = ['🌟', '🎨', '🌈', '🎭', '🎪', '🎯', '🎲', '🎮'];
const initialCards = [...emojis, ...emojis].map((emoji, index) => ({
  id: index,
  emoji,
  isFlipped: false,
  isMatched: false,
}));

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function App() {
  const [cards, setCards] = useState<Card[]>(shuffleArray(initialCards));
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (selectedCards.length === 2 && !isChecking) {
      setIsChecking(true);
      const [first, second] = selectedCards;
      
      if (cards[first].emoji === cards[second].emoji) {
        // If cards match, set them as matched and keep them face up
        setCards(cards.map((card, index) =>
          index === first || index === second
            ? { ...card, isMatched: true }
            : card
        ));
        setScore(score + 100);
        setSelectedCards([]);
        setIsChecking(false);
      } else {
        // If cards don't match, flip them back after a delay
        setTimeout(() => {
          setCards(cards.map((card, index) =>
            index === first || index === second
              ? { ...card, isFlipped: false }
              : card
          ));
          setSelectedCards([]);
          setIsChecking(false);
        }, 1000);
      }
      setMoves(moves + 1);
    }
  }, [selectedCards, cards, score, moves, isChecking]);

  useEffect(() => {
    if (cards.every(card => card.isMatched)) {
      setIsGameComplete(true);
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (
      isChecking ||
      selectedCards.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return;
    }

    setCards(cards.map((card, i) =>
      i === index ? { ...card, isFlipped: true } : card
    ));
    setSelectedCards([...selectedCards, index]);
  };

  const resetGame = () => {
    setCards(shuffleArray(initialCards));
    setSelectedCards([]);
    setMoves(0);
    setScore(0);
    setIsGameComplete(false);
    setIsChecking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8" />
            Memory Game
            <Sparkles className="w-8 h-8" />
          </h1>
          <div className="flex justify-center gap-8 text-white">
            <p className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Score: {score}
            </p>
            <p>Moves: {moves}</p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Game
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all duration-300 transform ${
                card.isFlipped || card.isMatched
                  ? 'bg-white rotate-0'
                  : 'bg-gradient-to-r from-blue-400 to-blue-600 rotate-y-180'
              } ${
                card.isMatched ? 'opacity-50' : ''
              } hover:scale-105 active:scale-95`}
              disabled={card.isMatched}
            >
              {(card.isFlipped || card.isMatched) && card.emoji}
            </button>
          ))}
        </div>

        {isGameComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl text-center">
              <h2 className="text-3xl font-bold mb-4">Congratulations! 🎉</h2>
              <p className="mb-4">
                You completed the game in {moves} moves with a score of {score}!
              </p>
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;