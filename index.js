var _ = require('lodash'),
	fs = require('fs'),
	Canvas = require('canvas'),
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
	var self = this;
	/*
	** Array of colors to use
	*/
	self.colors = [
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
	self.getRandArrItem = (arr) => {
		var i = Math.floor(Math.random() * arr.length);
		return arr[i];
	};

	/*
	** Generate Shapes for the pattern tile
	*/
	self.square = function(ctx, position, size){
		ctx.fillStyle = self.getRandArrItem(self.colors);
		ctx.beginPath();
		ctx.rect(position.x, position.y, (size * 2), (size * 2));
		ctx.closePath();
		ctx.fill();
	};

	self.circle = function(ctx, position, radius)  {
		ctx.fillStyle = self.getRandArrItem(self.colors);
		ctx.beginPath();
		ctx.arc(position.x, position.y, radius, 0, 4 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
	};
	
	self.line = function(ctx, position, radius){
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.moveTo(position.x,position.y);
		ctx.lineTo(50,50);
		ctx.strokeStyle = self.getRandArrItem(self.colors);
		ctx.stroke();
		ctx.closePath();
	};


	/*
	** Generate 2x2 pattern tile
	*/
	self.genTile = function(size){
		/*
		** Create new canvas object for the pattern tile
		*/
		var canvas = new Canvas(size.width, size.height),
			stream = canvas.pngStream(),
			ctx = canvas.getContext('2d');

		/*
		** Fill the tile's background with a random color
		*/
		ctx.beginPath();
		ctx.fillStyle = self.getRandArrItem(self.colors);
		ctx.fillRect(0,0,size.width, size.height);
		ctx.closePath();
		ctx.fill();

		/*
		** Returns a random shape
		*/
		var randShape = function(){
			return self.getRandArrItem(['square', 'circle', 'line']);
		};

		/*
		** 2x2 map for the pattern
		*/
		var arrayMap = [
			[1,1],
			[3,1],
			[1,3],
			[3,3],
		];

		arrayMap.forEach(function(item, i){
			self[randShape()](ctx, {
				x: arrayMap[i][0] * (size.width / arrayMap.length), 
				y: arrayMap[i][1] * (size.width / arrayMap.length)
			}, 10);		
		});

		return ctx
	};
	
	/*
	** Generate the png file and write to disk
	*/
	self.genPng = function(outputSize, fileDir){
		var canvas = new Canvas(outputSize.w, outputSize.h),
			out = fs.createWriteStream(__dirname + fileDir),
			stream = canvas.pngStream();
			ctx = canvas.getContext('2d');

		var pattern = ctx.createPattern(self.genTile({ 
			height: 100, 
			width: 100 
		}).canvas, 'repeat');
		
		ctx.rect(0,0, outputSize.w, outputSize.h);
		ctx.fillStyle = pattern;
		ctx.fill();
		
		stream.on('data', function(chunk){
			out.write(chunk);
		});
	}

}

module.exports = GenerateImage;