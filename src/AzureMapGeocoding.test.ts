import {describe, it, expect} from '@jest/globals';
import {jest} from '@jest/globals';
import "isomorphic-fetch";

import {AzureMapGeocoding} from "./AzureMapGeocoding";

jest.useFakeTimers();

describe('AzureMapGeocoding',  () => {
    it('AzureMapGeocoding.query', async () => {
        const query = {
            key: process.env.AZURE_KEY,
            lon: -0.118092,
            lat: 51.509865,
        };
        const promiseToResponse = AzureMapGeocoding.query(query) as Promise<any>;
        return promiseToResponse.then(response => {
            const counter = response.features.length;
            if (counter<1) {
                expect(counter).toBeGreaterThan(0);
            } else {
                const feature = response.features[0];
                expect(feature.properties.address.locality).toBe("London");
            }
        }, (err) => {
            expect(true).toBe(false);
        })
    });
})
