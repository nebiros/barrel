Titanium.include( "../models/notice.js" );
Titanium.include( "../models/product.js" );

var win = Titanium.UI.currentWindow;

// HACK: get active tab index.
win.tabGroup.addEventListener( "focus", function( e ) {
    setTimeout( function() {
        if ( 1 === win.tabGroup.activeTab ) {
            _loadNotices( win );
        }
    }, 100 );
} );

_loadNotices( win );

function _loadNotices( win ) {
    var indicator = Barrel.UI.statusInidicator();
    indicator.show();

    var notice = new Notice();
    var notices = notice.list();
    Ti.API.debug( "notices length: " + notices.length );

    var tableView = Titanium.UI.createTableView();

    if ( 0 == notices.length ) {
        win.remove( tableView );

        var row = Titanium.UI.createTableViewRow( {
            height: 80,
            className: "row",
            backgroundColor: "#2E2E2E"
        } );

        var label = Titanium.UI.createLabel( {
            text: "\\\\ no existe ningún producto para realizar notificaciones! \\\\",
            font: {fontSize: 10, fontWeight: "bold"},
            color: "#ffffff",
            textAlign: "left",
            width: "auto"
        } );
        
        row.add( label );
        tableView.data = [row];
        win.add( tableView );
        indicator.hide();
        // go away!.
        return;
    }

    // remove no notices label.
    win.remove( tableView );
    
    var data = [];

    for ( var key = 0; key < notices.length; key++ ) ( function ( key ) {
        var product = new Product();
        // get product data to look if still is active, if not, drop it, if is active
        // we going to create a listener to check his price.
        product.list( function () {
            if ( 200 == this.status ) {
                var response = eval( "(" + this.responseText + ")" );
                var productData = response["products"][0];

                // if this product is not active the don't draw it.
                if ( 1 != parseInt( productData.activo ) ) {
                    var notice = new Notice();
                    notice.remove( notices[key].id );
                    notice.close();
                    return;
                }

                var row = Titanium.UI.createTableViewRow( {
                    height: 80,
                    className: "row",
                    backgroundColor: "#2E2E2E"
                } );

                var productDataView = Titanium.UI.createView( {
                    height: 80,
                    width: "auto"
                } );

                var _openProductUrl = function ( e ) {
                    Titanium.Platform.openURL( notices[key].short_url );
                }

                productDataView.addEventListener( "click", _openProductUrl );

                var image = Titanium.UI.createImageView( {
                    image: notices[key].image,
                    top: 17,
                    left: 10,
                    width: 48,
                    height: 48
                } );

                productDataView.add( image );

                var name = Titanium.UI.createLabel( {
                    text: notices[key].name,
                    font: {fontSize: 12, fontWeight: "bold"},
                    textAlign: "left",
                    left: 70,
                    top: 5,
                    height: 30,
                    width: 200
                } );

                productDataView.add( name );

                var users = Titanium.UI.createLabel( {
                    text: "\\\\ usuarios \\\\ " + notices[key].users,
                    font: {fontSize: 10, fontWeight: "bold"},
                    color: "#ffffff",
                    textAlign: "left",
                    left: 70,
                    top: 35,
                    height: 20,
                    width: 200
                } );

                productDataView.add( users );

                var price = Titanium.UI.createLabel( {
                    text: "\\\\ precio actual \\\\ " + Barrel.Text.numberFormat( notices[key].price, 0, "", "." ),
                    font: {fontSize: 10, fontWeight: "bold"},
                    color: "#ffffff",
                    textAlign: "left",
                    left: 70,
                    top: 50,
                    height: 20,
                    width: 200
                } );

                productDataView.add( price );
                row.add( productDataView );

                var skullIcon = Titanium.UI.createImageView( {
                    image: "../../images/icons/22-skull-n-crossbones.png",
                    top: 35,
                    right: 5,
                    width: 16,
                    height: 16,
                    canScale: true
                } );

                var _removeNotification = function ( e ) {
                    var confirmation = Titanium.UI.createAlertDialog( {
                        title: "Notificación",
                        message: "Desea borrar este producto de las notificaciones de precios?",
                        buttonNames: ["Si", "No"],
                        cancel: 1
                    } );

                    confirmation.addEventListener( "click", function ( e ) {
                        switch ( parseInt( e.index ) ) {
                            case 0:
                                var notice = new Notice();
                                notice.remove( notices[key].id );
                                notice.close();

                                _loadNotices( win );
                                break;

                            case 1:
                                this.hide();
                                break;
                        }
                    } );

                    confirmation.show();
                }

                skullIcon.addEventListener( "click", _removeNotification );
                row.add( skullIcon );
                data[key] = row;

                setInterval( function () {
                    _askPrice( productData );
                }, CONFIG.NOTICES_INTERVAL );
            }
        }, {idProduct: notices[key].productId, limit: 1} );
    } )( key );

    notice.close();

    // HACK: delay this process to draw rows into the view, why? because the kactoos
    // API doesn't sopport get multiple products usinf product ids.
    setTimeout( function() {
        // add the table view to the window.
        tableView.setData( data );
        win.add( tableView );
        indicator.hide();
    }, 2000 );
}

function _askPrice( data ) {
    if ( typeof data != "object" ) {
        alert( "data must be an object" );
        return;
    }

    var product = new Product();
    product.list( function () {
        if ( 200 == this.status ) {
            var response = eval( "(" + this.responseText + ")" );
            var productData = response["products"][0];

            if ( productData.precio_actual < data.price ) {
                var notice = new Notice();
                notice.updatePrice( data.id, productData.precio_actual );
                notice.close();

                var notification = Ti.UI.createNotification( {
                    message: data.name + " cambio de precio!, " + Barrel.Text.numberFormat( productData.precio_actual, 0, "", "." )
                } );
                
                notification.show();
                _loadNotices( win );
            }
        }
    }, {idProduct: data.productId, limit: 1} );
}