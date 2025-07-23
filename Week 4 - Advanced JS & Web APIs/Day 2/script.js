/* eslint-disable */
(($) => {
    'use strict';
    const CLASSES = {
        container: 'user-list-container',
        title: 'user-list-title',
        list: 'user-list',
        item: 'user-item',
        header: 'user-header',
        name: 'user-name',
        email: 'user-email',
        address: 'user-address',
        deleteBtn: 'delete-btn',
        error: 'error-message',
        loading: 'loading-message',
        style: 'ins-api-users-style'
    };
    const SELECTORS = {
        root: '.ins-api-users',
        container: `.${CLASSES.container}`,
        list: `.${CLASSES.list}`,
        item: `.${CLASSES.item}`,
        deleteBtn: `.${CLASSES.deleteBtn}`,
        style: `.${CLASSES.style}`
    };
    const API_URL = 'https://jsonplaceholder.typicode.com/users';
    const STORAGE_KEY = 'insApiUsers';
    const STORAGE_EXP_KEY = 'insApiUsersExp';
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    function renderStyles() {
        if ($(SELECTORS.style).length) return;
        const style = `
            <style class="${CLASSES.style}">
                .${CLASSES.container} {
                    max-width: 600px;
                    margin: 40px auto;
                    background: #f8f9fa;
                    border-radius: 12px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
                    padding: 32px 24px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .${CLASSES.title} {
                    font-size: 2em;
                    color: #2d3436;
                    margin-bottom: 24px;
                    text-align: center;
                }
                .${CLASSES.list} {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .${CLASSES.item} {
                    background: #fff;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    padding: 18px 20px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.07);
                    position: relative;
                    transition: box-shadow 0.2s;
                }
                .${CLASSES.item}:hover {
                    box-shadow: 0 6px 24px rgba(52, 152, 219, 0.13);
                }
                .${CLASSES.header} {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .${CLASSES.name} {
                    font-weight: 600;
                    color: #2980b9;
                    font-size: 1.1em;
                }
                .${CLASSES.email} {
                    color: #636e72;
                    font-size: 0.98em;
                    margin: 6px 0 0 0;
                }
                .${CLASSES.address} {
                    color: #636e72;
                    font-size: 0.95em;
                    margin-top: 8px;
                }
                .${CLASSES.deleteBtn} {
                    background: #e74c3c;
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    padding: 7px 16px;
                    font-size: 0.95em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                    margin-left: 12px;
                }
                .${CLASSES.deleteBtn}:hover {
                    background: #c0392b;
                }
                .${CLASSES.error} {
                    color: #fff; background: #e74c3c; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center; font-weight: bold;
                }
                .${CLASSES.loading} {
                    text-align:center;padding:40px;color:#2980b9;font-weight:600;
                }
            </style>
        `;
        $('head').append(style);
    }

    function showError(message) {
        $(SELECTORS.root).html(`<div class="${CLASSES.error}">${message}</div>`);
    }

    function showLoading() {
        $(SELECTORS.root).html(`<div class="${CLASSES.loading}">Yükleniyor...</div>`);
    }

    function saveToStorage(users) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        localStorage.setItem(STORAGE_EXP_KEY, Date.now() + ONE_DAY_MS);
    }

    function loadFromStorage() {
        const exp = localStorage.getItem(STORAGE_EXP_KEY);
        if (exp && Date.now() < Number(exp)) {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) return JSON.parse(data);
        }
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_EXP_KEY);
        return null;
    }

    function renderUserList(users) {
        renderStyles();
        const $container = $(`<div class="${CLASSES.container}"></div>`);
        $container.append(`<div class="${CLASSES.title}">Kullanıcı Listesi</div>`);
        const $ul = $(`<ul class="${CLASSES.list}"></ul>`);
        users.forEach(user => {
            const $li = $(`
                <li class="${CLASSES.item}" data-id="${user.id}">
                    <div class="${CLASSES.header}">
                        <span class="${CLASSES.name}">${user.name}</span>
                        <button class="${CLASSES.deleteBtn}" data-id="${user.id}">Sil</button>
                    </div>
                    <div class="${CLASSES.email}">📧 ${user.email}</div>
                    <div class="${CLASSES.address}">🏠 ${user.address.street}, ${user.address.suite}, ${user.address.city}</div>
                </li>
            `);
            $ul.append($li);
        });
        $container.append($ul);
        $(SELECTORS.root).empty().append($container);
    }

    function deleteUser(id) {
        let users = loadFromStorage();
        if (!users) return;
        users = users.filter(u => u.id !== id);
        saveToStorage(users);
        renderUserList(users);
    }

    function fetchUsers() {
        return $.ajax({
            url: API_URL,
            method: 'GET',
            dataType: 'json'
        });
    }

    function init() {
        let users = loadFromStorage();
        if (users) {
            renderUserList(users);
        } else {
            showLoading();
            fetchUsers()
                .done(function(data) {
                    saveToStorage(data);
                    renderUserList(data);
                })
                .fail(function() {
                    showError('Kullanıcı verisi alınamadı. Lütfen daha sonra tekrar deneyin.');
                });
        }
    }

    // Event delegation for delete
    $(document).on('click', SELECTORS.deleteBtn, function() {
        const id = Number($(this).data('id'));
        deleteUser(id);
    });

    $(document).ready(init);
})(jQuery); 