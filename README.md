# <div align="center">🌍✨ **GeoHunt – Interactive Geography Game** ✨🌍

### GMT 458 – Web GIS • Assignment 2
https://gmt-458-web-gis.github.io/geogame-mervanozg/
</div>

<div align="center">
  <img src="assets/logo.png" alt="GeoHunt Logo" width="400"/>
</div>

<p align="center">
  <strong>A fast-paced, map-based geography challenge exploring Türkiye cultural and geographical landmarks.</strong>
</p>

---

# 📌 **1. Design Overview**

## 🎯 **Game Concept**

**GeoHunt** is a time-limited, life-based geography quiz where players guess the correct Turkish province based on clues and images.

**Gameplay Summary:**

* Guess the province on an interactive Turkey map.
* Each question has its own timer.
* Wrong answers cost **lives**, correct answers give **score**.
* Game ends when:
  ✔ Total time ends
  ✔ Lives reach zero
  ✔ All 10 questions are completed

---

# 🧩 **2. Requirements & Game Flow**

## 🏠 **Main Page (`index.html`)**

* Clean, modern welcome screen
* Input field for player name
* Start button with animated UI elements

## 🗺️ **Game Screen (`game.html`)**

* Dark-themed interactive Leaflet map
* Header bar shows:

  * ❤️ Lives
  * ⏳ Remaining time
  * 🏆 Score
  * 🎮 Game title

## ❓ **Question Popup**

A stylish modal appears *before each round*:

✨ Image clue
✨ Text hint
✨ 15-second question timer
✨ Score panel
✨ “Show Map” button to begin guessing

<div align="center">
  <img width="700" src="https://github.com/user-attachments/assets/0e764275-e1e8-4b52-ac00-4ca68243a4f5" />
</div>

## 🗺️ **Map Interaction**

Players select the province by clicking directly on the map.

<div align="center">
  <img width="700" src="https://github.com/user-attachments/assets/4b179eb4-07ba-4193-939d-2775fe5dd238" />
</div>

---

# 🎮 **3. Game Mechanics**

## ⏱️ **Timers**

* **100 sec total game timer**
* **15 sec per question timer**

## ❤️ **Lives**

* Player starts with **3 lives**
* Wrong answer → **-1 life**

## 🏆 **Scoring System**

* Max **1000 points** per question
* Score decreases as question time runs out
* Faster = higher score

---

# 🗂️ **4. Question & Data Structure**

* Total **10 questions**
* Shuffled randomly at start (`shuffleArray`)
* Each question includes:

  * Clue text
  * Image
  * Correct province name

---

# 🧪 **5. Technologies Used**

| Library / Tool           | Purpose                                   |
| ------------------------ | ----------------------------------------- |
| **Leaflet.js**           | Interactive mapping + province boundaries |
| **Turf.js**              | Centroid calculations for city labels     |
| **jQuery**               | JSON loading (`$.getJSON`)                |
| **CartoDB Dark Basemap** | Beautiful, modern dark map tiles          |
| **GeoJSON**              | Türkiye province boundaries               |

---


