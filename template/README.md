# プロジェクト名
プロジェクトに合わせて適宜内容を変更してください。

<!------------------------------------->

## 開発環境

### 必須

- [Docker](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/ja/)

### 推奨 (VS Codeの拡張機能)

- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

<!------------------------------------->

## ディレクトリ・ファイル構成

### リポジトリ内の配置

```
├── docker (1)
│   ├── mysql
│   │   └── init.sql
│   └── wordpress
│       └── init.sh
├── public (2)
│   ├── wp
│   ├── .htaccess
│   └── index.php
├── vendor (3)
├── .env (4)
├── composer.json (5)
└── composer.lock (6)
```

### Dockerコンテナ内の配置

```
├── docker (1)
│   ├── mysql
│   │   └── init.sql
│   └── wordpress
│       └── init.sh
└── var
    └── www
         ├── html (2)
         │   ├── wp    
         │   ├── .htaccess
         │   └── index.php
         ├── vendor (3)
         ├── .env (4)
         ├── composer.json (5)
         └── composer.lock (6)
```

### 主なファイル・ディレクトリ

| パス | 説明 |
| - | - |
| `docker/mysql/init.sql` | Dockerコンテナの起動時に実行されるSQLファイル |
| `docker/wordpress/init.sh` | WordPressのインストール用のスクリプト |
| `public` | ウェブサーバのドキュメントルート |
| `public/wp` | WordPressのインストール場所 |
| `vendor` | Composerパッケージのインストール場所 |
| `.env` | 環境変数の設定 |
| `composer.json` | Composerパッケージの設定 |

<!------------------------------------->

## セットアップ (初回のみ)

### 環境変数

`.env` が無い場合は `.env.sample` をコピーして作成します。

| 環境変数 | 値 | 説明 |
| - | - | - |
| WORDPRESS_DEBUG | デバッグの有効化 | `0`: 無効、`1`: 有効 |
| WORDPRESS_LANGUAGE | [サイトの言語](https://make.wordpress.org/polyglots/teams/) | 初期化時に使用 |
| WORDPRESS_TIMEZONE | [サイトのタイムゾーン](https://www.php.net/manual/en/timezones.php) | 初期化時に使用 |
| WORDPRESS_ADMIN_USER | 管理者のユーザー名 | 初期化時に使用 |
| WORDPRESS_ADMIN_PASSWORD | 管理者のパスワード | 初期化時に使用 |
| WORDPRESS_ADMIN_EMAIL | 管理者のメールアドレス | 初期化時に使用 |

### npmパッケージをインストール

```sh
npm install
```

<!------------------------------------->

## WordPressの初期化

### WordPressの構成ファイルを生成

Dockerコンテナの初回起動時に `public/wp` の配下にWordPressに必要なファイルが自動生成されます。

```sh
docker-compose up -d
```

### WordPressをインストール

`public/wp/wp-config.php` が生成された事を確認した後に、
インストール用のスクリプトを実行します。

```sh
docker-compose exec -u www-data wordpress bash /docker/wordpress/init.sh
```

<!------------------------------------->

## 使い方

### Dockerコンテナを起動

```sh
docker-compose up -d
```

| URL | 説明 |
| - | - |
| http://localhost/ | WordPress |
| http://localhost/wp/wp-admin/ | WordPressの管理画面 |
| http://localhost:8080 | phpMyAdmin |
| http://localhost:8025 | MailHog |

### Dockerコンテナに入る

```sh
docker-compose exec -u www-data wordpress bash
```

例）データベースを検索して置換

```sh
wp search-replace https://example.com http://localhost
```

例）データベースをエクスポート

```sh
wp db export /docker/mysql/example.sql
```

Dockerコンテナから出る

```sh
exit
```

### Dockerコンテナのデータベースを保存

```sh
docker-compose exec -u www-data wordpress wp db export /docker/mysql/init.sql
```

### Dockerコンテナを終了

```sh
docker-compose down -v
```

<!------------------------------------->

## Composer

WordPressの他にPHPライブラリが必要な場合に使用します。

### パッケージのインストール

```sh
docker-compose exec -u www-data -w /var/www wordpress composer install
```

### Dockerコンテナに入る

```sh
docker-compose exec -u www-data -w /var/www wordpress bash
```

例) phpdotenvを追加

```sh
composer require vlucas/phpdotenv
```

Dockerコンテナから出る

```sh
exit
```

### WordPressでの利用方法

`public/wp/wp-config.php` で `vendor/autoload.php` を読み込みます。

```php
define('COMPOSER_WORKING_DIR', dirname(dirname(__DIR__)));
require COMPOSER_WORKING_DIR . '/vendor/autoload.php';

// 例）phpdotenvを利用
$dotenv = Dotenv\Dotenv::createImmutable(COMPOSER_WORKING_DIR);
$dotenv->load();
```
