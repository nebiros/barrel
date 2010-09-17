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
        add: function ( data ) {
            if ( typeof data == "undefined" ) {
                throw "data can't be empty";
            } else if ( typeof data != "object" ) {
                throw "data must be an object";
            }

            try {
                db.execute( "INSERT INTO notification (id, product_id, name, price, image, users, url) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    null,
                    data["productId"],
                    data["name"],
                    data["price"],
                    data["image"],
                    data["users"],
                    data["url"]
                );
            } catch ( e ) {
                alert( e );
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
                alert( e );
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
                alert( e );
            }
            
            return data;
        },
        remove: function ( id ) {
            id = parseInt( id );

            try {
                db.execute( "DELETE FROM notification WHERE notification.id = ?", id );
            } catch ( e ) {
                alert( e );
            }
        },
        // TODO: I'll make a class with all db crud methods, and implement
        // a .extends to extend an object from another.
        updatePrice: function ( id, price ) {
            id = parseInt( id );
            price = parseInt( price );

            try {
                db.execute( "UPDATE notification SET price = ?", price );
            } catch ( e ) {
                alert( e );
            }
        }
    };
};
