## IoT
IoT node.js server

### 依赖
* mongodb 3.x
* node.js 4.x
* npm

`ubuntu`系统 安装参考 `Dockerfile` 文件。



### 运行
* server: node bin/www
* mock client: node client/client.js 1


### API

| 方法 |   URL               | 备注 |
| ----| ---------------------| ---------------------------- |
| POST | /api/led/           | id: 传感器 ID，action: on/off |
| GET | /api/led/            | id: 传感器 ID，action: status |
| GET | /api/air/            | 例子：/api/air?longitude=114.43&lattitude=38.58&distance=10&method=avg&id=1&st=2017-01-01T01:30:00.000Z&et=2017-02-06T06:03:00.000Z   |


