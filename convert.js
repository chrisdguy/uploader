require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { parse } = require('luaparse');

function luaTableToJson(luaTable) {
    if (typeof luaTable !== 'object' || luaTable === null) {
        return luaTable;
    }

    const keys = Object.keys(luaTable).map(key => parseInt(key)).filter(key => !isNaN(key));
    const isArrayLike = keys.length > 0 && keys[0] === 0 && keys.every((key, index) => key === index);

    if (isArrayLike) {
        return keys.sort((a, b) => a - b).map(key => luaTableToJson(luaTable[key]));
    }

    const result = {};
    for (const key in luaTable) {
        if (Object.prototype.hasOwnProperty.call(luaTable, key)) {
            const value = luaTable[key];
            const jsonKey = isNaN(key) ? key : String(key);
            result[jsonKey] = luaTableToJson(value);
        }
    }

    return result;
}

async function uploadAuctionData(sourceFile) {
    try {
        let fileContent = await fs.readFile(sourceFile, 'utf8');

        fileContent = fileContent.replace(/^```lua\s*\n/, '').replace(/\s*```\s*$/, '');

        let ast;
        try {
            ast = parse(fileContent, { luaVersion: '5.1', locations: true });
        } catch (parseError) {
            const lines = fileContent.split('\n');
            const errorLine = parseError.line || 1;
            const startLine = Math.max(1, errorLine - 2);
            const endLine = Math.min(lines.length, errorLine + 2);
            console.error(`Syntax error at line ${errorLine}:`);
            console.error(`Context (lines ${startLine}-${endLine}):`);
            for (let i = startLine - 1; i < endLine; i++) {
                console.error(`${i + 1}: ${lines[i]}`);
            }
            throw parseError;
        }

        let auctionData = null;
        for (const statement of ast.body) {
            if (
                statement.type === 'AssignmentStatement' &&
                statement.variables[0].type === 'Identifier' &&
                statement.variables[0].name === 'AuctionScraper_Data'
            ) {
                auctionData = evaluateLuaTable(statement.init[0]);
                break;
            }
        }

        if (!auctionData) {
            throw new Error('Could not find AuctionScraper_Data table in Lua file');
        }

        if (auctionData.auctions) {
            auctionData.auctions = auctionData.auctions.filter(auction => auction.price !== 0);
        }

        const payload = { AuctionScraper_Data: auctionData };

        const apiEndpoint = process.env.API_ENDPOINT;
        const apiKey = process.env.API_KEY;

        if (!apiEndpoint) {
            throw new Error('API_ENDPOINT environment variable is not set');
        }
        if (!apiKey) {
            throw new Error('API_KEY environment variable is not set');
        }

        let attempts = 3;
        let lastError = null;
        while (attempts > 0) {
            try {
                const response = await axios.post(apiEndpoint, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey
                    }
                });
                return response.data;
            } catch (error) {
                lastError = error;
                attempts--;
                if (attempts > 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        throw lastError || new Error('API request failed after 3 attempts');
    } catch (error) {
        console.error('Error processing or uploading data:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}

function evaluateLuaTable(node) {
    if (node.type !== 'TableConstructorExpression') {
        console.error('Expected TableConstructorExpression, got:', node.type);
        return null;
    }

    const result = [];
    const objectResult = {};
    let hasSequentialKeys = true;
    let arrayIndex = 1;

    for (const field of node.fields) {
        let key, value;
        if (field.type === 'TableKeyString') {
            key = field.key.name;
            value = evaluateLuaValue(field.value);
            hasSequentialKeys = false;
        } else if (field.type === 'TableKey') {
            key = evaluateLuaValue(field.key);
            value = evaluateLuaValue(field.value);
            hasSequentialKeys = false;
        } else if (field.type === 'TableValue') {
            key = String(arrayIndex++);
            value = evaluateLuaValue(field.value);
        } else {
            console.error('Unsupported field type:', field.type);
            continue;
        }
        if (key !== null && value !== null) {
            objectResult[key] = value;
            if (hasSequentialKeys) {
                result.push(value);
            }
        } else {
            console.error('Skipping field due to null key or value:', { key, value });
        }
    }

    return hasSequentialKeys && result.length > 0 ? result : luaTableToJson(objectResult);
}

function evaluateLuaValue(node) {
    if (!node) {
        console.error('Null node encountered in evaluateLuaValue');
        return null;
    }
    switch (node.type) {
        case 'NumericLiteral':
            return node.value;
        case 'StringLiteral':
            return node.raw.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
        case 'TableConstructorExpression':
            return evaluateLuaTable(node);
        case 'BooleanLiteral':
            return node.value;
        case 'NilLiteral':
            return null;
        default:
            console.error('Unsupported node type in evaluateLuaValue:', node.type);
            return null;
    }
}

const sourceFile = process.argv[2];

if (!sourceFile) {
    console.error('Please provide a source file path as an argument');
    process.exit(1);
}

uploadAuctionData(sourceFile)
    .then(() => {})
    .catch(err => {
        console.error('Upload process failed:', err.message);
        process.exit(1);
    });