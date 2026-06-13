import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const VALID_TYPES = new Set(["fish", "bug", "sea"]);

export const handler = async (event) => {
    const type = event.pathParameters?.type;

    if (!VALID_TYPES.has(type)) {
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "type must be 'fish' or 'bug'" }),
        };
    }

    const items = [];
    let lastKey;
    do {
        const res = await client.send(new QueryCommand({
            TableName: process.env.CRITTER_TABLE,
            KeyConditionExpression: "critter_type = :t",
            ExpressionAttributeValues: { ":t": type },
            ExclusiveStartKey: lastKey,
        }));
        items.push(...res.Items);
        lastKey = res.LastEvaluatedKey;
    } while (lastKey);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
    };
};