const Koa = require('koa');
const path = require('path')
const bodyParser = require('koa-bodyparser');
// const ejs = require('ejs');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config/default.js');
const router = require('koa-router')
const views = require('koa-views')
// const koaStatic = require('koa-static')
const staticCache = require('koa-static-cache')
// const opn = require('opn')
const app = new Koa()
// 日志中间件
const logger = require('koa-logs-middleware');
// 日志监控
app.use(logger({
    defaultPath: path.resolve(__dirname, 'logs'),
    applicationName: 'app',
    auto: false,
}));
app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    // ctx.logger.debug(`${ctx.method} ${ctx.url} - ${ms}ms`);
    ctx.logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
// session存储配置
const sessionMysqlConfig= {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}
// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}))
// 缓存
app.use(staticCache(path.join(__dirname, './public'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}))
app.use(staticCache(path.join(__dirname, './images'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}))
// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))
app.use(bodyParser({
  formLimit: '1mb'
}))
//  路由
app.use(require('./routes/signin.js').routes())
// app.use(require('./routers/signup.js').routes())
app.use(require('./routes/posts.js').routes())
app.use(require('./routes/signout.js').routes())
module.exports = app