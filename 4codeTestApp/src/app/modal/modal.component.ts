import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ComponentRef,
  Type,
  ViewContainerRef,
  OnDestroy,
  AfterViewChecked,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnDestroy, AfterViewChecked {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Input() componentType!: Type<any>;
  @Input() componentData: any;

  @ViewChild('modalBody', { read: ViewContainerRef })
  modalBody!: ViewContainerRef;
  private componentRef!: ComponentRef<any>;
  private componentLoaded = false;

  ngAfterViewChecked() {
    if (this.isOpen && !this.componentLoaded) {
      this.loadComponent();
    } else if (!this.isOpen && this.componentLoaded) {
      this.clearComponent();
    }
  }

  ngOnDestroy() {
    this.clearComponent();
  }

  loadComponent() {
    if (this.modalBody) {
      this.modalBody.clear();
      this.componentRef = this.modalBody.createComponent(this.componentType, {
        injector: this.modalBody.injector,
      });
      if (this.componentData) {
        this.componentRef.instance['componentData'] = this.componentData;
      }

      this.componentRef.instance['closeModal'].subscribe(() => this.onClose());

      this.componentLoaded = true;
    }
  }

  clearComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentLoaded = false;
    }
  }

  onClose() {
    this.isOpen = false;
    this.clearComponent();
    this.close.emit();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }
}
