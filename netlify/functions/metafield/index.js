// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {

    const jsonKey = event.queryStringParameters.json

    if (!jsonKey) return { statusCode: 500, body: 'no JSON key provided. Pass e.g. ?json=nbq' }
    // really, we would check here for the existence of the json file

    const Shopify = require('shopify-api-node');

    const shopify = new Shopify({
      shopName: 'medaireonline-eu-staging',
      accessToken: process.env.ACCESS_TOKEN
    });


    const nbq = require(`./json/nbq.json`)
    const resupply = require(`./json/resupply.json`)
    const json = jsonKey == 'nbq' ? nbq : resupply
    const jsonString = JSON.stringify(json);
    const userId = 6577333993725

    const listMetafields = () => {
      shopify.metafield
        .list({
          metafield: { owner_resource: 'customer', owner_id: userId }
        })
    }

    const setMetafield = async () => {
      return shopify.metafield
        .create({
          key: 'data',
          value: jsonString,
          value_type: 'json_string',
          namespace: 'quote',
          owner_resource: 'customer',
          owner_id: userId
        })
    }

    const updatedMetafield = await setMetafield();

    return {
      statusCode: 200,
      body: JSON.stringify(updatedMetafield),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
