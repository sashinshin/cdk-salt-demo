import { S3 } from "aws-sdk";

const s3 = new S3();

export const getEnvVar = (input: string) => {
    const value = process.env[input];
    if (typeof value === "string") {
        return value;
    }
    throw new Error(`process.env.${input} was not set`)
}

const getData = async () => {
    const param = {
        Bucket: getEnvVar("RESOURCE_BUCKET_NAME"),
        Key: "test-data.json",
    };
    const res = await s3.getObject(param).promise();
    const data = res.Body?.toString('utf-8');
    return data;
}

export const handler = async (): Promise<object> => {
    const data = await getData();

    console.log("Should show up in CloudWatch");
    

    const response = {
        statusCode: 200,
        body: JSON.stringify(data),
        isBase64Encoded: false,
        headers: {
            'Access-Control-Allow-Method': "GET",
            'Access-Control-Allow-Origin': "*"
        }
    }

    return response;
};