import { S3 } from "aws-sdk";

const s3 = new S3();


export const getEnvVar = (input: string) => {
    const value = process.env[input];
    if (typeof value === "string") {
        return value;
    }
    throw new Error(`process.env.${input} was not set`)
}


const getImage = async () => {
    console.log("in get image");
    
    const param = {
        Bucket: getEnvVar("RESOURCE_BUCKET_NAME"),
        Key: "salt.png",
    };
    return s3.getObject(param).promise();
}

export const handler = async (): Promise<object> => {
    const image = await getImage();
    console.log(image);
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(image),
        isBase64Encoded: true,
        "Content-Type": "image/png",
        headers: {
            'Access-Control-Allow-Method': "GET",
            'Access-Control-Allow-Origin': "*"
        }
    }

    return response;
};