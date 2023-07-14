import * as _ from 'lodash';

async function parse(inputArray) {
    // @TODO
    // 1. retrieve list from https://api.fliplet.com/v1/widgets/assets
    // 		note: you may need to use a CORS proxy
    const response = await fetch('https://api.fliplet.com/v1/widgets/assets', {
        mode: 'no-cors',
    });

    let assets = _.chain(inputArray)
        .map((assetName) => {
            const asset = _.get(response.assets, assetName);
            return asset.versions[asset.latestVersion];
        })
        .flatten()
        .value();

    // 2. parse the inputArray into a list of assets using the above list
    return Promise.resolve(assets);
}

parse(['bootstrap', 'fliplet-core', 'moment', 'jquery']).then(function (
    assets
) {
    console.log('The list is', assets);
});
