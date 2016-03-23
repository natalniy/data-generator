module.exports = {
  entities: {
    is_not_an_object_entity: 'is not an object entity',
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
    }
  }
};
