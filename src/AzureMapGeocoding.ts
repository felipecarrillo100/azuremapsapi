interface AzureMapGeocodingQuery {
    key: string;
    lon: number;
    lat: number;
    version?: string;
    language?: string;
}
export class AzureMapGeocoding {
    public static query(query: AzureMapGeocodingQuery) {
        return new Promise((resolve, reject)=>{
            const url = "https://atlas.microsoft.com/reverseGeocode";
            const version = query.version ? query.version : "2023-06-01";
            const coordinates = `${query.lon},${query.lat}`;
            const language = query.language ? query.language : "en-US";
            const request = `${url}?subscription-key=${query.key}&api-version=${version}&language=${language}&coordinates=${coordinates}`
            fetch(request).then(response=>{
                if(response.ok) {
                    response.json().then(data=>resolve(data)).catch(reject);
                } else {
                    reject();
                }
            }).catch(reject)
        })
    }
}
