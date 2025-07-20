/* eslint-disable */
(($) => {
    'use strict';

    const classes = {
        style: 'ecommerce-style',
        wrapper: 'ecommerce-wrapper',
        container: 'ecommerce-container',
        productList: 'product-list',
        productCard: 'product-card',
        cartSection: 'cart-section',
        searchSection: 'search-section',
        carouselSection: 'carousel-section',
        addToCartButton: 'add-to-cart-btn',
        removeFromCartButton: 'remove-from-cart-btn',
        clearCartButton: 'clear-cart-btn',
        productDetailButton: 'product-detail-btn',
        searchInput: 'search-input',
        searchButton: 'search-button',
        cartItem: 'cart-item',
        modal: 'product-modal',
        loading: 'loading-spinner'
    };

    const selectors = {
        style: `.${classes.style}`,
        wrapper: `.${classes.wrapper}`,
        container: `.${classes.container}`,
        productList: `.${classes.productList}`,
        productCard: `.${classes.productCard}`,
        cartSection: `.${classes.cartSection}`,
        searchSection: `.${classes.searchSection}`,
        carouselSection: `.${classes.carouselSection}`,
        addToCartButton: `.${classes.addToCartButton}`,
        removeFromCartButton: `.${classes.removeFromCartButton}`,
        clearCartButton: `.${classes.clearCartButton}`,
        productDetailButton: `.${classes.productDetailButton}`,
        searchInput: `.${classes.searchInput}`,
        searchButton: `.${classes.searchButton}`,
        cartItem: `.${classes.cartItem}`,
        modal: `.${classes.modal}`,
        loading: `.${classes.loading}`,
        appendLocation: '#container'
    };

    const self = {};


    self.init = () => {
        self.reset();
        self.buildCSS();
        self.buildHTML();
        self.loadProducts();
        self.setEvents();
        self.initializeCarousel();
        self.loadCartFromStorage();
    };

    
    self.reset = () => {
        $(selectors.style).remove();
        $(selectors.wrapper).remove();
        $(document).off('.ecommerceEvent');
        $('.fancybox-container').remove();
    };

    
    self.buildCSS = () => {
        const customStyle = `
            <style class="${classes.style}">
                ${selectors.wrapper} {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 20px;
                }
                
                ${selectors.container} {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                
                .header h1 {
                    font-size: 2.5em;
                    margin-bottom: 10px;
                }
                
                .content {
                    padding: 30px;
                }
                
                ${selectors.searchSection} {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    margin-bottom: 30px;
                    border: 2px solid #e9ecef;
                }
                
                .search-form {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }
                
                ${selectors.searchInput} {
                    flex: 1;
                    padding: 12px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-size: 16px;
                }
                
                ${selectors.searchButton} {
                    padding: 12px 25px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                ${selectors.searchButton}:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                }
                
                ${selectors.carouselSection} {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                    margin-bottom: 30px;
                }
                
                .carousel-title {
                    background: #495057;
                    color: white;
                    padding: 20px;
                    margin: 0;
                    font-size: 1.5em;
                }
                
                .carousel-container {
                    padding: 20px;
                }
                
                .carousel-item {
                    text-align: center;
                    padding: 20px;
                }
                
                .carousel-item img {
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 10px;
                    margin-bottom: 10px;
                }
                
                ${selectors.productList} {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 25px;
                    margin-bottom: 30px;
                }
                
                ${selectors.productCard} {
                    background: #f8faff;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 12px rgba(102,126,234,0.07);
                    border: 3px solid #e3e6f0;
                    transition: all 0.3s ease;
                    opacity: 0;
                    transform: translateY(20px);
                }
                
                ${selectors.productCard}.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                ${selectors.productCard}:hover {
                    border-color: #667eea;
                    box-shadow: 0 8px 32px rgba(102,126,234,0.18);
                    transform: translateY(-5px);
                }
                
                .product-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    transition: transform 0.3s ease;
                }
                
                ${selectors.productCard}:hover .product-image {
                    transform: scale(1.05);
                }
                
                .product-title {
                    font-size: 1.1em;
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 8px;
                    line-height: 1.4;
                }
                
                .product-price {
                    font-size: 1.3em;
                    font-weight: 700;
                    color: #667eea;
                    margin-bottom: 10px;
                }
                
                .product-description {
                    color: #666;
                    font-size: 0.9em;
                    line-height: 1.5;
                    margin-bottom: 15px;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .product-buttons {
                    display: flex;
                    gap: 10px;
                }
                
                ${selectors.addToCartButton}, ${selectors.productDetailButton} {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                ${selectors.addToCartButton} {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                ${selectors.addToCartButton}:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                
                ${selectors.productDetailButton} {
                    background: #f8f9fa;
                    color: #495057;
                    border: 2px solid #e9ecef;
                }
                
                ${selectors.productDetailButton}:hover {
                    background: #e9ecef;
                    transform: scale(1.05);
                }
                
                ${selectors.cartSection} {
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 10px;
                    border: 2px solid #e9ecef;
                }
                
                .cart-title {
                    color: #495057;
                    margin-bottom: 20px;
                    font-size: 1.5em;
                    font-weight: 600;
                }
                
                .cart-items {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                ${selectors.cartItem} {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    animation: slideIn 0.3s ease;
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                .cart-item-image {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 6px;
                }
                
                .cart-item-details {
                    flex: 1;
                }
                
                .cart-item-title {
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 5px;
                }
                
                .cart-item-price {
                    color: #667eea;
                    font-weight: 600;
                }
                
                ${selectors.removeFromCartButton} {
                    padding: 8px 12px;
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.3s ease;
                }
                
                ${selectors.removeFromCartButton}:hover {
                    background: #ff5252;
                }
                
                ${selectors.clearCartButton} {
                    padding: 12px 25px;
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                ${selectors.clearCartButton}:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
                }
                
                ${selectors.loading} {
                    text-align: center;
                    padding: 40px;
                    color: #667eea;
                    font-weight: 600;
                }
                
                .empty-cart {
                    text-align: center;
                    padding: 40px;
                    color: #6c757d;
                    font-style: italic;
                }
                
                ${selectors.modal} {
                    padding: 30px;
                    text-align: center;
                    background: white;
                    border-radius: 15px;
                    max-width: 500px;
                }
                
                .modal-image {
                    width: 200px;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                
                .modal-title {
                    font-size: 1.5em;
                    font-weight: 700;
                    color: #495057;
                    margin-bottom: 10px;
                }
                
                .modal-price {
                    font-size: 1.8em;
                    font-weight: 700;
                    color: #667eea;
                    margin-bottom: 15px;
                }
                
                .modal-description {
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                
                .modal-category {
                    background: #f8f9fa;
                    padding: 8px 16px;
                    border-radius: 20px;
                    color: #495057;
                    font-size: 0.9em;
                    display: inline-block;
                }
                
                @media (max-width: 768px) {
                    ${selectors.productList} {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 15px;
                    }
                    
                    .search-form {
                        flex-direction: column;
                    }
                    
                    ${selectors.cartItem} {
                        flex-direction: column;
                        text-align: center;
                    }
                }
            </style>
        `;
        $('head').append(customStyle);
    };

    
    self.buildHTML = () => {
        const html = `
            <div class="${classes.wrapper}">
                <div class="${classes.container}">
                    <div class="header">
                        <h1>🛍️ E-Ticaret</h1>
                        <p>jQuery E-Commerce App Ürün Kataloğu</p>
                    </div>
                    
                    <div class="content">
                        <div class="${classes.searchSection}">
                            <h3>🔍 Ürün Arama</h3>
                            <form class="search-form">
                                <input type="number" class="${classes.searchInput}" placeholder="Ürün ID'si girin (1-20)" min="1" max="20">
                                <button type="submit" class="${classes.searchButton}">Ara</button>
                            </form>
                        </div>
                        
                        <div class="${classes.carouselSection}">
                            <h3 class="carousel-title">🎠 Öne Çıkan Ürünler</h3>
                            <div class="carousel-container" id="productCarousel">
                                <div class="${classes.loading}">Yükleniyor...</div>
                            </div>
                        </div>
                        
                        <div class="${classes.productList}" id="productList">
                            <div class="${classes.loading}">Ürünler yükleniyor...</div>
                        </div>
                        
                        <div class="${classes.cartSection}">
                            <h3 class="cart-title">🛒 Sepetim</h3>
                            <div class="cart-items" id="cartItems">
                                <div class="empty-cart">Sepetiniz boş</div>
                            </div>
                            <button class="${classes.clearCartButton}">Sepeti Temizle</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="display:none">
                <div class="${classes.modal}" id="productModal"></div>
            </div>
        `;
        $(selectors.appendLocation).append(html);
    };

    
    self.loadProducts = () => {
        $.get('https://fakestoreapi.com/products')
            .done(function(products) {
                self.renderProducts(products);
                self.renderCarousel(products.slice(0, 5));
            })
            .fail(function() {
                $(selectors.productList).html('<div style="color:#ff4d4f;text-align:center;font-weight:600;">Ürünler yüklenemedi.</div>');
            });
    };

    
    self.renderProducts = (products) => {
        const $productList = $(selectors.productList);
        $productList.empty();

        $.each(products, function(index, product) {
            const $productCard = $(`
                <div class="${classes.productCard}" data-product-id="${product.id}" style="
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                    border: 1px solid rgba(102, 126, 234, 0.1);
                    position: relative;
                    overflow: hidden;
                    height: 400px;
                    display: flex;
                    flex-direction: column;
                ">
                    <img src="${product.image}" alt="${product.title}" class="product-image" style="
                        width: 100%;
                        height: 200px;
                        object-fit: contain;
                        border-radius: 8px;
                        margin-bottom: 15px;
                        background: #f8f9fa;
                        padding: 10px;
                        flex-shrink: 0;
                    ">
                    <div class="product-title" style="
                        font-size: 16px;
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 10px;
                        line-height: 1.3;
                        height: 42px;
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        flex-shrink: 0;
                    ">${product.title}</div>
                    <div class="product-price" style="
                        font-size: 20px;
                        font-weight: 700;
                        color: #667eea;
                        margin-bottom: 10px;
                        flex-shrink: 0;
                    ">$${product.price}</div>
                    <div class="product-description" style="
                        color: #666;
                        line-height: 1.4;
                        font-size: 14px;
                        height: 60px;
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        -webkit-box-orient: vertical;
                        margin-bottom: 15px;
                        flex: 1;
                    ">${product.description}</div>
                    <div class="product-buttons" style="
                        display: flex;
                        gap: 10px;
                        margin-top: auto;
                        flex-shrink: 0;
                    ">
                        <button class="${classes.addToCartButton}" data-product-id="${product.id}" style="
                            flex: 1;
                            padding: 10px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            font-size: 14px;
                        ">🛒 Sepete Ekle</button>
                        <button class="${classes.productDetailButton}" data-product-id="${product.id}" style="
                            flex: 1;
                            padding: 10px;
                            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            font-size: 14px;
                        ">🔍 Detay</button>
                    </div>
                </div>
            `);

            $productCard.appendTo($productList)
                .delay(index * 100)
                .queue(function(next) {
                    $(this).addClass('visible').hide().fadeIn(400);
                    next();
                });
        });
    };

    
    self.renderCarousel = (products) => {
        const $carousel = $('#productCarousel');
        $carousel.empty();

        products.forEach(product => {
            $carousel.append(`
                <div class="carousel-item" style="
                    text-align:center; 
                    background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
                    border-radius: 16px;
                    padding: 20px 15px;
                    margin: 10px 5px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    border: 1px solid rgba(102, 126, 234, 0.1);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                ">
                    <div style="
                        position: relative;
                        margin-bottom: 15px;
                        display: inline-block;
                    ">
                        <img src="${product.image}" alt="${product.title}" style="
                            width: 120px;
                            height: 120px;
                            object-fit: contain;
                            border-radius: 12px;
                            background: white;
                            padding: 10px;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                            transition: transform 0.3s ease;
                        ">
                        <div style="
                            position: absolute;
                            top: -5px;
                            right: -5px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border-radius: 50%;
                            width: 25px;
                            height: 25px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                            font-weight: 600;
                            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                        ">${product.id}</div>
                    </div>
                    
                    <div style="
                        font-weight: 700;
                        color: #2c3e50;
                        font-size: 14px;
                        line-height: 1.3;
                        margin-bottom: 8px;
                        height: 36px;
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    ">${product.title.substring(0, 35)}...</div>
                    
                    <div style="
                        color: #667eea;
                        font-weight: 800;
                        font-size: 18px;
                        margin-bottom: 12px;
                        text-shadow: 0 1px 2px rgba(102, 126, 234, 0.1);
                    ">$${product.price}</div>
                    
                    <button class="${classes.productDetailButton}" data-product-id="${product.id}" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 25px;
                        padding: 8px 16px;
                        font-size: 12px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                        position: relative;
                        overflow: hidden;
                    ">🔍 Detay</button>
                </div>
            `);
        });

        
        if (typeof $.fn.slick !== 'undefined') {
            $carousel.slick({
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 3,
                slidesToScroll: 1,
                responsive: [
                    { breakpoint: 768, settings: { slidesToShow: 2 } },
                    { breakpoint: 480, settings: { slidesToShow: 1 } }
                ]
            });
        }
    };

    
    self.initializeCarousel = () => {
        console.log('Carousel ready');
    };

    
    self.addToCart = (productId) => {
        
        const existingItem = $(`${selectors.cartItem}[data-product-id="${productId}"]`);
        if (existingItem.length > 0) {
            self.showNotification('Bu ürün zaten sepetinizde!', 'warning');
            return;
        }

        $.get(`https://fakestoreapi.com/products/${productId}`)
            .done(function(product) {
                const cartItem = $(`
                    <div class="${classes.cartItem}" data-product-id="${product.id}">
                        <img src="${product.image}" alt="${product.title}" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${product.title.substring(0, 40)}...</div>
                            <div class="cart-item-price">$${product.price}</div>
                        </div>
                        <button class="${classes.removeFromCartButton}" data-product-id="${product.id}">Sil</button>
                    </div>
                `);

                const $cartItems = $('#cartItems');
                $cartItems.find('.empty-cart').remove();
                $cartItems.append(cartItem);

                cartItem.hide().slideDown(300);

                self.saveCartToStorage();

                self.showNotification('Ürün sepete eklendi!', 'success');
            });
    };

    
    self.removeFromCart = (productId) => {
        $(`${selectors.cartItem}[data-product-id="${productId}"]`)
            .slideUp(300, function() {
                $(this).remove();
                if ($(selectors.cartItem).length === 0) {
                    $('#cartItems').html('<div class="empty-cart">Sepetiniz boş</div>');
                }
                self.saveCartToStorage();
                self.showNotification('Ürün sepetten çıkarıldı!', 'info');
            });
    };

    
    self.clearCart = () => {
        $(selectors.cartItem).slideUp(300, function() {
            $(this).remove();
        });
        
        setTimeout(() => {
            $('#cartItems').html('<div class="empty-cart">Sepetiniz boş</div>');
            self.saveCartToStorage();
            self.showNotification('Sepet temizlendi!', 'warning');
        }, 300);
    };

    
    self.showProductDetail = (productId) => {
        $.get(`https://fakestoreapi.com/products/${productId}`)
            .done(function(product) {
                const modalContent = `
                    <div style="
                        background: white;
                        border-radius: 16px;
                        max-width: 500px;
                        margin: 20px auto;
                        text-align: center;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                        overflow: hidden;
                        position: relative;
                    ">
                        <!-- Close button -->
                        <button id="closeModal" style="
                            position: absolute; top: 15px; right: 15px; 
                            background: #dc3545; color: white; border: none; 
                            border-radius: 50%; width: 35px; height: 35px; 
                            font-size: 20px; cursor: pointer; z-index: 10;
                            display: flex; align-items: center; justify-content: center;
                            font-weight: bold;
                        ">×</button>

                        <!-- Product image -->
                        <div style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            padding: 30px;
                            position: relative;
                        ">
                            <img src="${product.image}" alt="${product.title}" style="
                                width: 200px;
                                height: 200px;
                                object-fit: contain;
                                border-radius: 12px;
                                background: white;
                                padding: 15px;
                                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                            ">
                            <div style="
                                position: absolute;
                                top: 15px;
                                left: 15px;
                                background: rgba(255,255,255,0.9);
                                color: #667eea;
                                padding: 5px 10px;
                                border-radius: 15px;
                                font-weight: 600;
                                font-size: 12px;
                            ">ID: ${product.id}</div>
                        </div>

                        <!-- Product info -->
                        <div style="padding: 25px;">
                            <h3 style="
                                font-size: 18px;
                                font-weight: 600;
                                color: #333;
                                margin-bottom: 10px;
                                line-height: 1.3;
                            ">${product.title}</h3>
                            
                            <div style="
                                font-size: 24px;
                                font-weight: 700;
                                color: #667eea;
                                margin-bottom: 15px;
                            ">$${product.price}</div>

                            <!-- Rating -->
                            <div style="
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 10px;
                                margin-bottom: 15px;
                            ">
                                <div style="
                                    display: flex;
                                    align-items: center;
                                    gap: 5px;
                                ">
                                    <span style="color: #ffc107; font-size: 18px;">⭐</span>
                                    <span style="font-weight: 600; color: #666;">${product.rating.rate}</span>
                                </div>
                                <span style="color: #999; font-size: 14px;">(${product.rating.count} değerlendirme)</span>
                            </div>

                            <!-- Category -->
                            <div style="
                                background: #f8f9fa;
                                color: #495057;
                                padding: 8px 16px;
                                border-radius: 20px;
                                font-weight: 500;
                                font-size: 14px;
                                margin-bottom: 20px;
                                display: inline-block;
                                text-transform: capitalize;
                            ">${product.category}</div>

                            <!-- Description -->
                            <div style="
                                color: #666;
                                line-height: 1.6;
                                margin-bottom: 25px;
                                font-size: 14px;
                                text-align: left;
                                background: #f8f9fa;
                                padding: 15px;
                                border-radius: 8px;
                                border-left: 3px solid #667eea;
                            ">${product.description}</div>

                            <!-- Add to cart button -->
                            <button class="${classes.addToCartButton}" data-product-id="${product.id}" style="
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                                border: none;
                                border-radius: 25px;
                                padding: 12px 30px;
                                font-weight: 600;
                                cursor: pointer;
                                font-size: 16px;
                                transition: all 0.3s ease;
                                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
                                width: 100%;
                            ">🛒 Sepete Ekle</button>
                        </div>
                    </div>
                `;

                
                const modalOverlay = $(`
                    <div id="modalOverlay" style="
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.7); z-index: 9999; display: flex; 
                        align-items: center; justify-content: center; padding: 20px;
                    ">
                        ${modalContent}
                    </div>
                `);

                
                modalOverlay.on('click', function(e) {
                    if (e.target === this) {
                        $(this).fadeOut(300, function() {
                            $(this).remove();
                        });
                    }
                });




                modalOverlay.find('#closeModal').on('click', function() {
                    modalOverlay.fadeOut(300, function() {
                        $(this).remove();
                    });
                });

                $('body').append(modalOverlay);
                modalOverlay.fadeIn(300);
            });
    };

    
    self.searchProduct = (productId) => {
        if (!productId || productId < 1 || productId > 20) {
            self.showNotification('Lütfen 1-20 arası bir ID girin!', 'error');
            return;
        }

        $(selectors.productList).html('<div class="loading">Aranıyor...</div>');

        $.get(`https://fakestoreapi.com/products/${productId}`)
            .done(function(product) {
                self.renderProducts([product]);
                self.showNotification('Ürün bulundu!', 'success');
            })
            .fail(function() {
                $(selectors.productList).html('<div style="color:#ff4d4f;text-align:center;font-weight:600;">Ürün bulunamadı.</div>');
                self.showNotification('Ürün bulunamadı!', 'error');
            });
    };

    
    self.debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    
    self.debouncedSearch = self.debounce(function(productId) {
        self.searchProduct(productId);
    }, 500);

    
    self.saveCartToStorage = () => {
        const cartItems = [];
        $(selectors.cartItem).each(function() {
            cartItems.push({
                id: $(this).data('product-id'),
                title: $(this).find('.cart-item-title').text(),
                price: $(this).find('.cart-item-price').text(),
                image: $(this).find('.cart-item-image').attr('src')
            });
        });
        localStorage.setItem('ecommerceCart', JSON.stringify(cartItems));
    };

    self.loadCartFromStorage = () => {
        const savedCart = localStorage.getItem('ecommerceCart');
        if (savedCart) {
            const cartItems = JSON.parse(savedCart);
            const $cartItems = $('#cartItems');
            $cartItems.empty();

            if (cartItems.length > 0) {
                cartItems.forEach(item => {
                    const cartItem = $(`
                        <div class="${classes.cartItem}" data-product-id="${item.id}">
                            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                            <div class="cart-item-details">
                                <div class="cart-item-title">${item.title}</div>
                                <div class="cart-item-price">${item.price}</div>
                            </div>
                            <button class="${classes.removeFromCartButton}" data-product-id="${item.id}">Sil</button>
                        </div>
                    `);
                    $cartItems.append(cartItem);
                });
            } else {
                $cartItems.html('<div class="empty-cart">Sepetiniz boş</div>');
            }
        }
    };

    
    self.showNotification = (message, type = 'info') => {
        const notification = $(`
            <div style="
                position: fixed; top: 20px; right: 20px; 
                padding: 15px 20px; border-radius: 8px; 
                color: white; font-weight: 600; z-index: 9999;
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease;
            ">
                ${message}
            </div>
        `);

        $('body').append(notification);

        setTimeout(() => {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    };

    
    self.setEvents = () => {
        
        $(document).on('click.ecommerceEvent', selectors.addToCartButton, function() {
            const productId = $(this).data('product-id');
            self.addToCart(productId);
        });

        
        $(document).on('click.ecommerceEvent', selectors.removeFromCartButton, function() {
            const productId = $(this).data('product-id');
            self.removeFromCart(productId);
        });

        
        $(document).on('click.ecommerceEvent', selectors.clearCartButton, function() {
            self.clearCart();
        });

        
        $(document).on('click.ecommerceEvent', selectors.productDetailButton, function() {
            const productId = $(this).data('product-id');
            self.showProductDetail(productId);
        });

        
        $(document).on('submit.ecommerceEvent', '.search-form', function(e) {
            e.preventDefault();
            const productId = parseInt($(selectors.searchInput).val());
            self.searchProduct(productId);
        });

        
        $(document).on('input.ecommerceEvent', selectors.searchInput, function() {
            
            if ($(this).val() === '') {
                self.loadProducts();
            }
        });

        
        $(document).on('keypress.ecommerceEvent', selectors.searchInput, function(e) {
            if (e.which === 13) { 
                e.preventDefault();
                const productId = parseInt($(this).val());
                if (productId && productId >= 1 && productId <= 20) {
                    self.searchProduct(productId);
                } else if (productId) {
                    self.showNotification('Lütfen 1-20 arası bir ID girin!', 'error');
                }
            }
        });

        
        $(document).on('mouseenter.ecommerceEvent', selectors.productCard, function() {
            $(this).fadeTo(200, 0.95);
        }).on('mouseleave.ecommerceEvent', selectors.productCard, function() {
            $(this).fadeTo(200, 1);
        });

        
        $(document).on('mouseenter.ecommerceEvent', '.carousel-item', function() {
            $(this).css({
                'transform': 'translateY(-5px)',
                'box-shadow': '0 15px 35px rgba(0,0,0,0.15)'
            });
            $(this).find('img').css('transform', 'scale(1.05)');
            $(this).find('button').css({
                'transform': 'scale(1.05)',
                'box-shadow': '0 6px 20px rgba(102, 126, 234, 0.4)'
            });
        }).on('mouseleave.ecommerceEvent', '.carousel-item', function() {
            $(this).css({
                'transform': 'translateY(0)',
                'box-shadow': '0 8px 25px rgba(0,0,0,0.1)'
            });
            $(this).find('img').css('transform', 'scale(1)');
            $(this).find('button').css({
                'transform': 'scale(1)',
                'box-shadow': '0 4px 15px rgba(102, 126, 234, 0.3)'
            });
        });
    };

    
    $(document).ready(self.init);

})(jQuery); 