// Kept apart from the preference hooks so the server-rendered root layout can
// import it without pulling in client-only code.
export const MOTION_STORAGE_KEY = "motion";
export const THEME_STORAGE_KEY = "theme";

// Runs before hydration so saved choices apply on first paint: motion on or
// off, and light or dark.
export const preferenceScript = `try{var d=document.documentElement,m=localStorage.getItem("${MOTION_STORAGE_KEY}"),t=localStorage.getItem("${THEME_STORAGE_KEY}");if(m==="full"||m==="reduced")d.dataset.motion=m;if(t==="dark"||t==="light")d.dataset.theme=t}catch(e){}`;
