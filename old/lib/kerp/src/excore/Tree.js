

/**
* 树形结构的数据处理类。
*/
define('Tree', function (require, exports, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Mapper = MiniQuery.require('Mapper');

    var $Object = $.Object;   // require('Object');
    var $Array = $.Array;   // require('Array');
    var $String = $.String; // require('String');

    var mapper = new Mapper();
    var guidKey = Mapper.getGuidKey();


    


    /**
    * 用深度优先的遍历方式把树形结构的数据线性化成一个一维的数组。
    * @param {Object|Array} tree 树形结构的数据对象或其数组。
    * @param {string} key 子节点数组对应的 key。
    * @param {function} [fn] 递归迭代处理每个节点时的回调函数。
    *   该回调函数会收到两个参数：当前节点和当前节点的子节点数组（如果没有，则为 null）。
    * @return {Array} 返回一个线性化后的一维数组。  
    */
    function linearize(tree, key, fn) {

        //重载 linearize([], key) 的情况
        if (tree instanceof Array) {
            var list = $Array.keep(tree, function (item, index) {
                return linearize(item, key, fn); //递归
            });
            return $Array.reduceDimension(list); //降维
        }

        //对单项进行线性化，核心算法
        //linearize({}, key) 的情况

        var items = tree[key];

        if (!items || !items.length) { //叶子节点
            fn && fn(tree);
            return tree;
        }

        var list = $Array.keep(items, function (item, index) {
            return linearize(item, key, fn);
        });

        list = $Array.reduceDimension(list); //降维
        fn && fn(tree, items);

        return [tree].concat(list);

    }


    /**
    * 用深度优先的遍历方式对一棵树的每个节点进行迭代。
    * @param {Object|Array} tree 树形结构的数据对象或其数组。
    * @param {string} key 子节点数组对应的 key。
    * @param {function} [fn] 递归迭代处理每个节点时的回调函数。
    *   该回调函数会收到两个参数：当前节点和当前节点的子节点数组（如果没有，则为 null）。
    */
    function each(tree, key, fn) {

        //重载 each([], key) 的情况
        if (tree instanceof Array) {
            $Array.each(tree, function (item, index) {
                each(item, key, fn); //递归
            });
        }

        //对单项进行线性化，核心算法
        //each({}, key) 的情况

        var items = tree[key];

        if (!items || !items.length) { //叶子节点
            fn && fn(tree);
            return;
        }

        $Array.each(items, function (item, index) {
            each(item, key, fn);
        });

        fn && fn(tree, items);

    }

    /**
    * 判断两个包含节点的数组或两个节点是否一样。
    * @parma {Array|Object} a 第一个节点的数组或单个节点。
    * @parma {Array|Object} b 第二个节点的数组或单个节点。
    * @return {boolean} 返回一个布尔值，该值指示两个数组或节点是否一样。
    */
    function same(a, b) {

        if (a instanceof Array &&
            b instanceof Array) {

            var len = b.length;

            if (a.length != len) {
                return false;
            }

            for (var i = 0; i < len; i++) {

                var itemA = a[i];
                if (!(guidKey in itemA)) {
                    return false;
                }

                var itemB = b[i];
                if (!(guidKey in itemB)) {
                    return false;
                }

                if (itemA[guidKey] != itemB[guidKey]) {
                    return false;
                }
            }

            return true;

        }

        if (!(guidKey in a) || !(guidKey in b)) {
            return false;
        }

        return a[guidKey] == b[guidKey];
    }




    
    /**
    * 构造器。
    * @param {Object} data 要构建的树形结构的数据对象。
    * @param {Object} config 配置信息对象。
    * @param {string} config.childKey 下级节点的字段名称。
    * @param {string} [config.valueKey] 值的字段名称。 如果需要根据值来检索，请提供该值。
    */
    function Tree(data, config) {

        this[guidKey] = $String.random();

        var id$node = {}; // { id: node }，节点的自身数据
        var id$info = {}; // { id: info }，节点的描述信息

        var meta = {
            'data': data,
            'childKey': config.childKey,
            'valueKey': config.valueKey,
            'id$node': id$node,
            'id$info': id$info,
        };

        mapper.set(this, meta);


        this.each(function (node, items) {

            var id = $String.random(); //分配一个随机 id
            id$node[id] = node;
            node[guidKey] = id;

            var info = id$info[id] = {
                'isLeaf': !items || !items.length || items.length < 0,
                'parentId': null,
                'ids': [], //子节点的 id 列表
            };

            if (items) {
                info.ids = $Array.keep(items, function (item, index) {

                    var itemId = item[guidKey];
                    var info = id$info[itemId];
                    info.parentId = id;

                    return itemId;
                });
            }
            

        });

    }





    //实例方法
    Tree.prototype = {
        constructor: Tree,

        /**
        * 用深度优先的遍历方式把树形结构的数据线性化成一个一维的数组。
        * @param {function} [fn] 递归迭代处理每个节点时的回调函数。
        *   该回调函数会收到两个参数：当前节点和当前节点的子节点数组（如果没有，则为 null）。
        * @return {Array} 返回一个线性化后的一维数组。  
        */
        linearize: function (fn) {

            var meta = mapper.get(this);

            var data = meta.data;
            var childKey = meta.childKey;

            var list = linearize(data, childKey, fn);

            return list;

        },

        /**
        * 用深度优先的遍历方式对一棵树的每个节点进行迭代。
        * @param {function} [fn] 递归迭代处理每个节点时的回调函数。
        *   该回调函数会收到两个参数：当前节点和当前节点的子节点数组（如果没有，则为 null）。
        */
        each: function (fn) {

            var meta = mapper.get(this);

            var data = meta.data;
            var childKey = meta.childKey;

            each(data, childKey, fn);

        },

        /**
        * 判断当前树中是否包含指定的节点。
        * @param {Object} node 要进行判断的节点对象。
        * @return {boolean} 返回一个布尔值，该值指示当前树中是否包含该节点。
        */
        has: function (node) {

            if (!(guidKey in node)) {
                return false;
            }

            var meta = mapper.get(this);
            var id$info = meta.id$info;

            var id = node[guidKey];
            var info = id$info[id];
            return !!info;

        },

        /**
        * 判断指定的节点在当前树中是否为叶子节点。
        * @param {Object} node 要进行判断的节点对象。
        * @return {boolean} 返回一个布尔值，该值指示该节点在当前树中是否为叶子节点。
        */
        isLeaf: function (node) {

            if (!this.has(node)) {
                throw new Error('该节点不属于本树实例对象。');
            }

            var meta = mapper.get(this);
            var id$info = meta.id$info;
            var id = node[guidKey];

            return id$info[id].isLeaf;

        },

        /**
        * 获取指定的节点在当前树中所有的父节点（包括自身）。
        * @param {Object} node 要进行获取的节点对象。
        * @return {Array} 返回一个数组，表示该节点在当前树中所有的父节点（包括自身）。
        */
        getParents: function (node) {
            
            if (!this.has(node)) {
                return null;
            }

            var meta = mapper.get(this);

            var id$node = meta.id$node;
            var id$info = meta.id$info;

            var list = [];

            do {

                list.push(node);

                var id = node[guidKey];
                var info = id$info[id];
                var parentId = info.parentId;
                node = id$node[parentId];

            } while (node);

            list.reverse();

            return list;
        },

        /**
        * 获取指定的节点的所有子节点。
        * @param {Object} node 要进行获取的节点对象。
        * @return {Array} 返回一个子节点数组。
        */
        getChildren: function (node) {

            if (!this.has(node)) {
                return null;
            }

            var meta = mapper.get(this);
            var id$node = meta.id$node;

            var id$info = meta.id$info;
            var id = node[guidKey];
            var info = id$info[id];

            return $Array.keep(info.ids, function (id, index) {
                return id$node[id];
            });

        },

        /**
        * 根据给定的一组值去检索出对应的节点列表。
        * 返回列表的中包括根节点。
        */
        getItemsByValues: function (values) {

            var meta = mapper.get(this);

            var data = meta.data;

            var list = [data];

            if (!values || !values.length) {
                return list;
            }

            var id$node = meta.id$node;
            var id$info = meta.id$info;

            var valueKey = meta.valueKey;

            var node = data;

            var items = $Array.map(values, function (value, index) {

                var id = node[guidKey];
                var info = id$info[id];
                var ids = info.ids; //子节点的 id 列表

                if (!ids || !ids.length) {
                    return; //break
                }

                id = $Array.findItem(ids, function (id, index) {
                    var node = id$node[id];
                    return node[valueKey] === value;

                });

                if (!id) {
                    return; //break
                }

                node = id$node[id];
                return node;


            });

            return list.concat(items);

        },

        /**
        * 根据给定的一组索引去检索出对应的节点列表。
        * 返回列表的中包括根节点。
        */
        getItemsByIndexes: function (indexes) {

            var meta = mapper.get(this);

            var data = meta.data;

            var list = [data];

            if (!indexes || !indexes.length) {
                return list;
            }

            var id$node = meta.id$node;
            var id$info = meta.id$info;

            var node = data;

            var items = $Array.map(indexes, function (index, i) {

                var id = node[guidKey];
                var info = id$info[id];
                var ids = info.ids; //子节点的 id 列表

                if (!ids || !ids.length) {
                    return; //break
                }

                id = ids[index];

                if (!id) {
                    return; //break
                }

                node = id$node[id];
                return node;


            });

            return list.concat(items);

        },

        /**
        * 销毁当前实例。
        */
        destroy: function () {
            mapper.remove(this);
        },

        
    };


    //静态方法
    return $Object.extend(Tree, {
        linearize: linearize,
        each: each,
        same: same,
    });

});
