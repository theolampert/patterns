var Canvas = require('canvas'),
	Image = Canvas.Image;

/*
** Generative Thumbnail States
** ========================
** Random pattern generator for use in empty image States.
*/

/*
** Generates an image with a random pattern.
*/
var GenerateImage = function() {  
	/*
	** Array of colors to use
	*/
	this.colors = [
		'#241338',
		'#E4C46C',
		'#DC211E',
		'#78CAB6',
		'#F46539',
		'#FD7659',
		'#CCCAC6',
		'#3891A6'
	];

	/*
	** Returns random item from an array;
	** @Param: Array
	*/
	this.getRandArrItem = (arr) => {
		var i = Math.floor(Math.random() * arr.length);
		return arr[i];
	};

	/*
	** Generate Shapes for the pattern tile
	*/
	this.square = (ctx, pos, size, gridSet, offset) => {
		ctx.fillStyle = this.getRandArrItem(this.colors);
		ctx.beginPath();
		ctx.rect(
			((size.w / gridSet) * pos.x) + (offset / 2), 
			((size.h / gridSet) * pos.y) + (offset / 2), 
			(size.h / gridSet - offset), 
			(size.h / gridSet - offset)); //Deliberate
		ctx.closePath();
		ctx.fill();		
	};

	this.circle = (ctx, pos, size, gridSet, offset) => {
		ctx.fillStyle = this.getRandArrItem(this.colors);
		ctx.beginPath();
		ctx.arc(
			((size.w / gridSet) * pos.x) + (size.w / 4), 
			((size.h / gridSet) * pos.y)+ (size.h / 4), 
			((size.w / 4) - (offset / 2)), 0, 4 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
	};
	
	this.line = (ctx, position, radius) => {
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(position.x,position.y);
		ctx.lineTo(position.y,position.x);
		ctx.strokeStyle = this.getRandArrItem(this.colors);
		ctx.stroke();
		ctx.closePath();
	};


	/*
	** Generate 2x2 pattern tile
	*/
	this.genTile = (size) => {
		
		/*
		** Create new canvas object for the pattern tile
		*/
		const canvas = new Canvas(size.width, size.height),
			stream = canvas.pngStream(),
			ctx = canvas.getContext('2d');

		/*
		** Returns a random shape
		*/
		const randShape = () => {
			return this.getRandArrItem(['square', 'circle']);
		};

		/*
		** Fill the tile's background with a random color
		*/
		ctx.beginPath();
		ctx.fillStyle = this.getRandArrItem(this.colors);
		ctx.fillRect(0,0,size.width, size.height);
		ctx.closePath();
		ctx.fill();

		const offset = 15;
		const gridSet = 2;

		for (var y = 0; y < gridSet; y++) {
			for (var x = 0; x < gridSet; x++) {
				this[randShape()](ctx, {x:x,y:y}, {w:size.width, h:size.height}, gridSet, offset);
			}
		}

		return ctx;
	};
	
	/*
	** Generate a buffer
	*/
	this.genDataURL = function(outputSize, callback, colors){
		var canvas = new Canvas(outputSize.w, outputSize.h),
			ctx = canvas.getContext('2d');

		var pattern = ctx.createPattern(this.genTile({ 
			height: (outputSize.h / 10), 
			width: (outputSize.w / 10) 
		}).canvas, 'repeat');
		
		ctx.rect(0,0, outputSize.w, outputSize.h);
		ctx.fillStyle = pattern;
		ctx.fill();

		canvas.toBuffer((err, buf) => {
			if(err){
				console.log(err);
			}
			else {
				callback(buf);
			}
		});
	}
}

module.exports = GenerateImage;