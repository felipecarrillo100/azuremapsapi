import {describe, it, expect} from '@jest/globals';
import {jest} from '@jest/globals';
import "isomorphic-fetch";

import {AzureMapSearchAddress} from "./AzureMapSearchAddress";

jest.useFakeTimers();

describe('AzureMapSearchAddress',  () => {
    it('AzureMapSearchAddress.query', async () => {
        const query = {
            key: process.env.AZURE_KEY,
            query: "London",
        };
        const promiseToResponse = AzureMapSearchAddress.query(query) as Promise<any>;
        return promiseToResponse.then(response => {
            const counter = response.results.length;
            if (counter<1) {
                expect(counter).toBeGreaterThan(0);
            } else {
                const result = response.results[0];
                expect(result.address.municipality).toBe("London");
            }
        }, (err) => {
            expect(true).toBe(false);
        })
    });
})
