import { NextResponse } from "next/server";

const JS = "!function(w,d){function g(n){var m=d.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return m?decodeURIComponent(m[1]):''}function s(n,v,days){var e='';if(days){var t=new Date;t.setTime(t.getTime()+864e5*days),e='; expires='+t.toUTCString()}d.cookie=n+'='+encodeURIComponent(v)+e+'; path=/; SameSite=Lax'}function rid(){return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)}function qs(u){try{var p=new URL(u).searchParams;return{source:p.get('utm_source')||'',medium:p.get('utm_medium')||'',campaign:p.get('utm_campaign')||'',term:p.get('utm_term')||'',content:p.get('utm_content')||''}}catch(e){return{source:'',medium:'',campaign:'',term:'',content:''}}}function send(ev){var body=JSON.stringify(ev);if(navigator.sendBeacon){navigator.sendBeacon('/api/track',body)}else{fetch('/api/track',{method:'POST',headers:{'content-type':'application/json'},body:body,keepalive:!0,credentials:'omit'}).catch(function(){})}}function now(){return Date.now()}function init(k){var aid=g('optiq_aid');if(!aid){aid=rid();s('optiq_aid',aid,365)}var sid=g('optiq_sid');if(!sid){sid=rid();s('optiq_sid',sid,1)}var utm=qs(w.location.href);if(utm.source||utm.medium||utm.campaign||utm.term||utm.content){s('optiq_utm',btoa(unescape(encodeURIComponent(JSON.stringify(utm)))),7)}else{var raw=g('optiq_utm');if(raw)try{utm=JSON.parse(decodeURIComponent(escape(atob(raw))))}catch(e){utm=utm}}function pv(){send({k:k,eid:rid(),t:'PAGE_VIEW',u:w.location.href,p:w.location.pathname+(w.location.search||''),r:d.referrer||'',ti:d.title||'',ts:now(),aid:aid,sid:sid,utm:utm})}function conv(name,props){send({k:k,eid:rid(),t:'CONVERSION',n:name,u:w.location.href,p:w.location.pathname+(w.location.search||''),r:d.referrer||'',ti:d.title||'',ts:now(),aid:aid,sid:sid,utm:utm,props:props||{}})}w.optiq=w.optiq||function(a,b,c){if(a==='pageview')pv();else if(a==='conversion')conv(b,c)};pv()}var k='';try{k=new URL(d.currentScript&&d.currentScript.src||w.location.href).searchParams.get('k')||''}catch(e){}if(k)init(k)}(window,document);";

export function GET() {
  return new NextResponse(JS, {
    status: 200,
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
