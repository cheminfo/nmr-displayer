(this.webpackJsonpnmrium=this.webpackJsonpnmrium||[]).push([[9],{778:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return Test}));var a=n(62),r=n.n(a),c=n(42),s=n(89),i=n(1),o=n(222),u=n(3);function _loadData(){return(_loadData=Object(s.a)(r.a.mark((function _callee(e){var t,n;return r.a.wrap((function _callee$(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,fetch(e);case 2:return checkStatus(t=a.sent),a.next=6,t.json();case 6:return n=a.sent,a.abrupt("return",n);case 8:case"end":return a.stop()}}),_callee)})))).apply(this,arguments)}function checkStatus(e){if(!e.ok)throw new Error("HTTP ".concat(e.status," - ").concat(e.statusText));return e}function Test(e){var t=Object(i.useState)(),n=Object(c.a)(t,2),a=n[0],r=n[1],s=e.file,l=e.title;return Object(i.useEffect)((function(){s?function loadData(e){return _loadData.apply(this,arguments)}(s).then((function(e){r(e)})):r({})}),[s,e]),Object(u.jsxs)("div",{style:{height:"100%",display:"flex",flexDirection:"column",marginLeft:30},children:[Object(u.jsx)("h5",{style:{fontWeight:700,fontSize:"1.5em",lineHeight:"1.4em",marginBottom:"15px"},children:"Display and process 1D NMR spectra from a JCAMP-DX file"}),l&&Object(u.jsx)("p",{style:{marginTop:"-10px",marginBottom:"1rem",fontWeight:400,color:"#9a9a9a",fontSize:"0.7142em"},children:l}),Object(u.jsx)(o.a,{data:a,preferences:{panels:{hidePeaksPanel:!0,hideStructuresPanel:!0}}}),Object(u.jsx)("div",{style:{width:"100%",height:"100px",border:"1px dashed black",display:"flex",justifyContent:"center",alignItems:"center"},children:Object(u.jsx)("p",{children:"You can add you component here or you can design your custom layout. be sure to add view prop inside sample.json and value must match view name under demo/components/views"})})]})}}}]);
//# sourceMappingURL=9.5ba46f3a.chunk.js.map