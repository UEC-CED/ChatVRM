from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import qa_chatbot_uec_ced

app = FastAPI()

# CORS設定
origins = ["*"]  # すべてのオリジンからのアクセスを許可する

# CORSミドルウェアを追加する
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

quert_engine = qa_chatbot_uec_ced.UECQueryEngine(reindex=True)  # 一応起動時にインデックスを作成しておく


@app.get("/helloworld")
def hello_world():
    return {"Hello": "World"}


@app.get("/question")
def return_answer(question_sentence: str):
    ans = str(quert_engine.query(question_sentence))
    # 。ごとに改行を入れる
    ans = ans.replace("。", "。\n")
    return {"ans": ans}


@app.get("/makeindex")
def make_index():
    quert_engine.make_index()
    return {"status": "ok"}
