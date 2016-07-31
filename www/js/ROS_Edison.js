//-------------------------------------
//Constructor for ROS_Edison object
//-------------------------------------
function ROS_Edison(param)
{
    this.ip_string = "";
    this.port_string = "9090";
    this.ros = null;
    this.top_vbat = null;
    this.top_cpuload = null;
    this.top_camera = null;
    
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
        that.top_cpuload = new ROSLIB.Topic({ros : that.ros,
                                          name: 'cpu_load',
                                          messageType: 'std_msgs/Float32',
                                         });
        that.top_camera = new ROSLIB.Topic({ros : that.ros,
                                          name: '/v4l/camera/image_raw',
                                          messageType: 'sensor_msgs/Image',
                                         });
        
        //Subscribe to topic
        that.top_vbat.subscribe(ROS_Edison.vbat_callback);
        that.top_cpuload.subscribe(ROS_Edison.cpuload_callback);
        that.top_camera.subscribe(ROS_Edison.camera_callback);
    });
};

//-------------------------------------
//Callback if VBAT is received - Static function!
//-------------------------------------
ROS_Edison.vbat_callback = function(msg) {
            $("#vbat").html("VBAT: " + Math.round(msg.data*100)/100 + "V");
}

//-------------------------------------
//Callback if CPU load is received - Static function!
//-------------------------------------
ROS_Edison.cpuload_callback = function(msg) {
            $("#cpuload").html("CPU load: " + Math.round(msg.data*1000)/10 + "%");
}

//-------------------------------------
//Callback if camera image is received - Static function!
//-------------------------------------
ROS_Edison.camera_callback = function(msg) {
            $("#camera").html("Image received!");
}