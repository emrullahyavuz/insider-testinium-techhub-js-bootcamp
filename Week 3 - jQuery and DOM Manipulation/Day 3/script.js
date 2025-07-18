$(document).ready(function() {
    let users = [];
    const $cards = $('#profileCards');
    const $slider = $('#profileSlider');
    const $modal = $('#profileModal');
    const $btn = $('#fetchProfiles');

    function renderSlider(profiles) {
        $slider.empty();
        profiles.forEach(user => {
            $slider.append(`
                <div class="slider-card">
                    <img src="${user.picture.large}" alt="${user.name.first}" style="width:80px;height:80px;border-radius:50%;margin:0 auto 10px auto;display:block;border:3px solid #667eea;">
                    <div style="text-align:center;font-weight:600;color:#495057;">${user.name.first} ${user.name.last}</div>
                    <div style="text-align:center;color:#888;font-size:0.97em;">${user.location.country}</div>
                </div>
            `);
        });
        $slider.slick({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: Math.min(3, profiles.length),
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                { breakpoint: 900, settings: { slidesToShow: 2 } },
                { breakpoint: 600, settings: { slidesToShow: 1 } }
            ]
        });
    }

    function showModal(user) {
        $modal.html(`
            <button class="modal-close" title="Kapat">&times;</button>
            <img class="modal-img" src="${user.picture.large}" alt="${user.name.first}">
            <div class="modal-name">${user.name.first} ${user.name.last}</div>
            <div class="modal-email">${user.email}</div>
            <div class="modal-country">${user.location.country}</div>
            <div class="modal-detail"><span class="mdi">📞</span>${user.phone}</div>
            <div class="modal-detail"><span class="mdi">👤</span>${user.login.username}</div>
            <div class="modal-detail"><span class="mdi">🎂</span>${user.dob.age} yaşında</div>
            <div class="modal-detail"><span class="mdi">🏙️</span>${user.location.city}</div>
        `);
        Fancybox.show([{ src: "#profileModal", type: "inline" }]);
        $modal.find('.modal-close').on('click', function() {
            Fancybox.close();
        });
    }

    function renderCards(profiles) {
        $cards.empty();
        profiles.forEach((user, i) => {
            const $card = $(`
                <div class="profile-card" tabindex="0">
                    <img class="profile-img" src="${user.picture.large}" alt="${user.name.first}">
                    <div class="profile-name">${user.name.first} ${user.name.last}</div>
                    <div class="profile-email">${user.email}</div>
                    <div class="profile-country">${user.location.country}</div>
                    <button class="profile-more">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="4" stroke="white" stroke-width="2"/>
                            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        Profili Gör
                    </button>
                </div>
            `);
            $card.appendTo($cards)
                .delay(i * 120)
                .queue(function(next) {
                    $(this).addClass('visible').hide().fadeIn(400);
                    next();
                });
            $card.hover(
                function() { $(this).fadeTo(200, 0.92).toggleClass('bounce'); },
                function() { $(this).fadeTo(200, 1).toggleClass('bounce'); }
            );
            $card.find('.profile-more, .profile-img, .profile-name').on('click', function(e) {
                e.stopPropagation();
                showModal(user);
            });
        });
    }

    function buttonEffect() {
        $btn.addClass('shake');
        setTimeout(() => $btn.removeClass('shake'), 600);
    }

    function fetchProfiles() {
        buttonEffect();
        $cards.empty();
        $slider.slick('unslick');
        $slider.html('<div style="text-align:center;color:#667eea;font-weight:600;">Yükleniyor...</div>');
        $.get('https://randomuser.me/api/?results=8&nat=us,gb,fr,ca,tr,de,es,br')
            .done(function(data) {
                users = data.results;
                renderCards(users);
                $slider.empty();
                users.forEach(user => {
                    $slider.append(`
                        <div class="slider-card">
                            <img src="${user.picture.large}" alt="${user.name.first}" style="width:80px;height:80px;border-radius:50%;margin:0 auto 10px auto;display:block;border:3px solid #667eea;">
                            <div style="text-align:center;font-weight:600;color:#495057;">${user.name.first} ${user.name.last}</div>
                            <div style="text-align:center;color:#888;font-size:0.97em;">${user.location.country}</div>
                        </div>
                    `);
                });
                $slider.slick({
                    dots: true,
                    infinite: true,
                    speed: 500,
                    slidesToShow: Math.min(3, users.length),
                    slidesToScroll: 1,
                    arrows: true,
                    responsive: [
                        { breakpoint: 900, settings: { slidesToShow: 2 } },
                        { breakpoint: 600, settings: { slidesToShow: 1 } }
                    ]
                });
            })
            .fail(function() {
                $cards.html('<div style="color:#ff4d4f;text-align:center;font-weight:600;">Profiller yüklenemedi.</div>');
                $slider.html('<div style="color:#ff4d4f;text-align:center;font-weight:600;">Slider yüklenemedi.</div>');
            });
    }

    $.get('https://randomuser.me/api/?results=5&nat=us,gb,fr,ca,tr')
        .done(function(data) {
            renderSlider(data.results);
        });

    $btn.on('click', fetchProfiles);
    fetchProfiles();
}); 