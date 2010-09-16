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

// open tab group.
tabGroup.open();
