interface AzureMapSearchAddressQuery {
    key: string;
    query: string;
    version?: string;
    language?: string;
}
export class AzureMapSearchAddress {
    public static query(query: AzureMapSearchAddressQuery) {
        return new Promise((resolve, reject)=>{
            const url = "https://atlas.microsoft.com/search/address/json";
            const version = query.version ? query.version : "1.0";
            const language = query.language ? query.language : "en-US";
            const text = query.query ? query.query : "";
            const request = `${url}?subscription-key=${query.key}&api-version=${version}&language=${language}&query=${text}`
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
