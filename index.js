"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var json_schema_to_typescript_1 = require("json-schema-to-typescript");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var axios_1 = __importDefault(require("axios"));
var genson_js_1 = require("genson-js");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    function isIApiSource(p) {
        if (typeof p.url == 'string' && typeof p.name == 'string')
            return true;
        return false;
    }
    function isIConvertConfig(p) {
        if (!(p.src instanceof Array)) {
            console.warn("The property 'src' of '" + convertConfigFileName + "'' must be of type array!");
            return false;
        }
        for (var i = 0; i < p.src.length; i++) {
            if (!isIApiSource(p.src[i]))
                return false;
        }
        return true;
    }
    function convertApiUrls(urls) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, checkTargetFolder()];
                    case 1:
                        _a.sent();
                        _loop_1 = function (i) {
                            var apiSrc = urls[i];
                            console.log('Fetch data from ' + apiSrc.url);
                            axios_1.default.get(apiSrc.url).then(function (res) {
                                var resObject = JSON.parse(res.data);
                                var schema = genson_js_1.createSchema(resObject);
                                // //this function will validate this routes against a JSON object eg. validate(res.headers.url,JSON.parse(res.data))  
                                // const validate: Function = ajv.compile(schema)
                                // // add it to a map so we can validate routes at runtime ??
                                // validators.set(url, validate)
                                //write to schema types file
                                console.log('Convert json from ' + apiSrc.url);
                                json_schema_to_typescript_1.compile(schema, apiSrc.name).then(function (ts) {
                                    ts = tidyJsonSchema(ts);
                                    var fileName = apiSrc.name + '.d.ts';
                                    var filePath = path.join(targetDir, fileName);
                                    writeTypingFile(filePath, ts);
                                }).catch(function (err) {
                                    console.log(err);
                                });
                            }).catch(function (err) {
                                console.error(err);
                            });
                        };
                        for (i = 0; i < urls.length; i++) {
                            _loop_1(i);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function convertFile(path) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var ts, ex_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    console.log("Converting " + path + " to TS type...");
                                    return [4 /*yield*/, json_schema_to_typescript_1.compileFromFile(path)];
                                case 1:
                                    ts = _a.sent();
                                    resolve(ts);
                                    return [3 /*break*/, 3];
                                case 2:
                                    ex_1 = _a.sent();
                                    reject(ex_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    }
    function writeTypingFile(path, ts) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Writing typescript typings file " + path);
                fs.writeFileSync(path, ts);
                return [2 /*return*/];
            });
        });
    }
    function checkTargetFolder() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (!fs.existsSync(targetDir))
                            fs.mkdir(targetDir, {
                                recursive: true
                            }, function (err) {
                                if (err != null)
                                    reject(err);
                                else
                                    resolve();
                            });
                        else
                            resolve();
                    })];
            });
        });
    }
    function tidyJsonSchema(ts) {
        return ts.replace(/^\s*?\[k: string\]: unknown;\s*?$/gm, "");
    }
    var rootDir, convertConfigFileName, convertConfigFile, rawData, convertConfig, sourceDir, targetDir;
    return __generator(this, function (_a) {
        rootDir = process.cwd();
        convertConfigFileName = "convert-config.json";
        convertConfigFile = path.join(rootDir, convertConfigFileName);
        if (!fs.existsSync(convertConfigFile)) {
            console.warn("No " + convertConfigFileName + " found!");
            return [2 /*return*/];
        }
        rawData = fs.readFileSync(convertConfigFile);
        convertConfig = JSON.parse(rawData.toString());
        if (!isIConvertConfig(convertConfig))
            return [2 /*return*/];
        sourceDir = path.join(rootDir, "json-schema-src");
        targetDir = path.join(rootDir, convertConfig.targetDir != null ? convertConfig.targetDir : "converted-typings");
        // convert json schema from urls
        convertApiUrls(convertConfig.src);
        // convert json from files
        if (fs.existsSync(sourceDir)) {
            fs.readdir(sourceDir, function (err, files) { return __awaiter(void 0, void 0, void 0, function () {
                var i, f, sourceFilePath, ts, targetFileName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err != null)
                                throw new Error(err.message);
                            if (files.length <= 0)
                                return [2 /*return*/];
                            return [4 /*yield*/, checkTargetFolder()];
                        case 1:
                            _a.sent();
                            i = 0;
                            _a.label = 2;
                        case 2:
                            if (!(i < files.length)) return [3 /*break*/, 5];
                            f = files[i];
                            if (f.indexOf('.json') == -1)
                                return [2 /*return*/];
                            sourceFilePath = path.join(sourceDir, f);
                            return [4 /*yield*/, convertFile(sourceFilePath)];
                        case 3:
                            ts = _a.sent();
                            targetFileName = path.join(targetDir, f.replace('.json', '.d.ts'));
                            writeTypingFile(targetFileName, ts);
                            _a.label = 4;
                        case 4:
                            i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
        }
        return [2 /*return*/];
    });
}); })();
//# sourceMappingURL=index.js.map