!function(t){var e={};function n(r){if(e[r])return e[r].exports;var u=e[r]={i:r,l:!1,exports:{}};return t[r].call(u.exports,u,u.exports,n),u.l=!0,u.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var u in t)n.d(r,u,function(e){return t[e]}.bind(null,u));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);var r=!0,u=!1;const o=255,i=65280,c=16711680,f=4278190080,a=48,l=7,d=6;function s(t){const e=t&o,n=(t&i)>>8,r=(t&c)>>16;return[.299*e+.587*n+.114*r,-.168736*e+-.331264*n+.5*r,.5*e+-.418688*n+-.081312*r]}function b(t,e){const n=(t&f)>>24,r=(e&f)>>24;if(0===n&&0===r)return 0;if(0===n||0===r)return 1e6;const u=s(t),o=s(e);return Math.abs(u[0]-o[0])*a+Math.abs(u[1]-o[1])*l+Math.abs(u[2]-o[2])*d}function h(t,e){const n=(t&f)>>24,r=(e&f)>>24;if(0===n&&0===r)return!0;if(0===n||0===r)return!1;const u=s(t),o=s(e);return!(Math.abs(u[0]-o[0])>a)&&(!(Math.abs(u[1]-o[1])>l)&&!(Math.abs(u[2]-o[2])>d))}function p(t,e,n,r){let u,a,l,d;return 0===(t&f)>>24?(u=e&o,a=(e&i)>>8,l=(e&c)>>16):0===(e&f)>>24?(u=t&o,a=(t&i)>>8,l=(t&c)>>16):(u=(r*(e&o)+n*(t&o))/(n+r),a=(r*((e&i)>>8)+n*((t&i)>>8))/(n+r),l=(r*((e&c)>>16)+n*((t&c)>>16))/(n+r)),d=(r*((e&f)>>24)+n*((t&f)>>24))/(n+r),~~u|~~a<<8|~~l<<16|~~d<<24}function g(t,e,n,r,o,i,c,f,a,l,d){let s=e-2;s<0&&(s=0);let b=e-1;b<0&&(b=0);let h=e,p=e+1;p>=r&&(p=r-1);let g=e+2;g>=r&&(g=r-1);let m=n-2;m<0&&(m=0);let y=n-1;y<0&&(y=0);let w=n,v=n+1;v>=o&&(v=o-1);let M=n+2;M>=o&&(M=o-1);let x,_,A,C,P,S,D,E,U,B,L,R,T,F,k,q,z=t[b+m*r],G=t[h+m*r],H=t[p+m*r],J=t[s+y*r],K=t[b+y*r],N=t[h+y*r],Q=t[p+y*r],V=t[g+y*r],W=t[s+w*r],X=t[b+w*r],Y=t[h+w*r],Z=t[p+w*r],$=t[g+w*r],tt=t[s+v*r],et=t[b+v*r],nt=t[h+v*r],rt=t[p+v*r],ut=t[g+v*r],ot=t[b+M*r],it=t[h+M*r],ct=t[p+M*r];x=_=A=C=P=S=D=E=U=B=L=R=T=F=k=q=Y,2===l?([_,A,C]=I(Y,rt,nt,Z,et,Q,X,N,$,ut,it,ct,_,A,C,d),[x,C,_]=I(Y,Q,Z,N,rt,K,nt,X,G,H,$,V,x,C,_,d),[A,_,x]=I(Y,K,N,X,Q,et,Z,nt,W,J,G,z,A,_,x,d),[C,x,A]=I(Y,et,X,nt,K,rt,N,Z,it,ot,W,tt,C,x,A,d),i[c+f*a]=x,i[c+1+f*a]=_,i[c+(f+1)*a]=A,i[c+1+(f+1)*a]=C):3===l?([A,S,D,E,U]=j(Y,rt,nt,Z,et,Q,X,N,$,ut,it,ct,A,S,D,E,U,d,u),[x,_,U,S,A]=j(Y,Q,Z,N,rt,K,nt,X,G,H,$,V,x,_,U,S,A,d,u),[D,C,A,_,x]=j(Y,K,N,X,Q,et,Z,nt,W,J,G,z,D,C,A,_,x,d,u),[U,E,x,C,D]=j(Y,et,X,nt,K,rt,N,Z,it,ot,W,tt,U,E,x,C,D,d,u),i[c+f*a]=x,i[c+1+f*a]=_,i[c+2+f*a]=A,i[c+(f+1)*a]=C,i[c+1+(f+1)*a]=P,i[c+2+(f+1)*a]=S,i[c+(f+2)*a]=D,i[c+1+(f+2)*a]=E,i[c+2+(f+2)*a]=U):4===l&&([q,k,R,C,E,L,F,T]=O(Y,rt,nt,Z,et,Q,X,N,$,ut,it,ct,q,k,R,C,E,L,F,T,d),[C,E,A,x,_,D,R,q]=O(Y,Q,Z,N,rt,K,nt,X,G,H,$,V,C,E,A,x,_,D,R,q,d),[x,_,P,T,U,S,A,C]=O(Y,K,N,X,Q,et,Z,nt,W,J,G,z,x,_,P,T,U,S,A,C,d),[T,U,F,q,k,B,P,x]=O(Y,et,X,nt,K,rt,N,Z,it,ot,W,tt,T,U,F,q,k,B,P,x,d),i[c+f*a]=x,i[c+1+f*a]=_,i[c+2+f*a]=A,i[c+3+f*a]=C,i[c+(f+1)*a]=P,i[c+1+(f+1)*a]=S,i[c+2+(f+1)*a]=D,i[c+3+(f+1)*a]=E,i[c+(f+2)*a]=U,i[c+1+(f+2)*a]=B,i[c+2+(f+2)*a]=L,i[c+3+(f+2)*a]=R,i[c+(f+3)*a]=T,i[c+1+(f+3)*a]=F,i[c+2+(f+3)*a]=k,i[c+3+(f+3)*a]=q)}function m(t,e,n){return n?p(t,e,7,1):t}function y(t,e,n){return n?p(t,e,3,1):t}function w(t,e,n){return n?p(t,e,1,1):t}function v(t,e,n){return n?p(t,e,1,3):e}function M(t,e,n){return n?p(t,e,1,7):e}function I(t,e,n,r,u,o,i,c,f,a,l,d,s,p,g,m){if(!(t!=n&&t!=r))return[s,p,g];let M=b(t,o)+b(t,u)+b(e,l)+b(e,f)+(b(n,r)<<2),I=b(n,i)+b(n,d)+b(r,a)+b(r,c)+(b(t,e)<<2),j=b(t,r)<=b(t,n)?r:n;if(M<I&&(!h(r,c)&&!h(n,i)||h(t,e)&&!h(r,a)&&!h(n,d)||h(t,u)||h(t,o))){let e=b(r,u),f=b(n,o),a=t!=o&&c!=o,l=t!=u&&i!=u;if(e<<1<=f&&l||e>=f<<1&&a){if(e<<1<=f&&l){let t=function(t,e,n,r){return[t=v(t,n,r),e=y(e,n,r)]}(g,p,j,m);g=t[0],p=t[1]}if(e>=f<<1&&a){let t=function(t,e,n,r){return[v(t,n,r),y(e,n,r)]}(g,s,j,m);g=t[0],s=t[1]}}else g=function(t,e,n){return w(t,e,n)}(g,j,m)}else M<=I&&(g=y(g,j,m));return[s,p,g]}function j(t,e,n,r,u,o,i,c,f,a,l,d,s,p,g,I,j,O,x){if(!(t!=n&&t!=r))return[s,p,g,I,j];const _=b(t,o)+b(t,u)+b(e,l)+b(e,f)+(b(n,r)<<2),A=b(n,i)+b(n,d)+b(r,a)+b(r,c)+(b(t,e)<<2);let C;if(C=x?_<A&&(!h(r,c)&&!h(n,i)||h(t,e)&&!h(r,a)&&!h(n,d)||h(t,u)||h(t,o)):_<A&&(!h(r,c)&&!h(r,o)||!h(n,i)&&!h(n,u)||h(t,e)&&(!h(r,f)&&!h(r,a)||!h(n,l)&&!h(n,d))||h(t,u)||h(t,o)),C){const e=b(r,u),f=b(n,o),a=t!=o&&c!=o,l=t!=u&&i!=u,d=b(t,r)<=b(t,n)?r:n;e<<1<=f&&l&&e>=f<<1&&a?[I,p,g,s,j]=function(t,e,n,r,u,o,i){const c=v(t,o,i),f=y(n,o,i);return[c,c,f,f,o]}(I,0,g,0,0,d,O):e<<1<=f&&l?[I,p,g,j]=function(t,e,n,r,u,o){return[v(t,u,o),y(e,u,o),y(n,u,o),u]}(I,p,g,0,d,O):e>=f<<1&&a?[p,I,s,j]=function(t,e,n,r,u,o){return[v(t,u,o),y(e,u,o),y(n,u,o),u]}(p,I,s,0,d,O):[j,p,I]=function(t,e,n,r,u){return[M(t,r,u),m(e,r,u),m(n,r,u)]}(j,p,I,d,O)}else _<=A&&(j=w(j,b(t,r)<=b(t,n)?r:n,O));return[s,p,g,I,j]}function O(t,e,n,r,u,o,i,c,f,a,l,d,s,p,g,m,M,I,j,O,x){if(!(t!=n&&t!=r))return[s,p,g,m,M,I,j,O];const _=b(t,o)+b(t,u)+b(e,l)+b(e,f)+(b(n,r)<<2),A=b(n,i)+b(n,d)+b(r,a)+b(r,c)+(b(t,e)<<2),C=b(t,r)<=b(t,n)?r:n;if(_<A&&(!h(r,c)&&!h(n,i)||h(t,e)&&!h(r,a)&&!h(n,d)||h(t,u)||h(t,o))){const e=b(r,u),f=b(n,o),a=t!=o&&c!=o,l=t!=u&&i!=u;e<<1<=f&&l||e>=f<<1&&a?(e<<1<=f&&l&&([s,p,g,j,O,I]=function(t,e,n,r,u,o,i,c){return n=v(n,i,c),r=v(r,i,c),o=y(o,i,c),[i,i,n,r,u=y(u,i,c),o]}(0,0,g,j,O,I,C,x)),e>=f<<1&&a&&([s,p,g,m,M,I]=function(t,e,n,r,u,o,i,c){return e=v(e,i,c),u=v(u,i,c),o=y(o,i,c),[i,e,i,r=y(r,i,c),u,o]}(0,p,0,m,M,I,C,x))):[s,p,g]=function(t,e,n,r,u){return n=w(n,r,u),[r,e=w(e,r,u),n]}(0,p,g,C,x)}else _<=A&&(s=w(s,C,x));return[s,p,g,m,M,I,j,O]}function x(t,e){const n=document.createElement("canvas"),u=t.width,o=t.height;n.width=u,n.height=o;const i=n.getContext("2d");i.drawImage(t,0,0);const c=u*e,f=o*e,a=i.getImageData(0,0,u,o),l=new Uint32Array(a.data.buffer),d=i.createImageData(c,f),s=new Uint32Array(d.data.buffer);for(let t=0;t<u;t++)for(let n=0;n<o;n++)g(l,t,n,u,o,s,t*e,n*e,c,e,r);return n.width=c,n.height=f,i.putImageData(d,0,0),n}function _(t){let e=new Image;e.src=t,e.onload=function(t){e.setAttribute("width",e.width),e.setAttribute("height",e.height);let n=x(e,2);document.body.appendChild(n),n=x(e,3),document.body.appendChild(n),n=x(e,4),document.body.appendChild(n)},document.body.appendChild(e)}window.onload=function(){var t=document.getElementById("processImage");t.addEventListener("change",()=>(function(t){if(t.files&&t.files[0]){let e=new FileReader;e.onload=function(t){_(t.target.result)},e.readAsDataURL(t.files[0])}})(t));document.getElementById("original");_("image.png")}}]);