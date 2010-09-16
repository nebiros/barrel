Titanium.include( "../models/product.js" );
Titanium.include( "../models/notice.js" );

var win = Titanium.UI.currentWindow;
_loadProducts( win );

function _loadProducts( win ) {
    // get prducts with most users added.
    var product = new Product( CONFIG.APP, CONFIG.KEY );
    product.list( function () {
        var response = eval( "(" + this.responseText + ")" );
        Ti.API.debug( response );
        var products = response["products"];
        Ti.API.debug( products );
        var data = [];

        for ( var item in products ) ( function ( item ) {
            var row = Titanium.UI.createTableViewRow( {
                height: 80,
                className: "datarow",
                backgroundColor: "#2E2E2E"
            } );

            var productDataView = Titanium.UI.createView( {
                height: 80,
                width: "auto"
            } );

            var _openProductUrl = function ( e ) {
                Titanium.Platform.openURL( products[item].short_url );
            }

            productDataView.addEventListener( "click", _openProductUrl );

            var image = Titanium.UI.createImageView( {
                image: products[item].imagen,
                top: 17,
                left: 10,
                width: 48,
                height: 48,
                clickName: "image"
            } );

            productDataView.add( image );

            var name = Titanium.UI.createLabel( {
                text: products[item].nombre_producto,
                font: {fontSize: 12, fontWeight: "bold"},
                textAlign: "left",
                left: 70,
                top: 5,
                height: 30,
                width: 200
            } );

            productDataView.add( name );

            var users = Titanium.UI.createLabel( {
                text: "\\\\ usuarios \\\\ " + products[item].usuarios,
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
                text: "\\\\ precio actual \\\\ " + Barrel.Text.numberFormat( products[item].precio_actual, 0, "", "." ),
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
                image: "../../images/icons/11-clock.png",
                top: 35,
                right: 5,
                width: 16,
                height: 16,
                canScale: true
            } );

            var _openNotificationDialog = function ( e ) {
                var confirmation = Titanium.UI.createAlertDialog( {
                    title: "Notificación",
                    message: "Notificar sobre el precio de este producto?",
                    buttonNames: ["Si", "No"],
                    cancel: 1
                } );

                confirmation.addEventListener( "click", function ( e ) {
                    switch ( parseInt( e.index ) ) {
                        case 0:
                            var notice = new Notice();

                            if ( notice.exist( products[item].id_producto ) ) {
                                var alert = Barrel.UI.alert( "Este producto ya existe en la lista de notificaciones" );
                                alert.show();
                                return;
                            }

                            notice.save( {
                                productId: products[item].id_producto,
                                name: products[item].nombre_producto,
                                price: products[item].precio_actual,
                                image: products[item].imagen,
                                users: products[item].usuarios,
                                url: products[item].short_url
                            } );

                            notice.close();
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
            data.push( row );
        } )( item );

        var tableView = Titanium.UI.createTableView( {data: data} );

        // add the table view to the window.
        win.add( tableView );

        // close status indicator.
        if ( this.DONE == this.readyState ) {
            this.statusIndicator.hide();
        }
    }, {orderBy: "usuarios DESC", imageWidth: 48} );
}
