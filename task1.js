import * as _ from 'lodash';

var sampleData;
var User;

// Load the sampleData using an AJAX request
function loadSampleData() {
    return new Promise(function (resolve, reject) {
        // Simulate AJAX request
        setTimeout(function () {
            sampleData = {
                apps: [
                    { id: 1, title: 'Lorem', published: true, userId: 123 },
                    { id: 2, title: 'Ipsum', published: false, userId: 123 },
                    { id: 3, title: 'Dolor', published: true, userId: 456 },
                    { id: 4, title: 'Sit', published: true, userId: 789 },
                    { id: 5, title: 'Amet', published: false, userId: 123 },
                    { id: 6, title: 'Et', published: true, userId: 123 },
                ],
                organizations: [
                    { id: 1, name: 'Google', suspended: true, userId: 123 },
                    { id: 2, name: 'Apple', suspended: false, userId: 456 },
                    { id: 3, name: 'Fliplet', suspended: false, userId: 123 },
                ],
            };
            resolve();
        }, 1000);
    });
}

// Define the User model
User = function (info) {
    this.info = info;
};

User.prototype.select = function (tableName) {
    this.tableName = tableName;
    return this;
};

User.prototype.attributes = function (attributeList) {
    this.attributeList = attributeList;
    return this;
};

User.prototype.where = function (conditions) {
    this.conditions = conditions;
    return this;
};

User.prototype.order = function (orderBy) {
    this.orderBy = orderBy;
    return this;
};

User.prototype.findAll = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (!sampleData) {
            reject('Sample data not loaded');
        } else {
            var filteredData = _.chain(sampleData[self.tableName])
                .filter(self.conditions)
                .orderBy(self.orderBy)
                .map(function (item) {
                    return _.pick(item, self.attributeList);
                })
                .value();
            resolve(filteredData);
        }
    });
};

User.prototype.findOne = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (!sampleData) {
            reject('Sample data not loaded');
        } else {
            var foundItem = _.chain(sampleData[self.tableName])
                .filter(self.conditions)
                .map(function (item) {
                    return _.pick(item, self.attributeList);
                })
                .head()
                .value();
            resolve(foundItem);
        }
    });
};

// Usage example
loadSampleData().then(function () {
    var user = new User({ id: 123 });
    user
        .select('apps')
        .attributes(['id', 'title'])
        .where({ published: true })
        .order(['title'])
        .findAll()
        .then(function (apps) {
            console.log('apps', apps);
        })
        .catch(function (error) {
            console.log(error);
        });
});

// Usage example
loadSampleData().then(function () {
    var user = new User({ id: 123 });
    user
        .select('organizations')
        .attributes(['id', 'name'])
        .where({ suspended: false })
        .findOne()
        .then(function (organization) {
            // The expected result is for the "organization" object is:
            // { id: 3, name: 'Fliplet' }
            console.log('organization', organization);
        });
});