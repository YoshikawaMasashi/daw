"use strict";

class uiPattern {
	constructor() {
		const piano = new gsuiPianoroll();

		this.pianoroll = piano;
		piano.octaves( 1, 7 );
		piano.setPxPerBeat( 90 );
		piano.setFontSize( 20 );
		piano.onchange = this._onchangeGrid.bind( this );
		piano.onchangeLoop = gs.controls.loop.bind( null, "pattern" );
		piano.onchangeCurrentTime = gs.controls.currentTime.bind( null, "pattern" );
		piano.rootElement.onfocus = gs.controls.askFocusOn.bind( null, "pattern" );
		piano.uiKeys.onkeydown = wa.pianoroll.liveStartKey.bind( wa.pianoroll );
		piano.uiKeys.onkeyup = wa.pianoroll.liveStopKey.bind( wa.pianoroll );
		dom.pianorollName.onclick = this._onclickName.bind( this );
		dom.keysGridWrap.append( piano.rootElement );
		piano.attached();
	}

	empty() {
		this.updateName( "" );
		// this.pianoroll.contentY( 0 );
		// this.pianoroll.offset( 0, 90 );
		this.pianoroll.setPxPerBeat( 90 );
		this.pianoroll.empty();
	}
	updateName( name ) {
		dom.pianorollName.textContent = name;
	}
	open( id ) {
		if ( id ) {
			const pat = gs.currCmp.patterns[ id ];

			this.updateName( pat.name );
			this.pianoroll.empty();
			common.assignDeep( this.pianoroll.data, gs.currCmp.keys[ pat.keys ] );
			this.pianoroll.scrollToKeys();
		} else {
			this.empty();
		}
		dom.pianorollBlock.classList.toggle( "show", !id );
	}
	keyboardEvent( status, e ) {
		const uiKeys = this.pianoroll.uiKeys,
			midi = uiKeys.getMidiKeyFromKeyboard( e );

		if ( midi ) {
			if ( status ) {
				wa.pianoroll.liveStartKey( midi );
				uiKeys.midiKeyDown( midi );
			} else {
				wa.pianoroll.liveStopKey( midi );
				uiKeys.midiKeyUp( midi );
			}
			return true;
		}
	}

	// events:
	_onclickName() {
		const id = gs.currCmp.patternOpened,
			oldName = gs.currCmp.patterns[ id ].name,
			n = prompt( "Name pattern :", oldName );

		if ( n !== null ) {
			const name = n.trim();

			if ( name !== oldName ) {
				gs.undoredo.change( { patterns: {
					[ id ]: { name }
				} } );
			}
		}
	}
	_onchangeGrid( keysObj ) {
		const cmp = gs.currCmp,
			patId = cmp.patternOpened,
			pat = cmp.patterns[ patId ],
			duration = this.pianoroll.getDuration(),
			obj = { keys: {
				[ pat.keys ]: keysObj
			} };

		if ( duration !== pat.duration ) {
			const objBlocks = {};
			let objBlocksFilled;

			obj.patterns = { [ patId ]: { duration } };
			Object.entries( cmp.blocks ).forEach( ( [ id, blc ] ) => {
				if ( blc.pattern === patId && !blc.durationEdited ) {
					objBlocksFilled = true;
					objBlocks[ id ] = { duration };
				}
			} );
			if ( objBlocksFilled ) {
				obj.blocks = objBlocks;
			}
		}
		gs.undoredo.change( obj );
	}
}
