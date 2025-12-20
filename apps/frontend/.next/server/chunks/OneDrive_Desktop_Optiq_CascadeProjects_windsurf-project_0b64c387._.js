module.exports=[71487,e=>{"use strict";function t(e){return{html:`## HTML Installation

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

Events will appear in your Optiq dashboard within a few minutes.`}}e.i(55007),e.s(["generateInstallInstructions",()=>t])},63355,e=>{"use strict";var t=e.i(56884),r=e.i(42064),n=e.i(1824),i=e.i(99326),o=e.i(18794),a=e.i(83629),s=e.i(41446),u=e.i(61251),l=e.i(5708),p=e.i(59092),c=e.i(99563),d=e.i(39870),h=e.i(8016),w=e.i(7624),f=e.i(70065),v=e.i(36141),g=e.i(93695);e.i(58762);var m=e.i(24378),R=e.i(70081),y=e.i(68050),E=e.i(46989),x=e.i(16336),I=e.i(60806),N=e.i(71487);let O=E.z.object({name:E.z.string().min(1).max(100).optional(),domain:E.z.string().min(1).max(255).regex(/^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/).optional()});async function T(e,{params:t}){try{let e=await (0,y.getServerSession)(x.authOptions);if(!e?.user?.id)return R.NextResponse.json({error:"Unauthorized"},{status:401});let r=e.user.activeOrgId;if(!r)return R.NextResponse.json({error:"No active organization"},{status:400});let{siteId:n}=await t,i=await I.prisma.trackingSite.findFirst({where:{id:n,organizationId:r},select:{id:!0,name:!0,domain:!0,publicKey:!0,createdAt:!0,updatedAt:!0,_count:{select:{events:!0,touchPoints:!0}}}});if(!i)return R.NextResponse.json({error:"Site not found"},{status:404});let o=(0,N.generateInstallInstructions)({publicKey:i.publicKey,domain:i.domain});return R.NextResponse.json({success:!0,site:{id:i.id,name:i.name,domain:i.domain,publicKey:i.publicKey,createdAt:i.createdAt,updatedAt:i.updatedAt,stats:{totalEvents:i._count.events,totalTouchPoints:i._count.touchPoints}},installation:o})}catch(e){return console.error("Failed to get tracking site:",e),R.NextResponse.json({error:"Internal server error"},{status:500})}}async function k(e,{params:t}){try{let r=await (0,y.getServerSession)(x.authOptions);if(!r?.user?.id)return R.NextResponse.json({error:"Unauthorized"},{status:401});let n=r.user.activeOrgId;if(!n)return R.NextResponse.json({error:"No active organization"},{status:400});let{siteId:i}=await t,o=await I.prisma.membership.findUnique({where:{userId_organizationId:{userId:r.user.id,organizationId:n}}});if(!o||!["OWNER","ADMIN"].includes(o.role))return R.NextResponse.json({error:"Insufficient permissions"},{status:403});if(!await I.prisma.trackingSite.findFirst({where:{id:i,organizationId:n}}))return R.NextResponse.json({error:"Site not found"},{status:404});let a=await e.json(),s=O.safeParse(a);if(!s.success)return R.NextResponse.json({error:"Validation failed",details:s.error.errors},{status:400});let u=await I.prisma.trackingSite.update({where:{id:i},data:s.data,select:{id:!0,name:!0,domain:!0,publicKey:!0,updatedAt:!0}});return R.NextResponse.json({success:!0,site:u})}catch(e){return console.error("Failed to update tracking site:",e),R.NextResponse.json({error:"Internal server error"},{status:500})}}async function A(e,{params:t}){try{let e=await (0,y.getServerSession)(x.authOptions);if(!e?.user?.id)return R.NextResponse.json({error:"Unauthorized"},{status:401});let r=e.user.activeOrgId;if(!r)return R.NextResponse.json({error:"No active organization"},{status:400});let{siteId:n}=await t,i=await I.prisma.membership.findUnique({where:{userId_organizationId:{userId:e.user.id,organizationId:r}}});if(!i||"OWNER"!==i.role)return R.NextResponse.json({error:"Only organization owners can delete tracking sites"},{status:403});if(!await I.prisma.trackingSite.findFirst({where:{id:n,organizationId:r}}))return R.NextResponse.json({error:"Site not found"},{status:404});return await I.prisma.trackingSite.delete({where:{id:n}}),R.NextResponse.json({success:!0,message:"Tracking site deleted successfully"})}catch(e){return console.error("Failed to delete tracking site:",e),R.NextResponse.json({error:"Internal server error"},{status:500})}}e.s(["DELETE",()=>A,"GET",()=>T,"PATCH",()=>k,"runtime",0,"nodejs"],67017);var b=e.i(67017);let S=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/sites/[siteId]/route",pathname:"/api/sites/[siteId]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/OneDrive/Desktop/Optiq/CascadeProjects/windsurf-project/apps/frontend/src/app/api/sites/[siteId]/route.ts",nextConfigOutput:"",userland:b}),{workAsyncStorage:q,workUnitAsyncStorage:C,serverHooks:P}=S;function _(){return(0,n.patchFetch)({workAsyncStorage:q,workUnitAsyncStorage:C})}async function j(e,t,n){S.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let R="/api/sites/[siteId]/route";R=R.replace(/\/index$/,"")||"/";let y=await S.prepare(e,t,{srcPage:R,multiZoneDraftMode:!1});if(!y)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:E,params:x,nextConfig:I,parsedUrl:N,isDraftMode:O,prerenderManifest:T,routerServerContext:k,isOnDemandRevalidate:A,revalidateOnlyGenerated:b,resolvedPathname:q,clientReferenceManifest:C,serverActionsManifest:P}=y,_=(0,u.normalizeAppPath)(R),j=!!(T.dynamicRoutes[_]||T.routes[q]),U=async()=>((null==k?void 0:k.render404)?await k.render404(e,t,N,!1):t.end("This page could not be found"),null);if(j&&!O){let e=!!T.routes[q],t=T.dynamicRoutes[_];if(t&&!1===t.fallback&&!e){if(I.experimental.adapterPath)return await U();throw new g.NoFallbackError}}let D=null;!j||S.isDev||O||(D="/index"===(D=q)?"/":D);let K=!0===S.isDev||!j,M=j&&!K;P&&C&&(0,a.setReferenceManifestsSingleton)({page:R,clientReferenceManifest:C,serverActionsManifest:P,serverModuleMap:(0,s.createServerModuleMap)({serverActionsManifest:P})});let H=e.method||"GET",$=(0,o.getTracer)(),z=$.getActiveScopeSpan(),F={params:x,prerenderManifest:T,renderOpts:{experimental:{authInterrupts:!!I.experimental.authInterrupts},cacheComponents:!!I.cacheComponents,supportsDynamicResponse:K,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:I.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n)=>S.onRequestError(e,t,n,k)},sharedContext:{buildId:E}},L=new l.NodeNextRequest(e),V=new l.NodeNextResponse(t),G=p.NextRequestAdapter.fromNodeNextRequest(L,(0,p.signalFromNodeResponse)(t));try{let a=async e=>S.handle(G,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=$.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${H} ${R}`)}),s=!!(0,i.getRequestMeta)(e,"minimalMode"),u=async i=>{var o,u;let l=async({previousCacheEntry:r})=>{try{if(!s&&A&&b&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await a(i);e.fetchMetrics=F.renderOpts.fetchMetrics;let u=F.renderOpts.pendingWaitUntil;u&&n.waitUntil&&(n.waitUntil(u),u=void 0);let l=F.renderOpts.collectedTags;if(!j)return await (0,h.sendResponse)(L,V,o,F.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,w.toNodeOutgoingHttpHeaders)(o.headers);l&&(t[v.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=v.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,n=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=v.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:m.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await S.onRequestError(e,t,{routerKind:"App Router",routePath:R,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:A})},k),t}},p=await S.handleResponse({req:e,nextConfig:I,cacheKey:D,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:b,responseGenerator:l,waitUntil:n.waitUntil,isMinimalMode:s});if(!j)return null;if((null==p||null==(o=p.value)?void 0:o.kind)!==m.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(u=p.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",A?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),O&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,w.fromNodeOutgoingHttpHeaders)(p.value.headers);return s&&j||c.delete(v.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,f.getCacheControlHeader)(p.cacheControl)),await (0,h.sendResponse)(L,V,new Response(p.value.body,{headers:c,status:p.value.status||200})),null};z?await u(z):await $.withPropagatedContext(e.headers,()=>$.trace(c.BaseServerSpan.handleRequest,{spanName:`${H} ${R}`,kind:o.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},u))}catch(t){if(t instanceof g.NoFallbackError||await S.onRequestError(e,t,{routerKind:"App Router",routePath:_,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:A})}),j)throw t;return await (0,h.sendResponse)(L,V,new Response(null,{status:500})),null}}e.s(["handler",()=>j,"patchFetch",()=>_,"routeModule",()=>S,"serverHooks",()=>P,"workAsyncStorage",()=>q,"workUnitAsyncStorage",()=>C],63355)}];

//# sourceMappingURL=OneDrive_Desktop_Optiq_CascadeProjects_windsurf-project_0b64c387._.js.map