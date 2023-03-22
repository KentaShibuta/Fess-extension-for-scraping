const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const axios = require('axios');
const ejs = require('ejs');

const result_page = fs.readFileSync('./result.ejs', 'utf8');

const server = http.createServer((req, res) => {
    var target = '';
    const base_url = "http://192.168.1.63:8080/json/?q=";
    switch (req.method){
        case 'GET':
            target = './index.html';
            break;
        case 'POST':
            var data = '';
            let url_buf = [];
            // POSTデータを受け取る
            req.on('data', chunk => data += chunk)
            .on('end', () => {
                console.log(qs.parse(data));
                obj_kw = qs.parse(data)
                if (obj_kw.keyword){
                    // 配列に文字列を追加
                    url_buf.push(base_url, obj_kw.keyword, "&start=", obj_kw.start, "&num=", obj_kw.num);
                    // 配列の中身を結合して1つの文字列にする
                    url = url_buf.join("");
                    console.log(url);
                    axios.get(url)
                        .then(async function(response) {
                            let data_j = response.data.response;
                            console.log(data_j.record_count);
                            let result = data_j.result;
                            let url_webs = [];
                            for (let i = 0; i < Object.keys(result).length; i++){
                                let url_web = "http://192.168.1.63:80/fess/" + result[i].title;
                                await axios.get(url_web)
                                    .then(function(response) {
                                        let data_low = response.data.split('[');
                                        url_webs.push(data_low[0]);
                                    });
                            }

                            for (let i = 0; i < Object.keys(result).length; i++){
                                data_j.result[i].url_web = url_webs[i];
                            }
                            data_j.keyword = obj_kw.keyword;
                            data_j.start =  obj_kw.start;
                            data_j.num = obj_kw.num;
                            console.log(data_j.keyword);

                            let content = ejs.render(result_page, data_j);
                            res.writeHead(200,{'Content-Type':'text/html'});
                            res.write(content);
                            res.end();
                        })
                        .catch(function(error) {
                            console.log('ERROR!! occurred in Backend.')
                        });
                } else {
                    res.end("blank");
                }
            })
            return;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('bad request');
            return;
    }
    fs.readFile(target, 'utf-8', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data)
        res.end();
    })
});

const port = 8080;
server.listen(port);
console.log('Server listen on port ' + port);