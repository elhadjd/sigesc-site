import { jsx } from "react/jsx-runtime";
function InputLabel({ value, className, htmlFor }) {
  return /* @__PURE__ */ jsx("label", { htmlFor, className: `block font-medium text-sm text-gray-700 ` + className, children: value });
}
export {
  InputLabel as I
};
