import KoaRouter from 'koa-router';
//import { Logger } from 'pino';
import KoaBody from 'koa-body';
import Axios from 'axios';
import * as yaml from 'js-yaml';
import { isArray } from 'util';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from 'pino';

const router = new KoaRouter();

router.use(KoaBody({ multipart: true }));

type FundingSource = {
    name: string,
    url: string,
    logo: string,
    originalId: string,
}

type FundingTemplate = {
    key: string,
    valueMatch?: RegExp,
    logoHandle: string,
    name: string,
    sort: string,
    urlTemplate: Handlebars.TemplateDelegate<any>;
}

let markdownTemplate = Handlebars.compile('(not initialized)');
let htmlTemplate = Handlebars.compile('(not initialized)');
let logoUrlTemplate = Handlebars.compile("https://www.vectorlogo.zone/logos/{{logoHandle}}/{{logoHandle}}-ar21.svg");

const ArrTemplate:FundingTemplate[] = [
    {
        key: "github",
        logoHandle: "github",
        name: "Github",
        sort: "github",
        urlTemplate: Handlebars.compile("https://github.com/{{id}}")
    },
    {
        key: "ko_fi",
        logoHandle: "ko-fi",
        name: "Ko-fi",
        sort: "kofi",
        urlTemplate: Handlebars.compile("https://ko-fi.com/{{id}}")
    },
    {
        key: "patreon",
        logoHandle: "patreon",
        name: "Patreon",
        sort: "patreon",
        urlTemplate: Handlebars.compile("https://patreon.com/{{id}}")
    },
    {
        key: "open_collective",
        logoHandle: "opencollective",
        name: "OpenCollective",
        sort: "opencollective",
        urlTemplate: Handlebars.compile("https://opencollective.com/{{id}}")
    },
    {
        key: "custom",
        valueMatch: new RegExp("^https://[^/]*amazon[^/]+/.*$", "i"),
        logoHandle: "amazon",
        name: "Amazon",
        sort: "amazon",
        urlTemplate: Handlebars.compile("{{{id}}}")
    }
];

function expandFundingSource(source: string, id: string): FundingSource | null {
    for (let template of ArrTemplate) {
        if (source !== template.key) {
            continue;
        }
        if (template.valueMatch && !template.valueMatch.test(id)) {
            continue;
        }
        return { 
            name: template.name, 
            logo: logoUrlTemplate({ logoHandle: template.logoHandle }), 
            url: template.urlTemplate({ id }), 
            originalId: id 
        };
    }
    return null;
}

function expandFundingSources(source: string, identifiers: string|string[]): FundingSource[] {
    const retVal: FundingSource[] = [];

    if (isArray(identifiers)) {
        for (let identifier of identifiers) {
            const fs = expandFundingSource(source, identifier);
            if (fs != null) {
                retVal.push(fs);
            }
        }
    } else {
        const fs = expandFundingSource(source, identifiers);
        if (fs != null) {
            retVal.push(fs);
        }
    }

    return retVal;
}

function process(logger: Logger, raw: string): object {
    const retVal:any = {};
    const data:any = yaml.safeLoad(raw);

    if (!data || typeof data === 'string') {
        logger.error( { raw: data }, "Invalid yaml")
        return {
            success: false,
            messages: [ "Invalid YAML" ]
        }
    }

    const sources:FundingSource[] = [];
    const messages:string[] = [];

    for (let key of Object.keys(data)) {
        if (!data[key]) {
            continue;
        }
        const fs:FundingSource[] = expandFundingSources(key, data[key]);
        if (fs.length === 0) {
            logger.info( { fundingSourceId: key, fundingSourceValue: data[key]}, 'Unknown funding source');
            messages.push(`Unknown funding source "${key}"`)
        } else {
            sources.push(...fs);
        }
    }

    // sort the sources

    retVal['data'] = sources;
    retVal['yaml'] = data;
    retVal['markdown'] = markdownTemplate({ sources });
    retVal['html'] = htmlTemplate({ sources });
    retVal['messages'] = messages;
    retVal['success'] = messages.length == 0;

    return retVal;
}

router.get('/api/funding.json', async (ctx) => {

    if ('url' in ctx.query == false) {
        const message = 'Missing "url" parameter';
        ctx.log.error( message )
        ctx.body = { success: false, message };
        return;
    }

    const url = ctx.query['url'];

    const axios = Axios.create({
        timeout: 10 * 1000,
        headers: {
            'User-Agent': 'VectorLogoZone-API/1.0'
        }
    });

    let data:string;

    try {
        const response = await axios.get(url);
        data = response.data;
    } catch (err) {
        ctx.body = { success: false, message: err.message };
        return;
    }
    ctx.log.debug( { data }, "Retrieved data");

    const results = process(ctx.log, data); 
    const retVal = results;
    const callback = ctx.request.query['callback'];
    if (callback && callback.match(/^[$A-Za-z_][0-9A-Za-z_$]*$/) != null) {
        ctx.type = 'text/javascript';
        ctx.body = callback + '(' + JSON.stringify(retVal, null, 2) + ');';
    } else {
        ctx.body = retVal;
    }
});

async function init() {
    markdownTemplate = Handlebars.compile(await fs.readFileSync(path.join(__dirname, '..', 'views/templates/markdown.hbs'), 'utf-8'));
    htmlTemplate = Handlebars.compile(await fs.readFileSync(path.join(__dirname, '..', 'views/templates/html.hbs'), 'utf-8'));
    
}

export { init, router }