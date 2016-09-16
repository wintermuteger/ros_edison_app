//-------------------------------------
//Constructor for ROS_Touchpad Object
//-------------------------------------
function ROS_Touchpad()
{
    this.$touchdiv = null;
    this.x = 0;
    this.y = 0;
    this.$cursor = null;
   
}

ROS_Touchpad.prototype.setup = function(touch_obj)
{
    this.$touchdiv = touch_obj;
    //Create a new div inside the $touchdiv
    this.$touchdiv.html("<div id=\"touchcursor\"></div>");
    //Store the touchcursor
    this.$cursor = $("#touchcursor");
    this.$cursor.width(Math.round(this.getWidth()/10));
    this.$cursor.height(Math.round(this.getHeight()/10));
    this.$cursor.css("background-color", "red");
    this.$cursor.css("position", "relative");
    
    this.$touchdiv.css("background-color","green");
    this.update();
}

ROS_Touchpad.prototype.update = function()
{
    
    var scaley = Math.round(this.getWidth()/2);
    var scalex = Math.round(this.getHeight()/2);
    var offy = Math.round(this.getHeight()/2)-Math.round(this.$cursor.height()/2);
    
    this.$cursor.css("left", (this.x*scalex) + "px");
    this.$cursor.css("top", (this.y*scaley+offy) + "px");
    
    this.$cursor.html(this.x + "/" + this.y);
}

ROS_Touchpad.prototype.getWidth = function()
{
    if(this.$touchdiv !== null)
    {
        return this.$touchdiv.width();        
    }
    else
    {
        return 1;
    }
}
    
ROS_Touchpad.prototype.getHeight = function()
{
    if(this.$touchdiv !== null)
    {
        return this.$touchdiv.height();        
    }
    else
    {
        return 1;
    }
}