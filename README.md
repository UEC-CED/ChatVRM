# ChatVRM

ChatVRMはブラウザで簡単に3Dキャラクターと会話ができるデモアプリケーションです。

VRMファイルをインポートしてキャラクターに合わせた声の調整や、感情表現を含んだ返答文の生成などを行うことができます。

ChatVRMの各機能は主に以下の技術を使用しています。

- ユーザーの音声の認識
    - [Web Speech API(SpeechRecognition)](https://developer.mozilla.org/ja/docs/Web/API/SpeechRecognition)
- 返答文の生成
    - [ChatGPT API](https://platform.openai.com/docs/api-reference/chat)
- 読み上げ音声の生成
    - [Koemotion/Koeiromap API](https://koemotion.rinna.co.jp/)
- 3Dキャラクターの表示
    - [@pixiv/three-vrm](https://github.com/pixiv/three-vrm)


## デモ

GitHub Pagesでデモを公開しています。

[https://pixiv.github.io/ChatVRM](https://pixiv.github.io/ChatVRM)

## 準備
### 環境
Docker, docker-composeを端末にインストール。
### APIキー
- OPENAI APIキー
- Koeiromap APIキー  

[.env.local](.env.local.sample)にAPIキーを記載  
[config.json](.env.local.sample)にAPIキーを記載

## 実行
リポジトリをクローンするか、ダウンロードしてください。  
リポジトリフォルダに移動後以下を実行

```bash
# https
docker compose up -d
# http
docker compose --file docker-compose.wo_ssl.yml up -d
```

実行後、以下のURLにアクセスして動作を確認して下さい。

[http://localhost:3000](http://localhost:3000) 


---

## ChatGPT API

ChatVRMでは返答文の生成にChatGPT APIを使用しています。

ChatGPT APIの仕様や利用規約については以下のリンクや公式サイトをご確認ください。

- [https://platform.openai.com/docs/api-reference/chat](https://platform.openai.com/docs/api-reference/chat)
- [https://openai.com/policies/api-data-usage-policies](https://openai.com/policies/api-data-usage-policies)


## Koeiromap API
ChatVRMでは返答文の音声読み上げにKoemotionのKoeiromap APIを使用しています。

Koeiromap APIの仕様や利用規約については以下のリンクや公式サイトをご確認ください。

- [https://koemotion.rinna.co.jp/](https://koemotion.rinna.co.jp/)

# VRM
VRMファイルを用意すれば任意のアバターを読み込める。  
例えば、[ジョイマン高木のVRM](https://campaign.showroom-live.com/takagi/)を使用することができる。

# 背景
[_document.tsx](src/pages/_document.tsx)の`<body style={{ backgroundImage: `url(${buildUrl("/bg-ced.png")})` }}>`を変更