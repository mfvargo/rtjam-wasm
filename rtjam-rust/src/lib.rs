mod utils;
use sound::jam_socket::JamSocket;

#[macro_use]
extern crate num_derive;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub struct JamEngineBlock {
    count: usize,
    // engine: JamEngine,
}

#[wasm_bindgen]
impl JamEngineBlock {
    pub fn new() -> JamEngineBlock {
        utils::set_panic_hook();
        // This is the channel the audio engine will use to send us status data
        // let (status_data_tx, status_data_rx): (
        //     mpsc::Sender<serde_json::Value>,
        //     mpsc::Receiver<serde_json::Value>,
        // ) = mpsc::channel();

        // // This is the channel we will use to send commands to the jack engine
        // let (command_tx, command_rx): (mpsc::Sender<ParamMessage>, mpsc::Receiver<ParamMessage>) =
        //     mpsc::channel();
        log("Hello from Rust world!");
        let res = JamSocket::build(9993);
        // let res = JamEngine::build(status_data_tx, command_rx, "atoken", "hash");
        match res {
            Ok(engine) => {
                // Got an engine!
                log("engine built!");
                ()
            }
            Err(e) => {
                log(e.to_string().as_str());
            }
        }
        JamEngineBlock {
            count: 0,
            // engine: res,
        }
    }

    pub fn process(
        &mut self,
        in_a: &[f32],
        in_b: &[f32],
        out_a: &mut [f32],
        out_b: &mut [f32],
    ) -> () {
        self.count += 1;
        // Process a frame of audio
        // self.engine.process(in_a, in_b, out_a, out_b);
        for i in 0..in_a.len() {
            out_a[i] = in_a[i];
            out_b[i] = in_a[i];
        }
    }
}

pub mod common;
pub mod dsp;
pub mod sound;
