module.exports=[54799,(e,t,n)=>{t.exports=e.x("crypto",()=>require("crypto"))},1466,91490,42960,37966,e=>{"use strict";let t={fatal:60,error:50,warn:40,info:30,debug:20,trace:10,silent:1/0};class n{name;level;bindings;constructor(e={},n={}){this.name=e.name??"optiq",this.level=t[e.level??"info"],this.bindings=n}shouldLog(e){return t[e]>=this.level}formatMessage(e,t,n,r){if(!this.shouldLog(e))return;let a=new Date().toISOString(),i=`[${a}] ${e.toUpperCase()} (${this.name})`;if("string"==typeof t)return void console[e](i,t,...void 0!==n?[n,...r||[]]:r||[]);let o={...this.bindings,...t};Object.keys(o).length>0?console[e](i,n||"",o,...r||[]):console[e](i,n||"",...r||[])}fatal(e,t,...n){this.formatMessage("error",e,t,n)}error(e,t,...n){this.formatMessage("error",e,t,n)}warn(e,t,...n){this.formatMessage("warn",e,t,n)}info(e,t,...n){this.formatMessage("info",e,t,n)}debug(e,t,...n){this.formatMessage("debug",e,t,n)}trace(e,t,...n){this.formatMessage("debug",e,t,n)}child(e){return new n({name:this.name,level:Object.keys(t).find(e=>t[e]===this.level)},{...this.bindings,...e})}}!function(e={}){new n(e)}();var r=e.i(46989);let a=r.z.enum(["GOOGLE_ADS","META","TIKTOK","LINKEDIN","X"]),i=r.z.string().regex(/^\d{4}-\d{2}-\d{2}$/);r.z.object({channel:a,date:i,campaign_id:r.z.string().min(1),campaign_name:r.z.string().min(1).optional(),adset_id:r.z.string().min(1).optional(),adset_name:r.z.string().min(1).optional(),ad_id:r.z.string().min(1).optional(),ad_name:r.z.string().min(1).optional(),spend_micros:r.z.bigint().nonnegative(),clicks:r.z.bigint().nonnegative(),impressions:r.z.bigint().nonnegative(),publisher_platform:r.z.string().min(1).optional()});let o={FREE:{tier:"FREE",name:"Free",description:"Get started with basic tracking",limits:{maxWorkspaces:1,maxConnectors:1,monthlyEventLimit:1e3,dataRetentionDays:7,attributionModels:["LAST_TOUCH"],alertsEnabled:!1,ssoEnabled:!1,prioritySupport:!1},pricing:{monthlyPriceCents:0,annualPriceCents:0,overageEventsPer10kCents:0,overageConnectorCents:0},features:["1 workspace","1 ad platform connector","1,000 events/month","Last-touch attribution","7-day data retention"]},STARTER:{tier:"STARTER",name:"Starter",description:"For small teams getting started with attribution",limits:{maxWorkspaces:1,maxConnectors:2,monthlyEventLimit:1e4,dataRetentionDays:14,attributionModels:["FIRST_TOUCH","LAST_TOUCH","LINEAR"],alertsEnabled:!1,ssoEnabled:!1,prioritySupport:!1},pricing:{monthlyPriceCents:4900,annualPriceCents:47e3,overageEventsPer10kCents:500,overageConnectorCents:1500},features:["1 workspace","2 ad platform connectors","10,000 events/month","First, last & linear attribution","14-day data retention","Email support"]},GROWTH:{tier:"GROWTH",name:"Growth",description:"For growing teams who need full attribution insights",limits:{maxWorkspaces:3,maxConnectors:10,monthlyEventLimit:1e5,dataRetentionDays:90,attributionModels:["FIRST_TOUCH","LAST_TOUCH","LINEAR","TIME_DECAY","POSITION_BASED"],alertsEnabled:!0,ssoEnabled:!1,prioritySupport:!1},pricing:{monthlyPriceCents:14900,annualPriceCents:143e3,overageEventsPer10kCents:400,overageConnectorCents:1e3},features:["3 workspaces","All ad platform connectors","100,000 events/month","All attribution models","90-day data retention","Waste & CPA alerts","Priority email support"],recommended:!0},SCALE:{tier:"SCALE",name:"Scale",description:"For enterprises with advanced needs",limits:{maxWorkspaces:-1,maxConnectors:-1,monthlyEventLimit:1e6,dataRetentionDays:365,attributionModels:["FIRST_TOUCH","LAST_TOUCH","LINEAR","TIME_DECAY","POSITION_BASED","DATA_DRIVEN"],alertsEnabled:!0,ssoEnabled:!0,prioritySupport:!0},pricing:{monthlyPriceCents:49900,annualPriceCents:479e3,overageEventsPer10kCents:300,overageConnectorCents:500},features:["Unlimited workspaces","Unlimited connectors","1,000,000+ events/month","All attribution models + data-driven","365-day data retention","Custom lookback windows","SSO/SAML (coming soon)","Dedicated support","SLA guarantee"]}};function s(e){return o[e]}function c(e){return o[e].limits}function l(e){return -1===e}function d(e,t,n){let r=Math.max(0,e.trackedEvents-t.monthlyEventLimit),a=l(t.maxConnectors)?0:Math.max(0,e.connectedAccounts-t.maxConnectors),i=Math.ceil(r/1e4)*n.overageEventsPer10kCents,o=a*n.overageConnectorCents;return{eventsOverage:r,connectorsOverage:a,eventsOverageCents:i,connectorsOverageCents:o,totalOverageCents:i+o}}function m(e,t){let n=[];return!l(t.maxWorkspaces)&&e.workspacesUsed>t.maxWorkspaces&&n.push(`Workspace limit exceeded (${e.workspacesUsed}/${t.maxWorkspaces})`),!l(t.maxConnectors)&&e.connectedAccounts>t.maxConnectors&&n.push(`Connector limit exceeded (${e.connectedAccounts}/${t.maxConnectors})`),e.trackedEvents>1.5*t.monthlyEventLimit&&n.push(`Event limit significantly exceeded (${e.trackedEvents}/${t.monthlyEventLimit})`),{withinLimits:0===n.length,violations:n}}function u(e,t){let n=["FREE","STARTER","GROWTH","SCALE"];return n.indexOf(t)>n.indexOf(e)}function g(e,t){let n=["FREE","STARTER","GROWTH","SCALE"];return n.indexOf(t)<n.indexOf(e)}function E(e){let t=["FREE","STARTER","GROWTH","SCALE"],n=t.indexOf(e);return n<t.length-1?t[n+1]:null}e.s(["PLAN_DEFINITIONS",0,o,"calculateOverages",()=>d,"canDowngrade",()=>g,"canUpgrade",()=>u,"checkLimits",()=>m,"getPlanDefinition",()=>s,"getPlanLimits",()=>c,"getUpgradePath",()=>E,"isUnlimited",()=>l],91490),e.s([],42960),e.i(54799);let p=r.z.enum(["development","staging","production"]);class v extends Error{details;constructor(e,t){super(e),this.name="EnvValidationError",this.details=t}}function C(e,t,n={}){let r=e.safeParse(t);if(r.success)return r.data;let a=new Set(n.redactKeys??[]),i={};for(let[e,n]of Object.entries(t))i[e]=a.has(e)?"[REDACTED]":n;let o=function(e){let t=e.flatten(),n=[];for(let[e,r]of Object.entries(t.fieldErrors))Array.isArray(r)&&r.length>0&&n.push(`  • ${e}: ${r.join(", ")}`);return t.formErrors.length>0&&n.push(`  • ${t.formErrors.join(", ")}`),{formErrors:t.formErrors,fieldErrors:t.fieldErrors,readableMessage:n.length>0?`
${n.join("\n")}`:"Unknown validation error"}}(r.error);throw new v(`
╔════════════════════════════════════════════════════════════════════════════╗
║ ENVIRONMENT CONFIGURATION ERROR                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

Your application failed to start due to invalid or missing environment variables.

ERRORS:${o.readableMessage}

TROUBLESHOOTING:
  1. Copy .env.example to .env if you haven't already
  2. Fill in all required values in your .env file
  3. Ensure all values match the expected format (URLs, numbers, etc.)
  4. Check that sensitive values meet minimum length requirements

For more details, see .env.example in the project root.
`,{errors:o,snapshot:i})}function h(e){return{appEnv:e,isDevelopment:"development"===e,isStaging:"staging"===e,isProduction:"production"===e}}e.s(["AppEnvSchema",0,p,"buildEnvMeta",()=>h,"loadEnv",()=>C],37966),e.s([],1466)},12941,e=>{"use strict";e.i(42960);var t=e.i(91490);e.s(["PLAN_DEFINITIONS",()=>t.PLAN_DEFINITIONS,"calculateOverages",()=>t.calculateOverages])},64137,e=>{"use strict";var t=e.i(60806);e.i(25330);var n=e.i(96685);e.i(1466);var r=e.i(12941);async function a(e){let r=n.appLogger.child({job:"usage-aggregation"}),a=e?.backfillDays??(process.env.USAGE_BACKFILL_DAYS?parseInt(process.env.USAGE_BACKFILL_DAYS,10):1);r.info("Starting usage aggregation",{backfillDays:a,organizationId:e?.organizationId});let o={processedSubscriptions:0,processedDays:0,errors:0},s=new Date;s.setHours(0,0,0,0);let c=await t.prisma.subscription.findMany({where:{status:{in:["ACTIVE","TRIALING"]}},select:{id:!0,organizationId:!0,plan:!0,monthlyEventLimit:!0,currentPeriodStart:!0,currentPeriodEnd:!0}}),l=e?.organizationId?c.filter(t=>t.organizationId===e.organizationId):c;r.info(`Processing ${l.length} subscriptions`);for(let e=a;e>=1;e--){let t=new Date(s);t.setDate(t.getDate()-e);let n=new Date(t);for(let e of(n.setDate(n.getDate()+1),r.debug(`Processing date: ${t.toISOString().split("T")[0]}`),l))try{await i(e,t,n,r),o.processedDays++}catch(t){r.error(`Error aggregating usage for subscription ${e.id}`,t),o.errors++}o.processedSubscriptions=l.length}return r.info("Usage aggregation completed",{...o}),o}async function i(e,n,a,i){let{organizationId:o}=e,s=(await t.prisma.trackingSite.findMany({where:{organizationId:o},select:{id:!0}})).map(e=>e.id),c=0,l=0,d=0;if(s.length>0)for(let e of(await t.prisma.$queryRaw`
      SELECT "eventType", COUNT(*) as count
      FROM "TrackingEvent"
      WHERE "siteId" = ANY(${s})
        AND "occurredAt" >= ${n}
        AND "occurredAt" < ${a}
      GROUP BY "eventType"
    `)){let t=Number(e.count);switch(e.eventType){case"PAGE_VIEW":c=t;break;case"CONVERSION":l=t;break;default:d+=t}}let m=c+l+d,u=await t.prisma.adAccount.count({where:{organizationId:o,status:"ACTIVE"}}),g=await t.prisma.campaign.count({where:{organizationId:o,status:"ACTIVE"}});await t.prisma.$executeRaw`
    INSERT INTO "DailyUsageCounter" (
      "id", "organizationId", "date",
      "pageViews", "conversions", "customEvents", "totalEvents",
      "activeConnectors", "activeCampaigns",
      "createdAt", "updatedAt"
    )
    VALUES (
      gen_random_uuid()::text, ${o}, ${n},
      ${c}, ${l}, ${d}, ${m},
      ${u}, ${g},
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
  `,p=Number(E[0]?.total??0),v=e.plan,C=r.PLAN_DEFINITIONS[v]??r.PLAN_DEFINITIONS.FREE,h={maxWorkspaces:C.limits.maxWorkspaces,maxConnectors:C.limits.maxConnectors,monthlyEventLimit:e.monthlyEventLimit??C.limits.monthlyEventLimit,dataRetentionDays:C.limits.dataRetentionDays,attributionModels:C.limits.attributionModels,alertsEnabled:C.limits.alertsEnabled,ssoEnabled:C.limits.ssoEnabled,prioritySupport:C.limits.prioritySupport},A=(0,r.calculateOverages)({trackedEvents:p,connectedAccounts:u,workspacesUsed:1},h,C.pricing);await t.prisma.$executeRaw`
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
      ${p}, ${u}, 1,
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
  `,i.debug(`Aggregated usage for org ${o}: ${m} events yesterday, ${p} period total`)}e.s(["runUsageAggregation",()=>a])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__252401ff._.js.map