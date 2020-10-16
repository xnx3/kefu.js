var goods_show = false;	//是否已经显示过了，只显示一次商品发送提示就可以。false是未显示过，可以显示商品发送提示
//根据url传入的goodsid，来弹出是否发送商品的提示
im.extend.goods.goodsid = getUrlParams('goodsid');
//显示商品发送窗口
function showGoodsSendWindow(){
	if(!goods_show){
		if(im.extend.goods.goodsid != null && im.extend.goods.goodsid.length > 0){
			//通过接口获取这个指定的商品信息，弹出显示，提醒用户是否发送这个商品
			msg.loading('获取中');
			request.get(goodsUrl+'goods.json',{token:im.getToken(), id:im.extend.goods.goodsid}, function(data){
				msg.close();
				im.extend.goods.goods = data;
				msg.popups(im.extend.goods.getGoodsByTemplate(im.extend.goods.goods));
			});
		}
		goods_show = true;
		console.log('显示了goods');
	}
}
