KMPublic Download
=================

行政院政府計劃管理資訊網「[知識管理平台][KMPublic]」文件下載工具。該站曾於 2015/11/25 由行政院數位政務委員唐鳳與資管處長的[對談紀錄][Tang-archive]中揭露。

本工具目前支援根據「[施政主題][KMPublic-categories]」的分類自動下載文件及相關附件。

## 使用方式

先將原始碼[打包下載][repo-download]、或是透過 Terminal 在本機 clone 一份：

```sh
git clone https://github.com/zhusee2/kmpublic-download.git
```

接著安裝 Node dependencies：

```sh
cd kmpublic-download
npm install
```

最後執行以下指令，並將 `<categoryId>` 代換成「施政主題」分類頁的 ID：

```sh
node ./index.js <categoryId>
```

例如以「[輔助事務 > 政風 > 陽光法案][KMPublic-cat1005]」來說，`<categoryId>` 就是網址中的 1005，所以請執行：

```sh
node ./index.js 1005
```

所有下載的文件會被放在 `kmpublic-download/downloads` 子資料夾內。

## 安裝 Node

本工具需求 Node > 6.8.1。如果你的電腦上沒有，請先下載安裝。
Mac 使用者可以用 homebrew 安裝：

```sh
brew update
brew install node
```


[KMPublic]: http://117.56.91.94/KMPublic/
[KMPublic-categories]: http://117.56.91.94/KMPublic/listcategory.aspx
[KMPublic-cat1005]: http://117.56.91.94/KMPublic/listcategory.aspx#1005

[Tang-archive]: https://sayit.archive.tw/speech/15895
[repo-download]: https://github.com/zhusee2/kmpublic-download/archive/master.zip
