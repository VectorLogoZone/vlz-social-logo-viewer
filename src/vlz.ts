import KoaRouter from 'koa-router';
import rp from 'request-promise-native';
import { Logger} from 'pino';
import { URL } from "url";

type LogoInfo = {
    ar21: boolean,
    icon: boolean,
    logohandle: string,
    name: string,
    website: string
};

let logoMap:{[key: string]: LogoInfo} = {};
let domainMap:{[key: string]: string[]} = {};
let _logger:Logger;

function getBaseDomain(logger:Logger, website:string): string {

    try {
        let hostname:string = new URL(website).hostname;

        if (hostname.startsWith("www.")) {
            hostname = hostname.slice(4);
        }

        return hostname;
    }
    catch (err) {
        logger.warn({ err, website }, 'Unable to parse website');
        return website;
    }
}

async function init(logger:Logger) {
    _logger = logger;

    const options = {
        headers: { 'User-Agent': 'VectorLogoZone/1.0 (https://www.vectorlogo.zone/)' },
        json: true,
        uri: 'https://www.vectorlogo.zone/util/apidata.json'
    };

    let rawData:LogoInfo[];

    try {
        rawData = (await rp(options));
        logger.info({ vlzCount: rawData.length }, "VLZ data loaded");
        for (var logoInfo of rawData) {
            logoMap[logoInfo.logohandle] = logoInfo;
            const baseDomain = getBaseDomain(logger, logoInfo.website)
            if (baseDomain in domainMap) {
                domainMap[baseDomain].push(logoInfo.name );
            } else {
                domainMap[baseDomain] = [ logoInfo.name ];
            }
        }
    } catch (err) {
        logger.error(err, "Unable to load VLZ data");
        return;
    }
}

function getLogoName(logohandle:string): string {
    if (logohandle in logoMap) {
        return logoMap[logohandle].name;
    }
    return logohandle;
}

const router = new KoaRouter();

router.get('/api/existing.json', async (ctx) => {

    let url = ctx.query['url'];
    if (!url) {
        ctx.body = { success: false, message: 'Missing "url" parameter' };
        return;
    }

    const baseName = getBaseDomain(_logger, url);

    if (baseName in domainMap == false) {
        ctx.body = { success: true, message: 'Not found', exists: false, url };
        return;
    }

    const duplicates = domainMap[baseName];

    ctx.body = { success: true, message: 'Found', duplicates, exists: true, url };
});

export { init, router, getLogoName }