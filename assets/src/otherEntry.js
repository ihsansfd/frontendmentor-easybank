// IMAGES

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context("./images", false, /\.(gif|png|jpe?g|svg)$/)
);
