import{r as e,j as t}from"./vendor.7b25c0b4.js";import{N as i}from"./NMRium.5786a73a.js";import"./index.00f155db.js";async function a(e){const t=await fetch(e);!function(e){if(!e.ok)throw new Error(`HTTP ${e.status} - ${e.statusText}`)}(t);return await t.json()}function s(s){const[n,l]=e.exports.useState(),{file:o,title:r,baseURL:f}=s;return e.exports.useEffect((()=>{o?a(o).then((e=>{const t=JSON.parse(JSON.stringify(e).replace(/\.\/+?/g,f));l(t)})):l({})}),[f,o,s]),t("div",{style:{height:"100%",marginLeft:30}},t("div",{style:{height:"60px",display:"flex",flexDirection:"column",position:"relative"}},t("h5",{style:{fontWeight:700,fontSize:"1.5em",lineHeight:"1.4em",marginBottom:"15px"}},"Display and process 1D NMR spectra from a JCAMP-DX file"),r&&t("p",{style:{marginTop:"-10px",marginBottom:"1rem",fontWeight:400,color:"#9a9a9a",fontSize:"0.7142em"}},r)),t("div",{style:{height:"calc(100% - 75px)",display:"flex",width:"100%"}},t("div",{style:{display:"flex",flexDirection:"row",width:"100%"}},t("div",{style:{width:"100%"}},t(i,{data:n,preferences:{general:{disableMultipletAnalysis:!0,hideSetSumFromMolecule:!0},panels:{hideInformationPanel:!0,hidePeaksPanel:!0,hideIntegralsPanel:!0,hideFiltersPanel:!0,hideMultipleSpectraAnalysisPanel:!0}}})))))}export default s;
//# sourceMappingURL=Teaching.5f56a4c7.js.map