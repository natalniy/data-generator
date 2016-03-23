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
    collection: {
      relations_list: 'is not an object'
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
