window.onload = async (event) => {
    let books = getBooks();
    asyncForEach(books, async (book) => insertNewRecord(book));
};

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

let file = null;

const image = document.getElementById("image");
image.addEventListener("change", function (e) {
    [file] = image.files;
    const image_src = URL.createObjectURL(file);
    document.getElementById(
        "preview"
    ).innerHTML = `<img src="${image_src}" width="100px"/>`;
});

let selectedRow = null;
let selectedBook = null;

function onFormSubmit() {
    if (validate()) {
        let formData = readFormData();
        if (selectedRow == null) {
            let book = addBook(formData);
            insertNewRecord(book);
        } else {
            let book = editBook(formData, selectedBook);
            if (book) {
                updateRecord(book);
            }
        }
        resetForm();
    }
}

function getBooks() {
    return JSON.parse(localStorage.getItem("books")) ?? [];
}

function getBook(id, onlyIndex = false) {
    let books = getBooks();
    return onlyIndex
        ? books.findIndex((book) => book.id == id)
        : books.find((book) => book.id == id);
}

function addBook(book) {
    book.id = Date.now() * Math.random();
    book.image = file;
    putImageInDb(book);
    localStorage.setItem("books", JSON.stringify([...getBooks(), book]));

    return book;
}

function editBook(updatedBook, id) {
    index = getBook(id, true);
    if (index != -1) {
        books = getBooks();
        books[index] = updatedBook;
        books[index].id = id;
        books[index].image = file;
        putImageInDb(books[index]);
        localStorage.setItem("books", JSON.stringify(books));
        return books[index];
    }

    return updatedBook;
}

function deleteBook(id) {
    index = getBook(id, true);
    if (index != -1) {
        let books = getBooks();
        books.splice(index, 1);
        localStorage.setItem("books", JSON.stringify(books));
        deleteImage(id);
    }
}

function readFormData() {
    let formData = {};
    formData.name = document.getElementById("name").value;
    formData.author = document.getElementById("author").value;
    formData.description = document.getElementById("description").value;
    formData.price = document.getElementById("price").value;
    formData.category = document.getElementById("category").value;
    return formData;
}

async function insertNewRecord(book) {
    let table = document
        .getElementById("employeeList")
        .getElementsByTagName("tbody")[0];

    let newRow = table.insertRow(table.length);

    cell1 = newRow.insertCell(0);
    cell1.innerHTML = book.name;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = book.author;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = book.description;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = book.price;
    cell5 = newRow.insertCell(4);
    cell5.innerHTML = book.category;
    cell6 = newRow.insertCell(5);
    let src = URL.createObjectURL(await getImageFromDb(book.id));
    cell6.innerHTML = `<img src="${src}" width="100px"/>`;
    cell7 = newRow.insertCell(6);
    cell7.innerHTML = `
    <button class="btn btn-sm btn-primary" onClick="onEdit(this, ${book.id})">Edit</button>
    <button class="btn btn-sm btn-danger" onClick="onDelete(this, ${book.id})">Delete</button>
  `;
}

function resetForm() {
    document.getElementById("preview").innerHTML = "";
    document.getElementById("name").value = "";
    document.getElementById("author").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").value = "";
    document.getElementById("image").value = "";
    document.getElementById("image_src").value = "";
}

async function onEdit(td, id) {
    book = getBook(id);

    if (book) {
        document.getElementById("name").value = book.name;
        document.getElementById("author").value = book.author;
        document.getElementById("description").value = book.description;
        document.getElementById("price").value = book.price;
        document.getElementById("category").value = book.category;
        document.getElementById("image_src").value = book.image_src;
        file = await getImageFromDb(id);
        let src = URL.createObjectURL(await getImageFromDb(id));
        document.getElementById(
            "preview"
        ).innerHTML = `<img src="${src}" width="100px"/>`;

        selectedRow = td.parentElement.parentElement;
        selectedBook = id;
    }
}

async function updateRecord(book) {
    selectedRow.cells[0].innerHTML = book.name;
    selectedRow.cells[1].innerHTML = book.author;
    selectedRow.cells[2].innerHTML = book.description;
    selectedRow.cells[3].innerHTML = book.price;
    selectedRow.cells[4].innerHTML = book.category;
    let src = URL.createObjectURL(await getImageFromDb(book.id));
    selectedRow.cells[5].innerHTML = `<img src="${src}" width="100px"/>`;
    selectedRow = null;
    selectedBook = null;
}

function onDelete(td, id) {
    if (confirm("Are you sure to delete this record ?")) {
        deleteBook(id);

        row = td.parentElement.parentElement;
        document.getElementById("employeeList").deleteRow(row.rowIndex);
        resetForm();
    }
}

function validate() {
    isValid = true;
    if (document.getElementById("name").value === "") {
        isValid = false;
        document.getElementById("nameValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (
            !document.getElementById("nameValidationError").classList.contains("hide")
        )
            document.getElementById("nameValidationError").classList.add("hide");
    }
    return isValid;
}
