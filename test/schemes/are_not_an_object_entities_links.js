module.exports = {
  entities: {
    is_not_an_object_entity: 'is not an object entity',
    is_not_an_object_entity2: 'is not an object entity',
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
          collection: 'tariffs',
          entity: 'tariffPomidorka',
          path: {_id: '#/tariffId'}
        }
      ]
    }
  }
};
