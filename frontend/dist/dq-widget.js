(()=>{var _r=Object.defineProperty;var ao=i=>{throw TypeError(i)};var Er=(i,e,t)=>e in i?_r(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var Q=(i,e,t)=>Er(i,typeof e!="symbol"?e+"":e,t),vr=(i,e,t)=>e.has(i)||ao("Cannot "+t);var lo=(i,e,t)=>e.has(i)?ao("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t);var Pt=(i,e,t)=>(vr(i,e,"access private method"),t);function bn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Je=bn();function mo(i){Je=i}var go=/[&<>"']/,Sr=new RegExp(go.source,"g"),bo=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,Ar=new RegExp(bo.source,"g"),Cr={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},co=i=>Cr[i];function ye(i,e){if(e){if(go.test(i))return i.replace(Sr,co)}else if(bo.test(i))return i.replace(Ar,co);return i}var Mr=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;function Rr(i){return i.replace(Mr,(e,t)=>(t=t.toLowerCase(),t==="colon"?":":t.charAt(0)==="#"?t.charAt(1)==="x"?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""))}var Lr=/(^|[^\[])\^/g;function Z(i,e){let t=typeof i=="string"?i:i.source;e=e||"";let n={replace:(a,s)=>{let r=typeof s=="string"?s:s.source;return r=r.replace(Lr,"$1"),t=t.replace(a,r),n},getRegex:()=>new RegExp(t,e)};return n}function po(i){try{i=encodeURI(i).replace(/%25/g,"%")}catch(e){return null}return i}var wt={exec:()=>null};function uo(i,e){let t=i.replace(/\|/g,(s,r,c)=>{let d=!1,g=r;for(;--g>=0&&c[g]==="\\";)d=!d;return d?"|":" |"}),n=t.split(/ \|/),a=0;if(n[0].trim()||n.shift(),n.length>0&&!n[n.length-1].trim()&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;a<n.length;a++)n[a]=n[a].trim().replace(/\\\|/g,"|");return n}function $t(i,e,t){let n=i.length;if(n===0)return"";let a=0;for(;a<n;){let s=i.charAt(n-a-1);if(s===e&&!t)a++;else if(s!==e&&t)a++;else break}return i.slice(0,n-a)}function Nr(i,e){if(i.indexOf(e[1])===-1)return-1;let t=0;for(let n=0;n<i.length;n++)if(i[n]==="\\")n++;else if(i[n]===e[0])t++;else if(i[n]===e[1]&&(t--,t<0))return n;return-1}function fo(i,e,t,n){let a=e.href,s=e.title?ye(e.title):null,r=i[1].replace(/\\([\[\]])/g,"$1");if(i[0].charAt(0)!=="!"){n.state.inLink=!0;let c={type:"link",raw:t,href:a,title:s,text:r,tokens:n.inlineTokens(r)};return n.state.inLink=!1,c}return{type:"image",raw:t,href:a,title:s,text:ye(r)}}function zr(i,e){let t=i.match(/^(\s+)(?:```)/);if(t===null)return e;let n=t[1];return e.split(`
`).map(a=>{let s=a.match(/^\s+/);if(s===null)return a;let[r]=s;return r.length>=n.length?a.slice(n.length):a}).join(`
`)}var ct=class{constructor(e){Q(this,"options");Q(this,"rules");Q(this,"lexer");this.options=e||Je}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:$t(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],a=zr(n,t[3]||"");return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:a}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(/#$/.test(n)){let a=$t(n,"#");(this.options.pedantic||!a||/ $/.test(a))&&(n=a.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:t[0]}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=t[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,`
    $1`);n=$t(n.replace(/^ *>[ \t]?/gm,""),`
`);let a=this.lexer.state.top;this.lexer.state.top=!0;let s=this.lexer.blockTokens(n);return this.lexer.state.top=a,{type:"blockquote",raw:t[0],tokens:s,text:n}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),a=n.length>1,s={type:"list",raw:"",ordered:a,start:a?+n.slice(0,-1):"",loose:!1,items:[]};n=a?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=a?n:"[*+-]");let r=new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),c="",d="",g=!1;for(;e;){let m=!1;if(!(t=r.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let x=t[2].split(`
`,1)[0].replace(/^\t+/,z=>" ".repeat(3*z.length)),y=e.split(`
`,1)[0],w=0;this.options.pedantic?(w=2,d=x.trimStart()):(w=t[2].search(/[^ ]/),w=w>4?1:w,d=x.slice(w),w+=t[1].length);let $=!1;if(!x&&/^ *$/.test(y)&&(c+=y+`
`,e=e.substring(y.length+1),m=!0),!m){let z=new RegExp(`^ {0,${Math.min(3,w-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),te=new RegExp(`^ {0,${Math.min(3,w-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),O=new RegExp(`^ {0,${Math.min(3,w-1)}}(?:\`\`\`|~~~)`),W=new RegExp(`^ {0,${Math.min(3,w-1)}}#`);for(;e;){let X=e.split(`
`,1)[0];if(y=X,this.options.pedantic&&(y=y.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),O.test(y)||W.test(y)||z.test(y)||te.test(e))break;if(y.search(/[^ ]/)>=w||!y.trim())d+=`
`+y.slice(w);else{if($||x.search(/[^ ]/)>=4||O.test(x)||W.test(x)||te.test(x))break;d+=`
`+y}!$&&!y.trim()&&($=!0),c+=X+`
`,e=e.substring(X.length+1),x=y.slice(w)}}s.loose||(g?s.loose=!0:/\n *\n *$/.test(c)&&(g=!0));let L=null,I;this.options.gfm&&(L=/^\[[ xX]\] /.exec(d),L&&(I=L[0]!=="[ ] ",d=d.replace(/^\[[ xX]\] +/,""))),s.items.push({type:"list_item",raw:c,task:!!L,checked:I,loose:!1,text:d,tokens:[]}),s.raw+=c}s.items[s.items.length-1].raw=c.trimEnd(),s.items[s.items.length-1].text=d.trimEnd(),s.raw=s.raw.trimEnd();for(let m=0;m<s.items.length;m++)if(this.lexer.state.top=!1,s.items[m].tokens=this.lexer.blockTokens(s.items[m].text,[]),!s.loose){let x=s.items[m].tokens.filter(w=>w.type==="space"),y=x.length>0&&x.some(w=>/\n.*\n/.test(w.raw));s.loose=y}if(s.loose)for(let m=0;m<s.items.length;m++)s.items[m].loose=!0;return s}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(/\s+/g," "),a=t[2]?t[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:a,title:s}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!/[:|]/.test(t[2]))return;let n=uo(t[1]),a=t[2].replace(/^\||\| *$/g,"").split("|"),s=t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split(`
`):[],r={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===a.length){for(let c of a)/^ *-+: *$/.test(c)?r.align.push("right"):/^ *:-+: *$/.test(c)?r.align.push("center"):/^ *:-+ *$/.test(c)?r.align.push("left"):r.align.push(null);for(let c of n)r.header.push({text:c,tokens:this.lexer.inline(c)});for(let c of s)r.rows.push(uo(c,r.header.length).map(d=>({text:d,tokens:this.lexer.inline(d)})));return r}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:ye(t[1])}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&/^</.test(n)){if(!/>$/.test(n))return;let r=$t(n.slice(0,-1),"\\");if((n.length-r.length)%2===0)return}else{let r=Nr(t[2],"()");if(r>-1){let d=(t[0].indexOf("!")===0?5:4)+t[1].length+r;t[2]=t[2].substring(0,r),t[0]=t[0].substring(0,d).trim(),t[3]=""}}let a=t[2],s="";if(this.options.pedantic){let r=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(a);r&&(a=r[1],s=r[3])}else s=t[3]?t[3].slice(1,-1):"";return a=a.trim(),/^</.test(a)&&(this.options.pedantic&&!/>$/.test(n)?a=a.slice(1):a=a.slice(1,-1)),fo(t,{href:a&&a.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let a=(n[2]||n[1]).replace(/\s+/g," "),s=t[a.toLowerCase()];if(!s){let r=n[0].charAt(0);return{type:"text",raw:r,text:r}}return fo(n,s,n[0],this.lexer)}}emStrong(e,t,n=""){let a=this.rules.inline.emStrongLDelim.exec(e);if(!a||a[3]&&n.match(/[\p{L}\p{N}]/u))return;if(!(a[1]||a[2]||"")||!n||this.rules.inline.punctuation.exec(n)){let r=[...a[0]].length-1,c,d,g=r,m=0,x=a[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(x.lastIndex=0,t=t.slice(-1*e.length+r);(a=x.exec(t))!=null;){if(c=a[1]||a[2]||a[3]||a[4]||a[5]||a[6],!c)continue;if(d=[...c].length,a[3]||a[4]){g+=d;continue}else if((a[5]||a[6])&&r%3&&!((r+d)%3)){m+=d;continue}if(g-=d,g>0)continue;d=Math.min(d,d+g+m);let y=[...a[0]][0].length,w=e.slice(0,r+a.index+y+d);if(Math.min(r,d)%2){let L=w.slice(1,-1);return{type:"em",raw:w,text:L,tokens:this.lexer.inlineTokens(L)}}let $=w.slice(2,-2);return{type:"strong",raw:w,text:$,tokens:this.lexer.inlineTokens($)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(/\n/g," "),a=/[^ ]/.test(n),s=/^ /.test(n)&&/ $/.test(n);return a&&s&&(n=n.substring(1,n.length-1)),n=ye(n,!0),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){let t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,a;return t[2]==="@"?(n=ye(t[1]),a="mailto:"+n):(n=ye(t[1]),a=n),{type:"link",raw:t[0],text:n,href:a,tokens:[{type:"text",raw:n,text:n}]}}}url(e){var n,a;let t;if(t=this.rules.inline.url.exec(e)){let s,r;if(t[2]==="@")s=ye(t[0]),r="mailto:"+s;else{let c;do c=t[0],t[0]=(a=(n=this.rules.inline._backpedal.exec(t[0]))==null?void 0:n[0])!=null?a:"";while(c!==t[0]);s=ye(t[0]),t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:s,href:r,tokens:[{type:"text",raw:s,text:s}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n;return this.lexer.state.inRawBlock?n=t[0]:n=ye(t[0]),{type:"text",raw:t[0],text:n}}}},Or=/^(?: *(?:\n|$))+/,Ir=/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,Dr=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,_t=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Pr=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,xo=/(?:[*+-]|\d{1,9}[.)])/,ko=Z(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,xo).replace(/blockCode/g,/ {4}/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),xn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,$r=/^[^\n]+/,kn=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Hr=Z(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label",kn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Fr=Z(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,xo).getRegex(),Ut="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",yn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ur=Z("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))","i").replace("comment",yn).replace("tag",Ut).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),yo=Z(xn).replace("hr",_t).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex(),Br=Z(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",yo).getRegex(),wn={blockquote:Br,code:Ir,def:Hr,fences:Dr,heading:Pr,hr:_t,html:Ur,lheading:ko,list:Fr,newline:Or,paragraph:yo,table:wt,text:$r},ho=Z("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",_t).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex(),qr={...wn,table:ho,paragraph:Z(xn).replace("hr",_t).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ho).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex()},Wr={...wn,html:Z(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",yn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:wt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Z(xn).replace("hr",_t).replace("heading",` *#{1,6} *[^
]`).replace("lheading",ko).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},wo=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,jr=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,To=/^( {2,}|\\)\n(?!\s*$)/,Gr=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Et="\\p{P}\\p{S}",Yr=Z(/^((?![*_])[\spunctuation])/,"u").replace(/punctuation/g,Et).getRegex(),Zr=/\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g,Vr=Z(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,"u").replace(/punct/g,Et).getRegex(),Xr=Z("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])","gu").replace(/punct/g,Et).getRegex(),Qr=Z("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])","gu").replace(/punct/g,Et).getRegex(),Jr=Z(/\\([punct])/,"gu").replace(/punct/g,Et).getRegex(),Kr=Z(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ei=Z(yn).replace("(?:-->|$)","-->").getRegex(),ti=Z("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ei).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ft=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,ni=Z(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",Ft).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),_o=Z(/^!?\[(label)\]\[(ref)\]/).replace("label",Ft).replace("ref",kn).getRegex(),Eo=Z(/^!?\[(ref)\](?:\[\])?/).replace("ref",kn).getRegex(),oi=Z("reflink|nolink(?!\\()","g").replace("reflink",_o).replace("nolink",Eo).getRegex(),Tn={_backpedal:wt,anyPunctuation:Jr,autolink:Kr,blockSkip:Zr,br:To,code:jr,del:wt,emStrongLDelim:Vr,emStrongRDelimAst:Xr,emStrongRDelimUnd:Qr,escape:wo,link:ni,nolink:Eo,punctuation:Yr,reflink:_o,reflinkSearch:oi,tag:ti,text:Gr,url:wt},ri={...Tn,link:Z(/^!?\[(label)\]\((.*?)\)/).replace("label",Ft).getRegex(),reflink:Z(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ft).getRegex()},hn={...Tn,escape:Z(wo).replace("])","~|])").getRegex(),url:Z(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},ii={...hn,br:Z(To).replace("{2,}","*").getRegex(),text:Z(hn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Ht={normal:wn,gfm:qr,pedantic:Wr},yt={normal:Tn,gfm:hn,breaks:ii,pedantic:ri},Ie=class i{constructor(e){Q(this,"tokens");Q(this,"options");Q(this,"state");Q(this,"tokenizer");Q(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Je,this.options.tokenizer=this.options.tokenizer||new ct,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={block:Ht.normal,inline:yt.normal};this.options.pedantic?(t.block=Ht.pedantic,t.inline=yt.pedantic):this.options.gfm&&(t.block=Ht.gfm,this.options.breaks?t.inline=yt.breaks:t.inline=yt.gfm),this.tokenizer.rules=t}static get rules(){return{block:Ht,inline:yt}}static lex(e,t){return new i(t).lex(e)}static lexInline(e,t){return new i(t).inlineTokens(e)}lex(e){e=e.replace(/\r\n|\r/g,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[]){this.options.pedantic?e=e.replace(/\t/g,"    ").replace(/^ +$/gm,""):e=e.replace(/^( *)(\t+)/gm,(c,d,g)=>d+"    ".repeat(g.length));let n,a,s,r;for(;e;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some(c=>(n=c.call({lexer:this},e,t))?(e=e.substring(n.raw.length),t.push(n),!0):!1))){if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length),n.raw.length===1&&t.length>0?t[t.length-1].raw+=`
`:t.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length),a=t[t.length-1],a&&(a.type==="paragraph"||a.type==="text")?(a.raw+=`
`+n.raw,a.text+=`
`+n.text,this.inlineQueue[this.inlineQueue.length-1].src=a.text):t.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length),a=t[t.length-1],a&&(a.type==="paragraph"||a.type==="text")?(a.raw+=`
`+n.raw,a.text+=`
`+n.raw,this.inlineQueue[this.inlineQueue.length-1].src=a.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title});continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),t.push(n);continue}if(s=e,this.options.extensions&&this.options.extensions.startBlock){let c=1/0,d=e.slice(1),g;this.options.extensions.startBlock.forEach(m=>{g=m.call({lexer:this},d),typeof g=="number"&&g>=0&&(c=Math.min(c,g))}),c<1/0&&c>=0&&(s=e.substring(0,c+1))}if(this.state.top&&(n=this.tokenizer.paragraph(s))){a=t[t.length-1],r&&a.type==="paragraph"?(a.raw+=`
`+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=a.text):t.push(n),r=s.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length),a=t[t.length-1],a&&a.type==="text"?(a.raw+=`
`+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=a.text):t.push(n);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n,a,s,r=e,c,d,g;if(this.tokens.links){let m=Object.keys(this.tokens.links);if(m.length>0)for(;(c=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)m.includes(c[0].slice(c[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,c.index)+"["+"a".repeat(c[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(c=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)r=r.slice(0,c.index)+"["+"a".repeat(c[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(c=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,c.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;e;)if(d||(g=""),d=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some(m=>(n=m.call({lexer:this},e,t))?(e=e.substring(n.raw.length),t.push(n),!0):!1))){if(n=this.tokenizer.escape(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.tag(e)){e=e.substring(n.raw.length),a=t[t.length-1],a&&n.type==="text"&&a.type==="text"?(a.raw+=n.raw,a.text+=n.text):t.push(n);continue}if(n=this.tokenizer.link(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(n.raw.length),a=t[t.length-1],a&&n.type==="text"&&a.type==="text"?(a.raw+=n.raw,a.text+=n.text):t.push(n);continue}if(n=this.tokenizer.emStrong(e,r,g)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.codespan(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.br(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.del(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.autolink(e)){e=e.substring(n.raw.length),t.push(n);continue}if(!this.state.inLink&&(n=this.tokenizer.url(e))){e=e.substring(n.raw.length),t.push(n);continue}if(s=e,this.options.extensions&&this.options.extensions.startInline){let m=1/0,x=e.slice(1),y;this.options.extensions.startInline.forEach(w=>{y=w.call({lexer:this},x),typeof y=="number"&&y>=0&&(m=Math.min(m,y))}),m<1/0&&m>=0&&(s=e.substring(0,m+1))}if(n=this.tokenizer.inlineText(s)){e=e.substring(n.raw.length),n.raw.slice(-1)!=="_"&&(g=n.raw.slice(-1)),d=!0,a=t[t.length-1],a&&a.type==="text"?(a.raw+=n.raw,a.text+=n.text):t.push(n);continue}if(e){let m="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(m);break}else throw new Error(m)}}return t}},dt=class{constructor(e){Q(this,"options");this.options=e||Je}code(e,t,n){var s;let a=(s=(t||"").match(/^\S*/))==null?void 0:s[0];return e=e.replace(/\n$/,"")+`
`,a?'<pre><code class="language-'+ye(a)+'">'+(n?e:ye(e,!0))+`</code></pre>
`:"<pre><code>"+(n?e:ye(e,!0))+`</code></pre>
`}blockquote(e){return`<blockquote>
${e}</blockquote>
`}html(e,t){return e}heading(e,t,n){return`<h${t}>${e}</h${t}>
`}hr(){return`<hr>
`}list(e,t,n){let a=t?"ol":"ul",s=t&&n!==1?' start="'+n+'"':"";return"<"+a+s+`>
`+e+"</"+a+`>
`}listitem(e,t,n){return`<li>${e}</li>
`}checkbox(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph(e){return`<p>${e}</p>
`}table(e,t){return t&&(t=`<tbody>${t}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+t+`</table>
`}tablerow(e){return`<tr>
${e}</tr>
`}tablecell(e,t){let n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong(e){return`<strong>${e}</strong>`}em(e){return`<em>${e}</em>`}codespan(e){return`<code>${e}</code>`}br(){return"<br>"}del(e){return`<del>${e}</del>`}link(e,t,n){let a=po(e);if(a===null)return n;e=a;let s='<a href="'+e+'"';return t&&(s+=' title="'+t+'"'),s+=">"+n+"</a>",s}image(e,t,n){let a=po(e);if(a===null)return n;e=a;let s=`<img src="${e}" alt="${n}"`;return t&&(s+=` title="${t}"`),s+=">",s}text(e){return e}},Tt=class{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,n){return""+n}image(e,t,n){return""+n}br(){return""}},De=class i{constructor(e){Q(this,"options");Q(this,"renderer");Q(this,"textRenderer");this.options=e||Je,this.options.renderer=this.options.renderer||new dt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new Tt}static parse(e,t){return new i(t).parse(e)}static parseInline(e,t){return new i(t).parseInline(e)}parse(e,t=!0){let n="";for(let a=0;a<e.length;a++){let s=e[a];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[s.type]){let r=s,c=this.options.extensions.renderers[r.type].call({parser:this},r);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(r.type)){n+=c||"";continue}}switch(s.type){case"space":continue;case"hr":{n+=this.renderer.hr();continue}case"heading":{let r=s;n+=this.renderer.heading(this.parseInline(r.tokens),r.depth,Rr(this.parseInline(r.tokens,this.textRenderer)));continue}case"code":{let r=s;n+=this.renderer.code(r.text,r.lang,!!r.escaped);continue}case"table":{let r=s,c="",d="";for(let m=0;m<r.header.length;m++)d+=this.renderer.tablecell(this.parseInline(r.header[m].tokens),{header:!0,align:r.align[m]});c+=this.renderer.tablerow(d);let g="";for(let m=0;m<r.rows.length;m++){let x=r.rows[m];d="";for(let y=0;y<x.length;y++)d+=this.renderer.tablecell(this.parseInline(x[y].tokens),{header:!1,align:r.align[y]});g+=this.renderer.tablerow(d)}n+=this.renderer.table(c,g);continue}case"blockquote":{let r=s,c=this.parse(r.tokens);n+=this.renderer.blockquote(c);continue}case"list":{let r=s,c=r.ordered,d=r.start,g=r.loose,m="";for(let x=0;x<r.items.length;x++){let y=r.items[x],w=y.checked,$=y.task,L="";if(y.task){let I=this.renderer.checkbox(!!w);g?y.tokens.length>0&&y.tokens[0].type==="paragraph"?(y.tokens[0].text=I+" "+y.tokens[0].text,y.tokens[0].tokens&&y.tokens[0].tokens.length>0&&y.tokens[0].tokens[0].type==="text"&&(y.tokens[0].tokens[0].text=I+" "+y.tokens[0].tokens[0].text)):y.tokens.unshift({type:"text",text:I+" "}):L+=I+" "}L+=this.parse(y.tokens,g),m+=this.renderer.listitem(L,$,!!w)}n+=this.renderer.list(m,c,d);continue}case"html":{let r=s;n+=this.renderer.html(r.text,r.block);continue}case"paragraph":{let r=s;n+=this.renderer.paragraph(this.parseInline(r.tokens));continue}case"text":{let r=s,c=r.tokens?this.parseInline(r.tokens):r.text;for(;a+1<e.length&&e[a+1].type==="text";)r=e[++a],c+=`
`+(r.tokens?this.parseInline(r.tokens):r.text);n+=t?this.renderer.paragraph(c):c;continue}default:{let r='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(r),"";throw new Error(r)}}}return n}parseInline(e,t){t=t||this.renderer;let n="";for(let a=0;a<e.length;a++){let s=e[a];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[s.type]){let r=this.options.extensions.renderers[s.type].call({parser:this},s);if(r!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(s.type)){n+=r||"";continue}}switch(s.type){case"escape":{let r=s;n+=t.text(r.text);break}case"html":{let r=s;n+=t.html(r.text);break}case"link":{let r=s;n+=t.link(r.href,r.title,this.parseInline(r.tokens,t));break}case"image":{let r=s;n+=t.image(r.href,r.title,r.text);break}case"strong":{let r=s;n+=t.strong(this.parseInline(r.tokens,t));break}case"em":{let r=s;n+=t.em(this.parseInline(r.tokens,t));break}case"codespan":{let r=s;n+=t.codespan(r.text);break}case"br":{n+=t.br();break}case"del":{let r=s;n+=t.del(this.parseInline(r.tokens,t));break}case"text":{let r=s;n+=t.text(r.text);break}default:{let r='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(r),"";throw new Error(r)}}}return n}},Ve=class{constructor(e){Q(this,"options");this.options=e||Je}preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}};Q(Ve,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));var Qe,gn,vo,mn=class{constructor(...e){lo(this,Qe);Q(this,"defaults",bn());Q(this,"options",this.setOptions);Q(this,"parse",Pt(this,Qe,gn).call(this,Ie.lex,De.parse));Q(this,"parseInline",Pt(this,Qe,gn).call(this,Ie.lexInline,De.parseInline));Q(this,"Parser",De);Q(this,"Renderer",dt);Q(this,"TextRenderer",Tt);Q(this,"Lexer",Ie);Q(this,"Tokenizer",ct);Q(this,"Hooks",Ve);this.use(...e)}walkTokens(e,t){var a,s;let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case"table":{let c=r;for(let d of c.header)n=n.concat(this.walkTokens(d.tokens,t));for(let d of c.rows)for(let g of d)n=n.concat(this.walkTokens(g.tokens,t));break}case"list":{let c=r;n=n.concat(this.walkTokens(c.items,t));break}default:{let c=r;(s=(a=this.defaults.extensions)==null?void 0:a.childTokens)!=null&&s[c.type]?this.defaults.extensions.childTokens[c.type].forEach(d=>{let g=c[d].flat(1/0);n=n.concat(this.walkTokens(g,t))}):c.tokens&&(n=n.concat(this.walkTokens(c.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let a={...n};if(a.async=this.defaults.async||a.async||!1,n.extensions&&(n.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){let r=t.renderers[s.name];r?t.renderers[s.name]=function(...c){let d=s.renderer.apply(this,c);return d===!1&&(d=r.apply(this,c)),d}:t.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let r=t[s.level];r?r.unshift(s.tokenizer):t[s.level]=[s.tokenizer],s.start&&(s.level==="block"?t.startBlock?t.startBlock.push(s.start):t.startBlock=[s.start]:s.level==="inline"&&(t.startInline?t.startInline.push(s.start):t.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(t.childTokens[s.name]=s.childTokens)}),a.extensions=t),n.renderer){let s=this.defaults.renderer||new dt(this.defaults);for(let r in n.renderer){if(!(r in s))throw new Error(`renderer '${r}' does not exist`);if(r==="options")continue;let c=r,d=n.renderer[c],g=s[c];s[c]=(...m)=>{let x=d.apply(s,m);return x===!1&&(x=g.apply(s,m)),x||""}}a.renderer=s}if(n.tokenizer){let s=this.defaults.tokenizer||new ct(this.defaults);for(let r in n.tokenizer){if(!(r in s))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;let c=r,d=n.tokenizer[c],g=s[c];s[c]=(...m)=>{let x=d.apply(s,m);return x===!1&&(x=g.apply(s,m)),x}}a.tokenizer=s}if(n.hooks){let s=this.defaults.hooks||new Ve;for(let r in n.hooks){if(!(r in s))throw new Error(`hook '${r}' does not exist`);if(r==="options")continue;let c=r,d=n.hooks[c],g=s[c];Ve.passThroughHooks.has(r)?s[c]=m=>{if(this.defaults.async)return Promise.resolve(d.call(s,m)).then(y=>g.call(s,y));let x=d.call(s,m);return g.call(s,x)}:s[c]=(...m)=>{let x=d.apply(s,m);return x===!1&&(x=g.apply(s,m)),x}}a.hooks=s}if(n.walkTokens){let s=this.defaults.walkTokens,r=n.walkTokens;a.walkTokens=function(c){let d=[];return d.push(r.call(this,c)),s&&(d=d.concat(s.call(this,c))),d}}this.defaults={...this.defaults,...a}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Ie.lex(e,t!=null?t:this.defaults)}parser(e,t){return De.parse(e,t!=null?t:this.defaults)}};Qe=new WeakSet,gn=function(e,t){return(n,a)=>{let s={...a},r={...this.defaults,...s};this.defaults.async===!0&&s.async===!1&&(r.silent||console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."),r.async=!0);let c=Pt(this,Qe,vo).call(this,!!r.silent,!!r.async);if(typeof n=="undefined"||n===null)return c(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return c(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));if(r.hooks&&(r.hooks.options=r),r.async)return Promise.resolve(r.hooks?r.hooks.preprocess(n):n).then(d=>e(d,r)).then(d=>r.hooks?r.hooks.processAllTokens(d):d).then(d=>r.walkTokens?Promise.all(this.walkTokens(d,r.walkTokens)).then(()=>d):d).then(d=>t(d,r)).then(d=>r.hooks?r.hooks.postprocess(d):d).catch(c);try{r.hooks&&(n=r.hooks.preprocess(n));let d=e(n,r);r.hooks&&(d=r.hooks.processAllTokens(d)),r.walkTokens&&this.walkTokens(d,r.walkTokens);let g=t(d,r);return r.hooks&&(g=r.hooks.postprocess(g)),g}catch(d){return c(d)}}},vo=function(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let a="<p>An error occurred:</p><pre>"+ye(n.message+"",!0)+"</pre>";return t?Promise.resolve(a):a}if(t)return Promise.reject(n);throw n}};var Xe=new mn;function G(i,e){return Xe.parse(i,e)}G.options=G.setOptions=function(i){return Xe.setOptions(i),G.defaults=Xe.defaults,mo(G.defaults),G};G.getDefaults=bn;G.defaults=Je;G.use=function(...i){return Xe.use(...i),G.defaults=Xe.defaults,mo(G.defaults),G};G.walkTokens=function(i,e){return Xe.walkTokens(i,e)};G.parseInline=Xe.parseInline;G.Parser=De;G.parser=De.parse;G.Renderer=dt;G.TextRenderer=Tt;G.Lexer=Ie;G.lexer=Ie.lex;G.Tokenizer=ct;G.Hooks=Ve;G.parse=G;var Zi=G.options,Vi=G.setOptions,Xi=G.use,Qi=G.walkTokens,Ji=G.parseInline;var Ki=De.parse,es=Ie.lex;function si(i,e){this.v=i,this.k=e}function So(i,e){(e==null||e>i.length)&&(e=i.length);for(var t=0,n=Array(e);t<e;t++)n[t]=i[t];return n}function ai(i){if(Array.isArray(i))return i}function li(i,e){var t=i==null?null:typeof Symbol!="undefined"&&i[Symbol.iterator]||i["@@iterator"];if(t!=null){var n,a,s,r,c=[],d=!0,g=!1;try{if(s=(t=t.call(i)).next,e===0){if(Object(t)!==t)return;d=!1}else for(;!(d=(n=s.call(t)).done)&&(c.push(n.value),c.length!==e);d=!0);}catch(m){g=!0,a=m}finally{try{if(!d&&t.return!=null&&(r=t.return(),Object(r)!==r))return}finally{if(g)throw a}}return c}}function ci(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function di(i,e){return ai(i)||li(i,e)||pi(i,e)||ci()}function pi(i,e){if(i){if(typeof i=="string")return So(i,e);var t={}.toString.call(i).slice(8,-1);return t==="Object"&&i.constructor&&(t=i.constructor.name),t==="Map"||t==="Set"?Array.from(i):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?So(i,e):void 0}}function Bt(i){var e,t;function n(s,r){try{var c=i[s](r),d=c.value,g=d instanceof si;Promise.resolve(g?d.v:d).then(function(m){if(g){var x=s==="return"&&d.k?s:"next";if(!d.k||m.done)return n(x,m);m=i[x](m).value}a(!!c.done,m)},function(m){n("throw",m)})}catch(m){a(2,m)}}function a(s,r){s===2?e.reject(r):e.resolve({value:r,done:s}),(e=e.next)?n(e.key,e.arg):t=null}this._invoke=function(s,r){return new Promise(function(c,d){var g={key:s,arg:r,resolve:c,reject:d,next:null};t?t=t.next=g:(e=t=g,n(s,r))})},typeof i.return!="function"&&(this.return=void 0)}Bt.prototype[typeof Symbol=="function"&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},Bt.prototype.next=function(i){return this._invoke("next",i)},Bt.prototype.throw=function(i){return this._invoke("throw",i)},Bt.prototype.return=function(i){return this._invoke("return",i)};var Uo=Object.entries,Ao=Object.setPrototypeOf,ui=Object.isFrozen,Bo=Object.getPrototypeOf,qo=Object.getOwnPropertyDescriptor,ce=Object.freeze,pe=Object.seal,pt=Object.create,Wo=typeof Reflect!="undefined"&&Reflect,Nn=Wo.apply,zn=Wo.construct;ce||(ce=function(e){return e});pe||(pe=function(e){return e});Nn||(Nn=function(e,t){for(var n=arguments.length,a=new Array(n>2?n-2:0),s=2;s<n;s++)a[s-2]=arguments[s];return e.apply(t,a)});zn||(zn=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return new e(...n)});var Pe=J(Array.prototype.forEach);Array.prototype.indexOf;var fi=J(Array.prototype.lastIndexOf),Co=J(Array.prototype.pop),vt=J(Array.prototype.push),hi=J(Array.prototype.slice),mi=J(Array.prototype.splice),ut=Array.isArray,_n=jo(Set),En=J(Set.prototype.add),St=J(Set.prototype.has),Ke=J(String.prototype.toLowerCase),vn=J(String.prototype.toString),Mo=J(String.prototype.match),At=J(String.prototype.replace),Ro=J(String.prototype.indexOf),gi=J(String.prototype.trim),bi=J(Number.prototype.toString),xi=J(Boolean.prototype.toString),Lo=typeof BigInt=="undefined"?null:J(BigInt.prototype.toString),No=typeof Symbol=="undefined"?null:J(Symbol.prototype.toString),xe=J(Object.prototype.hasOwnProperty),Ct=J(Object.prototype.toString),de=J(RegExp.prototype.test),$e=jo(TypeError);function J(i){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return Nn(i,e,n)}}function jo(i){return function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return zn(i,t)}}function q(i,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Ke;if(Ao&&Ao(i,null),!ut(e))return i;let n=e.length;for(;n--;){let a=e[n];if(typeof a=="string"){let s=t(a);s!==a&&(ui(e)||(e[n]=s),a=s)}i[a]=!0}return i}function ki(i){for(let e=0;e<i.length;e++)xe(i,e)||(i[e]=null);return i}function we(i){let e=pt(null);for(let n of Uo(i)){var t=di(n,2);let a=t[0],s=t[1];xe(i,a)&&(ut(s)?e[a]=ki(s):s&&typeof s=="object"&&s.constructor===Object?e[a]=we(s):e[a]=s)}return e}function yi(i){switch(typeof i){case"string":return i;case"number":return bi(i);case"boolean":return xi(i);case"bigint":return Lo?Lo(i):"0";case"symbol":return No?No(i):"Symbol()";case"undefined":return Ct(i);case"function":case"object":{if(i===null)return Ct(i);let e=i,t=ve(e,"toString");if(typeof t=="function"){let n=t(e);return typeof n=="string"?n:Ct(n)}return Ct(i)}default:return Ct(i)}}function ve(i,e){for(;i!==null;){let n=qo(i,e);if(n){if(n.get)return J(n.get);if(typeof n.value=="function")return J(n.value)}i=Bo(i)}function t(){return null}return t}function wi(i,e){for(;i!==null;){let t=qo(i,e);if(t)return t.get?J(t.get):null;i=Bo(i)}return null}function Ti(i){try{return de(i,""),!0}catch(e){return!1}}var zo=ce(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Sn=ce(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),An=ce(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),_i=ce(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Cn=ce(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Ei=ce(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Oo=ce(["#text"]),Io=ce(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),Mn=ce(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Do=ce(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),qt=ce(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),vi=pe(/{{[\w\W]*|^[\w\W]*}}/g),Si=pe(/<%[\w\W]*|^[\w\W]*%>/g),Ai=pe(/\${[\w\W]*/g),Ci=pe(/^data-[\-\w.\u00B7-\uFFFF]+$/),Mi=pe(/^aria-[\-\w]+$/),Po=pe(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ri=pe(/^(?:\w+script|data):/i),Li=pe(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ni=pe(/^html$/i),zi=pe(/^[a-z][.\w]*(-[.\w]+)+$/i),Rn=pe(/<[/\w!]/g),$o=pe(/<[/\w]/g),Oi=pe(/<\/no(script|embed|frames)/i),Ho=pe(/\/>/i),ie={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},Ii=ce(q({},["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"])),Di=function(){return typeof window=="undefined"?null:window},Pi=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let n=null,a="data-tt-policy-suffix";t&&t.hasAttribute(a)&&(n=t.getAttribute(a));let s="dompurify"+(n?"#"+n:"");try{return e.createPolicy(s,{createHTML(r){return r},createScriptURL(r){return r}})}catch(r){return console.warn("TrustedTypes policy "+s+" could not be created."),null}},Fo=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},qe=function(e,t,n,a){return xe(e,t)&&ut(e[t])?q(a.base?we(a.base):{},e[t],a.transform):n},Ln=function(e,t,n){let a=xe(e,t)?e[t]:void 0;return a&&typeof a=="object"?we(a):n()};function Go(){let i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Di(),e=h=>Go(h);if(e.version="3.4.17",e.removed=[],!i||!i.document||i.document.nodeType!==ie.document||!i.Element)return e.isSupported=!1,e;let t=i.document,n=t,a=n.currentScript;i.DocumentFragment;let s=i.HTMLTemplateElement,r=i.Node,c=i.Element,d=i.NodeFilter;i.NamedNodeMap===void 0&&(i.NamedNodeMap||i.MozNamedAttrMap),i.HTMLFormElement;let g=i.DOMParser,m=i.trustedTypes,x=c.prototype,y=ve(x,"cloneNode"),w=ve(x,"remove"),$=ve(x,"removeAttributeNode"),L=ve(x,"nextSibling"),I=ve(x,"childNodes"),z=ve(x,"parentNode"),te=ve(x,"shadowRoot"),O=ve(x,"attributes"),W=r&&r.prototype?ve(r.prototype,"nodeType"):null,X=r&&r.prototype?ve(r.prototype,"nodeName"):null,fe=r&&r.prototype?ve(r.prototype,"ownerDocument"):null,U=function(o){return W?W(o):o.nodeType},Y=function(o){return X?X(o):o.nodeName},Te=wi(x,"namespaceURI"),He=function(o){return Te?Te(o):o.namespaceURI};if(typeof s=="function"){let h=t.createElement("template");h.content&&h.content.ownerDocument&&(t=h.content.ownerDocument)}let K,ke="",et,We=!1,ze=0,_e=function(){if(ze>0)throw $e('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},Ce=function(o){_e(),ze++;try{return K.createHTML(o)}finally{ze--}},Zt=function(o){_e(),ze++;try{return K.createScriptURL(o)}finally{ze--}},ht=function(){return We||(et=Pi(m,a),We=!0),et},je=t,Ge=je.implementation,Oe=je.createNodeIterator,Fe=je.createDocumentFragment,Ee=je.getElementsByTagName,tt=n.importNode,B=Fo();e.isSupported=typeof Uo=="function"&&typeof z=="function"&&Ge&&Ge.createHTMLDocument!==void 0;let Vt=vi,mt=Si,Mt=Ai,gt=Ci,f=Mi,b=Ri,k=Li,v=zi,C=Po,E=null,R=q({},[...zo,...Sn,...An,...Cn,...Oo]),T=null,M=q({},[...Io,...Mn,...Do,...qt]),P=Object.seal(pt(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),H=null,ne=null,oe=Object.seal(pt(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),ue=!0,me=!0,ae=!1,j=!0,A=!1,V=!0,N=!1,ee=!1,F=null,le=null,Xt=!1,nt=!1,Rt=!1,Lt=!1,Pn=!0,$n=!1,Hn="user-content-",Qt=!0,Jt=!1,Ye=null,ot={},Ze=null,Fn=q({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]),Un=null,Bn=q({},["audio","video","img","source","image","track"]),qn=null,Wn=q({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Nt="http://www.w3.org/1998/Math/MathML",zt="http://www.w3.org/2000/svg",Le="http://www.w3.org/1999/xhtml",rt=Le,Kt=!1,en=null,or=q({},[Nt,zt,Le],vn),jn=ce(["mi","mo","mn","ms","mtext"]),tn=q({},jn),Gn=ce(["annotation-xml"]),nn=q({},Gn),rr=q({},["title","style","font","a","script"]),bt=null,ir=["application/xhtml+xml","text/html"],sr="text/html",re=null,it=null,ar=t.createElement("form"),Yn=function(o){return o instanceof RegExp||o instanceof Function},on=function(){let o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(it&&it===o)return;(!o||typeof o!="object")&&(o={}),o=we(o),bt=ir.indexOf(o.PARSER_MEDIA_TYPE)===-1?sr:o.PARSER_MEDIA_TYPE,re=bt==="application/xhtml+xml"?vn:Ke,E=qe(o,"ALLOWED_TAGS",R,{transform:re}),T=qe(o,"ALLOWED_ATTR",M,{transform:re}),en=qe(o,"ALLOWED_NAMESPACES",or,{transform:vn}),qn=qe(o,"ADD_URI_SAFE_ATTR",Wn,{transform:re,base:Wn}),Un=qe(o,"ADD_DATA_URI_TAGS",Bn,{transform:re,base:Bn}),Ze=qe(o,"FORBID_CONTENTS",Fn,{transform:re}),H=qe(o,"FORBID_TAGS",we({}),{transform:re}),ne=qe(o,"FORBID_ATTR",we({}),{transform:re}),ot=xe(o,"USE_PROFILES")?o.USE_PROFILES&&typeof o.USE_PROFILES=="object"?we(o.USE_PROFILES):o.USE_PROFILES:!1,ue=o.ALLOW_ARIA_ATTR!==!1,me=o.ALLOW_DATA_ATTR!==!1,ae=o.ALLOW_UNKNOWN_PROTOCOLS||!1,j=o.ALLOW_SELF_CLOSE_IN_ATTR!==!1,A=o.SAFE_FOR_TEMPLATES||!1,V=o.SAFE_FOR_XML!==!1,N=o.WHOLE_DOCUMENT||!1,nt=o.RETURN_DOM||!1,Rt=o.RETURN_DOM_FRAGMENT||!1,Lt=o.RETURN_TRUSTED_TYPE||!1,Xt=o.FORCE_BODY||!1,Pn=o.SANITIZE_DOM!==!1,$n=o.SANITIZE_NAMED_PROPS||!1,Qt=o.KEEP_CONTENT!==!1,Jt=o.IN_PLACE||!1,C=Ti(o.ALLOWED_URI_REGEXP)?o.ALLOWED_URI_REGEXP:Po,rt=typeof o.NAMESPACE=="string"?o.NAMESPACE:Le,tn=Ln(o,"MATHML_TEXT_INTEGRATION_POINTS",()=>q({},jn)),nn=Ln(o,"HTML_INTEGRATION_POINTS",()=>q({},Gn));let l=Ln(o,"CUSTOM_ELEMENT_HANDLING",()=>pt(null));if(P=pt(null),xe(l,"tagNameCheck")&&Yn(l.tagNameCheck)&&(P.tagNameCheck=l.tagNameCheck),xe(l,"attributeNameCheck")&&Yn(l.attributeNameCheck)&&(P.attributeNameCheck=l.attributeNameCheck),xe(l,"allowCustomizedBuiltInElements")&&typeof l.allowCustomizedBuiltInElements=="boolean"&&(P.allowCustomizedBuiltInElements=l.allowCustomizedBuiltInElements),pe(P),A&&(me=!1),Rt&&(nt=!0),ot&&(E=q({},Oo),T=pt(null),ot.html===!0&&(q(E,zo),q(T,Io)),ot.svg===!0&&(q(E,Sn),q(T,Mn),q(T,qt)),ot.svgFilters===!0&&(q(E,An),q(T,Mn),q(T,qt)),ot.mathMl===!0&&(q(E,Cn),q(T,Do),q(T,qt))),oe.tagCheck=null,oe.attributeCheck=null,xe(o,"ADD_TAGS")&&(typeof o.ADD_TAGS=="function"?oe.tagCheck=o.ADD_TAGS:ut(o.ADD_TAGS)&&(E===R&&(E=we(E)),q(E,o.ADD_TAGS,re))),xe(o,"ADD_ATTR")&&(typeof o.ADD_ATTR=="function"?oe.attributeCheck=o.ADD_ATTR:ut(o.ADD_ATTR)&&(T===M&&(T=we(T)),q(T,o.ADD_ATTR,re))),xe(o,"ADD_FORBID_CONTENTS")&&ut(o.ADD_FORBID_CONTENTS)&&(Ze===Fn&&(Ze=we(Ze)),q(Ze,o.ADD_FORBID_CONTENTS,re)),Qt&&(E["#text"]=!0),N&&q(E,["html","head","body"]),E.table&&(q(E,["tbody"]),delete H.tbody),o.TRUSTED_TYPES_POLICY){if(typeof o.TRUSTED_TYPES_POLICY.createHTML!="function")throw $e('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof o.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw $e('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');let p=K;K=o.TRUSTED_TYPES_POLICY;try{ke=Ce("")}catch(u){throw K=p,u}}else o.TRUSTED_TYPES_POLICY===null?(K=void 0,ke=""):(K===void 0&&(K=ht()),K&&typeof ke=="string"&&(ke=Ce("")));ce&&ce(o),it=o},Zn=q({},[...Sn,...An,..._i]),Vn=q({},[...Cn,...Ei]),lr=function(o,l,p){return l.namespaceURI===Le?o==="svg":l.namespaceURI===Nt?o==="svg"&&(p==="annotation-xml"||tn[p]):!!Zn[o]},cr=function(o,l,p){return l.namespaceURI===Le?o==="math":l.namespaceURI===zt?o==="math"&&nn[p]:!!Vn[o]},dr=function(o,l,p){return l.namespaceURI===zt&&!nn[p]||l.namespaceURI===Nt&&!tn[p]?!1:!Vn[o]&&(rr[o]||!Zn[o])},pr=function(o){let l=He(o),p=Ke(Y(o)),u=z(o),_,S;return u&&U(u)===ie.element?(_={namespaceURI:He(u)},S=Ke(Y(u))):(_={namespaceURI:rt},S="template"),en[l]?l===zt?lr(p,_,S):l===Nt?cr(p,_,S):l===Le?dr(p,_,S):!!(bt==="application/xhtml+xml"&&en[l]):!1},Ue=function(o){vt(e.removed,{element:o});try{z(o).removeChild(o)}catch(l){if(w(o),!z(o))throw $e("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},Xn=function(o,l,p){try{$(o,l)}catch(u){try{o.removeAttribute(p)}catch(_){}}},rn=function(o){an(o);let l=I(o);l&&Pe(hi(l),u=>{try{w(u)}catch(_){}});let p=U(o)===ie.element?O(o):null;if(p)for(let u=p.length-1;u>=0;--u){let _=p[u],S=_&&_.name;typeof S=="string"&&Xn(o,_,S)}},st=function(o,l,p){if(!p)try{p=l.getAttributeNode(o)}catch(u){p=null}vt(e.removed,{attribute:p||null,from:l});try{p?$(l,p):l.removeAttribute(o)}catch(u){try{l.removeAttribute(o)}catch(_){}}if(o==="is")if(nt||Rt)try{Ue(l)}catch(u){}else try{l.setAttribute(o,"")}catch(u){}},Qn=function(o){let l=O(o);if(l)for(let p=l.length-1;p>=0;--p){let u=l[p],_=u&&u.name;typeof _!="string"||T[re(_)]||Xn(o,u,_)}},sn=function(o,l){let p=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,u=[o];for(;u.length>0;){let _=u.pop();if(l(_)===!1)continue;if(p&&U(_)===ie.element){let D=te(_);Be(D)&&u.push(D)}let S=I(_);if(S)for(let D=S.length-1;D>=0;--D)u.push(S[D])}},an=function(o){sn(o,l=>{U(l)===ie.element&&Qn(l)})},ln=function(o){let l=[];return sn(o,p=>{l.push(p)},!0),l},ur=function(o,l){let p=_n();Pe(ln(o),u=>{U(u)===ie.element&&En(p,u)}),Pe(l,u=>{U(u)===ie.element&&!St(p,u)&&Qn(u)})},Jn=function(o,l){let p=!1;return Pe(e.removed,u=>{u.element&&(p=p||u.element===o,an(u.element))}),ur(o,l),p},fr=8,hr=function(o,l){let p=Ye,u=null,_=()=>(u||(u=_n(),Pe(l,S=>{En(u,S)})),u);for(let S=0;;S++){let D=ln(o),se=[o],Ne=!1;if(Pe(D,he=>{U(he)===ie.documentFragment?vt(se,he):!Ne&&!St(p,he)&&(Ne=St(_(),he))}),!Ne)return;if(S>=fr)throw $e("the tree kept changing during in-place sanitization; refusing to return it");Pe(se,(he,ge)=>{mr(he,ge>0,o,_())})}},mr=function(o,l,p,u){let _=cn(o),S;for(;S=_.nextNode();)!St(u,S)||St(Ye,S)||(l&&Me(B.uponSanitizeShadowNode,S,null),pn(S,p),un(S,p),Be(S.content)&&kt(S.content))},gr=function(o){Ye&&En(Ye,o)},Kn=function(o,l){return V?o==="patchsrc"?!0:o==="for"&&l!=="label"&&l!=="output":!1},br=function(o){V&&sn(o,l=>{let p=U(l);if(p===ie.processingInstruction||p===ie.comment&&de($o,l.data)){try{w(l)}catch(u){}return!1}if(p===ie.element){let u=l,_=re(Y(l));try{u.hasAttribute&&u.hasAttribute("patchsrc")&&u.removeAttribute("patchsrc"),u.hasAttribute&&u.hasAttribute("for")&&Kn("for",_)&&u.removeAttribute("for")}catch(S){}}return!0})},eo=function(o){let l=null,p=null;if(Xt)o="<remove></remove>"+o;else{let S=Mo(o,/^[\r\n\t ]+/);p=S&&S[0]}bt==="application/xhtml+xml"&&rt===Le&&(o='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+o+"</body></html>");let u=K?Ce(o):o;if(rt===Le)try{l=new g().parseFromString(u,bt)}catch(S){}if(!l||!l.documentElement){l=Ge.createDocument(rt,"template",null);try{l.documentElement.innerHTML=Kt?ke:u}catch(S){}}let _=l.body||l.documentElement;return o&&p&&_.insertBefore(t.createTextNode(p),_.childNodes[0]||null),rt===Le?Ee.call(l,N?"html":"body")[0]:N?l.documentElement:_},cn=function(o){let l=fe?fe(o):o.ownerDocument;return Oe.call(l||o,o,d.SHOW_ELEMENT|d.SHOW_COMMENT|d.SHOW_TEXT|d.SHOW_PROCESSING_INSTRUCTION|d.SHOW_CDATA_SECTION,null)},Ot=function(o){return o=At(o,Vt," "),o=At(o,mt," "),o=At(o,Mt," "),o},dn=function(o){var l;to(o);let p=(l=o.querySelectorAll)===null||l===void 0?void 0:l.call(o,"template");p&&Pe(p,u=>{Be(u.content)&&dn(u.content)})},to=function(o){o.normalize();let l=fe?fe(o):o.ownerDocument,p=Oe.call(l||o,o,d.SHOW_TEXT|d.SHOW_COMMENT|d.SHOW_CDATA_SECTION|d.SHOW_PROCESSING_INSTRUCTION,null),u=p.nextNode();for(;u;)u.data=Ot(u.data),u=p.nextNode()},It=function(o){let l=X?X(o):null;return typeof l!="string"||re(l)!=="form"?!1:typeof o.nodeName!="string"||typeof o.textContent!="string"||typeof o.removeChild!="function"||o.attributes!==O(o)||typeof o.removeAttribute!="function"||typeof o.removeAttributeNode!="function"||typeof o.getAttributeNode!="function"||typeof o.setAttribute!="function"||typeof o.namespaceURI!="string"||typeof o.insertBefore!="function"||typeof o.hasChildNodes!="function"||o.nodeType!==W(o)||o.childNodes!==I(o)},Be=function(o){if(!W||typeof o!="object"||o===null)return!1;try{return W(o)===ie.documentFragment}catch(l){return!1}},xt=function(o){if(!W||typeof o!="object"||o===null)return!1;try{return typeof W(o)=="number"}catch(l){return!1}};function Me(h,o,l){h.length!==0&&Pe(h,p=>{p.call(e,o,l,it)})}let xr=function(o,l){return!!(V&&o.hasChildNodes()&&!xt(o.firstElementChild)&&de(Rn,o.textContent)&&de(Rn,o.innerHTML)||V&&Ii[l]&&U(o)===ie.element&&He(o)===Le&&(xt(o.firstElementChild)||typeof o.textContent=="string"&&de(Rn,o.textContent))||o.nodeType===ie.processingInstruction||V&&o.nodeType===ie.comment&&de($o,o.data))},Dt=function(o,l){if(o instanceof RegExp)return de(o,l);if(o instanceof Function){for(var p=arguments.length,u=new Array(p>2?p-2:0),_=2;_<p;_++)u[_-2]=arguments[_];return!!o(l,...u)}return!1},kr=function(o,l,p){if(!H[l]&&ro(l)&&Dt(P.tagNameCheck,l))return!1;if(Qt&&!Ze[l]&&!Ze[Ke(l)]){let u=z(o),_=I(o);if(_&&u){let S=_.length;for(let D=S-1;D>=0;--D){let se=o===p?y(_[D],!0):_[D];u.insertBefore(se,L(o))}}}return Ue(o),!0},no=function(o,l,p,u){return o.length===0?l:l===p||l===u?we(l):l},at=function(o,l){return o===l||z(o)!==null?!1:(Jt&&an(o),!0)},pn=function(o,l){if(gr(o),Me(B.beforeSanitizeElements,o,null),at(o,l))return!0;if(It(o))return Ue(o),!0;let p=re(Y(o));if(E=no(B.uponSanitizeElement,E,R,F),Me(B.uponSanitizeElement,o,{tagName:p,allowedTags:E}),at(o,l))return!0;if(xr(o,p))return Ue(o),!0;if(H[p]||!(oe.tagCheck instanceof Function&&oe.tagCheck(p))&&!E[p]){let u=kr(o,p,l);return u===!1&&(Me(B.afterSanitizeElements,o,null),at(o,l))?!0:u}if(U(o)===ie.element&&!pr(o)||(p==="noscript"||p==="noembed"||p==="noframes")&&de(Oi,o.innerHTML))return Ue(o),!0;if(A&&o.nodeType===ie.text){let u=Ot(o.textContent);o.textContent!==u&&(vt(e.removed,{element:o.cloneNode()}),o.textContent=u)}return Me(B.afterSanitizeElements,o,null),at(o,l)},oo=function(o,l,p){if(ne[l]||Kn(l,o)||Pn&&(l==="id"||l==="name")&&(p in t||p in ar))return!1;let u=T[l]||oe.attributeCheck instanceof Function&&oe.attributeCheck(l,o);return me&&de(gt,l)||ue&&de(f,l)?!0:u?qn[l]||de(C,At(p,k,""))||(l==="src"||l==="xlink:href"||l==="href")&&o!=="script"&&Ro(p,"data:")===0&&Un[o]||ae&&!de(b,At(p,k,""))?!0:!p:ro(o)&&Dt(P.tagNameCheck,o)&&Dt(P.attributeNameCheck,l,o)||l==="is"&&P.allowCustomizedBuiltInElements&&Dt(P.tagNameCheck,p)},yr=q({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),ro=function(o){return!yr[Ke(o)]&&de(v,o)},wr=function(o,l,p,u){if(K&&typeof m=="object"&&typeof m.getAttributeType=="function"&&!p)switch(m.getAttributeType(o,l)){case"TrustedHTML":return Ce(u);case"TrustedScriptURL":return Zt(u)}return u},Tr=function(o,l,p,u){try{return p?o.setAttributeNS(p,l,u):o.setAttribute(l,u),It(o)?(Ue(o),!1):!0}catch(_){return st(l,o),!1}},io=function(o,l){return V&&de(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,l)?!0:Ke(o)==="attributename"&&Mo(l,"href")!==null},un=function(o,l){if(Me(B.beforeSanitizeAttributes,o,null),at(o,l))return;let p=o.attributes;if(!p||It(o))return;T=no(B.uponSanitizeAttribute,T,M,le);let u={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:T,forceKeepAttr:void 0},_=p.length,S=re(o.nodeName);for(;_--;){let D=p[_],se=D.name,Ne=D.namespaceURI,he=D.value,ge=re(se),lt=he,be=se==="value"?lt:gi(lt),so=!1;if(u.attrName=ge,u.attrValue=be,u.keepAttr=!0,u.forceKeepAttr=void 0,Me(B.uponSanitizeAttribute,o,u),be=u.attrValue,$n&&(ge==="id"||ge==="name")&&Ro(be,Hn)!==0&&(st(se,o,D),be=Hn+be,so=!0),io(se,be)){st(se,o,D);continue}if(!u.forceKeepAttr){if(!u.keepAttr){st(se,o,D);continue}if(!j&&de(Ho,be)){st(se,o,D);continue}if(A&&(be=Ot(be)),!oo(S,ge,be)){st(se,o,D);continue}be=wr(S,ge,Ne,be),be!==lt&&Tr(o,se,Ne,be)&&so&&Co(e.removed)}}Me(B.afterSanitizeAttributes,o,null),at(o,l)},kt=function(o){let l=null,p=cn(o);for(Me(B.beforeSanitizeShadowDOM,o,null);l=p.nextNode();)if(Me(B.uponSanitizeShadowNode,l,null),pn(l,o),un(l,o),Be(l.content)&&kt(l.content),U(l)===ie.element){let u=te(l);Be(u)&&(fn(u),kt(u))}A&&to(o),Me(B.afterSanitizeShadowDOM,o,null)},fn=function(o){let l=[{node:o,shadow:null}];for(;l.length>0;){let p=l.pop();if(p.shadow){kt(p.shadow);continue}let u=p.node,_=U(u)===ie.element,S=I(u);if(S)for(let D=S.length-1;D>=0;--D)l.push({node:S[D],shadow:null});if(_){let D=X?X(u):null;if(typeof D=="string"&&re(D)==="template"){let se=u.content;Be(se)&&l.push({node:se,shadow:null})}}if(_){let D=te(u);Be(D)&&l.push({node:null,shadow:D},{node:D,shadow:null})}}};return e.sanitize=function(h){let o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},l=null,p=null,u=null,_=null;if(Kt=!h,Kt&&(h="<!-->"),typeof h!="string"&&!xt(h)&&(h=yi(h),typeof h!="string"))throw $e("dirty is not a string, aborting");if(!e.isSupported)return h;ee?(E=F,T=le):on(o),(B.uponSanitizeElement.length>0||B.uponSanitizeAttribute.length>0)&&(E=we(E)),B.uponSanitizeAttribute.length>0&&(T=we(T)),e.removed=[];let S=Jt&&typeof h!="string"&&xt(h),D=[],se=Ye;if(S){br(h);let ge=Y(h);if(typeof ge=="string"){let lt=re(ge);if(!E[lt]||H[lt])throw rn(h),$e("root node is forbidden and cannot be sanitized in-place")}if(It(h))throw rn(h),$e("root node is clobbered and cannot be sanitized in-place");D=ln(h),Ye=_n()}else if(xt(h))l=eo("<!---->"),p=l.ownerDocument.importNode(h,!0),p.nodeType===ie.element&&p.nodeName==="BODY"||p.nodeName==="HTML"?l=p:l.appendChild(p),fn(l);else{if(!nt&&!A&&!N&&h.indexOf("<")===-1)return K&&Lt?Ce(h):h;if(l=eo(h),!l)return nt?null:Lt?ke:""}l&&Xt&&Ue(l.firstChild);let Ne=S?h:l;try{S&&fn(h);let ge=cn(Ne);for(;u=ge.nextNode();)pn(u,Ne),un(u,Ne),Be(u.content)&&kt(u.content);S&&hr(h,D)}catch(ge){throw S&&(rn(h),Jn(h,D)),ge}finally{Ye=se}if(S){if(Jn(h,D))throw $e("a node selected for removal could not be safely returned; refusing to sanitize in place");return A&&dn(h),h}if(nt){if(A&&dn(l),Rt)for(_=Fe.call(l.ownerDocument);l.firstChild;)_.appendChild(l.firstChild);else _=l;return(T.shadowroot||T.shadowrootmode)&&(_=tt.call(n,_,!0)),_}let he=N?l.outerHTML:l.innerHTML;return N&&E["!doctype"]&&l.ownerDocument&&l.ownerDocument.doctype&&l.ownerDocument.doctype.name&&de(Ni,l.ownerDocument.doctype.name)&&(he="<!DOCTYPE "+l.ownerDocument.doctype.name+`>
`+he),A&&(he=Ot(he)),K&&Lt?Ce(he):he},e.setConfig=function(){let h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};on(h),ee=!0,F=E,le=T},e.clearConfig=function(){it=null,ee=!1,F=null,le=null,K=et,ke=""},e.isValidAttribute=function(h,o,l){it||on({});let p=re(h),u=re(o);return typeof l=="string"&&(io(o,l)||!j&&de(Ho,l))?!1:oo(p,u,l)},e.addHook=function(h,o){typeof o=="function"&&xe(B,h)&&vt(B[h],o)},e.removeHook=function(h,o){if(xe(B,h)){if(o!==void 0){let l=fi(B[h],o);return l===-1?void 0:mi(B[h],l,1)[0]}return Co(B[h])}},e.removeHooks=function(h){xe(B,h)&&(B[h]=[])},e.removeAllHooks=function(){B=Fo()},e}var Yo=Go();async function $i(i){try{let e=typeof i=="function"?await i():await i;return e&&typeof e=="object"?e:{}}catch(e){return{}}}function On(i,e){"use strict";e=e||{};let t=(e.base!==void 0?e.base:location.pathname.replace(/[^/]*$/,"")).replace(/\/$/,""),n=e.color||e.primaryColor;n&&(i.style.setProperty("--c-brand",n),i.style.setProperty("--primary",n),i.style.setProperty("--c-brand-strong",n),i.style.setProperty("--primary-hover",n));let a=document.createElement("div");a.className="widget-header";let s=document.createElement("h1");s.textContent=e.title||"AI \u6570\u636E\u52A9\u624B";let r=document.createElement("span");r.className="status",r.id="chat-status";let c=document.createElement("div");c.className="header-actions";let d=!1,g=document.createElement("button");g.type="button",g.className="header-action-btn",g.title="\u6700\u5927\u5316 / \u8FD8\u539F",g.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';function m(f){d=f,d?(g.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></svg>',g.title="\u8FD8\u539F\u7A97\u53E3"):(g.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',g.title="\u6700\u5927\u5316\u7A97\u53E3")}g.addEventListener("click",()=>{m(!d),typeof e.onToggleMaximize=="function"&&e.onToggleMaximize(d),window.parent.postMessage({type:"dq-toggle-maximize",maximized:d},"*")}),a.addEventListener("dblclick",f=>{f.target.closest("button")||g.click()});let x=document.createElement("button");x.type="button",x.className="header-action-btn",x.title="\u5173\u95ED",x.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',x.addEventListener("click",()=>{typeof e.onClose=="function"&&e.onClose(),window.parent.postMessage({type:"dq-close"},"*")});let y=document.createElement("button");y.type="button",y.className="new-chat-btn",y.title="\u65B0\u5EFA\u5BF9\u8BDD\uFF08\u6E05\u7A7A\u5F53\u524D\u4E0A\u4E0B\u6587\uFF09";let w=document.createElement("span");w.className="new-chat-icon",w.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';let $=document.createElement("span");$.textContent="\u65B0\u5BF9\u8BDD",y.append(w,$),y.addEventListener("click",()=>{mt(),Ee.length=0,L.replaceChildren(),L.appendChild(I),U.value="",r.textContent="",U.focus()}),c.append(y),e.inline||c.append(g,x),a.append(s,r,c);let L=document.createElement("div");L.className="chat-messages";let I=document.createElement("div");I.className="welcome";let z=document.createElement("p");z.className="welcome-title",z.textContent="\u4F60\u597D\uFF0C\u6211\u662F "+(e.title||"AI \u6570\u636E\u52A9\u624B");let te=document.createElement("p");te.textContent="\u57FA\u4E8E\u5143\u6570\u636E\u5411\u6211\u63D0\u95EE\u5373\u53EF\u67E5\u6570\u4E0E\u51FA\u56FE";let O=document.createElement("div");O.className="examples";let W=["\u7EDF\u8BA1\u5404\u72B6\u6001\u6570\u91CF\u5206\u5E03","\u67E5\u8BE2\u6700\u8FD1\u65B0\u589E\u768410\u6761\u6570\u636E","\u6309\u7C7B\u522B\u6C47\u603B\u5360\u6BD4\uFF0C\u7ED9\u4E2A\u997C\u56FE"];(Array.isArray(e.examples)&&e.examples.length?e.examples:typeof e.examples=="string"&&e.examples?e.examples.split(",").map(f=>f.trim()):W).forEach(f=>{let b=document.createElement("button");b.type="button",b.className="example-btn";let k=document.createElement("span");k.className="example-bullet";let v=document.createElement("span");v.textContent=f,b.append(k,v),O.appendChild(b)}),I.append(z,te,O),L.appendChild(I);let fe=document.createElement("div");fe.className="input-row";let U=document.createElement("textarea");U.rows=1,U.placeholder="\u63D0\u95EE\uFF0CEnter \u53D1\u9001";let Y=document.createElement("button");Y.type="button",Y.className="send-btn",Y.textContent="\u53D1\u9001",fe.append(U,Y),i.append(a,L,fe),window.marked&&window.marked.setOptions({breaks:!0});function Te(f){if(!window.marked)return null;try{let b=window.marked.parse(f||"");return window.DOMPurify?window.DOMPurify.sanitize(b):b}catch(b){return null}}function He(f,b){let k=[],v=/```(?:render|json)\s*\n([\s\S]*?)```/g,C=0,E;for(;(E=v.exec(f))!==null;){let M=f.slice(C,E.index);M.trim()&&k.push({kind:"md",text:M});let P=E[1].trim();if(P.startsWith("{")&&P.includes('"type"'))try{k.push({kind:"render",data:JSON.parse(P)})}catch(H){k.push({kind:"md",text:E[0]})}else k.push({kind:"md",text:E[0]});C=v.lastIndex}let R=f.slice(C),T=R.match(/```(?:render|json)\s*\n([\s\S]*)$/);if(T){let M=R.slice(0,T.index);M.trim()&&k.push({kind:"md",text:M}),b?k.push({kind:"loading"}):k.push({kind:"md",text:R.slice(T.index)})}else R.trim()&&k.push({kind:"md",text:R});return k}function K(f){f&&f._slots&&f._slots.placeholder&&(f._slots.placeholder.remove(),f._slots.placeholder=null)}function ke(f,b){let k=document.createElement("div");if(k.className="msg "+f,f==="assistant"){let v=document.createElement("div");v.className="thinking-init-placeholder",v.innerHTML='<span class="think-spinner"></span><span class="thinking-label">\u6B63\u5728\u601D\u8003\u2026</span>';let C=document.createElement("div");C.className="ai-slot-think";let E=document.createElement("div");E.className="ai-slot-tools";let R=document.createElement("div");R.className="ai-slot-content",k.append(v,C,E,R),k._slots={placeholder:v,thinkSlot:C,toolsSlot:E,contentSlot:R},k._state={thinking:{text:"",startedAt:0,done:!1,durationMs:0,open:!0,userTouched:!1},tools:{calls:[],openStates:{}},content:{text:""}},b&&(K(k),k._state.content.text=b,Ce(k,!1))}else k.textContent=b||"";return L.appendChild(k),L.scrollTop=L.scrollHeight,k}function et(f){if(f==null||f==="")return"(\u7A7A)";if(typeof f=="string")try{let b=JSON.parse(f);return JSON.stringify(b,null,2)}catch(b){return f}try{return JSON.stringify(f,null,2)}catch(b){return String(f)}}function We(f){if(!f._slots||!f._state)return;let{thinkSlot:b}=f._slots,k=f._state.thinking;if(!k.text){b.innerHTML="";return}let v=b.querySelector(".think");v||(v=document.createElement("div"),b.appendChild(v)),v.className="think"+(k.done?" is-done":" is-streaming")+(k.open?" is-open":"");let C=Math.max(0,Math.round((k.durationMs||0)/100)/10).toFixed(1).replace(/\.0$/,""),E=k.done?k.durationMs>0&&C!=="0"?`\u5DF2\u6DF1\u5EA6\u601D\u8003 \xB7 ${C}\u79D2`:"\u5DF2\u6DF1\u5EA6\u601D\u8003":k.durationMs>=800?`\u6DF1\u5EA6\u601D\u8003\u4E2D \xB7 ${C}\u79D2`:"\u6DF1\u5EA6\u601D\u8003\u4E2D\u2026",R=v.querySelector(".think-head");R||(R=document.createElement("button"),R.type="button",R.className="think-head",R.innerHTML=`
        <svg class="think-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span class="think-spinner"></span>
        <span class="think-label"></span>
      `,R.addEventListener("click",()=>{k.userTouched=!0,k.open=!k.open,We(f)}),v.appendChild(R));let T=R.querySelector(".think-chevron");T&&(k.open?T.classList.add("rotated"):T.classList.remove("rotated"));let M=R.querySelector(".think-spinner");M&&(M.style.display=k.done?"none":"inline-block");let P=R.querySelector(".think-label");P&&(P.textContent=E);let H=v.querySelector(".think-body-wrapper");if(!H){H=document.createElement("div"),H.className="think-body-wrapper";let oe=document.createElement("div");oe.className="think-inner";let ue=document.createElement("div");ue.className="think-body",oe.appendChild(ue),H.appendChild(oe),v.appendChild(H)}H.className="think-body-wrapper"+(k.open?" is-open":"");let ne=H.querySelector(".think-body");ne.textContent=k.text,!k.done&&k.open&&(ne.scrollTop=ne.scrollHeight)}function ze(f,b,k,v){let C=document.createElement("div"),E=!!k.openStates[b];C.className=`tool-call-card is-${f.status} ${E?"is-open":""}`;let R=document.createElement("div");R.className="tool-call-summary";let T=document.createElement("span");T.className=`tool-call-arrow ${E?"rotated":""}`,T.textContent="\u203A";let M=document.createElement("span");M.className="tool-call-icon",f.status==="running"?(M.className+=" is-spinning",M.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'):f.status==="ok"?M.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':f.status==="fail"?M.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>':M.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';let P=document.createElement("span");P.className="tool-call-main";let H=document.createElement("span");H.className="tool-call-name",H.textContent=f.name||"\u5DE5\u5177\u8C03\u7528";let ne=document.createElement("span");if(ne.className="tool-call-status-wrapper",f.durationMs!=null&&f.durationMs>0){let j=document.createElement("span");j.className="tool-call-duration",j.textContent=f.durationMs<1e3?`${Math.round(f.durationMs)}ms`:`${(f.durationMs/1e3).toFixed(1)}s`,ne.appendChild(j)}let oe=document.createElement("span");oe.className="tool-call-status",oe.textContent=f.status==="running"?"\u8FD0\u884C\u4E2D\u2026":f.status==="ok"?"\u5B8C\u6210":"\u8C03\u7528\u5931\u8D25",ne.appendChild(oe),P.append(H,ne),R.append(T,M,P),R.addEventListener("click",j=>{j.stopPropagation(),k.openStates[b]=!E,k._structureDirty=!0,_e(v)});let ue=document.createElement("div");ue.className=`tool-call-body-wrapper ${E?"is-open":""}`;let me=document.createElement("div");me.className="tool-call-body";let ae=document.createElement("div");if(ae.className="tool-call-inner",f.args!=null&&f.args!==""){let j=document.createElement("div");j.className="tool-call-field",j.innerHTML='<span class="tool-call-label">\u53C2\u6570</span>';let A=document.createElement("pre");A.textContent=et(f.args),j.appendChild(A),ae.appendChild(j)}if(f.result!=null&&f.result!==""){let j=document.createElement("div");j.className="tool-call-field",j.innerHTML=`<span class="tool-call-label">${f.status==="fail"?"\u9519\u8BEF":"\u8FD4\u56DE"}</span>`;let A=document.createElement("pre");A.textContent=et(f.result),j.appendChild(A),ae.appendChild(j)}return me.appendChild(ae),ue.appendChild(me),C.append(R,ue),C}function _e(f){if(!f._slots||!f._state)return;let{toolsSlot:b}=f._slots,k=f._state.tools;if(!k.calls||k.calls.length===0){b.innerHTML="";return}let v=b.querySelector(".tool-call-list");v||(v=document.createElement("div"),v.className="tool-call-list",b.appendChild(v));let C=k.calls.length,E=v.querySelectorAll(".tool-call-card");if(E.length===C&&!k._structureDirty){k.calls.forEach((A,V)=>{let N=E[V];if(!N)return;let ee=N.querySelector(".tool-call-duration");ee&&A.durationMs>0&&(ee.textContent=A.durationMs<1e3?`${Math.round(A.durationMs)}ms`:`${(A.durationMs/1e3).toFixed(1)}s`);let F=N.querySelector(".tool-call-status");F&&(F.textContent=A.status==="running"?"\u8FD0\u884C\u4E2D\u2026":A.status==="ok"?"\u5B8C\u6210":"\u8C03\u7528\u5931\u8D25")});return}if(k._structureDirty=!1,v.innerHTML="",C<=1){v.appendChild(ze(k.calls[0],0,k,f));return}let R=k.calls.slice(0,C-1),T=k.calls[C-1],M=document.createElement("div");M.className="tool-history-group";let P=!!k.historyOpen,H=document.createElement("button");H.type="button",H.className="tool-history-head",H.addEventListener("click",()=>{k.historyOpen=!P,k._structureDirty=!0,_e(f)});let ne=document.createElement("span");ne.className=`tool-history-arrow ${P?"rotated":""}`,ne.textContent="\u203A";let oe=document.createElement("span");oe.className="tool-history-label";let ue=document.createElement("span");ue.className="tool-history-tag",ue.textContent=R.length;let me=document.createElement("span");me.textContent="\u4E2A\u5DF2\u5B8C\u6210\u524D\u5E8F\u5DE5\u5177\u8C03\u7528",oe.append(ne,ue,me),H.appendChild(oe),M.appendChild(H);let ae=document.createElement("div");ae.className=`tool-history-body ${P?"is-open":""}`;let j=document.createElement("div");j.className="tool-history-inner",R.forEach((A,V)=>{j.appendChild(ze(A,V,k,f))}),ae.appendChild(j),M.appendChild(ae),v.appendChild(M),v.appendChild(ze(T,C-1,k,f))}function Ce(f,b){if(!f._slots||!f._state)return;let{contentSlot:k}=f._slots,v=f._state.content.text||"";if(!v.trim()){k.innerHTML="";return}let C=k.querySelector(".assistant-flow-content");C||(C=document.createElement("div"),C.className="assistant-flow-content",k.appendChild(C));let E=He(v,b),R=JSON.stringify(E.map(T=>T.kind+(T.text?T.text.length:"")+(T.data?JSON.stringify(T.data):"")));C.dataset.renderKey!==R&&(C.dataset.renderKey=R,C.innerHTML="",E.forEach(T=>{if(T.kind==="md"){let M=document.createElement("div");M.className="markdown-body mixed-chunk--md";let P=Te(T.text);P!=null?M.innerHTML=P:M.textContent=T.text,C.appendChild(M)}else if(T.kind==="render")try{let M=window.renderRenderJSON?window.renderRenderJSON(T.data):null;M&&(M.classList.add("mixed-chunk--render"),C.appendChild(M))}catch(M){}else if(T.kind==="loading"){let M=document.createElement("div");M.className="render-loading-tip mixed-chunk--loading",M.innerHTML='<span class="css-spinner"></span><span>\u6B63\u5728\u751F\u6210\u56FE\u8868\u6570\u636E\u2026</span>',C.appendChild(M)}}),L.scrollTop=L.scrollHeight)}function Zt(f,b){if(!b||!f._state)return;K(f);let k=f._state.thinking;k.startedAt||(k.startedAt=Date.now()),k.text+=b,We(f)}function ht(f){if(!f._state)return;let b=f._state.thinking;b.text&&!b.done&&(b.done=!0,b.durationMs=Math.max(0,Date.now()-(b.startedAt||Date.now())),B&&(clearInterval(B),B=null),b.userTouched||(b.open=!1),We(f))}function je(f){return K(f),f._state?f._state.tools:{calls:[],openStates:{}}}function Ge(f,b){!b||!f._state||(K(f),ht(f),f._state.content.text+=b,Ce(f,!0))}let Oe=!1,Fe=null,Ee=[],tt=20,B=null,Vt=0;function mt(){Fe&&(Fe.abort(),Fe=null)}function Mt(f){Oe=f,f?(Y.textContent="\u505C\u6B62",Y.className="send-btn stop-btn",Y.disabled=!1,Y.title="\u505C\u6B62\u56DE\u7B54 (Esc)",i.querySelectorAll(".example-btn").forEach(b=>{b.disabled=!0,b.classList.add("disabled")})):(B&&(clearInterval(B),B=null),Fe=null,Y.textContent="\u53D1\u9001",Y.className="send-btn",Y.disabled=!1,Y.title="\u53D1\u9001 (Enter)",i.querySelectorAll(".example-btn").forEach(b=>{b.disabled=!1,b.classList.remove("disabled")}))}async function gt(f){if(Oe||(f=(f||U.value).trim(),!f))return;U.value="",I&&I.parentNode&&I.remove(),ke("user",f),Ee.push({role:"user",content:f}),Ee.length>tt&&Ee.splice(0,Ee.length-tt);let b=ke("assistant",""),k="";Mt(!0),r.textContent="",Fe=new AbortController,Vt=Date.now(),B=setInterval(()=>{if(b&&b._state){let v=b._state.thinking;v&&!v.done&&v.startedAt&&(v.durationMs=Date.now()-v.startedAt,v.text&&We(b));let C=b._state.tools;if(C&&C.calls&&C.calls.length>0){let E=!1;C.calls.forEach(R=>{R.status==="running"&&R.startedAt&&(R.durationMs=Date.now()-R.startedAt,E=!0)}),E&&_e(b)}}},150);try{let v=await $i(e.headers),C=await fetch(t+"/assistant/chat",{method:"POST",credentials:"include",headers:Object.assign({},v,{"Content-Type":"application/json"}),body:JSON.stringify({message:f,messages:Ee.slice()}),signal:Fe.signal});if(!C.ok){let P="HTTP "+C.status;try{let H=await C.json(),ne=H&&(H.error||H.msg||H.message);ne&&(P=ne)}catch(H){}throw new Error(P)}let E=C.body.getReader(),R=new TextDecoder,T="";for(;;){let{done:P,value:H}=await E.read();if(P)break;T+=R.decode(H,{stream:!0});let ne;for(;(ne=T.indexOf(`

`))>=0;){let oe=T.slice(0,ne);T=T.slice(ne+2);for(let ue of oe.split(`
`)){if(!ue.startsWith("data:"))continue;let me=ue.slice(5).trim();if(!(!me||me==="[DONE]"))try{let ae=JSON.parse(me);if(ae.object==="agent.event"){let A=ae.x_agent||{},V=A.extra||{},N=je(b),ee=V.call_id||A.name;if(N._hasAgentEvents=!0,A.type==="tool_start")r.textContent="\u67E5\u8BE2\u6570\u636E\u4E2D\u2026",N._structureDirty=!0,N.calls.push({call_id:ee,name:A.name,args:V.arguments,result:"",status:"running",startedAt:Date.now(),durationMs:0}),_e(b);else if(A.type==="tool_end"){N._structureDirty=!0;let F=[...N.calls].reverse().find(le=>le.call_id===ee&&le.status==="running")||N.calls.find(le=>le.call_id===ee)||N.calls[N.calls.length-1];F&&(F.status=A.status==="success"?"ok":"fail",F.result=V.result_preview||A.message||"",F.startedAt&&(F.durationMs=Math.max(1,Date.now()-F.startedAt))),_e(b)}else if(A.type==="tool_error"){N._structureDirty=!0;let F=[...N.calls].reverse().find(le=>le.call_id===ee&&le.status==="running")||N.calls.find(le=>le.call_id===ee)||N.calls[N.calls.length-1];F&&(F.status="fail",F.result=A.message||"\u8C03\u7528\u5931\u8D25",F.startedAt&&(F.durationMs=Math.max(1,Date.now()-F.startedAt))),_e(b)}continue}let j=ae.choices&&ae.choices[0]&&ae.choices[0].delta;if(!j)continue;if(j.reasoning_content){let A=j.reasoning_content;if(/^(\[工具调用\]|\[执行成功\]|\[执行失败\])/.test(A)){let V=je(b);if(!V._hasAgentEvents){if(A.startsWith("[\u5DE5\u5177\u8C03\u7528]")){let N=A.replace(/^\[工具调用\]\s*/,"").trim(),ee=N.indexOf(" ");V.calls.push({name:ee>0?N.slice(0,ee):N,args:ee>0?N.slice(ee+1):"",result:"",status:"running",startedAt:Date.now(),durationMs:0})}else if(A.startsWith("[\u6267\u884C\u6210\u529F]")){let N=A.replace(/^\[执行成功\]\s*/,"").trim(),ee=N.indexOf(":"),F=[...V.calls].reverse().find(le=>le.status==="running")||V.calls[V.calls.length-1];F&&(F.status="ok",F.result=ee>0?N.slice(ee+1).trim():N,F.startedAt&&(F.durationMs=Math.max(1,Date.now()-F.startedAt)))}else if(A.startsWith("[\u6267\u884C\u5931\u8D25]")){let N=A.replace(/^\[执行失败\]\s*/,"").trim(),ee=N.indexOf(":"),F=[...V.calls].reverse().find(le=>le.status==="running")||V.calls[V.calls.length-1];F&&(F.status="fail",F.result=ee>0?N.slice(ee+1).trim():N,F.startedAt&&(F.durationMs=Math.max(1,Date.now()-F.startedAt)))}_e(b)}}else Zt(b,j.reasoning_content)}if(j.content){r.textContent="\u56DE\u7B54\u4E2D\u2026";let A=b._state&&b._state.tools;if(A&&A.calls){let V=!1;A.calls.forEach(N=>{N.status==="running"&&(N.status="ok",V=!0)}),V&&_e(b)}k+=j.content,Ge(b,j.content)}}catch(ae){}}}}let M=b._state&&b._state.tools;if(M&&M.calls){let P=!1;M.calls.forEach(H=>{H.status==="running"&&(H.status="ok",P=!0)}),P&&_e(b)}K(b),ht(b),Ce(b,!1),r.textContent="",k.trim()&&(Ee.push({role:"assistant",content:k}),Ee.length>tt&&Ee.splice(0,Ee.length-tt))}catch(v){K(b),ht(b),v.name==="AbortError"?(Ge(b,`

*\uFF08\u5DF2\u505C\u6B62\u751F\u6210\uFF09*`),r.textContent="\u5DF2\u4E2D\u65AD"):(Ge(b,`

[\u9519\u8BEF] `+v.message),r.textContent="\u5931\u8D25"),Ce(b,!1)}finally{Mt(!1)}}return Y.addEventListener("click",()=>{Oe?mt():gt()}),U.addEventListener("keydown",f=>{f.key==="Enter"&&!f.shiftKey?(f.preventDefault(),Oe||gt()):f.key==="Escape"&&Oe&&(f.preventDefault(),mt())}),L.addEventListener("click",f=>{let b=f.target.closest(".example-btn");if(b){if(Oe)return;gt(b.textContent.trim())}}),{setMaximized:m}}var Se=["#4f46e5","#06b6d4","#10b981","#f59e0b","#8b5cf6","#ec4899","#3b82f6","#f97316"],Hi="http://www.w3.org/2000/svg";function Re(i,e,t){let n=document.createElementNS(Hi,i);for(let a in e)n.setAttribute(a,e[a]);return t!==void 0&&(n.textContent=t),n}function ft(i){if(i==null||i==="")return"0";let e=Number(i);return isNaN(e)?String(i):e.toLocaleString("zh-CN")}function Wt(i){let e=document.createElement("div");e.className="data-table-wrap";let t=document.createElement("table");t.className="data-table";let n=(i.columns||[]).map(c=>({field:c.field,label:c.label||c.field})),a=document.createElement("thead"),s=document.createElement("tr");n.forEach(c=>{let d=document.createElement("th");d.textContent=c.label,s.appendChild(d)}),a.appendChild(s);let r=document.createElement("tbody");return(i.rows||[]).forEach(c=>{let d=document.createElement("tr");n.forEach(g=>{let m=document.createElement("td");m.textContent=c[g.field]===void 0?"":String(c[g.field]),d.appendChild(m)}),r.appendChild(d)}),t.append(a,r),e.appendChild(t),e}function Zo(i,e){let t=i.data||[],n=i.series||[],a=i.x_axis&&i.x_axis.field;if(!t.length||!n.length||!a)return Wt(i);let s="";e==="chart_bar"&&t.length>24&&(t=t.slice(0,24),s="\uFF08\u5C55\u793A\u524D 24 \u9879\uFF09");let r=480,c=240,d=48,g=14,m=16,x=42,y=r-d-g,w=c-m-x,$=t.map((O,W)=>a?O[a]:"\u7B2C"+(W+1)+"\u9879"),L=0;n.forEach(O=>t.forEach(W=>{L=Math.max(L,Number(W[O.field])||0)})),L<=0&&(L=1);let I=qi(L),z=Re("svg",{viewBox:"0 0 "+r+" "+c,class:"dq-svg-chart",role:"img"});for(let O=0;O<=4;O++){let W=m+w-w*O/4;z.appendChild(Re("line",{x1:d,y1:W,x2:r-g,y2:W,stroke:"#f1f5f9","stroke-width":1}));let X=Re("text",{x:d-8,y:W+4,"text-anchor":"end","font-size":10,fill:"#94a3b8"});X.textContent=ft(Math.round(I*O/4)),z.appendChild(X)}let te=Math.ceil($.length/12);if($.forEach((O,W)=>{if(W%te!==0)return;let X=Re("text",{x:d+y*(W+.5)/$.length,y:c-x+16,"text-anchor":"middle","font-size":10,fill:"#64748b"});X.textContent=String(O).length>6?String(O).slice(0,6)+"\u2026":O,z.appendChild(X)}),e==="chart_bar"){let O=y/$.length,W=Math.min(24,O*.7/n.length);n.forEach((X,fe)=>{t.forEach((U,Y)=>{let Te=Number(U[X.field])||0,He=Te/I*w,K=d+O*Y+(O-W*n.length)/2+fe*W,ke=Re("rect",{x:K,y:m+w-He,width:W-1,height:Math.max(He,1),fill:Se[fe%Se.length],rx:3,class:"dq-svg-bar"});ke.setAttribute("data-tip",($[Y]||"")+" \xB7 "+(X.name||X.field)+"\uFF1A"+ft(Te)),z.appendChild(ke)})})}else n.forEach((O,W)=>{let X=t.map((U,Y)=>{let Te=Number(U[O.field])||0;return[(d+y*(Y+.5))/$.length,m+w-Te/I*w]}),fe=X.map((U,Y)=>(Y===0?"M":"L")+U[0].toFixed(1)+" "+U[1].toFixed(1)).join(" ");z.appendChild(Re("path",{d:fe,fill:"none",stroke:Se[W%Se.length],"stroke-width":2,"stroke-linejoin":"round"})),t.length<=48&&X.forEach((U,Y)=>{let Te=Re("circle",{cx:U[0].toFixed(1),cy:U[1].toFixed(1),r:3,fill:Se[W%Se.length]});Te.setAttribute("data-tip",($[Y]||"")+" \xB7 "+(O.name||O.field)+"\uFF1A"+ft(t[Y][O.field])),z.appendChild(Te)})});return Vo(z,i,n,s)}function Fi(i){let e=i.data||[],t=i.name_field,n=i.value_field;if(!e.length||!t||!n)return Wt(i);let a="";if(e.length>7){let w=[...e].sort((z,te)=>(Number(te[n])||0)-(Number(z[n])||0)),$=w.slice(0,6),I=w.slice(6).reduce((z,te)=>z+(Number(te[n])||0),0);I>0&&$.push({[t]:"\u5176\u4ED6",[n]:I}),e=$,a="\uFF08Top 6 + \u5176\u4ED6\uFF09"}let s=480,r=240,c=130,d=r/2,g=88,m=e.reduce((w,$)=>w+(Number($[n])||0),0)||1,x=Re("svg",{viewBox:"0 0 "+s+" "+r,class:"dq-svg-chart",role:"img"}),y=-Math.PI/2;return e.forEach((w,$)=>{let L=Number(w[n])||0,I=L/m,z=y+I*Math.PI*2,te=c+g*Math.cos(y),O=d+g*Math.sin(y),W=c+g*Math.cos(z),X=d+g*Math.sin(z),fe=I>.5?1:0,U=Re("path",{d:"M"+c+" "+d+" L"+te.toFixed(1)+" "+O.toFixed(1)+" A"+g+" "+g+" 0 "+fe+" 1 "+W.toFixed(1)+" "+X.toFixed(1)+" Z",fill:Se[$%Se.length],stroke:"#fff","stroke-width":1.5});U.setAttribute("data-tip",(w[t]||"")+"\uFF1A"+ft(L)+"\uFF08"+(I*100).toFixed(1)+"%\uFF09"),x.appendChild(U),y=z}),e.forEach((w,$)=>{let L=30+$*22;x.appendChild(Re("rect",{x:260,y:L-8,width:10,height:10,rx:2,fill:Se[$%Se.length]}));let I=Re("text",{x:276,y:L,"font-size":11,fill:"#1e293b"}),z=String(w[t]||"");I.textContent=(z.length>10?z.slice(0,10)+"\u2026":z)+" "+ft(w[n]),x.appendChild(I)}),Vo(x,i,[],a)}function Ui(i){let e=document.createElement("div");return e.className="metric-cards",(i.cards||[]).forEach(t=>{let n=document.createElement("div");n.className="metric-card";let a=document.createElement("div");a.className="metric-label",a.textContent=t.label||"";let s=document.createElement("div");if(s.className="metric-value",s.textContent=ft(t.value),t.unit){let r=document.createElement("span");r.className="metric-unit",r.textContent=t.unit,s.appendChild(r)}n.append(a,s),e.appendChild(n)}),e}function Vo(i,e,t,n){let a=document.createElement("div");if(a.className="render-card",e.title||n){let s=document.createElement("div");s.className="chart-title",s.textContent=(e.title||"\u6570\u636E\u56FE\u8868")+(n?" "+n:""),a.appendChild(s)}if(i.style.width="100%",i.style.height="auto",a.appendChild(i),t.length>1){let s=document.createElement("div");s.style.cssText="display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:#64748b;margin-top:4px;",t.forEach((r,c)=>{let d=document.createElement("span"),g=document.createElement("span");g.style.cssText="display:inline-block;width:8px;height:8px;border-radius:2px;background:"+Se[c%Se.length]+";margin-right:4px;",d.appendChild(g),d.appendChild(document.createTextNode(r.name||r.field)),s.appendChild(d)}),a.appendChild(s)}return Bi(a,i),a}function Bi(i,e){let t=document.createElement("div");t.className="dq-tooltip",t.style.cssText=["position:absolute;","pointer-events:none;","z-index:10;","background:rgba(15,23,42,.92);","color:#f8fafc;","padding:5px 9px;","border-radius:6px;","font-size:12px;","line-height:1.5;","white-space:nowrap;","box-shadow:0 4px 12px rgba(0,0,0,.25);","opacity:0;","transition:opacity .12s;","top:0;","left:0;"].join(""),i.style.position=i.style.position||"relative",i.appendChild(t);let n=r=>{let c=r.getAttribute("data-tip");c&&(t.textContent=c,t.style.opacity="1")},a=r=>{let c=i.getBoundingClientRect(),d=r.clientX-c.left+12,g=r.clientY-c.top-10;d+t.offsetWidth>c.width&&(d=r.clientX-c.left-t.offsetWidth-12),g+t.offsetHeight>c.height&&(g=r.clientY-c.top-t.offsetHeight-4),g<0&&(g=4),t.style.left=d+"px",t.style.top=g+"px"},s=()=>{t.style.opacity="0"};e.addEventListener("mouseover",r=>{let c=r.target.closest("[data-tip]");c&&n(c)}),e.addEventListener("mousemove",a),e.addEventListener("mouseout",r=>{r.target.closest("[data-tip]")&&s()})}function qi(i){if(i<=5)return 5;let e=Math.pow(10,Math.floor(Math.log10(i)));for(let t of[1,2,5,10])if(t*e>=i)return t*e;return i}function Xo(i){if(!i||!i.type)return null;switch(i.type){case"data_table":return Wt(i);case"chart_bar":return Zo(i,"chart_bar");case"chart_line":return Zo(i,"chart_line");case"chart_pie":return Fi(i);case"metric_cards":return Ui(i);default:return Wt(i)}}var In=`/* gf-mate \u5D4C\u5165\u5F0F\u5C0F\u7A97\u6837\u5F0F\uFF08Shadow DOM \u5185\u6CE8\u5165\uFF09\uFF1A
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
  max-height: 280px;
  overflow-y: auto;
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
  position: sticky;
  top: 0;
  z-index: 1;
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
}`;window.renderRenderJSON=Xo;window.marked=G;window.DOMPurify=Yo;var jt='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M14 9.5v3"/><path d="M10 11v1.5"/></svg>',Dn='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',Qo=`
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
  position: fixed; bottom: 86px; right: 24px; width: 460px; height: 620px;
  min-width: 320px; min-height: 360px;
  max-width: calc(100vw - 32px); max-height: calc(100vh - 110px);
  border-radius: 16px;
  box-shadow: 0 24px 60px -12px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.9);
  overflow: hidden; z-index: 2147483000; display: none; flex-direction: column;
  background: #ffffff;
  transform-origin: bottom right;
  transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.dq-panel.dq-maximized {
  width: min(940px, calc(100vw - 32px)) !important;
  height: min(88vh, 880px) !important;
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
  .dq-panel { right: 8px; left: 8px; width: auto !important; bottom: 82px; border-radius: 14px; }
}
`,ji=`
.dq-panel-resizer {
  position: absolute; top: 0; left: 0; width: 18px; height: 18px;
  cursor: nwse-resize; z-index: 100; user-select: none; touch-action: none;
}
.dq-panel-resizer::before {
  content: ""; position: absolute; top: 5px; left: 5px; width: 7px; height: 7px;
  border-top: 2px solid rgba(100, 116, 139, 0.55);
  border-left: 2px solid rgba(100, 116, 139, 0.55);
  border-top-left-radius: 2px;
}
.dq-resize-edge-top {
  position: absolute; top: 0; left: 18px; right: 0; height: 6px;
  cursor: ns-resize; z-index: 99; user-select: none; touch-action: none;
}
.dq-resize-edge-left {
  position: absolute; top: 18px; left: 0; bottom: 0; width: 6px;
  cursor: ew-resize; z-index: 99; user-select: none; touch-action: none;
}
`,Ae=document.currentScript,Ko=(Ae&&Ae.dataset.dqBase||"").replace(/\/$/,""),er=Ae&&Ae.dataset.dqTitle||void 0,tr=Ae&&Ae.dataset.dqColor||void 0,nr=Ae&&Ae.dataset.dqExamples||void 0;function Gi(i,e,t){let n=document.createElement("div");n.className="dq-panel-resizer";let a=document.createElement("div");a.className="dq-resize-edge-top";let s=document.createElement("div");s.className="dq-resize-edge-left",e.append(n,a,s);function r(c,d,g){c.addEventListener("pointerdown",m=>{if(m.button!==void 0&&m.button!==0)return;m.preventDefault(),m.stopPropagation();let x=m.clientX,y=m.clientY,w=i.getBoundingClientRect(),$=w.width,L=w.height;i.style.width=$+"px",i.style.height=L+"px",i.classList.remove("dq-maximized"),i.style.transition="none",typeof t=="function"&&t(),c.setPointerCapture(m.pointerId);let I=te=>{if(d){let O=Math.max(320,Math.min(window.innerWidth-32,$+(x-te.clientX)));i.style.width=O+"px"}if(g){let O=Math.max(360,Math.min(window.innerHeight-110,L+(y-te.clientY)));i.style.height=O+"px"}},z=te=>{i.style.transition="";try{c.releasePointerCapture(te.pointerId)}catch(O){}c.removeEventListener("pointermove",I),c.removeEventListener("pointerup",z),c.removeEventListener("pointercancel",z)};c.addEventListener("pointermove",I),c.addEventListener("pointerup",z),c.addEventListener("pointercancel",z)})}r(n,!0,!0),r(a,!1,!0),r(s,!0,!1)}function Gt(i){i=i||{};let e=(i.base!==void 0?i.base:Ko).replace(/\/$/,""),t=i.title||er||void 0,n=i.color||tr||void 0,a=i.examples||nr||void 0;if(document.getElementById("dq-bubble-style"))document.getElementById("dq-bubble-style").textContent=Qo;else{let x=document.createElement("style");x.id="dq-bubble-style",x.textContent=Qo,document.head.appendChild(x)}let s=document.createElement("button");s.type="button",s.className="dq-bubble",s.setAttribute("aria-label",t||"AI \u6570\u636E\u52A9\u624B"),n&&(s.style.background=n),s.innerHTML=jt;let r=document.createElement("div");r.className="dq-panel";let c=r.attachShadow({mode:"open"}),d=document.createElement("style");d.textContent=In+`
`+ji,c.appendChild(d);let g=document.createElement("div");g.className="dq-widget-root",g.style.cssText="display:flex;flex-direction:column;height:100%;",c.appendChild(g);let m=On(g,{base:e||void 0,title:t,color:n,examples:a,headers:i.headers,onToggleMaximize(x){r.classList.toggle("dq-maximized",!!x)},onClose(){r.classList.remove("dq-open"),s.innerHTML=jt}});return Gi(r,c,()=>{m&&typeof m.setMaximized=="function"&&m.setMaximized(!1)}),s.addEventListener("click",()=>{let x=r.classList.toggle("dq-open");s.innerHTML=x?Dn:jt}),i.open&&(r.classList.add("dq-open"),s.innerHTML=Dn),document.body.append(r,s),{open(){r.classList.add("dq-open"),s.innerHTML=Dn},close(){r.classList.remove("dq-open"),s.innerHTML=jt},toggle(){s.click()},destroy(){s.remove(),r.remove()}}}var Yt=class extends HTMLElement{connectedCallback(){if(this._mounted)return;this._mounted=!0;let e=this.getAttribute("base")||this.getAttribute("api")||Ko||void 0,t=this.getAttribute("title")||er||void 0,n=this.getAttribute("color")||tr||void 0,a=this.getAttribute("examples")||nr||void 0;if(this.hasAttribute("inline")||this.getAttribute("mode")==="inline"){let r=this.attachShadow({mode:"open"}),c=document.createElement("style");c.textContent=`:host { display: block; width: 100%; height: 100%; min-height: 420px; overflow: hidden; background: #fff; border-radius: inherit; }
`+In,r.appendChild(c);let d=document.createElement("div");d.className="dq-widget-root",d.style.cssText="display:flex;flex-direction:column;height:100%;width:100%;",r.appendChild(d),this._inst=On(d,{base:e?e.replace(/\/$/,""):void 0,title:t,color:n,examples:a,inline:!0,headers:()=>this._headerValue()})}else this._inst=Gt({base:e,title:t,color:n,examples:a,open:this.hasAttribute("open"),headers:()=>this._headerValue()})}get headers(){return this._headers}set headers(e){this._headers=e}_headerValue(){return typeof this._headers=="function"?this._headers():this._headers}disconnectedCallback(){this._inst&&typeof this._inst.destroy=="function"&&this._inst.destroy(),this._mounted=!1}open(){this._inst&&this._inst.open&&this._inst.open()}close(){this._inst&&this._inst.close&&this._inst.close()}toggle(){this._inst&&this._inst.toggle&&this._inst.toggle()}};typeof customElements!="undefined"&&(customElements.get("gf-mate")||customElements.define("gf-mate",Yt),customElements.get("dq-assistant")||customElements.define("dq-assistant",class extends Yt{}));function Jo(){if(document.querySelector("gf-mate, dq-assistant")||Ae&&Ae.dataset.dqAuto==="false"){window.DQWidget={mount:Gt};return}let i=Gt();Ae&&Ae.dataset.dqOpen!==void 0&&i.open(),window.DQWidget=i,window.DQWidget.mount=Gt}document.body?Jo():document.addEventListener("DOMContentLoaded",Jo);})();
