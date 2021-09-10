import { compile, compileFromFile } from 'json-schema-to-typescript';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { createSchema } from 'genson-js';

(async () => {
    const rootDir = process.cwd();
    const convertConfigFileName = "convert-config.json"
    const convertConfigFile = path.join(rootDir, convertConfigFileName);

    if (!fs.existsSync(convertConfigFile)) {
        console.warn(`No ${convertConfigFileName} found!`);
        return;
    }

    const rawData = fs.readFileSync(convertConfigFile);
    const convertConfig = JSON.parse(rawData.toString());

    if (!isIConvertConfig(convertConfig))
        return;

    const sourceDir = path.join(rootDir, "json-schema-src");
    const targetDir = path.join(rootDir, convertConfig.targetDir != null ? convertConfig.targetDir : "converted-typings");

    // convert json schema from urls
    convertApiUrls(convertConfig.src);

    // convert json from files
    if (fs.existsSync(sourceDir)) {
        fs.readdir(sourceDir, async (err, files) => {
            if (err != null)
                throw new Error(err.message);

            if (files.length <= 0)
                return;

            await checkTargetFolder();

            for (let i = 0; i < files.length; i++) {
                let f = files[i];

                if (f.indexOf('.json') == -1)
                    return;

                let sourceFilePath = path.join(sourceDir, f);
                let ts = await convertFile(sourceFilePath);
                let targetFileName = path.join(targetDir, f.replace('.json', '.d.ts'));
                writeTypingFile(targetFileName, ts);
            }
        });
    }

    interface IApiSource {
        url: string,
        name: string
    }

    interface IConvertConfig {
        targetDir?: string,
        src: IApiSource[];
    }

    function isIApiSource(p: any): p is IApiSource {
        if (typeof p.url == 'string' && typeof p.name == 'string')
            return true;
        return false;
    }

    function isIConvertConfig(p: any): p is IConvertConfig {
        if (!(p.src instanceof Array)) {
            console.warn(`The property 'src' of '${convertConfigFileName}'' must be of type array!`);
            return false;
        }
        for (let i = 0; i < p.src.length; i++) {
            if (!isIApiSource(p.src[i]))
                return false;
        }
        return true;
    }

    async function convertApiUrls(urls: IApiSource[]) {
        await checkTargetFolder();
        for (let i = 0; i < urls.length; i++) {
            let apiSrc = urls[i];
            console.log('Fetch data from ' + apiSrc.url);
            axios.get(apiSrc.url).then((res) => {
                const resObject: JSON = JSON.parse(res.data);
                const schema = createSchema(resObject);

                // //this function will validate this routes against a JSON object eg. validate(res.headers.url,JSON.parse(res.data))  
                // const validate: Function = ajv.compile(schema)
                // // add it to a map so we can validate routes at runtime ??
                // validators.set(url, validate)

                //write to schema types file
                console.log('Convert json from ' + apiSrc.url);
                compile(schema, apiSrc.name).then(ts => {
                    ts = tidyJsonSchema(ts);
                    const fileName = apiSrc.name + '.d.ts';
                    const filePath = path.join(targetDir, fileName);
                    writeTypingFile(filePath, ts);
                }).catch((err: Error) => {
                    console.log(err)
                });
            }).catch((err: Error) => {
                console.error(err);
            });
        }
    }

    async function convertFile(path: string) {
        return new Promise<string>(async (resolve, reject) => {
            try {
                console.log(`Converting ${path} to TS type...`);
                let ts = await compileFromFile(path);
                resolve(ts);
            } catch (ex) {
                reject(ex);
            }
        });
    }

    async function writeTypingFile(path: string, ts: string) {
        console.log(`Writing typescript typings file ${path}`);
        fs.writeFileSync(path, ts);
    }

    async function checkTargetFolder() {
        return new Promise<void>((resolve, reject) => {
            if (!fs.existsSync(targetDir))
                fs.mkdir(targetDir, {
                    recursive: true
                }, (err) => {
                    if (err != null)
                        reject(err);
                    else
                        resolve();
                });
            else
                resolve();
        });
    }

    function tidyJsonSchema(ts: string): string {
        return ts.replace(/^\s*?\[k: string\]: unknown;\s*?$/gm, "");
    }
})();