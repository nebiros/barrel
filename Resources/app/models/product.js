Titanium.include( "../../barrel.js" );

function Product( app, key ) {
    this.app = app || CONFIG.APP;
    this.key = key || CONFIG.KEY;
    this.xhr = Titanium.Network.createHTTPClient();
}

Product.prototype.list = function ( callback, opts ) {
    if ( typeof callback !== "function" ) {
        alert( "callback must be a function" );
        return;
    }

    if ( typeof opts == "undefined" ) {
        opts = {};
    }

    if ( false === Titanium.Network.online ) {
        alert( "please connect to the internet!" );
        return;
    }

    opts["search"] = opts["search"] || null;
    opts["start"] = opts["start"] || 0;
    opts["limit"] = opts["limit"] || 10;
    opts["imageWidth"] = opts["imageWidth"] || 200;
    opts["description"] = opts["description"] || 0;
    opts["idProduct"] = opts["idProduct"] || null;
    opts["orderBy"] = opts["orderBy"] || null;
    opts["category"] = opts["category"] || null;

    opts["a"] = this.app;
    opts["k"] = this.key;

    var path = Barrel.Request.path( "/products/get-product-list", opts );
    Ti.API.debug( "url: " + path );
    try {
        this.xhr.open( "GET", path, false );
        this.xhr.timeout = 1000000;
        this.xhr.onload = callback;
        this.xhr.statusIndicator = Barrel.UI.statusInidicator();
        this.xhr.send();
    } catch ( e ) {
        alert( e );
    }
}

Product.prototype.users = function ( callback, opts ) {
    if ( typeof callback !== "function" ) {
        throw "callback must be a function";
    }

    if ( typeof opts == "undefined" ) {
        opts = {};
    }

    if ( !opts["idProduct"] ) {
        throw "product id does not exist";
    }

    if ( false === Titanium.Network.online ) {
        alert( "please connect to the internet!" );
        return;
    }

    opts["idProduct"] = parseInt( opts["idProduct"] );

    opts["a"] = this.app;
    opts["k"] = this.key;

    var path = Barrel.Request.path( "/products/get-product-users", opts );
    Ti.API.debug( "url: " + path );
    try {
        this.xhr.open( "GET", path, false );
        this.xhr.timeout = 1000000;
        this.xhr.onload = callback;
        this.xhr.statusIndicator = Barrel.UI.statusInidicator();
        this.xhr.send();
    } catch ( e ) {
        alert( e );
    }
}

Product.prototype.categories = function ( callback, opts ) {
    if ( typeof callback !== "function" ) {
        alert( "callback must be a function" );
        return;
    }

    if ( typeof opts == "undefined" ) {
        opts = {};
    }

    if ( false === Titanium.Network.online ) {
        alert( "please connect to the internet!" );
        return;
    }

    opts["a"] = this.app;
    opts["k"] = this.key;

    var path = Barrel.Request.path( "/products/get-product-categories", opts );
    Ti.API.debug( "url: " + path );
    try {
        this.xhr.open( "GET", path, false );
        this.xhr.timeout = 1000000;
        this.xhr.onload = callback;
        this.xhr.statusIndicator = Barrel.UI.statusInidicator();
        this.xhr.send();
    } catch ( e ) {
        alert( e );
    }
}
