var chatQuickButtonHtml = `
	<style>
	#quickButton{
	    position: fixed;
	    bottom: 5rem;
	    padding-left: 0.5rem;
	    padding-right: 0.5rem;
	    display: inline;
	    white-space: nowrap;
	    overflow:scroll;
	}
	#quickButton button{
	    border-radius: 2rem;
	    background: aliceblue;
	}
	</style>
	<section id="quickButton" style="position: fixed;bottom: 5rem;">
	    <button>售后</button>
	    <button>评价</button>
	    <button>物流查询</button>
	    <button>按钮1</button>
	    <button>按钮2</button>
	    <button>按钮3</button>
	    <button>按钮4</button>
	    <button>按钮5</button>
	</section>
`;
document.getElementById('chat_footer').innerHTML = chatQuickButtonHtml+document.getElementById('chat_footer').innerHTML;