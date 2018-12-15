import * as BasicAuth from 'basic-auth';
import * as Koa from 'koa';
import * as KoaPinoLogger from 'koa-pino-logger';
import * as KoaRouter from 'koa-router';
import * as KoaStatic from 'koa-static';
import * as KoaViews from 'koa-views';
import * as os from 'os';
import * as path from 'path';
import * as Pino from 'pino';

const app = new Koa();
app.proxy = true;

const logger = Pino();

app.use(KoaPinoLogger({ logger: logger }));

app.use(async(ctx, next) => {
    try {
        await next();
        const status = ctx.status || 404;
        if (status === 404) {
            ctx.log.warn( { url: ctx.request.url }, 'File not found');
            await ctx.render('404.hbs', { title: 'File not found (404)', url: ctx.request.url });
        }
    } catch (err) {
        ctx.log.error( { err, url: ctx.request.url }, 'Server Error');
        await ctx.render('500.hbs', { title: 'Server Error', message: err.message });
    }
});

app.use(KoaStatic('static'));


app.use(KoaViews(path.join(__dirname, '..', 'views'), {
    map: { hbs: 'handlebars' },
    options: {
        helpers: {
        },
        partials: {
            above: path.join(__dirname, '..', 'partials', 'above'),
            below: path.join(__dirname, '..', 'partials', 'below')
        }
    }
}));

function validateUser(ctx: Koa.Context): BasicAuth.BasicAuthResult | null {
    const user = BasicAuth(ctx.req);
    if (user && user.name === (process.env['USERNAME'] || 'admin') && user.pass === (process.env['PASSWORD'] || 'password')) {
        return user;
    }
    ctx.status = 401;
    ctx.set('WWW-Authenticate', 'Basic realm="vlz-social-logo-viewer"');
    ctx.body = '401: Access denied';

    return null;
}

const rootRouter = new KoaRouter();

rootRouter.get('/index.html', async (ctx) => {
    const user = validateUser(ctx);
    if (!user) {
        return;
    }
    await ctx.render('index.hbs', { user });
});

rootRouter.post('/index.html', async (ctx) => {
    const user = validateUser(ctx);
    if (!user) {
        return;
    }
    await ctx.render('_index.hbs', { user });
});

rootRouter.get('/', async (ctx) => {
    await ctx.redirect('/index.html');
});

rootRouter.get('/status.json', (ctx: Koa.Context) => {
    const retVal: {[key:string]: any } = {};

    retVal["success"] = true;
    retVal["message"] = "OK";
    retVal["timestamp"] = new Date().toISOString();
    retVal["lastmod"] = process.env['LASTMOD'] || '(not set)';
    retVal["commit"] = process.env['COMMIT'] || '(not set)';
    retVal["tech"] = "NodeJS " + process.version;
    retVal["GA_ID"] = process.env['GA_ID'] || '(not set)';
    retVal["__dirname"] = __dirname;
    retVal["__filename"] = __filename;
    retVal["os.hostname"] = os.hostname();
    retVal["os.type"] = os.type();
    retVal["os.platform"] = os.platform();
    retVal["os.arch"] = os.arch();
    retVal["os.release"] = os.release();
    retVal["os.uptime"] = os.uptime();
    retVal["os.loadavg"] = os.loadavg();
    retVal["os.totalmem"] = os.totalmem();
    retVal["os.freemem"] = os.freemem();
    retVal["os.cpus.length"] = os.cpus().length;
    // too much junk: retVal["os.networkInterfaces"] = os.networkInterfaces();

    retVal["process.arch"] = process.arch;
    retVal["process.cwd"] = process.cwd();
    retVal["process.execPath"] = process.execPath;
    retVal["process.memoryUsage"] = process.memoryUsage();
    retVal["process.platform"] = process.platform;
    retVal["process.release"] = process.release;
    retVal["process.title"] = process.title;
    retVal["process.uptime"] = process.uptime();
    retVal["process.version"] = process.version;
    retVal["process.versions"] = process.versions;

    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET');
    ctx.set('Access-Control-Max-Age', '604800');

    const callback = ctx.request.query['callback'];
    if (callback && callback.match(/^[$A-Za-z_][0-9A-Za-z_$]*$/) != null) {
        ctx.type = 'text/javascript';
        ctx.body = callback + '(' + JSON.stringify(retVal) + ');';
    } else {
        ctx.type = 'application/json';
        ctx.body = JSON.stringify(retVal);
    }
});

app.use(rootRouter.routes());

const listener = app.listen(process.env.PORT || "4000", function () {
    logger.info( { address: listener.address(), ga_id: process.env.GA_ID || '(not set)' }, 'Running');
});

