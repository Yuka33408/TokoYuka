// Data Produk (Mock Data)
const products = [
    {
        id: 1,
        name: "Fotocopy",
        category: "Percetakan",
        price: 500,
        unit: "lembar",
        icon: "ph-copy",
        description: "Harga terjangkau dan kualitas terbaik."
    },
    {
        id: 2,
        name: "Kertas F4",
        category: "Kertas",
        price: 1000,
        unit: "2 lembar",
        icon: "ph-paperclip",
        image: "assets/images/paper_hvs_1779911504601.png",
        description: "Harga terjangkau dan kualitas terbaik."
    },
    {
        id: 3,
        name: "Print",
        category: "Percetakan",
        price: 2000,
        unit: "lembar",
        icon: "ph-printer",
        description: "Harga terjangkau dan kualitas terbaik."
    },
    {
        id: 4,
        name: "Scan",
        category: "Percetakan",
        price: 2000,
        unit: "lembar",
        icon: "ph-scan",
        description: "Harga terjangkau dan kualitas terbaik."
    },
    {
        id: 5,
        name: "Laminating",
        category: "Laminating",
        price: 5000,
        unit: "lbr",
        icon: "ph-hand",
        description: "Harga terjangkau dan kualitas terbaik."
    },
    {
        id: 6,
        name: "Spidol Snowman",
        category: "Alat Tulis",
        price: 2000,
        unit: "biji",
        icon: "ph-pen",
        image: "assets/images/pen_premium_1779911487772.png",
        description: "Harga terjangkau dan kualitas terbaik."
    }
];

// State Keranjang (Load dari LocalStorage jika ada)
const savedCart = localStorage.getItem('yuka_cart');
let cart = savedCart ? JSON.parse(savedCart) : [];

// Elemen DOM
const productsContainer = document.getElementById('products-container');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartBadge = document.getElementById('cart-badge');
const cartTotalPrice = document.getElementById('cart-total-price');

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
            ? `<img src="${product.image}" alt="${product.name}">` 
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
    cartBadge.classList.add('pop');
    setTimeout(() => cartBadge.classList.remove('pop'), 300);

    updateCart();

    // Buka sidebar saat menambah (opsional, memberikan feedback instan)
    if (!cartSidebar.classList.contains('active')) {
        toggleCart();
    }
};

// Update Keranjang (UI & Data)
const updateCart = () => {
    // Simpan ke localStorage setiap ada perubahan
    localStorage.setItem('yuka_cart', JSON.stringify(cart));

    // Update Badge
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalItems;

    // Update Total Harga
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = formatRupiah(totalPrice);

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
                <i class="ph ${item.icon}"></i>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatRupiah(item.price)} / ${item.unit}</div>
                <div class="cart-item-actions">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="ph ph-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="ph ph-plus"></i>
                        </button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
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
    const itemIndex = cart.findIndex(item => item.id === productId);

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
    cart = cart.filter(item => item.id !== productId);
    updateCart();
};

// Toggle Cart Sidebar
const toggleCart = () => {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
};

// Event Listeners
openCartBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

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
