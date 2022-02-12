import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';

export enum ToastType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastNotificationComponent implements OnInit {
  @Input() text: string = 'An error occurred, please try again later.';
  @Input() type: ToastType = ToastType.ERROR;
  @Input() fixedStyle: boolean;
  @Input() hideTimeout: number;
  @Output() onClose = new EventEmitter<void>();
  public show: boolean = true;
  public hide: boolean;
  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.hideTimeout) {
      setTimeout(() => this.close(), this.hideTimeout);
    }
  }

  close() {
    this.cdr.markForCheck();
    this.hide = true;
    setTimeout(() => {
      this.show = false;
      this.onClose.emit();
    }, 300);
  }
}
