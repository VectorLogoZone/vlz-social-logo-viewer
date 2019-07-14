import KoaRouter from 'koa-router';
import { Logger } from 'pino';

import * as VLZ from './vlz';

const router = new KoaRouter();

const logos:VLZ.LogoInfo[] = []

async function init(logger: Logger, allLogos: VLZ.LogoInfo[]) {
    for (var li of allLogos) {
        if (li.icon && li.ar21) {
            logos.push(li);
        }
    }
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}


router.get('/api/random.json', async (ctx) => {

    if (logos.length === 0) {
        init(ctx.logger, VLZ.getLogos());
    }

    const retVal = logos[getRandomInt(logos.length)];
    
    const callback = ctx.request.query['callback'];
    if (callback && callback.match(/^[$A-Za-z_][0-9A-Za-z_$]*$/) != null) {
        ctx.type = 'text/javascript';
        ctx.body = callback + '(' + JSON.stringify(retVal) + ');';
    } else {
        ctx.body = retVal;
    }
});

export { init, router }