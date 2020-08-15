// GASが呼び出されたときに実行。HTMLを表示する
function doGet(e) {
    var app = HtmlService.createHtmlOutputFromFile("index")
    return app;
}

// スプレッドシートからランダムに問題を取得し戻り値として返す関数
function getQuizAndAnswer(ans_old)
{
  var count_max = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Parameter').getRange("B1").getValue(); // 最大出題回数
    
  // スプレッドシート処理
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('List');
  var max_r = sheet.getLastRow() - 1;
        
  do {
    // 全行からランダムに1行選択---
    var r = Math.floor(Math.random() * max_r) + 2; 
    
    // 問題文、回答文、出題回数、問題番号の取得
    /*
    var arr = sheet.getRange(r, 1, 1, 5).getValues();
    var text_quiz_e = arr[0][1];
    var text_quiz_j = arr[0][2];
    var text_answer = arr[0][3];
    var count_q     = arr[0][4];
    var num_quiz    = arr[0][0];
    var flg_isHL    = isHighlighted(sheet, r);
    */
    
    var text_quiz_e = sheet.getRange("B" + r).getValue();
    var text_quiz_j = sheet.getRange("C" + r).getValue();
    var text_answer = sheet.getRange("D" + r).getValue();
    var count_q     = sheet.getRange("E" + r).getValue();
    var num_quiz    = sheet.getRange("A" + r).getValue();
    var flg_isHL    = isHighlighted(sheet, r);
    
    console.log(text_answer);
  
  // 「「最大出題回数を満たした問題」かつ「チェック済みでない」」または「1問前と同じ問題」の場合、ループを継続（問題再選択）
  } while (((count_q >= count_max)&&(!flg_isHL)) || (text_answer == ans_old))
    
  // 出題回数を1増加・日付を入力
  sheet.getRange("E" + r).setValue(count_q + 1);
  sheet.getRange("F" + r).setValue(new Date());
  
  return {num:       num_quiz,
          text_q_en: text_quiz_e,
          text_q_ja: text_quiz_j,
          text_a:    text_answer,
          count:     count_q,
          isHL:      flg_isHL};
  
}

// 答えを引数としてセルを着色する関数（ミスりやすい問題をチェックする機能）
function highlightOrUnHighlightSpecificQuiz(ans) {
  // スプレッドシート処理
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('List');
  
  // 行番号探索
  var r = searchRowInColumnByString(ans, "D");
  
  // 問題番号セルを着色／解除
  if (!isHighlighted(sheet, r)) {
    // 未チェック問題
    sheet.getRange("A" + r).setBackground('#ffff00');
  } else {
    // 既チェック問題
    sheet.getRange("A" + r).setBackground('#ffffff');
  }
}

// ---以下、サーバ内からのみ呼び出される関数---------------------------------
// 行を引数としてハイライト済みであるか判定する関数
function isHighlighted(sht, row) {
  
  const STR_COLOR = "#ffff00";
  
  // 問題番号セルの色を取得
  var bgc = sht.getRange("A" + row).getBackground();
  if (bgc.toLowerCase() == STR_COLOR.toLowerCase()) { // 念のため小文字同士で比較
    return true;
  } else {
    return false;
  };
}

function searchRowInColumnByString(str, col) {
  
  // スプレッドシート処理
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('List');
  
  // 行番号探索
  var arr = sheet.getRange(col+":"+col).getValues();
  for (var i = 2; i < arr.length; i++) {
    if (sheet.getRange(col + i).getValue() == str) {
      var r = i;
      break;
    }
  }
  return i;
}

function testRand() {
  const MAX_R     = 500;
  const MAX_TRIAL = 1000000;
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RandTest');
  
  // 格納用配列生成
  var arr = [[]];
  for (var i = 0; i < MAX_R; i++) {
    arr[i] = [i, 0];
  }
  
  for (var i = 0; i < MAX_TRIAL; i++) {
    var r = Math.floor(Math.random() * MAX_R); // 1~MAX_Rの一様乱数を発生するはず
    var count = arr[r][1];
    arr[r][1] = count + 1;
  }
  
  sheet.getRange(1, 1, MAX_R, 2).setValues(arr);
}