#Модуль для генерации тестовых данных для MongoDB

Модуль генерирует из описанных схем и сущностей документы, после чего заносит их в MongoDB и возвращает в JSON

## Подключение

в package.json добавить строчку:  
```js
"cat-taxi-data-generator": "git+ssh://git@github.com/cat-corporation/cat-taxi-data-generator.git"
```

в файл с тестами добавить:  
```js
var generate = require('cat-taxi-data-generator');
```

Опционально в директорию test/ добавить файл generator.json  
Данный файл содержит в себе настройки подключения к БД и пути к сущностям и схемам данных.  
Если файл не найден следующие настройки устанавливаются по-умолчанию:  
```js
{
  "schemes": "test/schemes/",
  "entities": "test/entities/",
  "db": {
    "mongo": {
      "host": "localhost",
      "port": 27017,
      "name": "catTaxi"
    }
  }
}
```
## Использование

Для генерации данных требуются:  
- Сущности (entities)  
Файлы JS содержащие генерируемую сущность без поля id, например:  
```js
module.exports = {
  "name": "Cat taxi",
  "localityId": 4,
  "archived": false,
  "created": "2016-01-08 09:50:48",
  "modified": "2016-01-08 09:50:48"
};
```
так же данный файл может содержать функцию, которая возвращает объект:  
```js
module.exports = function() {
  var obj = {
    "name": "Cat taxi",
    "localityId": 4,
    "archived": false,
    "created": "2016-01-08 09:50:48",
    "modified": "2016-01-08 09:50:48"
  };
  return obj;
}
```

- Схемы данных  
Например:  
```js
module.exports = {
  entities: {
    taxiServices: {
      taxiServiceCat: 'taxiServices/taxiService'
    },
    persons: {
      acceptedDriverCat: 'persons/acceptedDriver'
    },
    orders: {
      successfullyEndedOrderCat: 'orders/successfullyEndedOrder'
    },
    tariffs: {
      tariffPomidorka: 'tariffs/econom'
    }
  },
  relations: {
    persons: {
      acceptedDriverCat: [
        {
          collection: 'taxiServices',
          entity: 'taxiServiceCat',
          path: {'_id': '#/driver/taxiServicesInvites/acceptedInvites/$/taxiServiceId'}
        },
        {
          collection: 'tariffs',
          entity: 'tariffPomidorka',
          path: {'_id': '#/driver/tariffs1/0/tariffId'}
        },
        {
          collection: 'tariffs',
          entity: 'tariffPomidorka',
          path: {'_id': '#/driver/tariffs1/0/tariffId1'}
        }
      ]
    },
    orders: {
      successfullyEndedOrderCat: [
        {
          collection: 'taxiServices',
          entity: 'taxiServiceCat',
          path: {'_id': '#/taxiServiceId'}
        },
        {
          collection: 'persons',
          entity: 'acceptedDriverCat',
          path: {'_id': '#/driverId'}
        },
        {
          collection: 'tariffs',
          entity: 'tariffPomidorka',
          path: {_id: '#/tariffId'}
        }
      ]
    },
    tariffs: {
      tariffPomidorka: [
        {
          collection: 'taxiServices',
          entity: 'taxiServiceCat',
          path: {_id: '#/taxiServiceId'}
        }
      ]
    }
  }
};
```
где:  
entities - набор генерируемых сущностей формата  
```js
{
  collection_name: {
    entity_name: 'entity_path'
  }
}
```
entity_path - путь к сущности в папке entities  

relations - набор связей между сущностями, где свойства соответствуют названиям коллекций набора entities, которые,
в свою очередь, содержат массивы устанавливаемых для enity_name связей  

Связь - это объект с формата  
```js
  {
    collection: 'tariffs',
    entity: 'econom',
    path: {_id: '#/tariffId'}
  }
```
где  
- collection - Название привязываемой коллекции  
- entity - Название привязываемой сущности  
- path - Объект с одним свойством, формата что_привязать: куда_привязать (куда_привязать - путь в формате JSON-Schema)  


Пример вызова генератора:  
```js
  generate('successfull_schema', function (err, data) {});
```
successfull_schema - путь к схеме в директории со схемами  
