// Kept apart from motion-preference.ts so the server-rendered root layout can
// import it without pulling in client-only hooks.
export const MOTION_STORAGE_KEY = "motion";

// Runs before hydration so a saved choice applies on first paint.
export const motionPreferenceScript = `try{var m=localStorage.getItem("${MOTION_STORAGE_KEY}");if(m==="full"||m==="reduced")document.documentElement.dataset.motion=m}catch(e){}`;
