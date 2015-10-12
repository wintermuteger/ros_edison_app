//-------------------------------------
//Constructor for ROS_Edison object
//-------------------------------------
function ROS_Edison()
{
    this.ip_string = "127.0.0.1";
    this.port_string = "9090";
    this.ros = null;
}

//-------------------------------------
//Connection function
//-------------------------------------
ROS_Edison.prototype.connect = function()
{
    if(this.ros != null)
    {
        //Shutdown connection
        //TBD
        this.ros = null;
    }
    
    var ws_string = "ws://" + this.ip_string + ":" + this.port_string;
    this.ros = new ROSLIB.Ros();
    
    this.ros.connect(ws_string);
    
    this.ros.once('connection', function() {
        $("#app-status").html("<b>Status:</b> Connected to " + this.ip_string + ":" + this.port_string);
    });
    
}