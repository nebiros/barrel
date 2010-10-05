Titanium.include( "../../barrel.js" );

function Notice( app, key ) {
    this.app = app || CONFIG.APP;
    this.key = key || CONFIG.KEY;

    this.dbname = "barrel.db"; // set db filename.
    this.table = "notification";

    this.create();
}

Notice.prototype = new Barrel.DB(); // inheritance from Barrel.DB.
Notice.prototype.constructor = Notice; // set constructor.

Notice.prototype.create = function () {
    try {
        Barrel.DB.prototype.create.call( this, this.table, ["id INTEGER PRIMARY KEY AUTOINCREMENT", "product_id INTEGER", "name TEXT", "price NUMERIC", "image TEXT", "users NUMERIC", "url TEXT"] );
    } catch ( e ) {
        alert( e );
        throw e;
    }
}

Notice.prototype.save = function ( data ) {
    if ( typeof data == "undefined" ) {
        throw "data can't be empty";
    } else if ( typeof data != "object" ) {
        throw "data must be an object";
    }

    try {        
        this.insert( this.table, data );
        var id = this.lastInsertId();
        Ti.API.debug( "id: " + id );
    } catch ( e ) {
        alert( e );
        throw e;
    }

    return id;
}

Notice.prototype.exists = function ( productId ) {
    productId = parseInt( productId );

    try {
        var rs = this.execute( "SELECT " + this.table + ".id FROM notification WHERE " + this.table + ".product_id = ?", [productId] );

        if ( rs.isValidRow() && rs.fieldByName( "id" ) > 0 ) {
            return true;
        }

        rs.close();
    } catch ( e ) {
        alert( e );
        throw e;
    }

    return false;
}

// TODO: implement options object.
Notice.prototype.list = function ( opts ) {
    if ( typeof opts == "undefined" ) {
        opts = {};
    }

    var data = [];

    try {
        var rs = this.execute( "SELECT notification.* FROM notification" );
        data = this.fetchAll( rs );
        rs.close();
    } catch ( e ) {
        alert( e );
        throw e;
    }

    return data;
}

Notice.prototype.destroy = function ( id ) { // override method.
    id = parseInt( id );

    try {
        Barrel.DB.prototype.destroy.call( this, this.table, {"id = ?": id} ); // call super.
    } catch ( e ) {
        alert( e );
        throw e;
    }
}

Notice.prototype.update = function ( data, where ) {
    try {
        Barrel.DB.prototype.update.call( this, this.table, data, where );
    } catch ( e ) {
        alert( e );
        throw e;
    }
}
