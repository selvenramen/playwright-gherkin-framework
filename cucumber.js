module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['steps/**/*.ts'],
    format: ['progress'],
    formatOptions: { snippetInterface: 'async-await' },
    timeout: 60000
  }
};
