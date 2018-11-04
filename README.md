# VLZ Social Logo Viewer [<img alt="VectorLogoZone Logo" src="https://social.vectorlogo.zone/favicon.svg" height="90" align="right" />](https://social.vectorlogo.zone/)

[Social Logo Viewer](https://social.vectorlogo.zone/) is way to see all of a company's logos from the various social media sites.

## Using

Unfortunately, rate-limits mean that I cannot run it as an open service.  However, it is 
fairly easy to run your own instance.

## Running

It is a TypeScript node.js app, so (once you have set the [settings](#settings): 
```bash
npm install
npm run build
npm run start
```
See the `run.sh` for how I run it in development.

## Settings
All settings are stored in environment variables.  The deploy and run scripts get them from a `.env` file.

| name | description
|------|----------------
| USERNAME | the username to enter in the basic-auth dialog (default=`admin`)
| PASSWORD | the password to enter in the basic-auth dialog (default=`password`)


## Contributing

Contributions are welcome!  Please follow the standard Github [Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962)

See the [to do list](TODO.md) for a list of things that are planned.

## License

[GNU Affero General Public License v3.0](LICENSE.txt)

## Credits

[![Cloudflare](https://www.vectorlogo.zone/logos/cloudflare/cloudflare-ar21.svg)](https://www.cloudflare.com/ "CDN")
[![Git](https://www.vectorlogo.zone/logos/git-scm/git-scm-ar21.svg)](https://git-scm.com/ "Version control")
[![Github](https://www.vectorlogo.zone/logos/github/github-ar21.svg)](https://github.com/ "Code hosting")
[![Google Analytics](https://www.vectorlogo.zone/logos/google_analytics/google_analytics-ar21.svg)](https://www.google.com/analytics "Traffic Measurement")
[![Handlebars](https://www.vectorlogo.zone/logos/handlebarsjs/handlebarsjs-ar21.svg)](http://handlebarsjs.com/ "Templating")
[![Node.js](https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg)](https://nodejs.org/ "Application Server")
[![npm](https://www.vectorlogo.zone/logos/npmjs/npmjs-ar21.svg)](https://www.npmjs.com/ "JS Package Management")
[![Shoelace CSS](https://www.vectorlogo.zone/logos/shoelacestyle/shoelacestyle-ar21.svg)](https://shoelace.style/ "CSS")
[![TypeScript](https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg)](https://www.typescriptlang.org/ "Programming Language")
[![Zeit](https://www.vectorlogo.zone/logos/zeit/zeit-ar21.svg)](https://www.zeit.co/ "Hosting")

 * koa
 * pino


