Titanium.UI.setBackgroundColor('#000');

var win = Ti.UI.createWindow({
	backgroundColor : '#FFF',
	title : '',
	exitOnClose: true
});

var CloudPush = require('ti.cloudpush');

CloudPush.debug = true;
CloudPush.enabled = true;
CloudPush.showTrayNotificationsWhenFocused = true;
CloudPush.focusAppOnPush = false;

var Cloud = require('ti.cloud');
Cloud.debug = true;

var USER_ID = 'ACS app USER_ID';
var USERNAME = '_USERNAME';
var PASSWORD = '_PASSWORD';
var CHANNEL = '_CHANNEL';
var SITE = "_SITE";
var INFO = "_INFO";
var LICENSE = "Licenza: AGPLv3 www.gnu.org/licenses/agpl-3.0.html";
var DEVELOPED_BY = "_DEVELOPED_BY";

var	textredirect_left,redirectimageview_left;

/**
 * Button to subscribe to site notification and subscription status
 * label 
 */
var submit_container = Ti.UI.createView({
    backgroundColor:'#FFFFFF',
   	height : '60dp',
	width : '100dp',
	right : '0dp',
	top : '0dp',
});

var submit = Ti.UI.createButton({
	backgroundColor:'#3385FF',
	font: { fontSize:25 },
	borderRadius : 15,
	height : '30dp',
	width : '75dp',
	title : 'ISCRIVIMI'
});

submit_container.add(submit);
	
submit.addEventListener('click', function(e) {
	loginDefault();
});


var body = Ti.UI.createView({
    backgroundColor:'#FFFFFF',
    height: '60dp',
    width : Titanium.Platform.displayCaps.platformWidth - 100,
    left : '0dp',
    layout: 'horizontal',
    top : '0dp'
});
var label = Ti.UI.createLabel({
    color: '#000000',
    font: { fontSize:26 },
    height: '60dp',
    left: '10dp',
    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
});

body.add( label );
win.add( body );

if(!Ti.App.Properties.getBool("isSubscribed")){
	
	win.add( submit_container );
	label.html ='Benvenuto! <br> Ora NON ricevi le notifiche da ____';
} else{
	
	body.width = Titanium.Platform.displayCaps.platformWidth; 	
	label.html = 'Benvenuto! <br> Ora ricevi le notifiche da ____';
}

/**
 * Button and text for redirect notifications 
 */

var textredirect = Ti.UI.createButton({
	backgroundColor:'#FFFFFF',
	height : '120dp',
	width : '200dp',
	top : '120dp',
	borderColor : '#333333' ,
	borderWidth : '1dp',
	title : 'Vai al portale __SITO__',
	color : '#E65C00',
	font: { fontSize:42 },
});

win.add(textredirect);

textredirect_left = textredirect.getLeft();


textredirect.addEventListener('click', function(e) {
	Ti.Platform.openURL(SITE);
});


var redirectimageview = Ti.UI.createImageView();
redirectimageview.image = '__IMAGE__';
redirectimageview.width = '200dp';
redirectimageview.height = '150dp';
redirectimageview.top = '240dp';
redirectimageview.touchEnabled = true;

win.add(redirectimageview);

redirectimageview_left = redirectimageview.getLeft();

redirectimageview.addEventListener('click', function(e) {
	Ti.Platform.openURL(SITE);
});

/**
 * Menu:
 *  unsubscribe
 * 	information
 *  back 
 *  close
 */
var activity = win.activity;

activity.onCreateOptionsMenu = function(e) {
	
    var menu = e.menu;
     
    var unsubscribe = menu.add({
        title : "Non desidero più ricevere notifiche da ____",
        showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
    });
    
	
	unsubscribe.addEventListener("click", function(e) {
		loginDefault();
	});
	if (!Ti.App.Properties.getBool("isSubscribed")) 
		unsubscribe.enabled = false;
		
    var back = menu.add({
        title : "Indietro",
        showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
    });
    back.addEventListener("click", function(e) {
        menu.close();
    });
    var close = menu.add({
        title : "Chiudi",
        showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
    });
    close.addEventListener("click", function(e) {
        win.close();
    });
    
    var info = menu.add({
		title : "Informazioni",
		showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
	});
	info.addEventListener("click", function(e) {
	    var dialog = Ti.UI.createAlertDialog({
			cancel: 0,
			ok: 'Chiudi',
			message: INFO + "\n\n" + LICENSE + "\n\n" + DEVELOPED_BY,
			title: 'Informazioni'
		});
		dialog.show();
    });   
};  

activity.onPrepareOptionsMenu = function(e){
	
	var menu = e.menu;
	
	var unsubscribe = menu.getItem(0);
	
	if (Ti.App.Properties.getBool("isSubscribed"))
		unsubscribe.enabled = true;
	else
		unsubscribe.enabled = false;
	
};


/**
 * Login to ACS cloud, then call the subscribing method
 * 
 * @param {Object} e event
 */
function loginDefault(e) {
	var deviceToken;
	CloudPush.retrieveDeviceToken({
		success : function deviceTokenSuccess(ev) {
			deviceToken = ev.deviceToken;
			Ti.API.info('Device Token: ' + ev.deviceToken);
			
				Cloud.Users.login({
					login : USERNAME,
					password : PASSWORD
				}, function(e) {
					if (e.success) {
						if (!Ti.App.Properties.getBool("isSubscribed"))
							defaultSubscribe(deviceToken);
						else
							defaultUnsubscribe(deviceToken);
					} else {
						var dialog = Ti.UI.createAlertDialog({
  						message: 'Verifica che il device sia connesso a internet.',
    					ok: 'Ok',
    					title: 'Errore'
  						});
  						dialog.show();
					}
				});	
		},
		error : function deviceTokenError(ev) {
			var dialog = Ti.UI.createAlertDialog({
				message: 'Verifica che il device sia connesso a internet.',
				ok: 'Ok',
				title: 'Errore'
			});
			dialog.show();
		}
	});
	

}

/**
 * Subscribe token
 */
function defaultSubscribe(deviceToken) {
	Cloud.PushNotifications.subscribe({
		channel : CHANNEL,
		device_token : deviceToken,
		type : 'android'
	}, function(e) {
		if (e.success) {
			var dialog = Ti.UI.createAlertDialog({
  				message: 'Ora sei iscritto al servizio di notifica di ____',
    			ok: 'Ok',
    			title: 'Complimenti!'
  			});
  			dialog.show();
  
 			Ti.App.Properties.setBool("isSubscribed",true);
			win.remove(submit_container);
			body.width = Titanium.Platform.displayCaps.platformWidth; 	
			label.html = 'Benvenuto! <br> Ora ricevi le notifiche da ____';

		} else {
			var dialog = Ti.UI.createAlertDialog({
				message: 'Verifica che il device sia connesso a internet.',
				ok: 'Ok',
				title: 'Errore'
			});
			dialog.show();
		}
	});
}

/**
 * Unsubscribe token
 */
function defaultUnsubscribe(deviceToken) {
	Cloud.PushNotifications.unsubscribe({
		channel : CHANNEL,
		device_token : deviceToken
	}, function(e) {
		if (e.success) {
			var dialog = Ti.UI.createAlertDialog({
  				message: 'Sei stato cancellato dal servizio di notifica di ____. Speriamo di rivederti presto.',
    			ok: 'Ok',
    			title: 'Cancellato'
  			});
  			dialog.show();
		
 			Ti.App.Properties.setBool("isSubscribed",false);
 			win.add(submit_container);
			body.width = Titanium.Platform.displayCaps.platformWidth - 100;
			label.html = 'Benvenuto! <br> Ora NON ricevi le notifiche da ____';
		} else {
			var dialog = Ti.UI.createAlertDialog({
				message: 'Verifica che il device sia connesso a internet.',
				ok: 'Ok',
				title: 'Errore'
			});
			dialog.show();
		}
	});
}

/**
 *PAYLOAD= 	{
 * 			"android" : 
 * 				{
 * 				"alert" : "",
 * 				"icon" : ""
 * 				},
 * 			 "url" : ""
 * 			} 
 */
CloudPush.addEventListener('callback', function(evt) {
	var payload = JSON.parse(evt.payload);
	var dialog = Ti.UI.createAlertDialog({
		cancel: 1,
		buttonNames: ['Vai al sito', 'Chiudi'],
		message: payload.android.alert,
		title: '__TITLE__'
	});
	dialog.addEventListener('click', function(e){
	    if (e.index === e.source.cancel){
	    	win.close();
	    }else{
			Ti.Platform.openURL('______');
		}
	  });
	dialog.show();
	
});

//whith that, app waits for notifications after it is killed
CloudPush.addEventListener('trayClickLaunchedApp', function(evt) {
	Ti.API.info('@@## Tray Click Launched App (app was not running)');
	
});

//whith that, app waits for notifications when it is running
CloudPush.addEventListener('trayClickFocusedApp', function(evt) {
	Ti.API.info('@@## Tray Click Focused App (app was already running)');
});

Ti.Gesture.addEventListener('orientationchange', function(e) {
   	if(e.source.isPortrait()) {
    
    	if(Ti.App.Properties.getBool("isSubscribed"))
    		body.width = Titanium.Platform.displayCaps.platformWidth;
    	else
    		body.width = Titanium.Platform.displayCaps.platformWidth - 100;
    	
    	textredirect.top = '120dp';
    	textredirect.left = textredirect_left;
    	textredirect.height = '120dp';
      	redirectimageview.top = '240dp';
      	redirectimageview.left = redirectimageview_left;
      	label.font = { fontSize:26 };

   	} else if(e.source.isLandscape()) {
   	  
   	  	if(Ti.App.Properties.getBool("isSubscribed"))
   	  		body.width = Titanium.Platform.displayCaps.platformWidth - 100;
   	  	else
    		body.width = Titanium.Platform.displayCaps.platformWidth;
    	
    	textredirect.top = '100dp';
    	textredirect.left = '80dp';
    	textredirect.height = '150dp';
     	redirectimageview.top = '100dp';
     	redirectimageview.left = '280dp';
     	label.font = { fontSize:30 };

   }
});

if(Ti.App.Properties.getBool("isSubscribed") == null){
	Ti.App.Properties.setBool("isSubscribed",false);
	loginDefault();
}

win.open();
