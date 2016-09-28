//-------------------------------------
//Constructor for ROS_Gamepad Object
//-------------------------------------
function ROS_Gamepad()
{
    this.connected = false;
    this.gamepad = null;
    this.axes = [0, 0];
    this.ros_edison_callback = null;
    this.rosobj = null;
    this.$div = null;
    this.onConnectCallback = null;
    
     var gamepadSupportAvailable = !!navigator.webkitGetGamepads || 
      !!navigator.webkitGamepads ||
      (navigator.userAgent.indexOf('Firefox/') != -1);
    
    window.addEventListener('gamepaddisconnected', ROS_Gamepad.gamepadDisconnected,false);
    window.addEventListener('gamepadconnected', ROS_Gamepad.gamepadConnected, false);
}

ROS_Gamepad.prototype.disableGamepadSupport = function()
{
    window.removeEventListener('gamepaddisconnected',ROS_Gamepad.gamepadDisconnected);
    window.removeEventListener('gamepadconnected',ROS_Gamepad.gamepadConnected);
    this.connected = false;
    if(this.$div !== null)
    {   
        this.$div.css('display','none');
    }
}

ROS_Gamepad.prototype.linkROSEdison = function(cb, obj)
{
    this.ros_edison_callback = cb;
    this.rosobj = obj;
}

ROS_Gamepad.gamepadConnected = function(evt)
{
    if(typeof(ros_gamepad.onConnectCallback) === "function")
    {
        ros_gamepad.onConnectCallback();    
    }
    
    ros_gamepad.connected = true;  
    ros_gamepad.gamepad = navigator.getGamepads()[0];
    
    //Start polling loop (exited with setting this.connected to false!)
    window.requestAnimationFrame(ROS_Gamepad.runAnimation);
}

ROS_Gamepad.gamepadDisconnected = function(evt)
{
    ros_gamepad.connected = false;
}

ROS_Gamepad.runAnimation = function()
{
    if(ros_gamepad.connected)
    {
        window.requestAnimationFrame(ROS_Gamepad.runAnimation); 
        if(ros_gamepad.gamepad != null)
        { 
            ros_gamepad.axes[0] = ros_gamepad.gamepad.axes[0];
            ros_gamepad.axes[1] = ros_gamepad.gamepad.axes[1];
        }
        
        if(ros_gamepad.ros_edison_callback != null)
        {
            ros_gamepad.ros_edison_callback(ros_gamepad.rosobj);
        }
    }
    else //Terminate object
    {
        ros_gamepad.gamepad = null;
    }
}


var ros_gamepad = new ROS_Gamepad();


