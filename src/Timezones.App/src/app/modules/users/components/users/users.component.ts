import { 
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, fromEvent, Subscription } from 'rxjs';

import { UserModel } from '../../models/user.model';
import { ListQueryInfoModel } from './../../../../core/models/list-query-info.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements AfterViewInit, OnDestroy {
  @Input() users: UserModel[];
  @Input() paginationInfo: ListQueryInfoModel;
  @Input() filterValue: string;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() page = new EventEmitter<PageEvent>();
  @Output() filter = new EventEmitter<string>();

  @ViewChild('input') filterInput: ElementRef;

  public displayedColumns = ['email', 'roleName', 'actions'];

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

  public onEdit(item: UserModel): void {
    this.edit.emit(item.id);
  }

  public onDelete(item: UserModel): void {
    this.delete.emit(item.id);
  }

  public onPage(event: PageEvent): void {
    this.page.emit(event);
  }
}
