BUILD AND INSTALLATION GUIDE
============================

This guide explains how to configure,build and install pushapp on an Android device.

CONFIGURE
=========

The pushapp configurations are:

  * at the top of the Resource/app.js file. There the development configurations can be set
  * in the tiapp.xml file. There the ACS and custom configurations can be set
  * in the manifest file. There the app and namespace configurations can be set

BUILD
=====

To build pushapp with Titanium, refer to the following sections.

Titanium 
--------

This repo source code is a Titanium Studio project. For this, it is possible to build it using Titanium Studio, or the Titanium CLI alone.

Requirements:

  * Titanium Studio (http://www.appcelerator.com/titanium/download-titanium/)
  * Titanium SDK, version 3.2.3.GA
  * Android SDK, version 2.3.x (API 10) up to 4.4.x (API 19)
  * Android SDK Tools, Rev 23
  * Android SDK Platform-tools/Build-tools, Rev 19 or higher
  * Oracle JDK, version 1.6 or higher 

To build pushapp with Titanium Studio, import the source code as an existing project then use the Titanium Studio built-in build facilities.
By adding -b to the build options, Titanium Studio will only build the apk without running it in a device or Android AVD.

Titnium CLI
-----------

Requirements:

  * Node.js and titanium CLI (http://docs.appcelerator.com/titanium/3.0/#!/guide/Titanium_Command-Line_Interface_Reference)
  * Titanium SDK, version 3.2.3.GA
  * Android SDK, version 2.3.x (API 10) up to 4.4.x (API 19)
  * Android SDK Tools, Rev 23
  * Android SDK Platform-tools/Build-tools, Rev 19 or higher
  * Oracle JDK, version 1.6 or higher 

To build pushapp with Titanium CLI, refer to: http://docs.appcelerator.com/titanium/3.0/#!/guide/Titanium_Command-Line_Interface_Reference-section-35619828_TitaniumCommand-LineInterfaceReference-Build . 
By adding -b to the build options, Titanium Studio will only build the apk without running it in a device or Android AVD.

INSTALL on device
=================

Sign
----

To install an apk on a device, that apk has to be signed with either a debug or a release key. 

To simpy install an apk without publishing it, it suffices to build the apk with a "-k" option with the debug keystore path. The Titanium Stdio keystore location can be found in "Windows" -> "Preferences --> "Android" -> "Build", See Default debug keystore: "Path".   

To publisch the app, it has to be signed with a private key contained in a keystore. See http://docs.appcelerator.com/titanium/3.0/#!/guide/Distributing_Android_apps for reference


Deploy
------

To install pushapp on a device, first enable "USB debugging" and "Unknown Sources" on it.

Then, the possibilities are:

 - transfer the apk file, located in project/build/android/bin/pushapp.apk, into the device and install by tapping on it
 - deploy the application using adb
 - deploying the application using the CLI
 - deploy the application using Studio

refer to https://wiki.appcelerator.org/display/guides2/Deploying+to+Android+devices for detailed explanations
