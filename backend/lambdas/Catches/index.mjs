import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event) => {
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
    if (!userId) {
        return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
    }

    const method = event.requestContext.http.method;
    const critterKey = event.pathParameters?.critterKey;

    if (method === 'GET') {
        const res = await client.send(new QueryCommand({
            TableName: process.env.CATCH_TABLE,
            KeyConditionExpression: 'user_id = :u',
            ExpressionAttributeValues: { ':u': userId },
        }));
        const keys = res.Items.map(item => item.critter_key);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(keys),
        };
    }

    if (method === 'PUT' && critterKey) {
        await client.send(new PutCommand({
            TableName: process.env.CATCH_TABLE,
            Item: { user_id: userId, critter_key: critterKey },
        }));
        return { statusCode: 204, body: '' };
    }

    if (method === 'DELETE' && critterKey) {
        await client.send(new DeleteCommand({
            TableName: process.env.CATCH_TABLE,
            Key: { user_id: userId, critter_key: critterKey },
        }));
        return { statusCode: 204, body: '' };
    }

    return { statusCode: 400, body: JSON.stringify({ message: 'Bad request' }) };
};