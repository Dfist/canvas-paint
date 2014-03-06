var isMouseDown = false;
var lastx, lasty;

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

    current_tool = toolEnum.CIRCLE;

    this.mousedown(function(e) {
        isMouseDown = true;
        lastx = get_x(e, this);
        lasty = get_y(e, this);
    });

    this.mousemove(function(e) {
        if (isMouseDown) {
            switch(current_tool)
            {           
            case toolEnum.PENCIL:
                draw(get_x(e, lower_canvas), get_y(e, lower_canvas), lower_canvas);                
                break;
            case toolEnum.CIRCLE:
                reset_canvas(this);
                last_drawn = draw_circle(get_x(e, this), get_y(e, this), this);
                break;
            default:      
                draw(get_x(e, this), get_y(e, this), this);
            }                               
        }
    });

    $(document).mouseup(function(){
        if (current_tool == toolEnum.CIRCLE) {
            var ctx = lower_canvas.getContext('2d');
            ctx.fillStyle = "#BF0A0";
            ctx.beginPath();
            ctx.arc(last_drawn.x, last_drawn.y, last_drawn.r, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
            reset_canvas(upper_canvas);
        }

        isMouseDown = false;

    });    
} 

function get_x(e, canvas) {
    return e.clientX - canvas.offsetLeft;
}

function get_y(e, canvas) {
    return e.clientY - canvas.offsetTop;
}

function draw_circle(current_x, current_y, canvas) {
    
    var delta_x = current_x - lastx; 
    var delta_y = current_y - lasty;        
    
    var x_coor = (lastx > current_x) ? lastx - Math.abs(delta_x) / 2 : lastx + Math.abs(delta_x) / 2;
    var y_coor = (lasty > current_y) ? lasty - Math.abs(delta_y) / 2 : lasty + Math.abs(delta_y) / 2;

    var radius = Math.sqrt(delta_x*delta_x + delta_y*delta_y) / 2;

    var ctx = canvas.getContext('2d');

    ctx.fillStyle = "#BF0A0";
    ctx.beginPath();
    ctx.arc(x_coor, y_coor, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();

    return { x: x_coor, y: y_coor, r: radius }
}

function draw(x_coor, y_coor, canvas) {
    var ctx = canvas.getContext('2d');

    ctx.lineWidth=2; 
    ctx.beginPath();
    ctx.moveTo(lastx, lasty);
    ctx.lineTo(x_coor, y_coor);
    ctx.stroke();

    lastx = x_coor; lasty = y_coor; count++;
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
