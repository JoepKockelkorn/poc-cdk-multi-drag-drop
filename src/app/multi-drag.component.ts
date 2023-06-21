import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'multi-drag',
  styleUrls: ['./multi-drag.component.css'],
  template: `
    <div
      class="list"
      cdkDropList
      (cdkDropListDropped)="drop($event)"
      [cdkDropListData]="data"
    >
      <div class="item" *ngFor="let item of data" cdkDrag>{{ item }}</div>
    </div>
  `,
})
export class MultiDragComponent<T> {
  @Input() data!: T[];

  drop(event: CdkDragDrop<T[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
