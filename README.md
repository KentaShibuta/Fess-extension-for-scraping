# Fess-extension-for-scraping
当プログラムは、オープンソースの検索サーバー「Fess」のAPIを利用し、ウェブサーバーに保存されているファイルの全文検索の結果を表示します。

## 動作環境の構築について
ローカルネットワークの同一セグメントに、下記のサーバーとアプリを起動します。
1. Fessサーバー
2. ウェブサーバー
  - Fessサーバーとウェブサーバーは同じホストで構築します。
3. 当node.jsアプリ

### Fessサーバーについて
Fessサーバーの環境構築については、[公式サイト](https://fess.codelibs.org/ja/14.6/install/install.html)を参照ください。
* Fessサーバーの検索対象とするファイルは、`/var/fess`配下に保存ください。
  - 別途用意したスクレイピングプログラムで取得したテキストデータを保存します。
    + スクレイピングプログラムについては、非公開です。ご自身で検索対象としたいすべてファイルを用意ください。
  - ウェブサーバーに保存するファイルは、下記のフォーマットに準拠してください。  
    + 1行目: `スクレイピング元のウェブページのURL]`  
      * `]`より前の文字列をURLとしてい認識するため、URLの最後に`]`を入力ください。
    + 2行目以降: `スクレイピングで取得したテキストデータ`
* `/var/fess`配下に保存したファイルをFessサーバーで検索可能にするには、クロールを実行ください。
* Fessサーバーのクロールの実行については。下記外部サイトの「ローカルファイルのクロール」を参照ください。
  - (外部サイト) CentOS7でFessを使用し、ローカルファイル検索を試す - Qiita
    - [https://qiita.com/asano_yuki/items/60fc7159dae6b929e548#ローカルファイルのクロール](https://qiita.com/asano_yuki/items/60fc7159dae6b929e548#ローカルファイルのクロール)

### ウェブサーバーについて
Fessサーバーの検索対象のファイルを保存したパスへのシンボリックリンクを`/var/www/html/fess`に作成します。
* `ln -s /var/www/html/fess /var/fess`

### 当node.jsアプリについて
[公式サイト](https://nodejs.org/ja/download)からnode.jsの実行環境をインストールください。
次に、下記コマンドを実行し、ライブラリをインストールください。
1. `npm install http-server`
2. `npm install axios`
3. `npm install ejs`
下記コマンドで実行ください。
* `node server.js`  
クライアントでブラウザを開き、`http://node.jsアプリのホストのIPアドレス:8080`
