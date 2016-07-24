//-------------------------------------
//Constructor for ROS_Edison object
//-------------------------------------
function ROS_Edison(param)
{
    this.ip_string = "";
    this.port_string = "9090";
    this.ros = null;
    this.top_vbat = null;
    
    if(typeof param !== 'undefined')
    {
            for(var property in param)
            {
                this[property] = param[property];       
            }
    }
}

//-------------------------------------
//Connection function
//-------------------------------------
ROS_Edison.prototype.connect = function()
{
    //
    //Establish a connection to rosbridge websockets
    //
    if(this.ros !== null)
    {
        //Shutdown connection
        //TBD
        this.ros = null;
    }
    
    var ws_string = "ws://" + this.ip_string + ":" + this.port_string;
    this.ros = new ROSLIB.Ros();

    this.ros.connect(ws_string);
    
    var that = this;
    
    this.ros.once('connection', function() {
        //
        //!Connected!
        //
        
        //Update status
        $("#app-status").html("<b>Status:</b> Connected to " + that.ip_string + ":" + that.port_string);
        
        //Prepare subscriptions to be established
        that.top_vbat = new ROSLIB.Topic({ros : that.ros,
                                          name: 'bat_volt',
                                          messageType: 'std_msgs/Float32',
                                         });
        //Subscribe to topic
        that.top_vbat.subscribe(ROS_Edison.vbat_callback);
    });
};

//-------------------------------------
//Callback if VBAT is received - Static function!
//-------------------------------------
ROS_Edison.vbat_callback = function(msg) {
            $("#vbat").html(msg.data + "V");
}
