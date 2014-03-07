var isMouseDown = false;
var last_x, last_y;
var current_tool;

var toolEnum = {
    PENCIL: 1,
    CIRCLE: 2
};

jQuery.fn.clear_canvas = function() {
    reset_canvas(this[0]);
}

jQuery.fn.switch_tool = function(tool_name) {
    switch(tool_name) 
    {
    case "pencil":
        current_tool = toolEnum.PENCIL;
        break;
    case "circle":
        current_tool = toolEnum.CIRCLE;
        break;
    default:
        current_tool = toolEnum.PENCIL;
    }
}

jQuery.fn.draw_on = function(lower_canvas_name) {
    var last_drawn;
    var upper_canvas = this[0];
    var lower_canvas = $(lower_canvas_name)[0];

    if (lower_canvas.tagName != "CANVAS" || upper_canvas.tagName != "CANVAS") {
        return;
    }

    current_tool = toolEnum.PENCIL;

    this.mousedown(function(e) {
        isMouseDown = true;
        last_x = get_x(e);
        last_y = get_y(e);
    });

    this.mousemove(function(e) {
        if (isMouseDown) {
            switch(current_tool)
            {           
            case toolEnum.PENCIL:
                draw(get_x(e), get_y(e), lower_canvas);                
                break;
            case toolEnum.CIRCLE:
                reset_canvas(upper_canvas);
                last_drawn = draw_circle(get_x(e), get_y(e), upper_canvas);
                break;
            default:      
                draw(get_x(e), get_y(e), lower_canvas);
            }                               
        }
    });

    $(document).mouseup(function(){
        if (current_tool == toolEnum.CIRCLE) {            
            paint_circle(last_drawn.x, last_drawn.y, last_drawn.r, lower_canvas);
            reset_canvas(upper_canvas);            
        }

        isMouseDown = false;
    });    

    function get_x(e) {
        return e.clientX - upper_canvas.offsetLeft;
    }

    function get_y(e) {
        return e.clientY - upper_canvas.offsetTop;
    }

} 


function paint_circle(x, y, radius, canvas) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

function draw_circle(current_x, current_y, canvas) {
    
    var delta_x = current_x - last_x; 
    var delta_y = current_y - last_y;        
    
    var x_coor = (last_x > current_x) ? last_x - Math.abs(delta_x) / 2 : last_x + Math.abs(delta_x) / 2;
    var y_coor = (last_y > current_y) ? last_y - Math.abs(delta_y) / 2 : last_y + Math.abs(delta_y) / 2;

    var radius = Math.sqrt(delta_x*delta_x + delta_y*delta_y) / 2;

    paint_circle(x_coor, y_coor, radius, canvas);

    return { x: x_coor, y: y_coor, r: radius }
}

function draw(x_coor, y_coor, canvas) {
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
