(()=>{var Tr=Object.defineProperty;var ao=i=>{throw TypeError(i)};var _r=(i,e,t)=>e in i?Tr(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var Q=(i,e,t)=>_r(i,typeof e!="symbol"?e+"":e,t),Er=(i,e,t)=>e.has(i)||ao("Cannot "+t);var lo=(i,e,t)=>e.has(i)?ao("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t);var Pt=(i,e,t)=>(Er(i,e,"access private method"),t);function gn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Je=gn();function mo(i){Je=i}var go=/[&<>"']/,vr=new RegExp(go.source,"g"),bo=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,Sr=new RegExp(bo.source,"g"),Ar={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},co=i=>Ar[i];function ye(i,e){if(e){if(go.test(i))return i.replace(vr,co)}else if(bo.test(i))return i.replace(Sr,co);return i}var Cr=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;function Rr(i){return i.replace(Cr,(e,t)=>(t=t.toLowerCase(),t==="colon"?":":t.charAt(0)==="#"?t.charAt(1)==="x"?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""))}var Mr=/(^|[^\[])\^/g;function Z(i,e){let t=typeof i=="string"?i:i.source;e=e||"";let n={replace:(a,s)=>{let r=typeof s=="string"?s:s.source;return r=r.replace(Mr,"$1"),t=t.replace(a,r),n},getRegex:()=>new RegExp(t,e)};return n}function po(i){try{i=encodeURI(i).replace(/%25/g,"%")}catch(e){return null}return i}var wt={exec:()=>null};function uo(i,e){let t=i.replace(/\|/g,(s,r,c)=>{let d=!1,g=r;for(;--g>=0&&c[g]==="\\";)d=!d;return d?"|":" |"}),n=t.split(/ \|/),a=0;if(n[0].trim()||n.shift(),n.length>0&&!n[n.length-1].trim()&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;a<n.length;a++)n[a]=n[a].trim().replace(/\\\|/g,"|");return n}function $t(i,e,t){let n=i.length;if(n===0)return"";let a=0;for(;a<n;){let s=i.charAt(n-a-1);if(s===e&&!t)a++;else if(s!==e&&t)a++;else break}return i.slice(0,n-a)}function Nr(i,e){if(i.indexOf(e[1])===-1)return-1;let t=0;for(let n=0;n<i.length;n++)if(i[n]==="\\")n++;else if(i[n]===e[0])t++;else if(i[n]===e[1]&&(t--,t<0))return n;return-1}function fo(i,e,t,n){let a=e.href,s=e.title?ye(e.title):null,r=i[1].replace(/\\([\[\]])/g,"$1");if(i[0].charAt(0)!=="!"){n.state.inLink=!0;let c={type:"link",raw:t,href:a,title:s,text:r,tokens:n.inlineTokens(r)};return n.state.inLink=!1,c}return{type:"image",raw:t,href:a,title:s,text:ye(r)}}function Lr(i,e){let t=i.match(/^(\s+)(?:```)/);if(t===null)return e;let n=t[1];return e.split(`
`).map(a=>{let s=a.match(/^\s+/);if(s===null)return a;let[r]=s;return r.length>=n.length?a.slice(n.length):a}).join(`
`)}var lt=class{constructor(e){Q(this,"options");Q(this,"rules");Q(this,"lexer");this.options=e||Je}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:$t(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],a=Lr(n,t[3]||"");return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:a}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(/#$/.test(n)){let a=$t(n,"#");(this.options.pedantic||!a||/ $/.test(a))&&(n=a.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:t[0]}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=t[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,`
    $1`);n=$t(n.replace(/^ *>[ \t]?/gm,""),`
`);let a=this.lexer.state.top;this.lexer.state.top=!0;let s=this.lexer.blockTokens(n);return this.lexer.state.top=a,{type:"blockquote",raw:t[0],tokens:s,text:n}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),a=n.length>1,s={type:"list",raw:"",ordered:a,start:a?+n.slice(0,-1):"",loose:!1,items:[]};n=a?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=a?n:"[*+-]");let r=new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),c="",d="",g=!1;for(;e;){let b=!1;if(!(t=r.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let y=t[2].split(`
`,1)[0].replace(/^\t+/,P=>" ".repeat(3*P.length)),w=e.split(`
`,1)[0],_=0;this.options.pedantic?(_=2,d=y.trimStart()):(_=t[2].search(/[^ ]/),_=_>4?1:_,d=y.slice(_),_+=t[1].length);let q=!1;if(!y&&/^ *$/.test(w)&&(c+=w+`
`,e=e.substring(w.length+1),b=!0),!b){let P=new RegExp(`^ {0,${Math.min(3,_-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),le=new RegExp(`^ {0,${Math.min(3,_-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),$=new RegExp(`^ {0,${Math.min(3,_-1)}}(?:\`\`\`|~~~)`),W=new RegExp(`^ {0,${Math.min(3,_-1)}}#`);for(;e;){let V=e.split(`
`,1)[0];if(w=V,this.options.pedantic&&(w=w.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),$.test(w)||W.test(w)||P.test(w)||le.test(e))break;if(w.search(/[^ ]/)>=_||!w.trim())d+=`
`+w.slice(_);else{if(q||y.search(/[^ ]/)>=4||$.test(y)||W.test(y)||le.test(y))break;d+=`
`+w}!q&&!w.trim()&&(q=!0),c+=V+`
`,e=e.substring(V.length+1),y=w.slice(_)}}s.loose||(g?s.loose=!0:/\n *\n *$/.test(c)&&(g=!0));let N=null,z;this.options.gfm&&(N=/^\[[ xX]\] /.exec(d),N&&(z=N[0]!=="[ ] ",d=d.replace(/^\[[ xX]\] +/,""))),s.items.push({type:"list_item",raw:c,task:!!N,checked:z,loose:!1,text:d,tokens:[]}),s.raw+=c}s.items[s.items.length-1].raw=c.trimEnd(),s.items[s.items.length-1].text=d.trimEnd(),s.raw=s.raw.trimEnd();for(let b=0;b<s.items.length;b++)if(this.lexer.state.top=!1,s.items[b].tokens=this.lexer.blockTokens(s.items[b].text,[]),!s.loose){let y=s.items[b].tokens.filter(_=>_.type==="space"),w=y.length>0&&y.some(_=>/\n.*\n/.test(_.raw));s.loose=w}if(s.loose)for(let b=0;b<s.items.length;b++)s.items[b].loose=!0;return s}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(/\s+/g," "),a=t[2]?t[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:a,title:s}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!/[:|]/.test(t[2]))return;let n=uo(t[1]),a=t[2].replace(/^\||\| *$/g,"").split("|"),s=t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split(`
`):[],r={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===a.length){for(let c of a)/^ *-+: *$/.test(c)?r.align.push("right"):/^ *:-+: *$/.test(c)?r.align.push("center"):/^ *:-+ *$/.test(c)?r.align.push("left"):r.align.push(null);for(let c of n)r.header.push({text:c,tokens:this.lexer.inline(c)});for(let c of s)r.rows.push(uo(c,r.header.length).map(d=>({text:d,tokens:this.lexer.inline(d)})));return r}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:ye(t[1])}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&/^</.test(n)){if(!/>$/.test(n))return;let r=$t(n.slice(0,-1),"\\");if((n.length-r.length)%2===0)return}else{let r=Nr(t[2],"()");if(r>-1){let d=(t[0].indexOf("!")===0?5:4)+t[1].length+r;t[2]=t[2].substring(0,r),t[0]=t[0].substring(0,d).trim(),t[3]=""}}let a=t[2],s="";if(this.options.pedantic){let r=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(a);r&&(a=r[1],s=r[3])}else s=t[3]?t[3].slice(1,-1):"";return a=a.trim(),/^</.test(a)&&(this.options.pedantic&&!/>$/.test(n)?a=a.slice(1):a=a.slice(1,-1)),fo(t,{href:a&&a.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let a=(n[2]||n[1]).replace(/\s+/g," "),s=t[a.toLowerCase()];if(!s){let r=n[0].charAt(0);return{type:"text",raw:r,text:r}}return fo(n,s,n[0],this.lexer)}}emStrong(e,t,n=""){let a=this.rules.inline.emStrongLDelim.exec(e);if(!a||a[3]&&n.match(/[\p{L}\p{N}]/u))return;if(!(a[1]||a[2]||"")||!n||this.rules.inline.punctuation.exec(n)){let r=[...a[0]].length-1,c,d,g=r,b=0,y=a[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(y.lastIndex=0,t=t.slice(-1*e.length+r);(a=y.exec(t))!=null;){if(c=a[1]||a[2]||a[3]||a[4]||a[5]||a[6],!c)continue;if(d=[...c].length,a[3]||a[4]){g+=d;continue}else if((a[5]||a[6])&&r%3&&!((r+d)%3)){b+=d;continue}if(g-=d,g>0)continue;d=Math.min(d,d+g+b);let w=[...a[0]][0].length,_=e.slice(0,r+a.index+w+d);if(Math.min(r,d)%2){let N=_.slice(1,-1);return{type:"em",raw:_,text:N,tokens:this.lexer.inlineTokens(N)}}let q=_.slice(2,-2);return{type:"strong",raw:_,text:q,tokens:this.lexer.inlineTokens(q)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(/\n/g," "),a=/[^ ]/.test(n),s=/^ /.test(n)&&/ $/.test(n);return a&&s&&(n=n.substring(1,n.length-1)),n=ye(n,!0),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){let t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,a;return t[2]==="@"?(n=ye(t[1]),a="mailto:"+n):(n=ye(t[1]),a=n),{type:"link",raw:t[0],text:n,href:a,tokens:[{type:"text",raw:n,text:n}]}}}url(e){var n,a;let t;if(t=this.rules.inline.url.exec(e)){let s,r;if(t[2]==="@")s=ye(t[0]),r="mailto:"+s;else{let c;do c=t[0],t[0]=(a=(n=this.rules.inline._backpedal.exec(t[0]))==null?void 0:n[0])!=null?a:"";while(c!==t[0]);s=ye(t[0]),t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:s,href:r,tokens:[{type:"text",raw:s,text:s}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n;return this.lexer.state.inRawBlock?n=t[0]:n=ye(t[0]),{type:"text",raw:t[0],text:n}}}},Or=/^(?: *(?:\n|$))+/,Ir=/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,zr=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,_t=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Dr=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,xo=/(?:[*+-]|\d{1,9}[.)])/,ko=Z(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,xo).replace(/blockCode/g,/ {4}/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),bn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Pr=/^[^\n]+/,xn=/(?!\s*\])(?:\\.|[^\[\]\\])+/,$r=Z(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label",xn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Fr=Z(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,xo).getRegex(),Ut="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",kn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Hr=Z("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))","i").replace("comment",kn).replace("tag",Ut).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),yo=Z(bn).replace("hr",_t).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex(),Ur=Z(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",yo).getRegex(),yn={blockquote:Ur,code:Ir,def:$r,fences:zr,heading:Dr,hr:_t,html:Hr,lheading:ko,list:Fr,newline:Or,paragraph:yo,table:wt,text:Pr},ho=Z("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",_t).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex(),Br={...yn,table:ho,paragraph:Z(bn).replace("hr",_t).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ho).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex()},qr={...yn,html:Z(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",kn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:wt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Z(bn).replace("hr",_t).replace("heading",` *#{1,6} *[^
]`).replace("lheading",ko).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},wo=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Wr=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,To=/^( {2,}|\\)\n(?!\s*$)/,jr=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Et="\\p{P}\\p{S}",Gr=Z(/^((?![*_])[\spunctuation])/,"u").replace(/punctuation/g,Et).getRegex(),Yr=/\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g,Zr=Z(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,"u").replace(/punct/g,Et).getRegex(),Vr=Z("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])","gu").replace(/punct/g,Et).getRegex(),Xr=Z("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])","gu").replace(/punct/g,Et).getRegex(),Qr=Z(/\\([punct])/,"gu").replace(/punct/g,Et).getRegex(),Jr=Z(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Kr=Z(kn).replace("(?:-->|$)","-->").getRegex(),ei=Z("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Kr).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ht=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,ti=Z(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",Ht).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),_o=Z(/^!?\[(label)\]\[(ref)\]/).replace("label",Ht).replace("ref",xn).getRegex(),Eo=Z(/^!?\[(ref)\](?:\[\])?/).replace("ref",xn).getRegex(),ni=Z("reflink|nolink(?!\\()","g").replace("reflink",_o).replace("nolink",Eo).getRegex(),wn={_backpedal:wt,anyPunctuation:Qr,autolink:Jr,blockSkip:Yr,br:To,code:Wr,del:wt,emStrongLDelim:Zr,emStrongRDelimAst:Vr,emStrongRDelimUnd:Xr,escape:wo,link:ti,nolink:Eo,punctuation:Gr,reflink:_o,reflinkSearch:ni,tag:ei,text:jr,url:wt},oi={...wn,link:Z(/^!?\[(label)\]\((.*?)\)/).replace("label",Ht).getRegex(),reflink:Z(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ht).getRegex()},fn={...wn,escape:Z(wo).replace("])","~|])").getRegex(),url:Z(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},ri={...fn,br:Z(To).replace("{2,}","*").getRegex(),text:Z(fn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Ft={normal:yn,gfm:Br,pedantic:qr},yt={normal:wn,gfm:fn,breaks:ri,pedantic:oi},ze=class i{constructor(e){Q(this,"tokens");Q(this,"options");Q(this,"state");Q(this,"tokenizer");Q(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Je,this.options.tokenizer=this.options.tokenizer||new lt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={block:Ft.normal,inline:yt.normal};this.options.pedantic?(t.block=Ft.pedantic,t.inline=yt.pedantic):this.options.gfm&&(t.block=Ft.gfm,this.options.breaks?t.inline=yt.breaks:t.inline=yt.gfm),this.tokenizer.rules=t}static get rules(){return{block:Ft,inline:yt}}static lex(e,t){return new i(t).lex(e)}static lexInline(e,t){return new i(t).inlineTokens(e)}lex(e){e=e.replace(/\r\n|\r/g,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[]){this.options.pedantic?e=e.replace(/\t/g,"    ").replace(/^ +$/gm,""):e=e.replace(/^( *)(\t+)/gm,(c,d,g)=>d+"    ".repeat(g.length));let n,a,s,r;for(;e;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some(c=>(n=c.call({lexer:this},e,t))?(e=e.substring(n.raw.length),t.push(n),!0):!1))){if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length),n.raw.length===1&&t.length>0?t[t.length-1].raw+=`
`:t.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length),a=t[t.length-1],a&&(a.type==="paragraph"||a.type==="text")?(a.raw+=`
`+n.raw,a.text+=`
`+n.text,this.inlineQueue[this.inlineQueue.length-1].src=a.text):t.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length),a=t[t.length-1],a&&(a.type==="paragraph"||a.type==="text")?(a.raw+=`
`+n.raw,a.text+=`
`+n.raw,this.inlineQueue[this.inlineQueue.length-1].src=a.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title});continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),t.push(n);continue}if(s=e,this.options.extensions&&this.options.extensions.startBlock){let c=1/0,d=e.slice(1),g;this.options.extensions.startBlock.forEach(b=>{g=b.call({lexer:this},d),typeof g=="number"&&g>=0&&(c=Math.min(c,g))}),c<1/0&&c>=0&&(s=e.substring(0,c+1))}if(this.state.top&&(n=this.tokenizer.paragraph(s))){a=t[t.length-1],r&&a.type==="paragraph"?(a.raw+=`
`+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=a.text):t.push(n),r=s.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length),a=t[t.length-1],a&&a.type==="text"?(a.raw+=`
`+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=a.text):t.push(n);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n,a,s,r=e,c,d,g;if(this.tokens.links){let b=Object.keys(this.tokens.links);if(b.length>0)for(;(c=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)b.includes(c[0].slice(c[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,c.index)+"["+"a".repeat(c[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(c=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)r=r.slice(0,c.index)+"["+"a".repeat(c[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(c=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,c.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;e;)if(d||(g=""),d=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some(b=>(n=b.call({lexer:this},e,t))?(e=e.substring(n.raw.length),t.push(n),!0):!1))){if(n=this.tokenizer.escape(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.tag(e)){e=e.substring(n.raw.length),a=t[t.length-1],a&&n.type==="text"&&a.type==="text"?(a.raw+=n.raw,a.text+=n.text):t.push(n);continue}if(n=this.tokenizer.link(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(n.raw.length),a=t[t.length-1],a&&n.type==="text"&&a.type==="text"?(a.raw+=n.raw,a.text+=n.text):t.push(n);continue}if(n=this.tokenizer.emStrong(e,r,g)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.codespan(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.br(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.del(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.autolink(e)){e=e.substring(n.raw.length),t.push(n);continue}if(!this.state.inLink&&(n=this.tokenizer.url(e))){e=e.substring(n.raw.length),t.push(n);continue}if(s=e,this.options.extensions&&this.options.extensions.startInline){let b=1/0,y=e.slice(1),w;this.options.extensions.startInline.forEach(_=>{w=_.call({lexer:this},y),typeof w=="number"&&w>=0&&(b=Math.min(b,w))}),b<1/0&&b>=0&&(s=e.substring(0,b+1))}if(n=this.tokenizer.inlineText(s)){e=e.substring(n.raw.length),n.raw.slice(-1)!=="_"&&(g=n.raw.slice(-1)),d=!0,a=t[t.length-1],a&&a.type==="text"?(a.raw+=n.raw,a.text+=n.text):t.push(n);continue}if(e){let b="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(b);break}else throw new Error(b)}}return t}},ct=class{constructor(e){Q(this,"options");this.options=e||Je}code(e,t,n){var s;let a=(s=(t||"").match(/^\S*/))==null?void 0:s[0];return e=e.replace(/\n$/,"")+`
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
`}strong(e){return`<strong>${e}</strong>`}em(e){return`<em>${e}</em>`}codespan(e){return`<code>${e}</code>`}br(){return"<br>"}del(e){return`<del>${e}</del>`}link(e,t,n){let a=po(e);if(a===null)return n;e=a;let s='<a href="'+e+'"';return t&&(s+=' title="'+t+'"'),s+=">"+n+"</a>",s}image(e,t,n){let a=po(e);if(a===null)return n;e=a;let s=`<img src="${e}" alt="${n}"`;return t&&(s+=` title="${t}"`),s+=">",s}text(e){return e}},Tt=class{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,n){return""+n}image(e,t,n){return""+n}br(){return""}},De=class i{constructor(e){Q(this,"options");Q(this,"renderer");Q(this,"textRenderer");this.options=e||Je,this.options.renderer=this.options.renderer||new ct,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new Tt}static parse(e,t){return new i(t).parse(e)}static parseInline(e,t){return new i(t).parseInline(e)}parse(e,t=!0){let n="";for(let a=0;a<e.length;a++){let s=e[a];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[s.type]){let r=s,c=this.options.extensions.renderers[r.type].call({parser:this},r);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(r.type)){n+=c||"";continue}}switch(s.type){case"space":continue;case"hr":{n+=this.renderer.hr();continue}case"heading":{let r=s;n+=this.renderer.heading(this.parseInline(r.tokens),r.depth,Rr(this.parseInline(r.tokens,this.textRenderer)));continue}case"code":{let r=s;n+=this.renderer.code(r.text,r.lang,!!r.escaped);continue}case"table":{let r=s,c="",d="";for(let b=0;b<r.header.length;b++)d+=this.renderer.tablecell(this.parseInline(r.header[b].tokens),{header:!0,align:r.align[b]});c+=this.renderer.tablerow(d);let g="";for(let b=0;b<r.rows.length;b++){let y=r.rows[b];d="";for(let w=0;w<y.length;w++)d+=this.renderer.tablecell(this.parseInline(y[w].tokens),{header:!1,align:r.align[w]});g+=this.renderer.tablerow(d)}n+=this.renderer.table(c,g);continue}case"blockquote":{let r=s,c=this.parse(r.tokens);n+=this.renderer.blockquote(c);continue}case"list":{let r=s,c=r.ordered,d=r.start,g=r.loose,b="";for(let y=0;y<r.items.length;y++){let w=r.items[y],_=w.checked,q=w.task,N="";if(w.task){let z=this.renderer.checkbox(!!_);g?w.tokens.length>0&&w.tokens[0].type==="paragraph"?(w.tokens[0].text=z+" "+w.tokens[0].text,w.tokens[0].tokens&&w.tokens[0].tokens.length>0&&w.tokens[0].tokens[0].type==="text"&&(w.tokens[0].tokens[0].text=z+" "+w.tokens[0].tokens[0].text)):w.tokens.unshift({type:"text",text:z+" "}):N+=z+" "}N+=this.parse(w.tokens,g),b+=this.renderer.listitem(N,q,!!_)}n+=this.renderer.list(b,c,d);continue}case"html":{let r=s;n+=this.renderer.html(r.text,r.block);continue}case"paragraph":{let r=s;n+=this.renderer.paragraph(this.parseInline(r.tokens));continue}case"text":{let r=s,c=r.tokens?this.parseInline(r.tokens):r.text;for(;a+1<e.length&&e[a+1].type==="text";)r=e[++a],c+=`
`+(r.tokens?this.parseInline(r.tokens):r.text);n+=t?this.renderer.paragraph(c):c;continue}default:{let r='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(r),"";throw new Error(r)}}}return n}parseInline(e,t){t=t||this.renderer;let n="";for(let a=0;a<e.length;a++){let s=e[a];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[s.type]){let r=this.options.extensions.renderers[s.type].call({parser:this},s);if(r!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(s.type)){n+=r||"";continue}}switch(s.type){case"escape":{let r=s;n+=t.text(r.text);break}case"html":{let r=s;n+=t.html(r.text);break}case"link":{let r=s;n+=t.link(r.href,r.title,this.parseInline(r.tokens,t));break}case"image":{let r=s;n+=t.image(r.href,r.title,r.text);break}case"strong":{let r=s;n+=t.strong(this.parseInline(r.tokens,t));break}case"em":{let r=s;n+=t.em(this.parseInline(r.tokens,t));break}case"codespan":{let r=s;n+=t.codespan(r.text);break}case"br":{n+=t.br();break}case"del":{let r=s;n+=t.del(this.parseInline(r.tokens,t));break}case"text":{let r=s;n+=t.text(r.text);break}default:{let r='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(r),"";throw new Error(r)}}}return n}},Ve=class{constructor(e){Q(this,"options");this.options=e||Je}preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}};Q(Ve,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));var Qe,mn,vo,hn=class{constructor(...e){lo(this,Qe);Q(this,"defaults",gn());Q(this,"options",this.setOptions);Q(this,"parse",Pt(this,Qe,mn).call(this,ze.lex,De.parse));Q(this,"parseInline",Pt(this,Qe,mn).call(this,ze.lexInline,De.parseInline));Q(this,"Parser",De);Q(this,"Renderer",ct);Q(this,"TextRenderer",Tt);Q(this,"Lexer",ze);Q(this,"Tokenizer",lt);Q(this,"Hooks",Ve);this.use(...e)}walkTokens(e,t){var a,s;let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case"table":{let c=r;for(let d of c.header)n=n.concat(this.walkTokens(d.tokens,t));for(let d of c.rows)for(let g of d)n=n.concat(this.walkTokens(g.tokens,t));break}case"list":{let c=r;n=n.concat(this.walkTokens(c.items,t));break}default:{let c=r;(s=(a=this.defaults.extensions)==null?void 0:a.childTokens)!=null&&s[c.type]?this.defaults.extensions.childTokens[c.type].forEach(d=>{let g=c[d].flat(1/0);n=n.concat(this.walkTokens(g,t))}):c.tokens&&(n=n.concat(this.walkTokens(c.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let a={...n};if(a.async=this.defaults.async||a.async||!1,n.extensions&&(n.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){let r=t.renderers[s.name];r?t.renderers[s.name]=function(...c){let d=s.renderer.apply(this,c);return d===!1&&(d=r.apply(this,c)),d}:t.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let r=t[s.level];r?r.unshift(s.tokenizer):t[s.level]=[s.tokenizer],s.start&&(s.level==="block"?t.startBlock?t.startBlock.push(s.start):t.startBlock=[s.start]:s.level==="inline"&&(t.startInline?t.startInline.push(s.start):t.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(t.childTokens[s.name]=s.childTokens)}),a.extensions=t),n.renderer){let s=this.defaults.renderer||new ct(this.defaults);for(let r in n.renderer){if(!(r in s))throw new Error(`renderer '${r}' does not exist`);if(r==="options")continue;let c=r,d=n.renderer[c],g=s[c];s[c]=(...b)=>{let y=d.apply(s,b);return y===!1&&(y=g.apply(s,b)),y||""}}a.renderer=s}if(n.tokenizer){let s=this.defaults.tokenizer||new lt(this.defaults);for(let r in n.tokenizer){if(!(r in s))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;let c=r,d=n.tokenizer[c],g=s[c];s[c]=(...b)=>{let y=d.apply(s,b);return y===!1&&(y=g.apply(s,b)),y}}a.tokenizer=s}if(n.hooks){let s=this.defaults.hooks||new Ve;for(let r in n.hooks){if(!(r in s))throw new Error(`hook '${r}' does not exist`);if(r==="options")continue;let c=r,d=n.hooks[c],g=s[c];Ve.passThroughHooks.has(r)?s[c]=b=>{if(this.defaults.async)return Promise.resolve(d.call(s,b)).then(w=>g.call(s,w));let y=d.call(s,b);return g.call(s,y)}:s[c]=(...b)=>{let y=d.apply(s,b);return y===!1&&(y=g.apply(s,b)),y}}a.hooks=s}if(n.walkTokens){let s=this.defaults.walkTokens,r=n.walkTokens;a.walkTokens=function(c){let d=[];return d.push(r.call(this,c)),s&&(d=d.concat(s.call(this,c))),d}}this.defaults={...this.defaults,...a}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return ze.lex(e,t!=null?t:this.defaults)}parser(e,t){return De.parse(e,t!=null?t:this.defaults)}};Qe=new WeakSet,mn=function(e,t){return(n,a)=>{let s={...a},r={...this.defaults,...s};this.defaults.async===!0&&s.async===!1&&(r.silent||console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."),r.async=!0);let c=Pt(this,Qe,vo).call(this,!!r.silent,!!r.async);if(typeof n=="undefined"||n===null)return c(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return c(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));if(r.hooks&&(r.hooks.options=r),r.async)return Promise.resolve(r.hooks?r.hooks.preprocess(n):n).then(d=>e(d,r)).then(d=>r.hooks?r.hooks.processAllTokens(d):d).then(d=>r.walkTokens?Promise.all(this.walkTokens(d,r.walkTokens)).then(()=>d):d).then(d=>t(d,r)).then(d=>r.hooks?r.hooks.postprocess(d):d).catch(c);try{r.hooks&&(n=r.hooks.preprocess(n));let d=e(n,r);r.hooks&&(d=r.hooks.processAllTokens(d)),r.walkTokens&&this.walkTokens(d,r.walkTokens);let g=t(d,r);return r.hooks&&(g=r.hooks.postprocess(g)),g}catch(d){return c(d)}}},vo=function(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let a="<p>An error occurred:</p><pre>"+ye(n.message+"",!0)+"</pre>";return t?Promise.resolve(a):a}if(t)return Promise.reject(n);throw n}};var Xe=new hn;function j(i,e){return Xe.parse(i,e)}j.options=j.setOptions=function(i){return Xe.setOptions(i),j.defaults=Xe.defaults,mo(j.defaults),j};j.getDefaults=gn;j.defaults=Je;j.use=function(...i){return Xe.use(...i),j.defaults=Xe.defaults,mo(j.defaults),j};j.walkTokens=function(i,e){return Xe.walkTokens(i,e)};j.parseInline=Xe.parseInline;j.Parser=De;j.parser=De.parse;j.Renderer=ct;j.TextRenderer=Tt;j.Lexer=ze;j.lexer=ze.lex;j.Tokenizer=lt;j.Hooks=Ve;j.parse=j;var ji=j.options,Gi=j.setOptions,Yi=j.use,Zi=j.walkTokens,Vi=j.parseInline;var Xi=De.parse,Qi=ze.lex;function ii(i,e){this.v=i,this.k=e}function So(i,e){(e==null||e>i.length)&&(e=i.length);for(var t=0,n=Array(e);t<e;t++)n[t]=i[t];return n}function si(i){if(Array.isArray(i))return i}function ai(i,e){var t=i==null?null:typeof Symbol!="undefined"&&i[Symbol.iterator]||i["@@iterator"];if(t!=null){var n,a,s,r,c=[],d=!0,g=!1;try{if(s=(t=t.call(i)).next,e===0){if(Object(t)!==t)return;d=!1}else for(;!(d=(n=s.call(t)).done)&&(c.push(n.value),c.length!==e);d=!0);}catch(b){g=!0,a=b}finally{try{if(!d&&t.return!=null&&(r=t.return(),Object(r)!==r))return}finally{if(g)throw a}}return c}}function li(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ci(i,e){return si(i)||ai(i,e)||di(i,e)||li()}function di(i,e){if(i){if(typeof i=="string")return So(i,e);var t={}.toString.call(i).slice(8,-1);return t==="Object"&&i.constructor&&(t=i.constructor.name),t==="Map"||t==="Set"?Array.from(i):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?So(i,e):void 0}}function Bt(i){var e,t;function n(s,r){try{var c=i[s](r),d=c.value,g=d instanceof ii;Promise.resolve(g?d.v:d).then(function(b){if(g){var y=s==="return"&&d.k?s:"next";if(!d.k||b.done)return n(y,b);b=i[y](b).value}a(!!c.done,b)},function(b){n("throw",b)})}catch(b){a(2,b)}}function a(s,r){s===2?e.reject(r):e.resolve({value:r,done:s}),(e=e.next)?n(e.key,e.arg):t=null}this._invoke=function(s,r){return new Promise(function(c,d){var g={key:s,arg:r,resolve:c,reject:d,next:null};t?t=t.next=g:(e=t=g,n(s,r))})},typeof i.return!="function"&&(this.return=void 0)}Bt.prototype[typeof Symbol=="function"&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},Bt.prototype.next=function(i){return this._invoke("next",i)},Bt.prototype.throw=function(i){return this._invoke("throw",i)},Bt.prototype.return=function(i){return this._invoke("return",i)};var Uo=Object.entries,Ao=Object.setPrototypeOf,pi=Object.isFrozen,Bo=Object.getPrototypeOf,qo=Object.getOwnPropertyDescriptor,ae=Object.freeze,pe=Object.seal,dt=Object.create,Wo=typeof Reflect!="undefined"&&Reflect,Nn=Wo.apply,Ln=Wo.construct;ae||(ae=function(e){return e});pe||(pe=function(e){return e});Nn||(Nn=function(e,t){for(var n=arguments.length,a=new Array(n>2?n-2:0),s=2;s<n;s++)a[s-2]=arguments[s];return e.apply(t,a)});Ln||(Ln=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return new e(...n)});var Pe=K(Array.prototype.forEach);Array.prototype.indexOf;var ui=K(Array.prototype.lastIndexOf),Co=K(Array.prototype.pop),vt=K(Array.prototype.push),fi=K(Array.prototype.slice),hi=K(Array.prototype.splice),pt=Array.isArray,Tn=jo(Set),_n=K(Set.prototype.add),St=K(Set.prototype.has),Ke=K(String.prototype.toLowerCase),En=K(String.prototype.toString),Ro=K(String.prototype.match),At=K(String.prototype.replace),Mo=K(String.prototype.indexOf),mi=K(String.prototype.trim),gi=K(Number.prototype.toString),bi=K(Boolean.prototype.toString),No=typeof BigInt=="undefined"?null:K(BigInt.prototype.toString),Lo=typeof Symbol=="undefined"?null:K(Symbol.prototype.toString),xe=K(Object.prototype.hasOwnProperty),Ct=K(Object.prototype.toString),de=K(RegExp.prototype.test),$e=jo(TypeError);function K(i){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return Nn(i,e,n)}}function jo(i){return function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return Ln(i,t)}}function B(i,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Ke;if(Ao&&Ao(i,null),!pt(e))return i;let n=e.length;for(;n--;){let a=e[n];if(typeof a=="string"){let s=t(a);s!==a&&(pi(e)||(e[n]=s),a=s)}i[a]=!0}return i}function xi(i){for(let e=0;e<i.length;e++)xe(i,e)||(i[e]=null);return i}function we(i){let e=dt(null);for(let n of Uo(i)){var t=ci(n,2);let a=t[0],s=t[1];xe(i,a)&&(pt(s)?e[a]=xi(s):s&&typeof s=="object"&&s.constructor===Object?e[a]=we(s):e[a]=s)}return e}function ki(i){switch(typeof i){case"string":return i;case"number":return gi(i);case"boolean":return bi(i);case"bigint":return No?No(i):"0";case"symbol":return Lo?Lo(i):"Symbol()";case"undefined":return Ct(i);case"function":case"object":{if(i===null)return Ct(i);let e=i,t=ve(e,"toString");if(typeof t=="function"){let n=t(e);return typeof n=="string"?n:Ct(n)}return Ct(i)}default:return Ct(i)}}function ve(i,e){for(;i!==null;){let n=qo(i,e);if(n){if(n.get)return K(n.get);if(typeof n.value=="function")return K(n.value)}i=Bo(i)}function t(){return null}return t}function yi(i,e){for(;i!==null;){let t=qo(i,e);if(t)return t.get?K(t.get):null;i=Bo(i)}return null}function wi(i){try{return de(i,""),!0}catch(e){return!1}}var Oo=ae(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),vn=ae(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Sn=ae(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Ti=ae(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),An=ae(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),_i=ae(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Io=ae(["#text"]),zo=ae(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),Cn=ae(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Do=ae(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),qt=ae(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Ei=pe(/{{[\w\W]*|^[\w\W]*}}/g),vi=pe(/<%[\w\W]*|^[\w\W]*%>/g),Si=pe(/\${[\w\W]*/g),Ai=pe(/^data-[\-\w.\u00B7-\uFFFF]+$/),Ci=pe(/^aria-[\-\w]+$/),Po=pe(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ri=pe(/^(?:\w+script|data):/i),Mi=pe(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ni=pe(/^html$/i),Li=pe(/^[a-z][.\w]*(-[.\w]+)+$/i),Rn=pe(/<[/\w!]/g),$o=pe(/<[/\w]/g),Oi=pe(/<\/no(script|embed|frames)/i),Fo=pe(/\/>/i),re={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},Ii=ae(B({},["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"])),zi=function(){return typeof window=="undefined"?null:window},Di=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let n=null,a="data-tt-policy-suffix";t&&t.hasAttribute(a)&&(n=t.getAttribute(a));let s="dompurify"+(n?"#"+n:"");try{return e.createPolicy(s,{createHTML(r){return r},createScriptURL(r){return r}})}catch(r){return console.warn("TrustedTypes policy "+s+" could not be created."),null}},Ho=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},qe=function(e,t,n,a){return xe(e,t)&&pt(e[t])?B(a.base?we(a.base):{},e[t],a.transform):n},Mn=function(e,t,n){let a=xe(e,t)?e[t]:void 0;return a&&typeof a=="object"?we(a):n()};function Go(){let i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:zi(),e=h=>Go(h);if(e.version="3.4.17",e.removed=[],!i||!i.document||i.document.nodeType!==re.document||!i.Element)return e.isSupported=!1,e;let t=i.document,n=t,a=n.currentScript;i.DocumentFragment;let s=i.HTMLTemplateElement,r=i.Node,c=i.Element,d=i.NodeFilter;i.NamedNodeMap===void 0&&(i.NamedNodeMap||i.MozNamedAttrMap),i.HTMLFormElement;let g=i.DOMParser,b=i.trustedTypes,y=c.prototype,w=ve(y,"cloneNode"),_=ve(y,"remove"),q=ve(y,"removeAttributeNode"),N=ve(y,"nextSibling"),z=ve(y,"childNodes"),P=ve(y,"parentNode"),le=ve(y,"shadowRoot"),$=ve(y,"attributes"),W=r&&r.prototype?ve(r.prototype,"nodeType"):null,V=r&&r.prototype?ve(r.prototype,"nodeName"):null,fe=r&&r.prototype?ve(r.prototype,"ownerDocument"):null,F=function(o){return W?W(o):o.nodeType},G=function(o){return V?V(o):o.nodeName},Te=yi(y,"namespaceURI"),Fe=function(o){return Te?Te(o):o.namespaceURI};if(typeof s=="function"){let h=t.createElement("template");h.content&&h.content.ownerDocument&&(t=h.content.ownerDocument)}let te,ke="",et,We=!1,Oe=0,_e=function(){if(Oe>0)throw $e('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},Me=function(o){_e(),Oe++;try{return te.createHTML(o)}finally{Oe--}},Yt=function(o){_e(),Oe++;try{return te.createScriptURL(o)}finally{Oe--}},ft=function(){return We||(et=Di(b,a),We=!0),et},je=t,Ge=je.implementation,Ie=je.createNodeIterator,He=je.createDocumentFragment,Ee=je.getElementsByTagName,tt=n.importNode,U=Ho();e.isSupported=typeof Uo=="function"&&typeof P=="function"&&Ge&&Ge.createHTMLDocument!==void 0;let Zt=Ei,ht=vi,Rt=Si,Vt=Ai,mt=Ci,gt=Ri,p=Mi,m=Li,x=Po,k=null,S=B({},[...Oo,...vn,...Sn,...An,...Io]),E=null,A=B({},[...zo,...Cn,...Do,...qt]),M=Object.seal(dt(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),C=null,Y=null,I=Object.seal(dt(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),ie=!0,ce=!0,ue=!1,me=!0,X=!1,D=!0,R=!1,ee=!1,L=null,J=null,H=!1,oe=!1,Mt=!1,Nt=!1,Pn=!0,$n=!1,Fn="user-content-",Xt=!0,Qt=!1,Ye=null,nt={},Ze=null,Hn=B({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]),Un=null,Bn=B({},["audio","video","img","source","image","track"]),qn=null,Wn=B({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Lt="http://www.w3.org/1998/Math/MathML",Ot="http://www.w3.org/2000/svg",Ne="http://www.w3.org/1999/xhtml",ot=Ne,Jt=!1,Kt=null,nr=B({},[Lt,Ot,Ne],En),jn=ae(["mi","mo","mn","ms","mtext"]),en=B({},jn),Gn=ae(["annotation-xml"]),tn=B({},Gn),or=B({},["title","style","font","a","script"]),bt=null,rr=["application/xhtml+xml","text/html"],ir="text/html",ne=null,rt=null,sr=t.createElement("form"),Yn=function(o){return o instanceof RegExp||o instanceof Function},nn=function(){let o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(rt&&rt===o)return;(!o||typeof o!="object")&&(o={}),o=we(o),bt=rr.indexOf(o.PARSER_MEDIA_TYPE)===-1?ir:o.PARSER_MEDIA_TYPE,ne=bt==="application/xhtml+xml"?En:Ke,k=qe(o,"ALLOWED_TAGS",S,{transform:ne}),E=qe(o,"ALLOWED_ATTR",A,{transform:ne}),Kt=qe(o,"ALLOWED_NAMESPACES",nr,{transform:En}),qn=qe(o,"ADD_URI_SAFE_ATTR",Wn,{transform:ne,base:Wn}),Un=qe(o,"ADD_DATA_URI_TAGS",Bn,{transform:ne,base:Bn}),Ze=qe(o,"FORBID_CONTENTS",Hn,{transform:ne}),C=qe(o,"FORBID_TAGS",we({}),{transform:ne}),Y=qe(o,"FORBID_ATTR",we({}),{transform:ne}),nt=xe(o,"USE_PROFILES")?o.USE_PROFILES&&typeof o.USE_PROFILES=="object"?we(o.USE_PROFILES):o.USE_PROFILES:!1,ie=o.ALLOW_ARIA_ATTR!==!1,ce=o.ALLOW_DATA_ATTR!==!1,ue=o.ALLOW_UNKNOWN_PROTOCOLS||!1,me=o.ALLOW_SELF_CLOSE_IN_ATTR!==!1,X=o.SAFE_FOR_TEMPLATES||!1,D=o.SAFE_FOR_XML!==!1,R=o.WHOLE_DOCUMENT||!1,oe=o.RETURN_DOM||!1,Mt=o.RETURN_DOM_FRAGMENT||!1,Nt=o.RETURN_TRUSTED_TYPE||!1,H=o.FORCE_BODY||!1,Pn=o.SANITIZE_DOM!==!1,$n=o.SANITIZE_NAMED_PROPS||!1,Xt=o.KEEP_CONTENT!==!1,Qt=o.IN_PLACE||!1,x=wi(o.ALLOWED_URI_REGEXP)?o.ALLOWED_URI_REGEXP:Po,ot=typeof o.NAMESPACE=="string"?o.NAMESPACE:Ne,en=Mn(o,"MATHML_TEXT_INTEGRATION_POINTS",()=>B({},jn)),tn=Mn(o,"HTML_INTEGRATION_POINTS",()=>B({},Gn));let l=Mn(o,"CUSTOM_ELEMENT_HANDLING",()=>dt(null));if(M=dt(null),xe(l,"tagNameCheck")&&Yn(l.tagNameCheck)&&(M.tagNameCheck=l.tagNameCheck),xe(l,"attributeNameCheck")&&Yn(l.attributeNameCheck)&&(M.attributeNameCheck=l.attributeNameCheck),xe(l,"allowCustomizedBuiltInElements")&&typeof l.allowCustomizedBuiltInElements=="boolean"&&(M.allowCustomizedBuiltInElements=l.allowCustomizedBuiltInElements),pe(M),X&&(ce=!1),Mt&&(oe=!0),nt&&(k=B({},Io),E=dt(null),nt.html===!0&&(B(k,Oo),B(E,zo)),nt.svg===!0&&(B(k,vn),B(E,Cn),B(E,qt)),nt.svgFilters===!0&&(B(k,Sn),B(E,Cn),B(E,qt)),nt.mathMl===!0&&(B(k,An),B(E,Do),B(E,qt))),I.tagCheck=null,I.attributeCheck=null,xe(o,"ADD_TAGS")&&(typeof o.ADD_TAGS=="function"?I.tagCheck=o.ADD_TAGS:pt(o.ADD_TAGS)&&(k===S&&(k=we(k)),B(k,o.ADD_TAGS,ne))),xe(o,"ADD_ATTR")&&(typeof o.ADD_ATTR=="function"?I.attributeCheck=o.ADD_ATTR:pt(o.ADD_ATTR)&&(E===A&&(E=we(E)),B(E,o.ADD_ATTR,ne))),xe(o,"ADD_FORBID_CONTENTS")&&pt(o.ADD_FORBID_CONTENTS)&&(Ze===Hn&&(Ze=we(Ze)),B(Ze,o.ADD_FORBID_CONTENTS,ne)),Xt&&(k["#text"]=!0),R&&B(k,["html","head","body"]),k.table&&(B(k,["tbody"]),delete C.tbody),o.TRUSTED_TYPES_POLICY){if(typeof o.TRUSTED_TYPES_POLICY.createHTML!="function")throw $e('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof o.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw $e('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');let u=te;te=o.TRUSTED_TYPES_POLICY;try{ke=Me("")}catch(f){throw te=u,f}}else o.TRUSTED_TYPES_POLICY===null?(te=void 0,ke=""):(te===void 0&&(te=ft()),te&&typeof ke=="string"&&(ke=Me("")));ae&&ae(o),rt=o},Zn=B({},[...vn,...Sn,...Ti]),Vn=B({},[...An,..._i]),ar=function(o,l,u){return l.namespaceURI===Ne?o==="svg":l.namespaceURI===Lt?o==="svg"&&(u==="annotation-xml"||en[u]):!!Zn[o]},lr=function(o,l,u){return l.namespaceURI===Ne?o==="math":l.namespaceURI===Ot?o==="math"&&tn[u]:!!Vn[o]},cr=function(o,l,u){return l.namespaceURI===Ot&&!tn[u]||l.namespaceURI===Lt&&!en[u]?!1:!Vn[o]&&(or[o]||!Zn[o])},dr=function(o){let l=Fe(o),u=Ke(G(o)),f=P(o),T,v;return f&&F(f)===re.element?(T={namespaceURI:Fe(f)},v=Ke(G(f))):(T={namespaceURI:ot},v="template"),Kt[l]?l===Ot?ar(u,T,v):l===Lt?lr(u,T,v):l===Ne?cr(u,T,v):!!(bt==="application/xhtml+xml"&&Kt[l]):!1},Ue=function(o){vt(e.removed,{element:o});try{P(o).removeChild(o)}catch(l){if(_(o),!P(o))throw $e("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},Xn=function(o,l,u){try{q(o,l)}catch(f){try{o.removeAttribute(u)}catch(T){}}},on=function(o){sn(o);let l=z(o);l&&Pe(fi(l),f=>{try{_(f)}catch(T){}});let u=F(o)===re.element?$(o):null;if(u)for(let f=u.length-1;f>=0;--f){let T=u[f],v=T&&T.name;typeof v=="string"&&Xn(o,T,v)}},it=function(o,l,u){if(!u)try{u=l.getAttributeNode(o)}catch(f){u=null}vt(e.removed,{attribute:u||null,from:l});try{u?q(l,u):l.removeAttribute(o)}catch(f){try{l.removeAttribute(o)}catch(T){}}if(o==="is")if(oe||Mt)try{Ue(l)}catch(f){}else try{l.setAttribute(o,"")}catch(f){}},Qn=function(o){let l=$(o);if(l)for(let u=l.length-1;u>=0;--u){let f=l[u],T=f&&f.name;typeof T!="string"||E[ne(T)]||Xn(o,f,T)}},rn=function(o,l){let u=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,f=[o];for(;f.length>0;){let T=f.pop();if(l(T)===!1)continue;if(u&&F(T)===re.element){let O=le(T);Be(O)&&f.push(O)}let v=z(T);if(v)for(let O=v.length-1;O>=0;--O)f.push(v[O])}},sn=function(o){rn(o,l=>{F(l)===re.element&&Qn(l)})},an=function(o){let l=[];return rn(o,u=>{l.push(u)},!0),l},pr=function(o,l){let u=Tn();Pe(an(o),f=>{F(f)===re.element&&_n(u,f)}),Pe(l,f=>{F(f)===re.element&&!St(u,f)&&Qn(f)})},Jn=function(o,l){let u=!1;return Pe(e.removed,f=>{f.element&&(u=u||f.element===o,sn(f.element))}),pr(o,l),u},ur=8,fr=function(o,l){let u=Ye,f=null,T=()=>(f||(f=Tn(),Pe(l,v=>{_n(f,v)})),f);for(let v=0;;v++){let O=an(o),se=[o],Le=!1;if(Pe(O,he=>{F(he)===re.documentFragment?vt(se,he):!Le&&!St(u,he)&&(Le=St(T(),he))}),!Le)return;if(v>=ur)throw $e("the tree kept changing during in-place sanitization; refusing to return it");Pe(se,(he,ge)=>{hr(he,ge>0,o,T())})}},hr=function(o,l,u,f){let T=ln(o),v;for(;v=T.nextNode();)!St(f,v)||St(Ye,v)||(l&&Ce(U.uponSanitizeShadowNode,v,null),dn(v,u),pn(v,u),Be(v.content)&&kt(v.content))},mr=function(o){Ye&&_n(Ye,o)},Kn=function(o,l){return D?o==="patchsrc"?!0:o==="for"&&l!=="label"&&l!=="output":!1},gr=function(o){D&&rn(o,l=>{let u=F(l);if(u===re.processingInstruction||u===re.comment&&de($o,l.data)){try{_(l)}catch(f){}return!1}if(u===re.element){let f=l,T=ne(G(l));try{f.hasAttribute&&f.hasAttribute("patchsrc")&&f.removeAttribute("patchsrc"),f.hasAttribute&&f.hasAttribute("for")&&Kn("for",T)&&f.removeAttribute("for")}catch(v){}}return!0})},eo=function(o){let l=null,u=null;if(H)o="<remove></remove>"+o;else{let v=Ro(o,/^[\r\n\t ]+/);u=v&&v[0]}bt==="application/xhtml+xml"&&ot===Ne&&(o='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+o+"</body></html>");let f=te?Me(o):o;if(ot===Ne)try{l=new g().parseFromString(f,bt)}catch(v){}if(!l||!l.documentElement){l=Ge.createDocument(ot,"template",null);try{l.documentElement.innerHTML=Jt?ke:f}catch(v){}}let T=l.body||l.documentElement;return o&&u&&T.insertBefore(t.createTextNode(u),T.childNodes[0]||null),ot===Ne?Ee.call(l,R?"html":"body")[0]:R?l.documentElement:T},ln=function(o){let l=fe?fe(o):o.ownerDocument;return Ie.call(l||o,o,d.SHOW_ELEMENT|d.SHOW_COMMENT|d.SHOW_TEXT|d.SHOW_PROCESSING_INSTRUCTION|d.SHOW_CDATA_SECTION,null)},It=function(o){return o=At(o,Zt," "),o=At(o,ht," "),o=At(o,Rt," "),o},cn=function(o){var l;to(o);let u=(l=o.querySelectorAll)===null||l===void 0?void 0:l.call(o,"template");u&&Pe(u,f=>{Be(f.content)&&cn(f.content)})},to=function(o){o.normalize();let l=fe?fe(o):o.ownerDocument,u=Ie.call(l||o,o,d.SHOW_TEXT|d.SHOW_COMMENT|d.SHOW_CDATA_SECTION|d.SHOW_PROCESSING_INSTRUCTION,null),f=u.nextNode();for(;f;)f.data=It(f.data),f=u.nextNode()},zt=function(o){let l=V?V(o):null;return typeof l!="string"||ne(l)!=="form"?!1:typeof o.nodeName!="string"||typeof o.textContent!="string"||typeof o.removeChild!="function"||o.attributes!==$(o)||typeof o.removeAttribute!="function"||typeof o.removeAttributeNode!="function"||typeof o.getAttributeNode!="function"||typeof o.setAttribute!="function"||typeof o.namespaceURI!="string"||typeof o.insertBefore!="function"||typeof o.hasChildNodes!="function"||o.nodeType!==W(o)||o.childNodes!==z(o)},Be=function(o){if(!W||typeof o!="object"||o===null)return!1;try{return W(o)===re.documentFragment}catch(l){return!1}},xt=function(o){if(!W||typeof o!="object"||o===null)return!1;try{return typeof W(o)=="number"}catch(l){return!1}};function Ce(h,o,l){h.length!==0&&Pe(h,u=>{u.call(e,o,l,rt)})}let br=function(o,l){return!!(D&&o.hasChildNodes()&&!xt(o.firstElementChild)&&de(Rn,o.textContent)&&de(Rn,o.innerHTML)||D&&Ii[l]&&F(o)===re.element&&Fe(o)===Ne&&(xt(o.firstElementChild)||typeof o.textContent=="string"&&de(Rn,o.textContent))||o.nodeType===re.processingInstruction||D&&o.nodeType===re.comment&&de($o,o.data))},Dt=function(o,l){if(o instanceof RegExp)return de(o,l);if(o instanceof Function){for(var u=arguments.length,f=new Array(u>2?u-2:0),T=2;T<u;T++)f[T-2]=arguments[T];return!!o(l,...f)}return!1},xr=function(o,l,u){if(!C[l]&&ro(l)&&Dt(M.tagNameCheck,l))return!1;if(Xt&&!Ze[l]&&!Ze[Ke(l)]){let f=P(o),T=z(o);if(T&&f){let v=T.length;for(let O=v-1;O>=0;--O){let se=o===u?w(T[O],!0):T[O];f.insertBefore(se,N(o))}}}return Ue(o),!0},no=function(o,l,u,f){return o.length===0?l:l===u||l===f?we(l):l},st=function(o,l){return o===l||P(o)!==null?!1:(Qt&&sn(o),!0)},dn=function(o,l){if(mr(o),Ce(U.beforeSanitizeElements,o,null),st(o,l))return!0;if(zt(o))return Ue(o),!0;let u=ne(G(o));if(k=no(U.uponSanitizeElement,k,S,L),Ce(U.uponSanitizeElement,o,{tagName:u,allowedTags:k}),st(o,l))return!0;if(br(o,u))return Ue(o),!0;if(C[u]||!(I.tagCheck instanceof Function&&I.tagCheck(u))&&!k[u]){let f=xr(o,u,l);return f===!1&&(Ce(U.afterSanitizeElements,o,null),st(o,l))?!0:f}if(F(o)===re.element&&!dr(o)||(u==="noscript"||u==="noembed"||u==="noframes")&&de(Oi,o.innerHTML))return Ue(o),!0;if(X&&o.nodeType===re.text){let f=It(o.textContent);o.textContent!==f&&(vt(e.removed,{element:o.cloneNode()}),o.textContent=f)}return Ce(U.afterSanitizeElements,o,null),st(o,l)},oo=function(o,l,u){if(Y[l]||Kn(l,o)||Pn&&(l==="id"||l==="name")&&(u in t||u in sr))return!1;let f=E[l]||I.attributeCheck instanceof Function&&I.attributeCheck(l,o);return ce&&de(Vt,l)||ie&&de(mt,l)?!0:f?qn[l]||de(x,At(u,p,""))||(l==="src"||l==="xlink:href"||l==="href")&&o!=="script"&&Mo(u,"data:")===0&&Un[o]||ue&&!de(gt,At(u,p,""))?!0:!u:ro(o)&&Dt(M.tagNameCheck,o)&&Dt(M.attributeNameCheck,l,o)||l==="is"&&M.allowCustomizedBuiltInElements&&Dt(M.tagNameCheck,u)},kr=B({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),ro=function(o){return!kr[Ke(o)]&&de(m,o)},yr=function(o,l,u,f){if(te&&typeof b=="object"&&typeof b.getAttributeType=="function"&&!u)switch(b.getAttributeType(o,l)){case"TrustedHTML":return Me(f);case"TrustedScriptURL":return Yt(f)}return f},wr=function(o,l,u,f){try{return u?o.setAttributeNS(u,l,f):o.setAttribute(l,f),zt(o)?(Ue(o),!1):!0}catch(T){return it(l,o),!1}},io=function(o,l){return D&&de(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,l)?!0:Ke(o)==="attributename"&&Ro(l,"href")!==null},pn=function(o,l){if(Ce(U.beforeSanitizeAttributes,o,null),st(o,l))return;let u=o.attributes;if(!u||zt(o))return;E=no(U.uponSanitizeAttribute,E,A,J);let f={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:E,forceKeepAttr:void 0},T=u.length,v=ne(o.nodeName);for(;T--;){let O=u[T],se=O.name,Le=O.namespaceURI,he=O.value,ge=ne(se),at=he,be=se==="value"?at:mi(at),so=!1;if(f.attrName=ge,f.attrValue=be,f.keepAttr=!0,f.forceKeepAttr=void 0,Ce(U.uponSanitizeAttribute,o,f),be=f.attrValue,$n&&(ge==="id"||ge==="name")&&Mo(be,Fn)!==0&&(it(se,o,O),be=Fn+be,so=!0),io(se,be)){it(se,o,O);continue}if(!f.forceKeepAttr){if(!f.keepAttr){it(se,o,O);continue}if(!me&&de(Fo,be)){it(se,o,O);continue}if(X&&(be=It(be)),!oo(v,ge,be)){it(se,o,O);continue}be=yr(v,ge,Le,be),be!==at&&wr(o,se,Le,be)&&so&&Co(e.removed)}}Ce(U.afterSanitizeAttributes,o,null),st(o,l)},kt=function(o){let l=null,u=ln(o);for(Ce(U.beforeSanitizeShadowDOM,o,null);l=u.nextNode();)if(Ce(U.uponSanitizeShadowNode,l,null),dn(l,o),pn(l,o),Be(l.content)&&kt(l.content),F(l)===re.element){let f=le(l);Be(f)&&(un(f),kt(f))}X&&to(o),Ce(U.afterSanitizeShadowDOM,o,null)},un=function(o){let l=[{node:o,shadow:null}];for(;l.length>0;){let u=l.pop();if(u.shadow){kt(u.shadow);continue}let f=u.node,T=F(f)===re.element,v=z(f);if(v)for(let O=v.length-1;O>=0;--O)l.push({node:v[O],shadow:null});if(T){let O=V?V(f):null;if(typeof O=="string"&&ne(O)==="template"){let se=f.content;Be(se)&&l.push({node:se,shadow:null})}}if(T){let O=le(f);Be(O)&&l.push({node:null,shadow:O},{node:O,shadow:null})}}};return e.sanitize=function(h){let o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},l=null,u=null,f=null,T=null;if(Jt=!h,Jt&&(h="<!-->"),typeof h!="string"&&!xt(h)&&(h=ki(h),typeof h!="string"))throw $e("dirty is not a string, aborting");if(!e.isSupported)return h;ee?(k=L,E=J):nn(o),(U.uponSanitizeElement.length>0||U.uponSanitizeAttribute.length>0)&&(k=we(k)),U.uponSanitizeAttribute.length>0&&(E=we(E)),e.removed=[];let v=Qt&&typeof h!="string"&&xt(h),O=[],se=Ye;if(v){gr(h);let ge=G(h);if(typeof ge=="string"){let at=ne(ge);if(!k[at]||C[at])throw on(h),$e("root node is forbidden and cannot be sanitized in-place")}if(zt(h))throw on(h),$e("root node is clobbered and cannot be sanitized in-place");O=an(h),Ye=Tn()}else if(xt(h))l=eo("<!---->"),u=l.ownerDocument.importNode(h,!0),u.nodeType===re.element&&u.nodeName==="BODY"||u.nodeName==="HTML"?l=u:l.appendChild(u),un(l);else{if(!oe&&!X&&!R&&h.indexOf("<")===-1)return te&&Nt?Me(h):h;if(l=eo(h),!l)return oe?null:Nt?ke:""}l&&H&&Ue(l.firstChild);let Le=v?h:l;try{v&&un(h);let ge=ln(Le);for(;f=ge.nextNode();)dn(f,Le),pn(f,Le),Be(f.content)&&kt(f.content);v&&fr(h,O)}catch(ge){throw v&&(on(h),Jn(h,O)),ge}finally{Ye=se}if(v){if(Jn(h,O))throw $e("a node selected for removal could not be safely returned; refusing to sanitize in place");return X&&cn(h),h}if(oe){if(X&&cn(l),Mt)for(T=He.call(l.ownerDocument);l.firstChild;)T.appendChild(l.firstChild);else T=l;return(E.shadowroot||E.shadowrootmode)&&(T=tt.call(n,T,!0)),T}let he=R?l.outerHTML:l.innerHTML;return R&&k["!doctype"]&&l.ownerDocument&&l.ownerDocument.doctype&&l.ownerDocument.doctype.name&&de(Ni,l.ownerDocument.doctype.name)&&(he="<!DOCTYPE "+l.ownerDocument.doctype.name+`>
`+he),X&&(he=It(he)),te&&Nt?Me(he):he},e.setConfig=function(){let h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};nn(h),ee=!0,L=k,J=E},e.clearConfig=function(){rt=null,ee=!1,L=null,J=null,te=et,ke=""},e.isValidAttribute=function(h,o,l){rt||nn({});let u=ne(h),f=ne(o);return typeof l=="string"&&(io(o,l)||!me&&de(Fo,l))?!1:oo(u,f,l)},e.addHook=function(h,o){typeof o=="function"&&xe(U,h)&&vt(U[h],o)},e.removeHook=function(h,o){if(xe(U,h)){if(o!==void 0){let l=ui(U[h],o);return l===-1?void 0:hi(U[h],l,1)[0]}return Co(U[h])}},e.removeHooks=function(h){xe(U,h)&&(U[h]=[])},e.removeAllHooks=function(){U=Ho()},e}var Yo=Go();function On(i,e){"use strict";e=e||{};let t=(e.base!==void 0?e.base:location.pathname.replace(/[^/]*$/,"")).replace(/\/$/,""),n=e.color||e.primaryColor;n&&(i.style.setProperty("--c-brand",n),i.style.setProperty("--primary",n),i.style.setProperty("--c-brand-strong",n),i.style.setProperty("--primary-hover",n));let a=document.createElement("div");a.className="widget-header";let s=document.createElement("h1");s.textContent=e.title||"AI \u6570\u636E\u52A9\u624B";let r=document.createElement("span");r.className="status",r.id="chat-status";let c=document.createElement("div");c.className="header-actions";let d=!1,g=document.createElement("button");g.type="button",g.className="header-action-btn",g.title="\u6700\u5927\u5316 / \u8FD8\u539F",g.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';function b(p){d=p,d?(g.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></svg>',g.title="\u8FD8\u539F\u7A97\u53E3"):(g.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',g.title="\u6700\u5927\u5316\u7A97\u53E3")}g.addEventListener("click",()=>{b(!d),window.parent.postMessage({type:"dq-toggle-maximize",maximized:d},"*")}),a.addEventListener("dblclick",p=>{p.target.closest("button")||g.click()});let y=document.createElement("button");y.type="button",y.className="header-action-btn",y.title="\u5173\u95ED",y.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',y.addEventListener("click",()=>{window.parent.postMessage({type:"dq-close"},"*")});let w=document.createElement("button");w.type="button",w.className="new-chat-btn",w.title="\u65B0\u5EFA\u5BF9\u8BDD\uFF08\u6E05\u7A7A\u5F53\u524D\u4E0A\u4E0B\u6587\uFF09";let _=document.createElement("span");_.className="new-chat-icon",_.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';let q=document.createElement("span");q.textContent="\u65B0\u5BF9\u8BDD",w.append(_,q),w.addEventListener("click",()=>{ht(),Ee.length=0,N.replaceChildren(),N.appendChild(z),F.value="",r.textContent="",F.focus()}),c.append(w),e.inline||c.append(g,y),a.append(s,r,c);let N=document.createElement("div");N.className="chat-messages";let z=document.createElement("div");z.className="welcome";let P=document.createElement("p");P.className="welcome-title",P.textContent="\u4F60\u597D\uFF0C\u6211\u662F "+(e.title||"AI \u6570\u636E\u52A9\u624B");let le=document.createElement("p");le.textContent="\u57FA\u4E8E\u5143\u6570\u636E\u5411\u6211\u63D0\u95EE\u5373\u53EF\u67E5\u6570\u4E0E\u51FA\u56FE";let $=document.createElement("div");$.className="examples";let W=["\u7EDF\u8BA1\u5404\u72B6\u6001\u6570\u91CF\u5206\u5E03","\u67E5\u8BE2\u6700\u8FD1\u65B0\u589E\u768410\u6761\u6570\u636E","\u6309\u7C7B\u522B\u6C47\u603B\u5360\u6BD4\uFF0C\u7ED9\u4E2A\u997C\u56FE"];(Array.isArray(e.examples)&&e.examples.length?e.examples:typeof e.examples=="string"&&e.examples?e.examples.split(",").map(p=>p.trim()):W).forEach(p=>{let m=document.createElement("button");m.type="button",m.className="example-btn";let x=document.createElement("span");x.className="example-bullet";let k=document.createElement("span");k.textContent=p,m.append(x,k),$.appendChild(m)}),z.append(P,le,$),N.appendChild(z);let fe=document.createElement("div");fe.className="input-row";let F=document.createElement("textarea");F.rows=1,F.placeholder="\u63D0\u95EE\uFF0CEnter \u53D1\u9001";let G=document.createElement("button");G.type="button",G.className="send-btn",G.textContent="\u53D1\u9001",fe.append(F,G),i.append(a,N,fe),window.marked&&window.marked.setOptions({breaks:!0});function Te(p){if(!window.marked)return null;try{let m=window.marked.parse(p||"");return window.DOMPurify?window.DOMPurify.sanitize(m):m}catch(m){return null}}function Fe(p,m){let x=[],k=/```(?:render|json)\s*\n([\s\S]*?)```/g,S=0,E;for(;(E=k.exec(p))!==null;){let C=p.slice(S,E.index);C.trim()&&x.push({kind:"md",text:C});let Y=E[1].trim();if(Y.startsWith("{")&&Y.includes('"type"'))try{x.push({kind:"render",data:JSON.parse(Y)})}catch(I){x.push({kind:"md",text:E[0]})}else x.push({kind:"md",text:E[0]});S=k.lastIndex}let A=p.slice(S),M=A.match(/```(?:render|json)\s*\n([\s\S]*)$/);if(M){let C=A.slice(0,M.index);C.trim()&&x.push({kind:"md",text:C}),m?x.push({kind:"loading"}):x.push({kind:"md",text:A.slice(M.index)})}else A.trim()&&x.push({kind:"md",text:A});return x}function te(p){p&&p._slots&&p._slots.placeholder&&(p._slots.placeholder.remove(),p._slots.placeholder=null)}function ke(p,m){let x=document.createElement("div");if(x.className="msg "+p,p==="assistant"){let k=document.createElement("div");k.className="thinking-init-placeholder",k.innerHTML='<span class="think-spinner"></span><span class="thinking-label">\u6B63\u5728\u601D\u8003\u2026</span>';let S=document.createElement("div");S.className="ai-slot-think";let E=document.createElement("div");E.className="ai-slot-tools";let A=document.createElement("div");A.className="ai-slot-content",x.append(k,S,E,A),x._slots={placeholder:k,thinkSlot:S,toolsSlot:E,contentSlot:A},x._state={thinking:{text:"",startedAt:0,done:!1,durationMs:0,open:!0,userTouched:!1},tools:{calls:[],openStates:{}},content:{text:""}},m&&(te(x),x._state.content.text=m,Me(x,!1))}else x.textContent=m||"";return N.appendChild(x),N.scrollTop=N.scrollHeight,x}function et(p){if(p==null||p==="")return"(\u7A7A)";if(typeof p=="string")try{let m=JSON.parse(p);return JSON.stringify(m,null,2)}catch(m){return p}try{return JSON.stringify(p,null,2)}catch(m){return String(p)}}function We(p){if(!p._slots||!p._state)return;let{thinkSlot:m}=p._slots,x=p._state.thinking;if(!x.text){m.innerHTML="";return}let k=m.querySelector(".think");k||(k=document.createElement("div"),m.appendChild(k)),k.className="think"+(x.done?" is-done":" is-streaming")+(x.open?" is-open":"");let S=Math.max(0,Math.round((x.durationMs||0)/100)/10).toFixed(1).replace(/\.0$/,""),E=x.done?x.durationMs>0&&S!=="0"?`\u5DF2\u6DF1\u5EA6\u601D\u8003 \xB7 ${S}\u79D2`:"\u5DF2\u6DF1\u5EA6\u601D\u8003":x.durationMs>=800?`\u6DF1\u5EA6\u601D\u8003\u4E2D \xB7 ${S}\u79D2`:"\u6DF1\u5EA6\u601D\u8003\u4E2D\u2026",A=k.querySelector(".think-head");A||(A=document.createElement("button"),A.type="button",A.className="think-head",A.innerHTML=`
        <svg class="think-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span class="think-spinner"></span>
        <span class="think-label"></span>
      `,A.addEventListener("click",()=>{x.userTouched=!0,x.open=!x.open,We(p)}),k.appendChild(A));let M=A.querySelector(".think-chevron");M&&(x.open?M.classList.add("rotated"):M.classList.remove("rotated"));let C=A.querySelector(".think-spinner");C&&(C.style.display=x.done?"none":"inline-block");let Y=A.querySelector(".think-label");Y&&(Y.textContent=E);let I=k.querySelector(".think-body-wrapper");if(!I){I=document.createElement("div"),I.className="think-body-wrapper";let ce=document.createElement("div");ce.className="think-inner";let ue=document.createElement("div");ue.className="think-body",ce.appendChild(ue),I.appendChild(ce),k.appendChild(I)}I.className="think-body-wrapper"+(x.open?" is-open":"");let ie=I.querySelector(".think-body");ie.textContent=x.text,!x.done&&x.open&&(ie.scrollTop=ie.scrollHeight)}function Oe(p,m,x,k){let S=document.createElement("div"),E=!!x.openStates[m];S.className=`tool-call-card is-${p.status} ${E?"is-open":""}`;let A=document.createElement("div");A.className="tool-call-summary";let M=document.createElement("span");M.className=`tool-call-arrow ${E?"rotated":""}`,M.textContent="\u203A";let C=document.createElement("span");C.className="tool-call-icon",p.status==="running"?(C.className+=" is-spinning",C.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'):p.status==="ok"?C.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':p.status==="fail"?C.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>':C.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';let Y=document.createElement("span");Y.className="tool-call-main";let I=document.createElement("span");I.className="tool-call-name",I.textContent=p.name||"\u5DE5\u5177\u8C03\u7528";let ie=document.createElement("span");if(ie.className="tool-call-status-wrapper",p.durationMs!=null&&p.durationMs>0){let D=document.createElement("span");D.className="tool-call-duration",D.textContent=p.durationMs<1e3?`${Math.round(p.durationMs)}ms`:`${(p.durationMs/1e3).toFixed(1)}s`,ie.appendChild(D)}let ce=document.createElement("span");ce.className="tool-call-status",ce.textContent=p.status==="running"?"\u8FD0\u884C\u4E2D\u2026":p.status==="ok"?"\u5B8C\u6210":"\u8C03\u7528\u5931\u8D25",ie.appendChild(ce),Y.append(I,ie),A.append(M,C,Y),A.addEventListener("click",D=>{D.stopPropagation(),x.openStates[m]=!E,x._structureDirty=!0,_e(k)});let ue=document.createElement("div");ue.className=`tool-call-body-wrapper ${E?"is-open":""}`;let me=document.createElement("div");me.className="tool-call-body";let X=document.createElement("div");if(X.className="tool-call-inner",p.args!=null&&p.args!==""){let D=document.createElement("div");D.className="tool-call-field",D.innerHTML='<span class="tool-call-label">\u53C2\u6570</span>';let R=document.createElement("pre");R.textContent=et(p.args),D.appendChild(R),X.appendChild(D)}if(p.result!=null&&p.result!==""){let D=document.createElement("div");D.className="tool-call-field",D.innerHTML=`<span class="tool-call-label">${p.status==="fail"?"\u9519\u8BEF":"\u8FD4\u56DE"}</span>`;let R=document.createElement("pre");R.textContent=et(p.result),D.appendChild(R),X.appendChild(D)}return me.appendChild(X),ue.appendChild(me),S.append(A,ue),S}function _e(p){if(!p._slots||!p._state)return;let{toolsSlot:m}=p._slots,x=p._state.tools;if(!x.calls||x.calls.length===0){m.innerHTML="";return}let k=m.querySelector(".tool-call-list");k||(k=document.createElement("div"),k.className="tool-call-list",m.appendChild(k));let S=x.calls.length,E=k.querySelectorAll(".tool-call-card");if(E.length===S&&!x._structureDirty){x.calls.forEach((R,ee)=>{let L=E[ee];if(!L)return;let J=L.querySelector(".tool-call-duration");J&&R.durationMs>0&&(J.textContent=R.durationMs<1e3?`${Math.round(R.durationMs)}ms`:`${(R.durationMs/1e3).toFixed(1)}s`);let H=L.querySelector(".tool-call-status");H&&(H.textContent=R.status==="running"?"\u8FD0\u884C\u4E2D\u2026":R.status==="ok"?"\u5B8C\u6210":"\u8C03\u7528\u5931\u8D25")});return}if(x._structureDirty=!1,k.innerHTML="",S<=1){k.appendChild(Oe(x.calls[0],0,x,p));return}let A=x.calls.slice(0,S-1),M=x.calls[S-1],C=document.createElement("div");C.className="tool-history-group";let Y=!!x.historyOpen,I=document.createElement("button");I.type="button",I.className="tool-history-head",I.addEventListener("click",()=>{x.historyOpen=!Y,x._structureDirty=!0,_e(p)});let ie=document.createElement("span");ie.className=`tool-history-arrow ${Y?"rotated":""}`,ie.textContent="\u203A";let ce=document.createElement("span");ce.className="tool-history-label";let ue=document.createElement("span");ue.className="tool-history-tag",ue.textContent=A.length;let me=document.createElement("span");me.textContent="\u4E2A\u5DF2\u5B8C\u6210\u524D\u5E8F\u5DE5\u5177\u8C03\u7528",ce.append(ie,ue,me),I.appendChild(ce),C.appendChild(I);let X=document.createElement("div");X.className=`tool-history-body ${Y?"is-open":""}`;let D=document.createElement("div");D.className="tool-history-inner",A.forEach((R,ee)=>{D.appendChild(Oe(R,ee,x,p))}),X.appendChild(D),C.appendChild(X),k.appendChild(C),k.appendChild(Oe(M,S-1,x,p))}function Me(p,m){if(!p._slots||!p._state)return;let{contentSlot:x}=p._slots,k=p._state.content.text||"";if(!k.trim()){x.innerHTML="";return}let S=x.querySelector(".assistant-flow-content");S||(S=document.createElement("div"),S.className="assistant-flow-content",x.appendChild(S));let E=Fe(k,m),A=JSON.stringify(E.map(M=>M.kind+(M.text?M.text.length:"")+(M.data?JSON.stringify(M.data):"")));S.dataset.renderKey!==A&&(S.dataset.renderKey=A,S.innerHTML="",E.forEach(M=>{if(M.kind==="md"){let C=document.createElement("div");C.className="markdown-body mixed-chunk--md";let Y=Te(M.text);Y!=null?C.innerHTML=Y:C.textContent=M.text,S.appendChild(C)}else if(M.kind==="render")try{let C=window.renderRenderJSON?window.renderRenderJSON(M.data):null;C&&(C.classList.add("mixed-chunk--render"),S.appendChild(C))}catch(C){}else if(M.kind==="loading"){let C=document.createElement("div");C.className="render-loading-tip mixed-chunk--loading",C.innerHTML='<span class="css-spinner"></span><span>\u6B63\u5728\u751F\u6210\u56FE\u8868\u6570\u636E\u2026</span>',S.appendChild(C)}}),N.scrollTop=N.scrollHeight)}function Yt(p,m){if(!m||!p._state)return;te(p);let x=p._state.thinking;x.startedAt||(x.startedAt=Date.now()),x.text+=m,We(p)}function ft(p){if(!p._state)return;let m=p._state.thinking;m.text&&!m.done&&(m.done=!0,m.durationMs=Math.max(0,Date.now()-(m.startedAt||Date.now())),U&&(clearInterval(U),U=null),m.userTouched||(m.open=!1),We(p))}function je(p){return te(p),p._state?p._state.tools:{calls:[],openStates:{}}}function Ge(p,m){!m||!p._state||(te(p),ft(p),p._state.content.text+=m,Me(p,!0))}let Ie=!1,He=null,Ee=[],tt=20,U=null,Zt=0;function ht(){He&&(He.abort(),He=null)}function Rt(p){Ie=p,p?(G.textContent="\u505C\u6B62",G.className="send-btn stop-btn",G.disabled=!1,G.title="\u505C\u6B62\u56DE\u7B54 (Esc)",i.querySelectorAll(".example-btn").forEach(m=>{m.disabled=!0,m.classList.add("disabled")})):(U&&(clearInterval(U),U=null),He=null,G.textContent="\u53D1\u9001",G.className="send-btn",G.disabled=!1,G.title="\u53D1\u9001 (Enter)",i.querySelectorAll(".example-btn").forEach(m=>{m.disabled=!1,m.classList.remove("disabled")}))}function Vt(p){if(p.querySelector(".thinking"))return;let m=document.createElement("div");m.className="thinking";let x=document.createElement("span");x.className="thinking-dots";for(let S=0;S<3;S++)x.appendChild(document.createElement("span"));let k=document.createElement("span");k.textContent="\u601D\u8003\u4E2D\u2026",m.append(x,k),p.appendChild(m)}function mt(p){let m=p.querySelector(".thinking");m&&m.remove()}async function gt(p){if(Ie||(p=(p||F.value).trim(),!p))return;F.value="",z&&z.parentNode&&z.remove(),ke("user",p),Ee.push({role:"user",content:p}),Ee.length>tt&&Ee.splice(0,Ee.length-tt);let m=ke("assistant","");Vt(m);let x="";Rt(!0),r.textContent="\u601D\u8003\u4E2D\u2026",He=new AbortController,Zt=Date.now(),U=setInterval(()=>{if(m&&m._state){let k=m._state.thinking;k&&!k.done&&k.startedAt&&(k.durationMs=Date.now()-k.startedAt,k.text&&We(m));let S=m._state.tools;if(S&&S.calls&&S.calls.length>0){let E=!1;S.calls.forEach(A=>{A.status==="running"&&A.startedAt&&(A.durationMs=Date.now()-A.startedAt,E=!0)}),E&&_e(m)}}},150);try{let k=await fetch(t+"/assistant/chat",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:p,messages:Ee.slice()}),signal:He.signal});if(!k.ok){let Y="HTTP "+k.status;try{let I=await k.json();I&&I.error&&(Y=I.error)}catch(I){}throw new Error(Y)}let S=k.body.getReader(),E=new TextDecoder,A="",M=!1;for(;;){let{done:Y,value:I}=await S.read();if(Y)break;A+=E.decode(I,{stream:!0});let ie;for(;(ie=A.indexOf(`

`))>=0;){let ce=A.slice(0,ie);A=A.slice(ie+2);for(let ue of ce.split(`
`)){if(!ue.startsWith("data:"))continue;let me=ue.slice(5).trim();if(!(!me||me==="[DONE]"))try{let X=JSON.parse(me);if(M||(M=!0,mt(m)),X.object==="agent.event"){let R=X.x_agent||{},ee=R.extra||{},L=je(m),J=ee.call_id||R.name;if(L._hasAgentEvents=!0,R.type==="tool_start")r.textContent="\u67E5\u8BE2\u6570\u636E\u4E2D\u2026",L._structureDirty=!0,L.calls.push({call_id:J,name:R.name,args:ee.arguments,result:"",status:"running",startedAt:Date.now(),durationMs:0}),_e(m);else if(R.type==="tool_end"){L._structureDirty=!0;let H=[...L.calls].reverse().find(oe=>oe.call_id===J&&oe.status==="running")||L.calls.find(oe=>oe.call_id===J)||L.calls[L.calls.length-1];H&&(H.status=R.status==="success"?"ok":"fail",H.result=ee.result_preview||R.message||"",H.startedAt&&(H.durationMs=Math.max(1,Date.now()-H.startedAt))),_e(m)}else if(R.type==="tool_error"){L._structureDirty=!0;let H=[...L.calls].reverse().find(oe=>oe.call_id===J&&oe.status==="running")||L.calls.find(oe=>oe.call_id===J)||L.calls[L.calls.length-1];H&&(H.status="fail",H.result=R.message||"\u8C03\u7528\u5931\u8D25",H.startedAt&&(H.durationMs=Math.max(1,Date.now()-H.startedAt))),_e(m)}continue}let D=X.choices&&X.choices[0]&&X.choices[0].delta;if(!D)continue;if(D.reasoning_content){r.textContent="\u601D\u8003\u4E2D\u2026";let R=D.reasoning_content;if(/^(\[工具调用\]|\[执行成功\]|\[执行失败\])/.test(R)){let ee=je(m);if(!ee._hasAgentEvents){if(R.startsWith("[\u5DE5\u5177\u8C03\u7528]")){let L=R.replace(/^\[工具调用\]\s*/,"").trim(),J=L.indexOf(" ");ee.calls.push({name:J>0?L.slice(0,J):L,args:J>0?L.slice(J+1):"",result:"",status:"running",startedAt:Date.now(),durationMs:0})}else if(R.startsWith("[\u6267\u884C\u6210\u529F]")){let L=R.replace(/^\[执行成功\]\s*/,"").trim(),J=L.indexOf(":"),H=[...ee.calls].reverse().find(oe=>oe.status==="running")||ee.calls[ee.calls.length-1];H&&(H.status="ok",H.result=J>0?L.slice(J+1).trim():L,H.startedAt&&(H.durationMs=Math.max(1,Date.now()-H.startedAt)))}else if(R.startsWith("[\u6267\u884C\u5931\u8D25]")){let L=R.replace(/^\[执行失败\]\s*/,"").trim(),J=L.indexOf(":"),H=[...ee.calls].reverse().find(oe=>oe.status==="running")||ee.calls[ee.calls.length-1];H&&(H.status="fail",H.result=J>0?L.slice(J+1).trim():L,H.startedAt&&(H.durationMs=Math.max(1,Date.now()-H.startedAt)))}_e(m)}}else Yt(m,D.reasoning_content)}if(D.content){r.textContent="\u56DE\u7B54\u4E2D\u2026";let R=m._state&&m._state.tools;if(R&&R.calls){let ee=!1;R.calls.forEach(L=>{L.status==="running"&&(L.status="ok",ee=!0)}),ee&&_e(m)}x+=D.content,Ge(m,D.content)}}catch(X){}}}}let C=m._state&&m._state.tools;if(C&&C.calls){let Y=!1;C.calls.forEach(I=>{I.status==="running"&&(I.status="ok",Y=!0)}),Y&&_e(m)}mt(m),ft(m),Me(m,!1),r.textContent="",x.trim()&&(Ee.push({role:"assistant",content:x}),Ee.length>tt&&Ee.splice(0,Ee.length-tt))}catch(k){mt(m),ft(m),k.name==="AbortError"?(Ge(m,`

*\uFF08\u5DF2\u505C\u6B62\u751F\u6210\uFF09*`),r.textContent="\u5DF2\u4E2D\u65AD"):(Ge(m,`

[\u9519\u8BEF] `+k.message),r.textContent="\u5931\u8D25"),renderSegments(m,!1)}finally{Rt(!1)}}G.addEventListener("click",()=>{Ie?ht():gt()}),F.addEventListener("keydown",p=>{p.key==="Enter"&&!p.shiftKey?(p.preventDefault(),Ie||gt()):p.key==="Escape"&&Ie&&(p.preventDefault(),ht())}),N.addEventListener("click",p=>{let m=p.target.closest(".example-btn");if(m){if(Ie)return;gt(m.textContent.trim())}})}var Se=["#4f46e5","#06b6d4","#10b981","#f59e0b","#8b5cf6","#ec4899","#3b82f6","#f97316"],Pi="http://www.w3.org/2000/svg";function Re(i,e,t){let n=document.createElementNS(Pi,i);for(let a in e)n.setAttribute(a,e[a]);return t!==void 0&&(n.textContent=t),n}function ut(i){if(i==null||i==="")return"0";let e=Number(i);return isNaN(e)?String(i):e.toLocaleString("zh-CN")}function Wt(i){let e=document.createElement("div");e.className="data-table-wrap";let t=document.createElement("table");t.className="data-table";let n=(i.columns||[]).map(c=>({field:c.field,label:c.label||c.field})),a=document.createElement("thead"),s=document.createElement("tr");n.forEach(c=>{let d=document.createElement("th");d.textContent=c.label,s.appendChild(d)}),a.appendChild(s);let r=document.createElement("tbody");return(i.rows||[]).forEach(c=>{let d=document.createElement("tr");n.forEach(g=>{let b=document.createElement("td");b.textContent=c[g.field]===void 0?"":String(c[g.field]),d.appendChild(b)}),r.appendChild(d)}),t.append(a,r),e.appendChild(t),e}function Zo(i,e){let t=i.data||[],n=i.series||[],a=i.x_axis&&i.x_axis.field;if(!t.length||!n.length||!a)return Wt(i);let s="";e==="chart_bar"&&t.length>24&&(t=t.slice(0,24),s="\uFF08\u5C55\u793A\u524D 24 \u9879\uFF09");let r=480,c=240,d=48,g=14,b=16,y=42,w=r-d-g,_=c-b-y,q=t.map(($,W)=>a?$[a]:"\u7B2C"+(W+1)+"\u9879"),N=0;n.forEach($=>t.forEach(W=>{N=Math.max(N,Number(W[$.field])||0)})),N<=0&&(N=1);let z=Ui(N),P=Re("svg",{viewBox:"0 0 "+r+" "+c,class:"dq-svg-chart",role:"img"});for(let $=0;$<=4;$++){let W=b+_-_*$/4;P.appendChild(Re("line",{x1:d,y1:W,x2:r-g,y2:W,stroke:"#f1f5f9","stroke-width":1}));let V=Re("text",{x:d-8,y:W+4,"text-anchor":"end","font-size":10,fill:"#94a3b8"});V.textContent=ut(Math.round(z*$/4)),P.appendChild(V)}let le=Math.ceil(q.length/12);if(q.forEach(($,W)=>{if(W%le!==0)return;let V=Re("text",{x:d+w*(W+.5)/q.length,y:c-y+16,"text-anchor":"middle","font-size":10,fill:"#64748b"});V.textContent=String($).length>6?String($).slice(0,6)+"\u2026":$,P.appendChild(V)}),e==="chart_bar"){let $=w/q.length,W=Math.min(24,$*.7/n.length);n.forEach((V,fe)=>{t.forEach((F,G)=>{let Te=Number(F[V.field])||0,Fe=Te/z*_,te=d+$*G+($-W*n.length)/2+fe*W,ke=Re("rect",{x:te,y:b+_-Fe,width:W-1,height:Math.max(Fe,1),fill:Se[fe%Se.length],rx:3,class:"dq-svg-bar"});ke.setAttribute("data-tip",(q[G]||"")+" \xB7 "+(V.name||V.field)+"\uFF1A"+ut(Te)),P.appendChild(ke)})})}else n.forEach(($,W)=>{let V=t.map((F,G)=>{let Te=Number(F[$.field])||0;return[(d+w*(G+.5))/q.length,b+_-Te/z*_]}),fe=V.map((F,G)=>(G===0?"M":"L")+F[0].toFixed(1)+" "+F[1].toFixed(1)).join(" ");P.appendChild(Re("path",{d:fe,fill:"none",stroke:Se[W%Se.length],"stroke-width":2,"stroke-linejoin":"round"})),t.length<=48&&V.forEach((F,G)=>{let Te=Re("circle",{cx:F[0].toFixed(1),cy:F[1].toFixed(1),r:3,fill:Se[W%Se.length]});Te.setAttribute("data-tip",(q[G]||"")+" \xB7 "+($.name||$.field)+"\uFF1A"+ut(t[G][$.field])),P.appendChild(Te)})});return Vo(P,i,n,s)}function $i(i){let e=i.data||[],t=i.name_field,n=i.value_field;if(!e.length||!t||!n)return Wt(i);let a="";if(e.length>7){let _=[...e].sort((P,le)=>(Number(le[n])||0)-(Number(P[n])||0)),q=_.slice(0,6),z=_.slice(6).reduce((P,le)=>P+(Number(le[n])||0),0);z>0&&q.push({[t]:"\u5176\u4ED6",[n]:z}),e=q,a="\uFF08Top 6 + \u5176\u4ED6\uFF09"}let s=480,r=240,c=130,d=r/2,g=88,b=e.reduce((_,q)=>_+(Number(q[n])||0),0)||1,y=Re("svg",{viewBox:"0 0 "+s+" "+r,class:"dq-svg-chart",role:"img"}),w=-Math.PI/2;return e.forEach((_,q)=>{let N=Number(_[n])||0,z=N/b,P=w+z*Math.PI*2,le=c+g*Math.cos(w),$=d+g*Math.sin(w),W=c+g*Math.cos(P),V=d+g*Math.sin(P),fe=z>.5?1:0,F=Re("path",{d:"M"+c+" "+d+" L"+le.toFixed(1)+" "+$.toFixed(1)+" A"+g+" "+g+" 0 "+fe+" 1 "+W.toFixed(1)+" "+V.toFixed(1)+" Z",fill:Se[q%Se.length],stroke:"#fff","stroke-width":1.5});F.setAttribute("data-tip",(_[t]||"")+"\uFF1A"+ut(N)+"\uFF08"+(z*100).toFixed(1)+"%\uFF09"),y.appendChild(F),w=P}),e.forEach((_,q)=>{let N=30+q*22;y.appendChild(Re("rect",{x:260,y:N-8,width:10,height:10,rx:2,fill:Se[q%Se.length]}));let z=Re("text",{x:276,y:N,"font-size":11,fill:"#1e293b"}),P=String(_[t]||"");z.textContent=(P.length>10?P.slice(0,10)+"\u2026":P)+" "+ut(_[n]),y.appendChild(z)}),Vo(y,i,[],a)}function Fi(i){let e=document.createElement("div");return e.className="metric-cards",(i.cards||[]).forEach(t=>{let n=document.createElement("div");n.className="metric-card";let a=document.createElement("div");a.className="metric-label",a.textContent=t.label||"";let s=document.createElement("div");if(s.className="metric-value",s.textContent=ut(t.value),t.unit){let r=document.createElement("span");r.className="metric-unit",r.textContent=t.unit,s.appendChild(r)}n.append(a,s),e.appendChild(n)}),e}function Vo(i,e,t,n){let a=document.createElement("div");if(a.className="render-card",e.title||n){let s=document.createElement("div");s.className="chart-title",s.textContent=(e.title||"\u6570\u636E\u56FE\u8868")+(n?" "+n:""),a.appendChild(s)}if(i.style.width="100%",i.style.height="auto",a.appendChild(i),t.length>1){let s=document.createElement("div");s.style.cssText="display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:#64748b;margin-top:4px;",t.forEach((r,c)=>{let d=document.createElement("span"),g=document.createElement("span");g.style.cssText="display:inline-block;width:8px;height:8px;border-radius:2px;background:"+Se[c%Se.length]+";margin-right:4px;",d.appendChild(g),d.appendChild(document.createTextNode(r.name||r.field)),s.appendChild(d)}),a.appendChild(s)}return Hi(a,i),a}function Hi(i,e){let t=document.createElement("div");t.className="dq-tooltip",t.style.cssText=["position:absolute;","pointer-events:none;","z-index:10;","background:rgba(15,23,42,.92);","color:#f8fafc;","padding:5px 9px;","border-radius:6px;","font-size:12px;","line-height:1.5;","white-space:nowrap;","box-shadow:0 4px 12px rgba(0,0,0,.25);","opacity:0;","transition:opacity .12s;","top:0;","left:0;"].join(""),i.style.position=i.style.position||"relative",i.appendChild(t);let n=r=>{let c=r.getAttribute("data-tip");c&&(t.textContent=c,t.style.opacity="1")},a=r=>{let c=i.getBoundingClientRect(),d=r.clientX-c.left+12,g=r.clientY-c.top-10;d+t.offsetWidth>c.width&&(d=r.clientX-c.left-t.offsetWidth-12),g+t.offsetHeight>c.height&&(g=r.clientY-c.top-t.offsetHeight-4),g<0&&(g=4),t.style.left=d+"px",t.style.top=g+"px"},s=()=>{t.style.opacity="0"};e.addEventListener("mouseover",r=>{let c=r.target.closest("[data-tip]");c&&n(c)}),e.addEventListener("mousemove",a),e.addEventListener("mouseout",r=>{r.target.closest("[data-tip]")&&s()})}function Ui(i){if(i<=5)return 5;let e=Math.pow(10,Math.floor(Math.log10(i)));for(let t of[1,2,5,10])if(t*e>=i)return t*e;return i}function Xo(i){if(!i||!i.type)return null;switch(i.type){case"data_table":return Wt(i);case"chart_bar":return Zo(i,"chart_bar");case"chart_line":return Zo(i,"chart_line");case"chart_pie":return $i(i);case"metric_cards":return Fi(i);default:return Wt(i)}}var In=`/* gf-mate \u5D4C\u5165\u5F0F\u5C0F\u7A97\u6837\u5F0F\uFF08Shadow DOM \u5185\u6CE8\u5165\uFF09\uFF1A
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
}`;window.renderRenderJSON=Xo;window.marked=j;window.DOMPurify=Yo;var zn='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M14 9.5v3"/><path d="M10 11v1.5"/></svg>',Dn='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',qi=`
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
`,Ae=document.currentScript,Jo=(Ae&&Ae.dataset.dqBase||"").replace(/\/$/,""),Ko=Ae&&Ae.dataset.dqTitle||void 0,er=Ae&&Ae.dataset.dqColor||void 0,tr=Ae&&Ae.dataset.dqExamples||void 0;function jt(i){i=i||{};let e=(i.base!==void 0?i.base:Jo).replace(/\/$/,""),t=i.title||Ko||void 0,n=i.color||er||void 0,a=i.examples||tr||void 0;if(!document.getElementById("dq-bubble-style")){let b=document.createElement("style");b.id="dq-bubble-style",b.textContent=qi,document.head.appendChild(b)}let s=document.createElement("button");s.type="button",s.className="dq-bubble",s.setAttribute("aria-label",t||"AI \u6570\u636E\u52A9\u624B"),n&&(s.style.background=n),s.innerHTML=zn;let r=document.createElement("div");r.className="dq-panel";let c=r.attachShadow({mode:"open"}),d=document.createElement("style");d.textContent=In,c.appendChild(d);let g=document.createElement("div");return g.className="dq-widget-root",g.style.cssText="display:flex;flex-direction:column;height:100%;",c.appendChild(g),On(g,{base:e||void 0,title:t,color:n,examples:a}),s.addEventListener("click",()=>{let b=r.classList.toggle("dq-open");s.innerHTML=b?Dn:zn}),i.open&&(r.classList.add("dq-open"),s.innerHTML=Dn),document.body.append(r,s),{open(){r.classList.add("dq-open"),s.innerHTML=Dn},close(){r.classList.remove("dq-open"),s.innerHTML=zn},toggle(){s.click()},destroy(){s.remove(),r.remove()}}}var Gt=class extends HTMLElement{connectedCallback(){if(this._mounted)return;this._mounted=!0;let e=this.getAttribute("base")||this.getAttribute("api")||Jo||void 0,t=this.getAttribute("title")||Ko||void 0,n=this.getAttribute("color")||er||void 0,a=this.getAttribute("examples")||tr||void 0;if(this.hasAttribute("inline")||this.getAttribute("mode")==="inline"){let r=this.attachShadow({mode:"open"}),c=document.createElement("style");c.textContent=`:host { display: block; width: 100%; height: 100%; min-height: 420px; overflow: hidden; background: #fff; border-radius: inherit; }
`+In,r.appendChild(c);let d=document.createElement("div");d.className="dq-widget-root",d.style.cssText="display:flex;flex-direction:column;height:100%;width:100%;",r.appendChild(d),this._inst=On(d,{base:e?e.replace(/\/$/,""):void 0,title:t,color:n,examples:a,inline:!0})}else this._inst=jt({base:e,title:t,color:n,examples:a,open:this.hasAttribute("open")})}disconnectedCallback(){this._inst&&typeof this._inst.destroy=="function"&&this._inst.destroy(),this._mounted=!1}open(){this._inst&&this._inst.open&&this._inst.open()}close(){this._inst&&this._inst.close&&this._inst.close()}toggle(){this._inst&&this._inst.toggle&&this._inst.toggle()}};typeof customElements!="undefined"&&(customElements.get("gf-mate")||customElements.define("gf-mate",Gt),customElements.get("dq-assistant")||customElements.define("dq-assistant",class extends Gt{}));function Qo(){if(document.querySelector("gf-mate, dq-assistant")||Ae&&Ae.dataset.dqAuto==="false"){window.DQWidget={mount:jt};return}let i=jt();Ae&&Ae.dataset.dqOpen!==void 0&&i.open(),window.DQWidget=i,window.DQWidget.mount=jt}document.body?Qo():document.addEventListener("DOMContentLoaded",Qo);})();
