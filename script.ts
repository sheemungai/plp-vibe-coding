interface PriceEntry {
    _id: string;
    productName: string;
    supplierName: string;
    price: number;
    date: string;
}

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    freshness: string;
    supplier: string;
    location: string;
    discount?: number;
}

const API_URL = 'http://localhost:3000/api/prices';

// Sample products data
const products: Product[] = [
    {
        id: '1',
        name: 'Fresh Tomatoes (1kg)',
        category: 'vegetables',
        price: 120,
        image: 'https://images.unsplash.com/photo-1546094097-24607b921c63?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        freshness: 'fresh',
        supplier: 'Mama Agnes',
        location: 'Westlands, Nairobi (1.5km away)'
    },
    {
        id: '2',
        name: 'Spinach Bunch',
        category: 'leafy-greens',
        price: 80,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        freshness: 'fresh',
        supplier: 'John K.',
        location: 'Kasarani, Nairobi (3km away)',
        discount: 20
    },
    {
        id: '3',
        name: 'Sweet Mangoes (Pack of 3)',
        category: 'fruits',
        price: 250,
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        freshness: 'fresh',
        supplier: 'Beatrice W.',
        location: 'Karen, Nairobi (5km away)'
    }
];

// Cart functionality
let cart: { [key: string]: number } = {};

// DOM Elements
const priceEntryForm = document.getElementById('priceEntryForm') as HTMLFormElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const filterSelect = document.getElementById('filterSelect') as HTMLSelectElement;
const entriesContainer = document.getElementById('entriesContainer') as HTMLDivElement;
const productsContainer = document.getElementById('productsContainer') as HTMLElement;
const offersContainer = document.getElementById('offersContainer') as HTMLElement;
const categoryFilter = document.getElementById('categoryFilter') as HTMLSelectElement;
const priceRange = document.getElementById('priceRange') as HTMLInputElement;
const priceValue = document.getElementById('priceValue') as HTMLElement;
const freshnessFilter = document.getElementById('freshnessFilter') as HTMLSelectElement;
const cartCount = document.querySelector('.cart-count') as HTMLElement;

// Event Listeners
priceEntryForm.addEventListener('submit', handleFormSubmit);
searchInput.addEventListener('input', debounce(handleSearch, 300));
filterSelect.addEventListener('change', handleFilter);

// Form Submit Handler
async function handleFormSubmit(e: Event) {
    e.preventDefault();
    
    const formData = {
        productName: (document.getElementById('productName') as HTMLInputElement).value,
        supplierName: (document.getElementById('supplierName') as HTMLInputElement).value,
        price: parseFloat((document.getElementById('price') as HTMLInputElement).value),
        date: (document.getElementById('date') as HTMLInputElement).value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to add entry');
        
        priceEntryForm.reset();
        fetchAndDisplayEntries();
    } catch (error) {
        console.error('Error adding entry:', error);
        alert('Failed to add entry. Please try again.');
    }
}

// Fetch and Display Entries
async function fetchAndDisplayEntries(searchTerm: string = '') {
    try {
        const url = searchTerm 
            ? `${API_URL}?productName=${encodeURIComponent(searchTerm)}`
            : API_URL;
            
        const response = await fetch(url);
        const entries: PriceEntry[] = await response.json();
        
        displayEntries(entries);
    } catch (error) {
        console.error('Error fetching entries:', error);
        entriesContainer.innerHTML = '<p class="error">Failed to load entries. Please try again.</p>';
    }
}

// Display Entries
function displayEntries(entries: PriceEntry[]) {
    entriesContainer.innerHTML = entries.length ? entries.map(entry => `
        <div class="entry-card">
            <h3>${entry.productName}</h3>
            <p><strong>Supplier:</strong> ${entry.supplierName}</p>
            <p><strong>Price:</strong> $${entry.price.toFixed(2)}</p>
            <p><strong>Date:</strong> ${new Date(entry.date).toLocaleDateString()}</p>
        </div>
    `).join('') : '<p>No entries found</p>';
}

// Search Handler
function handleSearch() {
    const searchTerm = searchInput.value.trim();
    fetchAndDisplayEntries(searchTerm);
}

// Filter Handler
function handleFilter() {
    const searchTerm = searchInput.value.trim();
    fetchAndDisplayEntries(searchTerm);
}

// Utility: Debounce function
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: number;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => func(...args), wait);
    };
}

// Initial load
fetchAndDisplayEntries();

// Initialize the page
function initializePage() {
    displayProducts(products);
    displayOffers(products.filter(product => product.discount));
    setupEventListeners();
    updateCartCount();
}

// Display products in the grid
function displayProducts(productsToShow: Product[]) {
    productsContainer.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product: Product): HTMLElement {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discountBadge = product.discount 
        ? `<div class="discount-badge">${product.discount}% OFF</div>` 
        : '';
    
    const originalPrice = product.discount 
        ? `<span class="original-price">KES ${product.price}</span>` 
        : '';
    
    const discountedPrice = product.discount 
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;
    
    card.innerHTML = `
        ${discountBadge}
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <p class="product-supplier">${product.supplier} - ${product.location}</p>
            <p class="product-freshness">Freshness: ${product.freshness}</p>
            <div class="product-price">
                ${originalPrice}
                <span>KES ${discountedPrice}</span>
            </div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    return card;
}

// Display offers in the featured section
function displayOffers(offers: Product[]) {
    offersContainer.innerHTML = '';
    
    offers.forEach(offer => {
        const offerCard = createProductCard(offer);
        offersContainer.appendChild(offerCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', filterProducts);
    
    // Filter functionality
    categoryFilter.addEventListener('change', filterProducts);
    freshnessFilter.addEventListener('change', filterProducts);
    priceRange.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        priceValue.textContent = `KES ${value}`;
        filterProducts();
    });
    
    // Add to cart functionality
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('add-to-cart')) {
            const productId = target.getAttribute('data-id');
            if (productId) {
                addToCart(productId);
            }
        }
    });
}

// Filter products based on search and filters
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedFreshness = freshnessFilter.value;
    const maxPrice = parseInt(priceRange.value);
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesFreshness = selectedFreshness === 'all' || product.freshness === selectedFreshness;
        const matchesPrice = product.price <= maxPrice;
        
        return matchesSearch && matchesCategory && matchesFreshness && matchesPrice;
    });
    
    displayProducts(filteredProducts);
}

// Cart functionality
function addToCart(productId: string) {
    cart[productId] = (cart[productId] || 0) + 1;
    updateCartCount();
    
    // Show add to cart animation
    const button = document.querySelector(`[data-id="${productId}"]`) as HTMLElement;
    button.textContent = 'Added!';
    setTimeout(() => {
        button.textContent = 'Add to Cart';
    }, 1000);
}

function updateCartCount() {
    const totalItems = Object.values(cart).reduce((sum: number, count: number) => sum + count, 0);
    cartCount.textContent = totalItems.toString();
}

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Add hover animation to cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const ctaButton = document.querySelector('.cta-button');

    // Add click event to CTA button
    ctaButton?.addEventListener('click', () => {
        // Smooth scroll to the top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effect to cards
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });
});

// Navbar burger menu toggle
const navbarBurger = document.getElementById('navbarBurger');
const navbarLinks = document.querySelector('.navbar-links');

if (navbarBurger && navbarLinks) {
    navbarBurger.addEventListener('click', () => {
        navbarLinks.classList.toggle('open');
    });
}

// Smooth scrolling for anchor links
const navLinks = document.querySelectorAll('.navbar-links a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = (link as HTMLAnchorElement).getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: (target as HTMLElement).offsetTop - 60, // offset for navbar
                    behavior: 'smooth'
                });
                // Close menu on mobile after click
                if (window.innerWidth <= 768 && navbarLinks) {
                    navbarLinks.classList.remove('open');
                }
            }
        }
    });
}); 