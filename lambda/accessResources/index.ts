import { S3 } from "aws-sdk";

const s3 = new S3();


export const getEnvVar = (input: string) => {
    const value= process.env[input];
    if (typeof value === "string") {
        return value;
    }
    throw new Error(`process.env.${input} was not set`)
}


const getKeys = async (): Promise<string[]> => {
    const location = "stockholm";
    const listParam = {
        Bucket: getEnvVar("RESOURCE_BUCKET_NAME"),
        Prefix: `data/${location}/`
    }
    const objectList = await s3.listObjectsV2(listParam).promise();
    const keys = objectList.Contents?.map((obj) => obj.Key ? obj.Key : "");
    if (!keys) {
        throw new Error("failed");
    }
    return keys;
};

const getWeatherData = async (keys: string[]): Promise<(string | undefined)[]> => {
    const promiseList = keys.map((key) => {
        const param = {
            Bucket: getEnvVar("RESOURCE_BUCKET_NAME"),
            Key: key,
        }
        return s3.getObject(param).promise();
    });
    const res = await Promise.all(promiseList).then(res => res);
    return res.map(res => res.Body?.toString('utf-8'));''
};

export const handler = async (): Promise<object> => {
    const keys = await getKeys();
    const weatherData = await getWeatherData(keys);
    const response = {
        statusCode: 200,
        body: JSON.stringify(weatherData),
        isBase64Encoded: false,
        headers: {
            'Access-Control-Allow-Method': "GET",
            'Access-Control-Allow-Origin': "*"
        }
    }

    return response;
};