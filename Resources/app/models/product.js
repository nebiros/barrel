Titanium.include( "../../barrel.js" );

Product = function ( app, key ) {
    var a = app || CONFIG.APP;
    var k = key || CONFIG.KEY;

    var httpClient = Titanium.Network.createHTTPClient();

    return {
        list: function ( callback, opts ) {
            if ( typeof callback !== "function" ) {
                throw "callback must be a function";
            }

            if ( typeof opts == "undefined" ) {
                opts = {};
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
            Ti.API.debug( path );

            try {
                httpClient.open( "GET", path );
                httpClient.onload = callback;
                httpClient.statusIndicator = Barrel.UI.statusInidicator();
                httpClient.send();

                if ( httpClient.OPENED == httpClient.readyState ) {
                    httpClient.statusIndicator.show();
                }
            } catch ( e ) {
                throw e;
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

            opts["idProduct"] = parseInt( opts["idProduct"] );

            opts["a"] = a;
            opts["k"] = k;

            var path = Barrel.Request.path( "/products/get-product-users", opts );
            Ti.API.debug( path );

            try {
                httpClient.open( "GET", path );
                httpClient.onload = callback;
                httpClient.statusIndicator = Barrel.UI.statusInidicator();
                httpClient.send();

                if ( httpClient.OPENED == httpClient.readyState ) {
                    httpClient.statusIndicator.show();
                }
            } catch ( e ) {
                throw e;
            }
        },
        categories: function ( callback, opts ) {
            if ( typeof callback !== "function" ) {
                throw "callback must be a function";
            }

            if ( typeof opts == "undefined" ) {
                opts = {};
            }

            opts["a"] = a;
            opts["k"] = k;

            var path = Barrel.Request.path( "/products/get-product-categories", opts );
            Ti.API.debug( path );

            try {
                httpClient.open( "GET", path );
                httpClient.onload = callback;
                httpClient.statusIndicator = Barrel.UI.statusInidicator();
                httpClient.send();

                if ( httpClient.OPENED == httpClient.readyState ) {
                    httpClient.statusIndicator.show();
                }
            } catch ( e ) {
                throw e;
            }
        }
    };
};
