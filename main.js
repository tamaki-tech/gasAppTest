// LINE developersのメッセージ送受信設定に記載のアクセストークン
const LINE_TOKEN =
  PropertiesService.getScriptProperties().getProperty("LINE_TOKEN"); // Messaging API設定の一番下で発行できるLINE Botのアクセストークン
const OPENAI_API_KEY =
  PropertiesService.getScriptProperties().getProperty("OPENAI_API_KEY");
const LINE_URL = "https://api.line.me/v2/bot/message/reply";
const GPT_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const MODEL_NAME = "gpt-4o-mini";
const MODEL_TEMP = 0.7;
const MAX_TOKENS = 500;

/**
 * OpenAIへリクエストを投げてAIの解答を取得する
 */
const postOpenAI = (message) => {
  // LINEのメッセージをChatGPTにメッセージ
  const messages = [{ role: "user", content: message }];
  const headers = {
    Authorization: "Bearer " + OPENAI_API_KEY,
    "Content-type": "application/json",
  };
  const options = {
    method: "POST",
    headers: headers,
    payload: JSON.stringify({
      model: MODEL_NAME, // 使用するGPTモデル
      max_tokens: MAX_TOKENS, // 最大トークン
      temperature: MODEL_TEMP, // ランダム性
      messages: messages,
    }),
  };
  const res = JSON.parse(
    UrlFetchApp.fetch(GPT_ENDPOINT, options).getContentText()
  );

  return res.choices[0].message.content.trimStart();
};

//ユーザーがメッセージを送信した時に下記を実行する
const doPost = (e) => {
  const json = JSON.parse(e.postData.contents);
  const replyToken = json.events[0].replyToken;
  const messageType = json.events[0].message.type;
  const messageText = json.events[0].message.text;

  if (replyToken == null) return;
  if (messageType !== "text") return;

  const res = postOpenAI(messageText);

  const option = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + LINE_TOKEN,
    },
    method: "post",
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: [
        {
          type: "text",
          text: res,
        },
      ],
    }),
  };

  UrlFetchApp.fetch(LINE_URL, option);

  return;
};
