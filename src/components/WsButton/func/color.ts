export const titleColorClassName = (name:string|undefined) => {
    let colorType = '';
    switch (name) {
        case '编辑':
            colorType = 'primary';
            break;
        case '删除':
            colorType = 'danger';
            break;
        case '添加':
            colorType = 'white';
            break;
        default:
            colorType = 'white';
    }
    return colorType;
};