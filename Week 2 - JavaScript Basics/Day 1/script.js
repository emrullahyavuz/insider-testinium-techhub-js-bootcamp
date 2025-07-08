// Kullanıcı bilgileri için nesne
let userInfo = null;

// Sepet için dizi (array)
let cart = [];

// DOM elementlerini seçme
const getUserInfoBtn = document.getElementById('getUserInfo');
const userDisplay = document.getElementById('userDisplay');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const addProductBtn = document.getElementById('addProduct');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCart');
const addSampleBtns = document.querySelectorAll('.add-sample');

// Kullanıcı bilgilerini alma fonksiyonu
function getUserInfo() {
    const name = prompt('Adınızı girin:');
    if (!name) return;
    
    const age = prompt('Yaşınızı girin:');
    if (!age) return;
    
    const profession = prompt('Mesleğinizi girin:');
    if (!profession) return;
    
    // Kullanıcı bilgilerini nesne içinde saklama
    userInfo = {
        name: name,
        age: parseInt(age),
        profession: profession
    };
    
    displayUserInfo();
    showMessage('Kullanıcı bilgileri başarıyla kaydedildi!', 'success');
}

// Kullanıcı bilgilerini gösterme fonksiyonu
function displayUserInfo() {
    if (userInfo) {
        userDisplay.innerHTML = `
            <p><strong>Ad:</strong> ${userInfo.name}</p>
            <p><strong>Yaş:</strong> ${userInfo.age}</p>
            <p><strong>Meslek:</strong> ${userInfo.profession}</p>
        `;
    } else {
        userDisplay.innerHTML = '<p>Kullanıcı bilgileri henüz girilmedi.</p>';
    }
}

// Sepete ürün ekleme fonksiyonu
function addToCart(name, price) {
    // Aynı ürünün sepette olup olmadığını kontrol et
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        // Eğer ürün zaten sepette varsa miktarını artır
        existingItem.quantity += 1;
        showMessage(`${name} ürününün miktarı artırıldı!`, 'success');
    } else {
        // Yeni ürün ekle
        const newItem = {
            name: name,
            price: parseFloat(price),
            quantity: 1
        };
        cart.push(newItem);
        showMessage(`${name} sepete eklendi!`, 'success');
    }
    
    updateCartDisplay();
    updateTotal();
}

// Sepetten ürün çıkarma fonksiyonu
function removeFromCart(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    showMessage(`${removedItem.name} sepetten çıkarıldı!`, 'success');
    updateCartDisplay();
    updateTotal();
}

// Ürün miktarını artırma fonksiyonu
function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCartDisplay();
    updateTotal();
}

// Ürün miktarını azaltma fonksiyonu
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        updateCartDisplay();
        updateTotal();
    } else {
        removeFromCart(index);
    }
}

// Sepeti temizleme fonksiyonu
function clearCart() {
    if (cart.length === 0) {
        showMessage('Sepet zaten boş!', 'error');
        return;
    }
    
    if (confirm('Sepeti tamamen temizlemek istediğinizden emin misiniz?')) {
        cart = [];
        updateCartDisplay();
        updateTotal();
        showMessage('Sepet temizlendi!', 'success');
    }
}

// Sepet görünümünü güncelleme fonksiyonu
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Sepetiniz boş.</p>';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)} TL</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Kaldır</button>
                </div>
            </div>
        `).join('');
    }
    saveCartToStorage(); // Her değişiklikte kaydet
}

// Toplam fiyatı hesaplama fonksiyonu (reduce() metodu kullanarak)
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Mesaj gösterme fonksiyonu
function showMessage(message, type) {
    // Önceki mesajları temizle
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Yeni mesaj oluştur
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Mesajı sayfaya ekle
    document.querySelector('.container').insertBefore(messageDiv, document.querySelector('main'));
    
    // 3 saniye sonra mesajı kaldır
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Manuel ürün ekleme fonksiyonu
function addManualProduct() {
    const name = productNameInput.value.trim();
    const price = productPriceInput.value.trim();
    
    if (!name || !price) {
        showMessage('Lütfen ürün adı ve fiyatını girin!', 'error');
        return;
    }
    
    if (isNaN(price) || parseFloat(price) <= 0) {
        showMessage('Lütfen geçerli bir fiyat girin!', 'error');
        return;
    }
    
    addToCart(name, parseFloat(price));
    
    // Form alanlarını temizle
    productNameInput.value = '';
    productPriceInput.value = '';
    productNameInput.focus();
}

// Event Listeners
getUserInfoBtn.addEventListener('click', getUserInfo);
addProductBtn.addEventListener('click', addManualProduct);
clearCartBtn.addEventListener('click', clearCart);

// Örnek ürün butonları için event listener
addSampleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const name = productCard.dataset.name;
        const price = productCard.dataset.price;
        addToCart(name, price);
    });
});

// Enter tuşu ile ürün ekleme
productNameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addManualProduct();
    }
});

productPriceInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addManualProduct();
    }
});

// Sayfa yüklendiğinde başlangıç durumu
document.addEventListener('DOMContentLoaded', function() {
    displayUserInfo();
    loadCartFromStorage(); // localStorage'dan sepeti yükle
    updateTotal();
    
    // Konsola bilgi mesajı
    console.log('🛒 Alışveriş Sepeti Uygulaması Başlatıldı!');
    console.log('📋 Özellikler:');
    console.log('- Kullanıcı bilgileri nesne içinde saklanıyor');
    console.log('- Sepet dizi (array) kullanılarak yönetiliyor');
    console.log('- Toplam fiyat reduce() metodu ile hesaplanıyor');
    console.log('- Dinamik ürün ekleme ve çıkarma');
    console.log('- Miktar kontrolü ve sepet yönetimi');
    console.log('- LocalStorage ile veri kalıcılığı');
});

// Gelişmiş özellikler için yardımcı fonksiyonlar

// Sepeti localStorage'a kaydetme
function saveCartToStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Sepeti localStorage'dan yükleme
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
        updateTotal();
    }
} 