Titanium.include( "../models/product.js" );
Titanium.include( "../models/notice.js" );

var win = Titanium.UI.currentWindow;
var tableView;

function main() {    
    _search();
    _loadProducts();
    _buildMenu();
}

function _search() {
    var search = Titanium.UI.createSearchBar( {
        barColor: "#000",
        showCancel: true,
        height: 43,
        top: 0,
        hintText: "buscar un producto..."
    } );

    search.addEventListener( "return", function ( e ) {
        this.blur();

        var product = new Product();
        product.list( function () {
                this.statusIndicator.show();

                if ( 200 == this.status ) {
                    var response = eval( "(" + this.responseText + ")" );
                    var products = response["products"];
                    Ti.API.debug( "search products length: " + products.length );
                    
                    var data = _buildTable( products );

                    if ( data.length > 0 ) {
                        win.remove( tableView );
                        tableView = Titanium.UI.createTableView( {top: 40} );
                        tableView.setData( data );
                        // add the table view to the window.
                        win.add( tableView );
                    } else {
                        var notification = Barrel.UI.notification( ":(, no se encontro ningún producto" );
                        notification.show();
                    }
                }

                if ( this.DONE == this.readyState ) {
                    this.statusIndicator.hide();
                }
            }, {
                orderBy: "usuarios DESC",
                imageWidth: 48,
                search: e.value
        } );
    } );

    win.add( search );
}

function _loadProducts() {
    var product = new Product();
    
    product.list( function () {
        // open status indicator.       
        this.statusIndicator.show();        

        // if response is ok!.
        if ( 200 == this.status ) {
            var response = eval( "(" + this.responseText + ")" );
            var products = response["products"];
            Ti.API.debug( "products length: " + products.length );
            
            var data = _buildTable( products );

            if ( data.length > 0 ) {
                tableView = Titanium.UI.createTableView( {top: 40} );
                tableView.setData( data );
                // add the table view to the window.
                win.add( tableView );
            } else {
                win.remove( tableView );

                var row = Titanium.UI.createTableViewRow( {
                    height: 80,
                    className: "row"
                } );

                var label = Titanium.UI.createLabel( {
                    text: "\\\\ no hay ningún producto :\\ \\\\",
                    font: {fontSize: 10, fontWeight: "bold"},
                    color: "#ffffff",
                    textAlign: "left",
                    width: "auto"
                } );

                row.add( label );
                tableView = Titanium.UI.createTableView();
                tableView.setData( [row] );
                win.add( tableView );
            }
        }

        // close status indicator.
        if ( this.DONE == this.readyState ) {
            this.statusIndicator.hide();
        }
    }, {
        orderBy: "usuarios DESC",
        imageWidth: 48
    } );
}

function _buildTable( products ) {
    if ( typeof products != "object" ) {
        alert( "products must be an object" );
        return [];
    }

    var data = [];

    for ( var key = 0; key < products.length; key++ ) ( function ( key ) {
        var row = Titanium.UI.createTableViewRow( {
            height: 80,
            className: "row"
        } );

        var productDataView = Titanium.UI.createView( {
            height: 80,
            width: "auto"
        } );
        
        var imagen = products[key].imagen;
        var nombreProducto = products[key].nombre_producto;
        var usuarios = products[key].usuarios || 0;
        var precioActual = products[key].precio_actual;
        var idProducto = products[key].id_producto;
        var url = products[key].short_url || Barrel.BASE_URI + "/oferta/" + idProducto;

        var _openProductUrl = function ( e ) {
            Titanium.Platform.openURL( url );
        }

        Ti.API.debug( "id: " + idProducto + " -- " + nombreProducto + " -- " + url );

        productDataView.addEventListener( "click", _openProductUrl );

        var productImage = Titanium.UI.createImageView( {
            image: imagen,
            top: 17,
            left: 10,
            width: 48,
            height: 48
        } );

        productDataView.add( productImage );

        var name = Titanium.UI.createLabel( {
            text: nombreProducto,
            font: {fontSize: 12, fontWeight: "bold"},
            textAlign: "left",
            left: 70,
            top: 5,
            height: 30,
            width: 200
        } );

        productDataView.add( name );

        var users = Titanium.UI.createLabel( {
            text: "\\\\ usuarios \\\\ " + usuarios,
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
            text: "\\\\ precio actual \\\\ $" + Barrel.Text.numberFormat( precioActual, 0, "", "." ),
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

        var notificationIcon = Titanium.UI.createImageView( {
            image: "../../images/icons/11-clock-white.png",
            top: 25,
            right: 5,
            width: 32,
            height: 32,
            canScale: false
        } );

        var _openNotificationDialog = function ( e ) {
            var confirmation = Titanium.UI.createAlertDialog( {
                title: "notificación",
                message: "desea que se le notifique sobre el precio de este producto?",
                buttonNames: ["si", "no"],
                cancel: 1
            } );

            confirmation.addEventListener( "click", function ( e ) {
                switch ( parseInt( e.index ) ) {
                    case 0:
                        var notice = new Notice();

                        if ( notice.exist( idProducto ) ) {
                            var alert = Barrel.UI.alert( "este producto ya existe en la lista de notificaciones!" );
                            alert.show();
                            return;
                        }

                        notice.add( {
                            productId: idProducto,
                            name: nombreProducto,
                            price: precioActual,
                            image: imagen,
                            users: usuarios,
                            url: url
                        } );

                        notice.close();

                        var notification = Barrel.UI.notification( "ok, :)" );
                        notification.show();
                        break;

                    case 1:
                        this.hide();
                        break;
                }
            } );

            confirmation.show();
        };

        notificationIcon.addEventListener( "click", _openNotificationDialog );
        row.add( notificationIcon );
        row.className = "item" + key;
        data[key] = row;
    } )( key );

    return data;
}

function _buildMenu() {
    var menu = Titanium.UI.Android.OptionMenu.createMenu();

    var refreshItem = Titanium.UI.Android.OptionMenu.createMenuItem( {
        title : "actualizar",
        icon: "/images/icons/01-refresh.png"
    } );

    refreshItem.addEventListener( "click", _loadProducts );
    menu.add( refreshItem );

    Titanium.UI.Android.OptionMenu.setMenu( menu );
}

main();