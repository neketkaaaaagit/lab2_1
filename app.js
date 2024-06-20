const dir_nms = 'C:\\Users\\khudo\\node_modules\\sync-mysql';
const Mysql = require(dir_nms);
const http = require('http');
const fs = require('fs');
const qs = require('querystring');

const connection = new Mysql({
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'lab2',
    charset: 'utf8mb4'
});

function reqPost(request, response) {
    if (request.method == 'POST') {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            const post = qs.parse(body);
            console.log('Получены POST данные: ', post);

            if (post['action'] === 'delete') {

            } else if (post['action'] === 'insert') {
                if (post['earth_position'] && post['sun_position'] && post['moon_position'] && post['galactic_id']) {
                    const earthPosition = post['earth_position'].toString();
                    const sunPosition = post['sun_position'].toString();
                    const moonPosition = post['moon_position'].toString();
                    const galacticId = post['galactic_id'].toString();
            
                    const sInsert = `INSERT INTO position (id, Положение земли, moon_position, galactic_id) VALUES ("${earthPosition}", "${sunPosition}", "${moonPosition}", "${galacticId}")`;
                    connection.query(sInsert, (error, results, fields) => {
                        if (error) {
                            console.log('Ошибка при добавлении данных в базу данных:', error);
                        } else {
                            console.log('Добавлено. Подсказка: ' + sInsert);
     
                            response.writeHead(302, {
                                'Location': '/'
                            });
                            response.end();
                        }
                    });
                } else {
                    console.log('Ошибка: Все поля формы должны быть заполнены!');
                }

            } else if (post['action'] === 'edit') {


            } else if (post['action'] === 'callProcedure') {
                if (post['table1'] && post['table2']) {
                    const sCall = `CALL JoinProc("${post['table1']}", "${post['table2']}")`; 
                    connection.query(sCall, (error, results, fields) => {
                        if (error) {
                            console.log('Ошибка при вызове процедуры:', error);
                        } else {
                            console.log('Процедура JoinProc вызвана успешно. Результаты: ', results);
                        }

                        response.writeHead(302, {
                            'Location': '/'
                        });
                        response.end();
                    });
                } else {
                    console.log('Ошибка: Поля table1 и table2 должны быть заполнены!');
                }
            }
        });
    }
}

function viewSelect(res) {
    let results = connection.query('SHOW COLUMNS FROM position');
    res.write('<tr>');
    for (let i = 0; i < results.length; i++)
        res.write('<td>' + results[i].Field + '</td>');
    res.write('<td>Действия</td>');
    res.write('</tr>');

    results = connection.query('SELECT * FROM position');
    for (let i = 0; i < results.length; i++) {
        res.write('<tr>');
        res.write('<td>' + results[i].id + '</td>');
        res.write('<td>' + results[i].earth_position + '</td>');
        res.write('<td>' + results[i].sun_position + '</td>');
        res.write('<td>' + results[i].moon_position + '</td>');
        res.write('<td>' + results[i].galactic_id + '</td>');
        res.write('<td><form method="post"><input type="hidden" name="id" value="' + results[i].id + '"/><input type="hidden" name="action" value="delete"/><input type="submit" value="Удалить"/></form></td>');
        res.write('<td><form method="post"><input type="hidden" name="id" value="' + results[i].id + '"/><input type="hidden" name="action" value="edit"/><input type="submit" value="Редактировать"/></form></td>');
        res.write('</tr>');
    }
}

function viewVer(res) {
    const results = connection.query('SELECT VERSION() AS ver');
    res.write(results[0].ver);
}

const server = http.createServer((req, res) => {
    reqPost(req, res);
    console.log('Загрузка...');

    res.statusCode = 200;

    const array = fs.readFileSync(__dirname + '\\select.html').toString().split("\n");
    console.log(__dirname + '\\select.html');
    for (let i in array) {
        if ((array[i].trim() != '@tr') && (array[i].trim() != '@ver')) res.write(array[i]);
        if (array[i].trim() == '@tr') viewSelect(res);
        if (array[i].trim() == '@ver') viewVer(res);
    }
    res.end();
    console.log('Пользователь завершил работу.');
});

const hostname = '127.0.0.1';
const port = 3000;
server.listen(port, hostname, () => {
    console.log(`Сервер запущен по адресу http://${hostname}:${port}/`);
});
