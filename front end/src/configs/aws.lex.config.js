import { LexRuntimeV2 } from "@aws-sdk/client-lex-runtime-v2";
import AWS from 'aws-sdk';
const client = new LexRuntimeV2({
    region: "ap-southeast-1",
    credentials: new AWS.Credentials({
        accessKeyId: process.env.REACT_APP_AWS_LEX_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_AWS_LEX_SECRET_KEY
    })
});
export default client;