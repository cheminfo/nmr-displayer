import{r as e,j as t}from"./vendor.974372f3.js";import{N as o}from"./NMRium.0bf7bff3.js";import"./index.c60e15d4.js";function r(r){const[i,a]=e.exports.useState(),{path:s}=r;return e.exports.useEffect((()=>{const e={spectra:[{source:{jcampURL:s}}]};a(e||{})}),[s,r]),t("div",{style:{height:"100%",display:"flex",flexDirection:"column",marginLeft:30}},t("h5",{style:{fontWeight:700,fontSize:"1.5em",lineHeight:"1.4em",marginBottom:"15px"}},"Display and process 1D NMR spectra from a JCAMP-DX file"),s&&t("p",{style:{marginTop:"-10px",marginBottom:"1rem",fontWeight:400,color:"#9a9a9a",fontSize:"0.7142em"}},s),t(o,{data:i}))}export default r;
//# sourceMappingURL=SingleView.952ded85.js.map