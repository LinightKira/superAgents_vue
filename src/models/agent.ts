export interface IAgent { //定义一个Agent接口
    readonly id?: number; // 只读
    readonly user_id?: number; // 必填
    name: string; // 必填

    description?: string;
    avatar?: string;
    memory_config?: string;
    dataset_config?: string;

    readonly status?: number;
    readonly create_time?: Date; // 只读
    readonly update_time?: Date; // 只读

}

export interface IDispatcher {
    id: number;
    user_id?: number;
    agent_id: number;
    name?: string;
    description?: string;
    is_Start?: boolean;
    dispatch_units?: IDispatchUnit[];
    readonly status?: number;
    readonly create_time?: Date; // 只读
    readonly update_time?: Date; // 只读
}

export interface IDispatchUnit {
    id: number;
    user_id: number;
    dispatcher_id: number;
    agent_unit_id: number;
    settings?: string;
    prompt?: string;
    next_action?: string;
    auto_next?: boolean;
    agent_unit: IAgentUnit;
    readonly status?: number;
    readonly create_time?: Date; // 只读
    readonly update_time?: Date; // 只读
}



export interface IAgentUnit {
    readonly id: number;
    name: string;
    readonly user_id?: number;
    prompt: string;
    tools?: string;
    category?: string;
    llm_config?: string;
    readonly status?: number;
    readonly create_time?: Date; // 只读
    readonly update_time?: Date; // 只读
}
