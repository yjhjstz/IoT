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
| GET | /api/led/:id/:action | id: 传感器 ID，action: on/off |
| GET | /api/air/avg/:id     | id: 传感器 ID，获取天气平均值   |
| GET | /api/air/:id/ts      | id: 传感器 ID, query时间参数(iso) st=2017-01-24T01:30:00.000Z&et=2017-02-03T06:03:00.000Z |
| GET | /api/air/geo/avg     | query 地理参数 longitude=114.43&lattitude=38.58&distance=10 |

