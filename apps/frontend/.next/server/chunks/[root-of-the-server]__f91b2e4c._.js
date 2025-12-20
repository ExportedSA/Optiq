module.exports=[14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},62562,(e,t,r)=>{t.exports=e.x("module",()=>require("module"))},50227,(e,t,r)=>{t.exports=e.x("node:path",()=>require("node:path"))},48934,e=>{e.v({name:"thread-stream",version:"3.1.0",description:"A streaming way to send data to a Node.js Worker Thread",main:"index.js",types:"index.d.ts",dependencies:{"real-require":"^0.2.0"},devDependencies:{"@types/node":"^20.1.0","@types/tap":"^15.0.0","@yao-pkg/pkg":"^5.11.5",desm:"^1.3.0",fastbench:"^1.0.1",husky:"^9.0.6","pino-elasticsearch":"^8.0.0","sonic-boom":"^4.0.1",standard:"^17.0.0",tap:"^16.2.0","ts-node":"^10.8.0",typescript:"^5.3.2","why-is-node-running":"^2.2.2"},scripts:{build:"tsc --noEmit",test:'standard && npm run build && npm run transpile && tap "test/**/*.test.*js" && tap --ts test/*.test.*ts',"test:ci":"standard && npm run transpile && npm run test:ci:js && npm run test:ci:ts","test:ci:js":'tap --no-check-coverage --timeout=120 --coverage-report=lcovonly "test/**/*.test.*js"',"test:ci:ts":'tap --ts --no-check-coverage --coverage-report=lcovonly "test/**/*.test.*ts"',"test:yarn":'npm run transpile && tap "test/**/*.test.js" --no-check-coverage',transpile:"sh ./test/ts/transpile.sh",prepare:"husky install"},standard:{ignore:["test/ts/**/*","test/syntax-error.mjs"]},repository:{type:"git",url:"git+https://github.com/mcollina/thread-stream.git"},keywords:["worker","thread","threads","stream"],author:"Matteo Collina <hello@matteocollina.com>",license:"MIT",bugs:{url:"https://github.com/mcollina/thread-stream/issues"},homepage:"https://github.com/mcollina/thread-stream#readme"})},27699,(e,t,r)=>{t.exports=e.x("events",()=>require("events"))},37702,(e,t,r)=>{t.exports=e.x("worker_threads",()=>require("worker_threads"))},92509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},874,(e,t,r)=>{t.exports=e.x("buffer",()=>require("buffer"))},49719,(e,t,r)=>{t.exports=e.x("assert",()=>require("assert"))},60526,(e,t,r)=>{t.exports=e.x("node:os",()=>require("node:os"))},87769,(e,t,r)=>{t.exports=e.x("node:events",()=>require("node:events"))},77652,(e,t,r)=>{t.exports=e.x("node:diagnostics_channel",()=>require("node:diagnostics_channel"))},22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},12941,e=>{"use strict";e.i(42960);var t=e.i(91490);e.s(["PLAN_DEFINITIONS",()=>t.PLAN_DEFINITIONS,"calculateOverages",()=>t.calculateOverages])},64137,e=>{"use strict";var t=e.i(60806);e.i(25330);var r=e.i(96685);e.i(1466);var s=e.i(12941);async function a(e){let s=r.appLogger.child({job:"usage-aggregation"}),a=e?.backfillDays??(process.env.USAGE_BACKFILL_DAYS?parseInt(process.env.USAGE_BACKFILL_DAYS,10):1);s.info("Starting usage aggregation",{backfillDays:a,organizationId:e?.organizationId});let o={processedSubscriptions:0,processedDays:0,errors:0},i=new Date;i.setHours(0,0,0,0);let c=await t.prisma.subscription.findMany({where:{status:{in:["ACTIVE","TRIALING"]}},select:{id:!0,organizationId:!0,plan:!0,monthlyEventLimit:!0,currentPeriodStart:!0,currentPeriodEnd:!0}}),d=e?.organizationId?c.filter(t=>t.organizationId===e.organizationId):c;s.info(`Processing ${d.length} subscriptions`);for(let e=a;e>=1;e--){let t=new Date(i);t.setDate(t.getDate()-e);let r=new Date(t);for(let e of(r.setDate(r.getDate()+1),s.debug(`Processing date: ${t.toISOString().split("T")[0]}`),d))try{await n(e,t,r,s),o.processedDays++}catch(t){s.error(`Error aggregating usage for subscription ${e.id}`,t),o.errors++}o.processedSubscriptions=d.length}return s.info("Usage aggregation completed",{...o}),o}async function n(e,r,a,n){let{organizationId:o}=e,i=(await t.prisma.trackingSite.findMany({where:{organizationId:o},select:{id:!0}})).map(e=>e.id),c=0,d=0,p=0;if(i.length>0)for(let e of(await t.prisma.$queryRaw`
      SELECT "eventType", COUNT(*) as count
      FROM "TrackingEvent"
      WHERE "siteId" = ANY(${i})
        AND "occurredAt" >= ${r}
        AND "occurredAt" < ${a}
      GROUP BY "eventType"
    `)){let t=Number(e.count);switch(e.eventType){case"PAGE_VIEW":c=t;break;case"CONVERSION":d=t;break;default:p+=t}}let u=c+d+p,l=await t.prisma.adAccount.count({where:{organizationId:o,status:"ACTIVE"}}),g=await t.prisma.campaign.count({where:{organizationId:o,status:"ACTIVE"}});await t.prisma.$executeRaw`
    INSERT INTO "DailyUsageCounter" (
      "id", "organizationId", "date",
      "pageViews", "conversions", "customEvents", "totalEvents",
      "activeConnectors", "activeCampaigns",
      "createdAt", "updatedAt"
    )
    VALUES (
      gen_random_uuid()::text, ${o}, ${r},
      ${c}, ${d}, ${p}, ${u},
      ${l}, ${g},
      NOW(), NOW()
    )
    ON CONFLICT ("organizationId", "date")
    DO UPDATE SET
      "pageViews" = EXCLUDED."pageViews",
      "conversions" = EXCLUDED."conversions",
      "customEvents" = EXCLUDED."customEvents",
      "totalEvents" = EXCLUDED."totalEvents",
      "activeConnectors" = EXCLUDED."activeConnectors",
      "activeCampaigns" = EXCLUDED."activeCampaigns",
      "updatedAt" = NOW()
  `;let E=await t.prisma.$queryRaw`
    SELECT COALESCE(SUM("totalEvents"), 0) as total
    FROM "DailyUsageCounter"
    WHERE "organizationId" = ${o}
      AND "date" >= ${e.currentPeriodStart}
      AND "date" <= ${e.currentPeriodEnd}
  `,m=Number(E[0]?.total??0),v=e.plan,D=s.PLAN_DEFINITIONS[v]??s.PLAN_DEFINITIONS.FREE,h={maxWorkspaces:D.limits.maxWorkspaces,maxConnectors:D.limits.maxConnectors,monthlyEventLimit:e.monthlyEventLimit??D.limits.monthlyEventLimit,dataRetentionDays:D.limits.dataRetentionDays,attributionModels:D.limits.attributionModels,alertsEnabled:D.limits.alertsEnabled,ssoEnabled:D.limits.ssoEnabled,prioritySupport:D.limits.prioritySupport},A=(0,s.calculateOverages)({trackedEvents:m,connectedAccounts:l,workspacesUsed:1},h,D.pricing);await t.prisma.$executeRaw`
    INSERT INTO "UsageRecord" (
      "id", "subscriptionId", "organizationId",
      "periodStart", "periodEnd",
      "trackedEvents", "connectedAccounts", "workspacesUsed",
      "eventsOverage", "connectorsOverage", "overageAmountCents",
      "createdAt", "updatedAt"
    )
    VALUES (
      gen_random_uuid()::text, ${e.id}, ${o},
      ${e.currentPeriodStart}, ${e.currentPeriodEnd},
      ${m}, ${l}, 1,
      ${A.eventsOverage}, ${A.connectorsOverage}, ${A.totalOverageCents},
      NOW(), NOW()
    )
    ON CONFLICT ("subscriptionId", "periodStart")
    DO UPDATE SET
      "trackedEvents" = EXCLUDED."trackedEvents",
      "connectedAccounts" = EXCLUDED."connectedAccounts",
      "eventsOverage" = EXCLUDED."eventsOverage",
      "connectorsOverage" = EXCLUDED."connectorsOverage",
      "overageAmountCents" = EXCLUDED."overageAmountCents",
      "updatedAt" = NOW()
  `,n.debug(`Aggregated usage for org ${o}: ${u} events yesterday, ${m} period total`)}e.s(["runUsageAggregation",()=>a])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__f91b2e4c._.js.map