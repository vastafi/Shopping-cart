const bookCard = (book) => {
    return `
    <div class="card mb-4 shadow-sm">
    <div class="card-header">
        <h4 class="my-0 font-weight-normal">${book.name}</h4>
    </div>
    <div class="card-body">
        <figure class="card card-product">
            <div class="img-wrap"><img
                    src="${book.src}">
            </div>
            <p class="card__text ">Author: ${book.author}</p>
            <h4 class="card-text pricing-card-title">Price: ${book.price} MDL</p></h4>
            <p class="title">${book.description}</p>
            <a href="#" data-id="${book.id}" class="add-to-cart btn btn-primary">Add to
                cart</a>
        </figure>
    </div>
</div>
    `;
};

function getBooks() {
    return JSON.parse(localStorage.getItem("books")) ?? [];
}

function getBook(id, onlyIndex = false) {
    let books = getBooks();
    return onlyIndex
        ? books.findIndex((book) => book.id == id)
        : books.find((book) => book.id == id);
}

const products = document.getElementById("products");

getBooks().forEach(async (book) => {
    book.src = URL.createObjectURL(await getImageFromDb(book.id));
    products.insertAdjacentHTML("beforeend", bookCard(book));
});
