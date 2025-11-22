// Game state variables
let timeLeft = 100;
let questionTimer;
let totalScore = 0;
let userName = window.name;
let currentQuestion = 0;
let correctAnswersCount = 0; // YENİ: Doğru cevap sayacı
let currentCity = '';
let questionStartTime;
const maxTimePerQuestion = 15;
const maxScorePerQuestion = 1000;
let lives = 3;
let mainTimer;

// Questions array
const questions = [
    { image: 'assets/1.jpeg', clue: 'Topkapı Sarayı, Osmanlı İmparatorları\'nın yaşadığı yer hangi ilimizdedir?', answer: 'İstanbul' },
    { image: 'assets/2.jpeg', clue: 'Türkiye Cumhuriyeti\'nin kurucusu Mustafa Kemal Atatürk\'ün mezarı Anıtkabir hangi ilimizdedir?', answer: 'Ankara' },
    { image: 'assets/3.jpeg', clue: 'Artemis Tapınağı\'na ev sahipliği yapan Efes Antik Kenti hangi ilimizdedir?', answer: 'İzmir' },
    { image: 'assets/4.jpeg', clue: 'Beyaz traverten teraslarıyla ünlü bu doğa harikası, sıcak su kaynaklarıyla tanınan hangi şehirde yer alıyor?', answer: 'Denizli' },
    { image: 'assets/5.jpeg', clue: 'Dünyanın en eski tapınak kompleksi olarak bilinen Göbeklitepe hangi şehirde bulunuyor?', answer: 'Şanlıurfa' },
    { image: 'assets/6.jpeg', clue: 'Peri Bacaları ve yeraltı şehirleriyle ünlü Kapadokya balon turlarıyla bilinen bölge hangi şehirde yer alır?', answer: 'Nevşehir' },
    { image: 'assets/7.jpeg', clue: 'Sazova bilim kültür ve sanat parkı hangi ilimizdedir?', answer: 'Eskişehir' },
    { image: 'assets/8.jpeg', clue: 'Aspendos Tiyatrosu hangi tarihi kente aittir?', answer: 'Antalya' },
    { image: 'assets/9.jpeg', clue: 'UNESCO Dünya Mirası Listesi\'nde yer alan ve Osmanlı dönemine ait geleneksel evleriyle ünlü Safranbolu hangi ilimizdedir?', answer: 'Karabük' },
    { image: 'assets/10.jpeg', clue: 'Kayaların içinde inşa edilmiş olan Sumela manastır, Karadeniz bölgesinde hangi şehirde yer alır?', answer: 'Trabzon' }
];

// Basic timer function
function countdown() {
    if (timeLeft >= 0) {
        document.getElementById('timer').innerText = timeLeft;
        const timerElement = document.getElementById('timer');
        
        if (timeLeft <= 10) {
            timerElement.classList.add('warning');
        } else {
            timerElement.classList.remove('warning');
        }
        
        timeLeft--;
        mainTimer = setTimeout(countdown, 1000);
    } else {
        clearTimeout(mainTimer);
        showMainTimeUpNotification();
    }
}

// Game initialization
function startGame() {
    totalScore = 0;
    currentQuestion = 0;
    correctAnswersCount = 0; // Sıfırla
    lives = 3;
    timeLeft = 100;
    shuffleArray(questions);
    updateLivesDisplay();
    loadQuestion();
    countdown();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateLivesDisplay() {
    const livesElement = document.getElementById('lives-display');
    livesElement.textContent = '❤'.repeat(lives);
}

function loadQuestion() {
    // Güvenlik kontrolü
    if (currentQuestion >= questions.length) {
        showFinalScore();
        return;
    }
    
    const question = questions[currentQuestion];
    currentCity = question.answer;
    
    document.getElementById('clue-image').src = question.image;
    document.getElementById('clue-text').innerText = `İpucu: ${question.clue}`;
    document.querySelector('.popup').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
    
    questionStartTime = Date.now();
    startQuestionTimer(maxTimePerQuestion);
}

function startQuestionTimer(seconds) {
    let qTime = seconds;
    document.getElementById('question-timer').innerText = qTime;
    
    clearInterval(questionTimer);
    questionTimer = setInterval(() => {
        qTime--;
        document.getElementById('question-timer').innerText = qTime;
        if (qTime <= 0) {
            clearInterval(questionTimer);
            showTimeUpNotification();
        }
    }, 1000);
}

// Map setup
var map = L.map('map', {
    center: [39.0, 35.0],
    zoom: 7,
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    attributionControl: false
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 10,
    minZoom: 6
}).addTo(map);

$.getJSON('https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json', function(data) {
    function style(feature) {
        return {
            color: "#FFF",
            weight: 1,
            fillColor: "#3a7dca",
            fillOpacity: 0.1
        };
    }

    function checkAnswer(clickedCity) {
        clearInterval(questionTimer);
        
        if (clickedCity === currentCity) {
            const timeElapsed = (Date.now() - questionStartTime) / 1000;
            const pointsEarned = calculateTimeBasedScore(timeElapsed);
            totalScore += pointsEarned;
            
            // Doğru cevap sayacını artır
            correctAnswersCount++;
            
            document.querySelectorAll('#score').forEach(el => el.textContent = totalScore);
            
            // DÜZELTME: Soru indeksini burada artırmıyoruz. 
            // Kullanıcı "Sıradaki Soru" butonuna basınca nextQuestion() içinde artacak.
            // Sadece son soruysa oyun bitmeli.
            
            if (currentQuestion >= questions.length - 1) {
                // Son soruyu bildi, indeksi artırıp bitiriyoruz
                currentQuestion++;
                showFinalScore();
            } else {
                showNotification(`Doğru! ${pointsEarned} puan kazandınız.`, true);
            }
        } else {
            lives--;
            updateLivesDisplay();
            
            if (lives <= 0) {
                showGameOver();
            } else {
                showNotification(`Yanlış cevap! ${lives} hakkınız kaldı.`, false, true);
            }
        }
    }

    var geojsonLayer = L.geoJson(data, {
        style: style,
        onEachFeature: function (feature, layer) {
            var cityName = feature.properties.name;
            layer.on({
                mouseover: function(e) {
                    e.target.setStyle({ fillColor: "#ffc107", fillOpacity: 0.7 });
                },
                mouseout: function(e) {
                    geojsonLayer.resetStyle(e.target);
                },
                click: function(e) {
                    checkAnswer(cityName);
                }
            });
            var centroid = turf.centroid(feature).geometry.coordinates;
            var label = L.divIcon({ className: 'city-label', html: cityName, iconSize: null });
            L.marker([centroid[1], centroid[0]], { icon: label, interactive: false }).addTo(map);
        }
    }).addTo(map);
});

function calculateTimeBasedScore(timeElapsed) {
    if (timeElapsed >= maxTimePerQuestion) return 0;
    const score = Math.floor(maxScorePerQuestion * (1 - (timeElapsed / maxTimePerQuestion)));
    return Math.max(0, score);
}

// Notification Sistemi
function showNotification(message, isSuccess, showRetry = false) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    const nextButton = notification.querySelector('.next-button');
    const retryButton = notification.querySelector('.retry-button');
    
    notification.className = 'notification';
    
    if (isSuccess) {
        notification.classList.add('success');
        nextButton.style.display = 'block';
        retryButton.style.display = 'none';
    } else {
        notification.classList.add('error');
        retryButton.style.display = 'block'; 
        nextButton.style.display = 'block';
    }
    
    notificationText.innerHTML = message;
    notification.style.display = 'block';
}

// DÜZELTME: Sıradaki soruya geçiş mantığı
function nextQuestion() {
    document.getElementById('notification').style.display = 'none';
    
    // ARTIK BURADA ARTIRIYORUZ (Hem doğru hem yanlış cevapta çalışır)
    currentQuestion++;
    
    if (currentQuestion >= questions.length) {
        showFinalScore();
    } else {
        loadQuestion();
    }
}

function retryQuestion() {
    document.getElementById('notification').style.display = 'none';
    questionStartTime = Date.now();
    startQuestionTimer(maxTimePerQuestion);
}

function showMainTimeUpNotification() {
    clearInterval(questionTimer);
    document.querySelector('.popup').style.display = 'none';
    document.getElementById('time-up-notification').style.display = 'none';
    
    const notification = document.getElementById('notification');
    notification.className = 'notification error';
    
    // Doğru sayısını currentQuestion yerine correctAnswersCount'tan alıyoruz
    document.getElementById('notification-text').innerHTML = `
        <div class="final-score">
            <h2>Süre Doldu!</h2>
            <p>Toplam Puan: ${totalScore}</p>
            <p>Doğru Sayısı: ${correctAnswersCount}/10</p>
            <button onclick="window.location.href='index.html'">Ana Menü</button>
        </div>
    `;
    
    notification.querySelector('.next-button').style.display = 'none';
    notification.querySelector('.retry-button').style.display = 'none';
    notification.style.display = 'block';
}

function showTimeUpNotification() {
    lives--;
    updateLivesDisplay();
    
    if (lives <= 0) {
        showGameOver();
    } else {
        document.getElementById('time-up-notification').style.display = 'block';
        document.querySelector('.overlay').style.display = 'block';
        document.querySelector('.popup').style.display = 'none';
    }
}

function retryTimeUpQuestion() {
    document.getElementById('time-up-notification').style.display = 'none';
    document.querySelector('.popup').style.display = 'block';
    questionStartTime = Date.now();
    startQuestionTimer(maxTimePerQuestion);
}

function closeTimeUpNotification() {
    document.getElementById('time-up-notification').style.display = 'none';
    currentQuestion++; // Zaman dolup geçilirse de artır
    if (currentQuestion >= questions.length) {
        showFinalScore();
    } else {
        loadQuestion();
    }
}

async function showGameOver() {
    const notification = document.getElementById('notification');
    notification.className = 'notification error';
    
    document.getElementById('notification-text').innerHTML = `
        <div class="final-score">
            <h2>Oyun Bitti!</h2>
            <p>Haklarınız tükendi.</p>
            <p>Toplam Puan: ${totalScore}</p>
            <p>Doğru Sayısı: ${correctAnswersCount}/10</p>
            <button onclick="window.location.href='index.html'">Ana Menü</button>
        </div>
    `;
    
    notification.querySelector('.notification-buttons').style.display = 'none';
    notification.style.display = 'block';
    
    sendScoreToAPI();
}

async function showFinalScore() {
    const notification = document.getElementById('notification');
    notification.className = 'notification success';
    
    document.getElementById('notification-text').innerHTML = `
        <div class="final-score">
            <h2>Tebrikler!</h2>
            <p>Tüm sorular tamamlandı.</p>
            <p>Toplam Puan: ${totalScore}</p>
            <p>Doğru Sayısı: ${correctAnswersCount}/10</p>
            <button onclick="window.location.href='index.html'">Ana Menü</button>
        </div>
    `;
    
    notification.querySelector('.notification-buttons').style.display = 'none';
    notification.style.display = 'block';
    
    sendScoreToAPI();
}

async function sendScoreToAPI() {
    if(!userName) return;
    try {
        await fetch("http://localhost:5051/addUserPoint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: userName, score: totalScore })
        });
    } catch (e) {
        console.error(e);
    }
}

document.getElementById('show-map-button').addEventListener('click', function() {
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    questionStartTime = Date.now();
});

window.onload = startGame;