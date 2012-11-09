/* global WIDTH, HEIGHT, GRID, MaxMass, MaxCompress, MinWater, MinFlow, MaxSpeed */

//one cell in the cellular automata
var Cell = Class.create({
	initialize: function () {
		this.ground = false; //whether this tile is ground or not
		this.water = 0; //how much water this cell contains (mass)
	},
	empty: function () {
		return this.water == 0;
	},
	//some wiggle room so cells won't flicker so much
	full: function () {
		return this.water >= (MaxMass - MaxCompress);
	},
	truncate: function() {
		if( this.water < MinWater ) this.water = 0;
	},
	//draws this cell
	//onto canvas ctx at position x,y
	//the cells current neighbors are also provided
	//for neighbor-dependent rendering
	draw: function (ctx,x,y,cne) {
		if( this.ground ) {
			ctx.fillStyle = '#654321';
			ctx.fillRect(x*GRID,y*GRID,GRID,GRID);
			return;
		}
		if( !this.empty() ) {
			var alpha = 1;
			var height = GRID;
			if( ( cne[3].ground || cne[3].full() ) && cne[1].empty() ) {
				//if the cell below is ground or full()
				//and the cell above is empty
				//draw depth water
				var height = GRID*constrain(this.water,0,1);
			} else {
				//change lightness
				alpha = constrain(this.water,0,1);
			}
			//ctx.fillStyle = 'rgba(50,50,255,1)';
			ctx.fillStyle = 'rgba('+Math.floor(50-constrain((this.water-MaxMass)*200,0,50))+','+Math.floor(50-constrain((this.water-MaxMass)*200,0,50))+','+Math.floor(255-constrain((this.water-MaxMass)*300,0,50))+','+alpha+')';
			ctx.fillRect(x*GRID,y*GRID+GRID-height,GRID,height);
			//draw mass
			ctx.fillStyle = '#aa0';
			ctx.fillText(round(this.water,2),x*GRID,(y+.5)*GRID);
		}
		return;
	},
	//clears this cell to the default state
	clear: function() {
		this.ground = false;
		this.water = 0;
	},
	//sets this cell to ground
	setGround: function() {
		this.ground = true;
		this.water = false;
	},
	//fills this cell with water
	setWater: function () {
		this.water = 1;
		this.ground = false;
	}
});