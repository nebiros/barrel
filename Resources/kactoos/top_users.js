// include kactoos wrapper.
Titanium.include( "../kactoos.js" );

var win = Titanium.UI.currentWindow;

var product = new Kactoos.Product( "<APPNAME>", "<APIKEY>" );
product.list( function () {
    var data = eval( "(" + this.responseText + ")" );
Ti.API.info(data);
    var products = data["products"];
    var rowData = [];

    for ( item in products ) {
        var row = Titanium.UI.createTableViewRow( { height: "auto" } );
        var productView = Titanium.UI.createView( { height: "auto", layout: "vertical", top: 5, right: 5, bottom: 5, left: 5 } );

        var productId = Titanium.UI.createLabel( {
            text: products[item].id_producto,
            font: { fontSize: 16, fontWeight: "bold" },
            width: "auto",
            textAlign: "left",
            top: 2,
            left: 40,
            height: 16
        } );

        var name = Titanium.UI.createLabel( {
            text: products[item].nombre_producto,
            font: { fontSize: 12, fontWeight: "bold" },
            width: "auto",
            textAlign: "left",
            bottom: 0,
            left: 60,
            height: 12
        } );

        productView.add( productId );
        productView.add( name );

        row.add( productView );
        row.className = "product";

        rowData.push( row );
    }

    // Create the table view and set its data source to "rowData" array
    var tableView = Titanium.UI.createTableView( { data : rowData } );

    //Add the table view to the window
    win.add( tableView );
} );