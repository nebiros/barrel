Titanium.include( "../../barrel.js" );

Notice = function ( app, key ) {
    var a = app || CONFIG.APP;
    var k = key || CONFIG.KEY;

    var db = Titanium.Database.open( "barrel.db" );

    function _createTable() {
        db.execute( "CREATE TABLE IF NOT EXISTS notification (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, name TEXT, price NUMERIC, image TEXT, users NUMERIC, url TEXT)" );
    }

    _createTable();

    return {
        save: function ( opts ) {
            if ( typeof opts == "undefined" ) {
                throw "opts can't be empty";
            } else if ( typeof opts != "object" ) {
                throw "opts must be an object";
            }

            try {
                db.execute( "INSERT INTO notification (id, product_id, name, price, image, users, url) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    null,
                    opts["productId"],
                    opts["name"],
                    opts["price"],
                    opts["image"],
                    opts["users"],
                    opts["url"]
                );
            } catch ( e ) {
                throw e;
            }

            return db.lastInsertRowId;
        },
        exist: function ( productId ) {
            productId = parseInt( productId );

            try {
                var row = db.execute( "SELECT notification.id FROM notification WHERE notification.product_id = ?", productId );

                if ( row.isValidRow() && row.fieldByName( "id" ) > 0 ) {
                    return true;
                }
            } catch ( e ) {
                throw e;
            }

            return false;
        },
        close: function () { db.close(); },
        // TODO: implement options object.
        list: function ( opts ) {
            if ( typeof opts == "undefined" ) {
                opts = {};
            }

            var data = [];

            try {
                var rows = db.execute( "SELECT notification.* FROM notification" );

                while ( rows.isValidRow() ) {
                    data.push( {
                        id: rows.fieldByName( "id" ),
                        productId: rows.fieldByName( "product_id" ),
                        name: rows.fieldByName( "name" ),
                        price: rows.fieldByName( "price" ),
                        image: rows.fieldByName( "image" ),
                        users: rows.fieldByName( "users" ),
                        url: rows.fieldByName( "url" )
                    } );

                    rows.next();
                }
            } catch ( e ) {
                throw e;
            }
            
            return data;
        }
    };
};
