var last_x, last_y;
var current_tool;
var current_cool;

var toolEnum = {
    PENCIL: 1,
    CIRCLE: 2,
    RECTANGLE: 3
};

jQuery.fn.switch_tool = function(tool_name) {
    switch(tool_name) 
    {
    case "pencil":
        current_tool = toolEnum.PENCIL;
        break;
    case "circle":
        current_tool = toolEnum.CIRCLE;
        break;
    case "rectangle":
        current_tool = toolEnum.RECTANGLE;
        break;
    default:
        current_tool = toolEnum.PENCIL;
    }
}

jQuery.fn.draw_on = function(lower_canvas_name) {
    var last_drawn;
    var upper_canvas = this[0];
    var lower_canvas = $(lower_canvas_name)[0];
    var is_mouse_down = false;
    
    if (lower_canvas.tagName != "CANVAS" || upper_canvas.tagName != "CANVAS") {
        return;
    }

    current_tool = toolEnum.PENCIL;
    current_color = "#000000";

    this.mousedown(function(e) {
        is_mouse_down = true;
        last_x = get_x(e);
        last_y = get_y(e);
    });

    this.mousemove(function(e) {
        if (is_mouse_down) {
            switch(current_tool)
            {           
            case toolEnum.PENCIL:
                paint_line(get_x(e), get_y(e), lower_canvas);                
                break;
            case toolEnum.CIRCLE:
                reset_canvas(upper_canvas);
                last_drawn = calculate_circle(get_x(e), get_y(e), upper_canvas);
                break;
            case toolEnum.RECTANGLE:
                reset_canvas(upper_canvas);
                last_drawn = calculate_rect(get_x(e), get_y(e), upper_canvas);
                break;
            default:      
                paint_line(get_x(e), get_y(e), lower_canvas);
            }                               
        }
    });

    $(document).mouseup(function(){
        switch(current_tool)
        {
        case toolEnum.CIRCLE:
            paint_circle(last_drawn.x, last_drawn.y, last_drawn.r, lower_canvas);
            break;
        case toolEnum.RECTANGLE:
            paint_rectangle(last_drawn.x, last_drawn.y, last_drawn.w, last_drawn.h, lower_canvas);
            break;
        }        
        reset_canvas(upper_canvas);
        is_mouse_down = false;
    });    

    function get_x(e) {
        return e.clientX - upper_canvas.offsetLeft;
    }

    function get_y(e) {
        return e.clientY - upper_canvas.offsetTop;
    }

} 

jQuery.fn.clear_canvas = function() {
    reset_canvas(this[0]);
}

jQuery.fn.switch_color = function(color) {
    var hex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

    if (hex.test(color)) {
        current_color = color;
    }
    else {
        alert("fuk");
    }
}
function paint_circle(x, y, radius, canvas) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = current_color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

function paint_rectangle(x, y, width, height, canvas) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = current_color;
    ctx.fillRect(x, y, width, height);
}

function calculate_rect(current_x, current_y, canvas) {

    var delta_x = current_x - last_x; 
    var delta_y = current_y - last_y;        

    paint_rectangle(last_x, last_y, delta_x, delta_y, canvas);

    return { x: last_x, y: last_y, w: delta_x, h: delta_y };
}

function calculate_circle(current_x, current_y, canvas) {
    
    var delta_x = current_x - last_x; 
    var delta_y = current_y - last_y;        
    
    var x_coor = (last_x > current_x) ? last_x - Math.abs(delta_x) / 2 : last_x + Math.abs(delta_x) / 2;
    var y_coor = (last_y > current_y) ? last_y - Math.abs(delta_y) / 2 : last_y + Math.abs(delta_y) / 2;

    var radius = Math.sqrt(delta_x*delta_x + delta_y*delta_y) / 2;

    paint_circle(x_coor, y_coor, radius, canvas);

    return { x: x_coor, y: y_coor, r: radius }
}

function paint_line(x_coor, y_coor, canvas) {
    var ctx = canvas.getContext('2d');
    
    ctx.lineWidth=2; 
    ctx.beginPath();
    ctx.moveTo(last_x, last_y);
    ctx.lineTo(x_coor, y_coor);
    ctx.stroke();

    last_x = x_coor; last_y = y_coor;
}

//http://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
//http://jsperf.com/canvas-clear-speed/9
function reset_canvas(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}
