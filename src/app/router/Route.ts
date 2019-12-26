import { NextFunction } from "express";

export interface Route {
    path: string
    method: string
    action: Function
    middleware?: NextFunction
}