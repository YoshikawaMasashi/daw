"use strict";

class uiSynth {
	constructor() {
		const uisyn = new gsuiSynthesizer();

		this._uisyn = uisyn;
		uisyn.oninput = this._oninputSynth.bind( this );
		uisyn.onchange = this._onchangeSynth.bind( this );
		uisyn.setWaveList( Object.keys( gswaPeriodicWaves ) );
		dom.synthName.onclick = this._onclickName.bind( this );
		uisyn.rootElement.querySelector( ".gsuiSynthesizer-title" ).remove();
		uisyn.rootElement.querySelector( ".gsuiSynthesizer-title" ).remove();
		uisyn.rootElement.querySelector( ".gsuiSynthesizer-envelopes" ).remove();
		dom.synthWrapper2.append( uisyn.rootElement );
		uisyn.attached();
	}

	empty() {
		this._uisyn.empty();
	}
	open( synth ) {
		this.empty();
		this.name( synth.name );
		this.change( synth );
	}
	name( name ) {
		dom.synthName.textContent = name;
	}
	change( obj ) {
		if ( "name" in obj ) {
			this.name( obj.name );
		}
		this._uisyn.change( obj );
	}

	// events:
	_onclickName() {
		const cmp = gs.currCmp,
			synth = cmp.synths[ cmp.synthOpened ],
			n = prompt( "Name synthesizer :", synth.name );

		if ( n !== null ) {
			const name = n.trim();

			if ( name !== synth.name ) {
				gs.undoredo.change( { synths: {
					[ cmp.synthOpened ]: { name }
				} } );
			}
		}
	}
	_oninputSynth( id, attr, val ) {
		wa.synths.update( gs.currCmp.synthOpened, {
			oscillators: { [ id ]: { [ attr ]: val } }
		} );
	}
	_onchangeSynth( obj ) {
		gs.undoredo.change( { synths: { [ gs.currCmp.synthOpened ]: obj } } );
	}
}
