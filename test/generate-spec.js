var generate = require('../generator');

before(function (done) {
  'db' in global ? done() : require('./support').init(function () {
    done();
  });
});

describe('scheme validation test', function () {

  describe('with valid scheme', function () {

    var errors, result;

    before(function (done) {
      generate('successful', function (err, data) {
        errors = err;
        result = data;

        done();
      });
    });

    it('does not returns an error', function () {
      expect(errors).to.be.empty;
    });

    //TODO Проверять результат на ошибки
    it('returns result', function () {
      expect(result).to.exist;
    });

  });

  describe('with invalid scheme', function () {

    describe('with not an object scheme', function () {

      var result, errors;

      before(function (done) {
        generate('not_an_object', function (err, data) {
          errors = err;
          result = data;

          done();
        });
      });

      it('returns \'Scheme is not an object\' error', function () {
        expect(errors).to.equal('Scheme is not an object');
      });

      it('returns empty result', function () {
        expect(result).to.not.exist;
      });

    });

    describe('with scheme with is not an object entities links and relations links properties', function () {

      var result, errors;

      before(function (done) {
        generate('are_not_an_object_entities_and_relations_properties', function (err, data) {
          errors = err;
          result = data;

          done();
        });
      });

      it('returns \'Entities property is not an object\' and \'Relations property is not an object\' error',
        function () {
          expect(errors).to.eql(['Entities property is not an object', 'Relations property is not an object']);
        }
      );

      it('returns empty result', function () {
        expect(result).to.not.exist;
      });

    });

    describe('with invalid entities property', function () {

      describe('with scheme without entities property', function () {

        var result, errors;

        before(function (done) {
          generate('without_entities', function (err, data) {
            errors = err;
            result = data;

            done();
          });
        });

        it('returns \'Entities property not found\' error', function () {
          expect(errors).to.equal('Entities property not found');
        });

        it('returns empty result', function () {
          expect(result).to.not.exist;
        });

      });

      describe('with scheme with is not an object entities property', function () {

        var result, errors;

        before(function (done) {
          generate('is_not_an_object_entities_property', function (err, data) {
            errors = err;
            result = data;

            done();
          });
        });

        it('returns \'Entities property is not an object\' error', function () {
          expect(errors).to.eql(['Entities property is not an object']);

          it('returns empty result', function () {
            expect(result).to.not.exist;
          });

        });

        describe('with is not an object entity link', function () {

          var result, errors;

          before(function (done) {
            generate('is_not_an_object_entity_link', function (err, data) {
              errors = err;
              result = data;

              done();
            });
          });

          it('returns \'Entities: Entity link is not an object\' error', function () {
            expect(errors).to.eql(['Entities: Entity link is_not_an_object_entity is not an object']);
          });

          it('returns empty result', function () {
            expect(result).to.not.exist;
          });

        });

        describe('with two are not an object entities links', function () {

          var result, errors;

          before(function (done) {
            generate('are_not_an_object_entities_links', function (err, data) {
              errors = err;
              result = data;

              done();
            });
          });

          it('returns \'Entities: Entity link is not an object\' error', function () {
            expect(errors).to.eql(['Entities: Entity link is_not_an_object_entity is not an object',
              'Entities: Entity link is_not_an_object_entity2 is not an object']);
          });

          it('returns empty result', function () {
            expect(result).to.not.exist;
          });

        });

        describe('with is not exist entity file', function () {

          var result, errors;

          before(function (done) {
            generate('not_exists_entity_file', function (err, data) {
              errors = err;
              result = data;

              done();
            });
          });

          it('returns \'Entities: File is not exist\' error', function () {
            expect(errors).to.eql(['Entities: File not_exist_folder/not_exist_file for entity entity does not exist']);
          });

          it('returns empty result', function () {
            expect(result).to.not.exist;
          });

        });

        describe('with is not object entity', function () {

          var result, errors;

          before(function (done) {
            generate('is_not_an_object_entity', function (err, data) {
              errors = err;
              result = data;

              done();
            });
          });

          it('returns \'Entity: Entity is not an object\' error', function () {
            expect(errors).to.eql(['Entities: Entity is_not_an_object_link is not an object']);
          });

          it('returns empty result', function () {
            expect(result).to.not.exist;
          });

        });

        describe('with is not object entity and is not an object entity link', function () {

          var result, errors;

          before(function (done) {
            generate('is_not_an_object_entity_and_is_not_an_object_entity_link', function (err, data) {
              errors = err;
              result = data;

              done();
            });
          });

          it('returns \'Entities: Entity is not an object\' error and \'Entities: Entity link is not an object',
            function () {
              expect(errors).to.eql(['Entities: Entity is_not_an_object_link is not an object',
                'Entities: Entity link is_not_an_object_entity is not an object']);
            }
          );

          it('returns empty result', function () {
            expect(result).to.not.exist;
          });

        });

      });

    });

    describe('with invalid relations property', function () {

      describe('with are not an object relations links property', function () {

        var result, errors;

        before(function (done) {
          generate('is_not_an_object_relations_property', function (err, data) {
            errors = err;
            result = data;

            done();
          });
        });

        it('returns \'Relations property is not an object\' error', function () {
          expect(errors).to.eql(['Relations property is not an object']);
        });

        it('returns empty result', function () {
          expect(result).to.not.exist;
        });

      });

      describe('with collection of entities relations is not an object', function () {

        var result, errors;

        before(function (done) {
          generate('is_not_an_object_collection_of_entities_relations', function (err, data) {
            errors = err;
            result = data;

            done();
          });
        });

        it('returns \'Collection of entities relations is not an object\' error', function () {
          expect(errors).to.eql(['Relations: Collection of relations list_of_entities is not an object']);
        });

        it('returns empty result', function () {
          expect(result).to.not.exist;
        });

      });

      describe('with relations list of collection is not an array', function () {

        var result, errors;

        before(function (done) {
          generate('is_not_an_array_entity_relations_list', function (err, data) {
            errors = err;
            result = data;

            done();
          });
        });

        it('returns \'Relations list of collection is not an array\' error', function () {
          expect(errors).to.eql(['Relations: Relations list collection > relations_list is not an array']);
        });

        it('returns empty result', function () {
          expect(result).to.not.exist;
        });

      });

      describe('with relation of entity of collection is not an object', function () {

        var result, errors;

        before(function (done) {
          generate('is_not_an_object_relation_of_entity_of_collection', function (err, data) {
            errors = err;
            result = data;

            done();
          });
        });

        it('returns \'Relations is not an object\' error', function () {
          expect(errors).to.eql(['Relations: Relation persons > acceptedDriverCat > 0 is not an object']);
        });

        it('returns empty result', function () {
          expect(result).to.not.exist;
        });

      });

      describe('with wrong relation collection name', function () {

        var result, errors;

        before(function (done) {
          generate('relation_collection_is_not_found', function (err, data) {
            errors = err;
            result = data;

            done();
          });
        });

        it('returns \'Relation`s collection not present in entities object\' error', function () {
          expect(errors).to.eql(['Relations: Collection wrong_collection_name of orders > successfullyEnded' +
          'OrderCat > 0 not present in entites list']);
        });

        it('returns empty result', function () {
          expect(result).to.not.exist;
        });

      });

      describe('with wrong relation entity name', function () {

        var result, errors;

        before(function (done) {
          generate('relation_entity_is_not_found', function (err, data) {
            errors = err;
            result = data;

            done();
          });
        });

        it('returns \'Relation`s entity not present in entity`s collection object\' error', function () {
          expect(errors).to.eql(['Relations: Entity wrong_entity of orders > successfullyEndedOrderCat > 0 not present ' +
          'in entity`s collection']);
        });

        it('returns empty result', function () {
          expect(result).to.not.exist;
        });

      });

    });

  });

  describe('with non existing scheme', function () {

    var result, errors;

    before(function (done) {
      generate('not_exist', function (err, data) {
        errors = err;
        result = data;

        done();
      });
    });

    it('returns \'scheme not found\' error', function () {
      expect(errors).to.equal('Scheme not found');
    });

    it('returns empty result', function () {
      expect(result).to.not.exist;
    });

  });

});