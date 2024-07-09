import {describe, it, expect, test} from '@jest/globals';
import "isomorphic-fetch";

import { setTimeout } from 'node:timers/promises';

const sleep = (index: number) => {
    return setTimeout(index * 1000);
};

import {setLicenseText} from "@luciad/ria/util/License";
import {AzureMapTilesModel, AzureTileSets} from "./AzureMapTilesModel";


setLicenseText(process.env.license);

describe('AzureMapTilesModel',  () => {
    const key: string = process.env.AZURE_KEY;
    const {AzureMapTilesModel, AzureTileSets} = require ("./AzureMapTilesModel");

    it('AzureMapTilesModel.getAttribution', async () => {
        const options: any = {
            key: key,
            tilesetId: AzureTileSets.Imagery
        }
        const model = new AzureMapTilesModel(options);
        model.getAttribution([ { level: 1, x: -180, y: -90, width: 360, height: 180 } ]);
        await sleep(2);
        const s = model.getAttribution([ { level: 1, x: -180, y: -90, width: 360, height: 180 } ]);
        expect(s.length).toBeGreaterThan(0);
    });

    it('AzureMapTilesModel.getTileURL', async () => {
        const options: any = {
            key: key,
            tilesetId: AzureTileSets.Imagery,
            version: "2024-04-01"
        }
        const model = new AzureMapTilesModel(options);
        const url = model.getTileURL(model.baseURL, { level: 1, x:0, y:0});
        expect(url).toMatch(/(api-version=2024-04-01&tilesetId=microsoft.imagery&zoom=1&x=0&y=1&tileSize=256&language=en-US&view=Auto&subscription-key=)/i)
    });

    test('AzureMapTilesModel.getImage',  async () => {
        const options: any = {
            key: key,
            tilesetId: AzureTileSets.Imagery,
            version: "2024-04-01"
        }
        const model = new AzureMapTilesModel(options);

        const fetchData = () => {
            return new Promise((resolve, reject)=>{
                model.getImage({level:1, x:0, y:0}, (tile, image)=>{
                    resolve({tile, image})
                }, (tile, error)=>{
                    reject()
                }, undefined);
            })
        }

        return fetchData().then((tileData:any)=>{
            expect(tileData.image.width).toBe(256)
        }).catch(()=>{
            expect(false).toBe(true)
        })

    });
})
