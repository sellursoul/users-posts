import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class VirtualScrollComponent<T> {
  public readonly items = input.required<T[]>();
  public readonly itemHeightEstimator = input<(item: T) => number>(() => 100);

  public readonly itemSelect = output<T>();

  public readonly itemTemplate = contentChild(TemplateRef<any>);
  public readonly scrollerRef = viewChild<ElementRef<HTMLDivElement>>('scroller');

  private readonly cache = new Map<number, number>();

  protected readonly scrollTop = signal(0);
  protected readonly viewportHeight = signal(0);
  protected readonly focusedIndex = signal<number | null>(null);

  protected readonly totalHeight = computed(() => {
    const items = this.items();
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total += this.cache.get(i) ?? this.itemHeightEstimator()(items[i]);
    }
    return total;
  });

  protected readonly startIndex = computed(() => {
    const scrollY = this.scrollTop();
    const items = this.items();
    let offset = 0;
    for (let i = 0; i < items.length; i++) {
      const h = this.cache.get(i) ?? this.itemHeightEstimator()(items[i]);
      if (offset + h > scrollY) return i;
      offset += h;
    }
    return 0;
  });

  protected readonly visibleItems = computed(() => {
    const items = this.items();
    const start = this.startIndex();
    const viewH = this.viewportHeight();
    let visible: T[] = [];
    let total = 0;
    for (let i = start; i < items.length && total < viewH * 1.5; i++) {
      visible.push(items[i]);
      total += this.cache.get(i) ?? this.itemHeightEstimator()(items[i]);
    }
    return visible;
  });

  protected readonly itemOffsets = computed(() => {
    const offsets: number[] = [];
    let offset = 0;
    const items = this.items();
    let i = 0;

    for (i = 0; i < this.startIndex(); i++) {
      offset += this.cache.get(i) ?? this.itemHeightEstimator()(items[i]);
    }

    const visible = this.visibleItems();
    for (let j = 0; j < visible.length; j++) {
      offsets.push(offset);
      offset += this.cache.get(i) ?? this.itemHeightEstimator()(visible[j]);
      i++;
    }
    return offsets;
  });

  constructor() {
    afterNextRender(() => {
      const scroller = this.scrollerRef();
      if (scroller) this.viewportHeight.set(scroller.nativeElement.clientHeight);

      if (this.items().length > 0 && this.focusedIndex() === null) {
        this.focusedIndex.set(0);
      }
    });
  }

  protected onScroll(): void {
    const scroller = this.scrollerRef();
    if (scroller) {
      this.scrollTop.set(scroller.nativeElement.scrollTop);
    }
  }

  protected trackByFn = (_: number, item: T) => (item as any).id ?? item;

  protected onKeydown(event: KeyboardEvent): void {
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }

    const idx = this.focusedIndex();
    if (idx == null) return;

    if (event.key === 'ArrowDown' && idx < this.items().length - 1) {
      this.focusedIndex.set(idx + 1);
      this.scrollToIndex(idx + 1);
    } else if (event.key === 'ArrowUp' && idx > 0) {
      this.focusedIndex.set(idx - 1);
      this.scrollToIndex(idx - 1);
    } else if (event.key === 'Enter') {
      const item = this.items()[idx];
      this.itemSelect.emit(item);
    }
  }

  private scrollToIndex(index: number): void {
    const scroller = this.scrollerRef();
    if (!scroller) return;

    let top = 0;
    for (let i = 0; i < index; i++) {
      top += this.cache.get(i) ?? this.itemHeightEstimator()(this.items()[i]);
    }
    scroller.nativeElement.scrollTop = top;
  }
}
