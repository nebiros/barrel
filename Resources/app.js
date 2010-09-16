// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor( "#000" );

// create tab group
var tabGroup = Titanium.UI.createTabGroup( { 
    barColor: "#336699"
} );

//tabGroup.fireEvent( "reloadUsers", {} );
//tabGroup.fireEvent( "reloadNotices", {} );

// create base UI tab and root window
var usersWindow = Titanium.UI.createWindow( {
    url: "app/windows/top_users.js",
    title: "+ Usuarios"
} );

// focus/blur doesn't work for android (http://j.mp/9DDgdL), so I just add the
// tabgroup object to each window tab and then in the sub-context I'm asking
// for the activeTab to refresh the window content.
usersWindow.tabGroup = tabGroup;

var usersTab = Titanium.UI.createTab( {
    title: "+ Usuarios",
    icon: "images/icons/28-star.png",
    window: usersWindow
} );

var noticesWindow = Titanium.UI.createWindow( {
    url: "app/windows/notices.js",
    title: "Notificaciones"
} );

noticesWindow.tabGroup = tabGroup;

var noticesTab = Titanium.UI.createTab( {
    title: "Notificaciones",
    icon: "images/icons/11-clock.png",
    window: noticesWindow
} );

//  add tabs
tabGroup.addTab( usersTab );
tabGroup.addTab( noticesTab );

//tabGroup.addEventListener( "focus", function ( e ) {
////    Ti.API.debug( "tabGroup focus!" );
////    Ti.API.debug( "tabGroup active: " + this.activeTab );
//    Ti.API.debug( "tabGroup index: " + e.index );
////    Ti.API.debug( "tabGroup previousIndex: " + e.previousIndex );
////    Ti.API.debug( "tabGroup previousTab: " + e.previousTab );
////    Ti.API.debug( "tabGroup tab: " + e.tab );
//
//    // seems like there's a bug with tabs here.
//    switch ( e.index ) {
//        case 0: // notices tab.
//            Titanium.App.Properties.setBool( "reloadNotices", true );
//            break;
//
//        case 1: // users tab.
//            Titanium.App.Properties.setBool( "reloadUsers", true );
//            break;
//    }
//} );

// open tab group.
tabGroup.open();

//tabGroup.addEventListener( 'focus', function( e ) {
//    setTimeout( function() {
//        Ti.API.debug( 'tab changed to ' + tabGroup.activeTab );
//    }, 100 );
//} );