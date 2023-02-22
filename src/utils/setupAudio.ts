import JamEngineNode from './jamEngineNode';
async function getWebAudioMediaStream() {
  if (!window.navigator.mediaDevices) {
    throw new Error(
      "This browser doesn't support the Web Audio API, or the Web Audio API is disabled."
    );
  }

  const result = await window.navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  return result;
}

export async function setupAudio(statusCallback: (pitch: number) => void) {
  // get browser audio
  const mediaStream = await getWebAudioMediaStream();
  const context = new window.AudioContext();
  const audioSource = context.createMediaStreamSource(mediaStream);

  let node;
  try {
    // Fetch WASM code
    const response = await window.fetch('rtjam-rust/rtjam_rust_wasm_bg.wasm');
    const wasmBytes = await response.arrayBuffer();
    // const wasmBytes = new ArrayBuffer(0);

    // Add our worklet to the context
    console.log(context);
    try {
      await context.audioWorklet.addModule('JamEngineProcessor.js');
    } catch (err) {
      console.log(err);
      throw new Error('Poop');
    }
    console.log('loaded module into worklet');
    // create the worklet node
    node = new JamEngineNode(context, 'JamEngineProcessor');
    console.log('loaded module into audio context');
    node.init(wasmBytes, statusCallback);
    console.log('called init');
    audioSource.connect(node);
    console.log('connected source to node');
    node.connect(context.destination);
    console.log('connected node to destination');
  } catch (err) {
    throw new Error(`Failed to load audio analyzer WASM module.` + err);
  }
  await context.resume();
  return { context, node };
}
