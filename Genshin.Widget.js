const UID = '';
const Cookie = '';
Script.setWidget(await createWidget());

async function createWidget() {
	let descColor = Color.dynamic(Color.black(), Color.white());
	let valueColor = Color.dynamic(Color.purple(), Color.cyan());
	let widget = new ListWidget();

	widget.addSpacer();
	widget.backgroundColor = Color.dynamic(new Color('#FFDFFF'), new Color('#212F3C'));

	if (typeof UID !== 'string' || UID.length === 0 || typeof Cookie !== 'string' || Cookie.length === 0) {
		let stack = widget.addStack();
		stack.centerAlignContent();
		let title = stack.addText('请先设置UID以及Cookie！');
		title.font = Font.boldSystemFont(18);
		title.textColor = descColor;
		title.minimumScaleFactor = 0.85;
		widget.addSpacer();
		return widget;
	}

	const notes = await getNotes();
	if (notes === false) {
		stack = widget.addStack();
		stack.centerAlignContent();
		text = stack.addText('获取便笺信息失败！');
		text.font = Font.boldSystemFont(18);
		text.textColor = descColor;
		text.minimumScaleFactor = 0.85;
		widget.addSpacer();

		stack = widget.addStack();
		stack.centerAlignContent();
		text = stack.addText('请确认米游社已绑定原神角色！');
		text.font = Font.boldSystemFont(18);
		text.textColor = descColor;
		text.minimumScaleFactor = 0.85;
		widget.addSpacer();

		stack = widget.addStack();
		stack.centerAlignContent();
		text = stack.addText('并重新获取和设置UID和Cookie！');
		text.font = Font.boldSystemFont(18);
		text.textColor = descColor;
		text.minimumScaleFactor = 0.85;
		widget.addSpacer();
		return widget;
	}

	{
		let image = await loadImage();
		let stack = widget.addStack();
		stack.centerAlignContent();
		let logo = stack.addImage(image);
		logo.cornerRadius = 8;
		logo.imageSize = new Size(32, 32);
		stack.addSpacer(8);
		let title = stack.addText('原神信息统计');
		title.font = Font.boldSystemFont(18);
		title.textColor = descColor;
		title.minimumScaleFactor = 0.85;
		widget.addSpacer();
	}
	{
		let stack = widget.addStack();
		let desc = stack.addText('树脂：');
		desc.font = Font.mediumSystemFont(12);
		desc.textColor = descColor;
		desc.textOpacity = 0.9;
		stack.addSpacer();
		let value = stack.addText(String(notes.current_resin));
		value.font = Font.mediumSystemFont(12);
		value.textColor = valueColor;
		value.textOpacity = 0.9;
		widget.addSpacer();
	}
	{
		let stack = widget.addStack();
		let desc = stack.addText('树脂恢复：');
		desc.font = Font.mediumSystemFont(12);
		desc.textColor = descColor;
		desc.textOpacity = 0.9;
		stack.addSpacer();
		let value = stack.addText(formatTime(notes.resin_recovery_time));
		value.font = Font.mediumSystemFont(12);
		value.textColor = valueColor;
		value.textOpacity = 0.9;
		widget.addSpacer();
	}
	{
		let stack = widget.addStack();
		let desc = stack.addText('洞天宝钱：');
		desc.font = Font.mediumSystemFont(12);
		desc.textColor = descColor;
		desc.textOpacity = 0.9;
		stack.addSpacer();
		let value = stack.addText(String(notes.current_home_coin));
		value.font = Font.mediumSystemFont(12);
		value.textColor = valueColor;
		value.textOpacity = 0.9;
		widget.addSpacer();
	}

	{
		let stack = widget.addStack();
		let desc = stack.addText('洞天宝钱恢复：');
		desc.font = Font.mediumSystemFont(12);
		desc.textColor = descColor;
		desc.textOpacity = 0.9;
		stack.addSpacer();
		let value = stack.addText(formatTime(notes.home_coin_recovery_time));
		value.font = Font.mediumSystemFont(12);
		value.textColor = valueColor;
		value.textOpacity = 0.9;
		widget.addSpacer();
	}

	if (config.widgetFamily === 'large') {
		{
			let ongoing = notes.expeditions.filter(e => e.status === 'Ongoing').length;
			let maxTime = notes.expeditions.reduce((max, e) => {
				return e.remained_time > max ? e.remained_time : max;
			}, 0);
			{
				let stack = widget.addStack();  
				let desc = stack.addText('探索派遣：');
				desc.font = Font.mediumSystemFont(12);
				desc.textColor = descColor;
				desc.textOpacity = 0.9;
				stack.addSpacer();
				let value = stack.addText(`已完成：${notes.expeditions.length-ongoing} / 派遣中：${ongoing}`);
				value.font = Font.mediumSystemFont(12);
				value.textColor = valueColor;
				value.textOpacity = 0.9;
				widget.addSpacer();
			}
			{
				let stackText = '';
				if (notes.expeditions.length === 0) {
					stackText = '未派遣';
				} else if (maxTime === 0 && ongoing === 0) {
					stackText = '已完成';
				} else {
					stackText = formatTime(maxTime);
				}
				let stack = widget.addStack();  
				let desc = stack.addText('派遣剩余时间：');
				desc.font = Font.mediumSystemFont(12);
				desc.textColor = descColor;
				desc.textOpacity = 0.9;
				stack.addSpacer();
				let value = stack.addText(stackText);
				value.font = Font.mediumSystemFont(12);
				value.textColor = valueColor;
				value.textOpacity = 0.9;
				widget.addSpacer();
			}
		}
		{
			let stack = widget.addStack();  
			let desc = stack.addText('每日委托：');
			desc.font = Font.mediumSystemFont(12);
			desc.textColor = descColor;
			desc.textOpacity = 0.9;
			stack.addSpacer();
			let value = stack.addText(`已完成：${notes.finished_task_num} / 总数：${notes.total_task_num}`);
			value.font = Font.mediumSystemFont(12);
			value.textColor = valueColor;
			value.textOpacity = 0.9;
			widget.addSpacer();
		}
		{
			let stack = widget.addStack();  
			let desc = stack.addText('周本树脂减半：');
			desc.font = Font.mediumSystemFont(12);
			desc.textColor = descColor;
			desc.textOpacity = 0.9;
			stack.addSpacer();
			let value = stack.addText(`已使用：${notes.resin_discount_num_limit - notes.remain_resin_discount_num} / 总数：${notes.resin_discount_num_limit}`);
			value.font = Font.mediumSystemFont(12);
			value.textColor = valueColor;
			value.textOpacity = 0.9;
			widget.addSpacer();
		}
		{
			let stackText = notes.transformer.recovery_time.reached ? '冷却完成' : '冷却中';
			if (!notes.transformer.obtained) {
				stackText = '未获得质变仪';
			}
			let stack = widget.addStack();
			let desc = stack.addText('参量质变仪：');
			desc.font = Font.mediumSystemFont(12);
			desc.textColor = descColor;
			desc.textOpacity = 0.9;
			stack.addSpacer();
			let value = stack.addText(stackText);
			value.font = Font.mediumSystemFont(12);
			value.textColor = valueColor;
			value.textOpacity = 0.9;
			widget.addSpacer();
		}
	}

	return widget;
}

function formatTime(time) {
	time = Number(time);
	let days = Math.floor(time / 86400);
	time = time % 86400;
	let hours = Math.floor(time / 3600);
	time = time % 3600;
	let minutes = Math.floor(time / 60);
	return (days > 0 ? days + '天' : '') + `${hours}小时${minutes}分钟`;
}

function getServer(uid) {
	let first = Number(String(uid).substring(0, 1));
	switch (first) {
		case 5:
			return 'cn_qd01';
		case 6:
			return 'os_usa';
		case 7:
			return 'os_euro';
		case 8:
			return 'os_asia';
		case 8:
			return 'os_cht';
		default:
			return 'cn_gf01';
	}
}

function getReqSign(body, query) {
	let timestamp = Math.floor(Date.now() / 1000);
	let nonce = Math.floor(Math.random() * 100000) + 100001;
	let sign = md5(`salt=xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs&t=${timestamp}&r=${nonce}&b=${body}&q=${getQuery(query)}`, 32);
	return `${timestamp},${nonce},${sign}`;
}

function getQuery(query) {
	let keys = Object.keys(query).sort();
	let result = '';
	for (let i = 0; i < keys.length; i++) {
		let key = keys[i];
		let value = query[key];
		if (i > 0) {
			result += '&';
		}
		result += `${key}=${value}`;
	}
	return result;
}

async function loadImage() {
	let fm = FileManager.local();
	let cacheFile = fm.cacheDirectory() + '/Genshin.jpg';
	if (fm.fileExists(cacheFile)) {
		return fm.readImage(cacheFile);
	}
	let req = new Request('https://1248.ink/Tools/Genshin.jpg');
	let img = await req.loadImage();
	fm.writeImage(cacheFile, img);
	return img;
}

async function getNotes() {
	let query = {
		role_id: UID,
		server: getServer(UID)
	};
	let req = new Request(`https://api-takumi-record.mihoyo.com/game_record/app/genshin/api/dailyNote?${getQuery(query)}`);
	req.headers = {
		'x-rpc-app_version': '2.11.1',
		'x-rpc-client_type': '5',
		'x-rpc-device_id': '',
		'DS': getReqSign('', query),
		'Cookie': Cookie
	};
	let data = await req.loadJSON();
	if (data.retcode === 0) {
		console.log(data.data);
		return data.data;
	}
	return false;
}

function md5(string,bit){function g(V,W){return V<<W|V>>>0x20-W}function h(V,W){var X,Y,Z,a0,a1;Z=V&0x80000000;a0=W&0x80000000;X=V&0x40000000;Y=W&0x40000000;a1=(V&0x3fffffff)+(W&0x3fffffff);if(X&Y){return a1^0x80000000^Z^a0}if(X|Y){if(a1&0x40000000){return a1^0xc0000000^Z^a0}else{return a1^0x40000000^Z^a0}}else{return a1^Z^a0}}function i(V,W,X){return V&W|~V&X}function j(V,W,X){return V&X|W&~X}function l(V,W,X){return V^W^X}function m(V,W,X){return W^(V|~X)}function n(V,W,X,Y,Z,a0,a1){V=h(V,h(h(i(W,X,Y),Z),a1));return h(g(V,a0),W)};function o(V,W,X,Y,Z,a0,a1){V=h(V,h(h(j(W,X,Y),Z),a1));return h(g(V,a0),W)};function p(V,W,X,Y,Z,a0,a1){V=h(V,h(h(l(W,X,Y),Z),a1));return h(g(V,a0),W)};function q(V,W,X,Y,Z,a0,a1){V=h(V,h(h(m(W,X,Y),Z),a1));return h(g(V,a0),W)};function r(V){var W;var X=V['length'];var Y=X+0x8;var Z=(Y-Y%0x40)/0x40;var a0=(Z+0x1)*0x10;var a1=Array(a0-0x1);var a2=0x0;var a3=0x0;while(a3<X){W=(a3-a3%0x4)/0x4;a2=a3%0x4*0x8;a1[W]=a1[W]|V['charCodeAt'](a3)<<a2;a3++}W=(a3-a3%0x4)/0x4;a2=a3%0x4*0x8;a1[W]=a1[W]|0x80<<a2;a1[a0-0x2]=X<<0x3;a1[a0-0x1]=X>>>0x1d;return a1};function s(V){var W='',X='',Y,Z;for(Z=0x0;Z<=0x3;Z++){Y=V>>>Z*0x8&0xff;X='0'+Y['toString'](0x10);W=W+X['substr'](X['length']-0x2,0x2)}return W};function t(V){V=V['replace'](/\r\n/g,'\x0a');var W='';for(var X=0x0;X<V['length'];X++){var Y=V['charCodeAt'](X);if(Y<0x80){W+=String['fromCharCode'](Y)}else if(Y>0x7f&&Y<0x800){W+=String['fromCharCode'](Y>>0x6|0xc0);W+=String['fromCharCode'](Y&0x3f|0x80)}else{W+=String['fromCharCode'](Y>>0xc|0xe0);W+=String['fromCharCode'](Y>>0x6&0x3f|0x80);W+=String['fromCharCode'](Y&0x3f|0x80)}}return W};var u=Array();var v,w,y,z,A,B,C,D,E;var F=0x7,G=0xc,H=0x11,I=0x16;var J=0x5,K=0x9,L=0xe,M=0x14;var N=0x4,O=0xb,P=0x10,Q=0x17;var R=0x6,S=0xa,T=0xf,U=0x15;u=r(t(string));B=0x67452301;C=0xefcdab89;D=0x98badcfe;E=0x10325476;for(v=0x0;v<u['length'];v+=0x10){w=B;y=C;z=D;A=E;B=n(B,C,D,E,u[v+0x0],F,0xd76aa478);E=n(E,B,C,D,u[v+0x1],G,0xe8c7b756);D=n(D,E,B,C,u[v+0x2],H,0x242070db);C=n(C,D,E,B,u[v+0x3],I,0xc1bdceee);B=n(B,C,D,E,u[v+0x4],F,0xf57c0faf);E=n(E,B,C,D,u[v+0x5],G,0x4787c62a);D=n(D,E,B,C,u[v+0x6],H,0xa8304613);C=n(C,D,E,B,u[v+0x7],I,0xfd469501);B=n(B,C,D,E,u[v+0x8],F,0x698098d8);E=n(E,B,C,D,u[v+0x9],G,0x8b44f7af);D=n(D,E,B,C,u[v+0xa],H,0xffff5bb1);C=n(C,D,E,B,u[v+0xb],I,0x895cd7be);B=n(B,C,D,E,u[v+0xc],F,0x6b901122);E=n(E,B,C,D,u[v+0xd],G,0xfd987193);D=n(D,E,B,C,u[v+0xe],H,0xa679438e);C=n(C,D,E,B,u[v+0xf],I,0x49b40821);B=o(B,C,D,E,u[v+0x1],J,0xf61e2562);E=o(E,B,C,D,u[v+0x6],K,0xc040b340);D=o(D,E,B,C,u[v+0xb],L,0x265e5a51);C=o(C,D,E,B,u[v+0x0],M,0xe9b6c7aa);B=o(B,C,D,E,u[v+0x5],J,0xd62f105d);E=o(E,B,C,D,u[v+0xa],K,0x2441453);D=o(D,E,B,C,u[v+0xf],L,0xd8a1e681);C=o(C,D,E,B,u[v+0x4],M,0xe7d3fbc8);B=o(B,C,D,E,u[v+0x9],J,0x21e1cde6);E=o(E,B,C,D,u[v+0xe],K,0xc33707d6);D=o(D,E,B,C,u[v+0x3],L,0xf4d50d87);C=o(C,D,E,B,u[v+0x8],M,0x455a14ed);B=o(B,C,D,E,u[v+0xd],J,0xa9e3e905);E=o(E,B,C,D,u[v+0x2],K,0xfcefa3f8);D=o(D,E,B,C,u[v+0x7],L,0x676f02d9);C=o(C,D,E,B,u[v+0xc],M,0x8d2a4c8a);B=p(B,C,D,E,u[v+0x5],N,0xfffa3942);E=p(E,B,C,D,u[v+0x8],O,0x8771f681);D=p(D,E,B,C,u[v+0xb],P,0x6d9d6122);C=p(C,D,E,B,u[v+0xe],Q,0xfde5380c);B=p(B,C,D,E,u[v+0x1],N,0xa4beea44);E=p(E,B,C,D,u[v+0x4],O,0x4bdecfa9);D=p(D,E,B,C,u[v+0x7],P,0xf6bb4b60);C=p(C,D,E,B,u[v+0xa],Q,0xbebfbc70);B=p(B,C,D,E,u[v+0xd],N,0x289b7ec6);E=p(E,B,C,D,u[v+0x0],O,0xeaa127fa);D=p(D,E,B,C,u[v+0x3],P,0xd4ef3085);C=p(C,D,E,B,u[v+0x6],Q,0x4881d05);B=p(B,C,D,E,u[v+0x9],N,0xd9d4d039);E=p(E,B,C,D,u[v+0xc],O,0xe6db99e5);D=p(D,E,B,C,u[v+0xf],P,0x1fa27cf8);C=p(C,D,E,B,u[v+0x2],Q,0xc4ac5665);B=q(B,C,D,E,u[v+0x0],R,0xf4292244);E=q(E,B,C,D,u[v+0x7],S,0x432aff97);D=q(D,E,B,C,u[v+0xe],T,0xab9423a7);C=q(C,D,E,B,u[v+0x5],U,0xfc93a039);B=q(B,C,D,E,u[v+0xc],R,0x655b59c3);E=q(E,B,C,D,u[v+0x3],S,0x8f0ccc92);D=q(D,E,B,C,u[v+0xa],T,0xffeff47d);C=q(C,D,E,B,u[v+0x1],U,0x85845dd1);B=q(B,C,D,E,u[v+0x8],R,0x6fa87e4f);E=q(E,B,C,D,u[v+0xf],S,0xfe2ce6e0);D=q(D,E,B,C,u[v+0x6],T,0xa3014314);C=q(C,D,E,B,u[v+0xd],U,0x4e0811a1);B=q(B,C,D,E,u[v+0x4],R,0xf7537e82);E=q(E,B,C,D,u[v+0xb],S,0xbd3af235);D=q(D,E,B,C,u[v+0x2],T,0x2ad7d2bb);C=q(C,D,E,B,u[v+0x9],U,0xeb86d391);B=h(B,w);C=h(C,y);D=h(D,z);E=h(E,A)}if(bit==0x20){return(s(B)+s(C)+s(D)+s(E))['toLowerCase']()}return(s(C)+s(D))['toLowerCase']()}