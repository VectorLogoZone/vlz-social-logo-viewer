import * as KoaRouter from 'koa-router';
import * as Pino from 'pino';
import { URL } from "url";

let _logger:Pino.Logger;

function init(logger:Pino.Logger) {
    logger.info("oEmbed support data loaded");
    _logger
}

const router = new KoaRouter();

router.get('/oembed/', async (ctx) => {
    ctx.redirect('index.html');
});

router.get('/oembed/index.html', async (ctx) => {
    await ctx.render('oembed/index.hbs', { title: 'oEmbed Test Page' , logohandle: 'vectorlogozone'});
});

router.get('/oembed/iframe.html', async (ctx) => {
    let logohandle = ctx.query['logohandle'];
    if (!logohandle) {
        ctx.status = 404;
        return;
    }
    await ctx.render('oembed/iframe.hbs', { logohandle, title: logohandle });   //LATER: pull title from VLZ
});

router.get('/oembed/oembed.json', async (ctx) => {

    let url = ctx.query['url'];
    if (!url) {
        ctx.status = 404;
        ctx.body = { success: false, message: 'Missing "url" parameter' };
        return;
    }

    let maxWidth = 1024;
    try {
        if ("maxwidth" in ctx.query) {
            maxWidth = Number(ctx.query['maxwidth'])
        }
    } catch (err) {
        // do nothing
    }

    let maxHeight = 500;
    try {
        if ("maxheight" in ctx.query) {
            maxHeight = Number(ctx.query['maxheight'])
        }
    } catch (err) {
        // do nothing
    }

    let width = maxWidth;
    let height = width > 768 ? 250 : (width + 1200) / 4;
    if (height > maxHeight) {
        ctx.log.info({ height, maxHeight, url, headers: ctx.headers }, "Max height exceeded");
        width = maxHeight;
    }

    let format = "json";
    try {
        format = ctx.query['format'];
    } catch (err) {
        // do nothing
    }
    if (format && format != 'json') {
        ctx.status = 501;
        ctx.body = { success: false, message: 'Only JSON oEmbed is supported'};
        return;
    }

    let pathname:string = new URL(url).pathname;

    let logohandle = "vectorlogozone";
    if (pathname.startsWith("/logos/")) {
        pathname = pathname.slice(7);
        const slashpos = pathname.indexOf('/');
        if (slashpos > 0) {
            logohandle = pathname.slice(0, slashpos);
        }
    }

    const thumbsize = 256;

    try {

        const result: any = {};
        result['version'] = '1.0';
        result['type'] = 'rich';

        result["provider_name"] = "VectorLogoZone";
        result["provider_url"] = "https://www.vectorlogo.zone/";

        result["author_name"] =  "VectorLogoZone";
        result["author_url"] = "https://github.com/VectorLogoZone";

        result["html"] = `<iframe src=\"https://api.vectorlogo.zone/oembed/iframe.html?logohandle=${logohandle}\" width=\"${width}\" height=\"${height}\"></iframe>`;
        result["width"] = width;
        result["height"] = height;

        result["thumbnail_url"] = `https://svg2raster.fileformat.info/vlz.jsp?svg=%2Flogos%2F${logohandle}%2F${logohandle}-icon.svg&width=${thumbsize}&height=${thumbsize}&height=128`;
        result["thumbnail_width"] = thumbsize;
        result["thumbnail_height"] = thumbsize;

        if ("referrer" in ctx.query) {
            result["referrer"] = ctx.query['referrer'];
        }
        result["cache_age"] = 600;

        ctx.body = result;
    } catch (err) {
        ctx.body = {success: false, message: 'Query error!', err};
    }
});

export { init, router };