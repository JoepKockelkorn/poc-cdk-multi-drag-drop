import { SelectionModel } from '@angular/cdk/collections';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragStart,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';

type Selected<T> = { indexes: number[]; values: T[] };

@Component({
  selector: 'multi-drag',
  styleUrls: ['./multi-drag.component.css'],
  template: `
    <div
      class="list"
      [id]="dropListId"
      cdkDropList
      (cdkDropListDropped)="onDrop($event)"
      [cdkDropListData]="data"
      [cdkDropListConnectedTo]="connectedTo"
    >
      <div
        class="item"
        *ngFor="let item of data; let i = index"
        cdkDrag
        (cdkDragStarted)="onDragStart($event, i)"
        (cdkDragEnded)="selectionModel.clear()"
        [class.selected]="selectionModel.isSelected(i)"
        (click)="selectionModel.toggle(i)"
      >
        {{ item }}
        <div *cdkDragPreview class="preview">
          {{ selectionModel.selected.length }}
        </div>
      </div>
    </div>
    <!-- <pre><code>{{ selectionModel.selected | json }}</code></pre> -->
  `,
})
export class MultiDragComponent<T> {
  @Input() data!: T[];
  @Input() connectedTo!: string;
  @Input() dropListId!: string;

  readonly selectionModel = new SelectionModel<number>(true, []);

  @ViewChild(CdkDropList) dropList!: CdkDropList;

  constructor(private readonly elementRef: ElementRef) {}

  onDragStart(event: CdkDragStart<Selected<T>>, index: number) {
    if (!this.selectionModel.isSelected(index)) {
      this.selectionModel.clear();
      this.selectionModel.select(index);
    }
    const selectedIndexes = [...this.selectionModel.selected].sort();
    event.source.data = {
      indexes: selectedIndexes,
      values: [...selectedIndexes.map((i) => this.data[i])],
    };
  }

  onDrop(event: CdkDragDrop<T[], T[], Selected<T>>) {
    if (
      !event.isPointerOverContainer ||
      event.previousContainer === event.container
    ) {
      return;
    }

    pullAt(event.previousContainer.data, event.item.data.indexes);
    event.container.data.splice(
      event.currentIndex,
      0,
      ...event.item.data.values
    );
  }

  @HostListener('document:click', ['$event'])
  private clickout(event: MouseEvent) {
    if (
      this.selectionModel.hasValue() &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.selectionModel.clear();
    }
  }
}

const pullAt = (arr: any[], idxs: number[]) =>
  idxs
    .reverse()
    .map((idx) => arr.splice(idx, 1)[0])
    .reverse();
