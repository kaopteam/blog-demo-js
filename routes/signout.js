const router = require('koa-router')();

router.get('/signout', async(ctx, next) => {
         // console.log('失败主'+start)
			ctx.session = null;
		    console.log('登出成功')
		    ctx.body = true
		    
})
module.exports = router