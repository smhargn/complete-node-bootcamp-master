const fs = require('fs');
const http = require('http');
const url = require('url');

////////// 
// FILESS


// Blocking
// const textIn = fs.readFileSync('./txt/input.txt', 'utf8');
// console.log(textIn);

// const textOut = `This is what we know about avacado : ${textIn} Created On : ${new Date()}`;

// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written successfully');


// Non Blocking

// fs.readFile('./txt/start.txt','utf-8',(err,data1) => {
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8',(err,data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8', err => {
//                 console.log('File written successfully');

//             })
//         });
//     });
// });
// console.log("Will read file");

// function(err,data1){


// };


/// SERVER
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req,res) => {
    console.log(req.url);

    const pathName = req.url;
    if(pathName === '/overview'){
        res.end('Welcome to the Overview Page!\n');
    }else if(pathName === '/product'){
        res.end('Welcome to the Product Page!\n');
    } else if (pathName === '/api'){

            res.writeHead(200,{
                            'Content-type': 'application/json'
            });  // HTTP Status 200: OK
            res.end(data);
        
    } else {
        res.writeHead(404,{
            'Content-type': 'text/html'
        });  // HTTP Status 404: Not Found
        res.end('<h1>Page not found</h1>');
    };

});

server.listen(3000,'127.0.0.1', () => {

    console.log('Server is running on port 3000');

});


