(()=>{var br=Object.defineProperty;var no=i=>{throw TypeError(i)};var xr=(i,e,t)=>e in i?br(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var X=(i,e,t)=>xr(i,typeof e!="symbol"?e+"":e,t),kr=(i,e,t)=>e.has(i)||no("Cannot "+t);var oo=(i,e,t)=>e.has(i)?no("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t);var Pt=(i,e,t)=>(kr(i,e,"access private method"),t);function hn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Je=hn();function co(i){Je=i}var po=/[&<>"']/,yr=new RegExp(po.source,"g"),uo=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,wr=new RegExp(uo.source,"g"),Tr={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ro=i=>Tr[i];function ke(i,e){if(e){if(po.test(i))return i.replace(yr,ro)}else if(uo.test(i))return i.replace(wr,ro);return i}var _r=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;function Er(i){return i.replace(_r,(e,t)=>(t=t.toLowerCase(),t==="colon"?":":t.charAt(0)==="#"?t.charAt(1)==="x"?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""))}var vr=/(^|[^\[])\^/g;function j(i,e){let t=typeof i=="string"?i:i.source;e=e||"";let n={replace:(s,a)=>{let r=typeof a=="string"?a:a.source;return r=r.replace(vr,"$1"),t=t.replace(s,r),n},getRegex:()=>new RegExp(t,e)};return n}function io(i){try{i=encodeURI(i).replace(/%25/g,"%")}catch(e){return null}return i}var wt={exec:()=>null};function so(i,e){let t=i.replace(/\|/g,(a,r,c)=>{let d=!1,b=r;for(;--b>=0&&c[b]==="\\";)d=!d;return d?"|":" |"}),n=t.split(/ \|/),s=0;if(n[0].trim()||n.shift(),n.length>0&&!n[n.length-1].trim()&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;s<n.length;s++)n[s]=n[s].trim().replace(/\\\|/g,"|");return n}function $t(i,e,t){let n=i.length;if(n===0)return"";let s=0;for(;s<n;){let a=i.charAt(n-s-1);if(a===e&&!t)s++;else if(a!==e&&t)s++;else break}return i.slice(0,n-s)}function Sr(i,e){if(i.indexOf(e[1])===-1)return-1;let t=0;for(let n=0;n<i.length;n++)if(i[n]==="\\")n++;else if(i[n]===e[0])t++;else if(i[n]===e[1]&&(t--,t<0))return n;return-1}function ao(i,e,t,n){let s=e.href,a=e.title?ke(e.title):null,r=i[1].replace(/\\([\[\]])/g,"$1");if(i[0].charAt(0)!=="!"){n.state.inLink=!0;let c={type:"link",raw:t,href:s,title:a,text:r,tokens:n.inlineTokens(r)};return n.state.inLink=!1,c}return{type:"image",raw:t,href:s,title:a,text:ke(r)}}function Ar(i,e){let t=i.match(/^(\s+)(?:```)/);if(t===null)return e;let n=t[1];return e.split(`
`).map(s=>{let a=s.match(/^\s+/);if(a===null)return s;let[r]=a;return r.length>=n.length?s.slice(n.length):s}).join(`
`)}var lt=class{constructor(e){X(this,"options");X(this,"rules");X(this,"lexer");this.options=e||Je}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:$t(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=Ar(n,t[3]||"");return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(/#$/.test(n)){let s=$t(n,"#");(this.options.pedantic||!s||/ $/.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:t[0]}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=t[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,`
    $1`);n=$t(n.replace(/^ *>[ \t]?/gm,""),`
`);let s=this.lexer.state.top;this.lexer.state.top=!0;let a=this.lexer.blockTokens(n);return this.lexer.state.top=s,{type:"blockquote",raw:t[0],tokens:a,text:n}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,a={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let r=new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),c="",d="",b=!1;for(;e;){let g=!1;if(!(t=r.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let w=t[2].split(`
`,1)[0].replace(/^\t+/,ae=>" ".repeat(3*ae.length)),y=e.split(`
`,1)[0],E=0;this.options.pedantic?(E=2,d=w.trimStart()):(E=t[2].search(/[^ ]/),E=E>4?1:E,d=w.slice(E),E+=t[1].length);let Z=!1;if(!w&&/^ *$/.test(y)&&(c+=y+`
`,e=e.substring(y.length+1),g=!0),!g){let ae=new RegExp(`^ {0,${Math.min(3,E-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),$=new RegExp(`^ {0,${Math.min(3,E-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),B=new RegExp(`^ {0,${Math.min(3,E-1)}}(?:\`\`\`|~~~)`),G=new RegExp(`^ {0,${Math.min(3,E-1)}}#`);for(;e;){let le=e.split(`
`,1)[0];if(y=le,this.options.pedantic&&(y=y.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),B.test(y)||G.test(y)||ae.test(y)||$.test(e))break;if(y.search(/[^ ]/)>=E||!y.trim())d+=`
`+y.slice(E);else{if(Z||w.search(/[^ ]/)>=4||B.test(w)||G.test(w)||$.test(w))break;d+=`
`+y}!Z&&!y.trim()&&(Z=!0),c+=le+`
`,e=e.substring(le.length+1),w=y.slice(E)}}a.loose||(b?a.loose=!0:/\n *\n *$/.test(c)&&(b=!0));let z=null,O;this.options.gfm&&(z=/^\[[ xX]\] /.exec(d),z&&(O=z[0]!=="[ ] ",d=d.replace(/^\[[ xX]\] +/,""))),a.items.push({type:"list_item",raw:c,task:!!z,checked:O,loose:!1,text:d,tokens:[]}),a.raw+=c}a.items[a.items.length-1].raw=c.trimEnd(),a.items[a.items.length-1].text=d.trimEnd(),a.raw=a.raw.trimEnd();for(let g=0;g<a.items.length;g++)if(this.lexer.state.top=!1,a.items[g].tokens=this.lexer.blockTokens(a.items[g].text,[]),!a.loose){let w=a.items[g].tokens.filter(E=>E.type==="space"),y=w.length>0&&w.some(E=>/\n.*\n/.test(E.raw));a.loose=y}if(a.loose)for(let g=0;g<a.items.length;g++)a.items[g].loose=!0;return a}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(/\s+/g," "),s=t[2]?t[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",a=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:a}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!/[:|]/.test(t[2]))return;let n=so(t[1]),s=t[2].replace(/^\||\| *$/g,"").split("|"),a=t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split(`
`):[],r={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let c of s)/^ *-+: *$/.test(c)?r.align.push("right"):/^ *:-+: *$/.test(c)?r.align.push("center"):/^ *:-+ *$/.test(c)?r.align.push("left"):r.align.push(null);for(let c of n)r.header.push({text:c,tokens:this.lexer.inline(c)});for(let c of a)r.rows.push(so(c,r.header.length).map(d=>({text:d,tokens:this.lexer.inline(d)})));return r}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:ke(t[1])}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&/^</.test(n)){if(!/>$/.test(n))return;let r=$t(n.slice(0,-1),"\\");if((n.length-r.length)%2===0)return}else{let r=Sr(t[2],"()");if(r>-1){let d=(t[0].indexOf("!")===0?5:4)+t[1].length+r;t[2]=t[2].substring(0,r),t[0]=t[0].substring(0,d).trim(),t[3]=""}}let s=t[2],a="";if(this.options.pedantic){let r=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(s);r&&(s=r[1],a=r[3])}else a=t[3]?t[3].slice(1,-1):"";return s=s.trim(),/^</.test(s)&&(this.options.pedantic&&!/>$/.test(n)?s=s.slice(1):s=s.slice(1,-1)),ao(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:a&&a.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(/\s+/g," "),a=t[s.toLowerCase()];if(!a){let r=n[0].charAt(0);return{type:"text",raw:r,text:r}}return ao(n,a,n[0],this.lexer)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!s||s[3]&&n.match(/[\p{L}\p{N}]/u))return;if(!(s[1]||s[2]||"")||!n||this.rules.inline.punctuation.exec(n)){let r=[...s[0]].length-1,c,d,b=r,g=0,w=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(w.lastIndex=0,t=t.slice(-1*e.length+r);(s=w.exec(t))!=null;){if(c=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!c)continue;if(d=[...c].length,s[3]||s[4]){b+=d;continue}else if((s[5]||s[6])&&r%3&&!((r+d)%3)){g+=d;continue}if(b-=d,b>0)continue;d=Math.min(d,d+b+g);let y=[...s[0]][0].length,E=e.slice(0,r+s.index+y+d);if(Math.min(r,d)%2){let z=E.slice(1,-1);return{type:"em",raw:E,text:z,tokens:this.lexer.inlineTokens(z)}}let Z=E.slice(2,-2);return{type:"strong",raw:E,text:Z,tokens:this.lexer.inlineTokens(Z)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(/\n/g," "),s=/[^ ]/.test(n),a=/^ /.test(n)&&/ $/.test(n);return s&&a&&(n=n.substring(1,n.length-1)),n=ke(n,!0),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){let t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=ke(t[1]),s="mailto:"+n):(n=ke(t[1]),s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){var n,s;let t;if(t=this.rules.inline.url.exec(e)){let a,r;if(t[2]==="@")a=ke(t[0]),r="mailto:"+a;else{let c;do c=t[0],t[0]=(s=(n=this.rules.inline._backpedal.exec(t[0]))==null?void 0:n[0])!=null?s:"";while(c!==t[0]);a=ke(t[0]),t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:a,href:r,tokens:[{type:"text",raw:a,text:a}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n;return this.lexer.state.inRawBlock?n=t[0]:n=ke(t[0]),{type:"text",raw:t[0],text:n}}}},Cr=/^(?: *(?:\n|$))+/,Rr=/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,Mr=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,_t=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Nr=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,fo=/(?:[*+-]|\d{1,9}[.)])/,ho=j(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,fo).replace(/blockCode/g,/ {4}/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),mn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Lr=/^[^\n]+/,gn=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Or=j(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label",gn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Ir=j(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,fo).getRegex(),Ut="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",bn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,zr=j("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))","i").replace("comment",bn).replace("tag",Ut).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),mo=j(mn).replace("hr",_t).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex(),Dr=j(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",mo).getRegex(),xn={blockquote:Dr,code:Rr,def:Or,fences:Mr,heading:Nr,hr:_t,html:zr,lheading:ho,list:Ir,newline:Cr,paragraph:mo,table:wt,text:Lr},lo=j("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",_t).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex(),Pr={...xn,table:lo,paragraph:j(mn).replace("hr",_t).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",lo).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex()},$r={...xn,html:j(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",bn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:wt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:j(mn).replace("hr",_t).replace("heading",` *#{1,6} *[^
]`).replace("lheading",ho).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},go=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Fr=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,bo=/^( {2,}|\\)\n(?!\s*$)/,Hr=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Et="\\p{P}\\p{S}",Ur=j(/^((?![*_])[\spunctuation])/,"u").replace(/punctuation/g,Et).getRegex(),Br=/\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g,qr=j(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,"u").replace(/punct/g,Et).getRegex(),Wr=j("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])","gu").replace(/punct/g,Et).getRegex(),jr=j("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])","gu").replace(/punct/g,Et).getRegex(),Gr=j(/\\([punct])/,"gu").replace(/punct/g,Et).getRegex(),Yr=j(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Zr=j(bn).replace("(?:-->|$)","-->").getRegex(),Vr=j("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Zr).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ht=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Xr=j(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",Ht).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),xo=j(/^!?\[(label)\]\[(ref)\]/).replace("label",Ht).replace("ref",gn).getRegex(),ko=j(/^!?\[(ref)\](?:\[\])?/).replace("ref",gn).getRegex(),Qr=j("reflink|nolink(?!\\()","g").replace("reflink",xo).replace("nolink",ko).getRegex(),kn={_backpedal:wt,anyPunctuation:Gr,autolink:Yr,blockSkip:Br,br:bo,code:Fr,del:wt,emStrongLDelim:qr,emStrongRDelimAst:Wr,emStrongRDelimUnd:jr,escape:go,link:Xr,nolink:ko,punctuation:Ur,reflink:xo,reflinkSearch:Qr,tag:Vr,text:Hr,url:wt},Jr={...kn,link:j(/^!?\[(label)\]\((.*?)\)/).replace("label",Ht).getRegex(),reflink:j(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ht).getRegex()},pn={...kn,escape:j(go).replace("])","~|])").getRegex(),url:j(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},Kr={...pn,br:j(bo).replace("{2,}","*").getRegex(),text:j(pn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Ft={normal:xn,gfm:Pr,pedantic:$r},yt={normal:kn,gfm:pn,breaks:Kr,pedantic:Jr},Ie=class i{constructor(e){X(this,"tokens");X(this,"options");X(this,"state");X(this,"tokenizer");X(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Je,this.options.tokenizer=this.options.tokenizer||new lt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={block:Ft.normal,inline:yt.normal};this.options.pedantic?(t.block=Ft.pedantic,t.inline=yt.pedantic):this.options.gfm&&(t.block=Ft.gfm,this.options.breaks?t.inline=yt.breaks:t.inline=yt.gfm),this.tokenizer.rules=t}static get rules(){return{block:Ft,inline:yt}}static lex(e,t){return new i(t).lex(e)}static lexInline(e,t){return new i(t).inlineTokens(e)}lex(e){e=e.replace(/\r\n|\r/g,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[]){this.options.pedantic?e=e.replace(/\t/g,"    ").replace(/^ +$/gm,""):e=e.replace(/^( *)(\t+)/gm,(c,d,b)=>d+"    ".repeat(b.length));let n,s,a,r;for(;e;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some(c=>(n=c.call({lexer:this},e,t))?(e=e.substring(n.raw.length),t.push(n),!0):!1))){if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length),n.raw.length===1&&t.length>0?t[t.length-1].raw+=`
`:t.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length),s=t[t.length-1],s&&(s.type==="paragraph"||s.type==="text")?(s.raw+=`
`+n.raw,s.text+=`
`+n.text,this.inlineQueue[this.inlineQueue.length-1].src=s.text):t.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length),s=t[t.length-1],s&&(s.type==="paragraph"||s.type==="text")?(s.raw+=`
`+n.raw,s.text+=`
`+n.raw,this.inlineQueue[this.inlineQueue.length-1].src=s.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title});continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),t.push(n);continue}if(a=e,this.options.extensions&&this.options.extensions.startBlock){let c=1/0,d=e.slice(1),b;this.options.extensions.startBlock.forEach(g=>{b=g.call({lexer:this},d),typeof b=="number"&&b>=0&&(c=Math.min(c,b))}),c<1/0&&c>=0&&(a=e.substring(0,c+1))}if(this.state.top&&(n=this.tokenizer.paragraph(a))){s=t[t.length-1],r&&s.type==="paragraph"?(s.raw+=`
`+n.raw,s.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=s.text):t.push(n),r=a.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length),s=t[t.length-1],s&&s.type==="text"?(s.raw+=`
`+n.raw,s.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=s.text):t.push(n);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n,s,a,r=e,c,d,b;if(this.tokens.links){let g=Object.keys(this.tokens.links);if(g.length>0)for(;(c=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)g.includes(c[0].slice(c[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,c.index)+"["+"a".repeat(c[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(c=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)r=r.slice(0,c.index)+"["+"a".repeat(c[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(c=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,c.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;e;)if(d||(b=""),d=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some(g=>(n=g.call({lexer:this},e,t))?(e=e.substring(n.raw.length),t.push(n),!0):!1))){if(n=this.tokenizer.escape(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.tag(e)){e=e.substring(n.raw.length),s=t[t.length-1],s&&n.type==="text"&&s.type==="text"?(s.raw+=n.raw,s.text+=n.text):t.push(n);continue}if(n=this.tokenizer.link(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(n.raw.length),s=t[t.length-1],s&&n.type==="text"&&s.type==="text"?(s.raw+=n.raw,s.text+=n.text):t.push(n);continue}if(n=this.tokenizer.emStrong(e,r,b)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.codespan(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.br(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.del(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.autolink(e)){e=e.substring(n.raw.length),t.push(n);continue}if(!this.state.inLink&&(n=this.tokenizer.url(e))){e=e.substring(n.raw.length),t.push(n);continue}if(a=e,this.options.extensions&&this.options.extensions.startInline){let g=1/0,w=e.slice(1),y;this.options.extensions.startInline.forEach(E=>{y=E.call({lexer:this},w),typeof y=="number"&&y>=0&&(g=Math.min(g,y))}),g<1/0&&g>=0&&(a=e.substring(0,g+1))}if(n=this.tokenizer.inlineText(a)){e=e.substring(n.raw.length),n.raw.slice(-1)!=="_"&&(b=n.raw.slice(-1)),d=!0,s=t[t.length-1],s&&s.type==="text"?(s.raw+=n.raw,s.text+=n.text):t.push(n);continue}if(e){let g="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(g);break}else throw new Error(g)}}return t}},ct=class{constructor(e){X(this,"options");this.options=e||Je}code(e,t,n){var a;let s=(a=(t||"").match(/^\S*/))==null?void 0:a[0];return e=e.replace(/\n$/,"")+`
`,s?'<pre><code class="language-'+ke(s)+'">'+(n?e:ke(e,!0))+`</code></pre>
`:"<pre><code>"+(n?e:ke(e,!0))+`</code></pre>
`}blockquote(e){return`<blockquote>
${e}</blockquote>
`}html(e,t){return e}heading(e,t,n){return`<h${t}>${e}</h${t}>
`}hr(){return`<hr>
`}list(e,t,n){let s=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+s+a+`>
`+e+"</"+s+`>
`}listitem(e,t,n){return`<li>${e}</li>
`}checkbox(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph(e){return`<p>${e}</p>
`}table(e,t){return t&&(t=`<tbody>${t}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+t+`</table>
`}tablerow(e){return`<tr>
${e}</tr>
`}tablecell(e,t){let n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong(e){return`<strong>${e}</strong>`}em(e){return`<em>${e}</em>`}codespan(e){return`<code>${e}</code>`}br(){return"<br>"}del(e){return`<del>${e}</del>`}link(e,t,n){let s=io(e);if(s===null)return n;e=s;let a='<a href="'+e+'"';return t&&(a+=' title="'+t+'"'),a+=">"+n+"</a>",a}image(e,t,n){let s=io(e);if(s===null)return n;e=s;let a=`<img src="${e}" alt="${n}"`;return t&&(a+=` title="${t}"`),a+=">",a}text(e){return e}},Tt=class{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,n){return""+n}image(e,t,n){return""+n}br(){return""}},ze=class i{constructor(e){X(this,"options");X(this,"renderer");X(this,"textRenderer");this.options=e||Je,this.options.renderer=this.options.renderer||new ct,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new Tt}static parse(e,t){return new i(t).parse(e)}static parseInline(e,t){return new i(t).parseInline(e)}parse(e,t=!0){let n="";for(let s=0;s<e.length;s++){let a=e[s];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[a.type]){let r=a,c=this.options.extensions.renderers[r.type].call({parser:this},r);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(r.type)){n+=c||"";continue}}switch(a.type){case"space":continue;case"hr":{n+=this.renderer.hr();continue}case"heading":{let r=a;n+=this.renderer.heading(this.parseInline(r.tokens),r.depth,Er(this.parseInline(r.tokens,this.textRenderer)));continue}case"code":{let r=a;n+=this.renderer.code(r.text,r.lang,!!r.escaped);continue}case"table":{let r=a,c="",d="";for(let g=0;g<r.header.length;g++)d+=this.renderer.tablecell(this.parseInline(r.header[g].tokens),{header:!0,align:r.align[g]});c+=this.renderer.tablerow(d);let b="";for(let g=0;g<r.rows.length;g++){let w=r.rows[g];d="";for(let y=0;y<w.length;y++)d+=this.renderer.tablecell(this.parseInline(w[y].tokens),{header:!1,align:r.align[y]});b+=this.renderer.tablerow(d)}n+=this.renderer.table(c,b);continue}case"blockquote":{let r=a,c=this.parse(r.tokens);n+=this.renderer.blockquote(c);continue}case"list":{let r=a,c=r.ordered,d=r.start,b=r.loose,g="";for(let w=0;w<r.items.length;w++){let y=r.items[w],E=y.checked,Z=y.task,z="";if(y.task){let O=this.renderer.checkbox(!!E);b?y.tokens.length>0&&y.tokens[0].type==="paragraph"?(y.tokens[0].text=O+" "+y.tokens[0].text,y.tokens[0].tokens&&y.tokens[0].tokens.length>0&&y.tokens[0].tokens[0].type==="text"&&(y.tokens[0].tokens[0].text=O+" "+y.tokens[0].tokens[0].text)):y.tokens.unshift({type:"text",text:O+" "}):z+=O+" "}z+=this.parse(y.tokens,b),g+=this.renderer.listitem(z,Z,!!E)}n+=this.renderer.list(g,c,d);continue}case"html":{let r=a;n+=this.renderer.html(r.text,r.block);continue}case"paragraph":{let r=a;n+=this.renderer.paragraph(this.parseInline(r.tokens));continue}case"text":{let r=a,c=r.tokens?this.parseInline(r.tokens):r.text;for(;s+1<e.length&&e[s+1].type==="text";)r=e[++s],c+=`
`+(r.tokens?this.parseInline(r.tokens):r.text);n+=t?this.renderer.paragraph(c):c;continue}default:{let r='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(r),"";throw new Error(r)}}}return n}parseInline(e,t){t=t||this.renderer;let n="";for(let s=0;s<e.length;s++){let a=e[s];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[a.type]){let r=this.options.extensions.renderers[a.type].call({parser:this},a);if(r!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){n+=r||"";continue}}switch(a.type){case"escape":{let r=a;n+=t.text(r.text);break}case"html":{let r=a;n+=t.html(r.text);break}case"link":{let r=a;n+=t.link(r.href,r.title,this.parseInline(r.tokens,t));break}case"image":{let r=a;n+=t.image(r.href,r.title,r.text);break}case"strong":{let r=a;n+=t.strong(this.parseInline(r.tokens,t));break}case"em":{let r=a;n+=t.em(this.parseInline(r.tokens,t));break}case"codespan":{let r=a;n+=t.codespan(r.text);break}case"br":{n+=t.br();break}case"del":{let r=a;n+=t.del(this.parseInline(r.tokens,t));break}case"text":{let r=a;n+=t.text(r.text);break}default:{let r='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(r),"";throw new Error(r)}}}return n}},Ve=class{constructor(e){X(this,"options");this.options=e||Je}preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}};X(Ve,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));var Qe,fn,yo,un=class{constructor(...e){oo(this,Qe);X(this,"defaults",hn());X(this,"options",this.setOptions);X(this,"parse",Pt(this,Qe,fn).call(this,Ie.lex,ze.parse));X(this,"parseInline",Pt(this,Qe,fn).call(this,Ie.lexInline,ze.parseInline));X(this,"Parser",ze);X(this,"Renderer",ct);X(this,"TextRenderer",Tt);X(this,"Lexer",Ie);X(this,"Tokenizer",lt);X(this,"Hooks",Ve);this.use(...e)}walkTokens(e,t){var s,a;let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case"table":{let c=r;for(let d of c.header)n=n.concat(this.walkTokens(d.tokens,t));for(let d of c.rows)for(let b of d)n=n.concat(this.walkTokens(b.tokens,t));break}case"list":{let c=r;n=n.concat(this.walkTokens(c.items,t));break}default:{let c=r;(a=(s=this.defaults.extensions)==null?void 0:s.childTokens)!=null&&a[c.type]?this.defaults.extensions.childTokens[c.type].forEach(d=>{let b=c[d].flat(1/0);n=n.concat(this.walkTokens(b,t))}):c.tokens&&(n=n.concat(this.walkTokens(c.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(a=>{if(!a.name)throw new Error("extension name required");if("renderer"in a){let r=t.renderers[a.name];r?t.renderers[a.name]=function(...c){let d=a.renderer.apply(this,c);return d===!1&&(d=r.apply(this,c)),d}:t.renderers[a.name]=a.renderer}if("tokenizer"in a){if(!a.level||a.level!=="block"&&a.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let r=t[a.level];r?r.unshift(a.tokenizer):t[a.level]=[a.tokenizer],a.start&&(a.level==="block"?t.startBlock?t.startBlock.push(a.start):t.startBlock=[a.start]:a.level==="inline"&&(t.startInline?t.startInline.push(a.start):t.startInline=[a.start]))}"childTokens"in a&&a.childTokens&&(t.childTokens[a.name]=a.childTokens)}),s.extensions=t),n.renderer){let a=this.defaults.renderer||new ct(this.defaults);for(let r in n.renderer){if(!(r in a))throw new Error(`renderer '${r}' does not exist`);if(r==="options")continue;let c=r,d=n.renderer[c],b=a[c];a[c]=(...g)=>{let w=d.apply(a,g);return w===!1&&(w=b.apply(a,g)),w||""}}s.renderer=a}if(n.tokenizer){let a=this.defaults.tokenizer||new lt(this.defaults);for(let r in n.tokenizer){if(!(r in a))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;let c=r,d=n.tokenizer[c],b=a[c];a[c]=(...g)=>{let w=d.apply(a,g);return w===!1&&(w=b.apply(a,g)),w}}s.tokenizer=a}if(n.hooks){let a=this.defaults.hooks||new Ve;for(let r in n.hooks){if(!(r in a))throw new Error(`hook '${r}' does not exist`);if(r==="options")continue;let c=r,d=n.hooks[c],b=a[c];Ve.passThroughHooks.has(r)?a[c]=g=>{if(this.defaults.async)return Promise.resolve(d.call(a,g)).then(y=>b.call(a,y));let w=d.call(a,g);return b.call(a,w)}:a[c]=(...g)=>{let w=d.apply(a,g);return w===!1&&(w=b.apply(a,g)),w}}s.hooks=a}if(n.walkTokens){let a=this.defaults.walkTokens,r=n.walkTokens;s.walkTokens=function(c){let d=[];return d.push(r.call(this,c)),a&&(d=d.concat(a.call(this,c))),d}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Ie.lex(e,t!=null?t:this.defaults)}parser(e,t){return ze.parse(e,t!=null?t:this.defaults)}};Qe=new WeakSet,fn=function(e,t){return(n,s)=>{let a={...s},r={...this.defaults,...a};this.defaults.async===!0&&a.async===!1&&(r.silent||console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."),r.async=!0);let c=Pt(this,Qe,yo).call(this,!!r.silent,!!r.async);if(typeof n=="undefined"||n===null)return c(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return c(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));if(r.hooks&&(r.hooks.options=r),r.async)return Promise.resolve(r.hooks?r.hooks.preprocess(n):n).then(d=>e(d,r)).then(d=>r.hooks?r.hooks.processAllTokens(d):d).then(d=>r.walkTokens?Promise.all(this.walkTokens(d,r.walkTokens)).then(()=>d):d).then(d=>t(d,r)).then(d=>r.hooks?r.hooks.postprocess(d):d).catch(c);try{r.hooks&&(n=r.hooks.preprocess(n));let d=e(n,r);r.hooks&&(d=r.hooks.processAllTokens(d)),r.walkTokens&&this.walkTokens(d,r.walkTokens);let b=t(d,r);return r.hooks&&(b=r.hooks.postprocess(b)),b}catch(d){return c(d)}}},yo=function(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+ke(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}};var Xe=new un;function q(i,e){return Xe.parse(i,e)}q.options=q.setOptions=function(i){return Xe.setOptions(i),q.defaults=Xe.defaults,co(q.defaults),q};q.getDefaults=hn;q.defaults=Je;q.use=function(...i){return Xe.use(...i),q.defaults=Xe.defaults,co(q.defaults),q};q.walkTokens=function(i,e){return Xe.walkTokens(i,e)};q.parseInline=Xe.parseInline;q.Parser=ze;q.parser=ze.parse;q.Renderer=ct;q.TextRenderer=Tt;q.Lexer=Ie;q.lexer=Ie.lex;q.Tokenizer=lt;q.Hooks=Ve;q.parse=q;var Wi=q.options,ji=q.setOptions,Gi=q.use,Yi=q.walkTokens,Zi=q.parseInline;var Vi=ze.parse,Xi=Ie.lex;function ei(i,e){this.v=i,this.k=e}function wo(i,e){(e==null||e>i.length)&&(e=i.length);for(var t=0,n=Array(e);t<e;t++)n[t]=i[t];return n}function ti(i){if(Array.isArray(i))return i}function ni(i,e){var t=i==null?null:typeof Symbol!="undefined"&&i[Symbol.iterator]||i["@@iterator"];if(t!=null){var n,s,a,r,c=[],d=!0,b=!1;try{if(a=(t=t.call(i)).next,e===0){if(Object(t)!==t)return;d=!1}else for(;!(d=(n=a.call(t)).done)&&(c.push(n.value),c.length!==e);d=!0);}catch(g){b=!0,s=g}finally{try{if(!d&&t.return!=null&&(r=t.return(),Object(r)!==r))return}finally{if(b)throw s}}return c}}function oi(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ri(i,e){return ti(i)||ni(i,e)||ii(i,e)||oi()}function ii(i,e){if(i){if(typeof i=="string")return wo(i,e);var t={}.toString.call(i).slice(8,-1);return t==="Object"&&i.constructor&&(t=i.constructor.name),t==="Map"||t==="Set"?Array.from(i):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?wo(i,e):void 0}}function Bt(i){var e,t;function n(a,r){try{var c=i[a](r),d=c.value,b=d instanceof ei;Promise.resolve(b?d.v:d).then(function(g){if(b){var w=a==="return"&&d.k?a:"next";if(!d.k||g.done)return n(w,g);g=i[w](g).value}s(!!c.done,g)},function(g){n("throw",g)})}catch(g){s(2,g)}}function s(a,r){a===2?e.reject(r):e.resolve({value:r,done:a}),(e=e.next)?n(e.key,e.arg):t=null}this._invoke=function(a,r){return new Promise(function(c,d){var b={key:a,arg:r,resolve:c,reject:d,next:null};t?t=t.next=b:(e=t=b,n(a,r))})},typeof i.return!="function"&&(this.return=void 0)}Bt.prototype[typeof Symbol=="function"&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},Bt.prototype.next=function(i){return this._invoke("next",i)},Bt.prototype.throw=function(i){return this._invoke("throw",i)},Bt.prototype.return=function(i){return this._invoke("return",i)};var Do=Object.entries,To=Object.setPrototypeOf,si=Object.isFrozen,Po=Object.getPrototypeOf,$o=Object.getOwnPropertyDescriptor,ce=Object.freeze,ue=Object.seal,dt=Object.create,Fo=typeof Reflect!="undefined"&&Reflect,Rn=Fo.apply,Mn=Fo.construct;ce||(ce=function(e){return e});ue||(ue=function(e){return e});Rn||(Rn=function(e,t){for(var n=arguments.length,s=new Array(n>2?n-2:0),a=2;a<n;a++)s[a-2]=arguments[a];return e.apply(t,s)});Mn||(Mn=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),s=1;s<t;s++)n[s-1]=arguments[s];return new e(...n)});var De=J(Array.prototype.forEach);Array.prototype.indexOf;var ai=J(Array.prototype.lastIndexOf),_o=J(Array.prototype.pop),vt=J(Array.prototype.push),li=J(Array.prototype.slice),ci=J(Array.prototype.splice),pt=Array.isArray,yn=Ho(Set),wn=J(Set.prototype.add),St=J(Set.prototype.has),Ke=J(String.prototype.toLowerCase),Tn=J(String.prototype.toString),Eo=J(String.prototype.match),At=J(String.prototype.replace),vo=J(String.prototype.indexOf),di=J(String.prototype.trim),pi=J(Number.prototype.toString),ui=J(Boolean.prototype.toString),So=typeof BigInt=="undefined"?null:J(BigInt.prototype.toString),Ao=typeof Symbol=="undefined"?null:J(Symbol.prototype.toString),xe=J(Object.prototype.hasOwnProperty),Ct=J(Object.prototype.toString),pe=J(RegExp.prototype.test),Pe=Ho(TypeError);function J(i){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,n=new Array(t>1?t-1:0),s=1;s<t;s++)n[s-1]=arguments[s];return Rn(i,e,n)}}function Ho(i){return function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return Mn(i,t)}}function H(i,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Ke;if(To&&To(i,null),!pt(e))return i;let n=e.length;for(;n--;){let s=e[n];if(typeof s=="string"){let a=t(s);a!==s&&(si(e)||(e[n]=a),s=a)}i[s]=!0}return i}function fi(i){for(let e=0;e<i.length;e++)xe(i,e)||(i[e]=null);return i}function ye(i){let e=dt(null);for(let n of Do(i)){var t=ri(n,2);let s=t[0],a=t[1];xe(i,s)&&(pt(a)?e[s]=fi(a):a&&typeof a=="object"&&a.constructor===Object?e[s]=ye(a):e[s]=a)}return e}function hi(i){switch(typeof i){case"string":return i;case"number":return pi(i);case"boolean":return ui(i);case"bigint":return So?So(i):"0";case"symbol":return Ao?Ao(i):"Symbol()";case"undefined":return Ct(i);case"function":case"object":{if(i===null)return Ct(i);let e=i,t=_e(e,"toString");if(typeof t=="function"){let n=t(e);return typeof n=="string"?n:Ct(n)}return Ct(i)}default:return Ct(i)}}function _e(i,e){for(;i!==null;){let n=$o(i,e);if(n){if(n.get)return J(n.get);if(typeof n.value=="function")return J(n.value)}i=Po(i)}function t(){return null}return t}function mi(i,e){for(;i!==null;){let t=$o(i,e);if(t)return t.get?J(t.get):null;i=Po(i)}return null}function gi(i){try{return pe(i,""),!0}catch(e){return!1}}var Co=ce(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),_n=ce(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),En=ce(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),bi=ce(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),vn=ce(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),xi=ce(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Ro=ce(["#text"]),Mo=ce(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),Sn=ce(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),No=ce(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),qt=ce(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),ki=ue(/{{[\w\W]*|^[\w\W]*}}/g),yi=ue(/<%[\w\W]*|^[\w\W]*%>/g),wi=ue(/\${[\w\W]*/g),Ti=ue(/^data-[\-\w.\u00B7-\uFFFF]+$/),_i=ue(/^aria-[\-\w]+$/),Lo=ue(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ei=ue(/^(?:\w+script|data):/i),vi=ue(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Si=ue(/^html$/i),Ai=ue(/^[a-z][.\w]*(-[.\w]+)+$/i),An=ue(/<[/\w!]/g),Oo=ue(/<[/\w]/g),Ci=ue(/<\/no(script|embed|frames)/i),Io=ue(/\/>/i),re={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},Ri=ce(H({},["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"])),Mi=function(){return typeof window=="undefined"?null:window},Ni=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let n=null,s="data-tt-policy-suffix";t&&t.hasAttribute(s)&&(n=t.getAttribute(s));let a="dompurify"+(n?"#"+n:"");try{return e.createPolicy(a,{createHTML(r){return r},createScriptURL(r){return r}})}catch(r){return console.warn("TrustedTypes policy "+a+" could not be created."),null}},zo=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},Ue=function(e,t,n,s){return xe(e,t)&&pt(e[t])?H(s.base?ye(s.base):{},e[t],s.transform):n},Cn=function(e,t,n){let s=xe(e,t)?e[t]:void 0;return s&&typeof s=="object"?ye(s):n()};function Uo(){let i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Mi(),e=h=>Uo(h);if(e.version="3.4.17",e.removed=[],!i||!i.document||i.document.nodeType!==re.document||!i.Element)return e.isSupported=!1,e;let t=i.document,n=t,s=n.currentScript;i.DocumentFragment;let a=i.HTMLTemplateElement,r=i.Node,c=i.Element,d=i.NodeFilter;i.NamedNodeMap===void 0&&(i.NamedNodeMap||i.MozNamedAttrMap),i.HTMLFormElement;let b=i.DOMParser,g=i.trustedTypes,w=c.prototype,y=_e(w,"cloneNode"),E=_e(w,"remove"),Z=_e(w,"removeAttributeNode"),z=_e(w,"nextSibling"),O=_e(w,"childNodes"),ae=_e(w,"parentNode"),$=_e(w,"shadowRoot"),B=_e(w,"attributes"),G=r&&r.prototype?_e(r.prototype,"nodeType"):null,le=r&&r.prototype?_e(r.prototype,"nodeName"):null,te=r&&r.prototype?_e(r.prototype,"ownerDocument"):null,U=function(o){return G?G(o):o.nodeType},Y=function(o){return le?le(o):o.nodeName},Be=mi(w,"namespaceURI"),qe=function(o){return Be?Be(o):o.namespaceURI};if(typeof a=="function"){let h=t.createElement("template");h.content&&h.content.ownerDocument&&(t=h.content.ownerDocument)}let ee,Ae="",et,We=!1,Le=0,we=function(){if(Le>0)throw Pe('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},Ce=function(o){we(),Le++;try{return ee.createHTML(o)}finally{Le--}},jt=function(o){we(),Le++;try{return ee.createScriptURL(o)}finally{Le--}},ft=function(){return We||(et=Ni(g,s),We=!0),et},je=t,Ge=je.implementation,Oe=je.createNodeIterator,$e=je.createDocumentFragment,Te=je.getElementsByTagName,tt=n.importNode,F=zo();e.isSupported=typeof Do=="function"&&typeof ae=="function"&&Ge&&Ge.createHTMLDocument!==void 0;let Gt=ki,ht=yi,Rt=wi,Yt=Ti,mt=_i,gt=Ei,p=vi,m=Ai,x=Lo,k=null,S=H({},[...Co,..._n,...En,...vn,...Ro]),_=null,A=H({},[...Mo,...Sn,...No,...qt]),M=Object.seal(dt(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),C=null,W=null,I=Object.seal(dt(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),ie=!0,de=!0,fe=!1,me=!0,V=!1,D=!0,R=!1,K=!1,N=null,Q=null,P=!1,oe=!1,Mt=!1,Nt=!1,Ln=!0,On=!1,In="user-content-",Zt=!0,Vt=!1,Ye=null,nt={},Ze=null,zn=H({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]),Dn=null,Pn=H({},["audio","video","img","source","image","track"]),$n=null,Fn=H({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Lt="http://www.w3.org/1998/Math/MathML",Ot="http://www.w3.org/2000/svg",Re="http://www.w3.org/1999/xhtml",ot=Re,Xt=!1,Qt=null,Qo=H({},[Lt,Ot,Re],Tn),Hn=ce(["mi","mo","mn","ms","mtext"]),Jt=H({},Hn),Un=ce(["annotation-xml"]),Kt=H({},Un),Jo=H({},["title","style","font","a","script"]),bt=null,Ko=["application/xhtml+xml","text/html"],er="text/html",ne=null,rt=null,tr=t.createElement("form"),Bn=function(o){return o instanceof RegExp||o instanceof Function},en=function(){let o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(rt&&rt===o)return;(!o||typeof o!="object")&&(o={}),o=ye(o),bt=Ko.indexOf(o.PARSER_MEDIA_TYPE)===-1?er:o.PARSER_MEDIA_TYPE,ne=bt==="application/xhtml+xml"?Tn:Ke,k=Ue(o,"ALLOWED_TAGS",S,{transform:ne}),_=Ue(o,"ALLOWED_ATTR",A,{transform:ne}),Qt=Ue(o,"ALLOWED_NAMESPACES",Qo,{transform:Tn}),$n=Ue(o,"ADD_URI_SAFE_ATTR",Fn,{transform:ne,base:Fn}),Dn=Ue(o,"ADD_DATA_URI_TAGS",Pn,{transform:ne,base:Pn}),Ze=Ue(o,"FORBID_CONTENTS",zn,{transform:ne}),C=Ue(o,"FORBID_TAGS",ye({}),{transform:ne}),W=Ue(o,"FORBID_ATTR",ye({}),{transform:ne}),nt=xe(o,"USE_PROFILES")?o.USE_PROFILES&&typeof o.USE_PROFILES=="object"?ye(o.USE_PROFILES):o.USE_PROFILES:!1,ie=o.ALLOW_ARIA_ATTR!==!1,de=o.ALLOW_DATA_ATTR!==!1,fe=o.ALLOW_UNKNOWN_PROTOCOLS||!1,me=o.ALLOW_SELF_CLOSE_IN_ATTR!==!1,V=o.SAFE_FOR_TEMPLATES||!1,D=o.SAFE_FOR_XML!==!1,R=o.WHOLE_DOCUMENT||!1,oe=o.RETURN_DOM||!1,Mt=o.RETURN_DOM_FRAGMENT||!1,Nt=o.RETURN_TRUSTED_TYPE||!1,P=o.FORCE_BODY||!1,Ln=o.SANITIZE_DOM!==!1,On=o.SANITIZE_NAMED_PROPS||!1,Zt=o.KEEP_CONTENT!==!1,Vt=o.IN_PLACE||!1,x=gi(o.ALLOWED_URI_REGEXP)?o.ALLOWED_URI_REGEXP:Lo,ot=typeof o.NAMESPACE=="string"?o.NAMESPACE:Re,Jt=Cn(o,"MATHML_TEXT_INTEGRATION_POINTS",()=>H({},Hn)),Kt=Cn(o,"HTML_INTEGRATION_POINTS",()=>H({},Un));let l=Cn(o,"CUSTOM_ELEMENT_HANDLING",()=>dt(null));if(M=dt(null),xe(l,"tagNameCheck")&&Bn(l.tagNameCheck)&&(M.tagNameCheck=l.tagNameCheck),xe(l,"attributeNameCheck")&&Bn(l.attributeNameCheck)&&(M.attributeNameCheck=l.attributeNameCheck),xe(l,"allowCustomizedBuiltInElements")&&typeof l.allowCustomizedBuiltInElements=="boolean"&&(M.allowCustomizedBuiltInElements=l.allowCustomizedBuiltInElements),ue(M),V&&(de=!1),Mt&&(oe=!0),nt&&(k=H({},Ro),_=dt(null),nt.html===!0&&(H(k,Co),H(_,Mo)),nt.svg===!0&&(H(k,_n),H(_,Sn),H(_,qt)),nt.svgFilters===!0&&(H(k,En),H(_,Sn),H(_,qt)),nt.mathMl===!0&&(H(k,vn),H(_,No),H(_,qt))),I.tagCheck=null,I.attributeCheck=null,xe(o,"ADD_TAGS")&&(typeof o.ADD_TAGS=="function"?I.tagCheck=o.ADD_TAGS:pt(o.ADD_TAGS)&&(k===S&&(k=ye(k)),H(k,o.ADD_TAGS,ne))),xe(o,"ADD_ATTR")&&(typeof o.ADD_ATTR=="function"?I.attributeCheck=o.ADD_ATTR:pt(o.ADD_ATTR)&&(_===A&&(_=ye(_)),H(_,o.ADD_ATTR,ne))),xe(o,"ADD_FORBID_CONTENTS")&&pt(o.ADD_FORBID_CONTENTS)&&(Ze===zn&&(Ze=ye(Ze)),H(Ze,o.ADD_FORBID_CONTENTS,ne)),Zt&&(k["#text"]=!0),R&&H(k,["html","head","body"]),k.table&&(H(k,["tbody"]),delete C.tbody),o.TRUSTED_TYPES_POLICY){if(typeof o.TRUSTED_TYPES_POLICY.createHTML!="function")throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof o.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');let u=ee;ee=o.TRUSTED_TYPES_POLICY;try{Ae=Ce("")}catch(f){throw ee=u,f}}else o.TRUSTED_TYPES_POLICY===null?(ee=void 0,Ae=""):(ee===void 0&&(ee=ft()),ee&&typeof Ae=="string"&&(Ae=Ce("")));ce&&ce(o),rt=o},qn=H({},[..._n,...En,...bi]),Wn=H({},[...vn,...xi]),nr=function(o,l,u){return l.namespaceURI===Re?o==="svg":l.namespaceURI===Lt?o==="svg"&&(u==="annotation-xml"||Jt[u]):!!qn[o]},or=function(o,l,u){return l.namespaceURI===Re?o==="math":l.namespaceURI===Ot?o==="math"&&Kt[u]:!!Wn[o]},rr=function(o,l,u){return l.namespaceURI===Ot&&!Kt[u]||l.namespaceURI===Lt&&!Jt[u]?!1:!Wn[o]&&(Jo[o]||!qn[o])},ir=function(o){let l=qe(o),u=Ke(Y(o)),f=ae(o),T,v;return f&&U(f)===re.element?(T={namespaceURI:qe(f)},v=Ke(Y(f))):(T={namespaceURI:ot},v="template"),Qt[l]?l===Ot?nr(u,T,v):l===Lt?or(u,T,v):l===Re?rr(u,T,v):!!(bt==="application/xhtml+xml"&&Qt[l]):!1},Fe=function(o){vt(e.removed,{element:o});try{ae(o).removeChild(o)}catch(l){if(E(o),!ae(o))throw Pe("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},jn=function(o,l,u){try{Z(o,l)}catch(f){try{o.removeAttribute(u)}catch(T){}}},tn=function(o){on(o);let l=O(o);l&&De(li(l),f=>{try{E(f)}catch(T){}});let u=U(o)===re.element?B(o):null;if(u)for(let f=u.length-1;f>=0;--f){let T=u[f],v=T&&T.name;typeof v=="string"&&jn(o,T,v)}},it=function(o,l,u){if(!u)try{u=l.getAttributeNode(o)}catch(f){u=null}vt(e.removed,{attribute:u||null,from:l});try{u?Z(l,u):l.removeAttribute(o)}catch(f){try{l.removeAttribute(o)}catch(T){}}if(o==="is")if(oe||Mt)try{Fe(l)}catch(f){}else try{l.setAttribute(o,"")}catch(f){}},Gn=function(o){let l=B(o);if(l)for(let u=l.length-1;u>=0;--u){let f=l[u],T=f&&f.name;typeof T!="string"||_[ne(T)]||jn(o,f,T)}},nn=function(o,l){let u=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,f=[o];for(;f.length>0;){let T=f.pop();if(l(T)===!1)continue;if(u&&U(T)===re.element){let L=$(T);He(L)&&f.push(L)}let v=O(T);if(v)for(let L=v.length-1;L>=0;--L)f.push(v[L])}},on=function(o){nn(o,l=>{U(l)===re.element&&Gn(l)})},rn=function(o){let l=[];return nn(o,u=>{l.push(u)},!0),l},sr=function(o,l){let u=yn();De(rn(o),f=>{U(f)===re.element&&wn(u,f)}),De(l,f=>{U(f)===re.element&&!St(u,f)&&Gn(f)})},Yn=function(o,l){let u=!1;return De(e.removed,f=>{f.element&&(u=u||f.element===o,on(f.element))}),sr(o,l),u},ar=8,lr=function(o,l){let u=Ye,f=null,T=()=>(f||(f=yn(),De(l,v=>{wn(f,v)})),f);for(let v=0;;v++){let L=rn(o),se=[o],Me=!1;if(De(L,he=>{U(he)===re.documentFragment?vt(se,he):!Me&&!St(u,he)&&(Me=St(T(),he))}),!Me)return;if(v>=ar)throw Pe("the tree kept changing during in-place sanitization; refusing to return it");De(se,(he,ge)=>{cr(he,ge>0,o,T())})}},cr=function(o,l,u,f){let T=sn(o),v;for(;v=T.nextNode();)!St(f,v)||St(Ye,v)||(l&&ve(F.uponSanitizeShadowNode,v,null),ln(v,u),cn(v,u),He(v.content)&&kt(v.content))},dr=function(o){Ye&&wn(Ye,o)},Zn=function(o,l){return D?o==="patchsrc"?!0:o==="for"&&l!=="label"&&l!=="output":!1},pr=function(o){D&&nn(o,l=>{let u=U(l);if(u===re.processingInstruction||u===re.comment&&pe(Oo,l.data)){try{E(l)}catch(f){}return!1}if(u===re.element){let f=l,T=ne(Y(l));try{f.hasAttribute&&f.hasAttribute("patchsrc")&&f.removeAttribute("patchsrc"),f.hasAttribute&&f.hasAttribute("for")&&Zn("for",T)&&f.removeAttribute("for")}catch(v){}}return!0})},Vn=function(o){let l=null,u=null;if(P)o="<remove></remove>"+o;else{let v=Eo(o,/^[\r\n\t ]+/);u=v&&v[0]}bt==="application/xhtml+xml"&&ot===Re&&(o='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+o+"</body></html>");let f=ee?Ce(o):o;if(ot===Re)try{l=new b().parseFromString(f,bt)}catch(v){}if(!l||!l.documentElement){l=Ge.createDocument(ot,"template",null);try{l.documentElement.innerHTML=Xt?Ae:f}catch(v){}}let T=l.body||l.documentElement;return o&&u&&T.insertBefore(t.createTextNode(u),T.childNodes[0]||null),ot===Re?Te.call(l,R?"html":"body")[0]:R?l.documentElement:T},sn=function(o){let l=te?te(o):o.ownerDocument;return Oe.call(l||o,o,d.SHOW_ELEMENT|d.SHOW_COMMENT|d.SHOW_TEXT|d.SHOW_PROCESSING_INSTRUCTION|d.SHOW_CDATA_SECTION,null)},It=function(o){return o=At(o,Gt," "),o=At(o,ht," "),o=At(o,Rt," "),o},an=function(o){var l;Xn(o);let u=(l=o.querySelectorAll)===null||l===void 0?void 0:l.call(o,"template");u&&De(u,f=>{He(f.content)&&an(f.content)})},Xn=function(o){o.normalize();let l=te?te(o):o.ownerDocument,u=Oe.call(l||o,o,d.SHOW_TEXT|d.SHOW_COMMENT|d.SHOW_CDATA_SECTION|d.SHOW_PROCESSING_INSTRUCTION,null),f=u.nextNode();for(;f;)f.data=It(f.data),f=u.nextNode()},zt=function(o){let l=le?le(o):null;return typeof l!="string"||ne(l)!=="form"?!1:typeof o.nodeName!="string"||typeof o.textContent!="string"||typeof o.removeChild!="function"||o.attributes!==B(o)||typeof o.removeAttribute!="function"||typeof o.removeAttributeNode!="function"||typeof o.getAttributeNode!="function"||typeof o.setAttribute!="function"||typeof o.namespaceURI!="string"||typeof o.insertBefore!="function"||typeof o.hasChildNodes!="function"||o.nodeType!==G(o)||o.childNodes!==O(o)},He=function(o){if(!G||typeof o!="object"||o===null)return!1;try{return G(o)===re.documentFragment}catch(l){return!1}},xt=function(o){if(!G||typeof o!="object"||o===null)return!1;try{return typeof G(o)=="number"}catch(l){return!1}};function ve(h,o,l){h.length!==0&&De(h,u=>{u.call(e,o,l,rt)})}let ur=function(o,l){return!!(D&&o.hasChildNodes()&&!xt(o.firstElementChild)&&pe(An,o.textContent)&&pe(An,o.innerHTML)||D&&Ri[l]&&U(o)===re.element&&qe(o)===Re&&(xt(o.firstElementChild)||typeof o.textContent=="string"&&pe(An,o.textContent))||o.nodeType===re.processingInstruction||D&&o.nodeType===re.comment&&pe(Oo,o.data))},Dt=function(o,l){if(o instanceof RegExp)return pe(o,l);if(o instanceof Function){for(var u=arguments.length,f=new Array(u>2?u-2:0),T=2;T<u;T++)f[T-2]=arguments[T];return!!o(l,...f)}return!1},fr=function(o,l,u){if(!C[l]&&Kn(l)&&Dt(M.tagNameCheck,l))return!1;if(Zt&&!Ze[l]&&!Ze[Ke(l)]){let f=ae(o),T=O(o);if(T&&f){let v=T.length;for(let L=v-1;L>=0;--L){let se=o===u?y(T[L],!0):T[L];f.insertBefore(se,z(o))}}}return Fe(o),!0},Qn=function(o,l,u,f){return o.length===0?l:l===u||l===f?ye(l):l},st=function(o,l){return o===l||ae(o)!==null?!1:(Vt&&on(o),!0)},ln=function(o,l){if(dr(o),ve(F.beforeSanitizeElements,o,null),st(o,l))return!0;if(zt(o))return Fe(o),!0;let u=ne(Y(o));if(k=Qn(F.uponSanitizeElement,k,S,N),ve(F.uponSanitizeElement,o,{tagName:u,allowedTags:k}),st(o,l))return!0;if(ur(o,u))return Fe(o),!0;if(C[u]||!(I.tagCheck instanceof Function&&I.tagCheck(u))&&!k[u]){let f=fr(o,u,l);return f===!1&&(ve(F.afterSanitizeElements,o,null),st(o,l))?!0:f}if(U(o)===re.element&&!ir(o)||(u==="noscript"||u==="noembed"||u==="noframes")&&pe(Ci,o.innerHTML))return Fe(o),!0;if(V&&o.nodeType===re.text){let f=It(o.textContent);o.textContent!==f&&(vt(e.removed,{element:o.cloneNode()}),o.textContent=f)}return ve(F.afterSanitizeElements,o,null),st(o,l)},Jn=function(o,l,u){if(W[l]||Zn(l,o)||Ln&&(l==="id"||l==="name")&&(u in t||u in tr))return!1;let f=_[l]||I.attributeCheck instanceof Function&&I.attributeCheck(l,o);return de&&pe(Yt,l)||ie&&pe(mt,l)?!0:f?$n[l]||pe(x,At(u,p,""))||(l==="src"||l==="xlink:href"||l==="href")&&o!=="script"&&vo(u,"data:")===0&&Dn[o]||fe&&!pe(gt,At(u,p,""))?!0:!u:Kn(o)&&Dt(M.tagNameCheck,o)&&Dt(M.attributeNameCheck,l,o)||l==="is"&&M.allowCustomizedBuiltInElements&&Dt(M.tagNameCheck,u)},hr=H({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),Kn=function(o){return!hr[Ke(o)]&&pe(m,o)},mr=function(o,l,u,f){if(ee&&typeof g=="object"&&typeof g.getAttributeType=="function"&&!u)switch(g.getAttributeType(o,l)){case"TrustedHTML":return Ce(f);case"TrustedScriptURL":return jt(f)}return f},gr=function(o,l,u,f){try{return u?o.setAttributeNS(u,l,f):o.setAttribute(l,f),zt(o)?(Fe(o),!1):!0}catch(T){return it(l,o),!1}},eo=function(o,l){return D&&pe(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,l)?!0:Ke(o)==="attributename"&&Eo(l,"href")!==null},cn=function(o,l){if(ve(F.beforeSanitizeAttributes,o,null),st(o,l))return;let u=o.attributes;if(!u||zt(o))return;_=Qn(F.uponSanitizeAttribute,_,A,Q);let f={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:_,forceKeepAttr:void 0},T=u.length,v=ne(o.nodeName);for(;T--;){let L=u[T],se=L.name,Me=L.namespaceURI,he=L.value,ge=ne(se),at=he,be=se==="value"?at:di(at),to=!1;if(f.attrName=ge,f.attrValue=be,f.keepAttr=!0,f.forceKeepAttr=void 0,ve(F.uponSanitizeAttribute,o,f),be=f.attrValue,On&&(ge==="id"||ge==="name")&&vo(be,In)!==0&&(it(se,o,L),be=In+be,to=!0),eo(se,be)){it(se,o,L);continue}if(!f.forceKeepAttr){if(!f.keepAttr){it(se,o,L);continue}if(!me&&pe(Io,be)){it(se,o,L);continue}if(V&&(be=It(be)),!Jn(v,ge,be)){it(se,o,L);continue}be=mr(v,ge,Me,be),be!==at&&gr(o,se,Me,be)&&to&&_o(e.removed)}}ve(F.afterSanitizeAttributes,o,null),st(o,l)},kt=function(o){let l=null,u=sn(o);for(ve(F.beforeSanitizeShadowDOM,o,null);l=u.nextNode();)if(ve(F.uponSanitizeShadowNode,l,null),ln(l,o),cn(l,o),He(l.content)&&kt(l.content),U(l)===re.element){let f=$(l);He(f)&&(dn(f),kt(f))}V&&Xn(o),ve(F.afterSanitizeShadowDOM,o,null)},dn=function(o){let l=[{node:o,shadow:null}];for(;l.length>0;){let u=l.pop();if(u.shadow){kt(u.shadow);continue}let f=u.node,T=U(f)===re.element,v=O(f);if(v)for(let L=v.length-1;L>=0;--L)l.push({node:v[L],shadow:null});if(T){let L=le?le(f):null;if(typeof L=="string"&&ne(L)==="template"){let se=f.content;He(se)&&l.push({node:se,shadow:null})}}if(T){let L=$(f);He(L)&&l.push({node:null,shadow:L},{node:L,shadow:null})}}};return e.sanitize=function(h){let o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},l=null,u=null,f=null,T=null;if(Xt=!h,Xt&&(h="<!-->"),typeof h!="string"&&!xt(h)&&(h=hi(h),typeof h!="string"))throw Pe("dirty is not a string, aborting");if(!e.isSupported)return h;K?(k=N,_=Q):en(o),(F.uponSanitizeElement.length>0||F.uponSanitizeAttribute.length>0)&&(k=ye(k)),F.uponSanitizeAttribute.length>0&&(_=ye(_)),e.removed=[];let v=Vt&&typeof h!="string"&&xt(h),L=[],se=Ye;if(v){pr(h);let ge=Y(h);if(typeof ge=="string"){let at=ne(ge);if(!k[at]||C[at])throw tn(h),Pe("root node is forbidden and cannot be sanitized in-place")}if(zt(h))throw tn(h),Pe("root node is clobbered and cannot be sanitized in-place");L=rn(h),Ye=yn()}else if(xt(h))l=Vn("<!---->"),u=l.ownerDocument.importNode(h,!0),u.nodeType===re.element&&u.nodeName==="BODY"||u.nodeName==="HTML"?l=u:l.appendChild(u),dn(l);else{if(!oe&&!V&&!R&&h.indexOf("<")===-1)return ee&&Nt?Ce(h):h;if(l=Vn(h),!l)return oe?null:Nt?Ae:""}l&&P&&Fe(l.firstChild);let Me=v?h:l;try{v&&dn(h);let ge=sn(Me);for(;f=ge.nextNode();)ln(f,Me),cn(f,Me),He(f.content)&&kt(f.content);v&&lr(h,L)}catch(ge){throw v&&(tn(h),Yn(h,L)),ge}finally{Ye=se}if(v){if(Yn(h,L))throw Pe("a node selected for removal could not be safely returned; refusing to sanitize in place");return V&&an(h),h}if(oe){if(V&&an(l),Mt)for(T=$e.call(l.ownerDocument);l.firstChild;)T.appendChild(l.firstChild);else T=l;return(_.shadowroot||_.shadowrootmode)&&(T=tt.call(n,T,!0)),T}let he=R?l.outerHTML:l.innerHTML;return R&&k["!doctype"]&&l.ownerDocument&&l.ownerDocument.doctype&&l.ownerDocument.doctype.name&&pe(Si,l.ownerDocument.doctype.name)&&(he="<!DOCTYPE "+l.ownerDocument.doctype.name+`>
`+he),V&&(he=It(he)),ee&&Nt?Ce(he):he},e.setConfig=function(){let h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};en(h),K=!0,N=k,Q=_},e.clearConfig=function(){rt=null,K=!1,N=null,Q=null,ee=et,Ae=""},e.isValidAttribute=function(h,o,l){rt||en({});let u=ne(h),f=ne(o);return typeof l=="string"&&(eo(o,l)||!me&&pe(Io,l))?!1:Jn(u,f,l)},e.addHook=function(h,o){typeof o=="function"&&xe(F,h)&&vt(F[h],o)},e.removeHook=function(h,o){if(xe(F,h)){if(o!==void 0){let l=ai(F[h],o);return l===-1?void 0:ci(F[h],l,1)[0]}return _o(F[h])}},e.removeHooks=function(h){xe(F,h)&&(F[h]=[])},e.removeAllHooks=function(){F=zo()},e}var Bo=Uo();function qo(i,e){"use strict";e=e||{};let t=(e.base!==void 0?e.base:location.pathname.replace(/[^/]*$/,"")).replace(/\/$/,""),n=e.color||e.primaryColor;n&&(i.style.setProperty("--c-brand",n),i.style.setProperty("--primary",n),i.style.setProperty("--c-brand-strong",n),i.style.setProperty("--primary-hover",n));let s=document.createElement("div");s.className="widget-header";let a=document.createElement("h1");a.textContent=e.title||"AI \u6570\u636E\u52A9\u624B";let r=document.createElement("span");r.className="status",r.id="chat-status";let c=document.createElement("div");c.className="header-actions";let d=!1,b=document.createElement("button");b.type="button",b.className="header-action-btn",b.title="\u6700\u5927\u5316 / \u8FD8\u539F",b.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';function g(p){d=p,d?(b.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></svg>',b.title="\u8FD8\u539F\u7A97\u53E3"):(b.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',b.title="\u6700\u5927\u5316\u7A97\u53E3")}b.addEventListener("click",()=>{g(!d),window.parent.postMessage({type:"dq-toggle-maximize",maximized:d},"*")}),s.addEventListener("dblclick",p=>{p.target.closest("button")||b.click()});let w=document.createElement("button");w.type="button",w.className="header-action-btn",w.title="\u5173\u95ED",w.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',w.addEventListener("click",()=>{window.parent.postMessage({type:"dq-close"},"*")});let y=document.createElement("button");y.type="button",y.className="new-chat-btn",y.title="\u65B0\u5EFA\u5BF9\u8BDD\uFF08\u6E05\u7A7A\u5F53\u524D\u4E0A\u4E0B\u6587\uFF09";let E=document.createElement("span");E.className="new-chat-icon",E.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';let Z=document.createElement("span");Z.textContent="\u65B0\u5BF9\u8BDD",y.append(E,Z),y.addEventListener("click",()=>{ht(),Te.length=0,z.replaceChildren(),z.appendChild(O),U.value="",r.textContent="",U.focus()}),c.append(y,b,w),s.append(a,r,c);let z=document.createElement("div");z.className="chat-messages";let O=document.createElement("div");O.className="welcome";let ae=document.createElement("p");ae.className="welcome-title",ae.textContent="\u4F60\u597D\uFF0C\u6211\u662F "+(e.title||"AI \u6570\u636E\u52A9\u624B");let $=document.createElement("p");$.textContent="\u57FA\u4E8E\u5143\u6570\u636E\u5411\u6211\u63D0\u95EE\u5373\u53EF\u67E5\u6570\u4E0E\u51FA\u56FE";let B=document.createElement("div");B.className="examples";let G=["\u7EDF\u8BA1\u5404\u72B6\u6001\u6570\u91CF\u5206\u5E03","\u67E5\u8BE2\u6700\u8FD1\u65B0\u589E\u768410\u6761\u6570\u636E","\u6309\u7C7B\u522B\u6C47\u603B\u5360\u6BD4\uFF0C\u7ED9\u4E2A\u997C\u56FE"];(Array.isArray(e.examples)&&e.examples.length?e.examples:typeof e.examples=="string"&&e.examples?e.examples.split(",").map(p=>p.trim()):G).forEach(p=>{let m=document.createElement("button");m.type="button",m.className="example-btn";let x=document.createElement("span");x.className="example-bullet";let k=document.createElement("span");k.textContent=p,m.append(x,k),B.appendChild(m)}),O.append(ae,$,B),z.appendChild(O);let te=document.createElement("div");te.className="input-row";let U=document.createElement("textarea");U.rows=1,U.placeholder="\u63D0\u95EE\uFF0CEnter \u53D1\u9001";let Y=document.createElement("button");Y.type="button",Y.className="send-btn",Y.textContent="\u53D1\u9001",te.append(U,Y),i.append(s,z,te),window.marked&&window.marked.setOptions({breaks:!0});function Be(p){if(!window.marked)return null;try{let m=window.marked.parse(p||"");return window.DOMPurify?window.DOMPurify.sanitize(m):m}catch(m){return null}}function qe(p,m){let x=[],k=/```(?:render|json)\s*\n([\s\S]*?)```/g,S=0,_;for(;(_=k.exec(p))!==null;){let C=p.slice(S,_.index);C.trim()&&x.push({kind:"md",text:C});let W=_[1].trim();if(W.startsWith("{")&&W.includes('"type"'))try{x.push({kind:"render",data:JSON.parse(W)})}catch(I){x.push({kind:"md",text:_[0]})}else x.push({kind:"md",text:_[0]});S=k.lastIndex}let A=p.slice(S),M=A.match(/```(?:render|json)\s*\n([\s\S]*)$/);if(M){let C=A.slice(0,M.index);C.trim()&&x.push({kind:"md",text:C}),m?x.push({kind:"loading"}):x.push({kind:"md",text:A.slice(M.index)})}else A.trim()&&x.push({kind:"md",text:A});return x}function ee(p){p&&p._slots&&p._slots.placeholder&&(p._slots.placeholder.remove(),p._slots.placeholder=null)}function Ae(p,m){let x=document.createElement("div");if(x.className="msg "+p,p==="assistant"){let k=document.createElement("div");k.className="thinking-init-placeholder",k.innerHTML='<span class="think-spinner"></span><span class="thinking-label">\u6B63\u5728\u601D\u8003\u2026</span>';let S=document.createElement("div");S.className="ai-slot-think";let _=document.createElement("div");_.className="ai-slot-tools";let A=document.createElement("div");A.className="ai-slot-content",x.append(k,S,_,A),x._slots={placeholder:k,thinkSlot:S,toolsSlot:_,contentSlot:A},x._state={thinking:{text:"",startedAt:0,done:!1,durationMs:0,open:!0,userTouched:!1},tools:{calls:[],openStates:{}},content:{text:""}},m&&(ee(x),x._state.content.text=m,Ce(x,!1))}else x.textContent=m||"";return z.appendChild(x),z.scrollTop=z.scrollHeight,x}function et(p){if(p==null||p==="")return"(\u7A7A)";if(typeof p=="string")try{let m=JSON.parse(p);return JSON.stringify(m,null,2)}catch(m){return p}try{return JSON.stringify(p,null,2)}catch(m){return String(p)}}function We(p){if(!p._slots||!p._state)return;let{thinkSlot:m}=p._slots,x=p._state.thinking;if(!x.text){m.innerHTML="";return}let k=m.querySelector(".think");k||(k=document.createElement("div"),m.appendChild(k)),k.className="think"+(x.done?" is-done":" is-streaming")+(x.open?" is-open":"");let S=Math.max(0,Math.round((x.durationMs||0)/100)/10).toFixed(1).replace(/\.0$/,""),_=x.done?x.durationMs>0&&S!=="0"?`\u5DF2\u6DF1\u5EA6\u601D\u8003 \xB7 ${S}\u79D2`:"\u5DF2\u6DF1\u5EA6\u601D\u8003":x.durationMs>=800?`\u6DF1\u5EA6\u601D\u8003\u4E2D \xB7 ${S}\u79D2`:"\u6DF1\u5EA6\u601D\u8003\u4E2D\u2026",A=k.querySelector(".think-head");A||(A=document.createElement("button"),A.type="button",A.className="think-head",A.innerHTML=`
        <svg class="think-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span class="think-spinner"></span>
        <span class="think-label"></span>
      `,A.addEventListener("click",()=>{x.userTouched=!0,x.open=!x.open,We(p)}),k.appendChild(A));let M=A.querySelector(".think-chevron");M&&(x.open?M.classList.add("rotated"):M.classList.remove("rotated"));let C=A.querySelector(".think-spinner");C&&(C.style.display=x.done?"none":"inline-block");let W=A.querySelector(".think-label");W&&(W.textContent=_);let I=k.querySelector(".think-body-wrapper");if(!I){I=document.createElement("div"),I.className="think-body-wrapper";let de=document.createElement("div");de.className="think-inner";let fe=document.createElement("div");fe.className="think-body",de.appendChild(fe),I.appendChild(de),k.appendChild(I)}I.className="think-body-wrapper"+(x.open?" is-open":"");let ie=I.querySelector(".think-body");ie.textContent=x.text,!x.done&&x.open&&(ie.scrollTop=ie.scrollHeight)}function Le(p,m,x,k){let S=document.createElement("div"),_=!!x.openStates[m];S.className=`tool-call-card is-${p.status} ${_?"is-open":""}`;let A=document.createElement("div");A.className="tool-call-summary";let M=document.createElement("span");M.className=`tool-call-arrow ${_?"rotated":""}`,M.textContent="\u203A";let C=document.createElement("span");C.className="tool-call-icon",p.status==="running"?(C.className+=" is-spinning",C.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'):p.status==="ok"?C.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':p.status==="fail"?C.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>':C.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';let W=document.createElement("span");W.className="tool-call-main";let I=document.createElement("span");I.className="tool-call-name",I.textContent=p.name||"\u5DE5\u5177\u8C03\u7528";let ie=document.createElement("span");if(ie.className="tool-call-status-wrapper",p.durationMs!=null&&p.durationMs>0){let D=document.createElement("span");D.className="tool-call-duration",D.textContent=p.durationMs<1e3?`${Math.round(p.durationMs)}ms`:`${(p.durationMs/1e3).toFixed(1)}s`,ie.appendChild(D)}let de=document.createElement("span");de.className="tool-call-status",de.textContent=p.status==="running"?"\u8FD0\u884C\u4E2D\u2026":p.status==="ok"?"\u5B8C\u6210":"\u8C03\u7528\u5931\u8D25",ie.appendChild(de),W.append(I,ie),A.append(M,C,W),A.addEventListener("click",D=>{D.stopPropagation(),x.openStates[m]=!_,x._structureDirty=!0,we(k)});let fe=document.createElement("div");fe.className=`tool-call-body-wrapper ${_?"is-open":""}`;let me=document.createElement("div");me.className="tool-call-body";let V=document.createElement("div");if(V.className="tool-call-inner",p.args!=null&&p.args!==""){let D=document.createElement("div");D.className="tool-call-field",D.innerHTML='<span class="tool-call-label">\u53C2\u6570</span>';let R=document.createElement("pre");R.textContent=et(p.args),D.appendChild(R),V.appendChild(D)}if(p.result!=null&&p.result!==""){let D=document.createElement("div");D.className="tool-call-field",D.innerHTML=`<span class="tool-call-label">${p.status==="fail"?"\u9519\u8BEF":"\u8FD4\u56DE"}</span>`;let R=document.createElement("pre");R.textContent=et(p.result),D.appendChild(R),V.appendChild(D)}return me.appendChild(V),fe.appendChild(me),S.append(A,fe),S}function we(p){if(!p._slots||!p._state)return;let{toolsSlot:m}=p._slots,x=p._state.tools;if(!x.calls||x.calls.length===0){m.innerHTML="";return}let k=m.querySelector(".tool-call-list");k||(k=document.createElement("div"),k.className="tool-call-list",m.appendChild(k));let S=x.calls.length,_=k.querySelectorAll(".tool-call-card");if(_.length===S&&!x._structureDirty){x.calls.forEach((R,K)=>{let N=_[K];if(!N)return;let Q=N.querySelector(".tool-call-duration");Q&&R.durationMs>0&&(Q.textContent=R.durationMs<1e3?`${Math.round(R.durationMs)}ms`:`${(R.durationMs/1e3).toFixed(1)}s`);let P=N.querySelector(".tool-call-status");P&&(P.textContent=R.status==="running"?"\u8FD0\u884C\u4E2D\u2026":R.status==="ok"?"\u5B8C\u6210":"\u8C03\u7528\u5931\u8D25")});return}if(x._structureDirty=!1,k.innerHTML="",S<=1){k.appendChild(Le(x.calls[0],0,x,p));return}let A=x.calls.slice(0,S-1),M=x.calls[S-1],C=document.createElement("div");C.className="tool-history-group";let W=!!x.historyOpen,I=document.createElement("button");I.type="button",I.className="tool-history-head",I.addEventListener("click",()=>{x.historyOpen=!W,x._structureDirty=!0,we(p)});let ie=document.createElement("span");ie.className=`tool-history-arrow ${W?"rotated":""}`,ie.textContent="\u203A";let de=document.createElement("span");de.className="tool-history-label";let fe=document.createElement("span");fe.className="tool-history-tag",fe.textContent=A.length;let me=document.createElement("span");me.textContent="\u4E2A\u5DF2\u5B8C\u6210\u524D\u5E8F\u5DE5\u5177\u8C03\u7528",de.append(ie,fe,me),I.appendChild(de),C.appendChild(I);let V=document.createElement("div");V.className=`tool-history-body ${W?"is-open":""}`;let D=document.createElement("div");D.className="tool-history-inner",A.forEach((R,K)=>{D.appendChild(Le(R,K,x,p))}),V.appendChild(D),C.appendChild(V),k.appendChild(C),k.appendChild(Le(M,S-1,x,p))}function Ce(p,m){if(!p._slots||!p._state)return;let{contentSlot:x}=p._slots,k=p._state.content.text||"";if(!k.trim()){x.innerHTML="";return}let S=x.querySelector(".assistant-flow-content");S||(S=document.createElement("div"),S.className="assistant-flow-content",x.appendChild(S));let _=qe(k,m),A=JSON.stringify(_.map(M=>M.kind+(M.text?M.text.length:"")+(M.data?JSON.stringify(M.data):"")));S.dataset.renderKey!==A&&(S.dataset.renderKey=A,S.innerHTML="",_.forEach(M=>{if(M.kind==="md"){let C=document.createElement("div");C.className="markdown-body mixed-chunk--md";let W=Be(M.text);W!=null?C.innerHTML=W:C.textContent=M.text,S.appendChild(C)}else if(M.kind==="render")try{let C=window.renderRenderJSON?window.renderRenderJSON(M.data):null;C&&(C.classList.add("mixed-chunk--render"),S.appendChild(C))}catch(C){}else if(M.kind==="loading"){let C=document.createElement("div");C.className="render-loading-tip mixed-chunk--loading",C.innerHTML='<span class="css-spinner"></span><span>\u6B63\u5728\u751F\u6210\u56FE\u8868\u6570\u636E\u2026</span>',S.appendChild(C)}}),z.scrollTop=z.scrollHeight)}function jt(p,m){if(!m||!p._state)return;ee(p);let x=p._state.thinking;x.startedAt||(x.startedAt=Date.now()),x.text+=m,We(p)}function ft(p){if(!p._state)return;let m=p._state.thinking;m.text&&!m.done&&(m.done=!0,m.durationMs=Math.max(0,Date.now()-(m.startedAt||Date.now())),F&&(clearInterval(F),F=null),m.userTouched||(m.open=!1),We(p))}function je(p){return ee(p),p._state?p._state.tools:{calls:[],openStates:{}}}function Ge(p,m){!m||!p._state||(ee(p),ft(p),p._state.content.text+=m,Ce(p,!0))}let Oe=!1,$e=null,Te=[],tt=20,F=null,Gt=0;function ht(){$e&&($e.abort(),$e=null)}function Rt(p){Oe=p,p?(Y.textContent="\u505C\u6B62",Y.className="send-btn stop-btn",Y.disabled=!1,Y.title="\u505C\u6B62\u56DE\u7B54 (Esc)",i.querySelectorAll(".example-btn").forEach(m=>{m.disabled=!0,m.classList.add("disabled")})):(F&&(clearInterval(F),F=null),$e=null,Y.textContent="\u53D1\u9001",Y.className="send-btn",Y.disabled=!1,Y.title="\u53D1\u9001 (Enter)",i.querySelectorAll(".example-btn").forEach(m=>{m.disabled=!1,m.classList.remove("disabled")}))}function Yt(p){if(p.querySelector(".thinking"))return;let m=document.createElement("div");m.className="thinking";let x=document.createElement("span");x.className="thinking-dots";for(let S=0;S<3;S++)x.appendChild(document.createElement("span"));let k=document.createElement("span");k.textContent="\u601D\u8003\u4E2D\u2026",m.append(x,k),p.appendChild(m)}function mt(p){let m=p.querySelector(".thinking");m&&m.remove()}async function gt(p){if(Oe||(p=(p||U.value).trim(),!p))return;U.value="",O&&O.parentNode&&O.remove(),Ae("user",p),Te.push({role:"user",content:p}),Te.length>tt&&Te.splice(0,Te.length-tt);let m=Ae("assistant","");Yt(m);let x="";Rt(!0),r.textContent="\u601D\u8003\u4E2D\u2026",$e=new AbortController,Gt=Date.now(),F=setInterval(()=>{if(m&&m._state){let k=m._state.thinking;k&&!k.done&&k.startedAt&&(k.durationMs=Date.now()-k.startedAt,k.text&&We(m));let S=m._state.tools;if(S&&S.calls&&S.calls.length>0){let _=!1;S.calls.forEach(A=>{A.status==="running"&&A.startedAt&&(A.durationMs=Date.now()-A.startedAt,_=!0)}),_&&we(m)}}},150);try{let k=await fetch(t+"/assistant/chat",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:p,messages:Te.slice()}),signal:$e.signal});if(!k.ok){let W="HTTP "+k.status;try{let I=await k.json();I&&I.error&&(W=I.error)}catch(I){}throw new Error(W)}let S=k.body.getReader(),_=new TextDecoder,A="",M=!1;for(;;){let{done:W,value:I}=await S.read();if(W)break;A+=_.decode(I,{stream:!0});let ie;for(;(ie=A.indexOf(`

`))>=0;){let de=A.slice(0,ie);A=A.slice(ie+2);for(let fe of de.split(`
`)){if(!fe.startsWith("data:"))continue;let me=fe.slice(5).trim();if(!(!me||me==="[DONE]"))try{let V=JSON.parse(me);if(M||(M=!0,mt(m)),V.object==="agent.event"){let R=V.x_agent||{},K=R.extra||{},N=je(m),Q=K.call_id||R.name;if(N._hasAgentEvents=!0,R.type==="tool_start")r.textContent="\u67E5\u8BE2\u6570\u636E\u4E2D\u2026",N._structureDirty=!0,N.calls.push({call_id:Q,name:R.name,args:K.arguments,result:"",status:"running",startedAt:Date.now(),durationMs:0}),we(m);else if(R.type==="tool_end"){N._structureDirty=!0;let P=[...N.calls].reverse().find(oe=>oe.call_id===Q&&oe.status==="running")||N.calls.find(oe=>oe.call_id===Q)||N.calls[N.calls.length-1];P&&(P.status=R.status==="success"?"ok":"fail",P.result=K.result_preview||R.message||"",P.startedAt&&(P.durationMs=Math.max(1,Date.now()-P.startedAt))),we(m)}else if(R.type==="tool_error"){N._structureDirty=!0;let P=[...N.calls].reverse().find(oe=>oe.call_id===Q&&oe.status==="running")||N.calls.find(oe=>oe.call_id===Q)||N.calls[N.calls.length-1];P&&(P.status="fail",P.result=R.message||"\u8C03\u7528\u5931\u8D25",P.startedAt&&(P.durationMs=Math.max(1,Date.now()-P.startedAt))),we(m)}continue}let D=V.choices&&V.choices[0]&&V.choices[0].delta;if(!D)continue;if(D.reasoning_content){r.textContent="\u601D\u8003\u4E2D\u2026";let R=D.reasoning_content;if(/^(\[工具调用\]|\[执行成功\]|\[执行失败\])/.test(R)){let K=je(m);if(!K._hasAgentEvents){if(R.startsWith("[\u5DE5\u5177\u8C03\u7528]")){let N=R.replace(/^\[工具调用\]\s*/,"").trim(),Q=N.indexOf(" ");K.calls.push({name:Q>0?N.slice(0,Q):N,args:Q>0?N.slice(Q+1):"",result:"",status:"running",startedAt:Date.now(),durationMs:0})}else if(R.startsWith("[\u6267\u884C\u6210\u529F]")){let N=R.replace(/^\[执行成功\]\s*/,"").trim(),Q=N.indexOf(":"),P=[...K.calls].reverse().find(oe=>oe.status==="running")||K.calls[K.calls.length-1];P&&(P.status="ok",P.result=Q>0?N.slice(Q+1).trim():N,P.startedAt&&(P.durationMs=Math.max(1,Date.now()-P.startedAt)))}else if(R.startsWith("[\u6267\u884C\u5931\u8D25]")){let N=R.replace(/^\[执行失败\]\s*/,"").trim(),Q=N.indexOf(":"),P=[...K.calls].reverse().find(oe=>oe.status==="running")||K.calls[K.calls.length-1];P&&(P.status="fail",P.result=Q>0?N.slice(Q+1).trim():N,P.startedAt&&(P.durationMs=Math.max(1,Date.now()-P.startedAt)))}we(m)}}else jt(m,D.reasoning_content)}if(D.content){r.textContent="\u56DE\u7B54\u4E2D\u2026";let R=m._state&&m._state.tools;if(R&&R.calls){let K=!1;R.calls.forEach(N=>{N.status==="running"&&(N.status="ok",K=!0)}),K&&we(m)}x+=D.content,Ge(m,D.content)}}catch(V){}}}}let C=m._state&&m._state.tools;if(C&&C.calls){let W=!1;C.calls.forEach(I=>{I.status==="running"&&(I.status="ok",W=!0)}),W&&we(m)}mt(m),ft(m),Ce(m,!1),r.textContent="",x.trim()&&(Te.push({role:"assistant",content:x}),Te.length>tt&&Te.splice(0,Te.length-tt))}catch(k){mt(m),ft(m),k.name==="AbortError"?(Ge(m,`

*\uFF08\u5DF2\u505C\u6B62\u751F\u6210\uFF09*`),r.textContent="\u5DF2\u4E2D\u65AD"):(Ge(m,`

[\u9519\u8BEF] `+k.message),r.textContent="\u5931\u8D25"),renderSegments(m,!1)}finally{Rt(!1)}}Y.addEventListener("click",()=>{Oe?ht():gt()}),U.addEventListener("keydown",p=>{p.key==="Enter"&&!p.shiftKey?(p.preventDefault(),Oe||gt()):p.key==="Escape"&&Oe&&(p.preventDefault(),ht())}),z.addEventListener("click",p=>{let m=p.target.closest(".example-btn");if(m){if(Oe)return;gt(m.textContent.trim())}})}var Ee=["#4f46e5","#06b6d4","#10b981","#f59e0b","#8b5cf6","#ec4899","#3b82f6","#f97316"],Li="http://www.w3.org/2000/svg";function Se(i,e,t){let n=document.createElementNS(Li,i);for(let s in e)n.setAttribute(s,e[s]);return t!==void 0&&(n.textContent=t),n}function ut(i){if(i==null||i==="")return"0";let e=Number(i);return isNaN(e)?String(i):e.toLocaleString("zh-CN")}function Wt(i){let e=document.createElement("div");e.className="data-table-wrap";let t=document.createElement("table");t.className="data-table";let n=(i.columns||[]).map(c=>({field:c.field,label:c.label||c.field})),s=document.createElement("thead"),a=document.createElement("tr");n.forEach(c=>{let d=document.createElement("th");d.textContent=c.label,a.appendChild(d)}),s.appendChild(a);let r=document.createElement("tbody");return(i.rows||[]).forEach(c=>{let d=document.createElement("tr");n.forEach(b=>{let g=document.createElement("td");g.textContent=c[b.field]===void 0?"":String(c[b.field]),d.appendChild(g)}),r.appendChild(d)}),t.append(s,r),e.appendChild(t),e}function Wo(i,e){let t=i.data||[],n=i.series||[],s=i.x_axis&&i.x_axis.field;if(!t.length||!n.length||!s)return Wt(i);let a=480,r=240,c=48,d=14,b=16,g=42,w=a-c-d,y=r-b-g,E=t.map(($,B)=>s?$[s]:"\u7B2C"+(B+1)+"\u9879"),Z=0;n.forEach($=>t.forEach(B=>{Z=Math.max(Z,Number(B[$.field])||0)})),Z<=0&&(Z=1);let z=Di(Z),O=Se("svg",{viewBox:"0 0 "+a+" "+r,class:"dq-svg-chart",role:"img"});for(let $=0;$<=4;$++){let B=b+y-y*$/4;O.appendChild(Se("line",{x1:c,y1:B,x2:a-d,y2:B,stroke:"#f1f5f9","stroke-width":1}));let G=Se("text",{x:c-8,y:B+4,"text-anchor":"end","font-size":10,fill:"#94a3b8"});G.textContent=ut(Math.round(z*$/4)),O.appendChild(G)}let ae=Math.ceil(E.length/12);if(E.forEach(($,B)=>{if(B%ae!==0)return;let G=Se("text",{x:c+w*(B+.5)/E.length,y:r-g+16,"text-anchor":"middle","font-size":10,fill:"#64748b"});G.textContent=String($).length>6?String($).slice(0,6)+"\u2026":$,O.appendChild(G)}),e==="chart_bar"){let $=w/E.length,B=Math.min(24,$*.7/n.length);n.forEach((G,le)=>{t.forEach((te,U)=>{let Y=Number(te[G.field])||0,Be=Y/z*y,qe=c+$*U+($-B*n.length)/2+le*B,ee=Se("rect",{x:qe,y:b+y-Be,width:B-1,height:Math.max(Be,1),fill:Ee[le%Ee.length],rx:3,class:"dq-svg-bar"});ee.setAttribute("data-tip",(E[U]||"")+" \xB7 "+(G.name||G.field)+"\uFF1A"+ut(Y)),O.appendChild(ee)})})}else n.forEach(($,B)=>{let G=t.map((te,U)=>{let Y=Number(te[$.field])||0;return[(c+w*(U+.5))/E.length,b+y-Y/z*y]}),le=G.map((te,U)=>(U===0?"M":"L")+te[0].toFixed(1)+" "+te[1].toFixed(1)).join(" ");O.appendChild(Se("path",{d:le,fill:"none",stroke:Ee[B%Ee.length],"stroke-width":2,"stroke-linejoin":"round"})),G.forEach((te,U)=>{let Y=Se("circle",{cx:te[0].toFixed(1),cy:te[1].toFixed(1),r:3,fill:Ee[B%Ee.length]});Y.setAttribute("data-tip",(E[U]||"")+" \xB7 "+($.name||$.field)+"\uFF1A"+ut(t[U][$.field])),O.appendChild(Y)})});return jo(O,i,n)}function Oi(i){let e=i.data||[],t=i.name_field,n=i.value_field;if(!e.length||!t||!n)return Wt(i);let s=480,a=240,r=130,c=a/2,d=88,b=e.reduce((y,E)=>y+(Number(E[n])||0),0)||1,g=Se("svg",{viewBox:"0 0 "+s+" "+a,class:"dq-svg-chart",role:"img"}),w=-Math.PI/2;return e.forEach((y,E)=>{let Z=Number(y[n])||0,z=Z/b,O=w+z*Math.PI*2,ae=r+d*Math.cos(w),$=c+d*Math.sin(w),B=r+d*Math.cos(O),G=c+d*Math.sin(O),le=z>.5?1:0,te=Se("path",{d:"M"+r+" "+c+" L"+ae.toFixed(1)+" "+$.toFixed(1)+" A"+d+" "+d+" 0 "+le+" 1 "+B.toFixed(1)+" "+G.toFixed(1)+" Z",fill:Ee[E%Ee.length],stroke:"#fff","stroke-width":1.5});te.setAttribute("data-tip",(y[t]||"")+"\uFF1A"+ut(Z)+"\uFF08"+(z*100).toFixed(1)+"%\uFF09"),g.appendChild(te),w=O}),e.forEach((y,E)=>{let Z=30+E*22;g.appendChild(Se("rect",{x:260,y:Z-8,width:10,height:10,rx:2,fill:Ee[E%Ee.length]}));let z=Se("text",{x:276,y:Z,"font-size":11,fill:"#1e293b"}),O=String(y[t]||"");z.textContent=(O.length>10?O.slice(0,10)+"\u2026":O)+" "+ut(y[n]),g.appendChild(z)}),jo(g,i,[])}function Ii(i){let e=document.createElement("div");return e.className="metric-cards",(i.cards||[]).forEach(t=>{let n=document.createElement("div");n.className="metric-card";let s=document.createElement("div");s.className="metric-label",s.textContent=t.label||"";let a=document.createElement("div");if(a.className="metric-value",a.textContent=ut(t.value),t.unit){let r=document.createElement("span");r.className="metric-unit",r.textContent=t.unit,a.appendChild(r)}n.append(s,a),e.appendChild(n)}),e}function jo(i,e,t){let n=document.createElement("div");if(n.className="render-card",e.title){let s=document.createElement("div");s.className="chart-title",s.textContent=e.title,n.appendChild(s)}if(i.style.width="100%",i.style.height="auto",n.appendChild(i),t.length>1){let s=document.createElement("div");s.style.cssText="display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:#64748b;margin-top:4px;",t.forEach((a,r)=>{let c=document.createElement("span"),d=document.createElement("span");d.style.cssText="display:inline-block;width:8px;height:8px;border-radius:2px;background:"+Ee[r%Ee.length]+";margin-right:4px;",c.appendChild(d),c.appendChild(document.createTextNode(a.name||a.field)),s.appendChild(c)}),n.appendChild(s)}return zi(n,i),n}function zi(i,e){let t=document.createElement("div");t.className="dq-tooltip",t.style.cssText=["position:absolute;","pointer-events:none;","z-index:10;","background:rgba(15,23,42,.92);","color:#f8fafc;","padding:5px 9px;","border-radius:6px;","font-size:12px;","line-height:1.5;","white-space:nowrap;","box-shadow:0 4px 12px rgba(0,0,0,.25);","opacity:0;","transition:opacity .12s;","top:0;","left:0;"].join(""),i.style.position=i.style.position||"relative",i.appendChild(t);let n=r=>{let c=r.getAttribute("data-tip");c&&(t.textContent=c,t.style.opacity="1")},s=r=>{let c=i.getBoundingClientRect(),d=r.clientX-c.left+12,b=r.clientY-c.top-10;d+t.offsetWidth>c.width&&(d=r.clientX-c.left-t.offsetWidth-12),b+t.offsetHeight>c.height&&(b=r.clientY-c.top-t.offsetHeight-4),b<0&&(b=4),t.style.left=d+"px",t.style.top=b+"px"},a=()=>{t.style.opacity="0"};e.addEventListener("mouseover",r=>{let c=r.target.closest("[data-tip]");c&&n(c)}),e.addEventListener("mousemove",s),e.addEventListener("mouseout",r=>{r.target.closest("[data-tip]")&&a()})}function Di(i){if(i<=5)return 5;let e=Math.pow(10,Math.floor(Math.log10(i)));for(let t of[1,2,5,10])if(t*e>=i)return t*e;return i}function Go(i){if(!i||!i.type)return null;switch(i.type){case"data_table":return Wt(i);case"chart_bar":return Wo(i,"chart_bar");case"chart_line":return Wo(i,"chart_line");case"chart_pie":return Oi(i);case"metric_cards":return Ii(i);default:return Wt(i)}}var Yo=`/* gf-mate \u5D4C\u5165\u5F0F\u5C0F\u7A97\u6837\u5F0F\uFF08Shadow DOM \u5185\u6CE8\u5165\uFF09\uFF1A
 * \u53C2\u8003 smart-ai "Editorial Indigo" \u89C4\u8303\uFF0C\u7D27\u51D1\u3001\u4F4E\u8C03\u3001\u7CBE\u81F4\u3001\u96F6 Emoji
 */
:host, :root {
  --c-bg: #f8fafc;
  --c-surface: #ffffff;
  --c-border: #e2e8f0;
  --c-border-strong: #cbd5e1;
  --c-divider: #f1f5f9;
  --c-text-primary: #0f172a;
  --c-text-secondary: #475569;
  --c-text-muted: #94a3b8;
  --c-bg-subtle: #f1f5f9;
  --c-brand: #4f46e5;
  --c-brand-strong: #4338ca;
  --c-brand-soft: #eef2ff;
  --c-brand-text: #3730a3;
  --c-brand-border: #c7d2fe;
  --c-error-bg: #fef2f2;
  --c-error-text: #b91c1c;
  --c-error-border: #fecaca;
  --c-success-bg: #ecfdf5;
  --c-success-text: #047857;
  --c-success-border: #a7f3d0;

  --bg: var(--c-bg);
  --border: var(--c-border);
  --text: var(--c-text-primary);
  --text-sub: var(--c-text-secondary);
  --primary: var(--c-brand);
  --primary-hover: var(--c-brand-strong);
  --danger: #ef4444;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, :host, .dq-widget-root { height: 100%; width: 100%; }

body, :host, .dq-widget-root {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 13px;
  color: var(--c-text-primary);
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

/* \u7EC6\u6EDA\u52A8\u6761 */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.4); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(107, 114, 128, 0.6); }

.widget-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--c-brand);
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.widget-header .avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.widget-header h1 {
  font-size: 13.5px;
  font-weight: 600;
  flex: 1;
  letter-spacing: -0.1px;
}
.widget-header .status {
  font-size: 11px;
  opacity: 0.9;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}
.new-chat-btn {
  background: rgba(255, 255, 255, 0.16);
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px 10px 4px 8px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 500;
  line-height: 1;
  transition: all .15s ease;
  margin-right: 4px;
  flex-shrink: 0;
}
.new-chat-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
.new-chat-btn:active {
  transform: scale(0.96);
}
.new-chat-btn .new-chat-icon {
  display: flex;
  align-items: center;
}

.header-action-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .15s ease;
}
.header-action-btn:hover {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  background: var(--c-bg);
}

.welcome {
  text-align: center;
  color: var(--c-text-secondary);
  padding: 18px 8px;
  font-size: 12px;
}
.welcome p { margin-bottom: 4px; }
.welcome .welcome-title {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--c-text-primary);
  margin-bottom: 4px;
}
.examples {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
}
.example-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--c-border);
  background: var(--c-surface);
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 12px;
  color: var(--c-text-primary);
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.02);
}
.example-btn:hover {
  border-color: var(--c-brand-border);
  background: var(--c-brand-soft);
  color: var(--c-brand-text);
  transform: translateY(-1px);
}
.example-bullet {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--c-brand);
  flex-shrink: 0;
}

.msg {
  max-width: 95%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12.5px;
  line-height: 1.55;
  word-break: break-word;
}
.msg.user {
  align-self: flex-end;
  background: var(--c-bg-subtle);
  color: var(--c-text-primary);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  padding: 6px 12px;
  font-weight: 500;
}
.msg.assistant {
  align-self: flex-start;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ai-slot-content:not(:empty) {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.04);
}
.thinking-init-placeholder {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--c-text-secondary);
  font-size: 12.5px;
  font-weight: 500;
  padding: 6px 4px;
}
.thinking-init-placeholder .think-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid var(--c-brand-soft-strong, #c7d2fe);
  border-top-color: var(--c-brand, #4f46e5);
  border-radius: 50%;
  animation: think-spin 0.8s linear infinite;
  display: inline-block;
  flex-shrink: 0;
}
@keyframes dq-spin {
  to { transform: rotate(360deg); }
}
.msg.assistant .markdown-body {
  font-size: 13px;
  line-height: 1.65;
  color: #1e293b;
}
.msg.assistant .markdown-body p { margin: 6px 0; }
.msg.assistant .markdown-body pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 10px 14px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 11.5px;
  margin: 8px 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
.msg.assistant .markdown-body code {
  background: var(--c-bg-subtle);
  color: var(--c-brand-text);
  padding: 1.5px 5px;
  border-radius: 4px;
  font-size: 11.5px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
.msg.assistant .markdown-body pre code { background: transparent; color: inherit; padding: 0; }
.msg.assistant .markdown-body table {
  border-collapse: separate;
  border-spacing: 0;
  margin: 10px 0;
  font-size: 12px;
  width: 100%;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  overflow: hidden;
}
.msg.assistant .markdown-body th, .msg.assistant .markdown-body td {
  padding: 7px 12px;
  text-align: left;
}
.msg.assistant .markdown-body th {
  background: var(--c-bg-subtle);
  color: var(--c-text-primary);
  font-weight: 600;
  border-bottom: 1px solid var(--c-border);
}
.msg.assistant .markdown-body td {
  border-bottom: 1px solid var(--c-divider);
  color: var(--c-text-primary);
}
.msg.assistant .markdown-body tr:last-child td {
  border-bottom: none;
}
.msg.assistant .markdown-body tr:nth-child(even) td {
  background: rgba(248, 250, 252, 0.75);
}
.msg.assistant .markdown-body blockquote {
  margin: 8px 0;
  padding: 8px 12px;
  border-left: 3px solid var(--c-brand);
  background: var(--c-brand-soft);
  border-radius: 0 6px 6px 0;
  color: var(--c-brand-text);
  font-size: 12px;
  line-height: 1.6;
}
.msg.assistant .markdown-body blockquote p {
  margin: 0;
  color: inherit;
}
.msg.assistant .markdown-body ul, .msg.assistant .markdown-body ol {
  padding-left: 20px;
  margin: 6px 0;
}
.msg.assistant .markdown-body li {
  margin: 3px 0;
  line-height: 1.6;
}

/* \u6DF1\u5EA6\u601D\u8003\u6298\u53E0\u5757 (smart-ai \u98CE\u683C) */
.reasoning-block {
  margin-bottom: 6px;
  border-left: 3px solid #cbd5e1;
  border-top: 1px solid var(--c-divider);
  border-right: 1px solid var(--c-divider);
  border-bottom: 1px solid var(--c-divider);
  border-radius: 0 8px 8px 0;
  background: #f8fafc;
  overflow: hidden;
  transition: all 0.2s ease;
}
.reasoning-block[open] {
  border-left-color: var(--c-brand);
}
/* \u601D\u8003\u4E2D\u4E13\u5C5E\u9AD8\u4EAE */
.reasoning-block.is-thinking {
  border-left: 3px solid var(--c-brand);
  border-color: #cbd5e1 #cbd5e1 #cbd5e1 var(--c-brand);
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.18), 0 2px 8px rgba(99, 102, 241, 0.08);
}
.reasoning-block.is-thinking summary {
  color: #4f46e5;
  font-weight: 600;
}
.reasoning-block.is-done {
  border-left-color: #94a3b8;
  background: #f8fafc;
}
/* \u2500\u2500 Smart-AI \u539F\u751F ThinkingSegment \u601D\u8003\u6298\u53E0\u6761 \u2500\u2500 */
/* \u2500\u2500 Smart-AI \u539F\u751F ThinkingSegment \u601D\u8003\u8FC7\u7A0B\u6298\u53E0\u6761 \u2500\u2500 */
.think {
  margin: 2px 0 6px;
  padding: 3px 8px;
  border-left: 2px solid #cbd5e1;
  background-color: rgba(248, 250, 252, 0.6);
  border-radius: 0 4px 4px 0;
  transition: all 200ms ease;
  line-height: 1;
}
.think.is-streaming {
  border-left-color: var(--c-brand, #4f46e5);
  background-color: rgba(79, 70, 229, 0.03);
  animation: think-pulse 2s infinite ease-in-out;
}
.think.is-open {
  border-left-color: var(--c-brand, #4f46e5);
}
@keyframes think-pulse {
  0%, 100% { border-left-color: var(--c-brand, #4f46e5); }
  50% { border-left-color: rgba(79, 70, 229, 0.4); }
}

.think-head {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: #64748b;
  font-size: 11px;
  line-height: 1.2;
  user-select: none;
  outline: none;
  font-weight: 500;
  transition: color 150ms;
  height: 20px;
}
.think-head:hover {
  color: #334155;
}
.think.is-streaming .think-head {
  color: var(--c-brand, #4f46e5);
}
.think-chevron {
  flex-shrink: 0;
  color: inherit;
  transition: transform 200ms ease;
  opacity: 0.85;
}
.think-chevron.rotated {
  transform: rotate(90deg);
}
.think-spinner {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1.8px solid rgba(79, 70, 229, 0.2);
  border-top-color: var(--c-brand, #4f46e5);
  animation: think-spin 0.8s linear infinite;
  display: inline-block;
  flex-shrink: 0;
}
@keyframes think-spin {
  to { transform: rotate(360deg); }
}
.think-label {
  font-weight: 500;
  letter-spacing: 0.1px;
  color: inherit;
}
.think-body-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 220ms cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.think-body-wrapper.is-open {
  grid-template-rows: 1fr;
}
.think-inner {
  min-height: 0;
  overflow: hidden;
  padding-top: 6px;
  margin-top: 6px;
  border-top: 1px solid #e2e8f0;
}
.think-body {
  max-height: 200px;
  overflow-y: auto;
  font-size: 11px;
  line-height: 1.5;
  color: #475569;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  white-space: pre-wrap;
  word-break: break-word;
}

/* \u2500\u2500 Smart-AI \u539F\u751F EventStream \u5361\u7247\u6D41\uFF08\u7EAF\u51C0\u7EC6\u8FB9\u6846\u3001\u6D45\u7070\u5E95\u3001\u5706\u5F62 Badge\uFF09 \u2500\u2500 */
.tool-call-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 6px 0 10px;
  width: 100%;
}

/* \u5386\u53F2\u5DE5\u5177\u8C03\u7528\u6298\u53E0\u7EC4\uFF08\u8D85 1 \u4E2A\u5DE5\u5177\u65F6\uFF0C\u524D\u5E8F\u5DE5\u5177\u4F18\u96C5\u6298\u53E0\uFF0C\u53EA\u7559\u6700\u65B0\u5361\u7247\uFF09 */
.tool-history-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.tool-history-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: rgba(241, 245, 249, 0.7);
  border: 1px dashed var(--c-border-strong, #cbd5e1);
  border-radius: var(--r-md, 8px);
  cursor: pointer;
  user-select: none;
  font-size: 11.5px;
  color: var(--c-text-secondary, #475569);
  transition: all 0.15s ease;
  width: 100%;
  text-align: left;
  outline: none;
}
.tool-history-head:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  color: #1e293b;
}
.tool-history-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  color: #94a3b8;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}
.tool-history-arrow.rotated {
  transform: rotate(90deg);
  color: var(--c-text-primary);
}
.tool-history-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  flex: 1;
}
.tool-history-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  height: 16px;
  border-radius: 999px;
  background: #e2e8f0;
  color: #334155;
  font-size: 10.5px;
  font-weight: 600;
}
.tool-history-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 220ms cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.tool-history-body.is-open {
  grid-template-rows: 1fr;
}
.tool-history-inner {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 6px;
}
.tool-call-card {
  overflow: hidden;
  border: 1px solid var(--c-border, #e2e8f0);
  border-radius: var(--r-md, 8px);
  background: var(--c-surface, #ffffff);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}
.tool-call-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.04);
}
.tool-call-card.is-running {
  border-color: var(--c-brand-border, #c7d2fe);
  background: var(--c-brand-soft, #f5f7ff);
}
.tool-call-card.is-ok {
  border: 1px solid #cbd5e1;
  background: #f8fafc;
}
.tool-call-card.is-fail,
.tool-call-card.is-unknown {
  border: 1px solid var(--c-error-border, #fca5a5);
  background: var(--c-error-bg, #fff5f5);
}

.tool-call-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  cursor: pointer;
  user-select: none;
}
.tool-call-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  color: #94a3b8;
  font-size: 16px;
  line-height: 1;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s ease;
}
.tool-call-arrow.rotated {
  transform: rotate(90deg);
  color: #475569;
}
.tool-call-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #64748b;
  background: var(--c-bg-subtle, #f1f5f9);
}
.tool-call-card.is-running .tool-call-icon {
  color: var(--c-brand, #6366f1);
  background: rgba(255, 255, 255, 0.85);
}
.tool-call-card.is-running .tool-call-icon.is-spinning svg {
  animation: tool-spin 1s linear infinite;
}
@keyframes tool-spin {
  to { transform: rotate(360deg); }
}
.tool-call-card.is-ok .tool-call-icon {
  color: #10b981;
  background: #ecfdf5;
}
.tool-call-card.is-fail .tool-call-icon,
.tool-call-card.is-unknown .tool-call-icon {
  color: #ef4444;
  background: #fef2f2;
}

.tool-call-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex: 1;
  min-width: 0;
}
.tool-call-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}
.tool-call-status-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.tool-call-duration {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10.5px;
  color: var(--c-text-muted, #94a3b8);
  background: rgba(148, 163, 184, 0.12);
  padding: 1px 5px;
  border-radius: 4px;
  line-height: 1.2;
}
.tool-call-card.is-running .tool-call-duration {
  color: var(--c-brand, #4f46e5);
  background: rgba(99, 102, 241, 0.1);
}
.tool-call-status {
  flex-shrink: 0;
  color: #64748b;
  font-size: 11.5px;
}
.tool-call-card.is-running .tool-call-status,
.tool-call-card.is-running .tool-call-name {
  color: var(--c-brand, #4f46e5);
}
.tool-call-card.is-ok .tool-call-status {
  color: #475569;
}
.tool-call-card.is-fail .tool-call-status,
.tool-call-card.is-unknown .tool-call-status {
  color: #ef4444;
}

/* \u6298\u53E0\u5C55\u5F00\u52A8\u753B\uFF08CSS Grid 0fr -> 1fr\uFF0C\u5BF9\u9F50 smart-ai\uFF09 */
.tool-call-body-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 220ms cubic-bezier(0.4, 0, 0.2, 1);
}
.tool-call-body-wrapper.is-open {
  grid-template-rows: 1fr;
}
.tool-call-body {
  overflow: hidden;
}
.tool-call-inner {
  padding: 6px 10px 8px;
  border-top: 1px solid var(--c-divider);
  background: rgba(248, 250, 252, 0.6);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tool-call-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tool-call-label {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
}
.tool-call-field pre {
  margin: 0;
  padding: 6px 8px;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 5px;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  max-height: 160px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

/* \u6DF7\u5408\u6D41\u5F0F\u6E32\u67D3\u5BB9\u5668\u4E0E\u56FE\u8868\u5165\u573A\u52A8\u753B (\u5BF9\u9F50 smart-ai) */
.assistant-flow-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mixed-chunk--render {
  animation: card-pop-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes card-pop-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* \u601D\u8003\u4E2D\u6307\u793A\u5668 */
.thinking {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-secondary);
  font-size: 11px;
  padding: 2px 0;
}
.thinking-dots { display: inline-flex; gap: 3px; }
.thinking-dots span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--c-brand);
  animation: blink 1.4s infinite both;
}
.thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink { 0%,80%,100% {opacity:0.25;} 40% {opacity:1;} }

/* smart-ai \u98CE\u683C Loading \u5361\u7247 */
.render-loading-tip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0;
  padding: 6px 10px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  color: var(--c-text-secondary);
  font-size: 11px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.04);
}
.css-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid var(--c-brand-soft);
  border-top-color: var(--c-brand);
  border-radius: 50%;
  animation: css-spinner-spin 0.8s linear infinite;
  flex-shrink: 0;
}
@keyframes css-spinner-spin { to { transform: rotate(360deg); } }

/* \u6E32\u67D3\u5361\u7247 */
.render-card {
  margin-top: 8px;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 12px 14px;
  background: var(--c-surface);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
}
.render-card .chart-box { height: 210px; }
.chart-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.1px;
}
.metric-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 8px;
}
.metric-card {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 10px 12px;
  background: #f8fafc;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.metric-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);
}
.metric-card .metric-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--c-text-secondary);
}
.metric-card .metric-value {
  font-size: 22px;
  font-weight: 700;
  margin-top: 4px;
  color: var(--c-brand-strong);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.5px;
}
.metric-card .metric-unit {
  font-size: 11px;
  font-weight: 500;
  color: var(--c-text-muted);
  margin-left: 3px;
}
.data-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-surface);
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: left;
}
.data-table th, .data-table td {
  padding: 7px 10px;
  white-space: nowrap;
  border-bottom: 1px solid var(--c-divider);
}
.data-table th {
  background: #f8fafc;
  font-weight: 600;
  color: var(--c-text-secondary);
  border-bottom: 1px solid var(--c-border);
}
.data-table tbody tr:hover {
  background: #f8fafc;
}
.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* \u5E95\u90E8\u63D0\u95EE\u8F93\u5165\u533A */
.input-row {
  display: flex;
  gap: 8px;
  padding: 10px 14px 12px;
  border-top: 1px solid var(--c-border);
  background: var(--c-surface);
  align-items: center;
  flex-shrink: 0;
}
.input-row textarea {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  font-family: inherit;
  color: var(--c-text-primary);
  background: #ffffff;
  resize: none;
  max-height: 90px;
  min-height: 38px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.input-row textarea:focus {
  border-color: var(--c-brand);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
}
.send-btn {
  height: 38px;
  padding: 0 16px;
  background: var(--c-brand);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(79, 70, 229, 0.25);
  flex-shrink: 0;
}
.send-btn:hover:not(:disabled) {
  background: var(--c-brand-strong);
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.35);
}
.send-btn:active:not(:disabled) {
  transform: scale(0.98);
}
.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}
.send-btn.stop-btn {
  background: #fef2f2 !important;
  color: #dc2626 !important;
  border: 1px solid #fca5a5 !important;
  box-shadow: none !important;
  cursor: pointer !important;
}
.send-btn.stop-btn:hover {
  background: #fee2e2 !important;
  color: #b91c1c !important;
  border-color: #f87171 !important;
}

.example-btn.disabled, .example-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed !important;
  pointer-events: none;
  transform: none !important;
  box-shadow: none !important;
}`;window.renderRenderJSON=Go;window.marked=q;window.DOMPurify=Bo;var Nn='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M14 9.5v3"/><path d="M10 11v1.5"/></svg>',Zo='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',$i=`
.dq-bubble {
  position: fixed; bottom: 24px; right: 24px; width: 50px; height: 50px; border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); cursor: pointer;
  box-shadow: 0 8px 24px -4px rgba(79, 70, 229, 0.45), 0 2px 6px rgba(15, 23, 42, 0.08);
  z-index: 2147483000; display: flex; align-items: center; justify-content: center;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, background 0.2s ease;
}
.dq-bubble:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 12px 30px -4px rgba(79, 70, 229, 0.55), 0 4px 10px rgba(15, 23, 42, 0.12);
  background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%);
}
.dq-bubble:active {
  transform: translateY(0) scale(0.98);
}
.dq-panel {
  position: fixed; bottom: 86px; right: 24px; width: 400px; height: 580px;
  max-width: calc(100vw - 32px); max-height: calc(100vh - 110px);
  border-radius: 16px;
  box-shadow: 0 24px 60px -12px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.9);
  overflow: hidden; z-index: 2147483000; display: none; flex-direction: column;
  background: #ffffff;
  transform-origin: bottom right;
}
.dq-panel.dq-open {
  display: flex;
  animation: dq-panel-in 0.26s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes dq-panel-in {
  from { opacity: 0; transform: translateY(14px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@media (max-width: 480px) {
  .dq-panel { right: 8px; left: 8px; width: auto; bottom: 82px; border-radius: 14px; }
}
`,Ne=document.currentScript,Fi=(Ne&&Ne.dataset.dqBase||"").replace(/\/$/,""),Hi=Ne&&Ne.dataset.dqTitle||void 0,Ui=Ne&&Ne.dataset.dqColor||void 0,Bi=Ne&&Ne.dataset.dqExamples||void 0;function Vo(i){i=i||{};let e=(i.base!==void 0?i.base:Fi).replace(/\/$/,""),t=i.title||Hi||void 0,n=i.color||Ui||void 0,s=i.examples||Bi||void 0,a=document.createElement("style");a.textContent=$i,document.head.appendChild(a);let r=document.createElement("button");r.type="button",r.className="dq-bubble",r.setAttribute("aria-label",t||"AI \u6570\u636E\u52A9\u624B"),n&&(r.style.background=n),r.innerHTML=Nn;let c=document.createElement("div");c.className="dq-panel";let d=c.attachShadow({mode:"open"}),b=document.createElement("style");b.textContent=Yo,d.appendChild(b);let g=document.createElement("div");return g.className="dq-widget-root",g.style.cssText="display:flex;flex-direction:column;height:100%;",d.appendChild(g),qo(g,{base:e||void 0,title:t,color:n,examples:s}),r.addEventListener("click",()=>{let w=c.classList.toggle("dq-open");r.innerHTML=w?Zo:Nn}),document.body.append(c,r),{open(){c.classList.add("dq-open"),r.innerHTML=Zo},close(){c.classList.remove("dq-open"),r.innerHTML=Nn},toggle(){r.click()}}}function Xo(){let i=Vo();Ne&&Ne.dataset.dqOpen!==void 0&&i.open(),window.DQWidget=i,window.DQWidget.mount=Vo}document.body?Xo():document.addEventListener("DOMContentLoaded",Xo);})();
