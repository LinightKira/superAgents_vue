import {
    Document,
    Location,
    Setting,
} from '@element-plus/icons-vue'

import  {INavMenu} from '../../models'


export const userMenu = ()=>{
    const menuItems :INavMenu[]= [
        { name: '首页', url: '/home', icon: Document },
        { name: '任务', url: '/tasklist', icon: Location },
        { name: '助理', url: '/assistants', icon: Setting },
        { name: '登录', url: '/login', icon: Setting }
    ]
    return menuItems
}