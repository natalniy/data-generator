var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var root = require('app-root-path');
var mongo = require('mongodb').MongoClient;


// Настройки для генератора по-умолчанию
var defaultSettings = {
  schemes: "test/schemes/",
  entities: "test/entities/",
  db: {
    mongo: {
      host: "localhost",
      port: 27017,
      name: "catTaxi"
    }
  }
};


/**
 * Метод генерации данных
 * @param {String} scheme - Название файла со схемой данных
 * @param {Function} callback
 */
module.exports = function (scheme, callback) {

  var settings;

  // TODO Валидировать настройки
  try {
    settings = JSON.parse(fs.readFileSync(root + '/test/generator.json'));
  } catch (e) {
    settings = defaultSettings;
  }

  var url = 'mongodb://' + settings.db.mongo.host + ':' + settings.db.mongo.port + '/' + settings.db.mongo.name;
  var entitiesFolder = root + '/' + settings.entities;
  var schemeFolder = root + '/' + settings.schemes + scheme;

  mongo.connect(url, function (err, db) {
    if (err) return console.log('Error on connection to db', err);

    var errors = validate(schemeFolder, entitiesFolder);

    if (errors.length > 0) return callback(errors);

    if (entitiesFolder.substr(entitiesFolder - 1, 1) != '/') entitiesFolder += '/';

    schemeFolder = require(schemeFolder);

    var entities = generate(schemeFolder.entities, entitiesFolder);

    bind(entities, schemeFolder.relations, function () {
      insert(db, entities, function (err, data) {
        callback(err, data);
        db.close();
      });
    });

  });

};


/**
 * Метод генерации _id для сущностей
 * @param {Object} entities - Объект со списком сущностей для генерации из схемы
 * @param {String} folder - Путь к директории с сущностями
 * @returns {Object} - Возвращает объект, в котором пути к сущностям заменены сущностями из файлов
 */
function generate(entities, folder) {
  var result = {};

  for (var i in entities) {
    result[i] = {};
    for (var j in entities[i]) {
      var entity = require(folder + entities[i][j]);
      if (typeof entity == 'function') entity = entity();

      result[i][j] = _.cloneDeep(entity);
      result[i][j]._id = new ObjectID();
    }
  }

  return result;
}


/**
 * Метод привязки по связям
 * @param {Object} entities - Сущности с id
 * @param {Object} relations - Связи между сущностями
 * @param {Function} callback
 */
function bind(entities, relations, callback) {
  for (var i in relations) {
    var collection = relations[i];
    for (var j in collection) {
      var entity = collection[j];
      for (var k in entity) {
        var relation = entity[k];
        var key = Object.keys(relation.path)[0];
        var obj = entities[i][j];
        var value = entities[relation.collection][relation.entity][key];
        assign(obj, relation.path[key], value);
      }
    }
  }

  callback();
}


/**
 * Метод присваивания значения полю по пути описанному в строке
 * @param {Object} obj - Объект, к которому будет применено присваивание
 * @param {String} prop - Путь присваивания
 * @param {String} value - Значение, которое будет присваиваться
 */
function assign(obj, prop, value) {
  value = value.toString();
  if (typeof prop === 'string') {
    prop = prop.split('/');
    if (prop[0] == '#') prop.shift();
  }
  if (prop.length > 1) {
    var e = prop.shift();
    if (!obj[e]) {
      obj[e] = {};
    } else {
      if (obj[e] instanceof Array && prop[0] == '$') {
        prop[0] = obj[e].length;
      }
    }
    assign(obj[e], prop, value);
  } else {
    obj[prop[0]] = value;
  }
}


/**
 * Метод занесения данных в БД
 * @param {Object} db - Инстанс подключения к БД
 * @param {Object} obj - Данные для внесения в БД
 * @param {Function} callback
 */
function insert(db, obj, callback) {
  var data = {};
  for (var i in obj) {
    var collection = obj[i];
    data[i] = [];
    for (var j in collection) {
      data[i].push(collection[j]);
    }
  }

  async.forEach(Object.keys(data), function (el, done) {
    db.collection(el).insert(data[el], done);
  }, function (err) {
    callback(err, obj);
  });
}

/**
 * Метод валидации схемы данных
 * @param {Object} scheme - Схема данных
 * @param {String} entitiesFolder - Путь к директории с сущностями
 * @returns {Object}
 */
function validate(scheme, entitiesFolder) {
  if (scheme.substr(scheme.length - 3, 3) != '.js') scheme += '.js';

  // Валидация входных параметров
  if (!fs.existsSync(scheme)) return 'Scheme not found';
  if (!fs.existsSync(entitiesFolder)) return 'Entities folder does not exist';

  scheme = require(scheme);

  if (typeof scheme != 'object') return 'Scheme is not an object';
  if (!('entities' in scheme)) return 'Entities property not found';
  if (!('relations' in scheme)) return 'Relations property not found';

  var errors = [];

  //Валидация списк сущностей в схеме
  if (typeof scheme.entities != 'object') errors.push('Entities property is not an object');
  if (typeof scheme.relations != 'object') errors.push('Relations property is not an object');
  if (errors.length > 0) return errors;

  _.forEach(scheme.entities, function (collection, c) {
    if (typeof collection != 'object') return errors.push('Entities: Entity link ' + c + ' is not an object');

    _.forEach(collection, function (entity, e) {
      if (typeof entity != 'string') return errors.push('Entities: Path to ' + e + ' is not a string');

      var path = entitiesFolder + entity + '.js';

      if (!fs.existsSync(path)) return errors.push('Entities: File ' + entity + ' for entity ' + e + ' does not exist');

      entity = require(path);

      if (typeof entity == 'function') entity = entity();

      if (typeof entity != 'object') return errors.push('Entities: Entity ' + e + ' is not an object');

    });

  });

  if (errors.length > 0) return errors;

  //Валидация связей схемы
  _.forEach(scheme.relations, function (collection, c) {
    if (typeof collection != 'object') return errors.push('Relations: Collection of relations ' + c + ' is not an object');

    _.forEach(collection, function (entity, e) {
      if (!(entity instanceof Array)) return errors.push('Relations: Relations list ' + c + ' > ' + e + ' is not an array');

      entity.forEach(function (relation, i) {
        var path =  c + ' > ' + e + ' > ' + i;

        if (typeof  relation != 'object') return errors.push('Relations: Relation ' + path + ' is not an object');

        if (!('collection' in relation)) errors.push('Relations: Relation ' + path + ' have no \'collection\' property');

        if (!('entity' in relation)) errors.push('Relations: Relation ' + path + ' have no \'entity\' property');

        if (!('path' in relation)) errors.push('Relations: Relation ' + path + ' have  no \'path\' property');

        if (errors.length > 0) return errors;

        if (typeof relation.collection != 'string') errors.push('Relations: Property \'collection\' of ' + path +
        ' is not a string');

        if (typeof relation.entity != 'string') errors.push('Relations: Property \'entity\' of ' + path + ' is not a string');

        if (typeof relation.path != 'object') errors.push('Relations: Property \'path\' of ' +  path + ' is not an object');

        if (errors.length > 0) return errors;

        if (!(relation.collection in scheme.entities)) return errors.push('Relations: Collection ' + relation.collection +
        ' of ' + path + ' not present in entites list');

        if (!(relation.entity in scheme.entities[relation.collection])) return errors.push('Relations: Entity ' +
        relation.entity + ' of ' + path + ' not present in entity`s collection');

        // TODO Добавить валидацию поля path

      });

    });

  });

  return errors;
}
