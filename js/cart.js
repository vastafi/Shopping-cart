const to_cart_btns = document.getElementsByClassName("add-to-cart");
const total_cart = document.getElementById("total-cart");

function controller(book, quantity = 1) {
  let searchedIndex = isInCart(book.id);
  let cart_items = getCartItems();
  if (searchedIndex != -1) {
    let item = cart_items[searchedIndex];
    item.quantity += quantity;
    if (item.quantity < 1) item.quantity = 1;
    item.subtotal = item.quantity * item.price;
  } else {
    book.quantity = 1;
    book.subtotal = book.price;
    cart_items.push(book);
  }
  localStorage.setItem("cart_items", JSON.stringify(cart_items));

  renderCart();
}

$cart_items = document.getElementById("cart-items");

function renderCart() {
  items = getCartItems();
  $cart_items.innerHTML = "";

  items.forEach((item) => {
    $cart_items.insertAdjacentHTML("beforeend", CartItem(item));
  });
  let total = items.reduce((acc, item) => acc + +item.subtotal, 0);
  total_cart.innerText = total;
}
function CartItem(props) {
  return `
<br>
<br>
      <div class="form-group">
          <span class="">${props.name}</span>
          <span class="mx-4"></span>
          <span class="mx-4">${props.price}MDL</span>
          <span class="mx-4">
          <button class="minus-qnt btn btn-small btn btn-primary" data-id="${props.id}" >-</button>
          <span class="mx-4"></span>
          <span>${props.quantity}</span>
          <span class="mx-4"></span>
          <button class="plus-qnt btn btn-small btn btn-primary" data-id="${props.id}">+</button>
    <span class="mx-4">Subtotal (${props.subtotal} MDL)</span>
    <span class="mx-4"></span>
               <button class="remove-item btn btn-sm btn btn-danger" data-id="${props.id}">x</button>
            
          </span>
      </div>
      `;
}

document.addEventListener("click", function (e) {
  if (
    e.target &&
    (e.target.classList.contains("add-to-cart") ||
      e.target.classList.contains("plus-qnt"))
  ) {
    const book_id = e.target.dataset.id;

    const book = getBook(book_id);
    console.log(controller);
    controller(book);
  }
});

function getCartItems() {
  return JSON.parse(localStorage.getItem("cart_items")) ?? [];
}

function isInCart(book_id) {
  let items = getCartItems();
  return items.findIndex((item) => item.id == book_id);
}

document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("minus-qnt")) {
    const book_id = e.target.dataset.id;

    const book = getBook(book_id);
    controller(book, -1);
  }
});

document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("remove-item")) {
    const book_id = e.target.dataset.id;

    index = isInCart(book_id);
    if (index != -1) {
      let cart_items = getCartItems();
      cart_items.splice(index, 1);
      localStorage.setItem("cart_items", JSON.stringify(cart_items));
      renderCart();
    }
  }
});

document.getElementById("clear-cart").addEventListener("click", function () {
  localStorage.setItem("cart_items", JSON.stringify([]));
  renderCart();
});

renderCart();
