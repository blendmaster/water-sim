/* global WIDTH, HEIGHT, GRID, MaxMass, MaxCompress, MinWater, MinFlow, MaxSpeed */

//simulates a 2d cellular automaton
var World = Class.create({
	initialize: function (width, height, ctx) {
		this.width = width;
		this.height = height;
		this.ctx = ctx;
		this.pieces = new Array(this.width);
		for( var i = 0; i < this.width; i++ ) {
			this.pieces[i] = new Array(this.height);
			for( var j = 0; j < this.height; j++ ) {
				this.pieces[i][j] = new Cell();
			}
		}
	},
	//updates all cells one generation
	tick: function () {
		//clone current generation
		var newCells = new Array(this.width);
		for( var i = 0; i < this.width; i++ ) {
			newCells[i] = new Array(this.height);
			for( var j = 0; j < this.height; j++ ) {
				newCells[i][j] = clone(this.pieces[i][j]);
			}
		}
		//calculate fluxes into new generation
		for( var i = 0; i < this.width; i++ ) {
			for( var j = 0; j < this.height; j++ ) {
				this.flux(this.getNeighbors(i,j,this.pieces),this.getNeighbors(i,j,newCells));
			}
		}
		//copy newCells array back into pieces
		for( var i = 0; i < this.width; i++ ) {
			for( var j = 0; j < this.height; j++ ) {
				this.pieces[i][j] = newCells[i][j];
				//truncate water lower than minMass
				this.pieces[i][j].truncate();
			}
		}
	},
	//fluxes the neighborhood 'cne' into new generation 'nne'
	//algorithm adapted from
	// http://w-shadow.com/blog/2009/09/01/simple-fluid-simulation/
	flux: function (cne,nne) {

		var remaining = cne[0].water;
		if( remaining <= 0 ) return;
		
		//calculate downwards flow
		if( !cne[3].ground ) {
			var flow = getStable(remaining + cne[3].water) - cne[3].water;
			if( flow > MinFlow ) flow *= .5; //smoother flow?
			//constrain flow to MaxSpeed or the amount of remaining water
			flow = constrain( flow, 0, Math.min(MaxSpeed, remaining));
			
			nne[0].water -= flow;
			nne[3].water += flow;
			remaining -= flow;
		}
		
		if( remaining <= 0 ) return;
		
		//calculate sideways flow, unless the cell below this one is not full
		//if( cne[3].ground || cne[3].water >= MaxMass ) {
			var num = 1;
			if( !cne[4].ground ) num++;
			if( !cne[2].ground ) num++;
			if( !cne[3].ground && !cne[3].full() ) num++;
			var total = cne[4].water + cne[0].water + cne[2].water;
			var result = total / num;
			if( !cne[4].ground ) {
				var leftFlow = result - cne[4].water;
				leftFlow = constrain( leftFlow, 0, Math.min(MaxSpeed, remaining));
				nne[4].water += leftFlow;
				nne[0].water -= leftFlow;
				remaining -= leftFlow;
			}
			if( !cne[2].ground ) {
				var rightFlow = result - cne[2].water;
				rightFlow = constrain( rightFlow, 0, Math.min(MaxSpeed, remaining));
				nne[2].water += rightFlow;
				nne[0].water -= rightFlow;
				remaining -= rightFlow;
			}
		//}
		
		if( remaining <= 0 ) return;
		
		//calculate upwards flow
		if( !cne[1].ground ) {
			var flow = remaining - getStable(remaining + cne[1].water);
			if( flow > MinFlow ) flow *= .5; //smoother flow?
			//constrain flow to MaxSpeed or the amount of remaining water
			flow = constrain( flow, 0, Math.min(MaxSpeed, remaining));
			
			nne[0].water -= flow;
			nne[1].water += flow;
			remaining -= flow;
		}
		return;
	},
	//returns array of the neighborhood
	//centered at x,y from the cell array 'ar'
	//in the form:
	//   1
	// 4 0 2
	//   3
	//where '0' is the cell at x,y
	getNeighbors: function (x,y,ar) {
		var ne = new Array(5);
		ne[0] = ar[x][y];
		ne[4] = x > 0 ? ar[x-1][y] : new Cell();
		ne[2] = x < (this.width - 1) ? ar[x+1][y] : new Cell();
		ne[1] = y > 0 ? ar[x][y-1] : new Cell();
		ne[3] = y < (this.height -1) ? ar[x][y+1] : new Cell();
		return ne;
	},
	//refreshes canvas and draws all cells
	draw: function() {
		this.ctx.clearRect(0,0,this.width*GRID,this.height*GRID);
		for( var i = 0; i < this.width; i++ ) {
			for( var j = 0; j < this.height; j++ ) {
				this.pieces[i][j].draw(this.ctx,i,j,this.getNeighbors(i,j,this.pieces));
			}
		}
	},
	//clears all cells
	clear: function () {
		for( var i = 0; i < this.width; i++ ) {
			for( var j = 0; j < this.height; j++ ) {
				this.pieces[i][j].clear();
			}
		}
	}
});
