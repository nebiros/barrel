Titanium.include( "../models/notice.js" );

var win = Titanium.UI.currentWindow;

// HACKKKKKKK!!!
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
//Ti.API.debug(notices);
Ti.API.debug(notices.length);

    var tableView = Titanium.UI.createTableView();

    if ( 0 == notices.length ) {
        win.remove( tableView );

        var row = Titanium.UI.createTableViewRow( {
            height: 80,
            className: "datarow",
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

    for ( var key in notices ) ( function ( key ) {
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
        data.push( row );
    } )( key );

    notice.close();

    // add the table view to the window.
    tableView.data = data;
    win.add( tableView );
    indicator.hide();
}