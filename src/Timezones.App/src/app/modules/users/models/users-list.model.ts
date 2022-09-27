import { UserModel } from './user.model';

export interface UsersListModel {
  items: UserModel[];
  pageIndex: number;
  pageSize: number;
  totalItemsCount: number;
}
