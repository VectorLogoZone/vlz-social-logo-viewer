import KoaRouter from 'koa-router';
import { Logger} from 'pino';

import * as VLZ from './vlz';

type AnswerItem = {
    logo:string,
    name:string
    //LATER: tags, type
};

let answerItems: AnswerItem[];

async function init(logger:Logger, logos:VLZ.LogoInfo[]) {
    answerItems = [];
    for (var li of logos) {
        if (li.icon) {
            answerItems.push( { 
                logo: `https://www.vectorlogo.zone/logos/${li.logohandle}/${li.logohandle}-icon.svg`,
                name: li.name
            })
        }
    }
}

const router = new KoaRouter();

function getRandomInt(max:number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

router.get('/api/quiz.json', async (ctx) => {
    const results = new Set<AnswerItem>();
    while (results.size < 6) {
        results.add(answerItems[getRandomInt(answerItems.length)]);
    }
    const retVal = Array.from(results);
    const callback = ctx.request.query['callback'];
    if (callback && callback.match(/^[$A-Za-z_][0-9A-Za-z_$]*$/) != null) {
        ctx.type = 'text/javascript';
        ctx.body = callback + '(' + JSON.stringify(retVal) + ');';
    } else {
        ctx.body = retVal;
    }
});

export { init, router }