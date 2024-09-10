let myName = "";
let myID = "";
let myLANG = "JP";
let myYYYY = 0;
let myMM = 0;
let myDD = 0;

const parID = "myPar";
let par = "";

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

// 全角英数字を半角に変換
function toHalfWidth(str) {
  str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  return str;
}

// 集合場所を表示するかのチェック、本日のみ表示したい
// 0:基準日不定 1:本日 -1:本日ではない
function CheckDate(){
/*
//日付をチェックせず(本番当日)
	return( 1 );

//集合案内を表示せず(本番翌日以降)
	return( -1 );
*/
//	let base = new Date(2024,8,7,10,20,0);
//	let base = new Date(2024,7,7,10,20,0);	// 月をマイナス１しないといけない

	var	tbl = document.getElementById("date");
	if ( !tbl ){
		return( 0 );
	}
	var text = tbl.innerHTML;
	var posYY = text.indexOf("年",text);
	var posMM = text.indexOf("月",text);
	var posDD = text.indexOf("日",text);
	if (posYY < 1 || posMM < 1 || posDD < 1){
		return( 0 );
	}
	myYY = parseInt(toHalfWidth(text.slice(0, posYY)));
	if ( myYY == 2024 ){	// for debug
		return( 0 );
	}
	myMM = parseInt(toHalfWidth(text.slice(posYY+1, posMM)));
	myDD = parseInt(toHalfWidth(text.slice(posMM+1, posDD)));
	var myHH = 18;
	var myBase = new Date(myYY,myMM-1,myDD,myHH,0,0);

	var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
	var hours = today.getHours();

// console.log("[" + myBase + "][" + today + "]");

	if ( today > myBase ){
		return( -1 );
	}
	if (year == myYY && month == myMM && day == myDD){
		return( 1 );
	}
	return( 0 );
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

	document.querySelector("table").style.fontSize = x + 'rem';

	var date_mode = CheckDate();
/*
let url = window.location.href;
console.log("<" + url + ">");
*/
    /* パラメータの受け取り */
    if ( document.location.search ) {
		var bShow = true;
		
		par = window.location.href.split('/').pop();
//console.log("par=" + par);
		let parAry = par.split('?');
		myName = parAry[0];
        myID = parAry[1];
		myLANG = parAry[2];

	    if ( myID != '0' ){
	        let tbl = document.querySelector('tbody');
	        var text = tbl.innerHTML;
	        var myTAG = '<trid>' + myID + '</trid>';
	        var posID = text.indexOf(myTAG);
	        if ( posID > 0 ){
	            var posTr = text.lastIndexOf('<tr>', posID);
				var pos1Td = text.indexOf('<td>', posTr);
				var pos2Td = text.indexOf('</td>', posTr);
				if ((pos2Td - pos1Td) < 6) {
					bShow = false;
				}
				if ( text.indexOf("終了】",pos1Td + 4, pos2Td) >= 0 ){
					bShow = false;
				}
				
	            var before = text.slice(0, posTr);
	            var after = text.slice(posTr + 4, text.length);
	            var result = before + "<tr id='woLine' scope='wo'>" + after;
	            tbl.innerHTML = result;
			}
			var myp = document.getElementById("siori");
			if ( myp ) {
		        var text = myp.outerHTML;
				text = text.replace(' hidden=""', '');
				var par2 = getCookie(parID);
				if ( par2 != "" ){
					parAry = par2.split("?");
					if ( parAry[0] == myName && parAry[1] == myID ){
						text = text.replace("☆", "★");
					}
				}
		        myp.outerHTML = text;
			}
		}
		if ( bShow ){
			// 表彰or競技開始の集合案内
			var myp = document.getElementById(myLANG + "01");
			if ( myp ) {
		        var text = myp.outerHTML;
				text = text.replace(' hidden="">', ' class="flowing">');
	            myp.outerHTML = text;
		    }
		}
	}

	// topのボタン
	var myp = document.getElementById(myLANG + "02");
	if ( myp ) {
        var text = myp.outerHTML;
		text = text.replace(' hidden=""', '');
        myp.outerHTML = text;
    }
   	// 進行状況のガイド
	myp = document.getElementById(myLANG + "03");
	if ( myp ) {
        var text = myp.outerHTML;
		text = text.replace(' hidden="">', ' class="flowing">');
        myp.outerHTML = text;
    }
	myp = document.getElementById("htmlPar");
	if ( myp ) {
    	var text = myp.innerHTML;
		var pos = text.indexOf("reload=");
		if ( pos >= 0 ){
			pos += 7;
			var pos2 = text.indexOf("?", pos);
			if ( pos2 < 0 ){
				pos2 = text.length;
			}
			var mss;
			var ss = text.slice(pos, pos2);
			if ( isNaN(ss) )
				mss = 60 * 1000;
			else
				mss = Number(ss) * 1000;

//			console.log("[" + ss + "|" + mss + "]");	
			
		    // ページロード完了後, 60 秒後 (60000 ミリ秒後) にリロード
		    setTimeout(doReload, mss);
		}
		pos = text.indexOf("title=on");
		if ( pos >= 0 ){
			var repText;
			if ( myLANG == "JP" ){
				repText = "進行状況";
			}
			else
			if ( myLANG == "CH" ){
				repText = "比賽進度";
			}
			else{
				repText = "Competition progress";
			}
	        let tbl = document.querySelector("title");
			if ( tbl ){
				tbl.innerHTML = repText;
			}
		}
	}
/*
title=進行状況?reload=on
title=比賽進度?reload=on
title=Competition progress?reload=on
*/
	if ( myLANG != "JP" ){
	    let tbl = document.querySelector("tbody");
		var text = tbl.innerHTML;
		var pos = text.indexOf("終了】");
		if ( pos >= 0 ){
	        if ( myLANG == "CH" ){
				text = text.replace(/終了】/g, "結束】");
			}
			else{
				text = text.replace(/終了】/g, "finish】");
			}
			tbl.innerHTML = text;
		}
	}

});

function skip_wo()
{
	var myp = document.getElementById("woLine");
	if ( myp ) {
		myp.scrollIntoView({ block: "center", behavior: "smooth", });
	}
	else{
		window.scrollTo(0, document.body.scrollHeight);
	}
}

function do_next( type )
{

	if ( type == 0 ){
		window.close();
		return;
	}

	var par = window.location.href;
	if ( type == 1 ){
		var path = par.replace("post2", "post1");
		window.open(path, "成績表");
		window.close();
		return;
	}
	if ( type == 2 ){
		var path = par.replace("post1", "post2");
		window.open(path, "採点詳細");
		window.close();
		return;
	}
	/*
	if ( type == 3 ){
		var path = getCookie(parID);
		if ( path != "" ){
			window.open("..\\post1\\" + path, "成績表");
		}
	}
	*/
	if ( type ){
		let day = Date.now();
		day = Math.trunc(day /8000);
		var path = type + "?" + "0" + "?" + myLANG + "?" + day;
		window.open(path, "進行状況");
//		window.close();
		return;
	}
}

// 引数をクッキーに保存
function parSave(){
    if ( myID != '0' ){
		deleteCookie(parID);
		setCookie(parID, par, 1);
		window.close();
	}
}

// ページを更新するための関数
function doReload(){
    window.location.reload();
}

// クッキーを設定する関数
function setCookie(name, value, days) {
  let date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  let expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + value + expires + "; path=/";
}

// クッキーを取得する関数
function getCookie(name) {
  let cookieName = name + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookies = decodedCookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}

// クッキーを削除する関数
function deleteCookie(name) {
  setCookie(name, "", -1);
}

// クッキーを更新する関数
function updateCookie(name, newValue, newDays = null) {
  let existingCookieValue = getCookie(name);
//console.log("update=[",existingCookieValue,"][",name,"]");
  if (existingCookieValue !== "") {
    let days = newDays ? newDays : getCookieDays(name);
    setCookie(name, newValue, days);
  }
}

// クッキーの有効期限（日数）を取得する補助関数
function getCookieDays(name) {
  // この関数は、クッキーの作成時に有効期限を取得するために使用されます。
  // 必要に応じて実装を追加してください。
}

