import { useState, useRef, useEffect } from "react"
import { clsx } from "clsx"
import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"

/**
 * Backlog:
 * 
 * ✅ Farewell messages in status section
 * ✅ Disable the keyboard when the game is over
 * ✅ Fix a11y issues
 * ✅ Choose a random word from a list of words
 * ✅ Make the New Game button reset the game
 * ✅ Reveal what the word was if the user loses the game
 * ✅ Confetti drop when the user wins
 * 
 * Challenge: 🎊🎊🎊🎊🎊
 */

export default function AssemblyEndgame() {
  // State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])
  const [time, setTime] = useState({
    minutes: 1,
    seconds: 0
  })
  const [farewellMessage, setFarewellMessage] = useState(null)

  // Ref values
  const intervalRef = useRef(null)

  // Derived values
  const numGuessesLeft = languages.length - 1
  const wrongGuessCount =
    guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameWon =
    currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= numGuessesLeft || !time.minutes && !time.seconds
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  // useEffect

  useEffect(() => {
    if (isGameOver) {
      stopTimer()
    } else {
      startTimer()
    }

  }, [isGameOver])

  if (isGameWon) {
    renderGameStatus()
  }

  if (isGameLost) {
    renderGameStatus()
  }

  useEffect(() => {
    if (!time.minutes && !time.seconds) {
      stopTimer()
    }
  }, [time])

  useEffect(() => {
    renderGameStatus()
  }, [wrongGuessCount])

  function startTimer() {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => ({
          minutes: prevTime.seconds === 0 ? prevTime.minutes - 1 : prevTime.minutes,
          seconds: prevTime.seconds === 0 ? 59 : prevTime.seconds - 1
        }))
      }, 1000)
    }
  }

  function stopTimer() {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters =>
      prevLetters.includes(letter) ?
        prevLetters :
        [...prevLetters, letter]
    )
  }

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
    setTime({
      minutes: 1,
      seconds: 0
    })
  }

  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    const className = clsx("chip", isLanguageLost && "lost")
    return (
      <span
        className={className}
        style={styles}
        key={lang.name}
      >
        {lang.name}
      </span>
    )
  })

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    )
  })

  const keyboardElements = alphabet.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
      <button
        className={className}
        key={letter}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    )
  })

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect && !isGameOver) {
      setFarewellMessage(getFarewellText(languages[wrongGuessCount - 1].name))
      return (
        <p className="farewell-message">
          {farewellMessage}
        </p>
      )
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    }

    return null
  }

  return (
    <main>
      {
        isGameWon &&
        <Confetti
          recycle={false}
          numberOfPieces={1000}
        />
      }

      {isGameLost && (
        <Confetti
          numberOfPieces={100}
          colors={["#A9A9A9"]}
          gravity={0.7}
          wind={0}
          recycle={false}
        />
      )}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the
          programming world safe from Assembly!</p>
      </header>

      <section
        aria-live="polite"
        role="status"
        className={gameStatusClass}
      >
        {farewellMessage && !isGameOver && isLastGuessIncorrect ? farewellMessage : isGameOver ? renderGameStatus() : ""}
      </section>

      <section className="language-chips">
        {languageElements}
      </section>

      <p className="timer">0{time.minutes} : {time.seconds < 10 ? "0" : ""}{time.seconds}</p>

      <section className="word">
        {letterElements}
      </section>

      {/* Combined visually-hidden aria-live region for status updates */}
      <section
        className="sr-only"
        aria-live="polite"
        role="status"
      >
        <p>
          {currentWord.includes(lastGuessedLetter) ?
            `Correct! The letter ${lastGuessedLetter} is in the word.` :
            `Sorry, the letter ${lastGuessedLetter} is not in the word.`
          }
          You have {numGuessesLeft} attempts left.
        </p>
        <p>Current word: {currentWord.split("").map(letter =>
          guessedLetters.includes(letter) ? letter + "." : "blank.")
          .join(" ")}</p>

      </section>

      <section className="keyboard">
        {keyboardElements}
      </section>

      {isGameOver &&
        <button
          className="new-game"
          onClick={startNewGame}
        >New Game</button>}

      <p>Guesses remaining: {numGuessesLeft - wrongGuessCount}</p>
    </main>
  )
}
