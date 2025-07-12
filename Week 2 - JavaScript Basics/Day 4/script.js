// DOM elementleri
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const titleError = document.getElementById('title-error');
const priorityError = document.getElementById('priority-error');
const toastContainer = document.getElementById('toast-container');

// Filtreleme butonları
const showAllBtn = document.getElementById('show-all');
const showCompletedBtn = document.getElementById('show-completed');
const showPendingBtn = document.getElementById('show-pending');
const sortSelect = document.getElementById('sort-select');

// İstatistik elementleri
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const pendingTasksEl = document.getElementById('pending-tasks');

// Görev verilerini saklamak için array
let tasks = [];
let currentFilter = 'all';

// Sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Uygulamayı başlat
function initializeApp() {
    setupEventListeners();
    updateDisplay();
    // Sayfa yüklendiğinde priority validation'ı çalıştır
    validatePriority();
}

// Event listener'ları ayarla
function setupEventListeners() {
    // Form submit eventi
    taskForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    document.getElementById('task-title').addEventListener('input', validateTitle);
    
    // Priority radio buttons için change event'lerini ekle
    const priorityRadios = document.querySelectorAll('input[name="priority"]');
    
    priorityRadios.forEach(radio => {
        radio.addEventListener('change', validatePriority);
    });
    
    // Filtreleme butonları
    showAllBtn.addEventListener('click', () => setFilter('all'));
    showCompletedBtn.addEventListener('click', () => setFilter('completed'));
    showPendingBtn.addEventListener('click', () => setFilter('pending'));
    
    // Sıralama değişikliği
    sortSelect.addEventListener('change', updateDisplay);
    
    // Event delegation için task list container'ına listener ekle
    taskList.addEventListener('click', handleTaskActions);
}

// Form submit işlemi
function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        // Form verilerini al
        const formData = new FormData(taskForm);
        const title = formData.get('title').trim();
        const description = formData.get('description').trim();
        const priority = formData.get('priority');
        
        // Form doğrulama
        if (!validateForm(title, priority)) {
            
            // Hatalı alanlara focus yap
            if (!title) {
                document.getElementById('task-title').focus();
            } else if (!priority) {
                // İlk radio button'a focus yap
                const firstRadio = document.querySelector('input[name="priority"]');
                if (firstRadio) {
                    firstRadio.focus();
                }
            }
            return;
        }
        
        // Yeni görev oluştur
        const newTask = {
            id: Date.now(),
            title: title,
            description: description,
            priority: priority,
            completed: false,
            createdAt: new Date()
        };
        
        // Görevi listeye ekle
        addTask(newTask);
        
        // Formu temizle
        clearForm();
        
        // Hata mesajlarını temizle
        clearErrors();
        
        // Ekranı güncelle
        updateDisplay();
        
        // Başarı toast mesajı göster
        showToast('Başarılı!', `"${title}" görevi başarıyla eklendi.`, 'success');
        
    } catch (error) {
        console.error('Görev eklenirken hata oluştu:', error);
        showError('Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.');
    }
}

// Form doğrulama
function validateForm(title, priority) {
    let isValid = true;
    
    // Önce tüm hata mesajlarını temizle
    clearErrors();
    
    // Başlık doğrulama
    if (!title) {
        showFieldError('title-error', 'Görev başlığı zorunludur!');
        isValid = false;
    } else if (title.length < 3) {
        showFieldError('title-error', 'Görev başlığı en az 3 karakter olmalıdır!');
        isValid = false;
    }
    
    // Öncelik doğrulama
    if (!priority) {
        showFieldError('priority-error', 'Lütfen bir öncelik seçiniz!');
        isValid = false;
    }
    
    return isValid;
}

// Alan hatası göster
function showFieldError(fieldId, message) {
    
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Alan hatasını temizle
function clearFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Real-time title validation
function validateTitle() {
    const title = document.getElementById('task-title').value.trim();
    if (!title) {
        showFieldError('title-error', 'Görev başlığı zorunludur!');
    } else if (title.length < 3) {
        showFieldError('title-error', 'Görev başlığı en az 3 karakter olmalıdır!');
    } else {
        clearFieldError('title-error');
    }
}

// Real-time priority validation
function validatePriority() {
    
    const selectedPriority = document.querySelector('input[name="priority"]:checked');
    
    if (!selectedPriority) {
        showFieldError('priority-error', 'Lütfen bir öncelik seçiniz!');
    } else {
        clearFieldError('priority-error');
    }
}

// Tüm hataları temizle
function clearErrors() {
    clearFieldError('title-error');
    clearFieldError('priority-error');
}

// Genel hata mesajı göster
function showError(message) {
    showToast('Hata', message, 'error');
}

// Toast mesajı göster
function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="removeToast(this.parentElement)">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animasyon için kısa bir gecikme
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Toast mesajını otomatik kaldırma (3 saniye sonra)
    setTimeout(() => {
        removeToast(toast);
    }, 3000);
}

// Toast ikonu al
function getToastIcon(type) {
    switch (type) {
        case 'success':
            return '✓';
        case 'error':
            return '✕';
        case 'info':
            return 'ℹ';
        default:
            return '✓';
    }
}

// Toast'u kaldır
function removeToast(toast) {
    if (toast && toast.parentElement) {
        toast.classList.remove('show');
        toast.classList.add('hide');
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    }
}

// Görev ekleme
function addTask(task) {
    tasks.push(task);
}

// Görev silme
function deleteTask(taskId) {
    try {
        const taskToDelete = tasks.find(task => task.id === taskId);
        tasks = tasks.filter(task => task.id !== taskId);
        updateDisplay();
        
        if (taskToDelete) {
            showToast('Silindi', `"${taskToDelete.title}" görevi silindi.`, 'info');
        }
    } catch (error) {
        console.error('Görev silinirken hata oluştu:', error);
        showError('Görev silinirken bir hata oluştu.');
    }
}

// Görev durumunu değiştirme
function toggleTaskStatus(taskId) {
    try {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            updateDisplay();
            
            const status = task.completed ? 'tamamlandı' : 'bekleyen duruma alındı';
            showToast('Durum Güncellendi', `"${task.title}" görevi ${status}.`, 'success');
        }
    } catch (error) {
        console.error('Görev durumu değiştirilirken hata oluştu:', error);
        showError('Görev durumu değiştirilirken bir hata oluştu.');
    }
}

// Filtre ayarlama
function setFilter(filter) {
    currentFilter = filter;
    
    // Aktif buton stilini güncelle
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    updateDisplay();
}

// Filtrelenmiş görevleri al
function getFilteredTasks() {
    let filteredTasks = [...tasks];
    
    // Filtreleme
    switch (currentFilter) {
        case 'completed':
            filteredTasks = filteredTasks.filter(task => task.completed);
            break;
        case 'pending':
            filteredTasks = filteredTasks.filter(task => !task.completed);
            break;
        default:
            // Tümü - filtreleme yok
            break;
    }
    
    // Sıralama
    const sortBy = sortSelect.value;
    filteredTasks.sort((a, b) => {
        switch (sortBy) {
            case 'priority':
                const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'title':
                return a.title.localeCompare(b.title);
            case 'date':
            default:
                return b.createdAt - a.createdAt;
        }
    });
    
    return filteredTasks;
}

// Görev HTML'i oluştur
function createTaskHTML(task) {
    const priorityText = {
        'low': 'Düşük',
        'medium': 'Orta',
        'high': 'Yüksek'
    };
    
    const priorityClass = `priority-${task.priority}`;
    const completedClass = task.completed ? 'completed' : '';
    const completedText = task.completed ? 'Geri Al' : 'Tamamla';
    const completedBtnClass = task.completed ? 'btn-danger' : 'btn-success';
    
    const date = new Date(task.createdAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `
        <div class="task-item ${completedClass}" data-task-id="${task.id}">
            <div class="task-header">
                <div>
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn ${completedBtnClass} toggle-status" data-task-id="${task.id}">
                        ${completedText}
                    </button>
                    <button class="btn btn-danger delete-task" data-task-id="${task.id}">
                        Sil
                    </button>
                </div>
            </div>
            <div class="task-meta">
                <span class="task-priority ${priorityClass}">${priorityText[task.priority]}</span>
                <span class="task-date">${date}</span>
            </div>
        </div>
    `;
}

// HTML escape fonksiyonu (XSS koruması için)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event delegation ile görev aksiyonlarını handle et
function handleTaskActions(event) {
    event.stopPropagation(); // Event bubbling'i önle
    
    const target = event.target;
    
    // Tamamla/Geri Al butonu
    if (target.classList.contains('toggle-status')) {
        const taskId = parseInt(target.dataset.taskId);
        toggleTaskStatus(taskId);
    }
    
    // Sil butonu
    if (target.classList.contains('delete-task')) {
        const taskId = parseInt(target.dataset.taskId);
        if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
            deleteTask(taskId);
        }
    }
}

// Ekranı güncelle
function updateDisplay() {
    const filteredTasks = getFilteredTasks();
    
    // Görev listesini güncelle
    if (filteredTasks.length > 0) {
        taskList.innerHTML = filteredTasks.map(task => createTaskHTML(task)).join('');
        emptyState.style.display = 'none';
        taskList.style.display = 'grid';
    } else {
        taskList.style.display = 'none';
        emptyState.style.display = 'block';
        
        // Boş durum mesajını filtreye göre ayarla
        let message = 'Henüz görev eklenmemiş. İlk görevinizi ekleyerek başlayın!';
        if (currentFilter === 'completed') {
            message = 'Tamamlanan görev bulunamadı.';
        } else if (currentFilter === 'pending') {
            message = 'Bekleyen görev bulunamadı.';
        }
        emptyState.querySelector('p').textContent = message;
    }
    
    // İstatistikleri güncelle
    updateStatistics();
}

// İstatistikleri güncelle
function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// Formu temizle
function clearForm() {
    taskForm.reset();
    // Form temizlendikten sonra validation'ları çalıştır
    setTimeout(() => {
        validateTitle();
        validatePriority();
    }, 10);
}

// Hata yakalama için global error handler
window.addEventListener('error', (event) => {
    console.error('Global hata yakalandı:', event.error);
    showError('Beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin.');
});

// Promise rejection yakalama
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejection yakalandı:', event.reason);
    showError('Bir işlem sırasında hata oluştu.');
}); 