let myName = "";
let myID = "";

function device()
{
	var ua = navigator.userAgent;
	if ( ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) ){
		return 'mobile';
	}
	else{
		if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
			return 'tablet';
		}
		else{
			return 'desktop';
		}
	}
}

window.addEventListener('load', function(){
	var wo = device();
	var width = window.innerWidth;
	var moji_width = width / 20;	// 20文字表示のための１文字のpxサイズ
	if ( wo == "tablet" ){
		moji_width = width / 40;
	}
	if ( wo == "desktop" ){
		moji_width = 16;
	}
	var x = moji_width / 16;	// 基本16pxが１文字
    document.body.style.fontSize = x + 'rem';

    /* パラメータの受け取り */
    if (document.location.search) {
		var par = window.location.href.split('/').pop();
		let parAry = par.split('?');
		myName = parAry[0];
        myID = parAry[1];
	    if ( myID != '0' ){
	        let tbl = document.querySelector('tbody');
	        var text = tbl.innerHTML;
	        var myTAG = '<trid>' + myID + '</trid>';
	        var posID = text.indexOf(myTAG);
	        if ( posID > 0 ){
	            var posTr = text.lastIndexOf('<tr>', posID);
	            var before = text.slice(0, posTr -1);
	            var after = text.slice(posTr + 4, text.length);
	            var result = before + "<tr scope='wo'>" + after;
	            tbl.innerHTML = result;
	      }
	   }
    }
});

function do_next( type )
{

	if ( type == 0 ){
		window.open("about:blank","_self").close();
		return;
	}

	var par = window.location.href;
	if ( type == 1 ){
		var path = par.replace("post2", "post1");
		window.open(path, "成績表");
		window.open("about:blank","_self").close();
		return;
	}
	if ( type == 2 ){
		var path = par.replace("post1", "post2");
		window.open(path, "採点詳細");
		window.open("about:blank","_self").close();
		return;
	}

}

