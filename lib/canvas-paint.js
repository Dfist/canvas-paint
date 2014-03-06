var isMouseDown = false;
var lastx, lasty;

jQuery.fn.clear_canvas = function() {
    reset_canvas(this[0]);
}

jQuery.fn.draw_on = function() {

    if (this[0].tagName != "CANVAS") {
        return;
    }

    this.mousedown(function(e) {
        isMouseDown = true;
        lastx = get_x(e, this);
        lasty = get_y(e, this);
    });

    this.mousemove(function(e) {
        if (isMouseDown) {
            //reset_canvas(this);
            //draw_circle(get_x(e, this), get_y(e, this), this);
            draw(get_x(e, this), get_y(e, this), this);
        }

        $("#Log").html("Movement Detected:");
    });

    $(document).mouseup(function(){
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

    ctx.fillStyle = "#FF000";
    ctx.beginPath();
    ctx.arc(x_coor, y_coor, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
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
