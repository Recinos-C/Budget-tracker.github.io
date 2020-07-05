import {
    request
} from "express";

var indexdb = window.indexeddb || window.mozIndexDB || window.webkitIndexedDB || window.msIndexedDB;
// DOC uses : window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// set empty db first
var db;

var request = window.indexedDB.open("budget", 1);

// needs upgrade incase not aligned with broswer version
request.onupgradeneeded = ({
    target
}) => {
    var db = target.result
    // doc found for increment is autoincrement (boolean)
    db.createObjectStore("working", {
        autoIncrement: true
    })
}

request.onerror = function (event) {
    console.log("failed to load..." + event.target.error);
};
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.online) {
        console.log("Connect to the web")
        cheeckDB();
    } else {
        console.log("Offline")
    }

};


function saveRecord(record) {
    var transaction = db.transaction(["waiting..."], "readwrite")
    var store = transaction.objectStore("waiting...")
    store.add(record)
}

//   offline functions same as function in index.js
// drag over to make sure fetch request is the same
function checkDB() {
    var transaction = db.transaction(["waiting..."], "readwrite")
    var store = transaction.objectStore("waiting...")
    var getAll = store.getAll()
    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
                fetch("/api/transaction/bulk",{
                    method:"POST",
                    body:JSON.stringify(getAll.result),
                    headers:{
                        Accept:"application/json,text/plain,*/*",
                        "Contenet-Type":"application/json"
                    }
                }).then(response=>{
                    return response.json()
                }).then(()=>{
                    var transaction = db.transaction(["waiting..."], "readwrite")
                    var store = transaction.objectStore("waiting...")
                    store.clear();
                    console.log("has been called and cleared")
                })
        }
    }

}

// check to see if online in order to call offline capability
window.addEventListener("online", checkDB)