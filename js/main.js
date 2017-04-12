var w,h,ctx;
var V = 0;
var dl = 0;
var dTime = 50;
var a = 0.00005;
var dr = 0;
var player = {
	i: 0,
	j: 0
};
$( document ).ready(function() {
	var $canv = $('canvas');
	var example = $canv[0];
	ctx = example.getContext('2d');
	ctx.fillStyle = 'white';
    ctx.save();
	w =  $canv.width();
	h =  $canv.height();
	$canv.attr('width',$canv.width()).attr('height',$canv.height());
	go();
});
var pprint = function(a){
    console.log(a);
}
//добавить круг
var addArc = function(i, j, R){
    return {
        x: Math.round(2*R*(i - (j%2)*Math.sin(Math.PI/6))),
		y: Math.round(2*R*j*Math.cos(Math.PI/6)),
		R: R,		
		o: _.random(0, 5), // направление
        draw: function(flg){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.R, 0, 2 * Math.PI, true);
            ctx.stroke();
			ctx.save();
			ctx.strokeStyle = flg ? 'green' : '#EF4836';
			ctx.lineWidth = 4;
			ctx.translate(this.x, this.y);
			ctx.rotate(-this.o*Math.PI/3);
			ctx.beginPath();
            ctx.arc(0, 0, this.R-3, Math.PI/6, -Math.PI/6, true);
            ctx.stroke();
			ctx.restore();
			if(player.i == i && player.j == j){
				ctx.save();
				ctx.fillStyle = '#BF55EC';
				ctx.translate(this.x, this.y);
				ctx.beginPath();
				ctx.arc(0, 0, 5, 0, 2 * Math.PI, true);
				ctx.fill();
				ctx.restore();
			}
			return this;
        },
        clean: function(){
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.arc(this.x, this.y, this.R+ctx.lineWidth, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.restore();
			return this;
        },
		direct: function(){
			var o = this.o;
			var d = ((player.i+1)%2);
			var arr = {
				0:{di: 1, dj: 0},
				1:{di: d, dj: -1},
				2:{di: -1 + d, dj: -1},
				3:{di: -1, dj: 0},
				4:{di: -1 + d, dj: 1},
				5:{di: d, dj: 1},
				
			}
			return({i: arr[o].di + player.i, j: arr[o].dj + player.j});
		}
	};
};
  /*var drawPoint = function(){
    ctx.save();
    ctx.fillStyle = '#BF55EC';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.restore();
}*/
//массив кругов
var arrArc = function(n){//n - чисчло кругов вдоль
    var arr = [];
    var R = Math.ceil(w*0.48/(n + 1));
	var m = Math.ceil(h*0.5/R);//число вругов ввысь
    for(var i = 0; i < m; i++){
		arr[i] = [];
		for(var j = 0; j < n+(i%2); j++){
			arr[i][j] = new addArc(j,i,R);
		}
	}
    return{
		R: R,
		elems: arr,
        draw: function(){
			ctx.save();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'gray';
            _.each(arr,function(line){
                 _.each(line,function(inf){
					 inf.draw();
				 });
            });
			ctx.restore();
			//drawPoint();
            return this;
        },
        clean: function(){
            ctx.fillRect(0,0,w,h);
            return this;
        }
    }
};
var go = function(){
	ctx.fillStyle = 'white';
    ctx.fillRect(0,0,w,h);
    var n = 10;
    var arcs = arrArc(n);
	
	ctx.translate((w - (n-1)*2*arcs.R)/2,arcs.R*1.4);
    arcs.draw();
	//drawPoint();
    $( document ).on('click',function() {
		var elem = arcs.elems[player.i][player.j]
		elem.o++;
		elem.o%=6;
		var pos = elem.direct();
		pprint(pos);
		var check = 0;
		if( pos.i >= 0 &&
			pos.j >=0 &&
			arcs.elems[pos.i]!=null &&
			Math.abs(arcs.elems[pos.i][pos.j].o + elem.o) == 3){
				check==1;
		}
		elem.clean().draw(check);
});
};