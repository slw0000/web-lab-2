console.log('database.js loaded');


// Инициализация бд через Promise чтобы красиво все обернуть и потом через async/await юзать

const dbPromise = new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('students-db', 1)


    openRequest.onupgradeneeded = function() {

        const db = openRequest.result;
        const store = db.createObjectStore('students', {
            keyPath: 'id',
            autoIncrement: true
        });

        store.createIndex('isuId', 'isuId', { unique: true });
    };

    openRequest.onerror = function() {
        reject(openRequest.error);
    };

    openRequest.onsuccess = function() {
        resolve(openRequest.result);
    }
});


// CRUD

export async function getAllStudents() {
    const db = await dbPromise;

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('students', 'readonly');
        const store = transaction.objectStore('students');

        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = function() {
            resolve(getAllRequest.result)
        }

        getAllRequest.onerror = function() {
            reject(getAllRequest.error)
        }
    });
};

export async function getStudentByDbId(id) {
    const db = await dbPromise;

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('students', 'readonly');
        const store = transaction.objectStore('students');

        const getStudentRequest = store.get(Number(id));

        getStudentRequest.onsuccess = function() {
            resolve(getStudentRequest.result)
        }

        getStudentRequest.onerror = function() {
            reject(getStudentRequest.error)
        }
    });
};

export async function getStudentByIsuId(isuId) {
    const db = await dbPromise;

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('students', 'readonly');
        const store = transaction.objectStore('students');

        const getStudentRequest = store.index("isuId").get(isuId);

        getStudentRequest.onsuccess = function() {
            resolve(getStudentRequest.result)
        }

        getStudentRequest.onerror = function() {
            reject(getStudentRequest.error)
        }
    });
};

 export async function deleteStudent(id) {
    const db = await dbPromise;

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('students', 'readwrite');
        const store = transaction.objectStore('students');

        store.delete(Number(id))

        transaction.oncomplete = function() {
            resolve()
        };

        transaction.onabort = function() {
            reject(transaction.error)
        };
    });
 };

 export async function addStudent(student) {
    const db = await dbPromise;

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('students', 'readwrite');
        const store = transaction.objectStore('students');

        store.add(student);

        transaction.oncomplete = function() {
            resolve()
        };

        transaction.onabort = function() {
            reject(transaction.error)
        };

    });
 };

 export async function updateStudent(student, id) {
    const db = await dbPromise;

    return new Promise((resolve, reject) => {
        const transaction = db.transaction("students", "readwrite");
        const store = transaction.objectStore("students");

        student.id = Number(id);

        store.put(student);

        transaction.oncomplete = function() {
            resolve();
        };

        transaction.onabort = function() {
            reject(transaction.error);
        };
    });
 };
