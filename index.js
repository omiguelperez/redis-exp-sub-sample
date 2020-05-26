const redis = require('redis')
const faker = require('faker')
const json = require('json-beautify')

const CONF = { db: 3 }

let pub, sub

//.: Activate "notify-keyspace-events" for expired type events
pub = redis.createClient(CONF)
pub.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], SubscribeExpired)

//.: Subscribe to the "notify-keyspace-events" channel used for expired type events
function SubscribeExpired(e, r) {
  sub = redis.createClient(CONF)

  const expired_subKey = '__keyevent@' + CONF.db + '__:expired'

  sub.subscribe(expired_subKey, () => {
    console.log(' [i] Subscribed to "' + expired_subKey + '" event channel : ' + r)

    sub.on('message', onKeyExpiration)

    testKeyExpiration()
  })
}

function onKeyExpiration(channel, msg) {
  console.log('[channel]', channel)
  console.log('[expired]', msg)

  if (!msg.endsWith('-data')) {
    pub.get('testing-data', (err, payload) => {
      console.log('[testing-data]', json(JSON.parse(payload), null, 2))
    })
  }
}

//.: For example (create a key & set to expire in 10 seconds)
function testKeyExpiration() {
  const keyExp = 5

  pub.set('testing', 'redis notify-keyspace-events : expired')
  pub.expire('testing', keyExp)

  pub.set('testing-data', JSON.stringify({
    uuid: faker.random.uuid(),
    token: faker.internet.ipv6(),
    title: faker.lorem.words(),
    body: faker.lorem.text(),
  }))
  pub.expire('testing-data', keyExp * 2)
}
