module.exports=[28892,e=>{"use strict";e.i(55007);var t=e.i(54799);function r(){let e=(0,t.randomBytes)(32).toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"");return`pk_${e}`}e.s(["generatePublicKey",()=>r])},71487,e=>{"use strict";function t(e){return{html:`## HTML Installation

Add this snippet to your website's <head> tag, just before the closing </head>:

\`\`\`html
${function(e){let{publicKey:t,domain:r,apiUrl:n=process.env.NEXT_PUBLIC_API_URL||"https://app.optiq.io"}=e;return`<!-- Optiq Tracking Script -->
<script>
  (function() {
    window.optiq = window.optiq || [];
    window.optiq.publicKey = "${t}";
    window.optiq.apiUrl = "${n}";
    
    // Track page view
    window.optiq.track = function(eventType, properties) {
      var event = {
        publicKey: window.optiq.publicKey,
        eventId: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        type: eventType || 'PAGE_VIEW',
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer || null,
        title: document.title || null,
        properties: properties || {},
        occurredAt: new Date().toISOString()
      };
      
      // Send to tracking endpoint
      fetch(window.optiq.apiUrl + '/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true
      }).catch(function(err) {
        console.error('Optiq tracking error:', err);
      });
    };
    
    // Auto-track page view
    window.optiq.track('PAGE_VIEW');
    
    // Track conversions
    window.optiq.conversion = function(value, properties) {
      window.optiq.track('CONVERSION', {
        ...properties,
        value: value
      });
    };
  })();
</script>
<!-- End Optiq Tracking Script -->`}(e)}
\`\`\`

The script will automatically track page views and provide methods for tracking conversions.`,react:`## React/Next.js Installation

1. Create a new component file \`components/OptiqTracking.tsx\`:

\`\`\`tsx
${function(e){let{publicKey:t,apiUrl:r=process.env.NEXT_PUBLIC_API_URL||"https://app.optiq.io"}=e;return`// Install in your _app.tsx or layout.tsx
import { useEffect } from 'react';
import { usePathname } from 'next/navigation'; // or 'next/router' for Pages Router

export function OptiqTracking() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Initialize Optiq
    window.optiq = {
      publicKey: "${t}",
      apiUrl: "${r}",
      track: (eventType, properties) => {
        const event = {
          publicKey: window.optiq.publicKey,
          eventId: \`evt_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`,
          type: eventType || 'PAGE_VIEW',
          url: window.location.href,
          path: window.location.pathname,
          referrer: document.referrer || null,
          title: document.title || null,
          properties: properties || {},
          occurredAt: new Date().toISOString()
        };
        
        fetch(window.optiq.apiUrl + '/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
          keepalive: true
        }).catch(err => console.error('Optiq tracking error:', err));
      },
      conversion: (value, properties) => {
        window.optiq.track('CONVERSION', { ...properties, value });
      }
    };
  }, []);
  
  // Track page views on route change
  useEffect(() => {
    window.optiq?.track('PAGE_VIEW');
  }, [pathname]);
  
  return null;
}`}(e)}
\`\`\`

2. Add to your root layout or _app.tsx:

\`\`\`tsx
import { OptiqTracking } from '@/components/OptiqTracking';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <OptiqTracking />
        {children}
      </body>
    </html>
  );
}
\`\`\``,verification:`## Verify Installation

1. Open your website in a browser
2. Open the browser console (F12)
3. Type: \`window.optiq\`
4. You should see the Optiq tracking object

To track a conversion:
\`\`\`javascript
window.optiq.conversion(99.99, { productId: '123', category: 'shoes' });
\`\`\`

Events will appear in your Optiq dashboard within a few minutes.`}}e.i(55007),e.s(["generateInstallInstructions",()=>t])},29729,e=>{"use strict";var t=e.i(56884),r=e.i(42064),n=e.i(1824),i=e.i(99326),a=e.i(18794),o=e.i(83629),s=e.i(41446),l=e.i(61251),u=e.i(5708),c=e.i(59092),p=e.i(99563),d=e.i(39870),h=e.i(8016),w=e.i(7624),m=e.i(70065),f=e.i(36141),g=e.i(93695);e.i(58762);var v=e.i(24378),y=e.i(70081),R=e.i(68050),E=e.i(46989),x=e.i(16336),b=e.i(60806),A=e.i(28892),N=e.i(71487);let O=E.z.object({name:E.z.string().min(1,"Name is required").max(100,"Name too long"),domain:E.z.string().min(1,"Domain is required").max(255,"Domain too long").regex(/^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/,"Invalid domain format")});async function k(e){try{let t=await (0,R.getServerSession)(x.authOptions);if(!t?.user?.id)return y.NextResponse.json({error:"Unauthorized"},{status:401});let r=t.user.activeOrgId;if(!r)return y.NextResponse.json({error:"No active organization"},{status:400});let n=await b.prisma.membership.findUnique({where:{userId_organizationId:{userId:t.user.id,organizationId:r}},select:{role:!0}});if(!n)return y.NextResponse.json({error:"Not a member of this organization"},{status:403});if(!["OWNER","ADMIN"].includes(n.role))return y.NextResponse.json({error:"Insufficient permissions. Only owners and admins can create tracking sites."},{status:403});let i=await e.json(),a=O.safeParse(i);if(!a.success)return y.NextResponse.json({error:"Validation failed",details:a.error.errors},{status:400});let{name:o,domain:s}=a.data;if(await b.prisma.trackingSite.findFirst({where:{organizationId:r,domain:s}}))return y.NextResponse.json({error:"A tracking site with this domain already exists"},{status:409});let l=(0,A.generatePublicKey)(),u=0;for(;u<5&&await b.prisma.trackingSite.findUnique({where:{publicKey:l}});)l=(0,A.generatePublicKey)(),u++;if(u>=5)return y.NextResponse.json({error:"Failed to generate unique key. Please try again."},{status:500});let c=await b.prisma.trackingSite.create({data:{organizationId:r,name:o,domain:s,publicKey:l},select:{id:!0,name:!0,domain:!0,publicKey:!0,createdAt:!0}}),p=(0,N.generateInstallInstructions)({publicKey:c.publicKey,domain:c.domain});return y.NextResponse.json({success:!0,site:{id:c.id,name:c.name,domain:c.domain,publicKey:c.publicKey,createdAt:c.createdAt},installation:p},{status:201})}catch(e){return console.error("Failed to create tracking site:",e),y.NextResponse.json({error:"Internal server error"},{status:500})}}async function q(e){try{let e=await (0,R.getServerSession)(x.authOptions);if(!e?.user?.id)return y.NextResponse.json({error:"Unauthorized"},{status:401});let t=e.user.activeOrgId;if(!t)return y.NextResponse.json({error:"No active organization"},{status:400});if(!await b.prisma.membership.findUnique({where:{userId_organizationId:{userId:e.user.id,organizationId:t}}}))return y.NextResponse.json({error:"Not a member of this organization"},{status:403});let r=await b.prisma.trackingSite.findMany({where:{organizationId:t},select:{id:!0,name:!0,domain:!0,publicKey:!0,createdAt:!0,updatedAt:!0,_count:{select:{events:!0,touchPoints:!0}}},orderBy:{createdAt:"desc"}});return y.NextResponse.json({success:!0,sites:r.map(e=>({id:e.id,name:e.name,domain:e.domain,publicKey:e.publicKey,createdAt:e.createdAt,updatedAt:e.updatedAt,stats:{totalEvents:e._count.events,totalTouchPoints:e._count.touchPoints}}))})}catch(e){return console.error("Failed to list tracking sites:",e),y.NextResponse.json({error:"Internal server error"},{status:500})}}e.s(["GET",()=>q,"POST",()=>k,"runtime",0,"nodejs"],61982);var I=e.i(61982);let T=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/sites/route",pathname:"/api/sites",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/api/sites/route.ts",nextConfigOutput:"",userland:I}),{workAsyncStorage:P,workUnitAsyncStorage:S,serverHooks:_}=T;function C(){return(0,n.patchFetch)({workAsyncStorage:P,workUnitAsyncStorage:S})}async function j(e,t,n){T.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/sites/route";y=y.replace(/\/index$/,"")||"/";let R=await T.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!R)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:E,params:x,nextConfig:b,parsedUrl:A,isDraftMode:N,prerenderManifest:O,routerServerContext:k,isOnDemandRevalidate:q,revalidateOnlyGenerated:I,resolvedPathname:P,clientReferenceManifest:S,serverActionsManifest:_}=R,C=(0,l.normalizeAppPath)(y),j=!!(O.dynamicRoutes[C]||O.routes[P]),U=async()=>((null==k?void 0:k.render404)?await k.render404(e,t,A,!1):t.end("This page could not be found"),null);if(j&&!N){let e=!!O.routes[P],t=O.dynamicRoutes[C];if(t&&!1===t.fallback&&!e){if(b.experimental.adapterPath)return await U();throw new g.NoFallbackError}}let K=null;!j||T.isDev||N||(K="/index"===(K=P)?"/":K);let D=!0===T.isDev||!j,M=j&&!D;_&&S&&(0,o.setReferenceManifestsSingleton)({page:y,clientReferenceManifest:S,serverActionsManifest:_,serverModuleMap:(0,s.createServerModuleMap)({serverActionsManifest:_})});let $=e.method||"GET",H=(0,a.getTracer)(),z=H.getActiveScopeSpan(),F={params:x,prerenderManifest:O,renderOpts:{experimental:{authInterrupts:!!b.experimental.authInterrupts},cacheComponents:!!b.cacheComponents,supportsDynamicResponse:D,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:b.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n)=>T.onRequestError(e,t,n,k)},sharedContext:{buildId:E}},L=new u.NodeNextRequest(e),V=new u.NodeNextResponse(t),B=c.NextRequestAdapter.fromNodeNextRequest(L,(0,c.signalFromNodeResponse)(t));try{let o=async e=>T.handle(B,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=H.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${$} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${$} ${y}`)}),s=!!(0,i.getRequestMeta)(e,"minimalMode"),l=async i=>{var a,l;let u=async({previousCacheEntry:r})=>{try{if(!s&&q&&I&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await o(i);e.fetchMetrics=F.renderOpts.fetchMetrics;let l=F.renderOpts.pendingWaitUntil;l&&n.waitUntil&&(n.waitUntil(l),l=void 0);let u=F.renderOpts.collectedTags;if(!j)return await (0,h.sendResponse)(L,V,a,F.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,w.toNodeOutgoingHttpHeaders)(a.headers);u&&(t[f.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,n=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:q})},k),t}},c=await T.handleResponse({req:e,nextConfig:b,cacheKey:K,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:q,revalidateOnlyGenerated:I,responseGenerator:u,waitUntil:n.waitUntil,isMinimalMode:s});if(!j)return null;if((null==c||null==(a=c.value)?void 0:a.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",q?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,w.fromNodeOutgoingHttpHeaders)(c.value.headers);return s&&j||p.delete(f.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,m.getCacheControlHeader)(c.cacheControl)),await (0,h.sendResponse)(L,V,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};z?await l(z):await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${$} ${y}`,kind:a.SpanKind.SERVER,attributes:{"http.method":$,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:C,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:q})}),j)throw t;return await (0,h.sendResponse)(L,V,new Response(null,{status:500})),null}}e.s(["handler",()=>j,"patchFetch",()=>C,"routeModule",()=>T,"serverHooks",()=>_,"workAsyncStorage",()=>P,"workUnitAsyncStorage",()=>S],29729)}];

//# sourceMappingURL=OneDrive_Desktop_Optiq_CascadeProjects_windsurf-project_1c408d80._.js.map