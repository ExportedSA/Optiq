/**
 * Identity signals that can be used to identify a visitor
 */
export interface IdentitySignals {
    anonymousId?: string;
    deviceId?: string;
    emailHash?: string;
    phoneHash?: string;
    customerId?: string;
    externalId?: string;
}
/**
 * Identity resolution result
 */
export interface IdentityResolution {
    identityKey: string;
    identityId: string;
    isNew: boolean;
    mergedFrom?: string[];
}
/**
 * Resolve identity from signals
 *
 * This is the main entry point for identity resolution.
 * It will find or create an identity and merge if necessary.
 */
export declare function resolveIdentity(organizationId: string, siteId: string, signals: IdentitySignals): Promise<IdentityResolution>;
/**
 * Get identity by key
 */
export declare function getIdentityByKey(identityKey: string): Promise<({
    aliases: {
        id: string;
        createdAt: Date;
        firstSeenAt: Date;
        lastSeenAt: Date;
        identityId: string;
        aliasType: string;
        aliasValue: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    externalId: string | null;
    siteId: string;
    eventCount: number;
    anonymousId: string | null;
    emailHash: string | null;
    phoneHash: string | null;
    customerId: string | null;
    identityKey: string;
    deviceId: string | null;
    firstSeenAt: Date;
    lastSeenAt: Date;
}) | null>;
/**
 * Get identity merge history
 */
export declare function getIdentityMergeHistory(identityId: string): Promise<{
    id: string;
    createdAt: Date;
    organizationId: string;
    sourceIdentityId: string;
    targetIdentityId: string;
    mergeReason: string;
    matchingField: string | null;
    matchingValue: string | null;
    mergedAt: Date;
    mergedBy: string | null;
    sourceAliasCount: number;
    targetAliasCount: number;
}[]>;
//# sourceMappingURL=identity-resolver.d.ts.map