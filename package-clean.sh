#!/bin/sh

rm -rfv \
  template/docker/mysql/initdb.d/*.sql\
  template/node_modules\
  template/public/wp/wp-admin\
  template/public/wp/wp-content\
  template/public/wp/wp-includes\
  template/public/wp/index.php\
  template/public/wp/license.txt\
  template/public/wp/readme.html\
  template/public/wp/wp-*.php\
  template/public/wp/xmlrpc.php\
  template/vendor\
  template/.env\
  template/package-lock.json
