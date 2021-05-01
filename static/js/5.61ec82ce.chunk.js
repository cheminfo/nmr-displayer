(this.webpackJsonpnmrium=this.webpackJsonpnmrium||[]).push([[5],{186:function(t,e,i){"use strict";i.d(e,"a",(function(){return _toConsumableArray}));var h=i(66);var n=i(50);function _toConsumableArray(t){return function _arrayWithoutHoles(t){if(Array.isArray(t))return Object(h.a)(t)}(t)||function _iterableToArray(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||Object(n.a)(t)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},189:function(t,e,i){"use strict";i.d(e,"b",(function(){return l})),i.d(e,"a",(function(){return HighlightProvider})),i.d(e,"d",(function(){return useHighlightData})),i.d(e,"c",(function(){return useHighlight}));var h=i(42),n=i(46),r=i(6),c=i(1),a=i(3),l={PEAK:"PEAK",INTEGRAL:"INTEGRAL",RANGE:"RANGE",ZONE:"ZONE",EXCLUSION_ZONE:"EXCLUSION_ZONE"},g=Object(c.createContext)();function highlightReducer(t,e){switch(e.type){case"SHOW":var i,h=e.payload,c=h.convertedHighlights,a=h.type,l=Object(r.a)(Object(r.a)({},t),{},{highlights:Object(r.a)({},t.highlights),type:a}),g=Object(n.a)(c);try{for(g.s();!(i=g.n()).done;){var o=i.value;o in l.highlights||(l.highlights[o]=1)}}catch(j){g.e(j)}finally{g.f()}return l.highlighted=Object.keys(l.highlights),l;case"HIDE":var d,s=e.payload.convertedHighlights,u=Object(r.a)(Object(r.a)({},t),{},{highlights:Object(r.a)({},t.highlights),type:null}),b=Object(n.a)(s);try{for(b.s();!(d=b.n()).done;){var O=d.value;O in u.highlights&&delete u.highlights[O]}}catch(j){b.e(j)}finally{b.f()}return u.highlighted=Object.keys(u.highlights),u;case"SET_PERMANENT":return Object(r.a)(Object(r.a)({},t),{},{highlightedPermanently:e.payload});case"UNSET_PERMANENT":return Object(r.a)(Object(r.a)({},t),{},{highlightedPermanently:[]});default:throw new Error("unknown action type: ".concat(e.type))}}var o={highlights:{},highlighted:[],highlightedPermanently:[],type:null};function HighlightProvider(t){var e=Object(c.useReducer)(highlightReducer,o),i=Object(h.a)(e,2),n=i[0],r=i[1],l=Object(c.useMemo)((function(){return{highlight:n,dispatch:r}}),[n]);return Object(a.jsx)(g.Provider,{value:l,children:t.children})}function useHighlightData(){return Object(c.useContext)(g)}function useHighlight(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(!Array.isArray(t))throw new Error("highlights must be an array");var i=useHighlightData(),h=Object(c.useMemo)((function(){var e,i=[],h=Object(n.a)(t);try{for(h.s();!(e=h.n()).done;){var r=e.value;if("string"!==typeof r&&"number"!==typeof r)throw new Error("highlight key must be a string or number");""!==r&&i.push(String(r))}}catch(c){h.e(c)}finally{h.f()}return i}),[t]);Object(c.useEffect)((function(){return function(){i.dispatch({type:"HIDE",payload:{convertedHighlights:h}}),i.dispatch({type:"UNSET_PERMANENT"})}}),[]);var r=Object(c.useMemo)((function(){return i.highlight.highlighted.some((function(t){return h.includes(t)}))}),[i.highlight.highlighted,h]),a=Object(c.useMemo)((function(){return i.highlight.highlightedPermanently.some((function(t){return h.includes(t)}))}),[i.highlight.highlightedPermanently,h]),l=Object(c.useCallback)((function(){i.dispatch({type:"SHOW",payload:{convertedHighlights:h,type:e}})}),[i,h,e]),g=Object(c.useCallback)((function(){i.dispatch({type:"HIDE",payload:{convertedHighlights:h}})}),[i,h]),o=Object(c.useCallback)((function(t){i.dispatch({type:"SHOW",payload:{convertedHighlights:[],id:t}})}),[i]),d=Object(c.useCallback)((function(t){i.dispatch({type:"HIDE",payload:{convertedHighlights:[],id:t}})}),[i]),s=Object(c.useCallback)((function(t){t&&(t.preventDefault(),t.stopPropagation()),a?i.dispatch({type:"UNSET_PERMANENT"}):i.dispatch({type:"SET_PERMANENT",payload:h})}),[i,h,a]),u={onMouseEnter:l,onMouseLeave:g},b={onClick:s};return{isActive:r,show:l,hide:g,onHover:u,onClick:b,isActivePermanently:a,click:s,add:o,remove:d}}},781:function(t,e,i){"use strict";i.r(e),i.d(e,"default",(function(){return TestHighlight}));var h,n,r,c,a,l=i(6),g=i(186),o=i(15),d=i(12),s=i(189),u=i(5),b=[{id:"A",highlight:[1,2]},{id:"B",highlight:[0]},{id:"C",highlight:[]},{id:"D",highlight:[3,4]},{id:"E",highlight:[1,2,3]},{id:"F",highlight:[2,4]}],O=[{id:"1",highlight:["F"]},{id:"2",highlight:["E"]},{id:"3",highlight:["A","B"]},{id:"4",highlight:["B","C","F"]},{id:"5",highlight:[]}],j=Object(d.b)(h||(h=Object(o.a)(["\n  display: flex;\n  padding: 20px;\n"]))),p=Object(d.b)(n||(n=Object(o.a)(["\n  padding: 20px;\n"]))),y=Object(d.b)(r||(r=Object(o.a)(["\n  border: 1px solid black;\n"]))),f=Object(d.b)(c||(c=Object(o.a)(["\n  padding: 5px;\n  font-weight: 600;\n"]))),v=Object(d.b)(a||(a=Object(o.a)(["\n  padding: 5px;\n"])));function TestHighlight(){return Object(u.b)(s.a,{children:Object(u.c)("div",{css:j,children:[Object(u.b)("div",{css:p,children:Object(u.b)(HighlightTable,{data:b})}),Object(u.b)("div",{css:p,children:Object(u.b)(HighlightTable,{data:O})})]})})}function HighlightTable(t){return Object(u.c)("table",{css:y,children:[Object(u.b)("thead",{children:Object(u.c)("tr",{children:[Object(u.b)("th",{css:f,children:"ID"}),Object(u.b)("th",{css:f,children:"Highlight ids"})]})}),Object(u.b)("tbody",{children:t.data.map((function(t){return Object(u.b)(Tr,{value:t},t.id)}))})]})}function Tr(t){var e=t.value,i=Object(s.c)([e.id].concat(Object(g.a)(e.highlight)));return Object(u.c)("tr",Object(l.a)(Object(l.a)({style:{backgroundColor:i.isActive?"red":"transparent"}},i.onHover),{},{children:[Object(u.b)("td",{css:v,children:e.id}),Object(u.b)("td",{css:v,children:e.highlight.join(", ")})]}),e.id)}}}]);
//# sourceMappingURL=5.61ec82ce.chunk.js.map