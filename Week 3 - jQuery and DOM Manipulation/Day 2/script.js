$(document).ready(function() {
    let start = 0;
    const limit = 5;
    let loading = false;
    let allLoaded = false;

    function showLoading() {
        $('#loading').html('<div class="spinner"></div><div class="loading-text">Yükleniyor...</div>').show();
    }
    function hideLoading() {
        $('#loading').hide();
        loading = false;
    }
    function showAllLoaded() {
        $('#loading').html('<div class="loading-text">Tüm postlar yüklendi.</div>').show();
    }

    function loadPosts() {
        if (loading || allLoaded) return;
        loading = true;
        showLoading();
        $('#error').hide();
        const loadStart = Date.now();
        $.get(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`)
            .done(function(posts) {
                if (posts.length === 0) {
                    allLoaded = true;
                    showAllLoaded();
                    loading = false;
                    return;
                }
                posts.forEach(post => {
                    $('#postContainer').append(
                        `<div class="post">
                            <div class="post-title">${post.title}</div>
                            <div class="post-body">${post.body}</div>
                        </div>`
                    );
                });
                start += limit;
                
                const elapsed = Date.now() - loadStart;
                const minWait = 1000;
                if (elapsed < minWait) {
                    setTimeout(hideLoading, minWait - elapsed);
                } else {
                    hideLoading();
                }
            })
            .fail(function() {
                $('#error').text('Postlar yüklenirken bir hata oluştu.').show();
                hideLoading();
            });
    }

    // İlk yükleme
    loadPosts();

    // Sonsuz kaydırma
    $(window).on('scroll', function() {
        if (loading || allLoaded) return;
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            loadPosts();
        }
    });
}); 