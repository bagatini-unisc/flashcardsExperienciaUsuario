import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, ChevronLeft, ChevronRight, RotateCcw, Check, X, TrendingUp, Target, Brain, Zap, Award, Star } from 'lucide-react';

export default function Flashcards() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [answered, setAnswered] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCards(results.data);
          setIsLoaded(true);
          setCurrentIndex(0);
          setIsFlipped(false);
          setAnswered([]);
          setCorrectAnswers(0);
          setWrongAnswers(0);
        },
        error: (error) => {
          alert('Erro ao ler o arquivo: ' + error.message);
        }
      });
    }
  };

  const handleAnswer = (isCorrect) => {
    if (answered.includes(currentIndex)) return;
    
    setLastAnswer(isCorrect);
    setShowFeedback(true);
    
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }
    
    setAnswered([...answered, currentIndex]);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentIndex < cards.length - 1) {
        handleNext();
      }
    }, 1500);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setAnswered([]);
    setCorrectAnswers(0);
    setWrongAnswers(0);
  };

  const totalAnswered = correctAnswers + wrongAnswers;
  const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
  const progress = ((currentIndex + 1) / cards.length) * 100;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center transform hover:scale-105 transition-transform">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Upload className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Flashcards Interativos
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Carregue seu arquivo CSV e comece a estudar com feedback em tempo real!
          </p>
          <label className="block">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl cursor-pointer hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg font-bold text-lg transform hover:scale-105">
              📁 Selecionar Arquivo CSV
            </div>
          </label>
          <p className="text-sm text-gray-500 mt-6">
            Formato: pergunta, resposta
          </p>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const questionKey = Object.keys(currentCard)[0];
  const answerKey = Object.keys(currentCard)[1];
  const isAnswered = answered.includes(currentIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-4">
      {/* Feedback Animation */}
      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`text-8xl animate-bounce ${lastAnswer ? 'text-green-400' : 'text-red-400'}`}>
            {lastAnswer ? '✓' : '✗'}
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-30 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-400 rounded-full p-2">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">Acertos</span>
            </div>
            <div className="text-3xl font-bold text-white">{correctAnswers}</div>
          </div>

          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-30 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-red-400 rounded-full p-2">
                <X className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">Erros</span>
            </div>
            <div className="text-3xl font-bold text-white">{wrongAnswers}</div>
          </div>

          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-30 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-400 rounded-full p-2">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">Precisão</span>
            </div>
            <div className="text-3xl font-bold text-white">{accuracy}%</div>
          </div>

          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-30 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-yellow-400 rounded-full p-2">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">Respondidas</span>
            </div>
            <div className="text-3xl font-bold text-white">{totalAnswered}/{cards.length}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Star className="w-10 h-10 text-yellow-300" />
            Flashcards de Estudo
            <Star className="w-10 h-10 text-yellow-300" />
          </h1>
          <p className="text-white text-xl opacity-90">
            Cartão {currentIndex + 1} de {cards.length}
          </p>
        </div>

        {/* Flashcard */}
        <div 
          className="relative h-96 cursor-pointer mb-6"
          onClick={handleFlip}
        >
          <div 
            className="absolute w-full h-full transition-all duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front - Question */}
            <div 
              className={`absolute w-full h-full rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center border-4 ${
                isAnswered 
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300'
                  : 'bg-gradient-to-br from-white to-gray-50 border-purple-300'
              }`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              {isAnswered && (
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              )}
              <div className={`text-sm font-bold mb-4 px-6 py-2 rounded-full ${
                isAnswered ? 'bg-white bg-opacity-30 text-white' : 'bg-purple-100 text-purple-700'
              }`}>
                PERGUNTA
              </div>
              <p className={`text-2xl text-center leading-relaxed font-semibold ${
                isAnswered ? 'text-white' : 'text-gray-800'
              }`}>
                {currentCard[questionKey]}
              </p>
              <p className={`text-sm mt-6 flex items-center gap-2 ${
                isAnswered ? 'text-white opacity-80' : 'text-gray-400'
              }`}>
                <Zap className="w-4 h-4" />
                Clique para ver a resposta
              </p>
            </div>

            {/* Back - Answer */}
            <div 
              className="absolute w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center border-4 border-purple-400"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-sm font-bold text-purple-200 mb-4 bg-white bg-opacity-20 px-6 py-2 rounded-full">
                RESPOSTA
              </div>
              <p className="text-2xl text-white text-center leading-relaxed font-semibold mb-8">
                {currentCard[answerKey]}
              </p>
              {!isAnswered && (
                <div className="flex gap-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAnswer(false); }}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-110 shadow-lg"
                  >
                    <X className="w-6 h-6" />
                    Errei
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAnswer(true); }}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-110 shadow-lg"
                  >
                    <Check className="w-6 h-6" />
                    Acertei!
                  </button>
                </div>
              )}
              {isAnswered && (
                <p className="text-white opacity-80 text-sm">Já respondido ✓</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
              currentIndex === 0
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-white text-purple-700 hover:bg-gray-100 transform hover:scale-105'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white bg-opacity-20 backdrop-blur-lg text-white hover:bg-opacity-30 shadow-lg transition-all transform hover:scale-105 border border-white border-opacity-30"
            >
              <TrendingUp className="w-5 h-5" />
              Estatísticas
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white bg-opacity-20 backdrop-blur-lg text-white hover:bg-opacity-30 shadow-lg transition-all transform hover:scale-105 border border-white border-opacity-30"
            >
              <RotateCcw className="w-5 h-5" />
              Reiniciar
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
              currentIndex === cards.length - 1
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transform hover:scale-105'
            }`}
          >
            Próximo
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-full h-6 shadow-lg border border-white border-opacity-30">
          <div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-6 rounded-full transition-all duration-300 shadow-lg flex items-center justify-end pr-3"
            style={{ width: `${progress}%` }}
          >
            <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform scale-100 animate-in">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
              <Award className="w-8 h-8 text-purple-600" />
              Suas Estatísticas
            </h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600 font-semibold">Total de Acertos</div>
                    <div className="text-4xl font-bold text-green-600">{correctAnswers}</div>
                  </div>
                  <Check className="w-12 h-12 text-green-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-rose-50 p-5 rounded-xl border-2 border-red-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600 font-semibold">Total de Erros</div>
                    <div className="text-4xl font-bold text-red-600">{wrongAnswers}</div>
                  </div>
                  <X className="w-12 h-12 text-red-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border-2 border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600 font-semibold">Taxa de Acerto</div>
                    <div className="text-4xl font-bold text-blue-600">{accuracy}%</div>
                  </div>
                  <Target className="w-12 h-12 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-5 rounded-xl border-2 border-purple-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600 font-semibold">Progresso</div>
                    <div className="text-4xl font-bold text-purple-600">{totalAnswered}/{cards.length}</div>
                  </div>
                  <Brain className="w-12 h-12 text-purple-500" />
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowStats(false)}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg transform hover:scale-105"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}