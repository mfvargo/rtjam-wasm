mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, rtjam-rust!");
}

#[wasm_bindgen]
pub struct JamEngineBlock {
    count: usize,
}

#[wasm_bindgen]
impl JamEngineBlock {
    pub fn new() -> JamEngineBlock {
        JamEngineBlock { count: 0 }
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
        for i in 0..in_a.len() {
            out_a[i] = in_a[i];
            out_b[i] = in_a[i];
        }
    }
}

pub mod common;
pub mod dsp;
pub mod sound;
