let indexedDB =
  window.indexedDB ||
  window.webkitIndexedDB ||
  window.mozIndexedDB ||
  window.OIndexedDB ||
  window.msIndexedDB;
let IDBTransaction =
  window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.OIDBTransaction ||
  window.msIDBTransaction;
let dbVersion = 1.0;

let request = indexedDB.open("books", dbVersion);
let db = null;

const createObjectStore = function (dataBase) {
  console.log("Creating objectStore");
  dataBase.createObjectStore("images");
};

request.onerror = function (event) {};

request.onsuccess = function (event) {
  db = request.result;

  db.onerror = function (event) {};

  if (db.setVersion) {
    if (db.version != dbVersion) {
      var setVersion = db.setVersion(dbVersion);
      setVersion.onsuccess = function () {
        console.log("create store");
        createObjectStore(db);
      };
    }
  }
};

request.onupgradeneeded = function (event) {
  createObjectStore(event.target.result);
};
