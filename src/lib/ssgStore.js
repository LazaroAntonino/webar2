// Module-level store for SSG build-time data injection.
// Only populated during server rendering (typeof window === 'undefined').
let _ssgInmuebles = null;

export function setSsgInmuebles(data) {
  _ssgInmuebles = data;
}

export function getSsgInmuebles() {
  return _ssgInmuebles;
}
