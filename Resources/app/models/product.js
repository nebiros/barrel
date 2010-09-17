Titanium.include( "../../barrel.js" );

Product = function ( app, key ) {
    var a = app || CONFIG.APP;
    var k = key || CONFIG.KEY;

    var xhr = Titanium.Network.createHTTPClient();

    return {
        list: function ( callback, opts ) {
            if ( typeof callback !== "function" ) {
                alert( "callback must be a function" );
                return;
            }

            if ( typeof opts == "undefined" ) {
                opts = {};
            }

            if ( false === Titanium.Network.online ) {
                alert( "No existe conexión a internet!" );
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

            opts["a"] = a;
            opts["k"] = k;

            var path = Barrel.Request.path( "/products/get-product-list", opts );
            Ti.API.debug( "path: " + path );

            try {                
                xhr.open( "GET", path, false );
                xhr.timeout = 1000000;
                xhr.onload = callback;
                xhr.statusIndicator = Barrel.UI.statusInidicator();
                xhr.send();
            } catch ( e ) {
                alert( e );
            }
        },
        users: function ( callback, opts ) {
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
                alert( "No existe conexión a internet!" );
                return;
            }

            opts["idProduct"] = parseInt( opts["idProduct"] );

            opts["a"] = a;
            opts["k"] = k;

            var path = Barrel.Request.path( "/products/get-product-users", opts );
            Ti.API.debug( "path: " + path );

            try {
                xhr.open( "GET", path );
                xhr.timeout = 1000000;
                xhr.onload = callback;
                xhr.statusIndicator = Barrel.UI.statusInidicator();
                xhr.send();
            } catch ( e ) {
                alert( e );
            }
        },
        categories: function ( callback, opts ) {
            if ( typeof callback !== "function" ) {
                alert( "callback must be a function" );
                return;
            }

            if ( typeof opts == "undefined" ) {
                opts = {};
            }

            if ( false === Titanium.Network.online ) {
                alert( "No existe conexión a internet!" );
                return;
            }

            opts["a"] = a;
            opts["k"] = k;

            var path = Barrel.Request.path( "/products/get-product-categories", opts );
            Ti.API.debug( "path: " + path );

            try {
                xhr.open( "GET", path );
                xhr.timeout = 1000000;
                xhr.onload = callback;
                xhr.statusIndicator = Barrel.UI.statusInidicator();
                xhr.send();
            } catch ( e ) {
                alert( e );
            }
        }
    };
};
