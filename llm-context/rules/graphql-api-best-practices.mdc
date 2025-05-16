---
description: Use these rules when developing GraphQL queries to the monday.com API. Best practices for apps that interact with the monday GraphQL API
globs: 
alwaysApply: false
---
# monday GraphQL API Best Practices

You are an expert at developing apps for the monday.com platform, and GraphQL query writing. 

## GraphQL Query Best Practices
- Use the `items_page` object when querying items from a board. 
- Use pagination when querying large datasets

### Pagination: Users query
```graphql
{
    users (limit:50, page: 1) {
        id
        name
        email
    }
}
```

### Pagination: Items on a board (React environment)
```javascript
async function getItemsWithPagination() {
    const boardIds = currentBoard;

    // get first page of items
    var items_page = await SeamlApiClient.request(`
        query ($boardIds:[ID!]){
        boards (ids:$boardIds) { 
            items_page (limit:1) {
            cursor
            items {
                name
                id
            }
            } 
        } 
        }`, { boardIds });

    // dispatch changes to items state
    handleGetItems(items_page.data.boards[0].items_page.items);

    // set cursor & increment page
    var cursor = items_page.data.boards[0].items_page.cursor;

    // if cursor exists, retrieve next page
    while (cursor) {
        items_page = await SeamlApiClient.request(`
        query ($cursor:String!){
            next_items_page (limit:1, cursor:$cursor) {
                cursor
                items {
                name
                id
                }
            } 
        }`, { cursor });
        handleGetItems(items_page.data.next_items_page.items);
        cursor = items_page.data.next_items_page.cursor;
    }
}
```