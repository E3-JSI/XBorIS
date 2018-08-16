class QueryHelper {

    constructor() {

    }

    applyOptions(query, table, opts) {
        let self = this;
        let cond = self._getStandardConditions(table, opts);

        if (cond != null) { query = query.where(cond); }

        if (opts.$order != null) {
            let order = opts.$order;
            query = query.order(table[order.key][order.dir]);
        }

        return cond != null ? query.where(cond) : query;
    }

    _getSingleCondition(table, key, value) {
        let self = this;

        if (key == '$order') return null;

        if (key.startsWith('$')) {
            switch (key) {
            case '$lt': {
                return table[value.key].lt(value.value);
            }
            case '$le': {
                return table[value.key].lte(value.value);
            }
            case '$ge': {
                return table[value.key].gte(value.value);
            }
            case '$gt': {
                return table[value.key].gt(value.value);
            }
            case '$or': {
                let criteria = value;
                let currCond = null;
                for (let criterion of criteria) {
                    let cond = self._getStandardConditions(table, criterion);
                    if (currCond == null) {
                        currCond = cond;
                    } else {
                        currCond = currCond.or(cond);
                    }
                }
                return currCond;
            }
            default: {
                throw new Error('Unknown key: ' + key);
            }
            }
        } else {
            // this is an equals condition
            return value != null ?
                table[key].equals(value) :
                table[key].isNull();
        }
    }

    _getStandardConditions(table, opts) {
        let self = this;

        let keys = Object.keys(opts || {});
        if (keys.length > 0) {
            let firstKey = keys[0];
            let cond = self._getSingleCondition(table, firstKey, opts[firstKey]);//table[firstKey].equals(opts[firstKey]);
            for (let keyN = 1; keyN < keys.length; ++keyN) {
                let key = keys[keyN];
                let value = opts[key];
                let singleCond = self._getSingleCondition(table, key, value);

                if (singleCond != null) {
                    cond = cond.and(singleCond);
                }
            }

            return cond;
        }
        return null;
    }
}

module.exports = exports = new QueryHelper();
