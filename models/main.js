const mainDatabase = (function () {
  /**
   * JSON database for main data
   * @type { [keyString]: [valueString] }
  */
  let _localDatabase = {};

  /**
   * JSON database for main data
   * @type { keyString: { count: number, latest: number } }
  */
  let _historyDatabase = {}; // History database to track activity of database

  // Count of total incoming request
  let _totalRequestCount = 0;
  // Maximum rows count
  const _maximumRowsCount = 4;
  // Default value
  const _defaultValue = "test";

  /**
   * @dev Log database history
   * @param string key : database key
   * @return void
  */
  const _logHistory = (key) => {
    _totalRequestCount++;
    if (!_historyDatabase.hasOwnProperty(key)) {
      _historyDatabase[key] = { count: 0, latest: 0 };
    }
    _historyDatabase[key]['count'] = _historyDatabase[key]['count'] + 1;
    _historyDatabase[key]['latest'] = _totalRequestCount;

  }

  /**
   * @dev Get or create a Key/Value pair in database
   *      Delete the least used Key or oldest Key if rows over the limit
   * @param string key : database key
   * @return string value
  */
  const _getOrCreate = (key) => {
    _logHistory(key);

    // Create in case of not exists
    if (!_localDatabase.hasOwnProperty(key)) {
      const localDatabaseKeys = Object.keys(_localDatabase);

      /**
       * Delete old one if total count over the limit
       * 1. Loop database
       * 2. Track least used Key
       * 3. Check last used time if used count is same
       * 4. Delete
      */
      if (localDatabaseKeys.length === _maximumRowsCount) {
        let delKey = null;
        let count = Infinity;

        localDatabaseKeys.forEach(key => { // loop
          let tmpCount = _historyDatabase[key]['count'];
          if (tmpCount < count) { // check count
            count = tmpCount;
            delKey = key;
          } else if ( // check last used time
            tmpCount === count
            && _historyDatabase[key]['latest'] < _historyDatabase[delKey]['latest']
          ) {
            delKey = key;
          }
        });
        delete _localDatabase[delKey];
        delete _historyDatabase[delKey];
      }
      _localDatabase[key] = _defaultValue;
    }

    return _localDatabase[key];
  }


  /**
   * @dev list all database
   * @return JSON
  */
  const _getList = () => {
    return _localDatabase;
  }

  return {
    getOrCreate: _getOrCreate,
    getList: _getList,
  };
})();

module.exports = mainDatabase;