/**
 * for documentation and more demos,
 * visit https://audiomotion.dev
 */

// load module from Skypack CDN
import AudioMotionAnalyzer from 'https://cdn.skypack.dev/audiomotion-analyzer?min';

// container element
const container = document.getElementById('container');

// audio source
const audioEl = document.getElementById('audio');

// instantiate analyzer
const audioMotion = new AudioMotionAnalyzer( null, {
  source: audioEl,
  mode: 2,
  useCanvas: false, // don't use the canvas
  onCanvasDraw: instance => {
    const maxHeight = container.clientHeight;
    
    let html = '';

    // get analyzer bars data
    for ( const bar of instance.getBars() ) {

      const value    = bar.value[0],
            peak     = bar.peak[0],
            hold     = bar.hold[0],
            isPeakUp = hold > 0 && peak > 0; // if hold < 0 the peak is falling down

      // build our visualization using only DIVs
      html += `<div class="bar" style="height: ${ value * 100 }%; background: rgba( 255, 255, 255, ${ value } )">
								<div class="peak" style="bottom: ${ ( peak - value ) * -maxHeight }px; ${ isPeakUp ? 'box-shadow: 0 0 10px 1px #f00' : 'opacity: ' + ( peak > 0 ? .7 : 0 ) }"></div>
							 </div>`;
    }
    container.innerHTML = html;
    document.getElementById('fps').innerText = instance.fps.toFixed(1);
  }
});

// visualization mode selection
const elMode = document.getElementById('mode');
elMode.value = audioMotion.mode;
elMode.addEventListener( 'change', () => audioMotion.mode = elMode.value );

// display module version
document.getElementById('version').innerText = `v${AudioMotionAnalyzer.version}`;

// play stream
document.getElementById('live').addEventListener( 'click', () => {
  audioEl.src = 'https://icecast2.ufpel.edu.br/live';
  audioEl.play();
});

// file upload
document.getElementById('upload').addEventListener( 'change', e => {
	const fileBlob = e.target.files[0];

	if ( fileBlob ) {
		audioEl.src = URL.createObjectURL( fileBlob );
		audioEl.play();
	}
});