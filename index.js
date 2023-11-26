
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

let LANG = "JP";
let x = 1.0;
let x_init = 1.0;
let x_inc = 0.5;
let downTime = 0;
let upTime = 0;


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

window.addEventListener('load', function(){
	var wo = device();
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

/* メニューの開閉 */
function youOpen(me, you) {
	let txt;
    let contents = document.getElementById(me).outerHTML;
    let obj = document.getElementById(you).style;
    if (obj.display=="none") {
        obj.display = "block";
		txt = contents.replace("offM", "onM");
    }
    else{
        obj.display = "none" ;
		txt = contents.replace("onM", "offM");
    }
	document.getElementById(me).outerHTML = txt;
}

function scoreOpen(me, fname, par) {
	let day = Date.now();
	var path = ".\\post1\\" + fname + ".HTML";
//	window.open(path + "?" + par, "???ѕ\");
	window.open(path + "?" + par + "?" + day, "成績表");
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
			day = Math.trunc(day /1000);
			var path = ".\\post1\\" + fname + ".HTML";
			window.open(path + "?" + par + "?" + day, "成績表");
		}
		else{
			youOpen(me, fname);
		}
	}

	downTime = 0;
	upTime = 0;
}

function do_next( type )
{
	if ( type == 0 ){
		window.open("about:blank","_self").close();
		return;
	}
/*
	var par = window.location.href;
	if ( type == 1 ){
		var path = par.replace("post2", "post1");
		window.open(path, "???ѕ\");
		window.open("about:blank","_self").close();
		return;
	}
	if ( type == 2 ){
		var path = par.replace("post1", "post2");
		window.open(path, "?̓_?ڍﾗ");
		window.open("about:blank","_self").close();
		return;
	}
*/
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

// ヘルプの表示・非表示
function helpOpen(you,lang) {

    let contents = document.getElementById(you);
	let text;
	let menu1;
	let menu2;
	let menu3;
	let menu4;

	if ( lang == "CH" ){
		text = "1." + HELP1_CH + "\n2." + HELP2_CH + "\n3." + HELP3_CH + "\n";
		menu1 = MENU1_CH;
		menu2 = MENU2_CH;
		menu3 = MENU3_CH;
		menu4 = MENU4_CH;
	}
	else
	if ( lang == "EN" ){
		text = "1." + HELP1_EN + "\n2." + HELP2_EN + "\n3." + HELP3_EN + "\n";
		menu1 = MENU1_EN;
		menu2 = MENU2_EN;
		menu3 = MENU3_EN;
		menu4 = MENU4_EN;
	}
	else{
		text = "1." + HELP1_JP + "\n2." + HELP2_JP + "\n3." + HELP3_JP + "\n";
		menu1 = MENU1_JP;
		menu2 = MENU2_JP;
		menu3 = MENU3_JP;
		menu4 = MENU4_JP;
	}
	contents.innerText = text;
	let obj = contents.style;
	if ( lang == LANG ){
		obj.display = (obj.display=="none") ? "block": "none" ;
	}
	else{
        obj.display = "block";

	    let P1 = document.getElementById("P01");
	    let P2 = document.getElementById("P02");
	    let P3 = document.getElementById("P03");
	    let P4 = document.getElementById("P04");
		P01.innerHTML = P01.innerHTML.replace(P01.innerText, menu1);
		P02.innerHTML = P02.innerHTML.replace(P02.innerText, menu2);
		P03.innerHTML = P03.innerHTML.replace(P03.innerText, menu3);
		P04.innerHTML = P04.innerHTML.replace(P04.innerText, menu4);

		if (lang=="JP" || LANG=="JP"){
		    yomiSwap("M01");
		    yomiSwap("M02");
		    yomiSwap("M03");
		}

		LANG = lang;
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

