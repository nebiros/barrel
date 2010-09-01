// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor( '#000' );

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

// create base UI tab and root window
var usersWindow = Titanium.UI.createWindow( {
    backgroundColor: '#fff',
    url: 'kactoos/top_users.js'
} );

var usersTab = Titanium.UI.createTab( {
    title: '+ Usarios',
    icon: 'images/tabs/KS_nav_views.png',    
    window: usersWindow
} );

//var usersLabel = Titanium.UI.createLabel( {
//    color: '#999',
//	text: '+ Usuarios',
//	font: { fontSize: 20, fontFamily: 'Helvetica Neue' },
//	textAlign: 'center',
//	width: 'auto'
//} );
//
//usersWindow.add( usersLabel );

//
// create controls tab and root window
//
//var win2 = Titanium.UI.createWindow({
//    title:'Tab 2',
//    backgroundColor:'#fff'
//});
//var tab2 = Titanium.UI.createTab({
//    icon:'images/tabs/KS_nav_ui.png',
//    title:'Tab 2',
//    window:win2
//});
//
//var label2 = Titanium.UI.createLabel({
//	color:'#999',
//	text:'I am Window 2',
//	font:{fontSize:20,fontFamily:'Helvetica Neue'},
//	textAlign:'center',
//	width:'auto'
//});
//
//win2.add(label2);



//
//  add tabs
//
tabGroup.addTab( usersTab );
//tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();
