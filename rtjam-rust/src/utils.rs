use crate::common::box_error::BoxError;
use std::{fs, time::SystemTime, time::UNIX_EPOCH};

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

// utility functions

pub fn get_my_mac_address(iface: &str) -> Result<String, BoxError> {
    // Get the mac address
    let fcontent = fs::read_to_string(format!("/sys/class/net/{}/address", iface))?;
    Ok(String::from(fcontent.trim()))
}

// pub fn get_git_hash() -> String {
//     let sha = env!("VERGEN_GIT_SHA");
//     String::from(sha)
// }
pub fn clip_float(v: f32) -> f32 {
    if v > 1.0 {
        return 1.0;
    }
    if v < -1.0 {
        return -1.0;
    }
    v
}

pub fn get_frame_power_in_db(frame: &[f32]) -> f32 {
    // linear calcution.  sum of the squares / number of values
    if frame.len() == 0 {
        return to_db(0.0);
    }
    let mut pow: f32 = 0.0;
    for v in frame {
        pow = pow + f32::powi(*v, 2);
    }
    to_db(pow / frame.len() as f32)
}

// Convert a linear to db
pub fn to_db(v: f32) -> f32 {
    if v > 0.000_000_1 {
        return 10.0 * f32::log10(v);
    }
    -60.0
}

// convert db to linear
pub fn to_lin(v: f32) -> f32 {
    f32::powf(10.0, v / 10.0)
}

// Get the time in microseconds
pub fn get_micro_time() -> u128 {
    let now = js_sys::Date::now();
    (now * 1000.0) as u128
    // SystemTime::now()
    //     .duration_since(UNIX_EPOCH)
    //     .unwrap()
    //     .as_micros()
}

#[cfg(test)]

mod test_utils {
    use super::*;

    #[test]
    fn get_mac_address() {
        let mac = get_my_mac_address("anbox0").unwrap();
        println!("mac: {}", mac);
    }
    // #[test]
    // fn get_hash() {
    //     println!("githash: {}", get_git_hash());
    // }

    #[test]
    fn clip_test() {
        assert_eq!(clip_float(0.1), 0.1);
        assert_eq!(clip_float(-1.3), -1.0);
        assert_eq!(clip_float(2.3), 1.0);
    }
    #[test]
    fn get_frame_power() {
        let frame = [0.0; 128];
        assert_eq!(get_frame_power_in_db(&frame), -60.0);
        let frame = [0.5; 128];
        assert_eq!(get_frame_power_in_db(&frame).round(), -6.0);
    }
    #[test]
    fn lin_to_db_and_back() {
        assert_eq!(to_db(1.0), 0.0);
        assert_eq!(to_lin(-10.0), 0.1);
    }
}
