// Ses ve Oyun Durumu Değişkenleri
let correctSound = new Audio('assets/correct.wav'); 
let wrongSound = new Audio('assets/wrong.wav');
let isMuted = false;

let solvedCities = []; // Doğru bilip YEŞİL yaptığımız şehirler
let missedCities = []; // Yanlış yapıp KIRMIZI (bilemediğimiz) olan şehirler

let timeLeft = 100;
let questionTimer;
let totalScore = 0;
let userName = window.name;
let currentQuestion = 0;
let correctAnswersCount = 0;
let currentCity = '';
let questionStartTime;
const maxTimePerQuestion = 15;
const maxScorePerQuestion = 1000;
let lives = 3;
let mainTimer;

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
    { image: 'assets/10.jpg', clue: 'Kayaların içinde inşa edilmiş olan Sumela manastır, Karadeniz bölgesinde hangi şehirde yer alır?', answer: 'Trabzon' },
    { image: 'assets/11.jpg', clue: 'Mevlana Müzesi ve hoşgörü kenti olarak bilinen ilimiz hangisidir?', answer: 'Konya' },
    { image: 'assets/12.jpg', clue: 'Efsanevi Truva Atı\'na ev sahipliği yapan ve şehitler diyarı olarak bilinen ilimiz hangisidir?', answer: 'Çanakkale' },
    { image: 'assets/13.jpg', clue: 'Dünyaca ünlü Zeugma Mozaik Müzesi ve mutfağıyla meşhur ilimiz hangisidir?', answer: 'Gaziantep' },
    { image: 'assets/14.jpg', clue: 'Gün doğumu ve batımının en güzel izlendiği Nemrut Dağı heykelleri hangi ilimizdedir?', answer: 'Adıyaman' },
    { image: 'assets/15.jpg', clue: 'Binbir Kilise Şehri olarak bilinen Ani Harabeleri hangi sınır şehrimizde yer alır?', answer: 'Kars' },
    { image: 'assets/16.jpg', clue: 'Osmanlı\'nın ilk başkentlerinden olan, Ulu Cami ve kış turizmi merkezi Uludağ ile ünlü ilimiz hangisidir?', answer: 'Bursa' },
    { image: 'assets/17.jpg', clue: 'Türkiye\'nin en yüksek dağı olan Ağrı Dağı ve İshak Paşa Sarayı hangi ilimizdedir?', answer: 'Ağrı' },
    { image: 'assets/18.jpg', clue: 'Ölüdeniz, Bodrum ve Marmaris gibi turizm cennetlerine ev sahipliği yapan ilimiz hangisidir?', answer: 'Muğla' },
    { image: 'assets/19.jpg', clue: 'Kendine has taş mimarisi ve tarihi dokusuyla büyüleyen, Mezopotamya\'nın incisi şehrimiz hangisidir?', answer: 'Mardin' },
    { image: 'assets/20.jpg', clue: 'Seyhan nehri üzerindeki tarihi Taş Köprü ile bilinen ve kebabıyla ünlü şehrimiz hangisidir?', answer: 'Adana' },
    { image: 'assets/21.jpg', clue: 'UNESCO listesindeki Divriği Ulu Camii ve Darüşşifası hangi ilimizdedir?', answer: 'Sivas' },
    { image: 'assets/22.jpg', clue: 'Hitit İmparatorluğu\'nun başkenti Hattuşaş\'a ev sahipliği yapan ilimiz hangisidir?', answer: 'Çorum' },
    { image: 'assets/23.jpg', clue: 'Denizin ortasındaki Kızkalesi ile tanınan Akdeniz şehrimiz hangisidir?', answer: 'Mersin' },
    { image: 'assets/24.jpeg', clue: 'Ayder Yaylası, çay bahçeleri ve Fırtına Deresi ile ünlü Karadeniz ilimiz hangisidir?', answer: 'Rize' }
];

// Ses Aç/Kapa
function toggleSound() {
    isMuted = !isMuted;
    const btn = document.getElementById('sound-toggle');
    if (isMuted) {
        btn.innerText = '🔇';
        btn.classList.add('muted');
    } else {
        btn.innerText = '🔊';
        btn.classList.remove('muted');
    }
}

// Konfeti Efekti
function triggerConfetti() {
    var count = 200;
    var defaults = { origin: { y: 0.7 } };
    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

function countdown() {
    if (timeLeft >= 0) {
        document.getElementById('timer').innerText = timeLeft;
        const timerElement = document.getElementById('timer');
        if (timeLeft <= 10) timerElement.classList.add('warning');
        else timerElement.classList.remove('warning');
        
        timeLeft--;
        mainTimer = setTimeout(countdown, 1000);
    } else {
        clearTimeout(mainTimer);
        showMainTimeUpNotification();
    }
}

function startGame() {
    solvedCities = [];
    missedCities = []; // Listeyi sıfırla
    totalScore = 0;
    currentQuestion = 0;
    correctAnswersCount = 0;
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
    document.getElementById('lives-display').textContent = '❤'.repeat(lives);
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showFinalScore();
        return;
    }
    
    // Haritayı merkeze al (reset)
    map.flyTo([39.0, 35.0], 7, { animate: true, duration: 1.5 });
    
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
    maxZoom: 10, minZoom: 6
}).addTo(map);

var geojsonLayer;

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
        
        let targetLayer; // Doğru cevabın katmanı

        geojsonLayer.eachLayer(function(layer) {
            if(layer.feature.properties.name === currentCity) {
                targetLayer = layer;
            }
        });

        if (clickedCity === currentCity) {
            // --- DOĞRU CEVAP ---
            if (!isMuted) correctSound.play();

            const timeElapsed = (Date.now() - questionStartTime) / 1000;
            const pointsEarned = calculateTimeBasedScore(timeElapsed);
            totalScore += pointsEarned;
            correctAnswersCount++;
            
            document.querySelectorAll('#score').forEach(el => el.textContent = totalScore);
            
            // --- YENİ KISIM: Can Yenileme Mantığı ---
            let extraMsg = "";
            if (lives < 3) { // Eğer can 3'ten azsa
                lives++;    // 1 can ekle
                updateLivesDisplay();
                extraMsg = "<br>❤️ Can Yenilendi!"; // Mesaja ekle
            }
            // ----------------------------------------
            
            // YEŞİL YAP
            solvedCities.push(clickedCity);
            if(targetLayer) {
                targetLayer.setStyle({ fillColor: "#2ecc71", fillOpacity: 0.8, color: "#fff", weight: 2 });
            }
            
            if (currentQuestion >= questions.length - 1) {
                currentQuestion++;
                showFinalScore();
            } else {
                showNotification(`Doğru! ${pointsEarned} puan kazandınız.${extraMsg}`, true);
            }

        } else {
            // --- YANLIŞ CEVAP ---
            if (!isMuted) wrongSound.play();

            lives--;
            updateLivesDisplay();

            // 1. Bizim seçtiğimiz şehri BOYAMA (şeffaf kalsın)

            // 2. Bilemediğimiz SORUNUN DOĞRU CEVABINI Kırmızı Yap
            if(targetLayer) {
                missedCities.push(currentCity); // Bilemediğimiz şehri listeye ekle
                
                // Şehri KIRMIZI'ya boya (#e74c3c)
                targetLayer.setStyle({ 
                    fillColor: "#e74c3c", // Kırmızı
                    fillOpacity: 0.8, 
                    color: "#fff", 
                    weight: 2 
                });
                
                // Haritayı doğru ama bilemediğimiz şehre zoomla
                map.flyTo(targetLayer.getBounds().getCenter(), 8, { animate: true, duration: 1.5 });
            }
            
            if (lives <= 0) {
                showGameOver();
            } else {
                // Bildirim
                showNotification(`Yanlış! Doğru cevap <b>${currentCity}</b> iliydi. <br>${lives} canınız kaldı.`, false, false);
            }
        }
    }

    geojsonLayer = L.geoJson(data, {
        style: style,
        onEachFeature: function (feature, layer) {
            var cityName = feature.properties.name;
            layer.on({
                mouseover: function(e) {
                    // Yeşil (bilinen) veya Kırmızı (kaçırılan) değilse sarı yak
                    if (!solvedCities.includes(cityName) && !missedCities.includes(cityName)) {
                        e.target.setStyle({ fillColor: "#ffc107", fillOpacity: 0.7 });
                    }
                },
                mouseout: function(e) {
                    // Rengi eski haline döndür (ama kalıcı boyananlara dokunma)
                    if (!solvedCities.includes(cityName) && !missedCities.includes(cityName)) {
                        geojsonLayer.resetStyle(e.target);
                    }
                },
                click: function(e) {
                    // Daha önce çözülmüş veya kaçırılmış şehre tıklanmasın
                    if (solvedCities.includes(cityName) || missedCities.includes(cityName)) return;
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
        // Tekrar dene butonu kapalı, sadece İleri
        retryButton.style.display = 'none'; 
        nextButton.style.display = 'block';
    }
    
    notificationText.innerHTML = message;
    notification.style.display = 'block';
}

function nextQuestion() {
    document.getElementById('notification').style.display = 'none';
    currentQuestion++;
    
    if (currentQuestion >= questions.length) {
        showFinalScore();
    } else {
        loadQuestion();
    }
}

function retryQuestion() {
    document.getElementById('notification').style.display = 'none';
    map.flyTo([39.0, 35.0], 7, { duration: 1 });
    questionStartTime = Date.now();
    startQuestionTimer(maxTimePerQuestion);
}

function showMainTimeUpNotification() {
    clearInterval(questionTimer);
    document.querySelector('.popup').style.display = 'none';
    document.getElementById('time-up-notification').style.display = 'none';
    
    const notification = document.getElementById('notification');
    notification.className = 'notification error';
    
    document.getElementById('notification-text').innerHTML = `
        <div class="final-score">
            <h2>Süre Doldu!</h2>
            <p>Toplam Puan: ${totalScore}</p>
            <p>Doğru Sayısı: ${correctAnswersCount}/${questions.length}</p>
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
    currentQuestion++;
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
            <p>Doğru Sayısı: ${correctAnswersCount}/${questions.length}</p>
            <button onclick="window.location.href='index.html'">Ana Menü</button>
        </div>
    `;
    
    notification.querySelector('.notification-buttons').style.display = 'none';
    notification.style.display = 'block';
    
    sendScoreToAPI();
}

async function showFinalScore() {
    triggerConfetti();

    const notification = document.getElementById('notification');
    notification.className = 'notification success';
    
    document.getElementById('notification-text').innerHTML = `
        <div class="final-score">
            <h2>Tebrikler!</h2>
            <p>Tüm sorular tamamlandı.</p>
            <p>Toplam Puan: ${totalScore}</p>
            <p>Doğru Sayısı: ${correctAnswersCount}/${questions.length}</p>
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