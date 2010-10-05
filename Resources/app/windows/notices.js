Titanium.include( "../models/notice.js" );
Titanium.include( "../models/product.js" );
Titanium.include( "../helpers/bottom_menu.js" );

var win = Titanium.UI.currentWindow;
var tableView, listeners = [];

function main() {
    // HACK: get active tab index.
    win.tabGroup.addEventListener( "focus", function( e ) {
        setTimeout( function() {
            if ( 1 === win.tabGroup.activeTab ) {
                _loadNotices();
            }
        }, 100 );
    } );
    
    _loadNotices();
    _buildMenu();
}

function _loadNotices() {
    var indicator = Barrel.UI.statusInidicator();
    indicator.show();

    var notice = new Notice();
    var notices = notice.list();
    notice.close();
    Ti.API.debug( "notices length: " + notices.length );

    if ( 0 == notices.length ) {
        win.remove( tableView );

        var row = Titanium.UI.createTableViewRow( {
            height: 80,
            className: "row"
        } );

        var label = Titanium.UI.createLabel( {
            text: "\\\\ no existe ningún producto para realizar notificaciones! \\\\",
            font: {fontSize: 10, fontWeight: "bold"},
            color: "#ffffff",
            textAlign: "left",
            width: "auto"
        } );
        
        row.add( label );
        tableView = Titanium.UI.createTableView();
        tableView.data = [];
        tableView.setData( [row] );
        win.add( tableView );
        indicator.hide();
        notice.close();

        Titanium.App.Properties.setBool( "noNotices", true );
        // go away!.
        return;
    }

    var data = _buildTable( notices );

    win.remove( tableView );
    tableView = Titanium.UI.createTableView();
    tableView.data = [];
    tableView.setData( data );
    win.add( tableView );
    indicator.hide();
}

function _buildTable( notices ) {
    if ( typeof notices != "object" ) {
        alert( "notices must be an object" );
        return [];
    }

    var data = [];

    for ( var key = 0; key < notices.length; key++ ) ( function ( key ) {
        if ( listeners[key] ) {
            clearInterval( listeners[key] ); // clear listener
        }
        
        var row = Titanium.UI.createTableViewRow( {
            height: 80
        } );

        var productDataView = Titanium.UI.createView( {
            height: 80,
            width: "auto"
        } );

        var _openProductUrl = function ( e ) {
            Titanium.Platform.openURL( notices[key].url );
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
            text: "\\\\ precio actual \\\\ $" + Barrel.Text.numberFormat( notices[key].price, 0, "", "." ),
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
            image: "../../images/icons/22-skull-n-crossbones-white.png",
            top: 25,
            right: 5,
            width: 32,
            height: 32,
            canScale: false
        } );

        var _removeNotification = function ( e ) {
            var confirmation = Titanium.UI.createAlertDialog( {
                title: "alerta!",
                message: "desea borrar este producto de las notificaciones de precios?",
                buttonNames: ["si", "no"],
                cancel: 1
            } );

            confirmation.addEventListener( "click", function ( e ) {
                switch ( parseInt( e.index ) ) {
                    case 0:
                        var notice = new Notice();
                        notice.destroy( notices[key].id );
                        notice.close();
                        
                        _loadNotices();
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
        row.className = "item" + key;
        data[key] = row;

        listeners[key] = setInterval( function () {
            _askPrice( notices[key] );
        }, CONFIG.NOTICES_INTERVAL );
    } )( key );

    return data;
}

function _askPrice( data ) {
    if ( typeof data != "object" ) {
        alert( "data must be an object" );
        return;
    }

    Ti.API.debug( "asking price: " + data.name + " -- " + data.price );

    var product = new Product();
    product.list( function () {
        if ( 200 == this.status ) {
            var response = eval( "(" + this.responseText + ")" );
            var productData = response["products"][0];
            
            Ti.API.debug( "asking price kactoos: " + data.name + " -- " + productData.precio_actual );
            Ti.API.debug( productData );

            if ( productData.precio_actual != data.price ) {
                var notice = new Notice();
                notice.update( {price: productData.precio_actual, users: productData.usuarios}, {"id = ?": data.id} );
                notice.close();
                
                var notification = Barrel.UI.notification( data.name + " cambio de precio!, $" + Barrel.Text.numberFormat( productData.precio_actual, 0, "", "." ) );
                notification.show();
                
                _loadNotices();
            }
        }
    }, {idProduct: data.product_id, limit: 1} );
}

function _buildMenu() {
    var menu = Titanium.UI.Android.OptionMenu.createMenu();

    var refreshItem = Titanium.UI.Android.OptionMenu.createMenuItem( {
        title : "actualizar",
        icon: "/images/icons/01-refresh.png"
    } );

    refreshItem.addEventListener( "click", _refreshMenu );
    menu.add( refreshItem );

    Titanium.UI.Android.OptionMenu.setMenu( menu );
}

function _refreshMenu() {
    var notice = new Notice();
    var notices = notice.list();
    notice.close();
    
    var product = new Product();

    Ti.API.debug( "notices length refresh: " + notices.length );

    // can't get multiple products at once :\.
    for ( var key = 0; key < notices.length; key++ ) ( function ( key ) {
        clearInterval( listeners[key] ); // clear listener
        
        product.list( function () {
            if ( 200 == this.status ) {
                var response = eval( "(" + this.responseText + ")" );
                var productData = response["products"][0];

                Ti.API.debug( "producy refresh data: " + notices[key].name + " -- " + notices[key].price );

                var notice = new Notice();

                // if this product is not active then don't draw it.
                if ( 1 != parseInt( productData.activo ) ) {
                    notice.destroy( notices[key].id );
                    tableView.deleteRow( key, {animationStyle: Titanium.UI.iPhone.RowAnimationStyle.UP} );

                    var notification = Barrel.UI.notification( notices[key].name + " parece que ya no está activo :(" );
                    notification.show();

                    return;
                }

                if ( productData.precio_actual || productData.usuarios ) {
                    notice.update( {price: productData.precio_actual, users: productData.usuarios}, {"id = ?": notices[key].id} );
                }
                
                notice.close();
            }
        }, {idProduct: notices[key].product_id, limit: 1} );
    } )( key );

    // delay two secs to update the table, cause kactoos api doesn't have a method
    // to get data for multiple products at once.
    setTimeout( function () {
        _loadNotices();
    }, 2000 );
}

main();