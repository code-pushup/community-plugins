import {describe, expect, it} from "vitest";
import {bundleSizeRunner} from "./runner";

describe('bundleSizeRunner', () => {

    it('should have slug of "bundle-size"', async () => {
        const runnerFunction = bundleSizeRunner({timeout: 0});
        const auditOutputs = await runnerFunction(undefined);
        expect(auditOutputs.at(0)?.slug).toBe('bundle-size');
    });

});
