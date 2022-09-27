import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnDestroy 
} from '@angular/core';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

import { ListQueryInfoModel } from '../../../../core/models/list-query-info.model';
import { TimezoneListItemModel } from '../../models/timezone-list-item.model';

@Component({
  selector: 'app-timezones',
  templateUrl: './timezones.component.html',
  styleUrls: ['./timezones.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimezonesComponent implements AfterViewInit, OnDestroy {
  @Input() timezones: TimezoneListItemModel[];
  @Input() paginationInfo: ListQueryInfoModel;
  @Input() filterValue: string;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() page = new EventEmitter<PageEvent>();
  @Output() filter = new EventEmitter<string>();

  @ViewChild('input') filterInput: ElementRef;

  public displayedColumns = ['name', 'city', 'currentTime', 'offsetToBrowserTime', 'actions'];

  private subscriptions = new Subscription();

  public ngAfterViewInit(): void {
    const onFilterInput = fromEvent(this.filterInput.nativeElement, 'keyup');
    this.subscriptions.add(onFilterInput.pipe(debounceTime(600)).subscribe((event: any) => {
      const filterValue = (event.target as HTMLInputElement).value;
      this.filter.emit(filterValue.trim().toLowerCase());
    }));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onAdd(): void {
    this.add.emit();
  }

  public onEdit(item: TimezoneListItemModel): void {
    this.edit.emit(item.id);
  }

  public onDelete(item: TimezoneListItemModel): void {
    this.delete.emit(item.id);
  }

  public onPage(event: PageEvent): void {
    this.page.emit(event);
  }
}
