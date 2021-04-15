
export function showDetailInfoDialog(info, data, isShow) {
    deepCopy(info, data);
    isShow.value = true;
};


export function showTeacherDetailDialog() {
    
}
export function alterPage(currentPage, pageSize, index) {
    return (currentPage - 1) * pageSize + index;
};

export function deepCopy(newobj, oldobj) {
    for (var k in oldobj) {
        // 判断那种数据类型（简单，复杂）
        var item = oldobj[k];
        // 判断是否是数组
        if (item instanceof Array) {
            newobj[k] = [];
            deepCopy(newobj[k], item);
        }
        // 判断是不是对象
        else if (item instanceof Object) {
            newobj[k] = {};
            deepCopy(newobj[k], item);
        }
        // 属于简单类型
        else {
            newobj[k] = item;
        }
    }
};

export function querySearchAsync(queryString, cb, people) {
    console.log(queryString, cb);
    let results = queryString
        ? people.filter(this.createStateFilter(queryString))
        : people;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
        cb(results);
    }, 2000 * Math.random());
};

export function createStateFilter(queryString) {
    return (person) => {
        return (
            person.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
    };
}