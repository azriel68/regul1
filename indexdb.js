regul.indexedDB = {};

regul.indexedDB.open = function() {
	
  var version = 1;
  var request = indexedDB.open("regul", version);

  request.onsuccess = function(e) {
  	regul.indexedDB.db = e.target.result;
   
  };
 
  request.onupgradeneeded = function (evt) { 
  		var db = evt.currentTarget.result;
  		        
        var objectStore = db.createObjectStore("speciale", 
                                     { keyPath: "id", autoIncrement: true });
 
        objectStore.createIndex("id", "id", { unique: true });
        objectStore.createIndex("label", "label", { unique: false });
               
   };

  request.onerror = regul.indexedDB.onerror;
 
};


regul.indexedDB.getAll= function(storename, TArray, callback) {
  
  var db = regul.indexedDB.db;
  var trans = db.transaction(storename, "readwrite");
  var store = trans.objectStore(storename);

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(result) {
		TArray.push(result.value);
		result.continue();
    	
    }
    else{
    	
    	callback();
    }
      
	
  };

  cursorRequest.oncomplete = function() {
  	
  	
  };

  cursorRequest.onerror = regul.indexedDB.onerror;
};

regul.indexedDB.addItem = function(storename,item) {
  var db = regul.indexedDB.db;
  var trans = db.transaction(storename, "readwrite");
  var store = trans.objectStore(storename);
  store.delete(item.id);
  var request = store.put(item);

  trans.oncomplete = function(e) {
   
  };

  request.onerror = function(e) {
    console.log(e.value);
  };
};

regul.indexedDB.getItem = function (storename, id, callbackfct) {
	
	  var db = regul.indexedDB.db;
	  var trans = db.transaction(storename, "readwrite");
	  var store = trans.objectStore(storename);
	 
	  var request = store.get(id.toString()); 
	  request.onsuccess = function() {
		  var matching = request.result;
		  if (matching !== undefined) {
		    callbackfct(matching);
		  } else {
		    alert('Item not found');
		  }
	 };
	 
		
	
};


regul.indexedDB.clear=function() {
		var db = regul.indexedDB.db;
		db.close();
		
  		var req = indexedDB.deleteDatabase("regul");
		req.onsuccess = function () {
		    console.log("Deleted database successfully");
		};
		req.onerror = function () {
		    console.log("Couldn't delete database");
		};
		req.onblocked = function () {
		    console.log("Couldn't delete database due to the operation being blocked");
		};
	
};
