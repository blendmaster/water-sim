/* global WIDTH, HEIGHT, GRID, MaxMass, MaxCompress, MinWater, MinFlow, MaxSpeed */

//returns n < rand <= p
function rand(n, p) {
  return Math.floor( Math.random() * (p-n) + n );
}

function round(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

//constrains x between a and b inclusive and returns it
function constrain(x, a, b) {
	if( x < a )	x = a;
	if( x > b )	x = b;
	return x;
}

//returns how much water should be in the bottom cell
//with input of the total amount of water in two vertically
//adjacent cells
//from http://w-shadow.com/blog/2009/09/01/simple-fluid-simulation/
function getStable(totalMass) {
	if( totalMass <= 1) return 1; //all water can be contained in one cell
	if( totalMass < 2*MaxMass + MaxCompress ) {
		//the bottom cell will be full, and the top cell is not
		//so the bottom cell contains slightly more water due to the pressure
		//from the water in the top cell
		return (MaxMass*MaxMass + totalMass*MaxCompress)/(MaxMass + MaxCompress);
	}
	//both cells are full, so compression will 'stack' with the top cells compression
	return (totalMass + MaxCompress)/2;
}

//deep copies object, from
//http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone
function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor(); // changed (twice)
    for(var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
}