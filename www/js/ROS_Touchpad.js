//-------------------------------------
//Constructor for ROS_Touchpad Object
//-------------------------------------
function ROS_Touchpad(touch_obj)
{
    this.$touchdiv = touch_obj;
    this.x = 0;
    this.y = 0;
    
    //Create a new div inside the $touchdiv
    this.$touchdiv.html("<div id=\"touchcursor\">Cur</div>");
    //Store the touchcursor
    this.$cursor = $("#touchcursor");
    this.$cursor.width(Math.round(this.getWidth()/10));
    this.$cursor.height(Math.round(this.getHeight()/10));
    this.$cursor.css("background-color", "red");
    
    this.$touchdiv.css("background-color","green");
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