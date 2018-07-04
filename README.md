# ts-intro




## Api HTTP Requests

```
GET /products/?page={number}
```
This api endpoint return the list of products by page.

```
DELETE /product/?id={number}
```


## Commands

```
# yarn imp: 
```
Trigger the scraper to scrap the website and import the products found into DB


```
# yarn test: 
```
Trigger mocha test. 

## Config
Config file /config/config.js is not included into git and should have the following structure.

```

config = {
    app: {
      port: 3000
    },
    db: {
        host     : 'localhost',
        user     : '',
        password : '',
        database : ''
    },
    api: {
        itemPerPage: 20
    },
    scraper: {
        fistPageUrl : '', 
        pageUrlPagination: '',
        numberOfPage: 10 // Number of page to scrape
    }
   };
```


