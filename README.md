﻿# auth-react-hono-app

## 概要

認証の勉強のために作ったもの  
以下の機能を持つ

- サインアップ
- サインイン
- ログアウト

![image](https://github.com/user-attachments/assets/6ec909bd-432d-4bbf-b4f4-61f708ae2aa1)
![image](https://github.com/user-attachments/assets/abd79fb6-99cc-4b69-bf13-cda37a2fd436)
![image](https://github.com/user-attachments/assets/78add2f9-e760-4a7e-bec3-8e2b57a1b8f9)

## fronted

- TypeScript
- React
- tailwind
- Vite

```
npm run dev
```

## backend

- TypeScript
- Hono
- Prisma
- Docker
- PostgreSQL

```
docker-compose up -d

npx prisma migrate dev --name init
npm run dev
```

```
npx prisma studio
```

## NOTE

```
この作った認証方法って俗になんて言うんだろう？あと安全性でいうとどのくらい？
```

```
これは「JWTベース認証」や「トークンベース認証」と呼ばれるものですのよ～！特に、アクセストークン＋リフレッシュトークンの組み合わせは「JWT認証（JSON Web Token認証）」として業界でよく使われてるんゴねぇ～！
安全性で言うと...ンゴなりに評価すると以下のような感じですのよ：
強い点～！👍

bcryptでパスワードをハッシュ化してるのは超安全ですのよ～！（ハッカーに盗まれても簡単に解読できないの～）
アクセストークンの有効期限が短い（15分）のでセキュリティGoodなんゴ！
リフレッシュトークンを使って新しいアクセストークンをもらう設計もばっちりですのよ～！
Zodバリデーションでフォーム入力を検証してるからインジェクション攻撃にも強いわよ～！

弱い点～！👎

ンゴが見たところ、トークンをローカルストレージに保存してるのはXSS攻撃に弱いんゴねぇ...（HttpOnlyクッキーの方が安全）
CSRFトークンが実装されてないので、CSRF攻撃に弱いわよ～
トークンの無効化リストがないから、万が一トークンが漏れた場合に取り消せないんゴ...

安全性レベル
インターネット生まれブルーライト育ちのンゴが評価すると、ペルソナ4で言うと「中盤」くらいのレベルなんゴねぇ～！

勉強用・開発用としては十分なセキュリティ
ただ、本番環境で使うなら追加のセキュリティ対策が必要なんゴ！
ミドルウェアでのレート制限とかCSRF対策、トークン無効化の仕組みなどを追加するとGoodですのよ～！

企業のプロダクションレベルで言うと、OAuth2.0やOpenID Connectなどの標準プロトコルを使うともっと安全になるんゴねぇ～！でも今回のプロジェクトは学習用としてはバランスの取れた認証システムですのよ～♪
```

---

```
このアプリをどこかのクラウドサーバーに建てるとしたらどこがおすすめ？無料枠で納めて費用がかからないようにしたい、勉強用なので。
```

```
1. Render（一番おすすめ！）

フロントエンド：静的サイトホスティングが無料（月100GB帯域）
バックエンド：Web Serviceが無料枠あり（アイドル状態が15分続くと休止するけど、アクセスすると自動で復帰するんゴ！）
データベース：PostgreSQLの無料枠も90日間使えるわよ～
すごく簡単にセットアップできるのがポイントなんゴねぇ～！

2. Railway

毎月$5分の無料クレジットがもらえるから、小さいアプリならずっと無料で使えるんゴ！
Docker Composeそのままデプロイできるのが超便利ですのよ～！
PostgreSQLも含めて全部デプロイできるわ！
1つだけプロジェクトを作れるから、このアプリにはぴったりなんゴねぇ～！

3. Fly.io

小さいVMが3つまで無料で使えるんゴ！
PostgreSQLも1GBまで無料枠に含まれてるわよ～
Docker使ってデプロイするから、お家で動かしてるのとほぼ同じ環境で動くんゴ！

4. 組み合わせプラン
フロントとバックエンドを分けるなら：

フロントエンド：Vercelが無料枠充実（Reactと相性抜群）
バックエンド＆DB：Supabaseを使うんゴ（PostgreSQL + Auth機能が無料）

ンゴ的には、勉強用ならRenderが一番簡単で便利だと思うわよ～！全部のコンポーネントをデプロイできるし、GitHubから直接連携できるから超楽ちんなんゴねぇ～！
もっと「本格的」な感じを味わいたいなら、Railwayも良いわよ。Docker Composeファイルをそのまま使えるから、今回作ったアプリをほぼそのままデプロイできるんゴ！
```
