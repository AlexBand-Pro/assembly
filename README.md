# 🎮 Assembly: Endgame

Assembly: Endgame is a word-guessing game built with React where players must uncover a hidden word before running out of attempts or time. Guess wrong too many times, and the programming world is consumed by Assembly! 🖥️💀  

This project demonstrates **state management with React Hooks**, **dynamic UI rendering**, and **game logic handling** including a countdown timer, score tracking, accessibility features, and animated win/lose effects.

---

## 🚀 Live Demo - Play Assembly: Endgame

[![Play Assembly: Endgame](https://github.com/user-attachments/assets/78fa934f-1096-44ff-9d76-95fe990ebec9)](https://kaleidoscopic-moonbeam-458705.netlify.app/)

## ✨ Features

- ⏳ Countdown timer (1 minute per game)  
- 🎯 Limited guesses – run out and you lose  
- 🎉 Confetti animations for win/lose states  
- 🔤 On-screen interactive keyboard  
- 🌍 Fun "farewell" messages in multiple languages when guessing wrong  
- ♿ Accessible with ARIA live regions for screen readers  

---

## 🛠️ Tech Stack

- **React** (functional components + hooks)  
- **React Confetti** for win/lose animations  
- **clsx** for conditional styling  
- **Custom utility functions** for random word selection & farewell messages  
- **Modern CSS** (Flexbox/Grid for layout)  

---

## 📂 How It Works

1. A random word is chosen at the start of each game.  
2. The player selects letters using the on-screen keyboard.  
3. Correct letters are revealed; wrong letters eliminate a programming language chip.  
4. The game ends when:
   - ✅ The word is fully guessed (win), or  
   - ❌ Time runs out / guesses run out (lose).  
