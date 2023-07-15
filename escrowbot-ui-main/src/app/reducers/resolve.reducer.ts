import { PendingOrders } from './../interfaces';
import { Action } from '@ngrx/store';

export const ADD_PENDING_ORDER = 'ADD_PENDING_ORDER';

export function addPendingOrderReducer(state: PendingOrders[] = [], action: any) {
  switch (action.type) {
    case ADD_PENDING_ORDER:
        return [...state, action.payload];
    default:
        return state;
    }
}