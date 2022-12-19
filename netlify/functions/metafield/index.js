// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {

    const jsonKey = event.queryStringParameters.json

    if (!jsonKey) return { statusCode: 500, body: 'no JSON key provided. Pass e.g. ?json=nbq' }
    // really, we would check here for the existence of the json file
    const json = require(`./json/${jsonKey}.json`)
    const jsonString = JSON.stringify(json);

    const Shopify = require('shopify-api-node');

    const shopify = new Shopify({
      shopName: 'medaireonline-eu-staging',
      accessToken: process.env.ACCESS_TOKEN
    });

    const userId = 6577333993725

    const metafields = await shopify.metafield
      .list({
        metafield: { owner_resource: 'customer', owner_id: userId }
      })

    shopify.metafield
      .create({
        key: 'data',
        value: jsonString,
        value_type: 'json_string',
        namespace: 'quote',
        owner_resource: 'customer',
        owner_id: userId
      })
      .then(
        (metafield) => console.log(metafield),
        (err) => console.error(err)
      );
    console.log('YO')

    return {
      statusCode: 200,
      body: JSON.stringify(metafields),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
