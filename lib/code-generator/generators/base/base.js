import ejs from '@node/ejs';

class Base{
    static async render(template, params){
        return typeof template === 'function' ? template(params) : ejs.render(template, params);
    }
}

export default Base;
