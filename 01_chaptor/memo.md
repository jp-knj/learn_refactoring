# メモ
execute statement.ts
```shell
$ node --loader ts-node/esm --experimental-json-modules 01_chaptor/before/statement.ts
```

## リファクタリングのヒント
- 関数の抽出
- 変数のインライン化
- 関数宣言の変更
- 問い合わせによる一時変数の置き換え
- ループの分離
- ステートメントのスライド
- ポリモーフィズムによる条件記述の置き換え
- フェーズの分離