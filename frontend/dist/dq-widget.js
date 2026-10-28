(()=>{var Tr=Object.defineProperty;var ao=i=>{throw TypeError(i)};var _r=(i,e,t)=>e in i?Tr(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var Q=(i,e,t)=>_r(i,typeof e!="symbol"?e+"":e,t),Er=(i,e,t)=>e.has(i)||ao("Cannot "+t);var lo=(i,e,t)=>e.has(i)?ao("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t);var Pt=(i,e,t)=>(Er(i,e,"access private method"),t);function gn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ke=gn();function mo(i){Ke=i}var go=/[&<>"']/,vr=new RegExp(go.source,"g"),bo=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,Sr=new RegExp(bo.source,"g"),Ar={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},co=i=>Ar[i];function we(i,e){if(e){if(go.test(i))return i.replace(vr,co)}else if(bo.test(i))return i.replace(Sr,co);return i}var Cr=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;function Rr(i){return i.replace(Cr,(e,t)=>(t=t.toLowerCase(),t==="colon"?":":t.charAt(0)==="#"?t.charAt(1)==="x"?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""))}var Mr=/(^|[^\[])\^/g;function Z(i,e){let t=typeof i=="string"?i:i.source;e=e||"";let n={replace:(a,s)=>{let r=typeof s=="string"?s:s.source;return r=r.replace(Mr,"$1"),t=t.replace(a,r),n},getRegex:()=>new RegExp(t,e)};return n}function po(i){try{i=encodeURI(i).replace(/%25/g,"%")}catch(e){return null}return i}var Tt={exec:()=>null};function uo(i,e){let t=i.replace(/\|/g,(s,r,c)=>{let d=!1,m=r;for(;--m>=0&&c[m]==="\\";)d=!d;return d?"|":" |"}),n=t.split(/ \|/),a=0;if(n[0].trim()||n.shift(),n.length>0&&!n[n.length-1].trim()&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;a<n.length;a++)n[a]=n[a].trim().replace(/\\\|/g,"|");return n}function $t(i,e,t){let n=i.length;if(n===0)return"";let a=0;for(;a<n;){let s=i.charAt(n-a-1);if(s===e&&!t)a++;else if(s!==e&&t)a++;else break}return i.slice(0,n-a)}function Nr(i,e){if(i.indexOf(e[1])===-1)return-1;let t=0;for(let n=0;n<i.length;n++)if(i[n]==="\\")n++;else if(i[n]===e[0])t++;else if(i[n]===e[1]&&(t--,t<0))return n;return-1}function fo(i,e,t,n){let a=e.href,s=e.title?we(e.title):null,r=i[1].replace(/\\([\[\]])/g,"$1");if(i[0].charAt(0)!=="!"){n.state.inLink=!0;let c={type:"link",raw:t,href:a,title:s,text:r,tokens:n.inlineTokens(r)};return n.state.inLink=!1,c}return{type:"image",raw:t,href:a,title:s,text:we(r)}}function Lr(i,e){let t=i.match(/^(\s+)(?:```)/);if(t===null)return e;let n=t[1];return e.split(`
`).map(a=>{let s=a.match(/^\s+/);if(s===null)return a;let[r]=s;return r.length>=n.length?a.slice(n.length):a}).join(`
`)}var ct=class{constructor(e){Q(this,"options");Q(this,"rules");Q(this,"lexer");this.options=e||Ke}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:$t(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],a=Lr(n,t[3]||"");return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:a}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(/#$/.test(n)){let a=$t(n,"#");(this.options.pedantic||!a||/ $/.test(a))&&(n=a.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:t[0]}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=t[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,`
    $1`);n=$t(n.replace(/^ *>[ \t]?/gm,""),`
`);let a=this.lexer.state.top;this.lexer.state.top=!0;let s=this.lexer.blockTokens(n);return this.lexer.state.top=a,{type:"blockquote",raw:t[0],tokens:s,text:n}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),a=n.length>1,s={type:"list",raw:"",ordered:a,start:a?+n.slice(0,-1):"",loose:!1,items:[]};n=a?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=a?n:"[*+-]");let r=new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),c="",d="",m=!1;for(;e;){let g=!1;if(!(t=r.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let y=t[2].split(`
`,1)[0].replace(/^\t+/,z=>" ".repeat(3*z.length)),w=e.split(`
`,1)[0],_=0;this.options.pedantic?(_=2,d=y.trimStart()):(_=t[2].search(/[^ ]/),_=_>4?1:_,d=y.slice(_),_+=t[1].length);let B=!1;if(!y&&/^ *$/.test(w)&&(c+=w+`
`,e=e.substring(w.length+1),g=!0),!g){let z=new RegExp(`^ {0,${Math.min(3,_-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),de=new RegExp(`^ {0,${Math.min(3,_-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),D=new RegExp(`^ {0,${Math.min(3,_-1)}}(?:\`\`\`|~~~)`),q=new RegExp(`^ {0,${Math.min(3,_-1)}}#`);for(;e;){let V=e.split(`
`,1)[0];if(w=V,this.options.pedantic&&(w=w.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),D.test(w)||q.test(w)||z.test(w)||de.test(e))break;if(w.search(/[^ ]/)>=_||!w.trim())d+=`
`+w.slice(_);else{if(B||y.search(/[^ ]/)>=4||D.test(y)||q.test(y)||de.test(y))break;d+=`
`+w}!B&&!w.trim()&&(B=!0),c+=V+`
`,e=e.substring(V.length+1),y=w.slice(_)}}s.loose||(m?s.loose=!0:/\n *\n *$/.test(c)&&(m=!0));let M=null,O;this.options.gfm&&(M=/^\[[ xX]\] /.exec(d),M&&(O=M[0]!=="[ ] ",d=d.replace(/^\[[ xX]\] +/,""))),s.items.push({type:"list_item",raw:c,task:!!M,checked:O,loose:!1,text:d,tokens:[]}),s.raw+=c}s.items[s.items.length-1].raw=c.trimEnd(),s.items[s.items.length-1].text=d.trimEnd(),s.raw=s.raw.trimEnd();for(let g=0;g<s.items.length;g++)if(this.lexer.state.top=!1,s.items[g].tokens=this.lexer.blockTokens(s.items[g].text,[]),!s.loose){let y=s.items[g].tokens.filter(_=>_.type==="space"),w=y.length>0&&y.some(_=>/\n.*\n/.test(_.raw));s.loose=w}if(s.loose)for(let g=0;g<s.items.length;g++)s.items[g].loose=!0;return s}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(/\s+/g," "),a=t[2]?t[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:a,title:s}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!/[:|]/.test(t[2]))return;let n=uo(t[1]),a=t[2].replace(/^\||\| *$/g,"").split("|"),s=t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split(`
`):[],r={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===a.length){for(let c of a)/^ *-+: *$/.test(c)?r.align.push("right"):/^ *:-+: *$/.test(c)?r.align.push("center"):/^ *:-+ *$/.test(c)?r.align.push("left"):r.align.push(null);for(let c of n)r.header.push({text:c,tokens:this.lexer.inline(c)});for(let c of s)r.rows.push(uo(c,r.header.length).map(d=>({text:d,tokens:this.lexer.inline(d)})));return r}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:we(t[1])}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&/^</.test(n)){if(!/>$/.test(n))return;let r=$t(n.slice(0,-1),"\\");if((n.length-r.length)%2===0)return}else{let r=Nr(t[2],"()");if(r>-1){let d=(t[0].indexOf("!")===0?5:4)+t[1].length+r;t[2]=t[2].substring(0,r),t[0]=t[0].substring(0,d).trim(),t[3]=""}}let a=t[2],s="";if(this.options.pedantic){let r=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(a);r&&(a=r[1],s=r[3])}else s=t[3]?t[3].slice(1,-1):"";return a=a.trim(),/^</.test(a)&&(this.options.pedantic&&!/>$/.test(n)?a=a.slice(1):a=a.slice(1,-1)),fo(t,{href:a&&a.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let a=(n[2]||n[1]).replace(/\s+/g," "),s=t[a.toLowerCase()];if(!s){let r=n[0].charAt(0);return{type:"text",raw:r,text:r}}return fo(n,s,n[0],this.lexer)}}emStrong(e,t,n=""){let a=this.rules.inline.emStrongLDelim.exec(e);if(!a||a[3]&&n.match(/[\p{L}\p{N}]/u))return;if(!(a[1]||a[2]||"")||!n||this.rules.inline.punctuation.exec(n)){let r=[...a[0]].length-1,c,d,m=r,g=0,y=a[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(y.lastIndex=0,t=t.slice(-1*e.length+r);(a=y.exec(t))!=null;){if(c=a[1]||a[2]||a[3]||a[4]||a[5]||a[6],!c)continue;if(d=[...c].length,a[3]||a[4]){m+=d;continue}else if((a[5]||a[6])&&r%3&&!((r+d)%3)){g+=d;continue}if(m-=d,m>0)continue;d=Math.min(d,d+m+g);let w=[...a[0]][0].length,_=e.slice(0,r+a.index+w+d);if(Math.min(r,d)%2){let M=_.slice(1,-1);return{type:"em",raw:_,text:M,tokens:this.lexer.inlineTokens(M)}}let B=_.slice(2,-2);return{type:"strong",raw:_,text:B,tokens:this.lexer.inlineTokens(B)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(/\n/g," "),a=/[^ ]/.test(n),s=/^ /.test(n)&&/ $/.test(n);return a&&s&&(n=n.substring(1,n.length-1)),n=we(n,!0),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){let t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,a;return t[2]==="@"?(n=we(t[1]),a="mailto:"+n):(n=we(t[1]),a=n),{type:"link",raw:t[0],text:n,href:a,tokens:[{type:"text",raw:n,text:n}]}}}url(e){var n,a;let t;if(t=this.rules.inline.url.exec(e)){let s,r;if(t[2]==="@")s=we(t[0]),r="mailto:"+s;else{let c;do c=t[0],t[0]=(a=(n=this.rules.inline._backpedal.exec(t[0]))==null?void 0:n[0])!=null?a:"";while(c!==t[0]);s=we(t[0]),t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:s,href:r,tokens:[{type:"text",raw:s,text:s}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n;return this.lexer.state.inRawBlock?n=t[0]:n=we(t[0]),{type:"text",raw:t[0],text:n}}}},Or=/^(?: *(?:\n|$))+/,Ir=/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,zr=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Et=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Dr=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,xo=/(?:[*+-]|\d{1,9}[.)])/,ko=Z(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,xo).replace(/blockCode/g,/ {4}/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),bn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Pr=/^[^\n]+/,xn=/(?!\s*\])(?:\\.|[^\[\]\\])+/,$r=Z(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label",xn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Hr=Z(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,xo).getRegex(),Ut="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",kn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Fr=Z("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))","i").replace("comment",kn).replace("tag",Ut).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),yo=Z(bn).replace("hr",Et).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex(),Ur=Z(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",yo).getRegex(),yn={blockquote:Ur,code:Ir,def:$r,fences:zr,heading:Dr,hr:Et,html:Fr,lheading:ko,list:Hr,newline:Or,paragraph:yo,table:Tt,text:Pr},ho=Z("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Et).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex(),Br={...yn,table:ho,paragraph:Z(bn).replace("hr",Et).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ho).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex()},qr={...yn,html:Z(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",kn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Tt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Z(bn).replace("hr",Et).replace("heading",` *#{1,6} *[^
]`).replace("lheading",ko).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},wo=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Wr=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,To=/^( {2,}|\\)\n(?!\s*$)/,jr=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,vt="\\p{P}\\p{S}",Gr=Z(/^((?![*_])[\spunctuation])/,"u").replace(/punctuation/g,vt).getRegex(),Yr=/\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g,Zr=Z(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,"u").replace(/punct/g,vt).getRegex(),Vr=Z("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])","gu").replace(/punct/g,vt).getRegex(),Xr=Z("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])","gu").replace(/punct/g,vt).getRegex(),Qr=Z(/\\([punct])/,"gu").replace(/punct/g,vt).getRegex(),Jr=Z(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Kr=Z(kn).replace("(?:-->|$)","-->").getRegex(),ei=Z("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Kr).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ft=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,ti=Z(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",Ft).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),_o=Z(/^!?\[(label)\]\[(ref)\]/).replace("label",Ft).replace("ref",xn).getRegex(),Eo=Z(/^!?\[(ref)\](?:\[\])?/).replace("ref",xn).getRegex(),ni=Z("reflink|nolink(?!\\()","g").replace("reflink",_o).replace("nolink",Eo).getRegex(),wn={_backpedal:Tt,anyPunctuation:Qr,autolink:Jr,blockSkip:Yr,br:To,code:Wr,del:Tt,emStrongLDelim:Zr,emStrongRDelimAst:Vr,emStrongRDelimUnd:Xr,escape:wo,link:ti,nolink:Eo,punctuation:Gr,reflink:_o,reflinkSearch:ni,tag:ei,text:jr,url:Tt},oi={...wn,link:Z(/^!?\[(label)\]\((.*?)\)/).replace("label",Ft).getRegex(),reflink:Z(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ft).getRegex()},fn={...wn,escape:Z(wo).replace("])","~|])").getRegex(),url:Z(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},ri={...fn,br:Z(To).replace("{2,}","*").getRegex(),text:Z(fn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Ht={normal:yn,gfm:Br,pedantic:qr},wt={normal:wn,gfm:fn,breaks:ri,pedantic:oi},De=class i{constructor(e){Q(this,"tokens");Q(this,"options");Q(this,"state");Q(this,"tokenizer");Q(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ke,this.options.tokenizer=this.options.tokenizer||new ct,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={block:Ht.normal,inline:wt.normal};this.options.pedantic?(t.block=Ht.pedantic,t.inline=wt.pedantic):this.options.gfm&&(t.block=Ht.gfm,this.options.breaks?t.inline=wt.breaks:t.inline=wt.gfm),this.tokenizer.rules=t}static get rules(){return{block:Ht,inline:wt}}static lex(e,t){return new i(t).lex(e)}static lexInline(e,t){return new i(t).inlineTokens(e)}lex(e){e=e.replace(/\r\n|\r/g,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[]){this.options.pedantic?e=e.replace(/\t/g,"    ").replace(/^ +$/gm,""):e=e.replace(/^( *)(\t+)/gm,(c,d,m)=>d+"    ".repeat(m.length));let n,a,s,r;for(;e;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some(c=>(n=c.call({lexer:this},e,t))?(e=e.substring(n.raw.length),t.push(n),!0):!1))){if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length),n.raw.length===1&&t.length>0?t[t.length-1].raw+=`
`:t.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length),a=t[t.length-1],a&&(a.type==="paragraph"||a.type==="text")?(a.raw+=`
`+n.raw,a.text+=`
`+n.text,this.inlineQueue[this.inlineQueue.length-1].src=a.text):t.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length),a=t[t.length-1],a&&(a.type==="paragraph"||a.type==="text")?(a.raw+=`
`+n.raw,a.text+=`
`+n.raw,this.inlineQueue[this.inlineQueue.length-1].src=a.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title});continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),t.push(n);continue}if(s=e,this.options.extensions&&this.options.extensions.startBlock){let c=1/0,d=e.slice(1),m;this.options.extensions.startBlock.forEach(g=>{m=g.call({lexer:this},d),typeof m=="number"&&m>=0&&(c=Math.min(c,m))}),c<1/0&&c>=0&&(s=e.substring(0,c+1))}if(this.state.top&&(n=this.tokenizer.paragraph(s))){a=t[t.length-1],r&&a.type==="paragraph"?(a.raw+=`
`+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=a.text):t.push(n),r=s.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length),a=t[t.length-1],a&&a.type==="text"?(a.raw+=`
`+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=a.text):t.push(n);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n,a,s,r=e,c,d,m;if(this.tokens.links){let g=Object.keys(this.tokens.links);if(g.length>0)for(;(c=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)g.includes(c[0].slice(c[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,c.index)+"["+"a".repeat(c[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(c=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)r=r.slice(0,c.index)+"["+"a".repeat(c[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(c=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,c.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;e;)if(d||(m=""),d=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some(g=>(n=g.call({lexer:this},e,t))?(e=e.substring(n.raw.length),t.push(n),!0):!1))){if(n=this.tokenizer.escape(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.tag(e)){e=e.substring(n.raw.length),a=t[t.length-1],a&&n.type==="text"&&a.type==="text"?(a.raw+=n.raw,a.text+=n.text):t.push(n);continue}if(n=this.tokenizer.link(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(n.raw.length),a=t[t.length-1],a&&n.type==="text"&&a.type==="text"?(a.raw+=n.raw,a.text+=n.text):t.push(n);continue}if(n=this.tokenizer.emStrong(e,r,m)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.codespan(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.br(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.del(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.autolink(e)){e=e.substring(n.raw.length),t.push(n);continue}if(!this.state.inLink&&(n=this.tokenizer.url(e))){e=e.substring(n.raw.length),t.push(n);continue}if(s=e,this.options.extensions&&this.options.extensions.startInline){let g=1/0,y=e.slice(1),w;this.options.extensions.startInline.forEach(_=>{w=_.call({lexer:this},y),typeof w=="number"&&w>=0&&(g=Math.min(g,w))}),g<1/0&&g>=0&&(s=e.substring(0,g+1))}if(n=this.tokenizer.inlineText(s)){e=e.substring(n.raw.length),n.raw.slice(-1)!=="_"&&(m=n.raw.slice(-1)),d=!0,a=t[t.length-1],a&&a.type==="text"?(a.raw+=n.raw,a.text+=n.text):t.push(n);continue}if(e){let g="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(g);break}else throw new Error(g)}}return t}},dt=class{constructor(e){Q(this,"options");this.options=e||Ke}code(e,t,n){var s;let a=(s=(t||"").match(/^\S*/))==null?void 0:s[0];return e=e.replace(/\n$/,"")+`
`,a?'<pre><code class="language-'+we(a)+'">'+(n?e:we(e,!0))+`</code></pre>
`:"<pre><code>"+(n?e:we(e,!0))+`</code></pre>
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
`}strong(e){return`<strong>${e}</strong>`}em(e){return`<em>${e}</em>`}codespan(e){return`<code>${e}</code>`}br(){return"<br>"}del(e){return`<del>${e}</del>`}link(e,t,n){let a=po(e);if(a===null)return n;e=a;let s='<a href="'+e+'"';return t&&(s+=' title="'+t+'"'),s+=">"+n+"</a>",s}image(e,t,n){let a=po(e);if(a===null)return n;e=a;let s=`<img src="${e}" alt="${n}"`;return t&&(s+=` title="${t}"`),s+=">",s}text(e){return e}},_t=class{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,n){return""+n}image(e,t,n){return""+n}br(){return""}},Pe=class i{constructor(e){Q(this,"options");Q(this,"renderer");Q(this,"textRenderer");this.options=e||Ke,this.options.renderer=this.options.renderer||new dt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new _t}static parse(e,t){return new i(t).parse(e)}static parseInline(e,t){return new i(t).parseInline(e)}parse(e,t=!0){let n="";for(let a=0;a<e.length;a++){let s=e[a];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[s.type]){let r=s,c=this.options.extensions.renderers[r.type].call({parser:this},r);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(r.type)){n+=c||"";continue}}switch(s.type){case"space":continue;case"hr":{n+=this.renderer.hr();continue}case"heading":{let r=s;n+=this.renderer.heading(this.parseInline(r.tokens),r.depth,Rr(this.parseInline(r.tokens,this.textRenderer)));continue}case"code":{let r=s;n+=this.renderer.code(r.text,r.lang,!!r.escaped);continue}case"table":{let r=s,c="",d="";for(let g=0;g<r.header.length;g++)d+=this.renderer.tablecell(this.parseInline(r.header[g].tokens),{header:!0,align:r.align[g]});c+=this.renderer.tablerow(d);let m="";for(let g=0;g<r.rows.length;g++){let y=r.rows[g];d="";for(let w=0;w<y.length;w++)d+=this.renderer.tablecell(this.parseInline(y[w].tokens),{header:!1,align:r.align[w]});m+=this.renderer.tablerow(d)}n+=this.renderer.table(c,m);continue}case"blockquote":{let r=s,c=this.parse(r.tokens);n+=this.renderer.blockquote(c);continue}case"list":{let r=s,c=r.ordered,d=r.start,m=r.loose,g="";for(let y=0;y<r.items.length;y++){let w=r.items[y],_=w.checked,B=w.task,M="";if(w.task){let O=this.renderer.checkbox(!!_);m?w.tokens.length>0&&w.tokens[0].type==="paragraph"?(w.tokens[0].text=O+" "+w.tokens[0].text,w.tokens[0].tokens&&w.tokens[0].tokens.length>0&&w.tokens[0].tokens[0].type==="text"&&(w.tokens[0].tokens[0].text=O+" "+w.tokens[0].tokens[0].text)):w.tokens.unshift({type:"text",text:O+" "}):M+=O+" "}M+=this.parse(w.tokens,m),g+=this.renderer.listitem(M,B,!!_)}n+=this.renderer.list(g,c,d);continue}case"html":{let r=s;n+=this.renderer.html(r.text,r.block);continue}case"paragraph":{let r=s;n+=this.renderer.paragraph(this.parseInline(r.tokens));continue}case"text":{let r=s,c=r.tokens?this.parseInline(r.tokens):r.text;for(;a+1<e.length&&e[a+1].type==="text";)r=e[++a],c+=`
`+(r.tokens?this.parseInline(r.tokens):r.text);n+=t?this.renderer.paragraph(c):c;continue}default:{let r='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(r),"";throw new Error(r)}}}return n}parseInline(e,t){t=t||this.renderer;let n="";for(let a=0;a<e.length;a++){let s=e[a];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[s.type]){let r=this.options.extensions.renderers[s.type].call({parser:this},s);if(r!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(s.type)){n+=r||"";continue}}switch(s.type){case"escape":{let r=s;n+=t.text(r.text);break}case"html":{let r=s;n+=t.html(r.text);break}case"link":{let r=s;n+=t.link(r.href,r.title,this.parseInline(r.tokens,t));break}case"image":{let r=s;n+=t.image(r.href,r.title,r.text);break}case"strong":{let r=s;n+=t.strong(this.parseInline(r.tokens,t));break}case"em":{let r=s;n+=t.em(this.parseInline(r.tokens,t));break}case"codespan":{let r=s;n+=t.codespan(r.text);break}case"br":{n+=t.br();break}case"del":{let r=s;n+=t.del(this.parseInline(r.tokens,t));break}case"text":{let r=s;n+=t.text(r.text);break}default:{let r='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(r),"";throw new Error(r)}}}return n}},Xe=class{constructor(e){Q(this,"options");this.options=e||Ke}preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}};Q(Xe,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));var Je,mn,vo,hn=class{constructor(...e){lo(this,Je);Q(this,"defaults",gn());Q(this,"options",this.setOptions);Q(this,"parse",Pt(this,Je,mn).call(this,De.lex,Pe.parse));Q(this,"parseInline",Pt(this,Je,mn).call(this,De.lexInline,Pe.parseInline));Q(this,"Parser",Pe);Q(this,"Renderer",dt);Q(this,"TextRenderer",_t);Q(this,"Lexer",De);Q(this,"Tokenizer",ct);Q(this,"Hooks",Xe);this.use(...e)}walkTokens(e,t){var a,s;let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case"table":{let c=r;for(let d of c.header)n=n.concat(this.walkTokens(d.tokens,t));for(let d of c.rows)for(let m of d)n=n.concat(this.walkTokens(m.tokens,t));break}case"list":{let c=r;n=n.concat(this.walkTokens(c.items,t));break}default:{let c=r;(s=(a=this.defaults.extensions)==null?void 0:a.childTokens)!=null&&s[c.type]?this.defaults.extensions.childTokens[c.type].forEach(d=>{let m=c[d].flat(1/0);n=n.concat(this.walkTokens(m,t))}):c.tokens&&(n=n.concat(this.walkTokens(c.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let a={...n};if(a.async=this.defaults.async||a.async||!1,n.extensions&&(n.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){let r=t.renderers[s.name];r?t.renderers[s.name]=function(...c){let d=s.renderer.apply(this,c);return d===!1&&(d=r.apply(this,c)),d}:t.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let r=t[s.level];r?r.unshift(s.tokenizer):t[s.level]=[s.tokenizer],s.start&&(s.level==="block"?t.startBlock?t.startBlock.push(s.start):t.startBlock=[s.start]:s.level==="inline"&&(t.startInline?t.startInline.push(s.start):t.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(t.childTokens[s.name]=s.childTokens)}),a.extensions=t),n.renderer){let s=this.defaults.renderer||new dt(this.defaults);for(let r in n.renderer){if(!(r in s))throw new Error(`renderer '${r}' does not exist`);if(r==="options")continue;let c=r,d=n.renderer[c],m=s[c];s[c]=(...g)=>{let y=d.apply(s,g);return y===!1&&(y=m.apply(s,g)),y||""}}a.renderer=s}if(n.tokenizer){let s=this.defaults.tokenizer||new ct(this.defaults);for(let r in n.tokenizer){if(!(r in s))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;let c=r,d=n.tokenizer[c],m=s[c];s[c]=(...g)=>{let y=d.apply(s,g);return y===!1&&(y=m.apply(s,g)),y}}a.tokenizer=s}if(n.hooks){let s=this.defaults.hooks||new Xe;for(let r in n.hooks){if(!(r in s))throw new Error(`hook '${r}' does not exist`);if(r==="options")continue;let c=r,d=n.hooks[c],m=s[c];Xe.passThroughHooks.has(r)?s[c]=g=>{if(this.defaults.async)return Promise.resolve(d.call(s,g)).then(w=>m.call(s,w));let y=d.call(s,g);return m.call(s,y)}:s[c]=(...g)=>{let y=d.apply(s,g);return y===!1&&(y=m.apply(s,g)),y}}a.hooks=s}if(n.walkTokens){let s=this.defaults.walkTokens,r=n.walkTokens;a.walkTokens=function(c){let d=[];return d.push(r.call(this,c)),s&&(d=d.concat(s.call(this,c))),d}}this.defaults={...this.defaults,...a}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return De.lex(e,t!=null?t:this.defaults)}parser(e,t){return Pe.parse(e,t!=null?t:this.defaults)}};Je=new WeakSet,mn=function(e,t){return(n,a)=>{let s={...a},r={...this.defaults,...s};this.defaults.async===!0&&s.async===!1&&(r.silent||console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."),r.async=!0);let c=Pt(this,Je,vo).call(this,!!r.silent,!!r.async);if(typeof n=="undefined"||n===null)return c(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return c(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));if(r.hooks&&(r.hooks.options=r),r.async)return Promise.resolve(r.hooks?r.hooks.preprocess(n):n).then(d=>e(d,r)).then(d=>r.hooks?r.hooks.processAllTokens(d):d).then(d=>r.walkTokens?Promise.all(this.walkTokens(d,r.walkTokens)).then(()=>d):d).then(d=>t(d,r)).then(d=>r.hooks?r.hooks.postprocess(d):d).catch(c);try{r.hooks&&(n=r.hooks.preprocess(n));let d=e(n,r);r.hooks&&(d=r.hooks.processAllTokens(d)),r.walkTokens&&this.walkTokens(d,r.walkTokens);let m=t(d,r);return r.hooks&&(m=r.hooks.postprocess(m)),m}catch(d){return c(d)}}},vo=function(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let a="<p>An error occurred:</p><pre>"+we(n.message+"",!0)+"</pre>";return t?Promise.resolve(a):a}if(t)return Promise.reject(n);throw n}};var Qe=new hn;function j(i,e){return Qe.parse(i,e)}j.options=j.setOptions=function(i){return Qe.setOptions(i),j.defaults=Qe.defaults,mo(j.defaults),j};j.getDefaults=gn;j.defaults=Ke;j.use=function(...i){return Qe.use(...i),j.defaults=Qe.defaults,mo(j.defaults),j};j.walkTokens=function(i,e){return Qe.walkTokens(i,e)};j.parseInline=Qe.parseInline;j.Parser=Pe;j.parser=Pe.parse;j.Renderer=dt;j.TextRenderer=_t;j.Lexer=De;j.lexer=De.lex;j.Tokenizer=ct;j.Hooks=Xe;j.parse=j;var Yi=j.options,Zi=j.setOptions,Vi=j.use,Xi=j.walkTokens,Qi=j.parseInline;var Ji=Pe.parse,Ki=De.lex;function ii(i,e){this.v=i,this.k=e}function So(i,e){(e==null||e>i.length)&&(e=i.length);for(var t=0,n=Array(e);t<e;t++)n[t]=i[t];return n}function si(i){if(Array.isArray(i))return i}function ai(i,e){var t=i==null?null:typeof Symbol!="undefined"&&i[Symbol.iterator]||i["@@iterator"];if(t!=null){var n,a,s,r,c=[],d=!0,m=!1;try{if(s=(t=t.call(i)).next,e===0){if(Object(t)!==t)return;d=!1}else for(;!(d=(n=s.call(t)).done)&&(c.push(n.value),c.length!==e);d=!0);}catch(g){m=!0,a=g}finally{try{if(!d&&t.return!=null&&(r=t.return(),Object(r)!==r))return}finally{if(m)throw a}}return c}}function li(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ci(i,e){return si(i)||ai(i,e)||di(i,e)||li()}function di(i,e){if(i){if(typeof i=="string")return So(i,e);var t={}.toString.call(i).slice(8,-1);return t==="Object"&&i.constructor&&(t=i.constructor.name),t==="Map"||t==="Set"?Array.from(i):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?So(i,e):void 0}}function Bt(i){var e,t;function n(s,r){try{var c=i[s](r),d=c.value,m=d instanceof ii;Promise.resolve(m?d.v:d).then(function(g){if(m){var y=s==="return"&&d.k?s:"next";if(!d.k||g.done)return n(y,g);g=i[y](g).value}a(!!c.done,g)},function(g){n("throw",g)})}catch(g){a(2,g)}}function a(s,r){s===2?e.reject(r):e.resolve({value:r,done:s}),(e=e.next)?n(e.key,e.arg):t=null}this._invoke=function(s,r){return new Promise(function(c,d){var m={key:s,arg:r,resolve:c,reject:d,next:null};t?t=t.next=m:(e=t=m,n(s,r))})},typeof i.return!="function"&&(this.return=void 0)}Bt.prototype[typeof Symbol=="function"&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},Bt.prototype.next=function(i){return this._invoke("next",i)},Bt.prototype.throw=function(i){return this._invoke("throw",i)},Bt.prototype.return=function(i){return this._invoke("return",i)};var Uo=Object.entries,Ao=Object.setPrototypeOf,pi=Object.isFrozen,Bo=Object.getPrototypeOf,qo=Object.getOwnPropertyDescriptor,ce=Object.freeze,ue=Object.seal,pt=Object.create,Wo=typeof Reflect!="undefined"&&Reflect,Nn=Wo.apply,Ln=Wo.construct;ce||(ce=function(e){return e});ue||(ue=function(e){return e});Nn||(Nn=function(e,t){for(var n=arguments.length,a=new Array(n>2?n-2:0),s=2;s<n;s++)a[s-2]=arguments[s];return e.apply(t,a)});Ln||(Ln=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return new e(...n)});var $e=ee(Array.prototype.forEach);Array.prototype.indexOf;var ui=ee(Array.prototype.lastIndexOf),Co=ee(Array.prototype.pop),St=ee(Array.prototype.push),fi=ee(Array.prototype.slice),hi=ee(Array.prototype.splice),ut=Array.isArray,Tn=jo(Set),_n=ee(Set.prototype.add),At=ee(Set.prototype.has),et=ee(String.prototype.toLowerCase),En=ee(String.prototype.toString),Ro=ee(String.prototype.match),Ct=ee(String.prototype.replace),Mo=ee(String.prototype.indexOf),mi=ee(String.prototype.trim),gi=ee(Number.prototype.toString),bi=ee(Boolean.prototype.toString),No=typeof BigInt=="undefined"?null:ee(BigInt.prototype.toString),Lo=typeof Symbol=="undefined"?null:ee(Symbol.prototype.toString),xe=ee(Object.prototype.hasOwnProperty),Rt=ee(Object.prototype.toString),pe=ee(RegExp.prototype.test),He=jo(TypeError);function ee(i){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return Nn(i,e,n)}}function jo(i){return function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return Ln(i,t)}}function U(i,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:et;if(Ao&&Ao(i,null),!ut(e))return i;let n=e.length;for(;n--;){let a=e[n];if(typeof a=="string"){let s=t(a);s!==a&&(pi(e)||(e[n]=s),a=s)}i[a]=!0}return i}function xi(i){for(let e=0;e<i.length;e++)xe(i,e)||(i[e]=null);return i}function Te(i){let e=pt(null);for(let n of Uo(i)){var t=ci(n,2);let a=t[0],s=t[1];xe(i,a)&&(ut(s)?e[a]=xi(s):s&&typeof s=="object"&&s.constructor===Object?e[a]=Te(s):e[a]=s)}return e}function ki(i){switch(typeof i){case"string":return i;case"number":return gi(i);case"boolean":return bi(i);case"bigint":return No?No(i):"0";case"symbol":return Lo?Lo(i):"Symbol()";case"undefined":return Rt(i);case"function":case"object":{if(i===null)return Rt(i);let e=i,t=Se(e,"toString");if(typeof t=="function"){let n=t(e);return typeof n=="string"?n:Rt(n)}return Rt(i)}default:return Rt(i)}}function Se(i,e){for(;i!==null;){let n=qo(i,e);if(n){if(n.get)return ee(n.get);if(typeof n.value=="function")return ee(n.value)}i=Bo(i)}function t(){return null}return t}function yi(i,e){for(;i!==null;){let t=qo(i,e);if(t)return t.get?ee(t.get):null;i=Bo(i)}return null}function wi(i){try{return pe(i,""),!0}catch(e){return!1}}var Oo=ce(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),vn=ce(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Sn=ce(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Ti=ce(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),An=ce(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),_i=ce(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Io=ce(["#text"]),zo=ce(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),Cn=ce(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Do=ce(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),qt=ce(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Ei=ue(/{{[\w\W]*|^[\w\W]*}}/g),vi=ue(/<%[\w\W]*|^[\w\W]*%>/g),Si=ue(/\${[\w\W]*/g),Ai=ue(/^data-[\-\w.\u00B7-\uFFFF]+$/),Ci=ue(/^aria-[\-\w]+$/),Po=ue(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ri=ue(/^(?:\w+script|data):/i),Mi=ue(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ni=ue(/^html$/i),Li=ue(/^[a-z][.\w]*(-[.\w]+)+$/i),Rn=ue(/<[/\w!]/g),$o=ue(/<[/\w]/g),Oi=ue(/<\/no(script|embed|frames)/i),Ho=ue(/\/>/i),se={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},Ii=ce(U({},["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"])),zi=function(){return typeof window=="undefined"?null:window},Di=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let n=null,a="data-tt-policy-suffix";t&&t.hasAttribute(a)&&(n=t.getAttribute(a));let s="dompurify"+(n?"#"+n:"");try{return e.createPolicy(s,{createHTML(r){return r},createScriptURL(r){return r}})}catch(r){return console.warn("TrustedTypes policy "+s+" could not be created."),null}},Fo=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},We=function(e,t,n,a){return xe(e,t)&&ut(e[t])?U(a.base?Te(a.base):{},e[t],a.transform):n},Mn=function(e,t,n){let a=xe(e,t)?e[t]:void 0;return a&&typeof a=="object"?Te(a):n()};function Go(){let i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:zi(),e=h=>Go(h);if(e.version="3.4.17",e.removed=[],!i||!i.document||i.document.nodeType!==se.document||!i.Element)return e.isSupported=!1,e;let t=i.document,n=t,a=n.currentScript;i.DocumentFragment;let s=i.HTMLTemplateElement,r=i.Node,c=i.Element,d=i.NodeFilter;i.NamedNodeMap===void 0&&(i.NamedNodeMap||i.MozNamedAttrMap),i.HTMLFormElement;let m=i.DOMParser,g=i.trustedTypes,y=c.prototype,w=Se(y,"cloneNode"),_=Se(y,"remove"),B=Se(y,"removeAttributeNode"),M=Se(y,"nextSibling"),O=Se(y,"childNodes"),z=Se(y,"parentNode"),de=Se(y,"shadowRoot"),D=Se(y,"attributes"),q=r&&r.prototype?Se(r.prototype,"nodeType"):null,V=r&&r.prototype?Se(r.prototype,"nodeName"):null,fe=r&&r.prototype?Se(r.prototype,"ownerDocument"):null,P=function(o){return q?q(o):o.nodeType},G=function(o){return V?V(o):o.nodeName},_e=yi(y,"namespaceURI"),Fe=function(o){return _e?_e(o):o.namespaceURI};if(typeof s=="function"){let h=t.createElement("template");h.content&&h.content.ownerDocument&&(t=h.content.ownerDocument)}let re,ke="",tt,je=!1,Ie=0,Ee=function(){if(Ie>0)throw He('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},Ne=function(o){Ee(),Ie++;try{return re.createHTML(o)}finally{Ie--}},Yt=function(o){Ee(),Ie++;try{return re.createScriptURL(o)}finally{Ie--}},ht=function(){return je||(tt=Di(g,a),je=!0),tt},Ge=t,Ye=Ge.implementation,ze=Ge.createNodeIterator,Ue=Ge.createDocumentFragment,ve=Ge.getElementsByTagName,nt=n.importNode,F=Fo();e.isSupported=typeof Uo=="function"&&typeof z=="function"&&Ye&&Ye.createHTMLDocument!==void 0;let Zt=Ei,mt=vi,Mt=Si,Vt=Ai,gt=Ci,bt=Ri,p=Mi,b=Li,x=Po,k=null,v=U({},[...Oo,...vn,...Sn,...An,...Io]),E=null,R=U({},[...zo,...Cn,...Do,...qt]),C=Object.seal(pt(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),A=null,J=null,I=Object.seal(pt(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),X=!0,ne=!0,he=!1,ye=!0,oe=!1,$=!0,W=!1,Y=!1,K=null,L=null,te=!1,H=!1,le=!1,Nt=!1,Pn=!0,$n=!1,Hn="user-content-",Xt=!0,Qt=!1,Ze=null,ot={},Ve=null,Fn=U({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]),Un=null,Bn=U({},["audio","video","img","source","image","track"]),qn=null,Wn=U({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Lt="http://www.w3.org/1998/Math/MathML",Ot="http://www.w3.org/2000/svg",Le="http://www.w3.org/1999/xhtml",rt=Le,Jt=!1,Kt=null,nr=U({},[Lt,Ot,Le],En),jn=ce(["mi","mo","mn","ms","mtext"]),en=U({},jn),Gn=ce(["annotation-xml"]),tn=U({},Gn),or=U({},["title","style","font","a","script"]),xt=null,rr=["application/xhtml+xml","text/html"],ir="text/html",ie=null,it=null,sr=t.createElement("form"),Yn=function(o){return o instanceof RegExp||o instanceof Function},nn=function(){let o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(it&&it===o)return;(!o||typeof o!="object")&&(o={}),o=Te(o),xt=rr.indexOf(o.PARSER_MEDIA_TYPE)===-1?ir:o.PARSER_MEDIA_TYPE,ie=xt==="application/xhtml+xml"?En:et,k=We(o,"ALLOWED_TAGS",v,{transform:ie}),E=We(o,"ALLOWED_ATTR",R,{transform:ie}),Kt=We(o,"ALLOWED_NAMESPACES",nr,{transform:En}),qn=We(o,"ADD_URI_SAFE_ATTR",Wn,{transform:ie,base:Wn}),Un=We(o,"ADD_DATA_URI_TAGS",Bn,{transform:ie,base:Bn}),Ve=We(o,"FORBID_CONTENTS",Fn,{transform:ie}),A=We(o,"FORBID_TAGS",Te({}),{transform:ie}),J=We(o,"FORBID_ATTR",Te({}),{transform:ie}),ot=xe(o,"USE_PROFILES")?o.USE_PROFILES&&typeof o.USE_PROFILES=="object"?Te(o.USE_PROFILES):o.USE_PROFILES:!1,X=o.ALLOW_ARIA_ATTR!==!1,ne=o.ALLOW_DATA_ATTR!==!1,he=o.ALLOW_UNKNOWN_PROTOCOLS||!1,ye=o.ALLOW_SELF_CLOSE_IN_ATTR!==!1,oe=o.SAFE_FOR_TEMPLATES||!1,$=o.SAFE_FOR_XML!==!1,W=o.WHOLE_DOCUMENT||!1,H=o.RETURN_DOM||!1,le=o.RETURN_DOM_FRAGMENT||!1,Nt=o.RETURN_TRUSTED_TYPE||!1,te=o.FORCE_BODY||!1,Pn=o.SANITIZE_DOM!==!1,$n=o.SANITIZE_NAMED_PROPS||!1,Xt=o.KEEP_CONTENT!==!1,Qt=o.IN_PLACE||!1,x=wi(o.ALLOWED_URI_REGEXP)?o.ALLOWED_URI_REGEXP:Po,rt=typeof o.NAMESPACE=="string"?o.NAMESPACE:Le,en=Mn(o,"MATHML_TEXT_INTEGRATION_POINTS",()=>U({},jn)),tn=Mn(o,"HTML_INTEGRATION_POINTS",()=>U({},Gn));let l=Mn(o,"CUSTOM_ELEMENT_HANDLING",()=>pt(null));if(C=pt(null),xe(l,"tagNameCheck")&&Yn(l.tagNameCheck)&&(C.tagNameCheck=l.tagNameCheck),xe(l,"attributeNameCheck")&&Yn(l.attributeNameCheck)&&(C.attributeNameCheck=l.attributeNameCheck),xe(l,"allowCustomizedBuiltInElements")&&typeof l.allowCustomizedBuiltInElements=="boolean"&&(C.allowCustomizedBuiltInElements=l.allowCustomizedBuiltInElements),ue(C),oe&&(ne=!1),le&&(H=!0),ot&&(k=U({},Io),E=pt(null),ot.html===!0&&(U(k,Oo),U(E,zo)),ot.svg===!0&&(U(k,vn),U(E,Cn),U(E,qt)),ot.svgFilters===!0&&(U(k,Sn),U(E,Cn),U(E,qt)),ot.mathMl===!0&&(U(k,An),U(E,Do),U(E,qt))),I.tagCheck=null,I.attributeCheck=null,xe(o,"ADD_TAGS")&&(typeof o.ADD_TAGS=="function"?I.tagCheck=o.ADD_TAGS:ut(o.ADD_TAGS)&&(k===v&&(k=Te(k)),U(k,o.ADD_TAGS,ie))),xe(o,"ADD_ATTR")&&(typeof o.ADD_ATTR=="function"?I.attributeCheck=o.ADD_ATTR:ut(o.ADD_ATTR)&&(E===R&&(E=Te(E)),U(E,o.ADD_ATTR,ie))),xe(o,"ADD_FORBID_CONTENTS")&&ut(o.ADD_FORBID_CONTENTS)&&(Ve===Fn&&(Ve=Te(Ve)),U(Ve,o.ADD_FORBID_CONTENTS,ie)),Xt&&(k["#text"]=!0),W&&U(k,["html","head","body"]),k.table&&(U(k,["tbody"]),delete A.tbody),o.TRUSTED_TYPES_POLICY){if(typeof o.TRUSTED_TYPES_POLICY.createHTML!="function")throw He('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof o.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw He('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');let u=re;re=o.TRUSTED_TYPES_POLICY;try{ke=Ne("")}catch(f){throw re=u,f}}else o.TRUSTED_TYPES_POLICY===null?(re=void 0,ke=""):(re===void 0&&(re=ht()),re&&typeof ke=="string"&&(ke=Ne("")));ce&&ce(o),it=o},Zn=U({},[...vn,...Sn,...Ti]),Vn=U({},[...An,..._i]),ar=function(o,l,u){return l.namespaceURI===Le?o==="svg":l.namespaceURI===Lt?o==="svg"&&(u==="annotation-xml"||en[u]):!!Zn[o]},lr=function(o,l,u){return l.namespaceURI===Le?o==="math":l.namespaceURI===Ot?o==="math"&&tn[u]:!!Vn[o]},cr=function(o,l,u){return l.namespaceURI===Ot&&!tn[u]||l.namespaceURI===Lt&&!en[u]?!1:!Vn[o]&&(or[o]||!Zn[o])},dr=function(o){let l=Fe(o),u=et(G(o)),f=z(o),T,S;return f&&P(f)===se.element?(T={namespaceURI:Fe(f)},S=et(G(f))):(T={namespaceURI:rt},S="template"),Kt[l]?l===Ot?ar(u,T,S):l===Lt?lr(u,T,S):l===Le?cr(u,T,S):!!(xt==="application/xhtml+xml"&&Kt[l]):!1},Be=function(o){St(e.removed,{element:o});try{z(o).removeChild(o)}catch(l){if(_(o),!z(o))throw He("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},Xn=function(o,l,u){try{B(o,l)}catch(f){try{o.removeAttribute(u)}catch(T){}}},on=function(o){sn(o);let l=O(o);l&&$e(fi(l),f=>{try{_(f)}catch(T){}});let u=P(o)===se.element?D(o):null;if(u)for(let f=u.length-1;f>=0;--f){let T=u[f],S=T&&T.name;typeof S=="string"&&Xn(o,T,S)}},st=function(o,l,u){if(!u)try{u=l.getAttributeNode(o)}catch(f){u=null}St(e.removed,{attribute:u||null,from:l});try{u?B(l,u):l.removeAttribute(o)}catch(f){try{l.removeAttribute(o)}catch(T){}}if(o==="is")if(H||le)try{Be(l)}catch(f){}else try{l.setAttribute(o,"")}catch(f){}},Qn=function(o){let l=D(o);if(l)for(let u=l.length-1;u>=0;--u){let f=l[u],T=f&&f.name;typeof T!="string"||E[ie(T)]||Xn(o,f,T)}},rn=function(o,l){let u=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,f=[o];for(;f.length>0;){let T=f.pop();if(l(T)===!1)continue;if(u&&P(T)===se.element){let N=de(T);qe(N)&&f.push(N)}let S=O(T);if(S)for(let N=S.length-1;N>=0;--N)f.push(S[N])}},sn=function(o){rn(o,l=>{P(l)===se.element&&Qn(l)})},an=function(o){let l=[];return rn(o,u=>{l.push(u)},!0),l},pr=function(o,l){let u=Tn();$e(an(o),f=>{P(f)===se.element&&_n(u,f)}),$e(l,f=>{P(f)===se.element&&!At(u,f)&&Qn(f)})},Jn=function(o,l){let u=!1;return $e(e.removed,f=>{f.element&&(u=u||f.element===o,sn(f.element))}),pr(o,l),u},ur=8,fr=function(o,l){let u=Ze,f=null,T=()=>(f||(f=Tn(),$e(l,S=>{_n(f,S)})),f);for(let S=0;;S++){let N=an(o),ae=[o],Oe=!1;if($e(N,me=>{P(me)===se.documentFragment?St(ae,me):!Oe&&!At(u,me)&&(Oe=At(T(),me))}),!Oe)return;if(S>=ur)throw He("the tree kept changing during in-place sanitization; refusing to return it");$e(ae,(me,ge)=>{hr(me,ge>0,o,T())})}},hr=function(o,l,u,f){let T=ln(o),S;for(;S=T.nextNode();)!At(f,S)||At(Ze,S)||(l&&Re(F.uponSanitizeShadowNode,S,null),dn(S,u),pn(S,u),qe(S.content)&&yt(S.content))},mr=function(o){Ze&&_n(Ze,o)},Kn=function(o,l){return $?o==="patchsrc"?!0:o==="for"&&l!=="label"&&l!=="output":!1},gr=function(o){$&&rn(o,l=>{let u=P(l);if(u===se.processingInstruction||u===se.comment&&pe($o,l.data)){try{_(l)}catch(f){}return!1}if(u===se.element){let f=l,T=ie(G(l));try{f.hasAttribute&&f.hasAttribute("patchsrc")&&f.removeAttribute("patchsrc"),f.hasAttribute&&f.hasAttribute("for")&&Kn("for",T)&&f.removeAttribute("for")}catch(S){}}return!0})},eo=function(o){let l=null,u=null;if(te)o="<remove></remove>"+o;else{let S=Ro(o,/^[\r\n\t ]+/);u=S&&S[0]}xt==="application/xhtml+xml"&&rt===Le&&(o='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+o+"</body></html>");let f=re?Ne(o):o;if(rt===Le)try{l=new m().parseFromString(f,xt)}catch(S){}if(!l||!l.documentElement){l=Ye.createDocument(rt,"template",null);try{l.documentElement.innerHTML=Jt?ke:f}catch(S){}}let T=l.body||l.documentElement;return o&&u&&T.insertBefore(t.createTextNode(u),T.childNodes[0]||null),rt===Le?ve.call(l,W?"html":"body")[0]:W?l.documentElement:T},ln=function(o){let l=fe?fe(o):o.ownerDocument;return ze.call(l||o,o,d.SHOW_ELEMENT|d.SHOW_COMMENT|d.SHOW_TEXT|d.SHOW_PROCESSING_INSTRUCTION|d.SHOW_CDATA_SECTION,null)},It=function(o){return o=Ct(o,Zt," "),o=Ct(o,mt," "),o=Ct(o,Mt," "),o},cn=function(o){var l;to(o);let u=(l=o.querySelectorAll)===null||l===void 0?void 0:l.call(o,"template");u&&$e(u,f=>{qe(f.content)&&cn(f.content)})},to=function(o){o.normalize();let l=fe?fe(o):o.ownerDocument,u=ze.call(l||o,o,d.SHOW_TEXT|d.SHOW_COMMENT|d.SHOW_CDATA_SECTION|d.SHOW_PROCESSING_INSTRUCTION,null),f=u.nextNode();for(;f;)f.data=It(f.data),f=u.nextNode()},zt=function(o){let l=V?V(o):null;return typeof l!="string"||ie(l)!=="form"?!1:typeof o.nodeName!="string"||typeof o.textContent!="string"||typeof o.removeChild!="function"||o.attributes!==D(o)||typeof o.removeAttribute!="function"||typeof o.removeAttributeNode!="function"||typeof o.getAttributeNode!="function"||typeof o.setAttribute!="function"||typeof o.namespaceURI!="string"||typeof o.insertBefore!="function"||typeof o.hasChildNodes!="function"||o.nodeType!==q(o)||o.childNodes!==O(o)},qe=function(o){if(!q||typeof o!="object"||o===null)return!1;try{return q(o)===se.documentFragment}catch(l){return!1}},kt=function(o){if(!q||typeof o!="object"||o===null)return!1;try{return typeof q(o)=="number"}catch(l){return!1}};function Re(h,o,l){h.length!==0&&$e(h,u=>{u.call(e,o,l,it)})}let br=function(o,l){return!!($&&o.hasChildNodes()&&!kt(o.firstElementChild)&&pe(Rn,o.textContent)&&pe(Rn,o.innerHTML)||$&&Ii[l]&&P(o)===se.element&&Fe(o)===Le&&(kt(o.firstElementChild)||typeof o.textContent=="string"&&pe(Rn,o.textContent))||o.nodeType===se.processingInstruction||$&&o.nodeType===se.comment&&pe($o,o.data))},Dt=function(o,l){if(o instanceof RegExp)return pe(o,l);if(o instanceof Function){for(var u=arguments.length,f=new Array(u>2?u-2:0),T=2;T<u;T++)f[T-2]=arguments[T];return!!o(l,...f)}return!1},xr=function(o,l,u){if(!A[l]&&ro(l)&&Dt(C.tagNameCheck,l))return!1;if(Xt&&!Ve[l]&&!Ve[et(l)]){let f=z(o),T=O(o);if(T&&f){let S=T.length;for(let N=S-1;N>=0;--N){let ae=o===u?w(T[N],!0):T[N];f.insertBefore(ae,M(o))}}}return Be(o),!0},no=function(o,l,u,f){return o.length===0?l:l===u||l===f?Te(l):l},at=function(o,l){return o===l||z(o)!==null?!1:(Qt&&sn(o),!0)},dn=function(o,l){if(mr(o),Re(F.beforeSanitizeElements,o,null),at(o,l))return!0;if(zt(o))return Be(o),!0;let u=ie(G(o));if(k=no(F.uponSanitizeElement,k,v,K),Re(F.uponSanitizeElement,o,{tagName:u,allowedTags:k}),at(o,l))return!0;if(br(o,u))return Be(o),!0;if(A[u]||!(I.tagCheck instanceof Function&&I.tagCheck(u))&&!k[u]){let f=xr(o,u,l);return f===!1&&(Re(F.afterSanitizeElements,o,null),at(o,l))?!0:f}if(P(o)===se.element&&!dr(o)||(u==="noscript"||u==="noembed"||u==="noframes")&&pe(Oi,o.innerHTML))return Be(o),!0;if(oe&&o.nodeType===se.text){let f=It(o.textContent);o.textContent!==f&&(St(e.removed,{element:o.cloneNode()}),o.textContent=f)}return Re(F.afterSanitizeElements,o,null),at(o,l)},oo=function(o,l,u){if(J[l]||Kn(l,o)||Pn&&(l==="id"||l==="name")&&(u in t||u in sr))return!1;let f=E[l]||I.attributeCheck instanceof Function&&I.attributeCheck(l,o);return ne&&pe(Vt,l)||X&&pe(gt,l)?!0:f?qn[l]||pe(x,Ct(u,p,""))||(l==="src"||l==="xlink:href"||l==="href")&&o!=="script"&&Mo(u,"data:")===0&&Un[o]||he&&!pe(bt,Ct(u,p,""))?!0:!u:ro(o)&&Dt(C.tagNameCheck,o)&&Dt(C.attributeNameCheck,l,o)||l==="is"&&C.allowCustomizedBuiltInElements&&Dt(C.tagNameCheck,u)},kr=U({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),ro=function(o){return!kr[et(o)]&&pe(b,o)},yr=function(o,l,u,f){if(re&&typeof g=="object"&&typeof g.getAttributeType=="function"&&!u)switch(g.getAttributeType(o,l)){case"TrustedHTML":return Ne(f);case"TrustedScriptURL":return Yt(f)}return f},wr=function(o,l,u,f){try{return u?o.setAttributeNS(u,l,f):o.setAttribute(l,f),zt(o)?(Be(o),!1):!0}catch(T){return st(l,o),!1}},io=function(o,l){return $&&pe(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,l)?!0:et(o)==="attributename"&&Ro(l,"href")!==null},pn=function(o,l){if(Re(F.beforeSanitizeAttributes,o,null),at(o,l))return;let u=o.attributes;if(!u||zt(o))return;E=no(F.uponSanitizeAttribute,E,R,L);let f={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:E,forceKeepAttr:void 0},T=u.length,S=ie(o.nodeName);for(;T--;){let N=u[T],ae=N.name,Oe=N.namespaceURI,me=N.value,ge=ie(ae),lt=me,be=ae==="value"?lt:mi(lt),so=!1;if(f.attrName=ge,f.attrValue=be,f.keepAttr=!0,f.forceKeepAttr=void 0,Re(F.uponSanitizeAttribute,o,f),be=f.attrValue,$n&&(ge==="id"||ge==="name")&&Mo(be,Hn)!==0&&(st(ae,o,N),be=Hn+be,so=!0),io(ae,be)){st(ae,o,N);continue}if(!f.forceKeepAttr){if(!f.keepAttr){st(ae,o,N);continue}if(!ye&&pe(Ho,be)){st(ae,o,N);continue}if(oe&&(be=It(be)),!oo(S,ge,be)){st(ae,o,N);continue}be=yr(S,ge,Oe,be),be!==lt&&wr(o,ae,Oe,be)&&so&&Co(e.removed)}}Re(F.afterSanitizeAttributes,o,null),at(o,l)},yt=function(o){let l=null,u=ln(o);for(Re(F.beforeSanitizeShadowDOM,o,null);l=u.nextNode();)if(Re(F.uponSanitizeShadowNode,l,null),dn(l,o),pn(l,o),qe(l.content)&&yt(l.content),P(l)===se.element){let f=de(l);qe(f)&&(un(f),yt(f))}oe&&to(o),Re(F.afterSanitizeShadowDOM,o,null)},un=function(o){let l=[{node:o,shadow:null}];for(;l.length>0;){let u=l.pop();if(u.shadow){yt(u.shadow);continue}let f=u.node,T=P(f)===se.element,S=O(f);if(S)for(let N=S.length-1;N>=0;--N)l.push({node:S[N],shadow:null});if(T){let N=V?V(f):null;if(typeof N=="string"&&ie(N)==="template"){let ae=f.content;qe(ae)&&l.push({node:ae,shadow:null})}}if(T){let N=de(f);qe(N)&&l.push({node:null,shadow:N},{node:N,shadow:null})}}};return e.sanitize=function(h){let o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},l=null,u=null,f=null,T=null;if(Jt=!h,Jt&&(h="<!-->"),typeof h!="string"&&!kt(h)&&(h=ki(h),typeof h!="string"))throw He("dirty is not a string, aborting");if(!e.isSupported)return h;Y?(k=K,E=L):nn(o),(F.uponSanitizeElement.length>0||F.uponSanitizeAttribute.length>0)&&(k=Te(k)),F.uponSanitizeAttribute.length>0&&(E=Te(E)),e.removed=[];let S=Qt&&typeof h!="string"&&kt(h),N=[],ae=Ze;if(S){gr(h);let ge=G(h);if(typeof ge=="string"){let lt=ie(ge);if(!k[lt]||A[lt])throw on(h),He("root node is forbidden and cannot be sanitized in-place")}if(zt(h))throw on(h),He("root node is clobbered and cannot be sanitized in-place");N=an(h),Ze=Tn()}else if(kt(h))l=eo("<!---->"),u=l.ownerDocument.importNode(h,!0),u.nodeType===se.element&&u.nodeName==="BODY"||u.nodeName==="HTML"?l=u:l.appendChild(u),un(l);else{if(!H&&!oe&&!W&&h.indexOf("<")===-1)return re&&Nt?Ne(h):h;if(l=eo(h),!l)return H?null:Nt?ke:""}l&&te&&Be(l.firstChild);let Oe=S?h:l;try{S&&un(h);let ge=ln(Oe);for(;f=ge.nextNode();)dn(f,Oe),pn(f,Oe),qe(f.content)&&yt(f.content);S&&fr(h,N)}catch(ge){throw S&&(on(h),Jn(h,N)),ge}finally{Ze=ae}if(S){if(Jn(h,N))throw He("a node selected for removal could not be safely returned; refusing to sanitize in place");return oe&&cn(h),h}if(H){if(oe&&cn(l),le)for(T=Ue.call(l.ownerDocument);l.firstChild;)T.appendChild(l.firstChild);else T=l;return(E.shadowroot||E.shadowrootmode)&&(T=nt.call(n,T,!0)),T}let me=W?l.outerHTML:l.innerHTML;return W&&k["!doctype"]&&l.ownerDocument&&l.ownerDocument.doctype&&l.ownerDocument.doctype.name&&pe(Ni,l.ownerDocument.doctype.name)&&(me="<!DOCTYPE "+l.ownerDocument.doctype.name+`>
`+me),oe&&(me=It(me)),re&&Nt?Ne(me):me},e.setConfig=function(){let h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};nn(h),Y=!0,K=k,L=E},e.clearConfig=function(){it=null,Y=!1,K=null,L=null,re=tt,ke=""},e.isValidAttribute=function(h,o,l){it||nn({});let u=ie(h),f=ie(o);return typeof l=="string"&&(io(o,l)||!ye&&pe(Ho,l))?!1:oo(u,f,l)},e.addHook=function(h,o){typeof o=="function"&&xe(F,h)&&St(F[h],o)},e.removeHook=function(h,o){if(xe(F,h)){if(o!==void 0){let l=ui(F[h],o);return l===-1?void 0:hi(F[h],l,1)[0]}return Co(F[h])}},e.removeHooks=function(h){xe(F,h)&&(F[h]=[])},e.removeAllHooks=function(){F=Fo()},e}var Yo=Go();async function Pi(i){try{let e=typeof i=="function"?await i():await i;return e&&typeof e=="object"?e:{}}catch(e){return{}}}function On(i,e){"use strict";e=e||{};let t=(e.base!==void 0?e.base:location.pathname.replace(/[^/]*$/,"")).replace(/\/$/,""),n=e.color||e.primaryColor;n&&(i.style.setProperty("--c-brand",n),i.style.setProperty("--primary",n),i.style.setProperty("--c-brand-strong",n),i.style.setProperty("--primary-hover",n));let a=document.createElement("div");a.className="widget-header";let s=document.createElement("h1");s.textContent=e.title||"AI \u6570\u636E\u52A9\u624B";let r=document.createElement("span");r.className="status",r.id="chat-status";let c=document.createElement("div");c.className="header-actions";let d=!1,m=document.createElement("button");m.type="button",m.className="header-action-btn",m.title="\u6700\u5927\u5316 / \u8FD8\u539F",m.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';function g(p){d=p,d?(m.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></svg>',m.title="\u8FD8\u539F\u7A97\u53E3"):(m.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',m.title="\u6700\u5927\u5316\u7A97\u53E3")}m.addEventListener("click",()=>{g(!d),window.parent.postMessage({type:"dq-toggle-maximize",maximized:d},"*")}),a.addEventListener("dblclick",p=>{p.target.closest("button")||m.click()});let y=document.createElement("button");y.type="button",y.className="header-action-btn",y.title="\u5173\u95ED",y.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',y.addEventListener("click",()=>{window.parent.postMessage({type:"dq-close"},"*")});let w=document.createElement("button");w.type="button",w.className="new-chat-btn",w.title="\u65B0\u5EFA\u5BF9\u8BDD\uFF08\u6E05\u7A7A\u5F53\u524D\u4E0A\u4E0B\u6587\uFF09";let _=document.createElement("span");_.className="new-chat-icon",_.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';let B=document.createElement("span");B.textContent="\u65B0\u5BF9\u8BDD",w.append(_,B),w.addEventListener("click",()=>{mt(),ve.length=0,M.replaceChildren(),M.appendChild(O),P.value="",r.textContent="",P.focus()}),c.append(w),e.inline||c.append(m,y),a.append(s,r,c);let M=document.createElement("div");M.className="chat-messages";let O=document.createElement("div");O.className="welcome";let z=document.createElement("p");z.className="welcome-title",z.textContent="\u4F60\u597D\uFF0C\u6211\u662F "+(e.title||"AI \u6570\u636E\u52A9\u624B");let de=document.createElement("p");de.textContent="\u57FA\u4E8E\u5143\u6570\u636E\u5411\u6211\u63D0\u95EE\u5373\u53EF\u67E5\u6570\u4E0E\u51FA\u56FE";let D=document.createElement("div");D.className="examples";let q=["\u7EDF\u8BA1\u5404\u72B6\u6001\u6570\u91CF\u5206\u5E03","\u67E5\u8BE2\u6700\u8FD1\u65B0\u589E\u768410\u6761\u6570\u636E","\u6309\u7C7B\u522B\u6C47\u603B\u5360\u6BD4\uFF0C\u7ED9\u4E2A\u997C\u56FE"];(Array.isArray(e.examples)&&e.examples.length?e.examples:typeof e.examples=="string"&&e.examples?e.examples.split(",").map(p=>p.trim()):q).forEach(p=>{let b=document.createElement("button");b.type="button",b.className="example-btn";let x=document.createElement("span");x.className="example-bullet";let k=document.createElement("span");k.textContent=p,b.append(x,k),D.appendChild(b)}),O.append(z,de,D),M.appendChild(O);let fe=document.createElement("div");fe.className="input-row";let P=document.createElement("textarea");P.rows=1,P.placeholder="\u63D0\u95EE\uFF0CEnter \u53D1\u9001";let G=document.createElement("button");G.type="button",G.className="send-btn",G.textContent="\u53D1\u9001",fe.append(P,G),i.append(a,M,fe),window.marked&&window.marked.setOptions({breaks:!0});function _e(p){if(!window.marked)return null;try{let b=window.marked.parse(p||"");return window.DOMPurify?window.DOMPurify.sanitize(b):b}catch(b){return null}}function Fe(p,b){let x=[],k=/```(?:render|json)\s*\n([\s\S]*?)```/g,v=0,E;for(;(E=k.exec(p))!==null;){let A=p.slice(v,E.index);A.trim()&&x.push({kind:"md",text:A});let J=E[1].trim();if(J.startsWith("{")&&J.includes('"type"'))try{x.push({kind:"render",data:JSON.parse(J)})}catch(I){x.push({kind:"md",text:E[0]})}else x.push({kind:"md",text:E[0]});v=k.lastIndex}let R=p.slice(v),C=R.match(/```(?:render|json)\s*\n([\s\S]*)$/);if(C){let A=R.slice(0,C.index);A.trim()&&x.push({kind:"md",text:A}),b?x.push({kind:"loading"}):x.push({kind:"md",text:R.slice(C.index)})}else R.trim()&&x.push({kind:"md",text:R});return x}function re(p){p&&p._slots&&p._slots.placeholder&&(p._slots.placeholder.remove(),p._slots.placeholder=null)}function ke(p,b){let x=document.createElement("div");if(x.className="msg "+p,p==="assistant"){let k=document.createElement("div");k.className="thinking-init-placeholder",k.innerHTML='<span class="think-spinner"></span><span class="thinking-label">\u6B63\u5728\u601D\u8003\u2026</span>';let v=document.createElement("div");v.className="ai-slot-think";let E=document.createElement("div");E.className="ai-slot-tools";let R=document.createElement("div");R.className="ai-slot-content",x.append(k,v,E,R),x._slots={placeholder:k,thinkSlot:v,toolsSlot:E,contentSlot:R},x._state={thinking:{text:"",startedAt:0,done:!1,durationMs:0,open:!0,userTouched:!1},tools:{calls:[],openStates:{}},content:{text:""}},b&&(re(x),x._state.content.text=b,Ne(x,!1))}else x.textContent=b||"";return M.appendChild(x),M.scrollTop=M.scrollHeight,x}function tt(p){if(p==null||p==="")return"(\u7A7A)";if(typeof p=="string")try{let b=JSON.parse(p);return JSON.stringify(b,null,2)}catch(b){return p}try{return JSON.stringify(p,null,2)}catch(b){return String(p)}}function je(p){if(!p._slots||!p._state)return;let{thinkSlot:b}=p._slots,x=p._state.thinking;if(!x.text){b.innerHTML="";return}let k=b.querySelector(".think");k||(k=document.createElement("div"),b.appendChild(k)),k.className="think"+(x.done?" is-done":" is-streaming")+(x.open?" is-open":"");let v=Math.max(0,Math.round((x.durationMs||0)/100)/10).toFixed(1).replace(/\.0$/,""),E=x.done?x.durationMs>0&&v!=="0"?`\u5DF2\u6DF1\u5EA6\u601D\u8003 \xB7 ${v}\u79D2`:"\u5DF2\u6DF1\u5EA6\u601D\u8003":x.durationMs>=800?`\u6DF1\u5EA6\u601D\u8003\u4E2D \xB7 ${v}\u79D2`:"\u6DF1\u5EA6\u601D\u8003\u4E2D\u2026",R=k.querySelector(".think-head");R||(R=document.createElement("button"),R.type="button",R.className="think-head",R.innerHTML=`
        <svg class="think-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span class="think-spinner"></span>
        <span class="think-label"></span>
      `,R.addEventListener("click",()=>{x.userTouched=!0,x.open=!x.open,je(p)}),k.appendChild(R));let C=R.querySelector(".think-chevron");C&&(x.open?C.classList.add("rotated"):C.classList.remove("rotated"));let A=R.querySelector(".think-spinner");A&&(A.style.display=x.done?"none":"inline-block");let J=R.querySelector(".think-label");J&&(J.textContent=E);let I=k.querySelector(".think-body-wrapper");if(!I){I=document.createElement("div"),I.className="think-body-wrapper";let ne=document.createElement("div");ne.className="think-inner";let he=document.createElement("div");he.className="think-body",ne.appendChild(he),I.appendChild(ne),k.appendChild(I)}I.className="think-body-wrapper"+(x.open?" is-open":"");let X=I.querySelector(".think-body");X.textContent=x.text,!x.done&&x.open&&(X.scrollTop=X.scrollHeight)}function Ie(p,b,x,k){let v=document.createElement("div"),E=!!x.openStates[b];v.className=`tool-call-card is-${p.status} ${E?"is-open":""}`;let R=document.createElement("div");R.className="tool-call-summary";let C=document.createElement("span");C.className=`tool-call-arrow ${E?"rotated":""}`,C.textContent="\u203A";let A=document.createElement("span");A.className="tool-call-icon",p.status==="running"?(A.className+=" is-spinning",A.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'):p.status==="ok"?A.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':p.status==="fail"?A.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>':A.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';let J=document.createElement("span");J.className="tool-call-main";let I=document.createElement("span");I.className="tool-call-name",I.textContent=p.name||"\u5DE5\u5177\u8C03\u7528";let X=document.createElement("span");if(X.className="tool-call-status-wrapper",p.durationMs!=null&&p.durationMs>0){let $=document.createElement("span");$.className="tool-call-duration",$.textContent=p.durationMs<1e3?`${Math.round(p.durationMs)}ms`:`${(p.durationMs/1e3).toFixed(1)}s`,X.appendChild($)}let ne=document.createElement("span");ne.className="tool-call-status",ne.textContent=p.status==="running"?"\u8FD0\u884C\u4E2D\u2026":p.status==="ok"?"\u5B8C\u6210":"\u8C03\u7528\u5931\u8D25",X.appendChild(ne),J.append(I,X),R.append(C,A,J),R.addEventListener("click",$=>{$.stopPropagation(),x.openStates[b]=!E,x._structureDirty=!0,Ee(k)});let he=document.createElement("div");he.className=`tool-call-body-wrapper ${E?"is-open":""}`;let ye=document.createElement("div");ye.className="tool-call-body";let oe=document.createElement("div");if(oe.className="tool-call-inner",p.args!=null&&p.args!==""){let $=document.createElement("div");$.className="tool-call-field",$.innerHTML='<span class="tool-call-label">\u53C2\u6570</span>';let W=document.createElement("pre");W.textContent=tt(p.args),$.appendChild(W),oe.appendChild($)}if(p.result!=null&&p.result!==""){let $=document.createElement("div");$.className="tool-call-field",$.innerHTML=`<span class="tool-call-label">${p.status==="fail"?"\u9519\u8BEF":"\u8FD4\u56DE"}</span>`;let W=document.createElement("pre");W.textContent=tt(p.result),$.appendChild(W),oe.appendChild($)}return ye.appendChild(oe),he.appendChild(ye),v.append(R,he),v}function Ee(p){if(!p._slots||!p._state)return;let{toolsSlot:b}=p._slots,x=p._state.tools;if(!x.calls||x.calls.length===0){b.innerHTML="";return}let k=b.querySelector(".tool-call-list");k||(k=document.createElement("div"),k.className="tool-call-list",b.appendChild(k));let v=x.calls.length,E=k.querySelectorAll(".tool-call-card");if(E.length===v&&!x._structureDirty){x.calls.forEach((W,Y)=>{let K=E[Y];if(!K)return;let L=K.querySelector(".tool-call-duration");L&&W.durationMs>0&&(L.textContent=W.durationMs<1e3?`${Math.round(W.durationMs)}ms`:`${(W.durationMs/1e3).toFixed(1)}s`);let te=K.querySelector(".tool-call-status");te&&(te.textContent=W.status==="running"?"\u8FD0\u884C\u4E2D\u2026":W.status==="ok"?"\u5B8C\u6210":"\u8C03\u7528\u5931\u8D25")});return}if(x._structureDirty=!1,k.innerHTML="",v<=1){k.appendChild(Ie(x.calls[0],0,x,p));return}let R=x.calls.slice(0,v-1),C=x.calls[v-1],A=document.createElement("div");A.className="tool-history-group";let J=!!x.historyOpen,I=document.createElement("button");I.type="button",I.className="tool-history-head",I.addEventListener("click",()=>{x.historyOpen=!J,x._structureDirty=!0,Ee(p)});let X=document.createElement("span");X.className=`tool-history-arrow ${J?"rotated":""}`,X.textContent="\u203A";let ne=document.createElement("span");ne.className="tool-history-label";let he=document.createElement("span");he.className="tool-history-tag",he.textContent=R.length;let ye=document.createElement("span");ye.textContent="\u4E2A\u5DF2\u5B8C\u6210\u524D\u5E8F\u5DE5\u5177\u8C03\u7528",ne.append(X,he,ye),I.appendChild(ne),A.appendChild(I);let oe=document.createElement("div");oe.className=`tool-history-body ${J?"is-open":""}`;let $=document.createElement("div");$.className="tool-history-inner",R.forEach((W,Y)=>{$.appendChild(Ie(W,Y,x,p))}),oe.appendChild($),A.appendChild(oe),k.appendChild(A),k.appendChild(Ie(C,v-1,x,p))}function Ne(p,b){if(!p._slots||!p._state)return;let{contentSlot:x}=p._slots,k=p._state.content.text||"";if(!k.trim()){x.innerHTML="";return}let v=x.querySelector(".assistant-flow-content");v||(v=document.createElement("div"),v.className="assistant-flow-content",x.appendChild(v));let E=Fe(k,b),R=JSON.stringify(E.map(C=>C.kind+(C.text?C.text.length:"")+(C.data?JSON.stringify(C.data):"")));v.dataset.renderKey!==R&&(v.dataset.renderKey=R,v.innerHTML="",E.forEach(C=>{if(C.kind==="md"){let A=document.createElement("div");A.className="markdown-body mixed-chunk--md";let J=_e(C.text);J!=null?A.innerHTML=J:A.textContent=C.text,v.appendChild(A)}else if(C.kind==="render")try{let A=window.renderRenderJSON?window.renderRenderJSON(C.data):null;A&&(A.classList.add("mixed-chunk--render"),v.appendChild(A))}catch(A){}else if(C.kind==="loading"){let A=document.createElement("div");A.className="render-loading-tip mixed-chunk--loading",A.innerHTML='<span class="css-spinner"></span><span>\u6B63\u5728\u751F\u6210\u56FE\u8868\u6570\u636E\u2026</span>',v.appendChild(A)}}),M.scrollTop=M.scrollHeight)}function Yt(p,b){if(!b||!p._state)return;re(p);let x=p._state.thinking;x.startedAt||(x.startedAt=Date.now()),x.text+=b,je(p)}function ht(p){if(!p._state)return;let b=p._state.thinking;b.text&&!b.done&&(b.done=!0,b.durationMs=Math.max(0,Date.now()-(b.startedAt||Date.now())),F&&(clearInterval(F),F=null),b.userTouched||(b.open=!1),je(p))}function Ge(p){return re(p),p._state?p._state.tools:{calls:[],openStates:{}}}function Ye(p,b){!b||!p._state||(re(p),ht(p),p._state.content.text+=b,Ne(p,!0))}let ze=!1,Ue=null,ve=[],nt=20,F=null,Zt=0;function mt(){Ue&&(Ue.abort(),Ue=null)}function Mt(p){ze=p,p?(G.textContent="\u505C\u6B62",G.className="send-btn stop-btn",G.disabled=!1,G.title="\u505C\u6B62\u56DE\u7B54 (Esc)",i.querySelectorAll(".example-btn").forEach(b=>{b.disabled=!0,b.classList.add("disabled")})):(F&&(clearInterval(F),F=null),Ue=null,G.textContent="\u53D1\u9001",G.className="send-btn",G.disabled=!1,G.title="\u53D1\u9001 (Enter)",i.querySelectorAll(".example-btn").forEach(b=>{b.disabled=!1,b.classList.remove("disabled")}))}function Vt(p){if(p.querySelector(".thinking"))return;let b=document.createElement("div");b.className="thinking";let x=document.createElement("span");x.className="thinking-dots";for(let v=0;v<3;v++)x.appendChild(document.createElement("span"));let k=document.createElement("span");k.textContent="\u601D\u8003\u4E2D\u2026",b.append(x,k),p.appendChild(b)}function gt(p){let b=p.querySelector(".thinking");b&&b.remove()}async function bt(p){if(ze||(p=(p||P.value).trim(),!p))return;P.value="",O&&O.parentNode&&O.remove(),ke("user",p),ve.push({role:"user",content:p}),ve.length>nt&&ve.splice(0,ve.length-nt);let b=ke("assistant","");Vt(b);let x="";Mt(!0),r.textContent="\u601D\u8003\u4E2D\u2026",Ue=new AbortController,Zt=Date.now(),F=setInterval(()=>{if(b&&b._state){let k=b._state.thinking;k&&!k.done&&k.startedAt&&(k.durationMs=Date.now()-k.startedAt,k.text&&je(b));let v=b._state.tools;if(v&&v.calls&&v.calls.length>0){let E=!1;v.calls.forEach(R=>{R.status==="running"&&R.startedAt&&(R.durationMs=Date.now()-R.startedAt,E=!0)}),E&&Ee(b)}}},150);try{let k=await Pi(e.headers),v=await fetch(t+"/assistant/chat",{method:"POST",credentials:"include",headers:Object.assign({},k,{"Content-Type":"application/json"}),body:JSON.stringify({message:p,messages:ve.slice()}),signal:Ue.signal});if(!v.ok){let I="HTTP "+v.status;try{let X=await v.json(),ne=X&&(X.error||X.msg||X.message);ne&&(I=ne)}catch(X){}throw new Error(I)}let E=v.body.getReader(),R=new TextDecoder,C="",A=!1;for(;;){let{done:I,value:X}=await E.read();if(I)break;C+=R.decode(X,{stream:!0});let ne;for(;(ne=C.indexOf(`

`))>=0;){let he=C.slice(0,ne);C=C.slice(ne+2);for(let ye of he.split(`
`)){if(!ye.startsWith("data:"))continue;let oe=ye.slice(5).trim();if(!(!oe||oe==="[DONE]"))try{let $=JSON.parse(oe);if(A||(A=!0,gt(b)),$.object==="agent.event"){let Y=$.x_agent||{},K=Y.extra||{},L=Ge(b),te=K.call_id||Y.name;if(L._hasAgentEvents=!0,Y.type==="tool_start")r.textContent="\u67E5\u8BE2\u6570\u636E\u4E2D\u2026",L._structureDirty=!0,L.calls.push({call_id:te,name:Y.name,args:K.arguments,result:"",status:"running",startedAt:Date.now(),durationMs:0}),Ee(b);else if(Y.type==="tool_end"){L._structureDirty=!0;let H=[...L.calls].reverse().find(le=>le.call_id===te&&le.status==="running")||L.calls.find(le=>le.call_id===te)||L.calls[L.calls.length-1];H&&(H.status=Y.status==="success"?"ok":"fail",H.result=K.result_preview||Y.message||"",H.startedAt&&(H.durationMs=Math.max(1,Date.now()-H.startedAt))),Ee(b)}else if(Y.type==="tool_error"){L._structureDirty=!0;let H=[...L.calls].reverse().find(le=>le.call_id===te&&le.status==="running")||L.calls.find(le=>le.call_id===te)||L.calls[L.calls.length-1];H&&(H.status="fail",H.result=Y.message||"\u8C03\u7528\u5931\u8D25",H.startedAt&&(H.durationMs=Math.max(1,Date.now()-H.startedAt))),Ee(b)}continue}let W=$.choices&&$.choices[0]&&$.choices[0].delta;if(!W)continue;if(W.reasoning_content){r.textContent="\u601D\u8003\u4E2D\u2026";let Y=W.reasoning_content;if(/^(\[工具调用\]|\[执行成功\]|\[执行失败\])/.test(Y)){let K=Ge(b);if(!K._hasAgentEvents){if(Y.startsWith("[\u5DE5\u5177\u8C03\u7528]")){let L=Y.replace(/^\[工具调用\]\s*/,"").trim(),te=L.indexOf(" ");K.calls.push({name:te>0?L.slice(0,te):L,args:te>0?L.slice(te+1):"",result:"",status:"running",startedAt:Date.now(),durationMs:0})}else if(Y.startsWith("[\u6267\u884C\u6210\u529F]")){let L=Y.replace(/^\[执行成功\]\s*/,"").trim(),te=L.indexOf(":"),H=[...K.calls].reverse().find(le=>le.status==="running")||K.calls[K.calls.length-1];H&&(H.status="ok",H.result=te>0?L.slice(te+1).trim():L,H.startedAt&&(H.durationMs=Math.max(1,Date.now()-H.startedAt)))}else if(Y.startsWith("[\u6267\u884C\u5931\u8D25]")){let L=Y.replace(/^\[执行失败\]\s*/,"").trim(),te=L.indexOf(":"),H=[...K.calls].reverse().find(le=>le.status==="running")||K.calls[K.calls.length-1];H&&(H.status="fail",H.result=te>0?L.slice(te+1).trim():L,H.startedAt&&(H.durationMs=Math.max(1,Date.now()-H.startedAt)))}Ee(b)}}else Yt(b,W.reasoning_content)}if(W.content){r.textContent="\u56DE\u7B54\u4E2D\u2026";let Y=b._state&&b._state.tools;if(Y&&Y.calls){let K=!1;Y.calls.forEach(L=>{L.status==="running"&&(L.status="ok",K=!0)}),K&&Ee(b)}x+=W.content,Ye(b,W.content)}}catch($){}}}}let J=b._state&&b._state.tools;if(J&&J.calls){let I=!1;J.calls.forEach(X=>{X.status==="running"&&(X.status="ok",I=!0)}),I&&Ee(b)}gt(b),ht(b),Ne(b,!1),r.textContent="",x.trim()&&(ve.push({role:"assistant",content:x}),ve.length>nt&&ve.splice(0,ve.length-nt))}catch(k){gt(b),ht(b),k.name==="AbortError"?(Ye(b,`

*\uFF08\u5DF2\u505C\u6B62\u751F\u6210\uFF09*`),r.textContent="\u5DF2\u4E2D\u65AD"):(Ye(b,`

[\u9519\u8BEF] `+k.message),r.textContent="\u5931\u8D25"),renderSegments(b,!1)}finally{Mt(!1)}}G.addEventListener("click",()=>{ze?mt():bt()}),P.addEventListener("keydown",p=>{p.key==="Enter"&&!p.shiftKey?(p.preventDefault(),ze||bt()):p.key==="Escape"&&ze&&(p.preventDefault(),mt())}),M.addEventListener("click",p=>{let b=p.target.closest(".example-btn");if(b){if(ze)return;bt(b.textContent.trim())}})}var Ae=["#4f46e5","#06b6d4","#10b981","#f59e0b","#8b5cf6","#ec4899","#3b82f6","#f97316"],$i="http://www.w3.org/2000/svg";function Me(i,e,t){let n=document.createElementNS($i,i);for(let a in e)n.setAttribute(a,e[a]);return t!==void 0&&(n.textContent=t),n}function ft(i){if(i==null||i==="")return"0";let e=Number(i);return isNaN(e)?String(i):e.toLocaleString("zh-CN")}function Wt(i){let e=document.createElement("div");e.className="data-table-wrap";let t=document.createElement("table");t.className="data-table";let n=(i.columns||[]).map(c=>({field:c.field,label:c.label||c.field})),a=document.createElement("thead"),s=document.createElement("tr");n.forEach(c=>{let d=document.createElement("th");d.textContent=c.label,s.appendChild(d)}),a.appendChild(s);let r=document.createElement("tbody");return(i.rows||[]).forEach(c=>{let d=document.createElement("tr");n.forEach(m=>{let g=document.createElement("td");g.textContent=c[m.field]===void 0?"":String(c[m.field]),d.appendChild(g)}),r.appendChild(d)}),t.append(a,r),e.appendChild(t),e}function Zo(i,e){let t=i.data||[],n=i.series||[],a=i.x_axis&&i.x_axis.field;if(!t.length||!n.length||!a)return Wt(i);let s="";e==="chart_bar"&&t.length>24&&(t=t.slice(0,24),s="\uFF08\u5C55\u793A\u524D 24 \u9879\uFF09");let r=480,c=240,d=48,m=14,g=16,y=42,w=r-d-m,_=c-g-y,B=t.map((D,q)=>a?D[a]:"\u7B2C"+(q+1)+"\u9879"),M=0;n.forEach(D=>t.forEach(q=>{M=Math.max(M,Number(q[D.field])||0)})),M<=0&&(M=1);let O=Bi(M),z=Me("svg",{viewBox:"0 0 "+r+" "+c,class:"dq-svg-chart",role:"img"});for(let D=0;D<=4;D++){let q=g+_-_*D/4;z.appendChild(Me("line",{x1:d,y1:q,x2:r-m,y2:q,stroke:"#f1f5f9","stroke-width":1}));let V=Me("text",{x:d-8,y:q+4,"text-anchor":"end","font-size":10,fill:"#94a3b8"});V.textContent=ft(Math.round(O*D/4)),z.appendChild(V)}let de=Math.ceil(B.length/12);if(B.forEach((D,q)=>{if(q%de!==0)return;let V=Me("text",{x:d+w*(q+.5)/B.length,y:c-y+16,"text-anchor":"middle","font-size":10,fill:"#64748b"});V.textContent=String(D).length>6?String(D).slice(0,6)+"\u2026":D,z.appendChild(V)}),e==="chart_bar"){let D=w/B.length,q=Math.min(24,D*.7/n.length);n.forEach((V,fe)=>{t.forEach((P,G)=>{let _e=Number(P[V.field])||0,Fe=_e/O*_,re=d+D*G+(D-q*n.length)/2+fe*q,ke=Me("rect",{x:re,y:g+_-Fe,width:q-1,height:Math.max(Fe,1),fill:Ae[fe%Ae.length],rx:3,class:"dq-svg-bar"});ke.setAttribute("data-tip",(B[G]||"")+" \xB7 "+(V.name||V.field)+"\uFF1A"+ft(_e)),z.appendChild(ke)})})}else n.forEach((D,q)=>{let V=t.map((P,G)=>{let _e=Number(P[D.field])||0;return[(d+w*(G+.5))/B.length,g+_-_e/O*_]}),fe=V.map((P,G)=>(G===0?"M":"L")+P[0].toFixed(1)+" "+P[1].toFixed(1)).join(" ");z.appendChild(Me("path",{d:fe,fill:"none",stroke:Ae[q%Ae.length],"stroke-width":2,"stroke-linejoin":"round"})),t.length<=48&&V.forEach((P,G)=>{let _e=Me("circle",{cx:P[0].toFixed(1),cy:P[1].toFixed(1),r:3,fill:Ae[q%Ae.length]});_e.setAttribute("data-tip",(B[G]||"")+" \xB7 "+(D.name||D.field)+"\uFF1A"+ft(t[G][D.field])),z.appendChild(_e)})});return Vo(z,i,n,s)}function Hi(i){let e=i.data||[],t=i.name_field,n=i.value_field;if(!e.length||!t||!n)return Wt(i);let a="";if(e.length>7){let _=[...e].sort((z,de)=>(Number(de[n])||0)-(Number(z[n])||0)),B=_.slice(0,6),O=_.slice(6).reduce((z,de)=>z+(Number(de[n])||0),0);O>0&&B.push({[t]:"\u5176\u4ED6",[n]:O}),e=B,a="\uFF08Top 6 + \u5176\u4ED6\uFF09"}let s=480,r=240,c=130,d=r/2,m=88,g=e.reduce((_,B)=>_+(Number(B[n])||0),0)||1,y=Me("svg",{viewBox:"0 0 "+s+" "+r,class:"dq-svg-chart",role:"img"}),w=-Math.PI/2;return e.forEach((_,B)=>{let M=Number(_[n])||0,O=M/g,z=w+O*Math.PI*2,de=c+m*Math.cos(w),D=d+m*Math.sin(w),q=c+m*Math.cos(z),V=d+m*Math.sin(z),fe=O>.5?1:0,P=Me("path",{d:"M"+c+" "+d+" L"+de.toFixed(1)+" "+D.toFixed(1)+" A"+m+" "+m+" 0 "+fe+" 1 "+q.toFixed(1)+" "+V.toFixed(1)+" Z",fill:Ae[B%Ae.length],stroke:"#fff","stroke-width":1.5});P.setAttribute("data-tip",(_[t]||"")+"\uFF1A"+ft(M)+"\uFF08"+(O*100).toFixed(1)+"%\uFF09"),y.appendChild(P),w=z}),e.forEach((_,B)=>{let M=30+B*22;y.appendChild(Me("rect",{x:260,y:M-8,width:10,height:10,rx:2,fill:Ae[B%Ae.length]}));let O=Me("text",{x:276,y:M,"font-size":11,fill:"#1e293b"}),z=String(_[t]||"");O.textContent=(z.length>10?z.slice(0,10)+"\u2026":z)+" "+ft(_[n]),y.appendChild(O)}),Vo(y,i,[],a)}function Fi(i){let e=document.createElement("div");return e.className="metric-cards",(i.cards||[]).forEach(t=>{let n=document.createElement("div");n.className="metric-card";let a=document.createElement("div");a.className="metric-label",a.textContent=t.label||"";let s=document.createElement("div");if(s.className="metric-value",s.textContent=ft(t.value),t.unit){let r=document.createElement("span");r.className="metric-unit",r.textContent=t.unit,s.appendChild(r)}n.append(a,s),e.appendChild(n)}),e}function Vo(i,e,t,n){let a=document.createElement("div");if(a.className="render-card",e.title||n){let s=document.createElement("div");s.className="chart-title",s.textContent=(e.title||"\u6570\u636E\u56FE\u8868")+(n?" "+n:""),a.appendChild(s)}if(i.style.width="100%",i.style.height="auto",a.appendChild(i),t.length>1){let s=document.createElement("div");s.style.cssText="display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:#64748b;margin-top:4px;",t.forEach((r,c)=>{let d=document.createElement("span"),m=document.createElement("span");m.style.cssText="display:inline-block;width:8px;height:8px;border-radius:2px;background:"+Ae[c%Ae.length]+";margin-right:4px;",d.appendChild(m),d.appendChild(document.createTextNode(r.name||r.field)),s.appendChild(d)}),a.appendChild(s)}return Ui(a,i),a}function Ui(i,e){let t=document.createElement("div");t.className="dq-tooltip",t.style.cssText=["position:absolute;","pointer-events:none;","z-index:10;","background:rgba(15,23,42,.92);","color:#f8fafc;","padding:5px 9px;","border-radius:6px;","font-size:12px;","line-height:1.5;","white-space:nowrap;","box-shadow:0 4px 12px rgba(0,0,0,.25);","opacity:0;","transition:opacity .12s;","top:0;","left:0;"].join(""),i.style.position=i.style.position||"relative",i.appendChild(t);let n=r=>{let c=r.getAttribute("data-tip");c&&(t.textContent=c,t.style.opacity="1")},a=r=>{let c=i.getBoundingClientRect(),d=r.clientX-c.left+12,m=r.clientY-c.top-10;d+t.offsetWidth>c.width&&(d=r.clientX-c.left-t.offsetWidth-12),m+t.offsetHeight>c.height&&(m=r.clientY-c.top-t.offsetHeight-4),m<0&&(m=4),t.style.left=d+"px",t.style.top=m+"px"},s=()=>{t.style.opacity="0"};e.addEventListener("mouseover",r=>{let c=r.target.closest("[data-tip]");c&&n(c)}),e.addEventListener("mousemove",a),e.addEventListener("mouseout",r=>{r.target.closest("[data-tip]")&&s()})}function Bi(i){if(i<=5)return 5;let e=Math.pow(10,Math.floor(Math.log10(i)));for(let t of[1,2,5,10])if(t*e>=i)return t*e;return i}function Xo(i){if(!i||!i.type)return null;switch(i.type){case"data_table":return Wt(i);case"chart_bar":return Zo(i,"chart_bar");case"chart_line":return Zo(i,"chart_line");case"chart_pie":return Hi(i);case"metric_cards":return Fi(i);default:return Wt(i)}}var In=`/* gf-mate \u5D4C\u5165\u5F0F\u5C0F\u7A97\u6837\u5F0F\uFF08Shadow DOM \u5185\u6CE8\u5165\uFF09\uFF1A
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
}`;window.renderRenderJSON=Xo;window.marked=j;window.DOMPurify=Yo;var zn='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M14 9.5v3"/><path d="M10 11v1.5"/></svg>',Dn='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',Wi=`
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
  min-width: 320px; min-height: 360px;
  max-width: calc(100vw - 32px); max-height: calc(100vh - 110px);
  border-radius: 16px;
  box-shadow: 0 24px 60px -12px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.9);
  overflow: hidden; z-index: 2147483000; display: none; flex-direction: column;
  background: #ffffff;
  transform-origin: bottom right;
}
/* \u5DE6\u4E0A\u89D2\u62D6\u62FD\u624B\u67C4\uFF1A\u9762\u677F\u951A\u5B9A\u53F3\u4E0B\u89D2\uFF0C\u5411\u5DE6\u4E0A\u6269\u5C55\u66F4\u7B26\u5408\u76F4\u89C9 */
.dq-panel-resizer {
  position: absolute; top: 0; left: 0; width: 16px; height: 16px;
  cursor: nwse-resize; z-index: 2147483001;
}
.dq-panel-resizer::before {
  content: ""; position: absolute; top: 5px; left: 5px; width: 7px; height: 7px;
  border-top: 2px solid rgba(100, 116, 139, 0.55);
  border-left: 2px solid rgba(100, 116, 139, 0.55);
  border-top-left-radius: 2px;
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
`,Ce=document.currentScript,Jo=(Ce&&Ce.dataset.dqBase||"").replace(/\/$/,""),Ko=Ce&&Ce.dataset.dqTitle||void 0,er=Ce&&Ce.dataset.dqColor||void 0,tr=Ce&&Ce.dataset.dqExamples||void 0;function ji(i){let e=document.createElement("div");e.className="dq-panel-resizer",i.appendChild(e),e.addEventListener("pointerdown",t=>{t.preventDefault(),t.stopPropagation();let n=t.clientX,a=t.clientY,s=i.getBoundingClientRect(),r=s.width,c=s.height;e.setPointerCapture(t.pointerId);let d=g=>{i.style.width=r+(n-g.clientX)+"px",i.style.height=c+(a-g.clientY)+"px"},m=g=>{e.releasePointerCapture(g.pointerId),e.removeEventListener("pointermove",d),e.removeEventListener("pointerup",m)};e.addEventListener("pointermove",d),e.addEventListener("pointerup",m)})}function jt(i){i=i||{};let e=(i.base!==void 0?i.base:Jo).replace(/\/$/,""),t=i.title||Ko||void 0,n=i.color||er||void 0,a=i.examples||tr||void 0;if(!document.getElementById("dq-bubble-style")){let g=document.createElement("style");g.id="dq-bubble-style",g.textContent=Wi,document.head.appendChild(g)}let s=document.createElement("button");s.type="button",s.className="dq-bubble",s.setAttribute("aria-label",t||"AI \u6570\u636E\u52A9\u624B"),n&&(s.style.background=n),s.innerHTML=zn;let r=document.createElement("div");r.className="dq-panel",ji(r);let c=r.attachShadow({mode:"open"}),d=document.createElement("style");d.textContent=In,c.appendChild(d);let m=document.createElement("div");return m.className="dq-widget-root",m.style.cssText="display:flex;flex-direction:column;height:100%;",c.appendChild(m),On(m,{base:e||void 0,title:t,color:n,examples:a,headers:i.headers}),s.addEventListener("click",()=>{let g=r.classList.toggle("dq-open");s.innerHTML=g?Dn:zn}),i.open&&(r.classList.add("dq-open"),s.innerHTML=Dn),document.body.append(r,s),{open(){r.classList.add("dq-open"),s.innerHTML=Dn},close(){r.classList.remove("dq-open"),s.innerHTML=zn},toggle(){s.click()},destroy(){s.remove(),r.remove()}}}var Gt=class extends HTMLElement{connectedCallback(){if(this._mounted)return;this._mounted=!0;let e=this.getAttribute("base")||this.getAttribute("api")||Jo||void 0,t=this.getAttribute("title")||Ko||void 0,n=this.getAttribute("color")||er||void 0,a=this.getAttribute("examples")||tr||void 0;if(this.hasAttribute("inline")||this.getAttribute("mode")==="inline"){let r=this.attachShadow({mode:"open"}),c=document.createElement("style");c.textContent=`:host { display: block; width: 100%; height: 100%; min-height: 420px; overflow: hidden; background: #fff; border-radius: inherit; }
`+In,r.appendChild(c);let d=document.createElement("div");d.className="dq-widget-root",d.style.cssText="display:flex;flex-direction:column;height:100%;width:100%;",r.appendChild(d),this._inst=On(d,{base:e?e.replace(/\/$/,""):void 0,title:t,color:n,examples:a,inline:!0,headers:()=>this._headerValue()})}else this._inst=jt({base:e,title:t,color:n,examples:a,open:this.hasAttribute("open"),headers:()=>this._headerValue()})}get headers(){return this._headers}set headers(e){this._headers=e}_headerValue(){return typeof this._headers=="function"?this._headers():this._headers}disconnectedCallback(){this._inst&&typeof this._inst.destroy=="function"&&this._inst.destroy(),this._mounted=!1}open(){this._inst&&this._inst.open&&this._inst.open()}close(){this._inst&&this._inst.close&&this._inst.close()}toggle(){this._inst&&this._inst.toggle&&this._inst.toggle()}};typeof customElements!="undefined"&&(customElements.get("gf-mate")||customElements.define("gf-mate",Gt),customElements.get("dq-assistant")||customElements.define("dq-assistant",class extends Gt{}));function Qo(){if(document.querySelector("gf-mate, dq-assistant")||Ce&&Ce.dataset.dqAuto==="false"){window.DQWidget={mount:jt};return}let i=jt();Ce&&Ce.dataset.dqOpen!==void 0&&i.open(),window.DQWidget=i,window.DQWidget.mount=jt}document.body?Qo():document.addEventListener("DOMContentLoaded",Qo);})();
