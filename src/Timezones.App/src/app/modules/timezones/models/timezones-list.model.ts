import { TimezoneListItemModel } from './timezone-list-item.model';

export interface TimezonesListModel {
  items: TimezoneListItemModel[];
  pageIndex: number;
  pageSize: number;
  totalItemsCount: number;
}
