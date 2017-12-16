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
    this.top_engineA = null;
    this.top_engineB = null;
    
    this.lastX = Infinity;
    this.lastY = Infinity;
    
    if(typeof ros_gamepad !== "undefined")
    {
        ros_gamepad.linkROSEdison(this.ctrlUpdated, this);        
    }
    
    if(typeof ros_tiltctrl !== "undefined")
    {
        ros_tiltctrl.linkROSEdison(this.ctrlUpdated, this);        
    }
    
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
                                          queue_size: 3,
                                          queue_length: 0
                                         });
        that.top_engineA = new ROSLIB.Topic({ros : that.ros,
                                          name: '/engineA',
                                          messageType: 'std_msgs/Float32',
                                        });
        that.top_engineB = new ROSLIB.Topic({ros : that.ros,
                                          name: '/engineB',
                                          messageType: 'std_msgs/Float32',
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
ROS_Edison.vbat_callback = function(msg) 
{
    $("#vbat").html("VBAT: " + Math.round(msg.data*100)/100 + "V");
}

//-------------------------------------
//Callback if CPU load is received - Static function!
//-------------------------------------
ROS_Edison.cpuload_callback = function(msg) 
{
    $("#cpuload").html("CPU load: " + Math.round(msg.data*1000)/10 + "%");
}

//-------------------------------------
//Callback if camera image is received - Static function!
//-------------------------------------

//Global variable to hold the camera context to simplify access
ROS_Edison.context = null;

ROS_Edison.camera_callback = function(msg) 
{   
    //Get context for drawing (once)
    if(ROS_Edison.context == null)
    {
        ROS_Edison.context = $("#camcan")[0].getContext('2d');   
    }
    
    //Generate image object to hold the image data
    var img = new ImageData(str2ui8ca(msg.data),320,240);
    
    ROS_Edison.context.putImageData(img,0,0);
    
}

function str2ui8ca(str) {
  var buf = new ArrayBuffer(str.length); // 2 bytes for each char
  var bufView = new Uint8ClampedArray(buf);
  var bufind = 0;
  var str_dec = atob(str);
  for (var i=0, strLen=str_dec.length; i<strLen; i+=3) {
    bufView[bufind+0] = str_dec.charCodeAt(i+0);
    bufView[bufind+1] = str_dec.charCodeAt(i+1);
    bufView[bufind+2] = str_dec.charCodeAt(i+2);
    bufView[bufind+3] = 255;
    bufind += 4;
  }
  return bufView;
}

ROS_Edison.prototype.ctrlUpdated = function(rosobj)
{
    var x = this.axes[0];
    var y = this.axes[1];
    
    
    //Quantize into distinct levels
    if(Math.abs(x) > Math.abs(y))
    {
        x = Math.round(3*x)/3;
        y = 0;
    }
    else //x < y
    {
        x = 0;
        y = Math.round(3*y)/3;
    }
    
    this.$div.html("X:" + x + "/y: " + y);
    
    if(rosobj.top_engineA !== null && rosobj.top_engineB !== null)
    {
        if(rosobj.lastX != x || rosobj.lastY != y)
        {   
            var engA = -y+x;
            var engB = -y-x;

            var engA_msg = new ROSLIB.Message({
                data: engA
            });
            var engB_msg = new ROSLIB.Message({
                data: engB
            });

            rosobj.top_engineA.publish(engA_msg);
            rosobj.top_engineB.publish(engB_msg);
            
            rosobj.lastX = x;
            rosobj.lastY = y;
        }
    }
    
}