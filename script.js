// Data Produk (Mock Data)
const products = [
    {
        id: 1,
        name: "Jasa Fotocopy",
        category: "Percetakan",
        price: 500,
        unit: "lembar",
        icon: "ph-copy",
        image: "https://snapy.co.id/gambar/artikel/merk-mesin-fotocopy-.jpg",
        description: "Harga terjangkau dan kualitas terbaik."
    },
    {
        id: 2,
        name: "Kertas SIDU HVS F4 70gsm",
        category: "Kertas",
        price: 1000,
        unit: "2 lembar",
        icon: "ph-paperclip",
        image: "https://sentrafotokopi.com/wp-content/uploads/2023/12/images-2.jpeg",
        description: "Harga terjangkau dan kualitas terbaik."
    },
    {
        id: 3,
        name: "SIDU Buku Tulis 38 Lembar",
        category: "Buku",
        price: 5000,
        unit: "buku",
        icon: "ph-book",
        image: "https://sidu.id/documents/287278/309575/SiDU+Small+Opened+Reg.png/0733411c-2c83-d77b-10a8-959617cff9aa?t=1708678659796",
        description: "Buku tulis bergaris kualitas premium."
    },
    {
        id: 4,
        name: "Stapler Kenko HD-10",
        category: "Alat Tulis",
        price: 15000,
        unit: "pcs",
        icon: "ph-push-pin",
        image: "https://shop.kenko.co.id/image/cache/catalog/product/Stapler/Stapler-HD-10-700x700.jpg",
        description: "Stapler kuat dan tahan lama."
    },
    {
        id: 5,
        name: "Jasa Laminating",
        category: "Laminating",
        price: 5000,
        unit: "lembar",
        icon: "ph-hand",
        image: "https://jabar.parto.id/asset/foto_produk/C8gZppID45issEbC8ZS2s5GU7FPtmXTEmERckNeEUxOw_jpg_172240940322.jpg",
        description: "Harga terjangkau dan kualitas terbaik."
    },
    {
        id: 6,
        name: "Spidol Snowman Marker Hitam",
        category: "Alat Tulis",
        price: 3000,
        unit: "pcs",
        icon: "ph-pen",
        image: "https://media.monotaro.id/mid01/big/Kebutuhan%20Kantor/Alat%20Tulis/Spidol/Snowman%20Spidol%20Kecil/Snowman%20Spidol%20Kecil%20Hitam%201pack(3pcs)/0mS028585022-2.jpg",
        description: "Harga terjangkau dan kualitas terbaik."
    }
];

// State Keranjang (Load dari LocalStorage jika ada)
const savedCart = localStorage.getItem('yuka_cart');
let cart = savedCart ? JSON.parse(savedCart) : [];

// Elemen DOM
const productsContainer = document.getElementById('products-container');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartBadges = document.querySelectorAll('.cart-badge');
const cartTotalPrices = document.querySelectorAll('.cart-total-price');

// Format Mata Uang (Rupiah)
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
};

// State Filter & Search
let currentFilter = 'ALL';
let searchQuery = '';

// Render Produk ke Grid
const renderProducts = () => {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';

    let filteredProducts = products;

    // Filter by Category
    if (currentFilter !== 'ALL') {
        filteredProducts = filteredProducts.filter(p => p.category.toUpperCase() === currentFilter);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
    }

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem; animation: popIn 0.5s forwards;">Tidak ada produk yang ditemukan.</div>';
        return;
    }

    filteredProducts.forEach((product, index) => {
        const productEl = document.createElement('div');
        productEl.classList.add('product-card');
        productEl.style.animationDelay = `${index * 0.05}s`;

        const mediaHtml = product.image
            ? `<img src="${product.image}?v=2" alt="${product.name}" style="display: block; width: 100%; height: 100%; object-fit: cover;">`
            : `<i class="ph ${product.icon}"></i>`;

        productEl.innerHTML = `
            <div class="product-image">
                ${mediaHtml}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
            </div>
            <div class="product-footer">
                <span class="product-price">${formatRupiah(product.price)} / ${product.unit}</span>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="ph ph-shopping-cart-simple"></i> Tambah
                </button>
            </div>
        `;

        productsContainer.appendChild(productEl);
    });
};

// Tambah ke Keranjang
const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Animasi badge
    cartBadges.forEach(badge => {
        badge.classList.add('pop');
        setTimeout(() => badge.classList.remove('pop'), 300);
    });

    updateCart();
    showToast('Berhasil ditambahkan ke keranjang!');
};

// Tambah Produk Custom ke Keranjang (untuk halaman statis)
window.addCustomToCart = (id, name, category, price, unit, icon, image, qty = 1) => {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({ id, name, category, price, unit, icon, image, quantity: qty });
    }

    cartBadges.forEach(badge => {
        badge.classList.add('pop');
        setTimeout(() => badge.classList.remove('pop'), 300);
    });

    updateCart();
    showToast('Berhasil ditambahkan ke keranjang!');
};

// Toast Notification System
window.showToast = (message) => {
    let toast = document.getElementById('yuka-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'yuka-toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '80px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'var(--text-primary)';
        toast.style.color = 'var(--bg-surface)';
        toast.style.padding = '0.8rem 1.5rem';
        toast.style.borderRadius = '50px';
        toast.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        toast.style.zIndex = '9999';
        toast.style.fontWeight = '500';
        toast.style.fontSize = '0.9rem';
        toast.style.transition = 'all 0.3s ease';
        toast.style.opacity = '0';
        toast.style.pointerEvents = 'none';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '8px';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="ph-fill ph-check-circle" style="font-size: 1.2rem; color: #4ade80;"></i> ${message}`;

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.bottom = '100px';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.bottom = '80px';
    }, 3000);
};

// Sinkronisasi antar Tab
window.addEventListener('storage', (e) => {
    if (e.key === 'yuka_cart') {
        cart = JSON.parse(e.newValue || '[]');
        updateCart();
    }
});

// Update Keranjang (UI & Data)
const updateCart = () => {
    // Simpan ke localStorage setiap ada perubahan
    localStorage.setItem('yuka_cart', JSON.stringify(cart));

    // Update Badge (Bisa ada lebih dari satu di halaman jika pakai navbar desktop + mobile)
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadges.forEach(badge => {
        if (totalItems > 0) {
            badge.style.display = 'flex';
            badge.textContent = totalItems;
        } else {
            badge.style.display = 'none';
        }
    });

    // Update Total Harga (Hanya jika ada elemennya, misalnya di cart.html)
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalPrices.forEach(priceEl => {
        priceEl.textContent = formatRupiah(totalPrice);
    });

    // Render Items (Hanya di cart.html)
    if (!cartItemsContainer) return;

    // Render Items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Keranjang Anda kosong.</div>';
        return;
    }

    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');

        itemEl.innerHTML = `
            <div class="cart-item-img">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` : `<i class="ph ${item.icon}"></i>`}
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatRupiah(item.price)} / ${item.unit}</div>
                <div class="cart-item-actions">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">
                            <i class="ph ph-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">
                            <i class="ph ph-plus"></i>
                        </button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            </div>
        `;

        cartItemsContainer.appendChild(itemEl);
    });
};

// Update Kuantitas
const updateQuantity = (productId, change) => {
    const itemIndex = cart.findIndex(item => item.id == productId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        updateCart();
    }
};

// Hapus dari Keranjang
const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id != productId);
    updateCart();
};

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart(); // Sinkronisasi UI dengan data cart dari localStorage

    // Update hardcoded Flash Sale DOM with dynamic rating/sold
    const flashSaleItems = document.querySelectorAll('.fs-card');
    flashSaleItems.forEach(card => {
        const linkStr = card.getAttribute('href');
        if (linkStr && linkStr.includes('?id=')) {
            const id = linkStr.split('?id=')[1];
            if (productsDatabase[id]) {
                const prod = productsDatabase[id];
                const progressText = card.querySelector('.progress-text');
                const progressFill = card.querySelector('.progress-fill');
                if (progressText) progressText.innerText = prod.sold;
                if (progressFill) {
                    let soldNum = parseInt(prod.sold.replace(/[^0-9]/g, '')) || 0;
                    let widthPct = Math.min((soldNum / 100) * 100, 100);
                    if (soldNum === 0) widthPct = 0; // Ensures 0 sold = 0%
                    progressFill.style.width = `${widthPct}%`;
                }
            }
        }
    });

    // Inisialisasi Filter Kategori
    const filterBtns = document.querySelectorAll('.category-filters .filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update class active
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Ambil filter value
                let filterValue = btn.textContent.trim().toUpperCase();
                if (filterValue === 'SEMUA' || filterValue === 'SEMUA PRODUK') {
                    filterValue = 'ALL';
                }

                // Update state dan render ulang
                currentFilter = filterValue;
                renderProducts();
            });
        });
    }

    // Inisialisasi Fitur Pencarian Global
    const searchInputs = document.querySelectorAll('.search-box input, .search-bar input');
    const searchBtns = document.querySelectorAll('.search-box .search-btn, .search-bar .search-btn');

    const executeSearch = (query, isRealtime = false) => {
        const path = window.location.pathname;
        const isCatalogPage = path.includes('index.html') || path.includes('category.html') || path.endsWith('/') || path.endsWith('website');

        if (!isCatalogPage) {
            if (!isRealtime && query) {
                window.location.href = `index.html?search=${encodeURIComponent(query)}`;
            }
            return;
        }

        // Kalau di halaman katalog, filter kartunya
        const cards = document.querySelectorAll('.etalase-card, .fs-card');
        let found = false;

        if (!query) {
            cards.forEach(card => {
                if (card.classList.contains('etalase-card')) card.style.display = 'flex';
                if (card.classList.contains('fs-card')) card.style.display = 'block';
            });
            const noResultMsg = document.getElementById('no-result-msg');
            if (noResultMsg) noResultMsg.style.display = 'none';
            return;
        }

        cards.forEach(card => {
            const titleEl = card.querySelector('.product-title');
            if (titleEl) {
                const title = titleEl.innerText.toLowerCase();
                if (title.includes(query.toLowerCase())) {
                    if (card.classList.contains('etalase-card')) card.style.display = 'flex';
                    if (card.classList.contains('fs-card')) card.style.display = 'block';
                    found = true;
                } else {
                    card.style.display = 'none';
                }
            }
        });

        let noResultMsg = document.getElementById('no-result-msg');
        if (!found) {
            if (!noResultMsg) {
                noResultMsg = document.createElement('div');
                noResultMsg.id = 'no-result-msg';
                noResultMsg.style.gridColumn = '1 / -1';
                noResultMsg.style.textAlign = 'center';
                noResultMsg.style.padding = '3rem 1rem';
                noResultMsg.style.color = 'var(--text-secondary)';
                noResultMsg.style.fontSize = '1.1rem';

                const grid = document.querySelector('.etalase-grid') || document.querySelector('.category-main-content');
                if (grid) grid.appendChild(noResultMsg);
            }
            noResultMsg.innerHTML = `<i class="ph ph-warning-circle" style="font-size: 3rem; margin-bottom: 1rem; color: var(--accent-color);"></i><br>Pencarian untuk "<b>${query}</b>" tidak ditemukan.`;
            noResultMsg.style.display = 'block';
        } else if (noResultMsg) {
            noResultMsg.style.display = 'none';
        }

        if (!isRealtime) {
            const targetSection = document.querySelector('.recommendation-section') || document.querySelector('.category-main-content');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    searchBtns.forEach((btn, index) => {
        const input = searchInputs[index];
        if (input && btn) {
            btn.addEventListener('click', () => {
                executeSearch(input.value.trim(), false);
            });
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    executeSearch(input.value.trim(), false);
                } else {
                    executeSearch(input.value.trim(), true);
                }
            });
        }
    });

    const urlParamsSearch = new URLSearchParams(window.location.search);
    const searchParam = urlParamsSearch.get('search');
    const pathParams = window.location.pathname;
    const isCatalog = pathParams.includes('index.html') || pathParams.includes('category.html') || pathParams.endsWith('/') || pathParams.endsWith('website');

    if (searchParam && isCatalog) {
        searchInputs.forEach(input => input.value = searchParam);
        setTimeout(() => {
            executeSearch(searchParam, false);
        }, 100);
    }

    // Render Category Page dynamically
    if (window.location.pathname.includes('category.html') || window.location.href.includes('category.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        let categoryParam = urlParams.get('cat');

        const breadcrumbSpan = document.querySelector('.breadcrumb span');
        const bannerH2 = document.querySelector('.banner-overlay h2');
        const bannerP = document.querySelector('.banner-overlay p');
        const sidebarLinks = document.querySelectorAll('.filter-list a');

        if (categoryParam) {
            if (breadcrumbSpan) breadcrumbSpan.innerText = categoryParam;
            if (bannerH2) bannerH2.innerText = categoryParam + " Terlengkap";
            if (bannerP) bannerP.innerText = `Temukan segala kebutuhan ${categoryParam.toLowerCase()}mu dengan harga terbaik.`;
        } else {
            categoryParam = 'Semua Kategori';
            if (breadcrumbSpan) breadcrumbSpan.innerText = categoryParam;
            if (bannerH2) bannerH2.innerText = "Semua Produk";
            if (bannerP) bannerP.innerText = `Pilih berbagai kategori produk terbaik di TokoYuka.`;
        }

        // Update active sidebar link
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.innerText.toLowerCase().includes(categoryParam.toLowerCase())) {
                link.classList.add('active');
            }
        });

        const grid = document.querySelector('.category-main-content .etalase-grid');
        const sortingTabs = document.querySelectorAll('.sorting-tab');

        if (grid) {
            const parsePrice = (priceStr) => {
                return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
            };
            const parseSold = (soldStr) => {
                if (!soldStr) return 0;
                let num = parseFloat(soldStr.replace(/[^0-9.]/g, '')) || 0;
                if (soldStr.toLowerCase().includes('rb')) num *= 1000;
                if (soldStr.toLowerCase().includes('jt')) num *= 1000000;
                return num;
            };

            let currentSort = 'Terkait';
            let currentPage = 1;
            const itemsPerPage = 8; // Menampilkan 8 produk per halaman

            const renderGrid = (sortBy = 'Terkait', page = 1) => {
                currentSort = sortBy;
                currentPage = page;
                grid.innerHTML = '';

                const isGratisOngkir = document.getElementById('filter-gratis-ongkir')?.checked;
                const isDiskon = document.getElementById('filter-diskon')?.checked;
                const isCashback = document.getElementById('filter-cashback')?.checked;
                const isRating4 = document.getElementById('filter-rating-4')?.checked;
                const isRating3 = document.getElementById('filter-rating-3')?.checked;

                const minPriceInput = document.getElementById('price-min');
                const maxPriceInput = document.getElementById('price-max');
                const minPriceVal = minPriceInput && minPriceInput.value ? parseInt(minPriceInput.value) : 0;
                const maxPriceVal = maxPriceInput && maxPriceInput.value ? parseInt(maxPriceInput.value) : Infinity;

                let matchedProducts = [];
                for (const key in productsDatabase) {
                    const prod = productsDatabase[key];
                    if (categoryParam === 'Semua Kategori' || prod.category.toLowerCase().includes(categoryParam.toLowerCase()) || categoryParam.toLowerCase().includes(prod.category.toLowerCase())) {

                        let numPrice = parsePrice(prod.price);

                        if (numPrice < minPriceVal || numPrice > maxPriceVal) continue;
                        let hasDiskon = !!prod.discount || !!prod.strike;
                        let hasGratisOngkir = numPrice > 50000;
                        let hasCashback = numPrice >= 20000 && numPrice <= 50000;
                        let prodRating = parseFloat(prod.rating) || 0;

                        if (isGratisOngkir && !hasGratisOngkir) continue;
                        if (isDiskon && !hasDiskon) continue;
                        if (isCashback && !hasCashback) continue;
                        if (isRating4 && prodRating < 4.0) continue;
                        if (isRating3 && prodRating < 3.0) continue;

                        matchedProducts.push({ key, hasGratisOngkir, hasDiskon, hasCashback, ...prod });
                    }
                }

                if (sortBy === 'Terbaru') {
                    matchedProducts.reverse();
                } else if (sortBy === 'Terlaris') {
                    matchedProducts.sort((a, b) => parseSold(b.sold) - parseSold(a.sold));
                } else if (sortBy === 'Termurah') {
                    matchedProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
                }

                if (matchedProducts.length === 0) {
                    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);"><i class="ph ph-package" style="font-size:3rem; color:var(--text-secondary); margin-bottom:1rem;"></i><br>Belum ada produk di kategori <b>${categoryParam}</b>.</div>`;
                    const paginationContainer = document.querySelector('.pagination');
                    if (paginationContainer) paginationContainer.innerHTML = '';
                    return;
                }

                // Pagination slice
                const totalPages = Math.ceil(matchedProducts.length / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;
                const paginatedProducts = matchedProducts.slice(startIndex, startIndex + itemsPerPage);

                paginatedProducts.forEach(prod => {
                    const card = document.createElement('a');
                    card.className = 'etalase-card';
                    card.style.textDecoration = 'none';
                    card.style.color = 'inherit';
                    card.title = 'Lihat Produk';
                    card.href = `product.html?id=${prod.key}`;

                    let badgeHtml = '';
                    if (prod.discount) {
                        badgeHtml = `<span class="discount-badge">${prod.discount}</span>`;
                    } else if (prod.hasCashback) {
                        badgeHtml = `<span class="cashback-badge" style="background:var(--accent-color); color:white;">Cashback</span>`;
                    } else if (prod.hasGratisOngkir) {
                        badgeHtml = `<span class="cashback-badge">Gratis Ongkir</span>`;
                    } else {
                        let numPrice = parsePrice(prod.price);
                        if (numPrice < 15000) {
                            badgeHtml = `<span class="cashback-badge">Terlaris</span>`;
                        }
                    }

                    card.innerHTML = `
                        <div class="product-image">
                            <img src="${prod.img}" alt="${prod.title}">
                            ${badgeHtml}
                        </div>
                        <div class="product-info">
                            <h3 class="product-title">${prod.title}</h3>
                            <div class="product-price">${prod.price}</div>
                            ${prod.strike ? `<div class="product-price-strike">${prod.strike}</div>` : ''}
                            <div class="product-meta">
                                <span class="rating"><i class="ph-fill ph-star"></i> ${prod.rating} | ${prod.sold}</span>
                                <span class="location"><i class="ph ph-map-pin"></i> ${prod.location}</span>
                            </div>
                        </div>
                    `;
                    grid.appendChild(card);
                });

                // Render Pagination Buttons
                const paginationContainer = document.querySelector('.pagination');
                if (paginationContainer) {
                    paginationContainer.innerHTML = '';
                    if (totalPages > 1) {
                        for (let i = 1; i <= totalPages; i++) {
                            const btn = document.createElement('button');
                            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
                            btn.innerText = i;
                            btn.onclick = () => {
                                renderGrid(currentSort, i);
                                // Scroll ke atas produk saat pindah halaman
                                const categoryMain = document.querySelector('.category-main-content');
                                if (categoryMain) categoryMain.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            };
                            paginationContainer.appendChild(btn);
                        }
                    }
                }
            };

            // Initial render
            renderGrid('Terkait', 1);

            const filterCheckboxes = document.querySelectorAll('#filter-gratis-ongkir, #filter-diskon, #filter-cashback, #filter-rating-4, #filter-rating-3');
            filterCheckboxes.forEach(cb => {
                if (cb) cb.addEventListener('change', () => renderGrid(currentSort, 1));
            });

            const applyPriceBtn = document.getElementById('apply-price-filter');
            if (applyPriceBtn) {
                applyPriceBtn.addEventListener('click', () => renderGrid(currentSort, 1));
            }

            if (sortingTabs.length > 0) {
                sortingTabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        sortingTabs.forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                        renderGrid(tab.innerText.trim(), 1); // Reset to page 1 on sort
                    });
                });
            }
        }
    }

    // Inisialisasi Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Keranjang Anda masih kosong! Silakan pilih produk terlebih dahulu.');
                return;
            }

            // Cek status login
            const isLoggedIn = localStorage.getItem('yuka_logged_in') === 'true';
            if (!isLoggedIn) {
                showAuthPopup();
                return;
            }

            // Simpan data keranjang ke localStorage
            localStorage.setItem('yuka_cart', JSON.stringify(cart));

            // Animasi tombol sebentar lalu pindah halaman
            const originalText = checkoutBtn.innerHTML;
            checkoutBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Menyiapkan...';
            checkoutBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 800); // transisi cepat ke halaman pembayaran
        });
    }

    // Logic for "Muat Lebih Banyak" button on index.html
    const loadMoreBtn = document.getElementById('load-more-btn');
    const path = window.location.pathname;
    if (path.includes('index.html') || path.endsWith('/') || path.endsWith('website') || path === '') {
        if (typeof renderRecommendations === 'function') {
            renderRecommendations();
        }
        const etalaseCards = document.querySelectorAll('.recommendation-section .etalase-card');
        if (etalaseCards.length > 0 && loadMoreBtn) {
            let currentItems = 10;

            // Hide items beyond currentItems
            etalaseCards.forEach((card, index) => {
                if (index >= currentItems) {
                    card.style.display = 'none';
                }
            });

            loadMoreBtn.addEventListener('click', () => {
                loadMoreBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Memuat...';

                setTimeout(() => {
                    let nextItems = currentItems + 10;

                    etalaseCards.forEach((card, index) => {
                        if (index >= currentItems && index < nextItems) {
                            card.style.display = 'block';
                            card.style.animation = 'popIn 0.5s forwards';
                        }
                    });

                    currentItems = nextItems;

                    if (currentItems >= etalaseCards.length) {
                        loadMoreBtn.style.display = 'none';
                    } else {
                        loadMoreBtn.innerHTML = 'Muat Lebih Banyak';
                    }
                }, 800); // Simulasi loading
            });
        }
    }
});

// Fungsi Custom Popup untuk Login
const showAuthPopup = () => {
    let popup = document.getElementById('auth-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'auth-popup';
        popup.className = 'custom-popup-overlay';
        popup.innerHTML = `
            <div class="custom-popup-card">
                <div class="popup-icon"><i class="ph ph-warning-circle"></i></div>
                <h3>Akses Tertunda</h3>
                <p>Anda harus masuk (login) atau mendaftar akun terlebih dahulu untuk memproses pembayaran pesanan Anda.</p>
                <div class="popup-actions">
                    <button class="popup-btn-cancel" onclick="document.getElementById('auth-popup').classList.remove('active')">Batal</button>
                    <a href="login.html" class="popup-btn-primary" style="text-decoration:none; display:inline-block; text-align:center; box-sizing:border-box;">Masuk / Daftar</a>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
    }

    requestAnimationFrame(() => {
        setTimeout(() => {
            popup.classList.add('active');
        }, 10);
    });
};

// ==========================================
// E-Commerce Homepage Logic (Carousel, Timer, Sticky Header)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header Logic
    const mainHeader = document.getElementById('main-header');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.style.padding = '0.5rem 5%';
                mainHeader.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            } else {
                mainHeader.style.padding = '1rem 5%';
                mainHeader.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
            }
        });
    }

    // 2. Carousel Banner Logic
    const track = document.getElementById('carousel-track');
    const originalSlides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    if (track && originalSlides.length > 0) {
        let currentIndex = 0;
        const totalSlides = originalSlides.length;
        let isTransitioning = false;

        // Clone first and last slides for infinite scroll effect
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[totalSlides - 1].cloneNode(true);

        track.appendChild(firstClone);
        track.prepend(lastClone);

        // Create indicators
        originalSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('indicator');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                if (isTransitioning || currentIndex === index) return;
                currentIndex = index;
                updateCarousel(true);
            });
            if (indicatorsContainer) indicatorsContainer.appendChild(dot);
        });
        const indicators = document.querySelectorAll('.indicator');

        // Set initial position (accounting for prepended clone)
        track.style.transition = 'none';
        track.style.transform = `translateX(-100%)`;

        const updateCarousel = (withTransition = true) => {
            if (withTransition) {
                track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                clearTimeout(track.transitionTimeout);
                track.transitionTimeout = setTimeout(() => {
                    if (isTransitioning) track.dispatchEvent(new Event('transitionend'));
                }, 650);
            } else {
                track.style.transition = 'none';
            }
            track.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;

            // Update indicators active state
            let activeIndex = currentIndex;
            if (currentIndex === totalSlides) activeIndex = 0;
            if (currentIndex === -1) activeIndex = totalSlides - 1;

            indicators.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        };

        const nextSlide = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            updateCarousel(true);
        };

        const prevSlide = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex--;
            updateCarousel(true);
        };

        track.addEventListener('transitionend', () => {
            isTransitioning = false;
            // Instantly jump to the real slide if we reached a clone
            if (currentIndex >= totalSlides) {
                currentIndex = 0;
                updateCarousel(false);
            } else if (currentIndex <= -1) {
                currentIndex = totalSlides - 1;
                updateCarousel(false);
            }
        });

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Klaim Voucher Interaction
        const klaimBtns = document.querySelectorAll('.klaim-btn');
        klaimBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                if (!this.classList.contains('claimed')) {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="ph ph-spinner-gap"></i> Proses...';
                    this.style.opacity = '0.8';

                    setTimeout(() => {
                        this.classList.add('claimed');
                        this.innerHTML = '<i class="ph-fill ph-check-circle"></i> Berhasil';
                        this.style.background = '#10b981'; // Success Green
                        this.style.color = 'white';
                        this.style.opacity = '1';
                        this.style.pointerEvents = 'none'; // Disable multiple clicks
                        this.style.transform = 'scale(1)';
                        this.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                    }, 800);
                }
            });
        });

        // Auto slide
        let slideInterval = setInterval(nextSlide, 5000);

        // Pause on hover
        const carouselContainer = document.querySelector('.main-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
            carouselContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
    }

    // Notifications and Messages Tabs Logic
    const pdTabs = document.querySelectorAll('.pd-tab');
    if (pdTabs.length > 0) {
        const switchTab = (targetId) => {
            document.querySelectorAll('.pd-description').forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            pdTabs.forEach(t => t.classList.remove('active'));

            const targetContent = document.getElementById(targetId);
            const targetTab = document.querySelector(`.pd-tab[data-target="${targetId}"]`);

            if (targetContent && targetTab) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
                targetTab.classList.add('active');
            }
        };

        pdTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                switchTab(tab.getAttribute('data-target'));
            });
        });

        // Check hash on load to open specific tab (e.g., #pesan)
        if (window.location.hash === '#pesan') {
            switchTab('tab-pesan');
        } else {
            switchTab(pdTabs[0].getAttribute('data-target'));
        }
    }

    // Flash sale countdown logic is now handled by initFlashSaleCountdown() at the bottom of the file
});

// ==========================================
// Product Modal Logic
// ==========================================
const productModalOverlay = document.getElementById('product-modal-overlay');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalImg = document.getElementById('modal-product-img');
const modalTitle = document.getElementById('modal-product-title');
const modalPrice = document.getElementById('modal-product-price');
const modalStrike = document.getElementById('modal-product-strike');
const modalRating = document.getElementById('modal-product-rating');
const modalSold = document.getElementById('modal-product-sold');

let currentModalBasePrice = 0;

// Modal Quantity
const modalQtyMinus = document.getElementById('modal-qty-minus');
const modalQtyPlus = document.getElementById('modal-qty-plus');
const modalQtyInput = document.getElementById('modal-qty-input');
const modalSubtotal = document.getElementById('modal-subtotal');

const updateModalSubtotal = () => {
    if (modalSubtotal && currentModalBasePrice > 0) {
        let qty = parseInt(modalQtyInput.value) || 1;
        modalSubtotal.innerText = formatRupiah(currentModalBasePrice * qty);
    }
};

if (modalQtyMinus && modalQtyPlus && modalQtyInput) {
    modalQtyMinus.addEventListener('click', () => {
        let val = parseInt(modalQtyInput.value);
        if (val > 1) {
            modalQtyInput.value = val - 1;
            updateModalSubtotal();
        }
    });
    modalQtyPlus.addEventListener('click', () => {
        let val = parseInt(modalQtyInput.value);
        modalQtyInput.value = val + 1;
        updateModalSubtotal();
    });
}

window.modalAddToCart = function () {
    if (!modalTitle || currentModalBasePrice === 0) return;

    let priceInt = currentModalBasePrice;

    let qty = modalQtyInput ? parseInt(modalQtyInput.value) : 1;
    let title = modalTitle.innerText;
    let imgSrc = modalImg ? modalImg.src : '';

    // Generate a pseudo-ID based on title length or hash so it stacks properly if added again
    let pseudoId = title.length + priceInt;

    // Call the global addCustomToCart
    window.addCustomToCart(pseudoId, title, 'Produk', priceInt, 'pcs', 'ph-package', imgSrc, qty);

    if (closeModalBtn) closeModalBtn.click();
};

window.openProductModal = function (cardElement) {
    // Extract info from clicked card
    const title = cardElement.querySelector('.product-title').innerText;
    const priceText = cardElement.querySelector('.product-price').innerText;
    const imgSrc = cardElement.querySelector('img').src;

    // Set base price
    let priceStr = priceText.replace(/[^\d]/g, '');
    currentModalBasePrice = parseInt(priceStr) || 0;

    // Reset modal qty and subtotal
    if (modalQtyInput) {
        modalQtyInput.value = 1;
        updateModalSubtotal();
    }

    // Some cards have rating and sold, some have progress-text (flash sale)
    const ratingEl = cardElement.querySelector('.rating');
    const soldEl = cardElement.querySelector('.progress-text');
    const strikeEl = cardElement.querySelector('.product-price-strike');

    if (modalTitle) modalTitle.innerText = title;
    if (modalPrice) modalPrice.innerText = priceText;
    if (modalImg) modalImg.src = imgSrc;

    if (strikeEl && modalStrike) {
        modalStrike.innerText = strikeEl.innerText;
        modalStrike.style.display = 'block';
    } else if (modalStrike) {
        modalStrike.style.display = 'none';
    }

    if (ratingEl && modalRating) {
        modalRating.innerText = ratingEl.innerText.replace(/[^\d\.]/g, ''); // Extract just number
    } else if (modalRating) {
        modalRating.innerText = '4.9';
    }

    if (modalSold) {
        if (soldEl) {
            modalSold.innerText = soldEl.innerText;
        } else {
            const ratingFullText = ratingEl ? ratingEl.innerText : '';
            if (ratingFullText.includes('|')) {
                modalSold.innerText = ratingFullText.split('|')[1].trim();
            } else {
                modalSold.innerText = 'Terjual 100+';
            }
        }
    }

    if (productModalOverlay) {
        productModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
};

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        productModalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

if (productModalOverlay) {
    productModalOverlay.addEventListener('click', (e) => {
        if (e.target === productModalOverlay) {
            productModalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Theme toggle is handled by transition.js

// ==========================================
// Product Page Interactions
// ==========================================
// 1. Image Gallery
const mainImg = document.getElementById('main-product-img');
const thumbnails = document.querySelectorAll('.thumbnail');
if (mainImg && thumbnails.length > 0) {
    mainImg.style.transition = 'opacity 0.2s ease-in-out';
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');

            const imgSrc = thumb.querySelector('img').src;
            mainImg.style.opacity = '0.5';
            setTimeout(() => {
                mainImg.src = imgSrc;
                mainImg.style.opacity = '1';
            }, 200);
        });
    });
}

// 2. Quantity Selector
const qtyBtns = document.querySelectorAll('.qty-btn');
const qtyInput = document.querySelector('.qty-input');
const subtotalEl = document.querySelector('.pd-subtotal strong');
if (qtyBtns.length === 2 && qtyInput) {
    const minusBtn = qtyBtns[0];
    const plusBtn = qtyBtns[1];

    const updateSubtotal = () => {
        if (subtotalEl) {
            const price = window.currentProductPrice || 45000;
            subtotalEl.textContent = formatRupiah(price * parseInt(qtyInput.value));
        }
    };

    minusBtn.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val > 1) {
            qtyInput.value = val - 1;
            updateSubtotal();
        }
    });

    plusBtn.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        qtyInput.value = val + 1;
        updateSubtotal();
    });
}

// 3. Product Tabs
const pdTabs = document.querySelectorAll('.pd-tab');
if (pdTabs.length > 0) {
    pdTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            pdTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.getAttribute('data-target');
            if (target) {
                document.querySelectorAll('.pd-tab-contents .pd-description').forEach(content => {
                    if (content.id === target) {
                        content.style.display = 'block';
                        content.classList.add('active');
                    } else {
                        content.style.display = 'none';
                        content.classList.remove('active');
                    }
                });
            }
        });
    });
}

// ==========================================
// Category Page Interactions
// ==========================================
// 1. Sorting Tabs
const sortingTabs = document.querySelectorAll('.sorting-tab');
if (sortingTabs.length > 0) {
    sortingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            sortingTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

// 2. Pagination
const pageBtns = document.querySelectorAll('.page-btn');
if (pageBtns.length > 0) {
    pageBtns.forEach(btn => {
        if (!btn.querySelector('i')) { // ignore the 'next' arrow button for simple demo
            btn.addEventListener('click', () => {
                pageBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    });
}

// ==========================================
// Dynamic Product Data & Rendering
// ==========================================
const productsDatabase = {
    'pensil-warna': {
        title: 'Faber-Castell Classic Set 48 Warna',
        price: 'Rp 125.000',
        strike: 'Rp 150.000',
        discount: 'Diskon 50%',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEJs5tSZ5YLwH0Vt5OaO0oeeqAZ87ddgNxdg&s',
        img2: 'https://sg-test-11.slatic.net/p/534918bdab075978ef2e1574778fc46d.jpg',
        img3: 'https://laz-img-sg.alicdn.com/p/ec329345ad0280fad3a9093e0709fcdc.png',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: `Aman untuk anak-anak
Tidak beracun
Warna-warna yang cemerlang
Sistem SV Bonding, ujung pensil tidak mudah patah
Tersedia warna emas
Sudah bersertifikat TKDN (Tingkat Komponen Dalam Negeri).`
    },
    'tas-laptop': {
        title: 'ANTARESTAR Tas Ransel Helios',
        price: 'Rp 269.500',
        strike: 'Rp 475.000',
        discount: 'Diskon 40%',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://antarestar.com/wp-content/uploads/2024/01/id-11134207-7r98s-lqea2zbvaxb2e3.jpg',
        img2: 'https://antarestar.com/wp-content/uploads/2024/01/id-11134207-7r98o-lqea2zbvcbvi9b-510x510.jpg',
        img3: 'https://antarestar.com/wp-content/uploads/2024/01/id-11134207-7r98w-lqea2zbvhy5ae1-510x510.jpg',
        category: 'Aksesoris',
        location: 'Wangi-Wangi',
        desc: `Buat yang suka bepergian travelling atau beraktifitas kemana mana, kadang kita butuh extra BACKPACK yang BESAR untuk menemani trip kita. Nah, BACKPACK HELIOS ini sangat cocok untuk menemani petualangan dan segala aktifitas kalian.
Dengan bahan Premium Bimo Polyster yang Waterproof dan resleting full zipper waterproof membuat Backpack HELIOS ini tahan di cuaca panas maupun hujan. Barang-barangmu tetap terjaga aman tanpa perlu takut kebasahan.
FITUR :
Tali ransel empuk
Tersedia Tumblr Pocket tempat khusus botol minum
Tas ransel fashionable
1 kantong utama
1 kompartemen khusus untuk laptop
Saku depan multifungsi dengan zipper
Tersedia 1 port Earphone Holder untuk menemani aktivitas bermusik kalian
Desain Simple, Keren, dan Elegan
Pada bagian punggung dan tali terdapat bantalan busa..`
    },
    'buku-agenda': {
        title: 'MAHADA Buku Agenda Kulit Blok Lem',
        price: 'Rp 65.000',
        strike: 'Rp 81.500',
        discount: '20%',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://www.mahada.co.id/wp-content/uploads/2021/06/Buku-Agenda-Berbahan-Kulit-Dengan-Model-Jilid-Blok-Lem-Dilengkapi-Pengunci-Magnet-1.jpg.webp',
        img2: 'https://www.mahada.co.id/wp-content/uploads/2021/06/Buku-Agenda-Berbahan-Kulit-Dengan-Model-Jilid-Blok-Lem-Dilengkapi-Pengunci-Magnet-6.jpg.webp',
        img3: 'https://www.mahada.co.id/wp-content/uploads/2021/06/Buku-Agenda-Berbahan-Kulit-Dengan-Model-Jilid-Blok-Lem-Dilengkapi-Pengunci-Magnet-5.jpg.webp',
        category: 'Buku & Kertas',
        location: 'Wangi-Wangi',
        desc: `Bahan Cover	
Hardcover Dilapis Kulit

Isi Buku	
Polos, Cetakan

Logo	
Deboss Logo Foil

Pilihan Jilid	
Blok Lem

Pengunci Cover	
Magnet

Warna Logo	
Polos, Emas, Silver, Warna Lain.`
    },
    'tinta-printer': {
        title: 'Tinta Printer EPSON 664 Black T6641',
        price: 'Rp 120.000',
        strike: 'Rp 150.000',
        discount: '20%',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://pegastore.id/media/product_image/1747906214-foto-produk-(30).jpg',
        img2: 'https://parto.id/asset/foto_produk/664b.jpg',
        img3: 'https://fixprint.id/_next/image?url=https%3A%2F%2Fminio.fixprint.id%2Ffixprint%2Fcatalog%2FTINTA%2F8885007024080_tinta_epson_664_baru_black_2.jpg&w=640&q=75',
        category: 'Percetakan',
        location: 'Wangi-Wangi',
        desc: `Support Printer Type :
Epson L110 L120 L210
Epson L220 L300 L310
Epson L350 L355 L360
Epson L365 L380 L385
Epson L405 L485 L550
Epson L555 L565 L655
Epson L100 L200 L1300 L1455`
    },
    'pulpen-gel': {
        title: 'Pulpen Gel Joyko GP-265 0.5mm Hitam (Lusin)',
        price: 'Rp 13.500',
        strike: 'Rp 15.000',
        discount: '10%',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://andalanatk.com/upload/produk/6901b814eefa81.87516637_986852_produk.webp',
        img2: 'https://www.joyko.co.id/image/cache/data/additional/GP-265-size-01-650x650.jpg',
        img3: 'https://www.joyko.co.id/image/cache/data/additional/GP-265-beauty-04-01-650x650.jpg',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: 'Tinta lebih lancar, cepat kering, dan sangat nyaman digunakan untuk menulis dokumen penting atau catatan harian.'
    },
    'buku-tulis': {
        title: 'Buku Tulis HVS SiDu 58 Lembar (Pack)',
        price: 'Rp 35.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//89/MTA-55436011/br-m036969-07062_-pack-buku-tulis-sidu-sinar-dunia-58-lembar-murah_full01.jpg',
        img2: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/103/MTA-141175399/brd-48790_buku-tulis-sidu-58_full01-fe242727.jpg',
        img3: 'https://bangkitperkasa.com/storage/2023/01/BUKU-TULIS-SIDU-58-LEMBAR.jpg',
        category: 'Buku & Kertas',
        location: 'Wangi-Wangi',
        desc: ` Kualitas kertas tebal, putih, dan halus

> Nyaman untuk menulis

> Tidak tembus tinta

> Ideal digunakan untuk pelajar SD dalam kegiatan sekolah

> Terdiri dari beraneka macam gambar sampul buku

> Pilihan gambar sampul sesuai dengan stok yang tersedia`
    },
    'macbook-air-m4': {
        title: 'MacBook Air M4',
        price: 'Rp 15.999.999',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://ibox.co.id/_next/image?url=https%3A%2F%2Fcdnpro.eraspace.com%2Fmedia%2Fcatalog%2Fproduct%2Fa%2Fp%2Fapple_macbook_air_13.6_inci_m4_2025_sky_blue_1_2.jpg&w=1920&q=45',
        img2: 'https://pegastore.id/media/product_image/1751533288-macbook-air-mw0w3id-(2).jpg',
        img3: 'https://ibox.co.id/_next/image?url=https%3A%2F%2Fcdnpro.eraspace.com%2Fmedia%2Fcatalog%2Fproduct%2Fa%2Fp%2Fapple_macbook_air_13.6_inci_m4_2025_sky_blue_10_2.jpg&w=1920&q=45',
        category: 'Komputer',
        location: 'Wangi-Wangi',
        desc: `MacBook Air 13 inci dengan chip M4 memungkinkan Anda menuntaskan pekerjaan dan permainan dengan cepat. Dengan layar Liquid Retina yang cemerlang, kekuatan baterai hingga 18 jam, dan desain yang luar biasa tipis dan ringan, MacBook Air dibuat agar lebih tahan lama dan mampu melakukan segalanya, di mana saja.

FITUR:

BERTENAGA SUPER BERKAT M4 — Chip Apple M4 membuat semua yang Anda lakukan menjadi jauh lebih cepat dan lancar, seperti bekerja di berbagai aplikasi, mengedit video, atau bermain game sarat grafis.

KEKUATAN BATERAI HINGGA 18 JAM — MacBook Air memberikan performa yang sama-sama luar biasa ketika dicolok maupun tidak.

DESAIN PORTABEL — Sangat ringan dan hanya setengah inci tipisnya, MacBook Air pas di tas Anda — dan menyatu dengan mudah dalam gaya hidup Anda.

LAYAR CEMERLANG — Layar Liquid Retina 13,6 inci mendukung satu miliar warna. Foto dan video tampil memukau dengan kontras kaya dan detail tajam, dan teks terlihat sangat jelas.

TERLIHAT DAN TERDENGAR SEMPURNA — Semuanya terlihat dan terdengar memukau dengan kamera 12MP Center Stage, tiga mikrofon, dan empat speaker dengan Audio Spasial.

HUBUNGKAN SEMUANYA — MacBook Air memiliki dua port Thunderbolt 4, port pengisian daya MagSafe, jek headphone, Wi-Fi 6E, dan Bluetooth 5.3. Dan mendukung hingga dua layar eksternal.

APLIKASI BEKERJA CEPAT DI MACOS — Semua aplikasi favorit Anda berjalan sangat cepat di macOS, termasuk Microsoft 365, Adobe Creative Cloud, dan Google Workspace.

KALAU SUKA IPHONE, ANDA AKAN SUKA MAC — Mac bekerja serasi dengan perangkat Apple lainnya. Lihat dan kendalikan semua yang ada di iPhone Anda dari Mac Anda dengan Pencerminan iPhone. Salin sesuatu di iPhone dan tempelkan di Mac. Kirim teks dengan Pesan atau gunakan Mac untuk melakukan dan menjawab panggilan FaceTime.

ISI KOTAK:

MacBook Air 13 inch M4
Adaptor daya USB-C
Kabel USB-C ke Magsafe 3 (2m)`
    },
    'kuas-lukis': {
        title: 'Kuas Lukis Cat Air Watercolor Set 6 Pcs',
        price: 'Rp 20.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/b967c0e56d2247fbad1fc041522694f9~.jpeg.webp',
        img2: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg_KAFv7PQvZxeEuEAH0KlBPmoDGGopioobA&s',
        img3: 'https://philang.com/storage/products/joyko/36029a81-5225-448f-8303-f5fbaa1f34e1.jpg',
        category: 'Seni & Lukis',
        location: 'Wangi-Wangi',
        desc: 'Set 6 kuas berbagai ukuran berbahan nilon sintetik halus. Mudah dibersihkan dan tidak rontok.'
    },
    'stapler': {
        title: 'Stapler Heavy Duty HD-12L/24',
        price: 'Rp 471.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://shop.kenko.co.id/image/cache/catalog/product/Stapler/Heavy-Duty-Stapler-HD-12L24-700x700.jpg',
        img2: 'https://alattuliskantor.id/wp-content/uploads/2024/11/88.jpg',
        img3: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/104/MTA-182197157/no_brand_heavy_duty_stapler_j0yk0_hd12l-24-_stapler_or_staples_hd_12l-24_full01_v2rgx761.jpg',
        category: 'Alat Kantor',
        location: 'Wangi-Wangi',
        desc: 'Stapler awet bahan besi kokoh anti macet. Sangat pas untuk penggunaan kantor dan sekolah sehari-hari.'
    },
    'keyboard-rgb': {
        title: 'Keyboard Mekanik Zifriend TK68 RGB Backlit N-key rollover Mode Berkabel Plug and Play',
        price: 'Rp 489.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://www.zifriend.net/cdn/shop/files/TK68_-800_-RGB_239acbec-f497-4122-8b63-9d29d27e6538.jpg?v=1742524963&width=990',
        img2: 'https://www.zifriend.net/cdn/shop/files/TK68_-800RGB.jpg?v=1742524963&width=990',
        img3: 'https://www.zifriend.net/cdn/shop/files/TK68_-800_f21a2ab8-b6ca-4126-8831-aa3d216b3696.jpg?v=1742524963&width=990',
        category: 'Elektronik',
        location: 'Wangi-Wangi',
        desc: `>68 tombol
>Saklar Merah atau Coklat
>Saklar yang dapat diganti
>Lampu RGB, 17 efek pencahayaan.
>Kabel: Kabel PVC 1,5M yang dapat dilepas
>N-keys rollover
Keycap ABS injeksi dua warna
Tata letak bahasa Rusia/Portugis/Spanyol/Inggris`
    },
    'gunting': {
        title: 'Joyko Gunting Kertas Serbaguna Tajam Stainless',
        price: 'Rp 12.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/img/product-1/2019/12/16/77174725/77174725_3d8d3e5c-1471-4de0-8478-754da270438c_700_700~tplv-aphluv4xwc-resize-jpeg:700:0.image',
        img2: 'https://id-test-11.slatic.net/p/c988e4ea7a0061c673d337c81c97b507.jpg',
        img3: 'https://id-live-01.slatic.net/p/66a8325a864224ee2816f26394886754.jpg',
        category: 'Alat Kantor',
        location: 'Wangi-Wangi',
        desc: 'Gunting dengan pegangan ergonomis berlapis karet. Bilah stainless steel anti karat.'
    },
    'earphone': {
        title: 'Soundcore Snker a20i',
        price: 'Rp 699.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://www.ankerindonesia.com/cdn/shop/products/9faf5720-7124-4e0f-93b0-8db1dfa1f9d6-a3948h11-soundcore-a20i-black-1-1.jpg?v=1709833930&width=823',
        img2: 'https://www.ankerindonesia.com/cdn/shop/products/57872b98-cee8-4cdc-a16f-1c8927b6123c-a3948h11-soundcore-a20i-black-3-1.jpg?v=1709833930&width=823',
        img3: 'https://www.ankerindonesia.com/cdn/shop/products/a25cc789-677a-4273-a713-4d4f387d7bf5-a3948h11-soundcore-a20i-black-7-1.jpg?v=1709833930&width=823',
        category: 'Elektronik',
        location: 'Wangi-Wangi',
        desc: `Model : A3948
 

Soundcore A20i - A3948 (Buds)

90692/SDPPI/2023

Ekstra-bass, pengalaman musik yang kuat

• soundcore signature EQ dan Bass-Up EQ, memberikan Anda pengalaman musik yang luar biasa

•20 EQ lainnya tersedia di Aplikasi untuk Anda pilih

 

Dikelilingi oleh musik sepanjang hari

• 9 jam pemakain untuk 1x charging dengan maksimal playtime 28 jam

• Pengisian cepat 10 mnt = 2 jam

 

Bawa earbud Anda ke mana saja

•Terdapat Gantungan Tali yang membantu Anda memasang earbud ke kunci dengan mudah.

 

Kualitas panggilan yang unggul

Algoritma Al 2-mic untuk memberi Anda kualitas panggilan yang lebih baik

Small, Sleek Chic Design untuk gaya hidup perkotaan.

 

APA YANG ADA DI DALAM KOTAK

• Wadah pengisi daya x 1

• Ujung telinga (Eartips) x 3 ukuran

• Kabel USB-C x 1

• Manual Book × 1

• Kartu Garansi x 1

• Lanyard/Tali x 1

 

Aplikasi Soundcore

• Mode Permainan Latensi Rendah

 

Temukan Earbud Anda

22 EQ

Kebisingan Putih

Indikasi Baterai

 

Fitur Teknologi:

Bluetooth 5.3

Mudah Digunakan dengan salah satu Earbud

IPX5`
    },
    'spidol-warna': {
        title: 'Snowman Spidol Warna Set 12',
        price: 'Rp 25.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://leksikabookstore.com/uploads/5beceacf418dc_20181115104103-1.jpg',
        img2: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/94/MTA-181824240/br-m036969-03044_spidol-set-12-warna-snowman-pw-12a-coloring-marker-12-color-markers-pencil_full03-04f08754.jpg',
        img3: 'https://siplah.blibli.com/data/images/STWS-0009-00154/5fa56659-a8ab-4263-b40d-72889fea5091.png',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: `Set 12 spidol warna berkualitas dengan warna yang cerah. Tinta cepat kering dan tidak mudah luntur.
        >Set 12 spidol warna cerah untuk menggambar, mewarnai, dan menulis.<br>
        >Ujung runcing presisi dan tinta berbasis air yang tidak beracun.<br>
        >Tidak mudah luntur dan aman untuk anak-anak.<br>
        >Cocok digunakan di sekolah, rumah, dan aktivitas seni.`
    },
    'mouse-logitech': {
        title: 'Logitech M330 Silent Plus Wireless Mouse',
        price: 'Rp 285.000',
        strike: 'Rp 329.000',
        discount: '13%',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/m330-wireless-silent-mouse/2024-update/gallery/m330-wireless-mouse-top-view-black-gallery-01.png',
        img2: 'https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/m330-wireless-silent-mouse/2024-update/gallery/m330-wireless-mouse-black-gallery-03.png',
        img3: 'https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/m330-wireless-silent-mouse/2024-update/gallery/m330-wireless-mouse-black-gallery-05.png',
        category: 'Elektronik',
        location: 'Wangi-Wangi',
        desc: `M331 SILENT PLUS menghadirkan kenyamanan tangan kanan terbaik, akurasi luar biasa, daya tahan baterai yang lama, dan kompatibilitas yang luas, sekaligus mengurangi lebih dari 90%* suara klik.

        Dimensi:

Mouse<br>
Tinggi: 105,4 mm
Lebar: 67,9 mm
Tebal: 38,4 mm
Berat (dengan baterai): 78 g
Receiver USB
Tinggi: 14,4 mm
Lebar: 18,7 mm
Tebal: 6,1 mm
Berat: 1,8 g
Spesifikasi Teknis<br>
SilentTouch Technology
Klik Tengah/Kanan, Klik Tengah, suara Scrolling dan Gliding telah dikurangi ?
Teknologi sensor
Penelusuran optik yang mulus
DPI (Min./Maks.): 1000±
Tombol
Jumlah Tombol : 3 (Klik Kiri/Kanan, Klik Tengah)
Scrolling
Line-by-line scrolling
Scroll Wheel: Ya, Rubber, 2D, mechanical
Baterai
Daya tahan baterai: 18 bulan ? 
Informasi Baterai: 1 X AA (disertakan)<br>
Material dan Keberlanjutan:<br>
Plastik Daur Ulang
Bagian plastik dalam M331 SILENT PLUS meliputi plastik daur ulang pascakonsumen yang tersertifikasi guna memberikan kehidupan baru bagi plastik dari barang elektronik konsumen lama dan membantu mengurangi jejak karbon kita.<br>
Hitam plastik: 76% bahan daur ulang
Blue plastik: 58% bahan daur ulang
Red plastik: 58% bahan daur ulang<br>
Isi kemasan:<br>
Mouse
Receiver USB
1 baterai AA (pra-instal)
Dokumentasi pengguna
`
    },
    'kertas-manila': {
        title: 'Kertas Karton Manila Warna Warni F4 (Isi 10)',
        price: 'Rp 15.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/MTA-150816804/tidak_ada_merk_kertas_karton_manila_-_kertas_karton_warna_full01_h80xj2nw.jpg',
        img2: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa95dhJPbVHd4DpJAWnnqYsSH2ZYMUbMR8Cg&s',
        img3: 'https://cdn.ralali.id/assets/img/Libraries/Kertas-Karton-BC-Lux-Manila-A1-60x84cm-(Hitam-coklat-ungu)_kK85TaoMZQbTsrwV_1639080652.png',
        category: 'Buku & Kertas',
        location: 'Wangi-Wangi',
        desc: `>Kertas manila warna-warni dengan ukuran F4.`
    },
    'spidol-board': {
        title: 'Spidol Board Marker Hitam (Pack isi 12)',
        price: 'Rp 75.000',
        strike: 'Rp 100.000',
        discount: '11%',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://id-test-11.slatic.net/p/e66288f609ad7f13b6b0a1e1fb6169b8.jpg',
        img2: 'https://parto.id/asset/foto_produk/cb614c2edee69585d2f60062f1a0b660_jpg_720x720q80_jpg_.png',
        img3: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzKUfj_BfFuulXCMm5QmC5WK3eNmosJejL8Q&s',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: 'Spidol papan tulis yang mudah dihapus dan tahan lama, tidak cepat kering.'
    },
    'tinta-canon': {
        title: 'Tinta Printer Canon GI-790 135 Ml',
        price: 'Rp 115.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://els.id/wp-content/uploads/2023/09/783a496e-c097-43bd-84bf-8b23bd06000b-1.jpg',
        img2: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//101/MTA-17208559/canon_tinta_canon_790_black_original_full01_drhkmvv6.jpg',
        img3: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwL7Nfees0ZgGmZLCOI-ExNajTy7FOwDcVJg&s',
        category: 'Percetakan',
        location: 'Wangi-Wangi',
        desc: 'Tinta botol original Canon, hasil cetak tajam dan awet.'
    },
    'binder-b5': {
        title: 'JOYKO Buku Binder B5 Pastel B5',
        price: 'Rp 45.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://down-id.img.susercontent.com/file/315926c63c9114f311842e0d376573c9',
        img2: 'https://imgx.brdcdn.com/imgx/1200/aW1hZ2VzLnRva29wZWRpYS5uZXQvaW1nL2NhY2hlLzcwMC9WcWJjbU0vMjAyMS8xMC84L2U5ZjhkMWZjLWJlNjItNGJlZi04ZjJmLTMxZGM3MTcxYzlmYQ==.jpg',
        img3: 'https://id-live-01.slatic.net/p/bd947bca925b462685893fae9a145189.jpg',
        category: 'Buku & Kertas',
        location: 'Wangi-Wangi',
        desc: 'Binder stylish ukuran B5 lengkap dengan isi kertas.'
    },
    'penghapus-joyko': {
        title: 'Penghapus Joyko Eraser 526-B40BL',
        price: 'Rp 32.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://www.joyko.co.id/image/cache/data/additional/526-B40BL-Info-01-650x650.jpg',
        img2: 'https://www.joyko.co.id/image/cache/data/additional/ERASER-526-B40BL-BEAUTY-2-01-650x650.jpg',
        img3: 'https://www.joyko.co.id/image/cache/data/additional/526-B40BL-+-Box-01-650x650.jpg',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: 'Penghapus berkualitas sangat bersih saat digunakan, tidak mengotori kertas.'
    },
    'pensil-2b': {
        title: 'Pensil 2B Faber Castell Ujian (Pack isi 12)',
        price: 'Rp 48.000',
        strike: 'Rp 55.000',
        discount: '12%',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://andalanatk.com/upload/produk/6901b62a281963.99038156_1641963771_faber-castell_faber-castell-9000-2b-pensil--12-pcs-_full02.webp',
        img2: 'https://faber-castell.co.id/cfind/source/images/product/gwm/117102-a.jpg',
        img3: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//101/MTA-5355299/faber-castell_faber_castell_pensil_2b_1_pack_isi_12_full03_ldwvx84y.jpg',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: `>Pensil khusus untuk ujian nasional<br>
>Lulus uji scanner OMR dan DMR<br>
>Terdiri dari 16 ketebalan berbeda untuk menghasilkan karya seni yang luar biasa.<br>
>Mulai dari 6H sampai dengan 8B<br>
>Banyak dipakai oleh seniman kelas dunia.<br>
>Dengan teknologi SV Bonding sehingga tidak mudah patah<br>
>Mudah diraut<br>
>Sudah tersertifikasi TKDN (Tingkat Komposisi Dalam Negeri)`
    },
    'penggaris-besi': {
        title: 'Kenko Penggaris Besi Stainless 30cm',
        price: 'Rp 12.500',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://shop.kenko.co.id/image/cache/catalog/product/Ruler%20Stainless/Stainless-Steel-Ruler-700x700.jpg',
        img2: 'https://siplah.blibli.com/data/images/SWID-0002-00009/1df13639-bd1c-4857-bd25-c09a29dbbd24.jpg',
        img3: 'https://gadingonline.co.id/image/product/8998838358078.jpg',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: `>Penggaris besi anti karat dengan ukuran presisi 30 centimeter.
        >Baja tahan karat untuk presisi dan daya tahan.<br>
        >Tanda inci dan metrik untuk pengukuran serbaguna.<br>
        >Tepi untuk menggambar garis atau membuat sudut.<br>
        >Bagus untuk sekolah, kantor, dan proyek DIY.`
    },
    'lem-stick': {
        title: 'Lem Kertas Glue Stick Kenko 25 Gr',
        price: 'Rp 8.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://shop.kenko.co.id/image/cache/catalog/product/Glue-Stick/Glue-Stick-L=25gr-700x700.jpg',
        img2: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//108/MTA-67191768/kenko_lem-glue-stick-kenko-25-gr_full01.jpg',
        img3: 'https://media.monotaro.id/mid01/big/Kebutuhan%20Kantor/Produk%20Kantor/Lem/Lem%20Glue%20Stick/Kenko%20Lem%20Stik/P101005461-2.jpg',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: 'Lem kertas tidak berbau dan sangat rekat untuk kerajinan.'
    },
    'sticky-notes': {
        title: 'Sticky Notes Post-it 3x3 inch',
        price: 'Rp 15.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//89/MTA-3165910/joyko_joyko-mms-3-memo-stick-post-it--225-sheets-_full02.jpg',
        img2: 'https://image.bosoffice.co.id/s3/productimages/webp/co240310/p1635276/w600-h600/7ba4c7a5-d61c-449a-8095-d87138c70d2c.png',
        img3: 'https://static-tokodaring.tisera.id/prod/images/produk_gambar/685111194adfd.jpg',
        category: 'Buku & Kertas',
        location: 'Wangi-Wangi',
        desc: 'Kertas catatan tempel warna warni isi 100 lembar.'
    },
    'kalkulator': {
        title: 'Kalkulator Citizen 12 Digit',
        price: 'Rp 85.000',
        strike: 'Rp 100.000',
        discount: '15%',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://stationary.co.id/cdn/shop/products/kalkulator-citizen-sdc-810-office-stationery-toko-atk_354_1024x1024.jpg?v=1533822468',
        img2: 'https://siplah.blibli.com/data/images/STBS-0037-00103/a8042a7d-25e0-40e6-a5fa-72fbe49e58cc.png',
        img3: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYNZjjXBKzRgUcU-q1Nxu4KkmqTrN_BqlZww&s',
        category: 'Elektronik',
        location: 'Wangi-Wangi',
        desc: 'Kalkulator yang mudah ditekan dan awet.'
    },
    'flashdisk': {
        title: 'Flashdisk SanDisk Cruzer Blade 32GB',
        price: 'Rp 183.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://down-id.img.susercontent.com/file/87e02a945bc134e67279769484306537',
        img2: 'https://els.id/wp-content/uploads/2024/10/Sandisk-Cruzer-Blade.png',
        img3: 'https://sadarjaya.com/wp-content/uploads/2021/04/32gb-1.png',
        category: 'Elektronik',
        location: 'Wangi-Wangi',
        desc: 'Flashdisk original dengan garansi resmi 5 tahun.'
    },
    'kertas-foto': {
        title: 'Kertas Foto Glossy A4 210 Gsm',
        price: 'Rp 35.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://shop.kenko.co.id/image/cache/catalog/product/Photo%20Paper/Glossy-Photo-Paper-210-gsm-GP-210-A4-700x700.jpg',
        img2: 'https://shop.kenko.co.id/image/cache/catalog/product/Photo%20Paper/Glossy-Photo-Paper-230-gsm-GP-230-A4-300x300.jpg',
        img3: 'https://down-id.img.susercontent.com/file/1b2b2a3f59764b314781b4c5ca0face8',
        category: 'Buku & Kertas',
        location: 'Wangi-Wangi',
        desc: `>Kertas khusus cetak foto yang mengkilap.`
    },
    'isolasi': {
        title: 'Isolasi Bening Nachi Tape (Pack isi 6)',
        price: 'Rp 30.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://down-id.img.susercontent.com/file/ec9b199d8bd5be12f7ef3e75e9ce8a64',
        img2: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6TC99Ett_a90pab8XLuQkRJtJED0qpt4Vjg&s',
        img3: 'https://down-id.img.susercontent.com/file/2efc20911cdc8f9c77d82998503138dc',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: 'Selotip bening ukuran besar, lem sangat kuat.'
    },
    'lakban-hitam': {
        title: 'Lakban Hitam Daimaru 2 inci',
        price: 'Rp 14.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://siplah.blibli.com/data/images/STFA-0004-00199/cb342b41-4979-4a22-a737-1f9ecfab0fa8.jpg',
        img2: 'https://siplah.blibli.com/data/images/SUSS-0001-00026/33ff6996-3484-48b0-bb67-5738d08b70d2.jpg',
        img3: 'https://down-id.img.susercontent.com/file/099ed989b5ac315fc84487eeff7fbc86',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: 'Lakban kain hitam anti sobek, sangat cocok untuk penjilidan.'
    },
    'map-snailhecter': {
        title: 'Map Plastik Snailhecter (1 Lusin)',
        price: 'Rp 60.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://down-id.img.susercontent.com/file/42d7d0c4eb99feb8b7e692a3336e528a',
        img2: 'https://down-id.img.susercontent.com/file/id-11134207-7ra0n-mc8d6gqyn51jd4',
        img3: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs4jPIxkrRNAcs2CdqkL_ABgkI1zYLdiONog&s',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: `>Map plastik untuk menyimpan dokumen ukuran A4<br>
>Penjepit plastik yang kuat dan tahan lama.<br>
>Mudah dibawa dan disimpan karena ukurannya pas.<br>
>Tersedia dalam berbagai macam warna cerah.`
    },
    'papan-ujian': {
        title: 'Papan Ujian / Clipboard Kayu MDF',
        price: 'Rp 12.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://down-id.img.susercontent.com/file/id-11134207-7qukw-lf261km982t90d',
        img2: 'https://andalanatk.com/upload/produk/617180_produk.jpg',
        img3: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAvzBGkI-I1ue-CwY5HTRvPilDQ2DJI4H6Kw&s',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: `>Papan jalan berbahan kayu yang kuat dan tahan lama.<br>
>Mudah dibawa dan disimpan karena ukurannya pas.<br>
>Tersedia dalam berbagai macam warna cerah.`
    },
    'tipex': {
        title: 'Tipe-X Kertas Roll (Correction Tape)',
        price: 'Rp 10.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://www.joyko.co.id/image/cache/data/additional/B-650x650.jpg',
        img2: 'https://www.joyko.co.id/image/cache/data/A-650x650.jpg',
        img3: 'https://www.joyko.co.id/image/cache/data/additional/C-650x650.jpg',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: 'Penghapus pulpen praktis tanpa belepotan dan bisa langsung ditimpa.'
    },
    'kertas-origami': {
        title: 'Kertas Origami Warna Cerah 15x15cm',
        price: 'Rp 8.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSaJ8rvY8CeoX7tftrzsd_Phs2FoKAWPy7zQ&s',
        img2: 'https://id-test-11.slatic.net/p/ca74b1226a9e2b19ab0f4da86dbe0b56.jpg',
        img3: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/MTA-124700570/sidu_kertas_lipat_-_origami_sidu_12x12_isi_100_lembar_full01_bhlqbp2z.jpg',
        category: 'Buku & Kertas',
        location: 'Wangi-Wangi',
        desc: 'Kertas lipat origami untuk prakarya, warna cerah.'
    },
    'printer-epson': {
        title: 'Printer EPSON EcoTank L3210 All-in-One',
        price: 'Rp 2.150.000',
        strike: 'Rp 2.500.000',
        discount: '14%',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=d60560b00fe766443f873ee2fdc6da1b9be04f59&vid=d60560b00fe766443f873ee2fdc6da1b9be04f59&prid=1200Wx1200H&clid=SAPDAM&prclid=banner&assetDescr=L3210-%281%29',
        img2: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=9924598c45e305f67a81a456a259831a14062408&vid=9924598c45e305f67a81a456a259831a14062408&prid=1200Wx1200H&clid=SAPDAM&prclid=banner&assetDescr=L3210-%282%29',
        img3: 'https://mediaserver.goepson.com/adaptivemedia/rendition?id=6c2da331442440f05853f13fb1a2ddfa6bad8715&vid=6c2da331442440f05853f13fb1a2ddfa6bad8715&prid=1200Wx1200H&clid=SAPDAM&prclid=banner&assetDescr=L3210-%283%29',
        category: 'Percetakan',
        location: 'Wangi-Wangi',
        desc: `Menghemat lebih banyak dengan solusi pencetakan Epson yang ekonomis dan multifungsi untuk bisnis - EcoTank L3210 - yang dirancang untuk mengurangi biaya, dan meningkatkan produktivitas. Tangki tinta terintegrasi memungkinkan pengisian ulang yang bebas tumpahan, bebas kesalahan dengan botol terpisah yang memiliki nozzle khusus. Fitur lainnya mencakup pencetakan 4R tanpa garis tepi (borderless) dan hasil yang sangat tinggi sebanyak 7.500 halaman berwarna dan 4.500 halaman hitam-putih.<br>
Desain tangki terintegrasi yang ringkas
Botol tinta dengan hasil tinggi
Pengisian ulang bebas tumpahan, bebas kesalahan
Pencetakan tanpa garis tepi hingga 4R<br>
Print, scan, copy
Compact integrated tank design
High yield ink bottles
Spill-free, error-free refilling
Borderless printing up to 4R`
    },
    'printer-canon': {
        title: 'Printer Canon PIXMA G2020 All-in-One',
        price: 'Rp 1.950.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://api.mdp.co.id/upload/pictures/product/PR1453.jpg',
        img2: 'https://m.media-amazon.com/images/I/81WP7Y2CIQL.jpg',
        img3: 'https://id-test-11.slatic.net/p/bba94e18b3d98770aa5159e2510f6dc1.jpg',
        category: 'Percetakan',
        location: 'Wangi-Wangi',
        desc: `Print,Scan,Copy
Kecepatan Cetak 9.1 ipm
Resolusi Cetak 4800 x 1200
Kapasitas Cetak yang di sarankan 150 hingga 1.500 halaman
Maintenance Box  MC-G02
Tipe Cartridge BH-70, CH-70
Tinta GI-71 CMYBK
Scanner Flatbed (A4/LTR)
Konektivitas USB 2.0
Garansi Resmi
Pengiriman Aman`
    },
    'printer-brother': {
        title: 'Printer Brother DCP-T420W Wireless',
        price: 'Rp 2.250.000',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://www.brother.co.id/-/media/d053ab0be0b14e719a1b0e6a49df4a7c.jpg?as=0&h=454&w=454&rev=cd20e33669b743ee81bc95868c2eebe2&hash=E9E93136C449ABFD0DFAD312D64B9B49',
        img2: 'https://www.brother.co.id/-/media/22291b9afb9340e68dcd8cc91d63be7c.jpg?as=0&h=454&w=454&rev=b00e90217752404b94ef08e3799134f8&hash=70D9A8CF98E615E2A150C0DFE06C2655',
        img3: 'https://www.brother.co.id/-/media/62e91d02684a465ba7ebbd42066c5b30.jpg?as=0&h=454&w=454&rev=fb03d742741c423a81faea4261e9507e&hash=FC95E4FD085B29528E6E193252879F3C',
        category: 'Percetakan',
        location: 'Wangi-Wangi',
        desc: `Kecepatan Cetak A4 Hingga 16 ipm (Hitam)/ 9 ipm (Berwarna)
WiFi, Mopria, Wireless Direct, USB 2.0
Intuitive Buttons
Termasuk toner berkapasitas penuh. Hasil hingga 7500/5000 halaman (hitam/berwarna)*
Kompatibel dengan Aplikasi Seluler Mobile Connect
Termasuk garansi bawaan 3 tahun atau 30.000 halaman**`
    },
    'laptop-dell': {
        title: 'Dell XPS 13 9350 Intel® Core™ Ultra 7 processor 256V Series 2 (2025)',
        price: 'Rp 24.500.000',
        strike: 'Rp 28.000.000',
        discount: 'Diskon 12%',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9350/media-gallery/platinum/notebook-xps-13-9350-t-oled-sl-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&wid=3988&hei=2292&qlt=100,1&resMode=sharp2&size=3988,2292&chrss=full&imwidth=5000',
        img2: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9350/media-gallery/platinum/notebook-xps-13-9350-t-oled-sl-gallery-4.psd?fmt=png-alpha&pscan=auto&scl=1&wid=3509&hei=2077&qlt=100,1&resMode=sharp2&size=3509,2077&chrss=full&imwidth=5000',
        img3: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9350/media-gallery/platinum/notebook-xps-13-9350-t-oled-sl-gallery-7.psd?fmt=png-alpha&pscan=auto&scl=1&wid=3755&hei=2244&qlt=100,1&resMode=sharp2&size=3755,2244&chrss=full&imwidth=5000',
        category: 'Komputer',
        location: 'Wangi-Wangi',
        desc: `Processor
Intel® Core™ Ultra 7 processor 256V Series 2 (12MB Cache, 8 cores, up to 4.8 GHz)

Operating System
(Dell Technologies recommends Windows 11 Pro for business)
Windows 11 Home, Copilot+ PC

Graphics Card
Intel® Arc™ graphics

Display
13.4", Non-Touch, 2K, 30-120Hz, 500 nits, InfinityEdge

Memory 
16GB, LPDDR5X, 8533MT/s, integrated

Storage
1 TB, M.2, PCIe NVMe, SSD

Case
Platinum

Microsoft Office
Activate Your Microsoft 365 For A 30 Day Trial

Home and Small Business Security Solutions
McAfee+ Premium 1-year

Protect your purchase - View Support offers below 
1Y Premium Support with Hardware and Software1-2 Biz Day Onsite after remote diagnosis

Accidental Damage Service
None

Keyboard
Platinum English US backlit keyboard with fingerprint reader

Ports
2 x Thunderbolt™ 4 (USB Type-C™) with Power Delivery and DisplayPort

Slots
Not applicable

Dimensions & Weight
Height: 0.60 in. (15.30 mm) for laptops shipped with FHD+ or QHD+ display, 0.58 in. (14.80 mm) for laptops shipped with OLED display
Width: 11.62 in. (295.30 mm)
Depth: 7.84 in. (199.10 mm)
Starting weight: 2.60 lb (1.18 kg) for laptops shipped with OLED display, 2.70 lb (1.21 kg) for laptops shipped with QHD+ display, 2.70 lb (1.22 kg) for laptops shipped with FHD+ display

Touchpad
Multi-touch gesture-enabled precision touchpad with integrated scrolling

Camera
1080p at 30 fps FHD RGB camera, Dual-array microphones
360p at 15 fps IR camera, Dual-array microphones

Audio and Speakers
Quad-speaker design (tweeter + woofer), Realtek ALC1318, 2W x 4 = 8W total

Chassis
Exterior Chassis Materials
CNC-machined aluminum

Wireless 
Intel® Killer™ Wi-Fi 7 1750i (BE201) 2x2 + Bluetooth 5.4 Wireless Card

Primary Battery
3 Cell, 55 Wh, integrated

Power
60W AC adapter, USB Type-C`
    },
    'laptop-rog': {
        title: 'ASUS ROG Strix G16 G615 Intel® Core™ Ultra 9 Processor 275HX, NVIDIA® GeForce RTX™ 5060 Laptop (2025)',
        price: 'Rp 36.999.999',
        strike: '',
        discount: '',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://dlcdnwebimgs.asus.com/gain/68E55D05-BB23-4998-B3D4-7A389DFE58DA',
        img2: 'https://dlcdnwebimgs.asus.com/gain/733FEFA3-4FD8-40A0-AF54-E4DA20F8A0D5/w1000/h732',
        img3: 'https://webobjects2.cdw.com/is/image/CDW/8404439?$product-main$',
        category: 'Komputer',
        location: 'Wangi-Wangi',
        desc: `Sistem Operasi:
Windows 11 Home
*Windows 11 Home is available only as the Single Language edition in selected markets. Learn more about Windows 11 Home Single language: https://support.microsoft.com/article/eaf060a6-3642-4612-6b75-b34e57a08abf<br>
Prosesor:
Intel® Core™ Ultra 9 Processor 275HX 2.7 GHz (36MB Cache, up to 5.4 GHz, 24 cores, 24 Threads); Intel® AI Boost NPU up to 13TOPS<br>
Grafis:
NVIDIA® GeForce RTX™ 5060 Laptop GPU
ROG Boost: 1610MHz* at 115W  (1560MHz Boost Clock+50MHz OC, 100W+15W Dynamic Boost)
8GB GDDR7<br>
Neural Processor:
Intel® AI Boost NPU up to 13TOPS
Tampilan
ROG Nebula Display
16-inch
2.5K (2560 x 1600, WQXGA) 16:10 aspect ratio
IPS-level
Anti-glare display
DCI-P3:
100%
Refresh Rate:
240Hz
Response Time:
3ms
G-Sync
Pantone Validated
MUX Switch + NVIDIA® Advanced Optimus<br>
Memori:
16GB DDR5-5600 SO-DIMM x 2
The memory speed of the systems vary by CPU SPEC
Max Capacity:
64GB
Support dual channel memory technology<br>
Penyimpanan:
1TB PCIe® 4.0 NVMe™ M.2 SSD
Expansion Slots (includes used):
-2x DDR5 SO-DIMM slots
-2x M.2 PCIe<br>
Port I/O:
1x 3.5mm Combo Audio Jack
1x HDMI 2.1 FRL
3x USB 3.2 Gen 2 Type-A (data speed up to 10Gbps)
1x USB 3.2 Gen 2 Type-C with support for DisplayPort™ / power delivery / G-SYNC (data speed up to 10Gbps)
1x Thunderbolt™ 4 with support for DisplayPort™ / power delivery (data speed up to 40Gbps)
1x RJ45 LAN port<br>
Keyboard dan Touchpad:
Backlit Chiclet Keyboard 4-Zone RGB
Touchpad
With Copilot key
*Copilot in Windows (in preview) is rolling out gradually within the latest update to Windows 11 in select global markets. Timing of availability varies by device and market. Learn more: https://www.microsoft.com/en-us/windows/copilot-ai-features?r=1#faq<br>
Kamera:
1080P FHD IR Camera for Windows Hello<br>
Audio:
Smart Amp Technology
Hi-Res certification (for headphone)
Dolby Atmos
AI noise-canceling technology
Built-in array microphone
2-speaker system with Smart Amplifier Technology<br>
Jaringan dan Komunikasi:
Wi-Fi 7(802.11be) (Triple band) 2*2+Bluetooth® 5.4 Wireless Card (*Bluetooth® version may change with OS version different.)
Baterai
90WHrs, 4S1P, 4-cell Li-ion<br>
Suplai Daya:
Rectangle Conn, 280W AC Adapter, Output: 20V DC, 14A, 280W, Input: 100-240V AC, 50/60Hz universal<br>
AURA SYNC:
Yes<br>
Lampu Perangkat:
Aura Sync Light Bar<br>
Berat:
2.65 Kg (5.84 lbs)<br>
Dimensi (L x D x T):
35.4 x 26.8 x 2.28 ~ 3.08 cm (13.94" x 10.55" x 0.90" ~ 1.21")
Microsoft Office:
Microsoft Office Home 2024 + Microsoft 365 Basic (with 100GB of cloud storage)<br>
Xbox Game Pass:
Xbox Game Pass for PC_3 months (*Terms and exclusions apply. Offer only available in eligible markets for Xbox Game Pass for PC. Eligible markets are determined at activation. Game catalog varies by region, device, and time.)<br>
Security:
Trusted Platform Module (Firmware TPM)
BIOS Administrator Password and User Password Protection
McAfee® 30 days free trial
Disertakan dalam Kotaknya
ROG backpack
ROG Impact Gaming Mouse
*Included accessories vary according to country and territory. Please check with your local ASUS retailer for details`
    },
    'laptop-thinkpad': {
        title: 'ThinkPad X13 Gen 7 (13" Intel)',
        price: 'Rp 37.000.000',
        strike: 'Rp 45.000.000',
        discount: 'Diskon 17%',
        rating: '0',
        sold: 'Terjual 0',
        img: 'https://p4-ofp.static.pub/ShareResource/optimized/pdp/thinkpad/thinkpad-x-series/len101t0172/lenovo-thinkpad-x13-gen-7-13-intel-pdp-hero.png?width=584&height=584',
        img2: 'https://p1-ofp.static.pub/ShareResource/optimized/pdp/thinkpad/thinkpad-x-series/len101t0172/lenovo-thinkpad-x13-gen-7-13-intel-pdp-gallery-1.png?width=584&height=584',
        img3: 'https://p3-ofp.static.pub/ShareResource/optimized/pdp/thinkpad/thinkpad-x-series/len101t0172/lenovo-thinkpad-x13-gen-7-13-intel-pdp-gallery-5.png?width=584&height=584',
        category: 'Komputer',
        location: 'Wangi-Wangi',
        desc: `Processor
Up to Intel® Core™ Ultra 7 Series 3 with Intel vPro®

Up to 22W thermal design power (TDP)

Operating System
Windows 11 Pro — Lenovo recommends Windows 11 Pro for business

Windows 11 Home

Linux®

Neural Processing Unit (NPU)
Up to 50 trillion operations per second (TOPS) AI performance

Graphics
Intel® Integrated Graphics

Memory
Up to 64GB LPDDR5x (8533MHz) soldered

Storage
Up to 1TB PCIe Gen5 SSD (2280)

Battery
54.7Whr, customer replaceable unit (CRU) 

41Whr, CRU

Supports Rapid Charge (60 minutes = 80% capacity) with 65W or   
higher adapter

Audio
Dolby Atmos®

Lenovo Clear Voice

2 x speakers

2 x mics

Camera
5MP RGB with webcam privacy shutter

5MP & infrared (IR) with webcam privacy shutter

Power Supply Unit
65W USB-C® 110cc AC Adapter

65W GaN USB-C® 80cc AC Adapter

65W GaN USB-C® Wall Mount 49cc AC Adapter

Connectivity
Ports/Slots
Left side:

HDMI® 2.1 (supports resolution up to 4K@60Hz)

2 x USB-C® (Thunderbolt™ 4, USB 40Gbps) with power delivery 3.0 & DisplayPort™ 2.1

Headphone / mic combo

 

Right side:

USB-A (USB 5Gbps), always on

Optional: Nano SIM

Optional: Smart Card Reader

Kensington Nano Security Slot™

Wireless
Intel® WiFi 7* (Whale Peak 2) BE211 with Intel vPro®

Bluetooth® 5.4

WWAN**: 5G LTE CAT6 / sub6

Optional: Near-field communication (NFC)

 

* WiFi 7 requires Windows 11 OS, as well as a separate WiFi 7 router and / or other networking devices to meet full WiFi 7 requirements. It’s backwards compatible with prior WiFi standards & available only in countries where WiFi 7 is supported.

** Optional WWAN availability varies by region and must be configured at time of purchase; it requires a network service provider.

Supported Docking
Thunderbolt™ 4 Dock

USB-C® Dock

Design
Display
13.3” WUXGA (1920 x 1200) IPS, antiglare, 400 nits, 16:10 aspect ratio, 100% sRGB, 87.8% STBR, Eyesafe® 2.0 Certified Low Blue Light

13.3” WUXGA (1920 x 1200) IPS, antiglare, 400 nits, 16:10 aspect ratio, 100% sRGB, 87.8% STBR, Eyesafe® 2.0 Certified Low Blue Light, on cell touchscreen

Dimensions (H (front to back) x W x D)
9.85mm – 16mm x 299.3mm x 207mm / 0.38" –  0.62" x 11.78" x 8.15"

Weight
Starting at 930g / 2.05lbs

Keyboard
Backlit with white LED

Dual-function TrackPoint: navigate cursor or double-tap to open TrackPoint Quick Menu

Spill-resistant

Tactile markings for significant keys & slots (including power in, Enter, Fn, Insert, Volume)

ThinkPad TrackPoint Copilot Keyboard (1.5mm travel stroke)

TrackPad (115mm x 74.3mm / 4.53" x 2.93")

Color
Eclipse Black

Sustainability
Material
30% post-consumer content, carbon fiber-reinforced plastic (CFRP) used in top (A) cover

48% PCC recycled plastic used in bezel (B)

90% recycled magnesium used in keyboard frame (C)

55% recycled aluminum in bottom (D) cover

85% PCC recycled plastic used in keycaps

100% recycled cobalt used in battery

90% PCC recycled plastic in speaker enclosure

90% PCC recycled plastic in AC adapter (65W standard adapter & 65W slim GaN charger)

95% PCC used in cable holders

100% PCC used in speaker magnet / hall sensor

100% plastic-free primary packaging, recycled and/or sustainable & Forest Steward Council® (FSC)-certified*

 

*Packaging composed of recycled, and/or biobased, and/or sustainably forested content.

Certifications / Registries
9/10 iFixit Repairability Score

ENERGY STAR® 9.0

Eyesafe® 2.0

Forest Stewardship Council® (FSC) for packaging

MIL-SPEC-810H

TCO 10.0

Other information
ThinkShield Security
Discrete Trusted Platform Module (dTPM) 2.0

Facial recognition login (requires IR camera)

Kensington Nano Security Slot™

Microsoft Secured-core PCs

Optional: Intel vPro® security

Smart Power-on: Match-on-chip (MOC) Fingerprint Reader

Ultrasonic Human Presence Detection for lock on leave & wake on approach

Webcam privacy shutter

Customer Replaceable Units (CRUs)
Battery

Bottom (D) cover

SSD

Real-time clock (RTC) battery

WWAN

Preloaded Software
Intel® Connectivity Performance Suite

Lenovo Commercial Vantage

Lenovo View

Office 365 (trial)

Smart Connect

TrackPoint Quick Menu

What’s in the Box
Lenovo ThinkPad X13 Gen 7 (13" Intel) laptop

65W AC adapter (USB-C® or GaN)

Quick Start Guide`
    }
};

// ==========================================
// Dynamic Rating & Sold Merge Logic
// ==========================================
const storedStats = localStorage.getItem('yuka_product_stats');
if (storedStats) {
    try {
        const stats = JSON.parse(storedStats);
        for (const [id, data] of Object.entries(stats)) {
            if (productsDatabase[id]) {
                productsDatabase[id].sold = `Terjual ${data.soldCount}`;
                if (data.ratingCount > 0) {
                    const avg = (data.totalRating / data.ratingCount).toFixed(1);
                    productsDatabase[id].rating = avg.toString();
                }
            }
        }
    } catch (e) {
        console.error("Error parsing yuka_product_stats", e);
    }
}

// ==========================================
// Tracking & Recommendation Logic
// ==========================================
const trackProductView = (productId) => {
    if (!productId || !productsDatabase[productId]) return;
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('yuka_view_history')) || [];
    } catch (e) {
        history = [];
    }

    const existingIndex = history.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        history[existingIndex].count += 1;
        history[existingIndex].lastViewed = Date.now();
    } else {
        history.push({ id: productId, count: 1, lastViewed: Date.now() });
    }

    if (history.length > 50) {
        history.sort((a, b) => b.lastViewed - a.lastViewed);
        history = history.slice(0, 50);
    }
    localStorage.setItem('yuka_view_history', JSON.stringify(history));
};

const renderRecommendations = () => {
    const recommendationGrid = document.getElementById('recommendation-grid');
    const lastViewedGrid = document.getElementById('last-viewed-grid');
    const lastViewedSection = document.getElementById('last-viewed-section');

    if (!recommendationGrid) return;

    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('yuka_view_history')) || [];
    } catch (e) {
        history = [];
    }

    // Sort history by lastViewed descending for "Terakhir Dilihat"
    history.sort((a, b) => b.lastViewed - a.lastViewed);

    const lastViewedProducts = [];
    const viewedCategories = new Set();
    const recommendedIds = new Set();

    // Process history
    for (const item of history) {
        if (productsDatabase[item.id]) {
            const prod = productsDatabase[item.id];
            if (lastViewedProducts.length < 5) {
                lastViewedProducts.push({ id: item.id, ...prod });
                recommendedIds.add(item.id);
            }
            if (prod.category) {
                viewedCategories.add(prod.category);
            }
        }
    }

    // Render "Terakhir Dilihat"
    if (lastViewedGrid && lastViewedSection) {
        if (lastViewedProducts.length > 0) {
            lastViewedSection.style.display = 'block';
            lastViewedGrid.innerHTML = '';

            lastViewedProducts.forEach(prod => {
                const badgeHtml = prod.discount ? `<span class="discount-badge">${prod.discount}</span>` :
                    (prod.strike ? `<span class="discount-badge">Promo</span>` : '');

                const card = document.createElement('a');
                card.className = 'etalase-card';
                card.style.textDecoration = 'none';
                card.style.color = 'inherit';
                card.title = 'Lihat Produk';
                card.href = `product.html?id=${prod.id}`;

                card.innerHTML = `
                    <div class="product-image">
                        <img src="${prod.img}" alt="${prod.title}">
                        ${badgeHtml}
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${prod.title}</h3>
                        <div class="product-price">${prod.price}</div>
                        <div class="product-meta">
                            <span class="rating"><i class="ph-fill ph-star"></i> ${prod.rating} | ${prod.sold}</span>
                            <span class="location"><i class="ph ph-map-pin"></i> ${prod.location || 'Wangi-Wangi'}</span>
                        </div>
                    </div>
                `;
                lastViewedGrid.appendChild(card);
            });
        } else {
            lastViewedSection.style.display = 'none';
        }
    }

    // Process Recommendations (based on categories, then random)
    const maxItems = 20;
    const finalProductsToRender = [];
    const allIds = Object.keys(productsDatabase);

    // Shuffle allIds
    for (let i = allIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
    }

    // First, fill with items matching the viewed categories
    if (viewedCategories.size > 0) {
        for (const id of allIds) {
            if (finalProductsToRender.length >= maxItems) break;
            const prod = productsDatabase[id];
            if (!recommendedIds.has(id) && viewedCategories.has(prod.category)) {
                finalProductsToRender.push({ id, ...prod });
                recommendedIds.add(id); // Mark as used so it doesn't duplicate
            }
        }
    }

    // Next, fill the rest with random items
    for (const id of allIds) {
        if (finalProductsToRender.length >= maxItems) break;
        if (!recommendedIds.has(id)) {
            finalProductsToRender.push({ id, ...productsDatabase[id] });
            recommendedIds.add(id);
        }
    }

    // Render "Rekomendasi Untukmu"
    recommendationGrid.innerHTML = '';
    finalProductsToRender.forEach(prod => {
        const badgeHtml = prod.discount ? `<span class="discount-badge">${prod.discount}</span>` :
            (prod.strike ? `<span class="discount-badge">Promo</span>` : '');

        const card = document.createElement('a');
        card.className = 'etalase-card';
        card.style.textDecoration = 'none';
        card.style.color = 'inherit';
        card.title = 'Lihat Produk';
        card.href = `product.html?id=${prod.id || 'pensil-warna'}`;

        card.innerHTML = `
            <div class="product-image">
                <img src="${prod.img}" alt="${prod.title}">
                ${badgeHtml}
            </div>
            <div class="product-info">
                <h3 class="product-title">${prod.title}</h3>
                <div class="product-price">${prod.price}</div>
                <div class="product-meta">
                    <span class="rating"><i class="ph-fill ph-star"></i> ${prod.rating} | ${prod.sold}</span>
                    <span class="location"><i class="ph ph-map-pin"></i> ${prod.location || 'Wangi-Wangi'}</span>
                </div>
            </div>
        `;
        recommendationGrid.appendChild(card);
    });
};

// Render Product Page based on URL parameter ?id=...
if (window.location.pathname.includes('product.html') || window.location.href.includes('product.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');

    // Fallback if no ID is provided
    if (!productId || !productsDatabase[productId]) {
        productId = 'pensil-warna';
    }

    if (typeof trackProductView === 'function') {
        trackProductView(productId);
    }

    const product = productsDatabase[productId];

    // Update DOM elements
    const titleEl = document.querySelector('.pd-title');
    const priceEl = document.querySelector('.pd-price');
    const strikeEl = document.querySelector('.pd-strike');
    const badgeEl = document.querySelector('.pd-badge');
    const ratingEl = document.querySelector('.pd-rating');
    const soldEl = document.querySelector('.pd-sold');
    const mainImgEl = document.getElementById('main-product-img');
    const breadcrumbCat = document.querySelector('.breadcrumb a:nth-child(2)');
    const breadcrumbTitle = document.querySelector('.breadcrumb span');
    const descEl = document.querySelector('.pd-description');

    // Need to safely find the store location text node
    const storeProfile = document.querySelector('.store-profile');
    let storeLoc = null;
    if (storeProfile) {
        const pTags = storeProfile.querySelectorAll('p');
        pTags.forEach(p => {
            if (p.innerHTML.includes('Online')) {
                storeLoc = p;
            }
        });
    }

    if (titleEl) titleEl.innerText = product.title;
    if (priceEl) priceEl.innerText = product.price;
    if (mainImgEl) mainImgEl.src = product.img;
    if (soldEl) soldEl.innerText = product.sold;
    if (ratingEl) ratingEl.innerHTML = `<i class="ph-fill ph-star"></i> ${product.rating} (Banyak ulasan)`;

    if (strikeEl) {
        if (product.strike) {
            strikeEl.innerText = product.strike;
            strikeEl.style.display = 'inline';
        } else {
            strikeEl.style.display = 'none';
        }
    }

    if (badgeEl) {
        if (product.discount) {
            badgeEl.innerText = product.discount;
            badgeEl.style.display = 'inline';
        } else {
            badgeEl.style.display = 'none';
        }
    }

    if (breadcrumbCat && product.category) breadcrumbCat.innerText = product.category;
    if (breadcrumbTitle) breadcrumbTitle.innerText = product.title;

    if (descEl) {
        descEl.innerHTML = `
            <p><strong>Kondisi:</strong> Baru</p>
            <p><strong>Min. Pemesanan:</strong> 1 Buah</p>
            <p><strong>Etalase:</strong> ${product.category}</p>
            <br>
            <p style="white-space: pre-line; line-height: 1.6; margin-bottom: 1rem;">${product.desc}</p>
            <p>Garansi resmi TokoYuka 100% Original. Silakan langsung dipesan, barang selalu ready stock!</p>
        `;
    }

    if (storeLoc) {
        storeLoc.innerHTML = `<span class="online-dot"></span> Online 5 menit lalu &bull; ${product.location}`;
    }

    // Setup the price for the subtotal calculator
    window.currentProductPrice = parseInt(product.price.replace(/[^\d]/g, '')) || 0;

    // Update Subtotal on side panel
    const subtotalEl = document.querySelector('.pd-subtotal strong');
    if (subtotalEl) {
        let qty = document.querySelector('.qty-input') ? parseInt(document.querySelector('.qty-input').value) : 1;
        subtotalEl.innerText = formatRupiah(window.currentProductPrice * qty);
    }

    // Update thumbnail just for visual consistency in demo
    const thumbnails = document.querySelectorAll('.thumbnail img');
    if (thumbnails.length > 0) {
        thumbnails[0].src = product.img;
        let shortTitle = product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title;
        if (thumbnails.length > 1) {
            thumbnails[1].src = product.img2 || `https://placehold.co/400x400/f8fafc/334155?text=${encodeURIComponent(shortTitle)}%0A(Tampak+Samping)`;
        }
        if (thumbnails.length > 2) {
            thumbnails[2].src = product.img3 || `https://placehold.co/400x400/f8fafc/334155?text=${encodeURIComponent(shortTitle)}%0A(Tampak+Belakang)`;
        }
    }

    // Update "Spesifikasi" Tab
    const specEl = document.getElementById('tab-spec');
    if (specEl) {
        specEl.innerHTML = `
            <ul style="list-style-type: none; padding: 0; color: var(--text-secondary);">
                <li style="padding: 0.8rem 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;"><span>Kategori</span> <strong style="color: var(--text-primary);">${product.category}</strong></li>
                <li style="padding: 0.8rem 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;"><span>Lokasi Pengiriman</span> <strong style="color: var(--text-primary);">${product.location}</strong></li>
                <li style="padding: 0.8rem 0; display: flex; justify-content: space-between;"><span>Rating</span> <strong style="color: var(--text-primary);">${product.rating} / 5.0</strong></li>
            </ul>
        `;
    }

    // Update "Info Penting" Tab
    const infoEl = document.getElementById('tab-info');
    if (infoEl) {
        infoEl.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);"><i class="ph ph-shield-check" style="color: var(--accent-color); margin-right: 5px;"></i> Kebijakan Pengembalian</h4>
                <p style="color: var(--text-secondary); line-height: 1.5;">Barang yang sudah dibeli dapat ditukar jika terdapat cacat pabrik dalam waktu 7 hari setelah barang diterima. Wajib menyertakan video unboxing penuh tanpa jeda.</p>
            </div>
            <div>
                <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);"><i class="ph ph-truck" style="color: var(--accent-color); margin-right: 5px;"></i> Jadwal Pengiriman</h4>
                <p style="color: var(--text-secondary); line-height: 1.5;">Pesanan terkonfirmasi sebelum jam 15:00 dari <strong>${product.location}</strong> akan dikirim pada hari yang sama. Pengiriman tidak beroperasi pada Hari Minggu dan Tanggal Merah.</p>
            </div>
        `;
    }

    // Update "Add to Cart" button in product page
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.onclick = function () {
            let qty = document.querySelector('.qty-input') ? parseInt(document.querySelector('.qty-input').value) : 1;
            addCustomToCart(
                productId,
                product.title,
                product.category,
                window.currentProductPrice,
                'pcs',
                'ph-package',
                product.img,
                qty
            );
        };
    }

    // Lightbox Logic
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img-content');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    if (lightbox && lightboxImg && mainImgEl) {
        let currentLightboxIndex = 0;
        const allThumbs = document.querySelectorAll('.thumbnail img');

        const updateLightboxImage = (index) => {
            if (allThumbs.length > 0) {
                lightboxImg.src = allThumbs[index].src;
            } else {
                lightboxImg.src = mainImgEl.src;
            }
        };

        mainImgEl.addEventListener('click', () => {
            currentLightboxIndex = 0;
            allThumbs.forEach((thumb, idx) => {
                if (thumb.src === mainImgEl.src) {
                    currentLightboxIndex = idx;
                }
            });
            updateLightboxImage(currentLightboxIndex);
            lightbox.classList.add('active');
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });

        if (lightboxPrev && lightboxNext) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                if (allThumbs.length > 0) {
                    currentLightboxIndex = (currentLightboxIndex - 1 + allThumbs.length) % allThumbs.length;
                    updateLightboxImage(currentLightboxIndex);
                }
            });

            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                if (allThumbs.length > 0) {
                    currentLightboxIndex = (currentLightboxIndex + 1) % allThumbs.length;
                    updateLightboxImage(currentLightboxIndex);
                }
            });
        }

        // Swipe Support for mobile
        let touchstartX = 0;
        let touchendX = 0;

        lightbox.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        });

        lightbox.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX - 50) {
                if (lightboxNext) lightboxNext.click(); // Swipe left -> Next
            }
            if (touchendX > touchstartX + 50) {
                if (lightboxPrev) lightboxPrev.click(); // Swipe right -> Prev
            }
        });
    }
}

// ==========================================
// Flash Sale Countdown Logic
// ==========================================
const initFlashSaleCountdown = () => {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!hoursEl || !minutesEl || !secondsEl) return;

    // Check for target date
    // UNTUK MEMULAI FLASH SALE BARU: Ganti tanggal di bawah ini dengan format 'YYYY-MM-DDTHH:mm:ss'
    // Contoh: '2026-06-15T23:59:59'
    // Jika dikosongkan (''), fitur Flash Sale akan disembunyikan.
    const FLASH_SALE_END_DATE = '2026-06-15T23:59:59';

    let targetDate;

    if (FLASH_SALE_END_DATE) {
        targetDate = new Date(FLASH_SALE_END_DATE).getTime();

        // If the date has passed, hide the flash sale section
        if (targetDate < new Date().getTime()) {
            const flashSaleSection = document.querySelector('.flash-sale');
            if (flashSaleSection) flashSaleSection.style.display = 'none';
            return;
        }
    } else {
        // If no date is set, hide the flash sale section
        const flashSaleSection = document.querySelector('.flash-sale');
        if (flashSaleSection) flashSaleSection.style.display = 'none';
        return;
    }

    let countdownInterval;

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            const flashSaleSection = document.querySelector('.flash-sale');
            if (flashSaleSection) flashSaleSection.style.display = 'none';
            if (countdownInterval) clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const updateBox = (el, value) => {
            const strVal = value.toString().padStart(2, '0');
            if (el && el.innerText !== strVal) {
                el.innerText = strVal;
                // Trigger CSS pop animation
                el.classList.remove('pop');
                void el.offsetWidth; // trigger reflow to restart animation
                el.classList.add('pop');
            }
        };

        if (daysEl) updateBox(daysEl, days);
        updateBox(hoursEl, hours);
        updateBox(minutesEl, minutes);
        updateBox(secondsEl, seconds);
    };

    updateCountdown(); // Initial call to avoid 1-sec delay
    countdownInterval = setInterval(updateCountdown, 1000);
};

// Run the countdown initialization
initFlashSaleCountdown();
// ==========================================
// Orders & Tracking Page Logic
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Orders Tabs
    const orderTabs = document.querySelectorAll('.order-tab');
    if (orderTabs.length > 0) {
        orderTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                orderTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const target = tab.getAttribute('data-target');
                document.querySelectorAll('.order-list').forEach(list => {
                    if (list.id === target) {
                        list.style.display = 'flex';
                    } else {
                        list.style.display = 'none';
                    }
                });
            });
        });
    }

    // Tracking Modal
    const trackBtns = document.querySelectorAll('.track-btn');
    const trackingOverlay = document.getElementById('tracking-overlay');
    const closeTrackingBtn = document.querySelector('.close-tracking-btn');

    if (trackBtns.length > 0 && trackingOverlay) {
        trackBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                trackingOverlay.style.display = 'flex';
            });
        });

        if (closeTrackingBtn) {
            closeTrackingBtn.addEventListener('click', () => {
                trackingOverlay.style.display = 'none';
            });
        }

        trackingOverlay.addEventListener('click', (e) => {
            if (e.target === trackingOverlay) {
                trackingOverlay.style.display = 'none';
            }
        });
    }
});
// ==========================================
// Dynamic Orders Rendering
// ==========================================
const renderOrders = () => {
    const ordersContainerSemua = document.getElementById('tab-semua');
    const ordersContainerDikemas = document.getElementById('tab-dikemas');

    if (!ordersContainerSemua || !ordersContainerDikemas) return; // Only run on orders.html

    const ordersData = localStorage.getItem('yuka_orders');
    if (!ordersData) return; // Keep empty states

    const orders = JSON.parse(ordersData);
    if (orders.length === 0) return; // Keep empty states

    // Remove empty state from Semua and Dikemas
    const emptySemua = document.getElementById('empty-state-semua');
    if (emptySemua) emptySemua.style.display = 'none';
    const emptyDikemas = document.getElementById('empty-state-dikemas');
    if (emptyDikemas) emptyDikemas.style.display = 'none';

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    let htmlContent = '';
    orders.forEach(order => {
        // Use the first item's image and name for the preview
        const firstItem = order.items[0];
        const additionalItems = order.items.length > 1 ? '<p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 5px;">+ ' + (order.items.length - 1) + ' produk lainnya</p>' : '';
        const img = firstItem.image || 'https://via.placeholder.com/60';

        htmlContent += '<div class="order-card" style="margin-bottom: 1.5rem;">' +
            '<div class="order-card-header">' +
            '<span class="order-id"><i class="ph ph-bag"></i> Belanja • ' + order.date + '</span>' +
            '<span class="order-status status-dikirim" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">' + (order.status.charAt(0).toUpperCase() + order.status.slice(1)) + '</span>' +
            '</div>' +
            '<div class="order-card-body">' +
            '<div class="order-item-detail">' +
            '<img src="' + img + '" alt="Product Image">' +
            '<div>' +
            '<h4>' + firstItem.name + '</h4>' +
            '<p class="order-qty">' + firstItem.quantity + ' x ' + formatRupiah(firstItem.price) + '</p>' +
            additionalItems +
            '</div>' +
            '</div>' +
            '<div class="order-total">' +
            '<p>Total Belanja</p>' +
            '<h4>' + formatRupiah(order.total) + '</h4>' +
            '</div>' +
            '</div>' +
            '<div class="order-card-footer">' +
            '<span class="order-courier">Otomatis • ' + order.id + '</span>' +
            '<div class="order-actions">' +
            '<button class="outline-btn" onclick="window.location.href=\'index.html\'">Beli Lagi</button>' +
            '<button class="primary-btn track-btn" data-order="' + order.id + '">Lacak Pesanan</button>' +
            '</div>' +
            '</div>' +
            '</div>';
    });

    // Append to container
    ordersContainerSemua.innerHTML += htmlContent;
    ordersContainerDikemas.innerHTML += htmlContent;

    // Rebind tracking modal events for dynamically added buttons
    const trackBtns = document.querySelectorAll('.track-btn');
    const trackingOverlay = document.getElementById('tracking-overlay');
    if (trackBtns.length > 0 && trackingOverlay) {
        trackBtns.forEach(btn => {
            btn.onclick = () => {
                trackingOverlay.style.display = 'flex';
                const resiText = trackingOverlay.querySelector('.tracking-info strong');
                if (resiText) resiText.innerText = btn.getAttribute('data-order');
            };
        });
    }
};

document.addEventListener('DOMContentLoaded', renderOrders);
// Handle Beli Langsung
document.addEventListener('DOMContentLoaded', () => {
    const buyNowBtn = document.getElementById('buy-now-trigger');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (localStorage.getItem('yuka_logged_in') === 'true') {
                const overlay = document.querySelector('.page-transition-overlay');
                if (overlay) overlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = 'checkout.html';
                }, 400);
            } else {
                if (typeof showAuthPopup === 'function') {
                    showAuthPopup();
                } else {
                    window.location.href = 'login.html';
                }
            }
        });
    }
});
