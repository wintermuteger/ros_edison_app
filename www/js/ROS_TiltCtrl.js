//-------------------------------------
//Constructor for ROS_TiltCtrl Object
//-------------------------------------
function ROS_TiltCtrl()
{
    this.active = false;
    this.ros_edison_callback = null;
    this.rosobj = null;
    this.$div = null;
    this.onConnectCallback = null;
    this.axes = [];
    
    //Check if tilting is available
    if (window.DeviceOrientationEvent) 
    {
        window.addEventListener('deviceorientation', ROS_TiltCtrl.activateTiltCtrl, false);
    }
    
}

ROS_TiltCtrl.prototype.disableTiltSupport = function()
{
    this.active = false;
    if(this.$div !== null)
    {   
        this.$div.css('display','none');
    }
}

ROS_TiltCtrl.activateTiltCtrl = function(event)
{
    if(!ros_tiltctrl.active)
    {
        if(typeof(ros_tiltctrl.onConnectCallback) === "function")
        {
            ros_tiltctrl.onConnectCallback();    
        }
        ros_tiltctrl.active = true;
    }
    

    if(ros_tiltctrl.$div !== null)
    {
        window.removeEventListener('deviceorientation', ROS_TiltCtrl.activateTiltCtrl, false);    
        window.addEventListener('deviceorientation', ROS_TiltCtrl.onTilt, false);
    }
}

ROS_TiltCtrl.onTilt = function(event)
{   
    if(ros_tiltctrl.active)
    {     
        //Gamma determines the drive level 
        //Alpha the rotation
        ros_tiltctrl.axes[1] = event.gamma/90;
        ros_tiltctrl.axes[0] = (event.alpha-90)/90;
        
        if(ros_tiltctrl.ros_edison_callback != null)
        {
            ros_tiltctrl.ros_edison_callback(ros_tiltctrl.rosobj);
        }
    }
}

ROS_TiltCtrl.prototype.linkROSEdison = function(cb, obj)
{
    this.ros_edison_callback = cb;
    this.rosobj = obj;
}

var ros_tiltctrl = new ROS_TiltCtrl();