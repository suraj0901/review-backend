export default function parseOptions(options) {
  let attributes = {};
  if (options?.select) {
    attributes = options.select.split(",");
  }
  if (options?.exclude) {
    attributes.exclude = options.exclude.split(",");
  }
  const include = options?.populate ? options?.populate.split(",") : [];
  return { attributes, include };
}
