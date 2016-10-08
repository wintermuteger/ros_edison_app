/*
 * Please see the included README.md file for license terms and conditions.
 */


// This file is a suggested starting place for your code.
// It is completely optional and not required.
// Note the reference that includes it in the index.html file.


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */



// This file contains your event handlers, the center of your application.
// NOTE: see app.initEvents() in init-app.js for event handler initialization code.

// function myEventHandler() {
//     "use strict" ;
// // ...event handler code here...
// }


// ...additional event handlers here...

 var ros_edison = new ROS_Edison({ip_string: "192.168.178.40", port_string: "9090"});

 var is_init = false;
//var ros_touchpad = new ROS_Touchpad();

//---------------------------------
//Main jQuery entry point (after loading)
//---------------------------------
$(function() 
{
    if(!is_init)
    {
        is_init = true;
        initROSApp();
    }
});

function initROSApp()
{
     //Reset strings
    $("#app-status").html("<b>Status:</b> No robot configured");
    $("#vbat").html("VBAT: --V");
    $("#cpuload").html("CPU load: --%s");
    //Set callback which will deactivate e.g. the tilt, when being called
    ros_gamepad.onConnectCallback = activateGamepad;
    //Configure div of gamepad for display
    ros_gamepad.$div = $("#gamepadstatus");
    //Set callback which will deactivate e.g. the gamepad, when being called
    ros_tiltctrl.onConnectCallback = activateTilt;
    //Configure div of tilt for display
    ros_tiltctrl.$div = $("#tiltstatus");
    //Connect ROS Object
    ros_edison.connect();
    //Setup Touchpad
    //ros_touchpad.setup($("#touchpad"));
}

function activateTilt()
{
    ros_gamepad.disableGamepadSupport();
}

function activateGamepad()
{
    ros_tiltctrl.disableTiltSupport();
}
        