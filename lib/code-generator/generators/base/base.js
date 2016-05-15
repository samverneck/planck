import ejs from 'ejs';

class Base{
    static async render(template, params){
        return await Promise.resolve(typeof template === 'function' ? template(params) : ejs.render(template, params));
    }
}

export default Base;
