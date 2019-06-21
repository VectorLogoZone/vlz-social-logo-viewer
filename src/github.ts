import KoaRouter from 'koa-router';

//import * as fs from 'fs';
//import * as path from 'path';
import rp from 'request-promise-native';

const router = new KoaRouter();

router.get('/api/github.json', async (ctx) => {

    let githubId = ctx.query["id"];
    if (!githubId) {
        ctx.body = { success: false, message: 'Missing Github ID ("id" parameter")'};
        return;
    }

    const slashPos = githubId.indexOf('/');
    if (slashPos > 0) {
        githubId = githubId.slice(0, slashPos);
    }

    if (!githubId.match( /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i )) {
        ctx.body = { success: false, id: githubId, message: 'Invalid Github ID ("id" parameter)'};
        return;
    }

    const options = {
        headers: { 'User-Agent': 'VectorLogoZone/1.0 (https://www.vectorlogo.zone/)' },
        json: true,
        uri: `https://api.github.com/users/${githubId}`
    };

    try {
        const url = (await rp(options)).avatar_url;

        ctx.body = {
            success: true,
            message: "OK",
            results: [{url: url, description: "Github Profile Image", id: githubId, source: `https://github.com/${githubId}`}]
        };
    } catch (err) {
        ctx.body = { success: false, id: githubId, message: err.message, err };
    }
});


export { router }