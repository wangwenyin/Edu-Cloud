/**
 *  //使用示例，data需要有key parentKey属性，其它属性内容没有限制。
    let data=[
        {id:1,parent:0,text:'A'},
        {id:2,parent:4,text:"B"},
        {id:3,parent:7,text:"C"},
        {id:4,parent:1,text:"D"},
        {id:5,parent:0,text:"E"},
        {id:6,parent:5,text:'B'},
        {id:7,parent:4,text:"F"}
    ];
    //简单使用
    let tree = new TreeHelper(data,'id','parent');
    console.log(tree.toTree());
    //带属性名称转换
    data=[
        {id:1,parent:0,text:'A'},
        {id:2,parent:4,text:"B"},
        {id:3,parent:7,text:"C"},
        {id:4,parent:1,text:"D"},
        {id:5,parent:0,text:"E"},
        {id:6,parent:5,text:'B'},
        {id:7,parent:4,text:"F"}
    ];
    let map={"text":"title","id":"id0"};
    let tree1 = new TreeHelper(data,'id','parent',map);
    console.log(tree1.toTree());
 */
export class TreeHelper {
    public data: any;
    public key: string;
    public parentKey: string;
    public map: any;
    public treeParentKey: string;
    public treeKey: string;
    constructor(
        data: any,
        key: string,
        parentKey: string,
        map: any
    ) {
        this.data = data;
        this.key = key;
        this.parentKey = parentKey;
        this.map = map;
        this.treeParentKey = parentKey;   // parentKey要转换成什么属性名称
        this.treeKey = key;           // key要转换成什么属性名称
        if (map) {
            if (map[key]) this.treeKey = map[key];
        }
    }

    /**
     * 转成树
     */
    toTree() {
        const data = this.data;
        const pos = {};
        const tree = [];
        let i = 0;
        let con = true;
        while (data.length !== 0 && con) {
            if (data[i][this.parentKey] === -1 || data[i][this.parentKey] == null || data[i][this.parentKey] === '') {// 根节点
                const _temp = this.copy(data[i]);
                tree.push(_temp);
                pos[data[i][this.key]] = [tree.length - 1];
                data.splice(i, 1);
                i--;
            } else {
                const posArr = pos[data[i][this.parentKey]];
                if (posArr !== undefined) {
                    let obj = tree[posArr[0]];
                    for (let j = 1; j < posArr.length; j++) {
                        obj = obj.children[posArr[j]];
                    }
                    const _temp = this.copy(data[i]);
                    obj.children.push(_temp);
                    pos[data[i][this.key]] = posArr.concat([obj.children.length - 1]);
                    data.splice(i, 1);
                    i--;
                }
            }
            i++;
            if (i > data.length - 1) {
                i = 0;
                // 定义出口
                con = false;
            }
        }
        return tree;
    }
    private copy(item) {
        const _temp = {
            children: []
        };
        _temp[this.treeKey] = item[this.key];
        _temp[this.treeParentKey] = item[this.parentKey];
        for (const _index in item) {
            if (_index !== this.key && _index !== this.parentKey) {
                const _property = item[_index];
                if ((!!this.map) && this.map[_index])
                    _temp[this.map[_index]] = _property;
                else
                    _temp[_index] = _property;
            }
        }
        return _temp;
    }
}
