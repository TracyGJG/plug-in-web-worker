let manifestLoaded = false;

onmessage = ({ data }) => {
  if (manifestLoaded) {
    postMessage(convertTemperature(data));
  } else {
    manifestLoaded = true;
    import(data, { with: { type: 'json' } }).then(({ default: manifest }) => {
      importScripts(
        ...Object.values(manifest).map((file) => `./plug-ins/${file}`)
      );
      postMessage('__LOADED__');
    });
  }
};

function convertTemperature(datum) {
  const cToF = (t) => add(div(mul(t, 9), 5), 32);
  const fToC = (t) => div(mul(sub(t, 32), 5), 9);
  const [temp, scale] = datum.split(/°/);
  return scale === 'C' ? `${cToF(+temp)}°F` : `${fToC(+temp)}°C`;
}
