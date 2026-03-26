// EcoSwap App Data
let appState = {
    isLoggedIn: false,
    user: {
        email: '',
        greenPoints: 125,
        rating: 4.8,
        itemsSold: 12,
        itemsBought: 8,
        donations: 5
    },
    cart: [],
    items: [
        {
            id: 1,
            title: "Data Structures Textbook",
            category: "textbooks",
            price: 350,
            image: "product/txt_str.jpg.webp",
            seller: "Aby K Prakash",
            rating: 4.9,
            semester: "sem2",
            desc: "Excellent condition, used for one semester only."
        },
        {
            id: 2,
            title: "Wireless Mouse",
            category: "electronics",
            price: 450,
            image: "product/mouse.jpeg",
            seller: "Arjun Nagath Biju Haridas",
            rating: 4.7,
            semester: "sem2",
            desc: "Logitech wireless mouse, barely used."
        },
        {
            id: 3,
            title: "Table Lamp",
            category: "hostel",
            price: 250,
            image: "product/lamp.jpeg",
            seller: "Anurag PP",
            rating: 5.0,
            semester: "sem2",
            desc: "Adjustable study lamp, perfect for hostel room."
        },
        {
            id: 4,
            title: "Mountain Cycle",
            category: "cycles",
            price: 2500,
            image: "product/santa_cruise.jpg",
            seller: "Nipin KC",
            rating: 4.8,
            semester: "sem1",
            desc: "Good condition cycle, regularly maintained."
        },
        {
            id: 5,
            title: "Scientific Calculator",
            category: "textbooks",
            price: 800,
            image: "product/SciFiCalculator.jpeg",
            seller: "Aman Ayoth",
            rating: 4.9,
            semester: "sem2",
            desc: "Casio FX-991ES Plus, engineering essential."
        },
        {
            id: 6,
            title: "Electric Kettle",
            category: "hostel",
            price: 400,
            image: "product/kettle.webp",
            seller: "Anandhu K",
            rating: 4.6,
            semester: "sem3",
            desc: "1.5L capacity, fast boiling."
        }
    ],
    pointsHistory: [
        { action: "Bought second-hand item", points: 25, date: "Mar 18" },
        { action: "Sold textbook", points: 50, date: "Mar 15" },
        { action: "Donated clothes", points: 30, date: "Mar 12" },
        { action: "Used bicycle", points: 10, date: "Mar 10" }
    ]
};

// DOM Elements
const elements = {
    loginModal: document.getElementById('loginModal'),
    cartModal: document.getElementById('cartModal'),
    checkoutModal: document.getElementById('checkoutModal'),
    successModal: document.getElementById('successModal'),
    itemsGrid: document.getElementById('itemsGrid'),
    cartIcon: document.getElementById('cartIcon'),
    cartCount: document.getElementById('cartCount'),
    greenPoints: document.getElementById('greenPoints'),
    loginBtn: document.getElementById('loginBtn'),
    verifyBtn: document.getElementById('verifyBtn'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    payBtn: document.getElementById('payBtn'),
    continueBtn: document.getElementById('continueBtn'),
    sellForm: document.getElementById('sellForm'),
    categoryFilter: document.getElementById('categoryFilter'),
    searchInput: document.getElementById('searchInput'),
    sortFilter: document.getElementById('sortFilter'),
    pointsCircle: document.getElementById('pointsCircle'),
    pointsHistory: document.getElementById('pointsHistory'),
    userEmail: document.getElementById('userEmail'),
    profilePoints: document.getElementById('profilePoints')
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    renderItems();
    updateUI();
    showPage('marketplace');
});

// Event Listeners
function initEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Cart
    elements.cartIcon.addEventListener('click', () => toggleModal('cartModal'));
    
    // Modals
    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
        });
    });

    // Login
    elements.loginBtn.addEventListener('click', () => toggleModal('loginModal'));
    elements.verifyBtn.addEventListener('click', handleLogin);

    // Filters
    elements.categoryFilter.addEventListener('change', renderItems);
    elements.searchInput.addEventListener('input', renderItems);
    elements.sortFilter.addEventListener('change', renderItems);

    // Sell Form
    elements.sellForm.addEventListener('submit', handleSellItem);

    // Checkout
    elements.checkoutBtn.addEventListener('click', () => toggleModal('checkoutModal'));
    elements.payBtn.addEventListener('click', handlePayment);
    elements.continueBtn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
        clearCart();
    });

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'greenpoints') renderPointsHistory();
    if (pageId === 'profile') renderProfile();
}

// Render Functions
function renderItems() {
    const filteredItems = filterItems();
    const sortedItems = sortItems(filteredItems);
    
    elements.itemsGrid.innerHTML = sortedItems.map(item => `
        <div class="item-card">
            <img src="${item.image}" alt="${item.title}" class="item-image">
            <div class="item-title">${item.title}</div>
            <span class="item-category">${item.category.toUpperCase()}</span>
            <div class="item-price">₹${item.price}</div>
            <div class="item-meta">
                <span><i class="fas fa-star"></i> ${item.rating}</span>
                <span>${item.semester.replace('sem', 'Sem ')}</span>
            </div>
            <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 1rem;">${item.desc}</p>
            <div class="item-actions">
                <button class="btn btn-primary" onclick="addToCart(${item.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn btn-secondary" onclick="quickBuy(${item.id})">
                    <i class="fas fa-bolt"></i> Buy Now
                </button>
            </div>
        </div>
    `).join('');
}

function filterItems() {
    const category = elements.categoryFilter.value;
    const search = elements.searchInput.value.toLowerCase();
    
    return appState.items.filter(item => {
        return (!category || item.category === category) &&
               (item.title.toLowerCase().includes(search) || 
                item.desc.toLowerCase().includes(search));
    });
}

function sortItems(items) {
    const sort = elements.sortFilter.value;
    
    return [...items].sort((a, b) => {
        if (sort === 'newest') return b.id - a.id;
        if (sort === 'price-low') return a.price - b.price;
        if (sort === 'price-high') return b.price - a.price;
        return 0;
    });
}

function renderCart() {
    const cartItemsEl = document.getElementById('cartItems');
    const subtotal = appState.cart.reduce((sum, item) => sum + item.price, 0);
    const serviceFee = Math.round(subtotal * 0.02);
    const total = subtotal + serviceFee;
    
    cartItemsEl.innerHTML = appState.cart.length ? 
        appState.cart.map(item => `
            <div class="cart-items">
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    <div>
                        <div style="font-weight: 600;">${item.title}</div>
                        <div style="color: #10b981; font-weight: 700;">₹${item.price}</div>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="margin-left: auto; background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">
                        Remove
                    </button>
                </div>
            </div>
        `).join('') : 
        '<p style="text-align: center; color: #6b7280;">Your cart is empty</p>';
    
    document.getElementById('cartSubtotal').textContent = `₹${subtotal}`;
    document.getElementById('serviceFee').textContent = `₹${serviceFee}`;
    document.getElementById('cartTotal').textContent = `₹${total}`;
    document.getElementById('finalTotal').textContent = `₹${total}`;
}

function renderCheckout() {
    document.getElementById('checkoutSummary').innerHTML = appState.cart.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
            <span>${item.title}</span>
            <span>₹${item.price}</span>
        </div>
    `).join('');
}

function renderPointsHistory() {
    elements.pointsCircle.textContent = appState.user.greenPoints;
    elements.pointsHistory.innerHTML = appState.pointsHistory.map(activity => `
        <div style="display: flex; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #e5e7eb;">
            <div>
                <div style="font-weight: 600;">${activity.action}</div>
                <div style="color: #6b7280; font-size: 0.9rem;">${activity.date}</div>
            </div>
            <div style="font-weight: 800; color: #10b981;">+${activity.points} GP</div>
        </div>
    `).join('');
}

function renderProfile() {
    elements.userEmail.textContent = appState.user.email || 'student@college.edu';
    elements.profilePoints.textContent = appState.user.greenPoints;
}

// Cart Functions
function addToCart(itemId) {
    const item = appState.items.find(i => i.id === itemId);
    const existingItem = appState.cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        appState.cart.push({ ...item, quantity: 1 });
    }
    
    updateUI();
    showNotification('Item added to cart!');
}

function quickBuy(itemId) {
    addToCart(itemId);
    toggleModal('cartModal');
}

function removeFromCart(itemId) {
    appState.cart = appState.cart.filter(item => item.id !== itemId);
    updateUI();
    renderCart();
}

function clearCart() {
    appState.cart = [];
    updateUI();
}

// Transaction Functions
function handleLogin() {
    const email = document.getElementById('campusEmail').value;
    if (email.includes('@') && (email.includes('geckkd') || email.includes('ac.in')) && (email.includes('25br') || email.includes('24br') || email.includes('23br') || email.includes('22br'))) {
        appState.isLoggedIn = true;
        appState.user.email = email;
        elements.loginModal.classList.remove('active');
        elements.loginBtn.textContent = 'Logout';
        //elements.loginBtn.classList.remove('login-btn');
        showNotification('Welcome to EcoSwap! Campus verified.');
        updateUI();
    } else {
        alert('Please enter a valid campus email (e.g., student@college.edu)');
    }
}

function handleSellItem(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newItem = {
        id: Date.now(),
        title: document.getElementById('itemTitle').value,
        category: document.getElementById('itemCategory').value,
        price: parseInt(document.getElementById('itemPrice').value),
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
        seller: appState.user.email.split('@')[0],
        rating: 5.0,
        semester: document.getElementById('semester').value,
        desc: document.getElementById('itemDesc').value
    };
    
    appState.items.unshift(newItem);
    appState.user.greenPoints += 50;
    
    e.target.reset();
    showNotification('Item listed successfully! +50 GreenPoints');
    renderItems();
    updateUI();
    showPage('marketplace');
}

function handlePayment() {
    if (!appState.isLoggedIn) {
        alert('Please login first');
        return;
    }
    
    const total = appState.cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    appState.user.greenPoints += 25; // Reward for buying second-hand
    appState.user.itemsBought += appState.cart.length;
    
    toggleModal('checkoutModal');
    toggleModal('successModal');
    document.getElementById('successMessage').textContent = `Thank you for your purchase! Seller will receive full ₹${appState.cart.reduce((sum, item) => sum + item.price, 0)}`;
    
    // Simulate seller earning full amount (platform keeps service fee)
    showNotification(`Transaction complete! You earned 25 GreenPoints for sustainable shopping.`);
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('active');
    
    if (modalId === 'cartModal') renderCart();
    if (modalId === 'checkoutModal') renderCheckout();
}

function updateUI() {
    elements.cartCount.textContent = appState.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    elements.greenPoints.textContent = `${appState.user.greenPoints} GP`;
    document.getElementById('profilePoints').textContent = appState.user.greenPoints;
}

function showNotification(message) {
    // Simple notification (could be enhanced with toast)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(16,185,129,0.4);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
