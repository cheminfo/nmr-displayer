(this.webpackJsonpnmrium=this.webpackJsonpnmrium||[]).push([[2],{179:function(e,t,n){},180:function(e,t,n){},181:function(e,t,n){"use strict";n.r(t);var i=n(6),a=n(4),r=n.n(a),c=n(28),l=n(9),s=n(62),o=n.n(s),d=n(49),b=n(42),u=n(89),j=n(1),h=n(82),p=n(15),f=n(12),O=n(41),y=(n(174),n(88)),g=n(46);function getMenu(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments.length>2?arguments[2]:void 0,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,r=t,c=[];for(var l in-1!==a&&r[a]&&(r[a]=Object(j.cloneElement)(r[a],{},c)),e){if(e[l].children&&Array.isArray(e[l].children)){var s=Object(j.createElement)(O.b,{key:l+n,title:e[l].groupName});return r.push(s),getMenu(e[l].children,r,n,0)}c.push(Object(j.createElement)(O.a,Object(i.a)({key:l+n},e[l]),e[l].title))}return r}function getFlatArray(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],i=n,a=Object(g.a)(t);try{for(a.s();!(e=a.n()).done;){var r=e.value;if(r.children&&Array.isArray(r.children))return getFlatArray(r.children,i);n.push(r)}}catch(c){a.e(c)}finally{a.f()}return i}function getKey(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=new RegExp(Object(d.a)(/^(.*)\/((?:(?!\/)[\s\S])*)$/g,{path:1,file:2})).exec(e),n="";if(t){var i=t[1].split("/");n=i.length>2?i[i.length-2]+i[i.length-1]:i[i.length-1]}return n+e.replace(/\.|\s|\//g,"")}var m,v,x,w,C,k,S,L,H=n(5),R=Object(f.b)(m||(m=Object(p.a)(["\n  background: #2ca8ff;\n  position: fixed;\n  top: 0;\n  height: 100%;\n  bottom: 0;\n  left: 0;\n  z-index: 1031;\n"]))),T=Object(f.b)(v||(v=Object(p.a)(["\n  width: 260px;\n"]))),D=Object(f.b)(x||(x=Object(p.a)(["\n  width: 3%;\n"]))),z=Object(f.b)(w||(w=Object(p.a)(["\n  margin-left: 4px;\n  margin-top: 2px;\n  margin-bottom: 2px;\n  margin-right: 4px;\n  z-index: 7;\n  font-size: 18px;\n  background-color: transparent;\n  border: none !important;\n  height: 30px;\n  width: 30px;\n  padding: 1px 6px;\n\n  & svg {\n    fill: white;\n  }\n\n  &:focus {\n    outline: none;\n  }\n\n  &:active {\n    background-color: rgba(0, 0, 0, 0.5);\n    border-radius: 50%;\n  }\n  &:hover {\n    background-color: rgba(0, 0, 0, 0.2);\n    border-radius: 50%;\n  }\n"]))),E=Object(f.b)(C||(C=Object(p.a)(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  z-index: 4;\n  border-bottom: 1px solid #eee;\n"]))),M=Object(f.b)(k||(k=Object(p.a)(["\n  text-transform: uppercase;\n  padding: 0.5rem 0;\n  display: block;\n  white-space: nowrap;\n  font-size: 1em;\n  color: #fff;\n  text-decoration: none;\n  font-weight: 400;\n  line-height: 30px;\n  overflow: hidden;\n"]))),_=Object(f.b)(S||(S=Object(p.a)(["\n  display: block;\n  opacity: 1;\n  transform: translateZ(0);\n"]))),A=Object(f.b)(L||(L=Object(p.a)(["\n  position: relative;\n  height: calc(100vh - 75px);\n  overflow-y: auto;\n  overflow-x: hidden;\n  width: 260px;\n  z-index: 4;\n  padding-bottom: 100px;\n"])));function Sidebar(e){var t=Object(j.useMemo)((function(){return function buildMenu(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],n=[],a=Object(g.a)(t);try{for(a.s();!(e=a.n()).done;){var r=e.value,c=r.title||r.groupName;r.children&&Array.isArray(r.children)?n.push(getMenu([r],[],c)):n.push(Object(j.createElement)(O.a,Object(i.a)({key:r.title},r),r.title))}}catch(l){a.e(l)}finally{a.f()}return n}(e.routes,[])}),[e.routes]),n=e.menuIsClosed?"none":"block";return Object(H.c)("div",{css:Object(f.b)(R,e.menuIsClosed?D:T),children:[Object(H.c)("div",{css:E,children:[Object(H.b)("div",{style:{display:n,padding:"0.5rem 0.7rem"},children:Object(H.b)("a",{css:Object(f.b)(M,_),children:"NMRium"})}),Object(H.b)("button",{type:"button",css:z,onClick:e.onMenuToggle,children:Object(H.b)(y.b,{})})]}),Object(H.b)("div",{css:A,style:{display:n},children:Object(H.b)(O.c,{onClick:function onClick(t){e.history.push("/SamplesDashboard/".concat(Math.random().toString(36).replace("0.",""),"/").concat(t.item.props.view+getKey(t.item.props.file)))},mode:"inline",children:t})})]})}var P,N,U,I=Object(l.g)(Object(j.memo)(Sidebar)),J={Exam:Object(j.memo)(Object(j.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(6)]).then(n.bind(null,772))}))),Exercise:Object(j.memo)(Object(j.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(7)]).then(n.bind(null,776))}))),SingleView:Object(j.memo)(Object(j.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(8)]).then(n.bind(null,777))}))),Test:Object(j.memo)(Object(j.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(9)]).then(n.bind(null,778))}))),View:Object(j.memo)(Object(j.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(11)]).then(n.bind(null,779))}))),TwoInstances:Object(j.memo)(Object(j.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(10)]).then(n.bind(null,780))})))},B=Object(f.b)(P||(P=Object(p.a)(["\n  position: relative;\n  float: right;\n  height: 100%;\n  background-color: #ebecf1;\n"]))),F=Object(f.b)(N||(N=Object(p.a)(["\n  width: calc(100% - 260px);\n"]))),K=Object(f.b)(U||(U=Object(p.a)(["\n  width: 98%;\n  margin-left: 20px !important;\n"])));function RenderView(e){var t=e.match.params.id,n=e.prop,a=e.baseURL,r=n.view?n.view:"View",c=J[r];return Object(H.b)(c,Object(i.a)(Object(i.a)({},n),{},{id:getKey(n.file),baseURL:a}),t)}var V=function Dashboard(e){var t=e.routes,n=void 0===t?[]:t,a=e.baseURL,r=Object(j.useMemo)((function(){return function mapTreeToFlatArray(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],n=[],i=Object(g.a)(t);try{for(i.s();!(e=i.n()).done;){var a=e.value;a.children&&Array.isArray(a.children)?n=n.concat(getFlatArray([a],[])):n.push(a)}}catch(r){i.e(r)}finally{i.f()}return n}(n)}),[n]),c=Object(j.useState)(!1),s=Object(b.a)(c,2),o=s[0],d=s[1],u=Object(j.useCallback)((function(){return d(!o)}),[o]);return Object(H.c)("div",{style:{position:"relative",top:0,height:"100vh"},children:[Object(H.b)(I,Object(i.a)(Object(i.a)({},e),{},{routes:n,menuIsClosed:o,onMenuToggle:u})),Object(H.b)("div",{css:Object(f.b)(B,o?K:F),children:Object(H.b)(j.StrictMode,{children:Object(H.b)(j.Suspense,{fallback:Object(H.b)("div",{children:"Loading..."}),children:Object(H.c)(l.d,{children:[r.map((function(e){return Object(H.b)(l.b,{path:"/SamplesDashboard/:id/".concat(e.view+getKey(e.file)),render:function render(t){return Object(H.b)(RenderView,Object(i.a)(Object(i.a)({},t),{},{prop:e,baseURL:a}))}},getKey(e.file))})),r.length>0&&Object(H.b)(l.b,{path:"/",render:function render(){var e=r[0],t=e.view?e.view:"View",n=J[t];return Object(H.b)(n,Object(i.a)({},e[0]))}},getKey(r[0].file))]})})})})]})},X=n(86),$=n(87),Q=n(47),q=n(90),W=n(3),G=function(e){Object(Q.a)(SingleDisplayerLayout,e);var t=Object(q.a)(SingleDisplayerLayout);function SingleDisplayerLayout(){return Object(X.a)(this,SingleDisplayerLayout),t.apply(this,arguments)}return Object($.a)(SingleDisplayerLayout,[{key:"render",value:function render(){var e=this;return Object(W.jsx)("div",{style:{position:"relative",top:0,height:"100vh"},children:Object(W.jsx)("div",{style:{position:"absolute",display:"block",width:"99%",marginLeft:"auto",marginRight:"auto",height:"100%",backgroundColor:"ebecf1"},children:Object(W.jsx)(j.Suspense,{fallback:Object(W.jsx)("div",{children:"Loading..."}),children:Object(W.jsx)(l.d,{children:Object(W.jsx)(l.b,{path:"/",render:function render(t){var n=t.match.params.id,a=e.props.view?e.props.view:"SingleView",r=J[a];return Object(W.jsx)(r,Object(i.a)(Object(i.a)({},e.props),{},{id:getKey(e.props.patrh)}),n)}},getKey(this.props.path))})})})})}}]),SingleDisplayerLayout}(j.PureComponent),Y={bodyContainer:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",width:"100vw",backgroundColor:"#e3e3e3"},container:{width:"30%",height:"40%",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"10px",fontSize:"20px",textAlign:"center"},normal:{backgroundColor:"white",color:"black"},error:{backgroundColor:"red",color:"white"},errorHeader:{fontSize:"100px"},normalHeader:{fontSize:"24px"},loadButton:{fontSize:"12px",padding:"12px 40px",borderRadius:"10px",border:"1px solid #c70000",fontWeight:"bold",cursor:"pointer"}};function _loadData(){return(_loadData=Object(u.a)(o.a.mark((function _callee(e){var t,n;return o.a.wrap((function _callee$(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,fetch(e);case 2:return t=i.sent,i.prev=3,checkStatus(t),i.next=7,t.json();case 7:return n=i.sent,i.abrupt("return",n);case 11:return i.prev=11,i.t0=i.catch(3),console.log(i.t0),i.abrupt("return",null);case 15:case"end":return i.stop()}}),_callee,null,[[3,11]])})))).apply(this,arguments)}function checkStatus(e){if(!e.ok)throw new Error("HTTP ".concat(e.status," - ").concat(e.statusText));return e}var Z=function Main(e){var t=Object(j.useState)({isLoaded:!1,status:200,routes:[]}),n=Object(b.a)(t,2),a=n[0],r=n[1],c=Object(j.useState)(""),s=Object(b.a)(c,2),o=s[0],u=s[1],p=Object(j.useCallback)((function(){r({isLoaded:!0,status:200,routes:h})}),[]),f=window.location.href;return Object(j.useEffect)((function(){var e=new URL(f).searchParams;if(e.has("sampleURL")){var t=e.get("sampleURL");switch(function getFileExtension(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return e.substring(e.lastIndexOf(".")+1)}(t).toLowerCase()){case"json":u("multi"),function loadData(e){return _loadData.apply(this,arguments)}(t).then((function(e){if(e){var n=t.replace(Object(d.a)(/^(.*[\/\\])?(.*?\.(?:(?!\.)[\s\S])*?|)$/g,{url:1,filename:2}),"$1"),i=JSON.parse(JSON.stringify(e).replace(/\.\/+?/g,n));r({isLoaded:!0,status:200,routes:i,baseURL:n})}else r({isLoaded:!1,status:404,routes:[]})}));break;case"dx":case"jdx":u("single"),r({isLoaded:!0,status:200,path:t})}}else u("multi"),r({isLoaded:!0,status:200,routes:h,baseURL:"./"})}),[f]),a.isLoaded?o&&"single"===o?Object(W.jsx)(G,Object(i.a)(Object(i.a)({},e),{},{path:a.path})):Object(W.jsx)(l.a,{children:Object(W.jsx)(V,Object(i.a)(Object(i.a)({},e),{},{routes:a.routes,baseURL:a.baseURL}))}):Object(W.jsx)("div",{style:Y.bodyContainer,children:Object(W.jsx)("div",{style:Object(i.a)(Object(i.a)({},Y.container),200===a.status?Y.normal:Y.error),children:200===a.status?Object(W.jsxs)("div",{children:[Object(W.jsx)("p",{style:Y.normalHeader,children:"Please wait"}),Object(W.jsx)("p",{children:"We will redirect you in a minute"})]}):Object(W.jsxs)("div",{children:[Object(W.jsx)("p",{style:Y.errorHeader,children:"404"}),Object(W.jsx)("p",{children:"Resource not found."}),Object(W.jsx)("button",{style:Y.loadButton,type:"button",onClick:p,children:"Load local samples"})]})})})},ee=Object(j.lazy)((function(){return n.e(5).then(n.bind(null,781))}));n(178),n(179),n(180);r.a.render(Object(W.jsx)(c.a,{children:Object(W.jsxs)(l.d,{children:[Object(W.jsx)(l.b,{path:"/",render:function render(e){return Object(W.jsx)(Z,Object(i.a)({},e))}}),Object(W.jsx)(l.b,{path:"/test",component:function TestRoutes(){return Object(W.jsx)(j.Suspense,{fallback:null,children:Object(W.jsxs)(l.d,{children:[Object(W.jsx)(l.b,{path:"/test/highlight",component:ee}),Object(W.jsx)(l.b,{render:function render(){return Object(W.jsx)("div",{children:"Page not found"})}})]})})}})]})}),document.getElementById("root"))},82:function(e){e.exports=JSON.parse('[{"file":"empty","title":"blank"},{"groupName":"General","children":[{"file":"./data/cytisine/1H.json","title":"1H spectrum test"},{"file":"./data/ethylbenzene/cosy.json","title":"COSY ethylbenzene"},{"file":"./data/cytisine/2d/hsqc.json","title":"HSQC cytisine"},{"file":"./data/cytisine/2d/hmbc-only.json","title":"HMBC only cytisine"},{"file":"./data/cytisine/2d/hsqc_hmbc.json","title":"HSQC / HMBC cytisine"},{"file":"./data/cytisine/2d/all.json","title":"Full cytisine"},{"file":"./data/cytisine/2d/HMBC_HN_Cytisin.json","title":"1H, 15N HMQC cytisine"},{"file":"./data/50-78-2/linked-jcamp.json","title":"Linked jcamp"},{"file":"./data/cytisine/1Honly.json","title":"1H only jcamp"},{"file":"./data/cytisine/2d/cosy.json","title":"2D cosy"},{"file":"./data/cytisine/1D.json","title":"1D spectra test"},{"file":"./data/ethylvinylether/1h.json","title":"1H ethylvinylether"},{"file":"./data/cytisine/13CFID.json","title":"13C Spectrum"},{"file":"./data/cytisine/processed13C.json","title":"Processed 13C Spectrum"},{"file":"./data/cytisine/Big13C.json","title":"Big 13C"},{"file":"./data/xtc/XTC.json","title":"XTC"},{"file":"./data/xtc/XTClight.json","title":"XTC just links"},{"file":"./data/coffee/Coffee.json","title":"Coffee"},{"file":"./data/108-21-4/CoupledDecoupled13C.json","title":"13C Coupled / Decoupled"},{"file":"./data/cytisine/Dept.json","title":"DEPT"},{"file":"./data/19f/19f.json","title":"19F with baseline problems"},{"file":"./data/t1/t1.json","title":"T1 samples (1H + 13C)"},{"file":"./data/t2/t2.json","title":"T2 samples (1H + 13C)"},{"file":"","title":"Two instances","view":"TwoInstances"}]},{"groupName":"Simulate","children":[{"file":"./data/tests/simulated/d1-2-3-4-5-6-7-8.json","title":"\u03b4=1,2,3,4,5,6,7,8"},{"file":"./data/tests/simulated/d1-2-3-4-5-6-7-8HR.json","title":"\u03b4=1,2,3,4,5,6,7,8 HR"},{"file":"./data/tests/simulated/d1-1.2_j7.json","title":"\u03b4=1,1.2 J=7"},{"file":"./data/tests/simulated/d1-2_j7.json","title":"\u03b4=1,2 J=7"},{"file":"./data/tests/simulated/d1-2-3_j16-10-2.json","title":"\u03b4=1,2,3 J=2,10,16"},{"file":"./data/tests/simulated/d1-7_j7.json","title":"\u03b4=1,7 J=7"},{"file":"./data/tests/simulated/d1-2-3-4-5-6-7-8_baseline.json","title":"Tests with baseline"},{"file":"./data/tests/triangle/low-res.json","title":"Test low resolution"},{"file":"./data/tests/triangle/high-res.json","title":"Test high resolution"}]},{"groupName":"Exercises","children":[{"file":"./exercises/ethylvinylether/1h.json","title":"Exercise 1","view":"Exercise"},{"file":"./exercises/ethylbenzene/1h.json","title":"Exercise 2","view":"Exercise"}]},{"groupName":"Exam","children":[{"file":"./exercises/ethylvinylether/1h.json","title":"Exam 1","view":"Exam"}]}]')}},[[181,3,4]]]);
//# sourceMappingURL=main.a88beb09.chunk.js.map