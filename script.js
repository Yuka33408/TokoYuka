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
    if(e.key === 'yuka_cart') {
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

    // Inisialisasi Fitur Pencarian
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    if (searchInput && searchBtn) {
        const handleSearch = () => {
            searchQuery = searchInput.value;
            renderProducts();
            // Scroll ke bagian produk
            const koleksiSection = document.getElementById('koleksi');
            if (koleksiSection) {
                koleksiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keyup', (e) => {
            searchQuery = searchInput.value;
            renderProducts(); // Real-time search
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
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
                    <button class="popup-btn-primary" onclick="window.location.href='login.html'">Masuk / Daftar</button>
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
    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    
    if (track && slides.length > 0) {
        let currentIndex = 0;
        
        // Create indicators
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('indicator');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            if (indicatorsContainer) indicatorsContainer.appendChild(dot);
        });
        const indicators = document.querySelectorAll('.indicator');

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            indicators.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        if(nextBtn) nextBtn.addEventListener('click', nextSlide);
        if(prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto slide
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        const carouselContainer = document.querySelector('.main-carousel');
        if(carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
            carouselContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
    }

    // 3. Flash Sale Countdown Timer
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (hoursEl && minutesEl && secondsEl) {
        // Set target time: 2 hours from now for demo
        let targetTime = new Date().getTime() + (2 * 60 * 60 * 1000);

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetTime - now;

            if (distance < 0) {
                targetTime = new Date().getTime() + (24 * 60 * 60 * 1000); // reset to 24h
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
        };

        setInterval(updateTimer, 1000);
        updateTimer();
    }
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

window.modalAddToCart = function() {
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

window.openProductModal = function(cardElement) {
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

    if(modalTitle) modalTitle.innerText = title;
    if(modalPrice) modalPrice.innerText = priceText;
    if(modalImg) modalImg.src = imgSrc;

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

    if(productModalOverlay) {
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
        if(subtotalEl) {
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
            if(target) {
                document.querySelectorAll('.pd-tab-contents .pd-description').forEach(content => {
                    if(content.id === target) {
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
        rating: '5.0',
        sold: 'Terjual 80+',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEJs5tSZ5YLwH0Vt5OaO0oeeqAZ87ddgNxdg&s',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: 'Pensil Warna Set 48 Warna dengan kualitas premium. Cocok untuk seniman profesional maupun pemula. Warna cerah, mudah di-blend, dan tidak mudah patah.'
    },
    'tas-laptop': {
        title: 'Tas Laptop Ransel Waterproof',
        price: 'Rp 120.000',
        strike: 'Rp 185.000',
        discount: 'Diskon 35%',
        rating: '4.8',
        sold: 'Terjual 300+',
        img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&h=300&fit=crop',
        category: 'Elektronik',
        location: 'Wangi-Wangi',
        desc: 'Tas laptop anti air dengan banyak kompartemen. Cocok untuk pekerja kantoran maupun mahasiswa.'
    },
    'buku-agenda': {
        title: 'Buku Agenda Kulit Eksklusif 2026',
        price: 'Rp 65.000',
        strike: 'Rp 81.500',
        discount: 'Diskon 20%',
        rating: '4.9',
        sold: 'Terjual 250+',
        img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=300&h=300&fit=crop',
        category: 'Buku & Kertas',
        location: 'Wangi-Wangi',
        desc: 'Buku agenda dengan sampul kulit sintetis. Dilengkapi kalender, pembatas pita, dan kertas berkualitas tinggi (100gsm).'
    },
    'tinta-printer': {
        title: 'Tinta Printer EPSON 664 Hitam',
        price: 'Rp 100.000',
        strike: 'Rp 125.000',
        discount: 'Diskon 15%',
        rating: '4.7',
        sold: 'Terjual 150+',
        img: 'https://pegastore.id/media/product_image/1747906214-foto-produk-(30).jpg',
        category: 'Elektronik',
        location: 'Wangi-Wangi',
        desc: 'Tinta botol berkualitas tinggi, hasil cetak tajam, anti luntur. Kompatibel dengan mayoritas printer inkjet.'
    },
    'pulpen-gel': {
        title: 'Pulpen Gel Joyko GP-265 0.5mm Hitam (Lusin)',
        price: 'Rp 15.000',
        strike: '',
        discount: '',
        rating: '4.9',
        sold: 'Terjual 2rb+',
        img: 'https://andalanatk.com/upload/produk/6901b814eefa81.87516637_986852_produk.webp',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: 'Tinta lebih lancar, cepat kering, dan sangat nyaman digunakan untuk menulis dokumen penting atau catatan harian.'
    },
    'buku-tulis': {
        title: 'Buku Tulis HVS SiDu 58 Lembar (Pack)',
        price: 'Rp 35.000',
        strike: '',
        discount: '',
        rating: '4.8',
        sold: 'Terjual 500+',
        img: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//89/MTA-55436011/br-m036969-07062_-pack-buku-tulis-sidu-sinar-dunia-58-lembar-murah_full01.jpg',
        category: 'Buku & Kertas',
        location: 'Wangi-Wangi',
        desc: 'Buku catatan bersampul kraft elegan. Berisi 100 lembar kertas HVS polos yang tidak tembus tinta.'
    },
    'laptop-i5': {
        title: 'MacBook Air M4',
        price: 'Rp 16.999.999',
        strike: '',
        discount: '',
        rating: '5.0',
        sold: 'Terjual 50+',
        img: 'https://pegastore.id/media/product_image/1751533288-macbook-air-mw0w3id-(2).jpg',
        category: 'Elektronik',
        location: 'Wangi-Wangi',
        desc: 'Laptop tangguh dengan prosesor terbaru, ideal untuk kebutuhan sekolah, kuliah, desain grafis ringan, hingga kantoran.'
    },
    'kuas-lukis': {
        title: 'Kuas Lukis Cat Air Watercolor Set 6 Pcs',
        price: 'Rp 25.000',
        strike: '',
        discount: '',
        rating: '4.8',
        sold: 'Terjual 120+',
        img: 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/b967c0e56d2247fbad1fc041522694f9~.jpeg.webp',
        category: 'Seni & Lukis',
        location: 'Wangi-Wangi',
        desc: 'Set 6 kuas berbagai ukuran berbahan nilon sintetik halus. Mudah dibersihkan dan tidak rontok.'
    },
    'stapler': {
        title: 'Stapler Heavy Duty HD-12L/24',
        price: 'Rp 471.000',
        strike: '',
        discount: '',
        rating: '4.9',
        sold: 'Terjual 1rb+',
        img: 'https://shop.kenko.co.id/image/cache/catalog/product/Stapler/Heavy-Duty-Stapler-HD-12L24-700x700.jpg',
        category: 'Alat Kantor',
        location: 'Wangi-Wangi',
        desc: 'Stapler awet bahan besi kokoh anti macet. Sangat pas untuk penggunaan kantor dan sekolah sehari-hari.'
    },
    'keyboard-rgb': {
        title: 'Keyboard Mechanical Switch Blue RGB',
        price: 'Rp 350.000',
        strike: '',
        discount: '',
        rating: '4.7',
        sold: 'Terjual 800+',
        img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&h=300&fit=crop',
        category: 'Elektronik',
        location: 'Wangi-Wangi',
        desc: 'Keyboard gaming mechanical yang *clicky*, responsif, dengan lampu latar RGB 16 juta warna.'
    },
    'gunting': {
        title: 'Gunting Kertas Serbaguna Tajam Stainless',
        price: 'Rp 12.000',
        strike: '',
        discount: '',
        rating: '4.8',
        sold: 'Terjual 450+',
        img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop',
        category: 'Alat Kantor',
        location: 'Wangi-Wangi',
        desc: 'Gunting dengan pegangan ergonomis berlapis karet. Bilah stainless steel anti karat.'
    },
    'earphone': {
        title: 'True Wireless Earbuds Bluetooth 5.3',
        price: 'Rp 185.000',
        strike: '',
        discount: '',
        rating: '4.9',
        sold: 'Terjual 3rb+',
        img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop',
        category: 'Elektronik',
        location: 'Wangi-Wangi',
        desc: 'Earbud nirkabel suara nge-bass. Baterai tahan hingga 20 jam pemutaran.'
    },
    'buku-novel': {
        title: 'Buku Novel Fiksi Terlaris Edisi Spesial',
        price: 'Rp 95.000',
        strike: '',
        discount: '',
        rating: '5.0',
        sold: 'Terjual 5rb+',
        img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&h=300&fit=crop',
        category: 'Buku & Kertas',
        location: 'Wangi-Wangi',
        desc: 'Buku bacaan fiksi dengan jalan cerita menarik yang wajib dibaca tahun ini.'
    },
    'spidol-warna': {
        title: 'Spidol Warna Set 12',
        price: 'Rp 25.000',
        strike: '',
        discount: '',
        rating: '4.7',
        sold: 'Terjual 150+',
        img: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=300&h=300&fit=crop',
        category: 'Alat Tulis',
        location: 'Wangi-Wangi',
        desc: 'Set 12 spidol warna berkualitas dengan warna yang cerah. Tinta cepat kering dan tidak mudah luntur.'
    }
};

// Render Product Page based on URL parameter ?id=...
if (window.location.pathname.includes('product.html') || window.location.href.includes('product.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    
    // Fallback if no ID is provided
    if (!productId || !productsDatabase[productId]) {
        productId = 'pensil-warna'; 
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
    if(storeProfile) {
        const pTags = storeProfile.querySelectorAll('p');
        pTags.forEach(p => {
            if(p.innerHTML.includes('Online')) {
                storeLoc = p;
            }
        });
    }

    if(titleEl) titleEl.innerText = product.title;
    if(priceEl) priceEl.innerText = product.price;
    if(mainImgEl) mainImgEl.src = product.img;
    if(soldEl) soldEl.innerText = product.sold;
    if(ratingEl) ratingEl.innerHTML = `<i class="ph-fill ph-star"></i> ${product.rating} (Banyak ulasan)`;
    
    if(strikeEl) {
        if(product.strike) {
            strikeEl.innerText = product.strike;
            strikeEl.style.display = 'inline';
        } else {
            strikeEl.style.display = 'none';
        }
    }
    
    if(badgeEl) {
        if(product.discount) {
            badgeEl.innerText = product.discount;
            badgeEl.style.display = 'inline';
        } else {
            badgeEl.style.display = 'none';
        }
    }

    if(breadcrumbCat && product.category) breadcrumbCat.innerText = product.category;
    if(breadcrumbTitle) breadcrumbTitle.innerText = product.title;
    
    if(descEl) {
        descEl.innerHTML = `
            <p><strong>Kondisi:</strong> Baru</p>
            <p><strong>Min. Pemesanan:</strong> 1 Buah</p>
            <p><strong>Etalase:</strong> ${product.category}</p>
            <br>
            <p>${product.desc}</p>
            <p>Garansi resmi TokoYuka 100% Original. Silakan langsung dipesan, barang selalu ready stock!</p>
        `;
    }

    if(storeLoc) {
        storeLoc.innerHTML = `<span class="online-dot"></span> Online 5 menit lalu â€¢ ${product.location}`;
    }
    
    // Setup the price for the subtotal calculator
    window.currentProductPrice = parseInt(product.price.replace(/[^\d]/g, '')) || 0;

    // Update Subtotal on side panel
    const subtotalEl = document.querySelector('.pd-subtotal strong');
    if(subtotalEl) {
        let qty = document.querySelector('.qty-input') ? parseInt(document.querySelector('.qty-input').value) : 1;
        subtotalEl.innerText = formatRupiah(window.currentProductPrice * qty);
    }
    
    // Update thumbnail just for visual consistency in demo
    const thumbnails = document.querySelectorAll('.thumbnail img');
    if(thumbnails.length > 0) thumbnails[0].src = product.img;

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
        addToCartBtn.onclick = function() {
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
}
