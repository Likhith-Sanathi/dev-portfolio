// Kept apart from the preference hooks so the server-rendered root layout can
// import it without pulling in client-only code.
export const MOTION_STORAGE_KEY = "motion";
export const THEME_STORAGE_KEY = "theme";

// Runs before hydration so saved choices apply on first paint: motion on or
// off, and light or dark. Dark is the default when nothing is saved.
export const preferenceScript = `try{var d=document.documentElement,m=localStorage.getItem("${MOTION_STORAGE_KEY}"),t=localStorage.getItem("${THEME_STORAGE_KEY}");if(m==="full"||m==="reduced")d.dataset.motion=m;d.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;
