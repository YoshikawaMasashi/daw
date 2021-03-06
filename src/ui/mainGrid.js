"use strict";

class uiMainGrid {
	constructor() {
		const grid = new gsuiPatternroll();

		this._blocks = new Map();
		this.patternroll = grid;
		grid.setFontSize( 32 );
		grid.setPxPerBeat( 40 );
		grid.onchange = obj => gs.undoredo.change( obj );
		grid.onchangeLoop = gs.controls.loop.bind( null, "main" );
		grid.oneditBlock = this._oneditBlock.bind( this );
		grid.onaddBlock = this._onaddBlock.bind( this );
		grid.onremoveBlock = this._onremoveBlock.bind( this );
		grid.onchangeCurrentTime = gs.controls.currentTime.bind( null, "main" );
		grid.rootElement.onfocus = gs.controls.askFocusOn.bind( null, "main" );
		dom.mainGridWrap.append( grid.rootElement );
		grid.attached();
	}

	empty() {
		// this.patternroll.offset( 0, 40 );
		// this.patternroll.contentY( 0 );
		this.patternroll.setFontSize( 32 );
		this.patternroll.setPxPerBeat( 40 );
		this.patternroll.empty();
	}
	updateName( id, name ) {
		this._blocks.forEach( blc => {
			if ( blc.dataset.pattern === id ) {
				blc.children[ 2 ].textContent = name;
			}
		} );
	}
	updateContent( patId ) {
		const { blocks, patterns } = gs.currCmp;

		this._blocks.forEach( ( blc, blcId ) => {
			const blcObj = blocks[ blcId ];

			if ( blcObj.pattern === patId ) {
				this._updatePatternContent( patterns[ blcObj.pattern ], blcObj, blc );
			}
		} );
	}

	// private:
	_updatePatternContent( pat, obj, blc ) {
		blc._gsuiRectMatrix.render(
			uiKeysToRects( gs.currCmp.keys[ pat.keys ] ),
			obj.offset,
			obj.duration );
	}
	_oneditBlock( id, obj, blc ) {
		this._updatePatternContent( gs.currCmp.patterns[ obj.pattern ], obj, blc );
	}
	_onremoveBlock( id ) {
		this._blocks.delete( id );
	}
	_onaddBlock( id, obj, blc ) {
		const pat = gs.currCmp.patterns[ obj.pattern ],
			mat = new gsuiRectMatrix();

		this._blocks.set( id, blc );
		mat.setResolution( 200, 32 );
		blc._gsuiRectMatrix = mat;
		blc.ondblclick = gs.openPattern.bind( null, obj.pattern );
		blc.children[ 2 ].textContent = pat.name;
		blc.children[ 3 ].append( mat.rootElement );
		this._updatePatternContent( pat, obj, blc );
	}
}
