let products = JSON.parse(localStorage.getItem("products")) || [];
let basket = JSON.parse(localStorage.getItem("basket")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("product-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      addProduct();
    });
  }

  if (document.getElementById("product-list")) loadProducts();
  if (document.getElementById("basket-list")) loadBasket();
  updateCartCounter();
});

function convertToBase64(file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => callback(reader.result);
  reader.onerror = (error) => console.error("Base64 xatosi:", error);
}

function addProduct() {
  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");
  const imageInput = document.getElementById("image");

  if (!nameInput || !priceInput || !imageInput) {
    console.error("Form elementlari topilmadi!");
    return;
  }

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value.trim());
  const imageFile = imageInput.files[0];

  if (name && price && imageFile) {
    convertToBase64(imageFile, (base64Image) => {
      products.push({ name, price, image: base64Image });
      localStorage.setItem("products", JSON.stringify(products));

      alert("Mahsulot qo'shildi!");
      document.getElementById("product-form").reset();
    });
  } else {
    alert("Barcha maydonlarni to'ldiring!");
  }
}

function loadProducts(filter = "") {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  productList.innerHTML = "";
  let filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    productList.innerHTML = `<p class="text-center text-muted">Mahsulot topilmadi.</p>`;
    return;
  }

  filteredProducts.forEach((product, index) => {
    const card = `
      <div class="col-md-3">
        <div class="card shadow-sm h-100">
          <img src="${product.image}" class="card-img-top img-fluid" alt="${product.name}" style="height: 250px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.price} сум</p>
            <button class="btn btn-success mt-auto" onclick="addToBasket(${index})">Купить</button>
          </div>
        </div>
      </div>
    `;
    productList.innerHTML += card;
  });
}

function addToBasket(index) {
  let existingProduct = basket.find(item => item.name === products[index].name);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    basket.push({ ...products[index], quantity: 1 });
  }

  localStorage.setItem("basket", JSON.stringify(basket));
  updateCartCounter();
  loadBasket();
}

function updateCartCounter() {
  let cartCounter = document.getElementById("cart-counter");
  if (cartCounter) {
    cartCounter.textContent = basket.reduce((total, item) => total + item.quantity, 0);
  }
}

function loadBasket(filter = "") {
  const basketList = document.getElementById("basket-list");
  if (!basketList) return;

  basketList.innerHTML = "";
  let total = 0;

  let filteredBasket = basket.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredBasket.length === 0) {
    basketList.innerHTML = `<p class="text-center text-muted">Savatchada hech narsa yo‘q.</p>`;
    document.getElementById("total-price").textContent = 0;
    return;
  }

  filteredBasket.forEach((item, index) => {
    total += item.price * item.quantity;

    const card = `
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-sm mb-3">
          <img src="${item.image}" class="card-img-top img-fluid" alt="${item.name}">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text text-muted">${item.price} сум</p>
            <div class="d-flex justify-content-between align-items-center">
              <button class="btn btn-danger btn-sm" onclick="removeFromBasket(${index})">🗑 Удалить</button>
              <div class="d-flex align-items-center">
                <button class="btn btn-outline-secondary btn-sm me-2" onclick="decreaseQuantity(${index})">-</button>
                <span class="badge bg-primary">${item.quantity} шт</span>
                <button class="btn btn-outline-secondary btn-sm ms-2" onclick="increaseQuantity(${index})">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    basketList.innerHTML += card;
  });

  document.getElementById("total-price").textContent = total;
}

function decreaseQuantity(index) {
  if (basket[index].quantity > 1) {
    basket[index].quantity -= 1;
  } else {
    basket.splice(index, 1);
  }
  localStorage.setItem("basket", JSON.stringify(basket));
  updateCartCounter();
  loadBasket();
}

function increaseQuantity(index) {
  basket[index].quantity += 1;
  localStorage.setItem("basket", JSON.stringify(basket));
  updateCartCounter();
  loadBasket();
}

function removeFromBasket(index) {
  basket.splice(index, 1);
  localStorage.setItem("basket", JSON.stringify(basket));
  updateCartCounter();
  loadBasket();
}

function searchProducts() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    const filter = searchInput.value.trim();
    if (document.getElementById("product-list")) loadProducts(filter);
    if (document.getElementById("basket-list")) loadBasket(filter);
  }
}
