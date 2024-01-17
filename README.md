# AI Shimazaki
電気通信大学 技術職員である島崎をAI化したものです  
雑談や電気通信大学に関する質問ができます

## 準備
### 環境
Docker, docker-composeを端末にインストール
### APIキー
以下を取得してください
- OPENAI APIキー （参考：[https://book.st-hakky.com/data-science/open-ai-create-api-key/](https://book.st-hakky.com/data-science/open-ai-create-api-key/)）
- Koeiromap APIキー （参考：[https://note.com/npaka/n/n44652d3c9fcc](https://note.com/npaka/n/n44652d3c9fcc)）

`.env.local`を`/frontend/`に作成してAPIキーを記載(参考：[/frontend/.env.local.sample](/frontend/.env.local.sample))  

## 実行
リポジトリをクローンするか、ダウンロードしてください。  

リポジトリフォルダに移動後以下を実行

```bash
# https(音声認識を使用したい場合, 通常はこちら)
docker compose up -d
# http(音声認識使用不可)
docker compose --file docker-compose.wo_ssl.yml up -d
```

実行後、以下のURLにアクセスして動作を確認して下さい  
- httpsの場合：[https://localhost/ced-iot](https://localhost/ced-iot)  
- httpの場合：[http://localhost/ced-iot](http://localhost/ced-iot) 

### 大学サーバーの利用
大学のサーバーで運用をする場合，以下の事項が必要です
- 443, 80ポートを開ける
- `/frontend/.env.local`のBASE_URLにサーバーアドレスを記載(`https://brown01.ced.cei.uec.ac.jp/ced-iot/api/`のように最後に`/api`を記述すること　参考：[/frontend/.env.local.sample](/frontend/.env.local.sample))  
- アクセス先の例：https://brown01.ced.cei.uec.ac.jp/ced-iot/

## 電通大QA
[backend/qa_api/data](backend/qa_api/data)に電通大に関する情報を記述したテキストファイルを配置してください.  
記述形式は現在検討中です．

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
VRMファイルを用意すれば任意のアバターを読み込める  
例えば、[ジョイマン高木のVRM](https://campaign.showroom-live.com/takagi/)を使用することができる  
また，[VRoidStudio](https://vroid.com/studio)を使用してオリジナルのアバターを作成できる

# 背景
[_document.tsx](src/pages/_document.tsx)の`<body style={{ backgroundImage: `url(${buildUrl("/bg-ced.png")})` }}>`を変更
