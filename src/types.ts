export interface Build {
    id: string,
    buildName: string,
    buildVersion: string,
}

export enum ComparisonState {
    MODIFIED, ADDED, DELETED, UNCHANGED
}

export interface ResponseObject<T> {
    data: T,
    message: string,
    status: number
}

export interface ResultObject extends ClassFile {
    methodNodeMetrics?: MethodMetrics[],
    fieldNodeMetrics?: FieldMetrics[],
    annotationMetrics?: Annotations[],
}

export interface ClassFile {
    id: string,
    name: string,
    hash: string,
    filePath: string,
    nodeType: string,
    access: number,
    buildVersion: string
}

export interface MethodMetrics {
    id: string,
    name: string,
    hash: string,
    access: number,
    descriptor: string,
    maxLocals: number,
    maxStack: number,
    signature: string | null,
    classFile: string,
    state: ComparisonState
}

export interface FieldMetrics {
    id: string,
    name: string,
    hash: string,
    descriptor: string,
    classFile: string,
    state: ComparisonState
}

export interface Annotations {
    id: string,
    name: string,
    isVisible: boolean,
}

export interface ImpactedFiles {
    id: string,
    name: string,
    hash: string
}
