const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html","UTF-8");
const cssFile = fs.readFileSync("style.css","utf-8");

const replaceVal =(file,val)=>{
    let temperature = file.replace("{%temp%}",val.main.temp);
     temperature = temperature.replace("{%tempmin%}",val.main.temp_min);
     temperature = temperature.replace("{%tempmax%}",val.main.temp_max);
     temperature = temperature.replace("{%location%}",val.name.toUpperCase());
     temperature = temperature.replace("{%country%}",val.sys.country);
     temperature = temperature.replace("{%tempstatus%}",val.weather[0].main)
     return temperature;
}
const server = http.createServer((req,res)=>{
    if(req.url=='/')
    {
    requests(`http://api.openweathermap.org/data/2.5/weather?q=Pathankot&appid=API_KEY`)
    .on('data',(chunk) =>{
            const data =[JSON.parse(chunk)];
          //console.log(data);
          const realTimeData= data.map(val=>replaceVal(homeFile,val));
         // console.log(realTimeData.join());// the data is in array formate so convert it into string using join('');
         res.setHeader('Content-Type',"text/html");// setting a header is a good practice but if we dont set it,browser by-default set it according to file type, but this work is costly.
         res.write(realTimeData.join());
        })
    .on('end',(err) => {
        if (err) return console.log('connection closed due to errors', err);
        console.log('end');
        res.end();
        });
    }
    if(req.url=='/style.css')//whenever we have different files linked to html so we also have to serve it to server; when html file is read by server it request the files which are linked to it; so that's why we use if condition to server it;
    {
        res.setHeader("Content-Type","text/css");
        res.end(cssFile);
    }
});
server.listen(8000,"127.0.0.1");