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
          entity: 'wrong_entity',
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
