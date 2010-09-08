// include configuration file.
Titanium.include( "config.js" );

var Kactoos = {
    BASE_URI: "http://www.kactoos.com/api"
};

Kactoos.Product = function ( app, key ) {
    var a = app;
    var k = key;

    var httpClient = Titanium.Network.createHTTPClient();

    return {
        list: function ( callback, data ) {
            if ( typeof callback !== "function" ) {
                throw "callback must be a function";
            }

            if ( typeof data == "undefined" ) {
                data = {};
            }

            data["search"] = data["search"] || null;
            data["start"] = data["start"] || 0;
            data["limit"] = data["limit"] || 10;
            data["imageWidth"] = data["imageWidth"] || 200;
            data["description"] = data["description"] || 0;
            data["idProduct"] = data["idProduct"] || null;
            data["orderBy"] = data["orderBy"] || null;
            data["category"] = data["category"] || null;

            data["a"] = a;
            data["k"] = k;

            var path = Kactoos.Util.buildPath( "/products/get-product-list", data );
Ti.API.info(path);

            try {
                httpClient.open( "GET", path );
                httpClient.onload = callback;
                httpClient.send();
            } catch ( e ) {
                throw e;
            }
        },
        users: function ( callback, data ) {
            if ( typeof callback !== "function" ) {
                throw "callback must be a function";
            }

            if ( typeof data == "undefined" ) {
                data = {};
            }

            if ( !data["idProduct"] ) {
                throw "product id does not exist";
            }

            data["idProduct"] = parseInt( data["idProduct"] );

            data["a"] = a;
            data["k"] = k;

            var path = Kactoos.Util.buildPath( "/products/get-product-users", data );
Ti.API.info(path);

            try {
                httpClient.open( "GET", path );
                httpClient.onload = callback;
                httpClient.send();
            } catch ( e ) {
                throw e;
            }
        },
        categories: function ( callback, data ) {
            if ( typeof callback !== "function" ) {
                throw "callback must be a function";
            }

            if ( typeof data == "undefined" ) {
                data = {};
            }

            data["a"] = a;
            data["k"] = k;

            var path = Kactoos.Util.buildPath( "/products/get-product-categories", data );
Ti.API.info(path);

            try {
                httpClient.open( "GET", path );
                httpClient.onload = callback;
                httpClient.send();
            } catch ( e ) {
                throw e;
            }
        }
    };
}

Kactoos.Util = {
    buildPath: function ( path, data ) {
        if ( typeof data == "undefined" ) {
            data = {};
        }

        var f = data["format"]; delete data["format"];

        if ( !f ) {
            f = "json";
        }

        var a = data["a"]; delete data["a"];
        var k = data["k"]; delete data["k"];

        var qs = Kactoos.Util.toQueryString( data ); qs = qs ? "&" + qs : null;
        path = Kactoos.BASE_URI + path + "?format=" + f + "&appName=" + a + "&apiKey=" + k + qs;
        return path;
    },
    toQueryString: function ( data ) {
        if ( typeof data != "object" ) {
            return null;
        }

        stack = [];counter = 0;

        // TODO: add support for more than one level.
        for ( key in data ) {
            stack[counter] = encodeURIComponent( key ) + "=" + ( data[key] ? encodeURIComponent( data[key] ) : "" );
            counter++;
        }

        return stack.join( "&" );
    }
};