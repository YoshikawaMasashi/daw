"use strict";

gs.sampleCreate = function( gsfile, trackId, when ) {
	var sample = new gs.Sample( gsfile, trackId, when );
	gs.samples.push( sample );
	ui.CSS_fileUsed( gsfile );
	++gsfile.nbSamples;
	return sample;
};
