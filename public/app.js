const API_URL = 'http://localhost:3000/api/products';

const productList = document.getElementById('productList');
const addProductForm = document.getElementById('addProductForm');
const searchInput = document.getElementById('searchInput');

let allProducts = [];
let editId = null;

// Fetch and display products
async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    allProducts = await res.json();
    renderProducts(allProducts);
  } catch (err) {
    productList.innerHTML = '<div class="col-span-3 text-red-500">Failed to load products.</div>';
  }
}

// Render product cards with inline edit/delete
function renderProducts(products) {
  if (!products.length) {
    productList.innerHTML = '<div class="col-span-3 text-gray-500">No products found.</div>';
    return;
  }
  productList.innerHTML = products.map(product => {
    if (editId === product.id) {
      // Edit mode
      return `
        <div class="bg-white rounded shadow p-4 flex flex-col">
          <input id="editName" class="font-bold text-lg mb-1 px-2 py-1 border rounded" value="${product.productName}" />
          <input id="editSupplier" class="text-gray-600 mb-2 px-2 py-1 border rounded" value="${product.supplierName}" />
          <input id="editPrice" type="number" min="1" class="text-blue-700 font-semibold text-xl mb-2 px-2 py-1 border rounded" value="${product.price}" />
          <div class="flex gap-2 mt-2">
            <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded" onclick="window.saveEdit('${product.id}')">Save</button>
            <button class="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded" onclick="window.cancelEdit()">Cancel</button>
          </div>
        </div>
      `;
    } else {
      // Normal mode
      return `
        <div class="bg-white rounded shadow p-4 flex flex-col">
          <div class="font-bold text-lg mb-1">${product.productName}</div>
          <div class="text-gray-600 mb-2">Supplier: ${product.supplierName}</div>
          <div class="text-blue-700 font-semibold text-xl mb-2">${product.price} KES</div>
          <div class="text-xs text-gray-400 mt-auto">${product.date ? new Date(product.date).toLocaleDateString() : ''}</div>
          <div class="flex gap-2 mt-2">
            <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded" onclick="window.startEdit('${product.id}')">Edit</button>
            <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded" onclick="window.deleteProduct('${product.id}')">Delete</button>
          </div>
        </div>
      `;
    }
  }).join('');
}

// Add product
addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addProductForm);
  const data = {
    productName: formData.get('productName'),
    supplierName: formData.get('supplierName'),
    price: Number(formData.get('price')),
    date: new Date().toISOString(),
  };
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add product');
    addProductForm.reset();
    fetchProducts();
  } catch (err) {
    alert('Failed to add product.');
  }
});

// Search/filter products
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allProducts.filter(p => p.productName.toLowerCase().includes(term));
  renderProducts(filtered);
});

// Inline edit/delete handlers
window.startEdit = function(id) {
  editId = id;
  renderProducts(allProducts);
};

window.cancelEdit = function() {
  editId = null;
  renderProducts(allProducts);
};

window.saveEdit = async function(id) {
  const name = document.getElementById('editName').value.trim();
  const supplier = document.getElementById('editSupplier').value.trim();
  const price = Number(document.getElementById('editPrice').value);
  if (!name || !supplier || !price) {
    alert('All fields are required.');
    return;
  }
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName: name, supplierName: supplier, price }),
    });
    if (!res.ok) throw new Error('Failed to update product');
    editId = null;
    fetchProducts();
  } catch (err) {
    alert('Failed to update product.');
  }
};

window.deleteProduct = async function(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
    fetchProducts();
  } catch (err) {
    alert('Failed to delete product.');
  }
};

// Initial load
fetchProducts(); 