// LINE developersのメッセージ送受信設定に記載のアクセストークン
const LINE_TOKEN =
  PropertiesService.getScriptProperties().getProperty("LINE_TOKEN"); // Messaging API設定の一番下で発行できるLINE Botのアクセストークン
const LINE_URL = "https://api.line.me/v2/bot/message/reply";

//ユーザーがメッセージを送信した時に下記を実行する
function doPost(e) {
  const json = JSON.parse(e.postData.contents);

  //replyToken…イベントへの応答に使用するトークン(Messaging APIリファレンス)
  // https://developers.line.biz/ja/reference/messaging-api/#message-event
  const replyToken = json.events[0].replyToken;
  const messageId = json.events[0].message.id;
  const messageType = json.events[0].message.type;
  const messageText = json.events[0].message.text;

  console.log(json.events[0]);

  if (replyToken == null) {
    return;
  }

  const option = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${LINE_TOKEN}`,
    },
    method: "post",
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: [
        {
          type: "text",
          text: messageText,
        },
      ],
    }),
  };

  UrlFetchApp.fetch(LINE_URL, option);
}
