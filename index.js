const HELP1_JP = "確認したい成績表を下記メニューから選択してください";
const HELP1_CH = "从下列菜单中选择要确认的成绩表";
const HELP1_EN = "Select the gradebook from the menu below";

const HELP2_JP = "採点以前では進行予定表が表示されます";
const HELP2_CH = "计分前会显示比赛进度时间表";
const HELP2_EN = "Program schedule before scoring";

const HELP3_JP = "氏名の「読み」は長押しタップで確認できます";
const HELP3_CH = "长按姓名读音可以查找确认";
const HELP3_EN = "Long-pressing for name spelling";

const MENU1_JP = "氏名から検索する";
const MENU1_CH = "按姓名搜索查找";
const MENU1_EN = "Search by Name";

const MENU2_JP = "団体名から検索する";
const MENU2_CH = "按团体名称搜索查找"
const MENU2_EN = "Search by Organization Name";

const MENU3_JP = "競技から検索する";
const MENU3_CH = "按比赛項目搜索";
const MENU3_EN = "Search by Competition";

const MENU4_JP = "コート別の成績表";
const MENU4_CH = "各场地比赛成绩表";
const MENU4_EN = "Result by court";

const MENU5_JP = "団体競技・その他";
const MENU5_CH = "团体地比赛成绩表・其他";
const MENU5_EN = "Result by Team・other";
const MENU_LANG = "myLang";

const singleMenu = 1;
const modeCookie = 1;
const parID = "myPar";

let LANG = "JP";
let x = 1.0;
let x_init = 1.0;
let x_inc = 0.5;
let downTime = 0;
let upTime = 0;
let wo = "desktop";

// 展開されたメニューのID
let base_top = 0;
let onCnt = 0;
let onMe = new Array(256);
let onYou = new Array(256);

// 展開されるメニューのID
let hideCnt = 0;
let hideID = new Array(256);

function onHide( id )
{
	let text;
    let body = document.getElementById(id).outerHTML;
	let top = id.slice(0,1);
	if ( top == "M" ){
		text = body.replace('><a>', ' class="hide"><a>');
	}
	else{
		text = body.replace('offM"', 'offM hide"');
	}
	document.getElementById(id).outerHTML = text;
}

function offHide( id )
{
	let text;
// console.log("[",id,"]");

    let body = document.getElementById(id).outerHTML;
	let top = id.slice(0,1);
	if ( top == "M" ){
		text = body.replace(' class="hide"', '');
	}
	else{
		text = body.replace('offM hide"', 'offM"');
	}
	document.getElementById(id).outerHTML = text;
}

/*
	展開されるため表示対象となるIDか
*/
function isHideID(id, target)
{
	let top = target.slice(0,1);

	if ( top == "M" ){
		let wo = id + "L";
		let ni = target.slice(0, wo.length);
		if ( wo == ni ){
			return( 1 );
		}
	}
	else{
		let wo_size = id.length;
		let ni_size = target.length;
		if ( (wo_size + 2 ) != ni_size ){
			return( 0 );
		}
		let wo = "P" + id.slice(1, wo_size);
		let ni = target.slice(0, wo_size);
		if ( wo == ni ){
			return( 1 );
		}
	}

	return( 0 );
}

/*
	展開を遅延させるIDを格納する
	親メニューは先頭がP、明細行はM
*/
function loadHideID( id )
{
	let pos = 0;
	hideCnt = 0;

    let body = document.getElementById(id).outerHTML;
	pos = body.indexOf('id="', 0);
	while (pos >= 0){
		let last = body.indexOf('"', pos+4);
		if ( last > 0 ){
			let ni = body.slice(pos+4, last);
// console.log(id, ni, pos, last);
			if ( isHideID(id, ni) && hideCnt < 256 ){
				hideID[hideCnt] = ni;
				hideCnt++;
			}
		}
		pos = body.indexOf('id="', last);
	}
}

function device()
{
	var ua = navigator.userAgent;
	if ( ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) ){
		return 'mobile';
	}
	if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
		return 'tablet';
	}
	return 'desktop';
}
/*
			var window_w = window.innerWidth;
			var window_h = window.innerHeight;
*/
window.addEventListener('load', function(){
	wo = device();
	var width = window.innerWidth;
	var moji_width = width / 16;	// 16文字を１行に表示したい
	if ( wo == "tablet" ){
		moji_width = width / 32;
	}
	if ( wo == "desktop" ){
		moji_width = 16;
	}
	x = moji_width / 16;	// 16pxで１文字が標準
	x_init = x;
	x_inc = x_init / 2;
    document.body.style.fontSize = x + 'rem';

	if ( wo == "mobile" ){
		let style = document.getElementById("help").style;
		moji_width = width / 28;
		var y = moji_width / 16;
    	style.fontSize = y + 'rem';
	}

	if ( modeCookie == 1 ){
		const langage = navigator.language;
		const top2 = langage.slice(0,2);
		if ( top2 == "zh" ){
			LANG = "CH";
			dispMenu(LANG);
		}
		else
		if ( top2 == "en" || top2 == "fr" || top2 == "it" || top2 == "es" || top2 == "pt" || top2 == "de" ){
			LANG = "EN";
			dispMenu(LANG);
		}
	}
	else
	if ( moceCoookie > 1 ){
		LANG = getCookie(MENU_LANG);
		if ( LANG == "" ){
			LANG = "JP";
			setCookie(MENU_LANG, LANG, 1);
		}
		else
		if ( LANG != "JP" ){
			dispMenu(LANG);
		}
	}
/*
	loadHideID("M0102");
	console.log("cnt=", hideCnt);
	for (var i = 0; i < hideCnt; i++){ 
		console.log("[",i,"][ ", hideID[i], "]");
	}
*/
});

// 漢字と読みの切り換え
function swap(me) {
	let contents = document.getElementById(me);
    var text = contents.innerHTML;
	if ( text.indexOf("p1>") > 0 ){	// 漢字が表示されている
		text = text.replaceAll("p2>", "p3>");
		text = text.replaceAll("p1>", "p0>");
		contents.innerHTML = text;
		return true;
	}
	if ( text.indexOf("p0>") > 0 ){	// 読みが表示されている
		text = text.replaceAll("p0>", "p1>");
		text = text.replaceAll("p3>", "p2>");
		contents.innerHTML = text;
		return true;
	}
	return false;
}

// かな・ローマ字の切り換え
function yomiSwap(me) {
	let contents = document.getElementById(me);

    var text = contents.innerHTML;

	text = text.replaceAll("p0>", "p1>");
	text = text.replaceAll("p3>", "p2>");
//	text = text.replaceAll("p5>", "p4>");

	text = text.replaceAll("p2>", "p9>");
	text = text.replaceAll("p4>", "p2>");
	text = text.replaceAll("p9>", "p4>");

	contents.innerHTML = text;

	return true;
}

// メニュー(閉->開)のIDを格納
function addID(me,you)
{
	onMe[onCnt] = me;
	onYou[onCnt] = you;
	onCnt++;
	onMe[onCnt] = "";
	onYou[onCnt] = "";
}
// メニュー(開->閉)のIDを削除
function delID(me,you)
{
	let i;
	i = 0;
	while( i < onCnt){
		if ( me == onMe[i] ){
			while( i < onCnt){
				onMe[i] = onMe[i+1];
				onYou[i] = onYou[i+1];
				i++;
			}
			onCnt--;
			return;
		}
		i++;
	}
}

/* メニューの開閉 */
function youOpen(me, you) {
	let status;
	let txt;
    let contents = document.getElementById(me).outerHTML;
    let obj = document.getElementById(you).style;
    if (obj.display=="none") {
		// 閉->開
		if ( singleMenu > 1 ){
			var i;
			const window_h = window.innerHeight;
			loadHideID( you );
			for ( i = 0; i < hideCnt; i++ ){
				onHide( hideID[i] );
			}
        	obj.display = "block";
			for ( i = 0; i < hideCnt; i++ ){
				const par = hideID[i];

				setTimeout(offHide, 1000, par);

				const top1 = document.getElementById( par ).getBoundingClientRect().top;
				if ( top1 > window_h ){
					break;
				}

			}
			for ( ; i < hideCnt; i++ ){
				offHide( hideID[i] );
			}
		}
		else{
        	obj.display = "block";
		}
		txt = contents.replace("offM", "onM");
		if (singleMenu > 0){
			addID(me,you);
		}
		status = 1;
    }
    else{
		// 開->閉
        obj.display = "none" ;
		txt = contents.replace("onM", "offM");
		if (singleMenu > 0){
			delID(me,you);
		}
		status = -1;
    }
	document.getElementById(me).outerHTML = txt;
	return( status );
}

/*
	P0101ならP01*
	P010201ならP0102*
	が処理対応。
　	同一レベル以下が対象。
*/
function isTargetID(id, target)
{
	if ( id == target ){
		return( 0 );
	}
	let  size = id.length;
	let  you = target.slice(0, size);
	if ( id == you ){
		return( 1 );
	}
	return( 0 );
}
function menuClose(me)
{
	let i;

	if ( onCnt < 1 ){
		return;
	}

	i = me.length;
	i -= 2;

	let id = me.slice( 0, i );
	i = 0;
	while( i < onCnt ){
		if ( me != onMe[i] ){
			if ( isTargetID( id, onMe[i] ) == 1 ){
				youOpen( onMe[i], onYou[i] );
				continue;
			}
		}
		i++;
	}
}

function scoreOpen(me, fname, par) {
	let day = Date.now();
	day = Math.trunc(day /8000);
	var path = ".\\post1\\" + fname + ".HTML";
//	window.open(path + "?" + par + "?" + day, "成績表");
	window.open(path + "?" + par + "?" + LANG + "?" + day, "成績表");
}

function onPush(){
	downTime = new Date();
}
function offPush(me, fname, par){
	let bSwap = false;

	upTime = new Date();
	let pushTime = upTime - downTime;
	if (pushTime > 350){
		if ( swap(me) == true ){
			bSwap = true;
		}
	}

	if ( bSwap == false ){
		if ( par ){
			let day = Date.now();
			day = Math.trunc(day /8000);
			var path = ".\\post1\\" + fname + ".HTML";
			window.open(path + "?" + par + "?" + LANG + "?" + day, "成績表");
		}
		else{
			if ( singleMenu > 0 ){
				const top1 = document.getElementById(me).getBoundingClientRect().top;
				menuClose(me);
				const top2 = document.getElementById(me).getBoundingClientRect().top;
				window.scrollBy({top: top2 - top1,left: 0,	behavior: 'smooth'});
				youOpen(me, fname);
			}
			else{
				youOpen(me, fname);
			}
		}
	}

	downTime = 0;
	upTime = 0;
}

function do_next( type )
{
	if ( type == 0 ){
		window.close();
		return;
	}
	if ( type == 3 ){
		var path = getCookie(parID);
		if ( path != "" ){
//	console.log("[" + path + "]");
			let day = Date.now();
			day = Math.trunc(day /8000);
			let ary = path.split("?");
			path = path.replace(ary[3], day);
			window.open(".\\post1\\" + path, "成績表");
		}
	}
}

function do_UpScale(id)
{
	let body = document.getElementById(id);
	x += x_inc;
	body.style.fontSize = x + 'rem';
}
function do_DownScale(id)
{
	x -= x_inc;
	if ( x >= x_init ){
		let body = document.getElementById(id);
		body.style.fontSize = x + 'rem';
	}
	else{
		x += x_inc;
	}
}

// ある言語のメニュー表示
function dispMenu(lang) {

	let menu1;
	let menu2;
	let menu3;
	let menu4;
	let menu5;

	if ( lang == "CH" ){
		menu1 = MENU1_CH;
		menu2 = MENU2_CH;
		menu3 = MENU3_CH;
		menu4 = MENU4_CH;
		menu5 = MENU5_CH;
	}
	else
	if ( lang == "EN" ){
		menu1 = MENU1_EN;
		menu2 = MENU2_EN;
		menu3 = MENU3_EN;
		menu4 = MENU4_EN;
		menu5 = MENU5_EN;
	}
	else{
		menu1 = MENU1_JP;
		menu2 = MENU2_JP;
		menu3 = MENU3_JP;
		menu4 = MENU4_JP;
		menu5 = MENU5_JP;
	}

    let P1 = document.getElementById("P01");
    let P2 = document.getElementById("P02");
    let P3 = document.getElementById("P03");
    let P4 = document.getElementById("P04");
    let P5 = document.getElementById("P05");
	P01.innerHTML = P01.innerHTML.replace(P01.innerText, menu1);
	P02.innerHTML = P02.innerHTML.replace(P02.innerText, menu2);
	P03.innerHTML = P03.innerHTML.replace(P03.innerText, menu3);
	P04.innerHTML = P04.innerHTML.replace(P04.innerText, menu4);
	if ( P05 ){
		P05.innerHTML = P05.innerHTML.replace(P05.innerText, menu5);
	}
}

// ヘルプの表示・非表示
function helpOpen(you,lang) {

    let contents = document.getElementById(you);
	let text;

	if ( lang == "CH" ){
		text = "1." + HELP1_CH + "\n2." + HELP2_CH + "\n3." + HELP3_CH + "\n";
	}
	else
	if ( lang == "EN" ){
		text = "1." + HELP1_EN + "\n2." + HELP2_EN + "\n3." + HELP3_EN + "\n";
	}
	else{
		text = "1." + HELP1_JP + "\n2." + HELP2_JP + "\n3." + HELP3_JP + "\n";
	}
	contents.innerText = text;
	let obj = contents.style;
	if ( lang == LANG ){
		obj.display = (obj.display=="none") ? "block": "none" ;
	}
	else{
        obj.display = "block";

		dispMenu(lang);

		if (lang=="JP" || LANG=="JP"){
		    yomiSwap("M01");
		    yomiSwap("M02");
		    yomiSwap("M03");
		}

		LANG = lang;
		if ( modeCookie > 1 ){
			updateCookie(MENU_LANG, LANG, 1);
		}
	}

}

// CLASS変更のため、指定セレクタのCSSルールを取得する
// 呼び出し例　getRuleBySelector(".inner1")   seleにCSSセレクタ
// targetClass.style.backgroundColor = 'hsl('+chgColor.val+', 100%, 50%)';
function getRuleBySelector(sele){
    var i, j, sheets, rules, rule = null;

    // stylesheetのリストを取得
    sheets = document.styleSheets;
    for(i=0; i<sheets.length; i++){
        // そのstylesheetが持つCSSルールのリストを取得
        rules = sheets[i].cssRules;
        for(j=0; j<rules.length; j++){
            // セレクタが一致するか調べる
            if(sele === rules[j].selectorText){
                rule = rules[j];
    			return( rule );
            }
        }
    }
    return( null );
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

