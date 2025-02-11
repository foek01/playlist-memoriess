const { DynamoDB } = require("aws-sdk");

const TableName = "playlist-memories";
// const room_code = "6bfff6a9-6fb7-4cce-bd96-aff71694605f";

let dynamo = null;

const initialize = () => {
    const dynamodb = new DynamoDB({ region: "eu-west-1" });
    dynamo = new DynamoDB.DocumentClient({ service: dynamodb });
};

const put = async (type, item) => {
    if (!item?.pk || !type) return;
    await dynamo.put({ TableName, Item: { sk: type, ...item } }).promise();
};

const getSingle = async (type, pk) => {
    if (!pk || !type) return;
    const { Item } = await dynamo
        .get({ TableName, Key: { pk, sk: type } })
        .promise();
    return Item;
};

const getMultiple = async (type, filters = {}) => {
    if (!type) return;
    filters.sk = type;
    const FilterExpression = Object.keys(filters)
        .map((key) => `${key} = :${key}`)
        .join(" and ");
    const ExpressionAttributeValues = {};
    for (const [key, val] of Object.entries(filters)) {
        ExpressionAttributeValues[`:${key}`] = val;
    }
    const { Items } = await dynamo
        .scan({
            TableName,
            FilterExpression,
            ExpressionAttributeValues,
        })
        .promise();
    return Items;
};

const remove = async (type, pk) => {
    if (!type || !pk) return;
    await dynamo.delete({ TableName, Key: { pk, sk: type } }).promise();
    return true;
};

const removeMultiple = async (type) => {
    if (!type) return;

    const item_ids = [];

    const items = await getMultiple(type);
    for (const item of items || []) {
        item_ids.push(item.pk);
        await remove(type, item.pk);
    }
    return item_ids;
};

module.exports = {
    put,
    getSingle,
    getMultiple,
    remove,
    removeMultiple,
    initialize,
};
