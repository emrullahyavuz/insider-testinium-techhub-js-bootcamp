// DOM elementleri
const countdownInput = document.getElementById('countdown-input');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const countdownText = document.getElementById('countdown-text');
const statusText = document.getElementById('status-text');
const countdownDisplay = document.querySelector('.countdown-display');

// Değişkenler
let countdownInterval;
let currentTime;
let isRunning = false;

// Sayfa yüklendiğinde başlangıç değerini ayarla
window.addEventListener('load', () => {
    currentTime = parseInt(countdownInput.value);
    updateDisplay();
});

// Input değeri değiştiğinde
countdownInput.addEventListener('input', () => {
    if (!isRunning) {
        currentTime = parseInt(countdownInput.value) || 0;
        updateDisplay();
        clearStatus();
    }
});

// Başlat butonu
startBtn.addEventListener('click', startCountdown);

// Sıfırla butonu
resetBtn.addEventListener('click', resetCountdown);

// Geri sayım başlatma fonksiyonu
function startCountdown() {
    if (isRunning) return;
    
    // Input'tan değeri al
    const inputValue = parseInt(countdownInput.value);
    
    // Geçerli değer kontrolü
    if (!inputValue || inputValue <= 0) {
        showStatus('Lütfen geçerli bir süre giriniz!', 'error');
        return;
    }
    
    // Başlangıç değerini ayarla
    currentTime = inputValue;
    isRunning = true;
    
    // Buton durumlarını güncelle
    startBtn.disabled = true;
    startBtn.textContent = 'Çalışıyor...';
    
    // Durum mesajını temizle
    clearStatus();
    
    // Geri sayım başlat
    countdownInterval = setInterval(() => {
        currentTime--;
        updateDisplay();
        
        // Süre doldu mu kontrol et
        if (currentTime <= 0) {
            stopCountdown();
            showStatus('Süre doldu!', 'success');
            countdownDisplay.classList.add('finished');
        }
    }, 1000);
}

// Geri sayımı durdurma fonksiyonu
function stopCountdown() {
    clearInterval(countdownInterval);
    isRunning = false;
    
    // Buton durumlarını güncelle
    startBtn.disabled = false;
    startBtn.textContent = 'Başlat';
    
    // Animasyonu kaldır
    countdownDisplay.classList.remove('finished');
}

// Sıfırlama fonksiyonu
function resetCountdown() {
    stopCountdown();
    
    // Değerleri sıfırla
    currentTime = parseInt(countdownInput.value) || 10;
    updateDisplay();
    clearStatus();
}

// Ekranı güncelleme fonksiyonu
function updateDisplay() {
    countdownText.textContent = currentTime;
}

// Durum mesajı gösterme fonksiyonu
function showStatus(message, type = '') {
    statusText.textContent = message;
    statusText.className = type ? type : '';
}

// Durum mesajını temizleme fonksiyonu
function clearStatus() {
    statusText.textContent = '';
    statusText.className = '';
}

// Enter tuşu ile başlatma
countdownInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isRunning) {
        startCountdown();
    }
});

// Sayfa kapatılırken interval'i temizle
window.addEventListener('beforeunload', () => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
}); 