const putImageInDb = function (book) {
  console.log("Putting images in IndexedDB");
  var transaction = db.transaction(["images"], "readwrite");
  var put = transaction.objectStore("images").put(book.image, book.id);
};

const deleteImage = function (id) {
  console.log("Putting images in IndexedDB");
  var transaction = db.transaction(["images"], "readwrite");
  transaction.objectStore("images").delete(id);
};

const getImageFromDb = function (id) {
  return new Promise(function (resolve, reject) {
    var transaction = db.transaction(["images"], "readwrite");
    let req = transaction.objectStore("images").get(id);
    req.onsuccess = (e) => {
      resolve(e.target.result);
    };

    request.onerror = function (event) {
      reject(event);
    };
  });
};
