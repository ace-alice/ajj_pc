const req = require.context('./svg', false, /\.svg$/);
// eslint-disable-next-line no-undef
const requireAll = (requireContext: __WebpackModuleApi.RequireContext) =>
  requireContext.keys().map(requireContext);
export const reqs = requireAll(req);

export default { reqs };
