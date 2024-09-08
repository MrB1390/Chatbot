"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// used to synthesize the text to speech
const polly = new aws_sdk_1.default.Polly({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
// used for storing the audio file and access it 
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
app.post("/api/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d, _e;
    const message = req.body.message;
    try {
        const stream = yield openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "gpt-4o-mini",
            stream: true,
        });
        // stream used to collect responses concuncurrently instead of waiting for full response
        let responseText = "";
        try {
            for (var _f = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _f = true) {
                _c = stream_1_1.value;
                _f = false;
                const chunk = _c;
                responseText += ((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || "";
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_f && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const params = {
            OutputFormat: 'mp3',
            Text: responseText,
            VoiceId: 'Joanna',
        };
        polly.synthesizeSpeech(params, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("Error with Polly: ", err);
                return res.status(500).json({ error: "Error with Polly" });
            }
            const audioStream = data.AudioStream;
            // Generate a unique filename for the audio file
            const fileName = `audio/${(0, uuid_1.v4)()}.mp3`;
            // Upload the audio stream to S3
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileName,
                Body: audioStream,
                ContentType: 'audio/mpeg',
                ACL: 'public-read',
            };
            const uploadResult = yield s3.upload(uploadParams).promise();
            const audioUrl = uploadResult.Location;
            res.status(200).json({
                response: responseText,
                audioStream: audioUrl,
            });
        }));
    }
    catch (error) {
        console.error("Error:", error);
        if (error) {
            // Check the error status from the response
            switch (error.status) {
                case 401:
                    res.status(401).json({ responsemessage: "Unauthorized" });
                    break;
                case 404:
                    res.status(404).json({ responsemessage: "Resource not found" });
                    break;
                case 429:
                    res.status(429).json({ responsemessage: "Too many requests" });
                    break;
            }
        }
        else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
}));
app.get("/", (req, res) => {
    res.send("Working buddy");
});
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`app running on ${port}`);
});
