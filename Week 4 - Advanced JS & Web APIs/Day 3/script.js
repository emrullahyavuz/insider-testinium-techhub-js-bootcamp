const appendLocation = '.ins-api-users';

(function() {
    const API_URL = 'https://jsonplaceholder.typicode.com/users';
    const STORAGE_KEY = 'insApiUsers';
    const SESSION_KEY = 'insApiUsersReloaded';
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    function now() { return Date.now(); }

    function saveToStorage(users) {
        const data = { expire: now() + ONE_DAY_MS, users };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function loadFromStorage() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        try {
            const data = JSON.parse(raw);
            if (data.expire && data.expire > now() && Array.isArray(data.users)) {
                return data.users;
            } else {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    }

    function clearStorage() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function saveSessionReloaded() {
        sessionStorage.setItem(SESSION_KEY, '1');
    }
    function hasSessionReloaded() {
        return sessionStorage.getItem(SESSION_KEY) === '1';
    }

    function renderStyles() {
        if (document.getElementById('ins-api-users-style')) return;
        const style = document.createElement('style');
        style.id = 'ins-api-users-style';
        style.textContent = `
            .user-list-container {
                max-width: 600px;
                margin: 48px auto;
                background: linear-gradient(135deg, #f8ffae 0%, #43cea2 100%);
                border-radius: 20px;
                box-shadow: 0 8px 32px rgba(67, 206, 162, 0.18), 0 1.5px 8px rgba(52, 73, 94, 0.08);
                padding: 40px 28px 32px 28px;
                font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                position: relative;
            }
            .user-list-title {
                font-size: 2.3em;
                color: #222f3e;
                margin-bottom: 28px;
                text-align: center;
                font-weight: 700;
                letter-spacing: 1px;
                text-shadow: 0 2px 8px #fff7, 0 1px 0 #43cea2;
            }
            .user-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .user-item {
                background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
                border-radius: 14px;
                margin-bottom: 20px;
                padding: 22px 24px 18px 24px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 18px rgba(253, 160, 133, 0.13);
                position: relative;
                transition: box-shadow 0.25s, transform 0.18s;
                border: 1.5px solid #fff6;
                overflow: hidden;
                animation: fadeInCard 0.7s cubic-bezier(.4,1.4,.6,1) both;
            }
            @keyframes fadeInCard {
                0% { opacity: 0; transform: translateY(30px) scale(0.97); }
                100% { opacity: 1; transform: none; }
            }
            .user-item:hover {
                box-shadow: 0 8px 32px rgba(253, 160, 133, 0.22);
                transform: translateY(-2px) scale(1.012);
            }
            .user-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
            }
            .user-avatar {
                width: 38px;
                height: 38px;
                border-radius: 50%;
                background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 1.3em;
                font-weight: 700;
                margin-right: 14px;
                box-shadow: 0 2px 8px #43cea255;
            }
            .user-name {
                font-weight: 700;
                color: #185a9d;
                font-size: 1.13em;
                letter-spacing: 0.5px;
            }
            .user-email {
                color: #222f3e;
                font-size: 1em;
                margin: 8px 0 0 0;
                font-weight: 500;
                opacity: 0.85;
            }
            .user-address {
                color: #222f3e;
                font-size: 0.97em;
                margin-top: 10px;
                opacity: 0.7;
            }
            .delete-btn {
                background: linear-gradient(135deg, #ff5858 0%, #f09819 100%);
                color: #fff;
                border: none;
                border-radius: 8px;
                padding: 8px 20px;
                font-size: 1em;
                font-weight: 700;
                cursor: pointer;
                transition: background 0.18s, box-shadow 0.18s, transform 0.13s;
                margin-left: 16px;
                box-shadow: 0 2px 8px #ff585822;
                outline: none;
            }
            .delete-btn:hover {
                background: linear-gradient(135deg, #f09819 0%, #ff5858 100%);
                transform: scale(1.06);
                box-shadow: 0 4px 16px #ff585844;
            }
            .error-message {
                color: #fff; background: linear-gradient(90deg, #ff5858 0%, #f09819 100%); padding: 18px; border-radius: 10px; margin: 24px 0; text-align: center; font-weight: bold; font-size: 1.1em; box-shadow: 0 2px 12px #ff585822;
            }
            .loading-message {
                text-align:center;
                padding:48px 0 40px 0;
                color:#185a9d;
                font-weight:700;
                font-size:1.2em;
                letter-spacing:1px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .ins-spinner {
                width: 48px;
                height: 48px;
                border: 5px solid #43cea2;
                border-top: 5px solid #f09819;
                border-radius: 50%;
                animation: ins-spin 1s linear infinite;
                margin-bottom: 18px;
                box-shadow: 0 2px 12px #43cea244;
            }
            @keyframes ins-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .reload-btn {
                display: block;
                margin: 36px auto 0 auto;
                padding: 14px 38px;
                background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
                color: #fff;
                border: none;
                border-radius: 10px;
                font-size: 1.15em;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 4px 16px #185a9d33;
                transition: background 0.18s, transform 0.13s;
                letter-spacing: 0.5px;
            }
            .reload-btn:disabled {
                background: #aaa;
                cursor: not-allowed;
                opacity: 0.7;
            }
            .reload-btn:not(:disabled):hover {
                background: linear-gradient(135deg, #185a9d 0%, #43cea2 100%);
                transform: scale(1.04);
            }
        `;
        document.head.appendChild(style);
    }

    function showError(message) {
        getRoot().innerHTML = `<div class="error-message">${message}</div>`;
    }
    function showLoading() {
        getRoot().innerHTML = `
            <div class="loading-message">
                <div class="ins-spinner"></div>
                <div>Yükleniyor...</div>
            </div>
        `;
    }
    function getRoot() {
        return document.querySelector(appendLocation);
    }

    function renderUserList(users) {
        renderStyles();
        const container = document.createElement('div');
        container.className = 'user-list-container';
        container.innerHTML = `<div class="user-list-title">Kullanıcı Listesi</div>`;
        const ul = document.createElement('ul');
        ul.className = 'user-list';
        users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'user-item';
            li.dataset.id = user.id;
            li.innerHTML = `
                <div class="user-header">
                    <span class="user-name">${user.name}</span>
                    <button class="delete-btn" data-id="${user.id}">Sil</button>
                </div>
                <div class="user-email">📧 ${user.email}</div>
                <div class="user-address">🏠 ${user.address.street}, ${user.address.suite}, ${user.address.city}</div>
            `;
            ul.appendChild(li);
        });
        container.appendChild(ul);
        getRoot().innerHTML = '';
        getRoot().appendChild(container);
    }

    function renderReloadButton() {
        renderStyles();
        const btn = document.createElement('button');
        btn.className = 'reload-btn';
        btn.textContent = 'Kullanıcıları Yeniden Yükle';
        if (hasSessionReloaded()) btn.disabled = true;
        btn.addEventListener('click', function() {
            if (btn.disabled) return;
            btn.disabled = true;
            saveSessionReloaded();
            clearStorage();
            fetchAndRenderUsers();
        });
        getRoot().appendChild(btn);
    }

    function fetchUsers() {
        return fetch(API_URL)
            .then(res => {
                if (!res.ok) throw new Error('API error');
                return res.json();
            });
    }

    function deleteUser(id) {
        let users = loadFromStorage();
        if (!users) return;
        users = users.filter(u => u.id !== id);
        if (users.length === 0) {
            clearStorage();
        } else {
            saveToStorage(users);
        }
        renderUserListOrReload(users);
    }

    function renderUserListOrReload(users) {
        if (users && users.length > 0) {
            renderUserList(users);
        } else {
            getRoot().innerHTML = '';
            renderReloadButton();
        }
    }

    function fetchAndRenderUsers() {
        showLoading();
        fetchUsers()
            .then(data => {
                saveToStorage(data);
                renderUserList(data);
            })
            .catch(() => {
                showError('Kullanıcı verisi alınamadı. Lütfen daha sonra tekrar deneyin.');
            });
    }

    function init() {
        renderStyles();
        let users = loadFromStorage();
        if (users && users.length > 0) {
            renderUserList(users);
        } else {
            fetchAndRenderUsers();
        }
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const id = Number(e.target.dataset.id);
            deleteUser(id);
        }
    });

    const observer = new MutationObserver(function() {
        const root = getRoot();
        if (
            root &&
            root.querySelectorAll('.user-item').length === 0 &&
            !root.querySelector('.reload-btn')
        ) {
            renderReloadButton();
        }
    });
    document.addEventListener('DOMContentLoaded', function() {
        const root = getRoot();
        if (root) {
            observer.observe(root, { childList: true, subtree: true });
            init();
        }
    });
})(); 