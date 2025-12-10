import { Grant } from '../types';

// Using a more descriptive name for the DB
const DB_NAME = 'CivicavitaAppDB';
const DB_VERSION = 1;
const GRANTS_STORE = 'grants';
const POST_IMAGES_STORE = 'postImages';
const PROJECT_IMAGES_STORE = 'projectImages';


let db: IDBDatabase;

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // If db is already initialized, resolve immediately
    if (db) {
      return resolve(true);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', request.error);
      reject('Error opening IndexedDB.');
    };

    request.onsuccess = (event) => {
      db = request.result;
      resolve(true);
    };

    // This event is only fired when the version changes.
    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(GRANTS_STORE)) {
        dbInstance.createObjectStore(GRANTS_STORE, { keyPath: 'link' });
      }
      if (!dbInstance.objectStoreNames.contains(POST_IMAGES_STORE)) {
        dbInstance.createObjectStore(POST_IMAGES_STORE, { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(PROJECT_IMAGES_STORE)) {
        dbInstance.createObjectStore(PROJECT_IMAGES_STORE, { keyPath: 'id' });
      }
    };
  });
};

export const addGrants = (grants: Grant[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject('DB not initialized.');
    }
    const transaction = db.transaction(GRANTS_STORE, 'readwrite');
    const store = transaction.objectStore(GRANTS_STORE);

    transaction.onerror = () => {
      console.error('Transaction error:', transaction.error);
      reject('Error adding grants.');
    };
    
    transaction.oncomplete = () => {
      resolve();
    };

    grants.forEach(grant => {
      store.put(grant);
    });
  });
};

export const getAllGrants = (): Promise<Grant[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject('DB not initialized.');
    }
    const transaction = db.transaction(GRANTS_STORE, 'readonly');
    const store = transaction.objectStore(GRANTS_STORE);
    const request = store.getAll();

    request.onerror = () => {
      console.error('Get all grants error:', request.error);
      reject('Error fetching all grants.');
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
};

export const clearAllGrants = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!db) {
            return reject('DB not initialized.');
        }
        const transaction = db.transaction(GRANTS_STORE, 'readwrite');
        const store = transaction.objectStore(GRANTS_STORE);
        const request = store.clear();

        request.onerror = () => {
            console.error('Clear all grants error:', request.error);
            reject('Error clearing grants.');
        };

        request.onsuccess = () => {
            resolve();
        };
    });
};


// --- Image Caching Functions ---

export const cacheImage = (storeName: 'postImages' | 'projectImages', id: string, imageUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized.');
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    store.put({ id, imageUrl });
    
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => {
      console.error('Error caching image:', transaction.error);
      reject(transaction.error);
    };
  });
};

export const getCachedImage = (storeName: 'postImages' | 'projectImages', id: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized.');
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    
    request.onsuccess = () => {
      resolve(request.result ? request.result.imageUrl : null);
    };
    request.onerror = () => {
       console.error('Error getting cached image:', request.error);
       reject(request.error);
    };
  });
};
