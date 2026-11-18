// jsdom no implementa <canvas>: se simula un contexto 2D que acepta cualquier llamada.
const gradient = { addColorStop: () => undefined };
const context2d = new Proxy({} as Record<string | symbol, unknown>, {
  get: (target, prop) => {
    if (prop === 'createLinearGradient' || prop === 'createRadialGradient') return () => gradient;
    if (prop === 'measureText') return () => ({ width: 0 });
    if (!(prop in target)) target[prop] = () => undefined;
    return target[prop];
  },
  set: (target, prop, value) => {
    target[prop] = value;
    return true;
  },
});

HTMLCanvasElement.prototype.getContext = (() => context2d) as unknown as HTMLCanvasElement['getContext'];
